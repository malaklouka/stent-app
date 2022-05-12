"use strict";

stent.finders.github = (function () {
  let _members = null;
  let _finder = null;
  let _audience = null;
  let _apiKey = null;
  let _restartFinder = false;
  let _entity = $("#finder-output").val();
  let _initialValues = {
    keywords: null,
    limit: null,
  };
  let _isReadOnly = false;

  const readOnlyForm = function () {
    $("#finder-name").prop("disabled", true);
    $("#finder-member").parent().append("<div class=\"alert alert-warning mt-3\" role=\"alert\">The owner is no longer member of this workspace, no change are allowed.</div>");
    $("#finder-miners").prop("disabled", true);
    $("#finder-query").prop("disabled", true);
    $("#finder-sort").prop("disabled", true);
    $("#finder-retrieve-count").prop("disabled", true);
    $("#finder-audience-size-wrapper .card").css("background-color", "#fbf9fd");
    $("#finder-status-wrapper").closest(".card").css("background-color", "#fbf9fd");
    $("#finder-status-wrapper").closest(".form-group").find("*").css("pointer-events", "none");
    $("#finder-status-wrapper").closest(".form-group").find("label").css("opacity", 0.5);
    stent.cronEditor.readOnly("finder-schedule");
    $("#cohort-size").prop("disabled", true);
    $("#finder-save").remove();
    $("#emailLookup").prop("disabled", true);
    stent.finders.form.target.readOnly();
  };

  const getKey = async function () {

    /*eslint-disable */
    let query = `
      query {
        workspaceContext {
          appById(id: "14048331") {
            enabled
          }
        }
      }
    `;
    /*eslint-enable */

    let result = await stent.ajax.getApiAsync(query, "POST");

    if (
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.appById &&
      result.message.data.workspaceContext.appById.enabled &&
      result.message.data.workspaceContext.appById.enabled === true) {
      return true;
    } else {
      stent.toast.danger("Error when trying to fetch your Github personnal Key.");
      return null;
    }
  };

  const getAudienceCount = async function (search) {
    let fetchAudienceCount = await stent.ajax.getRestAsync(
      "/github/tenants/" + stent.tenant.key + "/count?search=" + search
    );

    if (fetchAudienceCount && fetchAudienceCount.ok && fetchAudienceCount.message) {
      return fetchAudienceCount.message;
    } else {
      stent.toast.danger("Error when trying to fetch the audience count.");
      return null;
    }
  };

  const updateAudience = async function () {
    stent.loader.show("#finder-form");

    let search = encodeURIComponent($.trim($("#finder-query").val()));

    _audience = await getAudienceCount(search);
    let displayCount = "-";
    stent.loader.hide();

    if (_audience !== null) {
      displayCount = _audience.toLocaleString(stent.locale) + " contact" + (_audience > 1 ? "s" : "");
    }

    $("#finder-audience-size").text(displayCount);
  };

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

      if (stent.finders.form.isInEdition()) {
        // finder-member
        if (_finder.identity.identityKey) {
          $("#finder-member option[value='" + _finder.identity.identityKey + "']").prop("selected", true);
          if (stent.finders.form.isInEdition()) {
            $("#finder-member").attr("readonly", "readonly").attr("disabled", "disabled");
          }
          $("#finder-member").trigger("change");
        }
      }

      // Target Management
      stent.finders.form.target.fill();

      // finder-miners
      if (_finder.identity.miners && Array.isArray(_finder.identity.miners) && _finder.identity.miners.length > 0) {
        for (let i = 0; i < _finder.identity.miners.length; i++) {
          $("#finder-miners option[value='" + _finder.identity.miners[i] + "']").prop("selected", true);
        }
        $("#finder-miners").trigger("change");
      }

      // query
      if (
        _finder.provisioner &&
        _finder.provisioner.query &&
        _finder.provisioner.query.keywords &&
        _finder.provisioner.query.keywords !== ""
      ) {
        $("#finder-query").val(_finder.provisioner.query.keywords);
        _initialValues.keywords = _finder.provisioner.query.keywords;
      }

      // sort
      if (
        _finder.provisioner &&
        _finder.provisioner.query &&
        _finder.provisioner.query.sort &&
        _finder.provisioner.query.sort !== ""
      ) {
        $("#finder-sort option[value='" + _finder.provisioner.query.sort + "']").prop("selected", true);
      }

      // limit
      if (_finder.provisioner && _finder.provisioner.limit >= 0) {
        $("#finder-retrieve-count option[value='" + _finder.provisioner.limit + "']").prop("selected", true);
        _initialValues.limit = _finder.provisioner.limit;
      }

      updateAudience();

      // finder-status
      stent.finders.form.onChangeStatus(_finder.status);

      // email lookup
      if (typeof _finder.emailLookup !== "undefined" && _finder.emailLookup !== null && _finder.emailLookup === true) {
        $("#emailLookup").prop("checked", "checked");
      }

      // Initialiyze CRONs editors
      if (
        _finder.schedule &&
        _finder.schedule.timezone &&
        _finder.schedule.slots &&
        _finder.schedule.slots.length > 0
      ) {
        stent.finders.form.initCrons({
          id: "finder-schedule",
          defaultDuration: stent.finders.form.getDefaultDuration(),
          jElem: $("#finder-schedule-wrapper"),
          timezone: _finder.schedule.timezone,
          data:
            _finder.schedule && _finder.schedule.slots && _finder.schedule.slots.length > 0
              ? _finder.schedule.slots
              : [],
        });
      }

      // batch size
      if (_finder.schedule && _finder.schedule.batch) {
        $("#display-cohort-size").text(_finder.schedule.batch);
        $("#cohort-size").val(_finder.schedule.batch);
      }
    }
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
          scrollTop: $(".is-invalid").offset().top - 40,
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
        message: "Please set the finder name.",
      });
      formHasError = true;
    }

    // Check finder-member
    if ($.trim($("#finder-member").val()) === "") {
      errors.push({
        selector: "#finder-member + span",
        message: "Please choose a member.",
      });
      formHasError = true;
    }

    // Check finder-query
    if ($.trim($("#finder-query").val()) === "") {
      errors.push({
        id: "finder-query",
        message: "Please set at least one keyword.",
      });
      formHasError = true;
    }

    let cronEditor = stent.cronEditor.get("finder-schedule");

    // campaign-timezone
    if (cronEditor.timezone === "") {
      errors.push({
        id: "finder-schedule-timezone",
        message: "Please choose a timezone.",
      });
      formHasError = true;
    }

    // Check if there at least on CRON defined
    if (cronEditor.crons.length === 0) {
      errors.push({
        id: "finder-schedule .campaign-add-schedule",
        message: "Please add at least a timer slot.",
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

  const save = function () {

    // Creation mode
    if (stent.finders.form.isInEdition() === false || stent.finders.form.isInDuplication() === true) {
      doSave();
    } else if (
      stent.finders.form.isInEdition() === true && (
        $.trim($("#finder-query").val()) !== _initialValues.keywords ||
        parseInt($.trim($("#finder-retrieve-count").val()), 10) !== _initialValues.limit)
    ) {

      // check if the keywords and the limit values have changed
      let restartFinder = confirm(
        "You've made some modifications on your finder. Do you want to restart the GitHub ambassadors capture ?"
      );
      if (restartFinder === true) {
        _restartFinder = true;
        doSave();
        // eslint-disable-next-line brace-style
      }

      // Cancel update finder after modifications
      else {
        stent.ui.pushState("finder-list", false, "finder-list");
        stent.ui.load({ fileToLoad: "finder-list" });
      }

      // eslint-disable-next-line brace-style
    }

    // Cancel update finder after modifications
    else {
      doSave();
    }
  };

  const doSave = async function () {

    stent.loader.show("#finder-form");

    let _identityId = $("#finder-member").val();

    let cronEditor = stent.cronEditor.get("finder-schedule");
    let timezone = cronEditor.timezone;
    let slots = cronEditor.crons.map(function (item) {
      return {
        cron: item.cron,
        duration: item.duration,
      };
    });

    let finder = {
      channel: "linkedin",
      version: 4,
      emailLookup: $("#emailLookup").is(":checked"),
      status: $("[name='finder-status']:checked").val(),
      size: _audience ? _audience : 0,
      identity: {
        identityKey: _identityId,
        miners: $("#finder-miners").val(),
      },

      name: $.trim($("#finder-name").val()),
      entity: _entity,
      output: {
        type: "segment",
      },

      provisioner: {
        type: "github",
        limit: parseInt($("#finder-retrieve-count").val(), 10),
        query: {
          keywords: $("#finder-query").val(),
          sort: $("#finder-sort").val(),
        },
      },

      schedule: {
        batch: parseInt($("#cohort-size").val(), 10),
        timezone: timezone,
        slots: slots,
      },
    };

    // TARGET
    finder.target = stent.finders.form.target.getTarget();

    // PERSONA
    let persona = stent.finders.form.target.getPersona();
    if (persona) {
      finder.provisioner.persona = persona;
    }

    // RESTART FINDER
    if (_restartFinder) {
      finder.provisioner.capture = "processing";
      finder.provisioner.ignored = 0;
      finder.provisioner.retrieved = 0;
    }

    stent.utils.log(finder);
    stent.loader.hide();

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

    $("#finder-query")
      .off("blur")
      .on("blur", function () {
        updateAudience();
      });

    $("#finder-query")
      .off("keydown")
      .on("keydown", function (e) {
        if (e.keyCode === 13 || e.key === "Enter") {
          $(this).trigger("blur");
        }
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
    stent.finders.form.populateMinersSelect(_members);

    // Get Github User Key
    _apiKey = await getKey();

    if (_apiKey === null) {
      stent.loader.hide();
      $("#finder-form-wrapper").html(`
        <div class="alert alert-light" role="alert">
          <strong>Error!</strong> 
          <a href="" onclick="window.location.reload();">Please try again</a>, 
          or go to the 
          <a href="apps" class="ui-link">Apps</a> page to set the Github personnal key.
        </div>`);
      return;
    }

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
        data: stent.finders.form.getDefaultSchedule().slots,
      });

      // Set initial values if creation mode
      $("#finder-sort option[value='best_match']").prop("selected", true);
      $("#finder-retrieve-count option[value='500']").prop("selected", true);
    }

    stent.loader.hide();
  };

  init();

  return {
    get: function () {
      return {};
    },
  };
})();
