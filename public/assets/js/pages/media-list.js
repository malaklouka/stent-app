
stent.mediaList = (function () {

  let _medias = null;
  let _totalCount = null;
  let _pageInfo = null;
  let _filters = {};

  const getMedias = async function() {

    let query = `
      query {
        workspaceContext {
          medias(
            first: 25
            where: {
              ${_filters && _filters.type ? `type: ${_filters.type}` : ""} 
            }
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

  const archiveMedia = async function(mediaId) {

    // archive media
    let query = `
      mutation {
        workspaceContext {
          archiveMedia(id: "${mediaId}") {
            status
          }
        }
      }`;

    // Mutation to unarchive media if needed
    /*
      mutation {
        workspaceContext {
          unarchiveMedia(id: "410e282564974bd0a1afa33d014c6eae") {
            status
            media {
              ...on Media {
                title
              }
            }
          }
        }
      }
      */


    stent.konsole.group("archiveMedia");
    stent.konsole.log({data: query});

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.archiveMedia &&
      result.message.data.workspaceContext.archiveMedia.status === "ok") {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.archiveMedia});
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

      stent.toast.danger("Error when trying to archive the media. Please refresh the page to try again.");

      return {
        ok: false
      };
    }
  };

  const buildMediaList = async function (isLoadingMore = false) {

    setFilters();

    $(".spinner-grow").removeClass("d-none");

    // Set medias list
    let fetchMedias = await getMedias();

    _medias = fetchMedias.edges;
    _totalCount = fetchMedias.totalCount;
    _pageInfo = fetchMedias.pageInfo;

    if (!isLoadingMore) {
      stent.loader.hide();
    }

    if (!isLoadingMore) {
      if (_medias.length == 0) {
        $("#medias-grid-wrapper").html(
          `
          <div class="alert alert-warning mt-3" role="alert">
            No medium found.
          </div>
          `
        );
        $(".stent-grid-header").addClass("d-none");
        return;
      } else {
        $(".stent-grid-header").removeClass("d-none");
      }
    }

    // Start building HTML
    let html = "";

    if (!isLoadingMore) {
      html = "<div class=\"col stent-grid\" id=\"medias-result\">";
    }

    // Table content
    _medias.forEach(media => {
      html += mediaDOM(media.node);
    });

    if (!isLoadingMore) {
      html += "</div>";
    }

    // Table footer
    if (!isLoadingMore) {
      html += `
        <div id="medias-footer">
          <div class="spinner-grow spinner-grow-sm d-none" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <strong>${_totalCount.toLocaleString(stent.locale)} record${_totalCount > 1 ? "s" : ""}</strong>
        </div>`;
    }

    if (!isLoadingMore) {
      $("#medias-grid-wrapper").html(html);
    } else {
      $("#medias-result").append(html);
    }

    // Scroll load more
    if (_pageInfo && _pageInfo.hasNextPage) {
      bindScroll();
    } else {
      unbindScroll();
    }

    $(".spinner-grow").addClass("d-none");

    return;
  };

  const mediaDOM = function (media) {
    let html = "";

    let id = media.id ? media.id : null;

    let type = media.type ? media.type : null;
    if (!type) {
      type = "ArticleMedia";
    }

    let mediaConfig = stent.media.getMediaByKey(type);

    let previewUrl = "/assets/img/media/no-article.gif";

    if (type === "ArticleMedia") {
      previewUrl = media.thumbnailUrl;
    } else if (type === "ImageMedia") {
      previewUrl = media.thumbnailUrl;
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
        <div class="row stent-grid-tr aMedia" data-media-id="${id}" style="position: relative;">
          
          <div class="col col-2" style="word-break: break-all;align-items: center;">
            <div class="mediaImageWrapper">
              <img src="${previewUrl}" onerror="this.onerror=null;this.src='/assets/img/media/no-pic.gif';" />
            </div>
          </div>
  
          <div class="col col-2" style="word-break: break-all;align-items: center;">
            <div class="mediaTypeBadge" style="background-color: ${mediaConfig.color};">
              <img src="${mediaConfig.icon}" /> ${mediaConfig.name}
            </div>
          </div>
        
          <div class="col col-7" style="word-break: break-all; align-items: flex-start; flex-direction: column;">
            ${createdAt ? `<p class="mb-0 text-muted"><small>${createdAt}</small></p>` : ""}
            <p class="media-title">
              <a 
                data-toggle="tooltip" title="Edit media"
                href="media-form?id=${id}" 
                class="ui-link">
                ${title}
              </a>
              
              ${
                type !== 'ArticlePost' ? 
                ` - <a data-toggle="tooltip" title="Open link" href="${url}" target="_blank" style="position: relative; top: 2px;">
                  <span class="fe fe-link ml-1"></span>
                </a>
                ` : ""
              }
            </p>
            <p class="media-summary">${summary}</p>
          </div>
  
          <div class="col col-1 justify-content-end pr-3">
  
            <div class="btn-group mb-2">
              <a href="#" class="flex-row align-items-center open-actions" role="button" data-toggle="dropdown">
                <img src="/assets/img/dots-dark.png" />
              </a>
              <div class="dropdown-menu dropdown-menu-right dropdown-toggle-no-caret">
                <a 
                  href="media-form?id=${id}" 
                  class="dropdown-item ui-link">
                  <i class="fe fe-edit"></i> Edit
                </a>
                <a
                  href="tenant-planification?mediaId=${id}"
                  class="dropdown-item ui-link">
                  <i class="fe fe-link-2"></i> Schedule a post
                </a>
                <a 
                  class="dropdown-item media-archive"
                  id="${id}" 
                  data-toggle="modal" data-target=".confirm-archive-media" href="#">
                  <i class="fe fe-alert-octagon"></i> Archive
                </a>
              </div>
            </div>
          
          </div>
  
        </div>
      `;
      /*eslint-enable*/

    return html;
  };

  const bindScroll = function () {

    $("#medias-result")
      .off("scroll")
      .on("scroll", async function() {

        var scrollableDiv = $(this);

        // Bottom is reached
        if ((scrollableDiv[0].scrollHeight - scrollableDiv.height() - 500) < scrollableDiv.scrollTop()) {
          unbindScroll();
          await buildMediaList(true);
        }

      });
  };

  const unbindScroll = function () {
    $("#medias-result").off("scroll");
  };

  const resetFilters = function () {
    $("#filter-table-type").val("").removeClass("active");
  };

  const setFilters = function () {
    _filters.type = $("#filter-table-type").val();

    if (_filters.type === "") {
      $("#filter-reset").addClass("d-none");
    } else {
      $("#filter-reset").removeClass("d-none");
    }
  };


  const bindEvents = function() {

    $(".filter-table")
      .off("change")
      .on("change", async function () {
        if ($(this).val() !== "") {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }
        _pageInfo = null;
        stent.loader.show(".main-content");
        await buildMediaList();
        stent.loader.hide();
      });

    $("#filter-reset")
      .off("click")
      .on("click", async function () {
        resetFilters();
        _pageInfo = null;
        stent.loader.show(".main-content");
        await buildMediaList();
        stent.loader.hide();
      });

    $("body")
      .off("click", "#new-media-button")
      .on("click", "#new-media-button", function () {
        stent.ui.load({ fileToLoad: "media-form.html" });
        stent.ui.pushState("media-form", false, "media-form");
      });

    $(".confirm-archive-media").on("show.bs.modal", function (e) {
      let $invoker = $(e.relatedTarget);
      let mediaId = $invoker.attr("id");
      $(".confirm-button-archive").attr("data-media-id", mediaId);
    });


    $(".confirm-button-archive")
      .off("click")
      .on("click", async function() {
        let mediaId = $(this).attr("data-media-id");
        $(".confirm-archive-media").modal("hide");

        stent.loader.show($("[data-media-id=\"" + mediaId + "\"]"));

        let fetchArchiveMedia = await archiveMedia(mediaId);

        if (fetchArchiveMedia.ok) {
          stent.loader.hide($("[data-media-id=\"" + mediaId + "\"]"));
          $("[data-media-id=\"" + mediaId + "\"]").closest(".aMedia").slideUp(400, function () {$(this).remove();});
          _totalCount = _totalCount - 1;
          $("#medias-footer strong").text(`${_totalCount.toLocaleString(stent.locale)} record${_totalCount > 1 ? "s" : ""}`);
        } else {
          stent.loader.hide($("[data-media-id=\"" + mediaId + "\"]"));
          return;
        }


      });
  };

  const init = async function() {
    // Active corresponding menu
    stent.navbar.activeMenu("media-list");

    // change Page title
    stent.ui.setPageTitle("All Medias");

    bindEvents();

    stent.loader.show(".main-content");

    buildMediaList();

  };

  init();

})() ;
