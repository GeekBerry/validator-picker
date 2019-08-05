const lodash = require('lodash');
const TYPES = require('./types');

class Entry {
  static _makeTypeValidator(typeOrName) {
    const typeOrNameArray = Array.isArray(typeOrName) ? typeOrName : [typeOrName];
    const typeArray = typeOrNameArray.map(v => (lodash.isString(v) ? TYPES[v] : v));

    return function(value) {
      for (const validator of typeArray) {
        try {
          return validator(value);
        } catch (e) {
        }
      }
      throw new Error(typeArray.map(v => v.name).join('|'));
    };
  }

  static _makeConditionChecker(conditionTable = {}) {
    lodash.forEach(conditionTable, (condition, name) => {
      if (!lodash.isFunction(condition)) {
        throw new Error(`Condition "${name}" is not a function`);
      }
    });

    return function(value, outData) {
      lodash.forEach(conditionTable, (condition, name) => {
        if (!condition(value, outData)) {
          throw new Error(name);
        }
      });
    };
  }

  constructor({
    path,
    type,
    'default': defaultValue,
    required = false,
    ...options
  } = {}) {
    this.path = path;
    this.default = lodash.isFunction(defaultValue) ? defaultValue : () => defaultValue;
    this.required = lodash.isFunction(required) ? required : () => required;
    this.typeValidator = type === undefined ? v => v : Entry._makeTypeValidator(type);
    this.conditionChecker = Entry._makeConditionChecker(options);
  }

  pick(field, inData, outData) {
    // 不能使用数组形式的 fullPath
    const fullPath = this.path ? `${this.path}.${field}` : field;

    // 检查已验证过的参数
    let value = lodash.get(outData, fullPath);

    // 检查原始参数
    if (value === undefined) {
      value = lodash.get(inData, fullPath);
    }

    // 检查是否必填
    if (value === undefined && this.required(outData)) {
      throw new Error(`"${fullPath}" is required`);
    }

    // 获取默认值
    if (value === undefined) {
      value = this.default(outData);
    }

    // 没有默认值将直接返回
    if (value === undefined) {
      return;
    }

    // 检查格式
    try {
      value = this.typeValidator(value);
    } catch (e) {
      throw new Error(`"${fullPath}" do not match type "${e.message}"`);
    }

    // 附加检查条件
    try {
      this.conditionChecker(value, outData);
    } catch (e) {
      throw new Error(`"${fullPath}" do not match condition "${e.message}"`);
    }

    // 写入输出集合
    lodash.set(outData, field, value);
  }
}

function parameter(schema) {
  const entryTable = lodash.mapValues(schema, options => new Entry(options));

  return function parameter(inObj) {
    const outObj = {};
    lodash.forEach(entryTable, (entry, field) => {
      entry.pick(field, inObj, outObj);
    });
    return outObj;
  };
}

module.exports = parameter;
