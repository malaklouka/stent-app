"use strict";

stent.finders.recruiter = (function () {

  let _entity = $("#finder-output").val();
  let _members = null;
  let _searches = null;
  let _audience = null;

  const getSearches = async function (identityId) {

    if (identityId === "me") {
      identityId = stent.auth.getUserIdentityKey();
    }

    let fetchSearches = await stent.ajax.getRestAsync("/linkedin/identities/" + identityId + "/recruiter/searches");

    if (fetchSearches && fetchSearches.ok && fetchSearches.message) {
      return fetchSearches.message;
    } else {
      stent.loader.hide();
      stent.toast.danger("Error when trying to fetch the searches. Please try again.");
      return null;
    }

  };


  const getAudienceAnalysis = async function (searchId, projectId, contractId) {

    let identityFromId = $("#finder-retrieve-from").val() === "me" ? stent.auth.getUserIdentityKey() : $("#finder-retrieve-from").val();

    let fetchAudienceAnalysis = await stent.ajax.getRestAsync("/linkedin/identities/" + identityFromId + "/recruiter/searches/" + searchId + "?projectId=" + projectId + "&contractId=" + contractId);

    if (fetchAudienceAnalysis && fetchAudienceAnalysis.ok && fetchAudienceAnalysis.message) {
      return fetchAudienceAnalysis.message;
    } else {
      stent.loader.hide();
      stent.toast.danger("Error when trying to fetch the audience. Please try again.");
      return null;
    }

  };


  const populateFromSelect = function () {

    let options = [{ id: "", text: "" }];

    $("#finder-retrieve-from").html("");

    if (stent.auth.getUserIdentityKey()) {
      options.push({ id: "me", text: "Me" });
    }

    let optionsMembers = _members.map(member => {
      return {
        id: member.id,
        text: member.firstName + " " + member.lastName,
        pictureUrl: member.pictureUrl ? member.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif",
        timezone: member.timezone ? member.timezone : stent.tenant.timezone
      };
    });

    options.push(...optionsMembers);

    $("#finder-retrieve-from").select2(
      {
        data: options,
        placeholder: "Select a member",
        escapeMarkup: stent.select2.memberLayout.escapeMarkup,
        templateResult: stent.select2.memberLayout.templateResult,
        templateSelection: stent.select2.memberLayout.templateSelection
      }
    );

    $("#finder-retrieve-from").on("select2:select", function () {

      let userTimezone = stent.tenant.timezone;

      if (
        $(this).select2("data") &&
        $(this).select2("data").length > 0 &&
        $(this).select2("data")[0].timezone) {
        userTimezone = $(this).select2("data")[0].timezone;
      }

      $("#finder-schedule-timezone option[value='" + userTimezone + "']").prop("selected", true);
    });
  };


  const populateSearchesSelect = function () {

    $("#finder-search").empty();

    let html = "";

    let projects = [];

    const getProject = function (projectName) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].name === projectName) {
          return projects[i];
        }
      }
      return null;
    };

    if (_searches === null || _searches.length === 0) {
      stent.toast.warning("No recruiter search was found for this user. Please choose another user.");
      html = "<option value=\"\">No recruiter search was found for this user. Please choose another user.</option>";
    } else {

      _searches.forEach(function (search) {

        let project = getProject(search.projectName);

        if (project === null) {

          project = {
            name: search.projectName,
            options: []
          };

          projects.push(project);
        }

        project.options.push({
          searchId: search.searchId,
          searchName: search.searchName,
          projectId: search.projectId,
          contractId: search.contractId
        });


      });

      html += "<option value=\"\">Please choose a search</option>";

      projects.forEach(function (project) {
        if (project.options.length > 0) {
          html += `<optgroup label="${project.name}">`;
          project.options.forEach(function (option) {
            html += `<option value="${option.searchId}" data-project-id="${option.projectId}" data-contract-id="${option.contractId}">${option.searchName}</option>`;
          });
          html += "</optgroup>";
        }
      });


    }

    $("#finder-search").html(html);


  };


  const populateAudienceAnalysis = function () {

    $("#finder-audience-size").val("0 contacts");

    if (_audience && typeof _audience.results !== "undefined") {
      let _size = _audience.results;
      $("#finder-audience-size").html(_size.toLocaleString(stent.locale) + " contact" + (_size > 1 ? "s" : ""));
    }

  };


  const toggleSearch = function (bool) {

    let $searchWrapper = $("#finder-search-wrapper");

    if (bool === true) {
      $searchWrapper.removeClass("finder-wrapper-disabled");
    } else if (bool === false) {
      $searchWrapper.addClass("finder-wrapper-disabled");
    } else {
      $searchWrapper.toggleClass("finder-wrapper-disabled");
    }

  };


  const resetConfiguration = function () {

    _audience = null;

    stent.finders.form.cleanErrors();

    $("#finder-audience-size").text("0 contact");
    $("#finder-audience-size-wrapper").removeClass("finder-wrapper-disabled");

    stent.finders.form.onChangeStatus("active");

  };


  const resetAudience = function () {

    _audience = null;

    $("#finder-audience-size").text("0 contact");
    $("#finder-audience-size-wrapper").addClass("finder-wrapper-disabled");

  };


  const onChangeFrom = async function (identityId) {

    stent.finders.form.cleanErrors();

    stent.loader.show("#finder-form");

    resetAudience();

    _searches = await getSearches(identityId);

    populateSearchesSelect();
    toggleSearch(true);

    resetConfiguration();
    toggleConfiguration(false);

    stent.loader.hide();
  };


  const onChangeSearch = async function (searchId, projectId, contractId) {

    stent.finders.form.cleanErrors();

    stent.loader.show("#finder-form");
    resetConfiguration();

    if (searchId) {

      _audience = await getAudienceAnalysis(searchId, projectId, contractId);
      populateAudienceAnalysis();
      toggleConfiguration(true);

    } else {
      toggleConfiguration(false);
    }

    stent.loader.hide();
  };


  const toggleConfiguration = function (bool) {

    let $searchConfigurationWrapper = $("#finder-configuration-wrapper");

    if (bool === true) {
      $searchConfigurationWrapper.removeClass("finder-wrapper-disabled");
    } else if (bool === false) {
      $searchConfigurationWrapper.addClass("finder-wrapper-disabled");
    } else {
      $searchConfigurationWrapper.toggleClass("finder-wrapper-disabled");
    }

  };


  const bindEvents = function () {

    $("#finder-retrieve-from")
      .off("change")
      .on("change", function () {
        let identityId = $(this).val();
        onChangeFrom(identityId);
        toggleAudienceSize(true);
      });

    $("#finder-search")
      .off("change")
      .on("change", function () {
        let searchId = $(this).val();
        let projectId = $(this).find("option:selected").attr("data-project-id");
        let contractId = $(this).find("option:selected").attr("data-contract-id");

        onChangeSearch(searchId, projectId, contractId);
        toggleAudienceSize(true);
      });

    $("[name='finder-status']")
      .off("change")
      .on("change", function () {
        stent.finders.form.onChangeStatus($(this).val());
      });

    $("#finder-save")
      .off("click")
      .on("click", function () {
        if (checkForm() && stent.finders.form.target.checkForm()) {
          save();
        }
      });


  };


  const toggleAudienceSize = function (bool) {
    if (bool === true) {
      $("#finder-audience-size-wrapper").show();
    } else {
      $("#finder-audience-size-wrapper").hide();
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

    // Check finder-retrieve-from
    if ($.trim($("#finder-retrieve-from").val()) === "") {
      errors.push({
        selector: "#finder-retrieve-from + span",
        message: "Please choose a member."
      });
      formHasError = true;
    }

    // Check finder-search
    if ($.trim($("#finder-search").val()) === "") {
      errors.push({
        id: "finder-search",
        message: "Please set the search."
      });
      formHasError = true;
    }

    // Check finder-name
    if ($.trim($("#finder-name").val()) === "") {
      errors.push({
        id: "finder-name",
        message: "Please set the finder name."
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

    let _identityId = $("#finder-retrieve-from").val() === "me" ? stent.auth.getUserIdentityKey() : $("#finder-retrieve-from").val();
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
      size: _audience.results ? _audience.results : 0,
      identity: {
        identityKey: _identityId,
        miners: $("#finder-miners").val()
      },
      name: $.trim($("#finder-name").val()),
      entity: _entity,
      output: {
        type: "segment"
      },
      provisioner: {
        type: $("#finder-source").val(),
        async: true,
        searchId: $("#finder-search").val(),
        projectId: $("#finder-search option:selected").attr("data-project-id"),
        contractId: $("#finder-search option:selected").attr("data-contract-id")
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

    let sendFinder = await stent.finders.form.postFinder(finder);

    if (sendFinder !== null) {
      stent.ui.pushState("finder-list", false, "finder-list");
      stent.ui.load({ fileToLoad: "finder-list" });
      stent.loader.hide();
    } else {
      stent.loader.hide();
    }

  };


  const init = async function () {

    bindEvents();

    _members = await stent.finders.form.getMembers();
    if (_members === null) {
      stent.finders.form.exitOnError();
      return;
    }

    populateFromSelect();
    stent.finders.form.populateMinersSelect(_members, 10);

    stent.finders.form.target.init(_entity);

    // CRON Schedule
    stent.finders.form.initCrons({
      id: "finder-schedule",
      defaultDuration: stent.finders.form.getDefaultDuration(),
      jElem: $("#finder-schedule-wrapper"),
      timezone: stent.finders.form.getDefaultTimezone(),
      data: stent.finders.form.getDefaultSchedule().slots
    });

    stent.loader.hide();

  };

  init();

  return {
    get: function () {
      return {
        members: _members,
        searches: _searches,
        audience: _audience
      };
    }
  };

})();
