import memoizee, { Memoized, Options } from 'memoizee';
import hash from 'hash-sum';

type AnyFunction = (...args: any[]) => any;

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

    const wrapper = memoizee(originalMethod, {
      primitive: true,
      normalizer: hash,
      ...options,
    })

    if (isValue) {
      descriptor.value = wrapper;
    } else {
      descriptor.get = wrapper;
    }

    return descriptor;
  };

/**
 * Clear the memoized cache for the method.
 * @param method
 */
export const clearMemoization = <Method extends AnyFunction>(
  method: Method,
) => {
  if('clear' in method) {
    (method as unknown as Memoized<Method>).clear();
  }
};
