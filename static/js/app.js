// initialize function to create category ID selector.
function init() {
    // Reference to drop down selection 
    const selector = d3.select("#selDataset");
    // URL for accessing dataset
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
    
    // fetch data 
    d3.json(url).then((data) => {
    // Retrieve names from 
    const sampleNames = data.names;
    // console log it.
    console.log(data);
    // populting list with ID names, using property function to add values in the constant selector variable.
    
    for (let sample of sampleNames) {
          selector.append("option")
          .text(sample)
          .property("value", sample);
        }
    // Creating initial plot by taking first data from the dataset.
    const initialSample = sampleNames[0];
    createCharts(initialSample);
    createMetadata(initialSample);
    });
  }
// Initialize the dashboard
init();

function changedOption(newSample) {
  // Fetch new data each time a new sample is selected
  createMetadata(newSample);
  createCharts(newSample);
}

// Demographics Panel
function createMetadata(sample) {
    // Retrieve data from URL 
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
    // Get Meta data values to populate deographic panel.
    d3.json(url).then((data) => {
    const metadata = data.metadata;
    // Get the choosen object by filtering data
    const resultArray = metadata.filter((sObject) => sObject.id == sample);
    const result = resultArray[0];
    //selecting metadata panel using d3.select id of `#sample-metadata`
    const demographicPanel = d3.select("#sample-metadata");

    // clear any meta data already present in demographic panel using .html("").
    demographicPanel.html("");

    // show demographic panel value by using 'Object.entries' for key and value pair.
    Object.entries(result).forEach(([key, value]) => {
    demographicPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    
  });
}

// Create the createCharts function.
function createCharts(sample) {
  //  Use d3.json to load and retrieve data from provided URL.
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  d3.json(url).then((data) => {
    // Configuration Options for Plotly
    const config = {
      // Window size responsivness
      responsive: true, 
      // scroll the zoom option
      scrollZoom: true, 
      // hide the Plotly logo
      displaylogo: false, 
      // Never Display the Modebar
      displayModeBar: false, 
    };

    // Create a constant that holds the samples array.
    const samples = data.samples;

    //Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter(
      (sampleNumber) => sampleNumber.id == sample
    );

    //  Create a variable that holds the first sample in the array.
    let resultFirst = resultArray[0];

    // Create const's that hold the otu_ids, otu_labels, and sample_values.
    // Create the ticks for the bar chart.
    const [otu_ids,otu_labels,sample_values] = [
      resultFirst.otu_ids.slice(0, 10).map((i) => "OTU" + i.toString()).reverse(),
      resultFirst.otu_labels.slice(0, 10).reverse(),
      resultFirst.sample_values.slice(0, 10).reverse()];
    
    // Create the trace for the bar chart.
    let trace = {
      x: sample_values,
      y: otu_ids,
      hovertext: otu_labels,
      hoverinfo: "text",
      type: "bar",
      orientation: "h",
    };

    const barData = [trace];

    // Create the layout for the bar chart.
    const barLayout = {
      title: "Top 10 Bacteria Cultures",
      font: {
        family: "Arial",
      },
      plot_bgcolor: "#f9e6ff",
      paper_bgcolor: "#f2ccff",
      // yaxis: { categoryorder: "total ascending" },
    };
    // Use Plotly to plot the data with the layout.
    Plotly.react("bar", barData, barLayout, config);

    // Create a Bubble Chart
    // Create the trace for the bubble chart.
    trace = {
      x: resultFirst.otu_ids,
      y: resultFirst.sample_values,
      text: resultFirst.otu_labels,
      mode: "markers",
      marker: {
        color: resultFirst.sample_values,
        colorscale: "Portland",
        size: resultFirst.sample_values,
        sizeref: (2.0 * Math.max(...resultFirst.sample_values)) / 100 ** 2,
        sizemode: "area",
      },
    };

    const bubbleData = [trace];

    // Create the layout for the bubble chart.
    const bubbleLayout = {
      title: "Bacterial cultures per sample",
      xaxis: { title: "Otu Id" },
      hovermode: "x unified",
      font: {
        family: "Arial",
      },
      plot_bgcolor: "#f9e6ff",
      paper_bgcolor: "#f2ccff",
    };

    // Use Plotly to plot the data with the data and layout.
    Plotly.react("bubble", bubbleData, bubbleLayout, config);

    // Task 3:
    // Create a variable that filters the metadata array for the object with the desired sample number.
    const metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    resultArray = metadata.filter((sampleNum) => sampleNum.id == sample);

    // Create a variable that holds the first sample in the metadata array.
    result = resultArray[0];

    // Create a constant variable that holds the washing frequency.
    const washingFreq = parseFloat(result.wfreq);

    // Create the trace for the gauge chart.
    trace = {
      value: washingFreq,
      type: "indicator",
      mode: "gauge+number+delta",
      delta: {reference:10,increasing:{color:"purple"}},
      title: "Scrubs per Week<br>(Delta with respect to scale of 10)",
      gauge: {
        axis: { range: [null, 10], dtick: 1 },
        bar: { color: "black" },
        bgcolor: "rainbow",
        steps: [
          { range: [0, 2], color: "blue" },
          { range: [2, 4], color: "green" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "orange" },
          { range: [8, 10], color: "red" },
        ],
      },
    };

    const gaugeData = [trace];

    // Create the layout for the gauge chart.
    const gaugeLayout = {
      title: "Belly Button Washing Frequency",
      font: {
        family: "Arial",
      },
      plot_bgcolor: "#f9e6ff",
      paper_bgcolor: "#f2ccff",
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.react("gauge", gaugeData, gaugeLayout, config);
  });
}
