# mockmock

[![Build Status](https://travis-ci.org/alexanderGugel/mockmock.svg)](https://travis-ci.org/alexanderGugel/mockmock)
[![npm](https://img.shields.io/npm/v/mockmock.svg?style=flat)](https://npmjs.org/package/mockmock)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Mocking library for minimalists and people that don't want to remember 500 different methods.

![Curiout Chicken](https://farm8.staticflickr.com/7201/6825992286_1762072c7b_b.jpg)

## Why?

I like [sinon](http://sinonjs.org/docs/), but I am not a big fan of forcing users to remember the difference between stubs, spies and mocks. There is no need for a ton of different methods. `mockmock` is a much simpler approach that offers a sufficient solution for the majority of use-cases.

## Example

`mockmock` exports a single function `mock`.
`mock` accepts the function to be mocked or a constant value to be returned:

```js
var mocked = mock(function (color, fruit) {
  console.log('A', color, fruit)
})

mocked('red', 'apple') // #=> A red apple
mocked('yellow', 'banana') // #=> A yellow banana
mocked('green', 'cucumber') // #=> A green cucumber
```

```js
var mocked = mock(123)

console.log(mocked()) // #=> 123
```

Apart from defining behavior, the mock function is also a "spy", which means you can access its arguments, thisArg etc.:

```js
var mocked = mock()

mocked(1, 2, 3)
console.log(mocked.args) // #=> [[1, 2, 3]]

mocked(4, 5, 6)
console.log(mocked.args) // #=> [[1, 2, 3], [4, 5, 6]]

mocked.apply({}, [])
console.log(mocked.thisValues) // #=> [this, this, {}]
```

## Install

With [npm](https://www.npmjs.com/package/mockmock) do:

```
npm i mockmock -S
```

`mockmock` can then be `require`d as follows:

```js
var mock = require('mockmock')
```

or:

```js
var mock = require('mockmock').mock
```

## API

If you are familiar with [sinon](http://sinonjs.org/docs/), a lot of the methods might look familiar to you.

### `mock()` #=> `mockedFn`

Either accepts a constant value to be returned using an identity function or a function to be mocked. If no argument is provided, a noop function will be used.

```js
var mockedIdentityFn = mock('123')
console.log(mockedIdentityFn()) // #=> '123'

var mockedFn = mock(function () {
  return 'hello'
})
console.log(mockedFn()) // #=> 'hello'

var mockedNoop = mocke()
console.log(mockedNoop()) // #=> undefined
```

### `args`

An array of recorded `arguments`. `arguments` will be converted to an actual array to allow easy usage of `deepEqual` methods.

```js
var mocked = mock(function () {})
mocked(1, 2, 3)
mocked(4, 5, 6)
console.log(mocked.args) // #=> [[1, 2, 3], [4, 5, 6]]
```

### `thisValues`

Similar to `args`, records the `thisValue` the mocked function has been called with.

```js
var mocked = mock(function () {})
mocked.call({ a: 'a' })
mocked.call({ b: 'b' })
console.log(mocked.thisValues) // #=> [{ a: 'a' }, { b: 'b' }]
```

### `returnValues`

Similar to `args`, records the return values of the mocked function.

```js
var i = 0
var mocked = mock(function () {
  return i++
})
mocked()
mocked()
mocked()
console.log(mocked.returnValues) // #=> [0, 1, 2]
```

### `calls`

Keeps track of **when** (unix timestamp) the mocked function has been called.

```js
var mocked = mock()
mocked()
mocked()
mocked()
console.log(mocked.calls) // #=> [1445386361361, 1445386361365, 1445386361369]
```

### `errors`

Records the errors thrown by the function that has been mocked. Note that thrown errors **will be passed through** the mock function.

```js
var error = new Error()
var mocked = mock(function () { throws error })
try { mocked() } catch (e) {}
console.log(mocked.errors) // #=> [error]
```

### `callCount`

How many times has the mocked function been called?

```js
var mocked = mock()
mocked()
mocked()
mocked()
console.log(mocked.callCount) // #=> 3
```

### `called`

If the mocked function has been called **at all**.

```js
var mocked = mock()
console.log(mocked.called) // #=> false
mocked()
console.log(mocked.called) // #=> true
```

### `calledOnce`
### `calledTwice`
### `calledThrice`

If the mocked function has been called **exactly** once, twice or three times.

```js
var mocked = mock()
console.log(mocked.calledOnce) // #=> false
mocked()
console.log(mocked.calledOnce) // #=> true
mocked()
console.log(mocked.calledOnce) // #=> false
console.log(mocked.calledTwice) // #=> true
```

### `firstCall`
### `secondCall`
### `thirdCall`
### `lastCall`

Returns an object describing the first, second, third or last call.

```js
var mocked = mock('hello world')
mocked(1, 2, 3)
console.log(mocked.firstCall) // #=> { thisValue: this, args: [1, 2, 3], returnValue: 'hello world', error: undefined }
```

### `clear`, `flush`, `reset`

Resets the internal spy. All recorded arguments, errors, return values etc. will be reset.

```js
var mocked = mock()
mocked()
console.log(mocked.called) // #=> true
mocked.clear()
console.log(mocked.called) // #=> false
```

*For more usage examples, have a look at the test suite.*

## Credits

* "Curious Chicken" image by [Ian Southwell](https://flic.kr/p/bpbZGb), licensed under [CC BY-NC-ND 2.0](https://creativecommons.org/licenses/by-nc-nd/2.0/)

## License

A copy of the ISC license is included in this repository.
