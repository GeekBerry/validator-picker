const { TYPES, parameter } = require('../');

let ret, err;
let picker;

beforeAll(() => {
  picker = parameter({
    id: { type: TYPES.int, required: true },
    page: { path: 'query', type: ['int', 'null'], 'bigger then 0': v => v > 0 },
    limit: { path: 'query', default: 10 },
    title: { path: 'body', required: v => v.id > 10 },
    skip: { path: 'body', default: v => (v.page - 1) * v.limit },
    desc: { path: 'body', 'logger than title': (v, o) => v.length > o.title.length },
  });
});

test('error condition', () => {
  try {
    parameter({
      id: { 'other condition': 'not a function' },
    });
  } catch (e) {
    err = e;
  }

  expect(ret).toBe(undefined);
  expect(err instanceof Error).toBe(true);
});

test('normal', () => {
  ret = picker({
    id: 1,
    query: { page: '1' },
  });

  expect(ret.id).toBe(1);
  expect(ret.page).toBe(1);
  expect(ret.limit).toBe(10);
  expect(ret.skip).toBe(0);
});

test('miss required', () => {
  try {
    ret = picker({
      query: { page: '1' },
    });
  } catch (e) {
    err = e;
  }

  expect(ret).toBe(undefined);
  expect(err instanceof Error).toBe(true);
});

test('error format', () => {
  try {
    ret = picker({
      id: 1,
      query: { page: [] },
    });
  } catch (e) {
    err = e;
  }

  expect(ret).toBe(undefined);
  expect(err instanceof Error).toBe(true);
});

test('error condition', () => {
  try {
    ret = picker({
      id: 1,
      query: { page: 0 },
    });
  } catch (e) {
    err = e;
  }

  expect(ret).toBe(undefined);
  expect(err instanceof Error).toBe(true);
});

test('error complicated condition', () => {
  try {
    ret = picker({
      id: 1,
      body: {
        title: 'title',
        desc: 'x',
      },
    });
  } catch (e) {
    err = e;
  }

  expect(ret).toBe(undefined);
  expect(err instanceof Error).toBe(true);
});

afterEach(() => {
  // console.log(JSON.stringify(ret, null, 2));
  // console.log(err);
  ret = undefined;
  err = undefined;
});
