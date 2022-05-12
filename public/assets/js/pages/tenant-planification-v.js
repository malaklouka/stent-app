"use strict";

stent.requireJS(["fullcalendar", "flatpickr"], function () {

  let _calendar;
  let _calendarEl;
  let _currentEvent = null;
  let _corpPages = [];
  // let _eventLinkedInStyle = ;
  let _eventsStyles = {
    newsfeed: {
      backgroundColor: "rgb(112,46,234)",
      textColor: "rgb(255,255,255)"
    },
    publish: {
      backgroundColor: "rgb(0,108,172)",
      textColor: "rgb(255,255,255)"
    },
    page: {
      backgroundColor: "rgb(36,54,65)",
      textColor: "rgb(255,255,255)"
    }
  };
  let _identities = null;
  let _groups = null;

  let _calendarConfig = {
    plugins: ["interaction", "list", "dayGrid"],
    timeZone: "UTC",
    height: 850,
    columnHeaderFormat: {
      weekday: "long",
    },
    fixedWeekCount: false,
    header: {
      left: "prev,title,next",
      center: "",
      right: "listMonth,dayGridWeek,dayGridMonth"
    },
    editable: false,
    eventLimit: true // allow "more" link when too many events
  };

  let maxMessageLength = 3000;

  const initCalendar = function () {

    _calendarEl = document.getElementById("planification-calendar");

    _calendar = new FullCalendar.Calendar(
      _calendarEl,
      {
        ..._calendarConfig,
        ...{
          events: function (info, successCallback, failureCallback) {

            stent.loader.show(".main-content");

            let query = `
              query {
                media {
                  getTenantRecommendations(
                    tenantId: "tenants/${stent.tenant.key}"
                    start: "${info.start.getTime()}"
                    end: "${info.end.getTime()}"
                  ) {
                    defaultMessage
                    start
                    end
                    audiences
                    destination
                    approval
                    visibility
                    correlationId
                    locked
                    doNotResend
                    origin {
                      type
                      actor
                      name
                    }
                    media {
                      id
                      title
                      summary
                      thumbnailUrl
                      publishedAt
                      content {
                        url
                        type
                      }
                    }
                  }
                }
              }
            `;

            stent.ajax.getGraphQL(query,

              // Success function on getting planifications
              function (response) {

                // Error when loading events
                if ((response.errors && response.errors.length > 0) && !response.data) {
                  if (stent.log) {
                    stent.konsole.group("getEvents");
                    stent.konsole.error({ response: response });
                    stent.konsole.endGroup();
                  }
                  failureCallback(response);
                  stent.loader.hide();
                  displayErrorEvents();
                  $("#add-planification-button").hide();
                  return;
                }

                let events = [];

                if (response && response.data && response.data.media && response.data.media.getTenantRecommendations && response.data.media.getTenantRecommendations.length > 0) {
                  events = [...events, ...response.data.media.getTenantRecommendations];
                }

                if (stent.log) {
                  stent.konsole.group("events");
                  stent.konsole.log({ data: events });
                  stent.konsole.endGroup();
                }

                stent.loader.hide();

                successCallback(
                  events.map(
                    function (event) {

                      let color = _eventsStyles["newsfeed"].backgroundColor;
                      let textColor = _eventsStyles["newsfeed"].textColor;

                      if (event.destination && event.destination === "publish") {
                        color = _eventsStyles["publish"].backgroundColor;
                        textColor = _eventsStyles["publish"].textColor;

                        if (event.origin && event.origin.type && event.origin.type === "ORGANIZATION") {
                          color = _eventsStyles["page"].backgroundColor;
                          textColor = _eventsStyles["page"].textColor;
                        }
                      }

                      return {
                        title: event.media.title,
                        start: event.start,
                        end: event.end,
                        color: color,
                        textColor: textColor,
                        data: event
                      };
                    }
                  )
                );
              },

              // Error function on getting planifications
              function (response) {
                if (stent.log) {
                  stent.konsole.group("Error function on getting planifications");
                  stent.konsole.error({ response: response });
                  stent.konsole.endGroup();
                }
                failureCallback(response);
                stent.loader.hide();
                displayErrorEvents();
                $("#add-planification-button").hide();
              }
            );

          },

          eventRender: function (info) {
            let $el = $(info.el);
            let event = info.event;
            let props = (event.extendedProps && event.extendedProps.data) ? event.extendedProps.data : {};
            let type = props.media.content.type;
            let audiences = props.audiences;
            let audiencesHTML = "";
            let audienceHasTenant = audiences.includes("tenants/" + stent.tenant.key);
            let countAudienceUsers = 0;
            let countAudienceGroups = 0;
            for (let i = 0; i < audiences.length; i++) {
              if (audiences[i].startsWith("identities/")) {
                countAudienceUsers++;
              } else if (audiences[i].startsWith("groups/")) {
                countAudienceGroups++;
              }
            }

            if (audienceHasTenant) {
              audiencesHTML += "<span class=\"mr-2 ml-2\"><img src=\"/assets/img/tenant.svg\" class=\"audience-image mr-1\" /> Workspace</span>";
            }

            if (countAudienceUsers > 0) {
              audiencesHTML += "<span class=\"mr-2 ml-2\"><img src=\"/assets/img/user.svg\" class=\"audience-image mr-1\" />";
              audiencesHTML += countAudienceUsers + (countAudienceUsers > 1 ? " Ambassadors" : " Ambassador");
              audiencesHTML += "</span>";
            }

            if (countAudienceGroups > 0) {
              audiencesHTML += "<span class=\"mr-2 ml-2\"><img src=\"/assets/img/group.svg\" class=\"audience-image mr-1\" />";
              audiencesHTML += countAudienceGroups + (countAudienceGroups > 1 ? " Groups" : " Group");
              audiencesHTML += "</span>";
            }

            let displayedImage = "/assets/img/media/no-pic.gif";
            if (type === "article" && props.media && props.media.thumbnailUrl) {
              displayedImage = props.media.thumbnailUrl;
            } else if (type === "image" && props.media && props.media.content && props.media.content.url) {
              displayedImage = props.media.content.url;
            } else if (type === "document") {
              displayedImage = "/assets/img/media/no-document.gif";
            } else if (type === "video") {
              displayedImage = "/assets/img/media/no-video.gif";
            } else if (type === "post") {
              displayedImage = "/assets/img/media/no-post.gif";
            }

            let html = `
              <div class="planification-tooltip-wrapper">
                <div
                  class="planification-tooltip-wrapper-image" 
                  style="background-image: url('${displayedImage}'), url('/assets/img/media/no-pic.gif');">
                </div>
                <h4 class="title">${event.title ? event.title : ""}</h4>
                <p class="summary">${props.media && props.media.summary ? props.media.summary : ""}</p>
                <div class="extras">${audiencesHTML}</div>
              </div>
            `;

            $el.attr("data-toggle", "tooltip");
            $el.attr("data-html", "true");
            $el.attr("data-delay", 1000);
            $el.attr("data-id", props.id ? props.id : "");
            $el.attr("data-correlation-id", props.correlationId ? props.correlationId : "");
            $el.attr("data-container", "#planification-calendar");
            $el.attr("title", html);

          },

          dateClick: function (info) {
            if (!dateIsInthePast(info.dateStr) && !dateIsToday(info.dateStr)) {
              openMediaPopup(info);
            }
          },

          eventClick: function (info) {
            openMediaPopup(info);
          }
        }
      }
    );

    _calendar.render();
  };

  const cleanImagePreviewZone = function () {
    $("#media-id-preview").find("a").attr("href", "");
    $("#media-id-preview").find(".mediaImageWrapper img").attr("src", "");
    $("#media-id-preview").find(".aMedia .text-muted").html("");
    $("#media-id-preview").find(".aMedia .media-title").html("");
    $("#media-id-preview").find(".aMedia .media-summary").html("");
  };

  const cleanForm = function () {

    $(".is-required").show();
    $(".new-item").show();
    $(".edit-item").hide();

    $("#media-id").show();
    $("#media-id")[0].selectedIndex = 0;
    cleanImagePreviewZone();
    $("#media-id-preview").addClass("d-none");
    $("#start-date").val("");
    $("#end-date").val("");
    stent.flatpickr.pickers["start-date"].setDate();
    stent.flatpickr.pickers["end-date"].setDate();

    $("#do-not-resend").prop("checked", true);
    $("#linkedin-message").val("");

    $("#newsfeed").prop("checked", true);
    $("#publish").prop("checked", false);
    $("#page").prop("checked", false);
    toggleLinkedInFields(false);

    $("#corp-page-form-group").hide();
    $("#do-not-resend-form-group").show();
    $("#public").removeAttr("disabled");
    $("#connections").removeAttr("disabled");
    $("input[name=visibility][value='connections']").prop("checked", true);

    $("#audiences-picker").removeAttr("disabled");
    $("#audiences-picker").attr("multiple", "multiple");
    $("#audiences-picker").select2({ allowClear: false, placeholder: "Please select at least one identity and/or a workspace" });
    $("#audiences-picker").off("select2:select");
    $("#audiences-picker").off("select2:clear");
    $("#audiences-picker").val(null).trigger("change");
    $("#corp-page").removeAttr("disabled");
    _corpPages = [];

    $("#needs-approbation").prop("checked", true);
    $("#needs-approbation-wrapper").hide();

    $("#all").prop("checked", false);
    $("#connections").prop("checked", true);

    $("#correlation-id").val("");

    cleanErrors();

  };

  const fillForm = async function () {

    let data = _currentEvent.event.extendedProps.data;

    if (stent.log) {
      stent.konsole.group("openMediaPopup");
      stent.konsole.log({ data });
      stent.konsole.endGroup();
    }

    let id = data.media.id;
    let destination = data.destination;
    let startDate = new Date(data.start);
    let audiences = data.audiences;
    let approval = data.approval;
    let visibility = data.visibility;
    let doNotResend = data.doNotResend;
    let correlationId = data.correlationId;
    let locked = data.locked;
    let corpPageId = "";

    if (data.origin) {
      corpPageId = data.origin.actor;
      if (data.origin.type && data.origin.type === "ORGANIZATION") {
        destination = "page";
      }
    }

    if (startDate) {
      startDate = data.start + startDate.getTimezoneOffset() * 60000;
    }
    let endDate = data.end !== 0 ? new Date(data.end) : null;
    if (endDate) {
      endDate = data.end + endDate.getTimezoneOffset() * 60000;
    }

    // Set destination
    $("[name='destination'][value='" + destination + "']").prop("checked", true);

    // Media
    $("#media-id [value=\"" + id + "\"]").prop("selected", true);
    updateMediaPreview(data.media);

    // destination is Locked by default in edition mode
    $("#destination-form-group .new-item").hide();
    $("#destination-form-group .edit-item").text(
      $("#destination-form-group .new-item [for='" + destination + "']").text()
    ).show();

    // start date
    stent.flatpickr.pickers["start-date"].setDate(startDate);

    // end date
    stent.flatpickr.pickers["end-date"].setDate(endDate);

    // Message
    $("#linkedin-message").val(data.defaultMessage);

    // Approbation
    if (destination === "publish" || destination === "page") {
      $("#needs-approbation").prop("checked", approval);

      if (startDate) {
        toggleAlertApprobation(new Date(startDate));
      }

    }

    // do not resend
    $("#do-not-resend").prop("checked", doNotResend);

    if (destination === "newsfeed") {
      toggleLinkedInFields(false);
      await toogleCorpFields(false);
    } else if (destination === "publish") {

      toggleLinkedInFields(true);
      await toogleCorpFields(false);
      if (visibility) {
        $("[name='visibility'][value='" + visibility + "']").prop("checked", true);
      }

    } else if (destination === "page") {

      toggleLinkedInFields(true);
      await toogleCorpFields(true);
      if (visibility) {
        $("[name='visibility'][value='" + visibility + "']").prop("checked", true);
      }
    }

    // Audiences
    $("#audiences-picker").val(audiences).change();

    // Set the corp page value
    if (destination === "page") {
      await onSelectIdentityForCorp($("#audiences-picker").val());
      $("#audiences-picker").attr("disabled", "disabled");
      $("#corp-page").val(corpPageId).change();
      $("#corp-page").attr("disabled", "disabled");
    } else {
      $("#audiences-picker").removeAttr("disabled");
      $("#corp-page").removeAttr("disabled");
    }

    // CorrelationId
    if (correlationId) {
      $("#correlation-id").val(correlationId);
    }

    if (locked) {
      lockFormEdition();
    }

  };

  const lockFormEdition = function () {

    $(".is-required").hide();
    $(".new-item").hide();
    $(".edit-item").show();

    /*
    In lock mode
    I block all fields, but the message
    */

    $("#media-id").hide();

    let start = moment(stent.flatpickr.pickers["start-date"].selectedDates[0]).format("YYYY-MM-DD HH:mm");
    let end = stent.flatpickr.pickers["end-date"].selectedDates[0] ?
      moment(stent.flatpickr.pickers["end-date"].selectedDates[0]).format("YYYY-MM-DD HH:mm")
      : null;
    $("#dates-form-group .edit-item").html((end ? "From " : "") + "<strong>" + start + "</strong>" + (end ? " to " + "<strong>" + end + "</strong>" : ""));

    let audiences = $("#audiences-picker").val();
    if (typeof audiences === "string") {
      audiences = [audiences];
    }
    let displayAudiences = audiences.map(function (item) {
      return $("#audiences-picker [value=\"" + item + "\"]").text();
    });
    $("#audiences-form-group .edit-item").text(displayAudiences.join(", "));

    let doNotResend = $("#do-not-resend").is(":checked");
    let doNotResendHtml = doNotResend ?
      "<span class=\"fe fe-check-circle text-success\" style=\"font-size: 24px;\"></span>"
      : "<span class=\"fe fe-slash text-danger\" style=\"font-size: 24px;\"></span>";
    $("#do-not-resend-form-group .edit-item").html(doNotResendHtml);

    let approval = $("#needs-approbation").is(":checked");
    let approvalHtml = approval ?
      "<span class=\"fe fe-check-circle text-success\" style=\"font-size: 24px;\"></span>"
      : "<span class=\"fe fe-slash text-danger\" style=\"font-size: 24px;\"></span>";
    $("#needs-approbation-form-group .edit-item").html(approvalHtml);

    let visibility = $("[name=\"visibility\"]:checked").val();
    $("#visibility-form-group .edit-item").text(visibility);

    // Corporative page
    $("#corp-page-form-group .edit-item").text($("#corp-page option:selected").text());

  };

  const openMediaPopup = async function (data) {

    _currentEvent = data;

    cleanForm();

    $("#add-planification-modal").modal();

    let medias = await getMedias();

    await fillMediasSelector(medias.message);

    _identities = await getIdentities();
    _identities.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));

    _groups = await getGroups();

    stent.loader.show(".modal-content");

    setTimeout(() => {
      populateAudiences();
      fillPopup();
    }, 250);

  };

  const getMedias = async function () {
    let query = `query {
      media {
        getAll(tenantId: "${stent.tenant.key}") {
          id
          title
          summary
          thumbnailUrl
          publishedAt
          shortLink
          content {
            type
            url
            fileName
          }
        }
      }
    }`;

    return stent.ajax.getGraphQLAsync(query); //TODO: move to API
  };

  const getCorpPages = async function (identity) {

    let fetchCorpPages = await stent.ajax.getRestAsync("/linkedin/" + identity + "/companies");

    if (fetchCorpPages && fetchCorpPages.ok && fetchCorpPages.message && fetchCorpPages.message.length > 0) {
      return fetchCorpPages.message;
    } else {
      stent.toast.danger("Error when trying to fetch the corporate pages. Please try again.");
      return [];
    }

  };

  const fillMediasSelector = async function (result) {

    if (stent.log) {
      stent.konsole.group("fillMediasSelector");
      stent.konsole.log({ response: result });
      stent.konsole.endGroup();
    }

    if (
      result &&
      result.data &&
      result.data.media &&
      result.data.media.getAll &&
      result.data.media.getAll.length > 0
    ) {

      $("#media-id").html("");

      let items = result.data.media.getAll;
      let types = {};

      // Build medias types array
      items.forEach(function (item) {
        let oldType = item.content && item.content.type ? item.content.type : "ArticleMedia";
        let type = oldType.charAt(0).toUpperCase() + oldType.slice(1) + "Media";

        if (!types[type]) {
          types[type] = [];
        }
        types[type].push(item);
      });


      for (const [key, value] of Object.entries(types)) {
        let optionGroup = document.createElement("OPTGROUP");
        optionGroup.label = stent.media.getMediaByKey(key).name;

        value.forEach(function (item) {
          let option = new Option(item.title, item.id);
          option = $(option);

          option.attr("data-type", key);
          option.attr("data-short-url", item.shortLink);
          option.attr("data-url", item.content && item.content.url ? item.content.url : "");
          option.attr("data-title", item.title);
          option.attr("data-summary", item.summary);
          option.attr("data-published-at", item.publishedAt);

          let thumbnailUrl = "/assets/img/media/no-article.gif";
          if (key === "article") {
            thumbnailUrl = item.thumbnailUrl;
          } else if (key === "image") {
            thumbnailUrl = item.content.url;
          } else if (key === "post") {
            thumbnailUrl = "/assets/img/media/no-post.gif";
          } else if (key === "video") {
            thumbnailUrl = "/assets/img/media/no-video.gif";
          } else if (key === "document") {
            thumbnailUrl = "/assets/img/media/no-document.gif";
          }

          option.attr("data-thumbnail-url", thumbnailUrl);

          optionGroup.appendChild(option[0]);

        });
        $("#media-id").prepend($(optionGroup));
      }

      let option = new Option("Please select a media", "");
      $("#media-id").prepend($(option));
      $("#media-id").val("");

    } else {

      $("#add-planification-modal #no-media-found").removeClass("d-none");
      $("#add-planification-modal form").addClass("d-none");
      $("#add-planification-modal .modal-footer").addClass("d-none");

      // No medium were found
      stent.loader.hide();

    }

    return;

  };

  const getIdentities = async function () {
    let fetchIdentities = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/members");
    if (fetchIdentities.ok && fetchIdentities.message.length > 0) {
      return fetchIdentities.message;
    } else {
      return [];
    }
  };

  const getGroups = async function () {
    let fetchGroups = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/groups");
    if (fetchGroups.ok && fetchGroups.message.length > 0) {
      return fetchGroups.message;
    } else {
      return [];
    }
  };


  const resetMinDates = function () {
    stent.flatpickr.pickers["start-date"].set("minDate", null);
    stent.flatpickr.pickers["end-date"].set("minDate", null);
  };

  const fillPopup = function () {

    resetMinDates();

    // DISPLAY PLANIFICATION
    if (_currentEvent && _currentEvent.event) {

      $("#add-planification-modal .modal-title").html("Edit a schedule");

      $("#close-popup").hide();
      $("#cancel-popup").show();
      $("#delete-planification").show();
      $("#save-planification").show();

      $("#needs-approbation-wrapper").show();
      $("#needs-approbation-alert-wrapper").hide();

      // Set the min start date to event.startDate

      setMinStartDate();
      stent.flatpickr.pickers["start-date"].set("onChange", onChangeStartDate);

      fillForm();

      setMinEndDate();

      // NEW PLANIFICATION
    } else {

      $("#add-planification-modal .modal-title").html("Schedule a post");

      $("#close-popup").hide();
      $("#cancel-popup").show();
      $("#delete-planification").hide();
      $("#save-planification").show();

      let startDate = _currentEvent ? _currentEvent.dateStr + " 09:00" : "";
      stent.flatpickr.pickers["start-date"].setDate(startDate);

      // Set the min start date to TODAY + 1 DAY
      setMinStartDate();
      stent.flatpickr.pickers["start-date"].set("onChange", onChangeStartDate);

      // If the user clicks on the calendar (instead of the button "Add planification")
      if (startDate) {
        toggleAlertApprobation(new Date(startDate));
        // Set min date on end date
        setMinEndDate();
      }
    }

    updateMaxCharCountDOM();

    stent.loader.hide();

  };

  const onChangeStartDate = function (date) {
    toggleAlertApprobation(date[0]);
    setMinEndDate();
  };

  const setMinStartDate = function () {

    let minDate;
    let shouldSetMinDate = true;

    $("#start-date").removeAttr("disabled");

    if (_currentEvent && _currentEvent.event) {

      let data = _currentEvent.event.extendedProps.data;
      let startDate = new Date(data.start);
      let days = moment(startDate).startOf("day").diff(moment().startOf("day"), "days", true);

      if (days <= 0) {
        shouldSetMinDate = false;
        $("#start-date").attr("disabled", "disabled");
      } else {
        minDate = new Date(data.start + startDate.getTimezoneOffset() * 60000);
        minDate = new Date(moment(minDate).format("YYYY/MM/DD") + " 00:00");
      }

    } else {
      minDate = moment().add(1, "days");
      minDate = new Date(minDate.format("YYYY/MM/DD") + " 00:00");
    }

    if (shouldSetMinDate) {
      stent.flatpickr.pickers["start-date"].set("minDate", minDate);
    }

  };

  // Set the min start date to TODAY + 1 HOUR
  const setMinEndDate = function () {
    let todayDate = $("#start-date").val();
    let minEndDate = moment(todayDate).add(1, "hours")._d;
    stent.flatpickr.pickers["end-date"].set("minDate", minEndDate);
  };

  const toggleAlertApprobation = function (date) {
    if (dateIsTomorrow(date)) {
      $("#needs-approbation-wrapper").hide();
      $("#needs-approbation-alert-wrapper").show();
    } else {
      $("#needs-approbation-wrapper").show();
      $("#needs-approbation-alert-wrapper").hide();
    }
  };

  const dateIsInthePast = function (date) {
    return moment().isAfter(date, "days");
  };

  const dateIsToday = function (date) {
    return moment(date).isSame(new Date(), "day");
  };

  const dateIsTomorrow = function (date) {
    let todayDate = moment(new Date()).format("YYYY-MM-DD") + " 00:00";
    let compareDate = moment(date).format("YYYY-MM-DD") + " 00:00";
    let days = moment(compareDate).diff(moment(todayDate), "days");
    return days === 1;
  };

  const updateMediaPreview = function (media) {

    if (stent.log) {
      stent.konsole.group("updateMediaPreview");
      stent.konsole.log({ response: media });
      stent.konsole.endGroup();
    }
    cleanImagePreviewZone();

    let thumbnailUrl = media.thumbnailUrl;
    if (!thumbnailUrl) {
      if (media.content && media.content.type === "image") {
        thumbnailUrl = media.content.url;
      } else if (media.content && media.content.type === "document") {
        thumbnailUrl = "/assets/img/media/no-document.gif";
      } else if (media.content && media.content.type === "video") {
        thumbnailUrl = "/assets/img/media/no-video.gif";
      } else if (media.content && media.content.type === "post") {
        thumbnailUrl = "/assets/img/media/no-post.gif";
      }
    }

    if (media && media.summary) {
      $("#media-id-preview").find(".mediaImageWrapper img").attr("src", thumbnailUrl);
      $("#media-id-preview").find("a").attr("href", media.content && media.content.url ? media.content.url : media.url ? media.url : "");
      $("#media-id-preview").find(".aMedia .text-muted").html(media.publishedAt ? moment(media.publishedAt).format("MM/DD/YYYY - HH:mm") : "");
      $("#media-id-preview").find(".aMedia .media-title").html(media.title);
      $("#media-id-preview").find(".aMedia .media-summary").html(media.summary);

      // If the selected media is a post
      // Put the media summary in the message textarea
      if (media.type === "image" || media.type === "video" || media.type === "document" || media.type === "post") {
        if ($.trim($("#linkedin-message").val()) === "") {
          $("#linkedin-message").val(media.summary);
        } else {
          if (window.confirm("You already filled in the message field. Would you like to replace it by this message ?\n\n \"" + media.summary + "\"")) {
            $("#linkedin-message").val(media.summary);
          }
        }
      }

      $("#media-id-preview").removeClass("d-none");
    } else {
      $("#media-id-preview").addClass("d-none");
    }

  };

  const toggleLinkedInFields = function (bool) {
    if (bool) {
      $("#linkedin-fields").removeClass("d-none");
    } else {
      $("#linkedin-fields").addClass("d-none");
    }
  };

  const populateCorporativePages = function (items) {

    $("#corp-page").html("");

    let option = new Option("Please choose a corporative page", "");
    $("#corp-page").append($(option));

    items.forEach(function (item) {
      let option = new Option(item.name, item.id);
      $("#corp-page").append($(option));
    });

  };

  const populateAudiences = function () {

    let isCorp = $("[name='destination']:checked").val() === "page";

    let options = [];

    $("#audiences-picker").html("");

    if (!isCorp) {
      options.push({ id: "tenants/" + stent.tenant.key, text: "Workspace", pictureUrl: "/assets/img/tenant-round.svg" });
    }

    let optionsIdentities = _identities.map(identity => {
      return { id: "identities/" + identity.id, text: identity.firstName + " " + identity.lastName, pictureUrl: identity.pictureUrl ? identity.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif" };
    });

    options.push(...optionsIdentities);

    if (!isCorp) {
      let optionsGroups = _groups.map(group => {
        return { id: "groups/" + group.id, text: group.name, pictureUrl: "/assets/img/group-round.svg" };
      });
      options.push(...optionsGroups);
    }

    let select2Options = {
      data: options,
      multiple: true,
      placeholder: isCorp ? "Please select an identity" : "Please select at least one identity, a workspace and/or a group",
      escapeMarkup: stent.select2.memberLayout.escapeMarkup,
      templateResult: stent.select2.memberLayout.templateResult,
      templateSelection: stent.select2.memberLayout.templateSelection
    };

    $("#audiences-picker").select2(select2Options);

    if (isCorp) {

      // Bind on select identity
      $("#audiences-picker").on("select2:select", function (e) {
        var data = e.params.data;
        onSelectIdentityForCorp(data.id);
      });

      // Clean Corp pages select if the ambassador cleans the identities
      $("#audiences-picker").on("select2:clear", function () {
        $("#corp-page").empty().trigger("change");
      });

      // Reset corp selected value
      $("#corp-page").val("");
    } else {

      $("#audiences-picker").off("select2:select");
      $("#audiences-picker").off("select2:clear"); // Clean Corp pages select if the ambassadors cleans the identities

    }

  };

  const toogleCorpFields = async function (isVisible) {

    $("#corp-page").empty().trigger("change");

    populateAudiences();

    if (isVisible) {

      $("#audiences-picker").removeAttr("multiple");
      $("#corp-page-form-group").show();
      $("#do-not-resend-form-group").hide();
      $("#public").attr("disabled", "disabled");
      $("#connections").attr("disabled", "disabled");
      $("input[name=visibility][value='public']").prop("checked", true);

    } else {

      $("#audiences-picker").attr("multiple", "multiple");
      $("#corp-page-form-group").hide();
      $("#do-not-resend-form-group").show();
      $("#public").removeAttr("disabled");
      $("#connections").removeAttr("disabled");
      $("input[name=visibility][value='connections']").prop("checked", true);

      _corpPages = [];
    }

    $("#audiences-picker").val(null).trigger("change");

  };

  const onSelectIdentityForCorp = async function (id) {

    if (!id) {
      return;
    }

    _corpPages = [];

    stent.loader.show(".modal-content");

    let fetchCorpPages = await getCorpPages(id);
    _corpPages = [...fetchCorpPages];
    populateCorporativePages(_corpPages);

    stent.loader.hide();

  };

  const cleanErrors = function () {
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").remove();
  };

  const checkForm = function () {
    let formHasError = false;
    let errors = [];

    cleanErrors();

    const errorDOM = function (message) {
      return (
        "<div class=\"invalid-feedback\" style=\"display: block;\">" +
        (message ? message : "Please fill in this field.") +
        "</div>"
      );
    };

    const toastUserForErrors = function () {
      stent.toast.danger("The form has errors, please correct them to save your media.");
    };

    const scrollToError = function () {
      $(".modal").animate(
        {
          scrollTop: $(".is-invalid").offset().top - 40
        },
        250
      );
    };

    const displayErrorsInForm = function () {
      for (var i = 0; i < errors.length; i++) {
        let error = errors[i];


        $("#" + error.id)
          .addClass("is-invalid")
          .parent()
          .append(errorDOM(error.message));


      }
    };

    // Check media-id
    if ($.trim($("#media-id").val()) === "") {
      errors.push({
        id: "media-id",
        message: "Please choose a media."
      });
      formHasError = true;
    }

    // Check start-date
    if ($.trim($("#start-date").val()) === "") {
      errors.push({
        id: "start-date",
        message: "Please set a start date."
      });
      formHasError = true;
    }

    // Check if end-date is set
    // If yes, be sure the end date is not earlier than the start date.
    if ($.trim($("#end-date").val()) !== "" && new Date($("#start-date").val()) >= new Date($("#end-date").val())) {
      errors.push({
        id: "end-date",
        message: "Please set the end date afer the start date."
      });
      formHasError = true;
    }

    // Check audiencespicker
    if ($.trim($("#audiences-picker").val()) === "") {
      errors.push({
        id: "audiences-picker",
        message: "Please set at least one audience."
      });
      formHasError = true;
    }

    // Check linkedin-message
    if ($.trim($("#linkedin-message").val()) === "") {
      errors.push({
        id: "linkedin-message",
        message: "Please set default linkedin message."
      });
      formHasError = true;
    }

    // Check linkedin-message LENGTH
    if ($.trim($("#linkedin-message").val()).length > maxMessageLength) {
      errors.push({
        id: "linkedin-message",
        message: "Please do not exceed " + maxMessageLength + " characters in the message."
      });
      formHasError = true;
    }

    // Check corp-page if destination is Corporative page
    if ($("[name='destination']:checked").val() === "page" && ($("#corp-page").val() === "" || $("#corp-page").val() === null)) {
      errors.push({
        id: "corp-page",
        message: "Please choose a corporative page."
      });
      formHasError = true;
    }

    if (formHasError) {
      displayErrorsInForm();
      scrollToError();
      toastUserForErrors();
      return false;
    } else {
      return true;
    }
  };

  const save = function () {

    /*
    si une planification a été passé à locked: true coté backend et qu’un mec la modifie entre temps (sans reload des planifications), il se passe quoi ?
    A moins de rappeler le serveur quand j’edite une planification, je vois pas comment contourner ce probleme.
    */
    let mediaId = $.trim($("#media-id").val());
    let destination = $("[name=\"destination\"]:checked").val();
    let getStartDate = stent.flatpickr.pickers["start-date"].selectedDates[0];
    let start = getStartDate ? getStartDate.getTime() - getStartDate.getTimezoneOffset() * 60000 : 0;
    let getEndDate = stent.flatpickr.pickers["end-date"].selectedDates[0];
    let end = getEndDate ? getEndDate.getTime() - getEndDate.getTimezoneOffset() * 60000 : 0;

    let getAudiences = $("#audiences-picker").val();
    let audiences;
    if (destination === "page") {
      audiences = `["${getAudiences}"]`;
    } else {
      audiences = `[${"\"" + getAudiences.join("\",\"") + "\""}]`;
    }

    let defaultMessage = stent.utils.escapeJsonString($.trim($("#linkedin-message").val()));
    let approval = null;
    let visibility = "connections";
    let doNotResend = $("#do-not-resend").is(":checked");
    let correlationId = $("#correlation-id").val();
    let correlationIdString = "";
    if (correlationId !== "") {
      correlationIdString = "correlationId: " + "\"" + correlationId + "\"";
    }

    let pageString = "";
    if (destination === "page") {
      destination = "publish";

      let organizationActor = $("#corp-page").val();
      let organizationName = $("#corp-page option:selected").text();
      pageString = `origin : {
              type: "ORGANIZATION"
              actor: "${organizationActor}"
              name: "${organizationName}"
            }`;
    }

    if (destination === "publish" || destination === "page") {
      if (dateIsTomorrow(new Date(start))) {
        approval = false;
      } else {
        approval = $("#needs-approbation").is(":checked");
      }
      visibility = $("[name=\"visibility\"]:checked").val();
    }

    let query = `mutation {
      media {
        upsertRecommendations(
          recommendation: {
            channel: "linkedin"
            medium: "stream"
            audiences: ${audiences}
            tenantId: "tenants/${stent.tenant.key}"
            from: "media/${mediaId}"
            destination: "${destination}"
            start: ${start}
            end: ${end}
            visibility: "${visibility}"
            approval: ${approval}
            defaultMessage: "${defaultMessage}"
            doNotResend: ${doNotResend}
            ${correlationIdString}
            ${pageString}
          }
        ) {
          id
        }
      }
    }`;

    stent.loader.show(".modal-content");
    stent.ajax.getGraphQL(query, savePlanificationCallback, savePlanificationCallbackError);

  };

  const savePlanificationCallback = function (result) {

    if ((result.errors && result.errors.length > 0) && !result.data) {
      savePlanificationCallbackError();
      return;
    }

    stent.loader.hide();
    refreshCalendar();
    $("#add-planification-modal").modal("hide");
  };

  const savePlanificationCallbackError = function () {
    stent.loader.hide();
    stent.toast.danger("There was an error when trying to save this planification, please try again.");
  };

  const deletePlanification = function () {
    if (confirm("Please confirm you want to remove this planification.")) {

      stent.loader.show(".modal-content");

      let correlationId = $("#correlation-id").val();

      let query = `
        mutation {
          media {
            deleteRecommendations(correlationId:["${correlationId}"])
          }
        }`;

      stent.ajax.getGraphQL(query, deletePlanificationCallback, deletePlanificationCallbackError);

    }
  };

  const deletePlanificationCallback = function (result) {

    if ((result.errors && result.errors.length > 0) && !result.data) {
      deletePlanificationCallbackError();
      return;
    }

    stent.loader.hide();
    $("#add-planification-modal").modal("hide");
    _currentEvent.event.remove();
  };

  const deletePlanificationCallbackError = function () {
    stent.loader.hide();
    stent.toast.danger("There was an error when trying to remove this planification, please try again.");
  };

  const refreshCalendar = function () {
    _calendar.refetchEvents();
  };

  const bindEvents = function () {

    $("#add-planification-button")
      .off("click")
      .on("click", function () {
        openMediaPopup();
      });

    // Display preview media zone
    $("#media-id")
      .off("input")
      .on("input", function () {
        updateMediaPreview($(this).find(":selected").data());
      });

    $(".mediaImageWrapper img")
      .off("error")
      .on("error", function () {
        $(this).attr("src", "/assets/img/media/no-pic.gif");
      });

    $("#no-media-create-first")
      .off("click")
      .on("click", function (e) {

        e.preventDefault();
        $("#add-planification-modal").modal("hide");
        setTimeout(
          function () {
            $("[href=\"media-form\"]").click();
          }, 1000
        );

      });

    $("#save-planification")
      .off("click")
      .on("click", function () {
        if (checkForm()) {
          save();
        }
      });

    $("#newsfeed")
      .off("input")
      .on("input", function () {
        toggleLinkedInFields(false);
        toogleCorpFields(false);
      });

    $("#publish")
      .off("input")
      .on("input", function () {
        toggleLinkedInFields(true);
        toogleCorpFields(false);
      });

    $("#page")
      .off("input")
      .on("input", function () {
        toggleLinkedInFields(true);
        toogleCorpFields(true);
      });

    $("#delete-planification")
      .off("click")
      .on("click", function () {
        deletePlanification();
      });

    $("#linkedin-message")
      .off("input")
      .on("input", function () {
        updateMaxCharCountDOM();
      });

  };

  const updateMaxCharCountDOM = function () {

    let currentCount = $("#linkedin-message").val().length;
    let displayCount = currentCount + " / " + maxMessageLength;

    if (currentCount <= maxMessageLength) {
      $("#message-form-group .maxCharCountWrapper").removeClass("text-danger").text(displayCount);
    } else {
      $("#message-form-group .maxCharCountWrapper").addClass("text-danger").text(displayCount);
    }

  };

  const displayErrorEvents = function () {
    $("#planification").html(
      `
      <div class="alert alert-warning fade show" role="alert">
        <strong>Ooooops.</strong>There was a problem while loading the planification events. Please reload the page.
      </div>
      `
    );
  };

  const init = function () {

    initCalendar();
    bindEvents();

    // Active corresponding menu
    stent.navbar.activeMenu("tenant-planification-v");

    // change Page title
    stent.ui.setPageTitle("Calendar-v");

  };

  init();
});
