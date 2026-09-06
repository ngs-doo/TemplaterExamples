//#region dist/.types-work/mathjax-emiLk9eb.d.ts
interface MathSvg {
  svg: string;
  widthEm: number;
  ascentEm: number;
  descentEm: number;
}
interface MathRenderer {
  loadMathJax(): Promise<void>;
  mathMLToSvg(mathml: string): Promise<MathSvg>;
}
//#endregion
//#region dist/.types-work/math.d.ts
declare const math: MathRenderer;
//#endregion
export { type MathRenderer, type MathSvg, math };