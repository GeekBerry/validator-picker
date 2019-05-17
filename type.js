class TypeError extends Error {}

class Type {
  /**
   * 解析字符串
   * @param value {string}
   * @return {*}
   */
  static parse(value) {
    return value;
  }

  /**
   * 检查参数是否符合要求, 符合返回 parse 过的值, 不符合抛出错误
   * @param value {*}
   * @param message {string}
   * @return {*}
   */
  static check(value, message = '') {
    if (typeof value === 'string') { // 如果是字符串, 先解析
      try {
        value = this.parse(value);
      } catch (e) {
        throw new TypeError(`type "${this.name}".parse(${value}) failed. "${message || e.message}"`);
      }
    }

    return value;
  }

  /**
   * 扩展当前类类型, 返回派生类
   * @param name {string}
   * @param parse {function}
   * @param validator {function}
   * @return Type
   */
  static extend(name, { parse, validator } = {}) {
    return class extends this {
      static get name() {
        return name;
      }

      static parse(value) {
        return parse ? parse(value) : super.parse(value);
      }

      static check(value, message = '') {
        value = super.check(value, message);

        if (validator && !validator(value)) {
          throw new TypeError(`type "${name}".check(${value}) failed. "${message}"`);
        }

        return value;
      }
    };
  }
}

/**
 * 将多个类型合并为一个析取检查器
 * @param types {Type[]}
 * @return {function}
 */
function any(types) {
  return function (value) {
    const typeNames = [];
    for (const type of types) {
      try {
        return type.check(value);
      } catch (e) {
        typeNames.push(type.name);
      }
    }
    throw new TypeError(`do not match any of (${typeNames.join('|')})`);
  };
}

module.exports = Type;
module.exports.Error = TypeError;
module.exports.any = any;
