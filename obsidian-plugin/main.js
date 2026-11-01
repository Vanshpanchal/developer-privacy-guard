"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/boundary/lib/index.js
var require_lib = __commonJS({
  "node_modules/boundary/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.binarySearch = exports.upperBound = exports.lowerBound = exports.compare = void 0;
    function compare(v1, v2) {
      return v1 < v2;
    }
    exports.compare = compare;
    function upperBound(array, value, comp = compare) {
      let len = array.length;
      let i = 0;
      while (len) {
        let diff = len >>> 1;
        let cursor = i + diff;
        if (comp(value, array[cursor])) {
          len = diff;
        } else {
          i = cursor + 1;
          len -= diff + 1;
        }
      }
      return i;
    }
    exports.upperBound = upperBound;
    function lowerBound(array, value, comp = compare) {
      let len = array.length;
      let i = 0;
      while (len) {
        let diff = len >>> 1;
        let cursor = i + diff;
        if (comp(array[cursor], value)) {
          i = cursor + 1;
          len -= diff + 1;
        } else {
          len = diff;
        }
      }
      return i;
    }
    exports.lowerBound = lowerBound;
    function binarySearch(array, value, comp = compare) {
      let cursor = lowerBound(array, value, comp);
      return cursor !== array.length && !comp(value, array[cursor]);
    }
    exports.binarySearch = binarySearch;
  }
});

// node_modules/structured-source/lib/structured-source.js
var require_structured_source = __commonJS({
  "node_modules/structured-source/lib/structured-source.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StructuredSource = void 0;
    var boundary_1 = require_lib();
    var StructuredSource2 = class {
      /**
       * @constructs StructuredSource
       * @param {string} source - source code text.
       */
      constructor(source) {
        this.indice = [0];
        let regexp = /[\r\n\u2028\u2029]/g;
        const length = source.length;
        regexp.lastIndex = 0;
        while (true) {
          let result = regexp.exec(source);
          if (!result) {
            break;
          }
          let index = result.index;
          if (source.charCodeAt(index) === 13 && source.charCodeAt(index + 1) === 10) {
            index += 1;
          }
          let nextIndex = index + 1;
          if (length < nextIndex) {
            break;
          }
          this.indice.push(nextIndex);
          regexp.lastIndex = nextIndex;
        }
      }
      get line() {
        return this.indice.length;
      }
      /**
       * @param {SourceLocation} loc - location indicator.
       * @return {[ number, number ]} range.
       */
      locationToRange(loc) {
        return [this.positionToIndex(loc.start), this.positionToIndex(loc.end)];
      }
      /**
       * @param {[ number, number ]} range - pair of indice.
       * @return {SourceLocation} location.
       */
      rangeToLocation(range) {
        return {
          start: this.indexToPosition(range[0]),
          end: this.indexToPosition(range[1])
        };
      }
      /**
       * @param {SourcePosition} pos - position indicator.
       * @return {number} index.
       */
      positionToIndex(pos) {
        let start = this.indice[pos.line - 1];
        return start + pos.column;
      }
      /**
       * @param {number} index - index to the source code.
       * @return {SourcePosition} position.
       */
      indexToPosition(index) {
        const startLine = (0, boundary_1.upperBound)(this.indice, index);
        return {
          line: startLine,
          column: index - this.indice[startLine - 1]
        };
      }
    };
    exports.StructuredSource = StructuredSource2;
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self2 = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/lodash.uniq/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.uniq/index.js"(exports, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayIncludes(array, value) {
      var length = array ? array.length : 0;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var splice = arrayProto.splice;
    var Map2 = getNative(root, "Map");
    var Set2 = getNative(root, "Set");
    var nativeCreate = getNative(Object, "create");
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function uniq(array) {
      return array && array.length ? baseUniq(array) : [];
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function noop() {
    }
    module2.exports = uniq;
  }
});

// node_modules/lodash.uniqwith/index.js
var require_lodash2 = __commonJS({
  "node_modules/lodash.uniqwith/index.js"(exports, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayIncludes(array, value) {
      var length = array ? array.length : 0;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var splice = arrayProto.splice;
    var Map2 = getNative(root, "Map");
    var Set2 = getNative(root, "Set");
    var nativeCreate = getNative(Object, "create");
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function uniqWith(array, comparator) {
      return array && array.length ? baseUniq(array, void 0, comparator) : [];
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function noop() {
    }
    module2.exports = uniqWith;
  }
});

// node_modules/lodash.sortby/index.js
var require_lodash3 = __commonJS({
  "node_modules/lodash.sortby/index.js"(exports, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var FUNC_ERROR_TEXT = "Expected a function";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var UNORDERED_COMPARE_FLAG = 1;
    var PARTIAL_COMPARE_FLAG = 2;
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var reLeadingDot = /^\./;
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reEscapeChar = /\\(\\)?/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayMap(array, iteratee) {
      var index = -1, length = array ? array.length : 0, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arraySome(array, predicate) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    var nativeKeys = overArg(Object.keys, Object);
    var nativeMax = Math.max;
    var DataView = getNative(root, "DataView");
    var Map2 = getNative(root, "Map");
    var Promise2 = getNative(root, "Promise");
    var Set2 = getNative(root, "Set");
    var WeakMap = getNative(root, "WeakMap");
    var nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    function stackClear() {
      this.__data__ = new ListCache();
    }
    function stackDelete(key) {
      return this.__data__["delete"](key);
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    var baseEach = createBaseEach(baseForOwn);
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    var baseFor = createBaseFor();
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }
    function baseGet(object, path) {
      path = isKey(path, object) ? [path] : castPath(path);
      var index = 0, length = path.length;
      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return index && index == length ? object : void 0;
    }
    function baseGetTag(value) {
      return objectToString.call(value);
    }
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }
    function baseIsEqual(value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }
    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
      if (!objIsArr) {
        objTag = getTag(object);
        objTag = objTag == argsTag ? objectTag : objTag;
      }
      if (!othIsArr) {
        othTag = getTag(other);
        othTag = othTag == argsTag ? objectTag : othTag;
      }
      var objIsObj = objTag == objectTag && !isHostObject(object), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
      }
      if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
    }
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length, length = index, noCustomizer = !customizer;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (noCustomizer && data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function baseMap(collection, iteratee) {
      var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
      baseEach(collection, function(value, key, collection2) {
        result[++index] = iteratee(value, key, collection2);
      });
      return result;
    }
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, void 0, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
      };
    }
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));
      var result = baseMap(collection, function(value, key, collection2) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { "criteria": criteria, "index": ++index, "value": value };
      });
      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }
    function baseRest(func, start) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
        var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
        if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
          return 1;
        }
        if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }
    function compareMultiple(object, other, orders) {
      var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == "desc" ? -1 : 1);
        }
      }
      return object.index - other.index;
    }
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
        while (fromRight ? index-- : ++index < length) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!seen.has(othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= UNORDERED_COMPARE_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    function hasPath(object, path, hasFunc) {
      path = isKey(path, object) ? [path] : castPath(path);
      var result, index = -1, length = path.length;
      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result) {
        return result;
      }
      var length = object ? object.length : 0;
      return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    }
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
      };
    }
    var stringToPath = memoize(function(string) {
      string = toString(string);
      var result = [];
      if (reLeadingDot.test(string)) {
        result.push("");
      }
      string.replace(rePropName, function(match, number, quote, string2) {
        result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
      });
      return result;
    });
    function toKey(value) {
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });
    function memoize(func, resolver) {
      if (typeof func != "function" || resolver && typeof resolver != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    }
    memoize.Cache = MapCache;
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    function get(object, path, defaultValue) {
      var result = object == null ? void 0 : baseGet(object, path);
      return result === void 0 ? defaultValue : result;
    }
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function identity(value) {
      return value;
    }
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }
    module2.exports = sortBy;
  }
});

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS({
  "node_modules/escape-string-regexp/index.js"(exports, module2) {
    "use strict";
    module2.exports = (string) => {
      if (typeof string !== "string") {
        throw new TypeError("Expected a string");
      }
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    };
  }
});

// node_modules/@textlint/regexp-string-matcher/lib/regexp-parse.js
var require_regexp_parse = __commonJS({
  "node_modules/@textlint/regexp-string-matcher/lib/regexp-parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isRegExpString = exports.parseRegExpString = void 0;
    var REGEXP_LITERAL_PATTERN = /^\/(.+)\/([guimysd]*)$/;
    var parseRegExpString = function(str) {
      var result = str.match(REGEXP_LITERAL_PATTERN);
      if (!result) {
        return null;
      }
      return {
        source: result[1],
        flagString: result[2]
      };
    };
    exports.parseRegExpString = parseRegExpString;
    var isRegExpString = function(str) {
      return REGEXP_LITERAL_PATTERN.test(str);
    };
    exports.isRegExpString = isRegExpString;
  }
});

// node_modules/@textlint/regexp-string-matcher/lib/regexp-string-matcher.js
var require_regexp_string_matcher = __commonJS({
  "node_modules/@textlint/regexp-string-matcher/lib/regexp-string-matcher.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.matchPatterns = exports.createRegExp = void 0;
    var lodash_uniq_1 = __importDefault(require_lodash());
    var lodash_uniqwith_1 = __importDefault(require_lodash2());
    var lodash_sortby_1 = __importDefault(require_lodash3());
    var escape_string_regexp_1 = __importDefault(require_escape_string_regexp());
    var regexp_parse_1 = require_regexp_parse();
    var DEFAULT_FLAGS = "ug";
    var defaultFlags = function(flagsString) {
      if (flagsString.length === 0) {
        return DEFAULT_FLAGS;
      }
      return (0, lodash_uniq_1.default)((flagsString + DEFAULT_FLAGS).split("")).join("");
    };
    var createRegExp = function(patternString, defaultFlag) {
      if (defaultFlag === void 0) {
        defaultFlag = DEFAULT_FLAGS;
      }
      if (patternString.length === 0) {
        throw new Error("Empty string can not handled");
      }
      if ((0, regexp_parse_1.isRegExpString)(patternString)) {
        var regExpStructure = (0, regexp_parse_1.parseRegExpString)(patternString);
        if (regExpStructure) {
          return new RegExp(regExpStructure.source, defaultFlags(regExpStructure.flagString));
        }
        throw new Error('"'.concat(patternString, '" can not parse as RegExp.'));
      } else {
        return new RegExp((0, escape_string_regexp_1.default)(patternString), defaultFlag);
      }
    };
    exports.createRegExp = createRegExp;
    var isEqualMatchPatternResult = function(a, b) {
      return a.startIndex === b.startIndex && a.endIndex === b.endIndex && a.match === b.match;
    };
    var matchPatterns5 = function(text, regExpLikeStrings) {
      var matchPatternResults = [];
      regExpLikeStrings.map(function(patternString) {
        return (0, exports.createRegExp)(patternString);
      }).forEach(function(regExp) {
        var results = text.matchAll(regExp);
        Array.from(results).forEach(function(result) {
          if (result.index === void 0) {
            return;
          }
          var match = result[0];
          var index = result.index;
          matchPatternResults.push({
            match,
            captures: result.slice(1),
            startIndex: index,
            endIndex: index + match.length
          });
        });
      });
      var uniqResults = (0, lodash_uniqwith_1.default)(matchPatternResults, isEqualMatchPatternResult);
      return (0, lodash_sortby_1.default)(uniqResults, ["startIndex", "endIndex"]);
    };
    exports.matchPatterns = matchPatterns5;
  }
});

