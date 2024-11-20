import React, { Component } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: 11, // Default Month (November, 1-based index)
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

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 1000,
      height = 500,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;

    d3.select(".mysvg").selectAll("*").remove();

    const svg = d3
      .select(".mysvg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
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

    svg
      .append("path")
      .datum(filteredData)
      .attr("d", lineOpen)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2);

    svg
      .append("path")
      .datum(filteredData)
      .attr("d", lineClose)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2);

    svg
      .append("g")
      .attr("transform", `translate(0, ${innerHeight + 10})`)
      .call(d3.axisBottom(xScale).ticks(10));

    svg.append("g").call(d3.axisLeft(yScale));
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
