// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../../node_modules/axios/lib/helpers/bind.js":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"../../node_modules/axios/lib/utils.js":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":"../../node_modules/axios/lib/helpers/bind.js"}],"../../node_modules/axios/lib/helpers/buildURL.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/core/InterceptorManager.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/core/transformData.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/cancel/isCancel.js":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"../../node_modules/axios/lib/helpers/normalizeHeaderName.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/core/enhanceError.js":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],"../../node_modules/axios/lib/core/createError.js":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"../../node_modules/axios/lib/core/enhanceError.js"}],"../../node_modules/axios/lib/core/settle.js":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"../../node_modules/axios/lib/core/createError.js"}],"../../node_modules/axios/lib/helpers/cookies.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/helpers/isAbsoluteURL.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"../../node_modules/axios/lib/helpers/combineURLs.js":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"../../node_modules/axios/lib/core/buildFullPath.js":[function(require,module,exports) {
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/isAbsoluteURL":"../../node_modules/axios/lib/helpers/isAbsoluteURL.js","../helpers/combineURLs":"../../node_modules/axios/lib/helpers/combineURLs.js"}],"../../node_modules/axios/lib/helpers/parseHeaders.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/helpers/isURLSameOrigin.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/adapters/xhr.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"./../utils":"../../node_modules/axios/lib/utils.js","./../core/settle":"../../node_modules/axios/lib/core/settle.js","./../helpers/cookies":"../../node_modules/axios/lib/helpers/cookies.js","./../helpers/buildURL":"../../node_modules/axios/lib/helpers/buildURL.js","../core/buildFullPath":"../../node_modules/axios/lib/core/buildFullPath.js","./../helpers/parseHeaders":"../../node_modules/axios/lib/helpers/parseHeaders.js","./../helpers/isURLSameOrigin":"../../node_modules/axios/lib/helpers/isURLSameOrigin.js","../core/createError":"../../node_modules/axios/lib/core/createError.js"}],"../../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../node_modules/axios/lib/defaults.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"../../node_modules/axios/lib/utils.js","./helpers/normalizeHeaderName":"../../node_modules/axios/lib/helpers/normalizeHeaderName.js","./adapters/xhr":"../../node_modules/axios/lib/adapters/xhr.js","./adapters/http":"../../node_modules/axios/lib/adapters/xhr.js","process":"../../node_modules/process/browser.js"}],"../../node_modules/axios/lib/core/dispatchRequest.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"../../node_modules/axios/lib/utils.js","./transformData":"../../node_modules/axios/lib/core/transformData.js","../cancel/isCancel":"../../node_modules/axios/lib/cancel/isCancel.js","../defaults":"../../node_modules/axios/lib/defaults.js"}],"../../node_modules/axios/lib/core/mergeConfig.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/core/Axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../utils":"../../node_modules/axios/lib/utils.js","../helpers/buildURL":"../../node_modules/axios/lib/helpers/buildURL.js","./InterceptorManager":"../../node_modules/axios/lib/core/InterceptorManager.js","./dispatchRequest":"../../node_modules/axios/lib/core/dispatchRequest.js","./mergeConfig":"../../node_modules/axios/lib/core/mergeConfig.js"}],"../../node_modules/axios/lib/cancel/Cancel.js":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"../../node_modules/axios/lib/cancel/CancelToken.js":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"../../node_modules/axios/lib/cancel/Cancel.js"}],"../../node_modules/axios/lib/helpers/spread.js":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"../../node_modules/axios/lib/helpers/isAxiosError.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],"../../node_modules/axios/lib/axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"../../node_modules/axios/lib/utils.js","./helpers/bind":"../../node_modules/axios/lib/helpers/bind.js","./core/Axios":"../../node_modules/axios/lib/core/Axios.js","./core/mergeConfig":"../../node_modules/axios/lib/core/mergeConfig.js","./defaults":"../../node_modules/axios/lib/defaults.js","./cancel/Cancel":"../../node_modules/axios/lib/cancel/Cancel.js","./cancel/CancelToken":"../../node_modules/axios/lib/cancel/CancelToken.js","./cancel/isCancel":"../../node_modules/axios/lib/cancel/isCancel.js","./helpers/spread":"../../node_modules/axios/lib/helpers/spread.js","./helpers/isAxiosError":"../../node_modules/axios/lib/helpers/isAxiosError.js"}],"../../node_modules/axios/index.js":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"../../node_modules/axios/lib/axios.js"}],"alerts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = exports.hideAlert = void 0;

// FUNCTIONS THAT SHOW/HIDE MESSAGES
var hideAlert = function hideAlert() {
  var element = document.querySelector(".alert");

  if (element) {
    element.parentElement.removeChild(element);
  }
}; // type is 'success' or 'error'


exports.hideAlert = hideAlert;

var showAlert = function showAlert(type, message) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
  hideAlert();
  var markup = "<div class=\"alert alert--".concat(type, "\">").concat(message, "</div>");
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};

exports.showAlert = showAlert;
},{}],"ajaxCalls.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteData = exports.updateData = exports.loadData = exports.sendData = void 0;

require("regenerator-runtime/runtime");

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var sendData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, endpoint) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios.default.post("/api/v1".concat(endpoint), data);

          case 3:
            response = _context.sent;

            if (!endpoint.includes("login")) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", setTimeout(function () {
              return location.assign("/");
            }, 3000));

          case 6:
            return _context.abrupt("return", response.data);

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            (0, _alerts.showAlert)("error", _context.t0.response.data.message, 5);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function sendData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.sendData = sendData;

