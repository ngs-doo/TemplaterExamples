import { $t as e, At as t, Ht as n, It as r, J as i, Lt as a, Rt as o, Wt as s, X as c, en as l, f as u, nn as d, qt as f, r as p, t as m, tn as h, u as g, ut as _, zt as v } from "./plot-area-frame-D5hEOgkJ.js";
import { T as y, w as b } from "./three-d-YYghQndN.js";
import { A as x, C as S, D as C, E as w, F as T, I as E, L as D, M as O, N as k, O as A, P as j, R as M, S as N, T as ee, _ as te, a as P, b as ne, c as re, d as F, f as I, g as ie, h as L, i as R, j as z, l as B, m as V, n as ae, o as oe, p as se, r as ce, s as le, t as ue, u as de, v as fe, w as pe, x as me, y as he } from "./renderer-XFSCOT6m.js";
import { t as ge } from "./renderer-module-contract-Cu-GKuPd.js";
function H(e) {
	return e != null && Number.isFinite(e) ? e : null;
}
function U(e) {
	return Object.is(e, -0) ? "0" : String(Number.isInteger(e) ? e : Number(e.toPrecision(6)));
}
function _e(e, t) {
	if (e.length > 1048576) return { kind: "tooManyInputPoints" };
	let n = t.intervalClosed === "r" ? "r" : "l", r = H(t.underflow), i = H(t.overflow);
	r != null && i != null && r >= i && (r = null, i = null);
	let a = (e) => r != null && (n === "r" ? e <= r : e < r), o = (e) => i != null && (n === "r" ? e > i : e >= i), s = Infinity, c = -Infinity, l = 0, u = 0, d = 0;
	for (let t of e) {
		let e = H(t);
		e != null && (a(e) ? u++ : o(e) ? d++ : (l++, s = Math.min(s, e), c = Math.max(c, e)));
	}
	if (l + u + d === 0) return {
		kind: "bins",
		categories: [],
		counts: []
	};
	let f = [], p = [];
	if (r != null && (f.push(`${n === "r" ? "≤" : "<"} ${U(r)}`), p.push(u)), l > 0) {
		let u = r ?? s, d = i ?? c, m = d - u;
		if (!Number.isFinite(m)) f.push(`${U(u)} – ${U(d)}`), p.push(l);
		else {
			let s = H(t.binSize), c;
			c = s != null && s > 0 && m > 0 ? Math.max(1, Math.ceil(m / s)) : t.binCount != null && Number.isFinite(t.binCount) && t.binCount > 0 ? Math.max(1, Math.floor(t.binCount)) : Math.max(1, Math.ceil(Math.sqrt(l)));
			let d = m <= 0 ? 1 : Math.min(512, c), h = m > 0 && s != null && s > 0 && c <= 512, g = m === 0 ? 1 : h ? s : m / d, _ = Array(d).fill(0);
			for (let t of e) {
				let e = H(t);
				if (e == null || a(e) || o(e)) continue;
				let r = h ? (e - u) / g : m === 0 ? 0 : (e - u) / m * d, i = n === "r" ? Math.ceil(r) - 1 : Math.floor(r), s = Math.max(0, Math.min(d - 1, i));
				_[s]++;
			}
			for (let e = 0; e < d; e++) {
				let t = h ? u + g * e : u + e / d * m, a = h ? t + g : u + m * ((e + 1) / d), o = i == null ? a : Math.min(a, i), s = n === "r" && (r != null || e > 0) ? ">" : "≥", c = n === "l" && (i != null || e < d - 1) ? "<" : "≤";
				f.push(`${s} ${U(t)} – ${c} ${U(o)}`), p.push(_[e]);
			}
		}
	}
	return i != null && (f.push(`${n === "r" ? ">" : "≥"} ${U(i)}`), p.push(d)), {
		kind: "bins",
		categories: f,
		counts: p
	};
}
//#endregion
//#region packages/core/src/chart/pareto-layout.ts
function ve(e, t) {
	return e == null ? e : e.flatMap((e) => {
		let n = t.get(e.idx);
		return n == null ? [] : [{
			...e,
			idx: n
		}];
	});
}
function ye(e, t) {
	return e == null ? e : t.map((t) => e[t] ?? null);
}
function be(e, t, n = {}) {
	let r = e.values.map((e, t) => ({
		value: e,
		sourceIndex: t
	})).filter((e) => e.value != null && Number.isFinite(e.value) && e.value >= 0);
	n.sortDescending !== !1 && r.sort((e, t) => t.value - e.value || e.sourceIndex - t.sourceIndex);
	let i = r[0]?.value ?? 0, a = i > 0 ? r.reduce((e, t) => e + t.value / i, 0) : 0, o = 0, s = r.map((n) => (i > 0 && (o += n.value / i), {
		sourceIndex: n.sourceIndex,
		category: e.categories?.[n.sourceIndex] ?? t[n.sourceIndex] ?? String(n.sourceIndex + 1),
		value: n.value,
		cumulativeFraction: a > 0 ? o >= a ? 1 : o / a : 0
	})), c = s.map((e) => e.sourceIndex), l = new Map(c.map((e, t) => [e, t])), u = s.map((e) => e.category), d = {
		...e,
		categories: u,
		catFormatCodes: ye(e.catFormatCodes, c),
		dataPointColors: ye(e.dataPointColors, c),
		dataLabelColors: ye(e.dataLabelColors, c),
		dataPointOverrides: ve(e.dataPointOverrides, l),
		dataLabelOverrides: ve(e.dataLabelOverrides, l)
	};
	return {
		points: s,
		categories: u,
		orderedSeries: {
			...d,
			values: s.map((e) => e.value)
		},
		series: {
			...d,
			values: s.map((e) => e.cumulativeFraction)
		}
	};
}
function xe(e) {
	if (e.length > 1e4) return !0;
	let t = 0;
	for (let n of e) {
		if (n.path.length > 512 || t > 1e4 - n.path.length) return !0;
		t += n.path.length;
	}
	return !1;
}
function Se(e, t = !1) {
	let n = {
		label: "",
		layoutWeight: 0,
		value: 0,
		depth: -1,
		children: [],
		branchIndex: -1,
		labelIndex: -1,
		a0: 0,
		a1: 0
	}, r = e.reduce((e, t) => Number.isFinite(t.size) && t.size > e ? t.size : e, 0), i = (e, t) => e > Number.MAX_VALUE - t ? Number.MAX_VALUE : e + t, a = /* @__PURE__ */ new WeakMap();
	for (let o of e) {
		let e = Number.isFinite(o.size) && o.size > 0 ? o.size : 0, s = r > 0 ? e / r : 0, c = n;
		for (let n = 0; n < o.path.length; n++) {
			let r = o.path[n], l = a.get(c);
			l || (l = /* @__PURE__ */ new Map(), a.set(c, l));
			let u = t && n === o.path.length - 1, d = u ? void 0 : l.get(r);
			d || (d = {
				label: r,
				layoutWeight: 0,
				value: 0,
				depth: n,
				children: [],
				branchIndex: n === 0 ? c.children.length : c.branchIndex,
				labelIndex: -1,
				a0: 0,
				a1: 0
			}, c.children.push(d), u || l.set(r, d)), d.layoutWeight += s, d.value = i(d.value, e), c = d;
		}
	}
	n.layoutWeight = n.children.reduce((e, t) => e + t.layoutWeight, 0), n.value = n.children.reduce((e, t) => i(e, t.value), 0);
	let o = 0, s = [...n.children].reverse();
	for (; s.length > 0;) {
		let e = s.pop();
		e.labelIndex = o++;
		for (let t = e.children.length - 1; t >= 0; t--) s.push(e.children[t]);
	}
	return n;
}
function Ce(e) {
	let t = [e];
	for (; t.length > 0;) {
		let e = t.pop(), n = 0;
		for (let t of e.children) n += t.layoutWeight;
		if (n <= 0) continue;
		let r = e.a0;
		for (let i of e.children) {
			let a = (e.a1 - e.a0) * i.layoutWeight / n;
			i.a0 = r, i.a1 = r + a, r = i.a1, t.push(i);
		}
	}
}
function W(e) {
	let t = e.depth, n = [e];
	for (; n.length > 0;) {
		let e = n.pop();
		t = Math.max(t, e.depth);
		for (let t = e.children.length - 1; t >= 0; t--) n.push(e.children[t]);
	}
	return t;
}
//#endregion
//#region packages/core/src/chart/chart-ex-renderer.ts
function we(e) {
	return !e || e.fillNoStyle === !0 ? !1 : e.fillPaintAuthored === !0 || e.fillHidden === !0 || e.fillColors?.some((e) => e != null) === !0 || e.fillPaints?.some((e) => e != null) === !0;
}
function Te(e, t, n, r) {
	return t?.fillHidden === !0 || t?.color != null || we(t?.chartexStyle) ? B(e, r, 3, t?.fillHidden === !0 ? {
		...t.chartexStyle,
		fillHidden: !0,
		fillPaintAuthored: !0
	} : t?.chartexStyle, t?.color, {
		fillHidden: !0,
		fillPaintAuthored: !0
	}) : n?.chartexStyle?.fillPaintAuthored === !0 ? B(e, r, 3, n.chartexStyle, n.color, {
		fillHidden: !0,
		fillPaintAuthored: !0
	}) : oe(e, r, 3, n?.chartexStyle, n?.color);
}
function Ee(e) {
	let t = e?.chartexStyle;
	return e?.lineHidden != null || e?.lineColor != null || e?.lineWidthEmu != null || e?.lineDash != null || t?.linePaintAuthored === !0 || t?.lineHidden != null || t?.lineColors?.some((e) => e != null) === !0 || t?.linePaints?.some((e) => e != null) === !0 || t?.lineWidthEmu != null || t?.lineDash != null || t?.lineCustomDash != null || t?.lineCap != null || t?.lineJoin != null;
}
function De(e) {
	let t = e.chartexSunburst ? {
		rows: e.chartexSunburst.rows,
		kind: "sunburst"
	} : e.chartexTreemap ? {
		rows: e.chartexTreemap.rows,
		kind: "treemap"
	} : void 0;
	if (!t) return null;
	if (t.rows.length === 0) return 0;
	if (xe(t.rows)) return c + 1;
	let n = Se(t.rows, t.kind === "treemap");
	if (n.layoutWeight <= 0 || n.children.length === 0) return 0;
	t.kind === "sunburst" && (n.a0 = -Math.PI / 2, n.a1 = n.a0 + Math.PI * 2, Ce(n));
	let r = e.series[0], i = S(r?.dataLabelOverrides), a = e.chartexTreemap?.parentLabelLayout ?? "overlapping", o = 0, s = [...n.children];
	for (; s.length > 0;) {
		let n = s.pop();
		for (let e of n.children) s.push(e);
		if (n.layoutWeight <= 0 || t.kind === "sunburst" && n.a1 - n.a0 <= 1e-4) continue;
		let l;
		t.kind === "sunburst" ? l = z(e, r, n.labelIndex, n.label, n.value, {
			visible: !1,
			showVal: !1,
			showCatName: !1
		}, i) : n.children.length > 0 ? (l = z(e, r, n.labelIndex, n.label, n.value, {
			visible: a !== "none",
			showVal: !1,
			showCatName: !0
		}, i), a === "overlapping" && n.depth !== 0 && (l = null)) : l = z(e, r, n.labelIndex, n.label, n.value, {
			visible: !1,
			showVal: !1,
			showCatName: !1
		}, i);
		for (let e of [l?.labelBox?.fillPaint, l?.labelBox?.borderFill]) {
			if (!e) continue;
			let t = _(e);
			if (e.fillType === "gradient" && t > 4096 || t > 1048576 - o) return c + 1;
			o += t;
		}
	}
	return o;
}
function G(e, t, n, r, a = 0) {
	let o = t.series[0];
	if (!o) return;
	let s = _e(o.values, t.chartexHistogramBinning ?? {});
	if (s.kind === "tooManyInputPoints") {
		C(e, n, i + 1);
		return;
	}
	A(e, {
		...t,
		chartType: "clusteredBar",
		categories: s.categories,
		series: [{
			...o,
			categories: void 0,
			values: s.counts
		}]
	}, n, r, { gapPolicy: "chartex" }, a);
}
function Oe(t, r, i, a, c) {
	let { x: l, y: d, w: f, h } = i, g = r.series[0]?.values ?? [], _ = r.categories, y = Math.max(g.length, _.length);
	if (y === 0 || C(t, i, y)) return;
	let b = new Set(r.subtotalIndices), x = !1, A = (e, t) => {
		let n = e + t;
		return Number.isFinite(n) ? n : (x = !0, n < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE);
	}, ne = 0, I = [], R = -Infinity, B = 0;
	for (let e = 0; e < y; e++) {
		let t = g[e], n = t != null && Number.isFinite(t), r = t == null || n, i = n ? t : 0;
		if (b.has(e)) {
			let e = {
				start: 0,
				end: i,
				isSub: !0,
				isPos: !0,
				hasValue: n,
				paintSlot: r
			};
			I.push(e), r && (R = Math.max(R, e.start, e.end), B = Math.min(B, e.start, e.end)), n && (ne = i);
		} else {
			let e = A(ne, i), t = {
				start: i >= 0 ? ne : e,
				end: i >= 0 ? e : ne,
				isSub: !1,
				isPos: i >= 0,
				hasValue: n,
				paintSlot: r
			};
			I.push(t), r && (R = Math.max(R, t.start, t.end), B = Math.min(B, t.start, t.end)), n && (ne = e);
		}
	}
	if (x) {
		t.fillStyle = "#888", t.font = "12px sans-serif", t.textAlign = "center", t.textBaseline = "middle", t.fillText("(chart values out of range)", l + f / 2, d + h / 2);
		return;
	}
	if (R <= B) return;
	let de = b.size === 0 && I.every((e, t) => !e.hasValue || g[t] >= 0), ge = !r.valAxisHidden && r.valAxisTickLabelPos !== "none" && !de, H = pe(t, r, f, h, a), U = o(r, f, h, a), _e = ce(r.valAxisFontSizeHpt, h, a), ve = ce(r.catAxisFontSizeHpt, h, a), ye = V(r, r.valAxisFontFace, "minor"), be = V(r, r.catAxisFontFace, "minor"), xe = w(r, B, R, h / a);
	t.save();
	let Se = 0;
	if (ge) {
		t.font = se(_e, ye, r.valAxisFontBold ?? !1, r.valAxisFontItalic ?? !1);
		let e = 0;
		for (let n of xe.majorLines) e = Math.max(e, t.measureText(N(r, n, !1)).width);
		Se = e + 8;
	}
	let Ce = Math.max(1, f - U.valBandW - Se - f * .02) / y;
	t.font = se(ve, be, r.catAxisFontBold ?? !1, r.catAxisFontItalic ?? !1);
	let W = _.slice(0, y).map((e) => M(t, p(e, r.catAxisFormatCode, r.date1904), Math.max(1, Ce - 8))), we = 0;
	for (let e of W) e.some(Boolean) && (we = Math.max(we, e.length));
	let De = r.catAxisHidden || we === 0 ? 0 : we * (ve + 2) + 4, G = r.series[0], Oe = S(G?.dataLabelOverrides), ke = S(G?.dataPointOverrides), Ae = G?.chartexStyle, je = `#${G?.color ?? P(r, 0, 3, Ae)}`, K = `#${P(r, 1, 3, Ae)}`, q = `#${P(r, 2, 3, Ae)}`, Me = oe(r, 0, 3, Ae, G?.color), Ne = oe(r, 1, 3, Ae), J = oe(r, 2, 3, Ae), Pe = {
		...r,
		chartType: "clusteredBar",
		series: [
			re(r, "Increase", G, r.chartexDataPointStyle, 0, 3, je),
			re(r, "Decrease", G, r.chartexDataPointStyle, 1, 3, K),
			re(r, "Total", G, r.chartexDataPointStyle, 2, 3, q)
		]
	}, Fe = ee(t, Pe, f, h, .22, a), { legRightW: Ie, legLeftW: Le, legTopH: Re, legBottomH: ze } = v(Fe, r.legendOverlay === !0), Y = s(r, l, d, f, h, a, {
		titleBand: H,
		legendSideReserveFrac: 0,
		legendReserve: Fe,
		pad: {
			t: H.bandH + Re + _e / 2 + 2,
			r: Ie + f * .02,
			b: ze + U.catBandH + De,
			l: Le + U.valBandW + (r.valAxisHidden ? f * .02 : Math.max(f * .03, Se))
		},
		honorPlotAreaManualLayout: !0
	});
	fe(t, r, l, d, f, h, d + Y.title.topPad, Y.title.fontPx);
	let { px0: X, py0: Z, pw: Q, ph: $ } = Y.plotRect;
	m(t, r, X, Z, Q, $, a, c);
	let Be = w(r, B, R, $ / a), Ve = (e) => Z + $ - Be.frac(e) * $, He = u(r.valAxisLineColor, r.valAxisLineWidthEmu, a), Ue = u(r.catAxisLineColor, r.catAxisLineWidthEmu, a), We = E(r, a);
	if (!r.valAxisHidden) {
		t.font = se(_e, ye, r.valAxisFontBold ?? !1, r.valAxisFontItalic ?? !1), t.fillStyle = r.valAxisFontColor ? `#${r.valAxisFontColor}` : "#595959", t.textAlign = "right", t.textBaseline = "middle";
		let e = D(r, a);
		for (let n of Be.minorLines) T(t, X, Q, Ve(n), !1, e);
		for (let e of Be.majorLines) {
			let n = Ve(e);
			if (me(r)) {
				t.strokeStyle = We.color, t.lineWidth = We.width;
				let e = We.dash.length > 0 && t.getLineDash ? t.getLineDash() : [];
				We.dash.length > 0 && t.setLineDash(We.dash), t.beginPath(), t.moveTo(X, n), t.lineTo(X + Q, n), t.stroke(), We.dash.length > 0 && t.setLineDash(e);
			}
			ge && t.fillText(N(r, e, !1), X - 4, n), L(t, r.valAxisMajorTickMark, "val", X, n, He.color, He.width, !1, r.valAxisLineHidden, "major", a, r.valAxisLineDash);
		}
		for (let e of Be.minorTicks) L(t, r.valAxisMinorTickMark, "val", X, Ve(e), He.color, He.width, !1, r.valAxisLineHidden, "minor", a, r.valAxisLineDash);
	}
	let Ge = !r.valAxisHidden && !r.valAxisLineHidden, Ke = !r.catAxisHidden && !r.catAxisLineHidden;
	Ge && j(t, X, Z, X, Z + $, He.color, He.width, r.valAxisLineDash), Ke && j(t, X, Z + $, X + Q, Z + $, Ue.color, Ue.width, r.catAxisLineDash);
	let qe = Q / y, Je = qe / (1 + e(r.barGapWidth, "chartex") / 100);
	I.forEach((e, i) => {
		let o = X + qe * i + (qe - Je) / 2, s = Math.min(Ve(e.start), Ve(e.end)), u = Math.max(Ve(e.start), Ve(e.end)), p = Math.max(1, u - s), m = e.isSub ? 2 : +!e.isPos, v = ke.get(i), b = Te(r, v, G, m), x = v?.color ? `#${v.color}` : e.isSub ? q : e.isPos ? je : K;
		e.paintSlot && b && (t.fillStyle = le(t, b, o, s, Je, p, x, c), t.fillRect(o, s, Je, p));
		let S = F(r, r.chartexDataPointStyle, "line", m, 3), C = Ee(v) ? v : G;
		if (e.paintSlot && ue(t, r, r.chartexDataPointStyle, C, m, 3, S ? `#${S}` : x, a) && t.strokeRect(o, s, Je, p), e.paintSlot && I[i + 1]?.paintSlot && i < y - 1 && r.chartexConnectorLines !== !1) {
			let n = X + qe * (i + 1) + (qe - Je) / 2, c = e.isPos ? s : u;
			t.save();
			let l = O(r, r.chartexSeriesLineStyle, G, m, 3, "#000000", { linkedNoStyleFallback: !0 });
			ae(t, l, a) && (l.widthEmu ?? (t.lineWidth = .75 * a), t.beginPath(), t.moveTo(o + Je, c), t.lineTo(n, c), t.stroke()), t.restore();
		}
		let w = e.hasValue ? g[i] : 0, T = z(r, G, i, _[i] ?? "", w, {
			visible: r.showDataLabels,
			showVal: !0,
			showCatName: !1
		}, Oe, !e.hasValue);
		if (T) {
			let e = G?.dataLabelColors?.[i] ?? T.fontColor ?? null, u = e ? `#${e}` : r.dataLabelFontColor ? `#${r.dataLabelFontColor}` : "#595959", m = n(T.fontSizeHpt, a) ?? ce(r.dataLabelFontSizeHpt, h, a), g = T.fontBold ?? r.dataLabelFontBold ?? !1, _ = V(r, T.fontFace ?? r.dataLabelFontFace, "minor");
			t.font = `${T.textStyle.fontItalic ? "italic " : ""}${g ? "bold " : ""}${m}px ${_}`, te(t, T.text, {
				kind: "bar",
				rect: {
					x: o,
					y: s,
					w: Je,
					h: p
				},
				orientation: "vertical",
				negative: w < 0,
				position: T.position ?? "outEnd"
			}, {
				x: X,
				y: Z,
				w: Q,
				h: $
			}, m, u, T.manualLayout, {
				x: l,
				y: d,
				w: f,
				h
			}, k(r, T.richRuns, a, _, g, T.textStyle), void 0, T.textStyle, a, T.labelBox, c);
		}
	}), t.textAlign = "center", t.textBaseline = "top", t.fillStyle = r.catAxisFontColor ? `#${r.catAxisFontColor}` : "#595959", t.font = se(ve, be, r.catAxisFontBold ?? !1, r.catAxisFontItalic ?? !1);
	let Ye = Z + $ + 4;
	for (let e = 0; e < y && !r.catAxisHidden; e++) {
		let n = X + qe * e + qe / 2;
		(W[e] ?? []).forEach((e, r) => e && t.fillText(e, n, Ye + r * (ve + 2)));
	}
	ie(t, r, l, d, f, h, X, Z, Q, $, Le, ze, U.catFontPx, U.valFontPx), he(t, Pe, Fe, l, d, f, h, X, Z, Q, $, H.bandH + 2, a, [
		Me,
		Ne,
		J
	], c), t.restore();
}
function ke(t, r, i, a, o) {
	let c = r.series[0]?.values ?? [], l = Math.max(c.length, r.categories.length);
	if (l === 0 || C(t, i, l)) return;
	let d = 0;
	for (let e = 0; e < l; e++) d = Math.max(d, c[e] ?? 0);
	if (!(d > 0)) return;
	let { x: f, y: p, w: h, h: g } = i, _ = pe(t, r, h, g, a), y = r.series[0], b = S(y?.dataLabelOverrides), x = `#${y?.color ?? P(r, 0, 1, y?.chartexStyle)}`, w = oe(r, 0, 1, y?.chartexStyle, y?.color), T = {
		...r,
		series: [re(r, y?.name ?? "", y, r.chartexDataPointStyle, 0, 1, x)]
	}, E = ee(t, T, h, g, .22, a), { legRightW: D, legLeftW: O, legTopH: A, legBottomH: j } = v(E, r.legendOverlay === !0), M = ce(r.catAxisFontSizeHpt, g, a);
	t.save(), t.font = se(M, V(r, r.catAxisFontFace, "minor"), r.catAxisFontBold ?? !1, r.catAxisFontItalic ?? !1);
	let N = 0;
	if (!r.catAxisHidden) {
		for (let e = 0; e < Math.min(l, r.categories.length); e++) N = Math.max(N, t.measureText(r.categories[e]).width);
		r.categories.length > 0 && (N += 10);
	}
	let ne = s(r, f, p, h, g, a, {
		titleBand: _,
		legendSideReserveFrac: .22,
		legendReserve: E,
		pad: {
			t: _.bandH + A + 2,
			r: D + h * .02,
			b: j + g * .02,
			l: O + N + h * .02
		},
		honorPlotAreaManualLayout: !0
	});
	fe(t, r, f, p, h, g, p + ne.title.topPad, ne.title.fontPx);
	let { px0: F, py0: I, pw: ie, ph: L } = ne.plotRect;
	m(t, r, F, I, ie, L, a, o);
	let R = L / l, B = R / (1 + e(r.barGapWidth, "chartex") / 100);
	for (let e = 0; e < l; e++) {
		let i = Math.max(0, c[e] ?? 0), s = ie * i / d, l = F + (ie - s) / 2, u = I + R * e + (R - B) / 2;
		w && (t.fillStyle = le(t, w, l, u, s, B, x, o), t.fillRect(l, u, s, B)), ue(t, r, r.chartexDataPointStyle, y, 0, 1, x, a) && t.strokeRect(l, u, s, B);
		let m = r.categories[e];
		!r.catAxisHidden && m != null && (t.fillStyle = r.catAxisFontColor ? `#${r.catAxisFontColor}` : "#595959", t.textAlign = "right", t.textBaseline = "middle", t.fillText(m, F - 6, u + B / 2));
		let _ = z(r, y, e, m ?? "", i, {
			visible: !1,
			showVal: !1,
			showCatName: !1
		}, b);
		if (_) {
			let e = n(_.fontSizeHpt, a) ?? ce(r.dataLabelFontSizeHpt, g, a), i = V(r, _.fontFace ?? r.dataLabelFontFace, "minor");
			t.font = `${_.textStyle.fontItalic ? "italic " : ""}${_.fontBold ? "bold " : ""}${e}px ${i}`, te(t, _.text, {
				kind: "bar",
				rect: {
					x: l,
					y: u,
					w: s,
					h: B
				},
				orientation: "horizontal",
				negative: !1,
				position: _.position ?? "ctr"
			}, {
				x: F,
				y: I,
				w: ie,
				h: L
			}, e, _.fontColor ? `#${_.fontColor}` : "#ffffff", _.manualLayout, {
				x: f,
				y: p,
				w: h,
				h: g
			}, k(r, _.richRuns, a, i, _.fontBold ?? !1, _.textStyle), void 0, _.textStyle, a, _.labelBox, o);
		}
	}
	if (!r.catAxisHidden && !r.catAxisLineHidden) {
		let e = u(r.catAxisLineColor, r.catAxisLineWidthEmu, a);
		t.strokeStyle = e.color, t.lineWidth = e.width, t.beginPath(), t.moveTo(F, I), t.lineTo(F, I + L), t.stroke();
	}
	he(t, T, E, f, p, h, g, F, I, ie, L, _.bandH + 2, a, [w], o), t.restore();
}
function Ae(e, t, n, r, i = 0) {
	let a = t.series[0];
	if (!a || C(e, n, Math.max(t.categories.length, a.categories?.length ?? 0, a.values.length))) return;
	let o = be(a, t.categories, { sortDescending: !1 });
	if (o.points.length === 0) return;
	let s = de(a, 0), c = O(t, t.chartexDataPointLineStyle, a, s, 1, R(0, a), { linkedNoStyleFallback: !0 });
	x(e, {
		...t,
		chartType: "line",
		categories: o.categories,
		series: [{
			...o.series,
			showMarker: !1,
			lineHidden: !c.visible,
			lineColor: c.color.replace(/^#/, ""),
			lineWidthEmu: c.widthEmu,
			chartexStyle: {
				lineDash: c.dash,
				lineCap: c.cap,
				lineJoin: c.join
			}
		}],
		catAxisHidden: !1,
		catAxisTickLabelPos: "none",
		showLegend: !1,
		valMin: t.valMin ?? 0,
		valMax: t.valMax ?? 1.2,
		valAxisMajorUnit: t.valAxisMajorUnit ?? .2
	}, n, r, i);
}
function je(e, t, n, r, i = 0) {
	let a = t.series[0];
	if (!a || C(e, n, Math.max(t.categories.length, a.categories?.length ?? 0, a.values.length))) return;
	let o = be(a, t.categories);
	if (o.points.length === 0) return;
	let s = t.series.find((e) => e.seriesType === "line"), c = s?.chartexFormatIdx ?? a.chartexFormatIdx ?? 0, l = {
		...s ?? o.series,
		name: s?.name || "Cumulative %",
		values: o.series.values,
		categories: o.categories,
		color: s?.color ?? F(t, t.chartexDataPointLineStyle, "line", c, 1) ?? a.lineColor ?? a.color,
		seriesType: "line",
		useSecondaryAxis: !0,
		showMarker: !1
	}, u = {
		min: t.secondaryValAxis?.min ?? 0,
		max: t.secondaryValAxis?.max ?? 1,
		title: t.secondaryValAxis?.title ?? null,
		hidden: t.secondaryValAxis?.hidden ?? !1,
		formatCode: t.secondaryValAxis?.formatCode ?? "0%",
		fontColor: t.secondaryValAxis?.fontColor ?? null,
		fontSizeHpt: t.secondaryValAxis?.fontSizeHpt ?? null,
		fontFace: t.secondaryValAxis?.fontFace ?? null,
		lineColor: t.secondaryValAxis?.lineColor ?? null,
		lineWidthEmu: t.secondaryValAxis?.lineWidthEmu ?? null,
		lineHidden: t.secondaryValAxis?.lineHidden ?? !1,
		majorTickMark: t.secondaryValAxis?.majorTickMark ?? "out",
		minorTickMark: t.secondaryValAxis?.minorTickMark ?? null,
		majorUnit: t.secondaryValAxis?.majorUnit ?? null,
		minorUnit: t.secondaryValAxis?.minorUnit ?? null,
		titleFontSizeHpt: t.secondaryValAxis?.titleFontSizeHpt ?? null,
		titleFontBold: t.secondaryValAxis?.titleFontBold ?? null,
		titleFontColor: t.secondaryValAxis?.titleFontColor ?? null,
		titleFontFace: t.secondaryValAxis?.titleFontFace ?? null
	};
	A(e, {
		...t,
		chartType: "clusteredBar",
		categories: o.categories,
		series: [{
			...o.orderedSeries,
			seriesType: null,
			useSecondaryAxis: !1
		}, l],
		secondaryValAxis: u
	}, n, r, {
		gapPolicy: "chartex",
		semanticLineNoStyleFallback: !0
	}, i);
}
var K = 7, q = .05, Me = 1.2;
function Ne(e, t, n, r) {
	let i = (r ?? t) - (n ?? e);
	if (!(i > 0) || !Number.isFinite(i)) return null;
	let a = b(i, K);
	if (!(a > 0) || !Number.isFinite(a)) return null;
	let o = e - i * q, s = t + i * q;
	e >= 0 && (e === 0 || t > Me * e) && (o = 0), t <= 0 && (t === 0 || Math.abs(e) > Me * Math.abs(t)) && (s = 0);
	let c = n ?? Math.floor(o / a) * a, l = r ?? Math.ceil(s / a) * a;
	return ![c, l].every(Number.isFinite) || !(l > c) ? null : {
		min: c,
		max: l,
		majorUnit: a
	};
}
function J(n, i, c, p, _) {
	let b = 3 * p, x = i.chartexBox;
	if (!x || x.categories.length === 0 || x.series.length === 0) return;
	let { x: S, y: O, w: k, h: A } = c;
	if (C(n, c, h(x.series.map((e) => e.valuesByCategory), 1e4))) return;
	let M = () => {
		n.fillStyle = "#888", n.font = "12px sans-serif", n.textAlign = "center", n.textBaseline = "middle", n.fillText("(chart values out of range)", S + k / 2, O + A / 2);
	}, te = (e) => {
		let t = e.max - e.min, n = t / e.step;
		return Number.isFinite(e.min) && Number.isFinite(e.max) && Number.isFinite(e.step) && Number.isFinite(t) && Number.isFinite(n) && e.max > e.min && e.step > 0 && n <= 1e3 && e.min + e.step > e.min;
	}, R = Infinity, z = -Infinity;
	for (let e of x.series) for (let t of e.valuesByCategory) for (let e of t) Number.isFinite(e) && (e < R && (R = e), e > z && (z = e));
	if (!isFinite(R) || !isFinite(z)) return;
	if (!Number.isFinite(z - R)) {
		M();
		return;
	}
	let ae = i.valAxisMajorUnit == null ? Ne(R, z, i.valMin, i.valMax) : null, me = ae ? {
		...i,
		valMin: ae.min,
		valMax: ae.max,
		valAxisMajorUnit: ae.majorUnit
	} : i, ge = V(i, i.valAxisFontFace, "minor"), H = ce(i.valAxisFontSizeHpt, A, p), U = f(H), _e = I(p), ve = y({
		dataMin: R,
		dataMax: z,
		explicitMin: me.valMin,
		explicitMax: me.valMax,
		axisLenPt: A / p,
		majorUnit: me.valAxisMajorUnit
	});
	if (!te({
		min: ve.min,
		max: ve.max,
		step: ve.majorUnit
	})) {
		M();
		return;
	}
	let ye = 0;
	if (!i.valAxisHidden) {
		let e = n.font;
		n.font = se(H, ge, i.valAxisFontBold ?? !1, i.valAxisFontItalic ?? !1);
		let r = 0;
		for (let e of ve.majorTicks) {
			let t = N(i, e, !1);
			r = Math.max(r, n.measureText(t).width);
		}
		n.font = e, ye = r + U + t * p;
	}
	let be = pe(n, i, k, A, p), xe = ce(i.catAxisFontSizeHpt, A, p), Se = ce(i.valAxisFontSizeHpt, A, p), Ce = o(i, k, A, p), W = x.series.length, we = x.series.map((e, t) => de(e, t)), Te = x.series.map((e, t) => {
		let n = we[t], r = e.color ?? P(i, n, W, e.chartexStyle);
		return re(i, e.name, e, i.chartexDataPointStyle, n, W, r, !0);
	}), Ee = {
		...i,
		series: Te
	}, De = ee(n, Ee, k, A, .22, p), { legRightW: G, legLeftW: Oe, legTopH: ke, legBottomH: Ae } = v(De, i.legendOverlay === !0), je = s(i, S, O, k, A, p, {
		titleBand: be,
		legendSideReserveFrac: .22,
		legendReserve: De,
		pad: {
			t: be.bandH + ke + Se / 2 + 2,
			r: G + k * .02,
			b: Ae + Ce.catBandH + (i.catAxisHidden ? A * .02 : r(xe)),
			l: Oe + Ce.valBandW + (i.valAxisHidden ? k * .02 : ye)
		},
		honorPlotAreaManualLayout: !0
	}), { px0: K, py0: q, pw: Me, ph: J } = je.plotRect;
	m(n, i, K, q, Me, J, p, _);
	let Pe = x.categories, Fe = Pe.length, Ie = w(me, R, z, J / p);
	if (!te(Ie)) {
		M();
		return;
	}
	fe(n, i, S, O, k, A, O + je.title.topPad, je.title.fontPx);
	let { min: Le, max: Re } = Ie, ze = Re - Le, Y = (e) => q + J * (1 - (e - Le) / ze), X = u(i.valAxisLineColor, i.valAxisLineWidthEmu, p), Z = E(i, p);
	if (n.save(), !i.valAxisHidden) {
		if (n.font = se(H, ge, i.valAxisFontBold ?? !1, i.valAxisFontItalic ?? !1), n.textAlign = "right", n.textBaseline = "middle", i.valAxisMinorGridlines) {
			let e = D(i, p);
			for (let t of Ie.minorLines) T(n, K, Me, Y(t), !1, e);
		}
		for (let e of Ie.majorLines) {
			let t = Y(e);
			if (i.valAxisMajorGridlines !== !1) {
				n.strokeStyle = Z.color, n.lineWidth = Z.width;
				let e = Z.dash.length > 0 && n.getLineDash ? n.getLineDash() : [];
				Z.dash.length > 0 && n.setLineDash(Z.dash), n.beginPath(), n.moveTo(K, t), n.lineTo(K + Me, t), n.stroke(), Z.dash.length > 0 && n.setLineDash(e);
			}
			n.fillStyle = i.valAxisFontColor ? `#${i.valAxisFontColor}` : "#595959", n.fillText(N(i, e, !1), K - _e, t), L(n, i.valAxisMajorTickMark, "val", K, t, X.color, X.width, !1, i.valAxisLineHidden, "major", p, i.valAxisLineDash);
		}
		for (let e of Ie.minorTicks) L(n, i.valAxisMinorTickMark, "val", K, Y(e), X.color, X.width, !1, i.valAxisLineHidden, "minor", p, i.valAxisLineDash);
		i.valAxisLineHidden || j(n, K, q, K, q + J, X.color, X.width, i.valAxisLineDash);
	}
	let Q = u(i.catAxisLineColor, i.catAxisLineWidthEmu, p);
	!i.catAxisHidden && !i.catAxisLineHidden && j(n, K, q + J, K + Me, q + J, Q.color, Q.width, i.catAxisLineDash);
	let $ = Me / Fe, Be = e(i.barGapWidth, "chartex"), Ve = (e) => `#${x.series[e].color ?? P(i, we[e], W, x.series[e].chartexStyle)}`, He = (e) => oe(i, we[e], W, x.series[e].chartexStyle, x.series[e].color), Ue = x.series.map((e) => e.valuesByCategory.map((t) => d(t, e.quartileMethod))), We = (e, t) => {
		let n = l(K, Me, x.oneBoxPerSeries ? 1 : Fe, W, x.oneBoxPerSeries ? 0 : e, t, Be);
		return n ? {
			bx: n.boxX,
			boxW: n.boxWidth,
			cx: n.centerX
		} : {
			bx: K,
			boxW: 0,
			cx: K
		};
	};
	for (let e = 0; e < W; e++) {
		let t = x.series[e];
		if (!t.meanLine) continue;
		let r = i.chartexDataPointLineStyle ?? i.chartexDataPointStyle, a = t.lineColor ? `#${t.lineColor}` : Ve(e);
		if (n.save(), ue(n, i, r, t, we[e], W, a, p) || t.lineColor != null) {
			t.lineColor && (n.strokeStyle = a), t.lineWidthEmu && (n.lineWidth = g(t.lineWidthEmu, p));
			let r = !1;
			n.beginPath();
			for (let t = 0; t < Fe; t++) {
				let i = Ue[e][t];
				if (!i) {
					r = !1;
					continue;
				}
				let { cx: a } = We(t, e), o = Y(i.mean);
				r ? n.lineTo(a, o) : n.moveTo(a, o), r = !0;
			}
			n.stroke();
		}
		n.restore();
	}
	let Ge = ce(i.catAxisFontSizeHpt, A, p), Ke = a(Ge);
	for (let e = 0; e < Fe; e++) {
		let t = K + $ * (e + .5);
		i.catAxisHidden || L(n, i.catAxisMajorTickMark, "cat", q + J, t, Q.color, Q.width, !1, i.catAxisLineHidden, "major", p, i.catAxisLineDash);
		for (let t = 0; t < W; t++) {
			let r = x.series[t], a = Ue[t][e];
			if (!a) continue;
			let { bx: o, boxW: s, cx: c } = We(e, t), l = Ve(t), u = He(t), d = i.chartexDataPointStyle, f = i.chartexDataPointLineStyle ?? d, m = i.chartexDataPointMarkerStyle ?? d, h = we[t], v = F(i, d, "line", h, W), y = r.lineColor ? `#${r.lineColor}` : v ? `#${v}` : l, S = r.lineWidthEmu ? g(r.lineWidthEmu, p) : d?.lineWidthEmu == null ? 1 : g(d.lineWidthEmu, p), C = F(i, f, "line", h, W), w = F(i, m, "fill", h, W), T = B(i, h, W, r.chartexStyle, r.color, m), E = F(i, m, "line", h, W), D = (e, t) => {
				let a = r.chartexStyle, o = a?.lineHidden != null || a?.lineColors?.some(Boolean) || a?.lineWidthEmu != null || a?.lineDash != null || a?.lineCap != null || a?.lineJoin != null, s = ue(n, i, e, r, h, W, t, p), c = e?.lineNoStyle === !0 && !o && r.lineColor == null && r.lineWidthEmu == null;
				return !s && c && (n.strokeStyle = t, n.lineWidth = 1, n.setLineDash([])), r.lineColor && (n.strokeStyle = y), r.lineWidthEmu && (n.lineWidth = S), s || c || r.lineColor != null;
			}, O = Y(a.q1), k = Y(a.q3), A = Math.min(O, k), j = Math.max(1, Math.abs(O - k)), M = s * .4;
			D(f, C ?? y) && (n.beginPath(), n.moveTo(c, Y(a.whiskerHi)), n.lineTo(c, k), n.moveTo(c, O), n.lineTo(c, Y(a.whiskerLo)), n.moveTo(c - M / 2, Y(a.whiskerHi)), n.lineTo(c + M / 2, Y(a.whiskerHi)), n.moveTo(c - M / 2, Y(a.whiskerLo)), n.lineTo(c + M / 2, Y(a.whiskerLo)), n.stroke()), u && (n.fillStyle = le(n, u, o, A, s, j, l, _), n.fillRect(o, A, s, j)), D(d, y) && n.strokeRect(o + S / 2, A + S / 2, s - S, j - S);
			let N = Y(a.median);
			if (D(f, C ?? y) && (n.beginPath(), n.moveTo(o, N), n.lineTo(o + s, N), n.stroke()), r.showNonoutliers) {
				let e = i.chartStyleMarkerSymbol ?? i.chartexMarkerSymbol ?? "circle";
				for (let t of a.inner) {
					if (e === "none") continue;
					let r = D(m, E ?? y);
					ne(n, c, Y(t), e, 3, T ? w ? `#${w}` : l : "transparent", r ? y : null, p, n.lineWidth, T, _);
				}
			}
			if (r.meanMarker) {
				let e = Y(a.mean), t = b;
				D(m, E ?? y) && (n.beginPath(), n.moveTo(c - t, e - t), n.lineTo(c + t, e + t), n.moveTo(c + t, e - t), n.lineTo(c - t, e + t), n.stroke());
			}
			if (r.showOutliers) {
				let e = i.chartStyleMarkerSymbol ?? i.chartexMarkerSymbol ?? "circle";
				for (let t of a.outliers) {
					if (e === "none") continue;
					let r = D(m, E ?? y);
					ne(n, c, Y(t), e, 3, T ? w ? `#${w}` : l : "transparent", r ? y : null, p, n.lineWidth, T, _);
				}
			}
		}
		if (!i.catAxisHidden) {
			n.font = se(Ge, V(i, i.catAxisFontFace, "minor"), i.catAxisFontBold ?? !1, i.catAxisFontItalic ?? !1), n.fillStyle = i.catAxisFontColor ? `#${i.catAxisFontColor}` : "#595959", n.textAlign = "center", n.textBaseline = "top";
			let r = Pe[e];
			n.fillText(r, t, q + J + Ke);
		}
	}
	n.restore(), ie(n, i, S, O, k, A, K, q, Me, J, Oe, Ae, Ce.catFontPx, Ce.valFontPx), he(n, Ee, De, S, O, k, A, K, q, Me, J, be.bandH + 2, p, x.series.map((e, t) => He(t)), _);
}
var Pe = .18;
function Fe(e, t, r, a, o) {
	let c = t.chartexSunburst;
	if (!c || c.rows.length === 0) return;
	let { x: l, y: u, w: d, h: f } = r;
	if (xe(c.rows)) {
		C(e, r, i + 1);
		return;
	}
	let p = Se(c.rows);
	if (p.layoutWeight <= 0 || p.children.length === 0) return;
	let h = t.series[0], g = S(h?.dataLabelOverrides), _ = p.children.map((e, n) => oe(t, n, p.children.length, h?.chartexStyle, h?.color)), v = {
		...t,
		chartType: "clusteredBar",
		series: p.children.map((e) => {
			let n = P(t, e.branchIndex, p.children.length, h?.chartexStyle);
			return re(t, e.label, h, t.chartexDataPointStyle, e.branchIndex, p.children.length, n, !1, !1);
		})
	}, y = ee(e, v, d, f, .22, a), b = s(t, l, u, d, f, a, {
		titleTopPadFrac: .035,
		titleBottomPadFrac: .035,
		legendSideReserveFrac: 0,
		legendReserve: y,
		radialGapFrac: .02,
		honorPlotAreaManualLayout: !0
	});
	fe(e, t, l, u, d, f, u + b.title.topPad, b.title.fontPx);
	let { px0: x, py0: w, pw: T, ph: E } = b.plotRect;
	m(e, t, x, w, T, E, a, o);
	let D = x + T / 2, O = w + E / 2, A = Math.min(T, E) * .46;
	p.a0 = -Math.PI / 2, p.a1 = -Math.PI / 2 + Math.PI * 2, Ce(p);
	let j = W(p) + 1, M = A * Pe, N = (A - M) / j, ne = (e) => `#${P(t, e, p.children.length, h?.chartexStyle)}`, F = (e) => oe(t, e, p.children.length, h?.chartexStyle, h?.color), I = h?.seriesDataLabels, ie = V(t, I?.fontFace ?? t.dataLabelFontFace, "minor"), L = n(I?.fontSizeHpt, a) ?? Math.max(7, Math.min(13, A * .075)), R = I?.fontColor ? `#${I.fontColor}` : "#ffffff", B = Array.from({ length: j }, () => []), ae = [p];
	for (; ae.length > 0;) {
		let e = ae.pop();
		e.depth >= 0 && B[e.depth].push(e);
		for (let t = e.children.length - 1; t >= 0; t--) ae.push(e.children[t]);
	}
	e.save();
	for (let r = 0; r < j; r++) {
		let i = M + r * N, s = i + N;
		for (let c of B[r]) {
			let r = c.a1 - c.a0;
			if (r <= 1e-4) continue;
			e.beginPath(), e.arc(D, O, s, c.a0, c.a1), e.arc(D, O, i, c.a1, c.a0, !0), e.closePath();
			let m = F(c.branchIndex);
			m && (e.fillStyle = le(e, m, D - s, O - s, s * 2, s * 2, ne(c.branchIndex), o), e.fill()), ue(e, t, t.chartexDataPointStyle, t.series[0], c.branchIndex, p.children.length, "#ffffff", a) && e.stroke();
			let _ = z(t, h, c.labelIndex, c.label, c.value, {
				visible: !1,
				showVal: !1,
				showCatName: !1
			}, g);
			if (!_) continue;
			let v = _.text, y = n(_.fontSizeHpt, a) ?? L, b = _.fontColor ? `#${_.fontColor}` : R, S = _.fontFace ? V(t, _.fontFace, "minor") : ie, C = (c.a0 + c.a1) / 2, A = (i + s) / 2, j = N - 4, M = r * A;
			if (!_.manualLayout && j < y * .9 && M < y * .9) continue;
			let ee = D + Math.cos(C) * A, P = O + Math.sin(C) * A;
			if (e.font = `${_.textStyle.fontItalic ? "italic " : ""}${_.fontBold ? "bold " : ""}${y}px ${S}`, _.manualLayout) {
				te(e, v, {
					kind: "point",
					x: ee,
					y: P,
					position: _.position ?? "ctr"
				}, {
					x,
					y: w,
					w: T,
					h: E
				}, y, b, _.manualLayout, {
					x: l,
					y: u,
					w: d,
					h: f
				}, k(t, _.richRuns, a, S, _.fontBold ?? !1, _.textStyle), void 0, _.textStyle, a, _.labelBox, o);
				continue;
			}
			e.save(), e.translate(ee, P);
			let re = C, I = re * 180 / Math.PI % 360;
			(I > 90 || I < -90) && (re += Math.PI), e.rotate(re), e.font = `${_.textStyle.fontItalic ? "italic " : ""}${_.fontBold ? "bold " : ""}${y}px ${S}`, te(e, v, {
				kind: "point",
				x: 0,
				y: 0,
				position: _.position ?? "ctr"
			}, {
				x: -j / 2,
				y: -M / 2,
				w: j,
				h: M
			}, y, b, void 0, {
				x: -j / 2,
				y: -M / 2,
				w: j,
				h: M
			}, k(t, _.richRuns, a, S, _.fontBold ?? !1, _.textStyle), void 0, _.textStyle, a, _.labelBox, o), e.restore();
		}
	}
	e.restore(), he(e, v, y, l, u, d, f, x, w, T, E, b.title.bandH + 2, a, _, o);
}
function Ie(e, t) {
	let n = e.map((e, t) => ({
		node: e,
		index: t,
		value: e.layoutWeight
	})).filter((e) => e.value > 0).sort((e, t) => t.value - e.value || e.index - t.index), r = n.reduce((e, t) => e + t.value, 0);
	if (r <= 0 || t.w <= 0 || t.h <= 0) return [];
	let i = t.w * t.h / r, a = n.map((e) => ({
		...e,
		area: e.value * i
	})), o = [], s = { ...t }, c = [], l = 0, u = Infinity, d = 0, f = (e, t, n, r) => {
		if (e <= 0 || t <= 0 || r <= 0) return Infinity;
		let i = r * r;
		return Math.max(i * n / (e * e), e * e / (i * t));
	}, p = (e, t) => {
		if (e.length !== 0) if (s.w >= s.h) {
			let n = s.h > 0 ? t / s.h : 0, r = s.y;
			for (let t = 0; t < e.length; t++) {
				let i = t === e.length - 1 ? s.y + s.h - r : e[t].area / n;
				o.push({
					node: e[t].node,
					rect: {
						x: s.x,
						y: r,
						w: n,
						h: i
					}
				}), r += i;
			}
			s = {
				x: s.x + n,
				y: s.y,
				w: Math.max(0, s.w - n),
				h: s.h
			};
		} else {
			let n = s.w > 0 ? t / s.w : 0, r = s.x;
			for (let t = 0; t < e.length; t++) {
				let i = t === e.length - 1 ? s.x + s.w - r : e[t].area / n;
				o.push({
					node: e[t].node,
					rect: {
						x: r,
						y: s.y,
						w: i,
						h: n
					}
				}), r += i;
			}
			s = {
				x: s.x,
				y: s.y + n,
				w: s.w,
				h: Math.max(0, s.h - n)
			};
		}
	}, m = 0;
	for (; m < a.length;) {
		let e = a[m], t = Math.min(s.w, s.h), n = l + e.area, r = Math.min(u, e.area), i = Math.max(d, e.area);
		c.length === 0 || f(n, r, i, t) <= f(l, u, d, t) ? (c.push(e), l = n, u = r, d = i, m++) : (p(c, l), c = [], l = 0, u = Infinity, d = 0);
	}
	return p(c, l), o;
}
function Le(e, t, r, a, o) {
	let c = t.chartexTreemap;
	if (!c || c.rows.length === 0) return;
	if (xe(c.rows)) {
		C(e, r, i + 1);
		return;
	}
	let l = Se(c.rows, !0);
	if (l.layoutWeight <= 0 || l.children.length === 0) return;
	let u = t.series[0], d = l.children.map((e) => oe(t, e.branchIndex, l.children.length, u?.chartexStyle, u?.color)), f = {
		...t,
		chartType: "clusteredBar",
		series: l.children.map((e) => {
			let n = P(t, e.branchIndex, l.children.length, u?.chartexStyle);
			return re(t, e.label, u, t.chartexDataPointStyle, e.branchIndex, l.children.length, n, !0, !1);
		})
	}, p = ee(e, f, r.w, r.h, .22, a), h = s(t, r.x, r.y, r.w, r.h, a, {
		titleTopPadFrac: .035,
		titleBottomPadFrac: .035,
		legendSideReserveFrac: 0,
		legendReserve: p,
		radialGapFrac: .015,
		honorPlotAreaManualLayout: !0
	});
	fe(e, t, r.x, r.y, r.w, r.h, r.y + h.title.topPad, h.title.fontPx);
	let { px0: g, py0: _, pw: v, ph: y } = h.plotRect;
	m(e, t, g, _, v, y, a, o);
	let b = {
		x: g,
		y: _,
		w: v,
		h: y
	}, x = c.parentLabelLayout ?? "overlapping", S = t.series[0]?.seriesDataLabels, w = V(t, S?.fontFace ?? t.dataLabelFontFace, "minor"), T = n(S?.fontSizeHpt, a) ?? Math.max(8, Math.min(13, h.plotRect.ph * .025)), E = S?.fontColor ? `#${S.fontColor}` : "#ffffff", D = new Map((t.series[0]?.dataLabelOverrides ?? []).map((e) => [e.idx, e])), O = t.chartBg ? t.chartBg.startsWith("#") ? t.chartBg : `#${t.chartBg}` : "#ffffff", A = (i, s) => {
		if (s.w < .5 || s.h < .5) return;
		let c = `#${P(t, i.branchIndex, l.children.length, u?.chartexStyle)}`, d = oe(t, i.branchIndex, l.children.length, u?.chartexStyle, u?.color), f = D.get(i.labelIndex), p = f?.fontColor ? `#${f.fontColor}` : E, m = n(f?.fontSizeHpt, a) ?? T, h = f?.fontBold ?? S?.fontBold ?? !1;
		if (i.children.length > 0) {
			let n = z(t, u, i.labelIndex, i.label, i.value, {
				visible: x !== "none",
				showVal: !1,
				showCatName: !0
			}, D, !0), l = n != null && (x !== "overlapping" || i.depth === 0), g = m, _ = n?.fontFace ? V(t, n.fontFace, "minor") : w, v = x === "banner" && l ? Math.min(s.h * .28, g + 7) : 0;
			v > 0 && d && (e.fillStyle = le(e, d, s.x, s.y, s.w, v, c, o), e.fillRect(s.x, s.y, s.w, v));
			let y = {
				x: s.x,
				y: s.y + v,
				w: s.w,
				h: Math.max(0, s.h - v)
			};
			for (let e of Ie(i.children, y)) A(e.node, e.rect);
			if (l && (n.manualLayout || s.w > g * 2 && s.h > g + 4)) {
				e.font = `${h ? "bold " : ""}${g}px ${_}`;
				let i = v > 0 ? {
					x: s.x,
					y: s.y,
					w: s.w,
					h: v
				} : s, c = f?.position ?? "inBase";
				te(e, n.text, n.manualLayout ? {
					kind: "point",
					x: s.x + s.w / 2,
					y: s.y + s.h / 2,
					position: c
				} : {
					kind: "box",
					rect: i,
					position: c
				}, n.manualLayout ? b : i, g, p, n.manualLayout, r, k(t, n.richRuns, a, _, h, n.textStyle), void 0, n.textStyle, a, n.labelBox, o);
			}
			return;
		}
		d && (e.fillStyle = le(e, d, s.x, s.y, s.w, s.h, c, o), e.fillRect(s.x, s.y, s.w, s.h)), ue(e, t, t.chartexDataPointStyle, t.series[0], i.branchIndex, l.children.length, O, a, { linkedNoStyleFallback: !0 }) && e.strokeRect(s.x, s.y, s.w, s.h);
		let g = z(t, u, i.labelIndex, i.label, i.value, {
			visible: !1,
			showVal: !1,
			showCatName: !1
		}, D);
		if (!g) return;
		let _ = n(g.fontSizeHpt, a) ?? m;
		if (!g.manualLayout && (s.w <= _ * 1.2 || s.h <= _ * 1.2)) return;
		let v = g.fontFace ? V(t, g.fontFace, "minor") : w;
		e.font = `${g.fontBold ? "bold " : ""}${_}px ${v}`;
		let y = s, C = g.position === "outEnd" ? "inEnd" : g.position ?? "ctr";
		te(e, g.text, g.manualLayout ? {
			kind: "point",
			x: s.x + s.w / 2,
			y: s.y + s.h / 2,
			position: C
		} : {
			kind: "box",
			rect: y,
			position: C
		}, g.manualLayout ? b : y, _, g.fontColor ? `#${g.fontColor}` : p, g.manualLayout, r, k(t, g.richRuns, a, v, g.fontBold ?? !1, g.textStyle), void 0, g.textStyle, a, g.labelBox, o);
	};
	e.save(), e.beginPath(), e.rect(g, _, v, y), e.clip();
	for (let e of Ie(l.children, {
		x: g,
		y: _,
		w: v,
		h: y
	})) A(e.node, e.rect);
	e.restore(), he(e, f, p, r.x, r.y, r.w, r.h, g, _, v, y, h.title.bandH + 2, a, d, o);
}
function Re(e, t, n, r, a = 0) {
	let o = De(t);
	if (o != null && o > 1048576) return C(e, n, i + 1), !0;
	switch (t.chartType) {
		case "waterfall": return Oe(e, t, n, r, a), !0;
		case "clusteredColumn": return A(e, {
			...t,
			chartType: "clusteredBar"
		}, n, r, { gapPolicy: "chartex" }, a), !0;
		case "histogram": return G(e, t, n, r, a), !0;
		case "funnel": return ke(e, t, n, r, a), !0;
		case "paretoLine": return Ae(e, t, n, r, a), !0;
		case "pareto": return je(e, t, n, r, a), !0;
		case "boxWhisker": return J(e, t, n, r, a), !0;
		case "sunburst": return Fe(e, t, n, r, a), !0;
		case "treemap": return Le(e, t, n, r, a), !0;
		default: return !1;
	}
}
//#endregion
//#region src/chart-ex.ts
var ze = ge({ render: Re }, "chartEx");
//#endregion
export { ze as chartEx };
