var e = "undefined" != typeof self ? self : global;
const t = "undefined" != typeof navigator
  , i = t && "undefined" == typeof HTMLImageElement
  , n = !("undefined" == typeof global || "undefined" == typeof process || !process.versions || !process.versions.node)
  , s = e.Buffer
  , r = e.BigInt
  , a = !!s
  , o = e=>e;
function l(e, t=o) {
    if (n)
        try {
            return "function" == typeof require ? Promise.resolve(t(require(e))) : import(/* webpackIgnore: true */
            e).then(t)
        } catch (t) {
            console.warn("Couldn't load ".concat(e))
        }
}
let h = e.fetch;
const c = e=>h = e;
if (!e.fetch) {
    const e = l("http", (e=>e))
      , t = l("https", (e=>e))
      , i = (n,{headers: s}={})=>new Promise((async(r,a)=>{
        let {port: o, hostname: l, pathname: h, protocol: c, search: u} = new URL(n);
        const f = {
            method: "GET",
            hostname: l,
            path: encodeURI(h) + u,
            headers: s
        };
        "" !== o && (f.port = Number(o));
        const d = ("https:" === c ? await t : await e).request(f, (e=>{
            if (301 === e.statusCode || 302 === e.statusCode) {
                let t = new URL(e.headers.location,n).toString();
                return i(t, {
                    headers: s
                }).then(r).catch(a)
            }
            r({
                status: e.statusCode,
                arrayBuffer: ()=>new Promise((t=>{
                    let i = [];
                    e.on("data", (e=>i.push(e))),
                    e.on("end", (()=>t(Buffer.concat(i))))
                }
                ))
            })
        }
        ));
        d.on("error", a),
        d.end()
    }
    ));
    c(i)
}
function u(e, t, i) {
    return t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = i,
    e
}
const f = e=>p(e) ? void 0 : e
  , d = e=>void 0 !== e;
function p(e) {
    return void 0 === e || (e instanceof Map ? 0 === e.size : 0 === Object.values(e).filter(d).length)
}
function g(e) {
    let t = new Error(e);
    throw delete t.stack,
    t
}
function m(e) {
    return "" === (e = function(e) {
        for (; e.endsWith("\0"); )
            e = e.slice(0, -1);
        return e
    }(e).trim()) ? void 0 : e
}
function S(e) {
    let t = function(e) {
        let t = 0;
        return e.ifd0.enabled && (t += 1024),
        e.exif.enabled && (t += 2048),
        e.makerNote && (t += 2048),
        e.userComment && (t += 1024),
        e.gps.enabled && (t += 512),
        e.interop.enabled && (t += 100),
        e.ifd1.enabled && (t += 1024),
        t + 2048
    }(e);
    return e.jfif.enabled && (t += 50),
    e.xmp.enabled && (t += 2e4),
    e.iptc.enabled && (t += 14e3),
    e.icc.enabled && (t += 6e3),
    t
}
const C = e=>String.fromCharCode.apply(null, e)
  , y = "undefined" != typeof TextDecoder ? new TextDecoder("utf-8") : void 0;
function b(e) {
    return y ? y.decode(e) : a ? Buffer.from(e).toString("utf8") : decodeURIComponent(escape(C(e)))
}
class I {
    static from(e, t) {
        return e instanceof this && e.le === t ? e : new I(e,void 0,void 0,t)
    }
    constructor(e, t=0, i, n) {
        if ("boolean" == typeof n && (this.le = n),
        Array.isArray(e) && (e = new Uint8Array(e)),
        0 === e)
            this.byteOffset = 0,
            this.byteLength = 0;
        else if (e instanceof ArrayBuffer) {
            void 0 === i && (i = e.byteLength - t);
            let n = new DataView(e,t,i);
            this._swapDataView(n)
        } else if (e instanceof Uint8Array || e instanceof DataView || e instanceof I) {
            void 0 === i && (i = e.byteLength - t),
            (t += e.byteOffset) + i > e.byteOffset + e.byteLength && g("Creating view outside of available memory in ArrayBuffer");
            let n = new DataView(e.buffer,t,i);
            this._swapDataView(n)
        } else if ("number" == typeof e) {
            let t = new DataView(new ArrayBuffer(e));
            this._swapDataView(t)
        } else
            g("Invalid input argument for BufferView: " + e)
    }
    _swapArrayBuffer(e) {
        this._swapDataView(new DataView(e))
    }
    _swapBuffer(e) {
        this._swapDataView(new DataView(e.buffer,e.byteOffset,e.byteLength))
    }
    _swapDataView(e) {
        this.dataView = e,
        this.buffer = e.buffer,
        this.byteOffset = e.byteOffset,
        this.byteLength = e.byteLength
    }
    _lengthToEnd(e) {
        return this.byteLength - e
    }
    set(e, t, i=I) {
        return e instanceof DataView || e instanceof I ? e = new Uint8Array(e.buffer,e.byteOffset,e.byteLength) : e instanceof ArrayBuffer && (e = new Uint8Array(e)),
        e instanceof Uint8Array || g("BufferView.set(): Invalid data argument."),
        this.toUint8().set(e, t),
        new i(this,t,e.byteLength)
    }
    subarray(e, t) {
        return t = t || this._lengthToEnd(e),
        new I(this,e,t)
    }
    toUint8() {
        return new Uint8Array(this.buffer,this.byteOffset,this.byteLength)
    }
    getUint8Array(e, t) {
        return new Uint8Array(this.buffer,this.byteOffset + e,t)
    }
    getString(e=0, t=this.byteLength) {
        return b(this.getUint8Array(e, t))
    }
    getLatin1String(e=0, t=this.byteLength) {
        let i = this.getUint8Array(e, t);
        return C(i)
    }
    getUnicodeString(e=0, t=this.byteLength) {
        const i = [];
        for (let n = 0; n < t && e + n < this.byteLength; n += 2)
            i.push(this.getUint16(e + n));
        return C(i)
    }
    getInt8(e) {
        return this.dataView.getInt8(e)
    }
    getUint8(e) {
        return this.dataView.getUint8(e)
    }
    getInt16(e, t=this.le) {
        return this.dataView.getInt16(e, t)
    }
    getInt32(e, t=this.le) {
        return this.dataView.getInt32(e, t)
    }
    getUint16(e, t=this.le) {
        return this.dataView.getUint16(e, t)
    }
    getUint32(e, t=this.le) {
        return this.dataView.getUint32(e, t)
    }
    getFloat32(e, t=this.le) {
        return this.dataView.getFloat32(e, t)
    }
    getFloat64(e, t=this.le) {
        return this.dataView.getFloat64(e, t)
    }
    getFloat(e, t=this.le) {
        return this.dataView.getFloat32(e, t)
    }
    getDouble(e, t=this.le) {
        return this.dataView.getFloat64(e, t)
    }
    getUintBytes(e, t, i) {
        switch (t) {
        case 1:
            return this.getUint8(e, i);
        case 2:
            return this.getUint16(e, i);
        case 4:
            return this.getUint32(e, i);
        case 8:
            return this.getUint64 && this.getUint64(e, i)
        }
    }
    getUint(e, t, i) {
        switch (t) {
        case 8:
            return this.getUint8(e, i);
        case 16:
            return this.getUint16(e, i);
        case 32:
            return this.getUint32(e, i);
        case 64:
            return this.getUint64 && this.getUint64(e, i)
        }
    }
    toString(e) {
        return this.dataView.toString(e, this.constructor.name)
    }
    ensureChunk() {}
}
function P(e, t) {
    g("".concat(e, " '").concat(t, "' was not loaded, try using full build of exifr."))
}
class k extends Map {
    constructor(e) {
        super(),
        this.kind = e
    }
    get(e, t) {
        return this.has(e) || P(this.kind, e),
        t && (e in t || function(e, t) {
            g("Unknown ".concat(e, " '").concat(t, "'."))
        }(this.kind, e),
        t[e].enabled || P(this.kind, e)),
        super.get(e)
    }
    keyList() {
        return Array.from(this.keys())
    }
}
var w = new k("file parser")
  , T = new k("segment parser")
  , A = new k("file reader");
function D(e, n) {
    return "string" == typeof e ? O(e, n) : t && !i && e instanceof HTMLImageElement ? O(e.src, n) : e instanceof Uint8Array || e instanceof ArrayBuffer || e instanceof DataView ? new I(e) : t && e instanceof Blob ? x(e, n, "blob", R) : void g("Invalid input argument")
}
function O(e, i) {
    return (s = e).startsWith("data:") || s.length > 1e4 ? v(e, i, "base64") : n && e.includes("://") ? x(e, i, "url", M) : n ? v(e, i, "fs") : t ? x(e, i, "url", M) : void g("Invalid input argument");
    var s
}
async function x(e, t, i, n) {
    return A.has(i) ? v(e, t, i) : n ? async function(e, t) {
        let i = await t(e);
        return new I(i)
    }(e, n) : void g("Parser ".concat(i, " is not loaded"))
}
async function v(e, t, i) {
    let n = new (A.get(i))(e,t);
    return await n.read(),
    n
}
const M = e=>h(e).then((e=>e.arrayBuffer()))
  , R = e=>new Promise(((t,i)=>{
    let n = new FileReader;
    n.onloadend = ()=>t(n.result || new ArrayBuffer),
    n.onerror = i,
    n.readAsArrayBuffer(e)
}
));
class L extends Map {
    get tagKeys() {
        return this.allKeys || (this.allKeys = Array.from(this.keys())),
        this.allKeys
    }
    get tagValues() {
        return this.allValues || (this.allValues = Array.from(this.values())),
        this.allValues
    }
}
function U(e, t, i) {
    let n = new L;
    for (let[e,t] of i)
        n.set(e, t);
    if (Array.isArray(t))
        for (let i of t)
            e.set(i, n);
    else
        e.set(t, n);
    return n
}
function F(e, t, i) {
    let n, s = e.get(t);
    for (n of i)
        s.set(n[0], n[1])
}
const E = new Map
  , B = new Map
  , N = new Map
  , G = ["chunked", "firstChunkSize", "firstChunkSizeNode", "firstChunkSizeBrowser", "chunkSize", "chunkLimit"]
  , V = ["jfif", "xmp", "icc", "iptc", "ihdr"]
  , z = ["tiff", ...V]
  , H = ["ifd0", "ifd1", "exif", "gps", "interop"]
  , j = [...z, ...H]
  , W = ["makerNote", "userComment"]
  , K = ["translateKeys", "translateValues", "reviveValues", "multiSegment"]
  , X = [...K, "sanitize", "mergeOutput", "silentErrors"];
class _ {
    get translate() {
        return this.translateKeys || this.translateValues || this.reviveValues
    }
}
class Y extends _ {
    get needed() {
        return this.enabled || this.deps.size > 0
    }
    constructor(e, t, i, n) {
        if (super(),
        u(this, "enabled", !1),
        u(this, "skip", new Set),
        u(this, "pick", new Set),
        u(this, "deps", new Set),
        u(this, "translateKeys", !1),
        u(this, "translateValues", !1),
        u(this, "reviveValues", !1),
        this.key = e,
        this.enabled = t,
        this.parse = this.enabled,
        this.applyInheritables(n),
        this.canBeFiltered = H.includes(e),
        this.canBeFiltered && (this.dict = E.get(e)),
        void 0 !== i)
            if (Array.isArray(i))
                this.parse = this.enabled = !0,
                this.canBeFiltered && i.length > 0 && this.translateTagSet(i, this.pick);
            else if ("object" == typeof i) {
                if (this.enabled = !0,
                this.parse = !1 !== i.parse,
                this.canBeFiltered) {
                    let {pick: e, skip: t} = i;
                    e && e.length > 0 && this.translateTagSet(e, this.pick),
                    t && t.length > 0 && this.translateTagSet(t, this.skip)
                }
                this.applyInheritables(i)
            } else
                !0 === i || !1 === i ? this.parse = this.enabled = i : g("Invalid options argument: ".concat(i))
    }
    applyInheritables(e) {
        let t, i;
        for (t of K)
            i = e[t],
            void 0 !== i && (this[t] = i)
    }
    translateTagSet(e, t) {
        if (this.dict) {
            let i, n, {tagKeys: s, tagValues: r} = this.dict;
            for (i of e)
                "string" == typeof i ? (n = r.indexOf(i),
                -1 === n && (n = s.indexOf(Number(i))),
                -1 !== n && t.add(Number(s[n]))) : t.add(i)
        } else
            for (let i of e)
                t.add(i)
    }
    finalizeFilters() {
        !this.enabled && this.deps.size > 0 ? (this.enabled = !0,
        ee(this.pick, this.deps)) : this.enabled && this.pick.size > 0 && ee(this.pick, this.deps)
    }
}
var J = {
    jfif: !1,
    tiff: !0,
    xmp: !1,
    icc: !1,
    iptc: !1,
    ifd0: !0,
    ifd1: !1,
    exif: !0,
    gps: !0,
    interop: !1,
    ihdr: void 0,
    makerNote: !1,
    userComment: !1,
    multiSegment: !1,
    skip: [],
    pick: [],
    translateKeys: !0,
    translateValues: !0,
    reviveValues: !0,
    sanitize: !0,
    mergeOutput: !0,
    silentErrors: !0,
    chunked: !0,
    firstChunkSize: void 0,
    firstChunkSizeNode: 512,
    firstChunkSizeBrowser: 65536,
    chunkSize: 65536,
    chunkLimit: 5
}
  , q = new Map;