var loadData = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(endpoint) {
    var response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _axios.default.get("/api/v1".concat(endpoint));

          case 3:
            response = _context2.sent;
            return _context2.abrupt("return", response.data);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            (0, _alerts.showAlert)("error", _context2.t0.message.data.message, 5);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function loadData(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.loadData = loadData;

var updateData = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, endpoint) {
    var res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _axios.default.patch("/api/v1".concat(endpoint), data);

          case 3:
            res = _context3.sent;
            (0, _alerts.showAlert)("success", "Cart updated successfully!", 4);
            return _context3.abrupt("return", res);

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            (0, _alerts.showAlert)("error", _context3.t0.response.data.message, 5);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function updateData(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateData = updateData;

var deleteData = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(endpoint) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _axios.default.delete("/api/v1".concat(endpoint));

          case 3:
            _context4.next = 8;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4["catch"](0);
            (0, _alerts.showAlert)("error", _context4.t0.response.data.message, 5);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 5]]);
  }));

  return function deleteData(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.deleteData = deleteData;
},{"regenerator-runtime/runtime":"../../node_modules/regenerator-runtime/runtime.js","axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectButtonsAndAppendEventListener = exports.renderProductsList = exports.renderProductsCard = exports.renderCartDropDown = void 0;

var _ajaxCalls = require("./ajaxCalls");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// ====================================== GENERAL FUNCTIONS =======================================
var assignLoginPage = function assignLoginPage() {
  return location.assign("/login");
}; // ================================================================================================
// ==================================== DOM-RELATED FUNCTIONS ==================================== //
// IT RENDERS THE DROPDOWN SHOWN WHEN MOUSE HOVERS THROUGH CART ICON IN THE HEADER


var renderCartDropDown = function renderCartDropDown(_ref) {
  var cartItems = _ref.cartItems,
      value = _ref.value;
  var cartContainer = document.querySelector(".nav-cart__items");
  cartContainer.innerText = ""; // CLEANS ANY CONTENT IF THERE IS ANY
  // THIS CHANGES THE TOTAL ITEMS ADDED TO THE CART

  document.querySelector(".nav-cart span").innerText = cartItems.length > 0 ? cartItems.length : ""; // SETS THE TOTAL VALUE OF THE CART

  document.querySelector('.nav-cart__total-price').innerText = "$ ".concat(value);

  if (cartItems.length === 0) {
    return;
  }

  cartItems.forEach(function (_ref2) {
    var product = _ref2.product;
    var markup = "  \n          <div class=\"nav-cart__item clearfix\">\n            <div class=\"nav-cart__img\">\n              <a href=/product/".concat(product.sex, "/").concat(product.slug, ">\n                <img src=\"/img/products/").concat(product.images[0], "\" alt=").concat(product.name, " photo>\n              </a>\n            </div>\n            <div class=\"nav-cart__title\">\n              <a href=/product/").concat(product.sex, "/").concat(product.slug, ">\n                ").concat(product.name, "\n              </a>\n              <div class=\"nav-cart__price\">\n                <span>1 x</span>\n                <span>").concat(product.price, "</span>\n              </div>\n            </div>\n          </div>\n        </div>\n        ");
    cartContainer.insertAdjacentHTML("beforeend", markup);
  });
}; // RENDERS ALL THE RECEIVED PRODUCTS FROM THE API IN /products PAGE. AT THE END, IT CALLS pagination()
// WHICH IN TURN WILL APPLY ALL THE LOGIC NEEDED TO PROVIDE PAGINATION FOR THE RESULTS AND WILL RENDER
// IN THE PAGE.


exports.renderCartDropDown = renderCartDropDown;

var renderProductsCard = function renderProductsCard(_ref3) {
  var data = _ref3.data,
      currentPage = _ref3.currentPage,
      totalResults = _ref3.totalResults;
  var totalProductsPerPage = document.querySelector(".total-products-page");
  var totalProducts = document.querySelector(".total-products");
  var productsContainer = document.querySelector(".catalog .row .row-8");
  var paginationContainer = document.querySelector(".pagination");
  totalProductsPerPage.innerText = data.length <= 12 ? data.length : 12;
  totalProducts.innerText = totalResults;
  productsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";
  data.forEach(function (product) {
    var markup = "\n          <div class=\"col-lg-3 col-md col-sm-6 product\" data-product-id=".concat(product._id, ">\n              <div class=\"product__img-holder\">\n              <a href=\"/product/").concat(product.sex, "/").concat(product.slug, "\" class=\"product__link\">\n                  <img src=\"/img/products/").concat(product.images[0], "\" alt=\"").concat(product.name, " image\" class=\"product__img\">\n                  <img src=\"/img/products/").concat(product.images[0], "\" alt=\"").concat(product.name, " image\" class=\"product__img-back\">\n              </a>\n                  <div class=\"product__actions\">\n                      <button class=\"button__action button-cart product__quickview\">\n                          <i class=\"ui-bag\"></i>\n                          <span>Cart</span>\n                      </a>\n                      <button class=\"button__action button-wishlist product__add-to-wishlist\">\n                          <i class=\"ui-heart\"></i>\n                          <span>Wishlist</span>\n                      </a>\n                  </div>\n              </div>\n      \n              <div class=\"product__details\">\n                  <h3 class=\"product__title\">\n                      <a href=\"/product/").concat(product.sex, "/").concat(product.slug, "\">").concat(product.name, "\n                  </h3>\n              </div>\n      \n              <span class=\"product__price\">\n                  <ins>\n                      <span class=\"amount\">$ ").concat(product.price, "</span>\n                  </ins>\n              </span>\n          </div>\n          ");
    productsContainer.insertAdjacentHTML("beforeend", markup);
  }); // AFTER ALL THE PRODUCTS ARE INSERTED IN THE PRODUCTS CONTAINER, pagination() RUNS AND GIVES BACK ALL
  // THE RESULTS SEPARATED IN PAGES.

  var paginatedResults = pagination(currentPage, totalResults); // RETURNS THE NAV ELEMENT WITH THE PAGINATION READY TO BE INSERTED

  paginationContainer.insertAdjacentElement("beforeend", paginatedResults); // FUNCTION RESPONSIBLE TO ADD AN EVENT TO CART AND WISHLIST BUTTONS. THIS FUNCTION NEEDS TO BE CALLED HERE BECAUSE AS THE PRODUCT LISTS
  // ARE DINAMICALLY RENDERED, THE TWO ELEMENTS - CART AND WISHLIST BUTTONS - WERE APPENDED IN THIS POINT.

  selectButtonsAndAppendEventListener();
}; // USED BY renderProductsList(). IT GENERATES AND RETURNS THE OPTION ELEMENTS BY CHECKING IF THE ITERABLE
// OPTION IS THE SAME AS THE SELECTED ONE.


exports.renderProductsCard = renderProductsCard;

var fillSelectWithOption = function fillSelectWithOption(iterableOption, selectedOption) {
  var optionElements = [];
  iterableOption.map(function (option) {
    if (option === selectedOption) {
      optionElements.push("<option value=".concat(option, " selected>").concat(option.replace(/^\w/, function (c) {
        return c.toUpperCase();
      }), "</option>"));
    } else {
      optionElements.push("<option value=".concat(option, ">").concat(option.replace(/^\w/, function (c) {
        return c.toUpperCase();
      }), "</option>"));
    }
  });
  return optionElements;
}; // RENDERS ALL THE RECEIVED PRODUCTS FROM THE API IN /cart AND /wishlist PAGES.


var renderProductsList = function renderProductsList(data) {
  var listItemsContainer = document.querySelector("tbody", ".list-items");

  if (data.length === 0) {
    return listItemsContainer.insertAdjacentHTML("beforeend", "<p class='text-center mt-5'>You haven't added any items to your cart! :(</p>");
  }

  data.forEach(function (_ref4, i) {
    var color = _ref4.color,
        product = _ref4.product,
        quantity = _ref4.quantity,
        size = _ref4.size,
        _id = _ref4._id;
    var sizeOptionMarkup = fillSelectWithOption(product.size, size);
    var colorOptionMarkup = fillSelectWithOption(product.color, color);
    var markup = "\n      <tr class=\"cart_item\" data-product-id=".concat(_id, ">\n        <td class=\"product-thumbnail\">\n          <a href=\"/product/").concat(product.sex, "/").concat(product.slug, "\" target=\"_blank\">\n            <img src=\"img/products/").concat(product.images[0], "\" alt=\"Product Image\">\n          </a>\n        </td>\n        <td class=\"product-name\">\n          <a href=\"/product/").concat(product.sex, "/").concat(product.slug, "\" target=\"_blank\">").concat(product.name, "</a>\n          <div class=\"size-quantity\">\n            <p> Size: \n            <select class=\"select__product-list\" name=\"size\">\n            ").concat(sizeOptionMarkup, "\n            </select>\n            <p>Color:\n            <select class=\"select__product-list\" name='color'>\n            ").concat(colorOptionMarkup, "\n            </select>\n          </div>\n        </td>\n        <td class=\"product-price\">\n          <span class=\"amount amount--product\">$ ").concat(product.price, "</span>\n        </td>\n        <td class=\"product-quantity\">\n          <div class=\"quantity buttons_added\">\n            <input type=\"button\" value=\"-\" class=\"minus\">\n            <input type=\"number\" step=\"1\" min=\"1\" max=").concat(product.quantity, " value=").concat(quantity, " title=\"Quantity\" class=\"input-text qty text\">\n            <input type=\"button\" value=\"+\" class=\"plus\">\n          </div>\n          <p class=\"small text-muted\">(").concat(product.quantity, " AVAILABLE)\n        </td>\n        <td class=\"product-subtotal\">\n          <span class=\"amount amount--total\">$ ").concat((product.price * quantity).toFixed(2), "</span>\n        </td>\n        <td class=\"product-remove\">\n          <button class=\"remove\" title=\"Remove this item\">\n            <i class=\"ui-close\"></i>\n          </button>\n        </td>\n      </tr>\n    ");
    listItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
}; // ================================================================================================
// =========================== PAGINATION-RELATED FUNCTIONS ======================================= //
// MAIN PAGINATION FUNCTION
// ACTUAL STATUS: PARTLY PROCESSED IN BACKEND / PARTLY IN FRONTEND. CALCULATIONS LIKE SKIPPING, LIMITING AND PAGING ARE
// DONE IN BACKEND. HOWEVER, THE LOGIC TO POPULATE THE PAGE LINKS ARE DONE IN FRONTEND. UNSURE IF MOVE THIS LAST
// PART ALSO TO BACKEND AND FRONTEND RECEIVE THE PAGE LINKS READY.


exports.renderProductsList = renderProductsList;

var pagination = function pagination(currentPage, totalResults) {
  var totalPages = Math.ceil(totalResults / 12);
  var order = currentPage % 4;
  var firstPage = order === 0 ? currentPage - 3 : currentPage - (order - 1);
  var lastPage = totalPages > firstPage + 3 ? firstPage + 3 : totalPages;
  var isRightArrowEnabled;
  var length;

  if (totalPages <= 4) {
    length = totalPages;
    isRightArrowEnabled = false;
  } else {
    if (lastPage < totalPages) {
      length = 4;
      isRightArrowEnabled = true;
    } else {
      length = lastPage - (firstPage - 1);
      isRightArrowEnabled = false;
    }
  }

  return createAndAppendLinks(firstPage, isRightArrowEnabled, length, Number(currentPage));
}; // IT CREATES AND APPENDS THE GENERATED LINKS FOR THE PAGINATION


var createAndAppendLinks = function createAndAppendLinks(firstPage, isRightArrowEnabled, length, currentPage) {
  var navElement = document.createElement("nav");
  navElement.classList.add("pagination__nav", "right", "clearfix");
  var leftArrow, rightArrow; // LEFT ARROW

  if (firstPage === 1 && currentPage === firstPage) {
    leftArrow = "<a href='#' class='pagination__page' aria-current=\"disabled\"><i class=\"ui-arrow-left\"></i></a>";
  } else {
    leftArrow = "<a href='?page=".concat(currentPage - 1, "' class='pagination__page'><i class=\"ui-arrow-left\"></i></a>");
  } // RIGHT ARROW


  if (isRightArrowEnabled) {
    rightArrow = "<a href='?page=".concat(firstPage + 4, "' class=\"pagination__page\"><i class=\"ui-arrow-right\"></i></a>");
  } else {
    rightArrow = "<a href='#' class='pagination__page' aria-current=\"disabled\"><i class=\"ui-arrow-right\"></i></a>";
  }

  navElement.insertAdjacentHTML("beforeend", leftArrow); // ACTUAL PAGE LINKS

  for (var i = 0; i < length; i++) {
    var page = firstPage + i;
    var element = void 0;

    if (page === currentPage) {
      element = "\n    <span class=\"pagination__page pagination__page--current\">".concat(page, "</span>\n      ");
    } else {
      element = "\n    <a href=\"?page=".concat(page, "\" class=\"pagination__page\">").concat(page, "</a>\n      ");
    }

    navElement.insertAdjacentHTML("beforeend", element);
  }

  navElement.insertAdjacentHTML("beforeend", rightArrow);
  return navElement;
}; // ================================================================================================
// ============================== CART & WISHLIST-RELATED FUNCTIONS ===============================


var reloadCartDropDown = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
    var _yield$loadData, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _ajaxCalls.loadData)("/users/".concat(user, "/carts"));

          case 2:
            _yield$loadData = _context.sent;
            data = _yield$loadData.data;
            renderCartDropDown(data.cart);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function reloadCartDropDown(_x) {
    return _ref5.apply(this, arguments);
  };
}();

var PATCHOrDELETEProductsOnHome = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(element, request, path) {
    var cartNavbar, user, product;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cartNavbar = document.querySelector(".nav-cart");

            if (cartNavbar) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", assignLoginPage());

          case 3:
            if (path.includes("carts")) {
              document.querySelector(".nav-cart span").innerText = "Loading...";
            }

            user = cartNavbar.dataset.userId;
            product = element.closest(".product").dataset.productId;

            if (!(request === "PATCH")) {
              _context2.next = 13;
              break;
            }

            _context2.next = 9;
            return (0, _ajaxCalls.updateData)([{
              product: product
            }], "/users/".concat(user).concat(path));

          case 9:
            element.firstElementChild.style.color = "red";

            if (!path.includes("carts")) {
              _context2.next = 13;
              break;
            }

            _context2.next = 13;
            return reloadCartDropDown(user);

          case 13:
            if (!(request === "DELETE")) {
              _context2.next = 20;
              break;
            }

            _context2.next = 16;
            return (0, _ajaxCalls.deleteData)("/users/".concat(user).concat(path, "/product/").concat(product));

          case 16:
            element.firstElementChild.style.color = "black";

            if (!path.includes("carts")) {
              _context2.next = 20;
              break;
            }

            _context2.next = 20;
            return reloadCartDropDown(user);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function PATCHOrDELETEProductsOnHome(_x2, _x3, _x4) {
    return _ref6.apply(this, arguments);
  };
}();

var addListenerToButtons = function addListenerToButtons(buttonElement, path) {
  buttonElement.forEach( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(button) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              button.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var requestType;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        button.classList.toggle("clicked");
                        button.classList.value.includes("clicked") ? requestType = "PATCH" : requestType = "DELETE";
                        return _context3.abrupt("return", PATCHOrDELETEProductsOnHome(button, requestType, path));

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x5) {
      return _ref7.apply(this, arguments);
    };
  }());
};

