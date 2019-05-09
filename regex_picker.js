const lodash = require('lodash');

const SPCIAL_KEY_NAME = '~~SPCIAL_KEY_NAME~~';

function prepend(v) {
  return lodash.isArray(v) ? [SPCIAL_KEY_NAME, v.map(prepend)] : v;
}

/**
 * 正则挑选
 * @param regex {RegExp}
 * @param fields {string[]}
 * @return {function(*, *=): Array}
 */
function regexPicker(regex, fields) {
  const array = lodash.flattenDeep(prepend(fields));

  return function (str, flag = '') {
    const results = [];

    str.replace(
      new RegExp(regex, flag),
      (...args) => {
        let obj = lodash.zipObject(array, args);
        obj[SPCIAL_KEY_NAME] = undefined;
        results.push(lodash.omitBy(obj, lodash.isUndefined));
      },
    );

    return results;
  };
}

module.exports = regexPicker;
