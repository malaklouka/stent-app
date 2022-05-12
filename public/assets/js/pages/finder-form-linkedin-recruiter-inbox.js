"use strict";


stent.finders.linkedInReruiterInbox = (function () {

  let _entity = $("#finder-output").val();
  let _members = null;
  let _finder = null;
  let _isReadOnly = false;

  const fillForm = function () {

    if (_finder) {

      if (_finder.name && _finder.name !== "" && stent.finders.form.isInEdition()) {
        $("#finder-name").val(_finder.name);
      }

      // check if the identity found in the campaign object is present in the list of potentials sender
      // It's possible to found found the user, because he's deactivated or removed =>
      // Push it manually in the list
      if (stent.finders.form.isInEdition()) {
        if ($("#finder-member option[value='" + _finder.identity.identityKey + "']").length === 0) {
          _isReadOnly = true;
          let option = new Option(_finder.identity.firstName + " " + _finder.identity.lastName, _finder.identity.identityKey);
          $("#finder-member").append($(option));
        }
      }

      // finder-member
      if (stent.finders.form.isInEdition()) {
        if (_finder.identity.identityKey) {
          $("#finder-member option[value='" + _finder.identity.identityKey + "']").prop("selected", true);
          $("#finder-member").attr("readonly", "readonly").attr("disabled", "disabled");
          $("#finder-member").trigger("change");
        }
      }

      // Target Management
      stent.finders.form.target.fill();

      // finder-status
      stent.finders.form.onChangeStatus(_finder.status);

      // email lookup
      if (typeof _finder.emailLookup !== "undefined" && _finder.emailLookup !== null && _finder.emailLookup === true) {
        $("#emailLookup").prop("checked", "checked");
      }

      // Initialiyze CRONs editors
      if (_finder.schedule &&
        _finder.schedule.timezone &&
        _finder.schedule.slots && _finder.schedule.slots.length > 0
      ) {
        stent.finders.form.initCrons({
          id: "finder-schedule",
          defaultDuration: stent.finders.form.getDefaultDuration(),
          jElem: $("#finder-schedule-wrapper"),
          timezone: _finder.schedule.timezone,
          data: _finder.schedule && _finder.schedule.slots && _finder.schedule.slots.length > 0 ? _finder.schedule.slots : []
        });
      }

      // batch size
      if (_finder.schedule && _finder.schedule.batch) {
        $("#display-cohort-size").text(_finder.schedule.batch);
        $("#cohort-size").val(_finder.schedule.batch);
      }

    }

  };

  const readOnlyForm = function () {
    $("#finder-name").prop("disabled", true);
    $("#finder-member").parent().append("<div class=\"alert alert-warning mt-3\" role=\"alert\">The owner is no longer member of this workspace, no change are allowed.</div>");
    $("#finder-miners").prop("disabled", true);
    $("#finder-status-wrapper").closest(".card").css("background-color", "#fbf9fd");
    $("#finder-status-wrapper").closest(".form-group").find("*").css("pointer-events", "none");
    $("#finder-status-wrapper").closest(".form-group").find("label").css("opacity", 0.5);
    stent.cronEditor.readOnly("finder-schedule");
    $("#cohort-size").prop("disabled", true);
    $("#finder-save").remove();
    $("#emailLookup").prop("disabled", true);
    stent.finders.form.target.readOnly();
  };

  const checkForm = function () {

    let formHasError = false;
    let errors = [];

    stent.finders.form.cleanErrors();

    const errorDOM = function (message) {
      return (
        "<div class=\"invalid-feedback\" style=\"display: block;\">" +
        (message ? message : "Please fill in this field.") +
        "</div>"
      );
    };

    const toastUserForErrors = function () {
      stent.toast.danger("The form has errors, please correct them to save your data.");
    };

    const scrollToError = function () {
      $("html, body").animate(
        {
          scrollTop: $(".is-invalid").offset().top - 40
        },
        250
      );
    };

    const displayErrorsInForm = function () {
      for (var i = 0; i < errors.length; i++) {
        let error = errors[i];
        $(error.id ? "#" + error.id : error.selector)
          .addClass("is-invalid")
          .parent()
          .append(errorDOM(error.message));
      }
    };

    // Check finder-name
    if ($.trim($("#finder-name").val()) === "") {
      errors.push({
        id: "finder-name",
        message: "Please set the finder name."
      });
      formHasError = true;
    }


    // Check finder-member
    if ($.trim($("#finder-member").val()) === "") {
      errors.push({
        selector: "#finder-member + span",
        message: "Please choose a member."
      });
      formHasError = true;
    }

    let cronEditor = stent.cronEditor.get("finder-schedule");

    // campaign-timezone
    if (cronEditor.timezone === "") {
      errors.push({
        id: "finder-schedule-timezone",
        message: "Please choose a timezone."
      });
      formHasError = true;
    }

    // Check if there at least on CRON defined
    if (cronEditor.crons.length === 0) {
      errors.push({
        id: "finder-schedule .campaign-add-schedule",
        message: "Please add at least a timer slot."
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

    stent.loader.show("#finder-form");

    let _identityId = $("#finder-member").val();

    let cronEditor = stent.cronEditor.get("finder-schedule");
    let timezone = cronEditor.timezone;
    let slots = cronEditor.crons.map(function (item) {
      return {
        cron: item.cron,
        duration: item.duration
      };
    });

    let finder = {
      channel: "linkedin",
      version: 4,
      emailLookup: $("#emailLookup").is(":checked"),
      status: $("[name='finder-status']:checked").val(),
      identity: { identityKey: _identityId },
      name: $.trim($("#finder-name").val()),
      entity: _entity,
      output: {
        type: "segment"
      },
      provisioner: {
        type: $("#finder-source").val()
      },
      schedule: {
        batch: parseInt($("#cohort-size").val(), 10),
        timezone: timezone,
        slots: slots
      }
    };

    // TARGET
    finder.target = stent.finders.form.target.getTarget();

    // PERSONA
    let persona = stent.finders.form.target.getPersona();
    if (persona) {
      finder.provisioner.persona = persona;
    }

    let sendFinder;

    if (stent.finders.form.isInEdition()) {
      sendFinder = await stent.finders.form.putFinder(finder);
    } else if (stent.finders.form.isInDuplication()) {
      sendFinder = await stent.finders.form.postFinder(finder);
    } else {
      sendFinder = await stent.finders.form.postFinder(finder);
    }

    if (sendFinder !== null) {
      stent.ui.pushState("finder-list", false, "finder-list");
      stent.ui.load({ fileToLoad: "finder-list" });
      stent.loader.hide();
    } else {
      stent.loader.hide();
    }

  };

  const bindEvents = function () {

    $("#finder-save")
      .off("click")
      .on("click", function () {
        if (checkForm() && stent.finders.form.target.checkForm()) {
          save();
        }
      });

    $("[name='finder-status']")
      .off("change")
      .on("change", function () {
        stent.finders.form.onChangeStatus($(this).val());
      });

  };

  const init = async function () {
    bindEvents();

    _members = await stent.finders.form.getMembers();
    if (_members === null) {
      stent.finders.form.exitOnError();
      return;
    }

    stent.finders.form.populateMembersSelect(_members);

    stent.finders.form.target.init(_entity);

    // ############################ //
    // EDITION MODE
    // ############################ //

    if (stent.finders.form.isInEdition() || stent.finders.form.isInDuplication()) {

      _finder = stent.finders.form.getCurrentItem();

      fillForm();

      if (_isReadOnly) {
        readOnlyForm();
      }

    } else {

      // CRON Schedule
      stent.finders.form.initCrons({
        id: "finder-schedule",
        defaultDuration: stent.finders.form.getDefaultDuration(),
        jElem: $("#finder-schedule-wrapper"),
        timezone: stent.finders.form.getDefaultTimezone(),
        data: stent.finders.form.getDefaultSchedule().slots
      });

    }

    stent.loader.hide();
  };

  init();


  return {
    get: function () {
      return {};
    }
  };

})();

