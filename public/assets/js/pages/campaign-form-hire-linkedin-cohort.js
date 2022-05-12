"use strict";

stent.requireJS(["flatpickr"], function () {

  stent.campaign.hire = (function () {

    let _campaignFlow = "hire-linkedin-cohort";
    let _campaignId;
    let _campaignSource;
    let _isInDuplication;

    let editorsConfiguration = [
      
      // START
      {
        type: "inmail",
        name: "InMail",
        allowChooseChannel: false,
        channel: "linkedin-inmail",
        channels: {
          "linkedin-inmail": {
            name: "LinkedIn InMail",
            maxCharCount: 1900,
            maxSubjectCharCount: 200,
            showSubject: true,
          }
        },
      },

      // ACCEPT
      {
        type: "accept",
        name: "On Accept",
        optional: true,
        allowChooseChannel: false,
        conditions: {
          stopIfOutgoings: true,
          stopIfIncomings: true,
        },
        channel: "linkedin-inmail",
        channels: {
          "linkedin-inmail": {
            name: "LinkedIn InMail",
            maxCharCount: 1900,
            maxSubjectCharCount: 200,
            showSubject: false,
          }
        }
      }

    ];


    const sourcesURLFunction = function () {
      return "/tenants/" + stent.tenant.key + "/sources/identity/" + $("#campaign-sender").val();
    };

    const populateSourcePicker = function (items) {
      $("#campaign-source").empty();
      if (!items || (items && items.length == 0)) {
        let option = new Option("Please select a valid sender having sources !", "");
        $("#campaign-source").append($(option));
      }

      let group;
      items.forEach(function (item) {
        if (group != item.type)
          $("#campaign-source").append("<optgroup label='" + item.type + "' id='group_" + item.type + "'></optgroup>");
        group = item.type;
        let option = new Option(item.name, item._id);
        $("#group_" + item.type).append($(option));
      });

      if (_campaignSource) $("#campaign-source option[value='" + _campaignSource + "']").prop("selected", true);
      stent.loader.hide();
    };

    const fillForm = function () {
      let item = stent.campaign.get();
      _isInDuplication = stent.campaign.getIsInDuplication();

      if (item) {

        if (!_isInDuplication) {
          stent.campaign.lockSender();
          _campaignId = item._key;
        }

        _campaignSource =
          item.parameters && item.parameters.source && item.parameters.source.id ? item.parameters.source.id : null;

        $("#campaign-form").toggleClass("d-none");
        $(".main-content h1").text(_isInDuplication ? "Duplicate a hire campaign" : "Edit a hire campaign");
        $("#campaign-type").val(item.flow);

        $("#campaign-name").val(item.name).trigger("change");
        $("#campaign-program").val(item.program).trigger("change");

        if (item.target) {
          $("#campaign-target").val(item.target);
        }

        $("#campaign-description").val(item.description);

        if (item.parameters && item.parameters.cohort && item.parameters.cohort.size) {
          $("#display-cohort-size").text(item.parameters.cohort.size);
          $("#cohort-size").val(item.parameters.cohort.size);
        }

        if (item.status === "stop") {
          $("#active").removeAttr("checked");
          $("#active")
            .parent()
            .removeClass("focus")
            .removeClass("active")
            .removeClass("btn-success")
            .addClass("btn-white");

          $("#stop").attr("checked", "checked");
          $("#stop").parent().addClass("focus").addClass("active").addClass("btn-danger").removeClass("btn-white");
        }

        window.scrollTo(0, 0);

        // Select the sender
        let senderKey = item.identity.identityKey;
        if (senderKey) {

          if (!_isInDuplication) {
            // check if the identity found in the campaign object is present in the list of potentials sender
            // It's possible to found found the user, because he's deactivated or removed =>
            // Push it manually in the list
            if ($("#campaign-sender option[value='" + senderKey + "']").length === 0) {
              let option = new Option(item.identity.firstName + " " + item.identity.lastName, item.identity.identityKey);
              $("#campaign-sender").append($(option));
            }

            $("#campaign-sender option[value='" + senderKey + "']").prop("selected", true);

            stent.loader.show(".main-content");
            stent.ajax.getRest(sourcesURLFunction(), populateSourcePicker);
          }

        }


        // Initialiyze CRONs editors
        let _slots = [];
        let _weekDays = "MON,TUE,WED,THU,FRI,SAT,SUN";

        // Transform CRONs
        if (item.schedule && item.schedule.slots && item.schedule.slots.length) {
          _slots = item.schedule.slots.map(function (item) {
            let _cron = item.cron;
            _cron = _cron.split(" ");
            _weekDays = _cron[4];
            _cron[4] = "*";
            _cron = _cron.join(" ");

            item.cron= _cron;
            return item;
          });
        }

        stent.campaign.initCrons({
          id: "campaign-schedule",
          defaultDuration: "PT3H",
          jElem: $("#campaign-schedule-wrapper"),
          timezone: item.schedule.timezone,
          data: _slots,
        });

        // set selected week days, if not * (the days are always all selected eby default in UI)
        if (_weekDays !== "*") {
          $("[name=\"weekDays\"]").prop("checked", "");
          _weekDays.split(",").forEach(function (weekDay) {
            $("#" + weekDay).prop("checked", "checked");
          });
        }

      } else {
        $("#no-campaign").toggleClass("d-none");
      }

      stent.campaign.initEditors();
      stent.campaign.updateMaxCharCountDOM(0);
      stent.campaign.updateMaxSubjectCharCountDOM(0);

      if (!_isInDuplication && item.status === "archive") {
        stent.campaign.readOnly();
      }

      if (!_isInDuplication && item.started && item.started > 0) {
        stent.campaign.readOnlyNameAndProgram();
      }

      if (item.schedule && item.schedule.startDate && item.schedule.startDate !== null) {
        stent.flatpickr.pickers["start-date"].setDate(item.schedule.startDate);
        $("#start-date").val(item.schedule.startDate); // Force set value
      }

      if (item.schedule && item.schedule.endDate && item.schedule.endDate !== null) {
        stent.flatpickr.pickers["end-date"].setDate(item.schedule.endDate);
        $("#end-date").val(item.schedule.endDate); // Force set value
      }

      if (item.notifications) {
        // Mobile
        if (item.notifications.mobile === true) {
          $("#mobile-notification").prop("checked", true);
        } else if (item.notifications.mobile === false) {
          $("#mobile-notification").prop("checked", false);
          $("#mobile-notification").removeAttr("checked");
        }
        // Email
        if (item.notifications.email === true) {
          $("#email-notification").prop("checked", true);
        } else if (item.notifications.email === false) {
          $("#email-notification").prop("checked", false);
          $("#email-notification").removeAttr("checked");
        }
      }

      // Approval
      if (item.approval) {
        if (item.approval.type === "optout") {
          $("#approval").removeAttr("checked");
          $("#approvalType").addClass("d-none");
        }
        if (item.approval.method === "forget") {
          $("#approvalType").val("forget");
        }
      } else {
        $("#approval").removeAttr("checked");
        $("#approvalType").addClass("d-none");
      }

      stent.loader.hide();
      $("#campaign-form-loader").addClass("d-none");
      $("#campaign-form").removeClass("d-none");
    };

    const bindEvents = function () {
      $("#campaign-save")
        .off("click")
        .on("click", function () {
          if (checkForm()) {
            save();
          }
        });

      $("#approval")
        .off("input")
        .on("input", function () {
          if ($(this).is(":checked")) {
            $("#approvalType").removeClass("d-none");
          } else {
            $("#approvalType").addClass("d-none");
          }
        });
    };

    const checkForm = function () {
      let formHasError = false;
      let errors = [];
      let editors = stent.campaign.getEditors();

      stent.campaign.cleanErrors();

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
          $("#" + error.id)
            .addClass("is-invalid")
            .parent()
            .append(errorDOM(error.message));
        }
      };

      // Check campaign-name
      if ($.trim($("#campaign-name").val()) === "") {
        errors.push({
          id: "campaign-name + span",
          message: "Please fill in the name of the campaign.",
        });
        formHasError = true;
      }

      // campaign-program
      if ($.trim($("#campaign-program").val()) === "") {
        errors.push({
          id: "campaign-program + span",
          message: "Please fill in the program of the campaign.",
        });
        formHasError = true;
      }

      // campaign-program
      if ($.trim($("#campaign-target").val()) === "") {
        errors.push({
          id: "campaign-target",
          message: "Please fill in the target of the campaign.",
        });
        formHasError = true;
      }

      // campaign-sender
      if ($.trim($("#campaign-sender").val()) === "") {
        errors.push({
          id: "campaign-sender",
          message: "Please choose a sender.",
        });
        formHasError = true;
      }

      // campaign-source
      if ($.trim($("#campaign-source").val()) === "") {
        errors.push({
          id: "campaign-source",
          message: "Please choose a source.",
        });
        formHasError = true;
      }

      let cronEditor = stent.cronEditor.get("campaign-schedule");

      // campaign-timezone
      if (cronEditor.timezone === "") {
        errors.push({
          id: "campaign-schedule-timezone",
          message: "Please choose a timezone.",
        });
        formHasError = true;
      }

      // Check if there at least on CRON defined
      if (cronEditor.crons.length === 0) {
        errors.push({
          id: "campaign-schedule .campaign-add-schedule",
          message: "Please add at least a timer slot.",
        });
        formHasError = true;
      }

      // check messages and variations
      let errorOnce = false;


      // ------------------------------- //
      // Check messages
      // ------------------------------- //

      editors.forEach((editor, index) => {

        if (editors[index].optional === true)
          return;

        // Default message is not filled
        if (editors[index].body.default === "") {
          $("#campaign-tab-" + index).addClass("is-invalid").click();
          $("#editor-wrapper-" + index + " .switch-language[data-language='default']").addClass("is-invalid").click();
          $("#editor-wrapper-" + index + " .message-editor").addClass("is-invalid");
          formHasError = true;
        }

        // check default subject
        if (editors[index].channels[editors[index].channel].showSubject === true) {
          if (editors[index].subject.default === "") {
            $("#campaign-tab-" + index).addClass("is-invalid").click();
            $("#editor-wrapper-" + index + " .switch-language[data-language='default']").addClass("is-invalid").click();
            $("#editor-wrapper-" + index + " .subject-editor").addClass("is-invalid");
            formHasError = true;
          }
        }

        // Check also the variations of the default message
        if (editors[index].body.variations && editors[index].body.variations.length > 0) {
          for (let i = 0; i < editors[index].body.variations.length; i++) {
            let variation = editors[index].body.variations[i];
            let lang = variation.lang;

            if ($.trim(variation.body) === "") {
              $("#campaign-tab-" + index).addClass("is-invalid").click();
              $("#editor-wrapper-" + index + " .switch-language[data-language='" + lang + "']").addClass("is-invalid").click();
              $("#editor-wrapper-" + index + " .message-editor").addClass("is-invalid");

              if (errorOnce === false) {
                formHasError = true;
                errorOnce = true;
              }
            }

            // check lang subject
            if (editors[index].channels[editors[index].channel].showSubject === true) {

              let variation = editors[index].subject.variations[i];
              let lang = variation.lang;

              if ($.trim(variation.body) === "") {
                $("#campaign-tab-" + index).addClass("is-invalid").click();
                $("#editor-wrapper-" + index + " .switch-language[data-language='" + lang + "']").addClass("is-invalid").click();
                $("#editor-wrapper-" + index + " .subject-editor").addClass("is-invalid");

                if (errorOnce === false) {
                  formHasError = true;
                  errorOnce = true;
                }
              }
            }

          }
        }
        
      });

      // ------------------------------- //
      // Check dates
      // ------------------------------- //
      let _startDate = stent.flatpickr.pickers["start-date"].input.value;
      let _endDate = stent.flatpickr.pickers["end-date"].input.value;

      if (_startDate !== "" && _endDate !== "") {
        // Be sure that the end date is at least one day after the start date

        let _momentStartDate = moment(_startDate);
        let _momentEndDate = moment(_endDate);
        let _countDays = _momentEndDate.diff(_momentStartDate, "days");

        if (_countDays < 1) {
          errors.push({
            id: "end-date",
            message: "The end date should be at least one day later than the start date.",
          });
          formHasError = true;
        }
      }

      // ------------------------------- //
      // Check week days, at least one selected
      // ------------------------------- //
      let _selectedDays = [];
      $.each($("input[name='weekDays']:checked"), function(){
        _selectedDays.push($(this).val());
      });
      if (_selectedDays.length === 0) {
        $("#advanced-configuration-wrapper").addClass("open");
        errors.push({
          id: "week-days-wrapper span:last-child",
          message: "Please select at least one day in the week.",
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
      let messages = stent.campaign.getCleanedEditors();
      let cronEditor = stent.cronEditor.get("campaign-schedule");
      let timezone = cronEditor.timezone;
      let slots = cronEditor.crons.map(function (item) {
        return {
          cron: item.cron,
          duration: item.duration,
        };
      });

      // Transform CRON
      let _selectedDays = [];
      let _selectedDaysString = "";
      $.each($("input[name='weekDays']:checked"), function(){
        _selectedDays.push($(this).val());
      });

      // Change the CRON only if the all days are not selected, otherwise the value is "*", and the cron editor returns already this value
      if (_selectedDays.length < 7) {
        _selectedDaysString = _selectedDays.join(",");

        slots = cronEditor.crons.map(function (item) {

          let cron = item.cron;
          cron = cron.split(" ");
          cron[4] = _selectedDaysString;
          cron = cron.join(" ");

          return {
            cron: cron,
            duration: item.duration,
          };
        });

      }

      let campaign = {
        flow: _campaignFlow,
        name: $("#campaign-name").val(),
        program: $("#campaign-program").val(),
        description: $("#campaign-description").val(),
        status: $("[name='campaign-status']:checked").val(),
        target: $("#campaign-target").val(),
        identity: {
          identityKey: $("#campaign-sender").val(),
        },
        schedule: {
          timezone: timezone,
          slots: slots,
          startDate: stent.flatpickr.pickers["start-date"].input.value !== "" ? stent.flatpickr.pickers["start-date"].input.value : null,
          endDate: stent.flatpickr.pickers["end-date"].input.value !== "" ? stent.flatpickr.pickers["end-date"].input.value : null,
        },
        parameters: {
          cohort: {
            size: parseInt($("#cohort-size").val(), 10),
          },
          source: {
            id: $("#campaign-source").val(),
          },
        },
        notifications: {
          mobile: $("#mobile-notification").is(":checked"),
          email: $("#email-notification").is(":checked")
        },
        messages: messages,
      };

      // Original campaign
      let _originalCampaign = stent.campaign.get();

      // Manage hold
      if (_originalCampaign && _originalCampaign.hold === true) {
        campaign.hold = true;
      } else {
        campaign.hold = false;
      }

      // Manage queueId
      if (_originalCampaign &&
          _originalCampaign.parameters &&
          _originalCampaign.parameters.source &&
          _originalCampaign.parameters.source.queueId &&
          !_isInDuplication) {
        campaign.parameters.source.queueId = _originalCampaign.parameters.source.queueId;
      }

      // Manage approval object
      let approval = {
        type: $("#approval").is(":checked") ? "optin" : "optout"
      };
      if (approval.type === "optin") {
        approval.method = $("#approvalType").val();
      }
      campaign.approval = approval;

      stent.loader.show(".main-content");
      let campaignPutUrl = "/campaigns/" + stent.tenant.key;
      if (_campaignId) {
        stent.ajax.putRest(campaignPutUrl + "/" + _campaignId, campaign, onAfterSave);
      } else {
        stent.ajax.postRest(campaignPutUrl, campaign, onAfterSave);
      }
    };

    const onAfterSave = function () {
      stent.loader.hide();
      stent.ui.pushState("campaign-list-hire-linkedin-cohort", false, "campaign-list-hire-linkedin-cohort");
      stent.ui.load({ fileToLoad: "campaign-list-hire-linkedin-cohort" });
    };

    const initCalendars = function () {
      let _campaign = stent.campaign.get();

      // In Edition mode
      if (_campaign != null && _campaign.started != null && _campaign.started !== "" && _campaign.started > 0) {
        // Readonly on StartDate
        $("#start-date").prop("disabled", true).prop("readonly", true);
      } else {
        // Set Min date on Start Date
        stent.flatpickr.pickers["start-date"].set("minDate", moment().format("YYYY-MM-DD"));
      }

      // Set Min date on End Date
      stent.flatpickr.pickers["end-date"].set("minDate", moment().add(1,"days").format("YYYY-MM-DD"));

    };

    const init = async function () {
      // master loader
      stent.loader.show(".main-content");

      // Active corresponding menu
      stent.navbar.activeMenu("campaign-list-hire-linkedin-cohort");

      // change Page title
      stent.ui.setPageTitle("Hire campaign creation / edition");

      // Populate Campaigns Names & Programs with all available values in tenant
      await stent.campaign.populateCampaignNamePicker();
      await stent.campaign.populateCampaignProgramPicker();
      await stent.campaign.populateSenderPicker();

      initCalendars();

      stent.campaign.startForm(
        editorsConfiguration,
        "Create a hire campaign",
        populateSourcePicker,
        fillForm,
        sourcesURLFunction
      );

      bindEvents();
    };

    init();
  })();
});
