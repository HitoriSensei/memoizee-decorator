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