"use strict";
alert("ici");


stent.campaign.nudge = (function () {

  const emptyNudge = {
    currentLanguage: "default",
    body: {
      default: ""
    }
  };

  let _nudges = [];
  let _lastTabId = null;
  let _medias = null;
  let _pageInfo = null;

  const get = function (index) {
    return _nudges[index];
  };

  const getAll = function () {
    return _nudges;
  };

  const create = function () {

    debugger;

    if (_nudges.length === 0) {
      mandatoryzeLastTab();
    }

    let newNudge = {...emptyNudge};

    _nudges.push(newNudge);

    buildNudges();
    activateNudge();

  };

  const mandatoryzeLastTab = function () {
    $("#campaign-tab-" + _lastTabId).append("<span class=\"is-required\">*</span>");
  };

  const unMandatoryzeLastTab = function () {
    $("#campaign-tab-" + _lastTabId + " .is-required").remove();
  };

  const activateNudge = function (nudgeIndex) {

    if (typeof nudgeIndex === "undefined") {
      $("#campaign-messages-links .nav-link").last().click();
    } else {
      if (nudgeIndex >= 0) {
        $("#campaign-messages-links #campaign-tab-nudge-" + nudgeIndex).click();
      } else {
        $("#campaign-messages-links #campaign-tab-" + _lastTabId).click();
      }
    }

  };

  const update = function (nudgeObject, index) {
    _nudges[index] = {...nudgeObject};
  };

  const remove = function (index) {
    _nudges.splice(index, 1);

    if (_nudges.length === 0) {
      unMandatoryzeLastTab();
    }

    return null;
  };

  const removeNudgesFromDOM = function () {
    $(".campaign-nudge-nav-item").remove();
    $(".campaign-tab-nudge").remove();
  };

  const insertAtCaret = function(textarea, text) {
    text = text || "";
    if (document.selection) {
      // IE
      textarea.focus();
      var sel = document.selection.createRange();
      sel.text = text;
    } else if (textarea.selectionStart || textarea.selectionStart === 0) {
      // Others
      var startPos = textarea.selectionStart;
      var endPos = textarea.selectionEnd;
      textarea.value =
        textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos, textarea.value.length);
      textarea.selectionStart = startPos + text.length;
      textarea.selectionEnd = startPos + text.length;
    } else {
      textarea.value += text;
    }
  };

  const bindEvents = function () {

    $("#add-nudge-button")
      .off("click")
      .on("click", function() {
        create();
      });

    $(".campaign-nudge-nav-item .remove-nudge-button")
      .off("click")
      .on("click", function(e) {
        e.stopPropagation();
        let nudgeIndex = parseInt($(this).closest("[data-nudge-index]").attr("data-nudge-index"), 10);

        if (window.confirm("Are you sure you want to delete the nudge message " + (nudgeIndex + 1) + "?")) {
          remove(nudgeIndex);
          buildNudges();
          activateNudge(nudgeIndex - 1);
        }

      });

    // Bind text-change
    $(".campaign-tab-nudge .message-editor")
      .off("input")
      .on("input", function() {

        let nudgeIndex = parseInt($(this).closest("[data-nudge-index]").attr("data-nudge-index"), 10);
        let lang = _nudges[nudgeIndex].currentLanguage;

        saveEditorContent(lang, nudgeIndex, $(this).val());

      });

    $(".container-fluid")
      .off("click", ".insert-nudge-token")
      .on("click", ".insert-nudge-token", function() {

        var token = $(this).attr("data-token");
        var textarea = $(this)
          .parent()
          .next()[0];

        insertAtCaret(textarea, token);

        let nudgeIndex = parseInt($(this).closest("[data-nudge-index]").attr("data-nudge-index"), 10);
        let lang = _nudges[nudgeIndex].currentLanguage;

        saveEditorContent(lang, nudgeIndex, $("#campaign-tab-nudge-" + nudgeIndex + " .message-editor").val());

      });

    $(".container-fluid")
      .off("click", ".open-media-nudge-modal")
      .on("click", ".open-media-nudge-modal", function() {
        openMediaPopup();
      });

    $(".container-fluid")
      .off("click", ".insert-nudge-media")
      .on("click", ".insert-nudge-media", function() {

        let mediaShortUrl = $(this).closest(".aMedia").attr("data-short-url");

        if (!mediaShortUrl || mediaShortUrl === "null") {
          return;
        }

        mediaShortUrl = " " + mediaShortUrl + " ";

        let activeTab = $("#campaign-messages-links .active").attr("id");
        let textarea = $("[data-toggle-id=\"" + activeTab + "\"] .message-editor")[0];

        insertAtCaret(textarea, mediaShortUrl);

        $("#media-modal").modal("hide");

        let nudgeIndex = parseInt($(textarea).closest("[data-nudge-index]").attr("data-nudge-index"), 10);
        let lang = _nudges[nudgeIndex].currentLanguage;

        saveEditorContent(lang, nudgeIndex, $("#campaign-tab-nudge-" + nudgeIndex + " .message-editor").val());

      });

    $(".container-fluid")
      .off("change", ".new-language-nudge select")
      .on("change", ".new-language-nudge select", function() {

        let nudgeIndex = parseInt($(this).closest("[data-nudge-index]").attr("data-nudge-index"), 10);
        let lang = $(this).val().toLowerCase();
        let displayName = $(this).children("option").filter(":selected").text();

        $(this).val("");

        if (lang === "") return;

        // Check if language is already installed in this editor
        if (_nudges[nudgeIndex].body[lang] || _nudges[nudgeIndex].body[lang] === "") {
          alert("This language already exists in this editor.");
          return;
        }

        addNewLanguage(lang, displayName, nudgeIndex);
      });


    $(".container-fluid")
      .off("click", ".remove-language-nudge-from-editor")
      .on("click", ".remove-language-nudge-from-editor", function(e) {
        e.stopPropagation();
        let nudgeIndex = parseInt($(this).closest("[data-nudge-index]").attr("data-nudge-index"), 10);
        let lang = $(this).attr("data-language");

        if (window.confirm("Are you sure you want to delete this language (" + lang + ") in the nudge message " + (nudgeIndex + 1) + "?")) {

          delete _nudges[nudgeIndex].body[lang];

          $("#" + editorId + " .language-switch-wrapper .switch-language-nudge[data-language=\"" + lang + "\"]")
            .closest("li")
            .remove();
          $(".confirm-remove-language").modal("hide");

          // If deleted language is currentLanguage => acive the default language.
          if (editors[editorId].currentLanguage === lang) {
            $("#" + editorId + " .language-switch-wrapper .switch-language-nudge[data-language=\"default\"]").click();
          }

        }

      });


  };

  const addNewLanguage = function(lang, displayName, nudgeIndex) {
    if (typeof lang === "undefined" || typeof nudgeIndex === "undefined") return;

    _nudges[nudgeIndex].body[lang] = "";

    $("#campaign-tab-nudge-" + nudgeIndex + " .language-switch-wrapper .new-language-nudge").before(newLangButtonDOM(lang, displayName));
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


  const wrapperNudgeDOM = function(nudgeIndex) {

    let html = "";

    // Push the channel
    //html += channelsDOM();

    // Push the language switcher
    html += languageSwitcherDOM(nudgeIndex);

    // Push the tokens
    html += tokensDOM();

    // Push the text area
    html += textAreaDOM(_nudges[nudgeIndex].body["default"]);

    return html;

  };

  /* Generates the bar with the languages switchers buttons */
  const languageSwitcherDOM = function(nudgeIndex) {
    let html = `<div class="language-switch-wrapper">
                  <ul>`;
    var texts = _nudges[nudgeIndex].body;

    for (var lang in texts) {
      if (lang === "default") {
        html += `
          <li class="active">
            <button class="dropdown btn btn-sm btn-primary switch-language-nudge" data-language="default">
              Default
            </button>
          </li>`;
      } else {
        html += newLangButtonDOM(lang, $("#hidden-languages-select select option[value='"+ lang.toUpperCase() +"']").text());
      }
    }

    html += "<li class=\"new-language-nudge\">";
    let $select = $("#hidden-languages-select select").clone();
    $select.addClass("form-control btn btn-sm btn-outline-light");
    html += $select[0].outerHTML;
    html += " </li>";

    html += `</ul>
          </div>
          `;
    return html;
  };

  /* Generates a new language button */
  const newLangButtonDOM = function(lang, displayName) {
    let html = "";

    html += `
      <li>
        <div class="btn-group">
      <button 
            type="button" 
            class="btn btn-sm btn-secondary switch-language-nudge" 
            data-language="${lang}">
            ${displayName ? displayName : lang}
          </button>`;

    html += `
        <button type="button" 
          class="btn btn-secondary btn-sm dropdown-toggle dropdown-toggle-split" 
          data-language="${lang}" 
          data-toggle="dropdown" 
          aria-haspopup="true" 
          aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu dropdown-menu-left">
          <span data-language="${lang}" 
            class="dropdown-item remove-language-nudge-from-editor" 
            style="cursor:pointer">
            Remove
          </span>
        </div>`;

    html += `</div>
      </li>
    `;

    return html;
  };

  const tokensDOM = function() {
    return `
      <div class="editor-tokens">
        <span class="label">Insert:</span>
        <span class="badge badge-warning open-media-nudge-modal">Media</span>
        <span class="badge badge-primary insert-nudge-token" data-token="{{firstName}}">Contact first name</span>
        <span class="badge badge-primary insert-nudge-token" data-token="{{lastName}}">Contact last name</span>
        <span class="badge badge-primary insert-nudge-token" data-token="{{senderFirstName}}">Sender first name</span>
        <span class="badge badge-primary insert-nudge-token" data-token="{{senderLastName}}">Sender last name</span>
      </div>
    `;
  };

  const channelsDOM = function () {
    return `
      <div class="editor-channels">
        <select class="form-control" id="campaign-channel">
          <option value="">Please choose a channel</option>
          <option value="linkedin-message">LinkedIn message</option>
          <option value="linkedin-inmail">LinkedIn InMail</option>
          <option value="email">Email</option>
        </select>
      </div>
    `;
  };

  const textAreaDOM = function(value) {
    return "<textarea class=\"form-control message-editor\" maxlength=\"8000\">" + value + "</textarea>";
  };

  // const pushContentInEditor = function(lang, nudgeIndex) {
  //   if (!lang || !nudgeIndex) return;
  //   $("#" + nudgeIndex + " .message-editor").val(_nudges[nudgeIndex].body[lang]);
  // };

  const buildNudges = function () {

    removeNudgesFromDOM();

    // Navigation links
    let navLinksDOM = "";

    _nudges.forEach((nudge, index) => {
      navLinksDOM += `
        <li class="nav-item campaign-nudge-nav-item" data-nudge-index="${index}">
          <span class="nav-link" id="campaign-tab-nudge-${index}">
            Nudge message ${index+1}
            ${index < _nudges.length-1 ? "<span class=\"is-required\">*</span>" : ""}
            <span class="fe fe-trash-2 remove-nudge-button"></span>
            </span>
        </li>
      `;
    });

    $("#add-nudge-button").before(navLinksDOM);

    debugger;

    // Message Editors
    let editorsDOM = "";
    _nudges.forEach((nudge, index) => {
      editorsDOM += `
        <div class="form-group campaign-tab campaign-tab-nudge d-none" data-nudge-index="${index}" data-toggle-id="campaign-tab-nudge-${index}">
          <div class="editor-wrapper mb-5" id="campaign-tab-nudge-${index}">
            ${wrapperNudgeDOM(index)}
            </div>
        </div>
      `;
    });

    $(".campaign-tab").last().after(editorsDOM);

    bindEvents();
  };

  const saveEditorContent = function(lang, nudgeIndex, text) {
    if (typeof lang === "undefined" || typeof nudgeIndex === "undefined") return;
    _nudges[nudgeIndex].body[lang] = text;
  };

  const init = function ({lastTabId}) {

    _lastTabId = lastTabId;

    $("#campaign-messages-links").append(`
      <li class="nav-item" id="add-nudge-button">
        <span>+ New nudge message</span>
      </li>
    `);

    bindEvents();

  };


  return {
    get,
    getAll,
    create,
    update,
    remove,
    init
  };

})();