class Q extends _ {
    static useCached(e) {
        let t = q.get(e);
        return void 0 !== t || (t = new this(e),
        q.set(e, t)),
        t
    }
    constructor(e) {
        super(),
        !0 === e ? this.setupFromTrue() : void 0 === e ? this.setupFromUndefined() : Array.isArray(e) ? this.setupFromArray(e) : "object" == typeof e ? this.setupFromObject(e) : g("Invalid options argument ".concat(e)),
        void 0 === this.firstChunkSize && (this.firstChunkSize = t ? this.firstChunkSizeBrowser : this.firstChunkSizeNode),
        this.mergeOutput && (this.ifd1.enabled = !1),
        this.filterNestedSegmentTags(),
        this.traverseTiffDependencyTree(),
        this.checkLoadedPlugins()
    }
    setupFromUndefined() {
        let e;
        for (e of G)
            this[e] = J[e];
        for (e of X)
            this[e] = J[e];
        for (e of W)
            this[e] = J[e];
        for (e of j)
            this[e] = new Y(e,J[e],void 0,this)
    }
    setupFromTrue() {
        let e;
        for (e of G)
            this[e] = J[e];
        for (e of X)
            this[e] = J[e];
        for (e of W)
            this[e] = !0;
        for (e of j)
            this[e] = new Y(e,!0,void 0,this)
    }
    setupFromArray(e) {
        let t;
        for (t of G)
            this[t] = J[t];
        for (t of X)
            this[t] = J[t];
        for (t of W)
            this[t] = J[t];
        for (t of j)
            this[t] = new Y(t,!1,void 0,this);
        this.setupGlobalFilters(e, void 0, H)
    }
    setupFromObject(e) {
        let t;
        for (t of (H.ifd0 = H.ifd0 || H.image,
        H.ifd1 = H.ifd1 || H.thumbnail,
        Object.assign(this, e),
        G))
            this[t] = $(e[t], J[t]);
        for (t of X)
            this[t] = $(e[t], J[t]);
        for (t of W)
            this[t] = $(e[t], J[t]);
        for (t of z)
            this[t] = new Y(t,J[t],e[t],this);
        for (t of H)
            this[t] = new Y(t,J[t],e[t],this.tiff);
        this.setupGlobalFilters(e.pick, e.skip, H, j),
        !0 === e.tiff ? this.batchEnableWithBool(H, !0) : !1 === e.tiff ? this.batchEnableWithUserValue(H, e) : Array.isArray(e.tiff) ? this.setupGlobalFilters(e.tiff, void 0, H) : "object" == typeof e.tiff && this.setupGlobalFilters(e.tiff.pick, e.tiff.skip, H)
    }
    batchEnableWithBool(e, t) {
        for (let i of e)
            this[i].enabled = t
    }
    batchEnableWithUserValue(e, t) {
        for (let i of e) {
            let e = t[i];
            this[i].enabled = !1 !== e && void 0 !== e
        }
    }
    setupGlobalFilters(e, t, i, n=i) {
        if (e && e.length) {
            for (let e of n)
                this[e].enabled = !1;
            let t = Z(e, i);
            for (let[e,i] of t)
                ee(this[e].pick, i),
                this[e].enabled = !0
        } else if (t && t.length) {
            let e = Z(t, i);
            for (let[t,i] of e)
                ee(this[t].skip, i)
        }
    }
    filterNestedSegmentTags() {
        let {ifd0: e, exif: t, xmp: i, iptc: n, icc: s} = this;
        this.makerNote ? t.deps.add(37500) : t.skip.add(37500),
        this.userComment ? t.deps.add(37510) : t.skip.add(37510),
        i.enabled || e.skip.add(700),
        n.enabled || e.skip.add(33723),
        s.enabled || e.skip.add(34675)
    }
    traverseTiffDependencyTree() {
        let {ifd0: e, exif: t, gps: i, interop: n} = this;
        n.needed && (t.deps.add(40965),
        e.deps.add(40965)),
        t.needed && e.deps.add(34665),
        i.needed && e.deps.add(34853),
        this.tiff.enabled = H.some((e=>!0 === this[e].enabled)) || this.makerNote || this.userComment;
        for (let e of H)
            this[e].finalizeFilters()
    }
    get onlyTiff() {
        return !V.map((e=>this[e].enabled)).some((e=>!0 === e)) && this.tiff.enabled
    }
    checkLoadedPlugins() {
        for (let e of z)
            this[e].enabled && !T.has(e) && P("segment parser", e)
    }
}
function Z(e, t) {
    let i, n, s, r, a = [];
    for (s of t) {
        for (r of (i = E.get(s),
        n = [],
        i))
            (e.includes(r[0]) || e.includes(r[1])) && n.push(r[0]);
        n.length && a.push([s, n])
    }
    return a
}
function $(e, t) {
    return void 0 !== e ? e : void 0 !== t ? t : void 0
}
function ee(e, t) {
    for (let i of t)
        e.add(i)
}
u(Q, "default", J);
class te {
    constructor(e) {
        u(this, "parsers", {}),
        u(this, "output", {}),
        u(this, "errors", []),
        u(this, "pushToErrors", (e=>this.errors.push(e))),
        this.options = Q.useCached(e)
    }
    async read(e) {
        this.file = await D(e, this.options)
    }
    setup() {
        if (this.fileParser)
            return;
        let {file: e} = this
          , t = e.getUint16(0);
        for (let[i,n] of w)
            if (n.canHandle(e, t))
                return this.fileParser = new n(this.options,this.file,this.parsers),
                e[i] = !0;
        this.file.close && this.file.close(),
        g("Unknown file format")
    }
    async parse() {
        let {output: e, errors: t} = this;
        return this.setup(),
        this.options.silentErrors ? (await this.executeParsers().catch(this.pushToErrors),
        t.push(...this.fileParser.errors)) : await this.executeParsers(),
        this.file.close && this.file.close(),
        this.options.silentErrors && t.length > 0 && (e.errors = t),
        f(e)
    }
    async executeParsers() {
        let {output: e} = this;
        await this.fileParser.parse();
        let t = Object.values(this.parsers).map((async t=>{
            let i = await t.parse();
            t.assignToOutput(e, i)
        }
        ));
        this.options.silentErrors && (t = t.map((e=>e.catch(this.pushToErrors)))),
        await Promise.all(t)
    }
    async extractThumbnail() {
        this.setup();
        let {options: e, file: t} = this
          , i = T.get("tiff", e);
        var n;
        if (t.tiff ? n = {
            start: 0,
            type: "tiff"
        } : t.jpeg && (n = await this.fileParser.getOrFindSegment("tiff")),
        void 0 === n)
            return;
        let s = await this.fileParser.ensureSegmentChunk(n)
          , r = this.parsers.tiff = new i(s,e,t)
          , a = await r.extractThumbnail();
        return t.close && t.close(),
        a
    }
}
async function ie(e, t) {
    let i = new te(t);
    return await i.read(e),
    i.parse()
}
var ne = Object.freeze({
    __proto__: null,
    parse: ie,
    Exifr: te,
    fileParsers: w,
    segmentParsers: T,
    fileReaders: A,
    tagKeys: E,
    tagValues: B,
    tagRevivers: N,
    createDictionary: U,
    extendDictionary: F,
    fetchUrlAsArrayBuffer: M,
    readBlobAsArrayBuffer: R,
    chunkedProps: G,
    otherSegments: V,
    segments: z,
    tiffBlocks: H,
    segmentsAndBlocks: j,
    tiffExtractables: W,
    inheritables: K,
    allFormatters: X,
    Options: Q
});
class se {
    constructor(e, t, i) {
        u(this, "errors", []),
        u(this, "ensureSegmentChunk", (async e=>{
            let t = e.start
              , i = e.size || 65536;
            if (this.file.chunked)
                if (this.file.available(t, i))
                    e.chunk = this.file.subarray(t, i);
                else
                    try {
                        e.chunk = await this.file.readChunk(t, i)
                    } catch (t) {
                        g("Couldn't read segment: ".concat(JSON.stringify(e), ". ").concat(t.message))
                    }
            else
                this.file.byteLength > t + i ? e.chunk = this.file.subarray(t, i) : void 0 === e.size ? e.chunk = this.file.subarray(t) : g("Segment unreachable: " + JSON.stringify(e));
            return e.chunk
        }
        )),
        this.extendOptions && this.extendOptions(e),
        this.options = e,
        this.file = t,
        this.parsers = i
    }
    injectSegment(e, t) {
        this.options[e].enabled && this.createParser(e, t)
    }
    createParser(e, t) {
        let i = new (T.get(e))(t,this.options,this.file);
        return this.parsers[e] = i
    }
    createParsers(e) {
        for (let t of e) {
            let {type: e, chunk: i} = t
              , n = this.options[e];
            if (n && n.enabled) {
                let t = this.parsers[e];
                t && t.append || t || this.createParser(e, i)
            }
        }
    }
    async readSegments(e) {
        let t = e.map(this.ensureSegmentChunk);
        await Promise.all(t)
    }
}
class re {
    static findPosition(e, t) {
        let i = e.getUint16(t + 2) + 2
          , n = "function" == typeof this.headerLength ? this.headerLength(e, t, i) : this.headerLength
          , s = t + n
          , r = i - n;
        return {
            offset: t,
            length: i,
            headerLength: n,
            start: s,
            size: r,
            end: s + r
        }
    }
    static parse(e, t={}) {
        return new this(e,new Q({
            [this.type]: t
        }),e).parse()
    }
    normalizeInput(e) {
        return e instanceof I ? e : new I(e)
    }
    constructor(e, t={}, i) {
        u(this, "errors", []),
        u(this, "raw", new Map),
        u(this, "handleError", (e=>{
            if (!this.options.silentErrors)
                throw e;
            this.errors.push(e.message)
        }
        )),
        this.chunk = this.normalizeInput(e),
        this.file = i,
        this.type = this.constructor.type,
        this.globalOptions = this.options = t,
        this.localOptions = t[this.type],
        this.canTranslate = this.localOptions && this.localOptions.translate
    }
    translate() {
        this.canTranslate && (this.translated = this.translateBlock(this.raw, this.type))
    }
    get output() {
        return this.translated ? this.translated : this.raw ? Object.fromEntries(this.raw) : void 0
    }
    translateBlock(e, t) {
        let i = N.get(t)
          , n = B.get(t)
          , s = E.get(t)
          , r = this.options[t]
          , a = r.reviveValues && !!i
          , o = r.translateValues && !!n
          , l = r.translateKeys && !!s
          , h = {};
        for (let[t,r] of e)
            a && i.has(t) ? r = i.get(t)(r) : o && n.has(t) && (r = this.translateValue(r, n.get(t))),
            l && s.has(t) && (t = s.get(t) || t),
            h[t] = r;
        return h
    }
    translateValue(e, t) {
        return t[e] || t.DEFAULT || e
    }
    assignToOutput(e, t) {
        this.assignObjectToOutput(e, this.constructor.type, t)
    }
    assignObjectToOutput(e, t, i) {
        if (this.globalOptions.mergeOutput)
            return Object.assign(e, i);
        e[t] ? Object.assign(e[t], i) : e[t] = i
    }
}
u(re, "headerLength", 4),
u(re, "type", void 0),
u(re, "multiSegment", !1),
u(re, "canHandle", (()=>!1));
function ae(e) {
    return 192 === e || 194 === e || 196 === e || 219 === e || 221 === e || 218 === e || 254 === e
}
function oe(e) {
    return e >= 224 && e <= 239
}
function le(e, t, i) {
    for (let[n,s] of T)
        if (s.canHandle(e, t, i))
            return n
}
class he extends se {
    constructor(...e) {
        super(...e),
        u(this, "appSegments", []),
        u(this, "jpegSegments", []),
        u(this, "unknownSegments", [])
    }
    static canHandle(e, t) {
        return 65496 === t
    }
    async parse() {
        await this.findAppSegments(),
        await this.readSegments(this.appSegments),
        this.mergeMultiSegments(),
        this.createParsers(this.mergedAppSegments || this.appSegments)
    }
    setupSegmentFinderArgs(e) {
        !0 === e ? (this.findAll = !0,
        this.wanted = new Set(T.keyList())) : (e = void 0 === e ? T.keyList().filter((e=>this.options[e].enabled)) : e.filter((e=>this.options[e].enabled && T.has(e))),
        this.findAll = !1,
        this.remaining = new Set(e),
        this.wanted = new Set(e)),
        this.unfinishedMultiSegment = !1
    }
    async findAppSegments(e=0, t) {
        this.setupSegmentFinderArgs(t);
        let {file: i, findAll: n, wanted: s, remaining: r} = this;
        if (!n && this.file.chunked && (n = Array.from(s).some((e=>{
            let t = T.get(e)
              , i = this.options[e];
            return t.multiSegment && i.multiSegment
        }
        )),
        n && await this.file.readWhole()),
        e = this.findAppSegmentsInRange(e, i.byteLength),
        !this.options.onlyTiff && i.chunked) {
            let t = !1;
            for (; r.size > 0 && !t && (i.canReadNextChunk || this.unfinishedMultiSegment); ) {
                let {nextChunkOffset: n} = i
                  , s = this.appSegments.some((e=>!this.file.available(e.offset || e.start, e.length || e.size)));
                if (t = e > n && !s ? !await i.readNextChunk(e) : !await i.readNextChunk(n),
                void 0 === (e = this.findAppSegmentsInRange(e, i.byteLength)))
                    return
            }
        }
    }
    findAppSegmentsInRange(e, t) {
        t -= 2;
        let i, n, s, r, a, o, {file: l, findAll: h, wanted: c, remaining: u, options: f} = this;
        for (; e < t; e++)
            if (255 === l.getUint8(e))
                if (i = l.getUint8(e + 1),
                oe(i)) {
                    if (n = l.getUint16(e + 2),
                    s = le(l, e, n),
                    s && c.has(s) && (r = T.get(s),
                    a = r.findPosition(l, e),
                    o = f[s],
                    a.type = s,
                    this.appSegments.push(a),
                    !h && (r.multiSegment && o.multiSegment ? (this.unfinishedMultiSegment = a.chunkNumber < a.chunkCount,
                    this.unfinishedMultiSegment || u.delete(s)) : u.delete(s),
                    0 === u.size)))
                        break;
                    f.recordUnknownSegments && (a = re.findPosition(l, e),
                    a.marker = i,
                    this.unknownSegments.push(a)),
                    e += n + 1
                } else if (ae(i)) {
                    if (n = l.getUint16(e + 2),
                    218 === i && !1 !== f.stopAfterSos)
                        return;
                    f.recordJpegSegments && this.jpegSegments.push({
                        offset: e,
                        length: n,
                        marker: i
                    }),
                    e += n + 1
                }
        return e
    }
    mergeMultiSegments() {
        if (!this.appSegments.some((e=>e.multiSegment)))
            return;
        let e = function(e, t) {
            let i, n, s, r = new Map;
            for (let a = 0; a < e.length; a++)
                i = e[a],
                n = i[t],
                r.has(n) ? s = r.get(n) : r.set(n, s = []),
                s.push(i);
            return Array.from(r)
        }(this.appSegments, "type");
        this.mergedAppSegments = e.map((([e,t])=>{
            let i = T.get(e, this.options);
            if (i.handleMultiSegments) {
                return {
                    type: e,
                    chunk: i.handleMultiSegments(t)
                }
            }
            return t[0]
        }
        ))
    }
    getSegment(e) {
        return this.appSegments.find((t=>t.type === e))
    }
    async getOrFindSegment(e) {
        let t = this.getSegment(e);
        return void 0 === t && (await this.findAppSegments(0, [e]),
        t = this.getSegment(e)),
        t
    }
}
u(he, "type", "jpeg"),
w.set("jpeg", he);
const ce = [void 0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4];
class ue extends re {
    parseHeader() {
        var e = this.chunk.getUint16();
        18761 === e ? this.le = !0 : 19789 === e && (this.le = !1),
        this.chunk.le = this.le,
        this.headerParsed = !0
    }
    parseTags(e, t, i=new Map) {
        let {pick: n, skip: s} = this.options[t];
        n = new Set(n);
        let r = n.size > 0
          , a = 0 === s.size
          , o = this.chunk.getUint16(e);
        e += 2;
        for (let l = 0; l < o; l++) {
            let o = this.chunk.getUint16(e);
            if (r) {
                if (n.has(o) && (i.set(o, this.parseTag(e, o, t)),
                n.delete(o),
                0 === n.size))
                    break
            } else
                !a && s.has(o) || i.set(o, this.parseTag(e, o, t));
            e += 12
        }
        return i
    }
    parseTag(e, t, i) {
        let {chunk: n} = this
          , s = n.getUint16(e + 2)
          , r = n.getUint32(e + 4)
          , a = ce[s];
        if (a * r <= 4 ? e += 8 : e = n.getUint32(e + 8),
        (s < 1 || s > 13) && g("Invalid TIFF value type. block: ".concat(i.toUpperCase(), ", tag: ").concat(t.toString(16), ", type: ").concat(s, ", offset ").concat(e)),
        e > n.byteLength && g("Invalid TIFF value offset. block: ".concat(i.toUpperCase(), ", tag: ").concat(t.toString(16), ", type: ").concat(s, ", offset ").concat(e, " is outside of chunk size ").concat(n.byteLength)),
        1 === s)
            return n.getUint8Array(e, r);
        if (2 === s)
            return m(n.getString(e, r));
        if (7 === s)
            return n.getUint8Array(e, r);
        if (1 === r)
            return this.parseTagValue(s, e);
        {
            let t = new (function(e) {
                switch (e) {
                case 1:
                    return Uint8Array;
                case 3:
                    return Uint16Array;
                case 4:
                    return Uint32Array;
                case 5:
                    return Array;
                case 6:
                    return Int8Array;
                case 8:
                    return Int16Array;
                case 9:
                    return Int32Array;
                case 10:
                    return Array;
                case 11:
                    return Float32Array;
                case 12:
                    return Float64Array;
                default:
                    return Array
                }
            }(s))(r)
              , i = a;
            for (let n = 0; n < r; n++)
                t[n] = this.parseTagValue(s, e),
                e += i;
            return t
        }
    }
    parseTagValue(e, t) {
        let {chunk: i} = this;
        switch (e) {
        case 1:
            return i.getUint8(t);
        case 3:
            return i.getUint16(t);
        case 4:
            return i.getUint32(t);
        case 5:
            return i.getUint32(t) / i.getUint32(t + 4);
        case 6:
            return i.getInt8(t);
        case 8:
            return i.getInt16(t);
        case 9:
            return i.getInt32(t);
        case 10:
            return i.getInt32(t) / i.getInt32(t + 4);
        case 11:
            return i.getFloat(t);
        case 12:
            return i.getDouble(t);
        case 13:
            return i.getUint32(t);
        default:
            g("Invalid tiff type ".concat(e))
        }
    }
}
class fe extends ue {
    static canHandle(e, t) {
        return 225 === e.getUint8(t + 1) && 1165519206 === e.getUint32(t + 4) && 0 === e.getUint16(t + 8)
    }
    async parse() {
        this.parseHeader();
        let {options: e} = this;
        return e.ifd0.enabled && await this.parseIfd0Block(),
        e.exif.enabled && await this.safeParse("parseExifBlock"),
        e.gps.enabled && await this.safeParse("parseGpsBlock"),
        e.interop.enabled && await this.safeParse("parseInteropBlock"),
        e.ifd1.enabled && await this.safeParse("parseThumbnailBlock"),
        this.createOutput()
    }
    safeParse(e) {
        let t = this[e]();
        return void 0 !== t.catch && (t = t.catch(this.handleError)),
        t
    }
    findIfd0Offset() {
        void 0 === this.ifd0Offset && (this.ifd0Offset = this.chunk.getUint32(4))
    }
    findIfd1Offset() {
        if (void 0 === this.ifd1Offset) {
            this.findIfd0Offset();
            let e = this.chunk.getUint16(this.ifd0Offset)
              , t = this.ifd0Offset + 2 + 12 * e;
            this.ifd1Offset = this.chunk.getUint32(t)
        }
    }
    parseBlock(e, t) {
        let i = new Map;
        return this[t] = i,
        this.parseTags(e, t, i),
        i
    }
    async parseIfd0Block() {
        if (this.ifd0)
            return;
        let {file: e} = this;
        this.findIfd0Offset(),
        this.ifd0Offset < 8 && g("Malformed EXIF data"),
        !e.chunked && this.ifd0Offset > e.byteLength && g("IFD0 offset points to outside of file.\nthis.ifd0Offset: ".concat(this.ifd0Offset, ", file.byteLength: ").concat(e.byteLength)),
        e.tiff && await e.ensureChunk(this.ifd0Offset, S(this.options));
        let t = this.parseBlock(this.ifd0Offset, "ifd0");
        return 0 !== t.size ? (this.exifOffset = t.get(34665),
        this.interopOffset = t.get(40965),
        this.gpsOffset = t.get(34853),
        this.xmp = t.get(700),
        this.iptc = t.get(33723),
        this.icc = t.get(34675),
        this.options.sanitize && (t.delete(34665),
        t.delete(40965),
        t.delete(34853),
        t.delete(700),
        t.delete(33723),
        t.delete(34675)),
        t) : void 0
    }
    async parseExifBlock() {
        if (this.exif)
            return;
        if (this.ifd0 || await this.parseIfd0Block(),
        void 0 === this.exifOffset)
            return;
        this.file.tiff && await this.file.ensureChunk(this.exifOffset, S(this.options));
        let e = this.parseBlock(this.exifOffset, "exif");
        return this.interopOffset || (this.interopOffset = e.get(40965)),
        this.makerNote = e.get(37500),
        this.userComment = e.get(37510),
        this.options.sanitize && (e.delete(40965),
        e.delete(37500),
        e.delete(37510)),
        this.unpack(e, 41728),
        this.unpack(e, 41729),
        e
    }
    unpack(e, t) {
        let i = e.get(t);
        i && 1 === i.length && e.set(t, i[0])
    }
    async parseGpsBlock() {
        if (this.gps)
            return;
        if (this.ifd0 || await this.parseIfd0Block(),
        void 0 === this.gpsOffset)
            return;
        let e = this.parseBlock(this.gpsOffset, "gps");
        return e && e.has(2) && e.has(4) && (e.set("latitude", de(...e.get(2), e.get(1))),
        e.set("longitude", de(...e.get(4), e.get(3)))),
        e
    }
    async parseInteropBlock() {
        if (!this.interop && (this.ifd0 || await this.parseIfd0Block(),
        void 0 !== this.interopOffset || this.exif || await this.parseExifBlock(),
        void 0 !== this.interopOffset))
            return this.parseBlock(this.interopOffset, "interop")
    }
    async parseThumbnailBlock(e=!1) {
        if (!this.ifd1 && !this.ifd1Parsed && (!this.options.mergeOutput || e))
            return this.findIfd1Offset(),
            this.ifd1Offset > 0 && (this.parseBlock(this.ifd1Offset, "ifd1"),
            this.ifd1Parsed = !0),
            this.ifd1
    }
    async extractThumbnail() {
        if (this.headerParsed || this.parseHeader(),
        this.ifd1Parsed || await this.parseThumbnailBlock(!0),
        void 0 === this.ifd1)
            return;
        let e = this.ifd1.get(513)
          , t = this.ifd1.get(514);
        return this.chunk.getUint8Array(e, t)
    }
    get image() {
        return this.ifd0
    }
    get thumbnail() {
        return this.ifd1
    }
    createOutput() {
        let e, t, i, n = {};
        for (t of H)
            if (e = this[t],
            !p(e))
                if (i = this.canTranslate ? this.translateBlock(e, t) : Object.fromEntries(e),
                this.options.mergeOutput) {
                    if ("ifd1" === t)
                        continue;
                    Object.assign(n, i)
                } else
                    n[t] = i;
        return this.makerNote && (n.makerNote = this.makerNote),
        this.userComment && (n.userComment = this.userComment),
        n
    }
    assignToOutput(e, t) {
        if (this.globalOptions.mergeOutput)
            Object.assign(e, t);
        else
            for (let[i,n] of Object.entries(t))
                this.assignObjectToOutput(e, i, n)
    }
}
function de(e, t, i, n) {
    var s = e + t / 60 + i / 3600;
    return "S" !== n && "W" !== n || (s *= -1),
    s
}
u(fe, "type", "tiff"),
u(fe, "headerLength", 10),
T.set("tiff", fe);
var pe = Object.freeze({
    __proto__: null,
    default: ne,
    Exifr: te,
    fileParsers: w,
    segmentParsers: T,
    fileReaders: A,
    tagKeys: E,
    tagValues: B,
    tagRevivers: N,
    createDictionary: U,
    extendDictionary: F,
    fetchUrlAsArrayBuffer: M,
    readBlobAsArrayBuffer: R,
    chunkedProps: G,
    otherSegments: V,
    segments: z,
    tiffBlocks: H,
    segmentsAndBlocks: j,
    tiffExtractables: W,
    inheritables: K,
    allFormatters: X,
    Options: Q,
    parse: ie
});
const ge = {
    ifd0: !1,
    ifd1: !1,
    exif: !1,
    gps: !1,
    interop: !1,
    sanitize: !1,
    reviveValues: !0,
    translateKeys: !1,
    translateValues: !1,
    mergeOutput: !1
}
  , me = Object.assign({}, ge, {
    firstChunkSize: 4e4,
    gps: [1, 2, 3, 4]
});
async function Se(e) {
    let t = new te(me);
    await t.read(e);
    let i = await t.parse();
    if (i && i.gps) {
        let {latitude: e, longitude: t} = i.gps;
        return {
            latitude: e,
            longitude: t
        }
    }
}
const Ce = Object.assign({}, ge, {
    tiff: !1,
    ifd1: !0,
    mergeOutput: !1
});
async function ye(e) {
    let t = new te(Ce);
    await t.read(e);
    let i = await t.extractThumbnail();
    return i && a ? s.from(i) : i
}
async function be(e) {
    let t = await this.thumbnail(e);
    if (void 0 !== t) {
        let e = new Blob([t]);
        return URL.createObjectURL(e)
    }
}
const Ie = Object.assign({}, ge, {
    firstChunkSize: 4e4,
    ifd0: [274]
});
async function Pe(e) {
    let t = new te(Ie);
    await t.read(e);
    let i = await t.parse();
    if (i && i.ifd0)
        return i.ifd0[274]
}
const ke = Object.freeze({
    1: {
        dimensionSwapped: !1,
        scaleX: 1,
        scaleY: 1,
        deg: 0,
        rad: 0
    },
    2: {
        dimensionSwapped: !1,
        scaleX: -1,
        scaleY: 1,
        deg: 0,
        rad: 0
    },
    3: {
        dimensionSwapped: !1,
        scaleX: 1,
        scaleY: 1,
        deg: 180,
        rad: 180 * Math.PI / 180
    },
    4: {
        dimensionSwapped: !1,
        scaleX: -1,
        scaleY: 1,
        deg: 180,
        rad: 180 * Math.PI / 180
    },
    5: {
        dimensionSwapped: !0,
        scaleX: 1,
        scaleY: -1,
        deg: 90,
        rad: 90 * Math.PI / 180
    },
    6: {
        dimensionSwapped: !0,
        scaleX: 1,
        scaleY: 1,
        deg: 90,
        rad: 90 * Math.PI / 180
    },
    7: {
        dimensionSwapped: !0,
        scaleX: 1,
        scaleY: -1,
        deg: 270,
        rad: 270 * Math.PI / 180
    },
    8: {
        dimensionSwapped: !0,
        scaleX: 1,
        scaleY: 1,
        deg: 270,
        rad: 270 * Math.PI / 180
    }
});
let we = !0
  , Te = !0;
