const regexPicker = require('../regex_picker');

const picker = regexPicker(
  /^nation-(\w+)(\.(municipality|state)-(\w+))?(\.city-(\w+))?/,
  ['nationName', ['stateType', 'stateName'], ['cityName']],
);

console.log(picker('it is not match to regex'));
// {}

console.log(picker('nation-china.city-beijing'));
/*
{ 'nationName~stateType~stateName~city': 'nation-china.city-beijing',
  nationName: 'china',
  cityName: 'beijing' }
 */

console.log(picker('nation-china.state-hebei'));
/*
{ 'nationName~stateType~stateName~cityName': 'nation-china.state-hebei',
  nationName: 'china',
  'stateType~stateName': '.state-hebei',
  stateType: 'state',
  stateName: 'hebei' }
 */

console.log(picker('nation-china.municipality-xinjiang.city-wulumuqi'));
/*
{ 'nationName~stateType~stateName~cityName': 'nation-china.municipality-xinjiang.city-wulumuqi',
  nationName: 'china',
  'stateType~stateName': '.municipality-xinjiang',
  stateType: 'municipality',
  stateName: 'xinjiang',
  cityName: 'wulumuqi' }
 */
