stent.toast = (function() {

  var open = function (type, options) {

    var _o = {
      type: type ? type : "primary",
      message: typeof options === "string" ? options : (options && options.message) ? options.message : "Your message here...",
      autohide: (options && options.autohide === false) ? false : true,
      autohideDelay: (options && options.autohideDelay) ? options.autohideDelay : 3000,
      guid: "toast_" + stent.utils.guid()
    };

    $("#stent-toast-wrapper").append(`
      <div class="alert alert-${_o.type} alert-dismissible fade show" role="alert" id="${_o.guid}">
        ${_o.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`
    );

    if (_o.autohide) {
      setTimeout(function () {
        if ($("#" + _o.guid).length > 0) {
          $("#" + _o.guid).slideUp(200, function () {
            $(this).remove();
          });
        }
      }, _o.autohideDelay);
    }

  };

  var primary = function (options) {
    open("primary", options);
  };

  var secondary = function (options) {
    open("secondary", options);
  };

  var success = function (options) {
    open("success", options);
  };

  var danger = function (options) {
    open("danger", options);
  };

  var warning = function (options) {
    open("warning", options);
  };

  var info = function (options) {
    open("info", options);
  };

  var light = function (options) {
    open("light", options);
  };

  var dark = function (options) {
    open("light", options);
  };

  var closeAll = function () {
    $("#stent-toast-wrapper").empty();
  };

  var init = function () {
    if ($("#stent-toast-wrapper").length === 0) {
      $(".main-content").after("<div id=\"stent-toast-wrapper\"></div>");
    }
  };

  init();

  return {
    primary,
    secondary,
    success,
    danger,
    warning,
    info,
    light,
    dark,
    closeAll
  };
})();
