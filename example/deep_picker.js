const { deepPicker } = require('../');

const data = {
  body: {
    Country: {
      State: {
        Name: 'HeBei',
        Cities: [
          { Name: 'BaoDing', ParticulateMatter: [ 10, 200 ] },
          { Name: 'ShiJiaZhuang', ParticulateMatter: [ 50, 400 ] },
        ],
      },
    },
  },
};

const picker = deepPicker('body', {
  name: 'Country.State.Name',
  city: deepPicker('Country.State.Cities', {
    name: 'Name',
    pm2: 'ParticulateMatter[0]',
    pm10: 'ParticulateMatter[1]',
  }),
});

console.log(picker(data));
/*
{ name: 'HeBei',
  city:
   [ { name: 'BaoDing', pm2: 10, pm10: 200 },
     { name: 'ShiJiaZhuang', pm2: 50, pm10: 400 } ] }
 */

const schemaPicker = deepPicker.compile({
  $: 'body',
  name: 'Country.State.Name',
  city: {
    $: 'Country.State.Cities',
    name: 'Name',
    pm_2: 'ParticulateMatter[0]',
    pm_10: 'ParticulateMatter[1]',
  },
});

console.log(schemaPicker(data));
/*
{ name: 'HeBei',
  city:
   [ { name: 'BaoDing', pm2: 10, pm10: 200 },
     { name: 'ShiJiaZhuang', pm2: 50, pm10: 400 } ] }
 */