if ("object" == typeof navigator) {
    let e = navigator.userAgent;
    if (e.includes("iPad") || e.includes("iPhone")) {
        let t = e.match(/OS (\d+)_(\d+)/);
        if (t) {
            let[,e,i] = t
              , n = Number(e) + .1 * Number(i);
            we = n < 13.4,
            Te = !1
        }
    } else if (e.includes("OS X 10")) {
        let[,t] = e.match(/OS X 10[_.](\d+)/);
        we = Te = Number(t) < 15
    }
    if (e.includes("Chrome/")) {
        let[,t] = e.match(/Chrome\/(\d+)/);
        we = Te = Number(t) < 81
    } else if (e.includes("Firefox/")) {
        let[,t] = e.match(/Firefox\/(\d+)/);
        we = Te = Number(t) < 77
    }
}
async function Ae(e) {
    let t = await Pe(e);
    return Object.assign({
        canvas: we,
        css: Te
    }, ke[t])
}
class De extends I {
    constructor(...e) {
        super(...e),
        u(this, "ranges", new Oe),
        0 !== this.byteLength && this.ranges.add(0, this.byteLength)
    }
    _tryExtend(e, t, i) {
        if (0 === e && 0 === this.byteLength && i) {
            let e = new DataView(i.buffer || i,i.byteOffset,i.byteLength);
            this._swapDataView(e)
        } else {
            let i = e + t;
            if (i > this.byteLength) {
                let {dataView: e} = this._extend(i);
                this._swapDataView(e)
            }
        }
    }
    _extend(e) {
        let t;
        t = a ? s.allocUnsafe(e) : new Uint8Array(e);
        let i = new DataView(t.buffer,t.byteOffset,t.byteLength);
        return t.set(new Uint8Array(this.buffer,this.byteOffset,this.byteLength), 0),
        {
            uintView: t,
            dataView: i
        }
    }
    subarray(e, t, i=!1) {
        return t = t || this._lengthToEnd(e),
        i && this._tryExtend(e, t),
        this.ranges.add(e, t),
        super.subarray(e, t)
    }
    set(e, t, i=!1) {
        i && this._tryExtend(t, e.byteLength, e);
        let n = super.set(e, t);
        return this.ranges.add(t, n.byteLength),
        n
    }
    async ensureChunk(e, t) {
        this.chunked && (this.ranges.available(e, t) || await this.readChunk(e, t))
    }
    available(e, t) {
        return this.ranges.available(e, t)
    }
}
class Oe {
    constructor() {
        u(this, "list", [])
    }
    get length() {
        return this.list.length
    }
    add(e, t, i=0) {
        let n = e + t
          , s = this.list.filter((t=>xe(e, t.offset, n) || xe(e, t.end, n)));
        if (s.length > 0) {
            e = Math.min(e, ...s.map((e=>e.offset))),
            n = Math.max(n, ...s.map((e=>e.end))),
            t = n - e;
            let i = s.shift();
            i.offset = e,
            i.length = t,
            i.end = n,
            this.list = this.list.filter((e=>!s.includes(e)))
        } else
            this.list.push({
                offset: e,
                length: t,
                end: n
            })
    }
    available(e, t) {
        let i = e + t;
        return this.list.some((t=>t.offset <= e && i <= t.end))
    }
}
function xe(e, t, i) {
    return e <= t && t <= i
}
class ve extends De {
    constructor(e, t) {
        super(0),
        u(this, "chunksRead", 0),
        this.input = e,
        this.options = t
    }
    async readWhole() {
        this.chunked = !1,
        await this.readChunk(this.nextChunkOffset)
    }
    async readChunked() {
        this.chunked = !0,
        await this.readChunk(0, this.options.firstChunkSize)
    }
    async readNextChunk(e=this.nextChunkOffset) {
        if (this.fullyRead)
            return this.chunksRead++,
            !1;
        let t = this.options.chunkSize
          , i = await this.readChunk(e, t);
        return !!i && i.byteLength === t
    }
    async readChunk(e, t) {
        if (this.chunksRead++,
        0 !== (t = this.safeWrapAddress(e, t)))
            return this._readChunk(e, t)
    }
    safeWrapAddress(e, t) {
        return void 0 !== this.size && e + t > this.size ? Math.max(0, this.size - e) : t
    }
    get nextChunkOffset() {
        if (0 !== this.ranges.list.length)
            return this.ranges.list[0].length
    }
    get canReadNextChunk() {
        return this.chunksRead < this.options.chunkLimit
    }
    get fullyRead() {
        return void 0 !== this.size && this.nextChunkOffset === this.size
    }
    read() {
        return this.options.chunked ? this.readChunked() : this.readWhole()
    }
    close() {}
}
A.set("blob", class extends ve {
    async readWhole() {
        this.chunked = !1;
        let e = await R(this.input);
        this._swapArrayBuffer(e)
    }
    readChunked() {
        return this.chunked = !0,
        this.size = this.input.size,
        super.readChunked()
    }
    async _readChunk(e, t) {
        let i = t ? e + t : void 0
          , n = this.input.slice(e, i)
          , s = await R(n);
        return this.set(s, e, !0)
    }
}
);
var Me = Object.freeze({
    __proto__: null,
    default: pe,
    Exifr: te,
    fileParsers: w,
    segmentParsers: T,
    fileReaders: A,
    tagKeys: E,
    tagValues: B,
    tagRevivers: N,
    createDictionary: U,
    extendDictionary: F,
    fetchUrlAsArrayBuffer: M,
    readBlobAsArrayBuffer: R,
    chunkedProps: G,
    otherSegments: V,
    segments: z,
    tiffBlocks: H,
    segmentsAndBlocks: j,
    tiffExtractables: W,
    inheritables: K,
    allFormatters: X,
    Options: Q,
    parse: ie,
    gpsOnlyOptions: me,
    gps: Se,
    thumbnailOnlyOptions: Ce,
    thumbnail: ye,
    thumbnailUrl: be,
    orientationOnlyOptions: Ie,
    orientation: Pe,
    rotations: ke,
    get rotateCanvas() {
        return we
    },
    get rotateCss() {
        return Te
    },
    rotation: Ae
});
A.set("url", class extends ve {
    async readWhole() {
        this.chunked = !1;
        let e = await M(this.input);
        e instanceof ArrayBuffer ? this._swapArrayBuffer(e) : e instanceof Uint8Array && this._swapBuffer(e)
    }
    async _readChunk(e, t) {
        let i = t ? e + t - 1 : void 0
          , n = this.options.httpHeaders || {};
        (e || i) && (n.range = "bytes=".concat([e, i].join("-")));
        let s = await h(this.input, {
            headers: n
        })
          , r = await s.arrayBuffer()
          , a = r.byteLength;
        if (416 !== s.status)
            return a !== t && (this.size = e + a),
            this.set(r, e, !0)
    }
}
);
I.prototype.getUint64 = function(e) {
    let t = this.getUint32(e)
      , i = this.getUint32(e + 4);
    return t < 1048575 ? t << 32 | i : void 0 !== typeof r ? (console.warn("Using BigInt because of type 64uint but JS can only handle 53b numbers."),
    r(t) << r(32) | r(i)) : void g("Trying to read 64b value but JS can only handle 53b numbers.")
}
;
class Re extends se {
    parseBoxes(e=0) {
        let t = [];
        for (; e < this.file.byteLength - 4; ) {
            let i = this.parseBoxHead(e);
            if (t.push(i),
            0 === i.length)
                break;
            e += i.length
        }
        return t
    }
    parseSubBoxes(e) {
        e.boxes = this.parseBoxes(e.start)
    }
    findBox(e, t) {
        return void 0 === e.boxes && this.parseSubBoxes(e),
        e.boxes.find((e=>e.kind === t))
    }
    parseBoxHead(e) {
        let t = this.file.getUint32(e)
          , i = this.file.getString(e + 4, 4)
          , n = e + 8;
        return 1 === t && (t = this.file.getUint64(e + 8),
        n += 8),
        {
            offset: e,
            length: t,
            kind: i,
            start: n
        }
    }
    parseBoxFullHead(e) {
        if (void 0 !== e.version)
            return;
        let t = this.file.getUint32(e.start);
        e.version = t >> 24,
        e.start += 4
    }
}
class Le extends Re {
    static canHandle(e, t) {
        if (0 !== t)
            return !1;
        let i = e.getUint16(2);
        if (i > 50)
            return !1;
        let n = 16
          , s = [];
        for (; n < i; )
            s.push(e.getString(n, 4)),
            n += 4;
        return s.includes(this.type)
    }
    async parse() {
        let e = this.file.getUint32(0)
          , t = this.parseBoxHead(e);
        for (; "meta" !== t.kind; )
            e += t.length,
            await this.file.ensureChunk(e, 16),
            t = this.parseBoxHead(e);
        await this.file.ensureChunk(t.offset, t.length),
        this.parseBoxFullHead(t),
        this.parseSubBoxes(t),
        this.options.icc.enabled && await this.findIcc(t),
        this.options.tiff.enabled && await this.findExif(t)
    }
    async registerSegment(e, t, i) {
        await this.file.ensureChunk(t, i);
        let n = this.file.subarray(t, i);
        this.createParser(e, n)
    }
    async findIcc(e) {
        let t = this.findBox(e, "iprp");
        if (void 0 === t)
            return;
        let i = this.findBox(t, "ipco");
        if (void 0 === i)
            return;
        let n = this.findBox(i, "colr");
        void 0 !== n && await this.registerSegment("icc", n.offset + 12, n.length)
    }
    async findExif(e) {
        let t = this.findBox(e, "iinf");
        if (void 0 === t)
            return;
        let i = this.findBox(e, "iloc");
        if (void 0 === i)
            return;
        let n = this.findExifLocIdInIinf(t)
          , s = this.findExtentInIloc(i, n);
        if (void 0 === s)
            return;
        let[r,a] = s;
        await this.file.ensureChunk(r, a);
        let o = 4 + this.file.getUint32(r);
        r += o,
        a -= o,
        await this.registerSegment("tiff", r, a)
    }
    findExifLocIdInIinf(e) {
        this.parseBoxFullHead(e);
        let t, i, n, s, r = e.start, a = this.file.getUint16(r);
        for (r += 2; a--; ) {
            if (t = this.parseBoxHead(r),
            this.parseBoxFullHead(t),
            i = t.start,
            t.version >= 2 && (n = 3 === t.version ? 4 : 2,
            s = this.file.getString(i + n + 2, 4),
            "Exif" === s))
                return this.file.getUintBytes(i, n);
            r += t.length
        }
    }
    get8bits(e) {
        let t = this.file.getUint8(e);
        return [t >> 4, 15 & t]
    }
    findExtentInIloc(e, t) {
        this.parseBoxFullHead(e);
        let i = e.start
          , [n,s] = this.get8bits(i++)
          , [r,a] = this.get8bits(i++)
          , o = 2 === e.version ? 4 : 2
          , l = 1 === e.version || 2 === e.version ? 2 : 0
          , h = a + n + s
          , c = 2 === e.version ? 4 : 2
          , u = this.file.getUintBytes(i, c);
        for (i += c; u--; ) {
            let e = this.file.getUintBytes(i, o);
            i += o + l + 2 + r;
            let c = this.file.getUint16(i);
            if (i += 2,
            e === t)
                return c > 1 && console.warn("ILOC box has more than one extent but we're only processing one\nPlease create an issue at https://github.com/MikeKovarik/exifr with this file"),
                [this.file.getUintBytes(i + a, n), this.file.getUintBytes(i + a + n, s)];
            i += c * h
        }
    }
}
class Ue extends Le {
}
u(Ue, "type", "heic");
class Fe extends Le {
}
u(Fe, "type", "avif"),
w.set("heic", Ue),
w.set("avif", Fe),
U(E, ["ifd0", "ifd1"], [[256, "ImageWidth"], [257, "ImageHeight"], [258, "BitsPerSample"], [259, "Compression"], [262, "PhotometricInterpretation"], [270, "ImageDescription"], [271, "Make"], [272, "Model"], [273, "StripOffsets"], [274, "Orientation"], [277, "SamplesPerPixel"], [278, "RowsPerStrip"], [279, "StripByteCounts"], [282, "XResolution"], [283, "YResolution"], [284, "PlanarConfiguration"], [296, "ResolutionUnit"], [301, "TransferFunction"], [305, "Software"], [306, "ModifyDate"], [315, "Artist"], [316, "HostComputer"], [317, "Predictor"], [318, "WhitePoint"], [319, "PrimaryChromaticities"], [513, "ThumbnailOffset"], [514, "ThumbnailLength"], [529, "YCbCrCoefficients"], [530, "YCbCrSubSampling"], [531, "YCbCrPositioning"], [532, "ReferenceBlackWhite"], [700, "ApplicationNotes"], [33432, "Copyright"], [33723, "IPTC"], [34665, "ExifIFD"], [34675, "ICC"], [34853, "GpsIFD"], [330, "SubIFD"], [40965, "InteropIFD"], [40091, "XPTitle"], [40092, "XPComment"], [40093, "XPAuthor"], [40094, "XPKeywords"], [40095, "XPSubject"]]),
U(E, "exif", [[33434, "ExposureTime"], [33437, "FNumber"], [34850, "ExposureProgram"], [34852, "SpectralSensitivity"], [34855, "ISO"], [34858, "TimeZoneOffset"], [34859, "SelfTimerMode"], [34864, "SensitivityType"], [34865, "StandardOutputSensitivity"], [34866, "RecommendedExposureIndex"], [34867, "ISOSpeed"], [34868, "ISOSpeedLatitudeyyy"], [34869, "ISOSpeedLatitudezzz"], [36864, "ExifVersion"], [36867, "DateTimeOriginal"], [36868, "CreateDate"], [36873, "GooglePlusUploadCode"], [36880, "OffsetTime"], [36881, "OffsetTimeOriginal"], [36882, "OffsetTimeDigitized"], [37121, "ComponentsConfiguration"], [37122, "CompressedBitsPerPixel"], [37377, "ShutterSpeedValue"], [37378, "ApertureValue"], [37379, "BrightnessValue"], [37380, "ExposureCompensation"], [37381, "MaxApertureValue"], [37382, "SubjectDistance"], [37383, "MeteringMode"], [37384, "LightSource"], [37385, "Flash"], [37386, "FocalLength"], [37393, "ImageNumber"], [37394, "SecurityClassification"], [37395, "ImageHistory"], [37396, "SubjectArea"], [37500, "MakerNote"], [37510, "UserComment"], [37520, "SubSecTime"], [37521, "SubSecTimeOriginal"], [37522, "SubSecTimeDigitized"], [37888, "AmbientTemperature"], [37889, "Humidity"], [37890, "Pressure"], [37891, "WaterDepth"], [37892, "Acceleration"], [37893, "CameraElevationAngle"], [40960, "FlashpixVersion"], [40961, "ColorSpace"], [40962, "ExifImageWidth"], [40963, "ExifImageHeight"], [40964, "RelatedSoundFile"], [41483, "FlashEnergy"], [41486, "FocalPlaneXResolution"], [41487, "FocalPlaneYResolution"], [41488, "FocalPlaneResolutionUnit"], [41492, "SubjectLocation"], [41493, "ExposureIndex"], [41495, "SensingMethod"], [41728, "FileSource"], [41729, "SceneType"], [41730, "CFAPattern"], [41985, "CustomRendered"], [41986, "ExposureMode"], [41987, "WhiteBalance"], [41988, "DigitalZoomRatio"], [41989, "FocalLengthIn35mmFormat"], [41990, "SceneCaptureType"], [41991, "GainControl"], [41992, "Contrast"], [41993, "Saturation"], [41994, "Sharpness"], [41996, "SubjectDistanceRange"], [42016, "ImageUniqueID"], [42032, "OwnerName"], [42033, "SerialNumber"], [42034, "LensInfo"], [42035, "LensMake"], [42036, "LensModel"], [42037, "LensSerialNumber"], [42080, "CompositeImage"], [42081, "CompositeImageCount"], [42082, "CompositeImageExposureTimes"], [42240, "Gamma"], [59932, "Padding"], [59933, "OffsetSchema"], [65e3, "OwnerName"], [65001, "SerialNumber"], [65002, "Lens"], [65100, "RawFile"], [65101, "Converter"], [65102, "WhiteBalance"], [65105, "Exposure"], [65106, "Shadows"], [65107, "Brightness"], [65108, "Contrast"], [65109, "Saturation"], [65110, "Sharpness"], [65111, "Smoothness"], [65112, "MoireFilter"], [40965, "InteropIFD"]]),
U(E, "gps", [[0, "GPSVersionID"], [1, "GPSLatitudeRef"], [2, "GPSLatitude"], [3, "GPSLongitudeRef"], [4, "GPSLongitude"], [5, "GPSAltitudeRef"], [6, "GPSAltitude"], [7, "GPSTimeStamp"], [8, "GPSSatellites"], [9, "GPSStatus"], [10, "GPSMeasureMode"], [11, "GPSDOP"], [12, "GPSSpeedRef"], [13, "GPSSpeed"], [14, "GPSTrackRef"], [15, "GPSTrack"], [16, "GPSImgDirectionRef"], [17, "GPSImgDirection"], [18, "GPSMapDatum"], [19, "GPSDestLatitudeRef"], [20, "GPSDestLatitude"], [21, "GPSDestLongitudeRef"], [22, "GPSDestLongitude"], [23, "GPSDestBearingRef"], [24, "GPSDestBearing"], [25, "GPSDestDistanceRef"], [26, "GPSDestDistance"], [27, "GPSProcessingMethod"], [28, "GPSAreaInformation"], [29, "GPSDateStamp"], [30, "GPSDifferential"], [31, "GPSHPositioningError"]]),
U(B, ["ifd0", "ifd1"], [[274, {
    1: "Horizontal (normal)",
    2: "Mirror horizontal",
    3: "Rotate 180",
    4: "Mirror vertical",
    5: "Mirror horizontal and rotate 270 CW",
    6: "Rotate 90 CW",
    7: "Mirror horizontal and rotate 90 CW",
    8: "Rotate 270 CW"
}], [296, {
    1: "None",
    2: "inches",
    3: "cm"
}]]);
let Ee = U(B, "exif", [[34850, {
    0: "Not defined",
    1: "Manual",
    2: "Normal program",
    3: "Aperture priority",
    4: "Shutter priority",
    5: "Creative program",
    6: "Action program",
    7: "Portrait mode",
    8: "Landscape mode"
}], [37121, {
    0: "-",
    1: "Y",
    2: "Cb",
    3: "Cr",
    4: "R",
    5: "G",
    6: "B"
}], [37383, {
    0: "Unknown",
    1: "Average",
    2: "CenterWeightedAverage",
    3: "Spot",
    4: "MultiSpot",
    5: "Pattern",
    6: "Partial",
    255: "Other"
}], [37384, {
    0: "Unknown",
    1: "Daylight",
    2: "Fluorescent",
    3: "Tungsten (incandescent light)",
    4: "Flash",
    9: "Fine weather",
    10: "Cloudy weather",
    11: "Shade",
    12: "Daylight fluorescent (D 5700 - 7100K)",
    13: "Day white fluorescent (N 4600 - 5400K)",
    14: "Cool white fluorescent (W 3900 - 4500K)",
    15: "White fluorescent (WW 3200 - 3700K)",
    17: "Standard light A",
    18: "Standard light B",
    19: "Standard light C",
    20: "D55",
    21: "D65",
    22: "D75",
    23: "D50",
    24: "ISO studio tungsten",
    255: "Other"
}], [37385, {
    0: "Flash did not fire",
    1: "Flash fired",
    5: "Strobe return light not detected",
    7: "Strobe return light detected",
    9: "Flash fired, compulsory flash mode",
    13: "Flash fired, compulsory flash mode, return light not detected",
    15: "Flash fired, compulsory flash mode, return light detected",
    16: "Flash did not fire, compulsory flash mode",
    24: "Flash did not fire, auto mode",
    25: "Flash fired, auto mode",
    29: "Flash fired, auto mode, return light not detected",
    31: "Flash fired, auto mode, return light detected",
    32: "No flash function",
    65: "Flash fired, red-eye reduction mode",
    69: "Flash fired, red-eye reduction mode, return light not detected",
    71: "Flash fired, red-eye reduction mode, return light detected",
    73: "Flash fired, compulsory flash mode, red-eye reduction mode",
    77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
    79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
    89: "Flash fired, auto mode, red-eye reduction mode",
    93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
    95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
}], [41495, {
    1: "Not defined",
    2: "One-chip color area sensor",
    3: "Two-chip color area sensor",
    4: "Three-chip color area sensor",
    5: "Color sequential area sensor",
    7: "Trilinear sensor",
    8: "Color sequential linear sensor"
}], [41728, {
    1: "Film Scanner",
    2: "Reflection Print Scanner",
    3: "Digital Camera"
}], [41729, {
    1: "Directly photographed"
}], [41985, {
    0: "Normal",
    1: "Custom",
    2: "HDR (no original saved)",
    3: "HDR (original saved)",
    4: "Original (for HDR)",
    6: "Panorama",
    7: "Portrait HDR",
    8: "Portrait"
}], [41986, {
    0: "Auto",
    1: "Manual",
    2: "Auto bracket"
}], [41987, {
    0: "Auto",
    1: "Manual"
}], [41990, {
    0: "Standard",
    1: "Landscape",
    2: "Portrait",
    3: "Night",
    4: "Other"
}], [41991, {
    0: "None",
    1: "Low gain up",
    2: "High gain up",
    3: "Low gain down",
    4: "High gain down"
}], [41996, {
    0: "Unknown",
    1: "Macro",
    2: "Close",
    3: "Distant"
}], [42080, {
    0: "Unknown",
    1: "Not a Composite Image",
    2: "General Composite Image",
    3: "Composite Image Captured While Shooting"
}]]);
const Be = {
    1: "No absolute unit of measurement",
    2: "Inch",
    3: "Centimeter"
};
Ee.set(37392, Be),
Ee.set(41488, Be);
const Ne = {
    0: "Normal",
    1: "Low",
    2: "High"
};
function Ge(e) {
    return "object" == typeof e && void 0 !== e.length ? e[0] : e
}
function Ve(e) {
    let t = Array.from(e).slice(1);
    return t[1] > 15 && (t = t.map((e=>String.fromCharCode(e)))),
    "0" !== t[2] && 0 !== t[2] || t.pop(),
    t.join(".")
}
function ze(e) {
    if ("string" == typeof e) {
        var [t,i,n,s,r,a] = e.trim().split(/[-: ]/g).map(Number)
          , o = new Date(t,i - 1,n);
        return Number.isNaN(s) || Number.isNaN(r) || Number.isNaN(a) || (o.setHours(s),
        o.setMinutes(r),
        o.setSeconds(a)),
        Number.isNaN(+o) ? e : o
    }
}
function He(e) {
    if ("string" == typeof e)
        return e;
    let t = [];
    if (0 === e[1] && 0 === e[e.length - 1])
        for (let i = 0; i < e.length; i += 2)
            t.push(je(e[i + 1], e[i]));
    else
        for (let i = 0; i < e.length; i += 2)
            t.push(je(e[i], e[i + 1]));
    return m(String.fromCodePoint(...t))
}
function je(e, t) {
    return e << 8 | t
}
Ee.set(41992, Ne),
Ee.set(41993, Ne),
Ee.set(41994, Ne),
U(N, ["ifd0", "ifd1"], [[50827, function(e) {
    return "string" != typeof e ? b(e) : e
}
], [306, ze], [40091, He], [40092, He], [40093, He], [40094, He], [40095, He]]),
U(N, "exif", [[40960, Ve], [36864, Ve], [36867, ze], [36868, ze], [40962, Ge], [40963, Ge]]),
U(N, "gps", [[0, e=>Array.from(e).join(".")], [7, e=>Array.from(e).join(":")]]);
class We extends re {
    static canHandle(e, t) {
        return 225 === e.getUint8(t + 1) && 1752462448 === e.getUint32(t + 4) && "http://ns.adobe.com/" === e.getString(t + 4, "http://ns.adobe.com/".length)
    }
    static headerLength(e, t) {
        return "http://ns.adobe.com/xmp/extension/" === e.getString(t + 4, "http://ns.adobe.com/xmp/extension/".length) ? 79 : 4 + "http://ns.adobe.com/xap/1.0/".length + 1
    }
    static findPosition(e, t) {
        let i = super.findPosition(e, t);
        return i.multiSegment = i.extended = 79 === i.headerLength,
        i.multiSegment ? (i.chunkCount = e.getUint8(t + 72),
        i.chunkNumber = e.getUint8(t + 76),
        0 !== e.getUint8(t + 77) && i.chunkNumber++) : (i.chunkCount = 1 / 0,
        i.chunkNumber = -1),
        i
    }
    static handleMultiSegments(e) {
        return e.map((e=>e.chunk.getString())).join("")
    }
    normalizeInput(e) {
        return "string" == typeof e ? e : I.from(e).getString()
    }
    parse(e=this.chunk) {
        if (!this.localOptions.parse)
            return e;
        e = function(e) {
            let t = {}
              , i = {};
            for (let e of $e)
                t[e] = [],
                i[e] = 0;
            return e.replace(et, ((e,n,s)=>{
                if ("<" === n) {
                    let n = ++i[s];
                    return t[s].push(n),
                    "".concat(e, "#").concat(n)
                }
                {
                    let i = t[s].pop();
                    return "".concat(e, "#").concat(i)
                }
            }
            ))
        }(e);
        let t = Xe.findAll(e, "rdf", "Description");
        0 === t.length && t.push(new Xe("rdf","Description",void 0,e));
        let i, n = {};
        for (let e of t)
            for (let t of e.properties)
                i = qe(t.ns, n),
                _e(t, i);
        return function(e) {
            let t;
            for (let i in e)
                t = e[i] = f(e[i]),
                void 0 === t && delete e[i];
            return f(e)
        }(n)
    }
    assignToOutput(e, t) {
        if (this.localOptions.parse)
            for (let[i,n] of Object.entries(t))
                switch (i) {
                case "tiff":
                    this.assignObjectToOutput(e, "ifd0", n);
                    break;
                case "exif":
                    this.assignObjectToOutput(e, "exif", n);
                    break;
                case "xmlns":
                    break;
                default:
                    this.assignObjectToOutput(e, i, n)
                }
        else
            e.xmp = t
    }
}
u(We, "type", "xmp"),
u(We, "multiSegment", !0),
T.set("xmp", We);
class Ke {
    static findAll(e) {
        return Qe(e, /([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)=("[^"]*"|'[^']*')/gm).map(Ke.unpackMatch)
    }
    static unpackMatch(e) {
        let t = e[1]
          , i = e[2]
          , n = e[3].slice(1, -1);
        return n = Ze(n),
        new Ke(t,i,n)
    }
    constructor(e, t, i) {
        this.ns = e,
        this.name = t,
        this.value = i
    }
    serialize() {
        return this.value
    }
}
class Xe {
    static findAll(e, t, i) {
        if (void 0 !== t || void 0 !== i) {
            t = t || "[\\w\\d-]+",
            i = i || "[\\w\\d-]+";
            var n = new RegExp("<(".concat(t, "):(").concat(i, ")(#\\d+)?((\\s+?[\\w\\d-:]+=(\"[^\"]*\"|'[^']*'))*\\s*)(\\/>|>([\\s\\S]*?)<\\/\\1:\\2\\3>)"),"gm")
        } else
            n = /<([\w\d-]+):([\w\d-]+)(#\d+)?((\s+?[\w\d-:]+=("[^"]*"|'[^']*'))*\s*)(\/>|>([\s\S]*?)<\/\1:\2\3>)/gm;
        return Qe(e, n).map(Xe.unpackMatch)
    }
    static unpackMatch(e) {
        let t = e[1]
          , i = e[2]
          , n = e[4]
          , s = e[8];
        return new Xe(t,i,n,s)
    }
    constructor(e, t, i, n) {
        this.ns = e,
        this.name = t,
        this.attrString = i,
        this.innerXml = n,
        this.attrs = Ke.findAll(i),
        this.children = Xe.findAll(n),
        this.value = 0 === this.children.length ? Ze(n) : void 0,
        this.properties = [...this.attrs, ...this.children]
    }
    get isPrimitive() {
        return void 0 !== this.value && 0 === this.attrs.length && 0 === this.children.length
    }
    get isListContainer() {
        return 1 === this.children.length && this.children[0].isList
    }
    get isList() {
        let {ns: e, name: t} = this;
        return "rdf" === e && ("Seq" === t || "Bag" === t || "Alt" === t)
    }
    get isListItem() {
        return "rdf" === this.ns && "li" === this.name
    }
    serialize() {
        if (0 === this.properties.length && void 0 === this.value)
            return;
        if (this.isPrimitive)
            return this.value;
        if (this.isListContainer)
            return this.children[0].serialize();
        if (this.isList)
            return Je(this.children.map(Ye));
        if (this.isListItem && 1 === this.children.length && 0 === this.attrs.length)
            return this.children[0].serialize();
        let e = {};
        for (let t of this.properties)
            _e(t, e);
        return void 0 !== this.value && (e.value = this.value),
        f(e)
    }
}
function _e(e, t) {
    let i = e.serialize();
    void 0 !== i && (t[e.name] = i)
}
var Ye = e=>e.serialize()
  , Je = e=>1 === e.length ? e[0] : e
  , qe = (e,t)=>t[e] ? t[e] : t[e] = {};
function Qe(e, t) {
    let i, n = [];
    if (!e)
        return n;
    for (; null !== (i = t.exec(e)); )
        n.push(i);
    return n
}
function Ze(e) {
    if (function(e) {
        return null == e || "null" === e || "undefined" === e || "" === e || "" === e.trim()
    }(e))
        return;
    let t = Number(e);
    if (!Number.isNaN(t))
        return t;
    let i = e.toLowerCase();
    return "true" === i || "false" !== i && e.trim()
}
const $e = ["rdf:li", "rdf:Seq", "rdf:Bag", "rdf:Alt", "rdf:Description"]
  , et = new RegExp("(<|\\/)(".concat($e.join("|"), ")"),"g");
var tt = Object.freeze({
    __proto__: null,
    default: Me,
    Exifr: te,
    fileParsers: w,
    segmentParsers: T,
    fileReaders: A,
    tagKeys: E,
    tagValues: B,
    tagRevivers: N,
    createDictionary: U,
    extendDictionary: F,
    fetchUrlAsArrayBuffer: M,
    readBlobAsArrayBuffer: R,
    chunkedProps: G,
    otherSegments: V,
    segments: z,
    tiffBlocks: H,
    segmentsAndBlocks: j,
    tiffExtractables: W,
    inheritables: K,
    allFormatters: X,
    Options: Q,
    parse: ie,
    gpsOnlyOptions: me,
    gps: Se,
    thumbnailOnlyOptions: Ce,
    thumbnail: ye,
    thumbnailUrl: be,
    orientationOnlyOptions: Ie,
    orientation: Pe,
    rotations: ke,
    get rotateCanvas() {
        return we
    },
    get rotateCss() {
        return Te
    },
    rotation: Ae
});
const it = ["xmp", "icc", "iptc", "tiff"]
  , nt = ()=>{}
;
async function st(e, t, i) {
    let n = new Q(t);
    n.chunked = !1,
    void 0 === i && "string" == typeof e && (i = function(e) {
        let t = e.toLowerCase().split(".").pop();
        if (function(e) {
            return "exif" === e || "tiff" === e || "tif" === e
        }(t))
            return "tiff";
        if (it.includes(t))
            return t
    }(e));
    let s = await D(e, n);
    if (i) {
        if (it.includes(i))
            return rt(i, s, n);
        g("Invalid segment type")
    } else {
        if (function(e) {
            let t = e.getString(0, 50).trim();
            return t.includes("<?xpacket") || t.includes("<x:")
        }(s))
            return rt("xmp", s, n);
        for (let[e] of T) {
            if (!it.includes(e))
                continue;
            let t = await rt(e, s, n).catch(nt);
            if (t)
                return t
        }
        g("Unknown file format")
    }
}
async function rt(e, t, i) {
    let n = i[e];
    return n.enabled = !0,
    n.parse = !0,
    T.get(e).parse(t, n)
}
let at = l("fs", (e=>e.promises));
A.set("fs", class extends ve {
    async readWhole() {
        this.chunked = !1,
        this.fs = await at;
        let e = await this.fs.readFile(this.input);
        this._swapBuffer(e)
    }
    async readChunked() {
        this.chunked = !0,
        this.fs = await at,
        await this.open(),
        await this.readChunk(0, this.options.firstChunkSize)
    }
    async open() {
        void 0 === this.fh && (this.fh = await this.fs.open(this.input, "r"),
        this.size = (await this.fh.stat(this.input)).size)
    }
    async _readChunk(e, t) {
        void 0 === this.fh && await this.open(),
        e + t > this.size && (t = this.size - e);
        var i = this.subarray(e, t, !0);
        return await this.fh.read(i.dataView, 0, t, e),
        i
    }
    async close() {
        if (this.fh) {
            let e = this.fh;
            this.fh = void 0,
            await e.close()
        }
    }
}
);
A.set("base64", class extends ve {
    constructor(...e) {
        super(...e),
        this.input = this.input.replace(/^data:([^;]+);base64,/gim, ""),
        this.size = this.input.length / 4 * 3,
        this.input.endsWith("==") ? this.size -= 2 : this.input.endsWith("=") && (this.size -= 1)
    }
    async _readChunk(e, t) {
        let i, n, r = this.input;
        void 0 === e ? (e = 0,
        i = 0,
        n = 0) : (i = 4 * Math.floor(e / 3),
        n = e - i / 4 * 3),
        void 0 === t && (t = this.size);
        let o = e + t
          , l = i + 4 * Math.ceil(o / 3);
        r = r.slice(i, l);
        let h = Math.min(t, this.size - e);
        if (a) {
            let t = s.from(r, "base64").slice(n, n + h);
            return this.set(t, e, !0)
        }
        {
            let t = this.subarray(e, h, !0)
              , i = atob(r)
              , s = t.toUint8();
            for (let e = 0; e < h; e++)
                s[e] = i.charCodeAt(n + e);
            return t
        }
    }
}
);
class ot extends se {
    static canHandle(e, t) {
        return 18761 === t || 19789 === t
    }
    extendOptions(e) {
        let {ifd0: t, xmp: i, iptc: n, icc: s} = e;
        i.enabled && t.deps.add(700),
        n.enabled && t.deps.add(33723),
        s.enabled && t.deps.add(34675),
        t.finalizeFilters()
    }
    async parse() {
        let {tiff: e, xmp: t, iptc: i, icc: n} = this.options;
        if (e.enabled || t.enabled || i.enabled || n.enabled) {
            let e = Math.max(S(this.options), this.options.chunkSize);
            await this.file.ensureChunk(0, e),
            this.createParser("tiff", this.file),
            this.parsers.tiff.parseHeader(),
            await this.parsers.tiff.parseIfd0Block(),
            this.adaptTiffPropAsSegment("xmp"),
            this.adaptTiffPropAsSegment("iptc"),
            this.adaptTiffPropAsSegment("icc")
        }
    }
    adaptTiffPropAsSegment(e) {
        if (this.parsers.tiff[e]) {
            let t = this.parsers.tiff[e];
            this.injectSegment(e, t)
        }
    }
}
u(ot, "type", "tiff"),
w.set("tiff", ot);
let lt = l("zlib");
const ht = ["ihdr", "iccp", "text", "itxt", "exif"];
class ct extends se {
    constructor(...e) {
        super(...e),
        u(this, "catchError", (e=>this.errors.push(e))),
        u(this, "metaChunks", []),
        u(this, "unknownChunks", [])
    }
    static canHandle(e, t) {
        return 35152 === t && 2303741511 === e.getUint32(0) && 218765834 === e.getUint32(4)
    }
    async parse() {
        let {file: e} = this;
        await this.findPngChunksInRange("PNG\r\n\n".length, e.byteLength),
        await this.readSegments(this.metaChunks),
        this.findIhdr(),
        this.parseTextChunks(),
        await this.findExif().catch(this.catchError),
        await this.findXmp().catch(this.catchError),
        await this.findIcc().catch(this.catchError)
    }
    async findPngChunksInRange(e, t) {
        let {file: i} = this;
        for (; e < t; ) {
            let t = i.getUint32(e)
              , n = i.getUint32(e + 4)
              , s = i.getString(e + 4, 4).toLowerCase()
              , r = t + 4 + 4 + 4
              , a = {
                type: s,
                offset: e,
                length: r,
                start: e + 4 + 4,
                size: t,
                marker: n
            };
            ht.includes(s) ? this.metaChunks.push(a) : this.unknownChunks.push(a),
            e += r
        }
    }
    parseTextChunks() {
        let e = this.metaChunks.filter((e=>"text" === e.type));
        for (let t of e) {
            let[e,i] = this.file.getString(t.start, t.size).split("\0");
            this.injectKeyValToIhdr(e, i)
        }
    }
    injectKeyValToIhdr(e, t) {
        let i = this.parsers.ihdr;
        i && i.raw.set(e, t)
    }
    findIhdr() {
        let e = this.metaChunks.find((e=>"ihdr" === e.type));
        e && !1 !== this.options.ihdr.enabled && this.createParser("ihdr", e.chunk)
    }
    async findExif() {
        let e = this.metaChunks.find((e=>"exif" === e.type));
        e && this.injectSegment("tiff", e.chunk)
    }
    async findXmp() {
        let e = this.metaChunks.filter((e=>"itxt" === e.type));
        for (let t of e) {
            "XML:com.adobe.xmp" === t.chunk.getString(0, "XML:com.adobe.xmp".length) && this.injectSegment("xmp", t.chunk)
        }
    }
    async findIcc() {
        let e = this.metaChunks.find((e=>"iccp" === e.type));
        if (!e)
            return;
        let {chunk: t} = e
          , i = t.getUint8Array(0, 81)
          , s = 0;
        for (; s < 80 && 0 !== i[s]; )
            s++;
        let r = s + 2
          , a = t.getString(0, s);
        if (this.injectKeyValToIhdr("ProfileName", a),
        n) {
            let e = await lt
              , i = t.getUint8Array(r);
            i = e.inflateSync(i),
            this.injectSegment("icc", i)
        }
    }
}
u(ct, "type", "png"),
w.set("png", ct),
U(E, "interop", [[1, "InteropIndex"], [2, "InteropVersion"], [4096, "RelatedImageFileFormat"], [4097, "RelatedImageWidth"], [4098, "RelatedImageHeight"]]),
F(E, "ifd0", [[11, "ProcessingSoftware"], [254, "SubfileType"], [255, "OldSubfileType"], [263, "Thresholding"], [264, "CellWidth"], [265, "CellLength"], [266, "FillOrder"], [269, "DocumentName"], [280, "MinSampleValue"], [281, "MaxSampleValue"], [285, "PageName"], [286, "XPosition"], [287, "YPosition"], [290, "GrayResponseUnit"], [297, "PageNumber"], [321, "HalftoneHints"], [322, "TileWidth"], [323, "TileLength"], [332, "InkSet"], [337, "TargetPrinter"], [18246, "Rating"], [18249, "RatingPercent"], [33550, "PixelScale"], [34264, "ModelTransform"], [34377, "PhotoshopSettings"], [50706, "DNGVersion"], [50707, "DNGBackwardVersion"], [50708, "UniqueCameraModel"], [50709, "LocalizedCameraModel"], [50736, "DNGLensInfo"], [50739, "ShadowScale"], [50740, "DNGPrivateData"], [33920, "IntergraphMatrix"], [33922, "ModelTiePoint"], [34118, "SEMInfo"], [34735, "GeoTiffDirectory"], [34736, "GeoTiffDoubleParams"], [34737, "GeoTiffAsciiParams"], [50341, "PrintIM"], [50721, "ColorMatrix1"], [50722, "ColorMatrix2"], [50723, "CameraCalibration1"], [50724, "CameraCalibration2"], [50725, "ReductionMatrix1"], [50726, "ReductionMatrix2"], [50727, "AnalogBalance"], [50728, "AsShotNeutral"], [50729, "AsShotWhiteXY"], [50730, "BaselineExposure"], [50731, "BaselineNoise"], [50732, "BaselineSharpness"], [50734, "LinearResponseLimit"], [50735, "CameraSerialNumber"], [50741, "MakerNoteSafety"], [50778, "CalibrationIlluminant1"], [50779, "CalibrationIlluminant2"], [50781, "RawDataUniqueID"], [50827, "OriginalRawFileName"], [50828, "OriginalRawFileData"], [50831, "AsShotICCProfile"], [50832, "AsShotPreProfileMatrix"], [50833, "CurrentICCProfile"], [50834, "CurrentPreProfileMatrix"], [50879, "ColorimetricReference"], [50885, "SRawType"], [50898, "PanasonicTitle"], [50899, "PanasonicTitle2"], [50931, "CameraCalibrationSig"], [50932, "ProfileCalibrationSig"], [50933, "ProfileIFD"], [50934, "AsShotProfileName"], [50936, "ProfileName"], [50937, "ProfileHueSatMapDims"], [50938, "ProfileHueSatMapData1"], [50939, "ProfileHueSatMapData2"], [50940, "ProfileToneCurve"], [50941, "ProfileEmbedPolicy"], [50942, "ProfileCopyright"], [50964, "ForwardMatrix1"], [50965, "ForwardMatrix2"], [50966, "PreviewApplicationName"], [50967, "PreviewApplicationVersion"], [50968, "PreviewSettingsName"], [50969, "PreviewSettingsDigest"], [50970, "PreviewColorSpace"], [50971, "PreviewDateTime"], [50972, "RawImageDigest"], [50973, "OriginalRawFileDigest"], [50981, "ProfileLookTableDims"], [50982, "ProfileLookTableData"], [51043, "TimeCodes"], [51044, "FrameRate"], [51058, "TStop"], [51081, "ReelName"], [51089, "OriginalDefaultFinalSize"], [51090, "OriginalBestQualitySize"], [51091, "OriginalDefaultCropSize"], [51105, "CameraLabel"], [51107, "ProfileHueSatMapEncoding"], [51108, "ProfileLookTableEncoding"], [51109, "BaselineExposureOffset"], [51110, "DefaultBlackRender"], [51111, "NewRawImageDigest"], [51112, "RawToPreviewGain"]]);
let ut = [[273, "StripOffsets"], [279, "StripByteCounts"], [288, "FreeOffsets"], [289, "FreeByteCounts"], [291, "GrayResponseCurve"], [292, "T4Options"], [293, "T6Options"], [300, "ColorResponseUnit"], [320, "ColorMap"], [324, "TileOffsets"], [325, "TileByteCounts"], [326, "BadFaxLines"], [327, "CleanFaxData"], [328, "ConsecutiveBadFaxLines"], [330, "SubIFD"], [333, "InkNames"], [334, "NumberofInks"], [336, "DotRange"], [338, "ExtraSamples"], [339, "SampleFormat"], [340, "SMinSampleValue"], [341, "SMaxSampleValue"], [342, "TransferRange"], [343, "ClipPath"], [344, "XClipPathUnits"], [345, "YClipPathUnits"], [346, "Indexed"], [347, "JPEGTables"], [351, "OPIProxy"], [400, "GlobalParametersIFD"], [401, "ProfileType"], [402, "FaxProfile"], [403, "CodingMethods"], [404, "VersionYear"], [405, "ModeNumber"], [433, "Decode"], [434, "DefaultImageColor"], [435, "T82Options"], [437, "JPEGTables"], [512, "JPEGProc"], [515, "JPEGRestartInterval"], [517, "JPEGLosslessPredictors"], [518, "JPEGPointTransforms"], [519, "JPEGQTables"], [520, "JPEGDCTables"], [521, "JPEGACTables"], [559, "StripRowCounts"], [999, "USPTOMiscellaneous"], [18247, "XP_DIP_XML"], [18248, "StitchInfo"], [28672, "SonyRawFileType"], [28688, "SonyToneCurve"], [28721, "VignettingCorrection"], [28722, "VignettingCorrParams"], [28724, "ChromaticAberrationCorrection"], [28725, "ChromaticAberrationCorrParams"], [28726, "DistortionCorrection"], [28727, "DistortionCorrParams"], [29895, "SonyCropTopLeft"], [29896, "SonyCropSize"], [32781, "ImageID"], [32931, "WangTag1"], [32932, "WangAnnotation"], [32933, "WangTag3"], [32934, "WangTag4"], [32953, "ImageReferencePoints"], [32954, "RegionXformTackPoint"], [32955, "WarpQuadrilateral"], [32956, "AffineTransformMat"], [32995, "Matteing"], [32996, "DataType"], [32997, "ImageDepth"], [32998, "TileDepth"], [33300, "ImageFullWidth"], [33301, "ImageFullHeight"], [33302, "TextureFormat"], [33303, "WrapModes"], [33304, "FovCot"], [33305, "MatrixWorldToScreen"], [33306, "MatrixWorldToCamera"], [33405, "Model2"], [33421, "CFARepeatPatternDim"], [33422, "CFAPattern2"], [33423, "BatteryLevel"], [33424, "KodakIFD"], [33445, "MDFileTag"], [33446, "MDScalePixel"], [33447, "MDColorTable"], [33448, "MDLabName"], [33449, "MDSampleInfo"], [33450, "MDPrepDate"], [33451, "MDPrepTime"], [33452, "MDFileUnits"], [33589, "AdventScale"], [33590, "AdventRevision"], [33628, "UIC1Tag"], [33629, "UIC2Tag"], [33630, "UIC3Tag"], [33631, "UIC4Tag"], [33918, "IntergraphPacketData"], [33919, "IntergraphFlagRegisters"], [33921, "INGRReserved"], [34016, "Site"], [34017, "ColorSequence"], [34018, "IT8Header"], [34019, "RasterPadding"], [34020, "BitsPerRunLength"], [34021, "BitsPerExtendedRunLength"], [34022, "ColorTable"], [34023, "ImageColorIndicator"], [34024, "BackgroundColorIndicator"], [34025, "ImageColorValue"], [34026, "BackgroundColorValue"], [34027, "PixelIntensityRange"], [34028, "TransparencyIndicator"], [34029, "ColorCharacterization"], [34030, "HCUsage"], [34031, "TrapIndicator"], [34032, "CMYKEquivalent"], [34152, "AFCP_IPTC"], [34232, "PixelMagicJBIGOptions"], [34263, "JPLCartoIFD"], [34306, "WB_GRGBLevels"], [34310, "LeafData"], [34687, "TIFF_FXExtensions"], [34688, "MultiProfiles"], [34689, "SharedData"], [34690, "T88Options"], [34732, "ImageLayer"], [34750, "JBIGOptions"], [34856, "Opto-ElectricConvFactor"], [34857, "Interlace"], [34908, "FaxRecvParams"], [34909, "FaxSubAddress"], [34910, "FaxRecvTime"], [34929, "FedexEDR"], [34954, "LeafSubIFD"], [37387, "FlashEnergy"], [37388, "SpatialFrequencyResponse"], [37389, "Noise"], [37390, "FocalPlaneXResolution"], [37391, "FocalPlaneYResolution"], [37392, "FocalPlaneResolutionUnit"], [37397, "ExposureIndex"], [37398, "TIFF-EPStandardID"], [37399, "SensingMethod"], [37434, "CIP3DataFile"], [37435, "CIP3Sheet"], [37436, "CIP3Side"], [37439, "StoNits"], [37679, "MSDocumentText"], [37680, "MSPropertySetStorage"], [37681, "MSDocumentTextPosition"], [37724, "ImageSourceData"], [40965, "InteropIFD"], [40976, "SamsungRawPointersOffset"], [40977, "SamsungRawPointersLength"], [41217, "SamsungRawByteOrder"], [41218, "SamsungRawUnknown"], [41484, "SpatialFrequencyResponse"], [41485, "Noise"], [41489, "ImageNumber"], [41490, "SecurityClassification"], [41491, "ImageHistory"], [41494, "TIFF-EPStandardID"], [41995, "DeviceSettingDescription"], [42112, "GDALMetadata"], [42113, "GDALNoData"], [44992, "ExpandSoftware"], [44993, "ExpandLens"], [44994, "ExpandFilm"], [44995, "ExpandFilterLens"], [44996, "ExpandScanner"], [44997, "ExpandFlashLamp"], [46275, "HasselbladRawImage"], [48129, "PixelFormat"], [48130, "Transformation"], [48131, "Uncompressed"], [48132, "ImageType"], [48256, "ImageWidth"], [48257, "ImageHeight"], [48258, "WidthResolution"], [48259, "HeightResolution"], [48320, "ImageOffset"], [48321, "ImageByteCount"], [48322, "AlphaOffset"], [48323, "AlphaByteCount"], [48324, "ImageDataDiscard"], [48325, "AlphaDataDiscard"], [50215, "OceScanjobDesc"], [50216, "OceApplicationSelector"], [50217, "OceIDNumber"], [50218, "OceImageLogic"], [50255, "Annotations"], [50459, "HasselbladExif"], [50547, "OriginalFileName"], [50560, "USPTOOriginalContentType"], [50656, "CR2CFAPattern"], [50710, "CFAPlaneColor"], [50711, "CFALayout"], [50712, "LinearizationTable"], [50713, "BlackLevelRepeatDim"], [50714, "BlackLevel"], [50715, "BlackLevelDeltaH"], [50716, "BlackLevelDeltaV"], [50717, "WhiteLevel"], [50718, "DefaultScale"], [50719, "DefaultCropOrigin"], [50720, "DefaultCropSize"], [50733, "BayerGreenSplit"], [50737, "ChromaBlurRadius"], [50738, "AntiAliasStrength"], [50752, "RawImageSegmentation"], [50780, "BestQualityScale"], [50784, "AliasLayerMetadata"], [50829, "ActiveArea"], [50830, "MaskedAreas"], [50935, "NoiseReductionApplied"], [50974, "SubTileBlockSize"], [50975, "RowInterleaveFactor"], [51008, "OpcodeList1"], [51009, "OpcodeList2"], [51022, "OpcodeList3"], [51041, "NoiseProfile"], [51114, "CacheVersion"], [51125, "DefaultUserCrop"], [51157, "NikonNEFInfo"], [65024, "KdcIFD"]];
F(E, "ifd0", ut),
F(E, "exif", ut),
U(B, "gps", [[23, {
    M: "Magnetic North",
    T: "True North"
}], [25, {
    K: "Kilometers",
    M: "Miles",
    N: "Nautical Miles"
}]]);
class ft extends re {
    static canHandle(e, t) {
        return 224 === e.getUint8(t + 1) && 1246120262 === e.getUint32(t + 4) && 0 === e.getUint8(t + 8)
    }
    parse() {
        return this.parseTags(),
        this.translate(),
        this.output
    }
    parseTags() {
        this.raw = new Map([[0, this.chunk.getUint16(0)], [2, this.chunk.getUint8(2)], [3, this.chunk.getUint16(3)], [5, this.chunk.getUint16(5)], [7, this.chunk.getUint8(7)], [8, this.chunk.getUint8(8)]])
    }
}
u(ft, "type", "jfif"),
u(ft, "headerLength", 9),
T.set("jfif", ft),
U(E, "jfif", [[0, "JFIFVersion"], [2, "ResolutionUnit"], [3, "XResolution"], [5, "YResolution"], [7, "ThumbnailWidth"], [8, "ThumbnailHeight"]]);
class dt extends re {
    parse() {
        return this.parseTags(),
        this.translate(),
        this.output
    }
    parseTags() {
        this.raw = new Map([[0, this.chunk.getUint32(0)], [4, this.chunk.getUint32(4)], [8, this.chunk.getUint8(8)], [9, this.chunk.getUint8(9)], [10, this.chunk.getUint8(10)], [11, this.chunk.getUint8(11)], [12, this.chunk.getUint8(12)], ...Array.from(this.raw)])
    }
}
u(dt, "type", "ihdr"),
T.set("ihdr", dt),
U(E, "ihdr", [[0, "ImageWidth"], [4, "ImageHeight"], [8, "BitDepth"], [9, "ColorType"], [10, "Compression"], [11, "Filter"], [12, "Interlace"]]),
U(B, "ihdr", [[9, {
    0: "Grayscale",
    2: "RGB",
    3: "Palette",
    4: "Grayscale with Alpha",
    6: "RGB with Alpha",
    DEFAULT: "Unknown"
}], [10, {
    0: "Deflate/Inflate",
    DEFAULT: "Unknown"
}], [11, {
    0: "Adaptive",
    DEFAULT: "Unknown"
}], [12, {
    0: "Noninterlaced",
    1: "Adam7 Interlace",
    DEFAULT: "Unknown"
}]]);
class pt extends re {
    static canHandle(e, t) {
        return 226 === e.getUint8(t + 1) && 1229144927 === e.getUint32(t + 4)
    }
    static findPosition(e, t) {
        let i = super.findPosition(e, t);
        return i.chunkNumber = e.getUint8(t + 16),
        i.chunkCount = e.getUint8(t + 17),
        i.multiSegment = i.chunkCount > 1,
        i
    }
    static handleMultiSegments(e) {
        return function(e) {
            let t = function(e) {
                let t = e[0].constructor
                  , i = 0;
                for (let t of e)
                    i += t.length;
                let n = new t(i)
                  , s = 0;
                for (let t of e)
                    n.set(t, s),
                    s += t.length;
                return n
            }(e.map((e=>e.chunk.toUint8())));
            return new I(t)
        }(e)
    }
    parse() {
        return this.raw = new Map,
        this.parseHeader(),
        this.parseTags(),
        this.translate(),
        this.output
    }
    parseHeader() {
        let {raw: e} = this;
        this.chunk.byteLength < 84 && g("ICC header is too short");
        for (let[t,i] of Object.entries(gt)) {
            t = parseInt(t, 10);
            let n = i(this.chunk, t);
            "\0\0\0\0" !== n && e.set(t, n)
        }
    }
    parseTags() {
        let e, t, i, n, s, {raw: r} = this, a = this.chunk.getUint32(128), o = 132, l = this.chunk.byteLength;
        for (; a--; ) {
            if (e = this.chunk.getString(o, 4),
            t = this.chunk.getUint32(o + 4),
            i = this.chunk.getUint32(o + 8),
            n = this.chunk.getString(t, 4),
            t + i > l)
                return void console.warn("reached the end of the first ICC chunk. Enable options.tiff.multiSegment to read all ICC segments.");
            s = this.parseTag(n, t, i),
            void 0 !== s && "\0\0\0\0" !== s && r.set(e, s),
            o += 12
        }
    }
    parseTag(e, t, i) {
        switch (e) {
        case "desc":
            return this.parseDesc(t);
        case "mluc":
            return this.parseMluc(t);
        case "text":
            return this.parseText(t, i);
        case "sig ":
            return this.parseSig(t)
        }
        if (!(t + i > this.chunk.byteLength))
            return this.chunk.getUint8Array(t, i)
    }
    parseDesc(e) {
        let t = this.chunk.getUint32(e + 8) - 1;
        return m(this.chunk.getString(e + 12, t))
    }
    parseText(e, t) {
        return m(this.chunk.getString(e + 8, t - 8))
    }
    parseSig(e) {
        return m(this.chunk.getString(e + 8, 4))
    }
    parseMluc(e) {
        let {chunk: t} = this
          , i = t.getUint32(e + 8)
          , n = t.getUint32(e + 12)
          , s = e + 16
          , r = [];
        for (let a = 0; a < i; a++) {
            let i = t.getString(s + 0, 2)
              , a = t.getString(s + 2, 2)
              , o = t.getUint32(s + 4)
              , l = t.getUint32(s + 8) + e
              , h = m(t.getUnicodeString(l, o));
            r.push({
                lang: i,
                country: a,
                text: h
            }),
            s += n
        }
        return 1 === i ? r[0].text : r
    }
    translateValue(e, t) {
        return "string" == typeof e ? t[e] || t[e.toLowerCase()] || e : t[e] || e
    }
}
u(pt, "type", "icc"),
u(pt, "multiSegment", !0),
u(pt, "headerLength", 18);
const gt = {
    4: mt,
    8: function(e, t) {
        return [e.getUint8(t), e.getUint8(t + 1) >> 4, e.getUint8(t + 1) % 16].map((e=>e.toString(10))).join(".")
    },
    12: mt,
    16: mt,
    20: mt,
    24: function(e, t) {
        const i = e.getUint16(t)
          , n = e.getUint16(t + 2) - 1
          , s = e.getUint16(t + 4)
          , r = e.getUint16(t + 6)
          , a = e.getUint16(t + 8)
          , o = e.getUint16(t + 10);
        return new Date(Date.UTC(i, n, s, r, a, o))
    },
    36: mt,
    40: mt,
    48: mt,
    52: mt,
    64: (e,t)=>e.getUint32(t),
    80: mt
};
function mt(e, t) {
    return m(e.getString(t, 4))
}
T.set("icc", pt),
U(E, "icc", [[4, "ProfileCMMType"], [8, "ProfileVersion"], [12, "ProfileClass"], [16, "ColorSpaceData"], [20, "ProfileConnectionSpace"], [24, "ProfileDateTime"], [36, "ProfileFileSignature"], [40, "PrimaryPlatform"], [44, "CMMFlags"], [48, "DeviceManufacturer"], [52, "DeviceModel"], [56, "DeviceAttributes"], [64, "RenderingIntent"], [68, "ConnectionSpaceIlluminant"], [80, "ProfileCreator"], [84, "ProfileID"], ["Header", "ProfileHeader"], ["MS00", "WCSProfiles"], ["bTRC", "BlueTRC"], ["bXYZ", "BlueMatrixColumn"], ["bfd", "UCRBG"], ["bkpt", "MediaBlackPoint"], ["calt", "CalibrationDateTime"], ["chad", "ChromaticAdaptation"], ["chrm", "Chromaticity"], ["ciis", "ColorimetricIntentImageState"], ["clot", "ColorantTableOut"], ["clro", "ColorantOrder"], ["clrt", "ColorantTable"], ["cprt", "ProfileCopyright"], ["crdi", "CRDInfo"], ["desc", "ProfileDescription"], ["devs", "DeviceSettings"], ["dmdd", "DeviceModelDesc"], ["dmnd", "DeviceMfgDesc"], ["dscm", "ProfileDescriptionML"], ["fpce", "FocalPlaneColorimetryEstimates"], ["gTRC", "GreenTRC"], ["gXYZ", "GreenMatrixColumn"], ["gamt", "Gamut"], ["kTRC", "GrayTRC"], ["lumi", "Luminance"], ["meas", "Measurement"], ["meta", "Metadata"], ["mmod", "MakeAndModel"], ["ncl2", "NamedColor2"], ["ncol", "NamedColor"], ["ndin", "NativeDisplayInfo"], ["pre0", "Preview0"], ["pre1", "Preview1"], ["pre2", "Preview2"], ["ps2i", "PS2RenderingIntent"], ["ps2s", "PostScript2CSA"], ["psd0", "PostScript2CRD0"], ["psd1", "PostScript2CRD1"], ["psd2", "PostScript2CRD2"], ["psd3", "PostScript2CRD3"], ["pseq", "ProfileSequenceDesc"], ["psid", "ProfileSequenceIdentifier"], ["psvm", "PS2CRDVMSize"], ["rTRC", "RedTRC"], ["rXYZ", "RedMatrixColumn"], ["resp", "OutputResponse"], ["rhoc", "ReflectionHardcopyOrigColorimetry"], ["rig0", "PerceptualRenderingIntentGamut"], ["rig2", "SaturationRenderingIntentGamut"], ["rpoc", "ReflectionPrintOutputColorimetry"], ["sape", "SceneAppearanceEstimates"], ["scoe", "SceneColorimetryEstimates"], ["scrd", "ScreeningDesc"], ["scrn", "Screening"], ["targ", "CharTarget"], ["tech", "Technology"], ["vcgt", "VideoCardGamma"], ["view", "ViewingConditions"], ["vued", "ViewingCondDesc"], ["wtpt", "MediaWhitePoint"]]);
const St = {
    "4d2p": "Erdt Systems",
    AAMA: "Aamazing Technologies",
    ACER: "Acer",
    ACLT: "Acolyte Color Research",
    ACTI: "Actix Sytems",
    ADAR: "Adara Technology",
    ADBE: "Adobe",
    ADI: "ADI Systems",
    AGFA: "Agfa Graphics",
    ALMD: "Alps Electric",
    ALPS: "Alps Electric",
    ALWN: "Alwan Color Expertise",
    AMTI: "Amiable Technologies",
    AOC: "AOC International",
    APAG: "Apago",
    APPL: "Apple Computer",
    AST: "AST",
    "AT&T": "AT&T",
    BAEL: "BARBIERI electronic",
    BRCO: "Barco NV",
    BRKP: "Breakpoint",
    BROT: "Brother",
    BULL: "Bull",
    BUS: "Bus Computer Systems",
    "C-IT": "C-Itoh",
    CAMR: "Intel",
    CANO: "Canon",
    CARR: "Carroll Touch",
    CASI: "Casio",
    CBUS: "Colorbus PL",
    CEL: "Crossfield",
    CELx: "Crossfield",
    CGS: "CGS Publishing Technologies International",
    CHM: "Rochester Robotics",
    CIGL: "Colour Imaging Group, London",
    CITI: "Citizen",
    CL00: "Candela",
    CLIQ: "Color IQ",
    CMCO: "Chromaco",
    CMiX: "CHROMiX",
    COLO: "Colorgraphic Communications",
    COMP: "Compaq",
    COMp: "Compeq/Focus Technology",
    CONR: "Conrac Display Products",
    CORD: "Cordata Technologies",
    CPQ: "Compaq",
    CPRO: "ColorPro",
    CRN: "Cornerstone",
    CTX: "CTX International",
    CVIS: "ColorVision",
    CWC: "Fujitsu Laboratories",
    DARI: "Darius Technology",
    DATA: "Dataproducts",
    DCP: "Dry Creek Photo",
    DCRC: "Digital Contents Resource Center, Chung-Ang University",
    DELL: "Dell Computer",
    DIC: "Dainippon Ink and Chemicals",
    DICO: "Diconix",
    DIGI: "Digital",
    "DL&C": "Digital Light & Color",
    DPLG: "Doppelganger",
    DS: "Dainippon Screen",
    DSOL: "DOOSOL",
    DUPN: "DuPont",
    EPSO: "Epson",
    ESKO: "Esko-Graphics",
    ETRI: "Electronics and Telecommunications Research Institute",
    EVER: "Everex Systems",
    EXAC: "ExactCODE",
    Eizo: "Eizo",
    FALC: "Falco Data Products",
    FF: "Fuji Photo Film",
    FFEI: "FujiFilm Electronic Imaging",
    FNRD: "Fnord Software",
    FORA: "Fora",
    FORE: "Forefront Technology",
    FP: "Fujitsu",
    FPA: "WayTech Development",
    FUJI: "Fujitsu",
    FX: "Fuji Xerox",
    GCC: "GCC Technologies",
    GGSL: "Global Graphics Software",
    GMB: "Gretagmacbeth",
    GMG: "GMG",
    GOLD: "GoldStar Technology",
    GOOG: "Google",
    GPRT: "Giantprint",
    GTMB: "Gretagmacbeth",
    GVC: "WayTech Development",
    GW2K: "Sony",
    HCI: "HCI",
    HDM: "Heidelberger Druckmaschinen",
    HERM: "Hermes",
    HITA: "Hitachi America",
    HP: "Hewlett-Packard",
    HTC: "Hitachi",
    HiTi: "HiTi Digital",
    IBM: "IBM",
    IDNT: "Scitex",
    IEC: "Hewlett-Packard",
    IIYA: "Iiyama North America",
    IKEG: "Ikegami Electronics",
    IMAG: "Image Systems",
    IMI: "Ingram Micro",
    INTC: "Intel",
    INTL: "N/A (INTL)",
    INTR: "Intra Electronics",
    IOCO: "Iocomm International Technology",
    IPS: "InfoPrint Solutions Company",
    IRIS: "Scitex",
    ISL: "Ichikawa Soft Laboratory",
    ITNL: "N/A (ITNL)",
    IVM: "IVM",
    IWAT: "Iwatsu Electric",
    Idnt: "Scitex",
    Inca: "Inca Digital Printers",
    Iris: "Scitex",
    JPEG: "Joint Photographic Experts Group",
    JSFT: "Jetsoft Development",
    JVC: "JVC Information Products",
    KART: "Scitex",
    KFC: "KFC Computek Components",
    KLH: "KLH Computers",
    KMHD: "Konica Minolta",
    KNCA: "Konica",
    KODA: "Kodak",
    KYOC: "Kyocera",
    Kart: "Scitex",
    LCAG: "Leica",
    LCCD: "Leeds Colour",
    LDAK: "Left Dakota",
    LEAD: "Leading Technology",
    LEXM: "Lexmark International",
    LINK: "Link Computer",
    LINO: "Linotronic",
    LITE: "Lite-On",
    Leaf: "Leaf",
    Lino: "Linotronic",
    MAGC: "Mag Computronic",
    MAGI: "MAG Innovision",
    MANN: "Mannesmann",
    MICN: "Micron Technology",
    MICR: "Microtek",
    MICV: "Microvitec",
    MINO: "Minolta",
    MITS: "Mitsubishi Electronics America",
    MITs: "Mitsuba",
    MNLT: "Minolta",
    MODG: "Modgraph",
    MONI: "Monitronix",
    MONS: "Monaco Systems",
    MORS: "Morse Technology",
    MOTI: "Motive Systems",
    MSFT: "Microsoft",
    MUTO: "MUTOH INDUSTRIES",
    Mits: "Mitsubishi Electric",
    NANA: "NANAO",
    NEC: "NEC",
    NEXP: "NexPress Solutions",
    NISS: "Nissei Sangyo America",
    NKON: "Nikon",
    NONE: "none",
    OCE: "Oce Technologies",
    OCEC: "OceColor",
    OKI: "Oki",
    OKID: "Okidata",
    OKIP: "Okidata",
    OLIV: "Olivetti",
    OLYM: "Olympus",
    ONYX: "Onyx Graphics",
    OPTI: "Optiquest",
    PACK: "Packard Bell",
    PANA: "Matsushita Electric Industrial",
    PANT: "Pantone",
    PBN: "Packard Bell",
    PFU: "PFU",
    PHIL: "Philips Consumer Electronics",
    PNTX: "HOYA",
    POne: "Phase One A/S",
    PREM: "Premier Computer Innovations",
    PRIN: "Princeton Graphic Systems",
    PRIP: "Princeton Publishing Labs",
    QLUX: "Hong Kong",
    QMS: "QMS",
    QPCD: "QPcard AB",
    QUAD: "QuadLaser",
    QUME: "Qume",
    RADI: "Radius",
    RDDx: "Integrated Color Solutions",
    RDG: "Roland DG",
    REDM: "REDMS Group",
    RELI: "Relisys",
    RGMS: "Rolf Gierling Multitools",
    RICO: "Ricoh",
    RNLD: "Edmund Ronald",
    ROYA: "Royal",
    RPC: "Ricoh Printing Systems",
    RTL: "Royal Information Electronics",
    SAMP: "Sampo",
    SAMS: "Samsung",
    SANT: "Jaime Santana Pomares",
    SCIT: "Scitex",
    SCRN: "Dainippon Screen",
    SDP: "Scitex",
    SEC: "Samsung",
    SEIK: "Seiko Instruments",
    SEIk: "Seikosha",
    SGUY: "ScanGuy.com",
    SHAR: "Sharp Laboratories",
    SICC: "International Color Consortium",
    SONY: "Sony",
    SPCL: "SpectraCal",
    STAR: "Star",
    STC: "Sampo Technology",
    Scit: "Scitex",
    Sdp: "Scitex",
    Sony: "Sony",
    TALO: "Talon Technology",
    TAND: "Tandy",
    TATU: "Tatung",
    TAXA: "TAXAN America",
    TDS: "Tokyo Denshi Sekei",
    TECO: "TECO Information Systems",
    TEGR: "Tegra",
    TEKT: "Tektronix",
    TI: "Texas Instruments",
    TMKR: "TypeMaker",
    TOSB: "Toshiba",
    TOSH: "Toshiba",
    TOTK: "TOTOKU ELECTRIC",
    TRIU: "Triumph",
    TSBT: "Toshiba",
    TTX: "TTX Computer Products",
    TVM: "TVM Professional Monitor",
    TW: "TW Casper",
    ULSX: "Ulead Systems",
    UNIS: "Unisys",
    UTZF: "Utz Fehlau & Sohn",
    VARI: "Varityper",
    VIEW: "Viewsonic",
    VISL: "Visual communication",
    VIVO: "Vivo Mobile Communication",
    WANG: "Wang",
    WLBR: "Wilbur Imaging",
    WTG2: "Ware To Go",
    WYSE: "WYSE Technology",
    XERX: "Xerox",
    XRIT: "X-Rite",
    ZRAN: "Zoran",
    Zebr: "Zebra Technologies",
    appl: "Apple Computer",
    bICC: "basICColor",
    berg: "bergdesign",
    ceyd: "Integrated Color Solutions",
    clsp: "MacDermid ColorSpan",
    ds: "Dainippon Screen",
    dupn: "DuPont",
    ffei: "FujiFilm Electronic Imaging",
    flux: "FluxData",
    iris: "Scitex",
    kart: "Scitex",
    lcms: "Little CMS",
    lino: "Linotronic",
    none: "none",
    ob4d: "Erdt Systems",
    obic: "Medigraph",
    quby: "Qubyx Sarl",
    scit: "Scitex",
    scrn: "Dainippon Screen",
    sdp: "Scitex",
    siwi: "SIWI GRAFIKA",
    yxym: "YxyMaster"
}
  , Ct = {
    scnr: "Scanner",
    mntr: "Monitor",
    prtr: "Printer",
    link: "Device Link",
    abst: "Abstract",
    spac: "Color Space Conversion Profile",
    nmcl: "Named Color",
    cenc: "ColorEncodingSpace profile",
    mid: "MultiplexIdentification profile",
    mlnk: "MultiplexLink profile",
    mvis: "MultiplexVisualization profile",
    nkpf: "Nikon Input Device Profile (NON-STANDARD!)"
};
U(B, "icc", [[4, St], [12, Ct], [40, Object.assign({}, St, Ct)], [48, St], [80, St], [64, {
    0: "Perceptual",
    1: "Relative Colorimetric",
    2: "Saturation",
    3: "Absolute Colorimetric"
}], ["tech", {
    amd: "Active Matrix Display",
    crt: "Cathode Ray Tube Display",
    kpcd: "Photo CD",
    pmd: "Passive Matrix Display",
    dcam: "Digital Camera",
    dcpj: "Digital Cinema Projector",
    dmpc: "Digital Motion Picture Camera",
    dsub: "Dye Sublimation Printer",
    epho: "Electrophotographic Printer",
    esta: "Electrostatic Printer",
    flex: "Flexography",
    fprn: "Film Writer",
    fscn: "Film Scanner",
    grav: "Gravure",
    ijet: "Ink Jet Printer",
    imgs: "Photo Image Setter",
    mpfr: "Motion Picture Film Recorder",
    mpfs: "Motion Picture Film Scanner",
    offs: "Offset Lithography",
    pjtv: "Projection Television",
    rpho: "Photographic Paper Printer",
    rscn: "Reflective Scanner",
    silk: "Silkscreen",
    twax: "Thermal Wax Printer",
    vidc: "Video Camera",
    vidm: "Video Monitor"
}]]);
class yt extends re {
    static canHandle(e, t, i) {
        return 237 === e.getUint8(t + 1) && "Photoshop" === e.getString(t + 4, 9) && void 0 !== this.containsIptc8bim(e, t, i)
    }
    static headerLength(e, t, i) {
        let n, s = this.containsIptc8bim(e, t, i);
        if (void 0 !== s)
            return n = e.getUint8(t + s + 7),
            n % 2 != 0 && (n += 1),
            0 === n && (n = 4),
            s + 8 + n
    }
    static containsIptc8bim(e, t, i) {
        for (let n = 0; n < i; n++)
            if (this.isIptcSegmentHead(e, t + n))
                return n
    }
    static isIptcSegmentHead(e, t) {
        return 56 === e.getUint8(t) && 943868237 === e.getUint32(t) && 1028 === e.getUint16(t + 4)
    }
    parse() {
        let {raw: e} = this
          , t = this.chunk.byteLength - 1
          , i = !1;
        for (let n = 0; n < t; n++)
            if (28 === this.chunk.getUint8(n) && 2 === this.chunk.getUint8(n + 1)) {
                i = !0;
                let t = this.chunk.getUint16(n + 3)
                  , s = this.chunk.getUint8(n + 2)
                  , r = this.chunk.getLatin1String(n + 5, t);
                e.set(s, this.pluralizeValue(e.get(s), r)),
                n += 4 + t
            } else if (i)
                break;
        return this.translate(),
        this.output
    }
    pluralizeValue(e, t) {
        return void 0 !== e ? e instanceof Array ? (e.push(t),
        e) : [e, t] : t
    }
}
u(yt, "type", "iptc"),
u(yt, "translateValues", !1),
u(yt, "reviveValues", !1),
T.set("iptc", yt),
U(E, "iptc", [[0, "ApplicationRecordVersion"], [3, "ObjectTypeReference"], [4, "ObjectAttributeReference"], [5, "ObjectName"], [7, "EditStatus"], [8, "EditorialUpdate"], [10, "Urgency"], [12, "SubjectReference"], [15, "Category"], [20, "SupplementalCategories"], [22, "FixtureIdentifier"], [25, "Keywords"], [26, "ContentLocationCode"], [27, "ContentLocationName"], [30, "ReleaseDate"], [35, "ReleaseTime"], [37, "ExpirationDate"], [38, "ExpirationTime"], [40, "SpecialInstructions"], [42, "ActionAdvised"], [45, "ReferenceService"], [47, "ReferenceDate"], [50, "ReferenceNumber"], [55, "DateCreated"], [60, "TimeCreated"], [62, "DigitalCreationDate"], [63, "DigitalCreationTime"], [65, "OriginatingProgram"], [70, "ProgramVersion"], [75, "ObjectCycle"], [80, "Byline"], [85, "BylineTitle"], [90, "City"], [92, "Sublocation"], [95, "State"], [100, "CountryCode"], [101, "Country"], [103, "OriginalTransmissionReference"], [105, "Headline"], [110, "Credit"], [115, "Source"], [116, "CopyrightNotice"], [118, "Contact"], [120, "Caption"], [121, "LocalCaption"], [122, "Writer"], [125, "RasterizedCaption"], [130, "ImageType"], [131, "ImageOrientation"], [135, "LanguageIdentifier"], [150, "AudioType"], [151, "AudioSamplingRate"], [152, "AudioSamplingResolution"], [153, "AudioDuration"], [154, "AudioOutcue"], [184, "JobID"], [185, "MasterDocumentID"], [186, "ShortDocumentID"], [187, "UniqueDocumentID"], [188, "OwnerID"], [200, "ObjectPreviewFileFormat"], [201, "ObjectPreviewFileVersion"], [202, "ObjectPreviewData"], [221, "Prefs"], [225, "ClassifyState"], [228, "SimilarityIndex"], [230, "DocumentNotes"], [231, "DocumentHistory"], [232, "ExifCameraInfo"], [255, "CatalogSets"]]),
U(B, "iptc", [[10, {
    0: "0 (reserved)",
    1: "1 (most urgent)",
    2: "2",
    3: "3",
    4: "4",
    5: "5 (normal urgency)",
    6: "6",
    7: "7",
    8: "8 (least urgent)",
    9: "9 (user-defined priority)"
}], [75, {
    a: "Morning",
    b: "Both Morning and Evening",
    p: "Evening"
}], [131, {
    L: "Landscape",
    P: "Portrait",
    S: "Square"
}]]);
export default tt;
export {te as Exifr, Q as Options, X as allFormatters, G as chunkedProps, U as createDictionary, F as extendDictionary, M as fetchUrlAsArrayBuffer, w as fileParsers, A as fileReaders, Se as gps, me as gpsOnlyOptions, K as inheritables, Pe as orientation, Ie as orientationOnlyOptions, V as otherSegments, ie as parse, R as readBlobAsArrayBuffer, we as rotateCanvas, Te as rotateCss, Ae as rotation, ke as rotations, T as segmentParsers, z as segments, j as segmentsAndBlocks, st as sidecar, E as tagKeys, N as tagRevivers, B as tagValues, ye as thumbnail, Ce as thumbnailOnlyOptions, be as thumbnailUrl, H as tiffBlocks, W as tiffExtractables};
