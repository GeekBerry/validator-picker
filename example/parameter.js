const parameter = require('../parameter');

parameter.types.set('positive', { parser: v => v, extend: 'num', validator: v => v > 0 });

let ret;

const param = parameter({
  id: { path: 'params', type: 'uuid', required: true },
  page: { path: 'query', type: 'positive', default: 1 },
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
});

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

ret = param(ctx);
console.log(ret);
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