var selectButtonsAndAppendEventListener = function selectButtonsAndAppendEventListener() {
  var addToCartButton = document.querySelectorAll(".button-cart");
  var addToWishlistButton = document.querySelectorAll(".button-wishlist");
  addListenerToButtons(addToCartButton, "/carts");
  addListenerToButtons(addToWishlistButton, "/wishlists");
}; // ================================================================================================


exports.selectButtonsAndAppendEventListener = selectButtonsAndAppendEventListener;
},{"./ajaxCalls":"ajaxCalls.js"}],"scripts.js":[function(require,module,exports) {
"use strict";

var _ajaxCalls = require("./ajaxCalls");

var _helpers = require("./helpers");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(function ($) {
  "use strict";

  var $window = $(window);
  $window.on("load", function () {
    // Preloader
    $(".loader").fadeOut();
    $(".loader-mask").delay(350).fadeOut("slow");
    $window.trigger("resize");
  }); // Init

  initOwlCarousel();
  initFlickity();
  $window.on("resize", function () {
    hideSidenav();
    megaMenu();
  });
  /* Detect Browser Size
  -------------------------------------------------------*/

  var minWidth;

  if (Modernizr.mq("(min-width: 0px)")) {
    // Browsers that support media queries
    minWidth = function minWidth(width) {
      return Modernizr.mq("(min-width: " + width + "px)");
    };
  } else {
    // Fallback for browsers that does not support media queries
    minWidth = function minWidth(width) {
      return $window.width() >= width;
    };
  }
  /* Mobile Detect
  -------------------------------------------------------*/


  if (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera)) {
    $("html").addClass("mobile");
    $(".dropdown-toggle").attr("data-toggle", "dropdown");
  } else {
    $("html").removeClass("mobile");
  }
  /* Sticky Navigation
  -------------------------------------------------------*/


  var $stickyNav = $(".nav--sticky");
  var $nav = $(".nav");
  $window.scroll(function () {
    scrollToTop();

    if ($window.scrollTop() > 2 & minWidth(992)) {
      $stickyNav.addClass("sticky");
      $nav.addClass("sticky");
    } else {
      $stickyNav.removeClass("sticky");
      $nav.removeClass("sticky");
    }
  });

  function stickyNavRemove() {
    if (!minWidth(992)) {
      $stickyNav.removeClass("sticky");
    }
  }
  /* Mobile Navigation
  -------------------------------------------------------*/


  var $sidenav = $("#sidenav"),
      $main = $("#main"),
      $navIconToggle = $("#nav-icon-toggle");
  $navIconToggle.on("click", function (e) {
    e.stopPropagation();
    $(this).toggleClass("nav-icon-toggle--is-open");
    $sidenav.toggleClass("sidenav--is-open");
    $main.toggleClass("main--is-open");
  });

  function resetNav() {
    $navIconToggle.removeClass("nav-icon-toggle--is-open");
    $sidenav.removeClass("sidenav--is-open");
    $main.removeClass("main--is-open");
  }

  function hideSidenav() {
    if (minWidth(992)) {
      resetNav();
      setTimeout(megaMenu, 500);
    }
  }

  $main.on("click", function () {
    resetNav();
  });
  var $dropdownTrigger = $(".nav__dropdown-trigger"),
      $navDropdownMenu = $(".nav__dropdown-menu"),
      $navDropdown = $(".nav__dropdown");

  if ($("html").hasClass("mobile")) {
    $("body").on("click", function () {
      $navDropdownMenu.addClass("hide-dropdown");
    });
    $navDropdown.on("click", "> a", function (e) {
      e.preventDefault();
    });
    $navDropdown.on("click", function (e) {
      e.stopPropagation();
      $navDropdownMenu.removeClass("hide-dropdown");
    });
  }
  /* Sidenav Menu
  -------------------------------------------------------*/


  $(".sidenav__menu-toggle").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.parent().siblings().removeClass("sidenav__menu--is-open");
    $this.parent().siblings().find("li").removeClass("sidenav__menu--is-open");
    $this.parent().find("li").removeClass("sidenav__menu--is-open");
    $this.parent().toggleClass("sidenav__menu--is-open");

    if ($this.next().hasClass("show")) {
      $this.next().removeClass("show").slideUp(350);
    } else {
      $this.parent().parent().find("li .sidenav__menu-dropdown").removeClass("show").slideUp(350);
      $this.next().toggleClass("show").slideToggle(350);
    }
  });
  /* Mega Menu
  -------------------------------------------------------*/

  function megaMenu() {
    $(".nav__megamenu").each(function () {
      var $this = $(this);
      $this.css("width", $(".container").width());
      var offset = $this.closest(".nav__dropdown").offset();
      offset = offset.left;
      var containerOffset = $(window).width() - $(".container").outerWidth();
      containerOffset = containerOffset / 2;
      offset = offset - containerOffset - 15;
      $this.css("left", -offset);
    });
  }
  /* Accordion
  -------------------------------------------------------*/


  var $accordion = $(".accordion");

  function toggleChevron(e) {
    $(e.target).prev(".accordion__heading").find("a").toggleClass("accordion--is-open accordion--is-closed");
  }

  $accordion.on("hide.bs.collapse", toggleChevron);
  $accordion.on("show.bs.collapse", toggleChevron);
  /* Tabs
  -------------------------------------------------------*/

  $(".tabs__link").on("click", function (e) {
    var currentAttrValue = $(this).attr("href");
    $(".tabs__content " + currentAttrValue).stop().fadeIn(1000).siblings().hide();
    $(this).parent("li").addClass("active").siblings().removeClass("active");
    e.preventDefault();
  });
  /* Owl Carousel
  -------------------------------------------------------*/

  function initOwlCarousel() {
    // Featured Posts
    $("#owl-hero").owlCarousel({
      center: true,
      items: 1,
      loop: true,
      nav: true,
      navSpeed: 500,
      navText: ['<i class="ui-arrow-left">', '<i class="ui-arrow-right">']
    }); // Gallery post

    $("#owl-single").owlCarousel({
      items: 1,
      loop: true,
      nav: true,
      animateOut: "fadeOut",
      navText: ['<i class="ui-arrow-left">', '<i class="ui-arrow-right">']
    }); // Testimonials

    $("#owl-testimonials").owlCarousel({
      items: 1,
      loop: true,
      nav: true,
      dots: false,
      navText: ['<i class="ui-arrow-left">', '<i class="ui-arrow-right">']
    });
  }
  /* Flickity Slider
  -------------------------------------------------------*/


  function initFlickity() {
    // main large image (shop product)
    $("#gallery-main").flickity({
      cellAlign: "center",
      contain: true,
      wrapAround: true,
      autoPlay: false,
      prevNextButtons: true,
      percentPosition: true,
      imagesLoaded: true,
      lazyLoad: 1,
      pageDots: false,
      selectedAttraction: 0.1,
      friction: 0.6,
      rightToLeft: false,
      arrowShape: "M 25,50 L 65,90 L 70,90 L 30,50  L 70,10 L 65,10 Z"
    }); // thumbs

    $("#gallery-thumbs").flickity({
      asNavFor: "#gallery-main",
      contain: true,
      cellAlign: "left",
      wrapAround: false,
      autoPlay: false,
      prevNextButtons: false,
      percentPosition: true,
      imagesLoaded: true,
      pageDots: false,
      selectedAttraction: 0.1,
      friction: 0.6,
      rightToLeft: false
    });
    var $gallery = $(".mfp-hover");
    $gallery.on("dragStart.flickity", function (event, pointer) {
      $(this).addClass("is-dragging");
    });
    $gallery.on("dragEnd.flickity", function (event, pointer) {
      $(this).removeClass("is-dragging");
    });
    $gallery.magnificPopup({
      delegate: ".lightbox-img, .lightbox-video",
      callbacks: {
        elementParse: function elementParse(item) {
          if (item.el.context.className === "lightbox-video") {
            item.type = "iframe";
          } else {
            item.type = "image";
          }
        }
      },
      type: "image",
      closeBtnInside: false,
      gallery: {
        enabled: true
      }
    });
  }
  /* Payment Method Accordion
  -------------------------------------------------------*/


  var methods = $(".payment_methods > li > .payment_box").hide();
  methods.first().slideDown("easeOutExpo");
  $(".payment_methods > li > input").change(function () {
    var current = $(this).parent().children(".payment_box");
    methods.not(current).slideUp("easeInExpo");
    $(this).parent().children(".payment_box").slideDown("easeOutExpo");
    return false;
  });
  /* Quantity
  -------------------------------------------------------*/

  $(function () {
    // Increase
    jQuery(document).on("click", ".plus", function (e) {
      e.preventDefault();
      var quantityInput = jQuery(this).parents(".quantity").find("input.qty"),
          newValue = parseInt(quantityInput.val(), 10) + 1,
          maxValue = parseInt(quantityInput.attr("max"), 10);

      if (!maxValue) {
        maxValue = 9999999999;
      }

      if (newValue <= maxValue) {
        quantityInput.val(newValue);
        quantityInput.change();
      }
    }); // Decrease

    jQuery(document).on("click", ".minus", function (e) {
      e.preventDefault();
      var quantityInput = jQuery(this).parents(".quantity").find("input.qty"),
          newValue = parseInt(quantityInput.val(), 10) - 1,
          minValue = parseInt(quantityInput.attr("min"), 10);

      if (!minValue) {
        minValue = 1;
      }

      if (newValue >= minValue) {
        quantityInput.val(newValue);
        quantityInput.change();
      }
    });
  });
  /* Sign In Popup
  -------------------------------------------------------*/
  // $("#top-bar__sign-in, .product__quickview").magnificPopup({
  //   type: "ajax",
  //   alignTop: false,
  //   overflowY: "scroll",
  //   removalDelay: 300,
  //   mainClass: "mfp-fade",
  //   callbacks: {
  //     ajaxContentAdded: function () {
  //       initFlickity();
  //     },
  //     close: function () {
  //       var $productImgHolder = $(".product__img-holder");
  //       $productImgHolder.addClass("processed");
  //       function removeProcessing() {
  //         $productImgHolder.removeClass("processed");
  //       }
  //       setTimeout(removeProcessing, 50);
  //     },
  //   },
  // });

  /* Quickview
  -------------------------------------------------------*/

  $(".product__quickview").on("click", function () {
    var product = $(".product");

    function removeProcessing() {
      product.removeClass("processing");
    }

    product.addClass("processing");
    setTimeout(removeProcessing, 500);
  });
  /* ---------------------------------------------------------------------- */

  /*  Contact Form
  /* ---------------------------------------------------------------------- */
  // var submitContact = $("#submit-message"),
  //   message = $("#msg");
  // submitContact.on("click", function (e) {
  //   e.preventDefault();
  //   var $this = $(this);
  //   $.ajax({
  //     type: "POST",
  //     url: "contact.php",
  //     dataType: "json",
  //     cache: false,
  //     data: $("#contact-form").serialize(),
  //     success: function (data) {
  //       if (data.info !== "error") {
  //         $this
  //           .parents("form")
  //           .find("input[type=text],input[type=email],textarea,select")
  //           .filter(":visible")
  //           .val("");
  //         message
  //           .hide()
  //           .removeClass("success")
  //           .removeClass("error")
  //           .addClass("success")
  //           .html(data.msg)
  //           .fadeIn("slow")
  //           .delay(5000)
  //           .fadeOut("slow");
  //       } else {
  //         message
  //           .hide()
  //           .removeClass("success")
  //           .removeClass("error")
  //           .addClass("error")
  //           .html(data.msg)
  //           .fadeIn("slow")
  //           .delay(5000)
  //           .fadeOut("slow");
  //       }
  //     },
  //   });
  // });

  /* Scroll to Top
  -------------------------------------------------------*/

  function scrollToTop() {
    var scroll = $window.scrollTop();
    var $backToTop = $("#back-to-top");

    if (scroll >= 50) {
      $backToTop.addClass("show");
    } else {
      $backToTop.removeClass("show");
    }
  }

  $('a[href="#top"]').on("click", function () {
    $("html, body").animate({
      scrollTop: 0
    }, 1000, "easeInOutQuint");
    return false;
  });
})(jQuery); // ================= END OF jQUERY ========================== //
// ---------------------------------------------------------- //


