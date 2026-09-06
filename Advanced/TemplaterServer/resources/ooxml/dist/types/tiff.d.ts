//#region dist/.types-work/tiff-contract-DJ3gpIhe.d.ts
interface TiffRenderOptions {
  targetWidthPx?: number;
  targetHeightPx?: number;
  maxRetainedPixels?: number;
}
declare class TiffDecodeError extends Error {
  readonly code: 'ooxml-tiff-decode';
  constructor(message: string, options?: ErrorOptions);
}
declare function isTiffDecodeError(error: unknown): error is TiffDecodeError;
interface TiffRenderer {
  render(bytes: Uint8Array, options?: Readonly<TiffRenderOptions>): Promise<ImageBitmap | null>;
}
//#endregion
//#region dist/.types-work/tiff.d.ts
declare const tiff: TiffRenderer;
//#endregion
export { TiffDecodeError, type TiffRenderOptions, type TiffRenderer, isTiffDecodeError, tiff };