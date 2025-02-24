import { clearMemoization, Memoize } from './memoize.decorator';

describe('memoize.decorator', () => {
  it('should memoize the method', () => {
    const spy = jest.fn();
    class Test {
      @Memoize()
      test() {
        spy();
      }
    }

    const test = new Test();
    test.test();
    test.test();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should memoize the getter', () => {
    const spy = jest.fn();
    class Test {
      @Memoize()
      get test2() {
        spy();
        return 1;
      }
    }

    const test = new Test();
    test.test2;
    test.test2;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should allow clearing the memoized cache', ()=> {
    const spy = jest.fn();
    class Test {
      @Memoize()
      test() {
        spy();
      }
    }

    const test = new Test();
    test.test();
    test.test();
    expect(spy).toHaveBeenCalledTimes(1);

    test.test();
    expect(spy).toHaveBeenCalledTimes(1);

    clearMemoization(test.test);
    test.test();
    expect(spy).toHaveBeenCalledTimes(2);
  })

  it('should properly keep the execution callee context (this)', () => {
    const spy = jest.fn();
    class Test {
      @Memoize()
      test() {
        spy(this);
      }
    }

    const test = new Test();
    test.test();
    test.test();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, test);

    clearMemoization(test.test);

    const otherContext = {}
    test.test.apply(otherContext);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, otherContext);
  })

  it('should disallow setter memoization', () => {
    const spy = jest.fn();
    expect(() => {
      class Test {
        @Memoize()
        set test2(value: number) {
          spy();
        }
      }
    }).toThrowError(
      'Memoize decorator can only be applied to methods and getters',
    );
  });

  it('when `max` option is set, should memoize the method with the max cache size', () => {
    const spy = jest.fn();
    class Test {
      @Memoize({ max: 2 })
      test(...args: any[]) {
        spy(...args);
      }
    }

    const test = new Test();
    test.test(1);
    test.test(1);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 1);

    test.test(2);
    test.test(2);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 2);


    test.test(3);
    test.test(3);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(3, 3);

    test.test(2);
    expect(spy).toHaveBeenCalledTimes(3); // 2 is still in cache

    test.test(1);
    expect(spy).toHaveBeenCalledTimes(4);
  })

  it('should handle `max` option with LRU Cache', () => {
    const spy = jest.fn();
    class Test {
      @Memoize({ max: 2 })
      test(...args: any[]) {
        spy(...args);
      }
    }

    const test = new Test();
    test.test(1);
    test.test(1);
    test.test(2);
    test.test(2);
    test.test(3);
    test.test(3);

    // Outside max cache limit, will call with '1' again
    test.test(1);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, 1);
    expect(spy).toHaveBeenNthCalledWith(2, 2);
    expect(spy).toHaveBeenNthCalledWith(3, 3);
    expect(spy).toHaveBeenNthCalledWith(4, 1);
  })
});
