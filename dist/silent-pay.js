var Kt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Gn(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function ea(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var r = function i() {
      return this instanceof i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    r.prototype = e.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(t).forEach(function(i) {
    var f = Object.getOwnPropertyDescriptor(t, i);
    Object.defineProperty(r, i, f.get ? f : {
      enumerable: !0,
      get: function() {
        return t[i];
      }
    });
  }), r;
}
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
var _r = wr.bech32m = wr.bech32 = void 0;
const Nr = "qpzry9x8gf2tvdw0s3jn54khce6mua7l", Zn = {};
for (let t = 0; t < Nr.length; t++) {
  const e = Nr.charAt(t);
  Zn[e] = t;
}
function er(t) {
  const e = t >> 25;
  return (t & 33554431) << 5 ^ -(e >> 0 & 1) & 996825010 ^ -(e >> 1 & 1) & 642813549 ^ -(e >> 2 & 1) & 513874426 ^ -(e >> 3 & 1) & 1027748829 ^ -(e >> 4 & 1) & 705979059;
}
function vn(t) {
  let e = 1;
  for (let r = 0; r < t.length; ++r) {
    const i = t.charCodeAt(r);
    if (i < 33 || i > 126)
      return "Invalid prefix (" + t + ")";
    e = er(e) ^ i >> 5;
  }
  e = er(e);
  for (let r = 0; r < t.length; ++r) {
    const i = t.charCodeAt(r);
    e = er(e) ^ i & 31;
  }
  return e;
}
function Zi(t, e, r, i) {
  let f = 0, n = 0;
  const u = (1 << r) - 1, h = [];
  for (let b = 0; b < t.length; ++b)
    for (f = f << e | t[b], n += e; n >= r; )
      n -= r, h.push(f >> n & u);
  if (i)
    n > 0 && h.push(f << r - n & u);
  else {
    if (n >= e)
      return "Excess padding";
    if (f << r - n & u)
      return "Non-zero padding";
  }
  return h;
}
function ta(t) {
  return Zi(t, 8, 5, !0);
}
function ra(t) {
  const e = Zi(t, 5, 8, !1);
  if (Array.isArray(e))
    return e;
}
function ia(t) {
  const e = Zi(t, 5, 8, !1);
  if (Array.isArray(e))
    return e;
  throw new Error(e);
}
function Jn(t) {
  let e;
  t === "bech32" ? e = 1 : e = 734539939;
  function r(u, h, b) {
    if (b = b || 90, u.length + 7 + h.length > b)
      throw new TypeError("Exceeds length limit");
    u = u.toLowerCase();
    let _ = vn(u);
    if (typeof _ == "string")
      throw new Error(_);
    let w = u + "1";
    for (let E = 0; E < h.length; ++E) {
      const P = h[E];
      if (P >> 5)
        throw new Error("Non 5-bit word");
      _ = er(_) ^ P, w += Nr.charAt(P);
    }
    for (let E = 0; E < 6; ++E)
      _ = er(_);
    _ ^= e;
    for (let E = 0; E < 6; ++E) {
      const P = _ >> (5 - E) * 5 & 31;
      w += Nr.charAt(P);
    }
    return w;
  }
  function i(u, h) {
    if (h = h || 90, u.length < 8)
      return u + " too short";
    if (u.length > h)
      return "Exceeds length limit";
    const b = u.toLowerCase(), _ = u.toUpperCase();
    if (u !== b && u !== _)
      return "Mixed-case string " + u;
    u = b;
    const w = u.lastIndexOf("1");
    if (w === -1)
      return "No separator character for " + u;
    if (w === 0)
      return "Missing prefix for " + u;
    const E = u.slice(0, w), P = u.slice(w + 1);
    if (P.length < 6)
      return "Data too short";
    let F = vn(E);
    if (typeof F == "string")
      return F;
    const N = [];
    for (let O = 0; O < P.length; ++O) {
      const D = P.charAt(O), k = Zn[D];
      if (k === void 0)
        return "Unknown character " + D;
      F = er(F) ^ k, !(O + 6 >= P.length) && N.push(k);
    }
    return F !== e ? "Invalid checksum for " + u : { prefix: E, words: N };
  }
  function f(u, h) {
    const b = i(u, h);
    if (typeof b == "object")
      return b;
  }
  function n(u, h) {
    const b = i(u, h);
    if (typeof b == "object")
      return b;
    throw new Error(b);
  }
  return {
    decodeUnsafe: f,
    decode: n,
    encode: r,
    toWords: ta,
    fromWordsUnsafe: ra,
    fromWords: ia
  };
}
wr.bech32 = Jn("bech32");
_r = wr.bech32m = Jn("bech32m");
const be = {
  IMPOSSIBLE_CASE: "Impossible case. Please create issue.",
  TWEAK_ADD: "The tweak was out of range or the resulted private key is invalid",
  TWEAK_MUL: "The tweak was out of range or equal to zero",
  CONTEXT_RANDOMIZE_UNKNOW: "Unknow error on context randomization",
  SECKEY_INVALID: "Private Key is invalid",
  PUBKEY_PARSE: "Public Key could not be parsed",
  PUBKEY_SERIALIZE: "Public Key serialization error",
  PUBKEY_COMBINE: "The sum of the public keys is not valid",
  SIG_PARSE: "Signature could not be parsed",
  SIGN: "The nonce generation function failed, or the private key was invalid",
  RECOVER: "Public key could not be recover",
  ECDH: "Scalar was invalid (zero or overflow)"
};
function nt(t, e) {
  if (!t)
    throw new Error(e);
}
function ce(t, e, r) {
  if (nt(e instanceof Uint8Array, `Expected ${t} to be an Uint8Array`), r !== void 0)
    if (Array.isArray(r)) {
      const i = r.join(", "), f = `Expected ${t} to be an Uint8Array with length [${i}]`;
      nt(r.includes(e.length), f);
    } else {
      const i = `Expected ${t} to be an Uint8Array with length ${r}`;
      nt(e.length === r, i);
    }
}
function kt(t) {
  nt(Xt(t) === "Boolean", "Expected compressed to be a Boolean");
}
function dt(t = (r) => new Uint8Array(r), e) {
  return typeof t == "function" && (t = t(e)), ce("output", t, e), t;
}
function Xt(t) {
  return Object.prototype.toString.call(t).slice(8, -1);
}
var na = (t) => ({
  contextRandomize(e) {
    switch (nt(
      e === null || e instanceof Uint8Array,
      "Expected seed to be an Uint8Array or null"
    ), e !== null && ce("seed", e, 32), t.contextRandomize(e)) {
      case 1:
        throw new Error(be.CONTEXT_RANDOMIZE_UNKNOW);
    }
  },
  privateKeyVerify(e) {
    return ce("private key", e, 32), t.privateKeyVerify(e) === 0;
  },
  privateKeyNegate(e) {
    switch (ce("private key", e, 32), t.privateKeyNegate(e)) {
      case 0:
        return e;
      case 1:
        throw new Error(be.IMPOSSIBLE_CASE);
    }
  },
  privateKeyTweakAdd(e, r) {
    switch (ce("private key", e, 32), ce("tweak", r, 32), t.privateKeyTweakAdd(e, r)) {
      case 0:
        return e;
      case 1:
        throw new Error(be.TWEAK_ADD);
    }
  },
  privateKeyTweakMul(e, r) {
    switch (ce("private key", e, 32), ce("tweak", r, 32), t.privateKeyTweakMul(e, r)) {
      case 0:
        return e;
      case 1:
        throw new Error(be.TWEAK_MUL);
    }
  },
  publicKeyVerify(e) {
    return ce("public key", e, [33, 65]), t.publicKeyVerify(e) === 0;
  },
  publicKeyCreate(e, r = !0, i) {
    switch (ce("private key", e, 32), kt(r), i = dt(i, r ? 33 : 65), t.publicKeyCreate(i, e)) {
      case 0:
        return i;
      case 1:
        throw new Error(be.SECKEY_INVALID);
      case 2:
        throw new Error(be.PUBKEY_SERIALIZE);
    }
  },
  publicKeyConvert(e, r = !0, i) {
    switch (ce("public key", e, [33, 65]), kt(r), i = dt(i, r ? 33 : 65), t.publicKeyConvert(i, e)) {
      case 0:
        return i;
      case 1:
        throw new Error(be.PUBKEY_PARSE);
      case 2:
        throw new Error(be.PUBKEY_SERIALIZE);
    }
  },
  publicKeyNegate(e, r = !0, i) {
    switch (ce("public key", e, [33, 65]), kt(r), i = dt(i, r ? 33 : 65), t.publicKeyNegate(i, e)) {
      case 0:
        return i;
      case 1:
        throw new Error(be.PUBKEY_PARSE);
      case 2:
        throw new Error(be.IMPOSSIBLE_CASE);
      case 3:
        throw new Error(be.PUBKEY_SERIALIZE);
    }
  },
  publicKeyCombine(e, r = !0, i) {
    nt(Array.isArray(e), "Expected public keys to be an Array"), nt(e.length > 0, "Expected public keys array will have more than zero items");
    for (const f of e)
      ce("public key", f, [33, 65]);
    switch (kt(r), i = dt(i, r ? 33 : 65), t.publicKeyCombine(i, e)) {
      case 0:
        return i;
      case 1:
        throw new Error(be.PUBKEY_PARSE);
      case 2:
        throw new Error(be.PUBKEY_COMBINE);
      case 3:
        throw new Error(be.PUBKEY_SERIALIZE);
    }
  },
  publicKeyTweakAdd(e, r, i = !0, f) {
    switch (ce("public key", e, [33, 65]), ce("tweak", r, 32), kt(i), f = dt(f, i ? 33 : 65), t.publicKeyTweakAdd(f, e, r)) {
      case 0:
        return f;
      case 1:
        throw new Error(be.PUBKEY_PARSE);
      case 2:
        throw new Error(be.TWEAK_ADD);
    }
  },
  publicKeyTweakMul(e, r, i = !0, f) {
    switch (ce("public key", e, [33, 65]), ce("tweak", r, 32), kt(i), f = dt(f, i ? 33 : 65), t.publicKeyTweakMul(f, e, r)) {
      case 0:
        return f;
      case 1:
        throw new Error(be.PUBKEY_PARSE);
      case 2:
        throw new Error(be.TWEAK_MUL);
    }
  },
  signatureNormalize(e) {
    switch (ce("signature", e, 64), t.signatureNormalize(e)) {
      case 0:
        return e;
      case 1:
        throw new Error(be.SIG_PARSE);
    }
  },
  signatureExport(e, r) {
    ce("signature", e, 64), r = dt(r, 72);
    const i = { output: r, outputlen: 72 };
    switch (t.signatureExport(i, e)) {
      case 0:
        return r.slice(0, i.outputlen);
      case 1:
        throw new Error(be.SIG_PARSE);
      case 2:
        throw new Error(be.IMPOSSIBLE_CASE);
    }
  },
  signatureImport(e, r) {
    switch (ce("signature", e), r = dt(r, 64), t.signatureImport(r, e)) {
      case 0:
        return r;
      case 1:
        throw new Error(be.SIG_PARSE);
      case 2:
        throw new Error(be.IMPOSSIBLE_CASE);
    }
  },
  ecdsaSign(e, r, i = {}, f) {
    ce("message", e, 32), ce("private key", r, 32), nt(Xt(i) === "Object", "Expected options to be an Object"), i.data !== void 0 && ce("options.data", i.data), i.noncefn !== void 0 && nt(Xt(i.noncefn) === "Function", "Expected options.noncefn to be a Function"), f = dt(f, 64);
    const n = { signature: f, recid: null };
    switch (t.ecdsaSign(n, e, r, i.data, i.noncefn)) {
      case 0:
        return n;
      case 1:
        throw new Error(be.SIGN);
      case 2:
        throw new Error(be.IMPOSSIBLE_CASE);
    }
  },
  ecdsaVerify(e, r, i) {
    switch (ce("signature", e, 64), ce("message", r, 32), ce("public key", i, [33, 65]), t.ecdsaVerify(e, r, i)) {
      case 0:
        return !0;
      case 3:
        return !1;
      case 1:
        throw new Error(be.SIG_PARSE);
      case 2:
        throw new Error(be.PUBKEY_PARSE);
    }
  },
  ecdsaRecover(e, r, i, f = !0, n) {
    switch (ce("signature", e, 64), nt(
      Xt(r) === "Number" && r >= 0 && r <= 3,
      "Expected recovery id to be a Number within interval [0, 3]"
    ), ce("message", i, 32), kt(f), n = dt(n, f ? 33 : 65), t.ecdsaRecover(n, e, r, i)) {
      case 0:
        return n;
      case 1:
        throw new Error(be.SIG_PARSE);
      case 2:
        throw new Error(be.RECOVER);
      case 3:
        throw new Error(be.IMPOSSIBLE_CASE);
    }
  },
  ecdh(e, r, i = {}, f) {
    switch (ce("public key", e, [33, 65]), ce("private key", r, 32), nt(Xt(i) === "Object", "Expected options to be an Object"), i.data !== void 0 && ce("options.data", i.data), i.hashfn !== void 0 ? (nt(Xt(i.hashfn) === "Function", "Expected options.hashfn to be a Function"), i.xbuf !== void 0 && ce("options.xbuf", i.xbuf, 32), i.ybuf !== void 0 && ce("options.ybuf", i.ybuf, 32), ce("output", f)) : f = dt(f, 32), t.ecdh(f, e, r, i.data, i.hashfn, i.xbuf, i.ybuf)) {
      case 0:
        return f;
      case 1:
        throw new Error(be.PUBKEY_PARSE);
      case 2:
        throw new Error(be.ECDH);
    }
  }
}), Xn = {};
const fa = "elliptic", aa = "6.5.4", sa = "EC cryptography", oa = "lib/elliptic.js", da = [
  "lib"
], ha = {
  lint: "eslint lib test",
  "lint:fix": "npm run lint -- --fix",
  unit: "istanbul test _mocha --reporter=spec test/index.js",
  test: "npm run lint && npm run unit",
  version: "grunt dist && git add dist/"
}, ca = {
  type: "git",
  url: "git@github.com:indutny/elliptic"
}, ua = [
  "EC",
  "Elliptic",
  "curve",
  "Cryptography"
], la = "Fedor Indutny <fedor@indutny.com>", ba = "MIT", pa = {
  url: "https://github.com/indutny/elliptic/issues"
}, va = "https://github.com/indutny/elliptic", ya = {
  brfs: "^2.0.2",
  coveralls: "^3.1.0",
  eslint: "^7.6.0",
  grunt: "^1.2.1",
  "grunt-browserify": "^5.3.0",
  "grunt-cli": "^1.3.2",
  "grunt-contrib-connect": "^3.0.0",
  "grunt-contrib-copy": "^1.0.0",
  "grunt-contrib-uglify": "^5.0.0",
  "grunt-mocha-istanbul": "^5.0.2",
  "grunt-saucelabs": "^9.0.1",
  istanbul: "^0.4.5",
  mocha: "^8.0.1"
}, ga = {
  "bn.js": "^4.11.9",
  brorand: "^1.1.0",
  "hash.js": "^1.0.0",
  "hmac-drbg": "^1.0.1",
  inherits: "^2.0.4",
  "minimalistic-assert": "^1.0.1",
  "minimalistic-crypto-utils": "^1.0.1"
}, xa = {
  crypto: "react-native-crypto",
  fs: "react-native-level-fs",
  _stream_transform: "readable-stream/transform",
  _stream_readable: "readable-stream/readable",
  _stream_writable: "readable-stream/writable",
  _stream_duplex: "readable-stream/duplex",
  _stream_passthrough: "readable-stream/passthrough",
  stream: "stream-browserify",
  vm: "vm-browserify"
}, ma = {
  name: fa,
  version: aa,
  description: sa,
  main: oa,
  files: da,
  scripts: ha,
  repository: ca,
  keywords: ua,
  author: la,
  license: ba,
  bugs: pa,
  homepage: va,
  devDependencies: ya,
  dependencies: ga,
  "react-native": {
    crypto: "react-native-crypto",
    fs: "react-native-level-fs",
    _stream_transform: "readable-stream/transform",
    _stream_readable: "readable-stream/readable",
    _stream_writable: "readable-stream/writable",
    _stream_duplex: "readable-stream/duplex",
    _stream_passthrough: "readable-stream/passthrough",
    stream: "stream-browserify",
    vm: "vm-browserify"
  },
  browser: xa
};
var rt = {}, Ji = { exports: {} };
const wa = {}, _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wa
}, Symbol.toStringTag, { value: "Module" })), Ht = /* @__PURE__ */ ea(_a);
Ji.exports;
(function(t) {
  (function(e, r) {
    function i(A, a) {
      if (!A)
        throw new Error(a || "Assertion failed");
    }
    function f(A, a) {
      A.super_ = a;
      var c = function() {
      };
      c.prototype = a.prototype, A.prototype = new c(), A.prototype.constructor = A;
    }
    function n(A, a, c) {
      if (n.isBN(A))
        return A;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, A !== null && ((a === "le" || a === "be") && (c = a, a = 10), this._init(A || 0, a || 10, c || "be"));
    }
    typeof e == "object" ? e.exports = n : r.BN = n, n.BN = n, n.wordSize = 26;
    var u;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? u = window.Buffer : u = Ht.Buffer;
    } catch {
    }
    n.isBN = function(a) {
      return a instanceof n ? !0 : a !== null && typeof a == "object" && a.constructor.wordSize === n.wordSize && Array.isArray(a.words);
    }, n.max = function(a, c) {
      return a.cmp(c) > 0 ? a : c;
    }, n.min = function(a, c) {
      return a.cmp(c) < 0 ? a : c;
    }, n.prototype._init = function(a, c, p) {
      if (typeof a == "number")
        return this._initNumber(a, c, p);
      if (typeof a == "object")
        return this._initArray(a, c, p);
      c === "hex" && (c = 16), i(c === (c | 0) && c >= 2 && c <= 36), a = a.toString().replace(/\s+/g, "");
      var v = 0;
      a[0] === "-" && (v++, this.negative = 1), v < a.length && (c === 16 ? this._parseHex(a, v, p) : (this._parseBase(a, c, v), p === "le" && this._initArray(this.toArray(), c, p)));
    }, n.prototype._initNumber = function(a, c, p) {
      a < 0 && (this.negative = 1, a = -a), a < 67108864 ? (this.words = [a & 67108863], this.length = 1) : a < 4503599627370496 ? (this.words = [
        a & 67108863,
        a / 67108864 & 67108863
      ], this.length = 2) : (i(a < 9007199254740992), this.words = [
        a & 67108863,
        a / 67108864 & 67108863,
        1
      ], this.length = 3), p === "le" && this._initArray(this.toArray(), c, p);
    }, n.prototype._initArray = function(a, c, p) {
      if (i(typeof a.length == "number"), a.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(a.length / 3), this.words = new Array(this.length);
      for (var v = 0; v < this.length; v++)
        this.words[v] = 0;
      var M, B, C = 0;
      if (p === "be")
        for (v = a.length - 1, M = 0; v >= 0; v -= 3)
          B = a[v] | a[v - 1] << 8 | a[v - 2] << 16, this.words[M] |= B << C & 67108863, this.words[M + 1] = B >>> 26 - C & 67108863, C += 24, C >= 26 && (C -= 26, M++);
      else if (p === "le")
        for (v = 0, M = 0; v < a.length; v += 3)
          B = a[v] | a[v + 1] << 8 | a[v + 2] << 16, this.words[M] |= B << C & 67108863, this.words[M + 1] = B >>> 26 - C & 67108863, C += 24, C >= 26 && (C -= 26, M++);
      return this.strip();
    };
    function h(A, a) {
      var c = A.charCodeAt(a);
      return c >= 65 && c <= 70 ? c - 55 : c >= 97 && c <= 102 ? c - 87 : c - 48 & 15;
    }
    function b(A, a, c) {
      var p = h(A, c);
      return c - 1 >= a && (p |= h(A, c - 1) << 4), p;
    }
    n.prototype._parseHex = function(a, c, p) {
      this.length = Math.ceil((a.length - c) / 6), this.words = new Array(this.length);
      for (var v = 0; v < this.length; v++)
        this.words[v] = 0;
      var M = 0, B = 0, C;
      if (p === "be")
        for (v = a.length - 1; v >= c; v -= 2)
          C = b(a, c, v) << M, this.words[B] |= C & 67108863, M >= 18 ? (M -= 18, B += 1, this.words[B] |= C >>> 26) : M += 8;
      else {
        var x = a.length - c;
        for (v = x % 2 === 0 ? c + 1 : c; v < a.length; v += 2)
          C = b(a, c, v) << M, this.words[B] |= C & 67108863, M >= 18 ? (M -= 18, B += 1, this.words[B] |= C >>> 26) : M += 8;
      }
      this.strip();
    };
    function _(A, a, c, p) {
      for (var v = 0, M = Math.min(A.length, c), B = a; B < M; B++) {
        var C = A.charCodeAt(B) - 48;
        v *= p, C >= 49 ? v += C - 49 + 10 : C >= 17 ? v += C - 17 + 10 : v += C;
      }
      return v;
    }
    n.prototype._parseBase = function(a, c, p) {
      this.words = [0], this.length = 1;
      for (var v = 0, M = 1; M <= 67108863; M *= c)
        v++;
      v--, M = M / c | 0;
      for (var B = a.length - p, C = B % v, x = Math.min(B, B - C) + p, o = 0, g = p; g < x; g += v)
        o = _(a, g, g + v, c), this.imuln(M), this.words[0] + o < 67108864 ? this.words[0] += o : this._iaddn(o);
      if (C !== 0) {
        var H = 1;
        for (o = _(a, g, a.length, c), g = 0; g < C; g++)
          H *= c;
        this.imuln(H), this.words[0] + o < 67108864 ? this.words[0] += o : this._iaddn(o);
      }
      this.strip();
    }, n.prototype.copy = function(a) {
      a.words = new Array(this.length);
      for (var c = 0; c < this.length; c++)
        a.words[c] = this.words[c];
      a.length = this.length, a.negative = this.negative, a.red = this.red;
    }, n.prototype.clone = function() {
      var a = new n(null);
      return this.copy(a), a;
    }, n.prototype._expand = function(a) {
      for (; this.length < a; )
        this.words[this.length++] = 0;
      return this;
    }, n.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, n.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, n.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var w = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], E = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], P = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    n.prototype.toString = function(a, c) {
      a = a || 10, c = c | 0 || 1;
      var p;
      if (a === 16 || a === "hex") {
        p = "";
        for (var v = 0, M = 0, B = 0; B < this.length; B++) {
          var C = this.words[B], x = ((C << v | M) & 16777215).toString(16);
          M = C >>> 24 - v & 16777215, M !== 0 || B !== this.length - 1 ? p = w[6 - x.length] + x + p : p = x + p, v += 2, v >= 26 && (v -= 26, B--);
        }
        for (M !== 0 && (p = M.toString(16) + p); p.length % c !== 0; )
          p = "0" + p;
        return this.negative !== 0 && (p = "-" + p), p;
      }
      if (a === (a | 0) && a >= 2 && a <= 36) {
        var o = E[a], g = P[a];
        p = "";
        var H = this.clone();
        for (H.negative = 0; !H.isZero(); ) {
          var Z = H.modn(g).toString(a);
          H = H.idivn(g), H.isZero() ? p = Z + p : p = w[o - Z.length] + Z + p;
        }
        for (this.isZero() && (p = "0" + p); p.length % c !== 0; )
          p = "0" + p;
        return this.negative !== 0 && (p = "-" + p), p;
      }
      i(!1, "Base should be between 2 and 36");
    }, n.prototype.toNumber = function() {
      var a = this.words[0];
      return this.length === 2 ? a += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? a += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && i(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -a : a;
    }, n.prototype.toJSON = function() {
      return this.toString(16);
    }, n.prototype.toBuffer = function(a, c) {
      return i(typeof u < "u"), this.toArrayLike(u, a, c);
    }, n.prototype.toArray = function(a, c) {
      return this.toArrayLike(Array, a, c);
    }, n.prototype.toArrayLike = function(a, c, p) {
      var v = this.byteLength(), M = p || Math.max(1, v);
      i(v <= M, "byte array longer than desired length"), i(M > 0, "Requested array length <= 0"), this.strip();
      var B = c === "le", C = new a(M), x, o, g = this.clone();
      if (B) {
        for (o = 0; !g.isZero(); o++)
          x = g.andln(255), g.iushrn(8), C[o] = x;
        for (; o < M; o++)
          C[o] = 0;
      } else {
        for (o = 0; o < M - v; o++)
          C[o] = 0;
        for (o = 0; !g.isZero(); o++)
          x = g.andln(255), g.iushrn(8), C[M - o - 1] = x;
      }
      return C;
    }, Math.clz32 ? n.prototype._countBits = function(a) {
      return 32 - Math.clz32(a);
    } : n.prototype._countBits = function(a) {
      var c = a, p = 0;
      return c >= 4096 && (p += 13, c >>>= 13), c >= 64 && (p += 7, c >>>= 7), c >= 8 && (p += 4, c >>>= 4), c >= 2 && (p += 2, c >>>= 2), p + c;
    }, n.prototype._zeroBits = function(a) {
      if (a === 0)
        return 26;
      var c = a, p = 0;
      return c & 8191 || (p += 13, c >>>= 13), c & 127 || (p += 7, c >>>= 7), c & 15 || (p += 4, c >>>= 4), c & 3 || (p += 2, c >>>= 2), c & 1 || p++, p;
    }, n.prototype.bitLength = function() {
      var a = this.words[this.length - 1], c = this._countBits(a);
      return (this.length - 1) * 26 + c;
    };
    function F(A) {
      for (var a = new Array(A.bitLength()), c = 0; c < a.length; c++) {
        var p = c / 26 | 0, v = c % 26;
        a[c] = (A.words[p] & 1 << v) >>> v;
      }
      return a;
    }
    n.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var a = 0, c = 0; c < this.length; c++) {
        var p = this._zeroBits(this.words[c]);
        if (a += p, p !== 26)
          break;
      }
      return a;
    }, n.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, n.prototype.toTwos = function(a) {
      return this.negative !== 0 ? this.abs().inotn(a).iaddn(1) : this.clone();
    }, n.prototype.fromTwos = function(a) {
      return this.testn(a - 1) ? this.notn(a).iaddn(1).ineg() : this.clone();
    }, n.prototype.isNeg = function() {
      return this.negative !== 0;
    }, n.prototype.neg = function() {
      return this.clone().ineg();
    }, n.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, n.prototype.iuor = function(a) {
      for (; this.length < a.length; )
        this.words[this.length++] = 0;
      for (var c = 0; c < a.length; c++)
        this.words[c] = this.words[c] | a.words[c];
      return this.strip();
    }, n.prototype.ior = function(a) {
      return i((this.negative | a.negative) === 0), this.iuor(a);
    }, n.prototype.or = function(a) {
      return this.length > a.length ? this.clone().ior(a) : a.clone().ior(this);
    }, n.prototype.uor = function(a) {
      return this.length > a.length ? this.clone().iuor(a) : a.clone().iuor(this);
    }, n.prototype.iuand = function(a) {
      var c;
      this.length > a.length ? c = a : c = this;
      for (var p = 0; p < c.length; p++)
        this.words[p] = this.words[p] & a.words[p];
      return this.length = c.length, this.strip();
    }, n.prototype.iand = function(a) {
      return i((this.negative | a.negative) === 0), this.iuand(a);
    }, n.prototype.and = function(a) {
      return this.length > a.length ? this.clone().iand(a) : a.clone().iand(this);
    }, n.prototype.uand = function(a) {
      return this.length > a.length ? this.clone().iuand(a) : a.clone().iuand(this);
    }, n.prototype.iuxor = function(a) {
      var c, p;
      this.length > a.length ? (c = this, p = a) : (c = a, p = this);
      for (var v = 0; v < p.length; v++)
        this.words[v] = c.words[v] ^ p.words[v];
      if (this !== c)
        for (; v < c.length; v++)
          this.words[v] = c.words[v];
      return this.length = c.length, this.strip();
    }, n.prototype.ixor = function(a) {
      return i((this.negative | a.negative) === 0), this.iuxor(a);
    }, n.prototype.xor = function(a) {
      return this.length > a.length ? this.clone().ixor(a) : a.clone().ixor(this);
    }, n.prototype.uxor = function(a) {
      return this.length > a.length ? this.clone().iuxor(a) : a.clone().iuxor(this);
    }, n.prototype.inotn = function(a) {
      i(typeof a == "number" && a >= 0);
      var c = Math.ceil(a / 26) | 0, p = a % 26;
      this._expand(c), p > 0 && c--;
      for (var v = 0; v < c; v++)
        this.words[v] = ~this.words[v] & 67108863;
      return p > 0 && (this.words[v] = ~this.words[v] & 67108863 >> 26 - p), this.strip();
    }, n.prototype.notn = function(a) {
      return this.clone().inotn(a);
    }, n.prototype.setn = function(a, c) {
      i(typeof a == "number" && a >= 0);
      var p = a / 26 | 0, v = a % 26;
      return this._expand(p + 1), c ? this.words[p] = this.words[p] | 1 << v : this.words[p] = this.words[p] & ~(1 << v), this.strip();
    }, n.prototype.iadd = function(a) {
      var c;
      if (this.negative !== 0 && a.negative === 0)
        return this.negative = 0, c = this.isub(a), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && a.negative !== 0)
        return a.negative = 0, c = this.isub(a), a.negative = 1, c._normSign();
      var p, v;
      this.length > a.length ? (p = this, v = a) : (p = a, v = this);
      for (var M = 0, B = 0; B < v.length; B++)
        c = (p.words[B] | 0) + (v.words[B] | 0) + M, this.words[B] = c & 67108863, M = c >>> 26;
      for (; M !== 0 && B < p.length; B++)
        c = (p.words[B] | 0) + M, this.words[B] = c & 67108863, M = c >>> 26;
      if (this.length = p.length, M !== 0)
        this.words[this.length] = M, this.length++;
      else if (p !== this)
        for (; B < p.length; B++)
          this.words[B] = p.words[B];
      return this;
    }, n.prototype.add = function(a) {
      var c;
      return a.negative !== 0 && this.negative === 0 ? (a.negative = 0, c = this.sub(a), a.negative ^= 1, c) : a.negative === 0 && this.negative !== 0 ? (this.negative = 0, c = a.sub(this), this.negative = 1, c) : this.length > a.length ? this.clone().iadd(a) : a.clone().iadd(this);
    }, n.prototype.isub = function(a) {
      if (a.negative !== 0) {
        a.negative = 0;
        var c = this.iadd(a);
        return a.negative = 1, c._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(a), this.negative = 1, this._normSign();
      var p = this.cmp(a);
      if (p === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var v, M;
      p > 0 ? (v = this, M = a) : (v = a, M = this);
      for (var B = 0, C = 0; C < M.length; C++)
        c = (v.words[C] | 0) - (M.words[C] | 0) + B, B = c >> 26, this.words[C] = c & 67108863;
      for (; B !== 0 && C < v.length; C++)
        c = (v.words[C] | 0) + B, B = c >> 26, this.words[C] = c & 67108863;
      if (B === 0 && C < v.length && v !== this)
        for (; C < v.length; C++)
          this.words[C] = v.words[C];
      return this.length = Math.max(this.length, C), v !== this && (this.negative = 1), this.strip();
    }, n.prototype.sub = function(a) {
      return this.clone().isub(a);
    };
    function N(A, a, c) {
      c.negative = a.negative ^ A.negative;
      var p = A.length + a.length | 0;
      c.length = p, p = p - 1 | 0;
      var v = A.words[0] | 0, M = a.words[0] | 0, B = v * M, C = B & 67108863, x = B / 67108864 | 0;
      c.words[0] = C;
      for (var o = 1; o < p; o++) {
        for (var g = x >>> 26, H = x & 67108863, Z = Math.min(o, a.length - 1), J = Math.max(0, o - A.length + 1); J <= Z; J++) {
          var ie = o - J | 0;
          v = A.words[ie] | 0, M = a.words[J] | 0, B = v * M + H, g += B / 67108864 | 0, H = B & 67108863;
        }
        c.words[o] = H | 0, x = g | 0;
      }
      return x !== 0 ? c.words[o] = x | 0 : c.length--, c.strip();
    }
    var O = function(a, c, p) {
      var v = a.words, M = c.words, B = p.words, C = 0, x, o, g, H = v[0] | 0, Z = H & 8191, J = H >>> 13, ie = v[1] | 0, R = ie & 8191, T = ie >>> 13, q = v[2] | 0, W = q & 8191, X = q >>> 13, S = v[3] | 0, m = S & 8191, U = S >>> 13, G = v[4] | 0, ne = G & 8191, ee = G >>> 13, ue = v[5] | 0, ve = ue & 8191, ye = ue >>> 13, Tt = v[6] | 0, ge = Tt & 8191, he = Tt >>> 13, bt = v[7] | 0, me = bt & 8191, le = bt >>> 13, pt = v[8] | 0, l = pt & 8191, s = pt >>> 13, d = v[9] | 0, y = d & 8191, I = d >>> 13, L = M[0] | 0, $ = L & 8191, te = L >>> 13, _e = M[1] | 0, fe = _e & 8191, ae = _e >>> 13, pe = M[2] | 0, Ae = pe & 8191, Ie = pe >>> 13, dn = M[3] | 0, Be = dn & 8191, Re = dn >>> 13, hn = M[4] | 0, Pe = hn & 8191, Te = hn >>> 13, cn = M[5] | 0, Ce = cn & 8191, Ne = cn >>> 13, un = M[6] | 0, Fe = un & 8191, Le = un >>> 13, ln = M[7] | 0, Oe = ln & 8191, $e = ln >>> 13, bn = M[8] | 0, ke = bn & 8191, Ue = bn >>> 13, pn = M[9] | 0, De = pn & 8191, qe = pn >>> 13;
      p.negative = a.negative ^ c.negative, p.length = 19, x = Math.imul(Z, $), o = Math.imul(Z, te), o = o + Math.imul(J, $) | 0, g = Math.imul(J, te);
      var fi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (fi >>> 26) | 0, fi &= 67108863, x = Math.imul(R, $), o = Math.imul(R, te), o = o + Math.imul(T, $) | 0, g = Math.imul(T, te), x = x + Math.imul(Z, fe) | 0, o = o + Math.imul(Z, ae) | 0, o = o + Math.imul(J, fe) | 0, g = g + Math.imul(J, ae) | 0;
      var ai = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (ai >>> 26) | 0, ai &= 67108863, x = Math.imul(W, $), o = Math.imul(W, te), o = o + Math.imul(X, $) | 0, g = Math.imul(X, te), x = x + Math.imul(R, fe) | 0, o = o + Math.imul(R, ae) | 0, o = o + Math.imul(T, fe) | 0, g = g + Math.imul(T, ae) | 0, x = x + Math.imul(Z, Ae) | 0, o = o + Math.imul(Z, Ie) | 0, o = o + Math.imul(J, Ae) | 0, g = g + Math.imul(J, Ie) | 0;
      var si = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (si >>> 26) | 0, si &= 67108863, x = Math.imul(m, $), o = Math.imul(m, te), o = o + Math.imul(U, $) | 0, g = Math.imul(U, te), x = x + Math.imul(W, fe) | 0, o = o + Math.imul(W, ae) | 0, o = o + Math.imul(X, fe) | 0, g = g + Math.imul(X, ae) | 0, x = x + Math.imul(R, Ae) | 0, o = o + Math.imul(R, Ie) | 0, o = o + Math.imul(T, Ae) | 0, g = g + Math.imul(T, Ie) | 0, x = x + Math.imul(Z, Be) | 0, o = o + Math.imul(Z, Re) | 0, o = o + Math.imul(J, Be) | 0, g = g + Math.imul(J, Re) | 0;
      var oi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (oi >>> 26) | 0, oi &= 67108863, x = Math.imul(ne, $), o = Math.imul(ne, te), o = o + Math.imul(ee, $) | 0, g = Math.imul(ee, te), x = x + Math.imul(m, fe) | 0, o = o + Math.imul(m, ae) | 0, o = o + Math.imul(U, fe) | 0, g = g + Math.imul(U, ae) | 0, x = x + Math.imul(W, Ae) | 0, o = o + Math.imul(W, Ie) | 0, o = o + Math.imul(X, Ae) | 0, g = g + Math.imul(X, Ie) | 0, x = x + Math.imul(R, Be) | 0, o = o + Math.imul(R, Re) | 0, o = o + Math.imul(T, Be) | 0, g = g + Math.imul(T, Re) | 0, x = x + Math.imul(Z, Pe) | 0, o = o + Math.imul(Z, Te) | 0, o = o + Math.imul(J, Pe) | 0, g = g + Math.imul(J, Te) | 0;
      var di = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (di >>> 26) | 0, di &= 67108863, x = Math.imul(ve, $), o = Math.imul(ve, te), o = o + Math.imul(ye, $) | 0, g = Math.imul(ye, te), x = x + Math.imul(ne, fe) | 0, o = o + Math.imul(ne, ae) | 0, o = o + Math.imul(ee, fe) | 0, g = g + Math.imul(ee, ae) | 0, x = x + Math.imul(m, Ae) | 0, o = o + Math.imul(m, Ie) | 0, o = o + Math.imul(U, Ae) | 0, g = g + Math.imul(U, Ie) | 0, x = x + Math.imul(W, Be) | 0, o = o + Math.imul(W, Re) | 0, o = o + Math.imul(X, Be) | 0, g = g + Math.imul(X, Re) | 0, x = x + Math.imul(R, Pe) | 0, o = o + Math.imul(R, Te) | 0, o = o + Math.imul(T, Pe) | 0, g = g + Math.imul(T, Te) | 0, x = x + Math.imul(Z, Ce) | 0, o = o + Math.imul(Z, Ne) | 0, o = o + Math.imul(J, Ce) | 0, g = g + Math.imul(J, Ne) | 0;
      var hi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (hi >>> 26) | 0, hi &= 67108863, x = Math.imul(ge, $), o = Math.imul(ge, te), o = o + Math.imul(he, $) | 0, g = Math.imul(he, te), x = x + Math.imul(ve, fe) | 0, o = o + Math.imul(ve, ae) | 0, o = o + Math.imul(ye, fe) | 0, g = g + Math.imul(ye, ae) | 0, x = x + Math.imul(ne, Ae) | 0, o = o + Math.imul(ne, Ie) | 0, o = o + Math.imul(ee, Ae) | 0, g = g + Math.imul(ee, Ie) | 0, x = x + Math.imul(m, Be) | 0, o = o + Math.imul(m, Re) | 0, o = o + Math.imul(U, Be) | 0, g = g + Math.imul(U, Re) | 0, x = x + Math.imul(W, Pe) | 0, o = o + Math.imul(W, Te) | 0, o = o + Math.imul(X, Pe) | 0, g = g + Math.imul(X, Te) | 0, x = x + Math.imul(R, Ce) | 0, o = o + Math.imul(R, Ne) | 0, o = o + Math.imul(T, Ce) | 0, g = g + Math.imul(T, Ne) | 0, x = x + Math.imul(Z, Fe) | 0, o = o + Math.imul(Z, Le) | 0, o = o + Math.imul(J, Fe) | 0, g = g + Math.imul(J, Le) | 0;
      var ci = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (ci >>> 26) | 0, ci &= 67108863, x = Math.imul(me, $), o = Math.imul(me, te), o = o + Math.imul(le, $) | 0, g = Math.imul(le, te), x = x + Math.imul(ge, fe) | 0, o = o + Math.imul(ge, ae) | 0, o = o + Math.imul(he, fe) | 0, g = g + Math.imul(he, ae) | 0, x = x + Math.imul(ve, Ae) | 0, o = o + Math.imul(ve, Ie) | 0, o = o + Math.imul(ye, Ae) | 0, g = g + Math.imul(ye, Ie) | 0, x = x + Math.imul(ne, Be) | 0, o = o + Math.imul(ne, Re) | 0, o = o + Math.imul(ee, Be) | 0, g = g + Math.imul(ee, Re) | 0, x = x + Math.imul(m, Pe) | 0, o = o + Math.imul(m, Te) | 0, o = o + Math.imul(U, Pe) | 0, g = g + Math.imul(U, Te) | 0, x = x + Math.imul(W, Ce) | 0, o = o + Math.imul(W, Ne) | 0, o = o + Math.imul(X, Ce) | 0, g = g + Math.imul(X, Ne) | 0, x = x + Math.imul(R, Fe) | 0, o = o + Math.imul(R, Le) | 0, o = o + Math.imul(T, Fe) | 0, g = g + Math.imul(T, Le) | 0, x = x + Math.imul(Z, Oe) | 0, o = o + Math.imul(Z, $e) | 0, o = o + Math.imul(J, Oe) | 0, g = g + Math.imul(J, $e) | 0;
      var ui = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (ui >>> 26) | 0, ui &= 67108863, x = Math.imul(l, $), o = Math.imul(l, te), o = o + Math.imul(s, $) | 0, g = Math.imul(s, te), x = x + Math.imul(me, fe) | 0, o = o + Math.imul(me, ae) | 0, o = o + Math.imul(le, fe) | 0, g = g + Math.imul(le, ae) | 0, x = x + Math.imul(ge, Ae) | 0, o = o + Math.imul(ge, Ie) | 0, o = o + Math.imul(he, Ae) | 0, g = g + Math.imul(he, Ie) | 0, x = x + Math.imul(ve, Be) | 0, o = o + Math.imul(ve, Re) | 0, o = o + Math.imul(ye, Be) | 0, g = g + Math.imul(ye, Re) | 0, x = x + Math.imul(ne, Pe) | 0, o = o + Math.imul(ne, Te) | 0, o = o + Math.imul(ee, Pe) | 0, g = g + Math.imul(ee, Te) | 0, x = x + Math.imul(m, Ce) | 0, o = o + Math.imul(m, Ne) | 0, o = o + Math.imul(U, Ce) | 0, g = g + Math.imul(U, Ne) | 0, x = x + Math.imul(W, Fe) | 0, o = o + Math.imul(W, Le) | 0, o = o + Math.imul(X, Fe) | 0, g = g + Math.imul(X, Le) | 0, x = x + Math.imul(R, Oe) | 0, o = o + Math.imul(R, $e) | 0, o = o + Math.imul(T, Oe) | 0, g = g + Math.imul(T, $e) | 0, x = x + Math.imul(Z, ke) | 0, o = o + Math.imul(Z, Ue) | 0, o = o + Math.imul(J, ke) | 0, g = g + Math.imul(J, Ue) | 0;
      var li = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (li >>> 26) | 0, li &= 67108863, x = Math.imul(y, $), o = Math.imul(y, te), o = o + Math.imul(I, $) | 0, g = Math.imul(I, te), x = x + Math.imul(l, fe) | 0, o = o + Math.imul(l, ae) | 0, o = o + Math.imul(s, fe) | 0, g = g + Math.imul(s, ae) | 0, x = x + Math.imul(me, Ae) | 0, o = o + Math.imul(me, Ie) | 0, o = o + Math.imul(le, Ae) | 0, g = g + Math.imul(le, Ie) | 0, x = x + Math.imul(ge, Be) | 0, o = o + Math.imul(ge, Re) | 0, o = o + Math.imul(he, Be) | 0, g = g + Math.imul(he, Re) | 0, x = x + Math.imul(ve, Pe) | 0, o = o + Math.imul(ve, Te) | 0, o = o + Math.imul(ye, Pe) | 0, g = g + Math.imul(ye, Te) | 0, x = x + Math.imul(ne, Ce) | 0, o = o + Math.imul(ne, Ne) | 0, o = o + Math.imul(ee, Ce) | 0, g = g + Math.imul(ee, Ne) | 0, x = x + Math.imul(m, Fe) | 0, o = o + Math.imul(m, Le) | 0, o = o + Math.imul(U, Fe) | 0, g = g + Math.imul(U, Le) | 0, x = x + Math.imul(W, Oe) | 0, o = o + Math.imul(W, $e) | 0, o = o + Math.imul(X, Oe) | 0, g = g + Math.imul(X, $e) | 0, x = x + Math.imul(R, ke) | 0, o = o + Math.imul(R, Ue) | 0, o = o + Math.imul(T, ke) | 0, g = g + Math.imul(T, Ue) | 0, x = x + Math.imul(Z, De) | 0, o = o + Math.imul(Z, qe) | 0, o = o + Math.imul(J, De) | 0, g = g + Math.imul(J, qe) | 0;
      var bi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (bi >>> 26) | 0, bi &= 67108863, x = Math.imul(y, fe), o = Math.imul(y, ae), o = o + Math.imul(I, fe) | 0, g = Math.imul(I, ae), x = x + Math.imul(l, Ae) | 0, o = o + Math.imul(l, Ie) | 0, o = o + Math.imul(s, Ae) | 0, g = g + Math.imul(s, Ie) | 0, x = x + Math.imul(me, Be) | 0, o = o + Math.imul(me, Re) | 0, o = o + Math.imul(le, Be) | 0, g = g + Math.imul(le, Re) | 0, x = x + Math.imul(ge, Pe) | 0, o = o + Math.imul(ge, Te) | 0, o = o + Math.imul(he, Pe) | 0, g = g + Math.imul(he, Te) | 0, x = x + Math.imul(ve, Ce) | 0, o = o + Math.imul(ve, Ne) | 0, o = o + Math.imul(ye, Ce) | 0, g = g + Math.imul(ye, Ne) | 0, x = x + Math.imul(ne, Fe) | 0, o = o + Math.imul(ne, Le) | 0, o = o + Math.imul(ee, Fe) | 0, g = g + Math.imul(ee, Le) | 0, x = x + Math.imul(m, Oe) | 0, o = o + Math.imul(m, $e) | 0, o = o + Math.imul(U, Oe) | 0, g = g + Math.imul(U, $e) | 0, x = x + Math.imul(W, ke) | 0, o = o + Math.imul(W, Ue) | 0, o = o + Math.imul(X, ke) | 0, g = g + Math.imul(X, Ue) | 0, x = x + Math.imul(R, De) | 0, o = o + Math.imul(R, qe) | 0, o = o + Math.imul(T, De) | 0, g = g + Math.imul(T, qe) | 0;
      var pi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (pi >>> 26) | 0, pi &= 67108863, x = Math.imul(y, Ae), o = Math.imul(y, Ie), o = o + Math.imul(I, Ae) | 0, g = Math.imul(I, Ie), x = x + Math.imul(l, Be) | 0, o = o + Math.imul(l, Re) | 0, o = o + Math.imul(s, Be) | 0, g = g + Math.imul(s, Re) | 0, x = x + Math.imul(me, Pe) | 0, o = o + Math.imul(me, Te) | 0, o = o + Math.imul(le, Pe) | 0, g = g + Math.imul(le, Te) | 0, x = x + Math.imul(ge, Ce) | 0, o = o + Math.imul(ge, Ne) | 0, o = o + Math.imul(he, Ce) | 0, g = g + Math.imul(he, Ne) | 0, x = x + Math.imul(ve, Fe) | 0, o = o + Math.imul(ve, Le) | 0, o = o + Math.imul(ye, Fe) | 0, g = g + Math.imul(ye, Le) | 0, x = x + Math.imul(ne, Oe) | 0, o = o + Math.imul(ne, $e) | 0, o = o + Math.imul(ee, Oe) | 0, g = g + Math.imul(ee, $e) | 0, x = x + Math.imul(m, ke) | 0, o = o + Math.imul(m, Ue) | 0, o = o + Math.imul(U, ke) | 0, g = g + Math.imul(U, Ue) | 0, x = x + Math.imul(W, De) | 0, o = o + Math.imul(W, qe) | 0, o = o + Math.imul(X, De) | 0, g = g + Math.imul(X, qe) | 0;
      var vi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (vi >>> 26) | 0, vi &= 67108863, x = Math.imul(y, Be), o = Math.imul(y, Re), o = o + Math.imul(I, Be) | 0, g = Math.imul(I, Re), x = x + Math.imul(l, Pe) | 0, o = o + Math.imul(l, Te) | 0, o = o + Math.imul(s, Pe) | 0, g = g + Math.imul(s, Te) | 0, x = x + Math.imul(me, Ce) | 0, o = o + Math.imul(me, Ne) | 0, o = o + Math.imul(le, Ce) | 0, g = g + Math.imul(le, Ne) | 0, x = x + Math.imul(ge, Fe) | 0, o = o + Math.imul(ge, Le) | 0, o = o + Math.imul(he, Fe) | 0, g = g + Math.imul(he, Le) | 0, x = x + Math.imul(ve, Oe) | 0, o = o + Math.imul(ve, $e) | 0, o = o + Math.imul(ye, Oe) | 0, g = g + Math.imul(ye, $e) | 0, x = x + Math.imul(ne, ke) | 0, o = o + Math.imul(ne, Ue) | 0, o = o + Math.imul(ee, ke) | 0, g = g + Math.imul(ee, Ue) | 0, x = x + Math.imul(m, De) | 0, o = o + Math.imul(m, qe) | 0, o = o + Math.imul(U, De) | 0, g = g + Math.imul(U, qe) | 0;
      var yi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (yi >>> 26) | 0, yi &= 67108863, x = Math.imul(y, Pe), o = Math.imul(y, Te), o = o + Math.imul(I, Pe) | 0, g = Math.imul(I, Te), x = x + Math.imul(l, Ce) | 0, o = o + Math.imul(l, Ne) | 0, o = o + Math.imul(s, Ce) | 0, g = g + Math.imul(s, Ne) | 0, x = x + Math.imul(me, Fe) | 0, o = o + Math.imul(me, Le) | 0, o = o + Math.imul(le, Fe) | 0, g = g + Math.imul(le, Le) | 0, x = x + Math.imul(ge, Oe) | 0, o = o + Math.imul(ge, $e) | 0, o = o + Math.imul(he, Oe) | 0, g = g + Math.imul(he, $e) | 0, x = x + Math.imul(ve, ke) | 0, o = o + Math.imul(ve, Ue) | 0, o = o + Math.imul(ye, ke) | 0, g = g + Math.imul(ye, Ue) | 0, x = x + Math.imul(ne, De) | 0, o = o + Math.imul(ne, qe) | 0, o = o + Math.imul(ee, De) | 0, g = g + Math.imul(ee, qe) | 0;
      var gi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (gi >>> 26) | 0, gi &= 67108863, x = Math.imul(y, Ce), o = Math.imul(y, Ne), o = o + Math.imul(I, Ce) | 0, g = Math.imul(I, Ne), x = x + Math.imul(l, Fe) | 0, o = o + Math.imul(l, Le) | 0, o = o + Math.imul(s, Fe) | 0, g = g + Math.imul(s, Le) | 0, x = x + Math.imul(me, Oe) | 0, o = o + Math.imul(me, $e) | 0, o = o + Math.imul(le, Oe) | 0, g = g + Math.imul(le, $e) | 0, x = x + Math.imul(ge, ke) | 0, o = o + Math.imul(ge, Ue) | 0, o = o + Math.imul(he, ke) | 0, g = g + Math.imul(he, Ue) | 0, x = x + Math.imul(ve, De) | 0, o = o + Math.imul(ve, qe) | 0, o = o + Math.imul(ye, De) | 0, g = g + Math.imul(ye, qe) | 0;
      var xi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (xi >>> 26) | 0, xi &= 67108863, x = Math.imul(y, Fe), o = Math.imul(y, Le), o = o + Math.imul(I, Fe) | 0, g = Math.imul(I, Le), x = x + Math.imul(l, Oe) | 0, o = o + Math.imul(l, $e) | 0, o = o + Math.imul(s, Oe) | 0, g = g + Math.imul(s, $e) | 0, x = x + Math.imul(me, ke) | 0, o = o + Math.imul(me, Ue) | 0, o = o + Math.imul(le, ke) | 0, g = g + Math.imul(le, Ue) | 0, x = x + Math.imul(ge, De) | 0, o = o + Math.imul(ge, qe) | 0, o = o + Math.imul(he, De) | 0, g = g + Math.imul(he, qe) | 0;
      var mi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (mi >>> 26) | 0, mi &= 67108863, x = Math.imul(y, Oe), o = Math.imul(y, $e), o = o + Math.imul(I, Oe) | 0, g = Math.imul(I, $e), x = x + Math.imul(l, ke) | 0, o = o + Math.imul(l, Ue) | 0, o = o + Math.imul(s, ke) | 0, g = g + Math.imul(s, Ue) | 0, x = x + Math.imul(me, De) | 0, o = o + Math.imul(me, qe) | 0, o = o + Math.imul(le, De) | 0, g = g + Math.imul(le, qe) | 0;
      var wi = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (wi >>> 26) | 0, wi &= 67108863, x = Math.imul(y, ke), o = Math.imul(y, Ue), o = o + Math.imul(I, ke) | 0, g = Math.imul(I, Ue), x = x + Math.imul(l, De) | 0, o = o + Math.imul(l, qe) | 0, o = o + Math.imul(s, De) | 0, g = g + Math.imul(s, qe) | 0;
      var _i = (C + x | 0) + ((o & 8191) << 13) | 0;
      C = (g + (o >>> 13) | 0) + (_i >>> 26) | 0, _i &= 67108863, x = Math.imul(y, De), o = Math.imul(y, qe), o = o + Math.imul(I, De) | 0, g = Math.imul(I, qe);
      var Mi = (C + x | 0) + ((o & 8191) << 13) | 0;
      return C = (g + (o >>> 13) | 0) + (Mi >>> 26) | 0, Mi &= 67108863, B[0] = fi, B[1] = ai, B[2] = si, B[3] = oi, B[4] = di, B[5] = hi, B[6] = ci, B[7] = ui, B[8] = li, B[9] = bi, B[10] = pi, B[11] = vi, B[12] = yi, B[13] = gi, B[14] = xi, B[15] = mi, B[16] = wi, B[17] = _i, B[18] = Mi, C !== 0 && (B[19] = C, p.length++), p;
    };
    Math.imul || (O = N);
    function D(A, a, c) {
      c.negative = a.negative ^ A.negative, c.length = A.length + a.length;
      for (var p = 0, v = 0, M = 0; M < c.length - 1; M++) {
        var B = v;
        v = 0;
        for (var C = p & 67108863, x = Math.min(M, a.length - 1), o = Math.max(0, M - A.length + 1); o <= x; o++) {
          var g = M - o, H = A.words[g] | 0, Z = a.words[o] | 0, J = H * Z, ie = J & 67108863;
          B = B + (J / 67108864 | 0) | 0, ie = ie + C | 0, C = ie & 67108863, B = B + (ie >>> 26) | 0, v += B >>> 26, B &= 67108863;
        }
        c.words[M] = C, p = B, B = v;
      }
      return p !== 0 ? c.words[M] = p : c.length--, c.strip();
    }
    function k(A, a, c) {
      var p = new z();
      return p.mulp(A, a, c);
    }
    n.prototype.mulTo = function(a, c) {
      var p, v = this.length + a.length;
      return this.length === 10 && a.length === 10 ? p = O(this, a, c) : v < 63 ? p = N(this, a, c) : v < 1024 ? p = D(this, a, c) : p = k(this, a, c), p;
    };
    function z(A, a) {
      this.x = A, this.y = a;
    }
    z.prototype.makeRBT = function(a) {
      for (var c = new Array(a), p = n.prototype._countBits(a) - 1, v = 0; v < a; v++)
        c[v] = this.revBin(v, p, a);
      return c;
    }, z.prototype.revBin = function(a, c, p) {
      if (a === 0 || a === p - 1)
        return a;
      for (var v = 0, M = 0; M < c; M++)
        v |= (a & 1) << c - M - 1, a >>= 1;
      return v;
    }, z.prototype.permute = function(a, c, p, v, M, B) {
      for (var C = 0; C < B; C++)
        v[C] = c[a[C]], M[C] = p[a[C]];
    }, z.prototype.transform = function(a, c, p, v, M, B) {
      this.permute(B, a, c, p, v, M);
      for (var C = 1; C < M; C <<= 1)
        for (var x = C << 1, o = Math.cos(2 * Math.PI / x), g = Math.sin(2 * Math.PI / x), H = 0; H < M; H += x)
          for (var Z = o, J = g, ie = 0; ie < C; ie++) {
            var R = p[H + ie], T = v[H + ie], q = p[H + ie + C], W = v[H + ie + C], X = Z * q - J * W;
            W = Z * W + J * q, q = X, p[H + ie] = R + q, v[H + ie] = T + W, p[H + ie + C] = R - q, v[H + ie + C] = T - W, ie !== x && (X = o * Z - g * J, J = o * J + g * Z, Z = X);
          }
    }, z.prototype.guessLen13b = function(a, c) {
      var p = Math.max(c, a) | 1, v = p & 1, M = 0;
      for (p = p / 2 | 0; p; p = p >>> 1)
        M++;
      return 1 << M + 1 + v;
    }, z.prototype.conjugate = function(a, c, p) {
      if (!(p <= 1))
        for (var v = 0; v < p / 2; v++) {
          var M = a[v];
          a[v] = a[p - v - 1], a[p - v - 1] = M, M = c[v], c[v] = -c[p - v - 1], c[p - v - 1] = -M;
        }
    }, z.prototype.normalize13b = function(a, c) {
      for (var p = 0, v = 0; v < c / 2; v++) {
        var M = Math.round(a[2 * v + 1] / c) * 8192 + Math.round(a[2 * v] / c) + p;
        a[v] = M & 67108863, M < 67108864 ? p = 0 : p = M / 67108864 | 0;
      }
      return a;
    }, z.prototype.convert13b = function(a, c, p, v) {
      for (var M = 0, B = 0; B < c; B++)
        M = M + (a[B] | 0), p[2 * B] = M & 8191, M = M >>> 13, p[2 * B + 1] = M & 8191, M = M >>> 13;
      for (B = 2 * c; B < v; ++B)
        p[B] = 0;
      i(M === 0), i((M & -8192) === 0);
    }, z.prototype.stub = function(a) {
      for (var c = new Array(a), p = 0; p < a; p++)
        c[p] = 0;
      return c;
    }, z.prototype.mulp = function(a, c, p) {
      var v = 2 * this.guessLen13b(a.length, c.length), M = this.makeRBT(v), B = this.stub(v), C = new Array(v), x = new Array(v), o = new Array(v), g = new Array(v), H = new Array(v), Z = new Array(v), J = p.words;
      J.length = v, this.convert13b(a.words, a.length, C, v), this.convert13b(c.words, c.length, g, v), this.transform(C, B, x, o, v, M), this.transform(g, B, H, Z, v, M);
      for (var ie = 0; ie < v; ie++) {
        var R = x[ie] * H[ie] - o[ie] * Z[ie];
        o[ie] = x[ie] * Z[ie] + o[ie] * H[ie], x[ie] = R;
      }
      return this.conjugate(x, o, v), this.transform(x, o, J, B, v, M), this.conjugate(J, B, v), this.normalize13b(J, v), p.negative = a.negative ^ c.negative, p.length = a.length + c.length, p.strip();
    }, n.prototype.mul = function(a) {
      var c = new n(null);
      return c.words = new Array(this.length + a.length), this.mulTo(a, c);
    }, n.prototype.mulf = function(a) {
      var c = new n(null);
      return c.words = new Array(this.length + a.length), k(this, a, c);
    }, n.prototype.imul = function(a) {
      return this.clone().mulTo(a, this);
    }, n.prototype.imuln = function(a) {
      i(typeof a == "number"), i(a < 67108864);
      for (var c = 0, p = 0; p < this.length; p++) {
        var v = (this.words[p] | 0) * a, M = (v & 67108863) + (c & 67108863);
        c >>= 26, c += v / 67108864 | 0, c += M >>> 26, this.words[p] = M & 67108863;
      }
      return c !== 0 && (this.words[p] = c, this.length++), this;
    }, n.prototype.muln = function(a) {
      return this.clone().imuln(a);
    }, n.prototype.sqr = function() {
      return this.mul(this);
    }, n.prototype.isqr = function() {
      return this.imul(this.clone());
    }, n.prototype.pow = function(a) {
      var c = F(a);
      if (c.length === 0)
        return new n(1);
      for (var p = this, v = 0; v < c.length && c[v] === 0; v++, p = p.sqr())
        ;
      if (++v < c.length)
        for (var M = p.sqr(); v < c.length; v++, M = M.sqr())
          c[v] !== 0 && (p = p.mul(M));
      return p;
    }, n.prototype.iushln = function(a) {
      i(typeof a == "number" && a >= 0);
      var c = a % 26, p = (a - c) / 26, v = 67108863 >>> 26 - c << 26 - c, M;
      if (c !== 0) {
        var B = 0;
        for (M = 0; M < this.length; M++) {
          var C = this.words[M] & v, x = (this.words[M] | 0) - C << c;
          this.words[M] = x | B, B = C >>> 26 - c;
        }
        B && (this.words[M] = B, this.length++);
      }
      if (p !== 0) {
        for (M = this.length - 1; M >= 0; M--)
          this.words[M + p] = this.words[M];
        for (M = 0; M < p; M++)
          this.words[M] = 0;
        this.length += p;
      }
      return this.strip();
    }, n.prototype.ishln = function(a) {
      return i(this.negative === 0), this.iushln(a);
    }, n.prototype.iushrn = function(a, c, p) {
      i(typeof a == "number" && a >= 0);
      var v;
      c ? v = (c - c % 26) / 26 : v = 0;
      var M = a % 26, B = Math.min((a - M) / 26, this.length), C = 67108863 ^ 67108863 >>> M << M, x = p;
      if (v -= B, v = Math.max(0, v), x) {
        for (var o = 0; o < B; o++)
          x.words[o] = this.words[o];
        x.length = B;
      }
      if (B !== 0)
        if (this.length > B)
          for (this.length -= B, o = 0; o < this.length; o++)
            this.words[o] = this.words[o + B];
        else
          this.words[0] = 0, this.length = 1;
      var g = 0;
      for (o = this.length - 1; o >= 0 && (g !== 0 || o >= v); o--) {
        var H = this.words[o] | 0;
        this.words[o] = g << 26 - M | H >>> M, g = H & C;
      }
      return x && g !== 0 && (x.words[x.length++] = g), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, n.prototype.ishrn = function(a, c, p) {
      return i(this.negative === 0), this.iushrn(a, c, p);
    }, n.prototype.shln = function(a) {
      return this.clone().ishln(a);
    }, n.prototype.ushln = function(a) {
      return this.clone().iushln(a);
    }, n.prototype.shrn = function(a) {
      return this.clone().ishrn(a);
    }, n.prototype.ushrn = function(a) {
      return this.clone().iushrn(a);
    }, n.prototype.testn = function(a) {
      i(typeof a == "number" && a >= 0);
      var c = a % 26, p = (a - c) / 26, v = 1 << c;
      if (this.length <= p)
        return !1;
      var M = this.words[p];
      return !!(M & v);
    }, n.prototype.imaskn = function(a) {
      i(typeof a == "number" && a >= 0);
      var c = a % 26, p = (a - c) / 26;
      if (i(this.negative === 0, "imaskn works only with positive numbers"), this.length <= p)
        return this;
      if (c !== 0 && p++, this.length = Math.min(p, this.length), c !== 0) {
        var v = 67108863 ^ 67108863 >>> c << c;
        this.words[this.length - 1] &= v;
      }
      return this.strip();
    }, n.prototype.maskn = function(a) {
      return this.clone().imaskn(a);
    }, n.prototype.iaddn = function(a) {
      return i(typeof a == "number"), i(a < 67108864), a < 0 ? this.isubn(-a) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < a ? (this.words[0] = a - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(a), this.negative = 1, this) : this._iaddn(a);
    }, n.prototype._iaddn = function(a) {
      this.words[0] += a;
      for (var c = 0; c < this.length && this.words[c] >= 67108864; c++)
        this.words[c] -= 67108864, c === this.length - 1 ? this.words[c + 1] = 1 : this.words[c + 1]++;
      return this.length = Math.max(this.length, c + 1), this;
    }, n.prototype.isubn = function(a) {
      if (i(typeof a == "number"), i(a < 67108864), a < 0)
        return this.iaddn(-a);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(a), this.negative = 1, this;
      if (this.words[0] -= a, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var c = 0; c < this.length && this.words[c] < 0; c++)
          this.words[c] += 67108864, this.words[c + 1] -= 1;
      return this.strip();
    }, n.prototype.addn = function(a) {
      return this.clone().iaddn(a);
    }, n.prototype.subn = function(a) {
      return this.clone().isubn(a);
    }, n.prototype.iabs = function() {
      return this.negative = 0, this;
    }, n.prototype.abs = function() {
      return this.clone().iabs();
    }, n.prototype._ishlnsubmul = function(a, c, p) {
      var v = a.length + p, M;
      this._expand(v);
      var B, C = 0;
      for (M = 0; M < a.length; M++) {
        B = (this.words[M + p] | 0) + C;
        var x = (a.words[M] | 0) * c;
        B -= x & 67108863, C = (B >> 26) - (x / 67108864 | 0), this.words[M + p] = B & 67108863;
      }
      for (; M < this.length - p; M++)
        B = (this.words[M + p] | 0) + C, C = B >> 26, this.words[M + p] = B & 67108863;
      if (C === 0)
        return this.strip();
      for (i(C === -1), C = 0, M = 0; M < this.length; M++)
        B = -(this.words[M] | 0) + C, C = B >> 26, this.words[M] = B & 67108863;
      return this.negative = 1, this.strip();
    }, n.prototype._wordDiv = function(a, c) {
      var p = this.length - a.length, v = this.clone(), M = a, B = M.words[M.length - 1] | 0, C = this._countBits(B);
      p = 26 - C, p !== 0 && (M = M.ushln(p), v.iushln(p), B = M.words[M.length - 1] | 0);
      var x = v.length - M.length, o;
      if (c !== "mod") {
        o = new n(null), o.length = x + 1, o.words = new Array(o.length);
        for (var g = 0; g < o.length; g++)
          o.words[g] = 0;
      }
      var H = v.clone()._ishlnsubmul(M, 1, x);
      H.negative === 0 && (v = H, o && (o.words[x] = 1));
      for (var Z = x - 1; Z >= 0; Z--) {
        var J = (v.words[M.length + Z] | 0) * 67108864 + (v.words[M.length + Z - 1] | 0);
        for (J = Math.min(J / B | 0, 67108863), v._ishlnsubmul(M, J, Z); v.negative !== 0; )
          J--, v.negative = 0, v._ishlnsubmul(M, 1, Z), v.isZero() || (v.negative ^= 1);
        o && (o.words[Z] = J);
      }
      return o && o.strip(), v.strip(), c !== "div" && p !== 0 && v.iushrn(p), {
        div: o || null,
        mod: v
      };
    }, n.prototype.divmod = function(a, c, p) {
      if (i(!a.isZero()), this.isZero())
        return {
          div: new n(0),
          mod: new n(0)
        };
      var v, M, B;
      return this.negative !== 0 && a.negative === 0 ? (B = this.neg().divmod(a, c), c !== "mod" && (v = B.div.neg()), c !== "div" && (M = B.mod.neg(), p && M.negative !== 0 && M.iadd(a)), {
        div: v,
        mod: M
      }) : this.negative === 0 && a.negative !== 0 ? (B = this.divmod(a.neg(), c), c !== "mod" && (v = B.div.neg()), {
        div: v,
        mod: B.mod
      }) : this.negative & a.negative ? (B = this.neg().divmod(a.neg(), c), c !== "div" && (M = B.mod.neg(), p && M.negative !== 0 && M.isub(a)), {
        div: B.div,
        mod: M
      }) : a.length > this.length || this.cmp(a) < 0 ? {
        div: new n(0),
        mod: this
      } : a.length === 1 ? c === "div" ? {
        div: this.divn(a.words[0]),
        mod: null
      } : c === "mod" ? {
        div: null,
        mod: new n(this.modn(a.words[0]))
      } : {
        div: this.divn(a.words[0]),
        mod: new n(this.modn(a.words[0]))
      } : this._wordDiv(a, c);
    }, n.prototype.div = function(a) {
      return this.divmod(a, "div", !1).div;
    }, n.prototype.mod = function(a) {
      return this.divmod(a, "mod", !1).mod;
    }, n.prototype.umod = function(a) {
      return this.divmod(a, "mod", !0).mod;
    }, n.prototype.divRound = function(a) {
      var c = this.divmod(a);
      if (c.mod.isZero())
        return c.div;
      var p = c.div.negative !== 0 ? c.mod.isub(a) : c.mod, v = a.ushrn(1), M = a.andln(1), B = p.cmp(v);
      return B < 0 || M === 1 && B === 0 ? c.div : c.div.negative !== 0 ? c.div.isubn(1) : c.div.iaddn(1);
    }, n.prototype.modn = function(a) {
      i(a <= 67108863);
      for (var c = (1 << 26) % a, p = 0, v = this.length - 1; v >= 0; v--)
        p = (c * p + (this.words[v] | 0)) % a;
      return p;
    }, n.prototype.idivn = function(a) {
      i(a <= 67108863);
      for (var c = 0, p = this.length - 1; p >= 0; p--) {
        var v = (this.words[p] | 0) + c * 67108864;
        this.words[p] = v / a | 0, c = v % a;
      }
      return this.strip();
    }, n.prototype.divn = function(a) {
      return this.clone().idivn(a);
    }, n.prototype.egcd = function(a) {
      i(a.negative === 0), i(!a.isZero());
      var c = this, p = a.clone();
      c.negative !== 0 ? c = c.umod(a) : c = c.clone();
      for (var v = new n(1), M = new n(0), B = new n(0), C = new n(1), x = 0; c.isEven() && p.isEven(); )
        c.iushrn(1), p.iushrn(1), ++x;
      for (var o = p.clone(), g = c.clone(); !c.isZero(); ) {
        for (var H = 0, Z = 1; !(c.words[0] & Z) && H < 26; ++H, Z <<= 1)
          ;
        if (H > 0)
          for (c.iushrn(H); H-- > 0; )
            (v.isOdd() || M.isOdd()) && (v.iadd(o), M.isub(g)), v.iushrn(1), M.iushrn(1);
        for (var J = 0, ie = 1; !(p.words[0] & ie) && J < 26; ++J, ie <<= 1)
          ;
        if (J > 0)
          for (p.iushrn(J); J-- > 0; )
            (B.isOdd() || C.isOdd()) && (B.iadd(o), C.isub(g)), B.iushrn(1), C.iushrn(1);
        c.cmp(p) >= 0 ? (c.isub(p), v.isub(B), M.isub(C)) : (p.isub(c), B.isub(v), C.isub(M));
      }
      return {
        a: B,
        b: C,
        gcd: p.iushln(x)
      };
    }, n.prototype._invmp = function(a) {
      i(a.negative === 0), i(!a.isZero());
      var c = this, p = a.clone();
      c.negative !== 0 ? c = c.umod(a) : c = c.clone();
      for (var v = new n(1), M = new n(0), B = p.clone(); c.cmpn(1) > 0 && p.cmpn(1) > 0; ) {
        for (var C = 0, x = 1; !(c.words[0] & x) && C < 26; ++C, x <<= 1)
          ;
        if (C > 0)
          for (c.iushrn(C); C-- > 0; )
            v.isOdd() && v.iadd(B), v.iushrn(1);
        for (var o = 0, g = 1; !(p.words[0] & g) && o < 26; ++o, g <<= 1)
          ;
        if (o > 0)
          for (p.iushrn(o); o-- > 0; )
            M.isOdd() && M.iadd(B), M.iushrn(1);
        c.cmp(p) >= 0 ? (c.isub(p), v.isub(M)) : (p.isub(c), M.isub(v));
      }
      var H;
      return c.cmpn(1) === 0 ? H = v : H = M, H.cmpn(0) < 0 && H.iadd(a), H;
    }, n.prototype.gcd = function(a) {
      if (this.isZero())
        return a.abs();
      if (a.isZero())
        return this.abs();
      var c = this.clone(), p = a.clone();
      c.negative = 0, p.negative = 0;
      for (var v = 0; c.isEven() && p.isEven(); v++)
        c.iushrn(1), p.iushrn(1);
      do {
        for (; c.isEven(); )
          c.iushrn(1);
        for (; p.isEven(); )
          p.iushrn(1);
        var M = c.cmp(p);
        if (M < 0) {
          var B = c;
          c = p, p = B;
        } else if (M === 0 || p.cmpn(1) === 0)
          break;
        c.isub(p);
      } while (!0);
      return p.iushln(v);
    }, n.prototype.invm = function(a) {
      return this.egcd(a).a.umod(a);
    }, n.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, n.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, n.prototype.andln = function(a) {
      return this.words[0] & a;
    }, n.prototype.bincn = function(a) {
      i(typeof a == "number");
      var c = a % 26, p = (a - c) / 26, v = 1 << c;
      if (this.length <= p)
        return this._expand(p + 1), this.words[p] |= v, this;
      for (var M = v, B = p; M !== 0 && B < this.length; B++) {
        var C = this.words[B] | 0;
        C += M, M = C >>> 26, C &= 67108863, this.words[B] = C;
      }
      return M !== 0 && (this.words[B] = M, this.length++), this;
    }, n.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, n.prototype.cmpn = function(a) {
      var c = a < 0;
      if (this.negative !== 0 && !c)
        return -1;
      if (this.negative === 0 && c)
        return 1;
      this.strip();
      var p;
      if (this.length > 1)
        p = 1;
      else {
        c && (a = -a), i(a <= 67108863, "Number is too big");
        var v = this.words[0] | 0;
        p = v === a ? 0 : v < a ? -1 : 1;
      }
      return this.negative !== 0 ? -p | 0 : p;
    }, n.prototype.cmp = function(a) {
      if (this.negative !== 0 && a.negative === 0)
        return -1;
      if (this.negative === 0 && a.negative !== 0)
        return 1;
      var c = this.ucmp(a);
      return this.negative !== 0 ? -c | 0 : c;
    }, n.prototype.ucmp = function(a) {
      if (this.length > a.length)
        return 1;
      if (this.length < a.length)
        return -1;
      for (var c = 0, p = this.length - 1; p >= 0; p--) {
        var v = this.words[p] | 0, M = a.words[p] | 0;
        if (v !== M) {
          v < M ? c = -1 : v > M && (c = 1);
          break;
        }
      }
      return c;
    }, n.prototype.gtn = function(a) {
      return this.cmpn(a) === 1;
    }, n.prototype.gt = function(a) {
      return this.cmp(a) === 1;
    }, n.prototype.gten = function(a) {
      return this.cmpn(a) >= 0;
    }, n.prototype.gte = function(a) {
      return this.cmp(a) >= 0;
    }, n.prototype.ltn = function(a) {
      return this.cmpn(a) === -1;
    }, n.prototype.lt = function(a) {
      return this.cmp(a) === -1;
    }, n.prototype.lten = function(a) {
      return this.cmpn(a) <= 0;
    }, n.prototype.lte = function(a) {
      return this.cmp(a) <= 0;
    }, n.prototype.eqn = function(a) {
      return this.cmpn(a) === 0;
    }, n.prototype.eq = function(a) {
      return this.cmp(a) === 0;
    }, n.red = function(a) {
      return new V(a);
    }, n.prototype.toRed = function(a) {
      return i(!this.red, "Already a number in reduction context"), i(this.negative === 0, "red works only with positives"), a.convertTo(this)._forceRed(a);
    }, n.prototype.fromRed = function() {
      return i(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, n.prototype._forceRed = function(a) {
      return this.red = a, this;
    }, n.prototype.forceRed = function(a) {
      return i(!this.red, "Already a number in reduction context"), this._forceRed(a);
    }, n.prototype.redAdd = function(a) {
      return i(this.red, "redAdd works only with red numbers"), this.red.add(this, a);
    }, n.prototype.redIAdd = function(a) {
      return i(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, a);
    }, n.prototype.redSub = function(a) {
      return i(this.red, "redSub works only with red numbers"), this.red.sub(this, a);
    }, n.prototype.redISub = function(a) {
      return i(this.red, "redISub works only with red numbers"), this.red.isub(this, a);
    }, n.prototype.redShl = function(a) {
      return i(this.red, "redShl works only with red numbers"), this.red.shl(this, a);
    }, n.prototype.redMul = function(a) {
      return i(this.red, "redMul works only with red numbers"), this.red._verify2(this, a), this.red.mul(this, a);
    }, n.prototype.redIMul = function(a) {
      return i(this.red, "redMul works only with red numbers"), this.red._verify2(this, a), this.red.imul(this, a);
    }, n.prototype.redSqr = function() {
      return i(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, n.prototype.redISqr = function() {
      return i(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, n.prototype.redSqrt = function() {
      return i(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, n.prototype.redInvm = function() {
      return i(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, n.prototype.redNeg = function() {
      return i(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, n.prototype.redPow = function(a) {
      return i(this.red && !a.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, a);
    };
    var j = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function K(A, a) {
      this.name = A, this.p = new n(a, 16), this.n = this.p.bitLength(), this.k = new n(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    K.prototype._tmp = function() {
      var a = new n(null);
      return a.words = new Array(Math.ceil(this.n / 13)), a;
    }, K.prototype.ireduce = function(a) {
      var c = a, p;
      do
        this.split(c, this.tmp), c = this.imulK(c), c = c.iadd(this.tmp), p = c.bitLength();
      while (p > this.n);
      var v = p < this.n ? -1 : c.ucmp(this.p);
      return v === 0 ? (c.words[0] = 0, c.length = 1) : v > 0 ? c.isub(this.p) : c.strip !== void 0 ? c.strip() : c._strip(), c;
    }, K.prototype.split = function(a, c) {
      a.iushrn(this.n, 0, c);
    }, K.prototype.imulK = function(a) {
      return a.imul(this.k);
    };
    function Y() {
      K.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    f(Y, K), Y.prototype.split = function(a, c) {
      for (var p = 4194303, v = Math.min(a.length, 9), M = 0; M < v; M++)
        c.words[M] = a.words[M];
      if (c.length = v, a.length <= 9) {
        a.words[0] = 0, a.length = 1;
        return;
      }
      var B = a.words[9];
      for (c.words[c.length++] = B & p, M = 10; M < a.length; M++) {
        var C = a.words[M] | 0;
        a.words[M - 10] = (C & p) << 4 | B >>> 22, B = C;
      }
      B >>>= 22, a.words[M - 10] = B, B === 0 && a.length > 10 ? a.length -= 10 : a.length -= 9;
    }, Y.prototype.imulK = function(a) {
      a.words[a.length] = 0, a.words[a.length + 1] = 0, a.length += 2;
      for (var c = 0, p = 0; p < a.length; p++) {
        var v = a.words[p] | 0;
        c += v * 977, a.words[p] = c & 67108863, c = v * 64 + (c / 67108864 | 0);
      }
      return a.words[a.length - 1] === 0 && (a.length--, a.words[a.length - 1] === 0 && a.length--), a;
    };
    function Q() {
      K.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    f(Q, K);
    function se() {
      K.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    f(se, K);
    function re() {
      K.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    f(re, K), re.prototype.imulK = function(a) {
      for (var c = 0, p = 0; p < a.length; p++) {
        var v = (a.words[p] | 0) * 19 + c, M = v & 67108863;
        v >>>= 26, a.words[p] = M, c = v;
      }
      return c !== 0 && (a.words[a.length++] = c), a;
    }, n._prime = function(a) {
      if (j[a])
        return j[a];
      var c;
      if (a === "k256")
        c = new Y();
      else if (a === "p224")
        c = new Q();
      else if (a === "p192")
        c = new se();
      else if (a === "p25519")
        c = new re();
      else
        throw new Error("Unknown prime " + a);
      return j[a] = c, c;
    };
    function V(A) {
      if (typeof A == "string") {
        var a = n._prime(A);
        this.m = a.p, this.prime = a;
      } else
        i(A.gtn(1), "modulus must be greater than 1"), this.m = A, this.prime = null;
    }
    V.prototype._verify1 = function(a) {
      i(a.negative === 0, "red works only with positives"), i(a.red, "red works only with red numbers");
    }, V.prototype._verify2 = function(a, c) {
      i((a.negative | c.negative) === 0, "red works only with positives"), i(
        a.red && a.red === c.red,
        "red works only with red numbers"
      );
    }, V.prototype.imod = function(a) {
      return this.prime ? this.prime.ireduce(a)._forceRed(this) : a.umod(this.m)._forceRed(this);
    }, V.prototype.neg = function(a) {
      return a.isZero() ? a.clone() : this.m.sub(a)._forceRed(this);
    }, V.prototype.add = function(a, c) {
      this._verify2(a, c);
      var p = a.add(c);
      return p.cmp(this.m) >= 0 && p.isub(this.m), p._forceRed(this);
    }, V.prototype.iadd = function(a, c) {
      this._verify2(a, c);
      var p = a.iadd(c);
      return p.cmp(this.m) >= 0 && p.isub(this.m), p;
    }, V.prototype.sub = function(a, c) {
      this._verify2(a, c);
      var p = a.sub(c);
      return p.cmpn(0) < 0 && p.iadd(this.m), p._forceRed(this);
    }, V.prototype.isub = function(a, c) {
      this._verify2(a, c);
      var p = a.isub(c);
      return p.cmpn(0) < 0 && p.iadd(this.m), p;
    }, V.prototype.shl = function(a, c) {
      return this._verify1(a), this.imod(a.ushln(c));
    }, V.prototype.imul = function(a, c) {
      return this._verify2(a, c), this.imod(a.imul(c));
    }, V.prototype.mul = function(a, c) {
      return this._verify2(a, c), this.imod(a.mul(c));
    }, V.prototype.isqr = function(a) {
      return this.imul(a, a.clone());
    }, V.prototype.sqr = function(a) {
      return this.mul(a, a);
    }, V.prototype.sqrt = function(a) {
      if (a.isZero())
        return a.clone();
      var c = this.m.andln(3);
      if (i(c % 2 === 1), c === 3) {
        var p = this.m.add(new n(1)).iushrn(2);
        return this.pow(a, p);
      }
      for (var v = this.m.subn(1), M = 0; !v.isZero() && v.andln(1) === 0; )
        M++, v.iushrn(1);
      i(!v.isZero());
      var B = new n(1).toRed(this), C = B.redNeg(), x = this.m.subn(1).iushrn(1), o = this.m.bitLength();
      for (o = new n(2 * o * o).toRed(this); this.pow(o, x).cmp(C) !== 0; )
        o.redIAdd(C);
      for (var g = this.pow(o, v), H = this.pow(a, v.addn(1).iushrn(1)), Z = this.pow(a, v), J = M; Z.cmp(B) !== 0; ) {
        for (var ie = Z, R = 0; ie.cmp(B) !== 0; R++)
          ie = ie.redSqr();
        i(R < J);
        var T = this.pow(g, new n(1).iushln(J - R - 1));
        H = H.redMul(T), g = T.redSqr(), Z = Z.redMul(g), J = R;
      }
      return H;
    }, V.prototype.invm = function(a) {
      var c = a._invmp(this.m);
      return c.negative !== 0 ? (c.negative = 0, this.imod(c).redNeg()) : this.imod(c);
    }, V.prototype.pow = function(a, c) {
      if (c.isZero())
        return new n(1).toRed(this);
      if (c.cmpn(1) === 0)
        return a.clone();
      var p = 4, v = new Array(1 << p);
      v[0] = new n(1).toRed(this), v[1] = a;
      for (var M = 2; M < v.length; M++)
        v[M] = this.mul(v[M - 1], a);
      var B = v[0], C = 0, x = 0, o = c.bitLength() % 26;
      for (o === 0 && (o = 26), M = c.length - 1; M >= 0; M--) {
        for (var g = c.words[M], H = o - 1; H >= 0; H--) {
          var Z = g >> H & 1;
          if (B !== v[0] && (B = this.sqr(B)), Z === 0 && C === 0) {
            x = 0;
            continue;
          }
          C <<= 1, C |= Z, x++, !(x !== p && (M !== 0 || H !== 0)) && (B = this.mul(B, v[C]), x = 0, C = 0);
        }
        o = 26;
      }
      return B;
    }, V.prototype.convertTo = function(a) {
      var c = a.umod(this.m);
      return c === a ? c.clone() : c;
    }, V.prototype.convertFrom = function(a) {
      var c = a.clone();
      return c.red = null, c;
    }, n.mont = function(a) {
      return new Me(a);
    };
    function Me(A) {
      V.call(this, A), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new n(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    f(Me, V), Me.prototype.convertTo = function(a) {
      return this.imod(a.ushln(this.shift));
    }, Me.prototype.convertFrom = function(a) {
      var c = this.imod(a.mul(this.rinv));
      return c.red = null, c;
    }, Me.prototype.imul = function(a, c) {
      if (a.isZero() || c.isZero())
        return a.words[0] = 0, a.length = 1, a;
      var p = a.imul(c), v = p.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), M = p.isub(v).iushrn(this.shift), B = M;
      return M.cmp(this.m) >= 0 ? B = M.isub(this.m) : M.cmpn(0) < 0 && (B = M.iadd(this.m)), B._forceRed(this);
    }, Me.prototype.mul = function(a, c) {
      if (a.isZero() || c.isZero())
        return new n(0)._forceRed(this);
      var p = a.mul(c), v = p.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), M = p.isub(v).iushrn(this.shift), B = M;
      return M.cmp(this.m) >= 0 ? B = M.isub(this.m) : M.cmpn(0) < 0 && (B = M.iadd(this.m)), B._forceRed(this);
    }, Me.prototype.invm = function(a) {
      var c = this.imod(a._invmp(this.m).mul(this.r2));
      return c._forceRed(this);
    };
  })(t, Kt);
})(Ji);
var Pt = Ji.exports, Vt = Qn;
function Qn(t, e) {
  if (!t)
    throw new Error(e || "Assertion failed");
}
Qn.equal = function(e, r, i) {
  if (e != r)
    throw new Error(i || "Assertion failed: " + e + " != " + r);
};
var Xi = {};
(function(t) {
  var e = t;
  function r(n, u) {
    if (Array.isArray(n))
      return n.slice();
    if (!n)
      return [];
    var h = [];
    if (typeof n != "string") {
      for (var b = 0; b < n.length; b++)
        h[b] = n[b] | 0;
      return h;
    }
    if (u === "hex") {
      n = n.replace(/[^a-z0-9]+/ig, ""), n.length % 2 !== 0 && (n = "0" + n);
      for (var b = 0; b < n.length; b += 2)
        h.push(parseInt(n[b] + n[b + 1], 16));
    } else
      for (var b = 0; b < n.length; b++) {
        var _ = n.charCodeAt(b), w = _ >> 8, E = _ & 255;
        w ? h.push(w, E) : h.push(E);
      }
    return h;
  }
  e.toArray = r;
  function i(n) {
    return n.length === 1 ? "0" + n : n;
  }
  e.zero2 = i;
  function f(n) {
    for (var u = "", h = 0; h < n.length; h++)
      u += i(n[h].toString(16));
    return u;
  }
  e.toHex = f, e.encode = function(u, h) {
    return h === "hex" ? f(u) : u;
  };
})(Xi);
(function(t) {
  var e = t, r = Pt, i = Vt, f = Xi;
  e.assert = i, e.toArray = f.toArray, e.zero2 = f.zero2, e.toHex = f.toHex, e.encode = f.encode;
  function n(w, E, P) {
    var F = new Array(Math.max(w.bitLength(), P) + 1);
    F.fill(0);
    for (var N = 1 << E + 1, O = w.clone(), D = 0; D < F.length; D++) {
      var k, z = O.andln(N - 1);
      O.isOdd() ? (z > (N >> 1) - 1 ? k = (N >> 1) - z : k = z, O.isubn(k)) : k = 0, F[D] = k, O.iushrn(1);
    }
    return F;
  }
  e.getNAF = n;
  function u(w, E) {
    var P = [
      [],
      []
    ];
    w = w.clone(), E = E.clone();
    for (var F = 0, N = 0, O; w.cmpn(-F) > 0 || E.cmpn(-N) > 0; ) {
      var D = w.andln(3) + F & 3, k = E.andln(3) + N & 3;
      D === 3 && (D = -1), k === 3 && (k = -1);
      var z;
      D & 1 ? (O = w.andln(7) + F & 7, (O === 3 || O === 5) && k === 2 ? z = -D : z = D) : z = 0, P[0].push(z);
      var j;
      k & 1 ? (O = E.andln(7) + N & 7, (O === 3 || O === 5) && D === 2 ? j = -k : j = k) : j = 0, P[1].push(j), 2 * F === z + 1 && (F = 1 - F), 2 * N === j + 1 && (N = 1 - N), w.iushrn(1), E.iushrn(1);
    }
    return P;
  }
  e.getJSF = u;
  function h(w, E, P) {
    var F = "_" + E;
    w.prototype[E] = function() {
      return this[F] !== void 0 ? this[F] : this[F] = P.call(this);
    };
  }
  e.cachedProperty = h;
  function b(w) {
    return typeof w == "string" ? e.toArray(w, "hex") : w;
  }
  e.parseBytes = b;
  function _(w) {
    return new r(w, "hex", "le");
  }
  e.intFromLE = _;
})(rt);
var Qi = { exports: {} }, Si;
Qi.exports = function(e) {
  return Si || (Si = new Ft(null)), Si.generate(e);
};
function Ft(t) {
  this.rand = t;
}
Qi.exports.Rand = Ft;
Ft.prototype.generate = function(e) {
  return this._rand(e);
};
Ft.prototype._rand = function(e) {
  if (this.rand.getBytes)
    return this.rand.getBytes(e);
  for (var r = new Uint8Array(e), i = 0; i < r.length; i++)
    r[i] = this.rand.getByte();
  return r;
};
if (typeof self == "object")
  self.crypto && self.crypto.getRandomValues ? Ft.prototype._rand = function(e) {
    var r = new Uint8Array(e);
    return self.crypto.getRandomValues(r), r;
  } : self.msCrypto && self.msCrypto.getRandomValues ? Ft.prototype._rand = function(e) {
    var r = new Uint8Array(e);
    return self.msCrypto.getRandomValues(r), r;
  } : typeof window == "object" && (Ft.prototype._rand = function() {
    throw new Error("Not implemented yet");
  });
else
  try {
    var yn = Ht;
    if (typeof yn.randomBytes != "function")
      throw new Error("Not supported");
    Ft.prototype._rand = function(e) {
      return yn.randomBytes(e);
    };
  } catch {
  }
var ef = Qi.exports, en = {}, Ut = Pt, Sr = rt, Fr = Sr.getNAF, Ma = Sr.getJSF, Lr = Sr.assert;
function Ot(t, e) {
  this.type = t, this.p = new Ut(e.p, 16), this.red = e.prime ? Ut.red(e.prime) : Ut.mont(this.p), this.zero = new Ut(0).toRed(this.red), this.one = new Ut(1).toRed(this.red), this.two = new Ut(2).toRed(this.red), this.n = e.n && new Ut(e.n, 16), this.g = e.g && this.pointFromJSON(e.g, e.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
  var r = this.n && this.p.div(this.n);
  !r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
}
var Ur = Ot;
Ot.prototype.point = function() {
  throw new Error("Not implemented");
};
Ot.prototype.validate = function() {
  throw new Error("Not implemented");
};
Ot.prototype._fixedNafMul = function(e, r) {
  Lr(e.precomputed);
  var i = e._getDoubles(), f = Fr(r, 1, this._bitLength), n = (1 << i.step + 1) - (i.step % 2 === 0 ? 2 : 1);
  n /= 3;
  var u = [], h, b;
  for (h = 0; h < f.length; h += i.step) {
    b = 0;
    for (var _ = h + i.step - 1; _ >= h; _--)
      b = (b << 1) + f[_];
    u.push(b);
  }
  for (var w = this.jpoint(null, null, null), E = this.jpoint(null, null, null), P = n; P > 0; P--) {
    for (h = 0; h < u.length; h++)
      b = u[h], b === P ? E = E.mixedAdd(i.points[h]) : b === -P && (E = E.mixedAdd(i.points[h].neg()));
    w = w.add(E);
  }
  return w.toP();
};
Ot.prototype._wnafMul = function(e, r) {
  var i = 4, f = e._getNAFPoints(i);
  i = f.wnd;
  for (var n = f.points, u = Fr(r, i, this._bitLength), h = this.jpoint(null, null, null), b = u.length - 1; b >= 0; b--) {
    for (var _ = 0; b >= 0 && u[b] === 0; b--)
      _++;
    if (b >= 0 && _++, h = h.dblp(_), b < 0)
      break;
    var w = u[b];
    Lr(w !== 0), e.type === "affine" ? w > 0 ? h = h.mixedAdd(n[w - 1 >> 1]) : h = h.mixedAdd(n[-w - 1 >> 1].neg()) : w > 0 ? h = h.add(n[w - 1 >> 1]) : h = h.add(n[-w - 1 >> 1].neg());
  }
  return e.type === "affine" ? h.toP() : h;
};
Ot.prototype._wnafMulAdd = function(e, r, i, f, n) {
  var u = this._wnafT1, h = this._wnafT2, b = this._wnafT3, _ = 0, w, E, P;
  for (w = 0; w < f; w++) {
    P = r[w];
    var F = P._getNAFPoints(e);
    u[w] = F.wnd, h[w] = F.points;
  }
  for (w = f - 1; w >= 1; w -= 2) {
    var N = w - 1, O = w;
    if (u[N] !== 1 || u[O] !== 1) {
      b[N] = Fr(i[N], u[N], this._bitLength), b[O] = Fr(i[O], u[O], this._bitLength), _ = Math.max(b[N].length, _), _ = Math.max(b[O].length, _);
      continue;
    }
    var D = [
      r[N],
      /* 1 */
      null,
      /* 3 */
      null,
      /* 5 */
      r[O]
      /* 7 */
    ];
    r[N].y.cmp(r[O].y) === 0 ? (D[1] = r[N].add(r[O]), D[2] = r[N].toJ().mixedAdd(r[O].neg())) : r[N].y.cmp(r[O].y.redNeg()) === 0 ? (D[1] = r[N].toJ().mixedAdd(r[O]), D[2] = r[N].add(r[O].neg())) : (D[1] = r[N].toJ().mixedAdd(r[O]), D[2] = r[N].toJ().mixedAdd(r[O].neg()));
    var k = [
      -3,
      /* -1 -1 */
      -1,
      /* -1 0 */
      -5,
      /* -1 1 */
      -7,
      /* 0 -1 */
      0,
      /* 0 0 */
      7,
      /* 0 1 */
      5,
      /* 1 -1 */
      1,
      /* 1 0 */
      3
      /* 1 1 */
    ], z = Ma(i[N], i[O]);
    for (_ = Math.max(z[0].length, _), b[N] = new Array(_), b[O] = new Array(_), E = 0; E < _; E++) {
      var j = z[0][E] | 0, K = z[1][E] | 0;
      b[N][E] = k[(j + 1) * 3 + (K + 1)], b[O][E] = 0, h[N] = D;
    }
  }
  var Y = this.jpoint(null, null, null), Q = this._wnafT4;
  for (w = _; w >= 0; w--) {
    for (var se = 0; w >= 0; ) {
      var re = !0;
      for (E = 0; E < f; E++)
        Q[E] = b[E][w] | 0, Q[E] !== 0 && (re = !1);
      if (!re)
        break;
      se++, w--;
    }
    if (w >= 0 && se++, Y = Y.dblp(se), w < 0)
      break;
    for (E = 0; E < f; E++) {
      var V = Q[E];
      V !== 0 && (V > 0 ? P = h[E][V - 1 >> 1] : V < 0 && (P = h[E][-V - 1 >> 1].neg()), P.type === "affine" ? Y = Y.mixedAdd(P) : Y = Y.add(P));
    }
  }
  for (w = 0; w < f; w++)
    h[w] = null;
  return n ? Y : Y.toP();
};
function at(t, e) {
  this.curve = t, this.type = e, this.precomputed = null;
}
Ot.BasePoint = at;
at.prototype.eq = function() {
  throw new Error("Not implemented");
};
at.prototype.validate = function() {
  return this.curve.validate(this);
};
Ot.prototype.decodePoint = function(e, r) {
  e = Sr.toArray(e, r);
  var i = this.p.byteLength();
  if ((e[0] === 4 || e[0] === 6 || e[0] === 7) && e.length - 1 === 2 * i) {
    e[0] === 6 ? Lr(e[e.length - 1] % 2 === 0) : e[0] === 7 && Lr(e[e.length - 1] % 2 === 1);
    var f = this.point(
      e.slice(1, 1 + i),
      e.slice(1 + i, 1 + 2 * i)
    );
    return f;
  } else if ((e[0] === 2 || e[0] === 3) && e.length - 1 === i)
    return this.pointFromX(e.slice(1, 1 + i), e[0] === 3);
  throw new Error("Unknown point format");
};
at.prototype.encodeCompressed = function(e) {
  return this.encode(e, !0);
};
at.prototype._encode = function(e) {
  var r = this.curve.p.byteLength(), i = this.getX().toArray("be", r);
  return e ? [this.getY().isEven() ? 2 : 3].concat(i) : [4].concat(i, this.getY().toArray("be", r));
};
at.prototype.encode = function(e, r) {
  return Sr.encode(this._encode(r), e);
};
at.prototype.precompute = function(e) {
  if (this.precomputed)
    return this;
  var r = {
    doubles: null,
    naf: null,
    beta: null
  };
  return r.naf = this._getNAFPoints(8), r.doubles = this._getDoubles(4, e), r.beta = this._getBeta(), this.precomputed = r, this;
};
at.prototype._hasDoubles = function(e) {
  if (!this.precomputed)
    return !1;
  var r = this.precomputed.doubles;
  return r ? r.points.length >= Math.ceil((e.bitLength() + 1) / r.step) : !1;
};
at.prototype._getDoubles = function(e, r) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;
  for (var i = [this], f = this, n = 0; n < r; n += e) {
    for (var u = 0; u < e; u++)
      f = f.dbl();
    i.push(f);
  }
  return {
    step: e,
    points: i
  };
};
at.prototype._getNAFPoints = function(e) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;
  for (var r = [this], i = (1 << e) - 1, f = i === 1 ? null : this.dbl(), n = 1; n < i; n++)
    r[n] = r[n - 1].add(f);
  return {
    wnd: e,
    points: r
  };
};
at.prototype._getBeta = function() {
  return null;
};
at.prototype.dblp = function(e) {
  for (var r = this, i = 0; i < e; i++)
    r = r.dbl();
  return r;
};
var Ki = { exports: {} };
typeof Object.create == "function" ? Ki.exports = function(e, r) {
  r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : Ki.exports = function(e, r) {
  if (r) {
    e.super_ = r;
    var i = function() {
    };
    i.prototype = r.prototype, e.prototype = new i(), e.prototype.constructor = e;
  }
};
var ze = Ki.exports, Sa = rt, Ee = Pt, tn = ze, ar = Ur, Ea = Sa.assert;
function st(t) {
  ar.call(this, "short", t), this.a = new Ee(t.a, 16).toRed(this.red), this.b = new Ee(t.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(t), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
}
tn(st, ar);
var Aa = st;
st.prototype._getEndomorphism = function(e) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var r, i;
    if (e.beta)
      r = new Ee(e.beta, 16).toRed(this.red);
    else {
      var f = this._getEndoRoots(this.p);
      r = f[0].cmp(f[1]) < 0 ? f[0] : f[1], r = r.toRed(this.red);
    }
    if (e.lambda)
      i = new Ee(e.lambda, 16);
    else {
      var n = this._getEndoRoots(this.n);
      this.g.mul(n[0]).x.cmp(this.g.x.redMul(r)) === 0 ? i = n[0] : (i = n[1], Ea(this.g.mul(i).x.cmp(this.g.x.redMul(r)) === 0));
    }
    var u;
    return e.basis ? u = e.basis.map(function(h) {
      return {
        a: new Ee(h.a, 16),
        b: new Ee(h.b, 16)
      };
    }) : u = this._getEndoBasis(i), {
      beta: r,
      lambda: i,
      basis: u
    };
  }
};
st.prototype._getEndoRoots = function(e) {
  var r = e === this.p ? this.red : Ee.mont(e), i = new Ee(2).toRed(r).redInvm(), f = i.redNeg(), n = new Ee(3).toRed(r).redNeg().redSqrt().redMul(i), u = f.redAdd(n).fromRed(), h = f.redSub(n).fromRed();
  return [u, h];
};
st.prototype._getEndoBasis = function(e) {
  for (var r = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), i = e, f = this.n.clone(), n = new Ee(1), u = new Ee(0), h = new Ee(0), b = new Ee(1), _, w, E, P, F, N, O, D = 0, k, z; i.cmpn(0) !== 0; ) {
    var j = f.div(i);
    k = f.sub(j.mul(i)), z = h.sub(j.mul(n));
    var K = b.sub(j.mul(u));
    if (!E && k.cmp(r) < 0)
      _ = O.neg(), w = n, E = k.neg(), P = z;
    else if (E && ++D === 2)
      break;
    O = k, f = i, i = k, h = n, n = z, b = u, u = K;
  }
  F = k.neg(), N = z;
  var Y = E.sqr().add(P.sqr()), Q = F.sqr().add(N.sqr());
  return Q.cmp(Y) >= 0 && (F = _, N = w), E.negative && (E = E.neg(), P = P.neg()), F.negative && (F = F.neg(), N = N.neg()), [
    { a: E, b: P },
    { a: F, b: N }
  ];
};
st.prototype._endoSplit = function(e) {
  var r = this.endo.basis, i = r[0], f = r[1], n = f.b.mul(e).divRound(this.n), u = i.b.neg().mul(e).divRound(this.n), h = n.mul(i.a), b = u.mul(f.a), _ = n.mul(i.b), w = u.mul(f.b), E = e.sub(h).sub(b), P = _.add(w).neg();
  return { k1: E, k2: P };
};
st.prototype.pointFromX = function(e, r) {
  e = new Ee(e, 16), e.red || (e = e.toRed(this.red));
  var i = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), f = i.redSqrt();
  if (f.redSqr().redSub(i).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var n = f.fromRed().isOdd();
  return (r && !n || !r && n) && (f = f.redNeg()), this.point(e, f);
};
st.prototype.validate = function(e) {
  if (e.inf)
    return !0;
  var r = e.x, i = e.y, f = this.a.redMul(r), n = r.redSqr().redMul(r).redIAdd(f).redIAdd(this.b);
  return i.redSqr().redISub(n).cmpn(0) === 0;
};
st.prototype._endoWnafMulAdd = function(e, r, i) {
  for (var f = this._endoWnafT1, n = this._endoWnafT2, u = 0; u < e.length; u++) {
    var h = this._endoSplit(r[u]), b = e[u], _ = b._getBeta();
    h.k1.negative && (h.k1.ineg(), b = b.neg(!0)), h.k2.negative && (h.k2.ineg(), _ = _.neg(!0)), f[u * 2] = b, f[u * 2 + 1] = _, n[u * 2] = h.k1, n[u * 2 + 1] = h.k2;
  }
  for (var w = this._wnafMulAdd(1, f, n, u * 2, i), E = 0; E < u * 2; E++)
    f[E] = null, n[E] = null;
  return w;
};
function je(t, e, r, i) {
  ar.BasePoint.call(this, t, "affine"), e === null && r === null ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new Ee(e, 16), this.y = new Ee(r, 16), i && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
}
tn(je, ar.BasePoint);
st.prototype.point = function(e, r, i) {
  return new je(this, e, r, i);
};
st.prototype.pointFromJSON = function(e, r) {
  return je.fromJSON(this, e, r);
};
je.prototype._getBeta = function() {
  if (this.curve.endo) {
    var e = this.precomputed;
    if (e && e.beta)
      return e.beta;
    var r = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (e) {
      var i = this.curve, f = function(n) {
        return i.point(n.x.redMul(i.endo.beta), n.y);
      };
      e.beta = r, r.precomputed = {
        beta: null,
        naf: e.naf && {
          wnd: e.naf.wnd,
          points: e.naf.points.map(f)
        },
        doubles: e.doubles && {
          step: e.doubles.step,
          points: e.doubles.points.map(f)
        }
      };
    }
    return r;
  }
};
je.prototype.toJSON = function() {
  return this.precomputed ? [this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  }] : [this.x, this.y];
};
je.fromJSON = function(e, r, i) {
  typeof r == "string" && (r = JSON.parse(r));
  var f = e.point(r[0], r[1], i);
  if (!r[2])
    return f;
  function n(h) {
    return e.point(h[0], h[1], i);
  }
  var u = r[2];
  return f.precomputed = {
    beta: null,
    doubles: u.doubles && {
      step: u.doubles.step,
      points: [f].concat(u.doubles.points.map(n))
    },
    naf: u.naf && {
      wnd: u.naf.wnd,
      points: [f].concat(u.naf.points.map(n))
    }
  }, f;
};
je.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
je.prototype.isInfinity = function() {
  return this.inf;
};
je.prototype.add = function(e) {
  if (this.inf)
    return e;
  if (e.inf)
    return this;
  if (this.eq(e))
    return this.dbl();
  if (this.neg().eq(e))
    return this.curve.point(null, null);
  if (this.x.cmp(e.x) === 0)
    return this.curve.point(null, null);
  var r = this.y.redSub(e.y);
  r.cmpn(0) !== 0 && (r = r.redMul(this.x.redSub(e.x).redInvm()));
  var i = r.redSqr().redISub(this.x).redISub(e.x), f = r.redMul(this.x.redSub(i)).redISub(this.y);
  return this.curve.point(i, f);
};
je.prototype.dbl = function() {
  if (this.inf)
    return this;
  var e = this.y.redAdd(this.y);
  if (e.cmpn(0) === 0)
    return this.curve.point(null, null);
  var r = this.curve.a, i = this.x.redSqr(), f = e.redInvm(), n = i.redAdd(i).redIAdd(i).redIAdd(r).redMul(f), u = n.redSqr().redISub(this.x.redAdd(this.x)), h = n.redMul(this.x.redSub(u)).redISub(this.y);
  return this.curve.point(u, h);
};
je.prototype.getX = function() {
  return this.x.fromRed();
};
je.prototype.getY = function() {
  return this.y.fromRed();
};
je.prototype.mul = function(e) {
  return e = new Ee(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e);
};
je.prototype.mulAdd = function(e, r, i) {
  var f = [this, r], n = [e, i];
  return this.curve.endo ? this.curve._endoWnafMulAdd(f, n) : this.curve._wnafMulAdd(1, f, n, 2);
};
je.prototype.jmulAdd = function(e, r, i) {
  var f = [this, r], n = [e, i];
  return this.curve.endo ? this.curve._endoWnafMulAdd(f, n, !0) : this.curve._wnafMulAdd(1, f, n, 2, !0);
};
je.prototype.eq = function(e) {
  return this === e || this.inf === e.inf && (this.inf || this.x.cmp(e.x) === 0 && this.y.cmp(e.y) === 0);
};
je.prototype.neg = function(e) {
  if (this.inf)
    return this;
  var r = this.curve.point(this.x, this.y.redNeg());
  if (e && this.precomputed) {
    var i = this.precomputed, f = function(n) {
      return n.neg();
    };
    r.precomputed = {
      naf: i.naf && {
        wnd: i.naf.wnd,
        points: i.naf.points.map(f)
      },
      doubles: i.doubles && {
        step: i.doubles.step,
        points: i.doubles.points.map(f)
      }
    };
  }
  return r;
};
je.prototype.toJ = function() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);
  var e = this.curve.jpoint(this.x, this.y, this.curve.one);
  return e;
};
function Ve(t, e, r, i) {
  ar.BasePoint.call(this, t, "jacobian"), e === null && r === null && i === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new Ee(0)) : (this.x = new Ee(e, 16), this.y = new Ee(r, 16), this.z = new Ee(i, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
tn(Ve, ar.BasePoint);
st.prototype.jpoint = function(e, r, i) {
  return new Ve(this, e, r, i);
};
Ve.prototype.toP = function() {
  if (this.isInfinity())
    return this.curve.point(null, null);
  var e = this.z.redInvm(), r = e.redSqr(), i = this.x.redMul(r), f = this.y.redMul(r).redMul(e);
  return this.curve.point(i, f);
};
Ve.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
Ve.prototype.add = function(e) {
  if (this.isInfinity())
    return e;
  if (e.isInfinity())
    return this;
  var r = e.z.redSqr(), i = this.z.redSqr(), f = this.x.redMul(r), n = e.x.redMul(i), u = this.y.redMul(r.redMul(e.z)), h = e.y.redMul(i.redMul(this.z)), b = f.redSub(n), _ = u.redSub(h);
  if (b.cmpn(0) === 0)
    return _.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var w = b.redSqr(), E = w.redMul(b), P = f.redMul(w), F = _.redSqr().redIAdd(E).redISub(P).redISub(P), N = _.redMul(P.redISub(F)).redISub(u.redMul(E)), O = this.z.redMul(e.z).redMul(b);
  return this.curve.jpoint(F, N, O);
};
Ve.prototype.mixedAdd = function(e) {
  if (this.isInfinity())
    return e.toJ();
  if (e.isInfinity())
    return this;
  var r = this.z.redSqr(), i = this.x, f = e.x.redMul(r), n = this.y, u = e.y.redMul(r).redMul(this.z), h = i.redSub(f), b = n.redSub(u);
  if (h.cmpn(0) === 0)
    return b.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var _ = h.redSqr(), w = _.redMul(h), E = i.redMul(_), P = b.redSqr().redIAdd(w).redISub(E).redISub(E), F = b.redMul(E.redISub(P)).redISub(n.redMul(w)), N = this.z.redMul(h);
  return this.curve.jpoint(P, F, N);
};
Ve.prototype.dblp = function(e) {
  if (e === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!e)
    return this.dbl();
  var r;
  if (this.curve.zeroA || this.curve.threeA) {
    var i = this;
    for (r = 0; r < e; r++)
      i = i.dbl();
    return i;
  }
  var f = this.curve.a, n = this.curve.tinv, u = this.x, h = this.y, b = this.z, _ = b.redSqr().redSqr(), w = h.redAdd(h);
  for (r = 0; r < e; r++) {
    var E = u.redSqr(), P = w.redSqr(), F = P.redSqr(), N = E.redAdd(E).redIAdd(E).redIAdd(f.redMul(_)), O = u.redMul(P), D = N.redSqr().redISub(O.redAdd(O)), k = O.redISub(D), z = N.redMul(k);
    z = z.redIAdd(z).redISub(F);
    var j = w.redMul(b);
    r + 1 < e && (_ = _.redMul(F)), u = D, b = j, w = z;
  }
  return this.curve.jpoint(u, w.redMul(n), b);
};
Ve.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
Ve.prototype._zeroDbl = function() {
  var e, r, i;
  if (this.zOne) {
    var f = this.x.redSqr(), n = this.y.redSqr(), u = n.redSqr(), h = this.x.redAdd(n).redSqr().redISub(f).redISub(u);
    h = h.redIAdd(h);
    var b = f.redAdd(f).redIAdd(f), _ = b.redSqr().redISub(h).redISub(h), w = u.redIAdd(u);
    w = w.redIAdd(w), w = w.redIAdd(w), e = _, r = b.redMul(h.redISub(_)).redISub(w), i = this.y.redAdd(this.y);
  } else {
    var E = this.x.redSqr(), P = this.y.redSqr(), F = P.redSqr(), N = this.x.redAdd(P).redSqr().redISub(E).redISub(F);
    N = N.redIAdd(N);
    var O = E.redAdd(E).redIAdd(E), D = O.redSqr(), k = F.redIAdd(F);
    k = k.redIAdd(k), k = k.redIAdd(k), e = D.redISub(N).redISub(N), r = O.redMul(N.redISub(e)).redISub(k), i = this.y.redMul(this.z), i = i.redIAdd(i);
  }
  return this.curve.jpoint(e, r, i);
};
Ve.prototype._threeDbl = function() {
  var e, r, i;
  if (this.zOne) {
    var f = this.x.redSqr(), n = this.y.redSqr(), u = n.redSqr(), h = this.x.redAdd(n).redSqr().redISub(f).redISub(u);
    h = h.redIAdd(h);
    var b = f.redAdd(f).redIAdd(f).redIAdd(this.curve.a), _ = b.redSqr().redISub(h).redISub(h);
    e = _;
    var w = u.redIAdd(u);
    w = w.redIAdd(w), w = w.redIAdd(w), r = b.redMul(h.redISub(_)).redISub(w), i = this.y.redAdd(this.y);
  } else {
    var E = this.z.redSqr(), P = this.y.redSqr(), F = this.x.redMul(P), N = this.x.redSub(E).redMul(this.x.redAdd(E));
    N = N.redAdd(N).redIAdd(N);
    var O = F.redIAdd(F);
    O = O.redIAdd(O);
    var D = O.redAdd(O);
    e = N.redSqr().redISub(D), i = this.y.redAdd(this.z).redSqr().redISub(P).redISub(E);
    var k = P.redSqr();
    k = k.redIAdd(k), k = k.redIAdd(k), k = k.redIAdd(k), r = N.redMul(O.redISub(e)).redISub(k);
  }
  return this.curve.jpoint(e, r, i);
};
Ve.prototype._dbl = function() {
  var e = this.curve.a, r = this.x, i = this.y, f = this.z, n = f.redSqr().redSqr(), u = r.redSqr(), h = i.redSqr(), b = u.redAdd(u).redIAdd(u).redIAdd(e.redMul(n)), _ = r.redAdd(r);
  _ = _.redIAdd(_);
  var w = _.redMul(h), E = b.redSqr().redISub(w.redAdd(w)), P = w.redISub(E), F = h.redSqr();
  F = F.redIAdd(F), F = F.redIAdd(F), F = F.redIAdd(F);
  var N = b.redMul(P).redISub(F), O = i.redAdd(i).redMul(f);
  return this.curve.jpoint(E, N, O);
};
Ve.prototype.trpl = function() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);
  var e = this.x.redSqr(), r = this.y.redSqr(), i = this.z.redSqr(), f = r.redSqr(), n = e.redAdd(e).redIAdd(e), u = n.redSqr(), h = this.x.redAdd(r).redSqr().redISub(e).redISub(f);
  h = h.redIAdd(h), h = h.redAdd(h).redIAdd(h), h = h.redISub(u);
  var b = h.redSqr(), _ = f.redIAdd(f);
  _ = _.redIAdd(_), _ = _.redIAdd(_), _ = _.redIAdd(_);
  var w = n.redIAdd(h).redSqr().redISub(u).redISub(b).redISub(_), E = r.redMul(w);
  E = E.redIAdd(E), E = E.redIAdd(E);
  var P = this.x.redMul(b).redISub(E);
  P = P.redIAdd(P), P = P.redIAdd(P);
  var F = this.y.redMul(w.redMul(_.redISub(w)).redISub(h.redMul(b)));
  F = F.redIAdd(F), F = F.redIAdd(F), F = F.redIAdd(F);
  var N = this.z.redAdd(h).redSqr().redISub(i).redISub(b);
  return this.curve.jpoint(P, F, N);
};
Ve.prototype.mul = function(e, r) {
  return e = new Ee(e, r), this.curve._wnafMul(this, e);
};
Ve.prototype.eq = function(e) {
  if (e.type === "affine")
    return this.eq(e.toJ());
  if (this === e)
    return !0;
  var r = this.z.redSqr(), i = e.z.redSqr();
  if (this.x.redMul(i).redISub(e.x.redMul(r)).cmpn(0) !== 0)
    return !1;
  var f = r.redMul(this.z), n = i.redMul(e.z);
  return this.y.redMul(n).redISub(e.y.redMul(f)).cmpn(0) === 0;
};
Ve.prototype.eqXToP = function(e) {
  var r = this.z.redSqr(), i = e.toRed(this.curve.red).redMul(r);
  if (this.x.cmp(i) === 0)
    return !0;
  for (var f = e.clone(), n = this.curve.redN.redMul(r); ; ) {
    if (f.iadd(this.curve.n), f.cmp(this.curve.p) >= 0)
      return !1;
    if (i.redIAdd(n), this.x.cmp(i) === 0)
      return !0;
  }
};
Ve.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
Ve.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
var Qt = Pt, tf = ze, Dr = Ur, Ia = rt;
function sr(t) {
  Dr.call(this, "mont", t), this.a = new Qt(t.a, 16).toRed(this.red), this.b = new Qt(t.b, 16).toRed(this.red), this.i4 = new Qt(4).toRed(this.red).redInvm(), this.two = new Qt(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
tf(sr, Dr);
var Ba = sr;
sr.prototype.validate = function(e) {
  var r = e.normalize().x, i = r.redSqr(), f = i.redMul(r).redAdd(i.redMul(this.a)).redAdd(r), n = f.redSqrt();
  return n.redSqr().cmp(f) === 0;
};
function We(t, e, r) {
  Dr.BasePoint.call(this, t, "projective"), e === null && r === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new Qt(e, 16), this.z = new Qt(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
}
tf(We, Dr.BasePoint);
sr.prototype.decodePoint = function(e, r) {
  return this.point(Ia.toArray(e, r), 1);
};
sr.prototype.point = function(e, r) {
  return new We(this, e, r);
};
sr.prototype.pointFromJSON = function(e) {
  return We.fromJSON(this, e);
};
We.prototype.precompute = function() {
};
We.prototype._encode = function() {
  return this.getX().toArray("be", this.curve.p.byteLength());
};
We.fromJSON = function(e, r) {
  return new We(e, r[0], r[1] || e.one);
};
We.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
We.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
We.prototype.dbl = function() {
  var e = this.x.redAdd(this.z), r = e.redSqr(), i = this.x.redSub(this.z), f = i.redSqr(), n = r.redSub(f), u = r.redMul(f), h = n.redMul(f.redAdd(this.curve.a24.redMul(n)));
  return this.curve.point(u, h);
};
We.prototype.add = function() {
  throw new Error("Not supported on Montgomery curve");
};
We.prototype.diffAdd = function(e, r) {
  var i = this.x.redAdd(this.z), f = this.x.redSub(this.z), n = e.x.redAdd(e.z), u = e.x.redSub(e.z), h = u.redMul(i), b = n.redMul(f), _ = r.z.redMul(h.redAdd(b).redSqr()), w = r.x.redMul(h.redISub(b).redSqr());
  return this.curve.point(_, w);
};
We.prototype.mul = function(e) {
  for (var r = e.clone(), i = this, f = this.curve.point(null, null), n = this, u = []; r.cmpn(0) !== 0; r.iushrn(1))
    u.push(r.andln(1));
  for (var h = u.length - 1; h >= 0; h--)
    u[h] === 0 ? (i = i.diffAdd(f, n), f = f.dbl()) : (f = i.diffAdd(f, n), i = i.dbl());
  return f;
};
We.prototype.mulAdd = function() {
  throw new Error("Not supported on Montgomery curve");
};
We.prototype.jumlAdd = function() {
  throw new Error("Not supported on Montgomery curve");
};
We.prototype.eq = function(e) {
  return this.getX().cmp(e.getX()) === 0;
};
We.prototype.normalize = function() {
  return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
};
We.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
var Ra = rt, At = Pt, rf = ze, qr = Ur, Pa = Ra.assert;
function St(t) {
  this.twisted = (t.a | 0) !== 1, this.mOneA = this.twisted && (t.a | 0) === -1, this.extended = this.mOneA, qr.call(this, "edwards", t), this.a = new At(t.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new At(t.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new At(t.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), Pa(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (t.c | 0) === 1;
}
rf(St, qr);
var Ta = St;
St.prototype._mulA = function(e) {
  return this.mOneA ? e.redNeg() : this.a.redMul(e);
};
St.prototype._mulC = function(e) {
  return this.oneC ? e : this.c.redMul(e);
};
St.prototype.jpoint = function(e, r, i, f) {
  return this.point(e, r, i, f);
};
St.prototype.pointFromX = function(e, r) {
  e = new At(e, 16), e.red || (e = e.toRed(this.red));
  var i = e.redSqr(), f = this.c2.redSub(this.a.redMul(i)), n = this.one.redSub(this.c2.redMul(this.d).redMul(i)), u = f.redMul(n.redInvm()), h = u.redSqrt();
  if (h.redSqr().redSub(u).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var b = h.fromRed().isOdd();
  return (r && !b || !r && b) && (h = h.redNeg()), this.point(e, h);
};
St.prototype.pointFromY = function(e, r) {
  e = new At(e, 16), e.red || (e = e.toRed(this.red));
  var i = e.redSqr(), f = i.redSub(this.c2), n = i.redMul(this.d).redMul(this.c2).redSub(this.a), u = f.redMul(n.redInvm());
  if (u.cmp(this.zero) === 0) {
    if (r)
      throw new Error("invalid point");
    return this.point(this.zero, e);
  }
  var h = u.redSqrt();
  if (h.redSqr().redSub(u).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  return h.fromRed().isOdd() !== r && (h = h.redNeg()), this.point(h, e);
};
St.prototype.validate = function(e) {
  if (e.isInfinity())
    return !0;
  e.normalize();
  var r = e.x.redSqr(), i = e.y.redSqr(), f = r.redMul(this.a).redAdd(i), n = this.c2.redMul(this.one.redAdd(this.d.redMul(r).redMul(i)));
  return f.cmp(n) === 0;
};
function we(t, e, r, i, f) {
  qr.BasePoint.call(this, t, "projective"), e === null && r === null && i === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new At(e, 16), this.y = new At(r, 16), this.z = i ? new At(i, 16) : this.curve.one, this.t = f && new At(f, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
}
rf(we, qr.BasePoint);
St.prototype.pointFromJSON = function(e) {
  return we.fromJSON(this, e);
};
St.prototype.point = function(e, r, i, f) {
  return new we(this, e, r, i, f);
};
we.fromJSON = function(e, r) {
  return new we(e, r[0], r[1], r[2]);
};
we.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
we.prototype.isInfinity = function() {
  return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
};
we.prototype._extDbl = function() {
  var e = this.x.redSqr(), r = this.y.redSqr(), i = this.z.redSqr();
  i = i.redIAdd(i);
  var f = this.curve._mulA(e), n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(r), u = f.redAdd(r), h = u.redSub(i), b = f.redSub(r), _ = n.redMul(h), w = u.redMul(b), E = n.redMul(b), P = h.redMul(u);
  return this.curve.point(_, w, P, E);
};
we.prototype._projDbl = function() {
  var e = this.x.redAdd(this.y).redSqr(), r = this.x.redSqr(), i = this.y.redSqr(), f, n, u, h, b, _;
  if (this.curve.twisted) {
    h = this.curve._mulA(r);
    var w = h.redAdd(i);
    this.zOne ? (f = e.redSub(r).redSub(i).redMul(w.redSub(this.curve.two)), n = w.redMul(h.redSub(i)), u = w.redSqr().redSub(w).redSub(w)) : (b = this.z.redSqr(), _ = w.redSub(b).redISub(b), f = e.redSub(r).redISub(i).redMul(_), n = w.redMul(h.redSub(i)), u = w.redMul(_));
  } else
    h = r.redAdd(i), b = this.curve._mulC(this.z).redSqr(), _ = h.redSub(b).redSub(b), f = this.curve._mulC(e.redISub(h)).redMul(_), n = this.curve._mulC(h).redMul(r.redISub(i)), u = h.redMul(_);
  return this.curve.point(f, n, u);
};
we.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
we.prototype._extAdd = function(e) {
  var r = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), i = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), f = this.t.redMul(this.curve.dd).redMul(e.t), n = this.z.redMul(e.z.redAdd(e.z)), u = i.redSub(r), h = n.redSub(f), b = n.redAdd(f), _ = i.redAdd(r), w = u.redMul(h), E = b.redMul(_), P = u.redMul(_), F = h.redMul(b);
  return this.curve.point(w, E, F, P);
};
we.prototype._projAdd = function(e) {
  var r = this.z.redMul(e.z), i = r.redSqr(), f = this.x.redMul(e.x), n = this.y.redMul(e.y), u = this.curve.d.redMul(f).redMul(n), h = i.redSub(u), b = i.redAdd(u), _ = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(f).redISub(n), w = r.redMul(h).redMul(_), E, P;
  return this.curve.twisted ? (E = r.redMul(b).redMul(n.redSub(this.curve._mulA(f))), P = h.redMul(b)) : (E = r.redMul(b).redMul(n.redSub(f)), P = this.curve._mulC(h).redMul(b)), this.curve.point(w, E, P);
};
we.prototype.add = function(e) {
  return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
};
we.prototype.mul = function(e) {
  return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
};
we.prototype.mulAdd = function(e, r, i) {
  return this.curve._wnafMulAdd(1, [this, r], [e, i], 2, !1);
};
we.prototype.jmulAdd = function(e, r, i) {
  return this.curve._wnafMulAdd(1, [this, r], [e, i], 2, !0);
};
we.prototype.normalize = function() {
  if (this.zOne)
    return this;
  var e = this.z.redInvm();
  return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this;
};
we.prototype.neg = function() {
  return this.curve.point(
    this.x.redNeg(),
    this.y,
    this.z,
    this.t && this.t.redNeg()
  );
};
we.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
we.prototype.getY = function() {
  return this.normalize(), this.y.fromRed();
};
we.prototype.eq = function(e) {
  return this === e || this.getX().cmp(e.getX()) === 0 && this.getY().cmp(e.getY()) === 0;
};
we.prototype.eqXToP = function(e) {
  var r = e.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(r) === 0)
    return !0;
  for (var i = e.clone(), f = this.curve.redN.redMul(this.z); ; ) {
    if (i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0)
      return !1;
    if (r.redIAdd(f), this.x.cmp(r) === 0)
      return !0;
  }
};
we.prototype.toP = we.prototype.normalize;
we.prototype.mixedAdd = we.prototype.add;
(function(t) {
  var e = t;
  e.base = Ur, e.short = Aa, e.mont = Ba, e.edwards = Ta;
})(en);
var zr = {}, Kr = {}, oe = {}, Ca = Vt, Na = ze;
oe.inherits = Na;
function Fa(t, e) {
  return (t.charCodeAt(e) & 64512) !== 55296 || e < 0 || e + 1 >= t.length ? !1 : (t.charCodeAt(e + 1) & 64512) === 56320;
}
function La(t, e) {
  if (Array.isArray(t))
    return t.slice();
  if (!t)
    return [];
  var r = [];
  if (typeof t == "string")
    if (e) {
      if (e === "hex")
        for (t = t.replace(/[^a-z0-9]+/ig, ""), t.length % 2 !== 0 && (t = "0" + t), f = 0; f < t.length; f += 2)
          r.push(parseInt(t[f] + t[f + 1], 16));
    } else
      for (var i = 0, f = 0; f < t.length; f++) {
        var n = t.charCodeAt(f);
        n < 128 ? r[i++] = n : n < 2048 ? (r[i++] = n >> 6 | 192, r[i++] = n & 63 | 128) : Fa(t, f) ? (n = 65536 + ((n & 1023) << 10) + (t.charCodeAt(++f) & 1023), r[i++] = n >> 18 | 240, r[i++] = n >> 12 & 63 | 128, r[i++] = n >> 6 & 63 | 128, r[i++] = n & 63 | 128) : (r[i++] = n >> 12 | 224, r[i++] = n >> 6 & 63 | 128, r[i++] = n & 63 | 128);
      }
  else
    for (f = 0; f < t.length; f++)
      r[f] = t[f] | 0;
  return r;
}
oe.toArray = La;
function Oa(t) {
  for (var e = "", r = 0; r < t.length; r++)
    e += ff(t[r].toString(16));
  return e;
}
oe.toHex = Oa;
function nf(t) {
  var e = t >>> 24 | t >>> 8 & 65280 | t << 8 & 16711680 | (t & 255) << 24;
  return e >>> 0;
}
oe.htonl = nf;
function $a(t, e) {
  for (var r = "", i = 0; i < t.length; i++) {
    var f = t[i];
    e === "little" && (f = nf(f)), r += af(f.toString(16));
  }
  return r;
}
oe.toHex32 = $a;
function ff(t) {
  return t.length === 1 ? "0" + t : t;
}
oe.zero2 = ff;
function af(t) {
  return t.length === 7 ? "0" + t : t.length === 6 ? "00" + t : t.length === 5 ? "000" + t : t.length === 4 ? "0000" + t : t.length === 3 ? "00000" + t : t.length === 2 ? "000000" + t : t.length === 1 ? "0000000" + t : t;
}
oe.zero8 = af;
function ka(t, e, r, i) {
  var f = r - e;
  Ca(f % 4 === 0);
  for (var n = new Array(f / 4), u = 0, h = e; u < n.length; u++, h += 4) {
    var b;
    i === "big" ? b = t[h] << 24 | t[h + 1] << 16 | t[h + 2] << 8 | t[h + 3] : b = t[h + 3] << 24 | t[h + 2] << 16 | t[h + 1] << 8 | t[h], n[u] = b >>> 0;
  }
  return n;
}
oe.join32 = ka;
function Ua(t, e) {
  for (var r = new Array(t.length * 4), i = 0, f = 0; i < t.length; i++, f += 4) {
    var n = t[i];
    e === "big" ? (r[f] = n >>> 24, r[f + 1] = n >>> 16 & 255, r[f + 2] = n >>> 8 & 255, r[f + 3] = n & 255) : (r[f + 3] = n >>> 24, r[f + 2] = n >>> 16 & 255, r[f + 1] = n >>> 8 & 255, r[f] = n & 255);
  }
  return r;
}
oe.split32 = Ua;
function Da(t, e) {
  return t >>> e | t << 32 - e;
}
oe.rotr32 = Da;
function qa(t, e) {
  return t << e | t >>> 32 - e;
}
oe.rotl32 = qa;
function za(t, e) {
  return t + e >>> 0;
}
oe.sum32 = za;
function Ka(t, e, r) {
  return t + e + r >>> 0;
}
oe.sum32_3 = Ka;
function Ha(t, e, r, i) {
  return t + e + r + i >>> 0;
}
oe.sum32_4 = Ha;
function Wa(t, e, r, i, f) {
  return t + e + r + i + f >>> 0;
}
oe.sum32_5 = Wa;
function ja(t, e, r, i) {
  var f = t[e], n = t[e + 1], u = i + n >>> 0, h = (u < i ? 1 : 0) + r + f;
  t[e] = h >>> 0, t[e + 1] = u;
}
oe.sum64 = ja;
function Va(t, e, r, i) {
  var f = e + i >>> 0, n = (f < e ? 1 : 0) + t + r;
  return n >>> 0;
}
oe.sum64_hi = Va;
function Ya(t, e, r, i) {
  var f = e + i;
  return f >>> 0;
}
oe.sum64_lo = Ya;
function Ga(t, e, r, i, f, n, u, h) {
  var b = 0, _ = e;
  _ = _ + i >>> 0, b += _ < e ? 1 : 0, _ = _ + n >>> 0, b += _ < n ? 1 : 0, _ = _ + h >>> 0, b += _ < h ? 1 : 0;
  var w = t + r + f + u + b;
  return w >>> 0;
}
oe.sum64_4_hi = Ga;
function Za(t, e, r, i, f, n, u, h) {
  var b = e + i + n + h;
  return b >>> 0;
}
oe.sum64_4_lo = Za;
function Ja(t, e, r, i, f, n, u, h, b, _) {
  var w = 0, E = e;
  E = E + i >>> 0, w += E < e ? 1 : 0, E = E + n >>> 0, w += E < n ? 1 : 0, E = E + h >>> 0, w += E < h ? 1 : 0, E = E + _ >>> 0, w += E < _ ? 1 : 0;
  var P = t + r + f + u + b + w;
  return P >>> 0;
}
oe.sum64_5_hi = Ja;
function Xa(t, e, r, i, f, n, u, h, b, _) {
  var w = e + i + n + h + _;
  return w >>> 0;
}
oe.sum64_5_lo = Xa;
function Qa(t, e, r) {
  var i = e << 32 - r | t >>> r;
  return i >>> 0;
}
oe.rotr64_hi = Qa;
function e0(t, e, r) {
  var i = t << 32 - r | e >>> r;
  return i >>> 0;
}
oe.rotr64_lo = e0;
function t0(t, e, r) {
  return t >>> r;
}
oe.shr64_hi = t0;
function r0(t, e, r) {
  var i = t << 32 - r | e >>> r;
  return i >>> 0;
}
oe.shr64_lo = r0;
var or = {}, gn = oe, i0 = Vt;
function Hr() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
or.BlockHash = Hr;
Hr.prototype.update = function(e, r) {
  if (e = gn.toArray(e, r), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
    e = this.pending;
    var i = e.length % this._delta8;
    this.pending = e.slice(e.length - i, e.length), this.pending.length === 0 && (this.pending = null), e = gn.join32(e, 0, e.length - i, this.endian);
    for (var f = 0; f < e.length; f += this._delta32)
      this._update(e, f, f + this._delta32);
  }
  return this;
};
Hr.prototype.digest = function(e) {
  return this.update(this._pad()), i0(this.pending === null), this._digest(e);
};
Hr.prototype._pad = function() {
  var e = this.pendingTotal, r = this._delta8, i = r - (e + this.padLength) % r, f = new Array(i + this.padLength);
  f[0] = 128;
  for (var n = 1; n < i; n++)
    f[n] = 0;
  if (e <<= 3, this.endian === "big") {
    for (var u = 8; u < this.padLength; u++)
      f[n++] = 0;
    f[n++] = 0, f[n++] = 0, f[n++] = 0, f[n++] = 0, f[n++] = e >>> 24 & 255, f[n++] = e >>> 16 & 255, f[n++] = e >>> 8 & 255, f[n++] = e & 255;
  } else
    for (f[n++] = e & 255, f[n++] = e >>> 8 & 255, f[n++] = e >>> 16 & 255, f[n++] = e >>> 24 & 255, f[n++] = 0, f[n++] = 0, f[n++] = 0, f[n++] = 0, u = 8; u < this.padLength; u++)
      f[n++] = 0;
  return f;
};
var dr = {}, Et = {}, n0 = oe, gt = n0.rotr32;
function f0(t, e, r, i) {
  if (t === 0)
    return sf(e, r, i);
  if (t === 1 || t === 3)
    return df(e, r, i);
  if (t === 2)
    return of(e, r, i);
}
Et.ft_1 = f0;
function sf(t, e, r) {
  return t & e ^ ~t & r;
}
Et.ch32 = sf;
function of(t, e, r) {
  return t & e ^ t & r ^ e & r;
}
Et.maj32 = of;
function df(t, e, r) {
  return t ^ e ^ r;
}
Et.p32 = df;
function a0(t) {
  return gt(t, 2) ^ gt(t, 13) ^ gt(t, 22);
}
Et.s0_256 = a0;
function s0(t) {
  return gt(t, 6) ^ gt(t, 11) ^ gt(t, 25);
}
Et.s1_256 = s0;
function o0(t) {
  return gt(t, 7) ^ gt(t, 18) ^ t >>> 3;
}
Et.g0_256 = o0;
function d0(t) {
  return gt(t, 17) ^ gt(t, 19) ^ t >>> 10;
}
Et.g1_256 = d0;
var tr = oe, h0 = or, c0 = Et, Ei = tr.rotl32, lr = tr.sum32, u0 = tr.sum32_5, l0 = c0.ft_1, hf = h0.BlockHash, b0 = [
  1518500249,
  1859775393,
  2400959708,
  3395469782
];
function wt() {
  if (!(this instanceof wt))
    return new wt();
  hf.call(this), this.h = [
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ], this.W = new Array(80);
}
tr.inherits(wt, hf);
var p0 = wt;
wt.blockSize = 512;
wt.outSize = 160;
wt.hmacStrength = 80;
wt.padLength = 64;
wt.prototype._update = function(e, r) {
  for (var i = this.W, f = 0; f < 16; f++)
    i[f] = e[r + f];
  for (; f < i.length; f++)
    i[f] = Ei(i[f - 3] ^ i[f - 8] ^ i[f - 14] ^ i[f - 16], 1);
  var n = this.h[0], u = this.h[1], h = this.h[2], b = this.h[3], _ = this.h[4];
  for (f = 0; f < i.length; f++) {
    var w = ~~(f / 20), E = u0(Ei(n, 5), l0(w, u, h, b), _, i[f], b0[w]);
    _ = b, b = h, h = Ei(u, 30), u = n, n = E;
  }
  this.h[0] = lr(this.h[0], n), this.h[1] = lr(this.h[1], u), this.h[2] = lr(this.h[2], h), this.h[3] = lr(this.h[3], b), this.h[4] = lr(this.h[4], _);
};
wt.prototype._digest = function(e) {
  return e === "hex" ? tr.toHex32(this.h, "big") : tr.split32(this.h, "big");
};
var rr = oe, v0 = or, hr = Et, y0 = Vt, ht = rr.sum32, g0 = rr.sum32_4, x0 = rr.sum32_5, m0 = hr.ch32, w0 = hr.maj32, _0 = hr.s0_256, M0 = hr.s1_256, S0 = hr.g0_256, E0 = hr.g1_256, cf = v0.BlockHash, A0 = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
function _t() {
  if (!(this instanceof _t))
    return new _t();
  cf.call(this), this.h = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ], this.k = A0, this.W = new Array(64);
}
rr.inherits(_t, cf);
var uf = _t;
_t.blockSize = 512;
_t.outSize = 256;
_t.hmacStrength = 192;
_t.padLength = 64;
_t.prototype._update = function(e, r) {
  for (var i = this.W, f = 0; f < 16; f++)
    i[f] = e[r + f];
  for (; f < i.length; f++)
    i[f] = g0(E0(i[f - 2]), i[f - 7], S0(i[f - 15]), i[f - 16]);
  var n = this.h[0], u = this.h[1], h = this.h[2], b = this.h[3], _ = this.h[4], w = this.h[5], E = this.h[6], P = this.h[7];
  for (y0(this.k.length === i.length), f = 0; f < i.length; f++) {
    var F = x0(P, M0(_), m0(_, w, E), this.k[f], i[f]), N = ht(_0(n), w0(n, u, h));
    P = E, E = w, w = _, _ = ht(b, F), b = h, h = u, u = n, n = ht(F, N);
  }
  this.h[0] = ht(this.h[0], n), this.h[1] = ht(this.h[1], u), this.h[2] = ht(this.h[2], h), this.h[3] = ht(this.h[3], b), this.h[4] = ht(this.h[4], _), this.h[5] = ht(this.h[5], w), this.h[6] = ht(this.h[6], E), this.h[7] = ht(this.h[7], P);
};
_t.prototype._digest = function(e) {
  return e === "hex" ? rr.toHex32(this.h, "big") : rr.split32(this.h, "big");
};
var Hi = oe, lf = uf;
function It() {
  if (!(this instanceof It))
    return new It();
  lf.call(this), this.h = [
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
  ];
}
Hi.inherits(It, lf);
var I0 = It;
It.blockSize = 512;
It.outSize = 224;
It.hmacStrength = 192;
It.padLength = 64;
It.prototype._digest = function(e) {
  return e === "hex" ? Hi.toHex32(this.h.slice(0, 7), "big") : Hi.split32(this.h.slice(0, 7), "big");
};
var et = oe, B0 = or, R0 = Vt, xt = et.rotr64_hi, mt = et.rotr64_lo, bf = et.shr64_hi, pf = et.shr64_lo, Ct = et.sum64, Ai = et.sum64_hi, Ii = et.sum64_lo, P0 = et.sum64_4_hi, T0 = et.sum64_4_lo, C0 = et.sum64_5_hi, N0 = et.sum64_5_lo, vf = B0.BlockHash, F0 = [
  1116352408,
  3609767458,
  1899447441,
  602891725,
  3049323471,
  3964484399,
  3921009573,
  2173295548,
  961987163,
  4081628472,
  1508970993,
  3053834265,
  2453635748,
  2937671579,
  2870763221,
  3664609560,
  3624381080,
  2734883394,
  310598401,
  1164996542,
  607225278,
  1323610764,
  1426881987,
  3590304994,
  1925078388,
  4068182383,
  2162078206,
  991336113,
  2614888103,
  633803317,
  3248222580,
  3479774868,
  3835390401,
  2666613458,
  4022224774,
  944711139,
  264347078,
  2341262773,
  604807628,
  2007800933,
  770255983,
  1495990901,
  1249150122,
  1856431235,
  1555081692,
  3175218132,
  1996064986,
  2198950837,
  2554220882,
  3999719339,
  2821834349,
  766784016,
  2952996808,
  2566594879,
  3210313671,
  3203337956,
  3336571891,
  1034457026,
  3584528711,
  2466948901,
  113926993,
  3758326383,
  338241895,
  168717936,
  666307205,
  1188179964,
  773529912,
  1546045734,
  1294757372,
  1522805485,
  1396182291,
  2643833823,
  1695183700,
  2343527390,
  1986661051,
  1014477480,
  2177026350,
  1206759142,
  2456956037,
  344077627,
  2730485921,
  1290863460,
  2820302411,
  3158454273,
  3259730800,
  3505952657,
  3345764771,
  106217008,
  3516065817,
  3606008344,
  3600352804,
  1432725776,
  4094571909,
  1467031594,
  275423344,
  851169720,
  430227734,
  3100823752,
  506948616,
  1363258195,
  659060556,
  3750685593,
  883997877,
  3785050280,
  958139571,
  3318307427,
  1322822218,
  3812723403,
  1537002063,
  2003034995,
  1747873779,
  3602036899,
  1955562222,
  1575990012,
  2024104815,
  1125592928,
  2227730452,
  2716904306,
  2361852424,
  442776044,
  2428436474,
  593698344,
  2756734187,
  3733110249,
  3204031479,
  2999351573,
  3329325298,
  3815920427,
  3391569614,
  3928383900,
  3515267271,
  566280711,
  3940187606,
  3454069534,
  4118630271,
  4000239992,
  116418474,
  1914138554,
  174292421,
  2731055270,
  289380356,
  3203993006,
  460393269,
  320620315,
  685471733,
  587496836,
  852142971,
  1086792851,
  1017036298,
  365543100,
  1126000580,
  2618297676,
  1288033470,
  3409855158,
  1501505948,
  4234509866,
  1607167915,
  987167468,
  1816402316,
  1246189591
];
function ct() {
  if (!(this instanceof ct))
    return new ct();
  vf.call(this), this.h = [
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ], this.k = F0, this.W = new Array(160);
}
et.inherits(ct, vf);
var yf = ct;
ct.blockSize = 1024;
ct.outSize = 512;
ct.hmacStrength = 192;
ct.padLength = 128;
ct.prototype._prepareBlock = function(e, r) {
  for (var i = this.W, f = 0; f < 32; f++)
    i[f] = e[r + f];
  for (; f < i.length; f += 2) {
    var n = W0(i[f - 4], i[f - 3]), u = j0(i[f - 4], i[f - 3]), h = i[f - 14], b = i[f - 13], _ = K0(i[f - 30], i[f - 29]), w = H0(i[f - 30], i[f - 29]), E = i[f - 32], P = i[f - 31];
    i[f] = P0(
      n,
      u,
      h,
      b,
      _,
      w,
      E,
      P
    ), i[f + 1] = T0(
      n,
      u,
      h,
      b,
      _,
      w,
      E,
      P
    );
  }
};
ct.prototype._update = function(e, r) {
  this._prepareBlock(e, r);
  var i = this.W, f = this.h[0], n = this.h[1], u = this.h[2], h = this.h[3], b = this.h[4], _ = this.h[5], w = this.h[6], E = this.h[7], P = this.h[8], F = this.h[9], N = this.h[10], O = this.h[11], D = this.h[12], k = this.h[13], z = this.h[14], j = this.h[15];
  R0(this.k.length === i.length);
  for (var K = 0; K < i.length; K += 2) {
    var Y = z, Q = j, se = q0(P, F), re = z0(P, F), V = L0(P, F, N, O, D), Me = O0(P, F, N, O, D, k), A = this.k[K], a = this.k[K + 1], c = i[K], p = i[K + 1], v = C0(
      Y,
      Q,
      se,
      re,
      V,
      Me,
      A,
      a,
      c,
      p
    ), M = N0(
      Y,
      Q,
      se,
      re,
      V,
      Me,
      A,
      a,
      c,
      p
    );
    Y = U0(f, n), Q = D0(f, n), se = $0(f, n, u, h, b), re = k0(f, n, u, h, b, _);
    var B = Ai(Y, Q, se, re), C = Ii(Y, Q, se, re);
    z = D, j = k, D = N, k = O, N = P, O = F, P = Ai(w, E, v, M), F = Ii(E, E, v, M), w = b, E = _, b = u, _ = h, u = f, h = n, f = Ai(v, M, B, C), n = Ii(v, M, B, C);
  }
  Ct(this.h, 0, f, n), Ct(this.h, 2, u, h), Ct(this.h, 4, b, _), Ct(this.h, 6, w, E), Ct(this.h, 8, P, F), Ct(this.h, 10, N, O), Ct(this.h, 12, D, k), Ct(this.h, 14, z, j);
};
ct.prototype._digest = function(e) {
  return e === "hex" ? et.toHex32(this.h, "big") : et.split32(this.h, "big");
};
function L0(t, e, r, i, f) {
  var n = t & r ^ ~t & f;
  return n < 0 && (n += 4294967296), n;
}
function O0(t, e, r, i, f, n) {
  var u = e & i ^ ~e & n;
  return u < 0 && (u += 4294967296), u;
}
function $0(t, e, r, i, f) {
  var n = t & r ^ t & f ^ r & f;
  return n < 0 && (n += 4294967296), n;
}
function k0(t, e, r, i, f, n) {
  var u = e & i ^ e & n ^ i & n;
  return u < 0 && (u += 4294967296), u;
}
function U0(t, e) {
  var r = xt(t, e, 28), i = xt(e, t, 2), f = xt(e, t, 7), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function D0(t, e) {
  var r = mt(t, e, 28), i = mt(e, t, 2), f = mt(e, t, 7), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function q0(t, e) {
  var r = xt(t, e, 14), i = xt(t, e, 18), f = xt(e, t, 9), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function z0(t, e) {
  var r = mt(t, e, 14), i = mt(t, e, 18), f = mt(e, t, 9), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function K0(t, e) {
  var r = xt(t, e, 1), i = xt(t, e, 8), f = bf(t, e, 7), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function H0(t, e) {
  var r = mt(t, e, 1), i = mt(t, e, 8), f = pf(t, e, 7), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function W0(t, e) {
  var r = xt(t, e, 19), i = xt(e, t, 29), f = bf(t, e, 6), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
function j0(t, e) {
  var r = mt(t, e, 19), i = mt(e, t, 29), f = pf(t, e, 6), n = r ^ i ^ f;
  return n < 0 && (n += 4294967296), n;
}
var Wi = oe, gf = yf;
function Bt() {
  if (!(this instanceof Bt))
    return new Bt();
  gf.call(this), this.h = [
    3418070365,
    3238371032,
    1654270250,
    914150663,
    2438529370,
    812702999,
    355462360,
    4144912697,
    1731405415,
    4290775857,
    2394180231,
    1750603025,
    3675008525,
    1694076839,
    1203062813,
    3204075428
  ];
}
Wi.inherits(Bt, gf);
var V0 = Bt;
Bt.blockSize = 1024;
Bt.outSize = 384;
Bt.hmacStrength = 192;
Bt.padLength = 128;
Bt.prototype._digest = function(e) {
  return e === "hex" ? Wi.toHex32(this.h.slice(0, 12), "big") : Wi.split32(this.h.slice(0, 12), "big");
};
dr.sha1 = p0;
dr.sha224 = I0;
dr.sha256 = uf;
dr.sha384 = V0;
dr.sha512 = yf;
var xf = {}, Wt = oe, Y0 = or, Tr = Wt.rotl32, xn = Wt.sum32, br = Wt.sum32_3, mn = Wt.sum32_4, mf = Y0.BlockHash;
function Mt() {
  if (!(this instanceof Mt))
    return new Mt();
  mf.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
Wt.inherits(Mt, mf);
xf.ripemd160 = Mt;
Mt.blockSize = 512;
Mt.outSize = 160;
Mt.hmacStrength = 192;
Mt.padLength = 64;
Mt.prototype._update = function(e, r) {
  for (var i = this.h[0], f = this.h[1], n = this.h[2], u = this.h[3], h = this.h[4], b = i, _ = f, w = n, E = u, P = h, F = 0; F < 80; F++) {
    var N = xn(
      Tr(
        mn(i, wn(F, f, n, u), e[J0[F] + r], G0(F)),
        Q0[F]
      ),
      h
    );
    i = h, h = u, u = Tr(n, 10), n = f, f = N, N = xn(
      Tr(
        mn(b, wn(79 - F, _, w, E), e[X0[F] + r], Z0(F)),
        es[F]
      ),
      P
    ), b = P, P = E, E = Tr(w, 10), w = _, _ = N;
  }
  N = br(this.h[1], n, E), this.h[1] = br(this.h[2], u, P), this.h[2] = br(this.h[3], h, b), this.h[3] = br(this.h[4], i, _), this.h[4] = br(this.h[0], f, w), this.h[0] = N;
};
Mt.prototype._digest = function(e) {
  return e === "hex" ? Wt.toHex32(this.h, "little") : Wt.split32(this.h, "little");
};
function wn(t, e, r, i) {
  return t <= 15 ? e ^ r ^ i : t <= 31 ? e & r | ~e & i : t <= 47 ? (e | ~r) ^ i : t <= 63 ? e & i | r & ~i : e ^ (r | ~i);
}
function G0(t) {
  return t <= 15 ? 0 : t <= 31 ? 1518500249 : t <= 47 ? 1859775393 : t <= 63 ? 2400959708 : 2840853838;
}
function Z0(t) {
  return t <= 15 ? 1352829926 : t <= 31 ? 1548603684 : t <= 47 ? 1836072691 : t <= 63 ? 2053994217 : 0;
}
var J0 = [
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
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8,
  3,
  10,
  14,
  4,
  9,
  15,
  8,
  1,
  2,
  7,
  0,
  6,
  13,
  11,
  5,
  12,
  1,
  9,
  11,
  10,
  0,
  8,
  12,
  4,
  13,
  3,
  7,
  15,
  14,
  5,
  6,
  2,
  4,
  0,
  5,
  9,
  7,
  12,
  2,
  10,
  14,
  1,
  3,
  8,
  11,
  6,
  15,
  13
], X0 = [
  5,
  14,
  7,
  0,
  9,
  2,
  11,
  4,
  13,
  6,
  15,
  8,
  1,
  10,
  3,
  12,
  6,
  11,
  3,
  7,
  0,
  13,
  5,
  10,
  14,
  15,
  8,
  12,
  4,
  9,
  1,
  2,
  15,
  5,
  1,
  3,
  7,
  14,
  6,
  9,
  11,
  8,
  12,
  2,
  10,
  0,
  4,
  13,
  8,
  6,
  4,
  1,
  3,
  11,
  15,
  0,
  5,
  12,
  2,
  13,
  9,
  7,
  10,
  14,
  12,
  15,
  10,
  4,
  1,
  5,
  8,
  7,
  6,
  2,
  13,
  14,
  0,
  3,
  9,
  11
], Q0 = [
  11,
  14,
  15,
  12,
  5,
  8,
  7,
  9,
  11,
  13,
  14,
  15,
  6,
  7,
  9,
  8,
  7,
  6,
  8,
  13,
  11,
  9,
  7,
  15,
  7,
  12,
  15,
  9,
  11,
  7,
  13,
  12,
  11,
  13,
  6,
  7,
  14,
  9,
  13,
  15,
  14,
  8,
  13,
  6,
  5,
  12,
  7,
  5,
  11,
  12,
  14,
  15,
  14,
  15,
  9,
  8,
  9,
  14,
  5,
  6,
  8,
  6,
  5,
  12,
  9,
  15,
  5,
  11,
  6,
  8,
  13,
  12,
  5,
  12,
  13,
  14,
  11,
  8,
  5,
  6
], es = [
  8,
  9,
  9,
  11,
  13,
  15,
  15,
  5,
  7,
  7,
  8,
  11,
  14,
  14,
  12,
  6,
  9,
  13,
  15,
  7,
  12,
  8,
  9,
  11,
  7,
  7,
  12,
  7,
  6,
  15,
  13,
  11,
  9,
  7,
  15,
  11,
  8,
  6,
  6,
  14,
  12,
  13,
  5,
  14,
  13,
  13,
  7,
  5,
  15,
  5,
  8,
  11,
  14,
  14,
  6,
  14,
  6,
  9,
  12,
  9,
  12,
  5,
  15,
  8,
  8,
  5,
  12,
  9,
  12,
  5,
  14,
  6,
  8,
  13,
  6,
  5,
  15,
  13,
  11,
  11
], ts = oe, rs = Vt;
function ir(t, e, r) {
  if (!(this instanceof ir))
    return new ir(t, e, r);
  this.Hash = t, this.blockSize = t.blockSize / 8, this.outSize = t.outSize / 8, this.inner = null, this.outer = null, this._init(ts.toArray(e, r));
}
var is = ir;
ir.prototype._init = function(e) {
  e.length > this.blockSize && (e = new this.Hash().update(e).digest()), rs(e.length <= this.blockSize);
  for (var r = e.length; r < this.blockSize; r++)
    e.push(0);
  for (r = 0; r < e.length; r++)
    e[r] ^= 54;
  for (this.inner = new this.Hash().update(e), r = 0; r < e.length; r++)
    e[r] ^= 106;
  this.outer = new this.Hash().update(e);
};
ir.prototype.update = function(e, r) {
  return this.inner.update(e, r), this;
};
ir.prototype.digest = function(e) {
  return this.outer.update(this.inner.digest()), this.outer.digest(e);
};
(function(t) {
  var e = t;
  e.utils = oe, e.common = or, e.sha = dr, e.ripemd = xf, e.hmac = is, e.sha1 = e.sha.sha1, e.sha256 = e.sha.sha256, e.sha224 = e.sha.sha224, e.sha384 = e.sha.sha384, e.sha512 = e.sha.sha512, e.ripemd160 = e.ripemd.ripemd160;
})(Kr);
var Bi, _n;
function ns() {
  return _n || (_n = 1, Bi = {
    doubles: {
      step: 4,
      points: [
        [
          "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
          "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
        ],
        [
          "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
          "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
        ],
        [
          "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
          "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
        ],
        [
          "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
          "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
        ],
        [
          "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
          "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
        ],
        [
          "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
          "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
        ],
        [
          "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
          "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
        ],
        [
          "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
          "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
        ],
        [
          "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
          "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
        ],
        [
          "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
          "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
        ],
        [
          "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
          "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
        ],
        [
          "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
          "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
        ],
        [
          "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
          "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
        ],
        [
          "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
          "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
        ],
        [
          "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
          "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
        ],
        [
          "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
          "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
        ],
        [
          "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
          "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
        ],
        [
          "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
          "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
        ],
        [
          "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
          "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
        ],
        [
          "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
          "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
        ],
        [
          "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
          "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
        ],
        [
          "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
          "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
        ],
        [
          "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
          "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
        ],
        [
          "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
          "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
        ],
        [
          "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
          "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
        ],
        [
          "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
          "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
        ],
        [
          "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
          "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
        ],
        [
          "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
          "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
        ],
        [
          "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
          "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
        ],
        [
          "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
          "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
        ],
        [
          "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
          "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
        ],
        [
          "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
          "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
        ],
        [
          "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
          "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
        ],
        [
          "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
          "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
        ],
        [
          "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
          "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
        ],
        [
          "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
          "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
        ],
        [
          "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
          "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
        ],
        [
          "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
          "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
        ],
        [
          "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
          "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
        ],
        [
          "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
          "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
        ],
        [
          "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
          "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
        ],
        [
          "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
          "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
        ],
        [
          "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
          "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
        ],
        [
          "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
          "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
        ],
        [
          "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
          "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
        ],
        [
          "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
          "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
        ],
        [
          "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
          "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
        ],
        [
          "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
          "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
        ],
        [
          "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
          "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
        ],
        [
          "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
          "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
        ],
        [
          "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
          "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
        ],
        [
          "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
          "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
        ],
        [
          "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
          "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
        ],
        [
          "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
          "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
        ],
        [
          "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
          "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
        ],
        [
          "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
          "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
        ],
        [
          "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
          "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
        ],
        [
          "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
          "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
        ],
        [
          "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
          "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
        ],
        [
          "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
          "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
        ],
        [
          "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
          "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
        ],
        [
          "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
          "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
        ],
        [
          "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
          "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
        ],
        [
          "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
          "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
        ],
        [
          "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
          "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
        ]
      ]
    },
    naf: {
      wnd: 7,
      points: [
        [
          "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
          "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
        ],
        [
          "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
          "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
        ],
        [
          "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
          "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
        ],
        [
          "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
          "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
        ],
        [
          "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
          "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
        ],
        [
          "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
          "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
        ],
        [
          "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
          "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
        ],
        [
          "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
          "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
        ],
        [
          "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
          "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
        ],
        [
          "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
          "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
        ],
        [
          "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
          "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
        ],
        [
          "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
          "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
        ],
        [
          "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
          "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
        ],
        [
          "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
          "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
        ],
        [
          "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
          "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
        ],
        [
          "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
          "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
        ],
        [
          "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
          "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
        ],
        [
          "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
          "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
        ],
        [
          "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
          "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
        ],
        [
          "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
          "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
        ],
        [
          "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
          "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
        ],
        [
          "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
          "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
        ],
        [
          "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
          "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
        ],
        [
          "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
          "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
        ],
        [
          "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
          "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
        ],
        [
          "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
          "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
        ],
        [
          "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
          "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
        ],
        [
          "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
          "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
        ],
        [
          "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
          "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
        ],
        [
          "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
          "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
        ],
        [
          "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
          "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
        ],
        [
          "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
          "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
        ],
        [
          "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
          "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
        ],
        [
          "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
          "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
        ],
        [
          "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
          "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
        ],
        [
          "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
          "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
        ],
        [
          "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
          "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
        ],
        [
          "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
          "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
        ],
        [
          "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
          "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
        ],
        [
          "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
          "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
        ],
        [
          "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
          "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
        ],
        [
          "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
          "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
        ],
        [
          "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
          "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
        ],
        [
          "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
          "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
        ],
        [
          "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
          "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
        ],
        [
          "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
          "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
        ],
        [
          "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
          "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
        ],
        [
          "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
          "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
        ],
        [
          "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
          "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
        ],
        [
          "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
          "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
        ],
        [
          "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
          "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
        ],
        [
          "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
          "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
        ],
        [
          "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
          "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
        ],
        [
          "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
          "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
        ],
        [
          "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
          "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
        ],
        [
          "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
          "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
        ],
        [
          "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
          "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
        ],
        [
          "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
          "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
        ],
        [
          "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
          "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
        ],
        [
          "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
          "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
        ],
        [
          "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
          "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
        ],
        [
          "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
          "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
        ],
        [
          "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
          "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
        ],
        [
          "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
          "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
        ],
        [
          "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
          "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
        ],
        [
          "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
          "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
        ],
        [
          "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
          "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
        ],
        [
          "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
          "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
        ],
        [
          "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
          "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
        ],
        [
          "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
          "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
        ],
        [
          "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
          "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
        ],
        [
          "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
          "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
        ],
        [
          "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
          "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
        ],
        [
          "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
          "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
        ],
        [
          "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
          "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
        ],
        [
          "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
          "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
        ],
        [
          "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
          "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
        ],
        [
          "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
          "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
        ],
        [
          "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
          "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
        ],
        [
          "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
          "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
        ],
        [
          "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
          "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
        ],
        [
          "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
          "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
        ],
        [
          "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
          "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
        ],
        [
          "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
          "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
        ],
        [
          "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
          "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
        ],
        [
          "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
          "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
        ],
        [
          "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
          "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
        ],
        [
          "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
          "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
        ],
        [
          "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
          "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
        ],
        [
          "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
          "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
        ],
        [
          "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
          "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
        ],
        [
          "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
          "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
        ],
        [
          "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
          "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
        ],
        [
          "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
          "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
        ],
        [
          "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
          "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
        ],
        [
          "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
          "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
        ],
        [
          "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
          "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
        ],
        [
          "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
          "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
        ],
        [
          "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
          "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
        ],
        [
          "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
          "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
        ],
        [
          "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
          "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
        ],
        [
          "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
          "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
        ],
        [
          "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
          "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
        ],
        [
          "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
          "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
        ],
        [
          "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
          "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
        ],
        [
          "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
          "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
        ],
        [
          "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
          "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
        ],
        [
          "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
          "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
        ],
        [
          "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
          "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
        ],
        [
          "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
          "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
        ],
        [
          "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
          "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
        ],
        [
          "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
          "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
        ],
        [
          "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
          "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
        ],
        [
          "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
          "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
        ],
        [
          "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
          "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
        ],
        [
          "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
          "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
        ],
        [
          "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
          "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
        ],
        [
          "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
          "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
        ],
        [
          "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
          "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
        ],
        [
          "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
          "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
        ],
        [
          "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
          "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
        ],
        [
          "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
          "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
        ],
        [
          "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
          "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
        ],
        [
          "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
          "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
        ],
        [
          "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
          "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
        ],
        [
          "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
          "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
        ],
        [
          "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
          "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
        ]
      ]
    }
  }), Bi;
}
(function(t) {
  var e = t, r = Kr, i = en, f = rt, n = f.assert;
  function u(_) {
    _.type === "short" ? this.curve = new i.short(_) : _.type === "edwards" ? this.curve = new i.edwards(_) : this.curve = new i.mont(_), this.g = this.curve.g, this.n = this.curve.n, this.hash = _.hash, n(this.g.validate(), "Invalid curve"), n(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
  }
  e.PresetCurve = u;
  function h(_, w) {
    Object.defineProperty(e, _, {
      configurable: !0,
      enumerable: !0,
      get: function() {
        var E = new u(w);
        return Object.defineProperty(e, _, {
          configurable: !0,
          enumerable: !0,
          value: E
        }), E;
      }
    });
  }
  h("p192", {
    type: "short",
    prime: "p192",
    p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
    b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
    n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
    hash: r.sha256,
    gRed: !1,
    g: [
      "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
      "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
    ]
  }), h("p224", {
    type: "short",
    prime: "p224",
    p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
    b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
    n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
    hash: r.sha256,
    gRed: !1,
    g: [
      "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
      "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
    ]
  }), h("p256", {
    type: "short",
    prime: null,
    p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
    a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
    b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
    n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
    hash: r.sha256,
    gRed: !1,
    g: [
      "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
      "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
    ]
  }), h("p384", {
    type: "short",
    prime: null,
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
    a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
    b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
    n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
    hash: r.sha384,
    gRed: !1,
    g: [
      "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
      "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
    ]
  }), h("p521", {
    type: "short",
    prime: null,
    p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
    a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
    b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
    n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
    hash: r.sha512,
    gRed: !1,
    g: [
      "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
      "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
    ]
  }), h("curve25519", {
    type: "mont",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "76d06",
    b: "1",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: r.sha256,
    gRed: !1,
    g: [
      "9"
    ]
  }), h("ed25519", {
    type: "edwards",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "-1",
    c: "1",
    // -121665 * (121666^(-1)) (mod P)
    d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: r.sha256,
    gRed: !1,
    g: [
      "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
      // 4/5
      "6666666666666666666666666666666666666666666666666666666666666658"
    ]
  });
  var b;
  try {
    b = ns();
  } catch {
    b = void 0;
  }
  h("secp256k1", {
    type: "short",
    prime: "k256",
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
    a: "0",
    b: "7",
    n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
    h: "1",
    hash: r.sha256,
    // Precomputed endomorphism
    beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
    lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
    basis: [
      {
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      },
      {
        a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
        b: "3086d221a7d46bcde86c90e49284eb15"
      }
    ],
    gRed: !1,
    g: [
      "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
      "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
      b
    ]
  });
})(zr);
var fs = Kr, qt = Xi, wf = Vt;
function Lt(t) {
  if (!(this instanceof Lt))
    return new Lt(t);
  this.hash = t.hash, this.predResist = !!t.predResist, this.outLen = this.hash.outSize, this.minEntropy = t.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var e = qt.toArray(t.entropy, t.entropyEnc || "hex"), r = qt.toArray(t.nonce, t.nonceEnc || "hex"), i = qt.toArray(t.pers, t.persEnc || "hex");
  wf(
    e.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._init(e, r, i);
}
var as = Lt;
Lt.prototype._init = function(e, r, i) {
  var f = e.concat(r).concat(i);
  this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
  for (var n = 0; n < this.V.length; n++)
    this.K[n] = 0, this.V[n] = 1;
  this._update(f), this._reseed = 1, this.reseedInterval = 281474976710656;
};
Lt.prototype._hmac = function() {
  return new fs.hmac(this.hash, this.K);
};
Lt.prototype._update = function(e) {
  var r = this._hmac().update(this.V).update([0]);
  e && (r = r.update(e)), this.K = r.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest());
};
Lt.prototype.reseed = function(e, r, i, f) {
  typeof r != "string" && (f = i, i = r, r = null), e = qt.toArray(e, r), i = qt.toArray(i, f), wf(
    e.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._update(e.concat(i || [])), this._reseed = 1;
};
Lt.prototype.generate = function(e, r, i, f) {
  if (this._reseed > this.reseedInterval)
    throw new Error("Reseed is required");
  typeof r != "string" && (f = i, i = r, r = null), i && (i = qt.toArray(i, f || "hex"), this._update(i));
  for (var n = []; n.length < e; )
    this.V = this._hmac().update(this.V).digest(), n = n.concat(this.V);
  var u = n.slice(0, e);
  return this._update(i), this._reseed++, qt.encode(u, r);
};
var ss = Pt, os = rt, ji = os.assert;
function Xe(t, e) {
  this.ec = t, this.priv = null, this.pub = null, e.priv && this._importPrivate(e.priv, e.privEnc), e.pub && this._importPublic(e.pub, e.pubEnc);
}
var ds = Xe;
Xe.fromPublic = function(e, r, i) {
  return r instanceof Xe ? r : new Xe(e, {
    pub: r,
    pubEnc: i
  });
};
Xe.fromPrivate = function(e, r, i) {
  return r instanceof Xe ? r : new Xe(e, {
    priv: r,
    privEnc: i
  });
};
Xe.prototype.validate = function() {
  var e = this.getPublic();
  return e.isInfinity() ? { result: !1, reason: "Invalid public key" } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" };
};
Xe.prototype.getPublic = function(e, r) {
  return typeof e == "string" && (r = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), r ? this.pub.encode(r, e) : this.pub;
};
Xe.prototype.getPrivate = function(e) {
  return e === "hex" ? this.priv.toString(16, 2) : this.priv;
};
Xe.prototype._importPrivate = function(e, r) {
  this.priv = new ss(e, r || 16), this.priv = this.priv.umod(this.ec.curve.n);
};
Xe.prototype._importPublic = function(e, r) {
  if (e.x || e.y) {
    this.ec.curve.type === "mont" ? ji(e.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && ji(e.x && e.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(e.x, e.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(e, r);
};
Xe.prototype.derive = function(e) {
  return e.validate() || ji(e.validate(), "public point not validated"), e.mul(this.priv).getX();
};
Xe.prototype.sign = function(e, r, i) {
  return this.ec.sign(e, this, r, i);
};
Xe.prototype.verify = function(e, r) {
  return this.ec.verify(e, r, this);
};
Xe.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var Or = Pt, rn = rt, hs = rn.assert;
function Wr(t, e) {
  if (t instanceof Wr)
    return t;
  this._importDER(t, e) || (hs(t.r && t.s, "Signature without r or s"), this.r = new Or(t.r, 16), this.s = new Or(t.s, 16), t.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = t.recoveryParam);
}
var cs = Wr;
function us() {
  this.place = 0;
}
function Ri(t, e) {
  var r = t[e.place++];
  if (!(r & 128))
    return r;
  var i = r & 15;
  if (i === 0 || i > 4)
    return !1;
  for (var f = 0, n = 0, u = e.place; n < i; n++, u++)
    f <<= 8, f |= t[u], f >>>= 0;
  return f <= 127 ? !1 : (e.place = u, f);
}
function Mn(t) {
  for (var e = 0, r = t.length - 1; !t[e] && !(t[e + 1] & 128) && e < r; )
    e++;
  return e === 0 ? t : t.slice(e);
}
Wr.prototype._importDER = function(e, r) {
  e = rn.toArray(e, r);
  var i = new us();
  if (e[i.place++] !== 48)
    return !1;
  var f = Ri(e, i);
  if (f === !1 || f + i.place !== e.length || e[i.place++] !== 2)
    return !1;
  var n = Ri(e, i);
  if (n === !1)
    return !1;
  var u = e.slice(i.place, n + i.place);
  if (i.place += n, e[i.place++] !== 2)
    return !1;
  var h = Ri(e, i);
  if (h === !1 || e.length !== h + i.place)
    return !1;
  var b = e.slice(i.place, h + i.place);
  if (u[0] === 0)
    if (u[1] & 128)
      u = u.slice(1);
    else
      return !1;
  if (b[0] === 0)
    if (b[1] & 128)
      b = b.slice(1);
    else
      return !1;
  return this.r = new Or(u), this.s = new Or(b), this.recoveryParam = null, !0;
};
function Pi(t, e) {
  if (e < 128) {
    t.push(e);
    return;
  }
  var r = 1 + (Math.log(e) / Math.LN2 >>> 3);
  for (t.push(r | 128); --r; )
    t.push(e >>> (r << 3) & 255);
  t.push(e);
}
Wr.prototype.toDER = function(e) {
  var r = this.r.toArray(), i = this.s.toArray();
  for (r[0] & 128 && (r = [0].concat(r)), i[0] & 128 && (i = [0].concat(i)), r = Mn(r), i = Mn(i); !i[0] && !(i[1] & 128); )
    i = i.slice(1);
  var f = [2];
  Pi(f, r.length), f = f.concat(r), f.push(2), Pi(f, i.length);
  var n = f.concat(i), u = [48];
  return Pi(u, n.length), u = u.concat(n), rn.encode(u, e);
};
var zt = Pt, _f = as, ls = rt, Ti = zr, bs = ef, Mf = ls.assert, nn = ds, jr = cs;
function ft(t) {
  if (!(this instanceof ft))
    return new ft(t);
  typeof t == "string" && (Mf(
    Object.prototype.hasOwnProperty.call(Ti, t),
    "Unknown curve " + t
  ), t = Ti[t]), t instanceof Ti.PresetCurve && (t = { curve: t }), this.curve = t.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = t.curve.g, this.g.precompute(t.curve.n.bitLength() + 1), this.hash = t.hash || t.curve.hash;
}
var ps = ft;
ft.prototype.keyPair = function(e) {
  return new nn(this, e);
};
ft.prototype.keyFromPrivate = function(e, r) {
  return nn.fromPrivate(this, e, r);
};
ft.prototype.keyFromPublic = function(e, r) {
  return nn.fromPublic(this, e, r);
};
ft.prototype.genKeyPair = function(e) {
  e || (e = {});
  for (var r = new _f({
    hash: this.hash,
    pers: e.pers,
    persEnc: e.persEnc || "utf8",
    entropy: e.entropy || bs(this.hash.hmacStrength),
    entropyEnc: e.entropy && e.entropyEnc || "utf8",
    nonce: this.n.toArray()
  }), i = this.n.byteLength(), f = this.n.sub(new zt(2)); ; ) {
    var n = new zt(r.generate(i));
    if (!(n.cmp(f) > 0))
      return n.iaddn(1), this.keyFromPrivate(n);
  }
};
ft.prototype._truncateToN = function(e, r) {
  var i = e.byteLength() * 8 - this.n.bitLength();
  return i > 0 && (e = e.ushrn(i)), !r && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
};
ft.prototype.sign = function(e, r, i, f) {
  typeof i == "object" && (f = i, i = null), f || (f = {}), r = this.keyFromPrivate(r, i), e = this._truncateToN(new zt(e, 16));
  for (var n = this.n.byteLength(), u = r.getPrivate().toArray("be", n), h = e.toArray("be", n), b = new _f({
    hash: this.hash,
    entropy: u,
    nonce: h,
    pers: f.pers,
    persEnc: f.persEnc || "utf8"
  }), _ = this.n.sub(new zt(1)), w = 0; ; w++) {
    var E = f.k ? f.k(w) : new zt(b.generate(this.n.byteLength()));
    if (E = this._truncateToN(E, !0), !(E.cmpn(1) <= 0 || E.cmp(_) >= 0)) {
      var P = this.g.mul(E);
      if (!P.isInfinity()) {
        var F = P.getX(), N = F.umod(this.n);
        if (N.cmpn(0) !== 0) {
          var O = E.invm(this.n).mul(N.mul(r.getPrivate()).iadd(e));
          if (O = O.umod(this.n), O.cmpn(0) !== 0) {
            var D = (P.getY().isOdd() ? 1 : 0) | (F.cmp(N) !== 0 ? 2 : 0);
            return f.canonical && O.cmp(this.nh) > 0 && (O = this.n.sub(O), D ^= 1), new jr({ r: N, s: O, recoveryParam: D });
          }
        }
      }
    }
  }
};
ft.prototype.verify = function(e, r, i, f) {
  e = this._truncateToN(new zt(e, 16)), i = this.keyFromPublic(i, f), r = new jr(r, "hex");
  var n = r.r, u = r.s;
  if (n.cmpn(1) < 0 || n.cmp(this.n) >= 0 || u.cmpn(1) < 0 || u.cmp(this.n) >= 0)
    return !1;
  var h = u.invm(this.n), b = h.mul(e).umod(this.n), _ = h.mul(n).umod(this.n), w;
  return this.curve._maxwellTrick ? (w = this.g.jmulAdd(b, i.getPublic(), _), w.isInfinity() ? !1 : w.eqXToP(n)) : (w = this.g.mulAdd(b, i.getPublic(), _), w.isInfinity() ? !1 : w.getX().umod(this.n).cmp(n) === 0);
};
ft.prototype.recoverPubKey = function(t, e, r, i) {
  Mf((3 & r) === r, "The recovery param is more than two bits"), e = new jr(e, i);
  var f = this.n, n = new zt(t), u = e.r, h = e.s, b = r & 1, _ = r >> 1;
  if (u.cmp(this.curve.p.umod(this.curve.n)) >= 0 && _)
    throw new Error("Unable to find sencond key candinate");
  _ ? u = this.curve.pointFromX(u.add(this.curve.n), b) : u = this.curve.pointFromX(u, b);
  var w = e.r.invm(f), E = f.sub(n).mul(w).umod(f), P = h.mul(w).umod(f);
  return this.g.mulAdd(E, u, P);
};
ft.prototype.getKeyRecoveryParam = function(t, e, r, i) {
  if (e = new jr(e, i), e.recoveryParam !== null)
    return e.recoveryParam;
  for (var f = 0; f < 4; f++) {
    var n;
    try {
      n = this.recoverPubKey(t, e, f);
    } catch {
      continue;
    }
    if (n.eq(r))
      return f;
  }
  throw new Error("Unable to find valid recovery factor");
};
var Er = rt, Sf = Er.assert, Sn = Er.parseBytes, cr = Er.cachedProperty;
function He(t, e) {
  this.eddsa = t, this._secret = Sn(e.secret), t.isPoint(e.pub) ? this._pub = e.pub : this._pubBytes = Sn(e.pub);
}
He.fromPublic = function(e, r) {
  return r instanceof He ? r : new He(e, { pub: r });
};
He.fromSecret = function(e, r) {
  return r instanceof He ? r : new He(e, { secret: r });
};
He.prototype.secret = function() {
  return this._secret;
};
cr(He, "pubBytes", function() {
  return this.eddsa.encodePoint(this.pub());
});
cr(He, "pub", function() {
  return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
cr(He, "privBytes", function() {
  var e = this.eddsa, r = this.hash(), i = e.encodingLength - 1, f = r.slice(0, e.encodingLength);
  return f[0] &= 248, f[i] &= 127, f[i] |= 64, f;
});
cr(He, "priv", function() {
  return this.eddsa.decodeInt(this.privBytes());
});
cr(He, "hash", function() {
  return this.eddsa.hash().update(this.secret()).digest();
});
cr(He, "messagePrefix", function() {
  return this.hash().slice(this.eddsa.encodingLength);
});
He.prototype.sign = function(e) {
  return Sf(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this);
};
He.prototype.verify = function(e, r) {
  return this.eddsa.verify(e, r, this);
};
He.prototype.getSecret = function(e) {
  return Sf(this._secret, "KeyPair is public only"), Er.encode(this.secret(), e);
};
He.prototype.getPublic = function(e) {
  return Er.encode(this.pubBytes(), e);
};
var vs = He, ys = Pt, Vr = rt, gs = Vr.assert, Yr = Vr.cachedProperty, xs = Vr.parseBytes;
function Yt(t, e) {
  this.eddsa = t, typeof e != "object" && (e = xs(e)), Array.isArray(e) && (e = {
    R: e.slice(0, t.encodingLength),
    S: e.slice(t.encodingLength)
  }), gs(e.R && e.S, "Signature without R or S"), t.isPoint(e.R) && (this._R = e.R), e.S instanceof ys && (this._S = e.S), this._Rencoded = Array.isArray(e.R) ? e.R : e.Rencoded, this._Sencoded = Array.isArray(e.S) ? e.S : e.Sencoded;
}
Yr(Yt, "S", function() {
  return this.eddsa.decodeInt(this.Sencoded());
});
Yr(Yt, "R", function() {
  return this.eddsa.decodePoint(this.Rencoded());
});
Yr(Yt, "Rencoded", function() {
  return this.eddsa.encodePoint(this.R());
});
Yr(Yt, "Sencoded", function() {
  return this.eddsa.encodeInt(this.S());
});
Yt.prototype.toBytes = function() {
  return this.Rencoded().concat(this.Sencoded());
};
Yt.prototype.toHex = function() {
  return Vr.encode(this.toBytes(), "hex").toUpperCase();
};
var ms = Yt, ws = Kr, _s = zr, nr = rt, Ms = nr.assert, Ef = nr.parseBytes, Af = vs, En = ms;
function tt(t) {
  if (Ms(t === "ed25519", "only tested with ed25519 so far"), !(this instanceof tt))
    return new tt(t);
  t = _s[t].curve, this.curve = t, this.g = t.g, this.g.precompute(t.n.bitLength() + 1), this.pointClass = t.point().constructor, this.encodingLength = Math.ceil(t.n.bitLength() / 8), this.hash = ws.sha512;
}
var Ss = tt;
tt.prototype.sign = function(e, r) {
  e = Ef(e);
  var i = this.keyFromSecret(r), f = this.hashInt(i.messagePrefix(), e), n = this.g.mul(f), u = this.encodePoint(n), h = this.hashInt(u, i.pubBytes(), e).mul(i.priv()), b = f.add(h).umod(this.curve.n);
  return this.makeSignature({ R: n, S: b, Rencoded: u });
};
tt.prototype.verify = function(e, r, i) {
  e = Ef(e), r = this.makeSignature(r);
  var f = this.keyFromPublic(i), n = this.hashInt(r.Rencoded(), f.pubBytes(), e), u = this.g.mul(r.S()), h = r.R().add(f.pub().mul(n));
  return h.eq(u);
};
tt.prototype.hashInt = function() {
  for (var e = this.hash(), r = 0; r < arguments.length; r++)
    e.update(arguments[r]);
  return nr.intFromLE(e.digest()).umod(this.curve.n);
};
tt.prototype.keyFromPublic = function(e) {
  return Af.fromPublic(this, e);
};
tt.prototype.keyFromSecret = function(e) {
  return Af.fromSecret(this, e);
};
tt.prototype.makeSignature = function(e) {
  return e instanceof En ? e : new En(this, e);
};
tt.prototype.encodePoint = function(e) {
  var r = e.getY().toArray("le", this.encodingLength);
  return r[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, r;
};
tt.prototype.decodePoint = function(e) {
  e = nr.parseBytes(e);
  var r = e.length - 1, i = e.slice(0, r).concat(e[r] & -129), f = (e[r] & 128) !== 0, n = nr.intFromLE(i);
  return this.curve.pointFromY(n, f);
};
tt.prototype.encodeInt = function(e) {
  return e.toArray("le", this.encodingLength);
};
tt.prototype.decodeInt = function(e) {
  return nr.intFromLE(e);
};
tt.prototype.isPoint = function(e) {
  return e instanceof this.pointClass;
};
(function(t) {
  var e = t;
  e.version = ma.version, e.utils = rt, e.rand = ef, e.curve = en, e.curves = zr, e.ec = ps, e.eddsa = Ss;
})(Xn);
const Es = Xn.ec, vt = new Es("secp256k1"), de = vt.curve, xe = de.n.constructor;
function As(t, e) {
  let r = new xe(e);
  if (r.cmp(de.p) >= 0)
    return null;
  r = r.toRed(de.red);
  let i = r.redSqr().redIMul(r).redIAdd(de.b).redSqrt();
  return t === 3 !== i.isOdd() && (i = i.redNeg()), vt.keyPair({ pub: { x: r, y: i } });
}
function Is(t, e, r) {
  let i = new xe(e), f = new xe(r);
  if (i.cmp(de.p) >= 0 || f.cmp(de.p) >= 0 || (i = i.toRed(de.red), f = f.toRed(de.red), (t === 6 || t === 7) && f.isOdd() !== (t === 7)))
    return null;
  const n = i.redSqr().redIMul(i);
  return f.redSqr().redISub(n.redIAdd(de.b)).isZero() ? vt.keyPair({ pub: { x: i, y: f } }) : null;
}
function Nt(t) {
  const e = t[0];
  switch (e) {
    case 2:
    case 3:
      return t.length !== 33 ? null : As(e, t.subarray(1, 33));
    case 4:
    case 6:
    case 7:
      return t.length !== 65 ? null : Is(e, t.subarray(1, 33), t.subarray(33, 65));
    default:
      return null;
  }
}
function Dt(t, e) {
  const r = e.encode(null, t.length === 33);
  for (let i = 0; i < t.length; ++i)
    t[i] = r[i];
}
var Bs = {
  contextRandomize() {
    return 0;
  },
  privateKeyVerify(t) {
    const e = new xe(t);
    return e.cmp(de.n) < 0 && !e.isZero() ? 0 : 1;
  },
  privateKeyNegate(t) {
    const e = new xe(t), r = de.n.sub(e).umod(de.n).toArrayLike(Uint8Array, "be", 32);
    return t.set(r), 0;
  },
  privateKeyTweakAdd(t, e) {
    const r = new xe(e);
    if (r.cmp(de.n) >= 0 || (r.iadd(new xe(t)), r.cmp(de.n) >= 0 && r.isub(de.n), r.isZero()))
      return 1;
    const i = r.toArrayLike(Uint8Array, "be", 32);
    return t.set(i), 0;
  },
  privateKeyTweakMul(t, e) {
    let r = new xe(e);
    if (r.cmp(de.n) >= 0 || r.isZero())
      return 1;
    r.imul(new xe(t)), r.cmp(de.n) >= 0 && (r = r.umod(de.n));
    const i = r.toArrayLike(Uint8Array, "be", 32);
    return t.set(i), 0;
  },
  publicKeyVerify(t) {
    return Nt(t) === null ? 1 : 0;
  },
  publicKeyCreate(t, e) {
    const r = new xe(e);
    if (r.cmp(de.n) >= 0 || r.isZero())
      return 1;
    const i = vt.keyFromPrivate(e).getPublic();
    return Dt(t, i), 0;
  },
  publicKeyConvert(t, e) {
    const r = Nt(e);
    if (r === null)
      return 1;
    const i = r.getPublic();
    return Dt(t, i), 0;
  },
  publicKeyNegate(t, e) {
    const r = Nt(e);
    if (r === null)
      return 1;
    const i = r.getPublic();
    return i.y = i.y.redNeg(), Dt(t, i), 0;
  },
  publicKeyCombine(t, e) {
    const r = new Array(e.length);
    for (let f = 0; f < e.length; ++f)
      if (r[f] = Nt(e[f]), r[f] === null)
        return 1;
    let i = r[0].getPublic();
    for (let f = 1; f < r.length; ++f)
      i = i.add(r[f].pub);
    return i.isInfinity() ? 2 : (Dt(t, i), 0);
  },
  publicKeyTweakAdd(t, e, r) {
    const i = Nt(e);
    if (i === null)
      return 1;
    if (r = new xe(r), r.cmp(de.n) >= 0)
      return 2;
    const f = i.getPublic().add(de.g.mul(r));
    return f.isInfinity() ? 2 : (Dt(t, f), 0);
  },
  publicKeyTweakMul(t, e, r) {
    const i = Nt(e);
    if (i === null)
      return 1;
    if (r = new xe(r), r.cmp(de.n) >= 0 || r.isZero())
      return 2;
    const f = i.getPublic().mul(r);
    return Dt(t, f), 0;
  },
  signatureNormalize(t) {
    const e = new xe(t.subarray(0, 32)), r = new xe(t.subarray(32, 64));
    return e.cmp(de.n) >= 0 || r.cmp(de.n) >= 0 ? 1 : (r.cmp(vt.nh) === 1 && t.set(de.n.sub(r).toArrayLike(Uint8Array, "be", 32), 32), 0);
  },
  // Copied 1-to-1 from https://github.com/bitcoinjs/bip66/blob/master/index.js
  // Adapted for Uint8Array instead Buffer
  signatureExport(t, e) {
    const r = e.subarray(0, 32), i = e.subarray(32, 64);
    if (new xe(r).cmp(de.n) >= 0 || new xe(i).cmp(de.n) >= 0)
      return 1;
    const { output: f } = t;
    let n = f.subarray(4, 4 + 33);
    n[0] = 0, n.set(r, 1);
    let u = 33, h = 0;
    for (; u > 1 && n[h] === 0 && !(n[h + 1] & 128); --u, ++h)
      ;
    if (n = n.subarray(h), n[0] & 128 || u > 1 && n[0] === 0 && !(n[1] & 128))
      return 1;
    let b = f.subarray(6 + 33, 6 + 33 + 33);
    b[0] = 0, b.set(i, 1);
    let _ = 33, w = 0;
    for (; _ > 1 && b[w] === 0 && !(b[w + 1] & 128); --_, ++w)
      ;
    return b = b.subarray(w), b[0] & 128 || _ > 1 && b[0] === 0 && !(b[1] & 128) ? 1 : (t.outputlen = 6 + u + _, f[0] = 48, f[1] = t.outputlen - 2, f[2] = 2, f[3] = n.length, f.set(n, 4), f[4 + u] = 2, f[5 + u] = b.length, f.set(b, 6 + u), 0);
  },
  // Copied 1-to-1 from https://github.com/bitcoinjs/bip66/blob/master/index.js
  // Adapted for Uint8Array instead Buffer
  signatureImport(t, e) {
    if (e.length < 8 || e.length > 72 || e[0] !== 48 || e[1] !== e.length - 2 || e[2] !== 2)
      return 1;
    const r = e[3];
    if (r === 0 || 5 + r >= e.length || e[4 + r] !== 2)
      return 1;
    const i = e[5 + r];
    if (i === 0 || 6 + r + i !== e.length || e[4] & 128 || r > 1 && e[4] === 0 && !(e[5] & 128) || e[r + 6] & 128 || i > 1 && e[r + 6] === 0 && !(e[r + 7] & 128))
      return 1;
    let f = e.subarray(4, 4 + r);
    if (f.length === 33 && f[0] === 0 && (f = f.subarray(1)), f.length > 32)
      return 1;
    let n = e.subarray(6 + r);
    if (n.length === 33 && n[0] === 0 && (n = n.slice(1)), n.length > 32)
      throw new Error("S length is too long");
    let u = new xe(f);
    u.cmp(de.n) >= 0 && (u = new xe(0));
    let h = new xe(e.subarray(6 + r));
    return h.cmp(de.n) >= 0 && (h = new xe(0)), t.set(u.toArrayLike(Uint8Array, "be", 32), 0), t.set(h.toArrayLike(Uint8Array, "be", 32), 32), 0;
  },
  ecdsaSign(t, e, r, i, f) {
    if (f) {
      const h = f;
      f = (b) => {
        const _ = h(e, r, null, i, b);
        if (!(_ instanceof Uint8Array && _.length === 32))
          throw new Error("This is the way");
        return new xe(_);
      };
    }
    const n = new xe(r);
    if (n.cmp(de.n) >= 0 || n.isZero())
      return 1;
    let u;
    try {
      u = vt.sign(e, r, { canonical: !0, k: f, pers: i });
    } catch {
      return 1;
    }
    return t.signature.set(u.r.toArrayLike(Uint8Array, "be", 32), 0), t.signature.set(u.s.toArrayLike(Uint8Array, "be", 32), 32), t.recid = u.recoveryParam, 0;
  },
  ecdsaVerify(t, e, r) {
    const i = { r: t.subarray(0, 32), s: t.subarray(32, 64) }, f = new xe(i.r), n = new xe(i.s);
    if (f.cmp(de.n) >= 0 || n.cmp(de.n) >= 0)
      return 1;
    if (n.cmp(vt.nh) === 1 || f.isZero() || n.isZero())
      return 3;
    const u = Nt(r);
    if (u === null)
      return 2;
    const h = u.getPublic();
    return vt.verify(e, i, h) ? 0 : 3;
  },
  ecdsaRecover(t, e, r, i) {
    const f = { r: e.slice(0, 32), s: e.slice(32, 64) }, n = new xe(f.r), u = new xe(f.s);
    if (n.cmp(de.n) >= 0 || u.cmp(de.n) >= 0)
      return 1;
    if (n.isZero() || u.isZero())
      return 2;
    let h;
    try {
      h = vt.recoverPubKey(i, f, r);
    } catch {
      return 2;
    }
    return Dt(t, h), 0;
  },
  ecdh(t, e, r, i, f, n, u) {
    const h = Nt(e);
    if (h === null)
      return 1;
    const b = new xe(r);
    if (b.cmp(de.n) >= 0 || b.isZero())
      return 2;
    const _ = h.getPublic().mul(b);
    if (f === void 0) {
      const w = _.encode(null, !0), E = vt.hash().update(w).digest();
      for (let P = 0; P < 32; ++P)
        t[P] = E[P];
    } else {
      n || (n = new Uint8Array(32));
      const w = _.getX().toArray("be", 32);
      for (let N = 0; N < 32; ++N)
        n[N] = w[N];
      u || (u = new Uint8Array(32));
      const E = _.getY().toArray("be", 32);
      for (let N = 0; N < 32; ++N)
        u[N] = E[N];
      const P = f(n, u, i);
      if (!(P instanceof Uint8Array && P.length === t.length))
        return 2;
      t.set(P);
    }
    return 0;
  }
}, Rs = na(Bs);
const Qe = /* @__PURE__ */ Gn(Rs);
var Se = {}, Gr = {};
Gr.byteLength = Cs;
Gr.toByteArray = Fs;
Gr.fromByteArray = $s;
var yt = [], it = [], Ps = typeof Uint8Array < "u" ? Uint8Array : Array, Ci = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Jt = 0, Ts = Ci.length; Jt < Ts; ++Jt)
  yt[Jt] = Ci[Jt], it[Ci.charCodeAt(Jt)] = Jt;
it["-".charCodeAt(0)] = 62;
it["_".charCodeAt(0)] = 63;
function If(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var r = t.indexOf("=");
  r === -1 && (r = e);
  var i = r === e ? 0 : 4 - r % 4;
  return [r, i];
}
function Cs(t) {
  var e = If(t), r = e[0], i = e[1];
  return (r + i) * 3 / 4 - i;
}
function Ns(t, e, r) {
  return (e + r) * 3 / 4 - r;
}
function Fs(t) {
  var e, r = If(t), i = r[0], f = r[1], n = new Ps(Ns(t, i, f)), u = 0, h = f > 0 ? i - 4 : i, b;
  for (b = 0; b < h; b += 4)
    e = it[t.charCodeAt(b)] << 18 | it[t.charCodeAt(b + 1)] << 12 | it[t.charCodeAt(b + 2)] << 6 | it[t.charCodeAt(b + 3)], n[u++] = e >> 16 & 255, n[u++] = e >> 8 & 255, n[u++] = e & 255;
  return f === 2 && (e = it[t.charCodeAt(b)] << 2 | it[t.charCodeAt(b + 1)] >> 4, n[u++] = e & 255), f === 1 && (e = it[t.charCodeAt(b)] << 10 | it[t.charCodeAt(b + 1)] << 4 | it[t.charCodeAt(b + 2)] >> 2, n[u++] = e >> 8 & 255, n[u++] = e & 255), n;
}
function Ls(t) {
  return yt[t >> 18 & 63] + yt[t >> 12 & 63] + yt[t >> 6 & 63] + yt[t & 63];
}
function Os(t, e, r) {
  for (var i, f = [], n = e; n < r; n += 3)
    i = (t[n] << 16 & 16711680) + (t[n + 1] << 8 & 65280) + (t[n + 2] & 255), f.push(Ls(i));
  return f.join("");
}
function $s(t) {
  for (var e, r = t.length, i = r % 3, f = [], n = 16383, u = 0, h = r - i; u < h; u += n)
    f.push(Os(t, u, u + n > h ? h : u + n));
  return i === 1 ? (e = t[r - 1], f.push(
    yt[e >> 2] + yt[e << 4 & 63] + "=="
  )) : i === 2 && (e = (t[r - 2] << 8) + t[r - 1], f.push(
    yt[e >> 10] + yt[e >> 4 & 63] + yt[e << 2 & 63] + "="
  )), f.join("");
}
var fn = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
fn.read = function(t, e, r, i, f) {
  var n, u, h = f * 8 - i - 1, b = (1 << h) - 1, _ = b >> 1, w = -7, E = r ? f - 1 : 0, P = r ? -1 : 1, F = t[e + E];
  for (E += P, n = F & (1 << -w) - 1, F >>= -w, w += h; w > 0; n = n * 256 + t[e + E], E += P, w -= 8)
    ;
  for (u = n & (1 << -w) - 1, n >>= -w, w += i; w > 0; u = u * 256 + t[e + E], E += P, w -= 8)
    ;
  if (n === 0)
    n = 1 - _;
  else {
    if (n === b)
      return u ? NaN : (F ? -1 : 1) * (1 / 0);
    u = u + Math.pow(2, i), n = n - _;
  }
  return (F ? -1 : 1) * u * Math.pow(2, n - i);
};
fn.write = function(t, e, r, i, f, n) {
  var u, h, b, _ = n * 8 - f - 1, w = (1 << _) - 1, E = w >> 1, P = f === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, F = i ? 0 : n - 1, N = i ? 1 : -1, O = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (h = isNaN(e) ? 1 : 0, u = w) : (u = Math.floor(Math.log(e) / Math.LN2), e * (b = Math.pow(2, -u)) < 1 && (u--, b *= 2), u + E >= 1 ? e += P / b : e += P * Math.pow(2, 1 - E), e * b >= 2 && (u++, b /= 2), u + E >= w ? (h = 0, u = w) : u + E >= 1 ? (h = (e * b - 1) * Math.pow(2, f), u = u + E) : (h = e * Math.pow(2, E - 1) * Math.pow(2, f), u = 0)); f >= 8; t[r + F] = h & 255, F += N, h /= 256, f -= 8)
    ;
  for (u = u << f | h, _ += f; _ > 0; t[r + F] = u & 255, F += N, u /= 256, _ -= 8)
    ;
  t[r + F - N] |= O * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(t) {
  const e = Gr, r = fn, i = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  t.Buffer = h, t.SlowBuffer = z, t.INSPECT_MAX_BYTES = 50;
  const f = 2147483647;
  t.kMaxLength = f, h.TYPED_ARRAY_SUPPORT = n(), !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function n() {
    try {
      const l = new Uint8Array(1), s = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(s, Uint8Array.prototype), Object.setPrototypeOf(l, s), l.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(h.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (h.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(h.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (h.isBuffer(this))
        return this.byteOffset;
    }
  });
  function u(l) {
    if (l > f)
      throw new RangeError('The value "' + l + '" is invalid for option "size"');
    const s = new Uint8Array(l);
    return Object.setPrototypeOf(s, h.prototype), s;
  }
  function h(l, s, d) {
    if (typeof l == "number") {
      if (typeof s == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return E(l);
    }
    return b(l, s, d);
  }
  h.poolSize = 8192;
  function b(l, s, d) {
    if (typeof l == "string")
      return P(l, s);
    if (ArrayBuffer.isView(l))
      return N(l);
    if (l == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof l
      );
    if (he(l, ArrayBuffer) || l && he(l.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (he(l, SharedArrayBuffer) || l && he(l.buffer, SharedArrayBuffer)))
      return O(l, s, d);
    if (typeof l == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const y = l.valueOf && l.valueOf();
    if (y != null && y !== l)
      return h.from(y, s, d);
    const I = D(l);
    if (I)
      return I;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof l[Symbol.toPrimitive] == "function")
      return h.from(l[Symbol.toPrimitive]("string"), s, d);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof l
    );
  }
  h.from = function(l, s, d) {
    return b(l, s, d);
  }, Object.setPrototypeOf(h.prototype, Uint8Array.prototype), Object.setPrototypeOf(h, Uint8Array);
  function _(l) {
    if (typeof l != "number")
      throw new TypeError('"size" argument must be of type number');
    if (l < 0)
      throw new RangeError('The value "' + l + '" is invalid for option "size"');
  }
  function w(l, s, d) {
    return _(l), l <= 0 ? u(l) : s !== void 0 ? typeof d == "string" ? u(l).fill(s, d) : u(l).fill(s) : u(l);
  }
  h.alloc = function(l, s, d) {
    return w(l, s, d);
  };
  function E(l) {
    return _(l), u(l < 0 ? 0 : k(l) | 0);
  }
  h.allocUnsafe = function(l) {
    return E(l);
  }, h.allocUnsafeSlow = function(l) {
    return E(l);
  };
  function P(l, s) {
    if ((typeof s != "string" || s === "") && (s = "utf8"), !h.isEncoding(s))
      throw new TypeError("Unknown encoding: " + s);
    const d = j(l, s) | 0;
    let y = u(d);
    const I = y.write(l, s);
    return I !== d && (y = y.slice(0, I)), y;
  }
  function F(l) {
    const s = l.length < 0 ? 0 : k(l.length) | 0, d = u(s);
    for (let y = 0; y < s; y += 1)
      d[y] = l[y] & 255;
    return d;
  }
  function N(l) {
    if (he(l, Uint8Array)) {
      const s = new Uint8Array(l);
      return O(s.buffer, s.byteOffset, s.byteLength);
    }
    return F(l);
  }
  function O(l, s, d) {
    if (s < 0 || l.byteLength < s)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (l.byteLength < s + (d || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let y;
    return s === void 0 && d === void 0 ? y = new Uint8Array(l) : d === void 0 ? y = new Uint8Array(l, s) : y = new Uint8Array(l, s, d), Object.setPrototypeOf(y, h.prototype), y;
  }
  function D(l) {
    if (h.isBuffer(l)) {
      const s = k(l.length) | 0, d = u(s);
      return d.length === 0 || l.copy(d, 0, 0, s), d;
    }
    if (l.length !== void 0)
      return typeof l.length != "number" || bt(l.length) ? u(0) : F(l);
    if (l.type === "Buffer" && Array.isArray(l.data))
      return F(l.data);
  }
  function k(l) {
    if (l >= f)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + f.toString(16) + " bytes");
    return l | 0;
  }
  function z(l) {
    return +l != l && (l = 0), h.alloc(+l);
  }
  h.isBuffer = function(s) {
    return s != null && s._isBuffer === !0 && s !== h.prototype;
  }, h.compare = function(s, d) {
    if (he(s, Uint8Array) && (s = h.from(s, s.offset, s.byteLength)), he(d, Uint8Array) && (d = h.from(d, d.offset, d.byteLength)), !h.isBuffer(s) || !h.isBuffer(d))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (s === d)
      return 0;
    let y = s.length, I = d.length;
    for (let L = 0, $ = Math.min(y, I); L < $; ++L)
      if (s[L] !== d[L]) {
        y = s[L], I = d[L];
        break;
      }
    return y < I ? -1 : I < y ? 1 : 0;
  }, h.isEncoding = function(s) {
    switch (String(s).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, h.concat = function(s, d) {
    if (!Array.isArray(s))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (s.length === 0)
      return h.alloc(0);
    let y;
    if (d === void 0)
      for (d = 0, y = 0; y < s.length; ++y)
        d += s[y].length;
    const I = h.allocUnsafe(d);
    let L = 0;
    for (y = 0; y < s.length; ++y) {
      let $ = s[y];
      if (he($, Uint8Array))
        L + $.length > I.length ? (h.isBuffer($) || ($ = h.from($)), $.copy(I, L)) : Uint8Array.prototype.set.call(
          I,
          $,
          L
        );
      else if (h.isBuffer($))
        $.copy(I, L);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      L += $.length;
    }
    return I;
  };
  function j(l, s) {
    if (h.isBuffer(l))
      return l.length;
    if (ArrayBuffer.isView(l) || he(l, ArrayBuffer))
      return l.byteLength;
    if (typeof l != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof l
      );
    const d = l.length, y = arguments.length > 2 && arguments[2] === !0;
    if (!y && d === 0)
      return 0;
    let I = !1;
    for (; ; )
      switch (s) {
        case "ascii":
        case "latin1":
        case "binary":
          return d;
        case "utf8":
        case "utf-8":
          return ue(l).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return d * 2;
        case "hex":
          return d >>> 1;
        case "base64":
          return Tt(l).length;
        default:
          if (I)
            return y ? -1 : ue(l).length;
          s = ("" + s).toLowerCase(), I = !0;
      }
  }
  h.byteLength = j;
  function K(l, s, d) {
    let y = !1;
    if ((s === void 0 || s < 0) && (s = 0), s > this.length || ((d === void 0 || d > this.length) && (d = this.length), d <= 0) || (d >>>= 0, s >>>= 0, d <= s))
      return "";
    for (l || (l = "utf8"); ; )
      switch (l) {
        case "hex":
          return x(this, s, d);
        case "utf8":
        case "utf-8":
          return p(this, s, d);
        case "ascii":
          return B(this, s, d);
        case "latin1":
        case "binary":
          return C(this, s, d);
        case "base64":
          return c(this, s, d);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return o(this, s, d);
        default:
          if (y)
            throw new TypeError("Unknown encoding: " + l);
          l = (l + "").toLowerCase(), y = !0;
      }
  }
  h.prototype._isBuffer = !0;
  function Y(l, s, d) {
    const y = l[s];
    l[s] = l[d], l[d] = y;
  }
  h.prototype.swap16 = function() {
    const s = this.length;
    if (s % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let d = 0; d < s; d += 2)
      Y(this, d, d + 1);
    return this;
  }, h.prototype.swap32 = function() {
    const s = this.length;
    if (s % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let d = 0; d < s; d += 4)
      Y(this, d, d + 3), Y(this, d + 1, d + 2);
    return this;
  }, h.prototype.swap64 = function() {
    const s = this.length;
    if (s % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let d = 0; d < s; d += 8)
      Y(this, d, d + 7), Y(this, d + 1, d + 6), Y(this, d + 2, d + 5), Y(this, d + 3, d + 4);
    return this;
  }, h.prototype.toString = function() {
    const s = this.length;
    return s === 0 ? "" : arguments.length === 0 ? p(this, 0, s) : K.apply(this, arguments);
  }, h.prototype.toLocaleString = h.prototype.toString, h.prototype.equals = function(s) {
    if (!h.isBuffer(s))
      throw new TypeError("Argument must be a Buffer");
    return this === s ? !0 : h.compare(this, s) === 0;
  }, h.prototype.inspect = function() {
    let s = "";
    const d = t.INSPECT_MAX_BYTES;
    return s = this.toString("hex", 0, d).replace(/(.{2})/g, "$1 ").trim(), this.length > d && (s += " ... "), "<Buffer " + s + ">";
  }, i && (h.prototype[i] = h.prototype.inspect), h.prototype.compare = function(s, d, y, I, L) {
    if (he(s, Uint8Array) && (s = h.from(s, s.offset, s.byteLength)), !h.isBuffer(s))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof s
      );
    if (d === void 0 && (d = 0), y === void 0 && (y = s ? s.length : 0), I === void 0 && (I = 0), L === void 0 && (L = this.length), d < 0 || y > s.length || I < 0 || L > this.length)
      throw new RangeError("out of range index");
    if (I >= L && d >= y)
      return 0;
    if (I >= L)
      return -1;
    if (d >= y)
      return 1;
    if (d >>>= 0, y >>>= 0, I >>>= 0, L >>>= 0, this === s)
      return 0;
    let $ = L - I, te = y - d;
    const _e = Math.min($, te), fe = this.slice(I, L), ae = s.slice(d, y);
    for (let pe = 0; pe < _e; ++pe)
      if (fe[pe] !== ae[pe]) {
        $ = fe[pe], te = ae[pe];
        break;
      }
    return $ < te ? -1 : te < $ ? 1 : 0;
  };
  function Q(l, s, d, y, I) {
    if (l.length === 0)
      return -1;
    if (typeof d == "string" ? (y = d, d = 0) : d > 2147483647 ? d = 2147483647 : d < -2147483648 && (d = -2147483648), d = +d, bt(d) && (d = I ? 0 : l.length - 1), d < 0 && (d = l.length + d), d >= l.length) {
      if (I)
        return -1;
      d = l.length - 1;
    } else if (d < 0)
      if (I)
        d = 0;
      else
        return -1;
    if (typeof s == "string" && (s = h.from(s, y)), h.isBuffer(s))
      return s.length === 0 ? -1 : se(l, s, d, y, I);
    if (typeof s == "number")
      return s = s & 255, typeof Uint8Array.prototype.indexOf == "function" ? I ? Uint8Array.prototype.indexOf.call(l, s, d) : Uint8Array.prototype.lastIndexOf.call(l, s, d) : se(l, [s], d, y, I);
    throw new TypeError("val must be string, number or Buffer");
  }
  function se(l, s, d, y, I) {
    let L = 1, $ = l.length, te = s.length;
    if (y !== void 0 && (y = String(y).toLowerCase(), y === "ucs2" || y === "ucs-2" || y === "utf16le" || y === "utf-16le")) {
      if (l.length < 2 || s.length < 2)
        return -1;
      L = 2, $ /= 2, te /= 2, d /= 2;
    }
    function _e(ae, pe) {
      return L === 1 ? ae[pe] : ae.readUInt16BE(pe * L);
    }
    let fe;
    if (I) {
      let ae = -1;
      for (fe = d; fe < $; fe++)
        if (_e(l, fe) === _e(s, ae === -1 ? 0 : fe - ae)) {
          if (ae === -1 && (ae = fe), fe - ae + 1 === te)
            return ae * L;
        } else
          ae !== -1 && (fe -= fe - ae), ae = -1;
    } else
      for (d + te > $ && (d = $ - te), fe = d; fe >= 0; fe--) {
        let ae = !0;
        for (let pe = 0; pe < te; pe++)
          if (_e(l, fe + pe) !== _e(s, pe)) {
            ae = !1;
            break;
          }
        if (ae)
          return fe;
      }
    return -1;
  }
  h.prototype.includes = function(s, d, y) {
    return this.indexOf(s, d, y) !== -1;
  }, h.prototype.indexOf = function(s, d, y) {
    return Q(this, s, d, y, !0);
  }, h.prototype.lastIndexOf = function(s, d, y) {
    return Q(this, s, d, y, !1);
  };
  function re(l, s, d, y) {
    d = Number(d) || 0;
    const I = l.length - d;
    y ? (y = Number(y), y > I && (y = I)) : y = I;
    const L = s.length;
    y > L / 2 && (y = L / 2);
    let $;
    for ($ = 0; $ < y; ++$) {
      const te = parseInt(s.substr($ * 2, 2), 16);
      if (bt(te))
        return $;
      l[d + $] = te;
    }
    return $;
  }
  function V(l, s, d, y) {
    return ge(ue(s, l.length - d), l, d, y);
  }
  function Me(l, s, d, y) {
    return ge(ve(s), l, d, y);
  }
  function A(l, s, d, y) {
    return ge(Tt(s), l, d, y);
  }
  function a(l, s, d, y) {
    return ge(ye(s, l.length - d), l, d, y);
  }
  h.prototype.write = function(s, d, y, I) {
    if (d === void 0)
      I = "utf8", y = this.length, d = 0;
    else if (y === void 0 && typeof d == "string")
      I = d, y = this.length, d = 0;
    else if (isFinite(d))
      d = d >>> 0, isFinite(y) ? (y = y >>> 0, I === void 0 && (I = "utf8")) : (I = y, y = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const L = this.length - d;
    if ((y === void 0 || y > L) && (y = L), s.length > 0 && (y < 0 || d < 0) || d > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    I || (I = "utf8");
    let $ = !1;
    for (; ; )
      switch (I) {
        case "hex":
          return re(this, s, d, y);
        case "utf8":
        case "utf-8":
          return V(this, s, d, y);
        case "ascii":
        case "latin1":
        case "binary":
          return Me(this, s, d, y);
        case "base64":
          return A(this, s, d, y);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return a(this, s, d, y);
        default:
          if ($)
            throw new TypeError("Unknown encoding: " + I);
          I = ("" + I).toLowerCase(), $ = !0;
      }
  }, h.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function c(l, s, d) {
    return s === 0 && d === l.length ? e.fromByteArray(l) : e.fromByteArray(l.slice(s, d));
  }
  function p(l, s, d) {
    d = Math.min(l.length, d);
    const y = [];
    let I = s;
    for (; I < d; ) {
      const L = l[I];
      let $ = null, te = L > 239 ? 4 : L > 223 ? 3 : L > 191 ? 2 : 1;
      if (I + te <= d) {
        let _e, fe, ae, pe;
        switch (te) {
          case 1:
            L < 128 && ($ = L);
            break;
          case 2:
            _e = l[I + 1], (_e & 192) === 128 && (pe = (L & 31) << 6 | _e & 63, pe > 127 && ($ = pe));
            break;
          case 3:
            _e = l[I + 1], fe = l[I + 2], (_e & 192) === 128 && (fe & 192) === 128 && (pe = (L & 15) << 12 | (_e & 63) << 6 | fe & 63, pe > 2047 && (pe < 55296 || pe > 57343) && ($ = pe));
            break;
          case 4:
            _e = l[I + 1], fe = l[I + 2], ae = l[I + 3], (_e & 192) === 128 && (fe & 192) === 128 && (ae & 192) === 128 && (pe = (L & 15) << 18 | (_e & 63) << 12 | (fe & 63) << 6 | ae & 63, pe > 65535 && pe < 1114112 && ($ = pe));
        }
      }
      $ === null ? ($ = 65533, te = 1) : $ > 65535 && ($ -= 65536, y.push($ >>> 10 & 1023 | 55296), $ = 56320 | $ & 1023), y.push($), I += te;
    }
    return M(y);
  }
  const v = 4096;
  function M(l) {
    const s = l.length;
    if (s <= v)
      return String.fromCharCode.apply(String, l);
    let d = "", y = 0;
    for (; y < s; )
      d += String.fromCharCode.apply(
        String,
        l.slice(y, y += v)
      );
    return d;
  }
  function B(l, s, d) {
    let y = "";
    d = Math.min(l.length, d);
    for (let I = s; I < d; ++I)
      y += String.fromCharCode(l[I] & 127);
    return y;
  }
  function C(l, s, d) {
    let y = "";
    d = Math.min(l.length, d);
    for (let I = s; I < d; ++I)
      y += String.fromCharCode(l[I]);
    return y;
  }
  function x(l, s, d) {
    const y = l.length;
    (!s || s < 0) && (s = 0), (!d || d < 0 || d > y) && (d = y);
    let I = "";
    for (let L = s; L < d; ++L)
      I += me[l[L]];
    return I;
  }
  function o(l, s, d) {
    const y = l.slice(s, d);
    let I = "";
    for (let L = 0; L < y.length - 1; L += 2)
      I += String.fromCharCode(y[L] + y[L + 1] * 256);
    return I;
  }
  h.prototype.slice = function(s, d) {
    const y = this.length;
    s = ~~s, d = d === void 0 ? y : ~~d, s < 0 ? (s += y, s < 0 && (s = 0)) : s > y && (s = y), d < 0 ? (d += y, d < 0 && (d = 0)) : d > y && (d = y), d < s && (d = s);
    const I = this.subarray(s, d);
    return Object.setPrototypeOf(I, h.prototype), I;
  };
  function g(l, s, d) {
    if (l % 1 !== 0 || l < 0)
      throw new RangeError("offset is not uint");
    if (l + s > d)
      throw new RangeError("Trying to access beyond buffer length");
  }
  h.prototype.readUintLE = h.prototype.readUIntLE = function(s, d, y) {
    s = s >>> 0, d = d >>> 0, y || g(s, d, this.length);
    let I = this[s], L = 1, $ = 0;
    for (; ++$ < d && (L *= 256); )
      I += this[s + $] * L;
    return I;
  }, h.prototype.readUintBE = h.prototype.readUIntBE = function(s, d, y) {
    s = s >>> 0, d = d >>> 0, y || g(s, d, this.length);
    let I = this[s + --d], L = 1;
    for (; d > 0 && (L *= 256); )
      I += this[s + --d] * L;
    return I;
  }, h.prototype.readUint8 = h.prototype.readUInt8 = function(s, d) {
    return s = s >>> 0, d || g(s, 1, this.length), this[s];
  }, h.prototype.readUint16LE = h.prototype.readUInt16LE = function(s, d) {
    return s = s >>> 0, d || g(s, 2, this.length), this[s] | this[s + 1] << 8;
  }, h.prototype.readUint16BE = h.prototype.readUInt16BE = function(s, d) {
    return s = s >>> 0, d || g(s, 2, this.length), this[s] << 8 | this[s + 1];
  }, h.prototype.readUint32LE = h.prototype.readUInt32LE = function(s, d) {
    return s = s >>> 0, d || g(s, 4, this.length), (this[s] | this[s + 1] << 8 | this[s + 2] << 16) + this[s + 3] * 16777216;
  }, h.prototype.readUint32BE = h.prototype.readUInt32BE = function(s, d) {
    return s = s >>> 0, d || g(s, 4, this.length), this[s] * 16777216 + (this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3]);
  }, h.prototype.readBigUInt64LE = le(function(s) {
    s = s >>> 0, U(s, "offset");
    const d = this[s], y = this[s + 7];
    (d === void 0 || y === void 0) && G(s, this.length - 8);
    const I = d + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + this[++s] * 2 ** 24, L = this[++s] + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + y * 2 ** 24;
    return BigInt(I) + (BigInt(L) << BigInt(32));
  }), h.prototype.readBigUInt64BE = le(function(s) {
    s = s >>> 0, U(s, "offset");
    const d = this[s], y = this[s + 7];
    (d === void 0 || y === void 0) && G(s, this.length - 8);
    const I = d * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + this[++s], L = this[++s] * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + y;
    return (BigInt(I) << BigInt(32)) + BigInt(L);
  }), h.prototype.readIntLE = function(s, d, y) {
    s = s >>> 0, d = d >>> 0, y || g(s, d, this.length);
    let I = this[s], L = 1, $ = 0;
    for (; ++$ < d && (L *= 256); )
      I += this[s + $] * L;
    return L *= 128, I >= L && (I -= Math.pow(2, 8 * d)), I;
  }, h.prototype.readIntBE = function(s, d, y) {
    s = s >>> 0, d = d >>> 0, y || g(s, d, this.length);
    let I = d, L = 1, $ = this[s + --I];
    for (; I > 0 && (L *= 256); )
      $ += this[s + --I] * L;
    return L *= 128, $ >= L && ($ -= Math.pow(2, 8 * d)), $;
  }, h.prototype.readInt8 = function(s, d) {
    return s = s >>> 0, d || g(s, 1, this.length), this[s] & 128 ? (255 - this[s] + 1) * -1 : this[s];
  }, h.prototype.readInt16LE = function(s, d) {
    s = s >>> 0, d || g(s, 2, this.length);
    const y = this[s] | this[s + 1] << 8;
    return y & 32768 ? y | 4294901760 : y;
  }, h.prototype.readInt16BE = function(s, d) {
    s = s >>> 0, d || g(s, 2, this.length);
    const y = this[s + 1] | this[s] << 8;
    return y & 32768 ? y | 4294901760 : y;
  }, h.prototype.readInt32LE = function(s, d) {
    return s = s >>> 0, d || g(s, 4, this.length), this[s] | this[s + 1] << 8 | this[s + 2] << 16 | this[s + 3] << 24;
  }, h.prototype.readInt32BE = function(s, d) {
    return s = s >>> 0, d || g(s, 4, this.length), this[s] << 24 | this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3];
  }, h.prototype.readBigInt64LE = le(function(s) {
    s = s >>> 0, U(s, "offset");
    const d = this[s], y = this[s + 7];
    (d === void 0 || y === void 0) && G(s, this.length - 8);
    const I = this[s + 4] + this[s + 5] * 2 ** 8 + this[s + 6] * 2 ** 16 + (y << 24);
    return (BigInt(I) << BigInt(32)) + BigInt(d + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + this[++s] * 2 ** 24);
  }), h.prototype.readBigInt64BE = le(function(s) {
    s = s >>> 0, U(s, "offset");
    const d = this[s], y = this[s + 7];
    (d === void 0 || y === void 0) && G(s, this.length - 8);
    const I = (d << 24) + // Overflow
    this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + this[++s];
    return (BigInt(I) << BigInt(32)) + BigInt(this[++s] * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + y);
  }), h.prototype.readFloatLE = function(s, d) {
    return s = s >>> 0, d || g(s, 4, this.length), r.read(this, s, !0, 23, 4);
  }, h.prototype.readFloatBE = function(s, d) {
    return s = s >>> 0, d || g(s, 4, this.length), r.read(this, s, !1, 23, 4);
  }, h.prototype.readDoubleLE = function(s, d) {
    return s = s >>> 0, d || g(s, 8, this.length), r.read(this, s, !0, 52, 8);
  }, h.prototype.readDoubleBE = function(s, d) {
    return s = s >>> 0, d || g(s, 8, this.length), r.read(this, s, !1, 52, 8);
  };
  function H(l, s, d, y, I, L) {
    if (!h.isBuffer(l))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (s > I || s < L)
      throw new RangeError('"value" argument is out of bounds');
    if (d + y > l.length)
      throw new RangeError("Index out of range");
  }
  h.prototype.writeUintLE = h.prototype.writeUIntLE = function(s, d, y, I) {
    if (s = +s, d = d >>> 0, y = y >>> 0, !I) {
      const te = Math.pow(2, 8 * y) - 1;
      H(this, s, d, y, te, 0);
    }
    let L = 1, $ = 0;
    for (this[d] = s & 255; ++$ < y && (L *= 256); )
      this[d + $] = s / L & 255;
    return d + y;
  }, h.prototype.writeUintBE = h.prototype.writeUIntBE = function(s, d, y, I) {
    if (s = +s, d = d >>> 0, y = y >>> 0, !I) {
      const te = Math.pow(2, 8 * y) - 1;
      H(this, s, d, y, te, 0);
    }
    let L = y - 1, $ = 1;
    for (this[d + L] = s & 255; --L >= 0 && ($ *= 256); )
      this[d + L] = s / $ & 255;
    return d + y;
  }, h.prototype.writeUint8 = h.prototype.writeUInt8 = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 1, 255, 0), this[d] = s & 255, d + 1;
  }, h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 2, 65535, 0), this[d] = s & 255, this[d + 1] = s >>> 8, d + 2;
  }, h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 2, 65535, 0), this[d] = s >>> 8, this[d + 1] = s & 255, d + 2;
  }, h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 4, 4294967295, 0), this[d + 3] = s >>> 24, this[d + 2] = s >>> 16, this[d + 1] = s >>> 8, this[d] = s & 255, d + 4;
  }, h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 4, 4294967295, 0), this[d] = s >>> 24, this[d + 1] = s >>> 16, this[d + 2] = s >>> 8, this[d + 3] = s & 255, d + 4;
  };
  function Z(l, s, d, y, I) {
    m(s, y, I, l, d, 7);
    let L = Number(s & BigInt(4294967295));
    l[d++] = L, L = L >> 8, l[d++] = L, L = L >> 8, l[d++] = L, L = L >> 8, l[d++] = L;
    let $ = Number(s >> BigInt(32) & BigInt(4294967295));
    return l[d++] = $, $ = $ >> 8, l[d++] = $, $ = $ >> 8, l[d++] = $, $ = $ >> 8, l[d++] = $, d;
  }
  function J(l, s, d, y, I) {
    m(s, y, I, l, d, 7);
    let L = Number(s & BigInt(4294967295));
    l[d + 7] = L, L = L >> 8, l[d + 6] = L, L = L >> 8, l[d + 5] = L, L = L >> 8, l[d + 4] = L;
    let $ = Number(s >> BigInt(32) & BigInt(4294967295));
    return l[d + 3] = $, $ = $ >> 8, l[d + 2] = $, $ = $ >> 8, l[d + 1] = $, $ = $ >> 8, l[d] = $, d + 8;
  }
  h.prototype.writeBigUInt64LE = le(function(s, d = 0) {
    return Z(this, s, d, BigInt(0), BigInt("0xffffffffffffffff"));
  }), h.prototype.writeBigUInt64BE = le(function(s, d = 0) {
    return J(this, s, d, BigInt(0), BigInt("0xffffffffffffffff"));
  }), h.prototype.writeIntLE = function(s, d, y, I) {
    if (s = +s, d = d >>> 0, !I) {
      const _e = Math.pow(2, 8 * y - 1);
      H(this, s, d, y, _e - 1, -_e);
    }
    let L = 0, $ = 1, te = 0;
    for (this[d] = s & 255; ++L < y && ($ *= 256); )
      s < 0 && te === 0 && this[d + L - 1] !== 0 && (te = 1), this[d + L] = (s / $ >> 0) - te & 255;
    return d + y;
  }, h.prototype.writeIntBE = function(s, d, y, I) {
    if (s = +s, d = d >>> 0, !I) {
      const _e = Math.pow(2, 8 * y - 1);
      H(this, s, d, y, _e - 1, -_e);
    }
    let L = y - 1, $ = 1, te = 0;
    for (this[d + L] = s & 255; --L >= 0 && ($ *= 256); )
      s < 0 && te === 0 && this[d + L + 1] !== 0 && (te = 1), this[d + L] = (s / $ >> 0) - te & 255;
    return d + y;
  }, h.prototype.writeInt8 = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 1, 127, -128), s < 0 && (s = 255 + s + 1), this[d] = s & 255, d + 1;
  }, h.prototype.writeInt16LE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 2, 32767, -32768), this[d] = s & 255, this[d + 1] = s >>> 8, d + 2;
  }, h.prototype.writeInt16BE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 2, 32767, -32768), this[d] = s >>> 8, this[d + 1] = s & 255, d + 2;
  }, h.prototype.writeInt32LE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 4, 2147483647, -2147483648), this[d] = s & 255, this[d + 1] = s >>> 8, this[d + 2] = s >>> 16, this[d + 3] = s >>> 24, d + 4;
  }, h.prototype.writeInt32BE = function(s, d, y) {
    return s = +s, d = d >>> 0, y || H(this, s, d, 4, 2147483647, -2147483648), s < 0 && (s = 4294967295 + s + 1), this[d] = s >>> 24, this[d + 1] = s >>> 16, this[d + 2] = s >>> 8, this[d + 3] = s & 255, d + 4;
  }, h.prototype.writeBigInt64LE = le(function(s, d = 0) {
    return Z(this, s, d, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), h.prototype.writeBigInt64BE = le(function(s, d = 0) {
    return J(this, s, d, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ie(l, s, d, y, I, L) {
    if (d + y > l.length)
      throw new RangeError("Index out of range");
    if (d < 0)
      throw new RangeError("Index out of range");
  }
  function R(l, s, d, y, I) {
    return s = +s, d = d >>> 0, I || ie(l, s, d, 4), r.write(l, s, d, y, 23, 4), d + 4;
  }
  h.prototype.writeFloatLE = function(s, d, y) {
    return R(this, s, d, !0, y);
  }, h.prototype.writeFloatBE = function(s, d, y) {
    return R(this, s, d, !1, y);
  };
  function T(l, s, d, y, I) {
    return s = +s, d = d >>> 0, I || ie(l, s, d, 8), r.write(l, s, d, y, 52, 8), d + 8;
  }
  h.prototype.writeDoubleLE = function(s, d, y) {
    return T(this, s, d, !0, y);
  }, h.prototype.writeDoubleBE = function(s, d, y) {
    return T(this, s, d, !1, y);
  }, h.prototype.copy = function(s, d, y, I) {
    if (!h.isBuffer(s))
      throw new TypeError("argument should be a Buffer");
    if (y || (y = 0), !I && I !== 0 && (I = this.length), d >= s.length && (d = s.length), d || (d = 0), I > 0 && I < y && (I = y), I === y || s.length === 0 || this.length === 0)
      return 0;
    if (d < 0)
      throw new RangeError("targetStart out of bounds");
    if (y < 0 || y >= this.length)
      throw new RangeError("Index out of range");
    if (I < 0)
      throw new RangeError("sourceEnd out of bounds");
    I > this.length && (I = this.length), s.length - d < I - y && (I = s.length - d + y);
    const L = I - y;
    return this === s && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(d, y, I) : Uint8Array.prototype.set.call(
      s,
      this.subarray(y, I),
      d
    ), L;
  }, h.prototype.fill = function(s, d, y, I) {
    if (typeof s == "string") {
      if (typeof d == "string" ? (I = d, d = 0, y = this.length) : typeof y == "string" && (I = y, y = this.length), I !== void 0 && typeof I != "string")
        throw new TypeError("encoding must be a string");
      if (typeof I == "string" && !h.isEncoding(I))
        throw new TypeError("Unknown encoding: " + I);
      if (s.length === 1) {
        const $ = s.charCodeAt(0);
        (I === "utf8" && $ < 128 || I === "latin1") && (s = $);
      }
    } else
      typeof s == "number" ? s = s & 255 : typeof s == "boolean" && (s = Number(s));
    if (d < 0 || this.length < d || this.length < y)
      throw new RangeError("Out of range index");
    if (y <= d)
      return this;
    d = d >>> 0, y = y === void 0 ? this.length : y >>> 0, s || (s = 0);
    let L;
    if (typeof s == "number")
      for (L = d; L < y; ++L)
        this[L] = s;
    else {
      const $ = h.isBuffer(s) ? s : h.from(s, I), te = $.length;
      if (te === 0)
        throw new TypeError('The value "' + s + '" is invalid for argument "value"');
      for (L = 0; L < y - d; ++L)
        this[L + d] = $[L % te];
    }
    return this;
  };
  const q = {};
  function W(l, s, d) {
    q[l] = class extends d {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: s.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${l}]`, this.stack, delete this.name;
      }
      get code() {
        return l;
      }
      set code(I) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: I,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${l}]: ${this.message}`;
      }
    };
  }
  W(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(l) {
      return l ? `${l} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), W(
    "ERR_INVALID_ARG_TYPE",
    function(l, s) {
      return `The "${l}" argument must be of type number. Received type ${typeof s}`;
    },
    TypeError
  ), W(
    "ERR_OUT_OF_RANGE",
    function(l, s, d) {
      let y = `The value of "${l}" is out of range.`, I = d;
      return Number.isInteger(d) && Math.abs(d) > 2 ** 32 ? I = X(String(d)) : typeof d == "bigint" && (I = String(d), (d > BigInt(2) ** BigInt(32) || d < -(BigInt(2) ** BigInt(32))) && (I = X(I)), I += "n"), y += ` It must be ${s}. Received ${I}`, y;
    },
    RangeError
  );
  function X(l) {
    let s = "", d = l.length;
    const y = l[0] === "-" ? 1 : 0;
    for (; d >= y + 4; d -= 3)
      s = `_${l.slice(d - 3, d)}${s}`;
    return `${l.slice(0, d)}${s}`;
  }
  function S(l, s, d) {
    U(s, "offset"), (l[s] === void 0 || l[s + d] === void 0) && G(s, l.length - (d + 1));
  }
  function m(l, s, d, y, I, L) {
    if (l > d || l < s) {
      const $ = typeof s == "bigint" ? "n" : "";
      let te;
      throw L > 3 ? s === 0 || s === BigInt(0) ? te = `>= 0${$} and < 2${$} ** ${(L + 1) * 8}${$}` : te = `>= -(2${$} ** ${(L + 1) * 8 - 1}${$}) and < 2 ** ${(L + 1) * 8 - 1}${$}` : te = `>= ${s}${$} and <= ${d}${$}`, new q.ERR_OUT_OF_RANGE("value", te, l);
    }
    S(y, I, L);
  }
  function U(l, s) {
    if (typeof l != "number")
      throw new q.ERR_INVALID_ARG_TYPE(s, "number", l);
  }
  function G(l, s, d) {
    throw Math.floor(l) !== l ? (U(l, d), new q.ERR_OUT_OF_RANGE(d || "offset", "an integer", l)) : s < 0 ? new q.ERR_BUFFER_OUT_OF_BOUNDS() : new q.ERR_OUT_OF_RANGE(
      d || "offset",
      `>= ${d ? 1 : 0} and <= ${s}`,
      l
    );
  }
  const ne = /[^+/0-9A-Za-z-_]/g;
  function ee(l) {
    if (l = l.split("=")[0], l = l.trim().replace(ne, ""), l.length < 2)
      return "";
    for (; l.length % 4 !== 0; )
      l = l + "=";
    return l;
  }
  function ue(l, s) {
    s = s || 1 / 0;
    let d;
    const y = l.length;
    let I = null;
    const L = [];
    for (let $ = 0; $ < y; ++$) {
      if (d = l.charCodeAt($), d > 55295 && d < 57344) {
        if (!I) {
          if (d > 56319) {
            (s -= 3) > -1 && L.push(239, 191, 189);
            continue;
          } else if ($ + 1 === y) {
            (s -= 3) > -1 && L.push(239, 191, 189);
            continue;
          }
          I = d;
          continue;
        }
        if (d < 56320) {
          (s -= 3) > -1 && L.push(239, 191, 189), I = d;
          continue;
        }
        d = (I - 55296 << 10 | d - 56320) + 65536;
      } else
        I && (s -= 3) > -1 && L.push(239, 191, 189);
      if (I = null, d < 128) {
        if ((s -= 1) < 0)
          break;
        L.push(d);
      } else if (d < 2048) {
        if ((s -= 2) < 0)
          break;
        L.push(
          d >> 6 | 192,
          d & 63 | 128
        );
      } else if (d < 65536) {
        if ((s -= 3) < 0)
          break;
        L.push(
          d >> 12 | 224,
          d >> 6 & 63 | 128,
          d & 63 | 128
        );
      } else if (d < 1114112) {
        if ((s -= 4) < 0)
          break;
        L.push(
          d >> 18 | 240,
          d >> 12 & 63 | 128,
          d >> 6 & 63 | 128,
          d & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return L;
  }
  function ve(l) {
    const s = [];
    for (let d = 0; d < l.length; ++d)
      s.push(l.charCodeAt(d) & 255);
    return s;
  }
  function ye(l, s) {
    let d, y, I;
    const L = [];
    for (let $ = 0; $ < l.length && !((s -= 2) < 0); ++$)
      d = l.charCodeAt($), y = d >> 8, I = d % 256, L.push(I), L.push(y);
    return L;
  }
  function Tt(l) {
    return e.toByteArray(ee(l));
  }
  function ge(l, s, d, y) {
    let I;
    for (I = 0; I < y && !(I + d >= s.length || I >= l.length); ++I)
      s[I + d] = l[I];
    return I;
  }
  function he(l, s) {
    return l instanceof s || l != null && l.constructor != null && l.constructor.name != null && l.constructor.name === s.name;
  }
  function bt(l) {
    return l !== l;
  }
  const me = function() {
    const l = "0123456789abcdef", s = new Array(256);
    for (let d = 0; d < 16; ++d) {
      const y = d * 16;
      for (let I = 0; I < 16; ++I)
        s[y + I] = l[d] + l[I];
    }
    return s;
  }();
  function le(l) {
    return typeof BigInt > "u" ? pt : l;
  }
  function pt() {
    throw new Error("BigInt not supported");
  }
})(Se);
const Zd = (t, e, r = "tsp", i = 0) => {
  const f = _r.toWords(Se.Buffer.concat([t, e]));
  return f.unshift(i), _r.encode(r, f, 116);
}, ks = (t, e = "tsp") => {
  const { prefix: r, words: i } = _r.decode(t, 1023);
  if (r != e)
    throw new Error("Invalid prefix!");
  if (i.shift() != 0)
    throw new Error("Invalid version!");
  const n = Se.Buffer.from(_r.fromWords(i));
  return {
    scanKey: n.slice(0, 33),
    spendKey: n.slice(33)
  };
};
var Vi = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(t, e) {
  var r = Se, i = r.Buffer;
  function f(u, h) {
    for (var b in u)
      h[b] = u[b];
  }
  i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = r : (f(r, e), e.Buffer = n);
  function n(u, h, b) {
    return i(u, h, b);
  }
  n.prototype = Object.create(i.prototype), f(i, n), n.from = function(u, h, b) {
    if (typeof u == "number")
      throw new TypeError("Argument must not be a number");
    return i(u, h, b);
  }, n.alloc = function(u, h, b) {
    if (typeof u != "number")
      throw new TypeError("Argument must be a number");
    var _ = i(u);
    return h !== void 0 ? typeof b == "string" ? _.fill(h, b) : _.fill(h) : _.fill(0), _;
  }, n.allocUnsafe = function(u) {
    if (typeof u != "number")
      throw new TypeError("Argument must be a number");
    return i(u);
  }, n.allocUnsafeSlow = function(u) {
    if (typeof u != "number")
      throw new TypeError("Argument must be a number");
    return r.SlowBuffer(u);
  };
})(Vi, Vi.exports);
var ut = Vi.exports, Yi = { exports: {} }, Bf = Ht.EventEmitter, Ni, An;
function Us() {
  if (An)
    return Ni;
  An = 1;
  function t(N, O) {
    var D = Object.keys(N);
    if (Object.getOwnPropertySymbols) {
      var k = Object.getOwnPropertySymbols(N);
      O && (k = k.filter(function(z) {
        return Object.getOwnPropertyDescriptor(N, z).enumerable;
      })), D.push.apply(D, k);
    }
    return D;
  }
  function e(N) {
    for (var O = 1; O < arguments.length; O++) {
      var D = arguments[O] != null ? arguments[O] : {};
      O % 2 ? t(Object(D), !0).forEach(function(k) {
        r(N, k, D[k]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(N, Object.getOwnPropertyDescriptors(D)) : t(Object(D)).forEach(function(k) {
        Object.defineProperty(N, k, Object.getOwnPropertyDescriptor(D, k));
      });
    }
    return N;
  }
  function r(N, O, D) {
    return O = u(O), O in N ? Object.defineProperty(N, O, { value: D, enumerable: !0, configurable: !0, writable: !0 }) : N[O] = D, N;
  }
  function i(N, O) {
    if (!(N instanceof O))
      throw new TypeError("Cannot call a class as a function");
  }
  function f(N, O) {
    for (var D = 0; D < O.length; D++) {
      var k = O[D];
      k.enumerable = k.enumerable || !1, k.configurable = !0, "value" in k && (k.writable = !0), Object.defineProperty(N, u(k.key), k);
    }
  }
  function n(N, O, D) {
    return O && f(N.prototype, O), D && f(N, D), Object.defineProperty(N, "prototype", { writable: !1 }), N;
  }
  function u(N) {
    var O = h(N, "string");
    return typeof O == "symbol" ? O : String(O);
  }
  function h(N, O) {
    if (typeof N != "object" || N === null)
      return N;
    var D = N[Symbol.toPrimitive];
    if (D !== void 0) {
      var k = D.call(N, O || "default");
      if (typeof k != "object")
        return k;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (O === "string" ? String : Number)(N);
  }
  var b = Se, _ = b.Buffer, w = Ht, E = w.inspect, P = E && E.custom || "inspect";
  function F(N, O, D) {
    _.prototype.copy.call(N, O, D);
  }
  return Ni = /* @__PURE__ */ function() {
    function N() {
      i(this, N), this.head = null, this.tail = null, this.length = 0;
    }
    return n(N, [{
      key: "push",
      value: function(D) {
        var k = {
          data: D,
          next: null
        };
        this.length > 0 ? this.tail.next = k : this.head = k, this.tail = k, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(D) {
        var k = {
          data: D,
          next: this.head
        };
        this.length === 0 && (this.tail = k), this.head = k, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var D = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, D;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(D) {
        if (this.length === 0)
          return "";
        for (var k = this.head, z = "" + k.data; k = k.next; )
          z += D + k.data;
        return z;
      }
    }, {
      key: "concat",
      value: function(D) {
        if (this.length === 0)
          return _.alloc(0);
        for (var k = _.allocUnsafe(D >>> 0), z = this.head, j = 0; z; )
          F(z.data, k, j), j += z.data.length, z = z.next;
        return k;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(D, k) {
        var z;
        return D < this.head.data.length ? (z = this.head.data.slice(0, D), this.head.data = this.head.data.slice(D)) : D === this.head.data.length ? z = this.shift() : z = k ? this._getString(D) : this._getBuffer(D), z;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(D) {
        var k = this.head, z = 1, j = k.data;
        for (D -= j.length; k = k.next; ) {
          var K = k.data, Y = D > K.length ? K.length : D;
          if (Y === K.length ? j += K : j += K.slice(0, D), D -= Y, D === 0) {
            Y === K.length ? (++z, k.next ? this.head = k.next : this.head = this.tail = null) : (this.head = k, k.data = K.slice(Y));
            break;
          }
          ++z;
        }
        return this.length -= z, j;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(D) {
        var k = _.allocUnsafe(D), z = this.head, j = 1;
        for (z.data.copy(k), D -= z.data.length; z = z.next; ) {
          var K = z.data, Y = D > K.length ? K.length : D;
          if (K.copy(k, k.length - D, 0, Y), D -= Y, D === 0) {
            Y === K.length ? (++j, z.next ? this.head = z.next : this.head = this.tail = null) : (this.head = z, z.data = K.slice(Y));
            break;
          }
          ++j;
        }
        return this.length -= j, k;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: P,
      value: function(D, k) {
        return E(this, e(e({}, k), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), N;
  }(), Ni;
}
function Ds(t, e) {
  var r = this, i = this._readableState && this._readableState.destroyed, f = this._writableState && this._writableState.destroyed;
  return i || f ? (e ? e(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process.nextTick(Gi, this, t)) : process.nextTick(Gi, this, t)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function(n) {
    !e && n ? r._writableState ? r._writableState.errorEmitted ? process.nextTick(Cr, r) : (r._writableState.errorEmitted = !0, process.nextTick(In, r, n)) : process.nextTick(In, r, n) : e ? (process.nextTick(Cr, r), e(n)) : process.nextTick(Cr, r);
  }), this);
}
function In(t, e) {
  Gi(t, e), Cr(t);
}
function Cr(t) {
  t._writableState && !t._writableState.emitClose || t._readableState && !t._readableState.emitClose || t.emit("close");
}
function qs() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function Gi(t, e) {
  t.emit("error", e);
}
function zs(t, e) {
  var r = t._readableState, i = t._writableState;
  r && r.autoDestroy || i && i.autoDestroy ? t.destroy(e) : t.emit("error", e);
}
var Rf = {
  destroy: Ds,
  undestroy: qs,
  errorOrDestroy: zs
}, Gt = {};
function Ks(t, e) {
  t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
}
var Pf = {};
function ot(t, e, r) {
  r || (r = Error);
  function i(n, u, h) {
    return typeof e == "string" ? e : e(n, u, h);
  }
  var f = /* @__PURE__ */ function(n) {
    Ks(u, n);
    function u(h, b, _) {
      return n.call(this, i(h, b, _)) || this;
    }
    return u;
  }(r);
  f.prototype.name = r.name, f.prototype.code = t, Pf[t] = f;
}
function Bn(t, e) {
  if (Array.isArray(t)) {
    var r = t.length;
    return t = t.map(function(i) {
      return String(i);
    }), r > 2 ? "one of ".concat(e, " ").concat(t.slice(0, r - 1).join(", "), ", or ") + t[r - 1] : r === 2 ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1]) : "of ".concat(e, " ").concat(t[0]);
  } else
    return "of ".concat(e, " ").concat(String(t));
}
function Hs(t, e, r) {
  return t.substr(!r || r < 0 ? 0 : +r, e.length) === e;
}
function Ws(t, e, r) {
  return (r === void 0 || r > t.length) && (r = t.length), t.substring(r - e.length, r) === e;
}
function js(t, e, r) {
  return typeof r != "number" && (r = 0), r + e.length > t.length ? !1 : t.indexOf(e, r) !== -1;
}
ot("ERR_INVALID_OPT_VALUE", function(t, e) {
  return 'The value "' + e + '" is invalid for option "' + t + '"';
}, TypeError);
ot("ERR_INVALID_ARG_TYPE", function(t, e, r) {
  var i;
  typeof e == "string" && Hs(e, "not ") ? (i = "must not be", e = e.replace(/^not /, "")) : i = "must be";
  var f;
  if (Ws(t, " argument"))
    f = "The ".concat(t, " ").concat(i, " ").concat(Bn(e, "type"));
  else {
    var n = js(t, ".") ? "property" : "argument";
    f = 'The "'.concat(t, '" ').concat(n, " ").concat(i, " ").concat(Bn(e, "type"));
  }
  return f += ". Received type ".concat(typeof r), f;
}, TypeError);
ot("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
ot("ERR_METHOD_NOT_IMPLEMENTED", function(t) {
  return "The " + t + " method is not implemented";
});
ot("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
ot("ERR_STREAM_DESTROYED", function(t) {
  return "Cannot call " + t + " after a stream was destroyed";
});
ot("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
ot("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
ot("ERR_STREAM_WRITE_AFTER_END", "write after end");
ot("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
ot("ERR_UNKNOWN_ENCODING", function(t) {
  return "Unknown encoding: " + t;
}, TypeError);
ot("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
Gt.codes = Pf;
var Vs = Gt.codes.ERR_INVALID_OPT_VALUE;
function Ys(t, e, r) {
  return t.highWaterMark != null ? t.highWaterMark : e ? t[r] : null;
}
function Gs(t, e, r, i) {
  var f = Ys(e, i, r);
  if (f != null) {
    if (!(isFinite(f) && Math.floor(f) === f) || f < 0) {
      var n = i ? r : "highWaterMark";
      throw new Vs(n, f);
    }
    return Math.floor(f);
  }
  return t.objectMode ? 16 : 16 * 1024;
}
var Tf = {
  getHighWaterMark: Gs
}, Zs = Js;
function Js(t, e) {
  if (Fi("noDeprecation"))
    return t;
  var r = !1;
  function i() {
    if (!r) {
      if (Fi("throwDeprecation"))
        throw new Error(e);
      Fi("traceDeprecation") ? console.trace(e) : console.warn(e), r = !0;
    }
    return t.apply(this, arguments);
  }
  return i;
}
function Fi(t) {
  try {
    if (!Kt.localStorage)
      return !1;
  } catch {
    return !1;
  }
  var e = Kt.localStorage[t];
  return e == null ? !1 : String(e).toLowerCase() === "true";
}
var Li, Rn;
function Cf() {
  if (Rn)
    return Li;
  Rn = 1, Li = re;
  function t(R) {
    var T = this;
    this.next = null, this.entry = null, this.finish = function() {
      ie(T, R);
    };
  }
  var e;
  re.WritableState = Q;
  var r = {
    deprecate: Zs
  }, i = Bf, f = Se.Buffer, n = (typeof Kt < "u" ? Kt : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function u(R) {
    return f.from(R);
  }
  function h(R) {
    return f.isBuffer(R) || R instanceof n;
  }
  var b = Rf, _ = Tf, w = _.getHighWaterMark, E = Gt.codes, P = E.ERR_INVALID_ARG_TYPE, F = E.ERR_METHOD_NOT_IMPLEMENTED, N = E.ERR_MULTIPLE_CALLBACK, O = E.ERR_STREAM_CANNOT_PIPE, D = E.ERR_STREAM_DESTROYED, k = E.ERR_STREAM_NULL_VALUES, z = E.ERR_STREAM_WRITE_AFTER_END, j = E.ERR_UNKNOWN_ENCODING, K = b.errorOrDestroy;
  ze(re, i);
  function Y() {
  }
  function Q(R, T, q) {
    e = e || fr(), R = R || {}, typeof q != "boolean" && (q = T instanceof e), this.objectMode = !!R.objectMode, q && (this.objectMode = this.objectMode || !!R.writableObjectMode), this.highWaterMark = w(this, R, "writableHighWaterMark", q), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var W = R.decodeStrings === !1;
    this.decodeStrings = !W, this.defaultEncoding = R.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(X) {
      M(T, X);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = R.emitClose !== !1, this.autoDestroy = !!R.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  Q.prototype.getBuffer = function() {
    for (var T = this.bufferedRequest, q = []; T; )
      q.push(T), T = T.next;
    return q;
  }, function() {
    try {
      Object.defineProperty(Q.prototype, "buffer", {
        get: r.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  }();
  var se;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (se = Function.prototype[Symbol.hasInstance], Object.defineProperty(re, Symbol.hasInstance, {
    value: function(T) {
      return se.call(this, T) ? !0 : this !== re ? !1 : T && T._writableState instanceof Q;
    }
  })) : se = function(T) {
    return T instanceof this;
  };
  function re(R) {
    e = e || fr();
    var T = this instanceof e;
    if (!T && !se.call(re, this))
      return new re(R);
    this._writableState = new Q(R, this, T), this.writable = !0, R && (typeof R.write == "function" && (this._write = R.write), typeof R.writev == "function" && (this._writev = R.writev), typeof R.destroy == "function" && (this._destroy = R.destroy), typeof R.final == "function" && (this._final = R.final)), i.call(this);
  }
  re.prototype.pipe = function() {
    K(this, new O());
  };
  function V(R, T) {
    var q = new z();
    K(R, q), process.nextTick(T, q);
  }
  function Me(R, T, q, W) {
    var X;
    return q === null ? X = new k() : typeof q != "string" && !T.objectMode && (X = new P("chunk", ["string", "Buffer"], q)), X ? (K(R, X), process.nextTick(W, X), !1) : !0;
  }
  re.prototype.write = function(R, T, q) {
    var W = this._writableState, X = !1, S = !W.objectMode && h(R);
    return S && !f.isBuffer(R) && (R = u(R)), typeof T == "function" && (q = T, T = null), S ? T = "buffer" : T || (T = W.defaultEncoding), typeof q != "function" && (q = Y), W.ending ? V(this, q) : (S || Me(this, W, R, q)) && (W.pendingcb++, X = a(this, W, S, R, T, q)), X;
  }, re.prototype.cork = function() {
    this._writableState.corked++;
  }, re.prototype.uncork = function() {
    var R = this._writableState;
    R.corked && (R.corked--, !R.writing && !R.corked && !R.bufferProcessing && R.bufferedRequest && x(this, R));
  }, re.prototype.setDefaultEncoding = function(T) {
    if (typeof T == "string" && (T = T.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((T + "").toLowerCase()) > -1))
      throw new j(T);
    return this._writableState.defaultEncoding = T, this;
  }, Object.defineProperty(re.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function A(R, T, q) {
    return !R.objectMode && R.decodeStrings !== !1 && typeof T == "string" && (T = f.from(T, q)), T;
  }
  Object.defineProperty(re.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function a(R, T, q, W, X, S) {
    if (!q) {
      var m = A(T, W, X);
      W !== m && (q = !0, X = "buffer", W = m);
    }
    var U = T.objectMode ? 1 : W.length;
    T.length += U;
    var G = T.length < T.highWaterMark;
    if (G || (T.needDrain = !0), T.writing || T.corked) {
      var ne = T.lastBufferedRequest;
      T.lastBufferedRequest = {
        chunk: W,
        encoding: X,
        isBuf: q,
        callback: S,
        next: null
      }, ne ? ne.next = T.lastBufferedRequest : T.bufferedRequest = T.lastBufferedRequest, T.bufferedRequestCount += 1;
    } else
      c(R, T, !1, U, W, X, S);
    return G;
  }
  function c(R, T, q, W, X, S, m) {
    T.writelen = W, T.writecb = m, T.writing = !0, T.sync = !0, T.destroyed ? T.onwrite(new D("write")) : q ? R._writev(X, T.onwrite) : R._write(X, S, T.onwrite), T.sync = !1;
  }
  function p(R, T, q, W, X) {
    --T.pendingcb, q ? (process.nextTick(X, W), process.nextTick(Z, R, T), R._writableState.errorEmitted = !0, K(R, W)) : (X(W), R._writableState.errorEmitted = !0, K(R, W), Z(R, T));
  }
  function v(R) {
    R.writing = !1, R.writecb = null, R.length -= R.writelen, R.writelen = 0;
  }
  function M(R, T) {
    var q = R._writableState, W = q.sync, X = q.writecb;
    if (typeof X != "function")
      throw new N();
    if (v(q), T)
      p(R, q, W, T, X);
    else {
      var S = o(q) || R.destroyed;
      !S && !q.corked && !q.bufferProcessing && q.bufferedRequest && x(R, q), W ? process.nextTick(B, R, q, S, X) : B(R, q, S, X);
    }
  }
  function B(R, T, q, W) {
    q || C(R, T), T.pendingcb--, W(), Z(R, T);
  }
  function C(R, T) {
    T.length === 0 && T.needDrain && (T.needDrain = !1, R.emit("drain"));
  }
  function x(R, T) {
    T.bufferProcessing = !0;
    var q = T.bufferedRequest;
    if (R._writev && q && q.next) {
      var W = T.bufferedRequestCount, X = new Array(W), S = T.corkedRequestsFree;
      S.entry = q;
      for (var m = 0, U = !0; q; )
        X[m] = q, q.isBuf || (U = !1), q = q.next, m += 1;
      X.allBuffers = U, c(R, T, !0, T.length, X, "", S.finish), T.pendingcb++, T.lastBufferedRequest = null, S.next ? (T.corkedRequestsFree = S.next, S.next = null) : T.corkedRequestsFree = new t(T), T.bufferedRequestCount = 0;
    } else {
      for (; q; ) {
        var G = q.chunk, ne = q.encoding, ee = q.callback, ue = T.objectMode ? 1 : G.length;
        if (c(R, T, !1, ue, G, ne, ee), q = q.next, T.bufferedRequestCount--, T.writing)
          break;
      }
      q === null && (T.lastBufferedRequest = null);
    }
    T.bufferedRequest = q, T.bufferProcessing = !1;
  }
  re.prototype._write = function(R, T, q) {
    q(new F("_write()"));
  }, re.prototype._writev = null, re.prototype.end = function(R, T, q) {
    var W = this._writableState;
    return typeof R == "function" ? (q = R, R = null, T = null) : typeof T == "function" && (q = T, T = null), R != null && this.write(R, T), W.corked && (W.corked = 1, this.uncork()), W.ending || J(this, W, q), this;
  }, Object.defineProperty(re.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function o(R) {
    return R.ending && R.length === 0 && R.bufferedRequest === null && !R.finished && !R.writing;
  }
  function g(R, T) {
    R._final(function(q) {
      T.pendingcb--, q && K(R, q), T.prefinished = !0, R.emit("prefinish"), Z(R, T);
    });
  }
  function H(R, T) {
    !T.prefinished && !T.finalCalled && (typeof R._final == "function" && !T.destroyed ? (T.pendingcb++, T.finalCalled = !0, process.nextTick(g, R, T)) : (T.prefinished = !0, R.emit("prefinish")));
  }
  function Z(R, T) {
    var q = o(T);
    if (q && (H(R, T), T.pendingcb === 0 && (T.finished = !0, R.emit("finish"), T.autoDestroy))) {
      var W = R._readableState;
      (!W || W.autoDestroy && W.endEmitted) && R.destroy();
    }
    return q;
  }
  function J(R, T, q) {
    T.ending = !0, Z(R, T), q && (T.finished ? process.nextTick(q) : R.once("finish", q)), T.ended = !0, R.writable = !1;
  }
  function ie(R, T, q) {
    var W = R.entry;
    for (R.entry = null; W; ) {
      var X = W.callback;
      T.pendingcb--, X(q), W = W.next;
    }
    T.corkedRequestsFree.next = R;
  }
  return Object.defineProperty(re.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(T) {
      this._writableState && (this._writableState.destroyed = T);
    }
  }), re.prototype.destroy = b.destroy, re.prototype._undestroy = b.undestroy, re.prototype._destroy = function(R, T) {
    T(R);
  }, Li;
}
var Oi, Pn;
function fr() {
  if (Pn)
    return Oi;
  Pn = 1;
  var t = Object.keys || function(_) {
    var w = [];
    for (var E in _)
      w.push(E);
    return w;
  };
  Oi = u;
  var e = Ff(), r = Cf();
  ze(u, e);
  for (var i = t(r.prototype), f = 0; f < i.length; f++) {
    var n = i[f];
    u.prototype[n] || (u.prototype[n] = r.prototype[n]);
  }
  function u(_) {
    if (!(this instanceof u))
      return new u(_);
    e.call(this, _), r.call(this, _), this.allowHalfOpen = !0, _ && (_.readable === !1 && (this.readable = !1), _.writable === !1 && (this.writable = !1), _.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", h)));
  }
  Object.defineProperty(u.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(u.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(u.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function h() {
    this._writableState.ended || process.nextTick(b, this);
  }
  function b(_) {
    _.end();
  }
  return Object.defineProperty(u.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(w) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = w, this._writableState.destroyed = w);
    }
  }), Oi;
}
var $r = {}, an = ut.Buffer, Tn = an.isEncoding || function(t) {
  switch (t = "" + t, t && t.toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
    case "raw":
      return !0;
    default:
      return !1;
  }
};
function Xs(t) {
  if (!t)
    return "utf8";
  for (var e; ; )
    switch (t) {
      case "utf8":
      case "utf-8":
        return "utf8";
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return "utf16le";
      case "latin1":
      case "binary":
        return "latin1";
      case "base64":
      case "ascii":
      case "hex":
        return t;
      default:
        if (e)
          return;
        t = ("" + t).toLowerCase(), e = !0;
    }
}
function Qs(t) {
  var e = Xs(t);
  if (typeof e != "string" && (an.isEncoding === Tn || !Tn(t)))
    throw new Error("Unknown encoding: " + t);
  return e || t;
}
$r.StringDecoder = Ar;
function Ar(t) {
  this.encoding = Qs(t);
  var e;
  switch (this.encoding) {
    case "utf16le":
      this.text = fo, this.end = ao, e = 4;
      break;
    case "utf8":
      this.fillLast = ro, e = 4;
      break;
    case "base64":
      this.text = so, this.end = oo, e = 3;
      break;
    default:
      this.write = ho, this.end = co;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = an.allocUnsafe(e);
}
Ar.prototype.write = function(t) {
  if (t.length === 0)
    return "";
  var e, r;
  if (this.lastNeed) {
    if (e = this.fillLast(t), e === void 0)
      return "";
    r = this.lastNeed, this.lastNeed = 0;
  } else
    r = 0;
  return r < t.length ? e ? e + this.text(t, r) : this.text(t, r) : e || "";
};
Ar.prototype.end = no;
Ar.prototype.text = io;
Ar.prototype.fillLast = function(t) {
  if (this.lastNeed <= t.length)
    return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
};
function $i(t) {
  return t <= 127 ? 0 : t >> 5 === 6 ? 2 : t >> 4 === 14 ? 3 : t >> 3 === 30 ? 4 : t >> 6 === 2 ? -1 : -2;
}
function eo(t, e, r) {
  var i = e.length - 1;
  if (i < r)
    return 0;
  var f = $i(e[i]);
  return f >= 0 ? (f > 0 && (t.lastNeed = f - 1), f) : --i < r || f === -2 ? 0 : (f = $i(e[i]), f >= 0 ? (f > 0 && (t.lastNeed = f - 2), f) : --i < r || f === -2 ? 0 : (f = $i(e[i]), f >= 0 ? (f > 0 && (f === 2 ? f = 0 : t.lastNeed = f - 3), f) : 0));
}
function to(t, e, r) {
  if ((e[0] & 192) !== 128)
    return t.lastNeed = 0, "�";
  if (t.lastNeed > 1 && e.length > 1) {
    if ((e[1] & 192) !== 128)
      return t.lastNeed = 1, "�";
    if (t.lastNeed > 2 && e.length > 2 && (e[2] & 192) !== 128)
      return t.lastNeed = 2, "�";
  }
}
function ro(t) {
  var e = this.lastTotal - this.lastNeed, r = to(this, t);
  if (r !== void 0)
    return r;
  if (this.lastNeed <= t.length)
    return t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  t.copy(this.lastChar, e, 0, t.length), this.lastNeed -= t.length;
}
function io(t, e) {
  var r = eo(this, t, e);
  if (!this.lastNeed)
    return t.toString("utf8", e);
  this.lastTotal = r;
  var i = t.length - (r - this.lastNeed);
  return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
}
function no(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + "�" : e;
}
function fo(t, e) {
  if ((t.length - e) % 2 === 0) {
    var r = t.toString("utf16le", e);
    if (r) {
      var i = r.charCodeAt(r.length - 1);
      if (i >= 55296 && i <= 56319)
        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], r.slice(0, -1);
    }
    return r;
  }
  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
}
function ao(t) {
  var e = t && t.length ? this.write(t) : "";
  if (this.lastNeed) {
    var r = this.lastTotal - this.lastNeed;
    return e + this.lastChar.toString("utf16le", 0, r);
  }
  return e;
}
function so(t, e) {
  var r = (t.length - e) % 3;
  return r === 0 ? t.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - r));
}
function oo(t) {
  var e = t && t.length ? this.write(t) : "";
  return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
}
function ho(t) {
  return t.toString(this.encoding);
}
function co(t) {
  return t && t.length ? this.write(t) : "";
}
var Cn = Gt.codes.ERR_STREAM_PREMATURE_CLOSE;
function uo(t) {
  var e = !1;
  return function() {
    if (!e) {
      e = !0;
      for (var r = arguments.length, i = new Array(r), f = 0; f < r; f++)
        i[f] = arguments[f];
      t.apply(this, i);
    }
  };
}
function lo() {
}
function bo(t) {
  return t.setHeader && typeof t.abort == "function";
}
function Nf(t, e, r) {
  if (typeof e == "function")
    return Nf(t, null, e);
  e || (e = {}), r = uo(r || lo);
  var i = e.readable || e.readable !== !1 && t.readable, f = e.writable || e.writable !== !1 && t.writable, n = function() {
    t.writable || h();
  }, u = t._writableState && t._writableState.finished, h = function() {
    f = !1, u = !0, i || r.call(t);
  }, b = t._readableState && t._readableState.endEmitted, _ = function() {
    i = !1, b = !0, f || r.call(t);
  }, w = function(N) {
    r.call(t, N);
  }, E = function() {
    var N;
    if (i && !b)
      return (!t._readableState || !t._readableState.ended) && (N = new Cn()), r.call(t, N);
    if (f && !u)
      return (!t._writableState || !t._writableState.ended) && (N = new Cn()), r.call(t, N);
  }, P = function() {
    t.req.on("finish", h);
  };
  return bo(t) ? (t.on("complete", h), t.on("abort", E), t.req ? P() : t.on("request", P)) : f && !t._writableState && (t.on("end", n), t.on("close", n)), t.on("end", _), t.on("finish", h), e.error !== !1 && t.on("error", w), t.on("close", E), function() {
    t.removeListener("complete", h), t.removeListener("abort", E), t.removeListener("request", P), t.req && t.req.removeListener("finish", h), t.removeListener("end", n), t.removeListener("close", n), t.removeListener("finish", h), t.removeListener("end", _), t.removeListener("error", w), t.removeListener("close", E);
  };
}
var sn = Nf, ki, Nn;
function po() {
  if (Nn)
    return ki;
  Nn = 1;
  var t;
  function e(j, K, Y) {
    return K = r(K), K in j ? Object.defineProperty(j, K, { value: Y, enumerable: !0, configurable: !0, writable: !0 }) : j[K] = Y, j;
  }
  function r(j) {
    var K = i(j, "string");
    return typeof K == "symbol" ? K : String(K);
  }
  function i(j, K) {
    if (typeof j != "object" || j === null)
      return j;
    var Y = j[Symbol.toPrimitive];
    if (Y !== void 0) {
      var Q = Y.call(j, K || "default");
      if (typeof Q != "object")
        return Q;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (K === "string" ? String : Number)(j);
  }
  var f = sn, n = Symbol("lastResolve"), u = Symbol("lastReject"), h = Symbol("error"), b = Symbol("ended"), _ = Symbol("lastPromise"), w = Symbol("handlePromise"), E = Symbol("stream");
  function P(j, K) {
    return {
      value: j,
      done: K
    };
  }
  function F(j) {
    var K = j[n];
    if (K !== null) {
      var Y = j[E].read();
      Y !== null && (j[_] = null, j[n] = null, j[u] = null, K(P(Y, !1)));
    }
  }
  function N(j) {
    process.nextTick(F, j);
  }
  function O(j, K) {
    return function(Y, Q) {
      j.then(function() {
        if (K[b]) {
          Y(P(void 0, !0));
          return;
        }
        K[w](Y, Q);
      }, Q);
    };
  }
  var D = Object.getPrototypeOf(function() {
  }), k = Object.setPrototypeOf((t = {
    get stream() {
      return this[E];
    },
    next: function() {
      var K = this, Y = this[h];
      if (Y !== null)
        return Promise.reject(Y);
      if (this[b])
        return Promise.resolve(P(void 0, !0));
      if (this[E].destroyed)
        return new Promise(function(V, Me) {
          process.nextTick(function() {
            K[h] ? Me(K[h]) : V(P(void 0, !0));
          });
        });
      var Q = this[_], se;
      if (Q)
        se = new Promise(O(Q, this));
      else {
        var re = this[E].read();
        if (re !== null)
          return Promise.resolve(P(re, !1));
        se = new Promise(this[w]);
      }
      return this[_] = se, se;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var K = this;
    return new Promise(function(Y, Q) {
      K[E].destroy(null, function(se) {
        if (se) {
          Q(se);
          return;
        }
        Y(P(void 0, !0));
      });
    });
  }), t), D), z = function(K) {
    var Y, Q = Object.create(k, (Y = {}, e(Y, E, {
      value: K,
      writable: !0
    }), e(Y, n, {
      value: null,
      writable: !0
    }), e(Y, u, {
      value: null,
      writable: !0
    }), e(Y, h, {
      value: null,
      writable: !0
    }), e(Y, b, {
      value: K._readableState.endEmitted,
      writable: !0
    }), e(Y, w, {
      value: function(re, V) {
        var Me = Q[E].read();
        Me ? (Q[_] = null, Q[n] = null, Q[u] = null, re(P(Me, !1))) : (Q[n] = re, Q[u] = V);
      },
      writable: !0
    }), Y));
    return Q[_] = null, f(K, function(se) {
      if (se && se.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var re = Q[u];
        re !== null && (Q[_] = null, Q[n] = null, Q[u] = null, re(se)), Q[h] = se;
        return;
      }
      var V = Q[n];
      V !== null && (Q[_] = null, Q[n] = null, Q[u] = null, V(P(void 0, !0))), Q[b] = !0;
    }), K.on("readable", N.bind(null, Q)), Q;
  };
  return ki = z, ki;
}
var Ui, Fn;
function vo() {
  return Fn || (Fn = 1, Ui = function() {
    throw new Error("Readable.from is not available in the browser");
  }), Ui;
}
var Di, Ln;
function Ff() {
  if (Ln)
    return Di;
  Ln = 1, Di = V;
  var t;
  V.ReadableState = re, Ht.EventEmitter;
  var e = function(m, U) {
    return m.listeners(U).length;
  }, r = Bf, i = Se.Buffer, f = (typeof Kt < "u" ? Kt : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function n(S) {
    return i.from(S);
  }
  function u(S) {
    return i.isBuffer(S) || S instanceof f;
  }
  var h = Ht, b;
  h && h.debuglog ? b = h.debuglog("stream") : b = function() {
  };
  var _ = Us(), w = Rf, E = Tf, P = E.getHighWaterMark, F = Gt.codes, N = F.ERR_INVALID_ARG_TYPE, O = F.ERR_STREAM_PUSH_AFTER_EOF, D = F.ERR_METHOD_NOT_IMPLEMENTED, k = F.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, z, j, K;
  ze(V, r);
  var Y = w.errorOrDestroy, Q = ["error", "close", "destroy", "pause", "resume"];
  function se(S, m, U) {
    if (typeof S.prependListener == "function")
      return S.prependListener(m, U);
    !S._events || !S._events[m] ? S.on(m, U) : Array.isArray(S._events[m]) ? S._events[m].unshift(U) : S._events[m] = [U, S._events[m]];
  }
  function re(S, m, U) {
    t = t || fr(), S = S || {}, typeof U != "boolean" && (U = m instanceof t), this.objectMode = !!S.objectMode, U && (this.objectMode = this.objectMode || !!S.readableObjectMode), this.highWaterMark = P(this, S, "readableHighWaterMark", U), this.buffer = new _(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = S.emitClose !== !1, this.autoDestroy = !!S.autoDestroy, this.destroyed = !1, this.defaultEncoding = S.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, S.encoding && (z || (z = $r.StringDecoder), this.decoder = new z(S.encoding), this.encoding = S.encoding);
  }
  function V(S) {
    if (t = t || fr(), !(this instanceof V))
      return new V(S);
    var m = this instanceof t;
    this._readableState = new re(S, this, m), this.readable = !0, S && (typeof S.read == "function" && (this._read = S.read), typeof S.destroy == "function" && (this._destroy = S.destroy)), r.call(this);
  }
  Object.defineProperty(V.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(m) {
      this._readableState && (this._readableState.destroyed = m);
    }
  }), V.prototype.destroy = w.destroy, V.prototype._undestroy = w.undestroy, V.prototype._destroy = function(S, m) {
    m(S);
  }, V.prototype.push = function(S, m) {
    var U = this._readableState, G;
    return U.objectMode ? G = !0 : typeof S == "string" && (m = m || U.defaultEncoding, m !== U.encoding && (S = i.from(S, m), m = ""), G = !0), Me(this, S, m, !1, G);
  }, V.prototype.unshift = function(S) {
    return Me(this, S, null, !0, !1);
  };
  function Me(S, m, U, G, ne) {
    b("readableAddChunk", m);
    var ee = S._readableState;
    if (m === null)
      ee.reading = !1, M(S, ee);
    else {
      var ue;
      if (ne || (ue = a(ee, m)), ue)
        Y(S, ue);
      else if (ee.objectMode || m && m.length > 0)
        if (typeof m != "string" && !ee.objectMode && Object.getPrototypeOf(m) !== i.prototype && (m = n(m)), G)
          ee.endEmitted ? Y(S, new k()) : A(S, ee, m, !0);
        else if (ee.ended)
          Y(S, new O());
        else {
          if (ee.destroyed)
            return !1;
          ee.reading = !1, ee.decoder && !U ? (m = ee.decoder.write(m), ee.objectMode || m.length !== 0 ? A(S, ee, m, !1) : x(S, ee)) : A(S, ee, m, !1);
        }
      else
        G || (ee.reading = !1, x(S, ee));
    }
    return !ee.ended && (ee.length < ee.highWaterMark || ee.length === 0);
  }
  function A(S, m, U, G) {
    m.flowing && m.length === 0 && !m.sync ? (m.awaitDrain = 0, S.emit("data", U)) : (m.length += m.objectMode ? 1 : U.length, G ? m.buffer.unshift(U) : m.buffer.push(U), m.needReadable && B(S)), x(S, m);
  }
  function a(S, m) {
    var U;
    return !u(m) && typeof m != "string" && m !== void 0 && !S.objectMode && (U = new N("chunk", ["string", "Buffer", "Uint8Array"], m)), U;
  }
  V.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, V.prototype.setEncoding = function(S) {
    z || (z = $r.StringDecoder);
    var m = new z(S);
    this._readableState.decoder = m, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var U = this._readableState.buffer.head, G = ""; U !== null; )
      G += m.write(U.data), U = U.next;
    return this._readableState.buffer.clear(), G !== "" && this._readableState.buffer.push(G), this._readableState.length = G.length, this;
  };
  var c = 1073741824;
  function p(S) {
    return S >= c ? S = c : (S--, S |= S >>> 1, S |= S >>> 2, S |= S >>> 4, S |= S >>> 8, S |= S >>> 16, S++), S;
  }
  function v(S, m) {
    return S <= 0 || m.length === 0 && m.ended ? 0 : m.objectMode ? 1 : S !== S ? m.flowing && m.length ? m.buffer.head.data.length : m.length : (S > m.highWaterMark && (m.highWaterMark = p(S)), S <= m.length ? S : m.ended ? m.length : (m.needReadable = !0, 0));
  }
  V.prototype.read = function(S) {
    b("read", S), S = parseInt(S, 10);
    var m = this._readableState, U = S;
    if (S !== 0 && (m.emittedReadable = !1), S === 0 && m.needReadable && ((m.highWaterMark !== 0 ? m.length >= m.highWaterMark : m.length > 0) || m.ended))
      return b("read: emitReadable", m.length, m.ended), m.length === 0 && m.ended ? q(this) : B(this), null;
    if (S = v(S, m), S === 0 && m.ended)
      return m.length === 0 && q(this), null;
    var G = m.needReadable;
    b("need readable", G), (m.length === 0 || m.length - S < m.highWaterMark) && (G = !0, b("length less than watermark", G)), m.ended || m.reading ? (G = !1, b("reading or ended", G)) : G && (b("do read"), m.reading = !0, m.sync = !0, m.length === 0 && (m.needReadable = !0), this._read(m.highWaterMark), m.sync = !1, m.reading || (S = v(U, m)));
    var ne;
    return S > 0 ? ne = T(S, m) : ne = null, ne === null ? (m.needReadable = m.length <= m.highWaterMark, S = 0) : (m.length -= S, m.awaitDrain = 0), m.length === 0 && (m.ended || (m.needReadable = !0), U !== S && m.ended && q(this)), ne !== null && this.emit("data", ne), ne;
  };
  function M(S, m) {
    if (b("onEofChunk"), !m.ended) {
      if (m.decoder) {
        var U = m.decoder.end();
        U && U.length && (m.buffer.push(U), m.length += m.objectMode ? 1 : U.length);
      }
      m.ended = !0, m.sync ? B(S) : (m.needReadable = !1, m.emittedReadable || (m.emittedReadable = !0, C(S)));
    }
  }
  function B(S) {
    var m = S._readableState;
    b("emitReadable", m.needReadable, m.emittedReadable), m.needReadable = !1, m.emittedReadable || (b("emitReadable", m.flowing), m.emittedReadable = !0, process.nextTick(C, S));
  }
  function C(S) {
    var m = S._readableState;
    b("emitReadable_", m.destroyed, m.length, m.ended), !m.destroyed && (m.length || m.ended) && (S.emit("readable"), m.emittedReadable = !1), m.needReadable = !m.flowing && !m.ended && m.length <= m.highWaterMark, R(S);
  }
  function x(S, m) {
    m.readingMore || (m.readingMore = !0, process.nextTick(o, S, m));
  }
  function o(S, m) {
    for (; !m.reading && !m.ended && (m.length < m.highWaterMark || m.flowing && m.length === 0); ) {
      var U = m.length;
      if (b("maybeReadMore read 0"), S.read(0), U === m.length)
        break;
    }
    m.readingMore = !1;
  }
  V.prototype._read = function(S) {
    Y(this, new D("_read()"));
  }, V.prototype.pipe = function(S, m) {
    var U = this, G = this._readableState;
    switch (G.pipesCount) {
      case 0:
        G.pipes = S;
        break;
      case 1:
        G.pipes = [G.pipes, S];
        break;
      default:
        G.pipes.push(S);
        break;
    }
    G.pipesCount += 1, b("pipe count=%d opts=%j", G.pipesCount, m);
    var ne = (!m || m.end !== !1) && S !== process.stdout && S !== process.stderr, ee = ne ? ve : pt;
    G.endEmitted ? process.nextTick(ee) : U.once("end", ee), S.on("unpipe", ue);
    function ue(l, s) {
      b("onunpipe"), l === U && s && s.hasUnpiped === !1 && (s.hasUnpiped = !0, ge());
    }
    function ve() {
      b("onend"), S.end();
    }
    var ye = g(U);
    S.on("drain", ye);
    var Tt = !1;
    function ge() {
      b("cleanup"), S.removeListener("close", me), S.removeListener("finish", le), S.removeListener("drain", ye), S.removeListener("error", bt), S.removeListener("unpipe", ue), U.removeListener("end", ve), U.removeListener("end", pt), U.removeListener("data", he), Tt = !0, G.awaitDrain && (!S._writableState || S._writableState.needDrain) && ye();
    }
    U.on("data", he);
    function he(l) {
      b("ondata");
      var s = S.write(l);
      b("dest.write", s), s === !1 && ((G.pipesCount === 1 && G.pipes === S || G.pipesCount > 1 && X(G.pipes, S) !== -1) && !Tt && (b("false write response, pause", G.awaitDrain), G.awaitDrain++), U.pause());
    }
    function bt(l) {
      b("onerror", l), pt(), S.removeListener("error", bt), e(S, "error") === 0 && Y(S, l);
    }
    se(S, "error", bt);
    function me() {
      S.removeListener("finish", le), pt();
    }
    S.once("close", me);
    function le() {
      b("onfinish"), S.removeListener("close", me), pt();
    }
    S.once("finish", le);
    function pt() {
      b("unpipe"), U.unpipe(S);
    }
    return S.emit("pipe", U), G.flowing || (b("pipe resume"), U.resume()), S;
  };
  function g(S) {
    return function() {
      var U = S._readableState;
      b("pipeOnDrain", U.awaitDrain), U.awaitDrain && U.awaitDrain--, U.awaitDrain === 0 && e(S, "data") && (U.flowing = !0, R(S));
    };
  }
  V.prototype.unpipe = function(S) {
    var m = this._readableState, U = {
      hasUnpiped: !1
    };
    if (m.pipesCount === 0)
      return this;
    if (m.pipesCount === 1)
      return S && S !== m.pipes ? this : (S || (S = m.pipes), m.pipes = null, m.pipesCount = 0, m.flowing = !1, S && S.emit("unpipe", this, U), this);
    if (!S) {
      var G = m.pipes, ne = m.pipesCount;
      m.pipes = null, m.pipesCount = 0, m.flowing = !1;
      for (var ee = 0; ee < ne; ee++)
        G[ee].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    var ue = X(m.pipes, S);
    return ue === -1 ? this : (m.pipes.splice(ue, 1), m.pipesCount -= 1, m.pipesCount === 1 && (m.pipes = m.pipes[0]), S.emit("unpipe", this, U), this);
  }, V.prototype.on = function(S, m) {
    var U = r.prototype.on.call(this, S, m), G = this._readableState;
    return S === "data" ? (G.readableListening = this.listenerCount("readable") > 0, G.flowing !== !1 && this.resume()) : S === "readable" && !G.endEmitted && !G.readableListening && (G.readableListening = G.needReadable = !0, G.flowing = !1, G.emittedReadable = !1, b("on readable", G.length, G.reading), G.length ? B(this) : G.reading || process.nextTick(Z, this)), U;
  }, V.prototype.addListener = V.prototype.on, V.prototype.removeListener = function(S, m) {
    var U = r.prototype.removeListener.call(this, S, m);
    return S === "readable" && process.nextTick(H, this), U;
  }, V.prototype.removeAllListeners = function(S) {
    var m = r.prototype.removeAllListeners.apply(this, arguments);
    return (S === "readable" || S === void 0) && process.nextTick(H, this), m;
  };
  function H(S) {
    var m = S._readableState;
    m.readableListening = S.listenerCount("readable") > 0, m.resumeScheduled && !m.paused ? m.flowing = !0 : S.listenerCount("data") > 0 && S.resume();
  }
  function Z(S) {
    b("readable nexttick read 0"), S.read(0);
  }
  V.prototype.resume = function() {
    var S = this._readableState;
    return S.flowing || (b("resume"), S.flowing = !S.readableListening, J(this, S)), S.paused = !1, this;
  };
  function J(S, m) {
    m.resumeScheduled || (m.resumeScheduled = !0, process.nextTick(ie, S, m));
  }
  function ie(S, m) {
    b("resume", m.reading), m.reading || S.read(0), m.resumeScheduled = !1, S.emit("resume"), R(S), m.flowing && !m.reading && S.read(0);
  }
  V.prototype.pause = function() {
    return b("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (b("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function R(S) {
    var m = S._readableState;
    for (b("flow", m.flowing); m.flowing && S.read() !== null; )
      ;
  }
  V.prototype.wrap = function(S) {
    var m = this, U = this._readableState, G = !1;
    S.on("end", function() {
      if (b("wrapped end"), U.decoder && !U.ended) {
        var ue = U.decoder.end();
        ue && ue.length && m.push(ue);
      }
      m.push(null);
    }), S.on("data", function(ue) {
      if (b("wrapped data"), U.decoder && (ue = U.decoder.write(ue)), !(U.objectMode && ue == null) && !(!U.objectMode && (!ue || !ue.length))) {
        var ve = m.push(ue);
        ve || (G = !0, S.pause());
      }
    });
    for (var ne in S)
      this[ne] === void 0 && typeof S[ne] == "function" && (this[ne] = function(ve) {
        return function() {
          return S[ve].apply(S, arguments);
        };
      }(ne));
    for (var ee = 0; ee < Q.length; ee++)
      S.on(Q[ee], this.emit.bind(this, Q[ee]));
    return this._read = function(ue) {
      b("wrapped _read", ue), G && (G = !1, S.resume());
    }, this;
  }, typeof Symbol == "function" && (V.prototype[Symbol.asyncIterator] = function() {
    return j === void 0 && (j = po()), j(this);
  }), Object.defineProperty(V.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(V.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(V.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(m) {
      this._readableState && (this._readableState.flowing = m);
    }
  }), V._fromList = T, Object.defineProperty(V.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function T(S, m) {
    if (m.length === 0)
      return null;
    var U;
    return m.objectMode ? U = m.buffer.shift() : !S || S >= m.length ? (m.decoder ? U = m.buffer.join("") : m.buffer.length === 1 ? U = m.buffer.first() : U = m.buffer.concat(m.length), m.buffer.clear()) : U = m.buffer.consume(S, m.decoder), U;
  }
  function q(S) {
    var m = S._readableState;
    b("endReadable", m.endEmitted), m.endEmitted || (m.ended = !0, process.nextTick(W, m, S));
  }
  function W(S, m) {
    if (b("endReadableNT", S.endEmitted, S.length), !S.endEmitted && S.length === 0 && (S.endEmitted = !0, m.readable = !1, m.emit("end"), S.autoDestroy)) {
      var U = m._writableState;
      (!U || U.autoDestroy && U.finished) && m.destroy();
    }
  }
  typeof Symbol == "function" && (V.from = function(S, m) {
    return K === void 0 && (K = vo()), K(V, S, m);
  });
  function X(S, m) {
    for (var U = 0, G = S.length; U < G; U++)
      if (S[U] === m)
        return U;
    return -1;
  }
  return Di;
}
var Lf = Rt, Zr = Gt.codes, yo = Zr.ERR_METHOD_NOT_IMPLEMENTED, go = Zr.ERR_MULTIPLE_CALLBACK, xo = Zr.ERR_TRANSFORM_ALREADY_TRANSFORMING, mo = Zr.ERR_TRANSFORM_WITH_LENGTH_0, Jr = fr();
ze(Rt, Jr);
function wo(t, e) {
  var r = this._transformState;
  r.transforming = !1;
  var i = r.writecb;
  if (i === null)
    return this.emit("error", new go());
  r.writechunk = null, r.writecb = null, e != null && this.push(e), i(t);
  var f = this._readableState;
  f.reading = !1, (f.needReadable || f.length < f.highWaterMark) && this._read(f.highWaterMark);
}
function Rt(t) {
  if (!(this instanceof Rt))
    return new Rt(t);
  Jr.call(this, t), this._transformState = {
    afterTransform: wo.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, t && (typeof t.transform == "function" && (this._transform = t.transform), typeof t.flush == "function" && (this._flush = t.flush)), this.on("prefinish", _o);
}
function _o() {
  var t = this;
  typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(e, r) {
    On(t, e, r);
  }) : On(this, null, null);
}
Rt.prototype.push = function(t, e) {
  return this._transformState.needTransform = !1, Jr.prototype.push.call(this, t, e);
};
Rt.prototype._transform = function(t, e, r) {
  r(new yo("_transform()"));
};
Rt.prototype._write = function(t, e, r) {
  var i = this._transformState;
  if (i.writecb = r, i.writechunk = t, i.writeencoding = e, !i.transforming) {
    var f = this._readableState;
    (i.needTransform || f.needReadable || f.length < f.highWaterMark) && this._read(f.highWaterMark);
  }
};
Rt.prototype._read = function(t) {
  var e = this._transformState;
  e.writechunk !== null && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0;
};
Rt.prototype._destroy = function(t, e) {
  Jr.prototype._destroy.call(this, t, function(r) {
    e(r);
  });
};
function On(t, e, r) {
  if (e)
    return t.emit("error", e);
  if (r != null && t.push(r), t._writableState.length)
    throw new mo();
  if (t._transformState.transforming)
    throw new xo();
  return t.push(null);
}
var Mo = Mr, Of = Lf;
ze(Mr, Of);
function Mr(t) {
  if (!(this instanceof Mr))
    return new Mr(t);
  Of.call(this, t);
}
Mr.prototype._transform = function(t, e, r) {
  r(null, t);
};
var qi;
function So(t) {
  var e = !1;
  return function() {
    e || (e = !0, t.apply(void 0, arguments));
  };
}
var $f = Gt.codes, Eo = $f.ERR_MISSING_ARGS, Ao = $f.ERR_STREAM_DESTROYED;
function $n(t) {
  if (t)
    throw t;
}
function Io(t) {
  return t.setHeader && typeof t.abort == "function";
}
function Bo(t, e, r, i) {
  i = So(i);
  var f = !1;
  t.on("close", function() {
    f = !0;
  }), qi === void 0 && (qi = sn), qi(t, {
    readable: e,
    writable: r
  }, function(u) {
    if (u)
      return i(u);
    f = !0, i();
  });
  var n = !1;
  return function(u) {
    if (!f && !n) {
      if (n = !0, Io(t))
        return t.abort();
      if (typeof t.destroy == "function")
        return t.destroy();
      i(u || new Ao("pipe"));
    }
  };
}
function kn(t) {
  t();
}
function Ro(t, e) {
  return t.pipe(e);
}
function Po(t) {
  return !t.length || typeof t[t.length - 1] != "function" ? $n : t.pop();
}
function To() {
  for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
    e[r] = arguments[r];
  var i = Po(e);
  if (Array.isArray(e[0]) && (e = e[0]), e.length < 2)
    throw new Eo("streams");
  var f, n = e.map(function(u, h) {
    var b = h < e.length - 1, _ = h > 0;
    return Bo(u, b, _, function(w) {
      f || (f = w), w && n.forEach(kn), !b && (n.forEach(kn), i(f));
    });
  });
  return e.reduce(Ro);
}
var Co = To;
(function(t, e) {
  e = t.exports = Ff(), e.Stream = e, e.Readable = e, e.Writable = Cf(), e.Duplex = fr(), e.Transform = Lf, e.PassThrough = Mo, e.finished = sn, e.pipeline = Co;
})(Yi, Yi.exports);
var No = Yi.exports, kr = ut.Buffer, kf = No.Transform, Fo = ze;
function Lo(t, e) {
  if (!kr.isBuffer(t) && typeof t != "string")
    throw new TypeError(e + " must be a string or a buffer");
}
function $t(t) {
  kf.call(this), this._block = kr.allocUnsafe(t), this._blockSize = t, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
Fo($t, kf);
$t.prototype._transform = function(t, e, r) {
  var i = null;
  try {
    this.update(t, e);
  } catch (f) {
    i = f;
  }
  r(i);
};
$t.prototype._flush = function(t) {
  var e = null;
  try {
    this.push(this.digest());
  } catch (r) {
    e = r;
  }
  t(e);
};
$t.prototype.update = function(t, e) {
  if (Lo(t, "Data"), this._finalized)
    throw new Error("Digest already called");
  kr.isBuffer(t) || (t = kr.from(t, e));
  for (var r = this._block, i = 0; this._blockOffset + t.length - i >= this._blockSize; ) {
    for (var f = this._blockOffset; f < this._blockSize; )
      r[f++] = t[i++];
    this._update(), this._blockOffset = 0;
  }
  for (; i < t.length; )
    r[this._blockOffset++] = t[i++];
  for (var n = 0, u = t.length * 8; u > 0; ++n)
    this._length[n] += u, u = this._length[n] / 4294967296 | 0, u > 0 && (this._length[n] -= 4294967296 * u);
  return this;
};
$t.prototype._update = function() {
  throw new Error("_update is not implemented");
};
$t.prototype.digest = function(t) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var e = this._digest();
  t !== void 0 && (e = e.toString(t)), this._block.fill(0), this._blockOffset = 0;
  for (var r = 0; r < 4; ++r)
    this._length[r] = 0;
  return e;
};
$t.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var Uf = $t, Oo = ze, Df = Uf, $o = ut.Buffer, ko = new Array(16);
function Xr() {
  Df.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
Oo(Xr, Df);
Xr.prototype._update = function() {
  for (var t = ko, e = 0; e < 16; ++e)
    t[e] = this._block.readInt32LE(e * 4);
  var r = this._a, i = this._b, f = this._c, n = this._d;
  r = Ye(r, i, f, n, t[0], 3614090360, 7), n = Ye(n, r, i, f, t[1], 3905402710, 12), f = Ye(f, n, r, i, t[2], 606105819, 17), i = Ye(i, f, n, r, t[3], 3250441966, 22), r = Ye(r, i, f, n, t[4], 4118548399, 7), n = Ye(n, r, i, f, t[5], 1200080426, 12), f = Ye(f, n, r, i, t[6], 2821735955, 17), i = Ye(i, f, n, r, t[7], 4249261313, 22), r = Ye(r, i, f, n, t[8], 1770035416, 7), n = Ye(n, r, i, f, t[9], 2336552879, 12), f = Ye(f, n, r, i, t[10], 4294925233, 17), i = Ye(i, f, n, r, t[11], 2304563134, 22), r = Ye(r, i, f, n, t[12], 1804603682, 7), n = Ye(n, r, i, f, t[13], 4254626195, 12), f = Ye(f, n, r, i, t[14], 2792965006, 17), i = Ye(i, f, n, r, t[15], 1236535329, 22), r = Ge(r, i, f, n, t[1], 4129170786, 5), n = Ge(n, r, i, f, t[6], 3225465664, 9), f = Ge(f, n, r, i, t[11], 643717713, 14), i = Ge(i, f, n, r, t[0], 3921069994, 20), r = Ge(r, i, f, n, t[5], 3593408605, 5), n = Ge(n, r, i, f, t[10], 38016083, 9), f = Ge(f, n, r, i, t[15], 3634488961, 14), i = Ge(i, f, n, r, t[4], 3889429448, 20), r = Ge(r, i, f, n, t[9], 568446438, 5), n = Ge(n, r, i, f, t[14], 3275163606, 9), f = Ge(f, n, r, i, t[3], 4107603335, 14), i = Ge(i, f, n, r, t[8], 1163531501, 20), r = Ge(r, i, f, n, t[13], 2850285829, 5), n = Ge(n, r, i, f, t[2], 4243563512, 9), f = Ge(f, n, r, i, t[7], 1735328473, 14), i = Ge(i, f, n, r, t[12], 2368359562, 20), r = Ze(r, i, f, n, t[5], 4294588738, 4), n = Ze(n, r, i, f, t[8], 2272392833, 11), f = Ze(f, n, r, i, t[11], 1839030562, 16), i = Ze(i, f, n, r, t[14], 4259657740, 23), r = Ze(r, i, f, n, t[1], 2763975236, 4), n = Ze(n, r, i, f, t[4], 1272893353, 11), f = Ze(f, n, r, i, t[7], 4139469664, 16), i = Ze(i, f, n, r, t[10], 3200236656, 23), r = Ze(r, i, f, n, t[13], 681279174, 4), n = Ze(n, r, i, f, t[0], 3936430074, 11), f = Ze(f, n, r, i, t[3], 3572445317, 16), i = Ze(i, f, n, r, t[6], 76029189, 23), r = Ze(r, i, f, n, t[9], 3654602809, 4), n = Ze(n, r, i, f, t[12], 3873151461, 11), f = Ze(f, n, r, i, t[15], 530742520, 16), i = Ze(i, f, n, r, t[2], 3299628645, 23), r = Je(r, i, f, n, t[0], 4096336452, 6), n = Je(n, r, i, f, t[7], 1126891415, 10), f = Je(f, n, r, i, t[14], 2878612391, 15), i = Je(i, f, n, r, t[5], 4237533241, 21), r = Je(r, i, f, n, t[12], 1700485571, 6), n = Je(n, r, i, f, t[3], 2399980690, 10), f = Je(f, n, r, i, t[10], 4293915773, 15), i = Je(i, f, n, r, t[1], 2240044497, 21), r = Je(r, i, f, n, t[8], 1873313359, 6), n = Je(n, r, i, f, t[15], 4264355552, 10), f = Je(f, n, r, i, t[6], 2734768916, 15), i = Je(i, f, n, r, t[13], 1309151649, 21), r = Je(r, i, f, n, t[4], 4149444226, 6), n = Je(n, r, i, f, t[11], 3174756917, 10), f = Je(f, n, r, i, t[2], 718787259, 15), i = Je(i, f, n, r, t[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + i | 0, this._c = this._c + f | 0, this._d = this._d + n | 0;
};
Xr.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var t = $o.allocUnsafe(16);
  return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t;
};
function Qr(t, e) {
  return t << e | t >>> 32 - e;
}
function Ye(t, e, r, i, f, n, u) {
  return Qr(t + (e & r | ~e & i) + f + n | 0, u) + e | 0;
}
function Ge(t, e, r, i, f, n, u) {
  return Qr(t + (e & i | r & ~i) + f + n | 0, u) + e | 0;
}
function Ze(t, e, r, i, f, n, u) {
  return Qr(t + (e ^ r ^ i) + f + n | 0, u) + e | 0;
}
function Je(t, e, r, i, f, n, u) {
  return Qr(t + (r ^ (e | ~i)) + f + n | 0, u) + e | 0;
}
var Uo = Xr, zi = Se.Buffer, Do = ze, qf = Uf, qo = new Array(16), pr = [
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
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8,
  3,
  10,
  14,
  4,
  9,
  15,
  8,
  1,
  2,
  7,
  0,
  6,
  13,
  11,
  5,
  12,
  1,
  9,
  11,
  10,
  0,
  8,
  12,
  4,
  13,
  3,
  7,
  15,
  14,
  5,
  6,
  2,
  4,
  0,
  5,
  9,
  7,
  12,
  2,
  10,
  14,
  1,
  3,
  8,
  11,
  6,
  15,
  13
], vr = [
  5,
  14,
  7,
  0,
  9,
  2,
  11,
  4,
  13,
  6,
  15,
  8,
  1,
  10,
  3,
  12,
  6,
  11,
  3,
  7,
  0,
  13,
  5,
  10,
  14,
  15,
  8,
  12,
  4,
  9,
  1,
  2,
  15,
  5,
  1,
  3,
  7,
  14,
  6,
  9,
  11,
  8,
  12,
  2,
  10,
  0,
  4,
  13,
  8,
  6,
  4,
  1,
  3,
  11,
  15,
  0,
  5,
  12,
  2,
  13,
  9,
  7,
  10,
  14,
  12,
  15,
  10,
  4,
  1,
  5,
  8,
  7,
  6,
  2,
  13,
  14,
  0,
  3,
  9,
  11
], yr = [
  11,
  14,
  15,
  12,
  5,
  8,
  7,
  9,
  11,
  13,
  14,
  15,
  6,
  7,
  9,
  8,
  7,
  6,
  8,
  13,
  11,
  9,
  7,
  15,
  7,
  12,
  15,
  9,
  11,
  7,
  13,
  12,
  11,
  13,
  6,
  7,
  14,
  9,
  13,
  15,
  14,
  8,
  13,
  6,
  5,
  12,
  7,
  5,
  11,
  12,
  14,
  15,
  14,
  15,
  9,
  8,
  9,
  14,
  5,
  6,
  8,
  6,
  5,
  12,
  9,
  15,
  5,
  11,
  6,
  8,
  13,
  12,
  5,
  12,
  13,
  14,
  11,
  8,
  5,
  6
], gr = [
  8,
  9,
  9,
  11,
  13,
  15,
  15,
  5,
  7,
  7,
  8,
  11,
  14,
  14,
  12,
  6,
  9,
  13,
  15,
  7,
  12,
  8,
  9,
  11,
  7,
  7,
  12,
  7,
  6,
  15,
  13,
  11,
  9,
  7,
  15,
  11,
  8,
  6,
  6,
  14,
  12,
  13,
  5,
  14,
  13,
  13,
  7,
  5,
  15,
  5,
  8,
  11,
  14,
  14,
  6,
  14,
  6,
  9,
  12,
  9,
  12,
  5,
  15,
  8,
  8,
  5,
  12,
  9,
  12,
  5,
  14,
  6,
  8,
  13,
  6,
  5,
  15,
  13,
  11,
  11
], xr = [0, 1518500249, 1859775393, 2400959708, 2840853838], mr = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function ei() {
  qf.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
Do(ei, qf);
ei.prototype._update = function() {
  for (var t = qo, e = 0; e < 16; ++e)
    t[e] = this._block.readInt32LE(e * 4);
  for (var r = this._a | 0, i = this._b | 0, f = this._c | 0, n = this._d | 0, u = this._e | 0, h = this._a | 0, b = this._b | 0, _ = this._c | 0, w = this._d | 0, E = this._e | 0, P = 0; P < 80; P += 1) {
    var F, N;
    P < 16 ? (F = Un(r, i, f, n, u, t[pr[P]], xr[0], yr[P]), N = Kn(h, b, _, w, E, t[vr[P]], mr[0], gr[P])) : P < 32 ? (F = Dn(r, i, f, n, u, t[pr[P]], xr[1], yr[P]), N = zn(h, b, _, w, E, t[vr[P]], mr[1], gr[P])) : P < 48 ? (F = qn(r, i, f, n, u, t[pr[P]], xr[2], yr[P]), N = qn(h, b, _, w, E, t[vr[P]], mr[2], gr[P])) : P < 64 ? (F = zn(r, i, f, n, u, t[pr[P]], xr[3], yr[P]), N = Dn(h, b, _, w, E, t[vr[P]], mr[3], gr[P])) : (F = Kn(r, i, f, n, u, t[pr[P]], xr[4], yr[P]), N = Un(h, b, _, w, E, t[vr[P]], mr[4], gr[P])), r = u, u = n, n = jt(f, 10), f = i, i = F, h = E, E = w, w = jt(_, 10), _ = b, b = N;
  }
  var O = this._b + f + w | 0;
  this._b = this._c + n + E | 0, this._c = this._d + u + h | 0, this._d = this._e + r + b | 0, this._e = this._a + i + _ | 0, this._a = O;
};
ei.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var t = zi.alloc ? zi.alloc(20) : new zi(20);
  return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t.writeInt32LE(this._e, 16), t;
};
function jt(t, e) {
  return t << e | t >>> 32 - e;
}
function Un(t, e, r, i, f, n, u, h) {
  return jt(t + (e ^ r ^ i) + n + u | 0, h) + f | 0;
}
function Dn(t, e, r, i, f, n, u, h) {
  return jt(t + (e & r | ~e & i) + n + u | 0, h) + f | 0;
}
function qn(t, e, r, i, f, n, u, h) {
  return jt(t + ((e | ~r) ^ i) + n + u | 0, h) + f | 0;
}
function zn(t, e, r, i, f, n, u, h) {
  return jt(t + (e & i | r & ~i) + n + u | 0, h) + f | 0;
}
function Kn(t, e, r, i, f, n, u, h) {
  return jt(t + (e ^ (r | ~i)) + n + u | 0, h) + f | 0;
}
var zo = ei, zf = { exports: {} }, Kf = ut.Buffer;
function ti(t, e) {
  this._block = Kf.alloc(t), this._finalSize = e, this._blockSize = t, this._len = 0;
}
ti.prototype.update = function(t, e) {
  typeof t == "string" && (e = e || "utf8", t = Kf.from(t, e));
  for (var r = this._block, i = this._blockSize, f = t.length, n = this._len, u = 0; u < f; ) {
    for (var h = n % i, b = Math.min(f - u, i - h), _ = 0; _ < b; _++)
      r[h + _] = t[u + _];
    n += b, u += b, n % i === 0 && this._update(r);
  }
  return this._len += f, this;
};
ti.prototype.digest = function(t) {
  var e = this._len % this._blockSize;
  this._block[e] = 128, this._block.fill(0, e + 1), e >= this._finalSize && (this._update(this._block), this._block.fill(0));
  var r = this._len * 8;
  if (r <= 4294967295)
    this._block.writeUInt32BE(r, this._blockSize - 4);
  else {
    var i = (r & 4294967295) >>> 0, f = (r - i) / 4294967296;
    this._block.writeUInt32BE(f, this._blockSize - 8), this._block.writeUInt32BE(i, this._blockSize - 4);
  }
  this._update(this._block);
  var n = this._hash();
  return t ? n.toString(t) : n;
};
ti.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var ur = ti, Ko = ze, Hf = ur, Ho = ut.Buffer, Wo = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], jo = new Array(80);
function Ir() {
  this.init(), this._w = jo, Hf.call(this, 64, 56);
}
Ko(Ir, Hf);
Ir.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Vo(t) {
  return t << 5 | t >>> 27;
}
function Yo(t) {
  return t << 30 | t >>> 2;
}
function Go(t, e, r, i) {
  return t === 0 ? e & r | ~e & i : t === 2 ? e & r | e & i | r & i : e ^ r ^ i;
}
Ir.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, i = this._b | 0, f = this._c | 0, n = this._d | 0, u = this._e | 0, h = 0; h < 16; ++h)
    e[h] = t.readInt32BE(h * 4);
  for (; h < 80; ++h)
    e[h] = e[h - 3] ^ e[h - 8] ^ e[h - 14] ^ e[h - 16];
  for (var b = 0; b < 80; ++b) {
    var _ = ~~(b / 20), w = Vo(r) + Go(_, i, f, n) + u + e[b] + Wo[_] | 0;
    u = n, n = f, f = Yo(i), i = r, r = w;
  }
  this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = f + this._c | 0, this._d = n + this._d | 0, this._e = u + this._e | 0;
};
Ir.prototype._hash = function() {
  var t = Ho.allocUnsafe(20);
  return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
};
var Zo = Ir, Jo = ze, Wf = ur, Xo = ut.Buffer, Qo = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], ed = new Array(80);
function Br() {
  this.init(), this._w = ed, Wf.call(this, 64, 56);
}
Jo(Br, Wf);
Br.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function td(t) {
  return t << 1 | t >>> 31;
}
function rd(t) {
  return t << 5 | t >>> 27;
}
function id(t) {
  return t << 30 | t >>> 2;
}
function nd(t, e, r, i) {
  return t === 0 ? e & r | ~e & i : t === 2 ? e & r | e & i | r & i : e ^ r ^ i;
}
Br.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, i = this._b | 0, f = this._c | 0, n = this._d | 0, u = this._e | 0, h = 0; h < 16; ++h)
    e[h] = t.readInt32BE(h * 4);
  for (; h < 80; ++h)
    e[h] = td(e[h - 3] ^ e[h - 8] ^ e[h - 14] ^ e[h - 16]);
  for (var b = 0; b < 80; ++b) {
    var _ = ~~(b / 20), w = rd(r) + nd(_, i, f, n) + u + e[b] + Qo[_] | 0;
    u = n, n = f, f = id(i), i = r, r = w;
  }
  this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = f + this._c | 0, this._d = n + this._d | 0, this._e = u + this._e | 0;
};
Br.prototype._hash = function() {
  var t = Xo.allocUnsafe(20);
  return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
};
var fd = Br, ad = ze, jf = ur, sd = ut.Buffer, od = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
], dd = new Array(64);
function Rr() {
  this.init(), this._w = dd, jf.call(this, 64, 56);
}
ad(Rr, jf);
Rr.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function hd(t, e, r) {
  return r ^ t & (e ^ r);
}
function cd(t, e, r) {
  return t & e | r & (t | e);
}
function ud(t) {
  return (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10);
}
function ld(t) {
  return (t >>> 6 | t << 26) ^ (t >>> 11 | t << 21) ^ (t >>> 25 | t << 7);
}
function bd(t) {
  return (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
}
function pd(t) {
  return (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
}
Rr.prototype._update = function(t) {
  for (var e = this._w, r = this._a | 0, i = this._b | 0, f = this._c | 0, n = this._d | 0, u = this._e | 0, h = this._f | 0, b = this._g | 0, _ = this._h | 0, w = 0; w < 16; ++w)
    e[w] = t.readInt32BE(w * 4);
  for (; w < 64; ++w)
    e[w] = pd(e[w - 2]) + e[w - 7] + bd(e[w - 15]) + e[w - 16] | 0;
  for (var E = 0; E < 64; ++E) {
    var P = _ + ld(u) + hd(u, h, b) + od[E] + e[E] | 0, F = ud(r) + cd(r, i, f) | 0;
    _ = b, b = h, h = u, u = n + P | 0, n = f, f = i, i = r, r = P + F | 0;
  }
  this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = f + this._c | 0, this._d = n + this._d | 0, this._e = u + this._e | 0, this._f = h + this._f | 0, this._g = b + this._g | 0, this._h = _ + this._h | 0;
};
Rr.prototype._hash = function() {
  var t = sd.allocUnsafe(32);
  return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t.writeInt32BE(this._h, 28), t;
};
var Vf = Rr, vd = ze, yd = Vf, gd = ur, xd = ut.Buffer, md = new Array(64);
function ri() {
  this.init(), this._w = md, gd.call(this, 64, 56);
}
vd(ri, yd);
ri.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
ri.prototype._hash = function() {
  var t = xd.allocUnsafe(28);
  return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t;
};
var wd = ri, _d = ze, Yf = ur, Md = ut.Buffer, Hn = [
  1116352408,
  3609767458,
  1899447441,
  602891725,
  3049323471,
  3964484399,
  3921009573,
  2173295548,
  961987163,
  4081628472,
  1508970993,
  3053834265,
  2453635748,
  2937671579,
  2870763221,
  3664609560,
  3624381080,
  2734883394,
  310598401,
  1164996542,
  607225278,
  1323610764,
  1426881987,
  3590304994,
  1925078388,
  4068182383,
  2162078206,
  991336113,
  2614888103,
  633803317,
  3248222580,
  3479774868,
  3835390401,
  2666613458,
  4022224774,
  944711139,
  264347078,
  2341262773,
  604807628,
  2007800933,
  770255983,
  1495990901,
  1249150122,
  1856431235,
  1555081692,
  3175218132,
  1996064986,
  2198950837,
  2554220882,
  3999719339,
  2821834349,
  766784016,
  2952996808,
  2566594879,
  3210313671,
  3203337956,
  3336571891,
  1034457026,
  3584528711,
  2466948901,
  113926993,
  3758326383,
  338241895,
  168717936,
  666307205,
  1188179964,
  773529912,
  1546045734,
  1294757372,
  1522805485,
  1396182291,
  2643833823,
  1695183700,
  2343527390,
  1986661051,
  1014477480,
  2177026350,
  1206759142,
  2456956037,
  344077627,
  2730485921,
  1290863460,
  2820302411,
  3158454273,
  3259730800,
  3505952657,
  3345764771,
  106217008,
  3516065817,
  3606008344,
  3600352804,
  1432725776,
  4094571909,
  1467031594,
  275423344,
  851169720,
  430227734,
  3100823752,
  506948616,
  1363258195,
  659060556,
  3750685593,
  883997877,
  3785050280,
  958139571,
  3318307427,
  1322822218,
  3812723403,
  1537002063,
  2003034995,
  1747873779,
  3602036899,
  1955562222,
  1575990012,
  2024104815,
  1125592928,
  2227730452,
  2716904306,
  2361852424,
  442776044,
  2428436474,
  593698344,
  2756734187,
  3733110249,
  3204031479,
  2999351573,
  3329325298,
  3815920427,
  3391569614,
  3928383900,
  3515267271,
  566280711,
  3940187606,
  3454069534,
  4118630271,
  4000239992,
  116418474,
  1914138554,
  174292421,
  2731055270,
  289380356,
  3203993006,
  460393269,
  320620315,
  685471733,
  587496836,
  852142971,
  1086792851,
  1017036298,
  365543100,
  1126000580,
  2618297676,
  1288033470,
  3409855158,
  1501505948,
  4234509866,
  1607167915,
  987167468,
  1816402316,
  1246189591
], Sd = new Array(160);
function Pr() {
  this.init(), this._w = Sd, Yf.call(this, 128, 112);
}
_d(Pr, Yf);
Pr.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function Wn(t, e, r) {
  return r ^ t & (e ^ r);
}
function jn(t, e, r) {
  return t & e | r & (t | e);
}
function Vn(t, e) {
  return (t >>> 28 | e << 4) ^ (e >>> 2 | t << 30) ^ (e >>> 7 | t << 25);
}
function Yn(t, e) {
  return (t >>> 14 | e << 18) ^ (t >>> 18 | e << 14) ^ (e >>> 9 | t << 23);
}
function Ed(t, e) {
  return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ t >>> 7;
}
function Ad(t, e) {
  return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ (t >>> 7 | e << 25);
}
function Id(t, e) {
  return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ t >>> 6;
}
function Bd(t, e) {
  return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ (t >>> 6 | e << 26);
}
function Ke(t, e) {
  return t >>> 0 < e >>> 0 ? 1 : 0;
}
Pr.prototype._update = function(t) {
  for (var e = this._w, r = this._ah | 0, i = this._bh | 0, f = this._ch | 0, n = this._dh | 0, u = this._eh | 0, h = this._fh | 0, b = this._gh | 0, _ = this._hh | 0, w = this._al | 0, E = this._bl | 0, P = this._cl | 0, F = this._dl | 0, N = this._el | 0, O = this._fl | 0, D = this._gl | 0, k = this._hl | 0, z = 0; z < 32; z += 2)
    e[z] = t.readInt32BE(z * 4), e[z + 1] = t.readInt32BE(z * 4 + 4);
  for (; z < 160; z += 2) {
    var j = e[z - 30], K = e[z - 15 * 2 + 1], Y = Ed(j, K), Q = Ad(K, j);
    j = e[z - 2 * 2], K = e[z - 2 * 2 + 1];
    var se = Id(j, K), re = Bd(K, j), V = e[z - 7 * 2], Me = e[z - 7 * 2 + 1], A = e[z - 16 * 2], a = e[z - 16 * 2 + 1], c = Q + Me | 0, p = Y + V + Ke(c, Q) | 0;
    c = c + re | 0, p = p + se + Ke(c, re) | 0, c = c + a | 0, p = p + A + Ke(c, a) | 0, e[z] = p, e[z + 1] = c;
  }
  for (var v = 0; v < 160; v += 2) {
    p = e[v], c = e[v + 1];
    var M = jn(r, i, f), B = jn(w, E, P), C = Vn(r, w), x = Vn(w, r), o = Yn(u, N), g = Yn(N, u), H = Hn[v], Z = Hn[v + 1], J = Wn(u, h, b), ie = Wn(N, O, D), R = k + g | 0, T = _ + o + Ke(R, k) | 0;
    R = R + ie | 0, T = T + J + Ke(R, ie) | 0, R = R + Z | 0, T = T + H + Ke(R, Z) | 0, R = R + c | 0, T = T + p + Ke(R, c) | 0;
    var q = x + B | 0, W = C + M + Ke(q, x) | 0;
    _ = b, k = D, b = h, D = O, h = u, O = N, N = F + R | 0, u = n + T + Ke(N, F) | 0, n = f, F = P, f = i, P = E, i = r, E = w, w = R + q | 0, r = T + W + Ke(w, R) | 0;
  }
  this._al = this._al + w | 0, this._bl = this._bl + E | 0, this._cl = this._cl + P | 0, this._dl = this._dl + F | 0, this._el = this._el + N | 0, this._fl = this._fl + O | 0, this._gl = this._gl + D | 0, this._hl = this._hl + k | 0, this._ah = this._ah + r + Ke(this._al, w) | 0, this._bh = this._bh + i + Ke(this._bl, E) | 0, this._ch = this._ch + f + Ke(this._cl, P) | 0, this._dh = this._dh + n + Ke(this._dl, F) | 0, this._eh = this._eh + u + Ke(this._el, N) | 0, this._fh = this._fh + h + Ke(this._fl, O) | 0, this._gh = this._gh + b + Ke(this._gl, D) | 0, this._hh = this._hh + _ + Ke(this._hl, k) | 0;
};
Pr.prototype._hash = function() {
  var t = Md.allocUnsafe(64);
  function e(r, i, f) {
    t.writeInt32BE(r, f), t.writeInt32BE(i, f + 4);
  }
  return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), e(this._gh, this._gl, 48), e(this._hh, this._hl, 56), t;
};
var Gf = Pr, Rd = ze, Pd = Gf, Td = ur, Cd = ut.Buffer, Nd = new Array(160);
function ii() {
  this.init(), this._w = Nd, Td.call(this, 128, 112);
}
Rd(ii, Pd);
ii.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
ii.prototype._hash = function() {
  var t = Cd.allocUnsafe(48);
  function e(r, i, f) {
    t.writeInt32BE(r, f), t.writeInt32BE(i, f + 4);
  }
  return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), t;
};
var Fd = ii, Zt = zf.exports = function(e) {
  e = e.toLowerCase();
  var r = Zt[e];
  if (!r)
    throw new Error(e + " is not supported (we accept pull requests)");
  return new r();
};
Zt.sha = Zo;
Zt.sha1 = fd;
Zt.sha224 = wd;
Zt.sha256 = Vf;
Zt.sha384 = Fd;
Zt.sha512 = Gf;
var Ld = zf.exports, Zf = ut.Buffer, Jf = Ht.Transform, Od = $r.StringDecoder, $d = ze;
function lt(t) {
  Jf.call(this), this.hashMode = typeof t == "string", this.hashMode ? this[t] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
$d(lt, Jf);
lt.prototype.update = function(t, e, r) {
  typeof t == "string" && (t = Zf.from(t, e));
  var i = this._update(t);
  return this.hashMode ? this : (r && (i = this._toString(i, r)), i);
};
lt.prototype.setAutoPadding = function() {
};
lt.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
lt.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
lt.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
lt.prototype._transform = function(t, e, r) {
  var i;
  try {
    this.hashMode ? this._update(t) : this.push(this._update(t));
  } catch (f) {
    i = f;
  } finally {
    r(i);
  }
};
lt.prototype._flush = function(t) {
  var e;
  try {
    this.push(this.__final());
  } catch (r) {
    e = r;
  }
  t(e);
};
lt.prototype._finalOrDigest = function(t) {
  var e = this.__final() || Zf.alloc(0);
  return t && (e = this._toString(e, t, !0)), e;
};
lt.prototype._toString = function(t, e, r) {
  if (this._decoder || (this._decoder = new Od(e), this._encoding = e), this._encoding !== e)
    throw new Error("can't switch encodings");
  var i = this._decoder.write(t);
  return r && (i += this._decoder.end()), i;
};
var kd = lt, Ud = ze, Dd = Uo, qd = zo, zd = Ld, Xf = kd;
function ni(t) {
  Xf.call(this, "digest"), this._hash = t;
}
Ud(ni, Xf);
ni.prototype._update = function(t) {
  this._hash.update(t);
};
ni.prototype._final = function() {
  return this._hash.digest();
};
var Kd = function(e) {
  return e = e.toLowerCase(), e === "md5" ? new Dd() : e === "rmd160" || e === "ripemd160" ? new qd() : new ni(zd(e));
};
const on = /* @__PURE__ */ Gn(Kd), Hd = (t) => {
  const e = Se.Buffer.concat(
    t.map(
      (r) => Se.Buffer.concat([
        Se.Buffer.from(r.txid, "hex").reverse(),
        jd(r.vout)
      ])
    ).sort((r, i) => r.compare(i))
  );
  return on("sha256").update(e).digest();
}, Wd = (t) => {
  const e = t.map((r) => {
    const i = Se.Buffer.from(r.key, "hex");
    return r.isXOnly && Qe.publicKeyCreate(i, !0)[0] === 3 ? Qe.privateKeyNegate(i) : i;
  });
  return Se.Buffer.from(
    e.slice(1).reduce((r, i) => Qe.privateKeyTweakAdd(r, i), e[0])
  );
}, Qf = (t) => {
  const e = Se.Buffer.alloc(4);
  return e.writeUInt32BE(t), e;
}, jd = (t) => {
  const e = Se.Buffer.alloc(4);
  return e.writeUInt32LE(t), e;
}, Jd = (t, e, r, i = "tsp") => {
  var b;
  const f = Wd(t), n = Hd(e), u = /* @__PURE__ */ new Map();
  for (const { address: _, amount: w } of r) {
    const { scanKey: E, spendKey: P } = ks(_, i);
    u.has(E.toString("hex")) ? (b = u.get(E.toString("hex"))) == null || b.push({ spendKey: P, amount: w }) : u.set(E.toString("hex"), [{ spendKey: P, amount: w }]);
  }
  const h = [];
  for (const [_, w] of u.entries()) {
    const E = Se.Buffer.from(_, "hex"), P = Qe.publicKeyTweakMul(
      Qe.publicKeyTweakMul(E, n, !0),
      f
    );
    let F = 0;
    for (const { spendKey: N, amount: O } of w) {
      const D = on("sha256").update(Se.Buffer.concat([P, Qf(F)])).digest(), k = Qe.publicKeyTweakAdd(
        N,
        D,
        !0
      );
      h.push({
        pubkey: Se.Buffer.from(k),
        value: O
      }), F++;
    }
  }
  return h;
}, Vd = (t, e, r, i) => {
  const f = Qe.publicKeyNegate(e, !0);
  let n = Qe.publicKeyCombine([t, f], !0), u = i[Se.Buffer.from(n).toString("hex")];
  return u || (n = Qe.publicKeyCombine(
    [Qe.publicKeyNegate(t, !0), f],
    !0
  ), u = i[Se.Buffer.from(n).toString("hex")]), u ? Qe.privateKeyTweakAdd(
    r,
    Se.Buffer.from(u, "hex")
  ) : null;
}, Yd = (t, e, r, i, f) => {
  const n = Qe.publicKeyTweakAdd(
    t,
    e,
    !0
  );
  for (let u = 0; u < r.length; u++) {
    const h = r[u];
    if (h.subarray(1).equals(n.subarray(1)))
      return i.set(h.toString("hex"), e), r.splice(u, 1), 1;
    if (f) {
      const b = Vd(
        h,
        n,
        e,
        f
      );
      if (b)
        return i.set(
          h.toString("hex"),
          Se.Buffer.from(b)
        ), 1;
    }
  }
  return 0;
}, Xd = (t, e, r, i, f, n) => {
  const u = Qe.publicKeyTweakMul(
    r,
    Qe.privateKeyTweakMul(t, i),
    !0
  ), h = /* @__PURE__ */ new Map();
  let b = 0, _ = 0;
  do {
    const w = on("sha256").update(Se.Buffer.concat([u, Qf(b)])).digest();
    _ = Yd(
      e,
      w,
      f,
      h,
      n
    ), b += _;
  } while (_ > 0 && f.length > 0);
  return h;
};
export {
  Wd as calculateSumOfPrivateKeys,
  Jd as createOutputs,
  ks as decodeSilentPaymentAddress,
  Zd as encodeSilentPaymentAddress,
  Hd as hashOutpoints,
  Xd as scanOutputs
};
