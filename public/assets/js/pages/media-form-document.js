"use strict";

(function() {

  let _media = stent.media.form.getMedia();
  let _mediaId = stent.media.form.getMediaId();
  let _fileData = null;
  let _fileSizeLimitMax = 100000000; // 100000000 = 100Mb
  let _autorizedFiles = [
    {
      extension: "pdf",
      mime: "application/pdf",
      icon: "/assets/img/media/pdf.svg",
      color: "#dc1d00"
    },
    {
      extension: "doc",
      mime: "application/msword",
      icon: "/assets/img/media/word.svg",
      color: "#1565c0"
    },
    {
      extension: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      icon: "/assets/img/media/word.svg",
      color: "#1565c0"
    },
    {
      extension: "ppt",
      mime: "application/vnd.ms-powerpoint",
      icon: "/assets/img/media/powerpoint.svg",
      color: "#ff5722"
    },
    {
      extension: "pptx",
      mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      icon: "/assets/img/media/powerpoint.svg",
      color: "#ff5722"
    }
  ];

  const createDocumentMedia = async function(mediaObject) {

    // archive media
    let query = `
      mutation {
        workspaceContext {
          createDocumentMedia(input: {
            url: "${mediaObject.url}"
            title: "${mediaObject.title}"
            summary: "${mediaObject.summary}"
            fileName: "${mediaObject.fileName}"
          }) {
            media {
              id
            }
          }
        }
      }`;

    stent.konsole.group("createDocumentMedia");
    stent.konsole.log({data: query});

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.createDocumentMedia &&
      result.message.data.workspaceContext.createDocumentMedia.media &&
      result.message.data.workspaceContext.createDocumentMedia.media.id
    ) {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.createDocumentMedia});
        stent.konsole.endGroup();
      }

      return {
        ok: true
      };

    } else {

      if (stent.log) {
        stent.konsole.error({response: result});
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to create the media. Please try again.");

      return {
        ok: false
      };
    }
  };


  const updateDocumentMedia = async function(mediaObject) {

    // archive media
    let query = `
      mutation {
        workspaceContext {
          updateDocumentMedia(
            id: "${_mediaId}"
            input: {
              url: "${mediaObject.url}"
              title: "${mediaObject.title}"
              summary: "${mediaObject.summary}"
              fileName: "${mediaObject.fileName}"
          }) {
            media {
              id
            }
          }
        }
      }`;

    stent.konsole.group("updateDocumentMedia");
    stent.konsole.log({data: query});

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.updateDocumentMedia &&
      result.message.data.workspaceContext.updateDocumentMedia.media &&
      result.message.data.workspaceContext.updateDocumentMedia.media.id
    ) {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.updateDocumentMedia});
        stent.konsole.endGroup();
      }

      return {
        ok: true
      };

    } else {

      if (stent.log) {
        stent.konsole.error({response: result});
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to update the media. Please try again.");

      return {
        ok: false
      };
    }
  };

  // Initialize form data
  const buildFormData = function(result) {

    if (result && result.errors) {
      $(".alert").html(result.errors[0].message);
      $(".alert").toggleClass("d-none");
      $("#media-form-loader").hide();
      return;
    }

    if (!result) {
      $(".alert").html("<strong>No medium defined or medium does not exist anymore</strong>");
      $(".alert").toggleClass("d-none");
    } else {
      let media = result;
      $("#media-title").val(media.title);
      $("#media-summary").val(media.summary);
    }
  };

  const resetForm = function () {
    _fileData = null;
    resetFileInfo();
  };

  const resetFileInfo = function () {
    $("#finder-file-info").html("");
  };

  const acceptedFormatsOnly = function (fileInfo) {
    // Check before upload
    if (fileInfo.cdnUrl === null && fileInfo.sourceInfo.file) {
      let selectedFileType = fileInfo.sourceInfo.file.type;
      let extensionFound = false;
      _autorizedFiles.forEach(extension => {
        if (selectedFileType === extension.mime) {
          extensionFound = true;
        }
      });

      if (!extensionFound) {
        throw new Error("You can only upload PDF, DOC, DOCX, PPT and PTTX files.");
      }
    }
  };

  const fileSizeLimit = function (fileInfo) {
    if (fileInfo.cdnUrl === null && fileInfo.sourceInfo.file) {
      let fileSize = fileInfo.sourceInfo.file.size;
      if (fileSize > _fileSizeLimitMax) {
        throw new Error("You file is too large (100Mb max)");
      }
    }
  };

  const openUploadCareDialog = function () {
    uploadcare
      .openDialog(null, {
        publicKey: UPLOADCARE_PUBLIC_KEY_MEDIAS,
        validators: [
          acceptedFormatsOnly,
          fileSizeLimit
        ]
      })
      .done(function(file) {

        stent.loader.show(".main-content");

        file.fail(function(error) {
          _fileData = null;
          stent.utils.log(error + ". There was an error when uploading your file. Plese try again.");
          stent.toast.danger(error);
          stent.loader.hide();
        });

        // Success
        file.done(function(fileData) {
          resetForm();
          _fileData = {...fileData};
          displayFileInfo();
          stent.loader.hide();
        });

      });
  };

  const displayFileInfo = function() {

    let html = "";
    let filename;
    let filesize;
    let filemime;
    let _fileConfig;

    if (_fileData !== null) {

      filename = _fileData.name;
      filesize = _fileData.size ? stent.utils.humanFileSize(_fileData.size, true) : null;
      filemime = _fileData.mimeType ? _fileData.mimeType : null;

      if (!filemime) {
        let fileExtension = filename.split(".").pop();
        _fileConfig = _autorizedFiles.filter(extension => extension.extension === fileExtension)[0];
      } else {
        _fileConfig = _autorizedFiles.filter(extension => extension.mime === filemime)[0];
      }

      /* eslint-disable */
      html = `
        <div class="row no-gutters justify-content-center align-items-center">
          <div class="col-auto">
            <div class="media-image-wrapper mr-3" style="background-color: ${_fileConfig.color}">
              <img src="${_fileConfig.icon}" />
            </div>
          </div>
            <div class="col">
              ${filename}
              ${filesize ? `<small class="text-muted">${filesize}</small>`: ""}
              ${_mediaId ? 
                `
                <a href="${_media.contentUrl}" target="_blank" style="position: relative; top: 2px;">
                  <span class="fe fe-link ml-1"></span>
                </a>
                ` : ""
                }
            </div>
        </div>
        `;
    }

    $("#finder-file-info").html(html);
  };


  const bindEvents = function() {
    $("#media-save")
      .off("click")
      .on("click", function() {
        if (checkForm()) {
          if (_mediaId) {
            update();
          } else {
            save();
          }
        }
      });

    $("#open-upload-care").on("click", function() {
      openUploadCareDialog();
    });
  };


  const save = async function() {

    stent.loader.show(".main-content");

    let mediaTitle = stent.utils.escapeJsonString($.trim($("#media-title").val()));
    let mediaSummary = stent.utils.escapeJsonString($.trim($("#media-summary").val()));
    let mediaFilename = _fileData.name;
    let mediaFileGuid = _fileData.cdnUrl.split('/')[3];
    let mediaFileExtension = mediaFilename.split('.').pop();
    let mediaFileURL = `https://stentmedia.s3.amazonaws.com/${mediaFileGuid}/${mediaFileGuid}.${mediaFileExtension}`;

    let doCreateDocument = await createDocumentMedia({
      url: mediaFileURL,
      title: mediaTitle,
      summary: mediaSummary,
      fileName: mediaFilename
    });

    if (doCreateDocument.ok) {
      stent.ui.pushState("media-list", false, "media-list");
      stent.ui.load({ fileToLoad: "media-list" });
    } else {
      stent.loader.hide();
    }

  };

  const update = async function () {
    stent.loader.show(".main-content");

    let mediaTitle = stent.utils.escapeJsonString($.trim($("#media-title").val()));
    let mediaSummary = stent.utils.escapeJsonString($.trim($("#media-summary").val()));
    let mediaFilename = _fileData.name;
    let mediaFileGuid = _fileData.cdnUrl.split('/')[3];
    let mediaFileExtension = mediaFilename.split('.').pop();
    let mediaFileURL = `https://stentmedia.s3.amazonaws.com/${mediaFileGuid}/${mediaFileGuid}.${mediaFileExtension}`;

    let doUpdateDocument = await updateDocumentMedia({
      url: mediaFileURL,
      title: mediaTitle,
      summary: mediaSummary,
      fileName: mediaFilename
    });

    if (doUpdateDocument.ok) {
      stent.ui.pushState("media-list", false, "media-list");
      stent.ui.load({ fileToLoad: "media-list" });
    } else {
      stent.loader.hide();
    }
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
      stent.toast.danger("The form has errors, please correct them to save your media.");
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

    // Check media-title
    if ($.trim($("#media-title").val()) === "") {
      errors.push({
        id: "media-title",
        message: "Please set the title."
      });
      formHasError = true;
    }

    // Check media-summary
    if ($.trim($("#media-summary").val()) === "") {
      errors.push({
        id: "media-summary",
        message: "Please set the summary."
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

  const init = function() {
    bindEvents();

    if (_media) {
      buildFormData(_media);
      _fileData = {
        name: _media.fileName,
        cdnUrl: _media.contentUrl
      };
      displayFileInfo();
    }
  };

  init();


})();
