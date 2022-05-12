stent.requireJS(["widgets", "chart"], function() {

  // Active corresponding menu
  stent.navbar.activeMenu("home");

  // change Page title
  stent.ui.setPageTitle("Dashboard");

  // Build home object
  stent.home = (function () {

    const loadAsyncCharts = function () {
      stent.widgets.get().forEach(widget => stent.widgets.refresh(widget.guid));
    };

    const bindEvents = function () {

      // Toogle childrens visibility in the
      // Campaigns chart
      $("body")
        .off("click", ".toggle-children-visibility")
        .on("click", ".toggle-children-visibility", function () {

          let tr = $(this).closest("tr");
          let trNext = tr.nextAll();

          if ($(this).hasClass("fe-chevron-down")) {

            // Close Childrens
            $(this).removeClass("fe-chevron-down").addClass("fe-chevron-right");

            if (tr.hasClass("lv-0")) {
              for (let i=0; i <trNext.length; i++) {
                if ($(trNext[i]).hasClass("lv-0")) {
                  break;
                } else {
                  $(trNext[i]).removeClass("d-flex").addClass("d-none");
                }
              }
            } else {
              for (let i=0; i <trNext.length; i++) {
                if ($(trNext[i]).hasClass("lv-0") || $(trNext[i]).hasClass("lv-1")) {
                  break;
                } else {
                  $(trNext[i]).removeClass("d-flex").addClass("d-none");
                }
              }
            }

          } else {

            // Open children

            $(this).removeClass("fe-chevron-right").addClass("fe-chevron-down");

            if (tr.hasClass("lv-0")) {
              for (let i=0; i <trNext.length; i++) {
                if ($(trNext[i]).hasClass("lv-0")) {
                  break;
                } else {
                  $(trNext[i]).addClass("d-flex").removeClass("d-none");
                }
              }
            } else {
              for (let i=0; i <trNext.length; i++) {
                if ($(trNext[i]).hasClass("lv-0") || $(trNext[i]).hasClass("lv-1")) {
                  break;
                } else {
                  $(trNext[i]).addClass("d-flex").removeClass("d-none");
                }
              }
            }
          }

        });
    };

    const init = function () {

      loadAsyncCharts();
      bindEvents();

    };

    init();

    return {};

  })();

});