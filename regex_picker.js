const lodash = require('lodash');

/**
 *
 * @example
 >>> prepend('0')
 "0"

 >>> prepend(['0'])
 ["0",["0"]]

 >>> prepend(['0', '1'])
 ["0~1",["0","1"]]

 >>> prepend([['00', '01'], '1'])
 ["00~01~1",[["00~01",["00","01"]],"1"]]

 >>> prepend([['00', '01'], '1'])
 ["0~10~11~12",["0",["10~11~12",["10","11","12"]]]]

 */
function prepend(v) {
  return lodash.isArray(v) ? [lodash.flattenDeep(v).join('~'), v.map(prepend)] : v;
}

/**
 * 正则挑选
 * @param regex {RegExp}
 * @param fields {string[]}
 * @return {object}
 */
function regexPicker(regex, fields) {
  return function (str) {
    const keys = lodash.flattenDeep(prepend(fields));
    const values = regex.exec(str);

    const ret = {};
    for (const [key, value] of lodash.zip(keys, values)) {
      if (value !== undefined) {
        ret[key] = value;
      }
    }
    return ret;
  };
}

module.exports = regexPicker;
