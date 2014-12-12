# tessed

A more robust tap-producing, [tape](https://github.com/substack/tape) compatible, test harness for node and browsers. This is like if [tape](https://github.com/substack/tape) did [Crossfit](http://fitnesspainfree.com/wp-content/uploads/2013/12/Hammer.jpg).

Adds the following to [tape](https://github.com/substack/tape) without changing your normal workflow or adding globals:

#### Namespacing

Instead of having awkward `describe()` and `it()` globals such as are in a typical BDD test harness, this test harness lets you use obvious namespacing to build chains of related tests. This not only makes it easier to read the tests, but easier to read the output when used with a module like [tap-spec](https://github.com/scottcorgan/tap-spec).

```js
var test = require('tessed');

var namesapce = test('namespace');

namespace.test('my test', function (t) {
  
  t.end();
});

var nestedNamespace = namespace.test('nested');

nestedNamespace.test('another test', function (t) {

  t.end();  
});
```

#### beforeEach(), afterEach()

Within a namespace, Tessed allows you to define set up and teardown functions to run before and after each test in that namespace. Each `beforeEach()` and `afterEach()` will also be called for each child/nested test (similar to [Mocha's nested suites](http://visionmedia.github.io/mocha/))

```js
var test = require('tessed');

var namespace test('namespace');

namespace.beforeEach(function (t, context) {
  
  // attach data for the tests in the namespace to this "context" object  
  context.myData = "something";
  t.end();
});

namespace.test('my test', function (t, context) {
  
  // This runs after the "beforeEach()"
  
  t.equal(context.myData, 'something', 'context data is passed within namespace');
  t.end()
});

var nestedNamespace = namespace.test('nested')

nestedNamespace.test('nested test', function (t, context) {

  // The beforeEach() will be called before this test as well because
  // It is in the same namespace
  
  t.end();
});
```

## Install

```
npm install tessed --save-dev
```

### Running from the command line

```
$ tessed test/**/*.js
```

or 

```
$ node test/index.js
```

### Running from withing package.json

```js
{
  "name": "my-module",
  "scripts": {
    "test": "tessed test/**/*.js"
  }
}
```

## Run Tests

```
npm install
npm test
```