import { a as e, i as t, o as n, r, s as i } from "./pixel-budget-Dgjw269h.js";
import { i as a, o, s, t as c } from "./raster-target-ojDdQizC.js";
import { t as l } from "./renderer-module-contract-Cu-GKuPd.js";
//#region packages/core/src/image/tiff.ts
var u = 1, d = 3, f = 4, p = {
	width: 256,
	height: 257,
	bitsPerSample: 258,
	compression: 259,
	photometric: 262,
	fillOrder: 266,
	stripOffsets: 273,
	orientation: 274,
	samplesPerPixel: 277,
	rowsPerStrip: 278,
	stripByteCounts: 279,
	planarConfiguration: 284,
	t6Options: 293,
	predictor: 317,
	tileWidth: 322,
	tileLength: 323,
	tileOffsets: 324,
	tileByteCounts: 325,
	inkSet: 332,
	extraSamples: 338,
	sampleFormat: 339
}, m = [
	p.tileWidth,
	p.tileLength,
	p.tileOffsets,
	p.tileByteCounts
];
function h(e, t) {
	throw new a(e, t === void 0 ? void 0 : { cause: t });
}
var g = class {
	view;
	constructor(e, t) {
		this.bytes = e, this.littleEndian = t, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength);
	}
	contains(e, t) {
		return Number.isSafeInteger(e) && Number.isSafeInteger(t) && e >= 0 && t >= 0 && e <= this.view.byteLength - t;
	}
	u8(e, t) {
		return this.contains(e, 1) || h(`Malformed TIFF ${t} range`), this.view.getUint8(e);
	}
	u16(e, t) {
		return this.contains(e, 2) || h(`Malformed TIFF ${t} range`), this.view.getUint16(e, this.littleEndian);
	}
	u32(e, t) {
		return this.contains(e, 4) || h(`Malformed TIFF ${t} range`), this.view.getUint32(e, this.littleEndian);
	}
};
function _(e) {
	return e.length >= 2 && (e[0] === 73 && e[1] === 73 || e[0] === 77 && e[1] === 77);
}
function v(e) {
	if (!o(e)) {
		if (!_(e)) return null;
		e.length < 4 && h("Malformed TIFF header: missing version");
		let t = e[0] === 73;
		h(`Unsupported TIFF version: ${new DataView(e.buffer, e.byteOffset, e.byteLength).getUint16(2, t)}`);
	}
	e.length < 8 && h("Malformed TIFF header: missing first-IFD offset");
	let t = new g(e, e[0] === 73), n = t.u32(4, "first-IFD offset"), r = t.u16(n, "first IFD"), i = r * 12 + 4;
	t.contains(n + 2, i) || h("Malformed TIFF first-IFD entry range");
	let a = /* @__PURE__ */ new Map();
	for (let e = 0; e < r; e++) {
		let r = n + 2 + e * 12, i = t.u16(r, `IFD entry ${e}`), o = t.u16(r + 2, `IFD entry ${e} type`), s = t.u32(r + 4, `IFD entry ${e} count`);
		a.has(i) && h(`Malformed TIFF: duplicate tag ${i}`), a.set(i, {
			type: o,
			count: s,
			entryOffset: r
		});
	}
	return {
		reader: t,
		fields: a
	};
}
function y(e) {
	return e === u ? 1 : e === d ? 2 : e === f ? 4 : 0;
}
function b(e, t, n, r) {
	let i = e.fields.get(t);
	if (!i) return;
	r.includes(i.type) || h(`Unsupported TIFF ${n} field type: ${i.type}`), i.count < 1 && h(`Malformed TIFF ${n}: empty value list`);
	let a = y(i.type), o = i.count * a;
	Number.isSafeInteger(o) || h(`Malformed TIFF ${n} value count`);
	let s = o <= 4 ? i.entryOffset + 8 : e.reader.u32(i.entryOffset + 8, `${n} value offset`);
	return e.reader.contains(s, o) || h(`Malformed TIFF ${n} value range`), {
		count: i.count,
		at(t) {
			(!Number.isSafeInteger(t) || t < 0 || t >= i.count) && h(`Malformed TIFF ${n} value index`);
			let r = s + t * a;
			return i.type === u ? e.reader.u8(r, n) : i.type === d ? e.reader.u16(r, n) : e.reader.u32(r, n);
		}
	};
}
function x(e, t, n, r, i) {
	let a = b(e, t, n, r);
	if (!a) {
		if (i !== void 0) return i;
		h(`Malformed TIFF: missing ${n}`);
	}
	return a.count !== 1 && h(`Malformed TIFF ${n}: expected one value`), a.at(0);
}
function S(e, t, n, r, i) {
	let a = b(e, t, n, r);
	return a || h(`Malformed TIFF: missing ${n}`), a.count !== i && h(`Malformed TIFF ${n}: expected ${i} value${i === 1 ? "" : "s"}`), a;
}
function C(t, r) {
	(t < 1 || r < 1) && h("Malformed TIFF: image dimensions must be positive");
	let a = Math.max(t, r);
	if (a > 134217728) throw new i("image-dimension", e, a);
	let o = t * r;
	if (o > 134217728) throw new i("image-pixels", n, Number.isSafeInteger(o) ? o : 2 ** 53 - 1);
}
function w(e, t) {
	if (!e.fields.has(p.bitsPerSample)) return [1];
	let n = S(e, p.bitsPerSample, "BitsPerSample", [d], t), r = Array(t);
	for (let e = 0; e < t; e++) r[e] = n.at(e);
	return r;
}
function T(e, t) {
	if (!e.fields.has(p.sampleFormat)) return;
	let n = S(e, p.sampleFormat, "SampleFormat", [d], t);
	for (let e = 0; e < n.count; e++) n.at(e) !== 1 && h("Unsupported TIFF SampleFormat: only unsigned integers are supported");
}
function E(e, t) {
	let n = x(e, p.compression, "Compression", [d], 1);
	n !== 1 && n !== 4 && h(`Unsupported TIFF compression: ${n}`);
	let r = x(e, p.photometric, "PhotometricInterpretation", [d]), i = x(e, p.samplesPerPixel, "SamplesPerPixel", [d], 1);
	i !== 1 && i !== 3 && i !== 4 && h(`Unsupported TIFF SamplesPerPixel: ${i}`);
	let a = w(e, i);
	if (T(e, i), n === 4) {
		(i !== 1 || a.length !== 1 || a[0] !== 1 || r !== 0 && r !== 1) && h("Unsupported CCITT Group 4 TIFF sample layout"), e.fields.has(p.extraSamples) && h("Unsupported CCITT Group 4 TIFF ExtraSamples");
		let t = x(e, p.t6Options, "T6Options", [f], 0);
		return t !== 0 && h(`Unsupported TIFF T6Options: ${t}`), {
			compression: n,
			layout: {
				kind: "group4",
				photometric: r
			}
		};
	}
	if (r === 0 || r === 1) {
		if ((i !== 1 || e.fields.has(p.extraSamples)) && h("Unsupported TIFF grayscale sample layout"), a[0] === 1) return {
			compression: n,
			layout: {
				kind: "gray-1",
				photometric: r,
				bytesPerRow: Math.ceil(t / 8)
			}
		};
		if (a[0] === 8) return {
			compression: n,
			layout: {
				kind: "gray-8",
				photometric: r,
				bytesPerRow: t
			}
		};
		h(`Unsupported TIFF grayscale BitsPerSample: ${a[0]}`);
	}
	if (r === 2) {
		if (a.some((e) => e !== 8) && h("Unsupported TIFF RGB BitsPerSample: only 8-bit samples are supported"), i === 3) return e.fields.has(p.extraSamples) && h("Unsupported TIFF RGB ExtraSamples"), {
			compression: n,
			layout: {
				kind: "rgb",
				bytesPerRow: t * 3
			}
		};
		if (i === 4) {
			let r = S(e, p.extraSamples, "ExtraSamples", [d], 1).at(0);
			if (r === 1) return {
				compression: n,
				layout: {
					kind: "rgba-associated",
					bytesPerRow: t * 4
				}
			};
			if (r === 2) return {
				compression: n,
				layout: {
					kind: "rgba-unassociated",
					bytesPerRow: t * 4
				}
			};
			h(`Unsupported TIFF ExtraSamples value: ${r}`);
		}
		h(`Unsupported TIFF RGB SamplesPerPixel: ${i}`);
	}
	if (r === 5) {
		(i !== 4 || a.length !== 4 || a.some((e) => e !== 8)) && h("Unsupported TIFF separated sample layout: expected 8-bit process CMYK"), e.fields.has(p.extraSamples) && h("Unsupported TIFF CMYK ExtraSamples");
		let r = x(e, p.inkSet, "InkSet", [d], 1);
		return r !== 1 && h(`Unsupported TIFF InkSet: ${r}`), {
			compression: n,
			layout: {
				kind: "cmyk",
				bytesPerRow: t * 4
			}
		};
	}
	h(`Unsupported TIFF PhotometricInterpretation: ${r}`);
}
function D(e) {
	let t = v(e);
	if (!t) return null;
	let n = x(t, p.width, "ImageWidth", [d, f]), r = x(t, p.height, "ImageLength", [d, f]);
	C(n, r), m.some((e) => t.fields.has(e)) && h("Unsupported tiled TIFF: only stripped images are supported");
	let i = x(t, p.orientation, "Orientation", [d], 1);
	i !== 1 && h(`Unsupported TIFF orientation: ${i}`);
	let a = x(t, p.planarConfiguration, "PlanarConfiguration", [d], 1);
	a !== 1 && h(`Unsupported TIFF PlanarConfiguration: ${a}`);
	let o = x(t, p.fillOrder, "FillOrder", [d], 1);
	o !== 1 && h(`Unsupported TIFF FillOrder: ${o}`);
	let s = x(t, p.predictor, "Predictor", [d], 1);
	s !== 1 && h(`Unsupported TIFF Predictor: ${s}`);
	let c = x(t, p.rowsPerStrip, "RowsPerStrip", [d, f], 4294967295);
	c < 1 && h("Malformed TIFF RowsPerStrip: expected a positive value");
	let l = Math.ceil(r / c), u = S(t, p.stripOffsets, "StripOffsets", [d, f], l), g = S(t, p.stripByteCounts, "StripByteCounts", [d, f], l), { compression: _, layout: y } = E(t, n);
	for (let e = 0; e < l; e++) {
		let n = u.at(e), i = g.at(e);
		if (t.reader.contains(n, i) || h(`Malformed TIFF strip ${e} byte range`), _ === 1) {
			let t = e * c, n = Math.min(c, r - t) * y.bytesPerRow;
			i < n && h(`Malformed TIFF strip ${e}: ${i} bytes cannot hold ${n} bytes`);
		}
	}
	return {
		directory: t,
		width: n,
		height: r,
		rowsPerStrip: c,
		stripCount: l,
		stripOffsets: u,
		stripByteCounts: g,
		layout: y
	};
}
function O(e, t) {
	if (e !== void 0) return (!Number.isFinite(e) || e <= 0) && h(`Invalid TIFF ${t}: expected a positive finite number`), e;
}
function k(e, n, a) {
	let o = O(a.targetWidthPx, "targetWidthPx"), s = O(a.targetHeightPx, "targetHeightPx"), l = c({
		width: e,
		height: n
	}, o, s, !0), u = l?.width ?? e, d = l?.height ?? n, f = Math.max(u, d);
	if (f > 32767) throw new i("image-dimension", r, f);
	let p = a.maxRetainedPixels ?? 33554432;
	(!Number.isFinite(p) || p < 0) && h("Invalid TIFF maxRetainedPixels: expected a non-negative finite number");
	let m = Math.min(t, Math.floor(p)), g = u * d;
	if (g > m) throw new i("image-pixels", m, g);
	return {
		width: u,
		height: d,
		pixels: g
	};
}
function A(e, t) {
	return Math.round((255 - e) * (255 - t) / 255);
}
function j(e, t) {
	return t === 0 ? 0 : Math.min(255, Math.round(e * 255 / t));
}
function M(e, t) {
	let n = e.layout, r = e.directory.reader.bytes;
	for (let i = 0; i < e.height; i++) {
		let a = Math.floor(i / e.rowsPerStrip), o = i - a * e.rowsPerStrip, s = e.stripOffsets.at(a) + o * n.bytesPerRow;
		for (let a = 0; a < e.width; a++) {
			let o = (i * e.width + a) * 4;
			if (n.kind === "gray-1") {
				let e = r[s + (a >> 3)] >> 7 - (a & 7) & 1, i = n.photometric === 0 ? e === 0 ? 255 : 0 : e === 0 ? 0 : 255;
				t[o] = i, t[o + 1] = i, t[o + 2] = i, t[o + 3] = 255;
				continue;
			}
			if (n.kind === "gray-8") {
				let e = r[s + a], i = n.photometric === 0 ? 255 - e : e;
				t[o] = i, t[o + 1] = i, t[o + 2] = i, t[o + 3] = 255;
				continue;
			}
			if (n.kind === "rgb") {
				let e = s + a * 3;
				t[o] = r[e], t[o + 1] = r[e + 1], t[o + 2] = r[e + 2], t[o + 3] = 255;
				continue;
			}
			if (n.kind === "rgba-associated" || n.kind === "rgba-unassociated") {
				let e = s + a * 4, i = r[e + 3];
				t[o] = n.kind === "rgba-associated" ? j(r[e], i) : r[e], t[o + 1] = n.kind === "rgba-associated" ? j(r[e + 1], i) : r[e + 1], t[o + 2] = n.kind === "rgba-associated" ? j(r[e + 2], i) : r[e + 2], t[o + 3] = i;
				continue;
			}
			let c = s + a * 4, l = r[c + 3];
			t[o] = A(r[c], l), t[o + 1] = A(r[c + 1], l), t[o + 2] = A(r[c + 2], l), t[o + 3] = 255;
		}
	}
}
function N(e) {
	return Math.max(0, Math.min(255, Math.round(e)));
}
function P(e, t, n, r, i) {
	let a = e.layout, o = e.directory.reader.bytes;
	for (let s = 0; s < t.width; s++) {
		let c = s * e.width, l = (s + 1) * e.width, u = Math.floor(c / t.width), d = Math.floor((l - 1) / t.width), f = 0, p = 0, m = 0, h = 0;
		for (let e = u; e <= d; e++) {
			let i = e * t.width, s = (e + 1) * t.width, u = (Math.min(l, s) - Math.max(c, i)) * r, d, g, _, v = 255;
			if (a.kind === "gray-1") {
				let t = o[n + (e >> 3)] >> 7 - (e & 7) & 1;
				d = a.photometric === 0 ? t === 0 ? 255 : 0 : t === 0 ? 0 : 255, g = d, _ = d;
			} else if (a.kind === "gray-8") {
				let t = o[n + e];
				d = a.photometric === 0 ? 255 - t : t, g = d, _ = d;
			} else if (a.kind === "rgb") {
				let t = n + e * 3;
				d = o[t], g = o[t + 1], _ = o[t + 2];
			} else if (a.kind === "rgba-associated") {
				let t = n + e * 4;
				v = o[t + 3], d = v === 0 ? 0 : o[t] * 255, g = v === 0 ? 0 : o[t + 1] * 255, _ = v === 0 ? 0 : o[t + 2] * 255;
			} else if (a.kind === "rgba-unassociated") {
				let t = n + e * 4;
				v = o[t + 3], d = o[t] * v, g = o[t + 1] * v, _ = o[t + 2] * v;
			} else {
				let t = n + e * 4, r = o[t + 3];
				d = A(o[t], r), g = A(o[t + 1], r), _ = A(o[t + 2], r);
			}
			a.kind !== "rgba-associated" && a.kind !== "rgba-unassociated" && (d *= 255, g *= 255, _ *= 255), f += d * u, p += g * u, m += _ * u, h += v * u;
		}
		let g = s * 4;
		i[g] += f, i[g + 1] += p, i[g + 2] += m, i[g + 3] += h;
	}
}
function F(e, t, n, r, i) {
	for (let a = 0; a < n; a++) {
		let o = a * 4, s = (r * n + a) * 4, c = e[o + 3];
		t[s] = c === 0 ? 0 : N(e[o] / c), t[s + 1] = c === 0 ? 0 : N(e[o + 1] / c), t[s + 2] = c === 0 ? 0 : N(e[o + 2] / c), t[s + 3] = N(c / i);
	}
}
function I(e, t, n) {
	let r = e.layout, i = new Float64Array(t.width * 4), a = e.width * e.height, o = -1;
	for (let s = 0; s < e.height; s++) {
		let c = Math.floor(s / e.rowsPerStrip), l = s - c * e.rowsPerStrip, u = e.stripOffsets.at(c) + l * r.bytesPerRow, d = s * t.height, f = (s + 1) * t.height, p = Math.floor(d / e.height), m = Math.floor((f - 1) / e.height);
		for (let r = p; r <= m; r++) {
			r !== o && (o >= 0 && (F(i, n, t.width, o, a), i.fill(0)), r !== o + 1 && h("Internal TIFF area-row sequence failure"), o = r);
			let s = r * e.height, c = (r + 1) * e.height;
			P(e, t, u, Math.min(f, c) - Math.max(d, s), i);
		}
	}
	o !== t.height - 1 && h("Internal TIFF area-row coverage failure"), F(i, n, t.width, o, a);
}
function L(e, t, n) {
	t.width === e.width && t.height === e.height ? M(e, n) : I(e, t, n);
}
var R = class {
	bitOffset = 0;
	constructor(e, t, n) {
		this.bytes = e, this.byteOffset = t, this.byteLength = n;
	}
	readBit() {
		this.bitOffset >= this.byteLength * 8 && h("CCITT Group 4 data is truncated");
		let e = this.bytes[this.byteOffset + (this.bitOffset >> 3)] >> 7 - (this.bitOffset & 7) & 1;
		return this.bitOffset++, e;
	}
}, z = [
	["00000001000", 1792],
	["00000001100", 1856],
	["00000001101", 1920],
	["000000010010", 1984],
	["000000010011", 2048],
	["000000010100", 2112],
	["000000010101", 2176],
	["000000010110", 2240],
	["000000010111", 2304],
	["000000011100", 2368],
	["000000011101", 2432],
	["000000011110", 2496],
	["000000011111", 2560]
], B = [
	["00110101", 0],
	["000111", 1],
	["0111", 2],
	["1000", 3],
	["1011", 4],
	["1100", 5],
	["1110", 6],
	["1111", 7],
	["10011", 8],
	["10100", 9],
	["00111", 10],
	["01000", 11],
	["001000", 12],
	["000011", 13],
	["110100", 14],
	["110101", 15],
	["101010", 16],
	["101011", 17],
	["0100111", 18],
	["0001100", 19],
	["0001000", 20],
	["0010111", 21],
	["0000011", 22],
	["0000100", 23],
	["0101000", 24],
	["0101011", 25],
	["0010011", 26],
	["0100100", 27],
	["0011000", 28],
	["00000010", 29],
	["00000011", 30],
	["00011010", 31],
	["00011011", 32],
	["00010010", 33],
	["00010011", 34],
	["00010100", 35],
	["00010101", 36],
	["00010110", 37],
	["00010111", 38],
	["00101000", 39],
	["00101001", 40],
	["00101010", 41],
	["00101011", 42],
	["00101100", 43],
	["00101101", 44],
	["00000100", 45],
	["00000101", 46],
	["00001010", 47],
	["00001011", 48],
	["01010010", 49],
	["01010011", 50],
	["01010100", 51],
	["01010101", 52],
	["00100100", 53],
	["00100101", 54],
	["01011000", 55],
	["01011001", 56],
	["01011010", 57],
	["01011011", 58],
	["01001010", 59],
	["01001011", 60],
	["00110010", 61],
	["00110011", 62],
	["00110100", 63],
	["11011", 64],
	["10010", 128],
	["010111", 192],
	["0110111", 256],
	["00110110", 320],
	["00110111", 384],
	["01100100", 448],
	["01100101", 512],
	["01101000", 576],
	["01100111", 640],
	["011001100", 704],
	["011001101", 768],
	["011010010", 832],
	["011010011", 896],
	["011010100", 960],
	["011010101", 1024],
	["011010110", 1088],
	["011010111", 1152],
	["011011000", 1216],
	["011011001", 1280],
	["011011010", 1344],
	["011011011", 1408],
	["010011000", 1472],
	["010011001", 1536],
	["010011010", 1600],
	["011000", 1664],
	["010011011", 1728],
	...z
], V = [
	["0000110111", 0],
	["010", 1],
	["11", 2],
	["10", 3],
	["011", 4],
	["0011", 5],
	["0010", 6],
	["00011", 7],
	["000101", 8],
	["000100", 9],
	["0000100", 10],
	["0000101", 11],
	["0000111", 12],
	["00000100", 13],
	["00000111", 14],
	["000011000", 15],
	["0000010111", 16],
	["0000011000", 17],
	["0000001000", 18],
	["00001100111", 19],
	["00001101000", 20],
	["00001101100", 21],
	["00000110111", 22],
	["00000101000", 23],
	["00000010111", 24],
	["00000011000", 25],
	["000011001010", 26],
	["000011001011", 27],
	["000011001100", 28],
	["000011001101", 29],
	["000001101000", 30],
	["000001101001", 31],
	["000001101010", 32],
	["000001101011", 33],
	["000011010010", 34],
	["000011010011", 35],
	["000011010100", 36],
	["000011010101", 37],
	["000011010110", 38],
	["000011010111", 39],
	["000001101100", 40],
	["000001101101", 41],
	["000011011010", 42],
	["000011011011", 43],
	["000001010100", 44],
	["000001010101", 45],
	["000001010110", 46],
	["000001010111", 47],
	["000001100100", 48],
	["000001100101", 49],
	["000001010010", 50],
	["000001010011", 51],
	["000000100100", 52],
	["000000110111", 53],
	["000000111000", 54],
	["000000100111", 55],
	["000000101000", 56],
	["000001011000", 57],
	["000001011001", 58],
	["000000101011", 59],
	["000000101100", 60],
	["000001011010", 61],
	["000001100110", 62],
	["000001100111", 63],
	["0000001111", 64],
	["000011001000", 128],
	["000011001001", 192],
	["000001011011", 256],
	["000000110011", 320],
	["000000110100", 384],
	["000000110101", 448],
	["0000001101100", 512],
	["0000001101101", 576],
	["0000001001010", 640],
	["0000001001011", 704],
	["0000001001100", 768],
	["0000001001101", 832],
	["0000001110010", 896],
	["0000001110011", 960],
	["0000001110100", 1024],
	["0000001110101", 1088],
	["0000001110110", 1152],
	["0000001110111", 1216],
	["0000001010010", 1280],
	["0000001010011", 1344],
	["0000001010100", 1408],
	["0000001010101", 1472],
	["0000001011010", 1536],
	["0000001011011", 1600],
	["0000001100100", 1664],
	["0000001100101", 1728],
	...z
];
function H(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of e) t.set(1 << n.length | Number.parseInt(n, 2), r);
	return t;
}
var U = H(B), W = H(V), G = new Map([
	[3, 0],
	[9, "horizontal"],
	[10, -1],
	[11, 1],
	[17, "pass"],
	[66, -2],
	[67, 2],
	[130, -3],
	[131, 3]
]);
function K(e) {
	let t = 0;
	for (let n = 1; n <= 7; n++) {
		t = t << 1 | e.readBit();
		let r = G.get(1 << n | t);
		if (r !== void 0) return r;
	}
	h("Invalid or unsupported CCITT Group 4 two-dimensional mode");
}
function q(e, t, n) {
	let r = t ? W : U, i = 0, a = Math.ceil(n / 64) + 64;
	for (let t = 0; t < a; t++) {
		let t = 0, a;
		for (let n = 1; n <= 13 && (t = t << 1 | e.readBit(), a = r.get(1 << n | t), a === void 0); n++);
		if (a === void 0 && h("Invalid CCITT Group 4 run-length code"), i += a, i > n && h("CCITT Group 4 run exceeds the scanline width"), a < 64) return i;
	}
	h("CCITT Group 4 run-length code limit exceeded");
}
var J = r + 1;
function Y(e, t) {
	let n = e[e.length - 1];
	n !== void 0 && n > t && h("Internal TIFF Group 4 changing-element order failure"), n === t ? e.pop() : (e.length >= J && h("CCITT Group 4 changing-element limit exceeded"), e.push(t));
}
function X(e, t, n, r, i, a, o) {
	let s = i ? n : n + 1;
	for (; a.index < e.length && (o && o.referenceProbeCount++, !(e[a.index] >= s));) a.index++;
	let c = a.index;
	return c < e.length && (c + 1 & 1) != (r ^ 1) && c++, [e[c] ?? t, e[c + 1] ?? t];
}
function Z(e, t, n, r, i) {
	n.length = 0;
	let a = 0, o = 0, s = !0, c = { index: 0 }, l = r * 4 + 32;
	for (let u = 0; a < r; u++) {
		u >= l && h("CCITT Group 4 scanline operation limit exceeded"), i && i.modeCount++;
		let d = K(e);
		if (d === "horizontal") {
			let t = q(e, o === 1, r - a), i = a + t, c = i + q(e, o === 0, r - i);
			c <= a && h("Invalid CCITT Group 4 horizontal mode with no progress"), Y(n, i), Y(n, c), a = c, s = !1;
			continue;
		}
		let [f, p] = X(t, r, a, o, s, c, i);
		if (d === "pass") {
			p <= a && h("Invalid CCITT Group 4 pass mode with no progress"), a = p, s = !1;
			continue;
		}
		let m = f + d;
		(m < a || m > r) && h("Invalid CCITT Group 4 vertical mode position"), Y(n, m), a = m, o ^= 1, s = !1;
	}
	n[n.length - 1] !== r && (n.length >= J && h("CCITT Group 4 changing-element limit exceeded"), n.push(r));
}
function Q(e, t, n, r, i) {
	let a = 0;
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = o & 1, l = i === 0 ? c === 0 ? 255 : 0 : c === 0 ? 0 : 255;
		for (let e = a; e < s; e++) {
			let i = (r * n + e) * 4;
			t[i] = l, t[i + 1] = l, t[i + 2] = l, t[i + 3] = 255;
		}
		a = s;
	}
}
function $(e, t, n, r, i, a, o) {
	let s = 0, c = n[0] * t.width;
	for (let l = 0; l < t.width; l++) {
		let u = l * e.width, d = (l + 1) * e.width, f = u;
		for (; f < d;) {
			for (o && o.areaSegmentCount++; c <= f && s + 1 < n.length;) s++, c = n[s] * t.width;
			let e = Math.min(d, c);
			e <= f && h("Internal TIFF Group 4 area-run coverage failure");
			let u = s & 1, p = r === 0 ? u === 0 ? 255 : 0 : u === 0 ? 0 : 255, m = (e - f) * i, g = l * 4, _ = p * 255 * m;
			a[g] += _, a[g + 1] += _, a[g + 2] += _, a[g + 3] += 255 * m, f = e;
		}
	}
}
function ee(e, t, n, r) {
	let i = e.layout, a = [e.width], o = [], s = t.width !== e.width || t.height !== e.height ? new Float64Array(t.width * 4) : null, c = e.width * e.height, l = -1;
	for (let u = 0; u < e.stripCount; u++) {
		a.length = 1, a[0] = e.width;
		let d = u * e.rowsPerStrip, f = Math.min(e.rowsPerStrip, e.height - d), p = new R(e.directory.reader.bytes, e.stripOffsets.at(u), e.stripByteCounts.at(u));
		for (let u = 0; u < f; u++) {
			let f = d + u;
			if (Z(p, a, o, e.width, r), !s) Q(o, n, e.width, f, i.photometric);
			else {
				let a = f * t.height, u = (f + 1) * t.height, d = Math.floor(a / e.height), p = Math.floor((u - 1) / e.height);
				for (let f = d; f <= p; f++) {
					f !== l && (l >= 0 && (F(s, n, t.width, l, c), s.fill(0)), f !== l + 1 && h("Internal TIFF Group 4 area-row sequence failure"), l = f);
					let d = f * e.height, p = (f + 1) * e.height, m = Math.min(u, p) - Math.max(a, d);
					$(e, t, o, i.photometric, m, s, r);
				}
			}
			[a, o] = [o, a];
		}
	}
	s && (l !== t.height - 1 && h("Internal TIFF Group 4 area-row coverage failure"), F(s, n, t.width, l, c));
}
function te(e, t, n) {
	let r = D(e);
	if (!r) return null;
	let i = k(r.width, r.height, t), a = new Uint8ClampedArray(i.pixels * 4);
	return r.layout.kind === "group4" ? ee(r, i, a, n) : L(r, i, a), {
		width: i.width,
		height: i.height,
		data: a
	};
}
function ne(e, t = {}) {
	return te(e, t);
}
async function re(e, t = {}) {
	let n = ne(e, t);
	if (!n) return null;
	typeof ImageData != "function" && h("TIFF ImageData construction is unavailable");
	let r;
	try {
		r = new ImageData(n.data, n.width, n.height);
	} catch (e) {
		h("TIFF ImageData construction failed", e);
	}
	typeof createImageBitmap != "function" && h("TIFF ImageBitmap creation is unavailable");
	let i;
	try {
		i = await createImageBitmap(r);
	} catch (e) {
		h("TIFF ImageBitmap creation failed", e);
	}
	return i || h("TIFF ImageBitmap creation returned no bitmap"), i;
}
//#endregion
//#region src/tiff.ts
var ie = l({ render: re }, "tiff");
//#endregion
export { a as TiffDecodeError, s as isTiffDecodeError, ie as tiff };
