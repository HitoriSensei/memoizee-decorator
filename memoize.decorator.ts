import memoizee, { Options } from 'memoizee';
import hash from 'hash-sum';

/**
 * Memoize decorator for functions.
 * Uses {@link memoizee} to memoize the function.
 * @param {Options} options
 * @constructor
 */
export const Memoize =
  (options?: Options<(...args: any[]) => any>): MethodDecorator =>
  (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const isGet = descriptor.get;
    const isValue = descriptor.value;
    const originalMethod = isValue || isGet;

    if (!originalMethod) {
      throw new Error(
        'Memoize decorator can only be applied to methods and getters',
      );
    }

    const memoizedSymbol = getMemoizedSymbol(propertyKey);

    const wrapper = function (this: any, ...args: any[]) {
      if (!this.hasOwnProperty(memoizedSymbol)) {
        Object.defineProperty(this, memoizedSymbol, {
          enumerable: false,
          configurable: false,
          value: memoizee(originalMethod, {
            primitive: true,
            normalizer: hash,
            ...options,
          }),
        });
      }
      return this[memoizedSymbol](...args);
    };

    if (isGet) {
      descriptor.get = wrapper;
    } else {
      descriptor.value = wrapper;
    }

    return descriptor;
  };

function getMemoizedSymbol(propertyKey: PropertyKey): symbol {
  return Symbol(String(propertyKey) + '_memoized');
}

/**
 * Clear the memoized cache for the method.
 * @param target
 * @param propertyKey
 */
export const clearMemoization = <T extends Object>(
  target: T,
  propertyKey: keyof T,
) => {
  const memoizedSymbol = getMemoizedSymbol(propertyKey);
  if (target.hasOwnProperty(memoizedSymbol)) {
    (target as any)[memoizedSymbol].clear();
  }
};
