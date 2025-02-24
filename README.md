# @hitorisensei/memoizee-decorator

## Description

Adds memoization decorator for methods and getters. \
Uses [memoizee](https://www.npmjs.com/package/memoizee) library for memoization. \
Uses [hash-sum](https://www.npmjs.com/package/hash-sum) library as a default cache-key generation algorithm.

## Usage

```typescript
import { Memoize } from '@hitorisensei/memoizee-decorator';

class MyClass {
  @Memoize()
  public getMyValue(): number {
    console.log('My value is calculated');
    return someExpensiveCalculation();
  }
}

const myClass = new MyClass();
myClass.getMyValue(); // console logs 'My value is calculated' only once
myClass.getMyValue(); // returns cached value
```

### Memoizee options

Decorator can be called with all [memoizee options](https://www.npmjs.com/package/memoizee#user-content-configuration).

```typescript
import { Memoize } from '@hitorisensei/memoizee-decorator';

class MyClass {
    @Memoize({
        maxAge: 1000,
        max: 100,
    })
    public getMyValue(): number {
        console.log('My value is calculated');
        return someExpensiveCalculation();
    }
}
```

### Clearing memoization cache

```typescript
import { Memoize, clearMemoization } from '@hitorisensei/memoizee-decorator';

class MyClass {
    @Memoize()
    public getMyValue(): number {
        console.log('My value is calculated');
        return someExpensiveCalculation();
    }
}

const myClass = new MyClass();
myClass.getMyValue(); // console logs 'My value is calculated' only once
myClass.getMyValue(); // returns cached value

clearMemoization(myClass, 'getMyValue'); // clears cache
myClass.getMyValue(); // console logs 'My value is calculated' again
```

## Memoized function parameters

By default, memoization cache key is generated based on the function arguments using [hash-sum](https://www.npmjs.com/package/hash-sum) library. \
So the memoization cache will be shared between calls with the same arguments, but not between calls with different arguments.


```typescript
import { Memoize } from '@hitorisensei/memoizee-decorator';

class MyClass {
    @Memoize()
    public getMyValue(value: number): number {
        console.log('My value is calculated for', value);
        return someExpensiveCalculation(value);
    }
}

const myClass = new MyClass();
myClass.getMyValue(1); // console logs 'My value is calculated for 1' only once
myClass.getMyValue(1); // returns cached value
myClass.getMyValue(2); // logs 'My value is calculated for 2'
myClass.getMyValue(2); // returns cached value
```

If you want to limit the number of cached results, e.g. when the function can be called with a large number of different arguments, you can use the `max` option.

```typescript
import { Memoize } from '@hitorisensei/memoizee-decorator';

class MyClass {
    @Memoize({
        max: 3,
    })
    public getMyValue(value: number): number {
        console.log('My value is calculated for', value);
        return someExpensiveCalculation(value);
    }
}

const myClass = new MyClass();

myClass.getMyValue(1); // logs 'My value is calculated for 1'
myClass.getMyValue(2); // logs 'My value is calculated for 2'
myClass.getMyValue(3); // logs 'My value is calculated for 3'
myClass.getMyValue(4); // logs 'My value is calculated for 4'

// LRUCache with max 3, so only 3 last results are cached
myClass.getMyValue(2); // returns cached value for 2
myClass.getMyValue(3); // returns cached value for 3
myClass.getMyValue(4); // returns cached value for 4

myClass.getMyValue(1); // logs 'My value is calculated for 1'
```

By default, the parameters are hashed with [hash-sum](https://www.npmjs.com/package/hash-sum). \
If you want to use custom cache key generation algorithm, you can pass a `normalizer` function to the decorator.

```typescript
import { Memoize } from '@hitorisensei/memoizee-decorator';

class MyClass {
    @Memoize({
        normalizer: (args: any[]) => args[0].toString(),
    })
    public getMyValue(value: number): number {
        console.log('My value is calculated');
        return someExpensiveCalculation(value);
    }
}
```
