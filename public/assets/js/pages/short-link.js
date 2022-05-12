"use strict";

stent.shortLink = (function () {

  let shortLinkDomain = null;
  let trackingID = null;

  const checkShortLink = async function () {

    stent.loader.show(".main-content");

    // TODO: Load data from server
    await new Promise(resolve => setTimeout(resolve, 2000));

    let isValid = $("#short-link-domain").val() === "s.stent.io";

    if (isValid) {
      $("#short-link-domain-is-valid").removeClass("d-none");
      $("#short-link-domain-is-invalid").addClass("d-none");
    } else {
      $("#short-link-domain-is-invalid").removeClass("d-none");
      $("#short-link-domain-is-valid").addClass("d-none");
    }

    stent.loader.hide();

  };

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
      stent.toast.danger("The form has errors, please correct them to save your data.");
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

    // Check segment-name
    if ($.trim($("#short-link-domain").val()) !== "" && $("#short-link-domain-is-invalid").is(":visible")) {
      errors.push({
        id: "short-link-domain",
        message: "Please set valid domain."
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

  const save = async function () {

    stent.loader.show(".main-content");
    // TODO: Send data from server
    await new Promise(resolve => setTimeout(resolve, 2000));
    stent.loader.hide();

    stent.toast.success("Your modifications has been saved.");

    // TODO, change this when it's available server side
    if ($.trim($("#short-link-domain").val()) !== "" && $("#short-link-domain-is-valid").is(":visible")) {
      $("#short-link-domain").attr("readonly", "readonly").attr("disabled", "disabled");
      $("hr").addClass("d-none");
      $("#short-link-save").addClass("d-none");
    }

  };

  const bindEvents = function () {

    $("#short-link-domain")
      .off("keydown")
      .on("keydown", function (e) {
        if (e.keyCode === 13) {
          $(this).blur();
        }
      });

    $("#short-link-domain")
      .off("focus")
      .on("focus", function () {
        $("#short-link-domain-is-valid").addClass("d-none");
        $("#short-link-domain-is-invalid").addClass("d-none");
        cleanErrors();
      });

    $("#short-link-domain")
      .off("blur")
      .on("blur", function () {
        let shortLink = $.trim($(this).val());

        $("#short-link-domain-is-valid").addClass("d-none");
        $("#short-link-domain-is-invalid").addClass("d-none");

        if (shortLink !== "") {
          checkShortLink(shortLink);
        }

      });

    $("#short-link-save")
      .off("click")
      .on("click", function() {
        if (checkForm()) {
          save();
        }
      });

  };

  const init = async function() {

    stent.loader.show(".main-content");
    stent.navbar.activeMenu("short-link");

    // TODO: Load data from server
    await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec

    shortLinkDomain = ""; //"s.stent.io";
    trackingID = "STN-XXXXXX-YYYYY";

    // TODO, change this when it's available server side
    $("#short-link-domain").val(shortLinkDomain);

    if (shortLinkDomain !== "") {
      $("#short-link-domain").attr("readonly", "readonly").attr("disabled", "disabled");
      $("#short-link-domain-is-valid").removeClass("d-none");
    } else {
      $("hr").removeClass("d-none");
      $("#short-link-save").removeClass("d-none");
    }

    $("#tracking-id").val(trackingID);

    stent.loader.hide();

    //bind events
    bindEvents();

  };

  init();

  return {};

})() ;
