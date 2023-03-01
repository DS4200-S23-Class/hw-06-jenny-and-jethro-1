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

// Create frame for bar graph (Counts of Species)
const FRAME3 = d3.select("#vis3")
                    .append("svg")
                    .attr("width", VIS_WIDTH + MARGINS.left + MARGINS.right)
                    .attr("height", VIS_HEIGHT + MARGINS.top + MARGINS.bottom)
                    .append("g")
                    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");



// Parse iris data (only done once because the same data is used for each plot)
d3.csv("data/iris.csv").then((data) => {

  // Scatter plot: Petal_Length vs. Sepal_Length

  // Find max sepal length (x) value
  const MAX_SEP_LEN = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
 
  // Find max petal length (y) value
  const MAX_PET_LEN = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

  // Scale X
  const SEP_LEN_SCALE = d3.scaleLinear() 
                     .domain([0, (MAX_SEP_LEN + 1)]) // add some padding  
                     .range([0, VIS_WIDTH]); 

  // Scale Y
  const PET_LEN_SCALE = d3.scaleLinear()
                     .domain([0, (MAX_PET_LEN + 1)])
                     .range([VIS_HEIGHT, 0]);

  // Plot points on scatter plot
  let myPoint1 = FRAME1.append("g")
                       .selectAll("points")  
                       .data(data)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (SEP_LEN_SCALE(d.Sepal_Length) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (PET_LEN_SCALE(d.Petal_Length) + MARGINS.top); }) 
                       .attr("r", 5)
                       .attr("class", (d) => { return d.Species; });

  // Add X axis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(SEP_LEN_SCALE).ticks(9)) 
        .attr("font-size", "10px");

  // Add Y axis
  FRAME1.append("g")       
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
        .call(d3.axisLeft(PET_LEN_SCALE).ticks(14))
        .attr("font-size", "10px");



  // Scatter plot: Petal_Width vs. Sepal_Width

  // Find max sepal width (x) value
  const MAX_SEP_WIDTH = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
   
  // Find max petal width (y) value
  const MAX_PET_WIDTH = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

  // Scale X
  const SEP_WIDTH_SCALE = d3.scaleLinear() 
                     .domain([0, (MAX_SEP_WIDTH + 1)]) // add some padding  
                     .range([0, VIS_WIDTH]); 

  // Scale Y
  const PET_WIDTH_SCALE = d3.scaleLinear()
                     .domain([0, (MAX_PET_WIDTH + 1)])
                     .range([VIS_HEIGHT, 0]);

  // Plot points on scatter plot
  let myPoint2 = FRAME2.append("g")
                       .selectAll("points")
                       .data(data)  
                       .enter()       
                       .append("circle")  
                       .attr("cx", (d) => { return (SEP_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left); }) 
                       .attr("cy", (d) => { return (PET_WIDTH_SCALE(d.Petal_Width) + MARGINS.top); }) 
                       .attr("r", 5)
                       .attr("class", (d) => { return d.Species; });

  // Add X axis  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(SEP_WIDTH_SCALE).ticks(9)) 
        .attr("font-size", "10px");

  // Add Y axis
  FRAME2.append("g")       
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
        .call(d3.axisLeft(PET_WIDTH_SCALE).ticks(14))
        .attr("font-size", "10px");

  // Add brushing
  FRAME2.call( d3.brush()                 // Use d3.brush to initalize a brush feature
                 .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // establish the brush area (maximum brush window = entire graph area)
                 .on("start brush", updateChart)); // 'updateChart' is triggered every time the brush window gets altered

  

  // Bar graph: Counts of Species

  // Set max Y (count) value
  const MAX_COUNT = 50;

  // Scale X
  const BAR_SPECIES_SCALE = d3.scaleBand()
                        .range([ 0, VIS_WIDTH ])
                        .domain(data.map(function(d) { return d.Species; }))
                        .padding(0.2);

  // Scale Y
  const BAR_COUNT_SCALE = d3.scaleLinear()
                        .domain([0, MAX_COUNT])
                        .range([ VIS_HEIGHT, 0]);

  // Add X axis
  FRAME3.append("g")
        .attr("transform", "translate(0," + VIS_HEIGHT + ")")
        .call(d3.axisBottom(BAR_SPECIES_SCALE))
        .selectAll("text");

  // Add Y axis
  FRAME3.append("g")
        .call(d3.axisLeft(BAR_COUNT_SCALE));

  // Add bars, which are scaled accordingly
  let myBar = FRAME3.append("g")
                    .selectAll("mybar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) { return BAR_SPECIES_SCALE(d.Species); })
                    .attr("y", BAR_COUNT_SCALE(50))
                    .attr("width", BAR_SPECIES_SCALE.bandwidth())
                    .attr("height", function(d) { return VIS_HEIGHT - BAR_COUNT_SCALE(50); })
                    .attr("class", (d) => { return d.Species; });



  // Brushing and Linking

  // When points are brushed over in the center scatter plot, the aligned points in the leftmost plot get highlighted with a raised opacity and attain an orange border. 
  // Furthermore, any aligned bars in the rightmost plot get highlighted and also attain an orange border.
  function updateChart(event) {
    selection = event.selection;
    myPoint1.classed("selected", function(d){ return isBrushed(selection, SEP_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left, PET_WIDTH_SCALE(d.Petal_Width) + MARGINS.top ); } )
    myPoint2.classed("selected", function(d){ return isBrushed(selection, SEP_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left, PET_WIDTH_SCALE(d.Petal_Width) + MARGINS.top ); } )
    myBar.classed("selected", function(d){ return isBrushed(selection, SEP_WIDTH_SCALE(d.Sepal_Width) + MARGINS.left, PET_WIDTH_SCALE(d.Petal_Width) + MARGINS.top ); } )
  };

  // Returns TRUE if a point is in the selection window, returns FALSE if it is not
  function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // indicates which points are in the selection window via booleans
  };

});