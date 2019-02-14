const lodash = require('lodash');
const validatorLib = require('validator');
const typeChecker = require('./type_checker');

// =====================================================================================================================
typeChecker.set('mongo', { parent: 'string', validator: validatorLib.isMongoId });
typeChecker.set('uuid', { parent: 'string', validator: validatorLib.isUUID });
typeChecker.set('md5', { parent: 'string', validator: validatorLib.isMD5 });
typeChecker.set('base64', { parent: 'string', validator: validatorLib.isBase64 });
typeChecker.set('ip', { parent: 'string', validator: validatorLib.isIP });

typeChecker.set('url', { parent: 'trim', validator: validatorLib.isURL });
typeChecker.set('uri', { parent: 'trim', validator: validatorLib.isDataURI });
typeChecker.set('magnet', { parent: 'trim', validator: validatorLib.isMagnetURI });
typeChecker.set('email', { parent: 'trim', validator: validatorLib.isEmail });

// =====================================================================================================================
class Parameter {
  constructor(field, {
    path = undefined,
    type = 'any', // 大小写敏感
    'default': defaulted, // eslint-disable-line quote-props
    required = false,
    ...conditionTable
  } = {}) {
    this.field = field;
    this.fullPath = path ? `${path}.${field}` : field;
    this.default = lodash.isFunction(defaulted) ? defaulted : () => defaulted;
    this.required = lodash.isFunction(required) ? required : () => required;
    this.checker = typeChecker.disjunctive(lodash.isArray(type) ? type : [type]);

    this.conditionTable = lodash.mapValues(conditionTable, (condition, name) => {
      if (lodash.isFunction(condition)) {
        return condition;
      }
      throw new Error(`Condition "${name}" is not a function`);
    });
  }

  pick(inData, outData) {
    // 检查已验证过的参数
    let value = lodash.get(outData, this.fullPath);

    // 检查原始参数
    if (value === undefined) {
      value = lodash.get(inData, this.fullPath);
    }

    // 检查是否必填
    if (value === undefined && this.required(outData)) {
      throw new Error(`Param "${this.fullPath}" is required`);
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
      value = this.checker(value);
    } catch (e) {
      throw new Error(`Param "${this.fullPath}" do not match type "${e.message}"`);
    }

    // 附加检查条件
    lodash.forEach(this.conditionTable, (condition, name) => {
      if (!condition(value)) {
        throw new Error(`Param "${this.fullPath}" do not match condition "${name}"`);
      }
    });

    // 写入输出集合
    lodash.set(outData, this.field, value);
  }
}

// =====================================================================================================================
/**
 * @param schema {Object} {
 *  field:{
 *    path?:String, type?:String, default?:*, required?:*,
 *    <String>?: function(*=Boolean),
 *    ...
 *    }
 *  ...
 *  }
 * @return {function(Object=Object)}
 */
function parameter(schema) {
  // object 键为[a-zA-Z]字符串时遍历能保持插入时顺序
  const parameterSeq = lodash.map(schema, (options, field) => new Parameter(field, options));

  return function (inData) {
    const outData = {};
    parameterSeq.forEach(picker => picker.pick(inData, outData));
    return outData;
  };
}

module.exports = parameter;
module.exports.Types = typeChecker;
