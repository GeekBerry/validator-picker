const lodash = require('lodash');
const validatorLib = require('validator');

class Type extends Function {
  constructor(name = 'type', validator = v => v) {
    super();

    // use "Type.__call__" directly can decrease call layers
    this.__call__ = validator instanceof Type ? validator.__call__ : validator;

    return new Proxy(this, {
      get(self, key) {
        return key === 'name' ? name : self[ key ];
      },

      apply(self, bind, [ value ]) {
        try {
          return self.__call__(value);
        } catch (e) {
          throw new Error(`${name}(${e.message})`);
        }
      },
    });
  }

  /**
   * append a checker
   * @param checker {function(*):boolean}
   * @return {Type}
   */
  extend(checker) {
    return new Type(
      this.name,
      (value) => {
        value = this.__call__(value); // check parent first

        if (!checker(value)) {
          throw new Error(`${value}`);
        }
        return value;
      },
    );
  }

  /**
   * prepend a validator
   * usually parse a string (by condition) before other type check
   * @param validator {function(any):any}
   * @param condition? {function(*):boolean}
   * @return {Type}
   */
  parse(validator, condition = lodash.isString) {
    return new Type(
      this.name,
      (value) => {
        try {
          if (condition(value)) {
            value = validator(value);
          }
        } catch (e) {
          throw new Error(`${value}`);
        }

        return this.__call__(value);
      },
    );
  }

  /**
   * validate each of value
   * @param validator {function(any):any}
   * @return {Type}
   */
  each(validator) {
    return new Type(
      this.name,
      (value) => {
        value = this.__call__(value);

        lodash.forEach(value, (v, k) => {
          value[ k ] = validator(v);
        });

        return value;
      },
    );
  }
}

//=============================================================================
const type = new Type();

const TYPES = new Proxy(
  { Type, type }, // as a module export
  {
    get(self, name) {
      const type = self[ name ];
      if (!type) {
        throw new Error(`do not have type named "${name}"`);
      }
      return type;
    },

    set(self, name, validator) {
      if (name in self) {
        throw new Error(`already have type named "${name}"`);
      }

      if (!lodash.isFunction(validator)) {
        throw new Error('validator must be function');
      }

      self[ name ] = new Type(name, validator);
    },
  },
);

TYPES.null = type.extend(lodash.isNull);
TYPES.boolean = type.extend(lodash.isBoolean);
TYPES.string = type.extend(lodash.isString);
TYPES.number = type.extend(v => !Number.isNaN(v) && lodash.isNumber(v) && Number.isFinite(v));
TYPES.integer = type.extend(Number.isInteger);
TYPES.array = type.extend(Array.isArray);
TYPES.object = type.extend(v => lodash.isObject(v) && !Array.isArray(v));
TYPES.buffer = type.extend(lodash.isBuffer);

TYPES.bool = TYPES.boolean.parse(v => ({ false: false, true: true })[ v.toLowerCase() ]);
TYPES.str = TYPES.string.parse(v => v.trim()).extend(v => v.length > 0);
TYPES.num = TYPES.number.parse(Number);
TYPES.int = TYPES.integer.parse(Number);
TYPES.arr = TYPES.array.parse(v => v.split(','));
TYPES.obj = TYPES.object.parse(JSON.parse);

TYPES.json = type.extend(v => JSON.parse(v) || true); // "func() || true" means no Error is good
TYPES.hex = TYPES.string.extend(v => /^[0-9a-f]+$/i.test(v));
TYPES.mongoId = TYPES.hex.extend(v => v.length === 24);
TYPES.md5 = TYPES.hex.extend(v => v.length === 32); // and md4
TYPES.sha1 = TYPES.hex.extend(v => v.length === 40);
TYPES.sha256 = TYPES.hex.extend(v => v.length === 96);
TYPES.sha512 = TYPES.hex.extend(v => v.length === 128);

TYPES.base64 = TYPES.string.extend(validatorLib.isBase64);
TYPES.jwt = type.extend(validatorLib.isJWT);
TYPES.uuid = type.extend(validatorLib.isUUID);
TYPES.ip = type.extend(validatorLib.isIP); // IPv4 and IPv6
TYPES.url = type.extend(validatorLib.isURL);
TYPES.uri = type.extend(validatorLib.isDataURI);
TYPES.magnet = type.extend(validatorLib.isMagnetURI);
TYPES.email = type.extend(validatorLib.isEmail);

module.exports = TYPES;
