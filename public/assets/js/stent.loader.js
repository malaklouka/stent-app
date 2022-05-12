stent.loader = (function() {

  var show = function(elem, zIndex) {

    // The elem param should be a jQuery object, but if the user
    // gives a string, we transform the string into a jQuery object.
    var _elem = (typeof elem === "string") ? $(elem) : elem;

    var _$elem = _elem ? _elem : $(".main-content");

    _$elem.append(DOM(zIndex));
  };

  var DOM = function (zIndex) {
    /* eslint-disable */
    return `
    <div class="ui-loader" ${zIndex ? `style="z-index:${zIndex};"` : ""}>
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>`;
    /* eslint-enable */
  };

  var hideAll = function() {
    $(".ui-loader").remove();
  };

  var hide = function(elem) {

    var _elem = (typeof elem === "string") ? $(elem) : elem;

    if (!_elem) {
      hideAll();
    } else {
      _elem.find(".ui-loader").remove();
    }
  };

  return {
    show,
    hide
  };
})();
