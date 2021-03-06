const { TYPES, parameter } = require('./');

// extend your own type
TYPES.positive = TYPES.num.extend(v => v > 0);

const ctx = {
  params: {
    id: '00000000-0000-0000-0000-000000000000',
  },
  header: {
    endpoint: 'http://www.google.com',
    callback: null,
  },
  body: {
    user: '{"name":" Tom ","scores":"100,20,30,40"}',
    data: Buffer.from('1234567890'),
  },
};

const picker = parameter({
  id: { path: 'params', type: 'uuid', required: true },
  page: { path: 'query', type: TYPES.int, default: 1 },
  page_size: {
    path: 'query', type: 'positive', default: 10,
    'page size range': v => 1 <= v && v <= 100,
  },
  skip: { default: data => (data.page - 1) * data.page_size },

  endpoint: { path: 'header', type: [ 'url', 'null' ], required: true },
  callback: { path: 'header', type: [ 'url', 'null' ], required: true },

  user: { path: 'body', type: 'obj' },
  'user.scores': { type: TYPES.arr.each(TYPES.int) },
  data: { path: 'body', type: 'buffer' },
});

const ret = picker(ctx);
console.log(ret);

/*
{ id: '00000000-0000-0000-0000-000000000000',
  page: 1,
  page_size: 10,
  skip: 0,
  endpoint: 'http://www.google.com',
  callback: null,
  user: { name: ' Tom ', scores: [ 100, 20, 30, 40 ] },
  data: <Buffer 31 32 33 34 35 36 37 38 39 30> }
*/
