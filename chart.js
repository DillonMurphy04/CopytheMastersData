async function drawLineChart() {
    const impeachmentData = await d3.csv("https://raw.githubusercontent.com/DillonMurphy04/CopytheMastersData/main/impeachment.csv");
    const pollsData = await d3.csv("https://raw.githubusercontent.com/DillonMurphy04/CopytheMastersData/main/polls.csv");
  
    const yAccessor = d => +d.yes_estimate;
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = d => dateParser(d.modeldate);
    const dateParser2 = d3.timeParse("%Y-%m-%d %H:%M:%S");
    const xAccessor2 = d => dateParser2(d.modeldate);

    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 400,
      margin: {
        top: 55,
        right: 15,
        bottom: 60,
        left: 60,
      },
    }

    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom
    
    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
    
    const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([dimensions.boundedHeight, 0])

    const xScale = d3.scaleTime()
      .domain(d3.extent(impeachmentData, xAccessor))
      .range([0, dimensions.boundedWidth])
    
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

    const groups = d3.group(impeachmentData, d => d.party);

    for (const [party, data] of groups) {
      bounds.append("path")
        .datum(data)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", party === "dem" ? d3.rgb(56, 160, 232) : party === "rep" ? d3.rgb(232, 16, 23) : d3.rgb(0, 0, 0))
        .attr("stroke-width", 2.75);
    }

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(3)
      .tickValues([0, 50, 100])

    const yAxis = bounds.append("g")
      .call(yAxisGenerator)
      .style("stroke", "lightgray")
      .style("font-size", "15px")

    yAxis.select(".domain")
      .style("display", "none");

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
    
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`)
        .style("stroke", "lightgray")
        .style("font-size", "15px")
    
    const line50 = bounds.append("line")
      .attr("x1", 0)
      .attr("x2", dimensions.boundedWidth)
      .attr("y1", yScale(50))
      .attr("y2", yScale(50))
      .attr("stroke", "lightgray")
      .attr("stroke-width", 2);

    const line100 = bounds.append("line")
      .attr("x1", 0)
      .attr("x2", dimensions.boundedWidth)
      .attr("y1", yScale(100))
      .attr("y2", yScale(100))
      .attr("stroke", "lightgray")
      .attr("stroke-width", 2);

    const [minDate, maxDate] = d3.extent(impeachmentData, xAccessor);
    const monthTicks = d3.timeMonths(minDate, maxDate)
      .filter((d, i) => i !== 0);

    bounds.selectAll(".vertical-line")
      .data(monthTicks)
      .enter()
      .append("line")
      .attr("class", "vertical-line")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", -10)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "lightgray")
      .attr("stroke-width", 1)
 
    const colorAccessor = d => d.party
      
    const colorScale = d3.scaleOrdinal()
      .domain(["dem", "rep", "ind"])
      .range([d3.rgb(56, 160, 232, 0.4), d3.rgb(232, 16, 23, 0.4), d3.rgb(0, 0, 0, 0.4)])
    
    const dots = bounds.selectAll("circle").data(pollsData)
    dots.join("circle")
      .attr("cx", d => xScale(xAccessor2(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 3.25)
      .attr("fill", d => colorScale(colorAccessor(d)))

    function addLineWithTest(date, text1, text2) {
      const line = bounds.append("line")
        .attr("x1", xScale(dateParser(date)))
        .attr("x2", xScale(dateParser(date)))
        .attr("y1", -5)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "2px 4px")
        .attr("stroke-width", 2);

      const label = bounds.append("text")
        .attr("y",  -20)
        .attr("fill", "gray")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .append("tspan")
          .attr("dy", "0em")
          .text(text1)
          .attr("x", xScale(dateParser(date)))
        .append("tspan")
          .attr("dy", "1em")
          .text(text2)  
          .attr("x", xScale(dateParser(date)))
    }
    addLineWithTest("2019-04-18", "Mueller report", "made public")
    addLineWithTest("2019-07-24", "Mueller testified", "before Congress")
    addLineWithTest("2019-12-18", "House voted to", "impeach Trump")
    addLineWithTest("2020-02-05", "Senate voted to", "acquit Trump")

    const line = bounds.append("line")
      .attr("x1", xScale(dateParser("2019-09-24")))
      .attr("x2", xScale(dateParser("2019-09-24")))
      .attr("y1", 0)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "2px 4px")
      .attr("stroke-width", 2);

  const label = bounds.append("text")
    .attr("y",  -30)
    .attr("fill", "gray")
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .append("tspan")
      .attr("dy", "0em")
      .text("Pelosi")
      .attr("x", xScale(dateParser("2019-09-24")))
    .append("tspan")
      .attr("dy", "1em")
      .text("announced")  
      .attr("x", xScale(dateParser("2019-09-24")))
    .append("tspan")
      .attr("dy", "1em")
      .text("impeachement")  
      .attr("x", xScale(dateParser("2019-09-24")))
    .append("tspan")
      .attr("dy", "1em")
      .text("inquiry")  
      .attr("x", xScale(dateParser("2019-09-24")))

  const listeningRect = bounds.append("rect")
    .attr("class", "listening-rect")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)

  const tooltipLine = bounds.append("line")
    .attr("class", "tooltip-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", dimensions.boundedHeight)
    .style("opacity", 0)
    .style("stroke", "gray")
    .style("stroke-dasharray", "2px 4px")
  
  const tooltipDem = d3.select("#tooltip-dem");
  const tooltipRep = d3.select("#tooltip-rep");
  const tooltipInd = d3.select("#tooltip-ind");
  const tooltipDate = d3.select("#tooltip-date")
    .style("top", `${dimensions.boundedHeight}px`)

  function onMouseMove(event) {
    const mousePosition = d3.pointer(event, this)
    const hoveredDate = xScale.invert(mousePosition[0])
    const getDistanceFromHoveredDate = d => Math.abs(
      xAccessor(d) - hoveredDate
    )

    tooltipLine
      .attr("x1", mousePosition[0])
      .attr("x2", mousePosition[0])
      .style("opacity", 1)
    
    for (const [party, data] of groups) {
      const closestIndex = d3.scan(data, (a, b) => (
        getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
      ))
      const closestDataPoint = data[closestIndex]
      const closestXValue = xAccessor(closestDataPoint)
      const closestYValue = yAccessor(closestDataPoint)
      const formatDate = d3.timeFormat("%B %-d, %Y")

      let tooltip;
      if (party === "dem") {
        tooltip = tooltipDem;
      } else if (party === "rep") {
        tooltip = tooltipRep;
      } else {
        tooltip = tooltipInd;
      }
    
      tooltip.select(".tooltip-percent")
        .text(closestYValue.toFixed(1) + "% " + party)

      tooltip.style("color", () => {
        return party === "dem" ? "blue" : party === "rep" ? "red" : "black";
      })
    
      const x = xScale(closestXValue)
        + dimensions.margin.left
      const y = yScale(closestYValue)
        + dimensions.margin.top
      
      tooltipDate
        .text(formatDate(closestXValue))
        .style("opacity", 1)
        .style("transform", `translate(`
        + `${x}px,`
        + `15px`
        + `)`)

      tooltip.style("transform", `translate(`
        + `${x}px,`
        + `${y}px`
        + `)`)
    
      tooltip.style("opacity", 1)
    }
  }
  
  function onMouseLeave(){
    tooltipDem.style("opacity", 0)
    tooltipRep.style("opacity", 0)
    tooltipInd.style("opacity", 0)
    tooltipLine.style("opacity", 0)
    tooltipDate.style("opacity", 0)
  }
}

drawLineChart();