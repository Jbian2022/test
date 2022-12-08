var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
      throw reason;
    }));
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format2, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format2.length) {
      let char = format2[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format2[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format2[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    const lang2 = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
    if (lang2) {
      return lang2;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn2) {
      const index = this.watchers.push(fn2) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      [locale, messages2] = [
        messages2,
        locale
      ];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn2) {
        return i18n.watchLocale(fn2);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const pages = [
    {
      path: "pages/myMebers/myMebers",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/addMyMebers/addMyMebers",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/bodyAssessment/bodyAssessment",
      style: {
        navigationBarTitleText: "\u4F53\u6D4B\u8BC4\u4F30",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/bodyTestReport/bodyTestReport",
      style: {
        navigationBarTitleText: "\u4F53\u6D4B\u62A5\u544A",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/dynamicEvaluation/dynamicEvaluation",
      style: {
        navigationBarTitleText: "\u52A8\u6001\u8BC4\u4F30",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/physicalAssessment/physicalAssessment",
      style: {
        navigationBarTitleText: "\u8EAB\u4F53\u8BC4\u6D4B",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/healthQuesson/healthQuesson",
      style: {
        navigationBarTitleText: "\u5065\u5EB7\u95EE\u7B54",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/physicalFitnessAssessment/physicalFitnessAssessment",
      style: {
        navigationBarTitleText: "\u4F53\u80FD\u8BC4\u4F30",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/logining/logining",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/verificatioCode/verificatioCode",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/personalnformation/personalnformation",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/actionLibrary/index",
      style: {
        navigationBarTitleText: "\u52A8\u4F5C\u5E93",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/addAction/index",
      style: {
        navigationBarTitleText: "\u65B0\u589E\u52A8\u4F5C",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/newWorkout/newWorkout",
      style: {
        navigationBarTitleText: "\u65B0\u5EFA\u8BAD\u7EC3",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/trainingRecord/trainingRecord",
      style: {
        navigationBarTitleText: "\u8BAD\u7EC3\u8BB0\u5F55",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/trainingRecordDetail/trainingRecordDetail",
      style: {
        navigationBarTitleText: "\u8BAD\u7EC3\u8BB0\u5F55\u8BE6\u60C5",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/my/my",
      style: {
        navigationBarTitleText: "\u6211\u7684",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/openCard/openCard",
      style: {
        navigationBarTitleText: "\u5F00\u5361",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/setUp/setUp",
      style: {
        navigationBarTitleText: "\u8BBE\u7F6E",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/personalInfo/personalInfo",
      style: {
        navigationBarTitleText: "\u4E2A\u4EBA\u4FE1\u606F",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/updateSignature/updateSignature",
      style: {
        navigationBarTitleText: "\u4FEE\u6539\u7B7E\u540D",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/demo/demo",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    }
  ];
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "uni-starter",
    navigationBarBackgroundColor: "#212328",
    backgroundColor: "#212328",
    enablePullDownRefresh: false,
    rpxCalcMaxDeviceWidth: 375,
    rpxCalcBaseDeviceWidth: 375
  };
  const tabBar = {
    color: "#7A7E83",
    selectedColor: "#fff",
    borderStyle: "black",
    backgroundColor: "#212328",
    list: [
      {
        pagePath: "pages/myMebers/myMebers",
        iconPath: "static/tabbar/noactivemeber.svg",
        selectedIconPath: "static/tabbar/activemeber.svg",
        text: "\u4F1A\u5458"
      },
      {
        pagePath: "pages/actionLibrary/index",
        iconPath: "static/tabbar/noactiveaction.svg",
        selectedIconPath: "static/tabbar/activeaction.svg",
        text: "\u52A8\u4F5C\u5E93"
      },
      {
        pagePath: "pages/my/my",
        iconPath: "static/tabbar/noactiveme.svg",
        selectedIconPath: "static/tabbar/activeMe.svg",
        text: "\u6211\u7684"
      }
    ]
  };
  var t$k = {
    pages,
    globalStyle,
    tabBar
  };
  function n(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  }
  function s(e, t2, n2) {
    return e(n2 = { path: t2, exports: {}, require: function(e2, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(t3 == null && n2.path);
    } }, n2.exports), n2.exports;
  }
  var o = s(function(e, t2) {
    var n2;
    e.exports = (n2 = n2 || function(e2, t3) {
      var n3 = Object.create || function() {
        function e3() {
        }
        return function(t4) {
          var n4;
          return e3.prototype = t4, n4 = new e3(), e3.prototype = null, n4;
        };
      }(), s2 = {}, o2 = s2.lib = {}, r2 = o2.Base = { extend: function(e3) {
        var t4 = n3(this);
        return e3 && t4.mixIn(e3), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e3 = this.extend();
        return e3.init.apply(e3, arguments), e3;
      }, init: function() {
      }, mixIn: function(e3) {
        for (var t4 in e3)
          e3.hasOwnProperty(t4) && (this[t4] = e3[t4]);
        e3.hasOwnProperty("toString") && (this.toString = e3.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, i2 = o2.WordArray = r2.extend({ init: function(e3, n4) {
        e3 = this.words = e3 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e3.length;
      }, toString: function(e3) {
        return (e3 || c2).stringify(this);
      }, concat: function(e3) {
        var t4 = this.words, n4 = e3.words, s3 = this.sigBytes, o3 = e3.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var r3 = 0; r3 < o3; r3++) {
            var i3 = n4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
            t4[s3 + r3 >>> 2] |= i3 << 24 - (s3 + r3) % 4 * 8;
          }
        else
          for (r3 = 0; r3 < o3; r3 += 4)
            t4[s3 + r3 >>> 2] = n4[r3 >>> 2];
        return this.sigBytes += o3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e2.ceil(n4 / 4);
      }, clone: function() {
        var e3 = r2.clone.call(this);
        return e3.words = this.words.slice(0), e3;
      }, random: function(t4) {
        for (var n4, s3 = [], o3 = function(t5) {
          t5 = t5;
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var o4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return o4 /= 4294967296, (o4 += 0.5) * (e2.random() > 0.5 ? 1 : -1);
          };
        }, r3 = 0; r3 < t4; r3 += 4) {
          var a3 = o3(4294967296 * (n4 || e2.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new i2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
          var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
          s3.push((r3 >>> 4).toString(16)), s3.push((15 & r3).toString(16));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e3.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new i2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
          var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(r3));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e3.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new i2.init(n4, t4);
      } }, l2 = a2.Utf8 = { stringify: function(e3) {
        try {
          return decodeURIComponent(escape(u2.stringify(e3)));
        } catch (e4) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e3) {
        return u2.parse(unescape(encodeURIComponent(e3)));
      } }, h2 = o2.BufferedBlockAlgorithm = r2.extend({ reset: function() {
        this._data = new i2.init(), this._nDataBytes = 0;
      }, _append: function(e3) {
        typeof e3 == "string" && (e3 = l2.parse(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, o3 = n4.sigBytes, r3 = this.blockSize, a3 = o3 / (4 * r3), c3 = (a3 = t4 ? e2.ceil(a3) : e2.max((0 | a3) - this._minBufferSize, 0)) * r3, u3 = e2.min(4 * c3, o3);
        if (c3) {
          for (var l3 = 0; l3 < c3; l3 += r3)
            this._doProcessBlock(s3, l3);
          var h3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new i2.init(h3, u3);
      }, clone: function() {
        var e3 = r2.clone.call(this);
        return e3._data = this._data.clone(), e3;
      }, _minBufferSize: 0 });
      o2.Hasher = h2.extend({ cfg: r2.extend(), init: function(e3) {
        this.cfg = this.cfg.extend(e3), this.reset();
      }, reset: function() {
        h2.reset.call(this), this._doReset();
      }, update: function(e3) {
        return this._append(e3), this._process(), this;
      }, finalize: function(e3) {
        return e3 && this._append(e3), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e3) {
        return function(t4, n4) {
          return new e3.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e3) {
        return function(t4, n4) {
          return new d2.HMAC.init(e3, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = (s(function(e, t2) {
    var n2;
    e.exports = (n2 = o, function(e2) {
      var t3 = n2, s2 = t3.lib, o2 = s2.WordArray, r2 = s2.Hasher, i2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e2.abs(e2.sin(t4 + 1)) | 0;
      }();
      var c2 = i2.MD5 = r2.extend({ _doReset: function() {
        this._hash = new o2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e3, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, o3 = e3[s3];
          e3[s3] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
        }
        var r3 = this._hash.words, i3 = e3[t4 + 0], c3 = e3[t4 + 1], f2 = e3[t4 + 2], p2 = e3[t4 + 3], g2 = e3[t4 + 4], m2 = e3[t4 + 5], y2 = e3[t4 + 6], _2 = e3[t4 + 7], w = e3[t4 + 8], v2 = e3[t4 + 9], k2 = e3[t4 + 10], T2 = e3[t4 + 11], S2 = e3[t4 + 12], A2 = e3[t4 + 13], P2 = e3[t4 + 14], I2 = e3[t4 + 15], b2 = r3[0], O2 = r3[1], C2 = r3[2], E2 = r3[3];
        b2 = u2(b2, O2, C2, E2, i3, 7, a2[0]), E2 = u2(E2, b2, O2, C2, c3, 12, a2[1]), C2 = u2(C2, E2, b2, O2, f2, 17, a2[2]), O2 = u2(O2, C2, E2, b2, p2, 22, a2[3]), b2 = u2(b2, O2, C2, E2, g2, 7, a2[4]), E2 = u2(E2, b2, O2, C2, m2, 12, a2[5]), C2 = u2(C2, E2, b2, O2, y2, 17, a2[6]), O2 = u2(O2, C2, E2, b2, _2, 22, a2[7]), b2 = u2(b2, O2, C2, E2, w, 7, a2[8]), E2 = u2(E2, b2, O2, C2, v2, 12, a2[9]), C2 = u2(C2, E2, b2, O2, k2, 17, a2[10]), O2 = u2(O2, C2, E2, b2, T2, 22, a2[11]), b2 = u2(b2, O2, C2, E2, S2, 7, a2[12]), E2 = u2(E2, b2, O2, C2, A2, 12, a2[13]), C2 = u2(C2, E2, b2, O2, P2, 17, a2[14]), b2 = l2(b2, O2 = u2(O2, C2, E2, b2, I2, 22, a2[15]), C2, E2, c3, 5, a2[16]), E2 = l2(E2, b2, O2, C2, y2, 9, a2[17]), C2 = l2(C2, E2, b2, O2, T2, 14, a2[18]), O2 = l2(O2, C2, E2, b2, i3, 20, a2[19]), b2 = l2(b2, O2, C2, E2, m2, 5, a2[20]), E2 = l2(E2, b2, O2, C2, k2, 9, a2[21]), C2 = l2(C2, E2, b2, O2, I2, 14, a2[22]), O2 = l2(O2, C2, E2, b2, g2, 20, a2[23]), b2 = l2(b2, O2, C2, E2, v2, 5, a2[24]), E2 = l2(E2, b2, O2, C2, P2, 9, a2[25]), C2 = l2(C2, E2, b2, O2, p2, 14, a2[26]), O2 = l2(O2, C2, E2, b2, w, 20, a2[27]), b2 = l2(b2, O2, C2, E2, A2, 5, a2[28]), E2 = l2(E2, b2, O2, C2, f2, 9, a2[29]), C2 = l2(C2, E2, b2, O2, _2, 14, a2[30]), b2 = h2(b2, O2 = l2(O2, C2, E2, b2, S2, 20, a2[31]), C2, E2, m2, 4, a2[32]), E2 = h2(E2, b2, O2, C2, w, 11, a2[33]), C2 = h2(C2, E2, b2, O2, T2, 16, a2[34]), O2 = h2(O2, C2, E2, b2, P2, 23, a2[35]), b2 = h2(b2, O2, C2, E2, c3, 4, a2[36]), E2 = h2(E2, b2, O2, C2, g2, 11, a2[37]), C2 = h2(C2, E2, b2, O2, _2, 16, a2[38]), O2 = h2(O2, C2, E2, b2, k2, 23, a2[39]), b2 = h2(b2, O2, C2, E2, A2, 4, a2[40]), E2 = h2(E2, b2, O2, C2, i3, 11, a2[41]), C2 = h2(C2, E2, b2, O2, p2, 16, a2[42]), O2 = h2(O2, C2, E2, b2, y2, 23, a2[43]), b2 = h2(b2, O2, C2, E2, v2, 4, a2[44]), E2 = h2(E2, b2, O2, C2, S2, 11, a2[45]), C2 = h2(C2, E2, b2, O2, I2, 16, a2[46]), b2 = d2(b2, O2 = h2(O2, C2, E2, b2, f2, 23, a2[47]), C2, E2, i3, 6, a2[48]), E2 = d2(E2, b2, O2, C2, _2, 10, a2[49]), C2 = d2(C2, E2, b2, O2, P2, 15, a2[50]), O2 = d2(O2, C2, E2, b2, m2, 21, a2[51]), b2 = d2(b2, O2, C2, E2, S2, 6, a2[52]), E2 = d2(E2, b2, O2, C2, p2, 10, a2[53]), C2 = d2(C2, E2, b2, O2, k2, 15, a2[54]), O2 = d2(O2, C2, E2, b2, c3, 21, a2[55]), b2 = d2(b2, O2, C2, E2, w, 6, a2[56]), E2 = d2(E2, b2, O2, C2, I2, 10, a2[57]), C2 = d2(C2, E2, b2, O2, y2, 15, a2[58]), O2 = d2(O2, C2, E2, b2, A2, 21, a2[59]), b2 = d2(b2, O2, C2, E2, g2, 6, a2[60]), E2 = d2(E2, b2, O2, C2, T2, 10, a2[61]), C2 = d2(C2, E2, b2, O2, f2, 15, a2[62]), O2 = d2(O2, C2, E2, b2, v2, 21, a2[63]), r3[0] = r3[0] + b2 | 0, r3[1] = r3[1] + O2 | 0, r3[2] = r3[2] + C2 | 0, r3[3] = r3[3] + E2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, o3 = 8 * t4.sigBytes;
        n3[o3 >>> 5] |= 128 << 24 - o3 % 32;
        var r3 = e2.floor(s3 / 4294967296), i3 = s3;
        n3[15 + (o3 + 64 >>> 9 << 4)] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8), n3[14 + (o3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var l3 = c3[u3];
          c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e3 = r2.clone.call(this);
        return e3._hash = this._hash.clone(), e3;
      } });
      function u2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (t4 & n3 | ~t4 & s3) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      function l2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (t4 & s3 | n3 & ~s3) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      function h2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (t4 ^ n3 ^ s3) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      function d2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (n3 ^ (t4 | ~s3)) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      t3.MD5 = r2._createHelper(c2), t3.HmacMD5 = r2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), s(function(e, t2) {
    var n2, s2, r2;
    e.exports = (s2 = (n2 = o).lib.Base, r2 = n2.enc.Utf8, void (n2.algo.HMAC = s2.extend({ init: function(e2, t3) {
      e2 = this._hasher = new e2.init(), typeof t3 == "string" && (t3 = r2.parse(t3));
      var n3 = e2.blockSize, s3 = 4 * n3;
      t3.sigBytes > s3 && (t3 = e2.finalize(t3)), t3.clamp();
      for (var o2 = this._oKey = t3.clone(), i2 = this._iKey = t3.clone(), a2 = o2.words, c2 = i2.words, u2 = 0; u2 < n3; u2++)
        a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
      o2.sigBytes = i2.sigBytes = s3, this.reset();
    }, reset: function() {
      var e2 = this._hasher;
      e2.reset(), e2.update(this._iKey);
    }, update: function(e2) {
      return this._hasher.update(e2), this;
    }, finalize: function(e2) {
      var t3 = this._hasher, n3 = t3.finalize(e2);
      return t3.reset(), t3.finalize(this._oKey.clone().concat(n3));
    } })));
  }), s(function(e, t2) {
    e.exports = o.HmacMD5;
  })), i = s(function(e, t2) {
    e.exports = o.enc.Utf8;
  }), a = s(function(e, t2) {
    var n2;
    e.exports = (n2 = o, function() {
      var e2 = n2, t3 = e2.lib.WordArray;
      function s2(e3, n3, s3) {
        for (var o2 = [], r2 = 0, i2 = 0; i2 < n3; i2++)
          if (i2 % 4) {
            var a2 = s3[e3.charCodeAt(i2 - 1)] << i2 % 4 * 2, c2 = s3[e3.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
            o2[r2 >>> 2] |= (a2 | c2) << 24 - r2 % 4 * 8, r2++;
          }
        return t3.create(o2, r2);
      }
      e2.enc.Base64 = { stringify: function(e3) {
        var t4 = e3.words, n3 = e3.sigBytes, s3 = this._map;
        e3.clamp();
        for (var o2 = [], r2 = 0; r2 < n3; r2 += 3)
          for (var i2 = (t4[r2 >>> 2] >>> 24 - r2 % 4 * 8 & 255) << 16 | (t4[r2 + 1 >>> 2] >>> 24 - (r2 + 1) % 4 * 8 & 255) << 8 | t4[r2 + 2 >>> 2] >>> 24 - (r2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && r2 + 0.75 * a2 < n3; a2++)
            o2.push(s3.charAt(i2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; o2.length % 4; )
            o2.push(c2);
        return o2.join("");
      }, parse: function(e3) {
        var t4 = e3.length, n3 = this._map, o2 = this._reverseMap;
        if (!o2) {
          o2 = this._reverseMap = [];
          for (var r2 = 0; r2 < n3.length; r2++)
            o2[n3.charCodeAt(r2)] = r2;
        }
        var i2 = n3.charAt(64);
        if (i2) {
          var a2 = e3.indexOf(i2);
          a2 !== -1 && (t4 = a2);
        }
        return s2(e3, t4, o2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "FUNCTION", u = "OBJECT", l = "CLIENT_DB";
  function h(e) {
    return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
  }
  function d(e) {
    return h(e) === "object";
  }
  function f(e) {
    return e && typeof e == "string" ? JSON.parse(e) : e;
  }
  const p = true, g = "app";
  let m;
  m = g;
  const y = f('{\n    "address": [\n        "127.0.0.1",\n        "192.168.11.199"\n    ],\n    "debugPort": 9000,\n    "initialLaunchType": "remote",\n    "servePort": 7000,\n    "skipFiles": [\n        "<node_internals>/**",\n        "C:/Temp/HBuilderX/plugins/unicloud/**/*.js"\n    ]\n}\n'), _ = f('[{"provider":"aliyun","spaceName":"completeapp","spaceId":"mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3","clientSecret":"hnLvmNQF/W9ZY06q5wYD/Q==","endpoint":"https://api.next.bspapp.com"}]') || [];
  let v = "";
  try {
    v = "__UNI__76A9E40";
  } catch (e) {
  }
  let k = {};
  function T(e, t2 = {}) {
    var n2, s2;
    return n2 = k, s2 = e, Object.prototype.hasOwnProperty.call(n2, s2) || (k[e] = t2), k[e];
  }
  m === "app" && (k = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {});
  const S = ["invoke", "success", "fail", "complete"], A = T("_globalUniCloudInterceptor");
  function P(e, t2) {
    A[e] || (A[e] = {}), d(t2) && Object.keys(t2).forEach((n2) => {
      S.indexOf(n2) > -1 && function(e2, t3, n3) {
        let s2 = A[e2][t3];
        s2 || (s2 = A[e2][t3] = []), s2.indexOf(n3) === -1 && typeof n3 == "function" && s2.push(n3);
      }(e, n2, t2[n2]);
    });
  }
  function I(e, t2) {
    A[e] || (A[e] = {}), d(t2) ? Object.keys(t2).forEach((n2) => {
      S.indexOf(n2) > -1 && function(e2, t3, n3) {
        const s2 = A[e2][t3];
        if (!s2)
          return;
        const o2 = s2.indexOf(n3);
        o2 > -1 && s2.splice(o2, 1);
      }(e, n2, t2[n2]);
    }) : delete A[e];
  }
  function b(e, t2) {
    return e && e.length !== 0 ? e.reduce((e2, n2) => e2.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function O(e, t2) {
    return A[e] && A[e][t2] || [];
  }
  function C(e) {
    P("callObject", e);
  }
  const E = T("_globalUniCloudListener"), R = "response", U = "needLogin", x = "refreshToken", L = "clientdb", D = "cloudfunction", N = "cloudobject";
  function q(e) {
    return E[e] || (E[e] = []), E[e];
  }
  function F(e, t2) {
    const n2 = q(e);
    n2.includes(t2) || n2.push(t2);
  }
  function M(e, t2) {
    const n2 = q(e), s2 = n2.indexOf(t2);
    s2 !== -1 && n2.splice(s2, 1);
  }
  function j(e, t2) {
    const n2 = q(e);
    for (let e2 = 0; e2 < n2.length; e2++) {
      (0, n2[e2])(t2);
    }
  }
  let $ = false;
  const B = new Promise((e) => {
    $ && e(), function t2() {
      if (typeof getCurrentPages == "function") {
        const t3 = getCurrentPages();
        t3 && t3[0] && ($ = true, e());
      }
      $ || setTimeout(() => {
        t2();
      }, 30);
    }();
  });
  function K() {
    return B;
  }
  function W(e, t2) {
    return t2 ? function(n2) {
      let s2 = false;
      if (t2 === "callFunction") {
        const e2 = n2 && n2.type || c;
        s2 = e2 !== c;
      }
      const o2 = t2 === "callFunction" && !s2;
      let r2;
      r2 = this.isReady ? Promise.resolve() : this.initUniCloud, n2 = n2 || {};
      const i2 = r2.then(() => s2 ? Promise.resolve() : b(O(t2, "invoke"), n2)).then(() => e.call(this, n2)).then((e2) => s2 ? Promise.resolve(e2) : b(O(t2, "success"), e2).then(() => b(O(t2, "complete"), e2)).then(() => (o2 && j(R, { type: D, content: e2 }), Promise.resolve(e2))), (e2) => s2 ? Promise.reject(e2) : b(O(t2, "fail"), e2).then(() => b(O(t2, "complete"), e2)).then(() => (j(R, { type: D, content: e2 }), Promise.reject(e2))));
      if (!(n2.success || n2.fail || n2.complete))
        return i2;
      i2.then((e2) => {
        n2.success && n2.success(e2), n2.complete && n2.complete(e2), o2 && j(R, { type: D, content: e2 });
      }, (e2) => {
        n2.fail && n2.fail(e2), n2.complete && n2.complete(e2), o2 && j(R, { type: D, content: e2 });
      });
    } : function(t3) {
      if (!((t3 = t3 || {}).success || t3.fail || t3.complete))
        return e.call(this, t3);
      e.call(this, t3).then((e2) => {
        t3.success && t3.success(e2), t3.complete && t3.complete(e2);
      }, (e2) => {
        t3.fail && t3.fail(e2), t3.complete && t3.complete(e2);
      });
    };
  }
  class H extends Error {
    constructor(e) {
      const t2 = e.code || "SYSTEM_ERROR", n2 = e.message || "unknown system error";
      super(n2), this.errMsg = n2, this.errCode = this.code = t2, this.requestId = e.requestId;
    }
  }
  function z() {
    let e, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e = s2, t2 = n2;
      }
    } catch (e2) {
    }
    return { channel: e, scene: t2 };
  }
  let J;
  function V() {
    const e = uni.getLocale && uni.getLocale() || "en";
    if (J)
      return __spreadProps(__spreadValues({}, J), { locale: e, LOCALE: e });
    const t2 = uni.getSystemInfoSync(), { deviceId: n2, osName: s2, uniPlatform: o2, appId: r2 } = t2, i2 = ["pixelRatio", "brand", "model", "system", "language", "version", "platform", "host", "SDKVersion", "swanNativeVersion", "app", "AppPlatform", "fontSizeSetting"];
    for (let e2 = 0; e2 < i2.length; e2++) {
      delete t2[i2[e2]];
    }
    return J = __spreadValues(__spreadValues({ PLATFORM: o2, OS: s2, APPID: r2, DEVICEID: n2 }, z()), t2), __spreadProps(__spreadValues({}, J), { locale: e, LOCALE: e });
  }
  var Y = { sign: function(e, t2) {
    let n2 = "";
    return Object.keys(e).sort().forEach(function(t3) {
      e[t3] && (n2 = n2 + "&" + t3 + "=" + e[t3]);
    }), n2 = n2.slice(1), r(n2, t2).toString();
  }, wrappedRequest: function(e, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e, { complete(e2) {
        e2 || (e2 = {}), m === "web" && e2.errMsg && e2.errMsg.indexOf("request:fail") === 0 && console.warn("\u53D1\u5E03H5\uFF0C\u9700\u8981\u5728uniCloud\u540E\u53F0\u64CD\u4F5C\uFF0C\u7ED1\u5B9A\u5B89\u5168\u57DF\u540D\uFF0C\u5426\u5219\u4F1A\u56E0\u4E3A\u8DE8\u57DF\u95EE\u9898\u800C\u65E0\u6CD5\u8BBF\u95EE\u3002\u6559\u7A0B\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.io/uniCloud/quickstart?id=useinh5");
        const t3 = e2.data && e2.data.header && e2.data.header["x-serverless-request-id"] || e2.header && e2.header["request-id"];
        if (!e2.statusCode || e2.statusCode >= 400)
          return s2(new H({ code: "SYS_ERR", message: e2.errMsg || "request:fail", requestId: t3 }));
        const o2 = e2.data;
        if (o2.error)
          return s2(new H({ code: o2.error.code, message: o2.error.message, requestId: t3 }));
        o2.result = o2.data, o2.requestId = t3, delete o2.data, n2(o2);
      } }));
    });
  }, toBase64: function(e) {
    return a.stringify(i.parse(e));
  } };
  var X = { request: (e) => uni.request(e), uploadFile: (e) => uni.uploadFile(e), setStorageSync: (e, t2) => uni.setStorageSync(e, t2), getStorageSync: (e) => uni.getStorageSync(e), removeStorageSync: (e) => uni.removeStorageSync(e), clearStorageSync: () => uni.clearStorageSync() }, G = { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" };
  const { t: Q } = initVueI18n({ "zh-Hans": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, "zh-Hant": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, en: G, fr: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, es: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, ja: G }, "zh-Hans");
  var Z = class {
    constructor(e) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e, t2))
          throw new Error(Q("uniCloud.init.paramRequired", { param: t2 }));
      }), this.config = Object.assign({}, { endpoint: "https://api.bspapp.com" }, e), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = X, this._getAccessTokenPromise = null, this._getAccessTokenPromiseStatus = null;
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e) {
      this.accessToken = e;
    }
    requestWrapped(e) {
      return Y.wrappedRequest(e, this.adapter.request);
    }
    requestAuth(e) {
      return this.requestWrapped(e);
    }
    request(e, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e) : this.requestWrapped(e).catch((t3) => new Promise((e2, n2) => {
        !t3 || t3.code !== "GATEWAY_INVALID_TOKEN" && t3.code !== "InvalidParameter.InvalidToken" ? n2(t3) : e2();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e) {
      const t2 = Object.assign({}, e);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = Y.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = Y.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      if (this._getAccessTokenPromiseStatus === "pending")
        return this._getAccessTokenPromise;
      this._getAccessTokenPromiseStatus = "pending";
      return this._getAccessTokenPromise = this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e) => new Promise((t2, n2) => {
        e.result && e.result.accessToken ? (this.setAccessToken(e.result.accessToken), this._getAccessTokenPromiseStatus = "fulfilled", t2(this.accessToken)) : (this._getAccessTokenPromiseStatus = "rejected", n2(new H({ code: "AUTH_FAILED", message: "\u83B7\u53D6accessToken\u5931\u8D25" })));
      }), (e) => (this._getAccessTokenPromiseStatus = "rejected", Promise.reject(e))), this._getAccessTokenPromise;
    }
    authorize() {
      this.getAccessToken();
    }
    callFunction(e) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e.name, functionArgs: e.data || {} }) };
      return this.request(this.setupRequest(t2));
    }
    getOSSUploadOptionsFromPath(e) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
      return new Promise((i2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e2) {
          e2 && e2.statusCode < 400 ? i2(e2) : a2(new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new H({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
          r2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2, config: o2 }) {
      if (h(t2) !== "string")
        throw new H({ code: "INVALID_PARAM", message: "cloudPath\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B" });
      if (!(t2 = t2.trim()))
        throw new H({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      if (/:\/\//.test(t2))
        throw new H({ code: "INVALID_PARAM", message: "cloudPath\u4E0D\u5408\u6CD5" });
      const r2 = o2 && o2.envType || this.config.envType, i2 = (await this.getOSSUploadOptionsFromPath({ env: r2, filename: t2 })).result, a2 = "https://" + i2.cdnDomain + "/" + i2.ossPath, { securityToken: c2, accessKeyId: u2, signature: l2, host: d2, ossPath: f2, id: p2, policy: g2, ossCallbackUrl: m2 } = i2, y2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: u2, Signature: l2, host: d2, id: p2, key: f2, policy: g2, success_action_status: 200 };
      if (c2 && (y2["x-oss-security-token"] = c2), m2) {
        const e2 = JSON.stringify({ callbackUrl: m2, callbackBody: JSON.stringify({ fileId: p2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        y2.callback = Y.toBase64(e2);
      }
      const _2 = { url: "https://" + i2.host, formData: y2, fileName: "file", name: "file", filePath: e, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, _2, { onUploadProgress: s2 })), m2)
        return { success: true, filePath: e, fileID: a2 };
      if ((await this.reportOSSUpload({ id: p2 })).success)
        return { success: true, filePath: e, fileID: a2 };
      throw new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" });
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ id: e[0] }) };
      return this.request(this.setupRequest(t2));
    }
    getTempFileURL({ fileList: e } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e) && e.length !== 0 || n2(new H({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" })), t2({ fileList: e.map((e2) => ({ fileID: e2, tempFileURL: e2 })) });
      });
    }
    async getFileInfo({ fileList: e } = {}) {
      if (!Array.isArray(e) || e.length === 0)
        throw new H({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e.map((e2) => e2.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var ee = { init(e) {
    const t2 = new Z(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const te = typeof location != "undefined" && location.protocol === "http:" ? "http:" : "https:";
  var ne;
  !function(e) {
    e.local = "local", e.none = "none", e.session = "session";
  }(ne || (ne = {}));
  var se = function() {
  };
  const oe = () => {
    let e;
    if (!Promise) {
      e = () => {
      }, e.promise = {};
      const t3 = () => {
        throw new H({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e.promise, "then", { get: t3 }), Object.defineProperty(e.promise, "catch", { get: t3 }), e;
    }
    const t2 = new Promise((t3, n2) => {
      e = (e2, s2) => e2 ? n2(e2) : t3(s2);
    });
    return e.promise = t2, e;
  };
  function re(e) {
    return e === void 0;
  }
  function ie(e) {
    return Object.prototype.toString.call(e) === "[object Null]";
  }
  var ae;
  function ce(e) {
    const t2 = (n2 = e, Object.prototype.toString.call(n2) === "[object Array]" ? e : [e]);
    var n2;
    for (const e2 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e2;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e) {
    e.WEB = "web", e.WX_MP = "wx_mp";
  }(ae || (ae = {}));
  const ue = { adapter: null, runtime: void 0 }, le = ["anonymousUuidKey"];
  class he extends se {
    constructor() {
      super(), ue.adapter.root.tcbObject || (ue.adapter.root.tcbObject = {});
    }
    setItem(e, t2) {
      ue.adapter.root.tcbObject[e] = t2;
    }
    getItem(e) {
      return ue.adapter.root.tcbObject[e];
    }
    removeItem(e) {
      delete ue.adapter.root.tcbObject[e];
    }
    clear() {
      delete ue.adapter.root.tcbObject;
    }
  }
  function de(e, t2) {
    switch (e) {
      case "local":
        return t2.localStorage || new he();
      case "none":
        return new he();
      default:
        return t2.sessionStorage || new he();
    }
  }
  class fe {
    constructor(e) {
      if (!this._storage) {
        this._persistence = ue.adapter.primaryStorage || e.persistence, this._storage = de(this._persistence, ue.adapter);
        const t2 = `access_token_${e.env}`, n2 = `access_token_expire_${e.env}`, s2 = `refresh_token_${e.env}`, o2 = `anonymous_uuid_${e.env}`, r2 = `login_type_${e.env}`, i2 = `user_info_${e.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: o2, loginTypeKey: r2, userInfoKey: i2 };
      }
    }
    updatePersistence(e) {
      if (e === this._persistence)
        return;
      const t2 = this._persistence === "local";
      this._persistence = e;
      const n2 = de(e, ue.adapter);
      for (const e2 in this.keys) {
        const s2 = this.keys[e2];
        if (t2 && le.includes(e2))
          continue;
        const o2 = this._storage.getItem(s2);
        re(o2) || ie(o2) || (n2.setItem(s2, o2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, o2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e, o2);
      } catch (e2) {
        throw e2;
      }
    }
    getStore(e, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e2) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e) {
      this._storage.removeItem(e);
    }
  }
  const pe = {}, ge = {};
  function me(e) {
    return pe[e];
  }
  class ye {
    constructor(e, t2) {
      this.data = t2 || null, this.name = e;
    }
  }
  class _e extends ye {
    constructor(e, t2) {
      super("error", { error: e, data: t2 }), this.error = e;
    }
  }
  const we = new class {
    constructor() {
      this._listeners = {};
    }
    on(e, t2) {
      return function(e2, t3, n2) {
        n2[e2] = n2[e2] || [], n2[e2].push(t3);
      }(e, t2, this._listeners), this;
    }
    off(e, t2) {
      return function(e2, t3, n2) {
        if (n2 && n2[e2]) {
          const s2 = n2[e2].indexOf(t3);
          s2 !== -1 && n2[e2].splice(s2, 1);
        }
      }(e, t2, this._listeners), this;
    }
    fire(e, t2) {
      if (e instanceof _e)
        return console.error(e.error), this;
      const n2 = typeof e == "string" ? new ye(e, t2 || {}) : e;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e2 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e2)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e) {
      return this._listeners[e] && this._listeners[e].length > 0;
    }
  }();
  function ve(e, t2) {
    we.on(e, t2);
  }
  function ke(e, t2 = {}) {
    we.fire(e, t2);
  }
  function Te(e, t2) {
    we.off(e, t2);
  }
  const Se = "loginStateChanged", Ae = "loginStateExpire", Pe = "loginTypeChanged", Ie = "anonymousConverted", be = "refreshAccessToken";
  var Oe;
  !function(e) {
    e.ANONYMOUS = "ANONYMOUS", e.WECHAT = "WECHAT", e.WECHAT_PUBLIC = "WECHAT-PUBLIC", e.WECHAT_OPEN = "WECHAT-OPEN", e.CUSTOM = "CUSTOM", e.EMAIL = "EMAIL", e.USERNAME = "USERNAME", e.NULL = "NULL";
  }(Oe || (Oe = {}));
  const Ce = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Ee = { "X-SDK-Version": "1.3.5" };
  function Re(e, t2, n2) {
    const s2 = e[t2];
    e[t2] = function(t3) {
      const o2 = {}, r2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: i3 } = n3.call(e, t3);
        Object.assign(o2, s3), Object.assign(r2, i3);
      });
      const i2 = t3.data;
      return i2 && (() => {
        var e2;
        if (e2 = i2, Object.prototype.toString.call(e2) !== "[object FormData]")
          t3.data = __spreadValues(__spreadValues({}, i2), o2);
        else
          for (const e3 in o2)
            i2.append(e3, o2[e3]);
      })(), t3.headers = __spreadValues(__spreadValues({}, t3.headers || {}), r2), s2.call(e, t3);
    };
  }
  function Ue() {
    const e = Math.random().toString(16).slice(2);
    return { data: { seqId: e }, headers: __spreadProps(__spreadValues({}, Ee), { "x-seqid": e }) };
  }
  class xe {
    constructor(e = {}) {
      var t2;
      this.config = e, this._reqClass = new ue.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `\u8BF7\u6C42\u5728${this.config.timeout / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD`, restrictedMethods: ["post"] }), this._cache = me(this.config.env), this._localCache = (t2 = this.config.env, ge[t2]), Re(this._reqClass, "post", [Ue]), Re(this._reqClass, "upload", [Ue]), Re(this._reqClass, "download", [Ue]);
    }
    async post(e) {
      return await this._reqClass.post(e);
    }
    async upload(e) {
      return await this._reqClass.upload(e);
    }
    async download(e) {
      return await this._reqClass.download(e);
    }
    async refreshAccessToken() {
      let e, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e = await this._refreshAccessTokenPromise;
      } catch (e2) {
        t2 = e2;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: o2 } = this._cache.keys;
      this._cache.removeStore(e), this._cache.removeStore(t2);
      let r2 = this._cache.getStore(n2);
      if (!r2)
        throw new H({ message: "\u672A\u767B\u5F55CloudBase" });
      const i2 = { refresh_token: r2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", i2);
      if (a2.data.code) {
        const { code: e2 } = a2.data;
        if (e2 === "SIGN_PARAM_INVALID" || e2 === "REFRESH_TOKEN_EXPIRED" || e2 === "INVALID_REFRESH_TOKEN") {
          if (this._cache.getStore(s2) === Oe.ANONYMOUS && e2 === "INVALID_REFRESH_TOKEN") {
            const e3 = this._cache.getStore(o2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e3, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          ke(Ae), this._cache.removeStore(n2);
        }
        throw new H({ code: a2.data.code, message: `\u5237\u65B0access token\u5931\u8D25\uFF1A${a2.data.code}` });
      }
      if (a2.data.access_token)
        return ke(be), this._cache.setStore(e, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new H({ message: "refresh token\u4E0D\u5B58\u5728\uFF0C\u767B\u5F55\u72B6\u6001\u5F02\u5E38" });
      let s2 = this._cache.getStore(e), o2 = this._cache.getStore(t2), r2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, o2) && (r2 = false), (!s2 || !o2 || o2 < Date.now()) && r2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: o2 };
    }
    async request(e, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let o2 = "application/x-www-form-urlencoded";
      const r2 = __spreadValues({ action: e, env: this.config.env, dataVersion: "2019-08-16" }, t2);
      if (Ce.indexOf(e) === -1) {
        const { refreshTokenKey: e2 } = this._cache.keys;
        this._cache.getStore(e2) && (r2.access_token = (await this.getAccessToken()).accessToken);
      }
      let i2;
      if (e === "storage.uploadFile") {
        i2 = new FormData();
        for (let e2 in i2)
          i2.hasOwnProperty(e2) && i2[e2] !== void 0 && i2.append(e2, r2[e2]);
        o2 = "multipart/form-data";
      } else {
        o2 = "application/json", i2 = {};
        for (let e2 in r2)
          r2[e2] !== void 0 && (i2[e2] = r2[e2]);
      }
      let a2 = { headers: { "content-type": o2 } };
      n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: l2, search: h2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), l2 && (d2 = __spreadValues(__spreadValues({}, l2), d2));
      let f2 = function(e2, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let o3 = "";
        for (let e3 in n3)
          o3 === "" ? !s3 && (t3 += "?") : o3 += "&", o3 += `${e3}=${encodeURIComponent(n3[e3])}`;
        return /^http(s)?\:\/\//.test(t3 += o3) ? t3 : `${e2}${t3}`;
      }(te, "//tcb-api.tencentcloudapi.com/web", d2);
      h2 && (f2 += h2);
      const p2 = await this.post(__spreadValues({ url: f2, data: i2 }, a2)), g2 = p2.header && p2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), Number(p2.status) !== 200 && Number(p2.statusCode) !== 200 || !p2.data)
        throw new H({ code: "NETWORK_ERROR", message: "network request error" });
      return p2;
    }
    async send(e, t2 = {}) {
      const n2 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
      if (n2.data.code === "ACCESS_TOKEN_EXPIRED" && Ce.indexOf(e) === -1) {
        await this.refreshAccessToken();
        const n3 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
        if (n3.data.code)
          throw new H({ code: n3.data.code, message: n3.data.message });
        return n3.data;
      }
      if (n2.data.code)
        throw new H({ code: n2.data.code, message: n2.data.message });
      return n2.data;
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
  }
  const Le = {};
  function De(e) {
    return Le[e];
  }
  class Ne {
    constructor(e) {
      this.config = e, this._cache = me(e.env), this._request = De(e.env);
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
    setAccessToken(e, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e), e;
    }
    setLocalUserInfo(e) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e);
    }
  }
  class qe {
    constructor(e) {
      if (!e)
        throw new H({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e, this._cache = me(this._envId), this._request = De(this._envId), this.setUserInfo();
    }
    linkWithTicket(e) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e });
    }
    linkWithRedirect(e) {
      e.signInWithRedirect();
    }
    updatePassword(e, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e });
    }
    updateEmail(e) {
      return this._request.send("auth.updateEmail", { newEmail: e });
    }
    updateUsername(e) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e });
    }
    async getLinkedUidList() {
      const { data: e } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e;
      return n2.forEach((e2) => {
        e2.wxOpenId && e2.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e) {
      return this._request.send("auth.setPrimaryUid", { uid: e });
    }
    unlink(e) {
      return this._request.send("auth.unlink", { platform: e });
    }
    async update(e) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 } = e, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const { data: e } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e), e;
    }
    setUserInfo() {
      const { userInfoKey: e } = this._cache.keys, t2 = this._cache.getStore(e);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e2) => {
        this[e2] = t2[e2];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e), this.setUserInfo();
    }
  }
  class Fe {
    constructor(e) {
      if (!e)
        throw new H({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = me(e);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, o2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = this._cache.getStore(s2);
      this.credential = { refreshToken: o2, accessToken: r2, accessTokenExpire: i2 }, this.user = new qe(e);
    }
    get isAnonymousAuth() {
      return this.loginType === Oe.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === Oe.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === Oe.WECHAT || this.loginType === Oe.WECHAT_OPEN || this.loginType === Oe.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class Me extends Ne {
    async signIn() {
      this._cache.updatePersistence("local");
      const { anonymousUuidKey: e, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e) || void 0, s2 = this._cache.getStore(t2) || void 0, o2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
      if (o2.uuid && o2.refresh_token) {
        this._setAnonymousUUID(o2.uuid), this.setRefreshToken(o2.refresh_token), await this._request.refreshAccessToken(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.ANONYMOUS, persistence: "local" });
        const e2 = new Fe(this.config.env);
        return await e2.user.refresh(), e2;
      }
      throw new H({ message: "\u533F\u540D\u767B\u5F55\u5931\u8D25" });
    }
    async linkAndRetrieveDataWithTicket(e) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), o2 = this._cache.getStore(n2), r2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: o2, ticket: e });
      if (r2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), ke(Ie, { env: this.config.env }), ke(Pe, { loginType: Oe.CUSTOM, persistence: "local" }), { credential: { refreshToken: r2.refresh_token } };
      throw new H({ message: "\u533F\u540D\u8F6C\u5316\u5931\u8D25" });
    }
    _setAnonymousUUID(e) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e), this._cache.setStore(n2, Oe.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class je extends Ne {
    async signIn(e) {
      if (typeof e != "string")
        throw new H({ param: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new Fe(this.config.env);
      throw new H({ message: "\u81EA\u5B9A\u4E49\u767B\u5F55\u5931\u8D25" });
    }
  }
  class $e extends Ne {
    async signIn(e, t2) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token: r2, access_token_expire: i2 } = s2;
      if (o2)
        return this.setRefreshToken(o2), r2 && i2 ? this.setAccessToken(r2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.EMAIL, persistence: this.config.persistence }), new Fe(this.config.env);
      throw s2.code ? new H({ code: s2.code, message: `\u90AE\u7BB1\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new H({ message: "\u90AE\u7BB1\u767B\u5F55\u5931\u8D25" });
    }
    async activate(e) {
      return this._request.send("auth.activateEndUserMail", { token: e });
    }
    async resetPasswordWithToken(e, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e, newPassword: t2 });
    }
  }
  class Be extends Ne {
    async signIn(e, t2) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "username must be a string" });
      typeof t2 != "string" && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Oe.USERNAME, username: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token_expire: r2, access_token: i2 } = s2;
      if (o2)
        return this.setRefreshToken(o2), i2 && r2 ? this.setAccessToken(i2, r2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.USERNAME, persistence: this.config.persistence }), new Fe(this.config.env);
      throw s2.code ? new H({ code: s2.code, message: `\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new H({ message: "\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25" });
    }
  }
  class Ke {
    constructor(e) {
      this.config = e, this._cache = me(e.env), this._request = De(e.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), ve(Pe, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e = this.hasLoginState();
      return e && e.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new Me(this.config);
    }
    customAuthProvider() {
      return new je(this.config);
    }
    emailAuthProvider() {
      return new $e(this.config);
    }
    usernameAuthProvider() {
      return new Be(this.config);
    }
    async signInAnonymously() {
      return new Me(this.config).signIn();
    }
    async signInWithEmailAndPassword(e, t2) {
      return new $e(this.config).signIn(e, t2);
    }
    signInWithUsernameAndPassword(e, t2) {
      return new Be(this.config).signIn(e, t2);
    }
    async linkAndRetrieveDataWithTicket(e) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new Me(this.config)), ve(Ie, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e);
    }
    async signOut() {
      if (this.loginType === Oe.ANONYMOUS)
        throw new H({ message: "\u533F\u540D\u7528\u6237\u4E0D\u652F\u6301\u767B\u51FA\u64CD\u4F5C" });
      const { refreshTokenKey: e, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e);
      if (!s2)
        return;
      const o2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e), this._cache.removeStore(t2), this._cache.removeStore(n2), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.NULL, persistence: this.config.persistence }), o2;
    }
    async signUpWithEmailAndPassword(e, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e, password: t2 });
    }
    async sendPasswordResetEmail(e) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e });
    }
    onLoginStateChanged(e) {
      ve(Se, () => {
        const t3 = this.hasLoginState();
        e.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e.call(this, t2);
    }
    onLoginStateExpired(e) {
      ve(Ae, e.bind(this));
    }
    onAccessTokenRefreshed(e) {
      ve(be, e.bind(this));
    }
    onAnonymousConverted(e) {
      ve(Ie, e.bind(this));
    }
    onLoginTypeChanged(e) {
      ve(Pe, () => {
        const t2 = this.hasLoginState();
        e.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { refreshTokenKey: e } = this._cache.keys;
      return this._cache.getStore(e) ? new Fe(this.config.env) : null;
    }
    async isUsernameRegistered(e) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e) {
      return new je(this.config).signIn(e);
    }
    shouldRefreshAccessToken(e) {
      this._request._shouldRefreshAccessTokenHook = e.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e) => e.code ? e : __spreadProps(__spreadValues({}, e.data), { requestId: e.seqId }));
    }
    getAuthHeader() {
      const { refreshTokenKey: e, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e) {
      const { env: t2 } = e.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e) {
      const { loginType: t2, persistence: n2, env: s2 } = e.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const We = function(e, t2) {
    t2 = t2 || oe();
    const n2 = De(this.config.env), { cloudPath: s2, filePath: o2, onUploadProgress: r2, fileType: i2 = "image" } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e2, f2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: f2, file: o2, name: s2, fileType: i2, onUploadProgress: r2 }).then((e3) => {
        e3.statusCode === 201 ? t2(null, { fileID: l2, requestId: d2 }) : t2(new H({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e3.data}` }));
      }).catch((e3) => {
        t2(e3);
      });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, He = function(e, t2) {
    t2 = t2 || oe();
    const n2 = De(this.config.env), { cloudPath: s2 } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      t2(null, e2);
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, ze = function({ fileList: e }, t2) {
    if (t2 = t2 || oe(), !e || !Array.isArray(e))
      return { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" };
    for (let t3 of e)
      if (!t3 || typeof t3 != "string")
        return { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" };
    const n2 = { fileid_list: e };
    return De(this.config.env).send("storage.batchDeleteFile", n2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.delete_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Je = function({ fileList: e }, t2) {
    t2 = t2 || oe(), e && Array.isArray(e) || t2(null, { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" });
    let n2 = [];
    for (let s3 of e)
      typeof s3 == "object" ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5305\u542BfileID\u548CmaxAge\u7684\u5BF9\u8C61" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : typeof s3 == "string" ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" });
    const s2 = { file_list: n2 };
    return De(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.download_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Ve = async function({ fileID: e }, t2) {
    const n2 = (await Je.call(this, { fileList: [{ fileID: e, maxAge: 600 }] })).fileList[0];
    if (n2.code !== "SUCCESS")
      return t2 ? t2(n2) : new Promise((e2) => {
        e2(n2);
      });
    const s2 = De(this.config.env);
    let o2 = n2.download_url;
    if (o2 = encodeURI(o2), !t2)
      return s2.download({ url: o2 });
    t2(await s2.download({ url: o2 }));
  }, Ye = function({ name: e, data: t2, query: n2, parse: s2, search: o2 }, r2) {
    const i2 = r2 || oe();
    let a2;
    try {
      a2 = t2 ? JSON.stringify(t2) : "";
    } catch (e2) {
      return Promise.reject(e2);
    }
    if (!e)
      return Promise.reject(new H({ code: "PARAM_ERROR", message: "\u51FD\u6570\u540D\u4E0D\u80FD\u4E3A\u7A7A" }));
    const c2 = { inQuery: n2, parse: s2, search: o2, function_name: e, request_data: a2 };
    return De(this.config.env).send("functions.invokeFunction", c2).then((e2) => {
      if (e2.code)
        i2(null, e2);
      else {
        let t3 = e2.data.response_data;
        if (s2)
          i2(null, { result: t3, requestId: e2.requestId });
        else
          try {
            t3 = JSON.parse(e2.data.response_data), i2(null, { result: t3, requestId: e2.requestId });
          } catch (e3) {
            i2(new H({ message: "response data must be json" }));
          }
      }
      return i2.promise;
    }).catch((e2) => {
      i2(e2);
    }), i2.promise;
  }, Xe = { timeout: 15e3, persistence: "session" }, Ge = {};
  class Qe {
    constructor(e) {
      this.config = e || this.config, this.authObj = void 0;
    }
    init(e) {
      switch (ue.adapter || (this.requestClient = new ue.adapter.reqClass({ timeout: e.timeout || 5e3, timeoutMsg: `\u8BF7\u6C42\u5728${(e.timeout || 5e3) / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD` })), this.config = __spreadValues(__spreadValues({}, Xe), e), true) {
        case this.config.timeout > 6e5:
          console.warn("timeout\u5927\u4E8E\u53EF\u914D\u7F6E\u4E0A\u9650[10\u5206\u949F]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0A\u9650\u6570\u503C"), this.config.timeout = 6e5;
          break;
        case this.config.timeout < 100:
          console.warn("timeout\u5C0F\u4E8E\u53EF\u914D\u7F6E\u4E0B\u9650[100ms]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0B\u9650\u6570\u503C"), this.config.timeout = 100;
      }
      return new Qe(this.config);
    }
    auth({ persistence: e } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e || ue.adapter.primaryStorage || Xe.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e2) {
        const { env: t3 } = e2;
        pe[t3] = new fe(e2), ge[t3] = new fe(__spreadProps(__spreadValues({}, e2), { persistence: "local" }));
      }(this.config), n2 = this.config, Le[n2.env] = new xe(n2), this.authObj = new Ke(this.config), this.authObj;
    }
    on(e, t2) {
      return ve.apply(this, [e, t2]);
    }
    off(e, t2) {
      return Te.apply(this, [e, t2]);
    }
    callFunction(e, t2) {
      return Ye.apply(this, [e, t2]);
    }
    deleteFile(e, t2) {
      return ze.apply(this, [e, t2]);
    }
    getTempFileURL(e, t2) {
      return Je.apply(this, [e, t2]);
    }
    downloadFile(e, t2) {
      return Ve.apply(this, [e, t2]);
    }
    uploadFile(e, t2) {
      return We.apply(this, [e, t2]);
    }
    getUploadMetadata(e, t2) {
      return He.apply(this, [e, t2]);
    }
    registerExtension(e) {
      Ge[e.name] = e;
    }
    async invokeExtension(e, t2) {
      const n2 = Ge[e];
      if (!n2)
        throw new H({ message: `\u6269\u5C55${e} \u5FC5\u987B\u5148\u6CE8\u518C` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e) {
      const { adapter: t2, runtime: n2 } = ce(e) || {};
      t2 && (ue.adapter = t2), n2 && (ue.runtime = n2);
    }
  }
  var Ze = new Qe();
  function et(e, t2, n2) {
    n2 === void 0 && (n2 = {});
    var s2 = /\?/.test(t2), o2 = "";
    for (var r2 in n2)
      o2 === "" ? !s2 && (t2 += "?") : o2 += "&", o2 += r2 + "=" + encodeURIComponent(n2[r2]);
    return /^http(s)?:\/\//.test(t2 += o2) ? t2 : "" + e + t2;
  }
  class tt {
    post(e) {
      const { url: t2, data: n2, headers: s2 } = e;
      return new Promise((e2, o2) => {
        X.request({ url: et("https:", t2), data: n2, method: "POST", header: s2, success(t3) {
          e2(t3);
        }, fail(e3) {
          o2(e3);
        } });
      });
    }
    upload(e) {
      return new Promise((t2, n2) => {
        const { url: s2, file: o2, data: r2, headers: i2, fileType: a2 } = e, c2 = X.uploadFile({ url: et("https:", s2), name: "file", formData: Object.assign({}, r2), filePath: o2, fileType: a2, header: i2, success(e2) {
          const n3 = { statusCode: e2.statusCode, data: e2.data || {} };
          e2.statusCode === 200 && r2.success_action_status && (n3.statusCode = parseInt(r2.success_action_status, 10)), t2(n3);
        }, fail(e2) {
          n2(new Error(e2.errMsg || "uploadFile:fail"));
        } });
        typeof e.onUploadProgress == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((t3) => {
          e.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const nt = { setItem(e, t2) {
    X.setStorageSync(e, t2);
  }, getItem: (e) => X.getStorageSync(e), removeItem(e) {
    X.removeStorageSync(e);
  }, clear() {
    X.clearStorageSync();
  } };
  var st = { genAdapter: function() {
    return { root: {}, reqClass: tt, localStorage: nt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  Ze.useAdapters(st);
  const ot = Ze, rt = ot.init;
  ot.init = function(e) {
    e.env = e.spaceId;
    const t2 = rt.call(this, e);
    t2.config.provider = "tencent", t2.config.spaceId = e.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e2) {
      const t3 = n2.call(this, e2);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e3) => {
        t3[e3] = W(t3[e3]).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var it = ot;
  function at(e) {
    return e && at(e.__v_raw) || e;
  }
  function ct() {
    return { token: X.getStorageSync("uni_id_token") || X.getStorageSync("uniIdToken"), tokenExpired: X.getStorageSync("uni_id_token_expired") };
  }
  function ut({ token: e, tokenExpired: t2 } = {}) {
    e && X.setStorageSync("uni_id_token", e), t2 && X.setStorageSync("uni_id_token_expired", t2);
  }
  function lt() {
    if (m !== "web")
      return;
    uni.getStorageSync("__LAST_DCLOUD_APPID") !== v && (uni.setStorageSync("__LAST_DCLOUD_APPID", v), console.warn("\u68C0\u6D4B\u5230\u5F53\u524D\u9879\u76EE\u4E0E\u4E0A\u6B21\u8FD0\u884C\u5230\u6B64\u7AEF\u53E3\u7684\u9879\u76EE\u4E0D\u4E00\u81F4\uFF0C\u81EA\u52A8\u6E05\u7406uni-id\u4FDD\u5B58\u7684token\u4FE1\u606F\uFF08\u4EC5\u5F00\u53D1\u8C03\u8BD5\u65F6\u751F\u6548\uFF09"), X.removeStorageSync("uni_id_token"), X.removeStorageSync("uniIdToken"), X.removeStorageSync("uni_id_token_expired"));
  }
  var ht = class extends Z {
    getAccessToken() {
      return new Promise((e, t2) => {
        const n2 = "Anonymous_Access_token";
        this.setAccessToken(n2), e(n2);
      });
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = Y.sign(n2, this.config.clientSecret);
      const o2 = V();
      s2["x-client-info"] = encodeURIComponent(JSON.stringify(o2));
      const { token: r2 } = ct();
      return s2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: JSON.parse(JSON.stringify(s2)) };
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
      return new Promise((i2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, success(e2) {
          e2 && e2.statusCode < 400 ? i2(e2) : a2(new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new H({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
          r2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new H({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      let o2;
      return this.getOSSUploadOptionsFromPath({ cloudPath: t2 }).then((t3) => {
        const { url: r2, formData: i2, name: a2 } = t3.result;
        o2 = t3.result.fileUrl;
        const c2 = { url: r2, formData: i2, name: a2, filePath: e, fileType: n2 };
        return this.uploadFileToOSS(Object.assign({}, c2, { onUploadProgress: s2 }));
      }).then(() => this.reportOSSUpload({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e, fileID: o2 }) : s3(new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }));
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2));
    }
    getTempFileURL({ fileList: e } = {}) {
      const t2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2));
    }
  };
  var dt = { init(e) {
    const t2 = new ht(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  function ft({ data: e }) {
    let t2;
    t2 = V();
    const n2 = JSON.parse(JSON.stringify(e || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e2 } = ct();
      e2 && (n2.uniIdToken = e2);
    }
    return n2;
  }
  function pt({ name: e, data: t2 } = {}) {
    const { localAddress: n2, localPort: s2 } = this.__dev__, o2 = { aliyun: "aliyun", tencent: "tcb" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${n2}:${s2}/system/check-function`, a2 = `http://${n2}:${s2}/cloudfunctions/${e}`;
    return new Promise((t3, n3) => {
      X.request({ method: "POST", url: i2, data: { name: e, platform: m, provider: o2, spaceId: r2 }, timeout: 3e3, success(e2) {
        t3(e2);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570\u3002" } });
      } });
    }).then(({ data: e2 } = {}) => {
      const { code: t3, message: n3 } = e2 || {};
      return { code: t3 === 0 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: n3, message: s3 }) => {
      if (n3 !== 0) {
        switch (n3) {
          case "MODULE_ENCRYPTED":
            console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e}\uFF09\u4F9D\u8D56\u52A0\u5BC6\u516C\u5171\u6A21\u5757\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e}\uFF09\u5DF2\u52A0\u5BC6\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(s3 || "\u9700\u8981\u8BBF\u95EE\u52A0\u5BC6\u7684uni-clientDB-action\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u73AF\u5883");
            break;
          case "NETWORK_ERROR": {
            const e2 = "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B";
            throw console.error(e2), new Error(e2);
          }
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e2 = `\u68C0\u6D4B\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u51FA\u73B0\u9519\u8BEF\uFF1A${s3}\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u73AF\u5883\u6216\u91CD\u542F\u5BA2\u6237\u7AEF\u518D\u8BD5`;
            throw console.error(e2), new Error(e2);
          }
        }
        return this._callCloudFunction({ name: e, data: t2 });
      }
      return new Promise((e2, n4) => {
        const s4 = ft.call(this, { data: t2 });
        X.request({ method: "POST", url: a2, data: { provider: o2, platform: m, param: s4 }, success: ({ statusCode: t3, data: s5 } = {}) => !t3 || t3 >= 400 ? n4(new H({ code: s5.code || "SYS_ERR", message: s5.message || "request:fail" })) : e2({ result: s5 }), fail(e3) {
          n4(new H({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const gt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "\uFF0C\u4E91\u51FD\u6570[{functionName}]\u5728\u4E91\u7AEF\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u6B64\u4E91\u51FD\u6570\u540D\u79F0\u662F\u5426\u6B63\u786E\u4EE5\u53CA\u8BE5\u4E91\u51FD\u6570\u662F\u5426\u5DF2\u4E0A\u4F20\u5230\u670D\u52A1\u7A7A\u95F4", mode: "append" }];
  var mt = /[\\^$.*+?()[\]{}|]/g, yt = RegExp(mt.source);
  function _t(e, t2, n2) {
    return e.replace(new RegExp((s2 = t2) && yt.test(s2) ? s2.replace(mt, "\\$&") : s2, "g"), n2);
    var s2;
  }
  function wt({ functionName: e, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function vt(e) {
    const t2 = e.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = ft.call(e, { data: n3.data });
      const o2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb" }[this.config.provider];
      return t2.call(this, n3).then((e2) => (e2.errCode = 0, wt.call(this, { functionName: s2, result: e2, logPvd: o2 }), Promise.resolve(e2)), (e2) => (wt.call(this, { functionName: s2, result: e2, logPvd: o2 }), e2 && e2.message && (e2.message = function({ message: e3 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: o3, content: r2, mode: i2 } = n4[s3], a2 = e3.match(o3);
          if (!a2)
            continue;
          let c2 = r2;
          for (let e4 = 1; e4 < a2.length; e4++)
            c2 = _t(c2, `{$${e4}}`, a2[e4]);
          for (const e4 in t3)
            c2 = _t(c2, `{${e4}}`, t3[e4]);
          return i2 === "replace" ? c2 : e3 + c2;
        }
        return e3;
      }({ message: `[${n3.name}]: ${e2.message}`, formatter: gt, extraInfo: { functionName: s2 } })), Promise.reject(e2)));
    };
    e.callFunction = function(t3) {
      let s2;
      e.__dev__.debugInfo && !e.__dev__.debugInfo.forceRemote && _ ? (e._callCloudFunction || (e._callCloudFunction = n2, e._callLocalFunction = pt), s2 = pt) : s2 = n2, s2 = s2.bind(e);
      const o2 = s2(t3);
      return Object.defineProperty(o2, "result", { get: () => (console.warn("\u5F53\u524D\u8FD4\u56DE\u7ED3\u679C\u4E3APromise\u7C7B\u578B\uFF0C\u4E0D\u53EF\u76F4\u63A5\u8BBF\u95EE\u5176result\u5C5E\u6027\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), o2;
    };
  }
  const kt = Symbol("CLIENT_DB_INTERNAL");
  function Tt(e, t2) {
    return e.then = "DoNotReturnProxyWithAFunctionNamedThen", e._internalType = kt, e.__v_raw = void 0, new Proxy(e, { get(e2, n2, s2) {
      if (n2 === "_uniClient")
        return null;
      if (n2 in e2 || typeof n2 != "string") {
        const t3 = e2[n2];
        return typeof t3 == "function" ? t3.bind(e2) : t3;
      }
      return t2.get(e2, n2, s2);
    } });
  }
  function St(e) {
    return { on: (t2, n2) => {
      e[t2] = e[t2] || [], e[t2].indexOf(n2) > -1 || e[t2].push(n2);
    }, off: (t2, n2) => {
      e[t2] = e[t2] || [];
      const s2 = e[t2].indexOf(n2);
      s2 !== -1 && e[t2].splice(s2, 1);
    } };
  }
  const At = ["db.Geo", "db.command", "command.aggregate"];
  function Pt(e, t2) {
    return At.indexOf(`${e}.${t2}`) > -1;
  }
  function It(e) {
    switch (h(e = at(e))) {
      case "array":
        return e.map((e2) => It(e2));
      case "object":
        return e._internalType === kt || Object.keys(e).forEach((t2) => {
          e[t2] = It(e[t2]);
        }), e;
      case "regexp":
        return { $regexp: { source: e.source, flags: e.flags } };
      case "date":
        return { $date: e.toISOString() };
      default:
        return e;
    }
  }
  function bt(e) {
    return e && e.content && e.content.$method;
  }
  class Ot {
    constructor(e, t2, n2) {
      this.content = e, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e = this;
      const t2 = [e.content];
      for (; e.prevStage; )
        e = e.prevStage, t2.push(e.content);
      return { $db: t2.reverse().map((e2) => ({ $method: e2.$method, $param: It(e2.$param) })) };
    }
    getAction() {
      const e = this.toJSON().$db.find((e2) => e2.$method === "action");
      return e && e.$param && e.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e) => e.$method !== "action") };
    }
    get isAggregate() {
      let e = this;
      for (; e; ) {
        const t2 = bt(e), n2 = bt(e.prevStage);
        if (t2 === "aggregate" && n2 === "collection" || t2 === "pipeline")
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e = this;
      for (; e; ) {
        if (bt(e) === "command")
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e = this;
      for (; e; ) {
        const t2 = bt(e), n2 = bt(e.prevStage);
        if (t2 === "aggregate" && n2 === "command")
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get count() {
      if (!this.isAggregate)
        return function() {
          return this._send("count", Array.from(arguments));
        };
      const e = this;
      return function() {
        return Ct({ $method: "count", $param: It(Array.from(arguments)) }, e, this._database);
      };
    }
    get remove() {
      if (!this.isCommand)
        return function() {
          return this._send("remove", Array.from(arguments));
        };
      const e = this;
      return function() {
        return Ct({ $method: "remove", $param: It(Array.from(arguments)) }, e, this._database);
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    add() {
      return this._send("add", Array.from(arguments));
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      if (!this.isCommand)
        return function() {
          throw new Error("JQL\u7981\u6B62\u4F7F\u7528set\u65B9\u6CD5");
        };
      const e = this;
      return function() {
        return Ct({ $method: "set", $param: It(Array.from(arguments)) }, e, this._database);
      };
    }
    _send(e, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e, $param: It(t2) }), p) {
        const e2 = s2.$db.find((e3) => e3.$method === "collection"), t3 = e2 && e2.$param;
        t3 && t3.length === 1 && typeof e2.$param[0] == "string" && e2.$param[0].indexOf(",") > -1 && console.warn("\u68C0\u6D4B\u5230\u4F7F\u7528JQL\u8BED\u6CD5\u8054\u8868\u67E5\u8BE2\u65F6\uFF0C\u672A\u4F7F\u7528getTemp\u5148\u8FC7\u6EE4\u4E3B\u8868\u6570\u636E\uFF0C\u5728\u4E3B\u8868\u6570\u636E\u91CF\u5927\u7684\u60C5\u51B5\u4E0B\u53EF\u80FD\u4F1A\u67E5\u8BE2\u7F13\u6162\u3002\n- \u5982\u4F55\u4F18\u5316\u8BF7\u53C2\u8003\u6B64\u6587\u6863\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- \u5982\u679C\u4E3B\u8868\u6570\u636E\u91CF\u5F88\u5C0F\u8BF7\u5FFD\u7565\u6B64\u4FE1\u606F\uFF0C\u9879\u76EE\u53D1\u884C\u65F6\u4E0D\u4F1A\u51FA\u73B0\u6B64\u63D0\u793A\u3002");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function Ct(e, t2, n2) {
    return Tt(new Ot(e, t2, n2), { get(e2, t3) {
      let s2 = "db";
      return e2 && e2.content && (s2 = e2.content.$method), Pt(s2, t3) ? Ct({ $method: t3 }, e2, n2) : function() {
        return Ct({ $method: t3, $param: It(Array.from(arguments)) }, e2, n2);
      };
    } });
  }
  function Et({ path: e, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e.map((e2) => ({ $method: e2 })), { $method: t2, $param: this.param }] };
      }
    };
  }
  class Rt extends class {
    constructor({ uniClient: e = {} } = {}) {
      this._uniClient = e, this._authCallBacks = {}, this._dbCallBacks = {}, e.isDefault && (this._dbCallBacks = T("_globalUniCloudDatabaseCallback")), this.auth = St(this._authCallBacks), Object.assign(this, St(this._dbCallBacks)), this.env = Tt({}, { get: (e2, t2) => ({ $env: t2 }) }), this.Geo = Tt({}, { get: (e2, t2) => Et({ path: ["Geo"], method: t2 }) }), this.serverDate = Et({ path: [], method: "serverDate" }), this.RegExp = Et({ path: [], method: "RegExp" });
    }
    getCloudEnv(e) {
      if (typeof e != "string" || !e.trim())
        throw new Error("getCloudEnv\u53C2\u6570\u9519\u8BEF");
      return { $env: e.replace("$cloudEnv_", "") };
    }
    _callback(e, t2) {
      const n2 = this._dbCallBacks;
      n2[e] && n2[e].forEach((e2) => {
        e2(...t2);
      });
    }
    _callbackAuth(e, t2) {
      const n2 = this._authCallBacks;
      n2[e] && n2[e].forEach((e2) => {
        e2(...t2);
      });
    }
    multiSend() {
      const e = Array.from(arguments), t2 = e.map((e2) => {
        const t3 = e2.getAction(), n2 = e2.getCommand();
        if (n2.$db[n2.$db.length - 1].$method !== "getTemp")
          throw new Error("multiSend\u53EA\u652F\u6301\u5B50\u547D\u4EE4\u5185\u4F7F\u7528getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e });
    }
  } {
    _callCloudFunction({ action: e, command: t2, multiCommand: n2, queryList: s2 }) {
      function o2(e2, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const o3 = s2[n3];
            o3.udb && typeof o3.udb.setResult == "function" && (t3 ? o3.udb.setResult(t3) : o3.udb.setResult(e2.result.dataList[n3]));
          }
      }
      const r2 = this;
      function i2(e2) {
        return r2._callback("error", [e2]), b(O("database", "fail"), e2).then(() => b(O("database", "complete"), e2)).then(() => (o2(null, e2), j(R, { type: L, content: e2 }), Promise.reject(e2)));
      }
      const a2 = b(O("database", "invoke")), c2 = this._uniClient;
      return a2.then(() => c2.callFunction({ name: "DCloud-clientDB", type: l, data: { action: e, command: t2, multiCommand: n2 } })).then((e2) => {
        const { code: t3, message: n3, token: s3, tokenExpired: r3, systemInfo: a3 = [] } = e2.result;
        if (a3)
          for (let e3 = 0; e3 < a3.length; e3++) {
            const { level: t4, message: n4, detail: s4 } = a3[e3], o3 = console[m === "app" && t4 === "warn" ? "error" : t4] || console.log;
            let r4 = "[System Info]" + n4;
            s4 && (r4 = `${r4}
\u8BE6\u7EC6\u4FE1\u606F\uFF1A${s4}`), o3(r4);
          }
        if (t3) {
          return i2(new H({ code: t3, message: n3, requestId: e2.requestId }));
        }
        e2.result.errCode = e2.result.code, e2.result.errMsg = e2.result.message, s3 && r3 && (ut({ token: s3, tokenExpired: r3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: r3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: r3 }]), j(x, { token: s3, tokenExpired: r3 }));
        const c3 = [{ prop: "affectedDocs", tips: "affectedDocs\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528inserted/deleted/updated/data.length\u66FF\u4EE3" }, { prop: "code", tips: "code\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errCode\u66FF\u4EE3" }, { prop: "message", tips: "message\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errMsg\u66FF\u4EE3" }];
        for (let t4 = 0; t4 < c3.length; t4++) {
          const { prop: n4, tips: s4 } = c3[t4];
          if (n4 in e2.result) {
            const t5 = e2.result[n4];
            Object.defineProperty(e2.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e3) {
          return b(O("database", "success"), e3).then(() => b(O("database", "complete"), e3)).then(() => (o2(e3, null), j(R, { type: L, content: e3 }), Promise.resolve(e3)));
        }(e2);
      }, (e2) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e2.message) && console.warn("clientDB\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5728web\u63A7\u5236\u53F0\u4FDD\u5B58\u4E00\u6B21schema\u4EE5\u5F00\u542FclientDB");
        return i2(new H({ code: e2.code || "SYSTEM_ERROR", message: e2.message, requestId: e2.requestId }));
      });
    }
  }
  function Ut(e) {
    e.database = function(t2) {
      if (t2 && Object.keys(t2).length > 0)
        return e.init(t2).database();
      if (this._database)
        return this._database;
      const n2 = function(e2, t3 = {}) {
        return Tt(new e2(t3), { get: (e3, t4) => Pt("db", t4) ? Ct({ $method: t4 }, null, e3) : function() {
          return Ct({ $method: t4, $param: It(Array.from(arguments)) }, null, e3);
        } });
      }(Rt, { uniClient: e });
      return this._database = n2, n2;
    };
  }
  const xt = "token\u65E0\u6548\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Lt = "token\u8FC7\u671F\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Dt = { TOKEN_INVALID_TOKEN_EXPIRED: Lt, TOKEN_INVALID_INVALID_CLIENTID: xt, TOKEN_INVALID: xt, TOKEN_INVALID_WRONG_TOKEN: xt, TOKEN_INVALID_ANONYMOUS_USER: xt }, Nt = { "uni-id-token-expired": Lt, "uni-id-check-token-failed": xt, "uni-id-token-not-exist": xt, "uni-id-check-device-feature-failed": xt };
  function qt(e, t2) {
    let n2 = "";
    return n2 = e ? `${e}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function Ft(e = [], t2 = "") {
    const n2 = [], s2 = [];
    return e.forEach((e2) => {
      e2.needLogin === true ? n2.push(qt(t2, e2.path)) : e2.needLogin === false && s2.push(qt(t2, e2.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function Mt(e) {
    return e.split("?")[0].replace(/^\//, "");
  }
  function jt() {
    return function(e) {
      let t2 = e && e.$page && e.$page.fullPath || "";
      return t2 ? (t2.charAt(0) !== "/" && (t2 = "/" + t2), t2) : t2;
    }(function() {
      const e = getCurrentPages();
      return e[e.length - 1];
    }());
  }
  function $t() {
    return Mt(jt());
  }
  function Bt(e = "", t2 = {}) {
    if (!e)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = Mt(e);
    return n2.some((e2) => e2.pagePath === s2);
  }
  const Kt = !!t$k.uniIdRouter;
  const { loginPage: Wt, routerNeedLogin: Ht, resToLogin: zt, needLoginPage: Jt, notNeedLoginPage: Vt, loginPageInTabBar: Yt } = function({ pages: e = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: o2 = {} } = t$k) {
    const { loginPage: r2, needLogin: i2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = Ft(e), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e2 = []) {
      const t2 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: o3 = [] } = e3, { needLoginPage: r3, notNeedLoginPage: i3 } = Ft(o3, s3);
        t2.push(...r3), n3.push(...i3);
      }), { needLoginPage: t2, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: r2, routerNeedLogin: i2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: Bt(r2, o2) };
  }();
  if (Jt.indexOf(Wt) > -1)
    throw new Error(`Login page [${Wt}] should not be "needLogin", please check your pages.json`);
  function Xt(e) {
    const t2 = Mt(function(e2) {
      const t3 = $t(), n2 = e2.charAt(0), s2 = e2.split("?")[0];
      if (n2 === "/")
        return s2;
      const o2 = s2.replace(/^\//, "").split("/"), r2 = t3.split("/");
      r2.pop();
      for (let e3 = 0; e3 < o2.length; e3++) {
        const t4 = o2[e3];
        t4 === ".." ? r2.pop() : t4 !== "." && r2.push(t4);
      }
      return r2[0] === "" && r2.shift(), r2.join("/");
    }(e));
    return !(Vt.indexOf(t2) > -1) && (Jt.indexOf(t2) > -1 || Ht.some((t3) => function(e2, t4) {
      return new RegExp(t4).test(e2);
    }(e, t3)));
  }
  function Gt({ redirect: e }) {
    const t2 = Mt(e), n2 = Mt(Wt);
    return $t() !== n2 && t2 !== n2;
  }
  function Qt({ api: e, redirect: t2 } = {}) {
    if (!t2 || !Gt({ redirect: t2 }))
      return;
    const n2 = function(e2, t3) {
      return e2.charAt(0) !== "/" && (e2 = "/" + e2), t3 ? e2.indexOf("?") > -1 ? e2 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e2 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e2;
    }(Wt, t2);
    Yt ? e !== "navigateTo" && e !== "redirectTo" || (e = "switchTab") : e === "switchTab" && (e = "navigateTo"), setTimeout(() => {
      uni[e]({ url: n2 });
    });
  }
  function Zt({ url: e } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e2, tokenExpired: t3 } = ct();
      let n3;
      if (e2) {
        if (t3 < Date.now()) {
          const e3 = "uni-id-token-expired";
          n3 = { errCode: e3, errMsg: Nt[e3] };
        }
      } else {
        const e3 = "uni-id-check-token-failed";
        n3 = { errCode: e3, errMsg: Nt[e3] };
      }
      return n3;
    }();
    if (Xt(e) && n2) {
      n2.uniIdRedirectUrl = e;
      if (q(U).length > 0)
        return setTimeout(() => {
          j(U, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function en() {
    !function() {
      const e2 = jt(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Zt({ url: e2 });
      t2 || n2 && Qt({ api: "redirectTo", redirect: e2 });
    }();
    const e = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e.length; t2++) {
      const n2 = e[t2];
      uni.addInterceptor(n2, { invoke(e2) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Zt({ url: e2.url });
        return t3 ? e2 : s2 ? (Qt({ api: n2, redirect: e2.url }), false) : e2;
      } });
    }
  }
  function tn() {
    this.onResponse((e) => {
      const { type: t2, content: n2 } = e;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e2) {
            const { errCode: t3 } = e2;
            return t3 in Nt;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e2) {
            const { errCode: t3 } = e2;
            return t3 in Dt;
          }(n2);
      }
      s2 && function(e2 = {}) {
        const t3 = q(U);
        K().then(() => {
          const n3 = jt();
          if (n3 && Gt({ redirect: n3 }))
            return t3.length > 0 ? j(U, Object.assign({ uniIdRedirectUrl: n3 }, e2)) : void (Wt && Qt({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function nn(e) {
    !function(e2) {
      e2.onResponse = function(e3) {
        F(R, e3);
      }, e2.offResponse = function(e3) {
        M(R, e3);
      };
    }(e), function(e2) {
      e2.onNeedLogin = function(e3) {
        F(U, e3);
      }, e2.offNeedLogin = function(e3) {
        M(U, e3);
      }, Kt && (T("uni-cloud-status").needLoginInit || (T("uni-cloud-status").needLoginInit = true, K().then(() => {
        en.call(e2);
      }), zt && tn.call(e2)));
    }(e), function(e2) {
      e2.onRefreshToken = function(e3) {
        F(x, e3);
      }, e2.offRefreshToken = function(e3) {
        M(x, e3);
      };
    }(e);
  }
  let sn;
  const on = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", rn = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function an() {
    const e = ct().token || "", t2 = e.split(".");
    if (!e || t2.length !== 3)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(sn(s2).split("").map(function(e2) {
        return "%" + ("00" + e2.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e2) {
      throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + e2.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  sn = typeof atob != "function" ? function(e) {
    if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !rn.test(e))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e += "==".slice(2 - (3 & e.length));
    for (var n2, s2, o2 = "", r2 = 0; r2 < e.length; )
      t2 = on.indexOf(e.charAt(r2++)) << 18 | on.indexOf(e.charAt(r2++)) << 12 | (n2 = on.indexOf(e.charAt(r2++))) << 6 | (s2 = on.indexOf(e.charAt(r2++))), o2 += n2 === 64 ? String.fromCharCode(t2 >> 16 & 255) : s2 === 64 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return o2;
  } : atob;
  var cn = s(function(e, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function o2(e2, t3) {
      return e2.tempFiles.forEach((e3, n3) => {
        e3.name || (e3.name = e3.path.substring(e3.path.lastIndexOf("/") + 1)), t3 && (e3.fileType = t3), e3.cloudPath = Date.now() + "_" + n3 + e3.name.substring(e3.name.lastIndexOf("."));
      }), e2.tempFilePaths || (e2.tempFilePaths = e2.tempFiles.map((e3) => e3.path)), e2;
    }
    function r2(e2, t3, { onChooseFile: s3, onUploadProgress: o3 }) {
      return t3.then((e3) => {
        if (s3) {
          const t4 = s3(e3);
          if (t4 !== void 0)
            return Promise.resolve(t4).then((t5) => t5 === void 0 ? e3 : t5);
        }
        return e3;
      }).then((t4) => t4 === false ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e3, t5, s4 = 5, o4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const r3 = t5.tempFiles, i2 = r3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= i2)
              return void (!r3.find((e4) => !e4.url && !e4.errMsg) && n3(t5));
            const u2 = r3[s5];
            e3.uploadFile({ filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, onUploadProgress(e4) {
              e4.index = s5, e4.tempFile = u2, e4.tempFilePath = u2.path, o4 && o4(e4);
            } }).then((e4) => {
              u2.url = e4.fileID, s5 < i2 && c2();
            }).catch((e4) => {
              u2.errMsg = e4.errMsg || e4.message, s5 < i2 && c2();
            });
          }
        });
      }(e2, t4, 5, o3));
    }
    t2.initChooseAndUploadFile = function(e2) {
      return function(t3 = { type: "all" }) {
        return t3.type === "image" ? r2(e2, function(e3) {
          const { count: t4, sizeType: n3, sourceType: r3 = ["album", "camera"], extension: i2 } = e3;
          return new Promise((e4, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: r3, extension: i2, success(t5) {
              e4(o2(t5, "image"));
            }, fail(e5) {
              a2({ errMsg: e5.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : t3.type === "video" ? r2(e2, function(e3) {
          const { camera: t4, compressed: n3, maxDuration: r3, sourceType: i2 = ["album", "camera"], extension: a2 } = e3;
          return new Promise((e4, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: r3, sourceType: i2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: r4, height: i3, width: a3 } = t5;
              e4(o2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: r4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: i3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e5) {
              c2({ errMsg: e5.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : r2(e2, function(e3) {
          const { count: t4, extension: n3 } = e3;
          return new Promise((e4, r3) => {
            let i2 = uni.chooseFile;
            if (typeof wx != "undefined" && typeof wx.chooseMessageFile == "function" && (i2 = wx.chooseMessageFile), typeof i2 != "function")
              return r3({ errMsg: s2 + " \u8BF7\u6307\u5B9A type \u7C7B\u578B\uFF0C\u8BE5\u5E73\u53F0\u4EC5\u652F\u6301\u9009\u62E9 image \u6216 video\u3002" });
            i2({ type: "all", count: t4, extension: n3, success(t5) {
              e4(o2(t5));
            }, fail(e5) {
              r3({ errMsg: e5.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), un = n(cn);
  const ln = "manual";
  function hn(e) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {} }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e2 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e2.push(this[t2]);
        }), e2;
      }, (e2, t2) => {
        if (this.loadtime === ln)
          return;
        let n2 = false;
        const s2 = [];
        for (let o2 = 2; o2 < e2.length; o2++)
          e2[o2] !== t2[o2] && (s2.push(e2[o2]), n2 = true);
        e2[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e2, t2) {
    }, mixinDatacomEasyGet({ getone: e2 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: o2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = o2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const r2 = e2 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = r2, t2 && t2(r2);
      }).catch((e3) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e3, n2 && n2(e3);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2 = e.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const o2 = t2.collection || this.collection;
      n2 = Array.isArray(o2) ? n2.collection(...o2) : n2.collection(o2);
      const r2 = t2.where || this.where;
      r2 && Object.keys(r2).length && (n2 = n2.where(r2));
      const i2 = t2.field || this.field;
      i2 && (n2 = n2.field(i2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      (t2.distinct !== void 0 ? t2.distinct : this.distinct) === true && (n2 = n2.distinct());
      const l2 = t2.orderby || this.orderby;
      l2 && (n2 = n2.orderBy(l2));
      const h2 = t2.pageCurrent !== void 0 ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = t2.pageSize !== void 0 ? t2.pageSize : this.mixinDatacomPage.size, f2 = t2.getcount !== void 0 ? t2.getcount : this.getcount, p2 = t2.gettree !== void 0 ? t2.gettree : this.gettree, g2 = t2.gettreepath !== void 0 ? t2.gettreepath : this.gettreepath, m2 = { getCount: f2 }, y2 = { limitLevel: t2.limitlevel !== void 0 ? t2.limitlevel : this.limitlevel, startWith: t2.startwith !== void 0 ? t2.startwith : this.startwith };
      return p2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function dn(e) {
    return function(t2, n2 = {}) {
      n2 = function(e2, t3 = {}) {
        return e2.customUI = t3.customUI || e2.customUI, Object.assign(e2.loadingOptions, t3.loadingOptions), Object.assign(e2.errorOptions, t3.errorOptions), typeof t3.secretMethods == "object" && (e2.secretMethods = t3.secretMethods), e2;
      }({ customUI: false, loadingOptions: { title: "\u52A0\u8F7D\u4E2D...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: o2, errorOptions: r2 } = n2, i2 = !s2;
      return new Proxy({}, { get: (s3, a2) => function({ fn: e2, interceptorName: t3, getCallbackArgs: n3 } = {}) {
        return async function(...s4) {
          const o3 = n3 ? n3({ params: s4 }) : {};
          let r3, i3;
          try {
            return await b(O(t3, "invoke"), __spreadValues({}, o3)), r3 = await e2(...s4), await b(O(t3, "success"), __spreadProps(__spreadValues({}, o3), { result: r3 })), r3;
          } catch (e3) {
            throw i3 = e3, await b(O(t3, "fail"), __spreadProps(__spreadValues({}, o3), { error: i3 })), i3;
          } finally {
            await b(O(t3, "complete"), i3 ? __spreadProps(__spreadValues({}, o3), { error: i3 }) : __spreadProps(__spreadValues({}, o3), { result: r3 }));
          }
        };
      }({ fn: async function s4(...c2) {
        let l2;
        i2 && uni.showLoading({ title: o2.title, mask: o2.mask });
        const h2 = { name: t2, type: u, data: { method: a2, params: c2 } };
        typeof n2.secretMethods == "object" && function(e2, t3) {
          const n3 = t3.data.method, s5 = e2.secretMethods || {}, o3 = s5[n3] || s5["*"];
          o3 && (t3.secret = o3);
        }(n2, h2);
        try {
          l2 = await e.callFunction(h2);
        } catch (e2) {
          l2 = { result: e2 };
        }
        const { errCode: d2, errMsg: f2, newToken: p2 } = l2.result || {};
        if (i2 && uni.hideLoading(), p2 && p2.token && p2.tokenExpired && (ut(p2), j(x, __spreadValues({}, p2))), d2) {
          if (i2)
            if (r2.type === "toast")
              uni.showToast({ title: f2, icon: "none" });
            else {
              if (r2.type !== "modal")
                throw new Error(`Invalid errorOptions.type: ${r2.type}`);
              {
                const { confirm: e3 } = await async function({ title: e4, content: t3, showCancel: n3, cancelText: s5, confirmText: o3 } = {}) {
                  return new Promise((r3, i3) => {
                    uni.showModal({ title: e4, content: t3, showCancel: n3, cancelText: s5, confirmText: o3, success(e5) {
                      r3(e5);
                    }, fail() {
                      r3({ confirm: false, cancel: true });
                    } });
                  });
                }({ title: "\u63D0\u793A", content: f2, showCancel: r2.retry, cancelText: "\u53D6\u6D88", confirmText: r2.retry ? "\u91CD\u8BD5" : "\u786E\u5B9A" });
                if (r2.retry && e3)
                  return s4(...c2);
              }
            }
          const e2 = new H({ code: d2, message: f2, requestId: l2.requestId });
          throw e2.detail = l2.result, j(R, { type: N, content: e2 }), e2;
        }
        return j(R, { type: N, content: l2.result }), l2.result;
      }, interceptorName: "callObject", getCallbackArgs: function({ params: e2 } = {}) {
        return { objectName: t2, methodName: a2, params: e2 };
      } }) });
    };
  }
  async function fn(e, t2) {
    const n2 = `http://${e}:${t2}/system/ping`;
    try {
      const e2 = await (s2 = { url: n2, timeout: 500 }, new Promise((e3, t3) => {
        X.request(__spreadProps(__spreadValues({}, s2), { success(t4) {
          e3(t4);
        }, fail(e4) {
          t3(e4);
        } }));
      }));
      return !(!e2.data || e2.data.code !== 0);
    } catch (e2) {
      return false;
    }
    var s2;
  }
  function pn(e) {
    if (e.initUniCloudStatus && e.initUniCloudStatus !== "rejected")
      return;
    let t2 = Promise.resolve();
    var n2;
    n2 = 1, t2 = new Promise((e2, t3) => {
      setTimeout(() => {
        e2();
      }, n2);
    }), e.isReady = false, e.isDefault = false;
    const s2 = e.auth();
    e.initUniCloudStatus = "pending", e.initUniCloud = t2.then(() => s2.getLoginState()).then((e2) => e2 ? Promise.resolve() : s2.signInAnonymously()).then(() => {
      if (m === "app") {
        const { osName: e2, osVersion: t3 } = uni.getSystemInfoSync();
        e2 === "ios" && function(e3) {
          if (!e3 || typeof e3 != "string")
            return 0;
          const t4 = e3.match(/^(\d+)./);
          return t4 && t4[1] ? parseInt(t4[1]) : 0;
        }(t3) >= 14 && console.warn("iOS 14\u53CA\u4EE5\u4E0A\u7248\u672C\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u9700\u8981\u5141\u8BB8\u5BA2\u6237\u7AEF\u67E5\u627E\u5E76\u8FDE\u63A5\u5230\u672C\u5730\u7F51\u7EDC\u4E0A\u7684\u8BBE\u5907\uFF08\u4EC5\u5F00\u53D1\u6A21\u5F0F\u751F\u6548\uFF0C\u53D1\u884C\u6A21\u5F0F\u4F1A\u8FDE\u63A5uniCloud\u4E91\u7AEF\u670D\u52A1\uFF09");
      }
      if (e.__dev__.debugInfo) {
        const { address: t3, servePort: n3 } = e.__dev__.debugInfo;
        return async function(e2, t4) {
          let n4;
          for (let s3 = 0; s3 < e2.length; s3++) {
            const o2 = e2[s3];
            if (await fn(o2, t4)) {
              n4 = o2;
              break;
            }
          }
          return { address: n4, port: t4 };
        }(t3, n3);
      }
    }).then(({ address: t3, port: n3 } = {}) => {
      const s3 = console[m === "app" ? "error" : "warn"];
      if (t3)
        e.__dev__.localAddress = t3, e.__dev__.localPort = n3;
      else if (e.__dev__.debugInfo) {
        let t4 = "";
        e.__dev__.debugInfo.initialLaunchType === "remote" ? (e.__dev__.debugInfo.forceRemote = true, t4 = "\u5F53\u524D\u5BA2\u6237\u7AEF\u548CHBuilderX\u4E0D\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF08\u6216\u5176\u4ED6\u7F51\u7EDC\u539F\u56E0\u65E0\u6CD5\u8FDE\u63A5HBuilderX\uFF09\uFF0CuniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u4E0D\u5BF9\u5F53\u524D\u5BA2\u6237\u7AEF\u751F\u6548\u3002\n- \u5982\u679C\u4E0D\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u76F4\u63A5\u5FFD\u7565\u6B64\u4FE1\u606F\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs") : t4 = "\u65E0\u6CD5\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u5F53\u524D\u5BA2\u6237\u7AEF\u662F\u5426\u4E0E\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs", m === "web" && (t4 += "\n- \u90E8\u5206\u6D4F\u89C8\u5668\u5F00\u542F\u8282\u6D41\u6A21\u5F0F\u4E4B\u540E\u8BBF\u95EE\u672C\u5730\u5730\u5740\u53D7\u9650\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u542F\u7528\u4E86\u8282\u6D41\u6A21\u5F0F"), m.indexOf("mp-") === 0 && (t4 += "\n- \u5C0F\u7A0B\u5E8F\u4E2D\u5982\u4F55\u4F7F\u7528uniCloud\uFF0C\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), s3(t4);
      }
    }).then(() => {
      lt(), e.isReady = true, e.initUniCloudStatus = "fulfilled";
    }).catch((t3) => {
      console.error(t3), e.initUniCloudStatus = "rejected";
    });
  }
  const gn = { tcb: it, tencent: it, aliyun: ee, private: dt };
  let mn = new class {
    init(e) {
      let t2 = {};
      const n2 = gn[e.provider];
      if (!n2)
        throw new Error("\u672A\u63D0\u4F9B\u6B63\u786E\u7684provider\u53C2\u6570");
      t2 = n2.init(e), t2.__dev__ = {}, t2.__dev__.debugLog = m === "web" && navigator.userAgent.indexOf("HBuilderX") > 0 || m === "app";
      const s2 = y;
      s2 && !s2.code && (t2.__dev__.debugInfo = s2), pn(t2), t2.reInit = function() {
        pn(this);
      }, vt(t2), function(e2) {
        const t3 = e2.uploadFile;
        e2.uploadFile = function(e3) {
          return t3.call(this, e3);
        };
      }(t2), Ut(t2), function(e2) {
        e2.getCurrentUserInfo = an, e2.chooseAndUploadFile = un.initChooseAndUploadFile(e2), Object.assign(e2, { get mixinDatacom() {
          return hn(e2);
        } }), e2.importObject = dn(e2);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e2) => {
        if (!t2[e2])
          return;
        const n3 = t2[e2];
        t2[e2] = function() {
          return t2.reInit(), n3.apply(t2, Array.from(arguments));
        }, t2[e2] = W(t2[e2], e2).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e = _;
    let t2 = {};
    if (e && e.length === 1)
      t2 = e[0], mn = mn.init(t2), mn.isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e && e.length > 0 ? "\u5E94\u7528\u6709\u591A\u4E2A\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u901A\u8FC7uniCloud.init\u65B9\u6CD5\u6307\u5B9A\u8981\u4F7F\u7528\u7684\u670D\u52A1\u7A7A\u95F4" : "\u5E94\u7528\u672A\u5173\u8054\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u5728uniCloud\u76EE\u5F55\u53F3\u952E\u5173\u8054\u670D\u52A1\u7A7A\u95F4", t3.forEach((e2) => {
        mn[e2] = function() {
          return console.error(n2), Promise.reject(new H({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    Object.assign(mn, { get mixinDatacom() {
      return hn(mn);
    } }), nn(mn), mn.addInterceptor = P, mn.removeInterceptor = I, mn.interceptObject = C, m === "web" && (window.uniCloud = mn);
  })();
  var yn = mn;
  let mpMixins = {};
  mpMixins = {
    data() {
      return {
        is_show: "none"
      };
    },
    watch: {
      show(newVal) {
        this.is_show = this.show;
      }
    },
    created() {
      this.swipeaction = this.getSwipeAction();
      if (this.swipeaction.children !== void 0) {
        this.swipeaction.children.push(this);
      }
    },
    mounted() {
      this.is_show = this.show;
    },
    methods: {
      closeSwipe(e) {
        if (!this.autoClose)
          return;
        this.swipeaction.closeOther(this);
      },
      change(e) {
        this.$emit("change", e.open);
        if (this.is_show !== e.open) {
          this.is_show = e.open;
        }
      },
      appTouchStart(e) {
        const {
          clientX
        } = e.changedTouches[0];
        this.clientX = clientX;
        this.timestamp = new Date().getTime();
      },
      appTouchEnd(e, index, item, position) {
        const {
          clientX
        } = e.changedTouches[0];
        let diff = Math.abs(this.clientX - clientX);
        let time = new Date().getTime() - this.timestamp;
        if (diff < 40 && time < 300) {
          this.$emit("click", {
            content: item,
            index,
            position
          });
        }
      },
      onClickForPC(index, item, position) {
        return;
      }
    }
  };
  var mpwxs = mpMixins;
  let bindIngXMixins = {};
  let otherMixins = {};
  var block0$1 = (Comp) => {
    (Comp.$wxs || (Comp.$wxs = [])).push("wxsswipe");
    (Comp.$wxsModules || (Comp.$wxsModules = {}))["wxsswipe"] = "13d3b3b0";
  };
  var block1 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("renderswipe");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["renderswipe"] = "5a1e922e";
  };
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$t = {
    mixins: [mpwxs, bindIngXMixins, otherMixins],
    emits: ["click", "change"],
    props: {
      show: {
        type: String,
        default: "none"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      autoClose: {
        type: Boolean,
        default: true
      },
      threshold: {
        type: Number,
        default: 20
      },
      leftOptions: {
        type: Array,
        default() {
          return [];
        }
      },
      rightOptions: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    unmounted() {
      this.__isUnmounted = true;
      this.uninstall();
    },
    methods: {
      uninstall() {
        if (this.swipeaction) {
          this.swipeaction.children.forEach((item, index) => {
            if (item === this) {
              this.swipeaction.children.splice(index, 1);
            }
          });
        }
      },
      getSwipeAction(name2 = "uniSwipeAction") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name2) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createCommentVNode(" \u5728\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F app vue\u7AEF h5 \u4F7F\u7528wxs \u5B9E\u73B0"),
      vue.createElementVNode("view", { class: "uni-swipe" }, [
        vue.createElementVNode("view", {
          class: "uni-swipe_box",
          "change:prop": _ctx.wxsswipe.showWatch,
          prop: _ctx.is_show,
          "data-threshold": $props.threshold,
          "data-disabled": $props.disabled,
          onTouchstart: _cache[2] || (_cache[2] = (...args) => _ctx.wxsswipe.touchstart && _ctx.wxsswipe.touchstart(...args)),
          onTouchmove: _cache[3] || (_cache[3] = (...args) => _ctx.wxsswipe.touchmove && _ctx.wxsswipe.touchmove(...args)),
          onTouchend: _cache[4] || (_cache[4] = (...args) => _ctx.wxsswipe.touchend && _ctx.wxsswipe.touchend(...args))
        }, [
          vue.createCommentVNode(" \u5728\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F app vue\u7AEF h5 \u4F7F\u7528wxs \u5B9E\u73B0"),
          vue.createElementVNode("view", { class: "uni-swipe_button-group button-group--left" }, [
            vue.renderSlot(_ctx.$slots, "left", {}, () => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.leftOptions, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  style: vue.normalizeStyle({
                    backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : "#C7C6CD"
                  }),
                  class: "uni-swipe_button button-hock",
                  onTouchstart: _cache[0] || (_cache[0] = (...args) => _ctx.appTouchStart && _ctx.appTouchStart(...args)),
                  onTouchend: ($event) => _ctx.appTouchEnd($event, index, item, "left"),
                  onClick: vue.withModifiers(($event) => _ctx.onClickForPC(index, item, "left"), ["stop"])
                }, [
                  vue.createElementVNode("text", {
                    class: "uni-swipe_button-text",
                    style: vue.normalizeStyle({ color: item.style && item.style.color ? item.style.color : "#FFFFFF", fontSize: item.style && item.style.fontSize ? item.style.fontSize : "16px" })
                  }, vue.toDisplayString(item.text), 5)
                ], 44, ["onTouchend", "onClick"]);
              }), 128))
            ], true)
          ]),
          vue.createElementVNode("view", { class: "uni-swipe_text--center" }, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ]),
          vue.createElementVNode("view", { class: "uni-swipe_button-group button-group--right" }, [
            vue.renderSlot(_ctx.$slots, "right", {}, () => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.rightOptions, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  style: vue.normalizeStyle({
                    backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : "#C7C6CD"
                  }),
                  class: "uni-swipe_button button-hock",
                  onTouchstart: _cache[1] || (_cache[1] = (...args) => _ctx.appTouchStart && _ctx.appTouchStart(...args)),
                  onTouchend: ($event) => _ctx.appTouchEnd($event, index, item, "right"),
                  onClick: vue.withModifiers(($event) => _ctx.onClickForPC(index, item, "right"), ["stop"])
                }, [
                  vue.createElementVNode("text", {
                    class: "uni-swipe_button-text",
                    style: vue.normalizeStyle({ color: item.style && item.style.color ? item.style.color : "#FFFFFF", fontSize: item.style && item.style.fontSize ? item.style.fontSize : "16px" })
                  }, vue.toDisplayString(item.text), 5)
                ], 44, ["onTouchend", "onClick"]);
              }), 128))
            ], true)
          ])
        ], 40, ["change:prop", "prop", "data-threshold", "data-disabled"])
      ]),
      vue.createCommentVNode(" app nvue\u7AEF \u4F7F\u7528 bindingx "),
      vue.createCommentVNode(" \u5176\u4ED6\u5E73\u53F0\u4F7F\u7528 js \uFF0C\u957F\u5217\u8868\u6027\u80FD\u53EF\u80FD\u4F1A\u6709\u5F71\u54CD")
    ], 2112);
  }
  if (typeof block0$1 === "function")
    block0$1(_sfc_main$t);
  if (typeof block1 === "function")
    block1(_sfc_main$t);
  var __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-41bc30c0"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.vue"]]);
  const _sfc_main$s = {
    name: "uniSwipeAction",
    data() {
      return {};
    },
    created() {
      this.children = [];
    },
    methods: {
      resize() {
      },
      closeAll() {
        this.children.forEach((vm) => {
          vm.is_show = "none";
        });
      },
      closeOther(vm) {
        if (this.openItem && this.openItem !== vm) {
          this.openItem.is_show = "none";
        }
        this.openItem = vm;
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }
  var __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue"]]);
  const _sfc_main$r = {
    name: "bgTheamCompontent",
    props: ["theamType"],
    data() {
      return {};
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bg_content" }, [
      $props.theamType === "currency" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "currency_style"
      }, [
        vue.createElementVNode("image", {
          class: "currency_img_style",
          src: "/static/app-plus/bg/currency.png"
        }),
        vue.createElementVNode("view", { class: "currency_content_style" })
      ])) : vue.createCommentVNode("v-if", true),
      $props.theamType === "goldenCard" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "currency_style"
      }, [
        vue.createElementVNode("image", {
          class: "currency_gold_img_style",
          src: "/static/app-plus/bg/goldenCard.png"
        }),
        vue.createElementVNode("image", {
          class: "currency_img_style",
          src: "/static/app-plus/bg/currency.png"
        }),
        vue.createElementVNode("view", { class: "currency_content_style" })
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  var BgTheamCompontent = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-7f0dda80"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/components/bgTheamCompontent/bgTheamCompontent.vue"]]);
  var businessCloudObject = yn.importObject("businessCloudObject");
  const _sfc_main$q = {
    components: {
      BgTheamCompontent
    },
    data() {
      return {
        meberList: [],
        isActive: "y",
        controlSwiperFlag: false,
        deleteRemarkFlag: false,
        loginNum: 0,
        showPopover: false,
        scrollTop: 0
      };
    },
    onLoad(options) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
    created() {
      this.getMemberList();
    },
    mounted() {
      let self = this;
      uni.getStorage({
        key: "loginNum",
        success: function(res) {
          if (res.data) {
            self.loginNum = res.data;
            self.showPopover = res.data == "0" ? true : false;
          }
        },
        fail: function(err) {
        }
      });
    },
    onPageScroll(e) {
    },
    methods: {
      getTop() {
        var _this = this;
        uni.getSystemInfo({
          success: (resu) => {
            const query = uni.createSelectorQuery();
            query.select("#box").boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec(function(res) {
              _this.Topdistance = res[0].top;
            });
          },
          fail: (res) => {
          }
        });
      },
      getMemberList() {
        businessCloudObject.getMemberList().then((meberListRes) => {
          formatAppLog("log", "at pages/myMebers/myMebers.vue:247", meberListRes, "meberListRes");
          this.meberList = meberListRes.data || [];
        }).catch((err) => {
        });
      },
      clickOverlay() {
        uni.setStorageSync("loginNum", "1");
      },
      bindClick(e) {
        formatAppLog("log", "at pages/myMebers/myMebers.vue:256", e, ">>>");
        this.deleteRemarkFlag = true;
      },
      swipeChange(e, index) {
        if (e === "right") {
          this.controlSwiperFlag = true;
        }
        formatAppLog("log", "at pages/myMebers/myMebers.vue:263", "\u5F53\u524D\u72B6\u6001\uFF1A" + e + "\uFF0C\u4E0B\u6807\uFF1A" + index);
      },
      addClick() {
        uni.navigateTo({
          url: "/pages/addMyMebers/addMyMebers",
          success: (res) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      },
      buyClick(type) {
        this.isActive = type;
      },
      goToTrainingRecord() {
        uni.navigateTo({
          url: `/pages/trainingRecord/trainingRecord?traineeNo=${"63899b9ef5cf3a1773072cd4"}&memberName=${"\u5F20\u96EA\u5CF0"}`
        });
      },
      goToNewWorkout() {
        uni.navigateTo({
          url: "/pages/newWorkout/newWorkout?traineeNo=63899b9ef5cf3a1773072cd4"
        });
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_van_popup = vue.resolveComponent("van-popup");
    const _component_uni_swipe_action_item = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action-item"), __easycom_0$1);
    const _component_uni_swipe_action = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action"), __easycom_1);
    const _component_van_popover = vue.resolveComponent("van-popover");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createCommentVNode("\u5185\u5BB9 start"),
      vue.createElementVNode("view", { class: "header_style" }, [
        vue.createElementVNode("view", { class: "header_left_style" }, [
          vue.createElementVNode("view", { class: "left_content_style" }, [
            vue.createElementVNode("image", {
              class: "left_content_img_style",
              src: "https://img2.baidu.com/it/u=2490939159,251868101&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=750"
            }),
            vue.createElementVNode("view", { class: "left_header_style" }, "\u6211\u7684\u4F1A\u5458"),
            vue.createElementVNode("view", { class: "left_num_style" }, vue.toDisplayString($data.meberList.length), 1)
          ])
        ]),
        vue.createElementVNode("view", { class: "header_right_style" }, [
          vue.createElementVNode("image", {
            class: "right_img_style",
            src: "/static/app-plus/mebrs/fangdajing.svg"
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "is_buy_style" }, [
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["buy_left", $data.isActive === "y" ? "active" : ""]),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.buyClick("y"))
        }, "\u5DF2\u8D2D\u8BFE", 2),
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["buy_right", $data.isActive === "n" ? "active" : ""]),
          onClick: _cache[1] || (_cache[1] = ($event) => $options.buyClick("n"))
        }, "\u672A\u8D2D\u8BFE", 2)
      ]),
      vue.createElementVNode("view", { class: "mebers_content" }, [
        $data.meberList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "no_data_style"
        }, [
          vue.createElementVNode("image", {
            class: "no_data_meber_img_style",
            src: "/static/app-plus/mebrs/nomebers.png"
          })
        ])) : vue.createCommentVNode("v-if", true),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.meberList, (item, itemIndex) => {
          return vue.openBlock(), vue.createBlock(_component_uni_swipe_action, {
            class: "slide_stylle",
            key: "itemIndex" + itemIndex
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_swipe_action_item, {
                disabled: $data.controlSwiperFlag,
                onChange: _cache[6] || (_cache[6] = ($event) => $options.swipeChange($event, 0))
              }, {
                right: vue.withCtx(() => [
                  vue.createElementVNode("view", {
                    class: "slot-button",
                    onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => $options.bindClick($event), ["stop"]))
                  }, [
                    vue.createElementVNode("image", {
                      class: "slot_btn_img_style",
                      src: "/static/app-plus/mebrs/delete.svg"
                    })
                  ]),
                  vue.createVNode(_component_van_popup, {
                    show: $data.deleteRemarkFlag,
                    "onUpdate:show": _cache[3] || (_cache[3] = ($event) => $data.deleteRemarkFlag = $event),
                    teleport: "body"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("view", { class: "confirm_dakuang_style" }, [
                        vue.createElementVNode("view", { class: "confirm_top_style" }, [
                          vue.createElementVNode("text", { class: "config_top_title_style" }, "\u662F\u5426\u786E\u8BA4\u5220\u9664"),
                          vue.createElementVNode("image", {
                            class: "delete_waring_style",
                            src: "/static/app-plus/mebrs/delete.svg"
                          })
                        ]),
                        vue.createElementVNode("view", { class: "delet_remark" }, "\u786E\u8BA4\u5220\u9664\u8BE5\u5B66\u5458\u5417\uFF1F\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D"),
                        vue.createElementVNode("view", { class: "delete_btn_style" }, [
                          vue.createElementVNode("view", { class: "delete_cacel_style" }, "\u53D6\u6D88"),
                          vue.createElementVNode("view", { class: "delete_sure_style" }, "\u786E\u8BA4")
                        ])
                      ])
                    ]),
                    _: 1
                  }, 8, ["show"])
                ]),
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "add_student_style" }, [
                    vue.createElementVNode("view", { class: "need_loop_style" }, [
                      vue.createElementVNode("view", { class: "loop_top_style" }, [
                        vue.createElementVNode("view", { class: "top_left_style" }, [
                          vue.createElementVNode("text", { class: "top_left_name_style" }, vue.toDisplayString(item.traineeName), 1),
                          item.gender == 1 ? (vue.openBlock(), vue.createElementBlock("image", {
                            key: 0,
                            class: "top_left_img_style",
                            src: "/static/app-plus/mebrs/man.svg"
                          })) : vue.createCommentVNode("v-if", true),
                          item.gender == 2 ? (vue.openBlock(), vue.createElementBlock("image", {
                            key: 1,
                            class: "top_left_img_style",
                            src: "/static/app-plus/mebrs/woman.svg"
                          })) : vue.createCommentVNode("v-if", true)
                        ]),
                        vue.createElementVNode("view", {
                          class: "top_right_style",
                          onClick: _cache[4] || (_cache[4] = (...args) => $options.goToNewWorkout && $options.goToNewWorkout(...args))
                        }, [
                          vue.createElementVNode("image", {
                            class: "top_right_img_style",
                            src: "/static/app-plus/mebrs/trainingProgram.svg"
                          }),
                          vue.createElementVNode("text", null, "\u751F\u4EA7\u8BAD\u7EC3\u8BA1\u5212")
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "loop_bottom_style" }, [
                        vue.createElementVNode("view", { class: "bottom_style" }, [
                          vue.createElementVNode("image", {
                            class: "bootom_img_style",
                            src: "/static/app-plus/mebrs/meberMessage.svg"
                          }),
                          vue.createElementVNode("text", { class: "message_style" }, "\u4F1A\u5458\u4FE1\u606F")
                        ]),
                        vue.createElementVNode("view", { class: "bottom_style" }, [
                          vue.createElementVNode("image", {
                            class: "bootom_img_style",
                            src: "/static/app-plus/mebrs/evaluationInformation.svg"
                          }),
                          vue.createElementVNode("text", { class: "message_style" }, "\u8BC4\u6D4B\u4FE1\u606F")
                        ]),
                        vue.createElementVNode("view", {
                          class: "bottom_style",
                          onClick: _cache[5] || (_cache[5] = (...args) => $options.goToTrainingRecord && $options.goToTrainingRecord(...args))
                        }, [
                          vue.createElementVNode("image", {
                            class: "bootom_img_style",
                            src: "/static/app-plus/mebrs/trainingLog.svg"
                          }),
                          vue.createElementVNode("text", { class: "message_style" }, "\u8BAD\u7EC3\u8BB0\u5F55")
                        ])
                      ])
                    ])
                  ])
                ]),
                _: 2
              }, 1032, ["disabled"])
            ]),
            _: 2
          }, 1024);
        }), 128))
      ]),
      vue.createElementVNode("view", {
        class: vue.normalizeClass(["btn_add", $data.loginNum == 0 ? "guid_style" : ""])
      }, [
        vue.createVNode(_component_van_popover, {
          onClickOverlay: $options.clickOverlay,
          overlay: true,
          show: $data.showPopover,
          "onUpdate:show": _cache[8] || (_cache[8] = ($event) => $data.showPopover = $event),
          placement: "left"
        }, {
          reference: vue.withCtx(() => [
            vue.createElementVNode("image", {
              class: "add_img_style",
              src: "/static/app-plus/mebrs/add.svg",
              onClick: _cache[7] || (_cache[7] = vue.withModifiers((...args) => $options.addClick && $options.addClick(...args), ["stop"]))
            })
          ]),
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "pop_tips_style pad_style" }, "Hi\uFF5E\u4F60\u6765\u4E86"),
            vue.createElementVNode("view", { class: "pop_tips_style" }, "\u70B9\u8FD9\u91CC\u6DFB\u52A0\u4F1A\u5458\u5427")
          ]),
          _: 1
        }, 8, ["onClickOverlay", "show"]),
        vue.createCommentVNode(' <image\r\n        class="add_img_style"\r\n        src="../../static/app-plus/mebrs/add.svg"\r\n        @click="addClick"\r\n      ></image> ')
      ], 2)
    ]);
  }
  var PagesMyMebersMyMebers = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/myMebers/myMebers.vue"]]);
  const _sfc_main$p = {
    name: "navBarCompontent",
    props: ["leftNavTitle", "contentTitle"],
    data() {
      return {};
    },
    methods: {
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "nav_bar_style" }, [
      vue.createElementVNode("view", {
        class: "nav_left_style",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
      }, [
        vue.createElementVNode("image", {
          class: "back_img_style",
          src: "/static/app-plus/mebrs/back.png"
        }),
        vue.createElementVNode("view", { class: "nav_title_style" }, vue.toDisplayString($props.leftNavTitle), 1)
      ]),
      vue.createElementVNode("text", { class: "nav_content_style" }, vue.toDisplayString($props.contentTitle), 1),
      vue.createCommentVNode(" \u53EF\u80FD\u4F1A\u6709\u56FE\u7247 "),
      vue.createElementVNode("view", { class: "nav_right_style" })
    ]);
  }
  var NavBarCompontent = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-353bd1a4"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/components/navBarCompontent/navBarCompontent.vue"]]);
  var util = {};
  util.getCommonTime = function(date = new Date(), targetTimezone = 8) {
    let res = {};
    const dif = date.getTimezoneOffset();
    const timeDif = dif * 60 * 1e3 + targetTimezone * 60 * 60 * 1e3;
    const { year, month, day, hour, minute, second } = util.getFullTime(date, 2);
    res.now = {
      year,
      month,
      day,
      hour,
      minute,
      second
    };
    let month_last_day = new Date(year, month, 0).getDate();
    let year_last_day = new Date(year, 12, 0).getDate();
    res.todayStart = new Date(`${year}/${month}/${day}`).getTime() - timeDif;
    res.today12End = new Date(`${year}/${month}/${day}`).getTime() + (12 * 60 * 60 * 1e3 - 1) - timeDif;
    res.todayEnd = new Date(`${year}/${month}/${day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    res.monthStart = new Date(`${year}/${month}/1`).getTime() - timeDif;
    res.monthEnd = new Date(`${year}/${month}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    res.yearStart = new Date(`${year}/1/1`).getTime() - timeDif;
    res.yearEnd = new Date(`${year}/12/${year_last_day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    let weekObj = util.getWeekStartAndEnd(0, date);
    res.weekStart = weekObj.weekStart;
    res.weekEnd = weekObj.weekEnd;
    res.months = [];
    res.months[0] = {
      monthStart: res.monthStart,
      monthEnd: res.monthEnd
    };
    for (let i2 = 1; i2 <= 12; i2++) {
      let month_last_day2 = new Date(year, i2, 0).getDate();
      let monthStart = new Date(`${year}/${i2}/1`).getTime() - timeDif;
      let monthEnd = new Date(`${year}/${i2}/${month_last_day2}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
      res.months[i2] = {
        monthStart,
        monthEnd
      };
    }
    return res;
  };
  util.timeFormat = function(time, fmt = "yyyy-MM-dd hh:mm:ss", targetTimezone = 8) {
    if (!time) {
      return "";
    }
    let date;
    if (typeof time === "number") {
      if (time.toString().length == 10)
        time *= 1e3;
      date = new Date(time);
    } else {
      date = time;
    }
    const dif = date.getTimezoneOffset();
    const timeDif = dif * 60 * 1e3 + targetTimezone * 60 * 60 * 1e3;
    const east8time = date.getTime() + timeDif;
    date = new Date(east8time);
    let opt = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k2 in opt) {
      if (new RegExp("(" + k2 + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? opt[k2] : ("00" + opt[k2]).substr(("" + opt[k2]).length));
      }
    }
    return fmt;
  };
  util.getFullTime = function(date, type = 0, targetTimezone = 8) {
    if (!date) {
      return "";
    }
    if (typeof date == "number") {
      date = new Date(date);
    }
    const dif = date.getTimezoneOffset();
    const timeDif = dif * 60 * 1e3 + targetTimezone * 60 * 60 * 1e3;
    const east8time = date.getTime() + timeDif;
    date = new Date(east8time);
    let YYYY = date.getFullYear() + "";
    let MM = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (type === 2) {
      return {
        YYYY: Number(YYYY),
        MM: Number(MM),
        DD: Number(DD),
        hh: Number(hh),
        mm: Number(mm),
        ss: Number(ss),
        year: Number(YYYY),
        month: Number(MM),
        day: Number(DD),
        hour: Number(hh),
        minute: Number(mm),
        second: Number(ss)
      };
    } else if (type === 1) {
      return YYYY + "" + MM + DD + hh + mm + ss;
    } else {
      return YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
    }
  };
  util.getWeekStartAndEnd = function(addWeekCount = 0, date = new Date(), targetTimezone = 8) {
    let res = {};
    const dif = date.getTimezoneOffset();
    const timeDif = dif * 60 * 1e3 + targetTimezone * 60 * 60 * 1e3;
    const east8time = date.getTime() + timeDif;
    const east8Date = new Date(east8time);
    let week = east8Date.getDay();
    east8Date.getDate();
    let oneDayMillisecond = 1e3 * 60 * 60 * 24;
    date = new Date(date.getTime() + oneDayMillisecond * 7 * addWeekCount);
    let minusDay = week != 0 ? week - 1 : 6;
    let weekStart = new Date(date.getTime() - oneDayMillisecond * minusDay);
    let weekEnd = new Date(weekStart.getTime() + oneDayMillisecond * 6);
    let weekStartObj = util.getFullTime(weekStart, 2);
    let weekEndObj = util.getFullTime(weekEnd, 2);
    res.weekStart = new Date(`${weekStartObj.year}/${weekStartObj.month}/${weekStartObj.day}`).getTime() - timeDif;
    res.weekEnd = new Date(`${weekEndObj.year}/${weekEndObj.month}/${weekEndObj.day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    return res;
  };
  const _sfc_main$o = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        studentForm: {
          traineeName: "",
          gender: "0",
          birthday: "",
          mobile: "",
          buyStatus: 0
        },
        gender: "",
        columns: [{ text: "\u672A\u77E5", value: "0" }, { text: "\u7537", value: "1" }, { text: "\u5973", value: "2" }],
        showPicker: false,
        minDate: new Date(1888, 1, 1),
        maxDate: new Date(2025, 10, 1),
        dateShowpicker: false,
        currentDate: new Date(),
        customFieldName: { text: "text", value: "value" },
        gendDefaultIndex: 0,
        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      };
    },
    mounted() {
    },
    methods: {
      formatter(type, val) {
        if (type === "year") {
          return `${val}\u5E74`;
        } else if (type === "month") {
          return `${val}\u6708`;
        } else if (type === "day") {
          return `${val}\u65E5`;
        } else if (type === "hour") {
          return `${val}\u65F6`;
        } else if (type === "minute") {
          return `${val}\u5206`;
        }
        return val;
      },
      genderChange(value) {
      },
      birthConfirm() {
        this.studentForm.birthday = util.timeFormat(this.currentDate, "yyyy-MM-dd");
        this.dateShowpicker = false;
      },
      genderConfirm(e) {
        this.studentForm.gender = e.value;
        this.gender = e.text;
        let defaultIndex = this.columns.findIndex((item) => {
          item.value = e.value;
        });
        this.defaultIndex = defaultIndex;
        this.showPicker = false;
      },
      addDirectly() {
        var that = this;
        this.$refs.studentForm.validate().then(() => {
          let businessCloudObject2 = yn.importObject("businessCloudObject");
          businessCloudObject2.addMember(that.studentForm).then((res) => {
            if (res.success) {
              formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:198", 1);
              uni.switchTab({
                url: "/pages/myMebers/myMebers",
                success: (res2) => {
                },
                fail: () => {
                },
                complete: () => {
                }
              });
              uni.showToast({
                icon: "success",
                title: res.message,
                duration: 800
              });
            } else {
              formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:211", 2);
              uni.showToast({
                icon: "fail",
                title: res.message,
                duration: 800
              });
            }
          });
        }).catch((err) => {
          Toast.fail(err);
        });
      },
      onConfirm() {
      },
      onSubmit() {
      },
      buyClick(type) {
        this.studentForm.buyStatus = type;
      },
      jumpPhysical() {
        uni.navigateTo({
          url: "/pages/physicalAssessment/physicalAssessment"
        });
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_cell_group = vue.resolveComponent("van-cell-group");
    const _component_van_picker = vue.resolveComponent("van-picker");
    const _component_van_popup = vue.resolveComponent("van-popup");
    const _component_van_datetime_picker = vue.resolveComponent("van-datetime-picker");
    const _component_van_form = vue.resolveComponent("van-form");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u6DFB\u52A0\u5B66\u5458" }),
      vue.createElementVNode("view", { class: "contetnt_form_style" }, [
        vue.createVNode(_component_van_form, {
          onSubmit: $options.onSubmit,
          ref: "studentForm"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.traineeName,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.studentForm.traineeName = $event),
                  name: "traineeName",
                  label: "\u771F\u5B9E\u59D3\u540D(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u586B\u5199\u59D3\u540D",
                  rules: [{ required: true, message: "\u8BF7\u586B\u5199\u771F\u5B9E\u59D3\u540D" }]
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.gender,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.gender = $event),
                  "is-link": "",
                  readonly: "",
                  name: "gender",
                  label: "\u6027\u522B(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u9009\u62E9\u6027\u522B",
                  onClick: _cache[2] || (_cache[2] = ($event) => $data.showPicker = true),
                  rules: [{ required: true, message: "\u8BF7\u9009\u62E9\u6027\u522B" }]
                }, null, 8, ["modelValue"]),
                vue.createVNode(_component_van_popup, {
                  show: $data.showPicker,
                  "onUpdate:show": _cache[4] || (_cache[4] = ($event) => $data.showPicker = $event),
                  position: "bottom"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_picker, {
                      columns: $data.columns,
                      ref: "gendPicker",
                      onConfirm: $options.genderConfirm,
                      onCancel: _cache[3] || (_cache[3] = ($event) => $data.showPicker = false),
                      "show-toolbar": true,
                      title: "\u8BF7\u9009\u62E9\u6027\u522B",
                      defaultIndex: $data.gendDefaultIndex
                    }, null, 8, ["columns", "onConfirm", "defaultIndex"])
                  ]),
                  _: 1
                }, 8, ["show"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.birthday,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.studentForm.birthday = $event),
                  "is-link": "",
                  readonly: "",
                  name: "picker",
                  label: "\u751F\u65E5(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u9009\u62E9\u751F\u65E5",
                  onClick: _cache[6] || (_cache[6] = ($event) => $data.dateShowpicker = true),
                  rules: [{ required: true, message: "\u8BF7\u9009\u62E9\u751F\u65E5" }]
                }, null, 8, ["modelValue"]),
                vue.createVNode(_component_van_popup, {
                  show: $data.dateShowpicker,
                  "onUpdate:show": _cache[9] || (_cache[9] = ($event) => $data.dateShowpicker = $event),
                  position: "bottom"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_datetime_picker, {
                      modelValue: $data.currentDate,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.currentDate = $event),
                      type: "date",
                      title: "\u9009\u62E9\u5E74\u6708\u65E5",
                      "min-date": $data.minDate,
                      "max-date": $data.maxDate,
                      onConfirm: $options.birthConfirm,
                      onCancel: _cache[8] || (_cache[8] = ($event) => $data.dateShowpicker = false),
                      formatter: $options.formatter
                    }, null, 8, ["modelValue", "min-date", "max-date", "onConfirm", "formatter"])
                  ]),
                  _: 1
                }, 8, ["show"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.mobile,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.studentForm.mobile = $event),
                  name: "pattern",
                  label: "\u624B\u673A\u53F7\u7801(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801",
                  type: "tel",
                  max: 11,
                  rules: [{ pattern: $data.pattern, message: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7\u7801" }]
                }, null, 8, ["modelValue", "rules"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "is_buy_content_style van-cell" }, [
                  vue.createElementVNode("text", { class: "buy_text_style" }, "\u662F\u5426\u5DF2\u8D2D\u8BFE"),
                  vue.createElementVNode("view", { class: "is_buy_style" }, [
                    vue.createElementVNode("view", {
                      class: vue.normalizeClass(["buy_left", $data.studentForm.buyStatus == 0 ? "active" : ""]),
                      onClick: _cache[11] || (_cache[11] = ($event) => $options.buyClick(0))
                    }, "\u65E0", 2),
                    vue.createElementVNode("view", {
                      class: vue.normalizeClass(["buy_right", $data.studentForm.buyStatus == 1 ? "active" : ""]),
                      onClick: _cache[12] || (_cache[12] = ($event) => $options.buyClick(1))
                    }, "\u6709", 2)
                  ])
                ])
              ]),
              _: 1
            }),
            vue.createCommentVNode(' 			   <div style="margin: 16px;">\r\n			     <van-button round block type="primary" native-type="submit">\r\n			       \u63D0\u4EA4\r\n			     </van-button>\r\n			   </div> '),
            vue.createElementVNode("view", { class: "add_method_style" }, [
              vue.createElementVNode("view", {
                class: "add_left_style",
                "native-type": "submit",
                onClick: _cache[13] || (_cache[13] = (...args) => $options.addDirectly && $options.addDirectly(...args))
              }, "\u76F4\u63A5\u6DFB\u52A0"),
              vue.createElementVNode("view", {
                class: "add_right_style",
                onClick: _cache[14] || (_cache[14] = (...args) => $options.jumpPhysical && $options.jumpPhysical(...args))
              }, "\u8EAB\u4F53\u8BC4\u6D4B\u5E76\u6DFB\u52A0")
            ])
          ]),
          _: 1
        }, 8, ["onSubmit"])
      ])
    ]);
  }
  var PagesAddMyMebersAddMyMebers = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-60dc024c"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/addMyMebers/addMyMebers.vue"]]);
  const _sfc_main$n = {
    props: {
      value: Array,
      column: {
        type: [String, Number],
        default: 2
      },
      maxColumn: {
        type: [String, Number],
        default: 5
      },
      columnSpace: {
        type: [String, Number],
        default: 2
      },
      imageKey: {
        type: [String],
        default: "image"
      },
      hideImageKey: {
        type: [String],
        default: "hide"
      },
      seat: {
        type: [String, Number],
        default: 2
      },
      listStyle: {
        type: Object
      }
    },
    data() {
      return {
        data: {
          list: this.value ? this.value : [],
          column: this.column < 2 ? 2 : this.column,
          columnSpace: this.columnSpace <= 5 ? this.columnSpace : 5,
          imageKey: this.imageKey,
          seat: this.seat
        },
        msg: 0,
        listInitStyle: {
          "border-radius": "12rpx",
          "margin-bottom": "20rpx",
          "background-color": "#fff"
        },
        adds: [],
        isLoaded: true,
        curIndex: 0,
        isRefresh: true,
        flag: false,
        refreshDatas: []
      };
    },
    computed: {
      w() {
        const column_rate = `${100 / this.data.column - +this.data.columnSpace}%`;
        return column_rate;
      },
      m() {
        const column_margin = `${(100 - (100 / this.data.column - +this.data.columnSpace).toFixed(5) * this.data.column) / (this.data.column - 1)}%`;
        return column_margin;
      },
      s1() {
        return __spreadValues(__spreadValues({}, this.listInitStyle), this.listStyle);
      }
    },
    created() {
      this.refresh();
    },
    methods: {
      loadImages(idx = 0) {
        let count = 0;
        const newList = this.data.list.filter((item, index) => index >= idx);
        for (let i2 = 0; i2 < newList.length; i2++) {
          plus.io.getImageInfo({
            src: `${newList[i2][this.imageKey]}.jpg`,
            complete: (res) => {
              count++;
              if (count == newList.length)
                this.initValue(idx);
            }
          });
        }
      },
      refresh() {
        if (!this.isLoaded) {
          this.refreshDatas = this.value;
          return false;
        }
        setTimeout(() => {
          this.refreshDatas = [];
          this.isRefresh = true;
          this.adds = [];
          this.data.list = this.value ? this.value : [];
          this.data.column = this.column < 2 ? 2 : this.column >= this.maxColumn ? this.maxColumn : this.column;
          this.data.columnSpace = this.columnSpace <= 5 ? this.columnSpace : 5;
          this.data.imageKey = this.imageKey;
          this.data.seat = this.seat;
          this.curIndex = 0;
          for (let i2 = 1; i2 <= this.data.column; i2++) {
            this.data[`column_${i2}_values`] = [];
            this.msg++;
          }
          this.$nextTick(() => {
            this.initValue(this.curIndex, "refresh==>");
          });
        }, 1);
      },
      columnValue(index) {
        return this.data[`column_${index + 1}_values`];
      },
      change(newValue) {
        for (let i2 = 0; i2 < this.data.list.length; i2++) {
          const cv = this.data[`column_${this.data.list[i2].column}_values`];
          for (let j2 = 0; j2 < cv.length; j2++) {
            if (newValue[i2] && i2 === cv[j2].index) {
              this.data[`column_${this.data.list[i2].column}_values`][j2] = Object.assign(cv[j2], newValue[i2]);
              this.msg++;
              break;
            }
          }
        }
      },
      getMin(a2, s2) {
        let m2 = a2[0][s2];
        let mo = a2[0];
        for (var i2 = a2.length - 1; i2 >= 0; i2--) {
          if (a2[i2][s2] < m2) {
            m2 = a2[i2][s2];
          }
        }
        mo = a2.filter((i3) => i3[s2] == m2);
        return mo[0];
      },
      getMinColumnHeight() {
        return new Promise((resolve) => {
          const heightArr = [];
          for (let i2 = 1; i2 <= this.data.column; i2++) {
            const query = uni.createSelectorQuery().in(this);
            query.select(`#waterfalls_flow_column_${i2}`).boundingClientRect((data) => {
              heightArr.push({ column: i2, height: data.height });
            }).exec(() => {
              if (this.data.column <= heightArr.length) {
                resolve(this.getMin(heightArr, "height"));
              }
            });
          }
        });
      },
      async initValue(i2, from) {
        this.isLoaded = false;
        if (i2 >= this.data.list.length || this.refreshDatas.length) {
          this.msg++;
          this.loaded();
          return false;
        }
        const minHeightRes = await this.getMinColumnHeight();
        const c2 = this.data[`column_${minHeightRes.column}_values`];
        this.data.list[i2].column = minHeightRes.column;
        c2.push(__spreadProps(__spreadValues({}, this.data.list[i2]), { cIndex: c2.length, index: i2, o: 0 }));
        this.msg++;
      },
      imgLoad(item, c2) {
        const i2 = item.index;
        item.o = 1;
        this.$set(this.data[`column_${c2}_values`], item.cIndex, JSON.parse(JSON.stringify(item)));
        this.initValue(i2 + 1);
      },
      imgError(item, c2) {
        const i2 = item.index;
        item.o = 1;
        item[this.data.imageKey] = null;
        this.$set(this.data[`column_${c2}_values`], item.cIndex, JSON.parse(JSON.stringify(item)));
        this.initValue(i2 + 1);
      },
      loaded() {
        if (this.refreshDatas.length) {
          this.isLoaded = true;
          this.refresh();
          return false;
        }
        this.curIndex = this.data.list.length;
        if (this.adds.length) {
          this.data.list = this.adds[0];
          this.adds.splice(0, 1);
          this.initValue(this.curIndex);
        } else {
          if (this.data.list.length)
            this.$emit("loaded");
          this.isLoaded = true;
          this.isRefresh = false;
        }
      },
      wapperClick(item) {
        this.$emit("wapperClick", item);
      },
      imageClick(item) {
        this.$emit("imageClick", item);
      }
    },
    watch: {
      value: {
        deep: true,
        handler(newValue, oldValue) {
          setTimeout(() => {
            this.$nextTick(() => {
              if (this.isRefresh)
                return false;
              if (this.isLoaded) {
                if (newValue.length <= this.curIndex)
                  return this.change(newValue);
                this.data.list = newValue;
                this.$nextTick(() => {
                  this.initValue(this.curIndex, "watch==>");
                });
              } else {
                this.adds.push(newValue);
              }
            });
          }, 10);
        }
      },
      column(newValue) {
        this.refresh();
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "waterfalls-flow" }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.data.column, (item, index) => {
        return vue.openBlock(), vue.createElementBlock("view", {
          key: index,
          class: "waterfalls-flow-column",
          id: `waterfalls_flow_column_${index + 1}`,
          msg: $data.msg,
          style: vue.normalizeStyle({ "width": $options.w, "margin-left": index == 0 ? 0 : $options.m })
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.columnValue(index), (item2, index2) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: vue.normalizeClass(["column-value", { "column-value-show": item2.o }]),
              key: index2,
              style: vue.normalizeStyle([$options.s1]),
              onClick: vue.withModifiers(($event) => $options.wapperClick(item2), ["stop"])
            }, [
              $data.data.seat == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "inner"
              }, [
                vue.renderSlot(_ctx.$slots, "default", vue.normalizeProps(vue.guardReactiveProps(item2)), void 0, true)
              ])) : vue.createCommentVNode("v-if", true),
              vue.withDirectives(vue.createElementVNode("image", {
                class: vue.normalizeClass(["img", { "img-hide": item2[$props.hideImageKey] == true || item2[$props.hideImageKey] == 1 }, { "img-error": !item2[$data.data.imageKey] }]),
                src: item2[$data.data.imageKey],
                mode: "widthFix",
                onLoad: ($event) => $options.imgLoad(item2, index + 1),
                onError: ($event) => $options.imgError(item2, index + 1),
                onClick: vue.withModifiers(($event) => $options.imageClick(item2), ["stop"])
              }, null, 42, ["src", "onLoad", "onError", "onClick"]), [
                [vue.vShow, false]
              ]),
              $data.data.seat == 2 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "inner"
              }, [
                vue.renderSlot(_ctx.$slots, "default", vue.normalizeProps(vue.guardReactiveProps(item2)), void 0, true)
              ])) : vue.createCommentVNode("v-if", true)
            ], 14, ["onClick"]);
          }), 128))
        ], 12, ["id", "msg"]);
      }), 128))
    ]);
  }
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-ddfcbb1c"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue"]]);
  const _sfc_main$m = {
    components: {
      BgTheamCompontent,
      NavBarCompontent,
      CustomWaterfallsFlow: __easycom_0
    },
    data() {
      return {
        fitnessprogram: [
          {
            bodyparts: "\u9888\u90E8\u524D\u5F15",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u80A9\u80DB\u63D0\u808C\uFF0C\u9888\u4F38\u808C\uFF0C\u524D\u659C\u89D2\u808C\uFF0C\u5934\u540E\u5927\u76F4\u808C\uFF0C\u5934\u534A\u68D8\u808C\uFF0C\u80F8\u9501\u4E73\u7A81\u5F62\u808C\u3002 \u65E0\u529B\u808C\u8089\uFF1A\u6DF1\u5C42\u9888\u5C48\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u4E2D\u4E0B\u659C\u65B9\u808C\uFF0C\u5C0F\u5706\u808C\uFF0C\u5C97\u4E0B\u808C\u3002"
          },
          {
            bodyparts: "\u9AD8\u4F4E\u80A9",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u4E0A\u659C\u65B9\u808C\uFF0C\u80A9\u80DB\u63D0\u808C\uFF0C\u83F1\u5F62\u808C\u3002 \u65E0\u529B\u808C\u8089\uFF1A\u4E2D\u4E0B\u659C\u65B9\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u5C97\u4E0B\u808C\u3002"
          },
          {
            bodyparts: "\u5706\u80A9",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u80F8\u5927\u808C\uFF0C\u80F8\u5C0F\u808C\uFF0C\u4E0A\u659C\u65B9\u808C\uFF0C\u80A9\u80DB\u4E0B\u808C\uFF0C\u4E09\u89D2\u808C\u524D\u675F\uFF0C\u5927\u5706\u808C\uFF0C\u80A9\u80DB\u63D0\u808C\u3002\u65E0\u529B\u808C\u8089\uFF1A\u4E2D\u4E0B\u659C\u65B9\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u4E09\u89D2\u808C\u540E\u675F\uFF0C\u5C0F\u5706\u808C\uFF0C\u5C97\u4E0B\u808C\u3002"
          },
          {
            bodyparts: "\u7FFC\u72B6\u80A9\u80DB",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u83F1\u5F62\u808C\uFF0C\u80A9\u80DB\u63D0\u808C\uFF0C\u4E0A\u659C\u65B9\u808C\uFF0C\u80F8\u5C0F\u808C\u3002\u65E0\u529B\u808C\u8089\uFF1A\u524D\u952F\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u4E2D\u4E0B\u659C\u65B9\u808C\u3002"
          },
          {
            bodyparts: "\u9AA8\u76C6\u524D\u503E",
            describe: "\u9AC2\u8170\u808C\uFF0C\u80A1\u76F4\u808C\uFF0C\u8179\u76F4\u808C\uFF0C\u7F1D\u5320\u808C\uFF0C\u9614\u7B4B\u819C\u5F20\u808C\uFF0C\u957F\u6536\u808C\uFF0C\u77ED\u6536\u808C\uFF0C\u7AD6\u810A\u808C\u3002\u65E0\u529B\u808C\u8089\uFF1A\u8179\u76F4\u808C\uFF0C\u81C0\u5927\u808C\uFF0C\u80A1\u4E8C\u5934\u808C\uFF0C\u534A\u8171\u808C\uFF0C\u534A\u819C\u808C\uFF0C\u5927\u6536\u808C\u3002"
          },
          {
            bodyparts: "\u9A7C\u80CC",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u80F8\u5927\u808C\uFF0C\u80F8\u5C0F\u808C\uFF0C\u4E09\u89D2\u808C\u524D\u675F\uFF0C\u9888\u4F38\u808C\u7FA4\uFF0C\u4E0A\u659C\u65B9\u808C\uFF0C\u80A9\u80DB\u63D0\u808C\uFF0C\u9ACB\u5173\u8282\u533A\u808C\u3002\u65E0\u529B\u808C\u8089\uFF1A\u4E2D\u4E0B\u659C\u65B9\u808C\uFF0C\u5927\u5706\u808C\uFF0C\u5C0F\u5706\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u9888\u5C48\u808C\u7FA4\uFF0C\u9ACB\u5173\u8282\u4F38\u808C\u3002"
          },
          {
            bodyparts: "\u819D\u5173\u8282\u5185\u6263",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u5927\u6536\u808C\uFF0C\u77ED\u5185\u6536\u808C\uFF0C\u957F\u5185\u6536\u808C\uFF0C\u80A1\u8584\u808C\uFF0C\u8DBE\u9AA8\u808C\u8089\uFF1A\u81C0\u5927\u808C\uFF0C\u68A8\u72B6\u808C\uFF0C\u81C0\u4E2D\u808C\uFF0C\u80A1\u56DB\u5934\u5185\u4FA7\u5934\u3002"
          },
          {
            bodyparts: "\u9AA8\u76C6\u540E\u503E",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u8179\u76F4\u808C\uFF0C\u81C0\u5927\u808C\uFF0C\u80A1\u4E8C\u5934\u808C\uFF0C\u534A\u8171\u808C\uFF0C\u534A\u819C\u808C\uFF0C\u5927\u6536\u808C\u3002\u65E0\u529B\u808C\u8089\uFF1A\u9AC2\u8170\u808C\uFF0C\u80A1\u76F4\u808C\uFF0C\u7F1D\u5320\u808C\uFF0C\u9614\u7B4B\u819C\u5F20\u808C\uFF0C\u957F\u6536\u808C\uFF0C\u77ED\u6536\u808C\uFF0C\u7AD6\u810A\u808C\u3002"
          },
          {
            bodyparts: "\u8DB3\u90E8\u5185\u7FFB",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u80EB\u9AA8\u524D\u808C\uFF0C\u80EB\u9AA8\u540E\u808C\uFF0C\u5C48\u8DBE\u957F\u808C\uFF0C\u5C48\u62C7\u957F\u808C\uFF0C\u4F38\u62C7\u957F\u808C\u65E0\u529B\u808C\u8089\uFF1A\u8153\u9AA8\u957F\u808C\uFF0C\u8153\u9AA8\u77ED\u808C\uFF0C\u4F38\u62C7\u957F\u808C\u3002"
          },
          {
            bodyparts: "\u8DB3\u90E8\u5916\u7FFB",
            describe: "\u7D27\u5F20\u808C\u8089\uFF1A\u80EB\u9AA8\u524D\u808C\uFF0C\u80EB\u9AA8\u540E\u808C\uFF0C\u5C48\u8DBE\u957F\u808C\uFF0C\u5C48\u62C7\u957F\u808C\uFF0C\u4F38\u62C7\u957F\u808C\u65E0\u529B\u808C\u8089\uFF1A\u8153\u9AA8\u957F\u808C\uFF0C\u8153\u9AA8\u77ED\u808C\uFF0C\u4F38\u62C7\u957F\u808C\u3002"
          }
        ],
        data: {
          list: [
            { image: "https://via.placeholder.com/200x200.png/2878ff", title: "\u6211\u662F\u6807\u98981", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF01" },
            { image: "https://via.placeholder.com/200x200.png/2878ff", title: "\u6211\u662F\u6807\u98982", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF02" },
            { image: "https://via.placeholder.com/200x100.png/FFB6C1", title: "\u6211\u662F\u6807\u98983", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF03" },
            { image: "https://via.placeholder.com/200x300.png/9400D3", title: "\u6211\u662F\u6807\u98984", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF04" },
            { image: "https://via.placeholder.com/100x240.png/B0E0E6", title: "\u6211\u662F\u6807\u98985", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF05" },
            { image: "https://via.placeholder.com/140x280.png/7FFFAA", title: "\u6211\u662F\u6807\u98986", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF06" },
            { image: "https://via.placeholder.com/40x60.png/EEE8AA", title: "\u6211\u662F\u6807\u98987", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF07" }
          ]
        },
        column: 2
      };
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      add() {
        const newArr = [
          { image: "https://via.placeholder.com/58x100.png/FF7F50", title: "\u6211\u662F\u6807\u98988", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF08" },
          { image: "https://via.placeholder.com/59x100.png/C0C0C0", title: "\u6211\u662F\u6807\u98989", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF09" },
          { image: "https://via.placeholder.com/60x100.png/FAEBD7", title: "\u6211\u662F\u6807\u989810", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF010" }
        ];
        this.data.list = this.data.list.concat(newArr);
      },
      changeColumn(h2) {
        this.column = !h2 ? this.column - 1 : this.column + 1;
      },
      loaded() {
        formatAppLog("log", "at pages/bodyAssessment/bodyAssessment.vue:118", "\u52A0\u8F7D\u5B8C\u6210");
      },
      wapperClick(item) {
        formatAppLog("log", "at pages/bodyAssessment/bodyAssessment.vue:121", "\u5355\u9879\u70B9\u51FB\u4E8B\u4EF6", item);
      },
      imageClick(item) {
        formatAppLog("log", "at pages/bodyAssessment/bodyAssessment.vue:124", "\u56FE\u7247\u70B9\u51FB\u4E8B\u4EF6", item);
      },
      reset() {
        this.data.list = [{ image: "https://via.placeholder.com/200x500.png/ff0000", title: "\u6211\u662F\u6807\u98981", desc: "\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF0\u63CF\u8FF01" }];
        this.$refs.waterfallsFlowRef.refresh();
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_custom_waterfalls_flow = resolveEasycom(vue.resolveDynamicComponent("custom-waterfalls-flow"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u4F53\u6001\u8BC4\u4F30" }),
      vue.createElementVNode("view", { class: "waterfall_flow_style" }, [
        vue.createElementVNode("view", { style: { "padding": "0 10upx" } }, [
          vue.createVNode(_component_custom_waterfalls_flow, {
            ref: "waterfallsFlowRef",
            value: $data.data.list,
            column: $data.column,
            columnSpace: 2,
            seat: 1,
            onWapperClick: $options.wapperClick,
            onLoaded: $options.loaded
          }, {
            default: vue.withCtx((item) => [
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("view", { class: "title" }, vue.toDisplayString(item.title), 1),
                vue.createElementVNode("view", { class: "desc" }, vue.toDisplayString(item.desc), 1)
              ])
            ]),
            _: 1
          }, 8, ["value", "column", "onWapperClick", "onLoaded"])
        ])
      ])
    ]);
  }
  var PagesBodyAssessmentBodyAssessment = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/bodyAssessment/bodyAssessment.vue"]]);
  const _sfc_main$l = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        studentForm: {
          userName: "",
          sex: ""
        },
        columns: ["\u7537", "\u5973"],
        showPicker: false,
        minDate: new Date(2020, 0, 1),
        maxDate: new Date(2025, 10, 1),
        currentDate: new Date(2021, 0, 18),
        dateShowpicker: false
      };
    },
    methods: {
      onConfirm() {
      },
      onSubmit() {
      },
      jumpPhysical() {
        uni.navigateTo({
          url: "/pages/physicalAssessment/physicalAssessment"
        });
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_cell_group = vue.resolveComponent("van-cell-group");
    const _component_van_picker = vue.resolveComponent("van-picker");
    const _component_van_popup = vue.resolveComponent("van-popup");
    const _component_van_datetime_picker = vue.resolveComponent("van-datetime-picker");
    const _component_van_form = vue.resolveComponent("van-form");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u4F53\u6D4B\u62A5\u544A\u586B\u5199" }),
      vue.createElementVNode("view", { class: "contetnt_form_style" }, [
        vue.createVNode(_component_van_form, { onSubmit: $options.onSubmit }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.userName,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.studentForm.userName = $event),
                  name: "userName",
                  label: "\u771F\u5B9E\u59D3\u540D(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u586B\u5199\u59D3\u540D",
                  rules: [{ required: true, message: "\u8BF7\u586B\u5199\u771F\u5B9E\u59D3\u540D" }]
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.sex,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.studentForm.sex = $event),
                  "is-link": "",
                  readonly: "",
                  name: "picker",
                  label: "\u6027\u522B(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u9009\u62E9\u6027\u522B",
                  onClick: _cache[2] || (_cache[2] = ($event) => $data.showPicker = true)
                }, null, 8, ["modelValue"]),
                vue.createVNode(_component_van_popup, {
                  show: $data.showPicker,
                  "onUpdate:show": _cache[4] || (_cache[4] = ($event) => $data.showPicker = $event),
                  position: "bottom"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_picker, {
                      columns: $data.columns,
                      onConfirm: $options.onConfirm,
                      onCancel: _cache[3] || (_cache[3] = ($event) => $data.showPicker = false)
                    }, null, 8, ["columns", "onConfirm"])
                  ]),
                  _: 1
                }, 8, ["show"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.sex,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.studentForm.sex = $event),
                  "is-link": "",
                  readonly: "",
                  name: "picker",
                  label: "\u751F\u65E5(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u9009\u62E9\u751F\u65E5",
                  onClick: _cache[6] || (_cache[6] = ($event) => $data.dateShowpicker = true)
                }, null, 8, ["modelValue"]),
                vue.createVNode(_component_van_popup, {
                  show: $data.dateShowpicker,
                  "onUpdate:show": _cache[9] || (_cache[9] = ($event) => $data.dateShowpicker = $event),
                  position: "bottom"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_datetime_picker, {
                      modelValue: $data.currentDate,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.currentDate = $event),
                      type: "date",
                      title: "\u9009\u62E9\u5E74\u6708\u65E5",
                      "min-date": $data.minDate,
                      "max-date": $data.maxDate,
                      onConfirm: $options.onConfirm,
                      onCancel: _cache[8] || (_cache[8] = ($event) => $data.dateShowpicker = false)
                    }, null, 8, ["modelValue", "min-date", "max-date", "onConfirm"])
                  ]),
                  _: 1
                }, 8, ["show"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_cell_group, { inset: "" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_field, {
                  modelValue: $data.studentForm.userName,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.studentForm.userName = $event),
                  name: "userName",
                  label: "\u624B\u673A\u53F7\u7801(\u5FC5\u586B)",
                  placeholder: "\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801",
                  rules: [{ required: true, message: "\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801" }]
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            vue.createElementVNode("view", { class: "add_method_style" }, [
              vue.createElementVNode("view", {
                class: "add_right_style",
                onClick: _cache[11] || (_cache[11] = (...args) => $options.jumpPhysical && $options.jumpPhysical(...args))
              }, "\u786E\u8BA4")
            ])
          ]),
          _: 1
        }, 8, ["onSubmit"])
      ])
    ]);
  }
  var PagesBodyTestReportBodyTestReport = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-aabe2874"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/bodyTestReport/bodyTestReport.vue"]]);
  const _sfc_main$k = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        dynamicEvaluationdata: [
          { title: "\u81EA\u91CD\u6DF1\u8E72\u8BC4\u4F30", type: "zzsdpg" },
          { title: "\u80F8\u690E\u6D3B\u52A8\u8BC4\u4F30", type: "xzhdpg" },
          { title: "\u67D4\u97E7\u6027\u6D4B\u8BD5", type: "rrxcs" },
          { title: "\u5173\u8282\u7075\u6D3B\u6D4B\u8BD5", type: "gjlhcs" },
          { title: "\u4FEF\u5367\u6491\u7A33\u5B9A\u6027\u6D4B\u8BD5", type: "fwcwdxcs" }
        ],
        icon: true
      };
    },
    methods: {
      setup() {
        const onClickLeft = () => history.back();
        return {
          onClickLeft
        };
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_col = vue.resolveComponent("van-col");
    const _component_van_row = vue.resolveComponent("van-row");
    const _component_van_button = vue.resolveComponent("van-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u52A8\u6001\u8BC4\u4F30" }),
      vue.createVNode(_component_van_row, { style: { "background-color": "#343a44" } }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_van_col, {
            class: "need_scoll",
            span: "24"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.dynamicEvaluationdata, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "dynamicshow",
                  key: index
                }, [
                  vue.createElementVNode("view", { class: "dynamicshow_left" }, [
                    vue.createElementVNode("view", { class: "correct" }, [
                      vue.createElementVNode("image", {
                        class: "correct_img_style",
                        src: "/static/app-plus/other/yesActive.png"
                      })
                    ]),
                    !$data.icon ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "correct"
                    }, [
                      vue.createElementVNode("image", {
                        class: "correct_img_style",
                        src: "/static/app-plus/other/yesNoActive.png"
                      })
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("text", { class: "evaluationdata" }, vue.toDisplayString(item.title), 1)
                  ]),
                  vue.createElementVNode("view", { class: "dynamicshow_right" }, [
                    vue.createElementVNode("image", {
                      class: "back_img_style",
                      src: "/static/app-plus/mebrs/backRight.png"
                    })
                  ])
                ]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      vue.createVNode(_component_van_button, {
        type: "primary",
        block: "",
        class: "buttontrue"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("\u751F\u6210\u62A5\u544A")
        ]),
        _: 1
      })
    ]);
  }
  var PagesDynamicEvaluationDynamicEvaluation = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-1315a784"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/dynamicEvaluation/dynamicEvaluation.vue"]]);
  const _sfc_main$j = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        dynamicEvaluationdata: [
          {
            title: "\u5065\u5EB7\u95EE\u7B54",
            type: "zzsdpg",
            path: "/pages/healthQuesson/healthQuesson"
          },
          {
            title: "\u586B\u5199\u4F53\u6D4B\u62A5\u544A",
            type: "xzhdpg",
            path: "/pages/bodyTestReport/bodyTestReport"
          },
          {
            title: "\u4F53\u6001\u8BC4\u4F30",
            type: "rrxcs",
            path: "/pages/bodyAssessment/bodyAssessment"
          },
          {
            title: "\u52A8\u6001\u8BC4\u4F30",
            type: "gjlhcs",
            path: "/pages/dynamicEvaluation/dynamicEvaluation"
          },
          { title: "\u4F53\u80FD\u8BC4\u4F30", type: "fwcwdxcs" }
        ],
        icon: true
      };
    },
    methods: {
      setup() {
        const onClickLeft = () => history.back();
        return {
          onClickLeft
        };
      },
      jumpModular(item) {
        uni.navigateTo({
          url: item.path,
          success: (res) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_col = vue.resolveComponent("van-col");
    const _component_van_row = vue.resolveComponent("van-row");
    const _component_van_button = vue.resolveComponent("van-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u8EAB\u4F53\u8BC4\u6D4B" }),
      vue.createVNode(_component_van_row, null, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_van_col, {
            class: "need_scoll",
            span: "24"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.dynamicEvaluationdata, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "dynamicshow",
                  onClick: ($event) => $options.jumpModular(item),
                  key: index
                }, [
                  vue.createElementVNode("view", { class: "dynamicshow_left" }, [
                    vue.createElementVNode("view", { class: "correct" }, [
                      vue.createElementVNode("image", {
                        class: "correct_img_style",
                        src: "/static/app-plus/other/yesActive.png"
                      })
                    ]),
                    !$data.icon ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "correct"
                    }, [
                      vue.createElementVNode("image", {
                        class: "correct_img_style",
                        src: "/static/app-plus/other/yesNoActive.png"
                      })
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("text", { class: "evaluationdata" }, vue.toDisplayString(item.title), 1)
                  ]),
                  vue.createElementVNode("view", { class: "dynamicshow_right" }, [
                    vue.createElementVNode("image", {
                      class: "back_img_style",
                      src: "/static/app-plus/mebrs/backRight.png"
                    })
                  ])
                ], 8, ["onClick"]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      vue.createVNode(_component_van_button, {
        type: "primary",
        block: "",
        class: "buttontrue"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("\u751F\u6210\u62A5\u544A")
        ]),
        _: 1
      })
    ]);
  }
  var PagesPhysicalAssessmentPhysicalAssessment = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-2a1dc5a6"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/physicalAssessment/physicalAssessment.vue"]]);
  const _sfc_main$i = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        healthList: [
          {
            title: "\u5982\u679C\u60A8\u6709\u4EE5\u4E0B\u75BE\u75C5\u8BF7\u70B9\u51FB\u9009\u62E9",
            problemType: "checkbox",
            child: [
              {
                title: "\u9AD8\u8840\u538B",
                activeFlag: true
              },
              {
                title: "\u9AD8\u8840\u538B",
                activeFlag: true
              },
              {
                title: "\u9AD8\u8840\u538B",
                activeFlag: true
              }
            ]
          },
          {
            title: "\u60A8\u662F\u5426\u6709\u5176\u4ED6\u88AB\u786E\u8BCA\u7684\u75BE\u75C5",
            problemType: "radio",
            supplementaryInformation: "y"
          }
        ],
        activeName: [0]
      };
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_collapse_item = vue.resolveComponent("van-collapse-item");
    const _component_van_collapse = vue.resolveComponent("van-collapse");
    const _component_van_field = vue.resolveComponent("van-field");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u5065\u5EB7\u95EE\u7B54" }),
      vue.createElementVNode("view", { class: "list_content_style" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.healthList, (item, itemIndex) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "need_loop_style",
            key: "key" + itemIndex
          }, [
            item.problemType === "checkbox" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "check_box_style"
            }, [
              vue.createVNode(_component_van_collapse, {
                class: "need_collapse_style",
                modelValue: $data.activeName,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.activeName = $event)
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_van_collapse_item, {
                    title: item.title,
                    name: itemIndex
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("view", { class: "collapes_conten_style" }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.child, (itemChild, itemChildIndex) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "collapes_tag_stylle",
                            key: "key" + itemChildIndex
                          }, vue.toDisplayString(itemChild.title), 1);
                        }), 128))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["title", "name"])
                ]),
                _: 2
              }, 1032, ["modelValue"])
            ])) : vue.createCommentVNode("v-if", true),
            item.problemType === "radio" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "radio_style"
            }, [
              vue.createElementVNode("view", { class: "radio_title_style" }, vue.toDisplayString(item.title), 1),
              vue.createElementVNode("view", { class: "radio_tag_style" }, [
                vue.createElementVNode("view", { class: "tag_style" }, "\u662F"),
                vue.createElementVNode("view", { class: "tag_style" }, "\u5426")
              ]),
              vue.createElementVNode("view", { class: "radio_remark_style" }, [
                vue.createVNode(_component_van_field, {
                  class: "supplement_style",
                  modelValue: _ctx.username,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.username = $event),
                  placeholder: "\u8BF7\u8865\u5145\u5177\u4F53\u4FE1\u606F"
                }, null, 8, ["modelValue"])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]);
        }), 128))
      ])
    ]);
  }
  var PagesHealthQuessonHealthQuesson = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/healthQuesson/healthQuesson.vue"]]);
  const _sfc_main$h = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        currentRate: 50,
        dynamicEvaluationdata: [
          {
            title: "\u4FEF\u5367\u6491\u8010\u529B\u6D4B\u8BD5",
            type: 60,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u4FEF\u5367\u6491\u8010\u529B\u6D4B\u8BD5"
          },
          {
            title: "\u5377\u8179\u6D4B\u8BD5",
            type: 30,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u5377\u8179\u6D4B\u8BD5"
          },
          {
            title: "\u4E09\u5206\u949F\u8E0F\u677F\u6D4B\u8BD5",
            type: 100,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u4E09\u5206\u949F\u8E0F\u677F\u6D4B\u8BD5"
          },
          {
            title: "\u81EA\u91CD\u6DF1\u8E72\u6D4B\u8BD5",
            type: 0,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u81EA\u91CD\u6DF1\u8E72\u6D4B\u8BD5"
          }
        ]
      };
    },
    methods: {
      jumpModular(item) {
        formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:130", item.path, ">>>>");
        uni.navigateTo({
          url: item.path,
          success: (res) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_circle = vue.resolveComponent("van-circle");
    const _component_van_col = vue.resolveComponent("van-col");
    const _component_van_row = vue.resolveComponent("van-row");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u4F53\u80FD\u8BC4\u4F30" }),
      vue.createVNode(_component_van_row, { style: { "background-color": "#343a44" } }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_van_col, {
            class: "need_scoll",
            span: "24"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.dynamicEvaluationdata, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "dynamicshow",
                  key: index
                }, [
                  item.type > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "dynamicshow_left"
                  }, [
                    vue.createElementVNode("text", { class: "evaluationdata" }, vue.toDisplayString(item.title), 1),
                    vue.createVNode(_component_van_button, {
                      round: "",
                      type: "primary",
                      class: "dynamicshow_button",
                      icon: "../../static/app-plus/other/arrows.svg",
                      "icon-position": "right",
                      onClick: ($event) => $options.jumpModular(item)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u91CD\u65B0\u6D4B\u8BD5")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])
                  ])) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "dynamicshow_left"
                  }, [
                    vue.createElementVNode("text", { class: "evaluationdata" }, vue.toDisplayString(item.title), 1),
                    vue.createVNode(_component_van_button, {
                      round: "",
                      type: "primary",
                      color: "#1370FF",
                      class: "dynamicshow_button",
                      icon: "../../static/app-plus/other/arrows.svg",
                      "icon-position": "right"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u5F00\u59CB\u6D4B\u8BD5")
                      ]),
                      _: 1
                    })
                  ])),
                  item.type >= 90 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 2,
                    class: "dynamicshow_right"
                  }, [
                    vue.createVNode(_component_van_circle, {
                      "current-rate": $data.currentRate,
                      "onUpdate:current-rate": _cache[0] || (_cache[0] = ($event) => $data.currentRate = $event),
                      rate: 100,
                      speed: 400,
                      text: "\u4F18\u79C0",
                      "layer-color": "#383D46",
                      color: "#01E08C",
                      style: { "--van-circle-text-color": "#01e08c" }
                    }, null, 8, ["current-rate"])
                  ])) : item.type >= 60 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 3,
                    class: "dynamicshow_right"
                  }, [
                    vue.createVNode(_component_van_circle, {
                      "current-rate": $data.currentRate,
                      "onUpdate:current-rate": _cache[1] || (_cache[1] = ($event) => $data.currentRate = $event),
                      rate: 100,
                      speed: 400,
                      text: "\u4E2D\u4E0A",
                      "layer-color": "#383D46",
                      color: "#FFC13C",
                      style: { "--van-circle-text-color": "#ffc13c" }
                    }, null, 8, ["current-rate"])
                  ])) : item.type > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 4,
                    class: "dynamicshow_right"
                  }, [
                    vue.createVNode(_component_van_circle, {
                      "current-rate": $data.currentRate,
                      "onUpdate:current-rate": _cache[2] || (_cache[2] = ($event) => $data.currentRate = $event),
                      rate: 100,
                      speed: 400,
                      text: "\u8F83\u5DEE",
                      "layer-color": "#383D46",
                      color: "#F04242",
                      style: { "--van-circle-text-color": "#f04242" }
                    }, null, 8, ["current-rate"])
                  ])) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 5,
                    class: "dynamicshow_right"
                  }, [
                    vue.createVNode(_component_van_circle, {
                      "current-rate": $data.currentRate,
                      "onUpdate:current-rate": _cache[3] || (_cache[3] = ($event) => $data.currentRate = $event),
                      rate: 100,
                      speed: 400,
                      text: "\u5F85\u6D4B",
                      "layer-color": "#383D46",
                      color: "#4B525E",
                      style: { "--van-circle-text-color": "#4b525e" }
                    }, null, 8, ["current-rate"])
                  ]))
                ]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      vue.createElementVNode("view", null, [
        vue.createVNode(_component_van_button, {
          type: "primary",
          class: "postureButton"
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u786E\u8BA4")
          ]),
          _: 1
        })
      ])
    ]);
  }
  var PagesPhysicalFitnessAssessmentPhysicalFitnessAssessment = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/physicalFitnessAssessment/physicalFitnessAssessment.vue"]]);
  const isDef = (val) => val !== void 0 && val !== null;
  const isFunction = (val) => typeof val === "function";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => isObject(val) && isFunction(val.then) && isFunction(val.catch);
  const isDate = (val) => Object.prototype.toString.call(val) === "[object Date]" && !Number.isNaN(val.getTime());
  function isMobile(value) {
    value = value.replace(/[^-|\d]/g, "");
    return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
  }
  const isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
  const isIOS$1 = () => inBrowser$1 ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
  function noop() {
  }
  const extend = Object.assign;
  const inBrowser$1 = typeof window !== "undefined";
  function get(object, path) {
    const keys = path.split(".");
    let result = object;
    keys.forEach((key) => {
      var _a;
      result = isObject(result) ? (_a = result[key]) != null ? _a : "" : "";
    });
    return result;
  }
  function pick(obj, keys, ignoreUndefined) {
    return keys.reduce((ret, key) => {
      if (!ignoreUndefined || obj[key] !== void 0) {
        ret[key] = obj[key];
      }
      return ret;
    }, {});
  }
  const toArray = (item) => Array.isArray(item) ? item : [item];
  const unknownProp = null;
  const numericProp = [Number, String];
  const truthProp = {
    type: Boolean,
    default: true
  };
  const makeRequiredProp = (type) => ({
    type,
    required: true
  });
  const makeArrayProp = () => ({
    type: Array,
    default: () => []
  });
  const makeNumberProp = (defaultVal) => ({
    type: Number,
    default: defaultVal
  });
  const makeNumericProp = (defaultVal) => ({
    type: numericProp,
    default: defaultVal
  });
  const makeStringProp = (defaultVal) => ({
    type: String,
    default: defaultVal
  });
  var inBrowser = typeof window !== "undefined";
  function raf(fn2) {
    return inBrowser ? requestAnimationFrame(fn2) : -1;
  }
  function cancelRaf(id) {
    if (inBrowser) {
      cancelAnimationFrame(id);
    }
  }
  function doubleRaf(fn2) {
    raf(() => raf(fn2));
  }
  var isWindow = (val) => val === window;
  var makeDOMRect = (width2, height2) => ({
    top: 0,
    left: 0,
    right: width2,
    bottom: height2,
    width: width2,
    height: height2
  });
  var useRect = (elementOrRef) => {
    const element = vue.unref(elementOrRef);
    if (isWindow(element)) {
      const width2 = element.innerWidth;
      const height2 = element.innerHeight;
      return makeDOMRect(width2, height2);
    }
    if (element == null ? void 0 : element.getBoundingClientRect) {
      return element.getBoundingClientRect();
    }
    return makeDOMRect(0, 0);
  };
  function useToggle(defaultValue = false) {
    const state = vue.ref(defaultValue);
    const toggle = (value = !state.value) => {
      state.value = value;
    };
    return [state, toggle];
  }
  function useParent(key) {
    const parent = vue.inject(key, null);
    if (parent) {
      const instance2 = vue.getCurrentInstance();
      const { link, unlink, internalChildren } = parent;
      link(instance2);
      vue.onUnmounted(() => unlink(instance2));
      const index = vue.computed(() => internalChildren.indexOf(instance2));
      return {
        parent,
        index
      };
    }
    return {
      parent: null,
      index: vue.ref(-1)
    };
  }
  function flattenVNodes(children) {
    const result = [];
    const traverse = (children2) => {
      if (Array.isArray(children2)) {
        children2.forEach((child) => {
          var _a;
          if (vue.isVNode(child)) {
            result.push(child);
            if ((_a = child.component) == null ? void 0 : _a.subTree) {
              result.push(child.component.subTree);
              traverse(child.component.subTree.children);
            }
            if (child.children) {
              traverse(child.children);
            }
          }
        });
      }
    };
    traverse(children);
    return result;
  }
  function sortChildren(parent, publicChildren, internalChildren) {
    const vnodes = flattenVNodes(parent.subTree.children);
    internalChildren.sort((a2, b2) => vnodes.indexOf(a2.vnode) - vnodes.indexOf(b2.vnode));
    const orderedPublicChildren = internalChildren.map((item) => item.proxy);
    publicChildren.sort((a2, b2) => {
      const indexA = orderedPublicChildren.indexOf(a2);
      const indexB = orderedPublicChildren.indexOf(b2);
      return indexA - indexB;
    });
  }
  function useChildren(key) {
    const publicChildren = vue.reactive([]);
    const internalChildren = vue.reactive([]);
    const parent = vue.getCurrentInstance();
    const linkChildren = (value) => {
      const link = (child) => {
        if (child.proxy) {
          internalChildren.push(child);
          publicChildren.push(child.proxy);
          sortChildren(parent, publicChildren, internalChildren);
        }
      };
      const unlink = (child) => {
        const index = internalChildren.indexOf(child);
        publicChildren.splice(index, 1);
        internalChildren.splice(index, 1);
      };
      vue.provide(key, Object.assign({
        link,
        unlink,
        children: publicChildren,
        internalChildren
      }, value));
    };
    return {
      children: publicChildren,
      linkChildren
    };
  }
  var SECOND = 1e3;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;
  function parseTime(time) {
    const days = Math.floor(time / DAY);
    const hours = Math.floor(time % DAY / HOUR);
    const minutes = Math.floor(time % HOUR / MINUTE);
    const seconds = Math.floor(time % MINUTE / SECOND);
    const milliseconds = Math.floor(time % SECOND);
    return {
      total: time,
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }
  function isSameSecond(time1, time2) {
    return Math.floor(time1 / 1e3) === Math.floor(time2 / 1e3);
  }
  function useCountDown(options) {
    let rafId;
    let endTime;
    let counting;
    let deactivated;
    const remain = vue.ref(options.time);
    const current2 = vue.computed(() => parseTime(remain.value));
    const pause = () => {
      counting = false;
      cancelRaf(rafId);
    };
    const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);
    const setRemain = (value) => {
      var _a, _b;
      remain.value = value;
      (_a = options.onChange) == null ? void 0 : _a.call(options, current2.value);
      if (value === 0) {
        pause();
        (_b = options.onFinish) == null ? void 0 : _b.call(options);
      }
    };
    const microTick = () => {
      rafId = raf(() => {
        if (counting) {
          setRemain(getCurrentRemain());
          if (remain.value > 0) {
            microTick();
          }
        }
      });
    };
    const macroTick = () => {
      rafId = raf(() => {
        if (counting) {
          const remainRemain = getCurrentRemain();
          if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
            setRemain(remainRemain);
          }
          if (remain.value > 0) {
            macroTick();
          }
        }
      });
    };
    const tick = () => {
      if (!inBrowser) {
        return;
      }
      if (options.millisecond) {
        microTick();
      } else {
        macroTick();
      }
    };
    const start2 = () => {
      if (!counting) {
        endTime = Date.now() + remain.value;
        counting = true;
        tick();
      }
    };
    const reset = (totalTime = options.time) => {
      pause();
      remain.value = totalTime;
    };
    vue.onBeforeUnmount(pause);
    vue.onActivated(() => {
      if (deactivated) {
        counting = true;
        deactivated = false;
        tick();
      }
    });
    vue.onDeactivated(() => {
      if (counting) {
        pause();
        deactivated = true;
      }
    });
    return {
      start: start2,
      pause,
      reset,
      current: current2
    };
  }
  function onMountedOrActivated(hook) {
    let mounted;
    vue.onMounted(() => {
      hook();
      vue.nextTick(() => {
        mounted = true;
      });
    });
    vue.onActivated(() => {
      if (mounted) {
        hook();
      }
    });
  }
  function useEventListener(type, listener, options = {}) {
    if (!inBrowser) {
      return;
    }
    const { target = window, passive: passive2 = false, capture = false } = options;
    let attached;
    const add = (target2) => {
      const element = vue.unref(target2);
      if (element && !attached) {
        element.addEventListener(type, listener, {
          capture,
          passive: passive2
        });
        attached = true;
      }
    };
    const remove = (target2) => {
      const element = vue.unref(target2);
      if (element && attached) {
        element.removeEventListener(type, listener, capture);
        attached = false;
      }
    };
    vue.onUnmounted(() => remove(target));
    vue.onDeactivated(() => remove(target));
    onMountedOrActivated(() => add(target));
    if (vue.isRef(target)) {
      vue.watch(target, (val, oldVal) => {
        remove(oldVal);
        add(val);
      });
    }
  }
  function useClickAway(target, listener, options = {}) {
    if (!inBrowser) {
      return;
    }
    const { eventName = "click" } = options;
    const onClick = (event) => {
      const targets = Array.isArray(target) ? target : [target];
      const isClickAway = targets.every((item) => {
        const element = vue.unref(item);
        return element && !element.contains(event.target);
      });
      if (isClickAway) {
        listener(event);
      }
    };
    useEventListener(eventName, onClick, { target: document });
  }
  var width;
  var height;
  function useWindowSize() {
    if (!width) {
      width = vue.ref(0);
      height = vue.ref(0);
      if (inBrowser) {
        const update = () => {
          width.value = window.innerWidth;
          height.value = window.innerHeight;
        };
        update();
        window.addEventListener("resize", update, { passive: true });
        window.addEventListener("orientationchange", update, { passive: true });
      }
    }
    return { width, height };
  }
  var overflowScrollReg = /scroll|auto|overlay/i;
  var defaultRoot = inBrowser ? window : void 0;
  function isElement$1(node) {
    const ELEMENT_NODE_TYPE = 1;
    return node.tagName !== "HTML" && node.tagName !== "BODY" && node.nodeType === ELEMENT_NODE_TYPE;
  }
  function getScrollParent$1(el, root = defaultRoot) {
    let node = el;
    while (node && node !== root && isElement$1(node)) {
      const { overflowY } = window.getComputedStyle(node);
      if (overflowScrollReg.test(overflowY)) {
        return node;
      }
      node = node.parentNode;
    }
    return root;
  }
  function useScrollParent(el, root = defaultRoot) {
    const scrollParent = vue.ref();
    vue.onMounted(() => {
      if (el.value) {
        scrollParent.value = getScrollParent$1(el.value, root);
      }
    });
    return scrollParent;
  }
  var visibility;
  function usePageVisibility() {
    if (!visibility) {
      visibility = vue.ref("visible");
      if (inBrowser) {
        const update = () => {
          visibility.value = document.hidden ? "hidden" : "visible";
        };
        update();
        window.addEventListener("visibilitychange", update);
      }
    }
    return visibility;
  }
  var CUSTOM_FIELD_INJECTION_KEY = Symbol("van-field");
  function useCustomFieldValue(customValue) {
    const field = vue.inject(CUSTOM_FIELD_INJECTION_KEY, null);
    if (field && !field.customValue.value) {
      field.customValue.value = customValue;
      vue.watch(customValue, () => {
        field.resetValidation();
        field.validateWithTrigger("onChange");
      });
    }
  }
  function getScrollTop(el) {
    const top2 = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
    return Math.max(top2, 0);
  }
  function setScrollTop(el, value) {
    if ("scrollTop" in el) {
      el.scrollTop = value;
    } else {
      el.scrollTo(el.scrollX, value);
    }
  }
  function getRootScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  function setRootScrollTop(value) {
    setScrollTop(window, value);
    setScrollTop(document.body, value);
  }
  function getElementTop(el, scroller) {
    if (el === window) {
      return 0;
    }
    const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
    return useRect(el).top + scrollTop;
  }
  const isIOS = isIOS$1();
  function resetScroll() {
    if (isIOS) {
      setRootScrollTop(getRootScrollTop());
    }
  }
  const stopPropagation = (event) => event.stopPropagation();
  function preventDefault(event, isStopPropagation) {
    if (typeof event.cancelable !== "boolean" || event.cancelable) {
      event.preventDefault();
    }
    if (isStopPropagation) {
      stopPropagation(event);
    }
  }
  function isHidden(elementRef) {
    const el = vue.unref(elementRef);
    if (!el) {
      return false;
    }
    const style = window.getComputedStyle(el);
    const hidden = style.display === "none";
    const parentHidden = el.offsetParent === null && style.position !== "fixed";
    return hidden || parentHidden;
  }
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  function addUnit(value) {
    if (isDef(value)) {
      return isNumeric(value) ? `${value}px` : String(value);
    }
    return void 0;
  }
  function getSizeStyle(originSize) {
    if (isDef(originSize)) {
      if (Array.isArray(originSize)) {
        return {
          width: addUnit(originSize[0]),
          height: addUnit(originSize[1])
        };
      }
      const size = addUnit(originSize);
      return {
        width: size,
        height: size
      };
    }
  }
  function getZIndexStyle(zIndex) {
    const style = {};
    if (zIndex !== void 0) {
      style.zIndex = +zIndex;
    }
    return style;
  }
  let rootFontSize;
  function getRootFontSize() {
    if (!rootFontSize) {
      const doc = document.documentElement;
      const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;
      rootFontSize = parseFloat(fontSize);
    }
    return rootFontSize;
  }
  function convertRem(value) {
    value = value.replace(/rem/g, "");
    return +value * getRootFontSize();
  }
  function convertVw(value) {
    value = value.replace(/vw/g, "");
    return +value * windowWidth.value / 100;
  }
  function convertVh(value) {
    value = value.replace(/vh/g, "");
    return +value * windowHeight.value / 100;
  }
  function unitToPx(value) {
    if (typeof value === "number") {
      return value;
    }
    if (inBrowser$1) {
      if (value.includes("rem")) {
        return convertRem(value);
      }
      if (value.includes("vw")) {
        return convertVw(value);
      }
      if (value.includes("vh")) {
        return convertVh(value);
      }
    }
    return parseFloat(value);
  }
  const camelizeRE = /-(\w)/g;
  const camelize = (str) => str.replace(camelizeRE, (_2, c2) => c2.toUpperCase());
  const kebabCase = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
  function padZero(num, targetLength = 2) {
    let str = num + "";
    while (str.length < targetLength) {
      str = "0" + str;
    }
    return str;
  }
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  function trimExtraChar(value, char, regExp) {
    const index = value.indexOf(char);
    if (index === -1) {
      return value;
    }
    if (char === "-" && index !== 0) {
      return value.slice(0, index);
    }
    return value.slice(0, index + 1) + value.slice(index).replace(regExp, "");
  }
  function formatNumber(value, allowDot = true, allowMinus = true) {
    if (allowDot) {
      value = trimExtraChar(value, ".", /\./g);
    } else {
      value = value.split(".")[0];
    }
    if (allowMinus) {
      value = trimExtraChar(value, "-", /-/g);
    } else {
      value = value.replace(/-/, "");
    }
    const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
    return value.replace(regExp, "");
  }
  function addNumber(num1, num2) {
    const cardinal = 10 ** 10;
    return Math.round((num1 + num2) * cardinal) / cardinal;
  }
  const { hasOwnProperty } = Object.prototype;
  function assignKey(to, from, key) {
    const val = from[key];
    if (!isDef(val)) {
      return;
    }
    if (!hasOwnProperty.call(to, key) || !isObject(val)) {
      to[key] = val;
    } else {
      to[key] = deepAssign(Object(to[key]), val);
    }
  }
  function deepAssign(to, from) {
    Object.keys(from).forEach((key) => {
      assignKey(to, from, key);
    });
    return to;
  }
  var stdin_default$1B = {
    name: "\u59D3\u540D",
    tel: "\u7535\u8BDD",
    save: "\u4FDD\u5B58",
    confirm: "\u786E\u8BA4",
    cancel: "\u53D6\u6D88",
    delete: "\u5220\u9664",
    loading: "\u52A0\u8F7D\u4E2D...",
    noCoupon: "\u6682\u65E0\u4F18\u60E0\u5238",
    nameEmpty: "\u8BF7\u586B\u5199\u59D3\u540D",
    addContact: "\u6DFB\u52A0\u8054\u7CFB\u4EBA",
    telInvalid: "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u7535\u8BDD",
    vanCalendar: {
      end: "\u7ED3\u675F",
      start: "\u5F00\u59CB",
      title: "\u65E5\u671F\u9009\u62E9",
      weekdays: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"],
      monthTitle: (year, month) => `${year}\u5E74${month}\u6708`,
      rangePrompt: (maxRange) => `\u6700\u591A\u9009\u62E9 ${maxRange} \u5929`
    },
    vanCascader: {
      select: "\u8BF7\u9009\u62E9"
    },
    vanPagination: {
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875"
    },
    vanPullRefresh: {
      pulling: "\u4E0B\u62C9\u5373\u53EF\u5237\u65B0...",
      loosing: "\u91CA\u653E\u5373\u53EF\u5237\u65B0..."
    },
    vanSubmitBar: {
      label: "\u5408\u8BA1:"
    },
    vanCoupon: {
      unlimited: "\u65E0\u95E8\u69DB",
      discount: (discount) => `${discount}\u6298`,
      condition: (condition) => `\u6EE1${condition}\u5143\u53EF\u7528`
    },
    vanCouponCell: {
      title: "\u4F18\u60E0\u5238",
      count: (count) => `${count}\u5F20\u53EF\u7528`
    },
    vanCouponList: {
      exchange: "\u5151\u6362",
      close: "\u4E0D\u4F7F\u7528",
      enable: "\u53EF\u7528",
      disabled: "\u4E0D\u53EF\u7528",
      placeholder: "\u8F93\u5165\u4F18\u60E0\u7801"
    },
    vanAddressEdit: {
      area: "\u5730\u533A",
      postal: "\u90AE\u653F\u7F16\u7801",
      areaEmpty: "\u8BF7\u9009\u62E9\u5730\u533A",
      addressEmpty: "\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740",
      postalEmpty: "\u90AE\u653F\u7F16\u7801\u4E0D\u6B63\u786E",
      addressDetail: "\u8BE6\u7EC6\u5730\u5740",
      defaultAddress: "\u8BBE\u4E3A\u9ED8\u8BA4\u6536\u8D27\u5730\u5740"
    },
    vanAddressList: {
      add: "\u65B0\u589E\u5730\u5740"
    }
  };
  const lang = vue.ref("zh-CN");
  const messages = vue.reactive({
    "zh-CN": stdin_default$1B
  });
  const Locale = {
    messages() {
      return messages[lang.value];
    },
    use(newLang, newMessages) {
      lang.value = newLang;
      this.add({ [newLang]: newMessages });
    },
    add(newMessages = {}) {
      deepAssign(messages, newMessages);
    }
  };
  var stdin_default$1A = Locale;
  function createTranslate(name2) {
    const prefix = camelize(name2) + ".";
    return (path, ...args) => {
      const messages2 = stdin_default$1A.messages();
      const message = get(messages2, prefix + path) || get(messages2, path);
      return isFunction(message) ? message(...args) : message;
    };
  }
  function genBem(name2, mods) {
    if (!mods) {
      return "";
    }
    if (typeof mods === "string") {
      return ` ${name2}--${mods}`;
    }
    if (Array.isArray(mods)) {
      return mods.reduce((ret, item) => ret + genBem(name2, item), "");
    }
    return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(name2, key) : ""), "");
  }
  function createBEM(name2) {
    return (el, mods) => {
      if (el && typeof el !== "string") {
        mods = el;
        el = "";
      }
      el = el ? `${name2}__${el}` : name2;
      return `${el}${genBem(el, mods)}`;
    };
  }
  function createNamespace(name2) {
    const prefixedName = `van-${name2}`;
    return [
      prefixedName,
      createBEM(prefixedName),
      createTranslate(prefixedName)
    ];
  }
  const BORDER = "van-hairline";
  const BORDER_TOP = `${BORDER}--top`;
  const BORDER_LEFT = `${BORDER}--left`;
  const BORDER_BOTTOM = `${BORDER}--bottom`;
  const BORDER_SURROUND = `${BORDER}--surround`;
  const BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;
  const BORDER_UNSET_TOP_BOTTOM = `${BORDER}-unset--top-bottom`;
  const HAPTICS_FEEDBACK = "van-haptics-feedback";
  const FORM_KEY = Symbol("van-form");
  function callInterceptor(interceptor, {
    args = [],
    done,
    canceled
  }) {
    if (interceptor) {
      const returnVal = interceptor.apply(null, args);
      if (isPromise(returnVal)) {
        returnVal.then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        }).catch(noop);
      } else if (returnVal) {
        done();
      } else if (canceled) {
        canceled();
      }
    } else {
      done();
    }
  }
  function withInstall(options) {
    options.install = (app) => {
      const { name: name2 } = options;
      if (name2) {
        app.component(name2, options);
        app.component(camelize(`-${name2}`), options);
      }
    };
    return options;
  }
  const POPUP_TOGGLE_KEY = Symbol();
  function onPopupReopen(callback) {
    const popupToggleStatus = vue.inject(POPUP_TOGGLE_KEY, null);
    if (popupToggleStatus) {
      vue.watch(popupToggleStatus, (show) => {
        if (show) {
          callback();
        }
      });
    }
  }
  const useHeight = (element, withSafeArea) => {
    const height2 = vue.ref();
    const setHeight = () => {
      height2.value = useRect(element).height;
    };
    vue.onMounted(() => {
      vue.nextTick(setHeight);
      if (withSafeArea) {
        for (let i2 = 1; i2 <= 3; i2++) {
          setTimeout(setHeight, 100 * i2);
        }
      }
    });
    onPopupReopen(() => vue.nextTick(setHeight));
    return height2;
  };
  function usePlaceholder(contentRef, bem2) {
    const height2 = useHeight(contentRef, true);
    return (renderContent) => vue.createVNode("div", {
      "class": bem2("placeholder"),
      "style": {
        height: height2.value ? `${height2.value}px` : void 0
      }
    }, [renderContent()]);
  }
  const [name$1v, bem$1r] = createNamespace("action-bar");
  const ACTION_BAR_KEY = Symbol(name$1v);
  const actionBarProps = {
    placeholder: Boolean,
    safeAreaInsetBottom: truthProp
  };
  var stdin_default$1z = vue.defineComponent({
    name: name$1v,
    props: actionBarProps,
    setup(props, {
      slots
    }) {
      const root = vue.ref();
      const renderPlaceholder = usePlaceholder(root, bem$1r);
      const {
        linkChildren
      } = useChildren(ACTION_BAR_KEY);
      linkChildren();
      const renderActionBar = () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "class": [bem$1r(), {
            "van-safe-area-bottom": props.safeAreaInsetBottom
          }]
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
      return () => {
        if (props.placeholder) {
          return renderPlaceholder(renderActionBar);
        }
        return renderActionBar();
      };
    }
  });
  const ActionBar = withInstall(stdin_default$1z);
  function useExpose(apis) {
    const instance2 = vue.getCurrentInstance();
    if (instance2) {
      extend(instance2.proxy, apis);
    }
  }
  const routeProps = {
    to: [String, Object],
    url: String,
    replace: Boolean
  };
  function route({
    to,
    url,
    replace,
    $router: router
  }) {
    if (to && router) {
      router[replace ? "replace" : "push"](to);
    } else if (url) {
      replace ? location.replace(url) : location.href = url;
    }
  }
  function useRoute() {
    const vm = vue.getCurrentInstance().proxy;
    return () => route(vm);
  }
  const [name$1u, bem$1q] = createNamespace("badge");
  const badgeProps = {
    dot: Boolean,
    max: numericProp,
    tag: makeStringProp("div"),
    color: String,
    offset: Array,
    content: numericProp,
    showZero: truthProp,
    position: makeStringProp("top-right")
  };
  var stdin_default$1y = vue.defineComponent({
    name: name$1u,
    props: badgeProps,
    setup(props, {
      slots
    }) {
      const hasContent = () => {
        if (slots.content) {
          return true;
        }
        const {
          content,
          showZero
        } = props;
        return isDef(content) && content !== "" && (showZero || content !== 0 && content !== "0");
      };
      const renderContent = () => {
        const {
          dot,
          max,
          content
        } = props;
        if (!dot && hasContent()) {
          if (slots.content) {
            return slots.content();
          }
          if (isDef(max) && isNumeric(content) && +content > max) {
            return `${max}+`;
          }
          return content;
        }
      };
      const style = vue.computed(() => {
        const style2 = {
          background: props.color
        };
        if (props.offset) {
          const [x2, y2] = props.offset;
          if (slots.default) {
            style2.top = addUnit(y2);
            if (typeof x2 === "number") {
              style2.right = addUnit(-x2);
            } else {
              style2.right = x2.startsWith("-") ? x2.replace("-", "") : `-${x2}`;
            }
          } else {
            style2.marginTop = addUnit(y2);
            style2.marginLeft = addUnit(x2);
          }
        }
        return style2;
      });
      const renderBadge = () => {
        if (hasContent() || props.dot) {
          return vue.createVNode("div", {
            "class": bem$1q([props.position, {
              dot: props.dot,
              fixed: !!slots.default
            }]),
            "style": style.value
          }, [renderContent()]);
        }
      };
      return () => {
        if (slots.default) {
          const {
            tag
          } = props;
          return vue.createVNode(tag, {
            "class": bem$1q("wrapper")
          }, {
            default: () => [slots.default(), renderBadge()]
          });
        }
        return renderBadge();
      };
    }
  });
  const Badge = withInstall(stdin_default$1y);
  let globalZIndex = 2e3;
  const useGlobalZIndex = () => ++globalZIndex;
  const setGlobalZIndex = (val) => {
    globalZIndex = val;
  };
  const [name$1t, bem$1p] = createNamespace("config-provider");
  const CONFIG_PROVIDER_KEY = Symbol(name$1t);
  const configProviderProps = {
    tag: makeStringProp("div"),
    zIndex: Number,
    themeVars: Object,
    iconPrefix: String
  };
  function mapThemeVarsToCSSVars(themeVars) {
    const cssVars = {};
    Object.keys(themeVars).forEach((key) => {
      cssVars[`--van-${kebabCase(key)}`] = themeVars[key];
    });
    return cssVars;
  }
  var stdin_default$1x = vue.defineComponent({
    name: name$1t,
    props: configProviderProps,
    setup(props, {
      slots
    }) {
      const style = vue.computed(() => {
        if (props.themeVars) {
          return mapThemeVarsToCSSVars(props.themeVars);
        }
      });
      vue.provide(CONFIG_PROVIDER_KEY, props);
      vue.watchEffect(() => {
        if (props.zIndex !== void 0) {
          setGlobalZIndex(props.zIndex);
        }
      });
      return () => vue.createVNode(props.tag, {
        "class": bem$1p(),
        "style": style.value
      }, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      });
    }
  });
  const [name$1s, bem$1o] = createNamespace("icon");
  const isImage = (name2) => name2 == null ? void 0 : name2.includes("/");
  const iconProps = {
    dot: Boolean,
    tag: makeStringProp("i"),
    name: String,
    size: numericProp,
    badge: numericProp,
    color: String,
    badgeProps: Object,
    classPrefix: String
  };
  var stdin_default$1w = vue.defineComponent({
    name: name$1s,
    props: iconProps,
    setup(props, {
      slots
    }) {
      const config = vue.inject(CONFIG_PROVIDER_KEY, null);
      const classPrefix = vue.computed(() => props.classPrefix || (config == null ? void 0 : config.iconPrefix) || bem$1o());
      return () => {
        const {
          tag,
          dot,
          name: name2,
          size,
          badge,
          color
        } = props;
        const isImageIcon = isImage(name2);
        return vue.createVNode(Badge, vue.mergeProps({
          "dot": dot,
          "tag": tag,
          "class": [classPrefix.value, isImageIcon ? "" : `${classPrefix.value}-${name2}`],
          "style": {
            color,
            fontSize: addUnit(size)
          },
          "content": badge
        }, props.badgeProps), {
          default: () => {
            var _a;
            return [(_a = slots.default) == null ? void 0 : _a.call(slots), isImageIcon && vue.createVNode("img", {
              "class": bem$1o("image"),
              "src": name2
            }, null)];
          }
        });
      };
    }
  });
  const Icon = withInstall(stdin_default$1w);
  const [name$1r, bem$1n] = createNamespace("loading");
  const SpinIcon = Array(12).fill(null).map((_2, index) => vue.createVNode("i", {
    "class": bem$1n("line", String(index + 1))
  }, null));
  const CircularIcon = vue.createVNode("svg", {
    "class": bem$1n("circular"),
    "viewBox": "25 25 50 50"
  }, [vue.createVNode("circle", {
    "cx": "50",
    "cy": "50",
    "r": "20",
    "fill": "none"
  }, null)]);
  const loadingProps = {
    size: numericProp,
    type: makeStringProp("circular"),
    color: String,
    vertical: Boolean,
    textSize: numericProp,
    textColor: String
  };
  var stdin_default$1v = vue.defineComponent({
    name: name$1r,
    props: loadingProps,
    setup(props, {
      slots
    }) {
      const spinnerStyle = vue.computed(() => extend({
        color: props.color
      }, getSizeStyle(props.size)));
      const renderText = () => {
        var _a;
        if (slots.default) {
          return vue.createVNode("span", {
            "class": bem$1n("text"),
            "style": {
              fontSize: addUnit(props.textSize),
              color: (_a = props.textColor) != null ? _a : props.color
            }
          }, [slots.default()]);
        }
      };
      return () => {
        const {
          type,
          vertical
        } = props;
        return vue.createVNode("div", {
          "class": bem$1n([type, {
            vertical
          }]),
          "aria-live": "polite",
          "aria-busy": true
        }, [vue.createVNode("span", {
          "class": bem$1n("spinner", type),
          "style": spinnerStyle.value
        }, [type === "spinner" ? SpinIcon : CircularIcon]), renderText()]);
      };
    }
  });
  const Loading = withInstall(stdin_default$1v);
  const [name$1q, bem$1m] = createNamespace("button");
  const buttonProps = extend({}, routeProps, {
    tag: makeStringProp("button"),
    text: String,
    icon: String,
    type: makeStringProp("default"),
    size: makeStringProp("normal"),
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    iconPrefix: String,
    nativeType: makeStringProp("button"),
    loadingSize: numericProp,
    loadingText: String,
    loadingType: String,
    iconPosition: makeStringProp("left")
  });
  var stdin_default$1u = vue.defineComponent({
    name: name$1q,
    props: buttonProps,
    emits: ["click"],
    setup(props, {
      emit,
      slots
    }) {
      const route2 = useRoute();
      const renderLoadingIcon = () => {
        if (slots.loading) {
          return slots.loading();
        }
        return vue.createVNode(Loading, {
          "size": props.loadingSize,
          "type": props.loadingType,
          "class": bem$1m("loading")
        }, null);
      };
      const renderIcon = () => {
        if (props.loading) {
          return renderLoadingIcon();
        }
        if (slots.icon) {
          return vue.createVNode("div", {
            "class": bem$1m("icon")
          }, [slots.icon()]);
        }
        if (props.icon) {
          return vue.createVNode(Icon, {
            "name": props.icon,
            "class": bem$1m("icon"),
            "classPrefix": props.iconPrefix
          }, null);
        }
      };
      const renderText = () => {
        let text;
        if (props.loading) {
          text = props.loadingText;
        } else {
          text = slots.default ? slots.default() : props.text;
        }
        if (text) {
          return vue.createVNode("span", {
            "class": bem$1m("text")
          }, [text]);
        }
      };
      const getStyle = () => {
        const {
          color,
          plain
        } = props;
        if (color) {
          const style = {
            color: plain ? color : "white"
          };
          if (!plain) {
            style.background = color;
          }
          if (color.includes("gradient")) {
            style.border = 0;
          } else {
            style.borderColor = color;
          }
          return style;
        }
      };
      const onClick = (event) => {
        if (props.loading) {
          preventDefault(event);
        } else if (!props.disabled) {
          emit("click", event);
          route2();
        }
      };
      return () => {
        const {
          tag,
          type,
          size,
          block,
          round: round2,
          plain,
          square,
          loading,
          disabled,
          hairline,
          nativeType,
          iconPosition
        } = props;
        const classes = [bem$1m([type, size, {
          plain,
          block,
          round: round2,
          square,
          loading,
          disabled,
          hairline
        }]), {
          [BORDER_SURROUND]: hairline
        }];
        return vue.createVNode(tag, {
          "type": nativeType,
          "class": classes,
          "style": getStyle(),
          "disabled": disabled,
          "onClick": onClick
        }, {
          default: () => [vue.createVNode("div", {
            "class": bem$1m("content")
          }, [iconPosition === "left" && renderIcon(), renderText(), iconPosition === "right" && renderIcon()])]
        });
      };
    }
  });
  const Button = withInstall(stdin_default$1u);
  const [name$1p, bem$1l] = createNamespace("action-bar-button");
  const actionBarButtonProps = extend({}, routeProps, {
    type: String,
    text: String,
    icon: String,
    color: String,
    loading: Boolean,
    disabled: Boolean
  });
  var stdin_default$1t = vue.defineComponent({
    name: name$1p,
    props: actionBarButtonProps,
    setup(props, {
      slots
    }) {
      const route2 = useRoute();
      const {
        parent,
        index
      } = useParent(ACTION_BAR_KEY);
      const isFirst = vue.computed(() => {
        if (parent) {
          const prev = parent.children[index.value - 1];
          return !(prev && "isButton" in prev);
        }
      });
      const isLast = vue.computed(() => {
        if (parent) {
          const next = parent.children[index.value + 1];
          return !(next && "isButton" in next);
        }
      });
      useExpose({
        isButton: true
      });
      return () => {
        const {
          type,
          icon,
          text,
          color,
          loading,
          disabled
        } = props;
        return vue.createVNode(Button, {
          "class": bem$1l([type, {
            last: isLast.value,
            first: isFirst.value
          }]),
          "size": "large",
          "type": type,
          "icon": icon,
          "color": color,
          "loading": loading,
          "disabled": disabled,
          "onClick": route2
        }, {
          default: () => [slots.default ? slots.default() : text]
        });
      };
    }
  });
  const ActionBarButton = withInstall(stdin_default$1t);
  const [name$1o, bem$1k] = createNamespace("action-bar-icon");
  const actionBarIconProps = extend({}, routeProps, {
    dot: Boolean,
    text: String,
    icon: String,
    color: String,
    badge: numericProp,
    iconClass: unknownProp,
    badgeProps: Object,
    iconPrefix: String
  });
  var stdin_default$1s = vue.defineComponent({
    name: name$1o,
    props: actionBarIconProps,
    setup(props, {
      slots
    }) {
      const route2 = useRoute();
      useParent(ACTION_BAR_KEY);
      const renderIcon = () => {
        const {
          dot,
          badge,
          icon,
          color,
          iconClass,
          badgeProps: badgeProps2,
          iconPrefix
        } = props;
        if (slots.icon) {
          return vue.createVNode(Badge, vue.mergeProps({
            "dot": dot,
            "class": bem$1k("icon"),
            "content": badge
          }, badgeProps2), {
            default: slots.icon
          });
        }
        return vue.createVNode(Icon, {
          "tag": "div",
          "dot": dot,
          "name": icon,
          "badge": badge,
          "color": color,
          "class": [bem$1k("icon"), iconClass],
          "badgeProps": badgeProps2,
          "classPrefix": iconPrefix
        }, null);
      };
      return () => vue.createVNode("div", {
        "role": "button",
        "class": bem$1k(),
        "tabindex": 0,
        "onClick": route2
      }, [renderIcon(), slots.default ? slots.default() : props.text]);
    }
  });
  const ActionBarIcon = withInstall(stdin_default$1s);
  const popupSharedProps = {
    show: Boolean,
    zIndex: numericProp,
    overlay: truthProp,
    duration: numericProp,
    teleport: [String, Object],
    lockScroll: truthProp,
    lazyRender: truthProp,
    beforeClose: Function,
    overlayStyle: Object,
    overlayClass: unknownProp,
    transitionAppear: Boolean,
    closeOnClickOverlay: truthProp
  };
  const popupSharedPropKeys = Object.keys(popupSharedProps);
  function getDirection(x2, y2) {
    if (x2 > y2) {
      return "horizontal";
    }
    if (y2 > x2) {
      return "vertical";
    }
    return "";
  }
  function useTouch() {
    const startX = vue.ref(0);
    const startY = vue.ref(0);
    const deltaX = vue.ref(0);
    const deltaY = vue.ref(0);
    const offsetX = vue.ref(0);
    const offsetY = vue.ref(0);
    const direction = vue.ref("");
    const isVertical = () => direction.value === "vertical";
    const isHorizontal = () => direction.value === "horizontal";
    const reset = () => {
      deltaX.value = 0;
      deltaY.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      direction.value = "";
    };
    const start2 = (event) => {
      reset();
      startX.value = event.touches[0].clientX;
      startY.value = event.touches[0].clientY;
    };
    const move = (event) => {
      const touch = event.touches[0];
      deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
      deltaY.value = touch.clientY - startY.value;
      offsetX.value = Math.abs(deltaX.value);
      offsetY.value = Math.abs(deltaY.value);
      const LOCK_DIRECTION_DISTANCE = 10;
      if (!direction.value || offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE) {
        direction.value = getDirection(offsetX.value, offsetY.value);
      }
    };
    return {
      move,
      start: start2,
      reset,
      startX,
      startY,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      direction,
      isVertical,
      isHorizontal
    };
  }
  let totalLockCount = 0;
  const BODY_LOCK_CLASS = "van-overflow-hidden";
  function useLockScroll(rootRef, shouldLock) {
    const touch = useTouch();
    const DIRECTION_UP = "01";
    const DIRECTION_DOWN = "10";
    const onTouchMove = (event) => {
      touch.move(event);
      const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
      const el = getScrollParent$1(event.target, rootRef.value);
      const { scrollHeight, offsetHeight, scrollTop } = el;
      let status = "11";
      if (scrollTop === 0) {
        status = offsetHeight >= scrollHeight ? "00" : "01";
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        status = "10";
      }
      if (status !== "11" && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
        preventDefault(event, true);
      }
    };
    const lock = () => {
      document.addEventListener("touchstart", touch.start);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      if (!totalLockCount) {
        document.body.classList.add(BODY_LOCK_CLASS);
      }
      totalLockCount++;
    };
    const unlock = () => {
      if (totalLockCount) {
        document.removeEventListener("touchstart", touch.start);
        document.removeEventListener("touchmove", onTouchMove);
        totalLockCount--;
        if (!totalLockCount) {
          document.body.classList.remove(BODY_LOCK_CLASS);
        }
      }
    };
    const init = () => shouldLock() && lock();
    const destroy = () => shouldLock() && unlock();
    onMountedOrActivated(init);
    vue.onDeactivated(destroy);
    vue.onBeforeUnmount(destroy);
    vue.watch(shouldLock, (value) => {
      value ? lock() : unlock();
    });
  }
  function useLazyRender(show) {
    const inited = vue.ref(false);
    vue.watch(show, (value) => {
      if (value) {
        inited.value = value;
      }
    }, { immediate: true });
    return (render) => () => inited.value ? render() : null;
  }
  const [name$1n, bem$1j] = createNamespace("overlay");
  const overlayProps = {
    show: Boolean,
    zIndex: numericProp,
    duration: numericProp,
    className: unknownProp,
    lockScroll: truthProp,
    lazyRender: truthProp,
    customStyle: Object
  };
  var stdin_default$1r = vue.defineComponent({
    name: name$1n,
    props: overlayProps,
    setup(props, {
      slots
    }) {
      const root = vue.ref();
      const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
      const onTouchMove = (event) => {
        if (props.lockScroll) {
          preventDefault(event, true);
        }
      };
      const renderOverlay = lazyRender(() => {
        var _a;
        const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
        if (isDef(props.duration)) {
          style.animationDuration = `${props.duration}s`;
        }
        return vue.withDirectives(vue.createVNode("div", {
          "ref": root,
          "style": style,
          "class": [bem$1j(), props.className]
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[vue.vShow, props.show]]);
      });
      useEventListener("touchmove", onTouchMove, {
        target: root
      });
      return () => vue.createVNode(vue.Transition, {
        "name": "van-fade",
        "appear": true
      }, {
        default: renderOverlay
      });
    }
  });
  const Overlay = withInstall(stdin_default$1r);
  const popupProps$2 = extend({}, popupSharedProps, {
    round: Boolean,
    position: makeStringProp("center"),
    closeIcon: makeStringProp("cross"),
    closeable: Boolean,
    transition: String,
    iconPrefix: String,
    closeOnPopstate: Boolean,
    closeIconPosition: makeStringProp("top-right"),
    safeAreaInsetTop: Boolean,
    safeAreaInsetBottom: Boolean
  });
  const [name$1m, bem$1i] = createNamespace("popup");
  var stdin_default$1q = vue.defineComponent({
    name: name$1m,
    inheritAttrs: false,
    props: popupProps$2,
    emits: ["open", "close", "opened", "closed", "keydown", "update:show", "click-overlay", "click-close-icon"],
    setup(props, {
      emit,
      attrs,
      slots
    }) {
      let opened;
      let shouldReopen;
      const zIndex = vue.ref();
      const popupRef = vue.ref();
      const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
      const style = vue.computed(() => {
        const style2 = {
          zIndex: zIndex.value
        };
        if (isDef(props.duration)) {
          const key = props.position === "center" ? "animationDuration" : "transitionDuration";
          style2[key] = `${props.duration}s`;
        }
        return style2;
      });
      const open = () => {
        if (!opened) {
          opened = true;
          zIndex.value = props.zIndex !== void 0 ? +props.zIndex : useGlobalZIndex();
          emit("open");
        }
      };
      const close = () => {
        if (opened) {
          callInterceptor(props.beforeClose, {
            done() {
              opened = false;
              emit("close");
              emit("update:show", false);
            }
          });
        }
      };
      const onClickOverlay = (event) => {
        emit("click-overlay", event);
        if (props.closeOnClickOverlay) {
          close();
        }
      };
      const renderOverlay = () => {
        if (props.overlay) {
          return vue.createVNode(Overlay, {
            "show": props.show,
            "class": props.overlayClass,
            "zIndex": zIndex.value,
            "duration": props.duration,
            "customStyle": props.overlayStyle,
            "role": props.closeOnClickOverlay ? "button" : void 0,
            "tabindex": props.closeOnClickOverlay ? 0 : void 0,
            "onClick": onClickOverlay
          }, {
            default: slots["overlay-content"]
          });
        }
      };
      const onClickCloseIcon = (event) => {
        emit("click-close-icon", event);
        close();
      };
      const renderCloseIcon = () => {
        if (props.closeable) {
          return vue.createVNode(Icon, {
            "role": "button",
            "tabindex": 0,
            "name": props.closeIcon,
            "class": [bem$1i("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
            "classPrefix": props.iconPrefix,
            "onClick": onClickCloseIcon
          }, null);
        }
      };
      const onOpened = () => emit("opened");
      const onClosed = () => emit("closed");
      const onKeydown = (event) => emit("keydown", event);
      const renderPopup = lazyRender(() => {
        var _a;
        const {
          round: round2,
          position,
          safeAreaInsetTop,
          safeAreaInsetBottom
        } = props;
        return vue.withDirectives(vue.createVNode("div", vue.mergeProps({
          "ref": popupRef,
          "style": style.value,
          "role": "dialog",
          "tabindex": 0,
          "class": [bem$1i({
            round: round2,
            [position]: position
          }), {
            "van-safe-area-top": safeAreaInsetTop,
            "van-safe-area-bottom": safeAreaInsetBottom
          }],
          "onKeydown": onKeydown
        }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots), renderCloseIcon()]), [[vue.vShow, props.show]]);
      });
      const renderTransition = () => {
        const {
          position,
          transition,
          transitionAppear
        } = props;
        const name2 = position === "center" ? "van-fade" : `van-popup-slide-${position}`;
        return vue.createVNode(vue.Transition, {
          "name": transition || name2,
          "appear": transitionAppear,
          "onAfterEnter": onOpened,
          "onAfterLeave": onClosed
        }, {
          default: renderPopup
        });
      };
      vue.watch(() => props.show, (show) => {
        if (show && !opened) {
          open();
          if (attrs.tabindex === 0) {
            vue.nextTick(() => {
              var _a;
              (_a = popupRef.value) == null ? void 0 : _a.focus();
            });
          }
        }
        if (!show && opened) {
          opened = false;
          emit("close");
        }
      });
      useExpose({
        popupRef
      });
      useLockScroll(popupRef, () => props.show && props.lockScroll);
      useEventListener("popstate", () => {
        if (props.closeOnPopstate) {
          close();
          shouldReopen = false;
        }
      });
      vue.onMounted(() => {
        if (props.show) {
          open();
        }
      });
      vue.onActivated(() => {
        if (shouldReopen) {
          emit("update:show", true);
          shouldReopen = false;
        }
      });
      vue.onDeactivated(() => {
        if (props.show && props.teleport) {
          close();
          shouldReopen = true;
        }
      });
      vue.provide(POPUP_TOGGLE_KEY, () => props.show);
      return () => {
        if (props.teleport) {
          return vue.createVNode(vue.Teleport, {
            "to": props.teleport
          }, {
            default: () => [renderOverlay(), renderTransition()]
          });
        }
        return vue.createVNode(vue.Fragment, null, [renderOverlay(), renderTransition()]);
      };
    }
  });
  const Popup = withInstall(stdin_default$1q);
  const [name$1l, bem$1h] = createNamespace("action-sheet");
  const actionSheetProps = extend({}, popupSharedProps, {
    title: String,
    round: truthProp,
    actions: makeArrayProp(),
    closeIcon: makeStringProp("cross"),
    closeable: truthProp,
    cancelText: String,
    description: String,
    closeOnPopstate: truthProp,
    closeOnClickAction: Boolean,
    safeAreaInsetBottom: truthProp
  });
  const popupInheritKeys$2 = [...popupSharedPropKeys, "round", "closeOnPopstate", "safeAreaInsetBottom"];
  var stdin_default$1p = vue.defineComponent({
    name: name$1l,
    props: actionSheetProps,
    emits: ["select", "cancel", "update:show"],
    setup(props, {
      slots,
      emit
    }) {
      const updateShow = (show) => emit("update:show", show);
      const onCancel = () => {
        updateShow(false);
        emit("cancel");
      };
      const renderHeader = () => {
        if (props.title) {
          return vue.createVNode("div", {
            "class": bem$1h("header")
          }, [props.title, props.closeable && vue.createVNode(Icon, {
            "name": props.closeIcon,
            "class": [bem$1h("close"), HAPTICS_FEEDBACK],
            "onClick": onCancel
          }, null)]);
        }
      };
      const renderCancel = () => {
        if (slots.cancel || props.cancelText) {
          return [vue.createVNode("div", {
            "class": bem$1h("gap")
          }, null), vue.createVNode("button", {
            "type": "button",
            "class": bem$1h("cancel"),
            "onClick": onCancel
          }, [slots.cancel ? slots.cancel() : props.cancelText])];
        }
      };
      const renderActionContent = (action, index) => {
        if (action.loading) {
          return vue.createVNode(Loading, {
            "class": bem$1h("loading-icon")
          }, null);
        }
        if (slots.action) {
          return slots.action({
            action,
            index
          });
        }
        return [vue.createVNode("span", {
          "class": bem$1h("name")
        }, [action.name]), action.subname && vue.createVNode("div", {
          "class": bem$1h("subname")
        }, [action.subname])];
      };
      const renderAction = (action, index) => {
        const {
          color,
          loading,
          callback,
          disabled,
          className
        } = action;
        const onClick = () => {
          if (disabled || loading) {
            return;
          }
          if (callback) {
            callback(action);
          }
          if (props.closeOnClickAction) {
            updateShow(false);
          }
          vue.nextTick(() => emit("select", action, index));
        };
        return vue.createVNode("button", {
          "type": "button",
          "style": {
            color
          },
          "class": [bem$1h("item", {
            loading,
            disabled
          }), className],
          "onClick": onClick
        }, [renderActionContent(action, index)]);
      };
      const renderDescription = () => {
        if (props.description || slots.description) {
          const content = slots.description ? slots.description() : props.description;
          return vue.createVNode("div", {
            "class": bem$1h("description")
          }, [content]);
        }
      };
      return () => vue.createVNode(Popup, vue.mergeProps({
        "class": bem$1h(),
        "position": "bottom",
        "onUpdate:show": updateShow
      }, pick(props, popupInheritKeys$2)), {
        default: () => {
          var _a;
          return [renderHeader(), renderDescription(), vue.createVNode("div", {
            "class": bem$1h("content")
          }, [props.actions.map(renderAction), (_a = slots.default) == null ? void 0 : _a.call(slots)]), renderCancel()];
        }
      });
    }
  });
  const ActionSheet = withInstall(stdin_default$1p);
  function deepClone(obj) {
    if (!isDef(obj)) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => deepClone(item));
    }
    if (isObject(obj)) {
      const to = {};
      Object.keys(obj).forEach((key) => {
        to[key] = deepClone(obj[key]);
      });
      return to;
    }
    return obj;
  }
  const DEFAULT_DURATION = 200;
  const MOMENTUM_LIMIT_TIME = 300;
  const MOMENTUM_LIMIT_DISTANCE = 15;
  const [name$1k, bem$1g] = createNamespace("picker-column");
  function getElementTranslateY(element) {
    const {
      transform
    } = window.getComputedStyle(element);
    const translateY = transform.slice(7, transform.length - 1).split(", ")[5];
    return Number(translateY);
  }
  const PICKER_KEY = Symbol(name$1k);
  const isOptionDisabled = (option) => isObject(option) && option.disabled;
  var stdin_default$1o = vue.defineComponent({
    name: name$1k,
    props: {
      textKey: makeRequiredProp(String),
      readonly: Boolean,
      allowHtml: Boolean,
      className: unknownProp,
      itemHeight: makeRequiredProp(Number),
      defaultIndex: makeNumberProp(0),
      swipeDuration: makeRequiredProp(numericProp),
      initialOptions: makeArrayProp(),
      visibleItemCount: makeRequiredProp(numericProp)
    },
    emits: ["change"],
    setup(props, {
      emit,
      slots
    }) {
      let moving;
      let startOffset;
      let touchStartTime;
      let momentumOffset;
      let transitionEndTrigger;
      const root = vue.ref();
      const wrapper = vue.ref();
      const state = vue.reactive({
        index: props.defaultIndex,
        offset: 0,
        duration: 0,
        options: deepClone(props.initialOptions)
      });
      const touch = useTouch();
      const count = () => state.options.length;
      const baseOffset = () => props.itemHeight * (+props.visibleItemCount - 1) / 2;
      const adjustIndex = (index) => {
        index = clamp(index, 0, count());
        for (let i2 = index; i2 < count(); i2++) {
          if (!isOptionDisabled(state.options[i2]))
            return i2;
        }
        for (let i2 = index - 1; i2 >= 0; i2--) {
          if (!isOptionDisabled(state.options[i2]))
            return i2;
        }
      };
      const setIndex = (index, emitChange) => {
        index = adjustIndex(index) || 0;
        const offset2 = -index * props.itemHeight;
        const trigger = () => {
          if (index !== state.index) {
            state.index = index;
            if (emitChange) {
              emit("change", index);
            }
          }
        };
        if (moving && offset2 !== state.offset) {
          transitionEndTrigger = trigger;
        } else {
          trigger();
        }
        state.offset = offset2;
      };
      const setOptions = (options) => {
        if (JSON.stringify(options) !== JSON.stringify(state.options)) {
          state.options = deepClone(options);
          setIndex(props.defaultIndex);
        }
      };
      const onClickItem = (index) => {
        if (moving || props.readonly) {
          return;
        }
        transitionEndTrigger = null;
        state.duration = DEFAULT_DURATION;
        setIndex(index, true);
      };
      const getOptionText = (option) => {
        if (isObject(option) && props.textKey in option) {
          return option[props.textKey];
        }
        return option;
      };
      const getIndexByOffset = (offset2) => clamp(Math.round(-offset2 / props.itemHeight), 0, count() - 1);
      const momentum = (distance, duration) => {
        const speed = Math.abs(distance / duration);
        distance = state.offset + speed / 3e-3 * (distance < 0 ? -1 : 1);
        const index = getIndexByOffset(distance);
        state.duration = +props.swipeDuration;
        setIndex(index, true);
      };
      const stopMomentum = () => {
        moving = false;
        state.duration = 0;
        if (transitionEndTrigger) {
          transitionEndTrigger();
          transitionEndTrigger = null;
        }
      };
      const onTouchStart = (event) => {
        if (props.readonly) {
          return;
        }
        touch.start(event);
        if (moving) {
          const translateY = getElementTranslateY(wrapper.value);
          state.offset = Math.min(0, translateY - baseOffset());
          startOffset = state.offset;
        } else {
          startOffset = state.offset;
        }
        state.duration = 0;
        touchStartTime = Date.now();
        momentumOffset = startOffset;
        transitionEndTrigger = null;
      };
      const onTouchMove = (event) => {
        if (props.readonly) {
          return;
        }
        touch.move(event);
        if (touch.isVertical()) {
          moving = true;
          preventDefault(event, true);
        }
        state.offset = clamp(startOffset + touch.deltaY.value, -(count() * props.itemHeight), props.itemHeight);
        const now = Date.now();
        if (now - touchStartTime > MOMENTUM_LIMIT_TIME) {
          touchStartTime = now;
          momentumOffset = state.offset;
        }
      };
      const onTouchEnd = () => {
        if (props.readonly) {
          return;
        }
        const distance = state.offset - momentumOffset;
        const duration = Date.now() - touchStartTime;
        const allowMomentum = duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;
        if (allowMomentum) {
          momentum(distance, duration);
          return;
        }
        const index = getIndexByOffset(state.offset);
        state.duration = DEFAULT_DURATION;
        setIndex(index, true);
        setTimeout(() => {
          moving = false;
        }, 0);
      };
      const renderOptions = () => {
        const optionStyle = {
          height: `${props.itemHeight}px`
        };
        return state.options.map((option, index) => {
          const text = getOptionText(option);
          const disabled = isOptionDisabled(option);
          const data = {
            role: "button",
            style: optionStyle,
            tabindex: disabled ? -1 : 0,
            class: bem$1g("item", {
              disabled,
              selected: index === state.index
            }),
            onClick: () => onClickItem(index)
          };
          const childData = {
            class: "van-ellipsis",
            [props.allowHtml ? "innerHTML" : "textContent"]: text
          };
          return vue.createVNode("li", data, [slots.option ? slots.option(option) : vue.createVNode("div", childData, null)]);
        });
      };
      const setValue = (value) => {
        const {
          options
        } = state;
        for (let i2 = 0; i2 < options.length; i2++) {
          if (getOptionText(options[i2]) === value) {
            return setIndex(i2);
          }
        }
      };
      const getValue = () => state.options[state.index];
      const hasOptions = () => state.options.length;
      setIndex(state.index);
      useParent(PICKER_KEY);
      useExpose({
        state,
        setIndex,
        getValue,
        setValue,
        setOptions,
        hasOptions,
        stopMomentum
      });
      vue.watch(() => props.initialOptions, setOptions);
      vue.watch(() => props.defaultIndex, (value) => setIndex(value));
      useEventListener("touchmove", onTouchMove, {
        target: root
      });
      return () => vue.createVNode("div", {
        "ref": root,
        "class": [bem$1g(), props.className],
        "onTouchstartPassive": onTouchStart,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [vue.createVNode("ul", {
        "ref": wrapper,
        "style": {
          transform: `translate3d(0, ${state.offset + baseOffset()}px, 0)`,
          transitionDuration: `${state.duration}ms`,
          transitionProperty: state.duration ? "all" : "none"
        },
        "class": bem$1g("wrapper"),
        "onTransitionend": stopMomentum
      }, [renderOptions()])]);
    }
  });
  const [name$1j, bem$1f, t$j] = createNamespace("picker");
  const pickerSharedProps = {
    title: String,
    loading: Boolean,
    readonly: Boolean,
    allowHtml: Boolean,
    itemHeight: makeNumericProp(44),
    showToolbar: truthProp,
    swipeDuration: makeNumericProp(1e3),
    visibleItemCount: makeNumericProp(6),
    cancelButtonText: String,
    confirmButtonText: String
  };
  const pickerProps = extend({}, pickerSharedProps, {
    columns: makeArrayProp(),
    valueKey: String,
    defaultIndex: makeNumericProp(0),
    toolbarPosition: makeStringProp("top"),
    columnsFieldNames: Object
  });
  var stdin_default$1n = vue.defineComponent({
    name: name$1j,
    props: pickerProps,
    emits: ["confirm", "cancel", "change"],
    setup(props, {
      emit,
      slots
    }) {
      {
        if (slots.default) {
          formatAppLog("warn", "at node_modules/vant/es/picker/Picker.mjs:38", '[Vant] Picker: "default" slot is deprecated, please use "toolbar" slot instead.');
        }
        if (props.valueKey) {
          formatAppLog("warn", "at node_modules/vant/es/picker/Picker.mjs:41", '[Vant] Picker: "valueKey" prop is deprecated, please use "columnsFieldNames" prop instead.');
        }
      }
      const hasOptions = vue.ref(false);
      const columnsRef = vue.ref();
      const formattedColumns = vue.ref([]);
      const columnsFieldNames = vue.computed(() => {
        const {
          columnsFieldNames: columnsFieldNames2
        } = props;
        return {
          text: (columnsFieldNames2 == null ? void 0 : columnsFieldNames2.text) || props.valueKey || "text",
          values: (columnsFieldNames2 == null ? void 0 : columnsFieldNames2.values) || "values",
          children: (columnsFieldNames2 == null ? void 0 : columnsFieldNames2.children) || "children"
        };
      });
      const {
        children,
        linkChildren
      } = useChildren(PICKER_KEY);
      linkChildren();
      const itemHeight = vue.computed(() => unitToPx(props.itemHeight));
      const dataType = vue.computed(() => {
        const firstColumn = props.columns[0];
        if (typeof firstColumn === "object") {
          if (columnsFieldNames.value.children in firstColumn) {
            return "cascade";
          }
          if (columnsFieldNames.value.values in firstColumn) {
            return "object";
          }
        }
        return "plain";
      });
      const formatCascade = () => {
        var _a;
        const formatted = [];
        let cursor = {
          [columnsFieldNames.value.children]: props.columns
        };
        while (cursor && cursor[columnsFieldNames.value.children]) {
          const children2 = cursor[columnsFieldNames.value.children];
          let defaultIndex = (_a = cursor.defaultIndex) != null ? _a : +props.defaultIndex;
          while (children2[defaultIndex] && children2[defaultIndex].disabled) {
            if (defaultIndex < children2.length - 1) {
              defaultIndex++;
            } else {
              defaultIndex = 0;
              break;
            }
          }
          formatted.push({
            [columnsFieldNames.value.values]: cursor[columnsFieldNames.value.children],
            className: cursor.className,
            defaultIndex
          });
          cursor = children2[defaultIndex];
        }
        formattedColumns.value = formatted;
      };
      const format2 = () => {
        const {
          columns
        } = props;
        if (dataType.value === "plain") {
          formattedColumns.value = [{
            [columnsFieldNames.value.values]: columns
          }];
        } else if (dataType.value === "cascade") {
          formatCascade();
        } else {
          formattedColumns.value = columns;
        }
        hasOptions.value = formattedColumns.value.some((item) => item[columnsFieldNames.value.values] && item[columnsFieldNames.value.values].length !== 0) || children.some((item) => item.hasOptions);
      };
      const getIndexes = () => children.map((child) => child.state.index);
      const setColumnValues = (index, options) => {
        const column = children[index];
        if (column) {
          column.setOptions(options);
          hasOptions.value = true;
        }
      };
      const onCascadeChange = (columnIndex) => {
        let cursor = {
          [columnsFieldNames.value.children]: props.columns
        };
        const indexes = getIndexes();
        for (let i2 = 0; i2 <= columnIndex; i2++) {
          cursor = cursor[columnsFieldNames.value.children][indexes[i2]];
        }
        while (cursor && cursor[columnsFieldNames.value.children]) {
          columnIndex++;
          setColumnValues(columnIndex, cursor[columnsFieldNames.value.children]);
          cursor = cursor[columnsFieldNames.value.children][cursor.defaultIndex || 0];
        }
      };
      const getChild = (index) => children[index];
      const getColumnValue = (index) => {
        const column = getChild(index);
        if (column) {
          return column.getValue();
        }
      };
      const setColumnValue = (index, value) => {
        const column = getChild(index);
        if (column) {
          column.setValue(value);
          if (dataType.value === "cascade") {
            onCascadeChange(index);
          }
        }
      };
      const getColumnIndex = (index) => {
        const column = getChild(index);
        if (column) {
          return column.state.index;
        }
      };
      const setColumnIndex = (columnIndex, optionIndex) => {
        const column = getChild(columnIndex);
        if (column) {
          column.setIndex(optionIndex);
          if (dataType.value === "cascade") {
            onCascadeChange(columnIndex);
          }
        }
      };
      const getColumnValues = (index) => {
        const column = getChild(index);
        if (column) {
          return column.state.options;
        }
      };
      const getValues = () => children.map((child) => child.getValue());
      const setValues = (values) => {
        values.forEach((value, index) => {
          setColumnValue(index, value);
        });
      };
      const setIndexes = (indexes) => {
        indexes.forEach((optionIndex, columnIndex) => {
          setColumnIndex(columnIndex, optionIndex);
        });
      };
      const emitAction = (event) => {
        if (dataType.value === "plain") {
          emit(event, getColumnValue(0), getColumnIndex(0));
        } else {
          emit(event, getValues(), getIndexes());
        }
      };
      const onChange = (columnIndex) => {
        if (dataType.value === "cascade") {
          onCascadeChange(columnIndex);
        }
        if (dataType.value === "plain") {
          emit("change", getColumnValue(0), getColumnIndex(0));
        } else {
          emit("change", getValues(), columnIndex);
        }
      };
      const confirm = () => {
        children.forEach((child) => child.stopMomentum());
        emitAction("confirm");
      };
      const cancel = () => emitAction("cancel");
      const renderTitle = () => {
        if (slots.title) {
          return slots.title();
        }
        if (props.title) {
          return vue.createVNode("div", {
            "class": [bem$1f("title"), "van-ellipsis"]
          }, [props.title]);
        }
      };
      const renderCancel = () => {
        const text = props.cancelButtonText || t$j("cancel");
        return vue.createVNode("button", {
          "type": "button",
          "class": [bem$1f("cancel"), HAPTICS_FEEDBACK],
          "onClick": cancel
        }, [slots.cancel ? slots.cancel() : text]);
      };
      const renderConfirm = () => {
        const text = props.confirmButtonText || t$j("confirm");
        return vue.createVNode("button", {
          "type": "button",
          "class": [bem$1f("confirm"), HAPTICS_FEEDBACK],
          "onClick": confirm
        }, [slots.confirm ? slots.confirm() : text]);
      };
      const renderToolbar = () => {
        if (props.showToolbar) {
          const slot = slots.toolbar || slots.default;
          return vue.createVNode("div", {
            "class": bem$1f("toolbar")
          }, [slot ? slot() : [renderCancel(), renderTitle(), renderConfirm()]]);
        }
      };
      const renderColumnItems = () => formattedColumns.value.map((item, columnIndex) => {
        var _a;
        return vue.createVNode(stdin_default$1o, {
          "textKey": columnsFieldNames.value.text,
          "readonly": props.readonly,
          "allowHtml": props.allowHtml,
          "className": item.className,
          "itemHeight": itemHeight.value,
          "defaultIndex": (_a = item.defaultIndex) != null ? _a : +props.defaultIndex,
          "swipeDuration": props.swipeDuration,
          "initialOptions": item[columnsFieldNames.value.values],
          "visibleItemCount": props.visibleItemCount,
          "onChange": () => onChange(columnIndex)
        }, {
          option: slots.option
        });
      });
      const renderMask = (wrapHeight) => {
        if (hasOptions.value) {
          const frameStyle = {
            height: `${itemHeight.value}px`
          };
          const maskStyle = {
            backgroundSize: `100% ${(wrapHeight - itemHeight.value) / 2}px`
          };
          return [vue.createVNode("div", {
            "class": bem$1f("mask"),
            "style": maskStyle
          }, null), vue.createVNode("div", {
            "class": [BORDER_UNSET_TOP_BOTTOM, bem$1f("frame")],
            "style": frameStyle
          }, null)];
        }
      };
      const renderColumns = () => {
        const wrapHeight = itemHeight.value * +props.visibleItemCount;
        const columnsStyle = {
          height: `${wrapHeight}px`
        };
        return vue.createVNode("div", {
          "ref": columnsRef,
          "class": bem$1f("columns"),
          "style": columnsStyle
        }, [renderColumnItems(), renderMask(wrapHeight)]);
      };
      vue.watch(() => props.columns, format2, {
        immediate: true
      });
      useEventListener("touchmove", preventDefault, {
        target: columnsRef
      });
      useExpose({
        confirm,
        getValues,
        setValues,
        getIndexes,
        setIndexes,
        getColumnIndex,
        setColumnIndex,
        getColumnValue,
        setColumnValue,
        getColumnValues,
        setColumnValues
      });
      return () => {
        var _a, _b;
        return vue.createVNode("div", {
          "class": bem$1f()
        }, [props.toolbarPosition === "top" ? renderToolbar() : null, props.loading ? vue.createVNode(Loading, {
          "class": bem$1f("loading")
        }, null) : null, (_a = slots["columns-top"]) == null ? void 0 : _a.call(slots), renderColumns(), (_b = slots["columns-bottom"]) == null ? void 0 : _b.call(slots), props.toolbarPosition === "bottom" ? renderToolbar() : null]);
      };
    }
  });
  const Picker = withInstall(stdin_default$1n);
  const [name$1i, bem$1e] = createNamespace("area");
  const EMPTY_CODE = "000000";
  const INHERIT_SLOTS = ["title", "cancel", "confirm", "toolbar", "columns-top", "columns-bottom"];
  const INHERIT_PROPS = ["title", "loading", "readonly", "itemHeight", "swipeDuration", "visibleItemCount", "cancelButtonText", "confirmButtonText"];
  const isOverseaCode = (code) => code[0] === "9";
  const areaProps = extend({}, pickerSharedProps, {
    value: String,
    columnsNum: makeNumericProp(3),
    columnsPlaceholder: makeArrayProp(),
    areaList: {
      type: Object,
      default: () => ({})
    },
    isOverseaCode: {
      type: Function,
      default: isOverseaCode
    }
  });
  var stdin_default$1m = vue.defineComponent({
    name: name$1i,
    props: areaProps,
    emits: ["change", "confirm", "cancel"],
    setup(props, {
      emit,
      slots
    }) {
      const pickerRef = vue.ref();
      const state = vue.reactive({
        code: props.value,
        columns: [{
          values: []
        }, {
          values: []
        }, {
          values: []
        }]
      });
      const areaList = vue.computed(() => {
        const {
          areaList: areaList2
        } = props;
        return {
          province: areaList2.province_list || {},
          city: areaList2.city_list || {},
          county: areaList2.county_list || {}
        };
      });
      const placeholderMap = vue.computed(() => {
        const {
          columnsPlaceholder
        } = props;
        return {
          province: columnsPlaceholder[0] || "",
          city: columnsPlaceholder[1] || "",
          county: columnsPlaceholder[2] || ""
        };
      });
      const getDefaultCode = () => {
        if (props.columnsPlaceholder.length) {
          return EMPTY_CODE;
        }
        const {
          county,
          city
        } = areaList.value;
        const countyCodes = Object.keys(county);
        if (countyCodes[0]) {
          return countyCodes[0];
        }
        const cityCodes = Object.keys(city);
        if (cityCodes[0]) {
          return cityCodes[0];
        }
        return "";
      };
      const getColumnValues = (type, code) => {
        let column = [];
        if (type !== "province" && !code) {
          return column;
        }
        const list = areaList.value[type];
        column = Object.keys(list).map((listCode) => ({
          code: listCode,
          name: list[listCode]
        }));
        if (code) {
          if (type === "city" && props.isOverseaCode(code)) {
            code = "9";
          }
          column = column.filter((item) => item.code.indexOf(code) === 0);
        }
        if (placeholderMap.value[type] && column.length) {
          let codeFill = "";
          if (type === "city") {
            codeFill = EMPTY_CODE.slice(2, 4);
          } else if (type === "county") {
            codeFill = EMPTY_CODE.slice(4, 6);
          }
          column.unshift({
            code: code + codeFill,
            name: placeholderMap.value[type]
          });
        }
        return column;
      };
      const getIndex = (type, code) => {
        let compareNum = code.length;
        if (type === "province") {
          compareNum = props.isOverseaCode(code) ? 1 : 2;
        }
        if (type === "city") {
          compareNum = 4;
        }
        code = code.slice(0, compareNum);
        const list = getColumnValues(type, compareNum > 2 ? code.slice(0, compareNum - 2) : "");
        for (let i2 = 0; i2 < list.length; i2++) {
          if (list[i2].code.slice(0, compareNum) === code) {
            return i2;
          }
        }
        return 0;
      };
      const setValues = () => {
        const picker = pickerRef.value;
        if (!picker) {
          return;
        }
        let code = state.code || getDefaultCode();
        const province = getColumnValues("province");
        const city = getColumnValues("city", code.slice(0, 2));
        picker.setColumnValues(0, province);
        picker.setColumnValues(1, city);
        if (city.length && code.slice(2, 4) === "00" && !props.isOverseaCode(code)) {
          [{
            code
          }] = city;
        }
        picker.setColumnValues(2, getColumnValues("county", code.slice(0, 4)));
        picker.setIndexes([getIndex("province", code), getIndex("city", code), getIndex("county", code)]);
      };
      const parseValues = (values) => values.map((value, index) => {
        if (value) {
          value = deepClone(value);
          if (!value.code || value.name === props.columnsPlaceholder[index]) {
            value.code = "";
            value.name = "";
          }
        }
        return value;
      });
      const getValues = () => {
        if (pickerRef.value) {
          const values = pickerRef.value.getValues().filter(Boolean);
          return parseValues(values);
        }
        return [];
      };
      const getArea = () => {
        const values = getValues();
        const area = {
          code: "",
          country: "",
          province: "",
          city: "",
          county: ""
        };
        if (!values.length) {
          return area;
        }
        const names = values.map((item) => item.name);
        const validValues = values.filter((value) => value.code);
        area.code = validValues.length ? validValues[validValues.length - 1].code : "";
        if (props.isOverseaCode(area.code)) {
          area.country = names[1] || "";
          area.province = names[2] || "";
        } else {
          area.province = names[0] || "";
          area.city = names[1] || "";
          area.county = names[2] || "";
        }
        return area;
      };
      const reset = (newCode = "") => {
        state.code = newCode;
        setValues();
      };
      const onChange = (values, index) => {
        state.code = values[index].code;
        setValues();
        if (pickerRef.value) {
          const parsedValues = parseValues(pickerRef.value.getValues());
          emit("change", parsedValues, index);
        }
      };
      const onConfirm = (values, index) => {
        setValues();
        emit("confirm", parseValues(values), index);
      };
      const onCancel = (...args) => emit("cancel", ...args);
      vue.onMounted(setValues);
      vue.watch(() => props.value, (value) => {
        state.code = value;
        setValues();
      });
      vue.watch(() => props.areaList, setValues, {
        deep: true
      });
      vue.watch(() => props.columnsNum, () => {
        vue.nextTick(setValues);
      });
      useExpose({
        reset,
        getArea,
        getValues
      });
      return () => {
        const columns = state.columns.slice(0, +props.columnsNum);
        return vue.createVNode(Picker, vue.mergeProps({
          "ref": pickerRef,
          "class": bem$1e(),
          "columns": columns,
          "columnsFieldNames": {
            text: "name"
          },
          "onChange": onChange,
          "onCancel": onCancel,
          "onConfirm": onConfirm
        }, pick(props, INHERIT_PROPS)), pick(slots, INHERIT_SLOTS));
      };
    }
  });
  const Area = withInstall(stdin_default$1m);
  const [name$1h, bem$1d] = createNamespace("cell");
  const cellSharedProps = {
    icon: String,
    size: String,
    title: numericProp,
    value: numericProp,
    label: numericProp,
    center: Boolean,
    isLink: Boolean,
    border: truthProp,
    required: Boolean,
    iconPrefix: String,
    valueClass: unknownProp,
    labelClass: unknownProp,
    titleClass: unknownProp,
    titleStyle: null,
    arrowDirection: String,
    clickable: {
      type: Boolean,
      default: null
    }
  };
  const cellProps = extend({}, cellSharedProps, routeProps);
  var stdin_default$1l = vue.defineComponent({
    name: name$1h,
    props: cellProps,
    setup(props, {
      slots
    }) {
      const route2 = useRoute();
      const renderLabel = () => {
        const showLabel = slots.label || isDef(props.label);
        if (showLabel) {
          return vue.createVNode("div", {
            "class": [bem$1d("label"), props.labelClass]
          }, [slots.label ? slots.label() : props.label]);
        }
      };
      const renderTitle = () => {
        if (slots.title || isDef(props.title)) {
          return vue.createVNode("div", {
            "class": [bem$1d("title"), props.titleClass],
            "style": props.titleStyle
          }, [slots.title ? slots.title() : vue.createVNode("span", null, [props.title]), renderLabel()]);
        }
      };
      const renderValue = () => {
        const slot = slots.value || slots.default;
        const hasValue = slot || isDef(props.value);
        if (hasValue) {
          const hasTitle = slots.title || isDef(props.title);
          return vue.createVNode("div", {
            "class": [bem$1d("value", {
              alone: !hasTitle
            }), props.valueClass]
          }, [slot ? slot() : vue.createVNode("span", null, [props.value])]);
        }
      };
      const renderLeftIcon = () => {
        if (slots.icon) {
          return slots.icon();
        }
        if (props.icon) {
          return vue.createVNode(Icon, {
            "name": props.icon,
            "class": bem$1d("left-icon"),
            "classPrefix": props.iconPrefix
          }, null);
        }
      };
      const renderRightIcon = () => {
        if (slots["right-icon"]) {
          return slots["right-icon"]();
        }
        if (props.isLink) {
          const name2 = props.arrowDirection ? `arrow-${props.arrowDirection}` : "arrow";
          return vue.createVNode(Icon, {
            "name": name2,
            "class": bem$1d("right-icon")
          }, null);
        }
      };
      return () => {
        var _a, _b;
        const {
          size,
          center,
          border,
          isLink,
          required
        } = props;
        const clickable = (_a = props.clickable) != null ? _a : isLink;
        const classes = {
          center,
          required,
          clickable,
          borderless: !border
        };
        if (size) {
          classes[size] = !!size;
        }
        return vue.createVNode("div", {
          "class": bem$1d(classes),
          "role": clickable ? "button" : void 0,
          "tabindex": clickable ? 0 : void 0,
          "onClick": route2
        }, [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), (_b = slots.extra) == null ? void 0 : _b.call(slots)]);
      };
    }
  });
  const Cell = withInstall(stdin_default$1l);
  const [name$1g, bem$1c] = createNamespace("form");
  const formProps = {
    colon: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    showError: Boolean,
    labelWidth: numericProp,
    labelAlign: String,
    inputAlign: String,
    scrollToError: Boolean,
    validateFirst: Boolean,
    submitOnEnter: truthProp,
    showErrorMessage: truthProp,
    errorMessageAlign: String,
    validateTrigger: {
      type: [String, Array],
      default: "onBlur"
    }
  };
  var stdin_default$1k = vue.defineComponent({
    name: name$1g,
    props: formProps,
    emits: ["submit", "failed"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        children,
        linkChildren
      } = useChildren(FORM_KEY);
      const getFieldsByNames = (names) => {
        if (names) {
          return children.filter((field) => names.includes(field.name));
        }
        return children;
      };
      const validateSeq = (names) => new Promise((resolve, reject) => {
        const errors = [];
        const fields = getFieldsByNames(names);
        fields.reduce((promise, field) => promise.then(() => {
          if (!errors.length) {
            return field.validate().then((error) => {
              if (error) {
                errors.push(error);
              }
            });
          }
        }), Promise.resolve()).then(() => {
          if (errors.length) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
      const validateAll = (names) => new Promise((resolve, reject) => {
        const fields = getFieldsByNames(names);
        Promise.all(fields.map((item) => item.validate())).then((errors) => {
          errors = errors.filter(Boolean);
          if (errors.length) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
      const validateField = (name2) => {
        const matched = children.find((item) => item.name === name2);
        if (matched) {
          return new Promise((resolve, reject) => {
            matched.validate().then((error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        }
        return Promise.reject();
      };
      const validate = (name2) => {
        if (typeof name2 === "string") {
          return validateField(name2);
        }
        return props.validateFirst ? validateSeq(name2) : validateAll(name2);
      };
      const resetValidation = (name2) => {
        if (typeof name2 === "string") {
          name2 = [name2];
        }
        const fields = getFieldsByNames(name2);
        fields.forEach((item) => {
          item.resetValidation();
        });
      };
      const getValidationStatus = () => children.reduce((form, field) => {
        form[field.name] = field.getValidationStatus();
        return form;
      }, {});
      const scrollToField = (name2, options) => {
        children.some((item) => {
          if (item.name === name2) {
            item.$el.scrollIntoView(options);
            return true;
          }
          return false;
        });
      };
      const getValues = () => children.reduce((form, field) => {
        form[field.name] = field.formValue.value;
        return form;
      }, {});
      const submit = () => {
        const values = getValues();
        validate().then(() => emit("submit", values)).catch((errors) => {
          emit("failed", {
            values,
            errors
          });
          if (props.scrollToError && errors[0].name) {
            scrollToField(errors[0].name);
          }
        });
      };
      const onSubmit = (event) => {
        preventDefault(event);
        submit();
      };
      linkChildren({
        props
      });
      useExpose({
        submit,
        validate,
        getValues,
        scrollToField,
        resetValidation,
        getValidationStatus
      });
      return () => {
        var _a;
        return vue.createVNode("form", {
          "class": bem$1c(),
          "onSubmit": onSubmit
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Form = withInstall(stdin_default$1k);
  function isEmptyValue(value) {
    if (Array.isArray(value)) {
      return !value.length;
    }
    if (value === 0) {
      return false;
    }
    return !value;
  }
  function runSyncRule(value, rule) {
    if (isEmptyValue(value)) {
      if (rule.required) {
        return false;
      }
      if (rule.validateEmpty === false) {
        return true;
      }
    }
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return false;
    }
    return true;
  }
  function runRuleValidator(value, rule) {
    return new Promise((resolve) => {
      const returnVal = rule.validator(value, rule);
      if (isPromise(returnVal)) {
        returnVal.then(resolve);
        return;
      }
      resolve(returnVal);
    });
  }
  function getRuleMessage(value, rule) {
    const { message } = rule;
    if (isFunction(message)) {
      return message(value, rule);
    }
    return message || "";
  }
  function startComposing({ target }) {
    target.composing = true;
  }
  function endComposing({ target }) {
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  function resizeTextarea(input, autosize) {
    const scrollTop = getRootScrollTop();
    input.style.height = "auto";
    let height2 = input.scrollHeight;
    if (isObject(autosize)) {
      const { maxHeight, minHeight } = autosize;
      if (maxHeight !== void 0) {
        height2 = Math.min(height2, maxHeight);
      }
      if (minHeight !== void 0) {
        height2 = Math.max(height2, minHeight);
      }
    }
    if (height2) {
      input.style.height = `${height2}px`;
      setRootScrollTop(scrollTop);
    }
  }
  function mapInputType(type) {
    if (type === "number") {
      return {
        type: "text",
        inputmode: "decimal"
      };
    }
    if (type === "digit") {
      return {
        type: "tel",
        inputmode: "numeric"
      };
    }
    return { type };
  }
  function getStringLength(str) {
    return [...str].length;
  }
  function cutString(str, maxlength) {
    return [...str].slice(0, maxlength).join("");
  }
  let current = 0;
  function useId() {
    const vm = vue.getCurrentInstance();
    const { name: name2 = "unknown" } = (vm == null ? void 0 : vm.type) || {};
    return `${name2}-${++current}`;
  }
  const [name$1f, bem$1b] = createNamespace("field");
  const fieldSharedProps = {
    id: String,
    name: String,
    leftIcon: String,
    rightIcon: String,
    autofocus: Boolean,
    clearable: Boolean,
    maxlength: numericProp,
    formatter: Function,
    clearIcon: makeStringProp("clear"),
    modelValue: makeNumericProp(""),
    inputAlign: String,
    placeholder: String,
    autocomplete: String,
    errorMessage: String,
    enterkeyhint: String,
    clearTrigger: makeStringProp("focus"),
    formatTrigger: makeStringProp("onChange"),
    error: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: null
    },
    readonly: {
      type: Boolean,
      default: null
    }
  };
  const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
    rows: numericProp,
    type: makeStringProp("text"),
    rules: Array,
    autosize: [Boolean, Object],
    labelWidth: numericProp,
    labelClass: unknownProp,
    labelAlign: String,
    showWordLimit: Boolean,
    errorMessageAlign: String,
    colon: {
      type: Boolean,
      default: null
    }
  });
  var stdin_default$1j = vue.defineComponent({
    name: name$1f,
    props: fieldProps,
    emits: ["blur", "focus", "clear", "keypress", "click-input", "end-validate", "start-validate", "click-left-icon", "click-right-icon", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const id = useId();
      const state = vue.reactive({
        status: "unvalidated",
        focused: false,
        validateMessage: ""
      });
      const inputRef = vue.ref();
      const clearIconRef = vue.ref();
      const customValue = vue.ref();
      const {
        parent: form
      } = useParent(FORM_KEY);
      const getModelValue = () => {
        var _a;
        return String((_a = props.modelValue) != null ? _a : "");
      };
      const getProp = (key) => {
        if (isDef(props[key])) {
          return props[key];
        }
        if (form && isDef(form.props[key])) {
          return form.props[key];
        }
      };
      const showClear = vue.computed(() => {
        const readonly = getProp("readonly");
        if (props.clearable && !readonly) {
          const hasValue = getModelValue() !== "";
          const trigger = props.clearTrigger === "always" || props.clearTrigger === "focus" && state.focused;
          return hasValue && trigger;
        }
        return false;
      });
      const formValue = vue.computed(() => {
        if (customValue.value && slots.input) {
          return customValue.value();
        }
        return props.modelValue;
      });
      const runRules = (rules) => rules.reduce((promise, rule) => promise.then(() => {
        if (state.status === "failed") {
          return;
        }
        let {
          value
        } = formValue;
        if (rule.formatter) {
          value = rule.formatter(value, rule);
        }
        if (!runSyncRule(value, rule)) {
          state.status = "failed";
          state.validateMessage = getRuleMessage(value, rule);
          return;
        }
        if (rule.validator) {
          if (isEmptyValue(value) && rule.validateEmpty === false) {
            return;
          }
          return runRuleValidator(value, rule).then((result) => {
            if (result && typeof result === "string") {
              state.status = "failed";
              state.validateMessage = result;
            } else if (result === false) {
              state.status = "failed";
              state.validateMessage = getRuleMessage(value, rule);
            }
          });
        }
      }), Promise.resolve());
      const resetValidation = () => {
        state.status = "unvalidated";
        state.validateMessage = "";
      };
      const endValidate = () => emit("end-validate", {
        status: state.status
      });
      const validate = (rules = props.rules) => new Promise((resolve) => {
        resetValidation();
        if (rules) {
          emit("start-validate");
          runRules(rules).then(() => {
            if (state.status === "failed") {
              resolve({
                name: props.name,
                message: state.validateMessage
              });
              endValidate();
            } else {
              state.status = "passed";
              resolve();
              endValidate();
            }
          });
        } else {
          resolve();
        }
      });
      const validateWithTrigger = (trigger) => {
        if (form && props.rules) {
          const {
            validateTrigger
          } = form.props;
          const defaultTrigger = toArray(validateTrigger).includes(trigger);
          const rules = props.rules.filter((rule) => {
            if (rule.trigger) {
              return toArray(rule.trigger).includes(trigger);
            }
            return defaultTrigger;
          });
          if (rules.length) {
            validate(rules);
          }
        }
      };
      const limitValueLength = (value) => {
        const {
          maxlength
        } = props;
        if (isDef(maxlength) && getStringLength(value) > maxlength) {
          const modelValue = getModelValue();
          if (modelValue && getStringLength(modelValue) === +maxlength) {
            return modelValue;
          }
          return cutString(value, +maxlength);
        }
        return value;
      };
      const updateValue = (value, trigger = "onChange") => {
        value = limitValueLength(value);
        if (props.type === "number" || props.type === "digit") {
          const isNumber = props.type === "number";
          value = formatNumber(value, isNumber, isNumber);
        }
        if (props.formatter && trigger === props.formatTrigger) {
          value = props.formatter(value);
        }
        if (inputRef.value && inputRef.value.value !== value) {
          inputRef.value.value = value;
        }
        if (value !== props.modelValue) {
          emit("update:modelValue", value);
        }
      };
      const onInput = (event) => {
        if (!event.target.composing) {
          updateValue(event.target.value);
        }
      };
      const blur = () => {
        var _a;
        return (_a = inputRef.value) == null ? void 0 : _a.blur();
      };
      const focus = () => {
        var _a;
        return (_a = inputRef.value) == null ? void 0 : _a.focus();
      };
      const adjustTextareaSize = () => {
        const input = inputRef.value;
        if (props.type === "textarea" && props.autosize && input) {
          resizeTextarea(input, props.autosize);
        }
      };
      const onFocus = (event) => {
        state.focused = true;
        emit("focus", event);
        vue.nextTick(adjustTextareaSize);
        if (getProp("readonly")) {
          blur();
        }
      };
      const onBlur = (event) => {
        if (getProp("readonly")) {
          return;
        }
        state.focused = false;
        updateValue(getModelValue(), "onBlur");
        emit("blur", event);
        validateWithTrigger("onBlur");
        vue.nextTick(adjustTextareaSize);
        resetScroll();
      };
      const onClickInput = (event) => emit("click-input", event);
      const onClickLeftIcon = (event) => emit("click-left-icon", event);
      const onClickRightIcon = (event) => emit("click-right-icon", event);
      const onClear = (event) => {
        preventDefault(event);
        emit("update:modelValue", "");
        emit("clear", event);
      };
      const showError = vue.computed(() => {
        if (typeof props.error === "boolean") {
          return props.error;
        }
        if (form && form.props.showError && state.status === "failed") {
          return true;
        }
      });
      const labelStyle = vue.computed(() => {
        const labelWidth = getProp("labelWidth");
        if (labelWidth) {
          return {
            width: addUnit(labelWidth)
          };
        }
      });
      const onKeypress = (event) => {
        const ENTER_CODE = 13;
        if (event.keyCode === ENTER_CODE) {
          const submitOnEnter = form && form.props.submitOnEnter;
          if (!submitOnEnter && props.type !== "textarea") {
            preventDefault(event);
          }
          if (props.type === "search") {
            blur();
          }
        }
        emit("keypress", event);
      };
      const getInputId = () => props.id || `${id}-input`;
      const getValidationStatus = () => state.status;
      const renderInput = () => {
        const controlClass = bem$1b("control", [getProp("inputAlign"), {
          error: showError.value,
          custom: !!slots.input,
          "min-height": props.type === "textarea" && !props.autosize
        }]);
        if (slots.input) {
          return vue.createVNode("div", {
            "class": controlClass,
            "onClick": onClickInput
          }, [slots.input()]);
        }
        const inputAttrs = {
          id: getInputId(),
          ref: inputRef,
          name: props.name,
          rows: props.rows !== void 0 ? +props.rows : void 0,
          class: controlClass,
          disabled: getProp("disabled"),
          readonly: getProp("readonly"),
          autofocus: props.autofocus,
          placeholder: props.placeholder,
          autocomplete: props.autocomplete,
          enterkeyhint: props.enterkeyhint,
          "aria-labelledby": props.label ? `${id}-label` : void 0,
          onBlur,
          onFocus,
          onInput,
          onClick: onClickInput,
          onChange: endComposing,
          onKeypress,
          onCompositionend: endComposing,
          onCompositionstart: startComposing
        };
        if (props.type === "textarea") {
          return vue.createVNode("textarea", inputAttrs, null);
        }
        return vue.createVNode("input", vue.mergeProps(mapInputType(props.type), inputAttrs), null);
      };
      const renderLeftIcon = () => {
        const leftIconSlot = slots["left-icon"];
        if (props.leftIcon || leftIconSlot) {
          return vue.createVNode("div", {
            "class": bem$1b("left-icon"),
            "onClick": onClickLeftIcon
          }, [leftIconSlot ? leftIconSlot() : vue.createVNode(Icon, {
            "name": props.leftIcon,
            "classPrefix": props.iconPrefix
          }, null)]);
        }
      };
      const renderRightIcon = () => {
        const rightIconSlot = slots["right-icon"];
        if (props.rightIcon || rightIconSlot) {
          return vue.createVNode("div", {
            "class": bem$1b("right-icon"),
            "onClick": onClickRightIcon
          }, [rightIconSlot ? rightIconSlot() : vue.createVNode(Icon, {
            "name": props.rightIcon,
            "classPrefix": props.iconPrefix
          }, null)]);
        }
      };
      const renderWordLimit = () => {
        if (props.showWordLimit && props.maxlength) {
          const count = getStringLength(getModelValue());
          return vue.createVNode("div", {
            "class": bem$1b("word-limit")
          }, [vue.createVNode("span", {
            "class": bem$1b("word-num")
          }, [count]), vue.createTextVNode("/"), props.maxlength]);
        }
      };
      const renderMessage = () => {
        if (form && form.props.showErrorMessage === false) {
          return;
        }
        const message = props.errorMessage || state.validateMessage;
        if (message) {
          const slot = slots["error-message"];
          const errorMessageAlign = getProp("errorMessageAlign");
          return vue.createVNode("div", {
            "class": bem$1b("error-message", errorMessageAlign)
          }, [slot ? slot({
            message
          }) : message]);
        }
      };
      const renderLabel = () => {
        const colon = getProp("colon") ? ":" : "";
        if (slots.label) {
          return [slots.label(), colon];
        }
        if (props.label) {
          return vue.createVNode("label", {
            "id": `${id}-label`,
            "for": getInputId()
          }, [props.label + colon]);
        }
      };
      const renderFieldBody = () => [vue.createVNode("div", {
        "class": bem$1b("body")
      }, [renderInput(), showClear.value && vue.createVNode(Icon, {
        "ref": clearIconRef,
        "name": props.clearIcon,
        "class": bem$1b("clear")
      }, null), renderRightIcon(), slots.button && vue.createVNode("div", {
        "class": bem$1b("button")
      }, [slots.button()])]), renderWordLimit(), renderMessage()];
      useExpose({
        blur,
        focus,
        validate,
        formValue,
        resetValidation,
        getValidationStatus
      });
      vue.provide(CUSTOM_FIELD_INJECTION_KEY, {
        customValue,
        resetValidation,
        validateWithTrigger
      });
      vue.watch(() => props.modelValue, () => {
        updateValue(getModelValue());
        resetValidation();
        validateWithTrigger("onChange");
        vue.nextTick(adjustTextareaSize);
      });
      vue.onMounted(() => {
        updateValue(getModelValue(), props.formatTrigger);
        vue.nextTick(adjustTextareaSize);
      });
      useEventListener("touchstart", onClear, {
        target: vue.computed(() => {
          var _a;
          return (_a = clearIconRef.value) == null ? void 0 : _a.$el;
        })
      });
      return () => {
        const disabled = getProp("disabled");
        const labelAlign = getProp("labelAlign");
        const Label = renderLabel();
        const LeftIcon = renderLeftIcon();
        return vue.createVNode(Cell, {
          "size": props.size,
          "icon": props.leftIcon,
          "class": bem$1b({
            error: showError.value,
            disabled,
            [`label-${labelAlign}`]: labelAlign
          }),
          "center": props.center,
          "border": props.border,
          "isLink": props.isLink,
          "clickable": props.clickable,
          "titleStyle": labelStyle.value,
          "valueClass": bem$1b("value"),
          "titleClass": [bem$1b("label", [labelAlign, {
            required: props.required
          }]), props.labelClass],
          "arrowDirection": props.arrowDirection
        }, {
          icon: LeftIcon ? () => LeftIcon : null,
          title: Label ? () => Label : null,
          value: renderFieldBody,
          extra: slots.extra
        });
      };
    }
  });
  const Field = withInstall(stdin_default$1j);
  function usePopupState() {
    const state = vue.reactive({
      show: false
    });
    const toggle = (show) => {
      state.show = show;
    };
    const open = (props) => {
      extend(state, props, { transitionAppear: true });
      toggle(true);
    };
    const close = () => toggle(false);
    useExpose({ open, close, toggle });
    return {
      open,
      close,
      state,
      toggle
    };
  }
  function mountComponent(RootComponent) {
    const app = vue.createApp(RootComponent);
    const root = document.createElement("div");
    document.body.appendChild(root);
    return {
      instance: app.mount(root),
      unmount() {
        app.unmount();
        document.body.removeChild(root);
      }
    };
  }
  let lockCount = 0;
  function lockClick(lock) {
    if (lock) {
      if (!lockCount) {
        document.body.classList.add("van-toast--unclickable");
      }
      lockCount++;
    } else if (lockCount) {
      lockCount--;
      if (!lockCount) {
        document.body.classList.remove("van-toast--unclickable");
      }
    }
  }
  const [name$1e, bem$1a] = createNamespace("toast");
  const popupInheritProps = ["show", "overlay", "teleport", "transition", "overlayClass", "overlayStyle", "closeOnClickOverlay"];
  const toastProps = {
    icon: String,
    show: Boolean,
    type: makeStringProp("text"),
    overlay: Boolean,
    message: numericProp,
    iconSize: numericProp,
    duration: makeNumberProp(2e3),
    position: makeStringProp("middle"),
    teleport: [String, Object],
    className: unknownProp,
    iconPrefix: String,
    transition: makeStringProp("van-fade"),
    loadingType: String,
    forbidClick: Boolean,
    overlayClass: unknownProp,
    overlayStyle: Object,
    closeOnClick: Boolean,
    closeOnClickOverlay: Boolean
  };
  var stdin_default$1i = vue.defineComponent({
    name: name$1e,
    props: toastProps,
    emits: ["update:show"],
    setup(props, {
      emit
    }) {
      let timer2;
      let clickable = false;
      const toggleClickable = () => {
        const newValue = props.show && props.forbidClick;
        if (clickable !== newValue) {
          clickable = newValue;
          lockClick(clickable);
        }
      };
      const updateShow = (show) => emit("update:show", show);
      const onClick = () => {
        if (props.closeOnClick) {
          updateShow(false);
        }
      };
      const clearTimer = () => clearTimeout(timer2);
      const renderIcon = () => {
        const {
          icon,
          type,
          iconSize,
          iconPrefix,
          loadingType
        } = props;
        const hasIcon = icon || type === "success" || type === "fail";
        if (hasIcon) {
          return vue.createVNode(Icon, {
            "name": icon || type,
            "size": iconSize,
            "class": bem$1a("icon"),
            "classPrefix": iconPrefix
          }, null);
        }
        if (type === "loading") {
          return vue.createVNode(Loading, {
            "class": bem$1a("loading"),
            "size": iconSize,
            "type": loadingType
          }, null);
        }
      };
      const renderMessage = () => {
        const {
          type,
          message
        } = props;
        if (isDef(message) && message !== "") {
          return type === "html" ? vue.createVNode("div", {
            "key": 0,
            "class": bem$1a("text"),
            "innerHTML": String(message)
          }, null) : vue.createVNode("div", {
            "class": bem$1a("text")
          }, [message]);
        }
      };
      vue.watch(() => [props.show, props.forbidClick], toggleClickable);
      vue.watch(() => [props.show, props.type, props.message, props.duration], () => {
        clearTimer();
        if (props.show && props.duration > 0) {
          timer2 = setTimeout(() => {
            updateShow(false);
          }, props.duration);
        }
      });
      vue.onMounted(toggleClickable);
      vue.onUnmounted(toggleClickable);
      return () => vue.createVNode(Popup, vue.mergeProps({
        "class": [bem$1a([props.position, {
          [props.type]: !props.icon
        }]), props.className],
        "lockScroll": false,
        "onClick": onClick,
        "onClosed": clearTimer,
        "onUpdate:show": updateShow
      }, pick(props, popupInheritProps)), {
        default: () => [renderIcon(), renderMessage()]
      });
    }
  });
  const defaultOptions = {
    icon: "",
    type: "text",
    message: "",
    className: "",
    overlay: false,
    onClose: void 0,
    onOpened: void 0,
    duration: 2e3,
    teleport: "body",
    iconSize: void 0,
    iconPrefix: void 0,
    position: "middle",
    transition: "van-fade",
    forbidClick: false,
    loadingType: void 0,
    overlayClass: "",
    overlayStyle: void 0,
    closeOnClick: false,
    closeOnClickOverlay: false
  };
  let queue = [];
  let allowMultiple = false;
  let currentOptions = extend({}, defaultOptions);
  const defaultOptionsMap = /* @__PURE__ */ new Map();
  function parseOptions$1(message) {
    if (isObject(message)) {
      return message;
    }
    return {
      message
    };
  }
  function createInstance() {
    const {
      instance: instance2,
      unmount
    } = mountComponent({
      setup() {
        const message = vue.ref("");
        const {
          open,
          state,
          close,
          toggle
        } = usePopupState();
        const onClosed = () => {
          if (allowMultiple) {
            queue = queue.filter((item) => item !== instance2);
            unmount();
          }
        };
        const render = () => {
          const attrs = {
            onClosed,
            "onUpdate:show": toggle
          };
          return vue.createVNode(stdin_default$1i, vue.mergeProps(state, attrs), null);
        };
        vue.watch(message, (val) => {
          state.message = val;
        });
        vue.getCurrentInstance().render = render;
        return {
          open,
          clear: close,
          message
        };
      }
    });
    return instance2;
  }
  function getInstance() {
    if (!queue.length || allowMultiple) {
      const instance2 = createInstance();
      queue.push(instance2);
    }
    return queue[queue.length - 1];
  }
  function Toast$1(options = {}) {
    if (!inBrowser$1) {
      return {};
    }
    const toast = getInstance();
    const parsedOptions = parseOptions$1(options);
    toast.open(extend({}, currentOptions, defaultOptionsMap.get(parsedOptions.type || currentOptions.type), parsedOptions));
    return toast;
  }
  const createMethod = (type) => (options) => Toast$1(extend({
    type
  }, parseOptions$1(options)));
  Toast$1.loading = createMethod("loading");
  Toast$1.success = createMethod("success");
  Toast$1.fail = createMethod("fail");
  Toast$1.clear = (all) => {
    var _a;
    if (queue.length) {
      if (all) {
        queue.forEach((toast) => {
          toast.clear();
        });
        queue = [];
      } else if (!allowMultiple) {
        queue[0].clear();
      } else {
        (_a = queue.shift()) == null ? void 0 : _a.clear();
      }
    }
  };
  function setDefaultOptions(type, options) {
    if (typeof type === "string") {
      defaultOptionsMap.set(type, options);
    } else {
      extend(currentOptions, type);
    }
  }
  Toast$1.setDefaultOptions = setDefaultOptions;
  Toast$1.resetDefaultOptions = (type) => {
    if (typeof type === "string") {
      defaultOptionsMap.delete(type);
    } else {
      currentOptions = extend({}, defaultOptions);
      defaultOptionsMap.clear();
    }
  };
  Toast$1.allowMultiple = (value = true) => {
    allowMultiple = value;
  };
  Toast$1.install = (app) => {
    app.use(withInstall(stdin_default$1i));
    app.config.globalProperties.$toast = Toast$1;
  };
  const [name$1d, bem$19] = createNamespace("switch");
  const switchProps = {
    size: numericProp,
    loading: Boolean,
    disabled: Boolean,
    modelValue: unknownProp,
    activeColor: String,
    inactiveColor: String,
    activeValue: {
      type: unknownProp,
      default: true
    },
    inactiveValue: {
      type: unknownProp,
      default: false
    }
  };
  var stdin_default$1h = vue.defineComponent({
    name: name$1d,
    props: switchProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const isChecked = () => props.modelValue === props.activeValue;
      const onClick = () => {
        if (!props.disabled && !props.loading) {
          const newValue = isChecked() ? props.inactiveValue : props.activeValue;
          emit("update:modelValue", newValue);
          emit("change", newValue);
        }
      };
      const renderLoading = () => {
        if (props.loading) {
          const color = isChecked() ? props.activeColor : props.inactiveColor;
          return vue.createVNode(Loading, {
            "class": bem$19("loading"),
            "color": color
          }, null);
        }
        if (slots.node) {
          return slots.node();
        }
      };
      useCustomFieldValue(() => props.modelValue);
      return () => {
        var _a;
        const {
          size,
          loading,
          disabled,
          activeColor,
          inactiveColor
        } = props;
        const checked = isChecked();
        const style = {
          fontSize: addUnit(size),
          backgroundColor: checked ? activeColor : inactiveColor
        };
        return vue.createVNode("div", {
          "role": "switch",
          "class": bem$19({
            on: checked,
            loading,
            disabled
          }),
          "style": style,
          "tabindex": disabled ? void 0 : 0,
          "aria-checked": checked,
          "onClick": onClick
        }, [vue.createVNode("div", {
          "class": bem$19("node")
        }, [renderLoading()]), (_a = slots.background) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Switch = withInstall(stdin_default$1h);
  const [name$1c, bem$18] = createNamespace("address-edit-detail");
  const t$i = createNamespace("address-edit")[2];
  var stdin_default$1g = vue.defineComponent({
    name: name$1c,
    props: {
      show: Boolean,
      rows: numericProp,
      value: String,
      rules: Array,
      focused: Boolean,
      maxlength: numericProp,
      searchResult: Array,
      showSearchResult: Boolean
    },
    emits: ["blur", "focus", "input", "select-search"],
    setup(props, {
      emit
    }) {
      const field = vue.ref();
      const showSearchResult = () => props.focused && props.searchResult && props.showSearchResult;
      const onSelect = (express) => {
        emit("select-search", express);
        emit("input", `${express.address || ""} ${express.name || ""}`.trim());
      };
      const renderSearchTitle = (express) => {
        if (express.name) {
          const text = express.name.replace(props.value, `<span class=${bem$18("keyword")}>${props.value}</span>`);
          return vue.createVNode("div", {
            "innerHTML": text
          }, null);
        }
      };
      const renderSearchResult = () => {
        if (!showSearchResult()) {
          return;
        }
        const {
          searchResult
        } = props;
        return searchResult.map((express) => vue.createVNode(Cell, {
          "clickable": true,
          "key": express.name + express.address,
          "icon": "location-o",
          "label": express.address,
          "class": bem$18("search-item"),
          "border": false,
          "onClick": () => onSelect(express)
        }, {
          title: () => renderSearchTitle(express)
        }));
      };
      const onBlur = (event) => emit("blur", event);
      const onFocus = (event) => emit("focus", event);
      const onInput = (value) => emit("input", value);
      return () => {
        if (props.show) {
          return vue.createVNode(vue.Fragment, null, [vue.createVNode(Field, {
            "autosize": true,
            "clearable": true,
            "ref": field,
            "class": bem$18(),
            "rows": props.rows,
            "type": "textarea",
            "rules": props.rules,
            "label": t$i("addressDetail"),
            "border": !showSearchResult(),
            "maxlength": props.maxlength,
            "modelValue": props.value,
            "placeholder": t$i("addressDetail"),
            "onBlur": onBlur,
            "onFocus": onFocus,
            "onUpdate:modelValue": onInput
          }, null), renderSearchResult()]);
        }
      };
    }
  });
  const [name$1b, bem$17, t$h] = createNamespace("address-edit");
  const DEFAULT_DATA = {
    name: "",
    tel: "",
    city: "",
    county: "",
    country: "",
    province: "",
    areaCode: "",
    isDefault: false,
    postalCode: "",
    addressDetail: ""
  };
  const isPostal = (value) => /^\d{6}$/.test(value);
  const addressEditProps = {
    areaList: Object,
    isSaving: Boolean,
    isDeleting: Boolean,
    validator: Function,
    showArea: truthProp,
    showDetail: truthProp,
    showDelete: Boolean,
    showPostal: Boolean,
    disableArea: Boolean,
    searchResult: Array,
    telMaxlength: numericProp,
    showSetDefault: Boolean,
    saveButtonText: String,
    areaPlaceholder: String,
    deleteButtonText: String,
    showSearchResult: Boolean,
    detailRows: makeNumericProp(1),
    detailMaxlength: makeNumericProp(200),
    areaColumnsPlaceholder: makeArrayProp(),
    addressInfo: {
      type: Object,
      default: () => extend({}, DEFAULT_DATA)
    },
    telValidator: {
      type: Function,
      default: isMobile
    },
    postalValidator: {
      type: Function,
      default: isPostal
    }
  };
  var stdin_default$1f = vue.defineComponent({
    name: name$1b,
    props: addressEditProps,
    emits: ["save", "focus", "delete", "click-area", "change-area", "change-detail", "select-search", "change-default"],
    setup(props, {
      emit,
      slots
    }) {
      const areaRef = vue.ref();
      const data = vue.reactive({});
      const showAreaPopup = vue.ref(false);
      const detailFocused = vue.ref(false);
      const areaListLoaded = vue.computed(() => isObject(props.areaList) && Object.keys(props.areaList).length);
      const areaText = vue.computed(() => {
        const {
          country,
          province,
          city,
          county,
          areaCode
        } = data;
        if (areaCode) {
          const arr = [country, province, city, county];
          if (province && province === city) {
            arr.splice(1, 1);
          }
          return arr.filter(Boolean).join("/");
        }
        return "";
      });
      const hideBottomFields = vue.computed(() => {
        var _a;
        return ((_a = props.searchResult) == null ? void 0 : _a.length) && detailFocused.value;
      });
      const assignAreaValues = () => {
        if (areaRef.value) {
          const detail = areaRef.value.getArea();
          detail.areaCode = detail.code;
          delete detail.code;
          extend(data, detail);
        }
      };
      const onFocus = (key) => {
        detailFocused.value = key === "addressDetail";
        emit("focus", key);
      };
      const rules = vue.computed(() => {
        const {
          validator,
          telValidator,
          postalValidator
        } = props;
        const makeRule = (name2, emptyMessage) => ({
          validator: (value) => {
            if (validator) {
              const message = validator(name2, value);
              if (message) {
                return message;
              }
            }
            if (!value) {
              return emptyMessage;
            }
            return true;
          }
        });
        return {
          name: [makeRule("name", t$h("nameEmpty"))],
          tel: [makeRule("tel", t$h("telInvalid")), {
            validator: telValidator,
            message: t$h("telInvalid")
          }],
          areaCode: [makeRule("areaCode", t$h("areaEmpty"))],
          addressDetail: [makeRule("addressDetail", t$h("addressEmpty"))],
          postalCode: [makeRule("addressDetail", t$h("postalEmpty")), {
            validator: postalValidator,
            message: t$h("postalEmpty")
          }]
        };
      });
      const onSave = () => emit("save", data);
      const onChangeDetail = (val) => {
        data.addressDetail = val;
        emit("change-detail", val);
      };
      const onAreaConfirm = (values) => {
        values = values.filter(Boolean);
        if (values.some((value) => !value.code)) {
          Toast$1(t$h("areaEmpty"));
        } else {
          showAreaPopup.value = false;
          assignAreaValues();
          emit("change-area", values);
        }
      };
      const onDelete = () => emit("delete", data);
      const getArea = () => {
        var _a;
        return ((_a = areaRef.value) == null ? void 0 : _a.getValues()) || [];
      };
      const setAreaCode = (code) => {
        data.areaCode = code || "";
        if (code) {
          vue.nextTick(assignAreaValues);
        }
      };
      const onDetailBlur = () => {
        setTimeout(() => {
          detailFocused.value = false;
        });
      };
      const setAddressDetail = (value) => {
        data.addressDetail = value;
      };
      const renderSetDefaultCell = () => {
        if (props.showSetDefault) {
          const slots2 = {
            "right-icon": () => vue.createVNode(Switch, {
              "modelValue": data.isDefault,
              "onUpdate:modelValue": ($event) => data.isDefault = $event,
              "size": "24",
              "onChange": (event) => emit("change-default", event)
            }, null)
          };
          return vue.withDirectives(vue.createVNode(Cell, {
            "center": true,
            "title": t$h("defaultAddress"),
            "class": bem$17("default")
          }, slots2), [[vue.vShow, !hideBottomFields.value]]);
        }
      };
      useExpose({
        getArea,
        setAreaCode,
        setAddressDetail
      });
      vue.watch(() => props.areaList, () => setAreaCode(data.areaCode));
      vue.watch(() => props.addressInfo, (value) => {
        extend(data, DEFAULT_DATA, value);
        setAreaCode(value.areaCode);
      }, {
        deep: true,
        immediate: true
      });
      return () => {
        const {
          disableArea
        } = props;
        return vue.createVNode(Form, {
          "class": bem$17(),
          "onSubmit": onSave
        }, {
          default: () => {
            var _a;
            return [vue.createVNode("div", {
              "class": bem$17("fields")
            }, [vue.createVNode(Field, {
              "modelValue": data.name,
              "onUpdate:modelValue": ($event) => data.name = $event,
              "clearable": true,
              "label": t$h("name"),
              "rules": rules.value.name,
              "placeholder": t$h("name"),
              "onFocus": () => onFocus("name")
            }, null), vue.createVNode(Field, {
              "modelValue": data.tel,
              "onUpdate:modelValue": ($event) => data.tel = $event,
              "clearable": true,
              "type": "tel",
              "label": t$h("tel"),
              "rules": rules.value.tel,
              "maxlength": props.telMaxlength,
              "placeholder": t$h("tel"),
              "onFocus": () => onFocus("tel")
            }, null), vue.withDirectives(vue.createVNode(Field, {
              "readonly": true,
              "label": t$h("area"),
              "is-link": !disableArea,
              "modelValue": areaText.value,
              "rules": rules.value.areaCode,
              "placeholder": props.areaPlaceholder || t$h("area"),
              "onFocus": () => onFocus("areaCode"),
              "onClick": () => {
                emit("click-area");
                showAreaPopup.value = !disableArea;
              }
            }, null), [[vue.vShow, props.showArea]]), vue.createVNode(stdin_default$1g, {
              "show": props.showDetail,
              "rows": props.detailRows,
              "rules": rules.value.addressDetail,
              "value": data.addressDetail,
              "focused": detailFocused.value,
              "maxlength": props.detailMaxlength,
              "searchResult": props.searchResult,
              "showSearchResult": props.showSearchResult,
              "onBlur": onDetailBlur,
              "onFocus": () => onFocus("addressDetail"),
              "onInput": onChangeDetail,
              "onSelect-search": (event) => emit("select-search", event)
            }, null), props.showPostal && vue.withDirectives(vue.createVNode(Field, {
              "modelValue": data.postalCode,
              "onUpdate:modelValue": ($event) => data.postalCode = $event,
              "type": "tel",
              "rules": rules.value.postalCode,
              "label": t$h("postal"),
              "maxlength": "6",
              "placeholder": t$h("postal"),
              "onFocus": () => onFocus("postalCode")
            }, null), [[vue.vShow, !hideBottomFields.value]]), (_a = slots.default) == null ? void 0 : _a.call(slots)]), renderSetDefaultCell(), vue.withDirectives(vue.createVNode("div", {
              "class": bem$17("buttons")
            }, [vue.createVNode(Button, {
              "block": true,
              "round": true,
              "type": "danger",
              "text": props.saveButtonText || t$h("save"),
              "class": bem$17("button"),
              "loading": props.isSaving,
              "nativeType": "submit"
            }, null), props.showDelete && vue.createVNode(Button, {
              "block": true,
              "round": true,
              "class": bem$17("button"),
              "loading": props.isDeleting,
              "text": props.deleteButtonText || t$h("delete"),
              "onClick": onDelete
            }, null)]), [[vue.vShow, !hideBottomFields.value]]), vue.createVNode(Popup, {
              "show": showAreaPopup.value,
              "onUpdate:show": ($event) => showAreaPopup.value = $event,
              "round": true,
              "teleport": "body",
              "position": "bottom",
              "lazyRender": false
            }, {
              default: () => [vue.createVNode(Area, {
                "ref": areaRef,
                "value": data.areaCode,
                "loading": !areaListLoaded.value,
                "areaList": props.areaList,
                "columnsPlaceholder": props.areaColumnsPlaceholder,
                "onConfirm": onAreaConfirm,
                "onCancel": () => {
                  showAreaPopup.value = false;
                }
              }, null)]
            })];
          }
        });
      };
    }
  });
  const AddressEdit = withInstall(stdin_default$1f);
  const [name$1a, bem$16] = createNamespace("radio-group");
  const radioGroupProps = {
    disabled: Boolean,
    iconSize: numericProp,
    direction: String,
    modelValue: unknownProp,
    checkedColor: String
  };
  const RADIO_KEY = Symbol(name$1a);
  var stdin_default$1e = vue.defineComponent({
    name: name$1a,
    props: radioGroupProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        linkChildren
      } = useChildren(RADIO_KEY);
      const updateValue = (value) => emit("update:modelValue", value);
      vue.watch(() => props.modelValue, (value) => emit("change", value));
      linkChildren({
        props,
        updateValue
      });
      useCustomFieldValue(() => props.modelValue);
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$16([props.direction]),
          "role": "radiogroup"
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const RadioGroup = withInstall(stdin_default$1e);
  const [name$19, bem$15] = createNamespace("tag");
  const tagProps = {
    size: String,
    mark: Boolean,
    show: truthProp,
    type: makeStringProp("default"),
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: String,
    closeable: Boolean
  };
  var stdin_default$1d = vue.defineComponent({
    name: name$19,
    props: tagProps,
    emits: ["close"],
    setup(props, {
      slots,
      emit
    }) {
      const onClose = (event) => {
        event.stopPropagation();
        emit("close", event);
      };
      const getStyle = () => {
        if (props.plain) {
          return {
            color: props.textColor || props.color,
            borderColor: props.color
          };
        }
        return {
          color: props.textColor,
          background: props.color
        };
      };
      const renderTag = () => {
        var _a;
        const {
          type,
          mark,
          plain,
          round: round2,
          size,
          closeable
        } = props;
        const classes = {
          mark,
          plain,
          round: round2
        };
        if (size) {
          classes[size] = size;
        }
        const CloseIcon = closeable && vue.createVNode(Icon, {
          "name": "cross",
          "class": [bem$15("close"), HAPTICS_FEEDBACK],
          "onClick": onClose
        }, null);
        return vue.createVNode("span", {
          "style": getStyle(),
          "class": bem$15([classes, type])
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots), CloseIcon]);
      };
      return () => vue.createVNode(vue.Transition, {
        "name": props.closeable ? "van-fade" : void 0
      }, {
        default: () => [props.show ? renderTag() : null]
      });
    }
  });
  const Tag = withInstall(stdin_default$1d);
  const checkerProps = {
    name: unknownProp,
    shape: makeStringProp("round"),
    disabled: Boolean,
    iconSize: numericProp,
    modelValue: unknownProp,
    checkedColor: String,
    labelPosition: String,
    labelDisabled: Boolean
  };
  var stdin_default$1c = vue.defineComponent({
    props: extend({}, checkerProps, {
      bem: makeRequiredProp(Function),
      role: String,
      parent: Object,
      checked: Boolean,
      bindGroup: truthProp
    }),
    emits: ["click", "toggle"],
    setup(props, {
      emit,
      slots
    }) {
      const iconRef = vue.ref();
      const getParentProp = (name2) => {
        if (props.parent && props.bindGroup) {
          return props.parent.props[name2];
        }
      };
      const disabled = vue.computed(() => getParentProp("disabled") || props.disabled);
      const direction = vue.computed(() => getParentProp("direction"));
      const iconStyle = vue.computed(() => {
        const checkedColor = props.checkedColor || getParentProp("checkedColor");
        if (checkedColor && props.checked && !disabled.value) {
          return {
            borderColor: checkedColor,
            backgroundColor: checkedColor
          };
        }
      });
      const onClick = (event) => {
        const {
          target
        } = event;
        const icon = iconRef.value;
        const iconClicked = icon === target || (icon == null ? void 0 : icon.contains(target));
        if (!disabled.value && (iconClicked || !props.labelDisabled)) {
          emit("toggle");
        }
        emit("click", event);
      };
      const renderIcon = () => {
        const {
          bem: bem2,
          shape,
          checked
        } = props;
        const iconSize = props.iconSize || getParentProp("iconSize");
        return vue.createVNode("div", {
          "ref": iconRef,
          "class": bem2("icon", [shape, {
            disabled: disabled.value,
            checked
          }]),
          "style": {
            fontSize: addUnit(iconSize)
          }
        }, [slots.icon ? slots.icon({
          checked,
          disabled: disabled.value
        }) : vue.createVNode(Icon, {
          "name": "success",
          "style": iconStyle.value
        }, null)]);
      };
      const renderLabel = () => {
        if (slots.default) {
          return vue.createVNode("span", {
            "class": props.bem("label", [props.labelPosition, {
              disabled: disabled.value
            }])
          }, [slots.default()]);
        }
      };
      return () => {
        const nodes = props.labelPosition === "left" ? [renderLabel(), renderIcon()] : [renderIcon(), renderLabel()];
        return vue.createVNode("div", {
          "role": props.role,
          "class": props.bem([{
            disabled: disabled.value,
            "label-disabled": props.labelDisabled
          }, direction.value]),
          "tabindex": disabled.value ? void 0 : 0,
          "aria-checked": props.checked,
          "onClick": onClick
        }, [nodes]);
      };
    }
  });
  const [name$18, bem$14] = createNamespace("radio");
  var stdin_default$1b = vue.defineComponent({
    name: name$18,
    props: checkerProps,
    emits: ["update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        parent
      } = useParent(RADIO_KEY);
      const checked = () => {
        const value = parent ? parent.props.modelValue : props.modelValue;
        return value === props.name;
      };
      const toggle = () => {
        if (parent) {
          parent.updateValue(props.name);
        } else {
          emit("update:modelValue", props.name);
        }
      };
      return () => vue.createVNode(stdin_default$1c, vue.mergeProps({
        "bem": bem$14,
        "role": "radio",
        "parent": parent,
        "checked": checked(),
        "onToggle": toggle
      }, props), pick(slots, ["default", "icon"]));
    }
  });
  const Radio = withInstall(stdin_default$1b);
  const [name$17, bem$13] = createNamespace("address-item");
  var stdin_default$1a = vue.defineComponent({
    name: name$17,
    props: {
      address: makeRequiredProp(Object),
      disabled: Boolean,
      switchable: Boolean,
      defaultTagText: String
    },
    emits: ["edit", "click", "select"],
    setup(props, {
      slots,
      emit
    }) {
      const onClick = () => {
        if (props.switchable) {
          emit("select");
        }
        emit("click");
      };
      const renderRightIcon = () => vue.createVNode(Icon, {
        "name": "edit",
        "class": bem$13("edit"),
        "onClick": (event) => {
          event.stopPropagation();
          emit("edit");
          emit("click");
        }
      }, null);
      const renderTag = () => {
        if (slots.tag) {
          return slots.tag(props.address);
        }
        if (props.address.isDefault && props.defaultTagText) {
          return vue.createVNode(Tag, {
            "type": "danger",
            "round": true,
            "class": bem$13("tag")
          }, {
            default: () => [props.defaultTagText]
          });
        }
      };
      const renderContent = () => {
        const {
          address,
          disabled,
          switchable
        } = props;
        const Info = [vue.createVNode("div", {
          "class": bem$13("name")
        }, [`${address.name} ${address.tel}`, renderTag()]), vue.createVNode("div", {
          "class": bem$13("address")
        }, [address.address])];
        if (switchable && !disabled) {
          return vue.createVNode(Radio, {
            "name": address.id,
            "iconSize": 18
          }, {
            default: () => [Info]
          });
        }
        return Info;
      };
      return () => {
        var _a;
        const {
          disabled
        } = props;
        return vue.createVNode("div", {
          "class": bem$13({
            disabled
          }),
          "onClick": onClick
        }, [vue.createVNode(Cell, {
          "border": false,
          "valueClass": bem$13("value")
        }, {
          value: renderContent,
          "right-icon": renderRightIcon
        }), (_a = slots.bottom) == null ? void 0 : _a.call(slots, extend({}, props.address, {
          disabled
        }))]);
      };
    }
  });
  const [name$16, bem$12, t$g] = createNamespace("address-list");
  const addressListProps = {
    list: makeArrayProp(),
    modelValue: numericProp,
    switchable: truthProp,
    disabledText: String,
    disabledList: makeArrayProp(),
    addButtonText: String,
    defaultTagText: String
  };
  var stdin_default$19 = vue.defineComponent({
    name: name$16,
    props: addressListProps,
    emits: ["add", "edit", "select", "click-item", "edit-disabled", "select-disabled", "update:modelValue"],
    setup(props, {
      slots,
      emit
    }) {
      const renderItem = (item, index, disabled) => {
        const onEdit = () => emit(disabled ? "edit-disabled" : "edit", item, index);
        const onClick = () => emit("click-item", item, index);
        const onSelect = () => {
          emit(disabled ? "select-disabled" : "select", item, index);
          if (!disabled) {
            emit("update:modelValue", item.id);
          }
        };
        return vue.createVNode(stdin_default$1a, {
          "key": item.id,
          "address": item,
          "disabled": disabled,
          "switchable": props.switchable,
          "defaultTagText": props.defaultTagText,
          "onEdit": onEdit,
          "onClick": onClick,
          "onSelect": onSelect
        }, {
          bottom: slots["item-bottom"],
          tag: slots.tag
        });
      };
      const renderList = (list, disabled) => {
        if (list) {
          return list.map((item, index) => renderItem(item, index, disabled));
        }
      };
      const renderBottom = () => vue.createVNode("div", {
        "class": [bem$12("bottom"), "van-safe-area-bottom"]
      }, [vue.createVNode(Button, {
        "round": true,
        "block": true,
        "type": "danger",
        "text": props.addButtonText || t$g("add"),
        "class": bem$12("add"),
        "onClick": () => emit("add")
      }, null)]);
      return () => {
        var _a, _b;
        const List2 = renderList(props.list);
        const DisabledList = renderList(props.disabledList, true);
        const DisabledText = props.disabledText && vue.createVNode("div", {
          "class": bem$12("disabled-text")
        }, [props.disabledText]);
        return vue.createVNode("div", {
          "class": bem$12()
        }, [(_a = slots.top) == null ? void 0 : _a.call(slots), vue.createVNode(RadioGroup, {
          "modelValue": props.modelValue
        }, {
          default: () => [List2]
        }), DisabledText, DisabledList, (_b = slots.default) == null ? void 0 : _b.call(slots), renderBottom()]);
      };
    }
  });
  const AddressList = withInstall(stdin_default$19);
  const [name$15, bem$11, t$f] = createNamespace("calendar");
  const formatMonthTitle = (date) => t$f("monthTitle", date.getFullYear(), date.getMonth() + 1);
  function compareMonth(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    if (year1 === year2) {
      const month1 = date1.getMonth();
      const month2 = date2.getMonth();
      return month1 === month2 ? 0 : month1 > month2 ? 1 : -1;
    }
    return year1 > year2 ? 1 : -1;
  }
  function compareDay(day1, day2) {
    const compareMonthResult = compareMonth(day1, day2);
    if (compareMonthResult === 0) {
      const date1 = day1.getDate();
      const date2 = day2.getDate();
      return date1 === date2 ? 0 : date1 > date2 ? 1 : -1;
    }
    return compareMonthResult;
  }
  const cloneDate = (date) => new Date(date);
  const cloneDates = (dates) => Array.isArray(dates) ? dates.map(cloneDate) : cloneDate(dates);
  function getDayByOffset(date, offset2) {
    const cloned = cloneDate(date);
    cloned.setDate(cloned.getDate() + offset2);
    return cloned;
  }
  const getPrevDay = (date) => getDayByOffset(date, -1);
  const getNextDay = (date) => getDayByOffset(date, 1);
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  function calcDateNum(date) {
    const day1 = date[0].getTime();
    const day2 = date[1].getTime();
    return (day2 - day1) / (1e3 * 60 * 60 * 24) + 1;
  }
  function useRefs() {
    const refs = vue.ref([]);
    const cache = [];
    vue.onBeforeUpdate(() => {
      refs.value = [];
    });
    const setRefs = (index) => {
      if (!cache[index]) {
        cache[index] = (el) => {
          refs.value[index] = el;
        };
      }
      return cache[index];
    };
    return [refs, setRefs];
  }
  const sharedProps = extend({}, pickerSharedProps, {
    filter: Function,
    columnsOrder: Array,
    formatter: {
      type: Function,
      default: (type, value) => value
    }
  });
  const pickerInheritKeys = Object.keys(pickerSharedProps);
  function times(n2, iteratee) {
    if (n2 < 0) {
      return [];
    }
    const result = Array(n2);
    let index = -1;
    while (++index < n2) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function getTrueValue(value) {
    if (!value) {
      return 0;
    }
    while (Number.isNaN(parseInt(value, 10))) {
      if (value.length > 1) {
        value = value.slice(1);
      } else {
        return 0;
      }
    }
    return parseInt(value, 10);
  }
  const getMonthEndDay = (year, month) => 32 - new Date(year, month - 1, 32).getDate();
  const proxyPickerMethods = (picker, callback) => {
    const methods = [
      "setValues",
      "setIndexes",
      "setColumnIndex",
      "setColumnValue"
    ];
    return new Proxy(picker, {
      get: (target, prop) => {
        if (methods.includes(prop)) {
          return (...args) => {
            target[prop](...args);
            callback();
          };
        }
        return target[prop];
      }
    });
  };
  const [name$14] = createNamespace("calendar-day");
  var stdin_default$18 = vue.defineComponent({
    name: name$14,
    props: {
      item: makeRequiredProp(Object),
      color: String,
      index: Number,
      offset: makeNumberProp(0),
      rowHeight: String
    },
    emits: ["click"],
    setup(props, {
      emit,
      slots
    }) {
      const style = vue.computed(() => {
        var _a;
        const {
          item,
          index,
          color,
          offset: offset2,
          rowHeight
        } = props;
        const style2 = {
          height: rowHeight
        };
        if (item.type === "placeholder") {
          style2.width = "100%";
          return style2;
        }
        if (index === 0) {
          style2.marginLeft = `${100 * offset2 / 7}%`;
        }
        if (color) {
          switch (item.type) {
            case "end":
            case "start":
            case "start-end":
            case "multiple-middle":
            case "multiple-selected":
              style2.background = color;
              break;
            case "middle":
              style2.color = color;
              break;
          }
        }
        if (offset2 + (((_a = item.date) == null ? void 0 : _a.getDate()) || 1) > 28) {
          style2.marginBottom = 0;
        }
        return style2;
      });
      const onClick = () => {
        if (props.item.type !== "disabled") {
          emit("click", props.item);
        }
      };
      const renderTopInfo = () => {
        const {
          topInfo
        } = props.item;
        if (topInfo || slots["top-info"]) {
          return vue.createVNode("div", {
            "class": bem$11("top-info")
          }, [slots["top-info"] ? slots["top-info"](props.item) : topInfo]);
        }
      };
      const renderBottomInfo = () => {
        const {
          bottomInfo
        } = props.item;
        if (bottomInfo || slots["bottom-info"]) {
          return vue.createVNode("div", {
            "class": bem$11("bottom-info")
          }, [slots["bottom-info"] ? slots["bottom-info"](props.item) : bottomInfo]);
        }
      };
      const renderContent = () => {
        const {
          item,
          color,
          rowHeight
        } = props;
        const {
          type,
          text
        } = item;
        const Nodes = [renderTopInfo(), text, renderBottomInfo()];
        if (type === "selected") {
          return vue.createVNode("div", {
            "class": bem$11("selected-day"),
            "style": {
              width: rowHeight,
              height: rowHeight,
              background: color
            }
          }, [Nodes]);
        }
        return Nodes;
      };
      return () => {
        const {
          type,
          className
        } = props.item;
        if (type === "placeholder") {
          return vue.createVNode("div", {
            "class": bem$11("day"),
            "style": style.value
          }, null);
        }
        return vue.createVNode("div", {
          "role": "gridcell",
          "style": style.value,
          "class": [bem$11("day", type), className],
          "tabindex": type === "disabled" ? void 0 : -1,
          "onClick": onClick
        }, [renderContent()]);
      };
    }
  });
  const [name$13] = createNamespace("calendar-month");
  const calendarMonthProps = {
    date: makeRequiredProp(Date),
    type: String,
    color: String,
    minDate: makeRequiredProp(Date),
    maxDate: makeRequiredProp(Date),
    showMark: Boolean,
    rowHeight: numericProp,
    formatter: Function,
    lazyRender: Boolean,
    currentDate: [Date, Array],
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
    firstDayOfWeek: Number
  };
  var stdin_default$17 = vue.defineComponent({
    name: name$13,
    props: calendarMonthProps,
    emits: ["click", "update-height"],
    setup(props, {
      emit,
      slots
    }) {
      const [visible, setVisible] = useToggle();
      const daysRef = vue.ref();
      const monthRef = vue.ref();
      const height2 = useHeight(monthRef);
      const title = vue.computed(() => formatMonthTitle(props.date));
      const rowHeight = vue.computed(() => addUnit(props.rowHeight));
      const offset2 = vue.computed(() => {
        const realDay = props.date.getDay();
        if (props.firstDayOfWeek) {
          return (realDay + 7 - props.firstDayOfWeek) % 7;
        }
        return realDay;
      });
      const totalDay = vue.computed(() => getMonthEndDay(props.date.getFullYear(), props.date.getMonth() + 1));
      const shouldRender = vue.computed(() => visible.value || !props.lazyRender);
      const getTitle = () => title.value;
      const getMultipleDayType = (day) => {
        const isSelected = (date) => props.currentDate.some((item) => compareDay(item, date) === 0);
        if (isSelected(day)) {
          const prevDay = getPrevDay(day);
          const nextDay = getNextDay(day);
          const prevSelected = isSelected(prevDay);
          const nextSelected = isSelected(nextDay);
          if (prevSelected && nextSelected) {
            return "multiple-middle";
          }
          if (prevSelected) {
            return "end";
          }
          if (nextSelected) {
            return "start";
          }
          return "multiple-selected";
        }
        return "";
      };
      const getRangeDayType = (day) => {
        const [startDay, endDay] = props.currentDate;
        if (!startDay) {
          return "";
        }
        const compareToStart = compareDay(day, startDay);
        if (!endDay) {
          return compareToStart === 0 ? "start" : "";
        }
        const compareToEnd = compareDay(day, endDay);
        if (props.allowSameDay && compareToStart === 0 && compareToEnd === 0) {
          return "start-end";
        }
        if (compareToStart === 0) {
          return "start";
        }
        if (compareToEnd === 0) {
          return "end";
        }
        if (compareToStart > 0 && compareToEnd < 0) {
          return "middle";
        }
        return "";
      };
      const getDayType = (day) => {
        const {
          type,
          minDate,
          maxDate,
          currentDate
        } = props;
        if (compareDay(day, minDate) < 0 || compareDay(day, maxDate) > 0) {
          return "disabled";
        }
        if (currentDate === null) {
          return "";
        }
        if (Array.isArray(currentDate)) {
          if (type === "multiple") {
            return getMultipleDayType(day);
          }
          if (type === "range") {
            return getRangeDayType(day);
          }
        } else if (type === "single") {
          return compareDay(day, currentDate) === 0 ? "selected" : "";
        }
        return "";
      };
      const getBottomInfo = (dayType) => {
        if (props.type === "range") {
          if (dayType === "start" || dayType === "end") {
            return t$f(dayType);
          }
          if (dayType === "start-end") {
            return `${t$f("start")}/${t$f("end")}`;
          }
        }
      };
      const renderTitle = () => {
        if (props.showMonthTitle) {
          return vue.createVNode("div", {
            "class": bem$11("month-title")
          }, [title.value]);
        }
      };
      const renderMark = () => {
        if (props.showMark && shouldRender.value) {
          return vue.createVNode("div", {
            "class": bem$11("month-mark")
          }, [props.date.getMonth() + 1]);
        }
      };
      const placeholders = vue.computed(() => {
        const count = Math.ceil((totalDay.value + offset2.value) / 7);
        return Array(count).fill({
          type: "placeholder"
        });
      });
      const days = vue.computed(() => {
        const days2 = [];
        const year = props.date.getFullYear();
        const month = props.date.getMonth();
        for (let day = 1; day <= totalDay.value; day++) {
          const date = new Date(year, month, day);
          const type = getDayType(date);
          let config = {
            date,
            type,
            text: day,
            bottomInfo: getBottomInfo(type)
          };
          if (props.formatter) {
            config = props.formatter(config);
          }
          days2.push(config);
        }
        return days2;
      });
      const disabledDays = vue.computed(() => days.value.filter((day) => day.type === "disabled"));
      const scrollToDate = (body, targetDate) => {
        if (daysRef.value) {
          const daysRect = useRect(daysRef.value);
          const totalRows = placeholders.value.length;
          const currentRow = Math.ceil((targetDate.getDate() + offset2.value) / 7);
          const rowOffset = (currentRow - 1) * daysRect.height / totalRows;
          setScrollTop(body, daysRect.top + rowOffset + body.scrollTop - useRect(body).top);
        }
      };
      const renderDay = (item, index) => vue.createVNode(stdin_default$18, {
        "item": item,
        "index": index,
        "color": props.color,
        "offset": offset2.value,
        "rowHeight": rowHeight.value,
        "onClick": (item2) => emit("click", item2)
      }, pick(slots, ["top-info", "bottom-info"]));
      const renderDays = () => vue.createVNode("div", {
        "ref": daysRef,
        "role": "grid",
        "class": bem$11("days")
      }, [renderMark(), (shouldRender.value ? days : placeholders).value.map(renderDay)]);
      useExpose({
        getTitle,
        getHeight: () => height2.value,
        setVisible,
        scrollToDate,
        disabledDays
      });
      return () => vue.createVNode("div", {
        "class": bem$11("month"),
        "ref": monthRef
      }, [renderTitle(), renderDays()]);
    }
  });
  const [name$12] = createNamespace("calendar-header");
  var stdin_default$16 = vue.defineComponent({
    name: name$12,
    props: {
      title: String,
      subtitle: String,
      showTitle: Boolean,
      showSubtitle: Boolean,
      firstDayOfWeek: Number
    },
    emits: ["click-subtitle"],
    setup(props, {
      slots,
      emit
    }) {
      const renderTitle = () => {
        if (props.showTitle) {
          const text = props.title || t$f("title");
          const title = slots.title ? slots.title() : text;
          return vue.createVNode("div", {
            "class": bem$11("header-title")
          }, [title]);
        }
      };
      const onClickSubtitle = (event) => emit("click-subtitle", event);
      const renderSubtitle = () => {
        if (props.showSubtitle) {
          const title = slots.subtitle ? slots.subtitle() : props.subtitle;
          return vue.createVNode("div", {
            "class": bem$11("header-subtitle"),
            "onClick": onClickSubtitle
          }, [title]);
        }
      };
      const renderWeekDays = () => {
        const {
          firstDayOfWeek
        } = props;
        const weekdays = t$f("weekdays");
        const renderWeekDays2 = [...weekdays.slice(firstDayOfWeek, 7), ...weekdays.slice(0, firstDayOfWeek)];
        return vue.createVNode("div", {
          "class": bem$11("weekdays")
        }, [renderWeekDays2.map((text) => vue.createVNode("span", {
          "class": bem$11("weekday")
        }, [text]))]);
      };
      return () => vue.createVNode("div", {
        "class": bem$11("header")
      }, [renderTitle(), renderSubtitle(), renderWeekDays()]);
    }
  });
  const calendarProps = {
    show: Boolean,
    type: makeStringProp("single"),
    title: String,
    color: String,
    round: truthProp,
    readonly: Boolean,
    poppable: truthProp,
    maxRange: makeNumericProp(null),
    position: makeStringProp("bottom"),
    teleport: [String, Object],
    showMark: truthProp,
    showTitle: truthProp,
    formatter: Function,
    rowHeight: numericProp,
    confirmText: String,
    rangePrompt: String,
    lazyRender: truthProp,
    showConfirm: truthProp,
    defaultDate: [Date, Array],
    allowSameDay: Boolean,
    showSubtitle: truthProp,
    closeOnPopstate: truthProp,
    showRangePrompt: truthProp,
    confirmDisabledText: String,
    closeOnClickOverlay: truthProp,
    safeAreaInsetTop: Boolean,
    safeAreaInsetBottom: truthProp,
    minDate: {
      type: Date,
      validator: isDate,
      default: getToday
    },
    maxDate: {
      type: Date,
      validator: isDate,
      default: () => {
        const now = getToday();
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
      }
    },
    firstDayOfWeek: {
      type: numericProp,
      default: 0,
      validator: (val) => val >= 0 && val <= 6
    }
  };
  var stdin_default$15 = vue.defineComponent({
    name: name$15,
    props: calendarProps,
    emits: ["select", "confirm", "unselect", "month-show", "over-range", "update:show", "click-subtitle"],
    setup(props, {
      emit,
      slots
    }) {
      const limitDateRange = (date, minDate = props.minDate, maxDate = props.maxDate) => {
        if (compareDay(date, minDate) === -1) {
          return minDate;
        }
        if (compareDay(date, maxDate) === 1) {
          return maxDate;
        }
        return date;
      };
      const getInitialDate = (defaultDate = props.defaultDate) => {
        const {
          type,
          minDate,
          maxDate,
          allowSameDay
        } = props;
        if (defaultDate === null) {
          return defaultDate;
        }
        const now = getToday();
        if (type === "range") {
          if (!Array.isArray(defaultDate)) {
            defaultDate = [];
          }
          const start2 = limitDateRange(defaultDate[0] || now, minDate, allowSameDay ? maxDate : getPrevDay(maxDate));
          const end2 = limitDateRange(defaultDate[1] || now, allowSameDay ? minDate : getNextDay(minDate));
          return [start2, end2];
        }
        if (type === "multiple") {
          if (Array.isArray(defaultDate)) {
            return defaultDate.map((date) => limitDateRange(date));
          }
          return [limitDateRange(now)];
        }
        if (!defaultDate || Array.isArray(defaultDate)) {
          defaultDate = now;
        }
        return limitDateRange(defaultDate);
      };
      let bodyHeight;
      const bodyRef = vue.ref();
      const subtitle = vue.ref("");
      const currentDate = vue.ref(getInitialDate());
      const [monthRefs, setMonthRefs] = useRefs();
      const dayOffset = vue.computed(() => props.firstDayOfWeek ? +props.firstDayOfWeek % 7 : 0);
      const months = vue.computed(() => {
        const months2 = [];
        const cursor = new Date(props.minDate);
        cursor.setDate(1);
        do {
          months2.push(new Date(cursor));
          cursor.setMonth(cursor.getMonth() + 1);
        } while (compareMonth(cursor, props.maxDate) !== 1);
        return months2;
      });
      const buttonDisabled = vue.computed(() => {
        if (currentDate.value) {
          if (props.type === "range") {
            return !currentDate.value[0] || !currentDate.value[1];
          }
          if (props.type === "multiple") {
            return !currentDate.value.length;
          }
        }
        return !currentDate.value;
      });
      const getSelectedDate = () => currentDate.value;
      const onScroll = () => {
        const top2 = getScrollTop(bodyRef.value);
        const bottom2 = top2 + bodyHeight;
        const heights = months.value.map((item, index) => monthRefs.value[index].getHeight());
        const heightSum = heights.reduce((a2, b2) => a2 + b2, 0);
        if (bottom2 > heightSum && top2 > 0) {
          return;
        }
        let height2 = 0;
        let currentMonth;
        const visibleRange = [-1, -1];
        for (let i2 = 0; i2 < months.value.length; i2++) {
          const month = monthRefs.value[i2];
          const visible = height2 <= bottom2 && height2 + heights[i2] >= top2;
          if (visible) {
            visibleRange[1] = i2;
            if (!currentMonth) {
              currentMonth = month;
              visibleRange[0] = i2;
            }
            if (!monthRefs.value[i2].showed) {
              monthRefs.value[i2].showed = true;
              emit("month-show", {
                date: month.date,
                title: month.getTitle()
              });
            }
          }
          height2 += heights[i2];
        }
        months.value.forEach((month, index) => {
          const visible = index >= visibleRange[0] - 1 && index <= visibleRange[1] + 1;
          monthRefs.value[index].setVisible(visible);
        });
        if (currentMonth) {
          subtitle.value = currentMonth.getTitle();
        }
      };
      const scrollToDate = (targetDate) => {
        raf(() => {
          months.value.some((month, index) => {
            if (compareMonth(month, targetDate) === 0) {
              if (bodyRef.value) {
                monthRefs.value[index].scrollToDate(bodyRef.value, targetDate);
              }
              return true;
            }
            return false;
          });
          onScroll();
        });
      };
      const scrollToCurrentDate = () => {
        if (props.poppable && !props.show) {
          return;
        }
        if (currentDate.value) {
          const targetDate = props.type === "single" ? currentDate.value : currentDate.value[0];
          if (isDate(targetDate)) {
            scrollToDate(targetDate);
          }
        } else {
          raf(onScroll);
        }
      };
      const init = () => {
        if (props.poppable && !props.show) {
          return;
        }
        raf(() => {
          bodyHeight = Math.floor(useRect(bodyRef).height);
        });
        scrollToCurrentDate();
      };
      const reset = (date = getInitialDate()) => {
        currentDate.value = date;
        scrollToCurrentDate();
      };
      const checkRange = (date) => {
        const {
          maxRange,
          rangePrompt,
          showRangePrompt
        } = props;
        if (maxRange && calcDateNum(date) > maxRange) {
          if (showRangePrompt) {
            Toast$1(rangePrompt || t$f("rangePrompt", maxRange));
          }
          emit("over-range");
          return false;
        }
        return true;
      };
      const onConfirm = () => {
        var _a;
        return emit("confirm", (_a = currentDate.value) != null ? _a : cloneDates(currentDate.value));
      };
      const select = (date, complete) => {
        const setCurrentDate = (date2) => {
          currentDate.value = date2;
          emit("select", cloneDates(date2));
        };
        if (complete && props.type === "range") {
          const valid = checkRange(date);
          if (!valid) {
            setCurrentDate([date[0], getDayByOffset(date[0], +props.maxRange - 1)]);
            return;
          }
        }
        setCurrentDate(date);
        if (complete && !props.showConfirm) {
          onConfirm();
        }
      };
      const getDisabledDate = (disabledDays2, startDay, date) => {
        var _a;
        return (_a = disabledDays2.find((day) => compareDay(startDay, day.date) === -1 && compareDay(day.date, date) === -1)) == null ? void 0 : _a.date;
      };
      const disabledDays = vue.computed(() => monthRefs.value.reduce((arr, ref2) => {
        var _a, _b;
        arr.push(...(_b = (_a = ref2.disabledDays) == null ? void 0 : _a.value) != null ? _b : []);
        return arr;
      }, []));
      const onClickDay = (item) => {
        if (props.readonly || !item.date) {
          return;
        }
        const {
          date
        } = item;
        const {
          type
        } = props;
        if (type === "range") {
          if (!currentDate.value) {
            select([date]);
            return;
          }
          const [startDay, endDay] = currentDate.value;
          if (startDay && !endDay) {
            const compareToStart = compareDay(date, startDay);
            if (compareToStart === 1) {
              const disabledDay = getDisabledDate(disabledDays.value, startDay, date);
              if (disabledDay) {
                const endDay2 = getPrevDay(disabledDay);
                if (compareDay(startDay, endDay2) === -1) {
                  select([startDay, endDay2]);
                } else {
                  select([date]);
                }
              } else {
                select([startDay, date], true);
              }
            } else if (compareToStart === -1) {
              select([date]);
            } else if (props.allowSameDay) {
              select([date, date], true);
            }
          } else {
            select([date]);
          }
        } else if (type === "multiple") {
          if (!currentDate.value) {
            select([date]);
            return;
          }
          const dates = currentDate.value;
          const selectedIndex = dates.findIndex((dateItem) => compareDay(dateItem, date) === 0);
          if (selectedIndex !== -1) {
            const [unselectedDate] = dates.splice(selectedIndex, 1);
            emit("unselect", cloneDate(unselectedDate));
          } else if (props.maxRange && dates.length >= props.maxRange) {
            Toast$1(props.rangePrompt || t$f("rangePrompt", props.maxRange));
          } else {
            select([...dates, date]);
          }
        } else {
          select(date, true);
        }
      };
      const updateShow = (value) => emit("update:show", value);
      const renderMonth = (date, index) => {
        const showMonthTitle = index !== 0 || !props.showSubtitle;
        return vue.createVNode(stdin_default$17, vue.mergeProps({
          "ref": setMonthRefs(index),
          "date": date,
          "currentDate": currentDate.value,
          "showMonthTitle": showMonthTitle,
          "firstDayOfWeek": dayOffset.value
        }, pick(props, ["type", "color", "minDate", "maxDate", "showMark", "formatter", "rowHeight", "lazyRender", "showSubtitle", "allowSameDay"]), {
          "onClick": onClickDay
        }), pick(slots, ["top-info", "bottom-info"]));
      };
      const renderFooterButton = () => {
        if (slots.footer) {
          return slots.footer();
        }
        if (props.showConfirm) {
          const slot = slots["confirm-text"];
          const disabled = buttonDisabled.value;
          const text = disabled ? props.confirmDisabledText : props.confirmText;
          return vue.createVNode(Button, {
            "round": true,
            "block": true,
            "type": "danger",
            "color": props.color,
            "class": bem$11("confirm"),
            "disabled": disabled,
            "nativeType": "button",
            "onClick": onConfirm
          }, {
            default: () => [slot ? slot({
              disabled
            }) : text || t$f("confirm")]
          });
        }
      };
      const renderFooter = () => vue.createVNode("div", {
        "class": [bem$11("footer"), {
          "van-safe-area-bottom": props.safeAreaInsetBottom
        }]
      }, [renderFooterButton()]);
      const renderCalendar = () => vue.createVNode("div", {
        "class": bem$11()
      }, [vue.createVNode(stdin_default$16, {
        "title": props.title,
        "subtitle": subtitle.value,
        "showTitle": props.showTitle,
        "showSubtitle": props.showSubtitle,
        "firstDayOfWeek": dayOffset.value,
        "onClick-subtitle": (event) => emit("click-subtitle", event)
      }, pick(slots, ["title", "subtitle"])), vue.createVNode("div", {
        "ref": bodyRef,
        "class": bem$11("body"),
        "onScroll": onScroll
      }, [months.value.map(renderMonth)]), renderFooter()]);
      vue.watch(() => props.show, init);
      vue.watch(() => [props.type, props.minDate, props.maxDate], () => reset(getInitialDate(currentDate.value)));
      vue.watch(() => props.defaultDate, (value = null) => {
        currentDate.value = value;
        scrollToCurrentDate();
      });
      useExpose({
        reset,
        scrollToDate,
        getSelectedDate
      });
      onMountedOrActivated(init);
      return () => {
        if (props.poppable) {
          return vue.createVNode(Popup, {
            "show": props.show,
            "class": bem$11("popup"),
            "round": props.round,
            "position": props.position,
            "closeable": props.showTitle || props.showSubtitle,
            "teleport": props.teleport,
            "closeOnPopstate": props.closeOnPopstate,
            "safeAreaInsetTop": props.safeAreaInsetTop,
            "closeOnClickOverlay": props.closeOnClickOverlay,
            "onUpdate:show": updateShow
          }, {
            default: renderCalendar
          });
        }
        return renderCalendar();
      };
    }
  });
  const Calendar = withInstall(stdin_default$15);
  const [name$11, bem$10] = createNamespace("image");
  const imageProps = {
    src: String,
    alt: String,
    fit: String,
    position: String,
    round: Boolean,
    block: Boolean,
    width: numericProp,
    height: numericProp,
    radius: numericProp,
    lazyLoad: Boolean,
    iconSize: numericProp,
    showError: truthProp,
    errorIcon: makeStringProp("photo-fail"),
    iconPrefix: String,
    showLoading: truthProp,
    loadingIcon: makeStringProp("photo")
  };
  var stdin_default$14 = vue.defineComponent({
    name: name$11,
    props: imageProps,
    emits: ["load", "error"],
    setup(props, {
      emit,
      slots
    }) {
      const error = vue.ref(false);
      const loading = vue.ref(true);
      const imageRef = vue.ref();
      const {
        $Lazyload
      } = vue.getCurrentInstance().proxy;
      const style = vue.computed(() => {
        const style2 = {
          width: addUnit(props.width),
          height: addUnit(props.height)
        };
        if (isDef(props.radius)) {
          style2.overflow = "hidden";
          style2.borderRadius = addUnit(props.radius);
        }
        return style2;
      });
      vue.watch(() => props.src, () => {
        error.value = false;
        loading.value = true;
      });
      const onLoad = (event) => {
        loading.value = false;
        emit("load", event);
      };
      const onError = (event) => {
        error.value = true;
        loading.value = false;
        emit("error", event);
      };
      const renderIcon = (name2, className, slot) => {
        if (slot) {
          return slot();
        }
        return vue.createVNode(Icon, {
          "name": name2,
          "size": props.iconSize,
          "class": className,
          "classPrefix": props.iconPrefix
        }, null);
      };
      const renderPlaceholder = () => {
        if (loading.value && props.showLoading) {
          return vue.createVNode("div", {
            "class": bem$10("loading")
          }, [renderIcon(props.loadingIcon, bem$10("loading-icon"), slots.loading)]);
        }
        if (error.value && props.showError) {
          return vue.createVNode("div", {
            "class": bem$10("error")
          }, [renderIcon(props.errorIcon, bem$10("error-icon"), slots.error)]);
        }
      };
      const renderImage = () => {
        if (error.value || !props.src) {
          return;
        }
        const attrs = {
          alt: props.alt,
          class: bem$10("img"),
          style: {
            objectFit: props.fit,
            objectPosition: props.position
          }
        };
        if (props.lazyLoad) {
          return vue.withDirectives(vue.createVNode("img", vue.mergeProps({
            "ref": imageRef
          }, attrs), null), [[vue.resolveDirective("lazy"), props.src]]);
        }
        return vue.createVNode("img", vue.mergeProps({
          "src": props.src,
          "onLoad": onLoad,
          "onError": onError
        }, attrs), null);
      };
      const onLazyLoaded = ({
        el
      }) => {
        const check = () => {
          if (el === imageRef.value && loading.value) {
            onLoad();
          }
        };
        if (imageRef.value) {
          check();
        } else {
          vue.nextTick(check);
        }
      };
      const onLazyLoadError = ({
        el
      }) => {
        if (el === imageRef.value && !error.value) {
          onError();
        }
      };
      if ($Lazyload && inBrowser$1) {
        $Lazyload.$on("loaded", onLazyLoaded);
        $Lazyload.$on("error", onLazyLoadError);
        vue.onBeforeUnmount(() => {
          $Lazyload.$off("loaded", onLazyLoaded);
          $Lazyload.$off("error", onLazyLoadError);
        });
      }
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$10({
            round: props.round,
            block: props.block
          }),
          "style": style.value
        }, [renderImage(), renderPlaceholder(), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Image = withInstall(stdin_default$14);
  const [name$10, bem$$] = createNamespace("card");
  const cardProps = {
    tag: String,
    num: numericProp,
    desc: String,
    thumb: String,
    title: String,
    price: numericProp,
    centered: Boolean,
    lazyLoad: Boolean,
    currency: makeStringProp("\xA5"),
    thumbLink: String,
    originPrice: numericProp
  };
  var stdin_default$13 = vue.defineComponent({
    name: name$10,
    props: cardProps,
    emits: ["click-thumb"],
    setup(props, {
      slots,
      emit
    }) {
      const renderTitle = () => {
        if (slots.title) {
          return slots.title();
        }
        if (props.title) {
          return vue.createVNode("div", {
            "class": [bem$$("title"), "van-multi-ellipsis--l2"]
          }, [props.title]);
        }
      };
      const renderThumbTag = () => {
        if (slots.tag || props.tag) {
          return vue.createVNode("div", {
            "class": bem$$("tag")
          }, [slots.tag ? slots.tag() : vue.createVNode(Tag, {
            "mark": true,
            "type": "danger"
          }, {
            default: () => [props.tag]
          })]);
        }
      };
      const renderThumbImage = () => {
        if (slots.thumb) {
          return slots.thumb();
        }
        return vue.createVNode(Image, {
          "src": props.thumb,
          "fit": "cover",
          "width": "100%",
          "height": "100%",
          "lazyLoad": props.lazyLoad
        }, null);
      };
      const renderThumb = () => {
        if (slots.thumb || props.thumb) {
          return vue.createVNode("a", {
            "href": props.thumbLink,
            "class": bem$$("thumb"),
            "onClick": (event) => emit("click-thumb", event)
          }, [renderThumbImage(), renderThumbTag()]);
        }
      };
      const renderDesc = () => {
        if (slots.desc) {
          return slots.desc();
        }
        if (props.desc) {
          return vue.createVNode("div", {
            "class": [bem$$("desc"), "van-ellipsis"]
          }, [props.desc]);
        }
      };
      const renderPriceText = () => {
        const priceArr = props.price.toString().split(".");
        return vue.createVNode("div", null, [vue.createVNode("span", {
          "class": bem$$("price-currency")
        }, [props.currency]), vue.createVNode("span", {
          "class": bem$$("price-integer")
        }, [priceArr[0]]), vue.createTextVNode("."), vue.createVNode("span", {
          "class": bem$$("price-decimal")
        }, [priceArr[1]])]);
      };
      return () => {
        var _a, _b, _c;
        const showNum = slots.num || isDef(props.num);
        const showPrice = slots.price || isDef(props.price);
        const showOriginPrice = slots["origin-price"] || isDef(props.originPrice);
        const showBottom = showNum || showPrice || showOriginPrice || slots.bottom;
        const Price = showPrice && vue.createVNode("div", {
          "class": bem$$("price")
        }, [slots.price ? slots.price() : renderPriceText()]);
        const OriginPrice = showOriginPrice && vue.createVNode("div", {
          "class": bem$$("origin-price")
        }, [slots["origin-price"] ? slots["origin-price"]() : `${props.currency} ${props.originPrice}`]);
        const Num = showNum && vue.createVNode("div", {
          "class": bem$$("num")
        }, [slots.num ? slots.num() : `x${props.num}`]);
        const Footer = slots.footer && vue.createVNode("div", {
          "class": bem$$("footer")
        }, [slots.footer()]);
        const Bottom = showBottom && vue.createVNode("div", {
          "class": bem$$("bottom")
        }, [(_a = slots["price-top"]) == null ? void 0 : _a.call(slots), Price, OriginPrice, Num, (_b = slots.bottom) == null ? void 0 : _b.call(slots)]);
        return vue.createVNode("div", {
          "class": bem$$()
        }, [vue.createVNode("div", {
          "class": bem$$("header")
        }, [renderThumb(), vue.createVNode("div", {
          "class": bem$$("content", {
            centered: props.centered
          })
        }, [vue.createVNode("div", null, [renderTitle(), renderDesc(), (_c = slots.tags) == null ? void 0 : _c.call(slots)]), Bottom])]), Footer]);
      };
    }
  });
  const Card = withInstall(stdin_default$13);
  function scrollLeftTo(scroller, to, duration) {
    let count = 0;
    const from = scroller.scrollLeft;
    const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
    function animate() {
      scroller.scrollLeft += (to - from) / frames;
      if (++count < frames) {
        raf(animate);
      }
    }
    animate();
  }
  function scrollTopTo(scroller, to, duration, callback) {
    let current2 = getScrollTop(scroller);
    const isDown = current2 < to;
    const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
    const step = (to - current2) / frames;
    function animate() {
      current2 += step;
      if (isDown && current2 > to || !isDown && current2 < to) {
        current2 = to;
      }
      setScrollTop(scroller, current2);
      if (isDown && current2 < to || !isDown && current2 > to) {
        raf(animate);
      } else if (callback) {
        raf(callback);
      }
    }
    animate();
  }
  function useVisibilityChange(target, onChange) {
    if (!inBrowser$1 || !window.IntersectionObserver) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      onChange(entries[0].intersectionRatio > 0);
    }, { root: document.body });
    const observe = () => {
      if (target.value) {
        observer.observe(target.value);
      }
    };
    const unobserve = () => {
      if (target.value) {
        observer.unobserve(target.value);
      }
    };
    vue.onDeactivated(unobserve);
    vue.onBeforeUnmount(unobserve);
    onMountedOrActivated(observe);
  }
  const [name$$, bem$_] = createNamespace("sticky");
  const stickyProps = {
    zIndex: numericProp,
    position: makeStringProp("top"),
    container: Object,
    offsetTop: makeNumericProp(0),
    offsetBottom: makeNumericProp(0)
  };
  var stdin_default$12 = vue.defineComponent({
    name: name$$,
    props: stickyProps,
    emits: ["scroll", "change"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const scrollParent = useScrollParent(root);
      const state = vue.reactive({
        fixed: false,
        width: 0,
        height: 0,
        transform: 0
      });
      const offset2 = vue.computed(() => unitToPx(props.position === "top" ? props.offsetTop : props.offsetBottom));
      const rootStyle = vue.computed(() => {
        const {
          fixed,
          height: height2,
          width: width2
        } = state;
        if (fixed) {
          return {
            width: `${width2}px`,
            height: `${height2}px`
          };
        }
      });
      const stickyStyle = vue.computed(() => {
        if (!state.fixed) {
          return;
        }
        const style = extend(getZIndexStyle(props.zIndex), {
          width: `${state.width}px`,
          height: `${state.height}px`,
          [props.position]: `${offset2.value}px`
        });
        if (state.transform) {
          style.transform = `translate3d(0, ${state.transform}px, 0)`;
        }
        return style;
      });
      const emitScroll = (scrollTop) => emit("scroll", {
        scrollTop,
        isFixed: state.fixed
      });
      const onScroll = () => {
        if (!root.value || isHidden(root)) {
          return;
        }
        const {
          container,
          position
        } = props;
        const rootRect = useRect(root);
        const scrollTop = getScrollTop(window);
        state.width = rootRect.width;
        state.height = rootRect.height;
        if (position === "top") {
          if (container) {
            const containerRect = useRect(container);
            const difference = containerRect.bottom - offset2.value - state.height;
            state.fixed = offset2.value > rootRect.top && containerRect.bottom > 0;
            state.transform = difference < 0 ? difference : 0;
          } else {
            state.fixed = offset2.value > rootRect.top;
          }
        } else {
          const {
            clientHeight
          } = document.documentElement;
          if (container) {
            const containerRect = useRect(container);
            const difference = clientHeight - containerRect.top - offset2.value - state.height;
            state.fixed = clientHeight - offset2.value < rootRect.bottom && clientHeight > containerRect.top;
            state.transform = difference < 0 ? -difference : 0;
          } else {
            state.fixed = clientHeight - offset2.value < rootRect.bottom;
          }
        }
        emitScroll(scrollTop);
      };
      vue.watch(() => state.fixed, (value) => emit("change", value));
      useEventListener("scroll", onScroll, {
        target: scrollParent,
        passive: true
      });
      useVisibilityChange(root, onScroll);
      return () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "style": rootStyle.value
        }, [vue.createVNode("div", {
          "class": bem$_({
            fixed: state.fixed
          }),
          "style": stickyStyle.value
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
      };
    }
  });
  const Sticky = withInstall(stdin_default$12);
  const [name$_, bem$Z] = createNamespace("tab");
  var stdin_default$11 = vue.defineComponent({
    name: name$_,
    props: {
      id: String,
      dot: Boolean,
      type: String,
      color: String,
      title: String,
      badge: numericProp,
      shrink: Boolean,
      isActive: Boolean,
      disabled: Boolean,
      controls: String,
      scrollable: Boolean,
      activeColor: String,
      inactiveColor: String,
      showZeroBadge: truthProp
    },
    setup(props, {
      slots
    }) {
      const style = vue.computed(() => {
        const style2 = {};
        const {
          type,
          color,
          disabled,
          isActive,
          activeColor,
          inactiveColor
        } = props;
        const isCard = type === "card";
        if (color && isCard) {
          style2.borderColor = color;
          if (!disabled) {
            if (isActive) {
              style2.backgroundColor = color;
            } else {
              style2.color = color;
            }
          }
        }
        const titleColor = isActive ? activeColor : inactiveColor;
        if (titleColor) {
          style2.color = titleColor;
        }
        return style2;
      });
      const renderText = () => {
        const Text2 = vue.createVNode("span", {
          "class": bem$Z("text", {
            ellipsis: !props.scrollable
          })
        }, [slots.title ? slots.title() : props.title]);
        if (props.dot || isDef(props.badge) && props.badge !== "") {
          return vue.createVNode(Badge, {
            "dot": props.dot,
            "content": props.badge,
            "showZero": props.showZeroBadge
          }, {
            default: () => [Text2]
          });
        }
        return Text2;
      };
      return () => vue.createVNode("div", {
        "id": props.id,
        "role": "tab",
        "class": [bem$Z([props.type, {
          grow: props.scrollable && !props.shrink,
          shrink: props.shrink,
          active: props.isActive,
          disabled: props.disabled
        }])],
        "style": style.value,
        "tabindex": props.disabled ? void 0 : props.isActive ? 0 : -1,
        "aria-selected": props.isActive,
        "aria-disabled": props.disabled || void 0,
        "aria-controls": props.controls
      }, [renderText()]);
    }
  });
  const [name$Z, bem$Y] = createNamespace("swipe");
  const swipeProps = {
    loop: truthProp,
    width: numericProp,
    height: numericProp,
    vertical: Boolean,
    autoplay: makeNumericProp(0),
    duration: makeNumericProp(500),
    touchable: truthProp,
    lazyRender: Boolean,
    initialSwipe: makeNumericProp(0),
    indicatorColor: String,
    showIndicators: truthProp,
    stopPropagation: truthProp
  };
  const SWIPE_KEY = Symbol(name$Z);
  var stdin_default$10 = vue.defineComponent({
    name: name$Z,
    props: swipeProps,
    emits: ["change"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const track = vue.ref();
      const state = vue.reactive({
        rect: null,
        width: 0,
        height: 0,
        offset: 0,
        active: 0,
        swiping: false
      });
      const touch = useTouch();
      const {
        children,
        linkChildren
      } = useChildren(SWIPE_KEY);
      const count = vue.computed(() => children.length);
      const size = vue.computed(() => state[props.vertical ? "height" : "width"]);
      const delta = vue.computed(() => props.vertical ? touch.deltaY.value : touch.deltaX.value);
      const minOffset = vue.computed(() => {
        if (state.rect) {
          const base = props.vertical ? state.rect.height : state.rect.width;
          return base - size.value * count.value;
        }
        return 0;
      });
      const maxCount = vue.computed(() => Math.ceil(Math.abs(minOffset.value) / size.value));
      const trackSize = vue.computed(() => count.value * size.value);
      const activeIndicator = vue.computed(() => (state.active + count.value) % count.value);
      const isCorrectDirection = vue.computed(() => {
        const expect = props.vertical ? "vertical" : "horizontal";
        return touch.direction.value === expect;
      });
      const trackStyle = vue.computed(() => {
        const style = {
          transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
          transform: `translate${props.vertical ? "Y" : "X"}(${state.offset}px)`
        };
        if (size.value) {
          const mainAxis = props.vertical ? "height" : "width";
          const crossAxis = props.vertical ? "width" : "height";
          style[mainAxis] = `${trackSize.value}px`;
          style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : "";
        }
        return style;
      });
      const getTargetActive = (pace) => {
        const {
          active
        } = state;
        if (pace) {
          if (props.loop) {
            return clamp(active + pace, -1, count.value);
          }
          return clamp(active + pace, 0, maxCount.value);
        }
        return active;
      };
      const getTargetOffset = (targetActive, offset2 = 0) => {
        let currentPosition = targetActive * size.value;
        if (!props.loop) {
          currentPosition = Math.min(currentPosition, -minOffset.value);
        }
        let targetOffset = offset2 - currentPosition;
        if (!props.loop) {
          targetOffset = clamp(targetOffset, minOffset.value, 0);
        }
        return targetOffset;
      };
      const move = ({
        pace = 0,
        offset: offset2 = 0,
        emitChange
      }) => {
        if (count.value <= 1) {
          return;
        }
        const {
          active
        } = state;
        const targetActive = getTargetActive(pace);
        const targetOffset = getTargetOffset(targetActive, offset2);
        if (props.loop) {
          if (children[0] && targetOffset !== minOffset.value) {
            const outRightBound = targetOffset < minOffset.value;
            children[0].setOffset(outRightBound ? trackSize.value : 0);
          }
          if (children[count.value - 1] && targetOffset !== 0) {
            const outLeftBound = targetOffset > 0;
            children[count.value - 1].setOffset(outLeftBound ? -trackSize.value : 0);
          }
        }
        state.active = targetActive;
        state.offset = targetOffset;
        if (emitChange && targetActive !== active) {
          emit("change", activeIndicator.value);
        }
      };
      const correctPosition = () => {
        state.swiping = true;
        if (state.active <= -1) {
          move({
            pace: count.value
          });
        } else if (state.active >= count.value) {
          move({
            pace: -count.value
          });
        }
      };
      const prev = () => {
        correctPosition();
        touch.reset();
        doubleRaf(() => {
          state.swiping = false;
          move({
            pace: -1,
            emitChange: true
          });
        });
      };
      const next = () => {
        correctPosition();
        touch.reset();
        doubleRaf(() => {
          state.swiping = false;
          move({
            pace: 1,
            emitChange: true
          });
        });
      };
      let autoplayTimer;
      const stopAutoplay = () => clearTimeout(autoplayTimer);
      const autoplay = () => {
        stopAutoplay();
        if (props.autoplay > 0 && count.value > 1) {
          autoplayTimer = setTimeout(() => {
            next();
            autoplay();
          }, +props.autoplay);
        }
      };
      const initialize = (active = +props.initialSwipe) => {
        if (!root.value) {
          return;
        }
        const cb = () => {
          var _a, _b;
          if (!isHidden(root)) {
            const rect = {
              width: root.value.offsetWidth,
              height: root.value.offsetHeight
            };
            state.rect = rect;
            state.width = +((_a = props.width) != null ? _a : rect.width);
            state.height = +((_b = props.height) != null ? _b : rect.height);
          }
          if (count.value) {
            active = Math.min(count.value - 1, active);
          }
          state.active = active;
          state.swiping = true;
          state.offset = getTargetOffset(active);
          children.forEach((swipe) => {
            swipe.setOffset(0);
          });
          autoplay();
        };
        if (isHidden(root)) {
          vue.nextTick().then(cb);
        } else {
          cb();
        }
      };
      const resize = () => initialize(state.active);
      let touchStartTime;
      const onTouchStart = (event) => {
        if (!props.touchable)
          return;
        touch.start(event);
        touchStartTime = Date.now();
        stopAutoplay();
        correctPosition();
      };
      const onTouchMove = (event) => {
        if (props.touchable && state.swiping) {
          touch.move(event);
          if (isCorrectDirection.value) {
            const isEdgeTouch = !props.loop && (state.active === 0 && delta.value > 0 || state.active === count.value - 1 && delta.value < 0);
            if (!isEdgeTouch) {
              preventDefault(event, props.stopPropagation);
              move({
                offset: delta.value
              });
            }
          }
        }
      };
      const onTouchEnd = () => {
        if (!props.touchable || !state.swiping) {
          return;
        }
        const duration = Date.now() - touchStartTime;
        const speed = delta.value / duration;
        const shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(delta.value) > size.value / 2;
        if (shouldSwipe && isCorrectDirection.value) {
          const offset2 = props.vertical ? touch.offsetY.value : touch.offsetX.value;
          let pace = 0;
          if (props.loop) {
            pace = offset2 > 0 ? delta.value > 0 ? -1 : 1 : 0;
          } else {
            pace = -Math[delta.value > 0 ? "ceil" : "floor"](delta.value / size.value);
          }
          move({
            pace,
            emitChange: true
          });
        } else if (delta.value) {
          move({
            pace: 0
          });
        }
        state.swiping = false;
        autoplay();
      };
      const swipeTo = (index, options = {}) => {
        correctPosition();
        touch.reset();
        doubleRaf(() => {
          let targetIndex;
          if (props.loop && index === count.value) {
            targetIndex = state.active === 0 ? 0 : index;
          } else {
            targetIndex = index % count.value;
          }
          if (options.immediate) {
            doubleRaf(() => {
              state.swiping = false;
            });
          } else {
            state.swiping = false;
          }
          move({
            pace: targetIndex - state.active,
            emitChange: true
          });
        });
      };
      const renderDot = (_2, index) => {
        const active = index === activeIndicator.value;
        const style = active ? {
          backgroundColor: props.indicatorColor
        } : void 0;
        return vue.createVNode("i", {
          "style": style,
          "class": bem$Y("indicator", {
            active
          })
        }, null);
      };
      const renderIndicator = () => {
        if (slots.indicator) {
          return slots.indicator({
            active: activeIndicator.value,
            total: count.value
          });
        }
        if (props.showIndicators && count.value > 1) {
          return vue.createVNode("div", {
            "class": bem$Y("indicators", {
              vertical: props.vertical
            })
          }, [Array(count.value).fill("").map(renderDot)]);
        }
      };
      useExpose({
        prev,
        next,
        state,
        resize,
        swipeTo
      });
      linkChildren({
        size,
        props,
        count,
        activeIndicator
      });
      vue.watch(() => props.initialSwipe, (value) => initialize(+value));
      vue.watch(count, () => initialize(state.active));
      vue.watch(() => props.autoplay, autoplay);
      vue.watch([windowWidth, windowHeight], resize);
      vue.watch(usePageVisibility(), (visible) => {
        if (visible === "visible") {
          autoplay();
        } else {
          stopAutoplay();
        }
      });
      vue.onMounted(initialize);
      vue.onActivated(() => initialize(state.active));
      onPopupReopen(() => initialize(state.active));
      vue.onDeactivated(stopAutoplay);
      vue.onBeforeUnmount(stopAutoplay);
      useEventListener("touchmove", onTouchMove, {
        target: track
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "class": bem$Y()
        }, [vue.createVNode("div", {
          "ref": track,
          "style": trackStyle.value,
          "class": bem$Y("track", {
            vertical: props.vertical
          }),
          "onTouchstartPassive": onTouchStart,
          "onTouchend": onTouchEnd,
          "onTouchcancel": onTouchEnd
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), renderIndicator()]);
      };
    }
  });
  const Swipe = withInstall(stdin_default$10);
  const [name$Y, bem$X] = createNamespace("tabs");
  var stdin_default$$ = vue.defineComponent({
    name: name$Y,
    props: {
      count: makeRequiredProp(Number),
      inited: Boolean,
      animated: Boolean,
      duration: makeRequiredProp(numericProp),
      swipeable: Boolean,
      lazyRender: Boolean,
      currentIndex: makeRequiredProp(Number)
    },
    emits: ["change"],
    setup(props, {
      emit,
      slots
    }) {
      const swipeRef = vue.ref();
      const onChange = (index) => emit("change", index);
      const renderChildren = () => {
        var _a;
        const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (props.animated || props.swipeable) {
          return vue.createVNode(Swipe, {
            "ref": swipeRef,
            "loop": false,
            "class": bem$X("track"),
            "duration": +props.duration * 1e3,
            "touchable": props.swipeable,
            "lazyRender": props.lazyRender,
            "showIndicators": false,
            "onChange": onChange
          }, {
            default: () => [Content]
          });
        }
        return Content;
      };
      const swipeToCurrentTab = (index) => {
        const swipe = swipeRef.value;
        if (swipe && swipe.state.active !== index) {
          swipe.swipeTo(index, {
            immediate: !props.inited
          });
        }
      };
      vue.watch(() => props.currentIndex, swipeToCurrentTab);
      vue.onMounted(() => {
        swipeToCurrentTab(props.currentIndex);
      });
      useExpose({
        swipeRef
      });
      return () => vue.createVNode("div", {
        "class": bem$X("content", {
          animated: props.animated || props.swipeable
        })
      }, [renderChildren()]);
    }
  });
  const [name$X, bem$W] = createNamespace("tabs");
  const tabsProps = {
    type: makeStringProp("line"),
    color: String,
    border: Boolean,
    sticky: Boolean,
    shrink: Boolean,
    active: makeNumericProp(0),
    duration: makeNumericProp(0.3),
    animated: Boolean,
    ellipsis: truthProp,
    swipeable: Boolean,
    scrollspy: Boolean,
    offsetTop: makeNumericProp(0),
    background: String,
    lazyRender: truthProp,
    lineWidth: numericProp,
    lineHeight: numericProp,
    beforeChange: Function,
    swipeThreshold: makeNumericProp(5),
    titleActiveColor: String,
    titleInactiveColor: String
  };
  const TABS_KEY = Symbol(name$X);
  var stdin_default$_ = vue.defineComponent({
    name: name$X,
    props: tabsProps,
    emits: ["click", "change", "scroll", "disabled", "rendered", "click-tab", "update:active"],
    setup(props, {
      emit,
      slots
    }) {
      var _a, _b;
      {
        const props2 = (_b = (_a = vue.getCurrentInstance()) == null ? void 0 : _a.vnode) == null ? void 0 : _b.props;
        if (props2 && "onClick" in props2) {
          formatAppLog("warn", "at node_modules/vant/es/tabs/Tabs.mjs:50", '[Vant] Tabs: "click" event is deprecated, using "click-tab" instead.');
        }
        if (props2 && "onDisabled" in props2) {
          formatAppLog("warn", "at node_modules/vant/es/tabs/Tabs.mjs:53", '[Vant] Tabs: "disabled" event is deprecated, using "click-tab" instead.');
        }
      }
      let tabHeight;
      let lockScroll;
      let stickyFixed;
      const root = vue.ref();
      const navRef = vue.ref();
      const wrapRef = vue.ref();
      const contentRef = vue.ref();
      const id = useId();
      const scroller = useScrollParent(root);
      const [titleRefs, setTitleRefs] = useRefs();
      const {
        children,
        linkChildren
      } = useChildren(TABS_KEY);
      const state = vue.reactive({
        inited: false,
        position: "",
        lineStyle: {},
        currentIndex: -1
      });
      const scrollable = vue.computed(() => children.length > props.swipeThreshold || !props.ellipsis || props.shrink);
      const navStyle = vue.computed(() => ({
        borderColor: props.color,
        background: props.background
      }));
      const getTabName = (tab, index) => {
        var _a2;
        return (_a2 = tab.name) != null ? _a2 : index;
      };
      const currentName = vue.computed(() => {
        const activeTab = children[state.currentIndex];
        if (activeTab) {
          return getTabName(activeTab, state.currentIndex);
        }
      });
      const offsetTopPx = vue.computed(() => unitToPx(props.offsetTop));
      const scrollOffset = vue.computed(() => {
        if (props.sticky) {
          return offsetTopPx.value + tabHeight;
        }
        return 0;
      });
      const scrollIntoView = (immediate) => {
        const nav = navRef.value;
        const titles = titleRefs.value;
        if (!scrollable.value || !nav || !titles || !titles[state.currentIndex]) {
          return;
        }
        const title = titles[state.currentIndex].$el;
        const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
        scrollLeftTo(nav, to, immediate ? 0 : +props.duration);
      };
      const setLine = () => {
        const shouldAnimate = state.inited;
        vue.nextTick(() => {
          const titles = titleRefs.value;
          if (!titles || !titles[state.currentIndex] || props.type !== "line" || isHidden(root.value)) {
            return;
          }
          const title = titles[state.currentIndex].$el;
          const {
            lineWidth,
            lineHeight
          } = props;
          const left2 = title.offsetLeft + title.offsetWidth / 2;
          const lineStyle = {
            width: addUnit(lineWidth),
            backgroundColor: props.color,
            transform: `translateX(${left2}px) translateX(-50%)`
          };
          if (shouldAnimate) {
            lineStyle.transitionDuration = `${props.duration}s`;
          }
          if (isDef(lineHeight)) {
            const height2 = addUnit(lineHeight);
            lineStyle.height = height2;
            lineStyle.borderRadius = height2;
          }
          state.lineStyle = lineStyle;
        });
      };
      const findAvailableTab = (index) => {
        const diff = index < state.currentIndex ? -1 : 1;
        while (index >= 0 && index < children.length) {
          if (!children[index].disabled) {
            return index;
          }
          index += diff;
        }
      };
      const setCurrentIndex = (currentIndex, skipScrollIntoView) => {
        const newIndex = findAvailableTab(currentIndex);
        if (!isDef(newIndex)) {
          return;
        }
        const newTab = children[newIndex];
        const newName = getTabName(newTab, newIndex);
        const shouldEmitChange = state.currentIndex !== null;
        if (state.currentIndex !== newIndex) {
          state.currentIndex = newIndex;
          if (!skipScrollIntoView) {
            scrollIntoView();
          }
          setLine();
        }
        if (newName !== props.active) {
          emit("update:active", newName);
          if (shouldEmitChange) {
            emit("change", newName, newTab.title);
          }
        }
        if (stickyFixed && !props.scrollspy) {
          setRootScrollTop(Math.ceil(getElementTop(root.value) - offsetTopPx.value));
        }
      };
      const setCurrentIndexByName = (name2, skipScrollIntoView) => {
        const matched = children.find((tab, index2) => getTabName(tab, index2) === name2);
        const index = matched ? children.indexOf(matched) : 0;
        setCurrentIndex(index, skipScrollIntoView);
      };
      const scrollToCurrentContent = (immediate = false) => {
        if (props.scrollspy) {
          const target = children[state.currentIndex].$el;
          if (target && scroller.value) {
            const to = getElementTop(target, scroller.value) - scrollOffset.value;
            lockScroll = true;
            scrollTopTo(scroller.value, to, immediate ? 0 : +props.duration, () => {
              lockScroll = false;
            });
          }
        }
      };
      const onClickTab = (item, index, event) => {
        const {
          title,
          disabled
        } = children[index];
        const name2 = getTabName(children[index], index);
        if (disabled) {
          emit("disabled", name2, title);
        } else {
          callInterceptor(props.beforeChange, {
            args: [name2],
            done: () => {
              setCurrentIndex(index);
              scrollToCurrentContent();
            }
          });
          emit("click", name2, title);
          route(item);
        }
        emit("click-tab", {
          name: name2,
          title,
          event,
          disabled
        });
      };
      const onStickyScroll = (params) => {
        stickyFixed = params.isFixed;
        emit("scroll", params);
      };
      const scrollTo = (name2) => {
        vue.nextTick(() => {
          setCurrentIndexByName(name2);
          scrollToCurrentContent(true);
        });
      };
      const getCurrentIndexOnScroll = () => {
        for (let index = 0; index < children.length; index++) {
          const {
            top: top2
          } = useRect(children[index].$el);
          if (top2 > scrollOffset.value) {
            return index === 0 ? 0 : index - 1;
          }
        }
        return children.length - 1;
      };
      const onScroll = () => {
        if (props.scrollspy && !lockScroll) {
          const index = getCurrentIndexOnScroll();
          setCurrentIndex(index);
        }
      };
      const renderNav = () => children.map((item, index) => vue.createVNode(stdin_default$11, vue.mergeProps({
        "key": item.id,
        "id": `${id}-${index}`,
        "ref": setTitleRefs(index),
        "type": props.type,
        "color": props.color,
        "style": item.titleStyle,
        "class": item.titleClass,
        "shrink": props.shrink,
        "isActive": index === state.currentIndex,
        "controls": item.id,
        "scrollable": scrollable.value,
        "activeColor": props.titleActiveColor,
        "inactiveColor": props.titleInactiveColor,
        "onClick": (event) => onClickTab(item, index, event)
      }, pick(item, ["dot", "badge", "title", "disabled", "showZeroBadge"])), {
        title: item.$slots.title
      }));
      const renderLine = () => {
        if (props.type === "line" && children.length) {
          return vue.createVNode("div", {
            "class": bem$W("line"),
            "style": state.lineStyle
          }, null);
        }
      };
      const renderHeader = () => {
        var _a2, _b2, _c;
        const {
          type,
          border,
          sticky
        } = props;
        const Header = [vue.createVNode("div", {
          "ref": sticky ? void 0 : wrapRef,
          "class": [bem$W("wrap"), {
            [BORDER_TOP_BOTTOM]: type === "line" && border
          }]
        }, [vue.createVNode("div", {
          "ref": navRef,
          "role": "tablist",
          "class": bem$W("nav", [type, {
            shrink: props.shrink,
            complete: scrollable.value
          }]),
          "style": navStyle.value,
          "aria-orientation": "horizontal"
        }, [(_a2 = slots["nav-left"]) == null ? void 0 : _a2.call(slots), renderNav(), renderLine(), (_b2 = slots["nav-right"]) == null ? void 0 : _b2.call(slots)])]), (_c = slots["nav-bottom"]) == null ? void 0 : _c.call(slots)];
        if (sticky) {
          return vue.createVNode("div", {
            "ref": wrapRef
          }, [Header]);
        }
        return Header;
      };
      vue.watch([() => props.color, windowWidth], setLine);
      vue.watch(() => props.active, (value) => {
        if (value !== currentName.value) {
          setCurrentIndexByName(value);
        }
      });
      vue.watch(() => children.length, () => {
        if (state.inited) {
          setCurrentIndexByName(props.active);
          setLine();
          vue.nextTick(() => {
            scrollIntoView(true);
          });
        }
      });
      const init = () => {
        setCurrentIndexByName(props.active, true);
        vue.nextTick(() => {
          state.inited = true;
          if (wrapRef.value) {
            tabHeight = useRect(wrapRef.value).height;
          }
          scrollIntoView(true);
        });
      };
      const onRendered = (name2, title) => emit("rendered", name2, title);
      const resize = () => {
        setLine();
        vue.nextTick(() => {
          var _a2, _b2;
          return (_b2 = (_a2 = contentRef.value) == null ? void 0 : _a2.swipeRef.value) == null ? void 0 : _b2.resize();
        });
      };
      useExpose({
        resize,
        scrollTo
      });
      vue.onActivated(setLine);
      onPopupReopen(setLine);
      onMountedOrActivated(init);
      useEventListener("scroll", onScroll, {
        target: scroller,
        passive: true
      });
      linkChildren({
        id,
        props,
        setLine,
        onRendered,
        currentName,
        scrollIntoView
      });
      return () => vue.createVNode("div", {
        "ref": root,
        "class": bem$W([props.type])
      }, [props.sticky ? vue.createVNode(Sticky, {
        "container": root.value,
        "offsetTop": offsetTopPx.value,
        "onScroll": onStickyScroll
      }, {
        default: () => [renderHeader()]
      }) : renderHeader(), vue.createVNode(stdin_default$$, {
        "ref": contentRef,
        "count": children.length,
        "inited": state.inited,
        "animated": props.animated,
        "duration": props.duration,
        "swipeable": props.swipeable,
        "lazyRender": props.lazyRender,
        "currentIndex": state.currentIndex,
        "onChange": setCurrentIndex
      }, {
        default: () => {
          var _a2;
          return [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)];
        }
      })]);
    }
  });
  const TAB_STATUS_KEY = Symbol();
  const useTabStatus = () => vue.inject(TAB_STATUS_KEY, null);
  const [name$W, bem$V] = createNamespace("swipe-item");
  var stdin_default$Z = vue.defineComponent({
    name: name$W,
    setup(props, {
      slots
    }) {
      let rendered;
      const state = vue.reactive({
        offset: 0,
        inited: false,
        mounted: false
      });
      const {
        parent,
        index
      } = useParent(SWIPE_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/swipe-item/SwipeItem.mjs:25", "[Vant] <SwipeItem> must be a child component of <Swipe>.");
        }
        return;
      }
      const style = vue.computed(() => {
        const style2 = {};
        const {
          vertical
        } = parent.props;
        if (parent.size.value) {
          style2[vertical ? "height" : "width"] = `${parent.size.value}px`;
        }
        if (state.offset) {
          style2.transform = `translate${vertical ? "Y" : "X"}(${state.offset}px)`;
        }
        return style2;
      });
      const shouldRender = vue.computed(() => {
        const {
          loop,
          lazyRender
        } = parent.props;
        if (!lazyRender || rendered) {
          return true;
        }
        if (!state.mounted) {
          return false;
        }
        const active = parent.activeIndicator.value;
        const maxActive = parent.count.value - 1;
        const prevActive = active === 0 && loop ? maxActive : active - 1;
        const nextActive = active === maxActive && loop ? 0 : active + 1;
        rendered = index.value === active || index.value === prevActive || index.value === nextActive;
        return rendered;
      });
      const setOffset = (offset2) => {
        state.offset = offset2;
      };
      vue.onMounted(() => {
        vue.nextTick(() => {
          state.mounted = true;
        });
      });
      useExpose({
        setOffset
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$V(),
          "style": style.value
        }, [shouldRender.value ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null]);
      };
    }
  });
  const SwipeItem = withInstall(stdin_default$Z);
  const [name$V, bem$U] = createNamespace("tab");
  const tabProps = extend({}, routeProps, {
    dot: Boolean,
    name: numericProp,
    badge: numericProp,
    title: String,
    disabled: Boolean,
    titleClass: unknownProp,
    titleStyle: [String, Object],
    showZeroBadge: truthProp
  });
  var stdin_default$Y = vue.defineComponent({
    name: name$V,
    props: tabProps,
    setup(props, {
      slots
    }) {
      const id = useId();
      const inited = vue.ref(false);
      const {
        parent,
        index
      } = useParent(TABS_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/tab/Tab.mjs:36", "[Vant] <Tab> must be a child component of <Tabs>.");
        }
        return;
      }
      const getName = () => {
        var _a;
        return (_a = props.name) != null ? _a : index.value;
      };
      const init = () => {
        inited.value = true;
        if (parent.props.lazyRender) {
          vue.nextTick(() => {
            parent.onRendered(getName(), props.title);
          });
        }
      };
      const active = vue.computed(() => {
        const isActive = getName() === parent.currentName.value;
        if (isActive && !inited.value) {
          init();
        }
        return isActive;
      });
      const hasInactiveClass = vue.ref(!active.value);
      vue.watch(active, (val) => {
        if (val) {
          hasInactiveClass.value = false;
        } else {
          doubleRaf(() => {
            hasInactiveClass.value = true;
          });
        }
      });
      vue.watch(() => props.title, () => {
        parent.setLine();
        parent.scrollIntoView();
      });
      vue.provide(TAB_STATUS_KEY, active);
      return () => {
        var _a;
        const label = `${parent.id}-${index.value}`;
        const {
          animated,
          swipeable,
          scrollspy,
          lazyRender
        } = parent.props;
        if (!slots.default && !animated) {
          return;
        }
        const show = scrollspy || active.value;
        if (animated || swipeable) {
          return vue.createVNode(SwipeItem, {
            "id": id,
            "role": "tabpanel",
            "class": bem$U("panel-wrapper", {
              inactive: hasInactiveClass.value
            }),
            "tabindex": active.value ? 0 : -1,
            "aria-hidden": !active.value,
            "aria-labelledby": label
          }, {
            default: () => {
              var _a2;
              return [vue.createVNode("div", {
                "class": bem$U("panel")
              }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)])];
            }
          });
        }
        const shouldRender = inited.value || scrollspy || !lazyRender;
        const Content = shouldRender ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null;
        useExpose({
          id
        });
        return vue.withDirectives(vue.createVNode("div", {
          "id": id,
          "role": "tabpanel",
          "class": bem$U("panel"),
          "tabindex": show ? 0 : -1,
          "aria-labelledby": label
        }, [Content]), [[vue.vShow, show]]);
      };
    }
  });
  const Tab = withInstall(stdin_default$Y);
  const Tabs = withInstall(stdin_default$_);
  const [name$U, bem$T, t$e] = createNamespace("cascader");
  const cascaderProps = {
    title: String,
    options: makeArrayProp(),
    closeable: truthProp,
    swipeable: truthProp,
    closeIcon: makeStringProp("cross"),
    showHeader: truthProp,
    modelValue: numericProp,
    fieldNames: Object,
    placeholder: String,
    activeColor: String
  };
  var stdin_default$X = vue.defineComponent({
    name: name$U,
    props: cascaderProps,
    emits: ["close", "change", "finish", "click-tab", "update:modelValue"],
    setup(props, {
      slots,
      emit
    }) {
      const tabs = vue.ref([]);
      const activeTab = vue.ref(0);
      const {
        text: textKey,
        value: valueKey,
        children: childrenKey
      } = extend({
        text: "text",
        value: "value",
        children: "children"
      }, props.fieldNames);
      const getSelectedOptionsByValue = (options, value) => {
        for (const option of options) {
          if (option[valueKey] === value) {
            return [option];
          }
          if (option[childrenKey]) {
            const selectedOptions = getSelectedOptionsByValue(option[childrenKey], value);
            if (selectedOptions) {
              return [option, ...selectedOptions];
            }
          }
        }
      };
      const updateTabs = () => {
        const {
          options,
          modelValue
        } = props;
        if (modelValue !== void 0) {
          const selectedOptions = getSelectedOptionsByValue(options, modelValue);
          if (selectedOptions) {
            let optionsCursor = options;
            tabs.value = selectedOptions.map((option) => {
              const tab = {
                options: optionsCursor,
                selected: option
              };
              const next = optionsCursor.find((item) => item[valueKey] === option[valueKey]);
              if (next) {
                optionsCursor = next[childrenKey];
              }
              return tab;
            });
            if (optionsCursor) {
              tabs.value.push({
                options: optionsCursor,
                selected: null
              });
            }
            vue.nextTick(() => {
              activeTab.value = tabs.value.length - 1;
            });
            return;
          }
        }
        tabs.value = [{
          options,
          selected: null
        }];
      };
      const onSelect = (option, tabIndex) => {
        if (option.disabled) {
          return;
        }
        tabs.value[tabIndex].selected = option;
        if (tabs.value.length > tabIndex + 1) {
          tabs.value = tabs.value.slice(0, tabIndex + 1);
        }
        if (option[childrenKey]) {
          const nextTab = {
            options: option[childrenKey],
            selected: null
          };
          if (tabs.value[tabIndex + 1]) {
            tabs.value[tabIndex + 1] = nextTab;
          } else {
            tabs.value.push(nextTab);
          }
          vue.nextTick(() => {
            activeTab.value++;
          });
        }
        const selectedOptions = tabs.value.map((tab) => tab.selected).filter(Boolean);
        emit("update:modelValue", option[valueKey]);
        const params = {
          value: option[valueKey],
          tabIndex,
          selectedOptions
        };
        emit("change", params);
        if (!option[childrenKey]) {
          emit("finish", params);
        }
      };
      const onClose = () => emit("close");
      const onClickTab = ({
        name: name2,
        title
      }) => emit("click-tab", name2, title);
      const renderHeader = () => props.showHeader ? vue.createVNode("div", {
        "class": bem$T("header")
      }, [vue.createVNode("h2", {
        "class": bem$T("title")
      }, [slots.title ? slots.title() : props.title]), props.closeable ? vue.createVNode(Icon, {
        "name": props.closeIcon,
        "class": [bem$T("close-icon"), HAPTICS_FEEDBACK],
        "onClick": onClose
      }, null) : null]) : null;
      const renderOption = (option, selectedOption, tabIndex) => {
        const {
          disabled
        } = option;
        const selected = !!(selectedOption && option[valueKey] === selectedOption[valueKey]);
        const color = option.color || (selected ? props.activeColor : void 0);
        const Text2 = slots.option ? slots.option({
          option,
          selected
        }) : vue.createVNode("span", null, [option[textKey]]);
        return vue.createVNode("li", {
          "role": "menuitemradio",
          "class": [bem$T("option", {
            selected,
            disabled
          }), option.className],
          "style": {
            color
          },
          "tabindex": disabled ? void 0 : selected ? 0 : -1,
          "aria-checked": selected,
          "aria-disabled": disabled || void 0,
          "onClick": () => onSelect(option, tabIndex)
        }, [Text2, selected ? vue.createVNode(Icon, {
          "name": "success",
          "class": bem$T("selected-icon")
        }, null) : null]);
      };
      const renderOptions = (options, selectedOption, tabIndex) => vue.createVNode("ul", {
        "role": "menu",
        "class": bem$T("options")
      }, [options.map((option) => renderOption(option, selectedOption, tabIndex))]);
      const renderTab = (tab, tabIndex) => {
        const {
          options,
          selected
        } = tab;
        const placeholder = props.placeholder || t$e("select");
        const title = selected ? selected[textKey] : placeholder;
        return vue.createVNode(Tab, {
          "title": title,
          "titleClass": bem$T("tab", {
            unselected: !selected
          })
        }, {
          default: () => {
            var _a, _b;
            return [(_a = slots["options-top"]) == null ? void 0 : _a.call(slots, {
              tabIndex
            }), renderOptions(options, selected, tabIndex), (_b = slots["options-bottom"]) == null ? void 0 : _b.call(slots, {
              tabIndex
            })];
          }
        });
      };
      const renderTabs = () => vue.createVNode(Tabs, {
        "active": activeTab.value,
        "onUpdate:active": ($event) => activeTab.value = $event,
        "shrink": true,
        "animated": true,
        "class": bem$T("tabs"),
        "color": props.activeColor,
        "swipeable": props.swipeable,
        "onClick-tab": onClickTab
      }, {
        default: () => [tabs.value.map(renderTab)]
      });
      updateTabs();
      vue.watch(() => props.options, updateTabs, {
        deep: true
      });
      vue.watch(() => props.modelValue, (value) => {
        if (value !== void 0) {
          const values = tabs.value.map((tab) => {
            var _a;
            return (_a = tab.selected) == null ? void 0 : _a[valueKey];
          });
          if (values.includes(value)) {
            return;
          }
        }
        updateTabs();
      });
      return () => vue.createVNode("div", {
        "class": bem$T()
      }, [renderHeader(), renderTabs()]);
    }
  });
  const Cascader = withInstall(stdin_default$X);
  const [name$T, bem$S] = createNamespace("cell-group");
  const cellGroupProps = {
    title: String,
    inset: Boolean,
    border: truthProp
  };
  var stdin_default$W = vue.defineComponent({
    name: name$T,
    inheritAttrs: false,
    props: cellGroupProps,
    setup(props, {
      slots,
      attrs
    }) {
      const renderGroup = () => {
        var _a;
        return vue.createVNode("div", vue.mergeProps({
          "class": [bem$S({
            inset: props.inset
          }), {
            [BORDER_TOP_BOTTOM]: props.border && !props.inset
          }]
        }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
      const renderTitle = () => vue.createVNode("div", {
        "class": bem$S("title", {
          inset: props.inset
        })
      }, [slots.title ? slots.title() : props.title]);
      return () => {
        if (props.title || slots.title) {
          return vue.createVNode(vue.Fragment, null, [renderTitle(), renderGroup()]);
        }
        return renderGroup();
      };
    }
  });
  const CellGroup = withInstall(stdin_default$W);
  const [name$S, bem$R] = createNamespace("checkbox-group");
  const checkboxGroupProps = {
    max: numericProp,
    disabled: Boolean,
    iconSize: numericProp,
    direction: String,
    modelValue: makeArrayProp(),
    checkedColor: String
  };
  const CHECKBOX_GROUP_KEY = Symbol(name$S);
  var stdin_default$V = vue.defineComponent({
    name: name$S,
    props: checkboxGroupProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        children,
        linkChildren
      } = useChildren(CHECKBOX_GROUP_KEY);
      const updateValue = (value) => emit("update:modelValue", value);
      const toggleAll = (options = {}) => {
        if (typeof options === "boolean") {
          options = {
            checked: options
          };
        }
        const {
          checked,
          skipDisabled
        } = options;
        const checkedChildren = children.filter((item) => {
          if (!item.props.bindGroup) {
            return false;
          }
          if (item.props.disabled && skipDisabled) {
            return item.checked.value;
          }
          return checked != null ? checked : !item.checked.value;
        });
        const names = checkedChildren.map((item) => item.name);
        updateValue(names);
      };
      vue.watch(() => props.modelValue, (value) => emit("change", value));
      useExpose({
        toggleAll
      });
      useCustomFieldValue(() => props.modelValue);
      linkChildren({
        props,
        updateValue
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$R([props.direction])
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const [name$R, bem$Q] = createNamespace("checkbox");
  const checkboxProps = extend({}, checkerProps, {
    bindGroup: truthProp
  });
  var stdin_default$U = vue.defineComponent({
    name: name$R,
    props: checkboxProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        parent
      } = useParent(CHECKBOX_GROUP_KEY);
      const setParentValue = (checked2) => {
        const {
          name: name2
        } = props;
        const {
          max,
          modelValue
        } = parent.props;
        const value = modelValue.slice();
        if (checked2) {
          const overlimit = max && value.length >= max;
          if (!overlimit && !value.includes(name2)) {
            value.push(name2);
            if (props.bindGroup) {
              parent.updateValue(value);
            }
          }
        } else {
          const index = value.indexOf(name2);
          if (index !== -1) {
            value.splice(index, 1);
            if (props.bindGroup) {
              parent.updateValue(value);
            }
          }
        }
      };
      const checked = vue.computed(() => {
        if (parent && props.bindGroup) {
          return parent.props.modelValue.indexOf(props.name) !== -1;
        }
        return !!props.modelValue;
      });
      const toggle = (newValue = !checked.value) => {
        if (parent && props.bindGroup) {
          setParentValue(newValue);
        } else {
          emit("update:modelValue", newValue);
        }
      };
      vue.watch(() => props.modelValue, (value) => emit("change", value));
      useExpose({
        toggle,
        props,
        checked
      });
      useCustomFieldValue(() => props.modelValue);
      return () => vue.createVNode(stdin_default$1c, vue.mergeProps({
        "bem": bem$Q,
        "role": "checkbox",
        "parent": parent,
        "checked": checked.value,
        "onToggle": toggle
      }, props), pick(slots, ["default", "icon"]));
    }
  });
  const Checkbox = withInstall(stdin_default$U);
  const CheckboxGroup = withInstall(stdin_default$V);
  const [name$Q, bem$P] = createNamespace("circle");
  let uid = 0;
  const format$1 = (rate) => Math.min(Math.max(+rate, 0), 100);
  function getPath(clockwise, viewBoxSize) {
    const sweepFlag = clockwise ? 1 : 0;
    return `M ${viewBoxSize / 2} ${viewBoxSize / 2} m 0, -500 a 500, 500 0 1, ${sweepFlag} 0, 1000 a 500, 500 0 1, ${sweepFlag} 0, -1000`;
  }
  const circleProps = {
    text: String,
    size: numericProp,
    fill: makeStringProp("none"),
    rate: makeNumericProp(100),
    speed: makeNumericProp(0),
    color: [String, Object],
    clockwise: truthProp,
    layerColor: String,
    currentRate: makeNumberProp(0),
    strokeWidth: makeNumericProp(40),
    strokeLinecap: String,
    startPosition: makeStringProp("top")
  };
  var stdin_default$T = vue.defineComponent({
    name: name$Q,
    props: circleProps,
    emits: ["update:currentRate"],
    setup(props, {
      emit,
      slots
    }) {
      const id = `van-circle-${uid++}`;
      const viewBoxSize = vue.computed(() => +props.strokeWidth + 1e3);
      const path = vue.computed(() => getPath(props.clockwise, viewBoxSize.value));
      const svgStyle = vue.computed(() => {
        const ROTATE_ANGLE_MAP = {
          top: 0,
          right: 90,
          bottom: 180,
          left: 270
        };
        const angleValue = ROTATE_ANGLE_MAP[props.startPosition];
        if (angleValue) {
          return {
            transform: `rotate(${angleValue}deg)`
          };
        }
      });
      vue.watch(() => props.rate, (rate) => {
        let rafId;
        const startTime = Date.now();
        const startRate = props.currentRate;
        const endRate = format$1(rate);
        const duration = Math.abs((startRate - endRate) * 1e3 / +props.speed);
        const animate = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          const rate2 = progress * (endRate - startRate) + startRate;
          emit("update:currentRate", format$1(parseFloat(rate2.toFixed(1))));
          if (endRate > startRate ? rate2 < endRate : rate2 > endRate) {
            rafId = raf(animate);
          }
        };
        if (props.speed) {
          if (rafId) {
            cancelRaf(rafId);
          }
          rafId = raf(animate);
        } else {
          emit("update:currentRate", endRate);
        }
      }, {
        immediate: true
      });
      const renderHover = () => {
        const PERIMETER = 3140;
        const {
          strokeWidth,
          currentRate,
          strokeLinecap
        } = props;
        const offset2 = PERIMETER * currentRate / 100;
        const color = isObject(props.color) ? `url(#${id})` : props.color;
        const style = {
          stroke: color,
          strokeWidth: `${+strokeWidth + 1}px`,
          strokeLinecap,
          strokeDasharray: `${offset2}px ${PERIMETER}px`
        };
        return vue.createVNode("path", {
          "d": path.value,
          "style": style,
          "class": bem$P("hover"),
          "stroke": color
        }, null);
      };
      const renderLayer = () => {
        const style = {
          fill: props.fill,
          stroke: props.layerColor,
          strokeWidth: `${props.strokeWidth}px`
        };
        return vue.createVNode("path", {
          "class": bem$P("layer"),
          "style": style,
          "d": path.value
        }, null);
      };
      const renderGradient = () => {
        const {
          color
        } = props;
        if (!isObject(color)) {
          return;
        }
        const Stops = Object.keys(color).sort((a2, b2) => parseFloat(a2) - parseFloat(b2)).map((key, index) => vue.createVNode("stop", {
          "key": index,
          "offset": key,
          "stop-color": color[key]
        }, null));
        return vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
          "id": id,
          "x1": "100%",
          "y1": "0%",
          "x2": "0%",
          "y2": "0%"
        }, [Stops])]);
      };
      const renderText = () => {
        if (slots.default) {
          return slots.default();
        }
        if (props.text) {
          return vue.createVNode("div", {
            "class": bem$P("text")
          }, [props.text]);
        }
      };
      return () => vue.createVNode("div", {
        "class": bem$P(),
        "style": getSizeStyle(props.size)
      }, [vue.createVNode("svg", {
        "viewBox": `0 0 ${viewBoxSize.value} ${viewBoxSize.value}`,
        "style": svgStyle.value
      }, [renderGradient(), renderLayer(), renderHover()]), renderText()]);
    }
  });
  const Circle = withInstall(stdin_default$T);
  const [name$P, bem$O] = createNamespace("row");
  const ROW_KEY = Symbol(name$P);
  const rowProps = {
    tag: makeStringProp("div"),
    wrap: truthProp,
    align: String,
    gutter: makeNumericProp(0),
    justify: String
  };
  var stdin_default$S = vue.defineComponent({
    name: name$P,
    props: rowProps,
    setup(props, {
      slots
    }) {
      const {
        children,
        linkChildren
      } = useChildren(ROW_KEY);
      const groups = vue.computed(() => {
        const groups2 = [[]];
        let totalSpan = 0;
        children.forEach((child, index) => {
          totalSpan += Number(child.span);
          if (totalSpan > 24) {
            groups2.push([index]);
            totalSpan -= 24;
          } else {
            groups2[groups2.length - 1].push(index);
          }
        });
        return groups2;
      });
      const spaces = vue.computed(() => {
        const gutter = Number(props.gutter);
        const spaces2 = [];
        if (!gutter) {
          return spaces2;
        }
        groups.value.forEach((group) => {
          const averagePadding = gutter * (group.length - 1) / group.length;
          group.forEach((item, index) => {
            if (index === 0) {
              spaces2.push({
                right: averagePadding
              });
            } else {
              const left2 = gutter - spaces2[item - 1].right;
              const right2 = averagePadding - left2;
              spaces2.push({
                left: left2,
                right: right2
              });
            }
          });
        });
        return spaces2;
      });
      linkChildren({
        spaces
      });
      return () => {
        const {
          tag,
          wrap,
          align,
          justify
        } = props;
        return vue.createVNode(tag, {
          "class": bem$O({
            [`align-${align}`]: align,
            [`justify-${justify}`]: justify,
            nowrap: !wrap
          })
        }, {
          default: () => {
            var _a;
            return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
          }
        });
      };
    }
  });
  const [name$O, bem$N] = createNamespace("col");
  const colProps = {
    tag: makeStringProp("div"),
    span: makeNumericProp(0),
    offset: numericProp
  };
  var stdin_default$R = vue.defineComponent({
    name: name$O,
    props: colProps,
    setup(props, {
      slots
    }) {
      const {
        parent,
        index
      } = useParent(ROW_KEY);
      const style = vue.computed(() => {
        if (!parent) {
          return;
        }
        const {
          spaces
        } = parent;
        if (spaces && spaces.value && spaces.value[index.value]) {
          const {
            left: left2,
            right: right2
          } = spaces.value[index.value];
          return {
            paddingLeft: left2 ? `${left2}px` : null,
            paddingRight: right2 ? `${right2}px` : null
          };
        }
      });
      return () => {
        const {
          tag,
          span,
          offset: offset2
        } = props;
        return vue.createVNode(tag, {
          "style": style.value,
          "class": bem$N({
            [span]: span,
            [`offset-${offset2}`]: offset2
          })
        }, {
          default: () => {
            var _a;
            return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
          }
        });
      };
    }
  });
  const Col = withInstall(stdin_default$R);
  const [name$N, bem$M] = createNamespace("collapse");
  const COLLAPSE_KEY = Symbol(name$N);
  const collapseProps = {
    border: truthProp,
    accordion: Boolean,
    modelValue: {
      type: [String, Number, Array],
      default: ""
    }
  };
  function validateModelValue(modelValue, accordion) {
    if (accordion && Array.isArray(modelValue)) {
      formatAppLog("error", "at node_modules/vant/es/collapse/Collapse.mjs:18", '[Vant] Collapse: "v-model" should not be Array in accordion mode');
      return false;
    }
    if (!accordion && !Array.isArray(modelValue)) {
      formatAppLog("error", "at node_modules/vant/es/collapse/Collapse.mjs:22", '[Vant] Collapse: "v-model" should be Array in non-accordion mode');
      return false;
    }
    return true;
  }
  var stdin_default$Q = vue.defineComponent({
    name: name$N,
    props: collapseProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        linkChildren,
        children
      } = useChildren(COLLAPSE_KEY);
      const updateName = (name2) => {
        emit("change", name2);
        emit("update:modelValue", name2);
      };
      const toggle = (name2, expanded) => {
        const {
          accordion,
          modelValue
        } = props;
        if (accordion) {
          updateName(name2 === modelValue ? "" : name2);
        } else if (expanded) {
          updateName(modelValue.concat(name2));
        } else {
          updateName(modelValue.filter((activeName) => activeName !== name2));
        }
      };
      const toggleAll = (options = {}) => {
        if (props.accordion) {
          return;
        }
        if (typeof options === "boolean") {
          options = {
            expanded: options
          };
        }
        const {
          expanded,
          skipDisabled
        } = options;
        const expandedChildren = children.filter((item) => {
          if (item.disabled && skipDisabled) {
            return item.expanded.value;
          }
          return expanded != null ? expanded : !item.expanded.value;
        });
        const names = expandedChildren.map((item) => item.itemName.value);
        updateName(names);
      };
      const isExpanded = (name2) => {
        const {
          accordion,
          modelValue
        } = props;
        if (!validateModelValue(modelValue, accordion)) {
          return false;
        }
        return accordion ? modelValue === name2 : modelValue.includes(name2);
      };
      useExpose({
        toggleAll
      });
      linkChildren({
        toggle,
        isExpanded
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": [bem$M(), {
            [BORDER_TOP_BOTTOM]: props.border
          }]
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Collapse = withInstall(stdin_default$Q);
  const [name$M, bem$L] = createNamespace("collapse-item");
  const CELL_SLOTS = ["icon", "title", "value", "label", "right-icon"];
  const collapseItemProps = extend({}, cellSharedProps, {
    name: numericProp,
    isLink: truthProp,
    disabled: Boolean,
    readonly: Boolean,
    lazyRender: truthProp
  });
  var stdin_default$P = vue.defineComponent({
    name: name$M,
    props: collapseItemProps,
    setup(props, {
      slots
    }) {
      const wrapperRef = vue.ref();
      const contentRef = vue.ref();
      const {
        parent,
        index
      } = useParent(COLLAPSE_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/collapse-item/CollapseItem.mjs:33", "[Vant] <CollapseItem> must be a child component of <Collapse>.");
        }
        return;
      }
      const name2 = vue.computed(() => {
        var _a;
        return (_a = props.name) != null ? _a : index.value;
      });
      const expanded = vue.computed(() => parent.isExpanded(name2.value));
      const show = vue.ref(expanded.value);
      const lazyRender = useLazyRender(() => show.value || !props.lazyRender);
      const onTransitionEnd = () => {
        if (!expanded.value) {
          show.value = false;
        } else if (wrapperRef.value) {
          wrapperRef.value.style.height = "";
        }
      };
      vue.watch(expanded, (value, oldValue) => {
        if (oldValue === null) {
          return;
        }
        if (value) {
          show.value = true;
        }
        const tick = value ? vue.nextTick : raf;
        tick(() => {
          if (!contentRef.value || !wrapperRef.value) {
            return;
          }
          const {
            offsetHeight
          } = contentRef.value;
          if (offsetHeight) {
            const contentHeight = `${offsetHeight}px`;
            wrapperRef.value.style.height = value ? "0" : contentHeight;
            doubleRaf(() => {
              if (wrapperRef.value) {
                wrapperRef.value.style.height = value ? contentHeight : "0";
              }
            });
          } else {
            onTransitionEnd();
          }
        });
      });
      const toggle = (newValue = !expanded.value) => {
        parent.toggle(name2.value, newValue);
      };
      const onClickTitle = () => {
        if (!props.disabled && !props.readonly) {
          toggle();
        }
      };
      const renderTitle = () => {
        const {
          border,
          disabled,
          readonly
        } = props;
        const attrs = pick(props, Object.keys(cellSharedProps));
        if (readonly) {
          attrs.isLink = false;
        }
        if (disabled || readonly) {
          attrs.clickable = false;
        }
        return vue.createVNode(Cell, vue.mergeProps({
          "role": "button",
          "class": bem$L("title", {
            disabled,
            expanded: expanded.value,
            borderless: !border
          }),
          "aria-expanded": String(expanded.value),
          "onClick": onClickTitle
        }, attrs), pick(slots, CELL_SLOTS));
      };
      const renderContent = lazyRender(() => {
        var _a;
        return vue.withDirectives(vue.createVNode("div", {
          "ref": wrapperRef,
          "class": bem$L("wrapper"),
          "onTransitionend": onTransitionEnd
        }, [vue.createVNode("div", {
          "ref": contentRef,
          "class": bem$L("content")
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]), [[vue.vShow, show.value]]);
      });
      useExpose({
        toggle,
        expanded,
        itemName: name2
      });
      return () => vue.createVNode("div", {
        "class": [bem$L({
          border: index.value && props.border
        })]
      }, [renderTitle(), renderContent()]);
    }
  });
  const CollapseItem = withInstall(stdin_default$P);
  const ConfigProvider = withInstall(stdin_default$1x);
  const [name$L, bem$K, t$d] = createNamespace("contact-card");
  const contactCardProps = {
    tel: String,
    name: String,
    type: makeStringProp("add"),
    addText: String,
    editable: truthProp
  };
  var stdin_default$O = vue.defineComponent({
    name: name$L,
    props: contactCardProps,
    emits: ["click"],
    setup(props, {
      emit
    }) {
      const onClick = (event) => {
        if (props.editable) {
          emit("click", event);
        }
      };
      const renderContent = () => {
        if (props.type === "add") {
          return props.addText || t$d("addContact");
        }
        return [vue.createVNode("div", null, [`${t$d("name")}\uFF1A${props.name}`]), vue.createVNode("div", null, [`${t$d("tel")}\uFF1A${props.tel}`])];
      };
      return () => vue.createVNode(Cell, {
        "center": true,
        "icon": props.type === "edit" ? "contact" : "add-square",
        "class": bem$K([props.type]),
        "border": false,
        "isLink": props.editable,
        "valueClass": bem$K("value"),
        "onClick": onClick
      }, {
        value: renderContent
      });
    }
  });
  const ContactCard = withInstall(stdin_default$O);
  const [name$K, bem$J, t$c] = createNamespace("contact-edit");
  const DEFAULT_CONTACT = {
    tel: "",
    name: ""
  };
  const contactEditProps = {
    isEdit: Boolean,
    isSaving: Boolean,
    isDeleting: Boolean,
    showSetDefault: Boolean,
    setDefaultLabel: String,
    contactInfo: {
      type: Object,
      default: () => extend({}, DEFAULT_CONTACT)
    },
    telValidator: {
      type: Function,
      default: isMobile
    }
  };
  var stdin_default$N = vue.defineComponent({
    name: name$K,
    props: contactEditProps,
    emits: ["save", "delete", "change-default"],
    setup(props, {
      emit
    }) {
      const contact = vue.reactive(extend({}, DEFAULT_CONTACT, props.contactInfo));
      const onSave = () => {
        if (!props.isSaving) {
          emit("save", contact);
        }
      };
      const onDelete = () => emit("delete", contact);
      const renderButtons = () => vue.createVNode("div", {
        "class": bem$J("buttons")
      }, [vue.createVNode(Button, {
        "block": true,
        "round": true,
        "type": "danger",
        "text": t$c("save"),
        "class": bem$J("button"),
        "loading": props.isSaving,
        "nativeType": "submit"
      }, null), props.isEdit && vue.createVNode(Button, {
        "block": true,
        "round": true,
        "text": t$c("delete"),
        "class": bem$J("button"),
        "loading": props.isDeleting,
        "onClick": onDelete
      }, null)]);
      const renderSwitch = () => vue.createVNode(Switch, {
        "modelValue": contact.isDefault,
        "onUpdate:modelValue": ($event) => contact.isDefault = $event,
        "size": 24,
        "onChange": (checked) => emit("change-default", checked)
      }, null);
      const renderSetDefault = () => {
        if (props.showSetDefault) {
          return vue.createVNode(Cell, {
            "title": props.setDefaultLabel,
            "class": bem$J("switch-cell"),
            "border": false
          }, {
            "right-icon": renderSwitch
          });
        }
      };
      vue.watch(() => props.contactInfo, (value) => extend(contact, DEFAULT_CONTACT, value));
      return () => vue.createVNode(Form, {
        "class": bem$J(),
        "onSubmit": onSave
      }, {
        default: () => [vue.createVNode("div", {
          "class": bem$J("fields")
        }, [vue.createVNode(Field, {
          "modelValue": contact.name,
          "onUpdate:modelValue": ($event) => contact.name = $event,
          "clearable": true,
          "label": t$c("name"),
          "rules": [{
            required: true,
            message: t$c("nameEmpty")
          }],
          "maxlength": "30",
          "placeholder": t$c("name")
        }, null), vue.createVNode(Field, {
          "modelValue": contact.tel,
          "onUpdate:modelValue": ($event) => contact.tel = $event,
          "clearable": true,
          "type": "tel",
          "label": t$c("tel"),
          "rules": [{
            validator: props.telValidator,
            message: t$c("telInvalid")
          }],
          "placeholder": t$c("tel")
        }, null)]), renderSetDefault(), renderButtons()]
      });
    }
  });
  const ContactEdit = withInstall(stdin_default$N);
  const [name$J, bem$I, t$b] = createNamespace("contact-list");
  const contactListProps = {
    list: Array,
    addText: String,
    modelValue: unknownProp,
    defaultTagText: String
  };
  var stdin_default$M = vue.defineComponent({
    name: name$J,
    props: contactListProps,
    emits: ["add", "edit", "select", "update:modelValue"],
    setup(props, {
      emit
    }) {
      const renderItem = (item, index) => {
        const onClick = () => {
          emit("update:modelValue", item.id);
          emit("select", item, index);
        };
        const renderRightIcon = () => vue.createVNode(Radio, {
          "class": bem$I("radio"),
          "name": item.id,
          "iconSize": 16
        }, null);
        const renderEditIcon = () => vue.createVNode(Icon, {
          "name": "edit",
          "class": bem$I("edit"),
          "onClick": (event) => {
            event.stopPropagation();
            emit("edit", item, index);
          }
        }, null);
        const renderContent = () => {
          const nodes = [`${item.name}\uFF0C${item.tel}`];
          if (item.isDefault && props.defaultTagText) {
            nodes.push(vue.createVNode(Tag, {
              "type": "danger",
              "round": true,
              "class": bem$I("item-tag")
            }, {
              default: () => [props.defaultTagText]
            }));
          }
          return nodes;
        };
        return vue.createVNode(Cell, {
          "key": item.id,
          "isLink": true,
          "center": true,
          "class": bem$I("item"),
          "valueClass": bem$I("item-value"),
          "onClick": onClick
        }, {
          icon: renderEditIcon,
          value: renderContent,
          "right-icon": renderRightIcon
        });
      };
      return () => vue.createVNode("div", {
        "class": bem$I()
      }, [vue.createVNode(RadioGroup, {
        "modelValue": props.modelValue,
        "class": bem$I("group")
      }, {
        default: () => [props.list && props.list.map(renderItem)]
      }), vue.createVNode("div", {
        "class": [bem$I("bottom"), "van-safe-area-bottom"]
      }, [vue.createVNode(Button, {
        "round": true,
        "block": true,
        "type": "danger",
        "class": bem$I("add"),
        "text": props.addText || t$b("addContact"),
        "onClick": () => emit("add")
      }, null)])]);
    }
  });
  const ContactList = withInstall(stdin_default$M);
  function parseFormat(format2, currentTime) {
    const { days } = currentTime;
    let { hours, minutes, seconds, milliseconds } = currentTime;
    if (format2.includes("DD")) {
      format2 = format2.replace("DD", padZero(days));
    } else {
      hours += days * 24;
    }
    if (format2.includes("HH")) {
      format2 = format2.replace("HH", padZero(hours));
    } else {
      minutes += hours * 60;
    }
    if (format2.includes("mm")) {
      format2 = format2.replace("mm", padZero(minutes));
    } else {
      seconds += minutes * 60;
    }
    if (format2.includes("ss")) {
      format2 = format2.replace("ss", padZero(seconds));
    } else {
      milliseconds += seconds * 1e3;
    }
    if (format2.includes("S")) {
      const ms = padZero(milliseconds, 3);
      if (format2.includes("SSS")) {
        format2 = format2.replace("SSS", ms);
      } else if (format2.includes("SS")) {
        format2 = format2.replace("SS", ms.slice(0, 2));
      } else {
        format2 = format2.replace("S", ms.charAt(0));
      }
    }
    return format2;
  }
  const [name$I, bem$H] = createNamespace("count-down");
  const countDownProps = {
    time: makeNumericProp(0),
    format: makeStringProp("HH:mm:ss"),
    autoStart: truthProp,
    millisecond: Boolean
  };
  var stdin_default$L = vue.defineComponent({
    name: name$I,
    props: countDownProps,
    emits: ["change", "finish"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        start: start2,
        pause,
        reset,
        current: current2
      } = useCountDown({
        time: +props.time,
        millisecond: props.millisecond,
        onChange: (current22) => emit("change", current22),
        onFinish: () => emit("finish")
      });
      const timeText = vue.computed(() => parseFormat(props.format, current2.value));
      const resetTime = () => {
        reset(+props.time);
        if (props.autoStart) {
          start2();
        }
      };
      vue.watch(() => props.time, resetTime, {
        immediate: true
      });
      useExpose({
        start: start2,
        pause,
        reset: resetTime
      });
      return () => vue.createVNode("div", {
        "role": "timer",
        "class": bem$H()
      }, [slots.default ? slots.default(current2.value) : timeText.value]);
    }
  });
  const CountDown = withInstall(stdin_default$L);
  function getDate(timeStamp) {
    const date = new Date(timeStamp * 1e3);
    return `${date.getFullYear()}.${padZero(date.getMonth() + 1)}.${padZero(date.getDate())}`;
  }
  const formatDiscount = (discount) => (discount / 10).toFixed(discount % 10 === 0 ? 0 : 1);
  const formatAmount = (amount) => (amount / 100).toFixed(amount % 100 === 0 ? 0 : amount % 10 === 0 ? 1 : 2);
  const [name$H, bem$G, t$a] = createNamespace("coupon");
  var stdin_default$K = vue.defineComponent({
    name: name$H,
    props: {
      chosen: Boolean,
      coupon: makeRequiredProp(Object),
      disabled: Boolean,
      currency: makeStringProp("\xA5")
    },
    setup(props) {
      const validPeriod = vue.computed(() => {
        const {
          startAt,
          endAt
        } = props.coupon;
        return `${getDate(startAt)} - ${getDate(endAt)}`;
      });
      const faceAmount = vue.computed(() => {
        const {
          coupon,
          currency
        } = props;
        if (coupon.valueDesc) {
          return [coupon.valueDesc, vue.createVNode("span", null, [coupon.unitDesc || ""])];
        }
        if (coupon.denominations) {
          const denominations = formatAmount(coupon.denominations);
          return [vue.createVNode("span", null, [currency]), ` ${denominations}`];
        }
        if (coupon.discount) {
          return t$a("discount", formatDiscount(coupon.discount));
        }
        return "";
      });
      const conditionMessage = vue.computed(() => {
        const condition = formatAmount(props.coupon.originCondition || 0);
        return condition === "0" ? t$a("unlimited") : t$a("condition", condition);
      });
      return () => {
        const {
          chosen,
          coupon,
          disabled
        } = props;
        const description = disabled && coupon.reason || coupon.description;
        return vue.createVNode("div", {
          "class": bem$G({
            disabled
          })
        }, [vue.createVNode("div", {
          "class": bem$G("content")
        }, [vue.createVNode("div", {
          "class": bem$G("head")
        }, [vue.createVNode("h2", {
          "class": bem$G("amount")
        }, [faceAmount.value]), vue.createVNode("p", {
          "class": bem$G("condition")
        }, [coupon.condition || conditionMessage.value])]), vue.createVNode("div", {
          "class": bem$G("body")
        }, [vue.createVNode("p", {
          "class": bem$G("name")
        }, [coupon.name]), vue.createVNode("p", {
          "class": bem$G("valid")
        }, [validPeriod.value]), !disabled && vue.createVNode(Checkbox, {
          "class": bem$G("corner"),
          "modelValue": chosen
        }, null)])]), description && vue.createVNode("p", {
          "class": bem$G("description")
        }, [description])]);
      };
    }
  });
  const Coupon = withInstall(stdin_default$K);
  const [name$G, bem$F, t$9] = createNamespace("coupon-cell");
  const couponCellProps = {
    title: String,
    border: truthProp,
    editable: truthProp,
    coupons: makeArrayProp(),
    currency: makeStringProp("\xA5"),
    chosenCoupon: makeNumericProp(-1)
  };
  function formatValue({
    coupons,
    chosenCoupon,
    currency
  }) {
    const coupon = coupons[+chosenCoupon];
    if (coupon) {
      let value = 0;
      if (isDef(coupon.value)) {
        ({
          value
        } = coupon);
      } else if (isDef(coupon.denominations)) {
        value = coupon.denominations;
      }
      return `-${currency} ${(value / 100).toFixed(2)}`;
    }
    return coupons.length === 0 ? t$9("noCoupon") : t$9("count", coupons.length);
  }
  var stdin_default$J = vue.defineComponent({
    name: name$G,
    props: couponCellProps,
    setup(props) {
      return () => {
        const selected = props.coupons[+props.chosenCoupon];
        return vue.createVNode(Cell, {
          "class": bem$F(),
          "value": formatValue(props),
          "title": props.title || t$9("title"),
          "border": props.border,
          "isLink": props.editable,
          "valueClass": bem$F("value", {
            selected
          })
        }, null);
      };
    }
  });
  const CouponCell = withInstall(stdin_default$J);
  const [name$F, bem$E] = createNamespace("empty");
  const emptyProps = {
    image: makeStringProp("default"),
    imageSize: [Number, String, Array],
    description: String
  };
  var stdin_default$I = vue.defineComponent({
    name: name$F,
    props: emptyProps,
    setup(props, {
      slots
    }) {
      const renderDescription = () => {
        const description = slots.description ? slots.description() : props.description;
        if (description) {
          return vue.createVNode("p", {
            "class": bem$E("description")
          }, [description]);
        }
      };
      const renderBottom = () => {
        if (slots.default) {
          return vue.createVNode("div", {
            "class": bem$E("bottom")
          }, [slots.default()]);
        }
      };
      const baseId = useId();
      const getId = (num) => `${baseId}-${num}`;
      const getUrlById = (num) => `url(#${getId(num)})`;
      const renderStop = (color, offset2, opacity) => vue.createVNode("stop", {
        "stop-color": color,
        "offset": `${offset2}%`,
        "stop-opacity": opacity
      }, null);
      const renderStops = (fromColor, toColor) => [renderStop(fromColor, 0), renderStop(toColor, 100)];
      const renderShadow = (id) => [vue.createVNode("defs", null, [vue.createVNode("radialGradient", {
        "id": getId(id),
        "cx": "50%",
        "cy": "54%",
        "fx": "50%",
        "fy": "54%",
        "r": "297%",
        "gradientTransform": "matrix(-.16 0 0 -.33 .58 .72)"
      }, [renderStop("#EBEDF0", 0), renderStop("#F2F3F5", 100, 0.3)])]), vue.createVNode("ellipse", {
        "fill": getUrlById(id),
        "opacity": ".8",
        "cx": "80",
        "cy": "140",
        "rx": "46",
        "ry": "8"
      }, null)];
      const renderBuilding = () => [vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
        "id": getId("a"),
        "x1": "64%",
        "y1": "100%",
        "x2": "64%"
      }, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)])]), vue.createVNode("g", {
        "opacity": ".8"
      }, [vue.createVNode("path", {
        "d": "M36 131V53H16v20H2v58h34z",
        "fill": getUrlById("a")
      }, null), vue.createVNode("path", {
        "d": "M123 15h22v14h9v77h-31V15z",
        "fill": getUrlById("a")
      }, null)])];
      const renderCloud = () => [vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
        "id": getId("b"),
        "x1": "64%",
        "y1": "97%",
        "x2": "64%",
        "y2": "0%"
      }, [renderStop("#F2F3F5", 0, 0.3), renderStop("#F2F3F5", 100)])]), vue.createVNode("g", {
        "opacity": ".8"
      }, [vue.createVNode("path", {
        "d": "M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z",
        "fill": getUrlById("b")
      }, null), vue.createVNode("path", {
        "d": "M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z",
        "fill": getUrlById("b")
      }, null)])];
      const renderNetwork = () => vue.createVNode("svg", {
        "viewBox": "0 0 160 160"
      }, [vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
        "id": getId(1),
        "x1": "64%",
        "y1": "100%",
        "x2": "64%"
      }, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)]), vue.createVNode("linearGradient", {
        "id": getId(2),
        "x1": "50%",
        "x2": "50%",
        "y2": "84%"
      }, [renderStop("#EBEDF0", 0), renderStop("#DCDEE0", 100, 0)]), vue.createVNode("linearGradient", {
        "id": getId(3),
        "x1": "100%",
        "x2": "100%",
        "y2": "100%"
      }, [renderStops("#EAEDF0", "#DCDEE0")]), vue.createVNode("radialGradient", {
        "id": getId(4),
        "cx": "50%",
        "cy": "0%",
        "fx": "50%",
        "fy": "0%",
        "r": "100%",
        "gradientTransform": "matrix(0 1 -.54 0 .5 -.5)"
      }, [renderStop("#EBEDF0", 0), renderStop("#FFF", 100, 0)])]), vue.createVNode("g", {
        "fill": "none"
      }, [renderBuilding(), vue.createVNode("path", {
        "fill": getUrlById(4),
        "d": "M0 139h160v21H0z"
      }, null), vue.createVNode("path", {
        "d": "M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z",
        "fill": getUrlById(2)
      }, null), vue.createVNode("g", {
        "opacity": ".6",
        "stroke-linecap": "round",
        "stroke-width": "7"
      }, [vue.createVNode("path", {
        "d": "M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13",
        "stroke": getUrlById(3)
      }, null), vue.createVNode("path", {
        "d": "M53 36a34 34 0 0 0 0 48",
        "stroke": getUrlById(3)
      }, null), vue.createVNode("path", {
        "d": "M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13",
        "stroke": getUrlById(3)
      }, null), vue.createVNode("path", {
        "d": "M106 84a34 34 0 0 0 0-48",
        "stroke": getUrlById(3)
      }, null)]), vue.createVNode("g", {
        "transform": "translate(31 105)"
      }, [vue.createVNode("rect", {
        "fill": "#EBEDF0",
        "width": "98",
        "height": "34",
        "rx": "2"
      }, null), vue.createVNode("rect", {
        "fill": "#FFF",
        "x": "9",
        "y": "8",
        "width": "80",
        "height": "18",
        "rx": "1.1"
      }, null), vue.createVNode("rect", {
        "fill": "#EBEDF0",
        "x": "15",
        "y": "12",
        "width": "18",
        "height": "6",
        "rx": "1.1"
      }, null)])])]);
      const renderMaterial = () => vue.createVNode("svg", {
        "viewBox": "0 0 160 160"
      }, [vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
        "x1": "50%",
        "x2": "50%",
        "y2": "100%",
        "id": getId(5)
      }, [renderStops("#F2F3F5", "#DCDEE0")]), vue.createVNode("linearGradient", {
        "x1": "95%",
        "y1": "48%",
        "x2": "5.5%",
        "y2": "51%",
        "id": getId(6)
      }, [renderStops("#EAEDF1", "#DCDEE0")]), vue.createVNode("linearGradient", {
        "y1": "45%",
        "x2": "100%",
        "y2": "54%",
        "id": getId(7)
      }, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), vue.createVNode("g", {
        "transform": "translate(36 50)",
        "fill": "none"
      }, [vue.createVNode("g", {
        "transform": "translate(8)"
      }, [vue.createVNode("rect", {
        "fill": "#EBEDF0",
        "opacity": ".6",
        "x": "38",
        "y": "13",
        "width": "36",
        "height": "53",
        "rx": "2"
      }, null), vue.createVNode("rect", {
        "fill": getUrlById(5),
        "width": "64",
        "height": "66",
        "rx": "2"
      }, null), vue.createVNode("rect", {
        "fill": "#FFF",
        "x": "6",
        "y": "6",
        "width": "52",
        "height": "55",
        "rx": "1"
      }, null), vue.createVNode("g", {
        "transform": "translate(15 17)",
        "fill": getUrlById(6)
      }, [vue.createVNode("rect", {
        "width": "34",
        "height": "6",
        "rx": "1"
      }, null), vue.createVNode("path", {
        "d": "M0 14h34v6H0z"
      }, null), vue.createVNode("rect", {
        "y": "28",
        "width": "34",
        "height": "6",
        "rx": "1"
      }, null)])]), vue.createVNode("rect", {
        "fill": getUrlById(7),
        "y": "61",
        "width": "88",
        "height": "28",
        "rx": "1"
      }, null), vue.createVNode("rect", {
        "fill": "#F7F8FA",
        "x": "29",
        "y": "72",
        "width": "30",
        "height": "6",
        "rx": "1"
      }, null)])]);
      const renderError = () => vue.createVNode("svg", {
        "viewBox": "0 0 160 160"
      }, [vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
        "x1": "50%",
        "x2": "50%",
        "y2": "100%",
        "id": getId(8)
      }, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), renderShadow("c"), vue.createVNode("path", {
        "d": "m59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z",
        "fill": getUrlById(8)
      }, null)]);
      const renderSearch = () => vue.createVNode("svg", {
        "viewBox": "0 0 160 160"
      }, [vue.createVNode("defs", null, [vue.createVNode("linearGradient", {
        "x1": "50%",
        "y1": "100%",
        "x2": "50%",
        "id": getId(9)
      }, [renderStops("#EEE", "#D8D8D8")]), vue.createVNode("linearGradient", {
        "x1": "100%",
        "y1": "50%",
        "y2": "50%",
        "id": getId(10)
      }, [renderStops("#F2F3F5", "#DCDEE0")]), vue.createVNode("linearGradient", {
        "x1": "50%",
        "x2": "50%",
        "y2": "100%",
        "id": getId(11)
      }, [renderStops("#F2F3F5", "#DCDEE0")]), vue.createVNode("linearGradient", {
        "x1": "50%",
        "x2": "50%",
        "y2": "100%",
        "id": getId(12)
      }, [renderStops("#FFF", "#F7F8FA")])]), renderBuilding(), renderCloud(), renderShadow("d"), vue.createVNode("g", {
        "transform": "rotate(-45 113 -4)",
        "fill": "none"
      }, [vue.createVNode("rect", {
        "fill": getUrlById(9),
        "x": "24",
        "y": "52.8",
        "width": "5.8",
        "height": "19",
        "rx": "1"
      }, null), vue.createVNode("rect", {
        "fill": getUrlById(10),
        "x": "22.1",
        "y": "67.3",
        "width": "9.9",
        "height": "28",
        "rx": "1"
      }, null), vue.createVNode("circle", {
        "stroke": getUrlById(11),
        "stroke-width": "8",
        "cx": "27",
        "cy": "27",
        "r": "27"
      }, null), vue.createVNode("circle", {
        "fill": getUrlById(12),
        "cx": "27",
        "cy": "27",
        "r": "16"
      }, null), vue.createVNode("path", {
        "d": "M37 7c-8 0-15 5-16 12",
        "stroke": getUrlById(11),
        "stroke-width": "3",
        "opacity": ".5",
        "stroke-linecap": "round",
        "transform": "rotate(45 29 13)"
      }, null)])]);
      const renderImage = () => {
        var _a;
        if (slots.image) {
          return slots.image();
        }
        const PRESET_IMAGES = {
          error: renderError,
          search: renderSearch,
          network: renderNetwork,
          default: renderMaterial
        };
        return ((_a = PRESET_IMAGES[props.image]) == null ? void 0 : _a.call(PRESET_IMAGES)) || vue.createVNode("img", {
          "src": props.image
        }, null);
      };
      return () => vue.createVNode("div", {
        "class": bem$E()
      }, [vue.createVNode("div", {
        "class": bem$E("image"),
        "style": getSizeStyle(props.imageSize)
      }, [renderImage()]), renderDescription(), renderBottom()]);
    }
  });
  const Empty = withInstall(stdin_default$I);
  const [name$E, bem$D, t$8] = createNamespace("coupon-list");
  const couponListProps = {
    code: makeStringProp(""),
    coupons: makeArrayProp(),
    currency: makeStringProp("\xA5"),
    showCount: truthProp,
    emptyImage: String,
    chosenCoupon: makeNumberProp(-1),
    enabledTitle: String,
    disabledTitle: String,
    disabledCoupons: makeArrayProp(),
    showExchangeBar: truthProp,
    showCloseButton: truthProp,
    closeButtonText: String,
    inputPlaceholder: String,
    exchangeMinLength: makeNumberProp(1),
    exchangeButtonText: String,
    displayedCouponIndex: makeNumberProp(-1),
    exchangeButtonLoading: Boolean,
    exchangeButtonDisabled: Boolean
  };
  var stdin_default$H = vue.defineComponent({
    name: name$E,
    props: couponListProps,
    emits: ["change", "exchange", "update:code"],
    setup(props, {
      emit,
      slots
    }) {
      const [couponRefs, setCouponRefs] = useRefs();
      const root = vue.ref();
      const barRef = vue.ref();
      const activeTab = vue.ref(0);
      const listHeight = vue.ref(0);
      const currentCode = vue.ref(props.code);
      const buttonDisabled = vue.computed(() => !props.exchangeButtonLoading && (props.exchangeButtonDisabled || !currentCode.value || currentCode.value.length < props.exchangeMinLength));
      const updateListHeight = () => {
        const TABS_HEIGHT = 44;
        const rootHeight = useRect(root).height;
        const headerHeight = useRect(barRef).height + TABS_HEIGHT;
        listHeight.value = (rootHeight > headerHeight ? rootHeight : windowHeight.value) - headerHeight;
      };
      const onExchange = () => {
        emit("exchange", currentCode.value);
        if (!props.code) {
          currentCode.value = "";
        }
      };
      const scrollToCoupon = (index) => {
        vue.nextTick(() => {
          var _a;
          return (_a = couponRefs.value[index]) == null ? void 0 : _a.scrollIntoView();
        });
      };
      const renderEmpty = () => vue.createVNode(Empty, {
        "image": props.emptyImage
      }, {
        default: () => [vue.createVNode("p", {
          "class": bem$D("empty-tip")
        }, [t$8("noCoupon")])]
      });
      const renderExchangeBar = () => {
        if (props.showExchangeBar) {
          return vue.createVNode("div", {
            "ref": barRef,
            "class": bem$D("exchange-bar")
          }, [vue.createVNode(Field, {
            "modelValue": currentCode.value,
            "onUpdate:modelValue": ($event) => currentCode.value = $event,
            "clearable": true,
            "border": false,
            "class": bem$D("field"),
            "placeholder": props.inputPlaceholder || t$8("placeholder"),
            "maxlength": "20"
          }, null), vue.createVNode(Button, {
            "plain": true,
            "type": "danger",
            "class": bem$D("exchange"),
            "text": props.exchangeButtonText || t$8("exchange"),
            "loading": props.exchangeButtonLoading,
            "disabled": buttonDisabled.value,
            "onClick": onExchange
          }, null)]);
        }
      };
      const renderCouponTab = () => {
        const {
          coupons
        } = props;
        const count = props.showCount ? ` (${coupons.length})` : "";
        const title = (props.enabledTitle || t$8("enable")) + count;
        return vue.createVNode(Tab, {
          "title": title
        }, {
          default: () => {
            var _a;
            return [vue.createVNode("div", {
              "class": bem$D("list", {
                "with-bottom": props.showCloseButton
              }),
              "style": {
                height: `${listHeight.value}px`
              }
            }, [coupons.map((coupon, index) => vue.createVNode(Coupon, {
              "key": coupon.id,
              "ref": setCouponRefs(index),
              "coupon": coupon,
              "chosen": index === props.chosenCoupon,
              "currency": props.currency,
              "onClick": () => emit("change", index)
            }, null)), !coupons.length && renderEmpty(), (_a = slots["list-footer"]) == null ? void 0 : _a.call(slots)])];
          }
        });
      };
      const renderDisabledTab = () => {
        const {
          disabledCoupons
        } = props;
        const count = props.showCount ? ` (${disabledCoupons.length})` : "";
        const title = (props.disabledTitle || t$8("disabled")) + count;
        return vue.createVNode(Tab, {
          "title": title
        }, {
          default: () => {
            var _a;
            return [vue.createVNode("div", {
              "class": bem$D("list", {
                "with-bottom": props.showCloseButton
              }),
              "style": {
                height: `${listHeight.value}px`
              }
            }, [disabledCoupons.map((coupon) => vue.createVNode(Coupon, {
              "disabled": true,
              "key": coupon.id,
              "coupon": coupon,
              "currency": props.currency
            }, null)), !disabledCoupons.length && renderEmpty(), (_a = slots["disabled-list-footer"]) == null ? void 0 : _a.call(slots)])];
          }
        });
      };
      vue.watch(() => props.code, (value) => {
        currentCode.value = value;
      });
      vue.watch(windowHeight, updateListHeight);
      vue.watch(currentCode, (value) => emit("update:code", value));
      vue.watch(() => props.displayedCouponIndex, scrollToCoupon);
      vue.onMounted(() => {
        updateListHeight();
        scrollToCoupon(props.displayedCouponIndex);
      });
      return () => vue.createVNode("div", {
        "ref": root,
        "class": bem$D()
      }, [renderExchangeBar(), vue.createVNode(Tabs, {
        "active": activeTab.value,
        "onUpdate:active": ($event) => activeTab.value = $event,
        "class": bem$D("tab")
      }, {
        default: () => [renderCouponTab(), renderDisabledTab()]
      }), vue.createVNode("div", {
        "class": bem$D("bottom")
      }, [vue.withDirectives(vue.createVNode(Button, {
        "round": true,
        "block": true,
        "type": "danger",
        "class": bem$D("close"),
        "text": props.closeButtonText || t$8("close"),
        "onClick": () => emit("change", -1)
      }, null), [[vue.vShow, props.showCloseButton]])])]);
    }
  });
  const CouponList = withInstall(stdin_default$H);
  const [name$D] = createNamespace("time-picker");
  var stdin_default$G = vue.defineComponent({
    name: name$D,
    props: extend({}, sharedProps, {
      minHour: makeNumericProp(0),
      maxHour: makeNumericProp(23),
      minMinute: makeNumericProp(0),
      maxMinute: makeNumericProp(59),
      modelValue: String
    }),
    emits: ["confirm", "cancel", "change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const formatValue2 = (value) => {
        const {
          minHour,
          maxHour,
          maxMinute,
          minMinute
        } = props;
        if (!value) {
          value = `${padZero(minHour)}:${padZero(minMinute)}`;
        }
        let [hour, minute] = value.split(":");
        hour = padZero(clamp(+hour, +minHour, +maxHour));
        minute = padZero(clamp(+minute, +minMinute, +maxMinute));
        return `${hour}:${minute}`;
      };
      const picker = vue.ref();
      const currentDate = vue.ref(formatValue2(props.modelValue));
      const ranges = vue.computed(() => [{
        type: "hour",
        range: [+props.minHour, +props.maxHour]
      }, {
        type: "minute",
        range: [+props.minMinute, +props.maxMinute]
      }]);
      const originColumns = vue.computed(() => ranges.value.map(({
        type,
        range: rangeArr
      }) => {
        let values = times(rangeArr[1] - rangeArr[0] + 1, (index) => padZero(rangeArr[0] + index));
        if (props.filter) {
          values = props.filter(type, values);
        }
        return {
          type,
          values
        };
      }));
      const columns = vue.computed(() => originColumns.value.map((column) => ({
        values: column.values.map((value) => props.formatter(column.type, value))
      })));
      const updateColumnValue = () => {
        const pair = currentDate.value.split(":");
        const values = [props.formatter("hour", pair[0]), props.formatter("minute", pair[1])];
        vue.nextTick(() => {
          var _a;
          (_a = picker.value) == null ? void 0 : _a.setValues(values);
        });
      };
      const updateInnerValue = () => {
        const [hourIndex, minuteIndex] = picker.value.getIndexes();
        const [hourColumn, minuteColumn] = originColumns.value;
        const hour = hourColumn.values[hourIndex] || hourColumn.values[0];
        const minute = minuteColumn.values[minuteIndex] || minuteColumn.values[0];
        currentDate.value = formatValue2(`${hour}:${minute}`);
        updateColumnValue();
      };
      const onConfirm = () => emit("confirm", currentDate.value);
      const onCancel = () => emit("cancel");
      const onChange = () => {
        updateInnerValue();
        vue.nextTick(() => {
          vue.nextTick(() => emit("change", currentDate.value));
        });
      };
      vue.onMounted(() => {
        updateColumnValue();
        vue.nextTick(updateInnerValue);
      });
      vue.watch(columns, updateColumnValue);
      vue.watch(() => [props.filter, props.maxHour, props.minMinute, props.maxMinute], updateInnerValue);
      vue.watch(() => props.minHour, () => {
        vue.nextTick(updateInnerValue);
      });
      vue.watch(currentDate, (value) => emit("update:modelValue", value));
      vue.watch(() => props.modelValue, (value) => {
        value = formatValue2(value);
        if (value !== currentDate.value) {
          currentDate.value = value;
          updateColumnValue();
        }
      });
      useExpose({
        getPicker: () => picker.value && proxyPickerMethods(picker.value, updateInnerValue)
      });
      return () => vue.createVNode(Picker, vue.mergeProps({
        "ref": picker,
        "columns": columns.value,
        "onChange": onChange,
        "onCancel": onCancel,
        "onConfirm": onConfirm
      }, pick(props, pickerInheritKeys)), slots);
    }
  });
  const currentYear = new Date().getFullYear();
  const [name$C] = createNamespace("date-picker");
  var stdin_default$F = vue.defineComponent({
    name: name$C,
    props: extend({}, sharedProps, {
      type: makeStringProp("datetime"),
      modelValue: Date,
      minDate: {
        type: Date,
        default: () => new Date(currentYear - 10, 0, 1),
        validator: isDate
      },
      maxDate: {
        type: Date,
        default: () => new Date(currentYear + 10, 11, 31),
        validator: isDate
      }
    }),
    emits: ["confirm", "cancel", "change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const formatValue2 = (value) => {
        if (isDate(value)) {
          const timestamp = clamp(value.getTime(), props.minDate.getTime(), props.maxDate.getTime());
          return new Date(timestamp);
        }
        return void 0;
      };
      const picker = vue.ref();
      const currentDate = vue.ref(formatValue2(props.modelValue));
      const getBoundary = (type, value) => {
        const boundary = props[`${type}Date`];
        const year = boundary.getFullYear();
        let month = 1;
        let date = 1;
        let hour = 0;
        let minute = 0;
        if (type === "max") {
          month = 12;
          date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
          hour = 23;
          minute = 59;
        }
        if (value.getFullYear() === year) {
          month = boundary.getMonth() + 1;
          if (value.getMonth() + 1 === month) {
            date = boundary.getDate();
            if (value.getDate() === date) {
              hour = boundary.getHours();
              if (value.getHours() === hour) {
                minute = boundary.getMinutes();
              }
            }
          }
        }
        return {
          [`${type}Year`]: year,
          [`${type}Month`]: month,
          [`${type}Date`]: date,
          [`${type}Hour`]: hour,
          [`${type}Minute`]: minute
        };
      };
      const ranges = vue.computed(() => {
        const {
          maxYear,
          maxDate,
          maxMonth,
          maxHour,
          maxMinute
        } = getBoundary("max", currentDate.value || props.minDate);
        const {
          minYear,
          minDate,
          minMonth,
          minHour,
          minMinute
        } = getBoundary("min", currentDate.value || props.minDate);
        let result = [{
          type: "year",
          range: [minYear, maxYear]
        }, {
          type: "month",
          range: [minMonth, maxMonth]
        }, {
          type: "day",
          range: [minDate, maxDate]
        }, {
          type: "hour",
          range: [minHour, maxHour]
        }, {
          type: "minute",
          range: [minMinute, maxMinute]
        }];
        switch (props.type) {
          case "date":
            result = result.slice(0, 3);
            break;
          case "year-month":
            result = result.slice(0, 2);
            break;
          case "month-day":
            result = result.slice(1, 3);
            break;
          case "datehour":
            result = result.slice(0, 4);
            break;
        }
        if (props.columnsOrder) {
          const columnsOrder = props.columnsOrder.concat(result.map((column) => column.type));
          result.sort((a2, b2) => columnsOrder.indexOf(a2.type) - columnsOrder.indexOf(b2.type));
        }
        return result;
      });
      const originColumns = vue.computed(() => ranges.value.map(({
        type,
        range: rangeArr
      }) => {
        let values = times(rangeArr[1] - rangeArr[0] + 1, (index) => padZero(rangeArr[0] + index));
        if (props.filter) {
          values = props.filter(type, values);
        }
        return {
          type,
          values
        };
      }));
      const columns = vue.computed(() => originColumns.value.map((column) => ({
        values: column.values.map((value) => props.formatter(column.type, value))
      })));
      const updateColumnValue = () => {
        const value = currentDate.value || props.minDate;
        const {
          formatter
        } = props;
        const values = originColumns.value.map((column) => {
          switch (column.type) {
            case "year":
              return formatter("year", `${value.getFullYear()}`);
            case "month":
              return formatter("month", padZero(value.getMonth() + 1));
            case "day":
              return formatter("day", padZero(value.getDate()));
            case "hour":
              return formatter("hour", padZero(value.getHours()));
            case "minute":
              return formatter("minute", padZero(value.getMinutes()));
            default:
              return "";
          }
        });
        vue.nextTick(() => {
          var _a;
          (_a = picker.value) == null ? void 0 : _a.setValues(values);
        });
      };
      const updateInnerValue = () => {
        const {
          type
        } = props;
        const indexes = picker.value.getIndexes();
        const getValue = (type2) => {
          let index = 0;
          originColumns.value.forEach((column, columnIndex) => {
            if (type2 === column.type) {
              index = columnIndex;
            }
          });
          const {
            values
          } = originColumns.value[index];
          return getTrueValue(values[indexes[index]]);
        };
        let year;
        let month;
        let day;
        if (type === "month-day") {
          year = (currentDate.value || props.minDate).getFullYear();
          month = getValue("month");
          day = getValue("day");
        } else {
          year = getValue("year");
          month = getValue("month");
          day = type === "year-month" ? 1 : getValue("day");
        }
        const maxDay = getMonthEndDay(year, month);
        day = day > maxDay ? maxDay : day;
        let hour = 0;
        let minute = 0;
        if (type === "datehour") {
          hour = getValue("hour");
        }
        if (type === "datetime") {
          hour = getValue("hour");
          minute = getValue("minute");
        }
        const value = new Date(year, month - 1, day, hour, minute);
        currentDate.value = formatValue2(value);
      };
      const onConfirm = () => {
        emit("update:modelValue", currentDate.value);
        emit("confirm", currentDate.value);
      };
      const onCancel = () => emit("cancel");
      const onChange = () => {
        updateInnerValue();
        vue.nextTick(() => {
          updateInnerValue();
          vue.nextTick(() => emit("change", currentDate.value));
        });
      };
      vue.onMounted(() => {
        updateColumnValue();
        vue.nextTick(updateInnerValue);
      });
      vue.watch(columns, updateColumnValue);
      vue.watch(currentDate, (value, oldValue) => emit("update:modelValue", oldValue ? value : null));
      vue.watch(() => [props.filter, props.minDate, props.maxDate], () => {
        vue.nextTick(updateInnerValue);
      });
      vue.watch(() => props.modelValue, (value) => {
        var _a;
        value = formatValue2(value);
        if (value && value.valueOf() !== ((_a = currentDate.value) == null ? void 0 : _a.valueOf())) {
          currentDate.value = value;
        }
      });
      useExpose({
        getPicker: () => picker.value && proxyPickerMethods(picker.value, updateInnerValue)
      });
      return () => vue.createVNode(Picker, vue.mergeProps({
        "ref": picker,
        "columns": columns.value,
        "onChange": onChange,
        "onCancel": onCancel,
        "onConfirm": onConfirm
      }, pick(props, pickerInheritKeys)), slots);
    }
  });
  const [name$B, bem$C] = createNamespace("datetime-picker");
  const timePickerPropKeys = Object.keys(stdin_default$G.props);
  const datePickerPropKeys = Object.keys(stdin_default$F.props);
  const datetimePickerProps = extend({}, stdin_default$G.props, stdin_default$F.props, {
    modelValue: [String, Date]
  });
  var stdin_default$E = vue.defineComponent({
    name: name$B,
    props: datetimePickerProps,
    setup(props, {
      attrs,
      slots
    }) {
      const root = vue.ref();
      useExpose({
        getPicker: () => {
          var _a;
          return (_a = root.value) == null ? void 0 : _a.getPicker();
        }
      });
      return () => {
        const isTimePicker = props.type === "time";
        const Component = isTimePicker ? stdin_default$G : stdin_default$F;
        const inheritProps = pick(props, isTimePicker ? timePickerPropKeys : datePickerPropKeys);
        return vue.createVNode(Component, vue.mergeProps({
          "ref": root,
          "class": bem$C()
        }, inheritProps, attrs), slots);
      };
    }
  });
  const DatetimePicker = withInstall(stdin_default$E);
  const [name$A, bem$B, t$7] = createNamespace("dialog");
  const dialogProps = extend({}, popupSharedProps, {
    title: String,
    theme: String,
    width: numericProp,
    message: [String, Function],
    callback: Function,
    allowHtml: Boolean,
    className: unknownProp,
    transition: makeStringProp("van-dialog-bounce"),
    messageAlign: String,
    closeOnPopstate: truthProp,
    showCancelButton: Boolean,
    cancelButtonText: String,
    cancelButtonColor: String,
    cancelButtonDisabled: Boolean,
    confirmButtonText: String,
    confirmButtonColor: String,
    confirmButtonDisabled: Boolean,
    showConfirmButton: truthProp,
    closeOnClickOverlay: Boolean
  });
  const popupInheritKeys$1 = [...popupSharedPropKeys, "transition", "closeOnPopstate"];
  var stdin_default$D = vue.defineComponent({
    name: name$A,
    props: dialogProps,
    emits: ["confirm", "cancel", "keydown", "update:show"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const loading = vue.reactive({
        confirm: false,
        cancel: false
      });
      const updateShow = (value) => emit("update:show", value);
      const close = (action) => {
        var _a;
        updateShow(false);
        (_a = props.callback) == null ? void 0 : _a.call(props, action);
      };
      const getActionHandler = (action) => () => {
        if (!props.show) {
          return;
        }
        emit(action);
        if (props.beforeClose) {
          loading[action] = true;
          callInterceptor(props.beforeClose, {
            args: [action],
            done() {
              close(action);
              loading[action] = false;
            },
            canceled() {
              loading[action] = false;
            }
          });
        } else {
          close(action);
        }
      };
      const onCancel = getActionHandler("cancel");
      const onConfirm = getActionHandler("confirm");
      const onKeydown = vue.withKeys((event) => {
        var _a, _b;
        if (event.target !== ((_b = (_a = root.value) == null ? void 0 : _a.popupRef) == null ? void 0 : _b.value)) {
          return;
        }
        const onEventType = {
          Enter: props.showConfirmButton ? onConfirm : noop,
          Escape: props.showCancelButton ? onCancel : noop
        };
        onEventType[event.key]();
        emit("keydown", event);
      }, ["enter", "esc"]);
      const renderTitle = () => {
        const title = slots.title ? slots.title() : props.title;
        if (title) {
          return vue.createVNode("div", {
            "class": bem$B("header", {
              isolated: !props.message && !slots.default
            })
          }, [title]);
        }
      };
      const renderMessage = (hasTitle) => {
        const {
          message,
          allowHtml,
          messageAlign
        } = props;
        const classNames = bem$B("message", {
          "has-title": hasTitle,
          [messageAlign]: messageAlign
        });
        const content = isFunction(message) ? message() : message;
        if (allowHtml && typeof content === "string") {
          return vue.createVNode("div", {
            "class": classNames,
            "innerHTML": content
          }, null);
        }
        return vue.createVNode("div", {
          "class": classNames
        }, [content]);
      };
      const renderContent = () => {
        if (slots.default) {
          return vue.createVNode("div", {
            "class": bem$B("content")
          }, [slots.default()]);
        }
        const {
          title,
          message,
          allowHtml
        } = props;
        if (message) {
          const hasTitle = !!(title || slots.title);
          return vue.createVNode("div", {
            "key": allowHtml ? 1 : 0,
            "class": bem$B("content", {
              isolated: !hasTitle
            })
          }, [renderMessage(hasTitle)]);
        }
      };
      const renderButtons = () => vue.createVNode("div", {
        "class": [BORDER_TOP, bem$B("footer")]
      }, [props.showCancelButton && vue.createVNode(Button, {
        "size": "large",
        "text": props.cancelButtonText || t$7("cancel"),
        "class": bem$B("cancel"),
        "style": {
          color: props.cancelButtonColor
        },
        "loading": loading.cancel,
        "disabled": props.cancelButtonDisabled,
        "onClick": onCancel
      }, null), props.showConfirmButton && vue.createVNode(Button, {
        "size": "large",
        "text": props.confirmButtonText || t$7("confirm"),
        "class": [bem$B("confirm"), {
          [BORDER_LEFT]: props.showCancelButton
        }],
        "style": {
          color: props.confirmButtonColor
        },
        "loading": loading.confirm,
        "disabled": props.confirmButtonDisabled,
        "onClick": onConfirm
      }, null)]);
      const renderRoundButtons = () => vue.createVNode(ActionBar, {
        "class": bem$B("footer")
      }, {
        default: () => [props.showCancelButton && vue.createVNode(ActionBarButton, {
          "type": "warning",
          "text": props.cancelButtonText || t$7("cancel"),
          "class": bem$B("cancel"),
          "color": props.cancelButtonColor,
          "loading": loading.cancel,
          "disabled": props.cancelButtonDisabled,
          "onClick": onCancel
        }, null), props.showConfirmButton && vue.createVNode(ActionBarButton, {
          "type": "danger",
          "text": props.confirmButtonText || t$7("confirm"),
          "class": bem$B("confirm"),
          "color": props.confirmButtonColor,
          "loading": loading.confirm,
          "disabled": props.confirmButtonDisabled,
          "onClick": onConfirm
        }, null)]
      });
      const renderFooter = () => {
        if (slots.footer) {
          return slots.footer();
        }
        return props.theme === "round-button" ? renderRoundButtons() : renderButtons();
      };
      return () => {
        const {
          width: width2,
          title,
          theme,
          message,
          className
        } = props;
        return vue.createVNode(Popup, vue.mergeProps({
          "ref": root,
          "role": "dialog",
          "class": [bem$B([theme]), className],
          "style": {
            width: addUnit(width2)
          },
          "tabindex": 0,
          "aria-labelledby": title || message,
          "onKeydown": onKeydown,
          "onUpdate:show": updateShow
        }, pick(props, popupInheritKeys$1)), {
          default: () => [renderTitle(), renderContent(), renderFooter()]
        });
      };
    }
  });
  let instance$2;
  function initInstance$2() {
    const Wrapper = {
      setup() {
        const {
          state,
          toggle
        } = usePopupState();
        return () => vue.createVNode(stdin_default$D, vue.mergeProps(state, {
          "onUpdate:show": toggle
        }), null);
      }
    };
    ({
      instance: instance$2
    } = mountComponent(Wrapper));
  }
  function Dialog(options) {
    if (!inBrowser$1) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      if (!instance$2) {
        initInstance$2();
      }
      instance$2.open(extend({}, Dialog.currentOptions, options, {
        callback: (action) => {
          (action === "confirm" ? resolve : reject)(action);
        }
      }));
    });
  }
  Dialog.defaultOptions = {
    title: "",
    width: "",
    theme: null,
    message: "",
    overlay: true,
    callback: null,
    teleport: "body",
    className: "",
    allowHtml: false,
    lockScroll: true,
    transition: void 0,
    beforeClose: null,
    overlayClass: "",
    overlayStyle: void 0,
    messageAlign: "",
    cancelButtonText: "",
    cancelButtonColor: null,
    cancelButtonDisabled: false,
    confirmButtonText: "",
    confirmButtonColor: null,
    confirmButtonDisabled: false,
    showConfirmButton: true,
    showCancelButton: false,
    closeOnPopstate: true,
    closeOnClickOverlay: false
  };
  Dialog.currentOptions = extend({}, Dialog.defaultOptions);
  Dialog.alert = Dialog;
  Dialog.confirm = (options) => Dialog(extend({
    showCancelButton: true
  }, options));
  Dialog.close = () => {
    if (instance$2) {
      instance$2.toggle(false);
    }
  };
  Dialog.setDefaultOptions = (options) => {
    extend(Dialog.currentOptions, options);
  };
  Dialog.resetDefaultOptions = () => {
    Dialog.currentOptions = extend({}, Dialog.defaultOptions);
  };
  Dialog.Component = withInstall(stdin_default$D);
  Dialog.install = (app) => {
    app.use(Dialog.Component);
    app.config.globalProperties.$dialog = Dialog;
  };
  const [name$z, bem$A] = createNamespace("divider");
  const dividerProps = {
    dashed: Boolean,
    hairline: truthProp,
    contentPosition: makeStringProp("center")
  };
  var stdin_default$C = vue.defineComponent({
    name: name$z,
    props: dividerProps,
    setup(props, {
      slots
    }) {
      return () => {
        var _a;
        return vue.createVNode("div", {
          "role": "separator",
          "class": bem$A({
            dashed: props.dashed,
            hairline: props.hairline,
            [`content-${props.contentPosition}`]: !!slots.default
          })
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Divider = withInstall(stdin_default$C);
  const [name$y, bem$z] = createNamespace("dropdown-menu");
  const dropdownMenuProps = {
    overlay: truthProp,
    zIndex: numericProp,
    duration: makeNumericProp(0.2),
    direction: makeStringProp("down"),
    activeColor: String,
    closeOnClickOutside: truthProp,
    closeOnClickOverlay: truthProp
  };
  const DROPDOWN_KEY = Symbol(name$y);
  var stdin_default$B = vue.defineComponent({
    name: name$y,
    props: dropdownMenuProps,
    setup(props, {
      slots
    }) {
      const id = useId();
      const root = vue.ref();
      const barRef = vue.ref();
      const offset2 = vue.ref(0);
      const {
        children,
        linkChildren
      } = useChildren(DROPDOWN_KEY);
      const scrollParent = useScrollParent(root);
      const opened = vue.computed(() => children.some((item) => item.state.showWrapper));
      const barStyle = vue.computed(() => {
        if (opened.value && isDef(props.zIndex)) {
          return {
            zIndex: +props.zIndex + 1
          };
        }
      });
      const onClickAway = () => {
        if (props.closeOnClickOutside) {
          children.forEach((item) => {
            item.toggle(false);
          });
        }
      };
      const updateOffset = () => {
        if (barRef.value) {
          const rect = useRect(barRef);
          if (props.direction === "down") {
            offset2.value = rect.bottom;
          } else {
            offset2.value = windowHeight.value - rect.top;
          }
        }
      };
      const onScroll = () => {
        if (opened.value) {
          updateOffset();
        }
      };
      const toggleItem = (active) => {
        children.forEach((item, index) => {
          if (index === active) {
            updateOffset();
            item.toggle();
          } else if (item.state.showPopup) {
            item.toggle(false, {
              immediate: true
            });
          }
        });
      };
      const renderTitle = (item, index) => {
        const {
          showPopup
        } = item.state;
        const {
          disabled,
          titleClass
        } = item;
        return vue.createVNode("div", {
          "id": `${id}-${index}`,
          "role": "button",
          "tabindex": disabled ? void 0 : 0,
          "class": [bem$z("item", {
            disabled
          }), {
            [HAPTICS_FEEDBACK]: !disabled
          }],
          "onClick": () => {
            if (!disabled) {
              toggleItem(index);
            }
          }
        }, [vue.createVNode("span", {
          "class": [bem$z("title", {
            down: showPopup === (props.direction === "down"),
            active: showPopup
          }), titleClass],
          "style": {
            color: showPopup ? props.activeColor : ""
          }
        }, [vue.createVNode("div", {
          "class": "van-ellipsis"
        }, [item.renderTitle()])])]);
      };
      linkChildren({
        id,
        props,
        offset: offset2
      });
      useClickAway(root, onClickAway);
      useEventListener("scroll", onScroll, {
        target: scrollParent,
        passive: true
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "class": bem$z()
        }, [vue.createVNode("div", {
          "ref": barRef,
          "style": barStyle.value,
          "class": bem$z("bar", {
            opened: opened.value
          })
        }, [children.map(renderTitle)]), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const [name$x, bem$y] = createNamespace("dropdown-item");
  const dropdownItemProps = {
    title: String,
    options: makeArrayProp(),
    disabled: Boolean,
    teleport: [String, Object],
    lazyRender: truthProp,
    modelValue: unknownProp,
    titleClass: unknownProp
  };
  var stdin_default$A = vue.defineComponent({
    name: name$x,
    props: dropdownItemProps,
    emits: ["open", "opened", "close", "closed", "change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const state = vue.reactive({
        showPopup: false,
        transition: true,
        showWrapper: false
      });
      const {
        parent,
        index
      } = useParent(DROPDOWN_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/dropdown-item/DropdownItem.mjs:39", "[Vant] <DropdownItem> must be a child component of <DropdownMenu>.");
        }
        return;
      }
      const getEmitter = (name2) => () => emit(name2);
      const onOpen = getEmitter("open");
      const onClose = getEmitter("close");
      const onOpened = getEmitter("opened");
      const onClosed = () => {
        state.showWrapper = false;
        emit("closed");
      };
      const onClickWrapper = (event) => {
        if (props.teleport) {
          event.stopPropagation();
        }
      };
      const toggle = (show = !state.showPopup, options = {}) => {
        if (show === state.showPopup) {
          return;
        }
        state.showPopup = show;
        state.transition = !options.immediate;
        if (show) {
          state.showWrapper = true;
        }
      };
      const renderTitle = () => {
        if (slots.title) {
          return slots.title();
        }
        if (props.title) {
          return props.title;
        }
        const match = props.options.find((option) => option.value === props.modelValue);
        return match ? match.text : "";
      };
      const renderOption = (option) => {
        const {
          activeColor
        } = parent.props;
        const active = option.value === props.modelValue;
        const onClick = () => {
          state.showPopup = false;
          if (option.value !== props.modelValue) {
            emit("update:modelValue", option.value);
            emit("change", option.value);
          }
        };
        const renderIcon = () => {
          if (active) {
            return vue.createVNode(Icon, {
              "class": bem$y("icon"),
              "color": activeColor,
              "name": "success"
            }, null);
          }
        };
        return vue.createVNode(Cell, {
          "role": "menuitem",
          "key": option.value,
          "icon": option.icon,
          "title": option.text,
          "class": bem$y("option", {
            active
          }),
          "style": {
            color: active ? activeColor : ""
          },
          "tabindex": active ? 0 : -1,
          "clickable": true,
          "onClick": onClick
        }, {
          value: renderIcon
        });
      };
      const renderContent = () => {
        const {
          offset: offset2
        } = parent;
        const {
          zIndex,
          overlay,
          duration,
          direction,
          closeOnClickOverlay
        } = parent.props;
        const style = getZIndexStyle(zIndex);
        if (direction === "down") {
          style.top = `${offset2.value}px`;
        } else {
          style.bottom = `${offset2.value}px`;
        }
        return vue.withDirectives(vue.createVNode("div", {
          "style": style,
          "class": bem$y([direction]),
          "onClick": onClickWrapper
        }, [vue.createVNode(Popup, {
          "show": state.showPopup,
          "onUpdate:show": ($event) => state.showPopup = $event,
          "role": "menu",
          "class": bem$y("content"),
          "overlay": overlay,
          "position": direction === "down" ? "top" : "bottom",
          "duration": state.transition ? duration : 0,
          "lazyRender": props.lazyRender,
          "overlayStyle": {
            position: "absolute"
          },
          "aria-labelledby": `${parent.id}-${index.value}`,
          "closeOnClickOverlay": closeOnClickOverlay,
          "onOpen": onOpen,
          "onClose": onClose,
          "onOpened": onOpened,
          "onClosed": onClosed
        }, {
          default: () => {
            var _a;
            return [props.options.map(renderOption), (_a = slots.default) == null ? void 0 : _a.call(slots)];
          }
        })]), [[vue.vShow, state.showWrapper]]);
      };
      useExpose({
        state,
        toggle,
        renderTitle
      });
      return () => {
        if (props.teleport) {
          return vue.createVNode(vue.Teleport, {
            "to": props.teleport
          }, {
            default: () => [renderContent()]
          });
        }
        return renderContent();
      };
    }
  });
  const DropdownItem = withInstall(stdin_default$A);
  const DropdownMenu = withInstall(stdin_default$B);
  const [name$w, bem$x] = createNamespace("grid");
  const gridProps = {
    square: Boolean,
    center: truthProp,
    border: truthProp,
    gutter: numericProp,
    reverse: Boolean,
    iconSize: numericProp,
    direction: String,
    clickable: Boolean,
    columnNum: makeNumericProp(4)
  };
  const GRID_KEY = Symbol(name$w);
  var stdin_default$z = vue.defineComponent({
    name: name$w,
    props: gridProps,
    setup(props, {
      slots
    }) {
      const {
        linkChildren
      } = useChildren(GRID_KEY);
      linkChildren({
        props
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "style": {
            paddingLeft: addUnit(props.gutter)
          },
          "class": [bem$x(), {
            [BORDER_TOP]: props.border && !props.gutter
          }]
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Grid = withInstall(stdin_default$z);
  const [name$v, bem$w] = createNamespace("grid-item");
  const gridItemProps = extend({}, routeProps, {
    dot: Boolean,
    text: String,
    icon: String,
    badge: numericProp,
    iconColor: String,
    iconPrefix: String,
    badgeProps: Object
  });
  var stdin_default$y = vue.defineComponent({
    name: name$v,
    props: gridItemProps,
    setup(props, {
      slots
    }) {
      const {
        parent,
        index
      } = useParent(GRID_KEY);
      const route2 = useRoute();
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/grid-item/GridItem.mjs:32", "[Vant] <GridItem> must be a child component of <Grid>.");
        }
        return;
      }
      const rootStyle = vue.computed(() => {
        const {
          square,
          gutter,
          columnNum
        } = parent.props;
        const percent = `${100 / +columnNum}%`;
        const style = {
          flexBasis: percent
        };
        if (square) {
          style.paddingTop = percent;
        } else if (gutter) {
          const gutterValue = addUnit(gutter);
          style.paddingRight = gutterValue;
          if (index.value >= columnNum) {
            style.marginTop = gutterValue;
          }
        }
        return style;
      });
      const contentStyle = vue.computed(() => {
        const {
          square,
          gutter
        } = parent.props;
        if (square && gutter) {
          const gutterValue = addUnit(gutter);
          return {
            right: gutterValue,
            bottom: gutterValue,
            height: "auto"
          };
        }
      });
      const renderIcon = () => {
        if (slots.icon) {
          return vue.createVNode(Badge, vue.mergeProps({
            "dot": props.dot,
            "content": props.badge
          }, props.badgeProps), {
            default: slots.icon
          });
        }
        if (props.icon) {
          return vue.createVNode(Icon, {
            "dot": props.dot,
            "name": props.icon,
            "size": parent.props.iconSize,
            "badge": props.badge,
            "class": bem$w("icon"),
            "color": props.iconColor,
            "badgeProps": props.badgeProps,
            "classPrefix": props.iconPrefix
          }, null);
        }
      };
      const renderText = () => {
        if (slots.text) {
          return slots.text();
        }
        if (props.text) {
          return vue.createVNode("span", {
            "class": bem$w("text")
          }, [props.text]);
        }
      };
      const renderContent = () => {
        if (slots.default) {
          return slots.default();
        }
        return [renderIcon(), renderText()];
      };
      return () => {
        const {
          center,
          border,
          square,
          gutter,
          reverse,
          direction,
          clickable
        } = parent.props;
        const classes = [bem$w("content", [direction, {
          center,
          square,
          reverse,
          clickable,
          surround: border && gutter
        }]), {
          [BORDER]: border
        }];
        return vue.createVNode("div", {
          "class": [bem$w({
            square
          })],
          "style": rootStyle.value
        }, [vue.createVNode("div", {
          "role": clickable ? "button" : void 0,
          "class": classes,
          "style": contentStyle.value,
          "tabindex": clickable ? 0 : void 0,
          "onClick": route2
        }, [renderContent()])]);
      };
    }
  });
  const GridItem = withInstall(stdin_default$y);
  const getDistance = (touches) => Math.sqrt((touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2);
  const bem$v = createNamespace("image-preview")[1];
  var stdin_default$x = vue.defineComponent({
    props: {
      src: String,
      show: Boolean,
      active: Number,
      minZoom: makeRequiredProp(numericProp),
      maxZoom: makeRequiredProp(numericProp),
      rootWidth: makeRequiredProp(Number),
      rootHeight: makeRequiredProp(Number)
    },
    emits: ["scale", "close"],
    setup(props, {
      emit,
      slots
    }) {
      const state = vue.reactive({
        scale: 1,
        moveX: 0,
        moveY: 0,
        moving: false,
        zooming: false,
        imageRatio: 0,
        displayWidth: 0,
        displayHeight: 0
      });
      const touch = useTouch();
      const swipeItem = vue.ref();
      const vertical = vue.computed(() => {
        const {
          rootWidth,
          rootHeight
        } = props;
        const rootRatio = rootHeight / rootWidth;
        return state.imageRatio > rootRatio;
      });
      const imageStyle = vue.computed(() => {
        const {
          scale,
          moveX,
          moveY,
          moving,
          zooming
        } = state;
        const style = {
          transitionDuration: zooming || moving ? "0s" : ".3s"
        };
        if (scale !== 1) {
          const offsetX = moveX / scale;
          const offsetY = moveY / scale;
          style.transform = `scale(${scale}, ${scale}) translate(${offsetX}px, ${offsetY}px)`;
        }
        return style;
      });
      const maxMoveX = vue.computed(() => {
        if (state.imageRatio) {
          const {
            rootWidth,
            rootHeight
          } = props;
          const displayWidth = vertical.value ? rootHeight / state.imageRatio : rootWidth;
          return Math.max(0, (state.scale * displayWidth - rootWidth) / 2);
        }
        return 0;
      });
      const maxMoveY = vue.computed(() => {
        if (state.imageRatio) {
          const {
            rootWidth,
            rootHeight
          } = props;
          const displayHeight = vertical.value ? rootHeight : rootWidth * state.imageRatio;
          return Math.max(0, (state.scale * displayHeight - rootHeight) / 2);
        }
        return 0;
      });
      const setScale = (scale) => {
        scale = clamp(scale, +props.minZoom, +props.maxZoom + 1);
        if (scale !== state.scale) {
          state.scale = scale;
          emit("scale", {
            scale,
            index: props.active
          });
        }
      };
      const resetScale = () => {
        setScale(1);
        state.moveX = 0;
        state.moveY = 0;
      };
      const toggleScale = () => {
        const scale = state.scale > 1 ? 1 : 2;
        setScale(scale);
        state.moveX = 0;
        state.moveY = 0;
      };
      let fingerNum;
      let startMoveX;
      let startMoveY;
      let startScale;
      let startDistance;
      let doubleTapTimer;
      let touchStartTime;
      const onTouchStart = (event) => {
        const {
          touches
        } = event;
        const {
          offsetX
        } = touch;
        touch.start(event);
        fingerNum = touches.length;
        startMoveX = state.moveX;
        startMoveY = state.moveY;
        touchStartTime = Date.now();
        state.moving = fingerNum === 1 && state.scale !== 1;
        state.zooming = fingerNum === 2 && !offsetX.value;
        if (state.zooming) {
          startScale = state.scale;
          startDistance = getDistance(event.touches);
        }
      };
      const onTouchMove = (event) => {
        const {
          touches
        } = event;
        touch.move(event);
        if (state.moving || state.zooming) {
          preventDefault(event, true);
        }
        if (state.moving) {
          const {
            deltaX,
            deltaY
          } = touch;
          const moveX = deltaX.value + startMoveX;
          const moveY = deltaY.value + startMoveY;
          state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value);
          state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value);
        }
        if (state.zooming && touches.length === 2) {
          const distance = getDistance(touches);
          const scale = startScale * distance / startDistance;
          setScale(scale);
        }
      };
      const checkTap = () => {
        if (fingerNum > 1) {
          return;
        }
        const {
          offsetX,
          offsetY
        } = touch;
        const deltaTime = Date.now() - touchStartTime;
        const TAP_TIME = 250;
        const TAP_OFFSET = 5;
        if (offsetX.value < TAP_OFFSET && offsetY.value < TAP_OFFSET && deltaTime < TAP_TIME) {
          if (doubleTapTimer) {
            clearTimeout(doubleTapTimer);
            doubleTapTimer = null;
            toggleScale();
          } else {
            doubleTapTimer = setTimeout(() => {
              emit("close");
              doubleTapTimer = null;
            }, TAP_TIME);
          }
        }
      };
      const onTouchEnd = (event) => {
        let stopPropagation2 = false;
        if (state.moving || state.zooming) {
          stopPropagation2 = true;
          if (state.moving && startMoveX === state.moveX && startMoveY === state.moveY) {
            stopPropagation2 = false;
          }
          if (!event.touches.length) {
            if (state.zooming) {
              state.moveX = clamp(state.moveX, -maxMoveX.value, maxMoveX.value);
              state.moveY = clamp(state.moveY, -maxMoveY.value, maxMoveY.value);
              state.zooming = false;
            }
            state.moving = false;
            startMoveX = 0;
            startMoveY = 0;
            startScale = 1;
            if (state.scale < 1) {
              resetScale();
            }
            if (state.scale > props.maxZoom) {
              state.scale = +props.maxZoom;
            }
          }
        }
        preventDefault(event, stopPropagation2);
        checkTap();
        touch.reset();
      };
      const onLoad = (event) => {
        const {
          naturalWidth,
          naturalHeight
        } = event.target;
        state.imageRatio = naturalHeight / naturalWidth;
      };
      vue.watch(() => props.active, resetScale);
      vue.watch(() => props.show, (value) => {
        if (!value) {
          resetScale();
        }
      });
      useEventListener("touchmove", onTouchMove, {
        target: vue.computed(() => {
          var _a;
          return (_a = swipeItem.value) == null ? void 0 : _a.$el;
        })
      });
      return () => {
        const imageSlots = {
          loading: () => vue.createVNode(Loading, {
            "type": "spinner"
          }, null)
        };
        return vue.createVNode(SwipeItem, {
          "ref": swipeItem,
          "class": bem$v("swipe-item"),
          "onTouchstartPassive": onTouchStart,
          "onTouchend": onTouchEnd,
          "onTouchcancel": onTouchEnd
        }, {
          default: () => [slots.image ? vue.createVNode("div", {
            "class": bem$v("image-wrap")
          }, [slots.image({
            src: props.src
          })]) : vue.createVNode(Image, {
            "src": props.src,
            "fit": "contain",
            "class": bem$v("image", {
              vertical: vertical.value
            }),
            "style": imageStyle.value,
            "onLoad": onLoad
          }, imageSlots)]
        });
      };
    }
  });
  const [name$u, bem$u] = createNamespace("image-preview");
  const popupProps$1 = ["show", "transition", "overlayStyle", "closeOnPopstate"];
  const imagePreviewProps = {
    show: Boolean,
    loop: truthProp,
    images: makeArrayProp(),
    minZoom: makeNumericProp(1 / 3),
    maxZoom: makeNumericProp(3),
    overlay: truthProp,
    closeable: Boolean,
    showIndex: truthProp,
    className: unknownProp,
    closeIcon: makeStringProp("clear"),
    transition: String,
    beforeClose: Function,
    overlayClass: unknownProp,
    overlayStyle: Object,
    swipeDuration: makeNumericProp(300),
    startPosition: makeNumericProp(0),
    showIndicators: Boolean,
    closeOnPopstate: truthProp,
    closeIconPosition: makeStringProp("top-right")
  };
  var stdin_default$w = vue.defineComponent({
    name: name$u,
    props: imagePreviewProps,
    emits: ["scale", "close", "closed", "change", "update:show"],
    setup(props, {
      emit,
      slots
    }) {
      const swipeRef = vue.ref();
      const state = vue.reactive({
        active: 0,
        rootWidth: 0,
        rootHeight: 0
      });
      const resize = () => {
        if (swipeRef.value) {
          const rect = useRect(swipeRef.value.$el);
          state.rootWidth = rect.width;
          state.rootHeight = rect.height;
          swipeRef.value.resize();
        }
      };
      const emitScale = (args) => emit("scale", args);
      const updateShow = (show) => emit("update:show", show);
      const emitClose = () => {
        callInterceptor(props.beforeClose, {
          args: [state.active],
          done: () => updateShow(false)
        });
      };
      const setActive = (active) => {
        if (active !== state.active) {
          state.active = active;
          emit("change", active);
        }
      };
      const renderIndex = () => {
        if (props.showIndex) {
          return vue.createVNode("div", {
            "class": bem$u("index")
          }, [slots.index ? slots.index({
            index: state.active
          }) : `${state.active + 1} / ${props.images.length}`]);
        }
      };
      const renderCover = () => {
        if (slots.cover) {
          return vue.createVNode("div", {
            "class": bem$u("cover")
          }, [slots.cover()]);
        }
      };
      const renderImages = () => vue.createVNode(Swipe, {
        "ref": swipeRef,
        "lazyRender": true,
        "loop": props.loop,
        "class": bem$u("swipe"),
        "duration": props.swipeDuration,
        "initialSwipe": props.startPosition,
        "showIndicators": props.showIndicators,
        "indicatorColor": "white",
        "onChange": setActive
      }, {
        default: () => [props.images.map((image) => vue.createVNode(stdin_default$x, {
          "src": image,
          "show": props.show,
          "active": state.active,
          "maxZoom": props.maxZoom,
          "minZoom": props.minZoom,
          "rootWidth": state.rootWidth,
          "rootHeight": state.rootHeight,
          "onScale": emitScale,
          "onClose": emitClose
        }, {
          image: slots.image
        }))]
      });
      const renderClose = () => {
        if (props.closeable) {
          return vue.createVNode(Icon, {
            "role": "button",
            "name": props.closeIcon,
            "class": [bem$u("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
            "onClick": emitClose
          }, null);
        }
      };
      const onClosed = () => emit("closed");
      const swipeTo = (index, options) => {
        var _a;
        return (_a = swipeRef.value) == null ? void 0 : _a.swipeTo(index, options);
      };
      useExpose({
        swipeTo
      });
      vue.onMounted(resize);
      vue.watch([windowWidth, windowHeight], resize);
      vue.watch(() => props.startPosition, (value) => setActive(+value));
      vue.watch(() => props.show, (value) => {
        const {
          images,
          startPosition
        } = props;
        if (value) {
          setActive(+startPosition);
          vue.nextTick(() => {
            resize();
            swipeTo(+startPosition, {
              immediate: true
            });
          });
        } else {
          emit("close", {
            index: state.active,
            url: images[state.active]
          });
        }
      });
      return () => vue.createVNode(Popup, vue.mergeProps({
        "class": [bem$u(), props.className],
        "overlayClass": [bem$u("overlay"), props.overlayClass],
        "onClosed": onClosed,
        "onUpdate:show": updateShow
      }, pick(props, popupProps$1)), {
        default: () => [renderClose(), renderImages(), renderIndex(), renderCover()]
      });
    }
  });
  let instance$1;
  const defaultConfig = {
    loop: true,
    images: [],
    maxZoom: 3,
    minZoom: 1 / 3,
    onScale: void 0,
    onClose: void 0,
    onChange: void 0,
    teleport: "body",
    className: "",
    showIndex: true,
    closeable: false,
    closeIcon: "clear",
    transition: void 0,
    beforeClose: void 0,
    overlayStyle: void 0,
    overlayClass: void 0,
    startPosition: 0,
    swipeDuration: 300,
    showIndicators: false,
    closeOnPopstate: true,
    closeIconPosition: "top-right"
  };
  function initInstance$1() {
    ({
      instance: instance$1
    } = mountComponent({
      setup() {
        const {
          state,
          toggle
        } = usePopupState();
        const onClosed = () => {
          state.images = [];
        };
        return () => vue.createVNode(stdin_default$w, vue.mergeProps(state, {
          "onClosed": onClosed,
          "onUpdate:show": toggle
        }), null);
      }
    }));
  }
  const ImagePreview = (options, startPosition = 0) => {
    if (!inBrowser$1) {
      return;
    }
    if (!instance$1) {
      initInstance$1();
    }
    options = Array.isArray(options) ? {
      images: options,
      startPosition
    } : options;
    instance$1.open(extend({}, defaultConfig, options));
    return instance$1;
  };
  ImagePreview.Component = withInstall(stdin_default$w);
  ImagePreview.install = (app) => {
    app.use(ImagePreview.Component);
  };
  function genAlphabet() {
    const charCodeOfA = "A".charCodeAt(0);
    const indexList = Array(26).fill("").map((_2, i2) => String.fromCharCode(charCodeOfA + i2));
    return indexList;
  }
  const [name$t, bem$t] = createNamespace("index-bar");
  const indexBarProps = {
    sticky: truthProp,
    zIndex: numericProp,
    teleport: [String, Object],
    highlightColor: String,
    stickyOffsetTop: makeNumberProp(0),
    indexList: {
      type: Array,
      default: genAlphabet
    }
  };
  const INDEX_BAR_KEY = Symbol(name$t);
  var stdin_default$v = vue.defineComponent({
    name: name$t,
    props: indexBarProps,
    emits: ["select", "change"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const sidebar = vue.ref();
      const activeAnchor = vue.ref("");
      const touch = useTouch();
      const scrollParent = useScrollParent(root);
      const {
        children,
        linkChildren
      } = useChildren(INDEX_BAR_KEY);
      let selectActiveIndex;
      linkChildren({
        props
      });
      const sidebarStyle = vue.computed(() => {
        if (isDef(props.zIndex)) {
          return {
            zIndex: +props.zIndex + 1
          };
        }
      });
      const highlightStyle = vue.computed(() => {
        if (props.highlightColor) {
          return {
            color: props.highlightColor
          };
        }
      });
      const getActiveAnchor = (scrollTop, rects) => {
        for (let i2 = children.length - 1; i2 >= 0; i2--) {
          const prevHeight = i2 > 0 ? rects[i2 - 1].height : 0;
          const reachTop = props.sticky ? prevHeight + props.stickyOffsetTop : 0;
          if (scrollTop + reachTop >= rects[i2].top) {
            return i2;
          }
        }
        return -1;
      };
      const getMatchAnchor = (index) => children.find((item) => String(item.index) === index);
      const onScroll = () => {
        if (isHidden(root)) {
          return;
        }
        const {
          sticky,
          indexList
        } = props;
        const scrollTop = getScrollTop(scrollParent.value);
        const scrollParentRect = useRect(scrollParent);
        const rects = children.map((item) => item.getRect(scrollParent.value, scrollParentRect));
        let active = -1;
        if (selectActiveIndex) {
          const match = getMatchAnchor(selectActiveIndex);
          if (match) {
            const rect = match.getRect(scrollParent.value, scrollParentRect);
            active = getActiveAnchor(rect.top, rects);
          }
        } else {
          active = getActiveAnchor(scrollTop, rects);
        }
        activeAnchor.value = indexList[active];
        if (sticky) {
          children.forEach((item, index) => {
            const {
              state,
              $el
            } = item;
            if (index === active || index === active - 1) {
              const rect = $el.getBoundingClientRect();
              state.left = rect.left;
              state.width = rect.width;
            } else {
              state.left = null;
              state.width = null;
            }
            if (index === active) {
              state.active = true;
              state.top = Math.max(props.stickyOffsetTop, rects[index].top - scrollTop) + scrollParentRect.top;
            } else if (index === active - 1 && selectActiveIndex === "") {
              const activeItemTop = rects[active].top - scrollTop;
              state.active = activeItemTop > 0;
              state.top = activeItemTop + scrollParentRect.top - rects[index].height;
            } else {
              state.active = false;
            }
          });
        }
        selectActiveIndex = "";
      };
      const init = () => {
        vue.nextTick(onScroll);
      };
      useEventListener("scroll", onScroll, {
        target: scrollParent,
        passive: true
      });
      vue.onMounted(init);
      vue.watch(() => props.indexList, init);
      vue.watch(activeAnchor, (value) => {
        if (value) {
          emit("change", value);
        }
      });
      const renderIndexes = () => props.indexList.map((index) => {
        const active = index === activeAnchor.value;
        return vue.createVNode("span", {
          "class": bem$t("index", {
            active
          }),
          "style": active ? highlightStyle.value : void 0,
          "data-index": index
        }, [index]);
      });
      const scrollTo = (index) => {
        selectActiveIndex = String(index);
        const match = getMatchAnchor(selectActiveIndex);
        if (match) {
          const scrollTop = getScrollTop(scrollParent.value);
          const scrollParentRect = useRect(scrollParent);
          const {
            offsetHeight
          } = document.documentElement;
          match.$el.scrollIntoView();
          if (scrollTop === offsetHeight - scrollParentRect.height) {
            onScroll();
            return;
          }
          if (props.sticky && props.stickyOffsetTop) {
            setRootScrollTop(getRootScrollTop() - props.stickyOffsetTop);
          }
          emit("select", match.index);
        }
      };
      const scrollToElement = (element) => {
        const {
          index
        } = element.dataset;
        if (index) {
          scrollTo(index);
        }
      };
      const onClickSidebar = (event) => {
        scrollToElement(event.target);
      };
      let touchActiveIndex;
      const onTouchMove = (event) => {
        touch.move(event);
        if (touch.isVertical()) {
          preventDefault(event);
          const {
            clientX,
            clientY
          } = event.touches[0];
          const target = document.elementFromPoint(clientX, clientY);
          if (target) {
            const {
              index
            } = target.dataset;
            if (index && touchActiveIndex !== index) {
              touchActiveIndex = index;
              scrollToElement(target);
            }
          }
        }
      };
      const renderSidebar = () => vue.createVNode("div", {
        "ref": sidebar,
        "class": bem$t("sidebar"),
        "style": sidebarStyle.value,
        "onClick": onClickSidebar,
        "onTouchstartPassive": touch.start
      }, [renderIndexes()]);
      useExpose({
        scrollTo
      });
      useEventListener("touchmove", onTouchMove, {
        target: sidebar
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "class": bem$t()
        }, [props.teleport ? vue.createVNode(vue.Teleport, {
          "to": props.teleport
        }, {
          default: () => [renderSidebar()]
        }) : renderSidebar(), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const [name$s, bem$s] = createNamespace("index-anchor");
  const indexAnchorProps = {
    index: numericProp
  };
  var stdin_default$u = vue.defineComponent({
    name: name$s,
    props: indexAnchorProps,
    setup(props, {
      slots
    }) {
      const state = vue.reactive({
        top: 0,
        left: null,
        rect: {
          top: 0,
          height: 0
        },
        width: null,
        active: false
      });
      const root = vue.ref();
      const {
        parent
      } = useParent(INDEX_BAR_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/index-anchor/IndexAnchor.mjs:34", "[Vant] <IndexAnchor> must be a child component of <IndexBar>.");
        }
        return;
      }
      const isSticky = () => state.active && parent.props.sticky;
      const anchorStyle = vue.computed(() => {
        const {
          zIndex,
          highlightColor
        } = parent.props;
        if (isSticky()) {
          return extend(getZIndexStyle(zIndex), {
            left: state.left ? `${state.left}px` : void 0,
            width: state.width ? `${state.width}px` : void 0,
            transform: state.top ? `translate3d(0, ${state.top}px, 0)` : void 0,
            color: highlightColor
          });
        }
      });
      const getRect = (scrollParent, scrollParentRect) => {
        const rootRect = useRect(root);
        state.rect.height = rootRect.height;
        if (scrollParent === window || scrollParent === document.body) {
          state.rect.top = rootRect.top + getRootScrollTop();
        } else {
          state.rect.top = rootRect.top + getScrollTop(scrollParent) - scrollParentRect.top;
        }
        return state.rect;
      };
      useExpose({
        state,
        getRect
      });
      return () => {
        const sticky = isSticky();
        return vue.createVNode("div", {
          "ref": root,
          "style": {
            height: sticky ? `${state.rect.height}px` : void 0
          }
        }, [vue.createVNode("div", {
          "style": anchorStyle.value,
          "class": [bem$s({
            sticky
          }), {
            [BORDER_BOTTOM]: sticky
          }]
        }, [slots.default ? slots.default() : props.index])]);
      };
    }
  });
  const IndexAnchor = withInstall(stdin_default$u);
  const IndexBar = withInstall(stdin_default$v);
  const [name$r, bem$r, t$6] = createNamespace("list");
  const listProps = {
    error: Boolean,
    offset: makeNumericProp(300),
    loading: Boolean,
    finished: Boolean,
    errorText: String,
    direction: makeStringProp("down"),
    loadingText: String,
    finishedText: String,
    immediateCheck: truthProp
  };
  var stdin_default$t = vue.defineComponent({
    name: name$r,
    props: listProps,
    emits: ["load", "update:error", "update:loading"],
    setup(props, {
      emit,
      slots
    }) {
      const loading = vue.ref(false);
      const root = vue.ref();
      const placeholder = vue.ref();
      const tabStatus = useTabStatus();
      const scrollParent = useScrollParent(root);
      const check = () => {
        vue.nextTick(() => {
          if (loading.value || props.finished || props.error || (tabStatus == null ? void 0 : tabStatus.value) === false) {
            return;
          }
          const {
            offset: offset2,
            direction
          } = props;
          const scrollParentRect = useRect(scrollParent);
          if (!scrollParentRect.height || isHidden(root)) {
            return;
          }
          let isReachEdge = false;
          const placeholderRect = useRect(placeholder);
          if (direction === "up") {
            isReachEdge = scrollParentRect.top - placeholderRect.top <= offset2;
          } else {
            isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset2;
          }
          if (isReachEdge) {
            loading.value = true;
            emit("update:loading", true);
            emit("load");
          }
        });
      };
      const renderFinishedText = () => {
        if (props.finished) {
          const text = slots.finished ? slots.finished() : props.finishedText;
          if (text) {
            return vue.createVNode("div", {
              "class": bem$r("finished-text")
            }, [text]);
          }
        }
      };
      const clickErrorText = () => {
        emit("update:error", false);
        check();
      };
      const renderErrorText = () => {
        if (props.error) {
          const text = slots.error ? slots.error() : props.errorText;
          if (text) {
            return vue.createVNode("div", {
              "role": "button",
              "class": bem$r("error-text"),
              "tabindex": 0,
              "onClick": clickErrorText
            }, [text]);
          }
        }
      };
      const renderLoading = () => {
        if (loading.value && !props.finished) {
          return vue.createVNode("div", {
            "class": bem$r("loading")
          }, [slots.loading ? slots.loading() : vue.createVNode(Loading, {
            "class": bem$r("loading-icon")
          }, {
            default: () => [props.loadingText || t$6("loading")]
          })]);
        }
      };
      vue.watch(() => [props.loading, props.finished, props.error], check);
      if (tabStatus) {
        vue.watch(tabStatus, (tabActive) => {
          if (tabActive) {
            check();
          }
        });
      }
      vue.onUpdated(() => {
        loading.value = props.loading;
      });
      vue.onMounted(() => {
        if (props.immediateCheck) {
          check();
        }
      });
      useExpose({
        check
      });
      useEventListener("scroll", check, {
        target: scrollParent,
        passive: true
      });
      return () => {
        var _a;
        const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
        const Placeholder = vue.createVNode("div", {
          "ref": placeholder,
          "class": bem$r("placeholder")
        }, null);
        return vue.createVNode("div", {
          "ref": root,
          "role": "feed",
          "class": bem$r(),
          "aria-busy": loading.value
        }, [props.direction === "down" ? Content : Placeholder, renderLoading(), renderFinishedText(), renderErrorText(), props.direction === "up" ? Content : Placeholder]);
      };
    }
  });
  const List = withInstall(stdin_default$t);
  const [name$q, bem$q] = createNamespace("nav-bar");
  const navBarProps = {
    title: String,
    fixed: Boolean,
    zIndex: numericProp,
    border: truthProp,
    leftText: String,
    rightText: String,
    leftArrow: Boolean,
    placeholder: Boolean,
    safeAreaInsetTop: Boolean
  };
  var stdin_default$s = vue.defineComponent({
    name: name$q,
    props: navBarProps,
    emits: ["click-left", "click-right"],
    setup(props, {
      emit,
      slots
    }) {
      const navBarRef = vue.ref();
      const renderPlaceholder = usePlaceholder(navBarRef, bem$q);
      const onClickLeft = (event) => emit("click-left", event);
      const onClickRight = (event) => emit("click-right", event);
      const renderLeft = () => {
        if (slots.left) {
          return slots.left();
        }
        return [props.leftArrow && vue.createVNode(Icon, {
          "class": bem$q("arrow"),
          "name": "arrow-left"
        }, null), props.leftText && vue.createVNode("span", {
          "class": bem$q("text")
        }, [props.leftText])];
      };
      const renderRight = () => {
        if (slots.right) {
          return slots.right();
        }
        return vue.createVNode("span", {
          "class": bem$q("text")
        }, [props.rightText]);
      };
      const renderNavBar = () => {
        const {
          title,
          fixed,
          border,
          zIndex
        } = props;
        const style = getZIndexStyle(zIndex);
        const hasLeft = props.leftArrow || props.leftText || slots.left;
        const hasRight = props.rightText || slots.right;
        return vue.createVNode("div", {
          "ref": navBarRef,
          "style": style,
          "class": [bem$q({
            fixed
          }), {
            [BORDER_BOTTOM]: border,
            "van-safe-area-top": props.safeAreaInsetTop
          }]
        }, [vue.createVNode("div", {
          "class": bem$q("content")
        }, [hasLeft && vue.createVNode("div", {
          "class": [bem$q("left"), HAPTICS_FEEDBACK],
          "onClick": onClickLeft
        }, [renderLeft()]), vue.createVNode("div", {
          "class": [bem$q("title"), "van-ellipsis"]
        }, [slots.title ? slots.title() : title]), hasRight && vue.createVNode("div", {
          "class": [bem$q("right"), HAPTICS_FEEDBACK],
          "onClick": onClickRight
        }, [renderRight()])])]);
      };
      return () => {
        if (props.fixed && props.placeholder) {
          return renderPlaceholder(renderNavBar);
        }
        return renderNavBar();
      };
    }
  });
  const NavBar = withInstall(stdin_default$s);
  const [name$p, bem$p] = createNamespace("notice-bar");
  const noticeBarProps = {
    text: String,
    mode: String,
    color: String,
    delay: makeNumericProp(1),
    speed: makeNumericProp(60),
    leftIcon: String,
    wrapable: Boolean,
    background: String,
    scrollable: {
      type: Boolean,
      default: null
    }
  };
  var stdin_default$r = vue.defineComponent({
    name: name$p,
    props: noticeBarProps,
    emits: ["close", "replay"],
    setup(props, {
      emit,
      slots
    }) {
      let wrapWidth = 0;
      let contentWidth = 0;
      let startTimer;
      const wrapRef = vue.ref();
      const contentRef = vue.ref();
      const state = vue.reactive({
        show: true,
        offset: 0,
        duration: 0
      });
      const renderLeftIcon = () => {
        if (slots["left-icon"]) {
          return slots["left-icon"]();
        }
        if (props.leftIcon) {
          return vue.createVNode(Icon, {
            "class": bem$p("left-icon"),
            "name": props.leftIcon
          }, null);
        }
      };
      const getRightIconName = () => {
        if (props.mode === "closeable") {
          return "cross";
        }
        if (props.mode === "link") {
          return "arrow";
        }
      };
      const onClickRightIcon = (event) => {
        if (props.mode === "closeable") {
          state.show = false;
          emit("close", event);
        }
      };
      const renderRightIcon = () => {
        if (slots["right-icon"]) {
          return slots["right-icon"]();
        }
        const name2 = getRightIconName();
        if (name2) {
          return vue.createVNode(Icon, {
            "name": name2,
            "class": bem$p("right-icon"),
            "onClick": onClickRightIcon
          }, null);
        }
      };
      const onTransitionEnd = () => {
        state.offset = wrapWidth;
        state.duration = 0;
        raf(() => {
          doubleRaf(() => {
            state.offset = -contentWidth;
            state.duration = (contentWidth + wrapWidth) / +props.speed;
            emit("replay");
          });
        });
      };
      const renderMarquee = () => {
        const ellipsis = props.scrollable === false && !props.wrapable;
        const style = {
          transform: state.offset ? `translateX(${state.offset}px)` : "",
          transitionDuration: `${state.duration}s`
        };
        return vue.createVNode("div", {
          "ref": wrapRef,
          "role": "marquee",
          "class": bem$p("wrap")
        }, [vue.createVNode("div", {
          "ref": contentRef,
          "style": style,
          "class": [bem$p("content"), {
            "van-ellipsis": ellipsis
          }],
          "onTransitionend": onTransitionEnd
        }, [slots.default ? slots.default() : props.text])]);
      };
      const reset = () => {
        const {
          delay,
          speed,
          scrollable
        } = props;
        const ms = isDef(delay) ? +delay * 1e3 : 0;
        wrapWidth = 0;
        contentWidth = 0;
        state.offset = 0;
        state.duration = 0;
        clearTimeout(startTimer);
        startTimer = setTimeout(() => {
          if (!wrapRef.value || !contentRef.value || scrollable === false) {
            return;
          }
          const wrapRefWidth = useRect(wrapRef).width;
          const contentRefWidth = useRect(contentRef).width;
          if (scrollable || contentRefWidth > wrapRefWidth) {
            doubleRaf(() => {
              wrapWidth = wrapRefWidth;
              contentWidth = contentRefWidth;
              state.offset = -contentWidth;
              state.duration = contentWidth / +speed;
            });
          }
        }, ms);
      };
      onPopupReopen(reset);
      onMountedOrActivated(reset);
      useEventListener("pageshow", reset);
      useExpose({
        reset
      });
      vue.watch(() => [props.text, props.scrollable], reset);
      return () => {
        const {
          color,
          wrapable,
          background
        } = props;
        return vue.withDirectives(vue.createVNode("div", {
          "role": "alert",
          "class": bem$p({
            wrapable
          }),
          "style": {
            color,
            background
          }
        }, [renderLeftIcon(), renderMarquee(), renderRightIcon()]), [[vue.vShow, state.show]]);
      };
    }
  });
  const NoticeBar = withInstall(stdin_default$r);
  const [name$o, bem$o] = createNamespace("notify");
  const notifyProps = extend({}, popupSharedProps, {
    type: makeStringProp("danger"),
    color: String,
    message: numericProp,
    position: makeStringProp("top"),
    className: unknownProp,
    background: String,
    lockScroll: Boolean
  });
  var stdin_default$q = vue.defineComponent({
    name: name$o,
    props: notifyProps,
    emits: ["update:show"],
    setup(props, {
      emit,
      slots
    }) {
      const updateShow = (show) => emit("update:show", show);
      return () => vue.createVNode(Popup, {
        "show": props.show,
        "class": [bem$o([props.type]), props.className],
        "style": {
          color: props.color,
          background: props.background
        },
        "overlay": false,
        "position": props.position,
        "duration": 0.2,
        "lockScroll": props.lockScroll,
        "onUpdate:show": updateShow
      }, {
        default: () => [slots.default ? slots.default() : props.message]
      });
    }
  });
  let timer;
  let instance;
  const parseOptions = (message) => isObject(message) ? message : {
    message
  };
  function initInstance() {
    ({
      instance
    } = mountComponent({
      setup() {
        const {
          state,
          toggle
        } = usePopupState();
        return () => vue.createVNode(stdin_default$q, vue.mergeProps(state, {
          "onUpdate:show": toggle
        }), null);
      }
    }));
  }
  function Notify(options) {
    if (!inBrowser$1) {
      return;
    }
    if (!instance) {
      initInstance();
    }
    options = extend({}, Notify.currentOptions, parseOptions(options));
    instance.open(options);
    clearTimeout(timer);
    if (options.duration > 0) {
      timer = window.setTimeout(Notify.clear, options.duration);
    }
    return instance;
  }
  const getDefaultOptions = () => ({
    type: "danger",
    color: void 0,
    message: "",
    onClose: void 0,
    onClick: void 0,
    onOpened: void 0,
    duration: 3e3,
    position: void 0,
    className: "",
    lockScroll: false,
    background: void 0
  });
  Notify.clear = () => {
    if (instance) {
      instance.toggle(false);
    }
  };
  Notify.currentOptions = getDefaultOptions();
  Notify.setDefaultOptions = (options) => {
    extend(Notify.currentOptions, options);
  };
  Notify.resetDefaultOptions = () => {
    Notify.currentOptions = getDefaultOptions();
  };
  Notify.Component = withInstall(stdin_default$q);
  Notify.install = (app) => {
    app.use(Notify.Component);
    app.config.globalProperties.$notify = Notify;
  };
  const [name$n, bem$n] = createNamespace("key");
  const CollapseIcon = vue.createVNode("svg", {
    "class": bem$n("collapse-icon"),
    "viewBox": "0 0 30 24"
  }, [vue.createVNode("path", {
    "d": "M26 13h-2v2h2v-2zm-8-3h2V8h-2v2zm2-4h2V4h-2v2zm2 4h4V4h-2v4h-2v2zm-7 14 3-3h-6l3 3zM6 13H4v2h2v-2zm16 0H8v2h14v-2zm-12-3h2V8h-2v2zM28 0l1 1 1 1v15l-1 2H1l-1-2V2l1-1 1-1zm0 2H2v15h26V2zM6 4v2H4V4zm10 2h2V4h-2v2zM8 9v1H4V8zm8 0v1h-2V8zm-6-5v2H8V4zm4 0v2h-2V4z",
    "fill": "currentColor"
  }, null)]);
  const DeleteIcon = vue.createVNode("svg", {
    "class": bem$n("delete-icon"),
    "viewBox": "0 0 32 22"
  }, [vue.createVNode("path", {
    "d": "M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z",
    "fill": "currentColor"
  }, null)]);
  var stdin_default$p = vue.defineComponent({
    name: name$n,
    props: {
      type: String,
      text: numericProp,
      color: String,
      wider: Boolean,
      large: Boolean,
      loading: Boolean
    },
    emits: ["press"],
    setup(props, {
      emit,
      slots
    }) {
      const active = vue.ref(false);
      const touch = useTouch();
      const onTouchStart = (event) => {
        touch.start(event);
        active.value = true;
      };
      const onTouchMove = (event) => {
        touch.move(event);
        if (touch.direction.value) {
          active.value = false;
        }
      };
      const onTouchEnd = (event) => {
        if (active.value) {
          if (!slots.default) {
            preventDefault(event);
          }
          active.value = false;
          emit("press", props.text, props.type);
        }
      };
      const renderContent = () => {
        if (props.loading) {
          return vue.createVNode(Loading, {
            "class": bem$n("loading-icon")
          }, null);
        }
        const text = slots.default ? slots.default() : props.text;
        switch (props.type) {
          case "delete":
            return text || DeleteIcon;
          case "extra":
            return text || CollapseIcon;
          default:
            return text;
        }
      };
      return () => vue.createVNode("div", {
        "class": bem$n("wrapper", {
          wider: props.wider
        }),
        "onTouchstartPassive": onTouchStart,
        "onTouchmovePassive": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [vue.createVNode("div", {
        "role": "button",
        "tabindex": 0,
        "class": bem$n([props.color, {
          large: props.large,
          active: active.value,
          delete: props.type === "delete"
        }])
      }, [renderContent()])]);
    }
  });
  const [name$m, bem$m] = createNamespace("number-keyboard");
  const numberKeyboardProps = {
    show: Boolean,
    title: String,
    theme: makeStringProp("default"),
    zIndex: numericProp,
    teleport: [String, Object],
    maxlength: makeNumericProp(Infinity),
    modelValue: makeStringProp(""),
    transition: truthProp,
    blurOnClose: truthProp,
    showDeleteKey: truthProp,
    randomKeyOrder: Boolean,
    closeButtonText: String,
    deleteButtonText: String,
    closeButtonLoading: Boolean,
    hideOnClickOutside: truthProp,
    safeAreaInsetBottom: truthProp,
    extraKey: {
      type: [String, Array],
      default: ""
    }
  };
  function shuffle(array) {
    for (let i2 = array.length - 1; i2 > 0; i2--) {
      const j2 = Math.floor(Math.random() * (i2 + 1));
      const temp = array[i2];
      array[i2] = array[j2];
      array[j2] = temp;
    }
    return array;
  }
  var stdin_default$o = vue.defineComponent({
    name: name$m,
    props: numberKeyboardProps,
    emits: ["show", "hide", "blur", "input", "close", "delete", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const genBasicKeys = () => {
        const keys2 = Array(9).fill("").map((_2, i2) => ({
          text: i2 + 1
        }));
        if (props.randomKeyOrder) {
          shuffle(keys2);
        }
        return keys2;
      };
      const genDefaultKeys = () => [...genBasicKeys(), {
        text: props.extraKey,
        type: "extra"
      }, {
        text: 0
      }, {
        text: props.showDeleteKey ? props.deleteButtonText : "",
        type: props.showDeleteKey ? "delete" : ""
      }];
      const genCustomKeys = () => {
        const keys2 = genBasicKeys();
        const {
          extraKey
        } = props;
        const extraKeys = Array.isArray(extraKey) ? extraKey : [extraKey];
        if (extraKeys.length === 1) {
          keys2.push({
            text: 0,
            wider: true
          }, {
            text: extraKeys[0],
            type: "extra"
          });
        } else if (extraKeys.length === 2) {
          keys2.push({
            text: extraKeys[0],
            type: "extra"
          }, {
            text: 0
          }, {
            text: extraKeys[1],
            type: "extra"
          });
        }
        return keys2;
      };
      const keys = vue.computed(() => props.theme === "custom" ? genCustomKeys() : genDefaultKeys());
      const onBlur = () => {
        if (props.show) {
          emit("blur");
        }
      };
      const onClose = () => {
        emit("close");
        if (props.blurOnClose) {
          onBlur();
        }
      };
      const onAnimationEnd = () => emit(props.show ? "show" : "hide");
      const onPress = (text, type) => {
        if (text === "") {
          if (type === "extra") {
            onBlur();
          }
          return;
        }
        const value = props.modelValue;
        if (type === "delete") {
          emit("delete");
          emit("update:modelValue", value.slice(0, value.length - 1));
        } else if (type === "close") {
          onClose();
        } else if (value.length < props.maxlength) {
          emit("input", text);
          emit("update:modelValue", value + text);
        }
      };
      const renderTitle = () => {
        const {
          title,
          theme,
          closeButtonText
        } = props;
        const leftSlot = slots["title-left"];
        const showClose = closeButtonText && theme === "default";
        const showTitle = title || showClose || leftSlot;
        if (!showTitle) {
          return;
        }
        return vue.createVNode("div", {
          "class": bem$m("header")
        }, [leftSlot && vue.createVNode("span", {
          "class": bem$m("title-left")
        }, [leftSlot()]), title && vue.createVNode("h2", {
          "class": bem$m("title")
        }, [title]), showClose && vue.createVNode("button", {
          "type": "button",
          "class": [bem$m("close"), HAPTICS_FEEDBACK],
          "onClick": onClose
        }, [closeButtonText])]);
      };
      const renderKeys = () => keys.value.map((key) => {
        const keySlots = {};
        if (key.type === "delete") {
          keySlots.default = slots.delete;
        }
        if (key.type === "extra") {
          keySlots.default = slots["extra-key"];
        }
        return vue.createVNode(stdin_default$p, {
          "key": key.text,
          "text": key.text,
          "type": key.type,
          "wider": key.wider,
          "color": key.color,
          "onPress": onPress
        }, keySlots);
      });
      const renderSidebar = () => {
        if (props.theme === "custom") {
          return vue.createVNode("div", {
            "class": bem$m("sidebar")
          }, [props.showDeleteKey && vue.createVNode(stdin_default$p, {
            "large": true,
            "text": props.deleteButtonText,
            "type": "delete",
            "onPress": onPress
          }, {
            delete: slots.delete
          }), vue.createVNode(stdin_default$p, {
            "large": true,
            "text": props.closeButtonText,
            "type": "close",
            "color": "blue",
            "loading": props.closeButtonLoading,
            "onPress": onPress
          }, null)]);
        }
      };
      vue.watch(() => props.show, (value) => {
        if (!props.transition) {
          emit(value ? "show" : "hide");
        }
      });
      if (props.hideOnClickOutside) {
        useClickAway(root, onBlur, {
          eventName: "touchstart"
        });
      }
      return () => {
        const Title = renderTitle();
        const Content = vue.createVNode(vue.Transition, {
          "name": props.transition ? "van-slide-up" : ""
        }, {
          default: () => [vue.withDirectives(vue.createVNode("div", {
            "ref": root,
            "style": getZIndexStyle(props.zIndex),
            "class": bem$m({
              unfit: !props.safeAreaInsetBottom,
              "with-title": !!Title
            }),
            "onAnimationend": onAnimationEnd,
            "onTouchstartPassive": stopPropagation
          }, [Title, vue.createVNode("div", {
            "class": bem$m("body")
          }, [vue.createVNode("div", {
            "class": bem$m("keys")
          }, [renderKeys()]), renderSidebar()])]), [[vue.vShow, props.show]])]
        });
        if (props.teleport) {
          return vue.createVNode(vue.Teleport, {
            "to": props.teleport
          }, {
            default: () => [Content]
          });
        }
        return Content;
      };
    }
  });
  const NumberKeyboard = withInstall(stdin_default$o);
  const [name$l, bem$l, t$5] = createNamespace("pagination");
  const makePage = (number, text, active) => ({
    number,
    text,
    active
  });
  const paginationProps = {
    mode: makeStringProp("multi"),
    prevText: String,
    nextText: String,
    pageCount: makeNumericProp(0),
    modelValue: makeNumberProp(0),
    totalItems: makeNumericProp(0),
    showPageSize: makeNumericProp(5),
    itemsPerPage: makeNumericProp(10),
    forceEllipses: Boolean
  };
  var stdin_default$n = vue.defineComponent({
    name: name$l,
    props: paginationProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const count = vue.computed(() => {
        const {
          pageCount,
          totalItems,
          itemsPerPage
        } = props;
        const count2 = +pageCount || Math.ceil(+totalItems / +itemsPerPage);
        return Math.max(1, count2);
      });
      const pages2 = vue.computed(() => {
        const items = [];
        const pageCount = count.value;
        const showPageSize = +props.showPageSize;
        const {
          modelValue,
          forceEllipses
        } = props;
        let startPage = 1;
        let endPage = pageCount;
        const isMaxSized = showPageSize < pageCount;
        if (isMaxSized) {
          startPage = Math.max(modelValue - Math.floor(showPageSize / 2), 1);
          endPage = startPage + showPageSize - 1;
          if (endPage > pageCount) {
            endPage = pageCount;
            startPage = endPage - showPageSize + 1;
          }
        }
        for (let number = startPage; number <= endPage; number++) {
          const page = makePage(number, number, number === modelValue);
          items.push(page);
        }
        if (isMaxSized && showPageSize > 0 && forceEllipses) {
          if (startPage > 1) {
            const prevPages = makePage(startPage - 1, "...");
            items.unshift(prevPages);
          }
          if (endPage < pageCount) {
            const nextPages = makePage(endPage + 1, "...");
            items.push(nextPages);
          }
        }
        return items;
      });
      const updateModelValue = (value, emitChange) => {
        value = clamp(value, 1, count.value);
        if (props.modelValue !== value) {
          emit("update:modelValue", value);
          if (emitChange) {
            emit("change", value);
          }
        }
      };
      vue.watchEffect(() => updateModelValue(props.modelValue));
      const renderDesc = () => vue.createVNode("li", {
        "class": bem$l("page-desc")
      }, [slots.pageDesc ? slots.pageDesc() : `${props.modelValue}/${count.value}`]);
      const renderPrevButton = () => {
        const {
          mode,
          modelValue
        } = props;
        const slot = slots["prev-text"];
        const disabled = modelValue === 1;
        return vue.createVNode("li", {
          "class": [bem$l("item", {
            disabled,
            border: mode === "simple",
            prev: true
          }), BORDER_SURROUND]
        }, [vue.createVNode("button", {
          "type": "button",
          "disabled": disabled,
          "onClick": () => updateModelValue(modelValue - 1, true)
        }, [slot ? slot() : props.prevText || t$5("prev")])]);
      };
      const renderNextButton = () => {
        const {
          mode,
          modelValue
        } = props;
        const slot = slots["next-text"];
        const disabled = modelValue === count.value;
        return vue.createVNode("li", {
          "class": [bem$l("item", {
            disabled,
            border: mode === "simple",
            next: true
          }), BORDER_SURROUND]
        }, [vue.createVNode("button", {
          "type": "button",
          "disabled": disabled,
          "onClick": () => updateModelValue(modelValue + 1, true)
        }, [slot ? slot() : props.nextText || t$5("next")])]);
      };
      const renderPages = () => pages2.value.map((page) => vue.createVNode("li", {
        "class": [bem$l("item", {
          active: page.active,
          page: true
        }), BORDER_SURROUND]
      }, [vue.createVNode("button", {
        "type": "button",
        "aria-current": page.active || void 0,
        "onClick": () => updateModelValue(page.number, true)
      }, [slots.page ? slots.page(page) : page.text])]));
      return () => vue.createVNode("nav", {
        "role": "navigation",
        "class": bem$l()
      }, [vue.createVNode("ul", {
        "class": bem$l("items")
      }, [renderPrevButton(), props.mode === "simple" ? renderDesc() : renderPages(), renderNextButton()])]);
    }
  });
  const Pagination = withInstall(stdin_default$n);
  const [name$k, bem$k] = createNamespace("password-input");
  const passwordInputProps = {
    info: String,
    mask: truthProp,
    value: makeStringProp(""),
    gutter: numericProp,
    length: makeNumericProp(6),
    focused: Boolean,
    errorInfo: String
  };
  var stdin_default$m = vue.defineComponent({
    name: name$k,
    props: passwordInputProps,
    emits: ["focus"],
    setup(props, {
      emit
    }) {
      const onTouchStart = (event) => {
        event.stopPropagation();
        emit("focus", event);
      };
      const renderPoints = () => {
        const Points = [];
        const {
          mask,
          value,
          length,
          gutter,
          focused
        } = props;
        for (let i2 = 0; i2 < length; i2++) {
          const char = value[i2];
          const showBorder = i2 !== 0 && !gutter;
          const showCursor = focused && i2 === value.length;
          let style;
          if (i2 !== 0 && gutter) {
            style = {
              marginLeft: addUnit(gutter)
            };
          }
          Points.push(vue.createVNode("li", {
            "class": [{
              [BORDER_LEFT]: showBorder
            }, bem$k("item", {
              focus: showCursor
            })],
            "style": style
          }, [mask ? vue.createVNode("i", {
            "style": {
              visibility: char ? "visible" : "hidden"
            }
          }, null) : char, showCursor && vue.createVNode("div", {
            "class": bem$k("cursor")
          }, null)]));
        }
        return Points;
      };
      return () => {
        const info = props.errorInfo || props.info;
        return vue.createVNode("div", {
          "class": bem$k()
        }, [vue.createVNode("ul", {
          "class": [bem$k("security"), {
            [BORDER_SURROUND]: !props.gutter
          }],
          "onTouchstartPassive": onTouchStart
        }, [renderPoints()]), info && vue.createVNode("div", {
          "class": bem$k(props.errorInfo ? "error-info" : "info")
        }, [info])]);
      };
    }
  });
  const PasswordInput = withInstall(stdin_default$m);
  function getWindow(node) {
    if (node == null) {
      return window;
    }
    if (node.toString() !== "[object Window]") {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
  }
  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }
  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }
  function isShadowRoot(node) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }
  var round = Math.round;
  function getUAString() {
    var uaData = navigator.userAgentData;
    if (uaData != null && uaData.brands) {
      return uaData.brands.map(function(item) {
        return item.brand + "/" + item.version;
      }).join(" ");
    }
    return navigator.userAgent;
  }
  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }
    var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x2 = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y2 = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width2 = clientRect.width / scaleX;
    var height2 = clientRect.height / scaleY;
    return {
      width: width2,
      height: height2,
      top: y2,
      right: x2 + width2,
      bottom: y2 + height2,
      left: x2,
      x: x2,
      y: y2
    };
  }
  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft,
      scrollTop
    };
  }
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }
  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }
  function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
  }
  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }
  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  }
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }
  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element);
    var width2 = element.offsetWidth;
    var height2 = element.offsetHeight;
    if (Math.abs(clientRect.width - width2) <= 1) {
      width2 = clientRect.width;
    }
    if (Math.abs(clientRect.height - height2) <= 1) {
      height2 = clientRect.height;
    }
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width2,
      height: height2
    };
  }
  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }
    return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
  }
  function getScrollParent(node) {
    if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
      return node.ownerDocument.body;
    }
    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }
    return getScrollParent(getParentNode(node));
  }
  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) {
      list = [];
    }
    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
  }
  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }
  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
      return null;
    }
    return element.offsetParent;
  }
  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());
    if (isIE && isHTMLElement(element)) {
      var elementCss = getComputedStyle(element);
      if (elementCss.position === "fixed") {
        return null;
      }
    }
    var currentNode = getParentNode(element);
    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }
    while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle(currentNode);
      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
    return null;
  }
  function getOffsetParent(element) {
    var window2 = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
      offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
      return window2;
    }
    return offsetParent || getContainingBlock(element) || window2;
  }
  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start = "start";
  var end = "end";
  var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []);
  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead";
  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain";
  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
  function order(modifiers) {
    var map = /* @__PURE__ */ new Map();
    var visited = /* @__PURE__ */ new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
      map.set(modifier.name, modifier);
    });
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function(dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);
          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
      if (!visited.has(modifier.name)) {
        sort(modifier);
      }
    });
    return result;
  }
  function orderModifiers(modifiers) {
    var orderedModifiers = order(modifiers);
    return modifierPhases.reduce(function(acc, phase) {
      return acc.concat(orderedModifiers.filter(function(modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }
  function debounce(fn2) {
    var pending;
    return function() {
      if (!pending) {
        pending = new Promise(function(resolve) {
          Promise.resolve().then(function() {
            pending = void 0;
            resolve(fn2());
          });
        });
      }
      return pending;
    };
  }
  function format(str) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return [].concat(args).reduce(function(p2, c2) {
      return p2.replace(/%s/, c2);
    }, str);
  }
  var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
  var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
  var VALID_PROPERTIES = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
  function validateModifiers(modifiers) {
    modifiers.forEach(function(modifier) {
      [].concat(Object.keys(modifier), VALID_PROPERTIES).filter(function(value, index, self) {
        return self.indexOf(value) === index;
      }).forEach(function(key) {
        switch (key) {
          case "name":
            if (typeof modifier.name !== "string") {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:376", format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', '"' + String(modifier.name) + '"'));
            }
            break;
          case "enabled":
            if (typeof modifier.enabled !== "boolean") {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:381", format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', '"' + String(modifier.enabled) + '"'));
            }
            break;
          case "phase":
            if (modifierPhases.indexOf(modifier.phase) < 0) {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:386", format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(", "), '"' + String(modifier.phase) + '"'));
            }
            break;
          case "fn":
            if (typeof modifier.fn !== "function") {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:391", format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', '"' + String(modifier.fn) + '"'));
            }
            break;
          case "effect":
            if (modifier.effect != null && typeof modifier.effect !== "function") {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:396", format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', '"' + String(modifier.fn) + '"'));
            }
            break;
          case "requires":
            if (modifier.requires != null && !Array.isArray(modifier.requires)) {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:401", format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', '"' + String(modifier.requires) + '"'));
            }
            break;
          case "requiresIfExists":
            if (!Array.isArray(modifier.requiresIfExists)) {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:406", format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', '"' + String(modifier.requiresIfExists) + '"'));
            }
            break;
          case "options":
          case "data":
            break;
          default:
            formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:413", 'PopperJS: an invalid property has been provided to the "' + modifier.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function(s2) {
              return '"' + s2 + '"';
            }).join(", ") + '; but "' + key + '" was provided.');
        }
        modifier.requires && modifier.requires.forEach(function(requirement) {
          if (modifiers.find(function(mod) {
            return mod.name === requirement;
          }) == null) {
            formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:421", format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
          }
        });
      });
    });
  }
  function uniqueBy(arr, fn2) {
    var identifiers = /* @__PURE__ */ new Set();
    return arr.filter(function(item) {
      var identifier = fn2(item);
      if (!identifiers.has(identifier)) {
        identifiers.add(identifier);
        return true;
      }
    });
  }
  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }
  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function(merged2, current2) {
      var existing = merged2[current2.name];
      merged2[current2.name] = existing ? Object.assign({}, existing, current2, {
        options: Object.assign({}, existing.options, current2.options),
        data: Object.assign({}, existing.data, current2.data)
      }) : current2;
      return merged2;
    }, {});
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }
  function getVariation(placement) {
    return placement.split("-")[1];
  }
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }
  function computeOffsets(_ref) {
    var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";
      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }
    return offsets;
  }
  var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
  var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return !args.some(function(element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper2(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions2;
      }
      var state = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
        modifiersData: {},
        elements: {
          reference,
          popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance2 = {
        state,
        setOptions: function setOptions(setOptionsAction) {
          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions2, state.options, options2);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          };
          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
          state.orderedModifiers = orderedModifiers.filter(function(m2) {
            return m2.enabled;
          });
          {
            var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function(_ref) {
              var name2 = _ref.name;
              return name2;
            });
            validateModifiers(modifiers);
            if (getBasePlacement(state.options.placement) === auto) {
              var flipModifier = state.orderedModifiers.find(function(_ref2) {
                var name2 = _ref2.name;
                return name2 === "flip";
              });
              if (!flipModifier) {
                formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:590", ['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
              }
            }
            var _getComputedStyle = getComputedStyle(popper), marginTop = _getComputedStyle.marginTop, marginRight = _getComputedStyle.marginRight, marginBottom = _getComputedStyle.marginBottom, marginLeft = _getComputedStyle.marginLeft;
            if ([marginTop, marginRight, marginBottom, marginLeft].some(function(margin) {
              return parseFloat(margin);
            })) {
              formatAppLog("warn", "at node_modules/@vant/popperjs/dist/index.esm.mjs:597", ['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
            }
          }
          runModifierEffects();
          return instance2.update();
        },
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }
          var _state$elements = state.elements, reference2 = _state$elements.reference, popper2 = _state$elements.popper;
          if (!areValidElements(reference2, popper2)) {
            {
              formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:610", INVALID_ELEMENT_ERROR);
            }
            return;
          }
          state.rects = {
            reference: getCompositeRect(reference2, getOffsetParent(popper2), state.options.strategy === "fixed"),
            popper: getLayoutRect(popper2)
          };
          state.reset = false;
          state.placement = state.options.placement;
          state.orderedModifiers.forEach(function(modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          var __debug_loops__ = 0;
          for (var index = 0; index < state.orderedModifiers.length; index++) {
            {
              __debug_loops__ += 1;
              if (__debug_loops__ > 100) {
                formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:628", INFINITE_LOOP_ERROR);
                break;
              }
            }
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }
            var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name2 = _state$orderedModifie.name;
            if (typeof fn2 === "function") {
              state = fn2({
                state,
                options: _options,
                name: name2,
                instance: instance2
              }) || state;
            }
          }
        },
        update: debounce(function() {
          return new Promise(function(resolve) {
            instance2.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };
      if (!areValidElements(reference, popper)) {
        {
          formatAppLog("error", "at node_modules/@vant/popperjs/dist/index.esm.mjs:661", INVALID_ELEMENT_ERROR);
        }
        return instance2;
      }
      instance2.setOptions(options).then(function(state2) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state2);
        }
      });
      function runModifierEffects() {
        state.orderedModifiers.forEach(function(_ref3) {
          var name2 = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect3 = _ref3.effect;
          if (typeof effect3 === "function") {
            var cleanupFn = effect3({
              state,
              name: name2,
              instance: instance2,
              options: options2
            });
            var noopFn = function noopFn2() {
            };
            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function(fn2) {
          return fn2();
        });
        effectCleanupFns = [];
      }
      return instance2;
    };
  }
  var passive = {
    passive: true
  };
  function effect(_ref) {
    var state = _ref.state, instance2 = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window2 = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance2.update, passive);
      });
    }
    if (resize) {
      window2.addEventListener("resize", instance2.update, passive);
    }
    return function() {
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.removeEventListener("scroll", instance2.update, passive);
        });
      }
      if (resize) {
        window2.removeEventListener("resize", instance2.update, passive);
      }
    };
  }
  var eventListeners_default = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn2() {
    },
    effect,
    data: {}
  };
  function popperOffsets(_ref) {
    var state = _ref.state, name2 = _ref.name;
    state.modifiersData[name2] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: "absolute",
      placement: state.placement
    });
  }
  var popperOffsets_default = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function roundOffsetsByDPR(_ref) {
    var x2 = _ref.x, y2 = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x2 * dpr) / dpr || 0,
      y: round(y2 * dpr) / dpr || 0
    };
  }
  function mapToStyles(_ref2) {
    var _Object$assign2;
    var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x2 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y2 = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
      x: x2,
      y: y2
    }) : {
      x: x2,
      y: y2
    };
    x2 = _ref3.x;
    y2 = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";
      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);
        if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      }
      offsetParent = offsetParent;
      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
        y2 -= offsetY - popperRect.height;
        y2 *= gpuAcceleration ? 1 : -1;
      }
      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
        x2 -= offsetX - popperRect.width;
        x2 *= gpuAcceleration ? 1 : -1;
      }
    }
    var commonStyles = Object.assign({
      position
    }, adaptive && unsetSides);
    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x: x2,
      y: y2
    }) : {
      x: x2,
      y: y2
    };
    x2 = _ref4.x;
    y2 = _ref4.y;
    if (gpuAcceleration) {
      var _Object$assign;
      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x2 + "px, " + y2 + "px)" : "translate3d(" + x2 + "px, " + y2 + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y2 + "px" : "", _Object$assign2[sideX] = hasX ? x2 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
  }
  function computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    {
      var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || "";
      if (adaptive && ["transform", "top", "right", "bottom", "left"].some(function(property) {
        return transitionProperty.indexOf(property) >= 0;
      })) {
        formatAppLog("warn", "at node_modules/@vant/popperjs/dist/index.esm.mjs:837", ["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
      }
    }
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration,
      isFixed: state.options.strategy === "fixed"
    };
    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive,
        roundOffsets
      })));
    }
    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets
      })));
    }
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement
    });
  }
  var computeStyles_default = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };
  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name2) {
      var style = state.styles[name2] || {};
      var attributes = state.attributes[name2] || {};
      var element = state.elements[name2];
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(name22) {
        var value = attributes[name22];
        if (value === false) {
          element.removeAttribute(name22);
        } else {
          element.setAttribute(name22, value === true ? "" : value);
        }
      });
    });
  }
  function effect2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
    return function() {
      Object.keys(state.elements).forEach(function(name2) {
        var element = state.elements[name2];
        var attributes = state.attributes[name2] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name2) ? state.styles[name2] : initialStyles[name2]);
        var style = styleProperties.reduce(function(style2, property) {
          style2[property] = "";
          return style2;
        }, {});
        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  }
  var applyStyles_default = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect: effect2,
    requires: ["computeStyles"]
  };
  var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
  var createPopper = /* @__PURE__ */ popperGenerator({
    defaultModifiers
  });
  function distanceAndSkiddingToXY(placement, rects, offset2) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
      placement
    })) : offset2, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }
  function offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name2 = _ref2.name;
    var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function(acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement], x2 = _data$state$placement.x, y2 = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x2;
      state.modifiersData.popperOffsets.y += y2;
    }
    state.modifiersData[name2] = data;
  }
  var offset_default = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };
  const [name$j, bem$j] = createNamespace("popover");
  const popupProps = ["show", "overlay", "duration", "teleport", "overlayStyle", "overlayClass", "closeOnClickOverlay"];
  const popoverProps = {
    show: Boolean,
    theme: makeStringProp("light"),
    overlay: Boolean,
    actions: makeArrayProp(),
    trigger: makeStringProp("click"),
    duration: numericProp,
    showArrow: truthProp,
    placement: makeStringProp("bottom"),
    iconPrefix: String,
    overlayClass: unknownProp,
    overlayStyle: Object,
    closeOnClickAction: truthProp,
    closeOnClickOverlay: truthProp,
    closeOnClickOutside: truthProp,
    offset: {
      type: Array,
      default: () => [0, 8]
    },
    teleport: {
      type: [String, Object],
      default: "body"
    }
  };
  var stdin_default$l = vue.defineComponent({
    name: name$j,
    props: popoverProps,
    emits: ["select", "touchstart", "update:show"],
    setup(props, {
      emit,
      slots,
      attrs
    }) {
      let popper;
      const popupRef = vue.ref();
      const wrapperRef = vue.ref();
      const popoverRef = vue.ref();
      const getPopoverOptions = () => ({
        placement: props.placement,
        modifiers: [{
          name: "computeStyles",
          options: {
            adaptive: false,
            gpuAcceleration: false
          }
        }, extend({}, offset_default, {
          options: {
            offset: props.offset
          }
        })]
      });
      const createPopperInstance = () => {
        if (wrapperRef.value && popoverRef.value) {
          return createPopper(wrapperRef.value, popoverRef.value.popupRef.value, getPopoverOptions());
        }
        return null;
      };
      const updateLocation = () => {
        vue.nextTick(() => {
          if (!props.show) {
            return;
          }
          if (!popper) {
            popper = createPopperInstance();
          } else {
            popper.setOptions(getPopoverOptions());
          }
        });
      };
      const updateShow = (value) => emit("update:show", value);
      const onClickWrapper = () => {
        if (props.trigger === "click") {
          updateShow(!props.show);
        }
      };
      const onClickAction = (action, index) => {
        if (action.disabled) {
          return;
        }
        emit("select", action, index);
        if (props.closeOnClickAction) {
          updateShow(false);
        }
      };
      const onClickAway = () => {
        if (props.show && props.closeOnClickOutside && (!props.overlay || props.closeOnClickOverlay)) {
          updateShow(false);
        }
      };
      const renderActionContent = (action, index) => {
        if (slots.action) {
          return slots.action({
            action,
            index
          });
        }
        return [action.icon && vue.createVNode(Icon, {
          "name": action.icon,
          "classPrefix": props.iconPrefix,
          "class": bem$j("action-icon")
        }, null), vue.createVNode("div", {
          "class": [bem$j("action-text"), BORDER_BOTTOM]
        }, [action.text])];
      };
      const renderAction = (action, index) => {
        const {
          icon,
          color,
          disabled,
          className
        } = action;
        return vue.createVNode("div", {
          "role": "menuitem",
          "class": [bem$j("action", {
            disabled,
            "with-icon": icon
          }), className],
          "style": {
            color
          },
          "tabindex": disabled ? void 0 : 0,
          "aria-disabled": disabled || void 0,
          "onClick": () => onClickAction(action, index)
        }, [renderActionContent(action, index)]);
      };
      vue.onMounted(() => {
        updateLocation();
        vue.watchEffect(() => {
          var _a;
          popupRef.value = (_a = popoverRef.value) == null ? void 0 : _a.popupRef.value;
        });
      });
      vue.onBeforeUnmount(() => {
        if (popper) {
          popper.destroy();
          popper = null;
        }
      });
      vue.watch(() => [props.show, props.offset, props.placement], updateLocation);
      useClickAway([wrapperRef, popupRef], onClickAway, {
        eventName: "touchstart"
      });
      return () => {
        var _a;
        return vue.createVNode(vue.Fragment, null, [vue.createVNode("span", {
          "ref": wrapperRef,
          "class": bem$j("wrapper"),
          "onClick": onClickWrapper
        }, [(_a = slots.reference) == null ? void 0 : _a.call(slots)]), vue.createVNode(Popup, vue.mergeProps({
          "ref": popoverRef,
          "class": bem$j([props.theme]),
          "position": "",
          "transition": "van-popover-zoom",
          "lockScroll": false,
          "onUpdate:show": updateShow
        }, attrs, pick(props, popupProps)), {
          default: () => [props.showArrow && vue.createVNode("div", {
            "class": bem$j("arrow")
          }, null), vue.createVNode("div", {
            "role": "menu",
            "class": bem$j("content")
          }, [slots.default ? slots.default() : props.actions.map(renderAction)])]
        })]);
      };
    }
  });
  const Popover = withInstall(stdin_default$l);
  const [name$i, bem$i] = createNamespace("progress");
  const progressProps = {
    color: String,
    inactive: Boolean,
    pivotText: String,
    textColor: String,
    showPivot: truthProp,
    pivotColor: String,
    trackColor: String,
    strokeWidth: numericProp,
    percentage: {
      type: numericProp,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    }
  };
  var stdin_default$k = vue.defineComponent({
    name: name$i,
    props: progressProps,
    setup(props) {
      const background = vue.computed(() => props.inactive ? void 0 : props.color);
      const renderPivot = () => {
        const {
          textColor,
          pivotText,
          pivotColor,
          percentage
        } = props;
        const text = pivotText != null ? pivotText : `${percentage}%`;
        if (props.showPivot && text) {
          const style = {
            color: textColor,
            left: `${+percentage}%`,
            transform: `translate(-${+percentage}%,-50%)`,
            background: pivotColor || background.value
          };
          return vue.createVNode("span", {
            "style": style,
            "class": bem$i("pivot", {
              inactive: props.inactive
            })
          }, [text]);
        }
      };
      return () => {
        const {
          trackColor,
          percentage,
          strokeWidth
        } = props;
        const rootStyle = {
          background: trackColor,
          height: addUnit(strokeWidth)
        };
        const portionStyle = {
          width: `${percentage}%`,
          background: background.value
        };
        return vue.createVNode("div", {
          "class": bem$i(),
          "style": rootStyle
        }, [vue.createVNode("span", {
          "class": bem$i("portion", {
            inactive: props.inactive
          }),
          "style": portionStyle
        }, null), renderPivot()]);
      };
    }
  });
  const Progress = withInstall(stdin_default$k);
  const [name$h, bem$h, t$4] = createNamespace("pull-refresh");
  const DEFAULT_HEAD_HEIGHT = 50;
  const TEXT_STATUS = ["pulling", "loosing", "success"];
  const pullRefreshProps = {
    disabled: Boolean,
    modelValue: Boolean,
    headHeight: makeNumericProp(DEFAULT_HEAD_HEIGHT),
    successText: String,
    pullingText: String,
    loosingText: String,
    loadingText: String,
    pullDistance: numericProp,
    successDuration: makeNumericProp(500),
    animationDuration: makeNumericProp(300)
  };
  var stdin_default$j = vue.defineComponent({
    name: name$h,
    props: pullRefreshProps,
    emits: ["change", "refresh", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      let reachTop;
      const root = vue.ref();
      const track = vue.ref();
      const scrollParent = useScrollParent(root);
      const state = vue.reactive({
        status: "normal",
        distance: 0,
        duration: 0
      });
      const touch = useTouch();
      const getHeadStyle = () => {
        if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
          return {
            height: `${props.headHeight}px`
          };
        }
      };
      const isTouchable = () => state.status !== "loading" && state.status !== "success" && !props.disabled;
      const ease = (distance) => {
        const pullDistance = +(props.pullDistance || props.headHeight);
        if (distance > pullDistance) {
          if (distance < pullDistance * 2) {
            distance = pullDistance + (distance - pullDistance) / 2;
          } else {
            distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
          }
        }
        return Math.round(distance);
      };
      const setStatus = (distance, isLoading) => {
        const pullDistance = +(props.pullDistance || props.headHeight);
        state.distance = distance;
        if (isLoading) {
          state.status = "loading";
        } else if (distance === 0) {
          state.status = "normal";
        } else if (distance < pullDistance) {
          state.status = "pulling";
        } else {
          state.status = "loosing";
        }
        emit("change", {
          status: state.status,
          distance
        });
      };
      const getStatusText = () => {
        const {
          status
        } = state;
        if (status === "normal") {
          return "";
        }
        return props[`${status}Text`] || t$4(status);
      };
      const renderStatus = () => {
        const {
          status,
          distance
        } = state;
        if (slots[status]) {
          return slots[status]({
            distance
          });
        }
        const nodes = [];
        if (TEXT_STATUS.includes(status)) {
          nodes.push(vue.createVNode("div", {
            "class": bem$h("text")
          }, [getStatusText()]));
        }
        if (status === "loading") {
          nodes.push(vue.createVNode(Loading, {
            "class": bem$h("loading")
          }, {
            default: getStatusText
          }));
        }
        return nodes;
      };
      const showSuccessTip = () => {
        state.status = "success";
        setTimeout(() => {
          setStatus(0);
        }, +props.successDuration);
      };
      const checkPosition = (event) => {
        reachTop = getScrollTop(scrollParent.value) === 0;
        if (reachTop) {
          state.duration = 0;
          touch.start(event);
        }
      };
      const onTouchStart = (event) => {
        if (isTouchable()) {
          checkPosition(event);
        }
      };
      const onTouchMove = (event) => {
        if (isTouchable()) {
          if (!reachTop) {
            checkPosition(event);
          }
          const {
            deltaY
          } = touch;
          touch.move(event);
          if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
            preventDefault(event);
            setStatus(ease(deltaY.value));
          }
        }
      };
      const onTouchEnd = () => {
        if (reachTop && touch.deltaY.value && isTouchable()) {
          state.duration = +props.animationDuration;
          if (state.status === "loosing") {
            setStatus(+props.headHeight, true);
            emit("update:modelValue", true);
            vue.nextTick(() => emit("refresh"));
          } else {
            setStatus(0);
          }
        }
      };
      vue.watch(() => props.modelValue, (value) => {
        state.duration = +props.animationDuration;
        if (value) {
          setStatus(+props.headHeight, true);
        } else if (slots.success || props.successText) {
          showSuccessTip();
        } else {
          setStatus(0, false);
        }
      });
      useEventListener("touchmove", onTouchMove, {
        target: track
      });
      return () => {
        var _a;
        const trackStyle = {
          transitionDuration: `${state.duration}ms`,
          transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : ""
        };
        return vue.createVNode("div", {
          "ref": root,
          "class": bem$h()
        }, [vue.createVNode("div", {
          "ref": track,
          "class": bem$h("track"),
          "style": trackStyle,
          "onTouchstartPassive": onTouchStart,
          "onTouchend": onTouchEnd,
          "onTouchcancel": onTouchEnd
        }, [vue.createVNode("div", {
          "class": bem$h("head"),
          "style": getHeadStyle()
        }, [renderStatus()]), (_a = slots.default) == null ? void 0 : _a.call(slots)])]);
      };
    }
  });
  const PullRefresh = withInstall(stdin_default$j);
  const [name$g, bem$g] = createNamespace("rate");
  function getRateStatus(value, index, allowHalf, readonly) {
    if (value >= index) {
      return {
        status: "full",
        value: 1
      };
    }
    if (value + 0.5 >= index && allowHalf && !readonly) {
      return {
        status: "half",
        value: 0.5
      };
    }
    if (value + 1 >= index && allowHalf && readonly) {
      const cardinal = 10 ** 10;
      return {
        status: "half",
        value: Math.round((value - index + 1) * cardinal) / cardinal
      };
    }
    return {
      status: "void",
      value: 0
    };
  }
  const rateProps = {
    size: numericProp,
    icon: makeStringProp("star"),
    color: String,
    count: makeNumericProp(5),
    gutter: numericProp,
    readonly: Boolean,
    disabled: Boolean,
    voidIcon: makeStringProp("star-o"),
    allowHalf: Boolean,
    voidColor: String,
    touchable: truthProp,
    iconPrefix: String,
    modelValue: makeNumberProp(0),
    disabledColor: String
  };
  var stdin_default$i = vue.defineComponent({
    name: name$g,
    props: rateProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit
    }) {
      const touch = useTouch();
      const [itemRefs, setItemRefs] = useRefs();
      const groupRef = vue.ref();
      const untouchable = () => props.readonly || props.disabled || !props.touchable;
      const list = vue.computed(() => Array(+props.count).fill("").map((_2, i2) => getRateStatus(props.modelValue, i2 + 1, props.allowHalf, props.readonly)));
      let ranges;
      let groupRefRect;
      let minRectTop = Number.MAX_SAFE_INTEGER;
      let maxRectTop = Number.MIN_SAFE_INTEGER;
      const updateRanges = () => {
        groupRefRect = useRect(groupRef);
        const rects = itemRefs.value.map(useRect);
        ranges = [];
        rects.forEach((rect, index) => {
          minRectTop = Math.min(rect.top, minRectTop);
          maxRectTop = Math.max(rect.top, maxRectTop);
          if (props.allowHalf) {
            ranges.push({
              score: index + 0.5,
              left: rect.left,
              top: rect.top,
              height: rect.height
            }, {
              score: index + 1,
              left: rect.left + rect.width / 2,
              top: rect.top,
              height: rect.height
            });
          } else {
            ranges.push({
              score: index + 1,
              left: rect.left,
              top: rect.top,
              height: rect.height
            });
          }
        });
      };
      const getScoreByPosition = (x2, y2) => {
        for (let i2 = ranges.length - 1; i2 > 0; i2--) {
          if (y2 >= groupRefRect.top && y2 <= groupRefRect.bottom) {
            if (x2 > ranges[i2].left && y2 >= ranges[i2].top && y2 <= ranges[i2].top + ranges[i2].height) {
              return ranges[i2].score;
            }
          } else {
            const curTop = y2 < groupRefRect.top ? minRectTop : maxRectTop;
            if (x2 > ranges[i2].left && ranges[i2].top === curTop) {
              return ranges[i2].score;
            }
          }
        }
        return props.allowHalf ? 0.5 : 1;
      };
      const select = (index) => {
        if (!props.disabled && !props.readonly && index !== props.modelValue) {
          emit("update:modelValue", index);
          emit("change", index);
        }
      };
      const onTouchStart = (event) => {
        if (untouchable()) {
          return;
        }
        touch.start(event);
        updateRanges();
      };
      const onTouchMove = (event) => {
        if (untouchable()) {
          return;
        }
        touch.move(event);
        if (touch.isHorizontal()) {
          const {
            clientX,
            clientY
          } = event.touches[0];
          preventDefault(event);
          select(getScoreByPosition(clientX, clientY));
        }
      };
      const renderStar = (item, index) => {
        const {
          icon,
          size,
          color,
          count,
          gutter,
          voidIcon,
          disabled,
          voidColor,
          allowHalf,
          iconPrefix,
          disabledColor
        } = props;
        const score = index + 1;
        const isFull = item.status === "full";
        const isVoid = item.status === "void";
        const renderHalf = allowHalf && item.value > 0 && item.value < 1;
        let style;
        if (gutter && score !== +count) {
          style = {
            paddingRight: addUnit(gutter)
          };
        }
        const onClickItem = (event) => {
          updateRanges();
          select(allowHalf ? getScoreByPosition(event.clientX, event.clientY) : score);
        };
        return vue.createVNode("div", {
          "key": index,
          "ref": setItemRefs(index),
          "role": "radio",
          "style": style,
          "class": bem$g("item"),
          "tabindex": disabled ? void 0 : 0,
          "aria-setsize": count,
          "aria-posinset": score,
          "aria-checked": !isVoid,
          "onClick": onClickItem
        }, [vue.createVNode(Icon, {
          "size": size,
          "name": isFull ? icon : voidIcon,
          "class": bem$g("icon", {
            disabled,
            full: isFull
          }),
          "color": disabled ? disabledColor : isFull ? color : voidColor,
          "classPrefix": iconPrefix
        }, null), renderHalf && vue.createVNode(Icon, {
          "size": size,
          "style": {
            width: item.value + "em"
          },
          "name": isVoid ? voidIcon : icon,
          "class": bem$g("icon", ["half", {
            disabled,
            full: !isVoid
          }]),
          "color": disabled ? disabledColor : isVoid ? voidColor : color,
          "classPrefix": iconPrefix
        }, null)]);
      };
      useCustomFieldValue(() => props.modelValue);
      useEventListener("touchmove", onTouchMove, {
        target: groupRef
      });
      return () => vue.createVNode("div", {
        "ref": groupRef,
        "role": "radiogroup",
        "class": bem$g({
          readonly: props.readonly,
          disabled: props.disabled
        }),
        "tabindex": props.disabled ? void 0 : 0,
        "aria-disabled": props.disabled,
        "aria-readonly": props.readonly,
        "onTouchstartPassive": onTouchStart
      }, [list.value.map(renderStar)]);
    }
  });
  const Rate = withInstall(stdin_default$i);
  const Row = withInstall(stdin_default$S);
  const [name$f, bem$f, t$3] = createNamespace("search");
  const searchProps = extend({}, fieldSharedProps, {
    label: String,
    shape: makeStringProp("square"),
    leftIcon: makeStringProp("search"),
    clearable: truthProp,
    actionText: String,
    background: String,
    showAction: Boolean
  });
  var stdin_default$h = vue.defineComponent({
    name: name$f,
    props: searchProps,
    emits: ["blur", "focus", "clear", "search", "cancel", "click-input", "click-left-icon", "click-right-icon", "update:modelValue"],
    setup(props, {
      emit,
      slots,
      attrs
    }) {
      const id = useId();
      const filedRef = vue.ref();
      const onCancel = () => {
        if (!slots.action) {
          emit("update:modelValue", "");
          emit("cancel");
        }
      };
      const onKeypress = (event) => {
        const ENTER_CODE = 13;
        if (event.keyCode === ENTER_CODE) {
          preventDefault(event);
          emit("search", props.modelValue);
        }
      };
      const getInputId = () => props.id || `${id}-input`;
      const renderLabel = () => {
        if (slots.label || props.label) {
          return vue.createVNode("label", {
            "class": bem$f("label"),
            "for": getInputId()
          }, [slots.label ? slots.label() : props.label]);
        }
      };
      const renderAction = () => {
        if (props.showAction) {
          const text = props.actionText || t$3("cancel");
          return vue.createVNode("div", {
            "class": bem$f("action"),
            "role": "button",
            "tabindex": 0,
            "onClick": onCancel
          }, [slots.action ? slots.action() : text]);
        }
      };
      const blur = () => {
        var _a;
        return (_a = filedRef.value) == null ? void 0 : _a.blur();
      };
      const focus = () => {
        var _a;
        return (_a = filedRef.value) == null ? void 0 : _a.focus();
      };
      const onBlur = (event) => emit("blur", event);
      const onFocus = (event) => emit("focus", event);
      const onClear = (event) => emit("clear", event);
      const onClickInput = (event) => emit("click-input", event);
      const onClickLeftIcon = (event) => emit("click-left-icon", event);
      const onClickRightIcon = (event) => emit("click-right-icon", event);
      const fieldPropNames = Object.keys(fieldSharedProps);
      const renderField = () => {
        const fieldAttrs = extend({}, attrs, pick(props, fieldPropNames), {
          id: getInputId()
        });
        const onInput = (value) => emit("update:modelValue", value);
        return vue.createVNode(Field, vue.mergeProps({
          "ref": filedRef,
          "type": "search",
          "class": bem$f("field"),
          "border": false,
          "onBlur": onBlur,
          "onFocus": onFocus,
          "onClear": onClear,
          "onKeypress": onKeypress,
          "onClick-input": onClickInput,
          "onClick-left-icon": onClickLeftIcon,
          "onClick-right-icon": onClickRightIcon,
          "onUpdate:modelValue": onInput
        }, fieldAttrs), pick(slots, ["left-icon", "right-icon"]));
      };
      useExpose({
        focus,
        blur
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$f({
            "show-action": props.showAction
          }),
          "style": {
            background: props.background
          }
        }, [(_a = slots.left) == null ? void 0 : _a.call(slots), vue.createVNode("div", {
          "class": bem$f("content", props.shape)
        }, [renderLabel(), renderField()]), renderAction()]);
      };
    }
  });
  const Search = withInstall(stdin_default$h);
  const popupInheritKeys = [...popupSharedPropKeys, "round", "closeOnPopstate", "safeAreaInsetBottom"];
  const iconMap = {
    qq: "qq",
    link: "link-o",
    weibo: "weibo",
    qrcode: "qr",
    poster: "photo-o",
    wechat: "wechat",
    "weapp-qrcode": "miniprogram-o",
    "wechat-moments": "wechat-moments"
  };
  const [name$e, bem$e, t$2] = createNamespace("share-sheet");
  const shareSheetProps = extend({}, popupSharedProps, {
    title: String,
    round: truthProp,
    options: makeArrayProp(),
    cancelText: String,
    description: String,
    closeOnPopstate: truthProp,
    safeAreaInsetBottom: truthProp
  });
  var stdin_default$g = vue.defineComponent({
    name: name$e,
    props: shareSheetProps,
    emits: ["cancel", "select", "update:show"],
    setup(props, {
      emit,
      slots
    }) {
      const updateShow = (value) => emit("update:show", value);
      const onCancel = () => {
        updateShow(false);
        emit("cancel");
      };
      const onSelect = (option, index) => emit("select", option, index);
      const renderHeader = () => {
        const title = slots.title ? slots.title() : props.title;
        const description = slots.description ? slots.description() : props.description;
        if (title || description) {
          return vue.createVNode("div", {
            "class": bem$e("header")
          }, [title && vue.createVNode("h2", {
            "class": bem$e("title")
          }, [title]), description && vue.createVNode("span", {
            "class": bem$e("description")
          }, [description])]);
        }
      };
      const renderIcon = (icon) => {
        if (iconMap[icon]) {
          return vue.createVNode("div", {
            "class": bem$e("icon", [icon])
          }, [vue.createVNode(Icon, {
            "name": iconMap[icon] || icon
          }, null)]);
        }
        return vue.createVNode("img", {
          "src": icon,
          "class": bem$e("image-icon")
        }, null);
      };
      const renderOption = (option, index) => {
        const {
          name: name2,
          icon,
          className,
          description
        } = option;
        return vue.createVNode("div", {
          "role": "button",
          "tabindex": 0,
          "class": [bem$e("option"), className, HAPTICS_FEEDBACK],
          "onClick": () => onSelect(option, index)
        }, [renderIcon(icon), name2 && vue.createVNode("span", {
          "class": bem$e("name")
        }, [name2]), description && vue.createVNode("span", {
          "class": bem$e("option-description")
        }, [description])]);
      };
      const renderOptions = (options, border) => vue.createVNode("div", {
        "class": bem$e("options", {
          border
        })
      }, [options.map(renderOption)]);
      const renderRows = () => {
        const {
          options
        } = props;
        if (Array.isArray(options[0])) {
          return options.map((item, index) => renderOptions(item, index !== 0));
        }
        return renderOptions(options);
      };
      const renderCancelButton = () => {
        var _a;
        const cancelText = (_a = props.cancelText) != null ? _a : t$2("cancel");
        if (slots.cancel || cancelText) {
          return vue.createVNode("button", {
            "type": "button",
            "class": bem$e("cancel"),
            "onClick": onCancel
          }, [slots.cancel ? slots.cancel() : cancelText]);
        }
      };
      return () => vue.createVNode(Popup, vue.mergeProps({
        "class": bem$e(),
        "position": "bottom",
        "onUpdate:show": updateShow
      }, pick(props, popupInheritKeys)), {
        default: () => [renderHeader(), renderRows(), renderCancelButton()]
      });
    }
  });
  const ShareSheet = withInstall(stdin_default$g);
  const [name$d, bem$d] = createNamespace("sidebar");
  const SIDEBAR_KEY = Symbol(name$d);
  const sidebarProps = {
    modelValue: makeNumericProp(0)
  };
  var stdin_default$f = vue.defineComponent({
    name: name$d,
    props: sidebarProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        linkChildren
      } = useChildren(SIDEBAR_KEY);
      const getActive = () => +props.modelValue;
      const setActive = (value) => {
        if (value !== getActive()) {
          emit("update:modelValue", value);
          emit("change", value);
        }
      };
      linkChildren({
        getActive,
        setActive
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "role": "tablist",
          "class": bem$d()
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Sidebar = withInstall(stdin_default$f);
  const [name$c, bem$c] = createNamespace("sidebar-item");
  const sidebarItemProps = extend({}, routeProps, {
    dot: Boolean,
    title: String,
    badge: numericProp,
    disabled: Boolean,
    badgeProps: Object
  });
  var stdin_default$e = vue.defineComponent({
    name: name$c,
    props: sidebarItemProps,
    emits: ["click"],
    setup(props, {
      emit,
      slots
    }) {
      const route2 = useRoute();
      const {
        parent,
        index
      } = useParent(SIDEBAR_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/sidebar-item/SidebarItem.mjs:31", "[Vant] <SidebarItem> must be a child component of <Sidebar>.");
        }
        return;
      }
      const onClick = () => {
        if (props.disabled) {
          return;
        }
        emit("click", index.value);
        parent.setActive(index.value);
        route2();
      };
      return () => {
        const {
          dot,
          badge,
          title,
          disabled
        } = props;
        const selected = index.value === parent.getActive();
        return vue.createVNode("div", {
          "role": "tab",
          "class": bem$c({
            select: selected,
            disabled
          }),
          "tabindex": disabled ? void 0 : 0,
          "aria-selected": selected,
          "onClick": onClick
        }, [vue.createVNode(Badge, vue.mergeProps({
          "dot": dot,
          "class": bem$c("text"),
          "content": badge
        }, props.badgeProps), {
          default: () => [slots.title ? slots.title() : title]
        })]);
      };
    }
  });
  const SidebarItem = withInstall(stdin_default$e);
  const [name$b, bem$b] = createNamespace("skeleton");
  const DEFAULT_ROW_WIDTH = "100%";
  const DEFAULT_LAST_ROW_WIDTH = "60%";
  const skeletonProps = {
    row: makeNumericProp(0),
    title: Boolean,
    round: Boolean,
    avatar: Boolean,
    loading: truthProp,
    animate: truthProp,
    avatarSize: numericProp,
    titleWidth: numericProp,
    avatarShape: makeStringProp("round"),
    rowWidth: {
      type: [Number, String, Array],
      default: DEFAULT_ROW_WIDTH
    }
  };
  var stdin_default$d = vue.defineComponent({
    name: name$b,
    inheritAttrs: false,
    props: skeletonProps,
    setup(props, {
      slots,
      attrs
    }) {
      const renderAvatar = () => {
        if (props.avatar) {
          return vue.createVNode("div", {
            "class": bem$b("avatar", props.avatarShape),
            "style": getSizeStyle(props.avatarSize)
          }, null);
        }
      };
      const renderTitle = () => {
        if (props.title) {
          return vue.createVNode("h3", {
            "class": bem$b("title"),
            "style": {
              width: addUnit(props.titleWidth)
            }
          }, null);
        }
      };
      const getRowWidth = (index) => {
        const {
          rowWidth
        } = props;
        if (rowWidth === DEFAULT_ROW_WIDTH && index === +props.row - 1) {
          return DEFAULT_LAST_ROW_WIDTH;
        }
        if (Array.isArray(rowWidth)) {
          return rowWidth[index];
        }
        return rowWidth;
      };
      const renderRows = () => Array(+props.row).fill("").map((_2, i2) => vue.createVNode("div", {
        "class": bem$b("row"),
        "style": {
          width: addUnit(getRowWidth(i2))
        }
      }, null));
      return () => {
        var _a;
        if (!props.loading) {
          return (_a = slots.default) == null ? void 0 : _a.call(slots);
        }
        return vue.createVNode("div", vue.mergeProps({
          "class": bem$b({
            animate: props.animate,
            round: props.round
          })
        }, attrs), [renderAvatar(), vue.createVNode("div", {
          "class": bem$b("content")
        }, [renderTitle(), renderRows()])]);
      };
    }
  });
  const Skeleton = withInstall(stdin_default$d);
  const [name$a, bem$a] = createNamespace("slider");
  const sliderProps = {
    min: makeNumericProp(0),
    max: makeNumericProp(100),
    step: makeNumericProp(1),
    range: Boolean,
    reverse: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    vertical: Boolean,
    barHeight: numericProp,
    buttonSize: numericProp,
    activeColor: String,
    inactiveColor: String,
    modelValue: {
      type: [Number, Array],
      default: 0
    }
  };
  var stdin_default$c = vue.defineComponent({
    name: name$a,
    props: sliderProps,
    emits: ["change", "drag-end", "drag-start", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      let buttonIndex;
      let current2;
      let startValue;
      const root = vue.ref();
      const slider = vue.ref();
      const dragStatus = vue.ref();
      const touch = useTouch();
      const scope = vue.computed(() => Number(props.max) - Number(props.min));
      const wrapperStyle = vue.computed(() => {
        const crossAxis = props.vertical ? "width" : "height";
        return {
          background: props.inactiveColor,
          [crossAxis]: addUnit(props.barHeight)
        };
      });
      const isRange = (val) => props.range && Array.isArray(val);
      const calcMainAxis = () => {
        const {
          modelValue,
          min
        } = props;
        if (isRange(modelValue)) {
          return `${(modelValue[1] - modelValue[0]) * 100 / scope.value}%`;
        }
        return `${(modelValue - Number(min)) * 100 / scope.value}%`;
      };
      const calcOffset = () => {
        const {
          modelValue,
          min
        } = props;
        if (isRange(modelValue)) {
          return `${(modelValue[0] - Number(min)) * 100 / scope.value}%`;
        }
        return "0%";
      };
      const barStyle = vue.computed(() => {
        const mainAxis = props.vertical ? "height" : "width";
        const style = {
          [mainAxis]: calcMainAxis(),
          background: props.activeColor
        };
        if (dragStatus.value) {
          style.transition = "none";
        }
        const getPositionKey = () => {
          if (props.vertical) {
            return props.reverse ? "bottom" : "top";
          }
          return props.reverse ? "right" : "left";
        };
        style[getPositionKey()] = calcOffset();
        return style;
      });
      const format2 = (value) => {
        const min = +props.min;
        const max = +props.max;
        const step = +props.step;
        value = clamp(value, min, max);
        const diff = Math.round((value - min) / step) * step;
        return addNumber(min, diff);
      };
      const isSameValue = (newValue, oldValue) => JSON.stringify(newValue) === JSON.stringify(oldValue);
      const handleRangeValue = (value) => {
        var _a, _b;
        const left2 = (_a = value[0]) != null ? _a : Number(props.min);
        const right2 = (_b = value[1]) != null ? _b : Number(props.max);
        return left2 > right2 ? [right2, left2] : [left2, right2];
      };
      const updateValue = (value, end2) => {
        if (isRange(value)) {
          value = handleRangeValue(value).map(format2);
        } else {
          value = format2(value);
        }
        if (!isSameValue(value, props.modelValue)) {
          emit("update:modelValue", value);
        }
        if (end2 && !isSameValue(value, startValue)) {
          emit("change", value);
        }
      };
      const onClick = (event) => {
        event.stopPropagation();
        if (props.disabled || props.readonly) {
          return;
        }
        const {
          min,
          reverse,
          vertical,
          modelValue
        } = props;
        const rect = useRect(root);
        const getDelta = () => {
          if (vertical) {
            if (reverse) {
              return rect.bottom - event.clientY;
            }
            return event.clientY - rect.top;
          }
          if (reverse) {
            return rect.right - event.clientX;
          }
          return event.clientX - rect.left;
        };
        const total = vertical ? rect.height : rect.width;
        const value = Number(min) + getDelta() / total * scope.value;
        if (isRange(modelValue)) {
          const [left2, right2] = modelValue;
          const middle = (left2 + right2) / 2;
          if (value <= middle) {
            updateValue([value, right2], true);
          } else {
            updateValue([left2, value], true);
          }
        } else {
          updateValue(value, true);
        }
      };
      const onTouchStart = (event) => {
        if (props.disabled || props.readonly) {
          return;
        }
        touch.start(event);
        current2 = props.modelValue;
        if (isRange(current2)) {
          startValue = current2.map(format2);
        } else {
          startValue = format2(current2);
        }
        dragStatus.value = "start";
      };
      const onTouchMove = (event) => {
        if (props.disabled || props.readonly) {
          return;
        }
        if (dragStatus.value === "start") {
          emit("drag-start", event);
        }
        preventDefault(event, true);
        touch.move(event);
        dragStatus.value = "dragging";
        const rect = useRect(root);
        const delta = props.vertical ? touch.deltaY.value : touch.deltaX.value;
        const total = props.vertical ? rect.height : rect.width;
        let diff = delta / total * scope.value;
        if (props.reverse) {
          diff = -diff;
        }
        if (isRange(startValue)) {
          const index = props.reverse ? 1 - buttonIndex : buttonIndex;
          current2[index] = startValue[index] + diff;
        } else {
          current2 = startValue + diff;
        }
        updateValue(current2);
      };
      const onTouchEnd = (event) => {
        if (props.disabled || props.readonly) {
          return;
        }
        if (dragStatus.value === "dragging") {
          updateValue(current2, true);
          emit("drag-end", event);
        }
        dragStatus.value = "";
      };
      const getButtonClassName = (index) => {
        if (typeof index === "number") {
          const position = ["left", "right"];
          return bem$a(`button-wrapper`, position[index]);
        }
        return bem$a("button-wrapper", props.reverse ? "left" : "right");
      };
      const renderButtonContent = (value, index) => {
        if (typeof index === "number") {
          const slot = slots[index === 0 ? "left-button" : "right-button"];
          if (slot) {
            return slot({
              value
            });
          }
        }
        if (slots.button) {
          return slots.button({
            value
          });
        }
        return vue.createVNode("div", {
          "class": bem$a("button"),
          "style": getSizeStyle(props.buttonSize)
        }, null);
      };
      const renderButton = (index) => {
        const current22 = typeof index === "number" ? props.modelValue[index] : props.modelValue;
        return vue.createVNode("div", {
          "ref": slider,
          "role": "slider",
          "class": getButtonClassName(index),
          "tabindex": props.disabled ? void 0 : 0,
          "aria-valuemin": props.min,
          "aria-valuenow": current22,
          "aria-valuemax": props.max,
          "aria-disabled": props.disabled || void 0,
          "aria-readonly": props.readonly || void 0,
          "aria-orientation": props.vertical ? "vertical" : "horizontal",
          "onTouchstartPassive": (event) => {
            if (typeof index === "number") {
              buttonIndex = index;
            }
            onTouchStart(event);
          },
          "onTouchend": onTouchEnd,
          "onTouchcancel": onTouchEnd,
          "onClick": stopPropagation
        }, [renderButtonContent(current22, index)]);
      };
      updateValue(props.modelValue);
      useCustomFieldValue(() => props.modelValue);
      useEventListener("touchmove", onTouchMove, {
        target: slider
      });
      return () => vue.createVNode("div", {
        "ref": root,
        "style": wrapperStyle.value,
        "class": bem$a({
          vertical: props.vertical,
          disabled: props.disabled
        }),
        "onClick": onClick
      }, [vue.createVNode("div", {
        "class": bem$a("bar"),
        "style": barStyle.value
      }, [props.range ? [renderButton(0), renderButton(1)] : renderButton()])]);
    }
  });
  const Slider = withInstall(stdin_default$c);
  const [name$9, bem$9] = createNamespace("space");
  const spaceProps = {
    align: String,
    direction: {
      type: String,
      default: "horizontal"
    },
    size: {
      type: [Number, String, Array],
      default: 8
    },
    wrap: Boolean,
    fill: Boolean
  };
  function filterEmpty(children = []) {
    const nodes = [];
    children.forEach((child) => {
      if (Array.isArray(child)) {
        nodes.push(...child);
      } else if (child.type === vue.Fragment) {
        nodes.push(...filterEmpty(child.children));
      } else {
        nodes.push(child);
      }
    });
    return nodes.filter((c2) => {
      var _a;
      return !(c2 && (typeof Comment !== "undefined" && c2.type === Comment || c2.type === vue.Fragment && ((_a = c2.children) == null ? void 0 : _a.length) === 0 || c2.type === Text && c2.children.trim() === ""));
    });
  }
  var stdin_default$b = vue.defineComponent({
    name: name$9,
    props: spaceProps,
    setup(props, {
      slots
    }) {
      const mergedAlign = vue.computed(() => {
        var _a;
        return (_a = props.align) != null ? _a : props.direction === "horizontal" ? "center" : "";
      });
      const getMargin = (size) => {
        if (typeof size === "number") {
          return size + "px";
        }
        return size;
      };
      const getMarginStyle = (isLast) => {
        const style = {};
        const marginRight = `${getMargin(Array.isArray(props.size) ? props.size[0] : props.size)}`;
        const marginBottom = `${getMargin(Array.isArray(props.size) ? props.size[1] : props.size)}`;
        if (isLast) {
          return props.wrap ? {
            marginBottom
          } : {};
        }
        if (props.direction === "horizontal") {
          style.marginRight = marginRight;
        }
        if (props.direction === "vertical" || props.wrap) {
          style.marginBottom = marginBottom;
        }
        return style;
      };
      return () => {
        var _a;
        const children = filterEmpty((_a = slots.default) == null ? void 0 : _a.call(slots));
        return vue.createVNode("div", {
          "class": [bem$9({
            [props.direction]: props.direction,
            [`align-${mergedAlign.value}`]: mergedAlign.value,
            wrap: props.wrap,
            fill: props.fill
          })]
        }, [children.map((c2, i2) => vue.createVNode("div", {
          "key": `item-${i2}`,
          "class": `${name$9}-item`,
          "style": getMarginStyle(i2 === children.length - 1)
        }, [c2]))]);
      };
    }
  });
  const Space = withInstall(stdin_default$b);
  const [name$8, bem$8] = createNamespace("steps");
  const stepsProps = {
    active: makeNumericProp(0),
    direction: makeStringProp("horizontal"),
    activeIcon: makeStringProp("checked"),
    iconPrefix: String,
    finishIcon: String,
    activeColor: String,
    inactiveIcon: String,
    inactiveColor: String
  };
  const STEPS_KEY = Symbol(name$8);
  var stdin_default$a = vue.defineComponent({
    name: name$8,
    props: stepsProps,
    emits: ["click-step"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        linkChildren
      } = useChildren(STEPS_KEY);
      const onClickStep = (index) => emit("click-step", index);
      linkChildren({
        props,
        onClickStep
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$8([props.direction])
        }, [vue.createVNode("div", {
          "class": bem$8("items")
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
      };
    }
  });
  const [name$7, bem$7] = createNamespace("step");
  var stdin_default$9 = vue.defineComponent({
    name: name$7,
    setup(props, {
      slots
    }) {
      const {
        parent,
        index
      } = useParent(STEPS_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/step/Step.mjs:19", "[Vant] <Step> must be a child component of <Steps>.");
        }
        return;
      }
      const parentProps = parent.props;
      const getStatus = () => {
        const active = +parentProps.active;
        if (index.value < active) {
          return "finish";
        }
        return index.value === active ? "process" : "waiting";
      };
      const isActive = () => getStatus() === "process";
      const lineStyle = vue.computed(() => ({
        background: getStatus() === "finish" ? parentProps.activeColor : parentProps.inactiveColor
      }));
      const titleStyle = vue.computed(() => {
        if (isActive()) {
          return {
            color: parentProps.activeColor
          };
        }
        if (getStatus() === "waiting") {
          return {
            color: parentProps.inactiveColor
          };
        }
      });
      const onClickStep = () => parent.onClickStep(index.value);
      const renderCircle = () => {
        const {
          iconPrefix,
          finishIcon,
          activeIcon,
          activeColor,
          inactiveIcon
        } = parentProps;
        if (isActive()) {
          if (slots["active-icon"]) {
            return slots["active-icon"]();
          }
          return vue.createVNode(Icon, {
            "class": bem$7("icon", "active"),
            "name": activeIcon,
            "color": activeColor,
            "classPrefix": iconPrefix
          }, null);
        }
        if (getStatus() === "finish" && (finishIcon || slots["finish-icon"])) {
          if (slots["finish-icon"]) {
            return slots["finish-icon"]();
          }
          return vue.createVNode(Icon, {
            "class": bem$7("icon", "finish"),
            "name": finishIcon,
            "color": activeColor,
            "classPrefix": iconPrefix
          }, null);
        }
        if (slots["inactive-icon"]) {
          return slots["inactive-icon"]();
        }
        if (inactiveIcon) {
          return vue.createVNode(Icon, {
            "class": bem$7("icon"),
            "name": inactiveIcon,
            "classPrefix": iconPrefix
          }, null);
        }
        return vue.createVNode("i", {
          "class": bem$7("circle"),
          "style": lineStyle.value
        }, null);
      };
      return () => {
        var _a;
        const status = getStatus();
        return vue.createVNode("div", {
          "class": [BORDER, bem$7([parentProps.direction, {
            [status]: status
          }])]
        }, [vue.createVNode("div", {
          "class": bem$7("title", {
            active: isActive()
          }),
          "style": titleStyle.value,
          "onClick": onClickStep
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), vue.createVNode("div", {
          "class": bem$7("circle-container"),
          "onClick": onClickStep
        }, [renderCircle()]), vue.createVNode("div", {
          "class": bem$7("line"),
          "style": lineStyle.value
        }, null)]);
      };
    }
  });
  const Step = withInstall(stdin_default$9);
  const [name$6, bem$6] = createNamespace("stepper");
  const LONG_PRESS_INTERVAL = 200;
  const LONG_PRESS_START_TIME = 600;
  const isEqual = (value1, value2) => String(value1) === String(value2);
  const stepperProps = {
    min: makeNumericProp(1),
    max: makeNumericProp(Infinity),
    name: makeNumericProp(""),
    step: makeNumericProp(1),
    theme: String,
    integer: Boolean,
    disabled: Boolean,
    showPlus: truthProp,
    showMinus: truthProp,
    showInput: truthProp,
    longPress: truthProp,
    allowEmpty: Boolean,
    modelValue: numericProp,
    inputWidth: numericProp,
    buttonSize: numericProp,
    placeholder: String,
    disablePlus: Boolean,
    disableMinus: Boolean,
    disableInput: Boolean,
    beforeChange: Function,
    defaultValue: makeNumericProp(1),
    decimalLength: numericProp
  };
  var stdin_default$8 = vue.defineComponent({
    name: name$6,
    props: stepperProps,
    emits: ["plus", "blur", "minus", "focus", "change", "overlimit", "update:modelValue"],
    setup(props, {
      emit
    }) {
      const format2 = (value) => {
        const {
          min,
          max,
          allowEmpty,
          decimalLength
        } = props;
        if (allowEmpty && value === "") {
          return value;
        }
        value = formatNumber(String(value), !props.integer);
        value = value === "" ? 0 : +value;
        value = Number.isNaN(value) ? +min : value;
        value = Math.max(Math.min(+max, value), +min);
        if (isDef(decimalLength)) {
          value = value.toFixed(+decimalLength);
        }
        return value;
      };
      const getInitialValue = () => {
        var _a;
        const defaultValue = (_a = props.modelValue) != null ? _a : props.defaultValue;
        const value = format2(defaultValue);
        if (!isEqual(value, props.modelValue)) {
          emit("update:modelValue", value);
        }
        return value;
      };
      let actionType;
      const inputRef = vue.ref();
      const current2 = vue.ref(getInitialValue());
      const minusDisabled = vue.computed(() => props.disabled || props.disableMinus || current2.value <= +props.min);
      const plusDisabled = vue.computed(() => props.disabled || props.disablePlus || current2.value >= +props.max);
      const inputStyle = vue.computed(() => ({
        width: addUnit(props.inputWidth),
        height: addUnit(props.buttonSize)
      }));
      const buttonStyle = vue.computed(() => getSizeStyle(props.buttonSize));
      const check = () => {
        const value = format2(current2.value);
        if (!isEqual(value, current2.value)) {
          current2.value = value;
        }
      };
      const setValue = (value) => {
        if (props.beforeChange) {
          callInterceptor(props.beforeChange, {
            args: [value],
            done() {
              current2.value = value;
            }
          });
        } else {
          current2.value = value;
        }
      };
      const onChange = () => {
        if (actionType === "plus" && plusDisabled.value || actionType === "minus" && minusDisabled.value) {
          emit("overlimit", actionType);
          return;
        }
        const diff = actionType === "minus" ? -props.step : +props.step;
        const value = format2(addNumber(+current2.value, diff));
        setValue(value);
        emit(actionType);
      };
      const onInput = (event) => {
        const input = event.target;
        const {
          value
        } = input;
        const {
          decimalLength
        } = props;
        let formatted = formatNumber(String(value), !props.integer);
        if (isDef(decimalLength) && formatted.includes(".")) {
          const pair = formatted.split(".");
          formatted = `${pair[0]}.${pair[1].slice(0, +decimalLength)}`;
        }
        if (props.beforeChange) {
          input.value = String(current2.value);
        } else if (!isEqual(value, formatted)) {
          input.value = formatted;
        }
        const isNumeric2 = formatted === String(+formatted);
        setValue(isNumeric2 ? +formatted : formatted);
      };
      const onFocus = (event) => {
        var _a;
        if (props.disableInput) {
          (_a = inputRef.value) == null ? void 0 : _a.blur();
        } else {
          emit("focus", event);
        }
      };
      const onBlur = (event) => {
        const input = event.target;
        const value = format2(input.value);
        input.value = String(value);
        current2.value = value;
        vue.nextTick(() => {
          emit("blur", event);
          resetScroll();
        });
      };
      let isLongPress;
      let longPressTimer;
      const longPressStep = () => {
        longPressTimer = setTimeout(() => {
          onChange();
          longPressStep();
        }, LONG_PRESS_INTERVAL);
      };
      const onTouchStart = () => {
        if (props.longPress) {
          isLongPress = false;
          clearTimeout(longPressTimer);
          longPressTimer = setTimeout(() => {
            isLongPress = true;
            onChange();
            longPressStep();
          }, LONG_PRESS_START_TIME);
        }
      };
      const onTouchEnd = (event) => {
        if (props.longPress) {
          clearTimeout(longPressTimer);
          if (isLongPress) {
            preventDefault(event);
          }
        }
      };
      const onMousedown = (event) => {
        if (props.disableInput) {
          preventDefault(event);
        }
      };
      const createListeners = (type) => ({
        onClick: (event) => {
          preventDefault(event);
          actionType = type;
          onChange();
        },
        onTouchstartPassive: () => {
          actionType = type;
          onTouchStart();
        },
        onTouchend: onTouchEnd,
        onTouchcancel: onTouchEnd
      });
      vue.watch(() => [props.max, props.min, props.integer, props.decimalLength], check);
      vue.watch(() => props.modelValue, (value) => {
        if (!isEqual(value, current2.value)) {
          current2.value = format2(value);
        }
      });
      vue.watch(current2, (value) => {
        emit("update:modelValue", value);
        emit("change", value, {
          name: props.name
        });
      });
      useCustomFieldValue(() => props.modelValue);
      return () => vue.createVNode("div", {
        "role": "group",
        "class": bem$6([props.theme])
      }, [vue.withDirectives(vue.createVNode("button", vue.mergeProps({
        "type": "button",
        "style": buttonStyle.value,
        "class": [bem$6("minus", {
          disabled: minusDisabled.value
        }), {
          [HAPTICS_FEEDBACK]: !minusDisabled.value
        }],
        "aria-disabled": minusDisabled.value || void 0
      }, createListeners("minus")), null), [[vue.vShow, props.showMinus]]), vue.withDirectives(vue.createVNode("input", {
        "ref": inputRef,
        "type": props.integer ? "tel" : "text",
        "role": "spinbutton",
        "class": bem$6("input"),
        "value": current2.value,
        "style": inputStyle.value,
        "disabled": props.disabled,
        "readonly": props.disableInput,
        "inputmode": props.integer ? "numeric" : "decimal",
        "placeholder": props.placeholder,
        "aria-valuemax": props.max,
        "aria-valuemin": props.min,
        "aria-valuenow": current2.value,
        "onBlur": onBlur,
        "onInput": onInput,
        "onFocus": onFocus,
        "onMousedown": onMousedown
      }, null), [[vue.vShow, props.showInput]]), vue.withDirectives(vue.createVNode("button", vue.mergeProps({
        "type": "button",
        "style": buttonStyle.value,
        "class": [bem$6("plus", {
          disabled: plusDisabled.value
        }), {
          [HAPTICS_FEEDBACK]: !plusDisabled.value
        }],
        "aria-disabled": plusDisabled.value || void 0
      }, createListeners("plus")), null), [[vue.vShow, props.showPlus]])]);
    }
  });
  const Stepper = withInstall(stdin_default$8);
  const Steps = withInstall(stdin_default$a);
  const [name$5, bem$5, t$1] = createNamespace("submit-bar");
  const submitBarProps = {
    tip: String,
    label: String,
    price: Number,
    tipIcon: String,
    loading: Boolean,
    currency: makeStringProp("\xA5"),
    disabled: Boolean,
    textAlign: String,
    buttonText: String,
    buttonType: makeStringProp("danger"),
    buttonColor: String,
    suffixLabel: String,
    placeholder: Boolean,
    decimalLength: makeNumericProp(2),
    safeAreaInsetBottom: truthProp
  };
  var stdin_default$7 = vue.defineComponent({
    name: name$5,
    props: submitBarProps,
    emits: ["submit"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const renderPlaceholder = usePlaceholder(root, bem$5);
      const renderText = () => {
        const {
          price,
          label,
          currency,
          textAlign,
          suffixLabel,
          decimalLength
        } = props;
        if (typeof price === "number") {
          const pricePair = (price / 100).toFixed(+decimalLength).split(".");
          const decimal = decimalLength ? `.${pricePair[1]}` : "";
          return vue.createVNode("div", {
            "class": bem$5("text"),
            "style": {
              textAlign
            }
          }, [vue.createVNode("span", null, [label || t$1("label")]), vue.createVNode("span", {
            "class": bem$5("price")
          }, [currency, vue.createVNode("span", {
            "class": bem$5("price-integer")
          }, [pricePair[0]]), decimal]), suffixLabel && vue.createVNode("span", {
            "class": bem$5("suffix-label")
          }, [suffixLabel])]);
        }
      };
      const renderTip = () => {
        var _a;
        const {
          tip,
          tipIcon
        } = props;
        if (slots.tip || tip) {
          return vue.createVNode("div", {
            "class": bem$5("tip")
          }, [tipIcon && vue.createVNode(Icon, {
            "class": bem$5("tip-icon"),
            "name": tipIcon
          }, null), tip && vue.createVNode("span", {
            "class": bem$5("tip-text")
          }, [tip]), (_a = slots.tip) == null ? void 0 : _a.call(slots)]);
        }
      };
      const onClickButton = () => emit("submit");
      const renderButton = () => {
        if (slots.button) {
          return slots.button();
        }
        return vue.createVNode(Button, {
          "round": true,
          "type": props.buttonType,
          "text": props.buttonText,
          "class": bem$5("button", props.buttonType),
          "color": props.buttonColor,
          "loading": props.loading,
          "disabled": props.disabled,
          "onClick": onClickButton
        }, null);
      };
      const renderSubmitBar = () => {
        var _a, _b;
        return vue.createVNode("div", {
          "ref": root,
          "class": [bem$5(), {
            "van-safe-area-bottom": props.safeAreaInsetBottom
          }]
        }, [(_a = slots.top) == null ? void 0 : _a.call(slots), renderTip(), vue.createVNode("div", {
          "class": bem$5("bar")
        }, [(_b = slots.default) == null ? void 0 : _b.call(slots), renderText(), renderButton()])]);
      };
      return () => {
        if (props.placeholder) {
          return renderPlaceholder(renderSubmitBar);
        }
        return renderSubmitBar();
      };
    }
  });
  const SubmitBar = withInstall(stdin_default$7);
  const [name$4, bem$4] = createNamespace("swipe-cell");
  const swipeCellProps = {
    name: makeNumericProp(""),
    disabled: Boolean,
    leftWidth: numericProp,
    rightWidth: numericProp,
    beforeClose: Function,
    stopPropagation: Boolean
  };
  var stdin_default$6 = vue.defineComponent({
    name: name$4,
    props: swipeCellProps,
    emits: ["open", "close", "click"],
    setup(props, {
      emit,
      slots
    }) {
      let opened;
      let lockClick2;
      let startOffset;
      const root = vue.ref();
      const leftRef = vue.ref();
      const rightRef = vue.ref();
      const state = vue.reactive({
        offset: 0,
        dragging: false
      });
      const touch = useTouch();
      const getWidthByRef = (ref2) => ref2.value ? useRect(ref2).width : 0;
      const leftWidth = vue.computed(() => isDef(props.leftWidth) ? +props.leftWidth : getWidthByRef(leftRef));
      const rightWidth = vue.computed(() => isDef(props.rightWidth) ? +props.rightWidth : getWidthByRef(rightRef));
      const open = (side) => {
        state.offset = side === "left" ? leftWidth.value : -rightWidth.value;
        if (!opened) {
          opened = true;
          emit("open", {
            name: props.name,
            position: side
          });
        }
      };
      const close = (position) => {
        state.offset = 0;
        if (opened) {
          opened = false;
          emit("close", {
            name: props.name,
            position
          });
        }
      };
      const toggle = (side) => {
        const offset2 = Math.abs(state.offset);
        const THRESHOLD = 0.15;
        const threshold = opened ? 1 - THRESHOLD : THRESHOLD;
        const width2 = side === "left" ? leftWidth.value : rightWidth.value;
        if (width2 && offset2 > width2 * threshold) {
          open(side);
        } else {
          close(side);
        }
      };
      const onTouchStart = (event) => {
        if (!props.disabled) {
          startOffset = state.offset;
          touch.start(event);
        }
      };
      const onTouchMove = (event) => {
        if (props.disabled) {
          return;
        }
        const {
          deltaX
        } = touch;
        touch.move(event);
        if (touch.isHorizontal()) {
          lockClick2 = true;
          state.dragging = true;
          const isEdge = !opened || deltaX.value * startOffset < 0;
          if (isEdge) {
            preventDefault(event, props.stopPropagation);
          }
          state.offset = clamp(deltaX.value + startOffset, -rightWidth.value, leftWidth.value);
        }
      };
      const onTouchEnd = () => {
        if (state.dragging) {
          state.dragging = false;
          toggle(state.offset > 0 ? "left" : "right");
          setTimeout(() => {
            lockClick2 = false;
          }, 0);
        }
      };
      const onClick = (position = "outside") => {
        emit("click", position);
        if (opened && !lockClick2) {
          callInterceptor(props.beforeClose, {
            args: [{
              name: props.name,
              position
            }],
            done: () => close(position)
          });
        }
      };
      const getClickHandler = (position, stop) => (event) => {
        if (stop) {
          event.stopPropagation();
        }
        onClick(position);
      };
      const renderSideContent = (side, ref2) => {
        const contentSlot = slots[side];
        if (contentSlot) {
          return vue.createVNode("div", {
            "ref": ref2,
            "class": bem$4(side),
            "onClick": getClickHandler(side, true)
          }, [contentSlot()]);
        }
      };
      useExpose({
        open,
        close
      });
      useClickAway(root, () => onClick("outside"), {
        eventName: "touchstart"
      });
      useEventListener("touchmove", onTouchMove, {
        target: root
      });
      return () => {
        var _a;
        const wrapperStyle = {
          transform: `translate3d(${state.offset}px, 0, 0)`,
          transitionDuration: state.dragging ? "0s" : ".6s"
        };
        return vue.createVNode("div", {
          "ref": root,
          "class": bem$4(),
          "onClick": getClickHandler("cell", lockClick2),
          "onTouchstartPassive": onTouchStart,
          "onTouchend": onTouchEnd,
          "onTouchcancel": onTouchEnd
        }, [vue.createVNode("div", {
          "class": bem$4("wrapper"),
          "style": wrapperStyle
        }, [renderSideContent("left", leftRef), (_a = slots.default) == null ? void 0 : _a.call(slots), renderSideContent("right", rightRef)])]);
      };
    }
  });
  const SwipeCell = withInstall(stdin_default$6);
  const [name$3, bem$3] = createNamespace("tabbar");
  const tabbarProps = {
    route: Boolean,
    fixed: truthProp,
    border: truthProp,
    zIndex: numericProp,
    placeholder: Boolean,
    activeColor: String,
    beforeChange: Function,
    inactiveColor: String,
    modelValue: makeNumericProp(0),
    safeAreaInsetBottom: {
      type: Boolean,
      default: null
    }
  };
  const TABBAR_KEY = Symbol(name$3);
  var stdin_default$5 = vue.defineComponent({
    name: name$3,
    props: tabbarProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const {
        linkChildren
      } = useChildren(TABBAR_KEY);
      const renderPlaceholder = usePlaceholder(root, bem$3);
      const enableSafeArea = () => {
        var _a;
        return (_a = props.safeAreaInsetBottom) != null ? _a : props.fixed;
      };
      const renderTabbar = () => {
        var _a;
        const {
          fixed,
          zIndex,
          border
        } = props;
        return vue.createVNode("div", {
          "ref": root,
          "role": "tablist",
          "style": getZIndexStyle(zIndex),
          "class": [bem$3({
            fixed
          }), {
            [BORDER_TOP_BOTTOM]: border,
            "van-safe-area-bottom": enableSafeArea()
          }]
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
      const setActive = (active, afterChange) => {
        callInterceptor(props.beforeChange, {
          args: [active],
          done() {
            emit("update:modelValue", active);
            emit("change", active);
            afterChange();
          }
        });
      };
      linkChildren({
        props,
        setActive
      });
      return () => {
        if (props.fixed && props.placeholder) {
          return renderPlaceholder(renderTabbar);
        }
        return renderTabbar();
      };
    }
  });
  const Tabbar = withInstall(stdin_default$5);
  const [name$2, bem$2] = createNamespace("tabbar-item");
  const tabbarItemProps = extend({}, routeProps, {
    dot: Boolean,
    icon: String,
    name: numericProp,
    badge: numericProp,
    badgeProps: Object,
    iconPrefix: String
  });
  var stdin_default$4 = vue.defineComponent({
    name: name$2,
    props: tabbarItemProps,
    emits: ["click"],
    setup(props, {
      emit,
      slots
    }) {
      const route2 = useRoute();
      const vm = vue.getCurrentInstance().proxy;
      const {
        parent,
        index
      } = useParent(TABBAR_KEY);
      if (!parent) {
        {
          formatAppLog("error", "at node_modules/vant/es/tabbar-item/TabbarItem.mjs:34", "[Vant] <TabbarItem> must be a child component of <Tabbar>.");
        }
        return;
      }
      const active = vue.computed(() => {
        var _a;
        const {
          route: route22,
          modelValue
        } = parent.props;
        if (route22 && "$route" in vm) {
          const {
            $route
          } = vm;
          const {
            to
          } = props;
          const config = isObject(to) ? to : {
            path: to
          };
          return !!$route.matched.find((val) => {
            const pathMatched = "path" in config && config.path === val.path;
            const nameMatched = "name" in config && config.name === val.name;
            return pathMatched || nameMatched;
          });
        }
        return ((_a = props.name) != null ? _a : index.value) === modelValue;
      });
      const onClick = (event) => {
        var _a;
        if (!active.value) {
          parent.setActive((_a = props.name) != null ? _a : index.value, route2);
        }
        emit("click", event);
      };
      const renderIcon = () => {
        if (slots.icon) {
          return slots.icon({
            active: active.value
          });
        }
        if (props.icon) {
          return vue.createVNode(Icon, {
            "name": props.icon,
            "classPrefix": props.iconPrefix
          }, null);
        }
      };
      return () => {
        var _a;
        const {
          dot,
          badge
        } = props;
        const {
          activeColor,
          inactiveColor
        } = parent.props;
        const color = active.value ? activeColor : inactiveColor;
        return vue.createVNode("div", {
          "role": "tab",
          "class": bem$2({
            active: active.value
          }),
          "style": {
            color
          },
          "tabindex": 0,
          "aria-selected": active.value,
          "onClick": onClick
        }, [vue.createVNode(Badge, vue.mergeProps({
          "dot": dot,
          "class": bem$2("icon"),
          "content": badge
        }, props.badgeProps), {
          default: renderIcon
        }), vue.createVNode("div", {
          "class": bem$2("text")
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots, {
          active: active.value
        })])]);
      };
    }
  });
  const TabbarItem = withInstall(stdin_default$4);
  const [name$1, bem$1] = createNamespace("tree-select");
  const treeSelectProps = {
    max: makeNumericProp(Infinity),
    items: makeArrayProp(),
    height: makeNumericProp(300),
    selectedIcon: makeStringProp("success"),
    mainActiveIndex: makeNumericProp(0),
    activeId: {
      type: [Number, String, Array],
      default: 0
    }
  };
  var stdin_default$3 = vue.defineComponent({
    name: name$1,
    props: treeSelectProps,
    emits: ["click-nav", "click-item", "update:activeId", "update:mainActiveIndex"],
    setup(props, {
      emit,
      slots
    }) {
      const isActiveItem = (id) => Array.isArray(props.activeId) ? props.activeId.includes(id) : props.activeId === id;
      const renderSubItem = (item) => {
        const onClick = () => {
          if (item.disabled) {
            return;
          }
          let activeId;
          if (Array.isArray(props.activeId)) {
            activeId = props.activeId.slice();
            const index = activeId.indexOf(item.id);
            if (index !== -1) {
              activeId.splice(index, 1);
            } else if (activeId.length < props.max) {
              activeId.push(item.id);
            }
          } else {
            activeId = item.id;
          }
          emit("update:activeId", activeId);
          emit("click-item", item);
        };
        return vue.createVNode("div", {
          "key": item.id,
          "class": ["van-ellipsis", bem$1("item", {
            active: isActiveItem(item.id),
            disabled: item.disabled
          })],
          "onClick": onClick
        }, [item.text, isActiveItem(item.id) && vue.createVNode(Icon, {
          "name": props.selectedIcon,
          "class": bem$1("selected")
        }, null)]);
      };
      const onSidebarChange = (index) => {
        emit("update:mainActiveIndex", index);
      };
      const onClickSidebarItem = (index) => emit("click-nav", index);
      const renderSidebar = () => {
        const Items = props.items.map((item) => vue.createVNode(SidebarItem, {
          "dot": item.dot,
          "title": item.text,
          "badge": item.badge,
          "class": [bem$1("nav-item"), item.className],
          "disabled": item.disabled,
          "onClick": onClickSidebarItem
        }, null));
        return vue.createVNode(Sidebar, {
          "class": bem$1("nav"),
          "modelValue": props.mainActiveIndex,
          "onChange": onSidebarChange
        }, {
          default: () => [Items]
        });
      };
      const renderContent = () => {
        if (slots.content) {
          return slots.content();
        }
        const selected = props.items[+props.mainActiveIndex] || {};
        if (selected.children) {
          return selected.children.map(renderSubItem);
        }
      };
      return () => vue.createVNode("div", {
        "class": bem$1(),
        "style": {
          height: addUnit(props.height)
        }
      }, [renderSidebar(), vue.createVNode("div", {
        "class": bem$1("content")
      }, [renderContent()])]);
    }
  });
  const TreeSelect = withInstall(stdin_default$3);
  const [name, bem, t] = createNamespace("uploader");
  function readFileContent(file, resultType) {
    return new Promise((resolve) => {
      if (resultType === "file") {
        resolve();
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      if (resultType === "dataUrl") {
        reader.readAsDataURL(file);
      } else if (resultType === "text") {
        reader.readAsText(file);
      }
    });
  }
  function isOversize(items, maxSize) {
    return toArray(items).some((item) => {
      if (item.file) {
        if (isFunction(maxSize)) {
          return maxSize(item.file);
        }
        return item.file.size > maxSize;
      }
      return false;
    });
  }
  function filterFiles(items, maxSize) {
    const valid = [];
    const invalid = [];
    items.forEach((item) => {
      if (isOversize(item, maxSize)) {
        invalid.push(item);
      } else {
        valid.push(item);
      }
    });
    return { valid, invalid };
  }
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
  const isImageUrl = (url) => IMAGE_REGEXP.test(url);
  function isImageFile(item) {
    if (item.isImage) {
      return true;
    }
    if (item.file && item.file.type) {
      return item.file.type.indexOf("image") === 0;
    }
    if (item.url) {
      return isImageUrl(item.url);
    }
    if (typeof item.content === "string") {
      return item.content.indexOf("data:image") === 0;
    }
    return false;
  }
  var stdin_default$2 = vue.defineComponent({
    props: {
      name: numericProp,
      item: makeRequiredProp(Object),
      index: Number,
      imageFit: String,
      lazyLoad: Boolean,
      deletable: Boolean,
      previewSize: [Number, String, Array],
      beforeDelete: Function
    },
    emits: ["delete", "preview"],
    setup(props, {
      emit,
      slots
    }) {
      const renderMask = () => {
        const {
          status,
          message
        } = props.item;
        if (status === "uploading" || status === "failed") {
          const MaskIcon = status === "failed" ? vue.createVNode(Icon, {
            "name": "close",
            "class": bem("mask-icon")
          }, null) : vue.createVNode(Loading, {
            "class": bem("loading")
          }, null);
          const showMessage = isDef(message) && message !== "";
          return vue.createVNode("div", {
            "class": bem("mask")
          }, [MaskIcon, showMessage && vue.createVNode("div", {
            "class": bem("mask-message")
          }, [message])]);
        }
      };
      const onDelete = (event) => {
        const {
          name: name2,
          item,
          index,
          beforeDelete
        } = props;
        event.stopPropagation();
        callInterceptor(beforeDelete, {
          args: [item, {
            name: name2,
            index
          }],
          done: () => emit("delete")
        });
      };
      const onPreview = () => emit("preview");
      const renderDeleteIcon = () => {
        if (props.deletable && props.item.status !== "uploading") {
          const slot = slots["preview-delete"];
          return vue.createVNode("div", {
            "role": "button",
            "class": bem("preview-delete", {
              shadow: !slot
            }),
            "tabindex": 0,
            "aria-label": t("delete"),
            "onClick": onDelete
          }, [slot ? slot() : vue.createVNode(Icon, {
            "name": "cross",
            "class": bem("preview-delete-icon")
          }, null)]);
        }
      };
      const renderCover = () => {
        if (slots["preview-cover"]) {
          const {
            index,
            item
          } = props;
          return vue.createVNode("div", {
            "class": bem("preview-cover")
          }, [slots["preview-cover"](extend({
            index
          }, item))]);
        }
      };
      const renderPreview = () => {
        const {
          item,
          lazyLoad,
          imageFit,
          previewSize
        } = props;
        if (isImageFile(item)) {
          return vue.createVNode(Image, {
            "fit": imageFit,
            "src": item.content || item.url,
            "class": bem("preview-image"),
            "width": Array.isArray(previewSize) ? previewSize[0] : previewSize,
            "height": Array.isArray(previewSize) ? previewSize[1] : previewSize,
            "lazyLoad": lazyLoad,
            "onClick": onPreview
          }, {
            default: renderCover
          });
        }
        return vue.createVNode("div", {
          "class": bem("file"),
          "style": getSizeStyle(props.previewSize)
        }, [vue.createVNode(Icon, {
          "class": bem("file-icon"),
          "name": "description"
        }, null), vue.createVNode("div", {
          "class": [bem("file-name"), "van-ellipsis"]
        }, [item.file ? item.file.name : item.url]), renderCover()]);
      };
      return () => vue.createVNode("div", {
        "class": bem("preview")
      }, [renderPreview(), renderMask(), renderDeleteIcon()]);
    }
  });
  const uploaderProps = {
    name: makeNumericProp(""),
    accept: makeStringProp("image/*"),
    capture: String,
    multiple: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    lazyLoad: Boolean,
    maxCount: makeNumericProp(Infinity),
    imageFit: makeStringProp("cover"),
    resultType: makeStringProp("dataUrl"),
    uploadIcon: makeStringProp("photograph"),
    uploadText: String,
    deletable: truthProp,
    afterRead: Function,
    showUpload: truthProp,
    modelValue: makeArrayProp(),
    beforeRead: Function,
    beforeDelete: Function,
    previewSize: [Number, String, Array],
    previewImage: truthProp,
    previewOptions: Object,
    previewFullImage: truthProp,
    maxSize: {
      type: [Number, String, Function],
      default: Infinity
    }
  };
  var stdin_default$1 = vue.defineComponent({
    name,
    props: uploaderProps,
    emits: ["delete", "oversize", "click-upload", "close-preview", "click-preview", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const inputRef = vue.ref();
      const urls = [];
      const getDetail = (index = props.modelValue.length) => ({
        name: props.name,
        index
      });
      const resetInput = () => {
        if (inputRef.value) {
          inputRef.value.value = "";
        }
      };
      const onAfterRead = (items) => {
        resetInput();
        if (isOversize(items, props.maxSize)) {
          if (Array.isArray(items)) {
            const result = filterFiles(items, props.maxSize);
            items = result.valid;
            emit("oversize", result.invalid, getDetail());
            if (!items.length) {
              return;
            }
          } else {
            emit("oversize", items, getDetail());
            return;
          }
        }
        items = vue.reactive(items);
        emit("update:modelValue", [...props.modelValue, ...toArray(items)]);
        if (props.afterRead) {
          props.afterRead(items, getDetail());
        }
      };
      const readFile = (files) => {
        const {
          maxCount,
          modelValue,
          resultType
        } = props;
        if (Array.isArray(files)) {
          const remainCount = +maxCount - modelValue.length;
          if (files.length > remainCount) {
            files = files.slice(0, remainCount);
          }
          Promise.all(files.map((file) => readFileContent(file, resultType))).then((contents) => {
            const fileList = files.map((file, index) => {
              const result = {
                file,
                status: "",
                message: ""
              };
              if (contents[index]) {
                result.content = contents[index];
              }
              return result;
            });
            onAfterRead(fileList);
          });
        } else {
          readFileContent(files, resultType).then((content) => {
            const result = {
              file: files,
              status: "",
              message: ""
            };
            if (content) {
              result.content = content;
            }
            onAfterRead(result);
          });
        }
      };
      const onChange = (event) => {
        const {
          files
        } = event.target;
        if (props.disabled || !files || !files.length) {
          return;
        }
        const file = files.length === 1 ? files[0] : [].slice.call(files);
        if (props.beforeRead) {
          const response = props.beforeRead(file, getDetail());
          if (!response) {
            resetInput();
            return;
          }
          if (isPromise(response)) {
            response.then((data) => {
              if (data) {
                readFile(data);
              } else {
                readFile(file);
              }
            }).catch(resetInput);
            return;
          }
        }
        readFile(file);
      };
      let imagePreview;
      const onClosePreview = () => emit("close-preview");
      const previewImage = (item) => {
        if (props.previewFullImage) {
          const imageFiles = props.modelValue.filter(isImageFile);
          const images = imageFiles.map((item2) => {
            if (item2.file && !item2.url && item2.status !== "failed") {
              item2.url = URL.createObjectURL(item2.file);
              urls.push(item2.url);
            }
            return item2.url;
          }).filter(Boolean);
          imagePreview = ImagePreview(extend({
            images,
            startPosition: imageFiles.indexOf(item),
            onClose: onClosePreview
          }, props.previewOptions));
        }
      };
      const closeImagePreview = () => {
        if (imagePreview) {
          imagePreview.close();
        }
      };
      const deleteFile = (item, index) => {
        const fileList = props.modelValue.slice(0);
        fileList.splice(index, 1);
        emit("update:modelValue", fileList);
        emit("delete", item, getDetail(index));
      };
      const renderPreviewItem = (item, index) => {
        const needPickData = ["imageFit", "deletable", "previewSize", "beforeDelete"];
        const previewData = extend(pick(props, needPickData), pick(item, needPickData, true));
        return vue.createVNode(stdin_default$2, vue.mergeProps({
          "item": item,
          "index": index,
          "onClick": () => emit("click-preview", item, getDetail(index)),
          "onDelete": () => deleteFile(item, index),
          "onPreview": () => previewImage(item)
        }, pick(props, ["name", "lazyLoad"]), previewData), pick(slots, ["preview-cover", "preview-delete"]));
      };
      const renderPreviewList = () => {
        if (props.previewImage) {
          return props.modelValue.map(renderPreviewItem);
        }
      };
      const onClickUpload = (event) => emit("click-upload", event);
      const renderUpload = () => {
        if (props.modelValue.length >= props.maxCount || !props.showUpload) {
          return;
        }
        const Input = props.readonly ? null : vue.createVNode("input", {
          "ref": inputRef,
          "type": "file",
          "class": bem("input"),
          "accept": props.accept,
          "capture": props.capture,
          "multiple": props.multiple,
          "disabled": props.disabled,
          "onChange": onChange
        }, null);
        if (slots.default) {
          return vue.createVNode("div", {
            "class": bem("input-wrapper"),
            "onClick": onClickUpload
          }, [slots.default(), Input]);
        }
        return vue.createVNode("div", {
          "class": bem("upload", {
            readonly: props.readonly
          }),
          "style": getSizeStyle(props.previewSize),
          "onClick": onClickUpload
        }, [vue.createVNode(Icon, {
          "name": props.uploadIcon,
          "class": bem("upload-icon")
        }, null), props.uploadText && vue.createVNode("span", {
          "class": bem("upload-text")
        }, [props.uploadText]), Input]);
      };
      const chooseFile = () => {
        if (inputRef.value && !props.disabled) {
          inputRef.value.click();
        }
      };
      vue.onBeforeUnmount(() => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      });
      useExpose({
        chooseFile,
        closeImagePreview
      });
      useCustomFieldValue(() => props.modelValue);
      return () => vue.createVNode("div", {
        "class": bem()
      }, [vue.createVNode("div", {
        "class": bem("wrapper", {
          disabled: props.disabled
        })
      }, [renderPreviewList(), renderUpload()])]);
    }
  });
  const Uploader = withInstall(stdin_default$1);
  const version = "3.6.5";
  function install(app) {
    const components = [
      ActionBar,
      ActionBarButton,
      ActionBarIcon,
      ActionSheet,
      AddressEdit,
      AddressList,
      Area,
      Badge,
      Button,
      Calendar,
      Card,
      Cascader,
      Cell,
      CellGroup,
      Checkbox,
      CheckboxGroup,
      Circle,
      Col,
      Collapse,
      CollapseItem,
      ConfigProvider,
      ContactCard,
      ContactEdit,
      ContactList,
      CountDown,
      Coupon,
      CouponCell,
      CouponList,
      DatetimePicker,
      Dialog,
      Divider,
      DropdownItem,
      DropdownMenu,
      Empty,
      Field,
      Form,
      Grid,
      GridItem,
      Icon,
      Image,
      ImagePreview,
      IndexAnchor,
      IndexBar,
      List,
      Loading,
      Locale,
      NavBar,
      NoticeBar,
      Notify,
      NumberKeyboard,
      Overlay,
      Pagination,
      PasswordInput,
      Picker,
      Popover,
      Popup,
      Progress,
      PullRefresh,
      Radio,
      RadioGroup,
      Rate,
      Row,
      Search,
      ShareSheet,
      Sidebar,
      SidebarItem,
      Skeleton,
      Slider,
      Space,
      Step,
      Stepper,
      Steps,
      Sticky,
      SubmitBar,
      Swipe,
      SwipeCell,
      SwipeItem,
      Switch,
      Tab,
      Tabbar,
      TabbarItem,
      Tabs,
      Tag,
      Toast$1,
      TreeSelect,
      Uploader
    ];
    components.forEach((item) => {
      if (item.install) {
        app.use(item);
      } else if (item.name) {
        app.component(item.name, item);
      }
    });
  }
  var stdin_default = {
    install,
    version
  };
  let weixinAuthService;
  const _sfc_main$g = {
    data() {
      return {
        show: false,
        phone: "",
        checkFlag: false,
        hasWeixinAuth: false,
        checkPhone: "",
        needChecked: false
      };
    },
    computed: {
      controlActiveFlag() {
        let flag = false;
        if (this.phone.length === 11) {
          flag = true;
        }
        return flag;
      }
    },
    onLoad() {
      formatAppLog("log", "at pages/logining/logining.vue:107", plus, ">>>>");
      plus.oauth.getServices((services) => {
        weixinAuthService = services.find((service) => {
          return service.id === "weixin";
        });
        if (weixinAuthService) {
          this.hasWeixinAuth = true;
        }
      });
    },
    methods: {
      async getSms() {
        if (this.controlActiveFlag && !this.checkFlag) {
          this.needChecked = true;
          return;
        }
        if (this.controlActiveFlag) {
          const login = yn.importObject("login");
          try {
            const smsRes = await login.sendSmsCode(this.phone);
            formatAppLog("log", "at pages/logining/logining.vue:131", smsRes, "\u767B\u5F55\u6210\u529F");
            if (smsRes.code == 0) {
              uni.navigateTo({
                url: "/pages/verificatioCode/verificatioCode?mobile=" + smsRes.mobile,
                success: (res) => {
                },
                fail: () => {
                },
                complete: () => {
                }
              });
            }
          } catch (err) {
            formatAppLog("log", "at pages/logining/logining.vue:145", err, "\u6211\u662F\u9519\u8BEF");
          }
        }
      },
      agreeContiute() {
        this.checkFlag = true;
        this.needChecked = false;
      },
      getWeixinCode() {
        return new Promise((resolve, reject) => {
          weixinAuthService.authorize(function(res) {
            resolve(res.code);
          }, function(err) {
            formatAppLog("log", "at pages/logining/logining.vue:161", err);
            reject(new Error("\u5FAE\u4FE1\u767B\u5F55\u5931\u8D25"));
          });
        });
      },
      loginByWeixin() {
        debugger;
        this.getWeixinCode().then((code) => {
          return yn.callFunction({
            name: "login-by-weixin",
            data: {
              code
            }
          });
        }).then((res) => {
          uni.showModal({
            showCancel: false,
            content: JSON.stringify(res.result)
          });
          if (res.result.code === 0) {
            uni.setStorageSync("uni_id_token", res.result.token);
            uni.setStorageSync("uni_id_token_expired", res.result.tokenExpired);
          }
        }).catch(() => {
          uni.showModal({
            showCancel: false,
            content: "\u5FAE\u4FE1\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"
          });
        });
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_number_keyboard = vue.resolveComponent("van-number-keyboard");
    return vue.openBlock(), vue.createElementBlock("view", { class: "counter" }, [
      vue.createElementVNode("view", { class: "text" }, [
        vue.createElementVNode("text", { class: "text1" }, [
          vue.createTextVNode("\u5065\u53D8\uFF0C"),
          vue.createElementVNode("br"),
          vue.createTextVNode(" \u4ECE\u6B64\u523B\u5F00\u59CB\u3002")
        ]),
        vue.createElementVNode("br"),
        vue.createElementVNode("text", { class: "text2" }, "\u79C1\u4EBA\u4E13\u5C5E\u6559\u7EC3\uFF0C\u6241\u5E73\u5B66\u5458\u7BA1\u7406")
      ]),
      vue.createElementVNode("view", { class: "middle" }, [
        vue.createVNode(_component_van_field, {
          modelValue: $data.phone,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.phone = $event),
          readonly: "",
          clickable: "",
          class: "phone",
          placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
          onTouchstart: _cache[1] || (_cache[1] = vue.withModifiers(($event) => $data.show = true, ["stop"]))
        }, null, 8, ["modelValue"]),
        vue.createVNode(_component_van_number_keyboard, {
          modelValue: $data.phone,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.phone = $event),
          show: $data.show,
          maxlength: 11,
          onBlur: _cache[3] || (_cache[3] = ($event) => $data.show = false)
        }, null, 8, ["modelValue", "show"]),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["btn", $options.controlActiveFlag ? "active_btn" : ""]),
          onClick: _cache[4] || (_cache[4] = (...args) => $options.getSms && $options.getSms(...args))
        }, [
          vue.createElementVNode("span", { class: "btn-text" }, "\u83B7\u53D6\u9A8C\u8BC1\u7801")
        ], 2),
        vue.createElementVNode("view", { class: "ying_si_style" }, [
          vue.createElementVNode("view", {
            class: "check_style",
            onClick: _cache[5] || (_cache[5] = ($event) => $data.checkFlag = !$data.checkFlag)
          }, [
            $data.checkFlag ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 0,
              class: "check_img_style",
              src: "/static/login/check.svg"
            })) : vue.createCommentVNode("v-if", true),
            !$data.checkFlag ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 1,
              class: "check_img_style",
              src: "/static/login/nocheck.svg"
            })) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "ying_si_remark_dakuang_style" }, [
            vue.createElementVNode("text", { class: "ying_si_remark" }, "\u540C\u610F"),
            vue.createElementVNode("text", { class: "ying_si_remark_middle" }, [
              vue.createElementVNode("text", { class: "ying_si_jump_style" }, "\u300A\u9690\u79C1\u653F\u7B56\u300B"),
              vue.createTextVNode(" \u548C "),
              vue.createElementVNode("text", { class: "ying_si_jump_style" }, "\u300A\u7528\u6237\u534F\u8BAE\u300B")
            ]),
            vue.createElementVNode("text", { class: "ying_si_remark" }, "\u653F\u7B56\u5E76\u4F7F\u7528\u672C\u673A\u53F7\u7801\u767B\u5F55")
          ]),
          $data.needChecked ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "botter"
          }, [
            vue.createElementVNode("view", { class: "botter-top" }, [
              vue.createElementVNode("h1", { class: "botter-top1" }, "\u6B22\u8FCE\u4F7F\u7528\u672C\u4EA7\u54C1\uFF01"),
              vue.createElementVNode("h2", { class: "botter-top2" }, "welcome"),
              vue.createElementVNode("p", { class: "botter-top3" }, " \u4E3A\u4E86\u66F4\u597D\u7684\u4FDD\u969C\u60A8\u7684\u5408\u6CD5\u6743\u76CA\uFF0C\u5728\u4F7F\u7528\u672C\u5E94\u7528\u4E4B\u524D\uFF0C\u8BF7\u60A8\u4ED4\u7EC6\u9605\u8BFB\u300A\u9690\u79C1\u534F\u8BAE\u300B\u548C\u300A\u7528\u6237\u534F\u8BAE\u300B\uFF0C\u70B9\u51FB\u540C\u610F\u5373\u8868\u793A\u60A8\u5DF2\u9605\u8BFB\u5E76\u540C\u610F\u63A5\u53D7\u6211\u4EEC\u7684\u670D\u52A1\uFF0C\u611F\u8C22\u60A8\u7684\u4FE1\u4EFB\uFF01 "),
              vue.createElementVNode("button", {
                class: "botter-top4",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.agreeContiute && $options.agreeContiute(...args))
              }, [
                vue.createElementVNode("span", { class: "botter-top4-text" }, "\u540C\u610F\u5E76\u7EE7\u7EED")
              ]),
              vue.createElementVNode("view", {
                class: "botter-top5-text",
                onClick: _cache[7] || (_cache[7] = ($event) => $data.needChecked = false)
              }, "\u4E0D\u540C\u610F")
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          class: "wx_loging_style",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.loginByWeixin && $options.loginByWeixin(...args))
        }, [
          vue.createElementVNode("image", {
            onClick: _cache[8] || (_cache[8] = (...args) => $options.loginByWeixin && $options.loginByWeixin(...args)),
            class: "wx_img_style",
            src: "/static/login/wxlogin.svg"
          })
        ])
      ])
    ]);
  }
  var PagesLoginingLogining = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-10030aa6"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/logining/logining.vue"]]);
  const _sfc_main$f = {
    data() {
      return {
        smsCode: "",
        errorInfoValue: "",
        showKeyboard: false,
        countDown: 60 * 1e3,
        mobile: "",
        requestVerifyCode: "",
        sureLogin: false,
        isFinsh: false
      };
    },
    onLoad(options) {
      this.mobile = options.mobile || "";
    },
    async mounted() {
      this.verifyCode();
    },
    watch: {
      smsCode: function(n2, o2) {
        if (n2.length === 4 && n2 !== this.requestVerifyCode) {
          this.errorInfoValue = "\u9A8C\u8BC1\u7801\u9519\u8BEF";
          this.sureLogin = false;
        } else {
          this.errorInfoValue = "";
          this.sureLogin = false;
        }
        if (n2.length === 4 && n2 === this.requestVerifyCode) {
          this.sureLogin = true;
        }
      }
    },
    methods: {
      async resend() {
        if (this.isFinsh) {
          const login = yn.importObject("login");
          try {
            const smsRes = await login.sendSmsCode(this.mobile);
            formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:95", smsRes, "\u53D1\u9001\u6210\u529F");
            if (smsRes.code == 0) {
              this.mobile = smsRes.mobile;
              this.verifyCode();
              this.$refs.countDown.reset();
            }
          } catch (err) {
            formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:103", err, "\u6211\u662F\u9519\u8BEF");
          }
        }
      },
      onFinsh() {
        this.isFinsh = true;
      },
      async verifyCode() {
        let login = yn.importObject("login");
        const getVerifyRes = await login.getVerifySchema();
        try {
          this.requestVerifyCode = getVerifyRes.length > 0 ? getVerifyRes[0].code : "0000";
        } catch (err) {
        }
      },
      async smsLogin() {
        const vefiryLogin = yn.importObject("login");
        try {
          let param = {
            mobile: this.mobile,
            code: this.requestVerifyCode
          };
          const loginRes = await vefiryLogin.loginBySms(param);
          formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:128", loginRes, "\u53D1\u9001\u6210\u529F");
          if (loginRes.code == 0) {
            try {
              uni.setStorageSync("userInfo", JSON.stringify(loginRes.userInfo));
              uni.setStorageSync("uni_id_token", loginRes.token);
              uni.setStorageSync("uid", loginRes.uid);
              uni.setStorageSync("tokenExpired", loginRes.tokenExpired);
              let userLogin = yn.importObject("login");
              const getUseRes = await userLogin.getUserSchema(this.mobile);
              if (getUseRes) {
                uni.setStorageSync("loginNum", getUseRes.affectedDocs);
                uni.reLaunch({
                  url: "/pages/myMebers/myMebers"
                });
              }
            } catch (e) {
            }
          }
        } catch (err) {
          formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:150", err, "\u6211\u662F\u9519\u8BEF");
        }
      },
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_password_input = vue.resolveComponent("van-password-input");
    const _component_van_number_keyboard = vue.resolveComponent("van-number-keyboard");
    const _component_van_count_down = vue.resolveComponent("van-count-down");
    return vue.openBlock(), vue.createElementBlock("view", { class: "counter" }, [
      vue.createCommentVNode(" \u8FD4\u56DE "),
      vue.createVNode(_component_van_icon, {
        name: "arrow-left",
        size: "50upx",
        onClick: $options.goBack,
        class: "app-esc"
      }, null, 8, ["onClick"]),
      vue.createElementVNode("view", { class: "counter-matter" }, [
        vue.createElementVNode("h1", { class: "code" }, "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"),
        vue.createElementVNode("span", { class: "phone" }, "\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001\u81F3 " + vue.toDisplayString($data.mobile), 1),
        vue.createCommentVNode(" \u660E\u6587\u5C55\u793A\u9A8C\u8BC1\u7801 "),
        vue.createVNode(_component_van_password_input, {
          class: "a-i-c",
          mask: false,
          length: 4,
          gutter: 10,
          value: $data.smsCode,
          "error-info": $data.errorInfoValue,
          focused: $data.showKeyboard,
          onFocus: _cache[0] || (_cache[0] = ($event) => $data.showKeyboard = true)
        }, null, 8, ["value", "error-info", "focused"]),
        vue.createVNode(_component_van_number_keyboard, {
          modelValue: $data.smsCode,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.smsCode = $event),
          show: $data.showKeyboard,
          onBlur: _cache[2] || (_cache[2] = ($event) => $data.showKeyboard = false),
          maxlength: 4
        }, null, 8, ["modelValue", "show"]),
        vue.createCommentVNode(" \u767B\u5F55 "),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["btn", $data.sureLogin ? "active" : ""]),
          onClick: _cache[3] || (_cache[3] = (...args) => $options.smsLogin && $options.smsLogin(...args))
        }, [
          vue.createElementVNode("span", { class: "btn-text" }, "\u767B\u5F55")
        ], 2),
        vue.createElementVNode("p", {
          class: vue.normalizeClass(["time", $data.isFinsh ? "timeActive" : ""]),
          onClick: _cache[4] || (_cache[4] = (...args) => $options.resend && $options.resend(...args))
        }, [
          vue.createTextVNode(" \u91CD\u65B0\u53D1\u9001\uFF08"),
          vue.createElementVNode("view", null, [
            vue.createVNode(_component_van_count_down, {
              ref: "countDown",
              millisecond: "",
              onFinish: $options.onFinsh,
              time: $data.countDown,
              "auto-start": true,
              class: vue.normalizeClass($data.isFinsh ? "countActive" : ""),
              format: "ss"
            }, null, 8, ["onFinish", "time", "class"])
          ]),
          vue.createTextVNode("\uFF09 ")
        ], 2)
      ])
    ]);
  }
  var PagesVerificatioCodeVerificatioCode = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-8600eef0"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/verificatioCode/verificatioCode.vue"]]);
  const _sfc_main$e = {
    setup() {
      const result = vue.ref("");
      const showPicker = vue.ref(false);
      const columns = ["\u7537", "\u5973"];
      const onConfirm = (value) => {
        result.value = value;
        showPicker.value = false;
      };
      return {
        result,
        columns,
        onConfirm,
        showPicker
      };
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_picker = vue.resolveComponent("van-picker");
    const _component_van_popup = vue.resolveComponent("van-popup");
    return vue.openBlock(), vue.createElementBlock("view", { class: "counter" }, [
      vue.createCommentVNode(" \u8FD4\u56DE\u56FE\u6807 "),
      vue.createVNode(_component_van_icon, {
        name: "arrow-left",
        size: "50upx",
        class: "app-esc"
      }),
      vue.createElementVNode("p", { class: "text" }, "\u8DF3\u8FC7"),
      vue.createElementVNode("view", { class: "botter" }, [
        vue.createElementVNode("span", { class: "botter-top" }, "\u4E2A\u4EBA\u4FE1\u606F\u5B8C\u5584"),
        vue.createElementVNode("p", { class: "a-i-c" }, "\u5B8C\u5584\u4FE1\u606F\u540E\u65B9\u53EF\u8FDB\u884C\u5B66\u5458\u7BA1\u7406")
      ]),
      vue.createCommentVNode(" \u8F93\u5165\u6846\u4E0B\u62C9\u6846 "),
      vue.createElementVNode("view", { class: "input" }, [
        vue.createVNode(_component_van_field, {
          class: "input-name",
          modelValue: _ctx.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.value = $event),
          label: "\u59D3\u540D",
          placeholder: "\u8BF7\u586B\u5199\u59D3\u540D",
          "input-align": "right"
        }, null, 8, ["modelValue"])
      ]),
      vue.createCommentVNode(" \u6027\u522B\u4E0B\u62C9\u6846 "),
      vue.createElementVNode("view", { class: "options" }, [
        vue.createVNode(_component_van_field, {
          class: "options-sex",
          modelValue: $setup.result,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.result = $event),
          "is-link": "",
          readonly: "",
          name: "picker",
          label: "\u6027\u522B",
          placeholder: "\u8BF7\u9009\u62E9\u6027\u522B",
          onClick: _cache[2] || (_cache[2] = ($event) => $setup.showPicker = true)
        }, null, 8, ["modelValue"]),
        vue.createVNode(_component_van_popup, {
          show: $setup.showPicker,
          "onUpdate:show": _cache[4] || (_cache[4] = ($event) => $setup.showPicker = $event),
          position: "bottom"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_picker, {
              columns: $setup.columns,
              onConfirm: $setup.onConfirm,
              onCancel: _cache[3] || (_cache[3] = ($event) => $setup.showPicker = false)
            }, null, 8, ["columns", "onConfirm"])
          ]),
          _: 1
        }, 8, ["show"])
      ]),
      vue.createCommentVNode(" \u786E\u8BA4\u6309\u94AE "),
      vue.createElementVNode("view", { class: "btn" }, [
        vue.createElementVNode("button", { class: "btn-b" }, [
          vue.createElementVNode("span", { class: "btn-text" }, "\u786E\u8BA4")
        ])
      ])
    ]);
  }
  var PagesPersonalnformationPersonalnformation = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-77747d66"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/personalnformation/personalnformation.vue"]]);
  const _sfc_main$d = {
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      className: {
        type: [String, Array],
        default: ""
      },
      list: {
        type: [Array],
        default: () => []
      },
      position: {
        type: String,
        default: "center"
      },
      mode: {
        type: String,
        default: "longpress"
      }
    },
    data() {
      return {
        showList: false
      };
    },
    methods: {
      selectHandle(i2) {
        this.$emit("selctClick", i2);
        this.showList = false;
      },
      clickHandle() {
        if (this.disabled || this.mode !== "click") {
          return false;
        }
        this.showList = true;
      },
      longpressHandle() {
        if (this.disabled || this.mode !== "longpress") {
          return false;
        }
        this.showList = true;
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      tabindex: "-1",
      class: vue.normalizeClass(["popover", $props.className]),
      onLongpress: _cache[0] || (_cache[0] = ($event) => $options.longpressHandle()),
      onClick: _cache[1] || (_cache[1] = (...args) => $options.clickHandle && $options.clickHandle(...args)),
      onBlur: _cache[2] || (_cache[2] = ($event) => $data.showList = false)
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
      $data.showList ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: vue.normalizeClass(["popover-list", { center: $props.position === "center", left: $props.position === "left", right: $props.position === "right" }])
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.list, (i2, k2) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: k2,
            class: "list-item",
            onClick: ($event) => $options.selectHandle(i2)
          }, [
            vue.renderSlot(_ctx.$slots, "item", { item: i2 }, () => [
              vue.createTextVNode(vue.toDisplayString(i2.text), 1)
            ], true)
          ], 8, ["onClick"]);
        }), 128))
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 34);
  }
  var popover = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-6e9947bd"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/components/popover/index.vue"]]);
  const actionLibrary$1 = yn.importObject("actionLibrary");
  const _sfc_main$c = {
    components: {
      popover
    },
    data() {
      return {
        mode: 0,
        actionName: null,
        actionClass: 0,
        actionClassName: "\u80F8",
        actionClassList: [
          {
            text: "\u80F8",
            value: 0
          },
          {
            text: "\u80CC",
            value: 1
          },
          {
            text: "\u817F",
            value: 2
          },
          {
            text: "\u80A9",
            value: 3
          },
          {
            text: "\u659C\u65B9\u808C",
            value: 4
          },
          {
            text: "\u4E8C\u5934",
            value: 5
          },
          {
            text: "\u4E09\u5934",
            value: 6
          },
          {
            text: "\u5C0F\u817F",
            value: 7
          },
          {
            text: "\u524D\u81C2",
            value: 8
          },
          {
            text: "\u81C0\u90E8",
            value: 9
          },
          {
            text: "\u9888\u524D\u5F15",
            value: 10
          },
          {
            text: "\u5706\u80A9",
            value: 11
          },
          {
            text: "\u9A7C\u80CC",
            value: 12
          },
          {
            text: "\u7FFC\u72B6\u80A9\u80DB",
            value: 13
          },
          {
            text: "\u9AA8\u76C6\u524D\u503E",
            value: 14
          },
          {
            text: "\u9AA8\u76C6\u540E\u503E",
            value: 15
          },
          {
            text: "\u819D\u5185\u6263",
            value: 16
          },
          {
            text: "\u8DB3\u5916\u7FFB",
            value: 17
          },
          {
            text: "\u8DB3\u5185\u7FFB",
            value: 18
          },
          {
            text: "\u81EA\u5B9A\u4E49\u52A8\u4F5C",
            value: 19
          }
        ],
        actions: [{ text: "\u4FEE\u6539\u52A8\u4F5C" }, { text: "\u5220\u9664\u52A8\u4F5C" }],
        showDialog: false,
        showSaveButton: false,
        actionList: [],
        selectActionList: []
      };
    },
    onShow() {
      this.selectActionList = [];
      const type = uni.getStorageSync("actionLibraryType");
      if (type === "select") {
        this.actionClassList.forEach((item) => {
          const list = this.selectActionList.filter((child) => child.actionClass === item.value);
          item.badge = list.length || null;
        });
        uni.hideTabBar();
        this.showSaveButton = true;
      } else {
        uni.showTabBar();
        this.showSaveButton = false;
      }
      this.getActionList();
    },
    methods: {
      async getActionList() {
        this.actionClassName = this.actionClassList[this.actionClass].text;
        const res = await actionLibrary$1.getActionList({
          type: this.mode,
          actionClass: this.actionClass,
          actionName: this.actionName
        });
        const actionList = res.data || [];
        this.actionList = actionList.map((item) => {
          const flag = this.selectActionList.some((i2) => item._id === i2._id);
          if (flag) {
            return __spreadProps(__spreadValues({}, item), {
              active: true
            });
          } else {
            return __spreadProps(__spreadValues({}, item), {
              active: false
            });
          }
        });
      },
      modeChangeHandle(val) {
        this.mode = val;
        this.getActionList();
      },
      selectAction(i2) {
        if (!this.showSaveButton) {
          return;
        }
        i2.active = !i2.active;
        if (i2.active) {
          this.selectActionList.push(i2);
        } else {
          this.selectActionList = this.selectActionList.filter((item) => item._id !== i2._id);
        }
        this.actionClassList.forEach((item) => {
          const list = this.selectActionList.filter((child) => child.actionClass === item.value);
          item.badge = list.length || null;
        });
      },
      selectClick(item) {
        if (item.text === "\u5220\u9664\u52A8\u4F5C") {
          this.showDialog = true;
        }
      },
      addActionHandle(index) {
        if (index === 19) {
          uni.navigateTo({
            url: `/pages/addAction/index?type=${this.mode}&actionClass=${index}`
          });
        } else {
          uni.navigateTo({
            url: `/pages/addAction/index?type=${this.mode}&actionClass=${this.actionClass}`
          });
        }
      },
      goBack() {
        uni.setStorageSync("actionLibraryType", "show");
        uni.setStorageSync("actionList", JSON.stringify([]));
        uni.navigateTo({
          url: "/pages/newWorkout/newWorkout"
        });
        this.actionList = [];
        uni.showTabBar();
      },
      goNewWorkout() {
        uni.setStorageSync("actionLibraryType", "show");
        uni.setStorageSync("actionList", JSON.stringify(this.selectActionList));
        uni.navigateTo({
          url: "/pages/newWorkout/newWorkout"
        });
        this.actionList = [];
        uni.showTabBar();
      }
    },
    computed: {
      selectNum() {
        return this.selectActionList.length || 0;
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_sidebar_item = vue.resolveComponent("van-sidebar-item");
    const _component_van_sidebar = vue.resolveComponent("van-sidebar");
    const _component_popover = vue.resolveComponent("popover");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_dialog = vue.resolveComponent("van-dialog");
    return vue.openBlock(), vue.createElementBlock("view", { class: "action-library" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["all-action", { active: $data.mode === 0 }]),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.modeChangeHandle(0))
        }, "\u5168\u90E8\u52A8\u4F5C\u5E93", 2),
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["problem-action", { active: $data.mode === 1 }]),
          onClick: _cache[1] || (_cache[1] = ($event) => $options.modeChangeHandle(1))
        }, "\u95EE\u9898\u52A8\u4F5C\u5E93", 2),
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["custom-action", { show: $data.showSaveButton }]),
          onClick: _cache[2] || (_cache[2] = ($event) => $options.addActionHandle(19))
        }, "+ \u81EA\u5B9A\u4E49\u52A8\u4F5C", 2)
      ]),
      vue.createElementVNode("view", { class: "search" }, [
        vue.createElementVNode("view", { class: "uni-search" }, [
          vue.createVNode(_component_van_icon, { name: "search" }),
          vue.withDirectives(vue.createElementVNode("input", {
            class: "uni-input",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.actionName = $event),
            onConfirm: _cache[4] || (_cache[4] = (...args) => $options.getActionList && $options.getActionList(...args)),
            "confirm-type": "search",
            placeholder: "\u8F93\u5165\u52A8\u4F5C\u540D\u79F0\u641C\u7D22"
          }, null, 544), [
            [vue.vModelText, $data.actionName]
          ])
        ])
      ]),
      vue.createElementVNode("view", {
        class: vue.normalizeClass(["content", { "select-page": $data.showSaveButton }])
      }, [
        vue.createElementVNode("view", { class: "sidebar" }, [
          vue.createVNode(_component_van_sidebar, {
            modelValue: $data.actionClass,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.actionClass = $event),
            onChange: $options.getActionList
          }, {
            default: vue.withCtx(() => [
              !$data.showSaveButton ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($data.actionClassList, (item) => {
                return vue.openBlock(), vue.createBlock(_component_van_sidebar_item, {
                  key: item.value,
                  title: item.text
                }, null, 8, ["title"]);
              }), 128)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList($data.actionClassList, (item) => {
                return vue.openBlock(), vue.createBlock(_component_van_sidebar_item, {
                  key: item.value,
                  title: item.text,
                  badge: item.badge
                }, null, 8, ["title", "badge"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["modelValue", "onChange"])
        ]),
        vue.createElementVNode("view", { class: "action-list" }, [
          vue.createElementVNode("view", { class: "action-list-title" }, vue.toDisplayString($data.actionClassName) + "\u8BAD\u7EC3\u52A8\u4F5C", 1),
          vue.createElementVNode("view", { class: "action-list-view" }, [
            $data.actionClass === 19 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "action-list-box"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.actionList, (i2) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i2._id,
                  class: vue.normalizeClass(["action-list-item", { active: i2.active }]),
                  onClick: ($event) => $options.selectAction(i2)
                }, [
                  vue.createVNode(_component_popover, {
                    className: "image",
                    list: $data.actions,
                    mode: "longpress",
                    disabled: $data.showSaveButton,
                    onSelctClick: $options.selectClick
                  }, {
                    item: vue.withCtx(({ item }) => [
                      item.text === "\u5220\u9664\u52A8\u4F5C" ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        style: { "color": "#F04242" }
                      }, vue.toDisplayString(item.text), 1)) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                    ]),
                    default: vue.withCtx(() => [
                      vue.createElementVNode("view", { class: "action-name" }, vue.toDisplayString(i2.actionName[0]), 1)
                    ]),
                    _: 2
                  }, 1032, ["list", "disabled", "onSelctClick"]),
                  vue.createElementVNode("view", { class: "text" }, vue.toDisplayString(i2.actionName), 1)
                ], 10, ["onClick"]);
              }), 128))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "action-list-box"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.actionList, (i2) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: i2._id,
                  class: vue.normalizeClass(["action-list-item", { active: i2.active }]),
                  onClick: ($event) => $options.selectAction(i2)
                }, [
                  vue.createElementVNode("view", { class: "image" }, [
                    vue.createCommentVNode(' <van-image round src="../../static/newWorkout/action.png" /> '),
                    vue.createElementVNode("view", { class: "van-image" })
                  ]),
                  vue.createElementVNode("view", { class: "text" }, vue.toDisplayString(i2.actionName), 1)
                ], 10, ["onClick"]);
              }), 128))
            ])),
            !$data.showSaveButton ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "custom-action-button",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.addActionHandle && $options.addActionHandle(...args))
            }, [
              vue.createElementVNode("text", null, " + \u81EA\u5B9A\u4E49\u52A8\u4F5C")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ], 2),
      $data.showSaveButton ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "footer-seat"
      })) : vue.createCommentVNode("v-if", true),
      $data.showSaveButton ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "footer-button"
      }, [
        vue.createVNode(_component_van_button, {
          type: "default",
          onClick: $options.goBack
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u53D6\u6D88")
          ]),
          _: 1
        }, 8, ["onClick"]),
        vue.createVNode(_component_van_button, {
          type: "primary",
          onClick: $options.goNewWorkout
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u786E\u8BA4\u6DFB\u52A0\uFF08" + vue.toDisplayString($options.selectNum) + "\uFF09", 1)
          ]),
          _: 1
        }, 8, ["onClick"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_van_dialog, {
        show: $data.showDialog,
        "onUpdate:show": _cache[9] || (_cache[9] = ($event) => $data.showDialog = $event),
        showConfirmButton: false
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "dialog-section" }, [
            vue.createElementVNode("view", { class: "dialog-title" }, "\u662F\u5426\u786E\u8BA4\u5220\u9664"),
            vue.createElementVNode("view", { class: "dialog-content" }, "\u786E\u8BA4\u5220\u9664\u8BE5\u52A8\u4F5C\u5417\uFF1F\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D"),
            vue.createElementVNode("view", { class: "dialog-btn-box" }, [
              vue.createVNode(_component_van_button, {
                type: "default",
                onClick: _cache[7] || (_cache[7] = ($event) => $data.showDialog = false)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("\u53D6\u6D88")
                ]),
                _: 1
              }),
              vue.createVNode(_component_van_button, {
                type: "primary",
                onClick: _cache[8] || (_cache[8] = ($event) => $data.showDialog = false)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("\u786E\u8BA4")
                ]),
                _: 1
              })
            ])
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ]);
  }
  var PagesActionLibraryIndex = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/actionLibrary/index.vue"]]);
  const actionLibrary = yn.importObject("actionLibrary");
  const _sfc_main$b = {
    data() {
      return {
        show: false,
        actionName: null,
        actionTypeList: [
          {
            type: 0,
            title: "\u529B\u91CF\u8BAD\u7EC3",
            des: "\u529B\u91CF\u8BAD\u7EC3\u7684\u7C7B\u578B\uFF0C\u53EF\u4EE5\u4E3A\u81EA\u5B9A\u4E49\u52A8\u4F5C\u63D0\u4F9B\u8BB0\u5F55\u6B21\u6570\u548C\u91CD\u91CF\uFF0C\u5176\u4E2D\u91CD\u91CF\u7684\u5355\u4F4D\u53EA\u80FD\u4E3A\u516C\u65A4\uFF08kg\uFF09\u548C\u78C5\uFF08lbs\uFF09",
            active: false
          },
          {
            type: 1,
            title: "\u6709\u6C27\u8BAD\u7EC3",
            des: "\u6709\u6C27\u8BAD\u7EC3\u6709\u591A\u79CD\u8BB0\u5F55\u5F62\u5F0F\uFF0C\u7528\u6237\u53EF\u4EE5\u81EA\u884C\u9009\u62E9\u591A\u79CD\u8BB0\u5F55\u7EC4\u5408\u8FDB\u884C\u642D\u914D",
            active: false
          },
          {
            type: 2,
            title: "\u4EC5\u9700\u8981\u586B\u5199\u6B21\u6570",
            des: "\u6709\u4E9B\u52A8\u4F5C\u65E2\u4E0D\u4F1A\u8D1F\u91CD\uFF0C\u4E5F\u4E0D\u9700\u8981\u91CD\u7269\uFF0C\u6B64\u65F6\u4F60\u53EF\u4EE5\u9009\u62E9\u8FD9\u79CD\u8BB0\u5F55\u65B9\u5F0F",
            active: false
          },
          {
            type: 3,
            title: "\u4EC5\u8BB0\u5F55\u65F6\u95F4",
            des: "\u6709\u4E9B\u52A8\u4F5C\u4F60\u53EA\u60F3\u8BB0\u5F55\u65F6\u95F4\u7684\uFF0C\u9009\u62E9\u6B64\u7C7B\u8BB0\u5F55\u5F62\u5F0F\u4F60\u53EF\u4EE5\u81EA\u884C\u9009\u62E9\u7528\u79D2\u8868\u8FD8\u662F\u8BA1\u65F6\u5668",
            active: false
          },
          {
            type: 4,
            title: "\u81EA\u91CD\u8BAD\u7EC3",
            des: "\u81EA\u91CD\u52A8\u4F5C\u3001\u81EA\u52A8\u8D1F\u91CD\u52A8\u4F5C\uFF0C\u90FD\u9002\u5408\u8FD9\u79CD\u8BAD\u7EC3\u7C7B\u578B\u3002\u5982\u679C\u4F60\u4E0D\u8D1F\u91CD\uFF0C\u90A3\u4E48\u4F60\u53EF\u4EE5\u53EA\u586B\u5199\u6B21\u6570\uFF1B\u5982\u679C\u8D1F\u91CD\uFF0C\u90A3\u4E48\u53EF\u4EE5\u586B\u5199\u9644\u52A0\u7684\u91CD\u91CF",
            active: false
          },
          {
            type: 5,
            title: "\u81EA\u91CD\u8F85\u52A9",
            des: "\u4F8B\u5982\u8F85\u52A9\u5F15\u4F53\u5411\u4E0A\u3001\u8F85\u52A9\u81C2\u5C48\u4F38\u7B49\u7B49\u9879\u76EE\uFF0C\u9700\u8981\u7528\u5230\u8F85\u52A9\u91CD\u91CF\u7684\u52A8\u4F5C\uFF0C\u9002\u5408\u8FD9\u79CD\u7C7B\u578B\u3002\u8FD9\u79CD\u7C7B\u578B\u53EF\u4EE5\u81EA\u884C\u8BBE\u7F6E\u4F53\u91CD\u3002",
            active: false
          },
          {
            type: 6,
            title: "\u62C9\u4F38",
            des: "\u62C9\u4F38\u52A8\u4F5C\u65E0\u9700\u8BB0\u5F55\u4EFB\u4F55\u6570\u636E",
            active: false
          }
        ],
        actionType: ""
      };
    },
    onLoad: function(option) {
      formatAppLog("log", "at pages/addAction/index.vue:76", option);
      this.type = option.type;
      this.actionClass = option.actionClass;
    },
    methods: {
      actionTypeListSelect(child) {
        this.actionTypeList.forEach((item) => {
          item.active = false;
        });
        child.active = true;
        this.actionType = child.type;
      },
      onClickLeft() {
        uni.switchTab({
          url: "/pages/actionLibrary/index"
        });
      },
      async saveAction() {
        const res = await actionLibrary.addAction({
          type: this.type,
          actionClass: this.actionClass,
          actionName: this.actionName,
          actionType: this.actionType
        });
        this.onClickLeft();
        formatAppLog("log", "at pages/addAction/index.vue:101", res, 8888);
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_nav_bar = vue.resolveComponent("van-nav-bar");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_cell = vue.resolveComponent("van-cell");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_action_sheet = vue.resolveComponent("van-action-sheet");
    return vue.openBlock(), vue.createElementBlock("view", { class: "add-action" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createVNode(_component_van_nav_bar, {
        title: "\u65B0\u589E\u52A8\u4F5C",
        "left-text": "",
        "left-arrow": "",
        onClickLeft: $options.onClickLeft
      }, null, 8, ["onClickLeft"]),
      vue.createElementVNode("view", { class: "form" }, [
        vue.createVNode(_component_van_field, {
          class: "uni-input",
          modelValue: $data.actionName,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.actionName = $event),
          placeholder: "\u8BF7\u8F93\u5165\u52A8\u4F5C\u540D\u79F0"
        }, null, 8, ["modelValue"]),
        vue.createVNode(_component_van_cell, {
          "is-link": "",
          title: "\u52A8\u4F5C\u7C7B\u578B",
          value: $data.actionType,
          onClick: _cache[1] || (_cache[1] = ($event) => $data.show = true)
        }, null, 8, ["value"])
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createVNode(_component_van_button, {
          type: "primary",
          block: "",
          onClick: $options.saveAction
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u4FDD\u5B58")
          ]),
          _: 1
        }, 8, ["onClick"])
      ]),
      vue.createVNode(_component_van_action_sheet, {
        show: $data.show,
        "onUpdate:show": _cache[2] || (_cache[2] = ($event) => $data.show = $event),
        title: "\u9009\u62E9\u52A8\u4F5C\u7C7B\u578B"
      }, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.actionTypeList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["action-type-item", { active: item.active }]),
              onClick: ($event) => $options.actionTypeListSelect(item)
            }, [
              vue.createElementVNode("view", { class: "title" }, vue.toDisplayString(item.title), 1),
              vue.createElementVNode("view", { class: "des" }, vue.toDisplayString(item.des), 1)
            ], 10, ["onClick"]);
          }), 128))
        ]),
        _: 1
      }, 8, ["show"])
    ]);
  }
  var PagesAddActionIndex = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/addAction/index.vue"]]);
  const train$2 = yn.importObject("train");
  const _sfc_main$a = {
    components: {
      popover
    },
    data() {
      return {
        workoutName: null,
        actionList: [],
        actions: [
          { text: "\u5220\u9664\u52A8\u4F5C\u9879" }
        ],
        traineeNo: null,
        showFinishDialog: false,
        showDeleteDialog: false,
        isNoOldInfo: false
      };
    },
    onLoad: function(option) {
      if (option.traineeNo) {
        this.traineeNo = option.traineeNo;
        this.trainDate = option.trainDate || this.getCurTimestamp();
        this.getOldInfo();
      }
    },
    onShow() {
      try {
        const oldTrainInfoStr = uni.getStorageSync("oldTrainInfo");
        if (oldTrainInfoStr) {
          const oldTrainInfo = JSON.parse(oldTrainInfoStr);
          this.actionList = oldTrainInfo.actionList;
          this.workoutName = oldTrainInfo.workoutName;
          this.traineeNo = oldTrainInfo.traineeNo;
          this.isNoOldInfo = oldTrainInfo.isNoOldInfo;
          this.trainDate = oldTrainInfo.trainDate;
        }
        const actionListStr = uni.getStorageSync("actionList");
        if (actionListStr) {
          const list = JSON.parse(actionListStr);
          const tempList = list.map((item) => {
            return {
              type: item.actionType,
              actionName: item.actionName,
              load: 0,
              times: 0,
              mileage: 0,
              frequency: 0,
              weight: null,
              groupList: []
            };
          });
          this.actionList.push(...tempList);
        }
      } catch (e) {
      }
    },
    methods: {
      async getOldInfo() {
        const res = await train$2.getTrainList({ traineeNo: this.traineeNo, trainDate: this.trainDate });
        if (res.data && res.data.length > 0) {
          const { trainContent, traineeTitle } = res.data[0];
          this.workoutName = traineeTitle;
          this.actionList = JSON.parse(trainContent);
          this.isNoOldInfo = true;
        } else {
          this.isNoOldInfo = false;
        }
      },
      addActionHandle() {
        uni.setStorageSync("actionLibraryType", "select");
        uni.setStorageSync("oldTrainInfo", JSON.stringify({
          workoutName: this.workoutName,
          traineeNo: this.traineeNo,
          actionList: this.actionList,
          isNoOldInfo: this.isNoOldInfo,
          trainDate: this.trainDate
        }));
        uni.setStorageSync("traineeNo", this.traineeNo);
        uni.switchTab({
          url: "/pages/actionLibrary/index"
        });
      },
      deleteActionHandle(index) {
        this.actionList.splice(index, 1);
      },
      deleteProjectItem(list, index) {
        list.splice(index, 1);
      },
      addProjectItem(list) {
        list.push({
          kg: 0,
          km: 0,
          time: 0,
          hour: 0,
          minute: 0,
          second: 0,
          active: false
        });
      },
      async finish() {
        const params = {
          traineeNo: this.traineeNo,
          trainDate: this.trainDate,
          traineeTitle: this.workoutName,
          trainContent: JSON.stringify(this.actionList)
        };
        if (this.isNoOldInfo) {
          await train$2.updateTrainInfo(params);
        } else {
          await train$2.addTrainInfo(params);
        }
        uni.removeStorageSync("actionList");
        uni.removeStorageSync("oldTrainInfo");
        uni.removeStorageSync("traineeNo");
        uni.switchTab({ url: "/pages/myMebers/myMebers" });
      },
      async deleteHandle() {
        const params = {
          traineeNo: this.traineeNo,
          trainDate: this.trainDate
        };
        if (this.isNoOldInfo) {
          await train$2.deleteTrainInfo(params);
        }
        uni.removeStorageSync("actionList");
        uni.removeStorageSync("oldTrainInfo");
        uni.removeStorageSync("traineeNo");
        uni.switchTab({ url: "/pages/myMebers/myMebers" });
      },
      getCurTimestamp() {
        const formater = (temp) => {
          if (temp < 10) {
            return "0" + temp;
          } else {
            return temp;
          }
        };
        const d2 = new Date();
        const year = d2.getFullYear();
        const month = formater(d2.getMonth() + 1);
        const date = formater(d2.getDate());
        return [year, month, date].join("-");
      },
      technicalData() {
        this.actionList.forEach((item) => {
          if (item.type === 0) {
            item.load = item.groupList.reduce(function(prev, cur) {
              if (!cur.kg) {
                cur.kg = 0;
              }
              return cur.active ? +cur.kg + +prev : prev;
            }, 0);
            item.frequency = item.groupList.reduce(function(prev, cur) {
              if (!cur.time) {
                cur.time = 0;
              }
              return cur.active ? +cur.time + +prev : prev;
            }, 0);
          } else if (item.type === 1) {
            item.mileage = item.groupList.reduce(function(prev, cur) {
              if (!cur.km) {
                cur.km = 0;
              }
              return +cur.km + +prev;
            }, 0);
            item.times = item.groupList.reduce(function(prev, cur) {
              if (!cur.hour) {
                cur.hour = 0;
              }
              if (!cur.minute) {
                cur.minute = 0;
              }
              if (!cur.second) {
                cur.second = 0;
              }
              return +cur.hour * 60 * 60 + +cur.minute * 60 + +cur.second + +prev;
            }, 0);
          } else if (item.type === 2) {
            item.frequency = item.groupList.reduce(function(prev, cur) {
              if (!cur.time) {
                cur.time = 0;
              }
              return cur.active ? +cur.time + +prev : prev;
            }, 0);
          } else if (item.type === 3) {
            item.times = item.groupList.reduce(function(prev, cur) {
              if (!cur.hour) {
                cur.hour = 0;
              }
              if (!cur.minute) {
                cur.minute = 0;
              }
              if (!cur.second) {
                cur.second = 0;
              }
              return +cur.hour * 60 * 60 + +cur.minute * 60 + +cur.second + +prev;
            }, 0);
          } else if (item.type === 4) {
            item.load = item.groupList.reduce(function(prev, cur) {
              if (!cur.kg) {
                cur.kg = 0;
              }
              return cur.active ? +cur.kg + +prev : prev;
            }, 0);
            item.frequency = item.groupList.reduce(function(prev, cur) {
              if (!cur.time) {
                cur.time = 0;
              }
              return cur.active ? +cur.time + +prev : prev;
            }, 0);
          } else if (item.type === 5) {
            item.load = item.groupList.reduce(function(prev, cur) {
              if (!cur.kg) {
                cur.kg = 0;
              }
              return cur.active ? +cur.kg + +prev : prev;
            }, 0);
            if (item.weight) {
              item.load = item.load + +item.weight;
            }
            item.frequency = item.groupList.reduce(function(prev, cur) {
              if (!cur.time) {
                cur.time = 0;
              }
              return cur.active ? +cur.time + +prev : prev;
            }, 0);
          } else if (item.type === 6) {
            item.times = item.groupList.reduce(function(prev, cur) {
              if (!cur.hour) {
                cur.hour = 0;
              }
              if (!cur.minute) {
                cur.minute = 0;
              }
              if (!cur.second) {
                cur.second = 0;
              }
              return +cur.hour * 60 * 60 + +cur.minute * 60 + +cur.second + +prev;
            }, 0);
          }
        });
      },
      formaterTimes(times2, type = 3) {
        const hour = Math.floor(times2 / 3600);
        const minute = Math.floor((times2 - hour * 3600) / 60);
        const second = times2 - hour * 3600 - minute * 60;
        return type === 3 ? hour + "\u65F6" + minute + "\u5206" + second + "\u79D2" : hour + "\u65F6" + minute + "\u5206";
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_image = vue.resolveComponent("van-image");
    const _component_popover = vue.resolveComponent("popover");
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_dialog = vue.resolveComponent("van-dialog");
    return vue.openBlock(), vue.createElementBlock("view", { class: "new-workout" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "title" }, "\u65B0\u5EFA\u8BAD\u7EC3"),
        vue.createVNode(_component_van_button, {
          class: "btn",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.showFinishDialog = true)
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u5B8C\u6210")
          ]),
          _: 1
        })
      ]),
      vue.createElementVNode("view", { class: "workout-title" }, [
        vue.createVNode(_component_van_field, {
          modelValue: $data.workoutName,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.workoutName = $event),
          placeholder: "\u8BF7\u8F93\u5165\u8BAD\u7EC3\u540D\u79F0"
        }, null, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "action-list" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.actionList, (i2, ix) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: ix,
            class: "action-type-box"
          }, [
            i2.type === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString(i2.load) + "kg", 1),
                    vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(i2.frequency) + "\u6B21", 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "kg" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.kg,
                        "onUpdate:modelValue": ($event) => item.kg = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "kg")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.time,
                        "onUpdate:modelValue": ($event) => item.time = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "\u6B21")
                    ]),
                    vue.createElementVNode("view", {
                      class: "yes",
                      onClick: ($event) => (item.active = !item.active, $options.technicalData())
                    }, [
                      vue.createVNode(_component_van_icon, { name: "success" })
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => $options.addProjectItem(i2.groupList)
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            i2.type === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u603B\u91CC\u7A0B\uFF1A" + vue.toDisplayString(i2.mileage) + "km", 1),
                    vue.createElementVNode("text", null, "\u7528\u65F6\uFF1A" + vue.toDisplayString($options.formaterTimes(i2.times, 2)), 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "kg" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.km,
                        "onUpdate:modelValue": ($event) => item.km = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "km")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.hour,
                        "onUpdate:modelValue": ($event) => item.hour = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u65F6")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.minute,
                        "onUpdate:modelValue": ($event) => item.minute = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u5206")
                    ]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => $options.addProjectItem(i2.groupList)
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            i2.type === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(i2.frequency) + "\u6B21", 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.time,
                        "onUpdate:modelValue": ($event) => item.time = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "\u6B21")
                    ]),
                    vue.createElementVNode("view", {
                      class: "yes",
                      onClick: ($event) => (item.active = !item.active, $options.technicalData())
                    }, [
                      vue.createVNode(_component_van_icon, { name: "success" })
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => ($options.addProjectItem(i2.groupList), $options.technicalData())
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            i2.type === 3 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 3,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u7528\u65F6\uFF1A" + vue.toDisplayString($options.formaterTimes(i2.times)), 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.hour,
                        "onUpdate:modelValue": ($event) => item.hour = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u65F6")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.minute,
                        "onUpdate:modelValue": ($event) => item.minute = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u5206")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.second,
                        "onUpdate:modelValue": ($event) => item.second = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u79D2")
                    ]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => $options.addProjectItem(i2.groupList)
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            i2.type === 4 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 4,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString(i2.load) + "kg", 1),
                    vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(i2.frequency) + "\u6B21", 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "kg" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.kg,
                        "onUpdate:modelValue": ($event) => item.kg = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "kg")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.time,
                        "onUpdate:modelValue": ($event) => item.time = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "\u6B21")
                    ]),
                    vue.createElementVNode("view", {
                      class: "yes",
                      onClick: ($event) => (item.active = !item.active, $options.technicalData())
                    }, [
                      vue.createVNode(_component_van_icon, { name: "success" })
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => $options.addProjectItem(i2.groupList)
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            i2.type === 5 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 5,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString(i2.load) + "kg", 1),
                    vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(i2.frequency) + "\u6B21", 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "weight" }, [
                vue.createVNode(_component_van_field, {
                  modelValue: i2.weight,
                  "onUpdate:modelValue": ($event) => i2.weight = $event,
                  placeholder: "\u8BF7\u5148\u8BBE\u7F6E\u5F53\u524D\u4F53\u91CD",
                  type: "digit",
                  onBlur: $options.technicalData
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "kg" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.kg,
                        "onUpdate:modelValue": ($event) => item.kg = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "kg")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.time,
                        "onUpdate:modelValue": ($event) => item.time = $event,
                        placeholder: "",
                        type: "digit",
                        disabled: item.active
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      vue.createElementVNode("text", null, "\u6B21")
                    ]),
                    vue.createElementVNode("view", {
                      class: "yes",
                      onClick: ($event) => (item.active = !item.active, $options.technicalData())
                    }, [
                      vue.createVNode(_component_van_icon, { name: "success" })
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => $options.addProjectItem(i2.groupList)
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            i2.type === 6 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 6,
              class: "action-tiem"
            }, [
              vue.createElementVNode("view", { class: "action-tiem-header" }, [
                vue.createElementVNode("view", { class: "img" }, [
                  vue.createVNode(_component_van_image, {
                    round: "",
                    src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "des-info" }, [
                  vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(i2.actionName), 1),
                  vue.createElementVNode("view", { class: "info-text" }, [
                    vue.createElementVNode("text", null, "\u603B\u7528\u65F6\uFF1A" + vue.toDisplayString($options.formaterTimes(i2.times)), 1)
                  ])
                ]),
                vue.createVNode(_component_popover, {
                  class: "config",
                  list: $data.actions,
                  position: "right",
                  mode: "click"
                }, {
                  item: vue.withCtx(({ item }) => [
                    item.text === "\u5220\u9664\u52A8\u4F5C\u9879" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      style: { "color": "#F04242" },
                      onClick: ($event) => $options.deleteActionHandle(ix)
                    }, vue.toDisplayString(item.text), 9, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, vue.toDisplayString(item.text), 1))
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_image, {
                      class: "img",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
                    })
                  ]),
                  _: 2
                }, 1032, ["list"])
              ]),
              vue.createElementVNode("view", { class: "action-tiem-des" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(i2.groupList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["project-item", { active: item.active }])
                  }, [
                    vue.createElementVNode("view", { class: "index" }, [
                      vue.createElementVNode("text", null, vue.toDisplayString(index + 1), 1)
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.hour,
                        "onUpdate:modelValue": ($event) => item.hour = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u65F6")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.minute,
                        "onUpdate:modelValue": ($event) => item.minute = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u5206")
                    ]),
                    vue.createElementVNode("view", { class: "time" }, [
                      vue.createVNode(_component_van_field, {
                        modelValue: item.second,
                        "onUpdate:modelValue": ($event) => item.second = $event,
                        placeholder: "",
                        type: "digit",
                        onBlur: $options.technicalData
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur"]),
                      vue.createElementVNode("text", null, "\u79D2")
                    ]),
                    vue.createElementVNode("view", { class: "delete" }, [
                      vue.createVNode(_component_van_image, {
                        class: "img",
                        src: "../../static/newWorkout/trashcan.png",
                        onClick: ($event) => ($options.deleteProjectItem(i2.groupList, index), $options.technicalData())
                      }, null, 8, ["onClick"])
                    ])
                  ], 2);
                }), 128)),
                vue.createElementVNode("view", {
                  class: "add-project-item",
                  onClick: ($event) => $options.addProjectItem(i2.groupList)
                }, "+ \u65B0\u589E\u4E00\u7EC4", 8, ["onClick"])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]);
        }), 128))
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createVNode(_component_van_button, {
          class: "delete",
          onClick: _cache[2] || (_cache[2] = ($event) => $data.showDeleteDialog = true)
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_image, {
              class: "img",
              src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/9b0ae196-e026-4b57-9ebc-eb4ce7726b87.png"
            })
          ]),
          _: 1
        }),
        vue.createVNode(_component_van_button, {
          class: "add",
          onClick: $options.addActionHandle
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("+ \u6DFB\u52A0\u52A8\u4F5C")
          ]),
          _: 1
        }, 8, ["onClick"])
      ]),
      vue.createVNode(_component_van_dialog, {
        class: "finish-dialog",
        show: $data.showFinishDialog,
        "onUpdate:show": _cache[4] || (_cache[4] = ($event) => $data.showFinishDialog = $event),
        showConfirmButton: false
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "first-level-title" }, "\u5B8C\u6210\u8BAD\u7EC3"),
          vue.createElementVNode("view", { class: "second-level-title" }, "\u662F\u5426\u5DF2\u7ECF\u5B8C\u6210\u8BAD\u7EC3\u4E86"),
          vue.createElementVNode("view", { class: "botton-box" }, [
            vue.createVNode(_component_van_button, {
              class: "finish",
              block: "",
              onClick: $options.finish
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u786E\u8BA4\u5B8C\u6210")
              ]),
              _: 1
            }, 8, ["onClick"]),
            vue.createVNode(_component_van_button, {
              block: "",
              onClick: _cache[3] || (_cache[3] = ($event) => $data.showFinishDialog = false)
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u53D6\u6D88")
              ]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      vue.createVNode(_component_van_dialog, {
        class: "delete-dialog",
        show: $data.showDeleteDialog,
        "onUpdate:show": _cache[6] || (_cache[6] = ($event) => $data.showDeleteDialog = $event),
        showConfirmButton: false
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "first-level-title" }, "\u5220\u9664\u8BAD\u7EC3"),
          vue.createElementVNode("view", { class: "second-level-title" }, "\u662F\u5426\u5220\u9664\u8BAD\u7EC3\uFF0C\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D"),
          vue.createElementVNode("view", { class: "botton-box" }, [
            vue.createVNode(_component_van_button, {
              class: "delete",
              block: "",
              onClick: $options.deleteHandle
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u786E\u8BA4\u5220\u9664")
              ]),
              _: 1
            }, 8, ["onClick"]),
            vue.createVNode(_component_van_button, {
              block: "",
              onClick: _cache[5] || (_cache[5] = ($event) => $data.showDeleteDialog = false)
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u53D6\u6D88")
              ]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ]);
  }
  var PagesNewWorkoutNewWorkout = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/newWorkout/newWorkout.vue"]]);
  const train$1 = yn.importObject("train");
  const _sfc_main$9 = {
    data() {
      return {
        trainListInfo: {},
        trainDate: null,
        memberName: ""
      };
    },
    onLoad: function(option) {
      if (option.traineeNo) {
        this.traineeNo = option.traineeNo;
        this.memberName = option.memberName;
        this.getTrainList();
      }
    },
    methods: {
      async getTrainList() {
        const res = await train$1.getTrainList({ traineeNo: this.traineeNo });
        if (res.data && res.data.length > 0) {
          const trainListInfo = {};
          res.data.forEach((item) => {
            trainListInfo[item.trainDate] = item.traineeTitle;
          });
          this.trainListInfo = trainListInfo;
        }
      },
      onClickLeft() {
        uni.switchTab({
          url: "/pages/myMebers/myMebers"
        });
      },
      addWorkout() {
        uni.navigateTo({
          url: `/pages/newWorkout/newWorkout?traineeNo=${this.traineeNo}&trainDate=${this.trainDate}`
        });
      },
      sharePage(day) {
        uni.navigateTo({
          url: `/pages/trainingRecordDetail/trainingRecordDetail?traineeNo=${this.traineeNo}&trainDate=${this.getCurTimestamp(day.date)}`
        });
      },
      getCurTimestamp(val) {
        const formater = (temp) => {
          if (temp < 10) {
            return "0" + temp;
          } else {
            return temp;
          }
        };
        const d2 = new Date(val);
        const year = d2.getFullYear();
        const month = formater(d2.getMonth() + 1);
        const date = formater(d2.getDate());
        return [year, month, date].join("-");
      },
      getTrainTitle(day) {
        const key = this.getCurTimestamp(day.date);
        return this.trainListInfo[key] || "";
      },
      onConfirm(val) {
        if (val) {
          this.trainDate = this.getCurTimestamp(val);
        }
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_nav_bar = vue.resolveComponent("van-nav-bar");
    const _component_van_calendar = vue.resolveComponent("van-calendar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "training-record" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createVNode(_component_van_nav_bar, {
        title: $data.memberName,
        "left-text": "\u8FD4\u56DE\u4E3B\u9875",
        "left-arrow": "",
        onClickLeft: $options.onClickLeft
      }, null, 8, ["title", "onClickLeft"]),
      vue.createElementVNode("view", { class: "calendar" }, [
        vue.createVNode(_component_van_calendar, {
          title: "\u8BAD\u7EC3\u8BB0\u5F55",
          "show-mark": false,
          poppable: false,
          "show-confirm": false,
          onConfirm: $options.onConfirm
        }, {
          "bottom-info": vue.withCtx((day) => [
            vue.withDirectives(vue.createElementVNode("view", {
              class: "train-title",
              onClick: vue.withModifiers(($event) => $options.sharePage(day), ["stop"])
            }, vue.toDisplayString($options.getTrainTitle(day)), 9, ["onClick"]), [
              [vue.vShow, $options.getTrainTitle(day)]
            ])
          ]),
          _: 1
        }, 8, ["onConfirm"])
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createElementVNode("view", {
          class: "add-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.addWorkout && $options.addWorkout(...args))
        })
      ])
    ]);
  }
  var PagesTrainingRecordTrainingRecord = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/trainingRecord/trainingRecord.vue"]]);
  var block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("canvasImage");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["canvasImage"] = "19043a88";
  };
  const train = yn.importObject("train");
  const _sfc_main$8 = {
    data() {
      return {
        showShare: false,
        options: [
          { name: "\u5206\u4EAB\u5230\u5FAE\u4FE1", icon: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/23704d74-641b-4a8e-9ced-f393c631667a.png" },
          { name: "\u5206\u4EAB\u5230\u670B\u53CB\u5708", icon: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/4be11f14-035d-47f0-8c5d-f147b494246b.png" },
          { name: "\u4FDD\u5B58\u5230\u76F8\u518C", icon: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/c5edf505-9026-4d72-a16c-3ea5c8e4304c.png" }
        ],
        traineeTitle: "",
        trainDate: "",
        sumLoad: 0,
        trainInfoList: [],
        base64: null,
        url: null
      };
    },
    onLoad: function(option) {
      if (option.traineeNo) {
        this.traineeNo = option.traineeNo;
        this.trainDate = option.trainDate;
        this.getTrainInfo();
      }
    },
    methods: {
      async getTrainInfo() {
        const res = await train.getTrainList({ traineeNo: this.traineeNo, trainDate: this.trainDate });
        if (res.data && res.data.length > 0) {
          const { trainContent, traineeTitle } = res.data[0];
          this.traineeTitle = traineeTitle;
          this.trainInfoList = JSON.parse(trainContent);
          this.sumLoad = this.trainInfoList.reduce(function(prev, cur) {
            return +cur.load + +prev;
          }, 0);
        }
      },
      onClickLeft() {
        uni.navigateBack();
      },
      onSelect(option) {
        this.showShare = false;
        formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:268", option, 888);
        this.generateImage(() => {
          formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:270", option, 88);
          if (option.name === "\u4FDD\u5B58\u5230\u76F8\u518C") {
            this.downloadFile();
          } else {
            this.uploadImage((url) => {
              if (option.name === "\u5206\u4EAB\u5230\u5FAE\u4FE1") {
                uni.share({
                  provider: "weixin",
                  scene: "WXSceneSession",
                  type: 2,
                  imageUrl: url,
                  success: function(res) {
                    formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:282", "success:" + JSON.stringify(res));
                  },
                  fail: function(err) {
                    formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:285", "fail:" + JSON.stringify(err));
                  }
                });
              } else if (option.name === "\u5206\u4EAB\u5230\u670B\u53CB\u5708") {
                uni.share({
                  provider: "weixin",
                  scene: "WXSceneTimeline",
                  type: 2,
                  imageUrl: url,
                  success: function(res) {
                    formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:295", "success:" + JSON.stringify(res));
                  },
                  fail: function(err) {
                    formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:298", "fail:" + JSON.stringify(err));
                  }
                });
              }
            });
          }
        });
      },
      formaterTimes(times2, type = 3) {
        const hour = Math.floor(times2 / 3600);
        const minute = Math.floor((times2 - hour * 3600) / 60);
        const second = times2 - hour * 3600 - minute * 60;
        return type === 3 ? hour + "\u65F6" + minute + "\u5206" + second + "\u79D2" : hour + "\u65F6" + minute + "\u5206";
      },
      getMonthDay() {
        const formater = (temp) => {
          if (temp < 10) {
            return "0" + temp;
          } else {
            return temp;
          }
        };
        const d2 = new Date();
        d2.getFullYear();
        const month = formater(d2.getMonth() + 1);
        const date = formater(d2.getDate());
        return month + "." + date;
      },
      getweekday(date) {
        const weekArray = new Array("\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D");
        const week = weekArray[new Date(date).getDay()];
        return week;
      },
      base64ToFile(data) {
        const binary = atob(data.split(",")[1]);
        const mime = data.split(",")[0].match(/:(.*?);/)[1];
        let array = [];
        for (let i2 = 0; i2 < binary.length; i2++) {
          array.push(binary.charCodeAt(i2));
        }
        const fileData = new Blob([new Uint8Array(array)], { type: mime });
        const file = new File([fileData], `${new Date().getTime()}.png`, { type: mime });
        return file;
      },
      async uploadImage(callback) {
        const file = this.base64ToFile(this.base64);
        const url = URL.createObjectURL(file);
        const result = await yn.uploadFile({
          cloudPath: Date.now() + "-share.png",
          filePath: url
        });
        this.url = result.fileID;
        callback && callback(result.fileID);
        formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:351", "uploadImage", result);
      },
      downloadFile() {
        const file = this.base64ToFile(this.base64);
        const url = URL.createObjectURL(file);
        uni.saveImageToPhotosAlbum({
          filePath: url,
          success: function() {
            formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:359", "\u4FDD\u5B58\u6210\u529F\uFF01");
          }
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_image = vue.resolveComponent("van-image");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_share_sheet = vue.resolveComponent("van-share-sheet");
    return vue.openBlock(), vue.createElementBlock("view", { class: "training-record-detail" }, [
      vue.createElementVNode("view", {
        class: "arrow-left",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClickLeft && $options.onClickLeft(...args))
      }, [
        vue.createVNode(_component_van_icon, { name: "arrow-left" })
      ]),
      vue.createElementVNode("view", { id: "training-detail" }, [
        vue.createElementVNode("view", { class: "status_bar" }, [
          vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
        ]),
        vue.createElementVNode("view", { class: "backgroud-img" }, [
          vue.createVNode(_component_van_image, { src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/6b1a6145-faf2-4eb1-a710-4e41ff2ca19b.png" })
        ]),
        vue.createElementVNode("view", { class: "first-title-times" }, [
          vue.createElementVNode("view", { class: "title" }, vue.toDisplayString($data.traineeTitle), 1),
          vue.createElementVNode("view", { class: "times" }, vue.toDisplayString($options.getMonthDay($data.trainDate)), 1)
        ]),
        vue.createElementVNode("view", { class: "second-title-day" }, [
          vue.createElementVNode("view", { class: "title" }, "\u603B\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString($data.sumLoad) + "kg", 1),
          vue.createElementVNode("view", { class: "day" }, "\u661F\u671F" + vue.toDisplayString($options.getweekday($data.trainDate)), 1)
        ]),
        vue.createElementVNode("view", { class: "info-list" }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.trainInfoList, (j2, jx) => {
            return vue.openBlock(), vue.createElementBlock("view", { key: jx }, [
              j2.type === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString(j2.load) + "kg", 1),
                      vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(j2.frequency) + "\u6B21", 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info" }, [
                        vue.createElementVNode("view", { class: "kg" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.kg), 1),
                          vue.createElementVNode("text", null, "kg")
                        ]),
                        vue.createElementVNode("view", { class: "x" }, " x "),
                        vue.createElementVNode("view", { class: "time" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.time), 1),
                          vue.createElementVNode("text", null, "\u6B21")
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              j2.type === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u603B\u91CC\u7A0B\uFF1A" + vue.toDisplayString(j2.mileage) + "km", 1),
                      vue.createElementVNode("text", null, "\u7528\u65F6\uFF1A" + vue.toDisplayString($options.formaterTimes(j2.times)), 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info-km" }, [
                        vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.km), 1),
                        vue.createElementVNode("text", null, "km")
                      ]),
                      vue.createElementVNode("view", { class: "data-info-time" }, [
                        vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.hour >= 10 ? i2.hour : "0" + i2.hour) + ":" + vue.toDisplayString(i2.minute >= 10 ? i2.minute : "0" + i2.minute) + ":" + vue.toDisplayString(i2.second >= 10 ? i2.second : "0" + i2.second), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              j2.type === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(j2.frequency) + "\u6B21", 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info" }, [
                        vue.createElementVNode("view", { class: "time" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.time), 1),
                          vue.createElementVNode("text", null, "\u6B21")
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              j2.type === 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u603B\u7528\u65F6\uFF1A" + vue.toDisplayString($options.formaterTimes(j2.times)), 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info" }, [
                        vue.createElementVNode("view", { class: "time" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.hour >= 10 ? i2.hour : "0" + i2.hour) + ":" + vue.toDisplayString(i2.minute >= 10 ? i2.minute : "0" + i2.minute) + ":" + vue.toDisplayString(i2.second >= 10 ? i2.second : "0" + i2.second), 1)
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              j2.type === 4 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 4,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString(j2.load) + "kg", 1),
                      vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(j2.frequency) + "\u6B21", 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info" }, [
                        vue.createElementVNode("view", { class: "kg" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.kg), 1),
                          vue.createElementVNode("text", null, "kg")
                        ]),
                        vue.createElementVNode("view", { class: "x" }, " x "),
                        vue.createElementVNode("view", { class: "time" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.time), 1),
                          vue.createElementVNode("text", null, "\u6B21")
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              j2.type === 5 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 5,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u8D1F\u8377\u91CF\uFF1A" + vue.toDisplayString(j2.load) + "kg", 1),
                      vue.createElementVNode("text", null, "\u5DF2\u5B8C\u6210\uFF1A" + vue.toDisplayString(j2.frequency) + "\u6B21", 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info" }, [
                        vue.createElementVNode("view", { class: "kg" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.kg), 1),
                          vue.createElementVNode("text", null, "kg")
                        ]),
                        vue.createElementVNode("view", { class: "x" }, " x "),
                        vue.createElementVNode("view", { class: "time" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.time), 1),
                          vue.createElementVNode("text", null, "\u6B21")
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              j2.type === 6 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 6,
                class: "info-item"
              }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createVNode(_component_van_image, {
                      round: "",
                      src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/f1ecf80b-cf75-4017-9ae2-622fe72717e9.png"
                    })
                  ]),
                  vue.createElementVNode("view", { class: "des-info" }, [
                    vue.createElementVNode("view", { class: "des-title" }, vue.toDisplayString(j2.actionName), 1),
                    vue.createElementVNode("view", { class: "info-text" }, [
                      vue.createElementVNode("text", null, "\u603B\u7528\u65F6\uFF1A" + vue.toDisplayString($options.formaterTimes(j2.times)), 1)
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "detailed-data" }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(j2.groupList, (i2, ix) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: ix,
                      class: "data-item"
                    }, [
                      vue.createElementVNode("view", { class: "index" }, vue.toDisplayString(ix + 1), 1),
                      vue.createElementVNode("view", { class: "data-info" }, [
                        vue.createElementVNode("view", { class: "time" }, [
                          vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(i2.hour >= 10 ? i2.hour : "0" + i2.hour) + ":" + vue.toDisplayString(i2.minute >= 10 ? i2.minute : "0" + i2.minute) + ":" + vue.toDisplayString(i2.second >= 10 ? i2.second : "0" + i2.second), 1)
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ]);
          }), 128))
        ])
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createVNode(_component_van_button, {
          block: "",
          onClick: _cache[1] || (_cache[1] = ($event) => $data.showShare = true)
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_icon, { name: "share-o" }),
            vue.createTextVNode("\u70AB\u8000\u4E00\u4E0B")
          ]),
          _: 1
        })
      ]),
      vue.createVNode(_component_van_share_sheet, {
        show: $data.showShare,
        "onUpdate:show": _cache[2] || (_cache[2] = ($event) => $data.showShare = $event),
        options: $data.options,
        onSelect: $options.onSelect,
        "cancel-text": ""
      }, null, 8, ["show", "options", "onSelect"]),
      vue.createCommentVNode(' <image v-if="base64" :src="base64" style="width: 100vw; height:200vh;"></image> ')
    ]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$8);
  var PagesTrainingRecordDetailTrainingRecordDetail = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/trainingRecordDetail/trainingRecordDetail.vue"]]);
  const My$2 = yn.importObject("my");
  const _sfc_main$7 = {
    data() {
      return {
        userInfo: {
          username: "",
          avatar: null,
          comment: null,
          vipLevel: null,
          vipEndDate: null
        }
      };
    },
    onShow() {
      this.getUserInfo();
    },
    methods: {
      async getUserInfo() {
        const res = await My$2.getUserInfo();
        const { avatar, username, comment, vipLevel, vipEndDate } = res.data;
        this.userInfo = {
          avatar: avatar || null,
          username: username || null,
          comment: comment || null,
          vipLevel: vipLevel || null,
          vipEndDate: vipEndDate || null
        };
        formatAppLog("log", "at pages/my/my.vue:71", res, 88888);
      },
      openCard() {
        uni.navigateTo({
          url: "/pages/openCard/openCard"
        });
      },
      setUp() {
        uni.navigateTo({
          url: "/pages/setUp/setUp"
        });
      },
      personalInfo() {
        uni.navigateTo({
          url: "/pages/personalInfo/personalInfo"
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_image = vue.resolveComponent("van-image");
    return vue.openBlock(), vue.createElementBlock("view", { class: "my" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createElementVNode("view", { class: "background" }),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: "logo",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.personalInfo && $options.personalInfo(...args))
        }, [
          vue.createVNode(_component_van_image, {
            round: "",
            src: $data.userInfo.avatar
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "edit-icon" })
        ]),
        vue.createElementVNode("view", { class: "user-name" }, [
          vue.createElementVNode("view", {
            class: vue.normalizeClass(["name", { ordinary: $data.userInfo.vipLevel === 2 }])
          }, vue.toDisplayString($data.userInfo.username), 3),
          vue.createElementVNode("view", { class: "des" }, vue.toDisplayString($data.userInfo.comment), 1)
        ]),
        vue.createElementVNode("view", {
          class: "config",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.setUp && $options.setUp(...args))
        })
      ]),
      $data.userInfo.vipLevel === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "vip-info",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.openCard && $options.openCard(...args))
      }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode("view", { class: "vip-grade" }, [
            vue.createElementVNode("view", { class: "grade-name" }, "\u91D1\u5361\u6559\u7EC3"),
            vue.createElementVNode("view", { class: "grade-status" }, "\u751F\u6548\u4E2D")
          ]),
          vue.createElementVNode("view", { class: "vip-expiration-date" }, "2023.01.20\u5230\u671F >")
        ]),
        vue.createElementVNode("view", { class: "right" })
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "vip-info ordinary",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.openCard && $options.openCard(...args))
      }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode("view", { class: "vip-grade" }, [
            vue.createElementVNode("view", { class: "grade-name" }, "\u84DD\u5361\u4F1A\u5458")
          ]),
          vue.createElementVNode("view", { class: "vip-expiration-date" }, "\u5F00\u901A\u91D1\u5361\u6559\u7EC3\uFF0C\u7545\u60F3\u591A\u9879\u7279\u6743 >")
        ]),
        vue.createElementVNode("view", { class: "right" })
      ])),
      vue.createElementVNode("view", { class: "contact-customer" }, [
        vue.createElementVNode("text", null, "\u8054\u7CFB\u5BA2\u670D")
      ])
    ]);
  }
  var PagesMyMy = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/my/my.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        show: false,
        showPayment: false
      };
    },
    methods: {
      onClickLeft() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_nav_bar = vue.resolveComponent("van-nav-bar");
    const _component_van_image = vue.resolveComponent("van-image");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_action_sheet = vue.resolveComponent("van-action-sheet");
    return vue.openBlock(), vue.createElementBlock("view", { class: "open-card" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createElementVNode("view", { class: "background" }),
      vue.createVNode(_component_van_nav_bar, {
        title: "\u5F00\u901A\u91D1\u5361\u6559\u7EC3",
        "left-text": "",
        "left-arrow": "",
        onClickLeft: $options.onClickLeft
      }, null, 8, ["onClickLeft"]),
      vue.createElementVNode("view", { class: "vip-card" }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode("view", { class: "card-name" }, "\u91D1\u5361\u6559\u7EC3"),
          vue.createElementVNode("view", { class: "card-des" }, "\u5305\u5E74\u66F4\u5212\u7B97\u54E6\uFF5E")
        ]),
        vue.createElementVNode("view", { class: "right" })
      ]),
      vue.createElementVNode("view", { class: "vip-title" }, "\u5F00\u5361\u9650\u65F6\u4F18\u60E0"),
      vue.createElementVNode("view", { class: "card-types-box" }, [
        vue.createElementVNode("view", { class: "card-types" }, [
          (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(4, (i2) => {
            return vue.createElementVNode("view", {
              key: i2,
              class: "type-item"
            }, [
              vue.createElementVNode("view", { class: "text" }, "\u8FDE\u7EED\u5305\u6708"),
              vue.createElementVNode("view", { class: "money" }, [
                vue.createTextVNode("\xA5"),
                vue.createElementVNode("text", { class: "num" }, "10")
              ]),
              vue.createElementVNode("view", { class: "des" }, "\u6B21\u6708\u7EED\u8D3920\u5143"),
              vue.createElementVNode("div", { class: "activity" }, "\u65B0\u7528\u6237\u7279\u60E0")
            ]);
          }), 64))
        ])
      ]),
      vue.createElementVNode("view", { class: "vip-title" }, "\u91D1\u5361\u4F1A\u5458\u6743\u76CA"),
      vue.createElementVNode("view", { class: "equity-list" }, [
        (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(8, (j2) => {
          return vue.createElementVNode("view", {
            key: j2,
            class: "equity-item"
          }, [
            vue.createVNode(_component_van_image, {
              class: "logo",
              src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/b46d2b80-3f88-4c7f-8891-b0747f8216ae.svg"
            }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ]);
        }), 64))
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createVNode(_component_van_button, {
          block: "",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.show = true)
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u7ACB\u5373\u5F00\u901A")
          ]),
          _: 1
        })
      ]),
      vue.createVNode(_component_van_action_sheet, {
        show: $data.show,
        "onUpdate:show": _cache[2] || (_cache[2] = ($event) => $data.show = $event)
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "vip-title" }, "\u5F00\u901A\u91D1\u5361\u6559\u7EC3"),
          vue.createElementVNode("view", { class: "card-types-box" }, [
            vue.createElementVNode("view", { class: "card-types" }, [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(4, (i2) => {
                return vue.createElementVNode("view", {
                  key: i2,
                  class: vue.normalizeClass(["type-item", { active: i2 === 1 }])
                }, [
                  vue.createElementVNode("view", { class: "text" }, "\u8FDE\u7EED\u5305\u6708"),
                  vue.createElementVNode("view", { class: "money" }, [
                    vue.createTextVNode("\xA5"),
                    vue.createElementVNode("text", { class: "num" }, "10")
                  ]),
                  vue.createElementVNode("view", { class: "des" }, "\u6B21\u6708\u7EED\u8D3920\u5143"),
                  vue.createElementVNode("div", { class: "activity" }, "\u65B0\u7528\u6237\u7279\u60E0")
                ], 2);
              }), 64))
            ])
          ]),
          vue.createElementVNode("view", { class: "open-card-btn" }, [
            vue.createVNode(_component_van_button, {
              block: "",
              onClick: _cache[1] || (_cache[1] = ($event) => ($data.show = false, $data.showPayment = true))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u7ACB\u5373\u5F00\u901A")
              ]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      vue.createVNode(_component_van_action_sheet, {
        class: "payment-action-sheet",
        show: $data.showPayment,
        "onUpdate:show": _cache[3] || (_cache[3] = ($event) => $data.showPayment = $event)
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "title" }, "\u9009\u62E9\u652F\u4ED8\u65B9\u5F0F"),
          vue.createElementVNode("view", { class: "actions" }, [
            vue.createElementVNode("view", { class: "action" }, [
              vue.createVNode(_component_van_image, {
                class: "img",
                src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/92897c24-96a3-4bb2-8fb8-44019822af77.svg"
              }),
              vue.createElementVNode("view", { class: "text" }, "\u652F\u4ED8\u5B9D")
            ]),
            vue.createElementVNode("view", { class: "action" }, [
              vue.createVNode(_component_van_image, {
                class: "img",
                src: "https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com/cloudstorage/ca311552-a492-4e14-b884-cefd7a6cb712.svg"
              }),
              vue.createElementVNode("view", { class: "text" }, "\u5FAE\u4FE1")
            ])
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ]);
  }
  var PagesOpenCardOpenCard = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/openCard/openCard.vue"]]);
  yn.importObject("login");
  const _sfc_main$5 = {
    data() {
      return {};
    },
    methods: {
      onClickLeft() {
        uni.navigateBack();
      },
      async closeAccount() {
        this.logout();
      },
      async logout() {
        uni.clearStorage();
        uni.reLaunch({
          url: "/pages/logining/logining"
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_cell = vue.resolveComponent("van-cell");
    const _component_van_button = vue.resolveComponent("van-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "set-up" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createElementVNode("view", {
        class: "arrow-left",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClickLeft && $options.onClickLeft(...args))
      }, [
        vue.createVNode(_component_van_icon, { name: "arrow-left" })
      ]),
      vue.createElementVNode("view", { class: "title" }, "\u8BBE\u7F6E"),
      vue.createElementVNode("view", { class: "form" }, [
        vue.createVNode(_component_van_cell, {
          title: "\u6CE8\u9500\u8D26\u53F7",
          "is-link": "",
          onClick: $options.closeAccount
        }, null, 8, ["onClick"])
      ]),
      vue.createVNode(_component_van_button, {
        class: "footer-btn",
        block: "",
        onClick: $options.logout
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("\u9000\u51FA\u767B\u5F55")
        ]),
        _: 1
      }, 8, ["onClick"])
    ]);
  }
  var PagesSetUpSetUp = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/setUp/setUp.vue"]]);
  const My$1 = yn.importObject("my");
  const _sfc_main$4 = {
    data() {
      return {
        show: false,
        actions: [
          { name: "\u62CD\u7167\u4E0A\u4F20" },
          { name: "\u672C\u5730\u4E0A\u4F20" }
        ],
        userInfo: {
          username: "",
          avatar: null,
          gender: null,
          comment: null
        }
      };
    },
    mounted() {
      this.getUserInfo();
    },
    methods: {
      async getUserInfo() {
        const res = await My$1.getUserInfo();
        const { avatar, username, gender, comment } = res.data;
        this.userInfo = {
          avatar: avatar || null,
          username: username || "\u7528\u6237\u540D",
          gender: gender === 0 ? "\u672A\u77E5" : gender === 1 ? "\u7537" : gender === 2 ? "\u5973" : null,
          comment
        };
        formatAppLog("log", "at pages/personalInfo/personalInfo.vue:60", res, 88888);
      },
      onClickLeft() {
        uni.switchTab({
          url: "/pages/my/my"
        });
      },
      updateSignature(type) {
        uni.navigateTo({
          url: "/pages/updateSignature/updateSignature?type=" + type
        });
      },
      selectHandle(val) {
        if (val.name === "\u62CD\u7167\u4E0A\u4F20") {
          this.uploadImage("camera");
        } else if (val.name === "\u672C\u5730\u4E0A\u4F20") {
          this.uploadImage("album");
        }
      },
      uploadImage(sourceType) {
        const success = async (res) => {
          if (res.tempFiles && res.tempFiles.length > 0) {
            const result = await yn.uploadFile({
              cloudPath: Date.now() + "-" + res.tempFiles[0].name,
              filePath: res.tempFilePaths[0]
            });
            const res1 = await My$1.updateUserInfo({
              avatar: result.fileID
            });
            this.getUserInfo();
            formatAppLog("log", "at pages/personalInfo/personalInfo.vue:91", res1);
          }
        };
        const fail = () => {
        };
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          extension: ["jpg", "jpeg", "png"],
          sourceType: [sourceType],
          success,
          fail
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_image = vue.resolveComponent("van-image");
    const _component_van_cell = vue.resolveComponent("van-cell");
    const _component_van_action_sheet = vue.resolveComponent("van-action-sheet");
    return vue.openBlock(), vue.createElementBlock("view", { class: "personal-info" }, [
      vue.createElementVNode("view", { class: "status_bar" }, [
        vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F ")
      ]),
      vue.createElementVNode("view", {
        class: "arrow-left",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClickLeft && $options.onClickLeft(...args))
      }, [
        vue.createVNode(_component_van_icon, { name: "arrow-left" })
      ]),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: "user-name",
          onClick: _cache[1] || (_cache[1] = ($event) => $options.updateSignature("username"))
        }, vue.toDisplayString($data.userInfo.username || ""), 1),
        vue.createElementVNode("view", {
          class: "user-logo",
          onClick: _cache[2] || (_cache[2] = ($event) => $data.show = true)
        }, [
          vue.createVNode(_component_van_image, {
            class: "img",
            round: "",
            src: $data.userInfo.avatar
          }, null, 8, ["src"])
        ])
      ]),
      vue.createElementVNode("view", { class: "form" }, [
        vue.createElementVNode("view", { class: "form-content" }, [
          vue.createVNode(_component_van_cell, {
            title: "\u6027\u522B",
            value: $data.userInfo.gender,
            "is-link": "",
            onClick: _cache[3] || (_cache[3] = ($event) => $options.updateSignature("gender"))
          }, null, 8, ["value"]),
          vue.createVNode(_component_van_cell, {
            title: "\u7B7E\u540D",
            value: $data.userInfo.comment,
            "is-link": "",
            onClick: _cache[4] || (_cache[4] = ($event) => $options.updateSignature("comment"))
          }, null, 8, ["value"])
        ])
      ]),
      vue.createVNode(_component_van_action_sheet, {
        show: $data.show,
        "onUpdate:show": _cache[5] || (_cache[5] = ($event) => $data.show = $event),
        actions: $data.actions,
        "cancel-text": "\u53D6\u6D88",
        "close-on-click-action": "",
        onSelect: $options.selectHandle
      }, null, 8, ["show", "actions", "onSelect"])
    ]);
  }
  var PagesPersonalInfoPersonalInfo = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/personalInfo/personalInfo.vue"]]);
  const My = yn.importObject("my");
  const _sfc_main$3 = {
    data() {
      return {
        title: "\u7B7E\u540D",
        text: null,
        genderName: null,
        showPicker: false,
        columns: [
          { name: "\u672A\u77E5", value: 0 },
          { name: "\u7537", value: 1 },
          { name: "\u5973", value: 2 }
        ]
      };
    },
    onLoad: function(option) {
      if (option.type === "username") {
        this.title = "\u7528\u6237\u540D";
      } else if (option.type === "gender") {
        this.title = "\u6027\u522B";
      } else if (option.type === "comment") {
        this.title = "\u7B7E\u540D";
      }
    },
    mounted() {
      this.getUserInfo();
    },
    methods: {
      async getUserInfo() {
        const res = await My.getUserInfo();
        const { username, gender, comment } = res.data;
        if (this.title == "\u7528\u6237\u540D") {
          this.text = username || "";
        } else if (this.title == "\u6027\u522B") {
          this.text = gender || null;
          if (gender == 0) {
            this.genderName = "\u672A\u77E5";
          } else if (gender == 1) {
            this.genderName = "\u7537";
          } else if (gender == 2) {
            this.genderName = "\u5973";
          } else {
            this.genderName = null;
          }
        } else if (this.title == "\u7B7E\u540D") {
          this.text = comment || null;
        }
        formatAppLog("log", "at pages/updateSignature/updateSignature.vue:73", res, 88888);
      },
      async updateUserInfo() {
        let key = "comment";
        if (this.title == "\u7528\u6237\u540D") {
          key = "username";
        } else if (this.title == "\u6027\u522B") {
          key = "gender";
        }
        const res = await My.updateUserInfo({ [key]: this.text });
        formatAppLog("log", "at pages/updateSignature/updateSignature.vue:83", res, 88);
        this.onClickLeft();
      },
      selectHandle(val) {
        if (val.name === "\u672A\u77E5") {
          this.text = 0;
          this.genderName = "\u672A\u77E5";
        } else if (val.name === "\u7537") {
          this.text = 1;
          this.genderName = "\u7537";
        } else if (val.name === "\u5973") {
          this.text = 2;
          this.genderName = "\u5973";
        }
      },
      onClickLeft() {
        uni.navigateTo({ url: "/pages/personalInfo/personalInfo" });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_cell_group = vue.resolveComponent("van-cell-group");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_action_sheet = vue.resolveComponent("van-action-sheet");
    return vue.openBlock(), vue.createElementBlock("view", { class: "update-signature" }, [
      vue.createElementVNode("view", {
        class: "arrow-left",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClickLeft && $options.onClickLeft(...args))
      }, [
        vue.createVNode(_component_van_icon, { name: "arrow-left" })
      ]),
      vue.createElementVNode("view", { class: "title" }, "\u4FEE\u6539" + vue.toDisplayString($data.title), 1),
      vue.createVNode(_component_van_cell_group, {
        class: "form",
        inset: ""
      }, {
        default: vue.withCtx(() => [
          $data.title === "\u6027\u522B" ? (vue.openBlock(), vue.createBlock(_component_van_field, {
            key: 0,
            class: "input",
            modelValue: $data.genderName,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.genderName = $event),
            "is-link": "",
            readonly: "",
            name: "picker",
            placeholder: "\u70B9\u51FB\u9009\u62E9\u6027\u522B",
            onClick: _cache[2] || (_cache[2] = ($event) => $data.showPicker = true)
          }, null, 8, ["modelValue"])) : (vue.openBlock(), vue.createBlock(_component_van_field, {
            key: 1,
            class: "input",
            modelValue: $data.text,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.text = $event),
            placeholder: "\u8BF7\u8F93\u5165" + $data.title
          }, null, 8, ["modelValue", "placeholder"]))
        ]),
        _: 1
      }),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createVNode(_component_van_button, {
          block: "",
          onClick: $options.updateUserInfo
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u786E\u8BA4")
          ]),
          _: 1
        }, 8, ["onClick"])
      ]),
      vue.createVNode(_component_van_action_sheet, {
        show: $data.showPicker,
        "onUpdate:show": _cache[4] || (_cache[4] = ($event) => $data.showPicker = $event),
        actions: $data.columns,
        "close-on-click-action": "",
        onSelect: $options.selectHandle
      }, null, 8, ["show", "actions", "onSelect"])
    ]);
  }
  var PagesUpdateSignatureUpdateSignature = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/updateSignature/updateSignature.vue"]]);
  const _sfc_main$2 = {
    name: "tuiSticky",
    props: {
      scrollTop: {
        type: Number
      }
    },
    watch: {
      scrollTop(newValue, oldValue) {
        this.updateStickyChange();
      }
    },
    onReady() {
      this.init();
    },
    data() {
      return {
        timer: null,
        top: 0,
        height: 0,
        holderHeight: 0,
        translateY: 0,
        isFixed: false
      };
    },
    computed: {
      transform() {
        return `translate3d(0,${this.translateY}px,0)`;
      }
    },
    methods: {
      init() {
        this.updateScrollChange();
        uni.createSelectorQuery().in(this).select(".tui-sticky-header").boundingClientRect((res) => {
          if (res) {
            formatAppLog("log", "at components/better-sticky/better-sticky.vue:55", res, 5555);
            this.holderHeight = res.height;
          }
        }).exec();
      },
      updateStickyChange() {
        const top2 = this.top;
        const height2 = this.height;
        const scrollTop = this.scrollTop;
        const delY = scrollTop - (top2 + height2);
        this.isFixed = scrollTop >= top2 && delY <= 0 ? true : false;
        this.translateY = 0;
        if (delY < 0 && -delY < this.holderHeight) {
          this.translateY = -this.holderHeight - delY;
        }
      },
      updateScrollChange() {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          const className = ".tui-sticky-class";
          const query = uni.createSelectorQuery().in(this);
          query.select(className).boundingClientRect((res) => {
            if (res) {
              this.top = res.top;
              this.height = res.height;
            }
          }).exec();
        }, 0);
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tui-sticky-class" }, [
      vue.createCommentVNode("sticky \u5BB9\u5668"),
      vue.createElementVNode("view", {
        class: vue.normalizeClass(["tui-sticky-header", [$data.isFixed === true ? "tui-sticky-fixed" : ""]]),
        style: vue.normalizeStyle({ transform: $options.transform, webkitTransform: $options.transform })
      }, [
        vue.renderSlot(_ctx.$slots, "header", {}, void 0, true)
      ], 6),
      $data.isFixed ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        style: vue.normalizeStyle({ height: $data.holderHeight + "px" })
      }, null, 4)) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode("sticky \u5BB9\u5668"),
      vue.createCommentVNode("\u5185\u5BB9"),
      vue.renderSlot(_ctx.$slots, "content", {}, void 0, true)
    ]);
  }
  var tuiSticky = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-e64837dc"], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/components/better-sticky/better-sticky.vue"]]);
  const _sfc_main$1 = {
    components: {
      tuiSticky
    },
    data() {
      return {
        scrollTop: 0
      };
    },
    methods: {
      detail(e) {
        this.tui.toast("\u8BE6\u60C5\u529F\u80FD\u5C1A\u672A\u5B8C\u5584~");
      }
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tui_sticky = vue.resolveComponent("tui-sticky");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "tips" }, [
        vue.createElementVNode("view", null, "1\u3001\u5224\u65AD\u5E73\u53F0\uFF0Cios\u53EF\u76F4\u63A5\u4F7F\u7528position: sticky"),
        vue.createElementVNode("view", null, "2\u3001\u5BF9sticky-item\u5BB9\u5668\u8FDB\u884C\u7EDD\u5BF9\u5B9A\u4F4D\uFF0C\u5E95\u90E8\u5185\u5BB9\u90E8\u5206\u4F7F\u7528\u5916\u8FB9\u8DDD\u6491\u5F00sticky-item\u9AD8\u5EA6\uFF0C\u51CF\u7F13\u9875\u9762\u6296\u52A8")
      ]),
      vue.createVNode(_component_tui_sticky, { scrollTop: $data.scrollTop }, {
        header: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "sticky-item" }, [
            vue.createElementVNode("view", { class: "date" }, "\u672C\u6708"),
            vue.createElementVNode("view", { class: "amount" }, [
              vue.createElementVNode("view", null, "\u652F\u51FA \uFFE52030.88"),
              vue.createElementVNode("view", null, "\u6536\u5165 \uFFE5230.50")
            ])
          ])
        ]),
        content: vue.withCtx(() => [
          vue.createCommentVNode("\u5185\u5BB9 start"),
          vue.createElementVNode("view", { class: "list-view" }, [
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u671D\u671D\u76C8-2019.06.03-\u6536\u76CA\u53D1\u653E"),
                  vue.createElementVNode("view", { class: "source" }, "\u7406\u8D22"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money add" }, " +0.07 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u626B\u6536\u94B1\u7801\u4ED8\u6B3E-\u7ED9\u5C0F\u77ED\u817F(2019-06.04\uFF09"),
                  vue.createElementVNode("view", { class: "source" }, "\u751F\u6D3B\u65E5\u7528"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -20190604.07 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -888.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item item-last",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u5DE5\u8D44\u6536\u5165"),
                  vue.createElementVNode("view", { class: "source" }, "\u5DE5\u8D44"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money add" }, " +66668666.00 ")
            ])
          ]),
          vue.createCommentVNode("\u5185\u5BB9 end")
        ]),
        _: 1
      }, 8, ["scrollTop"]),
      vue.createVNode(_component_tui_sticky, { scrollTop: $data.scrollTop }, {
        header: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "sticky-item" }, [
            vue.createElementVNode("view", { class: "date" }, "5\u6708"),
            vue.createElementVNode("view", { class: "amount" }, [
              vue.createElementVNode("view", null, "\u652F\u51FA \uFFE5130.88"),
              vue.createElementVNode("view", null, "\u6536\u5165 \uFFE52430.50")
            ])
          ])
        ]),
        content: vue.withCtx(() => [
          vue.createCommentVNode("\u5185\u5BB9 start"),
          vue.createElementVNode("view", { class: "list-view" }, [
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u671D\u671D\u76C8-2019.06.03-\u6536\u76CA\u53D1\u653E"),
                  vue.createElementVNode("view", { class: "source" }, "\u7406\u8D22"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money add" }, " +0.07 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u626B\u6536\u94B1\u7801\u4ED8\u6B3E-\u7ED9\u5C0F\u77ED\u817F"),
                  vue.createElementVNode("view", { class: "source" }, "\u751F\u6D3B\u65E5\u7528"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -201906.07 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -888.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item item-last",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u5DE5\u8D44\u6536\u5165"),
                  vue.createElementVNode("view", { class: "source" }, "\u5DE5\u8D44"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money add" }, " +66668666.00 ")
            ])
          ]),
          vue.createCommentVNode("\u5185\u5BB9 end")
        ]),
        _: 1
      }, 8, ["scrollTop"]),
      vue.createVNode(_component_tui_sticky, { scrollTop: $data.scrollTop }, {
        header: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "sticky-item" }, [
            vue.createElementVNode("view", { class: "date" }, "4\u6708"),
            vue.createElementVNode("view", { class: "amount" }, [
              vue.createElementVNode("view", null, "\u652F\u51FA \uFFE561300.88"),
              vue.createElementVNode("view", null, "\u6536\u5165 \uFFE52430.50")
            ])
          ])
        ]),
        content: vue.withCtx(() => [
          vue.createCommentVNode("\u5185\u5BB9"),
          vue.createElementVNode("view", { class: "list-view" }, [
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u671D\u671D\u76C8-2019.06.03-\u6536\u76CA\u53D1\u653E"),
                  vue.createElementVNode("view", { class: "source" }, "\u7406\u8D22"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money add" }, " +0.07 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u626B\u6536\u94B1\u7801\u4ED8\u6B3E-\u7ED9\u5C0F\u77ED\u817F"),
                  vue.createElementVNode("view", { class: "source" }, "\u751F\u6D3B\u65E5\u7528"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -201906.07 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "\u4ECA\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -888.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "\u6628\u5929 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -99.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "04-03 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -60.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "04-02 19:30")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -888.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u7F8E\u56E2\u70B9\u8BC4"),
                  vue.createElementVNode("view", { class: "source" }, "\u9910\u996E\u7F8E\u98DF"),
                  vue.createElementVNode("view", { class: "time" }, "04-02 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money" }, " -40.00 ")
            ]),
            vue.createElementVNode("view", {
              class: "list-item item-last",
              "hover-class": "hover",
              "hover-stay-time": 150,
              bindtap: "detail"
            }, [
              vue.createElementVNode("view", { class: "content-box" }, [
                vue.createElementVNode("view", { class: "des-box" }, [
                  vue.createElementVNode("view", { class: "tit" }, "\u5DE5\u8D44\u6536\u5165"),
                  vue.createElementVNode("view", { class: "source" }, "\u5DE5\u8D44"),
                  vue.createElementVNode("view", { class: "time" }, "04-01 09:01")
                ])
              ]),
              vue.createElementVNode("view", { class: "money add" }, " +66668666.00 ")
            ])
          ]),
          vue.createCommentVNode("\u5185\u5BB9")
        ]),
        _: 1
      }, 8, ["scrollTop"])
    ]);
  }
  var PagesDemoDemo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/pages/demo/demo.vue"]]);
  __definePage("pages/myMebers/myMebers", PagesMyMebersMyMebers);
  __definePage("pages/addMyMebers/addMyMebers", PagesAddMyMebersAddMyMebers);
  __definePage("pages/bodyAssessment/bodyAssessment", PagesBodyAssessmentBodyAssessment);
  __definePage("pages/bodyTestReport/bodyTestReport", PagesBodyTestReportBodyTestReport);
  __definePage("pages/dynamicEvaluation/dynamicEvaluation", PagesDynamicEvaluationDynamicEvaluation);
  __definePage("pages/physicalAssessment/physicalAssessment", PagesPhysicalAssessmentPhysicalAssessment);
  __definePage("pages/healthQuesson/healthQuesson", PagesHealthQuessonHealthQuesson);
  __definePage("pages/physicalFitnessAssessment/physicalFitnessAssessment", PagesPhysicalFitnessAssessmentPhysicalFitnessAssessment);
  __definePage("pages/logining/logining", PagesLoginingLogining);
  __definePage("pages/verificatioCode/verificatioCode", PagesVerificatioCodeVerificatioCode);
  __definePage("pages/personalnformation/personalnformation", PagesPersonalnformationPersonalnformation);
  __definePage("pages/actionLibrary/index", PagesActionLibraryIndex);
  __definePage("pages/addAction/index", PagesAddActionIndex);
  __definePage("pages/newWorkout/newWorkout", PagesNewWorkoutNewWorkout);
  __definePage("pages/trainingRecord/trainingRecord", PagesTrainingRecordTrainingRecord);
  __definePage("pages/trainingRecordDetail/trainingRecordDetail", PagesTrainingRecordDetailTrainingRecordDetail);
  __definePage("pages/my/my", PagesMyMy);
  __definePage("pages/openCard/openCard", PagesOpenCardOpenCard);
  __definePage("pages/setUp/setUp", PagesSetUpSetUp);
  __definePage("pages/personalInfo/personalInfo", PagesPersonalInfoPersonalInfo);
  __definePage("pages/updateSignature/updateSignature", PagesUpdateSignatureUpdateSignature);
  __definePage("pages/demo/demo", PagesDemoDemo);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:19", "onLaunch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:47", "onShow");
      let whiteRouter = [
        "/pages/logining/logining",
        "/pages/verificatioCode/verificatioCode"
      ];
      if (whiteRouter.indexOf(this.$route.fullPath) !== -1)
        ;
      else {
        formatAppLog("log", "at App.vue:54", this.$route, "\u6211\u662F\u8DEF\u7531\u540D\u79F0");
        uni.getStorage({
          key: "uni_id_token",
          success: function(res) {
            if (res.data) {
              let login = yn.importObject("login");
              login.checkToken(res.data).then((checkTokenRes) => {
                formatAppLog("log", "at App.vue:64", checkTokenRes, "token \u6362\u53D6");
              }).catch((err) => {
                formatAppLog("log", "at App.vue:67", err, "\u6211\u662F\u9519\u8BEF");
                uni.reLaunch({
                  url: "/pages/logining/logining",
                  success: (res2) => {
                  },
                  fail: () => {
                  },
                  complete: () => {
                  }
                });
                uni.clearStorage();
              });
            }
          },
          fail: function(err) {
            uni.reLaunch({
              url: "/pages/logining/logining",
              success: (res) => {
              },
              fail: () => {
              },
              complete: () => {
              }
            });
          }
        });
      }
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:94", "onHide");
    }
  };
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/CaiZhenYu/Desktop/mobile/bodybuilding-app/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(stdin_default);
    return { app };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
