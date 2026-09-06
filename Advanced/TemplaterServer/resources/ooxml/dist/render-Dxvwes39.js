import { t as e } from "./chunk-DmhlhrBa.js";
//#region packages/node/src/render.ts
var t = /* @__PURE__ */ e({
	installImageBitmapShim: () => i,
	installOffscreenCanvasShim: () => r,
	renderSlideNode: () => o,
	withNodeCanvasRuntime: () => a
}), n = Promise.resolve();
function r(e) {
	let t = globalThis, n = t.OffscreenCanvas, r = Object.prototype.hasOwnProperty.call(globalThis, "OffscreenCanvas");
	if (n !== void 0) return () => {};
	class i {
		constructor(t, n) {
			return e.createCanvas(t, n);
		}
	}
	return t.OffscreenCanvas = i, () => {
		r ? t.OffscreenCanvas = n : delete t.OffscreenCanvas;
	};
}
function i(e) {
	let t = globalThis, n = t.createImageBitmap;
	return t.createImageBitmap = async (t, n) => {
		if (t && typeof t.getContext == "function") return t;
		let r;
		if (t instanceof Uint8Array || t instanceof ArrayBuffer) r = t;
		else if (typeof t.arrayBuffer == "function") r = await t.arrayBuffer();
		else throw Error("createImageBitmap shim: unsupported source type");
		let i = n?.resizeWidth, a = n?.resizeHeight, o = typeof i == "number" && i > 0 ? { width: i } : typeof a == "number" && a > 0 ? { height: a } : void 0, s = await e.loadImage(r, o);
		if (!o || o.width !== void 0 && s.width === o.width || o.height !== void 0 && s.height === o.height) return s;
		let c = o.width === void 0 ? typeof o.height == "number" ? o.height / s.height : 1 : o.width / s.width, l = Math.max(1, Math.round(s.width * c)), u = Math.max(1, Math.round(s.height * c)), d = e.createCanvas(l, u), f = d.getContext("2d");
		return typeof f.drawImage == "function" ? (f.drawImage(s, 0, 0, l, u), s.close?.(), d) : s;
	}, () => {
		t.createImageBitmap = n;
	};
}
function a(e, t) {
	let a = async () => {
		let n = typeof globalThis.createImageBitmap == "function" ? () => void 0 : i(e), a = r(e);
		try {
			return await t();
		} finally {
			a(), n();
		}
	}, o = n.then(a, a);
	return n = o.then(() => void 0, () => void 0), o;
}
async function o(e, t, n, r = {}) {
	let { renderSlide: i } = await import("./session-BmP4lcEo.js").then((e) => e.t), o = t.slides[n];
	if (!o) throw Error(`Slide index ${n} out of range`);
	let s = r.width ?? 960, c = r.dpr ?? 2, l = r.fetchImage ?? (async () => new Blob([])), u = async () => {
		await i(e, o, t.slideWidth, t.slideHeight, {
			width: s,
			dpr: c,
			defaultTextColor: t.defaultTextColor,
			majorFont: t.majorFont,
			minorFont: t.minorFont,
			hlinkColor: t.hlinkColor ?? null,
			fetchMedia: r.fetchMedia ?? (async () => new Blob([])),
			fetchImage: l,
			skipMediaControls: !0
		});
	};
	await (r.factory ? a(r.factory, u) : u());
}
//#endregion
export { a, t as i, r as n, o as r, i as t };
