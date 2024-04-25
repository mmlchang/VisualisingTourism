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

  // Get references to the radio buttons and the transportation title
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  const transportationTitle = document.getElementById('Transportation_title');
  var gettooltip = d3.select("#transportationtooltip");
  var infoBox = d3.select("#transportation-info-box");
  var infoText = d3.select("#info-text");
  var selectedNodes = [];
  var departureTitle = document.getElementById('departure_title');
  var destinationTitle = document.getElementById('destination_title');
  var departureName = document.getElementById('departure_name');
  var destinationName = document.getElementById('destination_name');
  var sideCardHolder = document.getElementById('side_card_holder');
  var sideContainer = document.getElementById('side_card_holder_container');
  var resetBtn = document.getElementById('resetButton');

  var w = 1100;
  var h = 650;

  // Set up the paths
  var projection = d3.geoEquirectangular()               // Mercator projection which is a standard widely used since the 1500’s.
                      .center([113, 3.5])          // Mercator projection default view is of the whole world
                      .translate([w / 2, h / 2])  // need to use (.centre(), .translate() and .scale()) to transform the view so we can see Victoria in our SVG
                      .scale(7000);

  var path = d3.geoPath()                         // using geoPath() need to specify a projection
                .projection(projection);

  var svg = d3.select("#transportation_graph")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("fill", "grey")
              .style('display', 'none');

  var svg2 = d3.select("#transportation_chord_diagram")
               .append("svg")
               .attr("width", w)
               .attr("height", h)
               .style('display', 'block')
               .style('margin-top', '100px');

  // Create a tooltip
  const tooltip2 = d3.select("#transportation_chord_diagram")
                      .append("div")
                      .attr("class", "tooltip2")
                      .style("opacity", 0);

  // Function to draw the chord diagram
  function drawChordDiagram(airData, landData, seaData) {
    // Combine the data from all three transportation modes
    const allData = airData.concat(landData).concat(seaData);

    // Create a matrix to represent the connections between locations
    const { matrix, locations, modes } = createChordMatrix(allData);

    // Set up the chord layout
    const chordLayout = d3.chord()
                          .padAngle(0.05)
                          .sortSubgroups(d3.descending)
                          .sortChords(d3.descending);

    // Compute the chord layout
    const chords = chordLayout(matrix);

    // Set up color scale
    // Colour sourced from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
    const colorScale = d3.scaleOrdinal(['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#fedc56', '#b15928']);

    // Create an SVG group for the chord diagram
    const chordsGroup = svg2.append("g")
                            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
                            .datum(chords);

    var innerRadius = Math.min(w, h) * .40;
    var outerRadius = innerRadius * 1.04;

    // Add the outer arcs representing locations
    const arcGroup = chordsGroup.append("g")
                                .selectAll("g")
                                .data(chords.groups)
                                .enter().append("g");

    arcGroup.append("path")
            .style("fill", d => colorScale(d.index))
            .style("stroke", d => colorScale(d.index))
            .attr("d", d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)
            )
            .on("mouseover", function (event, d) {
              // Reduce opacity for all arcGroups
              svg2.selectAll('.arc-group')
                .style("opacity", 0.1);
              
              // Highlight the hovered arcGroup
              d3.select(this.parentNode)
                .style("opacity", 1);
              
              // Reduce opacity for all paths except those connected to the hovered arcGroup
              svg2.selectAll('.chord-path')
                  .style("opacity", path => path.source.index === d.index || path.target.index === d.index ? 1 : 0.1);
            })
            .on("mouseout", function () {
              // Restore opacity for all arcGroups on mouseout
              svg2.selectAll('.arc-group')
                .style("opacity", 1);
              
              // Restore opacity for all paths on mouseout
              svg2.selectAll('.chord-path')
                .style("opacity", 0.75);
            })
            .attr("class", "arc-group")
            .attr("class", "arc"); // Added a class to identify these arcs
    
    // Append text for division names at the top of each arc group
    arcGroup.append("text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .attr("transform", function(d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                    "translate(" + (outerRadius + 10) + ")" +
                    (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .style("font-size", "14px")
            .text(function(d, i) { return locations[i]; });

    // Add the connecting chords
    const chordPaths = chordsGroup.append("g")
                              .attr("fill-opacity", 0.75)
                              .selectAll("path")
                              .data(chords)
                              .enter().append("path")
                              .attr("d", d3.ribbon()
                                .radius(innerRadius)
                              )
                              .style("fill", d => colorScale(d.source.index))
                              .style("stroke", d => colorScale(d.source.index))
                              .attr("class", "chord-path")
                              .on("mouseover", function (event, d) {
                                svg2.selectAll('.arc')
                                    .style("opacity", arc => arc.index === d.source.index || arc.index === d.target.index ? 1 : 0.1);

                                svg2.selectAll('.chord-path')
                                    .style("opacity", path => path.source.index === d.source.index && path.target.index === d.target.index ? 1 : 0.1);
                                
                                const sourceName = locations[d.source.index];
                                const targetName = locations[d.target.index];
                                const modesText = getModesText(`${sourceName}_${targetName}`, locations, modes, seaData, landData, airData);

                                tooltip2.transition()
                                        .duration(200)
                                        .style("opacity", 1);
                                tooltip2.html(`${sourceName} <span style="font-size: 24px;">⇔</span> ${targetName}<br>${modesText}`)
                                .style("left", (event.pageX) + "px")
                                .style("top", (event.pageY - 28) + "px");
                                    
                              })
                              .on("mouseout", function (d) {
                                svg2.selectAll('.arc')
                                    .style("opacity", 1);
                                      
                                svg2.selectAll('.chord-path')
                                    .style("opacity", 0.75);

                                tooltip2.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                              });
  }

  function getModesText(key, locations, modes, seaData, landData, airData) {
    const keyParts = key.split("_");
  
    if (keyParts.length === 1) {
      // Single location
      const location = keyParts[0];
      const uniqueModes = modes[location] ? Array.from(new Set(modes[location])) : [];
      return uniqueModes.join(", ");
    } else if (keyParts.length === 2) {
      // Connection between two locations
      const sourceLocation = keyParts[0];
      const targetLocation = keyParts[1];
  
      // Check if the connection is present in air, land, or sea data
      const matchingModes = [];
      
      if (seaData) {
        const seaConnection = seaData.find(d =>
          (d.Departure_Division === sourceLocation && d.Destination_Division === targetLocation) ||
          (d.Departure_Division === targetLocation && d.Destination_Division === sourceLocation)
        );
        if (seaConnection) matchingModes.push("Sea");
        }
      
      if (landData) {
        const landConnection = landData.find(d =>
          (d.Departure_Division === sourceLocation && d.Destination_Division === targetLocation) ||
          (d.Departure_Division === targetLocation && d.Destination_Division === sourceLocation)
        );
        if (landConnection) matchingModes.push("Land");
      }

      if (airData) {
        const airConnection = airData.find(d =>
          (d.Departure_Division === sourceLocation && d.Destination_Division === targetLocation) ||
          (d.Departure_Division === targetLocation && d.Destination_Division === sourceLocation)
        );
        if (airConnection) matchingModes.push("Air");
      }
  
      // Set background color based on modes
      const backgroundColors = {
        Air: 'hsl(28, 72%, 79%)',
        Land: 'hsl(143, 59%, 79%)',
        Sea: 'hsl(185, 74%, 79%)',
      };
  
      // Join the matched modes into a string with background colors
      const modesText = matchingModes.map(mode => `<span style="background-color: ${backgroundColors[mode]}; padding: 2px; border-radius: 3px;">${mode}</span>`).join(" ");

      return modesText;
    }

    return "";
  }

  // Function to create a matrix from the data
  function createChordMatrix(data) {
    const locations = Array.from(new Set(data.map(d => d.Departure_Division).concat(data.map(d => d.Destination_Division))));
  
    // Create an empty matrix and modes object
    const matrix = Array(locations.length).fill(0).map(() => Array(locations.length).fill(0));
    const modes = {};
  
    // Fill the matrix with connection counts and store modes
    data.forEach(d => {
      const sourceIndex = locations.indexOf(d.Departure_Division);
      const targetIndex = locations.indexOf(d.Destination_Division);
      matrix[sourceIndex][targetIndex]++;
      
      // Store modes for each connection
      const key = `${d.Departure_Division}_${d.Destination_Division}`;
      modes[key] = modes[key] || [];
      modes[key].push(d.Mode);
    });
  
    return { matrix, locations, modes };
  }

  // Load data from CSV files
  d3.csv("data/Transportation/Transportation_Air.csv").then(function (airData) {
    d3.csv("data/Transportation/Transportation_Land.csv").then(function (landData) {
      d3.csv("data/Transportation/Transportation_Sea.csv").then(function (seaData) {
        // Draw the chord diagram
        drawChordDiagram(airData, landData, seaData);
      });
    });
  });

  // Load world map data from World_Map.json
  d3.json("data/Sarawak_Map.json").then(function(json){
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "grey");
  
    // Load visitor data from sea_longlat.csv
    d3.csv("data/Transportation/sea_longlat.csv").then(function (data) {
      svg.selectAll(".sea-node")
          .data(data)
          .enter()
          .append("image")
          .attr("x", function (d) {
              return projection([+d.Longitude_Sea, +d.Latitude_Sea])[0]; // Adjust the x-position to center the image
          })
          .attr("y", function (d) {
              return projection([+d.Longitude_Sea, +d.Latitude_Sea])[1]; // Adjust the y-position to center the image
          })
          .attr("width", 20) 
          .attr("height", 20) 
          .attr("xlink:href", "images/sea_icon.png") 
          .attr("class", "sea-node")
          .attr("data-location", function (d) {
              return d.Longitude_Sea + "," + d.Latitude_Sea;
          })
          .on("click", function (event, d) {
            handleSeaNodeClick(event, d);
          })
          .on("mouseover", function (event, d) {
            // Update the content of the tooltip
            gettooltip.html("<b>Port:</b> " + d.Port);
    
            // Calculate the position based on the mouseover event
            var x = event.pageX; // X-coordinate of the mouseover
            var y = event.pageY + 20; // Y-coordinate of the mouseover, adding 20 pixels for spacing
    
            // Set the position of the tooltip
            gettooltip.style("top", y + "px");
            gettooltip.style("left", x + "px");
    
            // Show the tooltip
            gettooltip.style("display", "block");
          })
          .on("mouseout", function () {
            // Hide the tooltip on mouseout
            gettooltip.style("display", "none");
          });
          // Hide sea nodes after data loading
          svg.selectAll('.sea-node').style('display', 'none');
    });

    function handleSeaNodeClick(event, d) {
      if (selectedMode !== 'all') {
        // Hide the previous infoBox
        infoBox.style("display", "none");
    
        // Check if the node is already selected
        const isSelected = selectedNodes.some((node) => node === d);
    
        if (isSelected) {
          // Node is already selected, remove it from the selection
          const index = selectedNodes.indexOf(d);
          selectedNodes.splice(index, 1);
    
          // Change the image source back to "sea_icon.png"
          d3.select(event.currentTarget).attr("xlink:href", "images/sea_icon.png");
    
          // Remove the path
          svg.select(".curvepath").remove();
    
          // If both nodes were selected and one is deselected, update the destination/departure text content
          // Update departureName and destinationName
          if (selectedNodes.length === 0) {
            departureName.textContent = '-';
            destinationName.textContent = '-';
          } else if (selectedNodes.length === 1) {
            departureName.textContent = selectedNodes[0].Port;
            destinationName.textContent = '-';
          }
        } else {
          // If two nodes are already selected, reset them to "sea_icon.png" and remove the path
          if (selectedNodes.length === 2) {
            selectedNodes.forEach((node) => {
              d3.select(`.sea-node[data-location="${node.Longitude_Sea},${node.Latitude_Sea}"]`)
                .attr("xlink:href", "images/sea_icon.png");
            });
    
            // Remove the path
            svg.select(".curvepath").remove();
    
            // Clear the selection for the next pair
            selectedNodes = [];
          }
    
          // Node is not selected, add it to the selection
          selectedNodes.push(d);
    
          // Change the image source to "blacksea_icon.png"
          d3.select(event.currentTarget).attr("xlink:href", "images/blacksea_icon.png");
          if (selectedNodes.length === 0) {
            departureName.textContent = '-';
            destinationName.textContent = '-';
          } else if (selectedNodes.length === 1) {
            departureName.textContent = selectedNodes[0].Port;
            destinationName.textContent = '-';
          } else if(selectedNodes.length === 2){
            // Update departureName with the selected port name
            departureName.textContent = selectedNodes[0].Port;
            destinationName.textContent = selectedNodes[1].Port;
          }
          
          // If two nodes are selected, draw a path and display information
          if (selectedNodes.length === 2) {
            // Draw a path between the selected nodes
            drawCurvePath(selectedNodes, 'sea');
    
            // Display information in the console
            displayInformation(selectedNodes, 'sea');
          }
        }
      }
    }    
  
    function drawCurvePath(nodes, selectedRadioButton) {
      const start = getImageCenter(nodes[0], selectedRadioButton);
      const end = getImageCenter(nodes[1], selectedRadioButton);
    
      // Create a Bézier curve/path element
      const line = d3.line()
        .curve(d3.curveBasis);
    
      const pathData = [
        start,
        [(start[0] + end[0]) / 2, start[1] - 250],
        end
      ];
    
      const path = svg.append("path")
        .datum(pathData)
        .attr("fill", "none")
        .attr("stroke", "#0047AB")
        .attr("stroke-width", 2)
        .attr("class", "curvepath")
        .attr("d", line);
      
      // Calculate the total length of the path
      const totalLength = path.node().getTotalLength();

      // Set up the initial path styling
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(700) // Set the duration for the transition in milliseconds
        .ease(d3.easeLinear) // Set the easing function for the transition
        .attr("stroke-dashoffset", 0); // Animate the path drawing
    
      // Calculate the middle point of the path
      const middleX = (start[0] + end[0]) / 2;
      const middleY = (start[1] + end[1]) / 2;
    
      // Position the info box at the middle of the path
      const infoBoxX = middleX - 150; // Adjusted for spacing
      const infoBoxY = middleY + 10;  // Adjusted for spacing
    
      infoBox.style("top", infoBoxY + "px");
      infoBox.style("left", infoBoxX + "px");
      infoBox.style("display", "block");
    
      // Update the info box position when the window is resized
      d3.select(window).on("resize", function () {
        const updatedStart = getImageCenter(nodes[0], selectedRadioButton);
        const updatedEnd = getImageCenter(nodes[1], selectedRadioButton);
    
        const updatedMiddleX = (updatedStart[0] + updatedEnd[0]) / 2;
        const updatedMiddleY = (updatedStart[1] + updatedEnd[1]) / 2;
    
        const updatedInfoBoxX = updatedMiddleX - 150; // Adjusted for spacing
        const updatedInfoBoxY = updatedMiddleY + 10;  // Adjusted for spacing
    
        infoBox.style("top", updatedInfoBoxY + "px");
        infoBox.style("left", updatedInfoBoxX + "px");
      });
    }    
        
    // Load visitor data from land_longlat.csv
    d3.csv("data/Transportation/land_longlat.csv").then(function (data) {
      svg.selectAll(".land-node")
          .data(data)
          .enter()
          .append("image")
          .attr("x", function (d) {
              return projection([+d.Longitude_Land, +d.Latitude_Land])[0]; // Adjust the x-position to center the image
          })
          .attr("y", function (d) {
              return projection([+d.Longitude_Land, +d.Latitude_Land])[1]; // Adjust the y-position to center the image
          })
          .attr("width", 20) 
          .attr("height", 20) 
          .attr("xlink:href", "images/land_icon.png") 
          .attr("class", "land-node")
          .attr("data-location", function (d) {
              return d.Longitude_Land + "," + d.Latitude_Land;
          })
          .on("click", function (event, d) {
            handleLandNodeClick(event, d);
          })
          .on("mouseover", function (event, d) {
            // Update the content of the tooltip
            gettooltip.html("<b>Division:</b> " + d.Division);
    
            // Calculate the position based on the mouseover event
            var x = event.pageX; // X-coordinate of the mouseover
            var y = event.pageY + 20; // Y-coordinate of the mouseover, adding 20 pixels for spacing
    
            // Set the position of the tooltip
            gettooltip.style("top", y + "px");
            gettooltip.style("left", x + "px");
    
            // Show the tooltip
            gettooltip.style("display", "block");
          })
          .on("mouseout", function () {
            // Hide the tooltip on mouseout
            gettooltip.style("display", "none");
          });
          // Hide land nodes after data loading
          svg.selectAll('.land-node').style('display', 'none');
    });

    function handleLandNodeClick(event, d) {
      if(selectedMode !== 'all'){
        // Hide the previous infoBox
        infoBox.style("display", "none");

        // Check if the node is already selected
        const isSelected = selectedNodes.some((node) => node === d);
      
        if (isSelected) {
          // Node is already selected, remove it from the selection
          const index = selectedNodes.indexOf(d);
          selectedNodes.splice(index, 1);
      
          // Change the image source back to "air_icon.png"
          d3.select(event.currentTarget).attr("xlink:href", "images/land_icon.png");
      
          // Remove the path
          svg.select("line").remove();

          // If both nodes were selected and one is deselected, update the destination/departure text content
          if (selectedNodes.length === 1) {
            departureName.textContent = selectedNodes[0].Division;
            destinationName.textContent = '-';
          } else if (selectedNodes.length === 0) {
            departureName.textContent = '-';
            destinationName.textContent = '-';
          }
        } else {
          // If two nodes are already selected, reset them to "air_icon.png" and remove the path
          if (selectedNodes.length === 2) {
            selectedNodes.forEach((node) => {
              d3.select(`.land-node[data-location="${node.Longitude_Land},${node.Latitude_Land}"]`)
                .attr("xlink:href", "images/land_icon.png");
            });
      
            // Remove the path
            svg.select("line").remove();
      
            // Clear the selection for the next pair
            selectedNodes = [];
          }
      
          // Node is not selected, add it to the selection
          selectedNodes.push(d);
      
          // Change the image source to "greenland_icon.png"
          d3.select(event.currentTarget).attr("xlink:href", "images/greenland_icon.png");
    
          if (selectedNodes.length === 0) {
            departureName.textContent = '-';
            destinationName.textContent = '-';
          } else if (selectedNodes.length === 1) {
            departureName.textContent = selectedNodes[0].Division;
            destinationName.textContent = '-';
          } else if(selectedNodes.length === 2){
            // Update departureName with the selected division name
            departureName.textContent = selectedNodes[0].Division;
            destinationName.textContent = selectedNodes[1].Division;
          }
    
          // If only one node is selected, update the departure/destination accordingly
          if (selectedNodes.length === 1) {
            destinationName.textContent = '-';
          }
          
          // If two nodes are selected, draw a path and display information
          if (selectedNodes.length === 2) {
            // Draw a path between the selected nodes
            drawPath(selectedNodes, 'land');
    
            // Display information in the console
            displayInformation(selectedNodes, 'land');
          }
        }
      }
    }  
  
    // Load visitor data from air_longlat.csv
    d3.csv("data/Transportation/air_longlat.csv").then(function (data) {
      svg.selectAll(".air-node")
        .data(data)
        .enter()
        .append("image")
        .attr("x", function (d) {
          return projection([+d.Longitude_Air, +d.Latitude_Air])[0];
        })
        .attr("y", function (d) {
          return projection([+d.Longitude_Air, +d.Latitude_Air])[1];
        })
        .attr("width", 20)
        .attr("height", 20)
        .attr("xlink:href", "images/air_icon.png")
        .attr("class", "air-node")
        .attr("data-location", function (d) {
          return d.Longitude_Air + "," + d.Latitude_Air;
        })
        .on("click", function (event, d) {
          handleAirNodeClick(event, d);
        })
        .on("mouseover", function (event, d) {
          // Update the content of the tooltip
          gettooltip.html("<b>Airport:</b> " + d.Airport);
  
          // Calculate the position based on the mouseover event
          var x = event.pageX; // X-coordinate of the mouseover
          var y = event.pageY + 20; // Y-coordinate of the mouseover, adding 20 pixels for spacing
  
          // Set the position of the tooltip
          gettooltip.style("top", y + "px");
          gettooltip.style("left", x + "px");
  
          // Show the tooltip
          gettooltip.style("display", "block");
        })
        .on("mouseout", function () {
          // Hide the tooltip on mouseout
          gettooltip.style("display", "none");
        });
        // Hide air nodes after data loading
        svg.selectAll('.air-node').style('display', 'none');
    });

    function handleAirNodeClick(event, d) {
      if(selectedMode !== 'all'){
        // Hide the previous infoBox
        infoBox.style("display", "none");

        // Check if the node is already selected
        const isSelected = selectedNodes.some((node) => node === d);
      
        if (isSelected) {
          // Node is already selected, remove it from the selection
          const index = selectedNodes.indexOf(d);
          selectedNodes.splice(index, 1);
      
          // Change the image source back to "air_icon.png"
          d3.select(event.currentTarget).attr("xlink:href", "images/air_icon.png");
      
          // Remove the path
          svg.select("line").remove();

          // If both nodes were selected and one is deselected, update the destination/departure text content
          if (selectedNodes.length === 1) {
            departureName.textContent = selectedNodes[0].Airport;
            destinationName.textContent = '-';
          } else if (selectedNodes.length === 0) {
            departureName.textContent = '-';
            destinationName.textContent = '-';
          }
        } else {
          // If two nodes are already selected, reset them to "air_icon.png" and remove the path
          if (selectedNodes.length === 2) {
            selectedNodes.forEach((node) => {
              d3.select(`.air-node[data-location="${node.Longitude_Air},${node.Latitude_Air}"]`)
                .attr("xlink:href", "images/air_icon.png");
            });
      
            // Remove the path
            svg.select("line").remove();
      
            // Clear the selection for the next pair
            selectedNodes = [];
          }
      
          // Node is not selected, add it to the selection
          selectedNodes.push(d);
      
          // Change the image source to "yellowair_icon.png"
          d3.select(event.currentTarget).attr("xlink:href", "images/yellowair_icon.png");
    
          if (selectedNodes.length === 0) {
            departureName.textContent = '-';
            destinationName.textContent = '-';
          } else if (selectedNodes.length === 1) {
            departureName.textContent = selectedNodes[0].Airport;
            destinationName.textContent = '-';
          } else if(selectedNodes.length === 2){
            // Update departureName with the selected airport name
            departureName.textContent = selectedNodes[0].Airport;
            destinationName.textContent = selectedNodes[1].Airport;
          }
    
          // If only one node is selected, update the departure/destination accordingly
          if (selectedNodes.length === 1) {
            destinationName.textContent = '-';
          }
          
          // If two nodes are selected, draw a path and display information
          if (selectedNodes.length === 2) {
            // Draw a path between the selected nodes
            drawPath(selectedNodes, 'air');
    
            // Display information in the console
            displayInformation(selectedNodes, 'air');
          }
        }
      }
    }  
  
    function drawPath(nodes, selectedRadioButton) {
      const start = getImageCenter(nodes[0], selectedRadioButton);
      const end = getImageCenter(nodes[1], selectedRadioButton);
    
      // Define the path color based on the selected radio button
      const pathColor = selectedRadioButton === 'air' ? 'orange' : '#4F7942';
    
      // Create a line/path element
      const path = svg.append("line")
        .attr("x1", start[0])
        .attr("y1", start[1])
        .attr("x2", end[0])
        .attr("y2", end[1])
        .attr("stroke", pathColor)
        .attr("stroke-width", 2);
      
      // Calculate the total length of the path
      const totalLength = path.node().getTotalLength();

      // Set up the initial path styling
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(700) // Set the duration for the transition in milliseconds
        .ease(d3.easeLinear) // Set the easing function for the transition
        .attr("stroke-dashoffset", 0); // Animate the path drawing
    
      // Calculate the middle point of the path
      const middleX = (start[0] + end[0]) / 2;
      const middleY = (start[1] + end[1]) / 2;
    
      // Position the info box at the middle of the path
      const infoBoxX = middleX - 100; // Adjusted for spacing
      const infoBoxY = middleY - 10;  // Adjusted for spacing
    
      infoBox.style("top", infoBoxY + "px");
      infoBox.style("left", infoBoxX + "px");
      infoBox.style("display", "block");
    
      // Update the info box position when the window is resized
      d3.select(window).on("resize", function () {
        const updatedStart = getImageCenter(nodes[0], selectedRadioButton);
        const updatedEnd = getImageCenter(nodes[1], selectedRadioButton);
    
        const updatedMiddleX = (updatedStart[0] + updatedEnd[0]) / 2;
        const updatedMiddleY = (updatedStart[1] + updatedEnd[1]) / 2;
    
        const updatedInfoBoxX = updatedMiddleX - 100; // Adjusted for spacing
        const updatedInfoBoxY = updatedMiddleY - 10;  // Adjusted for spacing
    
        infoBox.style("top", updatedInfoBoxY + "px");
        infoBox.style("left", updatedInfoBoxX + "px");
      });
    }    
  
    function getImageCenter(node, selectedRadioButton) {
      let longitude, latitude;
    
      // Determine which radio button is selected
      switch (selectedRadioButton) {
        case 'air':
          longitude = +node.Longitude_Air;
          latitude = +node.Latitude_Air;
          break;
        case 'land':
          longitude = +node.Longitude_Land;
          latitude = +node.Latitude_Land;
          break;
        case 'sea':
          longitude = +node.Longitude_Sea;
          latitude = +node.Latitude_Sea;
          break;
    
        // Default to air if no specific mode is provided
        default:
          longitude = +node.Longitude_Air;
          latitude = +node.Latitude_Air;
      }
    
      // Get the center coordinates of the image
      const x = projection([longitude, latitude])[0];
      const y = projection([longitude, latitude])[1];
    
      // Adjust for the dimensions of the image (assuming 17x17 images)
      const imageWidth = 17;
      const imageHeight = 17;
    
      const centerX = x + imageWidth / 2;
      const centerY = y + imageHeight / 2;
    
      return [centerX, centerY];
    }    
  
    function displayInformation(nodes, selectedRadioButton) {
      let csvFilePath;
    
      // Determine the CSV file path based on the selected radio button
      switch (selectedRadioButton) {
        case 'air':
          csvFilePath = 'data/Transportation/Transportation_Air.csv';
          break;
        case 'land':
          csvFilePath = 'data/Transportation/Transportation_Land.csv';
          break;
        case 'sea':
          csvFilePath = 'data/Transportation/Transportation_Sea.csv';
          break;
    
        // Default to air if no specific mode is provided
        default:
          csvFilePath = 'data/Transportation/Transportation_Air.csv';
      }
    
      d3.csv(csvFilePath).then(function (csvData) {
        const departureNode = nodes[0];
        const destinationNode = nodes[1];
    
        let matchedRow;
    
        // Determine the matching criteria based on the selected radio button
        switch (selectedRadioButton) {
          case 'air':
            matchedRow = csvData.find(row => row.Departure === departureNode.Airport && row.Destination === destinationNode.Airport);
            break;
          case 'land':
            matchedRow = csvData.find(row => row.Departure_Division === departureNode.Division && row.Destination_Division === destinationNode.Division);
            break;
          case 'sea':
            matchedRow = csvData.find(row => row.Departure === departureNode.Port && row.Destination === destinationNode.Port);
            break;
          default:
            matchedRow = csvData.find(row => row.Departure === departureNode.Airport && row.Destination === destinationNode.Airport);
        }
    
        if (matchedRow) {
          const distance = matchedRow.Distance;
          const duration = matchedRow.Duration;
          
          // Display Distance and Duration in the info box
          infoText.html(`<b>Distance:</b> ${distance} km<br><b>Duration:</b> ${duration}`);
        } else {
          infoText.text("No data found.");
        }
      });
    }
    
    // Set the default clicked radio button to "all"
    const allRadioButton = document.getElementById('all');
    allRadioButton.click();
    departureTitle.style.display = "none";
    destinationTitle.style.display = "none";
    departureName.style.display = "none";
    destinationName.style.display = "none";
    resetBtn.style.display = "none";
    sideCardHolder.style.height = "780px";
    sideContainer.style.height = "780px";
    
    // Add a variable to keep track of the selected mode
    let selectedMode = 'all';

    // Add an event listener for radio button clicks
    radioButtons.forEach((radio) => {
      radio.addEventListener('click', function () {
        selectedNodes = [];
        svg.select("line").remove();
        svg.select(".curvepath").remove();
        infoBox.style("display", "none");
        svg.selectAll('.sea-node').attr("xlink:href", "images/sea_icon.png");
        svg.selectAll('.land-node').attr("xlink:href", "images/land_icon.png");
        svg.selectAll('.air-node').attr("xlink:href", "images/air_icon.png");
        svg.selectAll('.sea-node, .land-node, .air-node').style('display', 'none');
        
        // Update the selected mode
        selectedMode = radio.id;

        // Check which radio button is clicked and show the corresponding nodes
        if (selectedMode === 'all') {
          transportationTitle.textContent = 'All Transportation';
          AllModesSetting();
        } else if (selectedMode === 'sea') {
          transportationTitle.textContent = 'Sea Transportation';
          svg.selectAll('.sea-node').style('display', 'inline');
          OtherModesSetting();
        } else if (selectedMode === 'land') {
          transportationTitle.textContent = 'Land Transportation';
          svg.selectAll('.land-node').style('display', 'inline');
          OtherModesSetting();
        } else if (selectedMode === 'air') {
          transportationTitle.textContent = 'Air Transportation';
          svg.selectAll('.air-node').style('display', 'inline');
          OtherModesSetting();
        }
      });
    });

    resetBtn.addEventListener('click', function(){
      // Clear the selected nodes array
      selectedNodes = [];
      
      // Reset the images/icons for all nodes
      svg.selectAll('.sea-node').attr("xlink:href", "images/sea_icon.png");
      svg.selectAll('.land-node').attr("xlink:href", "images/land_icon.png");
      svg.selectAll('.air-node').attr("xlink:href", "images/air_icon.png");
      
      // Remove any drawn paths or connections
      svg.select("line").remove();
      svg.select(".curvepath").remove();
      infoBox.style("display", "none");
      
      // Update departure and destination text content
      departureName.textContent = '-';
      destinationName.textContent = '-';
    });    

    function AllModesSetting(){
      svg.style('display', 'none');
      svg2.style('display', 'block');
      svg.selectAll('.sea-node, .land-node, .air-node').style('display', 'none');
      departureTitle.style.display = "none";
      destinationTitle.style.display = "none";
      departureName.style.display = "none";
      destinationName.style.display = "none";
      sideCardHolder.style.height = "780px";
      sideContainer.style.height = "780px";
      resetBtn.style.display = "none";
    }

    function OtherModesSetting(){
      svg.style('display', 'block');
      svg2.style('display', 'none');
      departureTitle.style.display = "block";
      destinationTitle.style.display = "block";
      departureName.style.display = "block";
      destinationName.style.display = "block";
      departureName.textContent = '-';
      destinationName.textContent = '-';
      sideCardHolder.style.height = "680px";
      sideContainer.style.height = "680px";
      resetBtn.style.display = "flex";
    }
  });
};

window.onload = init;