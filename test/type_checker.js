const assert = require('assert');
const typeChecker = require('../type_checker');

let ret;

ret = typeChecker.get('null')(null);
assert(ret === null);

// 'boolean' accept lodash.isBoolean
ret = typeChecker.get('boolean')(true);
assert(ret === true);

ret = typeChecker.get('boolean')(false);
assert(ret === false);

try {
  typeChecker.get('boolean')(null);
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'boolean');
}

try {
  typeChecker.get('boolean')(1);
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'boolean');
}

try {
  typeChecker.get('boolean')('true');
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'boolean');
}

// 'bool' accept som parser
ret = typeChecker.get('bool')(1);
assert(ret === 1);

ret = typeChecker.get('bool')(0);
assert(ret === 0);

ret = typeChecker.get('bool')('1');
assert(ret === true);

ret = typeChecker.get('bool')('false');
assert(ret === false);

// 'string' accept lodash.isString
ret = typeChecker.get('string')(' string data ');
assert(ret === ' string data ');

ret = typeChecker.get('string')(' ');
assert(ret === ' ');

try {
  typeChecker.get('string')(123);
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'string');
}

// 'str' auto trim and accept length>0 after trim
ret = typeChecker.get('str')(' string data ');
assert(ret === 'string data');

try {
  typeChecker.get('str')(' ');
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'str');
}

// 'number' accept lodash.isNumber
ret = typeChecker.get('number')(123.4);
assert(ret === 123.4);

try {
  typeChecker.get('number')('123.4');
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'number');
}

// 'num' auto parser string to number
ret = typeChecker.get('num')('123.4');
assert(ret === 123.4);

// 'integer' accept lodash.isInteger
ret = typeChecker.get('integer')(123);
assert(ret === 123);

try {
  typeChecker.get('integer')(123.4);
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'integer');
}

// 'int' auto parser string to Number
ret = typeChecker.get('int')('123');
assert(ret === 123);

// 'unsigned' accept lodash.isInteger and >= 0
ret = typeChecker.get('unsigned')(0);
assert(ret === 0);

try {
  typeChecker.get('unsigned')(-1);
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'unsigned');
}

// 'uint' unsigned integer
ret = typeChecker.get('uint')('123');
assert(ret === 123);

ret = typeChecker.get('uint')('0');
assert(ret === 0);

// 'array' accept lodash.isArray
ret = typeChecker.get('array')([]);
assert(ret.length === 0);

try {
  typeChecker.get('array')('1,2,3');
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'array');
}

// 'arr' auto parser split by ',' string
ret = typeChecker.get('arr')('1,2,3');
assert(ret.length === 3);

// 'object' accept lodash.isObject
ret = typeChecker.get('object')({ name: 'Tom' });
assert(ret.name === 'Tom');

try {
  typeChecker.get('object')('{"name":"Tome"}');
} catch (e) {
  assert(e instanceof typeChecker.TypeError);
  assert(e.message === 'object');
}

// 'obj' auto parser json to object
ret = typeChecker.get('obj')('{"name":"Tom"}');
assert(ret.name === 'Tom');

// 'any'
ret = typeChecker.get('any')(null);
assert(ret === null);

ret = typeChecker.get('any')(true);
assert(ret === true);

ret = typeChecker.get('any')(123);
assert(ret === 123);

// ...

// buffer
ret = typeChecker.get('buffer')(Buffer.from('0123'));
assert(ret.length === 4);
