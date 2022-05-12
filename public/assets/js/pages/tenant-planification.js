"use strict";

stent.requireJS(["fullcalendar", "flatpickr"], function () {
  let _calendar;
  let _calendarEl;
  let postCreation = {
    channelId: "",
    mediaId: ""
  };


  // *
  // Current Modal
  // *
  let currentModal = "chooseModal";

  let _eventsStyles = {
    LinkedInShareContentSchedule: {
      backgroundColor: "rgb(36,95,156)",
      textColor: "rgb(255,255,255)",
    },
    LinkedInPageContentSchedule: {
      backgroundColor: "rgb(0,0,0)",
      textColor: "white",
    },
    NewsfeedRecommendationContentSchedule: {
      backgroundColor: "rgb(112,46,234)",
      textColor: "white",
    }
  };

  let _calendarConfig = {
    plugins: ["interaction", "list", "dayGrid", "dayGridMonth"],
    timeZone: "UTC",
    height: 850,
    displayEventTime: false,
    columnHeaderFormat: {
      weekday: "long",
    },
    fixedWeekCount: false,
    header: {
      left: "prev,title,next",
      center: "",
      right: "listMonth,dayGridWeek,dayGridMonth"
    },
    viewSkeletonRender: function (info) {
      localStorage.setItem("fcDefaultView", info.view.type);
    },
    defaultView: (localStorage.getItem("fcDefaultView") !== null ? localStorage.getItem("fcDefaultView") : "dayGridMonth"),
    editable: false,
    eventLimit: true, // allow "more" link when too many events,
  };

  // *
  //  Save type content schedule for update.
  // *
  let typeContentSchedule = "";

  // *
  //  Init Calendar
  // *
  const initCalendar = function () {
    _calendarEl = document.getElementById("planification-calendar");
    _calendar = new FullCalendar.Calendar(_calendarEl, {
      ..._calendarConfig,
      ...{
        eventSources: [
          {
            events: async function (info, successCallback, failureCallback) {
              let start = info.start.getTime();
              let end = info.end.getTime();

              let query = `{
                                            workspaceContext {
                                                contentSchedules(first: 100, where: { from: ${start}, to: ${end} }) {
                                                edges {
                                                    node {
                                                    type: __typename
                                                    ... on NewsfeedRecommendationContentSchedule{
           
                                                            audience{
                                                            ... on Node{
                                                                id
                                                            }
                                                            }
                                                        }
                                                    ... on Node {
                                                        id
                                                    }
                                                    ... on ContentSchedule {                                                        
                                                        from
                                                        to
                                                        body
                                                        media {
                                                        ... on Media {
                                                            title
                                                            thumbnailUrl
                                                            summary
                                                            title
                                                        }
                                                        }
                                                        schedule {
                                                        type: __typename
                                                        ... on ContentPublishingJob {
                                                            publishedAt
                                                            publishedBy {
                                                            ... on Account {
                                                                firstName
                                                                lastName
                                                                pictureUrl
                                                            }
                                                            }
                                                        }
                                                            ...on LinkedInCorporateContentPublishingJob {
                                                            origin {
                                                                name
                                                            }
                                                        }
                                                        }
                                                    }
                                                    }
                                                }
                                                }
                                            }
                                            }`;
              let result = await stent.ajax.getApiAsync(query, "POST");

              if (result && result.message) {
                var events = [];
                events = [...result.message.data.workspaceContext.contentSchedules.edges];

                const contentScheduled = result.message.data.workspaceContext.contentSchedules.edges;

                successCallback(
                  contentScheduled.map(function (item) {
                    let color = _eventsStyles["LinkedInShareContentSchedule"].backgroundColor;
                    let textColor = _eventsStyles["LinkedInShareContentSchedule"].textColor;

                    if (item.node.type === "LinkedInShareContentSchedule") {
                      color = _eventsStyles["LinkedInShareContentSchedule"].backgroundColor;
                      textColor = _eventsStyles["LinkedInShareContentSchedule"].textColor;
                    } else if (item.node.type === "LinkedInPageContentSchedule") {
                      color = _eventsStyles["LinkedInPageContentSchedule"].backgroundColor;
                      textColor = _eventsStyles["LinkedInPageContentSchedule"].textColor;
                    } else if (item.node.type === "NewsfeedRecommendationContentSchedule") {
                      color = _eventsStyles["NewsfeedRecommendationContentSchedule"].backgroundColor;
                      textColor = _eventsStyles["NewsfeedRecommendationContentSchedule"].textColor;
                    }

                    return {
                      title: item.node.media.title,
                      start: item.node.from,
                      end: item.node.to,
                      type: item.node.type,
                      data: item,
                      id: item.node.id,
                      color: color,
                      textColor: textColor,
                    };
                  })
                );
              } else {
                failureCallback(data);
              }
            }
          },
        ],
        dateClick: function (info) { },

        eventClick: function (info) {
          let getTypeContentSchedule = info.event.extendedProps.data.node.type;
          typeContentSchedule = getTypeContentSchedule;
          editScheduleQueue(info);
          $("#chooseQueue").modal("show");
        },

        eventRender: function (info) {
          let $el = $(info.el);
          let event = info.event;
          let props = event.extendedProps && event.extendedProps.data ? event.extendedProps.data : {};
          let showSchedulePeople = props.node.schedule.length > 1 ? `<img src="/assets/img/group.svg" alt="${props.node.media.title}" class="audience-image mr-1"/> ${props.node.schedule.length} Ambassadors` : `<img src="/assets/img/user.svg" alt="${props.node.media.title}" class="audience-image mr-1"/> ${props.node.schedule.length} Ambassadors`;
          let lengthAudience = props && props.node && props.node.audience && props.node.audience.length;
          let showAudiencePeople = props && props.node && props.node.audience && props.node.audience.length > 1 ? `<img src="/assets/img/group.svg" class="audience-image mr-1"/> ${lengthAudience} Ambassadors` : `<img src="/assets/img/user.svg" class="audience-image mr-1"/> ${lengthAudience} Ambassador`;
          let showAudienceSchedule = props.node.type == "NewsfeedRecommendationContentSchedule" ? `${showAudiencePeople}` : `${showSchedulePeople}`;

          let html = `
                        <div class="planification-tooltip-wrapper">   
                            <div class="planification-tooltip-wrapper-image" style="background-image: url('${props.node.media.thumbnailUrl ? props.node.media.thumbnailUrl : "/assets/img/media/no-pic.gif"}')"></div>
                            <h4 class="title">${props.node.media.title}</h4>                            
                                                           
                            <p class="summary">
                                <strong class="${props.node.type !== "NewsfeedRecommendationContentSchedule" ? "d-inline-block" : "d-none"}">
                                <i class="fe fe-clock"></i> ${props.node.type !== "NewsfeedRecommendationContentSchedule" ? moment(props.node.from).format("YYYY-MM-DD H:mm") : ""}</strong> </br>
                                    ${props.node.media.summary}
                                </p>  
                            <div class="mb-2">
                                ${showAudienceSchedule}
                            </div>
                        </div>
                    `;

          $el.attr("data-toggle", "tooltip");
          $el.attr("data-html", "true");
          $el.attr("data-delay", 1000);
          $el.attr("data-id", props.node.id ? props.node.id : "");
          $el.attr("data-correlation-id", props.node.correlationId ? props.node.correlationId : "");
          $el.attr("data-container", "#planification-calendar");
          $el.attr("title", html);
        }
      },
    });
    _calendar.render();
  };

  // *
  //  Refresh Calendar
  // *
  const refreshCalendar = function () {
    _calendar.refetchEvents();
  };

  // *
  //  Edit Schedule queue modal
  // *
  const editScheduleQueue = async function (data) {
    let getScheduleID = data.event.extendedProps.data.node.id;
    $("#chooseQueue").attr("data-id", getScheduleID);
    $("#QueueSchedule").empty();
    $("#doneSchedule").empty();

    // Query to select NewsfeedRecommendationContentSchedule
    let newsFeedQuery = `query{
                        workspaceContext {
                            contentScheduleById(id: "${getScheduleID}") {
                            type: __typename
                            ...on NewsfeedRecommendationContentSchedule {
                                body
                                    media {
                                        ... on Node {
                                                id
                                            }
                                    }
                                from
                                date
                                audience {
                                type: __typename
                                ...on WorkspaceMember {
                                    id
                                    firstName
                                    lastName
                                    pictureUrl
                                }
                                ...on WorkspaceGroup {
                                    id
                                    name
                                }
                                }
                            }
                            }
                        }
                    }`;

    // Query to select LinkedInShareContentSchedule LinkedInPageContentSchedule
    let otherQuery = `
                query {
                    workspaceContext {
                        contentScheduleById(id: "${getScheduleID}") {
                            type: __typename
                        ... on ContentSchedule {
                            media {
                                ... on Node {
                                    id
                                }
                            }
                            body
                            schedule {
                                type: __typename
                                ... on ContentPublishingJob {
                                    publishedAt
                                    publishedBy {
                                         ...on Node {
                                                id
                                            }
                                        ... on Account {
                                            firstName
                                            lastName
                                            pictureUrl
                                        }
                                    }
                                    ... on LinkedInCorporateContentPublishingJob {
                                        origin {
                                            name
                                        }
                                    }
                                }
                            }
                             notification {
                                title
                                body
                            }
                        }
                    }
                }
            }`;

    let selectQuery = typeContentSchedule === "NewsfeedRecommendationContentSchedule" ? `${newsFeedQuery}` : `${otherQuery}`;
    let query = selectQuery;

    let $QueueSelector = $("#doneSchedule");
    let $QueueScheduleSelector = $("#QueueSchedule");

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

    let result = await stent.ajax.getApiAsync(query, "POST");

    if (result && result.message && result.message.data) {
      const queueData = result.message.data.workspaceContext.contentScheduleById.schedule;
      const newsFeedMobile = result.message.data.workspaceContext.contentScheduleById.audience;
      const newsFeedMobilePublished = result.message.data.workspaceContext.contentScheduleById.date;

      const typeContentDuplicate = result.message.data.workspaceContext.contentScheduleById.type;
      const mediaIsContentDuplicate = result.message.data.workspaceContext.contentScheduleById.media.id;

      console.log("mediaIsContentDuplicate", mediaIsContentDuplicate);
      console.log("typeContentDuplicate", typeContentDuplicate);

      postCreation.mediaId = mediaIsContentDuplicate;

      if (typeContentDuplicate == "LinkedInShareContentSchedule") {
        postCreation.channelId = "LinkedInShareContentSchedule";
        $.each(queueData, (i, item) => {
          let firstName = item.publishedBy.firstName ? `${item.publishedBy.firstName}` : "";
          let lastName = item.publishedBy.lastName ? `${item.publishedBy.lastName}` : "";
          let pictureUrl = item.publishedBy.pictureUrl ? item.publishedBy.pictureUrl : "";
          let corporatePageName = item.type === "LinkedInCorporateContentPublishingJob" ? ` - ${item.origin.name}` : "";
          let itemId = item.publishedBy.id;

          let actionFailed = `<button type="button" data-id=${itemId} id="requeue" class="btn btn-sm btn-outline-primary mr-2">requeue</button> <div class="btn btn-rounded-circle btn-sm btn-danger"><span class="fe fe-x"></span></div>`;
          let actionScheduled = "<div class=\"btn btn-rounded-circle btn-sm btn-info\"><span class=\"fe fe-check\"></span></div>";
          let actionRejected = "<div class=\"btn btn-rounded-circle btn-sm btn-warning\"><span class=\"fe fe-minus\"></span></div>";
          let actionShared = "<div class=\"btn btn-rounded-circle btn-sm btn-success\"><span class=\"fe fe-check\"></span></div>";

          let typeStatus =
            item.type == "LinkedInFailedContentPublishingJob"
              ? `${actionFailed}`
              : item.type == "LinkedInScheduledContentPublishingJob"
                ? `${actionScheduled}`
                : item.type == "LinkedInRejectedContentPublishingJob"
                  ? `${actionRejected}`
                  : item.type == "LinkedInSharedContentPublishingJob"
                    ? `${actionShared}`
                    : "";

          if (dateIsInthePast(item.publishedAt) || dateIsToday(item.publishedAt)) {
            $QueueSelector.append(`
                        <li class="d-flex flex-row justify-content-between list-group-item" data-id="${item.publishedAt}">                             
                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <small class="pr-2" style="min-width:150px">${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</small>
                                 <div class="avatar avatar-xs mr-2">                                    
                                     <img src=${pictureUrl} alt="${firstName} ${lastName}" class="avatar-img rounded-circle" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                                </div>
                                <small class="pl-2">${firstName} ${lastName} ${corporatePageName}</small>                              
                            </div>                                                         
                            <div>
                             ${typeStatus}
                            </div>      
                        </li>`);
          } else {
            $QueueScheduleSelector.append(`
                        <li class="d-flex flex-row justify-content-between list-group-item" data-id="${item.publishedAt}">                             
                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <small class="pr-2" style="min-width:150px">${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</small>
                                 <div class="avatar avatar-xs mr-2">                                    
                                    <img src=${pictureUrl} alt="${firstName} ${lastName}" class="avatar-img rounded-circle" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                                </div>                                
                                <small class="pl-2">${firstName} ${lastName} ${corporatePageName}</small>                              
                            </div>                                                         
                            <div>
                             ${typeStatus}
                            </div>
                        </li>`);
          }
        });
      } else if (typeContentDuplicate == "LinkedInPageContentSchedule") {
        postCreation.channelId = "LinkedInPageContentSchedule";
        $.each(queueData, (i, item) => {
          let firstName = item.publishedBy.firstName ? `${item.publishedBy.firstName}` : "";
          let lastName = item.publishedBy.lastName ? `${item.publishedBy.lastName}` : "";
          let pictureUrl = item.publishedBy.pictureUrl ? item.publishedBy.pictureUrl : "";
          let corporatePageName = item.type === "LinkedInCorporateContentPublishingJob" ? ` - ${item.origin.name}` : "";
          let itemId = item.publishedBy.id;

          let actionFailed = `<button type="button" data-id=${itemId} id="requeue" class="btn btn-sm btn-outline-primary mr-2">requeue</button> <div class="btn btn-rounded-circle btn-sm btn-danger"><span class="fe fe-x"></span></div>`;
          let actionScheduled = "<div class=\"btn btn-rounded-circle btn-sm btn-info\"><span class=\"fe fe-check\"></span></div>";
          let actionRejected = "<div class=\"btn btn-rounded-circle btn-sm btn-warning\"><span class=\"fe fe-minus\"></span></div>";
          let actionShared = "<div class=\"btn btn-rounded-circle btn-sm btn-success\"><span class=\"fe fe-check\"></span></div>";

          let typeStatus =
            item.type == "LinkedInFailedContentPublishingJob"
              ? `${actionFailed}`
              : item.type == "LinkedInScheduledContentPublishingJob"
                ? `${actionScheduled}`
                : item.type == "LinkedInRejectedContentPublishingJob"
                  ? `${actionRejected}`
                  : item.type == "LinkedInSharedContentPublishingJob"
                    ? `${actionShared}`
                    : "";
          if (dateIsInthePast(item.publishedAt) || dateIsToday(item.publishedAt)) {
            $QueueSelector.append(`
                        <li class="d-flex flex-row justify-content-between list-group-item" data-id="${item.publishedAt}">                             
                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <small class="pr-2" style="min-width:150px">${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</small>
                                 <div class="avatar avatar-xs mr-2">                                    
                                     <img src=${pictureUrl} alt="${firstName} ${lastName}" class="avatar-img rounded-circle" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                                </div>
                                <small class="pl-2">${firstName} ${lastName} ${corporatePageName}</small>                              
                            </div>                                                         
                            <div>
                             ${typeStatus}
                            </div>      
                        </li>`);
          } else {
            $QueueScheduleSelector.append(`
                        <li class="d-flex flex-row justify-content-between list-group-item" data-id="${item.publishedAt}">                             
                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <small class="pr-2" style="min-width:150px">${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</small>
                                 <div class="avatar avatar-xs mr-2">                                    
                                    <img src=${pictureUrl} alt="${firstName} ${lastName}" class="avatar-img rounded-circle" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                                </div>                                
                                <small class="pl-2">${firstName} ${lastName} ${corporatePageName}</small>                              
                            </div>                                                         
                            <div>
                             ${typeStatus}
                            </div>
                        </li>`);
          }
        });
      } else if (typeContentDuplicate == "NewsfeedRecommendationContentSchedule") {
        postCreation.channelId = "NewsfeedRecommendationContentSchedule";
        $.each(newsFeedMobile, (i, item) => {
          let firstName = item.firstName ? `${item.firstName}` : "";
          let lastName = item.lastName ? `${item.lastName}` : "";
          let pictureUrl = item.pictureUrl ? item.pictureUrl : "";
          let groupName = `${item.name}`;

          let showName = item.type === "WorkspaceGroup" ? `${groupName}` : item.type == "WorkspaceMember" ? `${firstName} ${lastName}` : "";

          if (dateIsInthePast(item.publishedAt) || dateIsToday(item.publishedAt)) {
            $QueueSelector.append(`
                        <li class="d-flex flex-row justify-content-between list-group-item" data-id="${newsFeedMobilePublished}">                             
                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <small class="pr-2" style="min-width:150px">${moment(newsFeedMobilePublished).format("MMMM, DD YYYY H:mm")}</small>
                                 <div class="avatar avatar-xs mr-2">                                    
                                     <img src=${pictureUrl} alt="${firstName} ${lastName}" class="avatar-img rounded-circle" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                                </div>
                                <small class="pl-2">${showName}</small>                              
                            </div>                                                         
                            <div></div>
                        </li>`);
          } else {
            $QueueScheduleSelector.append(`
                        <li class="d-flex flex-row justify-content-between list-group-item" data-id="${newsFeedMobilePublished}">                             
                            <div class="d-flex flex-row justify-content-between align-items-center">
                                <small class="pr-2" style="min-width:150px">${moment(newsFeedMobilePublished).format("MMMM, DD YYYY H:mm")}</small>
                                 <div class="avatar avatar-xs mr-2">                                    
                                    <img src=${pictureUrl} alt="${showName}" class="avatar-img rounded-circle" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                                </div>                                
                                <small class="pl-2">${showName}</small>                              
                            </div>                                                         
                            <div></div>
                        </li>`);
          }
        });
      }

    } else {
      $("#loaderror").append("<p>No data available</p> ");
    }

    if ($("ul#doneSchedule li").length >= 1) {
      $("#doneScheduleTitle").addClass("d-block").removeClass("d-none");
    } else {
      $("#doneScheduleTitle").addClass("d-none").removeClass("d-block");
    }

    if ($("ul#QueueSchedule li").length >= 1) {
      $("#QueueScheduleTitle").addClass("d-block").removeClass("d-none");
    } else {
      $("#QueueScheduleTitle").addClass("d-none").removeClass("d-block");
    }
  };

  // *
  // Delete edited Schedule 1 and 2 Screens
  // *
  const deleteEditSchedule = async function () {
    $("#segmentCommentEdit").empty();
    let getScheduleID = $("#chooseQueue").attr("data-id");

    let query = `
            mutation {
                workspaceContext {
                    removeContentSchedule(id: "${getScheduleID}") {
                        ... on Node {
                            id
                        }
                    }
                }
            }
        `;

    let result = await stent.ajax.getApiAsync(query, "POST");

    if (result && result.message && result.message.data) {
      stent.loader.hide();
      refreshCalendar();
    }
  };

  // *
  // Requeue
  // *
  const requeue = async function () {
    let itemId = $("#requeue").attr("data-id");

    let query = `
            mutation {
                workspaceContext {
                    requeueContentPublishingJob(id: "${itemId}") {
                        ...on Node {
                            id
                        }
                    }
                }
            }
        `;

    let result = await stent.ajax.getApiAsync(query, "POST");

    if (result && result.message && result.message.data) {
      refreshCalendar();
    } else {
      stent.utils.log("error");
    }
  };

  // Get Channels
  const getChannels = async function () {
    let $channelSelector = $("#channels");
    let query = `query {
                        workspaceContext {
                        publishingChannels(preview: true) {
                            id
                            logoUrl
                            name
                            preview
                            }
                        }
                    }
                `;

    let result = await stent.ajax.getApiAsync(query, "POST");
    let publishingChannels = result.message.data.workspaceContext.publishingChannels;

    if (result && result.message && result.message.data && result.message.data.workspaceContext) {
      $.each(publishingChannels, (i, item) => {
        let itemDeactivatedClass = item.preview ? "preview" : "";
        $channelSelector.append(
          `<li class="${itemDeactivatedClass}"><img src=${item.logoUrl} alt="${item.name}" class="img-fluid"/><p data-id=${item.id}>${item.name}</p></li>`
        );
      });
      selectChannel();
    }
  };
  // *
  // Select and save ChannelID
  // *
  const selectChannel = function () {
    $("#channels li").on("click", function () {
      $(this).addClass("active").siblings().removeClass("active");
      $("#channels li p").removeClass("channelSelected");
      $("#channels li.active p").addClass("channelSelected");
      $("#chooseModalNext").removeAttr("disabled");
      $("#chooseModalMediaSchedule").removeAttr("disabled");
      // *
      //  Dont allow continue on click into disabled channel
      // *
      if ($(this).hasClass("preview")) {
        $("#chooseModalNext").attr("disabled", "disabled");
        $("#chooseModalMediaSchedule").attr("disabled", "disabled");
        return false;
      }
      // *
      // Select Channel
      // *
      let selectedChannel = $("#channels li.active p").attr("data-id");
      postCreation.channelId = selectedChannel;

      stent.planifications.getPlanificationByKey(selectedChannel).outputs.forEach(function (output) {
        let fileToLoad = `${output.path.html}`;
        $("#planification-selected").load(`${fileToLoad}`);
      });

      setTimeout(() => {
        $("#chooseModal").modal("hide");
        $("#chooseMedia").modal("show");
        $("#cancelStopSchedule").removeClass("d-none").addClass("d-block");
        $("#cancelStopScheduleFirst").removeClass("d-block").addClass("d-none");
      }, 1000);

      console.log(postCreation);
    });
  };

  // *
  //  Refresh events on save newsfeed, corporate and personal schedules.
  // *
  const callRefreshCalendar = function () {
    if ($("#planification").hasClass("update")) {
      refreshCalendar();
      $("#planification").removeClass("update");
      $("#channels li").removeClass("active");
    }
  };
  setInterval(callRefreshCalendar, 500);

  // *
  //  Show modals with mediaId selected in params.
  // *
  let scheduleFromMedia = function () {
    let mediaId = stent.utils.getURLParam("mediaId");

    if (mediaId) {
      $("#chooseModal").modal("show");
      $("#chooseModalNext").addClass("d-none");
      $("#chooseModalMediaSchedule").removeClass("d-none").addClass("d-block");
    }
  };


  const bindEvents = function () {
    // *
    //  Reset Media selected schedule UI
    // *
    $(".resetScheduleElements")
      .on("click", function () {
        $("#confirmClose").modal("show");
      });
    // *
    //  Confirm Close and reset items.
    // *
    $("#confirmStopSchedule")
      .on("click", function () {
        $("#channels li").removeClass("active");
        $("#chooseModalNext").attr("disabled", "disabled");
        $("#confirmClose").modal("hide");
        $("#cancelStopScheduleFirst").removeClass("d-none").addClass("d-block");
        $("#cancelStopSchedule").removeClass("d-block").addClass("d-none");
        location = stent.utils.getURLRemovedParam("mediaId");
      });
    // *
    //  Cancel confirm modal and continue the schedule
    // *
    $("#cancelStopSchedule")
      .off("click")
      .on("click", function () {
        $("#confirmClose").modal("hide");
        $(`#${currentModal}`).modal("show");
      });

    $("#cancelStopScheduleFirst")
      .off("click")
      .on("click", function () {
        $("#confirmClose").modal("hide");
        $("#chooseModal").modal("show");
      });

    $("#chooseModalNext")
      .off("click")
      .on("click", function () {
        $("#chooseModal").modal("hide");
        $("#chooseMedia").modal("show");
        $("#cancelStopSchedule").removeClass("d-none").addClass("d-block");
        $("#cancelStopScheduleFirst").removeClass("d-block").addClass("d-none");
      });
    $("#chooseModalMediaSchedule")
      .off("click")
      .on("click", function () {
        $("#chooseModal").modal("hide");
        $("#chooseMessage").modal("show");
        $("#cancelStopSchedule").removeClass("d-none").addClass("d-block");
        $("#cancelStopScheduleFirst").removeClass("d-block").addClass("d-none");
      });
    $("#backToMessage")
      .off("click")
      .on("click", function () {
        $("#chooseEdit").modal("show");
        $("#chooseQueue").modal("hide");
      });

    $("#goToQueue")
      .off("click")
      .on("click", function () {
        editScheduleQueue();
        $("#chooseEdit").modal("hide");
        $("#chooseQueue").modal("show");
      });
    $("#updateShareContent")
      .off("click")
      .on("click", function () {
        // updateLinkedInContent();
        $("#chooseQueue").modal("hide");
      });

    // Schedule
    //
    // Simple close edited modals
    //
    $(".closeEditSchedule")
      .on("click", function () {
        $("#loaderror").empty();
        $("#chooseEdit").modal("hide");
        $("#chooseQueue").modal("hide");
      });

    //
    // Call remove schedule
    //
    $(".removeListschedule")
      .on("click", function () {
        $("#chooseEdit").modal("hide");
        $("#chooseQueue").modal("hide");
        $("#confirmDelete").modal("show");
      });

    //
    // Cancel remove edited schedule
    //
    $("#cancelRemove")
      .on("click", function () {
        currentModal = "chooseQueue";
        $("#confirmDelete").modal("hide");
        $(`#${currentModal}`).modal("show");
      });

    //
    // Confirm remove schedule
    //
    $("#confirmRemoveEditedSchedule")
      .on("click", function () {
        currentModal = "chooseModal";
        deleteEditSchedule();
        $("#confirmDelete").modal("hide");
      });
    //
    // Re queue schedule
    $(document.body).on("click", "#requeue", function () {
      requeue();
    });

    //
    // Duplicate
    //
    $(".duplicateSchedule")
      .off("click")
      .on("click", function () {
        // *
        // Select Channel
        // *
        let selectedChannel = postCreation.channelId;
        let selectedMedia = postCreation.mediaId;

        stent.planifications.getPlanificationByKey(selectedChannel).outputs.forEach(function (output) {
          let fileToLoad = `${output.path.html}`;
          $("#planification-selected").load(`${fileToLoad}`);
        });

        setTimeout(function () {
          $("#chooseEdit").modal("hide");
          $("#chooseQueue").modal("hide");
          $("#chooseMedia").modal("show");
        }, 1000);

      });

    //
    // Duplicate Action
    //
    $(".editSchedule")
      .off("click")
      .on("click", function () {
        // *
        // Select Channel
        // *
        let selectedChannel = postCreation.channelId;
        let selectedMedia = postCreation.mediaId;

        stent.planifications.editPlanificationByKey(selectedChannel).outputs.forEach(function (output) {
          console.log("output", output);
          let fileToLoad = `${output.path.html}`;
          $("#planification-selected").load(`${fileToLoad}`);
        });

        setTimeout(function () {
          $("#chooseEdit").modal("hide");
          $("#chooseQueue").modal("hide");
          $("#chooseMedia").modal("show");
        }, 1000);

      });

    // Count textarea Edit popup Message
    $("#segmentCommentEdit").on("input", function () {
      var maxlength = $(this).attr("maxlength");
      var currentLength = $(this).val().length;

      if (currentLength <= maxlength) {
        let result = maxlength - currentLength;
        $("#resultCommentEdit").text(`${result}`);
      }
    });
    // *
    //  MESSAGE Prevent white spaces
    // *
    $("#segmentCommentEdit").on("keydown", function (event) {
      const element = document.getElementById("segmentCommentEdit");
      if (element.value.length === 0 && event.which === 32) {
        event.preventDefault();
      }
    });

  };

  const init = function () {
    initCalendar();
    bindEvents();
    getChannels();
    scheduleFromMedia();
    stent.navbar.activeMenu("tenant-planification");
    stent.ui.setPageTitle("Calendar");
  };

  init();
});


