"use strict";

stent.apiSettings = (() => {
  let clientID = null;
  let clientSecret = null;

  const copyToClipboard = function (inputID, inputName) {
    var textBox = document.getElementById(inputID);
    textBox.select();
    if (document.execCommand("copy") === true) {
      stent.toast.success((inputName ? inputName + " " : "") + "Copied!");
    } else {
      stent.toast.error("Error when copying the value.");
    }
    textBox.blur();
  };

  const bindEvents = function () {
    $("#copyClientID")
      .off("click")
      .on("click", function () {
        copyToClipboard("client-id", "Client ID");
      });

    $("#copyClientSecret")
      .off("click")
      .on("click", function () {
        switchPasswordToText();
        copyToClipboard("client-secret", "Client secret");
        switchPasswordToText();
      });

    $("#viewClientSecret")
      .off("click")
      .on("click", function () {
        switchPasswordToText();
      });

    $("#regenerateClientSecret")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        regenerateClientSecret();
      });
  };

  const regenerateClientSecret = async function () {
    var newClientSecret = "";

    let query = `
      mutation {
        workspaceContext {
          renewClientSecret(id: "${clientID}") {
            clientSecret
          }
        }
      }`;

    stent.konsole.group("renewClientSecret");
    stent.konsole.log({ data: query });

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (
      result &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.renewClientSecret &&
      result.message.data.workspaceContext.renewClientSecret.clientSecret
    ) {
      if (stent.log) {
        stent.konsole.log({ response: result.message.data.workspaceContext.renewClientSecret.clientSecret });
        stent.konsole.endGroup();
      }

      newClientSecret = result.message.data.workspaceContext.renewClientSecret.clientSecret;

      $("#client-secret").val(newClientSecret);
      stent.toast.success("Client secret was well regenerated.");

    } else {
      if (stent.log) {
        stent.konsole.error({ response: result });
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to renew client secret. Please try again.");
      return null;
    }
  };

  const switchPasswordToText = function () {
    if ($("#client-secret").attr("type") === "password") {
      $("#client-secret").attr("type", "text");
      $("#viewClientSecret").attr("title", "Hide client secret").attr("data-original-title", "Hide client secret");
      $(".viewValue").removeClass("fe-eye").addClass("fe-eye-off");
    } else {
      $("#client-secret").attr("type", "password");
      $("#viewClientSecret").attr("title", "View client secret").attr("data-original-title", "View client secret");
      $(".viewValue").removeClass("fe-eye-off").addClass("fe-eye");
    }
  };

  const init = async () => {
    stent.loader.show(".main-content");
    stent.navbar.activeMenu("api");

    let query = `
      query {
        workspaceContext {
          workspace {
            settings {
                api {
                  clientId
                  clientSecret
                }
            }
          }
        }
      }
    `;

    //Get clientId & clientSecret
    let result = await stent.ajax.getApiAsync(query, "POST");

    if (
      result &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.workspace &&
      result.message.data.workspaceContext.workspace.settings &&
      result.message.data.workspaceContext.workspace.settings.api &&
      result.message.data.workspaceContext.workspace.settings.api.clientId &&
      result.message.data.workspaceContext.workspace.settings.api.clientSecret
    ) {
      clientID = result.message.data.workspaceContext.workspace.settings.api.clientId;
      clientSecret = result.message.data.workspaceContext.workspace.settings.api.clientSecret;

      $("#client-id").val(clientID);
      $("#client-secret").val(clientSecret);
      stent.loader.hide();

      //bind events
      bindEvents();
    } else {
      stent.loader.hide();
      stent.toast.danger("Error when trying to get the clientSecret and clientId. Please reload the page.");
    }
  };

  init();

  return {};
})();
