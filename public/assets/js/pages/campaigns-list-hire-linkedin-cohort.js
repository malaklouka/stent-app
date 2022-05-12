"use strict";

stent.campaign = stent.campaign || {};
stent.campaign.list = stent.campaign.list || {};

stent.campaign.list.hire = (function () {

  let _flow = "hire-linkedin-cohort";
  let _tableCols = [2, 2, 2, 2, 1, 1, 1, 1];
  let _members = null;
  let _campaigns = null;
  let _programs = null;
  let _filters = {
    sender: "",
    name: "",
    program: "",
    source: "",
    status: ""
  };

  const getMembers = async function () {

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

  const getCampaigns = async function () {

    let fetchCampaigns = await stent.ajax.getRestAsync(
      "/campaigns/" + stent.tenant.key + "/" + _flow + getParams()
    );

    if (fetchCampaigns && fetchCampaigns.ok && fetchCampaigns.message) {
      return fetchCampaigns.message;
    } else {
      stent.toast.danger("Error when trying to fetch the campaigns. Please refresh the page to try again.");
      return null;
    }

  };

  const getCampaignsNames = async function () {

    let fetchCampaignsNames = await stent.ajax.getRestAsync(
      "/campaigns/" + stent.tenant.key + "/names"
    );

    if (fetchCampaignsNames && fetchCampaignsNames.ok && fetchCampaignsNames.message) {
      return fetchCampaignsNames.message;
    } else {
      stent.toast.danger("Error when trying to fetch the campaigns names. Please try again.");
      return null;
    }

  };

  const getCampaignsPrograms = async function () {

    let fetchCampaignsPrograms = await stent.ajax.getRestAsync(
      "/campaigns/" + stent.tenant.key + "/programs"
    );

    if (fetchCampaignsPrograms && fetchCampaignsPrograms.ok && fetchCampaignsPrograms.message) {
      return fetchCampaignsPrograms.message;
    } else {
      stent.toast.danger("Error when trying to fetch the campaigns programs. Please try again.");
      return null;
    }

  };

  const getParams = function () {
    let out = "?" + "archived=" + $("#showArchived").is(":checked");
    out += "&visible=" + !$("#showArchived").is(":checked");
    return out;
  };

  const resetFilters = function () {
    $("#filter-table-sender").val("").removeClass("active");
    $("#filter-table-name").val("").removeClass("active");
    $("#filter-table-program").val("").removeClass("active");
    $("#filter-table-source").val("").removeClass("active");
    $("#filter-table-status").val("").removeClass("active");
  };

  const setFilters = function () {

    _filters.sender = $("#filter-table-sender").val();
    _filters.name = $("#filter-table-name").val();
    _filters.program = $("#filter-table-program").val();
    _filters.source = $("#filter-table-source").val();
    _filters.status = $("#filter-table-status").val();

    if (_filters.sender + _filters.name + _filters.program + _filters.source + _filters.status === "") {
      $("#filter-reset").addClass("d-none");
    } else {
      $("#filter-reset").removeClass("d-none");
    }

  };

  const initFilters = async function () {

    _members = await getMembers();
    if (_members === null) {
      stent.toast.danger("Error when trying to get the ambassadors. Please refresh the page to try again.");
      return;
    }

    populateMemberFilterSelect(_members);
    populateCampaignNameSelect();
    populateCampaignProgramSelect();

  };

  const populateMemberFilterSelect = function (members) {

    let option = new Option("Ambassador", "");
    $("#filter-table-sender").html($(option));
    members.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
    members.forEach(function (member) {
      let option = new Option(member.firstName + " " + member.lastName, member.id);
      $("#filter-table-sender").append($(option));
    });

  };

  const populateCampaignNameSelect = async function () {

    let option = new Option("Name", "");
    $("#filter-table-name").html($(option));

    let _campaignsNames = await getCampaignsNames();

    _campaignsNames.forEach(function (campaign) {
      let option = new Option(campaign, campaign);
      $("#filter-table-name").append($(option));
    });

  };

  const populateCampaignProgramSelect = async function () {

    let option = new Option("Program", "");
    $("#filter-table-program").html($(option));

    let _campaignsPrograms = await getCampaignsPrograms();

    _campaignsPrograms.forEach(function (campaign) {
      let option = new Option(campaign, campaign);
      $("#filter-table-program").append($(option));
    });
  };

  const sortCampaigns = function () {
    _campaigns.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
  };

  const nestCampaigns = function (campaigns) {

    let campaignsToNest = campaigns ? campaigns : _campaigns;

    let _nestPrograms = [];

    const getProgram = function (programName) {
      for (let i = 0; i < _nestPrograms.length; i++) {
        if (_nestPrograms[i].name === programName) {
          return _nestPrograms[i];
        }
      }
      return null;
    };

    campaignsToNest.forEach((campaign) => {

      let program = getProgram(campaign.program);

      if (!program) {
        _nestPrograms.push(
          {
            name: campaign.program,
            campaigns: []
          }
        );
        program = getProgram(campaign.program);
      }

      program.campaigns.push(campaign);

    });

    if (stent.log) {
      stent.konsole.group("nestCampaigns");
      stent.konsole.log({ data: _programs });
      stent.konsole.endGroup();
    }

    return _nestPrograms;

  };

  const buildCampaignsList = function () {

    // Update Filters
    setFilters();

    let displayCampaigns;
    let displayPrograms;
    let filtersCount = Object.values(_filters).filter(filter => filter !== "").length;

    if (filtersCount === 0) {
      displayPrograms = [..._programs];
    } else {

      displayCampaigns = _campaigns.filter((campaign) => {

        let trueCount = 0;

        // Filter on sender
        if (_filters.sender && _filters.sender !== "" && (campaign.identityKey === _filters.sender)) {
          trueCount++;
        }

        // Filter on name
        if (_filters.name && _filters.name !== "" && (campaign.name && campaign.name.toLowerCase().includes(_filters.name.toLowerCase()))) {
          trueCount++;
        }

        // Filter on program
        if (_filters.program && _filters.program !== "" && (campaign.program && campaign.program.toLowerCase().includes(_filters.program.toLowerCase()))) {
          trueCount++;
        }

        // Filter on source
        if (_filters.source && _filters.source !== "" && (campaign.source && campaign.source.name && campaign.source.name.toLowerCase().includes(_filters.source.toLowerCase()))) {
          trueCount++;
        }

        // Filter on status
        if (_filters.status && _filters.status !== "" && (campaign.status && campaign.status === _filters.status)) {
          trueCount++;
        }

        if (trueCount === filtersCount) {
          return true;
        }

      });

      displayPrograms = nestCampaigns(displayCampaigns);

    }

    if (displayPrograms.length == 0) {
      $("#campaigns-result").html(
        `
        <div class="col">
          <div class="alert alert-warning mt-3" role="alert">
            No campaign found.
          </div>
        </div>
        `
      );
      return;
    }

    /* eslint-disable */
    // Table headers
    let html = `
      <div class="col stent-table">
        <table class="table table-vcenter table-hover">
          <thead>
            <tr class="d-flex">
              <th class="col-${_tableCols[0]}">PROGRAM / CAMPAIGN</th>
              <th class="col-${_tableCols[1]}">SENDER</th>
              <th class="col-${_tableCols[2]}">SOURCE</th>
              <th class="col-${_tableCols[3]}">HEALTH</th>
              <th class="col-${_tableCols[4]}">TODAY PROGRESS</th>
              <th class="col-${_tableCols[5]} text-right pr-3">RATIO</th>
              <th class="col-${_tableCols[6]} text-center">ACTIVE</th>
              <th class="col-${_tableCols[7]} text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;
    /* eslint-enable */

    $("#campaigns-result").html(html);

    // Table content
    html = "";
    displayPrograms.forEach(program => {
      html += programDOM(program);
    });
    $("#campaigns-result tbody").html(html);

  };

  const programDOM = function (program) {

    let html = "";
    let programName = program.name ? program.name : "-";
    let programCampaigns = program.campaigns;

    /* eslint-disable */
    html += `<tr class="d-flex lv-0 visible" data-program-name="${programName}">`;
    html += `
      <!-- Program Name -->
      <td class="col-11 text-break py-3">
        <span class="fe mr-3 toggle-children-visibility fe-chevron-down"></span>
        <h4 style="margin: 0; line-height: 130%;">${programName}</h4>
        <span class="ml-2 text-muted" style="font-size: 11px;">${programCampaigns.length} campaign${programCampaigns.length > 1 ? `s` : ``}</span>
      </td>`;
    /* eslint-enable */

    html += campaignsDOM(programCampaigns);

    return html;
  };

  const campaignsDOM = function (campaigns) {

    let campaignsCount = campaigns.length;
    let html = "";

    /* eslint-disable */
    html += `
      <td class="col-${_tableCols[6]} align-right">
      ${!$("#showArchived").is(":checked") ?
        `
        <a href="#" class="flex-row align-items-center open-actions" role="button" data-toggle="dropdown">
          <img src="/assets/img/dots-dark.png" />
        </a>
        <div class="dropdown-menu dropdown-menu-right dropdown-toggle-no-caret">
          <a href="queue?program=${encodeURIComponent(campaigns[0].program)}&sort=DATE_DESC" class="dropdown-item ui-link">
            <i class="fe fe-users"></i> View queue
          </a>
        </div>
        ` :
        ""
      }
      </td>
    </tr>
    `;
    /* eslint-enable */

    campaigns.forEach((campaign, index) => {
      html += campaignDOM(campaign, index, campaignsCount);
    });

    return html;
  };

  const campaignDOM = function (campaign, index, campaignsLength) {

    let html = "";
    let acceptance = Math.round(campaign.acceptance * 100);
    let health;
    let healthText;
    let healthTooltip;
    let ratioTooltip = campaign.invites === 0 ? "" :
      campaign.invites.toLocaleString(stent.locale) + " invite" + (campaign.invites > 1 ? "s" : "");
    ratioTooltip += campaign.connections === 0 ? "" :
      " / " + campaign.connections.toLocaleString(stent.locale) + " connection" + (campaign.connections > 1 ? "s" : "");

    if (campaign.health && campaign.health.status) {

      if (campaign.health.status === "running") {
        health = "running";
        healthText = "running";
        healthTooltip = "OK";
      } else if (campaign.health.status === "warning") {
        health = "warning";

        healthText = "warning";
        healthTooltip = "<strong>Campaign is running</strong>. But you should pay attention to this:" + stent.utils.arrayToHMLList(campaign.health.warnings);
      } else if (campaign.health.status === "error") {
        health = "error";
        healthText = "error";
        healthTooltip = "<strong>Campaign is not running</strong>." + stent.utils.arrayToHMLList(campaign.health.errors);
      } else if (campaign.health.status === "scheduled") {
        health = "scheduled";
        healthText = "scheduled";
        healthTooltip = campaign.health.slots && campaign.health.slots.next ? campaign.health.slots.next : "Campaign is scheduled";
      } else if (campaign.health.status === "stopped") {
        if (campaign.status === "active") {
          health = "stopped";
          healthText = "stopped";
          healthTooltip = "<strong>Campaign is stopped.</strong>" + stent.utils.arrayToHMLList(campaign.health.warnings);
        } else {
          health = null;
          healthText = "-";
          healthTooltip = "Campaign is stopped.";
        }
      } else if (campaign.health.status === "created") {
        health = "created";
        healthText = "created";
        healthTooltip = "Campaign was created today. It will start tomorrow.";
      } else if (campaign.health.status === "suspended") {
        health = "suspended";
        healthText = "suspended";
        healthTooltip = "<strong>This campaign is suspended until the end of the week.</strong>" + stent.utils.arrayToHMLList(campaign.health.errors);
      } else if (campaign.health.status === "hold") {
        health = "on-hold";
        healthText = "on-hold";
        healthTooltip = "<strong>This campaign is on-hold.</strong>";
      } else {
        health = "unknown";
        healthText = "unknown";
        healthTooltip = "Unknown status";
      }

    } else {

      health = "unknown";
      healthText = "unknown";
      healthTooltip = "Unknown status";

    }

    let heathDisplay = `
      ${(health ? `<img src="/assets/img/campaigns/${health}.svg" class="health-icon mr-2" />` : "")} 
      <span style="font-size: 14px;">${healthText}</span>
    `;

    let progress;
    let progressTooltip;

    if (
      typeof campaign.health !== "undefined" &&
      typeof campaign.health.inmails !== "undefined" &&
      typeof campaign.health.slots !== "undefined" &&
      typeof campaign.health.slots.scheduled !== "undefined") {

      let current = 0;
      current += campaign.health.inmails.blocked;
      current += campaign.health.inmails.duplicates;
      current += campaign.health.inmails.errors;
      current += campaign.health.inmails.falsy;
      current += campaign.health.inmails.pending;
      current += campaign.health.inmails.sent;

      let totalDay = campaign.health.inmails.total ?
        campaign.health.inmails.total :
        campaign.health.inmails.cohort.size * campaign.health.slots.scheduled;

      progress = Math.round(totalDay > 0 ? (100 * current) / totalDay : 0);
      progress = progress > 100 ? 100 : progress;

      progressTooltip = `
        <ul style='text-align: left; margin: 0; padding: 0 0 0 15px;'>
          <li class='${campaign.health.inmails.blocked > 0 ? "font-weight-bold" : ""}'>${campaign.health.inmails.blocked} blocked</li>
          <li class='${campaign.health.inmails.duplicates > 0 ? "font-weight-bold" : ""}'>${campaign.health.inmails.duplicates} duplicate${campaign.health.inmails.duplicates > 1 ? "s" : ""}</li>
          <li class='${campaign.health.inmails.errors > 0 ? "font-weight-bold" : ""}'>${campaign.health.inmails.errors} error${campaign.health.inmails.errors > 1 ? "s" : ""}</li>
          <li class='${campaign.health.inmails.falsy > 0 ? "font-weight-bold" : ""}'>${campaign.health.inmails.falsy} falsy</li>
          <li class='${campaign.health.inmails.pending > 0 ? "font-weight-bold" : ""}'>${campaign.health.inmails.pending} pending${campaign.health.inmails.errors > 1 ? "s" : ""}</li>
          <li class='${campaign.health.inmails.sent > 0 ? "font-weight-bold" : ""}'>${campaign.health.inmails.sent} sent</li>
        </ul>
        <div style='margin-top: 5px; padding-top: 5px; border-top: 1px solid #c4b3dd;'>On a total of ${totalDay} InMail${totalDay > 1 ? "s" : ""}</div>
      `;
    }

    let bottomMargin = "0";

    if (campaignsLength - 1 === index) {
      bottomMargin = "20px";
    }

    let approvalIcon = "optout.svg";
    let approvalTooltip = "OptOut";

    if (campaign.approval && campaign.approval.type === "optin") {
      approvalIcon = "optin.svg";
      approvalTooltip = "OptIn";
      if (campaign.approval.method) {
        approvalTooltip += " - " + campaign.approval.method;
      }
    }

    /* eslint-disable */
    html += `

      <!-- -TR- -->
      <tr class="d-flex lv-1" data-item-id="${campaign._key}" style="margin-bottom: ${bottomMargin};">

      <!-- Campaign name -->
      <td class="col-${_tableCols[0]} text-break" style="padding-left: 30px;">
        
        <!-- Approval -->
        <img src="/assets/img/${approvalIcon}" class="approval-icon mr-3" data-toggle="tooltip" title="${approvalTooltip}" />

        <a class="ui-link" data-toggle="tooltip" title="${$('#showArchived').is(':checked') ? `View campaign` : `Edit campaign`}" href="campaigns-form?id=${campaign._key}&flow=${campaign.flow}" style="font-size: 13px; line-height: 22px; height: 20px; overflow: hidden;">${campaign.name}</a>
      </td>

      <!-- Sender -->
      <td class="col-${_tableCols[1]} text-break">
        <div class="avatar avatar-xs mr-2">
          <img src="${campaign.pictureUrl}" style="width: 26px; height: 26px; border-radius: 100%;" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'">
        </div>
        ${campaign.firstName} ${campaign.lastName}
      </td>

      <!-- Source -->
      <td class="col-${_tableCols[2]} text-break pr-5">
        <a 
          style="font-size: 13px; line-height: 22px; height: 20px; overflow: hidden; word-break: break-all;"
          data-toggle="tooltip" 
          data-delay="100" 
          title="${campaign.source.type === "finders" ? `Finder` : `Segment`}: ${campaign.source.name}" 
          href="${campaign.source.type === "finders" ? "finder-form" : "segments-edit"}?id=${campaign.source.key}">
            <span class="fe fe-${campaign.source.type === "finders" ? `search` : `target`} mr-1"></span>
            ${campaign.source.name}
          </a>
      </td>

      <!-- Health -->
      <td class="col-${_tableCols[3]}">
        <div 
          data-toggle="tooltip"
          data-delay="100" 
          data-html="true" 
          title="<div style='font-size: 11px;'>${healthTooltip}</div>"
          >
            <span>${heathDisplay}</span>
          </div>
      </td>

      <!-- Progress -->
      <td class="col-${_tableCols[4]}">
      ${campaign.status !== "stop" &&
        campaign.status !== "archive" &&
        health !== "error" &&
        health !== "unknown" &&
        health !== "scheduled" &&
        health !== "created" &&
        health !== "stopped" &&
        health !== "suspended"
        ?
        `
        <div 
          class="row align-items-center no-gutters"
          data-toggle="tooltip"
          data-delay="100" 
          data-html="true" 
          title="<div style='font-size: 11px;'>${progressTooltip}</div>"
          >
          <div class="col-auto">
            <span class="h5 mr-2 mb-0">${progress}%</span>
          </div>
          <div class="col">
            <div class="progress progress">
              <div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        ` :
        `-`
      }
      </td>

      <!-- Ratio -->
      <td class="col-${_tableCols[5]} align-right">
        ${acceptance > 0 ?
        `
            <div class="d-flex justify-content-end align-items-center" style="flex:1;"
              data-toggle="tooltip"
              data-delay="100" 
              data-html="true" 
              title="<div style='font-size: 11px;'>${ratioTooltip}</div>">
              <span class="h5 mb-0">${acceptance > 0 ? acceptance + "%" : "-"}</span>` + `<div class="ml-2 mr-2" style="font-size: 0; white-space: nowrap;">${ratioDOM(acceptance)}</div>
            </div>
          `
        : "-"
      }
      </td>


      <!-- Status -->
      <td class="col-${_tableCols[6]} justify-content-center">
        ${!$('#showArchived').is(':checked') ?
        `
            <div class="custom-control custom-switch">
              <input 
                type="checkbox" 
                class="custom-control-input campaign-status" 
                id="${campaign._key}" ${campaign.status == "active" ? "checked='checked'" : ""}>
              <label class="custom-control-label" for="${campaign._key}"></label>
            </div>
            ` :
        campaign.status === 'stop' ?
          `<span class="badge badge-soft-danger">Stopped</span>` :
          `<span class="badge badge-soft-success">Started</span>`
      }
      </td>


      <!-- Actions -->
      <td class="col-${_tableCols[7]} align-right">
        ${$('#showArchived').is(':checked') ?
        `<span class="badge badge-warning">Archived</span>`
        :
        `
          <a href="#" class="flex-row align-items-center open-actions" role="button" data-toggle="dropdown">
            <img src="/assets/img/dots-dark.png" />
          </a>
          <div class="dropdown-menu dropdown-menu-right dropdown-toggle-no-caret">
          
            <!-- Edit campaign -->
            <a 
              class="dropdown-item ui-link"
              href="campaigns-form?id=${campaign._key}&flow=${campaign.flow}">
                <i class="fe fe-edit"></i> Edit campaign
            </a>

            <a href="queue?campaignId=${campaign._key}&campaignName=${encodeURIComponent(campaign.name)}&sort=DATE_DESC" class="dropdown-item ui-link">
              <i class="fe fe-users"></i> View queue
            </a>

            <a 
              class="dropdown-item ui-link"
              id="${campaign._key}" 
              href="campaigns-form?action=duplicate&id=${campaign._key}&flow=${campaign.flow}">
              <i class="fe fe-copy"></i> Duplicate
            </a>
            <a class="dropdown-item campaign-archive" data-toggle="modal" data-target=".confirm-archive-campaign" href="#">
              <i class="fe fe-alert-octagon"></i> Archive
            </a>

            <div class="dropdown-divider"></div>
            <!-- Source -->
            <a 
              class="dropdown-item ui-link"
              href="${campaign.source.type === "finders" ? "finder-form" : "segments-edit"}?id=${campaign.source.key}">
                <i class="fe fe-target"></i> Edit ${campaign.source.type === "finders" ? "finder" : "segment"}
            </a>
            
          </div>

          `
      }
      </td>

    </tr>
    
    `;

    /* eslint-enable */

    return html;
  };

  const ratioDOM = function (acceptance) {
    if (!acceptance || acceptance === 0) {
      return "-";
    }

    if (acceptance > 0 && acceptance < 20) {
      return `
        <div class="battery-jauge battery-jauge_danger"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (acceptance >= 20 && acceptance < 40) {
      return `
        <div class="battery-jauge battery-jauge_danger"></div>
        <div class="battery-jauge battery-jauge_danger"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (acceptance >= 40 && acceptance < 60) {
      return `
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (acceptance >= 60 && acceptance < 80) {
      return `
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (acceptance >= 80) {
      return `
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
      `;
    }
  };

  const updateCampaignStatus = function (campaignId) {
    let statusControl = $("#" + campaignId);
    stent.loader.hide(statusControl.closest("tr"));
  };

  const archiveCampaignStatus = function (campaignId) {
    let statusControl = $("#" + campaignId);
    stent.loader.hide(statusControl.closest("tr"));
    statusControl.closest("tr").remove();
  };

  const bindEvents = function () {
    $("body")
      .off("input", ".campaign-status")
      .on("input", ".campaign-status", function () {
        let status = $(this).is(":checked");
        let campaignId = $(this).attr("id");
        let statusValue = status ? "active" : "stop";
        let statusPayload = { status: statusValue };
        stent.loader.show($(this).closest("tr"));
        stent.ajax.patchRest("/campaigns/" + stent.tenant.key + "/" + campaignId, statusPayload, updateCampaignStatus);
      });

    $(".confirm-archive-campaign").on("show.bs.modal", function (e) {
      let $invoker = $(e.relatedTarget);
      let campaignId = $invoker.closest("tr[data-item-id]").attr("data-item-id");
      $(".confirm-button-archive").attr("data-campaign-id", campaignId);
    });

    $(".confirm-button-archive")
      .off("click")
      .on("click", function () {
        let campaignId = $(this).attr("data-campaign-id");
        $(".confirm-archive-campaign").modal("hide");
        let statusPayload = { status: "archive", visible: false };
        stent.loader.show($(this).closest("tr"));
        stent.ajax.patchRest("/campaigns/" + stent.tenant.key + "/" + campaignId, statusPayload, archiveCampaignStatus);
      });

    $("body")
      .off("click", "#new-campaign-button")
      .on("click", "#new-campaign-button", function () {
        stent.ui.load({ fileToLoad: "campaigns-form.html?flow=" + _flow });
        stent.ui.pushState("campaigns-form.html?flow=" + _flow, false, "campaigns-form?flow=" + _flow);
      });

    $(".filter-table")
      .off("change")
      .on("change", function () {
        if ($(this).val() !== "") {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }
        buildCampaignsList();
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
      .on("click", function () {
        resetFilters();
        buildCampaignsList();
      });

    $(".changeParam")
      .off("input")
      .on("input", async function () {

        // hide status filter and set to none
        if ($(this).is(":checked")) {
          $("#filter-table-status")
            .val("")
            .removeClass("active")
            .closest(".form-group")
            .addClass("d-none");
        } else {
          $("#filter-table-status")
            .val("active")
            .addClass("active")
            .closest(".form-group")
            .removeClass("d-none");
        }

        stent.loader.show(".main-content");
        _campaigns = await getCampaigns();
        sortCampaigns();
        _programs = nestCampaigns(_campaigns);
        buildCampaignsList();
        stent.loader.hide();
      });

    $("body")
      .off("click", ".toggle-children-visibility")
      .on("click", ".toggle-children-visibility", function () {

        let tr = $(this).closest("tr");
        let trNext = tr.nextAll();

        if ($(this).hasClass("fe-chevron-down")) {
          // Close Childrens
          $(this).removeClass("fe-chevron-down").addClass("fe-chevron-right");
          $(this).closest("tr").removeClass("visible");

          for (let i = 0; i < trNext.length; i++) {
            if ($(trNext[i]).hasClass("lv-0")) {
              break;
            } else {
              $(trNext[i]).removeClass("d-flex").addClass("d-none");
            }
          }

        } else {
          // Open children
          $(this).removeClass("fe-chevron-right").addClass("fe-chevron-down");
          $(this).closest("tr").addClass("visible");

          for (let i = 0; i < trNext.length; i++) {
            if ($(trNext[i]).hasClass("lv-0")) {
              break;
            } else {
              $(trNext[i]).addClass("d-flex").removeClass("d-none");
            }
          }
        }

      });
  };

  const init = async function () {

    stent.loader.show(".main-content");

    // Active corresponding menu
    stent.navbar.activeMenu("campaign-list-hire-linkedin-cohort");
    
    // change Page title
    stent.ui.setPageTitle("Hire campaigns list");

    //bind events
    bindEvents();

    // Fill Select filters input
    await initFilters();

    // get the campaigns list
    _campaigns = await getCampaigns();
    sortCampaigns();

    // Nest campaings in Programs
    _programs = nestCampaigns(_campaigns);

    // Build finders DOM
    buildCampaignsList();

    // Remove Loader
    stent.loader.hide();

  };

  init();

  return {};

})();
