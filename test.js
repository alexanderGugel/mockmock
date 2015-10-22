/* global describe it before after beforeEach */

var assert = require('assert')
var mock = require('./')

describe('mockmock', function () {
  describe('should proxy', function () {
    it('function', function () {
      var i = 0
      var mocked = mock(function () {
        return i++
      })
      assert.equal(mocked(), 0)
      assert.equal(mocked(), 1)
      assert.equal(mocked(), 2)
    })

    describe('passed in value', function () {
      [null, undefined, 'hello', 123, {}].forEach(function (scenario) {
        it(scenario, function () {
          var mocked = mock(scenario)
          assert.equal(mocked(), scenario)
        })
      })
    })

    it('noop if no arguments have been supplied', function () {
      var mocked = mock()
      assert.equal(mocked(), undefined)
    })
  })

  it('should forward passed in args to mocked function', function () {
    var args = []
    var mocked = mock(function () {
      args.push(Array.prototype.slice.call(arguments))
    })
    mocked(1, 2, 3)
    mocked(4, 5, 6)
    assert.deepEqual(args, [
      [1, 2, 3],
      [4, 5, 6]
    ])
  })

  it('should call mocked function with used thisArg', function () {
    var thisArgs = []
    var mocked = mock(function () {
      thisArgs.push(this)
    })
    var this0 = {}
    mocked.call(this0)
    assert.deepEqual(thisArgs, [this0])
  })

  it('should throw error thrown by mocked function', function () {
    var err = new Error()
    var mocked = mock(function () {
      throw err
    })
    assert.throws(mocked)
  })

  describe('#args', function () {
    it('should be an array of previously passed in args', function () {
      var mocked = mock(function () { })
      mocked(1, 2, 3)
      mocked(4, 5, 6)
      assert.deepEqual(mocked.args, [
        [1, 2, 3],
        [4, 5, 6]
      ])
    })
  })

  describe('#thisValues', function () {
    it('should be an array of thisArgs the mock function has been executed with', function () {
      var this0 = {}
      var this1 = {}
      var mocked = mock(function () { })
      mocked.call(this0)
      mocked.call(this1)
      assert.deepEqual(mocked.thisValues, [this0, this1])
    })
  })

  describe('#returnValues', function () {
    it('should be an array of return values of the mocked function', function () {
      var i = 0
      var mocked = mock(function () {
        return i++
      })
      mocked()
      mocked()
      mocked()
      assert.deepEqual(mocked.returnValues, [0, 1, 2])
    })
  })

  describe('#calls', function () {
    var originalNow
    var timestamp

    before(function () {
      originalNow = Date.now
      Date.now = function () {
        return timestamp
      }
    })

    after(function () {
      Date.now = originalNow
    })

    it('should be an array of timestamps when the function has been called', function () {
      var mocked = mock(function () {})
      timestamp = 1
      mocked()
      timestamp = 5
      mocked()
      timestamp = 100
      mocked()
      assert.deepEqual(mocked.calls, [1, 5, 100])
    })
  })

  describe('#errors', function () {
    it('should be an array of errors thrown by the mocked function', function () {
      var i = 0
      var mocked = mock(function () {
        var err = new Error()
        err.i = i++
        throw err
      })
      try { mocked() } catch (e) {}
      try { mocked() } catch (e) {}
      try { mocked() } catch (e) {}
      assert.deepEqual(mocked.errors.map(function (err) {
        return err.i
      }), [0, 1, 2])
    })
  })

  describe('#clear()', function () {
    var mocked

    beforeEach(function () {
      mocked = mock(function () {
        throw new Error()
      })
      try {
        mocked.apply({}, [1, 2, 3])
      } catch (e) {
      }
      mocked.clear()
    })

    it('should clear #args', function () {
      assert.equal(mocked.args.length, 0)
    })

    it('should clear #thisValues', function () {
      assert.equal(mocked.thisValues.length, 0)
    })

    it('should clear #returnValues', function () {
      assert.equal(mocked.returnValues.length, 0)
    })

    it('should clear #calls', function () {
      assert.equal(mocked.calls.length, 0)
    })

    it('should clear #errors', function () {
      assert.equal(mocked.errors.length, 0)
    })
  })

  describe('#flush()', function () {
    it('should be an alias for #clear()', function () {
      var mocked = mock(function () {})
      assert.equal(mocked.flush, mocked.clear)
    })
  })

  describe('#reset()', function () {
    it('should be an alias for #clear()', function () {
      var mocked = mock(function () {})
      assert.equal(mocked.flush, mocked.clear)
    })
  })

  describe('#callCount', function () {
    it('should be the number of times the mocked function has been executed', function () {
      var mocked = mock(function () {})
      assert.equal(mocked.callCount, 0)
      mocked()
      assert.equal(mocked.callCount, 1)
      mocked()
      assert.equal(mocked.callCount, 2)
    })
  })

  describe('#called', function () {
    it('should be a boolean indicating if the mocked function has been executed at least once', function () {
      var mocked = mock(function () {})
      assert.equal(mocked.called, false)
      mocked()
      assert.equal(mocked.called, true)
      mocked()
      assert.equal(mocked.called, true)
    })
  })

  ; [
    { method: 'calledOnce', n: 1 },
    { method: 'calledTwice', n: 2 },
    { method: 'calledThrice', n: 3 }
  ].forEach(function (scenario) {
    describe('#' + scenario.method, function () {
      it('should be true if the mocked method has been executed exactly ' + scenario.n + ' times', function () {
        var mocked = mock(function () {})
        for (var i = 0; i < 10; i++) {
          assert.equal(mocked[scenario.method], i === scenario.n)
          mocked()
        }
      })
    })
  })

  ; [
    { method: 'firstCall', n: 1 },
    { method: 'secondCall', n: 2 },
    { method: 'thirdCall', n: 3 },
    { method: 'lastCall', n: 9 }
  ].forEach(function (scenario) {
    describe('#' + scenario.method, function () {
      it('should describe the ' + scenario.n + '. call', function () {
        var _this = {}

        var mocked = mock(scenario.n)
        for (var i = 0; i < 10; i++) {
          mocked.call(_this, i, i + 1)
        }

        assert.deepEqual(mocked[scenario.method], {
          returnValue: scenario.n,
          args: [scenario.n, scenario.n + 1],
          error: undefined,
          thisValue: _this
        })
      })
    })
  })
})
