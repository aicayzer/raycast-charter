// ECharts options for the chart types Mermaid cannot draw. Small, static, no titles:
// the thumbnail has to read at tile size.
const axisLabel = { fontSize: 18 };
const grid = { left: 64, right: 24, top: 24, bottom: 48 };

export const ECHARTS_SAMPLES = {
  area: {
    grid,
    xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], axisLabel },
    yAxis: { type: "value", axisLabel },
    series: [
      { type: "line", smooth: true, areaStyle: {}, data: [120, 180, 240, 310, 390, 460] },
      { type: "line", smooth: true, areaStyle: {}, data: [80, 120, 150, 200, 230, 260] },
    ],
  },
  radial: {
    polar: { radius: ["30%", "85%"] },
    angleAxis: { max: 100, startAngle: 90, show: false },
    radiusAxis: { type: "category", data: ["Move", "Exercise", "Stand"], show: false },
    series: [
      {
        type: "bar",
        coordinateSystem: "polar",
        roundCap: true,
        barWidth: 22,
        data: [72, 55, 90],
        colorBy: "data",
        showBackground: true,
        backgroundStyle: { opacity: 0.15 },
      },
    ],
  },
  gauge: {
    series: [
      {
        type: "gauge",
        min: 0,
        max: 100,
        progress: { show: true, width: 22 },
        axisLine: { lineStyle: { width: 22 } },
        axisTick: { show: false },
        splitLine: { length: 14, lineStyle: { width: 2 } },
        axisLabel: { distance: 30, fontSize: 16 },
        pointer: { show: false },
        detail: { valueAnimation: false, fontSize: 48, offsetCenter: [0, "10%"], formatter: "{value}%" },
        data: [{ value: 68 }],
      },
    ],
  },
  scatter: {
    grid,
    xAxis: { type: "value", axisLabel },
    yAxis: { type: "value", axisLabel },
    series: [
      {
        type: "scatter",
        symbolSize: 18,
        data: [
          [10, 8],
          [15, 12],
          [22, 13],
          [28, 20],
          [35, 24],
          [41, 22],
          [50, 33],
          [58, 30],
          [63, 41],
          [70, 46],
          [78, 44],
          [85, 55],
        ],
      },
    ],
  },
  heatmap: {
    grid: { left: 80, right: 24, top: 24, bottom: 48 },
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri"], axisLabel, splitArea: { show: true } },
    yAxis: { type: "category", data: ["Morning", "Midday", "Evening"], axisLabel, splitArea: { show: true } },
    visualMap: { show: false, min: 0, max: 10 },
    series: [
      {
        type: "heatmap",
        label: { show: true, fontSize: 16 },
        data: [
          [0, 0, 5],
          [1, 0, 7],
          [2, 0, 3],
          [3, 0, 8],
          [4, 0, 2],
          [0, 1, 9],
          [1, 1, 6],
          [2, 1, 10],
          [3, 1, 4],
          [4, 1, 7],
          [0, 2, 2],
          [1, 2, 4],
          [2, 2, 6],
          [3, 2, 3],
          [4, 2, 9],
        ],
      },
    ],
  },
  funnel: {
    series: [
      {
        type: "funnel",
        left: "10%",
        top: 10,
        bottom: 10,
        width: "80%",
        sort: "descending",
        gap: 4,
        label: { fontSize: 18, position: "inside" },
        data: [
          { value: 100, name: "Visited" },
          { value: 60, name: "Signed up" },
          { value: 35, name: "Trialled" },
          { value: 18, name: "Paid" },
        ],
      },
    ],
  },
  boxplot: {
    grid,
    xAxis: { type: "category", data: ["A", "B", "C", "D"], axisLabel },
    yAxis: { type: "value", axisLabel },
    series: [
      {
        type: "boxplot",
        data: [
          [12, 20, 26, 33, 42],
          [18, 24, 30, 36, 48],
          [8, 14, 19, 25, 31],
          [22, 29, 35, 41, 55],
        ],
      },
    ],
  },
  candlestick: {
    grid,
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Tue", "Wed"], axisLabel },
    yAxis: { type: "value", scale: true, axisLabel },
    series: [
      {
        type: "candlestick",
        data: [
          [20, 34, 10, 38],
          [40, 35, 30, 50],
          [31, 38, 33, 44],
          [38, 15, 5, 42],
          [15, 25, 12, 28],
          [25, 42, 20, 45],
          [42, 36, 30, 46],
          [36, 48, 34, 52],
        ],
      },
    ],
  },
  sunburst: {
    series: [
      {
        type: "sunburst",
        radius: [0, "92%"],
        label: { fontSize: 16 },
        data: [
          {
            name: "Product",
            children: [
              { name: "Web", value: 6, children: [{ name: "App", value: 3 }, { name: "Site", value: 3 }] },
              { name: "Mobile", value: 4 },
            ],
          },
          {
            name: "Platform",
            children: [
              { name: "API", value: 5 },
              { name: "Data", value: 3 },
            ],
          },
        ],
      },
    ],
  },
};
