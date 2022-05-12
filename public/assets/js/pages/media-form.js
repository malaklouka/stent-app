"use strict";


stent.media.form = function () {

  let _mediaId = null;
  let _media = null;

  const fetchMedia = async function () {

    let query = `
      query {
        workspaceContext {
          mediaById(id: "${_mediaId}") {
            type: __typename
            ... on Node {
              id
            }
            ... on Media {
              title
              summary
              thumbnailUrl
              contentUrl
            }
            ... on DocumentMedia {
              fileName
            }
            ... on ImageMedia {
              fileName
            }
            ... on VideoMedia {
              fileName
            }
            ... on ArticleMedia {
              shortLink
            }
          }
        }
      }
    `;

    stent.konsole.group("mediaById");
    stent.konsole.log({data: query});

    let fetchMedia = await stent.ajax.getApiAsync(query, "POST");

    if (fetchMedia &&
        fetchMedia.ok &&
        fetchMedia.message &&
        fetchMedia.message.data &&
        fetchMedia.message.data.workspaceContext &&
        fetchMedia.message.data.workspaceContext.mediaById) {
      return fetchMedia.message.data.workspaceContext.mediaById;
    } else {
      stent.toast.danger("Error when trying to fetch the medium. Please refresh the page to try again.");
      return null;
    }

  };


  const buildTypeSelect = function () {

    let _html = "<option value=\"\">Please select a type</option>";

    stent.media.get().forEach(media => {
      _html += `<option value="${media.key}">${media.name}</option>`;
    });

    $("#media-type").html(_html);

  };


  const loadForm = function (mediaType) {
    if (!mediaType) {
      return;
    }

    $("#media-form #media-type-wrapper").html(getBannerDOM(mediaType));
    $("#media-form #media-form-wrapper").load("/pages/media-form-" + (mediaType.replace(/Media/gi, "").toLowerCase()) + ".html");

  };

  const getBannerDOM = function (mediaType) {
    if (!mediaType) {
      return "";
    }

    let _mediaDefinition = stent.media.getMediaByKey(mediaType);

    let _html = `
      <div class="card">
        <div class="card-body" style="padding: 1rem;">
          <div class="row no-gutters justify-content-center align-items-center">
            <div class="col-auto mr-3">
              <div class="media-icon" style="background-color: ${_mediaDefinition.color};">
                <img src="${_mediaDefinition.icon}" />
              </div>
            </div>
            <div class="col">
              <h2 class="mb-1">${_mediaDefinition.name}</h2>
              <p class="my-0 text-muted" style="font-size: 13px;">${_mediaDefinition.description}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    return _html;

  };


  const bindEvents = function() {

    $("#media-type")
      .off("change")
      .on("change", function() {
        loadForm($(this).val());
      });

  };


  const init = async function() {

    // Active corresponding menu
    stent.navbar.activeMenu("media-form");

    // change Page title
    stent.ui.setPageTitle("News feed - Create / edit media");

    // Fill Select type input
    buildTypeSelect();

    //bind events
    bindEvents();

    // Try to get the mediaId in the URL
    let params = new URLSearchParams(location.search);
    let itemId = params.get("id");

    // EDITION MODE
    if (itemId !== null) {
      _mediaId = itemId;
      _media = await fetchMedia();

      let _mediaType = "ArticleMedia";
      if (_media && _media.type) {
        _mediaType = _media.type;
      }

      $("#media-type").val(_mediaType).trigger("change");

    }

  };

  init();

  return {
    getMediaId: function () {
      return _mediaId;
    },
    getMedia: function () {
      return _media;
    },
    getBannerDOM
  };

}();
