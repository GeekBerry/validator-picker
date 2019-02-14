const lodash = require('lodash');

// =====================================================================================================================
class TypeCheckerBase {
  constructor() {
    this.table = {};
  }

  names() {
    return Object.keys(this.table);
  }

  /**
   * 获取一个类型检查器
   * @param name {String}
   * @return {function(*=*|Error)}
   */
  get(name) {
    const checker = this.table[name];
    if (!checker) {
      throw new Error(`Can not found type checker "${name}"`);
    }
    return checker;
  }

  /**
   * 设置一种类型
   * @param name {String}
   * @param extend {String} 父类型名称
   * @param parser {function(string=*)} 字符串解析器
   * @param validator {function(*=Boolean)} 验证器
   */
  set(name, { extend = undefined, parser = v => v, validator = () => true } = {}) {
    const extendedChecker = extend === undefined ? v => v : this.get(extend);

    function checker(value) {
      // 如果是字符串, 先解析
      if (lodash.isString(value)) {
        try {
          value = parser(value);
        } catch (e) {
          throw new Error(name);
        }
      }

      try {
        value = extendedChecker(value);
      } catch (e) {
        throw new Error(name);
      }

      if (!validator(value)) {
        throw new Error(name);
      }

      return value;
    }

    this.table[name] = checker;
  }

  /**
   * 将多个类型合并为一个析取检查器
   * @param names {String[]}
   * @return {function(*=*|Error)}
   */
  disjunctive(names) {
    const checkers = names.map(k => this.get(k));
    return function (value) {
      const typeNames = [];
      for (const checker of checkers) {
        try {
          return checker(value);
        } catch (e) {
          typeNames.push(e.message);
        }
      }
      throw new Error(typeNames.join('|'));
    };
  }
}

class TypeChecker extends TypeCheckerBase {
  constructor() {
    super();
    this.set('any');
    this.set('null', { validator: lodash.isNull });
    this.set('boolean', { validator: v => v === 0 | v === 1 | lodash.isBoolean(v) });
    this.set('string', { validator: lodash.isString });
    this.set('number', { validator: lodash.isNumber });
    this.set('integer', { extend: 'number', validator: lodash.isInteger });
    this.set('unsigned', { extend: 'integer', validator: v => v >= 0 });
    this.set('object', { validator: lodash.isObject });
    this.set('json', { parser: JSON.parse });

    // 缩写的类型名称代表能兼容字符串
    this.set('bool', {
      parser: v => ({ 0: false, 1: true, false: false, true: true })[v.toLowerCase()],
      extend: 'boolean',
    });
    this.set('str', { parser: v => v.trim(), extend: 'string', validator: v => v.length > 0 });
    this.set('num', { parser: Number, extend: 'number', validator: v => !lodash.isNaN(v) });
    this.set('int', { parser: Number, extend: 'integer' });
    this.set('uint', { parser: Number, extend: 'unsigned' });
  }
}

module.exports = TypeChecker;