// obsidian-plugin/src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PrivacyGuardPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/core/Types.ts
var CATEGORIES = ["credential", "cloud", "git", "database", "web-auth", "third-party", "private-key", "network", "personal", "infrastructure", "framework", "custom"];
var DEFAULT_SETTINGS = { defaultProfile: "balanced", limit: 1e5, enabledCategories: [...CATEGORIES], customRules: [], confidentialIdentifiers: [], protectedDomains: [], retainMappings: true };

// obsidian-plugin/src/ui/PrivacyGuardView.ts
var import_obsidian = require("obsidian");

// src/core/TokenMapper.ts
var TokenMapper = class {
  values = /* @__PURE__ */ new Map();
  counts = /* @__PURE__ */ new Map();
  token(type, value) {
    const key = `${type}\0${value}`;
    let token = this.values.get(key);
    if (!token) {
      const next = (this.counts.get(type) ?? 0) + 1;
      this.counts.set(type, next);
      token = `[${type}_${next}]`;
      this.values.set(key, token);
    }
    return token;
  }
  clear() {
    this.values.clear();
    this.counts.clear();
  }
};

// src/core/MatchResolver.ts
function resolve(matches) {
  const sorted = [...matches].sort((a, b) => b.priority - a.priority || b.end - b.start - (a.end - a.start) || a.start - b.start || a.ruleId.localeCompare(b.ruleId));
  const accepted = [];
  for (const m of sorted) if (m.start < m.end && !accepted.some((a) => m.start < a.end && a.start < m.end)) accepted.push(m);
  return accepted.sort((a, b) => a.start - b.start);
}

// src/core/RedactionEngine.ts
function redact(input, detections, profile, mapper) {
  const parts = [];
  let cursor = 0;
  for (const d of detections) {
    if (d.action === "REVIEW" || d.action === "TOKENIZE" && profile === "credentials") continue;
    parts.push(input.slice(cursor, d.start));
    parts.push(d.action === "TOKENIZE" ? mapper.token(d.tokenType ?? "IDENTIFIER", input.slice(d.start, d.end)) : d.replacement);
    cursor = d.end;
  }
  parts.push(input.slice(cursor));
  return parts.join("");
}

// src/detectors/common.ts
function add(emit, category, ruleId, start, end, action, replacement, priority = 50, tokenType) {
  emit({ category, ruleId, start, end, action, replacement, priority, tokenType, confidence: priority >= 80 ? "HIGH" : priority >= 40 ? "MEDIUM" : "LOW" });
}
function scanRegex(text, re, fn) {
  re.lastIndex = 0;
  let m;
  while (m = re.exec(text)) {
    fn(m);
    if (m[0].length === 0) re.lastIndex++;
  }
}
function valueOffset(m, value) {
  return m.index + m[0].lastIndexOf(value);
}
function normalizeKey(key) {
  return key.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
}

