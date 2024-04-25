/* ---------- For dropdown --> Countries ---------- */
$(document).ready(function () {
  $(".countries_drop .countries_option, .dropdown-arrow").click(function (event) {
    // Check if the clicked element is .dropdown-arrow
    if ($(event.target).hasClass("dropdown-arrow")) {
      toggleDropdown();
    } else {
      var val = $(this).attr("data-value"),
        $drop = $(".countries_drop"),
        prevActive = $(".countries_drop .countries_option.active").attr("data-value"),
        options = $(".countries_drop .countries_option").length;
      $drop.find(".countries_option.active").addClass("countries_mini-hack");
      $drop.toggleClass("visible");
      $drop.removeClass("withBG");
      $(this).css("top");
      $drop.toggleClass("opacity");
      $(".countries_mini-hack").removeClass("countries_mini-hack");
      if ($drop.hasClass("visible")) {
        setTimeout(function () {
          $drop.addClass("withBG");
        }, 100 + options * 100);
      }
      triggerAnimation();
      if (val !== "placeholder" || prevActive === "placeholder") {
        $(".countries_drop .countries_option").removeClass("active");
        $(this).addClass("active");
      }

      // Add the following lines to set the overflow-y property
      if ($drop.hasClass("visible")) {
        // Set overflow-y to 'scroll' when the dropdown is visible
        $(".countries_options-container").css("overflow-y", "scroll");
        $(".dropdown-arrow").addClass("rotate-180");
      } else {
        // Set overflow-y to 'hidden' when the dropdown is hidden
        $(".countries_options-container").css("overflow-y", "hidden");
        $(".dropdown-arrow").removeClass("rotate-180");
      }
    }
  });

  function toggleDropdown() {
    var $drop = $(".countries_drop");
    $drop.toggleClass("visible");
    $drop.removeClass("withBG");
    $drop.toggleClass("opacity");
    $(".countries_mini-hack").removeClass("countries_mini-hack");
    if ($drop.hasClass("visible")) {
      setTimeout(function () {
        $drop.addClass("withBG");
      }, 100);
    }
    triggerAnimation();

    // Add the following lines to set the overflow-y property
    if ($drop.hasClass("visible")) {
      // Set overflow-y to 'scroll' when the dropdown is visible
      $(".countries_options-container").css("overflow-y", "scroll");
      $(".dropdown-arrow").addClass("rotate-180");
    } else {
      // Set overflow-y to 'hidden' when the dropdown is hidden
      $(".countries_options-container").css("overflow-y", "hidden");
      $(".dropdown-arrow").removeClass("rotate-180");
    }
  }

  function triggerAnimation() {
    var finalWidth = $(".countries_drop").hasClass("visible") ? 10.5 : 9.5;
    $(".countries_drop").css("width", "10.5em");
    setTimeout(function () {
      $(".countries_drop").css("width", finalWidth + "em");
    }, 100);
  }
});



/* ---------- For dropdown --> Months ---------- */
$(document).ready(function () {
  $(".months_drop .month_option, .monthdropdown-arrow").click(function (event) {
    // Check if the clicked element is .monthdropdown-arrow
    if ($(event.target).hasClass("monthdropdown-arrow")) {
      toggleDropdown();
    } else {
      var val = $(this).attr("data-value"),
        $drop = $(".months_drop"),
        prevActive = $(".months_drop .month_option.active").attr("data-value"),
        options = $(".months_drop .month_option").length;
      $drop.find(".month_option.active").addClass("month_mini-hack");
      $drop.toggleClass("visible");
      $drop.removeClass("withBG");
      $(this).css("top");
      $drop.toggleClass("opacity");
      $(".month_mini-hack").removeClass("month_mini-hack");
      if ($drop.hasClass("visible")) {
        setTimeout(function () {
          $drop.addClass("withBG");
        }, 100 + options * 100);
      }
      triggerAnimation();
      if (val !== "placeholder" || prevActive === "placeholder") {
        $(".months_drop .month_option").removeClass("active");
        $(this).addClass("active");
      }

      // Add the following lines to set the overflow-y property
      if ($drop.hasClass("visible")) {
        // Set overflow-y to 'scroll' when the dropdown is visible
        $(".months_options-container").css("overflow-y", "scroll");
        $(".monthdropdown-arrow").addClass("monthrotate-180");
      } else {
        // Set overflow-y to 'hidden' when the dropdown is hidden
        $(".months_options-container").css("overflow-y", "hidden");
        $(".monthdropdown-arrow").removeClass("monthrotate-180");
      }
    }
  });

  function toggleDropdown() {
    var $drop = $(".months_drop");
    $drop.toggleClass("visible");
    $drop.removeClass("withBG");
    $drop.toggleClass("opacity");
    $(".month_mini-hack").removeClass("month_mini-hack");
    if ($drop.hasClass("visible")) {
      setTimeout(function () {
        $drop.addClass("withBG");
      }, 100);
    }
    triggerAnimation();

    // Add the following lines to set the overflow-y property
    if ($drop.hasClass("visible")) {
      // Set overflow-y to 'scroll' when the dropdown is visible
      $(".months_options-container").css("overflow-y", "scroll");
      $(".monthdropdown-arrow").addClass("monthrotate-180");
    } else {
      // Set overflow-y to 'hidden' when the dropdown is hidden
      $(".months_options-container").css("overflow-y", "hidden");
      $(".monthdropdown-arrow").removeClass("monthrotate-180");
    }
  }

  function triggerAnimation() {
    var finalWidth = $(".months_drop").hasClass("visible") ? 10.5 : 9.5;
    $(".months_drop").css("width", "10.5em");
    setTimeout(function () {
      $(".months_drop").css("width", finalWidth + "em");
    }, 100);
  }
});



