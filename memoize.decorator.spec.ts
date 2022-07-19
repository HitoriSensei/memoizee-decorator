import { Memoize } from './memoize.decorator';

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
});
