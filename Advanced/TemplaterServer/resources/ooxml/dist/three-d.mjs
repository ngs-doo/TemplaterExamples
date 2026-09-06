import { B as e, Bt as t, Ct as n, E as r, Et as i, Ft as a, Gt as o, H as s, Ht as c, Jt as l, Kt as u, M as d, Mt as f, Nt as p, Ot as m, Pt as h, Qt as g, Rt as _, St as v, Tt as y, W as b, Wt as x, X as S, Xt as C, Z as w, Zt as T, _t as E, a as D, b as O, bt as k, ct as ee, gt as A, jt as j, kt as M, lt as N, mt as P, n as F, ot as te, r as ne, st as I, t as L, ut as R, v as z, wt as re, x as B, xt as ie, yt as ae, zt as V } from "./plot-area-frame-D5hEOgkJ.js";
import { a as H, r as U } from "./units-EJdC96r6.js";
import { D as W, E as G, O as oe, _ as K, a as q, c as se, d as J, g as ce, h as le, i as ue, k as de, m as fe, n as pe, o as me, r as he, s as ge, t as _e, x as ve } from "./three-d-YYghQndN.js";
import { t as ye } from "./renderer-module-contract-Cu-GKuPd.js";
function be(e) {
	switch (e) {
		case "cylinder":
		case "cone":
		case "coneToMax":
		case "pyramid":
		case "pyramidToMax": return e;
		default: return "box";
	}
}
var xe = (e) => Math.max(0, Math.min(1, e));
function Se(e, t) {
	if (t.length < 3) return null;
	let n = e[t[0]];
	for (let r = 1; r + 1 < t.length; r++) for (let i = r + 1; i < t.length; i++) {
		let a = e[t[r]], o = e[t[i]], s = {
			x: a.x - n.x,
			y: a.y - n.y,
			depth: a.depth - n.depth
		}, c = {
			x: o.x - n.x,
			y: o.y - n.y,
			depth: o.depth - n.depth
		}, l = {
			x: s.y * c.depth - s.depth * c.y,
			y: s.depth * c.x - s.x * c.depth,
			depth: s.x * c.y - s.y * c.x
		}, u = Math.hypot(l.x, l.y, l.depth);
		if (u > 2 ** -52) return {
			x: l.x / u,
			y: l.y / u,
			depth: l.depth / u
		};
	}
	return null;
}
function Ce(e, t) {
	let n = e.reduce((t, n) => ({
		x: t.x + n.x / e.length,
		y: t.y + n.y / e.length,
		depth: t.depth + n.depth / e.length
	}), {
		x: 0,
		y: 0,
		depth: 0
	});
	return t.map((t) => {
		let r = Se(e, t.indices);
		if (!r) return t;
		let i = t.indices.reduce((n, r) => ({
			x: n.x + e[r].x / t.indices.length,
			y: n.y + e[r].y / t.indices.length,
			depth: n.depth + e[r].depth / t.indices.length
		}), {
			x: 0,
			y: 0,
			depth: 0
		}), a = {
			x: i.x - n.x,
			y: i.y - n.y,
			depth: i.depth - n.depth
		};
		return r.x * a.x + r.y * a.y + r.depth * a.depth >= 0 ? t : {
			...t,
			indices: [...t.indices].reverse()
		};
	});
}
function we(e) {
	let { horizontal: t, crossStart: n, crossSize: r, baseCoord: i, endCoord: a, nearDepth: o, farDepth: s } = e;
	if (![
		n,
		r,
		i,
		a,
		o,
		s
	].every(Number.isFinite) || r <= 0 || i === a || o === s) return null;
	let c = be(e.shape), l = c === "cylinder" || c === "cone" || c === "coneToMax", u = c !== "box" && c !== "cylinder", d = c === "coneToMax" || c === "pyramidToMax", f = l ? Math.max(8, Math.min(64, Math.trunc(e.roundSegments ?? 32))) : 4, p = xe(e.baseScale ?? (d ? e.toMaxBaseScale ?? 1 : 1)), m = xe(e.endScale ?? (u ? d ? e.toMaxEndScale ?? 0 : 0 : 1));
	if (p === 0 && m === 0) return null;
	let h = n + r / 2, g = r / 2, _ = (o + s) / 2, v = Math.abs(s - o) / 2, y = [], b = (e, n) => {
		if (n === 0) {
			let n = y.length;
			return y.push(t ? {
				x: e,
				y: h,
				depth: _
			} : {
				x: h,
				y: e,
				depth: _
			}), [n];
		}
		let r = [];
		for (let i = 0; i < f; i++) {
			let a = l ? i / f * Math.PI * 2 : Math.PI / 4 + i / f * Math.PI * 2, o = l ? 1 : Math.SQRT2, s = h + Math.cos(a) * g * n * o, c = _ + Math.sin(a) * v * n * o;
			r.push(y.length), y.push(t ? {
				x: e,
				y: s,
				depth: c
			} : {
				x: s,
				y: e,
				depth: c
			});
		}
		return r;
	}, x = b(i, p), S = b(a, m), C = l, w = [];
	x.length > 1 && e.omitBaseCap !== !0 && w.push({
		indices: x,
		role: "baseCap",
		smoothSurface: C
	}), S.length > 1 && e.omitEndCap !== !0 && w.push({
		indices: S,
		role: "endCap",
		smoothSurface: C
	});
	let T = [], E = Math.max(x.length, S.length);
	for (let e = 0; e < E; e++) {
		let t = (e + 1) % E, n = x.length === 1 ? x[0] : x[e], r = x.length === 1 ? x[0] : x[t], i = S.length === 1 ? S[0] : S[e], a = S.length === 1 ? S[0] : S[t], o = x.length === 1 ? [
			n,
			a,
			i
		] : S.length === 1 ? [
			n,
			r,
			i
		] : [
			n,
			r,
			a,
			i
		];
		w.push({
			indices: o,
			role: "side",
			smoothSurface: C,
			segmentIndex: e,
			baseRimEdge: x.length > 1 ? [n, r] : void 0,
			endRimEdge: S.length > 1 ? [i, a] : void 0
		}), T.push([n, i]);
	}
	return {
		shape: c,
		vertices: y,
		faces: Ce(y, w),
		silhouetteEdges: T
	};
}
function Te(e) {
	let { x0: t, x1: n, lower0: r, lower1: i, upper0: a, upper1: o, nearDepth: s, farDepth: c, capStart: l, capEnd: u } = e;
	if (![
		t,
		n,
		r,
		i,
		a,
		o,
		s,
		c
	].every(Number.isFinite) || t === n || s === c) return null;
	n < t && ([t, n] = [n, t], [r, i] = [i, r], [a, o] = [o, a], [l, u] = [u, l]);
	let d = Math.min(s, c), f = Math.max(s, c), p = Math.min(r, a), m = Math.min(i, o), h = Math.max(r, a), g = Math.max(i, o);
	if (Math.max(h - p, g - m) < 1e-9) return null;
	let _ = [
		{
			x: t,
			y: p,
			depth: d
		},
		{
			x: n,
			y: m,
			depth: d
		},
		{
			x: n,
			y: g,
			depth: d
		},
		{
			x: t,
			y: h,
			depth: d
		},
		{
			x: t,
			y: p,
			depth: f
		},
		{
			x: n,
			y: m,
			depth: f
		},
		{
			x: n,
			y: g,
			depth: f
		},
		{
			x: t,
			y: h,
			depth: f
		}
	];
	return {
		shape: "areaStrip",
		vertices: _,
		faces: Ce(_, [
			{
				indices: [
					0,
					3,
					2,
					1
				],
				role: "side",
				smoothSurface: !1
			},
			{
				indices: [
					4,
					5,
					6,
					7
				],
				role: "side",
				smoothSurface: !1
			},
			{
				indices: [
					0,
					4,
					7,
					3
				],
				role: "baseCap",
				smoothSurface: !1
			},
			{
				indices: [
					1,
					2,
					6,
					5
				],
				role: "endCap",
				smoothSurface: !1
			},
			{
				indices: [
					0,
					1,
					5,
					4
				],
				role: "side",
				smoothSurface: !1
			},
			{
				indices: [
					3,
					7,
					6,
					2
				],
				role: "side",
				smoothSurface: !1
			}
		].filter((e) => (e.role !== "baseCap" || l) && (e.role !== "endCap" || u))),
		silhouetteEdges: []
	};
}
function Ee(e) {
	let t = e.upper0 - e.lower0, n = e.upper1 - e.lower1;
	if (Number.isFinite(t) && Number.isFinite(n) && t * n < 0) {
		let r = t / (t - n), i = e.x0 + (e.x1 - e.x0) * r, a = e.lower0 + (e.lower1 - e.lower0) * r;
		return [Te({
			...e,
			x1: i,
			lower1: a,
			upper1: a,
			capEnd: !1
		}), Te({
			...e,
			x0: i,
			lower0: a,
			upper0: a,
			capStart: !1
		})].filter((e) => e != null);
	}
	let r = Te(e);
	return r ? [r] : [];
}
function De(e) {
	let t = e.outline;
	if (t.length < 3 || t.length > 64 || ![e.nearDepth, e.farDepth].every(Number.isFinite) || Math.abs(e.nearDepth - e.farDepth) < 1e-9 || !t.every((e) => Number.isFinite(e.x) && Number.isFinite(e.y))) return null;
	let n = Math.min(e.nearDepth, e.farDepth), r = Math.max(e.nearDepth, e.farDepth), i = t.length, a = [...t.map((e) => ({
		...e,
		depth: n
	})), ...t.map((e) => ({
		...e,
		depth: r
	}))], o = Array.from({ length: i }, (e, t) => t), s = Array.from({ length: i }, (e, t) => i + t).reverse();
	return {
		shape: "lineRibbon",
		vertices: a,
		faces: Ce(a, [
			{
				indices: o,
				role: "side",
				smoothSurface: !1
			},
			{
				indices: s,
				role: "side",
				smoothSurface: !1
			},
			...Array.from({ length: i }, (e, t) => {
				let n = (t + 1) % i;
				return {
					indices: [
						t,
						n,
						i + n,
						i + t
					],
					role: "side",
					smoothSurface: !1
				};
			})
		]),
		silhouetteEdges: []
	};
}
function Oe(e) {
	let { centerX: t, centerY: n, centerDepth: r, radius: i, modelDepth: a, thickness: o, startAngle: s, endAngle: c } = e;
	if (![
		t,
		n,
		r,
		i,
		a,
		o,
		s,
		c
	].every(Number.isFinite) || !(i > 0) || !(a > 0) || !(o > 0) || !(c > s)) return null;
	let l = Math.min(Math.PI * 2, c - s), u = l >= Math.PI * 2 - 1e-9, d = Math.max(2, Math.min(128, Math.trunc(e.segments ?? Math.ceil(32 * l / (Math.PI * 2))))), f = n - o / 2, p = n + o / 2, m = [{
		x: t,
		y: f,
		depth: r
	}, {
		x: t,
		y: p,
		depth: r
	}], h = [], g = [], _ = u ? d : d + 1;
	for (let e = 0; e < _; e++) {
		let n = s + l * e / d, o = t + Math.cos(n) * i, c = r + Math.sin(n) * i / a;
		h.push(m.length), m.push({
			x: o,
			y: f,
			depth: c
		}), g.push(m.length), m.push({
			x: o,
			y: p,
			depth: c
		});
	}
	let v = u ? [{
		indices: [...h],
		role: "baseCap",
		smoothSurface: !0
	}, {
		indices: [...g],
		role: "endCap",
		smoothSurface: !0
	}] : [
		{
			indices: [0, ...h],
			role: "baseCap",
			smoothSurface: !0
		},
		{
			indices: [1, ...g],
			role: "endCap",
			smoothSurface: !0
		},
		{
			indices: [
				0,
				1,
				g[0],
				h[0]
			],
			role: "baseCap",
			smoothSurface: !1
		},
		{
			indices: [
				0,
				h.at(-1),
				g.at(-1),
				1
			],
			role: "endCap",
			smoothSurface: !1
		}
	];
	for (let e = 0; e < d; e++) {
		let t = u ? (e + 1) % d : e + 1;
		v.push({
			indices: [
				h[e],
				g[e],
				g[t],
				h[t]
			],
			role: "side",
			smoothSurface: !0,
			segmentIndex: e,
			baseRimEdge: [h[e], h[t]],
			endRimEdge: [g[e], g[t]]
		});
	}
	return {
		shape: "pieSector",
		vertices: m,
		faces: Ce(m, v),
		silhouetteEdges: h.slice(0, u ? void 0 : -1).map((e, t) => [e, g[t]])
	};
}
//#endregion
//#region packages/core/src/chart/three-d-scene.ts
function ke(e, t) {
	if (![e, t].every(Number.isFinite)) return null;
	let n = t - e;
	if (n === 0) return e >= 0 && e <= 1 ? {
		startT: 0,
		endT: 1
	} : null;
	let r = -e / n, i = (1 - e) / n, a = Math.max(0, Math.min(r, i)), o = Math.min(1, Math.max(r, i));
	return a <= o ? {
		startT: a,
		endT: o
	} : null;
}
function Ae(e, t, n, r) {
	if (![
		e,
		t,
		n,
		r
	].every(Number.isFinite)) return [];
	let i = [0, 1], a = (e, t) => {
		let n = t - e;
		if (n !== 0) for (let t of [0, 1]) {
			let r = (t - e) / n;
			r > 0 && r < 1 && Number.isFinite(r) && i.push(r);
		}
	};
	a(e, t), a(n, r), i.sort((e, t) => e - t);
	let o = i.filter((e, t) => t === 0 || Math.abs(e - i[t - 1]) > 1e-12), s = (e, t, n) => e + (t - e) * n, c = (e) => Math.max(0, Math.min(1, e)), l = [];
	for (let i = 0; i + 1 < o.length; i++) {
		let a = o[i], u = o[i + 1], d = (a + u) / 2, f = c(s(e, t, d)), p = c(s(n, r, d));
		Math.abs(p - f) <= 1e-12 || l.push({
			startT: a,
			endT: u,
			lowerStart: c(s(e, t, a)),
			lowerEnd: c(s(e, t, u)),
			upperStart: c(s(n, r, a)),
			upperEnd: c(s(n, r, u))
		});
	}
	return l;
}
var je = (e) => ({
	minX: Math.min(...e.map((e) => e.x)),
	maxX: Math.max(...e.map((e) => e.x)),
	minY: Math.min(...e.map((e) => e.y)),
	maxY: Math.max(...e.map((e) => e.y))
}), Me = (e, t) => {
	let n = !1;
	for (let r = 0, i = e.length - 1; r < e.length; i = r++) {
		let a = e[r], o = e[i], s = (a.x - t.x) * (o.y - t.y) - (a.y - t.y) * (o.x - t.x), c = Math.max(1, Math.abs(a.x), Math.abs(a.y), Math.abs(o.x), Math.abs(o.y));
		if (Math.abs(s) <= c * 1e-9 && t.x >= Math.min(a.x, o.x) - 1e-9 && t.x <= Math.max(a.x, o.x) + 1e-9 && t.y >= Math.min(a.y, o.y) - 1e-9 && t.y <= Math.max(a.y, o.y) + 1e-9) return !0;
		a.y > t.y != o.y > t.y && t.x < (o.x - a.x) * (t.y - a.y) / (o.y - a.y) + a.x && (n = !n);
	}
	return n;
}, Ne = (e, t, n, r) => {
	let i = {
		x: t.x - e.x,
		y: t.y - e.y
	}, a = {
		x: r.x - n.x,
		y: r.y - n.y
	}, o = i.x * a.y - i.y * a.x;
	if (Math.abs(o) < 1e-12) return null;
	let s = {
		x: n.x - e.x,
		y: n.y - e.y
	}, c = (s.x * a.y - s.y * a.x) / o, l = (s.x * i.y - s.y * i.x) / o;
	return c < -1e-9 || c > 1.000000001 || l < -1e-9 || l > 1.000000001 ? null : {
		x: e.x + i.x * c,
		y: e.y + i.y * c
	};
};
function Pe(e, t, n, r) {
	let i = [], a = (e) => {
		i.length >= 12 || i.some((t) => Math.hypot(t.x - e.x, t.y - e.y) < 1e-7) || i.push(e);
	}, o = {
		x: (Math.max(n.minX, r.minX) + Math.min(n.maxX, r.maxX)) / 2,
		y: (Math.max(n.minY, r.minY) + Math.min(n.maxY, r.maxY)) / 2
	};
	Me(e, o) && Me(t, o) && a(o);
	for (let n of e) Me(t, n) && a(n);
	for (let n of t) Me(e, n) && a(n);
	for (let n = 0; n < e.length && i.length < 12; n++) for (let r = 0; r < t.length && i.length < 12; r++) {
		let i = Ne(e[n], e[(n + 1) % e.length], t[r], t[(r + 1) % t.length]);
		i && a(i);
	}
	return i;
}
function Fe(e, t) {
	let n = e.cameraDepths;
	if (!n || n.length !== e.points.length || e.points.length < 3) return e.cameraDepth;
	let r = e.cameraWeights?.length === e.points.length ? e.cameraWeights : e.points.map(() => 1), i = e.points[0];
	for (let a = 1; a + 1 < e.points.length; a++) {
		let o = e.points[a], s = e.points[a + 1], c = (o.y - s.y) * (i.x - s.x) + (s.x - o.x) * (i.y - s.y);
		if (Math.abs(c) < 1e-12) continue;
		let l = ((o.y - s.y) * (t.x - s.x) + (s.x - o.x) * (t.y - s.y)) / c, u = ((s.y - i.y) * (t.x - s.x) + (i.x - s.x) * (t.y - s.y)) / c, d = 1 - l - u;
		if (Math.min(l, u, d) < -1e-7) continue;
		let f = l * r[0] + u * r[a] + d * r[a + 1];
		if (Math.abs(f) > 2 ** -52) return (l * n[0] * r[0] + u * n[a] * r[a] + d * n[a + 1] * r[a + 1]) / f;
	}
	return e.cameraDepth;
}
function Ie(e) {
	if (e.length < 2) return [...e];
	let t = [...e.keys()].sort((t, n) => e[t].cameraDepth - e[n].cameraDepth || t - n), n = e.map((e) => je(e.points)), r = [...e.keys()].sort((e, t) => n[e].minX - n[t].minX || e - t), i = e.map(() => /* @__PURE__ */ new Set()), a = e.map(() => 0), o = [], s = 0;
	for (let c of r) {
		for (let e = o.length - 1; e >= 0; e--) n[o[e]].maxX < n[c].minX - 1e-9 && o.splice(e, 1);
		for (let r of o) {
			if (++s > 2e5) return t.map((t) => e[t]);
			if (n[r].maxY < n[c].minY - 1e-9 || n[c].maxY < n[r].minY - 1e-9) continue;
			let o = Pe(e[r].points, e[c].points, n[r], n[c]), l = 0;
			for (let t of o) {
				let n = Fe(e[r], t) - Fe(e[c], t), i = 1e-8 * Math.max(1, Math.abs(e[r].cameraDepth), Math.abs(e[c].cameraDepth));
				if (Math.abs(n) <= i) continue;
				let a = n < 0 ? -1 : 1;
				if (l !== 0 && l !== a) {
					l = 0;
					break;
				}
				l = a;
			}
			if (l === 0) continue;
			let u = l < 0 ? r : c, d = l < 0 ? c : r;
			i[u].has(d) || (i[u].add(d), a[d]++);
		}
		o.push(c);
	}
	let c = new Set(e.keys()), l = [];
	for (; c.size;) {
		let n = t.find((e) => c.has(e) && a[e] === 0);
		if (n ??= t.find((e) => c.has(e)), n == null) break;
		c.delete(n), l.push(e[n]);
		for (let e of i[n]) a[e]--;
	}
	return l;
}
//#endregion
//#region packages/core/src/chart/three-d-stroke.ts
var Y = 1e-9, Le = 1e4, Re = (e, t, n) => ({
	x: e.x + (t.x - e.x) * n,
	y: e.y + (t.y - e.y) * n,
	cameraDepth: e.cameraDepth + (t.cameraDepth - e.cameraDepth) * n,
	cameraWeight: (e.cameraWeight ?? 1) + ((t.cameraWeight ?? 1) - (e.cameraWeight ?? 1)) * n
}), ze = (e, t) => Math.hypot(e.x - t.x, e.y - t.y) <= Y;
function Be(e, t, n = 0) {
	let r = t.filter((e) => Number.isFinite(e) && e > Y);
	if (r.length === 0) return e.length >= 2 ? [[...e]] : [];
	r.length % 2 == 1 && r.push(...r);
	let i = [], a = 0, o = r[0], s = !0, c = r.reduce((e, t) => e + t, 0), l = c > Y && Number.isFinite(n) ? (n % c + c) % c : 0;
	for (; l > Y;) {
		let e = Math.min(l, o);
		l -= e, o -= e, o <= Y && (a = (a + 1) % r.length, o = r[a], s = a % 2 == 0);
	}
	let u = null;
	for (let t = 0; t + 1 < e.length; t++) {
		let n = e[t], c = e[t + 1], l = Math.hypot(c.x - n.x, c.y - n.y);
		if (!(l > Y)) continue;
		let d = 0;
		for (; d < l - Y;) {
			let e = Math.min(o, l - d), t = Re(n, c, d / l), f = Re(n, c, (d + e) / l);
			if (s && (u ??= [], (u.length === 0 || !ze(u.at(-1), t)) && u.push(t), u.push(f)), d += e, o -= e, o <= Y) {
				if (s && u && u.length >= 2) {
					if (i.length >= 1e4) return null;
					i.push(u);
				}
				u = null, a = (a + 1) % r.length, o = r[a], s = a % 2 == 0;
			}
		}
	}
	if (s && u && u.length >= 2) {
		if (i.length >= 1e4) return null;
		i.push(u);
	}
	if (i.length > 1 && ze(e[0], e.at(-1)) && ze(i[0][0], e[0]) && ze(i.at(-1).at(-1), e.at(-1))) {
		let e = i.shift(), t = i.pop();
		i.unshift([...t, ...e.slice(1)]);
	}
	return i;
}
var Ve = (e, t) => ({
	kind: e,
	points: t.map(({ x: e, y: t }) => ({
		x: e,
		y: t
	})),
	cameraDepths: t.map((e) => e.cameraDepth),
	cameraWeights: t.map((e) => e.cameraWeight ?? 1),
	cameraDepth: t.reduce((e, t) => e + t.cameraDepth, 0) / t.length
}), He = (e, t, n) => {
	let r = [];
	for (let n = 0; n < 12; n++) {
		let i = Math.PI * 2 * n / 12;
		r.push({
			...e,
			x: e.x + Math.cos(i) * t,
			y: e.y + Math.sin(i) * t
		});
	}
	return Ve(n, r);
};
function Ue(e, t, n) {
	let r = Number.isFinite(n.width) ? Math.max(0, n.width) : 0;
	if (!(r > Y) || t.length < 3) return null;
	let i = r / 2;
	if ((n.lineJoin ?? "miter") === "round") return He(e, i, "join");
	let a = [];
	for (let n of t) {
		let t = n.x - e.x, r = n.y - e.y, o = Math.hypot(t, r);
		if (!(o > Y)) continue;
		let s = -r / o * i, c = t / o * i;
		a.push({
			...e,
			x: e.x + s,
			y: e.y + c
		}, {
			...e,
			x: e.x - s,
			y: e.y - c
		});
	}
	if (a.length < 3) return null;
	a.sort((e, t) => e.x - t.x || e.y - t.y);
	let o = (e, t, n) => (t.x - e.x) * (n.y - e.y) - (t.y - e.y) * (n.x - e.x), s = [];
	for (let e of a) {
		for (; s.length >= 2 && o(s.at(-2), s.at(-1), e) <= Y;) s.pop();
		s.push(e);
	}
	let c = [];
	for (let e of [...a].reverse()) {
		for (; c.length >= 2 && o(c.at(-2), c.at(-1), e) <= Y;) c.pop();
		c.push(e);
	}
	let l = [...s.slice(0, -1), ...c.slice(0, -1)];
	return l.length >= 3 ? Ve("join", l) : null;
}
var We = (e, t, n, r) => {
	let i = t.x * r.y - t.y * r.x;
	if (Math.abs(i) <= Y) return null;
	let a = {
		x: n.x - e.x,
		y: n.y - e.y
	}, o = (a.x * r.y - a.y * r.x) / i;
	return {
		x: e.x + t.x * o,
		y: e.y + t.y * o
	};
};
function Ge(e, t) {
	let n = Number.isFinite(t.width) ? Math.max(0, t.width) : 0;
	if (!(n > Y) || e.length < 2) return [];
	let r = n / 2, i = t.lineCap ?? "butt", a = t.lineJoin ?? "miter", o = Math.max(1, t.miterLimit ?? 10), s = [], c = Be(e, t.dash ?? [], t.dashOffset);
	if (c == null) return null;
	let l = (e) => s.length >= 1e4 ? !1 : (s.push(e), !0);
	for (let n = 0; n < c.length; n++) {
		let s = c[n], u = s.length > 2 && ze(s[0], s.at(-1)), d = n === 0 && ze(s[0], e[0]) ? t.startCap ?? i : i, f = n + 1 === c.length && ze(s.at(-1), e.at(-1)) ? t.endCap ?? i : i, p = [];
		for (let e = 0; e + 1 < s.length; e++) {
			let t = s[e], n = s[e + 1], r = Math.hypot(n.x - t.x, n.y - t.y);
			p.push(r > Y ? {
				x: (n.x - t.x) / r,
				y: (n.y - t.y) / r
			} : null);
		}
		for (let e = 0; e + 1 < s.length; e++) {
			let n = p[e];
			if (!n) continue;
			let i = {
				x: -n.y * r,
				y: n.x * r
			}, a = e === 0, o = e + 2 === s.length, c = Math.min(.5, r / 2), m = u || !a || t.overlapStart === !0, h = u || !o || t.overlapEnd === !0, g = !u && a && d === "square" ? r : m ? c : 0, _ = !u && o && f === "square" ? r : h ? c : 0, v = {
				...s[e],
				x: s[e].x - n.x * g,
				y: s[e].y - n.y * g
			}, y = {
				...s[e + 1],
				x: s[e + 1].x + n.x * _,
				y: s[e + 1].y + n.y * _
			};
			if (!l(Ve("segment", [
				{
					...v,
					x: v.x + i.x,
					y: v.y + i.y
				},
				{
					...y,
					x: y.x + i.x,
					y: y.y + i.y
				},
				{
					...y,
					x: y.x - i.x,
					y: y.y - i.y
				},
				{
					...v,
					x: v.x - i.x,
					y: v.y - i.y
				}
			]))) return null;
		}
		if (!u && d === "round" && !l(He(s[0], r, "cap")) || !u && f === "round" && !l(He(s.at(-1), r, "cap"))) return null;
		let m = (e, t, n) => {
			if (!t || !n) return !0;
			let i = t.x * n.y - t.y * n.x;
			if (Math.abs(i) <= Y) return !0;
			if (a === "round") return l(He(e, r, "join"));
			let s = i > 0 ? -1 : 1, c = {
				...e,
				x: e.x + -t.y * r * s,
				y: e.y + t.x * r * s
			}, u = {
				...e,
				x: e.x + -n.y * r * s,
				y: e.y + n.x * r * s
			};
			if (a === "miter") {
				let i = We(c, t, u, n);
				if (i && Math.hypot(i.x - e.x, i.y - e.y) <= r * o) return !!l(Ve("join", [
					c,
					{
						...e,
						...i
					},
					u
				]));
			}
			return l(Ve("join", [
				c,
				e,
				u
			]));
		};
		for (let e = 1; e + 1 < s.length; e++) if (!m(s[e], p[e - 1], p[e])) return null;
		if (u && !m(s[0], p.at(-1) ?? null, p[0] ?? null)) return null;
	}
	return s;
}
//#endregion
//#region packages/core/src/chart/three-d-outline.ts
var Ke = 1e-9, qe = (e, t) => Math.hypot(e.x - t.x, e.y - t.y, e.depth - t.depth) <= Ke, Je = (e, t) => e.x - t.x || e.y - t.y || e.depth - t.depth, Ye = (e, t) => {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		let n = Je(e[r], t[r]);
		if (n !== 0) return n;
	}
	return e.length - t.length;
};
function Xe(e) {
	let t = [...e].reverse();
	return Ye(e, t) <= 0 ? e : t;
}
function Ze(e) {
	let t = qe(e[0], e.at(-1)) ? e.slice(0, -1) : [...e];
	if (t.length === 0) return [];
	let n = 0;
	for (let e = 1; e < t.length; e++) Je(t[e], t[n]) < 0 && (n = e);
	let r = t.map((e, r) => t[(n + r) % t.length]), i = t.map((e, r) => t[(n - r + t.length) % t.length]), a = Ye(r, i) <= 0 ? r : i;
	return [...a, a[0]];
}
function Qe(e) {
	let t = [], n = (e) => {
		let n = t.find((t) => qe(t.point, e));
		if (n) return Je(e, n.point) < 0 && (n.point = e), n;
		let r = {
			point: e,
			edges: [],
			order: -1
		};
		return t.push(r), r;
	}, r = [];
	for (let [t, i] of e) {
		if (qe(t, i)) continue;
		let e = n(t), a = n(i);
		e !== a && r.push([e, a]);
	}
	t.sort((e, t) => Je(e.point, t.point)), t.forEach((e, t) => {
		e.order = t;
	});
	let i = [], a = /* @__PURE__ */ new Set();
	for (let [e, t] of r) {
		let n = e.order < t.order ? e : t, r = e.order < t.order ? t : e, o = `${n.order}:${r.order}`;
		a.has(o) || (a.add(o), i.push({
			first: n,
			second: r,
			key: o
		}));
	}
	i.sort((e, t) => e.key.localeCompare(t.key)), i.forEach((e, t) => {
		e.first.edges.push(t), e.second.edges.push(t);
	});
	for (let e of t) e.edges.sort((e, t) => e - t);
	let o = /* @__PURE__ */ new Set(), s = (e, t) => {
		let n = [e.point], r = e, a = t;
		for (; !o.has(a);) {
			o.add(a);
			let e = i[a], t = e.first === r ? e.second : e.first;
			if (n.push(t.point), t.edges.length !== 2) break;
			let s = t.edges.find((e) => !o.has(e));
			if (s === void 0) break;
			r = t, a = s;
		}
		return n;
	}, c = [];
	for (let e of t) if (e.edges.length !== 2) for (let t of e.edges) o.has(t) || c.push(Xe(s(e, t)));
	for (let e = 0; e < i.length; e++) {
		if (o.has(e)) continue;
		let t = i[e], n = t.first.order <= t.second.order ? t.first : t.second;
		c.push(Ze(s(n, e)));
	}
	let l = t.filter((e) => e.edges.length > 2).map((e) => ({
		point: e.point,
		neighbours: e.edges.map((t) => {
			let n = i[t];
			return n.first === e ? n.second.point : n.first.point;
		}).sort(Je)
	}));
	return {
		paths: c.sort(Ye),
		junctions: l
	};
}
//#endregion
//#region packages/core/src/chart/three-d-renderer.ts
function $e(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.legendEntries ?? []) t.set(n.idx, n);
	return t;
}
function et(e, t, n) {
	let r = c(t?.fontSizeHpt ?? e.legendFontSizeHpt, n) ?? 9 * n, i = t?.fontFace ?? e.legendFontFace;
	return {
		fontPx: r,
		font: `${t?.fontBold ?? e.legendFontBold ?? !1 ? "bold " : ""}${r}px ${ht(i)}`,
		color: t?.fontColor ? `#${t.fontColor}` : e.legendFontColor ? `#${e.legendFontColor}` : "#595959"
	};
}
var tt = [
	"4472C4",
	"ED7D31",
	"70AD47",
	"A5A5A5",
	"FFC000",
	"5B9BD5"
], nt = w, rt = S, it = new Set([
	"line",
	"stackedLine",
	"stackedLinePct",
	"area",
	"stackedArea",
	"stackedAreaPct",
	"clusteredBar",
	"clusteredBarH",
	"stackedBar",
	"stackedBarH",
	"stackedBarPct",
	"stackedBarHPct"
]);
function at(e, t) {
	let n = Number.isFinite(t) && t > 0 ? t / H : 1, r = Number.isFinite(e) && e >= 0 ? e / U : 0;
	return Math.max(.25, r) * n;
}
function ot(e, t) {
	let n = Number.isSafeInteger(t) && t > 0 ? t : 0, r = Array.from({ length: n }, () => []);
	for (let t of e) {
		let e = t.categoryIndex;
		Number.isSafeInteger(e) && e >= 0 && e < n && r[e].push(t);
	}
	return r;
}
var st = (e, t) => `#${t?.color ?? tt[e % tt.length]}`;
function ct(e, t, n) {
	let r = 0;
	for (let i of e) for (let e of [t(i), n(i)]) {
		if (e == null) continue;
		let t = R(e);
		if (e.fillType === "gradient" && t > nt || t > rt - r) return !1;
		r += t;
	}
	return !0;
}
function lt(e, t) {
	let n = Array.from({ length: t }, () => ({
		maxMagnitude: 0,
		scaledTotal: 0
	}));
	for (let r of e.series) for (let e = 0; e < t; e++) {
		let t = r.values[e];
		t != null && Number.isFinite(t) && (n[e].maxMagnitude = Math.max(n[e].maxMagnitude, Math.abs(t)));
	}
	for (let r of e.series) for (let e = 0; e < t; e++) {
		let t = r.values[e], i = n[e].maxMagnitude;
		t != null && Number.isFinite(t) && i > 0 && (n[e].scaledTotal += Math.abs(t) / i);
	}
	return n;
}
function ut(e, t, n, r) {
	let i = e.series[t]?.values[n] ?? 0;
	if (!Number.isFinite(i)) return 0;
	if (!r) return i;
	let { maxMagnitude: a, scaledTotal: o } = r[n] ?? {
		maxMagnitude: 0,
		scaledTotal: 0
	};
	return a > 0 && o > 0 ? i / a / o * 100 : 0;
}
function X(e, t) {
	let n = e + t;
	return Number.isFinite(n) ? n : t < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE;
}
function dt(e) {
	let t = [];
	for (let [n, r] of [
		[e.threeD?.floor, "floor"],
		[e.threeD?.sideWall, "wall"],
		[e.threeD?.backWall, "wall"]
	]) {
		let i = b(e, n, r);
		t.push({
			fill: i.fill,
			line: i.line
		});
	}
	if (e.chartType === "pie") {
		let n = e.series[0];
		if (n) {
			let r = new Map(n.dataPointOverrides?.map((e) => [e.idx, e]) ?? []);
			for (let i = 0; i < n.values.length; i++) {
				let a = n.values[i];
				if (a == null || !Number.isFinite(a) || Math.abs(a) <= 0) continue;
				let o = Z(e, n, r.get(i), i, 0);
				t.push({
					fill: o.fill,
					line: o.lineFill
				});
			}
		}
	} else if (e.chartType === "clusteredBar" || e.chartType === "clusteredBarH" || e.chartType.startsWith("stackedBar")) {
		let n = e.chartType.startsWith("stacked"), r = e.chartType.endsWith("Pct"), i = n || e.dispBlanksAs === "zero", a = e.valAxisLogBase != null && Number.isFinite(e.valAxisLogBase) && e.valAxisLogBase >= 2, o = Math.max(1, e.categories.length, ...e.series.map((e) => Math.max(e.values.length, e.categories?.length ?? 0))), s = r ? lt(e, o) : void 0, c = (t, n) => {
			if (t === n) return !1;
			let r = Math.min(t, n), i = Math.max(t, n), o = e.valMin, s = e.valMax;
			return o != null && Number.isFinite(o) && i <= o || s != null && Number.isFinite(s) && r >= s ? !1 : !a || i > 0;
		}, l = Array(o).fill(0), u = Array(o).fill(0);
		for (let r = 0; r < e.series.length; r++) {
			let d = e.series[r], f = new Map(d.dataPointOverrides?.map((e) => [e.idx, e]) ?? []);
			for (let p = 0; p < o; p++) {
				let o = d.values[p];
				if (!(o != null && Number.isFinite(o) && (!a || o > 0) || o == null && i)) continue;
				let m = ut(e, r, p, s), h = n ? m >= 0 ? l[p] : u[p] : 0, g = X(h, m);
				if (n && (m >= 0 ? l[p] = g : u[p] = g), !c(h, g)) continue;
				let _ = Z(e, d, f.get(p), p, r);
				t.push({
					fill: _.fill,
					line: _.lineFill
				});
			}
		}
	} else {
		let n = e.chartType.toLowerCase().includes("area"), r = e.chartType.startsWith("stacked"), i = e.chartType.endsWith("Pct"), a = r || e.dispBlanksAs === "zero", o = e.valAxisLogBase != null && Number.isFinite(e.valAxisLogBase) && e.valAxisLogBase >= 2, s = Math.max(e.categories.length, ...e.series.map((e) => Math.max(e.categories?.length ?? 0, e.values.length))), c = i ? lt(e, s) : void 0, l = e.series.map(() => Array(s).fill(0));
		if (r) {
			let t = Array(s).fill(0), n = Array(s).fill(0);
			for (let r = 0; r < e.series.length; r++) for (let i = 0; i < s; i++) {
				let a = ut(e, r, i, c), o = X(a >= 0 ? t[i] : n[i], a);
				l[r][i] = o, a >= 0 ? t[i] = o : n[i] = o;
			}
		}
		for (let i = 0; i < e.series.length; i++) {
			let u = e.series[i], d = new Map(u.dataPointOverrides?.map((e) => [e.idx, e]) ?? []), f = s, p = 0, m = null, h = !1, g = !1;
			for (let s = 0; s < f; s++) {
				let f = u.values[s];
				if (f != null && Number.isFinite(f) && (!o || f > 0) || f == null && a) {
					p++;
					let a = r ? l[i][s] : ut(e, i, s, c), o = m == null ? a : Math.min(m, a), f = m == null ? a : Math.max(m, a), _ = e.valMin != null && Number.isFinite(e.valMin) && f <= e.valMin || e.valMax != null && Number.isFinite(e.valMax) && o >= e.valMax;
					if (p >= 2 && (n || u.smooth === !0 || !_)) {
						if (h = !0, n) break;
						let r = d.get(s);
						if (pt(r)) {
							let n = Z(e, u, r, s, i);
							t.push({
								fill: void 0,
								line: n.lineFill
							});
						} else g = !0;
					}
					m = a;
				} else (e.dispBlanksAs ?? "gap") === "gap" && (p = 0, m = null);
			}
			if (!h) continue;
			let _ = Z(e, u, void 0, i, i);
			n ? t.push({
				fill: _.fill,
				line: _.lineFill
			}) : g && t.push({
				fill: void 0,
				line: _.lineFill
			});
		}
	}
	return ct(t, (e) => e.fill, (e) => e.line);
}
function ft(e, t) {
	return e?.fillType === "solid" ? {
		color: `#${e.color}`,
		fill: void 0
	} : {
		color: t,
		fill: e
	};
}
function Z(t, n, r, i, a) {
	let o = n.dataPointColors?.[i] ? `#${n.dataPointColors[i]}` : st(a, n), c = t.chartType === "pie" || t.varyColors === !0 && t.series.length === 1 && t.chartType.includes("Bar") ? i : a, l, u = o, d = e(r?.chartexStyle, i);
	if (d !== void 0) ({color: u, fill: l} = ft(d, u));
	else if (r?.fillHidden === !0 || r?.color === "00000000") l = null;
	else if (r?.color) u = `#${r.color}`;
	else {
		let r = e(n.chartexStyle, c);
		if (r !== void 0) ({color: u, fill: l} = ft(r, u));
		else {
			let n = e(t.chartStyleRoles?.dataPoint3D, c);
			n !== void 0 && ({color: u, fill: l} = ft(n, u));
		}
	}
	let f, p = null, m = s(r?.chartexStyle, i);
	if (m !== void 0) m?.fillType === "solid" ? p = `#${m.color}` : f = m;
	else if (r?.lineHidden === !0) f = null;
	else if (r?.lineColor) p = `#${r.lineColor}`;
	else {
		let e = s(n.chartexStyle, c);
		if (e !== void 0) e?.fillType === "solid" ? p = `#${e.color}` : f = e;
		else if (n.lineHidden === !0) f = null;
		else if (n.lineColor) p = `#${n.lineColor}`;
		else {
			let e = s(t.chartStyleRoles?.dataPoint3D, c);
			e !== void 0 && (e?.fillType === "solid" ? p = `#${e.color}` : f = e);
		}
	}
	let h = t.chartStyleRoles?.dataPoint3D?.lineNoStyle === !0 ? void 0 : t.chartStyleRoles?.dataPoint3D, g = r?.chartexStyle?.lineCap ?? n.chartexStyle?.lineCap ?? h?.lineCap, _ = r?.chartexStyle?.lineJoin ?? n.chartexStyle?.lineJoin ?? h?.lineJoin;
	return {
		color: u,
		fill: l,
		lineColor: p,
		lineFill: f,
		lineWidthEmu: r?.lineWidthEmu ?? r?.chartexStyle?.lineWidthEmu ?? n.lineWidthEmu ?? n.chartexStyle?.lineWidthEmu ?? h?.lineWidthEmu,
		lineDash: r?.lineDash ?? r?.chartexStyle?.lineDash ?? n.chartexStyle?.lineDash ?? h?.lineDash,
		lineCustomDash: r?.chartexStyle?.lineCustomDash ?? n.chartexStyle?.lineCustomDash ?? h?.lineCustomDash,
		lineCap: g === "rnd" ? "round" : g === "sq" ? "square" : "butt",
		lineJoin: _ === "round" || _ === "bevel" ? _ : "miter"
	};
}
function pt(e) {
	if (!e) return !1;
	let t = e.chartexStyle;
	return e.lineHidden != null || e.lineColor != null || e.lineWidthEmu != null || e.lineDash != null || t?.linePaintAuthored === !0 || t?.lineHidden != null || t?.lineNoStyle === !0 || t?.lineColors?.some((e) => e != null) === !0 || t?.linePaints?.some((e) => e != null) === !0 || t?.lineWidthEmu != null || t?.lineDash != null || t?.lineCustomDash != null || t?.lineCap != null || t?.lineJoin != null;
}
function mt(e, t) {
	let n = e.cameraNormal(t);
	if (!n) return 1;
	let r = {
		x: -.2,
		y: .25,
		z: 1
	}, i = Math.hypot(r.x, r.y, r.z), a = Math.max(0, (n.x * r.x + n.y * r.y + n.z * r.z) / i);
	return Math.max(.78, Math.min(1, .78 + .24 * a));
}
var ht = (e) => `"${e && !e.startsWith("+") ? e.replace(/["\\]/g, "") : "Arial"}"`, Q = (e, t, n = "minor") => ht((t?.startsWith("+mj-") ? e.themeMajorFontLatin : t?.startsWith("+mn-") ? e.themeMinorFontLatin : t) ?? (n === "major" ? e.themeMajorFontLatin : e.themeMinorFontLatin));
function gt(e, t) {
	if (t.length) {
		e.beginPath(), e.moveTo(t[0].x, t[0].y);
		for (let n = 1; n < t.length; n++) e.lineTo(t[n].x, t[n].y);
		e.closePath();
	}
}
var _t = (e) => e === "transparent" || e === "#00000000" || e === "rgba(0,0,0,0)";
function vt(e, t, n, r) {
	_t(n) || (gt(e, t), e.fillStyle = n, e.fill(), r > 0 && (gt(e, t), e.fillStyle = `rgba(0,0,0,${r})`, e.fill()));
}
function yt(e, t, n, r, i, a, o, s, c, l, u, d) {
	return Ee({
		x0: t,
		x1: n,
		lower0: r,
		lower1: i,
		upper0: a,
		upper1: o,
		nearDepth: s,
		farDepth: c,
		capStart: u,
		capEnd: d
	}).flatMap((t) => xt(e, t, l).map((e) => ({
		...e,
		outline: !1,
		outlineSegments: void 0
	})));
}
function bt(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m = !1, h = !1, g, _) {
	if (![
		r,
		i,
		a,
		o,
		s,
		c,
		l,
		u
	].every(Number.isFinite) || a <= 0 || o <= 0 || s === c) return [];
	let v = we({
		shape: t,
		horizontal: n,
		crossStart: n ? i : r,
		crossSize: n ? o : a,
		baseCoord: s,
		endCoord: c,
		nearDepth: l,
		farDepth: u,
		baseScale: f,
		endScale: p,
		omitBaseCap: m,
		omitEndCap: h
	});
	return v ? xt(e, v, d, g, _) : [];
}
function xt(e, t, n, r, i, a = !1) {
	if (i?.exceeded) return [];
	let o = t.faces.map((r) => {
		let i = r.indices.map((e) => t.vertices[e]), a = e.cameraFacing(i);
		if (!a) return {
			meshFace: r,
			facing: a,
			face: null
		};
		let o = i.map((t) => e.project(t.x, t.y, t.depth)), s = o.reduce((e, t, n) => {
			let r = o[(n + 1) % o.length];
			return e + t.x * r.y - t.y * r.x;
		}, 0);
		return !Number.isFinite(s) || Math.abs(s) < 1e-7 ? {
			meshFace: r,
			facing: a,
			face: null
		} : {
			meshFace: r,
			facing: a,
			face: {
				points: o,
				color: J(n, mt(e, i)),
				paintRole: "fill",
				shade: 0,
				cameraDepth: i.reduce((t, n) => t + e.cameraDepth(n.x, n.y, n.depth), 0) / i.length,
				cameraDepths: i.map((t) => e.cameraDepth(t.x, t.y, t.depth)),
				cameraWeights: i.map((t) => e.cameraProjectionWeight(t.x, t.y, t.depth)),
				outline: !1
			}
		};
	}), s = a ? [] : o.map((e) => e.face).filter((e) => e != null);
	if (i) {
		if (s.length > i.remaining) return i.exceeded = !0, [];
		i.remaining -= s.length;
	}
	let c = /* @__PURE__ */ new Map(), l = (e, t) => {
		if (e === t) return;
		let n = e < t ? `${e}:${t}` : `${t}:${e}`;
		c.has(n) || c.set(n, [e, t]);
	};
	for (let e of o) {
		if (!e.facing || !e.face) continue;
		let { indices: t, smoothSurface: n, role: r } = e.meshFace;
		if (!(n && r === "side")) for (let e = 0; e < t.length; e++) l(t[e], t[(e + 1) % t.length]);
	}
	let u = o.filter((e) => e.meshFace.role === "side").sort((e, t) => (e.meshFace.segmentIndex ?? 0) - (t.meshFace.segmentIndex ?? 0));
	if (t.silhouetteEdges.length === u.length && u.length > 0) for (let e = 0; e < u.length; e++) {
		let n = u[(e + u.length - 1) % u.length], r = u[e];
		if (n.facing === r.facing || !(r.facing ? r.face : n.face)) continue;
		let [i, a] = t.silhouetteEdges[e];
		l(i, a);
	}
	let d = o.some((e) => e.meshFace.role === "baseCap" && e.facing && e.face != null), f = o.some((e) => e.meshFace.role === "endCap" && e.facing && e.face != null);
	for (let e of u) {
		if (!e.facing || !e.face) continue;
		let t = [d ? void 0 : e.meshFace.baseRimEdge, f ? void 0 : e.meshFace.endRimEdge].filter((e) => e != null);
		for (let [e, n] of t) l(e, n);
	}
	let p = Qe([...c.values()].map(([e, n]) => [t.vertices[e], t.vertices[n]]));
	if (!r) return s;
	let m = (e, t) => Math.hypot(e.x - t.x, e.y - t.y, e.depth - t.depth) <= 1e-9, h = (e) => p.junctions.some((t) => m(t.point, e));
	for (let t of p.paths) {
		let n = t.map((t) => e.project(t.x, t.y, t.depth)), a = t.map((t) => e.cameraDepth(t.x, t.y, t.depth)), o = t.map((t) => e.cameraProjectionWeight(t.x, t.y, t.depth)), c = Ge(n.map((e, t) => ({
			...e,
			cameraDepth: a[t],
			cameraWeight: o[t]
		})), {
			width: r.width,
			dash: r.dash,
			lineCap: r.cap,
			startCap: h(t[0]) ? "butt" : r.cap,
			endCap: h(t.at(-1)) ? "butt" : r.cap,
			overlapStart: h(t[0]),
			overlapEnd: h(t.at(-1)),
			lineJoin: r.join
		});
		if (!c || i && c.length > i.remaining) return i && (i.exceeded = !0), [];
		i && (i.remaining -= c.length), s.push(...c.map((e) => {
			let t = 1e-6 * Math.max(1, Math.abs(e.cameraDepth));
			return {
				points: e.points,
				color: r.color,
				paintRole: "outline",
				shade: 0,
				cameraDepth: e.cameraDepth + t,
				cameraDepths: e.cameraDepths?.map((e) => e + t),
				cameraWeights: e.cameraWeights,
				outline: !1
			};
		}));
	}
	for (let t of p.junctions) {
		let n = Ue({
			...e.project(t.point.x, t.point.y, t.point.depth),
			cameraDepth: e.cameraDepth(t.point.x, t.point.y, t.point.depth),
			cameraWeight: e.cameraProjectionWeight(t.point.x, t.point.y, t.point.depth)
		}, t.neighbours.map((t) => ({
			...e.project(t.x, t.y, t.depth),
			cameraDepth: e.cameraDepth(t.x, t.y, t.depth),
			cameraWeight: e.cameraProjectionWeight(t.x, t.y, t.depth)
		})), {
			width: r.width,
			lineJoin: r.join
		});
		if (!n) continue;
		if (i && i.remaining < 1) return i.exceeded = !0, [];
		i && --i.remaining;
		let a = 1e-6 * Math.max(1, Math.abs(n.cameraDepth));
		s.push({
			points: n.points,
			color: r.color,
			paintRole: "outline",
			shade: 0,
			cameraDepth: n.cameraDepth + a,
			cameraDepths: n.cameraDepths?.map((e) => e + a),
			cameraWeights: n.cameraWeights,
			outline: !1
		});
	}
	return s;
}
function St(e, t, n, r, i, a, o) {
	if (!t.length || o.exceeded) return [];
	let s = [...t].sort((e, t) => e.start - t.start), c = n - i / 2, l = n + i / 2, u = s[0], d = e.cameraDepth(u.centerX, c, u.centerDepth) >= e.cameraDepth(u.centerX, l, u.centerDepth) ? c : l, f = d === c ? l : c, p = (t, n, i) => ({
		x: t.centerX + Math.cos(n) * r,
		y: i,
		depth: t.centerDepth + Math.sin(n) * r / e.modelDepth
	}), m = (e) => ({
		x: e.centerX,
		y: d,
		depth: e.centerDepth
	}), h = [], g = (t, n = !1) => {
		if (t.length < 2 || o.exceeded) return;
		let r = t[0], i = t.at(-1), s = Math.hypot(r.x - i.x, r.y - i.y, r.depth - i.depth) <= 1e-9, c = Ge((n && !s ? [...t, r] : [...t]).map((t) => ({
			...e.project(t.x, t.y, t.depth),
			cameraDepth: e.cameraDepth(t.x, t.y, t.depth),
			cameraWeight: e.cameraProjectionWeight(t.x, t.y, t.depth)
		})), {
			width: a.width,
			dash: a.dash,
			lineCap: a.cap,
			startCap: "butt",
			endCap: "butt",
			lineJoin: a.join
		});
		if (!c || c.length > o.remaining) {
			o.exceeded = !0;
			return;
		}
		o.remaining -= c.length;
		for (let e of c) {
			let t = 1e-6 * Math.max(1, Math.abs(e.cameraDepth));
			h.push({
				points: e.points,
				color: a.color,
				paintRole: "outline",
				shade: 0,
				cameraDepth: e.cameraDepth + t,
				cameraDepths: e.cameraDepths?.map((e) => e + t),
				cameraWeights: e.cameraWeights,
				outline: !1
			});
		}
	}, _ = [], v = [], y = [], b = /* @__PURE__ */ new Set(), x = (e) => {
		let t = Math.PI * 2, n = (e % t + t) % t;
		return (n < 1e-8 || t - n < 1e-8 ? 0 : n).toFixed(8);
	}, S = /* @__PURE__ */ new Map();
	for (let t of s) {
		S.set(x(t.start), {
			slice: t,
			angle: t.start
		}), S.set(x(t.end), {
			slice: t,
			angle: t.end
		});
		for (let n = 0; n <= t.segments; n++) {
			let r = t.start + (t.end - t.start) * n / t.segments, i = p(t, r, d);
			if ((!_.length || Math.hypot(_.at(-1).x - i.x, _.at(-1).y - i.y, _.at(-1).depth - i.depth) > 1e-9) && _.push(i), n === t.segments) continue;
			let a = t.start + (t.end - t.start) * (n + 1) / t.segments, o = p(t, r, c), s = p(t, r, l), u = p(t, a, l), m = p(t, a, c);
			if (e.cameraFacing([
				o,
				s,
				u,
				m
			])) {
				let e = p(t, r, f), n = p(t, a, f);
				y.length || y.push(e), y.push(n), b.add(x(r)), b.add(x(a));
			} else y.length && (v.push(y), y = []);
		}
	}
	if (y.length && v.push(y), v.length > 1) {
		let e = v[0], t = v.at(-1), n = e[0], r = t.at(-1);
		Math.hypot(n.x - r.x, n.y - r.y, n.depth - r.depth) <= 1e-9 && (v[0] = [...t, ...e.slice(1)], v.pop());
	}
	g(_, !0);
	let C = /* @__PURE__ */ new Map();
	for (let { slice: e, angle: t } of S.values()) g([m(e), p(e, t, d)]), b.has(x(t)) && C.set(x(t), {
		slice: e,
		angle: t
	});
	for (let t of v) {
		g(t);
		for (let n of [t[0], t.at(-1)]) {
			let t = Math.atan2((n.depth - u.centerDepth) * e.modelDepth, n.x - u.centerX);
			C.set(x(t), {
				slice: u,
				angle: t
			});
		}
	}
	for (let { slice: e, angle: t } of C.values()) g([p(e, t, d), p(e, t, f)]);
	return h;
}
function Ct(e, t) {
	t.paint !== null && (t.paint === void 0 ? vt(e, t.points, t.color, t.shade) : (gt(e, t.points), e.fillStyle = t.paint, e.fill()), t.outline && (e.strokeStyle = t.outlineColor ?? "rgba(0,0,0,0.42)", e.lineWidth = t.outlineWidth ?? .75, e.setLineDash(B(t.outlineDash ?? "solid", e.lineWidth)), e.lineCap = t.outlineCap ?? "butt", e.lineJoin = t.outlineJoin ?? "miter", t.outline && (gt(e, t.points), e.stroke()), e.setLineDash([])));
}
function wt(e, t, n, r, i) {
	if (r === void 0) return;
	let a = t.filter((e) => e.paintRole === n);
	if (!a.length) return;
	if (r === null) {
		for (let e of a) e.paint = null;
		return;
	}
	let o = a.flatMap((e) => e.points), s = Math.min(...o.map((e) => e.x)), c = Math.max(...o.map((e) => e.x)), l = Math.min(...o.map((e) => e.y)), u = Math.max(...o.map((e) => e.y)), d = z(r, e, s, l, c - s, u - l, i);
	for (let e of a) e.paint = d;
}
function Tt(e, t) {
	e.fillStyle = "#888", e.font = "12px sans-serif", e.textAlign = "center", e.textBaseline = "middle", e.fillText("(too many data points)", t.x + t.w / 2, t.y + t.h / 2);
}
function Et(e) {
	let t = e.catAxisLabelRotation;
	return t == null ? null : !Number.isFinite(t) || Math.abs(t) > 54e5 ? 0 : t / 6e4 * Math.PI / 180;
}
function Dt(e, t, n, r, i, a = 1, o = 6) {
	if (i || r === 0) {
		e.textAlign = i ? "right" : "center", e.textBaseline = i ? "middle" : a < 0 ? "bottom" : "top", e.fillText(t, n.x + (i ? -o : 0), n.y + (i ? 0 : a * o));
		return;
	}
	e.save(), e.translate(n.x, n.y + a * o), e.rotate(r), e.textAlign = a < 0 ? "left" : "right", e.textBaseline = "middle", e.fillText(t, 0, 0), e.restore();
}
function Ot(e, t, n, r, i, a, o, s = void 0, c = 0, l = H) {
	if (!(r > 0) || !Number.isFinite(t.x) || !Number.isFinite(t.y)) return;
	let u = r / 2;
	switch (e.beginPath(), n) {
		case "square":
			e.rect(t.x - u, t.y - u, r, r);
			break;
		case "diamond":
			e.moveTo(t.x, t.y - u), e.lineTo(t.x + u, t.y), e.lineTo(t.x, t.y + u), e.lineTo(t.x - u, t.y), e.closePath();
			break;
		case "triangle":
			e.moveTo(t.x, t.y - u), e.lineTo(t.x + u, t.y + u), e.lineTo(t.x - u, t.y + u), e.closePath();
			break;
		case "x":
		case "plus": {
			let r = n === "x";
			e.moveTo(t.x - u, t.y + (r ? -u : 0)), e.lineTo(t.x + u, t.y + (r ? u : 0)), e.moveTo(t.x + (r ? -u : 0), t.y + u), e.lineTo(t.x + (r ? u : 0), t.y - u), e.strokeStyle = a, e.lineWidth = o, e.stroke();
			return;
		}
		case "dash":
			e.rect(t.x - u, t.y - r * .1, r, r * .2);
			break;
		case "star":
			for (let n = 0; n < 10; n++) {
				let r = -Math.PI / 2 + n * Math.PI / 5, i = n % 2 == 0 ? u : u * .4, a = t.x + Math.cos(r) * i, o = t.y + Math.sin(r) * i;
				n ? e.lineTo(a, o) : e.moveTo(a, o);
			}
			e.closePath();
			break;
		case "dot":
			e.ellipse(t.x, t.y, r * .25, r * .1, 0, 0, Math.PI * 2);
			break;
		case "picture":
			s?.fillType === "image" && d(e, s, t.x - u, t.y - u, r, r, l, c), e.strokeStyle = a, e.lineWidth = o, e.strokeRect(t.x - u, t.y - u, r, r);
			return;
		default:
			e.arc(t.x, t.y, u, 0, Math.PI * 2);
			break;
	}
	let f = s?.fillType === "image" ? s : void 0, p = f ? null : s === void 0 ? i === "transparent" ? null : i : s == null ? null : z(s, e, t.x - u, t.y - u, r, r, c);
	p == null ? f && (e.save(), e.clip(), d(e, f, t.x - u, t.y - u, r, r, l, c), e.restore()) : (e.fillStyle = p, e.fill()), e.strokeStyle = a, e.lineWidth = o, e.stroke();
}
function kt(e, t, r, a, o, s, l, u, d, f = 0, p, m, h = "t", g = l, _ = !0, b, x, S = s, C = 0) {
	let w = m, T = r.seriesDataLabels;
	if (v(T, w) || t.showDataLabelsOverMax !== !0 && x != null && Number.isFinite(x) && S > x) return;
	let E = w?.showVal ?? T?.showVal ?? t.showDataLabels, D = w?.showCatName ?? T?.showCatName ?? !1, O = w?.showSerName ?? T?.showSerName ?? !1, ee = w?.showPercent ?? T?.showPercent ?? !1, A = w?.text, j = fe({
		customText: A,
		showCategory: D,
		showSeries: O,
		showValue: E,
		showPercent: ee,
		category: r.categories?.[o] ?? t.categories[o] ?? `${o + 1}`,
		seriesName: r.name || `Series ${a + 1}`,
		sourceValue: s,
		valueDivisor: b?.divisor,
		percentRatio: p != null && Number.isFinite(p) ? p : void 0,
		formatCode: w?.formatCode ?? T?.formatCode ?? t.dataLabelFormatCode ?? r.valFormatCode,
		percentFormatCode: w?.formatCode ?? T?.formatCode ?? t.dataLabelFormatCode ?? "0%",
		date1904: t.date1904,
		separator: w?.separator ?? T?.separator
	});
	if (!j) return;
	let N = c(w?.fontSizeHpt ?? T?.fontSizeHpt ?? t.dataLabelFontSizeHpt, d) ?? 9 * d, P = w?.fontBold ?? T?.fontBold ?? t.dataLabelFontBold ?? !1, F = n(w, T), te = Q(t, w?.fontFace ?? T?.fontFace ?? t.dataLabelFontFace);
	e.font = `${F.fontItalic ? "italic " : ""}${P ? "bold " : ""}${N}px ${te}`;
	let ne = `#${w?.fontColor ?? T?.fontColor ?? r.labelColor ?? t.dataLabelFontColor ?? "111111"}`, I = A && w?.richRuns?.length ? ce(e, {
		runs: w.richRuns,
		ptToPx: d,
		fontFamily: te,
		fallbackBold: P,
		fallbackItalic: F.fontItalic,
		fallbackBaseline: F.fontBaseline,
		fallbackColorHidden: F.fontPaintAuthored === !0 && (F.fontHidden === !0 || F.fontColor == null),
		fontFamilyForFace: (e) => Q(t, e)
	}, N, ne) : null, L = I ? [] : re(j, Math.max(N, u.w * .45), Math.max(N * 1.2, u.h * .35), N * 1.2, (t) => e.measureText(t).width, F);
	if (!I && !L.length) return;
	let R = I?.width ?? Math.max(...L.map((t) => e.measureText(t).width)), z = I?.height ?? L.length * N * 1.2, V = ie(F, d), H = y(R + V.left + V.right, z + V.top + V.bottom, F.textRotation, F.textVerticalMode), G = M({
		kind: "point",
		x: l.x,
		y: l.y,
		position: w?.position ?? T?.position ?? t.dataLabelPosition ?? h,
		markerGap: f
	}, u, {
		w: H.w,
		h: H.h
	}, N, w?.manualLayout, u);
	if (!G) return;
	let K = W(w?.labelBox, T?.labelBox);
	T?.showLeaderLines && T.leaderLineHidden !== !0 && _ && (e.beginPath(), e.moveTo(g.x, g.y), e.lineTo(Math.max(G.rect.x, Math.min(g.x, G.rect.x + G.rect.w)), Math.max(G.rect.y, Math.min(g.y, G.rect.y + G.rect.h))), e.strokeStyle = `#${T.leaderLineColor ?? "808080"}`, e.lineWidth = T.leaderLineWidthEmu == null ? .75 * d : Math.max(.25, T.leaderLineWidthEmu / U * d), e.setLineDash(B(T.leaderLineDash ?? "solid", e.lineWidth)), e.stroke()), oe(e, K, G.rect, d, C), e.save(), e.beginPath(), e.rect(G.clip.x, G.clip.y, G.clip.w, G.clip.h), e.clip();
	let q = k(F, G.textAlign), se = ae(G.x, G.y, G.rect, z + V.top + V.bottom, F, w?.manualLayout != null, q, G.textAlign, R + V.left + V.right, H.radians), J = i(e, se.x, se.y, H.radians, q, G.textBaseline, V);
	if (I) {
		le(e, I, J.x, J.y, q, G.textBaseline, w?.manualLayout ? Math.max(0, G.rect.w - V.left - V.right) : I.width), e.restore();
		return;
	}
	if (!(F.fontPaintAuthored === !0 && (F.fontHidden === !0 || F.fontColor == null))) {
		e.fillStyle = ne, e.textAlign = q, e.textBaseline = "middle";
		let t = N * 1.2, n = (F.fontBaseline ?? 0) * N, r = J.y - (L.length - 1) * t / 2 - n;
		L.forEach((n, i) => e.fillText(n, J.x, r + i * t));
	}
	e.restore();
}
function At(e, t, n) {
	let r = t.seriesDataLabels;
	return v(r, n) ? !1 : n?.text ? !0 : (n?.showVal ?? r?.showVal ?? e.showDataLabels) || (n?.showCatName ?? r?.showCatName ?? !1) || (n?.showSerName ?? r?.showSerName ?? !1) || (n?.showPercent ?? r?.showPercent ?? !1);
}
function jt(e, n, r, i, o, s) {
	let c = a(n, r.h, i);
	if (n.title) {
		e.font = `${n.titleFontBold === !1 ? "" : "bold "}${c.fontPx}px ${ht(n.titleFontFace)}`, e.fillStyle = n.titleFontColor ? `#${n.titleFontColor}` : "#111111", e.textAlign = "center", e.textBaseline = "top";
		let t = e.measureText(n.title).width, i = {
			x: r.x + (r.w - t) / 2,
			y: r.y + c.topPad,
			w: t,
			h: Math.max(1, c.fontPx)
		}, a = n.titleManualLayout ? u({
			...n.titleManualLayout,
			w: void 0,
			h: void 0
		}, r, i) : null;
		e.fillText(n.title, a ? a.x + a.w / 2 : r.x + r.w / 2, a?.y ?? i.y);
	}
	let l = $e(n);
	e.save();
	let d = (n.chartType === "pie" ? n.series[0]?.categories?.length ? n.series[0].categories : n.categories : n.series.map((e, t) => e.name || `Series ${t + 1}`)).flatMap((e, t) => l.get(t)?.deleted === !0 ? [] : [{
		label: e,
		index: t
	}]), p = d.map((e) => et(n, l.get(e.index), i)), m = Math.max(0, ...p.map((e) => e.fontPx)), g = d.map((t, n) => (e.font = p[n].font, 7 * i + 4 + e.measureText(t.label).width)), v = t(n, r.w, r.h, .23, {
		itemWidths: g,
		rowHeight: Math.max(m * 1.45, 12),
		itemGap: 12,
		horizontalPadding: 8,
		verticalPadding: 4
	});
	e.restore();
	let y = V(v, n.legendOverlay === !0), b = _(n, r.w, r.h, i), S = h(n.catAxisTitleTextVerticalInsetEmu, i), C = h(n.valAxisTitleTextVerticalInsetEmu, i), w = o === "horizontal" ? n.catAxisTitle ? b.catFontPx + S + f(r.w) + 4 : 0 : o === "vertical" ? b.valBandW : 0, T = o === "horizontal" ? n.valAxisTitle ? b.valFontPx + C + f(r.h) + 4 : 0 : o === "vertical" ? b.catBandH : 0, E = x(n, r.x, r.y, r.w, r.h, i, {
		titleBand: c,
		legendSideReserveFrac: .23,
		legendReserve: v,
		pad: {
			t: c.bandH + y.legTopH + r.h * .04,
			r: y.legRightW + r.w * .05,
			b: y.legBottomH + r.h * .19 + T,
			l: y.legLeftW + r.w * .13 + w
		},
		honorPlotAreaManualLayout: !0,
		manualOuterInsets: {
			t: c.bandH,
			r: y.legRightW,
			b: y.legBottomH + T,
			l: y.legLeftW + w
		}
	}), D = {
		x: E.plotRect.px0,
		y: E.plotRect.py0,
		w: Math.max(1, E.plotRect.pw),
		h: Math.max(1, E.plotRect.ph)
	};
	L(e, n, D.x, D.y, D.w, D.h, i, s);
	let O = v ? v.side === "r" ? {
		x: r.x + r.w - v.reserveW,
		y: D.y,
		w: v.reserveW,
		h: D.h
	} : v.side === "l" ? {
		x: r.x,
		y: D.y,
		w: v.reserveW,
		h: D.h
	} : v.side === "t" ? {
		x: r.x + 4,
		y: r.y + c.bandH,
		w: Math.max(1, r.w - 8),
		h: v.reserveH
	} : {
		x: r.x + 4,
		y: r.y + r.h - v.reserveH,
		w: Math.max(1, r.w - 8),
		h: v.reserveH
	} : null;
	return {
		plot: D,
		legend: (O && n.legendManualLayout ? u(n.legendManualLayout, r, O) : null) ?? O,
		legendMeasure: {
			labels: d.map((e) => e.label),
			styles: p,
			itemWidths: g
		}
	};
}
function Mt(e, t, n, r, i, a, o, s, c, l, d, f, m, h) {
	e.save(), e.font = `${l ? "italic " : ""}${c ? "bold " : ""}${a}px ${o}`, e.fillStyle = s ? `#${s}` : "#555";
	let g = m ? t : K(e, t, h), _ = p(i, d, f), v = r;
	if (m) {
		let t = e.measureText(g).width, i = Math.abs(Math.cos(_)), o = Math.abs(Math.sin(_)), s = {
			x: r.x - (t * i + a * o) / 2,
			y: r.y - (t * o + a * i) / 2,
			w: t * i + a * o,
			h: t * o + a * i
		}, c = u({
			...m,
			w: void 0,
			h: void 0
		}, n, s);
		c && (v = {
			x: c.x + c.w / 2,
			y: c.y + c.h / 2
		});
	}
	e.translate(v.x, v.y), _ && e.rotate(_), e.textAlign = "center", e.textBaseline = "middle", e.fillText(g, 0, 0), e.restore();
}
function Nt(e, t, n, r, i, a) {
	if (t.valAxisTitle) {
		let o = j(t.valAxisTitleFontSizeHpt, a), s = i ? "horizontal" : "left";
		Mt(e, t.valAxisTitle, n, i ? {
			x: r.x + r.w / 2,
			y: r.y + r.h + f(n.h) + o / 2
		} : {
			x: r.x - f(n.w) - o / 2,
			y: r.y + r.h / 2
		}, s, o, Q(t, t.valAxisTitleFontFace, "major"), t.valAxisTitleFontColor, t.valAxisTitleFontBold ?? !0, t.valAxisTitleFontItalic ?? !1, t.valAxisTitleRotation, t.valAxisTitleVerticalMode, t.valAxisTitleManualLayout, i ? r.w : r.h);
	}
	if (t.catAxisTitle) {
		let o = j(t.catAxisTitleFontSizeHpt, a), s = i ? "left" : "horizontal";
		Mt(e, t.catAxisTitle, n, i ? {
			x: r.x - f(n.w) - o / 2,
			y: r.y + r.h / 2
		} : {
			x: r.x + r.w / 2,
			y: r.y + r.h + f(n.h) + o / 2
		}, s, o, Q(t, t.catAxisTitleFontFace, "major"), t.catAxisTitleFontColor, t.catAxisTitleFontBold ?? !0, t.catAxisTitleFontItalic ?? !1, t.catAxisTitleRotation, t.catAxisTitleVerticalMode, t.catAxisTitleManualLayout, i ? r.h : r.w);
	}
}
function Pt(e, t, n, r, i, a, o, s, l, u, d) {
	let f = t.threeD?.seriesAxis;
	if (!f || f.hidden || t.threeD?.barGrouping !== "standard" || t.series.length === 0) return;
	let p = Xt(t, r, i, a, o, s, l), m = zt(r), h = l === "vertical" ? m.seriesAxisX : p.axisX, g = l === "horizontal" ? m.floorY === r.front.y ? r.front.y + r.front.h : r.front.y : m.floorY, _ = r.project(h, g, r.topology.nearDepth), v = r.project(h, g, r.topology.farDepth), y = Math.hypot(v.x - _.x, v.y - _.y);
	if (!(y > 1e-6)) return;
	let b = {
		x: (v.x - _.x) / y,
		y: (v.y - _.y) / y
	}, x = {
		x: -b.y,
		y: b.x
	}, S = r.project(r.front.x + r.front.w / 2, r.front.y + r.front.h / 2, .5), C = {
		x: (_.x + v.x) / 2,
		y: (_.y + v.y) / 2
	};
	(C.x - S.x) * x.x + (C.y - S.y) * x.y < 0 && (x = {
		x: -x.x,
		y: -x.y
	}), (f.tickLabelPos === "low" && x.y < 0 || f.tickLabelPos === "high" && x.y > 0) && (x = {
		x: -x.x,
		y: -x.y
	}), f.lineHidden || ($(e, Vt(f.lineColor, f.lineWidthEmu, f.lineDash, d)), e.beginPath(), e.moveTo(_.x, _.y), e.lineTo(v.x, v.y), e.stroke());
	let w = Math.max(1, Math.floor(f.tickMarkSkip ?? 1)), T = Math.max(1, Math.floor(f.tickLabelSkip ?? 1)), E = f.majorTickMark ?? "out", D = c(f.fontSizeHpt, d) ?? 9 * d;
	if (e.font = `${f.fontItalic ? "italic " : ""}${f.fontBold ? "bold " : ""}${D}px ${Q(t, f.fontFace)}`, e.fillStyle = f.fontColor ? `#${f.fontColor}` : "#595959", e.textAlign = Math.abs(x.x) < .2 ? "center" : x.x < 0 ? "right" : "left", e.textBaseline = Math.abs(x.y) < .2 ? "middle" : x.y < 0 ? "bottom" : "top", u && !f.lineHidden && E !== "none") {
		$(e, Ht(f.lineColor, f.lineWidthEmu, f.lineDash, d));
		let n = t.series.length;
		for (let t = 0; t <= n; t += w) {
			let i = t / n, a = f.orientation === "maxMin" ? 1 - i : i, o = r.project(h, g, a), s = 6 * d, c = E === "cross" ? s / 2 : E === "out" ? s : 0, l = E === "cross" ? s / 2 : E === "in" ? s : 0;
			e.beginPath(), e.moveTo(o.x + x.x * c, o.y + x.y * c), e.lineTo(o.x - x.x * l, o.y - x.y * l), e.stroke();
		}
	}
	for (let n = 0; n < t.series.length; n++) {
		let i = r.seriesDepth(n, t.series.length, !1), a = f.orientation === "maxMin" ? 1 - i : i, o = r.project(h, g, a);
		if (!u && !f.lineHidden && n % w === 0 && E !== "none") {
			let t = 6 * d, n = E === "cross" ? t / 2 : E === "out" ? t : 0, r = E === "cross" ? t / 2 : E === "in" ? t : 0;
			e.beginPath(), e.moveTo(o.x + x.x * n, o.y + x.y * n), e.lineTo(o.x - x.x * r, o.y - x.y * r), e.stroke();
		}
		f.tickLabelPos !== "none" && n % T === 0 && e.fillText(t.series[n].name || `Series ${n + 1}`, o.x + x.x * (6 * d + 3), o.y + x.y * (6 * d + 3));
	}
	if (e.setLineDash([]), f.title) {
		let i = j(f.titleFontSizeHpt, d);
		Mt(e, f.title, n, {
			x: C.x + x.x * (D + i + 12),
			y: C.y + x.y * (D + i + 12)
		}, "horizontal", i, Q(t, f.titleFontFace, "major"), f.titleFontColor, f.titleFontBold ?? !0, f.titleFontItalic ?? !1, f.titleRotation, f.titleVerticalMode, f.titleManualLayout, Math.max(r.front.w, r.front.h));
	}
}
function Ft(e, t, n, r, i, a, o, s) {
	if (t.lineHidden !== !0) {
		let s = t.lineWidthEmu == null ? Math.max(1, 2 * o) : Math.max(.5, t.lineWidthEmu / U * o);
		e.beginPath(), e.moveTo(r, i), e.lineTo(r + a, i), e.strokeStyle = t.lineColor ? `#${t.lineColor}` : J(n, .7), e.lineWidth = s, e.setLineDash(B(t.chartexStyle?.lineDash ?? "solid", s)), e.stroke(), e.setLineDash([]);
	}
	if (t.showMarker !== !0 || t.markerSymbol === "none") return;
	let c = t.markerSymbol ?? "circle", l = A(t, n.replace(/^#/, "")), u = l === "00000000" ? "transparent" : l.startsWith("#") ? l : `#${l}`, d = t.markerLine ?? t.lineColor ?? n.replace(/^#/, ""), f = d === "00000000" ? "rgba(0,0,0,0)" : d.startsWith("#") ? d : `#${d}`, p = t.markerLineWidthEmu == null ? Math.max(.75, o) : Math.max(.25, t.markerLineWidthEmu / U * o);
	Ot(e, {
		x: r + a / 2,
		y: i
	}, c, Math.min(a, Math.max(2, (t.markerSize ?? 5) * o)), u, f, p, E(t), s, o);
}
function It(e, t, n, r, i = !1, a, s = 0) {
	if (!n) return;
	F(e, t, n, r, s);
	let c = new Map(t.series[0]?.dataPointOverrides?.map((e) => [e.idx, e]) ?? []), l = i ? (t.series[0]?.categories?.length ? t.series[0].categories : t.categories).map((e, n) => {
		let r = t.series[0]?.dataPointColors?.[n];
		return {
			label: e,
			color: r === "00000000" ? "transparent" : r ? `#${r}` : st(n),
			series: t.series[0],
			point: c.get(n),
			sourceIndex: n
		};
	}) : t.series.map((e, t) => ({
		label: e.name || `Series ${t + 1}`,
		color: st(t, e),
		series: e,
		point: void 0,
		sourceIndex: t
	})), u = $e(t), d = l.filter((e) => u.get(e.sourceIndex)?.deleted !== !0), f = a != null && a.labels.length === d.length && a.labels.every((e, t) => e === d[t].label), p = f ? a.styles : d.map((e) => et(t, u.get(e.sourceIndex), r));
	e.textAlign = "left", e.textBaseline = "middle";
	let h = Math.max(Math.max(0, ...p.map((e) => e.fontPx)) * 1.45, 12), g = Math.min(7 * r, h * .7);
	if (t.legendPos === "t" || t.legendPos === "b" || t.legendManualLayout != null && n.w >= n.h) {
		let c = f ? a.itemWidths : d.map((t, n) => (e.font = p[n].font, g + 4 + e.measureText(t.label).width)), l = o(c, Math.max(1, n.w - 8), 12).slice(0, Math.max(0, Math.floor((n.h - 4 + 1e-6) / h))), u = n.y + 2 + h / 2;
		for (let a of l) {
			let o = a.map((e) => Math.min(n.w, c[e])), l = o.reduce((e, t) => e + t, 0) + Math.max(0, a.length - 1) * 12, f = n.x + Math.max(4, (n.w - l) / 2);
			for (let n = 0; n < a.length; n++) {
				let c = a[n], l = d[c], m = p[c];
				e.font = m.font;
				let h = Math.max(0, o[n] - g - 4);
				if (!i && t.chartType.toLowerCase().includes("line") && l.series) Ft(e, l.series, l.color, f, u, g, r, s);
				else {
					l.color !== "transparent" && (e.fillStyle = l.color, e.fillRect(f, u - g / 2, g, g));
					let t = l.point?.lineHidden ?? l.series?.lineHidden, n = l.point?.lineColor ?? l.series?.lineColor;
					t !== !0 && n && (e.strokeStyle = `#${n}`, e.lineWidth = (l.point?.lineWidthEmu ?? l.series?.lineWidthEmu) == null ? .75 * r : Math.max(.25, (l.point?.lineWidthEmu ?? l.series?.lineWidthEmu ?? 0) / U * r), e.setLineDash(B(l.point?.lineDash ?? l.series?.chartexStyle?.lineDash ?? "solid", e.lineWidth)), e.strokeRect(f, u - g / 2, g, g), e.setLineDash([]));
				}
				e.fillStyle = m.color, e.fillText(K(e, l.label, h), f + g + 4, u), f += o[n] + 12;
			}
			u += h;
		}
		return;
	}
	let _ = n.y;
	for (let a = 0; a < d.length; a++) {
		let o = d[a], c = p[a];
		e.font = c.font;
		let l = n.x + 8 + g, u = Math.max(0, n.x + n.w - 4 - l), f = Math.max(c.fontPx * 1.2, 10), v = m(o.label, u, f * (i ? 1 : 2), f, (t) => e.measureText(t).width);
		if (v.length === 0) continue;
		let y = Math.max(h, v.length * f + 2);
		if (_ + y > n.y + n.h + 1e-6) break;
		let b = _ + y / 2;
		if (!i && t.chartType.toLowerCase().includes("line") && o.series) Ft(e, o.series, o.color, n.x + 4, b, g, r, s);
		else {
			o.color !== "transparent" && (e.fillStyle = o.color, e.fillRect(n.x + 4, b - g / 2, g, g));
			let t = o.point?.lineHidden ?? o.series?.lineHidden, i = o.point?.lineColor ?? o.series?.lineColor;
			t !== !0 && i && (e.strokeStyle = `#${i}`, e.lineWidth = (o.point?.lineWidthEmu ?? o.series?.lineWidthEmu) == null ? .75 * r : Math.max(.25, (o.point?.lineWidthEmu ?? o.series?.lineWidthEmu ?? 0) / U * r), e.setLineDash(B(o.point?.lineDash ?? o.series?.chartexStyle?.lineDash ?? "solid", e.lineWidth)), e.strokeRect(n.x + 4, b - g / 2, g, g), e.setLineDash([]));
		}
		e.fillStyle = c.color;
		let x = b - (v.length - 1) * f / 2;
		v.forEach((t, n) => e.fillText(t, l, x + n * f)), _ += y;
	}
}
function Lt(e, t, n, r, i, a) {
	let o = i ? 100 : 1, s = e.valAxisMinorTickMark ?? "none";
	return G({
		dataMin: t,
		dataMax: n,
		explicitMin: e.valMin == null ? i ? t : null : e.valMin * o,
		explicitMax: e.valMax == null ? i ? n : null : e.valMax * o,
		majorUnit: e.valAxisMajorUnit == null ? null : e.valAxisMajorUnit * o,
		minorUnit: e.valAxisMinorUnit == null ? null : e.valAxisMinorUnit * o,
		axisLenPt: r,
		axisOrientation: a,
		logBase: e.valAxisLogBase,
		reversed: e.valAxisOrientation === "maxMin",
		needMinor: e.valAxisMinorGridlines === !0 || s !== "none"
	});
}
function Rt(e, t, n) {
	let r = e != null && Number.isFinite(e) ? (e % 360 + 360) % 360 : 0, i = Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0, a = Number.isFinite(n) ? Math.max(0, Math.min(1 - i, n)) : 0, o = Math.PI / 2 - (r * Math.PI / 180 + i * Math.PI * 2), s = o - a * Math.PI * 2;
	return {
		start: Math.min(o, s),
		end: Math.max(o, s),
		middle: (o + s) / 2,
		leading: o
	};
}
function zt(e) {
	let { front: t } = e, n = t.x, r = t.x + t.w, i = e.topology.farX === "min" ? n : r, a = i === n ? r : n, o = e.topology.axisY === "min" ? t.y : t.y + t.h, s = o === t.y ? t.y + t.h : t.y, { nearDepth: c, farDepth: l } = e.topology, u = e.project(n, o, c), d = e.project(r, o, c), f = e.project(r, o, l), p = e.project(n, o, l), m = e.project(n, s, l), h = e.project(r, s, l), g = e.project(i, o, c), _ = e.project(i, o, l), v = e.project(i, s, l), y = e.project(i, s, c);
	return {
		floor: [
			u,
			d,
			f,
			p
		],
		sideWall: [
			g,
			_,
			v,
			y
		],
		backWall: [
			p,
			f,
			h,
			m
		],
		sideX: i,
		seriesAxisX: a,
		floorY: o,
		oppositeFloorY: s,
		nearDepth: c,
		farDepth: l
	};
}
function Bt(e, t, n, r, i = "A6A6A6", a = .75) {
	let o = t != null && Number.isFinite(t) && t >= 0 ? Math.max(.25, t / U * r) : a * r;
	return {
		color: `#${e ?? i}`,
		width: o,
		dash: B(n ?? "solid", o)
	};
}
function Vt(e, t, n, r) {
	let i = Bt(e, t, n, r, "898989", 1);
	if (t == null || !Number.isFinite(t) || t < 0) return i;
	let a = t / U * r;
	if (!(a > 0)) return i;
	let o = a;
	return {
		...i,
		width: o,
		dash: B(n ?? "solid", o)
	};
}
function Ht(e, t, n, r) {
	return Vt(e, t, n, r);
}
function $(e, t) {
	e.strokeStyle = t.color, e.lineWidth = t.width, e.setLineDash(t.dash);
}
function Ut(e, t, n, i, a, o, s, c, u) {
	let { front: d } = n, f = d.x, p = d.x + d.w, m = zt(n), { sideX: h, floorY: g, oppositeFloorY: _, nearDepth: v, farDepth: y } = m, x = Xt(t, n, i, o, s, c, a), S = [], C = t.catAxisLinePaintAuthored === !0, w = t.valAxisLinePaintAuthored === !0, E = a === "vertical" ? C && !t.catAxisHidden && !t.catAxisLineHidden : w && !t.valAxisHidden && !t.valAxisLineHidden, D = a === "vertical" ? w && !t.valAxisHidden && !t.valAxisLineHidden : C && !t.catAxisHidden && !t.catAxisLineHidden;
	E && S.push([x.horizontalStart, x.horizontalEnd]), D && S.push([x.verticalStart, x.verticalEnd]);
	let k = t.threeD?.seriesAxis, ee = k?.linePaintAuthored === !0;
	if (k && !k.hidden && !k.lineHidden && ee && t.threeD?.barGrouping === "standard" && t.series.length > 0) {
		let e = a === "vertical" ? m.seriesAxisX : x.axisX, t = a === "horizontal" ? g === n.front.y ? n.front.y + n.front.h : n.front.y : g;
		S.push([n.project(e, t, v), n.project(e, t, y)]);
	}
	let A = (e, t) => Math.hypot(e.x - t.x, e.y - t.y) <= 1e-6, j = (e, t) => S.some(([n, r]) => A(e, n) && A(t, r) || A(e, r) && A(t, n)), M = (e, t) => {
		let r = q(n, e, t?.thicknessPercent), i = r.faces.map((e, t) => ({
			scenePoints: e,
			faceIndex: t
		})).filter(({ scenePoints: e }) => r.thickness === 0 || n.cameraFacing(e)).map(({ scenePoints: e, faceIndex: t }) => ({
			faceIndex: t,
			scenePoints: e,
			points: e.map((e) => n.projectUnbounded(e.x, e.y, e.depth)),
			depth: e.reduce((e, t) => e + n.cameraDepth(t.x, t.y, t.depth), 0) / e.length
		})).sort((e, t) => e.depth - t.depth);
		return {
			slab: r,
			faces: i,
			visibleFaceIndices: new Set(i.map((e) => e.faceIndex))
		};
	}, N = M("floor", t.threeD?.floor), P = M("sideWall", t.threeD?.sideWall), F = M("backWall", t.threeD?.backWall), te = N.faces, ne = P.faces, I = F.faces, L = (a, o, s, c) => {
		let l = b(t, o, s), u = a.faces;
		if (!l.fill || !u.length) return;
		if (l.fill.fillType === "image") {
			let t = r(l.fill);
			if (!t) return;
			de(e, l.fill, t, o, c, a.slab, a.faces.map((e) => e.faceIndex), (e) => n.projectUnbounded(e.x, e.y, e.depth), i.max - i.min);
			return;
		}
		let d = u.flatMap((e) => e.points), f = Math.min(...d.map((e) => e.x)), p = Math.max(...d.map((e) => e.x)), m = Math.min(...d.map((e) => e.y)), h = Math.max(...d.map((e) => e.y)), g = l.fill.fillType === "solid" ? `#${l.fill.color}` : z(l.fill, e, f, m, p - f, h - m);
		if (g) for (let t of u) t.points.length < 3 || (gt(e, t.points), e.fillStyle = g, e.fill());
	};
	L(N, t.threeD?.floor, "floor", "floor"), L(P, t.threeD?.sideWall, "wall", "sideWall"), L(F, t.threeD?.backWall, "wall", "backWall");
	let R = (t, r, i, a, o = !0) => {
		for (let s of me(t.slab, r, i, a)) {
			if (!o && s.faceIndex !== 0 || !t.visibleFaceIndices.has(s.faceIndex)) continue;
			let [r, i] = s.scenePoints.map((e) => n.projectUnbounded(e.x, e.y, e.depth));
			e.beginPath(), e.moveTo(r.x, r.y), e.lineTo(i.x, i.y), e.stroke();
		}
	}, re = (t, r, o) => {
		$(e, r);
		for (let r of t) {
			let t = i.fraction(r);
			if (o) {
				a === "horizontal" ? (R(N, "floor", "x", t), R(F, "backWall", "x", t)) : (R(P, "sideWall", "y", t), R(F, "backWall", "y", t));
				continue;
			}
			if (a === "horizontal") {
				let r = d.x + t * d.w, i = n.project(r, g, y), a = n.project(r, _, y);
				e.beginPath(), e.moveTo(i.x, i.y), e.lineTo(a.x, a.y), e.stroke();
			} else {
				let r = d.y + d.h - t * d.h, i = n.project(h, r, v), a = n.project(h, r, y), o = n.project(h === f ? p : f, r, y);
				e.beginPath(), e.moveTo(i.x, i.y), e.lineTo(a.x, a.y), e.stroke(), e.beginPath(), e.moveTo(a.x, a.y), e.lineTo(o.x, o.y), e.stroke();
			}
		}
	};
	t.valAxisMinorGridlines === !0 && re(i.minorTicks, Bt(t.valAxisMinorGridlineColor, t.valAxisMinorGridlineWidthEmu, t.valAxisMinorGridlineDash, u, "D9D9D9", .5), !0), t.valAxisMajorGridlines === !0 && re(i.majorTicks, Bt(t.valAxisGridlineColor, t.valAxisGridlineWidthEmu, t.valAxisGridlineDash, u, "898989", 1), !0);
	let B = (t, n) => {
		$(e, n);
		for (let e of t) a === "vertical" ? (R(N, "floor", "x", e), R(F, "backWall", "x", e)) : (R(P, "sideWall", "y", e), R(F, "backWall", "y", e));
	};
	t.catAxisMinorGridlines === !0 && B(T(o, s), Bt(t.catAxisMinorGridlineColor, t.catAxisMinorGridlineWidthEmu, t.catAxisMinorGridlineDash, u, "E0E0E0", .5)), t.catAxisMajorGridlines === !0 && B(l(o, s), Bt(t.catAxisGridlineColor, t.catAxisGridlineWidthEmu, t.catAxisGridlineDash, u, "E0E0E0", .5));
	let ie = (n, r, i) => {
		if (!n.length) return;
		let a = b(t, r, i);
		if (a.line === null) return;
		let o = a.line ?? {
			fillType: "solid",
			color: "898989"
		}, s = n.flatMap((e) => e.points), c = Math.min(...s.map((e) => e.x)), l = Math.max(...s.map((e) => e.x)), d = Math.min(...s.map((e) => e.y)), f = Math.max(...s.map((e) => e.y)), p = o.fillType === "solid" ? `#${o.color}` : z(o, e, c, d, l - c, f - d);
		if (!p) return;
		let m = a.lineWidthEmu == null ? u : Math.max(.25, a.lineWidthEmu / U * u);
		e.strokeStyle = p, e.lineWidth = m, e.setLineDash(O(a.lineCustomDash, a.lineDash, m)), e.lineCap = a.lineCap === "rnd" ? "round" : a.lineCap === "sq" ? "square" : "butt", e.lineJoin = a.lineJoin === "round" || a.lineJoin === "bevel" ? a.lineJoin : "miter";
		for (let t of n) {
			if (t.points.length < 2) continue;
			let n = t.points.map((e, n) => ({
				start: e,
				end: t.points[(n + 1) % t.points.length]
			}));
			if (n.some((e) => j(e.start, e.end))) {
				for (let t of n) j(t.start, t.end) || (e.beginPath(), e.moveTo(t.start.x, t.start.y), e.lineTo(t.end.x, t.end.y), e.stroke());
				continue;
			}
			e.beginPath(), e.moveTo(t.points[0].x, t.points[0].y);
			for (let n = 1; n < t.points.length; n++) e.lineTo(t.points[n].x, t.points[n].y);
			e.lineTo(t.points[0].x, t.points[0].y), e.closePath(), e.stroke();
		}
	};
	ie(te, t.threeD?.floor, "floor"), ie(ne, t.threeD?.sideWall, "wall"), ie(I, t.threeD?.backWall, "wall"), e.setLineDash([]);
}
function Wt(e, t, n, r, i, a, o, s, c) {
	let l = Xt(t, n, r, i, a, o, c), u = c === "vertical" ? !t.catAxisHidden && !t.catAxisLineHidden : !t.valAxisHidden && !t.valAxisLineHidden, d = c === "vertical" ? !t.valAxisHidden && !t.valAxisLineHidden : !t.catAxisHidden && !t.catAxisLineHidden;
	u && ($(e, Vt(c === "vertical" ? t.catAxisLineColor : t.valAxisLineColor, c === "vertical" ? t.catAxisLineWidthEmu : t.valAxisLineWidthEmu, c === "vertical" ? t.catAxisLineDash : t.valAxisLineDash, s)), e.beginPath(), e.moveTo(l.horizontalStart.x, l.horizontalStart.y), e.lineTo(l.horizontalEnd.x, l.horizontalEnd.y), e.stroke()), d && ($(e, Vt(c === "vertical" ? t.valAxisLineColor : t.catAxisLineColor, c === "vertical" ? t.valAxisLineWidthEmu : t.catAxisLineWidthEmu, c === "vertical" ? t.valAxisLineDash : t.catAxisLineDash, s)), e.beginPath(), e.moveTo(l.verticalStart.x, l.verticalStart.y), e.lineTo(l.verticalEnd.x, l.verticalEnd.y), e.stroke()), e.setLineDash([]);
}
function Gt(e, t, n, r) {
	let i = {
		x: (e.x + t.x) / 2,
		y: (e.y + t.y) / 2
	};
	return r === "horizontal" ? {
		x: i.x <= n.x ? -1 : 1,
		y: 0
	} : {
		x: 0,
		y: i.y <= n.y ? -1 : 1
	};
}
function Kt(e, t, n, r, i, a, o, s, c) {
	if (!t || t === "none") return;
	let l = Gt(r, i, a, o), u = qt(s, c), d = t === "cross" ? u / 2 : u, f = t === "out" || t === "cross" ? d : 0, p = t === "in" || t === "cross" ? d : 0;
	e.beginPath(), e.moveTo(n.x + l.x * f, n.y + l.y * f), e.lineTo(n.x - l.x * p, n.y - l.y * p), e.stroke();
}
function qt(e, t) {
	return (e === "minor" ? 4 : 6) * t;
}
function Jt(e, t, n) {
	if (e !== "out" && e !== "cross") return 0;
	let r = qt(t, n);
	return e === "cross" ? r / 2 : r;
}
function Yt(e, t, n, r) {
	if (t) return r;
	let i = Jt(e, "major", n);
	return Math.max(r, i + 3 * n);
}
function Xt(e, t, n, r, i, a, o) {
	let { front: s } = t, c = (e) => Math.max(0, Math.min(1, e)), l = t.topology.axisX === "min" ? s.x : s.x + s.w, u = t.topology.axisY === "min" ? s.y : s.y + s.h, d = () => {
		if (e.catAxisCrossesAt != null && Number.isFinite(e.catAxisCrossesAt)) {
			let t = e.chartType.endsWith("Pct") ? e.catAxisCrossesAt * 100 : e.catAxisCrossesAt;
			return c(n.fraction(t));
		}
		let t = e.catAxisCrosses ?? "autoZero";
		return c(t === "min" ? n.fraction(n.min) : t === "max" ? n.fraction(n.max) : n.fraction(0));
	}, f = () => {
		let t = e.valAxisCrossesAt;
		if (t != null && Number.isFinite(t)) return g(t - 1, r, i, a);
		let n = e.valAxisCrosses;
		if (n !== "min" && n !== "max") return null;
		let o = +(n === "max");
		return a ? 1 - o : o;
	}, p = d(), m = f(), h = o === "horizontal" ? s.x + p * s.w : m == null ? l : s.x + m * s.w, _ = o === "vertical" ? s.y + s.h - p * s.h : m == null ? u : s.y + m * s.h, v = t.topology.nearDepth;
	return {
		axisX: h,
		axisY: _,
		depth: v,
		horizontalStart: t.project(s.x, _, v),
		horizontalEnd: t.project(s.x + s.w, _, v),
		verticalStart: t.project(h, s.y + s.h, v),
		verticalEnd: t.project(h, s.y, v)
	};
}
function Zt(e, t, n, r, i, a, o, s, c, u) {
	let { front: d } = n, f = Xt(t, n, r, i, a, o, s), { axisX: p, axisY: m, depth: h } = f, _ = n.project(d.x + d.w / 2, d.y + d.h / 2, h), v = t.valAxisMinorTickMark ?? "none", y = c ? Ht : Vt;
	if (!t.valAxisHidden && !t.valAxisLineHidden) {
		$(e, y(t.valAxisLineColor, t.valAxisLineWidthEmu, t.valAxisLineDash, u));
		let i = (e) => s === "horizontal" ? n.project(d.x + r.fraction(e) * d.w, m, h) : n.project(p, d.y + d.h - r.fraction(e) * d.h, h), a = s === "horizontal" ? f.horizontalStart : f.verticalStart, o = s === "horizontal" ? f.horizontalEnd : f.verticalEnd;
		for (let n of r.majorTicks) Kt(e, t.valAxisMajorTickMark, i(n), a, o, _, s === "vertical" ? "horizontal" : "vertical", "major", u);
		for (let t of r.minorTicks) Kt(e, v, i(t), a, o, _, s === "vertical" ? "horizontal" : "vertical", "minor", u);
	}
	if (!t.catAxisHidden && !t.catAxisLineHidden) {
		$(e, y(t.catAxisLineColor, t.catAxisLineWidthEmu, t.catAxisLineDash, u));
		let r = s === "vertical" ? f.horizontalStart : f.verticalStart, v = s === "vertical" ? f.horizontalEnd : f.verticalEnd, b = Math.max(1, Math.floor(t.catAxisTickMarkSkip ?? 1)), x = (i) => {
			let a = s === "vertical" ? n.project(d.x + i * d.w, m, h) : n.project(p, d.y + i * d.h, h);
			Kt(e, t.catAxisMajorTickMark, a, r, v, _, s === "vertical" ? "vertical" : "horizontal", "major", u);
		};
		if (c) {
			let e = l(i, a);
			for (let t = 0; t < e.length; t += b) x(o ? 1 - e[t] : e[t]);
		} else for (let e = 0; e < i; e += b) x(g(e, i, a, o));
		let S = t.catAxisMinorUnit;
		if (t.catAxisMinorTickMark && t.catAxisMinorTickMark !== "none" && S != null && Number.isFinite(S) && S > 0) {
			let c = t.catAxisMajorUnit != null && Number.isFinite(t.catAxisMajorUnit) && t.catAxisMajorUnit > 0 ? t.catAxisMajorUnit : b, l = Math.min(512, Math.ceil(i / S));
			for (let f = 1; f < l; f++) {
				let l = f * S;
				if (!(l < i)) break;
				if (Math.abs(l / c - Math.round(l / c)) < 1e-9) continue;
				let y = g(l, i, a, o), b = s === "vertical" ? n.project(d.x + y * d.w, m, h) : n.project(p, d.y + y * d.h, h);
				Kt(e, t.catAxisMinorTickMark, b, r, v, _, s === "vertical" ? "vertical" : "horizontal", "minor", u);
			}
		}
	}
	e.setLineDash([]);
}
function Qt(e, t, n, r, i) {
	if (!t.threeD) return !1;
	let a = t.chartType === "clusteredBar" || t.chartType === "clusteredBarH" || t.chartType.startsWith("stackedBar"), o = t.chartType.endsWith("H") || t.chartType.includes("BarH"), s = t.chartType.startsWith("stacked"), l = a && !s && t.threeD.barGrouping === "standard", { plot: u, legend: d, legendMeasure: f } = jt(e, t, n, r, o ? "horizontal" : "vertical", i), p = ue(t.threeD, u, {
		sceneDepthScale: a ? l ? .65 : .1 : .4,
		perspectiveTangentGain: l ? 1 : 2,
		sceneHeightScale: !a && !(t.threeD.heightPercentAuthored ?? t.threeD.heightPercent != null) ? 1 / 3 : void 0
	});
	if (!p) return !0;
	p = pe(p, t.threeD, u);
	let m = t.chartType.endsWith("Pct"), h = t.series.find((e) => (e.categories?.length ?? 0) > 0)?.categories ?? t.categories, _ = Math.max(1, h.length, ...t.series.map((e) => e.values.length)), v = m ? lt(t, _) : void 0, y = t.catAxisOrientation === "maxMin", b = t.catAxisCrossBetween === "between", x = t.dispBlanksAs ?? "gap", S = t.valAxisLogBase != null && Number.isFinite(t.valAxisLogBase) && t.valAxisLogBase >= 2, w = (e, n) => {
		let r = t.series[e]?.values[n];
		return r != null && Number.isFinite(r) && (!S || r > 0) || r == null && (s || x === "zero");
	}, T = (e, n) => ut(t, e, n, v), E = 0, k = 0;
	if (s) {
		for (let e = 0; e < _; e++) {
			let n = 0, r = 0;
			for (let i = 0; i < t.series.length; i++) {
				let t = T(i, e);
				t >= 0 ? n = X(n, t) : r = X(r, t);
			}
			E = Math.min(E, r), k = Math.max(k, n);
		}
		m && (E = E < 0 ? -100 : 0, k = k > 0 ? 100 : 0, E === 0 && k === 0 && (k = 1));
	} else {
		let e = ve(t.series.flatMap((e) => e.values).filter((e) => e != null && Number.isFinite(e) && (!S || e > 0)), S ? {
			min: 1,
			max: 10
		} : {
			min: 0,
			max: 1
		});
		E = S ? e.min : Math.min(0, e.min), k = S ? e.max : Math.max(0, e.max);
	}
	let A = o ? p.project(p.front.x, p.topology.axisY === "min" ? p.front.y : p.front.y + p.front.h, p.topology.nearDepth) : p.project(p.topology.axisX === "min" ? p.front.x : p.front.x + p.front.w, p.front.y, p.topology.nearDepth), j = o ? p.project(p.front.x + p.front.w, p.topology.axisY === "min" ? p.front.y : p.front.y + p.front.h, p.topology.nearDepth) : p.project(p.topology.axisX === "min" ? p.front.x : p.front.x + p.front.w, p.front.y + p.front.h, p.topology.nearDepth), M = Math.hypot(j.x - A.x, j.y - A.y) / r, F = Lt(t, E, k, M, m, o ? "horizontal" : "vertical"), L = (e) => Number.isFinite(e) ? Math.max(F.min, Math.min(F.max, e)) : F.min;
	a || Ut(e, t, p, F, o ? "horizontal" : "vertical", _, b, y, r);
	let { front: R } = p, z = Math.max(1, t.series.length), re = [], B = t.series.map((e) => new Map(e.dataPointOverrides?.map((e) => [e.idx, e]) ?? [])), ie = t.series.map((e) => new Map(e.dataLabelOverrides?.map((e) => [e.idx, e]) ?? []));
	if (a) {
		let a = p.prismInterval(0, 1, !0), c = [], u = Array(_).fill(0), d = Array(_).fill(0), f = (o ? R.h : R.w) / _, h = t.barGapWidth != null && Number.isFinite(t.barGapWidth) && t.barGapWidth >= 0 ? t.barGapWidth : 150;
		for (let e = 0; e < t.series.length; e++) {
			let n = t.series[e], i = l ? p.prismInterval(e, z, !1) : a, g = ge(f, h, l ? 0 : e, l ? 1 : z, s || l);
			for (let a = 0; a < _; a++) {
				if (!w(e, a)) continue;
				let l = T(e, a), p = Z(t, n, B[e].get(a), a, e), h = p.fill === null ? "transparent" : p.color, v = p.lineFill !== null && (p.lineColor != null || p.lineFill !== void 0), b = s ? l >= 0 ? u[a] : d[a] : 0, x = X(b, l);
				s && (l >= 0 ? u[a] = x : d[a] = x);
				let C = L(b), E = L(x), D = n.threeDShape ?? t.threeD.shape ?? "box", O = D === "cone" || D === "pyramid", k = D === "coneToMax" || D === "pyramidToMax", ee = (e) => {
					if (!O) return 1;
					let t = S && !(b > 0) ? F.min : b, n = F.fraction(t), r = F.fraction(x), i = F.fraction(e), a = r - n;
					return a === 0 || !Number.isFinite(a) || !Number.isFinite(i - n) ? +(e === t) : Math.max(0, Math.min(1, 1 - (i - n) / a));
				}, A = (e) => {
					if (!k) return 1;
					let t = x >= b ? F.max : F.min, n = S ? F.min : 0, r = F.fraction(t), i = F.fraction(n), a = F.fraction(e), o = Math.abs(r - i);
					return !(o > 0) || ![
						r,
						i,
						a
					].every(Number.isFinite) ? se(e, F.min, F.max) : Math.max(0, Math.min(1, Math.abs(r - a) / o));
				}, j = k ? A(C) : ee(C), M = k ? A(E) : ee(E);
				if (o) {
					let t = R.x + F.fraction(C) * R.w, n = R.x + F.fraction(E) * R.w, o = y ? _ - 1 - a : a, s = R.y + o * f + g.offset;
					c.push({
						x: Math.min(t, n),
						y: s,
						width: Math.abs(n - t),
						height: g.size,
						nearDepth: i.near,
						farDepth: i.far,
						categoryIndex: a,
						seriesIndex: e,
						color: h,
						fillPaint: p.fill,
						lineFill: p.lineFill,
						shape: D,
						baseCoord: t,
						endCoord: n,
						baseScale: j,
						endScale: M,
						omitBaseCap: !1,
						omitEndCap: !1,
						outline: v,
						outlineColor: p.lineColor ?? "rgba(0,0,0,0.42)",
						outlineWidth: p.lineWidthEmu == null ? .75 * r / H : at(p.lineWidthEmu, r),
						outlineDash: p.lineDash ?? "solid",
						outlineCustomDash: p.lineCustomDash,
						outlineCap: p.lineCap,
						outlineJoin: p.lineJoin,
						labelValue: m ? l / 100 : l,
						plottedLabelValue: x
					});
				} else {
					let t = R.y + R.h - F.fraction(C) * R.h, n = R.y + R.h - F.fraction(E) * R.h, o = y ? _ - 1 - a : a, s = R.x + o * f + g.offset;
					c.push({
						x: s,
						y: Math.min(t, n),
						width: g.size,
						height: Math.abs(n - t),
						nearDepth: i.near,
						farDepth: i.far,
						categoryIndex: a,
						seriesIndex: e,
						color: h,
						fillPaint: p.fill,
						lineFill: p.lineFill,
						shape: D,
						baseCoord: t,
						endCoord: n,
						baseScale: j,
						endScale: M,
						omitBaseCap: !1,
						omitEndCap: !1,
						outline: v,
						outlineColor: p.lineColor ?? "rgba(0,0,0,0.42)",
						outlineWidth: p.lineWidthEmu == null ? .75 * r / H : at(p.lineWidthEmu, r),
						outlineDash: p.lineDash ?? "solid",
						outlineCustomDash: p.lineCustomDash,
						outlineCap: p.lineCap,
						outlineJoin: p.lineJoin,
						labelValue: m ? l / 100 : l,
						plottedLabelValue: x
					});
				}
			}
		}
		if (s) {
			let e = ot(c, _);
			for (let t = 0; t < _; t++) {
				let n = e[t];
				for (let e of [-1, 1]) {
					let t = n.filter((t) => Math.sign(t.labelValue) === e && !_t(t.color) && Math.abs(t.endCoord - t.baseCoord) > 1e-9).sort((e, t) => e.seriesIndex - t.seriesIndex);
					for (let e = 0; e + 1 < t.length; e++) {
						let n = t[e], r = t[e + 1], i = 1e-8 * Math.max(1, Math.abs(n.endCoord), Math.abs(r.baseCoord));
						n.shape !== r.shape || Math.abs(n.endCoord - r.baseCoord) > i || Math.abs(n.endScale - r.baseScale) > 1e-9 || n.nearDepth !== r.nearDepth || n.farDepth !== r.farDepth || (n.omitEndCap = !0, r.omitBaseCap = !0);
					}
				}
				let r = n.find((e) => e.labelValue > 0 && !_t(e.color)), i = n.find((e) => e.labelValue < 0 && !_t(e.color));
				if (r && i) {
					let e = 1e-8 * Math.max(1, Math.abs(r.baseCoord), Math.abs(i.baseCoord));
					r.shape === i.shape && Math.abs(r.baseCoord - i.baseCoord) <= e && Math.abs(r.baseScale - i.baseScale) <= 1e-9 && r.nearDepth === i.nearDepth && r.farDepth === i.farDepth && (r.omitBaseCap = !0, i.omitBaseCap = !0);
				}
			}
		}
		Ut(e, t, p, F, o ? "horizontal" : "vertical", _, b, y, r);
		let g = {
			remaining: Le,
			exceeded: !1
		}, v = c.flatMap((t) => {
			let n = bt(p, t.shape, o, t.x, t.y, t.width, t.height, t.baseCoord, t.endCoord, t.nearDepth, t.farDepth, t.color, t.baseScale, t.endScale, t.omitBaseCap, t.omitEndCap, t.outline && t.outlineColor ? {
				color: t.outlineColor,
				width: t.outlineWidth,
				dash: O(t.outlineCustomDash, t.outlineDash, t.outlineWidth),
				cap: t.outlineCap,
				join: t.outlineJoin
			} : void 0, g);
			return wt(e, n, "fill", t.fillPaint, i), wt(e, n, "outline", t.lineFill, i), n;
		});
		if (g.exceeded) return Tt(e, n), !0;
		for (let t of Ie(v)) Ct(e, t);
		for (let a of c) {
			let s = t.series[a.seriesIndex], c = o ? p.project(a.endCoord, a.y + a.height / 2, (a.nearDepth + a.farDepth) / 2) : p.project(a.x + a.width / 2, a.endCoord, (a.nearDepth + a.farDepth) / 2), l = ie[a.seriesIndex].get(a.categoryIndex);
			At(t, s, l) && re.push(() => kt(e, t, s, a.seriesIndex, a.categoryIndex, a.labelValue, c, n, r, 0, void 0, l, "t", c, !0, t.valAxisDisplayUnits, F.max, a.plottedLabelValue, i));
		}
	} else {
		let a = t.series.map(() => Array(_).fill(0)), o = t.series.map(() => Array(_).fill(0));
		if (s) {
			let e = Array(_).fill(0), n = Array(_).fill(0);
			for (let r = 0; r < t.series.length; r++) for (let t = 0; t < _; t++) {
				let i = T(r, t), s = i >= 0 ? e[t] : n[t];
				a[r][t] = s, o[r][t] = X(s, i), i >= 0 ? e[t] = X(e[t], i) : n[t] = X(n[t], i);
			}
		}
		let c = (e) => {
			let t = p.seriesDepth(e, z, s), n = 0, r = 0;
			for (let i = 0; i < _; i++) {
				if (!w(e, i)) continue;
				let a = s ? o[e][i] : T(e, i), c = R.x + g(i, _, b, y) * R.w, l = R.y + R.h - F.fraction(L(a)) * R.h;
				n += p.cameraDepth(c, l, t), r++;
			}
			return r > 0 ? n / r : -Infinity;
		}, l = t.series.map((e, t) => t).sort((e, t) => c(e) - c(t) || t - e), u = t.series.map((e, n) => Z(t, e, void 0, n, n)), d = [], f = [], h = !1;
		for (let c of l) {
			if (h) break;
			let l = t.series[c], v = u[c], S = v.fill === null ? "transparent" : v.color, C = s ? p.prismInterval(0, 1, !0) : p.prismInterval(c, z, !1), E = R.x + R.w / 2, D = R.y + R.h / 2, k = p.cameraDepth(E, D, C.near) >= p.cameraDepth(E, D, C.far) ? C.near : C.far, A = [], j = [], M = [], ne = [], L = [], ae = [], V = [], H = [], W = [], G = [];
			for (let e = 0; e < _; e++) {
				if (!w(c, e)) {
					A.push(null), j.push(null), M.push(null), ne.push(null), L.push(null), ae.push(null), V.push(null), H.push(null), W.push(null), G.push(null);
					continue;
				}
				let n = s ? o[c][e] : T(c, e), r = s ? a[c][e] : 0, i = R.x + g(e, _, b, y) * R.w, l = F.fraction(n), u = F.fraction(r), d = Number.isFinite(u) ? u : r <= F.min ? 0 : 1, f = Number.isFinite(l) && l >= 0 && l <= 1, m = Number.isFinite(l) ? Math.max(0, Math.min(1, l)) : n <= F.min ? 0 : 1, h = R.y + R.h - m * R.h, v = R.y + R.h - Math.max(0, Math.min(1, d)) * R.h;
				A.push(t.chartType.toLowerCase().includes("area") || f ? p.project(i, h, k) : null), j.push(p.project(i, v, k)), M.push(f ? p.cameraDepth(i, h, k) : null), ne.push(p.cameraDepth(i, v, k)), L.push(n), ae.push(i), V.push(h), H.push(v), W.push(l), G.push(d);
			}
			let oe = [], K = null;
			for (let e = 0; e < A.length; e++) {
				let t = A[e], n = j[e];
				if (!t || !n) {
					x === "gap" && (K && oe.push(K), K = null);
					continue;
				}
				K ??= {
					upper: [],
					lower: [],
					upperDepths: [],
					lowerDepths: [],
					indices: [],
					sceneXs: [],
					upperYs: [],
					lowerYs: [],
					upperFractions: [],
					lowerFractions: []
				}, K.upper.push(t), K.lower.push(n), K.upperDepths.push(M[e] ?? 0), K.lowerDepths.push(ne[e] ?? 0), K.indices.push(e), K.sceneXs.push(ae[e] ?? 0), K.upperYs.push(V[e] ?? 0), K.lowerYs.push(H[e] ?? 0), K.upperFractions.push(W[e] ?? 0), K.lowerFractions.push(G[e] ?? 0);
			}
			K && oe.push(K);
			let q = [], se = [];
			if (t.chartType.toLowerCase().includes("area")) {
				for (let t of oe) {
					let n = null;
					for (let r = 0; r + 1 < t.upper.length; r++) {
						let i = Ae(t.lowerFractions[r], t.lowerFractions[r + 1], t.upperFractions[r], t.upperFractions[r + 1]);
						for (let a = 0; a < i.length; a++) {
							let o = i[a], s = t.sceneXs[r] + (t.sceneXs[r + 1] - t.sceneXs[r]) * o.startT, c = t.sceneXs[r] + (t.sceneXs[r + 1] - t.sceneXs[r]) * o.endT, l = R.y + R.h - o.lowerStart * R.h, u = R.y + R.h - o.lowerEnd * R.h, f = R.y + R.h - o.upperStart * R.h, m = R.y + R.h - o.upperEnd * R.h, g = {
								...p.project(s, f, k),
								cameraDepth: p.cameraDepth(s, f, k),
								cameraWeight: p.cameraProjectionWeight(s, f, k)
							}, _ = {
								...p.project(c, m, k),
								cameraDepth: p.cameraDepth(c, m, k),
								cameraWeight: p.cameraProjectionWeight(c, m, k)
							};
							n != null && Math.hypot(n.at(-1).x - g.x, n.at(-1).y - g.y) <= 1e-8 ? n.push(_) : (n && n.length >= 2 && q.push(n), n = [g, _]);
							let v = yt(p, s, c, l, u, f, m, C.near, C.far, S, r === 0 && a === 0 && o.startT === 0, r + 2 === t.upper.length && a + 1 === i.length && o.endT === 1);
							for (let t of v) {
								if (d.length >= 1e4) {
									h = !0;
									break;
								}
								d.push({
									points: t.points,
									cameraDepth: t.cameraDepth,
									cameraDepths: t.cameraDepths,
									cameraWeights: t.cameraWeights,
									layer: 0,
									paint: () => Ct(e, t)
								}), se.push(t);
							}
							if (h) break;
						}
						if (h) break;
					}
					if (n && n.length >= 2 && q.push(n), h) break;
				}
				wt(e, se, "fill", v.fill, i);
			}
			let ce = [];
			if (!t.chartType.toLowerCase().includes("area")) {
				let e = [], t = null;
				for (let n = 0; n < _; n++) {
					let r = L[n], i = r == null ? NaN : F.fraction(r);
					if (r == null || !Number.isFinite(i)) {
						x === "gap" && t && (e.push(t), t = null);
						continue;
					}
					t ??= [], t.push({
						x: R.x + g(n, _, b, y) * R.w,
						fraction: i,
						ownerIndex: n
					});
				}
				t && e.push(t);
				let n = (e) => {
					let t = Math.max(0, Math.min(1, e.fraction)), n = R.y + R.h - t * R.h;
					return {
						...p.project(e.x, n, k),
						cameraDepth: p.cameraDepth(e.x, n, k),
						cameraWeight: p.cameraProjectionWeight(e.x, n, k)
					};
				}, r = (e) => {
					e && e.path.length >= 2 && ce.push(e);
				};
				for (let t of e) {
					if (t.length < 2) continue;
					let e = [t[0]];
					for (let n = 0; n + 1 < t.length; n++) {
						let r = t[n - 1] ?? t[n], i = t[n], a = t[n + 1], o = t[n + 2] ?? a;
						if (l.smooth !== !0 || t.length < 3) {
							e.push(a);
							continue;
						}
						let s = {
							x: i.x + (a.x - r.x) / 6,
							fraction: i.fraction + (a.fraction - r.fraction) / 6
						}, c = {
							x: a.x - (o.x - i.x) / 6,
							fraction: a.fraction - (o.fraction - i.fraction) / 6
						};
						for (let t = 1; t <= 12; t++) {
							let n = t / 12, r = 1 - n;
							e.push({
								x: r * r * r * i.x + 3 * r * r * n * s.x + 3 * r * n * n * c.x + n * n * n * a.x,
								fraction: r * r * r * i.fraction + 3 * r * r * n * s.fraction + 3 * r * n * n * c.fraction + n * n * n * a.fraction,
								ownerIndex: a.ownerIndex
							});
						}
					}
					let i = null, a = 0;
					for (let t = 0; t + 1 < e.length; t++) {
						let o = e[t], s = e[t + 1], c = (e) => p.project(e.x, R.y + R.h - e.fraction * R.h, k), l = c(o), u = c(s), d = Math.hypot(u.x - l.x, u.y - l.y), f = Number.isFinite(d) ? d : Math.hypot(s.x - o.x, (s.fraction - o.fraction) * R.h), m = ke(o.fraction, s.fraction);
						if (!m || m.endT - m.startT <= 1e-12) {
							r(i), i = null, a += f;
							continue;
						}
						let h = (e) => ({
							x: o.x + (s.x - o.x) * e,
							fraction: o.fraction + (s.fraction - o.fraction) * e,
							ownerIndex: s.ownerIndex
						}), g = c(h(m.startT)), _ = Math.hypot(g.x - l.x, g.y - l.y), v = n(h(m.startT)), y = n(h(m.endT)), b = h(m.startT), x = h(m.endT), S = (e) => ({
							x: e.x,
							y: R.y + R.h - Math.max(0, Math.min(1, e.fraction)) * R.h
						});
						i != null && Math.hypot(i.path.at(-1).x - v.x, i.path.at(-1).y - v.y) <= 1e-8 && i.ownerIndex === s.ownerIndex ? (i.path.push(y), i.modelPath.push(S(x)), i.endClipped = t + 1 < e.length - 1 || m.endT < 1) : (r(i), i = {
							path: [v, y],
							modelPath: [S(b), S(x)],
							ownerIndex: s.ownerIndex,
							startClipped: t > 0 || m.startT > 0,
							endClipped: t + 1 < e.length - 1 || m.endT < 1,
							dashOffset: a + (Number.isFinite(_) ? _ : f * m.startT)
						}), a += f;
					}
					r(i);
				}
			}
			let le = t.chartType.toLowerCase().includes("area"), ue = l.lineHidden != null || l.lineColor != null || l.lineWidthEmu != null || l.chartexStyle?.lineHidden != null || l.chartexStyle?.lineColors?.some(Boolean) || l.chartexStyle?.lineWidthEmu != null || l.chartexStyle?.lineDash != null || l.chartexStyle?.lineCap != null || l.chartexStyle?.lineJoin != null || v.lineColor != null || v.lineFill !== void 0;
			if (!le || v.lineFill !== null && ue) {
				let n = /* @__PURE__ */ new Map(), a = (e) => {
					let r = B[c].get(e);
					if (!pt(r)) return v;
					let i = n.get(e);
					return i || (i = Z(t, l, r, e, c), n.set(e, i)), i;
				}, o = /* @__PURE__ */ new Map(), s = {
					remaining: Le,
					exceeded: !1
				}, u = (t, n, i, a = i, c = 0, l) => {
					if (n.lineFill === null) return;
					let u = n === v ? S : n.color, f = n.lineColor ?? J(u, .7), m = n.lineWidthEmu ? Math.max(.5, n.lineWidthEmu / U) * r : le ? .75 * r : Math.max(1, 2 * r), g = {
						width: m,
						dash: O(n.lineCustomDash, n.lineDash, m),
						dashOffset: c,
						lineCap: n.lineCap,
						startCap: i,
						endCap: a,
						lineJoin: n.lineJoin
					};
					if (!le && l && l.length >= 2) {
						let t = Ge(l.map((e) => ({
							...e,
							cameraDepth: 0,
							cameraWeight: 1
						})), g);
						if (t == null) {
							h = !0;
							return;
						}
						let r = o.get(n) ?? [];
						for (let n of t) {
							let t = De({
								outline: n.points,
								nearDepth: C.near,
								farDepth: C.far
							});
							if (!t) continue;
							let i = xt(p, t, f, void 0, s).map((e) => ({
								...e,
								paintRole: "outline"
							}));
							if (s.exceeded) {
								h = !0;
								return;
							}
							r.push(...i);
							for (let t of i) d.push({
								points: t.points,
								cameraDepth: t.cameraDepth,
								cameraDepths: t.cameraDepths,
								cameraWeights: t.cameraWeights,
								layer: 1,
								paint: () => Ct(e, t)
							});
						}
						o.set(n, r);
						return;
					}
					let _ = Ge(t, g);
					if (_ == null) {
						h = !0;
						return;
					}
					if (d.length + _.length > 1e4) {
						h = !0;
						return;
					}
					for (let t of _) {
						let r = {
							points: t.points,
							color: f,
							paintRole: "outline",
							shade: 0,
							cameraDepth: t.cameraDepth,
							cameraDepths: t.cameraDepths,
							cameraWeights: t.cameraWeights,
							outline: !1
						}, i = o.get(n) ?? [];
						i.push(r), o.set(n, i), d.push({
							points: t.points,
							cameraDepth: t.cameraDepth,
							cameraDepths: t.cameraDepths,
							cameraWeights: t.cameraWeights,
							layer: 1,
							paint: () => Ct(e, r)
						});
					}
				};
				if (le) for (let e of q) u(e, v, v.lineCap);
				else for (let e of ce) {
					let t = a(e.ownerIndex);
					u(e.path, t, e.startClipped ? "butt" : t.lineCap, e.endClipped ? "butt" : t.lineCap, e.dashOffset, e.modelPath);
				}
				for (let [t, n] of o) wt(e, n, "outline", t.lineFill, i);
			}
			let de = (le ? l.showMarker === !0 || P(l) : l.showMarker === !0) && l.markerSymbol !== "none";
			if ((t.chartType.toLowerCase().includes("line") || le) && (de || I(l))) for (let t = 0; t < A.length; t++) {
				let n = A[t];
				if (!n) continue;
				let a = B[c].get(t), o = te(l, a, "circle", de);
				if (o === "none") continue;
				let s = a?.markerSize ?? l.markerSize ?? 5, u = ee(l, a, t, l.color ?? tt[c % tt.length]), d = N(l, a, t), p = a?.markerLine ?? l.markerLine ?? l.lineColor ?? l.color ?? tt[c % tt.length], m = (a?.markerLineWidthEmu ?? l.markerLineWidthEmu) == null ? Math.max(.75, l.lineWidthEmu == null ? r : l.lineWidthEmu / U * r) : Math.max(.25, (a?.markerLineWidthEmu ?? l.markerLineWidthEmu ?? 0) / U * r);
				f.push(() => Ot(e, n, o, Math.max(2, s) * r, u === "00000000" ? "transparent" : `#${u}`, `#${p}`, m, d, i, r));
			}
			for (let a = 0; a < A.length; a++) {
				let u = A[a];
				if (!u) continue;
				let d = T(c, a), f = B[c].get(a), p = f?.markerSize ?? l.markerSize ?? 5, h = ie[c].get(a);
				At(t, l, h) && re.push(() => kt(e, t, l, c, a, m ? d / 100 : d, u, n, r, l.showMarker === !0 || f?.markerSymbol != null ? p * r / 2 : 0, void 0, h, "t", u, !0, t.valAxisDisplayUnits, F.max, s ? o[c][a] : d, i));
			}
		}
		if (h) return Tt(e, n), !0;
		for (let e of Ie(d)) e.paint();
		for (let e of f) e();
	}
	Wt(e, t, p, F, _, b, y, r, o ? "horizontal" : "vertical"), Zt(e, t, p, F, _, b, y, o ? "horizontal" : "vertical", a, r), Pt(e, t, n, p, F, _, b, y, o ? "horizontal" : "vertical", a, r);
	let ae = Xt(t, p, F, _, b, y, o ? "horizontal" : "vertical"), V = (e, t) => {
		if (t !== "low" && t !== "high") return ae;
		let n = p.topology.nearDepth, r = ae.axisX, i = ae.axisY;
		if (e === "value" === o) {
			let e = R.y, r = R.y + R.h, a = p.project(R.x + R.w / 2, e, n), o = p.project(R.x + R.w / 2, r, n), s = a.y >= o.y ? e : r;
			i = t === "low" ? s : s === e ? r : e;
		} else {
			let e = R.x, i = R.x + R.w, a = p.project(e, R.y + R.h / 2, n), o = p.project(i, R.y + R.h / 2, n), s = a.x <= o.x ? e : i;
			r = t === "low" ? s : s === e ? i : e;
		}
		return {
			axisX: r,
			axisY: i,
			depth: n,
			horizontalStart: p.project(R.x, i, n),
			horizontalEnd: p.project(R.x + R.w, i, n),
			verticalStart: p.project(r, R.y + R.h, n),
			verticalEnd: p.project(r, R.y, n)
		};
	}, W = V("value", t.valAxisTickLabelPos), G = V("category", t.catAxisTickLabelPos), oe = c(t.valAxisFontSizeHpt, r) ?? 9 * r;
	if (e.font = `${t.valAxisFontItalic ? "italic " : ""}${t.valAxisFontBold ? "bold " : ""}${oe}px ${ht(t.valAxisFontFace)}`, e.fillStyle = t.valAxisFontColor ? `#${t.valAxisFontColor}` : "#595959", e.textAlign = o ? "center" : "right", e.textBaseline = o ? "top" : "middle", !t.valAxisHidden && t.valAxisTickLabelPos !== "none") {
		let { axisX: n, axisY: i, depth: a } = W, s = p.project(R.x + R.w / 2, R.y + R.h / 2, a), c = Gt(o ? W.horizontalStart : W.verticalStart, o ? W.horizontalEnd : W.verticalEnd, s, o ? "vertical" : "horizontal");
		e.textAlign = Math.abs(c.x) < .2 ? "center" : c.x < 0 ? "right" : "left", e.textBaseline = Math.abs(c.y) < .2 ? "middle" : c.y < 0 ? "bottom" : "top";
		let l = Yt(t.valAxisMajorTickMark, t.valAxisLineHidden, r, 5), u = t.valAxisDisplayUnits?.divisor;
		for (let r of F.majorTicks) {
			let s = o ? p.project(R.x + F.fraction(r) * R.w, i, a) : p.project(n, R.y + R.h - F.fraction(r) * R.h, a);
			e.fillText(D(m ? r / 100 : u != null && Number.isFinite(u) && u > 0 ? r / u : r, m ? t.valAxisFormatCode ?? "0%" : t.valAxisFormatCode, t.date1904), s.x + c.x * l, s.y + c.y * l);
		}
	}
	let K = c(t.catAxisFontSizeHpt, r) ?? 9 * r;
	if (e.font = `${t.catAxisFontItalic ? "italic " : ""}${t.catAxisFontBold ? "bold " : ""}${K}px ${ht(t.catAxisFontFace)}`, e.fillStyle = t.catAxisFontColor ? `#${t.catAxisFontColor}` : "#595959", !t.catAxisHidden && t.catAxisTickLabelPos !== "none") {
		let n = C(Yt(t.catAxisMajorTickMark, t.catAxisLineHidden, r, 6), t.catAxisLabelOffsetPercent), i = Array.from({ length: _ }, (e, n) => ne(String(h[n] ?? n + 1), t.catAxisFormatCode, t.date1904)), a = Et(t);
		if (a == null && (a = 0, !o && _ > 1)) {
			let t = Infinity, n = null, r = G.axisY;
			for (let e = 0; e < _; e++) {
				let i = g(e, _, b, y), a = p.project(R.x + i * R.w, r, p.topology.nearDepth);
				n && (t = Math.min(t, Math.hypot(a.x - n.x, a.y - n.y))), n = a;
			}
			Math.max(0, ...i.map((t) => e.measureText(t).width)) > t * .9 && (a = -Math.PI / 4);
		}
		let s = Math.max(1, Math.floor(t.catAxisTickLabelSkip ?? 1));
		for (let t = 0; t < _; t += s) {
			let r = g(t, _, b, y), { axisX: s, axisY: c, depth: l } = G, u = o ? p.project(s, R.y + g(t, _, b, y) * R.h, l) : p.project(R.x + r * R.w, c, l);
			if (o) {
				let r = p.project(s, R.y + R.h / 2, l), a = p.project(R.x + R.w / 2, R.y + R.h / 2, l), o = r.x <= a.x;
				e.textAlign = o ? "right" : "left", e.textBaseline = "middle", e.fillText(i[t], u.x + (o ? -n : n), u.y);
			} else {
				let r = p.project(R.x + R.w / 2, R.y + R.h / 2, l), s = Gt(G.horizontalStart, G.horizontalEnd, r, "vertical");
				Dt(e, i[t], u, a, o, s.y < 0 ? -1 : 1, n);
			}
		}
	}
	Nt(e, t, n, u, o, r);
	for (let e of re) e();
	return It(e, t, d, r, !1, f, i), !0;
}
function $t(e, t, n, r, i) {
	if (!t.threeD || t.chartType !== "pie") return !1;
	let a = t.series[0];
	if (!a) return !0;
	let o = a.values.flatMap((e, t) => e != null && Number.isFinite(e) ? [{
		index: t,
		value: Math.abs(e)
	}] : []), s = 0;
	for (let e of o) s = Math.max(s, e.value);
	if (!(s > 0)) return !0;
	let l = o.reduce((e, t) => e + t.value / s, 0);
	if (!(l > 0) || !Number.isFinite(l)) return !0;
	let { plot: u, legend: d, legendMeasure: f } = jt(e, t, n, r, "radial", i), p = ue({
		...t.threeD,
		rotationY: t.threeD.rotationY ?? 0,
		heightPercent: void 0,
		depthPercent: 100
	}, u, {
		sceneDepthScale: 1,
		sceneHeightScale: .15
	});
	if (!p) return !0;
	let m = new Map(a.dataPointOverrides?.map((e) => [e.idx, e]) ?? []), h = 0;
	for (let e of m.values()) e.explosion != null && Number.isFinite(e.explosion) && (h = Math.max(h, Math.max(0, Math.min(100, e.explosion)) / 100));
	let { scene: g } = p, _ = Math.min(g.w * .45 / (1 + h), p.modelDepth * .45 / (1 + h), g.h / .45);
	if (!(_ > 0)) return !0;
	let v = g.x + g.w / 2, y = g.y + g.h / 2, b = .5, x = _ * .3 * he(t.threeD), S = 0, C = [], w = new Map(a.dataLabelOverrides?.map((e) => [e.idx, e]) ?? []), T = Math.max(48, Math.min(128, Math.ceil(Math.PI * 2 * _ / 4)));
	for (let e of o) {
		let n = e.value / s / l, r = Rt(t.firstSliceAngle, S, n), i = m.get(e.index), o = Z(t, a, i, e.index, 0), c = r.middle, u = i?.explosion != null && Number.isFinite(i.explosion) ? Math.max(0, Math.min(100, i.explosion)) / 100 : 0, d = v + Math.cos(c) * _ * u, f = b + Math.sin(c) * _ * u / p.modelDepth, h = Math.max(2, Math.ceil(T * n)), g = Oe({
			centerX: d,
			centerY: y,
			centerDepth: f,
			radius: _,
			modelDepth: p.modelDepth,
			thickness: x,
			startAngle: r.start,
			endAngle: r.end,
			segments: h
		});
		if (!g) {
			S += n;
			continue;
		}
		C.push({
			index: e.index,
			start: r.start,
			end: r.end,
			color: o.fill === null ? "transparent" : o.color,
			fillPaint: o.fill,
			value: e.value,
			percentValue: n,
			centerX: d,
			centerDepth: f,
			segments: h,
			mesh: g,
			lineColor: o.lineColor,
			lineFill: o.lineFill,
			lineWidthEmu: o.lineWidthEmu ?? null,
			lineDash: o.lineDash ?? "solid",
			lineCustomDash: o.lineCustomDash,
			lineCap: o.lineCap,
			lineJoin: o.lineJoin
		}), S += n;
	}
	p = _e(p, C.flatMap((e) => e.mesh.vertices), u, .08);
	let E = [], D = {
		remaining: Le,
		exceeded: !1
	}, k = (e) => {
		let t = e.lineWidthEmu == null ? .75 * r : Math.max(.25, e.lineWidthEmu / U * r);
		return e.lineFill !== null && (e.lineColor != null || e.lineFill !== void 0) ? {
			color: e.lineColor ?? "rgba(0,0,0,0.42)",
			width: t,
			dash: O(e.lineCustomDash, e.lineDash, t),
			cap: e.lineCap,
			join: e.lineJoin
		} : void 0;
	}, ee = C.flatMap((t) => {
		let n = xt(p, t.mesh, t.color, void 0, D);
		return wt(e, n, "fill", t.fillPaint, i), n;
	}), A = [], j = C.map(k), M = j[0], N = (e) => e == null ? null : [
		e.color,
		e.width,
		e.dash.join(","),
		e.cap,
		e.join
	].join("|"), P = M != null && C.every((e) => e.lineFill === void 0) && j.every((e) => N(e) === N(M)) && C.every((e) => Math.abs(e.centerX - v) < 1e-9 && Math.abs(e.centerDepth - b) < 1e-9);
	if (P) A.push(...St(p, C, y, _, x, M, D));
	else for (let t = 0; t < C.length; t++) {
		let n = j[t];
		if (!n) continue;
		let r = xt(p, C[t].mesh, "transparent", n, D, !0);
		wt(e, r, "outline", C[t].lineFill, i), A.push(...r);
	}
	if (D.exceeded) return Tt(e, n), !0;
	if (P) {
		for (let t of Ie(ee)) Ct(e, t);
		for (let t of Ie(A)) Ct(e, t);
	} else for (let t of Ie([...ee, ...A])) Ct(e, t);
	for (let n of C) {
		let o = (n.start + n.end) / 2, s = w.get(n.index);
		if (At(t, a, s)) {
			let l = a.seriesDataLabels, d = c(s?.fontSizeHpt ?? l?.fontSizeHpt ?? t.dataLabelFontSizeHpt, r) ?? 9 * r;
			e.font = `${s?.fontBold ?? l?.fontBold ?? t.dataLabelFontBold ? "bold " : ""}${d}px ${Q(t, s?.fontFace ?? l?.fontFace ?? t.dataLabelFontFace)}`;
			let f = fe({
				customText: s?.text,
				showCategory: s?.showCatName ?? l?.showCatName ?? !1,
				showSeries: s?.showSerName ?? l?.showSerName ?? !1,
				showValue: s?.showVal ?? l?.showVal ?? t.showDataLabels,
				showPercent: s?.showPercent ?? l?.showPercent ?? !1,
				category: a.categories?.[n.index] ?? t.categories[n.index] ?? `${n.index + 1}`,
				seriesName: a.name || "Series 1",
				sourceValue: n.value,
				percentRatio: n.percentValue,
				formatCode: s?.formatCode ?? l?.formatCode ?? t.dataLabelFormatCode ?? a.valFormatCode,
				separator: s?.separator ?? l?.separator,
				date1904: t.date1904
			}), m = Q(t, s?.fontFace ?? l?.fontFace ?? t.dataLabelFontFace), h = s?.text && s.richRuns?.length ? ce(e, {
				runs: s.richRuns,
				ptToPx: r,
				fontFamily: m,
				fallbackBold: s.fontBold ?? l?.fontBold ?? t.dataLabelFontBold ?? !1,
				fontFamilyForFace: (e) => Q(t, e)
			}, d, `#${s.fontColor ?? l?.fontColor ?? a.labelColor ?? t.dataLabelFontColor ?? "111111"}`) : null, g = s?.position ?? l?.position ?? t.dataLabelPosition, v = y - x / 2, b = y + x / 2, S = p.cameraDepth(n.centerX, v, n.centerDepth) >= p.cameraDepth(n.centerX, b, n.centerDepth) ? v : b, C = 0, w = null;
			for (let e = 0; e <= 12; e++) {
				let t = n.start + (n.end - n.start) * e / 12, r = p.project(n.centerX + Math.cos(t) * _ * .64, S, n.centerDepth + Math.sin(t) * _ * .64 / p.modelDepth);
				w && (C += Math.hypot(r.x - w.x, r.y - w.y)), w = r;
			}
			let T = (g == null || g === "bestFit") && (n.percentValue === 0 || C < (h?.width ?? e.measureText(f).width)) || g === "outEnd", D = _ * (T ? 1.12 : .64), O = p.project(n.centerX + Math.cos(o) * D, S, n.centerDepth + Math.sin(o) * D / p.modelDepth), k = p.project(n.centerX + Math.cos(o) * _, S, n.centerDepth + Math.sin(o) * _ / p.modelDepth);
			E.push(() => kt(e, t, a, 0, n.index, n.value, O, u, r, 0, n.percentValue, s, "ctr", k, T, void 0, void 0, void 0, i));
		}
	}
	for (let e of E) e();
	let F = a.categories?.length ? a.categories : t.categories, te = Array.from({ length: F.length }, (e, t) => {
		let n = m.get(t), r = n?.fillHidden === !0 ? "00000000" : n?.color ?? a.dataPointColors?.[t] ?? a.color;
		return r === "00000000" ? "00000000" : J(r ? `#${r}` : st(t), .8).replace(/^#/, "");
	});
	return It(e, {
		...t,
		categories: F,
		series: [{
			...a,
			categories: F,
			dataPointColors: te
		}]
	}, d, r, !0, f, i), !0;
}
function en(e, t, n, r, i = 0) {
	return !t.threeD || !(t.chartType === "pie" || it.has(t.chartType)) ? !1 : dt(t) ? $t(e, t, n, r, i) ? !0 : Qt(e, t, n, r, i) : (Tt(e, n), !0);
}
//#endregion
//#region src/three-d.ts
var tn = ye({ render: en }, "threeD");
//#endregion
export { tn as threeD };