/* ---------- For dropdown --> Departure ---------- */
$(document).ready(function() {
  $(".departure_drop .departure_option").click(function() {
    var val = $(this).attr("data-value"),
        $drop = $(".departure_drop"),
        prevActive = $(".departure_drop .departure_option.active").attr("data-value"),
        options = $(".departure_drop .departure_option").length;
    $drop.find(".departure_option.active").addClass("departure_mini-hack");
    $drop.toggleClass("visible");
    $drop.removeClass("withBG");
    $(this).css("top");
    $drop.toggleClass("opacity");
    $(".departure_mini-hack").removeClass("departure_mini-hack");
    if ($drop.hasClass("visible")) {
      setTimeout(function() {
        $drop.addClass("withBG");
      }, 100 + options*100); 
    }
    triggerAnimation();
    if (val !== "placeholder" || prevActive === "placeholder") {
      $(".departure_drop .departure_option").removeClass("active");
      $(this).addClass("active");
    };

    // Add the following lines to set the overflow-y property
    if ($drop.hasClass("visible")) {
      // Set overflow-y to 'scroll' when the dropdown is visible
      $(".departure_options-container").css("overflow-y", "scroll");
    } else {
      // Set overflow-y to 'hidden' when the dropdown is hidden
      $(".departure_options-container").css("overflow-y", "hidden");
    }
  });
  
  function triggerAnimation() {
    var finalWidth = $(".departure_drop").hasClass("visible") ? 10.5 : 9.5;
    $(".departure_drop").css("width", "10.5em");
    setTimeout(function() {
      $(".departure_drop").css("width", finalWidth + "em");
    }, 100);
  }
});


/* ---------- For dropdown --> Destination ---------- */
$(document).ready(function() {
  $(".destination_drop .destination_option").click(function() {
    var val = $(this).attr("data-value"),
        $drop = $(".destination_drop"),
        prevActive = $(".destination_drop .destination_option.active").attr("data-value"),
        options = $(".destination_drop .destination_option").length;
    $drop.find(".destination_option.active").addClass("destination_mini-hack");
    $drop.toggleClass("visible");
    $drop.removeClass("withBG");
    $(this).css("top");
    $drop.toggleClass("opacity");
    $(".destination_mini-hack").removeClass("destination_mini-hack");
    if ($drop.hasClass("visible")) {
      setTimeout(function() {
        $drop.addClass("withBG");
      }, 200 + options*100); 
    }
    triggerAnimation();
    if (val !== "placeholder" || prevActive === "placeholder") {
      $(".destination_drop .destination_option").removeClass("active");
      $(this).addClass("active");
    };

    // Add the following lines to set the overflow-y property
    if ($drop.hasClass("visible")) {
      // Set overflow-y to 'scroll' when the dropdown is visible
      $(".destination_options-container").css("overflow-y", "scroll");
    } else {
      // Set overflow-y to 'hidden' when the dropdown is hidden
      $(".destination_options-container").css("overflow-y", "hidden");
    }
  });
  
  function triggerAnimation() {
    var finalWidth = $(".destination_drop").hasClass("visible") ? 10.5 : 9.5;
    $(".destination_drop").css("width", "10.5em");
    setTimeout(function() {
      $(".destination_drop").css("width", finalWidth + "em");
    }, 200);
  }
});
