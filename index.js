'use strict'

function mock (mockFn) {
  var mockValue = mockFn

  if (arguments.length && typeof mockFn !== 'function') {
    mockFn = function () {
      return mockValue
    }
  }

  mockFn = mockFn || function () {}

  var args = []
  var thisValues = []
  var returnValues = []
  var calls = []
  var errors = []

  var mockedFn = function () {
    args.push(
      // for deepEqual assertion
      Array.prototype.slice.call(arguments)
    )
    thisValues.push(this)
    calls.push(Date.now())

    var returnValue
    var error

    try {
      returnValue = mockFn.apply(this, arguments)
    } catch (e) {
      error = e
    }

    errors.push(error)
    returnValues.push(returnValue)

    if (error) {
      throw error
    }

    return returnValue
  }

  mockedFn.clear = function () {
    args.length = 0
    thisValues.length = 0
    returnValues.length = 0
    calls.length = 0
    errors.length = 0

    return mockedFn
  }

  mockedFn.flush = mockedFn.clear
  mockedFn.reset = mockedFn.clear

  function calledNtimes (n) {
    return calls.length === n
  }

  function nthCall (n) {
    return {
      thisValue: thisValues[n],
      args: args[n],
      returnValue: returnValues[n],
      error: errors[n]
    }
  }

  Object.defineProperties(mockedFn, {
    mockFn: {
      get: function () {
        return mockedFn
      }
    },
    mockValue: {
      get: function () {
        return mockValue
      }
    },
    args: {
      get: function () {
        return args
      }
    },
    thisValues: {
      get: function () {
        return thisValues
      }
    },
    returnValues: {
      get: function () {
        return returnValues
      }
    },
    calls: {
      get: function () {
        return calls
      }
    },
    errors: {
      get: function () {
        return errors
      }
    },
    callCount: {
      get: function () {
        return calls.length
      }
    },
    called: {
      get: function () {
        return calls.length > 0
      }
    },
    calledOnce: {
      get: calledNtimes.bind(null, 1)
    },
    calledTwice: {
      get: calledNtimes.bind(null, 2)
    },
    calledThrice: {
      get: calledNtimes.bind(null, 3)
    },
    firstCall: {
      get: nthCall.bind(null, 1)
    },
    secondCall: {
      get: nthCall.bind(null, 2)
    },
    thirdCall: {
      get: nthCall.bind(null, 3)
    },
    lastCall: {
      get: function () {
        return nthCall(calls.length - 1)
      }
    }
  })

  return mockedFn
}

mock.mock = mock

module.exports = mock
