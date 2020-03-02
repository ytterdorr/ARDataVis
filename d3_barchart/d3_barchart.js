var csvFile = "../test_LE.csv";
var currentCountry = "Australia";
var YMAX = 100;
let dataset;
let years;
let countries;

var colors = [
  "orange",
  "steelblue",
  "pink",
  "gray",
  "purple",
  "silver",
  "gold",
  "blue",
  "yellow",
  "green"
];

// To check if dataset is set;
let dataLoaded = false;
let countryData;

var margin = { top: 20, right: 20, bottom: 70, left: 40 },
  width = 400 - margin.left - margin.right,
  leftWidth = width + 100;
height = 400 - margin.top - margin.bottom;

var x = d3.scale
  .ordinal()
  // .domain(years), is set once data is loaded
  .rangeRoundBands([0, width], 0.05);

var y = d3.scale
  .linear()
  .domain([0, YMAX])
  .range([height, 0]);

var leftY = d3.scale
  .ordinal()
  // .domain(countries), is set once data is loaded
  .rangeRoundBands([0, height], 0.05);

var leftX = d3.scale
  .ordinal()
  // .domain(years), is set once data is loaded
  .rangeRoundBands([0, width], 0.05);

var leftYAxis = d3.svg
  .axis()
  .scale(leftY)
  .orient("left");

var leftXAxis = d3.svg
  .axis()
  .scale(leftX)
  .orient("bottom");

var xAxis = d3.svg
  .axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg
  .axis()
  .scale(y)
  .orient("left")
  .ticks(10);

var right_svg = d3
  .select(".rightside")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var left_svg = d3
  .select(".leftside")
  .append("svg")
  .attr("width", leftWidth + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("style", "background-color: white;")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var drawRightAxes = function() {
  let svg = right_svg;
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("id", "yName")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(currentCountry); // Country name
};

function drawLeftAxes() {
  let svg = left_svg;
  let yAxisMargin = 40;
  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + yAxisMargin + ", 0)")
    .call(leftYAxis);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + yAxisMargin + "," + height + ")")
    .call(leftXAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");
}

function drawSupportLines() {
  console.log(yAxis);
  right_svg
    .selectAll(".y.axis")
    .selectAll(".tick line")
    .call(yAxis)
    .attr("x1", -6)
    .attr("x2", width)
    .attr("stroke", "gray")
    .attr("opacity", "0.7");
}

// Draw the bar diagram
var drawBars = function(svg, data) {
  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) {
      return x(d.year);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    });
};

var selectRectangle = function() {
  d3.selectAll(".dataRect")
    .attr("opacity", "0")
    .attr("fill", "white");
  d3.select(this)
    .attr("stroke", "orange")
    .attr("fill", "none")
    .attr("opacity", "1");
  // console.log("rectangle clicked", event);
  // d3.selectAll(".dataRect").attr("visible", false);
  // d3.select(rect).attr("visible", true);
  let countryName = d3.select(this).attr("country");
  let countryData = getDataByCountry(dataset, countryName);
  // update bars
  drawCountryBars(countryData, countryName);

  console.log(d3.select(this).attr("country"));
};

var selectYear = function() {
  console.log("You clicked a year!");
  console.log(this.getAttribute("year"));
  let year = this.getAttribute("year");

  // hide rectangles
  left_svg
    .selectAll(".dataRect")
    .attr("fill", "white")
    .attr("opacity", "0");

  d3.select(this)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", "3")
    .attr("opacity", "0.8");
  showYearData(year);
};

var drawCountryBars = function(countryData, countryName) {
  // This is just a copy of the updateBars function.
  // Since I also want to be able to do this by years.
  let svg = right_svg;

  // Delete everything and draw axes.
  right_svg.selectAll("g").remove();
  x.domain(years);
  drawRightAxes();
  drawSupportLines();

  // update yAxis name
  let yText = svg.selectAll("#yName").text(countryName);
  // console.log("yText", yText);

  // Delete remaining rectangles?
  svg.selectAll("rect").remove();

  // Draw new bars
  let news = svg
    .selectAll("bar")
    .data(countryData)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return x(d.year);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .attr("fill", "steelblue");
  // console.log("news:", news);
};

