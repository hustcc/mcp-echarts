// Sample data for testing various charts

export const barChartData = [
  { category: "Apple", value: 120 },
  { category: "Banana", value: 80 },
  { category: "Orange", value: 150 },
  { category: "Grape", value: 90 },
];

export const lineChartData = [
  { time: "2023-01", value: 100 },
  { time: "2023-02", value: 120 },
  { time: "2023-03", value: 85 },
  { time: "2023-04", value: 160 },
  { time: "2023-05", value: 140 },
];

export const pieChartData = [
  { category: "Technology", value: 35 },
  { category: "Marketing", value: 25 },
  { category: "Sales", value: 20 },
  { category: "Customer Service", value: 20 },
];

export const radarChartData = [
  { name: "Performance", value: 85 },
  { name: "Features", value: 90 },
  { name: "Usability", value: 75 },
  { name: "Stability", value: 95 },
  { name: "Price", value: 60 },
];

export const scatterChartData = [
  { x: 10, y: 15 },
  { x: 20, y: 25 },
  { x: 30, y: 35 },
  { x: 40, y: 30 },
  { x: 50, y: 45 },
];

export const sankeyChartData = [
  { source: "Homepage Visit", target: "Product Page", value: 1000 },
  { source: "Product Page", target: "Add to Cart", value: 300 },
  { source: "Add to Cart", target: "Checkout", value: 200 },
  { source: "Checkout", target: "Purchase Complete", value: 150 },
];

export const funnelChartData = [
  { category: "Website Visit", value: 1000 },
  { category: "Browse Products", value: 800 },
  { category: "Add to Cart", value: 600 },
  { category: "Start Checkout", value: 400 },
  { category: "Complete Purchase", value: 300 },
];

export const gaugeChartData = [{ name: "CPU Usage", value: 75 }];

export const treemapChartData = [
  {
    name: "Technology Department",
    value: 100,
    children: [
      { name: "Frontend", value: 40 },
      { name: "Backend", value: 60 },
    ],
  },
  {
    name: "Business Department",
    value: 80,
    children: [
      { name: "Marketing", value: 30 },
      { name: "Sales", value: 50 },
    ],
  },
];

export const sunburstChartData = [
  {
    name: "Company",
    value: 200,
    children: [
      {
        name: "Technology",
        value: 100,
        children: [
          { name: "Frontend", value: 40 },
          { name: "Backend", value: 60 },
        ],
      },
      {
        name: "Business",
        value: 100,
        children: [
          { name: "Sales", value: 60 },
          { name: "Marketing", value: 40 },
        ],
      },
    ],
  },
];

export const heatmapChartData = [
  { x: "Monday", y: "9 AM", value: 5 },
  { x: "Monday", y: "10 AM", value: 8 },
  { x: "Tuesday", y: "9 AM", value: 3 },
  { x: "Tuesday", y: "10 AM", value: 7 },
  { x: "Wednesday", y: "9 AM", value: 9 },
  { x: "Wednesday", y: "10 AM", value: 6 },
];

export const candlestickChartData = [
  { date: "2023-01-01", open: 100, high: 110, low: 95, close: 105 },
  { date: "2023-01-02", open: 105, high: 115, low: 100, close: 108 },
  { date: "2023-01-03", open: 108, high: 112, low: 102, close: 106 },
  { date: "2023-01-04", open: 106, high: 118, low: 104, close: 115 },
];

export const boxplotChartData = [
  { category: "Group A", value: 10 },
  { category: "Group A", value: 12 },
  { category: "Group A", value: 15 },
  { category: "Group A", value: 18 },
  { category: "Group A", value: 20 },
  { category: "Group B", value: 8 },
  { category: "Group B", value: 11 },
  { category: "Group B", value: 14 },
  { category: "Group B", value: 16 },
  { category: "Group B", value: 22 },
];

export const graphChartData = {
  nodes: [
    { id: "node1", name: "Node 1" },
    { id: "node2", name: "Node 2" },
    { id: "node3", name: "Node 3" },
    { id: "node4", name: "Node 4" },
  ],
  edges: [
    { source: "node1", target: "node2" },
    { source: "node2", target: "node3" },
    { source: "node3", target: "node4" },
    { source: "node1", target: "node4" },
  ],
};

export const parallelChartData = [
  { name: "Product A", values: [4.2, 3.4, 2.3, 1.8] },
  { name: "Product B", values: [3.8, 4.1, 3.2, 2.5] },
  { name: "Product C", values: [2.9, 3.8, 4.1, 3.2] },
];

export const parallelDimensions = ["Price", "Quality", "Service", "Value"];

export const treeChartData = {
  name: "Root Node",
  children: [
    {
      name: "Child Node 1",
      children: [{ name: "Leaf Node 1" }, { name: "Leaf Node 2" }],
    },
    {
      name: "Child Node 2",
      children: [{ name: "Leaf Node 3" }, { name: "Leaf Node 4" }],
    },
  ],
};

export const echartsOption = {
  title: {
    text: "ECharts Test Chart",
    left: "center",
    top: "2%",
  },
  tooltip: {},
  xAxis: {
    data: ["Shirt", "Sweater", "Chiffon", "Pants", "Heels", "Socks"],
  },
  yAxis: {},
  series: [
    {
      name: "Sales",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};
