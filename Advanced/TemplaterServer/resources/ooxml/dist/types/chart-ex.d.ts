//#region dist/.types-work/chart-CX4ml5hj.d.ts
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
interface DrawingMLCustomDashSegment {
  dash: number;
  space: number;
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
//#region dist/.types-work/chart-ex.d.ts
declare const chartEx: ChartExRenderer;
//#endregion
export { type ChartExRenderer, chartEx };