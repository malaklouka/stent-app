stent.members = (function () {

  let _identityId = "";
  let _subscription = null;
  let _members;

  let _canAddMembers = true;

  let _filters = {
    name: "",
    status: "",
    admin: ""
  };

  let $button = $("[data-target=\"#membersPicker\"]");

  const initSubscription = async function () {
    let fetchSubscription = await getSubscription();

    if (fetchSubscription === "openbar") {

      _subscription = fetchSubscription;

      // subscription received from server = null
      $("#subscription-data").html("");
    } else if (typeof fetchSubscription === "object" && fetchSubscription !== null) {
      let count = countActiveMembers();
      _subscription = { ...fetchSubscription };

      if (_subscription.images && _subscription.images.length > 0) {
        $("#subscription-data-logo-wrapper").html(`<img src="${_subscription.images[0]}" />`);
      }

      if (_subscription.name) {
        $("#subscription-data-text-wrapper h1").html(_subscription.name);
      }

      if (_subscription.seats) {
        $("#subscription-data-text-wrapper h4").html(
          `${count} active ambassador${count > 1 ? "s" : ""} / ${_subscription.seats} allowed`
        );
      }

    } else {
      // Error when getting plan
      $("#subscription-data").html(`
        <div class="alert alert-warning" style="margin: 0; width: 100%;" role="alert">
          An error occured when getting your subscription plan. Please refresh the page.
        </div>
      `);

    }

    $("#subscription-data").removeClass("is-loading");

  };

  const countActiveMembers = function () {
    let activeMembersCount = _members.filter((member) => member.status.toLowerCase() === "active").length;
    return activeMembersCount;
  };

  const lockAddMember = function () {
    $button.attr("disabled", "disabled");
    $button.removeClass("btn-primary");
    $button.addClass("btn-outline-secondary");

    if ($("#tooltip-overlay").length === 0) {
      $button.wrap("<div>");
      $button.after("<div id=\"tooltip-overlay\"></div>");
      $("#tooltip-overlay").attr("title", "Your ambassadors quota is full. Please upgrade your plan to add new ambassadors");
      $("#tooltip-overlay").attr("data-toggle", "tooltip");
    }

    // Switches tooltip
    $(".switch-member-status:not(:checked)").attr("disabled", "disabled");
    $(".switch-member-status:not(:checked)").parent().attr("title", "Your ambassadors quota is full. Please upgrade your plan to add new ambassadors");
    $(".switch-member-status:not(:checked)").parent().attr("data-toggle", "tooltip");

    $(".tooltip").remove();

  };

  const unlockAddMember = function () {
    $button.removeAttr("disabled");
    $button.removeClass("btn-outline-secondary");
    $button.addClass("btn-primary");

    if ($("#tooltip-overlay").length >= 1) {
      $("#tooltip-overlay").remove();
      $button.unwrap();
    }

    // Switches tooltip
    $(".switch-member-status:not(:checked)").removeAttr("disabled");
    $(".switch-member-status:not(:checked)").parent().removeAttr("title");
    $(".switch-member-status:not(:checked)").parent().removeAttr("data-toggle");

    $(".tooltip").remove();

  };

  const updateAddMember = function () {

    if (_subscription && typeof _subscription === "object") {
      let count = countActiveMembers();
      if (count >= _subscription.seats) {
        _canAddMembers = false;
        lockAddMember();
      } else if (count < _subscription.seats) {
        _canAddMembers = true;
        unlockAddMember();
      }
      $("#subscription-data-text-wrapper h4").html(
        `${count} active ambassador${count > 1 ? "s" : ""} / ${_subscription.seats} allowed`
      );
    } else if (_subscription === "openbar") {
      _canAddMembers = true;
    } else {
      _canAddMembers = false;
      lockAddMember();
    }
  };

  const getSubscription = async function () {
    let query = `
        {
          workspaceContext {
            workspace {
              subscription {
                plan {
                  images
                  description
                  name
                  seats
                }
              }
            }
          }
        }`;

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.workspace) {

      if (result.message.data.workspaceContext.workspace.subscription &&
        result.message.data.workspaceContext.workspace.subscription.plan &&
        result.message.data.workspaceContext.workspace.subscription.plan.seats) {
        return result.message.data.workspaceContext.workspace.subscription.plan;
      } else {
        return "openbar";
      }

    } else {
      return null;
    }

  };

  const getInvitationLink = async function () {
    let query = `
      query {
        workspaceContext {
          workspace {
            settings {
              inviteCode
            }
          }
        }
      }`;

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.workspace &&
      result.message.data.workspaceContext.workspace.settings &&
      result.message.data.workspaceContext.workspace.settings.inviteCode) {

      return result.message.data.workspaceContext.workspace.settings.inviteCode;

    } else {
      return null;
    }

  };

  const changeInviteCode = async function () {
    let query = `
      mutation {
        workspaceContext {
          changeInviteCode {
            workspace {
              company {
                name
              }
            }
          }
        }
      }`;

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.changeInviteCode &&
      result.message.data.workspaceContext.changeInviteCode.workspace &&
      result.message.data.workspaceContext.changeInviteCode.workspace.company &&
      result.message.data.workspaceContext.changeInviteCode.workspace.company.name) {

      return true;

    } else {
      return null;
    }

  };

  const getMember = function (memberId) {
    return _members.filter(member => member.id === memberId)[0];
  };

  const getMembers = async function () {

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

  const sendNotification = async function (memberId) {

    let fetchSendNotification = await stent.ajax.postRestAsync(
      "/linkedin/identities/" + memberId + "/notify/reconnect"
    );

    if (fetchSendNotification && fetchSendNotification.ok && fetchSendNotification.message) {
      stent.toast.success("Your notification has been sent to the ambassador.");
    } else {
      stent.toast.danger("Error when trying to send a notification, please try again.");
    }
  };

  const resetFilters = function () {
    $("#filter-table-name").val("").removeClass("active");
    $("#filter-table-status").val("").removeClass("active");
  };

  const setFilters = function () {

    _filters.name = $("#filter-table-name").val();
    _filters.status = $("#filter-table-status").val();
    //_filters.admin = $("#filter-table-admin").val() === "" ? "" : $("#filter-table-admin").val() === "true" ? true : false;

    if (_filters.status + _filters.name === "") {
      $("#filter-reset").addClass("d-none");
    } else {
      $("#filter-reset").removeClass("d-none");
    }

  };

  const SSIDOM = function (score) {
    if (!score || score === 0) {
      return "-";
    }

    if (score > 0 && score < 20) {
      return `
        <div class="battery-jauge battery-jauge_danger"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (score >= 20 && score < 40) {
      return `
        <div class="battery-jauge battery-jauge_danger"></div>
        <div class="battery-jauge battery-jauge_danger"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (score >= 40 && score < 60) {
      return `
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (score >= 60 && score < 80) {
      return `
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge"></div>
      `;
    } else if (score >= 80) {
      return `
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
        <div class="battery-jauge battery-jauge_success"></div>
      `;
    }
  };

  const noMembersDOM = function () {
    return `
      <div class="mt-3">
        <div class="alert alert-warning" role="alert">
          We can't find any ambassador.
        </div>
      </div>
    `;
  };

  const buildMembersList = function () {

    // Update Filters
    setFilters();

    let displayMembers;
    let filtersCount = Object.values(_filters).filter(filter => filter !== "").length;

    if (filtersCount === 0) {
      displayMembers = [..._members];
    } else {

      displayMembers = _members.filter((member) => {

        let trueCount = 0;

        // Filter on firstName & lastName
        if (_filters.name && _filters.name !== ""
          && (
            member.firstName && member.firstName.toLowerCase().includes(_filters.name.toLowerCase()) ||
            member.lastName && member.lastName.toLowerCase().includes(_filters.name.toLowerCase())
          )
        ) {
          trueCount++;
        }

        // Filter on status
        if (_filters.status && _filters.status !== "" && (member.status && member.status === _filters.status)) {
          trueCount++;
        }

        // Filter on admin
        //  && (member.isAdmin === _filters.admin)
        if (_filters.admin && _filters.admin !== "") {
          if (member.isAdmin === true && _filters.admin === true) {
            trueCount++;
          } else if (_filters.admin === false && (member.isAdmin === false || member.isAdmin === null)) {
            trueCount++;
          }

        }

        if (trueCount === filtersCount) {
          return true;
        }

      });

    }


    if (!displayMembers || displayMembers.length == 0) {
      $("#members-wrapper").html(noMembersDOM());
      stent.loader.hide();
      return;
    }

    $("#members-wrapper").html(
      `
      <table class="table table-hover table-vcenter mb-0 stent-table">
        <thead>
          <tr class="d-flex">
            <th class="col-6"><span>Ambassador</span></th>
            <th class="col-2 text-right pr-5"><span>SSI</span></th>
            <th class="col-2 pl-5"><span>ACCOUNT TYPE</span></th>
            <th class="col-1 text-right"><span>ACTIVE</span></th>
            <th class="col-1 text-right"><span>ACTIONS</span></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      `
    );

    $("#members-wrapper tbody").append(displayMembers.map(memberRow).join(""));

    // Add members management
    updateAddMember();

    stent.loader.hide();
  };

  const memberRow = function (member) {

    /*
    hasSalesNavigator: true, []                                                                                       => SalesNavigator
    hasSalesNavigator: true, null                                                                                     => SalesNavigator
    hasSalesNavigator: true, {planType: "BUSINESS", planStatus: "ACTIVE", paidThroughAt: "1589979218000"}             => SalesNavigator (BUSINESS) + ACTIVE
    hasSalesNavigator: true, {planType: "SALES_NAV_PRO", planStatus: "ACTIVE", paidThroughAt: "1589666776000"}        => SalesNavigator (SALES_NAV_PRO) + ACTIVE
    hasSalesNavigator: true, {planType: "SALES_NAV_PRO", planStatus: "IOS_PURCHASED", paidThroughAt: "1589140982000"} => SalesNavigator (SALES_NAV_PRO) + ACTIVE
    hasSalesNavigator: true, {planType: "SALES_NAV_PRO", planStatus: "CANCELLED", paidThroughAt: "1589650671000"}     => SalesNavigator (SALES_NAV_PRO) + CANCELED
    hasSalesNavigator: true, {planType: "SALES_NAV_TEAM", planStatus: "SUSPENDED", paidThroughAt: "1610485712000"}     => SalesNavigator (SALES_NAV_TEAM) + SUSPENDED
    hasSalesNavigator: true, {planType: "LEARNING", planStatus: "ACTIVE", paidThroughAt: "1591806827000"}             => SalesNavigator (LEARNING) + ACTIVE

    hasSalesNavigator: false, []                                                                                      => LinkedIn
    hasSalesNavigator: false, null                                                                                    => LinkedIn

    hasSalesNavigator: false, {planType: "BUSINESS", planStatus: "ACTIVE", paidThroughAt: "1619963269000"}            => Premium (BUSINESS) + ACTIVE
    hasSalesNavigator: false, {planType: "BUSINESS", planStatus: "IN_FREE_TRIAL", paidThroughAt: "1590058316000"}     => Premium (BUSINESS) + IN_FREE_TRIAL

    hasSalesNavigator: false, {planType: "CAREER", planStatus: "ACTIVE", paidThroughAt: "1589931151000"}              => Carreer + ACTIVE
    hasSalesNavigator: false, {planType: "CAREER", planStatus: "CANCELLED", paidThroughAt: "1590005707000"}           => Carreer + CANCELED
    hasSalesNavigator: false, {planType: "CAREER", planStatus: "IN_FREE_TRIAL", paidThroughAt: "1590778734000"}       => Carreer + FREE_TRIAL

    hasSalesNavigator: false, {planType: "RECRUITER_LITE", planStatus: "ACTIVE", paidThroughAt: "1590587405000"}      => Recruiter (RECRUITER_LITE) + ACTIVE

    FALLBACK => LinkedIn + UNKNOWN
    */

    let subscription = {
      label: {
        icon: "icon-linkedin.svg",
        tooltip: "LinkedIn standard"
      },
      status: {
        class: null,
        tooltip: "Unknown"
      }
    };

    // SALES NAVIGATOR
    if (member.hasSalesNavigator) {

      subscription.label.icon = "icon-salesnav.svg";

      if (typeof member.subscriptions !== "undefined" && member.subscriptions !== null && member.subscriptions.length > 0) {
        subscription.label.tooltip = "Sales Navigator (" + member.subscriptions[0].planType + ")";
      } else {
        subscription.label.tooltip = "Sales Navigator";
      }

      if (typeof member.subscriptions !== "undefined" && member.subscriptions !== null && member.subscriptions.length > 0) {
        if (member.subscriptions[0].planStatus) {
          /*
          ACTIVE
          IN_FREE_TRIAL
          CANCELLED
          IOS_PURCHASED
          SUSPENDED
          */
          subscription.status.tooltip = member.subscriptions[0].planStatus;

          if (member.subscriptions[0].planStatus === "ACTIVE") {
            subscription.status.class = "active";
          } else if (member.subscriptions[0].planStatus === "IN_FREE_TRIAL") {
            subscription.status.class = "trial";
          } else if (member.subscriptions[0].planStatus === "CANCELLED") {
            subscription.status.class = "canceled";
          } else if (member.subscriptions[0].planStatus === "IOS_PURCHASED") {
            subscription.status.class = "ios_purchased";
          } else if (member.subscriptions[0].planStatus === "SUSPENDED") {
            subscription.status.class = "suspended";
          }
        } else {
          subscription.status.class = null;
        }
      } else {
        subscription.status.class = null;
      }


      // eslint-disable-next-line brace-style
    }

    // OTHERS
    else {

      if (typeof member.subscriptions !== "undefined" && member.subscriptions !== null && member.subscriptions.length > 0) {

        if (member.subscriptions[0].planType === "BUSINESS") {
          subscription.label.icon = "icon-premium.svg";
          subscription.label.tooltip = "LinkedIn Premium";
        } else if (member.subscriptions[0].planType === "CAREER") {
          subscription.label.icon = "icon-career.svg";
          subscription.label.tooltip = "LinkedIn Premium Career";
        } else if (member.subscriptions[0].planType === "RECRUITER_LITE") {
          subscription.label.icon = "icon-recruiter.svg";
          subscription.label.tooltip = "LinkedIn Recruiter (" + member.subscriptions[0].planType + ")";
        }

      }

      if (typeof member.subscriptions !== "undefined" && member.subscriptions !== null && member.subscriptions.length > 0) {
        if (member.subscriptions[0].planStatus) {
          /*
          ACTIVE
          IN_FREE_TRIAL
          CANCELLED
          IOS_PURCHASED
          SUSPENDED
          */
          subscription.status.tooltip = member.subscriptions[0].planStatus;

          if (member.subscriptions[0].planStatus === "ACTIVE") {
            subscription.status.class = "active";
          } else if (member.subscriptions[0].planStatus === "IN_FREE_TRIAL") {
            subscription.status.class = "trial";
          } else if (member.subscriptions[0].planStatus === "CANCELLED") {
            subscription.status.class = "canceled";
          } else if (member.subscriptions[0].planStatus === "IOS_PURCHASED") {
            subscription.status.class = "ios_purchased";
          } else if (member.subscriptions[0].planStatus === "SUSPENDED") {
            subscription.status.class = "suspended";
          }
        } else {
          subscription.status.class = null;
        }
      } else {
        subscription.status.class = null;
      }

    }

    /*eslint-disable*/
    return `
      <tr class="stent-member d-flex" data-item-id="${member.id}">
        
        <!-- NAME -->
        <td class="col-6">
          <div class="row align-items-center no-gutters" style="flex: 1;">
            <div class="col-auto">
              <a href="./dashboard-user?id=${member.id}">
                <img
                  src="${member.pictureUrl == null ? "/assets/img/avatars/profiles/default-avatar.gif" : member.pictureUrl
      }"
                  class="avatar mr-3"
                  onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'"
                />
                ${member.blocking && (member.blocking.invite === true || member.blocking.nurture === true || member.blocking.api === true) ?
        `<img 
                    data-toggle="tooltip" 
                    title="This member is restricted. Weekly invites count limit reached." 
                    src="/assets/img/campaigns/blocked-outline.svg" class="status-member-icon" />`
        : ``
      }
              </a>
            </div>
            <div class="col">
              <h2>
                ${member.firstName} ${member.lastName}<a
                  data-toggle="tooltip"
                  title="View the dashboard of ${member.firstName} ${member.lastName}"
                  href="./dashboard-user?id=${member.id}"
                  ><span class="fe fe-trending-up ml-2 text-primary"></span
                ></a>
              </h2>
              <p class="member-headline">${member.headline ? member.headline : ''}</p>
            </div>
            
            ${member.isConnected === false ?
        `<div class="col-auto pr-2 pl-3" id="send-notification-wrapper">
              <div class="d-flex">
                <img src="/assets/img/warning.svg" class="pr-2" /> Ambassador is disconnected
              </div>
              <button data-user-id="${member.id}" class="btn btn-sm btn-primary mt-1 send-notification">Send a notification</button>
            </div>` : ``}

          </div>
        </td>
        
        <!-- SSI -->
        <td class="col-2 pr-5 justify-content-end ssi-wrapper">

          <h3>
            ${member.ssi > 0
        ? member.ssi
          .toFixed(2)
          .toString()
          .split(".")[0]
        : "-"
      }
          </h3>

          <small>
            .${member.ssi > 0
        ? member.ssi
          .toFixed(2)
          .toString()
          .split(".")[1]
        : ""
      }
          </small>
          
          <div class="ssi-jauge-wrapper">${SSIDOM(member.ssi)}</div>
          
        </td>

        <!-- ACCOUNT TYPE -->
        <td class="col-2 pl-5">

            <div class="subscription-wrapper" >
              <img class="subscription-icon" data-toggle="tooltip" title="${subscription.label.tooltip}" src="/assets/img/members/${subscription.label.icon}" />
              ${subscription.status.class ?
        `<div class="subscription-status ${subscription.status.class}" data-toggle="tooltip" title="${subscription.status.tooltip}"></div>`
        : ""
      }
            </div>

        </td>

        <!-- ACTIVE -->
        <td class="col-1 justify-content-end">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input switch-member-status" id="switch-member-status_${member.id
      }" ${member.status.toLowerCase() === "active" ? "checked='checked'" : ""} />
            <label class="custom-control-label" for="switch-member-status_${member.id}"></label>
          </div>
        </td>
        
        <!-- ACTIONS -->
        <td class="col-1 justify-content-end">
          
          <a href="#" class="flex-row align-items-center open-actions" role="button" data-toggle="dropdown">
            <img src="/assets/img/dots-dark.png" />
          </a>
          <div class="dropdown-menu dropdown-menu-right">
              <a 
                class="dropdown-item remove-member-to-tenant"
                id="${member.id}" 
                data-toggle="modal" data-target=".confirm-remove-member" href="#">
                <i class="fe fe-alert-octagon"></i> Remove
              </a>
            </div>
          </div>

        </td>
      </tr>
    `;
    /*eslint-enable*/
  };

  const loadMembersSearch = function (query) {
    stent.loader.show(".card-body", 10000);
    stent.ajax.getRest("/tenants/" + stent.tenant.key + "/members/" + query, buildMembersSearchResults);
  };

  // Callback method called by the search feature
  const buildMembersSearchResults = function (members) {
    stent.loader.hide();

    if (members.length == 0) {
      $("#tenantMembersResult").html(`
        <li class='list-group-item px-0'>
          <div class="alert alert-warning" role="alert">
            No member found
          </div>
        </li>
      `);
      return;
    }

    var html = members.map(memberSlotSearchResultDOM).join("");
    $("#tenantMembersResult").html(html);
  };

  const memberSlotSearchResultDOM = function (member) {
    var memberData = btoa(unescape(encodeURIComponent(JSON.stringify(member))));

    return `
    <li class="list-group-item px-0">
      <div class="row align-items-center">
        <div class="col-auto">
          <span class="avatar">
            <img 
              src="${member.pictureUrl == null ? "/assets/img/avatars/profiles/default-avatar.gif" : member.pictureUrl}" 
              class="avatar-img rounded-circle" 
              onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'"
            >
          </span>
        </div>
        <div class="col ml-n2">
          <h4 class="mb-1 name">
            <span>${member.firstName} ${member.lastName}</span>
          </h4>
          <p class="small mb-0">${member.headline}</p>
        </div>
        <div class="col-auto">
          <button 
            class="btn btn-sm btn-white add-member-to-tenant" 
            data-item="${memberData}" 
            data-item-id="${member.id}"
          >
            Add
          </button>
        </div>
      </div>
    </li>`;
  };

  const bindEvents = function () {


    // Bind the Keyup event on the search input
    $("#memberSearch")
      .off("keyup")
      .on("keyup", function (e) {
        let query = $.trim($(this).val());
        if (e.keyCode == 13 && query.length > 0) {
          loadMembersSearch(query);
        }
      });

    $("#membersPicker .fe-search")
      .off("click")
      .on("click", function (e) {
        let query = $.trim($("#memberSearch").val());
        loadMembersSearch(query);
      });

    // Copy invitation link in clipboard
    $("#copyInvitationLink")
      .off("click")
      .on("click", function () {
        var textBox = document.getElementById("invitationLink");
        textBox.select();
        if (document.execCommand("copy") === true) {
          stent.toast.success("Invitation link was copied!");
        } else {
          stent.toast.error("Error when copying the invitation link.");
        }
        textBox.blur();
      });

    // Add user to tenant
    $("body")
      .off("click", ".add-member-to-tenant")
      .on("click", ".add-member-to-tenant", async function () {

        if (!_canAddMembers) {
          alert("Your ambassadors quota is full. Please upgrade your plan to add new ambassadors.");
          return;
        }

        var _this = $(this);
        var identityKey = _this.data("item-id");
        var clonedButton = _this.clone();

        // Disable the button
        _this
          .attr("disabled", "disabled")
          .html("<span class=\"spinner-grow spinner-grow-sm\" role=\"status\" aria-hidden=\"true\"></span>");

        let query = `
        mutation {
          workspaceContext {
            addMember(identities: [{ id: "${identityKey}" }]) {
              members {
                email
                firstName
                status
              }
            }
          }
        }`;

        var fetchAddMemberStatus = await stent.ajax.getApiAsync(query, "POST");

        if (fetchAddMemberStatus.ok && (fetchAddMemberStatus.message && !fetchAddMemberStatus.message.errors)) {
          _members = await getMembers();
          _this.remove();
          buildMembersList();
        } else {
          // ERROR ON FETCH
          setTimeout(function () {
            // Enable the button
            _this.replaceWith(clonedButton);
            stent.toast.danger("Error when trying to add the member. Please try again.");
          }, 100);
        }

      });

    // Change user status
    $("body")
      .off("click", ".switch-member-status")
      .on("click", ".switch-member-status", async function () {

        stent.loader.show(".main-content");

        var _this = $(this);
        var identityKey = _this.closest("[data-item-id]").data("item-id");
        var memberNewStatus = _this.is(":checked") ? "ACTIVE" : "DISABLED";

        let query = `
        mutation {
          workspaceContext {
            changeMemberStatus(input: { id: "${identityKey}", status: ${memberNewStatus} }) {
              member {
                email
                status
              }
            }
          }
        }`;

        var fetchSwitchMemberStatus = await stent.ajax.getApiAsync(query, "POST");

        if (fetchSwitchMemberStatus.ok && (fetchSwitchMemberStatus.message && !fetchSwitchMemberStatus.message.errors)) {
          stent.loader.hide();
          getMember(identityKey).status = memberNewStatus;
          buildMembersList();
        } else {
          // ERROR ON FETCH
          setTimeout(function () {
            $("#switch-member-status_" + identityKey).prop("checked", memberNewStatus === "active" ? false : true);
            stent.toast.danger("Error when trying to switch the ambassador status. Please try again.");
            buildMembersList();
            stent.loader.hide();
          }, 500);
        }

      });

    // Remove user from tenant
    $("body")
      .off("click", ".remove-member-to-tenant")
      .on("click", ".remove-member-to-tenant", function () {
        _identityId = $(this)
          .closest("[data-item-id]")
          .data("item-id");
      });

    // Confirm popup to remove a member
    $(".confirm-button")
      .off("click")
      .on("click", async function () {

        stent.loader.show(".modal-content");

        var identityKey = _identityId;
        _identityId = "";

        let query = `
        mutation {
          workspaceContext {
            changeMemberStatus(input: { id: "${identityKey}", status: ARCHIVE }) {
              member {
                email
                status
              }
            }
          }
        }`;

        var fetchRemoveMemberStatus = await stent.ajax.getApiAsync(query, "POST");

        if (fetchRemoveMemberStatus.ok && (fetchRemoveMemberStatus.message && !fetchRemoveMemberStatus.message.errors)) {
          $("[data-item-id='" + identityKey + "']").remove();
          // Remove in memory
          _members = _members.filter(member => member.id !== identityKey);
          buildMembersList();
          identityKey = "";
          stent.loader.hide(".modal-content");
          $(".confirm-remove-member").modal("hide");
        } else {
          // ERROR ON FETCH
          setTimeout(function () {
            stent.toast.danger("Error when trying to remove the ambassador. Please try again.");
            stent.loader.hide(".modal-content");
          }, 500);
        }

      });

    $(".filter-table")
      .off("change")
      .on("change", function () {
        if ($(this).val() !== "") {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }
        buildMembersList();
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
        buildMembersList();
      });

    $(".send-notification")
      .off("click")
      .on("click", function () {
        let memberId = $(this).attr("data-user-id");
        sendNotification(memberId);
      });

    // when popup opens
    $("#membersPicker").on("show.bs.modal", async function () {
      // If user is not wildcard, remove the column to search a ambassador
      if (stent.auth.isWilcard() === false) {
        $("#colSearchMembers").remove();
        $("#colInviteMember").removeClass("col-6").removeClass("pl-5").addClass("col");
      }
    });

    // when popup opens
    $("#membersPicker").on("shown.bs.modal", async function () {
      stent.loader.show(".card-body", 10000);

      let invitationLink = await getInvitationLink();

      if (!invitationLink) {
        $("#formInvitationLink").addClass("d-none");
        $("#formInvitationLinkErrorGet").removeClass("d-none");
      } else {
        $("#invitationLink").val(stent.api.auth + "/invites/" + invitationLink);
      }

      if (stent.auth.isWilcard() === true) {
        $("#tenantMembersResult").html("");
      }

      stent.loader.hide();

      if (stent.auth.isWilcard() === true) {
        document.getElementById("memberSearch").focus();
      }

    });

    // when popup close
    $("#membersPicker").on("hidden.bs.modal", function () {
      $("#formInvitationLink").removeClass("d-none");
      $("#formInvitationLinkErrorGet").addClass("d-none");
      $("#formInvitationLinkErrorRevoke").addClass("d-none");
      $("#tenantMembersResult").html("");
      $("#memberSearch").val("");
    });


    $("#revokeInvitationLink")
      .off("click")
      .on("click", async function () {

        if (window.confirm("Are you sure you want to revoke the invitation link ? The old link will not work if you confirm.")) {
          stent.loader.show(".card-body", 10000);

          $("#formInvitationLinkErrorRevoke").addClass("d-none");

          let doChangeInviteCode = await changeInviteCode();

          if (doChangeInviteCode !== true) {
            $("#formInvitationLinkErrorRevoke").removeClass("d-none");
            stent.loader.hide();
            return;
          }


          let invitationLink = await getInvitationLink();

          if (!invitationLink) {
            $("#formInvitationLink").addClass("d-none");
            $("#formInvitationLinkErrorGet").removeClass("d-none");
          } else {
            $("#invitationLink").val(stent.api.auth + "/invites/" + invitationLink);
          }

          stent.loader.hide();
        }

      });
  };

  const init = async function () {

    // Active corresponding menu
    stent.navbar.activeMenu("ambassadors");

    // change page title
    stent.ui.setPageTitle("Ambassadors");

    stent.loader.show(".main-content");

    _members = await getMembers();
    await initSubscription();

    if (_members !== null) {
      buildMembersList();
      bindEvents();
      stent.loader.hide();
    } else {
      stent.loader.hide();
    }

  };

  init();

  return {
    get: function () {
      return {
        _members,
        _subscription
      };
    },
    unlockAddMember,
    lockAddMember
  };

})();