// *
// Setup Different sources start
// *
stent.planifications = (function () {
  let sources = [
    // *
    // stent-newsfeed
    // *
    {
      key: "stent-newsfeed",
      name: "Mobile newsfeed",
      outputs: [
        {
          path: {
            html: "/pages/tenant-planification-mobile.html"
          }
        }
      ]
    },
    // *
    // linkedin-personal-page
    // *
    {
      key: "linkedin-personal-page",
      name: "Personal page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-planification-personal.html"
          }
        }
      ]
    },
    // *
    // linkedin-corporate-page
    // *
    {
      key: "linkedin-corporate-page",
      name: "Corporate page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-planification-corporate.html"
          }
        }
      ]
    },
    // *
    // Duplicate Personal Page
    // *
    {
      key: "LinkedInShareContentSchedule",
      name: "Duplicate personal page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-duplicate-personal.html"
          }
        }
      ]
    },
    // *
    // Duplicate Corporate Page
    // *
    {
      key: "LinkedInPageContentSchedule",
      name: "Duplicate corporate page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-duplicate-corporate.html"
          }
        }
      ]
    },
    // *
    // Duplicate Mobile Newsfeed Page
    // *
    {
      key: "NewsfeedRecommendationContentSchedule",
      name: "Duplicate Mobile Newsfeed page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-duplicate-mobile.html"
          }
        }
      ]
    },
    // *
    // Edit Personal Page
    // *
    {
      key: "LinkedInShareContentSchedule",
      name: "Edit Personal page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-edit-personal.html"
          }
        }
      ]
    },
    // *
    // Edit Corporate Page
    // *
    {
      key: "LinkedInPageContentSchedule",
      name: "Edit corporate page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-edit-corporate.html"
          }
        }
      ]
    },
    // *
    // Edit Mobile newsfed Page
    // *
    {
      key: "NewsfeedRecommendationContentSchedule",
      name: "Edit Newsfeed page",
      outputs: [
        {
          path: {
            html: "/pages/tenant-edit-mobile.html"
          }
        }
      ]
    }
  ];

  const getPlanificationByKey = function (key) {
    return sources.filter(source => source.key === key)[0];
  };

  const editPlanificationByKey = function (key) {
    console.log("key", key);
    return sources.filter(source => source.key === key)[1];
  };

  return {
    sources,
    getPlanificationByKey,
    editPlanificationByKey
  };

})();
