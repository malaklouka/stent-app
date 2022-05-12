"use strict";

stent.requireJS(["tooltip"], function () {

  let _totalCount = null;
  let _offset = 0;
  let _limit = 50;

  let _filters = {
    ownerId: "tenant",
    segmentId: null,
    name: null
  };

  const getOwners = async function () {

    let fetchOwners = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/members");

    if (fetchOwners && fetchOwners.ok && fetchOwners.message) {
      return fetchOwners.message;
    } else {
      stent.toast.danger("Error when trying to fetch the owners. Please refresh the page to try again.");
      return null;
    }

  };

  const getSegments = async function () {

    let selectedOwner = $("#filter-table-owner").val();
    if (selectedOwner !== "tenant") {
      selectedOwner = selectedOwner.replace("identities/", "");
    }

    let fetchSegments = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/segments/owners/" + selectedOwner);

    if (fetchSegments && fetchSegments.ok && fetchSegments.message) {
      return fetchSegments.message;
    } else {
      stent.toast.danger("Error when trying to fetch the segments. Please refresh the page to try again.");
      return null;
    }
  };

  const getContacts = async function () {

    let fetchContacts = await stent.ajax.getRestAsync("/tenants/" +
      stent.tenant.key +
      "/contacts?filters=" +
      encodeURIComponent(JSON.stringify(_filters)) +
      "&offset=" + _offset +
      "&limit=" + _limit
    );

    if (fetchContacts && fetchContacts.ok && fetchContacts.message) {
      return fetchContacts.message;
    } else {
      stent.toast.danger("Error when trying to fetch the contacts.");
      return null;
    }

  };

  const getContactsCount = async function () {

    let fetchContactsCount = await stent.ajax.getRestAsync("/tenants/" +
      stent.tenant.key +
      "/contacts/count?filters=" +
      encodeURIComponent(JSON.stringify(_filters)));

    if (
      fetchContactsCount &&
      fetchContactsCount.ok &&
      fetchContactsCount.message &&
      typeof fetchContactsCount.message.count !== undefined
    ) {
      return fetchContactsCount.message.count;
    } else {
      stent.toast.danger("Error when trying to fetch the contacts count.");
      return null;
    }

  };

  const initFilters = async function () {

    let _owners = await getOwners();
    let _segments = await getSegments();

    populateOwnersFilterSelect(_owners);
    populateSegmentFilterSelect(_segments);

  };

  const populateOwnersFilterSelect = function (owners) {
    owners.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
    owners.forEach(function (owner) {
      let option = new Option(owner.firstName + " " + owner.lastName, "identities/" + owner.id);
      $("#filter-table-owner").append($(option));
    });
  };

  const populateSegmentFilterSelect = function (segments) {

    $("#filter-table-segment").html("");

    let option = new Option("Segment", "");
    $("#filter-table-segment").append($(option));

    segments.forEach(function (segment) {
      option = new Option(segment.name, segment._id);
      $("#filter-table-segment").append($(option));
    });

  };

  const resetFilters = function () {

    $("#filter-table-name").val("").removeClass("active");
    $("#filter-table-owner").val("tenant").removeClass("active");
    $("#filter-table-segment").val("").removeClass("active");

    _filters = {
      ownerId: $("#filter-table-owner").val(),
      segmentId: $("#filter-table-segment").val(),
      name: $("#filter-table-name").val()
    };

  };

  const setFilters = function () {

    _filters = {
      ownerId: $("#filter-table-owner").val(),
      segmentId: $("#filter-table-segment").val(),
      name: $("#filter-table-name").val()
    };

    if (_filters.ownerId + _filters.name + _filters.segmentId === "tenant") {
      $("#filter-reset").addClass("d-none");
    } else {
      $("#filter-reset").removeClass("d-none");
    }

  };

  const buildContactsLists = function (results, count) {

    if (typeof count !== "undefined" && count !== null) {
      _totalCount = count;

      if (_totalCount === 0) {
        $("#contacts-count").addClass("d-none");
        $("#contacts-table-wrapper").addClass("d-none");
        $("#no-contacts-error-wrapper").removeClass("d-none");
      } else if (_totalCount === 1) {
        $("#contacts-count").removeClass("d-none");
        $("#contacts-table-wrapper").removeClass("d-none");
        $("#no-contacts-error-wrapper").addClass("d-none");
        $("#contacts-count").html("1 result");
      } else {
        $("#contacts-count").removeClass("d-none");
        $("#contacts-table-wrapper").removeClass("d-none");
        $("#no-contacts-error-wrapper").addClass("d-none");
        $("#contacts-count").html(_totalCount.toLocaleString("en-US") + " results");
      }
    }

    if (results.length === 0 && _offset === 0) {
      $("#contacts-table-wrapper tbody").html("");
      return;
    }

    let html = "";

    results.forEach(contact => {
      html += contactDOM(contact);
    });

    $("#contacts-table-wrapper tbody").append(html);

    if (results.length === 0 && _offset > 0) {
      unbindScroll();
    } else {
      bindScroll();
    }

  };

  const contactDOM = function (contact) {
    return `
        <tr data-item-id="${contact._key}" class="a-contact">
          <td>
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="avatar">
                  <img 
                    src="${contact.pictureUrl == null ? "/assets/img/avatars/profiles/default-avatar.gif" : contact.pictureUrl}" 
                    onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" 
                    class="avatar-img rounded-circle" />
                </span>
              </div>
              <div class="col">
                <h4 class="mb-1 name">${contact.firstName} ${contact.lastName}</h4>
                <p class="small mb-0">${contact.headline}</p>
              </div>
            </div>
          </td>
        </tr>
      `;
  };

  const bindEvents = function () {
    $("#stent-contacts")
      .off("click", ".a-contact")
      .on("click", ".a-contact", function () {

        $(".a-contact.selected").removeClass("selected");
        $(this).addClass("selected");

        var contactKey = $(this).data("itemId");
        stent.contact.open(contactKey);
      });

    $("#filter-table-name")
      .off("keyup")
      .on("keyup", function (evt) {
        if (evt.keyCode === 13) {
          $(this).blur();
        }
      });

    $(".filter-table")
      .off("change")
      .on("change", async function () {

        if ($(this).val() !== "" && $(this).val() !== "tenant") {
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }

        _totalCount = null;

        unbindScroll();
        $("#contacts-table-wrapper tbody").html("");
        $("#contacts-count").addClass("d-none");

        showLoader();
        setFilters();
        _offset = 0;

        let contacts = await getContacts();
        let contactsCount = await getContactsCount();

        buildContactsLists(contacts, contactsCount);
        stent.loader.hide();

      });

    $("#filter-table-owner")
      .off("change.updateSegments")
      .on("change.updateSegments", async function () {

        let _segments = await getSegments();
        populateSegmentFilterSelect(_segments);

      });

    $("#filter-reset")
      .off("click")
      .on("click", async function () {

        _totalCount = null;
        unbindScroll();
        $("#contacts-table-wrapper tbody").html("");
        $("#contacts-count").addClass("d-none");

        showLoader();
        resetFilters();
        _offset = 0;

        let contacts = await getContacts();
        let contactsCount = await getContactsCount();

        buildContactsLists(contacts, contactsCount);
        stent.loader.hide();

      });


  };

  const bindScroll = function () {
    $(window)
      .off("scroll")
      .on("scroll", async function () {

        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
          unbindScroll();

          showLoader();

          _offset = _offset + _limit;

          let contacts = await getContacts();
          buildContactsLists(contacts);
          stent.loader.hide();

        }

      });
  };

  const unbindScroll = function () {
    $(window).off("scroll");
  };

  const showLoader = function () {
    stent.loader.show("#stent-contacts");
  };

  const init = async function () {

    // Active corresponding menu
    stent.navbar.activeMenu("contacts");

    // change Page title
    stent.ui.setPageTitle("Contacts");

    bindEvents();

    // filters
    showLoader();

    await initFilters();

    let contacts = await getContacts();
    let contactsCount = await getContactsCount();

    buildContactsLists(contacts, contactsCount);

    stent.loader.hide();

  };

  init();
});