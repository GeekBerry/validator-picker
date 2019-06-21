const { regexPicker } = require('../');

const picker = regexPicker(
  /nation-(\w+)(\.(municipality|state)-(\w+))?(\.city-(\w+))?/,
  [ 'nationName', [ 'stateType', 'stateName' ], [ 'cityName' ] ],
);

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

console.log(picker('nation-china.city-beijing && nation-china.state-hebei', 'g'));
/*
[ { nationName: 'china', cityName: 'beijing' },
  { nationName: 'china', stateType: 'state', stateName: 'hebei' } ]
 */
