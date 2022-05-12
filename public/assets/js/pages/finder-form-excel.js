"use strict";

stent.finders.excel = (function () {

  let _hasHeaders = true;
  let _entity = $("#finder-output").val();

  let _members = null;
  let _fileData = null;
  let _mapping = null;
  let _finder = null;
  let _isReadOnly = false;
  let _fields = null;

  const updateMapping = function () {

    _mapping.forEach((column) => {

      let $inputColumn = $(".finder-mapping-column-id[data-column-id=\"" + column.source.id + "\"]");
      let $mapping = $inputColumn.closest(".finder-mapping");
      let mappingIsDisabled = $mapping.closest(".finder-mapping").hasClass("finder-mapping-disabled") || $mapping.find(".finder-mapping-field").val() === "";

      if (mappingIsDisabled) {
        column.destination = "";
      } else {
        column.destination = $mapping.find(".finder-mapping-field").val();
      }
    });

  };

  const buildMappingDOM = function (mapping, hasHeaders, fields) {

    let html = "";

    if (mapping.length > 0) {
      mapping.forEach(column => {

        let displayedValue = "Col. " + column.source.id + " (" + column.source.data + ")";

        if (hasHeaders) {
          displayedValue = column.source.data;
        }

        /*eslint-disable*/
        html += `
            <div class="row finder-mapping ${column.destination === '' ? ` finder-mapping-disabled` : ``}">
              <div class="col-5">
                <input data-column-id="${column.source.id}" type="text" class="finder-mapping-column-id form-control" disabled="disabled" readonly="readonly" value="${displayedValue}" />
              </div>
              <div class="col-2 text-center">
                <div class="mapping-button">
                  <span class="fe fe-arrow-right"></span>
                </div>
              </div>
              <div class="col-5">
                <select class="form-control finder-mapping-field">
                  <option value="">Not mapped</option>
                  ${fields.map(field => {
          return `
                        <option 
                          value="${field.key}" 
                          ${column.destination !== '' && column.destination === field.key ? ` selected="selected"` : ``}>
                            ${field.value}
                        </option>
                      `
        })
          }
                </select>
              </div>
            </div>
            <hr />
            `;
        /*eslint-enable*/
      });

      return html;

    } else {

      stent.toast.danger("Your file does not contains data that can be imported. Please use another file.");
      return null;

    }

  };


  const toggleHasHeaders = function () {
    _hasHeaders = !_hasHeaders;

    if (_mapping !== null) {
      _mapping.forEach(column => {

        let displayedValue = "Col. " + column.source.id + " (" + column.source.data + ")";
        if (_hasHeaders) {
          displayedValue = column.source.data;
        }
        $(".finder-mapping-column-id[data-column-id=\"" + column.source.id + "\"]").val(displayedValue);
      });
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

    // Switch _hasHeaders
    $("#has-header")
      .off("change")
      .on("change", function () {
        stent.finders.form.cleanErrors();
        toggleHasHeaders();
      });

    // Switch state of mapping row
    // $(".main-content")
    //   .off("click")
    //   .on("click", ".mapping-button", function () {

    //     stent.finders.form.cleanErrors();
    //     updateMapping();
    //   });

    $(".main-content")
      .off("input")
      .on("input", ".finder-mapping-field", function () {
        stent.finders.form.cleanErrors();
        if ($(this).val() === "") {
          $(this).closest(".row").addClass("finder-mapping-disabled");
        } else {
          $(this).closest(".row").removeClass("finder-mapping-disabled");
        }

        updateMapping();
      });

    $("#open-upload-care").on("click", function () {
      openUploadCareDialog();
    });

    $("[name='finder-status']")
      .off("change")
      .on("change", function () {
        stent.finders.form.onChangeStatus($(this).val());
      });
  };


  const resetForm = function () {
    _fileData = null;
    stent.finders.form.cleanErrors();
    resetFileInfo();
    toggleFinderMapping(false);
  };


  const openUploadCareDialog = function () {
    uploadcare
      .openDialog(null, {
        publicKey: UPLOADCARE_PUBLIC_KEY_FINDERS
      })
      .done(function (file) {

        stent.loader.show(".main-content");

        file.fail(function (error) {
          _fileData = null;
          stent.utils.log(error + ". There was an error when uploading your file. Plese try again.");
          stent.toast.danger(error);
          stent.loader.hide();
        });

        // Success
        file.done(function (fileData) {
          resetForm();
          _fileData = { ...fileData };
          processFile();
        });

      });
  };


  const processFile = async function () {

    let fetchedMapping = await fetchTransformedFile();

    if (fetchedMapping && fetchedMapping.ok === true && fetchedMapping.message && fetchedMapping.message.length > 0) {

      // Try to keep the old mapping with the new file
      if (_mapping !== null) {
        let tempMapping = [...fetchedMapping.message];
        tempMapping.forEach(field => {
          let fieldId = field.source.id;
          if (_mapping[fieldId] && _mapping[fieldId].destination !== "") {
            field.destination = _mapping[fieldId].destination;
          }
        });

        _mapping = [...tempMapping];

      } else {

        if (!$("#has-header").is(":checked")) {
          $("#has-header").click();
        }

        _mapping = [...fetchedMapping.message];
      }

      $("#finder-mapping-content").html(buildMappingDOM(_mapping, _hasHeaders, _fields));
      displayFileInfo();
      toggleFinderMapping();
    } else {
      _fileData = null;
      stent.toast.danger("We're unable to find columns with data in your file. Plese try again or use another file.");
    }

    stent.loader.hide();

  };


  const fetchTransformedFile = async function () {
    try {
      return await stent.ajax.getRestAsync("/finders/tenants/" + stent.tenant.key + "/excel/" + _fileData.uuid);
    } catch (err) {
      return err;
    }
  };


  const toggleFinderMapping = function (bool) {
    if (bool === false) {
      $("#finder-mapping-wrapper").addClass("d-none");
    } else if (bool === true) {
      $("#finder-mapping-wrapper").removeClass("d-none");
    } else {
      $("#finder-mapping-wrapper").toggleClass("d-none");
    }

  };


  const resetFileInfo = function () {
    $("#finder-file-info").html("");
  };


  const displayFileInfo = function () {
    let html = "";
    let filename;
    let filesize;
    let filetype;

    if (_fileData !== null) {

      filename = _fileData.name;
      filesize = stent.utils.humanFileSize(_fileData.size, true);

      switch (_fileData.mimeType) {
        case "application/octet-stream":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          filetype = "excel";
          break;

        case "text/csv":
        case "text/plain":
          filetype = "csv";
          break;

        default:
          filetype = "unknown";
          break;
      }

      html = `
            <img src="/assets/img/finders/${filetype}.svg" class="finder-file-image mr-3" />
            ${filename}<small class="text-muted"> / ${filesize}</small>
        `;
    }

    $("#finder-file-info").html(html);
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

    // Check if a file has been uploaded
    if (!stent.finders.form.isInEdition() && !stent.finders.form.isInDuplication() && _fileData === null) {
      errors.push({
        selector: "#finder-file-wrapper .card",
        message: "Please upload a file."
      });
      formHasError = true;
    }

    // Check if there is at least one mapping
    if (_mapping !== null && _mapping.length > 0) {
      const hasMapping = _mapping.filter(column => column.destination !== "").length > 0;
      if (!hasMapping) {
        errors.push({
          selector: "#finder-mapping-wrapper .card",
          message: "Please map at least one field."
        });
        formHasError = true;
      }
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

  const readOnlyForm = function () {
    $("#finder-name").prop("disabled", true);
    $("#finder-member").parent().append("<div class=\"alert alert-warning mt-3\" role=\"alert\">The owner is no longer member of this workspace, no change are allowed.</div>");
    $("#finder-miners").prop("disabled", true);
    $("#finder-file-wrapper .card").css("background-color", "#fbf9fd");
    $("#finder-file-wrapper *").css("pointer-events", "none");
    $("#open-upload-care").css("opacity", 0.5);
    $("#has-header").prop("disabled", true);
    $(".finder-mapping-field").prop("disabled", true);
    $("#finder-status-wrapper").closest(".card").css("background-color", "#fbf9fd");
    $("#finder-status-wrapper").closest(".form-group").find("*").css("pointer-events", "none");
    $("#finder-status-wrapper").closest(".form-group").find("label").css("opacity", 0.5);
    stent.cronEditor.readOnly("finder-schedule");
    $("#cohort-size").prop("disabled", true);
    $("#finder-save").remove();
    $("#emailLookup").prop("disabled", true);
    stent.finders.form.target.readOnly();
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
        if (_finder.identity.identityKey) {
          $("#finder-member option[value='" + _finder.identity.identityKey + "']").prop("selected", true);
          if (stent.finders.form.isInEdition()) {
            $("#finder-member").attr("readonly", "readonly").attr("disabled", "disabled");
          }
          $("#finder-member").trigger("change");
        }
      }

      // Target Management
      if (_entity !== "company") {
        stent.finders.form.target.fill();
      }

      // finder-miners
      if (_finder.identity.miners && Array.isArray(_finder.identity.miners) && _finder.identity.miners.length > 0) {
        for (let i = 0; i < _finder.identity.miners.length; i++) {
          $("#finder-miners option[value='" + _finder.identity.miners[i] + "']").prop("selected", true);
        }
        $("#finder-miners").trigger("change");
      }

      // has header
      if (_finder.provisioner && _finder.provisioner.hasHeaders === false) {
        $("#has-header").removeAttr("checked");
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


    }

  };


  const save = async function () {

    stent.loader.show("#finder-form");

    let identityId = $("#finder-member").val();

    // If we're in edit mode, and the File was not changed
    let fileUrl;

    if ((stent.finders.form.isInEdition() || stent.finders.form.isInDuplication()) && _fileData === null) {
      fileUrl = _finder.provisioner.fileUrl;
    } else {

      let fileExtension = "";
      if (_fileData.name.includes(".")) {
        let getExtension = _fileData.name.split(".");
        getExtension = getExtension[getExtension.length - 1];
        if (getExtension !== "") {
          fileExtension = "." + getExtension;
        }
      }

      fileUrl = "https://stentfinders.s3.amazonaws.com/" + _fileData.uuid + "/" + _fileData.uuid + fileExtension;
    }

    let cronEditor = stent.cronEditor.get("finder-schedule");
    let timezone = cronEditor.timezone;
    let slots = cronEditor.crons.map(function (item) {
      return {
        cron: item.cron,
        duration: item.duration
      };
    });

    let finder = {
      version: 4,
      channel: "linkedin",
      status: $("[name='finder-status']:checked").val(),
      emailLookup: $("#emailLookup").is(":checked"),
      identity: {
        identityKey: identityId,
        miners: $("#finder-miners").val()
      },
      name: $.trim($("#finder-name").val()),
      entity: _entity,
      output: {
        type: "segment"
      },
      provisioner: {
        hasHeaders: _hasHeaders,
        type: $("#finder-source").val(),
        cron: "0 1 * * *",
        fileUrl: fileUrl,
        mapping: _mapping
      },
      schedule: {
        batch: parseInt($("#cohort-size").val(), 10),
        timezone: timezone,
        slots: slots
      }
    };

    if (_entity !== "company") {
      // TARGET
      finder.target = stent.finders.form.target.getTarget();

      // PERSONA
      let persona = stent.finders.form.target.getPersona();
      if (persona) {
        finder.provisioner.persona = persona;
      }
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

    stent.finders.form.populateMembersSelect(_members);
    stent.finders.form.populateMinersSelect(_members);

    stent.finders.form.target.init(_entity);

    // ############################ //
    // EDITION MODE
    // ############################ //

    if (stent.finders.form.isInEdition() || stent.finders.form.isInDuplication()) {

      _finder = stent.finders.form.getCurrentItem();
      _mapping = _finder.provisioner.mapping;
      _fileData = null;

      if (_finder.provisioner && _finder.provisioner.hasHeaders === false) {
        _hasHeaders = false;
      } else {
        _hasHeaders = true;
      }

      fillForm();

      $("#finder-mapping-content").html(buildMappingDOM(_mapping, _hasHeaders, _fields));

      toggleFinderMapping(true);

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

  return {
    get: function () {
      return {
        hasHeaders: _hasHeaders,
        fileData: _fileData,
        mapping: _mapping,
        fields: _fields
      };
    },
    setFields: function (fields) {
      _fields = [...fields];
    },
    init
  };

})();

