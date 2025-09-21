import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { sankey, sankeyLinkHorizontal } from "https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/+esm";

async function drawBusSankey() {
  const width = 900;
  const height = 500;
  const nodeWidth = 20;
  const nodePadding = 12;
  const nodeFill = "#69b3a2";
  const nodeStroke = "#000";
  const fontSize = 12;
  const fontFamily = "Inter, system-ui, sans-serif";
  const fontColor = "#000";

  const data = {
    nodes: [
      { name: "BX12+ Bus Riders" },
      { name: "Transferred or Will Transfer" },
      { name: "Will not Transfer" }
    ],
    links: [
      { source: 0, target: 1, value: 36, color: "#2ca02c" },
      { source: 0, target: 2, value: 64, color: "#7f7f7f" }
    ]
  };

  document.body.style.fontFamily = fontFamily;

  // Clear previous SVG
  d3.select("#bus-sankey").select("svg").remove();

  const svg = d3.select("#bus-sankey")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const sankeyLayout = sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([[1, 1], [width - 1, height - 6]]);

  const sankeyGraph = sankeyLayout({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "6px 10px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("font", "12px sans-serif")
    .style("display", "none");

  // Links
  svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.4)
    .selectAll("path")
    .data(sankeyGraph.links)
    .join("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", d => d.color || "#aaa")
    .attr("stroke-width", d => Math.max(1, d.width))
    .on("mouseover", function (event, d) {
      tooltip.style("display", "block")
        .html(`<strong>${d.source.name} → ${d.target.name}</strong><br/>${d.value.toFixed(2)}%`);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
    });

  // Link Labels
  svg.append("g")
    .selectAll("text.link-label")
    .data(sankeyGraph.links)
    .join("text")
    .attr("class", "link-label")
    .attr("x", d => (d.source.x1 + d.target.x0) / 2)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", fontColor)
    .attr("font-size", fontSize - 1)
    .text(d => `${d.value.toFixed(1)}%`);

  // Nodes
  svg.append("g")
    .selectAll("rect")
    .data(sankeyGraph.nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke);

  // Node Labels
  svg.append("g")
    .selectAll("text.node-label")
    .data(sankeyGraph.nodes)
    .join("text")
    .attr("class", "node-label")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .attr("font-family", fontFamily)
    .attr("font-size", fontSize)
    .attr("fill", fontColor)
    .text(d => d.name);
}

drawBusSankey();
