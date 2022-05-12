"use strict";

stent.requireJS(["ace"], function() {

  stent.campaign = (function () {
    let _campaign = null;
    let _campaignId = null;
    let _flow = null;
    let _membersTimezone = {};
    let _defaultTimezone = stent.tenant.timezone;
    let _editors = null;
    let _editorsConfiguration = null;
    let _populateSourcePicker = null;
    let _sourcesURLFunction = null;
    let _fillForm = null;
    let _isInDuplication = false;
    let _isInEdition = false;
    let _defaultSchedule = {
      slots: [{ cron: "0 9 * * *", duration: "PT3H" }, { cron: "0 14 * * *", duration: "PT3H" }]
    };

    let _medias = null;
    let _pageInfo = null;
    let _focused = null;

    const buildEditorsObject = function (messages) {

      let out = [];

      // Loop on messages, and merge with configration
      messages.forEach((message) => {
        let messageType = message.type;
        let config = _editorsConfiguration.filter(editor => editor.type === messageType)[0];

        config.currentLanguage = "default";

        if (!message.body) {
          message.body = {
            default: ""
          };
        }

        // Check subject if exists and subject.variations
        if (message.channel && config.channels[message.channel].showSubject === true) {
          if (!message.subject) {
            message.subject = {
              default: "",
              variations: []
            };
          } else {
            if (!message.subject.variations) {
              if (!message.body.variations || !Array.isArray(message.body.variations) || message.body.variations.length === 0) {
                message.subject.variations = [];
              } else {
                message.subject.variations = message.body.variations.map(variation => {
                  return {
                    lang: variation.lang,
                    body: ""
                  };
                });
              }

            }
          }
        }

        out.push({
          ...config, ...message
        });

      });

      return out;
    };

    const displayErrorOnLoadCampaign = function () {
      // Campaign doesnt exists in the DB
      $("#campaign-form form").html(`
        <div class="alert alert-warning fade show" role="alert">
          <strong>Ooooops.</strong> This campaign doesn't exists. Please try again.
        </div>`
      );
    };

    const loadCampaignData = function (campaignId) {
      stent.ajax.getRest(
        "/campaigns/" + stent.tenant.key + "/" + campaignId,
        function (campaign) {
          if (campaign !== null) {
            _campaign = campaign;
            start();
          } else {
            displayErrorOnLoadCampaign();
            stent.loader.hide();
            $("#campaign-form-loader").addClass("d-none");
            $("#campaign-form").removeClass("d-none");
          }
        },
        function () {
          displayErrorOnLoadCampaign();
          stent.loader.hide();
          $("#campaign-form-loader").addClass("d-none");
          $("#campaign-form").removeClass("d-none");
        }
      );
    };

    const loadCampaignForm = function () {

      return new Promise((resolve, reject) => {
        if (!_flow) {
          reject("Campaign flow is not defined.");
        }

        $.ajax({
          url: "/pages/campaign-form-" + _flow + ".html",
          type: "GET",
          success: function(data) {
            resolve(data);
          },
          error: function(error) {
            reject(error);
          }
        });
      });

    };

    const getCampaignsPrograms = async function () {

      let fetchCampaignsPrograms = await stent.ajax.getRestAsync("/campaigns/" + stent.tenant.key + "/programs");

      if (fetchCampaignsPrograms && fetchCampaignsPrograms.ok && fetchCampaignsPrograms.message) {
        return fetchCampaignsPrograms.message;
      } else {
        stent.toast.danger("Error when trying to fetch the campaigns programs. Please try again.");
        return null;
      }

    };

    const getCampaignsNames = async function () {

      let fetchCampaignsNames = await stent.ajax.getRestAsync("/campaigns/" + stent.tenant.key + "/names");

      if (fetchCampaignsNames && fetchCampaignsNames.ok && fetchCampaignsNames.message) {
        return fetchCampaignsNames.message;
      } else {
        stent.toast.danger("Error when trying to fetch the campaigns names. Please try again.");
        return null;
      }

    };

    const getSenders = async function () {

      let fetchSenders = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/members");

      if (fetchSenders && fetchSenders.ok && fetchSenders.message) {
        return fetchSenders.message;
      } else {
        stent.toast.danger("Error when trying to fetch the senders. Please try again.");
        return null;
      }

    };

    const populateCampaignNamePicker = async function () {

      let _campaignsNames = await stent.campaign.getCampaignsNames();

      _campaignsNames = _campaignsNames.map(name => {
        return {
          id: name,
          text: name,
        };
      });

      $("#campaign-name").select2({
        data: _campaignsNames,
        tags: true,
        allowClear: true,
        placeholder: "Add or select a campaign name"
      });
    };

    const populateCampaignProgramPicker = async function () {

      let _campaignsPrograms = await stent.campaign.getCampaignsPrograms();

      _campaignsPrograms = _campaignsPrograms.map(program => {
        return {
          id: program,
          text: program,
        };
      });

      $("#campaign-program").select2({
        data: _campaignsPrograms,
        tags: true,
        allowClear: true,
        placeholder: "Add or select a campaign program"
      });
    };

    const populateSenderPicker = async function () {

      let _senders = await getSenders();

      $("#campaign-sender").empty();

      let option = new Option("Please choose a sender", "");
      $("#campaign-sender").append($(option));

      _senders.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
      _senders.forEach(function(sender) {
        let option = new Option(sender.firstName + " " + sender.lastName, sender.id);
        $("#campaign-sender").append($(option));
        _membersTimezone[sender.id] = sender.timezone ? sender.timezone : _defaultTimezone;
      });

    };

    const lockSender = function () {
      $("#campaign-sender")
        .attr("readonly", "readonly")
        .attr("disabled", "disabled");
    };

    /* ########################################################## */
    /* START MESSAGES EDITOR */

    const initCrons = function(config) {
      stent.cronEditor.init(config);
    };

    const initEditors = function(selectedIndex) {

      let _canAddNudges = _editorsConfiguration.filter(editor => editor.type === "nudge").length > 0;

      _editors.forEach((editor, index) => {

        let tabIsActive = false;

        if (selectedIndex) {
          if (index === selectedIndex) {
            tabIsActive = true;
          }
        } else if (index === 0) {
          tabIsActive = true;
        }

        // DOM For nav-links
        $("#campaign-messages-links").append(
          tabLinkDOM(
            index,
            editor.name,
            tabIsActive
          )
        );

        $("#campaign-messages-links").after(
          editorsDOM(
            index,
            tabIsActive
          )
        );

        let $editorWrapper = $("#editor-wrapper-" + index);

        // Bind duration pickers
        $(".delay-editor").timeDurationPicker({
          seconds: false,
          years: false,
          defaultValue: function () {
            let editorIndex = parseInt($(this.element).attr("data-index"), 10);
            if (_editors[editorIndex].delay === "PT1D") {
              return "P1D";
            } else {
              return _editors[editorIndex].delay;
            }

          },
          onSelect: function(element, seconds, duration, text) {

            let editorIndex = parseInt($(element).attr("data-index"), 10);
            _editors[editorIndex].delay = duration;

            $(element).val(text);

          }
        });

        // Bind delay-before-reinvite-editor picker
        $(".delay-before-reinvite-editor").timeDurationPicker({
          seconds: false,
          years: false,
          defaultValue: function () {
            let editorIndex = parseInt($(this.element).attr("data-index"), 10);
            return _editors[editorIndex].delayBeforeReInvite;
          },
          onSelect: function(element, seconds, duration, text) {
            let editorIndex = parseInt($(element).attr("data-index"), 10);
            _editors[editorIndex].delayBeforeReInvite = duration;

            $(element).val(text);

          }
        });

        // Bind text-change
        $editorWrapper.find(".message-editor")
          .off("input")
          .on("input", function() {

            let editorIndex = parseInt($(this).closest(".editor-wrapper").attr("data-editor-index"), 10);
            let lang = _editors[editorIndex].currentLanguage;

            saveEditorContent(lang, editorIndex, $(this).val());

            updateMaxCharCountDOM(editorIndex);
            updateMaxSubjectCharCountDOM(editorIndex);

          });

        // Bind get focused
        $editorWrapper.find(".message-editor")
          .off("focus")
          .on("focus", function() {
            _focused = "message";
          });

        // Bind text-change on subject input
        $editorWrapper.find(".subject-editor")
          .off("input")
          .on("input", function() {

            let editorIndex = parseInt($(this).closest(".editor-wrapper").attr("data-editor-index"), 10);
            let lang = _editors[editorIndex].currentLanguage;

            saveSubjectContent(lang, editorIndex, $(this).val());
            updateMaxCharCountDOM(editorIndex);
            updateMaxSubjectCharCountDOM(editorIndex);

          });

        // Bind get focused
        $editorWrapper.find(".subject-editor")
          .off("focus")
          .on("focus", function() {
            _focused = "subject";
          });

      });

      if (_canAddNudges) {
        $("#campaign-messages-links").append(`
          <li class="nav-item" id="add-nudge-button">
            <span>+ New follow-up</span>
          </li>
        `);
      }

    };

    const tabLinkDOM = function (index, name, active) {
    /*eslint-disable*/
    return `
      <li class="nav-item">
        <span 
          class="nav-link ${active ? "active" : ""}" 
          data-index="${index}"
          ${
            _editors[index].type === "nudge" ?
              `data-toggle="tooltip" title="Double click to edit the name"` : ""
          }
          id="campaign-tab-${index}"
          >
            ${name}
            ${
              _editors[index].type === "nudge" ?
              `<b class="fe fe-x remove-nudge-button"></b>` : ""
            }
          </span>
      </li>
    `;
    /*eslint-enable*/
    };

    const editorsDOM = function (index, visible) {
      let html = "";

      /* eslint-disable */
      html += `<div 
                  class="form-group editor-wrapper ${visible !== true ? "d-none" : ""} mb-5" 
                  data-toggle-id="campaign-tab-${index}" 
                  data-editor-index="${index}" 
                  id="editor-wrapper-${index}">`;

      html += channelsDOM(index);
      html += languageSwitcherDOM(index);
      html += tokensDOM();
      html += editorDOM(index);

      // Push Chars counter if necessary
      //if (_editors[index].channels[_editors[index].channel].maxCharCount > 0) {
      html += maxCharCountDOM();
      //}

      // Stop if outgoing / Stop if incoming switches
      if (typeof _editors[index].conditions !== 'undefined') {
        html += `
              <div class="custom-control custom-switch mt-4 mr-2 d-inline-flex">
                  <input 
                    type="checkbox" 
                    class="custom-control-input" 
                    id="stopIfOutgoings-${index}" 
                    data-index="${index}" 
                    value="stopIfOutgoings" 
                    ${_editors[index].conditions.stopIfOutgoings === true ? "checked=\"checked\"" : "" }/>
                  <label class="custom-control-label" for="stopIfOutgoings-${index}">Stop if outgoings</label>
                </div>
                <div class="custom-control custom-switch mt-4 d-inline-flex">
                  <input 
                    type="checkbox" 
                    class="custom-control-input" 
                    id="stopIfIncomings-${index}" 
                    data-index="${index}" 
                    value="stopIfIncomings" 
                    ${_editors[index].conditions.stopIfIncomings === true ? "checked=\"checked\"" : "" }/>
                  <label class="custom-control-label" for="stopIfIncomings-${index}">Stop if incomings</label>
                </div>
        `;
      }

      // Stop if outgoing / Stop if incoming switches
      if (typeof _editors[index].delay !== 'undefined') {
        html += `
                <div class="mt-4 mb-5">
                  <label for="delay-${index}">Delay</label>
                  <input class="form-control delay-editor" style="background-color: white !important; opacity: 1 !important;" readonly="readonly" data-index="${index}" id="delay-${index}" value="${_editors[index].delay}" />
                </div>
        `;
      }

      // Stop if outgoing / Stop if incoming switches
      if (typeof _editors[index].delayBeforeReInvite !== 'undefined') {
        html += `
                <div class="mt-4 mb-5">
                  <label for="delay-${index}">Delay before reinvite</label>
                  <input class="form-control delay-before-reinvite-editor" style="background-color: white !important; opacity: 1 !important;" readonly="readonly" data-index="${index}" id="delay-before-reinvite-${index}" value="${_editors[index].delayBeforeReInvite}" />
                </div>
        `;
      }

      html += ` </div>`;

      /* eslint-enable */

      return html;
    };

    const languageSwitcherDOM = function(index) {

      let currentLanguage = _editors[index].currentLanguage;

      let html = `<div class="language-switch-wrapper">
                    <ul>`;

      html += `
            <li>
              <button class="dropdown btn btn-sm ${currentLanguage === "default" ? "btn-success" : "btn-secondary"} switch-language" data-language="default">
                Default
              </button>
            </li>`;

      if (_editors[index].body &&
          _editors[index].body.variations &&
          _editors[index].body.variations.length > 0
      ) {

        let variations = _editors[index].body.variations;

        for (var i = 0; i < variations.length; i++) {
          let variation = variations[i];
          let lang = variation.lang;
          html += newLangButtonDOM(
            lang,
            $("#hidden-languages-select select option[value='"+ lang.toUpperCase() +"']").text(),
            (currentLanguage === lang)
          );
        }
      }

      html += "<li class=\"new-language\">";
      let $select = $("#hidden-languages-select select").clone();
      $select.removeAttr("id");
      $select.addClass("form-control btn btn-sm btn-outline-light");
      html += $select[0].outerHTML;
      html += " </li>";

      html += `</ul>
            </div>
            `;
      return html;
    };

    const tokensDOM = function() {
      return `
          <div class="editor-tokens">
            <span class="label">Insert:</span>
            <span class="badge badge-warning open-media-modal">Media</span>
            <span class="badge badge-primary insert-token" data-token="{{firstName}}">Contact first name</span>
            <span class="badge badge-primary insert-token" data-token="{{lastName}}">Contact last name</span>
            <span class="badge badge-primary insert-token" data-token="{{senderFirstName}}">Sender first name</span>
            <span class="badge badge-primary insert-token" data-token="{{senderLastName}}">Sender last name</span>
          </div>
        `;
    };

    const channelsDOM = function (index) {

      let currentChannel = _editors[index].channel;


      /*eslint-disable*/
      return `
      <div class="message-channel-wrapper">
        <select class="form-control btn btn-sm btn-outline-light message-channel" ${_editors[index].allowChooseChannel === false ? "disabled" : ""}>
        ${
          Object.keys(_editors[index].channels).map(channel => {
            return `<option value="${channel}" ${!currentChannel || currentChannel === channel ? "selected=\"selected\"" : ""}>${_editors[index].channels[channel].name}</option>`
          })
        }
        </select>
      </div>
      `;
      /*eslint-enable*/
    };

    const newLangButtonDOM = function(lang, displayName, isCurrentLanguage) {
      let html = "";

      html += `
        <li>
          <div class="btn-group">
        <button 
              type="button" 
              class="btn btn-sm ${isCurrentLanguage ? "btn-success" : "btn-secondary"} switch-language" 
              data-language="${lang}">
              ${displayName ? displayName : lang}
            </button>`;

      html += `
          <button type="button" 
            class="btn ${isCurrentLanguage ? "btn-success" : "btn-secondary"} btn-sm dropdown-toggle dropdown-toggle-split" 
            data-language="${lang}" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false">
            <span class="sr-only">Toggle Dropdown</span>
          </button>
          <div class="dropdown-menu dropdown-menu-left">
            <span data-language="${lang}" 
              class="dropdown-item remove-language-from-editor" 
              style="cursor:pointer"
              data-toggle="modal" 
              data-target=".confirm-remove-language">
              Remove
            </span>
          </div>`;

      html += `</div>
        </li>
      `;

      return html;
    };

    const updateMaxCharCountDOM = function (editorIndex) {

      let $editorWrapper = $("#editor-wrapper-" + editorIndex);
      let currentCount = $editorWrapper.find(".message-editor").val().length;
      let max = _editors[editorIndex].channels[_editors[editorIndex].channel].maxCharCount;
      let displayCount = currentCount + " / " + max + (currentCount > max ? " (Try not to exceed " + max + " characters, otherwise your message may be truncated)" : "");

      // If the wrapper does not exist, create it
      if ($editorWrapper.find(".maxCharCountWrapper").length === 0) {
        $("#editor-wrapper-" + editorIndex + " textarea").after(`
            <div class="maxCharCountWrapper ${currentCount > max ? "text-warning" : ""}">${displayCount}</div>
          `);
      } else {
        if (currentCount <= max) {
          $("#editor-wrapper-" + editorIndex + " .maxCharCountWrapper").removeClass("text-warning").text(displayCount);
        } else {
          $("#editor-wrapper-" + editorIndex + " .maxCharCountWrapper").addClass("text-warning").text(displayCount);
        }
      }

    };

    const updateMaxSubjectCharCountDOM = function (editorIndex) {
      // check if the channel needs the subject line

      if (_editors[editorIndex].channels[_editors[editorIndex].channel].showSubject === true) {
        let $editorWrapper = $("#editor-wrapper-" + editorIndex);
        let currentCount = $editorWrapper.find(".subject-editor").val().length;
        let max = _editors[editorIndex].channels[_editors[editorIndex].channel].maxSubjectCharCount;
        let displayCount = currentCount + " / " + max;

        if (currentCount <= max) {
          $("#editor-wrapper-" + editorIndex + " .maxSubjectCharCountWrapper").removeClass("text-warning").text(displayCount);
        } else {
          $("#editor-wrapper-" + editorIndex + " .maxSubjectCharCountWrapper").addClass("text-warning").text(displayCount);
        }
      }

    };

    const editorDOM = function(editorIndex) {

      let editorContent = "";
      let subjectContent = "";
      let out = "";

      if (_editors[editorIndex].currentLanguage === "default") {
        editorContent = _editors[editorIndex].body && _editors[editorIndex].body.default ? _editors[editorIndex].body.default : "";
      } else {
        editorContent = getVariationText(_editors[editorIndex].currentLanguage, editorIndex);
      }

      if (_editors[editorIndex].channels[_editors[editorIndex].channel].showSubject === true) {
        if (_editors[editorIndex].currentLanguage === "default") {
          subjectContent = _editors[editorIndex].subject && _editors[editorIndex].subject.default ? _editors[editorIndex].subject.default : "";
        } else {
          subjectContent = getVariationSubject(_editors[editorIndex].currentLanguage, editorIndex);
        }
      }

      if (_editors[editorIndex].channels[_editors[editorIndex].channel].showSubject === true) {
        out += `<div style="position: relative;top: -5px;">
                  <input 
                    style="
                      border-bottom-right-radius: 0;
                      border-bottom-left-radius: 0;
                      height: auto;
                      padding-top: 13px;
                      padding-right: 76px;"
                    class="form-control subject-editor" 
                    type="text" 
                    value="${subjectContent}" 
                    placeholder="Subject" 
                    maxlength="${_editors[editorIndex].channels[_editors[editorIndex].channel].maxSubjectCharCount}"/>`;

        out += maxSubjectCharCountDOM();

        out += "</div>";
      }

      out += "<textarea class=\"form-control message-editor\" maxlength=\"" + _editors[editorIndex].channels[_editors[editorIndex].channel].maxCharCount + "\" placeholder=\"Message\">" + editorContent + "</textarea>";

      return out;
    };

    const maxCharCountDOM = function () {
      return "<div class=\"maxCharCountWrapper\"></div>";
    };

    const maxSubjectCharCountDOM = function () {
      return "<div class=\"maxSubjectCharCountWrapper\"></div>";
    };

    const saveEditorContent = function(lang, editorIndex, text) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;

      if (!_editors[editorIndex].body) {
        _editors[editorIndex].body = {
          default: ""
        };
      }

      if (lang === "default") {
        _editors[editorIndex].body.default = text;
      } else {
        let variationObject = getVariationObject(lang, editorIndex);
        variationObject.body = text;
      }
    };

    const saveSubjectContent = function(lang, editorIndex, text) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;

      if (!_editors[editorIndex].subject) {
        _editors[editorIndex].subject = {
          default: "",
          variations: []
        };
      }

      if (lang === "default") {
        _editors[editorIndex].subject.default = text;
      } else {
        let variationSubject = getVariationSubjectObject(lang, editorIndex);
        variationSubject.body = text;
      }
    };


    const getVariationText = function (lang, editorIndex) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;
      if (lang === "default") {
        return _editors[editorIndex].body.default;
      } else {
        return _editors[editorIndex].body.variations.filter((variation) => variation.lang === lang)[0].body;
      }
    };

    const getVariationSubject = function (lang, editorIndex) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;
      if (lang === "default") {
        if (_editors[editorIndex].subject) {
          return _editors[editorIndex].subject.default;
        } else {
          return "";
        }
      } else {
        if (_editors[editorIndex].subject && _editors[editorIndex].subject.variations && Array.isArray(_editors[editorIndex].subject.variations)) {
          return _editors[editorIndex].subject.variations.filter((variation) => variation.lang === lang)[0].body;
        } else {
          return "";
        }

      }
    };

    const getVariationObject = function (lang, editorIndex) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;
      return _editors[editorIndex].body.variations.filter((variation) => variation.lang === lang)[0];
    };

    const getVariationSubjectObject = function (lang, editorIndex) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;
      if (_editors[editorIndex].subject && _editors[editorIndex].subject.variations && Array.isArray(_editors[editorIndex].subject.variations)) {
        return _editors[editorIndex].subject.variations.filter((variation) => variation.lang === lang)[0];
      } else {
        return null;
      }
    };


    const insertAtCaret = function(input, text) {
      text = text || "";
      if (document.selection) {
        input.focus();
        var sel = document.selection.createRange();
        sel.text = text;
      } else if (input.selectionStart || input.selectionStart === 0) {
        // Others
        var startPos = input.selectionStart;
        var endPos = input.selectionEnd;
        input.value =
        input.value.substring(0, startPos) + text + input.value.substring(endPos, input.value.length);
        input.selectionStart = startPos + text.length;
        input.selectionEnd = startPos + text.length;
      } else {
        input.value += text;
      }
    };

    const getMedias = async function() {

      let query = `
        query {
          workspaceContext {
            medias(
              first: 25
              ${_pageInfo && _pageInfo.hasNextPage && _pageInfo.endCursor ? `after: "${_pageInfo.endCursor}"` : ""}
            ) {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
              }
              edges {
                node {
                  type: __typename
                  ... on Media {
                    title
                    summary
                    thumbnailUrl
                    createdAt
                  }
                  ... on DocumentMedia {
                    fileName
                  }
                  ... on VideoMedia {
                    fileName
                  }
                  ... on ImageMedia {
                    fileName
                  }
                  ... on ArticleMedia {
                    id
                    url: contentUrl
                    shortLink
                  }
                  ... on Node {
                    id
                  }
                }
              }
            }
          }
        }
      `;

      stent.konsole.group("getMedia");
      stent.konsole.log({data: query});

      // Renew data from server
      var result = await stent.ajax.getApiAsync(query, "POST");

      if (result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.medias &&
        result.message.data.workspaceContext.medias.edges) {

        if (stent.log) {
          stent.konsole.log({response: result.message.data.workspaceContext.medias});
          stent.konsole.endGroup();
        }

        if (result.message.data.workspaceContext.medias.edges.length > 0) {
          return {
            edges: result.message.data.workspaceContext.medias.edges,
            pageInfo: result.message.data.workspaceContext.medias.pageInfo,
            totalCount: result.message.data.workspaceContext.medias.totalCount
          };

        } else {
          return {
            edges: [],
            pageInfo: result.message.data.workspaceContext.medias.pageInfo,
            totalCount: 0
          };
        }

      } else {

        if (stent.log) {
          stent.konsole.error({response: result});
          stent.konsole.endGroup();
        }

        stent.toast.danger("Error when trying to fetch the media. Please refresh the page to try again.");
        stent.loader.hide();

        return {
          edges: [],
          pageInfo: result.message.data.workspaceContext.medias.pageInfo,
          totalCount: 0
        };
      }
    };

    const buildMediaList = function (isLoadingMore = false) {

      if (!_medias || _medias.length === 0) {
        $("#media-modal .modal-body").html("No medium found");
        stent.loader.hide();
        return;
      }

      let html = "";

      if (!isLoadingMore) {
        html = "<div class=\"col stent-grid\" id=\"finders-result\">";
      }

      _medias.forEach(media => {
        html += mediaDOM(media.node);
      });

      if (!isLoadingMore) {
        html += "</div>";
      }

      // Scroll load more
      if (_pageInfo && _pageInfo.hasNextPage) {
        bindScroll();
      } else {
        unbindScroll();
      }

      stent.loader.hide();

      $("#media-modal .modal-body").append(html);


    };

    const mediaDOM = function(media) {
      let html = "";

      let id = media.id ? media.id : null;

      let type = media.type ? media.type : null;
      if (!type) {
        type = "ArticleMedia";
      }

      let previewUrl = "/assets/img/media/no-article.gif";
      if (type === "ArticleMedia") {
        previewUrl = media.thumbnailUrl;
      } else if (type === "ImageMedia") {
        previewUrl = media.url;
      } else if (type === "VideoMedia") {
        previewUrl = "/assets/img/media/no-video.gif";
      } else if (type === "DocumentMedia") {
        previewUrl = "/assets/img/media/no-document.gif";
      }

      let createdAt = media.createdAt && media.createdAt !== 0 ? moment(media.createdAt).format("MM/DD/YYYY - HH:mm") : null;
      let title = media.title ? media.title : "";
      let summary = media.summary ? media.summary : "";
      let url = media.url ? media.url : null;

      /*eslint-disable*/
      html += `
        <div class="row stent-grid-tr aMedia" data-media-id="${id}" style="position: relative;" ${media.shortLink ? "data-short-url=\"" + media.shortLink + "\"" : "" }>
          
          <div class="col col-2" style="word-break: break-all;align-items: center;">
            <div class="mediaImageWrapper">
              <img src="${previewUrl}" onerror="this.onerror=null;this.src='/assets/img/media/no-pic.gif';" />
            </div>
          </div>
  
          <div class="col col-8" style="word-break: break-all; align-items: flex-start; flex-direction: column;">
            ${createdAt ? `<p class="mb-0 text-muted"><small>${createdAt}</small></p>` : ""}
            <p class="media-title">
              ${
                type !== 'ArticlePost' ? 
                `<a data-toggle="tooltip" title="Open link" href="${url}" target="_blank" style="position: relative; top: 2px;">
                ${title}
                </a>
                ` : title
              }
            </p>
            <p class="media-summary">${summary}</p>
          </div>
  
          <div class="col col-2 justify-content-end pr-3">
            ${media.shortLink ? "<span class=\"btn btn-sm btn-primary insert-media\" style=\"float: right;\">Insert this media</span>" : "" }
          </div>
  
        </div>
      `;
      /*eslint-enable*/

      return html;
    };

    const openMediaPopup = async function () {
      $("#media-modal").modal();

      // Clean popup content
      $("#media-modal .modal-body").html("");

      stent.loader.show($("#media-modal .modal-body"));

      let fetchMedias = await getMedias();

      _medias = fetchMedias.edges;
      _pageInfo = fetchMedias.pageInfo;

      buildMediaList();
    };

    const bindScroll = function () {

      $("#media-modal .modal-body")
        .off("scroll")
        .on("scroll", async function() {

          var scrollableDiv = $(this);

          // Bottom is reached
          if ((scrollableDiv[0].scrollHeight - scrollableDiv.height() - 300) < scrollableDiv.scrollTop()) {
            unbindScroll();

            let fetchMedias = await getMedias();

            _medias = fetchMedias.edges;
            _pageInfo = fetchMedias.pageInfo;

            buildMediaList();

          }

        });
    };

    const unbindScroll = function () {
      $("#media-modal .modal-body").off("scroll");
    };

    const openModalChooseNudgeName = function () {
      $("#modal-nudge-name").modal();
    };

    const createNudge = function (nudgeName) {

      // Get nudge configuration
      let _getNudgeConfig = _editorsConfiguration.filter(config => config.type === "nudge")[0];
      _getNudgeConfig.currentLanguage = "default";

      let _newNudge = JSON.parse(JSON.stringify(_getNudgeConfig));

      _newNudge.name = nudgeName;
      _newNudge.body = {
        default: ""
      };

      _newNudge.subject = {
        default: "",
        variations: []
      };

      _editors.push(_newNudge);

      cleanEditors();
      initEditors();

      $("#campaign-tab-" + (_editors.length-1)).click();

    };

    const editNudge = function (nudgeName, editorIndex) {

      _editors[editorIndex].name = nudgeName;

      cleanEditors();
      initEditors();

      $("#campaign-tab-" + editorIndex).click();

    };

    const deleteNudge = function (removeIndex) {

      _editors = _editors.filter((editor, index) => index !== removeIndex);
      cleanEditors();
      initEditors();

      $("#campaign-tab-" + (removeIndex-1)).click();

    };

    const updateChannel = function (index, channel) {
      _editors[index].channel = channel;
      cleanEditors();
      initEditors(index);
    };

    const cleanEditors = function () {
      $("#campaign-messages-links").html("");
      $(".editor-wrapper").remove();
    };

    const cleanErrors = function() {
      $(".is-invalid").removeClass("is-invalid");
      $(".invalid-feedback").remove();
    };

    const pushContentInEditor = function(lang, editorIndex) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;
      $("#editor-wrapper-" + editorIndex + " .message-editor").val(getVariationText(lang, editorIndex));

      // check if we need to update the subject
      if (_editors[editorIndex].channels[_editors[editorIndex].channel].showSubject === true) {
        $("#editor-wrapper-" + editorIndex + " .subject-editor").val(getVariationSubject(lang, editorIndex));
      }
    };


    const addNewLanguage = function(lang, displayName, editorIndex) {
      if (typeof lang === "undefined" || typeof editorIndex === "undefined") return;

      if (!_editors[editorIndex].body) {
        _editors[editorIndex].body = {
          default: ""
        };
      }

      if (!_editors[editorIndex].body.variations) {
        _editors[editorIndex].body.variations = [];
      }

      _editors[editorIndex].body.variations.push({
        lang: lang,
        body: ""
      });

      // Subject
      if (_editors[editorIndex].channels[_editors[editorIndex].channel].showSubject === true) {

        if (!_editors[editorIndex].subject) {
          _editors[editorIndex].subject = {
            default: ""
          };
        }

        if (!_editors[editorIndex].subject.variations) {
          _editors[editorIndex].subject.variations = [];
        }

        _editors[editorIndex].subject.variations.push({
          lang: lang,
          body: ""
        });
      }

      $("#editor-wrapper-" + editorIndex + " .language-switch-wrapper .new-language").before(newLangButtonDOM(lang, displayName));
    };

    const bindEventsEditors = function () {

      $(".container-fluid")
        .off("click", ".switch-language")
        .on("click", ".switch-language", function(e) {
          e.preventDefault();

          let $wrapper = $(this).closest(".editor-wrapper");
          let editorIndex = parseInt($wrapper.attr("data-editor-index"), 10);
          let lang = $(this).attr("data-language");

          if (!$(this).hasClass("btn-success")) {
            $wrapper
              .find(".language-switch-wrapper .btn-success")
              .removeClass("btn-success")
              .addClass("btn-secondary");
            $(this)
              .removeClass("btn-secondary")
              .addClass("btn-success");
            if (lang !== "default") {
              $(this)
                .next()
                .removeClass("btn-secondary")
                .addClass("btn-success");
            }

            // Set the current language of current editor
            _editors[editorIndex].currentLanguage = lang;

            pushContentInEditor(lang, editorIndex);

            updateMaxCharCountDOM(editorIndex);
            updateMaxSubjectCharCountDOM(editorIndex);
          }
        });

      //TODO: insert token in subject
      $(".container-fluid")
        .off("click", ".insert-token")
        .on("click", ".insert-token", function() {
          var token = $(this).attr("data-token");

          // Get the focused input
          var focusedInput = $(this).closest(".editor-wrapper").find("." + _focused + "-editor")[0];
          insertAtCaret(focusedInput, token);

          let editorIndex = parseInt($(this).closest(".editor-wrapper").attr("data-editor-index"), 10);
          let lang = _editors[editorIndex].currentLanguage;

          if (_focused === "message") {
            saveEditorContent(lang, editorIndex, $("#editor-wrapper-" + editorIndex + " .message-editor").val());
          } else if (_focused === "subject") {
            saveSubjectContent(lang, editorIndex, $("#editor-wrapper-" + editorIndex + " .subject-editor").val());
          }

          updateMaxCharCountDOM(editorIndex);
          updateMaxSubjectCharCountDOM(editorIndex);

        });

      $(".container-fluid")
        .off("click", ".open-media-modal")
        .on("click", ".open-media-modal", function() {
          openMediaPopup();
        });

      $(".container-fluid")
        .off("click", ".insert-media")
        .on("click", ".insert-media", function() {

          let mediaShortUrl = $(this).closest(".aMedia").attr("data-short-url");

          if (!mediaShortUrl || mediaShortUrl === "null") {
            return;
          }

          mediaShortUrl = " " + mediaShortUrl + " ";

          let editorIndex = parseInt($("#campaign-messages-links .active").attr("data-index"), 10);
          let focusedInput = $("#editor-wrapper-"+ editorIndex).find("." + _focused + "-editor")[0];
          insertAtCaret(focusedInput, mediaShortUrl);

          $("#media-modal").modal("hide");

          let lang = _editors[editorIndex].currentLanguage;

          if (_focused === "message") {
            saveEditorContent(lang, editorIndex, $("#editor-wrapper-" + editorIndex + " .message-editor").val());
          } else if (_focused === "subject") {
            saveSubjectContent(lang, editorIndex, $("#editor-wrapper-" + editorIndex + " .subject-editor").val());
          }


          updateMaxCharCountDOM(editorIndex);
          updateMaxSubjectCharCountDOM(editorIndex);

        });

      $(".container-fluid")
        .off("change", ".new-language select")
        .on("change", ".new-language select", function() {

          let editorIndex = parseInt($(this).closest(".editor-wrapper").attr("data-editor-index"), 10);
          let lang = $(this).val().toLowerCase();
          let displayName = $(this)
            .children("option")
            .filter(":selected")
            .text();

          $(this).val("");

          if (lang === "") return;

          // Check if language is already installed in this editor
          if (_editors[editorIndex].body &&
              _editors[editorIndex].body.variations &&
              _editors[editorIndex].body.variations.length > 0) {
            if (_editors[editorIndex].body.variations.filter((variation) => variation.lang === lang).length > 0) {
              alert("This language already exists in this editor.");
              return;
            }
          }

          addNewLanguage(lang, displayName, editorIndex);
        });

      $(".confirm-remove-language")
        .on("show.bs.modal", function(e) {
          let $invoker = $(e.relatedTarget);

          let editorIndex = parseInt($invoker.closest(".editor-wrapper").attr("data-editor-index"), 10);
          let lang = $invoker.attr("data-language");

          $(".confirm-button-delete")
            .attr("data-delete-editor-index", editorIndex)
            .attr("data-delete-language", lang);
        });

      $("#modal-nudge-name")
        .on("shown.bs.modal", function() {
          $("#nudgeName").focus();
        });

      $(".confirm-nudge-name")
        .off("click")
        .on("click", function () {

          let nudgeName = $.trim($("#nudgeName").val());

          if (nudgeName === "") {
            stent.toast.danger("Please enter a name for the new follow-up message.");
            return;
          }

          if (nudgeName.length > 20) {
            stent.toast.danger("the name of the follow-up message should not exceed 20 characters.");
            return;
          }

          createNudge(nudgeName);

          $("#nudgeName").val("");

          $("#modal-nudge-name").modal("hide");

        });

      /* ---------------- */
      /* EDIT A NUDGE NAME */
      /* ---------------- */

      $("#modal-edit-nudge-name")
        .on("shown.bs.modal", function() {
          $("#editNudgeName").focus();
        });

      $(".confirm-edit-nudge-name")
        .off("click")
        .on("click", function () {

          let editNudgeName = $.trim($("#editNudgeName").val());

          if (editNudgeName === "") {
            stent.toast.danger("Please enter a name for the follow-up message.");
            return;
          }

          if (editNudgeName.length > 20) {
            stent.toast.danger("the name of the follow-up message should not exceed 20 characters.");
            return;
          }

          editNudge(editNudgeName, parseInt($("#editNudgeName").attr("data-index"), 10));

          $("#editNudgeName").val("");
          $("#editNudgeName").removeAttr("data-index");

          $("#modal-edit-nudge-name").modal("hide");

        });

      $(".container-fluid")
        .off("dblclick", "#campaign-messages-links .nav-link")
        .on("dblclick", "#campaign-messages-links .nav-link", function() {

          // Use this function only on nudge mesages
          let editorIndex = parseInt($(this).attr("data-index"), 10);

          if (_editors[editorIndex].type === "nudge") {
            $("#editNudgeName").attr("data-index", editorIndex);
            $("#editNudgeName").val(_editors[editorIndex].name);
            $("#modal-edit-nudge-name").modal();
            $(".tooltip").tooltip("hide");
          }

        });

      /* ---------------- */

      $(".confirm-button-delete")
        .off("click")
        .on("click", function() {
          let editorIndex = $(this).attr("data-delete-editor-index");
          let lang = $(this).attr("data-delete-language");

          // Remove the variation in memory
          _editors[editorIndex].body.variations = _editors[editorIndex].body.variations.filter((variation) => variation.lang !== lang);

          // If if there is no more variations, remove the variations array
          if (_editors[editorIndex].body.variations.length === 0) {
            delete _editors[editorIndex].body.variations;
          }

          // Remove usbject
          if (_editors[editorIndex].channels[_editors[editorIndex].channel].showSubject === true) {
            _editors[editorIndex].subject.variations = _editors[editorIndex].subject.variations.filter((variation) => variation.lang !== lang);

            // If if there is no more variations, remove the variations array
            if (_editors[editorIndex].subject.variations.length === 0) {
              delete _editors[editorIndex].subject.variations;
            }
          }


          $("#editor-wrapper-" + editorIndex + " .language-switch-wrapper .switch-language[data-language=\"" + lang + "\"]")
            .closest("li")
            .remove();
          $(".confirm-remove-language").modal("hide");

          // If deleted language is currentLanguage => active the default language.
          if (_editors[editorIndex].currentLanguage === lang) {
            $("#editor-wrapper-" + editorIndex + " .language-switch-wrapper .switch-language[data-language=\"default\"]").click();
          }

        });

      $(".container-fluid")
        .off("click", "#campaign-messages-links .nav-link")
        .on("click", "#campaign-messages-links .nav-link", function() {

          $("#campaign-messages-links .active").removeClass("active");
          $(this).toggleClass("active");

          $("[data-toggle-id]").addClass("d-none");
          $("[data-toggle-id='" + $(this).attr("id") + "']").removeClass("d-none");

          updateMaxCharCountDOM(parseInt($(this).attr("data-index"), 10));
          updateMaxSubjectCharCountDOM(parseInt($(this).attr("data-index"), 10));

        });

      $(".container-fluid")
        .off("click", "#add-nudge-button")
        .on("click", "#add-nudge-button", function() {
          openModalChooseNudgeName();
        });

      $(".container-fluid")
        .off("input", "[value='stopIfOutgoings']")
        .on("input", "[value='stopIfOutgoings']", function() {
          let editorIndex = parseInt($(this).attr("data-index"), 10);
          _editors[editorIndex].conditions.stopIfOutgoings = $(this).is(":checked");
        });

      $(".container-fluid")
        .off("input", "[value='stopIfIncomings']")
        .on("input", "[value='stopIfIncomings']", function() {
          let editorIndex = parseInt($(this).attr("data-index"), 10);
          _editors[editorIndex].conditions.stopIfIncomings = $(this).is(":checked");
        });

      $(".container-fluid")
        .off("input", ".delay-editor")
        .on("input", ".delay-editor", function() {
          let editorIndex = parseInt($(this).attr("data-index"), 10);
          _editors[editorIndex].delay = $(this).val();
        });

      $(".container-fluid")
        .off("input", ".delay-before-reinvite-editor")
        .on("input", ".delay-before-reinvite-editor", function() {
          let editorIndex = parseInt($(this).attr("data-index"), 10);
          _editors[editorIndex].delayBeforeReInvite = $(this).val();
        });


      $(".container-fluid")
        .off("click", ".remove-nudge-button")
        .on("click", ".remove-nudge-button", function(e) {

          e.stopPropagation();

          let editorIndex = parseInt($(this).closest("[data-index]").attr("data-index"), 10);

          if (window.confirm("Are you sure you want to delete the follow-up message \" " + _editors[editorIndex].name + " \"?")) {
            deleteNudge(editorIndex);
            $(".tooltip").tooltip("hide");
          }

        });

      $(".container-fluid")
        .off("input", ".message-channel")
        .on("input", ".message-channel", function(e) {

          e.stopPropagation();

          let editorIndex = parseInt($(this).closest("[data-editor-index]").attr("data-editor-index"), 10);
          let selectedChannel = $(this).val();

          updateChannel(editorIndex, selectedChannel);

        });


    };

    /* END MESSAGES EDITOR */
    /* ########################################################## */

    const start = function () {

      stent.loader.hide();
      $("#campaign-form-loader").addClass("d-none");
      $("#campaign-form").removeClass("d-none");

      // Load the campaign form html page
      loadCampaignForm()
        .then(
          function (data) {
            $(".form-content").html(data);
            bindEvents();
            bindEventsEditors();
            stent.loader.hide();
          },
          function (error) {

            let _error = error;
            if (typeof error === "object" && error.status) {
              _error = error.status + " when trying to load the form.";
            }

            stent.loader.hide();
            $(".form-content").html(
              `
              <div class="alert alert-warning fade show" role="alert">
                <strong>Ooooooops. </strong> Error: ${_error} Please try again.
              </div>
              `
            );
          }
        );

    };

    const startForm = function(
      editorsConfiguration,
      h1Title,
      populateSourcePickerFunction,
      fillformFunction,
      sourcesURLFunction
    ) {

      let params = new URLSearchParams(location.search);
      let getDuplicateParam = params.get("action");
      if (getDuplicateParam === "duplicate") {
        _isInDuplication = true;
      }

      _campaignId = stent.campaign.get() && !_isInDuplication ? stent.campaign.get()._key : null;
      stent.loader.show("#campaign-form");

      _populateSourcePicker = populateSourcePickerFunction;
      _fillForm = fillformFunction;
      _sourcesURLFunction = sourcesURLFunction;

      if (!_campaignId && !_isInDuplication) {

        _editorsConfiguration = JSON.parse(JSON.stringify(editorsConfiguration));
        _editors = buildEditorsObject(_editorsConfiguration.filter(config => config.type !== "nudge"));

        // CREATION MODE
        initEditors();

        initCrons({
          id: "campaign-schedule",
          defaultDuration: "PT3H",
          jElem: $("#campaign-schedule-wrapper"),
          timezone: _defaultTimezone,
          data: stent.campaign.getDefaultSchedule().slots
        });

        $(".main-content h1").text(h1Title);
        stent.loader.hide();
      } else {
        // EDITION MODE
        if (!_isInDuplication) {
          _isInEdition = true;
        }

        // Build editors
        _editorsConfiguration = editorsConfiguration;
        _editors = buildEditorsObject(_campaign.messages);

        stent.navbar.activeMenu();
        _fillForm();
      }
    };

    const readOnlyNameAndProgram = function () {
      $("#campaign-name").select2({readonly: true, disabled: true});
      $("#campaign-program").select2({readonly: true, disabled: true});
    };

    const readOnly = function () {
      $("#campaign-form > div").prepend(
        `
        <div class="alert alert-warning" role="alert">
          You can't edit the campaign, because it's archived.
        </div>
        `
      );

      $("#campaign-name").select2({readonly: true, disabled: true});
      $("#campaign-program").select2({readonly: true, disabled: true});
      $("#campaign-description").prop("disabled", true).prop("readonly", true);
      lockSender();
      $("#campaign-source").prop("disabled", true).prop("readonly", true);
      $("#add-nudge-button").remove();
      $(".new-language").remove();
      $(".editor-tokens").remove();
      $(".message-editor").prop("disabled", true).prop("readonly", true);
      $(".subject-editor").prop("disabled", true).prop("readonly", true);
      $("[value=\"stopIfOutgoings\"]").prop("disabled", true).prop("readonly", true);
      $("[value=\"stopIfIncomings\"]").prop("disabled", true).prop("readonly", true);
      $(".nav-link[data-toggle=\"tooltip\"]").removeAttr("data-toggle").removeAttr("title");
      $(".container-fluid").off("dblclick", "#campaign-messages-links .nav-link");
      $(".remove-nudge-button").remove();
      $(".switch-language").next().remove();
      $(".switch-language").next().remove(); // Keep this twice !
      $("#campaign-status-wrapper .card-body").empty();
      $("#campaign-status-wrapper .card-body").html("<span class=\"badge badge-soft-danger\">Stopped</span>");
      $("#campaign-save").remove();
      $("#campaign-schedule-timezone").prop("disabled", true).prop("readonly", true);
      $(".campaign-slot-delete").remove();
      $("#campaign-schedule .card-body .add-new").remove();
      $("#cohort-size").prop("disabled", true).prop("readonly", true);
      $(".campaign-slot-duration").prop("disabled", true).prop("readonly", true);
      $(".campaign-slot-cron-picker select, .campaign-slot-cron-picker input").prop("disabled", true).prop("readonly", true);
      $(".delay-before-reinvite-editor").prop("disabled", true).prop("readonly", true);
      $("#campaign-target").prop("disabled", true).prop("readonly", true);
      $(".message-channel").prop("disabled", true).prop("readonly", true);
    };

    const getCleanedEditors = function () {

      let messages = JSON.parse(JSON.stringify(_editors));

      messages.forEach((message) => {

        // Remove subject if the choosed channel does not need it
        if (message.channels[message.channel].showSubject !== true) {
          if (message.subject) {
            delete message.subject;
          }
        }

        delete message.currentLanguage;

        if (typeof message.maxCharCount !== "undefined") {
          delete message.maxCharCount;
        }

        if (typeof message.allowChooseChannel !== "undefined") {
          delete message.allowChooseChannel;
        }

        if (typeof message.channels !== "undefined") {
          delete message.channels;
        }
      });

      return messages;
    };

    const bindEvents = function () {
      $(".toggle-advanced")
        .off("click")
        .on("click", function() {
          $(this)
            .closest("#advanced-configuration-wrapper")
            .toggleClass("open");
        });

      $("#cohort-size")
        .off("input")
        .on("input", function() {
          $("#display-cohort-size").text($(this).val());
        });

      $("#campaign-sender")
        .off("change")
        .on("change", function() {

          let ownerId = $(this).val();
          if (stent.campaign.getMembersTimezone()[ownerId]) {
            $("#campaign-schedule-timezone")
              .children("option")
              .filter(":selected")
              .removeAttr("selected");

            $("#campaign-schedule-timezone option[value='" + stent.campaign.getMembersTimezone()[ownerId] + "']").prop("selected", true);

            stent.loader.show(".main-content");
            stent.ajax.getRest(_sourcesURLFunction(), _populateSourcePicker);
          }
        });

      $("[name='campaign-status']")
        .off("change")
        .on("change", function() {
          $("[name='campaign-status']").each(function() {
            $(this)
              .closest(".btn")
              .removeClass("btn-success btn-warning btn-danger")
              .addClass("btn-white");
          });
          let className;
          switch ($(this).val()) {
            case "active":
              className = "btn-success";
              break;
            case "pause":
              className = "btn-warning";
              break;
            case "stop":
              className = "btn-danger";
              break;
          }

          $(this)
            .closest(".btn")
            .removeClass("btn-white")
            .addClass(className);
        });
    };

    const init = function() {
    // master loader
      stent.loader.show("#campaign-form-loader");

      let params = new URLSearchParams(location.search);
      let campaignId = params.get("id");
      _flow = params.get("flow");

      // Campaign CREATION
      if (campaignId === null) {
        start();
      } else {
      // Campaign EDITION
        loadCampaignData(campaignId);
        stent.navbar.activeMenu();
      }

    };


    init();

    return {
      get: function () {
        if (_campaign === null) {
          return null;
        } else {
          return {..._campaign};
        }
      },
      getFocused: function() {
        return _focused;
      },
      getCampaignsPrograms,
      getCampaignsNames,
      populateCampaignNamePicker,
      populateCampaignProgramPicker,
      populateSenderPicker,
      getMembersTimezone: function() {
        return _membersTimezone;
      },
      getDefaultSchedule: function () {
        return _defaultSchedule;
      },
      startForm,
      cleanErrors,
      getEditors: function () {
        return _editors;
      },
      getCleanedEditors: function () {
        return getCleanedEditors();
      },
      initCrons,
      initEditors,
      lockSender,
      readOnly,
      readOnlyNameAndProgram,
      getIsInEdition: function () {
        return _isInEdition;
      },
      getIsInDuplication: function () {
        return _isInDuplication;
      },
      updateMaxCharCountDOM,
      updateMaxSubjectCharCountDOM
    };

  })();

});