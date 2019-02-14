const lodash = require('lodash');

/**
 * 将 schema 编译成挑选函数
 * @param schema {any}
 * @return {function}
 */
function compile(schema) {
  if (schema === true) {
    return v => v;
  }

  if (schema === null) {
    return v => (v === null ? v : undefined);
  }

  if (schema === Boolean) {
    return v => (lodash.isBoolean(v) ? v : undefined);
  }

  if (schema === Number) {
    return v => (lodash.isNumber(v) ? v : undefined);
  }

  if (schema === String) {
    return v => (lodash.isString(v) ? v : undefined);
  }

  if (schema === Array) {
    return v => (lodash.isArray(v) ? v : undefined);
  }

  if (schema === Object) {
    return v => (lodash.isObject(v) ? v : undefined);
  }

  if (lodash.isArray(schema)) {
    return compileArray(schema);
  }

  if (lodash.isObject(schema)) {
    return compileObject(schema);
  }

  throw new Error(`Unknown pick type "${schema}"`);
}

/**
 * @param schema {Array}
 * @return {function}
 */
function compileArray(schema) {
  if (schema.length !== 1) {
    throw new Error(`Array schema must have exact one sub schema, got ${schema.length}`);
  }

  const picker = compile(schema[0]);
  return (array) => {
    if (!lodash.isArray(array)) {
      return undefined;
    }

    const pickArray = [];
    for (let value of array) {
      value = picker(value);
      if (value !== undefined) {
        pickArray.push(value);
      }
    }
    return pickArray;
  };
}

/**
 * @param schema {Object}
 * @return {function}
 */
function compileObject(schema) {
  const pickerTable = {};
  for (const [key, subSchema] of Object.entries(schema)) {
    pickerTable[key] = compile(subSchema);
  }

  return (obj) => {
    if (!lodash.isObject(obj)) {
      return undefined;
    }

    const pickObj = {};
    for (const [key, picker] of Object.entries(pickerTable)) {
      const value = picker(obj[key]);
      if (value !== undefined) {
        pickObj[key] = value;
      }
    }
    return pickObj;
  };
}

module.exports = compile;