var searchForm = document.querySelector(".nav__search-form");
var cartNavbar = document.querySelector(".nav-cart");
var loginForm = document.querySelector(".login--form");
var homePage = document.querySelector("#home--page");
var productsPage = document.querySelector("#products--page");
var cartAndWishlistPage = document.querySelector("#cart-wishlist--page"); // DELEGATION

searchForm.addEventListener("submit", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(evt) {
    var keyword;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            evt.preventDefault();
            keyword = searchForm.querySelector("input").value;

            if (keyword) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            location.assign("/products/search?keyword=".concat(keyword));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

if (cartNavbar) {
  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var userId, _yield$loadData, data;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userId = cartNavbar.dataset.userId;
            _context2.next = 3;
            return (0, _ajaxCalls.loadData)("/users/".concat(userId, "/carts"));

          case 3:
            _yield$loadData = _context2.sent;
            data = _yield$loadData.data;
            (0, _helpers.renderCartDropDown)({
              cartItems: data.cart,
              value: data.value
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }))();
}

if (loginForm) {
  loginForm.addEventListener("submit", /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(evt) {
      var _loginForm$querySelec, _loginForm$querySelec2, email, password;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              evt.preventDefault();
              _loginForm$querySelec = loginForm.querySelectorAll("input"), _loginForm$querySelec2 = _slicedToArray(_loginForm$querySelec, 2), email = _loginForm$querySelec2[0], password = _loginForm$querySelec2[1];
              _context3.next = 4;
              return (0, _ajaxCalls.sendData)({
                email: email.value,
                password: password.value
              }, "/users/login");

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
}

if (homePage) {
  (0, _helpers.selectButtonsAndAppendEventListener)();
}

if (productsPage) {
  // PRODUCTS PAGE FUNCTIONS. INTERESTING TO READ LATER MORE ABOUT THE ABORT CONTROLLER API TO CANCEL PENDING AJAX REQUESTS AND ALLOW ONLY THE LAST ONES.
  // TO-DO: MAKE PRODUCTS CONTAINER TO HAVE A FIXED HEIGHT.
  var sortOptions = productsPage.querySelector(".sort-options");
  var sexFilterOptions = productsPage.querySelector(".sex-select");
  var categoryFilterOptions = productsPage.querySelector(".category-select");
  var sizeFilterOptions = productsPage.querySelector(".size-select");
  var colorFilterOptions = productsPage.querySelector(".color-select");
  var priceFilter = productsPage.querySelector(".btn-price-filter");

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var _window$location, pathname, search, products, selectedFields, lastSelectedFilter, requestFilteredProducts, _requestFilteredProducts, changeSelectedFieldsState, _changeSelectedFieldsState, filterProducts;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _changeSelectedFieldsState = function _changeSelectedFields2() {
              _changeSelectedFieldsState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(filterObject) {
                var isChecked,
                    _Object$entries$,
                    key,
                    value,
                    hasKey,
                    _args12 = arguments;

                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        isChecked = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : null;
                        _Object$entries$ = _slicedToArray(Object.entries(filterObject)[0], 2), key = _Object$entries$[0], value = _Object$entries$[1];

                        if (!(key === "price" || key === "sort")) {
                          _context12.next = 7;
                          break;
                        }

                        selectedFields[key] = filterObject[key];
                        _context12.next = 6;
                        return requestFilteredProducts();

                      case 6:
                        return _context12.abrupt("return", _context12.sent);

                      case 7:
                        // CHECKS IF THERE IS AN EXISTING KEY INSIDE selectedFields
                        hasKey = Object.keys(selectedFields).includes(key);

                        if (isChecked) {
                          hasKey ? selectedFields[key].push(value[0]) : selectedFields[key] = filterObject[key];
                        } else {
                          selectedFields[key] = selectedFields[key].filter(function (field) {
                            return field !== value[0];
                          });
                        }

                        _context12.next = 11;
                        return requestFilteredProducts();

                      case 11:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));
              return _changeSelectedFieldsState.apply(this, arguments);
            };

            changeSelectedFieldsState = function _changeSelectedFields(_x3) {
              return _changeSelectedFieldsState.apply(this, arguments);
            };

            _requestFilteredProducts = function _requestFilteredProdu2() {
              _requestFilteredProducts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var pathname, queryString, res;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        pathname = window.location.pathname; // URLSearchParams CONVERTS THE OBJECT INTO A QUERYSTRING.
                        // VERY LIMITED THOUGH BECAUSE IT DOES NOT WORK WITH RECURSIVE OBJECTS
                        // (in this case, look for qs or querystring modules)

                        queryString = new URLSearchParams(selectedFields).toString();
                        _context11.next = 4;
                        return (0, _ajaxCalls.loadData)("".concat(pathname, "?").concat(queryString));

                      case 4:
                        res = _context11.sent;
                        (0, _helpers.renderProductsCard)(res);

                      case 6:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));
              return _requestFilteredProducts.apply(this, arguments);
            };

            requestFilteredProducts = function _requestFilteredProdu() {
              return _requestFilteredProducts.apply(this, arguments);
            };

            _window$location = window.location, pathname = _window$location.pathname, search = _window$location.search;
            _context13.next = 7;
            return (0, _ajaxCalls.loadData)("".concat(pathname).concat(search));

          case 7:
            products = _context13.sent;
            // { status: "success", data: { [Array of Products], results: 4 } }
            selectedFields = {}; // EXPECTED RESULT: { size: ['l', 's', 'm'], color: ['red', 'green', 'blue'], sort: '-price' }

            lastSelectedFilter = ""; // USED TO REMOVE THE NATURE OF select TAG WHERE EACH TIME IT IS CLICKED WOULD SEND AN AJAX CALL
            // TO THE FILTER OPTION ALREADY SELECTED

            (0, _helpers.renderProductsCard)(products);

            filterProducts = /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(evt, filterType) {
                var isChecked, _evt$target$control$i, _evt$target$control$i2, query, filter;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        if (evt.target.classList.value.includes("checkbox-label")) {
                          isChecked = !evt.target.control.checked;
                          _evt$target$control$i = evt.target.control.id.split("-".concat(filterType)), _evt$target$control$i2 = _slicedToArray(_evt$target$control$i, 1), query = _evt$target$control$i2[0];
                          filter = {};
                          filter[filterType] = [query];
                          changeSelectedFieldsState(filter, isChecked);
                        }

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function filterProducts(_x4, _x5) {
                return _ref5.apply(this, arguments);
              };
            }();

            sortOptions.addEventListener("click", /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(evt) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!(evt.target.value != lastSelectedFilter)) {
                          _context5.next = 4;
                          break;
                        }

                        lastSelectedFilter = evt.target.value;
                        _context5.next = 4;
                        return changeSelectedFieldsState({
                          sort: lastSelectedFilter
                        });

                      case 4:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x6) {
                return _ref6.apply(this, arguments);
              };
            }());

            if (sexFilterOptions) {
              sexFilterOptions.addEventListener("click", /*#__PURE__*/function () {
                var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(evt) {
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          _context6.next = 2;
                          return filterProducts(evt, "sex");

                        case 2:
                          return _context6.abrupt("return", _context6.sent);

                        case 3:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6);
                }));

                return function (_x7) {
                  return _ref7.apply(this, arguments);
                };
              }());
            }

            categoryFilterOptions.addEventListener("click", /*#__PURE__*/function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(evt) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return filterProducts(evt, "category");

                      case 2:
                        return _context7.abrupt("return", _context7.sent);

                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x8) {
                return _ref8.apply(this, arguments);
              };
            }());
            sizeFilterOptions.addEventListener("click", /*#__PURE__*/function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(evt) {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return filterProducts(evt, "size");

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x9) {
                return _ref9.apply(this, arguments);
              };
            }());
            colorFilterOptions.addEventListener("click", /*#__PURE__*/function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(evt) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return filterProducts(evt, "color");

                      case 2:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x10) {
                return _ref10.apply(this, arguments);
              };
            }()); // REMIND TO IMPLEMENT AN ACCORDION IN FRONTEND

            priceFilter.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
              var priceRange, price;
              return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      priceRange = productsPage.querySelector("#amount").value;
                      price = priceRange.replace(/\$/g, "");
                      _context10.next = 4;
                      return changeSelectedFieldsState({
                        price: price
                      });

                    case 4:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _callee10);
            })));

          case 18:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }))();
}

