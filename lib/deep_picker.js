const lodash = require('lodash');

function deepPicker(prefix, keyMapPath) {
  // 传入一个 obj 能按照 keyMapPath 进行选取
  function picker(obj) {
    return lodash.mapValues(
      keyMapPath,
      path => (lodash.isFunction(path) ? path(obj) : lodash.get(obj, path)),
    );
  }

  return (data) => {
    if (prefix) {
      data = lodash.get(data, prefix);
    }
    return lodash.isArray(data) ? data.map(picker) : picker(data);
  };
}

module.exports = deepPicker;
