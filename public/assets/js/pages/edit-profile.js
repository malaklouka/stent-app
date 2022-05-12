"use strict";

(function () {
  let _fileData = null;
  let _fileSizeLimitMax = 10000000; // 10000000 = 10Mb
  let _autorizedFiles = [
    {
      extension: "jpg",
      mime: "image/jpeg",
    },
    {
      extension: "jpeg",
      mime: "image/jpeg",
    },
    {
      extension: "png",
      mime: "image/png",
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
        throw new Error("You can only upload JPG, JPEG, PNG, GIF (not animated) files.");
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
        publicKey: UPLOADCARE_PUBLIC_KEY_AVATARS,
        validators: [acceptedFormatsOnly, fileSizeLimit],
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
          _fileData = { ...fileData };

          $("#avatar").attr("src", fileData.cdnUrl);
          $("#avatar-wrapper").removeClass("d-none");
          $("#button-upload").addClass("d-none");

          stent.loader.hide();
        });
      });
  };

  const updateUserProfile = async function (input) {
    const url = stent.api.api;
    const method = "POST";
    let bearer = "Bearer " + stent.auth.getBearer();
    const contentType = "application/json";

    const query = {
      query: `mutation updateCurrentUser($input: UserInput!) {
                userContext {
                  updateCurrentUser(input: $input) {
                    user {
                      email
                      firstName
                      id
                      lastName
                      pictureUrl
                    }
                  }
                }
              }`,
      variables: {
        input: input,
      },
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": contentType,
          Authorization: bearer,
        },
        body: JSON.stringify(query),
      });

      if (response.status === 200) {
        let jsonResponse = await response.json();
        let out = {
          ok: true,
          message: jsonResponse,
        };
        return out;
      } else {
        let errorMessage = await response.text();
        let out = {
          ok: false,
          error: {
            status: response.status,
            method: "getUserProfile",
            message: errorMessage,
          },
        };
        return out;
      }
    } catch (errorMessage) {
      let out = {
        ok: false,
        error: {
          status: "N/A",
          method: "getUserProfile",
          message: errorMessage,
        },
      };
      return out;
    }
  };

  const cleanErrors = function () {
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").remove();
  };

  const checkForm = function () {
    let formHasError = false;
    let errors = [];

    cleanErrors();

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

    // Check first-name
    if ($.trim($("#first-name").val()) === "") {
      errors.push({
        id: "first-name",
        message: "Please set your first name.",
      });
      formHasError = true;
    }

    // Check last-name
    if ($.trim($("#last-name").val()) === "") {
      errors.push({
        id: "last-name",
        message: "Please set your last name.",
      });
      formHasError = true;
    }

    // Check email
    if ($.trim($("#email").val()) === "") {
      errors.push({
        id: "email",
        message: "Please set your email.",
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

  const fillForm = function () {
    $("#first-name").val(stent.user.firstName);
    $("#last-name").val(stent.user.lastName);
    $("#email").val(stent.user.email);

    if (stent.user.pictureUrl) {
      $("#avatar").attr("src", stent.user.pictureUrl);
      $("#avatar-wrapper").removeClass("d-none");
    } else {
      $("#button-upload").removeClass("d-none");
    }
  };

  const removeAvatar = function () {
    _fileData = null;
    $("#avatar").attr("src", "");
    $("#avatar-wrapper").addClass("d-none");
    $("#button-upload").removeClass("d-none");
  };

  const save = async function () {
    let firstName = stent.utils.escapeJsonString($.trim($("#first-name").val()));
    let lastName = stent.utils.escapeJsonString($.trim($("#last-name").val()));
    let email = stent.utils.escapeJsonString($.trim($("#email").val()));

    let pictureUrl = null;

    // User change image
    if (_fileData) {
      let pictureId = _fileData.cdnUrl.split("/")[3];
      let pictureFileExtension = _fileData.name.split(".");
      if (pictureFileExtension.length > 0) {
        pictureFileExtension = "." + pictureFileExtension[pictureFileExtension.length - 1];
      }
      pictureUrl = `https://stentusers.s3.amazonaws.com/avatars/${pictureId}/${pictureId}${pictureFileExtension}`;
    }
    // User did not changed the avatar, but has already an image
    else if (!$("#avatar-wrapper").hasClass("d-none") && stent.user.pictureUrl) {
      pictureUrl = stent.user.pictureUrl;
    }

    let input = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      pictureUrl: pictureUrl,
    };

    let fetchUpdateUserProfile = await updateUserProfile(input);

    if (!fetchUpdateUserProfile.ok || fetchUpdateUserProfile.message.errors) {
      stent.toast.danger("Error when saving your modifications. Please try again.");
      return;
    }

    // Update stent.user
    stent.user.firstName = input.firstName;
    stent.user.lastName = input.lastName;
    stent.user.email = input.email;
    stent.user.pictureUrl = input.pictureUrl;

    // Update UI
    $("#user-name").text(stent.user.firstName + " " + stent.user.lastName);
    if (stent.user.pictureUrl) {
      $("#user-avatar").attr("src", stent.user.pictureUrl);
    } else {
      $("#user-avatar").attr("src", "/assets/img/avatars/profiles/default-avatar.gif");
    }

    stent.toast.success("Your modifications were successfully saved.");


  };

  const bindEvents = function () {
    $("#profile-save")
      .off("click")
      .on("click", function () {
        if (checkForm()) {
          save();
        }
      });

    $("#remove-avatar")
      .off("click")
      .on("click", function () {
        removeAvatar();
      });

    $(".open-upload-care").on("click", function () {
      openUploadCareDialog();
    });
  };

  const init = async function () {
    stent.loader.show(".main-content");
    stent.navbar.activeMenu();

    fillForm();
    bindEvents();

    stent.loader.hide();
  };

  init();
})();
