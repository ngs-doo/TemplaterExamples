//#region dist/.types-work/chart-CX4ml5hj.d.ts
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
interface Duotone$1 {
  clr1: string;
  clr2: string;
}
interface SrcRect {
  l: number;
  t: number;
  r: number;
  b: number;
}
type PathCmd$2 = {
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
interface GradientStop$1 {
  position: number;
  color: string;
}
interface GradientFill {
  fillType: 'gradient';
  stops: GradientStop$1[];
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
  duotone?: Duotone$1;
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
type Bullet = {
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
interface TabStop$1 {
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
  bullet: Bullet;
  defFontSize: number | null;
  defColor: string | null;
  defBold: boolean | null;
  defItalic: boolean | null;
  defFontFamily: string | null;
  tabStops: TabStop$1[];
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
//#endregion
//#region dist/.types-work/hyperlink-92bQUogu.d.ts
type OoxmlErrorStage = 'container' | 'decompression' | 'parsing' | 'serialization' | 'layout' | 'rendering' | 'worker';
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
//#endregion
//#region dist/.types-work/types-CKbbBm9J.d.ts
interface DocxDocumentModel {
  section: SectionProps;
  body: BodyElement[];
  headers: HeadersFooters;
  footers: HeadersFooters;
  majorFont?: string;
  minorFont?: string;
  fontFamilyClasses?: Record<string, string>;
  fontFamilyPitches?: Record<string, string>;
  embeddedFonts?: EmbeddedFontRef[];
  revisions?: DocRevision[];
  comments?: DocComment[];
  footnotes?: DocNote[];
  endnotes?: DocNote[];
  settings?: DocSettings;
  parseError?: string;
}
interface EmbeddedFontRef {
  fontName: string;
  style: 'regular' | 'bold' | 'italic' | 'boldItalic';
  partPath: string;
  fontKey: string;
}
interface DocSettings {
  kinsoku?: boolean;
  noLineBreaksBefore?: string;
  noLineBreaksAfter?: string;
  mathDefJc?: string;
  defaultTabStop?: number;
  characterSpacingControl?: string;
  useFeLayout?: boolean;
  balanceSingleByteDoubleByteWidth?: boolean;
  adjustLineHeightInTable?: boolean;
}
interface DocRevision {
  kind: 'insertion' | 'deletion' | 'moveFrom' | 'moveTo' | string;
  id?: string;
  author?: string;
  date?: string;
  text: string;
}
interface DocComment {
  id: string;
  author?: string;
  initials?: string;
  date?: string;
  text: string;
  parentId?: string;
  resolved?: boolean;
  paragraphs?: string[];
}
interface DocxCommentMark {
  id: string;
  kind: 'rangeStart' | 'rangeEnd' | 'reference' | string;
  runIndex: number;
}
interface DocNote {
  id: string;
  content: BodyElement[];
}
interface HeadersFooters {
  default: HeaderFooter | null;
  first: HeaderFooter | null;
  even: HeaderFooter | null;
}
interface HeaderFooter {
  body: BodyElement[];
}
interface PageNumType {
  start?: number;
  fmt?: string;
}
interface PageBorders {
  offsetFrom: string;
  display: string;
  zOrder: string;
  top?: PageBorderEdge;
  bottom?: PageBorderEdge;
  left?: PageBorderEdge;
  right?: PageBorderEdge;
}
interface PageBorderEdge {
  style: string;
  color?: string;
  width: number;
  space: number;
}
interface LineNumbering {
  countBy: number;
  start: number;
  distance?: number;
  restart: string;
}
interface SectionGeom {
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  headerDistance: number;
  footerDistance: number;
}
interface SectionProps {
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  headerDistance: number;
  footerDistance: number;
  titlePage: boolean;
  evenAndOddHeaders: boolean;
  sectionStart?: string | null;
  textDirection?: string | null;
  docGridType?: string | null;
  docGridLinePitch?: number | null;
  docGridCharSpace?: number | null;
  columns?: ColumnsSpec | null;
  pageNumType?: PageNumType | null;
  pageBorders?: PageBorders | null;
  lineNumbering?: LineNumbering | null;
  vAlign?: string | null;
}
interface ColumnsSpec {
  count: number;
  spacePt: number;
  equalWidth: boolean;
  sep: boolean;
  cols: ColSpec[];
}
interface ColSpec {
  widthPt: number;
  spacePt: number;
}
type BodyElement = ({
  type: 'paragraph';
} & DocParagraph) | ({
  type: 'table';
} & DocTable) | {
  type: 'pageBreak';
  parity?: 'odd' | 'even';
  sameParagraphAsPrevious?: boolean;
} | {
  type: 'columnBreak';
} | {
  type: 'sectionBreak';
  kind: 'continuous' | 'nextPage' | 'oddPage' | 'evenPage' | string;
  columns?: ColumnsSpec | null;
  headers?: HeadersFooters;
  footers?: HeadersFooters;
  titlePage?: boolean;
  geom?: SectionGeom;
  pageNumType?: PageNumType | null;
  textDirection?: string | null;
};
interface DocParagraph {
  paragraphId?: string;
  alignment: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | 'both' | 'distribute' | 'lowKashida' | 'mediumKashida' | 'highKashida' | 'thaiDistribute' | string;
  indentLeft: number;
  indentRight: number;
  indentFirst: number;
  spaceBefore: number;
  spaceAfter: number;
  lineSpacing: LineSpacing | null;
  numbering: NumberingInfo | null;
  tabStops: TabStop[];
  runs: DocRun[];
  bookmarks?: string[];
  commentMarks?: DocxCommentMark[];
  shading?: string | null;
  pageBreakBefore?: boolean;
  contextualSpacing?: boolean;
  keepNext?: boolean;
  keepLines?: boolean;
  markVanish?: boolean;
  widowControl?: boolean;
  overflowPunct?: boolean;
  adjustRightInd?: boolean;
  borders?: ParagraphBorders | null;
  styleId?: string | null;
  defaultFontSize?: number;
  defaultFontFamily?: string | null;
  defaultFontFamilyEastAsia?: string | null;
  paragraphMarkColor?: string | null;
  bidi?: boolean;
  snapToGrid?: boolean;
  framePr?: FramePr;
}
interface FramePr {
  dropCap: 'none' | 'drop' | 'margin' | string;
  lines: number;
  wrap: 'around' | 'auto' | 'none' | 'notBeside' | 'through' | 'tight' | string;
  hAnchor: 'text' | 'margin' | 'page' | string;
  vAnchor: 'text' | 'margin' | 'page' | string;
  hRule: 'auto' | 'atLeast' | 'exact' | string;
  hSpace: number;
  vSpace: number;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  xAlign?: 'left' | 'center' | 'right' | 'inside' | 'outside' | string;
  yAlign?: 'inline' | 'top' | 'center' | 'bottom' | 'inside' | 'outside' | string;
}
interface ParagraphBorders {
  top: ParaBorderEdge | null;
  bottom: ParaBorderEdge | null;
  left: ParaBorderEdge | null;
  right: ParaBorderEdge | null;
  between: ParaBorderEdge | null;
}
interface ParaBorderEdge {
  style: string;
  color: string | null;
  width: number;
  space: number;
}
interface DocxRunBorder {
  style: string;
  color?: string | null;
  width: number;
  space: number;
}
interface TabStop {
  pos: number;
  alignment: 'left' | 'start' | 'center' | 'right' | 'end' | 'decimal' | 'bar' | 'clear' | 'num';
  leader: 'none' | 'dot' | 'hyphen' | 'underscore' | 'heavy' | 'middleDot';
}
interface LineSpacing {
  value: number;
  rule: 'auto' | 'exact' | 'atLeast';
  explicit?: boolean;
}
interface NumberingInfo {
  numId: number;
  level: number;
  format: string;
  text: string;
  indentLeft: number;
  tab: number;
  suff: string;
  jc?: string;
  fontFamily?: string | null;
  fontFamilyEastAsia?: string | null;
  color?: string | null;
  colorAuto?: boolean;
  picBulletImagePath?: string;
  picBulletMimeType?: string;
  picBulletWidthPt?: number;
  picBulletHeightPt?: number;
}
type DocRunContent = ({
  type: 'text';
} & DocxTextRun) | ({
  type: 'anchorHost';
} & AnchorHostMetrics) | ({
  type: 'image';
} & ImageRun) | ({
  type: 'chart';
} & ChartRun) | {
  type: 'break';
  breakType: 'line' | 'page' | 'column';
} | ({
  type: 'field';
} & FieldRun) | ({
  type: 'shape';
} & ShapeRun) | {
  type: 'math';
  nodes: MathNode[];
  display: boolean;
  fontSize: number;
  jc?: string;
} | ({
  type: 'ptab';
} & PTabRun);
type DocRun = DocRunContent & {
  revision?: RunRevision;
};
interface ChartRun {
  chart: ChartModel;
  widthPt: number;
  heightPt: number;
  anchor: boolean;
  anchorXPt?: number;
  anchorYPt?: number;
  anchorXFromMargin?: boolean;
  anchorYFromPara?: boolean;
  wrapMode?: string;
  distTop?: number;
  distBottom?: number;
  distLeft?: number;
  distRight?: number;
  wrapSide?: string;
  allowOverlap?: boolean;
  anchorXAlign?: string | null;
  anchorYAlign?: string | null;
  anchorXRelativeFrom?: string | null;
  anchorYRelativeFrom?: string | null;
}
interface PTabRun {
  alignment: 'left' | 'center' | 'right';
  relativeTo: 'margin' | 'indent';
  leader: 'none' | 'dot' | 'hyphen' | 'underscore' | 'middleDot';
  fontSize: number;
}
type PathCmd$1 = {
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
interface AnchorHostMetrics {
  fontSize: number;
  fontFamily?: string | null;
  fontFamilyEastAsia?: string | null;
  bold?: boolean;
  italic?: boolean;
}
interface ShapeRun {
  inline?: boolean;
  widthPt: number;
  heightPt: number;
  anchorXPt: number;
  anchorYPt: number;
  anchorXFromMargin: boolean;
  anchorYFromPara: boolean;
  anchorXAlign?: string | null;
  anchorYAlign?: string | null;
  pctPosH?: number | null;
  pctPosV?: number | null;
  anchorXRelativeFrom?: string | null;
  anchorYRelativeFrom?: string | null;
  widthPct?: number | null;
  heightPct?: number | null;
  widthRelativeFrom?: string | null;
  heightRelativeFrom?: string | null;
  groupWidthPt?: number | null;
  groupHeightPt?: number | null;
  behindDoc?: boolean;
  zOrder: number;
  subpaths: PathCmd$1[][];
  presetGeometry?: string | null;
  adjValues?: Array<number | null>;
  fill: ShapeFill$1 | null;
  stroke: string | null;
  strokeWidth?: number;
  strokeFill?: ShapeStrokeFill | null;
  strokeDash?: string | null;
  strokeCustomDash?: Array<{
    dash: number;
    space: number;
  }>;
  strokeCap?: 'butt' | 'round' | 'square' | null;
  strokeJoin?: 'round' | 'bevel' | 'miter' | null;
  strokeMiterLimit?: number | null;
  strokeAlignment?: 'ctr' | 'in' | null;
  strokeCompound?: string | null;
  headEnd?: LineEnd | null;
  tailEnd?: LineEnd | null;
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  wrapMode?: string | null;
  distTop?: number;
  distBottom?: number;
  distLeft?: number;
  distRight?: number;
  wrapSide?: string | null;
  textBlocks?: ShapeText$1[];
  defaultTextColor?: string | null;
  textAnchor?: string | null;
  textAutofit?: string | null;
  textInsetL?: number;
  textInsetT?: number;
  textInsetR?: number;
  textInsetB?: number;
  textVert?: string | null;
  textPath?: TextPath | null;
  fillOpacity?: number | null;
}
interface TextPath {
  string: string;
  fontFamily?: string | null;
  bold?: boolean;
  italic?: boolean;
}
interface LineEnd {
  type: string;
  w: string;
  len: string;
}
interface ShapeTextRun$1 {
  text: string;
  fontSizePt: number;
  color?: string | null;
  fontFamily?: string | null;
  fontFamilyEastAsia?: string | null;
  bold?: boolean;
  italic?: boolean;
  ruby?: RubyAnnotation | null;
}
interface ShapeText$1 {
  text: string;
  fontSizePt: number;
  color?: string | null;
  paragraphMarkColor?: string | null;
  fontFamily?: string | null;
  bold?: boolean;
  italic?: boolean;
  runs?: ShapeTextRun$1[];
  numbering?: NumberingInfo | null;
  alignment: string;
  spaceBefore?: number;
  spaceAfter?: number;
  lineSpacingVal?: number;
  lineSpacingRule?: string;
  indentLeft?: number;
  indentRight?: number;
  indentFirst?: number;
  tabStops?: TabStop[];
  bidi?: boolean;
  contextualSpacing?: boolean;
  styleId?: string | null;
  imagePath?: string;
  mimeType?: string;
  svgImagePath?: string;
  imageWidthPt?: number;
  imageHeightPt?: number;
}
type ShapeFill$1 = {
  fillType: 'solid';
  color: string;
} | {
  fillType: 'gradient';
  stops: GradientStop[];
  angle: number;
  gradType: string;
  scaled?: boolean;
  path?: string;
  fillToRect?: FillRect;
  tileRect?: FillRect;
  flip?: string;
  rotWithShape?: boolean;
} | {
  fillType: 'pattern';
  fg: string;
  bg: string;
  preset: string;
} | {
  fillType: 'image';
  imagePath: string;
  mimeType: string;
  svgImagePath?: string;
  srcRect?: {
    l: number;
    t: number;
    r: number;
    b: number;
  };
  fillRect?: FillRect;
  tile?: TileInfo;
  alpha?: number;
  duotone?: Duotone$1;
};
type ShapeStrokeFill = {
  fillType: 'gradient';
  stops: GradientStop[];
  angle: number;
  gradType: string;
  scaled?: boolean;
  path?: string;
  fillToRect?: FillRect;
  tileRect?: FillRect;
  flip?: string;
  rotWithShape?: boolean;
} | {
  fillType: 'pattern';
  fg: string;
  bg: string;
  preset: string;
};
interface GradientStop {
  position: number;
  color: string;
}
interface FieldRun {
  fieldType: string;
  instruction: string;
  fallbackText: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontSize: number;
  color: string | null;
  fontFamily: string | null;
  background: string | null;
  vertAlign: 'super' | 'sub' | null;
  allCaps?: boolean;
  smallCaps?: boolean;
  doubleStrikethrough?: boolean;
  highlight?: string | null;
  emphasisMark?: EmphasisMark;
}
interface DocxTextRun {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  underlineStyle?: string;
  underlineColor?: string;
  strikethrough: boolean;
  fontSize: number;
  color: string | null;
  fontFamily: string | null;
  fontFamilyEastAsia?: string | null;
  isLink: boolean;
  background: string | null;
  colorAuto?: boolean | null;
  border?: DocxRunBorder | null;
  vertAlign: 'super' | 'sub' | null;
  hyperlink: string | null;
  hyperlinkAnchor?: string | null;
  allCaps?: boolean;
  smallCaps?: boolean;
  doubleStrikethrough?: boolean;
  highlight?: string | null;
  emphasisMark?: EmphasisMark;
  ruby?: RubyAnnotation;
  revision?: RunRevision;
  rtl?: boolean;
  cs?: boolean;
  fontFamilyCs?: string;
  fontSizeCs?: number;
  boldCs?: boolean;
  italicCs?: boolean;
  langBidi?: string;
  snapToGrid?: boolean;
  charSpacing?: number;
  fitTextVal?: number;
  fitTextId?: string | number;
  charScale?: number;
  position?: number;
  kerning?: number;
  eastAsianVert?: boolean;
  eastAsianVertCompress?: boolean;
  eastAsianCombine?: boolean;
  eastAsianCombineBrackets?: string;
  noteRef?: NoteRef;
}
interface NoteRef {
  kind: 'footnote' | 'endnote' | string;
  id: string;
}
interface RunRevision {
  kind: 'insertion' | 'deletion' | 'moveFrom' | 'moveTo' | string;
  id?: string;
  author?: string;
  date?: string;
}
interface RubyAnnotation {
  text: string;
  fontSizePt: number;
  hpsRaisePt?: number;
}
type EmphasisMark = 'dot' | 'comma' | 'circle' | 'underDot';
interface ImageRun {
  imagePath: string;
  mimeType: string;
  svgImagePath?: string;
  srcRect?: {
    l: number;
    t: number;
    r: number;
    b: number;
  } | null;
  widthPt: number;
  heightPt: number;
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  anchor?: boolean;
  anchorXPt?: number;
  anchorYPt?: number;
  anchorXFromMargin?: boolean;
  anchorYFromPara?: boolean;
  colorReplaceFrom?: string;
  duotone?: Duotone$1;
  alpha?: number;
  wrapMode?: string;
  distTop?: number;
  distBottom?: number;
  distLeft?: number;
  distRight?: number;
  wrapSide?: string;
  allowOverlap?: boolean;
  anchorXAlign?: string | null;
  anchorYAlign?: string | null;
  anchorXRelativeFrom?: string | null;
  anchorYRelativeFrom?: string | null;
}
interface TblpPr {
  leftFromText: number;
  rightFromText: number;
  topFromText: number;
  bottomFromText: number;
  horzAnchor: 'text' | 'margin' | 'page' | string;
  horzSpecified: boolean;
  vertAnchor: 'text' | 'margin' | 'page' | string;
  tblpX: number;
  tblpY: number;
  tblpXSpec?: 'left' | 'center' | 'right' | 'inside' | 'outside' | string;
  tblpYSpec?: 'inline' | 'top' | 'center' | 'bottom' | 'inside' | 'outside' | string;
}
interface DocTable {
  colWidths: number[];
  rows: DocTableRow[];
  borders: TableBorders;
  cellMarginTop: number;
  cellMarginBottom: number;
  cellMarginLeft: number;
  cellMarginRight: number;
  jc: string;
  tblInd?: number;
  layout?: string;
  widthPt?: number;
  widthPct?: number;
  bidiVisual?: boolean;
  tblpPr?: TblpPr;
  overlap?: string;
}
interface TableBorders {
  top: BorderSpec | null;
  bottom: BorderSpec | null;
  left: BorderSpec | null;
  right: BorderSpec | null;
  insideH: BorderSpec | null;
  insideV: BorderSpec | null;
}
interface BorderSpec {
  width: number;
  color: string | null;
  style: string;
}
interface DocTableRow {
  cells: DocTableCell[];
  gridBefore?: number;
  gridAfter?: number;
  rowHeight: number | null;
  rowHeightRule: 'auto' | 'atLeast' | 'exact' | string;
  isHeader: boolean;
  cantSplit?: boolean;
}
type CellElement = ({
  type: 'paragraph';
} & DocParagraph) | ({
  type: 'table';
} & DocTable);
interface DocTableCell {
  content: CellElement[];
  colSpan: number;
  vMerge: boolean | null;
  borders: CellBorders;
  background: string | null;
  vAlign: 'top' | 'center' | 'bottom';
  widthPt: number | null;
  widthPct?: number;
  marginTop?: number | null;
  marginBottom?: number | null;
  marginLeft?: number | null;
  marginRight?: number | null;
}
interface CellBorders {
  top: BorderSpec | null;
  bottom: BorderSpec | null;
  left: BorderSpec | null;
  right: BorderSpec | null;
  insideH: BorderSpec | null;
  insideV: BorderSpec | null;
}
interface DocxStorySource {
  story: 'body' | 'header' | 'footer' | 'footnote' | 'endnote' | 'textbox';
  storyInstance: string;
  path: readonly number[];
}
interface DocxTextRunInfo {
  source?: Readonly<DocxStorySource>;
  paragraphId?: string;
  sourceRunIndex?: number;
  direction?: 'ltr' | 'rtl';
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  highlightBounds?: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  fontSize: number;
  font: string;
  letterSpacingPx?: number;
  transform?: string;
  hyperlink?: HyperlinkTarget;
  eastAsianVert?: boolean;
}
//#endregion
//#region dist/.types-work/types-BYLigRmk.d.ts
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
  custGeom: PathCmd$2[][] | null;
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
  duotone?: Duotone$1;
  custGeom?: PathCmd$2[][] | null;
  shadow?: Shadow;
  innerShadow?: Shadow;
  glow?: Glow;
  softEdge?: SoftEdge;
  reflection?: Reflection;
  scene3d?: Scene3d;
  sp3d?: Sp3d;
}
//#endregion
//#region dist/.types-work/types-BzjMGMnI.d.ts
type ShapeFill = Exclude<Fill, {
  fillType: 'image';
} | {
  fillType: 'none';
}>;
interface Workbook {
  sheets: SheetMeta[];
  date1904?: boolean;
  parseError?: string;
}
interface SheetMeta {
  name: string;
  sheetId: number;
  rId: string;
  tabColor?: string | null;
  visibility?: 'hidden' | 'veryHidden';
}
interface MergeCell {
  top: number;
  left: number;
  bottom: number;
  right: number;
}
interface Worksheet {
  name: string;
  isChartSheet?: boolean;
  rows: Row[];
  colWidths: Record<number, number>;
  colWidthRanges?: Array<{
    min: number;
    max: number;
    width: number;
  }>;
  colStyleRanges?: Array<{
    min: number;
    max: number;
    styleIndex: number;
  }>;
  rowHeights: Record<number, number>;
  colOutlineLevels?: Record<number, number>;
  colCollapsed?: Record<number, boolean>;
  colHidden?: Record<number, boolean>;
  defaultColWidth: number;
  defaultRowHeight: number;
  defaultRowHeightCustom?: boolean;
  mergeCells: MergeCell[];
  freezeRows: number;
  freezeCols: number;
  conditionalFormats: ConditionalFormat[];
  images: ImageAnchor[];
  charts: ChartAnchor[];
  shapeGroups?: ShapeAnchor[];
  showZeros?: boolean;
  showGridlines?: boolean;
  rightToLeft?: boolean;
  outlinePr?: OutlinePr;
  tabColor?: string | null;
  autoFilter?: WorksheetCellRange | null;
  hyperlinks?: Hyperlink[];
  commentRefs?: string[];
  comments?: XlsxComment[];
  dataValidations?: DataValidation[];
  definedNames?: DefinedName[];
  tables?: TableInfo[];
  slicers?: SlicerAnchor[];
  pivotTables?: PivotTableMetadata[];
  pivotDiagnostics?: PivotDiagnostic[];
  sparklineGroups?: SparklineGroup[];
  defaultFontFamily?: string;
  defaultFontSize?: number;
  date1904?: boolean;
  parseError?: string;
}
interface PivotTableMetadata {
  name: string;
  cacheId: number;
  location: PivotLocation;
  rowFields: number[];
  columnFields: number[];
  pageFields: PivotPageField[];
  dataFields: PivotDataField[];
  refreshOnLoad?: boolean;
  cacheInvalid?: boolean;
  cacheDefinitionPart?: string;
  cacheSource?: PivotCacheSource;
  status: PivotMetadataStatus;
  extensionUris?: string[];
}
interface PivotLocation extends WorksheetCellRange {
  firstHeaderRow: number;
  firstDataRow: number;
  firstDataCol: number;
}
interface PivotPageField {
  field: number;
  item?: number;
  name?: string;
}
interface PivotDataField {
  field: number;
  subtotal?: string;
  rawSubtotal?: string;
  name?: string;
}
type PivotCacheSource = {
  kind: 'worksheet';
  sheet?: string;
  reference?: string;
  name?: string;
  relationshipId?: string;
} | {
  kind: 'external';
} | {
  kind: 'consolidation';
} | {
  kind: 'scenario';
};
type PivotMetadataStatus = {
  state: 'complete';
} | {
  state: 'partial';
  reasons: PivotPartialReason[];
};
type PivotPartialReason = {
  kind: 'missingCacheRelationship';
} | {
  kind: 'malformedCacheRelationships';
} | {
  kind: 'unreadableCacheRelationships';
} | {
  kind: 'externalCacheRelationship';
} | {
  kind: 'ambiguousCacheRelationship';
} | {
  kind: 'unreadableCacheDefinition';
} | {
  kind: 'malformedCacheDefinition';
} | {
  kind: 'malformedField';
  field: string;
} | {
  kind: 'unsupportedCacheSource';
  sourceType: string;
} | {
  kind: 'unresolvedWorksheetSourceRelationship';
} | {
  kind: 'unsupportedSemanticFeature';
  feature: string;
};
interface PivotDiagnostic {
  part: string;
  reason: {
    kind: 'unreadableWorksheetRelationships';
  } | {
    kind: 'malformedWorksheetRelationships';
  } | {
    kind: 'malformedPivotRelationship';
  } | {
    kind: 'externalPivotRelationship';
  } | {
    kind: 'unreadablePart';
  } | {
    kind: 'malformedXml';
  } | {
    kind: 'missingIdentity';
  } | {
    kind: 'invalidLocation';
  };
}
interface SparklineGroup {
  kind: 'line' | 'column' | 'stem';
  markers: boolean;
  high: boolean;
  low: boolean;
  first: boolean;
  last: boolean;
  negative: boolean;
  displayXAxis: boolean;
  displayEmptyCellsAs: string;
  minAxisType: string;
  maxAxisType: string;
  manualMin?: number;
  manualMax?: number;
  lineWeight: number;
  colorSeries?: string;
  colorNegative?: string;
  colorAxis?: string;
  colorMarkers?: string;
  colorFirst?: string;
  colorLast?: string;
  colorHigh?: string;
  colorLow?: string;
  sparklines: Sparkline[];
}
interface Sparkline {
  row: number;
  col: number;
  values: (number | null)[];
}
interface SlicerAnchor {
  fromCol: number;
  fromColOff: number;
  fromRow: number;
  fromRowOff: number;
  toCol: number;
  toColOff: number;
  toRow: number;
  toRowOff: number;
  caption: string;
  items: SlicerItem[];
  style?: SlicerStyle;
}
interface SlicerItem {
  name: string;
  selected: boolean;
}
interface SlicerStyle {
  whole?: SlicerElementStyle;
  header?: SlicerElementStyle;
  selectedItemWithData?: SlicerElementStyle;
  unselectedItemWithData?: SlicerElementStyle;
}
interface SlicerElementStyle {
  fontColor?: string;
  fontSize?: number;
  fontBold?: boolean;
  fontFamily?: string;
  fillColor?: string;
  borderColor?: string;
}
interface TableInfo {
  range: WorksheetCellRange;
  styleName: string;
  headerRowCount: number;
  totalsRowCount: number;
  showRowStripes: boolean;
  showColumnStripes: boolean;
  showFirstColumn: boolean;
  showLastColumn: boolean;
  accentColor: string;
  isCustom?: boolean;
  wholeTableDxf?: number;
  headerRowDxf?: number;
  totalRowDxf?: number;
  firstColumnDxf?: number;
  lastColumnDxf?: number;
  band1HorizontalDxf?: number;
  band2HorizontalDxf?: number;
  columns: TableColumnInfo[];
}
interface TableColumnInfo {
  dataDxfId?: number;
  headerRowDxfId?: number;
  totalsRowDxfId?: number;
}
interface DefinedName {
  name: string;
  formula: string;
}
interface XlsxComment {
  kind?: 'note' | 'thread';
  cellRef: string;
  id?: string;
  personId?: string;
  author?: string;
  date?: string;
  rootText?: string;
  text: string;
  resolved?: boolean;
  replies?: XlsxCommentReply[];
}
interface XlsxCommentReply {
  id: string;
  parentId: string;
  personId: string;
  author?: string;
  date?: string;
  text: string;
  resolved?: boolean;
}
interface DataValidation {
  sqref: string;
  validationType?: string;
  operator?: string;
  formula1?: string;
  formula2?: string;
  allowBlank?: boolean;
  promptTitle?: string;
  prompt?: string;
  errorTitle?: string;
  errorMessage?: string;
}
interface ChartAnchor {
  zOrder?: number;
  fromCol: number;
  fromColOff: number;
  fromRow: number;
  fromRowOff: number;
  toCol: number;
  toColOff: number;
  toRow: number;
  toRowOff: number;
  chart: ChartModel;
}
interface ShapeAnchor {
  fromCol: number;
  fromColOff: number;
  fromRow: number;
  fromRowOff: number;
  toCol: number;
  toColOff: number;
  toRow: number;
  toRowOff: number;
  editAs?: string;
  nativeExtCx: number;
  nativeExtCy: number;
  shapes: ShapeInfo[];
}
interface ShapeInfo {
  zOrder?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  flipH?: boolean;
  flipV?: boolean;
  fillColor?: string;
  fill?: ShapeFill;
  strokeColor?: string;
  strokeWidth: number;
  strokeFill?: Exclude<Fill, {
    fillType: 'image';
  } | {
    fillType: 'none';
  }>;
  strokeDashStyle?: string;
  strokeCustomDash?: Array<{
    dash: number;
    space: number;
  }>;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeLineJoin?: 'round' | 'bevel' | 'miter';
  strokeMiterLimit?: number;
  strokeAlignment?: 'ctr' | 'in';
  strokeCmpd?: string;
  strokeHeadEnd?: ArrowEnd;
  strokeTailEnd?: ArrowEnd;
  geom: ShapeGeom;
  text?: ShapeText;
}
interface ShapeText {
  anchor: string;
  wrap: string;
  autoFit?: string;
  fontScale?: number | null;
  lnSpcReduction?: number | null;
  lIns: number;
  tIns: number;
  rIns: number;
  bIns: number;
  paragraphs: ShapeParagraph[];
}
interface ShapeParagraph {
  align: string;
  rtl?: boolean;
  marL?: number;
  marR?: number;
  indent?: number;
  spaceLine?: SpaceLine | null;
  runs: ShapeTextRun[];
}
type ShapeTextRun = {
  type: 'text';
  text: string;
  bold: boolean;
  italic: boolean;
  size: number;
  color?: string;
  fontFace?: string;
  fontFaceEa?: string;
  fontFaceCs?: string;
} | {
  type: 'break';
} | {
  type: 'math';
  nodes: MathNode[];
  display: boolean;
  fontSize?: number;
  color?: string;
};
type ShapeGeom = {
  type: 'preset';
  name: string;
  adj?: (number | null)[];
} | {
  type: 'custom';
  paths: PathInfo[];
} | {
  type: 'image';
  imagePath: string;
  mimeType: string;
  svgImagePath?: string;
  srcRect?: {
    l: number;
    t: number;
    r: number;
    b: number;
  };
  alpha?: number;
  duotone?: Duotone;
};
interface Duotone {
  clr1: string;
  clr2: string;
}
interface PathInfo {
  w: number;
  h: number;
  commands: PathCmd[];
}
type PathCmd = {
  op: 'moveTo';
  x: number;
  y: number;
} | {
  op: 'lineTo';
  x: number;
  y: number;
} | {
  op: 'cubicBezTo';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
} | {
  op: 'quadBezTo';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} | {
  op: 'arcTo';
  wr: number;
  hr: number;
  stAng: number;
  swAng: number;
} | {
  op: 'close';
};
interface ImageAnchor {
  zOrder?: number;
  fromCol: number;
  fromColOff: number;
  fromRow: number;
  fromRowOff: number;
  toCol: number;
  toColOff: number;
  toRow: number;
  toRowOff: number;
  editAs?: string;
  nativeExtCx: number;
  nativeExtCy: number;
  imagePath: string;
  mimeType: string;
  svgImagePath?: string;
  srcRect?: {
    l: number;
    t: number;
    r: number;
    b: number;
  };
  alpha?: number;
  duotone?: Duotone;
}
interface WorksheetCellRange {
  top: number;
  left: number;
  bottom: number;
  right: number;
}
interface Hyperlink {
  col: number;
  row: number;
  url: string | null;
  location?: string | null;
  display?: string | null;
}
interface ConditionalFormat {
  sqref: WorksheetCellRange[];
  rules: CfRule[];
}
type CfRule = {
  type: 'cellIs';
  operator: string;
  formulas: string[];
  dxfId: number | null;
  priority: number;
} | {
  type: 'expression';
  formula: string;
  dxfId: number | null;
  priority: number;
  stopIfTrue: boolean;
} | {
  type: 'colorScale';
  stops: CfStop[];
  priority: number;
} | {
  type: 'dataBar';
  color: string;
  min: CfValue;
  max: CfValue;
  priority: number;
  gradient: boolean;
} | {
  type: 'top10';
  top: boolean;
  percent: boolean;
  rank: number;
  dxfId: number | null;
  priority: number;
} | {
  type: 'aboveAverage';
  aboveAverage: boolean;
  equalAverage?: boolean;
  stdDev?: number;
  dxfId: number | null;
  priority: number;
} | {
  type: 'iconSet';
  iconSet: string;
  cfvos: CfValue[];
  reverse: boolean;
  priority: number;
  customIcons?: CfIcon[];
} | {
  type: 'other';
  kind: string;
  priority: number;
};
interface CfIcon {
  iconSet: string;
  iconId: number;
}
interface CfStop {
  kind: string;
  value: string | null;
  color: string;
}
interface CfValue {
  kind: string;
  value: string | null;
}
interface Row {
  index: number;
  height: number | null;
  customHeight?: boolean;
  cells: Cell[];
  outlineLevel?: number;
  collapsed?: boolean;
  hidden?: boolean;
}
interface OutlinePr {
  summaryBelow: boolean;
  summaryRight: boolean;
}
interface Cell {
  col: number;
  row: number;
  value: CellValue;
  styleIndex?: number;
  formula?: string;
  showPhonetic?: boolean;
}
type CellValue = {
  type: 'empty';
} | {
  type: 'text';
  text: string;
  runs?: Run[];
  phoneticRuns?: PhoneticRun[];
  phoneticPr?: PhoneticProperties;
} | {
  type: 'number';
  number: number;
} | {
  type: 'bool';
  bool: boolean;
} | {
  type: 'error';
  error: string;
} | {
  type: 'shared';
  si: number;
};
interface PhoneticRun {
  sb: number;
  eb: number;
  text: string;
}
type PhoneticType = 'fullwidthKatakana' | 'halfwidthKatakana' | 'Hiragana' | 'noConversion';
type PhoneticAlignment = 'left' | 'center' | 'distributed' | 'noControl';
interface PhoneticProperties {
  fontId: number;
  type?: PhoneticType;
  alignment?: PhoneticAlignment;
}
interface Run {
  text: string;
  font?: RunFont;
}
interface RunFont {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  size?: number;
  color?: string | null;
  name?: string | null;
  underlineStyle?: string;
  vertAlign?: 'superscript' | 'subscript';
}
interface SharedString {
  text: string;
  runs?: Run[];
  phoneticRuns?: PhoneticRun[];
  phoneticPr?: PhoneticProperties;
}
interface NumFmt {
  numFmtId: number;
  formatCode: string;
}
interface Styles {
  fonts: CellFont[];
  fills: CellFill[];
  borders: Border[];
  cellXfs: CellXf[];
  numFmts: NumFmt[];
  dxfs: Dxf[];
}
interface Dxf {
  font: CellFont | null;
  fill: CellFill | null;
  border: Border | null;
  numFmt?: NumFmt | null;
}
interface CellFont {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  size: number;
  color: string | null;
  name: string | null;
  underlineStyle?: string;
  vertAlign?: 'superscript' | 'subscript';
}
interface CellFill {
  patternType: string;
  fgColor: string | null;
  bgColor: string | null;
  gradient?: GradientFillSpec | null;
}
interface GradientFillSpec {
  gradientType: string;
  degree: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  stops: {
    position: number;
    color: string;
  }[];
}
interface Border {
  left: BorderEdge | null;
  right: BorderEdge | null;
  top: BorderEdge | null;
  bottom: BorderEdge | null;
  diagonalUp?: BorderEdge | null;
  diagonalDown?: BorderEdge | null;
  horizontal?: BorderEdge | null;
  vertical?: BorderEdge | null;
}
interface BorderEdge {
  style: string;
  color: string | null;
}
interface CellXf {
  fontId: number;
  fillId: number;
  borderId: number;
  numFmtId: number;
  alignH: string | null;
  alignV: string | null;
  wrapText: boolean;
  indent?: number;
  textRotation?: number;
  shrinkToFit?: boolean;
  readingOrder?: number;
}
interface ParsedWorkbook {
  workbook: Workbook;
  styles: Styles;
  sharedStrings: SharedString[];
}
//#endregion
//#region dist/.types-work/node.d.ts
interface OoxmlNodeSessionOptions {
  resourceLimits?: OoxmlResourceLimits;
  maxZipEntryBytes?: number;
  debug?: boolean;
  onResourceMetrics?: (metrics: OoxmlResourceMetrics) => void;
  signal?: AbortSignal;
}
interface NodeTextMetricsLike {
  readonly width: number;
}
interface NodeCanvasContext2D {
  measureText(text: string): NodeTextMetricsLike;
  drawImage?(image: NodeImageLike, dx: number, dy: number, dw: number, dh: number): void;
}
interface NodeCanvasLike {
  width: number;
  height: number;
  getContext(kind: '2d'): NodeCanvasContext2D;
  toBuffer?(format?: string): Uint8Array | Promise<Uint8Array>;
}
interface NodeImageLike {
  width: number;
  height: number;
}
interface NodeCanvasFactory {
  createCanvas(width: number, height: number): NodeCanvasLike;
  loadImage(buffer: ArrayBuffer | Uint8Array, target?: Readonly<{
    width?: number;
    height?: number;
  }>): Promise<NodeImageLike>;
}
declare function installOffscreenCanvasShim(factory: NodeCanvasFactory): () => void;
declare function installImageBitmapShim(factory: NodeCanvasFactory): () => void;
declare function renderSlideNode(canvas: NodeCanvasLike, presentation: Presentation, slideIndex: number, opts?: {
  width?: number;
  dpr?: number;
  factory?: NodeCanvasFactory;
  fetchImage?: (path: string, mimeType: string) => Promise<Blob>;
  fetchMedia?: (path: string) => Promise<Blob>;
}): Promise<void>;
type OpenPptxPresentationOptions = OoxmlNodeSessionOptions;
interface PptxSessionRenderOptions {
  readonly width?: number;
  readonly dpr?: number;
  readonly factory: NodeCanvasFactory;
}
interface PptxPresentationSession extends AsyncIterable<Slide> {
  readonly slideCount: number;
  readonly slideWidth: number;
  readonly slideHeight: number;
  readonly resourceUsage: OoxmlResourceUsageSnapshot | undefined;
  getImage(path: string, mimeType: string): Promise<Blob>;
  getMedia(path: string, mimeType?: string): Promise<Blob>;
  renderSlide(canvas: NodeCanvasLike, slide: Slide, options: PptxSessionRenderOptions): Promise<void>;
  slides(): AsyncGenerator<Slide, void, void>;
  close(): Promise<void>;
}
declare function openPptxPresentation(buffer: ArrayBuffer | Uint8Array, options?: OpenPptxPresentationOptions): Promise<PptxPresentationSession>;
declare function materializePptxPresentation(buffer: ArrayBuffer | Uint8Array, options?: OpenPptxPresentationOptions): Promise<Presentation>;
interface OpenDocxDocumentOptions extends OoxmlNodeSessionOptions {
  factory: NodeCanvasFactory;
  currentDate?: Date | number;
}
interface DocxPageRenderOptions {
  width?: number;
  dpr?: number;
  defaultTextColor?: string;
  onTextRun?: (run: DocxTextRunInfo) => void;
}
interface DocxRenderedPage {
  readonly pageIndex: number;
  readonly widthPt: number;
  readonly heightPt: number;
  readonly canvas: NodeCanvasLike;
}
interface DocxDocumentSession extends AsyncIterable<DocxRenderedPage> {
  readonly pageCount: number;
  readonly resourceUsage: OoxmlResourceUsageSnapshot | undefined;
  pageSize(pageIndex: number): Readonly<{
    widthPt: number;
    heightPt: number;
  }>;
  renderPage(pageIndex: number, options?: DocxPageRenderOptions): Promise<NodeCanvasLike>;
  pages(options?: DocxPageRenderOptions): AsyncGenerator<DocxRenderedPage, void, void>;
  close(): Promise<void>;
}
declare function openDocxDocument(buffer: ArrayBuffer | Uint8Array, options: OpenDocxDocumentOptions): Promise<DocxDocumentSession>;
declare function materializeDocxDocument(buffer: ArrayBuffer | Uint8Array, options?: OoxmlNodeSessionOptions): Promise<DocxDocumentModel>;
type DeepReadonly<T> = T extends ((...args: never[]) => unknown) ? T : T extends readonly (infer TValue)[] ? readonly DeepReadonly<TValue>[] : T extends object ? { readonly [TKey in keyof T]: DeepReadonly<T[TKey]>; } : T;
type ReadonlyParsedWorkbook = DeepReadonly<ParsedWorkbook>;
interface MaterializedXlsxWorkbook {
  readonly workbookIndex: ParsedWorkbook;
  readonly worksheets: readonly Worksheet[];
}
type OpenXlsxWorkbookOptions = OoxmlNodeSessionOptions;
type XlsxWorksheetRowChunk = {
  readonly kind: 'rows';
  readonly rows: Row[];
  readonly sequence: number;
  readonly wireBytes: number;
  readonly usage?: OoxmlResourceUsageSnapshot;
} | {
  readonly kind: 'finished';
  readonly worksheet: Worksheet;
  readonly sequence: number;
  readonly wireBytes: number;
  readonly usage?: OoxmlResourceUsageSnapshot;
};
interface XlsxWorkbookSession {
  readonly workbookIndex: ReadonlyParsedWorkbook;
  readonly sheetCount: number;
  readonly sheetNames: ReadonlyArray<string>;
  readonly resourceUsage: OoxmlResourceUsageSnapshot | undefined;
  worksheetRows(sheetIndex: number): AsyncGenerator<XlsxWorksheetRowChunk, void, void>;
  close(): Promise<void>;
}
declare function openXlsxWorkbook(buffer: ArrayBuffer | Uint8Array, options?: OpenXlsxWorkbookOptions): Promise<XlsxWorkbookSession>;
declare function materializeXlsxWorkbookIndex(buffer: ArrayBuffer | Uint8Array, options?: OpenXlsxWorkbookOptions): Promise<ParsedWorkbook>;
declare function materializeXlsxWorksheet(buffer: ArrayBuffer | Uint8Array, sheetIndex: number, options?: OpenXlsxWorkbookOptions): Promise<Worksheet>;
declare function materializeXlsxWorkbook(buffer: ArrayBuffer | Uint8Array, options?: OpenXlsxWorkbookOptions): Promise<MaterializedXlsxWorkbook>;
//#endregion
export { type DeepReadonly, type DocxDocumentSession, type DocxPageRenderOptions, type DocxRenderedPage, type MaterializedXlsxWorkbook, type NodeCanvasFactory, type NodeCanvasLike, type NodeImageLike, OoxmlDecodedImageLimitError, type OoxmlDecodedImageLimitMetric, type OoxmlNodeSessionOptions, type OoxmlResourceLimit, OoxmlResourceLimitError, type OoxmlResourceLimitErrorDetails, type OoxmlResourceLimits, type OoxmlResourceMetrics, type OoxmlResourceMetricsCheckpoint, type OoxmlResourcePolicySnapshot, type OoxmlResourceUsageSnapshot, type OpenDocxDocumentOptions, type OpenPptxPresentationOptions, type OpenXlsxWorkbookOptions, type PptxPresentationSession, type PptxSessionRenderOptions, type ReadonlyParsedWorkbook, type XlsxWorkbookSession, type XlsxWorksheetRowChunk, installImageBitmapShim, installOffscreenCanvasShim, isOoxmlDecodedImageLimitError, materializeDocxDocument, materializePptxPresentation, materializeXlsxWorkbook, materializeXlsxWorkbookIndex, materializeXlsxWorksheet, openDocxDocument, openPptxPresentation, openXlsxWorkbook, renderSlideNode };