var csvFile = "../test.csv";
    var currentCountry = "Gambia";
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
      "yellow"
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

    var leftYAxis = d3.svg
      .axis()
      .scale(leftY)
      .orient("left");

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


    // Draw the bar diagram
    var drawBars = function(svg, data) {
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
        .attr("id", "yCountryName")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(currentCountry); // Country name

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
      d3.selectAll(".dataRect").attr("opacity", "0").attr("fill", "white");
      d3.select(this).attr("stroke", "orange").attr("fill", "none").attr("opacity", "1");
      // console.log("rectangle clicked", event);
      // d3.selectAll(".dataRect").attr("visible", false);
      // d3.select(rect).attr("visible", true);
      let countryName = d3.select(this).attr("country")
      let countryData = getDataByCountry(dataset, countryName)
      // update bars
      updateBars(countryData, countryName)

      console.log(d3.select(this).attr("country"));
    };

    var updateBars = function(countryData, countryName) {
      let svg = right_svg;

      // update yAxis name

      let yText = svg.selectAll("#yCountryName").text(countryName)
      console.log("yText", yText)
      // Update bars
      let olds = svg.selectAll("rect")
      .data(countryData)
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

    }

    var drawRects = function(svg, dataset) {
      let yAxisMargin = 40;
      let rectYMargin = 7;

      let squaresMargin = yAxisMargin + 5;
      let rectHeight = height / 10;
      let rectWidth = height + 18;
      let y = 7;
      for (let i in countries) {
        country = countries[i]
        console.log("rect Country", country)
        svg
          .append("rect")
          .attr("x", yAxisMargin + 7)
          .attr("y", y - 1 )
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
          
        y += rectHeight + rectYMargin;
      }

      // let rects = d3.selectAll(".dataRect").on("click", selectRectangle)
        // console.log(rects)

      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + yAxisMargin + ", 0)")
        .call(leftYAxis);

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + yAxisMargin + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");
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

    var drawSquares = function(svg, dataset) {
      // Draw the square grid that frames the data
      let x;
      let y = 8;
      let yAxisMargin = 40;
      let squareWidth = 28;
      let boxMargin = 9;
      let boxYMargin = 10;

      let countryIndexed = makeCountryIndexed(dataset);
      let country;
      for (let c in countries) {
        x = yAxisMargin + boxMargin;
        country = countries[c];
        for (let i = 0; i < 9; i++) {
          svg
            .append("rect")
            .attr("width", squareWidth)
            .attr("height", squareWidth)
            .attr("x", x)
            .attr("y", y)
            .attr("fill", "none")
            .attr("stroke", "black");
          // Update x pos
          x += squareWidth + boxMargin;
        }
        // Update y pos
        y += squareWidth + boxYMargin;
      }
    };

    // Draw data
    function drawDataInGrid(svg, dataset) {
      let countryIndexed = makeCountryIndexed(dataset);

      let yAxisMargin = 40;
      let xCenter;
      let yCenter = 22;
      let boxWidth = 28;
      let boxXMargin = 9;
      let boxYMargin = 10;
      let maxValue = YMAX; //getMaxYValue(dataset);
      let country;
      for (let i in countries) {
        country = countries[i];
        color = colors[i];
        xCenter = yAxisMargin + boxXMargin + boxWidth / 2;

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
            console.log(country, d);
            let pos = xCenter - (d / maxValue) * (boxWidth / 2);
            xCenter += boxWidth + boxXMargin;
            return pos;
          })
          .attr("y", d => yCenter - ((d / maxValue) * boxWidth) / 2)
          .attr("fill", color);

        // Update y pos for next row
        yCenter += boxWidth + boxYMargin;
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

    var getMaxYValue = function(data) {
      // Get max max Y value from data.
      // Basically, go through all the years and
      // store the largest value
      let maxVal = 0;
      let loopObj;
      for (let i in data) {
        loopObj = data[i];
        // console.log(loopObj);
        for (let y in years) {
          let year = years[y];
          if (loopObj[year] > maxVal) {
            maxVal = loopObj[year];
          }
        }
      }
      return maxVal;
    };

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
      leftY.domain(countries);

      dataset = data;
      let countryData = getDataByCountry(data, currentCountry);

      // Draw the bars
      drawBars(right_svg, countryData);

      // let reorderedData = makeCountryIndexed(data);

      drawSquares(left_svg, dataset);
      drawDataInGrid(left_svg, dataset);
      drawRects(left_svg, dataset);

      // Toggle loading screen
      document.querySelector(".loadingscreen").classList.add("invisible");
      document.querySelector(".container").classList.remove("invisible");
    });