function showYearData(year) {
  /* This function should change the right side
   * diagram to show all countries from a certain year
   * instead of all years for a certain country.
   */

  // Delete everything and draw axes.
  right_svg.selectAll("g").remove();
  x.domain(countries);
  drawRightAxes();
  drawSupportLines();

  // update Y axis name
  right_svg.select("#yName").text(year);

  // Delete remaining rectangles?
  right_svg.selectAll("rect").remove();

  // Get year data.
  let yearData = [];
  let colorIndex = 0;
  for (d of dataset) {
    let obj = {};
    obj.country = d.country;
    obj.value = d[year];
    obj.color = colors[colorIndex];
    // console.log(obj);
    yearData.push(obj);
    colorIndex++;
  }

  let news = right_svg
    .selectAll("bar")
    .data(yearData)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      // console.log("x(d.country):", x(d.country));
      return x(d.country);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .attr("fill", function(d) {
      // console.log(d.color);
      return d.color;
    });
}

// var updateBars = function(countryData, countryName) {
//   let svg = right_svg;

//   // update yAxis name
//   let yText = svg.selectAll("#yName").text(countryName);

//   // Update bars
//   let olds = svg
//     .selectAll("rect")
//     .data(countryData)
//     .attr("x", function(d) {
//       return x(d.year);
//     })
//     .attr("width", x.rangeBand())
//     .attr("y", function(d) {
//       return y(d.value);
//     })
//     .attr("height", function(d) {
//       return height - y(d.value);
//     });
// };

var drawRects = function(svg, dataset) {
  let yAxisMargin = 40;
  let rectYMargin = 7;

  let squaresMargin = yAxisMargin + 5;
  let rectHeight = leftY.rangeBand();
  let rectWidth = height + 18;
  let y = 7;

  for (let i in countries) {
    country = countries[i];
    // console.log("rect Country", country);

    // horizontal selection rects.
    svg
      .append("rect")
      .attr("x", yAxisMargin + rectYMargin)
      .attr("y", y - 1)
      .attr("width", rectWidth)
      .attr("height", rectHeight + 2)
      .attr("fill", "white")
      .attr("opacity", "0")
      .attr("stroke", "red")
      .attr("stroke-width", "3")
      .attr("class", "dataRect")
      // .attr("onclick", "selectRectangle")
      .attr("country", country)
      .on("click", selectRectangle)
      .attr("visible", "false");

    // Country name clickable rects
    svg
      .append("rect")
      .attr("x", -yAxisMargin)
      .attr("y", y - 1)
      .attr("width", 2 * yAxisMargin)
      .attr("height", rectHeight)
      .attr("fill", "white")
      .attr("opacity", "0")
      .attr("stroke", "red")
      .attr("stroke-width", "3")
      .attr("class", "dataRect")
      // .attr("onclick", "selectRectangle")
      .attr("country", country)
      .on("click", selectRectangle)
      .attr("visible", "false");

    y += rectHeight + 1;
  }

  // Year clickable rects
  let xPos = yAxisMargin + rectYMargin;
  let xMargin = 5;
  let xWidth = leftX.rangeBand() - xMargin;
  for (let year of years) {
    svg
      .append("rect")
      .attr("x", xPos)
      .attr("y", height)
      .attr("width", xWidth)
      .attr("height", yAxisMargin)
      .attr("fill", "white")
      .attr("opacity", "0")
      .attr("stroke", "red")
      .attr("stroke-width", "3")
      .attr("class", "dataRect")
      // .attr("onclick", "selectRectangle")
      .attr("year", year)
      .on("click", selectYear)
      .attr("visible", "false");
    xPos += leftX.rangeBand() + 2;
  }
};

// Transfrom the dataset to a dictionary
// {country: [data]}
function makeCountryIndexed(dataset) {
  let byCountry = {};
  let row;
  let yearData;
  for (let i in dataset) {
    yearData = [];
    row = dataset[i];
    for (let j in years) {
      yearData.push(row[years[i]]);
    }
    byCountry[row.country] = yearData;
  }
  return byCountry;
}

