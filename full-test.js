// !preview r2d3 data = tibble(party = c("dem", "dem", "dem", "dem", "dem", "dem", "rep", "rep", "rep", "rep", "rep", "rep"), modeldate = c("2020-03-12", "2020-02-11", "2020-02-10", "2020-02-09", "2020-02-08", "2020-02-07", "2020-03-12", "2020-02-11", "2020-02-10", "2020-02-09", "2020-02-08", "2020-02-07"), yes_estimate = c(84.4, 84.4, 85.2, 85.2, 84.1, 84.1, 54.4, 54.4, 55.2, 55.2, 54.1, 54.1))

// 1. ACCESS DATA
    const yAccessor = d => d.yes_estimate
    const dateParser = d3.timeParse("%Y-%m-%d")
    const xAccessor = d => dateParser(d.modeldate)
    const dateParser2 = d3.timeParse("%Y-%m-%d %H:%M:%S")
    const xAccessor2 = d => dateParser2(d.modeldate)
    const partyAccessor = d => d.party

// 2. CREATE CHART DIMENSIONS
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

//compute size of bounds (contains all of the data elements: in this case, our line)
    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom
 
// 3. DRAW CANVAS -------------------------------------------------------   
    const wrapper = svg.selectAll("rect")
        .attr("id", "wrapper")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        
    
    const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)
      
      
    // this is already here -- one of the differences about running in R; has a built in svg
  
    /*
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
      */

// 4. CREATE SCALES ------------------------------------------------------
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([dimensions.boundedHeight, 0])

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
  
// 5. DRAW DATA -----------------------------------------------------------
  
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))


// d3.groups only in d3 version 7, instead trying d3.rollup (I believe it is in version 6??)
    const groups = d3.rollup(
      data,
      v => v.map(d => ({ party: d.party, modeldate: d.modeldate, yes_estimate: d.yes_estimate })),
      d => d.party
    );

// Iterate over groups
  for (const [party, group] of groups) {
    svg
      .append("path")
      .datum(group)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", party === "dem" ? d3.rgb(56, 160, 232) : party === "rep" ? d3.rgb(232, 16, 23) : d3.rgb(0, 0, 0))
      .attr("stroke-width", 2.75);
  }

// 6. DRAW PERIPHERALS (AXIS) ---------------------------------------------
    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(3)
      .tickValues([0, 50, 100])

    const yAxis = svg.append("g")
      .call(yAxisGenerator)
      .style("stroke", "lightgray")
      .style("font-size", "15px")

    yAxis.select(".domain")
      .style("display", "none");

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
    
    const xAxis = svg.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`)
        .style("stroke", "lightgray")
        .style("font-size", "15px")
    
    const line50 = svg.append("line")
      .attr("x1", 0)
      .attr("x2", dimensions.boundedWidth)
      .attr("y1", yScale(50))
      .attr("y2", yScale(50))
      .attr("stroke", "lightgray")
      .attr("stroke-width", 2);

    const line100 = svg.append("line")
      .attr("x1", 0)
      .attr("x2", dimensions.boundedWidth)
      .attr("y1", yScale(100))
      .attr("y2", yScale(100))
      .attr("stroke", "lightgray")
      .attr("stroke-width", 2);
      
    const [minDate, maxDate] = d3.extent(data, xAccessor);
    const monthTicks = d3.timeMonths(minDate, maxDate)
      .filter((d, i) => i !== 0);

    svg.selectAll(".vertical-line")
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
      
    function addLineWithTest(date, text1, text2) {
      const line = svg.append("line")
        .attr("x1", xScale(dateParser(date)))
        .attr("x2", xScale(dateParser(date)))
        .attr("y1", 15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "2px 4px")
        .attr("stroke-width", 2);

      const label = svg.append("text")
        .attr("y",  5)
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
    
    const listeningRect = svg.append("rect")
      .attr("class", "listening-rect")
      .attr("width", dimensions.boundedWidth)
      .attr("height", dimensions.boundedHeight)
      .on("mousemove", onMouseMove)
      .on("mouseleave", onMouseLeave)
      
  const tooltipLine = svg.append("line")
    .attr("class", "tooltip-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", dimensions.boundedHeight)
    .style("opacity", 0)
    .style("stroke", "gray")
    .style("stroke-dasharray", "2px 4px")
    
  function onMouseMove(event) {
      const mousePosition = d3.pointer(event, this)
      tooltipLine
        .attr("x1", mousePosition[0])
        .attr("x2", mousePosition[0])
        .style("opacity", 1)
    }
    
  function onMouseLeave(){
    tooltipLine.style("opacity", 0)

  }