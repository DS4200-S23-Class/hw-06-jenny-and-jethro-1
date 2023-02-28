// Set up scatter plots

// Set frame dimensions for visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

// Create frame for scatter plot (Petal_Length vs. Sepal_Length)
const FRAME1 = d3.select("#vis1")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create frame for scatter plot (Petal_Width vs. Sepal Width)
const FRAME2 = d3.select("#vis2")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Set margins for visualizations
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions for visualizations
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 



// Set up bar graph

// Create frame for bar graph (Count of Species)
const FRAME3 = d3.select("#vis3")
                    .append("svg")
                    .attr("width", VIS_WIDTH + MARGINS.left + MARGINS.right)
                    .attr("height", VIS_HEIGHT + MARGINS.top + MARGINS.bottom)
                    .append("g")
                    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");



// Parse scatter plot data (only done once because it is the same data)
d3.csv("data/iris.csv").then((data) => {

  // Scatter plot: Petal_Length vs. Sepal_Length

  // Find max X value
  const MAX_X1 = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
 
  // Find max Y value
  const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

  // Scale X
  const X1_SCALE = d3.scaleLinear() 
                     .domain([0, (MAX_X1 + 1)]) // add some padding  
                     .range([0, VIS_WIDTH]); 

  // Scale Y
  const Y1_SCALE = d3.scaleLinear()
                     .domain([0, (MAX_Y1 + 1)])
                     .range([VIS_HEIGHT, 0]);

  // Plot points on scatter plot
  let myPoint1 = FRAME1.append("g")
                       .selectAll("points")  
                       .data(data)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (X1_SCALE(d.Sepal_Length) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (Y1_SCALE(d.Petal_Length) + MARGINS.top); }) 
                       .attr("r", 5)
                       .attr("class", (d) => { return d.Species; });

  // Add X axis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X1_SCALE).ticks(9)) 
        .attr("font-size", "10px");

  // Add Y axis
  FRAME1.append("g")       
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
        .call(d3.axisLeft(Y1_SCALE).ticks(14))
        .attr("font-size", "10px");



  // Scatter plot: Petal_Width vs. Sepal_Width

  // Find max X value
  const MAX_X2 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
   
  // Find max Y value
  const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

  // Scale X
  const X2_SCALE = d3.scaleLinear() 
                     .domain([0, (MAX_X2 + 1)]) // add some padding  
                     .range([0, VIS_WIDTH]); 

  // Scale Y
  const Y2_SCALE = d3.scaleLinear()
                     .domain([0, (MAX_Y2 + 1)])
                     .range([VIS_HEIGHT, 0]);

  // Plot points on scatter plot
  let myPoint2 = FRAME2.append("g")
                       .selectAll("points")
                       .data(data)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (X2_SCALE(d.Sepal_Width) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (Y2_SCALE(d.Petal_Width) + MARGINS.top); }) 
                       .attr("r", 5)
                       .attr("class", (d) => { return d.Species; });

  // Add X axis  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X2_SCALE).ticks(9)) 
        .attr("font-size", "10px");

  // Add Y axis
  FRAME2.append("g")       
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
        .call(d3.axisLeft(Y2_SCALE).ticks(14))
        .attr("font-size", "10px");

  // Add brushing
  FRAME2.call( d3.brush()                 // Add the brush feature using the d3.brush function
                 .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                 .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
  );

  

  // Bar graph: Count of Species

  // Set max Y value
  const MAX_VAL = 50;

  // Scale X
  const BAR_X_SCALE = d3.scaleBand()
                        .range([ 0, VIS_WIDTH ])
                        .domain(data.map(function(d) { return d.Species; }))
                        .padding(0.2);

  // Scale Y
  const BAR_Y_SCALE = d3.scaleLinear()
                        .domain([0, MAX_VAL])
                        .range([ VIS_HEIGHT, 0]);

  // Add X axis
  FRAME3.append("g")
        .attr("transform", "translate(0," + VIS_HEIGHT + ")")
        .call(d3.axisBottom(BAR_X_SCALE))
        .selectAll("text");

  // Add Y axis
  FRAME3.append("g")
        .call(d3.axisLeft(BAR_Y_SCALE));

  // Add bars, which are scaled accordingly
  let myBar = FRAME3.append("g")
                    .selectAll("mybar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) { return BAR_X_SCALE(d.Species); })
                    .attr("y", BAR_Y_SCALE(50))
                    .attr("width", BAR_X_SCALE.bandwidth())
                    .attr("height", function(d) { return VIS_HEIGHT - BAR_Y_SCALE(50); })
                    .attr("class", (d) => { return d.Species; });



  // Brushing and Linking

  // Function that is triggered when brushing is performed
  function updateChart(event) {
    selection = event.selection;
    myPoint1.classed("selected", function(d){ return isBrushed(selection, X2_SCALE(d.Sepal_Width) + MARGINS.left, Y2_SCALE(d.Petal_Width) + MARGINS.top ); } )
    myPoint2.classed("selected", function(d){ return isBrushed(selection, X2_SCALE(d.Sepal_Width) + MARGINS.left, Y2_SCALE(d.Petal_Width) + MARGINS.top ); } )
    myBar.classed("selected", function(d){ return isBrushed(selection, X2_SCALE(d.Sepal_Width) + MARGINS.left, Y2_SCALE(d.Petal_Width) + MARGINS.top ); } )
  };

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  //cx and cy are the points thmeselves, coords are the box coords
  function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  };

});