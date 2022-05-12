stent.flatpickr = (function() {

  let pickers = {};

  const init = function () {

    let $pickers = $("[data-toggle=\"flatpickr\"]");
    
    if ($pickers.length) {
      $pickers.each(function() {
        buildPicker( $(this) );
      });
    }

  };

  const buildPicker = function ($this) {
    let options = {
      mode: ( $this.data("flatpickr-mode") !== undefined ) ? $this.data("flatpickr-mode") : "single",
      enableTime: ( $this.data("flatpickr-enable-time") === true ) ? true : false,
      minDate: ( $this.data("flatpickr-min-date") !== undefined ) ? $this.data("flatpickr-min-date") : null,
      appendTo: ( $this.data("append") !== undefined ) ? window.document.querySelector($this.data("append")) : null,
      static: ( $this.data("static") !== undefined ) ? $this.data("static") : null
    };

    pickers[$this.attr("id")] = $this.flatpickr(options);
  };


  return {
    init,
    pickers
  };


})();