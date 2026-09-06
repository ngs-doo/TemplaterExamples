import { t as e } from "./chunk-DmhlhrBa.js";
import { a as t, u as n } from "./slide-pull-client-RTwQbJiy.js";
import { B as r, F as i, G as a, H as o, I as s, K as c, P as l, Q as u, R as d, U as f, W as p, X as m, Xt as h, Y as g, Z as _, cn as v, q as y } from "./line-metrics-BGtFM-ec.js";
import { t as b } from "./transfer-mIj7E7NB.js";
//#region packages/pptx/src/slide-cursor-operation.ts
function x(e) {
	try {
		return f(e((e) => e.slide_cursor_resource_usage()));
	} catch (e) {
		if (String(e).includes("slide cursor usage is unavailable")) return;
		throw e;
	}
}
function ee(e, t, n, r, i) {
	let a, o;
	try {
		if (i) {
			if (!r) throw Error("slide payload is missing before acknowledgement");
			let t = i(n, r, x(e));
			typeof t == "function" ? a = t : t && ({rollback: a, commit: o} = t);
		}
		e((e) => e.acknowledge_slide(t.operationId, t.generation)), o?.();
	} catch (e) {
		try {
			a?.();
		} catch {}
		throw e;
	}
}
//#endregion
//#region packages/pptx/src/slide-pull-worker.ts
var te = "ooxml-pull-resetting", ne = "ooxml-pull-reset-failed", re = class {
	coordinatorGeneration = new s();
	sessions = /* @__PURE__ */ new Map();
	pendingOpens = /* @__PURE__ */ new Map();
	operationTail = Promise.resolve();
	resourceFailure;
	lifecycleState = "ready";
	resetBarrier;
	resetIdentities = /* @__PURE__ */ new Map();
	constructor(e, t, n = (e) => e(this.requireArchive())) {
		this.archive = e, this.acceptSlide = t, this.executeArchive = n;
	}
	get coordinator() {
		return this.coordinatorGeneration;
	}
	reserveOpen(e) {
		if (this.assertReady(), S(e), this.pendingOpens.has(e.sessionId) || this.sessions.has(e.sessionId)) throw Error("slide pull session id is already reserved");
		this.pendingOpens.set(e.sessionId, {
			identity: e,
			canceled: !1
		});
	}
	abandonOpen(e) {
		this.pendingOpens.delete(e);
	}
	get pendingOpenCount() {
		return this.pendingOpens.size;
	}
	async open(e, t) {
		if (this.assertReady(), this.resourceFailure) throw this.resourceFailure;
		if (!Number.isSafeInteger(e) || e < 0) throw RangeError("slide index must be a non-negative safe integer");
		let n = this.pendingOpens.get(t.sessionId);
		if (!n || !C(n.identity, t)) throw Error("slide pull session open reservation is stale or missing");
		let r, a = new Promise((e) => {
			r = e;
		}), o = this.operationTail.then(() => this.coordinator.enqueue(async () => {
			if (n.canceled) throw Error("slide pull session open was canceled");
			let a, o = !1, s = new i({
				...t,
				maxByteCredit: h,
				coordinator: this.coordinator,
				driver: {
					pull: (n) => {
						let r;
						try {
							r = this.executeArchive((r) => r.pull_slide(e, t.operationId, t.generation, n));
						} catch (e) {
							throw y(e, n, h) || (this.latchResourceFailure(e), e);
						}
						let i = b(r);
						return this.acceptSlide && (a = JSON.parse(new TextDecoder().decode(new Uint8Array(i)))), o = !0, {
							payload: i,
							byteLength: i.byteLength,
							done: !0,
							transfer: [i]
						};
					},
					measureChunk: ({ payload: e }) => e.byteLength,
					acknowledge: () => {
						if (!o) throw Error("slide unit is not awaiting acknowledgement");
						try {
							ee(this.executeArchive, t, e, a, this.acceptSlide);
						} catch (e) {
							throw this.latchResourceFailure(e), e;
						}
						o = !1, a = void 0, this.sessions.delete(t.sessionId), r();
					},
					cancel: async () => {
						try {
							this.archive() && await this.executeArchive((e) => e.cancel_slide());
						} finally {
							a = void 0, o = !1, this.sessions.delete(t.sessionId), r();
						}
					},
					close: async () => {
						try {
							this.archive() && await this.executeArchive((e) => e.cancel_slide());
						} finally {
							a = void 0, o = !1, this.sessions.delete(t.sessionId), r();
						}
					},
					resourceUsage: () => {
						try {
							return this.readResourceUsage();
						} catch (e) {
							throw this.latchResourceFailure(e), e;
						}
					}
				}
			});
			this.sessions.set(t.sessionId, {
				host: s,
				identity: t
			}), this.pendingOpens.delete(t.sessionId);
		}));
		this.operationTail = o.then(() => a, () => void 0);
		try {
			await o;
		} catch (e) {
			throw this.pendingOpens.delete(t.sessionId), r(), e;
		}
	}
	async postOpenedSafely(e, t, n) {
		if (this.lifecycleState !== "ready") {
			try {
				n(this.lifecycleError());
			} catch {}
			return;
		}
		try {
			t();
		} catch (t) {
			await this.closeIdentity(e);
			try {
				n(t);
			} catch {}
		}
	}
	dispatch(e, t) {
		if (this.lifecycleState !== "ready") return t(this.responseDuringReset(e)), Promise.resolve();
		let n = this.sessions.get(e.sessionId);
		if (n) return n.host.dispatch(e, t);
		let r = this.pendingOpens.get(e.sessionId);
		if (r && (e.kind === "cancel" || e.kind === "close")) {
			let n = C(r.identity, e);
			return n && (r.canceled = !0), t(n ? {
				protocol: l,
				kind: "accepted",
				sessionId: e.sessionId,
				operationId: e.operationId,
				generation: e.generation,
				requestId: e.requestId,
				command: e.kind
			} : this.staleLifecycleResponse(e)), Promise.resolve();
		}
		return e.kind === "cancel" || e.kind === "close" ? (t({
			protocol: l,
			kind: "accepted",
			sessionId: e.sessionId,
			operationId: e.operationId,
			generation: e.generation,
			requestId: e.requestId,
			command: e.kind
		}), Promise.resolve()) : (t({
			protocol: l,
			kind: "error",
			sessionId: e.sessionId,
			operationId: e.operationId,
			generation: e.generation,
			requestId: e.requestId,
			error: c(/* @__PURE__ */ Error("slide pull session is not open"))
		}), Promise.resolve());
	}
	async dispatchSafely(e, t) {
		try {
			await this.dispatch(e, t);
		} catch (n) {
			try {
				t({
					protocol: l,
					kind: "error",
					sessionId: e.sessionId,
					operationId: e.operationId,
					generation: e.generation,
					requestId: e.requestId,
					error: c(n)
				});
			} catch {}
		}
	}
	run(e) {
		if (this.lifecycleState !== "ready") return Promise.reject(this.lifecycleError());
		let t = this.operationTail.then(() => this.coordinator.enqueue(async () => {
			if (this.resourceFailure) throw this.resourceFailure;
			return e();
		})).catch((e) => {
			throw this.latchResourceFailure(e), e;
		});
		return this.operationTail = t.then(() => void 0, () => void 0), t;
	}
	reset() {
		if (this.resetBarrier) return this.resetBarrier;
		this.lifecycleState = "resetting", this.captureResetIdentities();
		let e = this.performReset().then(() => {
			this.resetIdentities.clear(), this.lifecycleState = "ready";
		}, (e) => {
			throw this.lifecycleState = "reset-failed", e;
		}).finally(() => {
			this.resetBarrier === e && (this.resetBarrier = void 0);
		});
		return this.resetBarrier = e, e;
	}
	async performReset() {
		for (let e of this.pendingOpens.values()) e.canceled = !0;
		let e = 1;
		for (let { host: t, identity: n } of [...this.sessions.values()]) {
			let r;
			if (await t.dispatch({
				protocol: l,
				kind: "close",
				...n,
				requestId: e++
			}, (e) => {
				e.kind === "error" && (r = p(e.error));
			}), r) throw r;
		}
		this.sessions.clear(), await this.operationTail, this.pendingOpens.clear(), this.archive() && await this.executeArchive((e) => e.close_presentation_session()), this.coordinatorGeneration = new s(), this.resourceFailure = void 0;
	}
	assertReady() {
		if (this.lifecycleState !== "ready") throw this.lifecycleError();
	}
	lifecycleError() {
		let e = this.lifecycleState === "reset-failed", t = /* @__PURE__ */ Error(e ? "slide pull worker reset failed; retry reset before new work" : "slide pull worker reset is in progress");
		return t.name = "PullSessionLifecycleError", Object.assign(t, { code: e ? ne : te });
	}
	captureResetIdentities() {
		for (let { identity: e } of this.sessions.values()) this.resetIdentities.set(e.sessionId, e);
		for (let { identity: e } of this.pendingOpens.values()) this.resetIdentities.set(e.sessionId, e);
	}
	responseDuringReset(e) {
		if (e.kind === "cancel" || e.kind === "close") {
			let t = this.resetIdentities.get(e.sessionId);
			return t && !C(t, e) ? this.staleLifecycleResponse(e) : {
				protocol: l,
				kind: "accepted",
				sessionId: e.sessionId,
				operationId: e.operationId,
				generation: e.generation,
				requestId: e.requestId,
				command: e.kind
			};
		}
		return {
			protocol: l,
			kind: "error",
			sessionId: e.sessionId,
			operationId: e.operationId,
			generation: e.generation,
			requestId: e.requestId,
			error: c(this.lifecycleError())
		};
	}
	requireArchive() {
		let e = this.archive();
		if (!e) throw Error("Presentation not loaded");
		return e;
	}
	async closeIdentity(e) {
		if (this.lifecycleState !== "ready") return;
		let t = this.sessions.get(e.sessionId);
		if (t) {
			await t.host.dispatch({
				protocol: l,
				kind: "close",
				...e,
				requestId: 1
			}, () => void 0);
			return;
		}
		let n = this.pendingOpens.get(e.sessionId);
		n && C(n.identity, e) && (n.canceled = !0);
	}
	readResourceUsage() {
		return x(this.executeArchive);
	}
	latchResourceFailure(e) {
		let t = e instanceof v ? e : a(e);
		t && (this.resourceFailure ??= t);
	}
	staleLifecycleResponse(e) {
		return {
			protocol: l,
			kind: "error",
			sessionId: e.sessionId,
			operationId: e.operationId,
			generation: e.generation,
			requestId: e.requestId,
			error: {
				message: "stale lifecycle targets another slide operation",
				errorName: "PullSessionProtocolError",
				code: "ooxml-stale-lifecycle"
			}
		};
	}
};
function S(e) {
	if (!Number.isSafeInteger(e.sessionId) || e.sessionId <= 0) throw RangeError("session id must be a positive safe integer");
	if (!Number.isSafeInteger(e.operationId) || e.operationId <= 0) throw RangeError("operation id must be a positive safe integer");
	if (!Number.isSafeInteger(e.generation) || e.generation <= 0) throw RangeError("generation must be a positive safe integer");
}
function C(e, t) {
	return e.sessionId === t.sessionId && e.operationId === t.operationId && e.generation === t.generation;
}
//#endregion
//#region packages/core/src/internal/wasm-runtime-generation.ts
function ie(e) {
	return _(e) ? new g(`WASM parser trapped and was recycled: ${e instanceof Error ? e.message : String(e)}`) : null;
}
var w = class {
	realm;
	live = /* @__PURE__ */ new Set();
	constructor(e, t) {
		this.realm = new u(() => e.initSync({ module: t }), () => e.reinit({ module_or_path: t }), ie), this.realm.onPoison((e) => {
			for (let t of this.live) t.poison(e);
			this.live.clear();
		});
	}
	async open(e, t) {
		for (;;) {
			this.throwIfOpenAborted(t), await this.awaitReadyOrAbort(t), this.throwIfOpenAborted(t);
			let n = this.realm.tryRunReady(e);
			if (!n.current) continue;
			let r = new ae(this, n.value, n.generation);
			if (this.live.add(r), t?.signal?.aborted) throw r.close(t.disposeOnAbort), t.abortError?.() ?? new DOMException("The operation was aborted", "AbortError");
			return r;
		}
	}
	async awaitReadyOrAbort(e) {
		let t = e?.signal;
		if (!t) {
			await this.realm.ensureReady();
			return;
		}
		this.throwIfOpenAborted(e), await new Promise((n, r) => {
			let i = () => r(e?.abortError?.() ?? new DOMException("The operation was aborted", "AbortError"));
			t.addEventListener("abort", i, { once: !0 }), this.realm.ensureReady().then(n, r).finally(() => {
				t.removeEventListener("abort", i);
			});
		});
	}
	throwIfOpenAborted(e) {
		if (e?.signal?.aborted) throw e.abortError?.() ?? new DOMException("The operation was aborted", "AbortError");
	}
	async ensureReady() {
		await this.realm.ensureReady();
	}
	run(e, t) {
		let n = e.requireLive(this.realm);
		return this.realm.run(() => t(n));
	}
	close(e, t) {
		let n = e.detachForClose();
		this.live.delete(e), n && this.realm.run(() => t(n));
	}
}, ae = class {
	archive;
	failure;
	proxy;
	constructor(e, t, n) {
		this.host = e, this.generation = n, this.archive = t, this.proxy = new Proxy(t, { get: (e, t) => {
			let n = this.host.run(this, (e) => Reflect.get(e, t, e));
			return typeof n == "function" ? (...e) => this.host.run(this, (n) => {
				let r = Reflect.get(n, t, n);
				return Reflect.apply(r, n, e);
			}) : n;
		} });
	}
	run(e) {
		return this.host.run(this, e);
	}
	close(e) {
		this.host.close(this, e);
	}
	requireLive(e) {
		if (this.failure) throw this.failure;
		if (e.assertCurrent(this.generation), !this.archive) throw Error("WASM archive session belongs to a discarded runtime generation");
		return this.archive;
	}
	detachForClose() {
		let e = this.archive;
		return this.archive = void 0, this.failure ? void 0 : e;
	}
	poison(e) {
		let t = this.archive;
		this.failure = e, this.archive = void 0, m(t);
	}
}, oe = /* @__PURE__ */ e({
	PptxArchive: () => T,
	default: () => Y,
	extract_font: () => se,
	extract_image: () => ce,
	extract_media: () => E,
	initSync: () => ue,
	parse_pptx: () => D,
	pptx_to_markdown: () => O,
	reinit: () => de
}), T = class {
	__destroy_into_raw() {
		let e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, A.unregister(this), e;
	}
	free() {
		let e = this.__destroy_into_raw();
		q.__wbg_pptxarchive_free(e, 0);
	}
	acknowledge_slide(e, t) {
		let n = q.pptxarchive_acknowledge_slide(this.__wbg_ptr, e, t);
		if (n[1]) throw B(n[0]);
	}
	assert_healthy() {
		let e = q.pptxarchive_assert_healthy(this.__wbg_ptr);
		if (e[1]) throw B(e[0]);
	}
	cancel_slide() {
		q.pptxarchive_cancel_slide(this.__wbg_ptr);
	}
	close_presentation_session() {
		q.pptxarchive_close_presentation_session(this.__wbg_ptr);
	}
	extract_font(e) {
		let t = z(e, q.__wbindgen_malloc, q.__wbindgen_realloc), n = K, r = q.pptxarchive_extract_font(this.__wbg_ptr, t, n);
		if (r[3]) throw B(r[2]);
		var i = j(r[0], r[1]).slice();
		return q.__wbindgen_free(r[0], r[1] * 1, 1), i;
	}
	extract_image(e) {
		let t = z(e, q.__wbindgen_malloc, q.__wbindgen_realloc), n = K, r = q.pptxarchive_extract_image(this.__wbg_ptr, t, n);
		if (r[3]) throw B(r[2]);
		var i = j(r[0], r[1]).slice();
		return q.__wbindgen_free(r[0], r[1] * 1, 1), i;
	}
	extract_media(e) {
		let t = z(e, q.__wbindgen_malloc, q.__wbindgen_realloc), n = K, r = q.pptxarchive_extract_media(this.__wbg_ptr, t, n);
		if (r[3]) throw B(r[2]);
		var i = j(r[0], r[1]).slice();
		return q.__wbindgen_free(r[0], r[1] * 1, 1), i;
	}
	constructor(e, t, n, r) {
		let i = R(e, q.__wbindgen_malloc), a = K, o = q.pptxarchive_new(i, a, !L(t), L(t) ? BigInt(0) : t, !L(n), L(n) ? BigInt(0) : n, !L(r), L(r) ? BigInt(0) : r);
		if (o[2]) throw B(o[1]);
		return this.__wbg_ptr = o[0] >>> 0, A.register(this, this.__wbg_ptr, this), this;
	}
	parse() {
		let e = q.pptxarchive_parse(this.__wbg_ptr);
		if (e[3]) throw B(e[2]);
		var t = j(e[0], e[1]).slice();
		return q.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	presentation_bootstrap() {
		let e = q.pptxarchive_presentation_bootstrap(this.__wbg_ptr);
		if (e[3]) throw B(e[2]);
		var t = j(e[0], e[1]).slice();
		return q.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	pull_slide(e, t, n, r) {
		let i = q.pptxarchive_pull_slide(this.__wbg_ptr, e, t, n, r);
		if (i[3]) throw B(i[2]);
		var a = j(i[0], i[1]).slice();
		return q.__wbindgen_free(i[0], i[1] * 1, 1), a;
	}
	resource_usage() {
		let e = q.pptxarchive_resource_usage(this.__wbg_ptr);
		if (e[3]) throw B(e[2]);
		var t = j(e[0], e[1]).slice();
		return q.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	slide_cursor_resource_usage() {
		let e = q.pptxarchive_slide_cursor_resource_usage(this.__wbg_ptr);
		if (e[3]) throw B(e[2]);
		var t = j(e[0], e[1]).slice();
		return q.__wbindgen_free(e[0], e[1] * 1, 1), t;
	}
	to_markdown() {
		let e, t;
		try {
			let i = q.pptxarchive_to_markdown(this.__wbg_ptr);
			var n = i[0], r = i[1];
			if (i[3]) throw n = 0, r = 0, B(i[2]);
			return e = n, t = r, P(n, r);
		} finally {
			q.__wbindgen_free(e, t, 1);
		}
	}
};
Symbol.dispose && (T.prototype[Symbol.dispose] = T.prototype.free);
function se(e, t, n, r) {
	let i = R(e, q.__wbindgen_malloc), a = K, o = z(t, q.__wbindgen_malloc, q.__wbindgen_realloc), s = K, c = q.extract_font(i, a, o, s, !L(n), L(n) ? BigInt(0) : n, !L(r), L(r) ? BigInt(0) : r);
	if (c[3]) throw B(c[2]);
	var l = j(c[0], c[1]).slice();
	return q.__wbindgen_free(c[0], c[1] * 1, 1), l;
}
function ce(e, t, n, r) {
	let i = R(e, q.__wbindgen_malloc), a = K, o = z(t, q.__wbindgen_malloc, q.__wbindgen_realloc), s = K, c = q.extract_image(i, a, o, s, !L(n), L(n) ? BigInt(0) : n, !L(r), L(r) ? BigInt(0) : r);
	if (c[3]) throw B(c[2]);
	var l = j(c[0], c[1]).slice();
	return q.__wbindgen_free(c[0], c[1] * 1, 1), l;
}
function E(e, t, n, r) {
	let i = R(e, q.__wbindgen_malloc), a = K, o = z(t, q.__wbindgen_malloc, q.__wbindgen_realloc), s = K, c = q.extract_media(i, a, o, s, !L(n), L(n) ? BigInt(0) : n, !L(r), L(r) ? BigInt(0) : r);
	if (c[3]) throw B(c[2]);
	var l = j(c[0], c[1]).slice();
	return q.__wbindgen_free(c[0], c[1] * 1, 1), l;
}
function D(e, t, n) {
	let r = R(e, q.__wbindgen_malloc), i = K, a = q.parse_pptx(r, i, !L(t), L(t) ? BigInt(0) : t, !L(n), L(n) ? BigInt(0) : n);
	if (a[3]) throw B(a[2]);
	var o = j(a[0], a[1]).slice();
	return q.__wbindgen_free(a[0], a[1] * 1, 1), o;
}
function O(e, t, n) {
	let r, i;
	try {
		let s = R(e, q.__wbindgen_malloc), c = K, l = q.pptx_to_markdown(s, c, !L(t), L(t) ? BigInt(0) : t, !L(n), L(n) ? BigInt(0) : n);
		var a = l[0], o = l[1];
		if (l[3]) throw a = 0, o = 0, B(l[2]);
		return r = a, i = o, P(a, o);
	} finally {
		q.__wbindgen_free(r, i, 1);
	}
}
function k() {
	return {
		__proto__: null,
		"./pptx_parser_bg.js": {
			__proto__: null,
			__wbg___wbindgen_throw_6b64449b9b9ed33c: function(e, t) {
				throw Error(P(e, t));
			},
			__wbg_error_a6fa202b58aa1cd3: function(e, t) {
				let n, r;
				try {
					n = e, r = t, console.error(P(e, t));
				} finally {
					q.__wbindgen_free(n, r, 1);
				}
			},
			__wbg_new_227d7c05414eb861: function() {
				return /* @__PURE__ */ Error();
			},
			__wbg_stack_3b0d974bbf31e44f: function(e, t) {
				let n = t.stack, r = z(n, q.__wbindgen_malloc, q.__wbindgen_realloc), i = K;
				N().setInt32(e + 4, i, !0), N().setInt32(e + 0, r, !0);
			},
			__wbindgen_cast_0000000000000001: function(e, t) {
				return P(e, t);
			},
			__wbindgen_init_externref_table: function() {
				let e = q.__wbindgen_externrefs, t = e.grow(4);
				e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
			}
		}
	};
}
var A = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((e) => q.__wbg_pptxarchive_free(e >>> 0, 1));
function j(e, t) {
	return e >>>= 0, I().subarray(e / 1, e / 1 + t);
}
var M = null;
function N() {
	return (M === null || M.buffer.detached === !0 || M.buffer.detached === void 0 && M.buffer !== q.memory.buffer) && (M = new DataView(q.memory.buffer)), M;
}
function P(e, t) {
	return e >>>= 0, W(e, t);
}
var F = null;
function I() {
	return (F === null || F.byteLength === 0) && (F = new Uint8Array(q.memory.buffer)), F;
}
function L(e) {
	return e == null;
}
function R(e, t) {
	let n = t(e.length * 1, 1) >>> 0;
	return I().set(e, n / 1), K = e.length, n;
}
function z(e, t, n) {
	if (n === void 0) {
		let n = G.encode(e), r = t(n.length, 1) >>> 0;
		return I().subarray(r, r + n.length).set(n), K = n.length, r;
	}
	let r = e.length, i = t(r, 1) >>> 0, a = I(), o = 0;
	for (; o < r; o++) {
		let t = e.charCodeAt(o);
		if (t > 127) break;
		a[i + o] = t;
	}
	if (o !== r) {
		o !== 0 && (e = e.slice(o)), i = n(i, r, r = o + e.length * 3, 1) >>> 0;
		let t = I().subarray(i + o, i + r), a = G.encodeInto(e, t);
		o += a.written, i = n(i, r, o, 1) >>> 0;
	}
	return K = o, i;
}
function B(e) {
	let t = q.__wbindgen_externrefs.get(e);
	return q.__externref_table_dealloc(e), t;
}
var V = new TextDecoder("utf-8", {
	ignoreBOM: !0,
	fatal: !0
});
V.decode();
var H = 2146435072, U = 0;
function W(e, t) {
	return U += t, U >= H && (V = new TextDecoder("utf-8", {
		ignoreBOM: !0,
		fatal: !0
	}), V.decode(), U = t), V.decode(I().subarray(e, e + t));
}
var G = new TextEncoder();
"encodeInto" in G || (G.encodeInto = function(e, t) {
	let n = G.encode(e);
	return t.set(n), {
		read: e.length,
		written: n.length
	};
});
var K = 0, q;
function J(e, t) {
	return q = e.exports, M = null, F = null, q.__wbindgen_start(), q;
}
async function le(e, t) {
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
function ue(e) {
	if (q !== void 0) return q;
	e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module: e} = e : console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));
	let t = k();
	return e instanceof WebAssembly.Module || (e = new WebAssembly.Module(e)), J(new WebAssembly.Instance(e, t), e);
}
async function Y(e) {
	if (q !== void 0) return q;
	e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module_or_path: e} = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead"));
	let t = k();
	(typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
	let { instance: n, module: r } = await le(await e, t);
	return J(n, r);
}
async function de(e) {
	return q = void 0, M = null, F = null, Y(e);
}
//#endregion
//#region packages/pptx/src/internal/node-acquisition.ts
var X, Z;
function fe(e) {
	if (!Z) X = e, Z = new w(oe, e);
	else if (X !== e) throw Error("PPTX runtime was already initialized with another WebAssembly.Module");
	return Z;
}
async function pe(e, n, i = {}) {
	let s = r(i), c = new d({
		enabled: s.debug || s.onResourceMetrics !== void 0,
		format: "pptx",
		mode: "node",
		scope: "session",
		policy: s.policy,
		onMetrics: s.onResourceMetrics,
		emitToConsole: s.debug
	});
	c.setSourceBytes(e.byteLength);
	let l;
	try {
		Q(i.signal);
		let [r, a, u] = o(s.policy), d = T;
		l = await fe(n).open(() => new d(e, r, a, u), {
			signal: i.signal,
			abortError: $,
			disposeOnAbort: (e) => e.free()
		}), Q(i.signal);
		let f = l.proxy, p = t(JSON.parse(new TextDecoder().decode(f.presentation_bootstrap())));
		return c.checkpoint("presentation bootstrap ready"), {
			archive: f,
			bootstrap: p,
			metrics: c,
			closeArchive: () => l?.close((e) => e.free())
		};
	} catch (e) {
		try {
			l?.close((e) => e.free());
		} catch {}
		let t = a(e) ?? e;
		throw c.fail(t), t;
	}
}
function Q(e) {
	if (e?.aborted) throw $();
}
function $() {
	let e = /* @__PURE__ */ Error("PPTX presentation session was aborted");
	return e.name = "AbortError", e;
}
//#endregion
//#region packages/pptx/src/internal/session.ts
var me = /* @__PURE__ */ e({ renderSlide: () => n });
//#endregion
export { x as a, re as i, pe as n, w as r, me as t };
