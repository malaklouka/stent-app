stent.popover = (function() {

  var $popover;

  var init = function () {

    $popover = $("[data-toggle=\"popover\"]");

    if ( $popover.length ) {
      build();
    }

  };


  var build = function () {
    $popover.popover();
  };

  return {
    init: init
  };

})();