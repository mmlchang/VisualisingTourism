/* ----------- Brief Description ---------- */
function togglePopup(){
  document.getElementById("popup-1").classList.toggle("active");
}

function init(){
  togglePopup();
  
  /* ----------- Navigation Bar ---------- */
  $('.open-overlay').click(function() {
    $('.open-overlay').css('pointer-events', 'none');
    var overlay_navigation = $('.overlay-navigation'),
      top_bar = $('.bar-top'),
      middle_bar = $('.bar-middle'),
      bottom_bar = $('.bar-bottom');

      overlay_navigation.toggleClass('overlay-active');
      if (overlay_navigation.hasClass('overlay-active')) {
        top_bar.removeClass('animate-out-top-bar').addClass('animate-top-bar');
        middle_bar.removeClass('animate-out-middle-bar').addClass('animate-middle-bar');
        bottom_bar.removeClass('animate-out-bottom-bar').addClass('animate-bottom-bar');
        overlay_navigation.removeClass('overlay-slide-up').addClass('overlay-slide-down')
        overlay_navigation.velocity('transition.slideLeftIn', {
          duration: 300,
          delay: 0,
          begin: function() {
            $('nav ul li').velocity('transition.perspectiveLeftIn', {
              stagger: 150,
              delay: 0,
              complete: function() {
                $('nav ul li a').velocity({
                  opacity: [1, 0],
                }, {
                  delay: 10,
                  duration: 140
                });
                $('.open-overlay').css('pointer-events', 'auto');
              }
            })
          }
        })

      } else {
        $('.open-overlay').css('pointer-events', 'none');
        top_bar.removeClass('animate-top-bar').addClass('animate-out-top-bar');
        middle_bar.removeClass('animate-middle-bar').addClass('animate-out-middle-bar');
        bottom_bar.removeClass('animate-bottom-bar').addClass('animate-out-bottom-bar');
        overlay_navigation.removeClass('overlay-slide-down').addClass('overlay-slide-up')
        $('nav ul li').velocity('transition.perspectiveRightOut', {
          stagger: 150,
          delay: 0,
          complete: function() {
            overlay_navigation.velocity('transition.fadeOut', {
              delay: 0,
              duration: 300,
              complete: function() {
                $('nav ul li a').velocity({
                  opacity: [0, 1],
                }, {
                  delay: 0,
                  duration: 50
                });
                $('.open-overlay').css('pointer-events', 'auto');
              }
            });
          }
        })
      }
  })

  // Get references to the year range input, the year heading, and the mode dropdown
  var yearRangeInput = document.querySelector('input[type="range"]');
  var yearTicks = document.getElementById('year_ticks');
  var yearHeading = document.getElementById('National_Park_title');
  var checkboxContainer = document.querySelector('.modes_check-container');

  // Initialize the selected mode to "Foreign" and "Domestic"
  var selectedMode = ['domestic', 'foreign'];

  // Define a color scale based on data range
  // Green
  // Colour sourced from https://colorbrewer2.org/#type=sequential&scheme=Greens&n=5
  var colorScale = d3.scaleThreshold()
                      .domain([0, 10000, 20000, 30000, 40000])
                      .range(["#d3f7c7", "#bae4b3", "#74c476", "#31a354", "#006d2c"]);
  
  // Blue
  // Colour sourced from https://colorbrewer2.org/#type=sequential&scheme=Blues&n=5
  var colorScale2 = d3.scaleThreshold()
                      .domain([0, 10000, 20000, 30000, 40000])
                      .range(["#c6e6f9", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);


  // Add an event listener to the year range input
  yearRangeInput.addEventListener('input', function () {
    svg.selectAll(".data_circle").remove();
    svg.selectAll(".data_triangle").remove();
    svg.selectAll(".data_image").remove();
    
    var selectedValue = yearRangeInput.value;
    var selectedYearLabel = yearTicks.querySelector('option[value="' + selectedValue + '"]').label;
    
    // Update selectedMode based on the current state of checkboxes
    var selectedModes = getSelectedModes();
    selectedMode = selectedModes.length === 0 ? 'allmodes' : selectedModes.join('_');

    updateTitle(selectedYearLabel, selectedModes);
    updateData(selectedYearLabel, selectedModes);
  });

  // Legend data
  var keys = ["1 - 10000", "10001 - 20000", "20001 - 30000", "30001 - 40000", "Above 40000"];

  // Create an SVG element for the legend (Foreign)
  var legendSvg = d3.select('#national_park_legend')
                    .append('svg')
                    .attr('width', 20)
                    .attr('height', 140)
                    .attr('class', 'legend-container'); // Add a class to the legend container

  // Create a legend group for each key-color pair
  var legend = legendSvg.selectAll('.legend')
                        .data(keys)
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function(d, i) {
                          return 'translate(0,' + (i * 30) + ')';
                        });

  // Create colored rectangles for the legend
  legend.append('rect')
        .attr('width', 20) // Adjust the width of the colored rectangles
        .attr('height', 20) // Adjust the height of the colored rectangles
        .attr('x', 0) 
        .style('fill', function(d, i) {
           return colorScale.range()[i]; // Use the color scale based on domain values
        });

  // Create an SVG element for the legend (Domestic)
  var legendSvg2 = d3.select('#national_park_legend')
                    .append('svg')
                    .attr('width', 130)
                    .attr('height', 140)
                    .attr('class', 'legend-container2'); // Add a class to the legend container

  // Create a legend group for each key-color pair
  var legend2 = legendSvg2.selectAll('.legend2')
                        .data(keys)
                        .enter()
                        .append('g')
                        .attr('class', 'legend2')
                        .attr('transform', function(d, i) {
                          return 'translate(0,' + (i * 30) + ')';
                        });

  // Create colored rectangles for the legend
  legend2.append('rect')
        .attr('width', 20) 
        .attr('height', 20) 
        .style('fill', function(d, i) {
          return colorScale2.range()[i]; // Use the color scale based on domain values
        });

  // Add text labels to the legend (Foreign)
  var key = legend.append('text')
                  .attr('x', 30) 
                  .attr('y', 11)
                  .attr('class', 'key') // Add this class
                  .attr('dy', '0.35em')
                  .text(function(d) {
                      return d;
                  })
                  .style('fill', "black");

  // Add text labels to the legend (Domestic)
  var key2 = legend2.append('text')
                    .attr('x', 30) 
                    .attr('y', 11) 
                    .attr('class', 'key2')
                    .attr('dy', '0.35em')
                    .text(function(d) {
                        return d;
                    })
                    .style('fill', "black");

  // Update legend based on selected modes
  function updateLegend(selectedModes) {
    // Hide all legend elements and keys
    legend.style('display', 'none');
    key.style('display', 'none');
    legendSvg.attr('width', 20);
    legend2.style('display', 'none');
    key2.style('display', 'none');
    legendSvg2.attr('width', 20);

    // Show/hide legend elements and keys based on selected modes
    if (selectedModes.length === 2) {
      legend.style('display', 'block');
      key.style('display', 'none');
      legend2.style('display', 'block');
      key2.style('display', 'block');
      legendSvg.attr('width', 20);
      legendSvg2.attr('width', 130);
      legendSvg.style('padding-left', "0px");
      legendSvg2.style('margin-left', "0px");
      
    } else if (selectedModes.includes('domestic')) {
      legend2.style('display', 'block');
      key2.style('display', 'block');
      legendSvg2.attr('width', 130);
      legendSvg2.style('margin-left', "-10px");
      // Add this line to hide the foreign legend and adjust the width of the domestic legend container
      legend.style('display', 'none');
      key.style('display', 'none');
      legendSvg.attr('width', 0);

    } else if (selectedModes.includes('foreign')) {
      legend.style('display', 'block');
      legendSvg.style('padding-left', "5px");
      key.style('display', 'block')
          .attr('x', 30) // Adjust the x position to add more spacing
          .attr('y', 11);
      legendSvg.attr('width', 130);
      legendSvg2.attr('width', 0);
      legend2.style('display', 'none');
    }
  }

  // Add an event listener to the checkbox container
  checkboxContainer.addEventListener('change', function (event) {
    var clickedCheckbox = event.target;
    var selectedModes = getSelectedModes(); // Get the currently selected modes

    if (selectedModes.length === 0) {
        // Prevent deselection if no checkbox is selected
        event.preventDefault();
        clickedCheckbox.checked = true;
    } else {
      svg.selectAll(".data_circle").remove();
      svg.selectAll(".data_triangle").remove();
      svg.selectAll(".data_image").remove();
      selectedMode = selectedModes.join('_'); // Combine modes into a single string
      var selectedValue = yearRangeInput.value;
      var selectedYearLabel = yearTicks.querySelector('option[value="' + selectedValue + '"]').label;
      updateTitle(selectedYearLabel, selectedModes);
      updateData(selectedYearLabel, selectedModes);

      // Update the legend based on selected modes
    updateLegend(selectedModes);
    }
  });

  // Initial update of legend based on selected modes
updateLegend(selectedMode);

  // Function to get an array of selected modes
  function getSelectedModes() {
      var checkboxes = document.querySelectorAll('.modes_check-container input[type="checkbox"]');
      var selectedModes = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.getAttribute('data-value'));

      return selectedModes;
  }

  // Function to update the title with the selected year and mode
  function updateTitle(yearLabel, modes) {
      if (modes.length === 0) {
          yearHeading.textContent = "No Mode Selected for " + yearLabel;
      } else if (modes.length === 2) {
          yearHeading.textContent = "Domestic & Foreign Visitor Arrivals to National Park " + yearLabel;
      } else if (modes.includes('domestic')) {
          yearHeading.textContent = "Domestic Visitor Arrivals to National Park " + yearLabel;
      } else if (modes.includes('foreign')) {
          yearHeading.textContent = "Foreign Visitor Arrivals to National Park " + yearLabel;
      }
  }

  var nationalparkData;

  function getSelectedNationalPark(nationalparklocation) {
      var selectedData = nationalparkData.find(function (d) {
        return d.longitude + "," + d.latitude === nationalparklocation;
      });
      return selectedData ? selectedData.nationalpark : null;
    }

  function updateData(yearLabel, selectedMode) {
      d3.csv("data/National_Park/national_park_longlat.csv").then(function (longlatdata) {
          d3.csv("data/National_Park/foreign_visitor_arrivals_to_national_parks.csv").then(function (foreigndata) {
              d3.csv("data/National_Park/domestic_vistor_arrivals_to_national_parks.csv").then(function (domesticdata) {
                  
                  nationalparkData = longlatdata;
                  var getForeignData = foreigndata;
                  var getDomesticData = domesticdata;

                  // Filter the data for the user-selected year
                  var getselectedyear = 'year_' + yearLabel;

                  // Initialize variables for foreign and domestic total
                  var foreignTotal = 0;
                  var domesticTotal = 0;

                  // Calculate the total for foreign mode
                  if (selectedMode.includes('foreign')) {
                    var foreignTotalData = getForeignData.find(function (fd) {
                      return fd.nationalpark === "TOTAL";
                    });

                    if (foreignTotalData) {
                      foreignTotal = +foreignTotalData[getselectedyear];
                    }
                  }

                  // Calculate the total for domestic mode
                  if (selectedMode.includes('domestic')) {
                    var domesticTotalData = getDomesticData.find(function (dd) {
                      return dd.nationalpark === "TOTAL";
                    });

                    if (domesticTotalData) {
                      domesticTotal = +domesticTotalData[getselectedyear];
                    }
                  }

                  // Calculate the grand total for both modes
                  var grandTotal = foreignTotal + domesticTotal;
                  var formattedGrandTotal = grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  // Update the content of the <h1> element with the grand total value
                  var grandTotalElement = document.querySelector('.grand_total_arrivals_value');
                  grandTotalElement.textContent = formattedGrandTotal;

                  // Update the label based on the selected mode
                  var grandTotalLabel = document.getElementById('grandTotalLabel');
                  if (selectedMode.length === 2) {
                    grandTotalLabel.textContent = "Grand Total (Domestic + Foreign)";
                  } else if (selectedMode.includes('domestic')) {
                    grandTotalLabel.textContent = "Grand Total (Domestic)";
                  } else if (selectedMode.includes('foreign')) {
                    grandTotalLabel.textContent = "Grand Total (Foreign)";
                  }

                  
                  // Remove existing pie chart before updating
                  svg.selectAll(".pie-chart").remove();

                  var pie = d3.pie()
                              .value(1) // Each slice has equal value
                              .sort(null);

                  var arc = d3.arc()
                              .innerRadius(0)
                              .outerRadius(8);
                              

                  svg.selectAll("g.pie-chart")
                      .data(longlatdata)
                      .enter()
                      .append("g")
                      .attr("class", "pie-chart")
                      .attr("transform", function (d) {
                        var [x, y] = projection([+d.longitude, +d.latitude]);
                        // Apply the zoom transformation to the existing pie chart's position
                        return `translate(${currentZoomTransform.apply([x, y])}) scale(${currentZoomTransform.k})`;
                      })
                      .selectAll(".arc")
                      .data(function (d) {
                          var getlocation = d.longitude + "," + d.latitude;
                          var selectedNationalPark = getSelectedNationalPark(getlocation);
                          var dataValueForeign = null;
                          var dataValueDomestic = null;
                  
                          if (selectedNationalPark) {
                              var dataforForeign = getForeignData.find(function (fd) {
                                  return fd.nationalpark === selectedNationalPark && fd[getselectedyear] !== "Under renovation";
                              });
                  
                              var dataforDomestic = getDomesticData.find(function (dd) {
                                  return dd.nationalpark === selectedNationalPark && dd[getselectedyear] !== "Under renovation";
                              });
                  
                              if (dataforForeign) {
                                  dataValueForeign = dataforForeign[getselectedyear];
                              }
                  
                              if (dataforDomestic) {
                                  dataValueDomestic = dataforDomestic[getselectedyear];
                              }
                          }
                          
                          if(selectedMode.length == 2){
                            // Combine foreign and domestic data for the pie chart
                            var combinedData = [
                              { category: "foreign", value: dataValueForeign, location: getlocation, longitude: d.longitude, latitude: d.latitude, image: d.image, link: d.link},
                              { category: "domestic", value: dataValueDomestic, location: getlocation, longitude: d.longitude, latitude: d.latitude, image: d.image, link: d.link}
                            ];
                    
                            // Filter out data with null values
                            combinedData = combinedData.filter(function (d) {
                              return d.value !== null && d.value !== undefined;
                            });
                    
                            return pie(combinedData);
                          }else if (selectedMode.includes('domestic')){
                            var combinedData = [
                              { category: "domestic", value: dataValueDomestic, location: getlocation, longitude: d.longitude, latitude: d.latitude, image: d.image, link: d.link}
                            ];

                            combinedData = combinedData.filter(function (d) {
                              return d.value !== null && d.value !== undefined;
                            });
                    
                            return pie(combinedData);
                          }else if(selectedMode.includes('foreign')){
                            var combinedData = [
                              { category: "foreign", value: dataValueForeign, location: getlocation, longitude: d.longitude, latitude: d.latitude, image: d.image, link: d.link}
                            ];

                            combinedData = combinedData.filter(function (d) {
                              return d.value !== null && d.value !== undefined;
                            });
                    
                            return pie(combinedData);
                          }
                          
                      })
                      .enter()
                      .append("g")
                      .attr("class", "arc")
                      .append("path")
                      .attr("d", arc)
                      .attr("fill", function (d) {
                        if(d.data.value !== "-"  && d.data.value !== "Under renovation"){
                          return d.data.category === "foreign" ? colorScale(d.data.value) : colorScale2(d.data.value);
                        }else{
                          return "#BEBEBE";
                        }
                          
                      })
                      .attr("data-location", function (d) {
                          return d.data.location;  // Update this line
                      })
                      .on("mouseover", function (event, d) {
                          var getlocation = d.data.location;
                          var selectedNationalPark = getSelectedNationalPark(getlocation);

                          // Ensure that the tooltip is selected correctly
                          var gettooltip = d3.select("#nationalparktooltip");
                          var dataValue = null;
                          var dataValueDomestic = null;

                          if (selectedNationalPark) {
                              var dataforForeign = getForeignData.find(function (fd) {
                                  return fd.nationalpark === selectedNationalPark && fd[getselectedyear] !== "Under renovation";
                              });

                              var dataforDomestic = getDomesticData.find(function (dd) {
                                  return dd.nationalpark === selectedNationalPark && dd[getselectedyear] !== "Under renovation";
                              });

                              if(selectedMode.length == 2){
                                if (dataforForeign && dataforDomestic) {
                                  dataValue = dataforForeign[getselectedyear];
                                  dataValueDomestic = dataforDomestic[getselectedyear];
                              
                                  var formattedDataValue = dataValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                  var formattedDataValueDomestic = dataValueDomestic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                              
                                  // Parse data values as integers for arithmetic addition
                                  var intValue = parseInt(dataValue, 10);
                                  var intValueDomestic = parseInt(dataValueDomestic, 10);
                              
                                  var totalVisitors;
                              
                                  if (isNaN(intValue) && isNaN(intValueDomestic)) {
                                      totalVisitors = "-";
                                  } else if (isNaN(intValue)) {
                                      totalVisitors = intValueDomestic;
                                  } else if (isNaN(intValueDomestic)) {
                                      totalVisitors = intValue;
                                  } else {
                                      totalVisitors = intValue + intValueDomestic;
                                  }
                              
                                  var formattedTotalVisitors = totalVisitors === "-" ? "-" : totalVisitors.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                              
                                  gettooltip.html(
                                      "<b>" + selectedNationalPark + "</b><br>Number of Foreign Visitor: " + formattedDataValue +
                                      "<br>Number of Domestic Visitor: " + formattedDataValueDomestic +
                                      "<br>Total Visitors: " + formattedTotalVisitors
                                  );
                              
                                  gettooltip.style("display", "block");
                              }                                                                                  
                              }else if (selectedMode.includes('domestic')){
                                if (dataforDomestic) {
                                  dataValueDomestic = dataforDomestic[getselectedyear];

                                  // Update this line to append the tooltip content
                                  var formattedDataValueDomestic = dataValueDomestic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                  gettooltip.html("<b>" + selectedNationalPark + "</b><br>Number of Domestic Visitor: " + formattedDataValueDomestic);
                                  gettooltip.style("display", "block");;
                                }
                              }else if(selectedMode.includes('foreign')){
                                if (dataforForeign) {
                                  dataValue = dataforForeign[getselectedyear];
                                  
                                  var formattedDataValue = dataValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                  gettooltip.html("<b>" + selectedNationalPark + "</b><br>Number of Foreign Visitor: " + formattedDataValue);
                                  gettooltip.style("display", "block");
                                }
                              }
                          }
                      })
                      .on("mouseout", function () {
                          // Ensure that the tooltip is selected correctly
                          var gettooltip = d3.select("#nationalparktooltip");

                          // Remove the tooltip text associated with this pie chart
                          gettooltip.style("display", "none");
                          d3.select(this).selectAll("path").attr("fill", function (d) {
                              return d.data.category === "foreign" ? colorScale(d.data.value) : colorScale2(d.data.value);
                          }); // Update this line
                      })
                      .on("click", function (event, d) {
                        var getlocation = d.data.location;
                    
                        // Transform the coordinates based on the current zoom transformation
                        var transformedCoords = currentZoomTransform.apply(projection([+d.data.longitude, +d.data.latitude]));
                    
                        // Check if a circle with the class "data_circle" and data-location attribute already exists for the clicked data point
                        var existingCircle = svg.select(".data_circle[data-location='" + getlocation + "']");
                    
                        // If the circle exists, remove it (hide)
                        if (!existingCircle.empty()) {
                            existingCircle.remove();
                    
                            // Remove the triangle if it exists
                            var existingTriangle = svg.select(".data_triangle[data-location='" + getlocation + "']");
                            existingTriangle.remove();
                    
                            // Remove the rectangle and image if they exist
                            var existingRect = svg.select(".data_rect[data-location='" + getlocation + "']");
                            existingRect.remove();
                            var existingImage = svg.select(".data_image[data-location='" + getlocation + "']");
                            existingImage.remove();
                        } else {
                            // Draw a circle above the data point with modified position
                            var circle = svg.append("circle")
                                .attr("class", "data_circle")
                                .attr("data-location", getlocation) 
                                .attr("cx", transformedCoords[0]) 
                                .attr("cy", transformedCoords[1] - 80) 
                                .attr("r", 35)
                                .attr("fill", "black");
                    
                            // Draw a triangle above the circle (upside down) with modified position
                            var triangle = svg.append("path")
                                .attr("class", "data_triangle")
                                .attr("data-location", getlocation) 
                                .attr("d", function () {
                                    var x = transformedCoords[0]; 
                                    var y = transformedCoords[1] - 35;
                                    var size = 34;
                    
                                    return "M" + x + " " + (y + size) +
                                        " L" + (x - size) + " " + (y - size) +
                                        " L" + (x + size) + " " + (y - size) +
                                        " Z";
                                })
                                .attr("fill", "black");
                    
                            // Add an image inside the circle with modified position
                            var image = svg.append("image")
                                .attr("class", "data_image")
                                .attr("data-location", getlocation) 
                                .attr("xlink:href", d.data.image) 
                                .attr("x", transformedCoords[0] - 28) 
                                .attr("y", transformedCoords[1] - 108) 
                                .attr("width", 56)
                                .attr("height", 56)
                                .attr("cursor", "pointer")
                                .on("click", function () {
                                    window.open(d.data.link, "_blank"); // Open the link in a new tab
                                });
                        }
                    });
              });
          });
      });
  }
  
  // Initial title update
  updateTitle("2018", selectedMode);
  
  var w = 1100;
  var h = 635;

  // Set up the paths
  var projection = d3.geoEquirectangular()                
                      .center([113, 3.5])                   
                      .translate([w / 2, h / 2])          // need to use (.centre(), .translate() and .scale()) to transform the view
                      .scale(6300);   

  var path = d3.geoPath()
                .projection(projection);

  var svg = d3.select("#national_park_graph") 
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("fill", "grey");

  var zoom = d3.zoom()
                .extent([[0, 0], [w, h]])
                .scaleExtent([1, 2])
                .translateExtent([[0, 0], [w, h]])
                .on("zoom", zoomed);
            
