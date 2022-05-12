stent.createTeant = function () {

  const cleanForm = function () {
    $("#createTenantModal #form-tenant-company").val("");
    $("#createTenantModal #form-tenant-host").val("");
    $("#createTenantModal #form-tenant-firstname").val("");
    $("#createTenantModal #form-tenant-lastname").val("");
    $("#createTenantModal #form-tenant-email").val("");
    $("#createTenantModal #form-tenant-domain").val("");
  };

  const cleanErrors = function() {
    $("#createTenantModal .is-invalid").removeClass("is-invalid");
    $("#createTenantModal .invalid-feedback").remove();
  };

  const createTenant = function () {
    if (checkForm()) {
      saveTenant();
    }
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
      stent.toast.danger("The form has errors, please correct them to create the workspace.");
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

    // Check form-tenant-company
    if ($.trim($("#form-tenant-company").val()) === "") {
      errors.push({
        id: "form-tenant-company",
        message: "Please set your company name."
      });
      formHasError = true;
    }

    // Check form-tenant-host
    if ($.trim($("#form-tenant-host").val()) === "" || !/^[a-z0-9]+$/.test($("#form-tenant-host").val())) {
      errors.push({
        id: "form-tenant-host",
        message: "Please set the workspace host. (only lowercase alphanumerics characters without spaces)"
      });
      formHasError = true;
    }

    // Check form-tenant-firstname
    if ($.trim($("#form-tenant-firstname").val()) === "") {
      errors.push({
        id: "form-tenant-firstname",
        message: "Please set your first name."
      });
      formHasError = true;
    }

    // Check form-tenant-lastname
    if ($.trim($("#form-tenant-lastname").val()) === "") {
      errors.push({
        id: "form-tenant-lastname",
        message: "Please set your last name."
      });
      formHasError = true;
    }

    // Check form-tenant-timezone
    if ($.trim($("#form-tenant-timezone").val()) === "") {
      errors.push({
        id: "form-tenant-timezone",
        message: "Please set your timezone."
      });
      formHasError = true;
    }

    // Check form-tenant-email
    if ($.trim($("#form-tenant-email").val()) === "" || !stent.utils.isEmailValid($("#form-tenant-email").val())) {
      errors.push({
        id: "form-tenant-email",
        message: "Please enter a valid email."
      });
      formHasError = true;
    }

    if (formHasError) {
      displayErrorsInForm();
      toastUserForErrors();
      return false;
    } else {
      return true;
    }
  };

  const saveTenant = async () => {
    stent.loader.show("body", 1051);

    let tenantObject = {
      name: $.trim($("#form-tenant-company").val()),
      domain: $.trim($("#form-tenant-domain").val()),
      host: $.trim($("#form-tenant-host").val()),
      timezone: $.trim($("#form-tenant-timezone").val()),
      contact: {
        firstname: $.trim($("#form-tenant-firstname").val()),
        lastname: $.trim($("#form-tenant-lastname").val()),
        email: $.trim($("#form-tenant-email").val())
      }
    };

    let newTenant = await stent.ajax.postRestAsync(
      "/tenants",
      tenantObject
    );

    if (newTenant.ok && newTenant.ok === true && newTenant.message && newTenant.message.tenantKey) {

      let redirectionURL = window.location.origin + "/" + newTenant.message.tenantKey;
      location.replace(redirectionURL);

    } else {

      let errorMessage = "Error during workspace creation process.";
      if (newTenant.message && newTenant.message.message && newTenant.message.message !== "") {
        errorMessage += " " + newTenant.message.message;
      }

      stent.toast.danger(errorMessage);
      stent.loader.hide();
    }

  };

  const openCreateTenantModal = function () {
    cleanForm();
    cleanErrors();
    $("#createTenantModal").modal("show");
  };

  const closeCreateTenantModal = function () {
    cleanForm();
    cleanErrors();
    $("#createTenantModal").modal("hide");
  };

  const bindEvents = function () {

    $("#cancel-new-tenant-creation")
      .off("click")
      .on("click", function() {
        closeCreateTenantModal();
      });

    $("#launch-save-tenant-button")
      .off("click")
      .on("click", function() {
        createTenant();
      });

      $("body")
      .off("click", "#new-tenant-wrapper")
      .on("click", "#new-tenant-wrapper", function() {
        openCreateTenantModal();
      });

  };

  const init = function () {
    bindEvents();
  };

  init();

}() ;