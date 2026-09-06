//#region dist/.types-work/chart-CX4ml5hj.d.ts
type DecodedImageBudgetStrategy = 'adaptive' | 'strict';
interface ImageResourceOptions {
  decodedByteBudget?: number;
  strategy?: DecodedImageBudgetStrategy;
  resolution?: 'native-if-fit' | 'display';
}
type MathStyle = 'roman' | 'italic' | 'bold' | 'boldItalic';
interface MathRun {
  kind: 'run';
  text: string;
  style: MathStyle;
}
interface MathFraction {
  kind: 'fraction';
  num: MathNode[];
  den: MathNode[];
  bar?: boolean;
}
interface MathScript {
  kind: 'sup' | 'sub' | 'subSup';
  base: MathNode[];
  sup?: MathNode[];
  sub?: MathNode[];
}
interface MathNary {
  kind: 'nary';
  op: string;
  limLoc?: string;
  sub?: MathNode[];
  sup?: MathNode[];
  body: MathNode[];
}
interface MathDelimiter {
  kind: 'delimiter';
  begChar: string;
  endChar: string;
  items: MathNode[][];
}
interface MathRadical {
  kind: 'radical';
  index?: MathNode[];
  radicand: MathNode[];
}
interface MathLimit {
  kind: 'limit';
  base: MathNode[];
  lower?: MathNode[];
  upper?: MathNode[];
}
interface MathArray {
  kind: 'array';
  rows: MathNode[][][];
  align: 'eq' | 'center' | 'left';
}
interface MathGroupChr {
  kind: 'groupChr';
  char: string;
  pos: 'top' | 'bot';
  base: MathNode[];
}
interface MathBar {
  kind: 'bar';
  pos: 'top' | 'bot';
  base: MathNode[];
}
interface MathAccent {
  kind: 'accent';
  char: string;
  base: MathNode[];
}
interface MathFunc {
  kind: 'func';
  name: MathNode[];
  arg: MathNode[];
}
interface MathGroup {
  kind: 'group';
  items: MathNode[];
}
interface MathPhant {
  kind: 'phant';
  show: boolean;
  zeroWid?: boolean;
  zeroAsc?: boolean;
  zeroDesc?: boolean;
  base: MathNode[];
}
interface MathSPre {
  kind: 'sPre';
  sub: MathNode[];
  sup: MathNode[];
  base: MathNode[];
}
interface MathBox {
  kind: 'box';
  base: MathNode[];
}
interface MathBorderBox {
  kind: 'borderBox';
  hideTop?: boolean;
  hideBot?: boolean;
  hideLeft?: boolean;
  hideRight?: boolean;
  strikeH?: boolean;
  strikeV?: boolean;
  strikeBltr?: boolean;
  strikeTlbr?: boolean;
  base: MathNode[];
}
type MathNode = MathRun | MathFraction | MathScript | MathNary | MathDelimiter | MathRadical | MathLimit | MathArray | MathGroupChr | MathBar | MathAccent | MathFunc | MathGroup | MathPhant | MathSPre | MathBox | MathBorderBox;
interface Duotone {
  clr1: string;
  clr2: string;
}
interface SrcRect {
  l: number;
  t: number;
  r: number;
  b: number;
}
type PathCmd = {
  cmd: 'moveTo';
  x: number;
  y: number;
} | {
  cmd: 'lineTo';
  x: number;
  y: number;
} | {
  cmd: 'cubicBezTo';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
} | {
  cmd: 'quadBezTo';
  x1: number;
  y1: number;
  x: number;
  y: number;
} | {
  cmd: 'arcTo';
  wr: number;
  hr: number;
  stAng: number;
  swAng: number;
} | {
  cmd: 'close';
};
type Fill = SolidFill | NoFill | GradientFill | PatternFill | ImageFill;
interface SolidFill {
  fillType: 'solid';
  color: string;
}
interface NoFill {
  fillType: 'none';
}
interface GradientStop {
  position: number;
  color: string;
}
interface GradientFill {
  fillType: 'gradient';
  stops: GradientStop[];
  angle: number;
  gradType: string;
  scaled?: boolean;
  path?: 'shape' | 'circle' | 'rect' | string;
  fillToRect?: FillRect;
  tileRect?: FillRect;
  flip?: 'none' | 'x' | 'y' | 'xy' | string;
  rotWithShape?: boolean;
}
interface PatternFill {
  fillType: 'pattern';
  fg: string;
  bg: string;
  preset: string;
}
interface FillRect {
  l?: number;
  t?: number;
  r?: number;
  b?: number;
}
interface TileInfo {
  tx?: number;
  ty?: number;
  sx?: number;
  sy?: number;
  flip?: string;
  algn?: string;
}
interface ImageFill {
  fillType: 'image';
  imagePath: string;
  svgImagePath?: string;
  mimeType: string;
  dpi?: number;
  rotWithShape?: boolean;
  srcRect?: SrcRect;
  fillRect?: FillRect;
  stretch?: boolean;
  tile?: TileInfo;
  alpha?: number;
  duotone?: Duotone;
}
interface Shadow {
  color: string;
  alpha: number;
  blur: number;
  dist: number;
  dir: number;
  sx?: number;
  sy?: number;
  kx?: number;
  ky?: number;
  algn?: 'tl' | 't' | 'tr' | 'l' | 'ctr' | 'r' | 'bl' | 'b' | 'br';
  rotWithShape?: boolean;
}
interface Glow {
  color: string;
  alpha: number;
  radius: number;
}
interface SoftEdge {
  radius: number;
}
interface Reflection {
  blur: number;
  dist: number;
  dir: number;
  stA: number;
  stPos: number;
  endA: number;
  endPos: number;
  sx: number;
  sy: number;
}
interface ArrowEnd {
  type: string;
  w: string;
  len: string;
}
interface Stroke {
  color: string;
  width: number;
  fill?: Exclude<Fill, {
    fillType: 'image';
  } | {
    fillType: 'none';
  }>;
  dashStyle?: string;
  customDash?: ReadonlyArray<DrawingMLCustomDashSegment>;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'round' | 'bevel' | 'miter';
  miterLimit?: number;
  alignment?: 'ctr' | 'in';
  headEnd?: ArrowEnd;
  tailEnd?: ArrowEnd;
  cmpd?: string;
}
interface DrawingMLCustomDashSegment {
  dash: number;
  space: number;
}
interface TextBody$1 {
  verticalAnchor: string;
  paragraphs: Paragraph$1[];
  defaultFontSize: number | null;
  defaultBold: boolean | null;
  defaultItalic: boolean | null;
  lIns: number;
  rIns: number;
  tIns: number;
  bIns: number;
  wrap: string;
  vert: string;
  autoFit: string;
  fontScale?: number | null;
  lnSpcReduction?: number | null;
  numCol?: number;
  spcCol?: number;
}
type SpaceLine = {
  type: 'pct';
  val: number;
} | {
  type: 'pts';
  val: number;
};
type Bullet$1 = {
  type: 'none';
} | {
  type: 'inherit';
} | {
  type: 'char';
  char: string;
  color: string | null;
  sizePct: number | null;
  sizePts?: number;
  fontFamily: string | null;
} | {
  type: 'autoNum';
  numType: string;
  startAt: number | null;
  color: string | null;
  sizePct?: number | null;
  sizePts?: number;
  fontFamily?: string | null;
};
interface TabStop {
  pos: number;
  algn: string;
}
interface Paragraph$1 {
  alignment: string;
  marL: number;
  marR: number;
  indent: number;
  spaceBefore: number | null;
  spaceAfter: number | null;
  spaceLine: SpaceLine | null;
  lvl: number;
  bullet: Bullet$1;
  defFontSize: number | null;
  defColor: string | null;
  defBold: boolean | null;
  defItalic: boolean | null;
  defFontFamily: string | null;
  tabStops: TabStop[];
  rtl?: boolean;
  runs: TextRun[];
}
type TextRun = TextRunData | LineBreak | EquationRun;
interface EquationRun {
  type: 'math';
  nodes: MathNode[];
  display: boolean;
  fontSize?: number | null;
  color?: string | null;
}
interface TextRunData {
  type: 'text';
  text: string;
  bold: boolean | null;
  italic: boolean | null;
  underline: boolean;
  underlineStyle?: string;
  underlineColor?: string;
  strikethrough: boolean;
  strikeDouble?: boolean;
  fontSize: number | null;
  color: string | null;
  fontFamily: string | null;
  fontFamilyEa?: string;
  fontFamilySym?: string;
  baseline?: number;
  caps?: 'none' | 'small' | 'all';
  letterSpacing?: number;
  fieldType?: string;
  hyperlink?: string;
  hyperlinkAction?: string;
  shadow?: Shadow;
  reflection?: Reflection;
  outline?: TextOutline;
  highlight?: string;
}
interface TextOutline {
  width: number;
  color?: string;
}
interface LineBreak {
  type: 'break';
}
interface RenderOptions {
  width?: number;
  defaultTextColor?: string | null;
  dpr?: number;
  imageResources?: ImageResourceOptions;
  majorFont?: string | null;
  minorFont?: string | null;
  hlinkColor?: string | null;
  fetchMedia?: (path: string) => Promise<Blob>;
  fetchImage?: (path: string, mimeType: string) => Promise<Blob>;
  skipMediaControls?: boolean;
}
interface ChartSeries {
  name: string;
  chartexFormatIdx?: number | null;
  color: string | null;
  fillPattern?: PatternFill | null;
  invertIfNegative?: boolean | null;
  automaticNegativeStyle?: boolean | null;
  invertedFill?: SolidFill | GradientFill | PatternFill | null;
  invertedFillHidden?: boolean | null;
  invertedFillAuthored?: boolean | null;
  invertedLineColor?: string | null;
  invertedLineWidthEmu?: number | null;
  invertedLineHidden?: boolean | null;
  invertedLineAuthored?: boolean | null;
  chartexStyle?: ChartExElementStyle | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  threeDShape?: 'box' | 'cylinder' | 'cone' | 'coneToMax' | 'pyramid' | 'pyramidToMax' | string | null;
  values: (number | null)[];
  sourceHidden?: boolean[] | null;
  dataPointColors?: (string | null)[] | null;
  explosion?: number | null;
  dataLabelColors?: (string | null)[] | null;
  labelColor?: string | null;
  seriesType?: string | null;
  lineGroupIndex?: number | null;
  areaGroupIndex?: number | null;
  barGroupIndex?: number | null;
  barGroupDirection?: 'bar' | 'col' | string | null;
  barGroupGrouping?: 'standard' | 'clustered' | 'stacked' | 'percentStacked' | string | null;
  barGroupGapWidth?: number | null;
  barGroupOverlap?: number | null;
  useSecondaryAxis?: boolean | null;
  categories?: string[] | null;
  bubbleXSourceIsString?: boolean | null;
  showMarker?: boolean | null;
  valFormatCode?: string | null;
  catFormatCode?: string | null;
  catFormatBuiltinId?: number | null;
  catFormatCodes?: (string | null)[] | null;
  markerSymbol?: string | null;
  automaticMarkerSymbol?: string | null;
  markerSize?: number | null;
  markerFill?: string | null;
  markerFillPaint?: Fill | null;
  markerFillPaintAuthored?: boolean | null;
  markerLine?: string | null;
  markerLineWidthEmu?: number | null;
  dataPointOverrides?: ChartDataPointOverride[] | null;
  dataLabelOverrides?: ChartDataLabelOverride[] | null;
  seriesDataLabels?: ChartSeriesDataLabels | null;
  errBars?: ChartErrBars[] | null;
  bubbleSizes?: (number | null)[] | null;
  bubble3DGroupDefault?: boolean | null;
  bubble3D?: boolean | null;
  smooth?: boolean | null;
  trendLines?: ChartTrendline[] | null;
  lineHidden?: boolean | null;
}
interface ChartTrendline {
  name?: string | null;
  trendlineType: string;
  order?: number | null;
  period?: number | null;
  forward?: number | null;
  backward?: number | null;
  intercept?: number | null;
  dispRSqr?: boolean | null;
  dispEq?: boolean | null;
  labelManualLayout?: ChartManualLayout | null;
  labelText?: string | null;
  labelRichRuns?: ChartTextRun[] | null;
  labelFormatCode?: string | null;
  labelFormatSourceLinked?: boolean | null;
  labelFontSizeHpt?: number | null;
  labelFontBold?: boolean | null;
  labelFontItalic?: boolean | null;
  labelFontColor?: string | null;
  labelFontPaintAuthored?: boolean | null;
  labelFontHidden?: boolean | null;
  labelFontFace?: string | null;
  labelFontLanguage?: string | null;
  labelFontBaseline?: number | null;
  labelTextRotation?: number | null;
  labelTextWrap?: string | null;
  labelTextVerticalAnchor?: string | null;
  labelTextVerticalMode?: string | null;
  labelTextLInsEmu?: number | null;
  labelTextTInsEmu?: number | null;
  labelTextRInsEmu?: number | null;
  labelTextBInsEmu?: number | null;
  labelTextBodyAuthored?: boolean | null;
  labelBox?: ChartLabelBox | null;
  labelTextAlign?: string | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  lineDash?: string | null;
  lineHidden?: boolean | null;
}
interface ChartDataPointOverride {
  idx: number;
  color?: string;
  fillHidden?: boolean;
  chartexStyle?: ChartExElementStyle | null;
  lineColor?: string;
  lineWidthEmu?: number;
  lineDash?: string;
  lineHidden?: boolean;
  markerSymbol?: string;
  markerSize?: number;
  markerFill?: string;
  markerFillPaint?: Fill | null;
  markerFillPaintAuthored?: boolean | null;
  markerLine?: string;
  markerLineWidthEmu?: number;
  bubble3D?: boolean | null;
  explosion?: number;
}
interface ChartDataLabelOverride {
  idx: number;
  text: string;
  richRuns?: ChartTextRun[];
  position?: string;
  fontColor?: string;
  fontPaintAuthored?: boolean;
  fontHidden?: boolean;
  fontSizeHpt?: number;
  fontFace?: string;
  fontBold?: boolean;
  fontItalic?: boolean;
  fontLanguage?: string;
  fontBaseline?: number;
  textRotation?: number;
  textWrap?: string;
  textVerticalAnchor?: string;
  textVerticalMode?: string;
  textLInsEmu?: number;
  textTInsEmu?: number;
  textRInsEmu?: number;
  textBInsEmu?: number;
  textBodyAuthored?: boolean;
  textAlign?: 'l' | 'ctr' | 'r' | 'just' | 'dist' | string;
  formatCode?: string;
  separator?: string;
  manualLayout?: ChartManualLayout;
  labelBox?: ChartLabelBox;
  showVal?: boolean;
  showCatName?: boolean;
  showSerName?: boolean;
  showPercent?: boolean;
  showBubbleSize?: boolean;
  showLegendKey?: boolean;
  deleted?: boolean;
}
interface ChartLabelBox {
  fill?: string;
  fillPaint?: SolidFill | GradientFill | PatternFill | null;
  fillHidden?: boolean | null;
  fillPaintAuthored?: boolean | null;
  borderColor?: string;
  borderFill?: SolidFill | GradientFill | PatternFill | null;
  borderWidthEmu?: number;
  borderHidden?: boolean | null;
  borderPaintAuthored?: boolean | null;
  borderDash?: string | null;
  borderDashAuthored?: boolean | null;
  borderCustomDash?: ChartLineDashSegment[] | null;
  borderCap?: string | null;
  borderJoin?: string | null;
  borderCompound?: string | null;
}
interface ChartSeriesDataLabels {
  deleted?: boolean | null;
  showVal: boolean;
  showCatName: boolean;
  showSerName: boolean;
  showPercent: boolean;
  showBubbleSize?: boolean;
  showLegendKey?: boolean;
  position?: string;
  fontColor?: string;
  fontPaintAuthored?: boolean;
  fontHidden?: boolean;
  formatCode?: string;
  separator?: string;
  fontBold?: boolean;
  fontItalic?: boolean;
  fontLanguage?: string;
  fontBaseline?: number;
  fontSizeHpt?: number;
  fontFace?: string;
  textRotation?: number;
  textWrap?: string;
  textVerticalAnchor?: string;
  textVerticalMode?: string;
  textLInsEmu?: number;
  textTInsEmu?: number;
  textRInsEmu?: number;
  textBInsEmu?: number;
  textBodyAuthored?: boolean;
  textAlign?: 'l' | 'ctr' | 'r' | 'just' | 'dist' | string;
  labelBox?: ChartLabelBox;
  showLeaderLines?: boolean;
  leaderLineColor?: string;
  leaderLineWidthEmu?: number;
  leaderLineHidden?: boolean;
  leaderLineDash?: string;
}
interface ChartErrBars {
  dir: string;
  barType: string;
  plus: (number | null)[];
  minus: (number | null)[];
  noEndCap: boolean;
  color?: string;
  lineWidthEmu?: number;
  dash?: string;
  hidden?: boolean;
}
type ChartType = 'line' | 'stackedLine' | 'stackedLinePct' | 'clusteredBar' | 'clusteredBarH' | 'stackedBar' | 'stackedBarH' | 'stackedBarPct' | 'stackedBarHPct' | 'area' | 'stackedArea' | 'stackedAreaPct' | 'pie' | 'doughnut' | 'scatter' | 'bubble' | 'radar' | 'waterfall' | 'stock' | 'surface' | 'surface3D' | 'boxWhisker' | 'sunburst' | 'treemap' | string;
type ChartPlotGroupKind = 'area' | 'area3D' | 'line' | 'line3D' | 'stock' | 'radar' | 'scatter' | 'pie' | 'pie3D' | 'doughnut' | 'bar' | 'bar3D' | 'ofPie' | 'surface' | 'surface3D' | 'bubble';
type ChartPlotGroupAxisSlot = 'primary' | 'secondary' | 'none' | 'unresolved';
interface ChartPlotGroup {
  kind: ChartPlotGroupKind;
  seriesStart: number;
  seriesCount: number;
  categoryAxis: ChartPlotGroupAxisSlot;
  valueAxis: ChartPlotGroupAxisSlot;
  seriesAxis: ChartPlotGroupAxisSlot;
  axisIds?: string[] | null;
  grouping?: string | null;
  barDirection?: string | null;
  scatterStyle?: string | null;
  radarStyle?: string | null;
  gapWidth?: number | null;
  overlap?: number | null;
  bubbleScale?: number | null;
  bubbleSizeRepresents?: 'area' | 'w' | null;
  showNegativeBubbles?: boolean | null;
}
type ChartLineDashSegment = DrawingMLCustomDashSegment;
interface ChartExElementStyle {
  fontSizeHpt?: number | null;
  fontBold?: boolean | null;
  fontItalic?: boolean | null;
  fontColor?: string | null;
  fontPaintAuthored?: boolean | null;
  fontHidden?: boolean | null;
  fontFace?: string | null;
  fontLanguage?: string | null;
  fontBaseline?: number | null;
  textRotation?: number | null;
  textWrap?: string | null;
  textVerticalAnchor?: string | null;
  textVerticalMode?: string | null;
  textLInsEmu?: number | null;
  textTInsEmu?: number | null;
  textRInsEmu?: number | null;
  textBInsEmu?: number | null;
  textBodyAuthored?: boolean | null;
  fillPaints?: Array<Fill | null> | null;
  fillColors?: Array<string | null> | null;
  fillHidden?: boolean | null;
  fillPaintAuthored?: boolean | null;
  fillNoStyle?: boolean | null;
  lineColors?: Array<string | null> | null;
  linePaints?: Array<SolidFill | GradientFill | PatternFill | null> | null;
  linePaintAuthored?: boolean | null;
  lineWidthEmu?: number | null;
  lineHidden?: boolean | null;
  lineNoStyle?: boolean | null;
  lineDash?: string | null;
  lineDashAuthored?: boolean | null;
  lineCustomDash?: ChartLineDashSegment[] | null;
  lineCap?: string | null;
  lineJoin?: string | null;
  lineCompound?: string | null;
  fillColorIndex?: number | null;
  lineColorIndex?: number | null;
}
type ChartStyleRole = 'axisTitle' | 'categoryAxis' | 'chartArea' | 'dataLabel' | 'dataLabelCallout' | 'dataPoint' | 'dataPoint3D' | 'dataPointLine' | 'dataPointMarker' | 'dataPointWireframe' | 'dataTable' | 'downBar' | 'dropLine' | 'errorBar' | 'floor' | 'gridlineMajor' | 'gridlineMinor' | 'hiLoLine' | 'leaderLine' | 'legend' | 'plotArea' | 'plotArea3D' | 'seriesAxis' | 'seriesLine' | 'title' | 'trendline' | 'trendlineLabel' | 'upBar' | 'valueAxis' | 'wall';
interface ChartSurfaceBandFormat {
  idx: number;
  style?: ChartExElementStyle | null;
  fill?: SolidFill | GradientFill | PatternFill | null;
  fillHidden?: boolean | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  lineHidden?: boolean | null;
}
interface ChartDataTable {
  showHorizontalBorder: boolean;
  showVerticalBorder: boolean;
  showOutline: boolean;
  showKeys: boolean;
  fontSizeHpt?: number | null;
  fontFace?: string | null;
  fontColor?: string | null;
  fontBold?: boolean | null;
  fontItalic?: boolean | null;
  fillColor?: string | null;
  fill?: SolidFill | GradientFill | PatternFill | null;
  fillHidden?: boolean | null;
  fillPaintAuthored?: boolean | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  lineDash?: string | null;
  lineHidden?: boolean | null;
}
interface ChartModel {
  chartType: ChartType;
  title: string | null;
  titleRichRuns?: ChartTextRun[] | null;
  titlePresent?: boolean;
  categories: string[];
  categorySourceHidden?: boolean[] | null;
  categoryLevels?: string[][] | null;
  series: ChartSeries[];
  plotGroups?: ChartPlotGroup[] | null;
  chartTextBoxes?: ChartTextBox[] | null;
  varyColors?: boolean | null;
  showDataLabels: boolean;
  valMin: number | null;
  valMax: number | null;
  catAxisTitle: string | null;
  valAxisTitle: string | null;
  catAxisHidden: boolean;
  valAxisHidden: boolean;
  catAxisLineHidden: boolean;
  valAxisLineHidden: boolean;
  plotAreaBg: string | null;
  plotAreaFill?: Fill | null;
  plotAreaFillHidden?: boolean | null;
  plotAreaFillPaintAuthored?: boolean | null;
  plotAreaFillAutomatic?: boolean | null;
  plotAreaLineColor?: string | null;
  plotAreaLineFill?: SolidFill | GradientFill | PatternFill | null;
  plotAreaLineWidthEmu?: number | null;
  plotAreaLineDash?: string | null;
  plotAreaLineDashAuthored?: boolean | null;
  plotAreaLineCustomDash?: ChartLineDashSegment[] | null;
  plotAreaLineCap?: string | null;
  plotAreaLineJoin?: string | null;
  plotAreaLineCompound?: string | null;
  plotAreaLineHidden?: boolean | null;
  plotAreaLinePaintAuthored?: boolean | null;
  chartBg: string | null;
  chartFill?: Fill | null;
  chartFillHidden?: boolean | null;
  chartFillPaintAuthored?: boolean | null;
  roundedCorners?: boolean | null;
  plotVisibleOnly?: boolean | null;
  showLegend: boolean;
  dataTable?: ChartDataTable | null;
  legendPos: 'r' | 'l' | 't' | 'b' | 'tr' | null;
  legendOverlay?: boolean | null;
  legendEntries?: ChartLegendEntryOverride[] | null;
  catAxisCrossBetween: 'between' | 'midCat' | string;
  valAxisMajorTickMark: 'cross' | 'out' | 'in' | 'none' | string;
  catAxisMajorTickMark: 'cross' | 'out' | 'in' | 'none' | string;
  valAxisMinorTickMark?: 'cross' | 'out' | 'in' | 'none' | string | null;
  catAxisMinorTickMark?: 'cross' | 'out' | 'in' | 'none' | string | null;
  titleFontSizeHpt: number | null;
  titleFontColor: string | null;
  titleFontFace: string | null;
  catAxisFontSizeHpt: number | null;
  valAxisFontSizeHpt: number | null;
  catAxisFontColor?: string | null;
  valAxisFontColor?: string | null;
  dataLabelFontSizeHpt: number | null;
  dataLabelFontBold?: boolean | null;
  subtotalIndices: number[];
  legendManualLayout?: LegendManualLayout | null;
  valAxisFormatCode?: string | null;
  valAxisDisplayUnits?: ChartDisplayUnits | null;
  catAxisDisplayUnits?: ChartDisplayUnits | null;
  barGapWidth?: number | null;
  barOverlap?: number | null;
  dataLabelPosition?: string | null;
  dataLabelFontColor?: string | null;
  dataLabelFormatCode?: string | null;
  titleFontBold?: boolean | null;
  catAxisFontBold?: boolean | null;
  catAxisFontItalic?: boolean | null;
  valAxisFontBold?: boolean | null;
  valAxisFontItalic?: boolean | null;
  catAxisTitleFontSizeHpt?: number | null;
  catAxisTitleFontBold?: boolean | null;
  catAxisTitleFontItalic?: boolean | null;
  catAxisTitleFontColor?: string | null;
  catAxisTitleRotation?: number | null;
  catAxisTitleVerticalMode?: 'horz' | 'vert' | 'vert270' | 'wordArtVert' | 'eaVert' | 'mongolianVert' | 'wordArtVertRtl' | null;
  catAxisTitleManualLayout?: ChartManualLayout | null;
  catAxisTitleTextVerticalInsetEmu?: number | null;
  valAxisTitleFontSizeHpt?: number | null;
  valAxisTitleFontBold?: boolean | null;
  valAxisTitleFontItalic?: boolean | null;
  valAxisTitleFontColor?: string | null;
  valAxisTitleRotation?: number | null;
  valAxisTitleVerticalMode?: 'horz' | 'vert' | 'vert270' | 'wordArtVert' | 'eaVert' | 'mongolianVert' | 'wordArtVertRtl' | null;
  valAxisTitleManualLayout?: ChartManualLayout | null;
  valAxisTitleTextVerticalInsetEmu?: number | null;
  catAxisFontFace?: string | null;
  valAxisFontFace?: string | null;
  catAxisTitleFontFace?: string | null;
  valAxisTitleFontFace?: string | null;
  dataLabelFontFace?: string | null;
  legendFontFace?: string | null;
  legendFontColor?: string | null;
  legendFontSizeHpt?: number | null;
  legendFontBold?: boolean | null;
  legendFillColor?: string | null;
  legendFill?: Fill | null;
  legendFillHidden?: boolean | null;
  legendFillPaintAuthored?: boolean | null;
  legendLineColor?: string | null;
  legendLineFill?: SolidFill | GradientFill | PatternFill | null;
  legendLineWidthEmu?: number | null;
  legendLineDash?: string | null;
  legendLineDashAuthored?: boolean | null;
  legendLineCustomDash?: ChartLineDashSegment[] | null;
  legendLineCap?: string | null;
  legendLineJoin?: string | null;
  legendLineCompound?: string | null;
  legendLineHidden?: boolean | null;
  legendLinePaintAuthored?: boolean | null;
  themeMajorFontLatin?: string | null;
  themeMinorFontLatin?: string | null;
  chartBorderColor?: string | null;
  chartBorderLineFill?: SolidFill | GradientFill | PatternFill | null;
  chartBorderWidthEmu?: number | null;
  chartBorderDash?: string | null;
  chartBorderDashAuthored?: boolean | null;
  chartBorderCustomDash?: ChartLineDashSegment[] | null;
  chartBorderCap?: string | null;
  chartBorderJoin?: string | null;
  chartBorderCompound?: string | null;
  chartBorderHidden?: boolean | null;
  chartBorderPaintAuthored?: boolean | null;
  catAxisCrosses?: string | null;
  catAxisCrossesAt?: number | null;
  valAxisCrosses?: string | null;
  valAxisCrossesAt?: number | null;
  catAxisLineColor?: string | null;
  catAxisLineWidthEmu?: number | null;
  catAxisLineDash?: string | null;
  catAxisLinePaintAuthored?: boolean | null;
  valAxisLineColor?: string | null;
  valAxisLineWidthEmu?: number | null;
  valAxisLineDash?: string | null;
  valAxisLinePaintAuthored?: boolean | null;
  catAxisFormatCode?: string | null;
  catAxisMin?: number | null;
  catAxisMax?: number | null;
  titleManualLayout?: ChartManualLayout | null;
  plotAreaManualLayout?: ChartManualLayout | null;
  scatterStyle?: string | null;
  bubbleScale?: number | null;
  bubbleSizeRepresents?: 'area' | 'w' | null;
  showNegativeBubbles?: boolean | null;
  radarStyle?: string | null;
  secondaryValAxis?: SecondaryValueAxis | null;
  secondaryCatAxis?: SecondaryValueAxis | null;
  date1904?: boolean;
  holeSize?: number | null;
  firstSliceAngle?: number | null;
  dispBlanksAs?: string | null;
  showDataLabelsOverMax?: boolean | null;
  valAxisMajorGridlines?: boolean | null;
  catAxisMajorGridlines?: boolean | null;
  valAxisGridlineColor?: string | null;
  valAxisGridlineWidthEmu?: number | null;
  valAxisGridlineDash?: string | null;
  catAxisGridlineColor?: string | null;
  catAxisGridlineWidthEmu?: number | null;
  catAxisGridlineDash?: string | null;
  valAxisMinorGridlines?: boolean | null;
  valAxisMinorGridlineColor?: string | null;
  valAxisMinorGridlineWidthEmu?: number | null;
  valAxisMinorGridlineDash?: string | null;
  catAxisMinorGridlines?: boolean | null;
  catAxisMinorGridlineColor?: string | null;
  catAxisMinorGridlineWidthEmu?: number | null;
  catAxisMinorGridlineDash?: string | null;
  valAxisMajorUnit?: number | null;
  valAxisMinorUnit?: number | null;
  catAxisMajorUnit?: number | null;
  catAxisMinorUnit?: number | null;
  catAxisIsDate?: boolean | null;
  catAxisBaseTimeUnit?: 'days' | 'months' | 'years' | string | null;
  catAxisMajorTimeUnit?: 'days' | 'months' | 'years' | string | null;
  catAxisMinorTimeUnit?: 'days' | 'months' | 'years' | string | null;
  catAxisNoMultiLevelLabels?: boolean | null;
  valAxisLogBase?: number | null;
  catAxisLogBase?: number | null;
  valAxisOrientation?: 'minMax' | 'maxMin' | string | null;
  catAxisOrientation?: 'minMax' | 'maxMin' | string | null;
  catAxisTickLabelPos?: string | null;
  catAxisTickLabelSkip?: number | null;
  catAxisTickMarkSkip?: number | null;
  catAxisLabelAlignment?: 'l' | 'ctr' | 'r' | string | null;
  catAxisLabelOffsetPercent?: number | null;
  valAxisTickLabelPos?: string | null;
  catAxisLabelRotation?: number | null;
  lineGroupDecorations?: ChartLineGroupDecorations[] | null;
  areaGroupDecorations?: ChartAreaGroupDecorations[] | null;
  barGroupDecorations?: ChartBarGroupDecorations[] | null;
  stockDropLines?: ChartDecorationLineStyle | null;
  stockHiLowLineStyle?: ChartDecorationLineStyle | null;
  stockHiLowLines?: boolean | null;
  stockHiLowLineColor?: string | null;
  stockUpDownBars?: boolean | null;
  stockUpDownBarStyle?: ChartStockUpDownBarStyle | null;
  stockAutomaticStyle?: {
    lineColor: string;
    lineWidthEmu: number;
    upFillColor: string;
    downFillColor: string;
  } | null;
  surfaceWireframe?: boolean | null;
  surfaceBandFormats?: ChartSurfaceBandFormat[] | null;
  legacyChartStyle?: number | null;
  themeAccentColors?: string[] | null;
  ofPie?: ChartOfPie | null;
  threeD?: ChartThreeD | null;
  chartexBox?: ChartexBoxWhisker | null;
  chartexSunburst?: ChartexSunburst | null;
  chartexTreemap?: ChartexTreemap | null;
  chartexRegionMap?: ChartexRegionMap | null;
  chartexHistogramBinning?: ChartexHistogramBinning | null;
  chartexAccents?: string[] | null;
  chartexColorPalette?: Array<string | null> | null;
  chartexColorStyleMethod?: string | null;
  chartStyleRoles?: Partial<Record<ChartStyleRole, ChartExElementStyle>> | null;
  chartStyleColorPalette?: Array<string | null> | null;
  chartStyleColorMethod?: string | null;
  chartStyleMarkerSizePt?: number | null;
  chartStyleMarkerSymbol?: string | null;
  chartexDataPointStyle?: ChartExElementStyle | null;
  chartexDataPointLineStyle?: ChartExElementStyle | null;
  chartexSeriesLineStyle?: ChartExElementStyle | null;
  chartexDataPointMarkerStyle?: ChartExElementStyle | null;
  chartexMarkerSizePt?: number | null;
  chartexMarkerSymbol?: string | null;
  chartexConnectorLines?: boolean | null;
}
interface ChartStockBarPaint {
  fillColor?: string | null;
  fill?: SolidFill | GradientFill | PatternFill | null;
  fillPaintAuthored?: boolean | null;
  fillHidden?: boolean | null;
  lineColor?: string | null;
  linePaintAuthored?: boolean | null;
  lineWidthEmu?: number | null;
  lineDash?: string | null;
  lineCap?: string | null;
  lineJoin?: string | null;
  lineHidden?: boolean | null;
}
interface ChartStockUpDownBarStyle {
  gapWidthPercent: number;
  up: ChartStockBarPaint;
  down: ChartStockBarPaint;
}
interface ChartDecorationLineStyle {
  color?: string | null;
  paintAuthored?: boolean | null;
  widthEmu?: number | null;
  dash?: string | null;
  cap?: string | null;
  join?: string | null;
  hidden?: boolean | null;
}
interface ChartLineGroupDecorations {
  groupIndex: number;
  dropLines?: ChartDecorationLineStyle | null;
  hiLowLines?: ChartDecorationLineStyle | null;
  upDownBars?: ChartStockUpDownBarStyle | null;
}
interface ChartAreaGroupDecorations {
  groupIndex: number;
  dropLines?: ChartDecorationLineStyle | null;
}
interface ChartBarGroupDecorations {
  groupIndex: number;
  seriesLines?: ChartDecorationLineStyle[] | null;
}
interface ChartOfPie {
  type: 'pie' | 'bar';
  splitType: 'auto' | 'cust' | 'percent' | 'pos' | 'val';
  splitTypeAuthored?: boolean | null;
  splitPos?: number | null;
  splitPosAuthored?: boolean | null;
  customSplitIndices?: number[] | null;
  secondPieSizePercent: number;
  gapWidthPercent: number;
  seriesLines: boolean;
}
interface ChartThreeDSurface {
  style?: ChartExElementStyle | null;
  fillColor?: string | null;
  fillHidden?: boolean | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  lineDash?: string | null;
  lineHidden?: boolean | null;
  thicknessPercent?: number | null;
  pictureOptions?: ChartThreeDPictureOptions | null;
}
interface ChartThreeDPictureOptions {
  applyToFront?: boolean | null;
  applyToSides?: boolean | null;
  applyToEnd?: boolean | null;
  pictureFormat?: 'stretch' | 'stack' | 'stackScale' | string | null;
  pictureFormatAuthored?: boolean | null;
  pictureStackUnit?: number | null;
  pictureStackUnitAuthored?: boolean | null;
}
interface ChartThreeD {
  view3DPresent?: boolean | null;
  rotationX?: number | null;
  rotationXAuthored?: boolean | null;
  rotationY?: number | null;
  rotationYAuthored?: boolean | null;
  heightPercent?: number | null;
  heightPercentAuthored?: boolean | null;
  depthPercent?: number | null;
  depthPercentAuthored?: boolean | null;
  perspective?: number | null;
  perspectiveAuthored?: boolean | null;
  rightAngleAxes?: boolean | null;
  rightAngleAxesAuthored?: boolean | null;
  gapDepthPercent?: number | null;
  gapDepthPercentAuthored?: boolean | null;
  shape?: string | null;
  barGrouping?: 'standard' | 'clustered' | 'stacked' | 'percentStacked' | string | null;
  seriesAxis?: ChartThreeDSeriesAxis | null;
  floor?: ChartThreeDSurface | null;
  sideWall?: ChartThreeDSurface | null;
  backWall?: ChartThreeDSurface | null;
}
interface ChartThreeDSeriesAxis {
  title?: string | null;
  hidden: boolean;
  orientation?: 'minMax' | 'maxMin' | string | null;
  tickLabelPos?: string | null;
  tickLabelSkip?: number | null;
  tickMarkSkip?: number | null;
  majorTickMark: string;
  minorTickMark?: string | null;
  fontColor?: string | null;
  fontSizeHpt?: number | null;
  fontBold?: boolean | null;
  fontItalic?: boolean | null;
  fontFace?: string | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  lineDash?: string | null;
  linePaintAuthored?: boolean | null;
  lineHidden: boolean;
  titleFontSizeHpt?: number | null;
  titleFontBold?: boolean | null;
  titleFontItalic?: boolean | null;
  titleFontColor?: string | null;
  titleFontFace?: string | null;
  titleRotation?: number | null;
  titleVerticalMode?: ChartModel['catAxisTitleVerticalMode'];
  titleManualLayout?: ChartManualLayout | null;
}
interface ChartTextRun {
  text: string;
  fontSizeHpt?: number | null;
  bold?: boolean | null;
  italic?: boolean | null;
  color?: string | null;
  colorPaintAuthored?: boolean | null;
  colorHidden?: boolean | null;
  fontFace?: string | null;
  language?: string | null;
  baseline?: number | null;
  paragraphAlign?: 'l' | 'ctr' | 'r' | 'just' | 'dist' | string | null;
}
interface ChartTextParagraph {
  runs: ChartTextRun[];
  align?: 'l' | 'ctr' | 'r' | 'just' | 'dist' | string | null;
}
interface ChartTextBox {
  x: number;
  y: number;
  w: number;
  h: number;
  paragraphs: ChartTextParagraph[];
  verticalAnchor?: 't' | 'ctr' | 'b' | 'just' | 'dist' | string | null;
  wrap?: 'none' | 'square' | string | null;
  lIns?: number;
  tIns?: number;
  rIns?: number;
  bIns?: number;
}
interface ChartexBoxSeries {
  name: string;
  chartexFormatIdx?: number | null;
  color?: string | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  chartexStyle?: ChartExElementStyle | null;
  valuesByCategory: number[][];
  meanMarker: boolean;
  meanLine: boolean;
  showOutliers: boolean;
  showNonoutliers: boolean;
  quartileMethod: string;
}
interface ChartexBoxWhisker {
  oneBoxPerSeries?: boolean;
  categories: string[];
  series: ChartexBoxSeries[];
}
interface ChartexSunburstRow {
  path: string[];
  size: number;
}
interface ChartexSunburst {
  rows: ChartexSunburstRow[];
}
interface ChartexTreemap {
  rows: ChartexSunburstRow[];
  parentLabelLayout?: string | null;
}
interface ChartexRegionMapRow {
  label: string;
  entityId?: string | null;
  value?: number | null;
}
interface ChartexGeography {
  projectionType?: 'mercator' | 'miller' | 'robinson' | 'albers' | string | null;
  viewedRegionType?: string | null;
  cultureLanguage?: string | null;
  cultureRegion?: string | null;
  attribution?: string | null;
  cacheProvider?: string | null;
  cachePresent: boolean;
}
interface ChartexValueColorStop {
  kind: 'extremeValue' | 'number' | 'percent' | string;
  value?: number | null;
}
interface ChartexRegionMapColors {
  stopCount?: 2 | 3 | null;
  minColor?: string | null;
  midColor?: string | null;
  maxColor?: string | null;
  minPosition?: ChartexValueColorStop | null;
  midPosition?: ChartexValueColorStop | null;
  maxPosition?: ChartexValueColorStop | null;
}
interface ChartexRegionMap {
  rows: ChartexRegionMapRow[];
  regionLabelLayout?: 'none' | 'bestFitOnly' | 'showAll' | null;
  geography?: ChartexGeography | null;
  colors?: ChartexRegionMapColors | null;
}
interface ChartexHistogramBinning {
  binSize?: number | null;
  binCount?: number | null;
  intervalClosed?: 'l' | 'r' | null;
  underflow?: number | null;
  overflow?: number | null;
}
interface SecondaryValueAxis {
  min: number | null;
  max: number | null;
  title: string | null;
  hidden: boolean;
  formatCode?: string | null;
  displayUnits?: ChartDisplayUnits | null;
  fontColor?: string | null;
  fontSizeHpt?: number | null;
  fontItalic?: boolean | null;
  fontBold?: boolean | null;
  fontFace?: string | null;
  lineColor?: string | null;
  lineWidthEmu?: number | null;
  lineDash?: string | null;
  lineHidden: boolean;
  majorTickMark: string;
  minorTickMark?: string | null;
  minorGridlines?: boolean;
  minorGridlineColor?: string | null;
  minorGridlineWidthEmu?: number | null;
  minorGridlineDash?: string | null;
  majorGridlines?: boolean;
  majorGridlineColor?: string | null;
  majorGridlineWidthEmu?: number | null;
  majorGridlineDash?: string | null;
  majorUnit?: number | null;
  minorUnit?: number | null;
  logBase?: number | null;
  orientation?: 'minMax' | 'maxMin' | string | null;
  tickLabelPos?: string | null;
  labelAlignment?: 'l' | 'ctr' | 'r' | null;
  labelOffsetPercent?: number | null;
  tickLabelSkip?: number | null;
  tickMarkSkip?: number | null;
  crosses?: string | null;
  crossesAt?: number | null;
  titleFontSizeHpt?: number | null;
  titleFontBold?: boolean | null;
  titleFontItalic?: boolean | null;
  titleFontColor?: string | null;
  titleFontFace?: string | null;
  titleRotation?: number | null;
  titleVerticalMode?: 'horz' | 'vert' | 'vert270' | 'wordArtVert' | 'eaVert' | 'mongolianVert' | 'wordArtVertRtl' | null;
  titleManualLayout?: ChartManualLayout | null;
}
interface ChartDisplayUnits {
  divisor: number;
  builtInUnit?: string | null;
  label?: ChartDisplayUnitsLabel | null;
}
interface ChartDisplayUnitsLabel {
  text?: string | null;
  manualLayout?: ChartManualLayout | null;
  fontSizeHpt?: number | null;
  fontBold?: boolean | null;
  fontItalic?: boolean | null;
  fontColor?: string | null;
  fontFace?: string | null;
  rotation?: number | null;
  boxStyle?: ChartLabelBox | null;
}
interface ChartManualLayout {
  xMode?: string;
  yMode?: string;
  wMode?: string;
  hMode?: string;
  layoutTarget?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}
