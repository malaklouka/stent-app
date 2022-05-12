stent.dropzone = (function() {

  var $dropzonePreview;

  var init = function () {

    var $dropzone = $("[data-toggle=\"dropzone\"]");
    $dropzonePreview = $(".dz-preview");

    if ( $dropzone.length ) {

      // Set global options
      globalOptions();

      // Init dropzones
      $dropzone.each(function() {
        build( $(this) );
      });
    }

  };

  var globalOptions = function () {
    Dropzone.autoDiscover = false;
  };


  //
  // Methods
  //

  var build = function ($this) {
    var multiple = ( $this.data("dropzone-multiple") !== undefined ) ? true : false;
    var preview = $this.find($dropzonePreview);
    var currentFile = undefined;

    // Init options
    var options = {
      url: $this.data("dropzone-url"),
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: preview.get(0),
      previewTemplate: preview.html(),
      maxFiles: ( !multiple ) ? 1: null,
      acceptedFiles: ( !multiple ) ? "image/*" : null,
      init: function() {
        this.on("addedfile", function(file) {
          if ( !multiple && currentFile) {
            this.removeFile(currentFile);
          }
          currentFile = file;
        });
      }
    };

    // Clear preview html
    preview.html("");

    // Init dropzone
    $this.dropzone(options);
  };

  return {
    init: init
  };

})();