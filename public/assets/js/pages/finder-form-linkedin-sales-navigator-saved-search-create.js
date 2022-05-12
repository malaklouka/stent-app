"use strict";

stent.finders.salesNavigator = (function () {

  let _entity = $("#finder-output").val();
  let _members = null;
  let _searches = null;
  let _audience = null;
  let _version = 1;
  let _segmentsAndFindersCompanies = null;

  const getSearches = async function (identityId) {

    if (identityId === "me") {
      identityId = stent.auth.getUserIdentityKey();
    }

    let fetchSearches = await stent.ajax.getRestAsync("/linkedin/identities/" + identityId + "/sales/searches");

    if (fetchSearches && fetchSearches.ok && fetchSearches.message) {
      return fetchSearches.message;
    } else {
      stent.loader.hide();
      stent.toast.danger("Error when trying to fetch the searches. Please try again.");
      return null;
    }

  };


  const getSegmentsAndFindersCompanies = async function (identityId) {

    let fetchItems = await stent.ajax.getRestAsync("/finders/tenants/" + stent.tenant.key + "/identity/" + identityId + "/query/filters?entity=company");

    if (fetchItems && fetchItems.ok && fetchItems.message) {
      return fetchItems.message;
    } else {
      stent.loader.hide();
      stent.toast.danger("Error when trying to fetch the segments and finders of companies. Please try again.");
      return null;
    }

  };


  const getAudienceAnalysis = async function (searchId) {

    let identityFromId = $("#finder-retrieve-from").val() === "me" ? stent.auth.getUserIdentityKey() : $("#finder-retrieve-from").val();
    let identityToId = $("#finder-member").val();

    let fetchAudienceAnalysis = await stent.ajax.getRestAsync("/linkedin/identities/" + identityFromId + "/sales/searches/" + searchId + "/" + identityToId + "?excludeViewed=" + $("#excludeViewed").is(":checked"));

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


  const populateFilterOnCompanySelect = function () {

    let options = [{ id: "", text: "" }];

    let segments = [];
    let finders = [];

    $("#filter-on-company").html("");

    if (_segmentsAndFindersCompanies) {

      //Create groups
      _segmentsAndFindersCompanies.map(item => {
        if (item.__typename === "finder") {
          finders.push({ id: item.__typename + "/" + item.id, text: item.name });
        } else if (item.__typename === "segment") {
          segments.push({ id: item.__typename + "/" + item.id, text: item.name });
        }
      });

      if (segments.length > 0) {
        options.push({
          id: 1,
          text: "Segments",
          children: [...segments]
        });
      }
      if (finders.length > 0) {
        options.push({
          id: 1,
          text: "Finders",
          children: [...finders]
        });
      }

    }

    $("#filter-on-company").select2(
      {
        data: options,
        placeholder: "Select a company segment",
        allowClear: true
      }
    );

  };


  const clearFilterOnCompanySelect = function () {
    $("#filter-on-company-wrapper").hide();
    $("#filter-on-company").html("");
  };


  const hideFilterOnCompanySelect = function () {
    if ($("#filter-on-company-switch").is(":checked")) {
      clearFilterOnCompanySelect();
      $("[for=\"filter-on-company-switch\"]").click();
    }
  };


  const populateSearchesSelect = function () {
    $("#finder-search").empty();

    let option = new Option("Please choose a search", "");
    $("#finder-search").append($(option));
    _searches.forEach(function (search) {
      let option = new Option(search.name, search.id);
      $("#finder-search").append($(option));
    });

  };


  const populateAudienceAnalysis = function () {

    $("#finder-audience-size").val("0 contacts");

    if (_audience && typeof _audience.results !== "undefined") {
      let _size = _audience.results;
      $("#finder-audience-size").html(_size.toLocaleString(stent.locale) + " contact" + (_size > 1 ? "s" : ""));
    }

  };


  const populateQueryDefinition = function () {

    let html = "";

    Object.entries(_audience.query).map((condition) => {
      html += `
          <tr>
            <td style="padding: 0.3rem;"><pre class="mb-0" style="white-space: pre-wrap;">${decodeURIComponent(condition[0])}</pre></td>
            <td style="padding: 0.3rem;"><pre class="mb-0" style="white-space: pre-wrap;">${decodeURIComponent(condition[1])}</pre></td>
          </tr>
        `;
    });

    $("#finder-query-definition tbody").html(html);

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

    setMemberValue($("#finder-retrieve-from").val());

    stent.finders.form.cleanErrors();

    $("#finder-audience-size").text("0 contact");
    $("#finder-audience-size-wrapper").removeClass("finder-wrapper-disabled");
    $("#finder-query-definition tbody").html("");

    stent.finders.form.onChangeStatus("active");

  };


  const resetAudience = function () {

    _audience = null;

    $("#finder-audience-size").text("0 contact");
    $("#finder-audience-size-wrapper").addClass("finder-wrapper-disabled");
    $("#finder-query-definition tbody").html("");

  };


  const onChangeFrom = async function (identityId) {

    stent.finders.form.cleanErrors();

    stent.loader.show("#finder-form");
    _searches = await getSearches(identityId);

    populateSearchesSelect();
    toggleSearch(true);

    resetConfiguration();
    toggleConfiguration(false);

    stent.loader.hide();
  };


  const onChangeSearch = async function (searchId) {

    stent.finders.form.cleanErrors();

    stent.loader.show("#finder-form");
    resetConfiguration();

    if (searchId) {

      // If "FROM" is NOT me !
      if ($("#finder-retrieve-from").val() !== "me") {
        _audience = await getAudienceAnalysis(searchId);
        populateAudienceAnalysis();
        populateQueryDefinition();
        toggleConfiguration(true);
      } else {
        toggleConfiguration(true);
        $("#finder-audience-size-wrapper").addClass("finder-wrapper-disabled");
      }


    } else {
      toggleConfiguration(false);
    }

    stent.loader.hide();
  };


  const onChangeMember = async function () {

    stent.finders.form.cleanErrors();

    if ($("#finder-member").val() === "") {
      resetAudience();
    } else {
      $("#finder-audience-size-wrapper").removeClass("finder-wrapper-disabled");

      stent.loader.show("#finder-form");

      _audience = await getAudienceAnalysis($("#finder-search").val());
      _segmentsAndFindersCompanies = await getSegmentsAndFindersCompanies($("#finder-member").val());

      populateAudienceAnalysis();
      populateFilterOnCompanySelect();
      populateQueryDefinition();
    }

    stent.loader.hide();

  };


  const setMemberValue = async function (identityId) {

    if (identityId === "me") {
      $("#finder-member").val("").trigger("change.select2");
    } else {
      if ($("#finder-member").val() === "") {
        $("#finder-member").val(identityId).trigger("change.select2");

        _segmentsAndFindersCompanies = await getSegmentsAndFindersCompanies(identityId);
        if (_segmentsAndFindersCompanies) {
          populateFilterOnCompanySelect();
        }
      }
    }

  };


  const bindEvents = function () {

    $("#finder-retrieve-from")
      .off("change")
      .on("change", function () {
        let identityId = $(this).val();
        onChangeFrom(identityId);
        setMemberValue(identityId);
        toggleAudienceSize(true);
        hideFilterOnCompanySelect();
      });

    $("#finder-search")
      .off("change")
      .on("change", function () {
        let searchId = $(this).val();
        onChangeSearch(searchId);
        toggleAudienceSize(true);
        hideFilterOnCompanySelect();
      });

    $("#finder-member")
      .off("change")
      .on("change", function () {
        onChangeMember();
        toggleAudienceSize(true);
        hideFilterOnCompanySelect();
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

    $(".toggle-advanced")
      .off("click")
      .on("click", function () {
        $(this).toggleClass("open");
      });

    $("#excludeViewed")
      .off("input")
      .on("input", function () {
        let searchId = $("#finder-search").val();
        onChangeSearch(searchId);
      });

    $("#filter-on-company-switch")
      .off("input")
      .on("input", async function () {

        let isChecked = $(this).is(":checked");

        if (isChecked) {
          stent.loader.show("#finder-form");
          _segmentsAndFindersCompanies = await getSegmentsAndFindersCompanies($("#finder-member").val());
          if (_segmentsAndFindersCompanies) {
            populateFilterOnCompanySelect();
          }
          $("#filter-on-company-wrapper").show();
          stent.loader.hide();

        } else {
          clearFilterOnCompanySelect();
        }

      });

    $("#filter-on-company").on("select2:select", function () {
      toggleAudienceSize(false);
    });

    $("#filter-on-company").on("select2:clear", function () {
      toggleAudienceSize(true);
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

    // Check finder-member
    if ($.trim($("#finder-member").val()) === "") {
      errors.push({
        selector: "#finder-member + span",
        message: "Please choose a member."
      });
      formHasError = true;
    }

    // Check filter on company Segment
    if ($("#filter-on-company-switch").is(":checked") && ($("#filter-on-company").val() === "" || $("#filter-on-company").val() === null)) {
      errors.push({
        selector: "#filter-on-company + span",
        message: "Please choose a segment or deactivate the filter on company option."
      });
      formHasError = true;
      $("#finder-query-definition label").addClass("open");
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
        async: $("#excludeViewed").is(":checked") ? true : false,
        query: _audience.query ? _audience.query : "",
        version: _audience.version ? _audience.version : "",
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

    // Add the filter property if a company filter is selected
    let filterOnCompanyId = $("#filter-on-company").val();

    if (filterOnCompanyId) {
      let filterType = filterOnCompanyId.split("/")[0];
      filterOnCompanyId = filterOnCompanyId.split("/")[1];

      finder.provisioner.filter = {
        company: {
          type: filterType,
          id: filterOnCompanyId,
          operator: "include",
          scope: "CURRENT"
        }
      };

    }

    stent.utils.log(finder);

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

    stent.finders.form.populateMembersSelect(_members);
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
