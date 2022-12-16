if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
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
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$B = {
    name: "bgTheamCompontent",
    props: ["theamType"],
    data() {
      return {};
    }
  };
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
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
  const BgTheamCompontent = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["__scopeId", "data-v-826f61a7"], ["__file", "D:/studyUninApp/bodybuilding-app/components/bgTheamCompontent/bgTheamCompontent.vue"]]);
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
      let tokens2 = this._caches[message];
      if (!tokens2) {
        tokens2 = parse(message, delimiters);
        this._caches[message] = tokens2;
      }
      return compile(tokens2, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format2, [startDelimiter, endDelimiter]) {
    const tokens2 = [];
    let position = 0;
    let text = "";
    while (position < format2.length) {
      let char = format2[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens2.push({ type: "text", value: text });
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
        tokens2.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens2.push({ type: "text", value: text });
    return tokens2;
  }
  function compile(tokens2, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens2.length) {
      const token2 = tokens2[index];
      switch (token2.type) {
        case "text":
          compiled.push(token2.value);
          break;
        case "list":
          compiled.push(values[parseInt(token2.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token2.value]);
          } else {
            {
              console.warn(`Type of token '${token2.type}' and format of value '${mode}' don't match!`);
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
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale$1(locale2, messages2) {
    if (!locale2) {
      return;
    }
    locale2 = locale2.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale2]) {
      return locale2;
    }
    locale2 = locale2.toLowerCase();
    if (locale2 === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale2.indexOf("zh") === 0) {
      if (locale2.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale2.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale2, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    const lang2 = startsWith(locale2, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
    if (lang2) {
      return lang2;
    }
  }
  class I18n {
    constructor({ locale: locale2, fallbackLocale, messages: messages2, watcher, formater }) {
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
      this.setLocale(locale2 || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale2) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale$1(locale2, this.messages) || this.fallbackLocale;
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
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale2, message, override = true) {
      const curMessages = this.messages[locale2];
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
        this.messages[locale2] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale2, values) {
      let message = this.message;
      if (typeof locale2 === "string") {
        locale2 = normalizeLocale$1(locale2, this.messages);
        locale2 && (message = this.messages[locale2]);
      } else {
        values = locale2;
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
  function initVueI18n(locale2, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale2 !== "string") {
      [locale2, messages2] = [
        messages2,
        locale2
      ];
    }
    if (typeof locale2 !== "string") {
      locale2 = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale: locale2,
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
      add(locale3, message, override = true) {
        return i18n.add(locale3, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
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
        navigationBarTitleText: "\u6211\u7684\u4F1A\u5458",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/addMyMebers/addMyMebers",
      style: {
        navigationBarTitleText: "\u6DFB\u52A0\u5B66\u5458",
        enablePullDownRefresh: false,
        autoBackButton: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/memberQuery/memberQuery",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false,
        autoBackButton: false,
        navigationStyle: "custom"
      }
    },
    {
      path: "pages/bodyAssessment/bodyAssessment",
      style: {
        navigationBarTitleText: "\u4F53\u6D4B\u8BC4\u4F30",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/bodyTestReport/bodyTestReport",
      style: {
        navigationBarTitleText: "\u4F53\u6D4B\u62A5\u544A",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/physicalAssessment/physicalAssessment",
      style: {
        navigationBarTitleText: "\u8EAB\u4F53\u8BC4\u6D4B",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/healthQuesson/healthQuesson",
      style: {
        navigationBarTitleText: "\u5065\u5EB7\u95EE\u7B54",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/physicalFitnessAssessment/physicalFitnessAssessment",
      style: {
        navigationBarTitleText: "\u4F53\u80FD\u8BC4\u4F30",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/logining/logining",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
      }
    },
    {
      path: "pages/verificatioCode/verificatioCode",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false,
        navigationStyle: "custom",
        autoBackButton: false
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
      path: "pages/dynamicEvaluation/actionEvaluation/actionEvaluation",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/viewReport/viewReport",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    }
  ];
  const globalStyle = {
    "app-plus": {
      titleNView: false
    },
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
        iconPath: "static/tabbar/noactivemeber.png",
        selectedIconPath: "static/tabbar/activemeber.png",
        text: "\u4F1A\u5458"
      },
      {
        pagePath: "pages/actionLibrary/index",
        iconPath: "static/tabbar/noactiveaction.png",
        selectedIconPath: "static/tabbar/activeaction.png",
        text: "\u52A8\u4F5C\u5E93"
      },
      {
        pagePath: "pages/my/my",
        iconPath: "static/tabbar/noactiveme.png",
        selectedIconPath: "static/tabbar/activeMe.png",
        text: "\u6211\u7684"
      }
    ]
  };
  const condition = {
    current: 0,
    list: [
      {
        name: "\u8C03\u8BD5",
        path: "pages/myMebers/myMebers",
        query: ""
      }
    ]
  };
  const t$2 = {
    pages,
    globalStyle,
    tabBar,
    condition
  };
  function n(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  }
  function s(e, t2, n2) {
    return e(n2 = { path: t2, exports: {}, require: function(e2, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(null == t3 && n2.path);
    } }, n2.exports), n2.exports;
  }
  var r = s(function(e, t2) {
    var n2;
    e.exports = (n2 = n2 || function(e2, t3) {
      var n3 = Object.create || function() {
        function e3() {
        }
        return function(t4) {
          var n4;
          return e3.prototype = t4, n4 = new e3(), e3.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e3) {
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
      } }, o2 = r2.WordArray = i2.extend({ init: function(e3, n4) {
        e3 = this.words = e3 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e3.length;
      }, toString: function(e3) {
        return (e3 || c2).stringify(this);
      }, concat: function(e3) {
        var t4 = this.words, n4 = e3.words, s3 = this.sigBytes, r3 = e3.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var i3 = 0; i3 < r3; i3++) {
            var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
            t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
          }
        else
          for (i3 = 0; i3 < r3; i3 += 4)
            t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e2.ceil(n4 / 4);
      }, clone: function() {
        var e3 = i2.clone.call(this);
        return e3.words = this.words.slice(0), e3;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          t5 = t5;
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e2.random() > 0.5 ? 1 : -1);
          };
        }, i3 = 0; i3 < t4; i3 += 4) {
          var a3 = r3(4294967296 * (n4 || e2.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new o2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e3.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new o2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(i3));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e3.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new o2.init(n4, t4);
      } }, l2 = a2.Utf8 = { stringify: function(e3) {
        try {
          return decodeURIComponent(escape(u2.stringify(e3)));
        } catch (e4) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e3) {
        return u2.parse(unescape(encodeURIComponent(e3)));
      } }, h2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
        this._data = new o2.init(), this._nDataBytes = 0;
      }, _append: function(e3) {
        "string" == typeof e3 && (e3 = l2.parse(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e2.ceil(a3) : e2.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e2.min(4 * c3, r3);
        if (c3) {
          for (var l3 = 0; l3 < c3; l3 += i3)
            this._doProcessBlock(s3, l3);
          var h3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new o2.init(h3, u3);
      }, clone: function() {
        var e3 = i2.clone.call(this);
        return e3._data = this._data.clone(), e3;
      }, _minBufferSize: 0 });
      r2.Hasher = h2.extend({ cfg: i2.extend(), init: function(e3) {
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
  }), i = r, o = (s(function(e, t2) {
    var n2;
    e.exports = (n2 = i, function(e2) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e2.abs(e2.sin(t4 + 1)) | 0;
      }();
      var c2 = o2.MD5 = i2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e3, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e3[s3];
          e3[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var i3 = this._hash.words, o3 = e3[t4 + 0], c3 = e3[t4 + 1], f2 = e3[t4 + 2], p2 = e3[t4 + 3], g2 = e3[t4 + 4], m2 = e3[t4 + 5], y = e3[t4 + 6], _2 = e3[t4 + 7], w2 = e3[t4 + 8], v2 = e3[t4 + 9], S2 = e3[t4 + 10], k = e3[t4 + 11], I2 = e3[t4 + 12], b2 = e3[t4 + 13], T2 = e3[t4 + 14], A2 = e3[t4 + 15], C2 = i3[0], P2 = i3[1], E2 = i3[2], O2 = i3[3];
        C2 = u2(C2, P2, E2, O2, o3, 7, a2[0]), O2 = u2(O2, C2, P2, E2, c3, 12, a2[1]), E2 = u2(E2, O2, C2, P2, f2, 17, a2[2]), P2 = u2(P2, E2, O2, C2, p2, 22, a2[3]), C2 = u2(C2, P2, E2, O2, g2, 7, a2[4]), O2 = u2(O2, C2, P2, E2, m2, 12, a2[5]), E2 = u2(E2, O2, C2, P2, y, 17, a2[6]), P2 = u2(P2, E2, O2, C2, _2, 22, a2[7]), C2 = u2(C2, P2, E2, O2, w2, 7, a2[8]), O2 = u2(O2, C2, P2, E2, v2, 12, a2[9]), E2 = u2(E2, O2, C2, P2, S2, 17, a2[10]), P2 = u2(P2, E2, O2, C2, k, 22, a2[11]), C2 = u2(C2, P2, E2, O2, I2, 7, a2[12]), O2 = u2(O2, C2, P2, E2, b2, 12, a2[13]), E2 = u2(E2, O2, C2, P2, T2, 17, a2[14]), C2 = l2(C2, P2 = u2(P2, E2, O2, C2, A2, 22, a2[15]), E2, O2, c3, 5, a2[16]), O2 = l2(O2, C2, P2, E2, y, 9, a2[17]), E2 = l2(E2, O2, C2, P2, k, 14, a2[18]), P2 = l2(P2, E2, O2, C2, o3, 20, a2[19]), C2 = l2(C2, P2, E2, O2, m2, 5, a2[20]), O2 = l2(O2, C2, P2, E2, S2, 9, a2[21]), E2 = l2(E2, O2, C2, P2, A2, 14, a2[22]), P2 = l2(P2, E2, O2, C2, g2, 20, a2[23]), C2 = l2(C2, P2, E2, O2, v2, 5, a2[24]), O2 = l2(O2, C2, P2, E2, T2, 9, a2[25]), E2 = l2(E2, O2, C2, P2, p2, 14, a2[26]), P2 = l2(P2, E2, O2, C2, w2, 20, a2[27]), C2 = l2(C2, P2, E2, O2, b2, 5, a2[28]), O2 = l2(O2, C2, P2, E2, f2, 9, a2[29]), E2 = l2(E2, O2, C2, P2, _2, 14, a2[30]), C2 = h2(C2, P2 = l2(P2, E2, O2, C2, I2, 20, a2[31]), E2, O2, m2, 4, a2[32]), O2 = h2(O2, C2, P2, E2, w2, 11, a2[33]), E2 = h2(E2, O2, C2, P2, k, 16, a2[34]), P2 = h2(P2, E2, O2, C2, T2, 23, a2[35]), C2 = h2(C2, P2, E2, O2, c3, 4, a2[36]), O2 = h2(O2, C2, P2, E2, g2, 11, a2[37]), E2 = h2(E2, O2, C2, P2, _2, 16, a2[38]), P2 = h2(P2, E2, O2, C2, S2, 23, a2[39]), C2 = h2(C2, P2, E2, O2, b2, 4, a2[40]), O2 = h2(O2, C2, P2, E2, o3, 11, a2[41]), E2 = h2(E2, O2, C2, P2, p2, 16, a2[42]), P2 = h2(P2, E2, O2, C2, y, 23, a2[43]), C2 = h2(C2, P2, E2, O2, v2, 4, a2[44]), O2 = h2(O2, C2, P2, E2, I2, 11, a2[45]), E2 = h2(E2, O2, C2, P2, A2, 16, a2[46]), C2 = d2(C2, P2 = h2(P2, E2, O2, C2, f2, 23, a2[47]), E2, O2, o3, 6, a2[48]), O2 = d2(O2, C2, P2, E2, _2, 10, a2[49]), E2 = d2(E2, O2, C2, P2, T2, 15, a2[50]), P2 = d2(P2, E2, O2, C2, m2, 21, a2[51]), C2 = d2(C2, P2, E2, O2, I2, 6, a2[52]), O2 = d2(O2, C2, P2, E2, p2, 10, a2[53]), E2 = d2(E2, O2, C2, P2, S2, 15, a2[54]), P2 = d2(P2, E2, O2, C2, c3, 21, a2[55]), C2 = d2(C2, P2, E2, O2, w2, 6, a2[56]), O2 = d2(O2, C2, P2, E2, A2, 10, a2[57]), E2 = d2(E2, O2, C2, P2, y, 15, a2[58]), P2 = d2(P2, E2, O2, C2, b2, 21, a2[59]), C2 = d2(C2, P2, E2, O2, g2, 6, a2[60]), O2 = d2(O2, C2, P2, E2, k, 10, a2[61]), E2 = d2(E2, O2, C2, P2, f2, 15, a2[62]), P2 = d2(P2, E2, O2, C2, v2, 21, a2[63]), i3[0] = i3[0] + C2 | 0, i3[1] = i3[1] + P2 | 0, i3[2] = i3[2] + E2 | 0, i3[3] = i3[3] + O2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var i3 = e2.floor(s3 / 4294967296), o3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var l3 = c3[u3];
          c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e3 = i2.clone.call(this);
        return e3._hash = this._hash.clone(), e3;
      } });
      function u2(e3, t4, n3, s3, r3, i3, o3) {
        var a3 = e3 + (t4 & n3 | ~t4 & s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function l2(e3, t4, n3, s3, r3, i3, o3) {
        var a3 = e3 + (t4 & s3 | n3 & ~s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function h2(e3, t4, n3, s3, r3, i3, o3) {
        var a3 = e3 + (t4 ^ n3 ^ s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function d2(e3, t4, n3, s3, r3, i3, o3) {
        var a3 = e3 + (n3 ^ (t4 | ~s3)) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), s(function(e, t2) {
    var n2;
    e.exports = (n2 = i, void function() {
      var e2 = n2, t3 = e2.lib.Base, s2 = e2.enc.Utf8;
      e2.algo.HMAC = t3.extend({ init: function(e3, t4) {
        e3 = this._hasher = new e3.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
        var n3 = e3.blockSize, r2 = 4 * n3;
        t4.sigBytes > r2 && (t4 = e3.finalize(t4)), t4.clamp();
        for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
          a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
        i2.sigBytes = o2.sigBytes = r2, this.reset();
      }, reset: function() {
        var e3 = this._hasher;
        e3.reset(), e3.update(this._iKey);
      }, update: function(e3) {
        return this._hasher.update(e3), this;
      }, finalize: function(e3) {
        var t4 = this._hasher, n3 = t4.finalize(e3);
        return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
      } });
    }());
  }), s(function(e, t2) {
    e.exports = i.HmacMD5;
  })), a = s(function(e, t2) {
    e.exports = i.enc.Utf8;
  }), c = s(function(e, t2) {
    var n2;
    e.exports = (n2 = i, function() {
      var e2 = n2, t3 = e2.lib.WordArray;
      function s2(e3, n3, s3) {
        for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
          if (o2 % 4) {
            var a2 = s3[e3.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e3.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
            r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
          }
        return t3.create(r2, i2);
      }
      e2.enc.Base64 = { stringify: function(e3) {
        var t4 = e3.words, n3 = e3.sigBytes, s3 = this._map;
        e3.clamp();
        for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
          for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
            r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; r2.length % 4; )
            r2.push(c2);
        return r2.join("");
      }, parse: function(e3) {
        var t4 = e3.length, n3 = this._map, r2 = this._reverseMap;
        if (!r2) {
          r2 = this._reverseMap = [];
          for (var i2 = 0; i2 < n3.length; i2++)
            r2[n3.charCodeAt(i2)] = i2;
        }
        var o2 = n3.charAt(64);
        if (o2) {
          var a2 = e3.indexOf(o2);
          -1 !== a2 && (t4 = a2);
        }
        return s2(e3, t4, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const u = "FUNCTION", l = "OBJECT", h = "CLIENT_DB";
  function d(e) {
    return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
  }
  function f(e) {
    return "object" === d(e);
  }
  function p(e) {
    return e && "string" == typeof e ? JSON.parse(e) : e;
  }
  const g = true, m = "app", _ = p([]);
  let w;
  w = m;
  const v = p('{\n    "address": [\n        "127.0.0.1",\n        "192.168.56.1",\n        "192.168.160.1",\n        "192.168.32.1",\n        "192.168.1.129"\n    ],\n    "debugPort": 9000,\n    "initialLaunchType": "remote",\n    "servePort": 7000,\n    "skipFiles": [\n        "<node_internals>/**",\n        "D:/hbuilderX/HBuilderX/plugins/unicloud/**/*.js"\n    ]\n}\n'), S = p('[{"provider":"aliyun","spaceName":"completeapp","spaceId":"mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3","clientSecret":"hnLvmNQF/W9ZY06q5wYD/Q==","endpoint":"https://api.next.bspapp.com"}]') || [];
  let I = "";
  try {
    I = "__UNI__76A9E40";
  } catch (e) {
  }
  let b = {};
  function T(e, t2 = {}) {
    var n2, s2;
    return n2 = b, s2 = e, Object.prototype.hasOwnProperty.call(n2, s2) || (b[e] = t2), b[e];
  }
  "app" === w && (b = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {});
  const A = ["invoke", "success", "fail", "complete"], C = T("_globalUniCloudInterceptor");
  function P(e, t2) {
    C[e] || (C[e] = {}), f(t2) && Object.keys(t2).forEach((n2) => {
      A.indexOf(n2) > -1 && function(e2, t3, n3) {
        let s2 = C[e2][t3];
        s2 || (s2 = C[e2][t3] = []), -1 === s2.indexOf(n3) && "function" == typeof n3 && s2.push(n3);
      }(e, n2, t2[n2]);
    });
  }
  function E(e, t2) {
    C[e] || (C[e] = {}), f(t2) ? Object.keys(t2).forEach((n2) => {
      A.indexOf(n2) > -1 && function(e2, t3, n3) {
        const s2 = C[e2][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e, n2, t2[n2]);
    }) : delete C[e];
  }
  function O(e, t2) {
    return e && 0 !== e.length ? e.reduce((e2, n2) => e2.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function x(e, t2) {
    return C[e] && C[e][t2] || [];
  }
  function U(e) {
    P("callObject", e);
  }
  const R = T("_globalUniCloudListener"), L = "response", N = "needLogin", D = "refreshToken", F = "clientdb", q = "cloudfunction", K = "cloudobject";
  function M(e) {
    return R[e] || (R[e] = []), R[e];
  }
  function j(e, t2) {
    const n2 = M(e);
    n2.includes(t2) || n2.push(t2);
  }
  function B(e, t2) {
    const n2 = M(e), s2 = n2.indexOf(t2);
    -1 !== s2 && n2.splice(s2, 1);
  }
  function $(e, t2) {
    const n2 = M(e);
    for (let e2 = 0; e2 < n2.length; e2++) {
      (0, n2[e2])(t2);
    }
  }
  let W, z = false;
  function J() {
    return W || (W = new Promise((e) => {
      z && e(), function t2() {
        if ("function" == typeof getCurrentPages) {
          const t3 = getCurrentPages();
          t3 && t3[0] && (z = true, e());
        }
        z || setTimeout(() => {
          t2();
        }, 30);
      }();
    }), W);
  }
  function H(e, t2) {
    return t2 ? function(n2) {
      let s2 = false;
      if ("callFunction" === t2) {
        const e2 = n2 && n2.type || u;
        s2 = e2 !== u;
      }
      const r2 = "callFunction" === t2 && !s2;
      let i2;
      i2 = this.isReady ? Promise.resolve() : this.initUniCloud, n2 = n2 || {};
      const o2 = i2.then(() => s2 ? Promise.resolve() : O(x(t2, "invoke"), n2)).then(() => e.call(this, n2)).then((e2) => s2 ? Promise.resolve(e2) : O(x(t2, "success"), e2).then(() => O(x(t2, "complete"), e2)).then(() => (r2 && $(L, { type: q, content: e2 }), Promise.resolve(e2))), (e2) => s2 ? Promise.reject(e2) : O(x(t2, "fail"), e2).then(() => O(x(t2, "complete"), e2)).then(() => ($(L, { type: q, content: e2 }), Promise.reject(e2))));
      if (!(n2.success || n2.fail || n2.complete))
        return o2;
      o2.then((e2) => {
        n2.success && n2.success(e2), n2.complete && n2.complete(e2), r2 && $(L, { type: q, content: e2 });
      }, (e2) => {
        n2.fail && n2.fail(e2), n2.complete && n2.complete(e2), r2 && $(L, { type: q, content: e2 });
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
  class G extends Error {
    constructor(e) {
      super(e.message), this.errMsg = e.message || "unknown system error", this.code = this.errCode = e.code || "SYSTEM_ERROR", this.errSubject = e.subject, this.cause = e.cause, this.requestId = e.requestId;
    }
    toJson(e = 0) {
      if (!(e >= 10))
        return e++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e) : this.cause };
    }
  }
  var V = { request: (e) => uni.request(e), uploadFile: (e) => uni.uploadFile(e), setStorageSync: (e, t2) => uni.setStorageSync(e, t2), getStorageSync: (e) => uni.getStorageSync(e), removeStorageSync: (e) => uni.removeStorageSync(e), clearStorageSync: () => uni.clearStorageSync() };
  function Y(e) {
    return e && Y(e.__v_raw) || e;
  }
  function Q() {
    return { token: V.getStorageSync("uni_id_token") || V.getStorageSync("uniIdToken"), tokenExpired: V.getStorageSync("uni_id_token_expired") };
  }
  function X({ token: e, tokenExpired: t2 } = {}) {
    e && V.setStorageSync("uni_id_token", e), t2 && V.setStorageSync("uni_id_token_expired", t2);
  }
  function Z() {
    if ("web" !== w)
      return;
    uni.getStorageSync("__LAST_DCLOUD_APPID") !== I && (uni.setStorageSync("__LAST_DCLOUD_APPID", I), console.warn("\u68C0\u6D4B\u5230\u5F53\u524D\u9879\u76EE\u4E0E\u4E0A\u6B21\u8FD0\u884C\u5230\u6B64\u7AEF\u53E3\u7684\u9879\u76EE\u4E0D\u4E00\u81F4\uFF0C\u81EA\u52A8\u6E05\u7406uni-id\u4FDD\u5B58\u7684token\u4FE1\u606F\uFF08\u4EC5\u5F00\u53D1\u8C03\u8BD5\u65F6\u751F\u6548\uFF09"), V.removeStorageSync("uni_id_token"), V.removeStorageSync("uniIdToken"), V.removeStorageSync("uni_id_token_expired"));
  }
  let ee, te;
  function ne() {
    return ee || (ee = uni.getSystemInfoSync()), ee;
  }
  function se() {
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
  function re() {
    const e = uni.getLocale && uni.getLocale() || "en";
    if (te)
      return { ...te, locale: e, LOCALE: e };
    const t2 = ne(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["pixelRatio", "brand", "model", "system", "language", "version", "platform", "host", "SDKVersion", "swanNativeVersion", "app", "AppPlatform", "fontSizeSetting"];
    for (let e2 = 0; e2 < o2.length; e2++) {
      delete t2[o2[e2]];
    }
    return te = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...se(), ...t2 }, { ...te, locale: e, LOCALE: e };
  }
  var ie = { sign: function(e, t2) {
    let n2 = "";
    return Object.keys(e).sort().forEach(function(t3) {
      e[t3] && (n2 = n2 + "&" + t3 + "=" + e[t3]);
    }), n2 = n2.slice(1), o(n2, t2).toString();
  }, wrappedRequest: function(e, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e, { complete(e2) {
        e2 || (e2 = {}), "web" === w && e2.errMsg && 0 === e2.errMsg.indexOf("request:fail") && console.warn("\u53D1\u5E03H5\uFF0C\u9700\u8981\u5728uniCloud\u540E\u53F0\u64CD\u4F5C\uFF0C\u7ED1\u5B9A\u5B89\u5168\u57DF\u540D\uFF0C\u5426\u5219\u4F1A\u56E0\u4E3A\u8DE8\u57DF\u95EE\u9898\u800C\u65E0\u6CD5\u8BBF\u95EE\u3002\u6559\u7A0B\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.io/uniCloud/quickstart?id=useinh5");
        const t3 = e2.data && e2.data.header && e2.data.header["x-serverless-request-id"] || e2.header && e2.header["request-id"];
        if (!e2.statusCode || e2.statusCode >= 400)
          return s2(new G({ code: "SYS_ERR", message: e2.errMsg || "request:fail", requestId: t3 }));
        const r2 = e2.data;
        if (r2.error)
          return s2(new G({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  }, toBase64: function(e) {
    return c.stringify(a.parse(e));
  } }, oe = { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" };
  const { t: ae } = initVueI18n({ "zh-Hans": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, "zh-Hant": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, en: oe, fr: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, es: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, ja: oe }, "zh-Hans");
  var ce = class {
    constructor(e) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e, t2))
          throw new Error(ae("uniCloud.init.paramRequired", { param: t2 }));
      }), this.config = Object.assign({}, { endpoint: "https://api.bspapp.com" }, e), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = V, this._getAccessTokenPromise = null, this._getAccessTokenPromiseStatus = null;
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e) {
      this.accessToken = e;
    }
    requestWrapped(e) {
      return ie.wrappedRequest(e, this.adapter.request);
    }
    requestAuth(e) {
      return this.requestWrapped(e);
    }
    request(e, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e) : this.requestWrapped(e).catch((t3) => new Promise((e2, n2) => {
        !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e2();
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
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = ie.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = ie.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      if ("pending" === this._getAccessTokenPromiseStatus)
        return this._getAccessTokenPromise;
      this._getAccessTokenPromiseStatus = "pending";
      return this._getAccessTokenPromise = this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e) => new Promise((t2, n2) => {
        e.result && e.result.accessToken ? (this.setAccessToken(e.result.accessToken), this._getAccessTokenPromiseStatus = "fulfilled", t2(this.accessToken)) : (this._getAccessTokenPromiseStatus = "rejected", n2(new G({ code: "AUTH_FAILED", message: "\u83B7\u53D6accessToken\u5931\u8D25" })));
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
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e2) {
          e2 && e2.statusCode < 400 ? o2(e2) : a2(new G({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new G({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e2) => {
          i2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2, config: r2 }) {
      if ("string" !== d(t2))
        throw new G({ code: "INVALID_PARAM", message: "cloudPath\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B" });
      if (!(t2 = t2.trim()))
        throw new G({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      if (/:\/\//.test(t2))
        throw new G({ code: "INVALID_PARAM", message: "cloudPath\u4E0D\u5408\u6CD5" });
      const i2 = r2 && r2.envType || this.config.envType, o2 = (await this.getOSSUploadOptionsFromPath({ env: i2, filename: t2 })).result, a2 = "https://" + o2.cdnDomain + "/" + o2.ossPath, { securityToken: c2, accessKeyId: u2, signature: l2, host: h2, ossPath: f2, id: p2, policy: g2, ossCallbackUrl: m2 } = o2, y = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: u2, Signature: l2, host: h2, id: p2, key: f2, policy: g2, success_action_status: 200 };
      if (c2 && (y["x-oss-security-token"] = c2), m2) {
        const e2 = JSON.stringify({ callbackUrl: m2, callbackBody: JSON.stringify({ fileId: p2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        y.callback = ie.toBase64(e2);
      }
      const _2 = { url: "https://" + o2.host, formData: y, fileName: "file", name: "file", filePath: e, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, _2, { onUploadProgress: s2 })), m2)
        return { success: true, filePath: e, fileID: a2 };
      if ((await this.reportOSSUpload({ id: p2 })).success)
        return { success: true, filePath: e, fileID: a2 };
      throw new G({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" });
    }
    getTempFileURL({ fileList: e } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e) && 0 !== e.length || n2(new G({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" })), t2({ fileList: e.map((e2) => ({ fileID: e2, tempFileURL: e2 })) });
      });
    }
    async getFileInfo({ fileList: e } = {}) {
      if (!Array.isArray(e) || 0 === e.length)
        throw new G({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e.map((e2) => e2.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var ue = { init(e) {
    const t2 = new ce(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const le = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
  var he;
  !function(e) {
    e.local = "local", e.none = "none", e.session = "session";
  }(he || (he = {}));
  var de = function() {
  };
  const fe = () => {
    let e;
    if (!Promise) {
      e = () => {
      }, e.promise = {};
      const t3 = () => {
        throw new G({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e.promise, "then", { get: t3 }), Object.defineProperty(e.promise, "catch", { get: t3 }), e;
    }
    const t2 = new Promise((t3, n2) => {
      e = (e2, s2) => e2 ? n2(e2) : t3(s2);
    });
    return e.promise = t2, e;
  };
  function pe(e) {
    return void 0 === e;
  }
  function ge(e) {
    return "[object Null]" === Object.prototype.toString.call(e);
  }
  var me;
  function ye(e) {
    const t2 = (n2 = e, "[object Array]" === Object.prototype.toString.call(n2) ? e : [e]);
    var n2;
    for (const e2 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e2;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e) {
    e.WEB = "web", e.WX_MP = "wx_mp";
  }(me || (me = {}));
  const _e = { adapter: null, runtime: void 0 }, we = ["anonymousUuidKey"];
  class ve extends de {
    constructor() {
      super(), _e.adapter.root.tcbObject || (_e.adapter.root.tcbObject = {});
    }
    setItem(e, t2) {
      _e.adapter.root.tcbObject[e] = t2;
    }
    getItem(e) {
      return _e.adapter.root.tcbObject[e];
    }
    removeItem(e) {
      delete _e.adapter.root.tcbObject[e];
    }
    clear() {
      delete _e.adapter.root.tcbObject;
    }
  }
  function Se(e, t2) {
    switch (e) {
      case "local":
        return t2.localStorage || new ve();
      case "none":
        return new ve();
      default:
        return t2.sessionStorage || new ve();
    }
  }
  class ke {
    constructor(e) {
      if (!this._storage) {
        this._persistence = _e.adapter.primaryStorage || e.persistence, this._storage = Se(this._persistence, _e.adapter);
        const t2 = `access_token_${e.env}`, n2 = `access_token_expire_${e.env}`, s2 = `refresh_token_${e.env}`, r2 = `anonymous_uuid_${e.env}`, i2 = `login_type_${e.env}`, o2 = `user_info_${e.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: o2 };
      }
    }
    updatePersistence(e) {
      if (e === this._persistence)
        return;
      const t2 = "local" === this._persistence;
      this._persistence = e;
      const n2 = Se(e, _e.adapter);
      for (const e2 in this.keys) {
        const s2 = this.keys[e2];
        if (t2 && we.includes(e2))
          continue;
        const r2 = this._storage.getItem(s2);
        pe(r2) || ge(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e, r2);
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
  const Ie = {}, be = {};
  function Te(e) {
    return Ie[e];
  }
  class Ae {
    constructor(e, t2) {
      this.data = t2 || null, this.name = e;
    }
  }
  class Ce extends Ae {
    constructor(e, t2) {
      super("error", { error: e, data: t2 }), this.error = e;
    }
  }
  const Pe = new class {
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
          -1 !== s2 && n2[e2].splice(s2, 1);
        }
      }(e, t2, this._listeners), this;
    }
    fire(e, t2) {
      if (e instanceof Ce)
        return console.error(e.error), this;
      const n2 = "string" == typeof e ? new Ae(e, t2 || {}) : e;
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
  function Ee(e, t2) {
    Pe.on(e, t2);
  }
  function Oe(e, t2 = {}) {
    Pe.fire(e, t2);
  }
  function xe(e, t2) {
    Pe.off(e, t2);
  }
  const Ue = "loginStateChanged", Re = "loginStateExpire", Le = "loginTypeChanged", Ne = "anonymousConverted", De = "refreshAccessToken";
  var Fe;
  !function(e) {
    e.ANONYMOUS = "ANONYMOUS", e.WECHAT = "WECHAT", e.WECHAT_PUBLIC = "WECHAT-PUBLIC", e.WECHAT_OPEN = "WECHAT-OPEN", e.CUSTOM = "CUSTOM", e.EMAIL = "EMAIL", e.USERNAME = "USERNAME", e.NULL = "NULL";
  }(Fe || (Fe = {}));
  const qe = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Ke = { "X-SDK-Version": "1.3.5" };
  function Me(e, t2, n2) {
    const s2 = e[t2];
    e[t2] = function(t3) {
      const r2 = {}, i2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: o3 } = n3.call(e, t3);
        Object.assign(r2, s3), Object.assign(i2, o3);
      });
      const o2 = t3.data;
      return o2 && (() => {
        var e2;
        if (e2 = o2, "[object FormData]" !== Object.prototype.toString.call(e2))
          t3.data = { ...o2, ...r2 };
        else
          for (const e3 in r2)
            o2.append(e3, r2[e3]);
      })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e, t3);
    };
  }
  function je() {
    const e = Math.random().toString(16).slice(2);
    return { data: { seqId: e }, headers: { ...Ke, "x-seqid": e } };
  }
  class Be {
    constructor(e = {}) {
      var t2;
      this.config = e, this._reqClass = new _e.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `\u8BF7\u6C42\u5728${this.config.timeout / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD`, restrictedMethods: ["post"] }), this._cache = Te(this.config.env), this._localCache = (t2 = this.config.env, be[t2]), Me(this._reqClass, "post", [je]), Me(this._reqClass, "upload", [je]), Me(this._reqClass, "download", [je]);
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
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e), this._cache.removeStore(t2);
      let i2 = this._cache.getStore(n2);
      if (!i2)
        throw new G({ message: "\u672A\u767B\u5F55CloudBase" });
      const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
      if (a2.data.code) {
        const { code: e2 } = a2.data;
        if ("SIGN_PARAM_INVALID" === e2 || "REFRESH_TOKEN_EXPIRED" === e2 || "INVALID_REFRESH_TOKEN" === e2) {
          if (this._cache.getStore(s2) === Fe.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e2) {
            const e3 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e3, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          Oe(Re), this._cache.removeStore(n2);
        }
        throw new G({ code: a2.data.code, message: `\u5237\u65B0access token\u5931\u8D25\uFF1A${a2.data.code}` });
      }
      if (a2.data.access_token)
        return Oe(De), this._cache.setStore(e, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new G({ message: "refresh token\u4E0D\u5B58\u5728\uFF0C\u767B\u5F55\u72B6\u6001\u5F02\u5E38" });
      let s2 = this._cache.getStore(e), r2 = this._cache.getStore(t2), i2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const i2 = { action: e, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
      if (-1 === qe.indexOf(e)) {
        const { refreshTokenKey: e2 } = this._cache.keys;
        this._cache.getStore(e2) && (i2.access_token = (await this.getAccessToken()).accessToken);
      }
      let o2;
      if ("storage.uploadFile" === e) {
        o2 = new FormData();
        for (let e2 in o2)
          o2.hasOwnProperty(e2) && void 0 !== o2[e2] && o2.append(e2, i2[e2]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", o2 = {};
        for (let e2 in i2)
          void 0 !== i2[e2] && (o2[e2] = i2[e2]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: l2, search: h2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), l2 && (d2 = { ...l2, ...d2 });
      let f2 = function(e2, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e3 in n3)
          "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e3}=${encodeURIComponent(n3[e3])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e2}${t3}`;
      }(le, "//tcb-api.tencentcloudapi.com/web", d2);
      h2 && (f2 += h2);
      const p2 = await this.post({ url: f2, data: o2, ...a2 }), g2 = p2.header && p2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(p2.status) && 200 !== Number(p2.statusCode) || !p2.data)
        throw new G({ code: "NETWORK_ERROR", message: "network request error" });
      return p2;
    }
    async send(e, t2 = {}) {
      const n2 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
      if ("ACCESS_TOKEN_EXPIRED" === n2.data.code && -1 === qe.indexOf(e)) {
        await this.refreshAccessToken();
        const n3 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
        if (n3.data.code)
          throw new G({ code: n3.data.code, message: n3.data.message });
        return n3.data;
      }
      if (n2.data.code)
        throw new G({ code: n2.data.code, message: n2.data.message });
      return n2.data;
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
  }
  const $e = {};
  function We(e) {
    return $e[e];
  }
  class ze {
    constructor(e) {
      this.config = e, this._cache = Te(e.env), this._request = We(e.env);
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
  class Je {
    constructor(e) {
      if (!e)
        throw new G({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e, this._cache = Te(this._envId), this._request = We(this._envId), this.setUserInfo();
    }
    linkWithTicket(e) {
      if ("string" != typeof e)
        throw new G({ code: "PARAM_ERROR", message: "ticket must be string" });
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
      if ("string" != typeof e)
        throw new G({ code: "PARAM_ERROR", message: "username must be a string" });
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
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
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
  class He {
    constructor(e) {
      if (!e)
        throw new G({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = Te(e);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new Je(e);
    }
    get isAnonymousAuth() {
      return this.loginType === Fe.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === Fe.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === Fe.WECHAT || this.loginType === Fe.WECHAT_OPEN || this.loginType === Fe.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class Ge extends ze {
    async signIn() {
      this._cache.updatePersistence("local");
      const { anonymousUuidKey: e, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e) || void 0, s2 = this._cache.getStore(t2) || void 0, r2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
      if (r2.uuid && r2.refresh_token) {
        this._setAnonymousUUID(r2.uuid), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), Oe(Ue), Oe(Le, { env: this.config.env, loginType: Fe.ANONYMOUS, persistence: "local" });
        const e2 = new He(this.config.env);
        return await e2.user.refresh(), e2;
      }
      throw new G({ message: "\u533F\u540D\u767B\u5F55\u5931\u8D25" });
    }
    async linkAndRetrieveDataWithTicket(e) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e });
      if (i2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), Oe(Ne, { env: this.config.env }), Oe(Le, { loginType: Fe.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
      throw new G({ message: "\u533F\u540D\u8F6C\u5316\u5931\u8D25" });
    }
    _setAnonymousUUID(e) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e), this._cache.setStore(n2, Fe.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class Ve extends ze {
    async signIn(e) {
      if ("string" != typeof e)
        throw new G({ code: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), Oe(Ue), Oe(Le, { env: this.config.env, loginType: Fe.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new He(this.config.env);
      throw new G({ message: "\u81EA\u5B9A\u4E49\u767B\u5F55\u5931\u8D25" });
    }
  }
  class Ye extends ze {
    async signIn(e, t2) {
      if ("string" != typeof e)
        throw new G({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Oe(Ue), Oe(Le, { env: this.config.env, loginType: Fe.EMAIL, persistence: this.config.persistence }), new He(this.config.env);
      throw s2.code ? new G({ code: s2.code, message: `\u90AE\u7BB1\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new G({ message: "\u90AE\u7BB1\u767B\u5F55\u5931\u8D25" });
    }
    async activate(e) {
      return this._request.send("auth.activateEndUserMail", { token: e });
    }
    async resetPasswordWithToken(e, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e, newPassword: t2 });
    }
  }
  class Qe extends ze {
    async signIn(e, t2) {
      if ("string" != typeof e)
        throw new G({ code: "PARAM_ERROR", message: "username must be a string" });
      "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Fe.USERNAME, username: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Oe(Ue), Oe(Le, { env: this.config.env, loginType: Fe.USERNAME, persistence: this.config.persistence }), new He(this.config.env);
      throw s2.code ? new G({ code: s2.code, message: `\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new G({ message: "\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25" });
    }
  }
  class Xe {
    constructor(e) {
      this.config = e, this._cache = Te(e.env), this._request = We(e.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), Ee(Le, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e = this.hasLoginState();
      return e && e.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new Ge(this.config);
    }
    customAuthProvider() {
      return new Ve(this.config);
    }
    emailAuthProvider() {
      return new Ye(this.config);
    }
    usernameAuthProvider() {
      return new Qe(this.config);
    }
    async signInAnonymously() {
      return new Ge(this.config).signIn();
    }
    async signInWithEmailAndPassword(e, t2) {
      return new Ye(this.config).signIn(e, t2);
    }
    signInWithUsernameAndPassword(e, t2) {
      return new Qe(this.config).signIn(e, t2);
    }
    async linkAndRetrieveDataWithTicket(e) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new Ge(this.config)), Ee(Ne, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e);
    }
    async signOut() {
      if (this.loginType === Fe.ANONYMOUS)
        throw new G({ message: "\u533F\u540D\u7528\u6237\u4E0D\u652F\u6301\u767B\u51FA\u64CD\u4F5C" });
      const { refreshTokenKey: e, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e), this._cache.removeStore(t2), this._cache.removeStore(n2), Oe(Ue), Oe(Le, { env: this.config.env, loginType: Fe.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e, password: t2 });
    }
    async sendPasswordResetEmail(e) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e });
    }
    onLoginStateChanged(e) {
      Ee(Ue, () => {
        const t3 = this.hasLoginState();
        e.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e.call(this, t2);
    }
    onLoginStateExpired(e) {
      Ee(Re, e.bind(this));
    }
    onAccessTokenRefreshed(e) {
      Ee(De, e.bind(this));
    }
    onAnonymousConverted(e) {
      Ee(Ne, e.bind(this));
    }
    onLoginTypeChanged(e) {
      Ee(Le, () => {
        const t2 = this.hasLoginState();
        e.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { refreshTokenKey: e } = this._cache.keys;
      return this._cache.getStore(e) ? new He(this.config.env) : null;
    }
    async isUsernameRegistered(e) {
      if ("string" != typeof e)
        throw new G({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e) {
      return new Ve(this.config).signIn(e);
    }
    shouldRefreshAccessToken(e) {
      this._request._shouldRefreshAccessTokenHook = e.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e) => e.code ? e : { ...e.data, requestId: e.seqId });
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
  const Ze = function(e, t2) {
    t2 = t2 || fe();
    const n2 = We(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e2, f2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: f2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e3) => {
        201 === e3.statusCode ? t2(null, { fileID: l2, requestId: d2 }) : t2(new G({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e3.data}` }));
      }).catch((e3) => {
        t2(e3);
      });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, et = function(e, t2) {
    t2 = t2 || fe();
    const n2 = We(this.config.env), { cloudPath: s2 } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      t2(null, e2);
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, tt$1 = function({ fileList: e }, t2) {
    if (t2 = t2 || fe(), !e || !Array.isArray(e))
      return { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" };
    for (let t3 of e)
      if (!t3 || "string" != typeof t3)
        return { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" };
    const n2 = { fileid_list: e };
    return We(this.config.env).send("storage.batchDeleteFile", n2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.delete_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, nt = function({ fileList: e }, t2) {
    t2 = t2 || fe(), e && Array.isArray(e) || t2(null, { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" });
    let n2 = [];
    for (let s3 of e)
      "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5305\u542BfileID\u548CmaxAge\u7684\u5BF9\u8C61" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" });
    const s2 = { file_list: n2 };
    return We(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.download_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, st = async function({ fileID: e }, t2) {
    const n2 = (await nt.call(this, { fileList: [{ fileID: e, maxAge: 600 }] })).fileList[0];
    if ("SUCCESS" !== n2.code)
      return t2 ? t2(n2) : new Promise((e2) => {
        e2(n2);
      });
    const s2 = We(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, rt = function({ name: e, data: t2, query: n2, parse: s2, search: r2 }, i2) {
    const o2 = i2 || fe();
    let a2;
    try {
      a2 = t2 ? JSON.stringify(t2) : "";
    } catch (e2) {
      return Promise.reject(e2);
    }
    if (!e)
      return Promise.reject(new G({ code: "PARAM_ERROR", message: "\u51FD\u6570\u540D\u4E0D\u80FD\u4E3A\u7A7A" }));
    const c2 = { inQuery: n2, parse: s2, search: r2, function_name: e, request_data: a2 };
    return We(this.config.env).send("functions.invokeFunction", c2).then((e2) => {
      if (e2.code)
        o2(null, e2);
      else {
        let t3 = e2.data.response_data;
        if (s2)
          o2(null, { result: t3, requestId: e2.requestId });
        else
          try {
            t3 = JSON.parse(e2.data.response_data), o2(null, { result: t3, requestId: e2.requestId });
          } catch (e3) {
            o2(new G({ message: "response data must be json" }));
          }
      }
      return o2.promise;
    }).catch((e2) => {
      o2(e2);
    }), o2.promise;
  }, it = { timeout: 15e3, persistence: "session" }, ot = {};
  class at {
    constructor(e) {
      this.config = e || this.config, this.authObj = void 0;
    }
    init(e) {
      switch (_e.adapter || (this.requestClient = new _e.adapter.reqClass({ timeout: e.timeout || 5e3, timeoutMsg: `\u8BF7\u6C42\u5728${(e.timeout || 5e3) / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD` })), this.config = { ...it, ...e }, true) {
        case this.config.timeout > 6e5:
          console.warn("timeout\u5927\u4E8E\u53EF\u914D\u7F6E\u4E0A\u9650[10\u5206\u949F]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0A\u9650\u6570\u503C"), this.config.timeout = 6e5;
          break;
        case this.config.timeout < 100:
          console.warn("timeout\u5C0F\u4E8E\u53EF\u914D\u7F6E\u4E0B\u9650[100ms]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0B\u9650\u6570\u503C"), this.config.timeout = 100;
      }
      return new at(this.config);
    }
    auth({ persistence: e } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e || _e.adapter.primaryStorage || it.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e2) {
        const { env: t3 } = e2;
        Ie[t3] = new ke(e2), be[t3] = new ke({ ...e2, persistence: "local" });
      }(this.config), n2 = this.config, $e[n2.env] = new Be(n2), this.authObj = new Xe(this.config), this.authObj;
    }
    on(e, t2) {
      return Ee.apply(this, [e, t2]);
    }
    off(e, t2) {
      return xe.apply(this, [e, t2]);
    }
    callFunction(e, t2) {
      return rt.apply(this, [e, t2]);
    }
    deleteFile(e, t2) {
      return tt$1.apply(this, [e, t2]);
    }
    getTempFileURL(e, t2) {
      return nt.apply(this, [e, t2]);
    }
    downloadFile(e, t2) {
      return st.apply(this, [e, t2]);
    }
    uploadFile(e, t2) {
      return Ze.apply(this, [e, t2]);
    }
    getUploadMetadata(e, t2) {
      return et.apply(this, [e, t2]);
    }
    registerExtension(e) {
      ot[e.name] = e;
    }
    async invokeExtension(e, t2) {
      const n2 = ot[e];
      if (!n2)
        throw new G({ message: `\u6269\u5C55${e} \u5FC5\u987B\u5148\u6CE8\u518C` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e) {
      const { adapter: t2, runtime: n2 } = ye(e) || {};
      t2 && (_e.adapter = t2), n2 && (_e.runtime = n2);
    }
  }
  var ct = new at();
  function ut(e, t2, n2) {
    void 0 === n2 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var i2 in n2)
      "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e + t2;
  }
  class lt {
    post(e) {
      const { url: t2, data: n2, headers: s2 } = e;
      return new Promise((e2, r2) => {
        V.request({ url: ut("https:", t2), data: n2, method: "POST", header: s2, success(t3) {
          e2(t3);
        }, fail(e3) {
          r2(e3);
        } });
      });
    }
    upload(e) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e, c2 = V.uploadFile({ url: ut("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e2) {
          const n3 = { statusCode: e2.statusCode, data: e2.data || {} };
          200 === e2.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
        }, fail(e2) {
          n2(new Error(e2.errMsg || "uploadFile:fail"));
        } });
        "function" == typeof e.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
          e.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const ht = { setItem(e, t2) {
    V.setStorageSync(e, t2);
  }, getItem: (e) => V.getStorageSync(e), removeItem(e) {
    V.removeStorageSync(e);
  }, clear() {
    V.clearStorageSync();
  } };
  var dt = { genAdapter: function() {
    return { root: {}, reqClass: lt, localStorage: ht, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  ct.useAdapters(dt);
  const ft = ct, pt = ft.init;
  ft.init = function(e) {
    e.env = e.spaceId;
    const t2 = pt.call(this, e);
    t2.config.provider = "tencent", t2.config.spaceId = e.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e2) {
      const t3 = n2.call(this, e2);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e3) => {
        t3[e3] = H(t3[e3]).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var gt = ft;
  var mt = class extends ce {
    getAccessToken() {
      return new Promise((e, t2) => {
        const n2 = "Anonymous_Access_token";
        this.setAccessToken(n2), e(n2);
      });
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = ie.sign(n2, this.config.clientSecret);
      const r2 = re();
      s2["x-client-info"] = encodeURIComponent(JSON.stringify(r2));
      const { token: i2 } = Q();
      return s2["x-client-token"] = i2, { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: JSON.parse(JSON.stringify(s2)) };
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, success(e2) {
          e2 && e2.statusCode < 400 ? o2(e2) : a2(new G({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new G({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e2) => {
          i2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new G({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      let r2;
      return this.getOSSUploadOptionsFromPath({ cloudPath: t2 }).then((t3) => {
        const { url: i2, formData: o2, name: a2 } = t3.result;
        r2 = t3.result.fileUrl;
        const c2 = { url: i2, formData: o2, name: a2, filePath: e, fileType: n2 };
        return this.uploadFileToOSS(Object.assign({}, c2, { onUploadProgress: s2 }));
      }).then(() => this.reportOSSUpload({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e, fileID: r2 }) : s3(new G({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }));
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2)).then((e2) => {
        if (e2.success)
          return e2.result;
        throw new G({ code: "DELETE_FILE_FAILED", message: "\u5220\u9664\u6587\u4EF6\u5931\u8D25" });
      });
    }
    getTempFileURL({ fileList: e } = {}) {
      if (!Array.isArray(e) || 0 === e.length)
        throw new G({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" });
      const t2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2)).then((e2) => {
        if (e2.success)
          return { fileList: e2.result.fileList.map((e3) => ({ fileID: e3.fileID, tempFileURL: e3.tempFileURL })) };
        throw new G({ code: "GET_TEMP_FILE_URL_FAILED", message: "\u83B7\u53D6\u4E34\u65F6\u6587\u4EF6\u94FE\u63A5\u5931\u8D25" });
      });
    }
  };
  var yt = { init(e) {
    const t2 = new mt(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  function _t({ data: e }) {
    let t2;
    t2 = re();
    const n2 = JSON.parse(JSON.stringify(e || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e2 } = Q();
      e2 && (n2.uniIdToken = e2);
    }
    return n2;
  }
  function wt({ name: e, data: t2 } = {}) {
    const { localAddress: n2, localPort: s2 } = this.__dev__, r2 = { aliyun: "aliyun", tencent: "tcb" }[this.config.provider], i2 = this.config.spaceId, o2 = `http://${n2}:${s2}/system/check-function`, a2 = `http://${n2}:${s2}/cloudfunctions/${e}`;
    return new Promise((t3, n3) => {
      V.request({ method: "POST", url: o2, data: { name: e, platform: w, provider: r2, spaceId: i2 }, timeout: 3e3, success(e2) {
        t3(e2);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570\u3002" } });
      } });
    }).then(({ data: e2 } = {}) => {
      const { code: t3, message: n3 } = e2 || {};
      return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: n3, message: s3 }) => {
      if (0 !== n3) {
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
        const s4 = _t.call(this, { data: t2 });
        V.request({ method: "POST", url: a2, data: { provider: r2, platform: w, param: s4 }, success: ({ statusCode: t3, data: s5 } = {}) => !t3 || t3 >= 400 ? n4(new G({ code: s5.code || "SYS_ERR", message: s5.message || "request:fail" })) : e2({ result: s5 }), fail(e3) {
          n4(new G({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const vt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "\uFF0C\u4E91\u51FD\u6570[{functionName}]\u5728\u4E91\u7AEF\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u6B64\u4E91\u51FD\u6570\u540D\u79F0\u662F\u5426\u6B63\u786E\u4EE5\u53CA\u8BE5\u4E91\u51FD\u6570\u662F\u5426\u5DF2\u4E0A\u4F20\u5230\u670D\u52A1\u7A7A\u95F4", mode: "append" }];
  var St = /[\\^$.*+?()[\]{}|]/g, kt = RegExp(St.source);
  function It(e, t2, n2) {
    return e.replace(new RegExp((s2 = t2) && kt.test(s2) ? s2.replace(St, "\\$&") : s2, "g"), n2);
    var s2;
  }
  const Tt = "request", At = "response", Ct = "both";
  const ln = { code: 2e4, message: "System error" }, hn = { code: 20101, message: "Invalid client" };
  function pn(e) {
    const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e || {};
    return new G({ subject: t2 || n2 || "uni-secure-network", code: s2 || i2 || ln.code, message: r2 || o2, cause: a2 });
  }
  let mn;
  function Sn({ secretType: e } = {}) {
    return e === Tt || e === At || e === Ct;
  }
  function kn({ name: e, data: t2 = {} } = {}) {
    return "app" === w && "DCloud-clientDB" === e && "encryption" === t2.redirectTo && "getAppClientKey" === t2.action;
  }
  function In({ provider: e, spaceId: t2, functionName: n2 } = {}) {
    const { appId: s2, uniPlatform: r2, osName: i2 } = ne();
    let o2 = r2;
    "app" === r2 && (o2 = i2);
    const a2 = function({ provider: e2, spaceId: t3 } = {}) {
      const n3 = _;
      if (!n3)
        return {};
      e2 = function(e3) {
        return "tencent" === e3 ? "tcb" : e3;
      }(e2);
      const s3 = n3.find((n4) => n4.provider === e2 && n4.spaceId === t3);
      return s3 && s3.config;
    }({ provider: e, spaceId: t2 });
    if (!a2 || !a2.accessControl || !a2.accessControl.enable)
      return false;
    const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
    if (0 === u2.length)
      return true;
    const l2 = function(e2, t3) {
      let n3, s3, r3;
      for (let i3 = 0; i3 < e2.length; i3++) {
        const o3 = e2[i3];
        o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e3) => e3.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
      }
      return n3 || s3 || r3;
    }(u2, n2);
    if (!l2)
      return false;
    if ((c2[l2] || []).find((e2 = {}) => e2.appId === s2 && (e2.platform || "").toLowerCase() === o2.toLowerCase()))
      return true;
    throw console.error(`\u6B64\u5E94\u7528[appId: ${s2}, platform: ${o2}]\u4E0D\u5728\u4E91\u7AEF\u914D\u7F6E\u7684\u5141\u8BB8\u8BBF\u95EE\u7684\u5E94\u7528\u5217\u8868\u5185\uFF0C\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), pn(hn);
  }
  function bn({ functionName: e, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Tn(e) {
    const t2 = e.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = _t.call(e, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb" }[this.config.provider], i2 = Sn(n3), o2 = kn(n3), a2 = i2 || o2;
      return t2.call(this, n3).then((e2) => (e2.errCode = 0, !a2 && bn.call(this, { functionName: s2, result: e2, logPvd: r2 }), Promise.resolve(e2)), (e2) => (!a2 && bn.call(this, { functionName: s2, result: e2, logPvd: r2 }), e2 && e2.message && (e2.message = function({ message: e3 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e3.match(r3);
          if (!a3)
            continue;
          let c2 = i3;
          for (let e4 = 1; e4 < a3.length; e4++)
            c2 = It(c2, `{$${e4}}`, a3[e4]);
          for (const e4 in t3)
            c2 = It(c2, `{${e4}}`, t3[e4]);
          return "replace" === o3 ? c2 : e3 + c2;
        }
        return e3;
      }({ message: `[${n3.name}]: ${e2.message}`, formatter: vt, extraInfo: { functionName: s2 } })), Promise.reject(e2)));
    };
    e.callFunction = function(t3) {
      const { provider: s2, spaceId: r2 } = e.config, i2 = t3.name;
      let o2, a2;
      if (t3.data = t3.data || {}, e.__dev__.debugInfo && !e.__dev__.debugInfo.forceRemote && S ? (e._callCloudFunction || (e._callCloudFunction = n2, e._callLocalFunction = wt), o2 = wt) : o2 = n2, o2 = o2.bind(e), kn(t3))
        a2 = n2.call(e, t3);
      else if (function({ name: e2, data: t4 = {} }) {
        return "mp-weixin" === w && "uni-id-co" === e2 && "secureNetworkHandshakeByWeixin" === t4.method;
      }(t3))
        a2 = o2.call(e, t3);
      else if (Sn(t3)) {
        a2 = new mn({ secretType: t3.secretType, uniCloudIns: e }).wrapEncryptDataCallFunction(n2.bind(e))(t3);
      } else if (In({ provider: s2, spaceId: r2, functionName: i2 })) {
        a2 = new mn({ secretType: t3.secretType, uniCloudIns: e }).wrapVerifyClientCallFunction(n2.bind(e))(t3);
      } else
        a2 = o2(t3);
      return Object.defineProperty(a2, "result", { get: () => (console.warn("\u5F53\u524D\u8FD4\u56DE\u7ED3\u679C\u4E3APromise\u7C7B\u578B\uFF0C\u4E0D\u53EF\u76F4\u63A5\u8BBF\u95EE\u5176result\u5C5E\u6027\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2;
    };
  }
  mn = "mp-weixin" !== w && "app" !== w ? class {
    constructor() {
      throw pn({ message: `Platform ${w} is not supported by secure network` });
    }
  } : class {
    constructor() {
      throw pn({ message: `Platform ${w} is not enabled, please check whether secure network module is enabled in your manifest.json` });
    }
  };
  const An = Symbol("CLIENT_DB_INTERNAL");
  function Cn(e, t2) {
    return e.then = "DoNotReturnProxyWithAFunctionNamedThen", e._internalType = An, e.inspect = null, e.__v_raw = void 0, new Proxy(e, { get(e2, n2, s2) {
      if ("_uniClient" === n2)
        return null;
      if ("symbol" == typeof n2)
        return e2[n2];
      if (n2 in e2 || "string" != typeof n2) {
        const t3 = e2[n2];
        return "function" == typeof t3 ? t3.bind(e2) : t3;
      }
      return t2.get(e2, n2, s2);
    } });
  }
  function Pn(e) {
    return { on: (t2, n2) => {
      e[t2] = e[t2] || [], e[t2].indexOf(n2) > -1 || e[t2].push(n2);
    }, off: (t2, n2) => {
      e[t2] = e[t2] || [];
      const s2 = e[t2].indexOf(n2);
      -1 !== s2 && e[t2].splice(s2, 1);
    } };
  }
  const En = ["db.Geo", "db.command", "command.aggregate"];
  function On(e, t2) {
    return En.indexOf(`${e}.${t2}`) > -1;
  }
  function xn(e) {
    switch (d(e = Y(e))) {
      case "array":
        return e.map((e2) => xn(e2));
      case "object":
        return e._internalType === An || Object.keys(e).forEach((t2) => {
          e[t2] = xn(e[t2]);
        }), e;
      case "regexp":
        return { $regexp: { source: e.source, flags: e.flags } };
      case "date":
        return { $date: e.toISOString() };
      default:
        return e;
    }
  }
  function Un(e) {
    return e && e.content && e.content.$method;
  }
  class Rn {
    constructor(e, t2, n2) {
      this.content = e, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e = this;
      const t2 = [e.content];
      for (; e.prevStage; )
        e = e.prevStage, t2.push(e.content);
      return { $db: t2.reverse().map((e2) => ({ $method: e2.$method, $param: xn(e2.$param) })) };
    }
    getAction() {
      const e = this.toJSON().$db.find((e2) => "action" === e2.$method);
      return e && e.$param && e.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e) => "action" !== e.$method) };
    }
    get isAggregate() {
      let e = this;
      for (; e; ) {
        const t2 = Un(e), n2 = Un(e.prevStage);
        if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e = this;
      for (; e; ) {
        if ("command" === Un(e))
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e = this;
      for (; e; ) {
        const t2 = Un(e), n2 = Un(e.prevStage);
        if ("aggregate" === t2 && "command" === n2)
          return true;
        e = e.prevStage;
      }
      return false;
    }
    getNextStageFn(e) {
      const t2 = this;
      return function() {
        return Ln({ $method: e, $param: xn(Array.from(arguments)) }, t2, t2._database);
      };
    }
    get count() {
      return this.isAggregate ? this.getNextStageFn("count") : function() {
        return this._send("count", Array.from(arguments));
      };
    }
    get remove() {
      return this.isCommand ? this.getNextStageFn("remove") : function() {
        return this._send("remove", Array.from(arguments));
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    get add() {
      return this.isCommand ? this.getNextStageFn("add") : function() {
        return this._send("add", Array.from(arguments));
      };
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      return this.isCommand ? this.getNextStageFn("set") : function() {
        throw new Error("JQL\u7981\u6B62\u4F7F\u7528set\u65B9\u6CD5");
      };
    }
    _send(e, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e, $param: xn(t2) }), g) {
        const e2 = s2.$db.find((e3) => "collection" === e3.$method), t3 = e2 && e2.$param;
        t3 && 1 === t3.length && "string" == typeof e2.$param[0] && e2.$param[0].indexOf(",") > -1 && console.warn("\u68C0\u6D4B\u5230\u4F7F\u7528JQL\u8BED\u6CD5\u8054\u8868\u67E5\u8BE2\u65F6\uFF0C\u672A\u4F7F\u7528getTemp\u5148\u8FC7\u6EE4\u4E3B\u8868\u6570\u636E\uFF0C\u5728\u4E3B\u8868\u6570\u636E\u91CF\u5927\u7684\u60C5\u51B5\u4E0B\u53EF\u80FD\u4F1A\u67E5\u8BE2\u7F13\u6162\u3002\n- \u5982\u4F55\u4F18\u5316\u8BF7\u53C2\u8003\u6B64\u6587\u6863\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- \u5982\u679C\u4E3B\u8868\u6570\u636E\u91CF\u5F88\u5C0F\u8BF7\u5FFD\u7565\u6B64\u4FE1\u606F\uFF0C\u9879\u76EE\u53D1\u884C\u65F6\u4E0D\u4F1A\u51FA\u73B0\u6B64\u63D0\u793A\u3002");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function Ln(e, t2, n2) {
    return Cn(new Rn(e, t2, n2), { get(e2, t3) {
      let s2 = "db";
      return e2 && e2.content && (s2 = e2.content.$method), On(s2, t3) ? Ln({ $method: t3 }, e2, n2) : function() {
        return Ln({ $method: t3, $param: xn(Array.from(arguments)) }, e2, n2);
      };
    } });
  }
  function Nn({ path: e, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e.map((e2) => ({ $method: e2 })), { $method: t2, $param: this.param }] };
      }
    };
  }
  function Dn(e, t2 = {}) {
    return Cn(new e(t2), { get: (e2, t3) => On("db", t3) ? Ln({ $method: t3 }, null, e2) : function() {
      return Ln({ $method: t3, $param: xn(Array.from(arguments)) }, null, e2);
    } });
  }
  class Fn extends class {
    constructor({ uniClient: e = {}, isJQL: t2 = false } = {}) {
      this._uniClient = e, this._authCallBacks = {}, this._dbCallBacks = {}, e.isDefault && (this._dbCallBacks = T("_globalUniCloudDatabaseCallback")), t2 || (this.auth = Pn(this._authCallBacks)), this._isJQL = t2, Object.assign(this, Pn(this._dbCallBacks)), this.env = Cn({}, { get: (e2, t3) => ({ $env: t3 }) }), this.Geo = Cn({}, { get: (e2, t3) => Nn({ path: ["Geo"], method: t3 }) }), this.serverDate = Nn({ path: [], method: "serverDate" }), this.RegExp = Nn({ path: [], method: "RegExp" });
    }
    getCloudEnv(e) {
      if ("string" != typeof e || !e.trim())
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
        if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
          throw new Error("multiSend\u53EA\u652F\u6301\u5B50\u547D\u4EE4\u5185\u4F7F\u7528getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e });
    }
  } {
    _parseResult(e) {
      return this._isJQL ? e.result : e;
    }
    _callCloudFunction({ action: e, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e2, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e2.result.dataList[n3]));
          }
      }
      const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
      function a2(e2) {
        return i2._callback("error", [e2]), O(x(o2, "fail"), e2).then(() => O(x(o2, "complete"), e2)).then(() => (r2(null, e2), $(L, { type: F, content: e2 }), Promise.reject(e2)));
      }
      const c2 = O(x(o2, "invoke")), u2 = this._uniClient;
      return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: h, data: { action: e, command: t2, multiCommand: n2 } })).then((e2) => {
        const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e2.result;
        if (u3)
          for (let e3 = 0; e3 < u3.length; e3++) {
            const { level: t4, message: n4, detail: s4 } = u3[e3], r3 = console["app" === w && "warn" === t4 ? "error" : t4] || console.log;
            let i3 = "[System Info]" + n4;
            s4 && (i3 = `${i3}
\u8BE6\u7EC6\u4FE1\u606F\uFF1A${s4}`), r3(i3);
          }
        if (t3) {
          return a2(new G({ code: t3, message: n3, requestId: e2.requestId }));
        }
        e2.result.errCode = e2.result.errCode || e2.result.code, e2.result.errMsg = e2.result.errMsg || e2.result.message, s3 && c3 && (X({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), $(D, { token: s3, tokenExpired: c3 }));
        const l2 = [{ prop: "affectedDocs", tips: "affectedDocs\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528inserted/deleted/updated/data.length\u66FF\u4EE3" }, { prop: "code", tips: "code\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errCode\u66FF\u4EE3" }, { prop: "message", tips: "message\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errMsg\u66FF\u4EE3" }];
        for (let t4 = 0; t4 < l2.length; t4++) {
          const { prop: n4, tips: s4 } = l2[t4];
          if (n4 in e2.result) {
            const t5 = e2.result[n4];
            Object.defineProperty(e2.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e3) {
          return O(x(o2, "success"), e3).then(() => O(x(o2, "complete"), e3)).then(() => {
            r2(e3, null);
            const t4 = i2._parseResult(e3);
            return $(L, { type: F, content: t4 }), Promise.resolve(t4);
          });
        }(e2);
      }, (e2) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e2.message) && console.warn("clientDB\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5728web\u63A7\u5236\u53F0\u4FDD\u5B58\u4E00\u6B21schema\u4EE5\u5F00\u542FclientDB");
        return a2(new G({ code: e2.code || "SYSTEM_ERROR", message: e2.message, requestId: e2.requestId }));
      });
    }
  }
  const qn = "token\u65E0\u6548\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Kn = "token\u8FC7\u671F\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Mn = { TOKEN_INVALID_TOKEN_EXPIRED: Kn, TOKEN_INVALID_INVALID_CLIENTID: qn, TOKEN_INVALID: qn, TOKEN_INVALID_WRONG_TOKEN: qn, TOKEN_INVALID_ANONYMOUS_USER: qn }, jn = { "uni-id-token-expired": Kn, "uni-id-check-token-failed": qn, "uni-id-token-not-exist": qn, "uni-id-check-device-feature-failed": qn };
  function Bn(e, t2) {
    let n2 = "";
    return n2 = e ? `${e}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function $n(e = [], t2 = "") {
    const n2 = [], s2 = [];
    return e.forEach((e2) => {
      true === e2.needLogin ? n2.push(Bn(t2, e2.path)) : false === e2.needLogin && s2.push(Bn(t2, e2.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function Wn(e) {
    return e.split("?")[0].replace(/^\//, "");
  }
  function zn() {
    return function(e) {
      let t2 = e && e.$page && e.$page.fullPath || "";
      return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : t2;
    }(function() {
      const e = getCurrentPages();
      return e[e.length - 1];
    }());
  }
  function Jn() {
    return Wn(zn());
  }
  function Hn(e = "", t2 = {}) {
    if (!e)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = Wn(e);
    return n2.some((e2) => e2.pagePath === s2);
  }
  const Gn = !!t$2.uniIdRouter;
  const { loginPage: Vn, routerNeedLogin: Yn, resToLogin: Qn, needLoginPage: Xn, notNeedLoginPage: Zn, loginPageInTabBar: es } = function({ pages: e = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = t$2) {
    const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = $n(e), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e2 = []) {
      const t2 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = $n(r3, s3);
        t2.push(...i3), n3.push(...o3);
      }), { needLoginPage: t2, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: Hn(i2, r2) };
  }();
  if (Xn.indexOf(Vn) > -1)
    throw new Error(`Login page [${Vn}] should not be "needLogin", please check your pages.json`);
  function ts(e) {
    const t2 = Jn();
    if ("/" === e.charAt(0))
      return e;
    const [n2, s2] = e.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
    i2.pop();
    for (let e2 = 0; e2 < r2.length; e2++) {
      const t3 = r2[e2];
      ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
    }
    return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
  }
  function ns(e) {
    const t2 = Wn(ts(e));
    return !(Zn.indexOf(t2) > -1) && (Xn.indexOf(t2) > -1 || Yn.some((t3) => function(e2, t4) {
      return new RegExp(t4).test(e2);
    }(e, t3)));
  }
  function ss({ redirect: e }) {
    const t2 = Wn(e), n2 = Wn(Vn);
    return Jn() !== n2 && t2 !== n2;
  }
  function rs({ api: e, redirect: t2 } = {}) {
    if (!t2 || !ss({ redirect: t2 }))
      return;
    const n2 = function(e2, t3) {
      return "/" !== e2.charAt(0) && (e2 = "/" + e2), t3 ? e2.indexOf("?") > -1 ? e2 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e2 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e2;
    }(Vn, t2);
    es ? "navigateTo" !== e && "redirectTo" !== e || (e = "switchTab") : "switchTab" === e && (e = "navigateTo");
    const s2 = { navigateTo: uni.navigateTo, redirectTo: uni.redirectTo, switchTab: uni.switchTab, reLaunch: uni.reLaunch };
    setTimeout(() => {
      s2[e]({ url: n2 });
    });
  }
  function is({ url: e } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e2, tokenExpired: t3 } = Q();
      let n3;
      if (e2) {
        if (t3 < Date.now()) {
          const e3 = "uni-id-token-expired";
          n3 = { errCode: e3, errMsg: jn[e3] };
        }
      } else {
        const e3 = "uni-id-check-token-failed";
        n3 = { errCode: e3, errMsg: jn[e3] };
      }
      return n3;
    }();
    if (ns(e) && n2) {
      n2.uniIdRedirectUrl = e;
      if (M(N).length > 0)
        return setTimeout(() => {
          $(N, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function os() {
    !function() {
      const e2 = zn(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = is({ url: e2 });
      t2 || n2 && rs({ api: "redirectTo", redirect: e2 });
    }();
    const e = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e.length; t2++) {
      const n2 = e[t2];
      uni.addInterceptor(n2, { invoke(e2) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = is({ url: e2.url });
        return t3 ? e2 : s2 ? (rs({ api: n2, redirect: ts(e2.url) }), false) : e2;
      } });
    }
  }
  function as$1() {
    this.onResponse((e) => {
      const { type: t2, content: n2 } = e;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e2) {
            const { errCode: t3 } = e2;
            return t3 in jn;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e2) {
            const { errCode: t3 } = e2;
            return t3 in Mn;
          }(n2);
      }
      s2 && function(e2 = {}) {
        const t3 = M(N);
        J().then(() => {
          const n3 = zn();
          if (n3 && ss({ redirect: n3 }))
            return t3.length > 0 ? $(N, Object.assign({ uniIdRedirectUrl: n3 }, e2)) : void (Vn && rs({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function cs(e) {
    !function(e2) {
      e2.onResponse = function(e3) {
        j(L, e3);
      }, e2.offResponse = function(e3) {
        B(L, e3);
      };
    }(e), function(e2) {
      e2.onNeedLogin = function(e3) {
        j(N, e3);
      }, e2.offNeedLogin = function(e3) {
        B(N, e3);
      }, Gn && (T("_globalUniCloudStatus").needLoginInit || (T("_globalUniCloudStatus").needLoginInit = true, J().then(() => {
        os.call(e2);
      }), Qn && as$1.call(e2)));
    }(e), function(e2) {
      e2.onRefreshToken = function(e3) {
        j(D, e3);
      }, e2.offRefreshToken = function(e3) {
        B(D, e3);
      };
    }(e);
  }
  let us;
  const ls = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", hs = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function ds() {
    const e = Q().token || "", t2 = e.split(".");
    if (!e || 3 !== t2.length)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(us(s2).split("").map(function(e2) {
        return "%" + ("00" + e2.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e2) {
      throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + e2.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  us = "function" != typeof atob ? function(e) {
    if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !hs.test(e))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e += "==".slice(2 - (3 & e.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e.length; )
      t2 = ls.indexOf(e.charAt(i2++)) << 18 | ls.indexOf(e.charAt(i2++)) << 12 | (n2 = ls.indexOf(e.charAt(i2++))) << 6 | (s2 = ls.indexOf(e.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var fs = s(function(e, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e2, t3) {
      return e2.tempFiles.forEach((e3, n3) => {
        e3.name || (e3.name = e3.path.substring(e3.path.lastIndexOf("/") + 1)), t3 && (e3.fileType = t3), e3.cloudPath = Date.now() + "_" + n3 + e3.name.substring(e3.name.lastIndexOf("."));
      }), e2.tempFilePaths || (e2.tempFilePaths = e2.tempFiles.map((e3) => e3.path)), e2;
    }
    function i2(e2, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e3) => {
        if (s3) {
          const t4 = s3(e3);
          if (void 0 !== t4)
            return Promise.resolve(t4).then((t5) => void 0 === t5 ? e3 : t5);
        }
        return e3;
      }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e3, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const i3 = t5.tempFiles, o2 = i3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= o2)
              return void (!i3.find((e4) => !e4.url && !e4.errMsg) && n3(t5));
            const u2 = i3[s5];
            e3.uploadFile({ filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, onUploadProgress(e4) {
              e4.index = s5, e4.tempFile = u2, e4.tempFilePath = u2.path, r4 && r4(e4);
            } }).then((e4) => {
              u2.url = e4.fileID, s5 < o2 && c2();
            }).catch((e4) => {
              u2.errMsg = e4.errMsg || e4.message, s5 < o2 && c2();
            });
          }
        });
      }(e2, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e2) {
      return function(t3 = { type: "all" }) {
        return "image" === t3.type ? i2(e2, function(e3) {
          const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e3;
          return new Promise((e4, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
              e4(r2(t5, "image"));
            }, fail(e5) {
              a2({ errMsg: e5.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : "video" === t3.type ? i2(e2, function(e3) {
          const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e3;
          return new Promise((e4, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
              e4(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e5) {
              c2({ errMsg: e5.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : i2(e2, function(e3) {
          const { count: t4, extension: n3 } = e3;
          return new Promise((e4, i3) => {
            let o2 = uni.chooseFile;
            if ("undefined" != typeof wx && "function" == typeof wx.chooseMessageFile && (o2 = wx.chooseMessageFile), "function" != typeof o2)
              return i3({ errMsg: s2 + " \u8BF7\u6307\u5B9A type \u7C7B\u578B\uFF0C\u8BE5\u5E73\u53F0\u4EC5\u652F\u6301\u9009\u62E9 image \u6216 video\u3002" });
            o2({ type: "all", count: t4, extension: n3, success(t5) {
              e4(r2(t5));
            }, fail(e5) {
              i3({ errMsg: e5.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), ps = n(fs);
  const gs = "manual";
  function ms(e) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {} }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e2 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e2.push(this[t2]);
        }), e2;
      }, (e2, t2) => {
        if (this.loadtime === gs)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e2.length; r2++)
          e2[r2] !== t2[r2] && (s2.push(e2[r2]), n2 = true);
        e2[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e2, t2) {
    }, mixinDatacomEasyGet({ getone: e2 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const i2 = e2 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = i2, t2 && t2(i2);
      }).catch((e3) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e3, n2 && n2(e3);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2 = e.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const i2 = t2.where || this.where;
      i2 && Object.keys(i2).length && (n2 = n2.where(i2));
      const o2 = t2.field || this.field;
      o2 && (n2 = n2.field(o2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
      const l2 = t2.orderby || this.orderby;
      l2 && (n2 = n2.orderBy(l2));
      const h2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, f2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, p2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: f2 }, y = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
      return p2 && (m2.getTree = y), g2 && (m2.getTreePath = y), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function ys(e) {
    return function(t2, n2 = {}) {
      n2 = function(e2, t3 = {}) {
        return e2.customUI = t3.customUI || e2.customUI, e2.parseSystemError = t3.parseSystemError || e2.parseSystemError, Object.assign(e2.loadingOptions, t3.loadingOptions), Object.assign(e2.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e2.secretMethods = t3.secretMethods), e2;
      }({ customUI: false, loadingOptions: { title: "\u52A0\u8F7D\u4E2D...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
      return new Proxy({}, { get: (s3, c2) => function({ fn: e2, interceptorName: t3, getCallbackArgs: n3 } = {}) {
        return async function(...s4) {
          const r3 = n3 ? n3({ params: s4 }) : {};
          let i3, o3;
          try {
            return await O(x(t3, "invoke"), { ...r3 }), i3 = await e2(...s4), await O(x(t3, "success"), { ...r3, result: i3 }), i3;
          } catch (e3) {
            throw o3 = e3, await O(x(t3, "fail"), { ...r3, error: o3 }), o3;
          } finally {
            await O(x(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
          }
        };
      }({ fn: async function s4(...u2) {
        let h2;
        a2 && uni.showLoading({ title: r2.title, mask: r2.mask });
        const d2 = { name: t2, type: l, data: { method: c2, params: u2 } };
        "object" == typeof n2.secretMethods && function(e2, t3) {
          const n3 = t3.data.method, s5 = e2.secretMethods || {}, r3 = s5[n3] || s5["*"];
          r3 && (t3.secretType = r3);
        }(n2, d2);
        let f2 = false;
        try {
          h2 = await e.callFunction(d2);
        } catch (e2) {
          f2 = true, h2 = { result: new G(e2) };
        }
        const { errSubject: p2, errCode: g2, errMsg: m2, newToken: y } = h2.result || {};
        if (a2 && uni.hideLoading(), y && y.token && y.tokenExpired && (X(y), $(D, { ...y })), g2) {
          let e2 = m2;
          if (f2 && o2) {
            e2 = (await o2({ objectName: t2, methodName: c2, params: u2, errSubject: p2, errCode: g2, errMsg: m2 })).errMsg || m2;
          }
          if (a2)
            if ("toast" === i2.type)
              uni.showToast({ title: e2, icon: "none" });
            else {
              if ("modal" !== i2.type)
                throw new Error(`Invalid errorOptions.type: ${i2.type}`);
              {
                const { confirm: t3 } = await async function({ title: e3, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                  return new Promise((i3, o3) => {
                    uni.showModal({ title: e3, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e4) {
                      i3(e4);
                    }, fail() {
                      i3({ confirm: false, cancel: true });
                    } });
                  });
                }({ title: "\u63D0\u793A", content: e2, showCancel: i2.retry, cancelText: "\u53D6\u6D88", confirmText: i2.retry ? "\u91CD\u8BD5" : "\u786E\u5B9A" });
                if (i2.retry && t3)
                  return s4(...u2);
              }
            }
          const n3 = new G({ subject: p2, code: g2, message: m2, requestId: h2.requestId });
          throw n3.detail = h2.result, $(L, { type: K, content: n3 }), n3;
        }
        return $(L, { type: K, content: h2.result }), h2.result;
      }, interceptorName: "callObject", getCallbackArgs: function({ params: e2 } = {}) {
        return { objectName: t2, methodName: c2, params: e2 };
      } }) });
    };
  }
  function _s(e) {
    return T("_globalUniCloudSecureNetworkCache__{spaceId}".replace("{spaceId}", e.config.spaceId));
  }
  async function ws({ callLoginByWeixin: e = false } = {}) {
    const t2 = _s(this);
    if ("mp-weixin" !== w)
      throw new Error(`[SecureNetwork] API \`initSecureNetworkByWeixin\` is not supported on platform \`${w}\``);
    const n2 = await new Promise((e2, t3) => {
      uni.login({ success(t4) {
        e2(t4.code);
      }, fail(e3) {
        t3(new Error(e3.errMsg));
      } });
    }), s2 = this.importObject("uni-id-co", { customUI: true });
    return await s2.secureNetworkHandshakeByWeixin({ code: n2, callLoginByWeixin: e }), t2.mpWeixinCode = n2, { code: n2 };
  }
  async function vs(e) {
    const t2 = _s(this);
    return t2.initPromise || (t2.initPromise = ws.call(this, e)), t2.initPromise;
  }
  function Ss(e) {
    return function({ callLoginByWeixin: t2 = false } = {}) {
      return vs.call(e, { callLoginByWeixin: t2 });
    };
  }
  async function ks(e, t2) {
    const n2 = `http://${e}:${t2}/system/ping`;
    try {
      const e2 = await (s2 = { url: n2, timeout: 500 }, new Promise((e3, t3) => {
        V.request({ ...s2, success(t4) {
          e3(t4);
        }, fail(e4) {
          t3(e4);
        } });
      }));
      return !(!e2.data || 0 !== e2.data.code);
    } catch (e2) {
      return false;
    }
    var s2;
  }
  function Is(e) {
    if (e.initUniCloudStatus && "rejected" !== e.initUniCloudStatus)
      return;
    let t2 = Promise.resolve();
    var n2;
    n2 = 1, t2 = new Promise((e2) => {
      setTimeout(() => {
        e2();
      }, n2);
    }), e.isReady = false, e.isDefault = false;
    const s2 = e.auth();
    e.initUniCloudStatus = "pending", e.initUniCloud = t2.then(() => s2.getLoginState()).then((e2) => e2 ? Promise.resolve() : s2.signInAnonymously()).then(() => {
      if ("app" === w) {
        const { osName: e2, osVersion: t3 } = ne();
        "ios" === e2 && function(e3) {
          if (!e3 || "string" != typeof e3)
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
            const r2 = e2[s3];
            if (await ks(r2, t4)) {
              n4 = r2;
              break;
            }
          }
          return { address: n4, port: t4 };
        }(t3, n3);
      }
    }).then(({ address: t3, port: n3 } = {}) => {
      const s3 = console["app" === w ? "error" : "warn"];
      if (t3)
        e.__dev__.localAddress = t3, e.__dev__.localPort = n3;
      else if (e.__dev__.debugInfo) {
        let t4 = "";
        "remote" === e.__dev__.debugInfo.initialLaunchType ? (e.__dev__.debugInfo.forceRemote = true, t4 = "\u5F53\u524D\u5BA2\u6237\u7AEF\u548CHBuilderX\u4E0D\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF08\u6216\u5176\u4ED6\u7F51\u7EDC\u539F\u56E0\u65E0\u6CD5\u8FDE\u63A5HBuilderX\uFF09\uFF0CuniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u4E0D\u5BF9\u5F53\u524D\u5BA2\u6237\u7AEF\u751F\u6548\u3002\n- \u5982\u679C\u4E0D\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u76F4\u63A5\u5FFD\u7565\u6B64\u4FE1\u606F\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs") : t4 = "\u65E0\u6CD5\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u5F53\u524D\u5BA2\u6237\u7AEF\u662F\u5426\u4E0E\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs", "web" === w && (t4 += "\n- \u90E8\u5206\u6D4F\u89C8\u5668\u5F00\u542F\u8282\u6D41\u6A21\u5F0F\u4E4B\u540E\u8BBF\u95EE\u672C\u5730\u5730\u5740\u53D7\u9650\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u542F\u7528\u4E86\u8282\u6D41\u6A21\u5F0F"), 0 === w.indexOf("mp-") && (t4 += "\n- \u5C0F\u7A0B\u5E8F\u4E2D\u5982\u4F55\u4F7F\u7528uniCloud\uFF0C\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), s3(t4);
      }
    }).then(() => {
      Z(), e.isReady = true, e.initUniCloudStatus = "fulfilled";
    }).catch((t3) => {
      console.error(t3), e.initUniCloudStatus = "rejected";
    });
  }
  const bs = { tcb: gt, tencent: gt, aliyun: ue, private: yt };
  let Ts = new class {
    init(e) {
      let t2 = {};
      const n2 = bs[e.provider];
      if (!n2)
        throw new Error("\u672A\u63D0\u4F9B\u6B63\u786E\u7684provider\u53C2\u6570");
      t2 = n2.init(e), t2.__dev__ = {}, t2.__dev__.debugLog = "web" === w && navigator.userAgent.indexOf("HBuilderX") > 0 || "app" === w;
      const s2 = v;
      s2 && !s2.code && (t2.__dev__.debugInfo = s2), Is(t2), t2.reInit = function() {
        Is(this);
      }, Tn(t2), function(e2) {
        const t3 = e2.uploadFile;
        e2.uploadFile = function(e3) {
          return t3.call(this, e3);
        };
      }(t2), function(e2) {
        e2.database = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e2.init(t3).database();
          if (this._database)
            return this._database;
          const n3 = Dn(Fn, { uniClient: e2 });
          return this._database = n3, n3;
        }, e2.databaseForJQL = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e2.init(t3).databaseForJQL();
          if (this._databaseForJQL)
            return this._databaseForJQL;
          const n3 = Dn(Fn, { uniClient: e2, isJQL: true });
          return this._databaseForJQL = n3, n3;
        };
      }(t2), function(e2) {
        e2.getCurrentUserInfo = ds, e2.chooseAndUploadFile = ps.initChooseAndUploadFile(e2), Object.assign(e2, { get mixinDatacom() {
          return ms(e2);
        } }), e2.importObject = ys(e2), e2.initSecureNetworkByWeixin = Ss(e2);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e2) => {
        if (!t2[e2])
          return;
        const n3 = t2[e2];
        t2[e2] = function() {
          return t2.reInit(), n3.apply(t2, Array.from(arguments));
        }, t2[e2] = H(t2[e2], e2).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e = S;
    let t2 = {};
    if (e && 1 === e.length)
      t2 = e[0], Ts = Ts.init(t2), Ts.isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e && e.length > 0 ? "\u5E94\u7528\u6709\u591A\u4E2A\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u901A\u8FC7uniCloud.init\u65B9\u6CD5\u6307\u5B9A\u8981\u4F7F\u7528\u7684\u670D\u52A1\u7A7A\u95F4" : "\u5E94\u7528\u672A\u5173\u8054\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u5728uniCloud\u76EE\u5F55\u53F3\u952E\u5173\u8054\u670D\u52A1\u7A7A\u95F4", t3.forEach((e2) => {
        Ts[e2] = function() {
          return console.error(n2), Promise.reject(new G({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    Object.assign(Ts, { get mixinDatacom() {
      return ms(Ts);
    } }), cs(Ts), Ts.addInterceptor = P, Ts.removeInterceptor = E, Ts.interceptObject = U, "web" === w && (window.uniCloud = Ts);
  })();
  var As = Ts;
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
        let diff2 = Math.abs(this.clientX - clientX);
        let time = new Date().getTime() - this.timestamp;
        if (diff2 < 40 && time < 300) {
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
  const mpwxs = mpMixins;
  let bindIngXMixins = {};
  let otherMixins = {};
  const block0$1 = (Comp) => {
    (Comp.$wxs || (Comp.$wxs = [])).push("wxsswipe");
    (Comp.$wxsModules || (Comp.$wxsModules = {}))["wxsswipe"] = "afd46426";
  };
  const block1 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("renderswipe");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["renderswipe"] = "5a1e922e";
  };
  const _sfc_main$A = {
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
      getSwipeAction(name = "uniSwipeAction") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
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
    block0$1(_sfc_main$A);
  if (typeof block1 === "function")
    block1(_sfc_main$A);
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["__scopeId", "data-v-8ff2a577"], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.vue"]]);
  const _sfc_main$z = {
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
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue"]]);
  var businessCloudObject$2 = As.importObject("businessCloudObject");
  const _sfc_main$y = {
    name: "memberList",
    data() {
      return {
        meberList: [],
        deleteRemarkFlag: true,
        delteIndex: 0
      };
    },
    props: {
      isActive: Number,
      searchValue: String,
      type: String
    },
    created() {
      switch (this.type) {
        case "home":
          this.getMemberList(this.isActive);
          break;
      }
    },
    onShow() {
    },
    computed: {
      needFlag() {
        let flag = false;
        if (this.meberList.length === 0) {
          flag = true;
        }
        formatAppLog("log", "at components/memberList/memberList.vue:148", flag, " LLLLL");
        return flag;
      }
    },
    watch: {
      isActive: {
        handler: function(n2, o2) {
          this.type === "home" ? this.getMemberList(n2) : "";
        },
        immediate: true
      },
      searchValue: {
        handler: function(n2, o2) {
          if (this.type === "detail") {
            if (!n2) {
              this.meberList = [];
              return;
            }
            formatAppLog("log", "at components/memberList/memberList.vue:167", n2, ">>>>");
            if (n2) {
              this.searchMemberList();
            }
          }
        },
        deep: true
      }
    },
    methods: {
      jumpPhysicalAssessment(item) {
        uni.navigateTo({
          url: "/pages/physicalAssessment/physicalAssessment?traineeNo=" + item._id,
          success: (res2) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      },
      searchMemberList(data) {
        businessCloudObject$2.getMoreList(data).then((meberListRes) => {
          formatAppLog("log", "at components/memberList/memberList.vue:192", meberListRes, "meberListRes");
          this.meberList = meberListRes.data.map((item) => {
            return {
              ...item,
              isOpened: "none"
            };
          }) || [];
        }).catch((err) => {
        });
      },
      sureDeleteConfirm() {
        businessCloudObject$2.removeMember(this.meberList[this.delteIndex]).then((res2) => {
          if (res2.success) {
            uni.showToast({
              icon: "success",
              title: res2.message,
              duration: 800
            });
            this.deleteRemarkFlag = false;
            if (this.type === "detail") {
              if (!this.searchValue) {
                this.meberList = [];
              } else {
                this.searchMemberList(this.searchValue);
              }
            } else {
              this.getMemberList(this.isActive);
            }
          }
        }).catch((err) => {
          uni.showToast({
            icon: "fail",
            title: err.message,
            duration: 800
          });
        });
      },
      updateMember(item) {
        uni.navigateTo({
          url: "/pages/addMyMebers/addMyMebers?item=" + JSON.stringify(item),
          success: (res2) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      },
      memberSrollTop(event) {
        this.scrollTop = event.detail.scrollTop;
        this.cellingFlag = this.scrollTop > 50 ? true : false;
      },
      getMemberList(buyStatus) {
        let self2 = this;
        this.$nextTick(() => {
          businessCloudObject$2.getMemberList(buyStatus).then((meberListRes) => {
            formatAppLog("log", "at components/memberList/memberList.vue:255", meberListRes, "meberListRes");
            let meberList = meberListRes.data.map((item) => {
              return {
                ...item,
                isOpened: "none"
              };
            }) || [];
            self2.$set(self2, "meberList", meberList);
            formatAppLog("log", "at components/memberList/memberList.vue:265", self2.meberList, "?????");
            self2.$forceUpdate();
          }).catch((err) => {
          });
        });
      },
      bindClick(e) {
        formatAppLog("log", "at components/memberList/memberList.vue:273", "\u4F60\u597D");
        this.deleteRemarkFlag = true;
      },
      swipeChange(e, index) {
        this.delteIndex = index;
        formatAppLog("log", "at components/memberList/memberList.vue:278", "\u5F53\u524D\u72B6\u6001\uFF1A" + e + "\uFF0C\u4E0B\u6807\uFF1A" + index);
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
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_swipe_action_item = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action-item"), __easycom_0$4);
    const _component_uni_swipe_action = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "mebers_content" }, [
      $options.needFlag ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "no_data_style"
      }, [
        vue.createElementVNode("image", {
          class: "no_data_meber_img_style",
          src: "/static/app-plus/mebrs/nomebers.png"
        }),
        vue.createElementVNode("view", { class: "quckliy_add_style" }, "\u5FEB\u53BB\u6DFB\u52A0\u7B2C\u4E00\u4E2A\u5B66\u5458\u5427")
      ])) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList($data.meberList, (item, itemIndex) => {
        return vue.openBlock(), vue.createBlock(_component_uni_swipe_action, {
          class: "slide_stylle",
          key: "itemIndex" + itemIndex
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_uni_swipe_action_item, {
              show: item.isOpened,
              "auto-close": false,
              onChange: ($event) => $options.swipeChange($event, itemIndex, item)
            }, {
              right: vue.withCtx(() => [
                vue.createElementVNode("view", {
                  class: "slot-button",
                  onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => $options.bindClick($event), ["stop"]))
                }, [
                  vue.createElementVNode("image", {
                    class: "slot_btn_img_style",
                    src: "/static/app-plus/mebrs/delete.svg"
                  })
                ]),
                vue.createCommentVNode(' 		      <van-popup v-model="deleteRemarkFlag" teleport="body">\r\n				         <view class="confirm_dakuang_style">\r\n				           <view class="confirm_top_style">\r\n				             <text class="config_top_title_style">\u662F\u5426\u786E\u8BA4\u5220\u9664</text>\r\n				             <image\r\n				               class="delete_waring_style"\r\n				               src="../../static/app-plus/mebrs/delete.svg"\r\n				             ></image>\r\n				           </view>\r\n				           <view class="delet_remark"\r\n				             >\u786E\u8BA4\u5220\u9664\u8BE5\u5B66\u5458\u5417\uFF1F\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D</view\r\n				           >\r\n				           <view class="delete_btn_style">\r\n				             <view class="delete_cacel_style" @click.stop="deleteRemarkFlag=false">\u53D6\u6D88</view>\r\n				             <view class="delete_sure_style" @click.stop.native="sureDeleteConfirm">\u786E\u8BA4</view>\r\n				           </view>\r\n				         </view>\r\n				       </van-popup> ')
              ]),
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "add_student_style" }, [
                  vue.createElementVNode("view", {
                    class: "need_loop_style",
                    onClick: vue.withModifiers(($event) => $options.updateMember(item), ["stop"])
                  }, [
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
                        onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.goToNewWorkout && $options.goToNewWorkout(...args), ["stop"]))
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
                      vue.createElementVNode("view", {
                        class: "bottom_style",
                        onClick: vue.withModifiers(($event) => $options.jumpPhysicalAssessment(item), ["stop"])
                      }, [
                        vue.createElementVNode("image", {
                          class: "bootom_img_style",
                          src: "/static/app-plus/mebrs/evaluationInformation.svg"
                        }),
                        vue.createElementVNode("text", { class: "message_style" }, "\u8BC4\u6D4B\u4FE1\u606F")
                      ], 8, ["onClick"]),
                      vue.createElementVNode("view", {
                        class: "bottom_style",
                        onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.goToTrainingRecord && $options.goToTrainingRecord(...args), ["stop"]))
                      }, [
                        vue.createElementVNode("image", {
                          class: "bootom_img_style",
                          src: "/static/app-plus/mebrs/trainingLog.svg"
                        }),
                        vue.createElementVNode("text", { class: "message_style" }, "\u8BAD\u7EC3\u8BB0\u5F55")
                      ])
                    ])
                  ], 8, ["onClick"])
                ])
              ]),
              _: 2
            }, 1032, ["show", "onChange"])
          ]),
          _: 2
        }, 1024);
      }), 128))
    ]);
  }
  const MemberList = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-fce7d226"], ["__file", "D:/studyUninApp/bodybuilding-app/components/memberList/memberList.vue"]]);
  const _sfc_main$x = {
    components: {
      BgTheamCompontent,
      MemberList
    },
    data() {
      return {
        meberList: [],
        isActive: 1,
        deleteRemarkFlag: false,
        loginNum: 0,
        showPopover: false,
        scrollTop: 0,
        cellingFlag: false,
        delteIndex: 0
      };
    },
    onLoad() {
    },
    created() {
    },
    mounted() {
      let self2 = this;
      uni.getStorage({
        key: "loginNum",
        success: function(res2) {
          if (res2.data) {
            self2.loginNum = res2.data;
            self2.showPopover = res2.data == "0" ? true : false;
          }
        },
        fail: function(err) {
        }
      });
    },
    methods: {
      jumpQuery() {
        formatAppLog("log", "at pages/myMebers/myMebers.vue:118", 111);
        uni.navigateTo({
          url: "/pages/memberQuery/memberQuery",
          success: (res2) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      },
      memberSrollTop(event) {
        this.scrollTop = event.detail.scrollTop;
        this.cellingFlag = this.scrollTop > 50 ? true : false;
      },
      clickOverlay() {
        uni.setStorageSync("loginNum", "1");
      },
      addClick() {
        uni.navigateTo({
          url: "/pages/addMyMebers/addMyMebers",
          success: (res2) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      },
      buyClick(type) {
        this.isActive = type;
      }
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_MemberList = vue.resolveComponent("MemberList");
    const _component_van_popup = vue.resolveComponent("van-popup");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createCommentVNode(" \u8FD9\u91CC\u662F\u72B6\u6001\u680F "),
      vue.createCommentVNode(' 	<view class="status_bar">\r\n	</view> '),
      vue.createElementVNode("view", { class: "content_style" }, [
        vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
        vue.createCommentVNode("\u5185\u5BB9 start"),
        vue.createElementVNode("scroll-view", {
          onScroll: _cache[3] || (_cache[3] = (...args) => $options.memberSrollTop && $options.memberSrollTop(...args)),
          "scroll-y": "true"
        }, [
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
            vue.createElementVNode("view", {
              class: vue.normalizeClass(["header_right_style", $data.cellingFlag ? "search_anmition_style" : ""])
            }, [
              vue.createElementVNode("image", {
                class: "right_img_style",
                src: "/static/app-plus/mebrs/fangdajing.svg",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.jumpQuery && $options.jumpQuery(...args))
              })
            ], 2)
          ]),
          vue.createElementVNode("view", {
            class: vue.normalizeClass(["is_buy_style", $data.cellingFlag ? "celling_animation_style" : ""])
          }, [
            vue.createElementVNode("view", {
              class: vue.normalizeClass(["buy_left", $data.isActive === 1 ? "active" : ""]),
              onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => $options.buyClick(1), ["stop"]))
            }, "\u5DF2\u8D2D\u8BFE", 2),
            vue.createElementVNode("view", {
              class: vue.normalizeClass(["buy_right", $data.isActive === 0 ? "active" : ""]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.buyClick(0))
            }, "\u672A\u8D2D\u8BFE", 2)
          ], 2),
          vue.createVNode(_component_MemberList, {
            isActive: $data.isActive,
            type: "home"
          }, null, 8, ["isActive"])
        ], 32),
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["btn_add", $data.loginNum == 0 ? "guid_style" : ""])
        }, [
          vue.createVNode(_component_van_popup, {
            ref: "memberPopover",
            onClickOverlay: $options.clickOverlay,
            overlay: true,
            show: $data.showPopover,
            "onUpdate:show": _cache[5] || (_cache[5] = ($event) => $data.showPopover = $event),
            placement: "left"
          }, {
            reference: vue.withCtx(() => [
              vue.createElementVNode("image", {
                class: "add_img_style",
                src: "/static/app-plus/mebrs/add.svg",
                onClick: _cache[4] || (_cache[4] = vue.withModifiers((...args) => $options.addClick && $options.addClick(...args), ["stop"]))
              })
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "pop_tips_style pad_style" }, "Hi\uFF5E\u4F60\u6765\u4E86"),
              vue.createElementVNode("view", { class: "pop_tips_style" }, "\u70B9\u8FD9\u91CC\u6DFB\u52A0\u4F1A\u5458\u5427")
            ]),
            _: 1
          }, 8, ["onClickOverlay", "show"])
        ], 2)
      ])
    ], 2112);
  }
  const PagesMyMebersMyMebers = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__file", "D:/studyUninApp/bodybuilding-app/pages/myMebers/myMebers.vue"]]);
  const _sfc_main$w = {
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
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
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
  const NavBarCompontent = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-d4dd2266"], ["__file", "D:/studyUninApp/bodybuilding-app/components/navBarCompontent/navBarCompontent.vue"]]);
  var util = {};
  util.getCommonTime = function(date = new Date(), targetTimezone = 8) {
    let res2 = {};
    const dif = date.getTimezoneOffset();
    const timeDif = dif * 60 * 1e3 + targetTimezone * 60 * 60 * 1e3;
    const { year, month, day, hour, minute, second } = util.getFullTime(date, 2);
    res2.now = {
      year,
      month,
      day,
      hour,
      minute,
      second
    };
    let month_last_day = new Date(year, month, 0).getDate();
    let year_last_day = new Date(year, 12, 0).getDate();
    res2.todayStart = new Date(`${year}/${month}/${day}`).getTime() - timeDif;
    res2.today12End = new Date(`${year}/${month}/${day}`).getTime() + (12 * 60 * 60 * 1e3 - 1) - timeDif;
    res2.todayEnd = new Date(`${year}/${month}/${day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    res2.monthStart = new Date(`${year}/${month}/1`).getTime() - timeDif;
    res2.monthEnd = new Date(`${year}/${month}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    res2.yearStart = new Date(`${year}/1/1`).getTime() - timeDif;
    res2.yearEnd = new Date(`${year}/12/${year_last_day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    let weekObj = util.getWeekStartAndEnd(0, date);
    res2.weekStart = weekObj.weekStart;
    res2.weekEnd = weekObj.weekEnd;
    res2.months = [];
    res2.months[0] = {
      monthStart: res2.monthStart,
      monthEnd: res2.monthEnd
    };
    for (let i2 = 1; i2 <= 12; i2++) {
      let month_last_day2 = new Date(year, i2, 0).getDate();
      let monthStart = new Date(`${year}/${i2}/1`).getTime() - timeDif;
      let monthEnd = new Date(`${year}/${i2}/${month_last_day2}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
      res2.months[i2] = {
        monthStart,
        monthEnd
      };
    }
    return res2;
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
    for (let k in opt) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? opt[k] : ("00" + opt[k]).substr(("" + opt[k]).length));
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
    let ss2 = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (type === 2) {
      return {
        YYYY: Number(YYYY),
        MM: Number(MM),
        DD: Number(DD),
        hh: Number(hh),
        mm: Number(mm),
        ss: Number(ss2),
        year: Number(YYYY),
        month: Number(MM),
        day: Number(DD),
        hour: Number(hh),
        minute: Number(mm),
        second: Number(ss2)
      };
    } else if (type === 1) {
      return YYYY + "" + MM + DD + hh + mm + ss2;
    } else {
      return YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss2;
    }
  };
  util.getWeekStartAndEnd = function(addWeekCount = 0, date = new Date(), targetTimezone = 8) {
    let res2 = {};
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
    res2.weekStart = new Date(`${weekStartObj.year}/${weekStartObj.month}/${weekStartObj.day}`).getTime() - timeDif;
    res2.weekEnd = new Date(`${weekEndObj.year}/${weekEndObj.month}/${weekEndObj.day}`).getTime() + (24 * 60 * 60 * 1e3 - 1) - timeDif;
    return res2;
  };
  const _sfc_main$v = {
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
        columns: [
          { text: "\u672A\u77E5", value: "0" },
          { text: "\u7537", value: "1" },
          { text: "\u5973", value: "2" }
        ],
        showPicker: false,
        minDate: new Date(1888, 1, 1),
        maxDate: new Date(2025, 10, 1),
        dateShowpicker: false,
        currentDate: new Date(),
        customFieldName: { text: "text", value: "value" },
        gendDefaultIndex: 0,
        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
        requestItem: null,
        leftNavTitle: "\u6DFB\u52A0\u5B66\u5458"
      };
    },
    onLoad(options) {
      if (JSON.stringify(options) !== "{}") {
        let requestItem = options.hasOwnProperty("item") ? JSON.parse(options.item) : null;
        this.studentForm = this.requestItem = requestItem;
        this.currentDate = new Date(requestItem.birthday);
        this.gender = this.columns.find(
          (v2) => v2.value === requestItem.gender
        ).text;
        this.leftNavTitle = "\u57FA\u7840\u4FE1\u606F";
      }
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
        this.studentForm.birthday = util.timeFormat(
          this.currentDate,
          "yyyy-MM-dd"
        );
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
      addDirectly(type) {
        var that = this;
        formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:208", type, "nishi");
        this.$refs.studentForm.validate().then(() => {
          let businessCloudObject2 = As.importObject("businessCloudObject");
          formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:213", that.requestItem, "that.requestItem");
          if (type == "edit" || that.requestItem) {
            businessCloudObject2.updateMember(that.studentForm).then((updateRes) => {
              if (updateRes.success) {
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
                uni.showToast({
                  icon: "fail",
                  title: res.message,
                  duration: 800
                });
              }
            }).catch((err) => {
              uni.showToast({
                icon: "\u7F16\u8F91\u5931\u8D25",
                title: res.message,
                duration: 800
              });
            });
            return;
          }
          businessCloudObject2.addMember(that.studentForm).then((res2) => {
            if (res2.success) {
              formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:254", type, ">>>>");
              if (type == "body") {
                businessCloudObject2.getOnlyList({ traineeName: that.studentForm.traineeName, mobile: that.studentForm.mobile }).then((res3) => {
                  formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:257", res3, "\u5373\u5C06\u53D1\u9001\u7684res");
                  if (res3.success) {
                    let data = res3.data;
                    uni.navigateTo({
                      url: "/pages/physicalAssessment/physicalAssessment?traineeNo=" + data[0]._id
                    });
                  }
                }).catch((err) => {
                });
              } else {
                uni.switchTab({
                  url: "/pages/myMebers/myMebers",
                  success: (res3) => {
                  },
                  fail: () => {
                  },
                  complete: () => {
                  }
                });
              }
              uni.showToast({
                icon: "success",
                title: res2.message,
                duration: 800
              });
            } else {
              formatAppLog("log", "at pages/addMyMebers/addMyMebers.vue:284", 2);
              uni.showToast({
                icon: "fail",
                title: res2.message,
                duration: 800
              });
            }
          }).catch((err) => {
          });
        }).catch((err) => {
        });
      },
      onConfirm() {
      },
      onSubmit() {
      },
      buyClick(type) {
        this.studentForm.buyStatus = type;
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: $data.leftNavTitle }, null, 8, ["leftNavTitle"]),
      vue.createElementVNode("view", { class: "contetnt_form_style" }, [
        vue.createCommentVNode(`      <van-form @submit="onSubmit" ref="studentForm">\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="studentForm.traineeName"\r
            name="traineeName"\r
            label="\u771F\u5B9E\u59D3\u540D(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u586B\u5199\u59D3\u540D"\r
            :rules="[{ required: true, message: '\u8BF7\u586B\u5199\u771F\u5B9E\u59D3\u540D' }]"\r
          />\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="gender"\r
            is-link\r
            readonly\r
            name="gender"\r
            label="\u6027\u522B(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u9009\u62E9\u6027\u522B"\r
            @click="showPicker = true"\r
            :rules="[{ required: true, message: '\u8BF7\u9009\u62E9\u6027\u522B' }]"\r
          />\r
          <van-popup v-model:show="showPicker" position="bottom">\r
            <van-picker\r
              :columns="columns"\r
              ref="gendPicker"\r
              @confirm="genderConfirm"\r
              @cancel="showPicker = false"\r
              :show-toolbar="true"\r
              title="\u8BF7\u9009\u62E9\u6027\u522B"\r
              :defaultIndex="gendDefaultIndex"\r
            >\r
            </van-picker>\r
          </van-popup>\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="studentForm.birthday"\r
            is-link\r
            readonly\r
            name="picker"\r
            label="\u751F\u65E5(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u9009\u62E9\u751F\u65E5"\r
            @click="dateShowpicker = true"\r
            :rules="[{ required: true, message: '\u8BF7\u9009\u62E9\u751F\u65E5' }]"\r
          />\r
          <van-popup v-model:show="dateShowpicker" position="bottom">\r
            <van-datetime-picker\r
              v-model="currentDate"\r
              type="date"\r
              title="\u9009\u62E9\u5E74\u6708\u65E5"\r
              :min-date="minDate"\r
              :max-date="maxDate"\r
              @confirm="birthConfirm"\r
              @cancel="dateShowpicker = false"\r
              :formatter="formatter"\r
            />\r
          </van-popup>\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="studentForm.mobile"\r
            name="pattern"\r
            label="\u624B\u673A\u53F7\u7801(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801"\r
            type="tel"\r
            maxlength="11"\r
            :rules="[{ pattern, message: '\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7\u7801' }]"\r
          />\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <view class="is_buy_content_style van-cell">\r
            <text class="buy_text_style">\u662F\u5426\u5DF2\u8D2D\u8BFE</text>\r
            <view class="is_buy_style">\r
              <view\r
                class="buy_left"\r
                :class="studentForm.buyStatus == 0 ? 'active' : ''"\r
                @click.native="buyClick(0)"\r
                >\u65E0</view\r
              >\r
              <view\r
                class="buy_right"\r
                :class="studentForm.buyStatus == 1 ? 'active' : ''"\r
                @click.native="buyClick(1)"\r
                >\u6709</view\r
              >\r
            </view>\r
          </view>\r
        </van-cell-group>\r
        <view class="add_method_style" v-if="leftNavTitle === '\u6DFB\u52A0\u5B66\u5458'">\r
          <view class="add_left_style" @click.native="addDirectly"\r
            >\u76F4\u63A5\u6DFB\u52A0</view\r
          >\r
          <view class="add_right_style" @click.native="addDirectly('body')"\r
            >\u8EAB\u4F53\u8BC4\u6D4B\u5E76\u6DFB\u52A0</view\r
          >\r
        </view>\r
        <view\r
          class="add_method_style edit_save_style"\r
          @click.native="addDirectly('edit')"\r
          v-else\r
        >\r
          \u4FDD\u5B58\r
        </view>\r
      </van-form> `)
      ])
    ]);
  }
  const PagesAddMyMebersAddMyMebers = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-67c2db77"], ["__file", "D:/studyUninApp/bodybuilding-app/pages/addMyMebers/addMyMebers.vue"]]);
  const icons = {
    "id": "2852637",
    "name": "uniui\u56FE\u6807\u5E93",
    "font_family": "uniicons",
    "css_prefix_text": "uniui-",
    "description": "",
    "glyphs": [
      {
        "icon_id": "25027049",
        "name": "yanse",
        "font_class": "color",
        "unicode": "e6cf",
        "unicode_decimal": 59087
      },
      {
        "icon_id": "25027048",
        "name": "wallet",
        "font_class": "wallet",
        "unicode": "e6b1",
        "unicode_decimal": 59057
      },
      {
        "icon_id": "25015720",
        "name": "settings-filled",
        "font_class": "settings-filled",
        "unicode": "e6ce",
        "unicode_decimal": 59086
      },
      {
        "icon_id": "25015434",
        "name": "shimingrenzheng-filled",
        "font_class": "auth-filled",
        "unicode": "e6cc",
        "unicode_decimal": 59084
      },
      {
        "icon_id": "24934246",
        "name": "shop-filled",
        "font_class": "shop-filled",
        "unicode": "e6cd",
        "unicode_decimal": 59085
      },
      {
        "icon_id": "24934159",
        "name": "staff-filled-01",
        "font_class": "staff-filled",
        "unicode": "e6cb",
        "unicode_decimal": 59083
      },
      {
        "icon_id": "24932461",
        "name": "VIP-filled",
        "font_class": "vip-filled",
        "unicode": "e6c6",
        "unicode_decimal": 59078
      },
      {
        "icon_id": "24932462",
        "name": "plus_circle_fill",
        "font_class": "plus-filled",
        "unicode": "e6c7",
        "unicode_decimal": 59079
      },
      {
        "icon_id": "24932463",
        "name": "folder_add-filled",
        "font_class": "folder-add-filled",
        "unicode": "e6c8",
        "unicode_decimal": 59080
      },
      {
        "icon_id": "24932464",
        "name": "yanse-filled",
        "font_class": "color-filled",
        "unicode": "e6c9",
        "unicode_decimal": 59081
      },
      {
        "icon_id": "24932465",
        "name": "tune-filled",
        "font_class": "tune-filled",
        "unicode": "e6ca",
        "unicode_decimal": 59082
      },
      {
        "icon_id": "24932455",
        "name": "a-rilidaka-filled",
        "font_class": "calendar-filled",
        "unicode": "e6c0",
        "unicode_decimal": 59072
      },
      {
        "icon_id": "24932456",
        "name": "notification-filled",
        "font_class": "notification-filled",
        "unicode": "e6c1",
        "unicode_decimal": 59073
      },
      {
        "icon_id": "24932457",
        "name": "wallet-filled",
        "font_class": "wallet-filled",
        "unicode": "e6c2",
        "unicode_decimal": 59074
      },
      {
        "icon_id": "24932458",
        "name": "paihangbang-filled",
        "font_class": "medal-filled",
        "unicode": "e6c3",
        "unicode_decimal": 59075
      },
      {
        "icon_id": "24932459",
        "name": "gift-filled",
        "font_class": "gift-filled",
        "unicode": "e6c4",
        "unicode_decimal": 59076
      },
      {
        "icon_id": "24932460",
        "name": "fire-filled",
        "font_class": "fire-filled",
        "unicode": "e6c5",
        "unicode_decimal": 59077
      },
      {
        "icon_id": "24928001",
        "name": "refreshempty",
        "font_class": "refreshempty",
        "unicode": "e6bf",
        "unicode_decimal": 59071
      },
      {
        "icon_id": "24926853",
        "name": "location-ellipse",
        "font_class": "location-filled",
        "unicode": "e6af",
        "unicode_decimal": 59055
      },
      {
        "icon_id": "24926735",
        "name": "person-filled",
        "font_class": "person-filled",
        "unicode": "e69d",
        "unicode_decimal": 59037
      },
      {
        "icon_id": "24926703",
        "name": "personadd-filled",
        "font_class": "personadd-filled",
        "unicode": "e698",
        "unicode_decimal": 59032
      },
      {
        "icon_id": "24923351",
        "name": "back",
        "font_class": "back",
        "unicode": "e6b9",
        "unicode_decimal": 59065
      },
      {
        "icon_id": "24923352",
        "name": "forward",
        "font_class": "forward",
        "unicode": "e6ba",
        "unicode_decimal": 59066
      },
      {
        "icon_id": "24923353",
        "name": "arrowthinright",
        "font_class": "arrow-right",
        "unicode": "e6bb",
        "unicode_decimal": 59067
      },
      {
        "icon_id": "24923353",
        "name": "arrowthinright",
        "font_class": "arrowthinright",
        "unicode": "e6bb",
        "unicode_decimal": 59067
      },
      {
        "icon_id": "24923354",
        "name": "arrowthinleft",
        "font_class": "arrow-left",
        "unicode": "e6bc",
        "unicode_decimal": 59068
      },
      {
        "icon_id": "24923354",
        "name": "arrowthinleft",
        "font_class": "arrowthinleft",
        "unicode": "e6bc",
        "unicode_decimal": 59068
      },
      {
        "icon_id": "24923355",
        "name": "arrowthinup",
        "font_class": "arrow-up",
        "unicode": "e6bd",
        "unicode_decimal": 59069
      },
      {
        "icon_id": "24923355",
        "name": "arrowthinup",
        "font_class": "arrowthinup",
        "unicode": "e6bd",
        "unicode_decimal": 59069
      },
      {
        "icon_id": "24923356",
        "name": "arrowthindown",
        "font_class": "arrow-down",
        "unicode": "e6be",
        "unicode_decimal": 59070
      },
      {
        "icon_id": "24923356",
        "name": "arrowthindown",
        "font_class": "arrowthindown",
        "unicode": "e6be",
        "unicode_decimal": 59070
      },
      {
        "icon_id": "24923349",
        "name": "arrowdown",
        "font_class": "bottom",
        "unicode": "e6b8",
        "unicode_decimal": 59064
      },
      {
        "icon_id": "24923349",
        "name": "arrowdown",
        "font_class": "arrowdown",
        "unicode": "e6b8",
        "unicode_decimal": 59064
      },
      {
        "icon_id": "24923346",
        "name": "arrowright",
        "font_class": "right",
        "unicode": "e6b5",
        "unicode_decimal": 59061
      },
      {
        "icon_id": "24923346",
        "name": "arrowright",
        "font_class": "arrowright",
        "unicode": "e6b5",
        "unicode_decimal": 59061
      },
      {
        "icon_id": "24923347",
        "name": "arrowup",
        "font_class": "top",
        "unicode": "e6b6",
        "unicode_decimal": 59062
      },
      {
        "icon_id": "24923347",
        "name": "arrowup",
        "font_class": "arrowup",
        "unicode": "e6b6",
        "unicode_decimal": 59062
      },
      {
        "icon_id": "24923348",
        "name": "arrowleft",
        "font_class": "left",
        "unicode": "e6b7",
        "unicode_decimal": 59063
      },
      {
        "icon_id": "24923348",
        "name": "arrowleft",
        "font_class": "arrowleft",
        "unicode": "e6b7",
        "unicode_decimal": 59063
      },
      {
        "icon_id": "24923334",
        "name": "eye",
        "font_class": "eye",
        "unicode": "e651",
        "unicode_decimal": 58961
      },
      {
        "icon_id": "24923335",
        "name": "eye-filled",
        "font_class": "eye-filled",
        "unicode": "e66a",
        "unicode_decimal": 58986
      },
      {
        "icon_id": "24923336",
        "name": "eye-slash",
        "font_class": "eye-slash",
        "unicode": "e6b3",
        "unicode_decimal": 59059
      },
      {
        "icon_id": "24923337",
        "name": "eye-slash-filled",
        "font_class": "eye-slash-filled",
        "unicode": "e6b4",
        "unicode_decimal": 59060
      },
      {
        "icon_id": "24923305",
        "name": "info-filled",
        "font_class": "info-filled",
        "unicode": "e649",
        "unicode_decimal": 58953
      },
      {
        "icon_id": "24923299",
        "name": "reload-01",
        "font_class": "reload",
        "unicode": "e6b2",
        "unicode_decimal": 59058
      },
      {
        "icon_id": "24923195",
        "name": "mic_slash_fill",
        "font_class": "micoff-filled",
        "unicode": "e6b0",
        "unicode_decimal": 59056
      },
      {
        "icon_id": "24923165",
        "name": "map-pin-ellipse",
        "font_class": "map-pin-ellipse",
        "unicode": "e6ac",
        "unicode_decimal": 59052
      },
      {
        "icon_id": "24923166",
        "name": "map-pin",
        "font_class": "map-pin",
        "unicode": "e6ad",
        "unicode_decimal": 59053
      },
      {
        "icon_id": "24923167",
        "name": "location",
        "font_class": "location",
        "unicode": "e6ae",
        "unicode_decimal": 59054
      },
      {
        "icon_id": "24923064",
        "name": "starhalf",
        "font_class": "starhalf",
        "unicode": "e683",
        "unicode_decimal": 59011
      },
      {
        "icon_id": "24923065",
        "name": "star",
        "font_class": "star",
        "unicode": "e688",
        "unicode_decimal": 59016
      },
      {
        "icon_id": "24923066",
        "name": "star-filled",
        "font_class": "star-filled",
        "unicode": "e68f",
        "unicode_decimal": 59023
      },
      {
        "icon_id": "24899646",
        "name": "a-rilidaka",
        "font_class": "calendar",
        "unicode": "e6a0",
        "unicode_decimal": 59040
      },
      {
        "icon_id": "24899647",
        "name": "fire",
        "font_class": "fire",
        "unicode": "e6a1",
        "unicode_decimal": 59041
      },
      {
        "icon_id": "24899648",
        "name": "paihangbang",
        "font_class": "medal",
        "unicode": "e6a2",
        "unicode_decimal": 59042
      },
      {
        "icon_id": "24899649",
        "name": "font",
        "font_class": "font",
        "unicode": "e6a3",
        "unicode_decimal": 59043
      },
      {
        "icon_id": "24899650",
        "name": "gift",
        "font_class": "gift",
        "unicode": "e6a4",
        "unicode_decimal": 59044
      },
      {
        "icon_id": "24899651",
        "name": "link",
        "font_class": "link",
        "unicode": "e6a5",
        "unicode_decimal": 59045
      },
      {
        "icon_id": "24899652",
        "name": "notification",
        "font_class": "notification",
        "unicode": "e6a6",
        "unicode_decimal": 59046
      },
      {
        "icon_id": "24899653",
        "name": "staff",
        "font_class": "staff",
        "unicode": "e6a7",
        "unicode_decimal": 59047
      },
      {
        "icon_id": "24899654",
        "name": "VIP",
        "font_class": "vip",
        "unicode": "e6a8",
        "unicode_decimal": 59048
      },
      {
        "icon_id": "24899655",
        "name": "folder_add",
        "font_class": "folder-add",
        "unicode": "e6a9",
        "unicode_decimal": 59049
      },
      {
        "icon_id": "24899656",
        "name": "tune",
        "font_class": "tune",
        "unicode": "e6aa",
        "unicode_decimal": 59050
      },
      {
        "icon_id": "24899657",
        "name": "shimingrenzheng",
        "font_class": "auth",
        "unicode": "e6ab",
        "unicode_decimal": 59051
      },
      {
        "icon_id": "24899565",
        "name": "person",
        "font_class": "person",
        "unicode": "e699",
        "unicode_decimal": 59033
      },
      {
        "icon_id": "24899566",
        "name": "email-filled",
        "font_class": "email-filled",
        "unicode": "e69a",
        "unicode_decimal": 59034
      },
      {
        "icon_id": "24899567",
        "name": "phone-filled",
        "font_class": "phone-filled",
        "unicode": "e69b",
        "unicode_decimal": 59035
      },
      {
        "icon_id": "24899568",
        "name": "phone",
        "font_class": "phone",
        "unicode": "e69c",
        "unicode_decimal": 59036
      },
      {
        "icon_id": "24899570",
        "name": "email",
        "font_class": "email",
        "unicode": "e69e",
        "unicode_decimal": 59038
      },
      {
        "icon_id": "24899571",
        "name": "personadd",
        "font_class": "personadd",
        "unicode": "e69f",
        "unicode_decimal": 59039
      },
      {
        "icon_id": "24899558",
        "name": "chatboxes-filled",
        "font_class": "chatboxes-filled",
        "unicode": "e692",
        "unicode_decimal": 59026
      },
      {
        "icon_id": "24899559",
        "name": "contact",
        "font_class": "contact",
        "unicode": "e693",
        "unicode_decimal": 59027
      },
      {
        "icon_id": "24899560",
        "name": "chatbubble-filled",
        "font_class": "chatbubble-filled",
        "unicode": "e694",
        "unicode_decimal": 59028
      },
      {
        "icon_id": "24899561",
        "name": "contact-filled",
        "font_class": "contact-filled",
        "unicode": "e695",
        "unicode_decimal": 59029
      },
      {
        "icon_id": "24899562",
        "name": "chatboxes",
        "font_class": "chatboxes",
        "unicode": "e696",
        "unicode_decimal": 59030
      },
      {
        "icon_id": "24899563",
        "name": "chatbubble",
        "font_class": "chatbubble",
        "unicode": "e697",
        "unicode_decimal": 59031
      },
      {
        "icon_id": "24881290",
        "name": "upload-filled",
        "font_class": "upload-filled",
        "unicode": "e68e",
        "unicode_decimal": 59022
      },
      {
        "icon_id": "24881292",
        "name": "upload",
        "font_class": "upload",
        "unicode": "e690",
        "unicode_decimal": 59024
      },
      {
        "icon_id": "24881293",
        "name": "weixin",
        "font_class": "weixin",
        "unicode": "e691",
        "unicode_decimal": 59025
      },
      {
        "icon_id": "24881274",
        "name": "compose",
        "font_class": "compose",
        "unicode": "e67f",
        "unicode_decimal": 59007
      },
      {
        "icon_id": "24881275",
        "name": "qq",
        "font_class": "qq",
        "unicode": "e680",
        "unicode_decimal": 59008
      },
      {
        "icon_id": "24881276",
        "name": "download-filled",
        "font_class": "download-filled",
        "unicode": "e681",
        "unicode_decimal": 59009
      },
      {
        "icon_id": "24881277",
        "name": "pengyouquan",
        "font_class": "pyq",
        "unicode": "e682",
        "unicode_decimal": 59010
      },
      {
        "icon_id": "24881279",
        "name": "sound",
        "font_class": "sound",
        "unicode": "e684",
        "unicode_decimal": 59012
      },
      {
        "icon_id": "24881280",
        "name": "trash-filled",
        "font_class": "trash-filled",
        "unicode": "e685",
        "unicode_decimal": 59013
      },
      {
        "icon_id": "24881281",
        "name": "sound-filled",
        "font_class": "sound-filled",
        "unicode": "e686",
        "unicode_decimal": 59014
      },
      {
        "icon_id": "24881282",
        "name": "trash",
        "font_class": "trash",
        "unicode": "e687",
        "unicode_decimal": 59015
      },
      {
        "icon_id": "24881284",
        "name": "videocam-filled",
        "font_class": "videocam-filled",
        "unicode": "e689",
        "unicode_decimal": 59017
      },
      {
        "icon_id": "24881285",
        "name": "spinner-cycle",
        "font_class": "spinner-cycle",
        "unicode": "e68a",
        "unicode_decimal": 59018
      },
      {
        "icon_id": "24881286",
        "name": "weibo",
        "font_class": "weibo",
        "unicode": "e68b",
        "unicode_decimal": 59019
      },
      {
        "icon_id": "24881288",
        "name": "videocam",
        "font_class": "videocam",
        "unicode": "e68c",
        "unicode_decimal": 59020
      },
      {
        "icon_id": "24881289",
        "name": "download",
        "font_class": "download",
        "unicode": "e68d",
        "unicode_decimal": 59021
      },
      {
        "icon_id": "24879601",
        "name": "help",
        "font_class": "help",
        "unicode": "e679",
        "unicode_decimal": 59001
      },
      {
        "icon_id": "24879602",
        "name": "navigate-filled",
        "font_class": "navigate-filled",
        "unicode": "e67a",
        "unicode_decimal": 59002
      },
      {
        "icon_id": "24879603",
        "name": "plusempty",
        "font_class": "plusempty",
        "unicode": "e67b",
        "unicode_decimal": 59003
      },
      {
        "icon_id": "24879604",
        "name": "smallcircle",
        "font_class": "smallcircle",
        "unicode": "e67c",
        "unicode_decimal": 59004
      },
      {
        "icon_id": "24879605",
        "name": "minus-filled",
        "font_class": "minus-filled",
        "unicode": "e67d",
        "unicode_decimal": 59005
      },
      {
        "icon_id": "24879606",
        "name": "micoff",
        "font_class": "micoff",
        "unicode": "e67e",
        "unicode_decimal": 59006
      },
      {
        "icon_id": "24879588",
        "name": "closeempty",
        "font_class": "closeempty",
        "unicode": "e66c",
        "unicode_decimal": 58988
      },
      {
        "icon_id": "24879589",
        "name": "clear",
        "font_class": "clear",
        "unicode": "e66d",
        "unicode_decimal": 58989
      },
      {
        "icon_id": "24879590",
        "name": "navigate",
        "font_class": "navigate",
        "unicode": "e66e",
        "unicode_decimal": 58990
      },
      {
        "icon_id": "24879591",
        "name": "minus",
        "font_class": "minus",
        "unicode": "e66f",
        "unicode_decimal": 58991
      },
      {
        "icon_id": "24879592",
        "name": "image",
        "font_class": "image",
        "unicode": "e670",
        "unicode_decimal": 58992
      },
      {
        "icon_id": "24879593",
        "name": "mic",
        "font_class": "mic",
        "unicode": "e671",
        "unicode_decimal": 58993
      },
      {
        "icon_id": "24879594",
        "name": "paperplane",
        "font_class": "paperplane",
        "unicode": "e672",
        "unicode_decimal": 58994
      },
      {
        "icon_id": "24879595",
        "name": "close",
        "font_class": "close",
        "unicode": "e673",
        "unicode_decimal": 58995
      },
      {
        "icon_id": "24879596",
        "name": "help-filled",
        "font_class": "help-filled",
        "unicode": "e674",
        "unicode_decimal": 58996
      },
      {
        "icon_id": "24879597",
        "name": "plus-filled",
        "font_class": "paperplane-filled",
        "unicode": "e675",
        "unicode_decimal": 58997
      },
      {
        "icon_id": "24879598",
        "name": "plus",
        "font_class": "plus",
        "unicode": "e676",
        "unicode_decimal": 58998
      },
      {
        "icon_id": "24879599",
        "name": "mic-filled",
        "font_class": "mic-filled",
        "unicode": "e677",
        "unicode_decimal": 58999
      },
      {
        "icon_id": "24879600",
        "name": "image-filled",
        "font_class": "image-filled",
        "unicode": "e678",
        "unicode_decimal": 59e3
      },
      {
        "icon_id": "24855900",
        "name": "locked-filled",
        "font_class": "locked-filled",
        "unicode": "e668",
        "unicode_decimal": 58984
      },
      {
        "icon_id": "24855901",
        "name": "info",
        "font_class": "info",
        "unicode": "e669",
        "unicode_decimal": 58985
      },
      {
        "icon_id": "24855903",
        "name": "locked",
        "font_class": "locked",
        "unicode": "e66b",
        "unicode_decimal": 58987
      },
      {
        "icon_id": "24855884",
        "name": "camera-filled",
        "font_class": "camera-filled",
        "unicode": "e658",
        "unicode_decimal": 58968
      },
      {
        "icon_id": "24855885",
        "name": "chat-filled",
        "font_class": "chat-filled",
        "unicode": "e659",
        "unicode_decimal": 58969
      },
      {
        "icon_id": "24855886",
        "name": "camera",
        "font_class": "camera",
        "unicode": "e65a",
        "unicode_decimal": 58970
      },
      {
        "icon_id": "24855887",
        "name": "circle",
        "font_class": "circle",
        "unicode": "e65b",
        "unicode_decimal": 58971
      },
      {
        "icon_id": "24855888",
        "name": "checkmarkempty",
        "font_class": "checkmarkempty",
        "unicode": "e65c",
        "unicode_decimal": 58972
      },
      {
        "icon_id": "24855889",
        "name": "chat",
        "font_class": "chat",
        "unicode": "e65d",
        "unicode_decimal": 58973
      },
      {
        "icon_id": "24855890",
        "name": "circle-filled",
        "font_class": "circle-filled",
        "unicode": "e65e",
        "unicode_decimal": 58974
      },
      {
        "icon_id": "24855891",
        "name": "flag",
        "font_class": "flag",
        "unicode": "e65f",
        "unicode_decimal": 58975
      },
      {
        "icon_id": "24855892",
        "name": "flag-filled",
        "font_class": "flag-filled",
        "unicode": "e660",
        "unicode_decimal": 58976
      },
      {
        "icon_id": "24855893",
        "name": "gear-filled",
        "font_class": "gear-filled",
        "unicode": "e661",
        "unicode_decimal": 58977
      },
      {
        "icon_id": "24855894",
        "name": "home",
        "font_class": "home",
        "unicode": "e662",
        "unicode_decimal": 58978
      },
      {
        "icon_id": "24855895",
        "name": "home-filled",
        "font_class": "home-filled",
        "unicode": "e663",
        "unicode_decimal": 58979
      },
      {
        "icon_id": "24855896",
        "name": "gear",
        "font_class": "gear",
        "unicode": "e664",
        "unicode_decimal": 58980
      },
      {
        "icon_id": "24855897",
        "name": "smallcircle-filled",
        "font_class": "smallcircle-filled",
        "unicode": "e665",
        "unicode_decimal": 58981
      },
      {
        "icon_id": "24855898",
        "name": "map-filled",
        "font_class": "map-filled",
        "unicode": "e666",
        "unicode_decimal": 58982
      },
      {
        "icon_id": "24855899",
        "name": "map",
        "font_class": "map",
        "unicode": "e667",
        "unicode_decimal": 58983
      },
      {
        "icon_id": "24855825",
        "name": "refresh-filled",
        "font_class": "refresh-filled",
        "unicode": "e656",
        "unicode_decimal": 58966
      },
      {
        "icon_id": "24855826",
        "name": "refresh",
        "font_class": "refresh",
        "unicode": "e657",
        "unicode_decimal": 58967
      },
      {
        "icon_id": "24855808",
        "name": "cloud-upload",
        "font_class": "cloud-upload",
        "unicode": "e645",
        "unicode_decimal": 58949
      },
      {
        "icon_id": "24855809",
        "name": "cloud-download-filled",
        "font_class": "cloud-download-filled",
        "unicode": "e646",
        "unicode_decimal": 58950
      },
      {
        "icon_id": "24855810",
        "name": "cloud-download",
        "font_class": "cloud-download",
        "unicode": "e647",
        "unicode_decimal": 58951
      },
      {
        "icon_id": "24855811",
        "name": "cloud-upload-filled",
        "font_class": "cloud-upload-filled",
        "unicode": "e648",
        "unicode_decimal": 58952
      },
      {
        "icon_id": "24855813",
        "name": "redo",
        "font_class": "redo",
        "unicode": "e64a",
        "unicode_decimal": 58954
      },
      {
        "icon_id": "24855814",
        "name": "images-filled",
        "font_class": "images-filled",
        "unicode": "e64b",
        "unicode_decimal": 58955
      },
      {
        "icon_id": "24855815",
        "name": "undo-filled",
        "font_class": "undo-filled",
        "unicode": "e64c",
        "unicode_decimal": 58956
      },
      {
        "icon_id": "24855816",
        "name": "more",
        "font_class": "more",
        "unicode": "e64d",
        "unicode_decimal": 58957
      },
      {
        "icon_id": "24855817",
        "name": "more-filled",
        "font_class": "more-filled",
        "unicode": "e64e",
        "unicode_decimal": 58958
      },
      {
        "icon_id": "24855818",
        "name": "undo",
        "font_class": "undo",
        "unicode": "e64f",
        "unicode_decimal": 58959
      },
      {
        "icon_id": "24855819",
        "name": "images",
        "font_class": "images",
        "unicode": "e650",
        "unicode_decimal": 58960
      },
      {
        "icon_id": "24855821",
        "name": "paperclip",
        "font_class": "paperclip",
        "unicode": "e652",
        "unicode_decimal": 58962
      },
      {
        "icon_id": "24855822",
        "name": "settings",
        "font_class": "settings",
        "unicode": "e653",
        "unicode_decimal": 58963
      },
      {
        "icon_id": "24855823",
        "name": "search",
        "font_class": "search",
        "unicode": "e654",
        "unicode_decimal": 58964
      },
      {
        "icon_id": "24855824",
        "name": "redo-filled",
        "font_class": "redo-filled",
        "unicode": "e655",
        "unicode_decimal": 58965
      },
      {
        "icon_id": "24841702",
        "name": "list",
        "font_class": "list",
        "unicode": "e644",
        "unicode_decimal": 58948
      },
      {
        "icon_id": "24841489",
        "name": "mail-open-filled",
        "font_class": "mail-open-filled",
        "unicode": "e63a",
        "unicode_decimal": 58938
      },
      {
        "icon_id": "24841491",
        "name": "hand-thumbsdown-filled",
        "font_class": "hand-down-filled",
        "unicode": "e63c",
        "unicode_decimal": 58940
      },
      {
        "icon_id": "24841492",
        "name": "hand-thumbsdown",
        "font_class": "hand-down",
        "unicode": "e63d",
        "unicode_decimal": 58941
      },
      {
        "icon_id": "24841493",
        "name": "hand-thumbsup-filled",
        "font_class": "hand-up-filled",
        "unicode": "e63e",
        "unicode_decimal": 58942
      },
      {
        "icon_id": "24841494",
        "name": "hand-thumbsup",
        "font_class": "hand-up",
        "unicode": "e63f",
        "unicode_decimal": 58943
      },
      {
        "icon_id": "24841496",
        "name": "heart-filled",
        "font_class": "heart-filled",
        "unicode": "e641",
        "unicode_decimal": 58945
      },
      {
        "icon_id": "24841498",
        "name": "mail-open",
        "font_class": "mail-open",
        "unicode": "e643",
        "unicode_decimal": 58947
      },
      {
        "icon_id": "24841488",
        "name": "heart",
        "font_class": "heart",
        "unicode": "e639",
        "unicode_decimal": 58937
      },
      {
        "icon_id": "24839963",
        "name": "loop",
        "font_class": "loop",
        "unicode": "e633",
        "unicode_decimal": 58931
      },
      {
        "icon_id": "24839866",
        "name": "pulldown",
        "font_class": "pulldown",
        "unicode": "e632",
        "unicode_decimal": 58930
      },
      {
        "icon_id": "24813798",
        "name": "scan",
        "font_class": "scan",
        "unicode": "e62a",
        "unicode_decimal": 58922
      },
      {
        "icon_id": "24813786",
        "name": "bars",
        "font_class": "bars",
        "unicode": "e627",
        "unicode_decimal": 58919
      },
      {
        "icon_id": "24813788",
        "name": "cart-filled",
        "font_class": "cart-filled",
        "unicode": "e629",
        "unicode_decimal": 58921
      },
      {
        "icon_id": "24813790",
        "name": "checkbox",
        "font_class": "checkbox",
        "unicode": "e62b",
        "unicode_decimal": 58923
      },
      {
        "icon_id": "24813791",
        "name": "checkbox-filled",
        "font_class": "checkbox-filled",
        "unicode": "e62c",
        "unicode_decimal": 58924
      },
      {
        "icon_id": "24813794",
        "name": "shop",
        "font_class": "shop",
        "unicode": "e62f",
        "unicode_decimal": 58927
      },
      {
        "icon_id": "24813795",
        "name": "headphones",
        "font_class": "headphones",
        "unicode": "e630",
        "unicode_decimal": 58928
      },
      {
        "icon_id": "24813796",
        "name": "cart",
        "font_class": "cart",
        "unicode": "e631",
        "unicode_decimal": 58929
      }
    ]
  };
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$u = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: icons.glyphs
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v2) => v2.font_class === this.type);
        if (code) {
          return unescape(`%u${code.unicode}`);
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("text", {
      style: vue.normalizeStyle({ color: $props.color, "font-size": $options.iconSize }),
      class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
      onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
    }, null, 6);
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const en$1 = {
    "uni-search-bar.cancel": "cancel",
    "uni-search-bar.placeholder": "Search enter content"
  };
  const zhHans$1 = {
    "uni-search-bar.cancel": "cancel",
    "uni-search-bar.placeholder": "\u8BF7\u8F93\u5165\u641C\u7D22\u5185\u5BB9"
  };
  const zhHant$1 = {
    "uni-search-bar.cancel": "cancel",
    "uni-search-bar.placeholder": "\u8ACB\u8F38\u5165\u641C\u7D22\u5167\u5BB9"
  };
  const messages$1 = {
    en: en$1,
    "zh-Hans": zhHans$1,
    "zh-Hant": zhHant$1
  };
  const {
    t: t$1
  } = initVueI18n(messages$1);
  const _sfc_main$t = {
    name: "UniSearchBar",
    emits: ["input", "update:modelValue", "clear", "cancel", "confirm", "blur", "focus"],
    props: {
      placeholder: {
        type: String,
        default: ""
      },
      radius: {
        type: [Number, String],
        default: 5
      },
      clearButton: {
        type: String,
        default: "auto"
      },
      cancelButton: {
        type: String,
        default: "auto"
      },
      cancelText: {
        type: String,
        default: "\u53D6\u6D88"
      },
      bgColor: {
        type: String,
        default: "#F8F8F8"
      },
      maxlength: {
        type: [Number, String],
        default: 100
      },
      value: {
        type: [Number, String],
        default: ""
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      focus: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false,
        showSync: false,
        searchVal: ""
      };
    },
    computed: {
      cancelTextI18n() {
        return this.cancelText || t$1("uni-search-bar.cancel");
      },
      placeholderText() {
        return this.placeholder || t$1("uni-search-bar.placeholder");
      }
    },
    watch: {
      modelValue: {
        immediate: true,
        handler(newVal) {
          this.searchVal = newVal;
          if (newVal) {
            this.show = true;
          }
        }
      },
      focus: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            if (this.readonly)
              return;
            this.show = true;
            this.$nextTick(() => {
              this.showSync = true;
            });
          }
        }
      },
      searchVal(newVal, oldVal) {
        this.$emit("input", newVal);
        this.$emit("update:modelValue", newVal);
      }
    },
    methods: {
      searchClick() {
        if (this.readonly)
          return;
        if (this.show) {
          return;
        }
        this.show = true;
        this.$nextTick(() => {
          this.showSync = true;
        });
      },
      clear() {
        this.$emit("clear", {
          value: this.searchVal
        });
        this.searchVal = "";
      },
      cancel() {
        if (this.readonly)
          return;
        this.$emit("cancel", {
          value: this.searchVal
        });
        this.searchVal = "";
        this.show = false;
        this.showSync = false;
        plus.key.hideSoftKeybord();
      },
      confirm() {
        plus.key.hideSoftKeybord();
        this.$emit("confirm", {
          value: this.searchVal
        });
      },
      blur() {
        plus.key.hideSoftKeybord();
        this.$emit("blur", {
          value: this.searchVal
        });
      },
      emitFocus(e) {
        this.$emit("focus", e.detail);
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$3);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-searchbar" }, [
      vue.createElementVNode("view", {
        style: vue.normalizeStyle({ borderRadius: $props.radius + "px", backgroundColor: $props.bgColor }),
        class: "uni-searchbar__box",
        onClick: _cache[5] || (_cache[5] = (...args) => $options.searchClick && $options.searchClick(...args))
      }, [
        vue.createElementVNode("view", { class: "uni-searchbar__box-icon-search" }, [
          vue.renderSlot(_ctx.$slots, "searchIcon", {}, () => [
            vue.createVNode(_component_uni_icons, {
              color: "#c0c4cc",
              size: "18",
              type: "search"
            })
          ], true)
        ]),
        $data.show || $data.searchVal ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
          key: 0,
          focus: $data.showSync,
          disabled: $props.readonly,
          placeholder: $options.placeholderText,
          maxlength: $props.maxlength,
          class: "uni-searchbar__box-search-input",
          "confirm-type": "search",
          type: "text",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchVal = $event),
          onConfirm: _cache[1] || (_cache[1] = (...args) => $options.confirm && $options.confirm(...args)),
          onBlur: _cache[2] || (_cache[2] = (...args) => $options.blur && $options.blur(...args)),
          onFocus: _cache[3] || (_cache[3] = (...args) => $options.emitFocus && $options.emitFocus(...args))
        }, null, 40, ["focus", "disabled", "placeholder", "maxlength"])), [
          [vue.vModelText, $data.searchVal]
        ]) : (vue.openBlock(), vue.createElementBlock("text", {
          key: 1,
          class: "uni-searchbar__text-placeholder"
        }, vue.toDisplayString($props.placeholder), 1)),
        $data.show && ($props.clearButton === "always" || $props.clearButton === "auto" && $data.searchVal !== "") && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "uni-searchbar__box-icon-clear",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.clear && $options.clear(...args))
        }, [
          vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            vue.createVNode(_component_uni_icons, {
              color: "#c0c4cc",
              size: "20",
              type: "clear"
            })
          ], true)
        ])) : vue.createCommentVNode("v-if", true)
      ], 4),
      $props.cancelButton === "always" || $data.show && $props.cancelButton === "auto" ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 0,
        onClick: _cache[6] || (_cache[6] = (...args) => $options.cancel && $options.cancel(...args)),
        class: "uni-searchbar__cancel"
      }, vue.toDisplayString($options.cancelTextI18n), 1)) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-f07ef577"], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue"]]);
  const _sfc_main$s = {
    name: "UniSection",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        required: true,
        default: ""
      },
      titleFontSize: {
        type: String,
        default: "14px"
      },
      titleColor: {
        type: String,
        default: "#333"
      },
      subTitle: {
        type: String,
        default: ""
      },
      subTitleFontSize: {
        type: String,
        default: "12px"
      },
      subTitleColor: {
        type: String,
        default: "#999"
      },
      padding: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      _padding() {
        if (typeof this.padding === "string") {
          return this.padding;
        }
        return this.padding ? "10px" : "";
      }
    },
    watch: {
      title(newVal) {
        if (uni.report && newVal !== "") {
          uni.report("title", newVal);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-section" }, [
      vue.createElementVNode("view", {
        class: "uni-section-header",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.type ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: vue.normalizeClass(["uni-section-header__decoration", $props.type])
        }, null, 2)) : vue.renderSlot(_ctx.$slots, "decoration", { key: 1 }, void 0, true),
        vue.createElementVNode("view", { class: "uni-section-header__content" }, [
          vue.createElementVNode("text", {
            style: vue.normalizeStyle({ "font-size": $props.titleFontSize, "color": $props.titleColor }),
            class: vue.normalizeClass(["uni-section__content-title", { "distraction": !$props.subTitle }])
          }, vue.toDisplayString($props.title), 7),
          $props.subTitle ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            style: vue.normalizeStyle({ "font-size": $props.subTitleFontSize, "color": $props.subTitleColor }),
            class: "uni-section-header__content-sub"
          }, vue.toDisplayString($props.subTitle), 5)) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "uni-section-header__slot-right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ]),
      vue.createElementVNode("view", {
        class: "uni-section-content",
        style: vue.normalizeStyle({ padding: $options._padding })
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 4)
    ]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-637fd36b"], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  const _sfc_main$r = {
    components: {
      BgTheamCompontent,
      MemberList
    },
    data() {
      return {
        searchValue: "",
        cellingFlag: false,
        scrollTop: 0
      };
    },
    methods: {
      memberSrollTop(event) {
        this.scrollTop = event.detail.scrollTop;
        this.cellingFlag = event.detail.scrollTop > 50 ? true : false;
        formatAppLog("log", "at pages/memberQuery/memberQuery.vue:58", this.scrollTop);
      },
      goBack() {
        uni.switchTab({
          url: "/pages/myMebers/myMebers"
        });
      },
      searchFun(res2) {
        this.searchValue = res2.value;
      },
      input(res2) {
        formatAppLog("log", "at pages/memberQuery/memberQuery.vue:70", "----input:", res2);
      },
      clear(res2) {
        uni.showToast({
          title: "clear\u4E8B\u4EF6\uFF0C\u6E05\u9664\u503C\u4E3A\uFF1A" + res2.value,
          icon: "none"
        });
      },
      blur(res2) {
        uni.showToast({
          title: "blur\u4E8B\u4EF6\uFF0C\u8F93\u5165\u503C\u4E3A\uFF1A" + res2.value,
          icon: "none"
        });
      },
      focus(e) {
        uni.showToast({
          title: "focus\u4E8B\u4EF6\uFF0C\u8F93\u51FA\u503C\u4E3A\uFF1A" + e.value,
          icon: "none"
        });
      },
      cancel(res2) {
        uni.showToast({
          title: "\u70B9\u51FB\u53D6\u6D88\uFF0C\u8F93\u5165\u503C\u4E3A\uFF1A" + res2.value,
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_uni_search_bar = resolveEasycom(vue.resolveDynamicComponent("uni-search-bar"), __easycom_0$2);
    const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_1$1);
    const _component_MemberList = vue.resolveComponent("MemberList");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createElementVNode("scroll-view", {
        onScroll: _cache[2] || (_cache[2] = (...args) => $options.memberSrollTop && $options.memberSrollTop(...args)),
        "scroll-y": "true"
      }, [
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["nav_bar_style", $data.cellingFlag ? "nav_antimation_style" : ""])
        }, [
          vue.createElementVNode("view", {
            class: "nav_left_style",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
          }, [
            vue.createElementVNode("image", {
              class: "back_img_style",
              src: "/static/app-plus/mebrs/back.png"
            }),
            vue.createElementVNode("view", { class: "nav_title_style" })
          ]),
          vue.createElementVNode("text", { class: "nav_content_style" }, "\u4F1A\u5458\u67E5\u8BE2"),
          vue.createCommentVNode(" \u53EF\u80FD\u4F1A\u6709\u56FE\u7247 "),
          vue.createElementVNode("view", { class: "nav_right_style" })
        ], 2),
        vue.createVNode(_component_uni_section, { title: "" }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_uni_search_bar, {
              modelValue: $data.searchValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.searchValue = $event),
              class: vue.normalizeClass(["uni-mt-10", $data.cellingFlag ? "search_antimation_style" : ""]),
              radius: "100",
              placeholder: "\u8BF7\u8F93\u5165\u59D3\u540D\u6216\u624B\u673A\u53F7\u7801\u67E5\u8BE2",
              clearButton: "none",
              cancelButton: "none",
              onConfirm: $options.searchFun
            }, null, 8, ["modelValue", "class", "onConfirm"])
          ]),
          _: 1
        }),
        vue.createVNode(_component_MemberList, {
          searchValue: $data.searchValue,
          type: "detail"
        }, null, 8, ["searchValue"])
      ], 32)
    ]);
  }
  const PagesMemberQueryMemberQuery = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__file", "D:/studyUninApp/bodybuilding-app/pages/memberQuery/memberQuery.vue"]]);
  const _sfc_main$q = {
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
        return { ...this.listInitStyle, ...this.listStyle };
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
            complete: (res2) => {
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
      async initValue(i2, from2) {
        this.isLoaded = false;
        if (i2 >= this.data.list.length || this.refreshDatas.length) {
          this.msg++;
          this.loaded();
          return false;
        }
        const minHeightRes = await this.getMinColumnHeight();
        const c2 = this.data[`column_${minHeightRes.column}_values`];
        this.data.list[i2].column = minHeightRes.column;
        c2.push({ ...this.data.list[i2], cIndex: c2.length, index: i2, o: 0 });
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
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-6aaf0fae"], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue"]]);
  const _sfc_main$p = {
    components: {
      BgTheamCompontent,
      NavBarCompontent,
      CustomWaterfallsFlow: __easycom_0$1
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
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_custom_waterfalls_flow = resolveEasycom(vue.resolveDynamicComponent("custom-waterfalls-flow"), __easycom_0$1);
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
  const PagesBodyAssessmentBodyAssessment = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__file", "D:/studyUninApp/bodybuilding-app/pages/bodyAssessment/bodyAssessment.vue"]]);
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
        columns: [
          { text: "\u672A\u77E5", value: "0" },
          { text: "\u7537", value: "1" },
          { text: "\u5973", value: "2" }
        ],
        showPicker: false,
        minDate: new Date(1888, 1, 1),
        maxDate: new Date(2025, 10, 1),
        dateShowpicker: false,
        currentDate: new Date(),
        customFieldName: { text: "text", value: "value" },
        gendDefaultIndex: 0,
        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
        requestItem: null
      };
    },
    onLoad(options) {
      if (JSON.stringify(options) !== "{}") {
        let requestItem = options.hasOwnProperty("item") ? JSON.parse(options.item) : null;
        this.studentForm = this.requestItem = requestItem;
        this.currentDate = new Date(requestItem.birthday);
        this.gender = this.columns.find(
          (v2) => v2.value === requestItem.gender
        ).text;
        this.leftNavTitle = "\u57FA\u7840\u4FE1\u606F";
      }
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
        this.studentForm.birthday = util.timeFormat(
          this.currentDate,
          "yyyy-MM-dd"
        );
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
      addDirectly(type) {
        var that = this;
        formatAppLog("log", "at pages/bodyTestReport/bodyTestReport.vue:182", type, "nishi");
        this.$refs.studentForm.validate().then(() => {
          let businessCloudObject2 = As.importObject("businessCloudObject");
          formatAppLog("log", "at pages/bodyTestReport/bodyTestReport.vue:187", that.requestItem, "that.requestItem");
          if (type == "edit" || that.requestItem) {
            businessCloudObject2.updateMember(that.studentForm).then((updateRes) => {
              if (updateRes.success) {
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
                uni.showToast({
                  icon: "fail",
                  title: res.message,
                  duration: 800
                });
              }
            }).catch((err) => {
              uni.showToast({
                icon: "\u7F16\u8F91\u5931\u8D25",
                title: res.message,
                duration: 800
              });
            });
            return;
          }
          businessCloudObject2.addMember(that.studentForm).then((res2) => {
            if (res2.success) {
              formatAppLog("log", "at pages/bodyTestReport/bodyTestReport.vue:228", type, ">>>>");
              if (type == "body") {
                uni.navigateTo({
                  url: "/pages/physicalAssessment/physicalAssessment"
                });
              } else {
                uni.switchTab({
                  url: "/pages/myMebers/myMebers",
                  success: (res3) => {
                  },
                  fail: () => {
                  },
                  complete: () => {
                  }
                });
              }
              uni.showToast({
                icon: "success",
                title: res2.message,
                duration: 800
              });
            } else {
              formatAppLog("log", "at pages/bodyTestReport/bodyTestReport.vue:248", 2);
              uni.showToast({
                icon: "fail",
                title: res2.message,
                duration: 800
              });
            }
          }).catch((err) => {
          });
        }).catch((err) => {
        });
      },
      onConfirm() {
      },
      onSubmit() {
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "\u4F53\u4FA7\u62A5\u544A\u586B\u5199" }),
      vue.createElementVNode("view", { class: "contetnt_form_style" }, [
        vue.createCommentVNode(`      <van-form @submit="onSubmit" ref="studentForm">\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="studentForm.traineeName"\r
            name="traineeName"\r
            label="\u771F\u5B9E\u59D3\u540D(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u586B\u5199\u59D3\u540D"\r
            :rules="[{ required: true, message: '\u8BF7\u586B\u5199\u771F\u5B9E\u59D3\u540D' }]"\r
          />\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="gender"\r
            is-link\r
            readonly\r
            name="gender"\r
            label="\u6027\u522B(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u9009\u62E9\u6027\u522B"\r
            @click="showPicker = true"\r
            :rules="[{ required: true, message: '\u8BF7\u9009\u62E9\u6027\u522B' }]"\r
          />\r
          <van-popup v-model:show="showPicker" position="bottom">\r
            <van-picker\r
              :columns="columns"\r
              ref="gendPicker"\r
              @confirm="genderConfirm"\r
              @cancel="showPicker = false"\r
              :show-toolbar="true"\r
              title="\u8BF7\u9009\u62E9\u6027\u522B"\r
              :defaultIndex="gendDefaultIndex"\r
            >\r
            </van-picker>\r
          </van-popup>\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="studentForm.birthday"\r
            is-link\r
            readonly\r
            name="picker"\r
            label="\u751F\u65E5(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u9009\u62E9\u751F\u65E5"\r
            @click="dateShowpicker = true"\r
            :rules="[{ required: true, message: '\u8BF7\u9009\u62E9\u751F\u65E5' }]"\r
          />\r
          <van-popup v-model:show="dateShowpicker" position="bottom">\r
            <van-datetime-picker\r
              v-model="currentDate"\r
              type="date"\r
              title="\u9009\u62E9\u5E74\u6708\u65E5"\r
              :min-date="minDate"\r
              :max-date="maxDate"\r
              @confirm="birthConfirm"\r
              @cancel="dateShowpicker = false"\r
              :formatter="formatter"\r
            />\r
          </van-popup>\r
        </van-cell-group>\r
        <van-cell-group inset>\r
          <van-field\r
            v-model="studentForm.mobile"\r
            name="pattern"\r
            label="\u624B\u673A\u53F7\u7801(\u5FC5\u586B)"\r
            placeholder="\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801"\r
            type="tel"\r
            maxlength="11"\r
            :rules="[{ pattern, message: '\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7\u7801' }]"\r
          />\r
        </van-cell-group>\r
\r
\r
        <view\r
          class="add_method_style edit_save_style"\r
          @click.native="addDirectly('edit')"\r
        \r
        >\r
          \u786E\u8BA4\r
        </view>\r
      </van-form> `)
      ])
    ]);
  }
  const PagesBodyTestReportBodyTestReport = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-641854c1"], ["__file", "D:/studyUninApp/bodybuilding-app/pages/bodyTestReport/bodyTestReport.vue"]]);
  var businessCloudObject$1 = As.importObject("businessCloudObject");
  const _sfc_main$n = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        dynamicEvaluationdata: [],
        icon: true,
        traineeNo: ""
      };
    },
    created() {
      this.requestDynamicEvaluationdata();
    },
    onLoad(options) {
      if (JSON.stringify(options) !== "{}" && options.traineeNo) {
        this.traineeNo = options.traineeNo;
      }
    },
    methods: {
      jumpModular(item) {
        if (item.hasOwnProperty("path") && item.path && this.traineeNo) {
          businessCloudObject$1.getPhysicalChildAssessmentList(item.code).then((res2) => {
            if (res2.success) {
              let childList = res2.data;
              uni.navigateTo({
                url: item.path + "?childList=" + JSON.stringify(childList) + "&traineeNo=" + this.traineeNo + "&questionCode=" + item.code,
                success: (res3) => {
                },
                fail: () => {
                },
                complete: () => {
                }
              });
            }
            formatAppLog("log", "at pages/physicalAssessment/physicalAssessment.vue:112", res2, "\u6211\u662F\u5B50\u9009\u9879");
          }).catch((err) => {
          });
        }
      },
      requestDynamicEvaluationdata() {
        businessCloudObject$1.getPhysicalAssessmentList().then((res2) => {
          let firstData = res2.data;
          businessCloudObject$1.opearConfigAllList(this.traineeNo).then((allRes) => {
            firstData = firstData.map((item) => {
              let isFinsh = false;
              if (allRes.affectedDocs > 0) {
                allRes.data.forEach((v2) => {
                  formatAppLog("log", "at pages/physicalAssessment/physicalAssessment.vue:136", v2, "\u4EC0\u4E48\u9B3C");
                  if (v2.questionCode === item.code) {
                    let needCompareData = v2.testResult.filter((c2) => c2.answer.length > 0);
                    if (needCompareData.length > 0) {
                      isFinsh = true;
                    }
                  }
                });
              }
              return {
                ...item,
                isFinsh
              };
            });
            formatAppLog("log", "at pages/physicalAssessment/physicalAssessment.vue:154", firstData, "\u6211\u6052\u5F3A");
            this.dynamicEvaluationdata = firstData;
          });
        }).catch((err) => {
        });
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
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
                  onClick: vue.withModifiers(($event) => $options.jumpModular(item), ["stop"]),
                  key: index
                }, [
                  vue.createElementVNode("view", { class: "dynamicshow_left" }, [
                    item.isFinsh ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "correct"
                    }, [
                      vue.createElementVNode("image", {
                        class: "correct_img_style",
                        src: "/static/app-plus/other/yesActive.png"
                      })
                    ])) : (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "correct"
                    }, [
                      vue.createElementVNode("image", {
                        class: "correct_img_style",
                        src: "/static/app-plus/other/yesNoActive.png"
                      })
                    ])),
                    vue.createElementVNode("text", { class: "evaluationdata" }, vue.toDisplayString(item.questionContent), 1)
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
  const PagesPhysicalAssessmentPhysicalAssessment = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-fc7c2e74"], ["__file", "D:/studyUninApp/bodybuilding-app/pages/physicalAssessment/physicalAssessment.vue"]]);
  var businessCloudObject = As.importObject("businessCloudObject");
  const _sfc_main$m = {
    components: {},
    data() {
      return {
        healthList: [],
        activeName: [0],
        traineeNo: "",
        originList: [],
        questionCode: ""
      };
    },
    onLoad(options) {
      if (JSON.stringify(options) !== "{}" && options.traineeNo) {
        this.traineeNo = options.traineeNo;
      }
      if (JSON.stringify(options) !== "{}" && options.hasOwnProperty("childList")) {
        let originList = JSON.parse(options.childList);
        this.originList = originList;
      }
      if (JSON.stringify(options) !== "{}" && options.hasOwnProperty("questionCode")) {
        this.questionCode = options.questionCode;
      }
    },
    computed: {
      handlerData() {
        return function(item) {
          let remark = "";
          if (item.answer.length > 0) {
            remark = item.answer[0].remark;
          }
          return {
            remark
          };
        };
      }
    },
    mounted() {
      this.requestList();
    },
    methods: {
      saveHealthQuession() {
        let testResult = [];
        let newList = JSON.parse(JSON.stringify(this.healthList));
        newList.forEach((item) => {
          if (item.questionType == 2) {
            delete item["remark"];
          }
          let resetList = item.answer.length > 0 ? item.answer.filter((k) => k.checked).map((z2) => {
            return z2;
          }) : [];
          let findResultChecked = resetList.find((k) => k.checked);
          let result = {
            code: item.code,
            answer: resetList.map((c2) => c2.answerTitle),
            remark: resetList.length > 0 ? findResultChecked.answerTitle === "\u662F" ? resetList[0].remark : "" : ""
          };
          testResult.push(result);
        });
        let saveParam = {
          traineeNo: this.traineeNo,
          questionCode: this.questionCode,
          testResult
        };
        businessCloudObject.opearConfig(saveParam, "physical").then((res2) => {
          formatAppLog("log", "at pages/healthQuesson/healthQuesson.vue:154", res2, "\u6211\u8981\u4FDD\u5B58\u4E86");
          if (res2.success) {
            uni.redirectTo({
              url: "/pages/physicalAssessment/physicalAssessment?traineeNo=" + this.traineeNo + "&questionCode=" + this.questionCode
            });
            uni.showToast({
              icon: "success",
              title: res2.message,
              duration: 800
            });
          }
        }).catch(() => {
        });
      },
      requestList() {
        businessCloudObject.opearConfigQuery({
          traineeNo: this.traineeNo,
          questionCode: this.questionCode
        }).then((res2) => {
          formatAppLog("log", "at pages/healthQuesson/healthQuesson.vue:176", res2, "kkkkk");
          if (res2.affectedDocs === 0) {
            let healthList = this.originList.map((item) => {
              let answer = item.answer.length > 0 ? item.answer.map((config) => {
                return {
                  ...config,
                  checked: false
                };
              }) : [];
              return {
                ...item,
                answer
              };
            });
            this.healthList = healthList;
          } else {
            let list = JSON.parse(JSON.stringify(this.originList));
            let healthList = list.map((item) => {
              let answer = item.answer.length > 0 ? item.answer.map((config) => {
                let compareData = res2.data[0];
                var checked = false;
                var remark = "";
                compareData.testResult.forEach((k) => {
                  if (item.code === k.code) {
                    if (item.questionType === 1) {
                      remark = k.remark || "";
                    }
                    k.answer.length > 0 ? k.answer.map((z2) => {
                      if (config.answerTitle === z2) {
                        checked = true;
                      }
                    }) : checked = false;
                  }
                });
                return {
                  ...config,
                  checked,
                  remark
                };
              }) : [];
              return {
                ...item,
                answer
              };
            });
            this.healthList = healthList;
          }
        }).catch((err) => {
        });
      },
      quesionClick(item, itemIndex, itemChild, itemChildIndex) {
        itemChild.checked = !itemChild.checked;
      },
      quesionChildClick(item, itemIndex, radioItem, radioItemIndex) {
        item.answer = item.answer.map((config, conifgIndex) => {
          if (conifgIndex === radioItemIndex) {
            return {
              ...config,
              checked: true
            };
          } else {
            return {
              ...config,
              checked: false
            };
          }
        });
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_bg_theam_compontent = vue.resolveComponent("bg-theam-compontent");
    const _component_nav_bar_compontent = vue.resolveComponent("nav-bar-compontent");
    const _component_van_collapse_item = vue.resolveComponent("van-collapse-item");
    const _component_van_collapse = vue.resolveComponent("van-collapse");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_bg_theam_compontent, { theamType: "currency" }),
      vue.createVNode(_component_nav_bar_compontent, { leftNavTitle: "\u5065\u5EB7\u95EE\u7B54" }),
      vue.createElementVNode("view", { class: "list_content_style" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.healthList, (item, itemIndex) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "need_loop_style",
            key: "key" + itemIndex
          }, [
            item.questionType === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
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
                    title: item.questionContent,
                    name: itemIndex
                  }, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("view", { class: "collapes_conten_style" }, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.answer, (itemChild, itemChildIndex) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: vue.normalizeClass(["collapes_tag_stylle", itemChild.checked ? "active" : ""]),
                            onClick: vue.withModifiers(($event) => $options.quesionClick(item, itemIndex, itemChild, itemChildIndex), ["stop"]),
                            key: "key" + itemChildIndex
                          }, vue.toDisplayString(itemChild.answerTitle), 11, ["onClick"]);
                        }), 128))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["title", "name"])
                ]),
                _: 2
              }, 1032, ["modelValue"])
            ])) : vue.createCommentVNode("v-if", true),
            item.questionType === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "radio_style"
            }, [
              vue.createElementVNode("view", { class: "radio_title_style" }, vue.toDisplayString(item.questionContent), 1),
              vue.createElementVNode("view", { class: "radio_tag_style" }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.answer, (radioItem, radioItemIndex) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["tag_style", radioItem.checked ? "active" : ""]),
                    key: "key" + radioItemIndex,
                    onClick: vue.withModifiers(($event) => $options.quesionChildClick(item, itemIndex, radioItem, radioItemIndex), ["stop"])
                  }, vue.toDisplayString(radioItem.answerTitle), 11, ["onClick"]);
                }), 128))
              ]),
              item.answer[0].checked ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "radio_remark_style"
              }, [
                vue.createCommentVNode(`          <van-field\r
              class="supplement_style"\r
              v-model="item.answer[0].remark"\r
              :placeholder="\r
                item.answerRemark && item.answerRemark.remarkTitle\r
                  ? item.answerRemark.remarkTitle\r
                  : '\u8BF7\u8865\u5145\u4FE1\u606F'\r
              "\r
            /> `)
              ])) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true)
          ]);
        }), 128))
      ]),
      vue.createElementVNode("view", {
        class: "bottom_style",
        onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.saveHealthQuession && $options.saveHealthQuession(...args), ["stop"]))
      }, "\u4FDD\u5B58")
    ]);
  }
  const PagesHealthQuessonHealthQuesson = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "D:/studyUninApp/bodybuilding-app/pages/healthQuesson/healthQuesson.vue"]]);
  const testOb$1 = As.importObject("testResults");
  const _sfc_main$l = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        currentRate: 50,
        age: 29,
        gender: "1",
        resultValue: 0,
        typeText: "\u5F85\u6D4B",
        typeColor: "#4B525E",
        dynamicEvaluationdata: [
          {
            title: "\u4FEF\u5367\u6491\u8010\u529B\u6D4B\u8BD5",
            type: 60,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u4FEF\u5367\u6491\u8010\u529B\u6D4B\u8BD5",
            typeColor: "#4B525E",
            typeText: "\u5F85\u6D4B"
          },
          {
            title: "\u5377\u8179\u6D4B\u8BD5",
            type: 30,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u5377\u8179\u6D4B\u8BD5",
            typeColor: "#4B525E",
            typeText: "\u5F85\u6D4B"
          },
          {
            title: "\u4E09\u5206\u949F\u8E0F\u677F\u6D4B\u8BD5",
            type: 1,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u4E09\u5206\u949F\u8E0F\u677F\u6D4B\u8BD5",
            typeColor: "#4B525E",
            typeText: "\u5F85\u6D4B"
          },
          {
            title: "\u81EA\u91CD\u6DF1\u8E72\u6D4B\u8BD5",
            type: 0,
            path: "/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation?pageName=\u81EA\u91CD\u6DF1\u8E72\u6D4B\u8BD5",
            typeColor: "#4B525E",
            typeText: "\u5F85\u6D4B"
          }
        ]
      };
    },
    onShow() {
      this.pedalTest();
    },
    methods: {
      jumpModular(item) {
        formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:114", item.path, ">>>>");
        uni.navigateTo({
          url: item.path,
          success: (res2) => {
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      },
      async pedalTest() {
        const length = this.dynamicEvaluationdata.length;
        let i2 = 0;
        for (i2; i2 < length; i2++) {
          if (this.dynamicEvaluationdata[i2].title == "\u4E09\u5206\u949F\u8E0F\u677F\u6D4B\u8BD5") {
            formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:127", this.dynamicEvaluationdata[i2].type);
            this.resultValue = this.dynamicEvaluationdata[i2].type;
            break;
          }
        }
        const gender = this.gender;
        const age = this.age;
        const resValue = this.resultValue;
        formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:136", gender + "," + age + "," + resValue);
        const res2 = testOb$1.method1(gender, age, resValue);
        formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:138", res2);
        const type = (await res2).data;
        if (type.length == 0) {
          this.typeText = "\u5F85\u6D4B";
        } else {
          this.typeText = type[0].resultLevel;
          this.dynamicEvaluationdata[i2].typeText = this.typeText;
          this.levelColor(this.typeText);
        }
        this.dynamicEvaluationdata[i2].typeColor = this.typeColor;
        formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:149", this.dynamicEvaluationdata[i2]);
        formatAppLog("log", "at pages/physicalFitnessAssessment/physicalFitnessAssessment.vue:150", type[0].resultLevel);
      },
      levelColor(levelType) {
        switch (levelType) {
          case "\u4F18\u79C0":
          case "\u826F\u597D":
            this.typeColor = "#01E08C";
            break;
          case "\u4E2D\u7B49":
          case "\u4E2D\u4E0A\u7B49":
          case "\u4E2D\u4E0B\u7B49":
            this.typeColor = "#FFC13C";
            break;
          case "\u8F83\u5DEE":
          case "\u975E\u5E38\u5DEE":
            this.typeColor = "#F04242";
            break;
          default:
            this.typeColor = "#4B525E";
            break;
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
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
                  vue.createElementVNode("view", { class: "dynamicshow_right" }, [
                    vue.createVNode(_component_van_circle, {
                      "current-rate": $data.currentRate,
                      "onUpdate:current-rate": _cache[0] || (_cache[0] = ($event) => $data.currentRate = $event),
                      rate: 100,
                      speed: 400,
                      text: item.typeText,
                      "layer-color": item.typeColor,
                      color: item.typeColor,
                      style: vue.normalizeStyle("--van-circle-text-color:" + item.typeColor)
                    }, null, 8, ["current-rate", "text", "layer-color", "color", "style"])
                  ])
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
  const PagesPhysicalFitnessAssessmentPhysicalFitnessAssessment = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "D:/studyUninApp/bodybuilding-app/pages/physicalFitnessAssessment/physicalFitnessAssessment.vue"]]);
  const _imports_0 = "/static/app-plus/other/coach.png";
  let weixinAuthService;
  const _sfc_main$k = {
    data() {
      return {
        phone: "17521791830",
        checkFlag: false,
        hasWeixinAuth: false,
        checkPhone: "",
        needChecked: false
      };
    },
    computed: {
      controlActiveFlag() {
        formatAppLog("log", "at pages/logining/logining.vue:103", this.phone, "????");
        let flag = false;
        if (this.phone && this.phone.length === 11) {
          flag = true;
        }
        return flag;
      }
    },
    onLoad() {
      formatAppLog("log", "at pages/logining/logining.vue:113", plus, ">>>>");
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
      phoneInput(event) {
        formatAppLog("log", "at pages/logining/logining.vue:128", event, "\u4F60tm");
        this.phone = event.detail.value;
      },
      async getSms() {
        if (this.controlActiveFlag && !this.checkFlag) {
          this.needChecked = true;
          return;
        }
        if (this.controlActiveFlag) {
          const login = As.importObject("login");
          try {
            const smsRes = await login.sendSmsCode(this.phone);
            formatAppLog("log", "at pages/logining/logining.vue:143", smsRes, "\u767B\u5F55\u6210\u529F");
            if (smsRes.code == 0) {
              uni.reLaunch({
                url: "/pages/verificatioCode/verificatioCode?mobile=" + smsRes.mobile,
                success: (res2) => {
                },
                fail: () => {
                },
                complete: () => {
                }
              });
            }
          } catch (err) {
            formatAppLog("log", "at pages/logining/logining.vue:157", err, "\u6211\u662F\u9519\u8BEF");
          }
        }
      },
      agreeContiute() {
        this.checkFlag = true;
        this.needChecked = false;
      },
      getWeixinCode() {
        return new Promise((resolve, reject) => {
          weixinAuthService.authorize(
            function(res2) {
              resolve(res2.code);
            },
            function(err) {
              formatAppLog("log", "at pages/logining/logining.vue:173", err);
              reject(new Error("\u5FAE\u4FE1\u767B\u5F55\u5931\u8D25"));
            }
          );
        });
      },
      loginByWeixin() {
        this.getWeixinCode().then((code) => {
          return As.callFunction({
            name: "login-by-weixin",
            data: {
              code
            }
          });
        }).then((res2) => {
          uni.showModal({
            showCancel: false,
            content: JSON.stringify(res2.result)
          });
          if (res2.result.code === 0) {
            uni.setStorageSync("uni_id_token", res2.result.token);
            uni.setStorageSync("uni_id_token_expired", res2.result.tokenExpired);
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
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "counter" }, [
      vue.createElementVNode("view", { class: "text" }, [
        vue.createCommentVNode(' <view class="text1"></view> '),
        vue.createElementVNode("image", {
          class: "text1",
          src: _imports_0
        }),
        vue.createElementVNode("br"),
        vue.createElementVNode("text", { class: "text2" }, "\u79C1\u4EBA\u4E13\u5C5E\u6559\u7EC3\uFF0C\u6241\u5E73\u5B66\u5458\u7BA1\u7406")
      ]),
      vue.createElementVNode("view", { class: "middle" }, [
        vue.createElementVNode("input", {
          value: $data.phone,
          type: "tel",
          maxlength: 11,
          onInput: _cache[0] || (_cache[0] = (...args) => $options.phoneInput && $options.phoneInput(...args)),
          class: "phone",
          focus: "",
          placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7"
        }, null, 40, ["value"]),
        vue.createCommentVNode('   <van-field\r\n       v-model="phone"\r\n        class="phone"\r\n        placeholder="\u8BF7\u8F93\u5165\u624B\u673A\u53F7"\r\n		maxLength="11"\r\n		\r\n      /> '),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["btn", $options.controlActiveFlag ? "active_btn" : ""]),
          onClick: _cache[1] || (_cache[1] = (...args) => $options.getSms && $options.getSms(...args))
        }, [
          vue.createElementVNode("span", { class: "btn-text" }, "\u83B7\u53D6\u9A8C\u8BC1\u7801")
        ], 2),
        vue.createElementVNode("view", { class: "ying_si_style" }, [
          vue.createElementVNode("view", {
            class: "check_style",
            onClick: _cache[2] || (_cache[2] = ($event) => $data.checkFlag = !$data.checkFlag)
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
              vue.createElementVNode("text", { class: "ying_si_jump_style" }, "\u300A\u7528\u6237\u9690\u79C1\u534F\u8BAE\u300B"),
              vue.createCommentVNode(' <text class="ying_si_jump_style">\u300A\u7528\u6237\u534F\u8BAE\u300B</text> ')
            ]),
            vue.createElementVNode("text", { class: "ying_si_remark" }, "\u653F\u7B56\u5E76\u4F7F\u7528\u672C\u673A\u53F7\u7801\u767B\u5F55")
          ]),
          $data.needChecked ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "botter_dakuang_style"
          }, [
            vue.createElementVNode("view", { class: "botter" }, [
              vue.createElementVNode("view", { class: "botter-top" }, [
                vue.createElementVNode("h1", { class: "botter-top1" }, "\u6B22\u8FCE\u4F7F\u7528\u672C\u4EA7\u54C1\uFF01"),
                vue.createElementVNode("h2", { class: "botter-top2" }, "welcome"),
                vue.createElementVNode("p", { class: "botter-top3" }, " \u4E3A\u4E86\u66F4\u597D\u7684\u4FDD\u969C\u60A8\u7684\u5408\u6CD5\u6743\u76CA\uFF0C\u5728\u4F7F\u7528\u672C\u5E94\u7528\u4E4B\u524D\uFF0C\u8BF7\u60A8\u4ED4\u7EC6\u9605\u8BFB\u300A\u7528\u6237\u9690\u79C1\u534F\u8BAE\u300B\uFF0C\u70B9\u51FB\u540C\u610F\u5373\u8868\u793A\u60A8\u5DF2\u9605\u8BFB\u5E76\u540C\u610F\u63A5\u53D7\u6211\u4EEC\u7684\u670D\u52A1\uFF0C\u611F\u8C22\u60A8\u7684\u4FE1\u4EFB\uFF01 "),
                vue.createElementVNode("button", {
                  class: "botter-top4",
                  onClick: _cache[3] || (_cache[3] = (...args) => $options.agreeContiute && $options.agreeContiute(...args))
                }, [
                  vue.createElementVNode("span", { class: "botter-top4-text" }, "\u540C\u610F\u5E76\u7EE7\u7EED")
                ]),
                vue.createElementVNode("view", {
                  class: "botter-top5-text",
                  onClick: _cache[4] || (_cache[4] = ($event) => $data.needChecked = false)
                }, "\u4E0D\u540C\u610F")
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          class: "wx_loging_style",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.loginByWeixin && $options.loginByWeixin(...args))
        }, [
          vue.createElementVNode("image", {
            onClick: _cache[5] || (_cache[5] = (...args) => $options.loginByWeixin && $options.loginByWeixin(...args)),
            class: "wx_img_style",
            src: "/static/login/wxlogin.svg"
          })
        ])
      ])
    ]);
  }
  const PagesLoginingLogining = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-62a93864"], ["__file", "D:/studyUninApp/bodybuilding-app/pages/logining/logining.vue"]]);
  const _sfc_main$j = {
    props: {
      latticeNum: {
        type: Number,
        default: 4
      },
      latticeSize: {
        type: Number,
        default: 100
      },
      borderStyle: {
        type: String,
        default: "border-bottom:1px solid gray;"
      },
      borderCheckStyle: {
        type: String,
        default: "border: 1px solid red !important;"
      },
      inputType: {
        type: String,
        default: "number"
      },
      blurShow: {
        type: Boolean,
        default: false
      },
      ciphertextSty: {
        type: Number,
        default: 0
      },
      updateOne: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inputValues: "",
        blurShowLocal: true
      };
    },
    mounted() {
      this.blurShowLocal = this.blurShow;
    },
    methods: {
      latticeSty(index) {
        let str = this.blurShowLocal && (this.inputValues.length == index || this.inputValues.length == this.latticeNum && index == this.latticeNum - 1) ? this.borderCheckStyle : this.borderStyle;
        str += `;width:${this.latticeSize}rpx;height:${this.latticeSize}rpx`;
        return str;
      },
      getValue() {
        return this.inputValues;
      },
      inputVal(e) {
        formatAppLog("log", "at components/verification-code-style2/verification-code-style2.vue:90", e);
        this.$emit("inputVerificationChange", this.inputValues);
      },
      setVerificationCode(verificationCodeValue) {
        if (!verificationCodeValue)
          return;
        this.inputValues = verificationCodeValue;
      },
      cleanVal() {
        this.inputValues = "";
      },
      latticeFoc(index) {
      },
      blur() {
        !this.blurShow ? this.blurShowLocal = false : "";
      },
      focus() {
        !this.blurShow ? this.blurShowLocal = true : "";
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "acqui_verification_code" }, [
      vue.createElementVNode("view", { class: "verification_code_continor" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.latticeNum, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "verification_code_item",
            onClick: ($event) => $options.latticeFoc(index)
          }, [
            $data.inputValues[index] ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              $props.ciphertextSty == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "point"
              })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                vue.createTextVNode(vue.toDisplayString($props.ciphertextSty == 2 ? "*" : $data.inputValues[index]), 1)
              ], 64))
            ], 64)) : vue.createCommentVNode("v-if", true)
          ], 8, ["onClick"]);
        }), 128))
      ]),
      vue.createElementVNode("div", { class: "input_info" }, [
        vue.withDirectives(vue.createElementVNode("input", {
          type: $props.inputType,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.inputValues = $event),
          focus: "",
          maxlength: $props.latticeNum,
          onInput: _cache[1] || (_cache[1] = (...args) => $options.inputVal && $options.inputVal(...args)),
          onBlur: _cache[2] || (_cache[2] = (...args) => $options.blur && $options.blur(...args)),
          onFocus: _cache[3] || (_cache[3] = (...args) => $options.focus && $options.focus(...args))
        }, null, 40, ["type", "maxlength"]), [
          [vue.vModelDynamic, $data.inputValues]
        ])
      ])
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-e5158781"], ["__file", "D:/studyUninApp/bodybuilding-app/components/verification-code-style2/verification-code-style2.vue"]]);
  const en = {
    "uni-countdown.day": "day",
    "uni-countdown.h": "h",
    "uni-countdown.m": "m",
    "uni-countdown.s": "s"
  };
  const zhHans = {
    "uni-countdown.day": "\u5929",
    "uni-countdown.h": "\u65F6",
    "uni-countdown.m": "\u5206",
    "uni-countdown.s": "\u79D2"
  };
  const zhHant = {
    "uni-countdown.day": "\u5929",
    "uni-countdown.h": "\u6642",
    "uni-countdown.m": "\u5206",
    "uni-countdown.s": "\u79D2"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$i = {
    name: "UniCountdown",
    emits: ["timeup"],
    props: {
      showDay: {
        type: Boolean,
        default: true
      },
      showColon: {
        type: Boolean,
        default: true
      },
      start: {
        type: Boolean,
        default: true
      },
      backgroundColor: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333"
      },
      fontSize: {
        type: Number,
        default: 14
      },
      splitorColor: {
        type: String,
        default: "#333"
      },
      day: {
        type: Number,
        default: 0
      },
      hour: {
        type: Number,
        default: 0
      },
      minute: {
        type: Number,
        default: 0
      },
      second: {
        type: Number,
        default: 0
      },
      timestamp: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        timer: null,
        syncFlag: false,
        d: "00",
        h: "00",
        i: "00",
        s: "00",
        leftTime: 0,
        seconds: 0
      };
    },
    computed: {
      dayText() {
        return t("uni-countdown.day");
      },
      hourText(val) {
        return t("uni-countdown.h");
      },
      minuteText(val) {
        return t("uni-countdown.m");
      },
      secondText(val) {
        return t("uni-countdown.s");
      },
      timeStyle() {
        const {
          color,
          backgroundColor,
          fontSize
        } = this;
        return {
          color,
          backgroundColor,
          fontSize: `${fontSize}px`,
          width: `${fontSize * 22 / 14}px`,
          lineHeight: `${fontSize * 20 / 14}px`,
          borderRadius: `${fontSize * 3 / 14}px`
        };
      },
      splitorStyle() {
        const { splitorColor, fontSize, backgroundColor } = this;
        return {
          color: splitorColor,
          fontSize: `${fontSize * 12 / 14}px`,
          margin: backgroundColor ? `${fontSize * 4 / 14}px` : ""
        };
      }
    },
    watch: {
      day(val) {
        this.changeFlag();
      },
      hour(val) {
        this.changeFlag();
      },
      minute(val) {
        this.changeFlag();
      },
      second(val) {
        this.changeFlag();
      },
      start: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.startData();
          } else {
            if (!oldVal)
              return;
            clearInterval(this.timer);
          }
        }
      }
    },
    created: function(e) {
      this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second);
      this.countDown();
    },
    unmounted() {
      clearInterval(this.timer);
    },
    methods: {
      toSeconds(timestamp, day, hours2, minutes2, seconds2) {
        if (timestamp) {
          return timestamp - parseInt(new Date().getTime() / 1e3, 10);
        }
        return day * 60 * 60 * 24 + hours2 * 60 * 60 + minutes2 * 60 + seconds2;
      },
      timeUp() {
        clearInterval(this.timer);
        this.$emit("timeup");
      },
      countDown() {
        let seconds2 = this.seconds;
        let [day, hour, minute, second] = [0, 0, 0, 0];
        if (seconds2 > 0) {
          day = Math.floor(seconds2 / (60 * 60 * 24));
          hour = Math.floor(seconds2 / (60 * 60)) - day * 24;
          minute = Math.floor(seconds2 / 60) - day * 24 * 60 - hour * 60;
          second = Math.floor(seconds2) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
        } else {
          this.timeUp();
        }
        if (day < 10) {
          day = "0" + day;
        }
        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minute < 10) {
          minute = "0" + minute;
        }
        if (second < 10) {
          second = "0" + second;
        }
        this.d = day;
        this.h = hour;
        this.i = minute;
        this.s = second;
      },
      startData() {
        this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second);
        if (this.seconds <= 0) {
          this.seconds = this.toSeconds(0, 0, 0, 0, 0);
          this.countDown();
          return;
        }
        clearInterval(this.timer);
        this.countDown();
        this.timer = setInterval(() => {
          this.seconds--;
          if (this.seconds < 0) {
            this.timeUp();
            return;
          }
          this.countDown();
        }, 1e3);
      },
      update() {
        this.startData();
      },
      changeFlag() {
        if (!this.syncFlag) {
          this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second);
          this.startData();
          this.syncFlag = true;
        }
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-countdown" }, [
      $props.showDay ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 0,
        style: vue.normalizeStyle([$options.timeStyle]),
        class: "uni-countdown__number"
      }, vue.toDisplayString($data.d), 5)) : vue.createCommentVNode("v-if", true),
      $props.showDay ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 1,
        style: vue.normalizeStyle([$options.splitorStyle]),
        class: "uni-countdown__splitor"
      }, vue.toDisplayString($options.dayText), 5)) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("text", {
        style: vue.normalizeStyle([$options.timeStyle]),
        class: "uni-countdown__number"
      }, vue.toDisplayString($data.h), 5),
      vue.createElementVNode("text", {
        style: vue.normalizeStyle([$options.splitorStyle]),
        class: "uni-countdown__splitor"
      }, vue.toDisplayString($props.showColon ? ":" : $options.hourText), 5),
      vue.createElementVNode("text", {
        style: vue.normalizeStyle([$options.timeStyle]),
        class: "uni-countdown__number"
      }, vue.toDisplayString($data.i), 5),
      vue.createElementVNode("text", {
        style: vue.normalizeStyle([$options.splitorStyle]),
        class: "uni-countdown__splitor"
      }, vue.toDisplayString($props.showColon ? ":" : $options.minuteText), 5),
      vue.createElementVNode("text", {
        style: vue.normalizeStyle([$options.timeStyle]),
        class: "uni-countdown__number"
      }, vue.toDisplayString($data.s), 5),
      !$props.showColon ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 2,
        style: vue.normalizeStyle([$options.splitorStyle]),
        class: "uni-countdown__splitor"
      }, vue.toDisplayString($options.secondText), 5)) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-c592f7f2"], ["__file", "D:/studyUninApp/bodybuilding-app/uni_modules/uni-countdown/components/uni-countdown/uni-countdown.vue"]]);
  const _sfc_main$h = {
    data() {
      return {
        smsCode: "",
        errorInfoValue: "",
        showKeyboard: false,
        timeupSecond: 60,
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
      timeup() {
        this.isFinsh = true;
      },
      getVal() {
        const val = this.$refs.verificationCodeStyle2.getValue();
        uni.showModal({
          content: "\u83B7\u53D6\u5230\u503C\uFF1A" + val,
          showCancel: false
        });
      },
      clearVal() {
        this.$refs.verificationCodeStyle2.cleanVal();
      },
      setVal() {
        this.$refs.verificationCodeStyle2.setVerificationCode("888");
      },
      inputVerificationChange(val) {
        this.smsCode = val;
        formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:117", "\u503C\u6539\u53D8\u4E86\uFF1A" + val);
      },
      async resend() {
        if (this.isFinsh) {
          const login = As.importObject("login");
          try {
            const smsRes = await login.sendSmsCode(this.mobile);
            formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:124", smsRes, "\u53D1\u9001\u6210\u529F");
            if (smsRes.code == 0) {
              this.mobile = smsRes.mobile;
              this.verifyCode();
              this.$refs.countDown.reset();
            }
          } catch (err) {
            formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:132", err, "\u6211\u662F\u9519\u8BEF");
          }
        }
      },
      onFinsh() {
        this.isFinsh = true;
      },
      async verifyCode() {
        let login = As.importObject("login");
        const getVerifyRes = await login.getVerifySchema();
        try {
          this.requestVerifyCode = getVerifyRes.length > 0 ? getVerifyRes[0].code : "0000";
        } catch (err) {
        }
      },
      async smsLogin() {
        const vefiryLogin = As.importObject("login");
        try {
          let param = {
            mobile: this.mobile,
            code: this.requestVerifyCode
          };
          const loginRes = await vefiryLogin.loginBySms(param);
          formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:157", loginRes, "\u53D1\u9001\u6210\u529F");
          if (loginRes.code == 0) {
            try {
              uni.setStorageSync("userInfo", JSON.stringify(loginRes.userInfo));
              uni.setStorageSync("uni_id_token", loginRes.token);
              uni.setStorageSync("uid", loginRes.uid);
              uni.setStorageSync("tokenExpired", loginRes.tokenExpired);
              let userLogin = As.importObject("login");
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
          formatAppLog("log", "at pages/verificatioCode/verificatioCode.vue:179", err, "\u6211\u662F\u9519\u8BEF");
        }
      },
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_verification_code_style2 = resolveEasycom(vue.resolveDynamicComponent("verification-code-style2"), __easycom_0);
    const _component_uni_countdown = resolveEasycom(vue.resolveDynamicComponent("uni-countdown"), __easycom_1);
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
        vue.createElementVNode("view", { class: "main" }, [
          vue.createVNode(_component_verification_code_style2, {
            latticeNum: 4,
            ref: "verificationCodeStyle2",
            onInputVerificationChange: $options.inputVerificationChange
          }, null, 8, ["onInputVerificationChange"])
        ]),
        vue.createCommentVNode('    <van-password-input\r\n        class="a-i-c"\r\n        :mask="false"\r\n        :length="4"\r\n        :gutter="10"\r\n        :value="smsCode"\r\n        :error-info="errorInfoValue"\r\n        :focused="showKeyboard"\r\n        @focus="showKeyboard = true"\r\n      />\r\n      <van-number-keyboard\r\n        v-model="smsCode"\r\n        :show="showKeyboard"\r\n        @blur="showKeyboard = false"\r\n        :maxlength="4"\r\n      /> '),
        vue.createCommentVNode(" \u767B\u5F55 "),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["btn", $data.sureLogin ? "active" : ""]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.smsLogin && $options.smsLogin(...args))
        }, [
          vue.createElementVNode("span", { class: "btn-text" }, "\u767B\u5F55")
        ], 2),
        vue.createElementVNode("p", {
          class: vue.normalizeClass(["time", $data.isFinsh ? "timeActive" : ""]),
          onClick: _cache[1] || (_cache[1] = (...args) => $options.resend && $options.resend(...args))
        }, [
          vue.createTextVNode(" \u91CD\u65B0\u53D1\u9001\uFF08"),
          vue.createElementVNode("view", null, [
            vue.createVNode(_component_uni_countdown, {
              "show-day": false,
              color: $data.isFinsh ? "#1370ff" : "#a8adb6",
              showColon: true,
              hour: 0,
              minute: 0,
              second: $data.timeupSecond,
              onTimeup: $options.timeup
            }, null, 8, ["color", "second", "onTimeup"]),
            vue.createCommentVNode(` 		  <van-count-down\r
            ref="countDown"\r
            millisecond\r
            @finish="onFinsh"\r
            :time="countDown"\r
            :auto-start="true"\r
            :class="isFinsh ? 'countActive' : ''"\r
            format="ss" /> `)
          ]),
          vue.createElementVNode("text", null, "s"),
          vue.createTextVNode("\uFF09 ")
        ], 2)
      ])
    ]);
  }
  const PagesVerificatioCodeVerificatioCode = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-1bfd51d6"], ["__file", "D:/studyUninApp/bodybuilding-app/pages/verificatioCode/verificatioCode.vue"]]);
  const _sfc_main$g = {
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
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesPersonalnformationPersonalnformation = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-4422acd1"], ["__file", "D:/studyUninApp/bodybuilding-app/pages/personalnformation/personalnformation.vue"]]);
  const _sfc_main$f = {
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
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
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
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.list, (i2, k) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: k,
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
  const popover = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-c68365de"], ["__file", "D:/studyUninApp/bodybuilding-app/components/popover/index.vue"]]);
  const actionLibrary$1 = As.importObject("actionLibrary");
  const _sfc_main$e = {
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
        const res2 = await actionLibrary$1.getActionList({
          type: this.mode,
          actionClass: this.actionClass,
          actionName: this.actionName
        });
        const actionList = res2.data || [];
        this.actionList = actionList.map((item) => {
          const flag = this.selectActionList.some((i2) => item._id === i2._id);
          if (flag) {
            return {
              ...item,
              active: true
            };
          } else {
            return {
              ...item,
              active: false
            };
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
      selectClick(item, info) {
        if (item.text === "\u5220\u9664\u52A8\u4F5C") {
          this.showDialog = true;
          this.currentAction = info;
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
      async deleteHandle() {
        this.showDialog = false;
        await actionLibrary$1.deleteAction({ id: this.currentAction._id });
        uni.showToast({ title: "\u5220\u9664\u6210\u529F", duration: 1e3 });
        this.getActionList();
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
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
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
                    onSelctClick: ($event) => $options.selectClick($event, i2)
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
        "onUpdate:show": _cache[8] || (_cache[8] = ($event) => $data.showDialog = $event),
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
                onClick: $options.deleteHandle
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("\u786E\u8BA4")
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ]);
  }
  const PagesActionLibraryIndex = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "D:/studyUninApp/bodybuilding-app/pages/actionLibrary/index.vue"]]);
  const actionLibrary = As.importObject("actionLibrary");
  const _sfc_main$d = {
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
        actionType: "",
        actionTypeName: ""
      };
    },
    onLoad: function(option) {
      formatAppLog("log", "at pages/addAction/index.vue:77", option);
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
        this.actionTypeName = child.title;
      },
      onClickLeft() {
        uni.switchTab({
          url: "/pages/actionLibrary/index"
        });
      },
      async saveAction() {
        if (!this.actionName) {
          return uni.showToast({ icon: "error", title: "\u8BF7\u8F93\u5165\u52A8\u4F5C\u540D\u79F0", duration: 2e3 });
        }
        if (!this.actionType && this.actionType !== 0) {
          return uni.showToast({ icon: "error", title: "\u8BF7\u9009\u62E9\u52A8\u4F5C\u7C7B\u578B", duration: 2e3 });
        }
        const res2 = await actionLibrary.addAction({
          type: this.type,
          actionClass: this.actionClass,
          actionName: this.actionName,
          actionType: this.actionType
        });
        this.onClickLeft();
        formatAppLog("log", "at pages/addAction/index.vue:109", res2, 8888);
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_nav_bar = vue.resolveComponent("van-nav-bar");
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
        vue.withDirectives(vue.createElementVNode("input", {
          class: "uni-input",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.actionName = $event),
          placeholder: "\u8BF7\u8F93\u5165\u52A8\u4F5C\u540D\u79F0"
        }, null, 512), [
          [vue.vModelText, $data.actionName]
        ]),
        vue.createVNode(_component_van_cell, {
          "is-link": "",
          title: "\u52A8\u4F5C\u7C7B\u578B",
          value: $data.actionTypeName,
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
  const PagesAddActionIndex = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "D:/studyUninApp/bodybuilding-app/pages/addAction/index.vue"]]);
  const train$2 = As.importObject("train");
  const _sfc_main$c = {
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
        const res2 = await train$2.getTrainList({ traineeNo: this.traineeNo, trainDate: this.trainDate });
        if (res2.data && res2.data.length > 0) {
          const { trainContent, traineeTitle } = res2.data[0];
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
        if (!this.workoutName) {
          return uni.showToast({ icon: "error", title: "\u8BF7\u8F93\u5165\u8BAD\u7EC3\u540D\u79F0", duration: 2e3 });
        }
        if (!this.actionList || this.actionList.length === 0) {
          return uni.showToast({ icon: "error", title: "\u8BF7\u6DFB\u52A0\u52A8\u4F5C", duration: 2e3 });
        }
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
      formaterTimes(times, type = 3) {
        const hour = Math.floor(times / 3600);
        const minute = Math.floor((times - hour * 3600) / 60);
        const second = times - hour * 3600 - minute * 60;
        return type === 3 ? hour + "\u65F6" + minute + "\u5206" + second + "\u79D2" : hour + "\u65F6" + minute + "\u5206";
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_popover = vue.resolveComponent("popover");
    const _component_van_icon = vue.resolveComponent("van-icon");
    const _component_van_image = vue.resolveComponent("van-image");
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
                vue.createElementVNode("view", { class: "img" }),
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
                    vue.createElementVNode("view", { class: "img" })
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
                      vue.createElementVNode("view", {
                        class: "img",
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
            vue.createElementVNode("view", { class: "img" })
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
  const PagesNewWorkoutNewWorkout = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "D:/studyUninApp/bodybuilding-app/pages/newWorkout/newWorkout.vue"]]);
  //! moment.js
  //! version : 2.29.4
  //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
  //! license : MIT
  //! momentjs.com
  var hookCallback;
  function hooks() {
    return hookCallback.apply(null, arguments);
  }
  function setHookCallback(callback) {
    hookCallback = callback;
  }
  function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]";
  }
  function isObject(input) {
    return input != null && Object.prototype.toString.call(input) === "[object Object]";
  }
  function hasOwnProp(a2, b2) {
    return Object.prototype.hasOwnProperty.call(a2, b2);
  }
  function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
      return Object.getOwnPropertyNames(obj).length === 0;
    } else {
      var k;
      for (k in obj) {
        if (hasOwnProp(obj, k)) {
          return false;
        }
      }
      return true;
    }
  }
  function isUndefined(input) {
    return input === void 0;
  }
  function isNumber(input) {
    return typeof input === "number" || Object.prototype.toString.call(input) === "[object Number]";
  }
  function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]";
  }
  function map(arr, fn) {
    var res2 = [], i2, arrLen = arr.length;
    for (i2 = 0; i2 < arrLen; ++i2) {
      res2.push(fn(arr[i2], i2));
    }
    return res2;
  }
  function extend(a2, b2) {
    for (var i2 in b2) {
      if (hasOwnProp(b2, i2)) {
        a2[i2] = b2[i2];
      }
    }
    if (hasOwnProp(b2, "toString")) {
      a2.toString = b2.toString;
    }
    if (hasOwnProp(b2, "valueOf")) {
      a2.valueOf = b2.valueOf;
    }
    return a2;
  }
  function createUTC(input, format2, locale2, strict) {
    return createLocalOrUTC(input, format2, locale2, strict, true).utc();
  }
  function defaultParsingFlags() {
    return {
      empty: false,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: false,
      invalidEra: null,
      invalidMonth: null,
      invalidFormat: false,
      userInvalidated: false,
      iso: false,
      parsedDateParts: [],
      era: null,
      meridiem: null,
      rfc2822: false,
      weekdayMismatch: false
    };
  }
  function getParsingFlags(m2) {
    if (m2._pf == null) {
      m2._pf = defaultParsingFlags();
    }
    return m2._pf;
  }
  var some;
  if (Array.prototype.some) {
    some = Array.prototype.some;
  } else {
    some = function(fun) {
      var t2 = Object(this), len = t2.length >>> 0, i2;
      for (i2 = 0; i2 < len; i2++) {
        if (i2 in t2 && fun.call(this, t2[i2], i2, t2)) {
          return true;
        }
      }
      return false;
    };
  }
  function isValid(m2) {
    if (m2._isValid == null) {
      var flags = getParsingFlags(m2), parsedParts = some.call(flags.parsedDateParts, function(i2) {
        return i2 != null;
      }), isNowValid = !isNaN(m2._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
      if (m2._strict) {
        isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
      }
      if (Object.isFrozen == null || !Object.isFrozen(m2)) {
        m2._isValid = isNowValid;
      } else {
        return isNowValid;
      }
    }
    return m2._isValid;
  }
  function createInvalid(flags) {
    var m2 = createUTC(NaN);
    if (flags != null) {
      extend(getParsingFlags(m2), flags);
    } else {
      getParsingFlags(m2).userInvalidated = true;
    }
    return m2;
  }
  var momentProperties = hooks.momentProperties = [], updateInProgress = false;
  function copyConfig(to2, from2) {
    var i2, prop, val, momentPropertiesLen = momentProperties.length;
    if (!isUndefined(from2._isAMomentObject)) {
      to2._isAMomentObject = from2._isAMomentObject;
    }
    if (!isUndefined(from2._i)) {
      to2._i = from2._i;
    }
    if (!isUndefined(from2._f)) {
      to2._f = from2._f;
    }
    if (!isUndefined(from2._l)) {
      to2._l = from2._l;
    }
    if (!isUndefined(from2._strict)) {
      to2._strict = from2._strict;
    }
    if (!isUndefined(from2._tzm)) {
      to2._tzm = from2._tzm;
    }
    if (!isUndefined(from2._isUTC)) {
      to2._isUTC = from2._isUTC;
    }
    if (!isUndefined(from2._offset)) {
      to2._offset = from2._offset;
    }
    if (!isUndefined(from2._pf)) {
      to2._pf = getParsingFlags(from2);
    }
    if (!isUndefined(from2._locale)) {
      to2._locale = from2._locale;
    }
    if (momentPropertiesLen > 0) {
      for (i2 = 0; i2 < momentPropertiesLen; i2++) {
        prop = momentProperties[i2];
        val = from2[prop];
        if (!isUndefined(val)) {
          to2[prop] = val;
        }
      }
    }
    return to2;
  }
  function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
      this._d = new Date(NaN);
    }
    if (updateInProgress === false) {
      updateInProgress = true;
      hooks.updateOffset(this);
      updateInProgress = false;
    }
  }
  function isMoment(obj) {
    return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
  }
  function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
      formatAppLog("warn", "at node_modules/moment/dist/moment.js:281", "Deprecation warning: " + msg);
    }
  }
  function deprecate(msg, fn) {
    var firstTime = true;
    return extend(function() {
      if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(null, msg);
      }
      if (firstTime) {
        var args = [], arg, i2, key, argLen = arguments.length;
        for (i2 = 0; i2 < argLen; i2++) {
          arg = "";
          if (typeof arguments[i2] === "object") {
            arg += "\n[" + i2 + "] ";
            for (key in arguments[0]) {
              if (hasOwnProp(arguments[0], key)) {
                arg += key + ": " + arguments[0][key] + ", ";
              }
            }
            arg = arg.slice(0, -2);
          } else {
            arg = arguments[i2];
          }
          args.push(arg);
        }
        warn(
          msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack
        );
        firstTime = false;
      }
      return fn.apply(this, arguments);
    }, fn);
  }
  var deprecations = {};
  function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
      hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
      warn(msg);
      deprecations[name] = true;
    }
  }
  hooks.suppressDeprecationWarnings = false;
  hooks.deprecationHandler = null;
  function isFunction(input) {
    return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
  }
  function set(config) {
    var prop, i2;
    for (i2 in config) {
      if (hasOwnProp(config, i2)) {
        prop = config[i2];
        if (isFunction(prop)) {
          this[i2] = prop;
        } else {
          this["_" + i2] = prop;
        }
      }
    }
    this._config = config;
    this._dayOfMonthOrdinalParseLenient = new RegExp(
      (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
    );
  }
  function mergeConfigs(parentConfig, childConfig) {
    var res2 = extend({}, parentConfig), prop;
    for (prop in childConfig) {
      if (hasOwnProp(childConfig, prop)) {
        if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
          res2[prop] = {};
          extend(res2[prop], parentConfig[prop]);
          extend(res2[prop], childConfig[prop]);
        } else if (childConfig[prop] != null) {
          res2[prop] = childConfig[prop];
        } else {
          delete res2[prop];
        }
      }
    }
    for (prop in parentConfig) {
      if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
        res2[prop] = extend({}, res2[prop]);
      }
    }
    return res2;
  }
  function Locale(config) {
    if (config != null) {
      this.set(config);
    }
  }
  var keys;
  if (Object.keys) {
    keys = Object.keys;
  } else {
    keys = function(obj) {
      var i2, res2 = [];
      for (i2 in obj) {
        if (hasOwnProp(obj, i2)) {
          res2.push(i2);
        }
      }
      return res2;
    };
  }
  var defaultCalendar = {
    sameDay: "[Today at] LT",
    nextDay: "[Tomorrow at] LT",
    nextWeek: "dddd [at] LT",
    lastDay: "[Yesterday at] LT",
    lastWeek: "[Last] dddd [at] LT",
    sameElse: "L"
  };
  function calendar$1(key, mom, now2) {
    var output = this._calendar[key] || this._calendar["sameElse"];
    return isFunction(output) ? output.call(mom, now2) : output;
  }
  function zeroFill(number, targetLength, forceSign) {
    var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
    return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
  }
  var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
  function addFormatToken(token2, padded, ordinal2, callback) {
    var func = callback;
    if (typeof callback === "string") {
      func = function() {
        return this[callback]();
      };
    }
    if (token2) {
      formatTokenFunctions[token2] = func;
    }
    if (padded) {
      formatTokenFunctions[padded[0]] = function() {
        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
      };
    }
    if (ordinal2) {
      formatTokenFunctions[ordinal2] = function() {
        return this.localeData().ordinal(
          func.apply(this, arguments),
          token2
        );
      };
    }
  }
  function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
      return input.replace(/^\[|\]$/g, "");
    }
    return input.replace(/\\/g, "");
  }
  function makeFormatFunction(format2) {
    var array = format2.match(formattingTokens), i2, length;
    for (i2 = 0, length = array.length; i2 < length; i2++) {
      if (formatTokenFunctions[array[i2]]) {
        array[i2] = formatTokenFunctions[array[i2]];
      } else {
        array[i2] = removeFormattingTokens(array[i2]);
      }
    }
    return function(mom) {
      var output = "", i3;
      for (i3 = 0; i3 < length; i3++) {
        output += isFunction(array[i3]) ? array[i3].call(mom, format2) : array[i3];
      }
      return output;
    };
  }
  function formatMoment(m2, format2) {
    if (!m2.isValid()) {
      return m2.localeData().invalidDate();
    }
    format2 = expandFormat(format2, m2.localeData());
    formatFunctions[format2] = formatFunctions[format2] || makeFormatFunction(format2);
    return formatFunctions[format2](m2);
  }
  function expandFormat(format2, locale2) {
    var i2 = 5;
    function replaceLongDateFormatTokens(input) {
      return locale2.longDateFormat(input) || input;
    }
    localFormattingTokens.lastIndex = 0;
    while (i2 >= 0 && localFormattingTokens.test(format2)) {
      format2 = format2.replace(
        localFormattingTokens,
        replaceLongDateFormatTokens
      );
      localFormattingTokens.lastIndex = 0;
      i2 -= 1;
    }
    return format2;
  }
  var defaultLongDateFormat = {
    LTS: "h:mm:ss A",
    LT: "h:mm A",
    L: "MM/DD/YYYY",
    LL: "MMMM D, YYYY",
    LLL: "MMMM D, YYYY h:mm A",
    LLLL: "dddd, MMMM D, YYYY h:mm A"
  };
  function longDateFormat(key) {
    var format2 = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
    if (format2 || !formatUpper) {
      return format2;
    }
    this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function(tok) {
      if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
        return tok.slice(1);
      }
      return tok;
    }).join("");
    return this._longDateFormat[key];
  }
  var defaultInvalidDate = "Invalid date";
  function invalidDate() {
    return this._invalidDate;
  }
  var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
  function ordinal(number) {
    return this._ordinal.replace("%d", number);
  }
  var defaultRelativeTime = {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    ss: "%d seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    w: "a week",
    ww: "%d weeks",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  };
  function relativeTime(number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
  }
  function pastFuture(diff2, output) {
    var format2 = this._relativeTime[diff2 > 0 ? "future" : "past"];
    return isFunction(format2) ? format2(output) : format2.replace(/%s/i, output);
  }
  var aliases = {};
  function addUnitAlias(unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + "s"] = aliases[shorthand] = unit;
  }
  function normalizeUnits(units) {
    return typeof units === "string" ? aliases[units] || aliases[units.toLowerCase()] : void 0;
  }
  function normalizeObjectUnits(inputObject) {
    var normalizedInput = {}, normalizedProp, prop;
    for (prop in inputObject) {
      if (hasOwnProp(inputObject, prop)) {
        normalizedProp = normalizeUnits(prop);
        if (normalizedProp) {
          normalizedInput[normalizedProp] = inputObject[prop];
        }
      }
    }
    return normalizedInput;
  }
  var priorities = {};
  function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
  }
  function getPrioritizedUnits(unitsObj) {
    var units = [], u2;
    for (u2 in unitsObj) {
      if (hasOwnProp(unitsObj, u2)) {
        units.push({ unit: u2, priority: priorities[u2] });
      }
    }
    units.sort(function(a2, b2) {
      return a2.priority - b2.priority;
    });
    return units;
  }
  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  function absFloor(number) {
    if (number < 0) {
      return Math.ceil(number) || 0;
    } else {
      return Math.floor(number);
    }
  }
  function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion, value = 0;
    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
      value = absFloor(coercedNumber);
    }
    return value;
  }
  function makeGetSet(unit, keepTime) {
    return function(value) {
      if (value != null) {
        set$1(this, unit, value);
        hooks.updateOffset(this, keepTime);
        return this;
      } else {
        return get(this, unit);
      }
    };
  }
  function get(mom, unit) {
    return mom.isValid() ? mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]() : NaN;
  }
  function set$1(mom, unit, value) {
    if (mom.isValid() && !isNaN(value)) {
      if (unit === "FullYear" && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
        value = toInt(value);
        mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](
          value,
          mom.month(),
          daysInMonth(value, mom.month())
        );
      } else {
        mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
      }
    }
  }
  function stringGet(units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
      return this[units]();
    }
    return this;
  }
  function stringSet(units, value) {
    if (typeof units === "object") {
      units = normalizeObjectUnits(units);
      var prioritized = getPrioritizedUnits(units), i2, prioritizedLen = prioritized.length;
      for (i2 = 0; i2 < prioritizedLen; i2++) {
        this[prioritized[i2].unit](units[prioritized[i2].unit]);
      }
    } else {
      units = normalizeUnits(units);
      if (isFunction(this[units])) {
        return this[units](value);
      }
    }
    return this;
  }
  var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, regexes;
  regexes = {};
  function addRegexToken(token2, regex, strictRegex) {
    regexes[token2] = isFunction(regex) ? regex : function(isStrict, localeData2) {
      return isStrict && strictRegex ? strictRegex : regex;
    };
  }
  function getParseRegexForToken(token2, config) {
    if (!hasOwnProp(regexes, token2)) {
      return new RegExp(unescapeFormat(token2));
    }
    return regexes[token2](config._strict, config._locale);
  }
  function unescapeFormat(s2) {
    return regexEscape(
      s2.replace("\\", "").replace(
        /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
        function(matched, p1, p2, p3, p4) {
          return p1 || p2 || p3 || p4;
        }
      )
    );
  }
  function regexEscape(s2) {
    return s2.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  var tokens = {};
  function addParseToken(token2, callback) {
    var i2, func = callback, tokenLen;
    if (typeof token2 === "string") {
      token2 = [token2];
    }
    if (isNumber(callback)) {
      func = function(input, array) {
        array[callback] = toInt(input);
      };
    }
    tokenLen = token2.length;
    for (i2 = 0; i2 < tokenLen; i2++) {
      tokens[token2[i2]] = func;
    }
  }
  function addWeekParseToken(token2, callback) {
    addParseToken(token2, function(input, array, config, token3) {
      config._w = config._w || {};
      callback(input, config._w, config, token3);
    });
  }
  function addTimeToArrayFromToken(token2, input, config) {
    if (input != null && hasOwnProp(tokens, token2)) {
      tokens[token2](input, config._a, config, token2);
    }
  }
  var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
  function mod(n2, x2) {
    return (n2 % x2 + x2) % x2;
  }
  var indexOf;
  if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function(o2) {
      var i2;
      for (i2 = 0; i2 < this.length; ++i2) {
        if (this[i2] === o2) {
          return i2;
        }
      }
      return -1;
    };
  }
  function daysInMonth(year, month) {
    if (isNaN(year) || isNaN(month)) {
      return NaN;
    }
    var modMonth = mod(month, 12);
    year += (month - modMonth) / 12;
    return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
  }
  addFormatToken("M", ["MM", 2], "Mo", function() {
    return this.month() + 1;
  });
  addFormatToken("MMM", 0, 0, function(format2) {
    return this.localeData().monthsShort(this, format2);
  });
  addFormatToken("MMMM", 0, 0, function(format2) {
    return this.localeData().months(this, format2);
  });
  addUnitAlias("month", "M");
  addUnitPriority("month", 8);
  addRegexToken("M", match1to2);
  addRegexToken("MM", match1to2, match2);
  addRegexToken("MMM", function(isStrict, locale2) {
    return locale2.monthsShortRegex(isStrict);
  });
  addRegexToken("MMMM", function(isStrict, locale2) {
    return locale2.monthsRegex(isStrict);
  });
  addParseToken(["M", "MM"], function(input, array) {
    array[MONTH] = toInt(input) - 1;
  });
  addParseToken(["MMM", "MMMM"], function(input, array, config, token2) {
    var month = config._locale.monthsParse(input, token2, config._strict);
    if (month != null) {
      array[MONTH] = month;
    } else {
      getParsingFlags(config).invalidMonth = input;
    }
  });
  var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split(
    "_"
  ), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
  function localeMonths(m2, format2) {
    if (!m2) {
      return isArray(this._months) ? this._months : this._months["standalone"];
    }
    return isArray(this._months) ? this._months[m2.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format2) ? "format" : "standalone"][m2.month()];
  }
  function localeMonthsShort(m2, format2) {
    if (!m2) {
      return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m2.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format2) ? "format" : "standalone"][m2.month()];
  }
  function handleStrictParse(monthName, format2, strict) {
    var i2, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
      for (i2 = 0; i2 < 12; ++i2) {
        mom = createUTC([2e3, i2]);
        this._shortMonthsParse[i2] = this.monthsShort(
          mom,
          ""
        ).toLocaleLowerCase();
        this._longMonthsParse[i2] = this.months(mom, "").toLocaleLowerCase();
      }
    }
    if (strict) {
      if (format2 === "MMM") {
        ii = indexOf.call(this._shortMonthsParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._longMonthsParse, llc);
        return ii !== -1 ? ii : null;
      }
    } else {
      if (format2 === "MMM") {
        ii = indexOf.call(this._shortMonthsParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._longMonthsParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._longMonthsParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortMonthsParse, llc);
        return ii !== -1 ? ii : null;
      }
    }
  }
  function localeMonthsParse(monthName, format2, strict) {
    var i2, mom, regex;
    if (this._monthsParseExact) {
      return handleStrictParse.call(this, monthName, format2, strict);
    }
    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
    }
    for (i2 = 0; i2 < 12; i2++) {
      mom = createUTC([2e3, i2]);
      if (strict && !this._longMonthsParse[i2]) {
        this._longMonthsParse[i2] = new RegExp(
          "^" + this.months(mom, "").replace(".", "") + "$",
          "i"
        );
        this._shortMonthsParse[i2] = new RegExp(
          "^" + this.monthsShort(mom, "").replace(".", "") + "$",
          "i"
        );
      }
      if (!strict && !this._monthsParse[i2]) {
        regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
        this._monthsParse[i2] = new RegExp(regex.replace(".", ""), "i");
      }
      if (strict && format2 === "MMMM" && this._longMonthsParse[i2].test(monthName)) {
        return i2;
      } else if (strict && format2 === "MMM" && this._shortMonthsParse[i2].test(monthName)) {
        return i2;
      } else if (!strict && this._monthsParse[i2].test(monthName)) {
        return i2;
      }
    }
  }
  function setMonth(mom, value) {
    var dayOfMonth;
    if (!mom.isValid()) {
      return mom;
    }
    if (typeof value === "string") {
      if (/^\d+$/.test(value)) {
        value = toInt(value);
      } else {
        value = mom.localeData().monthsParse(value);
        if (!isNumber(value)) {
          return mom;
        }
      }
    }
    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth);
    return mom;
  }
  function getSetMonth(value) {
    if (value != null) {
      setMonth(this, value);
      hooks.updateOffset(this, true);
      return this;
    } else {
      return get(this, "Month");
    }
  }
  function getDaysInMonth() {
    return daysInMonth(this.year(), this.month());
  }
  function monthsShortRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!hasOwnProp(this, "_monthsRegex")) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsShortStrictRegex;
      } else {
        return this._monthsShortRegex;
      }
    } else {
      if (!hasOwnProp(this, "_monthsShortRegex")) {
        this._monthsShortRegex = defaultMonthsShortRegex;
      }
      return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
    }
  }
  function monthsRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!hasOwnProp(this, "_monthsRegex")) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsStrictRegex;
      } else {
        return this._monthsRegex;
      }
    } else {
      if (!hasOwnProp(this, "_monthsRegex")) {
        this._monthsRegex = defaultMonthsRegex;
      }
      return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
    }
  }
  function computeMonthsParse() {
    function cmpLenRev(a2, b2) {
      return b2.length - a2.length;
    }
    var shortPieces = [], longPieces = [], mixedPieces = [], i2, mom;
    for (i2 = 0; i2 < 12; i2++) {
      mom = createUTC([2e3, i2]);
      shortPieces.push(this.monthsShort(mom, ""));
      longPieces.push(this.months(mom, ""));
      mixedPieces.push(this.months(mom, ""));
      mixedPieces.push(this.monthsShort(mom, ""));
    }
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i2 = 0; i2 < 12; i2++) {
      shortPieces[i2] = regexEscape(shortPieces[i2]);
      longPieces[i2] = regexEscape(longPieces[i2]);
    }
    for (i2 = 0; i2 < 24; i2++) {
      mixedPieces[i2] = regexEscape(mixedPieces[i2]);
    }
    this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp(
      "^(" + longPieces.join("|") + ")",
      "i"
    );
    this._monthsShortStrictRegex = new RegExp(
      "^(" + shortPieces.join("|") + ")",
      "i"
    );
  }
  addFormatToken("Y", 0, 0, function() {
    var y = this.year();
    return y <= 9999 ? zeroFill(y, 4) : "+" + y;
  });
  addFormatToken(0, ["YY", 2], 0, function() {
    return this.year() % 100;
  });
  addFormatToken(0, ["YYYY", 4], 0, "year");
  addFormatToken(0, ["YYYYY", 5], 0, "year");
  addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
  addUnitAlias("year", "y");
  addUnitPriority("year", 1);
  addRegexToken("Y", matchSigned);
  addRegexToken("YY", match1to2, match2);
  addRegexToken("YYYY", match1to4, match4);
  addRegexToken("YYYYY", match1to6, match6);
  addRegexToken("YYYYYY", match1to6, match6);
  addParseToken(["YYYYY", "YYYYYY"], YEAR);
  addParseToken("YYYY", function(input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
  });
  addParseToken("YY", function(input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
  });
  addParseToken("Y", function(input, array) {
    array[YEAR] = parseInt(input, 10);
  });
  function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
  }
  hooks.parseTwoDigitYear = function(input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
  };
  var getSetYear = makeGetSet("FullYear", true);
  function getIsLeapYear() {
    return isLeapYear(this.year());
  }
  function createDate(y, m2, d2, h2, M2, s2, ms2) {
    var date;
    if (y < 100 && y >= 0) {
      date = new Date(y + 400, m2, d2, h2, M2, s2, ms2);
      if (isFinite(date.getFullYear())) {
        date.setFullYear(y);
      }
    } else {
      date = new Date(y, m2, d2, h2, M2, s2, ms2);
    }
    return date;
  }
  function createUTCDate(y) {
    var date, args;
    if (y < 100 && y >= 0) {
      args = Array.prototype.slice.call(arguments);
      args[0] = y + 400;
      date = new Date(Date.UTC.apply(null, args));
      if (isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
      }
    } else {
      date = new Date(Date.UTC.apply(null, arguments));
    }
    return date;
  }
  function firstWeekOffset(year, dow, doy) {
    var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
  }
  function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
    if (dayOfYear <= 0) {
      resYear = year - 1;
      resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
      resYear = year + 1;
      resDayOfYear = dayOfYear - daysInYear(year);
    } else {
      resYear = year;
      resDayOfYear = dayOfYear;
    }
    return {
      year: resYear,
      dayOfYear: resDayOfYear
    };
  }
  function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
    if (week < 1) {
      resYear = mom.year() - 1;
      resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
      resWeek = week - weeksInYear(mom.year(), dow, doy);
      resYear = mom.year() + 1;
    } else {
      resYear = mom.year();
      resWeek = week;
    }
    return {
      week: resWeek,
      year: resYear
    };
  }
  function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
  }
  addFormatToken("w", ["ww", 2], "wo", "week");
  addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
  addUnitAlias("week", "w");
  addUnitAlias("isoWeek", "W");
  addUnitPriority("week", 5);
  addUnitPriority("isoWeek", 5);
  addRegexToken("w", match1to2);
  addRegexToken("ww", match1to2, match2);
  addRegexToken("W", match1to2);
  addRegexToken("WW", match1to2, match2);
  addWeekParseToken(
    ["w", "ww", "W", "WW"],
    function(input, week, config, token2) {
      week[token2.substr(0, 1)] = toInt(input);
    }
  );
  function localeWeek(mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
  }
  var defaultLocaleWeek = {
    dow: 0,
    doy: 6
  };
  function localeFirstDayOfWeek() {
    return this._week.dow;
  }
  function localeFirstDayOfYear() {
    return this._week.doy;
  }
  function getSetWeek(input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, "d");
  }
  function getSetISOWeek(input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, "d");
  }
  addFormatToken("d", 0, "do", "day");
  addFormatToken("dd", 0, 0, function(format2) {
    return this.localeData().weekdaysMin(this, format2);
  });
  addFormatToken("ddd", 0, 0, function(format2) {
    return this.localeData().weekdaysShort(this, format2);
  });
  addFormatToken("dddd", 0, 0, function(format2) {
    return this.localeData().weekdays(this, format2);
  });
  addFormatToken("e", 0, 0, "weekday");
  addFormatToken("E", 0, 0, "isoWeekday");
  addUnitAlias("day", "d");
  addUnitAlias("weekday", "e");
  addUnitAlias("isoWeekday", "E");
  addUnitPriority("day", 11);
  addUnitPriority("weekday", 11);
  addUnitPriority("isoWeekday", 11);
  addRegexToken("d", match1to2);
  addRegexToken("e", match1to2);
  addRegexToken("E", match1to2);
  addRegexToken("dd", function(isStrict, locale2) {
    return locale2.weekdaysMinRegex(isStrict);
  });
  addRegexToken("ddd", function(isStrict, locale2) {
    return locale2.weekdaysShortRegex(isStrict);
  });
  addRegexToken("dddd", function(isStrict, locale2) {
    return locale2.weekdaysRegex(isStrict);
  });
  addWeekParseToken(["dd", "ddd", "dddd"], function(input, week, config, token2) {
    var weekday = config._locale.weekdaysParse(input, token2, config._strict);
    if (weekday != null) {
      week.d = weekday;
    } else {
      getParsingFlags(config).invalidWeekday = input;
    }
  });
  addWeekParseToken(["d", "e", "E"], function(input, week, config, token2) {
    week[token2] = toInt(input);
  });
  function parseWeekday(input, locale2) {
    if (typeof input !== "string") {
      return input;
    }
    if (!isNaN(input)) {
      return parseInt(input, 10);
    }
    input = locale2.weekdaysParse(input);
    if (typeof input === "number") {
      return input;
    }
    return null;
  }
  function parseIsoWeekday(input, locale2) {
    if (typeof input === "string") {
      return locale2.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
  }
  function shiftWeekdays(ws2, n2) {
    return ws2.slice(n2, 7).concat(ws2.slice(0, n2));
  }
  var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
  function localeWeekdays(m2, format2) {
    var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m2 && m2 !== true && this._weekdays.isFormat.test(format2) ? "format" : "standalone"];
    return m2 === true ? shiftWeekdays(weekdays, this._week.dow) : m2 ? weekdays[m2.day()] : weekdays;
  }
  function localeWeekdaysShort(m2) {
    return m2 === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m2 ? this._weekdaysShort[m2.day()] : this._weekdaysShort;
  }
  function localeWeekdaysMin(m2) {
    return m2 === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m2 ? this._weekdaysMin[m2.day()] : this._weekdaysMin;
  }
  function handleStrictParse$1(weekdayName, format2, strict) {
    var i2, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
      this._weekdaysParse = [];
      this._shortWeekdaysParse = [];
      this._minWeekdaysParse = [];
      for (i2 = 0; i2 < 7; ++i2) {
        mom = createUTC([2e3, 1]).day(i2);
        this._minWeekdaysParse[i2] = this.weekdaysMin(
          mom,
          ""
        ).toLocaleLowerCase();
        this._shortWeekdaysParse[i2] = this.weekdaysShort(
          mom,
          ""
        ).toLocaleLowerCase();
        this._weekdaysParse[i2] = this.weekdays(mom, "").toLocaleLowerCase();
      }
    }
    if (strict) {
      if (format2 === "dddd") {
        ii = indexOf.call(this._weekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else if (format2 === "ddd") {
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      }
    } else {
      if (format2 === "dddd") {
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else if (format2 === "ddd") {
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._minWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      }
    }
  }
  function localeWeekdaysParse(weekdayName, format2, strict) {
    var i2, mom, regex;
    if (this._weekdaysParseExact) {
      return handleStrictParse$1.call(this, weekdayName, format2, strict);
    }
    if (!this._weekdaysParse) {
      this._weekdaysParse = [];
      this._minWeekdaysParse = [];
      this._shortWeekdaysParse = [];
      this._fullWeekdaysParse = [];
    }
    for (i2 = 0; i2 < 7; i2++) {
      mom = createUTC([2e3, 1]).day(i2);
      if (strict && !this._fullWeekdaysParse[i2]) {
        this._fullWeekdaysParse[i2] = new RegExp(
          "^" + this.weekdays(mom, "").replace(".", "\\.?") + "$",
          "i"
        );
        this._shortWeekdaysParse[i2] = new RegExp(
          "^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$",
          "i"
        );
        this._minWeekdaysParse[i2] = new RegExp(
          "^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$",
          "i"
        );
      }
      if (!this._weekdaysParse[i2]) {
        regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
        this._weekdaysParse[i2] = new RegExp(regex.replace(".", ""), "i");
      }
      if (strict && format2 === "dddd" && this._fullWeekdaysParse[i2].test(weekdayName)) {
        return i2;
      } else if (strict && format2 === "ddd" && this._shortWeekdaysParse[i2].test(weekdayName)) {
        return i2;
      } else if (strict && format2 === "dd" && this._minWeekdaysParse[i2].test(weekdayName)) {
        return i2;
      } else if (!strict && this._weekdaysParse[i2].test(weekdayName)) {
        return i2;
      }
    }
  }
  function getSetDayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
      input = parseWeekday(input, this.localeData());
      return this.add(input - day, "d");
    } else {
      return day;
    }
  }
  function getSetLocaleDayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, "d");
  }
  function getSetISODayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    if (input != null) {
      var weekday = parseIsoWeekday(input, this.localeData());
      return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
      return this.day() || 7;
    }
  }
  function weekdaysRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, "_weekdaysRegex")) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysStrictRegex;
      } else {
        return this._weekdaysRegex;
      }
    } else {
      if (!hasOwnProp(this, "_weekdaysRegex")) {
        this._weekdaysRegex = defaultWeekdaysRegex;
      }
      return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
    }
  }
  function weekdaysShortRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, "_weekdaysRegex")) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysShortStrictRegex;
      } else {
        return this._weekdaysShortRegex;
      }
    } else {
      if (!hasOwnProp(this, "_weekdaysShortRegex")) {
        this._weekdaysShortRegex = defaultWeekdaysShortRegex;
      }
      return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
  }
  function weekdaysMinRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, "_weekdaysRegex")) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysMinStrictRegex;
      } else {
        return this._weekdaysMinRegex;
      }
    } else {
      if (!hasOwnProp(this, "_weekdaysMinRegex")) {
        this._weekdaysMinRegex = defaultWeekdaysMinRegex;
      }
      return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
  }
  function computeWeekdaysParse() {
    function cmpLenRev(a2, b2) {
      return b2.length - a2.length;
    }
    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i2, mom, minp, shortp, longp;
    for (i2 = 0; i2 < 7; i2++) {
      mom = createUTC([2e3, 1]).day(i2);
      minp = regexEscape(this.weekdaysMin(mom, ""));
      shortp = regexEscape(this.weekdaysShort(mom, ""));
      longp = regexEscape(this.weekdays(mom, ""));
      minPieces.push(minp);
      shortPieces.push(shortp);
      longPieces.push(longp);
      mixedPieces.push(minp);
      mixedPieces.push(shortp);
      mixedPieces.push(longp);
    }
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;
    this._weekdaysStrictRegex = new RegExp(
      "^(" + longPieces.join("|") + ")",
      "i"
    );
    this._weekdaysShortStrictRegex = new RegExp(
      "^(" + shortPieces.join("|") + ")",
      "i"
    );
    this._weekdaysMinStrictRegex = new RegExp(
      "^(" + minPieces.join("|") + ")",
      "i"
    );
  }
  function hFormat() {
    return this.hours() % 12 || 12;
  }
  function kFormat() {
    return this.hours() || 24;
  }
  addFormatToken("H", ["HH", 2], 0, "hour");
  addFormatToken("h", ["hh", 2], 0, hFormat);
  addFormatToken("k", ["kk", 2], 0, kFormat);
  addFormatToken("hmm", 0, 0, function() {
    return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
  });
  addFormatToken("hmmss", 0, 0, function() {
    return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
  });
  addFormatToken("Hmm", 0, 0, function() {
    return "" + this.hours() + zeroFill(this.minutes(), 2);
  });
  addFormatToken("Hmmss", 0, 0, function() {
    return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
  });
  function meridiem(token2, lowercase) {
    addFormatToken(token2, 0, 0, function() {
      return this.localeData().meridiem(
        this.hours(),
        this.minutes(),
        lowercase
      );
    });
  }
  meridiem("a", true);
  meridiem("A", false);
  addUnitAlias("hour", "h");
  addUnitPriority("hour", 13);
  function matchMeridiem(isStrict, locale2) {
    return locale2._meridiemParse;
  }
  addRegexToken("a", matchMeridiem);
  addRegexToken("A", matchMeridiem);
  addRegexToken("H", match1to2);
  addRegexToken("h", match1to2);
  addRegexToken("k", match1to2);
  addRegexToken("HH", match1to2, match2);
  addRegexToken("hh", match1to2, match2);
  addRegexToken("kk", match1to2, match2);
  addRegexToken("hmm", match3to4);
  addRegexToken("hmmss", match5to6);
  addRegexToken("Hmm", match3to4);
  addRegexToken("Hmmss", match5to6);
  addParseToken(["H", "HH"], HOUR);
  addParseToken(["k", "kk"], function(input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
  });
  addParseToken(["a", "A"], function(input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
  });
  addParseToken(["h", "hh"], function(input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
  });
  addParseToken("hmm", function(input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
  });
  addParseToken("hmmss", function(input, array, config) {
    var pos1 = input.length - 4, pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
  });
  addParseToken("Hmm", function(input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
  });
  addParseToken("Hmmss", function(input, array, config) {
    var pos1 = input.length - 4, pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
  });
  function localeIsPM(input) {
    return (input + "").toLowerCase().charAt(0) === "p";
  }
  var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
  function localeMeridiem(hours2, minutes2, isLower) {
    if (hours2 > 11) {
      return isLower ? "pm" : "PM";
    } else {
      return isLower ? "am" : "AM";
    }
  }
  var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,
    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,
    week: defaultLocaleWeek,
    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,
    meridiemParse: defaultLocaleMeridiemParse
  };
  var locales = {}, localeFamilies = {}, globalLocale;
  function commonPrefix(arr1, arr2) {
    var i2, minl = Math.min(arr1.length, arr2.length);
    for (i2 = 0; i2 < minl; i2 += 1) {
      if (arr1[i2] !== arr2[i2]) {
        return i2;
      }
    }
    return minl;
  }
  function normalizeLocale(key) {
    return key ? key.toLowerCase().replace("_", "-") : key;
  }
  function chooseLocale(names) {
    var i2 = 0, j2, next, locale2, split;
    while (i2 < names.length) {
      split = normalizeLocale(names[i2]).split("-");
      j2 = split.length;
      next = normalizeLocale(names[i2 + 1]);
      next = next ? next.split("-") : null;
      while (j2 > 0) {
        locale2 = loadLocale(split.slice(0, j2).join("-"));
        if (locale2) {
          return locale2;
        }
        if (next && next.length >= j2 && commonPrefix(split, next) >= j2 - 1) {
          break;
        }
        j2--;
      }
      i2++;
    }
    return globalLocale;
  }
  function isLocaleNameSane(name) {
    return name.match("^[^/\\\\]*$") != null;
  }
  function loadLocale(name) {
    var oldLocale = null, aliasedRequire;
    if (locales[name] === void 0 && typeof module !== "undefined" && module && module.exports && isLocaleNameSane(name)) {
      try {
        oldLocale = globalLocale._abbr;
        aliasedRequire = require;
        aliasedRequire("./locale/" + name);
        getSetGlobalLocale(oldLocale);
      } catch (e) {
        locales[name] = null;
      }
    }
    return locales[name];
  }
  function getSetGlobalLocale(key, values) {
    var data;
    if (key) {
      if (isUndefined(values)) {
        data = getLocale(key);
      } else {
        data = defineLocale(key, values);
      }
      if (data) {
        globalLocale = data;
      } else {
        if (typeof console !== "undefined" && console.warn) {
          formatAppLog(
            "warn",
            "at node_modules/moment/dist/moment.js:2125",
            "Locale " + key + " not found. Did you forget to load it?"
          );
        }
      }
    }
    return globalLocale._abbr;
  }
  function defineLocale(name, config) {
    if (config !== null) {
      var locale2, parentConfig = baseConfig;
      config.abbr = name;
      if (locales[name] != null) {
        deprecateSimple(
          "defineLocaleOverride",
          "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
        );
        parentConfig = locales[name]._config;
      } else if (config.parentLocale != null) {
        if (locales[config.parentLocale] != null) {
          parentConfig = locales[config.parentLocale]._config;
        } else {
          locale2 = loadLocale(config.parentLocale);
          if (locale2 != null) {
            parentConfig = locale2._config;
          } else {
            if (!localeFamilies[config.parentLocale]) {
              localeFamilies[config.parentLocale] = [];
            }
            localeFamilies[config.parentLocale].push({
              name,
              config
            });
            return null;
          }
        }
      }
      locales[name] = new Locale(mergeConfigs(parentConfig, config));
      if (localeFamilies[name]) {
        localeFamilies[name].forEach(function(x2) {
          defineLocale(x2.name, x2.config);
        });
      }
      getSetGlobalLocale(name);
      return locales[name];
    } else {
      delete locales[name];
      return null;
    }
  }
  function updateLocale(name, config) {
    if (config != null) {
      var locale2, tmpLocale, parentConfig = baseConfig;
      if (locales[name] != null && locales[name].parentLocale != null) {
        locales[name].set(mergeConfigs(locales[name]._config, config));
      } else {
        tmpLocale = loadLocale(name);
        if (tmpLocale != null) {
          parentConfig = tmpLocale._config;
        }
        config = mergeConfigs(parentConfig, config);
        if (tmpLocale == null) {
          config.abbr = name;
        }
        locale2 = new Locale(config);
        locale2.parentLocale = locales[name];
        locales[name] = locale2;
      }
      getSetGlobalLocale(name);
    } else {
      if (locales[name] != null) {
        if (locales[name].parentLocale != null) {
          locales[name] = locales[name].parentLocale;
          if (name === getSetGlobalLocale()) {
            getSetGlobalLocale(name);
          }
        } else if (locales[name] != null) {
          delete locales[name];
        }
      }
    }
    return locales[name];
  }
  function getLocale(key) {
    var locale2;
    if (key && key._locale && key._locale._abbr) {
      key = key._locale._abbr;
    }
    if (!key) {
      return globalLocale;
    }
    if (!isArray(key)) {
      locale2 = loadLocale(key);
      if (locale2) {
        return locale2;
      }
      key = [key];
    }
    return chooseLocale(key);
  }
  function listLocales() {
    return keys(locales);
  }
  function checkOverflow(m2) {
    var overflow, a2 = m2._a;
    if (a2 && getParsingFlags(m2).overflow === -2) {
      overflow = a2[MONTH] < 0 || a2[MONTH] > 11 ? MONTH : a2[DATE] < 1 || a2[DATE] > daysInMonth(a2[YEAR], a2[MONTH]) ? DATE : a2[HOUR] < 0 || a2[HOUR] > 24 || a2[HOUR] === 24 && (a2[MINUTE] !== 0 || a2[SECOND] !== 0 || a2[MILLISECOND] !== 0) ? HOUR : a2[MINUTE] < 0 || a2[MINUTE] > 59 ? MINUTE : a2[SECOND] < 0 || a2[SECOND] > 59 ? SECOND : a2[MILLISECOND] < 0 || a2[MILLISECOND] > 999 ? MILLISECOND : -1;
      if (getParsingFlags(m2)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
        overflow = DATE;
      }
      if (getParsingFlags(m2)._overflowWeeks && overflow === -1) {
        overflow = WEEK;
      }
      if (getParsingFlags(m2)._overflowWeekday && overflow === -1) {
        overflow = WEEKDAY;
      }
      getParsingFlags(m2).overflow = overflow;
    }
    return m2;
  }
  var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
    ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
    ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
    ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
    ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
    ["YYYY-DDD", /\d{4}-\d{3}/],
    ["YYYY-MM", /\d{4}-\d\d/, false],
    ["YYYYYYMMDD", /[+-]\d{10}/],
    ["YYYYMMDD", /\d{8}/],
    ["GGGG[W]WWE", /\d{4}W\d{3}/],
    ["GGGG[W]WW", /\d{4}W\d{2}/, false],
    ["YYYYDDD", /\d{7}/],
    ["YYYYMM", /\d{6}/, false],
    ["YYYY", /\d{4}/, false]
  ], isoTimes = [
    ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
    ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
    ["HH:mm:ss", /\d\d:\d\d:\d\d/],
    ["HH:mm", /\d\d:\d\d/],
    ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
    ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
    ["HHmmss", /\d\d\d\d\d\d/],
    ["HHmm", /\d\d\d\d/],
    ["HH", /\d\d/]
  ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
    UT: 0,
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
  };
  function configFromISO(config) {
    var i2, l2, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
    if (match) {
      getParsingFlags(config).iso = true;
      for (i2 = 0, l2 = isoDatesLen; i2 < l2; i2++) {
        if (isoDates[i2][1].exec(match[1])) {
          dateFormat = isoDates[i2][0];
          allowTime = isoDates[i2][2] !== false;
          break;
        }
      }
      if (dateFormat == null) {
        config._isValid = false;
        return;
      }
      if (match[3]) {
        for (i2 = 0, l2 = isoTimesLen; i2 < l2; i2++) {
          if (isoTimes[i2][1].exec(match[3])) {
            timeFormat = (match[2] || " ") + isoTimes[i2][0];
            break;
          }
        }
        if (timeFormat == null) {
          config._isValid = false;
          return;
        }
      }
      if (!allowTime && timeFormat != null) {
        config._isValid = false;
        return;
      }
      if (match[4]) {
        if (tzRegex.exec(match[4])) {
          tzFormat = "Z";
        } else {
          config._isValid = false;
          return;
        }
      }
      config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
      configFromStringAndFormat(config);
    } else {
      config._isValid = false;
    }
  }
  function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    var result = [
      untruncateYear(yearStr),
      defaultLocaleMonthsShort.indexOf(monthStr),
      parseInt(dayStr, 10),
      parseInt(hourStr, 10),
      parseInt(minuteStr, 10)
    ];
    if (secondStr) {
      result.push(parseInt(secondStr, 10));
    }
    return result;
  }
  function untruncateYear(yearStr) {
    var year = parseInt(yearStr, 10);
    if (year <= 49) {
      return 2e3 + year;
    } else if (year <= 999) {
      return 1900 + year;
    }
    return year;
  }
  function preprocessRFC2822(s2) {
    return s2.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  }
  function checkWeekday(weekdayStr, parsedInput, config) {
    if (weekdayStr) {
      var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(
        parsedInput[0],
        parsedInput[1],
        parsedInput[2]
      ).getDay();
      if (weekdayProvided !== weekdayActual) {
        getParsingFlags(config).weekdayMismatch = true;
        config._isValid = false;
        return false;
      }
    }
    return true;
  }
  function calculateOffset(obsOffset, militaryOffset, numOffset) {
    if (obsOffset) {
      return obsOffsets[obsOffset];
    } else if (militaryOffset) {
      return 0;
    } else {
      var hm = parseInt(numOffset, 10), m2 = hm % 100, h2 = (hm - m2) / 100;
      return h2 * 60 + m2;
    }
  }
  function configFromRFC2822(config) {
    var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
    if (match) {
      parsedArray = extractFromRFC2822Strings(
        match[4],
        match[3],
        match[2],
        match[5],
        match[6],
        match[7]
      );
      if (!checkWeekday(match[1], parsedArray, config)) {
        return;
      }
      config._a = parsedArray;
      config._tzm = calculateOffset(match[8], match[9], match[10]);
      config._d = createUTCDate.apply(null, config._a);
      config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
      getParsingFlags(config).rfc2822 = true;
    } else {
      config._isValid = false;
    }
  }
  function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);
    if (matched !== null) {
      config._d = new Date(+matched[1]);
      return;
    }
    configFromISO(config);
    if (config._isValid === false) {
      delete config._isValid;
    } else {
      return;
    }
    configFromRFC2822(config);
    if (config._isValid === false) {
      delete config._isValid;
    } else {
      return;
    }
    if (config._strict) {
      config._isValid = false;
    } else {
      hooks.createFromInputFallback(config);
    }
  }
  hooks.createFromInputFallback = deprecate(
    "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
    function(config) {
      config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
    }
  );
  function defaults(a2, b2, c2) {
    if (a2 != null) {
      return a2;
    }
    if (b2 != null) {
      return b2;
    }
    return c2;
  }
  function currentDateArray(config) {
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
      return [
        nowValue.getUTCFullYear(),
        nowValue.getUTCMonth(),
        nowValue.getUTCDate()
      ];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
  }
  function configFromArray(config) {
    var i2, date, input = [], currentDate, expectedWeekday, yearToUse;
    if (config._d) {
      return;
    }
    currentDate = currentDateArray(config);
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
      dayOfYearFromWeekInfo(config);
    }
    if (config._dayOfYear != null) {
      yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
      if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
        getParsingFlags(config)._overflowDayOfYear = true;
      }
      date = createUTCDate(yearToUse, 0, config._dayOfYear);
      config._a[MONTH] = date.getUTCMonth();
      config._a[DATE] = date.getUTCDate();
    }
    for (i2 = 0; i2 < 3 && config._a[i2] == null; ++i2) {
      config._a[i2] = input[i2] = currentDate[i2];
    }
    for (; i2 < 7; i2++) {
      config._a[i2] = input[i2] = config._a[i2] == null ? i2 === 2 ? 1 : 0 : config._a[i2];
    }
    if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
      config._nextDay = true;
      config._a[HOUR] = 0;
    }
    config._d = (config._useUTC ? createUTCDate : createDate).apply(
      null,
      input
    );
    expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
    if (config._tzm != null) {
      config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }
    if (config._nextDay) {
      config._a[HOUR] = 24;
    }
    if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
      getParsingFlags(config).weekdayMismatch = true;
    }
  }
  function dayOfYearFromWeekInfo(config) {
    var w2, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
    w2 = config._w;
    if (w2.GG != null || w2.W != null || w2.E != null) {
      dow = 1;
      doy = 4;
      weekYear = defaults(
        w2.GG,
        config._a[YEAR],
        weekOfYear(createLocal(), 1, 4).year
      );
      week = defaults(w2.W, 1);
      weekday = defaults(w2.E, 1);
      if (weekday < 1 || weekday > 7) {
        weekdayOverflow = true;
      }
    } else {
      dow = config._locale._week.dow;
      doy = config._locale._week.doy;
      curWeek = weekOfYear(createLocal(), dow, doy);
      weekYear = defaults(w2.gg, config._a[YEAR], curWeek.year);
      week = defaults(w2.w, curWeek.week);
      if (w2.d != null) {
        weekday = w2.d;
        if (weekday < 0 || weekday > 6) {
          weekdayOverflow = true;
        }
      } else if (w2.e != null) {
        weekday = w2.e + dow;
        if (w2.e < 0 || w2.e > 6) {
          weekdayOverflow = true;
        }
      } else {
        weekday = dow;
      }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
      getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
      getParsingFlags(config)._overflowWeekday = true;
    } else {
      temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
      config._a[YEAR] = temp.year;
      config._dayOfYear = temp.dayOfYear;
    }
  }
  hooks.ISO_8601 = function() {
  };
  hooks.RFC_2822 = function() {
  };
  function configFromStringAndFormat(config) {
    if (config._f === hooks.ISO_8601) {
      configFromISO(config);
      return;
    }
    if (config._f === hooks.RFC_2822) {
      configFromRFC2822(config);
      return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;
    var string = "" + config._i, i2, parsedInput, tokens2, token2, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
    tokens2 = expandFormat(config._f, config._locale).match(formattingTokens) || [];
    tokenLen = tokens2.length;
    for (i2 = 0; i2 < tokenLen; i2++) {
      token2 = tokens2[i2];
      parsedInput = (string.match(getParseRegexForToken(token2, config)) || [])[0];
      if (parsedInput) {
        skipped = string.substr(0, string.indexOf(parsedInput));
        if (skipped.length > 0) {
          getParsingFlags(config).unusedInput.push(skipped);
        }
        string = string.slice(
          string.indexOf(parsedInput) + parsedInput.length
        );
        totalParsedInputLength += parsedInput.length;
      }
      if (formatTokenFunctions[token2]) {
        if (parsedInput) {
          getParsingFlags(config).empty = false;
        } else {
          getParsingFlags(config).unusedTokens.push(token2);
        }
        addTimeToArrayFromToken(token2, parsedInput, config);
      } else if (config._strict && !parsedInput) {
        getParsingFlags(config).unusedTokens.push(token2);
      }
    }
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
      getParsingFlags(config).unusedInput.push(string);
    }
    if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
      getParsingFlags(config).bigHour = void 0;
    }
    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    config._a[HOUR] = meridiemFixWrap(
      config._locale,
      config._a[HOUR],
      config._meridiem
    );
    era = getParsingFlags(config).era;
    if (era !== null) {
      config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
    }
    configFromArray(config);
    checkOverflow(config);
  }
  function meridiemFixWrap(locale2, hour, meridiem2) {
    var isPm;
    if (meridiem2 == null) {
      return hour;
    }
    if (locale2.meridiemHour != null) {
      return locale2.meridiemHour(hour, meridiem2);
    } else if (locale2.isPM != null) {
      isPm = locale2.isPM(meridiem2);
      if (isPm && hour < 12) {
        hour += 12;
      }
      if (!isPm && hour === 12) {
        hour = 0;
      }
      return hour;
    } else {
      return hour;
    }
  }
  function configFromStringAndArray(config) {
    var tempConfig, bestMoment, scoreToBeat, i2, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
    if (configfLen === 0) {
      getParsingFlags(config).invalidFormat = true;
      config._d = new Date(NaN);
      return;
    }
    for (i2 = 0; i2 < configfLen; i2++) {
      currentScore = 0;
      validFormatFound = false;
      tempConfig = copyConfig({}, config);
      if (config._useUTC != null) {
        tempConfig._useUTC = config._useUTC;
      }
      tempConfig._f = config._f[i2];
      configFromStringAndFormat(tempConfig);
      if (isValid(tempConfig)) {
        validFormatFound = true;
      }
      currentScore += getParsingFlags(tempConfig).charsLeftOver;
      currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
      getParsingFlags(tempConfig).score = currentScore;
      if (!bestFormatIsValid) {
        if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
          scoreToBeat = currentScore;
          bestMoment = tempConfig;
          if (validFormatFound) {
            bestFormatIsValid = true;
          }
        }
      } else {
        if (currentScore < scoreToBeat) {
          scoreToBeat = currentScore;
          bestMoment = tempConfig;
        }
      }
    }
    extend(config, bestMoment || tempConfig);
  }
  function configFromObject(config) {
    if (config._d) {
      return;
    }
    var i2 = normalizeObjectUnits(config._i), dayOrDate = i2.day === void 0 ? i2.date : i2.day;
    config._a = map(
      [i2.year, i2.month, dayOrDate, i2.hour, i2.minute, i2.second, i2.millisecond],
      function(obj) {
        return obj && parseInt(obj, 10);
      }
    );
    configFromArray(config);
  }
  function createFromConfig(config) {
    var res2 = new Moment(checkOverflow(prepareConfig(config)));
    if (res2._nextDay) {
      res2.add(1, "d");
      res2._nextDay = void 0;
    }
    return res2;
  }
  function prepareConfig(config) {
    var input = config._i, format2 = config._f;
    config._locale = config._locale || getLocale(config._l);
    if (input === null || format2 === void 0 && input === "") {
      return createInvalid({ nullInput: true });
    }
    if (typeof input === "string") {
      config._i = input = config._locale.preparse(input);
    }
    if (isMoment(input)) {
      return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
      config._d = input;
    } else if (isArray(format2)) {
      configFromStringAndArray(config);
    } else if (format2) {
      configFromStringAndFormat(config);
    } else {
      configFromInput(config);
    }
    if (!isValid(config)) {
      config._d = null;
    }
    return config;
  }
  function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
      config._d = new Date(hooks.now());
    } else if (isDate(input)) {
      config._d = new Date(input.valueOf());
    } else if (typeof input === "string") {
      configFromString(config);
    } else if (isArray(input)) {
      config._a = map(input.slice(0), function(obj) {
        return parseInt(obj, 10);
      });
      configFromArray(config);
    } else if (isObject(input)) {
      configFromObject(config);
    } else if (isNumber(input)) {
      config._d = new Date(input);
    } else {
      hooks.createFromInputFallback(config);
    }
  }
  function createLocalOrUTC(input, format2, locale2, strict, isUTC) {
    var c2 = {};
    if (format2 === true || format2 === false) {
      strict = format2;
      format2 = void 0;
    }
    if (locale2 === true || locale2 === false) {
      strict = locale2;
      locale2 = void 0;
    }
    if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
      input = void 0;
    }
    c2._isAMomentObject = true;
    c2._useUTC = c2._isUTC = isUTC;
    c2._l = locale2;
    c2._i = input;
    c2._f = format2;
    c2._strict = strict;
    return createFromConfig(c2);
  }
  function createLocal(input, format2, locale2, strict) {
    return createLocalOrUTC(input, format2, locale2, strict, false);
  }
  var prototypeMin = deprecate(
    "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
    function() {
      var other = createLocal.apply(null, arguments);
      if (this.isValid() && other.isValid()) {
        return other < this ? this : other;
      } else {
        return createInvalid();
      }
    }
  ), prototypeMax = deprecate(
    "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
    function() {
      var other = createLocal.apply(null, arguments);
      if (this.isValid() && other.isValid()) {
        return other > this ? this : other;
      } else {
        return createInvalid();
      }
    }
  );
  function pickBy(fn, moments) {
    var res2, i2;
    if (moments.length === 1 && isArray(moments[0])) {
      moments = moments[0];
    }
    if (!moments.length) {
      return createLocal();
    }
    res2 = moments[0];
    for (i2 = 1; i2 < moments.length; ++i2) {
      if (!moments[i2].isValid() || moments[i2][fn](res2)) {
        res2 = moments[i2];
      }
    }
    return res2;
  }
  function min() {
    var args = [].slice.call(arguments, 0);
    return pickBy("isBefore", args);
  }
  function max() {
    var args = [].slice.call(arguments, 0);
    return pickBy("isAfter", args);
  }
  var now = function() {
    return Date.now ? Date.now() : +new Date();
  };
  var ordering = [
    "year",
    "quarter",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ];
  function isDurationValid(m2) {
    var key, unitHasDecimal = false, i2, orderLen = ordering.length;
    for (key in m2) {
      if (hasOwnProp(m2, key) && !(indexOf.call(ordering, key) !== -1 && (m2[key] == null || !isNaN(m2[key])))) {
        return false;
      }
    }
    for (i2 = 0; i2 < orderLen; ++i2) {
      if (m2[ordering[i2]]) {
        if (unitHasDecimal) {
          return false;
        }
        if (parseFloat(m2[ordering[i2]]) !== toInt(m2[ordering[i2]])) {
          unitHasDecimal = true;
        }
      }
    }
    return true;
  }
  function isValid$1() {
    return this._isValid;
  }
  function createInvalid$1() {
    return createDuration(NaN);
  }
  function Duration(duration) {
    var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
    this._isValid = isDurationValid(normalizedInput);
    this._milliseconds = +milliseconds2 + seconds2 * 1e3 + minutes2 * 6e4 + hours2 * 1e3 * 60 * 60;
    this._days = +days2 + weeks2 * 7;
    this._months = +months2 + quarters * 3 + years2 * 12;
    this._data = {};
    this._locale = getLocale();
    this._bubble();
  }
  function isDuration(obj) {
    return obj instanceof Duration;
  }
  function absRound(number) {
    if (number < 0) {
      return Math.round(-1 * number) * -1;
    } else {
      return Math.round(number);
    }
  }
  function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i2;
    for (i2 = 0; i2 < len; i2++) {
      if (dontConvert && array1[i2] !== array2[i2] || !dontConvert && toInt(array1[i2]) !== toInt(array2[i2])) {
        diffs++;
      }
    }
    return diffs + lengthDiff;
  }
  function offset(token2, separator) {
    addFormatToken(token2, 0, 0, function() {
      var offset2 = this.utcOffset(), sign2 = "+";
      if (offset2 < 0) {
        offset2 = -offset2;
        sign2 = "-";
      }
      return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
    });
  }
  offset("Z", ":");
  offset("ZZ", "");
  addRegexToken("Z", matchShortOffset);
  addRegexToken("ZZ", matchShortOffset);
  addParseToken(["Z", "ZZ"], function(input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
  });
  var chunkOffset = /([\+\-]|\d\d)/gi;
  function offsetFromString(matcher, string) {
    var matches = (string || "").match(matcher), chunk, parts, minutes2;
    if (matches === null) {
      return null;
    }
    chunk = matches[matches.length - 1] || [];
    parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
    minutes2 = +(parts[1] * 60) + toInt(parts[2]);
    return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
  }
  function cloneWithOffset(input, model) {
    var res2, diff2;
    if (model._isUTC) {
      res2 = model.clone();
      diff2 = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res2.valueOf();
      res2._d.setTime(res2._d.valueOf() + diff2);
      hooks.updateOffset(res2, false);
      return res2;
    } else {
      return createLocal(input).local();
    }
  }
  function getDateOffset(m2) {
    return -Math.round(m2._d.getTimezoneOffset());
  }
  hooks.updateOffset = function() {
  };
  function getSetOffset(input, keepLocalTime, keepMinutes) {
    var offset2 = this._offset || 0, localAdjust;
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    if (input != null) {
      if (typeof input === "string") {
        input = offsetFromString(matchShortOffset, input);
        if (input === null) {
          return this;
        }
      } else if (Math.abs(input) < 16 && !keepMinutes) {
        input = input * 60;
      }
      if (!this._isUTC && keepLocalTime) {
        localAdjust = getDateOffset(this);
      }
      this._offset = input;
      this._isUTC = true;
      if (localAdjust != null) {
        this.add(localAdjust, "m");
      }
      if (offset2 !== input) {
        if (!keepLocalTime || this._changeInProgress) {
          addSubtract(
            this,
            createDuration(input - offset2, "m"),
            1,
            false
          );
        } else if (!this._changeInProgress) {
          this._changeInProgress = true;
          hooks.updateOffset(this, true);
          this._changeInProgress = null;
        }
      }
      return this;
    } else {
      return this._isUTC ? offset2 : getDateOffset(this);
    }
  }
  function getSetZone(input, keepLocalTime) {
    if (input != null) {
      if (typeof input !== "string") {
        input = -input;
      }
      this.utcOffset(input, keepLocalTime);
      return this;
    } else {
      return -this.utcOffset();
    }
  }
  function setOffsetToUTC(keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
  }
  function setOffsetToLocal(keepLocalTime) {
    if (this._isUTC) {
      this.utcOffset(0, keepLocalTime);
      this._isUTC = false;
      if (keepLocalTime) {
        this.subtract(getDateOffset(this), "m");
      }
    }
    return this;
  }
  function setOffsetToParsedOffset() {
    if (this._tzm != null) {
      this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === "string") {
      var tZone = offsetFromString(matchOffset, this._i);
      if (tZone != null) {
        this.utcOffset(tZone);
      } else {
        this.utcOffset(0, true);
      }
    }
    return this;
  }
  function hasAlignedHourOffset(input) {
    if (!this.isValid()) {
      return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;
    return (this.utcOffset() - input) % 60 === 0;
  }
  function isDaylightSavingTime() {
    return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
  }
  function isDaylightSavingTimeShifted() {
    if (!isUndefined(this._isDSTShifted)) {
      return this._isDSTShifted;
    }
    var c2 = {}, other;
    copyConfig(c2, this);
    c2 = prepareConfig(c2);
    if (c2._a) {
      other = c2._isUTC ? createUTC(c2._a) : createLocal(c2._a);
      this._isDSTShifted = this.isValid() && compareArrays(c2._a, other.toArray()) > 0;
    } else {
      this._isDSTShifted = false;
    }
    return this._isDSTShifted;
  }
  function isLocal() {
    return this.isValid() ? !this._isUTC : false;
  }
  function isUtcOffset() {
    return this.isValid() ? this._isUTC : false;
  }
  function isUtc() {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
  }
  var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
  function createDuration(input, key) {
    var duration = input, match = null, sign2, ret, diffRes;
    if (isDuration(input)) {
      duration = {
        ms: input._milliseconds,
        d: input._days,
        M: input._months
      };
    } else if (isNumber(input) || !isNaN(+input)) {
      duration = {};
      if (key) {
        duration[key] = +input;
      } else {
        duration.milliseconds = +input;
      }
    } else if (match = aspNetRegex.exec(input)) {
      sign2 = match[1] === "-" ? -1 : 1;
      duration = {
        y: 0,
        d: toInt(match[DATE]) * sign2,
        h: toInt(match[HOUR]) * sign2,
        m: toInt(match[MINUTE]) * sign2,
        s: toInt(match[SECOND]) * sign2,
        ms: toInt(absRound(match[MILLISECOND] * 1e3)) * sign2
      };
    } else if (match = isoRegex.exec(input)) {
      sign2 = match[1] === "-" ? -1 : 1;
      duration = {
        y: parseIso(match[2], sign2),
        M: parseIso(match[3], sign2),
        w: parseIso(match[4], sign2),
        d: parseIso(match[5], sign2),
        h: parseIso(match[6], sign2),
        m: parseIso(match[7], sign2),
        s: parseIso(match[8], sign2)
      };
    } else if (duration == null) {
      duration = {};
    } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
      diffRes = momentsDifference(
        createLocal(duration.from),
        createLocal(duration.to)
      );
      duration = {};
      duration.ms = diffRes.milliseconds;
      duration.M = diffRes.months;
    }
    ret = new Duration(duration);
    if (isDuration(input) && hasOwnProp(input, "_locale")) {
      ret._locale = input._locale;
    }
    if (isDuration(input) && hasOwnProp(input, "_isValid")) {
      ret._isValid = input._isValid;
    }
    return ret;
  }
  createDuration.fn = Duration.prototype;
  createDuration.invalid = createInvalid$1;
  function parseIso(inp, sign2) {
    var res2 = inp && parseFloat(inp.replace(",", "."));
    return (isNaN(res2) ? 0 : res2) * sign2;
  }
  function positiveMomentsDifference(base, other) {
    var res2 = {};
    res2.months = other.month() - base.month() + (other.year() - base.year()) * 12;
    if (base.clone().add(res2.months, "M").isAfter(other)) {
      --res2.months;
    }
    res2.milliseconds = +other - +base.clone().add(res2.months, "M");
    return res2;
  }
  function momentsDifference(base, other) {
    var res2;
    if (!(base.isValid() && other.isValid())) {
      return { milliseconds: 0, months: 0 };
    }
    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
      res2 = positiveMomentsDifference(base, other);
    } else {
      res2 = positiveMomentsDifference(other, base);
      res2.milliseconds = -res2.milliseconds;
      res2.months = -res2.months;
    }
    return res2;
  }
  function createAdder(direction, name) {
    return function(val, period) {
      var dur, tmp;
      if (period !== null && !isNaN(+period)) {
        deprecateSimple(
          name,
          "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
        );
        tmp = val;
        val = period;
        period = tmp;
      }
      dur = createDuration(val, period);
      addSubtract(this, dur, direction);
      return this;
    };
  }
  function addSubtract(mom, duration, isAdding, updateOffset) {
    var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
    if (!mom.isValid()) {
      return;
    }
    updateOffset = updateOffset == null ? true : updateOffset;
    if (months2) {
      setMonth(mom, get(mom, "Month") + months2 * isAdding);
    }
    if (days2) {
      set$1(mom, "Date", get(mom, "Date") + days2 * isAdding);
    }
    if (milliseconds2) {
      mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
    }
    if (updateOffset) {
      hooks.updateOffset(mom, days2 || months2);
    }
  }
  var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
  function isString(input) {
    return typeof input === "string" || input instanceof String;
  }
  function isMomentInput(input) {
    return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === void 0;
  }
  function isMomentInputObject(input) {
    var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
      "years",
      "year",
      "y",
      "months",
      "month",
      "M",
      "days",
      "day",
      "d",
      "dates",
      "date",
      "D",
      "hours",
      "hour",
      "h",
      "minutes",
      "minute",
      "m",
      "seconds",
      "second",
      "s",
      "milliseconds",
      "millisecond",
      "ms"
    ], i2, property, propertyLen = properties.length;
    for (i2 = 0; i2 < propertyLen; i2 += 1) {
      property = properties[i2];
      propertyTest = propertyTest || hasOwnProp(input, property);
    }
    return objectTest && propertyTest;
  }
  function isNumberOrStringArray(input) {
    var arrayTest = isArray(input), dataTypeTest = false;
    if (arrayTest) {
      dataTypeTest = input.filter(function(item) {
        return !isNumber(item) && isString(input);
      }).length === 0;
    }
    return arrayTest && dataTypeTest;
  }
  function isCalendarSpec(input) {
    var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
      "sameDay",
      "nextDay",
      "lastDay",
      "nextWeek",
      "lastWeek",
      "sameElse"
    ], i2, property;
    for (i2 = 0; i2 < properties.length; i2 += 1) {
      property = properties[i2];
      propertyTest = propertyTest || hasOwnProp(input, property);
    }
    return objectTest && propertyTest;
  }
  function getCalendarFormat(myMoment, now2) {
    var diff2 = myMoment.diff(now2, "days", true);
    return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
  }
  function calendar$1$1(time, formats) {
    if (arguments.length === 1) {
      if (!arguments[0]) {
        time = void 0;
        formats = void 0;
      } else if (isMomentInput(arguments[0])) {
        time = arguments[0];
        formats = void 0;
      } else if (isCalendarSpec(arguments[0])) {
        formats = arguments[0];
        time = void 0;
      }
    }
    var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format2 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format2]) ? formats[format2].call(this, now2) : formats[format2]);
    return this.format(
      output || this.localeData().calendar(format2, this, createLocal(now2))
    );
  }
  function clone() {
    return new Moment(this);
  }
  function isAfter(input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
      return false;
    }
    units = normalizeUnits(units) || "millisecond";
    if (units === "millisecond") {
      return this.valueOf() > localInput.valueOf();
    } else {
      return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
  }
  function isBefore(input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
      return false;
    }
    units = normalizeUnits(units) || "millisecond";
    if (units === "millisecond") {
      return this.valueOf() < localInput.valueOf();
    } else {
      return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
  }
  function isBetween(from2, to2, units, inclusivity) {
    var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
    if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
      return false;
    }
    inclusivity = inclusivity || "()";
    return (inclusivity[0] === "(" ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
  }
  function isSame(input, units) {
    var localInput = isMoment(input) ? input : createLocal(input), inputMs;
    if (!(this.isValid() && localInput.isValid())) {
      return false;
    }
    units = normalizeUnits(units) || "millisecond";
    if (units === "millisecond") {
      return this.valueOf() === localInput.valueOf();
    } else {
      inputMs = localInput.valueOf();
      return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
  }
  function isSameOrAfter(input, units) {
    return this.isSame(input, units) || this.isAfter(input, units);
  }
  function isSameOrBefore(input, units) {
    return this.isSame(input, units) || this.isBefore(input, units);
  }
  function diff(input, units, asFloat) {
    var that, zoneDelta, output;
    if (!this.isValid()) {
      return NaN;
    }
    that = cloneWithOffset(input, this);
    if (!that.isValid()) {
      return NaN;
    }
    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
    units = normalizeUnits(units);
    switch (units) {
      case "year":
        output = monthDiff(this, that) / 12;
        break;
      case "month":
        output = monthDiff(this, that);
        break;
      case "quarter":
        output = monthDiff(this, that) / 3;
        break;
      case "second":
        output = (this - that) / 1e3;
        break;
      case "minute":
        output = (this - that) / 6e4;
        break;
      case "hour":
        output = (this - that) / 36e5;
        break;
      case "day":
        output = (this - that - zoneDelta) / 864e5;
        break;
      case "week":
        output = (this - that - zoneDelta) / 6048e5;
        break;
      default:
        output = this - that;
    }
    return asFloat ? output : absFloor(output);
  }
  function monthDiff(a2, b2) {
    if (a2.date() < b2.date()) {
      return -monthDiff(b2, a2);
    }
    var wholeMonthDiff = (b2.year() - a2.year()) * 12 + (b2.month() - a2.month()), anchor = a2.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
    if (b2 - anchor < 0) {
      anchor2 = a2.clone().add(wholeMonthDiff - 1, "months");
      adjust = (b2 - anchor) / (anchor - anchor2);
    } else {
      anchor2 = a2.clone().add(wholeMonthDiff + 1, "months");
      adjust = (b2 - anchor) / (anchor2 - anchor);
    }
    return -(wholeMonthDiff + adjust) || 0;
  }
  hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
  hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
  function toString() {
    return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  }
  function toISOString(keepOffset) {
    if (!this.isValid()) {
      return null;
    }
    var utc2 = keepOffset !== true, m2 = utc2 ? this.clone().utc() : this;
    if (m2.year() < 0 || m2.year() > 9999) {
      return formatMoment(
        m2,
        utc2 ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
      );
    }
    if (isFunction(Date.prototype.toISOString)) {
      if (utc2) {
        return this.toDate().toISOString();
      } else {
        return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m2, "Z"));
      }
    }
    return formatMoment(
      m2,
      utc2 ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
    );
  }
  function inspect() {
    if (!this.isValid()) {
      return "moment.invalid(/* " + this._i + " */)";
    }
    var func = "moment", zone = "", prefix, year, datetime, suffix;
    if (!this.isLocal()) {
      func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
      zone = "Z";
    }
    prefix = "[" + func + '("]';
    year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
    datetime = "-MM-DD[T]HH:mm:ss.SSS";
    suffix = zone + '[")]';
    return this.format(prefix + year + datetime + suffix);
  }
  function format(inputString) {
    if (!inputString) {
      inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
  }
  function from(time, withoutSuffix) {
    if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
      return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
    } else {
      return this.localeData().invalidDate();
    }
  }
  function fromNow(withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
  }
  function to(time, withoutSuffix) {
    if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
      return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
    } else {
      return this.localeData().invalidDate();
    }
  }
  function toNow(withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
  }
  function locale(key) {
    var newLocaleData;
    if (key === void 0) {
      return this._locale._abbr;
    } else {
      newLocaleData = getLocale(key);
      if (newLocaleData != null) {
        this._locale = newLocaleData;
      }
      return this;
    }
  }
  var lang = deprecate(
    "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
    function(key) {
      if (key === void 0) {
        return this.localeData();
      } else {
        return this.locale(key);
      }
    }
  );
  function localeData() {
    return this._locale;
  }
  var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
  function mod$1(dividend, divisor) {
    return (dividend % divisor + divisor) % divisor;
  }
  function localStartOfDate(y, m2, d2) {
    if (y < 100 && y >= 0) {
      return new Date(y + 400, m2, d2) - MS_PER_400_YEARS;
    } else {
      return new Date(y, m2, d2).valueOf();
    }
  }
  function utcStartOfDate(y, m2, d2) {
    if (y < 100 && y >= 0) {
      return Date.UTC(y + 400, m2, d2) - MS_PER_400_YEARS;
    } else {
      return Date.UTC(y, m2, d2);
    }
  }
  function startOf(units) {
    var time, startOfDate;
    units = normalizeUnits(units);
    if (units === void 0 || units === "millisecond" || !this.isValid()) {
      return this;
    }
    startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
    switch (units) {
      case "year":
        time = startOfDate(this.year(), 0, 1);
        break;
      case "quarter":
        time = startOfDate(
          this.year(),
          this.month() - this.month() % 3,
          1
        );
        break;
      case "month":
        time = startOfDate(this.year(), this.month(), 1);
        break;
      case "week":
        time = startOfDate(
          this.year(),
          this.month(),
          this.date() - this.weekday()
        );
        break;
      case "isoWeek":
        time = startOfDate(
          this.year(),
          this.month(),
          this.date() - (this.isoWeekday() - 1)
        );
        break;
      case "day":
      case "date":
        time = startOfDate(this.year(), this.month(), this.date());
        break;
      case "hour":
        time = this._d.valueOf();
        time -= mod$1(
          time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
          MS_PER_HOUR
        );
        break;
      case "minute":
        time = this._d.valueOf();
        time -= mod$1(time, MS_PER_MINUTE);
        break;
      case "second":
        time = this._d.valueOf();
        time -= mod$1(time, MS_PER_SECOND);
        break;
    }
    this._d.setTime(time);
    hooks.updateOffset(this, true);
    return this;
  }
  function endOf(units) {
    var time, startOfDate;
    units = normalizeUnits(units);
    if (units === void 0 || units === "millisecond" || !this.isValid()) {
      return this;
    }
    startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
    switch (units) {
      case "year":
        time = startOfDate(this.year() + 1, 0, 1) - 1;
        break;
      case "quarter":
        time = startOfDate(
          this.year(),
          this.month() - this.month() % 3 + 3,
          1
        ) - 1;
        break;
      case "month":
        time = startOfDate(this.year(), this.month() + 1, 1) - 1;
        break;
      case "week":
        time = startOfDate(
          this.year(),
          this.month(),
          this.date() - this.weekday() + 7
        ) - 1;
        break;
      case "isoWeek":
        time = startOfDate(
          this.year(),
          this.month(),
          this.date() - (this.isoWeekday() - 1) + 7
        ) - 1;
        break;
      case "day":
      case "date":
        time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
        break;
      case "hour":
        time = this._d.valueOf();
        time += MS_PER_HOUR - mod$1(
          time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
          MS_PER_HOUR
        ) - 1;
        break;
      case "minute":
        time = this._d.valueOf();
        time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
        break;
      case "second":
        time = this._d.valueOf();
        time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
        break;
    }
    this._d.setTime(time);
    hooks.updateOffset(this, true);
    return this;
  }
  function valueOf() {
    return this._d.valueOf() - (this._offset || 0) * 6e4;
  }
  function unix() {
    return Math.floor(this.valueOf() / 1e3);
  }
  function toDate() {
    return new Date(this.valueOf());
  }
  function toArray() {
    var m2 = this;
    return [
      m2.year(),
      m2.month(),
      m2.date(),
      m2.hour(),
      m2.minute(),
      m2.second(),
      m2.millisecond()
    ];
  }
  function toObject() {
    var m2 = this;
    return {
      years: m2.year(),
      months: m2.month(),
      date: m2.date(),
      hours: m2.hours(),
      minutes: m2.minutes(),
      seconds: m2.seconds(),
      milliseconds: m2.milliseconds()
    };
  }
  function toJSON() {
    return this.isValid() ? this.toISOString() : null;
  }
  function isValid$2() {
    return isValid(this);
  }
  function parsingFlags() {
    return extend({}, getParsingFlags(this));
  }
  function invalidAt() {
    return getParsingFlags(this).overflow;
  }
  function creationData() {
    return {
      input: this._i,
      format: this._f,
      locale: this._locale,
      isUTC: this._isUTC,
      strict: this._strict
    };
  }
  addFormatToken("N", 0, 0, "eraAbbr");
  addFormatToken("NN", 0, 0, "eraAbbr");
  addFormatToken("NNN", 0, 0, "eraAbbr");
  addFormatToken("NNNN", 0, 0, "eraName");
  addFormatToken("NNNNN", 0, 0, "eraNarrow");
  addFormatToken("y", ["y", 1], "yo", "eraYear");
  addFormatToken("y", ["yy", 2], 0, "eraYear");
  addFormatToken("y", ["yyy", 3], 0, "eraYear");
  addFormatToken("y", ["yyyy", 4], 0, "eraYear");
  addRegexToken("N", matchEraAbbr);
  addRegexToken("NN", matchEraAbbr);
  addRegexToken("NNN", matchEraAbbr);
  addRegexToken("NNNN", matchEraName);
  addRegexToken("NNNNN", matchEraNarrow);
  addParseToken(
    ["N", "NN", "NNN", "NNNN", "NNNNN"],
    function(input, array, config, token2) {
      var era = config._locale.erasParse(input, token2, config._strict);
      if (era) {
        getParsingFlags(config).era = era;
      } else {
        getParsingFlags(config).invalidEra = input;
      }
    }
  );
  addRegexToken("y", matchUnsigned);
  addRegexToken("yy", matchUnsigned);
  addRegexToken("yyy", matchUnsigned);
  addRegexToken("yyyy", matchUnsigned);
  addRegexToken("yo", matchEraYearOrdinal);
  addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
  addParseToken(["yo"], function(input, array, config, token2) {
    var match;
    if (config._locale._eraYearOrdinalRegex) {
      match = input.match(config._locale._eraYearOrdinalRegex);
    }
    if (config._locale.eraYearOrdinalParse) {
      array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
    } else {
      array[YEAR] = parseInt(input, 10);
    }
  });
  function localeEras(m2, format2) {
    var i2, l2, date, eras = this._eras || getLocale("en")._eras;
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      switch (typeof eras[i2].since) {
        case "string":
          date = hooks(eras[i2].since).startOf("day");
          eras[i2].since = date.valueOf();
          break;
      }
      switch (typeof eras[i2].until) {
        case "undefined":
          eras[i2].until = Infinity;
          break;
        case "string":
          date = hooks(eras[i2].until).startOf("day").valueOf();
          eras[i2].until = date.valueOf();
          break;
      }
    }
    return eras;
  }
  function localeErasParse(eraName, format2, strict) {
    var i2, l2, eras = this.eras(), name, abbr, narrow;
    eraName = eraName.toUpperCase();
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      name = eras[i2].name.toUpperCase();
      abbr = eras[i2].abbr.toUpperCase();
      narrow = eras[i2].narrow.toUpperCase();
      if (strict) {
        switch (format2) {
          case "N":
          case "NN":
          case "NNN":
            if (abbr === eraName) {
              return eras[i2];
            }
            break;
          case "NNNN":
            if (name === eraName) {
              return eras[i2];
            }
            break;
          case "NNNNN":
            if (narrow === eraName) {
              return eras[i2];
            }
            break;
        }
      } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
        return eras[i2];
      }
    }
  }
  function localeErasConvertYear(era, year) {
    var dir = era.since <= era.until ? 1 : -1;
    if (year === void 0) {
      return hooks(era.since).year();
    } else {
      return hooks(era.since).year() + (year - era.offset) * dir;
    }
  }
  function getEraName() {
    var i2, l2, val, eras = this.localeData().eras();
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      val = this.clone().startOf("day").valueOf();
      if (eras[i2].since <= val && val <= eras[i2].until) {
        return eras[i2].name;
      }
      if (eras[i2].until <= val && val <= eras[i2].since) {
        return eras[i2].name;
      }
    }
    return "";
  }
  function getEraNarrow() {
    var i2, l2, val, eras = this.localeData().eras();
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      val = this.clone().startOf("day").valueOf();
      if (eras[i2].since <= val && val <= eras[i2].until) {
        return eras[i2].narrow;
      }
      if (eras[i2].until <= val && val <= eras[i2].since) {
        return eras[i2].narrow;
      }
    }
    return "";
  }
  function getEraAbbr() {
    var i2, l2, val, eras = this.localeData().eras();
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      val = this.clone().startOf("day").valueOf();
      if (eras[i2].since <= val && val <= eras[i2].until) {
        return eras[i2].abbr;
      }
      if (eras[i2].until <= val && val <= eras[i2].since) {
        return eras[i2].abbr;
      }
    }
    return "";
  }
  function getEraYear() {
    var i2, l2, dir, val, eras = this.localeData().eras();
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      dir = eras[i2].since <= eras[i2].until ? 1 : -1;
      val = this.clone().startOf("day").valueOf();
      if (eras[i2].since <= val && val <= eras[i2].until || eras[i2].until <= val && val <= eras[i2].since) {
        return (this.year() - hooks(eras[i2].since).year()) * dir + eras[i2].offset;
      }
    }
    return this.year();
  }
  function erasNameRegex(isStrict) {
    if (!hasOwnProp(this, "_erasNameRegex")) {
      computeErasParse.call(this);
    }
    return isStrict ? this._erasNameRegex : this._erasRegex;
  }
  function erasAbbrRegex(isStrict) {
    if (!hasOwnProp(this, "_erasAbbrRegex")) {
      computeErasParse.call(this);
    }
    return isStrict ? this._erasAbbrRegex : this._erasRegex;
  }
  function erasNarrowRegex(isStrict) {
    if (!hasOwnProp(this, "_erasNarrowRegex")) {
      computeErasParse.call(this);
    }
    return isStrict ? this._erasNarrowRegex : this._erasRegex;
  }
  function matchEraAbbr(isStrict, locale2) {
    return locale2.erasAbbrRegex(isStrict);
  }
  function matchEraName(isStrict, locale2) {
    return locale2.erasNameRegex(isStrict);
  }
  function matchEraNarrow(isStrict, locale2) {
    return locale2.erasNarrowRegex(isStrict);
  }
  function matchEraYearOrdinal(isStrict, locale2) {
    return locale2._eraYearOrdinalRegex || matchUnsigned;
  }
  function computeErasParse() {
    var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i2, l2, eras = this.eras();
    for (i2 = 0, l2 = eras.length; i2 < l2; ++i2) {
      namePieces.push(regexEscape(eras[i2].name));
      abbrPieces.push(regexEscape(eras[i2].abbr));
      narrowPieces.push(regexEscape(eras[i2].narrow));
      mixedPieces.push(regexEscape(eras[i2].name));
      mixedPieces.push(regexEscape(eras[i2].abbr));
      mixedPieces.push(regexEscape(eras[i2].narrow));
    }
    this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
    this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
    this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
    this._erasNarrowRegex = new RegExp(
      "^(" + narrowPieces.join("|") + ")",
      "i"
    );
  }
  addFormatToken(0, ["gg", 2], 0, function() {
    return this.weekYear() % 100;
  });
  addFormatToken(0, ["GG", 2], 0, function() {
    return this.isoWeekYear() % 100;
  });
  function addWeekYearFormatToken(token2, getter) {
    addFormatToken(0, [token2, token2.length], 0, getter);
  }
  addWeekYearFormatToken("gggg", "weekYear");
  addWeekYearFormatToken("ggggg", "weekYear");
  addWeekYearFormatToken("GGGG", "isoWeekYear");
  addWeekYearFormatToken("GGGGG", "isoWeekYear");
  addUnitAlias("weekYear", "gg");
  addUnitAlias("isoWeekYear", "GG");
  addUnitPriority("weekYear", 1);
  addUnitPriority("isoWeekYear", 1);
  addRegexToken("G", matchSigned);
  addRegexToken("g", matchSigned);
  addRegexToken("GG", match1to2, match2);
  addRegexToken("gg", match1to2, match2);
  addRegexToken("GGGG", match1to4, match4);
  addRegexToken("gggg", match1to4, match4);
  addRegexToken("GGGGG", match1to6, match6);
  addRegexToken("ggggg", match1to6, match6);
  addWeekParseToken(
    ["gggg", "ggggg", "GGGG", "GGGGG"],
    function(input, week, config, token2) {
      week[token2.substr(0, 2)] = toInt(input);
    }
  );
  addWeekParseToken(["gg", "GG"], function(input, week, config, token2) {
    week[token2] = hooks.parseTwoDigitYear(input);
  });
  function getSetWeekYear(input) {
    return getSetWeekYearHelper.call(
      this,
      input,
      this.week(),
      this.weekday(),
      this.localeData()._week.dow,
      this.localeData()._week.doy
    );
  }
  function getSetISOWeekYear(input) {
    return getSetWeekYearHelper.call(
      this,
      input,
      this.isoWeek(),
      this.isoWeekday(),
      1,
      4
    );
  }
  function getISOWeeksInYear() {
    return weeksInYear(this.year(), 1, 4);
  }
  function getISOWeeksInISOWeekYear() {
    return weeksInYear(this.isoWeekYear(), 1, 4);
  }
  function getWeeksInYear() {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
  }
  function getWeeksInWeekYear() {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
  }
  function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
      return weekOfYear(this, dow, doy).year;
    } else {
      weeksTarget = weeksInYear(input, dow, doy);
      if (week > weeksTarget) {
        week = weeksTarget;
      }
      return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
  }
  function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
  }
  addFormatToken("Q", 0, "Qo", "quarter");
  addUnitAlias("quarter", "Q");
  addUnitPriority("quarter", 7);
  addRegexToken("Q", match1);
  addParseToken("Q", function(input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
  });
  function getSetQuarter(input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
  }
  addFormatToken("D", ["DD", 2], "Do", "date");
  addUnitAlias("date", "D");
  addUnitPriority("date", 9);
  addRegexToken("D", match1to2);
  addRegexToken("DD", match1to2, match2);
  addRegexToken("Do", function(isStrict, locale2) {
    return isStrict ? locale2._dayOfMonthOrdinalParse || locale2._ordinalParse : locale2._dayOfMonthOrdinalParseLenient;
  });
  addParseToken(["D", "DD"], DATE);
  addParseToken("Do", function(input, array) {
    array[DATE] = toInt(input.match(match1to2)[0]);
  });
  var getSetDayOfMonth = makeGetSet("Date", true);
  addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
  addUnitAlias("dayOfYear", "DDD");
  addUnitPriority("dayOfYear", 4);
  addRegexToken("DDD", match1to3);
  addRegexToken("DDDD", match3);
  addParseToken(["DDD", "DDDD"], function(input, array, config) {
    config._dayOfYear = toInt(input);
  });
  function getSetDayOfYear(input) {
    var dayOfYear = Math.round(
      (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
    ) + 1;
    return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
  }
  addFormatToken("m", ["mm", 2], 0, "minute");
  addUnitAlias("minute", "m");
  addUnitPriority("minute", 14);
  addRegexToken("m", match1to2);
  addRegexToken("mm", match1to2, match2);
  addParseToken(["m", "mm"], MINUTE);
  var getSetMinute = makeGetSet("Minutes", false);
  addFormatToken("s", ["ss", 2], 0, "second");
  addUnitAlias("second", "s");
  addUnitPriority("second", 15);
  addRegexToken("s", match1to2);
  addRegexToken("ss", match1to2, match2);
  addParseToken(["s", "ss"], SECOND);
  var getSetSecond = makeGetSet("Seconds", false);
  addFormatToken("S", 0, 0, function() {
    return ~~(this.millisecond() / 100);
  });
  addFormatToken(0, ["SS", 2], 0, function() {
    return ~~(this.millisecond() / 10);
  });
  addFormatToken(0, ["SSS", 3], 0, "millisecond");
  addFormatToken(0, ["SSSS", 4], 0, function() {
    return this.millisecond() * 10;
  });
  addFormatToken(0, ["SSSSS", 5], 0, function() {
    return this.millisecond() * 100;
  });
  addFormatToken(0, ["SSSSSS", 6], 0, function() {
    return this.millisecond() * 1e3;
  });
  addFormatToken(0, ["SSSSSSS", 7], 0, function() {
    return this.millisecond() * 1e4;
  });
  addFormatToken(0, ["SSSSSSSS", 8], 0, function() {
    return this.millisecond() * 1e5;
  });
  addFormatToken(0, ["SSSSSSSSS", 9], 0, function() {
    return this.millisecond() * 1e6;
  });
  addUnitAlias("millisecond", "ms");
  addUnitPriority("millisecond", 16);
  addRegexToken("S", match1to3, match1);
  addRegexToken("SS", match1to3, match2);
  addRegexToken("SSS", match1to3, match3);
  var token, getSetMillisecond;
  for (token = "SSSS"; token.length <= 9; token += "S") {
    addRegexToken(token, matchUnsigned);
  }
  function parseMs(input, array) {
    array[MILLISECOND] = toInt(("0." + input) * 1e3);
  }
  for (token = "S"; token.length <= 9; token += "S") {
    addParseToken(token, parseMs);
  }
  getSetMillisecond = makeGetSet("Milliseconds", false);
  addFormatToken("z", 0, 0, "zoneAbbr");
  addFormatToken("zz", 0, 0, "zoneName");
  function getZoneAbbr() {
    return this._isUTC ? "UTC" : "";
  }
  function getZoneName() {
    return this._isUTC ? "Coordinated Universal Time" : "";
  }
  var proto = Moment.prototype;
  proto.add = add;
  proto.calendar = calendar$1$1;
  proto.clone = clone;
  proto.diff = diff;
  proto.endOf = endOf;
  proto.format = format;
  proto.from = from;
  proto.fromNow = fromNow;
  proto.to = to;
  proto.toNow = toNow;
  proto.get = stringGet;
  proto.invalidAt = invalidAt;
  proto.isAfter = isAfter;
  proto.isBefore = isBefore;
  proto.isBetween = isBetween;
  proto.isSame = isSame;
  proto.isSameOrAfter = isSameOrAfter;
  proto.isSameOrBefore = isSameOrBefore;
  proto.isValid = isValid$2;
  proto.lang = lang;
  proto.locale = locale;
  proto.localeData = localeData;
  proto.max = prototypeMax;
  proto.min = prototypeMin;
  proto.parsingFlags = parsingFlags;
  proto.set = stringSet;
  proto.startOf = startOf;
  proto.subtract = subtract;
  proto.toArray = toArray;
  proto.toObject = toObject;
  proto.toDate = toDate;
  proto.toISOString = toISOString;
  proto.inspect = inspect;
  if (typeof Symbol !== "undefined" && Symbol.for != null) {
    proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
      return "Moment<" + this.format() + ">";
    };
  }
  proto.toJSON = toJSON;
  proto.toString = toString;
  proto.unix = unix;
  proto.valueOf = valueOf;
  proto.creationData = creationData;
  proto.eraName = getEraName;
  proto.eraNarrow = getEraNarrow;
  proto.eraAbbr = getEraAbbr;
  proto.eraYear = getEraYear;
  proto.year = getSetYear;
  proto.isLeapYear = getIsLeapYear;
  proto.weekYear = getSetWeekYear;
  proto.isoWeekYear = getSetISOWeekYear;
  proto.quarter = proto.quarters = getSetQuarter;
  proto.month = getSetMonth;
  proto.daysInMonth = getDaysInMonth;
  proto.week = proto.weeks = getSetWeek;
  proto.isoWeek = proto.isoWeeks = getSetISOWeek;
  proto.weeksInYear = getWeeksInYear;
  proto.weeksInWeekYear = getWeeksInWeekYear;
  proto.isoWeeksInYear = getISOWeeksInYear;
  proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
  proto.date = getSetDayOfMonth;
  proto.day = proto.days = getSetDayOfWeek;
  proto.weekday = getSetLocaleDayOfWeek;
  proto.isoWeekday = getSetISODayOfWeek;
  proto.dayOfYear = getSetDayOfYear;
  proto.hour = proto.hours = getSetHour;
  proto.minute = proto.minutes = getSetMinute;
  proto.second = proto.seconds = getSetSecond;
  proto.millisecond = proto.milliseconds = getSetMillisecond;
  proto.utcOffset = getSetOffset;
  proto.utc = setOffsetToUTC;
  proto.local = setOffsetToLocal;
  proto.parseZone = setOffsetToParsedOffset;
  proto.hasAlignedHourOffset = hasAlignedHourOffset;
  proto.isDST = isDaylightSavingTime;
  proto.isLocal = isLocal;
  proto.isUtcOffset = isUtcOffset;
  proto.isUtc = isUtc;
  proto.isUTC = isUtc;
  proto.zoneAbbr = getZoneAbbr;
  proto.zoneName = getZoneName;
  proto.dates = deprecate(
    "dates accessor is deprecated. Use date instead.",
    getSetDayOfMonth
  );
  proto.months = deprecate(
    "months accessor is deprecated. Use month instead",
    getSetMonth
  );
  proto.years = deprecate(
    "years accessor is deprecated. Use year instead",
    getSetYear
  );
  proto.zone = deprecate(
    "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
    getSetZone
  );
  proto.isDSTShifted = deprecate(
    "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
    isDaylightSavingTimeShifted
  );
  function createUnix(input) {
    return createLocal(input * 1e3);
  }
  function createInZone() {
    return createLocal.apply(null, arguments).parseZone();
  }
  function preParsePostFormat(string) {
    return string;
  }
  var proto$1 = Locale.prototype;
  proto$1.calendar = calendar$1;
  proto$1.longDateFormat = longDateFormat;
  proto$1.invalidDate = invalidDate;
  proto$1.ordinal = ordinal;
  proto$1.preparse = preParsePostFormat;
  proto$1.postformat = preParsePostFormat;
  proto$1.relativeTime = relativeTime;
  proto$1.pastFuture = pastFuture;
  proto$1.set = set;
  proto$1.eras = localeEras;
  proto$1.erasParse = localeErasParse;
  proto$1.erasConvertYear = localeErasConvertYear;
  proto$1.erasAbbrRegex = erasAbbrRegex;
  proto$1.erasNameRegex = erasNameRegex;
  proto$1.erasNarrowRegex = erasNarrowRegex;
  proto$1.months = localeMonths;
  proto$1.monthsShort = localeMonthsShort;
  proto$1.monthsParse = localeMonthsParse;
  proto$1.monthsRegex = monthsRegex;
  proto$1.monthsShortRegex = monthsShortRegex;
  proto$1.week = localeWeek;
  proto$1.firstDayOfYear = localeFirstDayOfYear;
  proto$1.firstDayOfWeek = localeFirstDayOfWeek;
  proto$1.weekdays = localeWeekdays;
  proto$1.weekdaysMin = localeWeekdaysMin;
  proto$1.weekdaysShort = localeWeekdaysShort;
  proto$1.weekdaysParse = localeWeekdaysParse;
  proto$1.weekdaysRegex = weekdaysRegex;
  proto$1.weekdaysShortRegex = weekdaysShortRegex;
  proto$1.weekdaysMinRegex = weekdaysMinRegex;
  proto$1.isPM = localeIsPM;
  proto$1.meridiem = localeMeridiem;
  function get$1(format2, index, field, setter) {
    var locale2 = getLocale(), utc2 = createUTC().set(setter, index);
    return locale2[field](utc2, format2);
  }
  function listMonthsImpl(format2, index, field) {
    if (isNumber(format2)) {
      index = format2;
      format2 = void 0;
    }
    format2 = format2 || "";
    if (index != null) {
      return get$1(format2, index, field, "month");
    }
    var i2, out = [];
    for (i2 = 0; i2 < 12; i2++) {
      out[i2] = get$1(format2, i2, field, "month");
    }
    return out;
  }
  function listWeekdaysImpl(localeSorted, format2, index, field) {
    if (typeof localeSorted === "boolean") {
      if (isNumber(format2)) {
        index = format2;
        format2 = void 0;
      }
      format2 = format2 || "";
    } else {
      format2 = localeSorted;
      index = format2;
      localeSorted = false;
      if (isNumber(format2)) {
        index = format2;
        format2 = void 0;
      }
      format2 = format2 || "";
    }
    var locale2 = getLocale(), shift = localeSorted ? locale2._week.dow : 0, i2, out = [];
    if (index != null) {
      return get$1(format2, (index + shift) % 7, field, "day");
    }
    for (i2 = 0; i2 < 7; i2++) {
      out[i2] = get$1(format2, (i2 + shift) % 7, field, "day");
    }
    return out;
  }
  function listMonths(format2, index) {
    return listMonthsImpl(format2, index, "months");
  }
  function listMonthsShort(format2, index) {
    return listMonthsImpl(format2, index, "monthsShort");
  }
  function listWeekdays(localeSorted, format2, index) {
    return listWeekdaysImpl(localeSorted, format2, index, "weekdays");
  }
  function listWeekdaysShort(localeSorted, format2, index) {
    return listWeekdaysImpl(localeSorted, format2, index, "weekdaysShort");
  }
  function listWeekdaysMin(localeSorted, format2, index) {
    return listWeekdaysImpl(localeSorted, format2, index, "weekdaysMin");
  }
  getSetGlobalLocale("en", {
    eras: [
      {
        since: "0001-01-01",
        until: Infinity,
        offset: 1,
        name: "Anno Domini",
        narrow: "AD",
        abbr: "AD"
      },
      {
        since: "0000-12-31",
        until: -Infinity,
        offset: 1,
        name: "Before Christ",
        narrow: "BC",
        abbr: "BC"
      }
    ],
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function(number) {
      var b2 = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b2 === 1 ? "st" : b2 === 2 ? "nd" : b2 === 3 ? "rd" : "th";
      return number + output;
    }
  });
  hooks.lang = deprecate(
    "moment.lang is deprecated. Use moment.locale instead.",
    getSetGlobalLocale
  );
  hooks.langData = deprecate(
    "moment.langData is deprecated. Use moment.localeData instead.",
    getLocale
  );
  var mathAbs = Math.abs;
  function abs() {
    var data = this._data;
    this._milliseconds = mathAbs(this._milliseconds);
    this._days = mathAbs(this._days);
    this._months = mathAbs(this._months);
    data.milliseconds = mathAbs(data.milliseconds);
    data.seconds = mathAbs(data.seconds);
    data.minutes = mathAbs(data.minutes);
    data.hours = mathAbs(data.hours);
    data.months = mathAbs(data.months);
    data.years = mathAbs(data.years);
    return this;
  }
  function addSubtract$1(duration, input, value, direction) {
    var other = createDuration(input, value);
    duration._milliseconds += direction * other._milliseconds;
    duration._days += direction * other._days;
    duration._months += direction * other._months;
    return duration._bubble();
  }
  function add$1(input, value) {
    return addSubtract$1(this, input, value, 1);
  }
  function subtract$1(input, value) {
    return addSubtract$1(this, input, value, -1);
  }
  function absCeil(number) {
    if (number < 0) {
      return Math.floor(number);
    } else {
      return Math.ceil(number);
    }
  }
  function bubble() {
    var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
    if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
      milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
      days2 = 0;
      months2 = 0;
    }
    data.milliseconds = milliseconds2 % 1e3;
    seconds2 = absFloor(milliseconds2 / 1e3);
    data.seconds = seconds2 % 60;
    minutes2 = absFloor(seconds2 / 60);
    data.minutes = minutes2 % 60;
    hours2 = absFloor(minutes2 / 60);
    data.hours = hours2 % 24;
    days2 += absFloor(hours2 / 24);
    monthsFromDays = absFloor(daysToMonths(days2));
    months2 += monthsFromDays;
    days2 -= absCeil(monthsToDays(monthsFromDays));
    years2 = absFloor(months2 / 12);
    months2 %= 12;
    data.days = days2;
    data.months = months2;
    data.years = years2;
    return this;
  }
  function daysToMonths(days2) {
    return days2 * 4800 / 146097;
  }
  function monthsToDays(months2) {
    return months2 * 146097 / 4800;
  }
  function as(units) {
    if (!this.isValid()) {
      return NaN;
    }
    var days2, months2, milliseconds2 = this._milliseconds;
    units = normalizeUnits(units);
    if (units === "month" || units === "quarter" || units === "year") {
      days2 = this._days + milliseconds2 / 864e5;
      months2 = this._months + daysToMonths(days2);
      switch (units) {
        case "month":
          return months2;
        case "quarter":
          return months2 / 3;
        case "year":
          return months2 / 12;
      }
    } else {
      days2 = this._days + Math.round(monthsToDays(this._months));
      switch (units) {
        case "week":
          return days2 / 7 + milliseconds2 / 6048e5;
        case "day":
          return days2 + milliseconds2 / 864e5;
        case "hour":
          return days2 * 24 + milliseconds2 / 36e5;
        case "minute":
          return days2 * 1440 + milliseconds2 / 6e4;
        case "second":
          return days2 * 86400 + milliseconds2 / 1e3;
        case "millisecond":
          return Math.floor(days2 * 864e5) + milliseconds2;
        default:
          throw new Error("Unknown unit " + units);
      }
    }
  }
  function valueOf$1() {
    if (!this.isValid()) {
      return NaN;
    }
    return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
  }
  function makeAs(alias) {
    return function() {
      return this.as(alias);
    };
  }
  var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y");
  function clone$1() {
    return createDuration(this);
  }
  function get$2(units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + "s"]() : NaN;
  }
  function makeGetter(name) {
    return function() {
      return this.isValid() ? this._data[name] : NaN;
    };
  }
  var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
  function weeks() {
    return absFloor(this.days() / 7);
  }
  var round = Math.round, thresholds = {
    ss: 44,
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    w: null,
    M: 11
  };
  function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale2) {
    return locale2.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
  }
  function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale2) {
    var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a2 = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
    if (thresholds2.w != null) {
      a2 = a2 || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
    }
    a2 = a2 || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
    a2[2] = withoutSuffix;
    a2[3] = +posNegDuration > 0;
    a2[4] = locale2;
    return substituteTimeAgo.apply(null, a2);
  }
  function getSetRelativeTimeRounding(roundingFunction) {
    if (roundingFunction === void 0) {
      return round;
    }
    if (typeof roundingFunction === "function") {
      round = roundingFunction;
      return true;
    }
    return false;
  }
  function getSetRelativeTimeThreshold(threshold, limit) {
    if (thresholds[threshold] === void 0) {
      return false;
    }
    if (limit === void 0) {
      return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === "s") {
      thresholds.ss = limit - 1;
    }
    return true;
  }
  function humanize(argWithSuffix, argThresholds) {
    if (!this.isValid()) {
      return this.localeData().invalidDate();
    }
    var withSuffix = false, th = thresholds, locale2, output;
    if (typeof argWithSuffix === "object") {
      argThresholds = argWithSuffix;
      argWithSuffix = false;
    }
    if (typeof argWithSuffix === "boolean") {
      withSuffix = argWithSuffix;
    }
    if (typeof argThresholds === "object") {
      th = Object.assign({}, thresholds, argThresholds);
      if (argThresholds.s != null && argThresholds.ss == null) {
        th.ss = argThresholds.s - 1;
      }
    }
    locale2 = this.localeData();
    output = relativeTime$1(this, !withSuffix, th, locale2);
    if (withSuffix) {
      output = locale2.pastFuture(+this, output);
    }
    return locale2.postformat(output);
  }
  var abs$1 = Math.abs;
  function sign(x2) {
    return (x2 > 0) - (x2 < 0) || +x2;
  }
  function toISOString$1() {
    if (!this.isValid()) {
      return this.localeData().invalidDate();
    }
    var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s2, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
    if (!total) {
      return "P0D";
    }
    minutes2 = absFloor(seconds2 / 60);
    hours2 = absFloor(minutes2 / 60);
    seconds2 %= 60;
    minutes2 %= 60;
    years2 = absFloor(months2 / 12);
    months2 %= 12;
    s2 = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
    totalSign = total < 0 ? "-" : "";
    ymSign = sign(this._months) !== sign(total) ? "-" : "";
    daysSign = sign(this._days) !== sign(total) ? "-" : "";
    hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
    return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s2 + "S" : "");
  }
  var proto$2 = Duration.prototype;
  proto$2.isValid = isValid$1;
  proto$2.abs = abs;
  proto$2.add = add$1;
  proto$2.subtract = subtract$1;
  proto$2.as = as;
  proto$2.asMilliseconds = asMilliseconds;
  proto$2.asSeconds = asSeconds;
  proto$2.asMinutes = asMinutes;
  proto$2.asHours = asHours;
  proto$2.asDays = asDays;
  proto$2.asWeeks = asWeeks;
  proto$2.asMonths = asMonths;
  proto$2.asQuarters = asQuarters;
  proto$2.asYears = asYears;
  proto$2.valueOf = valueOf$1;
  proto$2._bubble = bubble;
  proto$2.clone = clone$1;
  proto$2.get = get$2;
  proto$2.milliseconds = milliseconds;
  proto$2.seconds = seconds;
  proto$2.minutes = minutes;
  proto$2.hours = hours;
  proto$2.days = days;
  proto$2.weeks = weeks;
  proto$2.months = months;
  proto$2.years = years;
  proto$2.humanize = humanize;
  proto$2.toISOString = toISOString$1;
  proto$2.toString = toISOString$1;
  proto$2.toJSON = toISOString$1;
  proto$2.locale = locale;
  proto$2.localeData = localeData;
  proto$2.toIsoString = deprecate(
    "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
    toISOString$1
  );
  proto$2.lang = lang;
  addFormatToken("X", 0, 0, "unix");
  addFormatToken("x", 0, 0, "valueOf");
  addRegexToken("x", matchSigned);
  addRegexToken("X", matchTimestamp);
  addParseToken("X", function(input, array, config) {
    config._d = new Date(parseFloat(input) * 1e3);
  });
  addParseToken("x", function(input, array, config) {
    config._d = new Date(toInt(input));
  });
  //! moment.js
  hooks.version = "2.29.4";
  setHookCallback(createLocal);
  hooks.fn = proto;
  hooks.min = min;
  hooks.max = max;
  hooks.now = now;
  hooks.utc = createUTC;
  hooks.unix = createUnix;
  hooks.months = listMonths;
  hooks.isDate = isDate;
  hooks.locale = getSetGlobalLocale;
  hooks.invalid = createInvalid;
  hooks.duration = createDuration;
  hooks.isMoment = isMoment;
  hooks.weekdays = listWeekdays;
  hooks.parseZone = createInZone;
  hooks.localeData = getLocale;
  hooks.isDuration = isDuration;
  hooks.monthsShort = listMonthsShort;
  hooks.weekdaysMin = listWeekdaysMin;
  hooks.defineLocale = defineLocale;
  hooks.updateLocale = updateLocale;
  hooks.locales = listLocales;
  hooks.weekdaysShort = listWeekdaysShort;
  hooks.normalizeUnits = normalizeUnits;
  hooks.relativeTimeRounding = getSetRelativeTimeRounding;
  hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
  hooks.calendarFormat = getCalendarFormat;
  hooks.prototype = proto;
  hooks.HTML5_FMT = {
    DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
    DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
    DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
    DATE: "YYYY-MM-DD",
    TIME: "HH:mm",
    TIME_SECONDS: "HH:mm:ss",
    TIME_MS: "HH:mm:ss.SSS",
    WEEK: "GGGG-[W]WW",
    MONTH: "YYYY-MM"
  };
  const _sfc_main$b = {
    name: "calendar",
    props: {
      value: {
        required: true,
        type: [Number, String, Date],
        default: () => {
          return new Date();
        }
      },
      format: {
        type: [String],
        default: "YYYY\u5E74MM\u6708DD\u65E5"
      },
      mode: {
        type: String,
        default: "single"
      }
    },
    data() {
      return {
        dataList: [],
        weekList: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"],
        touchStartX: 0,
        touchStartY: 0,
        transitionClass: ""
      };
    },
    onShow() {
      this.transitionClass = "";
    },
    methods: {
      render() {
        const prevDaysInMonth = hooks(new Date(this.value)).subtract(1, "months").daysInMonth();
        const firstDayWeekday = hooks(new Date(this.value)).date(1).weekday();
        let weekDayNum = firstDayWeekday;
        if (firstDayWeekday === 1) {
          weekDayNum = 6;
        }
        if (firstDayWeekday === 0) {
          weekDayNum = 7;
        }
        const daysInMonth2 = hooks(new Date(this.value)).daysInMonth();
        const list = [];
        for (let i3 = prevDaysInMonth; i3 > prevDaysInMonth - weekDayNum + 1; i3--) {
          const day = hooks(new Date(this.value)).subtract(1, "months").date(i3).format("YYYY-MM-DD");
          const week = hooks(new Date(this.value)).subtract(1, "months").date(i3).format("dddd");
          list.unshift({ key: i3, type: "prev", isSelected: false, day, week });
        }
        for (let i3 = 1; i3 < daysInMonth2 + 1; i3++) {
          const day = hooks(new Date(this.value)).date(i3).format("YYYY-MM-DD");
          const week = hooks(new Date(this.value)).date(i3).format("dddd");
          list.push({ key: i3, type: "current", isSelected: false, day, week });
        }
        const nextDays = 42 - list.length;
        for (var i2 = 1; i2 < nextDays + 1; i2++) {
          const day = hooks(new Date(this.value)).add(1, "months").date(i2).format("YYYY-MM-DD");
          const week = hooks(new Date(this.value)).add(1, "months").date(i2).format("dddd");
          list.push({ key: i2, type: "next", isSelected: false, day, week });
        }
        this.dataList = list;
      },
      prevMonth() {
        const date = hooks(new Date(this.value)).subtract(1, "months").toDate();
        this.$emit("update:value", date);
      },
      nextMonth() {
        const date = hooks(new Date(this.value)).add(1, "months").toDate();
        this.$emit("update:value", date);
      },
      currentMonth() {
        this.$emit("update:value", new Date());
      },
      select(list) {
        if (list.typeof !== "object") {
          const index = this.dataList.findIndex((item) => item.day === this.formatDate(list));
          if (index > -1) {
            this.dataList[index].isSelected = true;
          }
          return false;
        } else {
          list.forEach((child) => {
            const index = this.dataList.findIndex((item) => item.day === this.formatDate(child));
            if (index > -1) {
              this.dataList[index].isSelected = true;
            }
          });
          return false;
        }
      },
      selectHandle(item) {
        if (item.type === "current") {
          if (this.mode === "single") {
            this.dataList.forEach((item2) => {
              item2.isSelected = false;
            });
          }
          item.isSelected = true;
        }
        this.$emit("select", item);
      },
      getSelection() {
        return this.dataList.filter((item) => item.isSelected);
      },
      formatDate(value, format2 = "YYYY-MM-DD") {
        return hooks(new Date(value)).format(format2);
      },
      getCurrentData() {
        return this.dataList;
      },
      touchStart(e) {
        formatAppLog("log", "at components/calendar/index.vue:153", "\u89E6\u6478\u5F00\u59CB");
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      },
      touchEnd(e) {
        formatAppLog("log", "at components/calendar/index.vue:161", "\u89E6\u6478\u7ED3\u675F");
        let deltaX = e.changedTouches[0].clientX - this.touchStartX;
        let deltaY = e.changedTouches[0].clientY - this.touchStartY;
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX >= 0) {
            formatAppLog("log", "at components/calendar/index.vue:166", "\u5DE6\u6ED1");
            this.leftMove();
          } else {
            formatAppLog("log", "at components/calendar/index.vue:169", "\u53F3\u6ED1");
            this.rightMove();
          }
        } else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < Math.abs(deltaY)) {
          if (deltaY < 0) {
            formatAppLog("log", "at components/calendar/index.vue:174", "\u4E0A\u6ED1");
          } else {
            formatAppLog("log", "at components/calendar/index.vue:176", "\u4E0B\u6ED1");
          }
        } else {
          formatAppLog("log", "at components/calendar/index.vue:179", "\u53EF\u80FD\u662F\u8BEF\u89E6\uFF01");
        }
      },
      rightMove() {
        this.transitionClass = "left-start";
        const time1 = setTimeout(() => {
          this.nextMonth();
          this.transitionClass = "left-end";
          clearTimeout(time1);
        }, 300);
      },
      leftMove() {
        this.transitionClass = "right-start";
        const time1 = setTimeout(() => {
          this.prevMonth();
          this.transitionClass = "right-end";
          clearTimeout(time1);
        }, 300);
      }
    },
    watch: {
      value: {
        immediate: true,
        handler: function() {
          this.render();
        }
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "calendar" }, [
      vue.createElementVNode("view", { class: "calendar-operation" }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.renderSlot(_ctx.$slots, "operation-left", { item: $props.value }, () => [
            vue.createTextVNode(vue.toDisplayString($options.formatDate($props.value, "YYYY\u5E74MM\u6708")), 1)
          ], true)
        ]),
        vue.createElementVNode("view", { class: "right" }, [
          vue.renderSlot(_ctx.$slots, "operation-right", { item: $props.value }, () => [
            vue.createElementVNode("button", {
              class: "operation-right-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.prevMonth && $options.prevMonth(...args))
            }, "\u4E0A\u4E2A\u6708"),
            vue.createElementVNode("button", {
              class: "operation-right-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.currentMonth && $options.currentMonth(...args))
            }, "\u4ECA\u5929"),
            vue.createElementVNode("button", {
              class: "operation-right-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.nextMonth && $options.nextMonth(...args))
            }, "\u4E0B\u4E2A\u6708")
          ], true)
        ])
      ]),
      vue.createElementVNode("view", { class: "calendar-header" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.weekList, (item, i2) => {
          return vue.openBlock(), vue.createElementBlock("view", { key: i2 }, [
            vue.renderSlot(_ctx.$slots, "header", {}, () => [
              vue.createElementVNode("span", { class: "calendar-header-title" }, vue.toDisplayString(item), 1)
            ], true)
          ]);
        }), 128))
      ]),
      vue.createElementVNode("view", { class: "transition" }, [
        vue.createElementVNode("view", {
          class: vue.normalizeClass(["calendar-content", [$data.transitionClass]]),
          onTouchstart: _cache[3] || (_cache[3] = (...args) => $options.touchStart && $options.touchStart(...args)),
          onTouchend: _cache[4] || (_cache[4] = (...args) => $options.touchEnd && $options.touchEnd(...args))
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.dataList, (item, i2) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: i2,
              class: vue.normalizeClass([item.type]),
              onClick: ($event) => $options.selectHandle(item)
            }, [
              vue.renderSlot(_ctx.$slots, "default", { cell: item }, () => [
                vue.createElementVNode("view", {
                  class: vue.normalizeClass(["calendar-data-item", { "is-selected": item.isSelected }])
                }, vue.toDisplayString(item.key), 3)
              ], true)
            ], 10, ["onClick"]);
          }), 128))
        ], 34)
      ])
    ]);
  }
  const calendar = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-76b2c24f"], ["__file", "D:/studyUninApp/bodybuilding-app/components/calendar/index.vue"]]);
  const train$1 = As.importObject("train");
  const _sfc_main$a = {
    components: {
      calendar
    },
    data() {
      return {
        trainListInfo: {},
        trainDate: null,
        memberName: "",
        value: new Date()
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
        const res2 = await train$1.getTrainList({ traineeNo: this.traineeNo });
        if (res2.data && res2.data.length > 0) {
          const trainListInfo = {};
          res2.data.forEach((item) => {
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
        const list = this.$refs.calendar.getSelection();
        const item = list.find((item2) => item2.isSelected);
        if (!item)
          return;
        uni.navigateTo({
          url: `/pages/newWorkout/newWorkout?traineeNo=${this.traineeNo}&trainDate=${item.day}`
        });
      },
      sharePage(date) {
        uni.navigateTo({
          url: `/pages/trainingRecordDetail/trainingRecordDetail?traineeNo=${this.traineeNo}&trainDate=${date}`
        });
      },
      getYearMonth(val) {
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
        return year + "." + month;
      },
      getTrainTitle(day) {
        return this.trainListInfo[day] || "";
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_nav_bar = vue.resolveComponent("van-nav-bar");
    const _component_calendar = vue.resolveComponent("calendar");
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
        vue.createVNode(_component_calendar, {
          value: $data.value,
          "onUpdate:value": _cache[0] || (_cache[0] = ($event) => $data.value = $event),
          ref: "calendar"
        }, {
          "operation-left": vue.withCtx(() => [
            vue.createElementVNode("view", { class: "calendar-title" }, "\u8BAD\u7EC3\u8BB0\u5F55")
          ]),
          "operation-right": vue.withCtx(({ item }) => [
            vue.createElementVNode("view", { class: "calendar-date" }, vue.toDisplayString($options.getYearMonth(item)), 1)
          ]),
          default: vue.withCtx(({ cell }) => [
            vue.createElementVNode("view", { class: "cell-box" }, [
              vue.createElementVNode("view", {
                class: vue.normalizeClass(["cell-key", { active: cell.isSelected }])
              }, vue.toDisplayString(cell.key), 3),
              $options.getTrainTitle(cell.day) ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "cell-label",
                onClick: vue.withModifiers(($event) => $options.sharePage(cell.day), ["stop"])
              }, vue.toDisplayString($options.getTrainTitle(cell.day)), 9, ["onClick"])) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createElementVNode("view", {
          class: "add-button",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.addWorkout && $options.addWorkout(...args))
        })
      ])
    ]);
  }
  const PagesTrainingRecordTrainingRecord = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/studyUninApp/bodybuilding-app/pages/trainingRecord/trainingRecord.vue"]]);
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("canvasImage");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["canvasImage"] = "19043a88";
  };
  const train = As.importObject("train");
  const _sfc_main$9 = {
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
        baseUrl: null,
        url: null,
        canvasImageMsg: null
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
        const res2 = await train.getTrainList({ traineeNo: this.traineeNo, trainDate: this.trainDate });
        if (res2.data && res2.data.length > 0) {
          const { trainContent, traineeTitle } = res2.data[0];
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
      formaterTimes(times, type = 3) {
        const hour = Math.floor(times / 3600);
        const minute = Math.floor((times - hour * 3600) / 60);
        const second = times - hour * 3600 - minute * 60;
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
      onSelect(option) {
        formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:295", option, 88);
        this.canvasImageMsg = option.name;
      },
      async uploadImage(callback) {
        const result = await train.uploadBase64({
          base64: this.baseUrl
        });
        this.url = result.fileID;
        this.canvasImageMsg = null;
        callback && callback(this.url);
      },
      downloadFile() {
        uni.downloadFile({
          url: this.url,
          success: (res2) => {
            if (res2.statusCode === 200) {
              formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:311", "\u4E0B\u8F7D\u6210\u529F", res2);
              uni.saveImageToPhotosAlbum({
                filePath: res2.tempFilePath,
                success: (res3) => {
                  formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:315", "\u4FDD\u5B58\u6210\u529F\uFF01", res3);
                  uni.hideLoading();
                  uni.showModal({
                    showCancel: false,
                    title: "\u63D0\u793A",
                    content: "\u56FE\u7247\u5DF2\u7ECF\u4FDD\u5B58\u5230\u76F8\u518C\u8BF7\u67E5\u770B",
                    success: function(res4) {
                      if (res4.confirm) {
                        formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:323", "\u7528\u6237\u70B9\u51FB\u786E\u5B9A");
                      } else if (res4.cancel) {
                        formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:325", "\u7528\u6237\u70B9\u51FB\u53D6\u6D88");
                      }
                    }
                  });
                },
                fail: (err) => {
                  formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:331", "err", err);
                }
              });
            }
          }
        });
      },
      receiveRenderData(option) {
        this.showShare = false;
        formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:340", option.name, 8888);
        this.baseUrl = option.base64;
        this.uploadImage((url) => {
          uni.showLoading({ title: "\u52A0\u8F7D\u4E2D" });
          if (option.name === "\u4FDD\u5B58\u5230\u76F8\u518C") {
            this.downloadFile();
          } else {
            if (option.name === "\u5206\u4EAB\u5230\u5FAE\u4FE1") {
              uni.share({
                provider: "weixin",
                scene: "WXSceneSession",
                type: 2,
                imageUrl: url,
                success: function(res2) {
                  formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:355", "success:" + JSON.stringify(res2));
                  uni.hideLoading();
                },
                fail: function(err) {
                  formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:359", "fail:" + JSON.stringify(err));
                }
              });
            } else if (option.name === "\u5206\u4EAB\u5230\u670B\u53CB\u5708") {
              uni.share({
                provider: "weixin",
                scene: "WXSceneTimeline",
                type: 2,
                imageUrl: url,
                success: function(res2) {
                  formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:369", "success:" + JSON.stringify(res2));
                  uni.hideLoading();
                },
                fail: function(err) {
                  formatAppLog("log", "at pages/trainingRecordDetail/trainingRecordDetail.vue:373", "fail:" + JSON.stringify(err));
                }
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
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
      vue.createElementVNode("view", {
        prop: $data.canvasImageMsg,
        "change:prop": _ctx.canvasImage.updateEcharts,
        id: "canvasImage"
      }, null, 8, ["prop", "change:prop"]),
      vue.createVNode(_component_van_share_sheet, {
        show: $data.showShare,
        "onUpdate:show": _cache[2] || (_cache[2] = ($event) => $data.showShare = $event),
        options: $data.options,
        onSelect: $options.onSelect,
        "cancel-text": ""
      }, null, 8, ["show", "options", "onSelect"])
    ]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$9);
  const PagesTrainingRecordDetailTrainingRecordDetail = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/studyUninApp/bodybuilding-app/pages/trainingRecordDetail/trainingRecordDetail.vue"]]);
  const My$3 = As.importObject("my");
  const _sfc_main$8 = {
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
        const res2 = await My$3.getUserInfo();
        const { avatar, username, comment, vipLevel, vipEndDate } = res2.data;
        this.userInfo = {
          avatar: avatar || null,
          username: username || null,
          comment: comment || null,
          vipLevel: vipLevel || null,
          vipEndDate: vipEndDate || null
        };
        formatAppLog("log", "at pages/my/my.vue:71", res2, 88888);
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
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesMyMy = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/studyUninApp/bodybuilding-app/pages/my/my.vue"]]);
  const My$2 = As.importObject("my");
  const _sfc_main$7 = {
    data() {
      return {
        show: false,
        showPayment: false,
        userInfo: {
          avatar: null
        },
        cardList: [
          {
            hotMsg: "\u6BCF\u59291\u5143\u94B1",
            text: "\u5E74\u5361",
            money: "365",
            des: "468",
            unit: "\u5143/\u5E74",
            activity: "\u65E0\u9650\u4F1A\u5458\u6570",
            active: true
          },
          {
            hotMsg: "\u7ACB\u770160\u5143",
            text: "\u4E09\u4E2A\u6708",
            money: "158",
            des: "218",
            unit: "\u5143/\u5B63\u5EA6",
            activity: "\u9650100\u4E2A\u4F1A\u5458",
            active: false
          },
          {
            hotMsg: "\u7ACB\u770120\u5143",
            text: "\u6708\u5361",
            money: "78",
            des: "98",
            unit: "\u5143/\u6708",
            activity: "\u965030\u4E2A\u4F1A\u5458",
            active: false
          }
        ],
        hotInfo: {
          text1: "103",
          text2: "468\u5143/\u5E74"
        },
        payMoney: "365"
      };
    },
    onShow() {
      this.getUserInfo();
    },
    methods: {
      async getUserInfo() {
        const res2 = await My$2.getUserInfo();
        const { avatar, username, comment, vipLevel, vipEndDate } = res2.data;
        this.userInfo = {
          avatar: avatar || null,
          username: username || null,
          comment: comment || null,
          vipLevel: vipLevel || null,
          vipEndDate: vipEndDate || null
        };
        formatAppLog("log", "at pages/openCard/openCard.vue:145", res2, 88888);
      },
      selectCard(item) {
        this.cardList.forEach((element) => element.active = false);
        item.active = true;
        this.hotInfo.text1 = +item.des - +item.money;
        this.hotInfo.text2 = item.des + item.unit;
        this.payMoney = item.money;
      },
      onClickLeft() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
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
          vue.createElementVNode("view", { class: "card-info" }, [
            vue.createElementVNode("view", { class: "user-logo" }, [
              vue.createVNode(_component_van_image, {
                round: "",
                src: $data.userInfo.avatar
              }, null, 8, ["src"])
            ]),
            vue.createElementVNode("view", { class: "card-name" }, "\u91D1\u5361\u6559\u7EC3"),
            vue.createElementVNode("view", { class: "card-status" }, vue.toDisplayString($data.userInfo.vipEndDate ? "\u751F\u6548\u4E2D" : "\u5931\u6548\u4E2D"), 1)
          ]),
          vue.createElementVNode("view", { class: "card-des" }, vue.toDisplayString($data.userInfo.vipEndDate ? $data.userInfo.vipEndDate : "\u7ACB\u5373\u7EED\u8D39\u91D1\u5361\u6559\u7EC3\uFF0C\u7545\u4EAB\u591A\u9879\u7279\u6743~"), 1)
        ]),
        vue.createElementVNode("view", { class: "right" })
      ]),
      vue.createElementVNode("view", { class: "vip-title" }, "\u5F00\u901A\u91D1\u5361\u6559\u7EC3"),
      vue.createElementVNode("view", { class: "card-types-box" }, [
        vue.createElementVNode("view", { class: "card-types" }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.cardList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["type-item", { active: item.active }]),
              onClick: ($event) => $options.selectCard(item)
            }, [
              vue.createElementVNode("view", { class: "hot-msg" }, vue.toDisplayString(item.hotMsg), 1),
              vue.createElementVNode("view", { class: "text" }, vue.toDisplayString(item.text), 1),
              vue.createElementVNode("view", { class: "money" }, [
                vue.createTextVNode("\xA5"),
                vue.createElementVNode("text", { class: "num" }, vue.toDisplayString(item.money), 1)
              ]),
              vue.createElementVNode("view", { class: "des" }, vue.toDisplayString(item.des) + vue.toDisplayString(item.unit), 1),
              vue.createElementVNode("div", { class: "activity" }, vue.toDisplayString(item.activity), 1)
            ], 10, ["onClick"]);
          }), 128))
        ])
      ]),
      vue.createElementVNode("view", { class: "vip-title" }, "\u91D1\u5361\u6559\u7EC3\u6743\u76CA"),
      vue.createElementVNode("view", { class: "equity-box" }, [
        vue.createElementVNode("view", { class: "equity-list" }, [
          vue.createElementVNode("view", { class: "equity-item" }, [
            vue.createElementVNode("view", { class: "logo" }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ]),
          vue.createElementVNode("view", { class: "equity-item" }, [
            vue.createElementVNode("view", { class: "logo" }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ]),
          vue.createElementVNode("view", { class: "equity-item" }, [
            vue.createElementVNode("view", { class: "logo" }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ]),
          vue.createElementVNode("view", { class: "equity-item" }, [
            vue.createElementVNode("view", { class: "logo" }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ]),
          vue.createElementVNode("view", { class: "equity-item" }, [
            vue.createElementVNode("view", { class: "logo" }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ]),
          vue.createElementVNode("view", { class: "equity-item" }, [
            vue.createElementVNode("view", { class: "logo" }),
            vue.createElementVNode("view", { class: "des" }, "\u91D1\u5361\u6743\u76CA")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "footer-button" }, [
        vue.createElementVNode("view", { class: "text-box" }, [
          vue.createElementVNode("view", { class: "yuan" }, "\u5DF2\u7701\uFFE5" + vue.toDisplayString($data.hotInfo.text1), 1),
          vue.createElementVNode("view", { class: "des" }, vue.toDisplayString($data.hotInfo.text2), 1)
        ]),
        vue.createVNode(_component_van_button, {
          block: "",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.show = true)
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("\u786E\u8BA4\u5F00\u901A\u5E76\u652F\u4ED8\uFFE5" + vue.toDisplayString($data.payMoney) + "\u5143", 1)
          ]),
          _: 1
        })
      ]),
      vue.createVNode(_component_van_action_sheet, {
        class: "payment-action-sheet",
        show: $data.show,
        "onUpdate:show": _cache[1] || (_cache[1] = ($event) => $data.show = $event)
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
  const PagesOpenCardOpenCard = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "D:/studyUninApp/bodybuilding-app/pages/openCard/openCard.vue"]]);
  As.importObject("login");
  const _sfc_main$6 = {
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
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesSetUpSetUp = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "D:/studyUninApp/bodybuilding-app/pages/setUp/setUp.vue"]]);
  const My$1 = As.importObject("my");
  const _sfc_main$5 = {
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
        const res2 = await My$1.getUserInfo();
        const { avatar, username, gender, comment } = res2.data;
        this.userInfo = {
          avatar: avatar || null,
          username: username || "\u7528\u6237\u540D",
          gender: gender === 0 ? "\u672A\u77E5" : gender === 1 ? "\u7537" : gender === 2 ? "\u5973" : null,
          comment
        };
        formatAppLog("log", "at pages/personalInfo/personalInfo.vue:60", res2, 88888);
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
        const success = async (res2) => {
          if (res2.tempFiles && res2.tempFiles.length > 0) {
            const result = await As.uploadFile({
              cloudPath: Date.now() + "-" + res2.tempFiles[0].name,
              filePath: res2.tempFilePaths[0]
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
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesPersonalInfoPersonalInfo = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/studyUninApp/bodybuilding-app/pages/personalInfo/personalInfo.vue"]]);
  const My = As.importObject("my");
  const _sfc_main$4 = {
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
        const res2 = await My.getUserInfo();
        const { username, gender, comment } = res2.data;
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
        formatAppLog("log", "at pages/updateSignature/updateSignature.vue:73", res2, 88888);
      },
      async updateUserInfo() {
        let key = "comment";
        if (this.title == "\u7528\u6237\u540D") {
          key = "username";
        } else if (this.title == "\u6027\u522B") {
          key = "gender";
        }
        const res2 = await My.updateUserInfo({ [key]: this.text });
        formatAppLog("log", "at pages/updateSignature/updateSignature.vue:83", res2, 88);
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
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesUpdateSignatureUpdateSignature = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/studyUninApp/bodybuilding-app/pages/updateSignature/updateSignature.vue"]]);
  const _sfc_main$3 = {
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    onLoad: function(item) {
      formatAppLog("log", "at pages/dynamicEvaluation/actionEvaluation/actionEvaluation.vue:45", item.pageTitle);
      let leftNavTitle = item.pageTitle;
      this.leftNavTitle = leftNavTitle;
    },
    data() {
      return {
        actionobs: [
          { name: "\u6B63\u9762\u89C2" },
          { name: "\u4FA7\u9762\u89C2" }
        ],
        icon: true,
        backimg1: "../../static/app-plus/bg/positiveAction.jpg",
        backimg2: "../../static/app-plus/bg/positiveAction2.jpg",
        changeValue: true,
        num: 0
      };
    },
    methods: {
      setup() {
        const onClickLeft = () => history.back();
        return {
          onClickLeft
        };
      },
      changeFunction(index) {
        if (index == 0) {
          this.changeValue = true;
          this.num = index;
        } else {
          this.changeValue = false;
          this.num = index;
        }
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_image = vue.resolveComponent("van-image");
    const _component_van_button = vue.resolveComponent("van-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: _ctx.leftNavTitle }, null, 8, ["leftNavTitle"]),
      vue.createElementVNode("view", { class: "headBox" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.actionobs, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: vue.normalizeClass(["block", $data.num == index ? "block0" : ""]),
            key: index,
            onClick: ($event) => $options.changeFunction(index)
          }, vue.toDisplayString(item.name), 11, ["onClick"]);
        }), 128))
      ]),
      $data.changeValue ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "contentBody"
      }, [
        vue.createVNode(_component_van_image, {
          class: "imagebg",
          src: $data.backimg1
        }, null, 8, ["src"]),
        vue.createCommentVNode(' <image\r\n			  src="../../static/app-plus/bg/actionImg.png"\r\n			></image> ')
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "contentBody"
      }, [
        vue.createVNode(_component_van_image, {
          class: "imagebg",
          src: $data.backimg2
        }, null, 8, ["src"]),
        vue.createCommentVNode(' <image\r\n			  src="../../static/app-plus/bg/actionImg.png"\r\n			></image> ')
      ])),
      vue.createVNode(_component_van_button, {
        type: "primary",
        block: "",
        class: "buttontrue"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("\u786E\u8BA4")
        ]),
        _: 1
      })
    ]);
  }
  const PagesDynamicEvaluationActionEvaluationActionEvaluation = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/studyUninApp/bodybuilding-app/pages/dynamicEvaluation/actionEvaluation/actionEvaluation.vue"]]);
  const testOb = As.importObject("testResults");
  const _sfc_main$2 = {
    setup() {
      const activeNames = vue.ref(["1"]);
      return { activeNames };
    },
    onLoad: function(item) {
      formatAppLog("log", "at pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation.vue:48", item.pageName);
      let leftNavTitle = item.pageName;
      this.leftNavTitle = leftNavTitle;
    },
    components: {
      BgTheamCompontent,
      NavBarCompontent
    },
    data() {
      return {
        gender: "1",
        age: 18,
        resValue: 80,
        resultValue: 0,
        typeText: "\u5F85\u6D4B",
        typeColor: "#4B525E",
        imgUrl: "../../../static/app-plus/bg/pedalTest.png",
        leftNavTitle: "",
        testVaule: ""
      };
    },
    methods: {
      testResult() {
        const gender = this.gender;
        const age = this.age;
        const resValue = this.resultValue;
        formatAppLog("log", "at pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation.vue:74", gender, age, resValue);
        const res2 = testOb.method1(gender, age, resValue);
        formatAppLog("log", "at pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation.vue:76", res2.data);
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_field = vue.resolveComponent("van-field");
    const _component_van_col = vue.resolveComponent("van-col");
    const _component_van_circle = vue.resolveComponent("van-circle");
    const _component_van_row = vue.resolveComponent("van-row");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: $data.leftNavTitle }, null, 8, ["leftNavTitle"]),
      vue.createElementVNode("view", { class: "body_content" }, [
        vue.createElementVNode("image", {
          src: $data.imgUrl,
          class: "contentImg"
        }, null, 8, ["src"]),
        vue.createElementVNode("view", { class: "contentBlock" }, [
          vue.createVNode(_component_van_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_van_col, { span: "16" }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "testText" }, "\u8BF7\u586B\u5199\u5FC3\u7387"),
                  vue.createElementVNode("view", { class: "testInput" }, [
                    vue.createElementVNode("view", null, [
                      vue.createVNode(_component_van_field, {
                        modelValue: $data.testVaule,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.testVaule = $event),
                        class: "inputBlock"
                      }, null, 8, ["modelValue"])
                    ]),
                    vue.createElementVNode("view", { class: "inputText" }, "/\u5206")
                  ])
                ]),
                _: 1
              }),
              vue.createVNode(_component_van_col, { span: "8" }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "dynamicshow_right" }, [
                    vue.createVNode(_component_van_circle, {
                      "current-rate": _ctx.currentRate,
                      "onUpdate:current-rate": _cache[1] || (_cache[1] = ($event) => _ctx.currentRate = $event),
                      rate: 100,
                      speed: 400,
                      text: $data.typeText,
                      "layer-color": $data.typeColor,
                      color: $data.typeColor,
                      style: vue.normalizeStyle("--van-circle-text-color:" + $data.typeColor)
                    }, null, 8, ["current-rate", "text", "layer-color", "color", "style"])
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ])
      ])
    ]);
  }
  const PagesPhysicalFitnessAssessmentActionEvaluationActionEvaluation = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/studyUninApp/bodybuilding-app/pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation.vue"]]);
  const user = As.importObject("my");
  const _sfc_main$1 = {
    data() {
      return {
        currentRate: 50,
        personName: "\u672A\u77E5",
        gender: 1,
        age: 0,
        mobileNumber: 0,
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
        ],
        showShare: false,
        options: [
          { name: "\u5206\u4EAB\u5230\u5FAE\u4FE1", icon: "../../static/app-plus/other/saveWechat.svg" },
          { name: "\u5206\u4EAB\u5230\u670B\u53CB\u5708", icon: "../../static/app-plus/other/wechatMoments.svg" },
          { name: "\u4FDD\u5B58\u5230\u76F8\u518C", icon: "../../static/app-plus/other/savePhone.svg" }
        ]
      };
    },
    setup() {
      const activeBasicInformation = vue.ref(["1"]);
      const healthQA = vue.ref(["2"]);
      const BodyTestReport = vue.ref(["3"]);
      const bodyAssessment = vue.ref(["4"]);
      const dynamicEvaluation = vue.ref(["5"]);
      const physicalFitnessAssessment = vue.ref(["5"]);
      return {
        activeBasicInformation,
        healthQA,
        BodyTestReport,
        bodyAssessment,
        dynamicEvaluation,
        physicalFitnessAssessment
      };
    },
    onShow() {
      this.getUserInfo();
    },
    methods: {
      async getUserInfo() {
        const res2 = await user.getUserInfo();
        formatAppLog("log", "at pages/viewReport/viewReport.vue:472", res2.data);
        this.name = res2.data.name;
        this.gender = res2.data.gender;
        this.mobileNumber = res2.data.mobile;
      }
    },
    components: {
      BgTheamCompontent,
      NavBarCompontent
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BgTheamCompontent = vue.resolveComponent("BgTheamCompontent");
    const _component_NavBarCompontent = vue.resolveComponent("NavBarCompontent");
    const _component_van_col = vue.resolveComponent("van-col");
    const _component_van_row = vue.resolveComponent("van-row");
    const _component_van_collapse_item = vue.resolveComponent("van-collapse-item");
    const _component_van_collapse = vue.resolveComponent("van-collapse");
    const _component_van_progress = vue.resolveComponent("van-progress");
    const _component_van_circle = vue.resolveComponent("van-circle");
    const _component_van_button = vue.resolveComponent("van-button");
    const _component_van_share_sheet = vue.resolveComponent("van-share-sheet");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content_style" }, [
      vue.createVNode(_component_BgTheamCompontent, { theamType: "currency" }),
      vue.createVNode(_component_NavBarCompontent, { leftNavTitle: "" }),
      vue.createElementVNode("view", { class: "titleText" }, [
        vue.createVNode(_component_van_row, { class: "titleTopText" }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_col, { span: "12" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u4F53\u6D4B\u62A5\u544A")
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_col, { span: "12" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("10.04")
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        vue.createVNode(_component_van_row, { class: "titleBottomText" }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_col, { span: "12" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("\u6570\u636E\u8BC4\u6D4B\u6765\u6E90\u4E8E\u4E16\u754C\u6743\u5A01\u673A\u6784")
              ]),
              _: 1
            }),
            vue.createVNode(_component_van_col, { span: "12" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("2022\u5E74")
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      vue.createElementVNode("view", { class: "basicInformation" }, [
        vue.createVNode(_component_van_collapse, {
          modelValue: $setup.activeBasicInformation,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeBasicInformation = $event),
          border: false
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_collapse_item, {
              title: "\u57FA\u7840\u4FE1\u606F",
              name: "1",
              "title-class": "informationTitleText",
              class: "informationCard"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "basicInformationContent" }, [
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "12" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u59D3\u540D")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "12",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(vue.toDisplayString($data.personName), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "12" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u6027\u522B")
                          ]),
                          _: 1
                        }),
                        $data.gender == 1 ? (vue.openBlock(), vue.createBlock(_component_van_col, {
                          key: 0,
                          span: "12",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u7537")
                          ]),
                          _: 1
                        })) : vue.createCommentVNode("v-if", true),
                        $data.gender == 2 ? (vue.openBlock(), vue.createBlock(_component_van_col, {
                          key: 1,
                          span: "12",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u5973")
                          ]),
                          _: 1
                        })) : vue.createCommentVNode("v-if", true)
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "12" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u5E74\u9F84")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "12",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(vue.toDisplayString($data.age), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "12" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u624B\u673A\u53F7\u7801")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "12",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(vue.toDisplayString($data.mobileNumber), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "basicInformation" }, [
        vue.createVNode(_component_van_collapse, {
          modelValue: $setup.healthQA,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.healthQA = $event),
          border: false
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_collapse_item, {
              title: "\u5065\u5EB7\u95EE\u7B54",
              name: "2",
              "title-class": "informationTitleText",
              class: "informationCard"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "basicInformationContent healthBlocks" }, [
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u9AD8\u8840\u538B "),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u652F\u6C14\u7BA1\u708E "),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u652F\u6C14\u7BA1\u708E ")
                ]),
                vue.createElementVNode("view", { class: "healthBlocks" }, [
                  vue.createElementVNode("view", { style: { "margin-bottom": "20upx", "color": "#F4F7FF", "font-size": "30upx", "font-weight": "500" } }, [
                    vue.createElementVNode("view", { class: "greenBlock" }),
                    vue.createTextVNode(" \u5176\u4ED6\u88AB\u786E\u8BCA\u7684\u75BE\u75C5 ")
                  ]),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u652F\u6C14\u7BA1\u708E ")
                ]),
                vue.createElementVNode("view", { class: "healthBlocks" }, [
                  vue.createElementVNode("view", { style: { "margin-bottom": "20upx", "color": "#F4F7FF", "font-size": "30upx", "font-weight": "500" } }, [
                    vue.createElementVNode("view", { class: "greenBlock" }),
                    vue.createTextVNode(" \u5173\u8282\u3001\u97E7\u5E26\u548C\u808C\u8089\u662F\u5426\u53D7\u8FC7\u4EFB\u4F55\u635F\u4F24 ")
                  ]),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u8DDF\u8171\u635F\u4F24 "),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u624B\u81C2\u62C9\u4F24 ")
                ]),
                vue.createElementVNode("view", { class: "healthBlocks" }, [
                  vue.createElementVNode("view", { style: { "margin-bottom": "20upx", "color": "#F4F7FF", "font-size": "30upx", "font-weight": "500" } }, [
                    vue.createElementVNode("view", { class: "greenBlock" }),
                    vue.createTextVNode(" \u662F\u5426\u66FE\u7ECF\u9AA8\u6298 ")
                  ]),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u8098\u90E8\u9AA8\u6298 ")
                ]),
                vue.createElementVNode("view", { class: "healthBlocks" }, [
                  vue.createElementVNode("view", { style: { "margin-bottom": "20upx", "color": "#F4F7FF", "font-size": "30upx", "font-weight": "500" } }, [
                    vue.createElementVNode("view", { class: "greenBlock" }),
                    vue.createTextVNode(" \u6700\u8FD1\u7684\u4F53\u91CD\u662F\u5426\u6709\u5927\u5E45\u5EA6\u7684\u53D8\u5316 ")
                  ]),
                  vue.createElementVNode("view", { class: "healthBlock" }, " \u91CD\u4E8615\u516C\u65A4 ")
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "basicInformation" }, [
        vue.createVNode(_component_van_collapse, {
          modelValue: $setup.BodyTestReport,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.BodyTestReport = $event),
          border: false
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_collapse_item, {
              title: "\u4F53\u6D4B\u62A5\u544A",
              name: "3",
              "title-class": "informationTitleText",
              class: "informationCard"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "countNumBlock" }, [
                  vue.createVNode(_component_van_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_van_col, {
                        span: "12",
                        style: { "font-size": "32upx", "font-weight": "600", "color": "#F4F7FF", "line-height": "44upx", "margin-top": "20upx" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("\u4F60\u5F88\u68D2\uFF01")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_van_col, {
                        span: "12",
                        style: { "font-size": "60upx", "font-weight": "600", "color": "#FFFFFF", "line-height": "72upx", "text-align": "right", "margin-top": "10upx" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("82")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_van_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_van_col, { span: "24" }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("\u518D\u52AA\u529B\u4E00\u70B9\u4F1A\u66F4\u597D\u54E6\uFF01")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createElementVNode("view", { style: { "margin-top": "44upx" } }, [
                    vue.createVNode(_component_van_progress, {
                      percentage: 82,
                      "stroke-width": "8",
                      color: "#01E08C",
                      "show-pivot": false,
                      "track-color": "#454951"
                    })
                  ])
                ]),
                vue.createElementVNode("view", { class: "basicInformationContent" }, [
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "12" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u8EAB\u9AD8")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "12",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("180cm")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u4F53\u91CD\uFF08\u6807\u51C6\uFF1A70kg\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("80kg")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u808C\u8089\u91CF\uFF08\u6807\u51C6\uFF1A60kg\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("50kg")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u4F53\u8102\u91CF\uFF08\u6807\u51C6\uFF1A30kg\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("15kg")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u4F53\u8102\u767E\u5206\u6BD4\uFF08\u6807\u51C6\uFF1A18%\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("30%")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u8170\u81C0\u767E\u5206\u6BD4\uFF08\u6807\u51C6\uFF1A15%\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("25%")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u57FA\u7840\u4EE3\u8C22\uFF08\u6807\u51C6\uFF1A2200cal\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("1800cal")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  vue.createElementVNode("view", { class: "textContent" }, [
                    vue.createVNode(_component_van_row, { class: "text" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_van_col, { span: "17" }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("\u4F53\u6C34\u5206\uFF08\u6807\u51C6\uFF1A40%\uFF09")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_van_col, {
                          span: "7",
                          class: "textRight"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("20%")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "basicInformation" }, [
        vue.createVNode(_component_van_collapse, {
          modelValue: $setup.bodyAssessment,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.bodyAssessment = $event),
          border: false
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_collapse_item, {
              title: "\u4F53\u6001\u8BC4\u4F30",
              name: "4",
              "title-class": "informationTitleText",
              class: "informationCard"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "bodyAssessment" }, [
                  vue.createElementVNode("view", { style: { "width": "10px", "height": "10px", "background": "#FFC13C", "border-radius": "100%", "display": "inline-flex", "margin-right": "20upx" } }),
                  vue.createElementVNode("span", { style: { "font-size": "30upx", "font-weight": "400", "color": "#F4F7FF", "line-height": "42upx" } }, "\u9888\u90E8\u524D\u5F15"),
                  vue.createElementVNode("view", { class: "assessmentContent" }, [
                    vue.createElementVNode("p", null, " \u7D27\u5F20\u808C\u8089\uFF1A\u80A9\u80DB\u63D0\u808C\uFF0C\u9888\u4F38\u808C\uFF0C\u524D\u659C\u89D2\u808C\uFF0C\u5934\u540E\u5927\u76F4\u808C\uFF0C\u5934\u534A\u68D8\u808C\uFF0C\u80F8\u9501\u4E73\u7A81\u5F62\u808C\u3002 "),
                    vue.createElementVNode("p", { style: { "margin-top": "20upx" } }, " \u65E0\u529B\u808C\u8089\uFF1A\u6DF1\u5C42\u9888\u5C48\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u4E2D\u4E0B\u659C\u65B9\u808C\uFF0C\u5C0F\u5706\u808C\uFF0C\u5C97\u4E0B\u808C\u3002 ")
                  ])
                ]),
                vue.createElementVNode("view", { class: "bodyAssessment" }, [
                  vue.createElementVNode("view", { style: { "width": "10px", "height": "10px", "background": "#FFC13C", "border-radius": "100%", "display": "inline-flex", "margin-right": "20upx" } }),
                  vue.createElementVNode("span", { style: { "font-size": "30upx", "font-weight": "400", "color": "#F4F7FF", "line-height": "42upx" } }, "\u9AD8\u4F4E\u80A9"),
                  vue.createElementVNode("view", { class: "assessmentContent" }, [
                    vue.createElementVNode("p", null, " \u7D27\u5F20\u808C\u8089\uFF1A\u4E0A\u659C\u65B9\u808C\uFF0C\u80A9\u80DB\u63D0\u808C\uFF0C\u83F1\u5F62\u808C\u3002 "),
                    vue.createElementVNode("p", { style: { "margin-top": "20upx" } }, " \u65E0\u529B\u808C\u8089\uFF1A\u4E2D\u4E0B\u659C\u65B9\u808C\uFF0C\u83F1\u5F62\u808C\uFF0C\u5C97\u4E0B\u808C\u3002 ")
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "basicInformation" }, [
        vue.createVNode(_component_van_collapse, {
          modelValue: $setup.dynamicEvaluation,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.dynamicEvaluation = $event),
          border: false
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_collapse_item, {
              title: "\u52A8\u6001\u8BC4\u4F30",
              name: "5",
              "title-class": "informationTitleText",
              class: "informationCard"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "bodyAssessment" }, [
                  vue.createElementVNode("view", { style: { "width": "10px", "height": "10px", "background": "#FFC13C", "border-radius": "100%", "display": "inline-flex", "margin-right": "20upx" } }),
                  vue.createElementVNode("span", { style: { "font-size": "30upx", "font-weight": "400", "color": "#F4F7FF", "line-height": "42upx" } }, "\u6B63\u9762\u89C2\uFF1A\u5148\u5C48\u819D\u4E0B\u8E72"),
                  vue.createElementVNode("view", { class: "assessmentContent" }, [
                    vue.createElementVNode("p", null, " \u95EE\u9898\u63CF\u8FF0\uFF1A\u80A1\u56DB\u5934\u808C\u548C\u9ACB\u5173\u8282\u5C48\u808C\u6D3B\u8DC3\uFF0C\u81C0\u90E8\u808C\u7FA4\u4E0D\u591F\u6D3B\u8DC3\u3002 ")
                  ])
                ]),
                vue.createElementVNode("view", { class: "bodyAssessment" }, [
                  vue.createElementVNode("view", { style: { "width": "10px", "height": "10px", "background": "#FFC13C", "border-radius": "100%", "display": "inline-flex", "margin-right": "20upx" } }),
                  vue.createElementVNode("span", { style: { "font-size": "30upx", "font-weight": "400", "color": "#F4F7FF", "line-height": "42upx" } }, "\u4FA7\u9762\u89C2\uFF1A\u80EB\u9AA8\u548C\u8EAF\u5E72\u4E0D\u5E73\u8861"),
                  vue.createElementVNode("view", { class: "assessmentContent" }, [
                    vue.createElementVNode("p", null, " \u95EE\u9898\u63CF\u8FF0\uFF1A\u8DD6\u5C48\u808C\u7D27\u5F20\uFF0C\u5BFC\u81F4\u80CC\u5C48\u8DB3\u80CC\u5C48\u4E0D\u8DB3\uFF0C\u8FD0\u52A8\u529B\u5B66\u4E0D\u826F\u3002 ")
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      vue.createElementVNode("view", { class: "basicInformation" }, [
        vue.createVNode(_component_van_collapse, {
          modelValue: $setup.physicalFitnessAssessment,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.physicalFitnessAssessment = $event),
          border: false
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_van_collapse_item, {
              title: "\u4F53\u80FD\u8BC4\u4F30",
              name: "6",
              "title-class": "informationTitleText",
              class: "informationCard"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_van_row, { style: { "background-color": "#343A44" } }, {
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
                              index == 0 ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, " \u5FC3\u7387\uFF1A" + vue.toDisplayString(item.type) + "/\u5206 ", 1)) : index == 1 ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, " \u6570\u91CF\uFF1A" + vue.toDisplayString(item.type) + "\u4E2A ", 1)) : index == 2 ? (vue.openBlock(), vue.createElementBlock("text", { key: 2 }, " \u6570\u91CF\uFF1A" + vue.toDisplayString(item.type) + "\u4E2A ", 1)) : vue.createCommentVNode("v-if", true)
                            ])) : (vue.openBlock(), vue.createElementBlock("view", {
                              key: 1,
                              class: "dynamicshow_left"
                            }, [
                              vue.createElementVNode("text", { class: "evaluationdata" }, vue.toDisplayString(item.title), 1),
                              vue.createElementVNode("text", null, " \u6682\u672A\u6D4B\u8BD5\uFF0C\u5FEB\u53BB\u6D4B\u8BD5\u5427 ")
                            ])),
                            item.type >= 90 ? (vue.openBlock(), vue.createElementBlock("view", {
                              key: 2,
                              class: "dynamicshow_right"
                            }, [
                              vue.createVNode(_component_van_circle, {
                                "current-rate": $data.currentRate,
                                "onUpdate:current-rate": _cache[5] || (_cache[5] = ($event) => $data.currentRate = $event),
                                rate: 100,
                                speed: 400,
                                text: "\u4F18\u79C0",
                                "layer-color": "#383D46",
                                color: "#01E08C",
                                style: { "--van-circle-text-color": "#01E08C" }
                              }, null, 8, ["current-rate"])
                            ])) : item.type >= 60 ? (vue.openBlock(), vue.createElementBlock("view", {
                              key: 3,
                              class: "dynamicshow_right"
                            }, [
                              vue.createVNode(_component_van_circle, {
                                "current-rate": $data.currentRate,
                                "onUpdate:current-rate": _cache[6] || (_cache[6] = ($event) => $data.currentRate = $event),
                                rate: 100,
                                speed: 400,
                                text: "\u4E2D\u4E0A",
                                "layer-color": "#383D46",
                                color: "#FFC13C",
                                style: { "--van-circle-text-color": "#FFC13C" }
                              }, null, 8, ["current-rate"])
                            ])) : item.type > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                              key: 4,
                              class: "dynamicshow_right"
                            }, [
                              vue.createVNode(_component_van_circle, {
                                "current-rate": $data.currentRate,
                                "onUpdate:current-rate": _cache[7] || (_cache[7] = ($event) => $data.currentRate = $event),
                                rate: 100,
                                speed: 400,
                                text: "\u8F83\u5DEE",
                                "layer-color": "#383D46",
                                color: "#F04242",
                                style: { "--van-circle-text-color": "#F04242" }
                              }, null, 8, ["current-rate"])
                            ])) : (vue.openBlock(), vue.createElementBlock("view", {
                              key: 5,
                              class: "dynamicshow_right"
                            }, [
                              vue.createVNode(_component_van_circle, {
                                "current-rate": $data.currentRate,
                                "onUpdate:current-rate": _cache[8] || (_cache[8] = ($event) => $data.currentRate = $event),
                                rate: 100,
                                speed: 400,
                                text: "\u5F85\u6D4B",
                                "layer-color": "#383D46",
                                color: "#4B525E",
                                style: { "--van-circle-text-color": "#4B525E" }
                              }, null, 8, ["current-rate"])
                            ]))
                          ]);
                        }), 128))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      vue.createVNode(_component_van_button, {
        type: "primary",
        class: "shareButton",
        icon: "../../static/app-plus/other/share.svg",
        onClick: _cache[10] || (_cache[10] = ($event) => $data.showShare = true)
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("\u5206\u4EAB\u62A5\u544A")
        ]),
        _: 1
      }),
      vue.createVNode(_component_van_share_sheet, {
        show: $data.showShare,
        "onUpdate:show": _cache[11] || (_cache[11] = ($event) => $data.showShare = $event),
        options: $data.options,
        onSelect: _ctx.onSelect,
        "cancel-text": "",
        class: "shareBlock"
      }, null, 8, ["show", "options", "onSelect"])
    ]);
  }
  const PagesViewReportViewReport = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/studyUninApp/bodybuilding-app/pages/viewReport/viewReport.vue"]]);
  __definePage("pages/myMebers/myMebers", PagesMyMebersMyMebers);
  __definePage("pages/addMyMebers/addMyMebers", PagesAddMyMebersAddMyMebers);
  __definePage("pages/memberQuery/memberQuery", PagesMemberQueryMemberQuery);
  __definePage("pages/bodyAssessment/bodyAssessment", PagesBodyAssessmentBodyAssessment);
  __definePage("pages/bodyTestReport/bodyTestReport", PagesBodyTestReportBodyTestReport);
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
  __definePage("pages/dynamicEvaluation/actionEvaluation/actionEvaluation", PagesDynamicEvaluationActionEvaluationActionEvaluation);
  __definePage("pages/physicalFitnessAssessment/actionEvaluation/actionEvaluation", PagesPhysicalFitnessAssessmentActionEvaluationActionEvaluation);
  __definePage("pages/viewReport/viewReport", PagesViewReportViewReport);
  var lookup = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    62,
    0,
    62,
    0,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    0,
    0,
    0,
    0,
    63,
    0,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  function base64Decode(source, target) {
    var sourceLength = source.length;
    var paddingLength = source[sourceLength - 2] === "=" ? 2 : source[sourceLength - 1] === "=" ? 1 : 0;
    var tmp;
    var byteIndex = 0;
    var baseLength = sourceLength - paddingLength & 4294967292;
    for (var i2 = 0; i2 < baseLength; i2 += 4) {
      tmp = lookup[source.charCodeAt(i2)] << 18 | lookup[source.charCodeAt(i2 + 1)] << 12 | lookup[source.charCodeAt(i2 + 2)] << 6 | lookup[source.charCodeAt(i2 + 3)];
      target[byteIndex++] = tmp >> 16 & 255;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 1) {
      tmp = lookup[source.charCodeAt(i2)] << 10 | lookup[source.charCodeAt(i2 + 1)] << 4 | lookup[source.charCodeAt(i2 + 2)] >> 2;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 2) {
      tmp = lookup[source.charCodeAt(i2)] << 2 | lookup[source.charCodeAt(i2 + 1)] >> 4;
      target[byteIndex++] = tmp & 255;
    }
  }
  const $inject_window_crypto = {
    getRandomValues(arr) {
      if (!(arr instanceof Int8Array || arr instanceof Uint8Array || arr instanceof Int16Array || arr instanceof Uint16Array || arr instanceof Int32Array || arr instanceof Uint32Array || arr instanceof Uint8ClampedArray)) {
        throw new Error("Expected an integer array");
      }
      if (arr.byteLength > 65536) {
        throw new Error("Can only request a maximum of 65536 bytes");
      }
      var crypto = requireNativePlugin("DCloud-Crypto");
      base64Decode(crypto.getRandomValues(arr.byteLength), new Uint8Array(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength
      ));
      return arr;
    }
  };
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  function createCommonjsModule(fn) {
    var module2 = { exports: {} };
    return fn(module2, module2.exports), module2.exports;
  }
  /*! For license information please see gtpush-min.js.LICENSE.txt */
  var gtpushMin = createCommonjsModule(function(module2, exports) {
    (function t2(e, r2) {
      module2.exports = r2();
    })(self, () => (() => {
      var t2 = { 4736: (t3, e2, r3) => {
        t3 = r3.nmd(t3);
        var i3;
        var n2 = function(t4) {
          var e3 = 1e7, r4 = 7, i4 = 9007199254740992, s2 = d2(i4), a2 = "0123456789abcdefghijklmnopqrstuvwxyz";
          var o2 = "function" === typeof BigInt;
          function u2(t5, e4, r5, i5) {
            if ("undefined" === typeof t5)
              return u2[0];
            if ("undefined" !== typeof e4)
              return 10 === +e4 && !r5 ? st2(t5) : X2(t5, e4, r5, i5);
            return st2(t5);
          }
          function c2(t5, e4) {
            this.value = t5;
            this.sign = e4;
            this.isSmall = false;
          }
          c2.prototype = Object.create(u2.prototype);
          function l2(t5) {
            this.value = t5;
            this.sign = t5 < 0;
            this.isSmall = true;
          }
          l2.prototype = Object.create(u2.prototype);
          function f2(t5) {
            this.value = t5;
          }
          f2.prototype = Object.create(u2.prototype);
          function h2(t5) {
            return -i4 < t5 && t5 < i4;
          }
          function d2(t5) {
            if (t5 < 1e7)
              return [t5];
            if (t5 < 1e14)
              return [t5 % 1e7, Math.floor(t5 / 1e7)];
            return [t5 % 1e7, Math.floor(t5 / 1e7) % 1e7, Math.floor(t5 / 1e14)];
          }
          function p2(t5) {
            v2(t5);
            var r5 = t5.length;
            if (r5 < 4 && N2(t5, s2) < 0)
              switch (r5) {
                case 0:
                  return 0;
                case 1:
                  return t5[0];
                case 2:
                  return t5[0] + t5[1] * e3;
                default:
                  return t5[0] + (t5[1] + t5[2] * e3) * e3;
              }
            return t5;
          }
          function v2(t5) {
            var e4 = t5.length;
            while (0 === t5[--e4])
              ;
            t5.length = e4 + 1;
          }
          function g2(t5) {
            var e4 = new Array(t5);
            var r5 = -1;
            while (++r5 < t5)
              e4[r5] = 0;
            return e4;
          }
          function y(t5) {
            if (t5 > 0)
              return Math.floor(t5);
            return Math.ceil(t5);
          }
          function m2(t5, r5) {
            var i5 = t5.length, n3 = r5.length, s3 = new Array(i5), a3 = 0, o3 = e3, u3, c3;
            for (c3 = 0; c3 < n3; c3++) {
              u3 = t5[c3] + r5[c3] + a3;
              a3 = u3 >= o3 ? 1 : 0;
              s3[c3] = u3 - a3 * o3;
            }
            while (c3 < i5) {
              u3 = t5[c3] + a3;
              a3 = u3 === o3 ? 1 : 0;
              s3[c3++] = u3 - a3 * o3;
            }
            if (a3 > 0)
              s3.push(a3);
            return s3;
          }
          function w2(t5, e4) {
            if (t5.length >= e4.length)
              return m2(t5, e4);
            return m2(e4, t5);
          }
          function S2(t5, r5) {
            var i5 = t5.length, n3 = new Array(i5), s3 = e3, a3, o3;
            for (o3 = 0; o3 < i5; o3++) {
              a3 = t5[o3] - s3 + r5;
              r5 = Math.floor(a3 / s3);
              n3[o3] = a3 - r5 * s3;
              r5 += 1;
            }
            while (r5 > 0) {
              n3[o3++] = r5 % s3;
              r5 = Math.floor(r5 / s3);
            }
            return n3;
          }
          c2.prototype.add = function(t5) {
            var e4 = st2(t5);
            if (this.sign !== e4.sign)
              return this.subtract(e4.negate());
            var r5 = this.value, i5 = e4.value;
            if (e4.isSmall)
              return new c2(S2(r5, Math.abs(i5)), this.sign);
            return new c2(w2(r5, i5), this.sign);
          };
          c2.prototype.plus = c2.prototype.add;
          l2.prototype.add = function(t5) {
            var e4 = st2(t5);
            var r5 = this.value;
            if (r5 < 0 !== e4.sign)
              return this.subtract(e4.negate());
            var i5 = e4.value;
            if (e4.isSmall) {
              if (h2(r5 + i5))
                return new l2(r5 + i5);
              i5 = d2(Math.abs(i5));
            }
            return new c2(S2(i5, Math.abs(r5)), r5 < 0);
          };
          l2.prototype.plus = l2.prototype.add;
          f2.prototype.add = function(t5) {
            return new f2(this.value + st2(t5).value);
          };
          f2.prototype.plus = f2.prototype.add;
          function _2(t5, r5) {
            var i5 = t5.length, n3 = r5.length, s3 = new Array(i5), a3 = 0, o3 = e3, u3, c3;
            for (u3 = 0; u3 < n3; u3++) {
              c3 = t5[u3] - a3 - r5[u3];
              if (c3 < 0) {
                c3 += o3;
                a3 = 1;
              } else
                a3 = 0;
              s3[u3] = c3;
            }
            for (u3 = n3; u3 < i5; u3++) {
              c3 = t5[u3] - a3;
              if (c3 < 0)
                c3 += o3;
              else {
                s3[u3++] = c3;
                break;
              }
              s3[u3] = c3;
            }
            for (; u3 < i5; u3++)
              s3[u3] = t5[u3];
            v2(s3);
            return s3;
          }
          function b2(t5, e4, r5) {
            var i5;
            if (N2(t5, e4) >= 0)
              i5 = _2(t5, e4);
            else {
              i5 = _2(e4, t5);
              r5 = !r5;
            }
            i5 = p2(i5);
            if ("number" === typeof i5) {
              if (r5)
                i5 = -i5;
              return new l2(i5);
            }
            return new c2(i5, r5);
          }
          function E2(t5, r5, i5) {
            var n3 = t5.length, s3 = new Array(n3), a3 = -r5, o3 = e3, u3, f3;
            for (u3 = 0; u3 < n3; u3++) {
              f3 = t5[u3] + a3;
              a3 = Math.floor(f3 / o3);
              f3 %= o3;
              s3[u3] = f3 < 0 ? f3 + o3 : f3;
            }
            s3 = p2(s3);
            if ("number" === typeof s3) {
              if (i5)
                s3 = -s3;
              return new l2(s3);
            }
            return new c2(s3, i5);
          }
          c2.prototype.subtract = function(t5) {
            var e4 = st2(t5);
            if (this.sign !== e4.sign)
              return this.add(e4.negate());
            var r5 = this.value, i5 = e4.value;
            if (e4.isSmall)
              return E2(r5, Math.abs(i5), this.sign);
            return b2(r5, i5, this.sign);
          };
          c2.prototype.minus = c2.prototype.subtract;
          l2.prototype.subtract = function(t5) {
            var e4 = st2(t5);
            var r5 = this.value;
            if (r5 < 0 !== e4.sign)
              return this.add(e4.negate());
            var i5 = e4.value;
            if (e4.isSmall)
              return new l2(r5 - i5);
            return E2(i5, Math.abs(r5), r5 >= 0);
          };
          l2.prototype.minus = l2.prototype.subtract;
          f2.prototype.subtract = function(t5) {
            return new f2(this.value - st2(t5).value);
          };
          f2.prototype.minus = f2.prototype.subtract;
          c2.prototype.negate = function() {
            return new c2(this.value, !this.sign);
          };
          l2.prototype.negate = function() {
            var t5 = this.sign;
            var e4 = new l2(-this.value);
            e4.sign = !t5;
            return e4;
          };
          f2.prototype.negate = function() {
            return new f2(-this.value);
          };
          c2.prototype.abs = function() {
            return new c2(this.value, false);
          };
          l2.prototype.abs = function() {
            return new l2(Math.abs(this.value));
          };
          f2.prototype.abs = function() {
            return new f2(this.value >= 0 ? this.value : -this.value);
          };
          function D2(t5, r5) {
            var i5 = t5.length, n3 = r5.length, s3 = i5 + n3, a3 = g2(s3), o3 = e3, u3, c3, l3, f3, h3;
            for (l3 = 0; l3 < i5; ++l3) {
              f3 = t5[l3];
              for (var d3 = 0; d3 < n3; ++d3) {
                h3 = r5[d3];
                u3 = f3 * h3 + a3[l3 + d3];
                c3 = Math.floor(u3 / o3);
                a3[l3 + d3] = u3 - c3 * o3;
                a3[l3 + d3 + 1] += c3;
              }
            }
            v2(a3);
            return a3;
          }
          function M2(t5, r5) {
            var i5 = t5.length, n3 = new Array(i5), s3 = e3, a3 = 0, o3, u3;
            for (u3 = 0; u3 < i5; u3++) {
              o3 = t5[u3] * r5 + a3;
              a3 = Math.floor(o3 / s3);
              n3[u3] = o3 - a3 * s3;
            }
            while (a3 > 0) {
              n3[u3++] = a3 % s3;
              a3 = Math.floor(a3 / s3);
            }
            return n3;
          }
          function T2(t5, e4) {
            var r5 = [];
            while (e4-- > 0)
              r5.push(0);
            return r5.concat(t5);
          }
          function I2(t5, e4) {
            var r5 = Math.max(t5.length, e4.length);
            if (r5 <= 30)
              return D2(t5, e4);
            r5 = Math.ceil(r5 / 2);
            var i5 = t5.slice(r5), n3 = t5.slice(0, r5), s3 = e4.slice(r5), a3 = e4.slice(0, r5);
            var o3 = I2(n3, a3), u3 = I2(i5, s3), c3 = I2(w2(n3, i5), w2(a3, s3));
            var l3 = w2(w2(o3, T2(_2(_2(c3, o3), u3), r5)), T2(u3, 2 * r5));
            v2(l3);
            return l3;
          }
          function A2(t5, e4) {
            return -0.012 * t5 - 0.012 * e4 + 15e-6 * t5 * e4 > 0;
          }
          c2.prototype.multiply = function(t5) {
            var r5 = st2(t5), i5 = this.value, n3 = r5.value, s3 = this.sign !== r5.sign, a3;
            if (r5.isSmall) {
              if (0 === n3)
                return u2[0];
              if (1 === n3)
                return this;
              if (-1 === n3)
                return this.negate();
              a3 = Math.abs(n3);
              if (a3 < e3)
                return new c2(M2(i5, a3), s3);
              n3 = d2(a3);
            }
            if (A2(i5.length, n3.length))
              return new c2(I2(i5, n3), s3);
            return new c2(D2(i5, n3), s3);
          };
          c2.prototype.times = c2.prototype.multiply;
          function x2(t5, r5, i5) {
            if (t5 < e3)
              return new c2(M2(r5, t5), i5);
            return new c2(D2(r5, d2(t5)), i5);
          }
          l2.prototype._multiplyBySmall = function(t5) {
            if (h2(t5.value * this.value))
              return new l2(t5.value * this.value);
            return x2(Math.abs(t5.value), d2(Math.abs(this.value)), this.sign !== t5.sign);
          };
          c2.prototype._multiplyBySmall = function(t5) {
            if (0 === t5.value)
              return u2[0];
            if (1 === t5.value)
              return this;
            if (-1 === t5.value)
              return this.negate();
            return x2(Math.abs(t5.value), this.value, this.sign !== t5.sign);
          };
          l2.prototype.multiply = function(t5) {
            return st2(t5)._multiplyBySmall(this);
          };
          l2.prototype.times = l2.prototype.multiply;
          f2.prototype.multiply = function(t5) {
            return new f2(this.value * st2(t5).value);
          };
          f2.prototype.times = f2.prototype.multiply;
          function R2(t5) {
            var r5 = t5.length, i5 = g2(r5 + r5), n3 = e3, s3, a3, o3, u3, c3;
            for (o3 = 0; o3 < r5; o3++) {
              u3 = t5[o3];
              a3 = 0 - u3 * u3;
              for (var l3 = o3; l3 < r5; l3++) {
                c3 = t5[l3];
                s3 = 2 * (u3 * c3) + i5[o3 + l3] + a3;
                a3 = Math.floor(s3 / n3);
                i5[o3 + l3] = s3 - a3 * n3;
              }
              i5[o3 + r5] = a3;
            }
            v2(i5);
            return i5;
          }
          c2.prototype.square = function() {
            return new c2(R2(this.value), false);
          };
          l2.prototype.square = function() {
            var t5 = this.value * this.value;
            if (h2(t5))
              return new l2(t5);
            return new c2(R2(d2(Math.abs(this.value))), false);
          };
          f2.prototype.square = function(t5) {
            return new f2(this.value * this.value);
          };
          function B2(t5, r5) {
            var i5 = t5.length, n3 = r5.length, s3 = e3, a3 = g2(r5.length), o3 = r5[n3 - 1], u3 = Math.ceil(s3 / (2 * o3)), c3 = M2(t5, u3), l3 = M2(r5, u3), f3, h3, d3, v3, y2, m3, w3;
            if (c3.length <= i5)
              c3.push(0);
            l3.push(0);
            o3 = l3[n3 - 1];
            for (h3 = i5 - n3; h3 >= 0; h3--) {
              f3 = s3 - 1;
              if (c3[h3 + n3] !== o3)
                f3 = Math.floor((c3[h3 + n3] * s3 + c3[h3 + n3 - 1]) / o3);
              d3 = 0;
              v3 = 0;
              m3 = l3.length;
              for (y2 = 0; y2 < m3; y2++) {
                d3 += f3 * l3[y2];
                w3 = Math.floor(d3 / s3);
                v3 += c3[h3 + y2] - (d3 - w3 * s3);
                d3 = w3;
                if (v3 < 0) {
                  c3[h3 + y2] = v3 + s3;
                  v3 = -1;
                } else {
                  c3[h3 + y2] = v3;
                  v3 = 0;
                }
              }
              while (0 !== v3) {
                f3 -= 1;
                d3 = 0;
                for (y2 = 0; y2 < m3; y2++) {
                  d3 += c3[h3 + y2] - s3 + l3[y2];
                  if (d3 < 0) {
                    c3[h3 + y2] = d3 + s3;
                    d3 = 0;
                  } else {
                    c3[h3 + y2] = d3;
                    d3 = 1;
                  }
                }
                v3 += d3;
              }
              a3[h3] = f3;
            }
            c3 = k(c3, u3)[0];
            return [p2(a3), p2(c3)];
          }
          function O2(t5, r5) {
            var i5 = t5.length, n3 = r5.length, s3 = [], a3 = [], o3 = e3, u3, c3, l3, f3, h3;
            while (i5) {
              a3.unshift(t5[--i5]);
              v2(a3);
              if (N2(a3, r5) < 0) {
                s3.push(0);
                continue;
              }
              c3 = a3.length;
              l3 = a3[c3 - 1] * o3 + a3[c3 - 2];
              f3 = r5[n3 - 1] * o3 + r5[n3 - 2];
              if (c3 > n3)
                l3 = (l3 + 1) * o3;
              u3 = Math.ceil(l3 / f3);
              do {
                h3 = M2(r5, u3);
                if (N2(h3, a3) <= 0)
                  break;
                u3--;
              } while (u3);
              s3.push(u3);
              a3 = _2(a3, h3);
            }
            s3.reverse();
            return [p2(s3), p2(a3)];
          }
          function k(t5, r5) {
            var i5 = t5.length, n3 = g2(i5), s3 = e3, a3, o3, u3, c3;
            u3 = 0;
            for (a3 = i5 - 1; a3 >= 0; --a3) {
              c3 = u3 * s3 + t5[a3];
              o3 = y(c3 / r5);
              u3 = c3 - o3 * r5;
              n3[a3] = 0 | o3;
            }
            return [n3, 0 | u3];
          }
          function C2(t5, r5) {
            var i5, n3 = st2(r5);
            if (o2)
              return [new f2(t5.value / n3.value), new f2(t5.value % n3.value)];
            var s3 = t5.value, a3 = n3.value;
            var h3;
            if (0 === a3)
              throw new Error("Cannot divide by zero");
            if (t5.isSmall) {
              if (n3.isSmall)
                return [new l2(y(s3 / a3)), new l2(s3 % a3)];
              return [u2[0], t5];
            }
            if (n3.isSmall) {
              if (1 === a3)
                return [t5, u2[0]];
              if (-1 == a3)
                return [t5.negate(), u2[0]];
              var v3 = Math.abs(a3);
              if (v3 < e3) {
                i5 = k(s3, v3);
                h3 = p2(i5[0]);
                var g3 = i5[1];
                if (t5.sign)
                  g3 = -g3;
                if ("number" === typeof h3) {
                  if (t5.sign !== n3.sign)
                    h3 = -h3;
                  return [new l2(h3), new l2(g3)];
                }
                return [new c2(h3, t5.sign !== n3.sign), new l2(g3)];
              }
              a3 = d2(v3);
            }
            var m3 = N2(s3, a3);
            if (-1 === m3)
              return [u2[0], t5];
            if (0 === m3)
              return [u2[t5.sign === n3.sign ? 1 : -1], u2[0]];
            if (s3.length + a3.length <= 200)
              i5 = B2(s3, a3);
            else
              i5 = O2(s3, a3);
            h3 = i5[0];
            var w3 = t5.sign !== n3.sign, S3 = i5[1], _3 = t5.sign;
            if ("number" === typeof h3) {
              if (w3)
                h3 = -h3;
              h3 = new l2(h3);
            } else
              h3 = new c2(h3, w3);
            if ("number" === typeof S3) {
              if (_3)
                S3 = -S3;
              S3 = new l2(S3);
            } else
              S3 = new c2(S3, _3);
            return [h3, S3];
          }
          c2.prototype.divmod = function(t5) {
            var e4 = C2(this, t5);
            return { quotient: e4[0], remainder: e4[1] };
          };
          f2.prototype.divmod = l2.prototype.divmod = c2.prototype.divmod;
          c2.prototype.divide = function(t5) {
            return C2(this, t5)[0];
          };
          f2.prototype.over = f2.prototype.divide = function(t5) {
            return new f2(this.value / st2(t5).value);
          };
          l2.prototype.over = l2.prototype.divide = c2.prototype.over = c2.prototype.divide;
          c2.prototype.mod = function(t5) {
            return C2(this, t5)[1];
          };
          f2.prototype.mod = f2.prototype.remainder = function(t5) {
            return new f2(this.value % st2(t5).value);
          };
          l2.prototype.remainder = l2.prototype.mod = c2.prototype.remainder = c2.prototype.mod;
          c2.prototype.pow = function(t5) {
            var e4 = st2(t5), r5 = this.value, i5 = e4.value, n3, s3, a3;
            if (0 === i5)
              return u2[1];
            if (0 === r5)
              return u2[0];
            if (1 === r5)
              return u2[1];
            if (-1 === r5)
              return e4.isEven() ? u2[1] : u2[-1];
            if (e4.sign)
              return u2[0];
            if (!e4.isSmall)
              throw new Error("The exponent " + e4.toString() + " is too large.");
            if (this.isSmall) {
              if (h2(n3 = Math.pow(r5, i5)))
                return new l2(y(n3));
            }
            s3 = this;
            a3 = u2[1];
            while (true) {
              if (i5 & true) {
                a3 = a3.times(s3);
                --i5;
              }
              if (0 === i5)
                break;
              i5 /= 2;
              s3 = s3.square();
            }
            return a3;
          };
          l2.prototype.pow = c2.prototype.pow;
          f2.prototype.pow = function(t5) {
            var e4 = st2(t5);
            var r5 = this.value, i5 = e4.value;
            var n3 = BigInt(0), s3 = BigInt(1), a3 = BigInt(2);
            if (i5 === n3)
              return u2[1];
            if (r5 === n3)
              return u2[0];
            if (r5 === s3)
              return u2[1];
            if (r5 === BigInt(-1))
              return e4.isEven() ? u2[1] : u2[-1];
            if (e4.isNegative())
              return new f2(n3);
            var o3 = this;
            var c3 = u2[1];
            while (true) {
              if ((i5 & s3) === s3) {
                c3 = c3.times(o3);
                --i5;
              }
              if (i5 === n3)
                break;
              i5 /= a3;
              o3 = o3.square();
            }
            return c3;
          };
          c2.prototype.modPow = function(t5, e4) {
            t5 = st2(t5);
            e4 = st2(e4);
            if (e4.isZero())
              throw new Error("Cannot take modPow with modulus 0");
            var r5 = u2[1], i5 = this.mod(e4);
            if (t5.isNegative()) {
              t5 = t5.multiply(u2[-1]);
              i5 = i5.modInv(e4);
            }
            while (t5.isPositive()) {
              if (i5.isZero())
                return u2[0];
              if (t5.isOdd())
                r5 = r5.multiply(i5).mod(e4);
              t5 = t5.divide(2);
              i5 = i5.square().mod(e4);
            }
            return r5;
          };
          f2.prototype.modPow = l2.prototype.modPow = c2.prototype.modPow;
          function N2(t5, e4) {
            if (t5.length !== e4.length)
              return t5.length > e4.length ? 1 : -1;
            for (var r5 = t5.length - 1; r5 >= 0; r5--)
              if (t5[r5] !== e4[r5])
                return t5[r5] > e4[r5] ? 1 : -1;
            return 0;
          }
          c2.prototype.compareAbs = function(t5) {
            var e4 = st2(t5), r5 = this.value, i5 = e4.value;
            if (e4.isSmall)
              return 1;
            return N2(r5, i5);
          };
          l2.prototype.compareAbs = function(t5) {
            var e4 = st2(t5), r5 = Math.abs(this.value), i5 = e4.value;
            if (e4.isSmall) {
              i5 = Math.abs(i5);
              return r5 === i5 ? 0 : r5 > i5 ? 1 : -1;
            }
            return -1;
          };
          f2.prototype.compareAbs = function(t5) {
            var e4 = this.value;
            var r5 = st2(t5).value;
            e4 = e4 >= 0 ? e4 : -e4;
            r5 = r5 >= 0 ? r5 : -r5;
            return e4 === r5 ? 0 : e4 > r5 ? 1 : -1;
          };
          c2.prototype.compare = function(t5) {
            if (t5 === 1 / 0)
              return -1;
            if (t5 === -1 / 0)
              return 1;
            var e4 = st2(t5), r5 = this.value, i5 = e4.value;
            if (this.sign !== e4.sign)
              return e4.sign ? 1 : -1;
            if (e4.isSmall)
              return this.sign ? -1 : 1;
            return N2(r5, i5) * (this.sign ? -1 : 1);
          };
          c2.prototype.compareTo = c2.prototype.compare;
          l2.prototype.compare = function(t5) {
            if (t5 === 1 / 0)
              return -1;
            if (t5 === -1 / 0)
              return 1;
            var e4 = st2(t5), r5 = this.value, i5 = e4.value;
            if (e4.isSmall)
              return r5 == i5 ? 0 : r5 > i5 ? 1 : -1;
            if (r5 < 0 !== e4.sign)
              return r5 < 0 ? -1 : 1;
            return r5 < 0 ? 1 : -1;
          };
          l2.prototype.compareTo = l2.prototype.compare;
          f2.prototype.compare = function(t5) {
            if (t5 === 1 / 0)
              return -1;
            if (t5 === -1 / 0)
              return 1;
            var e4 = this.value;
            var r5 = st2(t5).value;
            return e4 === r5 ? 0 : e4 > r5 ? 1 : -1;
          };
          f2.prototype.compareTo = f2.prototype.compare;
          c2.prototype.equals = function(t5) {
            return 0 === this.compare(t5);
          };
          f2.prototype.eq = f2.prototype.equals = l2.prototype.eq = l2.prototype.equals = c2.prototype.eq = c2.prototype.equals;
          c2.prototype.notEquals = function(t5) {
            return 0 !== this.compare(t5);
          };
          f2.prototype.neq = f2.prototype.notEquals = l2.prototype.neq = l2.prototype.notEquals = c2.prototype.neq = c2.prototype.notEquals;
          c2.prototype.greater = function(t5) {
            return this.compare(t5) > 0;
          };
          f2.prototype.gt = f2.prototype.greater = l2.prototype.gt = l2.prototype.greater = c2.prototype.gt = c2.prototype.greater;
          c2.prototype.lesser = function(t5) {
            return this.compare(t5) < 0;
          };
          f2.prototype.lt = f2.prototype.lesser = l2.prototype.lt = l2.prototype.lesser = c2.prototype.lt = c2.prototype.lesser;
          c2.prototype.greaterOrEquals = function(t5) {
            return this.compare(t5) >= 0;
          };
          f2.prototype.geq = f2.prototype.greaterOrEquals = l2.prototype.geq = l2.prototype.greaterOrEquals = c2.prototype.geq = c2.prototype.greaterOrEquals;
          c2.prototype.lesserOrEquals = function(t5) {
            return this.compare(t5) <= 0;
          };
          f2.prototype.leq = f2.prototype.lesserOrEquals = l2.prototype.leq = l2.prototype.lesserOrEquals = c2.prototype.leq = c2.prototype.lesserOrEquals;
          c2.prototype.isEven = function() {
            return 0 === (1 & this.value[0]);
          };
          l2.prototype.isEven = function() {
            return 0 === (1 & this.value);
          };
          f2.prototype.isEven = function() {
            return (this.value & BigInt(1)) === BigInt(0);
          };
          c2.prototype.isOdd = function() {
            return 1 === (1 & this.value[0]);
          };
          l2.prototype.isOdd = function() {
            return 1 === (1 & this.value);
          };
          f2.prototype.isOdd = function() {
            return (this.value & BigInt(1)) === BigInt(1);
          };
          c2.prototype.isPositive = function() {
            return !this.sign;
          };
          l2.prototype.isPositive = function() {
            return this.value > 0;
          };
          f2.prototype.isPositive = l2.prototype.isPositive;
          c2.prototype.isNegative = function() {
            return this.sign;
          };
          l2.prototype.isNegative = function() {
            return this.value < 0;
          };
          f2.prototype.isNegative = l2.prototype.isNegative;
          c2.prototype.isUnit = function() {
            return false;
          };
          l2.prototype.isUnit = function() {
            return 1 === Math.abs(this.value);
          };
          f2.prototype.isUnit = function() {
            return this.abs().value === BigInt(1);
          };
          c2.prototype.isZero = function() {
            return false;
          };
          l2.prototype.isZero = function() {
            return 0 === this.value;
          };
          f2.prototype.isZero = function() {
            return this.value === BigInt(0);
          };
          c2.prototype.isDivisibleBy = function(t5) {
            var e4 = st2(t5);
            if (e4.isZero())
              return false;
            if (e4.isUnit())
              return true;
            if (0 === e4.compareAbs(2))
              return this.isEven();
            return this.mod(e4).isZero();
          };
          f2.prototype.isDivisibleBy = l2.prototype.isDivisibleBy = c2.prototype.isDivisibleBy;
          function P2(t5) {
            var e4 = t5.abs();
            if (e4.isUnit())
              return false;
            if (e4.equals(2) || e4.equals(3) || e4.equals(5))
              return true;
            if (e4.isEven() || e4.isDivisibleBy(3) || e4.isDivisibleBy(5))
              return false;
            if (e4.lesser(49))
              return true;
          }
          function V2(t5, e4) {
            var r5 = t5.prev(), i5 = r5, s3 = 0, a3, u3, c3;
            while (i5.isEven())
              i5 = i5.divide(2), s3++;
            t:
              for (u3 = 0; u3 < e4.length; u3++) {
                if (t5.lesser(e4[u3]))
                  continue;
                c3 = n2(e4[u3]).modPow(i5, t5);
                if (c3.isUnit() || c3.equals(r5))
                  continue;
                for (a3 = s3 - 1; 0 != a3; a3--) {
                  c3 = c3.square().mod(t5);
                  if (c3.isUnit())
                    return false;
                  if (c3.equals(r5))
                    continue t;
                }
                return false;
              }
            return true;
          }
          c2.prototype.isPrime = function(e4) {
            var r5 = P2(this);
            if (r5 !== t4)
              return r5;
            var i5 = this.abs();
            var s3 = i5.bitLength();
            if (s3 <= 64)
              return V2(i5, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
            var a3 = Math.log(2) * s3.toJSNumber();
            var o3 = Math.ceil(true === e4 ? 2 * Math.pow(a3, 2) : a3);
            for (var u3 = [], c3 = 0; c3 < o3; c3++)
              u3.push(n2(c3 + 2));
            return V2(i5, u3);
          };
          f2.prototype.isPrime = l2.prototype.isPrime = c2.prototype.isPrime;
          c2.prototype.isProbablePrime = function(e4, r5) {
            var i5 = P2(this);
            if (i5 !== t4)
              return i5;
            var s3 = this.abs();
            var a3 = e4 === t4 ? 5 : e4;
            for (var o3 = [], u3 = 0; u3 < a3; u3++)
              o3.push(n2.randBetween(2, s3.minus(2), r5));
            return V2(s3, o3);
          };
          f2.prototype.isProbablePrime = l2.prototype.isProbablePrime = c2.prototype.isProbablePrime;
          c2.prototype.modInv = function(t5) {
            var e4 = n2.zero, r5 = n2.one, i5 = st2(t5), s3 = this.abs(), a3, o3, u3;
            while (!s3.isZero()) {
              a3 = i5.divide(s3);
              o3 = e4;
              u3 = i5;
              e4 = r5;
              i5 = s3;
              r5 = o3.subtract(a3.multiply(r5));
              s3 = u3.subtract(a3.multiply(s3));
            }
            if (!i5.isUnit())
              throw new Error(this.toString() + " and " + t5.toString() + " are not co-prime");
            if (-1 === e4.compare(0))
              e4 = e4.add(t5);
            if (this.isNegative())
              return e4.negate();
            return e4;
          };
          f2.prototype.modInv = l2.prototype.modInv = c2.prototype.modInv;
          c2.prototype.next = function() {
            var t5 = this.value;
            if (this.sign)
              return E2(t5, 1, this.sign);
            return new c2(S2(t5, 1), this.sign);
          };
          l2.prototype.next = function() {
            var t5 = this.value;
            if (t5 + 1 < i4)
              return new l2(t5 + 1);
            return new c2(s2, false);
          };
          f2.prototype.next = function() {
            return new f2(this.value + BigInt(1));
          };
          c2.prototype.prev = function() {
            var t5 = this.value;
            if (this.sign)
              return new c2(S2(t5, 1), true);
            return E2(t5, 1, this.sign);
          };
          l2.prototype.prev = function() {
            var t5 = this.value;
            if (t5 - 1 > -i4)
              return new l2(t5 - 1);
            return new c2(s2, true);
          };
          f2.prototype.prev = function() {
            return new f2(this.value - BigInt(1));
          };
          var L2 = [1];
          while (2 * L2[L2.length - 1] <= e3)
            L2.push(2 * L2[L2.length - 1]);
          var H2 = L2.length, K2 = L2[H2 - 1];
          function U2(t5) {
            return Math.abs(t5) <= e3;
          }
          c2.prototype.shiftLeft = function(t5) {
            var e4 = st2(t5).toJSNumber();
            if (!U2(e4))
              throw new Error(String(e4) + " is too large for shifting.");
            if (e4 < 0)
              return this.shiftRight(-e4);
            var r5 = this;
            if (r5.isZero())
              return r5;
            while (e4 >= H2) {
              r5 = r5.multiply(K2);
              e4 -= H2 - 1;
            }
            return r5.multiply(L2[e4]);
          };
          f2.prototype.shiftLeft = l2.prototype.shiftLeft = c2.prototype.shiftLeft;
          c2.prototype.shiftRight = function(t5) {
            var e4;
            var r5 = st2(t5).toJSNumber();
            if (!U2(r5))
              throw new Error(String(r5) + " is too large for shifting.");
            if (r5 < 0)
              return this.shiftLeft(-r5);
            var i5 = this;
            while (r5 >= H2) {
              if (i5.isZero() || i5.isNegative() && i5.isUnit())
                return i5;
              e4 = C2(i5, K2);
              i5 = e4[1].isNegative() ? e4[0].prev() : e4[0];
              r5 -= H2 - 1;
            }
            e4 = C2(i5, L2[r5]);
            return e4[1].isNegative() ? e4[0].prev() : e4[0];
          };
          f2.prototype.shiftRight = l2.prototype.shiftRight = c2.prototype.shiftRight;
          function j2(t5, e4, r5) {
            e4 = st2(e4);
            var i5 = t5.isNegative(), s3 = e4.isNegative();
            var a3 = i5 ? t5.not() : t5, o3 = s3 ? e4.not() : e4;
            var u3 = 0, c3 = 0;
            var l3 = null, f3 = null;
            var h3 = [];
            while (!a3.isZero() || !o3.isZero()) {
              l3 = C2(a3, K2);
              u3 = l3[1].toJSNumber();
              if (i5)
                u3 = K2 - 1 - u3;
              f3 = C2(o3, K2);
              c3 = f3[1].toJSNumber();
              if (s3)
                c3 = K2 - 1 - c3;
              a3 = l3[0];
              o3 = f3[0];
              h3.push(r5(u3, c3));
            }
            var d3 = 0 !== r5(i5 ? 1 : 0, s3 ? 1 : 0) ? n2(-1) : n2(0);
            for (var p3 = h3.length - 1; p3 >= 0; p3 -= 1)
              d3 = d3.multiply(K2).add(n2(h3[p3]));
            return d3;
          }
          c2.prototype.not = function() {
            return this.negate().prev();
          };
          f2.prototype.not = l2.prototype.not = c2.prototype.not;
          c2.prototype.and = function(t5) {
            return j2(this, t5, function(t6, e4) {
              return t6 & e4;
            });
          };
          f2.prototype.and = l2.prototype.and = c2.prototype.and;
          c2.prototype.or = function(t5) {
            return j2(this, t5, function(t6, e4) {
              return t6 | e4;
            });
          };
          f2.prototype.or = l2.prototype.or = c2.prototype.or;
          c2.prototype.xor = function(t5) {
            return j2(this, t5, function(t6, e4) {
              return t6 ^ e4;
            });
          };
          f2.prototype.xor = l2.prototype.xor = c2.prototype.xor;
          var q2 = 1 << 30, F2 = (e3 & -e3) * (e3 & -e3) | q2;
          function z2(t5) {
            var r5 = t5.value, i5 = "number" === typeof r5 ? r5 | q2 : "bigint" === typeof r5 ? r5 | BigInt(q2) : r5[0] + r5[1] * e3 | F2;
            return i5 & -i5;
          }
          function G2(t5, e4) {
            if (e4.compareTo(t5) <= 0) {
              var r5 = G2(t5, e4.square(e4));
              var i5 = r5.p;
              var s3 = r5.e;
              var a3 = i5.multiply(e4);
              return a3.compareTo(t5) <= 0 ? { p: a3, e: 2 * s3 + 1 } : { p: i5, e: 2 * s3 };
            }
            return { p: n2(1), e: 0 };
          }
          c2.prototype.bitLength = function() {
            var t5 = this;
            if (t5.compareTo(n2(0)) < 0)
              t5 = t5.negate().subtract(n2(1));
            if (0 === t5.compareTo(n2(0)))
              return n2(0);
            return n2(G2(t5, n2(2)).e).add(n2(1));
          };
          f2.prototype.bitLength = l2.prototype.bitLength = c2.prototype.bitLength;
          function Y2(t5, e4) {
            t5 = st2(t5);
            e4 = st2(e4);
            return t5.greater(e4) ? t5 : e4;
          }
          function W2(t5, e4) {
            t5 = st2(t5);
            e4 = st2(e4);
            return t5.lesser(e4) ? t5 : e4;
          }
          function J2(t5, e4) {
            t5 = st2(t5).abs();
            e4 = st2(e4).abs();
            if (t5.equals(e4))
              return t5;
            if (t5.isZero())
              return e4;
            if (e4.isZero())
              return t5;
            var r5 = u2[1], i5, n3;
            while (t5.isEven() && e4.isEven()) {
              i5 = W2(z2(t5), z2(e4));
              t5 = t5.divide(i5);
              e4 = e4.divide(i5);
              r5 = r5.multiply(i5);
            }
            while (t5.isEven())
              t5 = t5.divide(z2(t5));
            do {
              while (e4.isEven())
                e4 = e4.divide(z2(e4));
              if (t5.greater(e4)) {
                n3 = e4;
                e4 = t5;
                t5 = n3;
              }
              e4 = e4.subtract(t5);
            } while (!e4.isZero());
            return r5.isUnit() ? t5 : t5.multiply(r5);
          }
          function Z2(t5, e4) {
            t5 = st2(t5).abs();
            e4 = st2(e4).abs();
            return t5.divide(J2(t5, e4)).multiply(e4);
          }
          function $2(t5, r5, i5) {
            t5 = st2(t5);
            r5 = st2(r5);
            var n3 = i5 || Math.random;
            var s3 = W2(t5, r5), a3 = Y2(t5, r5);
            var o3 = a3.subtract(s3).add(1);
            if (o3.isSmall)
              return s3.add(Math.floor(n3() * o3));
            var c3 = et2(o3, e3).value;
            var l3 = [], f3 = true;
            for (var h3 = 0; h3 < c3.length; h3++) {
              var d3 = f3 ? c3[h3] + (h3 + 1 < c3.length ? c3[h3 + 1] / e3 : 0) : e3;
              var p3 = y(n3() * d3);
              l3.push(p3);
              if (p3 < c3[h3])
                f3 = false;
            }
            return s3.add(u2.fromArray(l3, e3, false));
          }
          var X2 = function(t5, e4, r5, i5) {
            r5 = r5 || a2;
            t5 = String(t5);
            if (!i5) {
              t5 = t5.toLowerCase();
              r5 = r5.toLowerCase();
            }
            var n3 = t5.length;
            var s3;
            var o3 = Math.abs(e4);
            var u3 = {};
            for (s3 = 0; s3 < r5.length; s3++)
              u3[r5[s3]] = s3;
            for (s3 = 0; s3 < n3; s3++) {
              var c3 = t5[s3];
              if ("-" === c3)
                continue;
              if (c3 in u3) {
                if (u3[c3] >= o3) {
                  if ("1" === c3 && 1 === o3)
                    continue;
                  throw new Error(c3 + " is not a valid digit in base " + e4 + ".");
                }
              }
            }
            e4 = st2(e4);
            var l3 = [];
            var f3 = "-" === t5[0];
            for (s3 = f3 ? 1 : 0; s3 < t5.length; s3++) {
              var c3 = t5[s3];
              if (c3 in u3)
                l3.push(st2(u3[c3]));
              else if ("<" === c3) {
                var h3 = s3;
                do {
                  s3++;
                } while (">" !== t5[s3] && s3 < t5.length);
                l3.push(st2(t5.slice(h3 + 1, s3)));
              } else
                throw new Error(c3 + " is not a valid character");
            }
            return Q2(l3, e4, f3);
          };
          function Q2(t5, e4, r5) {
            var i5 = u2[0], n3 = u2[1], s3;
            for (s3 = t5.length - 1; s3 >= 0; s3--) {
              i5 = i5.add(t5[s3].times(n3));
              n3 = n3.times(e4);
            }
            return r5 ? i5.negate() : i5;
          }
          function tt2(t5, e4) {
            e4 = e4 || a2;
            if (t5 < e4.length)
              return e4[t5];
            return "<" + t5 + ">";
          }
          function et2(t5, e4) {
            e4 = n2(e4);
            if (e4.isZero()) {
              if (t5.isZero())
                return { value: [0], isNegative: false };
              throw new Error("Cannot convert nonzero numbers to base 0.");
            }
            if (e4.equals(-1)) {
              if (t5.isZero())
                return { value: [0], isNegative: false };
              if (t5.isNegative())
                return { value: [].concat.apply([], Array.apply(null, Array(-t5.toJSNumber())).map(Array.prototype.valueOf, [1, 0])), isNegative: false };
              var r5 = Array.apply(null, Array(t5.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
              r5.unshift([1]);
              return { value: [].concat.apply([], r5), isNegative: false };
            }
            var i5 = false;
            if (t5.isNegative() && e4.isPositive()) {
              i5 = true;
              t5 = t5.abs();
            }
            if (e4.isUnit()) {
              if (t5.isZero())
                return { value: [0], isNegative: false };
              return { value: Array.apply(null, Array(t5.toJSNumber())).map(Number.prototype.valueOf, 1), isNegative: i5 };
            }
            var s3 = [];
            var a3 = t5, o3;
            while (a3.isNegative() || a3.compareAbs(e4) >= 0) {
              o3 = a3.divmod(e4);
              a3 = o3.quotient;
              var u3 = o3.remainder;
              if (u3.isNegative()) {
                u3 = e4.minus(u3).abs();
                a3 = a3.next();
              }
              s3.push(u3.toJSNumber());
            }
            s3.push(a3.toJSNumber());
            return { value: s3.reverse(), isNegative: i5 };
          }
          function rt2(t5, e4, r5) {
            var i5 = et2(t5, e4);
            return (i5.isNegative ? "-" : "") + i5.value.map(function(t6) {
              return tt2(t6, r5);
            }).join("");
          }
          c2.prototype.toArray = function(t5) {
            return et2(this, t5);
          };
          l2.prototype.toArray = function(t5) {
            return et2(this, t5);
          };
          f2.prototype.toArray = function(t5) {
            return et2(this, t5);
          };
          c2.prototype.toString = function(e4, r5) {
            if (e4 === t4)
              e4 = 10;
            if (10 !== e4)
              return rt2(this, e4, r5);
            var i5 = this.value, n3 = i5.length, s3 = String(i5[--n3]), a3 = "0000000", o3;
            while (--n3 >= 0) {
              o3 = String(i5[n3]);
              s3 += a3.slice(o3.length) + o3;
            }
            var u3 = this.sign ? "-" : "";
            return u3 + s3;
          };
          l2.prototype.toString = function(e4, r5) {
            if (e4 === t4)
              e4 = 10;
            if (10 != e4)
              return rt2(this, e4, r5);
            return String(this.value);
          };
          f2.prototype.toString = l2.prototype.toString;
          f2.prototype.toJSON = c2.prototype.toJSON = l2.prototype.toJSON = function() {
            return this.toString();
          };
          c2.prototype.valueOf = function() {
            return parseInt(this.toString(), 10);
          };
          c2.prototype.toJSNumber = c2.prototype.valueOf;
          l2.prototype.valueOf = function() {
            return this.value;
          };
          l2.prototype.toJSNumber = l2.prototype.valueOf;
          f2.prototype.valueOf = f2.prototype.toJSNumber = function() {
            return parseInt(this.toString(), 10);
          };
          function it2(t5) {
            if (h2(+t5)) {
              var e4 = +t5;
              if (e4 === y(e4))
                return o2 ? new f2(BigInt(e4)) : new l2(e4);
              throw new Error("Invalid integer: " + t5);
            }
            var i5 = "-" === t5[0];
            if (i5)
              t5 = t5.slice(1);
            var n3 = t5.split(/e/i);
            if (n3.length > 2)
              throw new Error("Invalid integer: " + n3.join("e"));
            if (2 === n3.length) {
              var s3 = n3[1];
              if ("+" === s3[0])
                s3 = s3.slice(1);
              s3 = +s3;
              if (s3 !== y(s3) || !h2(s3))
                throw new Error("Invalid integer: " + s3 + " is not a valid exponent.");
              var a3 = n3[0];
              var u3 = a3.indexOf(".");
              if (u3 >= 0) {
                s3 -= a3.length - u3 - 1;
                a3 = a3.slice(0, u3) + a3.slice(u3 + 1);
              }
              if (s3 < 0)
                throw new Error("Cannot include negative exponent part for integers");
              a3 += new Array(s3 + 1).join("0");
              t5 = a3;
            }
            var d3 = /^([0-9][0-9]*)$/.test(t5);
            if (!d3)
              throw new Error("Invalid integer: " + t5);
            if (o2)
              return new f2(BigInt(i5 ? "-" + t5 : t5));
            var p3 = [], g3 = t5.length, m3 = r4, w3 = g3 - m3;
            while (g3 > 0) {
              p3.push(+t5.slice(w3, g3));
              w3 -= m3;
              if (w3 < 0)
                w3 = 0;
              g3 -= m3;
            }
            v2(p3);
            return new c2(p3, i5);
          }
          function nt2(t5) {
            if (o2)
              return new f2(BigInt(t5));
            if (h2(t5)) {
              if (t5 !== y(t5))
                throw new Error(t5 + " is not an integer.");
              return new l2(t5);
            }
            return it2(t5.toString());
          }
          function st2(t5) {
            if ("number" === typeof t5)
              return nt2(t5);
            if ("string" === typeof t5)
              return it2(t5);
            if ("bigint" === typeof t5)
              return new f2(t5);
            return t5;
          }
          for (var at2 = 0; at2 < 1e3; at2++) {
            u2[at2] = st2(at2);
            if (at2 > 0)
              u2[-at2] = st2(-at2);
          }
          u2.one = u2[1];
          u2.zero = u2[0];
          u2.minusOne = u2[-1];
          u2.max = Y2;
          u2.min = W2;
          u2.gcd = J2;
          u2.lcm = Z2;
          u2.isInstance = function(t5) {
            return t5 instanceof c2 || t5 instanceof l2 || t5 instanceof f2;
          };
          u2.randBetween = $2;
          u2.fromArray = function(t5, e4, r5) {
            return Q2(t5.map(st2), st2(e4 || 10), r5);
          };
          return u2;
        }();
        if (t3.hasOwnProperty("exports"))
          t3.exports = n2;
        i3 = function() {
          return n2;
        }.call(e2, r3, e2, t3), void 0 !== i3 && (t3.exports = i3);
      }, 452: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(8269), r3(8214), r3(888), r3(5109));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.BlockCipher;
            var n2 = e3.algo;
            var s2 = [];
            var a2 = [];
            var o2 = [];
            var u2 = [];
            var c2 = [];
            var l2 = [];
            var f2 = [];
            var h2 = [];
            var d2 = [];
            var p2 = [];
            (function() {
              var t5 = [];
              for (var e4 = 0; e4 < 256; e4++)
                if (e4 < 128)
                  t5[e4] = e4 << 1;
                else
                  t5[e4] = e4 << 1 ^ 283;
              var r5 = 0;
              var i4 = 0;
              for (var e4 = 0; e4 < 256; e4++) {
                var n3 = i4 ^ i4 << 1 ^ i4 << 2 ^ i4 << 3 ^ i4 << 4;
                n3 = n3 >>> 8 ^ 255 & n3 ^ 99;
                s2[r5] = n3;
                a2[n3] = r5;
                var v3 = t5[r5];
                var g3 = t5[v3];
                var y = t5[g3];
                var m2 = 257 * t5[n3] ^ 16843008 * n3;
                o2[r5] = m2 << 24 | m2 >>> 8;
                u2[r5] = m2 << 16 | m2 >>> 16;
                c2[r5] = m2 << 8 | m2 >>> 24;
                l2[r5] = m2;
                var m2 = 16843009 * y ^ 65537 * g3 ^ 257 * v3 ^ 16843008 * r5;
                f2[n3] = m2 << 24 | m2 >>> 8;
                h2[n3] = m2 << 16 | m2 >>> 16;
                d2[n3] = m2 << 8 | m2 >>> 24;
                p2[n3] = m2;
                if (!r5)
                  r5 = i4 = 1;
                else {
                  r5 = v3 ^ t5[t5[t5[y ^ v3]]];
                  i4 ^= t5[t5[i4]];
                }
              }
            })();
            var v2 = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
            var g2 = n2.AES = i3.extend({ _doReset: function() {
              var t5;
              if (this._nRounds && this._keyPriorReset === this._key)
                return;
              var e4 = this._keyPriorReset = this._key;
              var r5 = e4.words;
              var i4 = e4.sigBytes / 4;
              var n3 = this._nRounds = i4 + 6;
              var a3 = 4 * (n3 + 1);
              var o3 = this._keySchedule = [];
              for (var u3 = 0; u3 < a3; u3++)
                if (u3 < i4)
                  o3[u3] = r5[u3];
                else {
                  t5 = o3[u3 - 1];
                  if (!(u3 % i4)) {
                    t5 = t5 << 8 | t5 >>> 24;
                    t5 = s2[t5 >>> 24] << 24 | s2[t5 >>> 16 & 255] << 16 | s2[t5 >>> 8 & 255] << 8 | s2[255 & t5];
                    t5 ^= v2[u3 / i4 | 0] << 24;
                  } else if (i4 > 6 && u3 % i4 == 4)
                    t5 = s2[t5 >>> 24] << 24 | s2[t5 >>> 16 & 255] << 16 | s2[t5 >>> 8 & 255] << 8 | s2[255 & t5];
                  o3[u3] = o3[u3 - i4] ^ t5;
                }
              var c3 = this._invKeySchedule = [];
              for (var l3 = 0; l3 < a3; l3++) {
                var u3 = a3 - l3;
                if (l3 % 4)
                  var t5 = o3[u3];
                else
                  var t5 = o3[u3 - 4];
                if (l3 < 4 || u3 <= 4)
                  c3[l3] = t5;
                else
                  c3[l3] = f2[s2[t5 >>> 24]] ^ h2[s2[t5 >>> 16 & 255]] ^ d2[s2[t5 >>> 8 & 255]] ^ p2[s2[255 & t5]];
              }
            }, encryptBlock: function(t5, e4) {
              this._doCryptBlock(t5, e4, this._keySchedule, o2, u2, c2, l2, s2);
            }, decryptBlock: function(t5, e4) {
              var r5 = t5[e4 + 1];
              t5[e4 + 1] = t5[e4 + 3];
              t5[e4 + 3] = r5;
              this._doCryptBlock(t5, e4, this._invKeySchedule, f2, h2, d2, p2, a2);
              var r5 = t5[e4 + 1];
              t5[e4 + 1] = t5[e4 + 3];
              t5[e4 + 3] = r5;
            }, _doCryptBlock: function(t5, e4, r5, i4, n3, s3, a3, o3) {
              var u3 = this._nRounds;
              var c3 = t5[e4] ^ r5[0];
              var l3 = t5[e4 + 1] ^ r5[1];
              var f3 = t5[e4 + 2] ^ r5[2];
              var h3 = t5[e4 + 3] ^ r5[3];
              var d3 = 4;
              for (var p3 = 1; p3 < u3; p3++) {
                var v3 = i4[c3 >>> 24] ^ n3[l3 >>> 16 & 255] ^ s3[f3 >>> 8 & 255] ^ a3[255 & h3] ^ r5[d3++];
                var g3 = i4[l3 >>> 24] ^ n3[f3 >>> 16 & 255] ^ s3[h3 >>> 8 & 255] ^ a3[255 & c3] ^ r5[d3++];
                var y = i4[f3 >>> 24] ^ n3[h3 >>> 16 & 255] ^ s3[c3 >>> 8 & 255] ^ a3[255 & l3] ^ r5[d3++];
                var m2 = i4[h3 >>> 24] ^ n3[c3 >>> 16 & 255] ^ s3[l3 >>> 8 & 255] ^ a3[255 & f3] ^ r5[d3++];
                c3 = v3;
                l3 = g3;
                f3 = y;
                h3 = m2;
              }
              var v3 = (o3[c3 >>> 24] << 24 | o3[l3 >>> 16 & 255] << 16 | o3[f3 >>> 8 & 255] << 8 | o3[255 & h3]) ^ r5[d3++];
              var g3 = (o3[l3 >>> 24] << 24 | o3[f3 >>> 16 & 255] << 16 | o3[h3 >>> 8 & 255] << 8 | o3[255 & c3]) ^ r5[d3++];
              var y = (o3[f3 >>> 24] << 24 | o3[h3 >>> 16 & 255] << 16 | o3[c3 >>> 8 & 255] << 8 | o3[255 & l3]) ^ r5[d3++];
              var m2 = (o3[h3 >>> 24] << 24 | o3[c3 >>> 16 & 255] << 16 | o3[l3 >>> 8 & 255] << 8 | o3[255 & f3]) ^ r5[d3++];
              t5[e4] = v3;
              t5[e4 + 1] = g3;
              t5[e4 + 2] = y;
              t5[e4 + 3] = m2;
            }, keySize: 256 / 32 });
            e3.AES = i3._createHelper(g2);
          })();
          return t4.AES;
        });
      }, 5109: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(888));
        })(this, function(t4) {
          t4.lib.Cipher || function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.Base;
            var s2 = i3.WordArray;
            var a2 = i3.BufferedBlockAlgorithm;
            var o2 = r4.enc;
            o2.Utf8;
            var c2 = o2.Base64;
            var l2 = r4.algo;
            var f2 = l2.EvpKDF;
            var h2 = i3.Cipher = a2.extend({ cfg: n2.extend(), createEncryptor: function(t5, e4) {
              return this.create(this._ENC_XFORM_MODE, t5, e4);
            }, createDecryptor: function(t5, e4) {
              return this.create(this._DEC_XFORM_MODE, t5, e4);
            }, init: function(t5, e4, r5) {
              this.cfg = this.cfg.extend(r5);
              this._xformMode = t5;
              this._key = e4;
              this.reset();
            }, reset: function() {
              a2.reset.call(this);
              this._doReset();
            }, process: function(t5) {
              this._append(t5);
              return this._process();
            }, finalize: function(t5) {
              if (t5)
                this._append(t5);
              var e4 = this._doFinalize();
              return e4;
            }, keySize: 128 / 32, ivSize: 128 / 32, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function() {
              function t5(t6) {
                if ("string" == typeof t6)
                  return T2;
                else
                  return E2;
              }
              return function(e4) {
                return { encrypt: function(r5, i4, n3) {
                  return t5(i4).encrypt(e4, r5, i4, n3);
                }, decrypt: function(r5, i4, n3) {
                  return t5(i4).decrypt(e4, r5, i4, n3);
                } };
              };
            }() });
            i3.StreamCipher = h2.extend({ _doFinalize: function() {
              var t5 = this._process(true);
              return t5;
            }, blockSize: 1 });
            var p2 = r4.mode = {};
            var v2 = i3.BlockCipherMode = n2.extend({ createEncryptor: function(t5, e4) {
              return this.Encryptor.create(t5, e4);
            }, createDecryptor: function(t5, e4) {
              return this.Decryptor.create(t5, e4);
            }, init: function(t5, e4) {
              this._cipher = t5;
              this._iv = e4;
            } });
            var g2 = p2.CBC = function() {
              var t5 = v2.extend();
              t5.Encryptor = t5.extend({ processBlock: function(t6, e4) {
                var i4 = this._cipher;
                var n3 = i4.blockSize;
                r5.call(this, t6, e4, n3);
                i4.encryptBlock(t6, e4);
                this._prevBlock = t6.slice(e4, e4 + n3);
              } });
              t5.Decryptor = t5.extend({ processBlock: function(t6, e4) {
                var i4 = this._cipher;
                var n3 = i4.blockSize;
                var s3 = t6.slice(e4, e4 + n3);
                i4.decryptBlock(t6, e4);
                r5.call(this, t6, e4, n3);
                this._prevBlock = s3;
              } });
              function r5(t6, r6, i4) {
                var n3;
                var s3 = this._iv;
                if (s3) {
                  n3 = s3;
                  this._iv = e3;
                } else
                  n3 = this._prevBlock;
                for (var a3 = 0; a3 < i4; a3++)
                  t6[r6 + a3] ^= n3[a3];
              }
              return t5;
            }();
            var y = r4.pad = {};
            var m2 = y.Pkcs7 = { pad: function(t5, e4) {
              var r5 = 4 * e4;
              var i4 = r5 - t5.sigBytes % r5;
              var n3 = i4 << 24 | i4 << 16 | i4 << 8 | i4;
              var a3 = [];
              for (var o3 = 0; o3 < i4; o3 += 4)
                a3.push(n3);
              var u2 = s2.create(a3, i4);
              t5.concat(u2);
            }, unpad: function(t5) {
              var e4 = 255 & t5.words[t5.sigBytes - 1 >>> 2];
              t5.sigBytes -= e4;
            } };
            i3.BlockCipher = h2.extend({ cfg: h2.cfg.extend({ mode: g2, padding: m2 }), reset: function() {
              var t5;
              h2.reset.call(this);
              var e4 = this.cfg;
              var r5 = e4.iv;
              var i4 = e4.mode;
              if (this._xformMode == this._ENC_XFORM_MODE)
                t5 = i4.createEncryptor;
              else {
                t5 = i4.createDecryptor;
                this._minBufferSize = 1;
              }
              if (this._mode && this._mode.__creator == t5)
                this._mode.init(this, r5 && r5.words);
              else {
                this._mode = t5.call(i4, this, r5 && r5.words);
                this._mode.__creator = t5;
              }
            }, _doProcessBlock: function(t5, e4) {
              this._mode.processBlock(t5, e4);
            }, _doFinalize: function() {
              var t5;
              var e4 = this.cfg.padding;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                e4.pad(this._data, this.blockSize);
                t5 = this._process(true);
              } else {
                t5 = this._process(true);
                e4.unpad(t5);
              }
              return t5;
            }, blockSize: 128 / 32 });
            var S2 = i3.CipherParams = n2.extend({ init: function(t5) {
              this.mixIn(t5);
            }, toString: function(t5) {
              return (t5 || this.formatter).stringify(this);
            } });
            var _2 = r4.format = {};
            var b2 = _2.OpenSSL = { stringify: function(t5) {
              var e4;
              var r5 = t5.ciphertext;
              var i4 = t5.salt;
              if (i4)
                e4 = s2.create([1398893684, 1701076831]).concat(i4).concat(r5);
              else
                e4 = r5;
              return e4.toString(c2);
            }, parse: function(t5) {
              var e4;
              var r5 = c2.parse(t5);
              var i4 = r5.words;
              if (1398893684 == i4[0] && 1701076831 == i4[1]) {
                e4 = s2.create(i4.slice(2, 4));
                i4.splice(0, 4);
                r5.sigBytes -= 16;
              }
              return S2.create({ ciphertext: r5, salt: e4 });
            } };
            var E2 = i3.SerializableCipher = n2.extend({ cfg: n2.extend({ format: b2 }), encrypt: function(t5, e4, r5, i4) {
              i4 = this.cfg.extend(i4);
              var n3 = t5.createEncryptor(r5, i4);
              var s3 = n3.finalize(e4);
              var a3 = n3.cfg;
              return S2.create({ ciphertext: s3, key: r5, iv: a3.iv, algorithm: t5, mode: a3.mode, padding: a3.padding, blockSize: t5.blockSize, formatter: i4.format });
            }, decrypt: function(t5, e4, r5, i4) {
              i4 = this.cfg.extend(i4);
              e4 = this._parse(e4, i4.format);
              var n3 = t5.createDecryptor(r5, i4).finalize(e4.ciphertext);
              return n3;
            }, _parse: function(t5, e4) {
              if ("string" == typeof t5)
                return e4.parse(t5, this);
              else
                return t5;
            } });
            var D2 = r4.kdf = {};
            var M2 = D2.OpenSSL = { execute: function(t5, e4, r5, i4) {
              if (!i4)
                i4 = s2.random(64 / 8);
              var n3 = f2.create({ keySize: e4 + r5 }).compute(t5, i4);
              var a3 = s2.create(n3.words.slice(e4), 4 * r5);
              n3.sigBytes = 4 * e4;
              return S2.create({ key: n3, iv: a3, salt: i4 });
            } };
            var T2 = i3.PasswordBasedCipher = E2.extend({ cfg: E2.cfg.extend({ kdf: M2 }), encrypt: function(t5, e4, r5, i4) {
              i4 = this.cfg.extend(i4);
              var n3 = i4.kdf.execute(r5, t5.keySize, t5.ivSize);
              i4.iv = n3.iv;
              var s3 = E2.encrypt.call(this, t5, e4, n3.key, i4);
              s3.mixIn(n3);
              return s3;
            }, decrypt: function(t5, e4, r5, i4) {
              i4 = this.cfg.extend(i4);
              e4 = this._parse(e4, i4.format);
              var n3 = i4.kdf.execute(r5, t5.keySize, t5.ivSize, e4.salt);
              i4.iv = n3.iv;
              var s3 = E2.decrypt.call(this, t5, e4, n3.key, i4);
              return s3;
            } });
          }();
        });
      }, 8249: function(t3, e2, r3) {
        (function(r4, i3) {
          t3.exports = i3();
        })(this, function() {
          var t4 = t4 || function(t5, e3) {
            var i3;
            if ("undefined" !== typeof window && $inject_window_crypto)
              i3 = $inject_window_crypto;
            if ("undefined" !== typeof self && self.crypto)
              i3 = self.crypto;
            if ("undefined" !== typeof globalThis && globalThis.crypto)
              i3 = globalThis.crypto;
            if (!i3 && "undefined" !== typeof window && window.msCrypto)
              i3 = window.msCrypto;
            if (!i3 && "undefined" !== typeof r3.g && r3.g.crypto)
              i3 = r3.g.crypto;
            if (!i3 && true)
              try {
                i3 = r3(2480);
              } catch (t6) {
              }
            var n2 = function() {
              if (i3) {
                if ("function" === typeof i3.getRandomValues)
                  try {
                    return i3.getRandomValues(new Uint32Array(1))[0];
                  } catch (t6) {
                  }
                if ("function" === typeof i3.randomBytes)
                  try {
                    return i3.randomBytes(4).readInt32LE();
                  } catch (t6) {
                  }
              }
              throw new Error("Native crypto module could not be used to get secure random number.");
            };
            var s2 = Object.create || function() {
              function t6() {
              }
              return function(e4) {
                var r4;
                t6.prototype = e4;
                r4 = new t6();
                t6.prototype = null;
                return r4;
              };
            }();
            var a2 = {};
            var o2 = a2.lib = {};
            var u2 = o2.Base = function() {
              return { extend: function(t6) {
                var e4 = s2(this);
                if (t6)
                  e4.mixIn(t6);
                if (!e4.hasOwnProperty("init") || this.init === e4.init)
                  e4.init = function() {
                    e4.$super.init.apply(this, arguments);
                  };
                e4.init.prototype = e4;
                e4.$super = this;
                return e4;
              }, create: function() {
                var t6 = this.extend();
                t6.init.apply(t6, arguments);
                return t6;
              }, init: function() {
              }, mixIn: function(t6) {
                for (var e4 in t6)
                  if (t6.hasOwnProperty(e4))
                    this[e4] = t6[e4];
                if (t6.hasOwnProperty("toString"))
                  this.toString = t6.toString;
              }, clone: function() {
                return this.init.prototype.extend(this);
              } };
            }();
            var c2 = o2.WordArray = u2.extend({ init: function(t6, r4) {
              t6 = this.words = t6 || [];
              if (r4 != e3)
                this.sigBytes = r4;
              else
                this.sigBytes = 4 * t6.length;
            }, toString: function(t6) {
              return (t6 || f2).stringify(this);
            }, concat: function(t6) {
              var e4 = this.words;
              var r4 = t6.words;
              var i4 = this.sigBytes;
              var n3 = t6.sigBytes;
              this.clamp();
              if (i4 % 4)
                for (var s3 = 0; s3 < n3; s3++) {
                  var a3 = r4[s3 >>> 2] >>> 24 - s3 % 4 * 8 & 255;
                  e4[i4 + s3 >>> 2] |= a3 << 24 - (i4 + s3) % 4 * 8;
                }
              else
                for (var o3 = 0; o3 < n3; o3 += 4)
                  e4[i4 + o3 >>> 2] = r4[o3 >>> 2];
              this.sigBytes += n3;
              return this;
            }, clamp: function() {
              var e4 = this.words;
              var r4 = this.sigBytes;
              e4[r4 >>> 2] &= 4294967295 << 32 - r4 % 4 * 8;
              e4.length = t5.ceil(r4 / 4);
            }, clone: function() {
              var t6 = u2.clone.call(this);
              t6.words = this.words.slice(0);
              return t6;
            }, random: function(t6) {
              var e4 = [];
              for (var r4 = 0; r4 < t6; r4 += 4)
                e4.push(n2());
              return new c2.init(e4, t6);
            } });
            var l2 = a2.enc = {};
            var f2 = l2.Hex = { stringify: function(t6) {
              var e4 = t6.words;
              var r4 = t6.sigBytes;
              var i4 = [];
              for (var n3 = 0; n3 < r4; n3++) {
                var s3 = e4[n3 >>> 2] >>> 24 - n3 % 4 * 8 & 255;
                i4.push((s3 >>> 4).toString(16));
                i4.push((15 & s3).toString(16));
              }
              return i4.join("");
            }, parse: function(t6) {
              var e4 = t6.length;
              var r4 = [];
              for (var i4 = 0; i4 < e4; i4 += 2)
                r4[i4 >>> 3] |= parseInt(t6.substr(i4, 2), 16) << 24 - i4 % 8 * 4;
              return new c2.init(r4, e4 / 2);
            } };
            var h2 = l2.Latin1 = { stringify: function(t6) {
              var e4 = t6.words;
              var r4 = t6.sigBytes;
              var i4 = [];
              for (var n3 = 0; n3 < r4; n3++) {
                var s3 = e4[n3 >>> 2] >>> 24 - n3 % 4 * 8 & 255;
                i4.push(String.fromCharCode(s3));
              }
              return i4.join("");
            }, parse: function(t6) {
              var e4 = t6.length;
              var r4 = [];
              for (var i4 = 0; i4 < e4; i4++)
                r4[i4 >>> 2] |= (255 & t6.charCodeAt(i4)) << 24 - i4 % 4 * 8;
              return new c2.init(r4, e4);
            } };
            var d2 = l2.Utf8 = { stringify: function(t6) {
              try {
                return decodeURIComponent(escape(h2.stringify(t6)));
              } catch (t7) {
                throw new Error("Malformed UTF-8 data");
              }
            }, parse: function(t6) {
              return h2.parse(unescape(encodeURIComponent(t6)));
            } };
            var p2 = o2.BufferedBlockAlgorithm = u2.extend({ reset: function() {
              this._data = new c2.init();
              this._nDataBytes = 0;
            }, _append: function(t6) {
              if ("string" == typeof t6)
                t6 = d2.parse(t6);
              this._data.concat(t6);
              this._nDataBytes += t6.sigBytes;
            }, _process: function(e4) {
              var r4;
              var i4 = this._data;
              var n3 = i4.words;
              var s3 = i4.sigBytes;
              var a3 = this.blockSize;
              var o3 = 4 * a3;
              var u3 = s3 / o3;
              if (e4)
                u3 = t5.ceil(u3);
              else
                u3 = t5.max((0 | u3) - this._minBufferSize, 0);
              var l3 = u3 * a3;
              var f3 = t5.min(4 * l3, s3);
              if (l3) {
                for (var h3 = 0; h3 < l3; h3 += a3)
                  this._doProcessBlock(n3, h3);
                r4 = n3.splice(0, l3);
                i4.sigBytes -= f3;
              }
              return new c2.init(r4, f3);
            }, clone: function() {
              var t6 = u2.clone.call(this);
              t6._data = this._data.clone();
              return t6;
            }, _minBufferSize: 0 });
            o2.Hasher = p2.extend({ cfg: u2.extend(), init: function(t6) {
              this.cfg = this.cfg.extend(t6);
              this.reset();
            }, reset: function() {
              p2.reset.call(this);
              this._doReset();
            }, update: function(t6) {
              this._append(t6);
              this._process();
              return this;
            }, finalize: function(t6) {
              if (t6)
                this._append(t6);
              var e4 = this._doFinalize();
              return e4;
            }, blockSize: 512 / 32, _createHelper: function(t6) {
              return function(e4, r4) {
                return new t6.init(r4).finalize(e4);
              };
            }, _createHmacHelper: function(t6) {
              return function(e4, r4) {
                return new g2.HMAC.init(t6, r4).finalize(e4);
              };
            } });
            var g2 = a2.algo = {};
            return a2;
          }(Math);
          return t4;
        });
      }, 8269: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = e3.enc;
            n2.Base64 = { stringify: function(t5) {
              var e4 = t5.words;
              var r5 = t5.sigBytes;
              var i4 = this._map;
              t5.clamp();
              var n3 = [];
              for (var s2 = 0; s2 < r5; s2 += 3) {
                var a3 = e4[s2 >>> 2] >>> 24 - s2 % 4 * 8 & 255;
                var o2 = e4[s2 + 1 >>> 2] >>> 24 - (s2 + 1) % 4 * 8 & 255;
                var u2 = e4[s2 + 2 >>> 2] >>> 24 - (s2 + 2) % 4 * 8 & 255;
                var c2 = a3 << 16 | o2 << 8 | u2;
                for (var l2 = 0; l2 < 4 && s2 + 0.75 * l2 < r5; l2++)
                  n3.push(i4.charAt(c2 >>> 6 * (3 - l2) & 63));
              }
              var f2 = i4.charAt(64);
              if (f2)
                while (n3.length % 4)
                  n3.push(f2);
              return n3.join("");
            }, parse: function(t5) {
              var e4 = t5.length;
              var r5 = this._map;
              var i4 = this._reverseMap;
              if (!i4) {
                i4 = this._reverseMap = [];
                for (var n3 = 0; n3 < r5.length; n3++)
                  i4[r5.charCodeAt(n3)] = n3;
              }
              var s2 = r5.charAt(64);
              if (s2) {
                var o2 = t5.indexOf(s2);
                if (-1 !== o2)
                  e4 = o2;
              }
              return a2(t5, e4, i4);
            }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
            function a2(t5, e4, r5) {
              var n3 = [];
              var s2 = 0;
              for (var a3 = 0; a3 < e4; a3++)
                if (a3 % 4) {
                  var o2 = r5[t5.charCodeAt(a3 - 1)] << a3 % 4 * 2;
                  var u2 = r5[t5.charCodeAt(a3)] >>> 6 - a3 % 4 * 2;
                  var c2 = o2 | u2;
                  n3[s2 >>> 2] |= c2 << 24 - s2 % 4 * 8;
                  s2++;
                }
              return i3.create(n3, s2);
            }
          })();
          return t4.enc.Base64;
        });
      }, 3786: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = e3.enc;
            n2.Base64url = { stringify: function(t5, e4 = true) {
              var r5 = t5.words;
              var i4 = t5.sigBytes;
              var n3 = e4 ? this._safe_map : this._map;
              t5.clamp();
              var s2 = [];
              for (var a3 = 0; a3 < i4; a3 += 3) {
                var o2 = r5[a3 >>> 2] >>> 24 - a3 % 4 * 8 & 255;
                var u2 = r5[a3 + 1 >>> 2] >>> 24 - (a3 + 1) % 4 * 8 & 255;
                var c2 = r5[a3 + 2 >>> 2] >>> 24 - (a3 + 2) % 4 * 8 & 255;
                var l2 = o2 << 16 | u2 << 8 | c2;
                for (var f2 = 0; f2 < 4 && a3 + 0.75 * f2 < i4; f2++)
                  s2.push(n3.charAt(l2 >>> 6 * (3 - f2) & 63));
              }
              var h2 = n3.charAt(64);
              if (h2)
                while (s2.length % 4)
                  s2.push(h2);
              return s2.join("");
            }, parse: function(t5, e4 = true) {
              var r5 = t5.length;
              var i4 = e4 ? this._safe_map : this._map;
              var n3 = this._reverseMap;
              if (!n3) {
                n3 = this._reverseMap = [];
                for (var s2 = 0; s2 < i4.length; s2++)
                  n3[i4.charCodeAt(s2)] = s2;
              }
              var o2 = i4.charAt(64);
              if (o2) {
                var u2 = t5.indexOf(o2);
                if (-1 !== u2)
                  r5 = u2;
              }
              return a2(t5, r5, n3);
            }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" };
            function a2(t5, e4, r5) {
              var n3 = [];
              var s2 = 0;
              for (var a3 = 0; a3 < e4; a3++)
                if (a3 % 4) {
                  var o2 = r5[t5.charCodeAt(a3 - 1)] << a3 % 4 * 2;
                  var u2 = r5[t5.charCodeAt(a3)] >>> 6 - a3 % 4 * 2;
                  var c2 = o2 | u2;
                  n3[s2 >>> 2] |= c2 << 24 - s2 % 4 * 8;
                  s2++;
                }
              return i3.create(n3, s2);
            }
          })();
          return t4.enc.Base64url;
        });
      }, 298: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = e3.enc;
            n2.Utf16 = n2.Utf16BE = { stringify: function(t5) {
              var e4 = t5.words;
              var r5 = t5.sigBytes;
              var i4 = [];
              for (var n3 = 0; n3 < r5; n3 += 2) {
                var s2 = e4[n3 >>> 2] >>> 16 - n3 % 4 * 8 & 65535;
                i4.push(String.fromCharCode(s2));
              }
              return i4.join("");
            }, parse: function(t5) {
              var e4 = t5.length;
              var r5 = [];
              for (var n3 = 0; n3 < e4; n3++)
                r5[n3 >>> 1] |= t5.charCodeAt(n3) << 16 - n3 % 2 * 16;
              return i3.create(r5, 2 * e4);
            } };
            n2.Utf16LE = { stringify: function(t5) {
              var e4 = t5.words;
              var r5 = t5.sigBytes;
              var i4 = [];
              for (var n3 = 0; n3 < r5; n3 += 2) {
                var s2 = a2(e4[n3 >>> 2] >>> 16 - n3 % 4 * 8 & 65535);
                i4.push(String.fromCharCode(s2));
              }
              return i4.join("");
            }, parse: function(t5) {
              var e4 = t5.length;
              var r5 = [];
              for (var n3 = 0; n3 < e4; n3++)
                r5[n3 >>> 1] |= a2(t5.charCodeAt(n3) << 16 - n3 % 2 * 16);
              return i3.create(r5, 2 * e4);
            } };
            function a2(t5) {
              return t5 << 8 & 4278255360 | t5 >>> 8 & 16711935;
            }
          })();
          return t4.enc.Utf16;
        });
      }, 888: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(2783), r3(9824));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.Base;
            var n2 = r4.WordArray;
            var s2 = e3.algo;
            var a2 = s2.MD5;
            var o2 = s2.EvpKDF = i3.extend({ cfg: i3.extend({ keySize: 128 / 32, hasher: a2, iterations: 1 }), init: function(t5) {
              this.cfg = this.cfg.extend(t5);
            }, compute: function(t5, e4) {
              var r5;
              var i4 = this.cfg;
              var s3 = i4.hasher.create();
              var a3 = n2.create();
              var o3 = a3.words;
              var u2 = i4.keySize;
              var c2 = i4.iterations;
              while (o3.length < u2) {
                if (r5)
                  s3.update(r5);
                r5 = s3.update(t5).finalize(e4);
                s3.reset();
                for (var l2 = 1; l2 < c2; l2++) {
                  r5 = s3.finalize(r5);
                  s3.reset();
                }
                a3.concat(r5);
              }
              a3.sigBytes = 4 * u2;
              return a3;
            } });
            e3.EvpKDF = function(t5, e4, r5) {
              return o2.create(r5).compute(t5, e4);
            };
          })();
          return t4.EvpKDF;
        });
      }, 2209: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          (function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.CipherParams;
            var s2 = r4.enc;
            var a2 = s2.Hex;
            var o2 = r4.format;
            o2.Hex = { stringify: function(t5) {
              return t5.ciphertext.toString(a2);
            }, parse: function(t5) {
              var e4 = a2.parse(t5);
              return n2.create({ ciphertext: e4 });
            } };
          })();
          return t4.format.Hex;
        });
      }, 9824: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.Base;
            var n2 = e3.enc;
            var s2 = n2.Utf8;
            var a2 = e3.algo;
            a2.HMAC = i3.extend({ init: function(t5, e4) {
              t5 = this._hasher = new t5.init();
              if ("string" == typeof e4)
                e4 = s2.parse(e4);
              var r5 = t5.blockSize;
              var i4 = 4 * r5;
              if (e4.sigBytes > i4)
                e4 = t5.finalize(e4);
              e4.clamp();
              var n3 = this._oKey = e4.clone();
              var a3 = this._iKey = e4.clone();
              var o2 = n3.words;
              var u2 = a3.words;
              for (var c2 = 0; c2 < r5; c2++) {
                o2[c2] ^= 1549556828;
                u2[c2] ^= 909522486;
              }
              n3.sigBytes = a3.sigBytes = i4;
              this.reset();
            }, reset: function() {
              var t5 = this._hasher;
              t5.reset();
              t5.update(this._iKey);
            }, update: function(t5) {
              this._hasher.update(t5);
              return this;
            }, finalize: function(t5) {
              var e4 = this._hasher;
              var r5 = e4.finalize(t5);
              e4.reset();
              var i4 = e4.finalize(this._oKey.clone().concat(r5));
              return i4;
            } });
          })();
        });
      }, 1354: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(4938), r3(4433), r3(298), r3(8269), r3(3786), r3(8214), r3(2783), r3(2153), r3(7792), r3(34), r3(7460), r3(3327), r3(706), r3(9824), r3(2112), r3(888), r3(5109), r3(8568), r3(4242), r3(9968), r3(7660), r3(1148), r3(3615), r3(2807), r3(1077), r3(6475), r3(6991), r3(2209), r3(452), r3(4253), r3(1857), r3(4454), r3(3974));
        })(this, function(t4) {
          return t4;
        });
      }, 4433: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function() {
            if ("function" != typeof ArrayBuffer)
              return;
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = i3.init;
            var s2 = i3.init = function(t5) {
              if (t5 instanceof ArrayBuffer)
                t5 = new Uint8Array(t5);
              if (t5 instanceof Int8Array || "undefined" !== typeof Uint8ClampedArray && t5 instanceof Uint8ClampedArray || t5 instanceof Int16Array || t5 instanceof Uint16Array || t5 instanceof Int32Array || t5 instanceof Uint32Array || t5 instanceof Float32Array || t5 instanceof Float64Array)
                t5 = new Uint8Array(t5.buffer, t5.byteOffset, t5.byteLength);
              if (t5 instanceof Uint8Array) {
                var e4 = t5.byteLength;
                var r5 = [];
                for (var i4 = 0; i4 < e4; i4++)
                  r5[i4 >>> 2] |= t5[i4] << 24 - i4 % 4 * 8;
                n2.call(this, r5, e4);
              } else
                n2.apply(this, arguments);
            };
            s2.prototype = i3;
          })();
          return t4.lib.WordArray;
        });
      }, 8214: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.WordArray;
            var s2 = i3.Hasher;
            var a2 = r4.algo;
            var o2 = [];
            (function() {
              for (var t5 = 0; t5 < 64; t5++)
                o2[t5] = 4294967296 * e3.abs(e3.sin(t5 + 1)) | 0;
            })();
            var u2 = a2.MD5 = s2.extend({ _doReset: function() {
              this._hash = new n2.init([1732584193, 4023233417, 2562383102, 271733878]);
            }, _doProcessBlock: function(t5, e4) {
              for (var r5 = 0; r5 < 16; r5++) {
                var i4 = e4 + r5;
                var n3 = t5[i4];
                t5[i4] = 16711935 & (n3 << 8 | n3 >>> 24) | 4278255360 & (n3 << 24 | n3 >>> 8);
              }
              var s3 = this._hash.words;
              var a3 = t5[e4 + 0];
              var u3 = t5[e4 + 1];
              var d2 = t5[e4 + 2];
              var p2 = t5[e4 + 3];
              var v2 = t5[e4 + 4];
              var g2 = t5[e4 + 5];
              var y = t5[e4 + 6];
              var m2 = t5[e4 + 7];
              var w2 = t5[e4 + 8];
              var S2 = t5[e4 + 9];
              var _2 = t5[e4 + 10];
              var b2 = t5[e4 + 11];
              var E2 = t5[e4 + 12];
              var D2 = t5[e4 + 13];
              var M2 = t5[e4 + 14];
              var T2 = t5[e4 + 15];
              var I2 = s3[0];
              var A2 = s3[1];
              var x2 = s3[2];
              var R2 = s3[3];
              I2 = c2(I2, A2, x2, R2, a3, 7, o2[0]);
              R2 = c2(R2, I2, A2, x2, u3, 12, o2[1]);
              x2 = c2(x2, R2, I2, A2, d2, 17, o2[2]);
              A2 = c2(A2, x2, R2, I2, p2, 22, o2[3]);
              I2 = c2(I2, A2, x2, R2, v2, 7, o2[4]);
              R2 = c2(R2, I2, A2, x2, g2, 12, o2[5]);
              x2 = c2(x2, R2, I2, A2, y, 17, o2[6]);
              A2 = c2(A2, x2, R2, I2, m2, 22, o2[7]);
              I2 = c2(I2, A2, x2, R2, w2, 7, o2[8]);
              R2 = c2(R2, I2, A2, x2, S2, 12, o2[9]);
              x2 = c2(x2, R2, I2, A2, _2, 17, o2[10]);
              A2 = c2(A2, x2, R2, I2, b2, 22, o2[11]);
              I2 = c2(I2, A2, x2, R2, E2, 7, o2[12]);
              R2 = c2(R2, I2, A2, x2, D2, 12, o2[13]);
              x2 = c2(x2, R2, I2, A2, M2, 17, o2[14]);
              A2 = c2(A2, x2, R2, I2, T2, 22, o2[15]);
              I2 = l2(I2, A2, x2, R2, u3, 5, o2[16]);
              R2 = l2(R2, I2, A2, x2, y, 9, o2[17]);
              x2 = l2(x2, R2, I2, A2, b2, 14, o2[18]);
              A2 = l2(A2, x2, R2, I2, a3, 20, o2[19]);
              I2 = l2(I2, A2, x2, R2, g2, 5, o2[20]);
              R2 = l2(R2, I2, A2, x2, _2, 9, o2[21]);
              x2 = l2(x2, R2, I2, A2, T2, 14, o2[22]);
              A2 = l2(A2, x2, R2, I2, v2, 20, o2[23]);
              I2 = l2(I2, A2, x2, R2, S2, 5, o2[24]);
              R2 = l2(R2, I2, A2, x2, M2, 9, o2[25]);
              x2 = l2(x2, R2, I2, A2, p2, 14, o2[26]);
              A2 = l2(A2, x2, R2, I2, w2, 20, o2[27]);
              I2 = l2(I2, A2, x2, R2, D2, 5, o2[28]);
              R2 = l2(R2, I2, A2, x2, d2, 9, o2[29]);
              x2 = l2(x2, R2, I2, A2, m2, 14, o2[30]);
              A2 = l2(A2, x2, R2, I2, E2, 20, o2[31]);
              I2 = f2(I2, A2, x2, R2, g2, 4, o2[32]);
              R2 = f2(R2, I2, A2, x2, w2, 11, o2[33]);
              x2 = f2(x2, R2, I2, A2, b2, 16, o2[34]);
              A2 = f2(A2, x2, R2, I2, M2, 23, o2[35]);
              I2 = f2(I2, A2, x2, R2, u3, 4, o2[36]);
              R2 = f2(R2, I2, A2, x2, v2, 11, o2[37]);
              x2 = f2(x2, R2, I2, A2, m2, 16, o2[38]);
              A2 = f2(A2, x2, R2, I2, _2, 23, o2[39]);
              I2 = f2(I2, A2, x2, R2, D2, 4, o2[40]);
              R2 = f2(R2, I2, A2, x2, a3, 11, o2[41]);
              x2 = f2(x2, R2, I2, A2, p2, 16, o2[42]);
              A2 = f2(A2, x2, R2, I2, y, 23, o2[43]);
              I2 = f2(I2, A2, x2, R2, S2, 4, o2[44]);
              R2 = f2(R2, I2, A2, x2, E2, 11, o2[45]);
              x2 = f2(x2, R2, I2, A2, T2, 16, o2[46]);
              A2 = f2(A2, x2, R2, I2, d2, 23, o2[47]);
              I2 = h2(I2, A2, x2, R2, a3, 6, o2[48]);
              R2 = h2(R2, I2, A2, x2, m2, 10, o2[49]);
              x2 = h2(x2, R2, I2, A2, M2, 15, o2[50]);
              A2 = h2(A2, x2, R2, I2, g2, 21, o2[51]);
              I2 = h2(I2, A2, x2, R2, E2, 6, o2[52]);
              R2 = h2(R2, I2, A2, x2, p2, 10, o2[53]);
              x2 = h2(x2, R2, I2, A2, _2, 15, o2[54]);
              A2 = h2(A2, x2, R2, I2, u3, 21, o2[55]);
              I2 = h2(I2, A2, x2, R2, w2, 6, o2[56]);
              R2 = h2(R2, I2, A2, x2, T2, 10, o2[57]);
              x2 = h2(x2, R2, I2, A2, y, 15, o2[58]);
              A2 = h2(A2, x2, R2, I2, D2, 21, o2[59]);
              I2 = h2(I2, A2, x2, R2, v2, 6, o2[60]);
              R2 = h2(R2, I2, A2, x2, b2, 10, o2[61]);
              x2 = h2(x2, R2, I2, A2, d2, 15, o2[62]);
              A2 = h2(A2, x2, R2, I2, S2, 21, o2[63]);
              s3[0] = s3[0] + I2 | 0;
              s3[1] = s3[1] + A2 | 0;
              s3[2] = s3[2] + x2 | 0;
              s3[3] = s3[3] + R2 | 0;
            }, _doFinalize: function() {
              var t5 = this._data;
              var r5 = t5.words;
              var i4 = 8 * this._nDataBytes;
              var n3 = 8 * t5.sigBytes;
              r5[n3 >>> 5] |= 128 << 24 - n3 % 32;
              var s3 = e3.floor(i4 / 4294967296);
              var a3 = i4;
              r5[(n3 + 64 >>> 9 << 4) + 15] = 16711935 & (s3 << 8 | s3 >>> 24) | 4278255360 & (s3 << 24 | s3 >>> 8);
              r5[(n3 + 64 >>> 9 << 4) + 14] = 16711935 & (a3 << 8 | a3 >>> 24) | 4278255360 & (a3 << 24 | a3 >>> 8);
              t5.sigBytes = 4 * (r5.length + 1);
              this._process();
              var o3 = this._hash;
              var u3 = o3.words;
              for (var c3 = 0; c3 < 4; c3++) {
                var l3 = u3[c3];
                u3[c3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
              }
              return o3;
            }, clone: function() {
              var t5 = s2.clone.call(this);
              t5._hash = this._hash.clone();
              return t5;
            } });
            function c2(t5, e4, r5, i4, n3, s3, a3) {
              var o3 = t5 + (e4 & r5 | ~e4 & i4) + n3 + a3;
              return (o3 << s3 | o3 >>> 32 - s3) + e4;
            }
            function l2(t5, e4, r5, i4, n3, s3, a3) {
              var o3 = t5 + (e4 & i4 | r5 & ~i4) + n3 + a3;
              return (o3 << s3 | o3 >>> 32 - s3) + e4;
            }
            function f2(t5, e4, r5, i4, n3, s3, a3) {
              var o3 = t5 + (e4 ^ r5 ^ i4) + n3 + a3;
              return (o3 << s3 | o3 >>> 32 - s3) + e4;
            }
            function h2(t5, e4, r5, i4, n3, s3, a3) {
              var o3 = t5 + (r5 ^ (e4 | ~i4)) + n3 + a3;
              return (o3 << s3 | o3 >>> 32 - s3) + e4;
            }
            r4.MD5 = s2._createHelper(u2);
            r4.HmacMD5 = s2._createHmacHelper(u2);
          })(Math);
          return t4.MD5;
        });
      }, 8568: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.mode.CFB = function() {
            var e3 = t4.lib.BlockCipherMode.extend();
            e3.Encryptor = e3.extend({ processBlock: function(t5, e4) {
              var i3 = this._cipher;
              var n2 = i3.blockSize;
              r4.call(this, t5, e4, n2, i3);
              this._prevBlock = t5.slice(e4, e4 + n2);
            } });
            e3.Decryptor = e3.extend({ processBlock: function(t5, e4) {
              var i3 = this._cipher;
              var n2 = i3.blockSize;
              var s2 = t5.slice(e4, e4 + n2);
              r4.call(this, t5, e4, n2, i3);
              this._prevBlock = s2;
            } });
            function r4(t5, e4, r5, i3) {
              var n2;
              var s2 = this._iv;
              if (s2) {
                n2 = s2.slice(0);
                this._iv = void 0;
              } else
                n2 = this._prevBlock;
              i3.encryptBlock(n2, 0);
              for (var a2 = 0; a2 < r5; a2++)
                t5[e4 + a2] ^= n2[a2];
            }
            return e3;
          }();
          return t4.mode.CFB;
        });
      }, 9968: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.mode.CTRGladman = function() {
            var e3 = t4.lib.BlockCipherMode.extend();
            function r4(t5) {
              if (255 === (t5 >> 24 & 255)) {
                var e4 = t5 >> 16 & 255;
                var r5 = t5 >> 8 & 255;
                var i4 = 255 & t5;
                if (255 === e4) {
                  e4 = 0;
                  if (255 === r5) {
                    r5 = 0;
                    if (255 === i4)
                      i4 = 0;
                    else
                      ++i4;
                  } else
                    ++r5;
                } else
                  ++e4;
                t5 = 0;
                t5 += e4 << 16;
                t5 += r5 << 8;
                t5 += i4;
              } else
                t5 += 1 << 24;
              return t5;
            }
            function i3(t5) {
              if (0 === (t5[0] = r4(t5[0])))
                t5[1] = r4(t5[1]);
              return t5;
            }
            var n2 = e3.Encryptor = e3.extend({ processBlock: function(t5, e4) {
              var r5 = this._cipher;
              var n3 = r5.blockSize;
              var s2 = this._iv;
              var a2 = this._counter;
              if (s2) {
                a2 = this._counter = s2.slice(0);
                this._iv = void 0;
              }
              i3(a2);
              var o2 = a2.slice(0);
              r5.encryptBlock(o2, 0);
              for (var u2 = 0; u2 < n3; u2++)
                t5[e4 + u2] ^= o2[u2];
            } });
            e3.Decryptor = n2;
            return e3;
          }();
          return t4.mode.CTRGladman;
        });
      }, 4242: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.mode.CTR = function() {
            var e3 = t4.lib.BlockCipherMode.extend();
            var r4 = e3.Encryptor = e3.extend({ processBlock: function(t5, e4) {
              var r5 = this._cipher;
              var i3 = r5.blockSize;
              var n2 = this._iv;
              var s2 = this._counter;
              if (n2) {
                s2 = this._counter = n2.slice(0);
                this._iv = void 0;
              }
              var a2 = s2.slice(0);
              r5.encryptBlock(a2, 0);
              s2[i3 - 1] = s2[i3 - 1] + 1 | 0;
              for (var o2 = 0; o2 < i3; o2++)
                t5[e4 + o2] ^= a2[o2];
            } });
            e3.Decryptor = r4;
            return e3;
          }();
          return t4.mode.CTR;
        });
      }, 1148: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.mode.ECB = function() {
            var e3 = t4.lib.BlockCipherMode.extend();
            e3.Encryptor = e3.extend({ processBlock: function(t5, e4) {
              this._cipher.encryptBlock(t5, e4);
            } });
            e3.Decryptor = e3.extend({ processBlock: function(t5, e4) {
              this._cipher.decryptBlock(t5, e4);
            } });
            return e3;
          }();
          return t4.mode.ECB;
        });
      }, 7660: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.mode.OFB = function() {
            var e3 = t4.lib.BlockCipherMode.extend();
            var r4 = e3.Encryptor = e3.extend({ processBlock: function(t5, e4) {
              var r5 = this._cipher;
              var i3 = r5.blockSize;
              var n2 = this._iv;
              var s2 = this._keystream;
              if (n2) {
                s2 = this._keystream = n2.slice(0);
                this._iv = void 0;
              }
              r5.encryptBlock(s2, 0);
              for (var a2 = 0; a2 < i3; a2++)
                t5[e4 + a2] ^= s2[a2];
            } });
            e3.Decryptor = r4;
            return e3;
          }();
          return t4.mode.OFB;
        });
      }, 3615: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.pad.AnsiX923 = { pad: function(t5, e3) {
            var r4 = t5.sigBytes;
            var i3 = 4 * e3;
            var n2 = i3 - r4 % i3;
            var s2 = r4 + n2 - 1;
            t5.clamp();
            t5.words[s2 >>> 2] |= n2 << 24 - s2 % 4 * 8;
            t5.sigBytes += n2;
          }, unpad: function(t5) {
            var e3 = 255 & t5.words[t5.sigBytes - 1 >>> 2];
            t5.sigBytes -= e3;
          } };
          return t4.pad.Ansix923;
        });
      }, 2807: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.pad.Iso10126 = { pad: function(e3, r4) {
            var i3 = 4 * r4;
            var n2 = i3 - e3.sigBytes % i3;
            e3.concat(t4.lib.WordArray.random(n2 - 1)).concat(t4.lib.WordArray.create([n2 << 24], 1));
          }, unpad: function(t5) {
            var e3 = 255 & t5.words[t5.sigBytes - 1 >>> 2];
            t5.sigBytes -= e3;
          } };
          return t4.pad.Iso10126;
        });
      }, 1077: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.pad.Iso97971 = { pad: function(e3, r4) {
            e3.concat(t4.lib.WordArray.create([2147483648], 1));
            t4.pad.ZeroPadding.pad(e3, r4);
          }, unpad: function(e3) {
            t4.pad.ZeroPadding.unpad(e3);
            e3.sigBytes--;
          } };
          return t4.pad.Iso97971;
        });
      }, 6991: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.pad.NoPadding = { pad: function() {
          }, unpad: function() {
          } };
          return t4.pad.NoPadding;
        });
      }, 6475: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(5109));
        })(this, function(t4) {
          t4.pad.ZeroPadding = { pad: function(t5, e3) {
            var r4 = 4 * e3;
            t5.clamp();
            t5.sigBytes += r4 - (t5.sigBytes % r4 || r4);
          }, unpad: function(t5) {
            var e3 = t5.words;
            var r4 = t5.sigBytes - 1;
            for (var r4 = t5.sigBytes - 1; r4 >= 0; r4--)
              if (e3[r4 >>> 2] >>> 24 - r4 % 4 * 8 & 255) {
                t5.sigBytes = r4 + 1;
                break;
              }
          } };
          return t4.pad.ZeroPadding;
        });
      }, 2112: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(2783), r3(9824));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.Base;
            var n2 = r4.WordArray;
            var s2 = e3.algo;
            var a2 = s2.SHA1;
            var o2 = s2.HMAC;
            var u2 = s2.PBKDF2 = i3.extend({ cfg: i3.extend({ keySize: 128 / 32, hasher: a2, iterations: 1 }), init: function(t5) {
              this.cfg = this.cfg.extend(t5);
            }, compute: function(t5, e4) {
              var r5 = this.cfg;
              var i4 = o2.create(r5.hasher, t5);
              var s3 = n2.create();
              var a3 = n2.create([1]);
              var u3 = s3.words;
              var c2 = a3.words;
              var l2 = r5.keySize;
              var f2 = r5.iterations;
              while (u3.length < l2) {
                var h2 = i4.update(e4).finalize(a3);
                i4.reset();
                var d2 = h2.words;
                var p2 = d2.length;
                var v2 = h2;
                for (var g2 = 1; g2 < f2; g2++) {
                  v2 = i4.finalize(v2);
                  i4.reset();
                  var y = v2.words;
                  for (var m2 = 0; m2 < p2; m2++)
                    d2[m2] ^= y[m2];
                }
                s3.concat(h2);
                c2[0]++;
              }
              s3.sigBytes = 4 * l2;
              return s3;
            } });
            e3.PBKDF2 = function(t5, e4, r5) {
              return u2.create(r5).compute(t5, e4);
            };
          })();
          return t4.PBKDF2;
        });
      }, 3974: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(8269), r3(8214), r3(888), r3(5109));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.StreamCipher;
            var n2 = e3.algo;
            var s2 = [];
            var a2 = [];
            var o2 = [];
            var u2 = n2.RabbitLegacy = i3.extend({ _doReset: function() {
              var t5 = this._key.words;
              var e4 = this.cfg.iv;
              var r5 = this._X = [t5[0], t5[3] << 16 | t5[2] >>> 16, t5[1], t5[0] << 16 | t5[3] >>> 16, t5[2], t5[1] << 16 | t5[0] >>> 16, t5[3], t5[2] << 16 | t5[1] >>> 16];
              var i4 = this._C = [t5[2] << 16 | t5[2] >>> 16, 4294901760 & t5[0] | 65535 & t5[1], t5[3] << 16 | t5[3] >>> 16, 4294901760 & t5[1] | 65535 & t5[2], t5[0] << 16 | t5[0] >>> 16, 4294901760 & t5[2] | 65535 & t5[3], t5[1] << 16 | t5[1] >>> 16, 4294901760 & t5[3] | 65535 & t5[0]];
              this._b = 0;
              for (var n3 = 0; n3 < 4; n3++)
                c2.call(this);
              for (var n3 = 0; n3 < 8; n3++)
                i4[n3] ^= r5[n3 + 4 & 7];
              if (e4) {
                var s3 = e4.words;
                var a3 = s3[0];
                var o3 = s3[1];
                var u3 = 16711935 & (a3 << 8 | a3 >>> 24) | 4278255360 & (a3 << 24 | a3 >>> 8);
                var l2 = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
                var f2 = u3 >>> 16 | 4294901760 & l2;
                var h2 = l2 << 16 | 65535 & u3;
                i4[0] ^= u3;
                i4[1] ^= f2;
                i4[2] ^= l2;
                i4[3] ^= h2;
                i4[4] ^= u3;
                i4[5] ^= f2;
                i4[6] ^= l2;
                i4[7] ^= h2;
                for (var n3 = 0; n3 < 4; n3++)
                  c2.call(this);
              }
            }, _doProcessBlock: function(t5, e4) {
              var r5 = this._X;
              c2.call(this);
              s2[0] = r5[0] ^ r5[5] >>> 16 ^ r5[3] << 16;
              s2[1] = r5[2] ^ r5[7] >>> 16 ^ r5[5] << 16;
              s2[2] = r5[4] ^ r5[1] >>> 16 ^ r5[7] << 16;
              s2[3] = r5[6] ^ r5[3] >>> 16 ^ r5[1] << 16;
              for (var i4 = 0; i4 < 4; i4++) {
                s2[i4] = 16711935 & (s2[i4] << 8 | s2[i4] >>> 24) | 4278255360 & (s2[i4] << 24 | s2[i4] >>> 8);
                t5[e4 + i4] ^= s2[i4];
              }
            }, blockSize: 128 / 32, ivSize: 64 / 32 });
            function c2() {
              var t5 = this._X;
              var e4 = this._C;
              for (var r5 = 0; r5 < 8; r5++)
                a2[r5] = e4[r5];
              e4[0] = e4[0] + 1295307597 + this._b | 0;
              e4[1] = e4[1] + 3545052371 + (e4[0] >>> 0 < a2[0] >>> 0 ? 1 : 0) | 0;
              e4[2] = e4[2] + 886263092 + (e4[1] >>> 0 < a2[1] >>> 0 ? 1 : 0) | 0;
              e4[3] = e4[3] + 1295307597 + (e4[2] >>> 0 < a2[2] >>> 0 ? 1 : 0) | 0;
              e4[4] = e4[4] + 3545052371 + (e4[3] >>> 0 < a2[3] >>> 0 ? 1 : 0) | 0;
              e4[5] = e4[5] + 886263092 + (e4[4] >>> 0 < a2[4] >>> 0 ? 1 : 0) | 0;
              e4[6] = e4[6] + 1295307597 + (e4[5] >>> 0 < a2[5] >>> 0 ? 1 : 0) | 0;
              e4[7] = e4[7] + 3545052371 + (e4[6] >>> 0 < a2[6] >>> 0 ? 1 : 0) | 0;
              this._b = e4[7] >>> 0 < a2[7] >>> 0 ? 1 : 0;
              for (var r5 = 0; r5 < 8; r5++) {
                var i4 = t5[r5] + e4[r5];
                var n3 = 65535 & i4;
                var s3 = i4 >>> 16;
                var u3 = ((n3 * n3 >>> 17) + n3 * s3 >>> 15) + s3 * s3;
                var c3 = ((4294901760 & i4) * i4 | 0) + ((65535 & i4) * i4 | 0);
                o2[r5] = u3 ^ c3;
              }
              t5[0] = o2[0] + (o2[7] << 16 | o2[7] >>> 16) + (o2[6] << 16 | o2[6] >>> 16) | 0;
              t5[1] = o2[1] + (o2[0] << 8 | o2[0] >>> 24) + o2[7] | 0;
              t5[2] = o2[2] + (o2[1] << 16 | o2[1] >>> 16) + (o2[0] << 16 | o2[0] >>> 16) | 0;
              t5[3] = o2[3] + (o2[2] << 8 | o2[2] >>> 24) + o2[1] | 0;
              t5[4] = o2[4] + (o2[3] << 16 | o2[3] >>> 16) + (o2[2] << 16 | o2[2] >>> 16) | 0;
              t5[5] = o2[5] + (o2[4] << 8 | o2[4] >>> 24) + o2[3] | 0;
              t5[6] = o2[6] + (o2[5] << 16 | o2[5] >>> 16) + (o2[4] << 16 | o2[4] >>> 16) | 0;
              t5[7] = o2[7] + (o2[6] << 8 | o2[6] >>> 24) + o2[5] | 0;
            }
            e3.RabbitLegacy = i3._createHelper(u2);
          })();
          return t4.RabbitLegacy;
        });
      }, 4454: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(8269), r3(8214), r3(888), r3(5109));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.StreamCipher;
            var n2 = e3.algo;
            var s2 = [];
            var a2 = [];
            var o2 = [];
            var u2 = n2.Rabbit = i3.extend({ _doReset: function() {
              var t5 = this._key.words;
              var e4 = this.cfg.iv;
              for (var r5 = 0; r5 < 4; r5++)
                t5[r5] = 16711935 & (t5[r5] << 8 | t5[r5] >>> 24) | 4278255360 & (t5[r5] << 24 | t5[r5] >>> 8);
              var i4 = this._X = [t5[0], t5[3] << 16 | t5[2] >>> 16, t5[1], t5[0] << 16 | t5[3] >>> 16, t5[2], t5[1] << 16 | t5[0] >>> 16, t5[3], t5[2] << 16 | t5[1] >>> 16];
              var n3 = this._C = [t5[2] << 16 | t5[2] >>> 16, 4294901760 & t5[0] | 65535 & t5[1], t5[3] << 16 | t5[3] >>> 16, 4294901760 & t5[1] | 65535 & t5[2], t5[0] << 16 | t5[0] >>> 16, 4294901760 & t5[2] | 65535 & t5[3], t5[1] << 16 | t5[1] >>> 16, 4294901760 & t5[3] | 65535 & t5[0]];
              this._b = 0;
              for (var r5 = 0; r5 < 4; r5++)
                c2.call(this);
              for (var r5 = 0; r5 < 8; r5++)
                n3[r5] ^= i4[r5 + 4 & 7];
              if (e4) {
                var s3 = e4.words;
                var a3 = s3[0];
                var o3 = s3[1];
                var u3 = 16711935 & (a3 << 8 | a3 >>> 24) | 4278255360 & (a3 << 24 | a3 >>> 8);
                var l2 = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
                var f2 = u3 >>> 16 | 4294901760 & l2;
                var h2 = l2 << 16 | 65535 & u3;
                n3[0] ^= u3;
                n3[1] ^= f2;
                n3[2] ^= l2;
                n3[3] ^= h2;
                n3[4] ^= u3;
                n3[5] ^= f2;
                n3[6] ^= l2;
                n3[7] ^= h2;
                for (var r5 = 0; r5 < 4; r5++)
                  c2.call(this);
              }
            }, _doProcessBlock: function(t5, e4) {
              var r5 = this._X;
              c2.call(this);
              s2[0] = r5[0] ^ r5[5] >>> 16 ^ r5[3] << 16;
              s2[1] = r5[2] ^ r5[7] >>> 16 ^ r5[5] << 16;
              s2[2] = r5[4] ^ r5[1] >>> 16 ^ r5[7] << 16;
              s2[3] = r5[6] ^ r5[3] >>> 16 ^ r5[1] << 16;
              for (var i4 = 0; i4 < 4; i4++) {
                s2[i4] = 16711935 & (s2[i4] << 8 | s2[i4] >>> 24) | 4278255360 & (s2[i4] << 24 | s2[i4] >>> 8);
                t5[e4 + i4] ^= s2[i4];
              }
            }, blockSize: 128 / 32, ivSize: 64 / 32 });
            function c2() {
              var t5 = this._X;
              var e4 = this._C;
              for (var r5 = 0; r5 < 8; r5++)
                a2[r5] = e4[r5];
              e4[0] = e4[0] + 1295307597 + this._b | 0;
              e4[1] = e4[1] + 3545052371 + (e4[0] >>> 0 < a2[0] >>> 0 ? 1 : 0) | 0;
              e4[2] = e4[2] + 886263092 + (e4[1] >>> 0 < a2[1] >>> 0 ? 1 : 0) | 0;
              e4[3] = e4[3] + 1295307597 + (e4[2] >>> 0 < a2[2] >>> 0 ? 1 : 0) | 0;
              e4[4] = e4[4] + 3545052371 + (e4[3] >>> 0 < a2[3] >>> 0 ? 1 : 0) | 0;
              e4[5] = e4[5] + 886263092 + (e4[4] >>> 0 < a2[4] >>> 0 ? 1 : 0) | 0;
              e4[6] = e4[6] + 1295307597 + (e4[5] >>> 0 < a2[5] >>> 0 ? 1 : 0) | 0;
              e4[7] = e4[7] + 3545052371 + (e4[6] >>> 0 < a2[6] >>> 0 ? 1 : 0) | 0;
              this._b = e4[7] >>> 0 < a2[7] >>> 0 ? 1 : 0;
              for (var r5 = 0; r5 < 8; r5++) {
                var i4 = t5[r5] + e4[r5];
                var n3 = 65535 & i4;
                var s3 = i4 >>> 16;
                var u3 = ((n3 * n3 >>> 17) + n3 * s3 >>> 15) + s3 * s3;
                var c3 = ((4294901760 & i4) * i4 | 0) + ((65535 & i4) * i4 | 0);
                o2[r5] = u3 ^ c3;
              }
              t5[0] = o2[0] + (o2[7] << 16 | o2[7] >>> 16) + (o2[6] << 16 | o2[6] >>> 16) | 0;
              t5[1] = o2[1] + (o2[0] << 8 | o2[0] >>> 24) + o2[7] | 0;
              t5[2] = o2[2] + (o2[1] << 16 | o2[1] >>> 16) + (o2[0] << 16 | o2[0] >>> 16) | 0;
              t5[3] = o2[3] + (o2[2] << 8 | o2[2] >>> 24) + o2[1] | 0;
              t5[4] = o2[4] + (o2[3] << 16 | o2[3] >>> 16) + (o2[2] << 16 | o2[2] >>> 16) | 0;
              t5[5] = o2[5] + (o2[4] << 8 | o2[4] >>> 24) + o2[3] | 0;
              t5[6] = o2[6] + (o2[5] << 16 | o2[5] >>> 16) + (o2[4] << 16 | o2[4] >>> 16) | 0;
              t5[7] = o2[7] + (o2[6] << 8 | o2[6] >>> 24) + o2[5] | 0;
            }
            e3.Rabbit = i3._createHelper(u2);
          })();
          return t4.Rabbit;
        });
      }, 1857: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(8269), r3(8214), r3(888), r3(5109));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.StreamCipher;
            var n2 = e3.algo;
            var s2 = n2.RC4 = i3.extend({ _doReset: function() {
              var t5 = this._key;
              var e4 = t5.words;
              var r5 = t5.sigBytes;
              var i4 = this._S = [];
              for (var n3 = 0; n3 < 256; n3++)
                i4[n3] = n3;
              for (var n3 = 0, s3 = 0; n3 < 256; n3++) {
                var a3 = n3 % r5;
                var o3 = e4[a3 >>> 2] >>> 24 - a3 % 4 * 8 & 255;
                s3 = (s3 + i4[n3] + o3) % 256;
                var u2 = i4[n3];
                i4[n3] = i4[s3];
                i4[s3] = u2;
              }
              this._i = this._j = 0;
            }, _doProcessBlock: function(t5, e4) {
              t5[e4] ^= a2.call(this);
            }, keySize: 256 / 32, ivSize: 0 });
            function a2() {
              var t5 = this._S;
              var e4 = this._i;
              var r5 = this._j;
              var i4 = 0;
              for (var n3 = 0; n3 < 4; n3++) {
                e4 = (e4 + 1) % 256;
                r5 = (r5 + t5[e4]) % 256;
                var s3 = t5[e4];
                t5[e4] = t5[r5];
                t5[r5] = s3;
                i4 |= t5[(t5[e4] + t5[r5]) % 256] << 24 - 8 * n3;
              }
              this._i = e4;
              this._j = r5;
              return i4;
            }
            e3.RC4 = i3._createHelper(s2);
            var o2 = n2.RC4Drop = s2.extend({ cfg: s2.cfg.extend({ drop: 192 }), _doReset: function() {
              s2._doReset.call(this);
              for (var t5 = this.cfg.drop; t5 > 0; t5--)
                a2.call(this);
            } });
            e3.RC4Drop = i3._createHelper(o2);
          })();
          return t4.RC4;
        });
      }, 706: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.WordArray;
            var s2 = i3.Hasher;
            var a2 = r4.algo;
            var o2 = n2.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);
            var u2 = n2.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);
            var c2 = n2.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);
            var l2 = n2.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);
            var f2 = n2.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
            var h2 = n2.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
            var d2 = a2.RIPEMD160 = s2.extend({ _doReset: function() {
              this._hash = n2.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            }, _doProcessBlock: function(t5, e4) {
              for (var r5 = 0; r5 < 16; r5++) {
                var i4 = e4 + r5;
                var n3 = t5[i4];
                t5[i4] = 16711935 & (n3 << 8 | n3 >>> 24) | 4278255360 & (n3 << 24 | n3 >>> 8);
              }
              var s3 = this._hash.words;
              var a3 = f2.words;
              var d3 = h2.words;
              var S2 = o2.words;
              var _2 = u2.words;
              var b2 = c2.words;
              var E2 = l2.words;
              var D2, M2, T2, I2, A2;
              var x2, R2, B2, O2, k;
              x2 = D2 = s3[0];
              R2 = M2 = s3[1];
              B2 = T2 = s3[2];
              O2 = I2 = s3[3];
              k = A2 = s3[4];
              var C2;
              for (var r5 = 0; r5 < 80; r5 += 1) {
                C2 = D2 + t5[e4 + S2[r5]] | 0;
                if (r5 < 16)
                  C2 += p2(M2, T2, I2) + a3[0];
                else if (r5 < 32)
                  C2 += v2(M2, T2, I2) + a3[1];
                else if (r5 < 48)
                  C2 += g2(M2, T2, I2) + a3[2];
                else if (r5 < 64)
                  C2 += y(M2, T2, I2) + a3[3];
                else
                  C2 += m2(M2, T2, I2) + a3[4];
                C2 |= 0;
                C2 = w2(C2, b2[r5]);
                C2 = C2 + A2 | 0;
                D2 = A2;
                A2 = I2;
                I2 = w2(T2, 10);
                T2 = M2;
                M2 = C2;
                C2 = x2 + t5[e4 + _2[r5]] | 0;
                if (r5 < 16)
                  C2 += m2(R2, B2, O2) + d3[0];
                else if (r5 < 32)
                  C2 += y(R2, B2, O2) + d3[1];
                else if (r5 < 48)
                  C2 += g2(R2, B2, O2) + d3[2];
                else if (r5 < 64)
                  C2 += v2(R2, B2, O2) + d3[3];
                else
                  C2 += p2(R2, B2, O2) + d3[4];
                C2 |= 0;
                C2 = w2(C2, E2[r5]);
                C2 = C2 + k | 0;
                x2 = k;
                k = O2;
                O2 = w2(B2, 10);
                B2 = R2;
                R2 = C2;
              }
              C2 = s3[1] + T2 + O2 | 0;
              s3[1] = s3[2] + I2 + k | 0;
              s3[2] = s3[3] + A2 + x2 | 0;
              s3[3] = s3[4] + D2 + R2 | 0;
              s3[4] = s3[0] + M2 + B2 | 0;
              s3[0] = C2;
            }, _doFinalize: function() {
              var t5 = this._data;
              var e4 = t5.words;
              var r5 = 8 * this._nDataBytes;
              var i4 = 8 * t5.sigBytes;
              e4[i4 >>> 5] |= 128 << 24 - i4 % 32;
              e4[(i4 + 64 >>> 9 << 4) + 14] = 16711935 & (r5 << 8 | r5 >>> 24) | 4278255360 & (r5 << 24 | r5 >>> 8);
              t5.sigBytes = 4 * (e4.length + 1);
              this._process();
              var n3 = this._hash;
              var s3 = n3.words;
              for (var a3 = 0; a3 < 5; a3++) {
                var o3 = s3[a3];
                s3[a3] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
              }
              return n3;
            }, clone: function() {
              var t5 = s2.clone.call(this);
              t5._hash = this._hash.clone();
              return t5;
            } });
            function p2(t5, e4, r5) {
              return t5 ^ e4 ^ r5;
            }
            function v2(t5, e4, r5) {
              return t5 & e4 | ~t5 & r5;
            }
            function g2(t5, e4, r5) {
              return (t5 | ~e4) ^ r5;
            }
            function y(t5, e4, r5) {
              return t5 & r5 | e4 & ~r5;
            }
            function m2(t5, e4, r5) {
              return t5 ^ (e4 | ~r5);
            }
            function w2(t5, e4) {
              return t5 << e4 | t5 >>> 32 - e4;
            }
            r4.RIPEMD160 = s2._createHelper(d2);
            r4.HmacRIPEMD160 = s2._createHmacHelper(d2);
          })();
          return t4.RIPEMD160;
        });
      }, 2783: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = r4.Hasher;
            var s2 = e3.algo;
            var a2 = [];
            var o2 = s2.SHA1 = n2.extend({ _doReset: function() {
              this._hash = new i3.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            }, _doProcessBlock: function(t5, e4) {
              var r5 = this._hash.words;
              var i4 = r5[0];
              var n3 = r5[1];
              var s3 = r5[2];
              var o3 = r5[3];
              var u2 = r5[4];
              for (var c2 = 0; c2 < 80; c2++) {
                if (c2 < 16)
                  a2[c2] = 0 | t5[e4 + c2];
                else {
                  var l2 = a2[c2 - 3] ^ a2[c2 - 8] ^ a2[c2 - 14] ^ a2[c2 - 16];
                  a2[c2] = l2 << 1 | l2 >>> 31;
                }
                var f2 = (i4 << 5 | i4 >>> 27) + u2 + a2[c2];
                if (c2 < 20)
                  f2 += (n3 & s3 | ~n3 & o3) + 1518500249;
                else if (c2 < 40)
                  f2 += (n3 ^ s3 ^ o3) + 1859775393;
                else if (c2 < 60)
                  f2 += (n3 & s3 | n3 & o3 | s3 & o3) - 1894007588;
                else
                  f2 += (n3 ^ s3 ^ o3) - 899497514;
                u2 = o3;
                o3 = s3;
                s3 = n3 << 30 | n3 >>> 2;
                n3 = i4;
                i4 = f2;
              }
              r5[0] = r5[0] + i4 | 0;
              r5[1] = r5[1] + n3 | 0;
              r5[2] = r5[2] + s3 | 0;
              r5[3] = r5[3] + o3 | 0;
              r5[4] = r5[4] + u2 | 0;
            }, _doFinalize: function() {
              var t5 = this._data;
              var e4 = t5.words;
              var r5 = 8 * this._nDataBytes;
              var i4 = 8 * t5.sigBytes;
              e4[i4 >>> 5] |= 128 << 24 - i4 % 32;
              e4[(i4 + 64 >>> 9 << 4) + 14] = Math.floor(r5 / 4294967296);
              e4[(i4 + 64 >>> 9 << 4) + 15] = r5;
              t5.sigBytes = 4 * e4.length;
              this._process();
              return this._hash;
            }, clone: function() {
              var t5 = n2.clone.call(this);
              t5._hash = this._hash.clone();
              return t5;
            } });
            e3.SHA1 = n2._createHelper(o2);
            e3.HmacSHA1 = n2._createHmacHelper(o2);
          })();
          return t4.SHA1;
        });
      }, 7792: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(2153));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = e3.algo;
            var s2 = n2.SHA256;
            var a2 = n2.SHA224 = s2.extend({ _doReset: function() {
              this._hash = new i3.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
            }, _doFinalize: function() {
              var t5 = s2._doFinalize.call(this);
              t5.sigBytes -= 4;
              return t5;
            } });
            e3.SHA224 = s2._createHelper(a2);
            e3.HmacSHA224 = s2._createHmacHelper(a2);
          })();
          return t4.SHA224;
        });
      }, 2153: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.WordArray;
            var s2 = i3.Hasher;
            var a2 = r4.algo;
            var o2 = [];
            var u2 = [];
            (function() {
              function t5(t6) {
                var r6 = e3.sqrt(t6);
                for (var i5 = 2; i5 <= r6; i5++)
                  if (!(t6 % i5))
                    return false;
                return true;
              }
              function r5(t6) {
                return 4294967296 * (t6 - (0 | t6)) | 0;
              }
              var i4 = 2;
              var n3 = 0;
              while (n3 < 64) {
                if (t5(i4)) {
                  if (n3 < 8)
                    o2[n3] = r5(e3.pow(i4, 1 / 2));
                  u2[n3] = r5(e3.pow(i4, 1 / 3));
                  n3++;
                }
                i4++;
              }
            })();
            var c2 = [];
            var l2 = a2.SHA256 = s2.extend({ _doReset: function() {
              this._hash = new n2.init(o2.slice(0));
            }, _doProcessBlock: function(t5, e4) {
              var r5 = this._hash.words;
              var i4 = r5[0];
              var n3 = r5[1];
              var s3 = r5[2];
              var a3 = r5[3];
              var o3 = r5[4];
              var l3 = r5[5];
              var f2 = r5[6];
              var h2 = r5[7];
              for (var d2 = 0; d2 < 64; d2++) {
                if (d2 < 16)
                  c2[d2] = 0 | t5[e4 + d2];
                else {
                  var p2 = c2[d2 - 15];
                  var v2 = (p2 << 25 | p2 >>> 7) ^ (p2 << 14 | p2 >>> 18) ^ p2 >>> 3;
                  var g2 = c2[d2 - 2];
                  var y = (g2 << 15 | g2 >>> 17) ^ (g2 << 13 | g2 >>> 19) ^ g2 >>> 10;
                  c2[d2] = v2 + c2[d2 - 7] + y + c2[d2 - 16];
                }
                var m2 = o3 & l3 ^ ~o3 & f2;
                var w2 = i4 & n3 ^ i4 & s3 ^ n3 & s3;
                var S2 = (i4 << 30 | i4 >>> 2) ^ (i4 << 19 | i4 >>> 13) ^ (i4 << 10 | i4 >>> 22);
                var _2 = (o3 << 26 | o3 >>> 6) ^ (o3 << 21 | o3 >>> 11) ^ (o3 << 7 | o3 >>> 25);
                var b2 = h2 + _2 + m2 + u2[d2] + c2[d2];
                var E2 = S2 + w2;
                h2 = f2;
                f2 = l3;
                l3 = o3;
                o3 = a3 + b2 | 0;
                a3 = s3;
                s3 = n3;
                n3 = i4;
                i4 = b2 + E2 | 0;
              }
              r5[0] = r5[0] + i4 | 0;
              r5[1] = r5[1] + n3 | 0;
              r5[2] = r5[2] + s3 | 0;
              r5[3] = r5[3] + a3 | 0;
              r5[4] = r5[4] + o3 | 0;
              r5[5] = r5[5] + l3 | 0;
              r5[6] = r5[6] + f2 | 0;
              r5[7] = r5[7] + h2 | 0;
            }, _doFinalize: function() {
              var t5 = this._data;
              var r5 = t5.words;
              var i4 = 8 * this._nDataBytes;
              var n3 = 8 * t5.sigBytes;
              r5[n3 >>> 5] |= 128 << 24 - n3 % 32;
              r5[(n3 + 64 >>> 9 << 4) + 14] = e3.floor(i4 / 4294967296);
              r5[(n3 + 64 >>> 9 << 4) + 15] = i4;
              t5.sigBytes = 4 * r5.length;
              this._process();
              return this._hash;
            }, clone: function() {
              var t5 = s2.clone.call(this);
              t5._hash = this._hash.clone();
              return t5;
            } });
            r4.SHA256 = s2._createHelper(l2);
            r4.HmacSHA256 = s2._createHmacHelper(l2);
          })(Math);
          return t4.SHA256;
        });
      }, 3327: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(4938));
        })(this, function(t4) {
          (function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.WordArray;
            var s2 = i3.Hasher;
            var a2 = r4.x64;
            var o2 = a2.Word;
            var u2 = r4.algo;
            var c2 = [];
            var l2 = [];
            var f2 = [];
            (function() {
              var t5 = 1, e4 = 0;
              for (var r5 = 0; r5 < 24; r5++) {
                c2[t5 + 5 * e4] = (r5 + 1) * (r5 + 2) / 2 % 64;
                var i4 = e4 % 5;
                var n3 = (2 * t5 + 3 * e4) % 5;
                t5 = i4;
                e4 = n3;
              }
              for (var t5 = 0; t5 < 5; t5++)
                for (var e4 = 0; e4 < 5; e4++)
                  l2[t5 + 5 * e4] = e4 + (2 * t5 + 3 * e4) % 5 * 5;
              var s3 = 1;
              for (var a3 = 0; a3 < 24; a3++) {
                var u3 = 0;
                var h3 = 0;
                for (var d3 = 0; d3 < 7; d3++) {
                  if (1 & s3) {
                    var p2 = (1 << d3) - 1;
                    if (p2 < 32)
                      h3 ^= 1 << p2;
                    else
                      u3 ^= 1 << p2 - 32;
                  }
                  if (128 & s3)
                    s3 = s3 << 1 ^ 113;
                  else
                    s3 <<= 1;
                }
                f2[a3] = o2.create(u3, h3);
              }
            })();
            var h2 = [];
            (function() {
              for (var t5 = 0; t5 < 25; t5++)
                h2[t5] = o2.create();
            })();
            var d2 = u2.SHA3 = s2.extend({ cfg: s2.cfg.extend({ outputLength: 512 }), _doReset: function() {
              var t5 = this._state = [];
              for (var e4 = 0; e4 < 25; e4++)
                t5[e4] = new o2.init();
              this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            }, _doProcessBlock: function(t5, e4) {
              var r5 = this._state;
              var i4 = this.blockSize / 2;
              for (var n3 = 0; n3 < i4; n3++) {
                var s3 = t5[e4 + 2 * n3];
                var a3 = t5[e4 + 2 * n3 + 1];
                s3 = 16711935 & (s3 << 8 | s3 >>> 24) | 4278255360 & (s3 << 24 | s3 >>> 8);
                a3 = 16711935 & (a3 << 8 | a3 >>> 24) | 4278255360 & (a3 << 24 | a3 >>> 8);
                var o3 = r5[n3];
                o3.high ^= a3;
                o3.low ^= s3;
              }
              for (var u3 = 0; u3 < 24; u3++) {
                for (var d3 = 0; d3 < 5; d3++) {
                  var p2 = 0, v2 = 0;
                  for (var g2 = 0; g2 < 5; g2++) {
                    var o3 = r5[d3 + 5 * g2];
                    p2 ^= o3.high;
                    v2 ^= o3.low;
                  }
                  var y = h2[d3];
                  y.high = p2;
                  y.low = v2;
                }
                for (var d3 = 0; d3 < 5; d3++) {
                  var m2 = h2[(d3 + 4) % 5];
                  var w2 = h2[(d3 + 1) % 5];
                  var S2 = w2.high;
                  var _2 = w2.low;
                  var p2 = m2.high ^ (S2 << 1 | _2 >>> 31);
                  var v2 = m2.low ^ (_2 << 1 | S2 >>> 31);
                  for (var g2 = 0; g2 < 5; g2++) {
                    var o3 = r5[d3 + 5 * g2];
                    o3.high ^= p2;
                    o3.low ^= v2;
                  }
                }
                for (var b2 = 1; b2 < 25; b2++) {
                  var p2;
                  var v2;
                  var o3 = r5[b2];
                  var E2 = o3.high;
                  var D2 = o3.low;
                  var M2 = c2[b2];
                  if (M2 < 32) {
                    p2 = E2 << M2 | D2 >>> 32 - M2;
                    v2 = D2 << M2 | E2 >>> 32 - M2;
                  } else {
                    p2 = D2 << M2 - 32 | E2 >>> 64 - M2;
                    v2 = E2 << M2 - 32 | D2 >>> 64 - M2;
                  }
                  var T2 = h2[l2[b2]];
                  T2.high = p2;
                  T2.low = v2;
                }
                var I2 = h2[0];
                var A2 = r5[0];
                I2.high = A2.high;
                I2.low = A2.low;
                for (var d3 = 0; d3 < 5; d3++)
                  for (var g2 = 0; g2 < 5; g2++) {
                    var b2 = d3 + 5 * g2;
                    var o3 = r5[b2];
                    var x2 = h2[b2];
                    var R2 = h2[(d3 + 1) % 5 + 5 * g2];
                    var B2 = h2[(d3 + 2) % 5 + 5 * g2];
                    o3.high = x2.high ^ ~R2.high & B2.high;
                    o3.low = x2.low ^ ~R2.low & B2.low;
                  }
                var o3 = r5[0];
                var O2 = f2[u3];
                o3.high ^= O2.high;
                o3.low ^= O2.low;
              }
            }, _doFinalize: function() {
              var t5 = this._data;
              var r5 = t5.words;
              8 * this._nDataBytes;
              var s3 = 8 * t5.sigBytes;
              var a3 = 32 * this.blockSize;
              r5[s3 >>> 5] |= 1 << 24 - s3 % 32;
              r5[(e3.ceil((s3 + 1) / a3) * a3 >>> 5) - 1] |= 128;
              t5.sigBytes = 4 * r5.length;
              this._process();
              var o3 = this._state;
              var u3 = this.cfg.outputLength / 8;
              var c3 = u3 / 8;
              var l3 = [];
              for (var f3 = 0; f3 < c3; f3++) {
                var h3 = o3[f3];
                var d3 = h3.high;
                var p2 = h3.low;
                d3 = 16711935 & (d3 << 8 | d3 >>> 24) | 4278255360 & (d3 << 24 | d3 >>> 8);
                p2 = 16711935 & (p2 << 8 | p2 >>> 24) | 4278255360 & (p2 << 24 | p2 >>> 8);
                l3.push(p2);
                l3.push(d3);
              }
              return new n2.init(l3, u3);
            }, clone: function() {
              var t5 = s2.clone.call(this);
              var e4 = t5._state = this._state.slice(0);
              for (var r5 = 0; r5 < 25; r5++)
                e4[r5] = e4[r5].clone();
              return t5;
            } });
            r4.SHA3 = s2._createHelper(d2);
            r4.HmacSHA3 = s2._createHmacHelper(d2);
          })(Math);
          return t4.SHA3;
        });
      }, 7460: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(4938), r3(34));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.x64;
            var i3 = r4.Word;
            var n2 = r4.WordArray;
            var s2 = e3.algo;
            var a2 = s2.SHA512;
            var o2 = s2.SHA384 = a2.extend({ _doReset: function() {
              this._hash = new n2.init([new i3.init(3418070365, 3238371032), new i3.init(1654270250, 914150663), new i3.init(2438529370, 812702999), new i3.init(355462360, 4144912697), new i3.init(1731405415, 4290775857), new i3.init(2394180231, 1750603025), new i3.init(3675008525, 1694076839), new i3.init(1203062813, 3204075428)]);
            }, _doFinalize: function() {
              var t5 = a2._doFinalize.call(this);
              t5.sigBytes -= 16;
              return t5;
            } });
            e3.SHA384 = a2._createHelper(o2);
            e3.HmacSHA384 = a2._createHmacHelper(o2);
          })();
          return t4.SHA384;
        });
      }, 34: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(4938));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.Hasher;
            var n2 = e3.x64;
            var s2 = n2.Word;
            var a2 = n2.WordArray;
            var o2 = e3.algo;
            function u2() {
              return s2.create.apply(s2, arguments);
            }
            var c2 = [u2(1116352408, 3609767458), u2(1899447441, 602891725), u2(3049323471, 3964484399), u2(3921009573, 2173295548), u2(961987163, 4081628472), u2(1508970993, 3053834265), u2(2453635748, 2937671579), u2(2870763221, 3664609560), u2(3624381080, 2734883394), u2(310598401, 1164996542), u2(607225278, 1323610764), u2(1426881987, 3590304994), u2(1925078388, 4068182383), u2(2162078206, 991336113), u2(2614888103, 633803317), u2(3248222580, 3479774868), u2(3835390401, 2666613458), u2(4022224774, 944711139), u2(264347078, 2341262773), u2(604807628, 2007800933), u2(770255983, 1495990901), u2(1249150122, 1856431235), u2(1555081692, 3175218132), u2(1996064986, 2198950837), u2(2554220882, 3999719339), u2(2821834349, 766784016), u2(2952996808, 2566594879), u2(3210313671, 3203337956), u2(3336571891, 1034457026), u2(3584528711, 2466948901), u2(113926993, 3758326383), u2(338241895, 168717936), u2(666307205, 1188179964), u2(773529912, 1546045734), u2(1294757372, 1522805485), u2(1396182291, 2643833823), u2(1695183700, 2343527390), u2(1986661051, 1014477480), u2(2177026350, 1206759142), u2(2456956037, 344077627), u2(2730485921, 1290863460), u2(2820302411, 3158454273), u2(3259730800, 3505952657), u2(3345764771, 106217008), u2(3516065817, 3606008344), u2(3600352804, 1432725776), u2(4094571909, 1467031594), u2(275423344, 851169720), u2(430227734, 3100823752), u2(506948616, 1363258195), u2(659060556, 3750685593), u2(883997877, 3785050280), u2(958139571, 3318307427), u2(1322822218, 3812723403), u2(1537002063, 2003034995), u2(1747873779, 3602036899), u2(1955562222, 1575990012), u2(2024104815, 1125592928), u2(2227730452, 2716904306), u2(2361852424, 442776044), u2(2428436474, 593698344), u2(2756734187, 3733110249), u2(3204031479, 2999351573), u2(3329325298, 3815920427), u2(3391569614, 3928383900), u2(3515267271, 566280711), u2(3940187606, 3454069534), u2(4118630271, 4000239992), u2(116418474, 1914138554), u2(174292421, 2731055270), u2(289380356, 3203993006), u2(460393269, 320620315), u2(685471733, 587496836), u2(852142971, 1086792851), u2(1017036298, 365543100), u2(1126000580, 2618297676), u2(1288033470, 3409855158), u2(1501505948, 4234509866), u2(1607167915, 987167468), u2(1816402316, 1246189591)];
            var l2 = [];
            (function() {
              for (var t5 = 0; t5 < 80; t5++)
                l2[t5] = u2();
            })();
            var f2 = o2.SHA512 = i3.extend({ _doReset: function() {
              this._hash = new a2.init([new s2.init(1779033703, 4089235720), new s2.init(3144134277, 2227873595), new s2.init(1013904242, 4271175723), new s2.init(2773480762, 1595750129), new s2.init(1359893119, 2917565137), new s2.init(2600822924, 725511199), new s2.init(528734635, 4215389547), new s2.init(1541459225, 327033209)]);
            }, _doProcessBlock: function(t5, e4) {
              var r5 = this._hash.words;
              var i4 = r5[0];
              var n3 = r5[1];
              var s3 = r5[2];
              var a3 = r5[3];
              var o3 = r5[4];
              var u3 = r5[5];
              var f3 = r5[6];
              var h2 = r5[7];
              var d2 = i4.high;
              var p2 = i4.low;
              var v2 = n3.high;
              var g2 = n3.low;
              var y = s3.high;
              var m2 = s3.low;
              var w2 = a3.high;
              var S2 = a3.low;
              var _2 = o3.high;
              var b2 = o3.low;
              var E2 = u3.high;
              var D2 = u3.low;
              var M2 = f3.high;
              var T2 = f3.low;
              var I2 = h2.high;
              var A2 = h2.low;
              var x2 = d2;
              var R2 = p2;
              var B2 = v2;
              var O2 = g2;
              var k = y;
              var C2 = m2;
              var N2 = w2;
              var P2 = S2;
              var V2 = _2;
              var L2 = b2;
              var H2 = E2;
              var K2 = D2;
              var U2 = M2;
              var j2 = T2;
              var q2 = I2;
              var F2 = A2;
              for (var z2 = 0; z2 < 80; z2++) {
                var G2;
                var Y2;
                var W2 = l2[z2];
                if (z2 < 16) {
                  Y2 = W2.high = 0 | t5[e4 + 2 * z2];
                  G2 = W2.low = 0 | t5[e4 + 2 * z2 + 1];
                } else {
                  var J2 = l2[z2 - 15];
                  var Z2 = J2.high;
                  var $2 = J2.low;
                  var X2 = (Z2 >>> 1 | $2 << 31) ^ (Z2 >>> 8 | $2 << 24) ^ Z2 >>> 7;
                  var Q2 = ($2 >>> 1 | Z2 << 31) ^ ($2 >>> 8 | Z2 << 24) ^ ($2 >>> 7 | Z2 << 25);
                  var tt2 = l2[z2 - 2];
                  var et2 = tt2.high;
                  var rt2 = tt2.low;
                  var it2 = (et2 >>> 19 | rt2 << 13) ^ (et2 << 3 | rt2 >>> 29) ^ et2 >>> 6;
                  var nt2 = (rt2 >>> 19 | et2 << 13) ^ (rt2 << 3 | et2 >>> 29) ^ (rt2 >>> 6 | et2 << 26);
                  var st2 = l2[z2 - 7];
                  var at2 = st2.high;
                  var ot2 = st2.low;
                  var ut2 = l2[z2 - 16];
                  var ct2 = ut2.high;
                  var lt2 = ut2.low;
                  G2 = Q2 + ot2;
                  Y2 = X2 + at2 + (G2 >>> 0 < Q2 >>> 0 ? 1 : 0);
                  G2 += nt2;
                  Y2 = Y2 + it2 + (G2 >>> 0 < nt2 >>> 0 ? 1 : 0);
                  G2 += lt2;
                  Y2 = Y2 + ct2 + (G2 >>> 0 < lt2 >>> 0 ? 1 : 0);
                  W2.high = Y2;
                  W2.low = G2;
                }
                var ft2 = V2 & H2 ^ ~V2 & U2;
                var ht2 = L2 & K2 ^ ~L2 & j2;
                var dt2 = x2 & B2 ^ x2 & k ^ B2 & k;
                var pt2 = R2 & O2 ^ R2 & C2 ^ O2 & C2;
                var vt2 = (x2 >>> 28 | R2 << 4) ^ (x2 << 30 | R2 >>> 2) ^ (x2 << 25 | R2 >>> 7);
                var gt2 = (R2 >>> 28 | x2 << 4) ^ (R2 << 30 | x2 >>> 2) ^ (R2 << 25 | x2 >>> 7);
                var yt2 = (V2 >>> 14 | L2 << 18) ^ (V2 >>> 18 | L2 << 14) ^ (V2 << 23 | L2 >>> 9);
                var mt2 = (L2 >>> 14 | V2 << 18) ^ (L2 >>> 18 | V2 << 14) ^ (L2 << 23 | V2 >>> 9);
                var wt2 = c2[z2];
                var St2 = wt2.high;
                var _t2 = wt2.low;
                var bt = F2 + mt2;
                var Et = q2 + yt2 + (bt >>> 0 < F2 >>> 0 ? 1 : 0);
                var bt = bt + ht2;
                var Et = Et + ft2 + (bt >>> 0 < ht2 >>> 0 ? 1 : 0);
                var bt = bt + _t2;
                var Et = Et + St2 + (bt >>> 0 < _t2 >>> 0 ? 1 : 0);
                var bt = bt + G2;
                var Et = Et + Y2 + (bt >>> 0 < G2 >>> 0 ? 1 : 0);
                var Dt = gt2 + pt2;
                var Mt = vt2 + dt2 + (Dt >>> 0 < gt2 >>> 0 ? 1 : 0);
                q2 = U2;
                F2 = j2;
                U2 = H2;
                j2 = K2;
                H2 = V2;
                K2 = L2;
                L2 = P2 + bt | 0;
                V2 = N2 + Et + (L2 >>> 0 < P2 >>> 0 ? 1 : 0) | 0;
                N2 = k;
                P2 = C2;
                k = B2;
                C2 = O2;
                B2 = x2;
                O2 = R2;
                R2 = bt + Dt | 0;
                x2 = Et + Mt + (R2 >>> 0 < bt >>> 0 ? 1 : 0) | 0;
              }
              p2 = i4.low = p2 + R2;
              i4.high = d2 + x2 + (p2 >>> 0 < R2 >>> 0 ? 1 : 0);
              g2 = n3.low = g2 + O2;
              n3.high = v2 + B2 + (g2 >>> 0 < O2 >>> 0 ? 1 : 0);
              m2 = s3.low = m2 + C2;
              s3.high = y + k + (m2 >>> 0 < C2 >>> 0 ? 1 : 0);
              S2 = a3.low = S2 + P2;
              a3.high = w2 + N2 + (S2 >>> 0 < P2 >>> 0 ? 1 : 0);
              b2 = o3.low = b2 + L2;
              o3.high = _2 + V2 + (b2 >>> 0 < L2 >>> 0 ? 1 : 0);
              D2 = u3.low = D2 + K2;
              u3.high = E2 + H2 + (D2 >>> 0 < K2 >>> 0 ? 1 : 0);
              T2 = f3.low = T2 + j2;
              f3.high = M2 + U2 + (T2 >>> 0 < j2 >>> 0 ? 1 : 0);
              A2 = h2.low = A2 + F2;
              h2.high = I2 + q2 + (A2 >>> 0 < F2 >>> 0 ? 1 : 0);
            }, _doFinalize: function() {
              var t5 = this._data;
              var e4 = t5.words;
              var r5 = 8 * this._nDataBytes;
              var i4 = 8 * t5.sigBytes;
              e4[i4 >>> 5] |= 128 << 24 - i4 % 32;
              e4[(i4 + 128 >>> 10 << 5) + 30] = Math.floor(r5 / 4294967296);
              e4[(i4 + 128 >>> 10 << 5) + 31] = r5;
              t5.sigBytes = 4 * e4.length;
              this._process();
              var n3 = this._hash.toX32();
              return n3;
            }, clone: function() {
              var t5 = i3.clone.call(this);
              t5._hash = this._hash.clone();
              return t5;
            }, blockSize: 1024 / 32 });
            e3.SHA512 = i3._createHelper(f2);
            e3.HmacSHA512 = i3._createHmacHelper(f2);
          })();
          return t4.SHA512;
        });
      }, 4253: function(t3, e2, r3) {
        (function(i3, n2, s2) {
          t3.exports = n2(r3(8249), r3(8269), r3(8214), r3(888), r3(5109));
        })(this, function(t4) {
          (function() {
            var e3 = t4;
            var r4 = e3.lib;
            var i3 = r4.WordArray;
            var n2 = r4.BlockCipher;
            var s2 = e3.algo;
            var a2 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];
            var o2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
            var u2 = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
            var c2 = [{ 0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378 }, { 0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672 }, { 0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792 }, { 0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464 }, { 0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040 }, { 0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656 }, { 0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577 }, { 0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848 }];
            var l2 = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679];
            var f2 = s2.DES = n2.extend({ _doReset: function() {
              var t5 = this._key;
              var e4 = t5.words;
              var r5 = [];
              for (var i4 = 0; i4 < 56; i4++) {
                var n3 = a2[i4] - 1;
                r5[i4] = e4[n3 >>> 5] >>> 31 - n3 % 32 & 1;
              }
              var s3 = this._subKeys = [];
              for (var c3 = 0; c3 < 16; c3++) {
                var l3 = s3[c3] = [];
                var f3 = u2[c3];
                for (var i4 = 0; i4 < 24; i4++) {
                  l3[i4 / 6 | 0] |= r5[(o2[i4] - 1 + f3) % 28] << 31 - i4 % 6;
                  l3[4 + (i4 / 6 | 0)] |= r5[28 + (o2[i4 + 24] - 1 + f3) % 28] << 31 - i4 % 6;
                }
                l3[0] = l3[0] << 1 | l3[0] >>> 31;
                for (var i4 = 1; i4 < 7; i4++)
                  l3[i4] = l3[i4] >>> 4 * (i4 - 1) + 3;
                l3[7] = l3[7] << 5 | l3[7] >>> 27;
              }
              var h3 = this._invSubKeys = [];
              for (var i4 = 0; i4 < 16; i4++)
                h3[i4] = s3[15 - i4];
            }, encryptBlock: function(t5, e4) {
              this._doCryptBlock(t5, e4, this._subKeys);
            }, decryptBlock: function(t5, e4) {
              this._doCryptBlock(t5, e4, this._invSubKeys);
            }, _doCryptBlock: function(t5, e4, r5) {
              this._lBlock = t5[e4];
              this._rBlock = t5[e4 + 1];
              h2.call(this, 4, 252645135);
              h2.call(this, 16, 65535);
              d2.call(this, 2, 858993459);
              d2.call(this, 8, 16711935);
              h2.call(this, 1, 1431655765);
              for (var i4 = 0; i4 < 16; i4++) {
                var n3 = r5[i4];
                var s3 = this._lBlock;
                var a3 = this._rBlock;
                var o3 = 0;
                for (var u3 = 0; u3 < 8; u3++)
                  o3 |= c2[u3][((a3 ^ n3[u3]) & l2[u3]) >>> 0];
                this._lBlock = a3;
                this._rBlock = s3 ^ o3;
              }
              var f3 = this._lBlock;
              this._lBlock = this._rBlock;
              this._rBlock = f3;
              h2.call(this, 1, 1431655765);
              d2.call(this, 8, 16711935);
              d2.call(this, 2, 858993459);
              h2.call(this, 16, 65535);
              h2.call(this, 4, 252645135);
              t5[e4] = this._lBlock;
              t5[e4 + 1] = this._rBlock;
            }, keySize: 64 / 32, ivSize: 64 / 32, blockSize: 64 / 32 });
            function h2(t5, e4) {
              var r5 = (this._lBlock >>> t5 ^ this._rBlock) & e4;
              this._rBlock ^= r5;
              this._lBlock ^= r5 << t5;
            }
            function d2(t5, e4) {
              var r5 = (this._rBlock >>> t5 ^ this._lBlock) & e4;
              this._lBlock ^= r5;
              this._rBlock ^= r5 << t5;
            }
            e3.DES = n2._createHelper(f2);
            var p2 = s2.TripleDES = n2.extend({ _doReset: function() {
              var t5 = this._key;
              var e4 = t5.words;
              if (2 !== e4.length && 4 !== e4.length && e4.length < 6)
                throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
              var r5 = e4.slice(0, 2);
              var n3 = e4.length < 4 ? e4.slice(0, 2) : e4.slice(2, 4);
              var s3 = e4.length < 6 ? e4.slice(0, 2) : e4.slice(4, 6);
              this._des1 = f2.createEncryptor(i3.create(r5));
              this._des2 = f2.createEncryptor(i3.create(n3));
              this._des3 = f2.createEncryptor(i3.create(s3));
            }, encryptBlock: function(t5, e4) {
              this._des1.encryptBlock(t5, e4);
              this._des2.decryptBlock(t5, e4);
              this._des3.encryptBlock(t5, e4);
            }, decryptBlock: function(t5, e4) {
              this._des3.decryptBlock(t5, e4);
              this._des2.encryptBlock(t5, e4);
              this._des1.decryptBlock(t5, e4);
            }, keySize: 192 / 32, ivSize: 64 / 32, blockSize: 64 / 32 });
            e3.TripleDES = n2._createHelper(p2);
          })();
          return t4.TripleDES;
        });
      }, 4938: function(t3, e2, r3) {
        (function(i3, n2) {
          t3.exports = n2(r3(8249));
        })(this, function(t4) {
          (function(e3) {
            var r4 = t4;
            var i3 = r4.lib;
            var n2 = i3.Base;
            var s2 = i3.WordArray;
            var a2 = r4.x64 = {};
            a2.Word = n2.extend({ init: function(t5, e4) {
              this.high = t5;
              this.low = e4;
            } });
            a2.WordArray = n2.extend({ init: function(t5, r5) {
              t5 = this.words = t5 || [];
              if (r5 != e3)
                this.sigBytes = r5;
              else
                this.sigBytes = 8 * t5.length;
            }, toX32: function() {
              var t5 = this.words;
              var e4 = t5.length;
              var r5 = [];
              for (var i4 = 0; i4 < e4; i4++) {
                var n3 = t5[i4];
                r5.push(n3.high);
                r5.push(n3.low);
              }
              return s2.create(r5, this.sigBytes);
            }, clone: function() {
              var t5 = n2.clone.call(this);
              var e4 = t5.words = this.words.slice(0);
              var r5 = e4.length;
              for (var i4 = 0; i4 < r5; i4++)
                e4[i4] = e4[i4].clone();
              return t5;
            } });
          })();
          return t4;
        });
      }, 3118: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        e2.ErrorCode = void 0;
        (function(t4) {
          t4[t4["SUCCESS"] = 0] = "SUCCESS";
          t4[t4["CLIENT_ID_NOT_FOUND"] = 1] = "CLIENT_ID_NOT_FOUND";
          t4[t4["OPERATION_TOO_OFTEN"] = 2] = "OPERATION_TOO_OFTEN";
          t4[t4["REPEAT_MESSAGE"] = 3] = "REPEAT_MESSAGE";
          t4[t4["TIME_OUT"] = 4] = "TIME_OUT";
        })(e2.ErrorCode || (e2.ErrorCode = {}));
      }, 5987: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        const n2 = i3(r3(127));
        const s2 = i3(r3(1901));
        const a2 = i3(r3(1754));
        const o2 = i3(r3(1237));
        var u2;
        (function(t4) {
          function e3(t5) {
            o2.default.debugMode = t5;
            o2.default.info(`setDebugMode: ${t5}`);
          }
          t4.setDebugMode = e3;
          function r4(t5) {
            try {
              s2.default.init(t5);
            } catch (t6) {
              o2.default.error(`init error`, t6);
            }
          }
          t4.init = r4;
          function i4(t5) {
            try {
              if (!t5.url)
                throw new Error("invalid url");
              if (!t5.key || !t5.keyId)
                throw new Error("invalid key or keyId");
              a2.default.socketUrl = t5.url;
              a2.default.publicKeyId = t5.keyId;
              a2.default.publicKey = t5.key;
            } catch (t6) {
              o2.default.error(`setSocketServer error`, t6);
            }
          }
          t4.setSocketServer = i4;
          function u3(t5) {
            try {
              s2.default.enableSocket(t5);
            } catch (t6) {
              o2.default.error(`enableSocket error`, t6);
            }
          }
          t4.enableSocket = u3;
          function c2() {
            return n2.default.SDK_VERSION;
          }
          t4.getVersion = c2;
        })(u2 || (u2 = {}));
        t3.exports = u2;
      }, 2852: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(4806));
        const s2 = i3(r3(3396));
        const a2 = i3(r3(6565));
        const o2 = i3(r3(5912));
        const u2 = i3(r3(3174));
        const c2 = i3(r3(4698));
        const l2 = i3(r3(87));
        const f2 = i3(r3(523));
        const h2 = i3(r3(7252));
        const d2 = i3(r3(4668));
        const p2 = i3(r3(3072));
        const v2 = i3(r3(1996));
        const g2 = i3(r3(9342));
        const y = i3(r3(155));
        const m2 = i3(r3(3751));
        var w2;
        (function(t4) {
          let e3;
          let r4;
          let i4;
          function w3() {
            if ("undefined" != typeof uni) {
              e3 = new d2.default();
              r4 = new p2.default();
              i4 = new v2.default();
            } else if ("undefined" != typeof tt) {
              e3 = new l2.default();
              r4 = new f2.default();
              i4 = new h2.default();
            } else if ("undefined" != typeof my) {
              e3 = new n2.default();
              r4 = new s2.default();
              i4 = new a2.default();
            } else if ("undefined" != typeof wx) {
              e3 = new g2.default();
              r4 = new y.default();
              i4 = new m2.default();
            } else if ("undefined" != typeof window) {
              e3 = new o2.default();
              r4 = new u2.default();
              i4 = new c2.default();
            }
          }
          function S2() {
            if (!e3)
              w3();
            return e3;
          }
          t4.getDevice = S2;
          function _2() {
            if (!r4)
              w3();
            return r4;
          }
          t4.getStorage = _2;
          function b2() {
            if (!i4)
              w3();
            return i4;
          }
          t4.getWebSocket = b2;
        })(w2 || (w2 = {}));
        e2["default"] = w2;
      }, 7406: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(2852));
        var s2;
        (function(t4) {
          function e3() {
            return n2.default.getDevice().os();
          }
          t4.os = e3;
          function r4() {
            return n2.default.getDevice().osVersion();
          }
          t4.osVersion = r4;
          function i4() {
            return n2.default.getDevice().model();
          }
          t4.model = i4;
          function s3() {
            return n2.default.getDevice().brand();
          }
          t4.brand = s3;
          function a2() {
            return n2.default.getDevice().platform();
          }
          t4.platform = a2;
          function o2() {
            return n2.default.getDevice().platformVersion();
          }
          t4.platformVersion = o2;
          function u2() {
            return n2.default.getDevice().platformId();
          }
          t4.platformId = u2;
          function c2() {
            return n2.default.getDevice().language();
          }
          t4.language = c2;
          function l2() {
            let t5 = n2.default.getDevice().userAgent;
            if (t5)
              return t5();
            return "";
          }
          t4.userAgent = l2;
          function f2(t5) {
            n2.default.getDevice().getNetworkType(t5);
          }
          t4.getNetworkType = f2;
          function h2(t5) {
            n2.default.getDevice().onNetworkStatusChange(t5);
          }
          t4.onNetworkStatusChange = h2;
        })(s2 || (s2 = {}));
        e2["default"] = s2;
      }, 7071: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(1754));
        const s2 = i3(r3(358));
        const a2 = i3(r3(1236));
        const o2 = r3(53);
        const u2 = i3(r3(1571));
        const c2 = i3(r3(1237));
        const l2 = i3(r3(2852));
        const f2 = i3(r3(9934));
        var h2;
        (function(t4) {
          let e3;
          let r4 = false;
          let i4 = false;
          t4.allowReconnect = true;
          function h3() {
            return r4 && i4;
          }
          t4.isAvailable = h3;
          function d2(e4) {
            if (!t4.allowReconnect)
              return;
            setTimeout(function() {
              p2();
            }, e4);
          }
          t4.reconnect = d2;
          function p2() {
            t4.allowReconnect = true;
            if (!n2.default.networkConnected) {
              c2.default.info(`connect failed, network is not available`);
              return;
            }
            if (i4 || r4)
              return;
            let s3 = n2.default.socketUrl;
            try {
              let t5 = f2.default.getSync(f2.default.KEY_REDIRECT_SERVER, "");
              if (t5) {
                let e4 = o2.RedirectServerData.parse(t5);
                let r5 = e4.addressList[0].split(",");
                let i5 = r5[0];
                let n3 = Number(r5[1]);
                let a3 = new Date().getTime();
                if (a3 - e4.time < 1e3 * n3)
                  s3 = i5;
              }
            } catch (t5) {
            }
            e3 = l2.default.getWebSocket().connect({ url: s3, success: function() {
              i4 = true;
              v2();
            }, fail: function() {
              i4 = false;
              m2();
            } });
            e3.onOpen(w2);
            e3.onClose(b2);
            e3.onError(_2);
            e3.onMessage(S2);
          }
          t4.connect = p2;
          function v2() {
            if (i4 && r4) {
              s2.default.create().send();
              u2.default.getInstance().start();
            }
          }
          function g2(t5) {
            e3 == null ? void 0 : e3.close({ reason: t5, success: function(t6) {
            }, fail: function(t6) {
              m2();
            } });
          }
          t4.close = g2;
          function y(t5) {
            if (r4 && r4)
              e3 == null ? void 0 : e3.send({ data: t5, success: function(t6) {
              }, fail: function(t6) {
              } });
            else
              throw new Error(`socket not connect`);
          }
          t4.send = y;
          function m2(t5) {
            var _a, _b;
            i4 = false;
            r4 = false;
            u2.default.getInstance().cancel();
            if (n2.default.online) {
              n2.default.online = false;
              (_a = n2.default.onlineState) == null ? void 0 : _a.call(n2.default.onlineState, { online: n2.default.online });
            }
            if (n2.default.online) {
              n2.default.online = false;
              (_b = n2.default.onlineState) == null ? void 0 : _b.call(n2.default.onlineState, { online: n2.default.online });
            }
            d2(1e3);
          }
          let w2 = function(t5) {
            r4 = true;
            v2();
          };
          let S2 = function(t5) {
            try {
              t5.data;
              u2.default.getInstance().refresh();
              a2.default.receiveMessage(t5.data);
            } catch (t6) {
            }
          };
          let _2 = function(t5) {
            g2(`socket error`);
          };
          let b2 = function(t5) {
            m2();
          };
        })(h2 || (h2 = {}));
        e2["default"] = h2;
      }, 9934: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(2852));
        var s2;
        (function(t4) {
          t4.KEY_APPID = "getui_appid";
          t4.KEY_CID = "getui_cid";
          t4.KEY_SESSION = "getui_session";
          t4.KEY_REGID = "getui_regid";
          t4.KEY_SOCKET_URL = "getui_socket_url";
          t4.KEY_DEVICE_ID = "getui_deviceid";
          t4.KEY_ADD_PHONE_INFO_TIME = "getui_api_time";
          t4.KEY_BIND_ALIAS_TIME = "getui_ba_time";
          t4.KEY_SET_TAG_TIME = "getui_st_time";
          t4.KEY_REDIRECT_SERVER = "getui_redirect_server";
          function e3(t5) {
            n2.default.getStorage().set(t5);
          }
          t4.set = e3;
          function r4(t5, e4) {
            n2.default.getStorage().setSync(t5, e4);
          }
          t4.setSync = r4;
          function i4(t5) {
            n2.default.getStorage().get(t5);
          }
          t4.get = i4;
          function s3(t5, e4) {
            let r5 = n2.default.getStorage().getSync(t5);
            return r5 ? r5 : e4;
          }
          t4.getSync = s3;
        })(s2 || (s2 = {}));
        e2["default"] = s2;
      }, 4806: (t3) => {
        class e2 {
          constructor() {
            this.systemInfo = my.getSystemInfoSync();
          }
          os() {
            var _a;
            return (_a = this.systemInfo) == null ? void 0 : _a.platform;
          }
          osVersion() {
            var _a;
            return (_a = this.systemInfo) == null ? void 0 : _a.system;
          }
          model() {
            var _a;
            return (_a = this.systemInfo) == null ? void 0 : _a.model;
          }
          brand() {
            var _a;
            return (_a = this.systemInfo) == null ? void 0 : _a.brand;
          }
          platform() {
            return "MP-ALIPAY";
          }
          platformVersion() {
            return this.systemInfo.app + " " + this.systemInfo.version;
          }
          platformId() {
            return my.getAppIdSync();
          }
          language() {
            var _a;
            return (_a = this.systemInfo) == null ? void 0 : _a.language;
          }
          getNetworkType(t4) {
            my.getNetworkType({ success: (e3) => {
              var _a;
              (_a = t4.success) == null ? void 0 : _a.call(t4.success, { networkType: e3.networkType });
            }, fail: () => {
              var _a;
              (_a = t4.fail) == null ? void 0 : _a.call(t4.fail, "");
            } });
          }
          onNetworkStatusChange(t4) {
            my.onNetworkStatusChange(t4);
          }
        }
        t3.exports = e2;
      }, 3396: (t3) => {
        class e2 {
          set(t4) {
            my.setStorage({ key: t4.key, data: t4.data, success: t4.success, fail: t4.fail });
          }
          setSync(t4, e3) {
            my.setStorageSync({ key: t4, data: e3 });
          }
          get(t4) {
            my.getStorage({ key: t4.key, success: t4.success, fail: t4.fail, complete: t4.complete });
          }
          getSync(t4) {
            return my.getStorageSync({ key: t4 }).data;
          }
        }
        t3.exports = e2;
      }, 6565: (t3) => {
        class e2 {
          connect(t4) {
            my.connectSocket({ url: t4.url, header: t4.header, method: t4.method, success: t4.success, fail: t4.fail, complete: t4.complete });
            return { onOpen: my.onSocketOpen, send: my.sendSocketMessage, onMessage: (t5) => {
              my.onSocketMessage.call(my.onSocketMessage, (e3) => {
                t5.call(t5, { data: e3 ? e3.data : "" });
              });
            }, onError: my.onSocketError, onClose: my.onSocketClose, close: my.closeSocket };
          }
        }
        t3.exports = e2;
      }, 5912: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          os() {
            let t4 = window.navigator.userAgent.toLowerCase();
            if (t4.indexOf("android") > 0 || t4.indexOf("adr") > 0)
              return "android";
            if (!!t4.match(/\(i[^;]+;( u;)? cpu.+mac os x/))
              return "ios";
            if (t4.indexOf("windows") > 0 || t4.indexOf("win32") > 0 || t4.indexOf("win64") > 0)
              return "windows";
            if (t4.indexOf("macintosh") > 0 || t4.indexOf("mac os") > 0)
              return "mac os";
            if (t4.indexOf("linux") > 0)
              return "linux";
            if (t4.indexOf("unix") > 0)
              return "linux";
            return "other";
          }
          osVersion() {
            let t4 = window.navigator.userAgent.toLowerCase();
            let e3 = t4.substring(t4.indexOf(";") + 1).trim();
            if (e3.indexOf(";") > 0)
              return e3.substring(0, e3.indexOf(";")).trim();
            return e3.substring(0, e3.indexOf(")")).trim();
          }
          model() {
            return "";
          }
          brand() {
            return "";
          }
          platform() {
            return "H5";
          }
          platformVersion() {
            return "";
          }
          platformId() {
            return "";
          }
          language() {
            return window.navigator.language;
          }
          userAgent() {
            return window.navigator.userAgent;
          }
          getNetworkType(t4) {
            var _a;
            (_a = t4.success) == null ? void 0 : _a.call(t4.success, { networkType: window.navigator.connection.type });
          }
          onNetworkStatusChange(t4) {
          }
        }
        e2["default"] = r3;
      }, 3174: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          set(t4) {
            var _a;
            window.localStorage.setItem(t4.key, t4.data);
            (_a = t4.success) == null ? void 0 : _a.call(t4.success, "");
          }
          setSync(t4, e3) {
            window.localStorage.setItem(t4, e3);
          }
          get(t4) {
            var _a;
            let e3 = window.localStorage.getItem(t4.key);
            (_a = t4.success) == null ? void 0 : _a.call(t4.success, e3);
          }
          getSync(t4) {
            return window.localStorage.getItem(t4);
          }
        }
        e2["default"] = r3;
      }, 4698: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          connect(t4) {
            let e3 = new WebSocket(t4.url);
            return { send: (t5) => {
              var _a, _b;
              try {
                e3.send(t5.data);
                (_a = t5.success) == null ? void 0 : _a.call(t5.success, { errMsg: "" });
              } catch (e4) {
                (_b = t5.fail) == null ? void 0 : _b.call(t5.fail, { errMsg: e4 + "" });
              }
            }, close: (t5) => {
              var _a, _b;
              try {
                e3.close(t5.code, t5.reason);
                (_a = t5.success) == null ? void 0 : _a.call(t5.success, { errMsg: "" });
              } catch (e4) {
                (_b = t5.fail) == null ? void 0 : _b.call(t5.fail, { errMsg: e4 + "" });
              }
            }, onOpen: (r4) => {
              e3.onopen = (e4) => {
                var _a;
                (_a = t4.success) == null ? void 0 : _a.call(t4.success, "");
                r4({ header: "" });
              };
            }, onError: (r4) => {
              e3.onerror = (e4) => {
                var _a;
                (_a = t4.fail) == null ? void 0 : _a.call(t4.fail, "");
                r4({ errMsg: "" });
              };
            }, onMessage: (t5) => {
              e3.onmessage = (e4) => {
                t5({ data: e4.data });
              };
            }, onClose: (t5) => {
              e3.onclose = (e4) => {
                t5(e4);
              };
            } };
          }
        }
        e2["default"] = r3;
      }, 87: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          constructor() {
            this.systemInfo = tt.getSystemInfoSync();
          }
          os() {
            return this.systemInfo.platform;
          }
          osVersion() {
            return this.systemInfo.system;
          }
          model() {
            return this.systemInfo.model;
          }
          brand() {
            return this.systemInfo.brand;
          }
          platform() {
            return "MP-TOUTIAO";
          }
          platformVersion() {
            return this.systemInfo.appName + " " + this.systemInfo.version;
          }
          language() {
            return "";
          }
          platformId() {
            return "";
          }
          getNetworkType(t4) {
            tt.getNetworkType(t4);
          }
          onNetworkStatusChange(t4) {
            tt.onNetworkStatusChange(t4);
          }
        }
        e2["default"] = r3;
      }, 523: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          set(t4) {
            tt.setStorage(t4);
          }
          setSync(t4, e3) {
            tt.setStorageSync(t4, e3);
          }
          get(t4) {
            tt.getStorage(t4);
          }
          getSync(t4) {
            return tt.getStorageSync(t4);
          }
        }
        e2["default"] = r3;
      }, 7252: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          connect(t4) {
            let e3 = tt.connectSocket({ url: t4.url, header: t4.header, protocols: t4.protocols, success: t4.success, fail: t4.fail, complete: t4.complete });
            return { onOpen: e3.onOpen, send: e3.send, onMessage: e3.onMessage, onError: e3.onError, onClose: e3.onClose, close: e3.close };
          }
        }
        e2["default"] = r3;
      }, 4668: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          constructor() {
            try {
              this.systemInfo = uni.getSystemInfoSync();
              this.accountInfo = uni.getAccountInfoSync();
            } catch (t4) {
            }
          }
          os() {
            return this.systemInfo ? this.systemInfo.platform : "";
          }
          model() {
            return this.systemInfo ? this.systemInfo.model : "";
          }
          brand() {
            var _a;
            return ((_a = this.systemInfo) == null ? void 0 : _a.brand) ? this.systemInfo.brand : "";
          }
          osVersion() {
            return this.systemInfo ? this.systemInfo.system : "";
          }
          platform() {
            let t4 = "";
            t4 = "APP-PLUS";
            return t4;
          }
          platformVersion() {
            return this.systemInfo ? this.systemInfo.version : "";
          }
          platformId() {
            return this.accountInfo ? this.accountInfo.miniProgram.appId : "";
          }
          language() {
            var _a;
            return ((_a = this.systemInfo) == null ? void 0 : _a.language) ? this.systemInfo.language : "";
          }
          userAgent() {
            return window ? window.navigator.userAgent : "";
          }
          getNetworkType(t4) {
            uni.getNetworkType(t4);
          }
          onNetworkStatusChange(t4) {
            uni.onNetworkStatusChange(t4);
          }
        }
        e2["default"] = r3;
      }, 3072: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          set(t4) {
            uni.setStorage(t4);
          }
          setSync(t4, e3) {
            uni.setStorageSync(t4, e3);
          }
          get(t4) {
            uni.getStorage(t4);
          }
          getSync(t4) {
            return uni.getStorageSync(t4);
          }
        }
        e2["default"] = r3;
      }, 1996: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          connect(t4) {
            let e3 = uni.connectSocket(t4);
            return { send: (t5) => {
              e3 == null ? void 0 : e3.send(t5);
            }, close: (t5) => {
              e3 == null ? void 0 : e3.close(t5);
            }, onOpen: (t5) => {
              e3 == null ? void 0 : e3.onOpen(t5);
            }, onError: (t5) => {
              e3 == null ? void 0 : e3.onError(t5);
            }, onMessage: (t5) => {
              e3 == null ? void 0 : e3.onMessage(t5);
            }, onClose: (t5) => {
              e3 == null ? void 0 : e3.onClose(t5);
            } };
          }
        }
        e2["default"] = r3;
      }, 9342: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          constructor() {
            this.systemInfo = wx.getSystemInfoSync();
          }
          os() {
            return this.systemInfo.platform;
          }
          osVersion() {
            return this.systemInfo.system;
          }
          model() {
            return this.systemInfo.model;
          }
          brand() {
            return this.systemInfo.brand;
          }
          platform() {
            return "MP-WEIXIN";
          }
          platformVersion() {
            return this.systemInfo.version;
          }
          language() {
            return this.systemInfo.language;
          }
          platformId() {
            if (wx.canIUse("getAccountInfoSync"))
              return wx.getAccountInfoSync().miniProgram.appId;
            return "";
          }
          getNetworkType(t4) {
            wx.getNetworkType({ success: (e3) => {
              var _a;
              (_a = t4.success) == null ? void 0 : _a.call(t4.success, { networkType: e3.networkType });
            }, fail: t4.fail });
          }
          onNetworkStatusChange(t4) {
            wx.onNetworkStatusChange(t4);
          }
        }
        e2["default"] = r3;
      }, 155: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          set(t4) {
            wx.setStorage(t4);
          }
          setSync(t4, e3) {
            wx.setStorageSync(t4, e3);
          }
          get(t4) {
            wx.getStorage(t4);
          }
          getSync(t4) {
            return wx.getStorageSync(t4);
          }
        }
        e2["default"] = r3;
      }, 3751: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          connect(t4) {
            let e3 = wx.connectSocket({ url: t4.url, header: t4.header, protocols: t4.protocols, success: t4.success, fail: t4.fail, complete: t4.complete });
            return { onOpen: e3.onOpen, send: e3.send, onMessage: e3.onMessage, onError: e3.onError, onClose: e3.onClose, close: e3.close };
          }
        }
        e2["default"] = r3;
      }, 127: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        var r3;
        (function(t4) {
          t4.SDK_VERSION = "GTMP-2.0.1.dcloud";
          t4.DEFAULT_SOCKET_URL = "wss://wshz.getui.net:5223/nws";
          t4.SOCKET_PROTOCOL_VERSION = "1.0";
          t4.SERVER_PUBLIC_KEY = "MHwwDQYJKoZIhvcNAQEBBQADawAwaAJhAJp1rROuvBF7sBSnvLaesj2iFhMcY8aXyLvpnNLKs2wjL3JmEnyr++SlVa35liUlzi83tnAFkn3A9GB7pHBNzawyUkBh8WUhq5bnFIkk2RaDa6+5MpG84DEv52p7RR+aWwIDAQAB";
          t4.SERVER_PUBLIC_KEY_ID = "69d747c4b9f641baf4004be4297e9f3b";
        })(r3 || (r3 = {}));
        e2["default"] = r3;
      }, 1901: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(7071));
        const s2 = i3(r3(1237));
        const a2 = i3(r3(1754));
        class o2 {
          static init(t4) {
            var _a;
            if (this.inited)
              return;
            try {
              this.checkAppid(t4.appid);
              this.inited = true;
              s2.default.info(`init: appid=${t4.appid}`);
              a2.default.init(t4);
              n2.default.connect();
            } catch (e3) {
              this.inited = false;
              (_a = t4.onError) == null ? void 0 : _a.call(t4.onError, { error: e3 });
              throw e3;
            }
          }
          static enableSocket(t4) {
            this.checkInit();
            n2.default.allowReconnect = t4;
            if (t4)
              n2.default.reconnect(0);
            else
              n2.default.close(`enableSocket ${t4}`);
          }
          static checkInit() {
            if (!this.inited)
              throw new Error(`not init, please invoke init method firstly`);
          }
          static checkAppid(t4) {
            if (null == t4 || void 0 == t4 || "" == t4.trim())
              throw new Error(`invalid appid ${t4}`);
          }
        }
        o2.inited = false;
        e2["default"] = o2;
      }, 1754: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(323));
        const s2 = i3(r3(9934));
        const a2 = i3(r3(127));
        const o2 = i3(r3(7071));
        const u2 = i3(r3(1237));
        const c2 = i3(r3(5574));
        const l2 = i3(r3(7406));
        class f2 {
          static init(t4) {
            var _a;
            this.appid = c2.default.to_getui(t4.appid);
            u2.default.info(`getui appid: ${this.appid}`);
            this.onError = t4.onError;
            this.onClientId = t4.onClientId;
            this.onlineState = t4.onlineState;
            this.onPushMsg = t4.onPushMsg;
            if (this.appid != s2.default.getSync(s2.default.KEY_APPID, this.appid)) {
              u2.default.info("appid changed, clear session and cid");
              s2.default.setSync(s2.default.KEY_CID, "");
              s2.default.setSync(s2.default.KEY_SESSION, "");
            }
            s2.default.setSync(s2.default.KEY_APPID, this.appid);
            this.cid = s2.default.getSync(s2.default.KEY_CID, this.cid);
            if (this.cid)
              (_a = this.onClientId) == null ? void 0 : _a.call(this.onClientId, { cid: f2.cid });
            this.session = s2.default.getSync(s2.default.KEY_SESSION, this.session);
            this.deviceId = s2.default.getSync(s2.default.KEY_DEVICE_ID, this.deviceId);
            this.regId = s2.default.getSync(s2.default.KEY_REGID, this.regId);
            if (!this.regId) {
              this.regId = this.createRegId();
              s2.default.set({ key: s2.default.KEY_REGID, data: this.regId });
            }
            this.socketUrl = s2.default.getSync(s2.default.KEY_SOCKET_URL, this.socketUrl);
            let e3 = this;
            l2.default.getNetworkType({ success: (t5) => {
              e3.networkType = t5.networkType;
              e3.networkConnected = "none" != e3.networkType && "" != e3.networkType;
            } });
            l2.default.onNetworkStatusChange((t5) => {
              e3.networkConnected = t5.isConnected;
              e3.networkType = t5.networkType;
              if (e3.networkConnected)
                o2.default.reconnect(0);
            });
          }
          static createRegId() {
            return `M-V${n2.default.md5Hex(this.getUuid())}-${new Date().getTime()}`;
          }
          static getUuid() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t4) {
              let e3 = 16 * Math.random() | 0, r4 = "x" === t4 ? e3 : 3 & e3 | 8;
              return r4.toString(16);
            });
          }
        }
        f2.appid = "";
        f2.cid = "";
        f2.regId = "";
        f2.session = "";
        f2.deviceId = "";
        f2.packetId = 1;
        f2.online = false;
        f2.socketUrl = a2.default.DEFAULT_SOCKET_URL;
        f2.publicKeyId = a2.default.SERVER_PUBLIC_KEY_ID;
        f2.publicKey = a2.default.SERVER_PUBLIC_KEY;
        f2.lastAliasTime = 0;
        f2.networkConnected = true;
        f2.networkType = "none";
        e2["default"] = f2;
      }, 9214: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        var n2, s2;
        Object.defineProperty(e2, "__esModule", { value: true });
        const a2 = i3(r3(9800));
        const o2 = r3(3118);
        const u2 = i3(r3(1754));
        class c2 extends a2.default {
          constructor() {
            super(...arguments);
            this.actionMsgData = new l2();
          }
          static initActionMsg(t4, ...e3) {
            super.initMsg(t4);
            t4.command = a2.default.Command.CLIENT_MSG;
            t4.data = t4.actionMsgData = l2.create();
            return t4;
          }
          static parseActionMsg(t4, e3) {
            super.parseMsg(t4, e3);
            t4.actionMsgData = l2.parse(t4.data);
            return t4;
          }
          send() {
            setTimeout(() => {
              var _a;
              if (c2.waitingLoginMsgMap.has(this.actionMsgData.msgId) || c2.waitingResponseMsgMap.has(this.actionMsgData.msgId)) {
                c2.waitingLoginMsgMap.delete(this.actionMsgData.msgId);
                c2.waitingResponseMsgMap.delete(this.actionMsgData.msgId);
                (_a = this.callback) == null ? void 0 : _a.call(this.callback, { resultCode: o2.ErrorCode.TIME_OUT, message: "waiting time out" });
              }
            }, 1e4);
            if (!u2.default.online) {
              c2.waitingLoginMsgMap.set(this.actionMsgData.msgId, this);
              return;
            }
            if (this.actionMsgData.msgAction != c2.ClientAction.RECEIVED)
              c2.waitingResponseMsgMap.set(this.actionMsgData.msgId, this);
            super.send();
          }
          receive() {
          }
          static sendWaitingMessages() {
            let t4 = this.waitingLoginMsgMap.keys();
            let e3;
            while (e3 = t4.next(), !e3.done) {
              let t5 = this.waitingLoginMsgMap.get(e3.value);
              this.waitingLoginMsgMap.delete(e3.value);
              t5 == null ? void 0 : t5.send();
            }
          }
          static getWaitingResponseMessage(t4) {
            return c2.waitingResponseMsgMap.get(t4);
          }
          static removeWaitingResponseMessage(t4) {
            let e3 = c2.waitingResponseMsgMap.get(t4);
            if (e3)
              c2.waitingResponseMsgMap.delete(t4);
            return e3;
          }
        }
        c2.ServerAction = (n2 = class {
        }, n2.PUSH_MESSAGE = "pushmessage", n2.REDIRECT_SERVER = "redirect_server", n2.ADD_PHONE_INFO_RESULT = "addphoneinfo", n2.SET_MODE_RESULT = "set_mode_result", n2.SET_TAG_RESULT = "settag_result", n2.BIND_ALIAS_RESULT = "response_bind", n2.UNBIND_ALIAS_RESULT = "response_unbind", n2.FEED_BACK_RESULT = "pushmessage_feedback", n2.RECEIVED = "received", n2);
        c2.ClientAction = (s2 = class {
        }, s2.ADD_PHONE_INFO = "addphoneinfo", s2.SET_MODE = "set_mode", s2.FEED_BACK = "pushmessage_feedback", s2.SET_TAGS = "set_tag", s2.BIND_ALIAS = "bind_alias", s2.UNBIND_ALIAS = "unbind_alias", s2.RECEIVED = "received", s2);
        c2.waitingLoginMsgMap = /* @__PURE__ */ new Map();
        c2.waitingResponseMsgMap = /* @__PURE__ */ new Map();
        class l2 {
          constructor() {
            this.appId = "";
            this.cid = "";
            this.msgId = "";
            this.msgAction = "";
            this.msgData = "";
            this.msgExtraData = "";
          }
          static create() {
            let t4 = new l2();
            t4.appId = u2.default.appid;
            t4.cid = u2.default.cid;
            t4.msgId = (2147483647 & new Date().getTime()).toString();
            return t4;
          }
          static parse(t4) {
            let e3 = new l2();
            let r4 = JSON.parse(t4);
            e3.appId = r4.appId;
            e3.cid = r4.cid;
            e3.msgId = r4.msgId;
            e3.msgAction = r4.msgAction;
            e3.msgData = r4.msgData;
            e3.msgExtraData = r4.msgExtraData;
            return e3;
          }
        }
        e2["default"] = c2;
      }, 708: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(7406));
        const s2 = i3(r3(9934));
        const a2 = i3(r3(127));
        const o2 = r3(3118);
        const u2 = i3(r3(9214));
        const c2 = i3(r3(1754));
        class l2 extends u2.default {
          constructor() {
            super(...arguments);
            this.addPhoneInfoData = new f2();
          }
          static create() {
            let t4 = new l2();
            super.initActionMsg(t4);
            t4.callback = (e3) => {
              if (e3.resultCode != o2.ErrorCode.SUCCESS && e3.resultCode != o2.ErrorCode.REPEAT_MESSAGE)
                setTimeout(function() {
                  t4.send();
                }, 30 * 1e3);
              else
                s2.default.set({ key: s2.default.KEY_ADD_PHONE_INFO_TIME, data: new Date().getTime() });
            };
            t4.actionMsgData.msgAction = u2.default.ClientAction.ADD_PHONE_INFO;
            t4.addPhoneInfoData = f2.create();
            t4.actionMsgData.msgData = JSON.stringify(t4.addPhoneInfoData);
            return t4;
          }
          send() {
            let t4 = new Date().getTime();
            let e3 = s2.default.getSync(s2.default.KEY_ADD_PHONE_INFO_TIME, 0);
            if (t4 - e3 < 24 * 60 * 60 * 1e3)
              return;
            super.send();
          }
        }
        class f2 {
          constructor() {
            this.model = "";
            this.brand = "";
            this.system_version = "";
            this.version = "";
            this.deviceid = "";
            this.type = "";
          }
          static create() {
            let t4 = new f2();
            t4.model = n2.default.model();
            t4.brand = n2.default.brand();
            t4.system_version = n2.default.osVersion();
            t4.version = a2.default.SDK_VERSION;
            t4.device_token = "";
            t4.imei = "";
            t4.oaid = "";
            t4.mac = "";
            t4.idfa = "";
            t4.type = "MINIPROGRAM";
            t4.deviceid = `${t4.type}-${c2.default.deviceId}`;
            t4.extra = { os: n2.default.os(), platform: n2.default.platform(), platformVersion: n2.default.platformVersion(), platformId: n2.default.platformId(), language: n2.default.language(), userAgent: n2.default.userAgent() };
            return t4;
          }
        }
        e2["default"] = l2;
      }, 652: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        var n2, s2;
        Object.defineProperty(e2, "__esModule", { value: true });
        const a2 = i3(r3(1754));
        const o2 = r3(3118);
        const u2 = i3(r3(9214));
        class c2 extends u2.default {
          constructor() {
            super(...arguments);
            this.feedbackData = new l2();
          }
          static create(t4, e3) {
            let r4 = new c2();
            super.initActionMsg(r4);
            r4.callback = (t5) => {
              if (t5.resultCode != o2.ErrorCode.SUCCESS && t5.resultCode != o2.ErrorCode.REPEAT_MESSAGE)
                setTimeout(function() {
                  r4.send();
                }, 30 * 1e3);
            };
            r4.feedbackData = l2.create(t4, e3);
            r4.actionMsgData.msgAction = u2.default.ClientAction.FEED_BACK;
            r4.actionMsgData.msgData = JSON.stringify(r4.feedbackData);
            return r4;
          }
          send() {
            super.send();
          }
        }
        c2.ActionId = (n2 = class {
        }, n2.RECEIVE = "0", n2.MP_RECEIVE = "210000", n2.WEB_RECEIVE = "220000", n2.BEGIN = "1", n2);
        c2.RESULT = (s2 = class {
        }, s2.OK = "ok", s2);
        class l2 {
          constructor() {
            this.messageid = "";
            this.appkey = "";
            this.appid = "";
            this.taskid = "";
            this.actionid = "";
            this.result = "";
            this.timestamp = "";
          }
          static create(t4, e3) {
            let r4 = new l2();
            r4.messageid = t4.pushMessageData.messageid;
            r4.appkey = t4.pushMessageData.appKey;
            r4.appid = a2.default.appid;
            r4.taskid = t4.pushMessageData.taskId;
            r4.actionid = e3;
            r4.result = c2.RESULT.OK;
            r4.timestamp = new Date().getTime().toString();
            return r4;
          }
        }
        e2["default"] = c2;
      }, 6561: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9800));
        class s2 extends n2.default {
          static create() {
            let t4 = new s2();
            super.initMsg(t4);
            t4.command = n2.default.Command.HEART_BEAT;
            return t4;
          }
        }
        e2["default"] = s2;
      }, 358: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(323));
        const s2 = i3(r3(1754));
        const a2 = i3(r3(9800));
        class o2 extends a2.default {
          constructor() {
            super(...arguments);
            this.keyNegotiateData = new u2();
          }
          static create() {
            let t4 = new o2();
            super.initMsg(t4);
            t4.command = a2.default.Command.KEY_NEGOTIATE;
            n2.default.resetKey();
            t4.data = t4.keyNegotiateData = u2.create();
            return t4;
          }
          send() {
            super.send();
          }
        }
        class u2 {
          constructor() {
            this.appId = "";
            this.rsaPublicKeyId = "";
            this.algorithm = "";
            this.secretKey = "";
            this.iv = "";
          }
          static create() {
            let t4 = new u2();
            t4.appId = s2.default.appid;
            t4.rsaPublicKeyId = s2.default.publicKeyId;
            t4.algorithm = "AES";
            t4.secretKey = n2.default.getEncryptedSecretKey();
            t4.iv = n2.default.getEncryptedIV();
            return t4;
          }
        }
        e2["default"] = o2;
      }, 5301: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9800));
        const s2 = i3(r3(323));
        const a2 = i3(r3(2544));
        const o2 = i3(r3(1237));
        const u2 = i3(r3(1754));
        class c2 extends n2.default {
          constructor() {
            super(...arguments);
            this.keyNegotiateResultData = new l2();
          }
          static parse(t4) {
            let e3 = new c2();
            super.parseMsg(e3, t4);
            e3.keyNegotiateResultData = l2.parse(e3.data);
            return e3;
          }
          receive() {
            var _a, _b;
            if (0 != this.keyNegotiateResultData.errorCode) {
              o2.default.error(`key negotiate fail: ${this.data}`);
              (_a = u2.default.onError) == null ? void 0 : _a.call(u2.default.onError, { error: `key negotiate fail: ${this.data}` });
              return;
            }
            let t4 = this.keyNegotiateResultData.encryptType.split("/");
            if (!s2.default.algorithmMap.has(t4[0].trim().toLowerCase()) || !s2.default.modeMap.has(t4[1].trim().toLowerCase()) || !s2.default.paddingMap.has(t4[2].trim().toLowerCase())) {
              o2.default.error(`key negotiate fail: ${this.data}`);
              (_b = u2.default.onError) == null ? void 0 : _b.call(u2.default.onError, { error: `key negotiate fail: ${this.data}` });
              return;
            }
            s2.default.setEncryptParams(t4[0].trim().toLowerCase(), t4[1].trim().toLowerCase(), t4[2].trim().toLowerCase());
            a2.default.create().send();
          }
        }
        class l2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
            this.encryptType = "";
          }
          static parse(t4) {
            let e3 = new l2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            e3.encryptType = r4.encryptType;
            return e3;
          }
        }
        e2["default"] = c2;
      }, 2544: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(1754));
        const s2 = i3(r3(323));
        const a2 = i3(r3(9800));
        const o2 = i3(r3(3527));
        class u2 extends a2.default {
          constructor() {
            super(...arguments);
            this.loginData = new c2();
          }
          static create() {
            let t4 = new u2();
            super.initMsg(t4);
            t4.command = a2.default.Command.LOGIN;
            t4.data = t4.loginData = c2.create();
            return t4;
          }
          send() {
            if (!this.loginData.session || n2.default.cid != s2.default.md5Hex(this.loginData.session)) {
              o2.default.create().send();
              return;
            }
            super.send();
          }
        }
        class c2 {
          constructor() {
            this.appId = "";
            this.session = "";
          }
          static create() {
            let t4 = new c2();
            t4.appId = n2.default.appid;
            t4.session = n2.default.session;
            return t4;
          }
        }
        e2["default"] = u2;
      }, 8734: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9934));
        const s2 = i3(r3(9800));
        const a2 = i3(r3(1754));
        const o2 = i3(r3(9214));
        const u2 = i3(r3(708));
        const c2 = i3(r3(2544));
        class l2 extends s2.default {
          constructor() {
            super(...arguments);
            this.loginResultData = new f2();
          }
          static parse(t4) {
            let e3 = new l2();
            super.parseMsg(e3, t4);
            e3.loginResultData = f2.parse(e3.data);
            return e3;
          }
          receive() {
            var _a;
            if (0 != this.loginResultData.errorCode) {
              this.data;
              a2.default.session = a2.default.cid = "";
              n2.default.setSync(n2.default.KEY_CID, "");
              n2.default.setSync(n2.default.KEY_SESSION, "");
              c2.default.create().send();
              return;
            }
            if (!a2.default.online) {
              a2.default.online = true;
              (_a = a2.default.onlineState) == null ? void 0 : _a.call(a2.default.onlineState, { online: a2.default.online });
            }
            o2.default.sendWaitingMessages();
            u2.default.create().send();
          }
        }
        class f2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
            this.session = "";
          }
          static parse(t4) {
            let e3 = new f2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            e3.session = r4.session;
            return e3;
          }
        }
        e2["default"] = l2;
      }, 9800: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        var n2;
        Object.defineProperty(e2, "__esModule", { value: true });
        const s2 = i3(r3(350));
        const a2 = i3(r3(7071));
        const o2 = i3(r3(127));
        const u2 = i3(r3(1754));
        class c2 {
          constructor() {
            this.version = "";
            this.command = 0;
            this.packetId = 0;
            this.timeStamp = 0;
            this.data = "";
            this.signature = "";
          }
          static initMsg(t4, ...e3) {
            t4.version = o2.default.SOCKET_PROTOCOL_VERSION;
            t4.command = 0;
            t4.timeStamp = new Date().getTime();
            return t4;
          }
          static parseMsg(t4, e3) {
            let r4 = JSON.parse(e3);
            t4.version = r4.version;
            t4.command = r4.command;
            t4.packetId = r4.packetId;
            t4.timeStamp = r4.timeStamp;
            t4.data = r4.data;
            t4.signature = r4.signature;
            return t4;
          }
          stringify() {
            return JSON.stringify(this, ["version", "command", "packetId", "timeStamp", "data", "signature"]);
          }
          send() {
            if (!a2.default.isAvailable())
              return;
            this.packetId = u2.default.packetId++;
            this.data = JSON.stringify(this.data);
            this.stringify();
            if (this.command != c2.Command.HEART_BEAT) {
              s2.default.sign(this);
              if (this.data && this.command != c2.Command.KEY_NEGOTIATE)
                s2.default.encrypt(this);
            }
            a2.default.send(this.stringify());
          }
        }
        c2.Command = (n2 = class {
        }, n2.HEART_BEAT = 0, n2.KEY_NEGOTIATE = 1, n2.KEY_NEGOTIATE_RESULT = 16, n2.REGISTER = 2, n2.REGISTER_RESULT = 32, n2.LOGIN = 3, n2.LOGIN_RESULT = 48, n2.LOGOUT = 4, n2.LOGOUT_RESULT = 64, n2.CLIENT_MSG = 5, n2.SERVER_MSG = 80, n2.SERVER_CLOSE = 96, n2.REDIRECT_SERVER = 112, n2);
        e2["default"] = c2;
      }, 350: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(323));
        var s2;
        (function(t4) {
          function e3(t5) {
            t5.data = n2.default.encrypt(t5.data);
          }
          t4.encrypt = e3;
          function r4(t5) {
            t5.data = n2.default.decrypt(t5.data);
          }
          t4.decrypt = r4;
          function i4(t5) {
            t5.signature = n2.default.sha256(`${t5.timeStamp}${t5.packetId}${t5.command}${t5.data}`);
          }
          t4.sign = i4;
          function s3(t5) {
            let e4 = n2.default.sha256(`${t5.timeStamp}${t5.packetId}${t5.command}${t5.data}`);
            if (t5.signature != e4)
              throw new Error(`msg signature vierfy failed`);
          }
          t4.verify = s3;
        })(s2 || (s2 = {}));
        e2["default"] = s2;
      }, 1236: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(5301));
        const s2 = i3(r3(8734));
        const a2 = i3(r3(9800));
        const o2 = i3(r3(7078));
        const u2 = i3(r3(538));
        const c2 = i3(r3(7821));
        const l2 = i3(r3(217));
        const f2 = i3(r3(7156));
        const h2 = i3(r3(53));
        const d2 = i3(r3(9214));
        const p2 = i3(r3(7303));
        const v2 = i3(r3(6063));
        const g2 = i3(r3(7923));
        const y = i3(r3(350));
        const m2 = i3(r3(9214));
        const w2 = i3(r3(6254));
        const S2 = i3(r3(5035));
        class _2 {
          static receiveMessage(t4) {
            let e3 = a2.default.parseMsg(new a2.default(), t4);
            if (e3.command == a2.default.Command.HEART_BEAT)
              return;
            if (e3.command != a2.default.Command.KEY_NEGOTIATE_RESULT && e3.command != a2.default.Command.SERVER_CLOSE && e3.command != a2.default.Command.REDIRECT_SERVER)
              y.default.decrypt(e3);
            if (e3.command != a2.default.Command.SERVER_CLOSE && e3.command != a2.default.Command.REDIRECT_SERVER)
              y.default.verify(e3);
            switch (e3.command) {
              case a2.default.Command.KEY_NEGOTIATE_RESULT:
                n2.default.parse(e3.stringify()).receive();
                break;
              case a2.default.Command.REGISTER_RESULT:
                o2.default.parse(e3.stringify()).receive();
                break;
              case a2.default.Command.LOGIN_RESULT:
                s2.default.parse(e3.stringify()).receive();
                break;
              case a2.default.Command.SERVER_MSG:
                this.receiveActionMsg(e3.stringify());
                break;
              case a2.default.Command.SERVER_CLOSE:
                S2.default.parse(e3.stringify()).receive();
                break;
              case a2.default.Command.REDIRECT_SERVER:
                h2.default.parse(e3.stringify()).receive();
                break;
            }
          }
          static receiveActionMsg(t4) {
            let e3 = m2.default.parseActionMsg(new m2.default(), t4);
            if (e3.actionMsgData.msgAction != d2.default.ServerAction.RECEIVED && e3.actionMsgData.msgAction != d2.default.ServerAction.REDIRECT_SERVER) {
              let t5 = JSON.parse(e3.actionMsgData.msgData);
              w2.default.create(t5.id).send();
            }
            switch (e3.actionMsgData.msgAction) {
              case d2.default.ServerAction.PUSH_MESSAGE:
                f2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.ADD_PHONE_INFO_RESULT:
                u2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.SET_MODE_RESULT:
                p2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.SET_TAG_RESULT:
                v2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.BIND_ALIAS_RESULT:
                c2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.UNBIND_ALIAS_RESULT:
                g2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.FEED_BACK_RESULT:
                l2.default.parse(t4).receive();
                break;
              case d2.default.ServerAction.RECEIVED:
                w2.default.parse(t4).receive();
                break;
            }
          }
        }
        e2["default"] = _2;
      }, 6254: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = r3(3118);
        const s2 = i3(r3(1754));
        const a2 = i3(r3(9214));
        class o2 extends a2.default {
          constructor() {
            super(...arguments);
            this.receivedData = new u2();
          }
          static create(t4) {
            let e3 = new o2();
            super.initActionMsg(e3);
            e3.callback = (t5) => {
              if (t5.resultCode != n2.ErrorCode.SUCCESS && t5.resultCode != n2.ErrorCode.REPEAT_MESSAGE)
                setTimeout(function() {
                  e3.send();
                }, 3 * 1e3);
            };
            e3.actionMsgData.msgAction = a2.default.ClientAction.RECEIVED;
            e3.receivedData = u2.create(t4);
            e3.actionMsgData.msgData = JSON.stringify(e3.receivedData);
            return e3;
          }
          static parse(t4) {
            let e3 = new o2();
            super.parseActionMsg(e3, t4);
            e3.receivedData = u2.parse(e3.data);
            return e3;
          }
          receive() {
            var _a;
            let t4 = a2.default.getWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4 && t4.actionMsgData.msgAction == a2.default.ClientAction.ADD_PHONE_INFO || t4 && t4.actionMsgData.msgAction == a2.default.ClientAction.FEED_BACK) {
              a2.default.removeWaitingResponseMessage(t4.actionMsgData.msgId);
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: n2.ErrorCode.SUCCESS, message: "received" });
            }
          }
          send() {
            super.send();
          }
        }
        class u2 {
          constructor() {
            this.msgId = "";
            this.cid = "";
          }
          static create(t4) {
            let e3 = new u2();
            e3.cid = s2.default.cid;
            e3.msgId = t4;
            return e3;
          }
          static parse(t4) {
            let e3 = new u2();
            let r4 = JSON.parse(t4);
            e3.cid = r4.cid;
            e3.msgId = r4.msgId;
            return e3;
          }
        }
        e2["default"] = o2;
      }, 53: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        e2.RedirectServerData = void 0;
        const n2 = i3(r3(7071));
        const s2 = i3(r3(9934));
        const a2 = i3(r3(9800));
        class o2 extends a2.default {
          constructor() {
            super(...arguments);
            this.redirectServerData = new u2();
          }
          static parse(t4) {
            let e3 = new o2();
            super.parseMsg(e3, t4);
            e3.redirectServerData = u2.parse(e3.data);
            return e3;
          }
          receive() {
            this.redirectServerData;
            s2.default.setSync(s2.default.KEY_REDIRECT_SERVER, JSON.stringify(this.redirectServerData));
            n2.default.close("redirect server");
            n2.default.reconnect(this.redirectServerData.delay);
          }
        }
        class u2 {
          constructor() {
            this.addressList = [];
            this.delay = 0;
            this.loc = "";
            this.conf = "";
            this.time = 0;
          }
          static parse(t4) {
            let e3 = new u2();
            let r4 = JSON.parse(t4);
            e3.addressList = r4.addressList;
            e3.delay = r4.delay;
            e3.loc = r4.loc;
            e3.conf = r4.conf;
            e3.time = r4.time ? r4.time : new Date().getTime();
            return e3;
          }
        }
        e2.RedirectServerData = u2;
        e2["default"] = o2;
      }, 3527: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(1754));
        const s2 = i3(r3(9800));
        class a2 extends s2.default {
          constructor() {
            super(...arguments);
            this.registerData = new o2();
          }
          static create() {
            let t4 = new a2();
            super.initMsg(t4);
            t4.command = s2.default.Command.REGISTER;
            t4.data = t4.registerData = o2.create();
            return t4;
          }
          send() {
            super.send();
          }
        }
        class o2 {
          constructor() {
            this.appId = "";
            this.regId = "";
          }
          static create() {
            let t4 = new o2();
            t4.appId = n2.default.appid;
            t4.regId = n2.default.regId;
            return t4;
          }
        }
        e2["default"] = a2;
      }, 7078: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9800));
        const s2 = i3(r3(9934));
        const a2 = i3(r3(1754));
        const o2 = i3(r3(2544));
        const u2 = i3(r3(1237));
        class c2 extends n2.default {
          constructor() {
            super(...arguments);
            this.registerResultData = new l2();
          }
          static parse(t4) {
            let e3 = new c2();
            super.parseMsg(e3, t4);
            e3.registerResultData = l2.parse(e3.data);
            return e3;
          }
          receive() {
            var _a, _b;
            if (0 != this.registerResultData.errorCode || !this.registerResultData.cid || !this.registerResultData.session) {
              u2.default.error(`register fail: ${this.data}`);
              (_a = a2.default.onError) == null ? void 0 : _a.call(a2.default.onError, { error: `register fail: ${this.data}` });
              return;
            }
            if (a2.default.cid != this.registerResultData.cid)
              s2.default.setSync(s2.default.KEY_ADD_PHONE_INFO_TIME, 0);
            a2.default.cid = this.registerResultData.cid;
            (_b = a2.default.onClientId) == null ? void 0 : _b.call(a2.default.onClientId, { cid: a2.default.cid });
            s2.default.set({ key: s2.default.KEY_CID, data: a2.default.cid });
            a2.default.session = this.registerResultData.session;
            s2.default.set({ key: s2.default.KEY_SESSION, data: a2.default.session });
            a2.default.deviceId = this.registerResultData.deviceId;
            s2.default.set({ key: s2.default.KEY_DEVICE_ID, data: a2.default.deviceId });
            o2.default.create().send();
          }
        }
        class l2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
            this.cid = "";
            this.session = "";
            this.deviceId = "";
            this.regId = "";
          }
          static parse(t4) {
            let e3 = new l2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            e3.cid = r4.cid;
            e3.session = r4.session;
            e3.deviceId = r4.deviceId;
            e3.regId = r4.regId;
            return e3;
          }
        }
        e2["default"] = c2;
      }, 5035: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(7071));
        const s2 = i3(r3(9800));
        class a2 extends s2.default {
          constructor() {
            super(...arguments);
            this.serverCloseData = new o2();
          }
          static parse(t4) {
            let e3 = new a2();
            super.parseMsg(e3, t4);
            e3.serverCloseData = o2.parse(e3.data);
            return e3;
          }
          receive() {
            this.data;
            if (20 == this.serverCloseData.code || 23 == this.serverCloseData.code || 24 == this.serverCloseData.code)
              n2.default.allowReconnect = false;
            n2.default.close();
          }
        }
        class o2 {
          constructor() {
            this.code = -1;
            this.msg = "";
          }
          static parse(t4) {
            let e3 = new o2();
            let r4 = JSON.parse(t4);
            e3.code = r4.code;
            e3.msg = r4.msg;
            return e3;
          }
        }
        e2["default"] = a2;
      }, 538: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9934));
        const s2 = i3(r3(9214));
        class a2 extends s2.default {
          constructor() {
            super(...arguments);
            this.addPhoneInfoResultData = new o2();
          }
          static parse(t4) {
            let e3 = new a2();
            super.parseActionMsg(e3, t4);
            e3.addPhoneInfoResultData = o2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            this.addPhoneInfoResultData;
            let t4 = s2.default.removeWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4)
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: this.addPhoneInfoResultData.errorCode, message: this.addPhoneInfoResultData.errorMsg });
            n2.default.set({ key: n2.default.KEY_ADD_PHONE_INFO_TIME, data: new Date().getTime() });
          }
        }
        class o2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
          }
          static parse(t4) {
            let e3 = new o2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            return e3;
          }
        }
        e2["default"] = a2;
      }, 7821: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9934));
        const s2 = i3(r3(1237));
        const a2 = i3(r3(9214));
        class o2 extends a2.default {
          constructor() {
            super(...arguments);
            this.bindAliasResultData = new u2();
          }
          static parse(t4) {
            let e3 = new o2();
            super.parseActionMsg(e3, t4);
            e3.bindAliasResultData = u2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            s2.default.info(`bind alias result`, this.bindAliasResultData);
            let t4 = a2.default.removeWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4)
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: this.bindAliasResultData.errorCode, message: this.bindAliasResultData.errorMsg });
            n2.default.set({ key: n2.default.KEY_BIND_ALIAS_TIME, data: new Date().getTime() });
          }
        }
        class u2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
          }
          static parse(t4) {
            let e3 = new u2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            return e3;
          }
        }
        e2["default"] = o2;
      }, 217: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = r3(3118);
        const s2 = i3(r3(9214));
        class a2 extends s2.default {
          constructor() {
            super(...arguments);
            this.feedbackResultData = new o2();
          }
          static parse(t4) {
            let e3 = new a2();
            super.parseActionMsg(e3, t4);
            e3.feedbackResultData = o2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            this.feedbackResultData;
            let t4 = s2.default.removeWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4)
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: n2.ErrorCode.SUCCESS, message: "received" });
          }
        }
        class o2 {
          constructor() {
            this.actionId = "";
            this.taskId = "";
            this.result = "";
          }
          static parse(t4) {
            let e3 = new o2();
            let r4 = JSON.parse(t4);
            e3.actionId = r4.actionId;
            e3.taskId = r4.taskId;
            e3.result = r4.result;
            return e3;
          }
        }
        e2["default"] = a2;
      }, 7156: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        var n2;
        Object.defineProperty(e2, "__esModule", { value: true });
        const s2 = i3(r3(1754));
        const a2 = i3(r3(9214));
        const o2 = i3(r3(652));
        class u2 extends a2.default {
          constructor() {
            super(...arguments);
            this.pushMessageData = new c2();
          }
          static parse(t4) {
            let e3 = new u2();
            super.parseActionMsg(e3, t4);
            e3.pushMessageData = c2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            this.pushMessageData;
            if (this.pushMessageData.appId != s2.default.appid || !this.pushMessageData.messageid || !this.pushMessageData.taskId)
              this.stringify();
            o2.default.create(this, o2.default.ActionId.RECEIVE).send();
            o2.default.create(this, o2.default.ActionId.MP_RECEIVE).send();
            if (this.actionMsgData.msgExtraData && s2.default.onPushMsg)
              (_a = s2.default.onPushMsg) == null ? void 0 : _a.call(s2.default.onPushMsg, { message: this.actionMsgData.msgExtraData });
          }
        }
        class c2 {
          constructor() {
            this.id = "";
            this.appKey = "";
            this.appId = "";
            this.messageid = "";
            this.taskId = "";
            this.actionChain = [];
            this.cdnType = "";
          }
          static parse(t4) {
            let e3 = new c2();
            let r4 = JSON.parse(t4);
            e3.id = r4.id;
            e3.appKey = r4.appKey;
            e3.appId = r4.appId;
            e3.messageid = r4.messageid;
            e3.taskId = r4.taskId;
            e3.actionChain = r4.actionChain;
            e3.cdnType = r4.cdnType;
            return e3;
          }
        }
        n2 = class {
        }, n2.GO_TO = "goto", n2.TRANSMIT = "transmit";
        e2["default"] = u2;
      }, 7303: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9214));
        class s2 extends n2.default {
          constructor() {
            super(...arguments);
            this.setModeResultData = new a2();
          }
          static parse(t4) {
            let e3 = new s2();
            super.parseActionMsg(e3, t4);
            e3.setModeResultData = a2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            this.setModeResultData;
            let t4 = n2.default.removeWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4)
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: this.setModeResultData.errorCode, message: this.setModeResultData.errorMsg });
          }
        }
        class a2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
          }
          static parse(t4) {
            let e3 = new a2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            return e3;
          }
        }
        e2["default"] = s2;
      }, 6063: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9934));
        const s2 = i3(r3(1237));
        const a2 = i3(r3(9214));
        class o2 extends a2.default {
          constructor() {
            super(...arguments);
            this.setTagResultData = new u2();
          }
          static parse(t4) {
            let e3 = new o2();
            super.parseActionMsg(e3, t4);
            e3.setTagResultData = u2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            s2.default.info(`set tag result`, this.setTagResultData);
            let t4 = a2.default.removeWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4)
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: this.setTagResultData.errorCode, message: this.setTagResultData.errorMsg });
            n2.default.set({ key: n2.default.KEY_SET_TAG_TIME, data: new Date().getTime() });
          }
        }
        class u2 {
          constructor() {
            this.errorCode = 0;
            this.errorMsg = "";
          }
          static parse(t4) {
            let e3 = new u2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            return e3;
          }
        }
        e2["default"] = o2;
      }, 7923: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(9934));
        const s2 = i3(r3(1237));
        const a2 = i3(r3(9214));
        class o2 extends a2.default {
          constructor() {
            super(...arguments);
            this.unbindAliasResultData = new u2();
          }
          static parse(t4) {
            let e3 = new o2();
            super.parseActionMsg(e3, t4);
            e3.unbindAliasResultData = u2.parse(e3.actionMsgData.msgData);
            return e3;
          }
          receive() {
            var _a;
            s2.default.info(`unbind alias result`, this.unbindAliasResultData);
            let t4 = a2.default.removeWaitingResponseMessage(this.actionMsgData.msgId);
            if (t4)
              (_a = t4.callback) == null ? void 0 : _a.call(t4.callback, { resultCode: this.unbindAliasResultData.errorCode, message: this.unbindAliasResultData.errorMsg });
            n2.default.set({ key: n2.default.KEY_BIND_ALIAS_TIME, data: new Date().getTime() });
          }
        }
        class u2 {
          constructor() {
            this.errorCode = -1;
            this.errorMsg = "";
          }
          static parse(t4) {
            let e3 = new u2();
            let r4 = JSON.parse(t4);
            e3.errorCode = r4.errorCode;
            e3.errorMsg = r4.errorMsg;
            return e3;
          }
        }
        e2["default"] = o2;
      }, 9285: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          constructor(t4) {
            this.delay = 10;
            this.delay = t4;
          }
          start() {
            this.cancel();
            let t4 = this;
            this.timer = setInterval(function() {
              t4.run();
            }, this.delay);
          }
          cancel() {
            if (this.timer)
              clearInterval(this.timer);
          }
        }
        e2["default"] = r3;
      }, 1571: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        var n2;
        Object.defineProperty(e2, "__esModule", { value: true });
        const s2 = i3(r3(6561));
        const a2 = i3(r3(9285));
        class o2 extends a2.default {
          static getInstance() {
            return o2.InstanceHolder.instance;
          }
          run() {
            s2.default.create().send();
          }
          refresh() {
            this.delay = 60 * 1e3;
            this.start();
          }
        }
        o2.INTERVAL = 60 * 1e3;
        o2.InstanceHolder = (n2 = class {
        }, n2.instance = new o2(o2.INTERVAL), n2);
        e2["default"] = o2;
      }, 5574: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(4736));
        const s2 = i3(r3(323));
        var a2;
        (function(t4) {
          let e3 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          let r4 = (0, n2.default)("9223372036854775808");
          function i4(t5) {
            let e4 = a3(t5);
            let r5 = o2(e4);
            let i5 = r5[1];
            let n3 = r5[0];
            return u2(i5) + u2(n3);
          }
          t4.to_getui = i4;
          function a3(t5) {
            let e4 = s2.default.md5Hex(t5);
            let r5 = c2(e4);
            r5[6] &= 15;
            r5[6] |= 48;
            r5[8] &= 63;
            r5[8] |= 128;
            return r5;
          }
          function o2(t5) {
            let e4 = (0, n2.default)(0);
            let r5 = (0, n2.default)(0);
            for (let r6 = 0; r6 < 8; r6++)
              e4 = e4.multiply(256).plus((0, n2.default)(255 & t5[r6]));
            for (let e5 = 8; e5 < 16; e5++)
              r5 = r5.multiply(256).plus((0, n2.default)(255 & t5[e5]));
            return [e4, r5];
          }
          function u2(t5) {
            if (t5 >= r4)
              t5 = r4.multiply(2).minus(t5);
            let i5 = "";
            for (; t5 > (0, n2.default)(0); t5 = t5.divide(62))
              i5 += e3.charAt(Number(t5.divmod(62).remainder));
            return i5;
          }
          function c2(t5) {
            let e4 = t5.length;
            if (e4 % 2 != 0)
              return [];
            let r5 = new Array();
            for (let i5 = 0; i5 < e4; i5 += 2)
              r5.push(parseInt(t5.substring(i5, i5 + 2), 16));
            return r5;
          }
        })(a2 || (a2 = {}));
        e2["default"] = a2;
      }, 323: function(t3, e2, r3) {
        var i3 = this && this.__importDefault || function(t4) {
          return t4 && t4.__esModule ? t4 : { default: t4 };
        };
        Object.defineProperty(e2, "__esModule", { value: true });
        const n2 = i3(r3(2620));
        const s2 = i3(r3(1354));
        const a2 = i3(r3(1754));
        var o2;
        (function(t4) {
          let e3;
          let r4;
          let i4;
          let o3;
          let u2 = new n2.default();
          let c2 = s2.default.mode.CBC;
          let l2 = s2.default.pad.Pkcs7;
          let f2 = s2.default.AES;
          t4.algorithmMap = /* @__PURE__ */ new Map([["aes", s2.default.AES]]);
          t4.modeMap = /* @__PURE__ */ new Map([["cbc", s2.default.mode.CBC], ["cfb", s2.default.mode.CFB], ["cfb128", s2.default.mode.CFB], ["ecb", s2.default.mode.ECB], ["ofb", s2.default.mode.OFB]]);
          t4.paddingMap = /* @__PURE__ */ new Map([["nopadding", s2.default.pad.NoPadding], ["pkcs7", s2.default.pad.Pkcs7]]);
          function h2() {
            e3 = s2.default.MD5(new Date().getTime().toString());
            r4 = s2.default.MD5(e3);
            u2.setPublicKey(a2.default.publicKey);
            e3.toString(s2.default.enc.Hex);
            r4.toString(s2.default.enc.Hex);
            i4 = u2.encrypt(e3.toString(s2.default.enc.Hex));
            o3 = u2.encrypt(r4.toString(s2.default.enc.Hex));
          }
          t4.resetKey = h2;
          function d2(e4, r5, i5) {
            f2 = t4.algorithmMap.get(e4);
            c2 = t4.modeMap.get(r5);
            l2 = t4.paddingMap.get(i5);
          }
          t4.setEncryptParams = d2;
          function p2(t5) {
            return f2.encrypt(t5, e3, { iv: r4, mode: c2, padding: l2 }).toString();
          }
          t4.encrypt = p2;
          function v2(t5) {
            return f2.decrypt(t5, e3, { iv: r4, mode: c2, padding: l2 }).toString(s2.default.enc.Utf8);
          }
          t4.decrypt = v2;
          function g2(t5) {
            return s2.default.SHA256(t5).toString(s2.default.enc.Base64);
          }
          t4.sha256 = g2;
          function y(t5) {
            return s2.default.MD5(t5).toString(s2.default.enc.Hex);
          }
          t4.md5Hex = y;
          function m2() {
            return i4 ? i4 : "";
          }
          t4.getEncryptedSecretKey = m2;
          function w2() {
            return o3 ? o3 : "";
          }
          t4.getEncryptedIV = w2;
        })(o2 || (o2 = {}));
        e2["default"] = o2;
      }, 1237: (t3, e2) => {
        Object.defineProperty(e2, "__esModule", { value: true });
        class r3 {
          static info(...t4) {
            if (this.debugMode)
              console.info(`[GtPush]`, t4);
          }
          static error(...t4) {
            console.error(`[GtPush]`, t4);
          }
        }
        r3.debugMode = false;
        e2["default"] = r3;
      }, 2620: (t3, e2, r3) => {
        r3.r(e2);
        r3.d(e2, { JSEncrypt: () => wt2, default: () => St2 });
        var i3 = "0123456789abcdefghijklmnopqrstuvwxyz";
        function n2(t4) {
          return i3.charAt(t4);
        }
        function s2(t4, e3) {
          return t4 & e3;
        }
        function a2(t4, e3) {
          return t4 | e3;
        }
        function o2(t4, e3) {
          return t4 ^ e3;
        }
        function u2(t4, e3) {
          return t4 & ~e3;
        }
        function c2(t4) {
          if (0 == t4)
            return -1;
          var e3 = 0;
          if (0 == (65535 & t4)) {
            t4 >>= 16;
            e3 += 16;
          }
          if (0 == (255 & t4)) {
            t4 >>= 8;
            e3 += 8;
          }
          if (0 == (15 & t4)) {
            t4 >>= 4;
            e3 += 4;
          }
          if (0 == (3 & t4)) {
            t4 >>= 2;
            e3 += 2;
          }
          if (0 == (1 & t4))
            ++e3;
          return e3;
        }
        function l2(t4) {
          var e3 = 0;
          while (0 != t4) {
            t4 &= t4 - 1;
            ++e3;
          }
          return e3;
        }
        var f2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var h2 = "=";
        function d2(t4) {
          var e3;
          var r4;
          var i4 = "";
          for (e3 = 0; e3 + 3 <= t4.length; e3 += 3) {
            r4 = parseInt(t4.substring(e3, e3 + 3), 16);
            i4 += f2.charAt(r4 >> 6) + f2.charAt(63 & r4);
          }
          if (e3 + 1 == t4.length) {
            r4 = parseInt(t4.substring(e3, e3 + 1), 16);
            i4 += f2.charAt(r4 << 2);
          } else if (e3 + 2 == t4.length) {
            r4 = parseInt(t4.substring(e3, e3 + 2), 16);
            i4 += f2.charAt(r4 >> 2) + f2.charAt((3 & r4) << 4);
          }
          while ((3 & i4.length) > 0)
            i4 += h2;
          return i4;
        }
        function p2(t4) {
          var e3 = "";
          var r4;
          var i4 = 0;
          var s3 = 0;
          for (r4 = 0; r4 < t4.length; ++r4) {
            if (t4.charAt(r4) == h2)
              break;
            var a3 = f2.indexOf(t4.charAt(r4));
            if (a3 < 0)
              continue;
            if (0 == i4) {
              e3 += n2(a3 >> 2);
              s3 = 3 & a3;
              i4 = 1;
            } else if (1 == i4) {
              e3 += n2(s3 << 2 | a3 >> 4);
              s3 = 15 & a3;
              i4 = 2;
            } else if (2 == i4) {
              e3 += n2(s3);
              e3 += n2(a3 >> 2);
              s3 = 3 & a3;
              i4 = 3;
            } else {
              e3 += n2(s3 << 2 | a3 >> 4);
              e3 += n2(15 & a3);
              i4 = 0;
            }
          }
          if (1 == i4)
            e3 += n2(s3 << 2);
          return e3;
        }
        var g2;
        var y = { decode: function(t4) {
          var e3;
          if (void 0 === g2) {
            var r4 = "0123456789ABCDEF";
            var i4 = " \f\n\r	\xA0\u2028\u2029";
            g2 = {};
            for (e3 = 0; e3 < 16; ++e3)
              g2[r4.charAt(e3)] = e3;
            r4 = r4.toLowerCase();
            for (e3 = 10; e3 < 16; ++e3)
              g2[r4.charAt(e3)] = e3;
            for (e3 = 0; e3 < i4.length; ++e3)
              g2[i4.charAt(e3)] = -1;
          }
          var n3 = [];
          var s3 = 0;
          var a3 = 0;
          for (e3 = 0; e3 < t4.length; ++e3) {
            var o3 = t4.charAt(e3);
            if ("=" == o3)
              break;
            o3 = g2[o3];
            if (-1 == o3)
              continue;
            if (void 0 === o3)
              throw new Error("Illegal character at offset " + e3);
            s3 |= o3;
            if (++a3 >= 2) {
              n3[n3.length] = s3;
              s3 = 0;
              a3 = 0;
            } else
              s3 <<= 4;
          }
          if (a3)
            throw new Error("Hex encoding incomplete: 4 bits missing");
          return n3;
        } };
        var m2;
        var w2 = { decode: function(t4) {
          var e3;
          if (void 0 === m2) {
            var r4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var i4 = "= \f\n\r	\xA0\u2028\u2029";
            m2 = /* @__PURE__ */ Object.create(null);
            for (e3 = 0; e3 < 64; ++e3)
              m2[r4.charAt(e3)] = e3;
            m2["-"] = 62;
            m2["_"] = 63;
            for (e3 = 0; e3 < i4.length; ++e3)
              m2[i4.charAt(e3)] = -1;
          }
          var n3 = [];
          var s3 = 0;
          var a3 = 0;
          for (e3 = 0; e3 < t4.length; ++e3) {
            var o3 = t4.charAt(e3);
            if ("=" == o3)
              break;
            o3 = m2[o3];
            if (-1 == o3)
              continue;
            if (void 0 === o3)
              throw new Error("Illegal character at offset " + e3);
            s3 |= o3;
            if (++a3 >= 4) {
              n3[n3.length] = s3 >> 16;
              n3[n3.length] = s3 >> 8 & 255;
              n3[n3.length] = 255 & s3;
              s3 = 0;
              a3 = 0;
            } else
              s3 <<= 6;
          }
          switch (a3) {
            case 1:
              throw new Error("Base64 encoding incomplete: at least 2 bits missing");
            case 2:
              n3[n3.length] = s3 >> 10;
              break;
            case 3:
              n3[n3.length] = s3 >> 16;
              n3[n3.length] = s3 >> 8 & 255;
              break;
          }
          return n3;
        }, re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/, unarmor: function(t4) {
          var e3 = w2.re.exec(t4);
          if (e3)
            if (e3[1])
              t4 = e3[1];
            else if (e3[2])
              t4 = e3[2];
            else
              throw new Error("RegExp out of sync");
          return w2.decode(t4);
        } };
        var S2 = 1e13;
        var _2 = function() {
          function t4(t5) {
            this.buf = [+t5 || 0];
          }
          t4.prototype.mulAdd = function(t5, e3) {
            var r4 = this.buf;
            var i4 = r4.length;
            var n3;
            var s3;
            for (n3 = 0; n3 < i4; ++n3) {
              s3 = r4[n3] * t5 + e3;
              if (s3 < S2)
                e3 = 0;
              else {
                e3 = 0 | s3 / S2;
                s3 -= e3 * S2;
              }
              r4[n3] = s3;
            }
            if (e3 > 0)
              r4[n3] = e3;
          };
          t4.prototype.sub = function(t5) {
            var e3 = this.buf;
            var r4 = e3.length;
            var i4;
            var n3;
            for (i4 = 0; i4 < r4; ++i4) {
              n3 = e3[i4] - t5;
              if (n3 < 0) {
                n3 += S2;
                t5 = 1;
              } else
                t5 = 0;
              e3[i4] = n3;
            }
            while (0 === e3[e3.length - 1])
              e3.pop();
          };
          t4.prototype.toString = function(t5) {
            if (10 != (t5 || 10))
              throw new Error("only base 10 is supported");
            var e3 = this.buf;
            var r4 = e3[e3.length - 1].toString();
            for (var i4 = e3.length - 2; i4 >= 0; --i4)
              r4 += (S2 + e3[i4]).toString().substring(1);
            return r4;
          };
          t4.prototype.valueOf = function() {
            var t5 = this.buf;
            var e3 = 0;
            for (var r4 = t5.length - 1; r4 >= 0; --r4)
              e3 = e3 * S2 + t5[r4];
            return e3;
          };
          t4.prototype.simplify = function() {
            var t5 = this.buf;
            return 1 == t5.length ? t5[0] : this;
          };
          return t4;
        }();
        var b2 = "\u2026";
        var E2 = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
        var D2 = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
        function M2(t4, e3) {
          if (t4.length > e3)
            t4 = t4.substring(0, e3) + b2;
          return t4;
        }
        var T2 = function() {
          function t4(e3, r4) {
            this.hexDigits = "0123456789ABCDEF";
            if (e3 instanceof t4) {
              this.enc = e3.enc;
              this.pos = e3.pos;
            } else {
              this.enc = e3;
              this.pos = r4;
            }
          }
          t4.prototype.get = function(t5) {
            if (void 0 === t5)
              t5 = this.pos++;
            if (t5 >= this.enc.length)
              throw new Error("Requesting byte offset " + t5 + " on a stream of length " + this.enc.length);
            return "string" === typeof this.enc ? this.enc.charCodeAt(t5) : this.enc[t5];
          };
          t4.prototype.hexByte = function(t5) {
            return this.hexDigits.charAt(t5 >> 4 & 15) + this.hexDigits.charAt(15 & t5);
          };
          t4.prototype.hexDump = function(t5, e3, r4) {
            var i4 = "";
            for (var n3 = t5; n3 < e3; ++n3) {
              i4 += this.hexByte(this.get(n3));
              if (true !== r4)
                switch (15 & n3) {
                  case 7:
                    i4 += "  ";
                    break;
                  case 15:
                    i4 += "\n";
                    break;
                  default:
                    i4 += " ";
                }
            }
            return i4;
          };
          t4.prototype.isASCII = function(t5, e3) {
            for (var r4 = t5; r4 < e3; ++r4) {
              var i4 = this.get(r4);
              if (i4 < 32 || i4 > 176)
                return false;
            }
            return true;
          };
          t4.prototype.parseStringISO = function(t5, e3) {
            var r4 = "";
            for (var i4 = t5; i4 < e3; ++i4)
              r4 += String.fromCharCode(this.get(i4));
            return r4;
          };
          t4.prototype.parseStringUTF = function(t5, e3) {
            var r4 = "";
            for (var i4 = t5; i4 < e3; ) {
              var n3 = this.get(i4++);
              if (n3 < 128)
                r4 += String.fromCharCode(n3);
              else if (n3 > 191 && n3 < 224)
                r4 += String.fromCharCode((31 & n3) << 6 | 63 & this.get(i4++));
              else
                r4 += String.fromCharCode((15 & n3) << 12 | (63 & this.get(i4++)) << 6 | 63 & this.get(i4++));
            }
            return r4;
          };
          t4.prototype.parseStringBMP = function(t5, e3) {
            var r4 = "";
            var i4;
            var n3;
            for (var s3 = t5; s3 < e3; ) {
              i4 = this.get(s3++);
              n3 = this.get(s3++);
              r4 += String.fromCharCode(i4 << 8 | n3);
            }
            return r4;
          };
          t4.prototype.parseTime = function(t5, e3, r4) {
            var i4 = this.parseStringISO(t5, e3);
            var n3 = (r4 ? E2 : D2).exec(i4);
            if (!n3)
              return "Unrecognized time: " + i4;
            if (r4) {
              n3[1] = +n3[1];
              n3[1] += +n3[1] < 70 ? 2e3 : 1900;
            }
            i4 = n3[1] + "-" + n3[2] + "-" + n3[3] + " " + n3[4];
            if (n3[5]) {
              i4 += ":" + n3[5];
              if (n3[6]) {
                i4 += ":" + n3[6];
                if (n3[7])
                  i4 += "." + n3[7];
              }
            }
            if (n3[8]) {
              i4 += " UTC";
              if ("Z" != n3[8]) {
                i4 += n3[8];
                if (n3[9])
                  i4 += ":" + n3[9];
              }
            }
            return i4;
          };
          t4.prototype.parseInteger = function(t5, e3) {
            var r4 = this.get(t5);
            var i4 = r4 > 127;
            var n3 = i4 ? 255 : 0;
            var s3;
            var a3 = "";
            while (r4 == n3 && ++t5 < e3)
              r4 = this.get(t5);
            s3 = e3 - t5;
            if (0 === s3)
              return i4 ? -1 : 0;
            if (s3 > 4) {
              a3 = r4;
              s3 <<= 3;
              while (0 == (128 & (+a3 ^ n3))) {
                a3 = +a3 << 1;
                --s3;
              }
              a3 = "(" + s3 + " bit)\n";
            }
            if (i4)
              r4 -= 256;
            var o3 = new _2(r4);
            for (var u3 = t5 + 1; u3 < e3; ++u3)
              o3.mulAdd(256, this.get(u3));
            return a3 + o3.toString();
          };
          t4.prototype.parseBitString = function(t5, e3, r4) {
            var i4 = this.get(t5);
            var n3 = (e3 - t5 - 1 << 3) - i4;
            var s3 = "(" + n3 + " bit)\n";
            var a3 = "";
            for (var o3 = t5 + 1; o3 < e3; ++o3) {
              var u3 = this.get(o3);
              var c3 = o3 == e3 - 1 ? i4 : 0;
              for (var l3 = 7; l3 >= c3; --l3)
                a3 += u3 >> l3 & 1 ? "1" : "0";
              if (a3.length > r4)
                return s3 + M2(a3, r4);
            }
            return s3 + a3;
          };
          t4.prototype.parseOctetString = function(t5, e3, r4) {
            if (this.isASCII(t5, e3))
              return M2(this.parseStringISO(t5, e3), r4);
            var i4 = e3 - t5;
            var n3 = "(" + i4 + " byte)\n";
            r4 /= 2;
            if (i4 > r4)
              e3 = t5 + r4;
            for (var s3 = t5; s3 < e3; ++s3)
              n3 += this.hexByte(this.get(s3));
            if (i4 > r4)
              n3 += b2;
            return n3;
          };
          t4.prototype.parseOID = function(t5, e3, r4) {
            var i4 = "";
            var n3 = new _2();
            var s3 = 0;
            for (var a3 = t5; a3 < e3; ++a3) {
              var o3 = this.get(a3);
              n3.mulAdd(128, 127 & o3);
              s3 += 7;
              if (!(128 & o3)) {
                if ("" === i4) {
                  n3 = n3.simplify();
                  if (n3 instanceof _2) {
                    n3.sub(80);
                    i4 = "2." + n3.toString();
                  } else {
                    var u3 = n3 < 80 ? n3 < 40 ? 0 : 1 : 2;
                    i4 = u3 + "." + (n3 - 40 * u3);
                  }
                } else
                  i4 += "." + n3.toString();
                if (i4.length > r4)
                  return M2(i4, r4);
                n3 = new _2();
                s3 = 0;
              }
            }
            if (s3 > 0)
              i4 += ".incomplete";
            return i4;
          };
          return t4;
        }();
        var I2 = function() {
          function t4(t5, e3, r4, i4, n3) {
            if (!(i4 instanceof A2))
              throw new Error("Invalid tag value.");
            this.stream = t5;
            this.header = e3;
            this.length = r4;
            this.tag = i4;
            this.sub = n3;
          }
          t4.prototype.typeName = function() {
            switch (this.tag.tagClass) {
              case 0:
                switch (this.tag.tagNumber) {
                  case 0:
                    return "EOC";
                  case 1:
                    return "BOOLEAN";
                  case 2:
                    return "INTEGER";
                  case 3:
                    return "BIT_STRING";
                  case 4:
                    return "OCTET_STRING";
                  case 5:
                    return "NULL";
                  case 6:
                    return "OBJECT_IDENTIFIER";
                  case 7:
                    return "ObjectDescriptor";
                  case 8:
                    return "EXTERNAL";
                  case 9:
                    return "REAL";
                  case 10:
                    return "ENUMERATED";
                  case 11:
                    return "EMBEDDED_PDV";
                  case 12:
                    return "UTF8String";
                  case 16:
                    return "SEQUENCE";
                  case 17:
                    return "SET";
                  case 18:
                    return "NumericString";
                  case 19:
                    return "PrintableString";
                  case 20:
                    return "TeletexString";
                  case 21:
                    return "VideotexString";
                  case 22:
                    return "IA5String";
                  case 23:
                    return "UTCTime";
                  case 24:
                    return "GeneralizedTime";
                  case 25:
                    return "GraphicString";
                  case 26:
                    return "VisibleString";
                  case 27:
                    return "GeneralString";
                  case 28:
                    return "UniversalString";
                  case 30:
                    return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();
              case 1:
                return "Application_" + this.tag.tagNumber.toString();
              case 2:
                return "[" + this.tag.tagNumber.toString() + "]";
              case 3:
                return "Private_" + this.tag.tagNumber.toString();
            }
          };
          t4.prototype.content = function(t5) {
            if (void 0 === this.tag)
              return null;
            if (void 0 === t5)
              t5 = 1 / 0;
            var e3 = this.posContent();
            var r4 = Math.abs(this.length);
            if (!this.tag.isUniversal()) {
              if (null !== this.sub)
                return "(" + this.sub.length + " elem)";
              return this.stream.parseOctetString(e3, e3 + r4, t5);
            }
            switch (this.tag.tagNumber) {
              case 1:
                return 0 === this.stream.get(e3) ? "false" : "true";
              case 2:
                return this.stream.parseInteger(e3, e3 + r4);
              case 3:
                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(e3, e3 + r4, t5);
              case 4:
                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e3, e3 + r4, t5);
              case 6:
                return this.stream.parseOID(e3, e3 + r4, t5);
              case 16:
              case 17:
                if (null !== this.sub)
                  return "(" + this.sub.length + " elem)";
                else
                  return "(no elem)";
              case 12:
                return M2(this.stream.parseStringUTF(e3, e3 + r4), t5);
              case 18:
              case 19:
              case 20:
              case 21:
              case 22:
              case 26:
                return M2(this.stream.parseStringISO(e3, e3 + r4), t5);
              case 30:
                return M2(this.stream.parseStringBMP(e3, e3 + r4), t5);
              case 23:
              case 24:
                return this.stream.parseTime(e3, e3 + r4, 23 == this.tag.tagNumber);
            }
            return null;
          };
          t4.prototype.toString = function() {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]";
          };
          t4.prototype.toPrettyString = function(t5) {
            if (void 0 === t5)
              t5 = "";
            var e3 = t5 + this.typeName() + " @" + this.stream.pos;
            if (this.length >= 0)
              e3 += "+";
            e3 += this.length;
            if (this.tag.tagConstructed)
              e3 += " (constructed)";
            else if (this.tag.isUniversal() && (3 == this.tag.tagNumber || 4 == this.tag.tagNumber) && null !== this.sub)
              e3 += " (encapsulates)";
            e3 += "\n";
            if (null !== this.sub) {
              t5 += "  ";
              for (var r4 = 0, i4 = this.sub.length; r4 < i4; ++r4)
                e3 += this.sub[r4].toPrettyString(t5);
            }
            return e3;
          };
          t4.prototype.posStart = function() {
            return this.stream.pos;
          };
          t4.prototype.posContent = function() {
            return this.stream.pos + this.header;
          };
          t4.prototype.posEnd = function() {
            return this.stream.pos + this.header + Math.abs(this.length);
          };
          t4.prototype.toHexString = function() {
            return this.stream.hexDump(this.posStart(), this.posEnd(), true);
          };
          t4.decodeLength = function(t5) {
            var e3 = t5.get();
            var r4 = 127 & e3;
            if (r4 == e3)
              return r4;
            if (r4 > 6)
              throw new Error("Length over 48 bits not supported at position " + (t5.pos - 1));
            if (0 === r4)
              return null;
            e3 = 0;
            for (var i4 = 0; i4 < r4; ++i4)
              e3 = 256 * e3 + t5.get();
            return e3;
          };
          t4.prototype.getHexStringValue = function() {
            var t5 = this.toHexString();
            var e3 = 2 * this.header;
            var r4 = 2 * this.length;
            return t5.substr(e3, r4);
          };
          t4.decode = function(e3) {
            var r4;
            if (!(e3 instanceof T2))
              r4 = new T2(e3, 0);
            else
              r4 = e3;
            var i4 = new T2(r4);
            var n3 = new A2(r4);
            var s3 = t4.decodeLength(r4);
            var a3 = r4.pos;
            var o3 = a3 - i4.pos;
            var u3 = null;
            var c3 = function() {
              var e4 = [];
              if (null !== s3) {
                var i5 = a3 + s3;
                while (r4.pos < i5)
                  e4[e4.length] = t4.decode(r4);
                if (r4.pos != i5)
                  throw new Error("Content size is not correct for container starting at offset " + a3);
              } else
                try {
                  for (; ; ) {
                    var n4 = t4.decode(r4);
                    if (n4.tag.isEOC())
                      break;
                    e4[e4.length] = n4;
                  }
                  s3 = a3 - r4.pos;
                } catch (t5) {
                  throw new Error("Exception while decoding undefined length content: " + t5);
                }
              return e4;
            };
            if (n3.tagConstructed)
              u3 = c3();
            else if (n3.isUniversal() && (3 == n3.tagNumber || 4 == n3.tagNumber))
              try {
                if (3 == n3.tagNumber) {
                  if (0 != r4.get())
                    throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                }
                u3 = c3();
                for (var l3 = 0; l3 < u3.length; ++l3)
                  if (u3[l3].tag.isEOC())
                    throw new Error("EOC is not supposed to be actual content.");
              } catch (t5) {
                u3 = null;
              }
            if (null === u3) {
              if (null === s3)
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + a3);
              r4.pos = a3 + Math.abs(s3);
            }
            return new t4(i4, o3, s3, n3, u3);
          };
          return t4;
        }();
        var A2 = function() {
          function t4(t5) {
            var e3 = t5.get();
            this.tagClass = e3 >> 6;
            this.tagConstructed = 0 !== (32 & e3);
            this.tagNumber = 31 & e3;
            if (31 == this.tagNumber) {
              var r4 = new _2();
              do {
                e3 = t5.get();
                r4.mulAdd(128, 127 & e3);
              } while (128 & e3);
              this.tagNumber = r4.simplify();
            }
          }
          t4.prototype.isUniversal = function() {
            return 0 === this.tagClass;
          };
          t4.prototype.isEOC = function() {
            return 0 === this.tagClass && 0 === this.tagNumber;
          };
          return t4;
        }();
        var x2;
        var R2 = 244837814094590;
        var B2 = 15715070 == (16777215 & R2);
        var O2 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
        var k = (1 << 26) / O2[O2.length - 1];
        var C2 = function() {
          function t4(t5, e3, r4) {
            if (null != t5)
              if ("number" == typeof t5)
                this.fromNumber(t5, e3, r4);
              else if (null == e3 && "string" != typeof t5)
                this.fromString(t5, 256);
              else
                this.fromString(t5, e3);
          }
          t4.prototype.toString = function(t5) {
            if (this.s < 0)
              return "-" + this.negate().toString(t5);
            var e3;
            if (16 == t5)
              e3 = 4;
            else if (8 == t5)
              e3 = 3;
            else if (2 == t5)
              e3 = 1;
            else if (32 == t5)
              e3 = 5;
            else if (4 == t5)
              e3 = 2;
            else
              return this.toRadix(t5);
            var r4 = (1 << e3) - 1;
            var i4;
            var s3 = false;
            var a3 = "";
            var o3 = this.t;
            var u3 = this.DB - o3 * this.DB % e3;
            if (o3-- > 0) {
              if (u3 < this.DB && (i4 = this[o3] >> u3) > 0) {
                s3 = true;
                a3 = n2(i4);
              }
              while (o3 >= 0) {
                if (u3 < e3) {
                  i4 = (this[o3] & (1 << u3) - 1) << e3 - u3;
                  i4 |= this[--o3] >> (u3 += this.DB - e3);
                } else {
                  i4 = this[o3] >> (u3 -= e3) & r4;
                  if (u3 <= 0) {
                    u3 += this.DB;
                    --o3;
                  }
                }
                if (i4 > 0)
                  s3 = true;
                if (s3)
                  a3 += n2(i4);
              }
            }
            return s3 ? a3 : "0";
          };
          t4.prototype.negate = function() {
            var e3 = H2();
            t4.ZERO.subTo(this, e3);
            return e3;
          };
          t4.prototype.abs = function() {
            return this.s < 0 ? this.negate() : this;
          };
          t4.prototype.compareTo = function(t5) {
            var e3 = this.s - t5.s;
            if (0 != e3)
              return e3;
            var r4 = this.t;
            e3 = r4 - t5.t;
            if (0 != e3)
              return this.s < 0 ? -e3 : e3;
            while (--r4 >= 0)
              if (0 != (e3 = this[r4] - t5[r4]))
                return e3;
            return 0;
          };
          t4.prototype.bitLength = function() {
            if (this.t <= 0)
              return 0;
            return this.DB * (this.t - 1) + W2(this[this.t - 1] ^ this.s & this.DM);
          };
          t4.prototype.mod = function(e3) {
            var r4 = H2();
            this.abs().divRemTo(e3, null, r4);
            if (this.s < 0 && r4.compareTo(t4.ZERO) > 0)
              e3.subTo(r4, r4);
            return r4;
          };
          t4.prototype.modPowInt = function(t5, e3) {
            var r4;
            if (t5 < 256 || e3.isEven())
              r4 = new P2(e3);
            else
              r4 = new V2(e3);
            return this.exp(t5, r4);
          };
          t4.prototype.clone = function() {
            var t5 = H2();
            this.copyTo(t5);
            return t5;
          };
          t4.prototype.intValue = function() {
            if (this.s < 0) {
              if (1 == this.t)
                return this[0] - this.DV;
              else if (0 == this.t)
                return -1;
            } else if (1 == this.t)
              return this[0];
            else if (0 == this.t)
              return 0;
            return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
          };
          t4.prototype.byteValue = function() {
            return 0 == this.t ? this.s : this[0] << 24 >> 24;
          };
          t4.prototype.shortValue = function() {
            return 0 == this.t ? this.s : this[0] << 16 >> 16;
          };
          t4.prototype.signum = function() {
            if (this.s < 0)
              return -1;
            else if (this.t <= 0 || 1 == this.t && this[0] <= 0)
              return 0;
            else
              return 1;
          };
          t4.prototype.toByteArray = function() {
            var t5 = this.t;
            var e3 = [];
            e3[0] = this.s;
            var r4 = this.DB - t5 * this.DB % 8;
            var i4;
            var n3 = 0;
            if (t5-- > 0) {
              if (r4 < this.DB && (i4 = this[t5] >> r4) != (this.s & this.DM) >> r4)
                e3[n3++] = i4 | this.s << this.DB - r4;
              while (t5 >= 0) {
                if (r4 < 8) {
                  i4 = (this[t5] & (1 << r4) - 1) << 8 - r4;
                  i4 |= this[--t5] >> (r4 += this.DB - 8);
                } else {
                  i4 = this[t5] >> (r4 -= 8) & 255;
                  if (r4 <= 0) {
                    r4 += this.DB;
                    --t5;
                  }
                }
                if (0 != (128 & i4))
                  i4 |= -256;
                if (0 == n3 && (128 & this.s) != (128 & i4))
                  ++n3;
                if (n3 > 0 || i4 != this.s)
                  e3[n3++] = i4;
              }
            }
            return e3;
          };
          t4.prototype.equals = function(t5) {
            return 0 == this.compareTo(t5);
          };
          t4.prototype.min = function(t5) {
            return this.compareTo(t5) < 0 ? this : t5;
          };
          t4.prototype.max = function(t5) {
            return this.compareTo(t5) > 0 ? this : t5;
          };
          t4.prototype.and = function(t5) {
            var e3 = H2();
            this.bitwiseTo(t5, s2, e3);
            return e3;
          };
          t4.prototype.or = function(t5) {
            var e3 = H2();
            this.bitwiseTo(t5, a2, e3);
            return e3;
          };
          t4.prototype.xor = function(t5) {
            var e3 = H2();
            this.bitwiseTo(t5, o2, e3);
            return e3;
          };
          t4.prototype.andNot = function(t5) {
            var e3 = H2();
            this.bitwiseTo(t5, u2, e3);
            return e3;
          };
          t4.prototype.not = function() {
            var t5 = H2();
            for (var e3 = 0; e3 < this.t; ++e3)
              t5[e3] = this.DM & ~this[e3];
            t5.t = this.t;
            t5.s = ~this.s;
            return t5;
          };
          t4.prototype.shiftLeft = function(t5) {
            var e3 = H2();
            if (t5 < 0)
              this.rShiftTo(-t5, e3);
            else
              this.lShiftTo(t5, e3);
            return e3;
          };
          t4.prototype.shiftRight = function(t5) {
            var e3 = H2();
            if (t5 < 0)
              this.lShiftTo(-t5, e3);
            else
              this.rShiftTo(t5, e3);
            return e3;
          };
          t4.prototype.getLowestSetBit = function() {
            for (var t5 = 0; t5 < this.t; ++t5)
              if (0 != this[t5])
                return t5 * this.DB + c2(this[t5]);
            if (this.s < 0)
              return this.t * this.DB;
            return -1;
          };
          t4.prototype.bitCount = function() {
            var t5 = 0;
            var e3 = this.s & this.DM;
            for (var r4 = 0; r4 < this.t; ++r4)
              t5 += l2(this[r4] ^ e3);
            return t5;
          };
          t4.prototype.testBit = function(t5) {
            var e3 = Math.floor(t5 / this.DB);
            if (e3 >= this.t)
              return 0 != this.s;
            return 0 != (this[e3] & 1 << t5 % this.DB);
          };
          t4.prototype.setBit = function(t5) {
            return this.changeBit(t5, a2);
          };
          t4.prototype.clearBit = function(t5) {
            return this.changeBit(t5, u2);
          };
          t4.prototype.flipBit = function(t5) {
            return this.changeBit(t5, o2);
          };
          t4.prototype.add = function(t5) {
            var e3 = H2();
            this.addTo(t5, e3);
            return e3;
          };
          t4.prototype.subtract = function(t5) {
            var e3 = H2();
            this.subTo(t5, e3);
            return e3;
          };
          t4.prototype.multiply = function(t5) {
            var e3 = H2();
            this.multiplyTo(t5, e3);
            return e3;
          };
          t4.prototype.divide = function(t5) {
            var e3 = H2();
            this.divRemTo(t5, e3, null);
            return e3;
          };
          t4.prototype.remainder = function(t5) {
            var e3 = H2();
            this.divRemTo(t5, null, e3);
            return e3;
          };
          t4.prototype.divideAndRemainder = function(t5) {
            var e3 = H2();
            var r4 = H2();
            this.divRemTo(t5, e3, r4);
            return [e3, r4];
          };
          t4.prototype.modPow = function(t5, e3) {
            var r4 = t5.bitLength();
            var i4;
            var n3 = Y2(1);
            var s3;
            if (r4 <= 0)
              return n3;
            else if (r4 < 18)
              i4 = 1;
            else if (r4 < 48)
              i4 = 3;
            else if (r4 < 144)
              i4 = 4;
            else if (r4 < 768)
              i4 = 5;
            else
              i4 = 6;
            if (r4 < 8)
              s3 = new P2(e3);
            else if (e3.isEven())
              s3 = new L2(e3);
            else
              s3 = new V2(e3);
            var a3 = [];
            var o3 = 3;
            var u3 = i4 - 1;
            var c3 = (1 << i4) - 1;
            a3[1] = s3.convert(this);
            if (i4 > 1) {
              var l3 = H2();
              s3.sqrTo(a3[1], l3);
              while (o3 <= c3) {
                a3[o3] = H2();
                s3.mulTo(l3, a3[o3 - 2], a3[o3]);
                o3 += 2;
              }
            }
            var f3 = t5.t - 1;
            var h3;
            var d3 = true;
            var p3 = H2();
            var v2;
            r4 = W2(t5[f3]) - 1;
            while (f3 >= 0) {
              if (r4 >= u3)
                h3 = t5[f3] >> r4 - u3 & c3;
              else {
                h3 = (t5[f3] & (1 << r4 + 1) - 1) << u3 - r4;
                if (f3 > 0)
                  h3 |= t5[f3 - 1] >> this.DB + r4 - u3;
              }
              o3 = i4;
              while (0 == (1 & h3)) {
                h3 >>= 1;
                --o3;
              }
              if ((r4 -= o3) < 0) {
                r4 += this.DB;
                --f3;
              }
              if (d3) {
                a3[h3].copyTo(n3);
                d3 = false;
              } else {
                while (o3 > 1) {
                  s3.sqrTo(n3, p3);
                  s3.sqrTo(p3, n3);
                  o3 -= 2;
                }
                if (o3 > 0)
                  s3.sqrTo(n3, p3);
                else {
                  v2 = n3;
                  n3 = p3;
                  p3 = v2;
                }
                s3.mulTo(p3, a3[h3], n3);
              }
              while (f3 >= 0 && 0 == (t5[f3] & 1 << r4)) {
                s3.sqrTo(n3, p3);
                v2 = n3;
                n3 = p3;
                p3 = v2;
                if (--r4 < 0) {
                  r4 = this.DB - 1;
                  --f3;
                }
              }
            }
            return s3.revert(n3);
          };
          t4.prototype.modInverse = function(e3) {
            var r4 = e3.isEven();
            if (this.isEven() && r4 || 0 == e3.signum())
              return t4.ZERO;
            var i4 = e3.clone();
            var n3 = this.clone();
            var s3 = Y2(1);
            var a3 = Y2(0);
            var o3 = Y2(0);
            var u3 = Y2(1);
            while (0 != i4.signum()) {
              while (i4.isEven()) {
                i4.rShiftTo(1, i4);
                if (r4) {
                  if (!s3.isEven() || !a3.isEven()) {
                    s3.addTo(this, s3);
                    a3.subTo(e3, a3);
                  }
                  s3.rShiftTo(1, s3);
                } else if (!a3.isEven())
                  a3.subTo(e3, a3);
                a3.rShiftTo(1, a3);
              }
              while (n3.isEven()) {
                n3.rShiftTo(1, n3);
                if (r4) {
                  if (!o3.isEven() || !u3.isEven()) {
                    o3.addTo(this, o3);
                    u3.subTo(e3, u3);
                  }
                  o3.rShiftTo(1, o3);
                } else if (!u3.isEven())
                  u3.subTo(e3, u3);
                u3.rShiftTo(1, u3);
              }
              if (i4.compareTo(n3) >= 0) {
                i4.subTo(n3, i4);
                if (r4)
                  s3.subTo(o3, s3);
                a3.subTo(u3, a3);
              } else {
                n3.subTo(i4, n3);
                if (r4)
                  o3.subTo(s3, o3);
                u3.subTo(a3, u3);
              }
            }
            if (0 != n3.compareTo(t4.ONE))
              return t4.ZERO;
            if (u3.compareTo(e3) >= 0)
              return u3.subtract(e3);
            if (u3.signum() < 0)
              u3.addTo(e3, u3);
            else
              return u3;
            if (u3.signum() < 0)
              return u3.add(e3);
            else
              return u3;
          };
          t4.prototype.pow = function(t5) {
            return this.exp(t5, new N2());
          };
          t4.prototype.gcd = function(t5) {
            var e3 = this.s < 0 ? this.negate() : this.clone();
            var r4 = t5.s < 0 ? t5.negate() : t5.clone();
            if (e3.compareTo(r4) < 0) {
              var i4 = e3;
              e3 = r4;
              r4 = i4;
            }
            var n3 = e3.getLowestSetBit();
            var s3 = r4.getLowestSetBit();
            if (s3 < 0)
              return e3;
            if (n3 < s3)
              s3 = n3;
            if (s3 > 0) {
              e3.rShiftTo(s3, e3);
              r4.rShiftTo(s3, r4);
            }
            while (e3.signum() > 0) {
              if ((n3 = e3.getLowestSetBit()) > 0)
                e3.rShiftTo(n3, e3);
              if ((n3 = r4.getLowestSetBit()) > 0)
                r4.rShiftTo(n3, r4);
              if (e3.compareTo(r4) >= 0) {
                e3.subTo(r4, e3);
                e3.rShiftTo(1, e3);
              } else {
                r4.subTo(e3, r4);
                r4.rShiftTo(1, r4);
              }
            }
            if (s3 > 0)
              r4.lShiftTo(s3, r4);
            return r4;
          };
          t4.prototype.isProbablePrime = function(t5) {
            var e3;
            var r4 = this.abs();
            if (1 == r4.t && r4[0] <= O2[O2.length - 1]) {
              for (e3 = 0; e3 < O2.length; ++e3)
                if (r4[0] == O2[e3])
                  return true;
              return false;
            }
            if (r4.isEven())
              return false;
            e3 = 1;
            while (e3 < O2.length) {
              var i4 = O2[e3];
              var n3 = e3 + 1;
              while (n3 < O2.length && i4 < k)
                i4 *= O2[n3++];
              i4 = r4.modInt(i4);
              while (e3 < n3)
                if (i4 % O2[e3++] == 0)
                  return false;
            }
            return r4.millerRabin(t5);
          };
          t4.prototype.copyTo = function(t5) {
            for (var e3 = this.t - 1; e3 >= 0; --e3)
              t5[e3] = this[e3];
            t5.t = this.t;
            t5.s = this.s;
          };
          t4.prototype.fromInt = function(t5) {
            this.t = 1;
            this.s = t5 < 0 ? -1 : 0;
            if (t5 > 0)
              this[0] = t5;
            else if (t5 < -1)
              this[0] = t5 + this.DV;
            else
              this.t = 0;
          };
          t4.prototype.fromString = function(e3, r4) {
            var i4;
            if (16 == r4)
              i4 = 4;
            else if (8 == r4)
              i4 = 3;
            else if (256 == r4)
              i4 = 8;
            else if (2 == r4)
              i4 = 1;
            else if (32 == r4)
              i4 = 5;
            else if (4 == r4)
              i4 = 2;
            else {
              this.fromRadix(e3, r4);
              return;
            }
            this.t = 0;
            this.s = 0;
            var n3 = e3.length;
            var s3 = false;
            var a3 = 0;
            while (--n3 >= 0) {
              var o3 = 8 == i4 ? 255 & +e3[n3] : G2(e3, n3);
              if (o3 < 0) {
                if ("-" == e3.charAt(n3))
                  s3 = true;
                continue;
              }
              s3 = false;
              if (0 == a3)
                this[this.t++] = o3;
              else if (a3 + i4 > this.DB) {
                this[this.t - 1] |= (o3 & (1 << this.DB - a3) - 1) << a3;
                this[this.t++] = o3 >> this.DB - a3;
              } else
                this[this.t - 1] |= o3 << a3;
              a3 += i4;
              if (a3 >= this.DB)
                a3 -= this.DB;
            }
            if (8 == i4 && 0 != (128 & +e3[0])) {
              this.s = -1;
              if (a3 > 0)
                this[this.t - 1] |= (1 << this.DB - a3) - 1 << a3;
            }
            this.clamp();
            if (s3)
              t4.ZERO.subTo(this, this);
          };
          t4.prototype.clamp = function() {
            var t5 = this.s & this.DM;
            while (this.t > 0 && this[this.t - 1] == t5)
              --this.t;
          };
          t4.prototype.dlShiftTo = function(t5, e3) {
            var r4;
            for (r4 = this.t - 1; r4 >= 0; --r4)
              e3[r4 + t5] = this[r4];
            for (r4 = t5 - 1; r4 >= 0; --r4)
              e3[r4] = 0;
            e3.t = this.t + t5;
            e3.s = this.s;
          };
          t4.prototype.drShiftTo = function(t5, e3) {
            for (var r4 = t5; r4 < this.t; ++r4)
              e3[r4 - t5] = this[r4];
            e3.t = Math.max(this.t - t5, 0);
            e3.s = this.s;
          };
          t4.prototype.lShiftTo = function(t5, e3) {
            var r4 = t5 % this.DB;
            var i4 = this.DB - r4;
            var n3 = (1 << i4) - 1;
            var s3 = Math.floor(t5 / this.DB);
            var a3 = this.s << r4 & this.DM;
            for (var o3 = this.t - 1; o3 >= 0; --o3) {
              e3[o3 + s3 + 1] = this[o3] >> i4 | a3;
              a3 = (this[o3] & n3) << r4;
            }
            for (var o3 = s3 - 1; o3 >= 0; --o3)
              e3[o3] = 0;
            e3[s3] = a3;
            e3.t = this.t + s3 + 1;
            e3.s = this.s;
            e3.clamp();
          };
          t4.prototype.rShiftTo = function(t5, e3) {
            e3.s = this.s;
            var r4 = Math.floor(t5 / this.DB);
            if (r4 >= this.t) {
              e3.t = 0;
              return;
            }
            var i4 = t5 % this.DB;
            var n3 = this.DB - i4;
            var s3 = (1 << i4) - 1;
            e3[0] = this[r4] >> i4;
            for (var a3 = r4 + 1; a3 < this.t; ++a3) {
              e3[a3 - r4 - 1] |= (this[a3] & s3) << n3;
              e3[a3 - r4] = this[a3] >> i4;
            }
            if (i4 > 0)
              e3[this.t - r4 - 1] |= (this.s & s3) << n3;
            e3.t = this.t - r4;
            e3.clamp();
          };
          t4.prototype.subTo = function(t5, e3) {
            var r4 = 0;
            var i4 = 0;
            var n3 = Math.min(t5.t, this.t);
            while (r4 < n3) {
              i4 += this[r4] - t5[r4];
              e3[r4++] = i4 & this.DM;
              i4 >>= this.DB;
            }
            if (t5.t < this.t) {
              i4 -= t5.s;
              while (r4 < this.t) {
                i4 += this[r4];
                e3[r4++] = i4 & this.DM;
                i4 >>= this.DB;
              }
              i4 += this.s;
            } else {
              i4 += this.s;
              while (r4 < t5.t) {
                i4 -= t5[r4];
                e3[r4++] = i4 & this.DM;
                i4 >>= this.DB;
              }
              i4 -= t5.s;
            }
            e3.s = i4 < 0 ? -1 : 0;
            if (i4 < -1)
              e3[r4++] = this.DV + i4;
            else if (i4 > 0)
              e3[r4++] = i4;
            e3.t = r4;
            e3.clamp();
          };
          t4.prototype.multiplyTo = function(e3, r4) {
            var i4 = this.abs();
            var n3 = e3.abs();
            var s3 = i4.t;
            r4.t = s3 + n3.t;
            while (--s3 >= 0)
              r4[s3] = 0;
            for (s3 = 0; s3 < n3.t; ++s3)
              r4[s3 + i4.t] = i4.am(0, n3[s3], r4, s3, 0, i4.t);
            r4.s = 0;
            r4.clamp();
            if (this.s != e3.s)
              t4.ZERO.subTo(r4, r4);
          };
          t4.prototype.squareTo = function(t5) {
            var e3 = this.abs();
            var r4 = t5.t = 2 * e3.t;
            while (--r4 >= 0)
              t5[r4] = 0;
            for (r4 = 0; r4 < e3.t - 1; ++r4) {
              var i4 = e3.am(r4, e3[r4], t5, 2 * r4, 0, 1);
              if ((t5[r4 + e3.t] += e3.am(r4 + 1, 2 * e3[r4], t5, 2 * r4 + 1, i4, e3.t - r4 - 1)) >= e3.DV) {
                t5[r4 + e3.t] -= e3.DV;
                t5[r4 + e3.t + 1] = 1;
              }
            }
            if (t5.t > 0)
              t5[t5.t - 1] += e3.am(r4, e3[r4], t5, 2 * r4, 0, 1);
            t5.s = 0;
            t5.clamp();
          };
          t4.prototype.divRemTo = function(e3, r4, i4) {
            var n3 = e3.abs();
            if (n3.t <= 0)
              return;
            var s3 = this.abs();
            if (s3.t < n3.t) {
              if (null != r4)
                r4.fromInt(0);
              if (null != i4)
                this.copyTo(i4);
              return;
            }
            if (null == i4)
              i4 = H2();
            var a3 = H2();
            var o3 = this.s;
            var u3 = e3.s;
            var c3 = this.DB - W2(n3[n3.t - 1]);
            if (c3 > 0) {
              n3.lShiftTo(c3, a3);
              s3.lShiftTo(c3, i4);
            } else {
              n3.copyTo(a3);
              s3.copyTo(i4);
            }
            var l3 = a3.t;
            var f3 = a3[l3 - 1];
            if (0 == f3)
              return;
            var h3 = f3 * (1 << this.F1) + (l3 > 1 ? a3[l3 - 2] >> this.F2 : 0);
            var d3 = this.FV / h3;
            var p3 = (1 << this.F1) / h3;
            var v2 = 1 << this.F2;
            var g3 = i4.t;
            var y2 = g3 - l3;
            var m3 = null == r4 ? H2() : r4;
            a3.dlShiftTo(y2, m3);
            if (i4.compareTo(m3) >= 0) {
              i4[i4.t++] = 1;
              i4.subTo(m3, i4);
            }
            t4.ONE.dlShiftTo(l3, m3);
            m3.subTo(a3, a3);
            while (a3.t < l3)
              a3[a3.t++] = 0;
            while (--y2 >= 0) {
              var w3 = i4[--g3] == f3 ? this.DM : Math.floor(i4[g3] * d3 + (i4[g3 - 1] + v2) * p3);
              if ((i4[g3] += a3.am(0, w3, i4, y2, 0, l3)) < w3) {
                a3.dlShiftTo(y2, m3);
                i4.subTo(m3, i4);
                while (i4[g3] < --w3)
                  i4.subTo(m3, i4);
              }
            }
            if (null != r4) {
              i4.drShiftTo(l3, r4);
              if (o3 != u3)
                t4.ZERO.subTo(r4, r4);
            }
            i4.t = l3;
            i4.clamp();
            if (c3 > 0)
              i4.rShiftTo(c3, i4);
            if (o3 < 0)
              t4.ZERO.subTo(i4, i4);
          };
          t4.prototype.invDigit = function() {
            if (this.t < 1)
              return 0;
            var t5 = this[0];
            if (0 == (1 & t5))
              return 0;
            var e3 = 3 & t5;
            e3 = e3 * (2 - (15 & t5) * e3) & 15;
            e3 = e3 * (2 - (255 & t5) * e3) & 255;
            e3 = e3 * (2 - ((65535 & t5) * e3 & 65535)) & 65535;
            e3 = e3 * (2 - t5 * e3 % this.DV) % this.DV;
            return e3 > 0 ? this.DV - e3 : -e3;
          };
          t4.prototype.isEven = function() {
            return 0 == (this.t > 0 ? 1 & this[0] : this.s);
          };
          t4.prototype.exp = function(e3, r4) {
            if (e3 > 4294967295 || e3 < 1)
              return t4.ONE;
            var i4 = H2();
            var n3 = H2();
            var s3 = r4.convert(this);
            var a3 = W2(e3) - 1;
            s3.copyTo(i4);
            while (--a3 >= 0) {
              r4.sqrTo(i4, n3);
              if ((e3 & 1 << a3) > 0)
                r4.mulTo(n3, s3, i4);
              else {
                var o3 = i4;
                i4 = n3;
                n3 = o3;
              }
            }
            return r4.revert(i4);
          };
          t4.prototype.chunkSize = function(t5) {
            return Math.floor(Math.LN2 * this.DB / Math.log(t5));
          };
          t4.prototype.toRadix = function(t5) {
            if (null == t5)
              t5 = 10;
            if (0 == this.signum() || t5 < 2 || t5 > 36)
              return "0";
            var e3 = this.chunkSize(t5);
            var r4 = Math.pow(t5, e3);
            var i4 = Y2(r4);
            var n3 = H2();
            var s3 = H2();
            var a3 = "";
            this.divRemTo(i4, n3, s3);
            while (n3.signum() > 0) {
              a3 = (r4 + s3.intValue()).toString(t5).substr(1) + a3;
              n3.divRemTo(i4, n3, s3);
            }
            return s3.intValue().toString(t5) + a3;
          };
          t4.prototype.fromRadix = function(e3, r4) {
            this.fromInt(0);
            if (null == r4)
              r4 = 10;
            var i4 = this.chunkSize(r4);
            var n3 = Math.pow(r4, i4);
            var s3 = false;
            var a3 = 0;
            var o3 = 0;
            for (var u3 = 0; u3 < e3.length; ++u3) {
              var c3 = G2(e3, u3);
              if (c3 < 0) {
                if ("-" == e3.charAt(u3) && 0 == this.signum())
                  s3 = true;
                continue;
              }
              o3 = r4 * o3 + c3;
              if (++a3 >= i4) {
                this.dMultiply(n3);
                this.dAddOffset(o3, 0);
                a3 = 0;
                o3 = 0;
              }
            }
            if (a3 > 0) {
              this.dMultiply(Math.pow(r4, a3));
              this.dAddOffset(o3, 0);
            }
            if (s3)
              t4.ZERO.subTo(this, this);
          };
          t4.prototype.fromNumber = function(e3, r4, i4) {
            if ("number" == typeof r4)
              if (e3 < 2)
                this.fromInt(1);
              else {
                this.fromNumber(e3, i4);
                if (!this.testBit(e3 - 1))
                  this.bitwiseTo(t4.ONE.shiftLeft(e3 - 1), a2, this);
                if (this.isEven())
                  this.dAddOffset(1, 0);
                while (!this.isProbablePrime(r4)) {
                  this.dAddOffset(2, 0);
                  if (this.bitLength() > e3)
                    this.subTo(t4.ONE.shiftLeft(e3 - 1), this);
                }
              }
            else {
              var n3 = [];
              var s3 = 7 & e3;
              n3.length = (e3 >> 3) + 1;
              r4.nextBytes(n3);
              if (s3 > 0)
                n3[0] &= (1 << s3) - 1;
              else
                n3[0] = 0;
              this.fromString(n3, 256);
            }
          };
          t4.prototype.bitwiseTo = function(t5, e3, r4) {
            var i4;
            var n3;
            var s3 = Math.min(t5.t, this.t);
            for (i4 = 0; i4 < s3; ++i4)
              r4[i4] = e3(this[i4], t5[i4]);
            if (t5.t < this.t) {
              n3 = t5.s & this.DM;
              for (i4 = s3; i4 < this.t; ++i4)
                r4[i4] = e3(this[i4], n3);
              r4.t = this.t;
            } else {
              n3 = this.s & this.DM;
              for (i4 = s3; i4 < t5.t; ++i4)
                r4[i4] = e3(n3, t5[i4]);
              r4.t = t5.t;
            }
            r4.s = e3(this.s, t5.s);
            r4.clamp();
          };
          t4.prototype.changeBit = function(e3, r4) {
            var i4 = t4.ONE.shiftLeft(e3);
            this.bitwiseTo(i4, r4, i4);
            return i4;
          };
          t4.prototype.addTo = function(t5, e3) {
            var r4 = 0;
            var i4 = 0;
            var n3 = Math.min(t5.t, this.t);
            while (r4 < n3) {
              i4 += this[r4] + t5[r4];
              e3[r4++] = i4 & this.DM;
              i4 >>= this.DB;
            }
            if (t5.t < this.t) {
              i4 += t5.s;
              while (r4 < this.t) {
                i4 += this[r4];
                e3[r4++] = i4 & this.DM;
                i4 >>= this.DB;
              }
              i4 += this.s;
            } else {
              i4 += this.s;
              while (r4 < t5.t) {
                i4 += t5[r4];
                e3[r4++] = i4 & this.DM;
                i4 >>= this.DB;
              }
              i4 += t5.s;
            }
            e3.s = i4 < 0 ? -1 : 0;
            if (i4 > 0)
              e3[r4++] = i4;
            else if (i4 < -1)
              e3[r4++] = this.DV + i4;
            e3.t = r4;
            e3.clamp();
          };
          t4.prototype.dMultiply = function(t5) {
            this[this.t] = this.am(0, t5 - 1, this, 0, 0, this.t);
            ++this.t;
            this.clamp();
          };
          t4.prototype.dAddOffset = function(t5, e3) {
            if (0 == t5)
              return;
            while (this.t <= e3)
              this[this.t++] = 0;
            this[e3] += t5;
            while (this[e3] >= this.DV) {
              this[e3] -= this.DV;
              if (++e3 >= this.t)
                this[this.t++] = 0;
              ++this[e3];
            }
          };
          t4.prototype.multiplyLowerTo = function(t5, e3, r4) {
            var i4 = Math.min(this.t + t5.t, e3);
            r4.s = 0;
            r4.t = i4;
            while (i4 > 0)
              r4[--i4] = 0;
            for (var n3 = r4.t - this.t; i4 < n3; ++i4)
              r4[i4 + this.t] = this.am(0, t5[i4], r4, i4, 0, this.t);
            for (var n3 = Math.min(t5.t, e3); i4 < n3; ++i4)
              this.am(0, t5[i4], r4, i4, 0, e3 - i4);
            r4.clamp();
          };
          t4.prototype.multiplyUpperTo = function(t5, e3, r4) {
            --e3;
            var i4 = r4.t = this.t + t5.t - e3;
            r4.s = 0;
            while (--i4 >= 0)
              r4[i4] = 0;
            for (i4 = Math.max(e3 - this.t, 0); i4 < t5.t; ++i4)
              r4[this.t + i4 - e3] = this.am(e3 - i4, t5[i4], r4, 0, 0, this.t + i4 - e3);
            r4.clamp();
            r4.drShiftTo(1, r4);
          };
          t4.prototype.modInt = function(t5) {
            if (t5 <= 0)
              return 0;
            var e3 = this.DV % t5;
            var r4 = this.s < 0 ? t5 - 1 : 0;
            if (this.t > 0)
              if (0 == e3)
                r4 = this[0] % t5;
              else
                for (var i4 = this.t - 1; i4 >= 0; --i4)
                  r4 = (e3 * r4 + this[i4]) % t5;
            return r4;
          };
          t4.prototype.millerRabin = function(e3) {
            var r4 = this.subtract(t4.ONE);
            var i4 = r4.getLowestSetBit();
            if (i4 <= 0)
              return false;
            var n3 = r4.shiftRight(i4);
            e3 = e3 + 1 >> 1;
            if (e3 > O2.length)
              e3 = O2.length;
            var s3 = H2();
            for (var a3 = 0; a3 < e3; ++a3) {
              s3.fromInt(O2[Math.floor(Math.random() * O2.length)]);
              var o3 = s3.modPow(n3, this);
              if (0 != o3.compareTo(t4.ONE) && 0 != o3.compareTo(r4)) {
                var u3 = 1;
                while (u3++ < i4 && 0 != o3.compareTo(r4)) {
                  o3 = o3.modPowInt(2, this);
                  if (0 == o3.compareTo(t4.ONE))
                    return false;
                }
                if (0 != o3.compareTo(r4))
                  return false;
              }
            }
            return true;
          };
          t4.prototype.square = function() {
            var t5 = H2();
            this.squareTo(t5);
            return t5;
          };
          t4.prototype.gcda = function(t5, e3) {
            var r4 = this.s < 0 ? this.negate() : this.clone();
            var i4 = t5.s < 0 ? t5.negate() : t5.clone();
            if (r4.compareTo(i4) < 0) {
              var n3 = r4;
              r4 = i4;
              i4 = n3;
            }
            var s3 = r4.getLowestSetBit();
            var a3 = i4.getLowestSetBit();
            if (a3 < 0) {
              e3(r4);
              return;
            }
            if (s3 < a3)
              a3 = s3;
            if (a3 > 0) {
              r4.rShiftTo(a3, r4);
              i4.rShiftTo(a3, i4);
            }
            var o3 = function() {
              if ((s3 = r4.getLowestSetBit()) > 0)
                r4.rShiftTo(s3, r4);
              if ((s3 = i4.getLowestSetBit()) > 0)
                i4.rShiftTo(s3, i4);
              if (r4.compareTo(i4) >= 0) {
                r4.subTo(i4, r4);
                r4.rShiftTo(1, r4);
              } else {
                i4.subTo(r4, i4);
                i4.rShiftTo(1, i4);
              }
              if (!(r4.signum() > 0)) {
                if (a3 > 0)
                  i4.lShiftTo(a3, i4);
                setTimeout(function() {
                  e3(i4);
                }, 0);
              } else
                setTimeout(o3, 0);
            };
            setTimeout(o3, 10);
          };
          t4.prototype.fromNumberAsync = function(e3, r4, i4, n3) {
            if ("number" == typeof r4)
              if (e3 < 2)
                this.fromInt(1);
              else {
                this.fromNumber(e3, i4);
                if (!this.testBit(e3 - 1))
                  this.bitwiseTo(t4.ONE.shiftLeft(e3 - 1), a2, this);
                if (this.isEven())
                  this.dAddOffset(1, 0);
                var s3 = this;
                var o3 = function() {
                  s3.dAddOffset(2, 0);
                  if (s3.bitLength() > e3)
                    s3.subTo(t4.ONE.shiftLeft(e3 - 1), s3);
                  if (s3.isProbablePrime(r4))
                    setTimeout(function() {
                      n3();
                    }, 0);
                  else
                    setTimeout(o3, 0);
                };
                setTimeout(o3, 0);
              }
            else {
              var u3 = [];
              var c3 = 7 & e3;
              u3.length = (e3 >> 3) + 1;
              r4.nextBytes(u3);
              if (c3 > 0)
                u3[0] &= (1 << c3) - 1;
              else
                u3[0] = 0;
              this.fromString(u3, 256);
            }
          };
          return t4;
        }();
        var N2 = function() {
          function t4() {
          }
          t4.prototype.convert = function(t5) {
            return t5;
          };
          t4.prototype.revert = function(t5) {
            return t5;
          };
          t4.prototype.mulTo = function(t5, e3, r4) {
            t5.multiplyTo(e3, r4);
          };
          t4.prototype.sqrTo = function(t5, e3) {
            t5.squareTo(e3);
          };
          return t4;
        }();
        var P2 = function() {
          function t4(t5) {
            this.m = t5;
          }
          t4.prototype.convert = function(t5) {
            if (t5.s < 0 || t5.compareTo(this.m) >= 0)
              return t5.mod(this.m);
            else
              return t5;
          };
          t4.prototype.revert = function(t5) {
            return t5;
          };
          t4.prototype.reduce = function(t5) {
            t5.divRemTo(this.m, null, t5);
          };
          t4.prototype.mulTo = function(t5, e3, r4) {
            t5.multiplyTo(e3, r4);
            this.reduce(r4);
          };
          t4.prototype.sqrTo = function(t5, e3) {
            t5.squareTo(e3);
            this.reduce(e3);
          };
          return t4;
        }();
        var V2 = function() {
          function t4(t5) {
            this.m = t5;
            this.mp = t5.invDigit();
            this.mpl = 32767 & this.mp;
            this.mph = this.mp >> 15;
            this.um = (1 << t5.DB - 15) - 1;
            this.mt2 = 2 * t5.t;
          }
          t4.prototype.convert = function(t5) {
            var e3 = H2();
            t5.abs().dlShiftTo(this.m.t, e3);
            e3.divRemTo(this.m, null, e3);
            if (t5.s < 0 && e3.compareTo(C2.ZERO) > 0)
              this.m.subTo(e3, e3);
            return e3;
          };
          t4.prototype.revert = function(t5) {
            var e3 = H2();
            t5.copyTo(e3);
            this.reduce(e3);
            return e3;
          };
          t4.prototype.reduce = function(t5) {
            while (t5.t <= this.mt2)
              t5[t5.t++] = 0;
            for (var e3 = 0; e3 < this.m.t; ++e3) {
              var r4 = 32767 & t5[e3];
              var i4 = r4 * this.mpl + ((r4 * this.mph + (t5[e3] >> 15) * this.mpl & this.um) << 15) & t5.DM;
              r4 = e3 + this.m.t;
              t5[r4] += this.m.am(0, i4, t5, e3, 0, this.m.t);
              while (t5[r4] >= t5.DV) {
                t5[r4] -= t5.DV;
                t5[++r4]++;
              }
            }
            t5.clamp();
            t5.drShiftTo(this.m.t, t5);
            if (t5.compareTo(this.m) >= 0)
              t5.subTo(this.m, t5);
          };
          t4.prototype.mulTo = function(t5, e3, r4) {
            t5.multiplyTo(e3, r4);
            this.reduce(r4);
          };
          t4.prototype.sqrTo = function(t5, e3) {
            t5.squareTo(e3);
            this.reduce(e3);
          };
          return t4;
        }();
        var L2 = function() {
          function t4(t5) {
            this.m = t5;
            this.r2 = H2();
            this.q3 = H2();
            C2.ONE.dlShiftTo(2 * t5.t, this.r2);
            this.mu = this.r2.divide(t5);
          }
          t4.prototype.convert = function(t5) {
            if (t5.s < 0 || t5.t > 2 * this.m.t)
              return t5.mod(this.m);
            else if (t5.compareTo(this.m) < 0)
              return t5;
            else {
              var e3 = H2();
              t5.copyTo(e3);
              this.reduce(e3);
              return e3;
            }
          };
          t4.prototype.revert = function(t5) {
            return t5;
          };
          t4.prototype.reduce = function(t5) {
            t5.drShiftTo(this.m.t - 1, this.r2);
            if (t5.t > this.m.t + 1) {
              t5.t = this.m.t + 1;
              t5.clamp();
            }
            this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
            this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
            while (t5.compareTo(this.r2) < 0)
              t5.dAddOffset(1, this.m.t + 1);
            t5.subTo(this.r2, t5);
            while (t5.compareTo(this.m) >= 0)
              t5.subTo(this.m, t5);
          };
          t4.prototype.mulTo = function(t5, e3, r4) {
            t5.multiplyTo(e3, r4);
            this.reduce(r4);
          };
          t4.prototype.sqrTo = function(t5, e3) {
            t5.squareTo(e3);
            this.reduce(e3);
          };
          return t4;
        }();
        function H2() {
          return new C2(null);
        }
        function K2(t4, e3) {
          return new C2(t4, e3);
        }
        var U2 = "undefined" !== typeof navigator;
        if (U2 && B2 && "Microsoft Internet Explorer" == navigator.appName) {
          C2.prototype.am = function t4(e3, r4, i4, n3, s3, a3) {
            var o3 = 32767 & r4;
            var u3 = r4 >> 15;
            while (--a3 >= 0) {
              var c3 = 32767 & this[e3];
              var l3 = this[e3++] >> 15;
              var f3 = u3 * c3 + l3 * o3;
              c3 = o3 * c3 + ((32767 & f3) << 15) + i4[n3] + (1073741823 & s3);
              s3 = (c3 >>> 30) + (f3 >>> 15) + u3 * l3 + (s3 >>> 30);
              i4[n3++] = 1073741823 & c3;
            }
            return s3;
          };
          x2 = 30;
        } else if (U2 && B2 && "Netscape" != navigator.appName) {
          C2.prototype.am = function t4(e3, r4, i4, n3, s3, a3) {
            while (--a3 >= 0) {
              var o3 = r4 * this[e3++] + i4[n3] + s3;
              s3 = Math.floor(o3 / 67108864);
              i4[n3++] = 67108863 & o3;
            }
            return s3;
          };
          x2 = 26;
        } else {
          C2.prototype.am = function t4(e3, r4, i4, n3, s3, a3) {
            var o3 = 16383 & r4;
            var u3 = r4 >> 14;
            while (--a3 >= 0) {
              var c3 = 16383 & this[e3];
              var l3 = this[e3++] >> 14;
              var f3 = u3 * c3 + l3 * o3;
              c3 = o3 * c3 + ((16383 & f3) << 14) + i4[n3] + s3;
              s3 = (c3 >> 28) + (f3 >> 14) + u3 * l3;
              i4[n3++] = 268435455 & c3;
            }
            return s3;
          };
          x2 = 28;
        }
        C2.prototype.DB = x2;
        C2.prototype.DM = (1 << x2) - 1;
        C2.prototype.DV = 1 << x2;
        var j2 = 52;
        C2.prototype.FV = Math.pow(2, j2);
        C2.prototype.F1 = j2 - x2;
        C2.prototype.F2 = 2 * x2 - j2;
        var q2 = [];
        var F2;
        var z2;
        F2 = "0".charCodeAt(0);
        for (z2 = 0; z2 <= 9; ++z2)
          q2[F2++] = z2;
        F2 = "a".charCodeAt(0);
        for (z2 = 10; z2 < 36; ++z2)
          q2[F2++] = z2;
        F2 = "A".charCodeAt(0);
        for (z2 = 10; z2 < 36; ++z2)
          q2[F2++] = z2;
        function G2(t4, e3) {
          var r4 = q2[t4.charCodeAt(e3)];
          return null == r4 ? -1 : r4;
        }
        function Y2(t4) {
          var e3 = H2();
          e3.fromInt(t4);
          return e3;
        }
        function W2(t4) {
          var e3 = 1;
          var r4;
          if (0 != (r4 = t4 >>> 16)) {
            t4 = r4;
            e3 += 16;
          }
          if (0 != (r4 = t4 >> 8)) {
            t4 = r4;
            e3 += 8;
          }
          if (0 != (r4 = t4 >> 4)) {
            t4 = r4;
            e3 += 4;
          }
          if (0 != (r4 = t4 >> 2)) {
            t4 = r4;
            e3 += 2;
          }
          if (0 != (r4 = t4 >> 1)) {
            t4 = r4;
            e3 += 1;
          }
          return e3;
        }
        C2.ZERO = Y2(0);
        C2.ONE = Y2(1);
        var J2 = function() {
          function t4() {
            this.i = 0;
            this.j = 0;
            this.S = [];
          }
          t4.prototype.init = function(t5) {
            var e3;
            var r4;
            var i4;
            for (e3 = 0; e3 < 256; ++e3)
              this.S[e3] = e3;
            r4 = 0;
            for (e3 = 0; e3 < 256; ++e3) {
              r4 = r4 + this.S[e3] + t5[e3 % t5.length] & 255;
              i4 = this.S[e3];
              this.S[e3] = this.S[r4];
              this.S[r4] = i4;
            }
            this.i = 0;
            this.j = 0;
          };
          t4.prototype.next = function() {
            var t5;
            this.i = this.i + 1 & 255;
            this.j = this.j + this.S[this.i] & 255;
            t5 = this.S[this.i];
            this.S[this.i] = this.S[this.j];
            this.S[this.j] = t5;
            return this.S[t5 + this.S[this.i] & 255];
          };
          return t4;
        }();
        function Z2() {
          return new J2();
        }
        var $2 = 256;
        var X2;
        var Q2 = null;
        var tt2;
        if (null == Q2) {
          Q2 = [];
          tt2 = 0;
        }
        function nt2() {
          if (null == X2) {
            X2 = Z2();
            while (tt2 < $2) {
              var t4 = Math.floor(65536 * Math.random());
              Q2[tt2++] = 255 & t4;
            }
            X2.init(Q2);
            for (tt2 = 0; tt2 < Q2.length; ++tt2)
              Q2[tt2] = 0;
            tt2 = 0;
          }
          return X2.next();
        }
        var st2 = function() {
          function t4() {
          }
          t4.prototype.nextBytes = function(t5) {
            for (var e3 = 0; e3 < t5.length; ++e3)
              t5[e3] = nt2();
          };
          return t4;
        }();
        function at2(t4, e3) {
          if (e3 < t4.length + 22) {
            console.error("Message too long for RSA");
            return null;
          }
          var r4 = e3 - t4.length - 6;
          var i4 = "";
          for (var n3 = 0; n3 < r4; n3 += 2)
            i4 += "ff";
          var s3 = "0001" + i4 + "00" + t4;
          return K2(s3, 16);
        }
        function ot2(t4, e3) {
          if (e3 < t4.length + 11) {
            console.error("Message too long for RSA");
            return null;
          }
          var r4 = [];
          var i4 = t4.length - 1;
          while (i4 >= 0 && e3 > 0) {
            var n3 = t4.charCodeAt(i4--);
            if (n3 < 128)
              r4[--e3] = n3;
            else if (n3 > 127 && n3 < 2048) {
              r4[--e3] = 63 & n3 | 128;
              r4[--e3] = n3 >> 6 | 192;
            } else {
              r4[--e3] = 63 & n3 | 128;
              r4[--e3] = n3 >> 6 & 63 | 128;
              r4[--e3] = n3 >> 12 | 224;
            }
          }
          r4[--e3] = 0;
          var s3 = new st2();
          var a3 = [];
          while (e3 > 2) {
            a3[0] = 0;
            while (0 == a3[0])
              s3.nextBytes(a3);
            r4[--e3] = a3[0];
          }
          r4[--e3] = 2;
          r4[--e3] = 0;
          return new C2(r4);
        }
        var ut2 = function() {
          function t4() {
            this.n = null;
            this.e = 0;
            this.d = null;
            this.p = null;
            this.q = null;
            this.dmp1 = null;
            this.dmq1 = null;
            this.coeff = null;
          }
          t4.prototype.doPublic = function(t5) {
            return t5.modPowInt(this.e, this.n);
          };
          t4.prototype.doPrivate = function(t5) {
            if (null == this.p || null == this.q)
              return t5.modPow(this.d, this.n);
            var e3 = t5.mod(this.p).modPow(this.dmp1, this.p);
            var r4 = t5.mod(this.q).modPow(this.dmq1, this.q);
            while (e3.compareTo(r4) < 0)
              e3 = e3.add(this.p);
            return e3.subtract(r4).multiply(this.coeff).mod(this.p).multiply(this.q).add(r4);
          };
          t4.prototype.setPublic = function(t5, e3) {
            if (null != t5 && null != e3 && t5.length > 0 && e3.length > 0) {
              this.n = K2(t5, 16);
              this.e = parseInt(e3, 16);
            } else
              console.error("Invalid RSA public key");
          };
          t4.prototype.encrypt = function(t5) {
            var e3 = this.n.bitLength() + 7 >> 3;
            var r4 = ot2(t5, e3);
            if (null == r4)
              return null;
            var i4 = this.doPublic(r4);
            if (null == i4)
              return null;
            var n3 = i4.toString(16);
            var s3 = n3.length;
            for (var a3 = 0; a3 < 2 * e3 - s3; a3++)
              n3 = "0" + n3;
            return n3;
          };
          t4.prototype.setPrivate = function(t5, e3, r4) {
            if (null != t5 && null != e3 && t5.length > 0 && e3.length > 0) {
              this.n = K2(t5, 16);
              this.e = parseInt(e3, 16);
              this.d = K2(r4, 16);
            } else
              console.error("Invalid RSA private key");
          };
          t4.prototype.setPrivateEx = function(t5, e3, r4, i4, n3, s3, a3, o3) {
            if (null != t5 && null != e3 && t5.length > 0 && e3.length > 0) {
              this.n = K2(t5, 16);
              this.e = parseInt(e3, 16);
              this.d = K2(r4, 16);
              this.p = K2(i4, 16);
              this.q = K2(n3, 16);
              this.dmp1 = K2(s3, 16);
              this.dmq1 = K2(a3, 16);
              this.coeff = K2(o3, 16);
            } else
              console.error("Invalid RSA private key");
          };
          t4.prototype.generate = function(t5, e3) {
            var r4 = new st2();
            var i4 = t5 >> 1;
            this.e = parseInt(e3, 16);
            var n3 = new C2(e3, 16);
            for (; ; ) {
              for (; ; ) {
                this.p = new C2(t5 - i4, 1, r4);
                if (0 == this.p.subtract(C2.ONE).gcd(n3).compareTo(C2.ONE) && this.p.isProbablePrime(10))
                  break;
              }
              for (; ; ) {
                this.q = new C2(i4, 1, r4);
                if (0 == this.q.subtract(C2.ONE).gcd(n3).compareTo(C2.ONE) && this.q.isProbablePrime(10))
                  break;
              }
              if (this.p.compareTo(this.q) <= 0) {
                var s3 = this.p;
                this.p = this.q;
                this.q = s3;
              }
              var a3 = this.p.subtract(C2.ONE);
              var o3 = this.q.subtract(C2.ONE);
              var u3 = a3.multiply(o3);
              if (0 == u3.gcd(n3).compareTo(C2.ONE)) {
                this.n = this.p.multiply(this.q);
                this.d = n3.modInverse(u3);
                this.dmp1 = this.d.mod(a3);
                this.dmq1 = this.d.mod(o3);
                this.coeff = this.q.modInverse(this.p);
                break;
              }
            }
          };
          t4.prototype.decrypt = function(t5) {
            var e3 = K2(t5, 16);
            var r4 = this.doPrivate(e3);
            if (null == r4)
              return null;
            return ct2(r4, this.n.bitLength() + 7 >> 3);
          };
          t4.prototype.generateAsync = function(t5, e3, r4) {
            var i4 = new st2();
            var n3 = t5 >> 1;
            this.e = parseInt(e3, 16);
            var s3 = new C2(e3, 16);
            var a3 = this;
            var o3 = function() {
              var e4 = function() {
                if (a3.p.compareTo(a3.q) <= 0) {
                  var t6 = a3.p;
                  a3.p = a3.q;
                  a3.q = t6;
                }
                var e5 = a3.p.subtract(C2.ONE);
                var i5 = a3.q.subtract(C2.ONE);
                var n4 = e5.multiply(i5);
                if (0 == n4.gcd(s3).compareTo(C2.ONE)) {
                  a3.n = a3.p.multiply(a3.q);
                  a3.d = s3.modInverse(n4);
                  a3.dmp1 = a3.d.mod(e5);
                  a3.dmq1 = a3.d.mod(i5);
                  a3.coeff = a3.q.modInverse(a3.p);
                  setTimeout(function() {
                    r4();
                  }, 0);
                } else
                  setTimeout(o3, 0);
              };
              var u3 = function() {
                a3.q = H2();
                a3.q.fromNumberAsync(n3, 1, i4, function() {
                  a3.q.subtract(C2.ONE).gcda(s3, function(t6) {
                    if (0 == t6.compareTo(C2.ONE) && a3.q.isProbablePrime(10))
                      setTimeout(e4, 0);
                    else
                      setTimeout(u3, 0);
                  });
                });
              };
              var c3 = function() {
                a3.p = H2();
                a3.p.fromNumberAsync(t5 - n3, 1, i4, function() {
                  a3.p.subtract(C2.ONE).gcda(s3, function(t6) {
                    if (0 == t6.compareTo(C2.ONE) && a3.p.isProbablePrime(10))
                      setTimeout(u3, 0);
                    else
                      setTimeout(c3, 0);
                  });
                });
              };
              setTimeout(c3, 0);
            };
            setTimeout(o3, 0);
          };
          t4.prototype.sign = function(t5, e3, r4) {
            var i4 = ht2(r4);
            var n3 = i4 + e3(t5).toString();
            var s3 = at2(n3, this.n.bitLength() / 4);
            if (null == s3)
              return null;
            var a3 = this.doPrivate(s3);
            if (null == a3)
              return null;
            var o3 = a3.toString(16);
            if (0 == (1 & o3.length))
              return o3;
            else
              return "0" + o3;
          };
          t4.prototype.verify = function(t5, e3, r4) {
            var i4 = K2(e3, 16);
            var n3 = this.doPublic(i4);
            if (null == n3)
              return null;
            var s3 = n3.toString(16).replace(/^1f+00/, "");
            var a3 = dt2(s3);
            return a3 == r4(t5).toString();
          };
          t4.prototype.encryptLong = function(t5) {
            var e3 = this;
            var r4 = "";
            var i4 = (this.n.bitLength() + 7 >> 3) - 11;
            var n3 = this.setSplitChn(t5, i4);
            n3.forEach(function(t6) {
              r4 += e3.encrypt(t6);
            });
            return r4;
          };
          t4.prototype.decryptLong = function(t5) {
            var e3 = "";
            var r4 = this.n.bitLength() + 7 >> 3;
            var i4 = 2 * r4;
            if (t5.length > i4) {
              var n3 = t5.match(new RegExp(".{1," + i4 + "}", "g")) || [];
              var s3 = [];
              for (var a3 = 0; a3 < n3.length; a3++) {
                var o3 = K2(n3[a3], 16);
                var u3 = this.doPrivate(o3);
                if (null == u3)
                  return null;
                s3.push(u3);
              }
              e3 = lt2(s3, r4);
            } else
              e3 = this.decrypt(t5);
            return e3;
          };
          t4.prototype.setSplitChn = function(t5, e3, r4) {
            if (void 0 === r4)
              r4 = [];
            var i4 = t5.split("");
            var n3 = 0;
            for (var s3 = 0; s3 < i4.length; s3++) {
              var a3 = i4[s3].charCodeAt(0);
              if (a3 <= 127)
                n3 += 1;
              else if (a3 <= 2047)
                n3 += 2;
              else if (a3 <= 65535)
                n3 += 3;
              else
                n3 += 4;
              if (n3 > e3) {
                var o3 = t5.substring(0, s3);
                r4.push(o3);
                return this.setSplitChn(t5.substring(s3), e3, r4);
              }
            }
            r4.push(t5);
            return r4;
          };
          return t4;
        }();
        function ct2(t4, e3) {
          var r4 = t4.toByteArray();
          var i4 = 0;
          while (i4 < r4.length && 0 == r4[i4])
            ++i4;
          if (r4.length - i4 != e3 - 1 || 2 != r4[i4])
            return null;
          ++i4;
          while (0 != r4[i4])
            if (++i4 >= r4.length)
              return null;
          var n3 = "";
          while (++i4 < r4.length) {
            var s3 = 255 & r4[i4];
            if (s3 < 128)
              n3 += String.fromCharCode(s3);
            else if (s3 > 191 && s3 < 224) {
              n3 += String.fromCharCode((31 & s3) << 6 | 63 & r4[i4 + 1]);
              ++i4;
            } else {
              n3 += String.fromCharCode((15 & s3) << 12 | (63 & r4[i4 + 1]) << 6 | 63 & r4[i4 + 2]);
              i4 += 2;
            }
          }
          return n3;
        }
        function lt2(t4, e3) {
          var r4 = [];
          for (var i4 = 0; i4 < t4.length; i4++) {
            var n3 = t4[i4];
            var s3 = n3.toByteArray();
            var a3 = 0;
            while (a3 < s3.length && 0 == s3[a3])
              ++a3;
            if (s3.length - a3 != e3 - 1 || 2 != s3[a3])
              return null;
            ++a3;
            while (0 != s3[a3])
              if (++a3 >= s3.length)
                return null;
            r4 = r4.concat(s3.slice(a3 + 1));
          }
          var o3 = r4;
          var u3 = -1;
          var c3 = "";
          while (++u3 < o3.length) {
            var l3 = 255 & o3[u3];
            if (l3 < 128)
              c3 += String.fromCharCode(l3);
            else if (l3 > 191 && l3 < 224) {
              c3 += String.fromCharCode((31 & l3) << 6 | 63 & o3[u3 + 1]);
              ++u3;
            } else {
              c3 += String.fromCharCode((15 & l3) << 12 | (63 & o3[u3 + 1]) << 6 | 63 & o3[u3 + 2]);
              u3 += 2;
            }
          }
          return c3;
        }
        var ft2 = { md2: "3020300c06082a864886f70d020205000410", md5: "3020300c06082a864886f70d020505000410", sha1: "3021300906052b0e03021a05000414", sha224: "302d300d06096086480165030402040500041c", sha256: "3031300d060960864801650304020105000420", sha384: "3041300d060960864801650304020205000430", sha512: "3051300d060960864801650304020305000440", ripemd160: "3021300906052b2403020105000414" };
        function ht2(t4) {
          return ft2[t4] || "";
        }
        function dt2(t4) {
          for (var e3 in ft2)
            if (ft2.hasOwnProperty(e3)) {
              var r4 = ft2[e3];
              var i4 = r4.length;
              if (t4.substr(0, i4) == r4)
                return t4.substr(i4);
            }
          return t4;
        }
        var pt2 = {};
        pt2.lang = { extend: function(t4, e3, r4) {
          if (!e3 || !t4)
            throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
          var i4 = function() {
          };
          i4.prototype = e3.prototype;
          t4.prototype = new i4();
          t4.prototype.constructor = t4;
          t4.superclass = e3.prototype;
          if (e3.prototype.constructor == Object.prototype.constructor)
            e3.prototype.constructor = e3;
          if (r4) {
            var n3;
            for (n3 in r4)
              t4.prototype[n3] = r4[n3];
            var s3 = function() {
            }, a3 = ["toString", "valueOf"];
            try {
              if (/MSIE/.test(navigator.userAgent))
                s3 = function(t5, e4) {
                  for (n3 = 0; n3 < a3.length; n3 += 1) {
                    var r5 = a3[n3], i5 = e4[r5];
                    if ("function" === typeof i5 && i5 != Object.prototype[r5])
                      t5[r5] = i5;
                  }
                };
            } catch (t5) {
            }
            s3(t4.prototype, r4);
          }
        } };
        var vt2 = {};
        if ("undefined" == typeof vt2.asn1 || !vt2.asn1)
          vt2.asn1 = {};
        vt2.asn1.ASN1Util = new function() {
          this.integerToByteHex = function(t4) {
            var e3 = t4.toString(16);
            if (e3.length % 2 == 1)
              e3 = "0" + e3;
            return e3;
          };
          this.bigIntToMinTwosComplementsHex = function(t4) {
            var e3 = t4.toString(16);
            if ("-" != e3.substr(0, 1)) {
              if (e3.length % 2 == 1)
                e3 = "0" + e3;
              else if (!e3.match(/^[0-7]/))
                e3 = "00" + e3;
            } else {
              var r4 = e3.substr(1);
              var i4 = r4.length;
              if (i4 % 2 == 1)
                i4 += 1;
              else if (!e3.match(/^[0-7]/))
                i4 += 2;
              var n3 = "";
              for (var s3 = 0; s3 < i4; s3++)
                n3 += "f";
              var a3 = new C2(n3, 16);
              var o3 = a3.xor(t4).add(C2.ONE);
              e3 = o3.toString(16).replace(/^-/, "");
            }
            return e3;
          };
          this.getPEMStringFromHex = function(t4, e3) {
            return hextopem(t4, e3);
          };
          this.newObject = function(t4) {
            var e3 = vt2, r4 = e3.asn1, i4 = r4.DERBoolean, n3 = r4.DERInteger, s3 = r4.DERBitString, a3 = r4.DEROctetString, o3 = r4.DERNull, u3 = r4.DERObjectIdentifier, c3 = r4.DEREnumerated, l3 = r4.DERUTF8String, f3 = r4.DERNumericString, h3 = r4.DERPrintableString, d3 = r4.DERTeletexString, p3 = r4.DERIA5String, v2 = r4.DERUTCTime, g3 = r4.DERGeneralizedTime, y2 = r4.DERSequence, m3 = r4.DERSet, w3 = r4.DERTaggedObject, S3 = r4.ASN1Util.newObject;
            var _3 = Object.keys(t4);
            if (1 != _3.length)
              throw "key of param shall be only one.";
            var b3 = _3[0];
            if (-1 == ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + b3 + ":"))
              throw "undefined key: " + b3;
            if ("bool" == b3)
              return new i4(t4[b3]);
            if ("int" == b3)
              return new n3(t4[b3]);
            if ("bitstr" == b3)
              return new s3(t4[b3]);
            if ("octstr" == b3)
              return new a3(t4[b3]);
            if ("null" == b3)
              return new o3(t4[b3]);
            if ("oid" == b3)
              return new u3(t4[b3]);
            if ("enum" == b3)
              return new c3(t4[b3]);
            if ("utf8str" == b3)
              return new l3(t4[b3]);
            if ("numstr" == b3)
              return new f3(t4[b3]);
            if ("prnstr" == b3)
              return new h3(t4[b3]);
            if ("telstr" == b3)
              return new d3(t4[b3]);
            if ("ia5str" == b3)
              return new p3(t4[b3]);
            if ("utctime" == b3)
              return new v2(t4[b3]);
            if ("gentime" == b3)
              return new g3(t4[b3]);
            if ("seq" == b3) {
              var E3 = t4[b3];
              var D3 = [];
              for (var M3 = 0; M3 < E3.length; M3++) {
                var T3 = S3(E3[M3]);
                D3.push(T3);
              }
              return new y2({ array: D3 });
            }
            if ("set" == b3) {
              var E3 = t4[b3];
              var D3 = [];
              for (var M3 = 0; M3 < E3.length; M3++) {
                var T3 = S3(E3[M3]);
                D3.push(T3);
              }
              return new m3({ array: D3 });
            }
            if ("tag" == b3) {
              var I3 = t4[b3];
              if ("[object Array]" === Object.prototype.toString.call(I3) && 3 == I3.length) {
                var A3 = S3(I3[2]);
                return new w3({ tag: I3[0], explicit: I3[1], obj: A3 });
              } else {
                var x3 = {};
                if (void 0 !== I3.explicit)
                  x3.explicit = I3.explicit;
                if (void 0 !== I3.tag)
                  x3.tag = I3.tag;
                if (void 0 === I3.obj)
                  throw "obj shall be specified for 'tag'.";
                x3.obj = S3(I3.obj);
                return new w3(x3);
              }
            }
          };
          this.jsonToASN1HEX = function(t4) {
            var e3 = this.newObject(t4);
            return e3.getEncodedHex();
          };
        }();
        vt2.asn1.ASN1Util.oidHexToInt = function(t4) {
          var e3 = "";
          var r4 = parseInt(t4.substr(0, 2), 16);
          var i4 = Math.floor(r4 / 40);
          var n3 = r4 % 40;
          var e3 = i4 + "." + n3;
          var s3 = "";
          for (var a3 = 2; a3 < t4.length; a3 += 2) {
            var o3 = parseInt(t4.substr(a3, 2), 16);
            var u3 = ("00000000" + o3.toString(2)).slice(-8);
            s3 += u3.substr(1, 7);
            if ("0" == u3.substr(0, 1)) {
              var c3 = new C2(s3, 2);
              e3 = e3 + "." + c3.toString(10);
              s3 = "";
            }
          }
          return e3;
        };
        vt2.asn1.ASN1Util.oidIntToHex = function(t4) {
          var e3 = function(t5) {
            var e4 = t5.toString(16);
            if (1 == e4.length)
              e4 = "0" + e4;
            return e4;
          };
          var r4 = function(t5) {
            var r5 = "";
            var i5 = new C2(t5, 10);
            var n4 = i5.toString(2);
            var s4 = 7 - n4.length % 7;
            if (7 == s4)
              s4 = 0;
            var a4 = "";
            for (var o3 = 0; o3 < s4; o3++)
              a4 += "0";
            n4 = a4 + n4;
            for (var o3 = 0; o3 < n4.length - 1; o3 += 7) {
              var u3 = n4.substr(o3, 7);
              if (o3 != n4.length - 7)
                u3 = "1" + u3;
              r5 += e3(parseInt(u3, 2));
            }
            return r5;
          };
          if (!t4.match(/^[0-9.]+$/))
            throw "malformed oid string: " + t4;
          var i4 = "";
          var n3 = t4.split(".");
          var s3 = 40 * parseInt(n3[0]) + parseInt(n3[1]);
          i4 += e3(s3);
          n3.splice(0, 2);
          for (var a3 = 0; a3 < n3.length; a3++)
            i4 += r4(n3[a3]);
          return i4;
        };
        vt2.asn1.ASN1Object = function() {
          var n3 = "";
          this.getLengthHexFromValue = function() {
            if ("undefined" == typeof this.hV || null == this.hV)
              throw "this.hV is null or undefined.";
            if (this.hV.length % 2 == 1)
              throw "value hex must be even length: n=" + n3.length + ",v=" + this.hV;
            var t4 = this.hV.length / 2;
            var e3 = t4.toString(16);
            if (e3.length % 2 == 1)
              e3 = "0" + e3;
            if (t4 < 128)
              return e3;
            else {
              var r4 = e3.length / 2;
              if (r4 > 15)
                throw "ASN.1 length too long to represent by 8x: n = " + t4.toString(16);
              var i4 = 128 + r4;
              return i4.toString(16) + e3;
            }
          };
          this.getEncodedHex = function() {
            if (null == this.hTLV || this.isModified) {
              this.hV = this.getFreshValueHex();
              this.hL = this.getLengthHexFromValue();
              this.hTLV = this.hT + this.hL + this.hV;
              this.isModified = false;
            }
            return this.hTLV;
          };
          this.getValueHex = function() {
            this.getEncodedHex();
            return this.hV;
          };
          this.getFreshValueHex = function() {
            return "";
          };
        };
        vt2.asn1.DERAbstractString = function(t4) {
          vt2.asn1.DERAbstractString.superclass.constructor.call(this);
          this.getString = function() {
            return this.s;
          };
          this.setString = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.s = t5;
            this.hV = stohex(this.s);
          };
          this.setStringHex = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = t5;
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
          if ("undefined" != typeof t4) {
            if ("string" == typeof t4)
              this.setString(t4);
            else if ("undefined" != typeof t4["str"])
              this.setString(t4["str"]);
            else if ("undefined" != typeof t4["hex"])
              this.setStringHex(t4["hex"]);
          }
        };
        pt2.lang.extend(vt2.asn1.DERAbstractString, vt2.asn1.ASN1Object);
        vt2.asn1.DERAbstractTime = function(t4) {
          vt2.asn1.DERAbstractTime.superclass.constructor.call(this);
          this.localDateToUTC = function(t5) {
            utc = t5.getTime() + 6e4 * t5.getTimezoneOffset();
            var e3 = new Date(utc);
            return e3;
          };
          this.formatDate = function(t5, e3, r4) {
            var i4 = this.zeroPadding;
            var n3 = this.localDateToUTC(t5);
            var s3 = String(n3.getFullYear());
            if ("utc" == e3)
              s3 = s3.substr(2, 2);
            var a3 = i4(String(n3.getMonth() + 1), 2);
            var o3 = i4(String(n3.getDate()), 2);
            var u3 = i4(String(n3.getHours()), 2);
            var c3 = i4(String(n3.getMinutes()), 2);
            var l3 = i4(String(n3.getSeconds()), 2);
            var f3 = s3 + a3 + o3 + u3 + c3 + l3;
            if (true === r4) {
              var h3 = n3.getMilliseconds();
              if (0 != h3) {
                var d3 = i4(String(h3), 3);
                d3 = d3.replace(/[0]+$/, "");
                f3 = f3 + "." + d3;
              }
            }
            return f3 + "Z";
          };
          this.zeroPadding = function(t5, e3) {
            if (t5.length >= e3)
              return t5;
            return new Array(e3 - t5.length + 1).join("0") + t5;
          };
          this.getString = function() {
            return this.s;
          };
          this.setString = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.s = t5;
            this.hV = stohex(t5);
          };
          this.setByDateValue = function(t5, e3, r4, i4, n3, s3) {
            var a3 = new Date(Date.UTC(t5, e3 - 1, r4, i4, n3, s3, 0));
            this.setByDate(a3);
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
        };
        pt2.lang.extend(vt2.asn1.DERAbstractTime, vt2.asn1.ASN1Object);
        vt2.asn1.DERAbstractStructured = function(t4) {
          vt2.asn1.DERAbstractString.superclass.constructor.call(this);
          this.setByASN1ObjectArray = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.asn1Array = t5;
          };
          this.appendASN1Object = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.asn1Array.push(t5);
          };
          this.asn1Array = new Array();
          if ("undefined" != typeof t4) {
            if ("undefined" != typeof t4["array"])
              this.asn1Array = t4["array"];
          }
        };
        pt2.lang.extend(vt2.asn1.DERAbstractStructured, vt2.asn1.ASN1Object);
        vt2.asn1.DERBoolean = function() {
          vt2.asn1.DERBoolean.superclass.constructor.call(this);
          this.hT = "01";
          this.hTLV = "0101ff";
        };
        pt2.lang.extend(vt2.asn1.DERBoolean, vt2.asn1.ASN1Object);
        vt2.asn1.DERInteger = function(t4) {
          vt2.asn1.DERInteger.superclass.constructor.call(this);
          this.hT = "02";
          this.setByBigInteger = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = vt2.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t5);
          };
          this.setByInteger = function(t5) {
            var e3 = new C2(String(t5), 10);
            this.setByBigInteger(e3);
          };
          this.setValueHex = function(t5) {
            this.hV = t5;
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
          if ("undefined" != typeof t4) {
            if ("undefined" != typeof t4["bigint"])
              this.setByBigInteger(t4["bigint"]);
            else if ("undefined" != typeof t4["int"])
              this.setByInteger(t4["int"]);
            else if ("number" == typeof t4)
              this.setByInteger(t4);
            else if ("undefined" != typeof t4["hex"])
              this.setValueHex(t4["hex"]);
          }
        };
        pt2.lang.extend(vt2.asn1.DERInteger, vt2.asn1.ASN1Object);
        vt2.asn1.DERBitString = function(t4) {
          if (void 0 !== t4 && "undefined" !== typeof t4.obj) {
            var e3 = vt2.asn1.ASN1Util.newObject(t4.obj);
            t4.hex = "00" + e3.getEncodedHex();
          }
          vt2.asn1.DERBitString.superclass.constructor.call(this);
          this.hT = "03";
          this.setHexValueIncludingUnusedBits = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = t5;
          };
          this.setUnusedBitsAndHexValue = function(t5, e4) {
            if (t5 < 0 || 7 < t5)
              throw "unused bits shall be from 0 to 7: u = " + t5;
            var r4 = "0" + t5;
            this.hTLV = null;
            this.isModified = true;
            this.hV = r4 + e4;
          };
          this.setByBinaryString = function(t5) {
            t5 = t5.replace(/0+$/, "");
            var e4 = 8 - t5.length % 8;
            if (8 == e4)
              e4 = 0;
            for (var r4 = 0; r4 <= e4; r4++)
              t5 += "0";
            var i4 = "";
            for (var r4 = 0; r4 < t5.length - 1; r4 += 8) {
              var n3 = t5.substr(r4, 8);
              var s3 = parseInt(n3, 2).toString(16);
              if (1 == s3.length)
                s3 = "0" + s3;
              i4 += s3;
            }
            this.hTLV = null;
            this.isModified = true;
            this.hV = "0" + e4 + i4;
          };
          this.setByBooleanArray = function(t5) {
            var e4 = "";
            for (var r4 = 0; r4 < t5.length; r4++)
              if (true == t5[r4])
                e4 += "1";
              else
                e4 += "0";
            this.setByBinaryString(e4);
          };
          this.newFalseArray = function(t5) {
            var e4 = new Array(t5);
            for (var r4 = 0; r4 < t5; r4++)
              e4[r4] = false;
            return e4;
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
          if ("undefined" != typeof t4) {
            if ("string" == typeof t4 && t4.toLowerCase().match(/^[0-9a-f]+$/))
              this.setHexValueIncludingUnusedBits(t4);
            else if ("undefined" != typeof t4["hex"])
              this.setHexValueIncludingUnusedBits(t4["hex"]);
            else if ("undefined" != typeof t4["bin"])
              this.setByBinaryString(t4["bin"]);
            else if ("undefined" != typeof t4["array"])
              this.setByBooleanArray(t4["array"]);
          }
        };
        pt2.lang.extend(vt2.asn1.DERBitString, vt2.asn1.ASN1Object);
        vt2.asn1.DEROctetString = function(t4) {
          if (void 0 !== t4 && "undefined" !== typeof t4.obj) {
            var e3 = vt2.asn1.ASN1Util.newObject(t4.obj);
            t4.hex = e3.getEncodedHex();
          }
          vt2.asn1.DEROctetString.superclass.constructor.call(this, t4);
          this.hT = "04";
        };
        pt2.lang.extend(vt2.asn1.DEROctetString, vt2.asn1.DERAbstractString);
        vt2.asn1.DERNull = function() {
          vt2.asn1.DERNull.superclass.constructor.call(this);
          this.hT = "05";
          this.hTLV = "0500";
        };
        pt2.lang.extend(vt2.asn1.DERNull, vt2.asn1.ASN1Object);
        vt2.asn1.DERObjectIdentifier = function(t4) {
          var e3 = function(t5) {
            var e4 = t5.toString(16);
            if (1 == e4.length)
              e4 = "0" + e4;
            return e4;
          };
          var r4 = function(t5) {
            var r5 = "";
            var i4 = new C2(t5, 10);
            var n3 = i4.toString(2);
            var s3 = 7 - n3.length % 7;
            if (7 == s3)
              s3 = 0;
            var a3 = "";
            for (var o3 = 0; o3 < s3; o3++)
              a3 += "0";
            n3 = a3 + n3;
            for (var o3 = 0; o3 < n3.length - 1; o3 += 7) {
              var u3 = n3.substr(o3, 7);
              if (o3 != n3.length - 7)
                u3 = "1" + u3;
              r5 += e3(parseInt(u3, 2));
            }
            return r5;
          };
          vt2.asn1.DERObjectIdentifier.superclass.constructor.call(this);
          this.hT = "06";
          this.setValueHex = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = t5;
          };
          this.setValueOidString = function(t5) {
            if (!t5.match(/^[0-9.]+$/))
              throw "malformed oid string: " + t5;
            var i4 = "";
            var n3 = t5.split(".");
            var s3 = 40 * parseInt(n3[0]) + parseInt(n3[1]);
            i4 += e3(s3);
            n3.splice(0, 2);
            for (var a3 = 0; a3 < n3.length; a3++)
              i4 += r4(n3[a3]);
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = i4;
          };
          this.setValueName = function(t5) {
            var e4 = vt2.asn1.x509.OID.name2oid(t5);
            if ("" !== e4)
              this.setValueOidString(e4);
            else
              throw "DERObjectIdentifier oidName undefined: " + t5;
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
          if (void 0 !== t4) {
            if ("string" === typeof t4)
              if (t4.match(/^[0-2].[0-9.]+$/))
                this.setValueOidString(t4);
              else
                this.setValueName(t4);
            else if (void 0 !== t4.oid)
              this.setValueOidString(t4.oid);
            else if (void 0 !== t4.hex)
              this.setValueHex(t4.hex);
            else if (void 0 !== t4.name)
              this.setValueName(t4.name);
          }
        };
        pt2.lang.extend(vt2.asn1.DERObjectIdentifier, vt2.asn1.ASN1Object);
        vt2.asn1.DEREnumerated = function(t4) {
          vt2.asn1.DEREnumerated.superclass.constructor.call(this);
          this.hT = "0a";
          this.setByBigInteger = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = vt2.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t5);
          };
          this.setByInteger = function(t5) {
            var e3 = new C2(String(t5), 10);
            this.setByBigInteger(e3);
          };
          this.setValueHex = function(t5) {
            this.hV = t5;
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
          if ("undefined" != typeof t4) {
            if ("undefined" != typeof t4["int"])
              this.setByInteger(t4["int"]);
            else if ("number" == typeof t4)
              this.setByInteger(t4);
            else if ("undefined" != typeof t4["hex"])
              this.setValueHex(t4["hex"]);
          }
        };
        pt2.lang.extend(vt2.asn1.DEREnumerated, vt2.asn1.ASN1Object);
        vt2.asn1.DERUTF8String = function(t4) {
          vt2.asn1.DERUTF8String.superclass.constructor.call(this, t4);
          this.hT = "0c";
        };
        pt2.lang.extend(vt2.asn1.DERUTF8String, vt2.asn1.DERAbstractString);
        vt2.asn1.DERNumericString = function(t4) {
          vt2.asn1.DERNumericString.superclass.constructor.call(this, t4);
          this.hT = "12";
        };
        pt2.lang.extend(vt2.asn1.DERNumericString, vt2.asn1.DERAbstractString);
        vt2.asn1.DERPrintableString = function(t4) {
          vt2.asn1.DERPrintableString.superclass.constructor.call(this, t4);
          this.hT = "13";
        };
        pt2.lang.extend(vt2.asn1.DERPrintableString, vt2.asn1.DERAbstractString);
        vt2.asn1.DERTeletexString = function(t4) {
          vt2.asn1.DERTeletexString.superclass.constructor.call(this, t4);
          this.hT = "14";
        };
        pt2.lang.extend(vt2.asn1.DERTeletexString, vt2.asn1.DERAbstractString);
        vt2.asn1.DERIA5String = function(t4) {
          vt2.asn1.DERIA5String.superclass.constructor.call(this, t4);
          this.hT = "16";
        };
        pt2.lang.extend(vt2.asn1.DERIA5String, vt2.asn1.DERAbstractString);
        vt2.asn1.DERUTCTime = function(t4) {
          vt2.asn1.DERUTCTime.superclass.constructor.call(this, t4);
          this.hT = "17";
          this.setByDate = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.date = t5;
            this.s = this.formatDate(this.date, "utc");
            this.hV = stohex(this.s);
          };
          this.getFreshValueHex = function() {
            if ("undefined" == typeof this.date && "undefined" == typeof this.s) {
              this.date = new Date();
              this.s = this.formatDate(this.date, "utc");
              this.hV = stohex(this.s);
            }
            return this.hV;
          };
          if (void 0 !== t4) {
            if (void 0 !== t4.str)
              this.setString(t4.str);
            else if ("string" == typeof t4 && t4.match(/^[0-9]{12}Z$/))
              this.setString(t4);
            else if (void 0 !== t4.hex)
              this.setStringHex(t4.hex);
            else if (void 0 !== t4.date)
              this.setByDate(t4.date);
          }
        };
        pt2.lang.extend(vt2.asn1.DERUTCTime, vt2.asn1.DERAbstractTime);
        vt2.asn1.DERGeneralizedTime = function(t4) {
          vt2.asn1.DERGeneralizedTime.superclass.constructor.call(this, t4);
          this.hT = "18";
          this.withMillis = false;
          this.setByDate = function(t5) {
            this.hTLV = null;
            this.isModified = true;
            this.date = t5;
            this.s = this.formatDate(this.date, "gen", this.withMillis);
            this.hV = stohex(this.s);
          };
          this.getFreshValueHex = function() {
            if (void 0 === this.date && void 0 === this.s) {
              this.date = new Date();
              this.s = this.formatDate(this.date, "gen", this.withMillis);
              this.hV = stohex(this.s);
            }
            return this.hV;
          };
          if (void 0 !== t4) {
            if (void 0 !== t4.str)
              this.setString(t4.str);
            else if ("string" == typeof t4 && t4.match(/^[0-9]{14}Z$/))
              this.setString(t4);
            else if (void 0 !== t4.hex)
              this.setStringHex(t4.hex);
            else if (void 0 !== t4.date)
              this.setByDate(t4.date);
            if (true === t4.millis)
              this.withMillis = true;
          }
        };
        pt2.lang.extend(vt2.asn1.DERGeneralizedTime, vt2.asn1.DERAbstractTime);
        vt2.asn1.DERSequence = function(t4) {
          vt2.asn1.DERSequence.superclass.constructor.call(this, t4);
          this.hT = "30";
          this.getFreshValueHex = function() {
            var t5 = "";
            for (var e3 = 0; e3 < this.asn1Array.length; e3++) {
              var r4 = this.asn1Array[e3];
              t5 += r4.getEncodedHex();
            }
            this.hV = t5;
            return this.hV;
          };
        };
        pt2.lang.extend(vt2.asn1.DERSequence, vt2.asn1.DERAbstractStructured);
        vt2.asn1.DERSet = function(t4) {
          vt2.asn1.DERSet.superclass.constructor.call(this, t4);
          this.hT = "31";
          this.sortFlag = true;
          this.getFreshValueHex = function() {
            var t5 = new Array();
            for (var e3 = 0; e3 < this.asn1Array.length; e3++) {
              var r4 = this.asn1Array[e3];
              t5.push(r4.getEncodedHex());
            }
            if (true == this.sortFlag)
              t5.sort();
            this.hV = t5.join("");
            return this.hV;
          };
          if ("undefined" != typeof t4) {
            if ("undefined" != typeof t4.sortflag && false == t4.sortflag)
              this.sortFlag = false;
          }
        };
        pt2.lang.extend(vt2.asn1.DERSet, vt2.asn1.DERAbstractStructured);
        vt2.asn1.DERTaggedObject = function(t4) {
          vt2.asn1.DERTaggedObject.superclass.constructor.call(this);
          this.hT = "a0";
          this.hV = "";
          this.isExplicit = true;
          this.asn1Object = null;
          this.setASN1Object = function(t5, e3, r4) {
            this.hT = e3;
            this.isExplicit = t5;
            this.asn1Object = r4;
            if (this.isExplicit) {
              this.hV = this.asn1Object.getEncodedHex();
              this.hTLV = null;
              this.isModified = true;
            } else {
              this.hV = null;
              this.hTLV = r4.getEncodedHex();
              this.hTLV = this.hTLV.replace(/^../, e3);
              this.isModified = false;
            }
          };
          this.getFreshValueHex = function() {
            return this.hV;
          };
          if ("undefined" != typeof t4) {
            if ("undefined" != typeof t4["tag"])
              this.hT = t4["tag"];
            if ("undefined" != typeof t4["explicit"])
              this.isExplicit = t4["explicit"];
            if ("undefined" != typeof t4["obj"]) {
              this.asn1Object = t4["obj"];
              this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
            }
          }
        };
        pt2.lang.extend(vt2.asn1.DERTaggedObject, vt2.asn1.ASN1Object);
        var gt2 = function() {
          var t4 = function(e3, r4) {
            t4 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t5, e4) {
              t5.__proto__ = e4;
            } || function(t5, e4) {
              for (var r5 in e4)
                if (Object.prototype.hasOwnProperty.call(e4, r5))
                  t5[r5] = e4[r5];
            };
            return t4(e3, r4);
          };
          return function(e3, r4) {
            if ("function" !== typeof r4 && null !== r4)
              throw new TypeError("Class extends value " + String(r4) + " is not a constructor or null");
            t4(e3, r4);
            function i4() {
              this.constructor = e3;
            }
            e3.prototype = null === r4 ? Object.create(r4) : (i4.prototype = r4.prototype, new i4());
          };
        }();
        var yt2 = function(t4) {
          gt2(e3, t4);
          function e3(r4) {
            var i4 = t4.call(this) || this;
            if (r4) {
              if ("string" === typeof r4)
                i4.parseKey(r4);
              else if (e3.hasPrivateKeyProperty(r4) || e3.hasPublicKeyProperty(r4))
                i4.parsePropertiesFrom(r4);
            }
            return i4;
          }
          e3.prototype.parseKey = function(t5) {
            try {
              var e4 = 0;
              var r4 = 0;
              var i4 = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
              var n3 = i4.test(t5) ? y.decode(t5) : w2.unarmor(t5);
              var s3 = I2.decode(n3);
              if (3 === s3.sub.length)
                s3 = s3.sub[2].sub[0];
              if (9 === s3.sub.length) {
                e4 = s3.sub[1].getHexStringValue();
                this.n = K2(e4, 16);
                r4 = s3.sub[2].getHexStringValue();
                this.e = parseInt(r4, 16);
                var a3 = s3.sub[3].getHexStringValue();
                this.d = K2(a3, 16);
                var o3 = s3.sub[4].getHexStringValue();
                this.p = K2(o3, 16);
                var u3 = s3.sub[5].getHexStringValue();
                this.q = K2(u3, 16);
                var c3 = s3.sub[6].getHexStringValue();
                this.dmp1 = K2(c3, 16);
                var l3 = s3.sub[7].getHexStringValue();
                this.dmq1 = K2(l3, 16);
                var f3 = s3.sub[8].getHexStringValue();
                this.coeff = K2(f3, 16);
              } else if (2 === s3.sub.length) {
                var h3 = s3.sub[1];
                var d3 = h3.sub[0];
                e4 = d3.sub[0].getHexStringValue();
                this.n = K2(e4, 16);
                r4 = d3.sub[1].getHexStringValue();
                this.e = parseInt(r4, 16);
              } else
                return false;
              return true;
            } catch (t6) {
              return false;
            }
          };
          e3.prototype.getPrivateBaseKey = function() {
            var t5 = { array: [new vt2.asn1.DERInteger({ int: 0 }), new vt2.asn1.DERInteger({ bigint: this.n }), new vt2.asn1.DERInteger({ int: this.e }), new vt2.asn1.DERInteger({ bigint: this.d }), new vt2.asn1.DERInteger({ bigint: this.p }), new vt2.asn1.DERInteger({ bigint: this.q }), new vt2.asn1.DERInteger({ bigint: this.dmp1 }), new vt2.asn1.DERInteger({ bigint: this.dmq1 }), new vt2.asn1.DERInteger({ bigint: this.coeff })] };
            var e4 = new vt2.asn1.DERSequence(t5);
            return e4.getEncodedHex();
          };
          e3.prototype.getPrivateBaseKeyB64 = function() {
            return d2(this.getPrivateBaseKey());
          };
          e3.prototype.getPublicBaseKey = function() {
            var t5 = new vt2.asn1.DERSequence({ array: [new vt2.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }), new vt2.asn1.DERNull()] });
            var e4 = new vt2.asn1.DERSequence({ array: [new vt2.asn1.DERInteger({ bigint: this.n }), new vt2.asn1.DERInteger({ int: this.e })] });
            var r4 = new vt2.asn1.DERBitString({ hex: "00" + e4.getEncodedHex() });
            var i4 = new vt2.asn1.DERSequence({ array: [t5, r4] });
            return i4.getEncodedHex();
          };
          e3.prototype.getPublicBaseKeyB64 = function() {
            return d2(this.getPublicBaseKey());
          };
          e3.wordwrap = function(t5, e4) {
            e4 = e4 || 64;
            if (!t5)
              return t5;
            var r4 = "(.{1," + e4 + "})( +|$\n?)|(.{1," + e4 + "})";
            return t5.match(RegExp(r4, "g")).join("\n");
          };
          e3.prototype.getPrivateKey = function() {
            var t5 = "-----BEGIN RSA PRIVATE KEY-----\n";
            t5 += e3.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
            t5 += "-----END RSA PRIVATE KEY-----";
            return t5;
          };
          e3.prototype.getPublicKey = function() {
            var t5 = "-----BEGIN PUBLIC KEY-----\n";
            t5 += e3.wordwrap(this.getPublicBaseKeyB64()) + "\n";
            t5 += "-----END PUBLIC KEY-----";
            return t5;
          };
          e3.hasPublicKeyProperty = function(t5) {
            t5 = t5 || {};
            return t5.hasOwnProperty("n") && t5.hasOwnProperty("e");
          };
          e3.hasPrivateKeyProperty = function(t5) {
            t5 = t5 || {};
            return t5.hasOwnProperty("n") && t5.hasOwnProperty("e") && t5.hasOwnProperty("d") && t5.hasOwnProperty("p") && t5.hasOwnProperty("q") && t5.hasOwnProperty("dmp1") && t5.hasOwnProperty("dmq1") && t5.hasOwnProperty("coeff");
          };
          e3.prototype.parsePropertiesFrom = function(t5) {
            this.n = t5.n;
            this.e = t5.e;
            if (t5.hasOwnProperty("d")) {
              this.d = t5.d;
              this.p = t5.p;
              this.q = t5.q;
              this.dmp1 = t5.dmp1;
              this.dmq1 = t5.dmq1;
              this.coeff = t5.coeff;
            }
          };
          return e3;
        }(ut2);
        const mt2 = { i: "3.2.1" };
        var wt2 = function() {
          function t4(t5) {
            if (void 0 === t5)
              t5 = {};
            t5 = t5 || {};
            this.default_key_size = t5.default_key_size ? parseInt(t5.default_key_size, 10) : 1024;
            this.default_public_exponent = t5.default_public_exponent || "010001";
            this.log = t5.log || false;
            this.key = null;
          }
          t4.prototype.setKey = function(t5) {
            if (this.log && this.key)
              console.warn("A key was already set, overriding existing.");
            this.key = new yt2(t5);
          };
          t4.prototype.setPrivateKey = function(t5) {
            this.setKey(t5);
          };
          t4.prototype.setPublicKey = function(t5) {
            this.setKey(t5);
          };
          t4.prototype.decrypt = function(t5) {
            try {
              return this.getKey().decrypt(p2(t5));
            } catch (t6) {
              return false;
            }
          };
          t4.prototype.encrypt = function(t5) {
            try {
              return this.getKey().encrypt(t5);
            } catch (t6) {
              return false;
            }
          };
          t4.prototype.encryptLong = function(t5) {
            try {
              return d2(this.getKey().encryptLong(t5));
            } catch (t6) {
              return false;
            }
          };
          t4.prototype.decryptLong = function(t5) {
            try {
              return this.getKey().decryptLong(t5);
            } catch (t6) {
              return false;
            }
          };
          t4.prototype.sign = function(t5, e3, r4) {
            try {
              return d2(this.getKey().sign(t5, e3, r4));
            } catch (t6) {
              return false;
            }
          };
          t4.prototype.verify = function(t5, e3, r4) {
            try {
              return this.getKey().verify(t5, p2(e3), r4);
            } catch (t6) {
              return false;
            }
          };
          t4.prototype.getKey = function(t5) {
            if (!this.key) {
              this.key = new yt2();
              if (t5 && "[object Function]" === {}.toString.call(t5)) {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, t5);
                return;
              }
              this.key.generate(this.default_key_size, this.default_public_exponent);
            }
            return this.key;
          };
          t4.prototype.getPrivateKey = function() {
            return this.getKey().getPrivateKey();
          };
          t4.prototype.getPrivateKeyB64 = function() {
            return this.getKey().getPrivateBaseKeyB64();
          };
          t4.prototype.getPublicKey = function() {
            return this.getKey().getPublicKey();
          };
          t4.prototype.getPublicKeyB64 = function() {
            return this.getKey().getPublicBaseKeyB64();
          };
          t4.version = mt2.i;
          return t4;
        }();
        const St2 = wt2;
      }, 2480: () => {
      } };
      var e = {};
      function r2(i3) {
        var n2 = e[i3];
        if (void 0 !== n2)
          return n2.exports;
        var s2 = e[i3] = { id: i3, loaded: false, exports: {} };
        t2[i3].call(s2.exports, s2, s2.exports, r2);
        s2.loaded = true;
        return s2.exports;
      }
      (() => {
        r2.d = (t3, e2) => {
          for (var i3 in e2)
            if (r2.o(e2, i3) && !r2.o(t3, i3))
              Object.defineProperty(t3, i3, { enumerable: true, get: e2[i3] });
        };
      })();
      (() => {
        r2.g = function() {
          if ("object" === typeof globalThis)
            return globalThis;
          try {
            return this || new Function("return this")();
          } catch (t3) {
            if ("object" === typeof window)
              return window;
          }
        }();
      })();
      (() => {
        r2.o = (t3, e2) => Object.prototype.hasOwnProperty.call(t3, e2);
      })();
      (() => {
        r2.r = (t3) => {
          if ("undefined" !== typeof Symbol && Symbol.toStringTag)
            Object.defineProperty(t3, Symbol.toStringTag, { value: "Module" });
          Object.defineProperty(t3, "__esModule", { value: true });
        };
      })();
      (() => {
        r2.nmd = (t3) => {
          t3.paths = [];
          if (!t3.children)
            t3.children = [];
          return t3;
        };
      })();
      var i2 = r2(5987);
      return i2;
    })());
  });
  var GtPush = /* @__PURE__ */ getDefaultExportFromCjs(gtpushMin);
  function initPushNotification() {
    if (typeof plus !== "undefined" && plus.push) {
      plus.globalEvent.addEventListener("newPath", ({ path }) => {
        if (!path) {
          return;
        }
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        if (currentPage && currentPage.$page && currentPage.$page.fullPath === path) {
          return;
        }
        uni.navigateTo({
          url: path,
          fail(res2) {
            if (res2.errMsg.indexOf("tabbar") > -1) {
              uni.switchTab({
                url: path,
                fail(res3) {
                  console.error(res3.errMsg);
                }
              });
            } else {
              console.error(res2.errMsg);
            }
          }
        });
      });
    }
  }
  uni.invokePushCallback({
    type: "enabled"
  });
  const appid = "__UNI__76A9E40";
  {
    initPushNotification();
    GtPush.init({
      appid,
      onError: (res2) => {
        console.error(res2.error);
        uni.invokePushCallback({
          type: "clientId",
          cid: "",
          errMsg: res2.error
        });
      },
      onClientId: (res2) => {
        uni.invokePushCallback({
          type: "clientId",
          cid: res2.cid
        });
      },
      onlineState: (res2) => {
        uni.invokePushCallback({
          type: "lineState",
          online: res2.online
        });
      },
      onPushMsg: (res2) => {
        uni.invokePushCallback({
          type: "pushMsg",
          message: res2.message
        });
      }
    });
    uni.onPushMessage((res2) => {
      if (res2.type === "receive" && res2.data && res2.data.force_notification) {
        uni.createPushMessage(res2.data);
        res2.stopped = true;
      }
    });
  }
  const uniStarterConfig = {
    "h5": {
      "url": "https://uni-starter.dcloud.net.cn",
      "openApp": {}
    },
    "mp": {
      "weixin": {
        "id": ""
      }
    },
    "about": {
      "appName": "uni-starter",
      "logo": "/static/logo.png",
      "company": "\u5317\u4EACxx\u7F51\u7EDC\u6280\u672F\u6709\u9650\u516C\u53F8",
      "slogan": "\u4E91\u7AEF\u4E00\u4F53\u5E94\u7528\u5FEB\u901F\u5F00\u53D1\u6A21\u7248",
      "download": "https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8",
      "version": "1.0.0"
    },
    "download": {
      "ios": "https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8",
      "android": "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-97fca9f2-41f6-449f-a35e-3f135d4c3875/6d754387-a6c3-48ed-8ad2-e8f39b40fc01.apk"
    },
    "marketId": {
      "ios": "",
      "android": ""
    },
    "i18n": {
      "enable": false
    }
  };
  function callCheckVersion() {
    return new Promise((resolve, reject) => {
      plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
        const data = {
          action: "checkVersion",
          appid: plus.runtime.appid,
          appVersion: plus.runtime.version,
          wgtVersion: widgetInfo.version
        };
        formatAppLog("log", "at uni_modules/uni-upgrade-center-app/utils/call-check-version.js:11", "data: ", data);
        As.callFunction({
          name: "uni-upgrade-center",
          data,
          success: (e) => {
            formatAppLog("log", "at uni_modules/uni-upgrade-center-app/utils/call-check-version.js:16", "e: ", e);
            resolve(e);
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
    });
  }
  function interceptorChooseImage() {
    uni.addInterceptor("chooseImage", {
      fail(e) {
        formatAppLog("log", "at uni_modules/json-interceptor-chooseImage/js_sdk/main.js:5", e);
        if (uni.getSystemInfoSync().platform == "android" && e.errMsg == "chooseImage:fail No Permission") {
          if (e.code === 11) {
            uni.showModal({
              title: "\u65E0\u6CD5\u8BBF\u95EE\u6444\u50CF\u5934",
              content: "\u5F53\u524D\u65E0\u6444\u50CF\u5934\u8BBF\u95EE\u6743\u9650\uFF0C\u5EFA\u8BAE\u524D\u5F80\u8BBE\u7F6E",
              confirmText: "\u524D\u5F80\u8BBE\u7F6E",
              success(e2) {
                if (e2.confirm) {
                  gotoAppPermissionSetting();
                }
              }
            });
          } else {
            uni.showModal({
              title: "\u65E0\u6CD5\u8BBF\u95EE\u76F8\u518C",
              content: "\u5F53\u524D\u65E0\u7CFB\u7EDF\u76F8\u518C\u8BBF\u95EE\u6743\u9650\uFF0C\u5EFA\u8BAE\u524D\u5F80\u8BBE\u7F6E",
              confirmText: "\u524D\u5F80\u8BBE\u7F6E",
              success(e2) {
                if (e2.confirm) {
                  gotoAppPermissionSetting();
                }
              }
            });
          }
        } else if (e.errCode === 2 && e.errMsg == "chooseImage:fail No filming permission") {
          formatAppLog("log", "at uni_modules/json-interceptor-chooseImage/js_sdk/main.js:31", "e.errMsg === 2  ios\u65E0\u6CD5\u62CD\u7167\u6743\u9650 ");
          uni.showModal({
            title: "\u65E0\u6CD5\u8BBF\u95EE\u6444\u50CF\u5934",
            content: "\u5F53\u524D\u65E0\u6444\u50CF\u5934\u8BBF\u95EE\u6743\u9650\uFF0C\u5EFA\u8BAE\u524D\u5F80\u8BBE\u7F6E",
            confirmText: "\u524D\u5F80\u8BBE\u7F6E",
            success(e2) {
              if (e2.confirm) {
                gotoAppPermissionSetting();
              }
            }
          });
        }
      }
    });
    function gotoAppPermissionSetting() {
      if (uni.getSystemInfoSync().platform == "ios") {
        var UIApplication = plus.ios.import("UIApplication");
        var application2 = UIApplication.sharedApplication();
        var NSURL2 = plus.ios.import("NSURL");
        var setting2 = NSURL2.URLWithString("app-settings:");
        application2.openURL(setting2);
        plus.ios.deleteObject(setting2);
        plus.ios.deleteObject(NSURL2);
        plus.ios.deleteObject(application2);
      } else {
        var Intent = plus.android.importClass("android.content.Intent");
        var Settings = plus.android.importClass("android.provider.Settings");
        var Uri = plus.android.importClass("android.net.Uri");
        var mainActivity = plus.android.runtimeMainActivity();
        var intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
        intent.setData(uri);
        mainActivity.startActivity(intent);
      }
    }
  }
  interceptorChooseImage();
  const db = As.database();
  async function initApp() {
    uniStarterConfig.debug;
    setTimeout(() => {
      getApp({
        allowDefault: true
      }).globalData.config = uniStarterConfig;
    }, 1);
    initAppVersion();
    function onDBError({
      code,
      message
    }) {
      formatAppLog("log", "at common/appInit.js:32", "onDBError", {
        code,
        message
      });
      formatAppLog("error", "at common/appInit.js:37", code, message);
    }
    db.on("error", onDBError);
    As.interceptObject({
      async invoke({
        objectName,
        methodName,
        params
      }) {
      },
      success(e) {
      },
      complete() {
      },
      fail(e) {
      }
    });
    uni.onNetworkStatusChange((res2) => {
      if (res2.networkType != "none") {
        uni.showToast({
          title: "\u5F53\u524D\u7F51\u7EDC\u7C7B\u578B\uFF1A" + res2.networkType,
          icon: "none",
          duration: 3e3
        });
      } else {
        uni.showToast({
          title: "\u7F51\u7EDC\u7C7B\u578B\uFF1A" + res2.networkType,
          icon: "none",
          duration: 3e3
        });
      }
    });
  }
  function initAppVersion() {
    let appid2 = plus.runtime.appid;
    plus.runtime.getProperty(appid2, (wgtInfo) => {
      let appVersion = plus.runtime;
      let currentVersion = appVersion.versionCode > wgtInfo.versionCode ? appVersion : wgtInfo;
      getApp({
        allowDefault: true
      }).appVersion = {
        ...currentVersion,
        appid: appid2,
        hasNew: false
      };
      callCheckVersion().then((res2) => {
        if (res2.result.code > 0) {
          getApp({
            allowDefault: true
          }).appVersion.hasNew = true;
        }
      });
    });
  }
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:16", "onLaunch");
      initApp();
    },
    onShow: function() {
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:23", "onHide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/studyUninApp/bodybuilding-app/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
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