// Store the zoom transformation in a variable
let currentZoomTransform = d3.zoomIdentity;

// Function to handle zoom
function zoomed(event) {
  currentZoomTransform = event.transform;

  svg.selectAll('.sarawak-map')
    .attr('transform', currentZoomTransform);

  // Update the position of pie chart elements with the current zoom transformation
  svg.selectAll("g.pie-chart")
    .attr("transform", function (d) {
      var [x, y] = projection([+d.longitude, +d.latitude]);
      // Apply the zoom transformation to the pie chart's position
      return `translate(${currentZoomTransform.apply([x, y])}) scale(${currentZoomTransform.k})`;
    });

    svg.selectAll('.data_circle, .data_triangle, .data_image')
    .attr("transform", function () {
        // Get the DOM element
        var element = d3.select(this);

        // Extract the data attributes from the DOM element
        var longitude = +element.attr("data-longitude");
        var latitude = +element.attr("data-latitude");

        // Check if the data attributes are available
        if (!isNaN(longitude) && !isNaN(latitude)) {
            // Apply the zoom transformation to the data elements' position
            var [x, y] = projection([longitude, latitude]);
            return `translate(${currentZoomTransform.apply([x, y])}) scale(${currentZoomTransform.k})`;
        } else {
            // Handle the case when data attributes are missing or not valid
            return ""; // or any other appropriate default transformation
        }
    });
}

  svg.call(zoom);

  // Disable zooming on double click
  svg.on("dblclick.zoom", null);

  d3.json("data/Sarawak_Map.json").then(function(json) {
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("class", "sarawak-map")
      .attr("d", path);

      // Initial data update
      updateData("2018", selectedMode);
  })
}

window.onload = init;