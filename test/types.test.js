const lodash = require('lodash');
const { TYPES } = require('../');

let ret, err;

test('error not exist type name', () => {
  try {
    ret = TYPES.notExistTypeName;
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('set duplication name', () => {
  try {
    TYPES.array = TYPES.type.extend(Array.isArray);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('set not function', () => {
  try {
    TYPES.myType = 'myType';
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

// ----------------------------------------------------------------------------
test('null to be null', () => {
  ret = TYPES.null(null);
  expect(ret).toBe(null);
});

test('null not accept "null"', () => {
  try {
    ret = TYPES.null('null');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

// ----------------------------------------------------------------------------
test('boolean to be true', () => {
  ret = TYPES.boolean(true);
  expect(ret).toBe(true);
});

test('boolean to be false', () => {
  ret = TYPES.boolean(false);
  expect(ret).toBe(false);
});

test('boolean to equal Boolean', () => {
  ret = TYPES.boolean(Boolean(1));
  expect(ret).toBe(true);
});

test('boolean to strict equal Boolean ', () => {
  ret = TYPES.boolean(new Boolean(1));
  expect(ret).toStrictEqual(true);
});

test('boolean not accept number', () => {
  try {
    ret = TYPES.boolean(1);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('bool to be true', () => {
  ret = TYPES.bool(true);
  expect(ret).toBe(true);
});

test('bool string true', () => {
  ret = TYPES.bool('TrUe');
  expect(ret).toBe(true);
});

// ----------------------------------------------------------------------------
test('string', () => {
  ret = TYPES.string(' abc ');
  expect(ret).toBe(' abc ');
});

test('string accept empty string', () => {
  ret = TYPES.string('');
  expect(ret).toBe('');
});

test('string to equal String', () => {
  ret = TYPES.string(String(' abc '));
  expect(ret).toBe(' abc ');
});

test('string to strict equal String', () => {
  ret = TYPES.string(new String(' abc '));
  expect(ret).toStrictEqual(' abc ');
});

test('string not accept buffer', () => {
  try {
    ret = TYPES.string(Buffer.from(' abc '));
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('str', () => {
  ret = TYPES.str(' abc ');
  expect(ret).toBe('abc');
});

test('str not accept empty', () => {
  try {
    ret = TYPES.str('');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});
// ----------------------------------------------------------------------------
test('number', () => {
  ret = TYPES.number(3.14);
  expect(ret).toBe(3.14);
});

test('number to equal Number', () => {
  ret = TYPES.number(Number('3.14'));
  expect(ret).toBe(3.14);
});

test('number not accept number string', () => {
  try {
    ret = TYPES.number(NaN);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('number not accept NaN', () => {
  try {
    ret = TYPES.number(NaN);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('number not accept Infinity', () => {
  try {
    ret = TYPES.number(Infinity);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('num', () => {
  ret = TYPES.num('-3.14');
  expect(ret).toBe(-3.14);
});

test('num accept hex string', () => {
  ret = TYPES.num('0xff');
  expect(ret).toBe(255);
});
// ----------------------------------------------------------------------------
test('integer', () => {
  ret = TYPES.integer(123);
  expect(ret).toBe(123);
});

test('integer accept integer able', () => {
  ret = TYPES.integer(123.0);
  expect(ret).toBe(123);
});

test('integer not accept integer string', () => {
  try {
    ret = TYPES.integer('123');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('integer not accept float', () => {
  try {
    ret = TYPES.integer(3.14);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('integer not accept NaN', () => {
  try {
    ret = TYPES.integer(NaN);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('integer not accept Infinity', () => {
  try {
    ret = TYPES.integer(Infinity);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('int', () => {
  ret = TYPES.int('123');
  expect(ret).toBe(123);
});
// ----------------------------------------------------------------------------
test('array', () => {
  ret = TYPES.array([]);
  expect(ret).toStrictEqual([]);
});

test('array to equal Array', () => {
  ret = TYPES.array(Array());
  expect(ret).toStrictEqual([]);
});

test('array not accept array string', () => {
  try {
    ret = TYPES.array('1,2');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('arr', () => {
  ret = TYPES.arr('1,,3,');
  expect(ret).toStrictEqual([ '1', '', '3', '' ]);
});

test('arr not accept json', () => {
  ret = TYPES.arr('[1,2,3]');
  expect(ret).toStrictEqual([ '[1', '2', '3]' ]);
});
// ----------------------------------------------------------------------------
test('object', () => {
  ret = TYPES.object({});
  expect(ret).toStrictEqual({});
});

test('object not accept Object', () => {
  ret = TYPES.object(new Boolean(1));
  expect(ret).toStrictEqual(true);
});

test('object not accept array', () => {
  try {
    ret = TYPES.object([]);
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('object not accept object string', () => {
  try {
    ret = TYPES.object('{}');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('obj', () => {
  ret = TYPES.obj({ name: 'Tom' });
  expect(ret).toStrictEqual({ name: 'Tom' });
});

test('obj accept json', () => {
  ret = TYPES.obj('{"name":"Tom"}');
  expect(ret).toStrictEqual({ name: 'Tom' });
});

test('obj not a json', () => {
  try {
    ret = TYPES.obj('{"name"');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('obj not accept array', () => {
  try {
    ret = TYPES.obj('[1,2,3]');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

// ----------------------------------------------------------------------------
test('buffer', () => {
  ret = TYPES.buffer(Buffer.from('abc'));
  expect(ret instanceof Buffer).toBe(true);
});

// ----------------------------------------------------------------------------
test('mongoId', () => {
  const string = lodash.range(24).map(() => '0123456789abcdefABCDEF'[ lodash.random(0, 21) ]).join('');
  ret = TYPES.mongoId(string);
  expect(ret).toBe(string);
});

test('md5', () => {
  const string = lodash.range(32).map(() => '0123456789abcdefABCDEF'[ lodash.random(0, 21) ]).join('');
  ret = TYPES.md5(string);
  expect(ret).toBe(string);
});

test('sha1', () => {
  const string = lodash.range(40).map(() => '0123456789abcdefABCDEF'[ lodash.random(0, 21) ]).join('');
  ret = TYPES.sha1(string);
  expect(ret).toBe(string);
});

test('sha256', () => {
  const string = lodash.range(96).map(() => '0123456789abcdefABCDEF'[ lodash.random(0, 21) ]).join('');
  ret = TYPES.sha256(string);
  expect(ret).toBe(string);
});

test('sha512', () => {
  const string = lodash.range(128).map(() => '0123456789abcdefABCDEF'[ lodash.random(0, 21) ]).join('');
  ret = TYPES.sha512(string);
  expect(ret).toBe(string);
});

test('base64', () => {
  ret = TYPES.base64('WWVzIQ==');
  expect(ret).toBe('WWVzIQ==');
});

test('json', () => {
  ret = TYPES.json('{"name":"Tom"}');
  expect(ret).toBe('{"name":"Tom"}');
});

test('json accept not object json', () => {
  ret = TYPES.json('0');
  expect(ret).toBe('0');
});

test('hex', () => {
  ret = TYPES.hex('0123456789abcdefABCDEF');
  expect(ret).toBe('0123456789abcdefABCDEF');
});

test('hex not accept 0x prefix', () => {
  try {
    ret = TYPES.hex('0x12');
  } catch (e) { err = e;}
  expect(err instanceof Error).toBe(true);
});

test('ip', () => {
  ret = TYPES.ip('127.0.0.1');
  expect(ret).toBe('127.0.0.1');
});

test('url', () => {
  ret = TYPES.url('http://xxx.com');
  expect(ret).toBe('http://xxx.com');
});

// ----------------------------------------------------------------------------
test('arr of int', () => {
  ret = TYPES.arr.each(TYPES.int)('1,2,3');
  expect(ret).toStrictEqual([ 1, 2, 3 ]);
});

afterEach(() => {
  // console.log(JSON.stringify(ret, null, 2));
  // console.log(err);
  ret = undefined;
  err = undefined;
});
