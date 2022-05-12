"use strict";


stent.finders.salesNavigator = (function () {

  let _finder = stent.finders.form.getCurrentItem();
  let _entity = $("#finder-output").val();

  let _members = null;
  let _searches = null;
  let _audience = null;
  let _query = null;
  let _version = 1;
  let _segmentsAndFindersCompanies = null;

  const getQuery = async function () {

    let identityToId = $("#finder-member").val();
    let searchId = _finder.searchId; // Get search ID from old finder

    // Get search ID from new finder
    if (typeof searchId === "undefined") {
      if (_finder.search && _finder.search.source && _finder.search.source.searchId) {
        searchId = _finder.search.source.searchId;
      }
    }

    let fetchQuery = await stent.ajax.getRestAsync("/linkedin/identities/" + identityToId + "/sales/searches/" + searchId);
    if (fetchQuery && fetchQuery.ok && fetchQuery.message) {
      return fetchQuery.message.query;
    } else {
      stent.toast.danger("Error when trying to fetch the query. Please try again.");
      return null;
    }

  };


  const getAudienceAnalysis = async function () {

    if (!_query) {
      return null;
    }

    let identityToId = $("#finder-member").val();
    let query = "";

    if (_version == 2) {
      if($("#excludeViewed").is(":checked") && _query.LEAD_INTERACTIONS != undefined)
        //_query.LEAD_INTERACTIONS = "(type:LEAD_INTERACTIONS,values:List((id:RPV,text:Remove%20profile%20viewed%20people,selectionType:INCLUDED)))";
        _query.LEAD_INTERACTIONS = "(id:RPV,text:Remove%20profile%20viewed%20people,selectionType:INCLUDED)";        

        for (let key in _query) {
          if(query.length > 0) query = query + ",";
          query += "(type:" + key + ",values:List(" +  _query[key] + "))";
          //query += _query[key]
        }        
        query = JSON.stringify(query).replace(/"/gi, ""); // Replace double quote by empty string        
        query = "(filters:List(" + query + "))"
        
    }
    else {
      _query.excludeViewed = $("#excludeViewed").is(":checked").toString();
      query = { ..._query };
      query = JSON.stringify(query).replace(/"/gi, ""); // Replace double quote by empty string
      query = query.substring(1, query.length - 1); // Remove first and last bracket
      query = "(" + query + ")";
  
    }

    var queryPayload = {
      query: query,
      version: _version
    };
    let fetchAudienceAnalysis = await stent.ajax.postRestAsync("/linkedin/identities/" + identityToId + "/sales/search/test", queryPayload);

    if (fetchAudienceAnalysis && fetchAudienceAnalysis.ok && fetchAudienceAnalysis.message) {
      return fetchAudienceAnalysis.message;
    } else {
      stent.toast.danger("Error when trying to fetch the audience. Please try again.");
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


  const getNewAudienceAnalysis = async function (searchId) {

    let identityFromId = $("#finder-retrieve-from").val() === "me" ? stent.auth.getUserIdentityKey() : $("#finder-retrieve-from").val();
    let identityToId = $("#finder-member").val();

    let fetchAudienceAnalysis = await stent.ajax.getRestAsync("/linkedin/identities/" + identityFromId + "/sales/searches/" + searchId + "/" + identityToId);

    if (fetchAudienceAnalysis && fetchAudienceAnalysis.ok && fetchAudienceAnalysis.message) {
      return fetchAudienceAnalysis.message;
    } else {
      stent.toast.danger("Error when trying to fetch the audience. Please try again.");
      return null;
    }

  };


  const getSearches = async function (identityId) {

    if (identityId === "me") {
      identityId = stent.auth.getUserIdentityKey();
    }

    let fetchSearches = await stent.ajax.getRestAsync("/linkedin/identities/" + identityId + "/sales/searches");

    if (fetchSearches && fetchSearches.ok && fetchSearches.message) {
      return fetchSearches.message;
    } else {
      stent.toast.danger("Error when trying to fetch the searches. Please try again.");
      return null;
    }

  };


  const putAnalaysis = async function (size) {
    return await stent.finders.form.putFinder({ size: size });
  };


  const populateFromSelect = function () {

    let options = [{ id: "", text: "" }];

    $("#finder-retrieve-from").html("");

    if (stent.auth.getUserIdentityKey()) {
      options.push({ id: "me", text: "Me" });
    }

    let optionsMembers = _members.map(member => {
      return { id: member.id, text: member.firstName + " " + member.lastName, pictureUrl: member.pictureUrl ? member.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif" };
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

  };


  const populateFilterOnCompanySelect = function (selectedId) {

    let options = [{ id: "", text: "" }];
    let segments = [];
    let finders = [];

    $("#filter-on-company").html("");

    if (_segmentsAndFindersCompanies) {
      //Create groups
      _segmentsAndFindersCompanies.map(item => {
        if (item.__typename === "finder") {
          let o = { id: item.__typename + "/" + item.id, text: item.name };
          if (selectedId && item.id === selectedId) {
            o.selected = true;
          }
          finders.push(o);
        } else if (item.__typename === "segment") {
          let o = { id: item.__typename + "/" + item.id, text: item.name };
          if (selectedId && item.id === selectedId) {
            o.selected = true;
          }
          segments.push(o);
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
        allowClear: true,
      }
    );

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

    if (_query !== null && _audience !== null) {
      let _size = _audience.results;
      $("#finder-audience-size").html(_size.toLocaleString(stent.locale) + " contact" + (_size > 1 ? "s" : ""));
    }

  };


  const populateQueryDefinition = function () {

    let html = "";

    Object.entries(_query).map((condition) => {
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

    stent.finders.form.cleanErrors();

    $("#finder-audience-size").text("0 contact");
    $("#finder-audience-size-wrapper").removeClass("finder-wrapper-disabled");
    $("#finder-query-definition tbody").html("");

    stent.finders.form.onChangeStatus("active");

  };

  const clearFilterOnCompanySelect = function () {
    $("#filter-on-company-wrapper").hide();
    $("#filter-on-company").html("");
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
      _audience = await getNewAudienceAnalysis(searchId);
      _query = _audience.query;
      _version = _audience.version;
      populateAudienceAnalysis();
      populateQueryDefinition();
      toggleConfiguration(true);
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


  const resetAudience = function () {

    _audience = null;

    $("#finder-audience-size").text("0 contact");
    $("#finder-audience-size-wrapper").addClass("finder-wrapper-disabled");
    $("#finder-query-definition tbody").html("");

  };


  const onChangeExcludeViewed = async function () {

    stent.loader.show("#finder-form");
    _audience = await getAudienceAnalysis();
    populateAudienceAnalysis();
    populateQueryDefinition();
    stent.loader.hide();

  };


  const bindEvents = function () {

    $("#finder-retrieve-from")
      .off("change")
      .on("change", function () {
        let identityId = $(this).val();
        onChangeFrom(identityId);
      });

    $("#finder-search")
      .off("change")
      .on("change", function () {
        let searchId = $(this).val();
        onChangeSearch(searchId);
      });

    $("#finder-member")
      .off("change")
      .on("change", function () {
        onChangeMember();
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

    $(".toggle-advanced")
      .off("click")
      .on("click", function () {
        $(this).toggleClass("open");
      });

    $("#excludeViewed")
      .off("input")
      .on("input", function () {
        onChangeExcludeViewed();
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

    // // Check finder-retrieve-from
    if ($.trim($("#finder-retrieve-from").val()) !== "") {
      if ($.trim($("#finder-search").val()) === "") {
        errors.push({
          id: "finder-search",
          message: "Please set the search."
        });
        formHasError = true;
      }
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
        id: "finder-member",
        message: "Please set the member."
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


  const fillForm = async function () {

    if (_finder) {

      // finder-miners
      if (_finder.identity.miners && Array.isArray(_finder.identity.miners) && _finder.identity.miners.length > 0) {
        for (let i = 0; i < _finder.identity.miners.length; i++) {
          $("#finder-miners option[value='" + _finder.identity.miners[i] + "']").prop("selected", true);
        }
        $("#finder-miners").trigger("change");
      }

      if (_finder.provisioner && _finder.provisioner.filter && _finder.provisioner.filter.company && _finder.provisioner.filter.company.id) {
        populateFilterOnCompanySelect();
        toggleAudienceSize(false);
        $("#filter-on-company-wrapper").show();
      }


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

      // Target Management
      stent.finders.form.target.fill();
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
        query: _query,
        version: _version
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

    //bind events
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

    fillForm();

    stent.utils.log(_finder);

    if ((!_finder.search ||
      !_finder.search.query ||
      typeof _finder.search.query !== "object") &&
      (!_finder.provisioner ||
        !_finder.provisioner.query ||
        typeof _finder.provisioner.query !== "object")
    ) {
      _query = await getQuery();

      // Query does not exists => exit !
      if (_query === null) {
        stent.finders.form.exitOnError();
        return;
      }

    } else {
      _query = _finder.provisioner && _finder.provisioner.query ?
        _finder.provisioner.query :
        _finder.search && _finder.search.query ?
          _finder.search.query : {}
        ;

      _version = _finder.provisioner && _finder.provisioner.version ? _finder.provisioner.version : 1;

    }

    // Set excludeViewed checkbox value
    if (_version == 1 && (_query && ((_query.excludeViewed && _query.excludeViewed === "false")))) {
      $("#excludeViewed").removeAttr("checked");
    }

    if (_version == 2 &&  (_query && (!_query.LEAD_INTERACTIONS || (_query.LEAD_INTERACTIONS && !_query.LEAD_INTERACTIONS.includes("id:RPV,"))))) {
      $("#excludeViewed").removeAttr("checked");
    }

    // Set filter on Companies checkbox value
    if (_finder.provisioner && _finder.provisioner.filter && _finder.provisioner.filter.company) {
      $("#filter-on-company-switch").prop("checked", true);
    }

    // _audience = await getAudienceAnalysis();
    // if (_audience === null ) {
    //   stent.finders.form.exitOnError();
    //   return;
    // }

    // let _putSize = await putAnalaysis(_audience.results);
    // if (_putSize === null) {
    //   stent.finders.form.exitOnError();
    //   return;
    // }

    // populateAudienceAnalysis();
    populateQueryDefinition();


    stent.loader.hide();

  };

  init();

  return {
    get: function () {
      return {
        finder: _finder,
        members: _members,
        searches: _searches,
        audience: _audience,
        query: _query
      };
    }
  };

})();
