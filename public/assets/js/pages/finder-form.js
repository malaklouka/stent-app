"use strict";


stent.finders.form = (function () {

  let _currentItem = null;
  let _isInEdition = false;
  let _isInDuplication = false;
  let _defaultTimezone = stent.tenant.timezone;
  let _defaultSchedule = {
    slots: [{ cron: "0 8 * * *", duration: "PT1H" }, { cron: "0 13 * * *", duration: "PT1H" }]
  };
  let _defaultDuration = "PT1H";

  /* ########################@ */
  /* FACTORY FINDERS
  /* ########################@ */

  const getMembers = async function () {

    let fetchMembers = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/members");

    if (fetchMembers && fetchMembers.ok && fetchMembers.message) {
      return fetchMembers.message;
    } else {
      stent.toast.danger("Error when trying to fetch the ambassadors. Please refresh the page to try again.");
      return null;
    }

  };

  const postFinder = async function (finder) {

    let fetchPostFinder = await stent.ajax.postRestAsync("/finders/tenants/" + stent.tenant.key + "/" + finder.identity.identityKey, finder);

    if (fetchPostFinder && fetchPostFinder.ok && fetchPostFinder.message) {
      return fetchPostFinder.message;
    } else {
      stent.toast.danger("Error when trying to save the finder. Please try again.");
      return null;
    }

  };

  const putFinder = async function (finder) {

    let owner = $("#finder-member").val() ? $("#finder-member").val() : $("#finder-retrieve-from").val();

    let fetchPutFinder = await stent.ajax.putRestAsync("/finders/tenants/" + stent.tenant.key + "/" + owner + "/" + stent.finders.form.getCurrentItem()._key, finder);

    if (fetchPutFinder && fetchPutFinder.ok && fetchPutFinder.message) {
      return fetchPutFinder.message;
    } else {
      stent.toast.danger("Error when trying to save the finder. Please try again.");
      return null;
    }

  };


  /* ########################@ */
  /* EXIT ON ERROR
  /* ########################@ */

  const exitOnError = function () {
    $("#finder-form").replaceWith("<div class=\"alert alert-warning\" role=\"alert\"><strong>Ooooooops.</strong> There was an error while loading your finder. Please try again.</div>");
    stent.loader.hide();
  };


  /* ########################@ */
  /* ON CHANGE FINDER STATUS
  /* ########################@ */

  const cleanErrors = function () {
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").remove();
  };

  const onChangeStatus = function (status) {

    cleanErrors();

    if (status === "active") {
      $("#finder-status-start")
        .removeClass("btn-white")
        .addClass("btn-success")
        .addClass("active")
        .find("input").attr("checked", "checked");

      $("#finder-status-stop")
        .removeClass("btn-danger")
        .removeClass("active")
        .addClass("btn-white")
        .find("input").removeAttr("checked");

    } else {

      $("#finder-status-start")
        .addClass("btn-white")
        .removeClass("btn-success")
        .removeClass("active")
        .find("input").removeAttr("checked");

      $("#finder-status-stop")
        .removeClass("btn-white")
        .addClass("btn-danger")
        .addClass("active")
        .find("input").attr("checked", "checked");
    }

  };


  /* ########################@ */
  /* POPULATE MEMBER SELECT
  /* ########################@ */

  const populateMembersSelect = function (members) {


    let options = [{ id: "", text: "" }];

    $("#finder-member").html("");

    members.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));

    let optionsMembers = members.map(member => {
      return {
        id: member.id,
        text: member.firstName + " " + member.lastName,
        pictureUrl: member.pictureUrl ? member.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif",
        timezone: member.timezone ? member.timezone : stent.tenant.timezone
      };
    });

    options.push(...optionsMembers);

    $("#finder-member").select2(
      {
        data: options,
        placeholder: "Select a member",
        escapeMarkup: stent.select2.memberLayout.escapeMarkup,
        templateResult: stent.select2.memberLayout.templateResult,
        templateSelection: stent.select2.memberLayout.templateSelection
      }
    );

    $("#finder-member").on("select2:select", function () {

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

  const populateMinersSelect = function (members, maximumSelectionLength) {

    let options = [{ id: "", text: "" }];

    $("#finder-miners").html("");

    let optionsMiners = members.map(member => {
      return { id: member.id, text: member.firstName + " " + member.lastName, pictureUrl: member.pictureUrl ? member.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif" };
    });

    options.push(...optionsMiners);

    let select2Options = {
      data: options,
      multiple: true,
      placeholder: "Select ambassadors",
      escapeMarkup: stent.select2.memberLayout.escapeMarkup,
      templateResult: stent.select2.memberLayout.templateResult,
      templateSelection: stent.select2.memberLayout.templateSelection
    };

    // Set max selection count in select box
    if (maximumSelectionLength) {
      select2Options.maximumSelectionLength = maximumSelectionLength;
    }

    $("#finder-miners").select2(select2Options);

  };


  /* ########################@ */
  /* STEP 1 & 2
  /* ########################@ */

  const buildStep1 = function (selectedSourceKey) {

    let option = new Option("Please select a source", "");
    $("#finder-source").append($(option));

    stent.finders.sources.forEach(function (source) {
      let option = new Option(source.name, source.key);
      $("#finder-source").append($(option));
    });

    if (selectedSourceKey) {
      $("#finder-source option[value='" + selectedSourceKey + "']").prop("selected", true);
    }

  };

  const buildStep2 = function (selectedSourceKey, selectedOutputKey) {

    if (selectedSourceKey === "") {

      //toggleDescriptionStep2();
      toggleStep2(false);
      toggleStep3(false);

      return;

    } else {

      toggleStep2(true);
      toggleStep3(false);

      $("#finder-output").html("");

      let option = new Option("Please select an output", "");
      $("#finder-output").append($(option));

      stent.finders.getSourceByKey(selectedSourceKey).outputs.forEach(function (output) {
        let option = new Option(output.name, output.key);
        $("#finder-output").append($(option));
      });

      if (selectedOutputKey) {
        $("#finder-output option[value='" + selectedOutputKey + "']").prop("selected", true);
      }

    }

  };

  const buildStep3 = function (sourceKey, outputKey) {
    if (sourceKey === "" || outputKey === "") {
      toggleStep3(false);
      return;
    } else {
      toggleStep3(true);
      loadForm(sourceKey, outputKey);
    }
  };

  const toggleStep2 = function (bool) {
    if (bool === true || typeof bool === "undefined") {
      $("#finder-output-wrapper").removeClass("d-none");
      $("#finder-arrow-separator").removeClass("d-none");
    } else {
      $("#finder-output-wrapper").addClass("d-none");
      $("#finder-arrow-separator").addClass("d-none");
    }
  };

  const toggleStep3 = function (bool) {
    if (bool === true || typeof bool === "undefined") {
      $("#finder-form-wrapper").removeClass("d-none");
      $("#finder-form-content").empty();
    } else {
      $("#finder-form-wrapper").addClass("d-none");
    }
  };

  const loadForm = function (sourceKey, outputKey) {

    stent.loader.show(".main-content");

    if (sourceKey === "" || typeof sourceKey === "undefined") {
      $("#finder-form-content").empty();
      stent.loader.hide();
    } else {
      let output = stent.finders.getSourceByKey(sourceKey).outputs.filter(output => output.key === outputKey)[0];
      $("#finder-form-content").load(_isInEdition ? output.path.edit : _isInDuplication ? output.path.duplicate : output.path.create);
    }

  };

  const bindEvents = function () {

    $("#finder-source")
      .off("change")
      .on("change", function () {
        let sourceKey = $(this).val();
        //toggleDescriptionStep1(sourceKey);
        buildStep2(sourceKey);
      });

    $("#finder-output")
      .off("change")
      .on("change", function () {

        let outputKey = $(this).val();
        //toggleDescriptionStep2(outputKey);

        let sourceKey = $("#finder-source").val();

        disableStep1And2(sourceKey, outputKey);

        buildStep3(sourceKey, outputKey);

      });

    $("#finder-form")
      .off("click", ".toggle-schedule-wrapper")
      .on("click", ".toggle-schedule-wrapper", function () {
        $(this).toggleClass("open");
      });

    $("#finder-form")
      .off("input", "#cohort-size")
      .on("input", "#cohort-size", function () {
        $("#display-cohort-size").text($(this).val());
      });

  };

  const disableStep1And2 = function (sourceKey, outputKey) {

    let source = stent.finders.getSourceByKey(sourceKey);
    let output = stent.finders.getOutputByKey(outputKey);

    $("#finder-source")
      .addClass("d-none")
      .after(`
        <div class="card">
          <div class="card-body" style="padding: 1rem;">
          <img style="width: 40px; height: 4x; margin-right: 10px;" src="${source.icon}" /> ${source.name}
          </div>
        </div>
      `);
    $("#finder-output")
      .addClass("d-none")
      .after(`
        <div class="card">
          <div class="card-body" style="padding: 1rem;">
            <img style="width: 40px; height: 40px; margin-right: 10px;" src="${output.icon}" /> ${output.name}
          </div>
         </div>
      `);

    $("#finder-arrow-separator").css("padding-top", "4.3rem");
  };

  const loadItem = async function (itemID) {
    let getItem = await stent.ajax.getRestAsync("/finders/tenants/" + stent.tenant.key + "/" + itemID);

    if (getItem && getItem.ok && getItem.message) {
      return { ...getItem.message };
    } else {
      stent.toast.danger("Error when trying to get the finder. Please refresh the page to try again.");
      return null;
    }
  };

  const initCrons = function (config) {
    stent.cronEditor.init(config);
  };

  const init = async function () {

    // Default values
    let defaultSource = "linkedin-sales-navigator-saved-search";
    let defaultOutput = "contact";

    // change Page title
    stent.ui.setPageTitle("Finder edit");

    //bind events
    bindEvents();

    // Start form
    let params = new URLSearchParams(location.search);
    let itemId = params.get("id");
    let action = params.get("action");

    // EDITION MODE / DUPLICATIONS
    if (itemId !== null) {

      _currentItem = await loadItem(itemId);

      if (_currentItem === null) {
        $("#finder-form").html("");
        stent.loader.hide();
        return;
      }

      if (action === "duplicate") {
        _isInDuplication = true;
        $(".main-content h1.header-title").text("Duplicate a finder");
        stent.ui.setPageTitle("Duplicate a finder");
      } else {
        _isInEdition = true;
        $(".main-content h1.header-title").text("Edit a finder");
        stent.ui.setPageTitle("Edit a finder");
      }

      // check if the output and provisioner properties exists in the _currentItem object
      defaultSource = _currentItem.provisioner && _currentItem.provisioner.type ? _currentItem.provisioner.type : "linkedin-sales-navigator-saved-search";
      defaultOutput = _currentItem.entity ? _currentItem.entity : "contact";

      buildStep1(defaultSource);
      buildStep2(defaultSource, defaultOutput);
      buildStep3(defaultSource, defaultOutput);

      disableStep1And2(defaultSource, defaultOutput);

    } else {

      buildStep1();

    }

  };

  init();

  return {
    getCurrentItem: function () {
      return _currentItem;
    },
    isInEdition: function () {
      return _isInEdition;
    },
    isInDuplication: function () {
      return _isInDuplication;
    },
    disableStep1And2,

    getMembers,
    postFinder,
    putFinder,

    populateMembersSelect,
    populateMinersSelect,
    onChangeStatus,
    cleanErrors,
    exitOnError,

    initCrons,
    getDefaultTimezone: function () {
      return _defaultTimezone;
    },
    getDefaultSchedule: function () {
      return _defaultSchedule;
    },
    getDefaultDuration: function () {
      return _defaultDuration;
    }
  };

})();

