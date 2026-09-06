import { t as e } from "./renderer-module-contract-Cu-GKuPd.js";
import { n as t } from "./mathjax-DS69BmJd.js";
//#region packages/core/assets/mathjax-stix2.js?url
var n = new URL("mathjax-stix2.js", import.meta.url).href, r = null;
function i(e) {
	return new Promise((t, n) => {
		let r = document.createElement("script");
		r.src = e, r.async = !0, r.onload = () => t(), r.onerror = () => n(/* @__PURE__ */ Error(`Failed to load math engine from ${e}`)), document.head.appendChild(r);
	});
}
async function a(e) {
	await import(
		/* @vite-ignore */
		e
);
}
function o(e) {
	return r || (r = (async () => {
		let t = globalThis.__ooxmlStix2;
		if (t) return t;
		let n = new URL(e).href;
		typeof document > "u" ? await a(n) : await i(n);
		let r = globalThis.__ooxmlStix2;
		if (!r) throw Error("Math engine failed to initialize");
		return r;
	})(), r);
}
async function s(e) {
	await o(e);
}
async function c(e, n) {
	let r = (await o(n)).mathml2svg(e);
	return {
		svg: r,
		...t(r)
	};
}
//#endregion
//#region packages/core/src/math/engine.ts
function l() {
	return new URL(n, import.meta.url).href;
}
async function u() {
	await s(l());
}
async function d(e) {
	return c(e, l());
}
//#endregion
//#region src/math.ts
var f = e({
	loadMathJax: u,
	mathMLToSvg: d
}, "math", { engineAssetUrl: l() });
//#endregion
export { f as math };
