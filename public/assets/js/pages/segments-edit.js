"use strict";

stent.requireJS(["ace"], function() {
  let _aceEditors = {
    javascript: null,
    aqlMatches: null,
    aqlMatch: null
  };
  let _segmentId;

  const loadFormData = function() {
    stent.ajax.getRest("/tenants/" + stent.tenant.key + "/members", populateSenderSelect);
  };

  const populateSenderSelect = function(items) {
    $("#segment-owner").empty();

    let option = new Option("Please choose an owner", "");
    $("#segment-owner").append($(option));

    items.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
    items.forEach(function(item) {
      let option = new Option(item.firstName + " " + item.lastName, "identities/" + item.id);
      $("#segment-owner").append($(option));
    });
    loadSegmentDetail();
  };

  const loadSegmentDetail = function() {
    let params = new URLSearchParams(location.search);
    let segmentId = params.get("id");

    if (segmentId == null) {
      stent.loader.hide();
      $("#segment-form-loader").hide();
      $("#segment-form").toggleClass("d-none");
      // Init ACE editor
      initACE("");
      return;
    }
    stent.navbar.activeMenu();
    stent.ajax.getRest("/tenants/" + stent.tenant.key + "/segments/" + segmentId, buildFormData);
  };

  const initACE = function(initialContent) {

    let JavaScriptMode = ace.require("ace/mode/javascript").Mode;
    let AQLMode = ace.require("ace/mode/aql").Mode;

    _aceEditors.javascript = ace.edit("segment-query-javascript");
    _aceEditors.javascript.setTheme("ace/theme/tomorrow");
    _aceEditors.javascript.session.setMode(new JavaScriptMode());

    _aceEditors.aqlMatches = ace.edit("segment-query-aql-matches");
    _aceEditors.aqlMatches.setTheme("ace/theme/tomorrow");
    _aceEditors.aqlMatches.session.setMode(new AQLMode());

    _aceEditors.aqlMatch = ace.edit("segment-query-aql-match");
    _aceEditors.aqlMatch.setTheme("ace/theme/tomorrow");
    _aceEditors.aqlMatch.session.setMode(new AQLMode());

    // Set inital content of the ACE editors on edit mode
    if (initialContent.javascript || initialContent.aqlMatches || initialContent.aqlMatch) {
      if (initialContent.javascript) {
        _aceEditors.javascript.setValue(initialContent.javascript, 1);
      }
      if (initialContent.aqlMatches && initialContent.aqlMatch) {
        _aceEditors.aqlMatches.setValue(initialContent.aqlMatches, 1);
        _aceEditors.aqlMatch.setValue(initialContent.aqlMatch, 1);
      }
    }

  };

  const getACEeditorContent = function(editorKey) {
    if (!editorKey) {
      return null;
    }
    return _aceEditors[editorKey].getValue();
  };

  const buildFormData = function(item) {

    stent.utils.log(item);

    if (item) {
      $(".main-content h1").text("Edit a segment");
      _segmentId = item._key;
      var itemIdentity = item.ownerId
        ? item.ownerId.indexOf("|") > 0
          ? item.ownerId.split("|")[1]
          : item.ownerId
        : "";
      $("#segment-form").toggleClass("d-none");
      $("#segment-name").val(item.name);
      $("#segment-description").val(item.description);
      $("#segment-scope option[value='" + item.scope + "']").prop("selected", true);
      if (item.scope == "identity") {
        $("#segment-owner option[value='" + itemIdentity + "']").prop("selected", true);
        $("#segment-owner").prop("disabled", "disabled");
        $("#segment-owner-group").removeClass("d-none");

      }
      $("[name='segment-status'][value='" + item.status + "']")
        .attr("checked", "checked")
        .click();
    } else {
      $("#no-segment").toggleClass("d-none");
    }
    $("#segment-form-loader").hide();

    if (!item.engine || item.engine === "javascript") {
      $("#segment-engine option[value='javascript']").prop("selected", true);
      $("#segment-engine").change();
      initACE(
        {
          javascript: item.query
        }
      );
    } else if (item.engine === "aql") {
      $("#segment-engine option[value='aql']").prop("selected", true);
      $("#segment-engine").change();
      initACE(
        {
          aqlMatches: item.query.matches,
          aqlMatch: item.query.match
        }
      );
    }
  };

  const bindEvents = function() {
    $("#segment-scope")
      .off("change")
      .on("change", function() {
        if ($(this).val() == "identity") {
          $("#segment-owner-group").removeClass("d-none");
        } else {
          $("#segment-owner-group").addClass("d-none");
          $("#segment-owner").val("");
        }
      });

    $("#segment-save")
      .off("click")
      .on("click", function() {
        if (checkForm()) {
          save();
        }
      });

    $("[name='segment-status']")
      .off("change")
      .on("change", function() {
        $("[name='segment-status']").each(function() {
          $(this)
            .closest(".btn")
            .removeClass("btn-success btn-warning btn-danger")
            .addClass("btn-white");
        });
        let className;
        switch ($(this).val()) {
          case "active":
            className = "btn-success";
            break;
          case "pause":
            className = "btn-warning";
            break;
          case "stop":
            className = "btn-danger";
            break;
        }

        $(this)
          .closest(".btn")
          .removeClass("btn-white")
          .addClass(className);
      });

    $("#segment-engine")
      .off("change")
      .on("change", function() {
        if ($(this).val() !== "") {
          let queryType = $(this).val();
          if (queryType === "javascript" || queryType === "aql") {
            $(".segment-query-wrapper").addClass("d-none");
            $("#segment-query-" + queryType + "-wrapper").removeClass("d-none");
          }
        }
      });

  };

  const saveSegmentCallback = function() {
    stent.loader.hide();
    stent.ui.pushState("segments-list", false, "segments-list");
    stent.ui.load({ fileToLoad: "segments-list" });
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
    if ($.trim($("#segment-name").val()) === "") {
      errors.push({
        id: "segment-name",
        message: "Please set the segment name."
      });
      formHasError = true;
    }

    // segment-scope
    if ($.trim($("#segment-scope").val()) === "") {
      errors.push({
        id: "segment-scope",
        message: "Please set the segment scope."
      });
      formHasError = true;
    }

    // segment-owner
    if ($("#segment-scope").val() === "identity") {
      if ($.trim($("#segment-owner").val()) === "") {
        errors.push({
          id: "segment-owner",
          message: "Please set the segment owner."
        });
        formHasError = true;
      }
    }

    // segment-engine
    if ($("#segment-engine").val() === "") {
      errors.push({
        id: "segment-engine",
        message: "Please set the query engine."
      });
      formHasError = true;
    }

    // segment-query
    if ($("#segment-engine").val() !== "") {
      if ($("#segment-engine").val() === "javascript") {
        if ($.trim(getACEeditorContent("javascript")) === "") {
          errors.push({
            id: "segment-query-javascript",
            message: "Please set the javascript query."
          });
          formHasError = true;
        }
      } else if ($("#segment-engine").val() === "aql") {
        if ($.trim(getACEeditorContent("aqlMatches")) === "") {
          errors.push({
            id: "segment-query-aql-matches",
            message: "Please set the AQL query."
          });
          formHasError = true;
        }
        if ($.trim(getACEeditorContent("aqlMatch")) === "") {
          errors.push({
            id: "segment-query-aql-match",
            message: "Please set the AQL query."
          });
          formHasError = true;
        }
      }
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

  const save = function() {

    let engine = $("#segment-engine").val();
    let query = engine === "javascript" ?
      getACEeditorContent("javascript") :
      {
        matches: getACEeditorContent("aqlMatches"),
        match: getACEeditorContent("aqlMatch"),
      };

    let segment = {
      name: $("#segment-name").val(),
      description: $("#segment-description").val(),
      scope: $("#segment-scope").val(),
      ownerId: $("#segment-owner").val(),
      engine: engine,
      query: query,
      status: $("[name='segment-status']:checked").val()
    };

    stent.utils.log(segment);

    stent.loader.show(".main-content");
    let segmentUrl = "/tenants/" + stent.tenant.key + "/segments";
    if (_segmentId) {
      stent.ajax.putRest(segmentUrl + "/" + _segmentId, segment, saveSegmentCallback);
    } else {
      stent.ajax.postRest(segmentUrl, segment, saveSegmentCallback);
    }

  };

  const init = function() {
    // master loader
    stent.loader.show("#segment-form-loader");

    // Active corresponding menu
    stent.navbar.activeMenu("segments-edit");

    // change Page title
    stent.ui.setPageTitle("Segments edit");

    //bind events
    bindEvents();

    // Get data
    loadFormData();
  };

  init();
});
