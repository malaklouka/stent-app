"use strict";

stent.funnel = (function () {

  let _funnel = {};
  let _limit = 20;
  let _filters = {
    programName: null,
    campaignName: null,
    memberKey: null,
    dates: {
      start: null,
      end: null
    }
  };

  // Define the toggle points value where the UI ratio indicators show green or red icons
  let togglePoints = {
    connected: 40,
    nurtured: 80,
    engaged: 10,
    leads: 3
  };

  // Date selector default value
  let _dateFilterStartValue = "";

  const setDateFilter = function (start, end, label) {
    if (start._isValid === true) {
      _filters.dates.start = moment(start).valueOf();
    } else {
      _filters.dates.start = null;
    }
    if (end._isValid === true) {
      _filters.dates.end = moment(end).valueOf();
    } else {
      _filters.dates.end = null;
    }

    let startToPass = moment(start).valueOf();
    let endToPass = moment(end).valueOf();
    _filters.dates.start = startToPass;
    _filters.dates.end = endToPass;
    _dateFilterStartValue = label;

    $("#dateFilter-input").text(label);
    $("#dateFilter").attr("data-start", start);
    $("#dateFilter").attr("data-end", end);
  };


  const initDateFilter = function () {
    _filters.dates.start = moment().subtract(6, "days");
    _filters.dates.end = moment();
    setDateFilter(_filters.dates.start, _filters.dates.end, "Last 7 Days");

    $("#dateFilter").daterangepicker(
      {
        showDropdowns: true,
        "alwaysShowCalendars": true,
        "startDate": moment().subtract(6, "days"),
        "endDate": moment(),
        "opens": "center",
        ranges: {
          "Today": [moment(), moment()],
          "Yesterday": [moment().subtract(1, "days"), moment().subtract(1, "days")],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
          "All": [moment("1970-01-01"), moment()],
        },
      },
      setDateFilter
    );
  };

  const getFunnel = async function () {
    return stent.ajax.postRestAsync("/contacts/" + stent.tenant.key + "/funnel", _filters);
  };


  const getContacts = async function (slot, step) {

    let appendToUrl = "";
    let loadStep = step ? step : "init";

    if (loadStep === "init") {
      stent.loader.show("#slot-" + slot + " .contacts");
    } else {
      loadStep = "more";
      stent.loader.show("#slot-" + slot + " .load-more-contacts");
      appendToUrl += "?offset=" + _funnel[slot].offset;
    }

    let data = await stent.ajax.postRestAsync("/contacts/" + stent.tenant.key + "/funnel/" + slot + "/" + appendToUrl, _filters);

    if (data && data.ok && data.message && data.message.profiles) {

      if (loadStep === "init") {

        _funnel[slot].contacts = [];
        _funnel[slot].count = data.message.count;
        _funnel[slot].hasMore = data.message.hasMore;
        _funnel[slot].offset = _limit;
        _funnel[slot].contacts.push(...data.message.profiles);

      } else if (loadStep === "more") {

        _funnel[slot].offset += _limit;
        _funnel[slot].hasMore = data.message.hasMore;
        _funnel[slot].contacts.push(...data.message.profiles);

      }

      stent.utils.log(_funnel);

      updateDOM(slot, data.message.profiles);

    } else {
      // Error when loading more contacts
      stent.toast.danger("Error: We've encountered a problem while loading more contacts. Please try again.");

    }

    stent.loader.hide("#slot-" + slot + " .contacts");

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


  const getCampaignsPrograms = async function () {

    let fetchCampaignsPrograms = await stent.ajax.getRestAsync("/campaigns/" + stent.tenant.key + "/programs");

    if (fetchCampaignsPrograms && fetchCampaignsPrograms.ok && fetchCampaignsPrograms.message) {
      return fetchCampaignsPrograms.message;
    } else {
      stent.toast.danger("Error when trying to fetch the campaigns programs. Please try again.");
      return null;
    }

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


  const postAsLead = async function (contactKey, originalSlot) {

    let fetchLead = await stent.ajax.postRestAsync("/contacts/" + stent.tenant.key + "/leads/" + contactKey + "?origin=" + originalSlot);

    if (fetchLead && fetchLead.ok && fetchLead.message) {
      return fetchLead.message;
    } else {
      stent.toast.danger("Error when trying to add the ambassador as lead. Please refresh the page to try again.");
      return null;
    }

  };


  const deleteAsLead = async function (contactKey) {

    let fetchLead = await stent.ajax.deleteRestAsync("/contacts/" + stent.tenant.key + "/leads/" + contactKey);

    if (fetchLead && fetchLead.ok && fetchLead.message) {
      return fetchLead.message;
    } else {
      stent.toast.danger("Error when trying to remove the ambassador as lead. Please refresh the page to try again.");
      return null;
    }

  };

  // Get url params to set filters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const populateCampaignNamePicker = async function () {

    let _campaignsNames = await getCampaignsNames();

    _campaignsNames.forEach(function (campaign) {
      let option = new Option(campaign, campaign);
      $("#filter-table-campaign-name").append($(option));
    });

    const selectedCampaignName = urlParams.get("campaignName");

    if (selectedCampaignName) {
      _filters.programName = selectedCampaignName;
      $("#filter-table-campaign-name option[value='" + selectedCampaignName + "']").prop("selected", true);
      $("#filter-table-campaign-name").addClass("active");
      cleanFunnel();
      setFilters();
    }
  };

  const populateCampaignProgramPicker = async function () {

    let _campaignsPrograms = await getCampaignsPrograms();

    _campaignsPrograms.forEach(function (campaign) {
      let option = new Option(campaign, campaign);
      $("#filter-table-campaign-program").append($(option));
    });

    const selectedCampaign = urlParams.get("program");

    if (selectedCampaign) {
      _filters.programName = selectedCampaign;
      $("#filter-table-campaign-program option[value='" + selectedCampaign + "']").prop("selected", true);
      $("#filter-table-campaign-program").addClass("active");
      cleanFunnel();
      setFilters();
    }
  };


  const populateMembersPicker = async function () {

    let _members = await getMembers();

    _members.forEach(function (member) {
      let option = new Option(member.firstName + " " + member.lastName, member.id);
      $("#filter-table-member").append($(option));
    });

    const selectedMemberName = urlParams.get("ambassador");

    if (selectedMemberName) {
      _filters.memberKey = selectedMemberName;
      $("#filter-table-member option[value='" + selectedMemberName + "']").prop("selected", true);
      $("#filter-table-member").addClass("active");
      cleanFunnel();
      setFilters();
    }
  };


  const createFilters = async function () {

    stent.loader.show(".main-content");

    await populateCampaignNamePicker();
    await populateCampaignProgramPicker();
    await populateMembersPicker();

    stent.loader.hide();
  };

  const resetFilters = function () {

    _filters = {
      programName: null,
      campaignName: null,
      memberKey: null,
      dates: {
        start: "",
        end: ""
      },
    };

    $("#filter-table-campaign-program").val("").removeClass("active");
    $("#filter-table-campaign-name").val("").removeClass("active");
    $("#filter-table-member").val("").removeClass("active");
    $("#dateFilter").val("").removeClass("active");
    // initDateFilter();
    window.location.reload();
  };

  const setFilters = function () {
    _filters.programName = $("#filter-table-campaign-program").val();
    _filters.campaignName = $("#filter-table-campaign-name").val();
    _filters.memberKey = $("#filter-table-member").val();

    if (
      _filters.programName +
      _filters.campaignName +
      _filters.memberKey === "" && _dateFilterStartValue === ""
    ) {
      $("#filter-reset").addClass("d-none");
    } else {
      $("#filter-reset").removeClass("d-none");
    }
  };

  const resizeContactsWrapper = function () {
    $("#funnel-wrapper .contacts").css("height", $("#funnel-wrapper .slot-col").height() - 230);
  };

  const bindEvents = function () {

    $("#dateFilter").on("apply.daterangepicker", function () {
      cleanFunnel();
      setFilters();
      createFunnel();
      let startValue = $("#dateFilter").attr("data-start");
      let endValue = $("#dateFilter").attr("data-end");

      if (startValue && endValue) {
        $(this).addClass("active");
      }
    });

    $("#funnel-wrapper")
      .off("click", ".a-contact")
      .on("click", ".a-contact", function () {
        let contactKey = $(this).attr("contact-key");
        stent.contact.open(contactKey);
      });

    $("#funnel-wrapper")
      .off("click", ".load-more-contacts button")
      .on("click", ".load-more-contacts button", function () {

        let slot = $(this).attr("data-slot");
        getContacts(slot, "more");

      });

    $("#funnel-wrapper")
      .off("click", ".lead-icon")
      .on("click", ".lead-icon", async function (e) {

        e.stopPropagation();

        let contactElem = $(this).closest(".a-contact");

        let leadsWrapper = $("#slot-leads .contacts");
        let contactKey = contactElem.attr("contact-key");
        let contactIsLead = contactElem.hasClass("a-contact-lead");
        let slotOrigin = $(this).closest(".slot-col").attr("id").replace("slot-", "");

        stent.loader.show("[contact-key=\"" + contactKey + "\"]");

        if (!contactIsLead) {

          // MARK AS LEAD

          let contactElemCopy = $($(this).closest(".a-contact")[0].outerHTML).addClass("a-contact-lead").hide();
          contactElemCopy.find(".tootlipLead").text("Remove from leads");

          await postAsLead(contactKey, slotOrigin);

          let currentSlotCounterWrapper = $(this).closest(".slot-col").find(".card-footer strong");
          let newSlotCount = parseInt(currentSlotCounterWrapper.attr("data-value"), 10) - 1;
          currentSlotCounterWrapper.attr("data-value", newSlotCount);
          currentSlotCounterWrapper.text(newSlotCount.toLocaleString(stent.locale));

          let leadsCounterWrapper = $("#slot-leads .card-footer strong");
          let newLeadsCount = parseInt(leadsCounterWrapper.attr("data-value"), 10) + 1;
          leadsCounterWrapper.attr("data-value", newLeadsCount);
          leadsCounterWrapper.text(newLeadsCount.toLocaleString(stent.locale));

          leadsWrapper.prepend(contactElemCopy);
          contactElemCopy.slideDown("fast");

          contactElem.slideUp("fast", function () { $(this).remove(); });

        } else {

          // REMOVE FROM LEADS

          let contactElemCopy = $($(this).closest(".a-contact")[0].outerHTML).removeClass("a-contact-lead").hide();
          contactElemCopy.find(".tootlipLead").text("Mark as lead");

          let origin = contactElem.attr("data-origin");

          await deleteAsLead(contactKey);

          let leadsCounterWrapper = $("#slot-leads .card-footer strong");
          let newLeadsCount = parseInt(leadsCounterWrapper.attr("data-value"), 10) - 1;
          leadsCounterWrapper.attr("data-value", newLeadsCount);
          leadsCounterWrapper.text(newLeadsCount.toLocaleString(stent.locale));

          if (typeof origin !== "undefined") {

            let destinationSlotCounterWrapper = $("#slot-" + origin).find(".card-footer strong");
            let newSlotCount = parseInt(destinationSlotCounterWrapper.attr("data-value"), 10) + 1;
            destinationSlotCounterWrapper.attr("data-value", newSlotCount);
            destinationSlotCounterWrapper.text(newSlotCount.toLocaleString(stent.locale));

            let destinationLane = $("#slot-" + origin + " .contacts");
            destinationLane.prepend(contactElemCopy);
            contactElemCopy.slideDown("fast");
          }

          contactElem.slideUp("fast", function () { $(this).remove(); });

        }

        stent.loader.hide();

      });

    $(".filter-table")
      .off("change")
      .on("change", function () {
        if ($(this).val() !== "") {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }
        cleanFunnel();
        setFilters();
        createFunnel();
      });

    $("#filter-reset")
      .off("click")
      .on("click", function () {
        cleanFunnel();
        resetFilters();
        createFunnel();
      });

    $(window)
      .off("resize.funnel")
      .on("resize.funnel", function () {
        if ($("#funnel-wrapper").length === 0) {
          $(window).off("resize.funnel");
        } else {
          resizeContactsWrapper();
        }
      });

    $("#export-actions")
      .off("click", ".dropdown-item")
      .on("click", ".dropdown-item", async function (e) {
        e.preventDefault();

        let url = "/contacts/" + stent.tenant.key + "/funnel/export?" + $(this).attr("data-url");

        // IN
        // campaignName: null
        // memberKey: null
        // programName: null
        // dates.start : null
        // dates.end: null

        // OUT
        // campaign : nom de la campagne
        // program : nom du programme
        // owner
        // dates.start : timestamp
        // dates.end: timestamp

        if (_filters) {
          if (_filters.campaignName) {
            url += "&campaign=" + encodeURIComponent(_filters.campaignName);
          }
          if (_filters.programName) {
            url += "&program=" + encodeURIComponent(_filters.programName);
          }
          if (_filters.memberKey) {
            url += "&owner=" + encodeURIComponent(_filters.memberKey);
          }
          if (_filters.dates.start) {
            url += "&start=" + encodeURIComponent(_filters.dates.start);
          }
          if (_filters.dates.end) {
            url += "&end=" + encodeURIComponent(_filters.dates.end);
          }
        }

        let fetchExportExcel = await stent.ajax.postRestAsync(url);

        if (fetchExportExcel.ok) {
          let email = stent.user.email ? stent.user.email : "your email";
          stent.toast.success(
            "A link to the excel file will be sent to " + email + " as soon as the file is ready to download."
          );
        } else {
          stent.toast.danger("Error when trying to export the funnel lane as an excel file. Please try again.");
        }
      });

  };

  const renderContact = (contact, slot) => {
    /* eslint-disable */
    return `
      <div 
        class="row align-items-center no-gutters a-contact ${slot === 'leads' ? "a-contact-lead" : ""}" 
        contact-key="${contact.key}"
        data-origin="${contact.origin ? contact.origin : (slot === 'leads' ? '' : slot)}">
        
        <div class="lead-wrapper">
          <span class="lead-icon">
            <img src="/assets/img/funnel/star.svg" />
          </span>
          <div class="tootlipLead">
            ${slot === 'leads' ? 'Remove from leads' : 'Mark as lead'}
          </div>
        </div>

        <div class="col-auto">
          <span class="avatar">
            <img src="${contact.pictureUrl}" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" class="avatar-img rounded-circle">
          </span>
        </div>

        <div class="col ml-3 userData">
          <h4 class="m-0">${contact.firstName} ${contact.lastName}</h4>
          <p class="small m-0">${contact.headline}</p>
        </div>

        ${contact.strength && (slot === "engaged" || slot === "leads") ? `
          <div class="on-fire-wrapper">
            ${Array(contact.strength).fill("<img src=\"/assets/img/funnel/fire.svg\" />").join("")}
          </div>
        ` : ""}
        
      </div>
    `;
    /* eslint-enable */
  };

  const roundedRatio = function (num) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
  };

  const generateJaugeConnected = function (ratio, togglePoint = 40) {

    let o = {
      in: null,
      jauge: null,
      out: null
    };

    if (typeof ratio === "undefined") {
      html += "-";
      return html;
    }

    /* eslint-disable */
    o.in = `<img src="/assets/img/funnel/${ratio < togglePoint ? `down` : `up`}-in.svg" />`;

    o.jauge = `<div class="funnel-ratio-jauge d-flex justify-content-center">`;
    Array(5).fill('').forEach((value, i) => {
      if (ratio >= (i * 20)) {
        o.jauge += `<div class="battery-jauge battery-jauge_${ratio >= togglePoint ? 'success' : 'danger'}"></div>`;
      } else {
        o.jauge += `<div class="battery-jauge"></div>`;
      }
    })
    o.jauge += `</div>`;

    o.out = `<img src="/assets/img/funnel/${ratio < togglePoint ? `down` : `up`}-out.svg" />`;

    return o;
  };

  const loadMoreButtonDOM = function (slot) {
    return `
      <div class="load-more-contacts text-center">
        <button type="button" class="btn btn-sm btn-outline-secondary" data-slot="${slot}">Load more contacts</button>
      </div>
    `;
  };

  const updateRatiosDOM = function () {

    let mainRatio = 0;
    let jauge = {};

    // Connected
    mainRatio = _funnel.connected.ratio.previous !== 0 ? roundedRatio(_funnel.connected.ratio.previous * 100) : 0;
    jauge = generateJaugeConnected(mainRatio, togglePoints.connected);
    $("#slot-connected .funnel-ratio-wrapper h4").html(mainRatio + "%");
    $("#slot-connected .funnel-ratio-center").html(jauge.jauge);
    $("#slot-connected .funnel-ratio-in").prepend(jauge.in);
    $("#slot-connected .funnel-ratio-out").prepend(jauge.out);
    $("#slot-connected .funnel-ratio-in .number").html("<span>" + _funnel.invited.count.toLocaleString(stent.locale) + "</span>");
    $("#slot-connected .funnel-ratio-out .number").html("<span>" + _funnel.connected.count.toLocaleString(stent.locale) + "</span>");

    // Nurtured
    mainRatio = _funnel.nurtured.ratio.previous !== 0 ? roundedRatio(_funnel.nurtured.ratio.previous * 100) : 0;
    jauge = generateJaugeConnected(mainRatio, togglePoints.nurtured);
    $("#slot-nurtured .funnel-ratio-wrapper h4").html(mainRatio + "%");
    $("#slot-nurtured .funnel-ratio-center").html(jauge.jauge);
    $("#slot-nurtured .funnel-ratio-in").prepend(jauge.in);
    $("#slot-nurtured .funnel-ratio-out").prepend(jauge.out);
    $("#slot-nurtured .funnel-ratio-in .number").html("<span>" + _funnel.connected.count.toLocaleString(stent.locale) + "</span>");
    $("#slot-nurtured .funnel-ratio-out .number").html("<span>" + _funnel.nurtured.count.toLocaleString(stent.locale) + "</span>");

    // Engaged
    mainRatio = _funnel.engaged.ratio.previous !== 0 ? roundedRatio(_funnel.engaged.ratio.previous * 100) : 0;
    jauge = generateJaugeConnected(mainRatio, togglePoints.engaged);
    $("#slot-engaged .funnel-ratio-wrapper h4").html(mainRatio + "%");
    $("#slot-engaged .funnel-ratio-center").html(jauge.jauge);
    $("#slot-engaged .funnel-ratio-in").prepend(jauge.in);
    $("#slot-engaged .funnel-ratio-out").prepend(jauge.out);
    $("#slot-engaged .funnel-ratio-in .number").html("<span>" + _funnel.nurtured.count.toLocaleString(stent.locale) + "</span>");
    $("#slot-engaged .funnel-ratio-out .number").html("<span>" + _funnel.engaged.count.toLocaleString(stent.locale) + "</span>");

    // Leads
    mainRatio = _funnel.leads.ratio.previous !== 0 ? roundedRatio(_funnel.leads.ratio.previous * 100) : 0;
    jauge = generateJaugeConnected(mainRatio, togglePoints.leads);
    $("#slot-leads .funnel-ratio-wrapper h4").html(mainRatio + "%");
    $("#slot-leads .funnel-ratio-center").html(jauge.jauge);
    $("#slot-leads .funnel-ratio-in").prepend(jauge.in);
    $("#slot-leads .funnel-ratio-out").prepend(jauge.out);
    $("#slot-leads .funnel-ratio-in .number").html("<span>" + _funnel.engaged.count.toLocaleString(stent.locale) + "</span>");
    $("#slot-leads .funnel-ratio-out .number").html("<span>" + _funnel.leads.count.toLocaleString(stent.locale) + "</span>");

  };

  const updateCountersDOM = function (slot) {
    $("#slot-" + slot + " .card-footer strong").attr("data-value", _funnel[slot].count);
    $("#slot-" + slot + " .card-footer strong").html(_funnel[slot].count.toLocaleString(stent.locale));
  };

  const updateDOM = function (slot, items) {

    // Remove the loadMore button if already exist in DOM
    $("#slot-" + slot + " .contacts .load-more-contacts").remove();

    $("#slot-" + slot + " .contacts").append(items.map((item) => renderContact(item, slot)).join(""));
    if (_funnel[slot].hasMore) {
      $("#slot-" + slot + " .contacts").append(loadMoreButtonDOM(slot));
    }

  };

  const cleanFunnel = function () {

    _funnel = {};

    $("#funnel-wrapper .contacts").empty();
    $("#funnel-wrapper .contacts-header strong").text("-");
    $("#funnel-wrapper .funnel-ratio-wrapper").html(
      `
      <h4>-</h4>
      <div class="funnel-ratio-data-wrapper">
        <div class="funnel-ratio-in">
          <div class="number"></div>
        </div>
        <div class="funnel-ratio-center"></div>
        <div class="funnel-ratio-out">
          <div class="number"></div>
        </div>
      </div>
      `
    );

  };

  const createFunnel = async function () {

    stent.loader.show(".main-content");

    // Fetch funnel data
    let fetchFunnel = await getFunnel();

    if (fetchFunnel.ok && fetchFunnel.message) {
      _funnel = { ...fetchFunnel.message };

      updateRatiosDOM();

      // Fetch latest ambassadors
      await getContacts("invited");
      await getContacts("connected");
      await getContacts("nurtured");
      await getContacts("engaged");
      await getContacts("leads");

      updateCountersDOM("invited");
      updateCountersDOM("connected");
      updateCountersDOM("nurtured");
      updateCountersDOM("engaged");
      updateCountersDOM("leads");

      $("#funnel-wrapper .col").removeClass("d-none");
      $("#funnel-filter-wrapper").removeClass("d-none");

    } else {
      displayError();
    }

    stent.loader.hide();

  };

  const displayError = function () {
    // Hide filters
    $("#funnel-filter-wrapper").closest(".row").hide();

    // Display error message
    $("#funnel-wrapper")
      .removeClass("h-100")
      .html(`
      <div style="width: 100%;" class="alert alert-warning alert-dismissible fade show" role="alert">
        The funnel view is not active. Please contact your admin.
      </div>
    `);
  };

  const init = async function () {
    // Active corresponding menu
    stent.navbar.activeMenu("funnel");

    // change page title
    stent.ui.setPageTitle("Funnel");

    bindEvents();

    initDateFilter();
    resizeContactsWrapper();
    await createFilters();
    await createFunnel();
    resizeContactsWrapper();
  };

  init();

  return {
    get: function () {
      return _funnel;
    },
    getFilters: function () {
      return _filters;
    }
  };
})();

