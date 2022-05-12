"use strict";

(function () {
  var dropdownMenu;
  var appendTo;
  $(window).on("show.bs.dropdown", function (e) {
    dropdownMenu = $(e.target).find(".dropdown-menu");
    appendTo = dropdownMenu.attr("data-append-to");
    if (appendTo) {
      $(appendTo).append(dropdownMenu.detach());
      dropdownMenu.css("display", "block");
      dropdownMenu.position({
        "my": "right top",
        "at": "right bottom",
        "of": $(e.relatedTarget)
      });
    }
  });
  $(window).on("hide.bs.dropdown", function (e) {
    if (appendTo) {
      $(e.target).append(dropdownMenu.detach());
      dropdownMenu.hide();
    }
  });
})();

stent.requireJS(["flatpickr"], function () {

  stent.queue = stent.queue || {};

  stent.queue = (function () {

    let _campaignId = null;
    let _campaignProgram = null;
    let _queues = null;
    let _owners = null;
    let _filters = {};
    let _totalCount = null;
    let _pageInfo = null;
    let _poolIdToRemove = null;
    let _initialLoading = true;

    let _sorts = [
      {
        key: "STATUS_ASC",
        value: "Status ASC"
      },
      {
        key: "STATUS_DESC",
        value: "Status DESC"
      },
      {
        key: "DATE_ASC",
        value: "Date ASC"
      },
      {
        key: "DATE_DESC",
        value: "Date DESC"
      },
      {
        key: "RANKING_ASC",
        value: "Ranking ASC"
      },
      {
        key: "RANKING_DESC",
        value: "Ranking DESC"
      },
      {
        key: "CONTACT_ASC",
        value: "Contact ASC"
      },
      {
        key: "CONTACT_DESC",
        value: "Contact DESC"
      },
      {
        key: "OWNER_ASC",
        value: "Owner ASC"
      },
      {
        key: "OWNER_DESC",
        value: "Owner DESC"
      }
    ];
    let _defaultSort = "DATE_DESC";
    let _sort = _defaultSort;
    let _selectedCount = 0;

    // ######################### //
    // IDS
    // ######################### //

    const initIDs = function () {

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const campaignId = urlParams.get("campaignId");
      const campaignProgram = urlParams.get("program");
      const campaignName = urlParams.get("campaignName");

      if (campaignId !== null && campaignId !== "") {
        _campaignId = campaignId;
        $(".header-pretitle").text(campaignName);
      }

      if (campaignProgram !== null && campaignProgram !== "") {
        _campaignProgram = campaignProgram;
        $(".header-pretitle").text(_campaignProgram);
      }


    };

    // ######################### //
    // SERVER CALLS
    // ######################### //

    const fetchOwners = async function () {

      //
      let fetchMembers = await stent.ajax.getRestAsync(
        "/tenants/" + stent.tenant.key + "/members"
      );

      if (fetchMembers && fetchMembers.ok && fetchMembers.message) {
        return fetchMembers.message;
      } else {
        stent.toast.danger("Error when trying to fetch the ambassadors. Please refresh the page to try again.");
        return null;
      }

    };

    const fetchQueues = async function () {

      if (!_campaignId && !_campaignProgram) {
        stent.toast.danger("No campaign ID or campaign program are found. Please go to the previous page and retry.");
        return [];
      }

      let query = `
        {
          workspaceContext {
            queues (
              first: 30
              where: {
                ${_campaignId ? `campaignId: "${_campaignId}"` : ""} 
                ${_campaignProgram ? `campaignProgram: "${_campaignProgram}"` : ""} 
                ${_filters && _filters.status ? `status : ${_filters.status.toUpperCase()}` : ""} 
                ${_filters && _filters.date ? `date : "${_filters.date}"` : ""} 
                ${_filters && _filters.contactName ? `contactName : "${_filters.contactName}"` : ""} 
                ${_filters && _filters.owner ? `ownerId : "${_filters.owner}"` : ""} 
              }, 
              sort: {
                field: ${_sort.split("_")[0]},
                order: ${_sort.split("_")[1]}
              }
              ${_pageInfo && _pageInfo.hasNextPage && _pageInfo.endCursor ? `after: "${_pageInfo.endCursor}"` : ""}
            )
            {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
              }
              edges {
                node {
                  id
                  details
                  status
                  date
                  ranking
                  checkIn {
                    campaign {
                      id
                      name
                      program
                    }
                    member {
                      id
                      firstName
                      lastName
                      pictureUrl
                      timezone {
                        offset
                        name
                      }
                    }
                  }
                  profile {
                    id
                    firstName
                    lastName
                    pictureUrl
                    headline
                  }
                }
              }
            }
          }
        }`;

      if (stent.log) {
        stent.konsole.group("fetchQueues");
        stent.konsole.log({ data: query });
      }

      // Renew data from server
      var result = await stent.ajax.getApiAsync(query, "POST");

      if (result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.queues &&
        result.message.data.workspaceContext.queues.edges) {

        if (stent.log) {
          stent.konsole.log({ response: result.message.data.workspaceContext.queues });
          stent.konsole.endGroup();
        }

        if (result.message.data.workspaceContext.queues.edges.length > 0) {
          return {
            edges: result.message.data.workspaceContext.queues.edges,
            pageInfo: result.message.data.workspaceContext.queues.pageInfo,
            totalCount: result.message.data.workspaceContext.queues.totalCount
          };

        } else {
          return {
            edges: [],
            pageInfo: result.message.data.workspaceContext.queues.pageInfo,
            totalCount: 0
          };
        }

      } else {

        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        stent.toast.danger("Error when trying to fetch the queues. Please refresh the page to try again.");

        return {
          edges: [],
          pageInfo: result.message.data.workspaceContext.queues.pageInfo,
          totalCount: 0
        };
      }

    };

    // ######################### //
    // FILTERS
    // ######################### //

    const resetFilters = function () {
      $("#filter-table-queue-status").val("").removeClass("active");
      $("#filter-table-queue-date").val("").removeClass("active");
      $("#filter-table-queue-contact-name").val("").removeClass("active");
      $("#filter-table-queue-owner").val("").removeClass("active");

      _filters = {
        status: "",
        date: "",
        contactName: "",
        owner: "",
      };
    };

    const setFilters = function () {

      _filters.status = $("#filter-table-queue-status").val();
      _filters.date = $("#filter-table-queue-date").val();
      _filters.contactName = $("#filter-table-queue-contact-name").val();
      _filters.owner = $("#filter-table-queue-owner").val();

      let params = window.location.search;
      params = new URLSearchParams(params);

      if (_filters.status + _filters.date + _filters.contactName + _filters.owner === "") {
        $("#filter-reset").addClass("d-none");
        params.delete("filters");
      } else {
        $("#filter-reset").removeClass("d-none");
        params.set("filters", JSON.stringify(_filters));
      }

      if (!_initialLoading) {
        // This will create a new entry in the browser's history, without reloading
        let updatedURL = window.location.pathname + "?" + params.toString();
        updatedURL = updatedURL.split("/")[2];

        if (window.history && window.history.state && window.history.state.fileToLoad && window.history.state.fileToLoad !== updatedURL) {
          stent.ui.pushState(updatedURL, false, updatedURL);
        }

      }


    };

    const fillFiltersFromURL = function () {

      _filters = getFiltersFromUrlParams();

      if (_filters) {
        let filtersCount = Object.values(_filters).filter(filter => filter !== "").length;

        if (filtersCount > 0) {
          // Set filter status
          if (_filters.status && _filters.status !== "" && _filters.status !== null) {
            $("#filter-table-queue-status").val(_filters.status).addClass("active");
          }
          // Set filter date
          if (_filters.date && _filters.date !== "") {
            stent.flatpickr.pickers["filter-table-queue-date"].setDate(_filters.date);
            $("#filter-table-queue-date").addClass("active");
          }
          // Set filter contact name
          if (_filters.contactName && _filters.contactName !== "") {
            $("#filter-table-queue-contact-name").val(_filters.contactName).addClass("active");
          }
          // Set filter owner
          if (_filters.owner && _filters.owner !== "") {
            $("#filter-table-queue-owner").val(_filters.owner).addClass("active");
          }
        }
      }

    };

    const getFiltersFromUrlParams = function () {

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const filtersParam = urlParams.get("filters");

      if (filtersParam === null || filtersParam === "") {
        return {};
      }

      try {
        return JSON.parse(filtersParam);
      } catch (e) {
        stent.konsole.group("getFiltersFromUrlParams");
        stent.konsole.error({ response: e });
        stent.konsole.endGroup();
        return {};
      }

    };

    const initFilters = async function () {

      _owners = await fetchOwners();
      if (_owners === null) {
        stent.toast.danger("Error when trying to get the owners. Please refresh the page to try again.");
        return;
      }

      populateOwnerFilterSelect(_owners);
    };

    const populateOwnerFilterSelect = function (owners) {

      let option = new Option("Choose an owner", "");
      $("#filter-table-queue-owner").html($(option));
      owners.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
      owners.forEach(function (owner) {
        let option = new Option(owner.firstName + " " + owner.lastName, owner.id);
        $("#filter-table-queue-owner").append($(option));
      });

    };


    // ######################### //
    // SORT
    // ######################### //

    const initSort = async function () {

      _sorts.forEach(function (sort) {
        let option = new Option(sort.value, sort.key);
        $("#sort-table-queue").append($(option));
      });

    };

    const setSortFromUrlParams = function () {

      // On select
      _sort = $("#sort-table-queue").val();

      const sort_key = _sort.split("_")[0];
      const sort_direction = _sort.split("_")[1];

      // on column header
      $(".change-sort-from-table-header").removeClass("is-sorted").removeClass("is-sorted-ASC");
      $("[data-sort-key=\"" + sort_key + "\"]").addClass("is-sorted").addClass("is-sorted-" + sort_direction);

      let params = window.location.search;
      params = new URLSearchParams(params);
      params.set("sort", _sort);

      if (!_initialLoading) {
        // This will create a new entry in the browser's history, without reloading
        let updatedURL = window.location.pathname + "?" + params.toString();
        updatedURL = updatedURL.split("/")[2];

        if (window.history && window.history.state && window.history.state.fileToLoad && window.history.state.fileToLoad !== updatedURL) {
          stent.ui.pushState(updatedURL, false, updatedURL);
        }
      }


    };

    const getSortFromUrlParams = function () {

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sortParam = urlParams.get("sort");

      if (sortParam === null || sortParam === "") {
        return _defaultSort;
      }

      // Check if the sort param exists in the _sorts definition
      let sortExists = false;
      _sorts.forEach((sort) => {
        if (sortParam === sort.key) {
          sortExists = true;
        }
      });

      if (sortExists) {
        return sortParam;
      } else {
        return _defaultSort;
      }

    };

    const fillSortFromURL = function () {

      _sort = getSortFromUrlParams();

      $("#sort-table-queue").val(_sort).addClass("active");

    };

    // ######################### //
    // LOAD MORE
    // ######################### //

    const bindScroll = function () {

      $("#queue-table")
        .off("scroll")
        .on("scroll", async function () {

          var scrollableDiv = $(this);

          // Bottom is reached
          if ((scrollableDiv[0].scrollHeight - scrollableDiv.height() - 500) < scrollableDiv.scrollTop()) {
            unbindScroll();
            await buildQueuesList(true);
          }

        });
    };

    const unbindScroll = function () {
      $("#queue-table").off("scroll");
    };

    // ######################### //
    // DOM BUILD LIST
    // ######################### //

    const buildQueuesList = async function (isLoadingMore = false) {

      // Update Filters
      setFilters();

      if (isLoadingMore) {
        $(".spinner-grow").removeClass("d-none");
      } else {
        stent.loader.show(".main-content");
      }

      // Fetch
      let _fetchQueues = await fetchQueues();
      _queues = _fetchQueues.edges;
      _totalCount = _fetchQueues.totalCount;
      _pageInfo = _fetchQueues.pageInfo;

      if (isLoadingMore) {
        $(".spinner-grow").addClass("d-none");
      } else {
        stent.loader.hide();
      }

      if (!isLoadingMore) {
        if (_queues.length == 0) {
          $("#queue-table-wrapper").html(
            `
            <div class="alert alert-warning mt-3" role="alert">
              No queue found.
            </div>
            `
          );
          $(".stent-grid-header").addClass("d-none");
          return;
        } else {
          $(".stent-grid-header").removeClass("d-none");
        }
      }

      let html = "";

      if (!isLoadingMore) {
        html += "<div class=\"col stent-grid\" id=\"queue-table\">";
      }

      // Table content
      _queues.forEach(queue => {
        html += queueDOM(queue);
      });

      if (!isLoadingMore) {
        html += "</div>";
      }

      // Table footer
      if (!isLoadingMore) {
        html += `
          <div id="queue-table-footer">
            <div class="spinner-grow spinner-grow-sm d-none" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <strong>${_totalCount.toLocaleString(stent.locale)} record${_totalCount > 1 ? "s" : ""}</strong>
          </div>`;
      }

      if (!isLoadingMore) {
        $("#queue-table-wrapper").html(html);
      } else {
        $("#queue-table").append(html);
      }

      // Display Sort on headers columns
      setSortFromUrlParams();

      // Update Bulk labels
      updateBulkLabels();

      // Scroll load more
      if (_pageInfo && _pageInfo.hasNextPage) {
        bindScroll();
      } else {
        unbindScroll();
      }

      _initialLoading = false;

    };

    const reQueueButtonDOM = function (poolId) {
      return (`
        <a href="#" class="dropdown-item re-queue" data-pool-id="${poolId}">
          <i class="fe fe-rotate-cw"></i> Requeue
        </a>`
      );
    };

    const removeFromQueueButtonDOM = function (poolId) {
      return (`
        <a href="#" class="dropdown-item remove-from-queue" data-toggle="modal" data-target=".confirm-remove-from-queue" data-pool-id="${poolId}">
          <i class="fe fe-user-x"></i> Remove from queue
        </a>`
      );
    };

    const viewJourney = function (contactId) {
      return (`
        <a href="#" class="dropdown-item open-journey" data-contact-key="${contactId}">
          <i class="fe fe-navigation"></i> View journey
        </a>`
      );

    };

    const queueDOM = function (queue) {

      let html = "";
      queue = queue.node;

      let status = queue.status ? queue.status.toLowerCase() : "unknown";
      let date = queue.date ? moment(queue.date).format("ll") : "-";
      let dateComplete = queue.date ? moment(queue.date).format("llll") : "-";
      let poolId = queue.id ? queue.id : null;

      let contact = queue.profile ? queue.profile : null;
      let contactId = contact.id ? contact.id : null;
      let contactFullName = (contact && contact.firstName ? contact.firstName + " " : "") + (contact && contact.lastName ? contact.lastName + " " : "");
      let contactHeadline = contact && contact.headline ? contact.headline : "";
      let contactAvatar = contact && contact.pictureUrl ? contact.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif";

      let owner = queue.checkIn && queue.checkIn.member && queue.checkIn.member.id ? queue.checkIn.member : null;
      let ownerFullName = (owner && owner.firstName ? owner.firstName + " " : "") + (owner && owner.lastName ? owner.lastName + " " : "");
      let ownerAvatar = (owner && owner.pictureUrl) ? owner.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif";
      let tootltipDateTimezoneOffset = "";

      if (owner && owner.timezone && owner.timezone.name && owner.timezone.offset && queue.date) {
        tootltipDateTimezoneOffset += "<div style=&quot; border-top: 1px solid #d5d1e0; margin-top: 3px; padding-top: 3px;&quot;>";
        tootltipDateTimezoneOffset += "<img src=&quot;" + ownerAvatar + "&quot; style=&quot;vertical-align: -4px; margin-right: 3px; width: 16px; height: 16px; border-radius: 100%;&quot; onerror=&quot;this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'&quot; />";
        tootltipDateTimezoneOffset += "<span style=&quot;font-size: 10px;&quot;>" + owner.timezone.name + "</span>";
        tootltipDateTimezoneOffset += "<br />";
        tootltipDateTimezoneOffset += "<span style=&quot;font-size: 10px;&quot;>" + moment(queue.date).utcOffset(owner.timezone.name).format("llll") + "</span>";
        tootltipDateTimezoneOffset += "</div>";
      }

      let details = queue.details ? queue.details : null;

      let origin = queue.checkIn && queue.checkIn.campaign && queue.checkIn.campaign.id ? queue.checkIn.campaign : null;
      let campaignName = origin && origin.name ? origin.name : null;

      let ranking = queue.ranking ? queue.ranking : null;
      let rankingColor = "#e63757";
      let rankingLabel = "Low";

      if (ranking) {
        ranking = ranking * 100;
        if (ranking >= 50 && ranking < 75) {
          rankingColor = "#fd7e14";
          rankingLabel = "Medium";
        } else if (ranking >= 75) {
          rankingColor = "#00d97e";
          rankingLabel = "High";
        }
      }


      /* eslint-disable */
      html += `
      <div class="row stent-grid-tr" data-pool-id="${poolId}">

        <!-- Checkbox + Status -->
        <div class="col col-2 pl-3 select-one-wrapper">
          <!--<input type="checkbox" class="mr-4 select-one" />-->
          <img src="/assets/img/campaigns/queue-icon-${status}.svg" class="queue-icon mr-3" onerror="this.onerror=null;this.src='/assets/img/campaigns/queue-icon-unknown.svg'" />
          <span ${details ? `data-toggle="tooltip" title="${details.replace(/"/gi, `&quot;`)}"` : ``} class="badge badge-queue badge-${status}">${status === 'processed' ? 'Sent' : status}</span>
        </div>

        <!-- date -->
        <div class="col col-1">
          <span 
            data-toggle="tooltip" 
            data-delay="100" 
            data-html="true" 
            title="<div style=&quot;font-size: 11px;&quot;>
              ${dateComplete}
              ${tootltipDateTimezoneOffset}
            </div>">
              ${date}
          </span>
        </div>

        <!-- Contact --> 
        <div class="col col-4 a-contact" data-contact-key="${contactId}">
          <div class="mr-3">
            <img src="${contactAvatar}" class="contact-avatar" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" />
          </div>
          <div>
            <div class="contact-name">${contactFullName}</div>
            <div class="contact-job-title">${contactHeadline}</div>
          </div>
        </div>

        <!-- Ranking -->
        <div class="col col-2" style="position: relative">
          
          ${ranking ?
          `
            <svg height="30" width="30" class="rankingSVG">
              <circle cx="15" cy="15" r="13" class="rankingSVG_background" stroke-width="1" fill="none" />
              <circle cx="15" cy="15" r="13" stroke="${rankingColor}" stroke-width="2.5" fill="none" stroke-dasharray="${ranking * 0.8}, 200" stroke-linecap="round" />
            </svg>
            <span class="ml-2 d-flex" style="flex: 1; overflow: hidden;">${rankingLabel}</span>
            <div class="rankingValue">${Math.round(ranking)}</div>
            ` : ``
        }
        </div>

        <!-- owner | program name | campaign name-->
        <div class="col col-2 text-break">
          ${owner ?
          `
              <div class="mr-3">
                <img src="${ownerAvatar}" class="owner-avatar" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" />
              </div>
              `
          : ``
        }
          ${campaignName ?
          `<div>
                <div class="owner-name">${ownerFullName}</div>
                ${campaignName ? `<span data-toggle="tooltip" title="${campaignName}" class="badge badge-soft-secondary badge-campaign-program">${campaignName}</span>` : ``}
              </div>`
          : ``
        }
        </div>

        <!-- Actions -->
        <div class="col col-1 justify-content-end pr-3">
          <div class="btn-group mb-2">
            <a href="#" class="flex-row align-items-center open-actions pr-2" role="button" data-toggle="dropdown">
              <img src="/assets/img/dots-dark.png" />
            </a>
            <div class="dropdown-menu" data-append-to="body">
              ${status === 'queued' ? removeFromQueueButtonDOM(poolId) : ``}
              ${status === 'pulled' ? removeFromQueueButtonDOM(poolId) : ``}
              ${status === 'pending' ? removeFromQueueButtonDOM(poolId) : ``}
              ${status === 'rejected' ? removeFromQueueButtonDOM(poolId) : ``}
              ${status === 'scheduled' ? removeFromQueueButtonDOM(poolId) : ``}
              ${status === 'processed' ? `` : ``}
              ${status === 'canceled' ? reQueueButtonDOM(poolId) + removeFromQueueButtonDOM(poolId) : ``}
              ${status === 'removed' ? reQueueButtonDOM(poolId) : ``}

              ${viewJourney(contactId)}
              <!--
              <a href="#" class="dropdown-item">
                <i class="fe fe-check-circle"></i> Approve
              </a>

              <a href="#" class="dropdown-item">
                <i class="fe fe-alert-circle"></i> Reject
              </a>

              

              <a href="#" class="dropdown-item">
                <i class="fe fe-upload"></i> Checkout
              </a>

              <a href="#" class="dropdown-item">
                <i class="fe fe-trash"></i> Move to owner blacklist
              </a>

              <a href="#" class="dropdown-item">
                <i class="fe fe-trash-2"></i> Move to workspace blacklist
              </a>
              -->

            </div>
          </div>
        </div>
      </div>`;

      /* eslint-enable */

      /*
      ACTIONS =====
      Remove from queue
      Approve
      Reject
      Requeue
      Checkout
      Move to owner blacklist
      Move to workspace blacklist

      RESERVED
        Remove from queue
        Approve
        Move to owner blacklist
        Move to workspace blacklist

      SCHEDULED
        Reject
        Move to owner blacklist
        Move to workspace blacklist

      CANCELED
        Requeue
        Checkout
        Move to owner blacklist
        Move to workspace blacklist

      SENT
      Move to owner blacklist
      Move to workspace blacklist

      ACCEPTED
      Move to owner blacklist
      Move to workspace blacklist

      REJECTED
      Requeue
      Checkout
      Move to owner blacklist
      Move to workspace blacklist
      */

      return html;
    };

    const updateBulkLabels = function () {
      _selectedCount = $(".select-one:checked").length;
      $(".selected-count").text((_selectedCount > 0 ? _selectedCount : "all") + " contact" + ((_selectedCount > 1 || _selectedCount === 0) ? "s" : ""));
    };

    // ######################### //
    // ACTIONS
    // ######################### //

    const removeFromQueue = async function () {

      // ERROR ON _poolIdToRemove
      if (!_poolIdToRemove) {
        setTimeout(function () {
          stent.toast.danger("Error when trying to remove the contact from queue. Please try again.");
          stent.loader.hide(".modal-content");
        }, 500);
      }

      let query = `
        mutation {
          workspaceContext {
            removeContactFromQueue(input: {
              poolId: "${_poolIdToRemove}"
            }) {
              id
              date
              profile {
                firstName
                lastName
              }
              status
            }
          }
        }`;

      var fetchRemovePool = await stent.ajax.getApiAsync(query, "POST");

      if (fetchRemovePool.ok && (fetchRemovePool.message && !fetchRemovePool.message.errors)) {
        $("tr[data-pool-id=\"" + _poolIdToRemove + "\"]").remove();
        // Update count -1
        let count = parseInt($("#queue-table-footer strong").text(), 10);
        $("#queue-table-footer strong").text(count - 1 + " record" + (count - 1 > 1 ? "s" : ""));
        _poolIdToRemove = null;

      } else {
        // ERROR ON FETCH
        setTimeout(function () {
          stent.toast.danger("Error when trying to remove the contact from queue. Please try again.");
          stent.loader.hide(".modal-content");
        }, 500);

        _poolIdToRemove = null;
      }

    };

    const reQueue = async function (poolId) {

      // ERROR ON _poolIdToRemove
      if (!poolId) {
        setTimeout(function () {
          stent.toast.danger("Error when trying to requeue the contact. Please try again.");
        }, 500);
      }

      let query = `
        mutation {
          workspaceContext {
            requeueContact(input: {
              poolId: "${poolId}"
            }) {
              id
              date
              profile {
                firstName
                lastName
              }
              status
            }
          }
        }`;

      var fetchRequeuePool = await stent.ajax.getApiAsync(query, "POST");

      if (fetchRequeuePool.ok && (fetchRequeuePool.message && !fetchRequeuePool.message.errors)) {
        $("tr[data-pool-id=\"" + poolId + "\"]").remove();
        // Update count -1
        let count = parseInt($("#queue-table-footer strong").text(), 10);
        $("#queue-table-footer strong").text(count - 1 + " record" + (count - 1 > 1 ? "s" : ""));
      } else {
        // ERROR ON FETCH
        setTimeout(function () {
          stent.toast.danger("Error when trying to requeue the contact. Please try again.");
        }, 500);
      }

    };

    const exportAll = async function () {

      const query = `
        mutation {
          workspaceContext {
            exportCampaignQueueToSpreadsheet(input: {
              ${_campaignProgram ? `campaignProgram: "${_campaignProgram}",` : ""}
              ${_campaignId ? `campaignId: "${_campaignId}",` : ""}
              fileName: "${$(".header-pretitle").text()}"
            }) {
              jobId
              success
            }
          }
        }
      `;

      let fetchExportAll = await stent.ajax.getApiAsync(query, "POST");

      if (fetchExportAll.ok && (fetchExportAll.message && !fetchExportAll.message.errors)) {
        let email = stent.user.email ? stent.user.email : "your email";
        stent.toast.success(
          "A link to the excel file will be sent to " + email + " as soon as the file is ready to download."
        );
      } else {
        // ERROR ON FETCH
        setTimeout(function () {
          stent.toast.danger("Error when trying to export the queue as an excel file. Please try again.");
        }, 500);
      }
    };

    // ######################### //
    // BIND EVENTS
    // ######################### //

    const bindEvents = function () {

      $("body")
        .off("click", "#new-campaign-button")
        .on("click", "#new-campaign-button", function () {

          stent.ui.load({ fileToLoad: "campaigns-form.html?flow=" + _flow });
          stent.ui.pushState("campaigns-form.html?flow=" + _flow, false, "campaigns-form?flow=" + _flow);

        });

      $(".filter-table")
        .off("change")
        .on("change", async function () {
          if ($(this).val() !== "") {
            $(this).addClass("active");
          } else {
            $(this).removeClass("active");
          }
          _pageInfo = null;
          await buildQueuesList();
        });

      $("#filter-table-queue-contact-name")
        .off("keyup")
        .on("keyup", function (evt) {
          if (evt.keyCode === 13) {
            $(this).trigger("blur");
          }
        });

      $(".sort-table")
        .off("change")
        .on("change", async function () {
          _pageInfo = null;
          await buildQueuesList();
        });

      $(".main-content")
        .off("click", ".change-sort-from-table-header")
        .on("click", ".change-sort-from-table-header", async function () {

          let sortName = $(this).attr("data-sort-key");
          let sortDirection;

          if ($(this).hasClass("is-sorted-ASC")) {
            $(this).removeClass("is-sorted-ASC").addClass("is-sorted-DESC");
            sortDirection = "DESC";
          } else {
            $(this).addClass("is-sorted-ASC").removeClass("is-sorted-DESC");
            sortDirection = "ASC";
          }

          $("#sort-table-queue").val(sortName + "_" + sortDirection);

          $(".change-sort-from-table-header").removeClass("is-sorted").removeClass("is-sorted-ASC").removeClass("is-sorted-DESC");
          _sort = $("#sort-table-queue").val();

          _pageInfo = null;
          await buildQueuesList();
        });

      $("#filter-reset")
        .off("click")
        .on("click", async function () {
          resetFilters();
          _pageInfo = null;
          await buildQueuesList();
        });

      $(".changeParam")
        .off("input")
        .on("input", async function () {
          stent.loader.show(".main-content");
          _campaigns = await getCampaigns();
          sortCampaigns();
          _pageInfo = null;
          await buildQueuesList();
          stent.loader.hide();
        });

      $(".main-content")
        .off("input", "#select-all")
        .on("input", "#select-all", function () {

          let isSelected = $(this).is(":checked");

          if (isSelected) {
            $(".select-one").closest("tr").addClass("selected");
          } else {
            $(".select-one").closest("tr").removeClass("selected");
          }

          $(".select-one").prop("checked", isSelected);

          updateBulkLabels();
        });

      $(".main-content")
        .off("click", ".select-one")
        .on("click", ".select-one", function (e) {
          e.stopPropagation();
          $(this).closest("tr").toggleClass("selected");

          // Update the status of the select-all option
          if ($(".select-one").length === $(".select-one:checked").length) {
            $("#select-all").prop("checked", true);
          } else {
            $("#select-all").prop("checked", false);
          }

          updateBulkLabels();
        });

      // $(".main-content")
      //   .off("click", "#queue-table tbody .select-one-wrapper")
      //   .on("click", "#queue-table tbody .select-one-wrapper", function () {

      //     let isSelected = $(this).find(".select-one").is(":checked");
      //     $(this).closest("tr").toggleClass("selected");
      //     $(this).find(".select-one").prop("checked", !isSelected);

      //     if ($(".select-one").length === $(".select-one:checked").length) {
      //       $("#select-all").prop("checked", true);
      //     } else {
      //       $("#select-all").prop("checked", false);
      //     }

      //     updateBulkLabels();

      //   });

      $(".main-content")
        .off("click", ".a-contact")
        .on("click", ".a-contact", function (e) {
          e.stopPropagation();

          let contactKey = $(this).attr("data-contact-key");
          stent.contact.open(contactKey);
        });

      $("body")
        .off("click", ".open-journey")
        .on("click", ".open-journey", function (e) {
          e.stopPropagation();
          let contactKey = $(this).attr("data-contact-key");
          stent.contact.open(contactKey);
        });

      $("body")
        .off("click", ".remove-from-queue")
        .on("click", ".remove-from-queue", function (e) {
          e.preventDefault();
          _poolIdToRemove = $(this).attr("data-pool-id");
        });

      $("body")
        .off("click", ".confirm-button-remove-from-queue")
        .on("click", ".confirm-button-remove-from-queue", async function () {

          stent.loader.show(".modal-content");
          await removeFromQueue();
          $(".confirm-remove-from-queue").modal("hide");
          stent.loader.hide(".modal-content");

        });

      $("body")
        .off("click", ".re-queue")
        .on("click", ".re-queue", async function (e) {
          e.preventDefault();
          stent.loader.show(".main-content");
          const _poolIdToRequeue = $(this).attr("data-pool-id");
          await reQueue(_poolIdToRequeue);
          stent.loader.hide();

        });

      $("body")
        .off("click", "#export-all")
        .on("click", "#export-all", async function (e) {
          e.preventDefault();

          stent.loader.show(".main-content");
          await exportAll();
          stent.loader.hide();

        });


    };


    // ######################### //
    // INIT
    // ######################### //

    const init = async function () {

      stent.loader.show(".main-content");

      // Active corresponding menu
      stent.navbar.activeMenu("#sidebarCampaigns");

      // change Page title
      stent.ui.setPageTitle("Queue");

      //bind events
      bindEvents();

      // Init IDS
      initIDs();

      // Fill Select filters input
      await initFilters();

      // set Filters from URL
      fillFiltersFromURL();

      // Fill select sort input
      initSort();

      // set Sort form URL
      fillSortFromURL();

      // Remove Loader
      stent.loader.hide();

      // Build finders DOM
      buildQueuesList();

    };

    init();

    return {
      filters: function () {
        return _filters;
      },
      getFiltersFromUrlParams

    };

  })();

});