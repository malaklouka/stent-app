stent.tooltip = (function() {

  var init = function () {

    $("body").tooltip({
      selector: "[data-toggle=\"tooltip\"]",
      delay: parseInt($(this).attr("data-delay"), 10),
      sanitize: false,
      boundary: "window",
      trigger: "hover"
    });

    $("body").on("click.tooltip", "[data-toggle='tooltip']", function() {
      $(this).tooltip("hide");
    });

  };

  init();

})();