const { typePicker } = require('../');

let ret, err;
let picker;

const user = {
  name: 'Tom',
  age: 22,
  adult: true,
  cash: null,
  birthday: new Date('2000-01-01'),
  file: Buffer.from('62E2'),
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
  parent: {
    mom: 'Anny',
    dad: 'King',
  },
};

test('pick unsupported type', () => {
  try {
    ret = typePicker({
      name: Symbol,
    });
  } catch (e) {
    err = e;
  }
  expect(err instanceof Error).toBe(true);
});

test('pick array to long', () => {
  try {
    ret = typePicker([Number, Boolean]);
  } catch (e) {
    err = e;
  }
  expect(err instanceof Error).toBe(true);
});

test('pick any', () => {
  picker = typePicker({
    name: true,
  });
  ret = picker(user);

  expect(Object.keys(ret).length).toBe(1);
  expect(ret.name).toBe('Tom');
});

test('drop any', () => {
  picker = typePicker({
    name: false,
  });
  ret = picker(user);

  expect(Object.keys(ret).length).toBe(0);
  expect(ret.name).toBe(undefined);
});

test('pick null', () => {
  picker = typePicker(null);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick string', () => {
  picker = typePicker(String);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick boolean', () => {
  picker = typePicker(Boolean);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick number', () => {
  picker = typePicker(Number);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick date', () => {
  picker = typePicker(Date);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick buffer', () => {
  picker = typePicker(Buffer);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick array', () => {
  picker = typePicker(Array);
  ret = picker(user);
  expect(ret).toBe(undefined);
});

test('pick object', () => {
  picker = typePicker(Object);
  ret = picker(user);
  expect(ret).toStrictEqual(user);
});

test('pick object nest', () => {
  picker = typePicker({
    name: String,
    age: Number,
    adult: Boolean,
    birthday: Date,
    cash: null,
    file: Buffer,
  });
  ret = picker(user);

  expect(Object.keys(ret).length).toBe(6);
  expect(ret.name).toBe('Tom');
  expect(ret.age).toBe(22);
  expect(ret.adult).toBe(true);
  expect(ret.birthday).toStrictEqual(new Date('2000-01-01'));
  expect(ret.cash).toBe(null);
  expect(ret.file).toStrictEqual(Buffer.from('62E2'));
});

test('pick container', () => {
  picker = typePicker({
    name: Object,
    age: [Number],
    adult: {},
    education: Array,
  });
  ret = picker(user);

  expect(ret.name).toBe(undefined);
  expect(ret.age).toBe(undefined);
  expect(ret.adult).toBe(undefined);
  expect(Array.isArray(ret.education)).toBe(true);
});

test('pick array nest', () => {
  picker = typePicker({
    education: [
      {
        city: String,
      },
    ],
  });
  ret = picker(user);

  expect(ret.education.length).toBe(2);
});

afterEach(() => {
  // console.log(JSON.stringify(ret, null, 2));
  // console.log(err);
  ret = undefined;
  err = undefined;
});
