// d3-require Version 0.6.3. Copyright 2018 Observable, Inc.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var modules = new Map;
var queue = [];
var map = queue.map;
var some = queue.some;
var hasOwnProperty = queue.hasOwnProperty;

function resolve(name, base) {
  if (/^(\w+:)?\/\//i.test(name)) return name;
  if (/^[.]{0,2}\//i.test(name)) return new URL(name, base == null ? location : base).href;
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new Error("illegal name");
  return "https://unpkg.com/" + name;
}

var require = requireFrom(resolve);

function requireFrom(resolver) {
  var require = requireRelative(null);

  function requireRelative(base) {
    return function(name) {
      var url = resolver(name + "", base), module = modules.get(url);
      if (!module) modules.set(url, module = new Promise(function(resolve, reject) {
        var script = document.createElement("script");
        script.onload = function() {
          try { resolve(queue.pop()(requireRelative(url))); }
          catch (error) { reject(new Error("invalid module")); }
          script.remove();
        };
        script.onerror = function() {
          reject(new Error("unable to load module"));
          script.remove();
        };
        script.async = true;
        script.src = url;
        window.define = define;
        document.head.appendChild(script);
      }));
      return module;
    };
  }

  return function(name) {
    return arguments.length > 1 ? Promise.all(map.call(arguments, require)).then(merge) : require(name);
  };
}

function merge(modules) {
  var o = {}, i = -1, n = modules.length, m, k;
  while (++i < n) {
    for (k in (m = modules[i])) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
        else o[k] = m[k];
      }
    }
  }
  return o;
}

function getter(object, name) {
  return function() { return object[name]; };
}

function isexports(name) {
  return (name + "") === "exports";
}

function define(name, dependencies, factory) {
  if (arguments.length < 3) factory = dependencies, dependencies = name;
  if (arguments.length < 2) factory = dependencies, dependencies = [];
  queue.push(some.call(dependencies, isexports) ? function(require) {
    var exports = {};
    return Promise.all(map.call(dependencies, function(name) {
      return isexports(name += "") ? exports : require(name);
    })).then(function(dependencies) {
      factory.apply(null, dependencies);
      return exports;
    });
  } : function(require) {
    return Promise.all(map.call(dependencies, require)).then(function(dependencies) {
      return typeof factory === "function" ? factory.apply(null, dependencies) : factory;
    });
  });
}

define.amd = {};

exports.resolve = resolve;
exports.require = require;
exports.requireFrom = requireFrom;

Object.defineProperty(exports, '__esModule', { value: true });

})));
