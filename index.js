var tape = require('tape')
var isPromise = require('is-promise')
var merge = require('merge')
var figures = require('figures')

function namespace (name, setup) {

  setup = setup || {}

  var beforeEach = setup.beforeEach || []
  var afterEach = setup.afterEach || []
  var tapeFn = tape

  var tester = function (name2, fn) {

    var testName = name ? name + ' ' + figures.arrowRight + ' ' + name2 : name2

    return tapeFn(testName, function (t) {

      var end = t.end.bind(t)

      // Call all beforeEach fns and set return as context
      // to pass to test methods

      var beforeEachReturns = beforeEach.map(function (be) {

        return be()
      })

      t.context = merge.apply(null, beforeEachReturns)
      t.end = function () {

        afterEach.forEach(function (ae) {

          ae({
            context: t.context
          })
        })
        end()
      }

      //
      var ret = fn({
        equal: t.equal,
        deepEqual: t.deepEqual,
        pass: t.pass,
        fail: t.fail,
        notDeepEqual: t.notDeepEqual,
        notEqual: t.notEqual,
        context: t.context
      })

      // Promise
      if (isPromise(ret)) {
        ret.then(function () {

          return end()
        })
      }
      // Thunk
      else if (typeof ret === 'function') {
        ret(end)
      }
      // Call end of synchronous tests automatically
      else {
        end()
      }
    })
  }

  tester.beforeEach = function (fn) {

    return beforeEach.push(fn)
  }
  tester.afterEach = function (fn) {

    return afterEach.push(fn)
  }

  tester.namespace = function (name2) {

    return namespace(name + ' -> ' + name2, {
      beforeEach: beforeEach,
      afterEach: afterEach,
    })
  }

  tester.only = function () {

    tapeFn = tape.only
    tester.apply(null, arguments)
    tapeFn = tape
  }

  tester.skip = function () {}

  return tester
}

module.exports = {
  namespace: namespace,
  test: tape
}