interface LegendManualLayout {
  xMode?: string;
  yMode?: string;
  wMode?: string;
  hMode?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}
interface ChartLegendEntryOverride {
  idx: number;
  deleted?: boolean | null;
  fontFace?: string | null;
  fontColor?: string | null;
  fontSizeHpt?: number | null;
  fontBold?: boolean | null;
}
interface ChartRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
//#endregion
//#region dist/.types-work/chart-ex-contract-D-MROxI4.d.ts
interface ChartExRenderer {
  render(ctx: CanvasRenderingContext2D, chart: ChartModel, rect: ChartRect, ptToPx: number, shapeRotationDeg?: number): boolean;
}
//#endregion
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
//#region dist/.types-work/three-d-contract-2IUr35q1.d.ts
interface ChartThreeDRenderer {
  render(ctx: CanvasRenderingContext2D, chart: ChartModel, rect: ChartRect, ptToPx: number, shapeRotationDeg?: number): boolean;
}
//#endregion
//#region dist/.types-work/region-map-contract-CtuTzdmN.d.ts
interface ChartRegionMapRenderer {
  render(ctx: CanvasRenderingContext2D, chart: ChartModel, rect: ChartRect, ptToPx: number, shapeRotationDeg?: number): boolean;
}
//#endregion
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
//#region dist/.types-work/hyperlink-92bQUogu.d.ts
type OoxmlErrorCode = 'encrypted' | 'invalid-password' | 'unsupported-encryption' | 'legacy-binary-format' | 'not-ooxml';
type OoxmlErrorStage = 'container' | 'decompression' | 'parsing' | 'serialization' | 'layout' | 'rendering' | 'worker';
declare class OoxmlError extends Error {
  readonly code: OoxmlErrorCode;
  constructor(code: OoxmlErrorCode, message: string);
}
type OoxmlFormat = 'docx' | 'xlsx' | 'pptx';
interface OoxmlResourceUsageSnapshot {
  readonly archiveEntryCount: number;
  readonly declaredInflatedBytes: number;
  readonly largestInflatedEntryBytes?: number;
  readonly distinctInflatedBytes: number;
  readonly operationInflatedBytes: number;
}
type ExtensibleLiteral<Known extends string> = Known | (string & Record<never, never>);
type OoxmlResourceName = ExtensibleLiteral<'archive' | 'archive-entry' | 'xml-event' | 'xml-context' | 'xml-tree' | 'worksheet-row' | 'worksheet-shell'>;
type OoxmlResourceMetric = ExtensibleLiteral<'declared-inflated-bytes' | 'actual-inflated-bytes' | 'entry-count' | 'central-directory-bytes' | 'distinct-inflated-bytes' | 'bytes' | 'depth' | 'projected-bytes'>;
interface OoxmlResourceViolation {
  readonly format: OoxmlFormat;
  readonly operation: string;
  readonly resource: OoxmlResourceName;
  readonly metric: OoxmlResourceMetric;
  readonly part?: string;
  readonly limit: number;
  readonly observed: number;
  readonly configurable: boolean;
  readonly usage: OoxmlResourceUsageSnapshot;
}
interface OoxmlResourceLimitErrorDetails {
  readonly stage: OoxmlErrorStage;
  readonly violation: OoxmlResourceViolation;
}
declare class OoxmlResourceLimitError extends Error {
  readonly code: 'ooxml-resource-limit';
  readonly details: OoxmlResourceLimitErrorDetails;
  constructor(message: string, details: OoxmlResourceLimitErrorDetails);
}
interface OoxmlResourcePolicySnapshot {
  readonly maxArchiveEntryBytes: number | null;
  readonly maxTotalInflatedBytes: number | null;
  readonly maxArchiveEntries: number | null;
}
interface OoxmlResourceMetricsCheckpoint {
  readonly name: string;
  readonly elapsedMs: number;
  readonly usage?: OoxmlResourceUsageSnapshot;
}
interface OoxmlResourceMetrics {
  readonly schemaVersion: 1;
  readonly scope: 'load' | 'session';
  readonly format: OoxmlFormat;
  readonly mode: 'main' | 'worker' | 'node';
  readonly status: 'ok' | 'error';
  readonly sourceBytes?: number;
  readonly elapsedMs: number;
  readonly policy: Readonly<OoxmlResourcePolicySnapshot>;
  readonly usage?: OoxmlResourceUsageSnapshot;
  readonly checkpoints: readonly OoxmlResourceMetricsCheckpoint[];
  readonly outcome?: Readonly<Record<string, number>>;
  readonly error?: Readonly<{
    readonly code?: string;
    readonly stage?: string;
    readonly resource?: string;
    readonly metric?: string;
  }>;
}
type OoxmlResourceLimit = number | null;
interface OoxmlResourceLimits {
  maxArchiveEntryBytes?: OoxmlResourceLimit;
  maxTotalInflatedBytes?: OoxmlResourceLimit;
  maxArchiveEntries?: OoxmlResourceLimit;
}
interface ProgressiveLayoutProgress {
  committedUnits: number;
}
interface ProgressiveLayoutPartial {
  availableUnits: number;
  totalUnits?: number;
  exact: boolean;
}
interface LoadOptions$1 {
  useGoogleFonts?: boolean;
  password?: string;
  wasmUrl?: string | URL;
  maxZipEntryBytes?: number;
  resourceLimits?: OoxmlResourceLimits;
  debug?: boolean;
  onResourceMetrics?: (metrics: OoxmlResourceMetrics) => void;
  workerTimeoutMs?: number;
  math?: MathRenderer;
  threeD?: ChartThreeDRenderer;
  regionMap?: ChartRegionMapRenderer;
  chartEx?: ChartExRenderer;
  tiff?: TiffRenderer;
}
type OoxmlDecodedImageLimitMetric = 'image-dimension' | 'image-pixels' | 'active-decoded-bytes';
declare class OoxmlDecodedImageLimitError extends RangeError {
  readonly metric: OoxmlDecodedImageLimitMetric;
  readonly limit: number;
  readonly observed: number;
  readonly code: 'ooxml-decoded-image-limit';
  constructor(metric: OoxmlDecodedImageLimitMetric, limit: number, observed: number);
}
declare function isOoxmlDecodedImageLimitError(error: unknown): error is OoxmlDecodedImageLimitError;
type HyperlinkTarget = {
  kind: 'external';
  url: string;
} | {
  kind: 'internal';
  ref: string;
  slideIndex?: number;
};
declare function openExternalHyperlink(url: string, allowed?: readonly string[], win?: Pick<Window, 'open'> | undefined): boolean;
//#endregion
//#region dist/.types-work/find-highlight-CEEVmKfp.d.ts
interface TextSelectionContextOptions {
  readonly maxTextCharacters?: number;
  readonly maxRunLocators?: number;
}
interface ViewerContextMenuEvent<TContext> {
  readonly originalEvent: MouseEvent;
  getContext(): Promise<TContext | null>;
}
interface ViewerCommentsOptions {
  readonly includeResolved?: boolean;
}
type ViewerCommentConnectorRoute = 'bezier' | 'orthogonal';
type ViewerCommentConnectorStroke = 'solid' | 'dashed';
interface ViewerCommentConnectorOptions {
  readonly route?: ViewerCommentConnectorRoute;
  readonly stroke?: ViewerCommentConnectorStroke;
  readonly color?: string;
  readonly activeColor?: string;
}
interface ViewerCommentMessageContext {
  readonly id?: string;
  readonly author?: string;
  readonly date?: string;
  readonly text: string;
  readonly status?: 'active' | 'resolved' | 'closed';
}
interface ViewerCommentThreadContext {
  readonly root: ViewerCommentMessageContext;
  readonly replies: readonly ViewerCommentMessageContext[];
}
interface AutoResizeOptions {
  pauseWhenHidden?: boolean;
}
declare function autoResize(render: (width: number, height: number) => void | Promise<void>, element: Element, opts?: AutoResizeOptions): () => void;
interface ZoomableViewer {
  getScale(): number;
  setScale(scale: number): void | Promise<void>;
  zoomIn(): void | Promise<void>;
  zoomOut(): void | Promise<void>;
  fitWidth(): void | Promise<void>;
  fitPage(): void | Promise<void>;
}
interface MatchRunSlice {
  runIndex: number;
  start: number;
  end: number;
}
interface FindMatchesOptions {
  caseSensitive?: boolean;
}
interface FindMatch<Loc = unknown> {
  matchIndex: number;
  text: string;
  location: Loc;
}
interface FindHighlightColors {
  match?: string;
  active?: string;
}
//#endregion
//#region dist/.types-work/types-BYLigRmk.d.ts
interface BlipBullet {
  type: 'blip';
  imagePath: string;
  mimeType: string;
  sizePct: number | null;
  sizePts?: number;
}
type Bullet = Bullet$1 | BlipBullet;
interface Paragraph extends Paragraph$1 {
  eaLnBrk: boolean;
  defTabSz?: number;
}
interface TextBody extends TextBody$1 {
  rtlCol?: boolean;
  textWarp?: {
    preset: string;
    adj?: number[];
  };
  paragraphs: Paragraph[];
}
interface Presentation {
  slideWidth: number;
  slideHeight: number;
  slides: Slide[];
  defaultTextColor: string | null;
  majorFont: string | null;
  minorFont: string | null;
  hlinkColor?: string;
  folHlinkColor?: string;
}
interface Slide {
  index: number;
  slideNumber: number;
  partName?: string;
  background: Fill | null;
  elements: SlideElement[];
  elementSources?: SlideElementSource[];
  notes?: string;
  comments?: PptxComment[];
  hidden?: boolean;
  parseError?: string;
}
type SlideElementOrigin = 'master' | 'layout' | 'slide';
interface SlideElementSource {
  origin: SlideElementOrigin;
}
interface DimOptions {
  color: string;
  opacity: number;
}
type PptxCommentAnchor = Readonly<{
  type: 'slide';
}> | Readonly<{
  type: 'drawingElement';
  elementId?: string;
  creationId?: string;
}> | Readonly<{
  type: 'textRange';
  elementId?: string;
  start?: number;
  length?: number;
}> | Readonly<{
  type: 'unknown';
}>;
interface PptxComment {
  authorId?: number;
  modernAuthorId?: string;
  id?: string;
  index?: number;
  author?: string;
  date?: string;
  x?: number;
  y?: number;
  anchors?: readonly Readonly<PptxCommentAnchor>[];
  status?: 'active' | 'resolved' | 'closed';
  text: string;
  replies?: readonly Readonly<PptxCommentReply>[];
}
interface PptxCommentReply {
  id?: string;
  authorId?: string;
  author?: string;
  date?: string;
  status?: 'active' | 'resolved' | 'closed';
  text: string;
}
type SlideElement = ShapeElement | PictureElement | TableElement | ChartElement | MediaElement;
interface MediaElement {
  type: 'media';
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  mediaKind: 'audio' | 'video';
  posterPath: string;
  posterMimeType: string;
  mediaPath: string;
  mimeType: string;
}
interface ShapeElement {
  type: 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  geometry: string;
  fill: Fill | null;
  stroke: Stroke | null;
  textBody: TextBody | null;
  defaultTextColor: string | null;
  custGeom: PathCmd[][] | null;
  adj: number | null;
  adj2: number | null;
  adj3: number | null;
  adj4: number | null;
  adj5: number | null;
  adj6: number | null;
  adj7: number | null;
  adj8: number | null;
  shadow: Shadow | null;
  innerShadow?: Shadow;
  glow?: Glow;
  softEdge?: SoftEdge;
  reflection?: Reflection;
  textRect?: TextRect;
  scene3d?: Scene3d;
  sp3d?: Sp3d;
  id?: string;
  name?: string;
  hyperlink?: string;
  hyperlinkAction?: string;
}
interface TextRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Rot3d {
  lat: number;
  lon: number;
  rev: number;
}
interface Camera3d {
  prst: string;
  fov?: number;
  zoom?: number;
  rot?: Rot3d;
}
interface LightRig {
  rig: string;
  dir: string;
  rot?: Rot3d;
}
interface Scene3d {
  camera: Camera3d;
  lightRig?: LightRig;
}
interface Bevel3d {
  w: number;
  h: number;
  prst: string;
}
interface Sp3d {
  z?: number;
  extrusionH?: number;
  contourW?: number;
  contourClr?: string;
  extrusionClr?: string;
  prstMaterial: string;
  bevelT?: Bevel3d;
  bevelB?: Bevel3d;
}
interface TableElement {
  type: 'table';
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  cols: number[];
  rows: TableRow[];
  rtl?: boolean;
}
interface TableRow {
  height: number;
  cells: TableCell[];
}
interface TableCell {
  textBody: TextBody | null;
  fill: Fill | null;
  textColor?: string;
  borderL: Stroke | null;
  borderR: Stroke | null;
  borderT: Stroke | null;
  borderB: Stroke | null;
  diagonalTL?: Stroke | null;
  diagonalTR?: Stroke | null;
  gridSpan: number;
  rowSpan: number;
  hMerge: boolean;
  vMerge: boolean;
}
interface ChartElement {
  type: 'chart';
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  chart: ChartModel;
}
interface PictureElement {
  type: 'picture';
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  imagePath: string;
  mimeType: string;
  svgImagePath?: string;
  intrinsicWidthPx?: number;
  intrinsicHeightPx?: number;
  stroke: Stroke | null;
  prstGeom?: string;
  prstAdjust?: number[];
  srcRect?: {
    l: number;
    t: number;
    r: number;
    b: number;
  };
  alpha?: number;
  duotone?: Duotone;
  custGeom?: PathCmd[][] | null;
  shadow?: Shadow;
  innerShadow?: Shadow;
  glow?: Glow;
  softEdge?: SoftEdge;
  reflection?: Reflection;
  scene3d?: Scene3d;
  sp3d?: Sp3d;
}
//#endregion
//#region dist/.types-work/pptx-BlT4_QTU.d.ts
interface PptxTextRunInfo {
  elementIndex?: number;
  origin?: SlideElementOrigin;
  shapeId?: string;
  text: string;
  inShapeX: number;
  inShapeY: number;
  w: number;
  h: number;
  fontSize: number;
  font: string;
  shapeX: number;
  shapeY: number;
  shapeW: number;
  shapeH: number;
  rotation: number;
  shapeFlipH?: boolean;
  shapeFlipV?: boolean;
  tableCell?: Readonly<{
    row: number;
    column: number;
  }>;
  textBodyRotation?: number;
  hyperlink?: HyperlinkTarget;
}
type TextRunCallback = (run: PptxTextRunInfo) => void;
type SlideRenderOptions = RenderOptions & {
  math?: MathRenderer;
  threeD?: ChartThreeDRenderer;
  regionMap?: ChartRegionMapRenderer;
  chartEx?: ChartExRenderer;
  tiff?: TiffRenderer;
  dim?: DimOptions;
};
declare function renderSlide(canvas: HTMLCanvasElement | OffscreenCanvas, slide: Slide, slideWidth: number, slideHeight: number, opts?: SlideRenderOptions, onTextRun?: TextRunCallback): Promise<HTMLCanvasElement | OffscreenCanvas>;
interface PptxMatchLocation {
  slide: number;
}
interface PresentationHandle {
  play(mediaPath?: string): void;
  pause(mediaPath?: string): void;
  destroy(): void;
}
interface PptxSelectionRunLocator {
  readonly slideIndex: number;
  readonly runIndex: number;
  readonly shapeId?: string;
  readonly elementIndex?: number;
  readonly origin?: SlideElementOrigin;
}
interface PptxTextSelectionContext {
  readonly format: 'pptx';
  readonly kind: 'text';
  readonly text: string;
  readonly slideIndexes: readonly number[];
  readonly shapeIds: readonly string[];
  readonly runs: readonly PptxSelectionRunLocator[];
  readonly truncated: boolean;
  readonly truncationReasons: readonly ('text' | 'runs')[];
  readonly textCharacters: number;
  readonly maxTextCharacters: number;
  readonly maxRunLocators: number;
}
interface PptxCommentSelectionContext {
  readonly format: 'pptx';
  readonly kind: 'comment';
  readonly slideIndex: number;
  readonly commentIndex: number;
  readonly occurrenceId: string;
  readonly commentId?: string;
  readonly point?: Readonly<{
    x: number;
    y: number;
  }>;
  readonly thread: ViewerCommentThreadContext;
  readonly truncated: boolean;
  readonly truncationReasons: readonly ('text')[];
  readonly textCharacters: number;
  readonly maxTextCharacters: number;
}
declare function readPptxTextSelectionContext(root: HTMLElement, selection: Selection | null, options?: TextSelectionContextOptions): PptxTextSelectionContext | null;
type PptxSelectionContextOptions = TextSelectionContextOptions;
interface PptxSlidePoint {
  readonly x: number;
  readonly y: number;
}
interface PptxElementContextOptions {
  readonly tolerance?: number;
  readonly maxTextCharacters?: number;
}
interface PptxElementContext {
  readonly format: 'pptx';
  readonly kind: 'element';
  readonly slideIndex: number;
  readonly elementIndex: number;
  readonly origin: SlideElementOrigin | 'unknown';
  readonly elementType: SlideElement['type'];
  readonly point: PptxSlidePoint;
  readonly bounds: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
  }>;
  readonly shapeId?: string;
  readonly name?: string;
  readonly geometry?: string;
  readonly text?: string;
  readonly mimeType?: string;
  readonly mediaKind?: 'audio' | 'video';
  readonly rowCount?: number;
  readonly columnCount?: number;
  readonly seriesCount?: number;
  readonly truncated: boolean;
  readonly truncationReasons: readonly ('text')[];
  readonly textCharacters: number;
  readonly maxTextCharacters: number;
}
interface PptxElementBounds {
  readonly elementId: string;
  readonly elementIndex: number;
  readonly origin: SlideElementOrigin | 'unknown';
  readonly elementType: SlideElement['type'];
  readonly bounds: PptxElementContext['bounds'];
}
type PptxSelectionContext = PptxTextSelectionContext | PptxCommentSelectionContext | PptxElementContext;
type LoadOptions = LoadOptions$1 & {
  mode?: 'main' | 'worker';
  progressiveLayout?: boolean;
  onLayoutProgress?: (progress: Readonly<ProgressiveLayoutProgress>) => void;
  onLayoutPartial?: (progress: Readonly<ProgressiveLayoutPartial>) => void;
  onLayoutComplete?: (error?: unknown) => void;
};
interface RenderSlideToBitmapOptions {
  width?: number;
  dpr?: number;
  imageResources?: ImageResourceOptions;
  dim?: DimOptions;
  onTextRun?: TextRunCallback;
}
interface RenderSlideOptions {
  width?: number;
  dpr?: number;
  imageResources?: ImageResourceOptions;
  onTextRun?: TextRunCallback;
  skipMediaControls?: boolean;
  dim?: DimOptions;
}
interface PresentSlideOptions extends Omit<RenderSlideOptions, 'skipMediaControls'> {
  onError?: (error: Error) => void;
}
declare class PptxPresentation {
  private _metrics;
  private readonly _worker;
  private readonly _bridge;
  private _mode;
  private _bootstrap;
  private _preflight;
  private _availableSlideCount;
  private readonly _layoutLifecycle;
  private readonly _layoutObservers;
  private _layoutCompletion;
  private _parseRequestId;
  private _progressive;
  private _progressiveWatchdog;
  private _progressiveWatchdogMs;
  private readonly _layoutWaiters;
  private _slides;
  private _slidePullClient;
  private _resourceFailure;
  private _slidePartIndex;
  private readonly _rawParts;
  private _googleFontFaces;
  private _embeddedFontFaces;
  private _embeddedFontAliases;
  private _embeddedFontAuthoredFamilies;
  private _destroyed;
  private readonly _fetchImage;
  private readonly _fetchMedia;
  private _math;
  private _threeD;
  private _regionMap;
  private _chartEx;
  private _tiff;
  private constructor();
  private _assertResourceHealthy;
  private _rethrowWithResourceFailure;
  static load(source: string | ArrayBuffer, opts?: LoadOptions): Promise<PptxPresentation>;
  private _parse;
  private _parseMainProgressively;
  private _parseWorkerProgressively;
  private _createSlidePullClient;
  private _onWorkerLayoutPush;
  private _applyProgressivePrefix;
  private _finishProgressiveLayout;
  private _failProgressiveLayout;
  private _wakeLayoutWaiters;
  private _rearmProgressiveWatchdog;
  private _clearProgressiveWatchdog;
  private _waitForSlide;
  private _assertSlideIndex;
  get slideCount(): number;
  get availableSlideCount(): number;
  get layoutComplete(): boolean;
  waitUntilLayoutComplete(): Promise<void>;
  get slideWidth(): number;
  get slideHeight(): number;
  get mode(): 'main' | 'worker';
  getNotes(slideIndex: number): string | null;
  getComments(slideIndex: number): readonly Readonly<PptxComment>[];
  isHidden(slideIndex: number): boolean;
  private _partNames;
  private _partIndex;
  getSlideIndexByPartName(partName: string): number | undefined;
  resolveInternalTarget(ref: string, currentIndex?: number): number | undefined;
  renderSlide(canvas: HTMLCanvasElement | OffscreenCanvas, slideIndex: number, opts?: RenderSlideOptions): Promise<void>;
  renderSlideToBitmap(slideIndex: number, opts?: RenderSlideToBitmapOptions): Promise<ImageBitmap>;
  collectSlideRuns(slideIndex: number, width?: number): Promise<PptxTextRunInfo[]>;
  getElementContextAt(slideIndex: number, point: PptxSlidePoint, options?: PptxElementContextOptions): Promise<PptxElementContext | null>;
  getElementBoundsByIds(slideIndex: number, elementIds: readonly string[]): Promise<readonly PptxElementBounds[]>;
  getMedia(mediaPath: string): Promise<Blob>;
  private _findMimeTypeForPath;
  getImage(imagePath: string, mimeType: string): Promise<Blob>;
  private getFontBytes;
  getResourceMetrics(): Promise<OoxmlResourceMetrics>;
  toMarkdown(): Promise<string>;
  presentSlide(canvas: HTMLCanvasElement, slideIndex: number, opts?: PresentSlideOptions): Promise<PresentationHandle>;
  destroy(): void;
}
type HiddenSlideMode = 'show' | 'skip' | 'dim';
interface PptxViewerOptions extends Pick<RenderOptions, 'width' | 'dpr' | 'imageResources'>, LoadOptions {
  onSlideChange?: (index: number, total: number, layoutComplete: boolean) => void;
  onError?: (err: Error) => void;
  zoomMin?: number;
  zoomMax?: number;
  onScaleChange?: (scale: number) => void;
  enableMediaPlayback?: boolean;
  enableTextSelection?: boolean;
  enableElementSelection?: boolean;
  elementHitTolerance?: number;
  onSelectionContextChange?: (context: PptxSelectionContext | null) => void;
  onContextMenu?: (event: ViewerContextMenuEvent<PptxSelectionContext>) => void;
  findHighlightColors?: FindHighlightColors;
  hiddenSlideMode?: HiddenSlideMode;
  hiddenSlideDim?: Partial<DimOptions>;
  onHyperlinkClick?: (target: HyperlinkTarget) => void;
  enableHyperlinks?: boolean;
}
declare class PptxViewer implements ZoomableViewer {
  private readonly canvas;
  private readonly wrapper;
  private readonly canvasMount;
  private _scale;
  private textLayer;
  private highlightLayer;
  private elementLayer;
  private _find;
  private _findGeneration;
  private _measureCtx;
  private readonly presentationOwner;
  private get engine();
  private readonly borrowed;
  private readonly hostWindow;
  private readonly opts;
  private currentSlide;
  private _renderedSlide;
  private _hiddenMode;
  private handle;
  private readonly _mode;
  private readonly renderDispatcher;
  private readonly errorRouter;
  private destroyed;
  private selectionChangeListener;
  private selectionContextKey;
  private elementClickListener;
  private contextMenuListener;
  private elementContext;
  private elementHitGeneration;
  private readonly elementHitTolerance;
  private readonly _loadingLayer;
  private _layoutUnsubscribe;
  private readonly _layoutWaiters;
  private _layoutFailed;
  private _navigationGeneration;
  private _renderProgressGeneration;
  private _lastReportedSlide;
  private _lastReportedTotal;
  private _lastReportedAvailable;
  private _lastReportedLayoutComplete;
  static fromPresentation(canvas: HTMLCanvasElement, presentation: PptxPresentation, opts?: Omit<PptxViewerOptions, keyof LoadOptions>): Omit<PptxViewer, 'load'>;
  constructor(canvas: HTMLCanvasElement, opts?: PptxViewerOptions);
  load(source: string | ArrayBuffer): Promise<void>;
  goToSlide(index: number): Promise<void>;
  private _goToSlide;
  nextSlide(): Promise<void>;
  prevSlide(): Promise<void>;
  private _step;
  private _initialSlide;
  private _dim;
  setHiddenSlideMode(mode: HiddenSlideMode): Promise<void>;
  get hiddenSlideMode(): HiddenSlideMode;
  get visibleSlideCount(): number;
  get slideIndex(): number;
  get slideCount(): number;
  get availableSlideCount(): number;
  get layoutComplete(): boolean;
  waitUntilLayoutComplete(): Promise<void>;
  getNotes(slideIndex: number): string | null;
  get canvasElement(): HTMLCanvasElement;
  private _naturalWidthPx;
  private _targetWidth;
  getScale(): number;
  private _zoomMin;
  private _zoomMax;
  setScale(scale: number): Promise<void>;
  zoomIn(): Promise<void>;
  zoomOut(): Promise<void>;
  fitWidth(): Promise<void>;
  fitPage(): Promise<void>;
  private _fit;
  private renderCurrentSlide;
  private _bindLayoutPresentation;
  private _unbindLayoutPresentation;
  private _beginNavigation;
  private _onLayoutPublication;
  private _waitForSlide;
  private _wakeLayoutWaiters;
  private _emitSlideChange;
  private _setLoading;
  private _buildHighlightLayer;
  private _measureForFont;
  private _collectSlideRuns;
  findText(query: string, opts?: FindMatchesOptions): Promise<FindMatch<PptxMatchLocation>[]>;
  findNext(): Promise<FindMatch<PptxMatchLocation> | null>;
  findPrev(): Promise<FindMatch<PptxMatchLocation> | null>;
  clearFind(): void;
  private _invalidateFind;
  private _activateMatch;
  private _redrawHighlights;
  private _buildTextLayer;
  private _hyperlinkHandler;
  private _onHyperlinkClick;
  private _resolveInternalSlideIndex;
  private _reportRenderError;
  getResourceMetrics(): Promise<OoxmlResourceMetrics>;
  getSelectionContext(options?: PptxSelectionContextOptions): PptxSelectionContext | null;
  private _emitSelectionContextChange;
  private _setElementContext;
  private _invalidateElementSelection;
  private _redrawElementOutline;
  private _onElementClick;
  private _onContextMenu;
  private _resolveContextAt;
  destroy(): void;
}
interface PptxCommentsOptions extends ViewerCommentsOptions {
  readonly cards?: boolean;
  readonly side?: 'auto' | 'left' | 'right';
  readonly markers?: boolean;
  readonly connectors?: ViewerCommentConnectorOptions;
}
interface PptxScrollViewerOptions extends Pick<RenderSlideOptions, 'width' | 'dpr' | 'imageResources'>, LoadOptions {
  width?: number;
  gap?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  overscan?: number;
  enableTextSelection?: boolean;
  comments?: boolean | PptxCommentsOptions;
  enableElementSelection?: boolean;
  elementHitTolerance?: number;
  onSelectionContextChange?: (context: PptxSelectionContext | null) => void;
  onContextMenu?: (event: ViewerContextMenuEvent<PptxSelectionContext>) => void;
  findHighlightColors?: FindHighlightColors;
  enableMediaPlayback?: boolean;
  mediaOverscan?: number;
  zoomMin?: number;
  zoomMax?: number;
  enableZoom?: boolean;
  refitOnResize?: boolean;
  background?: string;
  pageShadow?: string | false;
  onVisibleSlideChange?: (topIndex: number, total: number, layoutComplete: boolean) => void;
  onScaleChange?: (scale: number) => void;
  onError?: (err: Error) => void;
  onHyperlinkClick?: (target: HyperlinkTarget) => void;
  enableHyperlinks?: boolean;
}
declare class PptxScrollViewer implements ZoomableViewer {
  private readonly _presentationOwner;
  private get _pres();
  private readonly _borrowed;
  private readonly _opts;
  private readonly _errorRouter;
  private readonly _container;
  private readonly _wrapper;
  private readonly _scrollHost;
  private readonly _spacer;
  private _mode;
  private _scale;
  private _scaleEstablished;
  private _pendingScale;
  private readonly _slots;
  private readonly _free;
  private _uniformSlideHeight;
  private _lastRange;
  private _lastTopIndex;
  private _lastReportedTotal;
  private _lastReportedLayoutComplete;
  private _layoutUnsubscribe;
  private _scrollListener;
  private _selectionChangeListener;
  private _selectionContextKey;
  private _elementClickListener;
  private _contextMenuListener;
  private _commentOutsidePointerListener;
  private _elementContext;
  private _activeCommentId;
  private _activeCommentSlide;
  private _commentNavigationGeneration;
  private _commentUi;
  private _commentGeometryScheduled;
  private _commentGeometryFrame;
  private readonly _pendingCommentGeometry;
  private _hasComments;
  private _reviewOriginPx;
  private _commentScanFrontier;
  private readonly _layoutWaiters;
  private _layoutFailed;
  private _elementHitGeneration;
  private readonly _elementHitTolerance;
  private _destroyed;
  private readonly _slideInFlight;
  private _renderEpoch;
  private _settleTimer;
  private _wheelListener;
  private _pendingZoomAnchor;
  private _resizeObserver;
  private _prevBase;
  private _lastFitWidth;
  private readonly _pageShadow;
  private readonly _find;
  private _findGeneration;
  private _findActive;
  private _findMeasureCtx;
  static fromPresentation(container: HTMLElement, presentation: PptxPresentation, opts?: Omit<PptxScrollViewerOptions, keyof LoadOptions>): Omit<PptxScrollViewer, 'load'>;
  constructor(container: HTMLElement, opts?: PptxScrollViewerOptions);
  load(source: string | ArrayBuffer): Promise<void>;
  get slideCount(): number;
  get availableSlideCount(): number;
  get layoutComplete(): boolean;
  waitUntilLayoutComplete(): Promise<void>;
  private _slideWidthPx;
  private _slideHeightPx;
  private _fitWidthPx;
  private _commentMarginExtent;
  private _hasCommentMargin;
  private _commentZoom;
  private _commentsEnabled;
  private _commentsOptions;
  private _commentSide;
  private _syncCommentMarginGeometry;
  private _scanAvailableComments;
  private _refreshDiscoveredComments;
  private _baseScale;
  relayout(): void;
  private _relayout;
  private _recomputeHeights;
  private _gap;
  private _overscan;
  private _mediaOverscan;
  private _pad;
  private _padH;
  private _slideOffset;
  private _slideIndexAtOffset;
  private _rangeAt;
  private _range;
  private _mediaRange;
  private _rangeContains;
  private _syncSpacer;
  private _syncSpacerWidth;
  private _onScroll;
  private _mountVisible;
  private _applyPageShadow;
  private _acquireSlot;
  private _recycleSlot;
  private _positionSlot;
  private _dpr;
  private _renderSlot;
  private _trackSlotLoading;
  private _bindLayoutPresentation;
  private _unbindLayoutPresentation;
  private _onLayoutPublication;
  private _wakeLayoutWaiters;
  private _beginCommentNavigation;
  private _waitForSlideMetadata;
  private _emitVisibleSlideChange;
  private _renderInteractiveSlot;
  private _syncMediaPlayback;
  private _reportRenderError;
  private _renderSlotBitmap;
  setScale(scale: number): void;
  getScale(): number;
  zoomIn(): void;
  zoomOut(): void;
  private _effectiveZoomMin;
  fitWidth(): void;
  fitPage(): void;
  private _fit;
  private _previewVisible;
  private _previewSlot;
  private _clearTextLayerPreview;
  private _scheduleSettle;
  private _settleRender;
  private _settleSlot;
  private _settleInteractiveSlot;
  scrollToSlide(index: number, opts?: {
    behavior?: 'auto' | 'smooth';
  }): void;
  private _scrollToSlideCommentTarget;
  private _resolveSlideCommentElementBounds;
  goToComment(slideIndex: number, commentIndex: number, opts?: {
    behavior?: 'auto' | 'smooth';
  }): Promise<boolean>;
  findText(query: string, opts?: FindMatchesOptions): Promise<FindMatch<PptxMatchLocation>[]>;
  findNext(): Promise<FindMatch<PptxMatchLocation> | null>;
  findPrev(): Promise<FindMatch<PptxMatchLocation> | null>;
  clearFind(): void;
  private _invalidateFind;
  private _activateMatch;
  private _collectSlideRuns;
  private _redrawHighlights;
  private _refreshFindRuns;
  private _redrawSlotComments;
  private _redrawSlotCommentConnectors;
  private _commitSlotComments;
  private _ensureSlotCommentAnchors;
  private _scheduleCommentGeometry;
  private _redrawSlotHighlights;
  private _measureForFind;
  private _hyperlinkHandler;
  private _onHyperlinkClick;
  private _resolveInternalSlideIndex;
  private _onResize;
  get topVisibleSlide(): number;
  getResourceMetrics(): Promise<OoxmlResourceMetrics>;
  getSelectionContext(options?: PptxSelectionContextOptions): PptxSelectionContext | null;
  private _emitSelectionContextChange;
  private _setElementContext;
  private _invalidateElementSelection;
  private _redrawElementOutlines;
  private _redrawElementOutlineForSlot;
  private _onElementClick;
  private _onContextMenu;
  private _resolveContextAt;
  destroy(): void;
}
declare function buildPptxTextLayer(layer: HTMLDivElement, runs: PptxTextRunInfo[], cssWidth: number, cssHeight: number, onHyperlinkClick?: (target: HyperlinkTarget) => void, slideIndex?: number): void;
interface PptxHighlightMatch {
  slices: MatchRunSlice[];
  active: boolean;
}
type PptxHighlightColors = FindHighlightColors;
declare function buildPptxHighlightLayer(layer: HTMLDivElement, runs: PptxTextRunInfo[], matches: PptxHighlightMatch[], cssWidth: number, cssHeight: number, measureForFont: (font: string) => (s: string) => number, colors?: PptxHighlightColors): void;
//#endregion
export { type ArrowEnd, type AutoResizeOptions, type Bevel3d, type BlipBullet, type Bullet, type Camera3d, type ChartAreaGroupDecorations, type ChartBarGroupDecorations, type ChartDataLabelOverride, type ChartDataPointOverride, type ChartDataTable, type ChartDecorationLineStyle, type ChartDisplayUnits, type ChartDisplayUnitsLabel, type ChartElement, type ChartErrBars, type ChartExElementStyle, type ChartExRenderer, type ChartLabelBox, type ChartLegendEntryOverride, type ChartLineDashSegment, type ChartLineGroupDecorations, type ChartManualLayout, type ChartModel, type ChartOfPie, type ChartPlotGroup, type ChartPlotGroupAxisSlot, type ChartPlotGroupKind, type ChartRect, type ChartRegionMapRenderer, type ChartSeries, type ChartSeriesDataLabels, type ChartStockBarPaint, type ChartStockUpDownBarStyle, type ChartSurfaceBandFormat, type ChartTextBox, type ChartTextParagraph, type ChartTextRun, type ChartThreeD, type ChartThreeDPictureOptions, type ChartThreeDRenderer, type ChartThreeDSeriesAxis, type ChartThreeDSurface, type ChartTrendline, type ChartType, type ChartexBoxSeries, type ChartexBoxWhisker, type ChartexGeography, type ChartexHistogramBinning, type ChartexRegionMap, type ChartexRegionMapColors, type ChartexRegionMapRow, type ChartexSunburst, type ChartexSunburstRow, type ChartexTreemap, type ChartexValueColorStop, type DecodedImageBudgetStrategy, type DimOptions, type DrawingMLCustomDashSegment, type Duotone, type EquationRun, type Fill, type FillRect, type FindHighlightColors, type FindMatch, type FindMatchesOptions, type Glow, type GradientFill, type GradientStop, type HiddenSlideMode, type HyperlinkTarget, type ImageFill, type ImageResourceOptions, type LegendManualLayout, type LightRig, type LineBreak, type LoadOptions, type MatchRunSlice, type MathAccent, type MathArray, type MathBar, type MathBorderBox, type MathBox, type MathDelimiter, type MathFraction, type MathFunc, type MathGroup, type MathGroupChr, type MathLimit, type MathNary, type MathNode, type MathPhant, type MathRadical, type MathRenderer, type MathRun, type MathSPre, type MathScript, type MathStyle, type MathSvg, type MediaElement, type NoFill, OoxmlDecodedImageLimitError, type OoxmlDecodedImageLimitMetric, OoxmlError, type OoxmlErrorCode, type OoxmlErrorStage, type OoxmlFormat, type OoxmlResourceLimit, OoxmlResourceLimitError, type OoxmlResourceLimitErrorDetails, type OoxmlResourceLimits, type OoxmlResourceMetric, type OoxmlResourceMetrics, type OoxmlResourceMetricsCheckpoint, type OoxmlResourceName, type OoxmlResourcePolicySnapshot, type OoxmlResourceUsageSnapshot, type OoxmlResourceViolation, type Paragraph, type PathCmd, type PatternFill, type PictureElement, type PptxComment, type PptxCommentAnchor, type PptxCommentReply, type PptxCommentSelectionContext, type PptxCommentsOptions, type PptxElementBounds, type PptxElementContext, type PptxElementContextOptions, type PptxHighlightColors, type PptxHighlightMatch, type PptxMatchLocation, PptxPresentation, PptxScrollViewer, type PptxScrollViewerOptions, type PptxSelectionContext, type PptxSelectionContextOptions, type PptxSelectionRunLocator, type PptxSlidePoint, type PptxTextRunInfo, type PptxTextSelectionContext, PptxViewer, type PptxViewerOptions, type PresentSlideOptions, type Presentation, type PresentationHandle, type Reflection, type RenderOptions, type RenderSlideOptions, type RenderSlideToBitmapOptions, type Rot3d, type Scene3d, type SecondaryValueAxis, type Shadow, type ShapeElement, type Slide, type SlideElement, type SlideElementOrigin, type SlideElementSource, type SlideRenderOptions, type SoftEdge, type SolidFill, type Sp3d, type SpaceLine, type SrcRect, type Stroke, type TabStop, type TableCell, type TableElement, type TableRow, type TextBody, type TextOutline, type TextRect, type TextRun, type TextRunCallback, type TextRunData, type TextSelectionContextOptions, TiffDecodeError, type TiffRenderOptions, type TiffRenderer, type TileInfo, type ViewerCommentConnectorOptions, type ViewerCommentConnectorRoute, type ViewerCommentConnectorStroke, type ViewerCommentMessageContext, type ViewerCommentThreadContext, type ViewerContextMenuEvent, type ZoomableViewer, autoResize, buildPptxHighlightLayer, buildPptxTextLayer, isOoxmlDecodedImageLimitError, isTiffDecodeError, openExternalHyperlink, readPptxTextSelectionContext, renderSlide };