if (cartAndWishlistPage) {
  var userId = document.querySelector(".nav-cart").dataset.userId;
  var updateCartButton = cartAndWishlistPage.querySelector(".update-cart");
  var couponForm = cartAndWishlistPage.querySelector(".coupon");
  var subtotalCart = cartAndWishlistPage.querySelector(".subtotal--cart");
  var totalCart = cartAndWishlistPage.querySelector(".total--cart");
  var updatedCartItems = [];
  var hasCoupon = false; // CHANGES STATE ON LINE 747

  var discountPercent; // CHANGES STATE ON LINE 748

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var _yield$loadData2, data, itemsContainer;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return (0, _ajaxCalls.loadData)("/users/".concat(userId, "/carts/"));

          case 2:
            _yield$loadData2 = _context15.sent;
            data = _yield$loadData2.data;
            (0, _helpers.renderProductsList)(data.cart);
            subtotalCart.innerText = "$ ".concat(data.value || 0);
            totalCart.innerText = "$ ".concat(data.value || 0);
            itemsContainer = cartAndWishlistPage.querySelectorAll(".cart_item");

            if (itemsContainer) {
              // EACH ITEM ADDED TO THE CART
              itemsContainer.forEach(function (item) {
                var buttons = item.querySelectorAll('input[type="button"]');
                var totalPrice = item.querySelector(".amount--total");
                var removeItem = item.querySelector(".remove");
                updatedCartItems.push({
                  id: item.dataset.productId
                }); // EACH BUTTON IN THE ITEM LIST

                buttons.forEach(function (button) {
                  button.addEventListener("click", function (evt) {
                    var clickedButton = evt.target;
                    var multiplier = Number(item.querySelector(".input-text").value);
                    var maxValue = Number(item.querySelector(".input-text").max);

                    var _item$querySelector$i = item.querySelector(".amount--product").innerText.split("$ "),
                        _item$querySelector$i2 = _slicedToArray(_item$querySelector$i, 2),
                        productValue = _item$querySelector$i2[1];

                    if (clickedButton.value === "+") {
                      if (multiplier !== maxValue) {
                        multiplier++;
                      }
                    } else {
                      if (multiplier !== 1) {
                        multiplier--;
                      }
                    }

                    totalPrice.innerText = "$ ".concat((productValue * multiplier).toFixed(2));
                    calculateTotalValue();
                  });
                });
                removeItem.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                  var productId, _yield$loadData3, data;

                  return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                      switch (_context14.prev = _context14.next) {
                        case 0:
                          productId = item.dataset.productId;
                          _context14.next = 3;
                          return (0, _ajaxCalls.deleteData)("/users/".concat(userId, "/carts/").concat(productId));

                        case 3:
                          // REMOVES THE ITEM LIST FROM THE DOM
                          item.parentElement.removeChild(item); // CALCULATES ALL THE ITEMS ADDED TO THE CART AFTER THERE WAS A REMOVAL

                          calculateTotalValue(); // UPDATED THE AMOUNT OF ITEMS IN THE CART ON NAVBAR

                          _context14.next = 7;
                          return (0, _ajaxCalls.loadData)("/users/".concat(userId, "/carts"));

                        case 7:
                          _yield$loadData3 = _context14.sent;
                          data = _yield$loadData3.data;
                          (0, _helpers.renderCartDropDown)({
                            cartItems: data.cart,
                            value: data.value
                          });

                        case 10:
                        case "end":
                          return _context14.stop();
                      }
                    }
                  }, _callee14);
                })));
              });
            }

          case 9:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }))();

  var calculateTotalValue = function calculateTotalValue() {
    var total = 0;
    var subTotal = 0;
    var updatedItemsContainer = cartAndWishlistPage.querySelectorAll(".cart_item");
    updatedItemsContainer.forEach(function (item) {
      var _item$querySelector$i3 = item.querySelector(".amount--total").innerText.split("$ "),
          _item$querySelector$i4 = _slicedToArray(_item$querySelector$i3, 2),
          currentValue = _item$querySelector$i4[1];

      total += hasCoupon ? Number(currentValue) - Number(currentValue) * (discountPercent / 100) : Number(currentValue);
      subTotal += Number(currentValue);
    });
    subtotalCart.innerText = "$ ".concat(subTotal.toFixed(2));
    totalCart.innerText = "$ ".concat(total.toFixed(2));
  };

  updateCartButton.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
    var index;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            updateCartButton.innerText = "Updating...";
            cartAndWishlistPage.querySelectorAll(".cart_item").forEach(function (item) {
              var _item$querySelectorAl = item.querySelectorAll(".select__product-list"),
                  _item$querySelectorAl2 = _slicedToArray(_item$querySelectorAl, 2),
                  size = _item$querySelectorAl2[0].value,
                  color = _item$querySelectorAl2[1].value;

              var quantity = item.querySelector(".qty").value;
              index = updatedCartItems.map(function (field) {
                return field.id;
              }).indexOf(item.dataset.productId);
              updatedCartItems[index] = {
                id: item.dataset.productId,
                size: size,
                color: color,
                quantity: quantity
              };
            });
            _context16.next = 4;
            return (0, _ajaxCalls.updateData)(updatedCartItems, "/users/".concat(userId, "/carts"));

          case 4:
            updateCartButton.innerText = "Update Cart";

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
  couponForm.addEventListener("submit", /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(evt) {
      var couponCode, _yield$loadData4, data, discountMarkup;

      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              evt.preventDefault();
              couponCode = couponForm.querySelector("input").value;
              _context17.next = 4;
              return (0, _ajaxCalls.loadData)("/coupons/user/".concat(userId, "/code/").concat(couponCode));

            case 4:
              _yield$loadData4 = _context17.sent;
              data = _yield$loadData4.data;

              if (data) {
                hasCoupon = true;
                discountPercent = data.discountPercent;
                discountMarkup = "\n          <tr class='discount'>\n            <th>".concat(couponCode, "</th>\n          <td>\n            <span>- ").concat(data.discountPercent, " %</span>\n          </td>\n          </tr>\n        ");
                document.querySelector(".order-total").insertAdjacentHTML("beforebegin", discountMarkup);
                calculateTotalValue();
                couponForm.querySelector("input").disabled = true;
                couponForm.querySelector("button").disabled = true;
                couponForm.querySelector("button").style.cursor = "not-allowed";
              } else {
                couponForm.insertAdjacentHTML("afterend", "<p>Please check if the provided coupon code is spelled correctly.</p>");
              }

              couponForm.querySelector("input").value = "";

            case 8:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x11) {
      return _ref15.apply(this, arguments);
    };
  }());
}
},{"./ajaxCalls":"ajaxCalls.js","./helpers":"helpers.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61433" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts.js"], null)
//# sourceMappingURL=/bundle.js.map