const assert = require('assert');
const typePicker = require('../type_picker');

let ret;

// any type picker
ret = typePicker({ data: true })({ data: 'string data' });
assert(ret.data === 'string data');

ret = typePicker({ data: true })({ data: null });
assert(ret.data === null);

ret = typePicker({ data: true })({ data: 12.0 });
assert(ret.data === 12);

// null type picker
ret = typePicker({ data: null })({ data: null });
assert(ret.data === null);

// boolean type picker
ret = typePicker({ data: Boolean })({ data: true });
assert(ret.data === true);

ret = typePicker({ data: Boolean })({ data: false });
assert(ret.data === false);

ret = typePicker({ data: Boolean })({ data: null });
assert(ret.data === undefined);

ret = typePicker({ data: Boolean })({ data: 0 });
assert(ret.data === undefined);

// number type picker
ret = typePicker({ data: Number })({ data: 12.3 });
assert(ret.data === 12.3);

// string type picker
ret = typePicker({ data: String })({ data: 'string data' });
assert(ret.data === 'string data');

// date type picker
ret = typePicker({ data: Date })({ data: new Date('2000-01-01') });
assert(ret.data instanceof Date);

ret = typePicker({ data: Date })({ data: Date.now() });
assert(ret.data === undefined);

// buffer type picker
ret = typePicker({ data: Buffer })({ data: Buffer.from('123') });
assert(ret.data instanceof Buffer);

// array type picker
ret = typePicker({ data: Array })({ data: [1, 2, 3] });
assert(ret.data instanceof Array);

// object type picker
ret = typePicker({ data: Object })({ data: { 1: 100 } });
assert(ret.data instanceof Object);

// recursion array type picker
ret = typePicker({
  data: [{ name: String, age: Number }],
})({
  data: [{ name: 'name1', age: 1 }, { name: 'name2' }, { age: 2 }],
});
assert(ret.data.length === 3);
assert(ret.data[0].name === 'name1');
assert(ret.data[0].age === 1);
assert(ret.data[1].name === 'name2');
assert(ret.data[1].age === undefined);
assert(ret.data[2].name === undefined);
assert(ret.data[2].age === 2);

// recursion object type picker
ret = typePicker({
  data: { name: String, age: Number },
})({
  data: { name: 'name', age: 18 },
});
assert(ret.data.name === 'name');
assert(ret.data.age === 18);

