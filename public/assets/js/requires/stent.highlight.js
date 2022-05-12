stent.highlight = (function() {

  var $highlight;

  var init = function () {

    $highlight = $(".highlight");

    $highlight.each(function(i, block) {
      build(block);
    });

  };


  var build = function (block) {
    hljs.highlightBlock(block);
  };

  return {
    init: init
  };

})();