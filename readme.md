# Validator And Pickers

## Install
`npm install validator-picker`

## Modules

```
type_checker.js 
parameter.js
deep_picker.js
regex_picker.js
```

## Usage

### 1. parameter

* Types

type      | note
----------|-----------------------------------------------------------------------------
any       | accept any type
boolean   | base on `lodash.isBoolean`.
bool      | extend `boolean`, auto parser "true", "1", "false", "0" ignore case.
string    | base on `lodash.isString`.
str       | extend `string`, auto trim and check length > 0
number    | base on `lodash.isNumber`.
num       | extend `number`, auto parser string to number
integer   | base on `lodash.isInteger`.
int       | extend `integer`, auto parser string to number
unsigned  | extend `integer`, which check value >= 0 
uint      | extend `unsigned`, auto parser string to number
array     | base on `lodash.isArray`.
arr       | extend `array`, auto parser string like '1,2,3'
object    | base on `lodash.isObject`.
obj       | extend `object`, auto parser json string '{"name":"Tom"}'
json      | extend `string`, base on validator.isJson
mongo     | extend `string`, base on validator.isMongoId
uuid      | extend `string`, base on validator.isUUID
md5       | extend `string`, base on validator.isMD5
base64    | extend `string`, base on validator.isBase64
ip        | extend `string`, base on validator.isIP
url       | extend `str`, base on validator.isURL
uri       | extend `str`, base on validator.isDataURI
magnet    | extend `str`, base on validator.isMagnetURI
email     | extend `str`, base on validator.isEmail

* Example data

```javascript
const ctx = {
  params: {
    id: '00000000-0000-0000-0000-000000000000',
  },
  header: {
    endpoint: 'http://www.google.com',
    callback: null,
  },
  body: {
    user: '{"name":" Tom ","locations":[{"city":"BJ","nation":"CHINA"}]}',
    data: Buffer.from('1234567890'),
  },
};
```

* validator and pick

```javascript
// extend your own type
parameter.TYPES.positive = parameter.TYPES.num.extend('positive', { validator: v => v > 0 });

const ret = parameter({
  id: { path: 'params', type: 'uuid', required: true },
  page: { path: 'query', type: 'uint', default: 1 },
  page_size: {
    path: 'query', type: 'positive', default: 10,
    'page size range': v => 1 <= v && v <= 100,
  },
  skip: { default: data => (data.page - 1) * data.page_size },

  endpoint: { path: 'header', type: ['url', 'null'], required: true },
  callback: { path: 'header', type: ['url', 'null'], required: true },

  user: { path: 'body', type: 'obj' },
  name: { path: 'user', type: 'str' },
  'locations[0].city': { path: 'user', type: 'str', required: v => v.user },
  data: { path: 'body', type: 'buffer' },
})(ctx);

console.log(ret)

/*
{ id: '00000000-0000-0000-0000-000000000000',
  page: 1,
  page_size: 10,
  skip: 0,
  endpoint: 'http://www.google.com',
  callback: null,
  user: { name: ' Tom ', locations: [ [Object] ] },
  name: 'Tom',
  locations: [ { city: 'BJ' } ],
  data: <Buffer 31 32 33 34 35 36 37 38 39 30> }
*/
```

