async function drawLineChart() {
    const impeachmentData = await d3.csv("https://raw.githubusercontent.com/DillonMurphy04/CopytheMastersData/main/impeachment.csv");
    // const pollsData = await d3.csv("https://raw.githubusercontent.com/DillonMurphy04/CopytheMastersData/main/polls.csv");
  
    const yAccessor = d => +d.yes_estimate;
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = d => dateParser(d.modeldate);

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
            .attr("stroke", party === "dem" ? "blue" : party === "rep" ? "red" : "black")
            .attr("stroke-width", 2);
        }
}

drawLineChart();