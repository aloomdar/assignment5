import React, { Component } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  state = {
    company: "Apple",
    selectedMonth: 11,
  };

  changeMonth = (e) => {
    this.setState({ selectedMonth: parseInt(e.target.value) });
  };

  changeCompany = (e) => {
    this.setState({ company: e.target.value });
  };

  componentDidMount() {
    this.drawChart(this.props.csv_data);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.csv_data !== this.props.csv_data ||
      prevState.company !== this.state.company ||
      prevState.selectedMonth !== this.state.selectedMonth
    ) {
      this.drawChart(this.props.csv_data);
    }
  }

  drawChart(data) {
    const filteredData = data.filter(
      (d) =>
        d.Company === this.state.company &&
        d.Date.getMonth() === this.state.selectedMonth - 1
    );

    const margin = { top: 20, right: 100, bottom: 40, left: 40 },
      width = 1000,
      height = 500,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(".mysvg").attr("width", width).attr("height", height);

    const g = svg
      .selectAll(".chart-group")
      .data([null])
      .join("g")
      .attr("class", "chart-group")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.Date))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => Math.min(d.Open, d.Close)),
        d3.max(filteredData, (d) => Math.max(d.Open, d.Close)),
      ])
      .range([innerHeight, 0]);

    const lineOpen = d3
      .line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Open))
      .curve(d3.curveCardinal);

    const lineClose = d3
      .line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Close))
      .curve(d3.curveCardinal);

    g.selectAll(".line-open")
      .data([filteredData])
      .join("path")
      .attr("class", "line-open")
      .attr("d", lineOpen)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2);

    g.selectAll(".line-close")
      .data([filteredData])
      .join("path")
      .attr("class", "line-close")
      .attr("d", lineClose)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2);

    g.selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight + 10})`)
      .call(d3.axisBottom(xScale).ticks(10));

    g.selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

    g.selectAll(".dot")
      .data(filteredData)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => xScale(d.Date))
            .attr("cy", (d) => yScale(d.Open))
            .attr("r", 5)
            .attr("fill", "#b2df8a")
            .on("mouseover", function (event, d) {
              tooltip
                .style("opacity", 1)
                .html(
                  `<strong>Date:</strong> ${
                    d.Date.toISOString().split("T")[0]
                  }<br>
             <strong>Open:</strong> ${d.Open.toFixed(2)}<br>
             <strong>Close:</strong> ${d.Close.toFixed(2)}<br>
             <strong>Difference:</strong> ${(d.Close - d.Open).toFixed(2)}`
                )
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function () {
              tooltip.style("opacity", 0);
            }),
        (update) =>
          update
            .attr("cx", (d) => xScale(d.Date))
            .attr("cy", (d) => yScale(d.Open))
            .attr("fill", "#b2df8a"),
        (exit) => exit.remove()
      );

    g.selectAll(".dot-close")
      .data(filteredData)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "dot-close")
            .attr("cx", (d) => xScale(d.Date))
            .attr("cy", (d) => yScale(d.Close))
            .attr("r", 5)
            .attr("fill", "#e41a1c")
            .on("mouseover", function (event, d) {
              tooltip
                .style("opacity", 1)
                .html(
                  `<strong>Date:</strong> ${
                    d.Date.toISOString().split("T")[0]
                  }<br>
             <strong>Open:</strong> ${d.Open.toFixed(2)}<br>
             <strong>Close:</strong> ${d.Close.toFixed(2)}<br>
             <strong>Difference:</strong> ${(d.Close - d.Open).toFixed(2)}`
                )
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function () {
              tooltip.style("opacity", 0);
            }),
        (update) =>
          update
            .attr("cx", (d) => xScale(d.Date))
            .attr("cy", (d) => yScale(d.Close))
            .attr("fill", "#e41a1c"),
        (exit) => exit.remove()
      );

    const tooltip = d3
      .select("body")
      .selectAll(".tooltip")
      .data([null])
      .join("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none");

    const legendData = [
      { label: "Open", color: "#b2df8a" },
      { label: "Close", color: "#e41a1c" },
    ];

    const legend = g
      .selectAll(".legend")
      .data([null])
      .join("g")
      .attr("class", "legend")
      .attr("transform", `translate(${innerWidth + 15}, 20)`);

    const legendItems = legend.selectAll(".legend-item").data(legendData);

    legendItems
      .join(
        (enter) => {
          const group = enter.append("g").attr("class", "legend-item");
          group.append("rect");
          group.append("text");
          return group;
        },
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("transform", (_, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const item = d3.select(this);
        item
          .select("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", d.color);

        item
          .select("text")
          .attr("x", 20)
          .attr("y", 12)
          .style("font-size", "12px")
          .text(d.label);
      });
  }

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"];
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    return (
      <div className="child1">
        <div className="radio-container">
          <label>Company: </label>
          {options.map((option, index) => (
            <label key={index} className="radio-option">
              <input
                type="radio"
                name="company"
                value={option}
                defaultChecked={option === "Apple"}
                onChange={this.changeCompany}
              />
              {option}
            </label>
          ))}
        </div>
        <div className="drop-container">
          <label htmlFor="Months">Month: </label>
          <select
            name="Month-Names"
            id="Month-Names"
            defaultValue={11}
            onChange={this.changeMonth}
          >
            {Object.entries(months).map(([monthName, monthValue]) => (
              <option key={monthValue} value={monthValue}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
        <svg className="mysvg"></svg>
      </div>
    );
  }
}

export default Child1;