[more example](https://github.com/GeekBerry/validator-picker/blob/master/example/parameter.js)

### 2. typePicker

通常用于输出数据前, 对返回值的域范围和类型进行过滤和限定.  
It is usually used to filter and qualify the field scope and type of the return value before output data.

* Types

type    | note
--------|----------------------------------------------------------------------------------
true    | accept any type
null    | accept `null` type only
Boolean | base on `lodash.isBoolean`.
Number  | base on `lodash.isNumber`.
String  | base on `lodash.isString`.
Date    | base on `lodash.isDate`.
Buffer  | base on `lodash.isBuffer` (not include `ArrayBuffer`).
Array   | base on `lodash.isArray`, priority is higher than `Object` (array is object too).
Object  | base on `lodash.isObject`.
[...]   | recursion usage, define a array element type. only support one defined schema.
{...}   | recursion usage

* Example user object

```javascript
const user = {
  name: 'Tom',
  age: 22,
  sex: 'male',
  education: [
    {
      city: 'Shanghai',
      school: 'No.1 high school',
      score: null,
    },
    {
      city: 'Beijing',
      school: 'Beijing University',
      gpa: 100.0,
    },
  ],
  birthday: new Date('2000-01-01'),
  verbose: 'there are some thing do not wang to output.'
};
```

* Sample example

```javascript
const typePicker = require('validator-picker/type_picker');

const samplePicker = typePicker({
  name: String,
  age: Number,
});

console.log(samplePicker(user));
// { name: 'Tom', age: 18 }
```

返回结果的域顺序与定义 `samplePicker` 时相同.  
there returned fields order is same as when `samplePicker` defined.

* Complex example

```javascript
const detailedPicker = typePicker({
  name: String,
  age: Number,
  sex: String,
  birthday: Date,
  education: [
    {
      city: String,
      gpa: Number,
    },
  ],
});

console.log(detailedPicker(user));
/*
{
  "name": "Tom",
  "age": 22,
  "sex": "male",
  "birthday": "2000-01-01T00:00:00.000Z",
  "education": [
    {
      "city": "Shanghai"
    },
    {
      "city": "Beijing",
      "gpa": 100
    }
  ]
}
 */
```

类型不符合定义的域将不会被输出, 如 `score` 为 null 输出时被过滤.  
Fields whose types do not match the definition will not be output, as you see when `score` is null it is not been output. 

[more example](https://github.com/GeekBerry/validator-picker/blob/master/example/type_picker.js)

### 3. deepPicker

用于从将复杂结构的数据中提取除部分信息.  
Used to extract partial information from data in a complex structure.

* Example date

```javascript
const data = {
  body: {
    Country: {
      State: {
        Name: 'HeBei',
        Cities: [
          { Name: 'BaoDing', ParticulateMatter: [10, 200] },
          { Name: 'ShiJiaZhuang', ParticulateMatter: [50, 400] },
        ],
      },
    },
  },
};
```

* use as a function

```javascript
const deepPicker = require('validator-picker/deep_picker');

const picker = deepPicker('body', {
  name: 'Country.State.Name',
  city: deepPicker('Country.State.Cities', {
    name: 'Name',
    pm_2: 'ParticulateMatter[0]',
    pm_10: 'ParticulateMatter[1]',
  }),
});

console.log(picker(data));
/*
{ name: 'HeBei',
  city: 
   [ { name: 'BaoDing', pm_2: 10, pm_10: 200 },
     { name: 'ShiJiaZhuang', pm_2: 50, pm_10: 400 } ] }
 */
```

* use schema to implement the same function

```javascript
const deepPicker = require('validator-picker/deep_picker');

// use '$' field to set the path of rest elements
const picker = deepPicker.compile({
  $: 'body',
  name: 'Country.State.Name',
  city: {
    $: 'Country.State.Cities',
    name: 'Name',
    pm_2: 'ParticulateMatter[0]',
    pm_10: 'ParticulateMatter[1]',
  },
});

console.log(picker(data));
/*
{ name: 'HeBei',
  city: 
   [ { name: 'BaoDing', pm_2: 10, pm_10: 200 },
     { name: 'ShiJiaZhuang', pm_2: 50, pm_10: 400 } ] }
 */
```

[more example](https://github.com/GeekBerry/validator-picker/blob/master/example/deep_picker.js)

### 4. regexPicker

用于更方便的从正则表达式中获取所需的域.  
To make it easier to get the required fields from regular expressions.  

* Example

```javascript
const regexPicker = require('validator-picker/regex_picker');

const picker = regexPicker(
  /nation-(\w+)(\.(municipality|state)-(\w+))?(\.city-(\w+))?/,
  ['nationName', ['stateType', 'stateName'], ['cityName']],
);
```

正则表达式: `/nation-(\w+)(\.(municipality|state)-(\w+))?(\.city-(\w+))?/`  
将由`()`包含的结构简化: `(nationName)((stateType)(stateName))((cityName))`  
写为提取域: `['nationName', ['stateType', 'stateName'], ['cityName']]`

```javascript
console.log(picker('it is not match to regex'));
// []

console.log(picker('nation-china.city-beijing'));
/*
[ { nationName: 'china', cityName: 'beijing' } ]
 */

console.log(picker('nation-china.state-hebei'));
/*
[ { nationName: 'china', stateType: 'state', stateName: 'hebei' } ]
 */

console.log(picker('nation-china.municipality-xinjiang.city-wulumuqi'));
/*
[ { nationName: 'china',
    stateType: 'municipality',
    stateName: 'xinjiang',
    cityName: 'wulumuqi' } ]
 */

console.log(picker('nation-china.city-beijing && nation-china.state-hebei'));
/*
[ { nationName: 'china', cityName: 'beijing' } ]
*/

// 进行全局查找
console.log(picker('nation-china.city-beijing && nation-china.state-hebei', 'g'));
/*
[ { nationName: 'china', cityName: 'beijing' },
  { nationName: 'china', stateType: 'state', stateName: 'hebei' } ]
 */
```

[more example](https://github.com/GeekBerry/validator-picker/blob/master/example/regex_picker.js)
