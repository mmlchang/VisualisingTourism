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

  /* ----------- Year Range Bar ---------- */
  var selectedValue;
  var selectedYearDataCSV;
  var sarawakData;                                       // To store data from Sarawak_Visitor_Arrivals_2018.csv
  var countriesData;                                     // To store data from countries_longlat.csv
  var currentClickedCircle = null;
  var currentClickedPath = null;
  var gTotal;
  var selectedData;
  var infoBox;
  var pathLocation;
  var citizenship;
  var citizenshipLocation;

  // Function to get the citizenship name for a given location
  function getSelectedCitizenship(location) {
    selectedData = countriesData.find(function (d) {
      return d.longitude + "," + d.latitude === location;
    });

    return selectedData ? selectedData.Citizenship : null;
  }

  // Function to get the G. Total for a given citizenship name
  function getGTotalForCitizenship(citizenship) {
    selectedData = sarawakData.find(function (d) {
      return d.Citizenship === citizenship;
    });

    return selectedData ? selectedData["G. Total"] : null;
  }

  // Function to display the information in a box (you can implement your own way of displaying)
  function displayInfoInBox(citizenship, gTotal, event) {
    // Create or select an HTML element to display the info
    infoBox = document.getElementById("info-box");

    // Calculate the position based on the click event
    var x = event.clientX; // X-coordinate of the click
    var y = event.clientY; // Y-coordinate of the click

    // Format gTotal with commas
    var formattedTotal = gTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update the content of the info box
    infoBox.innerHTML = "<b>" + citizenship + "</b><br>Number of Visitors: " + formattedTotal;
    
    // Set the position of the info-box
    infoBox.style.top = (y + 10) + "px"; 
    infoBox.style.left = (x + 10) + "px"; 

    // Make the info box visible
    infoBox.style.display = "block";
  }

  function hideInfoBox() {
    infoBox = document.getElementById("info-box");
    infoBox.style.display = "none";
  }

  // Add a function to reset the selection
  function resetSelection() {
    if (currentClickedCircle && currentClickedPath) {
      // Restore the previous circle's color
      currentClickedCircle.attr("fill", function (d) {
        if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
          return "#2565ae"; 
        } else {
          return "#54350d";
        }
      });

      // Restore the previous path's color with a transition
      gTotal = getGTotalForCitizenship(getSelectedCitizenship(pathLocation));
      
      var pathColor;
      if (gTotal <= 5000) {
        pathColor = "#14b04a";
      } else if (gTotal <= 100000) {
        pathColor = "#dccb75";
      } else {
        pathColor = "red";
      }

      currentClickedPath.attr("stroke", pathColor);

      // Hide the info box
      hideInfoBox();

      currentClickedCircle = null;
      currentClickedPath = null;
    }
  }
  
  // Get references to the year range input and the year heading
  var yearRangeInput = document.querySelector('input[type="range"]');
  var yearTicks = document.getElementById('year_ticks');
  var yearHeading = document.getElementById('Sarawak_visitor_title');

  // Set the initial value of the year range input to match the label "2018"
  yearRangeInput.value = "0";
  selectedValue = yearRangeInput.value;
  selectedYearDataCSV = yearTicks.querySelector('option[value="' + selectedValue + '"]').getAttribute('data-csv');

  resetSelection();
  
  // Add an event listener to the year range input
  yearRangeInput.addEventListener('input', function () {
    selectedValue = yearRangeInput.value;
    // Reset the selection when sliding the year
    svg.selectAll(".country-node")
            .attr("fill", function (d) {
              if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
                return "#2565ae";
              } else {
                return "#54350d";
              }
            });
    
    hideInfoBox();
    
    // Trigger the "Go" button click event after resetting the dropdowns
    document.getElementById("goButton").click();

    // Get the selected year label from the datalist based on the value of the range input
    selectedValue = yearRangeInput.value;
    var selectedYearLabel = yearTicks.querySelector('option[value="' + selectedValue + '"]').label;
    selectedYearDataCSV = yearTicks.querySelector('option[value="' + selectedValue + '"]').getAttribute('data-csv');

    // Update the year heading with the selected year label
    yearHeading.textContent = "Sarawak Visitor Arrivals " + selectedYearLabel;

    // Load data from the selected CSV file
    d3.csv("data/Sarawak_Visitor_Arrivals/" + selectedYearDataCSV).then(function (data) {
      sarawakData = data;

      svg.selectAll(".path-with-location")
          .attr("stroke", function () {
            pathLocation = d3.select(this).attr("data-location");
            citizenship = getSelectedCitizenship(pathLocation);
            gTotal = getGTotalForCitizenship(citizenship);

            if (gTotal <= 5000) {
              return "#14b04a";
            } else if (gTotal <= 100000) {
              return "#dccb75";
            } else {
              return "red";
            }
          })
          .style("stroke-dasharray", function () {
            var length = this.getTotalLength();
            return length + " " + length;
          })
          .style("stroke-dashoffset", function () {
            var length = this.getTotalLength();
            return length;
          })
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style("stroke-dashoffset", 0);
    });
  });

  /* ----------- World Map ---------- */
  var w = 1100;
  var h = 590;

  // Set up the paths
  var projection = d3.geoEquirectangular()               // Mercator projection which is a standard widely used since the 1500’s.
                     .center([5, 43])                   // Mercator projection default view is of the whole world
                     .translate([w / 2, h / 2])          // need to use (.centre(), .translate() and .scale()) to transform the view so we can see Victoria in our SVG
                     .scale(170);

  var path = d3.geoPath()                                // using geoPath() need to specify a projection
               .projection(projection);
  
  var svg = d3.select("#sarawak_visitor_graph")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("fill", "grey");
  
  // Zoom function
  var zoom = d3.zoom()
                .extent([[0, 0], [w, h]])
                .scaleExtent([1, 4])
                .translateExtent([[0, 0], [w, h]])
                .on("zoom", zoomed);
  
  // Function to handle zoom
  function zoomed(event) {
    // Apply zoom transformation to the map paths
    svg.selectAll('.world-map, .country-node, .path-with-location')
        .attr('transform', event.transform);
  }

  svg.call(zoom);

  // Load sarawak map data from Sarawak_Visitor_Arrivals_2018.csv (default)
  d3.csv("data/Sarawak_Visitor_Arrivals/Sarawak_Visitor_Arrivals_2018.csv").then(function (data) {
    sarawakData = data;
  });

  // Load visitor data from countries_longlat.csv
  d3.csv("data/Sarawak_Visitor_Arrivals/countries_longlat.csv").then(function (data) {
    countriesData = data;

    // Load world map data from World_Map.json
    d3.json("data/World_Map.json").then(function(json){
      svg.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .attr("class", "world-map")
         .attr("fill", "grey");

      // Draw circles representing visitor arrivals
      svg.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("cx", function (d) {
           return projection([+d.longitude, +d.latitude])[0];
         })
         .attr("cy", function (d) {
           return projection([+d.longitude, +d.latitude])[1];
         })
         .attr("r", 4)
         .attr("fill", function (d) {
           if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
             return "#2565ae"; 
           } else {
             return "#54350d";
           }
         })
         .attr("class", "country-node")
         .attr("data-location", function (d) {
           return d.longitude + "," + d.latitude; // Assuming the column with citizenship names is named "citizenship" in the CSV
         });

        // Draw curve lines connecting each citizenship point to the Sarawak point
        svg.selectAll(".country-node")
           .each(function (d) {
            var sarawakLatitude = 1.553278;
            var sarawakLongitude = 110.359213;

            var sourceX = projection([+d.longitude, +d.latitude])[0];
            var sourceY = projection([+d.longitude, +d.latitude])[1];

            var targetX = projection([sarawakLongitude, sarawakLatitude])[0];
            var targetY = projection([sarawakLongitude, sarawakLatitude])[1];

            // Compute control points for the Bezier curve
            var controlX1 = (sourceX + targetX) / 2;
            var controlY1 = sourceY;
            var controlX2 = (sourceX + targetX) / 2;
            var controlY2 = targetY;
          
            pathLocation = '';
            citizenshipLocation = d3.select(this).attr("data-location");
            pathLocation = citizenshipLocation;

            // Create a path string for the Bezier curve
            var pathString = "M " + sourceX + " " + sourceY + " C " + controlX1 + " " + controlY1 + " " + controlX2 + " " + controlY2 + " " + targetX + " " + targetY;
            gTotal = getGTotalForCitizenship(getSelectedCitizenship(pathLocation));

            // Add a class or custom attribute to identify paths by longitude and latitude
            if(gTotal <= 5000){
              svg.append("path")
              .attr("d", pathString)
              .attr("class", "path-with-location")
              .attr("data-location", d.longitude + "," + d.latitude)
              .attr("fill", "none")
              .attr("stroke", "#14b04a") // Set the color of the curve lines
              .attr("stroke-width", 2)
              .style("stroke-dasharray", function () {
                var length = this.getTotalLength();
                return length + " " + length;
              })
              .style("stroke-dashoffset", function () {
                return this.getTotalLength();
              })
              .transition()
              .duration(1000) // Set the duration of the transition in milliseconds
              .ease(d3.easeLinear) // Choose an appropriate easing function
              .style("stroke-dashoffset", 0);
            }
            else if(gTotal <= 100000){
              svg.append("path")
              .attr("d", pathString)
              .attr("class", "path-with-location")
              .attr("data-location", d.longitude + "," + d.latitude)
              .attr("fill", "none")
              .attr("stroke", "#dccb75") // Set the color of the curve lines
              .attr("stroke-width", 2)
              .style("stroke-dasharray", function () {
                var length = this.getTotalLength();
                return length + " " + length;
              })
              .style("stroke-dashoffset", function () {
                return this.getTotalLength();
              })
              .transition()
              .duration(1000) // Set the duration of the transition in milliseconds
              .ease(d3.easeLinear) // Choose an appropriate easing function
              .style("stroke-dashoffset", 0);
            }else{
              svg.append("path")
              .attr("d", pathString)
              .attr("class", "path-with-location")
              .attr("data-location", d.longitude + "," + d.latitude)
              .attr("fill", "none")
              .attr("stroke", "red") // Set the color of the curve lines
              .attr("stroke-width", 2)
              .style("stroke-dasharray", function () {
                var length = this.getTotalLength();
                return length + " " + length;
              })
              .style("stroke-dashoffset", function () {
                return this.getTotalLength();
              })
              .transition()
              .duration(1000) // Set the duration of the transition in milliseconds
              .ease(d3.easeLinear) // Choose an appropriate easing function
              .style("stroke-dashoffset", 0);
            }
        });

        // Add click event listener to circle elements
        svg.selectAll(".country-node").on("click", function (event) {
          citizenshipLocation = d3.select(this).attr("data-location");
          var clickedCircle = d3.select(this);

          // Check if the clicked location is the specific point (Sarawak) that you want to prevent clicking
          if (citizenshipLocation === '110.359213,1.553278') {
            // Hide the info box
            hideInfoBox();
            return; // Exit the function to prevent further processing
          }

          // Check if a circle was previously clicked
          if (currentClickedCircle && currentClickedPath) {
            // Restore the previous circle's color
            currentClickedCircle.attr("fill", function (d) {
              if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
                return "#2565ae"; 
              } else {
                return "#54350d";
              }
            });
            // Restore the previous path's color
            currentClickedPath.attr("stroke", function () {
              pathLocation = currentClickedPath.attr("data-location");
              citizenship = getSelectedCitizenship(pathLocation);
              gTotal = getGTotalForCitizenship(citizenship);

              if (gTotal <= 5000) {
                return "#14b04a";
              } else if (gTotal <= 100000) {
                return "#dccb75";
              } else {
                return "red";
              }
            });

            // Reset the currently clicked circle and path
            currentClickedCircle = null;
            currentClickedPath = null;
          }

          // Find the corresponding citizenship name from the countries_longlat.csv
          var selectedCitizenship = getSelectedCitizenship(citizenshipLocation);

          if (selectedCitizenship) {
            // Find the corresponding G. Total in Sarawak_Visitor_Arrivals_2018.csv
            gTotal = getGTotalForCitizenship(selectedCitizenship);

            // Display the information in a box
            displayInfoInBox(selectedCitizenship, gTotal, event);
          }

          // Check if the circle is already red, and if so, change it to its original color
          if (clickedCircle.classed("red-circle")) {
            clickedCircle.classed("red-circle", false);
            clickedCircle.attr("fill", function (d) {
              if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
                return "#2565ae"; 
              } else {
                return "#54350d";
              }
            });
            // Hide the info box
            hideInfoBox();
          } else {
            // If the circle is not red, change it to red
            clickedCircle.classed("red-circle", true);
            clickedCircle.attr("fill", "#66d3fa");

            // Find and update the associated path
            currentClickedPath = svg.selectAll(".path-with-location")
              .filter(function () {
                return d3.select(this).attr("data-location") === citizenshipLocation;
              });
            currentClickedPath.attr("stroke", "#66d3fa");
          }

          // Update the currently clicked circle and path
          currentClickedCircle = clickedCircle;
        });


          // Add an event listener to the months dropdown list
          document.querySelectorAll(".month_option").forEach(function (option) {
            option.addEventListener("click", function () {
              // Update the selected month when a month is clicked
              selectedMonth = option.getAttribute("data-value");
            });
          });

          // Event handler for the "Go" button
          document.getElementById("goButton").addEventListener("click", function () {
            // Get the selected country and month from the dropdown lists
            var selectedCountry = document.querySelector(".countries_option.active").getAttribute("data-value");
            var selectedMonth = document.querySelector(".month_option.active").getAttribute("data-value");

            // Load data from the selected CSV file based on the selected month
            var selectedOption = yearTicks.querySelector('option[value="' + selectedValue + '"]');
            if (selectedOption) {
              selectedYearDataCSV = selectedOption.getAttribute('data-csv');
            }

            // Check if the selected country is "All Countries"
            if (selectedCountry === "Citizenship") {
              d3.csv("data/Sarawak_Visitor_Arrivals/" + selectedYearDataCSV).then(function (data) {
                sarawakData = data;

                // Find the "G. Total" data for the selected month
                var grandTotalData = data.find(function (d) {
                  return d.Citizenship === "Grand Total";
                });

                if (grandTotalData) {
                  // Update the content of the <h1> element with the "G. Total" value for the selected month
                  var grandTotalElement = document.querySelector('.grand_total_arrivals_value');
                  var formattedTotal = grandTotalData[selectedMonth].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  grandTotalElement.textContent = formattedTotal;
              }              
              });
            } else {
              // For other countries, keep the default "Grand Total" value
              var grandTotalElement = document.querySelector('.grand_total_arrivals_value');
              grandTotalElement.textContent = "-";
            }

            // Hide the info box
            hideInfoBox();

            // Reset circle and path colors
            svg.selectAll(".country-node")
            .attr("fill", function (d) {
              if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
                return "#2565ae";
              } else {
                return "#54350d";
              }
            });
            svg.selectAll(".path-with-location")
              .attr("stroke", function () {
                pathLocation = d3.select(this).attr("data-location");
                citizenship = getSelectedCitizenship(pathLocation);
                gTotal = getGTotalForCitizenship(citizenship);

                if (gTotal <= 5000) {
                  return "#14b04a";
                } else if (gTotal <= 100000) {
                  return "#dccb75";
                } else {
                  return "red";
                }
              })
              .style("stroke-dasharray", function () {
                var length = this.getTotalLength();
                return length + " " + length;
              })
              .style("stroke-dashoffset", function () {
                var length = this.getTotalLength();
                return length;
              })
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .style("stroke-dashoffset", 0);

            // Hide all circles and paths initially
            svg.selectAll(".country-node").style("display", "none");
            svg.selectAll(".path-with-location").style("display", "none");

            // Show the circle point and path for Sarawak
            svg.selectAll(".country-node")
              .filter(function (d) {
                return +d.longitude === 110.359213 && +d.latitude === 1.553278;
              })
              .style("display", "block");

            svg.selectAll(".path-with-location")
              .filter(function () {
                return d3.select(this).attr("data-location") === '110.359213,1.553278';
              })
              .style("display", "block");

            // Show the selected country's circle point and path
            svg.selectAll(".country-node").each(function (d) {
              citizenshipLocation = d3.select(this).attr("data-location");

              if (selectedCountry === "Citizenship" || selectedCountry === getSelectedCitizenship(citizenshipLocation)) {
                d3.select(this).style("display", "block");
              }
            });

            svg.selectAll(".path-with-location").each(function () {
              pathLocation = d3.select(this).attr("data-location");

              if (selectedCountry === "Citizenship" || selectedCountry === getSelectedCitizenship(pathLocation)) {
                d3.select(this).style("display", "block");
              }
            });

            svg.selectAll(".country-node").on("click", function (event) {
              citizenshipLocation = d3.select(this).attr("data-location");
              var clickedCircle = d3.select(this);
            
              if (citizenshipLocation === '110.359213,1.553278') {
                hideInfoBox();
                return;
              }

              // Check if a circle was previously clicked
              if (currentClickedCircle && currentClickedPath) {
                // Restore the previous circle's color
                currentClickedCircle.attr("fill", function (d) {
                  if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
                    return "#2565ae"; 
                  } else {
                    return "#54350d";
                  }
                });
                // Restore the previous path's color
                currentClickedPath.attr("stroke", function () {
                  pathLocation = currentClickedPath.attr("data-location");
                  citizenship = getSelectedCitizenship(pathLocation);
                  gTotal = getGTotalForCitizenship(citizenship);

                  if (gTotal <= 5000) {
                    return "#14b04a";
                  } else if (gTotal <= 100000) {
                    return "#dccb75";
                  } else {
                    return "red";
                  }
                });

                // Reset the currently clicked circle and path
                currentClickedCircle = null;
                currentClickedPath = null;
              }
            
              var selectedCitizenship = getSelectedCitizenship(citizenshipLocation);
            
              if (selectedCitizenship) {
                var dataForSelectedMonth = sarawakData.find(function (d) {
                  return d.Citizenship === selectedCitizenship;
                });
            
                if (dataForSelectedMonth) {
                  gTotal = dataForSelectedMonth[selectedMonth];
            
                  // Display the information in a box
                  displayInfoInBox(selectedCitizenship, gTotal, event);
            
                  // Check if the circle is already red, and if so, change it to its original color
                  if (clickedCircle.classed("red-circle")) {
                    clickedCircle.classed("red-circle", false);
                    clickedCircle.attr("fill", function (d) {
                      if (+d.longitude === 110.359213 && +d.latitude === 1.553278) {
                        return "#2565ae"; 
                      } else {
                        return "#54350d";
                      }
                    });
      
                    // Hide the info box
                    hideInfoBox();
                  } else {
                    clickedCircle.classed("red-circle", true);
                    clickedCircle.attr("fill", "#66d3fa");
            
                    // Find and update the associated path
                    currentClickedPath = svg.selectAll(".path-with-location")
                        .filter(function () {
                          return d3.select(this).attr("data-location") === citizenshipLocation;
                        });
                    currentClickedPath.attr("stroke", "#66d3fa");
                  }

                   // Update the currently clicked circle and path
                  currentClickedCircle = clickedCircle;
                }
              }
            });            
          });
    });
  });
}

window.onload = init;