// src/detectors/PrivateKeys.ts
function privateKeys(text, emit) {
  scanRegex(text, /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g, (m) => add(emit, "private-key", "pem-private-key", m.index, m.index + m[0].length, "REDACT", "[REDACTED_PRIVATE_KEY]", 100));
}
function hasUnclosedPrivateKey(text) {
  const begins = (text.match(/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g) ?? []).length;
  const ends = (text.match(/-----END (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g) ?? []).length;
  return begins !== ends;
}

// src/detectors/ProviderSecrets.ts
function providerSecrets(text, emit) {
  const rules = [
    ["aws-access-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, "cloud", "[REDACTED_AWS_ACCESS_KEY]"],
    ["github-token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/g, "git", "[REDACTED_GITHUB_TOKEN]"],
    ["gitlab-token", /\bglpat-[A-Za-z0-9_-]{20,}\b/g, "git", "[REDACTED_GITLAB_TOKEN]"],
    ["npm-token", /\bnpm_[A-Za-z0-9]{36}\b/g, "git", "[REDACTED_NPM_TOKEN]"],
    ["stripe-key", /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g, "third-party", "[REDACTED_STRIPE_KEY]"],
    ["openai-key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g, "third-party", "[REDACTED_API_KEY]"],
    ["anthropic-key", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g, "third-party", "[REDACTED_API_KEY]"],
    ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{12,}\b/g, "third-party", "[REDACTED_SLACK_TOKEN]"],
    ["sendgrid-key", /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g, "third-party", "[REDACTED_SENDGRID_KEY]"],
    ["huggingface-token", /\bhf_[A-Za-z0-9]{30,}\b/g, "third-party", "[REDACTED_API_KEY]"]
  ];
  for (const [id, re, category, replacement] of rules) scanRegex(text, re, (m) => add(emit, category, id, m.index, m.index + m[0].length, "REDACT", replacement, 90));
}

// src/detectors/GenericSecrets.ts
var SECRET_KEYS = /^(?:.*_)?(?:api_key|secret|secret_key|client_secret|password|passwd|pwd|access_token|refresh_token|auth_token|session_token|private_key|signing_key|jwt_secret|smtp_password|db_password|credential|credentials|connection_password|account_key|ci_job_token|runner_token|deployment_token)$/;
function genericSecrets(text, emit) {
  scanRegex(text, /(?<![A-Za-z0-9_.-])(?:["']?)([A-Za-z][\w.-]{1,70})(?:["']?)\s*(?::|=>|=)\s*(?:"((?:\\.|[^"\\]){1,1000000})"|'((?:\\.|[^'\\]){1,1000000})'|([^,;}\]\r\n"'{\[]{1,1000000}))/gm, (m) => {
    const key = normalizeKey(m[1]);
    const value = (m[2] ?? m[3] ?? m[4]).trim();
    if (!SECRET_KEYS.test(key) || /^(?:null|none|undefined|true|false|changeme|example|placeholder|your_.*|<.*>|\$\{.*\})$/i.test(value)) return;
    const start = valueOffset(m, value);
    add(emit, "credential", "credential-assignment", start, start + value.length, "REDACT", key.includes("password") || key === "pwd" || key === "passwd" ? "[REDACTED_PASSWORD]" : "[REDACTED_SECRET]", 75);
  });
  scanRegex(text, /<([A-Za-z][\w.-]{1,70})>([^<\r\n]{1,1000000})<\/\1>/g, (m) => {
    if (!SECRET_KEYS.test(normalizeKey(m[1]))) return;
    const start = valueOffset(m, m[2]);
    add(emit, "credential", "xml-secret", start, start + m[2].length, "REDACT", "[REDACTED_SECRET]", 75);
  });
}

// src/detectors/WebAuthentication.ts
function webAuthentication(text, emit) {
  scanRegex(text, /\b(?:Authorization\s*:\s*)?(?:Bearer|Basic)\s+([A-Za-z0-9._~+\/=:-]{8,})/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "web-auth", "authorization", start, start + m[1].length, "REDACT", "[REDACTED_AUTH_TOKEN]", 88);
  });
  scanRegex(text, /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, (m) => add(emit, "web-auth", "jwt", m.index, m.index + m[0].length, "REDACT", "[REDACTED_JWT]", 85));
  scanRegex(text, /\b(?:set-cookie|cookie)\s*:\s*[^\r\n]*/gi, (m) => {
    const re = /(?:^|;\s*)([\w-]*(?:session|auth|token|jwt)[\w-]*)=([^;\s]+)/gi;
    let c;
    while (c = re.exec(m[0])) {
      const start = m.index + c.index + c[0].lastIndexOf(c[2]);
      add(emit, "web-auth", "auth-cookie", start, start + c[2].length, "REDACT", "[REDACTED_COOKIE]", 82);
    }
  });
}

// src/detectors/DatabaseSecrets.ts
function databaseSecrets(text, emit) {
  scanRegex(text, /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"'<>]{1,1000000}/gi, (m) => {
    const url = m[0];
    const auth = url.match(/^([a-z+]+:\/\/)([^@\/?#]+)@/i);
    if (auth) {
      const colon = auth[2].indexOf(":");
      if (colon >= 0) {
        const start = m.index + auth[1].length + colon + 1;
        add(emit, "database", "database-url-password", start, start + auth[2].length - colon - 1, "REDACT", "[REDACTED_PASSWORD]", 85);
      }
    }
  });
  scanRegex(text, /\b(?:Password|Pwd)\s*=\s*([^;\r\n]{1,1000000})/gi, (m) => {
    const v = m[1].trim();
    const start = m.index + m[0].lastIndexOf(v);
    add(emit, "database", "connection-password", start, start + v.length, "REDACT", "[REDACTED_PASSWORD]", 80);
  });
}

// src/detectors/Identifiers.ts
function luhn(s) {
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = +s[i];
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}
function identifiers(text, emit, profile) {
  if (profile === "credentials") return;
  const strict = profile === "strict";
  scanRegex(text, /\b\d{12}\b/g, (m) => {
    if (/\b(?:account|aws_account|account_id)\b.{0,24}$/i.test(text.slice(Math.max(0, m.index - 35), m.index)) || strict) add(emit, "cloud", "aws-account", m.index, m.index + 12, "TOKENIZE", "", 55, "AWS_ACCOUNT");
  });
  scanRegex(text, /\barn:aws:[a-z0-9-]+:[a-z0-9-]*:\d{12}:[^\s"']+/gi, (m) => add(emit, "cloud", "aws-arn", m.index, m.index + m[0].length, "TOKENIZE", "", 60, "AWS_ARN"));
  scanRegex(text, /\bs3:\/\/([a-z0-9.-]{3,63})/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "cloud", "s3-bucket", start, start + m[1].length, "TOKENIZE", "", 55, "S3_BUCKET");
  });
  scanRegex(text, /\b(?:10|127|192\.168|172\.(?:1[6-9]|2\d|3[01]))(?:\.\d{1,3}){2}\b/g, (m) => {
    const parts = m[0].split(".").map(Number);
    if (parts.every((n) => n <= 255) && (strict || !m[0].startsWith("127."))) add(emit, "network", "private-ip", m.index, m.index + m[0].length, "TOKENIZE", "", 50, "INTERNAL_IP");
  });
  scanRegex(text, /\b(?:fc|fd)[0-9a-f]{0,2}:[0-9a-f:]{2,39}\b/gi, (m) => {
    try {
      new URL(`http://[${m[0]}]/`);
      add(emit, "network", "private-ipv6", m.index, m.index + m[0].length, "TOKENIZE", "", 45, "INTERNAL_IP");
    } catch {
    }
  });
  scanRegex(text, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, (m) => add(emit, "personal", "email", m.index, m.index + m[0].length, "TOKENIZE", "", 55, "USER_EMAIL"));
  scanRegex(text, /\b(?:customer|user|employee|deployment|cluster)[_. -]?id\s*[:=]\s*["']?([\w-]{4,80})/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "personal", "structured-id", start, start + m[1].length, "TOKENIZE", "", 55, m[0].toLowerCase().includes("deployment") ? "DEPLOYMENT_ID" : "USER_ID");
  });
  scanRegex(text, /\b[A-Z]{5}\d{4}[A-Z]\b/g, (m) => add(emit, "personal", "indian-pan", m.index, m.index + m[0].length, "TOKENIZE", "", 50, "PAN"));
  scanRegex(text, /\b(?:\d[ -]?){13,19}\b/g, (m) => {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length >= 13 && digits.length <= 19 && luhn(digits)) add(emit, "personal", "credit-card", m.index, m.index + m[0].length, "TOKENIZE", "", 65, "CARD");
  });
}

// src/detectors/CustomRules.ts
function validateRule(rule) {
  if (!/^[a-z][a-z0-9-]{1,50}$/.test(rule.id)) return "Invalid rule ID";
  if (rule.pattern.length > 300 || !rule.pattern) return "Pattern must be 1\u2013300 characters";
  let inClass = false;
  for (let i = 0; i < rule.pattern.length; i++) {
    const ch = rule.pattern[i];
    if (ch === "\\") {
      if (/[1-9]/.test(rule.pattern[i + 1] ?? "")) return "Backreferences are disabled";
      i++;
      continue;
    }
    if (ch === "[") {
      inClass = true;
      continue;
    }
    if (ch === "]") {
      inClass = false;
      continue;
    }
    if (inClass) continue;
    if (/[()*+?|}]/.test(ch)) return "Groups, alternation and unbounded quantifiers are disabled";
    if (ch === "{") {
      const repeat = /^\{(\d+)(?:,(\d+))?\}/.exec(rule.pattern.slice(i));
      if (!repeat || Number(repeat[2] ?? repeat[1]) > 100 || Number(repeat[2] ?? repeat[1]) < Number(repeat[1])) return "Only bounded repeats up to 100 are allowed";
      i += repeat[0].length - 1;
    }
  }
  try {
    new RegExp(rule.pattern, "gu");
  } catch {
    return "Invalid regular expression";
  }
  return null;
}
function customRules(text, emit, rules) {
  for (const rule of rules.filter((r) => r.enabled)) {
    const err = validateRule(rule);
    if (err) throw new Error(`Custom rule ${rule.id}: ${err}`);
    if (rule.keywords?.length && !rule.keywords.some((k) => text.toLowerCase().includes(k.toLowerCase()))) continue;
    scanRegex(text, new RegExp(rule.pattern, "gu"), (m) => add(emit, "custom", rule.id, m.index, m.index + m[0].length, rule.policy, rule.policy === "REDACT" ? "[REDACTED_CUSTOM]" : "", 70, "CUSTOM"));
  }
}

// src/detectors/CloudIdentifiers.ts
function cloudIdentifiers(text, emit, profile) {
  if (profile === "credentials") return;
  scanRegex(text, /\b(?:subscription|tenant|project)[_. -]?id\s*[:=]\s*["']?([a-f0-9-]{20,80})/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "cloud", "cloud-project-id", start, start + m[1].length, "TOKENIZE", "", 55, "CLOUD_ID");
  });
  scanRegex(text, /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.iam\.gserviceaccount\.com\b/g, (m) => add(emit, "cloud", "gcp-service-account", m.index, m.index + m[0].length, "TOKENIZE", "", 65, "SERVICE_ACCOUNT"));
  if (profile === "strict") scanRegex(text, /\b(?:[a-z0-9-]+\.)+(?:internal|corp|local)\b/gi, (m) => {
    if (m[0] !== "localhost") add(emit, "network", "internal-domain", m.index, m.index + m[0].length, "TOKENIZE", "", 50, "INTERNAL_HOST");
  });
}

// src/detectors/Infrastructure.ts
function infrastructure(text, emit, profile) {
  scanRegex(text, /\b(?:dockerconfigjson|\.dockerconfigjson)\s*[:=]\s*["']?([A-Za-z0-9+/=]{20,})/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "infrastructure", "docker-auth", start, start + m[1].length, "REDACT", "[REDACTED_DOCKER_AUTH]", 85);
  });
  scanRegex(text, /\b(?:data\s*:\s*\n\s*)?(?:token|password|clientSecret)\s*:\s*([A-Za-z0-9+/=]{20,})/gi, (m) => {
    if (!/\b(?:kind\s*:\s*Secret|docker|kubernetes)/i.test(text.slice(Math.max(0, m.index - 200), m.index))) return;
    const start = valueOffset(m, m[1]);
    add(emit, "infrastructure", "k8s-secret", start, start + m[1].length, "REDACT", "[REDACTED_SECRET]", 82);
  });
  if (profile !== "credentials") scanRegex(text, /\b(?:deployment|cluster)[_. -]?(?:name|id)\s*[:=]\s*["']?([a-z0-9][a-z0-9._-]{3,80})/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "infrastructure", "infra-id", start, start + m[1].length, "TOKENIZE", "", 55, m[0].toLowerCase().includes("cluster") ? "CLUSTER_ID" : "DEPLOYMENT_ID");
  });
}

// src/detectors/PersonalInformation.ts
function verhoeff(value) {
  const d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
  const p = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]];
  let c = 0;
  for (const [i, ch] of [...value].reverse().entries()) c = d[c][p[i % 8][Number(ch)]];
  return c === 0;
}
function personalInformation(text, emit, profile) {
  if (profile === "credentials") return;
  scanRegex(text, /\b(?:aadhaar|aadhar)[_. -]?(?:number|id|no)?\s*[:=]\s*["']?([2-9]\d{3}[ -]?\d{4}[ -]?\d{4})\b/gi, (m) => {
    const digits = m[1].replace(/\D/g, "");
    if (verhoeff(digits)) {
      const start = valueOffset(m, m[1]);
      add(emit, "personal", "aadhaar", start, start + m[1].length, "TOKENIZE", "", 70, "AADHAAR");
    }
  });
  scanRegex(text, /\b(?:phone|mobile|telephone)[_. -]?(?:number|no)?\s*[:=]\s*["']?(\+?\d[\d ()-]{7,18}\d)/gi, (m) => {
    const digits = m[1].replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 15) {
      const start = valueOffset(m, m[1]);
      add(emit, "personal", "phone", start, start + m[1].length, "TOKENIZE", "", 55, "PHONE");
    }
  });
  scanRegex(text, /\b(?:first_name|last_name|full_name|customer_name)\s*[:=]\s*["']([^"'\r\n]{2,80})["']/gi, (m) => {
    const start = valueOffset(m, m[1]);
    add(emit, "personal", "known-name", start, start + m[1].length, "TOKENIZE", "", 50, "PERSON_NAME");
  });
}

// src/detectors/NetworkSecrets.ts
function networkSecrets(text, emit) {
  scanRegex(text, /\bhttps?:\/\/[^\s"'<>]{1,1000000}/gi, (m) => {
    const auth = m[0].match(/^https?:\/\/([^/?#@]+)@/i);
    if (!auth) return;
    const colon = auth[1].indexOf(":");
    if (colon < 0) return;
    const start = m.index + m[0].indexOf(auth[1]) + colon + 1;
    add(emit, "network", "url-password", start, start + auth[1].length - colon - 1, "REDACT", "[REDACTED_PASSWORD]", 82);
  });
}

// src/core/Scanner.ts
function scan(input, profile, settings, mapper = new TokenMapper(), extra = []) {
  if (input.length > settings.limit || input.length > 1e6) throw new Error("Input exceeds configured character limit");
  if (settings.confidentialIdentifiers.length > 100 || settings.protectedDomains.length > 100 || [...settings.confidentialIdentifiers, ...settings.protectedDomains].some((v) => v.length > 200)) throw new Error("Too many or overly long session identifiers");
  if (hasUnclosedPrivateKey(input)) throw new Error("Incomplete private key block: output blocked");
  const start = performance.now();
  const found = [...extra];
  const emit = (d) => {
    if (settings.enabledCategories.includes(d.category)) found.push(d);
  };
  const format = /^\s*[\[{]/.test(input) ? "JSON-like" : /^\s*<\?xml|<\w+>/.test(input) ? "XML-like" : /^[A-Z_]+=/m.test(input) ? "environment-like" : "plain text";
  privateKeys(input, emit);
  providerSecrets(input, emit);
  genericSecrets(input, emit);
  databaseSecrets(input, emit);
  webAuthentication(input, emit);
  networkSecrets(input, emit);
  identifiers(input, emit, profile);
  cloudIdentifiers(input, emit, profile);
  infrastructure(input, emit, profile);
  personalInformation(input, emit, profile);
  customRules(input, emit, settings.customRules);
  for (const value of settings.confidentialIdentifiers.filter((v) => v.length >= 3)) {
    let p = 0;
    while ((p = input.indexOf(value, p)) !== -1) {
      emit({ ruleId: "confidential-identifier", category: "custom", start: p, end: p + value.length, action: "TOKENIZE", replacement: "", priority: 65, tokenType: "CUSTOM", confidence: "MEDIUM" });
      p += value.length;
    }
  }
  for (const domain of settings.protectedDomains.filter((v) => v.length >= 3)) {
    let p = 0;
    while ((p = input.indexOf(domain, p)) !== -1) {
      emit({ ruleId: "protected-domain", category: "network", start: p, end: p + domain.length, action: "TOKENIZE", replacement: "", priority: 60, tokenType: "PRIVATE_DOMAIN", confidence: "MEDIUM" });
      p += domain.length;
    }
  }
  const detections = resolve(found);
  const output = redact(input, detections, profile, mapper);
  return { output, detections: detections.map((d) => ({ ruleId: d.ruleId, category: d.category, start: d.start, end: d.end, confidence: d.confidence, action: d.action, replacement: d.replacement })), durationMs: performance.now() - start, profile, format, warnings: ["Review output before sharing. Pattern matching cannot guarantee removal of all sensitive data.", ...profile === "credentials" ? ["Credentials Only leaves infrastructure and personal identifiers visible."] : []] };
}

// node_modules/@secretlint/core/module/SecretLintSourceCodeImpl.js
var import_structured_source = __toESM(require_structured_source(), 1);

// node_modules/@secretlint/core/module/helper/invariant.js
function invariant(condition, message) {
  if (!condition)
    throw new Error(message);
}

// node_modules/@secretlint/core/module/SecretLintSourceCodeImpl.js
var SecretLintSourceCodeImpl = class {
  hasBOM;
  content;
  filePath;
  physicalFilePath;
  contentType;
  ext;
  structuredSource;
  constructor({ content = "", ext, filePath, physicalFilePath, contentType }) {
    invariant(ext || filePath, "should be set either of fileExt or filePath.");
    this.hasBOM = content.charCodeAt(0) === 65279;
    this.content = this.hasBOM ? content.slice(1) : content;
    this.structuredSource = new import_structured_source.StructuredSource(this.content);
    this.filePath = filePath;
    this.physicalFilePath = physicalFilePath;
    this.contentType = contentType;
    this.ext = ext;
  }
  /**
   * get file path
   * This return `undefined` if the source code is created without file path.
   * For example, use core API to create a source code directly.
   *
   * You can use this path to detect file type.
   * However, if you want to read the file content, use `getPhysicalFilePath` instead.
   * @returns {string|undefined}
   */
  getFilePath() {
    return this.filePath;
  }
  /**
   * get physical file path
   * This return `undefined` if the source code is not related to file.
   * For example, the source code is given from the stdin.
   *
   * You can use this path to read the file content.
   */
  getPhysicalFilePath() {
    return this.physicalFilePath;
  }
  /**
   * @param {SecretLintSourceNodeLocation} loc - location indicator.
   * @return {[ number, number ]} range.
   */
  locationToRange(loc) {
    return this.structuredSource.locationToRange(loc);
  }
  /**
   * @param {[ number, number ]} range - pair of indice.
   * @return {SecretLintSourceNodeLocation} location.
   */
  rangeToLocation(range) {
    const location = this.structuredSource.rangeToLocation(range);
    return {
      start: {
        line: location.start.line,
        column: location.start.column
      },
      end: {
        line: location.end.line,
        column: location.end.column
      }
    };
  }
  /**
   * @param {Position} pos - position indicator.
   * @return {number} index.
   */
  positionToIndex(pos) {
    return this.structuredSource.positionToIndex(pos);
  }
  /**
   * @param {number} index - index to the source code.
   * @return {Position} position.
   */
  indexToPosition(index) {
    const position = this.structuredSource.indexToPosition(index);
    return {
      line: position.line,
      column: position.column
    };
  }
};

// node_modules/@secretlint/core/module/helper/promise-event-emitter.js
var EventEmitter = class {
  #listeners = /* @__PURE__ */ new Map();
  on(type, listener) {
    const prevSet = this.#listeners.get(type);
    const listenerSet = prevSet ?? /* @__PURE__ */ new Set();
    listenerSet?.add(listener);
    this.#listeners.set(type, listenerSet);
  }
  emit(type, ...args) {
    const listenerSet = this.#listeners.get(type);
    if (!listenerSet) {
      return;
    }
    for (const listenerSetElement of listenerSet) {
      listenerSetElement(...args);
    }
  }
  off(type, listener) {
    const listenerSet = this.#listeners.get(type);
    if (!listenerSet) {
      return;
    }
    for (const listenerSetElement of listenerSet) {
      if (listenerSetElement === listener) {
        listenerSet.delete(listener);
      }
    }
  }
  removeAllListeners() {
    this.#listeners.clear();
  }
  listenerCount(type) {
    return this.#listeners.get(type)?.size ?? 0;
  }
  listeners(type) {
    return Array.from(this.#listeners.get(type) ?? []);
  }
};
var PromiseEventEmitter = class {
  events;
  constructor() {
    this.events = new EventEmitter();
  }
  listenerCount(type) {
    return this.events.listenerCount(type);
  }
  on(event, listener) {
    return this.events.on(event, listener);
  }
  emit(event, ...args) {
    const promises = [];
    this.events.listeners(event).forEach((listener) => {
      promises.push(listener(...args));
    });
    return Promise.all(promises);
  }
};

// node_modules/@secretlint/core/module/helper/SecretLintRuleMessageTranslator.js
var DEFAULT_LOCAL = "en";
var formatMessage = (messageHandler, props) => {
  if (typeof props !== "object" || props === null) {
    return messageHandler();
  }
  return messageHandler(props);
};
var getMatchedLocaleMessage = (locale, locales) => {
  const localKeys = Object.keys(locales);
  const matchLocale = localKeys.find((key) => {
    return key === locale;
  });
  if (matchLocale) {
    return matchLocale;
  }
  const [lang] = locale.split("-");
  if (!lang) {
    return DEFAULT_LOCAL;
  }
  const fallbackMatchLocal = localKeys.find((key) => {
    return key === lang;
  });
  if (fallbackMatchLocal) {
    return fallbackMatchLocal;
  }
  return DEFAULT_LOCAL;
};
var createTranslator = (messages7, options) => {
  return (messageId, props) => {
    const messageHandler = messages7[messageId];
    if (!messageHandler) {
      throw new Error(`messages:${String(messageId)} is missing in messages.`);
    }
    if (typeof messageHandler === "function") {
      if (typeof messageId !== "string") {
        throw new Error(`message's key:${String(messageId)} should be string`);
      }
      return {
        message: formatMessage(messageHandler, props),
        messageId,
        data: props
      };
    }
    const defaultLocal = options && options.defaultLocale ? options.defaultLocale : DEFAULT_LOCAL;
    const locale = getMatchedLocaleMessage(defaultLocal, messageHandler);
    const localizedMessage = messageHandler[locale];
    if (!localizedMessage) {
      if (messageHandler[DEFAULT_LOCAL]) {
        throw new Error(`messages${String(messageId)}.${locale} is missing in messages.`);
      }
      throw new Error(`message's key:${String(messageId)}.${DEFAULT_LOCAL} should be defined in messages.`);
    }
    if (typeof messageId !== "string") {
      throw new Error(`message's key:${String(messageId)}.${DEFAULT_LOCAL} should be string`);
    }
    return {
      message: formatMessage(localizedMessage, props),
      messageId,
      data: props
    };
  };
};

// node_modules/@secretlint/core/module/RuleContext.js
var createContextEvents = () => {
  const contextEvents = new EventEmitter();
  const REPORT_SYMBOL = Symbol("report");
  const IGNORE_SYMBOL = Symbol("ignore");
  return {
    report(descriptor) {
      contextEvents.emit(REPORT_SYMBOL, descriptor);
    },
    onReport(handler) {
      const listener = (descriptor) => {
        handler(descriptor);
      };
      contextEvents.on(REPORT_SYMBOL, listener);
      return () => {
        contextEvents.off(REPORT_SYMBOL, listener);
      };
    },
    ignore(descriptor) {
      contextEvents.emit(IGNORE_SYMBOL, descriptor);
    },
    onIgnore(handler) {
      const listener = (descriptor) => {
        handler(descriptor);
      };
      contextEvents.on(IGNORE_SYMBOL, listener);
      return () => {
        contextEvents.off(IGNORE_SYMBOL, listener);
      };
    }
  };
};
var createRuleContext = ({ ruleId, ruleParentId, meta, severity, sourceCode, contextEvents, sharedOptions, locale }) => {
  return {
    sharedOptions,
    createTranslator: (messages7) => {
      return createTranslator(messages7, {
        defaultLocale: locale
      });
    },
    ignore(descriptor) {
      const { message } = descriptor.message;
      contextEvents.ignore({
        type: "ignore",
        ruleId,
        ruleParentId,
        range: descriptor.range,
        targetRuleId: descriptor.targetRuleId,
        loc: sourceCode.rangeToLocation(descriptor.range),
        message
      });
    },
    report(descriptor) {
      const { message, messageId, data } = descriptor.message;
      const severityLevel = severity ?? "error";
      if (ruleParentId) {
        contextEvents.report({
          ...descriptor,
          type: "message",
          ruleId,
          ruleParentId,
          loc: sourceCode.rangeToLocation(descriptor.range),
          severity: severityLevel,
          message,
          messageId,
          docsUrl: meta.docs?.url ? `${meta.docs.url}#${messageId}` : void 0,
          data
        });
      } else {
        contextEvents.report({
          ...descriptor,
          type: "message",
          ruleId,
          loc: sourceCode.rangeToLocation(descriptor.range),
          severity: severityLevel,
          message,
          messageId,
          docsUrl: meta.docs?.url ? `${meta.docs.url}#${messageId}` : void 0,
          data
        });
      }
    }
  };
};

// node_modules/@secretlint/core/module/SecretLintRuleImpl.js
var SecretLintRule = class {
  ruleReportHandle;
  ruleCreator;
  descriptorRule;
  constructor({ descriptorRule, context }) {
    this.descriptorRule = descriptorRule;
    this.ruleCreator = descriptorRule.rule;
    const ruleCreatorOptions = descriptorRule.options || {};
    this.ruleReportHandle = this.ruleCreator.create(context, ruleCreatorOptions);
  }
  allowMessageIds() {
    if (!this.descriptorRule.allowMessageIds) {
      return [];
    }
    const ruleId = this.ruleCreator.meta.id;
    return this.descriptorRule.allowMessageIds.map((allowMessageId) => {
      return {
        messageId: allowMessageId,
        ruleId
      };
    });
  }
  supportSourceCode(sourceCode) {
    const contentType = sourceCode.contentType;
    if (contentType === "unknown") {
      return true;
    }
    if (this.ruleCreator.meta.supportedContentTypes.includes("all")) {
      return true;
    }
    return this.ruleCreator.meta.supportedContentTypes.includes(contentType);
  }
  async file(source) {
    const file = this.ruleReportHandle.file;
    if (!file) {
      return;
    }
    return file(source);
  }
};

// node_modules/@secretlint/profiler/module/index.js
var SecretLintProfiler = class {
  perf;
  entries = [];
  measures = [];
  executionPromises = [];
  constructor(options) {
    this.perf = options.perf;
    const pattern = /(.*?)::end(\|\|.*)?/;
    const observer = new options.PerformanceObserver((items) => {
      const entries = items.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "mark") {
          const match = entry.name.match(pattern);
          const endIdentifier = match ? match[1] : void 0;
          const suffix = match && match[2] ? match[2] : "";
          if (endIdentifier) {
            const startIdentifier = `${endIdentifier}::start`;
            this.entries.find((savedEntry) => {
              return savedEntry.name === startIdentifier;
            });
            if (startIdentifier) {
              this.executionPromises.push(Promise.resolve().then(() => {
                this.perf.measure(endIdentifier + suffix, `${endIdentifier}::start${suffix}`, `${endIdentifier}::end${suffix}`);
              }));
            }
          }
          this.entries.push(entry);
        } else if (entry.entryType === "measure") {
          this.measures.push(entry);
        }
      });
    });
    observer.observe({ entryTypes: ["mark", "measure"] });
  }
  mark(marker) {
    if ("id" in marker) {
      this.perf.mark(`${marker.type}||${marker.id}`);
    } else {
      this.perf.mark(marker.type);
    }
  }
  waifForExecutionPromises = () => {
    return Promise.all(this.executionPromises).finally(() => {
      this.executionPromises.length = 0;
    });
  };
  async getEntries() {
    await this.waifForExecutionPromises();
    return this.entries;
  }
  async getMeasures() {
    await this.waifForExecutionPromises();
    return this.measures;
  }
};

// node_modules/@secretlint/profiler/module/browser.js
var secretLintProfiler = new SecretLintProfiler({
  perf: performance,
  PerformanceObserver
});

// node_modules/@secretlint/core/module/RunningEvents.js
var createRunningEvents = () => {
  const contextEvents = new PromiseEventEmitter();
  const registerSet = /* @__PURE__ */ new Set();
  const LINT_HANDLE = Symbol("lint:start");
  const rules = [];
  return {
    collectAllowMessageIds() {
      const allowMessageIds = [];
      rules.forEach((rule) => {
        allowMessageIds.push(...rule.allowMessageIds());
      });
      return allowMessageIds;
    },
    /**
     * Start to run linting
     * @param options
     */
    runLint(options) {
      return contextEvents.emit(LINT_HANDLE, options);
    },
    registerRule({ descriptorRule, context }) {
      if (registerSet.has(descriptorRule.id)) {
        throw new Error(`rule.id:${descriptorRule.id} is already registered.
                
Duplicated rule.id is something wrong in .secretlintrc.                
`);
      }
      registerSet.add(descriptorRule.id);
      const rule = new SecretLintRule({
        descriptorRule,
        context
      });
      rules.push(rule);
      contextEvents.on(LINT_HANDLE, async ({ sourceCode }) => {
        secretLintProfiler.mark({
          type: "@core>rule-handler::start",
          id: descriptorRule.rule.meta.id
        });
        if (rule.supportSourceCode(sourceCode)) {
          await rule.file(sourceCode);
        }
        secretLintProfiler.mark({
          type: "@core>rule-handler::end",
          id: descriptorRule.rule.meta.id
        });
      });
    },
    registerRulePreset({ descriptorRulePreset, context }) {
      const rulePresetCreatorOptions = descriptorRulePreset.options || [];
      descriptorRulePreset.rule.create(context, rulePresetCreatorOptions);
    },
    isRegistered(ruleId) {
      return registerSet.has(ruleId);
    }
  };
};

// node_modules/@secretlint/core/module/RulePresetContext.js
var createRulePresetContext = ({ configRulePreset, sourceCode, runningEvents, contextEvents, sharedOptions, locale }) => {
  const presetRules = configRulePreset.rules || [];
  if (!Array.isArray(presetRules)) {
    console.error(`${configRulePreset.id}:PresetRules is invalid format`, presetRules);
    throw new Error("preset's rules should be an array of rule definitions");
  }
  return {
    sharedOptions,
    registerRule(rule, defaultValue) {
      const descriptorRule = presetRules.find((descriptorRule2) => {
        return descriptorRule2.id === rule.meta.id;
      });
      const descriptorRuleOptions = descriptorRule ? descriptorRule.options : void 0;
      const descriptorRuleDisabled = descriptorRule ? descriptorRule.disabled : void 0;
      const descriptorRuleSeverity = descriptorRule ? descriptorRule.severity : void 0;
      const descriptorAllowMessageIds = descriptorRule ? descriptorRule.allowMessageIds : void 0;
      const context = createRuleContext({
        // rule id is a single rule in a preset
        ruleId: rule.meta.id,
        // parent rule id is rule preset id
        ruleParentId: configRulePreset.id,
        meta: rule.meta,
        severity: descriptorRuleSeverity,
        sourceCode,
        contextEvents,
        sharedOptions,
        locale
      });
      const defaultValueOfPreset = defaultValue ? defaultValue : {};
      runningEvents.registerRule({
        descriptorRule: {
          // options and disabled ...
          ...defaultValueOfPreset,
          // Prefer to use user setting
          // User can override preset setting
          ...descriptorRule,
          id: rule.meta.id,
          options: descriptorRuleOptions,
          rule,
          disabled: descriptorRuleDisabled,
          allowMessageIds: descriptorAllowMessageIds,
          severity: descriptorRuleSeverity
        },
        context
      });
    }
  };
};

// node_modules/@secretlint/core/module/messages/filter-ignored-process.js
var isContainedRange = (index, range) => {
  const [start, end] = range;
  return start <= index && index <= end;
};
function filterIgnoredMessages(options) {
  const reportedMessages = options.reportedMessages;
  const ignoreMessages = options.ignoredMessages;
  return reportedMessages.filter((message) => {
    return !ignoreMessages.some((ignoreMessage) => {
      const isInIgnoringRange = isContainedRange(message.range[0], ignoreMessage.range) && isContainedRange(message.range[1], ignoreMessage.range);
      if (isInIgnoringRange && ignoreMessage.targetRuleId) {
        if (ignoreMessage.targetRuleId === "*") {
          return true;
        }
        return message.ruleId === ignoreMessage.targetRuleId;
      }
      return isInIgnoringRange;
    });
  });
}

// node_modules/@secretlint/core/module/messages/MessageProcessManager.js
var createMessageProcessor = (processors) => {
  return {
    /**
     * process `messages` with registered processes
     */
    process(messages7) {
      const originalMessages = messages7;
      if (processors.length === 0) {
        throw new Error("processors should be > 0");
      }
      return processors.reduce((messages8, filter) => {
        return filter(messages8);
      }, originalMessages);
    }
  };
};

// node_modules/@secretlint/core/module/messages/filter-duplicated-process.js
var isEqualMessage = (aMessage, bMessage) => {
  return aMessage.range[0] === bMessage.range[0] && aMessage.range[1] === bMessage.range[1] && "severity" in aMessage && "severity" in bMessage && aMessage.severity === bMessage.severity && aMessage.message === bMessage.message;
};
function filterDuplicatedMessages(messages7 = []) {
  return messages7.filter((message, index) => {
    const restMessages = messages7.slice(index + 1);
    return !restMessages.some((restMessage) => {
      return isEqualMessage(message, restMessage);
    });
  });
}

// node_modules/@secretlint/core/module/messages/sort-messages-process.js
function sortMessagesByLocation(messages7) {
  return messages7.sort(function(a, b) {
    const startIndexDiff = a.range[0] - b.range[0];
    if (startIndexDiff === 0) {
      return a.range[1] - b.range[1];
    } else {
      return startIndexDiff;
    }
  });
}

// node_modules/@secretlint/core/module/messages/filter-message-id.js
var filterByAllowMessageIds = (messages7, allowMessageIds) => {
  const disabledSet = new Set(allowMessageIds.map((allowMessage) => {
    return `${allowMessage.ruleId}--${allowMessage.messageId}`;
  }));
  return messages7.filter((message) => {
    return !disabledSet.has(`${message.ruleId}--${message.messageId}`);
  });
};

// node_modules/@secretlint/core/module/messages/filter-mask-secrets.js
var deepMask = (object, handler) => {
  for (const key of Object.keys(object)) {
    if (typeof object[key] === "object") {
      object[key] = deepMask(object[key], handler);
    } else if (Array.isArray(object[key])) {
      object[key] = object[key].map((item) => deepMask(item, handler));
    } else if (typeof object[key] === "string") {
      object[key] = handler(object[key]);
    }
  }
  return object;
};
var createMaskValue = (value) => {
  return "*".repeat(value.length);
};
var maskWithValues = (str, maskedValues) => {
  let result = str;
  for (const maskValue of maskedValues) {
    result = result.replaceAll(maskValue, "*".repeat(maskValue.length));
  }
  return result;
};
var filterMaskSecretsData = (messages7 = []) => {
  return messages7.map((message) => {
    if (message.type !== "message") {
      return message;
    }
    const maskedValues = [];
    const maskedData = message.data ? deepMask(message.data, (value) => {
      maskedValues.push(value);
      return createMaskValue(value);
    }) : void 0;
    if (!maskedData) {
      return message;
    }
    const maskedMessage = maskWithValues(message.message, maskedValues);
    return {
      ...message,
      message: maskedMessage,
      data: maskedData
    };
  });
};

// node_modules/@secretlint/core/module/messages/index.js
var cleanupMessages = (options) => {
  const reportedMessages = filterIgnoredMessages(options);
  const reportedMessagesWithoutAllowMessageIds = filterByAllowMessageIds(reportedMessages, options.allowMessageIds);
  const filters = options.maskSecrets ? [filterDuplicatedMessages, filterMaskSecretsData] : [filterDuplicatedMessages];
  const filterProcess = createMessageProcessor(filters);
  return sortMessagesByLocation(filterProcess.process(reportedMessagesWithoutAllowMessageIds));
};

// node_modules/@secretlint/core/module/index.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("@secretlint/core");
var lintSource = ({ source, options }) => {
  secretLintProfiler.mark({
    type: "@core>lint::start",
    id: source.filePath
  });
  debug(`source filePath: %O`, source.filePath);
  debug(`options: %O`, options);
  const rules = options.config.rules;
  const locale = options.locale ?? "en";
  const maskSecrets = options.maskSecrets ?? false;
  const contextEvents = createContextEvents();
  const runningEvents = createRunningEvents();
  const reportedMessages = [];
  const ignoredMessages = [];
  contextEvents.onReport((message) => {
    reportedMessages.push(message);
  });
  contextEvents.onIgnore((message) => {
    ignoredMessages.push(message);
  });
  const sourceCode = new SecretLintSourceCodeImpl({
    content: source.content,
    filePath: source.filePath,
    physicalFilePath: options.noPhysicFilePath ? void 0 : source.filePath,
    ext: source.ext || "",
    contentType: source.contentType
  });
  secretLintProfiler.mark({
    type: "@core>setup-rules::start"
  });
  rules.forEach((rule) => {
    secretLintProfiler.mark({
      type: "@core>setup-rule::start",
      id: rule.rule.meta.id
    });
    registerRule({
      sourceCode,
      config: options.config,
      descriptorRule: rule,
      contextEvents,
      runningEvents,
      locale
    });
    secretLintProfiler.mark({
      type: "@core>setup-rule::end",
      id: rule.rule.meta.id
    });
  });
  secretLintProfiler.mark({
    type: "@core>setup-rules::end"
  });
  return runningEvents.runLint({
    sourceCode
  }).then(() => {
    return {
      filePath: source.filePath,
      // binary content should be skipped
      sourceContent: source.contentType === "text" ? source.content : void 0,
      sourceContentType: source.contentType,
      messages: cleanupMessages({
        reportedMessages,
        ignoredMessages,
        allowMessageIds: runningEvents.collectAllowMessageIds(),
        maskSecrets
      })
    };
  }).finally(() => {
    secretLintProfiler.mark({
      type: "@core>lint::end",
      id: source.filePath
    });
  });
};
var isRulePreset = (ruleDescriptor) => {
  return ruleDescriptor.rule.meta.type === "preset";
};
var isRule = (ruleDescriptor) => {
  return ruleDescriptor.rule.meta.type === "scanner";
};
var registerRule = ({ sourceCode, config, descriptorRule, contextEvents, runningEvents, locale }) => {
  const ruleId = descriptorRule.id;
  if (descriptorRule.disabled) {
    debug("Skip registerRule %s, because it is disabled", ruleId);
    return;
  }
  debug("registerRule %s", ruleId);
  const sharedOptionsWithDefault = config.sharedOptions ?? {};
  if (isRulePreset(descriptorRule)) {
    const context = createRulePresetContext({
      configRulePreset: descriptorRule,
      sourceCode,
      contextEvents,
      runningEvents,
      sharedOptions: sharedOptionsWithDefault,
      locale
    });
    runningEvents.registerRulePreset({
      descriptorRulePreset: descriptorRule,
      context
    });
    return;
  } else if (isRule(descriptorRule)) {
    const context = createRuleContext({
      ruleId,
      severity: descriptorRule.severity,
      meta: descriptorRule.rule.meta,
      sourceCode,
      contextEvents,
      sharedOptions: sharedOptionsWithDefault,
      locale
    });
    runningEvents.registerRule({
      descriptorRule,
      context
    });
    return;
  }
  throw new Error(`Unknown descriptor type: ${descriptorRule}`);
};

// node_modules/@secretlint/secretlint-rule-aws/module/index.js
var import_regexp_string_matcher = __toESM(require_regexp_string_matcher(), 1);
var BUILTIN_IGNORED = {
  AWSAccountID: ["AKIAIOSFODNN7EXAMPLE"],
  AWSSecretAccessKey: ["wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"]
};
var messages = {
  AWSAccountID: {
    en: (props) => `found AWS Account ID: ${props.ID}`,
    ja: (props) => `AWS Account ID: ${props.ID} \u304C\u307F\u3064\u304B\u308A\u307E\u3057\u305F`
  },
  AWSSecretAccessKey: {
    en: (props) => `found AWS Secret Access Key: ${props.KEY}`,
    ja: (props) => `AWS Secret Access Key: ${props.KEY} \u304C\u307F\u3064\u304B\u308A\u307E\u3057\u305F`
  },
  AWSAccessKeyID: {
    en: (props) => `found AWS Access Key ID: ${props.ID}`,
    ja: (props) => `AWS Access Key Id: ${props.ID} \u304C\u307F\u3064\u304B\u308A\u307E\u3057\u305F`
  }
};
var reportAWSAccessKey = ({ t, source, context, options }) => {
  const AWSAccessKeyIDPattern = /\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g;
  const results = source.content.matchAll(AWSAccessKeyIDPattern);
  for (const result of results) {
    const index = result.index || 0;
    const match = result[0] || "";
    const range = [index, index + match.length];
    if (BUILTIN_IGNORED.AWSAccountID.includes(match)) {
      continue;
    }
    const allowedResults = (0, import_regexp_string_matcher.matchPatterns)(match, options.allows);
    if (allowedResults.length > 0) {
      continue;
    }
    context.report({
      message: t("AWSAccessKeyID", {
        ID: match
      }),
      range
    });
  }
};
var reportAWSSecretAccessKey = ({ t, source, context, options }) => {
  const AWS = "(?:AWS|aws|Aws)?_?";
  const QUOTE = `["']?`;
  const CONNECT = "\\s*(?::|=>|=)\\s*";
  const AWSSecretPatten = new RegExp(String.raw`${QUOTE}${AWS}(?:SECRET|secret|Secret)_?(?:ACCESS|access|Access)_?(?:KEY|key|Key)${QUOTE}${CONNECT}${QUOTE}([A-Za-z0-9/\+=]{40})${QUOTE}\b`, "g");
  const results = source.content.matchAll(AWSSecretPatten);
  for (const result of results) {
    const index = result.index || 0;
    const match = result[1] || "";
    const range = [index, index + match.length];
    if (BUILTIN_IGNORED.AWSSecretAccessKey.includes(match)) {
      continue;
    }
    const allowedResults = (0, import_regexp_string_matcher.matchPatterns)(match, options.allows);
    if (allowedResults.length > 0) {
      continue;
    }
    context.report({
      message: t("AWSSecretAccessKey", {
        KEY: match
      }),
      range
    });
  }
};
var reportAWSAccountID = ({ t, source, context, options }) => {
  const AWS = "(AWS|aws|Aws)?_?";
  const QUOTE = `("|')?`;
  const CONNECT = "\\s*(:|=>|=)\\s*";
  const AWSSecretPatten = new RegExp(String.raw`${QUOTE}${AWS}(ACCOUNT|account|Account)_?(ID|id|Id)?${QUOTE}${CONNECT}${QUOTE}[0-9]{4}\-?[0-9]{4}\-?[0-9]{4}${QUOTE}\b`, "g");
  const results = source.content.matchAll(AWSSecretPatten);
  for (const result of results) {
    const index = result.index || 0;
    const match = result[0] || "";
    const range = [index, index + match.length];
    const allowedResults = (0, import_regexp_string_matcher.matchPatterns)(match, options.allows);
    if (allowedResults.length > 0) {
      continue;
    }
    context.report({
      message: t("AWSAccountID", {
        ID: match
      }),
      range
    });
  }
};
var creator = {
  messages,
  meta: {
    id: "@secretlint/secretlint-rule-aws",
    recommended: true,
    type: "scanner",
    supportedContentTypes: ["text"],
    docs: {
      url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-aws/README.md"
    }
  },
  create(context, options) {
    const normalizedOptions = {
      allows: options.allows || [],
      enableIDScanRule: options.enableIDScanRule ?? false
    };
    const t = context.createTranslator(messages);
    return {
      file(source) {
        if (normalizedOptions.enableIDScanRule) {
          reportAWSAccessKey({ t, source, context, options: normalizedOptions });
          reportAWSAccountID({ t, source, context, options: normalizedOptions });
        }
        reportAWSSecretAccessKey({ t, source, context, options: normalizedOptions });
      }
    };
  }
};

// node_modules/@secretlint/secretlint-rule-github/module/index.js
var import_regexp_string_matcher2 = __toESM(require_regexp_string_matcher(), 1);
var messages2 = {
  GITHUB_TOKEN: {
    en: (props) => `found GitHub Token(${props.typeName}): ${props.KEY}`,
    ja: (props) => `GitHub Token(${props.typeName})\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\uFF1A ${props.KEY}`
  }
};
var typeMap = /* @__PURE__ */ new Map([
  ["ghp", "GitHub personal access tokens"],
  ["gho", "OAuth access tokens"],
  ["ghu", "GitHub user-to-server tokens"],
  ["ghs", "GitHub server-to-server tokens"],
  ["ghr", "refresh tokens"],
  ["github_pat", "fine-grained personal access tokens"]
]);
var validChecksum = (_token) => {
  return true;
};
function reportIfFoundKey({ pattern, source, options, context, t }) {
  const results = source.content.matchAll(pattern);
  for (const result of results) {
    const index = result.index || 0;
    const type = result.groups?.type;
    const typeName = typeMap.get(type);
    if (!typeName) {
      throw new Error("Unknown type:" + typeName);
    }
    const match = result[0] || "";
    if (!validChecksum(match)) {
      continue;
    }
    const range = [index, index + match.length];
    const allowedResults = (0, import_regexp_string_matcher2.matchPatterns)(match, options.allows);
    if (allowedResults.length > 0) {
      continue;
    }
    context.report({
      message: t("GITHUB_TOKEN", {
        KEY: match,
        typeName
      }),
      range
    });
  }
}
var creator2 = {
  messages: messages2,
  meta: {
    id: "@secretlint/secretlint-rule-github",
    recommended: true,
    type: "scanner",
    supportedContentTypes: ["text"],
    docs: {
      url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-github/README.md"
    }
  },
  create(context, options) {
    const CLASSIC_GITHUB_TOKEN_PATTERN = /(?<!\p{L})(?<type>ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}(?![A-Za-z0-9_])/gu;
    const FINE_GRAINED_GITHUB_TOKEN_PATTERN = /(?<!\p{L})(?<type>github_pat)_[A-Za-z0-9_]{82}(?![A-Za-z0-9_])/gu;
    const GITHUB_APP_INSTALLATION_TOKEN_PATTERN = /(?<!\p{L})(?<type>ghs)_[0-9]{1,20}_[A-Za-z0-9_-]{1,1000}\.[A-Za-z0-9_-]{1,10000}\.[A-Za-z0-9_-]{1,1000}(?![A-Za-z0-9_-])/gu;
    const patterns = [
      CLASSIC_GITHUB_TOKEN_PATTERN,
      FINE_GRAINED_GITHUB_TOKEN_PATTERN,
      GITHUB_APP_INSTALLATION_TOKEN_PATTERN
    ];
    const t = context.createTranslator(messages2);
    const normalizedOptions = {
      allows: options.allows || []
    };
    return {
      file(source) {
        for (const pattern of patterns) {
          reportIfFoundKey({ pattern, source, options: normalizedOptions, context, t });
        }
      }
    };
  }
};

// node_modules/@secretlint/secretlint-rule-gitlab/module/index.js
var import_regexp_string_matcher3 = __toESM(require_regexp_string_matcher(), 1);
var messages3 = {
  GITLAB_PERSONAL_ACCESS_TOKEN: {
    en: (props) => `found GitLab Personal Access Token: ${props.KEY}`,
    ja: (props) => `GitLab Personal Access Token\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F: ${props.KEY}`
  }
};
function reportIfFoundKey2({ pattern, source, options, context, t }) {
  const results = source.content.matchAll(pattern);
  for (const result of results) {
    const index = result.index ?? 0;
    const match = result[0] ?? "";
    const range = [index, index + match.length];
    const allowedResults = (0, import_regexp_string_matcher3.matchPatterns)(match, options.allows);
    if (allowedResults.length > 0) {
      continue;
    }
    context.report({
      message: t("GITLAB_PERSONAL_ACCESS_TOKEN", {
        KEY: match
      }),
      range
    });
  }
}
var creator3 = {
  messages: messages3,
  meta: {
    id: "@secretlint/secretlint-rule-gitlab",
    recommended: true,
    type: "scanner",
    supportedContentTypes: ["text"],
    docs: {
      url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-gitlab/README.md"
    }
  },
  create(context, options) {
    const GITLAB_PERSONAL_ACCESS_TOKEN_PATTERN = /(?<!\p{L})glpat-[A-Za-z0-9_-]{20,128}(?![A-Za-z0-9_-])/gu;
    const patterns = [GITLAB_PERSONAL_ACCESS_TOKEN_PATTERN];
    const t = context.createTranslator(messages3);
    const normalizedOptions = {
      allows: options.allows ?? []
    };
    return {
      file(source) {
        for (const pattern of patterns) {
          reportIfFoundKey2({ pattern, source, options: normalizedOptions, context, t });
        }
      }
    };
  }
};

// node_modules/@secretlint/secretlint-rule-openai/module/index.js
var messages4 = {
  OPENAI_TOKEN: {
    en: (props) => `found OpenAI API token: ${props.TOKEN}`,
    ja: (props) => `OpenAI API \u30C8\u30FC\u30AF\u30F3: ${props.TOKEN} \u304C\u307F\u3064\u304B\u308A\u307E\u3057\u305F`
  }
};
var creator4 = {
  messages: messages4,
  meta: {
    id: "@secretlint/secretlint-rule-openai",
    recommended: true,
    type: "scanner",
    supportedContentTypes: ["text"],
    docs: {
      url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-openai/README.md"
    }
  },
  create(context) {
    const t = context.createTranslator(messages4);
    return {
      file(source) {
        const pattern = /sk-(?:proj|svcacct|admin)-(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})T3BlbkFJ(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})\b|sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}/g;
        const matches = source.content.matchAll(pattern);
        for (const match of matches) {
          const index = match.index ?? 0;
          const matchString = match[0] ?? "";
          const range = [index, index + matchString.length];
          context.report({
            message: t("OPENAI_TOKEN", {
              TOKEN: matchString
            }),
            range
          });
        }
      }
    };
  }
};

// node_modules/@secretlint/secretlint-rule-anthropic/module/index.js
var messages5 = {
  ANTHROPIC_API_KEY: {
    en: (props) => `found Anthropic Claude API key: ${props.KEY}`,
    ja: (props) => `Anthropic Claude API \u30AD\u30FC: ${props.KEY} \u304C\u307F\u3064\u304B\u308A\u307E\u3057\u305F`
  }
};
var creator5 = {
  messages: messages5,
  meta: {
    id: "@secretlint/secretlint-rule-anthropic",
    recommended: true,
    type: "scanner",
    supportedContentTypes: ["text"],
    docs: {
      url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-anthropic/README.md"
    }
  },
  create(context) {
    const t = context.createTranslator(messages5);
    return {
      file(source) {
        const pattern = /(?<!\p{L})sk-ant-api0\d-[A-Za-z0-9_-]{90,128}AA(?![A-Za-z0-9_-])/gu;
        const matches = source.content.matchAll(pattern);
        for (const match of matches) {
          const index = match.index ?? 0;
          const matchString = match[0] ?? "";
          const range = [index, index + matchString.length];
          context.report({
            message: t("ANTHROPIC_API_KEY", {
              KEY: matchString
            }),
            range
          });
        }
      }
    };
  }
};

// node_modules/@secretlint/secretlint-rule-stripe/module/index.js
var import_regexp_string_matcher4 = __toESM(require_regexp_string_matcher(), 1);
var messages6 = {
  STRIPE_SECRET_KEY_LIVE: {
    en: (props) => `found Stripe Live Secret Key: ${props.KEY}`,
    ja: (props) => `Stripe Live Secret Key\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F: ${props.KEY}`
  },
  STRIPE_SECRET_KEY_TEST: {
    en: (props) => `found Stripe Test Secret Key: ${props.KEY}`,
    ja: (props) => `Stripe Test Secret Key\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F: ${props.KEY}`
  },
  STRIPE_RESTRICTED_KEY_LIVE: {
    en: (props) => `found Stripe Live Restricted Key: ${props.KEY}`,
    ja: (props) => `Stripe Live Restricted Key\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F: ${props.KEY}`
  },
  STRIPE_RESTRICTED_KEY_TEST: {
    en: (props) => `found Stripe Test Restricted Key: ${props.KEY}`,
    ja: (props) => `Stripe Test Restricted Key\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F: ${props.KEY}`
  }
};
var messageIdMap = {
  sk_live: "STRIPE_SECRET_KEY_LIVE",
  sk_test: "STRIPE_SECRET_KEY_TEST",
  rk_live: "STRIPE_RESTRICTED_KEY_LIVE",
  rk_test: "STRIPE_RESTRICTED_KEY_TEST"
};
var STRIPE_KEY_PATTERN = /(?<!\p{L})(?<prefix>sk_live|sk_test|rk_live|rk_test)_[a-zA-Z0-9]{24,99}(?![a-zA-Z0-9])/gu;
function reportIfFound({ source, options, context, t }) {
  const results = source.content.matchAll(STRIPE_KEY_PATTERN);
  for (const result of results) {
    const index = result.index ?? 0;
    const match = result[0] ?? "";
    const prefix = result.groups?.["prefix"];
    if (!prefix) {
      continue;
    }
    const range = [index, index + match.length];
    const allowedResults = (0, import_regexp_string_matcher4.matchPatterns)(match, options.allows);
    if (allowedResults.length > 0) {
      continue;
    }
    context.report({
      message: t(messageIdMap[prefix], {
        KEY: match
      }),
      range
    });
  }
}
var creator6 = {
  messages: messages6,
  meta: {
    id: "@secretlint/secretlint-rule-stripe",
    recommended: true,
    type: "scanner",
    supportedContentTypes: ["text"],
    docs: {
      url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-stripe/README.md"
    }
  },
  create(context, options) {
    const t = context.createTranslator(messages6);
    const normalizedOptions = {
      allows: options.allows ?? []
    };
    return {
      file(source) {
        reportIfFound({ source, options: normalizedOptions, context, t });
      }
    };
  }
};

// src/detectors/SecretlintRules.ts
async function secretlintRules(text, enabled) {
  const candidates = [
    { id: "@secretlint/secretlint-rule-aws", rule: creator, category: "cloud" },
    { id: "@secretlint/secretlint-rule-github", rule: creator2, category: "git" },
    { id: "@secretlint/secretlint-rule-gitlab", rule: creator3, category: "git" },
    { id: "@secretlint/secretlint-rule-openai", rule: creator4, category: "third-party" },
    { id: "@secretlint/secretlint-rule-anthropic", rule: creator5, category: "third-party" },
    { id: "@secretlint/secretlint-rule-stripe", rule: creator6, category: "third-party" }
  ];
  const active = candidates.filter((x) => enabled.includes(x.category));
  if (active.length === 0) return [];
  const result = await lintSource({
    source: { content: text, filePath: "pasted.txt", contentType: "text" },
    options: { noPhysicFilePath: true, maskSecrets: true, config: { rules: active.map(({ id, rule }) => ({ id, rule })) } }
  });
  return result.messages.map((m) => {
    const category = candidates.find((x) => x.id === m.ruleId)?.category ?? "credential";
    return { ruleId: m.ruleId, category, start: m.range[0], end: m.range[1], confidence: "HIGH", action: "REDACT", replacement: "[REDACTED_SECRET]", priority: 95 };
  });
}

// src/core/AsyncScanner.ts
async function scanAsync(input, profile, settings, mapper) {
  if (input.length > settings.limit || input.length > 1e6) throw new Error("Input exceeds limit");
  if (input.length <= 1e5) {
    const extra = await secretlintRules(input, settings.enabledCategories);
    return scan(input, profile, settings, mapper, extra);
  }
  const chunks = [];
  let start = 0;
  while (start < input.length) {
    let end = Math.min(start + 64e3, input.length);
    if (end < input.length) {
      const newline = input.lastIndexOf("\n", end);
      if (newline < start) throw new Error("Line exceeds safe chunk size");
      end = newline + 1;
    }
    chunks.push(input.slice(start, end));
    start = end;
  }
  const detections = [];
  const outputs = [];
  let durationMs = 0;
  let offset = 0;
  let format = "plain text";
  const warnings = /* @__PURE__ */ new Set();
  for (const chunk of chunks) {
    await new Promise((resolve2) => setTimeout(resolve2, 0));
    const extra = await secretlintRules(chunk, settings.enabledCategories);
    const r = scan(chunk, profile, settings, mapper, extra);
    if (offset === 0) format = r.format;
    outputs.push(r.output);
    detections.push(...r.detections.map((d) => ({ ...d, start: d.start + offset, end: d.end + offset })));
    durationMs += r.durationMs;
    offset += chunk.length;
    r.warnings.forEach((w) => warnings.add(w));
  }
  return { output: outputs.join(""), detections, durationMs, profile, warnings: [...warnings], format };
}

// src/core/CopyPolicy.ts
async function copySanitized(result, write) {
  if (!result) throw new Error("No successful scan is available to copy");
  await write(result.output);
}

// obsidian-plugin/src/ui/PrivacyGuardView.ts
var VIEW_TYPE = "developer-privacy-guard";
var PrivacyGuardView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  input;
  output;
  profile;
  summary;
  warning;
  count;
  identifiers;
  domains;
  sanitize;
  copy;
  mapper = new TokenMapper();
  result;
  busy = false;
  generation = 0;
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Developer Privacy Guard";
  }
  getIcon() {
    return "shield-check";
  }
  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass("dpg-view");
    const header = root.createDiv({ cls: "dpg-header" });
    header.createEl("h2", { cls: "dpg-title", text: "Developer Privacy Guard" });
    header.createEl("p", { text: "Sanitize pasted logs and code locally, then review before sharing." });
    const inputSection = root.createDiv({ cls: "dpg-section" });
    const inputHead = inputSection.createDiv({ cls: "dpg-section-head" });
    inputHead.createEl("h3", { text: "Input" });
    this.count = inputHead.createEl("span", { cls: "dpg-count", text: "0 characters \xB7 0 bytes" });
    this.input = inputSection.createEl("textarea", { cls: "dpg-input", attr: { "aria-label": "Raw input", "placeholder": "Paste logs, configuration, or source code\u2026", "spellcheck": "false" } });
    this.input.addEventListener("input", () => this.onInputChanged());
    const controls = root.createDiv({ cls: "dpg-controls" });
    const profileLabel = controls.createEl("label", { cls: "dpg-profile" });
    profileLabel.createEl("span", { text: "Protection profile" });
    this.profile = profileLabel.createEl("select", { attr: { "aria-label": "Protection profile" } });
    for (const [value, label] of [["strict", "Strict"], ["balanced", "Balanced"], ["credentials", "Credentials Only"]]) {
      const option = this.profile.createEl("option", { text: label, value });
      option.value = value;
    }
    this.profile.value = this.plugin.settings.defaultProfile;
    this.profile.addEventListener("change", () => {
      this.invalidate();
      this.updateWarning();
    });
    this.sanitize = controls.createEl("button", { text: "Sanitize", cls: "mod-cta" });
    this.sanitize.disabled = true;
    this.sanitize.addEventListener("click", () => void this.runScan());
    const clear = controls.createEl("button", { text: "Clear session" });
    clear.addEventListener("click", () => this.clearSession());
    const advanced = root.createEl("details", { cls: "dpg-advanced" });
    advanced.createEl("summary", { text: "Session rules (optional)" });
    advanced.createEl("p", { text: "One value per line. These stay in memory until the panel closes." });
    const identifiersLabel = advanced.createEl("label", { cls: "dpg-rule-label" });
    identifiersLabel.createEl("span", { text: "Confidential identifiers" });
    this.identifiers = identifiersLabel.createEl("textarea", { cls: "dpg-rule-input", attr: { "aria-label": "Confidential identifiers, one per line", "placeholder": "One identifier per line", "spellcheck": "false" } });
    const domainsLabel = advanced.createEl("label", { cls: "dpg-rule-label" });
    domainsLabel.createEl("span", { text: "Protected domains" });
    this.domains = domainsLabel.createEl("textarea", { cls: "dpg-rule-input", attr: { "aria-label": "Protected domains, one per line", "placeholder": "One domain per line", "spellcheck": "false" } });
    this.identifiers.addEventListener("input", () => this.invalidate());
    this.domains.addEventListener("input", () => this.invalidate());
    this.warning = root.createDiv({ cls: "dpg-warning", attr: { role: "status", "aria-live": "polite" } });
    this.updateWarning();
    const summarySection = root.createDiv({ cls: "dpg-section" });
    summarySection.createEl("h3", { text: "Detection summary" });
    this.summary = summarySection.createDiv({ cls: "dpg-summary", text: "No scan yet." });
    const outputSection = root.createDiv({ cls: "dpg-section" });
    const outputHead = outputSection.createDiv({ cls: "dpg-section-head" });
    outputHead.createEl("h3", { text: "Sanitized output" });
    this.copy = outputHead.createEl("button", { text: "Copy output" });
    this.copy.disabled = true;
    this.copy.addEventListener("click", () => void this.copyOutput());
    this.output = outputSection.createEl("textarea", { cls: "dpg-output", attr: { "aria-label": "Sanitized output", "readonly": "true", "spellcheck": "false" } });
    root.createEl("p", { cls: "dpg-footnote", text: "A completed scan cannot guarantee that all sensitive data was found." });
  }
  updateAvailability() {
    if (this.sanitize && this.input) this.sanitize.disabled = this.busy || this.input.value.length === 0 || this.input.value.length > this.plugin.settings.limit;
  }
  updateWarning() {
    if (!this.warning) return;
    if (this.input && this.input.value.length > this.plugin.settings.limit) {
      this.warning.setText(`Input exceeds the ${this.plugin.settings.limit.toLocaleString()} character limit. No output can be copied.`);
    } else if (this.profile?.value === "credentials") {
      this.warning.setText("Credentials Only leaves most personal and infrastructure identifiers visible.");
    } else this.warning.setText("");
  }
  onInputChanged() {
    if (!this.input || !this.count) return;
    const value = this.input.value;
    this.count.setText(`${value.length.toLocaleString()} characters \xB7 ~${new TextEncoder().encode(value).length.toLocaleString()} bytes`);
    this.invalidate();
    this.updateWarning();
  }
  invalidate() {
    this.generation++;
    this.result = void 0;
    if (this.output) this.output.value = "";
    if (this.copy) this.copy.disabled = true;
    if (this.summary) this.summary.setText("Input changed. Sanitize again.");
    this.updateAvailability();
  }
  async runScan() {
    if (this.busy || !this.input || !this.profile || !this.input.value || this.input.value.length > this.plugin.settings.limit) return;
    this.busy = true;
    this.invalidate();
    this.warning?.setText("Scanning\u2026");
    const generation = this.generation;
    const input = this.input.value;
    const profile = this.profile.value;
    await new Promise((resolve2) => window.setTimeout(resolve2, 0));
    try {
      const settings = {
        ...this.plugin.settings,
        confidentialIdentifiers: (this.identifiers?.value ?? "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean),
        protectedDomains: (this.domains?.value ?? "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean)
      };
      const result = await scanAsync(input, profile, settings, this.mapper);
      if (generation !== this.generation) return;
      if (!this.plugin.settings.retainMappings) this.mapper.clear();
      this.result = result;
      if (this.output) this.output.value = result.output;
      if (this.copy) this.copy.disabled = false;
      const categories = /* @__PURE__ */ new Map();
      for (const d of result.detections) categories.set(d.category, (categories.get(d.category) ?? 0) + 1);
      this.summary?.setText(`${result.detections.length} matches \xB7 ${result.detections.filter((d) => d.action === "REDACT").length} redacted secrets \xB7 ${result.detections.filter((d) => d.action === "TOKENIZE").length} tokenized identifiers \xB7 ${result.detections.filter((d) => d.action === "REVIEW").length} review findings
${[...categories].map(([k, v]) => `${k}: ${v}`).join(" \xB7 ")}
${result.durationMs.toFixed(1)} ms \xB7 ${result.profile} \xB7 ${result.format}`);
      this.warning?.setText(result.warnings.join(" "));
    } catch {
      this.result = void 0;
      if (this.output) this.output.value = "";
      if (this.copy) this.copy.disabled = true;
      this.warning?.setText("Scan failed or input is too large. Copy is blocked. Review custom rules and input size.");
      this.summary?.setText("Scanner error; no export available.");
    } finally {
      if (generation !== this.generation) this.mapper.clear();
      this.busy = false;
      this.updateAvailability();
    }
  }
  async copyOutput() {
    if (!this.result || !this.output || !this.copy || this.copy.disabled) return;
    try {
      await copySanitized(this.result, (text) => navigator.clipboard.writeText(text));
      new import_obsidian.Notice("Sanitized output copied. Review it before sharing.");
    } catch {
      new import_obsidian.Notice("Copy failed. Use the read-only output area to copy manually.");
    }
  }
  clearSession() {
    this.generation++;
    this.mapper.clear();
    this.result = void 0;
    if (this.input) this.input.value = "";
    if (this.identifiers) this.identifiers.value = "";
    if (this.domains) this.domains.value = "";
    if (this.output) this.output.value = "";
    if (this.copy) this.copy.disabled = true;
    this.summary?.setText("No scan yet.");
    this.count?.setText("0 characters \xB7 0 bytes");
    this.updateAvailability();
    this.updateWarning();
  }
  async onClose() {
    this.clearSession();
    this.contentEl.empty();
  }
};

// obsidian-plugin/src/ui/SettingsTab.ts
var import_obsidian2 = require("obsidian");
var PrivacyGuardSettingsTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const el = this.containerEl;
    el.empty();
    el.createEl("h2", { text: "Developer Privacy Guard settings" });
    new import_obsidian2.Setting(el).setName("Default profile").addDropdown((drop) => drop.addOption("balanced", "Balanced").addOption("strict", "Strict").addOption("credentials", "Credentials Only").setValue(this.plugin.settings.defaultProfile).onChange(async (v) => {
      this.plugin.settings.defaultProfile = v;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(el).setName("Input character limit").setDesc("100,000 by default; maximum 1,000,000.").addText((t) => t.setValue(String(this.plugin.settings.limit)).onChange(async (v) => {
      const n = Number(v);
      if (Number.isInteger(n) && n >= 1e3 && n <= 1e6) {
        this.plugin.settings.limit = n;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian2.Setting(el).setName("Retain temporary mappings until panel closure").setDesc("When off, identifiers are consistent only within each scan.").addToggle((t) => t.setValue(this.plugin.settings.retainMappings).onChange(async (v) => {
      this.plugin.settings.retainMappings = v;
      await this.plugin.saveSettings();
    }));
    el.createEl("h3", { text: "Detection categories" });
    for (const category of CATEGORIES) new import_obsidian2.Setting(el).setName(category).addToggle((toggle) => toggle.setValue(this.plugin.settings.enabledCategories.includes(category)).onChange(async (enabled) => {
      this.plugin.settings.enabledCategories = enabled ? [.../* @__PURE__ */ new Set([...this.plugin.settings.enabledCategories, category])] : this.plugin.settings.enabledCategories.filter((x) => x !== category);
      await this.plugin.saveSettings();
    }));
    el.createEl("h3", { text: "Custom regex rules" });
    el.createEl("p", { text: "Enter a JSON array of rules. Rules contain patterns, never raw sensitive values. Complex regex groups and backreferences are rejected." });
    new import_obsidian2.Setting(el).setName("Rules JSON").addTextArea((t) => t.setValue(JSON.stringify(this.plugin.settings.customRules, null, 2)).onChange(async (value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed) || parsed.length > 50 || !parsed.every((x) => typeof x === "object" && x !== null && typeof x.id === "string" && typeof x.name === "string" && typeof x.pattern === "string" && CATEGORIES.includes(x.category) && ["REDACT", "TOKENIZE", "REVIEW"].includes(x.policy) && typeof x.enabled === "boolean" && !validateRule(x))) return;
        this.plugin.settings.customRules = parsed;
        await this.plugin.saveSettings();
      } catch {
      }
    }));
    new import_obsidian2.Setting(el).setName("Clear open panel session").addButton((b) => b.setButtonText("Clear").onClick(() => {
      for (const leaf of this.app.workspace.getLeavesOfType("developer-privacy-guard")) {
        const view = leaf.view;
        if ("clearSession" in view && typeof view.clearSession === "function") view.clearSession();
      }
      new import_obsidian2.Notice("Open panel session cleared.");
    }));
    el.createEl("p", { text: "Identifier mappings are held only in memory until panel closure. Raw identifiers and pasted content are never saved in settings." });
  }
};

// obsidian-plugin/src/main.ts
var PrivacyGuardPlugin = class extends import_obsidian3.Plugin {
  settings = { ...DEFAULT_SETTINGS };
  async onload() {
    const loaded = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...loaded, confidentialIdentifiers: [], protectedDomains: [] };
    this.registerView(VIEW_TYPE, (leaf) => new PrivacyGuardView(leaf, this));
    this.addRibbonIcon("shield-check", "Open Developer Privacy Guard", () => void this.openView());
    this.addCommand({ id: "open-privacy-guard", name: "Open Developer Privacy Guard", callback: () => void this.openView() });
    this.addSettingTab(new PrivacyGuardSettingsTab(this.app, this));
  }
  async openView() {
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0] ?? this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  async saveSettings() {
    const { confidentialIdentifiers: _identifiers, protectedDomains: _domains, ...safe } = this.settings;
    await this.saveData(safe);
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }
};
