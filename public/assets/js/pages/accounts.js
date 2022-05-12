"use strict";

stent.requireJS(["draggable", "slider"], function () {

  stent.accounts = stent.accounts || {};

  stent.accounts = (function () {

    let _finderId = null;
    let _finder = null;
    let _members = null;
    let _hoverIndex = null;
    let _source = null;
    let _output = null;
    let _filters = {
      lookupKeywords: "",
      similarity: [0, 100],
      status: "",
      matchKeywords: ""
    };
    let _totalCount = null;
    let _pageInfo = null;
    let _sort = null;


    const getInitialSortFromURL = function () {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      // STATUS, PROBABILITY, LOOKUP, MATCH
      let initialSort = urlParams.get("initialSort") ? urlParams.get("initialSort") : "STATUS_ASC";

      return initialSort;
    };


    const getMembers = async function () {
      let fetchMembers = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/members");

      if (fetchMembers && fetchMembers.ok && fetchMembers.message) {
        return fetchMembers.message;
      } else {
        stent.toast.danger("Error when trying to fetch the ambassadors. Please refresh the page to try again.");
        return null;
      }
    };


    const initMembers = async function () {
      _members = await getMembers();
      if (_members === null) {
        stent.toast.danger("Error when trying to get the ambassadors. Please refresh the page to try again.");
      }
    };


    const initFilters = function () {
      $("#filter-table-lookup-fulltext").css("background-image", "url('" + _source.icon + "')");
    };


    const resetFilters = function () {
      $("#filter-table-lookup-fulltext").val("").removeClass("active");
      $("#filter-table-slider").removeClass("active");
      document.getElementById("filter-table-slider").noUiSlider.set([0, 100]);
      $("#filter-table-match-status").val("").removeClass("active");
      $("#filter-table-match-fulltext").val("").removeClass("active");

      _filters = {
        lookupKeywords: "",
        similarity: [0, 100],
        status: "",
        matchKeywords: ""
      };

      $("#filter-reset").addClass("d-none");
    };


    const setFilters = function () {
      _filters.lookupKeywords = $("#filter-table-lookup-fulltext").val();
      _filters.similarity = document.getElementById("filter-table-slider").noUiSlider.get();
      _filters.status = $("#filter-table-match-status").val();
      _filters.matchKeywords = $("#filter-table-match-fulltext").val();

      if (_filters.lookupKeywords + _filters.status + _filters.matchKeywords === "" && _filters.similarity[0] === 0 && _filters.similarity[1] === 100) {
        $("#filter-reset").addClass("d-none");
      } else {
        $("#filter-reset").removeClass("d-none");
      }
    };


    const doFilters = async function () {
      _pageInfo = null;
      stent.loader.show(".main-content");

      let fetchFinder = await stent.finders.fetchFinder(_finderId, _pageInfo, _filters, _sort);

      if (fetchFinder && fetchFinder.ok) {
        _finder = fetchFinder.message;
        renderAccounts(true);
        renderFooter();
      } else {
        stent.toast.danger("An error occured when trying to filtered accounts. please retry.");
      }

      stent.loader.hide();
    };


    const doExportAllAccountsAsExcel = async function () {

      let query = `
        mutation {
          workspaceContext {
            exportFinderMatchesToSpreadsheet(
              input: { finderId: "${_finderId}", fileName: "${(_source.key + "_" + _output.key + "_" + _finder.name).replace(/"/g, '\\"')}" }
            ) {
              jobId
              success
            }
          }
        }`;

      stent.konsole.group("exportFinderMatchesToSpreadsheet");
      stent.konsole.log({ data: query });

      var result = await stent.ajax.getApiAsync(query, "POST");

      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.exportFinderMatchesToSpreadsheet &&
        result.message.data.workspaceContext.exportFinderMatchesToSpreadsheet.success
      ) {

        if (stent.log) {
          stent.konsole.log({ response: result.message });
          stent.konsole.endGroup();
        }

        let email = stent.user.email ? stent.user.email : "your email";
        stent.toast.success(
          "A link to the excel file will be sent to " + email + " as soon as the file is ready to download."
        );

      } else {

        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        // ERROR ON FETCH
        setTimeout(function () {
          stent.toast.danger("Error when trying to export the accounts as an excel file. Please try again.");
        }, 500);
      }
    };


    const switchStatus = async function (finderId, state, additionnalsInputs) {

      let _additionnalsInputs = "";

      if (additionnalsInputs) {
        Object.entries(additionnalsInputs).forEach(([key, value]) => {
          _additionnalsInputs += `${key}: "${value}"\n`;
        });
      }

      let action = "";
      if (state === "ACTIVE") {
        action = "startFinder";
      } else if (state === "STOP") {
        action = "stopFinder";
      } else if (state === "ARCHIVE") {
        action = "archiveFinder";
      } else if (state === "UNARCHIVE") {
        action = "unarchiveFinder";
      } else if (state === "EXECUTE") {
        action = "startFinderSlot";
      } else {
        stent.toast.danger("Unknown action on finder. Please try again.");
        return false;
      }

      let query = `
        mutation {
          workspaceContext {
            ${action} (
              input: {
                finderId: "${finderId}"
                ${_additionnalsInputs}
              }
            ) {
              success
            }
          }
        }`;

      stent.konsole.group("switchStatus");
      stent.konsole.log({ data: query });

      var result = await stent.ajax.getApiAsync(query, "POST");

      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext[action] &&
        result.message.data.workspaceContext[action].success
      ) {

        if (stent.log) {
          stent.konsole.log({ response: result.message });
          stent.konsole.endGroup();
        }

        return true;

      } else {

        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        // ERROR ON FETCH
        stent.toast.danger("Error when trying to " + state.toLowerCase() + " the finder. Please try again.");
        return false;
      }

    };


    const rankFinderCandidates = async function (finderId) {

      let query = `
        mutation {
          workspaceContext {
            rankFinderCandidates(finderId: "${finderId}") {
              success
              finder {
                id
              }
            }
          }
        }`;

      stent.konsole.group("rankFinderCandidates");
      stent.konsole.log({ data: query });

      var result = await stent.ajax.getApiAsync(query, "POST");

      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.rankFinderCandidates &&
        result.message.data.workspaceContext.rankFinderCandidates.success
      ) {

        if (stent.log) {
          stent.konsole.log({ response: result.message });
          stent.konsole.endGroup();
        }

        return true;

      } else {

        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        // ERROR ON FETCH
        stent.toast.danger("Error when trying to rank the candidates. Please try again.");
        return false;
      }

    };


    const getFinderIdFromURL = function () {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      return urlParams.get("finderId");
    };


    const getMemberByIdentityKey = function (key) {
      return _members.filter((member) => member.memberId === key)[0];
    };


    let colMover = new Draggabilly(document.querySelector("#accounts-mover-col"), {
      axis: "x",
      containment: "#accounts-table-wrapper",
      grid: [1, 1]
    });


    let UI = {
      table: $("#accounts-table").width(),
      minTable: 650,
      common: 0,
      minCommon: 400,
      actionsLookup: 0, // 46
      actionsProfile: 0, // 46
      status: 45,
      similarity: 65,
      mover: 20,
      moverX: 0,
      scrollBar: 15
    };


    const initUI = function () {

      UI.common = (UI.table - ((UI.actionsLookup + UI.actionsProfile) + UI.mover + UI.scrollBar + UI.similarity)) / 2;

      // Common columns
      $("#accounts-source-common-col").css({
        "flex": `0 0 ${UI.common}px`,
      });

      $("#accounts-profile-common-col").css({
        "flex": `0 0 ${UI.common}px`,
      });

      // Actions columns
      $("#accounts-source-actions-col").css({
        "flex": `0 0 ${UI.actionsLookup}px`
      });

      // Similarity columns
      $("#accounts-source-similarity-col").css({
        "flex": `0 0 ${UI.similarity}px`
      });

      // Similarity columns
      $("#accounts-profile-status-col").css({
        "flex": `0 0 ${UI.similarity}px`
      });

      $("#accounts-profile-actions-col").css({
        "flex": `0 0 ${UI.actionsProfile}px`
      });

      let moverXLocalStorage = localStorage.getItem("moverX");

      // Mover
      $("#accounts-mover-col").css({
        "width": UI.mover + "px",
        "left": `${moverXLocalStorage ? moverXLocalStorage + "px" : UI.common + UI.actionsLookup + UI.scrollBar + UI.similarity - 2 + "px"}`
      });

      // Filter table slider
      var slider = document.getElementById("filter-table-slider");

      noUiSlider.create(slider, {
        start: [0, 100],
        connect: true,
        step: 1,
        tooltips: true,
        range: {
          "min": 0,
          "max": 100
        },
        format: {
          from: Number,
          to: function (value) {
            return (parseInt(value));
          }
        }
      });

      slider.noUiSlider.on("change", async function (values) {
        if (values[0] === 0 && values[1] === 100) {
          $(slider).removeClass("active");
        } else {
          $(slider).addClass("active");
        }

        setFilters();
        doFilters();

      });


    };


    const copyToClipboard = function () {
      var textBox = document.getElementById("finder-data");
      textBox.select();
      if (document.execCommand("copy") === true) {
        stent.toast.success("Copied!");
      } else {
        stent.toast.error("Error when copying the value.");
      }
      textBox.blur();
    };


    const onDragEnd = function (isResizing = false) {

      if (isResizing) {
        UI.table = $("#accounts-table").width();
      }
      UI.moverX = parseInt($("#accounts-mover-col").css("left"), 10);

      if (UI.table < UI.minTable) {
        $("#accounts-mover-col").css({ "left": `${UI.minCommon + "px"}` });
        UI.moverX = parseInt($("#accounts-mover-col").css("left"), 10);
      } else if (UI.moverX < UI.minCommon) { // Check if the min columns width are respected
        $("#accounts-mover-col").css({ "left": `${UI.minCommon + "px"}` });
        UI.moverX = parseInt($("#accounts-mover-col").css("left"), 10);
      } else if (UI.moverX > UI.table - (UI.minCommon + UI.actionsLookup + UI.scrollBar + UI.similarity)) {
        $("#accounts-mover-col").css({ "left": `${UI.table - (UI.minCommon + UI.actionsLookup) + "px"}` });
        UI.moverX = parseInt($("#accounts-mover-col").css("left"), 10);
      }

      // Save UI.moverX to localStorage
      localStorage.setItem("moverX", UI.moverX);

      let colSourceWidth = UI.moverX - UI.actionsLookup - UI.scrollBar + 2;
      let colProfileWidth = UI.table - colSourceWidth - (UI.actionsLookup + UI.actionsProfile) - UI.mover - UI.scrollBar - UI.status - UI.similarity;

      $("#accounts-source-common-col").css("flex", "0 0 " + colSourceWidth + "px");
      $("#accounts-profile-common-col").css("flex", "0 0 " + colProfileWidth + "px");

      $("#accounts-table").removeClass("on-move");
    };


    const bindScroll = function () {

      $("#accounts-table")
        .off("scroll")
        .on("scroll", async function () {

          var scrollableDiv = $(this);

          // Bottom is reached
          if ((scrollableDiv[0].scrollHeight - scrollableDiv.height() - 500) < scrollableDiv.scrollTop()) {
            unbindScroll();

            $("#accounts-table-footer .spinner-grow").removeClass("d-none");

            let fetchFinder = await stent.finders.fetchFinder(_finderId, _pageInfo, _filters, _sort);

            if (fetchFinder && fetchFinder.ok) {
              _finder = fetchFinder.message;
              renderAccounts();
            } else {
              stent.toast.danger("An error occured when trying to get more accounts. please retry");
              bindScroll();
            }

            $("#accounts-table-footer .spinner-grow").addClass("d-none");
          }

        });
    };


    const unbindScroll = function () {
      $("#accounts-table").off("scroll");
    };


    const resetFinder = async function () {

      let query = `
        mutation {
          workspaceContext {
            resetFinder(finderId: "${_finderId}") {
              success
            }
          }
        }`;

      stent.konsole.group("resetFinder");
      stent.konsole.log({ data: query });

      var result = await stent.ajax.getApiAsync(query, "POST");

      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.resetFinder &&
        result.message.data.workspaceContext.resetFinder.success
      ) {

        if (stent.log) {
          stent.konsole.log({ response: result.message });
          stent.konsole.endGroup();
        }

        stent.toast.success("The finder has been well reseted");

        stent.ui.pushState("finder-list", false, "finder-list");
        stent.ui.load({ fileToLoad: "finder-list" });

      } else {

        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        // ERROR ON FETCH
        stent.toast.danger("Error when trying to reset the finder. Please try again.");
        return false;
      }

    };


    const targetIconDOM = function (target) {
      let _target = target ? target : "UNKNOWN";
      return `<b class="target-icon target-icon-large target-icon-${_target.toLowerCase()}">
        ${_target.charAt(0)}
      </b>`;
    };


    const renderHeader = function () {

      let html = "";

      let finder = _finder;

      let target = finder.target ? finder.target : null;

      let id = finder.id ? finder.id : null;

      let lastJobId = null;
      if (finder.provisioner && finder.provisioner.sync && finder.provisioner.sync.jobId) {
        lastJobId = finder.provisioner.sync.jobId;
      }

      _source = { icon: "/assets/img/finders/unknown.svg", name: "" };
      if (finder.provisioner && finder.provisioner.type) {
        _source = stent.finders.getSourceByKey(finder.provisioner.type);
      }

      _output = { icon: "/assets/img/finders/unknown.svg", name: "", key: null };
      if (finder.entity && (finder.entity === "CONTACT" || finder.entity === "COMPANY")) {
        _output = stent.finders.getOutputByKey(finder.entity.toLowerCase());
      }

      let hasFilterOnCompany = finder.provisioner && finder.provisioner.filterOnCompany ? true : false;

      let name = finder.name ? finder.name : "";

      let status = finder.status ? finder.status : "";

      let owner = {
        id: "",
        pictureUrl: "/assets/img/avatars/profiles/default-avatar.gif",
        displayName: ""
      };

      if (finder.owner && finder.owner.id) {
        owner.id = finder.owner.id;
      }
      if (finder.owner && (finder.owner.firstName || finder.owner.lastName)) {
        owner.displayName = finder.owner.firstName + " " + finder.owner.lastName;
      }
      if (finder.owner && finder.owner.pictureUrl) {
        owner.pictureUrl = finder.owner.pictureUrl;
      }

      let miners = finder.additionalMembers && finder.additionalMembers.length > 0 ? finder.additionalMembers : [];

      let progressPercent = finder.progress ? Math.ceil(finder.progress * 100) : 0;

      let state = finder.state ? finder.state : null;

      let syncStateImg = "/assets/img/unknown.svg";
      let syncStateLabel = "-";
      let syncNumbers = "";

      if (state && (typeof finder.processed !== "undefined" || typeof finder.fetched !== "undefined")) {
        syncNumbers = (typeof finder.processed !== "undefined" ? finder.processed : "...") + " / " + (typeof finder.fetched !== "undefined" ? finder.fetched : "...");
      }

      if (state === "STOPPED") {
        syncStateImg = "/assets/img/error.svg";
        syncStateLabel = "Stopped";
      } else if (state === "ERROR") {
        syncStateImg = "/assets/img/warning.svg";
        syncStateLabel = "Error";
      } else if (state === "FETCHING") {
        syncStateImg = "/assets/img/fetching.svg";
        syncStateLabel = "Fetching profiles";
        if (_finder.entity === "COMPANY") {
          syncStateLabel = "Fetching companies";
        }
      } else if (state === "SYNCING") {
        syncStateImg = "/assets/img/syncing.svg";
        syncStateLabel = "Syncing profiles";
        if (_finder.entity === "COMPANY") {
          syncStateLabel = "Syncing companies";
        }
      } else if (state === "PROCESSED") {
        syncStateImg = "/assets/img/processed.svg";
        syncStateLabel = "Processed";
      } else if (state === "IDLE") {
        syncStateImg = "/assets/img/idle.svg";
        syncStateLabel = "Idle";
      }

      let additionnalMessage = "";
      // Additionnal sync message
      if (finder.provisioner && finder.provisioner.sync && finder.provisioner.sync.message) {
        additionnalMessage = finder.provisioner.sync.message;
      }

      if (additionnalMessage !== "") {
        syncStateLabel += `<span style="vertical-align: -2px;" class="fe fe-help-circle ml-2" title="${additionnalMessage.replace(/"/gi, "&quot;")}" data-toggle="tooltip"></span>`;
      }

      $("#finder-header").attr("data-finder-id", id);
      $("#finder-header").attr("data-finder-last-job-id", lastJobId);

      /* eslint-disable */
      html += `

        <!-- Source / Output / Name -->
        <div class="col col-3 d-flex justify-content-center align-items-center" style="word-break: break-all">
          <span style="display: flex;" data-toggle="tooltip" data-delay="100" data-html="true" data-placement="top" title="<div style='font-size: 11px;'>Target: <strong>${finder.target ? finder.target.toLowerCase() : 'unknown'}</strong><br />Source: <strong>${_source.name}</strong><br />Output: <strong>${_output.name}</strong>${hasFilterOnCompany ? `<br />Filter on company: <strong>YES</strong>` : ``}</div>">
            ${targetIconDOM(finder.target)}  
            <img src="${_source.icon}" class="finder-icon finder-icon-large" style="margin-left: -10px;" />
            <img src="${_output.icon}" class="mr-2 finder-icon finder-icon-large" style="margin-left: -10px;" />
            ${hasFilterOnCompany
          ? "<img src=\"/assets/img/finders/companies.svg\" class=\"mr-2 finder-icon finder-icon-large\" style=\"margin-left: -15px;\" />"
          : ""
        }
          </span>
          <div style="flex: 1;" class="pr-3">
            <div class="title">${_source.name}</div>
            <div class="value">${name}</div>
          </div>
        </div>
        
        <!-- Owner -->
        <div class="col col-3 d-flex pl-3 align-items-center">
          <img
            src="${owner.pictureUrl}"
            onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'"
            class="mr-3 finder-icon-large"
          />
    
          <div style="flex: 1;">
            <div class="title">Owner</div>
            <div class="value" style="margin: 0; margin-right: 8px;">
              ${owner.displayName}
              ${buildMinersBadgeDOM(miners)}
            </div>
          </div>
        </div>

        <!-- Sync -->
        <div class="col col-2 d-flex pl-3">
          <div class="d-flex align-items-center">
            <img class="finder-status-icon" src="${syncStateImg}" data-toggle="tooltip" title="Refresh" />
            <div style="line-height: 120%" class="ml-3">
              ${syncStateLabel ? `<div class="title">${syncStateLabel}</div>` : ''}
              <div class="value">${syncNumbers}</div>
            </div>
          </div>
          <textarea id="finder-data" style="width: 0px; height: 0px; outline: none; resize: none; overflow: auto; opacity: 0;">Finder ID: ${id}\nFinder job ID: ${lastJobId}</textarea>
        </div>
            
        <!-- Progress -->
        <div class="col col-2 d-flex pl-3 pr-5 justify-content-center align-items-center">
          <div class="progress w-100 mr-3">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: ${progressPercent}%"
              aria-valuenow="${progressPercent}"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div>
            <div class="title">Progress</div>
            <div class="value">${progressPercent}%</div>
          </div>
        </div>
          
        <!-- Status -->
        <div class="col col-1 d-flex pl-3 justify-content-center align-items-center ">
          
          ${status !== 'ARCHIVE' ?
          `<div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input contacts-finder-status"
                id="${id}"
                ${status === 'ACTIVE' ? "checked='checked'" : ""}
              />
              <label class="custom-control-label" for="${id}"></label>
            </div>` : ``
        }

          <div>
            <div class="title">Status</div>
            <div class="value">
              ${status === 'ARCHIVE' ? `<span class="badge badge-warning">Archived</span>` : status}
            </div>
          </div>

        </div>
    
        <!-- Actions -->
        <div class="col col-1 d-flex justify-content-end">
          <div class="btn-group">
            <a href="#" class="d-flex flex-row align-items-center open-actions mr-2" role="button" data-toggle="dropdown">
              <img src="/assets/img/dots-dark.png" />
            </a>

            <div class="dropdown-menu dropdown-menu-right">
              ${status === 'ARCHIVE' ? renderAction(['duplicate', 'unarchive', 'copy'], id) :
          state === 'STOPPED' ? renderAction(['edit', 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id) :
            state === 'ERROR' ? renderAction(['edit', 'execute', 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id) :
              state === 'FETCHING' ? renderAction(['edit', 'execute', 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id) :
                state === 'SYNCING' ? renderAction(['edit', 'execute', 'duplicate', target === 'CANDIDATE' ? 'rank' : null, 'archive', 'separator', 'reset', 'separator', 'copy'], id) :
                  state === 'PROCESSED' ? renderAction(['edit', 'execute', 'duplicate', target === 'CANDIDATE' ? 'rank' : null, 'archive', 'separator', 'reset', 'separator', 'copy'], id) : ``}
            </div>
    
          </div>
        </div>
      `;

      /* eslint-enable */

      $("#finder-header").html(html);


    };


    const renderAccountsHeaders = function () {

      $("#accounts-source-common-col .an-account-header span").empty();

      $("#accounts-source-common-col .an-account-header span").prepend(
        `
        <img src="${_source.icon}" class="source-avatar">
        ${_source.name} ${_finder.entity === "CONTACT" ? "contacts" : _finder.entity === "COMPANY" ? "companies" : ""}
        `
      );

      if (_finder.entity === "COMPANY") {
        $("#accounts-profile-common-col .an-account-header span").html(
          `<img src="/assets/img/avatars/profiles/default-company.gif" class="source-avatar">
          COMPANIES
          `
        );

        $("#filter-table-match-status [value=\"NOTFOUND\"]").text("Company not found");
        $("#filter-table-match-status [value=\"SYNCING\"]").text("Syncing company");
      }

      // Define the sorted column UI
      let sortName = _sort.split("_")[0];
      let sortDirection = _sort.split("_")[1];
      $("[data-sort-key=\"" + sortName + "\"]").addClass("is-sorted").addClass("is-sorted-" + sortDirection);

    };


    const renderAccounts = function (clearList = false) {

      let edges = null;

      if (_finder.matches && _finder.matches.edges) {
        edges = _finder.matches.edges;
        _totalCount = _finder.matches.totalCount !== null ? _finder.matches.totalCount : 0;
        _pageInfo = _finder.matches.pageInfo;
      }

      if (edges != null) {

        let html = {
          lookup: {
            common: "",
            actions: "",
          },
          relevancy: "",
          match: {
            status: "",
            common: "",
            actions: "",
          }

        };

        if (stent.log) {
          stent.konsole.group("Accounts");
        }

        edges.forEach((account) => {

          let _account = account.node;

          if (stent.log) {
            stent.konsole.log({ data: _account });
          }

          let sync = _account.sync ? _account.sync : null;
          let status = (sync && sync.status) ? sync.status : "unknown";
          let statusLabel = "";
          switch (status) {
            case "unknown":
              statusLabel = "Unknown";
              break;
            case "SYNCHRONIZED":
              statusLabel = "Synchronized";
              break;
            case "NOTFOUND":
              statusLabel = _finder.entity === "CONTACT" ? "Profile was not found" : _finder.entity === "COMPANY" ? "Company was not found" : "Profile was not found";
              break;
            case "SYNCING":
              statusLabel = "Syncing " + (_finder.entity === "CONTACT" ? "Profile" : _finder.entity === "COMPANY" ? "Company" : "Profile");
              break;
            case "PENDING":
              statusLabel = "Pending...";
              break;
            case "FAILED":
              statusLabel = "Error";
              break;
            default:
              statusLabel = "Unknown";
          }

          let entity = _finder.entity;

          let lookup = _account.lookup ? _account.lookup : null;
          let lookupFullName = "";

          if (entity === "CONTACT") {
            lookupFullName = (lookup && lookup.firstName ? lookup.firstName + " " : "") + (lookup && lookup.lastName ? lookup.lastName : "");
          } else if (entity === "COMPANY") {
            lookupFullName = (lookup && lookup.company ? lookup.company : "");
          }

          let lookupPictureUrl = "/assets/img/avatars/profiles/default-avatar.gif";
          if (entity === "CONTACT") {
            lookupPictureUrl = (lookup && lookup.pictureUrl ? lookup.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif");
          } else if (entity === "COMPANY") {
            lookupPictureUrl = (lookup && lookup.pictureUrl ? lookup.pictureUrl : "/assets/img/avatars/profiles/default-company.gif");
          }


          let lookupCity = (lookup && lookup.city ? lookup.city : "");
          let lookupCompany = (lookup && lookup.company ? lookup.company : "");
          let lookupCountry = (lookup && lookup.country ? lookup.country : "");
          let lookupHeadline = (lookup && lookup.headline ? lookup.headline.replace(/<div>/gi, "").replace(/<\/div>/gi, "") : "");

          let userInfosArray = [];

          if (lookupCity !== "") {
            userInfosArray.push(lookupCity);
          }
          if (entity === "CONTACT" && lookupCompany !== "") {
            userInfosArray.push(lookupCompany);
          }
          if (lookupCountry !== "") {
            userInfosArray.push(lookupCountry);
          }
          if (lookupHeadline !== "") {
            userInfosArray.push(lookupHeadline);
          }

          let match = _account.match ? _account.match : null;
          let matchId = (match && match.id ? match.id : null);
          let matchFullName = "";
          if (entity === "CONTACT") {
            matchFullName = (match && match.firstName ? match.firstName + " " : "") + (match && match.lastName ? match.lastName : "");
          } else if (entity === "COMPANY") {
            matchFullName = (match && match.company ? match.company : "");
          }


          let matchPictureUrl = "/assets/img/avatars/profiles/default-avatar.gif";
          if (entity === "CONTACT") {
            matchPictureUrl = (match && match.pictureUrl ? match.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif");
          } else if (entity === "COMPANY") {
            matchPictureUrl = (match && match.pictureUrl ? match.pictureUrl : "/assets/img/avatars/profiles/default-company.gif");
          }

          let matchHeadline = match && match.headline ? match.headline : "";
          let matchCity = match && match.city ? match.city + " " : "";
          let matchCountry = match && match.country ? match.country + " " : "";
          let matchCompany = match && match.company ? match.company + " " : "";

          let matchDescription = "";
          if (entity === "CONTACT") {
            if (matchHeadline + matchCity + matchCountry + matchCompany !== "") {
              matchDescription = `<p class="user-info">
                                    ${matchHeadline} 
                                    ${matchCity ? "- " + matchCity : ""} 
                                    ${matchCountry ? "- " + matchCountry : ""} 
                                    ${matchCompany ? "- " + matchCompany : ""}
                                  </p>`;
            }
          } else if (entity === "COMPANY") {
            if (matchHeadline + matchCity + matchCountry !== "") {
              matchDescription = `<p class="user-info">
                                    ${matchHeadline} 
                                    ${matchCity ? "- " + matchCity : ""} 
                                    ${matchCountry ? "- " + matchCountry : ""} 
                                  </p>`;
            }
          }

          let similarity = "-";
          let similarityTooltip = "-";
          if (status !== "PENDING" || (status === "PENDING" && match !== null) && _account.relevancy && typeof _account.relevancy.probability !== "undefined" && _account.relevancy.probability !== null) {
            similarity = Math.floor(_account.relevancy.probability * 100);
            similarityTooltip = (_account.relevancy.probability * 100).toFixed(2);
          }
          let confidence = "";
          let confidenceClass = "";
          if (status !== "PENDING" || (status === "PENDING" && match !== null)) {
            if (_account.relevancy && _account.relevancy.confidence) {
              confidence = _account.relevancy.confidence.toLowerCase();
              confidenceClass = confidence;
            }
          } else {
            confidenceClass = "pending";
          }

          let profileType = (match && match.provider) ? match.provider : null;
          let profileTypeImage = null;

          let identifier = (match && match.identifier) ? match.identifier : null;

          // Additionnal sync message
          let additionnalMessage = "";
          if (_account.sync && _account.sync.message && _account.sync.message !== "") {
            additionnalMessage = `<span class="fe fe-help-circle ml-2 account-additional-message" data-message="${additionnalMessage}" title="${_account.sync.message.replace(/"/gi, "&quot;")}" data-toggle="tooltip"></span>`;
          }

          switch (profileType) {
            case "linkedin.profile":
              profileTypeImage = "<img class=\"profile-type-image\" src=\"/assets/img/members/icon-linkedin.svg\" />";
              break;

            default:
              profileTypeImage = "";
          }

          /* eslint-disable */
          html.lookup.common += `
            <div class="an-account-wrapper d-flex px-3 align-items-center no-border-left">
              <img
                class="user-avatar"
                src="${lookupPictureUrl}"
                onerror="this.onerror=null;this.src='${entity === 'CONTACT' ? `/assets/img/avatars/profiles/default-avatar.gif` : entity === 'COMPANY' ? `/assets/img/avatars/profiles/default-company.gif` : `/assets/img/avatars/profiles/default-avatar.gif`}'"
              />
              <div class="user-infos">
                <h3 class="user-fullname">${lookupFullName}</h3>
                ${userInfosArray.length > 0 ?
              `<p class="user-info">
                    ${userInfosArray.join(' - ')}
                  </p>` :
              ""
            }
              </div>
            </div>
          `;

          // html.lookup.actions += `
          //   <div class="an-account-wrapper left-shadow">
          //     <img class="open-actions" src="/assets/img/dots-dark.png" role="button" data-toggle="dropdown" />
          //     <div class="dropdown-menu dropdown-menu-right">
          //       <a href="#" class="dropdown-item"> <i class="fe fe-trash"></i> Remove </a>
          //     </div>
          //   </div>
          // `;

          html.lookup.actions += ``;

          html.relevancy += `
            <div class="an-account-wrapper">
              <div class="d-flex an-account-similarity border-right confidence-${confidenceClass}" data-toggle="tooltip" title="${similarityTooltip}">
                <div>${similarity}${similarity !== '-' ? '<span>%</span>' : ''}</div>
                ${confidence !== '' ? `<div class="confidence-label">${confidence}</div>` : ``}
              </div>
            </div>
          `;

          html.match.status +=
            `<div 
            class="an-account-wrapper d-flex align-items-center justify-content-center no-border-left border-right" 
            ${matchId ? `data-match-id="${matchId}"` : ``}
            ${profileType === 'linkedin.profile' && identifier ? `data-contact-key="${identifier}"` : ""}>
              <img 
                src="/assets/img/${status.toLowerCase()}.svg" 
                class="match-status-image" data-toggle="tooltip" title="${statusLabel}" />
              ${additionnalMessage}
          </div>`;

          html.match.common +=
            `<div 
            class="an-account-wrapper d-flex px-3 align-items-center no-border-left" 
            ${matchId ? `data-match-id="${matchId}"` : ``}
            ${profileType === 'linkedin.profile' && identifier ? `data-contact-key="${identifier}"` : ""}>

              ${match ?
              `
              <div style="position: relative;">
                
                <img
                  class="user-avatar"
                  src="${matchPictureUrl}"
                  onerror="this.onerror=null;this.src='${entity === 'CONTACT' ? `/assets/img/avatars/profiles/default-avatar.gif` : entity === 'COMPANY' ? `/assets/img/avatars/profiles/default-company.gif` : `/assets/img/avatars/profiles/default-avatar.gif`}'"
                />
                
                ${profileTypeImage}
              </div>
              <div class="user-infos">
                <h3 class="user-fullname">${matchFullName}</h3>
                ${matchDescription}
              </div>
              ` :
              `
              <div class="match-info">
                ${statusLabel}
              </div>
              `
            }
          </div>`;

          html.match.actions += ``;

          // html.match.actions += `
          //   <div class="an-account-wrapper left-shadow">
          //     <img class="open-actions" src="/assets/img/dots-dark.png" role="button" data-toggle="dropdown" />
          //     <div class="dropdown-menu dropdown-menu-right">
          //       <!--<a href="#" class="dropdown-item"> <i class="fe fe-user-x"></i> Match another </a>-->
          //       <a href="#" class="dropdown-item"> <i class="fe fe-trash"></i> Remove </a>
          //       <!--<a href="#" class="dropdown-item"> <i class="fe fe-trash-2"></i> Blacklist </a>-->
          //     </div>
          //   </div>
          // `;

        });

        /* eslint-enable */

        if (stent.log) {
          stent.konsole.endGroup();
        }

        $("#accounts-table").removeClass("d-none");
        $("#accounts-mover-col").removeClass("d-none");
        $("#accounts-table-empty").addClass("d-none");

        if (clearList) {
          $("#accounts-source-common-col .an-account-wrapper").remove();
          $("#accounts-source-actions-col .an-account-wrapper").remove();
          $("#accounts-source-similarity-col .an-account-wrapper").remove();
          $("#accounts-profile-status-col .an-account-wrapper").remove();
          $("#accounts-profile-common-col .an-account-wrapper").remove();
          $("#accounts-profile-actions-col .an-account-wrapper").remove();
        }

        $("#accounts-source-common-col").append(html.lookup.common);
        $("#accounts-source-actions-col").append(html.lookup.actions);
        $("#accounts-source-similarity-col").append(html.relevancy);
        $("#accounts-profile-status-col").append(html.match.status);
        $("#accounts-profile-common-col").append(html.match.common);
        $("#accounts-profile-actions-col").append(html.match.actions);

        // Scroll load more
        if (_pageInfo && _pageInfo.hasNextPage) {
          bindScroll();
        } else {
          unbindScroll();
        }

      } else {

        $("#accounts-table").addClass("d-none");
        $("#accounts-mover-col").addClass("d-none");
        $("#accounts-table-empty").removeClass("d-none");

      }

    };


    const renderFooter = function () {
      $("#accounts-table-footer strong").html(typeof _totalCount !== "undefined" && _totalCount !== null ? _totalCount + " record" + (_totalCount > 1 ? "s" : "") : "&nbsp;");
    };


    const buildMinersBadgeDOM = function (miners) {

      let html = "";
      if (!miners || !Array.isArray(miners) || miners.length === 0) {
        return html;
      }

      const getMinersList = function (miners) {

        let html = "";
        for (let i = 0; i < miners.length; i++) {
          let minerId = miners[i].id;
          let member = getMemberByIdentityKey("members/" + minerId);
          if (member) {
            html +=
              (member.firstName ? member.firstName : "") + " " + (member.lastName ? member.lastName : "") + "<br />";
          }
        }

        return html;
      };

      return `
        <span 
          data-toggle="tooltip"
          data-delay="100" 
          data-html="true" 
          title="<div style='font-size: 11px;'><strong>+ ${miners.length} member${miners.length > 1 ? "s" : ""
        }</strong><br />${getMinersList(miners)}</div>"
          class="badge badge-soft-dark">
          + ${miners.length}
        </span>
      `;
    };


    const renderAction = function (actions = [], id) {

      /*
      STOPPED
        Edit
        accounts
        Duplicate
        Archive

      ERROR
        Edit
        accounts
        Execute now
        Duplicate
        Archive

      FETCHING
        Edit
        accounts
        Execute now
        Duplicate
        Archive

      SYNCING
        Edit
        accounts
        Execute now
        Duplicate
        Rank
        Archive
        Export

      PROCESSED
        Edit
        accounts
        Duplicate
        Rank
        Archive

      ARCHIVE
        accounts
        Duplicate
        Unarchive
      */

      let o = {
        unarchive: `<a class="dropdown-item finder-unarchive" href="#">
                      <i class="fe fe-upload"></i> Unarchive
                    </a>`,

        edit: `<a
                  href="finder-form?id=${id}"
                  class="dropdown-item ui-link">
                  <i class="fe fe-edit"></i> Edit
                </a>`,

        accounts: `<a
                    href="accounts?id=${id}"
                    class="dropdown-item ui-link">
                    <i class="fe fe-users"></i> View accounts
                  </a>`,

        duplicate: `<a
                      class="dropdown-item"
                      data-id="${id}"
                      href="finder-form?action=duplicate&id=${id}">
                      <i class="fe fe-copy"></i> Duplicate
                    </a>`,

        archive: `<a
                    class="dropdown-item finder-archive"
                    data-id="${id}"
                    data-toggle="modal" data-target=".confirm-archive-finder" href="#">
                    <i class="fe fe-package"></i> Archive
                  </a>`,

        // export: `<a
        //           class="dropdown-item export-as-excel"
        //           data-id="${id}"
        //           href="#">
        //           <i class="fe fe-database"></i> Export
        //         </a>`,

        execute: `<a
                    class="dropdown-item execute-now"
                    data-id="${id}"
                    href="#">
                    <i class="fe fe-play-circle"></i> Execute now
                  </a>`,

        copy: `<a 
                  class="dropdown-item finder-copy-data-to-clipboard" 
                  href="#"> 
                  <i class="fe fe-zap"></i> Copy IDs to clipboard
                </a>`,

        reset: `<a
                class="dropdown-item reset-finder"
                data-id="${id}"
                href="#">
                <i class="fe fe-loader"></i> Reset
              </a>`,

        rank: `<a
              class="dropdown-item rank-candidates"
              data-id="${id}"
              href="#">
              <i class="fe fe-layers"></i> Rank candidates
            </a>`,

        separator: "<div class=\"dropdown-divider\"></div>"

      };

      let out = actions.map((actionName) => o[actionName]).join("");

      return out;
    };


    const unarchiveFinder = async function (finderId) {
      stent.loader.show(".main-content");

      let fetchUnarchive = await switchStatus(finderId, "UNARCHIVE");

      if (fetchUnarchive === false) {
        stent.loader.hide();
        return;
      }

      // Reload page
      window.location.reload(false);
    };


    const archiveFinder = async function (finderId) {
      stent.loader.show(".main-content");

      let fetchArchive = await switchStatus(finderId, "ARCHIVE");

      if (fetchArchive === false) {
        stent.loader.hide();
        return;
      }

      // Reload page
      window.location.reload(false);
    };


    const updateFinderStatus = async function (finderId, action) {

      stent.loader.show(".main-content");

      let fetchSwitchStatus = await switchStatus(finderId, action);

      if (fetchSwitchStatus === false) {

        // Put back the original state
        setTimeout(() => {
          $("#" + finderId).prop("checked", action === "STOP" ? true : false);
        }, 250);

        stent.loader.hide();
        return;
      }

      let fetchFinder = await stent.finders.fetchFinder(_finderId, null, null, null, false);

      if (fetchFinder && fetchFinder.ok) {
        _finder = fetchFinder.message;
      } else {
        stent.toast.danger("An error occured when trying to get the accounts, please try again.");
      }

      renderHeader();

      stent.loader.hide();
    };


    const executeNow = async function () {

      stent.loader.show(".main-content");

      // Execute now the finder
      let fetchExecuteNow = await switchStatus(_finderId, "EXECUTE", { duration: "PT1H" });

      if (fetchExecuteNow === false) {
        stent.loader.hide();
        return;
      } else {
        stent.loader.hide();
        $(".finder-status-icon").trigger("click");

        stent.toast.success("The finder has been well executed.");
      }

    };


    const rankCandidates = async function () {

      stent.loader.show(".main-content");

      // Execute now the finder
      let fetchRankFinderCandidates = await rankFinderCandidates(_finderId);

      if (fetchRankFinderCandidates === false) {
        stent.loader.hide();
        return;
      } else {
        stent.loader.hide();
        stent.toast.success("The ranking has been well launched.");
      }

    };


    const bindEvents = function () {

      $(window).off("resize").on("resize", function () {
        onDragEnd(true);
      });

      colMover.on("dragStart", function () {
        $("#accounts-table").addClass("on-move");
      });

      colMover.on("dragEnd", function () {
        onDragEnd();
      });

      $("body")
        .off("mouseenter", ".an-account-wrapper")
        .on("mouseenter", ".an-account-wrapper", function () {

          // Get index
          _hoverIndex = $(this).index();
          $(".an-account-wrapper:nth-child(" + (_hoverIndex + 1) + ")").addClass("an-account-wrapper-hover");

        });

      $("body")
        .off("mouseleave", ".an-account-wrapper")
        .on("mouseleave", ".an-account-wrapper", function () {
          $(".an-account-wrapper-hover").removeClass("an-account-wrapper-hover");
          _hoverIndex = null;
        });

      $("body")
        .off("click", ".finder-copy-data-to-clipboard")
        .on("click", ".finder-copy-data-to-clipboard", async function (e) {
          e.preventDefault();
          copyToClipboard();
        });

      $(".confirm-archive-finder").on("show.bs.modal", function (e) {
        let $invoker = $(e.relatedTarget);
        let finderId = $invoker.attr("data-id");
        $(".confirm-button-archive").attr("data-finder-id", finderId);
      });

      $(".confirm-button-archive")
        .off("click")
        .on("click", function () {
          let finderId = $(this).attr("data-finder-id");
          $(".confirm-archive-finder").modal("hide");
          archiveFinder(finderId);
        });

      $(".confirm-button-export-accounts")
        .off("click")
        .on("click", async function () {
          $(".confirm-export-accounts").modal("hide");
          stent.loader.show(".main-content");
          await doExportAllAccountsAsExcel();
          stent.loader.hide();
        });

      $("body")
        .off("click", ".finder-unarchive")
        .on("click", ".finder-unarchive", async function (e) {
          e.preventDefault();

          let finderId = $(this).closest("[data-finder-id]").data("finder-id");
          unarchiveFinder(finderId);
        });

      $("body")
        .off("input", ".contacts-finder-status")
        .on("input", ".contacts-finder-status", function () {
          let action = $(this).is(":checked") ? "ACTIVE" : "STOP";
          updateFinderStatus($(this).closest("[data-finder-id]").attr("data-finder-id"), action);
        });

      $(".filter-table")
        .off("change")
        .on("change", async function () {

          if ($(this).val() !== "") {
            $(this).addClass("active");
          } else {
            $(this).removeClass("active");
          }

          setFilters();
          doFilters();
        });

      $("#filter-table-lookup-fulltext")
        .off("keyup")
        .on("keyup", function (e) {
          if (e.code === "Enter") {
            $(this).trigger("blur");
          }
        });

      $("#filter-table-match-fulltext")
        .off("keyup")
        .on("keyup", function (e) {
          if (e.code === "Enter") {
            $(this).trigger("blur");
          }
        });

      $("#filter-reset")
        .off("click")
        .on("click", async function () {
          resetFilters();
          doFilters();
        });

      $("#accounts-wrapper")
        .off("click", "[data-contact-key]")
        .on("click", "[data-contact-key]", function (e) {
          e.stopPropagation();

          let contactKey = $(this).attr("data-contact-key");
          stent.contact.open(contactKey);
        });


      $("#finder-header")
        .off("click", ".finder-status-icon")
        .on("click", ".finder-status-icon", async function () {

          stent.loader.show(".main-content");

          _pageInfo = null;

          let fetchFinder = await stent.finders.fetchFinder(_finderId, _pageInfo, _filters, _sort);

          if (fetchFinder && fetchFinder.ok) {

            _finder = fetchFinder.message;

            renderHeader();
            renderAccountsHeaders();
            renderAccounts(true);
            renderFooter();

            onDragEnd();

            $("#finder-header").removeClass("invisible");
            $("#accounts-filter-wrapper").removeClass("invisible");
            $("#accounts-wrapper").removeClass("invisible");

          } else {

            $("#finder-header").removeClass("invisible").addClass("d-none");
            $("#accounts-filter-wrapper").removeClass("invisible").addClass("d-none");
            $("#accounts-wrapper").removeClass("invisible").addClass("d-none").removeClass("d-flex");

            $(".main-content .container-fluid").append(
              `
              <div class="alert alert-warning mt-3" role="alert">
                An error occured when trying to get the accounts. Please refresh the page to try again.
              </div>
              `
            );
          }

          stent.loader.hide();

        });

      $("body")
        .off("click", ".reset-finder")
        .on("click", ".reset-finder", async function (e) {
          e.preventDefault();
          if (window.confirm("Are you sure you want to reset finder ?")) {
            resetFinder();
          }
        });

      $("body")
        .off("click", ".execute-now")
        .on("click", ".execute-now", async function (e) {
          e.preventDefault();
          executeNow();
        });

      $("body")
        .off("click", ".rank-candidates")
        .on("click", ".rank-candidates", async function (e) {
          e.preventDefault();
          if (window.confirm("Are you sure you want to rank the finder's candidates ?")) {
            rankCandidates();
          }
        });


      $(".main-content")
        .off("click", ".change-sort-from-table-header")
        .on("click", ".change-sort-from-table-header", async function () {

          let sortName = $(this).attr("data-sort-key");
          let sortDirection;

          if ($(this).hasClass("is-sorted-ASC")) {
            sortDirection = "DESC";
          } else {
            sortDirection = "ASC";
          }

          $(".change-sort-from-table-header").removeClass("is-sorted").removeClass("is-sorted-ASC").removeClass("is-sorted-DESC");

          if (sortDirection === "ASC") {
            $(this).addClass("is-sorted-ASC").addClass("is-sorted");
          } else {
            $(this).addClass("is-sorted-DESC").addClass("is-sorted");
          }

          _sort = sortName + "_" + sortDirection;
          _pageInfo = null;

          stent.loader.show(".main-content");

          let fetchFinder = await stent.finders.fetchFinder(_finderId, _pageInfo, _filters, _sort);

          if (fetchFinder && fetchFinder.ok) {
            _finder = fetchFinder.message;
            renderAccounts(true);
            renderFooter();
          } else {
            stent.toast.danger("An error occured when trying to sort accounts. please retry.");
          }

          stent.loader.hide();

        });

      $(".confirm-export-accounts").on("shown.bs.modal", function () {

        let emailLookup = _finder.emailLookup === true ? true : false;
        let _creditsCost = _totalCount;
        if (emailLookup) {
          _creditsCost = _creditsCost * 2;
        }
        // You can find more informations on credits usage on <a href="https://learn.stent.io" target="_blank">this page.</a>
        $(".confirm-export-accounts .modal-body").html(
          `This operation will cost you <strong>${_creditsCost}</strong> credit${_creditsCost > 1 ? "s" : ""} usage.<br /><br />Please confirm this operation.`
        );

      });

      $("body")
        .off("click", ".account-additional-message")
        .on("click", ".account-additional-message", async function () {
          let messageToLog = $(this).attr("data-message");
          console.log(messageToLog);
        });

    };


    const init = async function () {

      stent.loader.show(".main-content");

      // Active corresponding menu
      stent.navbar.activeMenu("finder-list");

      // change Page title
      stent.ui.setPageTitle("Accounts");

      //bind events
      bindEvents();

      // Init UI
      initUI();

      // members
      await initMembers();

      //
      _finderId = getFinderIdFromURL();
      _sort = getInitialSortFromURL();

      let fetchFinder = await stent.finders.fetchFinder(_finderId, _pageInfo, _filters, _sort);

      if (fetchFinder && fetchFinder.ok) {

        _finder = fetchFinder.message;

        renderHeader();
        renderAccountsHeaders();
        renderAccounts();
        renderFooter();

        onDragEnd();
        initFilters();

        $("#finder-header").removeClass("invisible");
        $("#accounts-filter-wrapper").removeClass("invisible");
        $("#accounts-wrapper").removeClass("invisible");

      } else {

        $("#finder-header").removeClass("invisible").addClass("d-none");
        $("#accounts-filter-wrapper").removeClass("invisible").addClass("d-none");
        $("#accounts-wrapper").removeClass("invisible").addClass("d-none").removeClass("d-flex");

        $(".main-content .container-fluid").append(
          `
          <div class="alert alert-warning mt-3" role="alert">
            An error occured when trying to get the accounts. Please refresh the page to try again.
          </div>
          `
        );
      }

      // Remove Loader
      stent.loader.hide();

    };

    init();

    return {
      UI
    };

  })();

});