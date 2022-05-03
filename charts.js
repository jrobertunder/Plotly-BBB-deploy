function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var metadata = data.metadata;
   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);
   
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDarray = result.otu_ids
    console.log(otuIDarray);
    var otulabelArray = result.otu_labels
    console.log(otulabelArray);
    var sampleValuesArray = result.sample_values
    console.log(sampleValuesArray);
    // 7. Create the yticks for the bar chart.
    
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDarray.slice(0,10).map(id=> 'OTU ${id}').reverse();


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValuesArray.slice(0,10).reverse(),
      text: otulabelArray.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      marker: {
        color: sampleValuesArray,
        colorscale: "Bluered",

      }
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: {
      text: "Top 10 Bacterial Cultures Found",
      font: {color: "rgb(150, 50, 256"},
     }
    };
    // 10. Use Plotly to plot the data with the layout. 
      
    Plotly.newPlot("bar", barData, barLayout);
 
    // Bar and Bubble charts
     // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDarray,
      y: sampleValuesArray,
      text: otuIDarray.map(id => 'OTU ${id}'),
      mode: 'markers',
      marker: {
        size: sampleValuesArray,
        color: otuIDarray,
        colorscale: "Bluered"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "Bacteria Clutures Per Sample",
        font: {color: "rgb(150, 50, 256"},
      },
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
// Create a variable that filters the metadata array and holds the selected sample
var filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);
console.log(filteredMeta);
var selectedMeta = filteredMeta[0]; 
console.log(selectedMeta);

// Create a variable that holds the washing frequency.
washFreq = selectedMeta.wfreq;
console.log(washFreq);

// Create the trace for the gauge chart.
var gaugeData = [{
  value: washFreq,
  title: {
    text: "Belly Button Washing Frequency<br>Scrubs per Week<br>", 
    font: {color: "rgb(245, 4, 24)", size: 16},
    padding: {top: 10, bottom: 100}
  },
  type: "indicator",
  mode: "gauge+number",
  gauge: {
    axis: {range: [null, 10]},
    bar: {color: "yellowgreen"},
    steps: [
      {range: [0,1], color: "rgb(60,0,195)"},
      {range: [1,2], color: "rgb(71,0,184)"},
      {range: [2,3], color: "rgb(86,0,179)"},
      {range: [3,4], color: "rgb(109,0,146)"},
      {range: [4,5], color: "rgb(120,0,135)"}, 
      {range: [5,6], color: "rgb(174,61,136)"},
      {range: [6,7], color: "rgb(201,61,111)"},
      {range: [7,8], color: "rgb(210,61,101)"},
      {range: [8,9], color: "rgb(231,61,76)"},
      {range: [9,10], color: "rgb(250,61,61)"},         
    ]
  }
}];

// Create the layout for the gauge chart.
var gaugeLayout = { 
  width: 400,
  height: 300,
  margin: {t:60, r:25, l:15, b:0}   
};

// Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
}
