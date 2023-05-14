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
      .domain(d3.extent(impeachmentData, yAccessor))
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

    const yAxis = bounds.append("g")
      .call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
    
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`)
    
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
}

drawLineChart();