"use strict";

stent.crm = (function () {

  let _crms;

  const getCRM = async function () {


    // let query = `
    //   query {
    //     apps {
    //       getApps {
    //         key
    //         enabled
    //         name
    //         category
    //         description
    //         image
    //         authentication {
    //           type,
    //           clientId
    //           redirectUri
    //           urls {
    //             authorize
    //           }
    //         }
    //       }
    //     }
    //   }`;

    /*eslint-disable */
    let query = `
      query {
        workspaceContext {
          apps {
            edges {
              node {
                id
                enabled
                name
                category
                description
                image
                authentication {
                  type
                  redirectUri
                  clientId
                  urls {
                    authorize
                  }
                }
              }
            }
          }
        }
      }
    `;
    /*eslint-enable */

    stent.konsole.group("apps");
    stent.konsole.log({data: query});

    let result = await stent.ajax.getApiAsync(query, "POST");

    if (result &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.apps &&
        result.message.data.workspaceContext.apps.edges
    ) {
      if (result.message.data.workspaceContext.apps.edges.length > 0) {

        if (stent.log) {
          stent.konsole.log({response: result.message.data.workspaceContext.apps.edges});
          stent.konsole.endGroup();
        }

        return result.message.data.workspaceContext.apps.edges;
      } else {

        if (stent.log) {
          stent.konsole.error({response: result});
          stent.konsole.endGroup();
        }

        stent.toast.danger("No App found.");
        return null;
      }
    } else {

      if (stent.log) {
        stent.konsole.error({response: result});
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to fetch the Apps. Please refresh the page to try again.");
      return null;
    }

  };


  const removeCRM = async function (id) {

    /*eslint-disable */
    let query = `
      mutation {
        workspaceContext {
          disconnectApp(id: "${id}") {
            app {
              id
            }
          }
        }
      }
    `;
    /*eslint-enable */

    stent.konsole.group("disconnectApp");
    stent.konsole.log({ data: query });

    let result = await stent.ajax.getApiAsync(query, "POST");

    if (result &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.disconnectApp &&
        result.message.data.workspaceContext.disconnectApp.app &&
        result.message.data.workspaceContext.disconnectApp.app.id
    ) {
      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.medias});
        stent.konsole.endGroup();
      }

      return result.message.data.workspaceContext.disconnectApp.app.id;

    } else {
      if (stent.log) {
        stent.konsole.error({response: result});
        stent.konsole.endGroup();
      }
      stent.toast.danger("Error when trying to disconnect the App. Please try again.");
      return null;
    }

  };


  const insertApiKey = async function (appId, apiKey) {

    let query = `
      mutation {
        workspaceContext {
          connectApp(id: "${appId}", input: { apiKey: "${apiKey}" }) {
            app {
              id
            }
          }
        }
      }
    `;
    /*eslint-enable */


    stent.konsole.group("connectApp");
    stent.konsole.log({ data: query });

    let result = await stent.ajax.getApiAsync(query, "POST"); //TODO mutation move to API

    if (result &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.connectApp &&
        result.message.data.workspaceContext.connectApp.app &&
        result.message.data.workspaceContext.connectApp.app.id &&
        !result.message.errors
    ) {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.connectApp.app.id});
        stent.konsole.endGroup();
      }

      return result.message.data.workspaceContext.connectApp.app.id;

    } else {

      if (stent.log) {
        stent.konsole.error({response: result});
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to send the API key. Please try again.");
      return null;
    }

  };


  const closeApiKeyForm = function ($form) {
    $form.removeClass("visible");
    let $input = $form.find(".api-key-input");
    $input.removeClass("is-invalid");
    $input.next(".invalid-feedback").remove();
  };


  const closePersonnalKeyForm = function ($form) {
    $form.removeClass("visible");
    let $input = $form.find(".personnal-key-input");
    $input.removeClass("is-invalid");
    $input.next(".invalid-feedback").remove();
  };


  const submitApiKeyForm = async function ($form, apiKey) {

    stent.loader.show($form);

    let appId = $form.closest(".card").attr("data-crm");

    let sendApiKeyRequest = await insertApiKey(appId, apiKey);

    if (sendApiKeyRequest !== null) {
      let $card = $form.closest(".card");
      $card.attr("data-crm-connected", true);
      closeApiKeyForm($form);
    }

    stent.loader.hide($form);

  };


  const buildCrmList = function () {

    let html = "";

    if (_crms.length === 0) {

      html = `
        <div class="col alert alert-warning alert-dismissible fade show" role="alert">
          No CRM found. Please try again later.
        </div>
      `;

    } else {

      /* eslint-disable */
      _crms.forEach((crm, index) => {

        crm = crm.node;
        
        let type = crm.authentication && crm.authentication.type ? crm.authentication.type : null;
        let id = crm.id ? crm.id : null;
        let connected = crm.enabled === true ? true : false;
        let image = crm.image ? crm.image : null;
        let name = crm.name ? crm.name : '';
        let description = crm.description ? crm.description : '';

        html += `
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="${index}" data-crm="${id}" data-crm-connection-type="${type}" data-crm-connected="${connected}">

              <!-- Image -->
              <div class="card-img-top" style="background-image: url('${image}');"></div>
            
              <!-- Body -->
              <div class="card-body">
                <h2 class="card-title ">${name}</h2>
                <p class="small text-muted mb-0 crm-description">
                  ${description}
                </p>

                
                
              </div>
            
              <!-- Footer -->
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style="display:flex; align-items: center;">
                      <img src="../assets/img/1.svg">Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect ${name}</button>
                  </div>
              
                </div>
              </div>

              ${
                type === "apikey" ?
                `
                <div class="form-api-key-wrapper">
              
                  <button type="button" class="close close-api-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>API Key</label>
                      <input type="text" class="form-control api-key-input" placeholder="Enter API Key">
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-api-key">Connect</button>
                  </form>
                </div>
                ` : 
                type === "personnalkey" ?
                `
                <div class="form-personnal-key-wrapper">
              
                  <button type="button" class="close close-personnal-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>Personnal Key</label>
                      <input type="text" class="form-control personnal-key-input" placeholder="Enter Personnal Key">
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-personnal-key">Connect</button>
                  </form>
                </div>
                ` : 
                ""
              }

            </div>
          </div>
        `;
      });

      /* eslint-enable */
    }

    $("#crm-wrapper").html(html);

  };

  const disconnectCrm = async function ($card) {

    stent.loader.show($card);

    let crmKey = $card.attr("data-crm");

    let removeCRMRequest = await removeCRM(crmKey);

    if (removeCRMRequest !== null) {
      $card.attr("data-crm-connected", "false");
    }

    stent.loader.hide();

  };

  const bindEvents = function () {

    $("#crm-list")
      .off("click", "[data-crm-connection-type=\"oauth2\"] .connect-crm")
      .on("click", "[data-crm-connection-type=\"oauth2\"] .connect-crm", async function () {

        let $card = $(this).closest(".card");
        let popupName = $card.attr("data-crm");
        let index = parseInt($card.attr("data-crm-index"), 10);

        /* eslint-disable */
        let url = _crms[index].node.authentication.urls.authorize +
                  "&redirect_uri=" + (stent.env === "dev" ? "http://auth.dev.stent.io:5050/app/oauth2/callback" : _crms[index].node.authentication.redirectUri) +
                  "&client_id=" + _crms[index].node.authentication.clientId +
                  "&state=" + btoa(JSON.stringify({
                    "tenantKey": stent.tenant.key,
                    "appKey": _crms[index].node.id,
                    "redirect_uri": (stent.env === "dev" ? "http://auth.dev.stent.io:5050/app/oauth2/callback" : _crms[index].node.authentication.redirectUri)
                  }));

        /* eslint-enable */

        stent.utils.popupCenter({url: url, title: popupName, w: 600, h: 500, onClose: reload});

      });

    $("#crm-list")
      .off("click", "[data-crm-connection-type=\"apikey\"] .connect-crm")
      .on("click", "[data-crm-connection-type=\"apikey\"] .connect-crm", function () {
        let $form = $(this).closest(".card").find(".form-api-key-wrapper");
        $form.addClass("visible");
      });

    $("#crm-list")
      .off("click", "[data-crm-connection-type=\"personnalkey\"] .connect-crm")
      .on("click", "[data-crm-connection-type=\"personnalkey\"] .connect-crm", function () {
        let $form = $(this).closest(".card").find(".form-personnal-key-wrapper");
        $form.addClass("visible");
      });

    $("#crm-list")
      .off("click", ".close-api-key-form")
      .on("click", ".close-api-key-form", function () {

        let $form = $(this).closest(".card").find(".form-api-key-wrapper");
        closeApiKeyForm($form);

      });

    $("#crm-list")
      .off("click", ".close-personnal-key-form")
      .on("click", ".close-personnal-key-form", function () {

        let $form = $(this).closest(".card").find(".form-personnal-key-wrapper");
        closePersonnalKeyForm($form);

      });

    $("#crm-list")
      .off("click", ".submit-api-key")
      .on("click", ".submit-api-key", function (e) {

        e.preventDefault();

        let $form = $(this).closest(".card").find(".form-api-key-wrapper");
        let $input = $form.find(".api-key-input");
        let apiKey = $.trim($input.val());
        if (apiKey !== "") {
          submitApiKeyForm($form, apiKey);
        } else {
          $input.addClass("is-invalid");
          $input.after("<div class=\"invalid-feedback\" style=\"display: block;\">Please set an API key.</div>");
        }

      });

    $("#crm-list")
      .off("click", ".submit-personnal-key")
      .on("click", ".submit-personnal-key", function (e) {

        e.preventDefault();

        let $form = $(this).closest(".card").find(".form-personnal-key-wrapper");
        let $input = $form.find(".personnal-key-input");
        let personnalKey = $.trim($input.val());
        if (personnalKey !== "") {
          submitApiKeyForm($form, personnalKey);
        } else {
          $input.addClass("is-invalid");
          $input.after("<div class=\"invalid-feedback\" style=\"display: block;\">Please set a personnal key.</div>");
        }

      });

    $("#crm-list")
      .off("focus", ".api-key-input")
      .on("focus", ".api-key-input", function () {
        $(this).removeClass("is-invalid");
        $(this).next(".invalid-feedback").remove();
      });

    $("#crm-list")
      .off("click", ".disconnect-crm")
      .on("click", ".disconnect-crm", function (e) {
        e.preventDefault();

        if (window.confirm("Are you sure you want to disconnect this app ?")) {
          let $card = $(this).closest(".card");
          disconnectCrm($card);
        }

      });

  };

  const reload = function () {
    init();
  };

  const init = async function() {

    stent.loader.show(".main-content");

    stent.navbar.activeMenu("apps");

    _crms = await getCRM();

    if (_crms !== null) {
      buildCrmList();
      bindEvents();
      stent.loader.hide();
    } else {
      stent.loader.hide();
    }


  };

  init();

  return {
    reload
  };

})() ;
