stent.finders.list = (function () {
  let _finders = null;
  let _members = null;
  let _totalCount = null;
  let _pageInfo = null;
  let _filters = {};
  let _sort = "NAME_ASC";

  const getMembers = async function () {
    let fetchMembers = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/members");

    if (fetchMembers && fetchMembers.ok && fetchMembers.message) {
      return fetchMembers.message;
    } else {
      stent.toast.danger("Error when trying to fetch the ambassadors. Please refresh the page to try again.");
      return null;
    }
  };

  const getFinders = async function () {

    let query = `
      {
        workspaceContext {
          finders (
            first: 50
            where: {
              ${_filters && _filters.status ? `status: ${_filters.status}` : ""} 
              ${_filters && _filters.ownerId ? `ownerId: "${_filters.ownerId}"` : ""} 
              ${_filters && _filters.provisioner ? `provisioner: ${_filters.provisioner.toUpperCase().replace(/-/gi, "_")}` : ""} 
              ${_filters && _filters.name ? `name: "${_filters.name}"` : ""} 
              ${_filters && _filters.entity ? `entity: ${_filters.entity.toUpperCase()}` : ""} 
              ${_filters && _filters.state ? `state: ${_filters.state.toUpperCase()}` : ""}
            }
            sort: {
              field: ${_sort.split("_")[0]}
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
                version
                entity
                state
                status
                name
                target
                provisioner {
                  ... on FinderProvisioner {
                    size
                    type
                    sync {
                      timestamp
                      state
                      status
                      message
                      jobId
                    }
                  }
                  ... on LinkedSalesSearchFinderProvisioner {
                    filterOnCompany
                  }
                }
                owner {
                  id
                  firstName
                  lastName
                  pictureUrl
                }
                additionalMembers {
                  id
                }
                fetched
                processed
                progress
              }
            }
          }
        }
      }`;

    if (stent.log) {
      stent.konsole.group("getFinders");
      stent.konsole.log({ data: query });
    }

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.finders &&
      result.message.data.workspaceContext.finders.edges) {

      if (stent.log) {
        stent.konsole.log({ response: result.message.data.workspaceContext.finders });
        stent.konsole.endGroup();
      }

      if (result.message.data.workspaceContext.finders.edges.length > 0) {
        return {
          edges: result.message.data.workspaceContext.finders.edges,
          pageInfo: result.message.data.workspaceContext.finders.pageInfo,
          totalCount: result.message.data.workspaceContext.finders.totalCount
        };

      } else {
        return {
          edges: [],
          pageInfo: result.message.data.workspaceContext.finders.pageInfo,
          totalCount: 0
        };
      }

    } else {

      if (stent.log) {
        stent.konsole.error({ response: result });
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to fetch the finders. Please refresh the page to try again.");
      stent.loader.hide();

      return {
        edges: [],
        pageInfo: result.message.data.workspaceContext.finders.pageInfo,
        totalCount: 0
      };
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

  const getMemberByIdentityKey = function (key) {
    return _members.filter((member) => member.memberId === key)[0];
  };

  const refreshFinderRow = async function (finderId) {
    stent.loader.show("[data-finder-id=\"" + finderId + "\"]");

    let fetchFinder = await stent.finders.fetchFinder(finderId, null, null, null, false);

    if (fetchFinder && fetchFinder.ok) {
      let html = findersListDOM(fetchFinder.message);
      $("[data-finder-id=\"" + finderId + "\"]").replaceWith(html);
    } else {
      stent.toast.danger("An error occured when trying to get the finder, please try again.");
    }
    stent.loader.hide("[data-finder-id=\"" + finderId + "\"]");
  };

  const initFilters = async function () {
    _members = await getMembers();
    if (_members === null) {
      stent.toast.danger("Error when trying to get the ambassadors. Please refresh the page to try again.");
      return;
    }

    populateMemberFilterSelect(_members);
    populateSourceFilterSelect();
    populateOutputFilterSelect();
  };

  const populateSourceFilterSelect = function () {
    stent.finders.sources.forEach(function (source) {
      let option = new Option(source.name, source.key);
      $("#filter-table-source").append($(option));
    });

  };

  const populateOutputFilterSelect = function () {
    stent.finders.outputs.forEach(function (output) {
      let option = new Option(output.name, output.key);
      $("#filter-table-output").append($(option));
    });
  };

  const populateMemberFilterSelect = function (members) {
    let option = new Option("Choose an owner:", "");
    $("#filter-table-member").append($(option));
    members.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
    members.forEach(function (member) {
      let option = new Option(member.firstName + " " + member.lastName, member.id);
      $("#filter-table-member").append($(option));
    });
  };

  const resetFilters = function () {
    $("#filter-table-source").val("").removeClass("active");
    $("#filter-table-output").val("").removeClass("active");
    $("#filter-table-member").val("").removeClass("active");
    $("#filter-table-status").val("").removeClass("active");
    $("#filter-table-name").val("").removeClass("active");
    $("#filter-table-state").val("").removeClass("active");
  };

  const setFilters = function () {
    _filters.status = $("#filter-table-status").val();
    _filters.ownerId = $("#filter-table-member").val();
    _filters.provisioner = $("#filter-table-source").val();
    _filters.entity = $("#filter-table-output").val();
    _filters.name = $("#filter-table-name").val();
    _filters.state = $("#filter-table-state").val();

    if (_filters.status + _filters.ownerId + _filters.provisioner + _filters.entity + _filters.name + _filters.state === "") {
      $("#filter-reset").addClass("d-none");
    } else {
      $("#filter-reset").removeClass("d-none");
    }
  };

  const buildFindersList = async function (isLoadingMore = false) {

    setFilters();

    $(".spinner-grow").removeClass("d-none");

    // Set finders list
    let fetchFinders = await getFinders();

    _finders = fetchFinders.edges;
    _totalCount = fetchFinders.totalCount;
    _pageInfo = fetchFinders.pageInfo;

    if (!isLoadingMore) {
      stent.loader.hide();
    }

    if (!isLoadingMore) {
      if (_finders.length == 0) {
        $("#finders-grid-wrapper").html(
          `
          <div class="alert alert-warning mt-3" role="alert">
            No finder found.
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
      html = "<div class=\"col stent-grid\" id=\"finders-result\">";
    }

    // Table content
    _finders.forEach(finder => {
      html += findersListDOM(finder);
    });

    if (!isLoadingMore) {
      html += "</div>";
    }


    // Table footer
    if (!isLoadingMore) {
      html += `
        <div id="finders-footer">
          <div class="spinner-grow spinner-grow-sm d-none" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <strong>${_totalCount.toLocaleString(stent.locale)} record${_totalCount > 1 ? "s" : ""}</strong>
        </div>`;
    }

    if (!isLoadingMore) {
      $("#finders-grid-wrapper").html(html);
    } else {
      $("#finders-result").append(html);
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

  const findersListDOM = function (finder) {

    finder = finder.node ? finder.node : finder;

    let html = "";

    let id = finder.id ? finder.id : null;

    let target = finder.target ? finder.target : null;

    let lastJobId = null;
    if (finder.provisioner && finder.provisioner.sync && finder.provisioner.sync.jobId) {
      lastJobId = finder.provisioner.sync.jobId;
    }

    let source = { icon: "/assets/img/finders/unknown.svg", name: "" };
    if (finder.provisioner && finder.provisioner.type) {
      source = stent.finders.getSourceByKey(finder.provisioner.type);
    }

    let output = { icon: "/assets/img/finders/unknown.svg", name: "", key: null };
    if (finder.entity && (finder.entity === "CONTACT" || finder.entity === "COMPANY")) {
      output = stent.finders.getOutputByKey(finder.entity.toLowerCase());
    }

    let hasFilterOnCompany = finder.provisioner && finder.provisioner.filterOnCompany ? true : false;

    let name = finder.name ? finder.name : "-";

    let status = finder.status ? finder.status : "-";

    let version = finder.version ? finder.version : null;
    let shouldDisplayViewAccountsLink = false;

    if (version >= 4 && finder.fetched > 0) {
      shouldDisplayViewAccountsLink = true;
    }

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
    let syncNumbersHasData = true;
    if (state && (typeof finder.processed !== "undefined" || typeof finder.fetched !== "undefined")) {
      syncNumbers = (typeof finder.processed !== "undefined" ? finder.processed : "...") + " / " + (typeof finder.fetched !== "undefined" ? finder.fetched : "...");

      if (finder.processed === 0 && finder.fetched === 0) {
        syncNumbersHasData = false;
      }
    }

    let additionnalMessage = "";
    // Additionnal sync message
    if (finder.provisioner && finder.provisioner.sync && finder.provisioner.sync.message) {
      additionnalMessage = finder.provisioner.sync.message.replace(/"/g, "&quot;");
    }

    if (state === "STOPPED") {
      syncStateImg = "/assets/img/error.svg";
      syncStateLabel = "<span>Stopped</span>";
    } else if (state === "ERROR") {
      syncStateImg = "/assets/img/warning.svg";
      syncStateLabel = `<span ${additionnalMessage ? `title="${additionnalMessage}" data-toogle="tooltip"` : ""}>Error</span>`;
    } else if (state === "FETCHING") {
      syncStateImg = "/assets/img/fetching.svg";
      syncStateLabel = "<span>Fetching profiles</span>";
      if (finder.entity === "COMPANY") {
        syncStateLabel = "<span>Fetching companies</span>";
      }
    } else if (state === "SYNCING") {
      syncStateImg = "/assets/img/syncing.svg";
      syncStateLabel = "<span>Syncing profiles</span>";
      if (finder.entity === "COMPANY") {
        syncStateLabel = "<span>Syncing companies</span>";
      }
    } else if (state === "PROCESSED") {
      syncStateImg = "/assets/img/processed.svg";
      syncStateLabel = "<span>Processed</span>";
    } else if (state === "SUSPENDED") {
      syncStateImg = "/assets/img/suspended.svg";
      syncStateLabel = "<span>Suspended</span>";
    } else if (state === "IDLE") {
      syncStateImg = "/assets/img/idle.svg";
      syncStateLabel = "<span>Idle</span>";
    }

    if (additionnalMessage !== "") {
      syncStateLabel += `<span style="opacity: 0.5; vertical-align: -2px;" class="fe fe-help-circle ml-2" data-message="${additionnalMessage}" title="${additionnalMessage}" data-toggle="tooltip"></span>`;
    }

    /* eslint-disable */
    html += `
      <div class="row stent-grid-tr" data-finder-id="${id}" data-owner-id="${owner.id}" style="position: relative;" data-version="${version}">
        
        <!-- Source / Output / Name -->
        <div class="col col-4 d-flex" style="word-break: break-all;align-items: center;">
          <span 
            style="display: flex;"
            data-toggle="tooltip" 
            data-delay="100" 
            data-html="true" 
            data-placement="top" 
            title="<div style='font-size: 11px;'>Target: <strong>${finder.target ? finder.target.toLowerCase() : 'unknown'}</strong><br />Source: <strong>${source.name}</strong><br />Output: <strong>${output.name}</strong>${hasFilterOnCompany ? `<br />Filter on company: <strong>YES</strong>` : ``}</div>">
            ${targetIconDOM(finder.target)}
            <img src="${source.icon}" class="finder-icon" style="margin-left: -7px;" />
            <img src="${output.icon}" class="mr-2 finder-icon" style="margin-left: -7px;" />
            ${hasFilterOnCompany
        ? `<img src="/assets/img/finders/companies.svg" class="mr-2 finder-icon" style="margin-left: -15px;" />`
        : ``
      }
          </span>
          <div style="flex: 1;" class="pr-3">
            ${status !== 'ARCHIVE' ? `<a href="finder-form?id=${id}" class="ui-link" title="Edit finder" data-toggle="tooltip">` : ``}
            ${name}
            ${status !== 'ARCHIVE' ? `</a>` : ``}
          </div>
          <textarea id="finder-data-${id}" style="width: 0px; height: 0px; outline: none; resize: none; overflow: auto; opacity: 0;">Finder ID: ${id}\nFinder job ID: ${lastJobId}</textarea>
        </div>

        <!-- Owner -->
        <div class="col col-2">
          <div class="d-flex align-items-center">
            <img 
              src="${owner.pictureUrl}" 
              onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" 
              class="mr-2" style="height: 30px; width: 30px; border-radius: 100%;" 
              />
            <span style="display: block;" class="mr-2">
              ${owner.displayName}
              ${buildMinersBadgeDOM(miners)}
            </span>
          </div>
        </div>
        
        <!-- Sync -->
        <div class="col col-3 pl-4">
          <img src="${syncStateImg}" class="status-icon refresh-finder" data-toggle="tooltip" title="Refresh" />
          <div style="line-height: 120%;" class="ml-3">
            ${syncStateLabel ? syncStateLabel + "<br />" : ''}
            <span style="font-size: 11px; font-weight: ${syncNumbersHasData ? `bold` : `normal`}; opacity: ${syncNumbersHasData ? `1` : `0.5`};" >${syncNumbers}</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="col col-1" style="position: relative;">
          ${state !== 'IDLE' ? `
            <strong style="text-align: right; width: 30px; position: absolute; display: flex; justify-content: flex-end; align-items: center; height: 100%;">${progressPercent}%</strong>
            <div class="progress" style="width: 100%; margin-left: 38px;">
              <div class="progress-bar" role="progressbar" style="width: ${progressPercent}%" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>` :
        ""
      }
        </div>

        <!-- Status -->
        <div class="col col-1 justify-content-center pl-4">
          ${status === 'ARCHIVE' ?
        `<span class="badge badge-warning">Archived</span>`
        :
        `<div class="custom-control custom-switch">
            <input 
              type="checkbox" 
              class="custom-control-input contacts-finder-status" 
              id="${id}" 
              data-identity-key="${owner.id}" 
              ${status === 'ACTIVE' ? "checked='checked'" : ""}>
            <label class="custom-control-label" for="${id}"></label>
          </div>`
      }
        </div>

        <!-- Actions -->
        <div class="col col-1 justify-content-end">
          <div class="btn-group">
            <a href="#" class="flex-row align-items-center open-actions mr-2" role="button" data-toggle="dropdown">
              <img src="/assets/img/dots-dark.png" />
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              ${status === 'ARCHIVE' ? renderAction(['duplicate', 'unarchive', 'separator', 'copy'], id, target) :
        state === 'STOPPED' ? renderAction(['edit', shouldDisplayViewAccountsLink ? 'accounts' : null, 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) :
          state === 'ERROR' ? renderAction(['edit', shouldDisplayViewAccountsLink ? 'accounts' : null, 'execute', 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) :
            state === 'SUSPENDED' ? renderAction(['edit', shouldDisplayViewAccountsLink ? 'accounts' : null, 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) :
              state === 'FETCHING' ? renderAction(['edit', shouldDisplayViewAccountsLink ? 'accounts' : null, 'execute', 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) :
                state === 'SYNCING' ? renderAction(['edit', shouldDisplayViewAccountsLink ? 'accounts' : null, 'execute', 'duplicate', target === 'CANDIDATE' ? 'rank' : null, 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) :
                  state === 'PROCESSED' ? renderAction(['edit', shouldDisplayViewAccountsLink ? 'accounts' : null, 'execute', 'duplicate', target === 'CANDIDATE' ? 'rank' : null, 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) :
                    state === 'IDLE' ? renderAction(['edit', 'execute', 'duplicate', 'archive', 'separator', 'reset', 'separator', 'copy'], id, target) : ``}
            </div>
          </div>
        </div>
      </div>
    `;
    /* eslint-enable */

    return html;
  };

  const targetIconDOM = function (target) {
    let _target = target ? target : "UNKNOWN";
    return `<b class="target-icon target-icon-${_target.toLowerCase()}">
      ${_target.charAt(0)}
    </b>`;
  };

  const renderAction = function (actions = [], id, target) {

    /*
    STOPPED
      Edit
      accounts
      Duplicate
      Archive
      -
      Reset

    ERROR
      Edit
      accounts
      Execute now
      Duplicate
      Archive
      Export
      -
      Reset

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
      -
      Reset

    PROCESSED
      Edit
      accounts
      Duplicate
      Rank
      Archive
      -
      Reset

    ARCHIVE
      accounts
      Duplicate
      Unarchive
    */

    //
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
                  href="accounts?finderId=${id}${target === "CANDIDATE" ? "&initialSort=PROBABILITY_DESC" : ""}"
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

      export: `<a 
                class="dropdown-item export-as-excel"
                data-id="${id}"
                href="#">
                <i class="fe fe-database"></i> Export
              </a>`,

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

    let out = actions.map((actionName) => {
      return o[actionName] ? o[actionName] : "";
    }).join("");

    return out;
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

    if ($("#filter-table-status").val() !== "") {
      $("[data-finder-id=" + finderId + "]").remove();
    }

    stent.loader.hide();
  };

  const archiveFinder = async function (finderId) {
    stent.loader.show(".main-content");

    let fetchArchive = await switchStatus(finderId, "ARCHIVE");

    if (fetchArchive === false) {
      stent.loader.hide();
      return;
    }

    // Remove line form DOM
    $("#finders-grid-wrapper [data-finder-id=" + finderId + "]").remove();
    stent.loader.hide();
  };

  const unarchiveFinder = async function (finderId) {
    stent.loader.show(".main-content");

    let fetchUnarchive = await switchStatus(finderId, "UNARCHIVE");

    if (fetchUnarchive === false) {
      stent.loader.hide();
      return;
    }

    // Remove line form DOM
    $("[data-finder-id=" + finderId + "]").remove();
    stent.loader.hide();
  };

  const saveFinderAsV4 = async function (finderId, ownerId) {

    let finderPayload = {
      version: 4
    };

    let fetchPutFinder = await stent.ajax.putRestAsync("/finders/tenants/" + stent.tenant.key + "/" + ownerId + "/" + finderId, finderPayload);

    if (fetchPutFinder && fetchPutFinder.ok && fetchPutFinder.message) {
      return fetchPutFinder.message;
    } else {
      stent.toast.danger("Error when trying to save the finder with v4 version. Please try again.");
      return null;
    }

  };

  const executeNow = async function (finderId, ownerId, finderVersion) {

    stent.loader.show("[data-finder-id=\"" + finderId + "\"]");

    // Save finder as V4 if null
    if (finderVersion === null) {
      let _saveFinderAsv4 = await saveFinderAsV4(finderId, ownerId);

      if (_saveFinderAsv4 == null) {
        stent.loader.hide();
        return;
      }
    }

    // Execute now the finder
    let fetchExecuteNow = await switchStatus(finderId, "EXECUTE", { duration: "PT1H" });

    if (fetchExecuteNow === false) {
      stent.loader.hide();
      return;
    } else {
      stent.loader.hide();
      stent.toast.success("The finder has been well executed.");

      // Refresh line
      refreshFinderRow(finderId);
    }

  };

  const rankCandidates = async function (finderId) {

    stent.loader.show("[data-finder-id=\"" + finderId + "\"]");

    // Execute now the finder
    let fetchRankFinderCandidates = await rankFinderCandidates(finderId);

    if (fetchRankFinderCandidates === false) {
      stent.loader.hide();
      return;
    } else {
      stent.loader.hide();
      stent.toast.success("The ranking has been well launched.");

      // Refresh line
      refreshFinderRow(finderId);
    }

  };


  const resetFinder = async function (finderId) {

    stent.loader.show("[data-finder-id=\"" + finderId + "\"]");

    let query = `
      mutation {
        workspaceContext {
          resetFinder(finderId: "${finderId}") {
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

      stent.loader.hide();
      stent.toast.success("The finder has been well reseted");
      refreshFinderRow(finderId);

    } else {

      if (stent.log) {
        stent.konsole.error({ response: result });
        stent.konsole.endGroup();
      }

      stent.loader.hide();

      // ERROR ON FETCH
      stent.toast.danger("Error when trying to reset the finder. Please try again.");
      return false;
    }

  };

  const bindScroll = function () {

    $("#finders-result")
      .off("scroll")
      .on("scroll", async function () {

        var scrollableDiv = $(this);

        // Bottom is reached
        if ((scrollableDiv[0].scrollHeight - scrollableDiv.height() - 500) < scrollableDiv.scrollTop()) {
          unbindScroll();
          await buildFindersList(true);
        }

      });
  };

  const unbindScroll = function () {
    $("#finders-result").off("scroll");
  };

  const copyToClipboard = function (finderId) {
    var textBox = document.getElementById("finder-data-" + finderId);
    textBox.select();
    if (document.execCommand("copy") === true) {
      stent.toast.success("Copied!");
    } else {
      stent.toast.error("Error when copying the value.");
    }
    textBox.blur();
  };

  const bindEvents = function () {
    $("body")
      .off("click", "#new-finder-button")
      .on("click", "#new-finder-button", function () {
        stent.ui.load({ fileToLoad: "finder-form.html" });
        stent.ui.pushState("finder-form", false, "finder-form");
      });

    $("body")
      .off("input", ".contacts-finder-status")
      .on("input", ".contacts-finder-status", function () {
        let action = $(this).is(":checked") ? "ACTIVE" : "STOP";
        updateFinderStatus($(this).closest("[data-finder-id]").attr("data-finder-id"), action);
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

    $("body")
      .off("click", ".finder-unarchive")
      .on("click", ".finder-unarchive", async function (e) {
        e.preventDefault();

        let finderId = $(this).closest("[data-finder-id]").data("finder-id");
        unarchiveFinder(finderId);
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
        stent.loader.show(".main-content");
        await buildFindersList();
        stent.loader.hide();
      });

    $("#filter-table-name")
      .off("keyup")
      .on("keyup", function (evt) {
        if (evt.keyCode === 13) {
          $(this).blur();
        }
      });

    $("#filter-reset")
      .off("click")
      .on("click", async function () {
        resetFilters();
        _pageInfo = null;
        stent.loader.show(".main-content");
        await buildFindersList();
        stent.loader.hide();
      });

    $("body")
      .off("click", ".export-as-excel")
      .on("click", ".export-as-excel", async function (e) {
        e.preventDefault();

        let finderId = $(this).closest("[data-finder-id]").data("finder-id");

        let fetchExportExcel = await stent.ajax.postRestAsync(
          "/finders/tenants/" + stent.tenant.key + "/" + finderId + "/export"
        );

        if (fetchExportExcel.ok) {
          let email = stent.user.email ? stent.user.email : "your email";
          stent.toast.success(
            "A link to the excel file will be sent to " + email + " as soon as the file is ready to download."
          );
        } else {
          stent.toast.danger("Error when trying to export the segment as an excel file. Please try again.");
        }
      });

    $("body")
      .off("click", ".execute-now")
      .on("click", ".execute-now", async function (e) {
        e.preventDefault();

        let finderId = $(this).closest("[data-finder-id]").data("finder-id");
        let ownerId = $(this).closest("[data-finder-id]").data("owner-id");
        let finderVersion = $(this).closest("[data-finder-id]").data("version");

        executeNow(finderId, ownerId, finderVersion);
      });

    $("body")
      .off("click", ".rank-candidates")
      .on("click", ".rank-candidates", async function (e) {
        e.preventDefault();
        let finderId = $(this).closest("[data-finder-id]").data("finder-id");

        if (window.confirm("Are you sure you want to rank the finder's candidates ?")) {
          rankCandidates(finderId);
        }

      });


    $("body")
      .off("click", ".reset-finder")
      .on("click", ".reset-finder", async function (e) {
        e.preventDefault();

        let finderId = $(this).closest("[data-finder-id]").data("finder-id");

        if (window.confirm("Are you sure you want to reset finder ?")) {
          resetFinder(finderId);
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
        await buildFindersList();

      });


    $(".main-content")
      .off("click", ".refresh-finder")
      .on("click", ".refresh-finder", async function () {

        let finderId = $(this).closest("[data-finder-id]").attr("data-finder-id");
        refreshFinderRow(finderId);

      });

    $("body")
      .off("click", ".finder-copy-data-to-clipboard")
      .on("click", ".finder-copy-data-to-clipboard", async function (e) {
        e.preventDefault();
        let finderId = $(this).closest("[data-finder-id]").attr("data-finder-id");
        copyToClipboard(finderId);
      });

    $("body")
      .off("click", ".fe-help-circle")
      .on("click", ".fe-help-circle", async function () {
        let messageToLog = $(this).attr("data-message");
        console.log(messageToLog);
      });


  };

  const init = async function () {
    // Active corresponding menu
    stent.navbar.activeMenu("finder-list");

    // change Page title
    stent.ui.setPageTitle("Finders");

    // Loader
    stent.loader.show(".main-content");

    //bind events
    bindEvents();

    // Fill Select filters input
    await initFilters();

    // Build finders DOM
    await buildFindersList();

    // Remove Loader
    stent.loader.hide();
  };

  init();

  return {
    get: function () {
      return {
        finders: _finders,
      };
    },
  };
})();
