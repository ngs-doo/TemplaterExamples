import { t as e } from "./chunk-DmhlhrBa.js";
import { t } from "./slide-pull-client-RTwQbJiy.js";
import { B as n, F as r, G as i, Gt as a, H as o, I as s, K as c, Kt as l, P as u, R as d, U as f, Zt as p, cn as m, pt as h, q as g, ut as _ } from "./line-metrics-BGtFM-ec.js";
import { t as ee } from "./bounded-raw-part-cache-C6ro6Ezf.js";
import { a as te, c as ne, i as re, l as ie, r as ae, u as oe } from "./document-pull-client-BssAk95w.js";
import { l as se, s as ce } from "./pixel-budget-Dgjw269h.js";
import { t as le } from "./transfer-mIj7E7NB.js";
import { a as ue, c as de, d as fe, l as pe, o as me, r as he, s as ge, t as _e, u as ve } from "./worksheet-pull-client-C9sC36Vu.js";
import { a as ye, i as be, n as xe, r as Se } from "./session-BmP4lcEo.js";
import { a as Ce, n as we, r as Te, t as Ee } from "./render-Dxvwes39.js";
import { existsSync as De, readFileSync as Oe } from "node:fs";
import { fileURLToPath as ke } from "node:url";
import { basename as Ae, dirname as je, resolve as Me } from "node:path";
import { createRequire as Ne } from "node:module";
//#region packages/core/src/internal/owned-session.ts
async function v(e, t) {
	let n = await e(), r;
	try {
		return await t(n);
	} catch (e) {
		throw r = e, e;
	} finally {
		try {
			await n.close();
		} catch (e) {
			if (r === void 0) throw e;
		}
	}
}
//#endregion
//#region packages/core/src/internal/in-process-pull-transport.ts
var y = class {
	nextRequestId = 1;
	terminated = !1;
	constructor(e, t) {
		this.dispatch = e, this.terminateHost = t;
	}
	async request(e, t, n) {
		if (this.terminated) throw Error("pull transport terminated");
		if (n?.signal?.aborted) {
			n.onCancel?.(this.nextRequestId, "abort");
			let e = /* @__PURE__ */ Error("worker request aborted");
			throw e.name = "AbortError", e;
		}
		let r = e(this.nextRequestId++), i;
		if (await this.dispatch(r, (e) => {
			i = e;
		}), i === void 0) throw Error("in-process pull host did not respond");
		return i;
	}
	forgetOrphaned(e) {}
	terminate() {
		this.terminated || (this.terminated = !0, this.terminateHost());
	}
};
//#endregion
//#region packages/node/src/wasm-loader.ts
function Pe(e) {
	return new WebAssembly.Module(Oe(e));
}
function b(e, t = Pe) {
	let n = {};
	return () => n.value ??= t(e());
}
function x(e, t, n) {
	let r = je(ke(e)), i = Me(r, t);
	if (De(i)) return i;
	let a = Me(r, Ae(t));
	return De(a) || !n ? a : Ne(e).resolve(n);
}
//#endregion
//#region packages/node/src/pptx.ts
var Fe = b(() => x(import.meta.url, "pptx_parser_bg.wasm", "@silurus/ooxml-pptx/wasm-binary"));
async function Ie(e, t = {}) {
	return Le(e, t);
}
async function Le(e, t = {}) {
	let n = await xe(Be(e), Fe(), t);
	return new Re(n.closeArchive, n.archive, n.bootstrap, n.metrics, t.signal);
}
var Re = class {
	slideCount;
	slideWidth;
	slideHeight;
	slidePull;
	slideClient;
	transport;
	started = !1;
	closed = !1;
	closePromise;
	usage;
	consumedSlides = 0;
	resourceFailure;
	renderTail = Promise.resolve();
	fetchImage = (e, t) => this.getPartInternal(e, t, (t) => t.extract_image(e));
	fetchMedia = (e) => this.getPartInternal(e, "application/octet-stream", (t) => t.extract_media(e));
	rawParts = new ee({
		maxEntries: 64,
		maxBytes: p
	});
	constructor(e, n, r, i, a) {
		this.closeArchive = e, this.archive = n, this.bootstrap = r, this.metrics = i, this.signal = a, this.slideCount = r.slideCount, this.slideWidth = r.slideWidth, this.slideHeight = r.slideHeight, this.slidePull = new be(() => this.archive), this.transport = new y((e, t) => this.slidePull.dispatchSafely(e, t), () => void 0), this.slideClient = new t({
			slideCount: this.slideCount,
			transport: this.transport,
			open: async (e, t) => {
				this.slidePull.reserveOpen(t), await this.slidePull.open(e, t);
			},
			onUsage: (e) => {
				this.usage = e, this.metrics.observeUsage(e);
			}
		});
	}
	materialize(e) {
		return {
			slideWidth: this.slideWidth,
			slideHeight: this.slideHeight,
			slides: e,
			defaultTextColor: this.bootstrap.defaultTextColor,
			majorFont: this.bootstrap.majorFont,
			minorFont: this.bootstrap.minorFont,
			...this.bootstrap.hlinkColor ? { hlinkColor: this.bootstrap.hlinkColor } : {},
			...this.bootstrap.folHlinkColor ? { folHlinkColor: this.bootstrap.folHlinkColor } : {}
		};
	}
	get resourceUsage() {
		return this.closed ? this.usage : this.refreshResourceUsage();
	}
	async getImage(e, t) {
		return this.assertOpen(), this.getPartInternal(e, t, (t) => t.extract_image(e)).catch((e) => this.failOperation(e));
	}
	async getMedia(e, t = "application/octet-stream") {
		return this.assertOpen(), this.getPartInternal(e, t, (t) => t.extract_media(e)).catch((e) => this.failOperation(e));
	}
	async renderSlide(e, t, n) {
		return this.assertOpen(), this.enqueueRender(async () => {
			S(this.signal);
			let { renderSlideNode: r } = await import("./render-Dxvwes39.js").then((e) => e.i);
			await r(e, {
				slideWidth: this.slideWidth,
				slideHeight: this.slideHeight,
				slides: [t],
				defaultTextColor: this.bootstrap.defaultTextColor,
				majorFont: this.bootstrap.majorFont,
				minorFont: this.bootstrap.minorFont,
				...this.bootstrap.hlinkColor ? { hlinkColor: this.bootstrap.hlinkColor } : {},
				...this.bootstrap.folHlinkColor ? { folHlinkColor: this.bootstrap.folHlinkColor } : {}
			}, 0, {
				...n,
				fetchImage: this.fetchImage,
				fetchMedia: this.fetchMedia
			}), S(this.signal);
		}).catch((e) => this.failOperation(e));
	}
	[Symbol.asyncIterator]() {
		return this.slides();
	}
	async *slides() {
		if (this.closed) throw Error("PPTX presentation session is closed");
		if (this.started) throw Error("PPTX presentation session is one-pass and was already consumed");
		this.started = !0;
		let e;
		try {
			for (let e = 0; e < this.slideCount; e += 1) {
				S(this.signal);
				let t = await this.slideClient.load(e);
				if (!t) throw Error(`PPTX slide ${e} was not decoded`);
				this.usage ??= await this.slidePull.run(() => ye((e) => e(this.archive))), this.metrics.observeUsage(this.usage), this.consumedSlides = e + 1, yield t;
			}
		} catch (t) {
			throw e = i(t) ?? t, this.metrics.fail(e), e;
		} finally {
			try {
				await this.close();
			} catch (t) {
				if (e === void 0) throw t;
			}
		}
	}
	close() {
		return this.closePromise ? this.closePromise : (this.closed = !0, this.slideClient.cancelAll(), this.closePromise = this.release(), this.closePromise);
	}
	async release() {
		let e;
		await this.renderTail, h(this.fetchImage), _(this.fetchImage);
		try {
			await this.slidePull.reset();
		} catch (t) {
			e = i(t) ?? t;
		}
		this.transport.terminate(), this.rawParts.clear();
		try {
			this.closeArchive();
		} catch (t) {
			e ??= i(t) ?? t;
		}
		if (e !== void 0) throw this.metrics.fail(e), e;
		this.metrics.checkpoint("presentation session closed"), this.metrics.succeed({ slides: this.consumedSlides });
	}
	enqueueRender(e) {
		let t = this.renderTail.then(e, e);
		return this.renderTail = t.then(() => void 0, () => void 0), t;
	}
	getPartInternal(e, t, n) {
		return this.rawParts.get(e, t, () => {
			S(this.signal);
			let e = n(this.archive);
			return this.refreshResourceUsage(), new Blob([e], { type: t });
		});
	}
	refreshResourceUsage() {
		try {
			this.usage = f(this.archive.resource_usage()), this.metrics.observeUsage(this.usage);
		} catch {}
		return this.usage;
	}
	assertOpen() {
		if (this.closed) throw Error("PPTX presentation session is closed");
		if (this.resourceFailure) throw this.resourceFailure;
	}
	failOperation(e) {
		let t = i(e) ?? e;
		throw t instanceof m && (this.resourceFailure ??= t), this.metrics.fail(t), t;
	}
};
async function ze(e, t = {}) {
	return v(() => Le(e, t), async (e) => {
		let t = [];
		for await (let n of e.slides()) t.push(n);
		return e.materialize(t);
	});
}
function Be(e) {
	return e instanceof Uint8Array ? e : new Uint8Array(e);
}
function S(e) {
	if (!e?.aborted) return;
	let t = /* @__PURE__ */ Error("PPTX presentation session was aborted");
	throw t.name = "AbortError", t;
}
//#endregion
//#region packages/docx/src/document-pull-worker.ts
var Ve = Math.max(a, l), He = class {
	coordinator = new s();
	host = null;
	identity = null;
	constructor(e, t = (e) => e(this.requireArchive())) {
		this.archive = e, this.executeArchive = t;
	}
	open(e) {
		if (this.host) throw Error("a DOCX document pull session is already active");
		this.executeArchive((t) => {
			t.open_document_cursor(e.operationId, e.generation);
		});
		let t = 0;
		this.identity = e, this.host = new r({
			...e,
			maxByteCredit: Ve,
			coordinator: this.coordinator,
			driver: {
				pull: (n) => {
					let r;
					try {
						r = this.executeArchive((r) => r.pull_document_chunk(t, e.operationId, e.generation, n));
					} catch (e) {
						throw g(e, n, Ve) || e;
					}
					let i = le(r);
					return {
						payload: i,
						byteLength: i.byteLength,
						done: this.executeArchive((e) => e.document_chunk_done()),
						transfer: [i]
					};
				},
				measureChunk: ({ payload: e }) => e.byteLength,
				acknowledge: (n) => {
					if (n !== t) throw Error("DOCX document acknowledgement sequence mismatch");
					this.executeArchive((n) => n.acknowledge_document_chunk(t, e.operationId, e.generation)), t += 1;
				},
				cancel: () => this.executeArchive((e) => e.cancel_document_cursor()),
				close: () => this.executeArchive((e) => e.close_document_session()),
				resourceUsage: () => {
					let e = this.executeArchive((e) => e.document_cursor_resource_usage?.());
					return e ? f(e) : void 0;
				}
			}
		});
	}
	dispatch(e, t) {
		return !this.host || !this.identity ? (t({
			protocol: u,
			kind: "error",
			sessionId: e.sessionId,
			operationId: e.operationId,
			generation: e.generation,
			requestId: e.requestId,
			error: c(/* @__PURE__ */ Error("DOCX document pull session is not open"))
		}), Promise.resolve()) : this.host.dispatch(e, t);
	}
	async reset() {
		if (this.host) try {
			this.archive() && this.executeArchive((e) => e.close_document_session());
		} finally {
			this.host = null, this.identity = null, this.coordinator = new s();
		}
	}
	requireArchive() {
		let e = this.archive();
		if (!e) throw Error("No docx loaded");
		return e;
	}
}, Ue = /* @__PURE__ */ e({
	DocxArchive: () => C,
	default: () => tt,
	docx_to_markdown: () => We,
	extract_image: () => Ge,
	initSync: () => et,
	parse_docx: () => Ke,
	reinit: () => nt
}), C = class {
	__destroy_into_raw() {
		let e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, Je.unregister(this), e;
	}
	free() {
		let e = this.__destroy_into_raw();
		L.__wbg_docxarchive_free(e, 0);
	}
	acknowledge_document_chunk(e, t, n) {
		let r = L.docxarchive_acknowledge_document_chunk(this.__wbg_ptr, e, t, n);
		if (r[1]) throw M(r[0]);
	}
	assert_healthy() {
		let e = L.docxarchive_assert_healthy(this.__wbg_ptr);
		if (e[1]) throw M(e[0]);
	}
	cancel_document_cursor() {
		L.docxarchive_cancel_document_cursor(this.__wbg_ptr);
	}
	close_document_session() {
		L.docxarchive_close_document_session(this.__wbg_ptr);
	}
	document_chunk_done() {
		let e = L.docxarchive_document_chunk_done(this.__wbg_ptr);
		if (e[2]) throw M(e[1]);
		return e[0] !== 0;
	}
	document_cursor_resource_usage() {
		let e = L.docxarchive_document_cursor_resource_usage(this.__wbg_ptr);
		if (e[3]) throw M(e[2]);
		var t = w(e[0], e[1]).slice();
		return L.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	extract_image(e) {
		let t = j(e, L.__wbindgen_malloc, L.__wbindgen_realloc), n = I, r = L.docxarchive_extract_image(this.__wbg_ptr, t, n);
		if (r[3]) throw M(r[2]);
		var i = w(r[0], r[1]).slice();
		return L.__wbindgen_free(r[0], r[1] * 1, 1), i;
	}
	constructor(e, t, n, r) {
		let i = A(e, L.__wbindgen_malloc), a = I, o = L.docxarchive_new(i, a, !k(t), k(t) ? BigInt(0) : t, !k(n), k(n) ? BigInt(0) : n, !k(r), k(r) ? BigInt(0) : r);
		if (o[2]) throw M(o[1]);
		return this.__wbg_ptr = o[0] >>> 0, Je.register(this, this.__wbg_ptr, this), this;
	}
	open_document_cursor(e, t) {
		let n = L.docxarchive_open_document_cursor(this.__wbg_ptr, e, t);
		if (n[1]) throw M(n[0]);
	}
	parse() {
		let e = L.docxarchive_parse(this.__wbg_ptr);
		if (e[3]) throw M(e[2]);
		var t = w(e[0], e[1]).slice();
		return L.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	pull_document_chunk(e, t, n, r) {
		let i = L.docxarchive_pull_document_chunk(this.__wbg_ptr, e, t, n, r);
		if (i[3]) throw M(i[2]);
		var a = w(i[0], i[1]).slice();
		return L.__wbindgen_free(i[0], i[1] * 1, 1), a;
	}
	resource_usage() {
		let e = L.docxarchive_resource_usage(this.__wbg_ptr);
		if (e[3]) throw M(e[2]);
		var t = w(e[0], e[1]).slice();
		return L.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	to_markdown() {
		let e, t;
		try {
			let i = L.docxarchive_to_markdown(this.__wbg_ptr);
			var n = i[0], r = i[1];
			if (i[3]) throw n = 0, r = 0, M(i[2]);
			return e = n, t = r, E(n, r);
		} finally {
			L.__wbindgen_free(e, t, 1);
		}
	}
};
Symbol.dispose && (C.prototype[Symbol.dispose] = C.prototype.free);
function We(e, t, n) {
	let r, i;
	try {
		let s = A(e, L.__wbindgen_malloc), c = I, l = L.docx_to_markdown(s, c, !k(t), k(t) ? BigInt(0) : t, !k(n), k(n) ? BigInt(0) : n);
		var a = l[0], o = l[1];
		if (l[3]) throw a = 0, o = 0, M(l[2]);
		return r = a, i = o, E(a, o);
	} finally {
		L.__wbindgen_free(r, i, 1);
	}
}
function Ge(e, t, n, r) {
	let i = A(e, L.__wbindgen_malloc), a = I, o = j(t, L.__wbindgen_malloc, L.__wbindgen_realloc), s = I, c = L.extract_image(i, a, o, s, !k(n), k(n) ? BigInt(0) : n, !k(r), k(r) ? BigInt(0) : r);
	if (c[3]) throw M(c[2]);
	var l = w(c[0], c[1]).slice();
	return L.__wbindgen_free(c[0], c[1] * 1, 1), l;
}
function Ke(e, t, n) {
	let r = A(e, L.__wbindgen_malloc), i = I, a = L.parse_docx(r, i, !k(t), k(t) ? BigInt(0) : t, !k(n), k(n) ? BigInt(0) : n);
	if (a[3]) throw M(a[2]);
	var o = w(a[0], a[1]).slice();
	return L.__wbindgen_free(a[0], a[1] * 1, 1), o;
}
function qe() {
	return {
		__proto__: null,
		"./docx_parser_bg.js": {
			__proto__: null,
			__wbg___wbindgen_throw_6b64449b9b9ed33c: function(e, t) {
				throw Error(E(e, t));
			},
			__wbg_error_a6fa202b58aa1cd3: function(e, t) {
				let n, r;
				try {
					n = e, r = t, console.error(E(e, t));
				} finally {
					L.__wbindgen_free(n, r, 1);
				}
			},
			__wbg_new_227d7c05414eb861: function() {
				return /* @__PURE__ */ Error();
			},
			__wbg_stack_3b0d974bbf31e44f: function(e, t) {
				let n = t.stack, r = j(n, L.__wbindgen_malloc, L.__wbindgen_realloc), i = I;
				Ye().setInt32(e + 4, i, !0), Ye().setInt32(e + 0, r, !0);
			},
			__wbindgen_cast_0000000000000001: function(e, t) {
				return E(e, t);
			},
			__wbindgen_init_externref_table: function() {
				let e = L.__wbindgen_externrefs, t = e.grow(4);
				e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
			}
		}
	};
}
var Je = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((e) => L.__wbg_docxarchive_free(e >>> 0, 1));
function w(e, t) {
	return e >>>= 0, O().subarray(e / 1, e / 1 + t);
}
var T = null;
function Ye() {
	return (T === null || T.buffer.detached === !0 || T.buffer.detached === void 0 && T.buffer !== L.memory.buffer) && (T = new DataView(L.memory.buffer)), T;
}
function E(e, t) {
	return e >>>= 0, Ze(e, t);
}
var D = null;
function O() {
	return (D === null || D.byteLength === 0) && (D = new Uint8Array(L.memory.buffer)), D;
}
function k(e) {
	return e == null;
}
function A(e, t) {
	let n = t(e.length * 1, 1) >>> 0;
	return O().set(e, n / 1), I = e.length, n;
}
function j(e, t, n) {
	if (n === void 0) {
		let n = F.encode(e), r = t(n.length, 1) >>> 0;
		return O().subarray(r, r + n.length).set(n), I = n.length, r;
	}
	let r = e.length, i = t(r, 1) >>> 0, a = O(), o = 0;
	for (; o < r; o++) {
		let t = e.charCodeAt(o);
		if (t > 127) break;
		a[i + o] = t;
	}
	if (o !== r) {
		o !== 0 && (e = e.slice(o)), i = n(i, r, r = o + e.length * 3, 1) >>> 0;
		let t = O().subarray(i + o, i + r), a = F.encodeInto(e, t);
		o += a.written, i = n(i, r, o, 1) >>> 0;
	}
	return I = o, i;
}
function M(e) {
	let t = L.__wbindgen_externrefs.get(e);
	return L.__externref_table_dealloc(e), t;
}
var N = new TextDecoder("utf-8", {
	ignoreBOM: !0,
	fatal: !0
});
N.decode();
var Xe = 2146435072, P = 0;
function Ze(e, t) {
	return P += t, P >= Xe && (N = new TextDecoder("utf-8", {
		ignoreBOM: !0,
		fatal: !0
	}), N.decode(), P = t), N.decode(O().subarray(e, e + t));
}
var F = new TextEncoder();
"encodeInto" in F || (F.encodeInto = function(e, t) {
	let n = F.encode(e);
	return t.set(n), {
		read: e.length,
		written: n.length
	};
});
var I = 0, L;
function Qe(e, t) {
	return L = e.exports, T = null, D = null, L.__wbindgen_start(), L;
}
async function $e(e, t) {
	if (typeof Response == "function" && e instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming == "function") try {
			return await WebAssembly.instantiateStreaming(e, t);
		} catch (t) {
			if (e.ok && n(e.type) && e.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t);
			else throw t;
		}
		let r = await e.arrayBuffer();
		return await WebAssembly.instantiate(r, t);
	} else {
		let n = await WebAssembly.instantiate(e, t);
		return n instanceof WebAssembly.Instance ? {
			instance: n,
			module: e
		} : n;
	}
	function n(e) {
		switch (e) {
			case "basic":
			case "cors":
			case "default": return !0;
		}
		return !1;
	}
}
function et(e) {
	if (L !== void 0) return L;
	e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module: e} = e : console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));
	let t = qe();
	return e instanceof WebAssembly.Module || (e = new WebAssembly.Module(e)), Qe(new WebAssembly.Instance(e, t), e);
}
async function tt(e) {
	if (L !== void 0) return L;
	e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module_or_path: e} = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead"));
	let t = qe();
	(typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
	let { instance: n, module: r } = await $e(await e, t);
	return Qe(n, r);
}
async function nt(e) {
	return L = void 0, T = null, D = null, tt(e);
}
//#endregion
//#region packages/docx/src/internal/node-acquisition.ts
var rt, it;
function at(e) {
	if (!it) rt = e, it = new Se(Ue, e);
	else if (rt !== e) throw Error("DOCX runtime was already initialized with another WebAssembly.Module");
	return it;
}
async function ot(e, t, r, a) {
	let s = n(r), c = new d({
		enabled: s.debug || s.onResourceMetrics !== void 0,
		format: "docx",
		mode: "node",
		scope: "session",
		policy: s.policy,
		onMetrics: s.onResourceMetrics,
		emitToConsole: s.debug
	});
	c.setSourceBytes(e.byteLength);
	let l, u, f;
	try {
		ct(r.signal);
		let [n, i, d] = o(s.policy), p = C;
		l = await at(t).open(() => new p(e, n, i, d), {
			signal: r.signal,
			abortError: lt,
			disposeOnAbort: (e) => e.free()
		}), ct(r.signal);
		let m = l.proxy;
		c.checkpoint("container ready"), u = new He(() => m);
		let h = {
			sessionId: 1,
			operationId: 1,
			generation: 1
		};
		u.open(h), f = new y((e, t) => u?.dispatch(e, t), () => void 0);
		let g, _ = await a(f, h, {
			signal: r.signal,
			onUsage: (e) => {
				g = e, c.observeUsage(e);
			}
		});
		return g ??= st(m.document_cursor_resource_usage()), c.observeUsage(g), c.checkpoint("model streamed"), await u.reset(), f.terminate(), {
			archive: m,
			result: _,
			usage: g,
			metrics: c,
			closeArchive: () => l?.close((e) => e.free())
		};
	} catch (e) {
		await u?.reset().catch(() => void 0), f?.terminate();
		try {
			l?.close((e) => e.free());
		} catch {}
		let t = i(e) ?? e;
		throw c.fail(t), t;
	}
}
function st(e) {
	try {
		return f(e);
	} catch {
		return;
	}
}
function ct(e) {
	if (e?.aborted) throw lt();
}
function lt() {
	let e = /* @__PURE__ */ Error("DOCX document session was aborted");
	return e.name = "AbortError", e;
}
//#endregion
//#region packages/node/src/docx.ts
var ut = b(() => x(import.meta.url, "docx_parser_bg.wasm", "@silurus/ooxml-docx/wasm-binary"));
async function dt(e, t) {
	if (!t?.factory) throw TypeError("openDocxDocument requires a canvas factory");
	let n = await ot(ht(e), ut(), t, (e, t, n) => ae(e, t, n));
	try {
		gt(t.signal);
		let e = t.factory.createCanvas(1, 1), r = ie(n.result, { measureContext: e.getContext("2d") }), i = mt(t.currentDate), a = te(n.result, r, i).layoutVariants.defaultLayout, o = new pt(n.closeArchive, n.archive, n.result, r, a, t.factory, i, n.usage, n.metrics, t.signal);
		return n.metrics.observeUsage(o.resourceUsage), n.metrics.checkpoint("pagination ready"), o;
	} catch (e) {
		try {
			n.closeArchive();
		} catch {}
		let t = i(e) ?? e;
		throw n.metrics.fail(t), t;
	}
}
async function ft(e, t = {}) {
	return v(async () => {
		let n = await ot(ht(e), ut(), t, (e, t, n) => re(e, t, n)), r = !1;
		return {
			acquired: n,
			markSucceeded: () => {
				r = !0;
			},
			close: async () => {
				try {
					n.closeArchive(), r && n.metrics.succeed({ documents: 1 });
				} catch (e) {
					throw n.metrics.fail(e), e;
				}
			}
		};
	}, async ({ acquired: e, markSucceeded: t }) => {
		try {
			let n = oe(e.result);
			return e.metrics.checkpoint("document materialized", e.usage), t(), n;
		} catch (t) {
			throw e.metrics.fail(t), t;
		}
	});
}
var pt = class {
	pageCount;
	sizes;
	lastResourceUsage;
	state;
	renderTail = Promise.resolve();
	pagesStarted = !1;
	closed = !1;
	closePromise;
	resourceFailure = null;
	fetchImage = async (e, t) => {
		let n = this.archive.extract_image(e);
		return new Blob([n], { type: t });
	};
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.closeArchive = e, this.archive = t, this.factory = a, this.defaultCurrentDateMs = o, this.metrics = c, this.signal = l, this.state = {
			source: n,
			services: r
		}, this.pageCount = i.pages.length, this.lastResourceUsage = s, this.sizes = Object.freeze(i.pages.map((e) => Object.freeze({
			widthPt: e.geometry.widthPt,
			heightPt: e.geometry.heightPt
		})));
	}
	get resourceUsage() {
		return this.closed ? this.lastResourceUsage : this.refreshResourceUsage();
	}
	refreshResourceUsage() {
		try {
			this.lastResourceUsage = f(this.archive.resource_usage()), this.metrics.observeUsage(this.lastResourceUsage);
		} catch {}
		return this.lastResourceUsage;
	}
	pageSize(e) {
		let t = this.sizes[e];
		if (!t) throw RangeError(`DOCX page index ${e} out of range`);
		return t;
	}
	[Symbol.asyncIterator]() {
		return this.pages();
	}
	renderPage(e, t = {}) {
		return this.closed ? Promise.reject(/* @__PURE__ */ Error("DOCX document session is closed")) : this.resourceFailure ? Promise.reject(this.resourceFailure) : (this.pageSize(e), this.enqueueRender(async () => {
			gt(this.signal);
			let n = this.requireState(), r = this.factory.createCanvas(1, 1);
			return await Ce(this.factory, () => ne(n.source, r, e, {
				...t,
				currentDate: this.defaultCurrentDateMs,
				defaultCurrentDateMs: this.defaultCurrentDateMs,
				layoutServices: n.services,
				fetchImage: this.fetchImage
			})), gt(this.signal), r;
		}).catch((e) => {
			let t = i(e) ?? e;
			throw t instanceof m && (this.resourceFailure ??= t), this.metrics.fail(t), t;
		}));
	}
	async *pages(e = {}) {
		if (this.closed) throw Error("DOCX document session is closed");
		if (this.pagesStarted) throw Error("DOCX page stream is one-pass and was already consumed");
		this.pagesStarted = !0;
		let t;
		try {
			for (let t = 0; t < this.pageCount; t += 1) {
				let n = await this.renderPage(t, e), r = this.pageSize(t);
				yield {
					pageIndex: t,
					...r,
					canvas: n
				};
			}
		} catch (e) {
			throw t = i(e) ?? e, t;
		} finally {
			try {
				await this.close();
			} catch (e) {
				if (t === void 0) throw e;
			}
		}
	}
	close() {
		return this.closePromise ? this.closePromise : (this.refreshResourceUsage(), this.closed = !0, this.closePromise = this.release(), this.closePromise);
	}
	enqueueRender(e) {
		let t = this.renderTail.then(e, e);
		return this.renderTail = t.then(() => void 0, () => void 0), t;
	}
	async release() {
		await this.renderTail, h(this.fetchImage), _(this.fetchImage), this.state = null;
		try {
			this.closeArchive();
		} catch (e) {
			let t = i(e) ?? e;
			throw this.metrics.fail(t), t;
		}
		this.metrics.checkpoint("document session closed", this.lastResourceUsage), this.metrics.succeed({ pages: this.pageCount });
	}
	requireState() {
		if (!this.state) throw Error("DOCX document session is closed");
		return this.state;
	}
};
function mt(e) {
	let t = e instanceof Date ? e.getTime() : e ?? Date.now();
	if (!Number.isFinite(t)) throw RangeError("currentDate must resolve to finite epoch milliseconds");
	return t;
}
function ht(e) {
	return e instanceof Uint8Array ? e : new Uint8Array(e);
}
function gt(e) {
	if (!e?.aborted) return;
	let t = /* @__PURE__ */ Error("DOCX document session was aborted");
	throw t.name = "AbortError", t;
}
//#endregion
//#region packages/xlsx/src/internal/archive-bootstrap.ts
var _t = "xlsx resource usage is unavailable";
function vt(e, t) {
	let n = e();
	try {
		return {
			workbook: n,
			usage: f(t())
		};
	} catch (e) {
		if ((e instanceof Error ? e.message : String(e)) === _t) return {
			workbook: n,
			usage: void 0
		};
		throw e;
	}
}
//#endregion
//#region packages/xlsx/src/wasm/xlsx_parser.js
var yt = /* @__PURE__ */ e({
	XlsxArchive: () => R,
	default: () => Mt,
	extract_image: () => bt,
	initSync: () => jt,
	parse_xlsx: () => xt,
	reinit: () => Nt,
	xlsx_to_markdown: () => St
}), R = class {
	__destroy_into_raw() {
		let e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, wt.unregister(this), e;
	}
	free() {
		let e = this.__destroy_into_raw();
		Z.__wbg_xlsxarchive_free(e, 0);
	}
	acknowledge_sheet_cursor_terminal() {
		let e = Z.xlsxarchive_acknowledge_sheet_cursor_terminal(this.__wbg_ptr);
		if (e[1]) throw q(e[0]);
	}
	assert_healthy() {
		let e = Z.xlsxarchive_assert_healthy(this.__wbg_ptr);
		if (e[1]) throw q(e[0]);
	}
	cancel_sheet_cursor() {
		Z.xlsxarchive_cancel_sheet_cursor(this.__wbg_ptr);
	}
	close_sheet_cursor() {
		Z.xlsxarchive_close_sheet_cursor(this.__wbg_ptr);
	}
	extract_image(e) {
		let t = K(e, Z.__wbindgen_malloc, Z.__wbindgen_realloc), n = X, r = Z.xlsxarchive_extract_image(this.__wbg_ptr, t, n);
		if (r[3]) throw q(r[2]);
		var i = z(r[0], r[1]).slice();
		return Z.__wbindgen_free(r[0], r[1] * 1, 1), i;
	}
	constructor(e, t, n, r) {
		let i = G(e, Z.__wbindgen_malloc), a = X, o = Z.xlsxarchive_new(i, a, !W(t), W(t) ? BigInt(0) : t, !W(n), W(n) ? BigInt(0) : n, !W(r), W(r) ? BigInt(0) : r);
		if (o[2]) throw q(o[1]);
		return this.__wbg_ptr = o[0] >>> 0, wt.register(this, this.__wbg_ptr, this), this;
	}
	open_sheet_cursor(e, t) {
		let n = K(t, Z.__wbindgen_malloc, Z.__wbindgen_realloc), r = X, i = Z.xlsxarchive_open_sheet_cursor(this.__wbg_ptr, e, n, r);
		if (i[1]) throw q(i[0]);
	}
	parse() {
		let e = Z.xlsxarchive_parse(this.__wbg_ptr);
		if (e[3]) throw q(e[2]);
		var t = z(e[0], e[1]).slice();
		return Z.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	pull_sheet_cursor(e) {
		let t = Z.xlsxarchive_pull_sheet_cursor(this.__wbg_ptr, e);
		if (t[3]) throw q(t[2]);
		var n = z(t[0], t[1]).slice();
		return Z.__wbindgen_free(t[0], t[1] * 1, 1), n;
	}
	resource_usage() {
		let e = Z.xlsxarchive_resource_usage(this.__wbg_ptr);
		if (e[3]) throw q(e[2]);
		var t = z(e[0], e[1]).slice();
		return Z.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	sheet_cursor_pull_finished() {
		return Z.xlsxarchive_sheet_cursor_pull_finished(this.__wbg_ptr) !== 0;
	}
	sheet_cursor_resource_usage() {
		let e = Z.xlsxarchive_sheet_cursor_resource_usage(this.__wbg_ptr);
		if (e[3]) throw q(e[2]);
		var t = z(e[0], e[1]).slice();
		return Z.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	to_markdown() {
		let e, t;
		try {
			let i = Z.xlsxarchive_to_markdown(this.__wbg_ptr);
			var n = i[0], r = i[1];
			if (i[3]) throw n = 0, r = 0, q(i[2]);
			return e = n, t = r, V(n, r);
		} finally {
			Z.__wbindgen_free(e, t, 1);
		}
	}
};
Symbol.dispose && (R.prototype[Symbol.dispose] = R.prototype.free);
function bt(e, t, n, r) {
	let i = G(e, Z.__wbindgen_malloc), a = X, o = K(t, Z.__wbindgen_malloc, Z.__wbindgen_realloc), s = X, c = Z.extract_image(i, a, o, s, !W(n), W(n) ? BigInt(0) : n, !W(r), W(r) ? BigInt(0) : r);
	if (c[3]) throw q(c[2]);
	var l = z(c[0], c[1]).slice();
	return Z.__wbindgen_free(c[0], c[1] * 1, 1), l;
}
function xt(e, t, n) {
	let r = G(e, Z.__wbindgen_malloc), i = X, a = Z.parse_xlsx(r, i, !W(t), W(t) ? BigInt(0) : t, !W(n), W(n) ? BigInt(0) : n);
	if (a[3]) throw q(a[2]);
	var o = z(a[0], a[1]).slice();
	return Z.__wbindgen_free(a[0], a[1] * 1, 1), o;
}
function St(e, t, n) {
	let r, i;
	try {
		let s = G(e, Z.__wbindgen_malloc), c = X, l = Z.xlsx_to_markdown(s, c, !W(t), W(t) ? BigInt(0) : t, !W(n), W(n) ? BigInt(0) : n);
		var a = l[0], o = l[1];
		if (l[3]) throw a = 0, o = 0, q(l[2]);
		return r = a, i = o, V(a, o);
	} finally {
		Z.__wbindgen_free(r, i, 1);
	}
}
function Ct() {
	return {
		__proto__: null,
		"./xlsx_parser_bg.js": {
			__proto__: null,
			__wbg___wbindgen_throw_6b64449b9b9ed33c: function(e, t) {
				throw Error(V(e, t));
			},
			__wbg_error_a6fa202b58aa1cd3: function(e, t) {
				let n, r;
				try {
					n = e, r = t, console.error(V(e, t));
				} finally {
					Z.__wbindgen_free(n, r, 1);
				}
			},
			__wbg_new_227d7c05414eb861: function() {
				return /* @__PURE__ */ Error();
			},
			__wbg_stack_3b0d974bbf31e44f: function(e, t) {
				let n = t.stack, r = K(n, Z.__wbindgen_malloc, Z.__wbindgen_realloc), i = X;
				Tt().setInt32(e + 4, i, !0), Tt().setInt32(e + 0, r, !0);
			},
			__wbindgen_cast_0000000000000001: function(e, t) {
				return V(e, t);
			},
			__wbindgen_init_externref_table: function() {
				let e = Z.__wbindgen_externrefs, t = e.grow(4);
				e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
			}
		}
	};
}
var wt = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((e) => Z.__wbg_xlsxarchive_free(e >>> 0, 1));
function z(e, t) {
	return e >>>= 0, U().subarray(e / 1, e / 1 + t);
}
var B = null;
function Tt() {
	return (B === null || B.buffer.detached === !0 || B.buffer.detached === void 0 && B.buffer !== Z.memory.buffer) && (B = new DataView(Z.memory.buffer)), B;
}
function V(e, t) {
	return e >>>= 0, Ot(e, t);
}
var H = null;
function U() {
	return (H === null || H.byteLength === 0) && (H = new Uint8Array(Z.memory.buffer)), H;
}
function W(e) {
	return e == null;
}
function G(e, t) {
	let n = t(e.length * 1, 1) >>> 0;
	return U().set(e, n / 1), X = e.length, n;
}
function K(e, t, n) {
	if (n === void 0) {
		let n = Y.encode(e), r = t(n.length, 1) >>> 0;
		return U().subarray(r, r + n.length).set(n), X = n.length, r;
	}
	let r = e.length, i = t(r, 1) >>> 0, a = U(), o = 0;
	for (; o < r; o++) {
		let t = e.charCodeAt(o);
		if (t > 127) break;
		a[i + o] = t;
	}
	if (o !== r) {
		o !== 0 && (e = e.slice(o)), i = n(i, r, r = o + e.length * 3, 1) >>> 0;
		let t = U().subarray(i + o, i + r), a = Y.encodeInto(e, t);
		o += a.written, i = n(i, r, o, 1) >>> 0;
	}
	return X = o, i;
}
function q(e) {
	let t = Z.__wbindgen_externrefs.get(e);
	return Z.__externref_table_dealloc(e), t;
}
var J = new TextDecoder("utf-8", {
	ignoreBOM: !0,
	fatal: !0
});
J.decode();
var Et = 2146435072, Dt = 0;
function Ot(e, t) {
	return Dt += t, Dt >= Et && (J = new TextDecoder("utf-8", {
		ignoreBOM: !0,
		fatal: !0
	}), J.decode(), Dt = t), J.decode(U().subarray(e, e + t));
}
var Y = new TextEncoder();
"encodeInto" in Y || (Y.encodeInto = function(e, t) {
	let n = Y.encode(e);
	return t.set(n), {
		read: e.length,
		written: n.length
	};
});
var X = 0, Z;
function kt(e, t) {
	return Z = e.exports, B = null, H = null, Z.__wbindgen_start(), Z;
}
async function At(e, t) {
	if (typeof Response == "function" && e instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming == "function") try {
			return await WebAssembly.instantiateStreaming(e, t);
		} catch (t) {
			if (e.ok && n(e.type) && e.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t);
			else throw t;
		}
		let r = await e.arrayBuffer();
		return await WebAssembly.instantiate(r, t);
	} else {
		let n = await WebAssembly.instantiate(e, t);
		return n instanceof WebAssembly.Instance ? {
			instance: n,
			module: e
		} : n;
	}
	function n(e) {
		switch (e) {
			case "basic":
			case "cors":
			case "default": return !0;
		}
		return !1;
	}
}
function jt(e) {
	if (Z !== void 0) return Z;
	e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module: e} = e : console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));
	let t = Ct();
	return e instanceof WebAssembly.Module || (e = new WebAssembly.Module(e)), kt(new WebAssembly.Instance(e, t), e);
}
async function Mt(e) {
	if (Z !== void 0) return Z;
	e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module_or_path: e} = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead"));
	let t = Ct();
	(typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
	let { instance: n, module: r } = await At(await e, t);
	return kt(n, r);
}
async function Nt(e) {
	return Z = void 0, B = null, H = null, Mt(e);
}
//#endregion
//#region packages/xlsx/src/internal/node-acquisition.ts
var Pt, Q;
function Ft(e) {
	if (!Q) Pt = e, Q = new Se(yt, e);
	else if (Pt !== e) throw Error("XLSX runtime was already initialized with another WebAssembly.Module");
	return Q;
}
async function It(e, t, r = {}) {
	let a = n(r), s = new d({
		enabled: a.debug || a.onResourceMetrics !== void 0,
		format: "xlsx",
		mode: "node",
		scope: "session",
		policy: a.policy,
		onMetrics: a.onResourceMetrics,
		emitToConsole: a.debug
	});
	s.setSourceBytes(e.byteLength);
	let c;
	try {
		Lt(r.signal);
		let [n, i, l] = o(a.policy), u = R;
		c = await Ft(t).open(() => new u(e, n, i, l), {
			signal: r.signal,
			abortError: Rt,
			disposeOnAbort: (e) => e.free()
		}), Lt(r.signal);
		let d = c.proxy, { workbook: f, usage: p } = vt(() => JSON.parse(new TextDecoder().decode(d.parse())), () => d.resource_usage());
		return s.observeUsage(p), s.checkpoint("workbook index ready"), {
			archive: d,
			workbookIndex: f,
			usage: p,
			metrics: s,
			closeArchive: () => c?.close((e) => e.free())
		};
	} catch (e) {
		try {
			c?.close((e) => e.free());
		} catch {}
		let t = i(e) ?? e;
		throw s.fail(t), t;
	}
}
function Lt(e) {
	if (e?.aborted) throw Rt();
}
function Rt() {
	let e = /* @__PURE__ */ Error("XLSX workbook session was aborted");
	return e.name = "AbortError", e;
}
//#endregion
//#region packages/node/src/xlsx.ts
var zt = b(() => x(import.meta.url, "xlsx_parser_bg.wasm", "@silurus/ooxml-xlsx/wasm-binary"));
async function $(e, t = {}) {
	let n = await It(qt(e), zt(), t);
	return new Bt(n.closeArchive, n.archive, n.workbookIndex, n.metrics, n.usage, t.signal);
}
var Bt = class {
	workbookIndex;
	sheetCount;
	sheetNames;
	pull;
	transport;
	worksheetPullClient;
	active;
	closed = !1;
	closePromise;
	lastUsage;
	completedWorksheets = 0;
	rowBatches = 0;
	emittedRows = 0;
	constructor(e, t, n, r, i, a) {
		this.closeArchive = e, this.archive = t, this.metrics = r, this.signal = a, this.workbookIndex = Gt(n), this.sheetNames = Object.freeze(this.workbookIndex.workbook.sheets.map((e) => e.name)), this.sheetCount = this.sheetNames.length, this.lastUsage = i, this.pull = new he(() => this.archive), this.transport = new y((e, t) => this.pull.dispatchSafely(e, t), () => void 0), this.worksheetPullClient = new _e({
			transport: this.transport,
			sharedStrings: n.sharedStrings,
			open: async (e, t, n) => {
				this.pull.reserveOpen(n), await this.pull.open(e, t, n);
			},
			onUsage: (e) => {
				this.lastUsage = e, this.metrics.observeUsage(e);
			}
		});
	}
	get resourceUsage() {
		if (this.closed) return this.lastUsage;
		try {
			this.lastUsage = Kt(this.archive.resource_usage());
		} catch {}
		return this.lastUsage;
	}
	async *worksheetRows(e) {
		if (this.closed) throw Error("XLSX workbook session is closed");
		if (this.active) throw Error("another XLSX worksheet row stream is already active");
		if (!Number.isSafeInteger(e) || e < 0) throw RangeError("sheetIndex must be a non-negative safe integer");
		let t = this.requireSheetName(e), n = {};
		this.active = n;
		let r;
		try {
			for await (let n of this.worksheetPullClient.stream(e, t, this.signal)) {
				if (this.closed) throw Error("XLSX workbook session is closed");
				if (n.kind === "rows") {
					this.rowBatches += 1, this.emittedRows += n.rows.length, yield {
						kind: "rows",
						rows: n.rows,
						sequence: n.sequence,
						wireBytes: n.wireBytes,
						usage: n.usage
					};
					continue;
				}
				yield {
					kind: "finished",
					worksheet: n.worksheet,
					sequence: n.sequence,
					wireBytes: n.wireBytes,
					usage: n.usage
				};
			}
			this.completedWorksheets += 1, this.metrics.checkpoint("worksheet stream complete", this.lastUsage);
		} catch (e) {
			throw r = i(e) ?? e, this.metrics.fail(r), await this.close().catch(() => void 0), r;
		} finally {
			try {
				await this.cleanupOperation(n, r === void 0 ? "closed" : "request-error");
			} catch (e) {
				if (r === void 0) {
					let t = i(e) ?? e;
					throw this.metrics.fail(t), await this.close().catch(() => void 0), t;
				}
			}
		}
	}
	close() {
		return this.closePromise ? this.closePromise : (this.closed = !0, this.closePromise = this.release(), this.closePromise);
	}
	cleanupOperation(e, t) {
		return e.cleanupPromise ||= (async () => {
			let n;
			try {
				await this.worksheetPullClient.cancelAll(t);
			} catch (e) {
				n = i(e) ?? e;
			}
			try {
				await this.pull.reset();
			} catch (e) {
				n ??= i(e) ?? e;
			}
			if (this.active === e && (this.active = void 0), n !== void 0) throw n;
		})(), e.cleanupPromise;
	}
	async release() {
		let e;
		if (this.active) try {
			await this.cleanupOperation(this.active, "closed");
		} catch (t) {
			e = i(t) ?? t;
		}
		this.transport.terminate();
		try {
			this.closeArchive();
		} catch (t) {
			e ??= i(t) ?? t;
		}
		if (e !== void 0) throw this.metrics.fail(e), e;
		this.metrics.checkpoint("workbook session closed", this.lastUsage), this.metrics.succeed({
			worksheets: this.completedWorksheets,
			"row-batches": this.rowBatches,
			rows: this.emittedRows
		});
	}
	requireSheetName(e) {
		let t = this.workbookIndex.workbook.sheets[e];
		if (!t) throw RangeError(`Sheet index ${e} out of range`);
		return t.name;
	}
};
async function Vt(e, t = {}) {
	return v(() => $(e, t), async (e) => structuredClone(e.workbookIndex));
}
async function Ht(e, t, n = {}) {
	return v(() => $(e, n), async (e) => (await Wt(e, t)).worksheet);
}
async function Ut(e, t = {}) {
	return v(() => $(e, t), async (e) => {
		let t = [], n = {
			rows: 0,
			cells: 0,
			ownedUtf8Bytes: 0,
			jsonBytes: 0
		};
		for (let r = 0; r < e.sheetCount; r += 1) {
			let i = await Wt(e, r), a = ue(n, i.usage);
			ge(a, "materialize-workbook", void 0, i.resourceUsage), n = a, t.push(i.worksheet);
		}
		return {
			workbookIndex: structuredClone(e.workbookIndex),
			worksheets: Object.freeze(t)
		};
	});
}
async function Wt(e, t) {
	let n = [], r = {
		rows: 0,
		cells: 0,
		ownedUtf8Bytes: 0
	}, i, a, o;
	for await (let s of e.worksheetRows(t)) if (o = s.usage ?? o, s.kind === "rows") {
		let e = me(r, fe(s.rows));
		pe(e, "materialize-worksheet", void 0, o), n.push(...s.rows), r = e;
	} else {
		a = s.worksheet, a.rows = a.parseError ? [] : n;
		let e = ve(a, a.parseError ? {
			rows: 0,
			cells: 0,
			ownedUtf8Bytes: 0
		} : r);
		pe(e, "materialize-worksheet", void 0, o), de(e.jsonBytes, "materialize-worksheet", void 0, o), r = e, i = e;
	}
	if (!a || !i) throw Error(`XLSX worksheet ${t} did not produce a terminal model`);
	return {
		worksheet: a,
		usage: i,
		resourceUsage: o
	};
}
function Gt(e, t = /* @__PURE__ */ new WeakSet()) {
	if (typeof e != "object" || !e) return e;
	let n = e;
	if (t.has(n)) return e;
	t.add(n);
	for (let e of Object.values(n)) Gt(e, t);
	return Object.freeze(e);
}
function Kt(e) {
	try {
		return f(e);
	} catch (e) {
		if (String(e).includes("worksheet cursor usage is unavailable")) return;
		throw e;
	}
}
function qt(e) {
	return e instanceof Uint8Array ? e : new Uint8Array(e);
}
//#endregion
export { ce as OoxmlDecodedImageLimitError, m as OoxmlResourceLimitError, Ee as installImageBitmapShim, we as installOffscreenCanvasShim, se as isOoxmlDecodedImageLimitError, ft as materializeDocxDocument, ze as materializePptxPresentation, Ut as materializeXlsxWorkbook, Vt as materializeXlsxWorkbookIndex, Ht as materializeXlsxWorksheet, dt as openDocxDocument, Ie as openPptxPresentation, $ as openXlsxWorkbook, Te as renderSlideNode };
