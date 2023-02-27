// Set frame dimensions
const SCATTER_FRAME_HEIGHT = 500;
const SCATTER_FRAME_WIDTH = 500; 

// Create three frames for each visualization
const FRAME1 = d3.select("#vis1")
                 .append("svg")
                 .attr("height", SCATTER_FRAME_HEIGHT)
                 .attr("width", SCATTER_FRAME_WIDTH)
                 .attr("class", "frame"); 

const FRAME2 = d3.select("#vis2")
                 .append("svg")
                 .attr("height", SCATTER_FRAME_HEIGHT)
                 .attr("width", SCATTER_FRAME_WIDTH)
                 .attr("class", "frame"); 

// Set scatter plot margins
const SCATTER_PLOT_MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions
const SCATTER_VIS_HEIGHT = SCATTER_FRAME_HEIGHT - SCATTER_PLOT_MARGINS.top - SCATTER_PLOT_MARGINS.bottom;
const SCATTER_VIS_WIDTH = SCATTER_FRAME_WIDTH - SCATTER_PLOT_MARGINS.left - SCATTER_PLOT_MARGINS.right; 


// Build interactive scatter and bar plots
function build_interactive_plots() { 

  // Scatter plot: Petal Length vs. Sepal Length

  // Parse scatter plot data
  d3.csv("data/iris.csv").then((data) => {

    // Find max X value
    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
 
    // Find max Y value
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

    // Scale X
    const X1_SCALE = d3.scaleLinear() 
                       .domain([0, (MAX_X1 + 1)]) // add some padding  
                       .range([0, SCATTER_VIS_WIDTH]); 

    // Scale Y
    const Y1_SCALE = d3.scaleLinear()
                      .domain([0, (MAX_Y1 + 1)])
                      .range([SCATTER_VIS_HEIGHT, 0]);

    // Plot points on scatter plot
    FRAME1.selectAll("points")  
          .data(data)  
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X1_SCALE(d.Sepal_Length) + SCATTER_PLOT_MARGINS.left); }) 
            .attr("cy", (d) => { return (Y1_SCALE(d.Petal_Length) + SCATTER_PLOT_MARGINS.top); }) 
            .attr("r", 5)
            .attr("class", (d) => { return d.Species; });

    // Add X axis  
    FRAME1.append("g") 
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + (SCATTER_VIS_HEIGHT + SCATTER_PLOT_MARGINS.top) + ")") 
          .call(d3.axisBottom(X1_SCALE).ticks(9)) 
          .attr("font-size", "10px");

    // Add Y axis
    FRAME1.append("g")       
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + SCATTER_PLOT_MARGINS.bottom + ")")
          .call(d3.axisLeft(Y1_SCALE).ticks(14))
          .attr("font-size", "10px");
  });

  // Scatter plot - Petal Width vs. Sepal Width

  // Parse scatter plot data
  d3.csv("data/iris.csv").then((data) => {

    // Find max X value
    const MAX_X2 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
   
    // Find max Y value
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

    // Scale X
    const X2_SCALE = d3.scaleLinear() 
                       .domain([0, (MAX_X2 + 1)]) // add some padding  
                       .range([0, SCATTER_VIS_WIDTH]); 

    // Scale Y
    const Y2_SCALE = d3.scaleLinear()
                      .domain([0, (MAX_Y2 + 1)])
                      .range([SCATTER_VIS_HEIGHT, 0]);

    // Plot points on scatter plot
    let myPoint= FRAME2.append("g")
          .selectAll("points")
          .data(data)  
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X2_SCALE(d.Sepal_Width) + SCATTER_PLOT_MARGINS.left); }) 
            .attr("cy", (d) => { return (Y2_SCALE(d.Petal_Width) + SCATTER_PLOT_MARGINS.top); }) 
            .attr("r", 5)
            .attr("class", (d) => { return d.Species; });

    // Add X axis  
    FRAME2.append("g") 
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + (SCATTER_VIS_HEIGHT + SCATTER_PLOT_MARGINS.top) + ")") 
          .call(d3.axisBottom(X2_SCALE).ticks(9)) 
          .attr("font-size", "10px");

    // Add Y axis
    FRAME2.append("g")       
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + SCATTER_PLOT_MARGINS.bottom + ")")
          .call(d3.axisLeft(Y2_SCALE).ticks(14))
          .attr("font-size", "10px");

    // Add brushing
    FRAME2
    .call( d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [SCATTER_FRAME_WIDTH, SCATTER_FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    )

    // Function that is triggered when brushing is performed
    function updateChart({selection}) {
    if (selection === null) {
      myPoint.attr("stroke", null);
    } else {
      console.log(myPoint.classList)
      let selected_flower_type = (d) => { return d.Species; };
      var elts = document.getElementsByClassName(selected_flower_type);

        for(var e = 0; e < elts.length; e++) { // For each element
           var elt = elts[e];
           elt.classList.add("selected");
}
    }
  }

    // A function that return TRUE or FALSE according if a dot is in the selection or not
    function isBrushed(brush_coords, cx, cy) {
         let x0 = brush_coords[0][0],
             x1 = brush_coords[1][0],
             y0 = brush_coords[0][1],
             y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }

  }); 

  // Bar chart - Iris Species Count

  // Set bar graph margins
  const BAR_CHART_MARGINS = {top: 30, right: 30, bottom:30, left: 60};

  // Set frame dimensions
  const BAR_FRAME_WIDTH = 460 - BAR_CHART_MARGINS.left - BAR_CHART_MARGINS.right;
  const BAR_FRAME_HEIGHT = 400 - BAR_CHART_MARGINS.top - BAR_CHART_MARGINS.bottom;

  // Append the bar graph frame to the body of the page
  const FRAME3 = d3.select("#vis3")
                    .append("svg")
                    .attr("width", BAR_FRAME_WIDTH + BAR_CHART_MARGINS.left + BAR_CHART_MARGINS.right)
                    .attr("height", BAR_FRAME_HEIGHT + BAR_CHART_MARGINS.top + BAR_CHART_MARGINS.bottom)
                    .append("g")
                    .attr("transform", "translate(" + BAR_CHART_MARGINS.left + "," + BAR_CHART_MARGINS.top + ")");

  // Parse bar graph data
  d3.csv("data/iris.csv").then((data) => {

    // Scale X axis
    const BAR_X_SCALE = d3.scaleBand()
                          .range([ 0, BAR_FRAME_WIDTH ])
                          .domain(data.map(function(d) { return d.Species; }))
                          .padding(0.2);

    // Add X axis
    FRAME3.append("g")
          .attr("transform", "translate(0," + BAR_FRAME_HEIGHT + ")")
          .call(d3.axisBottom(BAR_X_SCALE))
          .selectAll("text");

    // Sets the max Y value
    const MAX_VAL = 50;

    // Scale Y axis
    const BAR_Y_SCALE = d3.scaleLinear()
                          .domain([0, MAX_VAL])
                          .range([ BAR_FRAME_HEIGHT, 0]);

    // Add Y axis
    FRAME3.append("g")
          .call(d3.axisLeft(BAR_Y_SCALE));

    // Create bars, which are scaled accordingly
    FRAME3.selectAll("mybar")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", function(d) { return BAR_X_SCALE(d.Species); })
          .attr("y", BAR_Y_SCALE(50))
          .attr("width", BAR_X_SCALE.bandwidth())
          .attr("height", function(d) { return BAR_FRAME_HEIGHT - BAR_Y_SCALE(50); })
          .attr("class", (d) => { return d.Species; });
  });
}


// Call function to display the plots
build_interactive_plots();
