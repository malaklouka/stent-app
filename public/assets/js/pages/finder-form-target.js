"use strict";

stent.finders.form.target = (function () {

  let _fileDataPersonaPDF = null;
  let _originalTarget = null;
  let _entity = null;

  const readOnly = function () {
    if (_entity !== "company") {
      $("#finder-target").prop("disabled", true);
      $("#finder-persona-wrapper").find("*").css("pointer-events", "none");
      $("#finder-persona-wrapper").find(".card").css("background-color", "#fbf9fd");
      $("#open-upload-care-pdf").css("opacity", 0.5);
      $("[name=\"finder-persona-source\"]").prop("disabled", true);
    }
  };

  const togglePersona = function (target) {
    if (target === "candidate") {
      $("#finder-persona-wrapper").removeClass("d-none");
    } else {
      $("#finder-persona-wrapper").addClass("d-none");
    }
  };

  const resetForm = function () {
    if (_entity !== "company") {
      _fileDataPersonaPDF = null;
      resetPersonaFileInfo();
    }
  };

  const resetPersonaFileInfo = function () {
    $("#finder-persona-file-info").html("");
  };

  const openUploadCarePersonaPDFDialog = function () {

    let _autorizedFiles = [
      {
        extension: "pdf",
        mime: "application/pdf",
      },
    ];

    const acceptedFormatsOnly = function (fileInfo) {
      // Check before upload
      if (fileInfo.cdnUrl === null && fileInfo.sourceInfo.file) {
        let selectedFileType = fileInfo.sourceInfo.file.type;
        let extensionFound = false;
        _autorizedFiles.forEach((extension) => {
          if (selectedFileType === extension.mime) {
            extensionFound = true;
          }
        });

        if (!extensionFound) {
          throw new Error("You can only upload PDF files.");
        }
      }
    };

    uploadcare
      .openDialog(null, {
        publicKey: UPLOADCARE_PUBLIC_KEY_PERSONA_PDF,
        validators: [acceptedFormatsOnly],
      })
      .done(function(file) {

        stent.loader.show(".main-content");

        file.fail(function(error) {
          _fileDataPersonaPDF = null;
          stent.utils.log(error + ". There was an error when uploading your file. Plese try again.");
          stent.toast.danger(error);
          stent.loader.hide();
        });

        // Success
        file.done(function(fileData) {
          let uploadCareFileGetMetadata = "https://upload.uploadcare.com/info/?file_id=" + fileData.uuid + "&pub_key=" + UPLOADCARE_PUBLIC_KEY_PERSONA_PDF;
          $.get(uploadCareFileGetMetadata, function( data ) {
            fileData.filename = data.filename;
            resetForm();
            _fileDataPersonaPDF = {...fileData};
            displayPersonaFileInfo();
            stent.loader.hide();
          });
        });

      });
  };

  const displayPersonaFileInfo = function(showHyperlink = false) {
    let html = "";
    let filename;
    let filesize;
    let filetype;

    if (_fileDataPersonaPDF !== null) {

      filename = _fileDataPersonaPDF.name;
      filesize = _fileDataPersonaPDF.size ? stent.utils.humanFileSize(_fileDataPersonaPDF.size, true) : null;

      switch (_fileDataPersonaPDF.mimeType) {
        case "application/pdf":
          filetype = "pdf";
          break;

        default:
          filetype = "unknown";
          break;
      }

      if (showHyperlink && _fileDataPersonaPDF.fileUrl) {
        html += `<a href="${_fileDataPersonaPDF.fileUrl}" target="_blank">`;
      }

      html += `
              <img src="/assets/img/finders/${filetype}.svg" class="finder-file-image mr-3" />
              ${filename}
              ${filesize ? `<small class="text-muted"> / ${filesize}</small>`: ""}
          `;

      if (showHyperlink && _fileDataPersonaPDF.fileUrl) {
        html += "</a>";
      }
    }

    $("#finder-persona-file-info").html(html);
  };

  const alertOnChangeIfNecessary = function (newTargetValue) {
    setTimeout(
      () => {
        if (stent.finders.form.isInEdition() && _originalTarget !== newTargetValue && newTargetValue !== "") {
          if (newTargetValue === "candidate") {
            alert("By changing the target to \"candidate\", a new step will process the result and display the accounts ranked by similarity regarding the persona.");
          } else if (_originalTarget === "candidate") {
            alert(`By changing the target from "candidate" to "${newTargetValue}", the accounts will no more be ranked by similarity regarding the persona`);
          }
        }
      }, 250
    );

  };

  const fill = function () {

    let _finder = stent.finders.form.getCurrentItem();

    if (_entity !== "company") {

      // finder-target
      if (_finder.target) {

        _originalTarget = _finder.target;

        $("#finder-target option[value='" + _finder.target + "']").prop("selected", true);
        $("#finder-target").trigger("change");

        if (_finder.target === "candidate") {
          if (_finder.provisioner && _finder.provisioner.persona && _finder.provisioner.persona.source === "file" && _finder.provisioner.persona.fileUrl) {

            let fileUrl = _finder.provisioner.persona.fileUrl;
            let name = _finder.provisioner.persona.name ? _finder.provisioner.persona.name : fileUrl.split("/")[fileUrl.split("/").length - 1];
            let filename = _finder.provisioner.persona.filename ? _finder.provisioner.persona.filename : fileUrl.split("/")[fileUrl.split("/").length - 1];
            let uuid = fileUrl.split("/")[fileUrl.split("/").length - 2];
            if (uuid.includes(".")) {
              uuid = uuid.split(".")[0];
            }

            _fileDataPersonaPDF = {
              uuid: uuid,
              name: name,
              filename: filename,
              mimeType: "application/pdf",
              fileUrl: fileUrl
            };

            displayPersonaFileInfo(true);
          }
        }
      } else {
        $("#finder-target option[value='other']").prop("selected", true);
      }
    }

  };

  const checkForm = function () {

    if (_entity === "company") {
      return true;
    }

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

    // Check finder-target
    if ($.trim($("#finder-target").val()) === "") {
      errors.push({
        selector: "#finder-target",
        message: "Please choose a target.",
      });
      formHasError = true;
    }

    // Check Persona if finder-target is equal to "candidate"
    if ($.trim($("#finder-target").val()) === "candidate") {
      if ($("[name=\"finder-persona-source\"]:checked").val() === "file") {
        if (!_fileDataPersonaPDF || !_fileDataPersonaPDF.uuid) {
          errors.push({
            selector: "#finder-persona-wrapper .card",
            message: "Please add a PDF file.",
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

  const getTarget = function () {
    return $("#finder-target").val();
  };

  const getPersona = function () {

    let out = null;
    let target = getTarget();
    let personaSource = null;

    if (target === "candidate") {
      personaSource = $("[name='finder-persona-source']:checked").val();

      let personaFileUrl = null;

      // PERSONA MANAGEMENT
      if (personaSource === "file") {
        personaFileUrl = "https://stentrecruiter.s3.amazonaws.com/" + _fileDataPersonaPDF.uuid + "/" + _fileDataPersonaPDF.filename;
      }

      out = {
        source: personaSource,
        fileUrl: personaFileUrl,
        name: _fileDataPersonaPDF.name,
        filename: _fileDataPersonaPDF.filename
      };


    }

    return out;

  };

  const bindEvents = function () {

    $("body")
      .off("change", "#finder-target")
      .on("change", "#finder-target", function () {
        alertOnChangeIfNecessary($(this).val());
        togglePersona($(this).val());
      });

    $("body")
      .off("change", "[name='finder-persona-source']")
      .on("change", "[name='finder-persona-source']", function () {
        let clickedSource = $("[name='finder-persona-source']:checked").val();
        $(".finder-persona-source-wrapper").addClass("d-none");
        $("#finder-persona-source-wrapper-" + clickedSource).removeClass("d-none");
      });

    $("body")
      .off("click", "#open-upload-care-pdf")
      .on("click", "#open-upload-care-pdf", function() {
        openUploadCarePersonaPDFDialog();
      });

  };

  const init = function (entity) {
    _entity = entity;

    if (_entity !== "company") {
      bindEvents();
    } else {
      $("#finder-target-persona-wrapper").remove();
    }
  };

  return {
    readOnly: readOnly,
    fill: fill,
    checkForm: checkForm,
    getTarget: getTarget,
    getPersona: getPersona,
    init: init
  };
})();