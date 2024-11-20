import React, { Component } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", //Default Month
  };

  changeMonth = (e) => {
    this.setState({ selectedMonth: parseInt(e.target.value) });
  };

  changeCompany = (e) => {
    this.setState({ company: e.target.value });
  };

  componentDidMount() {
    console.log("Data: ", this.props.csv_data); // Use this data as default. When the user will upload data this props will provide you the updated data

    const data = this.props.csv_data;
    data.forEach((item) => {
      item.Date = new Date(item.Date);
    });

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 1200,
      height = 900,
      innerWidth = 1200 - margin.left - margin.right,
      innerHeight = 900 - margin.top - margin.bottom;

    const svg = d3
      .select(".mysvg")
      .attr("width", width)
      .attr("height", height)
      .select("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Open), d3.max(data, (d) => d.Open)])
      .range([height, 0]);

    var openLine = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Open));
    var pathData1 = openLine(data);

    var closeLine = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Close));
    var pathData2 = closeLine(data);

    svg
      .selectAll("path")
      .data([pathData1])
      .join("path")
      .attr("d", (d) => d)
      .attr("fill", "none")
      .attr("stroke", "blue");
    svg
      .selectAll("path1")
      .data([pathData2])
      .join("path")
      .attr("d", (d) => d)
      .attr("fill", "none")
      .attr("stroke", "red");

    svg
      .selectAll(".x.axis")
      .data([null])
      .join("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));
    svg
      .selectAll(".y.axis")
      .data([null])
      .join("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.csv_data !== this.props.csv_data){
      const data = this.props.csv_data;
      data.forEach((item) => {
        item.Date = new Date(item.Date);
      });
      
    }
  }

  

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"]; // Use this data to create radio button
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
    }; // Use this data to create dropdown

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
        <svg className="mysvg">
          <g></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
