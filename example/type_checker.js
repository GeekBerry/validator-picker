const typeChecker = require('../type_checker');

console.log(typeChecker.names);
/*
[ 'any',
  'null',
  'boolean',
  'string',
  'number',
  'integer',
  'unsigned',
  'array',
  'object',
  'bool',
  'str',
  'num',
  'int',
  'uint',
  'arr',
  'obj' ]
 */

// bool:
const boolPicker = typeChecker.get('bool');
console.log(boolPicker(true)); // true
console.log(boolPicker(1)); // 1
console.log(boolPicker('0')); // false
console.log(boolPicker('TrUe')); // true
// boolPicker('false'); // typeChecker.TypeError: 'bool'

// num:
const numPicker = typeChecker.get('num');
console.log(numPicker(123)); // 123
console.log(numPicker('123.4')); // 123
// numPicker('false'); // typeChecker.TypeError: 'num'

// int:
const intPicker = typeChecker.get('int');
console.log(intPicker(123)); // 123
console.log(intPicker('123')); // 123
// intPicker(123.4) // typeChecker.TypeError: 'int'

// uint:
const uintPicker = typeChecker.get('uint');
console.log(uintPicker(0)); // 0
console.log(uintPicker(123)); // 123
console.log(uintPicker('123')); // 123
// uintPicker(-1) // typeChecker.TypeError: 'uint'

// str:
const strPicker = typeChecker.get('str');
console.log(strPicker(' string ')); // 'string'
// strPicker('') // typeChecker.TypeError: 'str'

// arr:
const arrPicker = typeChecker.get('arr');
console.log(arrPicker([1, 2, 3])); // [ 1, 2, 3 ]
console.log(arrPicker('1,2,3')); // [ 1, 2, 3 ]

// obj:
const objPicker = typeChecker.get('obj');
console.log(objPicker({ name: 'Tom' })); // { name: 'Tom' }
console.log(objPicker('{"name":"Tom"}')); // { name: 'Tom' }

// buffer:
const bufferPicker = typeChecker.get('buffer');
console.log(bufferPicker(Buffer.from('0123'))); // <Buffer 30 31 32 33>

// extend you own type
typeChecker.set('custom', { parser: v => v.toUpperCase(), extend: 'string', validator: v => v.startsWith('MY') });
console.log(typeChecker.get('custom')('my data')); // 'MY DATA'
// console.log(typeChecker.get('custom')('his data')); // typeChecker.TypeError: 'custom'
