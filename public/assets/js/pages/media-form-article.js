"use strict";

(function() {

  let _media = stent.media.form.getMedia();
  let _mediaId = stent.media.form.getMediaId();

  const createMedia = async function(mediaObject) {

    // archive media
    let query = `
      mutation {
        workspaceContext {
          createArticleMedia(input: {
            url: "${mediaObject.url}"
            title: "${mediaObject.title}"
            summary: "${mediaObject.summary}"
            thumbnailUrl: "${mediaObject.thumbnailUrl}"
          }) {
            media {
              id
            }
          }
        }
      }`;

    stent.konsole.group("createArticleMedia");
    stent.konsole.log({data: query});

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.createArticleMedia &&
      result.message.data.workspaceContext.createArticleMedia.media &&
      result.message.data.workspaceContext.createArticleMedia.media.id
    ) {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.createArticleMedia});
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


  const updateMedia = async function(mediaObject) {

    // archive media
    let query = `
      mutation {
        workspaceContext {
          updateArticleMedia(
            id: "${_mediaId}"
            input: {
              url: "${mediaObject.url}"
              title: "${mediaObject.title}"
              summary: "${mediaObject.summary}"
              thumbnailUrl: "${mediaObject.thumbnailUrl}"
          }) {
            media {
              id
            }
          }
        }
      }`;

    stent.konsole.group("updateArticleMedia");
    stent.konsole.log({data: query});

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.updateArticleMedia &&
      result.message.data.workspaceContext.updateArticleMedia.media &&
      result.message.data.workspaceContext.updateArticleMedia.media.id
    ) {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.updateArticleMedia});
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

    let media = result;

    stent.konsole.group("media");
    stent.konsole.log({data: media});
    stent.konsole.endGroup();

    $("#media-title").val(media.title);
    $("#media-summary").val(media.summary);
    $("#media-original-url").val(media.contentUrl ? media.contentUrl : null);
    $("#media-picture-url").val(media.thumbnailUrl);

    if (media.thumbnailUrl) {
      displayPreviewImage(media.thumbnailUrl);
    }

    if (media.shortLink) { //TODO: does not exists in query
      $("#media-short-link").attr("href", media.shortLink);
      $("#media-short-link").text(media.shortLink);
      $("#media-short-link")
        .parent()
        .toggleClass("d-none");
    }
  };


  const fetchUrlData = function(url) {
    if (!url) {
      stent.toast.warning("Please enter a valid URL to fetch data from web page.");
      return;
    }

    $("#media-title").val("");
    $("#media-summary").val("");
    $("#media-picture-url").val("");

    stent.loader.show(".main-content");

    stent.ajax.getRest(
      "/links/parseUrl?url=" + url,
      function(data) {
        if (data) {
          $("#media-title").val(data.title);
          $("#media-summary").val(data.description);
          $("#media-picture-url").val(data.image);
          displayPreviewImage(data.image);
          stent.loader.hide();
        }
      },
      function () {
        stent.toast.danger("Error when trying to fetch data from your URL. Please try again.");
        displayPreviewImage("");
        stent.loader.hide();
      }
    );
  };


  const displayPreviewImage = function(imageURL) {

    if (!imageURL) {
      $("#preview-image").slideUp("fast");
    } else {
      $("#preview-image")
        .css("background-image", "url(" + imageURL + ")")
        .slideDown("fast");
    }

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

    $("#launch-get-url-data")
      .off("click")
      .on("click", function() {
        fetchUrlData($.trim($("#media-original-url").val()));
      });

    $("#media-picture-url")
      .off("input")
      .on("input", function() {
        displayPreviewImage($.trim($(this).val()));
      });

    $("#media-original-url")
      .off("keyup")
      .on("keyup", function(e) {
        if (e.keyCode == 13) {
          fetchUrlData($.trim($("#media-original-url").val()));
        }
      });

    // Upload image button
    $("#open-image-uploader").on("click", function() {
      uploadcare
        .openDialog(null, {
          publicKey: UPLOADCARE_PUBLIC_KEY_ARTICLE,
          imagesOnly: true,
          crop: "1200x627"
        })
        .done(function(file) {
          file.done(function(fileInfo) {
            $("#media-picture-url").val(fileInfo.cdnUrl);
            displayPreviewImage($.trim(fileInfo.cdnUrl));
          });
        });

      return false;
    });
  };


  const save = async function() {

    stent.loader.show(".main-content");

    let doCreateMedia = await createMedia({
      url: stent.utils.escapeJsonString($.trim($("#media-original-url").val())),
      title: stent.utils.escapeJsonString($.trim($("#media-title").val())),
      summary: stent.utils.escapeJsonString($.trim($("#media-summary").val())),
      thumbnailUrl: stent.utils.escapeJsonString($.trim($("#media-picture-url").val()))
    });

    if (doCreateMedia.ok) {
      stent.ui.pushState("media-list", false, "media-list");
      stent.ui.load({ fileToLoad: "media-list" });
    } else {
      stent.loader.hide();
    }

  };

  const update = async function () {
    stent.loader.show(".main-content");

    let doUpdateMedia = await updateMedia({
      url: stent.utils.escapeJsonString($.trim($("#media-original-url").val())),
      title: stent.utils.escapeJsonString($.trim($("#media-title").val())),
      summary: stent.utils.escapeJsonString($.trim($("#media-summary").val())),
      thumbnailUrl: stent.utils.escapeJsonString($.trim($("#media-picture-url").val()))
    });

    if (doUpdateMedia.ok) {
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

    // Check media-original-url
    if ($.trim($("#media-original-url").val()) === "") {
      errors.push({
        id: "media-original-url",
        message: "Please set the original URL."
      });
      formHasError = true;
    } else if (!stent.utils.isValidURL($("#media-original-url").val())) {
      errors.push({
        id: "media-original-url",
        message: "The URL is not a valid URL."
      });
      formHasError = true;
    }

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

    // Check media-picture-url
    if ($.trim($("#media-picture-url").val()) === "") {
      errors.push({
        id: "media-picture-url",
        message: "Please set the picture URL."
      });
      formHasError = true;
    } else if (!stent.utils.isValidURL($("#media-picture-url").val())) {
      errors.push({
        id: "media-picture-url",
        message: "The picture URL is not a valid URL."
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
    }
  };

  init();


})();
