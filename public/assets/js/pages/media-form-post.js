"use strict";

(function() {


  let _media = stent.media.form.getMedia();
  let _mediaId = stent.media.form.getMediaId();

  // Initialize form data
  const buildFormData = function(result) {

    if (result && result.errors) {
      $(".alert").html(result.errors[0].message);
      $(".alert").toggleClass("d-none");
      $("#media-form-loader").hide();
      return;
    }

    if (!result) {
      $(".alert").html("<strong>No medium defined or medium does not exist anymore</strong>");
      $(".alert").toggleClass("d-none");
    } else {
      let media = result.data.media.get;
      $("#media-title").val(media.title);
      $("#media-summary").val(media.summary);
    }
  };


  const bindEvents = function() {
    $("#media-save")
      .off("click")
      .on("click", function() {
        if (checkForm()) {
          save();
        }
      });

  };

  const saveMediafeedCallback = function() {
    stent.loader.hide();
    stent.ui.pushState("media-list", false, "media-list");
    stent.ui.load({ fileToLoad: "media-list" });
  };

  /*eslint-disable */
    const save = function() {
      //COPY CODE FROM ARTICLE
    };
    /*eslint-enable */

  const cleanErrors = function() {
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").remove();
  };

  const checkForm = function() {
    let formHasError = false;
    let errors = [];

    cleanErrors();

    const errorDOM = function(message) {
      return (
        "<div class=\"invalid-feedback\" style=\"display: block;\">" +
        (message ? message : "Please fill in this field.") +
        "</div>"
      );
    };

    const toastUserForErrors = function() {
      stent.toast.danger("The form has errors, please correct them to save your media.");
    };

    const scrollToError = function() {
      $("html, body").animate(
        {
          scrollTop: $(".is-invalid").offset().top - 40
        },
        250
      );
    };

    const displayErrorsInForm = function() {
      for (var i = 0; i < errors.length; i++) {
        let error = errors[i];
        $("#" + error.id)
          .addClass("is-invalid")
          .parent()
          .append(errorDOM(error.message));
      }
    };

    // Check media-title
    if ($.trim($("#media-title").val()) === "") {
      errors.push({
        id: "media-title",
        message: "Please set the title."
      });
      formHasError = true;
    }

    // Check media-summary
    if ($.trim($("#media-summary").val()) === "") {
      errors.push({
        id: "media-summary",
        message: "Please set the summary."
      });
      formHasError = true;
    }

    if (formHasError) {
      displayErrorsInForm();
      scrollToError();
      toastUserForErrors();
      return false;
    } else {
      return true;
    }
  };

  const init = function() {
    bindEvents();

    if (_media) {
      buildFormData(_media);
    }
  };

  init();


})();
