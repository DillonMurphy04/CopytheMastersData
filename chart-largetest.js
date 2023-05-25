// 1. ACCESS DATA


    const partyAccessor = d => d.party
    const yAccessor = d => d.yes_estimate
    const dateParser = d3.timeParse("%Y-%m-%d")
    //const dateParser = d3.time.format("%Y-%m-%d").parse
    const xAccessor = d => dateParser(d.modeldate)
    const dateParser2 = d3.timeParse("%Y-%m-%d %H:%M:%S")
    //const dateParser2 = d3.time.format("%Y-%m-%d %H:%M:%S").parse
    const xAccessor2 = d => dateParser2(d.modeldate)
    
// 2. CREATE CHART DIMENSIONS
    let dimensions = {
      width: width*0.9,
      height: height,
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
      //.domain(d3.extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
  
// 5. DRAW DATA -----------------------------------------------------------
  
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

      for (partyAccessor) {
      bounds
        .data(data)
        .enter().append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.75);
      }

// 6. DRAW PERIPHERALS (AXIS) ---------------------------------------------

// y axis  
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

// x axis  
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
    
    const xAxis = svg.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${
          dimensions.boundedHeight
        }px)`)
        .style("stroke", "lightgray")
        .style("font-size", "15px")
        