// Draw data
function drawDataInGrid(svg, dataset) {
  let countryIndexed = makeCountryIndexed(dataset);

  let yAxisMargin = 40;
  let xCenter;
  let yCenter = 22;
  let boxXMargin = 9;
  let boxWidth = leftX.rangeBand() - boxXMargin + 2;
  let boxYMargin = 6;
  let maxValue = YMAX; //getMaxYValue(dataset);
  let country;
  for (let i in countries) {
    country = countries[i];
    color = colors[i];
    xCenter = yAxisMargin + boxXMargin + boxWidth / 2;

    // Draw background grid
    svg
      .selectAll(country + "Data")
      .data(countryIndexed[country])
      .enter()
      .append("rect")
      .attr("width", function(d) {
        return boxWidth;
      })
      .attr("height", d => boxWidth)
      .attr("x", function(d) {
        let pos = xCenter - boxWidth / 2;
        xCenter += boxWidth + boxXMargin;
        return pos;
      })
      .attr("y", d => yCenter - boxWidth / 2)
      .attr("fill", "none")
      .attr("stroke", "black");

    // Reset center
    xCenter = yAxisMargin + boxXMargin + boxWidth / 2;

    // Draw data squares
    svg
      .selectAll(country + "Data")
      .data(countryIndexed[country])
      .enter()
      .append("rect")
      .attr("width", function(d) {
        return (d / maxValue) * boxWidth;
      })
      .attr("height", d => (d / maxValue) * boxWidth)
      .attr("x", function(d) {
        // console.log(country, d);
        let pos = xCenter - (d / maxValue) * (boxWidth / 2);
        xCenter += boxWidth + boxXMargin;
        return pos;
      })
      .attr("y", d => yCenter - ((d / maxValue) * boxWidth) / 2)
      .attr("fill", color);

    // Update y pos for next row
    yCenter += leftY.rangeBand() + 1;
  }
}

var getDataByCountry = function(data, country) {
  let countryData;
  // Find the right country data
  countryData = data.filter(d => d.country == country)[0];
  // Format object for easier d3 handling
  let formattedData = years.map(y => {
    return { year: y, value: countryData[y] };
  });
  return formattedData;
};

// var getMaxYValue = function(data) {
//   // Get max max Y value from data.
//   // Basically, go through all the years and
//   // store the largest value
//   let maxVal = 0;
//   let loopObj;
//   for (let i in data) {
//     loopObj = data[i];
//     for (let y in years) {
//       let year = years[y];
//       if (loopObj[year] > maxVal) {
//         maxVal = loopObj[year];
//       }
//     }
//   }
//   return maxVal;
// };

function extractYears(data) {
  // Get a year list from the dataset
  let first = data[0];
  let keys = Object.keys(first);
  let years = keys.filter(d => d != "country");
  years.sort();
  return years;
}

function extractCountries(data) {
  // Get all the countries from the csv data.
  // Input is d3.read_csv of the data.
  let row;
  let countryList = [];
  for (let el in data) {
    row = data[el];
    countryList.push(row.country);
  }
  countryList.sort();
  return countryList;
}

// This is practically the main function.
// Reads the csv and calls all the creator functions.
d3.csv(csvFile, function(error, data) {
  // Create axis domain lists
  countries = extractCountries(data);
  years = extractYears(data);

  // set axis domains
  x.domain(years);
  leftX.domain(years);
  leftY.domain(countries);

  dataset = data;
  let countryData = getDataByCountry(data, currentCountry);

  // Draw the bars
  drawRightAxes();
  drawSupportLines();
  drawBars(right_svg, countryData);

  // let reorderedData = makeCountryIndexed(data);
  drawLeftAxes();
  drawDataInGrid(left_svg, dataset);
  drawRects(left_svg, dataset);

  // Toggle loading screen
  document.querySelector(".loadingscreen").classList.add("invisible");
  document.querySelector(".container").classList.remove("invisible");
});
