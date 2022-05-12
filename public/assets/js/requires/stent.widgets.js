stent.widgets = (function() {

  var widgets;

  var getWidgetByGuid = function (guid) {

    var out = null;

    if (!guid) return out;

    widgets.forEach(function(item) {
      if (item.guid === guid) {
        out = item;
      }
    });

    return out;

  };

  var getWidgetByName = function (name) {

    var out = null;

    if (!name) return out;

    widgets.forEach(function(item) {
      if (item.name === name) {
        out = item;
      }
    });

    return out;

  };

  var getWidgetsListToLoadFromDOM = function () {

    var $elems = $(".main-content .stent-widget");
    var out = [];

    if ($elems.length === 0) return out;

    $elems.each(function (i, elem) {

      let state = "notloaded";
      if (typeof $(elem).attr("data-manual-load") !== "undefined" && $(elem).attr("data-manual-load") !== "false") {
        state = "manual";
      }

      let guid = stent.utils.guid();

      out.push(
        {
          jElem: $(elem),
          name: $(elem).attr("data-name"),
          state: state,
          guid: stent.utils.guid()
        }
      );

      $(elem).attr("data-widget-guid", guid);

    });

    return out;

  };

  var loadWidgets = function () {
    widgets.forEach(function (widget) {
      if (widget.state === "notloaded") {
        loadWidget(widget);
      }
    });
  };

  var loaderDOM = function () {
    return `
      <div class="card">
        <div class="card-body">
          <div class="row text-center">
            <div class="col">
              <div class="spinner-grow spinner-grow-sm" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  var loadWidget = function (widget) {

    widget.state = "loading";

    widget.jElem.html(loaderDOM());

    $.get({
      url: "/widgets/" + widget.name + ".html"
    })
      .then(
        function(data) {
          widget.state = "loaded";
          widget.jElem.html(data);
        },
        function (err) {
          widget.state = "error";
          widget.jElem.html(`
          <div class="alert alert-warning fade show text-center" role="alert">
            <strong>Holy guacamole!</strong> There was an error <strong>${err.status}</strong> when trying to load the widget <strong>${widget.name}</strong>.
            <div class="mt-2">
              <button type="button" class="btn btn-outline-dark btn-sm stent-reload-widget">Try to reload this widget</button>
            </div>
          </div>
        `);

        }
      );
  };

  var refreshWidget = function (widgetGUID) {

    let widget = getWidgetByGuid(widgetGUID);
    widget.state = "loading";

    widget.jElem.html(loaderDOM());

    $.get({
      url: "/widgets/" + widget.name + ".html"
    })
      .then(
        function(data) {
          widget.state = "loaded";
          widget.jElem.html(data);
        },
        function (err) {
          widget.state = "error";
          widget.jElem.html(`
          <div class="alert alert-warning fade show text-center" role="alert">
            <strong>Holy guacamole!</strong> There was an error <strong>${err.status}</strong> when trying to load the widget <strong>${widget.name}</strong>.
            <div class="mt-2">
              <button type="button" class="btn btn-outline-dark btn-sm stent-reload-widget">Try to reload this widget</button>
            </div>
          </div>
        `);

        }
      );

  };

  var bindEvents = function () {

    // Reload widget button
    $(".main-content")
      .off("click")
      .on("click", ".stent-reload-widget", function () {

        var widgetGuid = $(this).closest(".stent-widget").attr("data-widget-guid");
        var widget = getWidgetByGuid(widgetGuid);

        loadWidget(widget);

      });

  };

  var init = function () {
    widgets = getWidgetsListToLoadFromDOM();
    bindEvents();
    loadWidgets();
  };


  return {
    init,
    get: function() {
      return widgets;
    },
    getByGuid: getWidgetByGuid,
    getByName: getWidgetByName,
    refresh: refreshWidget
  };

})();