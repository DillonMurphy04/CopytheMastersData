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
        top: 15,
        right: 15,
        bottom: 40,
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

        const line1 = bounds.append("line")
            .attr("x1", xScale(dateParser("2019-04-18")))
            .attr("x2", xScale(dateParser("2019-04-18")))
            .attr("y1", 15)
            .attr("y2", dimensions.boundedHeight)
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "2px 4px")
            .attr("stroke-width", 2);

        const label1 = bounds.append("text")
            .attr("y",  -5)
            .attr("fill", "gray")
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .append("tspan")
              .attr("dy", "0em")
              .text("Mueller report")
              .attr("x", xScale(dateParser("2019-04-18")))
            .append("tspan")
              .attr("dy", "1em")
              .text("made public")  
              .attr("x", xScale(dateParser("2019-04-18")))
}

drawLineChart();