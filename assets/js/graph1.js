import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawAvgSpeedPlot() {
  const data = [
    { quarter: "2023Q1", avg_speed: 9.63 },
    { quarter: "2023Q2", avg_speed: 9.34 },
    { quarter: "2023Q3", avg_speed: 9.36 },
    { quarter: "2023Q4", avg_speed: 9.28 },
    { quarter: "2024Q1", avg_speed: 9.57 },
    { quarter: "2024Q2", avg_speed: 9.28 },
    { quarter: "2024Q3", avg_speed: 9.38 },
    { quarter: "2024Q4", avg_speed: 9.30 },
    { quarter: "2025Q1", avg_speed: 9.72 },
    { quarter: "2025Q2", avg_speed: 9.30 },
    { quarter: "2025Q3", avg_speed: 9.39 }
  ];

  const quarterToMonth = { Q1: 0, Q2: 3, Q3: 6, Q4: 9 };
  data.forEach(d => {
    const [year, q] = d.quarter.split("Q");
    d.date = new Date(+year, quarterToMonth["Q" + q], 1);
  });

  const eventDate = new Date(2024, 6, 1); // 2024Q3
  const eventLabel = "Ace Program starts";

  document.body.style.fontFamily = "Inter, system-ui, sans-serif";

  const plot = Plot.plot({
    width: 900,
    height: 500,
    marginLeft: 100,
    marginBottom: 80,
    marginTop: 80,
    style: { background: "#fff" },
    marks: [
      // Main line
      Plot.line(data, {
        x: "date",
        y: "avg_speed",
        stroke: "#555",       // gray line for context
        strokeWidth: 2,
        curve: "catmull-rom",
        title: d => `Avg speed: ${d.avg_speed.toFixed(2)} mph`
      }),
      // Highlight last point
      Plot.dot([data[data.length - 1]], {
        x: "date",
        y: "avg_speed",
        fill: "#FF9B00",
        r: 6,
        title: d => `Latest: ${d.avg_speed.toFixed(2)} mph`
      }),
      // Vertical rule for event
      Plot.ruleX([eventDate], {
        stroke: "#2D9CDB",
        strokeDasharray: "4 2",
        strokeWidth: 2,
        opacity: 0.8,
        title: eventLabel
      }),
      // Event label above the line
      Plot.text(
        [{ date: eventDate, y: d3.max(data, d => d.avg_speed) * 1.02, label: eventLabel }],
        {
          x: "date",
          y: "y",
          text: "label",
          textAnchor: "middle",
          dy: -5,
          fill: "#2D9CDB",
          style: { fontSize: "13px", fontWeight: "600" }
        }
      ),
      // Zero line
      Plot.ruleY([0], { stroke: "#ccc", strokeWidth: 0.5 })
    ],
    x: {
      label: "Quarter",
      type: "time",
      tickFormat: d3.timeFormat("%Y Q%q"),
      ticks: Plot.timeInterval("3 months"),
      tickRotate: -45
    },
    y: {
      label: "Average Speed (mph)",
      domain: [
        d3.min(data, d => d.avg_speed) - 0.15,
        d3.max(data, d => d.avg_speed) + 0.15
      ],
      grid: true,
      gridStroke: "#eee",
      gridStrokeWidth: 0.7
    }
  });

  document.getElementById("avg-speed-plot").appendChild(plot);
}

drawAvgSpeedPlot();
