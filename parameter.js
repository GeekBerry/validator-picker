const lodash = require('lodash');
const validatorLib = require('validator');
const Type = require('./type');

const TYPES = {};
TYPES.any = Type;
TYPES.null = TYPES.any.extend('null', { validator: lodash.isNull });
TYPES.boolean = TYPES.any.extend('boolean', { validator: v => v === 0 | v === 1 | lodash.isBoolean(v) });
TYPES.string = TYPES.any.extend('string', { validator: lodash.isString });
TYPES.number = TYPES.any.extend('number', { validator: lodash.isNumber });
TYPES.integer = TYPES.any.extend('integer', { validator: lodash.isInteger });
TYPES.unsigned = TYPES.integer.extend('unsigned', { validator: v => v >= 0 });
TYPES.array = TYPES.any.extend('array', { validator: lodash.isArray });
TYPES.object = TYPES.any.extend('object', { validator: v => lodash.isObject(v) && !lodash.isArray(v) });
TYPES.buffer = TYPES.any.extend('buffer', { validator: lodash.isBuffer });

TYPES.bool = TYPES.boolean.extend('bit or bool', {
  parse: v => ({ 0: false, 1: true, false: false, true: true })[v.toLowerCase()],
});
TYPES.str = TYPES.string.extend('not empty string', { parse: v => v.trim(), validator: v => v.length > 0 });
TYPES.num = TYPES.number.extend('num str', { parse: Number, validator: v => !lodash.isNaN(v) });
TYPES.int = TYPES.integer.extend('int str', { parse: Number });
TYPES.uint = TYPES.unsigned.extend('uint str', { parse: Number });
TYPES.arr = TYPES.array.extend('split array', { parse: v => v.split(',') });
TYPES.obj = TYPES.object.extend('json object', { parse: JSON.parse });

TYPES.json = TYPES.string.extend('json', { validator: validatorLib.isJson });
TYPES.mongo = TYPES.string.extend('mongo', { validator: validatorLib.isMongoId });
TYPES.uuid = TYPES.string.extend('uuid', { validator: validatorLib.isUUID });
TYPES.md5 = TYPES.string.extend('md5', { validator: validatorLib.isMD5 });
TYPES.base64 = TYPES.string.extend('base64', { validator: validatorLib.isBase64 });
TYPES.ip = TYPES.string.extend('ip address', { validator: validatorLib.isIP });
TYPES.url = TYPES.string.extend('url', { validator: validatorLib.isURL });
TYPES.uri = TYPES.string.extend('uri', { validator: validatorLib.isDataURI });
TYPES.magnet = TYPES.string.extend('magnet', { validator: validatorLib.isMagnetURI });
TYPES.email = TYPES.string.extend('email', { validator: validatorLib.isEmail });

class Entry {
  constructor({
    path,
    type: typeName = 'any',
    'default': defaultValue,
    required = false,
    ...conditionTable
  } = {}) {
    this.path = path;
    this.default = lodash.isFunction(defaultValue) ? defaultValue : () => defaultValue;
    this.required = lodash.isFunction(required) ? required : () => required;

    const typeNames = Array.isArray(typeName) ? typeName : [typeName];
    this.validator = Type.any(typeNames.map(name => {
      const type = TYPES[name];
      if (!type) {
        throw new TypeError(`Can not found type "${name}"`);
      }
      return type;
    }));

    this.conditionTable = lodash.mapValues(conditionTable, (condition, name) => {
      if (lodash.isFunction(condition)) {
        return condition;
      }
      throw new Error(`Condition "${name}" is not a function`);
    });
  }

  pick(field, inData, outData) {
    const fullPath = this.path ? `${this.path}.${field}` : field;

    // 检查已验证过的参数
    let value = lodash.get(outData, fullPath);

    // 检查原始参数
    if (value === undefined) {
      value = lodash.get(inData, fullPath);
    }

    // 检查是否必填
    if (value === undefined && this.required(outData)) {
      throw new Error(`Param "${fullPath}" is required`);
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
      value = this.validator(value);
    } catch (e) {
      throw new Error(`Param "${fullPath}" ${e.message}`);
    }

    // 附加检查条件
    lodash.forEach(this.conditionTable, (condition, name) => {
      if (!condition(value)) {
        throw new Error(`Param "${fullPath}" do not match condition "${name}"`);
      }
    });

    // 写入输出集合
    lodash.set(outData, field, value);
  }
}

function parameter(schema) {
  const entryTable = lodash.mapValues(schema, options => new Entry(options));

  return function (inData) {
    const outData = {};
    lodash.forEach(entryTable, (entry, field) => {
      entry.pick(field, inData, outData);
    });
    return outData;
  };
}

module.exports = parameter;
module.exports.TYPES = TYPES;
