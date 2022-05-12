/* eslint-disable indent */
"use strict";

stent.planificationMobile = (function () {
    console.log("====================================");
    console.log("Duplicate personal schedule.js");
    console.log("====================================");

    // *
    // Media items
    // *
    let lastChildMedia = "";
    let filterMediaName = "";
    let filterMediaType = "";
    let mediaType = "";

    // *
    // Message
    // *
    let segmentComment = "";

    // *
    // Publishers
    // *
    let _publishers = [];
    let _publishersMap = {};

    // *
    // Members
    // *
    let members = [{}];

    // *
    // Current Modal
    // *
    let currentModal = "chooseMedia";

    // Publisher Everyone option
    let everyone = false;

    // *
    // DATE Set Strategy and start end time
    // *
    let startCalendarDate = "";
    let endCalendarDate = "";
    let strategy = "";
    let startDateTimeline = "";
    let endDateTimeline = "";
    let durationStrategy = "";

    // *
    // Post Creation
    // *
    let postCreation = {
        channelId: "",
        mediaId: "",
        visibility: "PUBLIC",
        doNotResend: false,
        message: "",
        notification: {
            title: "",
            body: "",
        },
        timeline: [],
    };


    // *
    //  Get duplicate data to replace PostCreation
    // *
    const getDuplicateData = async function () {
        let getScheduleID = $("#chooseQueue").attr("data-id");

        let query = `query {
                    workspaceContext {
                        contentScheduleById(id: "${getScheduleID}") {
                            type: __typename
                        ... on ContentSchedule {
                            media {
                                ... on Node {
                                    id
                                    __typename
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
            }
        `;
        let result = await stent.ajax.getApiAsync(query, "POST");

        if (result && result.message && result.message.data && result.message.data.workspaceContext && result.message.data.workspaceContext.contentScheduleById) {

            let knowChannel = result.message.data.workspaceContext.contentScheduleById.type;
            // *
            // Post Creation
            // *
            postCreation = {
                channelId: knowChannel == "LinkedInShareContentSchedule" ? "linkedin-personal-page" : "linkedin-corporate-page",
                mediaId: result.message.data.workspaceContext.contentScheduleById.media.id,
                visibility: "PUBLIC",
                doNotResend: false,
                message: result.message.data.workspaceContext.contentScheduleById.body,
                notification: {
                    title: result.message.data.workspaceContext.contentScheduleById.notification.title,
                    body: result.message.data.workspaceContext.contentScheduleById.notification.body,
                },
                timeline: result.message.data.workspaceContext.contentScheduleById.schedule,
            };
            // Select Media type and pass it to get the default value.
            let selectedMediaType = result.message.data.workspaceContext.contentScheduleById.media.__typename;
            members = result.message.data.workspaceContext.contentScheduleById.schedule;

            if (selectedMediaType == "VideoMedia") {
                $("#selectMediaType").attr("data-value", "VIDEO").val(selectedMediaType);
                mediaType = $("#selectMediaType").attr("data-value");
            } else if (selectedMediaType == "ImageMedia") {
                $("#selectMediaType").attr("data-value", "IMAGE").val(selectedMediaType);
                mediaType = $("#selectMediaType").attr("data-value");
            } else if (selectedMediaType == "DocumentMedia") {
                $("#selectMediaType").attr("data-value", "DOCUMENT").val(selectedMediaType);
                mediaType = $("#selectMediaType").attr("data-value");
            } else if (selectedMediaType == "ArticleMedia") {
                $("#selectMediaType").attr("data-value", "ARTICLE").val(selectedMediaType);
                mediaType = $("#selectMediaType").attr("data-value");
            }
        }
        getMedias();
    };


    // *
    // MEDIAS Get list of medias
    // *
    const getMedias = async function () {
        let callBackendItems = 10;
        let lastElement = lastChildMedia;
        let $mediaSelector = $("#selectMedia");
        let selectType = $("#selectMediaType").attr("data-value");

        let query = ` 
            query {
                workspaceContext {
                    medias(where: { name: "", type: ${selectType} }, first: ${callBackendItems}, after:"${lastElement}") { 
                        totalCount
                        edges {
                            cursor
                            node {
                                type: __typename
                                    ...on Node {
                                        id
                                    }
                                    ...on Media {
                                            title
                                            summary
                                            thumbnailUrl
                                            createdAt
                                        }
                                    }
                            }
                        }                         
                    }
                }`;
        let result = await stent.ajax.getApiAsync(query, "POST");
        const mediaItems = result.message.data.workspaceContext.medias.edges;

        if (result && result.message && result.message.data && result.message.data.workspaceContext && result.message.data.workspaceContext.medias) {
            const populateMedia = (function () {
                var optionValues = [];

                $("#selectMediaType option").each(function () {
                    optionValues.push(this.value);
                });
            })();

            $.each(mediaItems, (i, item) => {
                let $mediaLabel = item.node.type === "VideoMedia" ? "Video" : item.node.type === "ImageMedia" ? "Image" : item.node.type === "ArticleMedia" ? "Article" : item.node.type === "DocumentMedia" ? "Document" : "Info";
                let $mediaClass = item.node.type === "VideoMedia" ? "danger" : item.node.type === "ImageMedia" ? "image" : item.node.type === "ArticleMedia" ? "link" : item.node.type === "DocumentMedia" ? "document" : "info";

                let selectedId = item.node.id === postCreation.mediaId ? "active opacity" : "opacity";

                $mediaSelector.append(function (i) {
                    return `
                            <li class="list-group-item ${selectedId}" data-id=${item.node.id} data-cursor=${item.cursor}>
                                <div class="d-block">                                    
                                     <img src=${item.node.thumbnailUrl == null ? "/assets/img/media/no-pic.gif" : item.node.thumbnailUrl} onerror="this.src='/assets/img/media/no-image.gif'" alt=${item.node.title} class="d-block">
                                </div>
                                <div class="typeMedia">
                                    <span class="badge badge-pill badge-${$mediaClass}">${$mediaLabel}</span>
                                </div>
                                <div class="content">
                                    <span class="date">${moment(item.node.createdAt).format("MMMM, DD YYYY H:mm")}</span>
                                    <h4>${item.node.title}</h4>
                                    <p>
                                        ${item.node.summary}
                                    </p>
                                </div>
                            </li>
                        `;
                });
            });
        }
        $("#goToMessage").removeAttr("disabled");
        selectLastMedia();
        selectedMedia();
    };

    // *
    // MEDIAS Filter medias
    // *
    const filterAllMedias = async function () {
        $("#selectMedia").empty();
        let callBackendItems = 10;
        let $mediaSelector = $("#selectMedia");
        let filterName = filterMediaName;
        let selectType = $("#selectMediaType").find(":selected").attr("data-value");

        let query = ` 
            query {
                workspaceContext {
                    medias(where: {name: "${filterName}", type: ${selectType} }, first: ${callBackendItems}) { 
                        totalCount
                        edges {
                            cursor
                            node {
                                type: __typename
                                    ...on Node {
                                        id
                                    }
                                    ...on Media {
                                            title
                                            summary
                                            thumbnailUrl
                                            createdAt
                                        }
                                    }
                            }
                        }                         
                    }
                }`;


        let result = await stent.ajax.getApiAsync(query, "POST");

        const mediaItems = result.message.data.workspaceContext.medias.edges;

        if (result && result.message && result.message.data && result.message.data.workspaceContext && result.message.data.workspaceContext.medias) {
            const populateMedia = (function () {
                var optionValues = [];

                $("#selectMediaType option").each(function () {
                    optionValues.push(this.value);
                });
            })();

            $.each(mediaItems, (i, item) => {
                let $mediaLabel = item.node.type === "VideoMedia" ? "Video" : item.node.type === "ImageMedia" ? "Image" : item.node.type === "ArticleMedia" ? "Article" : item.node.type === "DocumentMedia" ? "Document" : "Info";
                let $mediaClass = item.node.type === "VideoMedia" ? "danger" : item.node.type === "ImageMedia" ? "image" : item.node.type === "ArticleMedia" ? "link" : item.node.type === "DocumentMedia" ? "document" : "info";

                $mediaSelector.append(function (i) {
                    return `
                            <li class="list-group-item" data-id=${item.node.id} data-cursor=${item.cursor}>
                                <div class="d-block">                                    
                                     <img src=${item.node.thumbnailUrl == null ? "/assets/img/media/no-pic.gif" : item.node.thumbnailUrl} alt=${item.node.title} onerror="this.src='/assets/img/media/no-image.gif'" class="d-block">
                                </div>
                                <div class="typeMedia">
                                    <span class="badge badge-pill badge-${$mediaClass}">${$mediaLabel}</span>
                                </div>
                                <div class="content">
                                    <span class="date">${moment(item.node.createdAt).format("MMMM, DD YYYY H:mm")}</span>
                                    <h4>${item.node.title}</h4>
                                    <p>
                                        ${item.node.summary}
                                    </p>
                                </div>
                            </li>
                        `;
                });
            });
        }
        selectedMedia();
    };

    // *
    // MEDIAS Selec media from list of medias
    // *
    let selectLastMedia = function () {
        let lastChildElement = $("ul#selectMedia li").last().attr("data-cursor");
        lastChildMedia = lastChildElement;
    };

    // *
    // MEDIAS Selected media data-id and pass to postCreation
    // *
    const selectedMedia = function () {
        $("ul#selectMedia li").on("click", function () {
            $(this).addClass("active").siblings().removeClass("active").siblings().addClass("opacity");
            $("#goToMessage").removeAttr("disabled");
            let selectedMedia = $("#selectMedia li.active").attr("data-id");
            postCreation.mediaId = selectedMedia;
            $("#chooseMedia").modal("hide");
            $("#chooseMessage").modal("show");
            currentModal = "chooseMessage";
            // Get message
            let getSegmentComment = $("#selectMedia li.active .content p").text().trim();
            $("#segmentComment").val(getSegmentComment);
            let segmentComment = $("#segmentComment").val().trim();
            postCreation.message = segmentComment;
            $("#goToPublisher").removeAttr("disabled");
        });
    };
    // *
    // Update Medias
    // *
    const updateMediaClass = function () {
        $("ul#selectMedia li").each(function () {
            if ($(this).hasClass("active")) {
                $(this).siblings().removeClass("active").siblings().addClass("opacity");
            }
        });
    };

    // *
    // Get Publishers
    // *
    const getPublishers = async function () {
        let initialPublishers = 500;
        let $publisherShow = $("#publisherShow");

        let query = `query {
                      workspaceContext {
                        members(where: {channel: LINKEDIN status: ACTIVE},first: ${initialPublishers}) {
                        edges {
                            node {
                            type: __typename
                            ... on Node {
                                id
                            }
                            ... on WorkspaceMember {
                                firstName
                                lastName
                                pictureUrl
                                accounts (where: {channel: LINKEDIN}) {
                                ...on LinkedInAccount {
                                    active
                                    id
                                }
                                }
                            }
                            ... on WorkspaceGroup {
                                name
                            }
                            }
                        }
                        }
                    }
                    }
                `;

        let result = await stent.ajax.getApiAsync(query, "POST");

        const publishers = result.message.data.workspaceContext.members.edges;

        if (result && result.message) {
            _publishers = publishers;

            _publishers.forEach(({ node }) => {
                _publishersMap[node.id] = node;
            });

            populatePublishers();
            $("#goToTimeRange").removeAttr("disabled");
        }
    };

    // *
    // Populate publishers
    // *
    const populatePublishers = function () {
        let options = [];

        let optionsPublishers = _publishers.filter(({ node: publisher }) => {
            return publisher;
        }).map(({ node: publisher }) => {
            if (publisher.type === "WorkspaceGroup") {
                return {
                    id: `${publisher.id}`,
                    text: publisher.name,
                    pictureUrl: publisher.pictureUrl ? publisher.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif",
                    type: `${publisher.type}`,
                    accountId: `${publisher.id}`
                };
            } else if (publisher.type === "WorkspaceMember") {
                return {
                    id: `${publisher.id}`,
                    text: publisher.firstName + " " + publisher.lastName,
                    pictureUrl: publisher.pictureUrl ? publisher.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif",
                    type: `${publisher.type}`,
                    accountId: `${publisher.accounts[0].id}`
                };
            }
        });

        options.push(...optionsPublishers);

        $("#publisherShow").select2({
            data: options,
            placeholder: {
                text: " Please select at least one employee, a workspace and/or a group",
            },
            escapeMarkup: stent.select2.memberLayout.escapeMarkup,
            templateResult: stent.select2.memberLayout.templateResult,
            templateSelection: stent.select2.memberLayout.templateSelection,
        });

        // get id from duplicate
        const ids = members.map(({ publishedBy: { id } }) => id);
        members = [];
        // Filter and add value to selected mebmers
        options.filter(({ accountId }) => ids.includes(accountId)).forEach(({ id, type }) => {
            $("#publisherShow option[value='" + id + "']").prop("selected", true);
            // Asign id and type to members array
            members.push({ id: id, type: type });
        });

        $("#publisherShow").trigger("change");

        $("#publisherShow").on("select2:select", function () {
            if ($(this).children("option:first-child").is(":selected")) {
                everyone = true;
            } else {
                everyone = false;
                members = $(this).val().map((id) => _publishersMap[id]).map(({ type, id }) => ({
                    type, id
                }));
            }

        });

        $("#publisherShow").on("select2:unselect", function () {
            if ($(this).children("option:first-child").is(":selected")) {
                everyone = true;
            } else {
                everyone = false;
                members = $(this).val().map((id) => _publishersMap[id]).map(({ type, id }) => ({
                    type, id
                }));
            }

        });
    };

    // *
    // Get timeline items
    // *
    const getTimeline = async function () {
        // let selectedChannel = $("#channels li.active p").attr("data-id");
        let selectedChannel = postCreation.channelId;
        let duration = durationStrategy;
        let startDate = startDateTimeline;
        let endDate = endDateTimeline;
        let items = members.map(({ type, id }) => `{type:${type === "WorkspaceMember" ? "MEMBER" : "GROUP"}, id:"${id}"}`);

        let membersToPass = function () {
            let typeMembersToPass = everyone;

            if (!typeMembersToPass) {
                return `members: [${items}]`;
            } else {
                return "";
            }
        };

        const strategyToPass = function () {
            let getStrategy = strategy;

            if (getStrategy === "ASAP") {
                return `stategy: ${getStrategy}`;
            } else if (getStrategy === "DATERANGE") {
                return `
                stategy: ${getStrategy}
                dateRange: {
                    from: "${startDate}"
                    to: "${endDate}"
                }`;
            } else if (getStrategy === "DATE") {
                return `
                stategy: ${getStrategy}
                date: "${startDate}"
                `;
            } else if (getStrategy === "DURATION") {
                return `
                    stategy: ${getStrategy}
                    duration: "${duration}"
                `;
            } else if (getStrategy == "BESTMOMENT") {
                return `
                    stategy: ${getStrategy}                
                    cron: "0 8 * * TUE-THU"
                    duration: "PT1H"
                `;
            }
        };

        let query = `
                    query{
                        workspaceContext {
                            workspace {
                                timezone {
                                    name
                                    offset
                                }
                            }
                            shuffleContentScheduleTimeline(
                                channelId: "${selectedChannel}"
                                ${membersToPass()}
                                scheduling: {
                                    ${strategyToPass()}
                                }) {
                                publishedAt
                                publishedBy {
                                    id
                                    account {
                                        ...on Account {
                                            firstName
                                            lastName
                                            pictureUrl
                                        }
                                    }
                                    member {
                                        timezone {
                                            name
                                            offset
                                        }
                                    }
                                }
                            }
                        }
                    }`;

        console.log(query);

        let $timelineShow = $("#addTimelineItems");
        $timelineShow.empty();

        let result = await stent.ajax.getApiAsync(query, "POST");

        if (result && result.message && result.message.data && result.message.data.workspaceContext && result.message.data.workspaceContext.shuffleContentScheduleTimeline) {
            const timelineItems = result.message.data.workspaceContext.shuffleContentScheduleTimeline;
            const timelineOffset = result.message.data.workspaceContext.workspace;

            $("#timeOffset").append(`<span> ${timelineOffset.timezone.name}</span>`);

            var myNewarray = [];
            return $.each(timelineItems, (i, item) => {
                var addtoArray = myNewarray.push(item.publishedAt);
                let sortedArray = myNewarray.sort((a, b) => a - b);

                let userTimeZone = `<div class="overlay"><span>${item.publishedBy.member.timezone.name}</span></div>`;

                let showTimeZone = item.publishedBy.member.timezone.name != timelineOffset.timezone.name ? `${userTimeZone}` : "";

                $timelineShow.append(`
                        <li class="dropzone" id=${item.publishedBy.id} draggable="true" data-publishedBy=${item.publishedBy.id} data-publishedAt=${item.publishedAt}>                            
                            <img src="${item.publishedBy.account.pictureUrl}" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" class="draggableImage" draggable="false">                           
                            ${showTimeZone}                       
                            <div class="date" draggable="false">
                               <div class="day">${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</div>                                
                            </div>
                         </li>
                        `);
            });
        } else {
            $(".timelineError").append("<p>No data to load in timeline</p>");
        }
    };

    // *
    // Save timeline items, update timeline items, shuffle and update items to save.
    // *
    const saveTimelineItems = function () {
        postCreation.timeline = [];
        $("#addTimelineItems li").map(function () {
            var publishedBy = $(this).attr("data-publishedBy");
            var publishedAt = $(this).attr("data-publishedAt");
            postCreation.timeline.push({ publishedBy: publishedBy, publishedAt: parseInt(publishedAt, 10) });
        });
    };

    // *
    // Shuffle Action
    // *
    const shuffleAction = async function () {
        let getChannel = postCreation.channelId;
        let duration = durationStrategy;
        let startDate = startDateTimeline;
        let endDate = endDateTimeline;
        let items = members.map(({ type, id }) => `{type:${type === "WorkspaceMember" ? "MEMBER" : "GROUP"}, id:"${id}"}`);

        let membersToPass = function () {
            let typeMembersToPass = everyone;

            if (!typeMembersToPass) {
                return ` members: [${items}]`;
            } else {
                return "";
            }
        };
        const strategyToPass = function () {
            let getStrategy = strategy;

            if (getStrategy === "ASAP") {
                return `stategy: ${getStrategy}`;
            } else if (getStrategy === "DATERANGE") {
                return `
                stategy: ${getStrategy}
                dateRange: {
                    from: "${startDate}"
                    to: "${endDate}"
                }`;
            } else if (getStrategy === "DATE") {
                return `
                stategy: ${getStrategy}
                date: "${startDate}"`;
            } else if (getStrategy === "DURATION") {
                return `
                    stategy: ${getStrategy}
                    duration: "${duration}"
                `;
            } else if (getStrategy == "BESTMOMENT") {
                return `
                    stategy: ${getStrategy}                
                    cron: "0 8 * * TUE-THU"
                    duration: "PT1H"
                `;
            }
        };

        let query = `
                    query{
                        workspaceContext {
                            workspace {
                                timezone {
                                    name
                                    offset
                                }
                            }
                            shuffleContentScheduleTimeline(
                                channelId: "${getChannel}"
                               ${membersToPass()}
                                scheduling: {
                                    ${strategyToPass()}
                                }) {
                                publishedAt
                                publishedBy {
                                    id
                                    account {
                                        ...on Account {
                                            firstName
                                            lastName
                                            pictureUrl
                                        }
                                    }
                                    member {
                                        timezone {
                                            name
                                            offset
                                        }
                                    }
                                }
                            }
                        }
                }`;

        let result = await stent.ajax.getApiAsync(query, "POST");

        let $timelineShow = $("#addTimelineItems");

        if (result && result.message && result.message.data) {
            const timelineItems = result.message.data.workspaceContext.shuffleContentScheduleTimeline;
            const timelineOffset = result.message.data.workspaceContext.workspace;
            // Clean ul list
            $("#addTimelineItems").empty();
            // Clean time zone offset
            $("#timeOffset span").remove();

            // Append new time zone offset
            $("#timeOffset").append(`
                    <span>${timelineOffset.timezone.name}</span>
                `);

            var myNewarray = [];

            // Iterate between items
            return $.each(timelineItems, (i, item) => {
                var addtoArray = myNewarray.push(item.publishedAt);
                let sortedArray = myNewarray.sort((a, b) => a - b);

                $timelineShow.append(`
                     <li class="dropzone" id=${item.publishedBy.id} draggable="true" data-publishedBy=${item.publishedBy.id
                    } data-publishedAt=${item.publishedAt}>                        
                        <img src="${item.publishedBy.account.pictureUrl}" onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" class="draggableImage" draggable="false">
                        <div class="overlay">
                            <span>${item.publishedBy.member.timezone.name}</span>                            
                        </div>
                        <div class="date" draggable="false">
                           <div class="day">${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</div>
                        </div>
                     </li>
                    `);
            });
        } else {
            $(".timelineError").append(`<p>${data}</p>`);
        }
        saveTimelineItems();
    };

    // *
    // Select Widget
    // *
    const selectWidget = function () {
        $("#widget").timeDurationPicker({
            seconds: false,
            defaultValue: function () {
                return $("#widget").val();
            },
            onSelect: function (element, seconds, duration, text) {
                $("#widget").val(text);
                $("#widget").attr("data-id", duration);
                $("#gotoTimeline").removeAttr("disabled");
                durationStrategy = duration;
                $("body").removeClass("activate-duration");
            }
        });
    };

    // *
    // Schedule a LinkedIn personal share content
    // *
    const scheduleContent = async function () {
        let mediaId = $("#selectMedia li.active").attr("data-id");
        let segmentComment = $("#segmentComment").val().trim();
        let notificationTitle = $("#notificationTitle").val().trim();
        let notificationBody = $("#messageNotification").val().trim();
        let resend = postCreation.doNotResend;

        if (everyone) {
            saveTimelineItems();
            var timelineToSave = postCreation.timeline.reduce((prev, { publishedBy, publishedAt }) => {
                return `${prev}
            {
                publishedBy: "${publishedBy}"
                publishedAt: ${publishedAt}
            }`;
            }, "");
        } else {
            var timelineToSave = postCreation.timeline.reduce((prev, { publishedBy, publishedAt }) => {
                return `${prev}
            {
                publishedBy: "${publishedBy}"
                publishedAt: ${publishedAt}
            }`;
            }, "");
        }

        let visibility = postCreation.visibility;
        let visibilityResultat = visibility.replace(/^"(.*)"$/, "$1");

        postCreation.mediaId = mediaId;
        postCreation.message = segmentComment;
        postCreation.notification.title = notificationTitle;
        postCreation.notification.body = notificationBody;

        let segmentToPass = JSON.stringify(segmentComment);

        let query = `
            mutation {  
            workspaceContext{
                    createLinkedInStreamShareContentSchedule(input: {
                    mediaId: "${mediaId}"
                    visibility: ${visibilityResultat}
                    doNotResend: ${resend}
                     message: ${segmentToPass}
                    notification: {
                        title: "${notificationTitle}"       
                        body: "${notificationBody}"
                    }
                    timeline: [${timelineToSave}]
                }) {
                    ...on Node {
                        id
                    }
                }
            }
        }
        `;

        let result = await stent.ajax.getApiAsync(query, "POST");
        if (result && result.message) {
            $("#optionsPopup").modal("hide");
            $("#planification").addClass("update");
        }
    };

    // *
    // Bind Events
    // *
    const bindEvents = function () {
        // *
        //  Reset Media selected schedule UI
        // *
        $(".resetScheduleElements")
            .on("click", function () {
                $("#confirmClose").modal("show");
                $("#cancelStopSchedule").removeClass("d-none").addClass("d-block");
                $("#cancelStopScheduleFirst").removeClass("d-block").addClass("d-none");
            });
        // *
        //  Confirm Close and reset items.
        // *
        $("#confirmStopSchedule")
            .on("click", function () {
                $("#channels li").removeClass("active");
                $("#chooseModalNext").attr("disabled", "disabled");
                $("#confirmClose").modal("hide");
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
        // *
        //  MEDIAS Scroll items inside modal media.
        // *
        $("#chooseMedia .modal-content .modal-body").on("scroll", function () {
            updateMediaClass();
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                getMedias();
            }
        });
        // *
        //  MEDIAS Filter media by title
        // *
        $("#filterByTitle").on("keypress", function (event) {
            if (event.which == 13) {
                var value = $(this).val().toLowerCase();
                if (value.length === 0) {
                    filterMediaName = value;
                    lastChildMedia = "";
                    $("#selectMedia").empty();
                    $("#goToMessage").attr("disabled", "disabled");
                    getMedias();
                    $("#selectMedia li").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                    });
                } else if (value.length >= 1) {
                    filterMediaName = value;
                    $("#goToMessage").attr("disabled", "disabled");
                    filterAllMedias();
                    $("#selectMedia li").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                    });
                }
            }
        });
        // *
        //  MEDIAS Filter media by type
        // *
        $("#selectMediaType").on("change", function () {
            var value = $(this).find(":selected").attr("data-value");
            filterMediaType = value;
            $("#goToMessage").attr("disabled", "disabled");
            filterAllMedias();
            $("#selectMedia li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });

        // *
        //  MESSAGE Count textarea
        // *
        $("#segmentComment").on("input", function () {
            var maxlength = $(this).attr("maxlength");
            var currentLength = $(this).val().length;

            if (currentLength <= maxlength) {
                let result = maxlength - currentLength;
                $("#resultComment").text(`${result}`);
            }

            if (currentLength >= 1) {
                $("#countContent").removeClass("d-none");
                $("#goToPublisher").removeAttr("disabled");
            } else {
                $("#countContent").addClass("d-none");
                $("#goToPublisher").attr("disabled", "disabled");
            }

            if (currentLength >= maxlength) {
                $("#exceded").removeClass("d-none");
            } else {
                $("#exceded").addClass("d-none");
            }
        });

        // *
        //  MESSAGE Prevent white spaces
        // *
        $("#segmentComment").on("keydown", function (event) {
            const element = document.getElementById("segmentComment");
            if (element.value.length === 0 && event.which === 32) {
                event.preventDefault();
            }
        });

        // *
        //  Publishers > 0
        // *
        $("#publisherShow").on("select2:select", function (e) {
            if ($(".select2-selection__choice").length > 0) {
                $("#goToTimeRange").removeAttr("disabled");
            }
        });
        // *
        //  Publishers <= 0
        // *
        $("#publisherShow").on("select2:unselect", function (e) {
            if ($(".select2-selection__choice").length <= 0) {
                $("#goToTimeRange").attr("disabled", "disabled");
            }
        });

        // *
        //  Select ASAP
        // *
        $("#asapDate").on("click", function () {
            $(".singleSelectDate").hide();
            $(".doubleSelectDate").hide();
            $(".bestMomentContent").hide();
            $(".givenDate").hide();
            $(".asapContent").show();
            $(this).prop("checked", true);
            $("#simpleDate").prop("checked", false);
            $("#doubleDate").prop("checked", false);
            $("#bestMoment").prop("checked", false);
            $("#givenDate").prop("checked", false);
            $("#gotoTimeline").removeAttr("disabled");
            // Get value to strategy
            strategy = $("#asapDate").attr("data-value");
            $("body").removeClass("activate-duration");
            $(".dayStart .date .day").empty();
            $(".dayEnd .date .day").empty();
        });

        // *
        //  Select DURATION
        // *
        $("#simpleDate").on("click", function () {
            $(".singleSelectDate").show();
            $(".doubleSelectDate").hide();
            $(".bestMomentContent").hide();
            $(".asapContent").hide();
            $(".givenDate").hide();
            $(this).prop("checked", true);
            $("#doubleDate").prop("checked", false);
            $("#asapDate").prop("checked", false);
            $("#bestMoment").prop("checked", false);
            $("#givenDate").prop("checked", false);
            $("#gotoTimeline").attr("disabled", "disabled");
            // Get value to strategy
            strategy = $("#simpleDate").attr("data-value");
            $(".dayStart .date .day").empty();
            $(".dayEnd .date .day").empty();
        });

        // *
        // Add class to body when activate DURATION dates.
        // *
        $("#widget").on("click", function () {
            $("body").addClass("activate-duration");
        });


        // *
        //  Select DATERANGE
        // *
        $("#doubleDate").on("click", function () {
            $(".doubleSelectDate").show();
            $(".singleSelectDate").hide();
            $(".bestMomentContent").hide();
            $(".asapContent").hide();
            $(".givenDate").hide();
            $(this).prop("checked", true);
            $("#simpleDate").prop("checked", false);
            $("#asapDate").prop("checked", false);
            $("#bestMoment").prop("checked", false);
            $("#givenDate").prop("checked", false);
            $(".selectpicker-date").val("0");
            $(".show-period-date").hide();
            $("#gotoTimeline").attr("disabled", "disabled");
            $("body").removeClass("activate-duration");
            // Get value to strategy
            strategy = $("#doubleDate").attr("data-value");
            // Reset start and end dates
            $("#startDate").empty().val("");
            $("#endDate").val("");
        });
        // *
        //  Select GivenDate
        // *
        $("#givenDate").on("click", function () {
            $(".givenDate").show();
            $(".doubleSelectDate").hide();
            $(".bestMomentContent").hide();
            $(".singleSelectDate").hide();
            $(".asapContent").hide();
            $(this).prop("checked", true);
            $("#asapDate").prop("checked", false);
            $("#simpleDate").prop("checked", false);
            $("#bestMoment").prop("checked", false);
            $("#doubleDate").prop("checked", false);
            $(".selectpicker-date").val("0");
            $(".show-period-date").hide();
            $("#gotoTimeline").attr("disabled", "disabled");
            $("body").removeClass("activate-duration");
            strategy = $("#givenDate").attr("data-value");
            $("#givenDate").empty().val("");
        });

        // *
        //  Select BESTMOMENT
        // *
        $("#bestMoment").on("click", function () {
            $(".singleSelectDate").hide();
            $(".doubleSelectDate").hide();
            $(".bestMomentContent").show();
            $(".asapContent").hide();
            $(".givenDate").hide();
            $(this).prop("checked", true);
            $("#asapDate").prop("checked", false);
            $("#simpleDate").prop("checked", false);
            $("#doubleDate").prop("checked", false);
            $("#givenDate").prop("checked", false);
            $("body").removeClass("activate-duration");
            $("#gotoTimeline").removeAttr("disabled");
            // Get value to strategy
            strategy = $("#bestMoment").attr("data-value");
            $(".dayStart .date .day").empty();
            $(".dayEnd .date .day").empty();
        });


        // *
        // Select start Date
        // *
        var startDate = $("#startDate").flatpickr({
            minDate: "today",
            enableTime: true,
            time_24hr: true,

            onChange: function (dateObj, dateStr) {
                const isToday = moment().isSame(dateStr, "day");
                if (isToday) {
                    startDate.set("minTime", moment(moment()).format("hh:mm"));
                } else if (!isToday) {
                    startDate.set("minTime", "00:00");
                }

                let startDateToShow = moment(dateStr).format("MMMM, DD YYYY H:mm");

                // Set end date
                endDate.set("minDate", dateStr);
                $(".dayStart .date .day").html(startDateToShow);
                // Set Start calendar date timestamp
                let startCalendar = moment(dateStr).format("M/D/YYYY hh:mm a");
                let newDate = new Date(startCalendar);
                startCalendarDate = newDate;
                // Get start date
                startDateTimeline = moment(dateStr).format("YYYY-MM-DD HH:mm");
                console.log(startCalendarDate);
            },
        });

        // *
        // Select end Date
        // *
        var endDate = $("#endDate").flatpickr({
            enableTime: true,
            time_24hr: true,
            onChange: function (dateObj, dateStr) {
                let endDateToShow = moment(dateStr).format("MMMM, DD YYYY H:mm");

                $(".dayEnd .date .day").html(endDateToShow);

                $("#gotoTimeline").removeAttr("disabled");
                endDateTimeline = moment(dateStr).format("YYYY-MM-DD HH:mm");
                // Set End calendar date timestamp
                let endCalendar = moment(dateStr).format("ddd, MMM D YYYY");
                let endDate = new Date(endCalendar);
                endCalendarDate = endDate;
                console.log(endCalendarDate);
            }
        });

        // *
        // Select startGivenDate Date
        // *
        var startGivenDate = $("#startGivenDate").flatpickr({
            minDate: "today",
            enableTime: true,
            time_24hr: true,

            onChange: function (dateObj, dateStr) {
                const isToday = moment().isSame(dateStr, "day");
                if (isToday) {
                    startGivenDate.set("minTime", moment(moment()).format("hh:mm"));
                } else if (!isToday) {
                    startGivenDate.set("minTime", "00:00");
                }
                $(".dayStart .date .day").empty();
                $(".dayEnd .date .day").empty();
                // Set Start calendar date timestamp
                let startCalendar = moment(dateStr).format("M/D/YYYY hh:mm a");
                let newDate = new Date(startCalendar);
                startCalendarDate = newDate;
                // Get start date
                startDateTimeline = moment(dateStr).format("YYYY-MM-DD HH:mm");
                $("#gotoTimeline").removeAttr("disabled");
            },
        });


        // *
        // Timeline shuffle
        // *
        $("#shuffleTimeline")
            .off("click")
            .on("click", function () {
                postCreation.timeline = [];
                shuffleAction();
            });


        // *
        //  Drag Zone
        // *
        let dragged;
        let id;
        let index;
        let indexDrop;
        let list;

        document.addEventListener("dragstart", ({ target }) => {
            dragged = target;
            id = target.id;
            list = target.parentNode.children;
            target.style.cursor = "move";
            target.style.background = "#ddd2ec";
            for (let i = 0; i < list.length; i += 1) {
                if (list[i] === dragged) {
                    index = i;
                }
            }
        });
        document.addEventListener("dragend", ({ target }) => {
            dragged = target;
            id = target.id;
            list = target.parentNode.children;
            target.style.background = "transparent";
            target.style.cursor = "default";
        });

        document.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        document.addEventListener("drop", ({ target }) => {
            if (target.className == "dropzone" && target.id !== id) {
                dragged.remove(dragged);
                for (let i = 0; i < list.length; i += 1) {
                    if (list[i] === target) {
                        indexDrop = i;
                    }
                }
                if (index > indexDrop) {
                    target.before(dragged);
                    saveTimelineItems();
                } else {
                    target.after(dragged);
                    saveTimelineItems();
                }
            }
        });

        // *
        // Message Notification
        // *
        $("#messageNotification").on("input", function () {
            var maxlength = $(this).attr("maxlength");
            var currentLength = $(this).val().length;
            var titleLength = $("#notificationTitle").val().length;

            if (currentLength <= maxlength) {
                let result = maxlength - currentLength;
                $("#notificationText").text(`${result}`);
            }

            if (currentLength >= 1 && titleLength >= 1) {
                $("#goToOptions").removeAttr("disabled");
            } else {
                $("#goToOptions").attr("disabled", "disabled");
            }
        });

        $("#messageNotification").on("keydown", function (event) {
            const element = document.getElementById("messageNotification");
            if (element.value.length === 0 && event.which === 32) {
                event.preventDefault();
            }
        });

        // *
        // Notification Title
        // *
        $("#notificationTitle").on("input", function () {
            var currentLength = $(this).val().length;
            var messageLength = $("#messageNotification").val().length;

            if (currentLength >= 1 && messageLength >= 1) {
                $("#goToOptions").removeAttr("disabled");
            } else {
                $("#goToOptions").attr("disabled", "disabled");
            }
        });

        $("#notificationTitle").on("keydown", function (event) {
            const element = document.getElementById("notificationTitle");
            if (element.value.length === 0 && event.which === 32) {
                event.preventDefault();
            }
        });

        // *
        //  Resend checkbox
        // *
        $("#resend")
            .off("click")
            .on("click", function () {
                let selectorResend = $("#resend");
                if (selectorResend.is(":checked")) {
                    postCreation.doNotResend = true;
                } else {
                    postCreation.doNotResend = false;
                }
            });

        // *
        //  Modals
        // *
        $("#goBackToMedia").on("click", function () {
            $("#chooseMedia").modal("show");
            $("#chooseMessage").modal("hide");
            currentModal = "chooseMedia";
        });

        $("#goBackToMessage").on("click", function () {
            $("#choosePublishers").modal("hide");
            $("#chooseMessage").modal("show");
            currentModal = "chooseMessage";
        });

        $("#goToMessage")
            .off("click")
            .on("click", function () {
                $("#chooseMedia").modal("hide");
                $("#chooseMessage").modal("show");

                // Pass html message code inside textarea value
                let showMessage = postCreation.message;
                function replaceTextareaHtml(message_to_replace) {
                    return $("<div>").append(message_to_replace.replace(/&nbsp;/g, " ").replace(/<br.*?>/g, "&#13;&#10;")).text();
                }
                $("#segmentComment").val(replaceTextareaHtml(showMessage));

                $("#goToPublisher").removeAttr("disabled");
                currentModal = "chooseMessage";
            });

        $("#goToPublisher")
            .off("click")
            .on("click", function () {
                let segmentComment = $("#segmentComment").val().trim();
                postCreation.message = segmentComment;
                $("#chooseMessage").modal("hide");
                $("#choosePublishers").modal("show");
                getPublishers();
                currentModal = "choosePublishers";
            });

        $("#goToTimeRange")
            .off("click")
            .on("click", function () {
                $("#choosePublishers").modal("hide");
                $("#chooseTimeRange").modal("show");
                postCreation.timeline = members;
                currentModal = "chooseTimeRange";
            });

        $("#backToPublisher").on("click", function () {
            $("#chooseTimeRange").modal("hide");
            $("#choosePublishers").modal("show");
            $("body").removeClass("activate-duration");
            currentModal = "choosePublishers";
        });

        $("#gotoTimeline")
            .off("click")
            .on("click", function () {
                $("#chooseTimeRange").modal("hide");
                $("#chooseTimeline").modal("show");
                $("body").removeClass("activate-duration");
                getTimeline();
                currentModal = "chooseTimeline";
            });

        $("#backToTimeRange").on("click", function () {
            $("#chooseTimeline").modal("hide");
            $("#chooseTimeRange").modal("show");
            $("#addTimelineItems").empty();
            $("#timeOffset span").remove();
            currentModal = "chooseTimeRange";
        });

        $("#goToNotifications")
            .off("click")
            .on("click", function () {
                saveTimelineItems();
                $("#chooseTimeline").modal("hide");
                $("#chooseNotifications").modal("show");
                currentModal = "chooseNotifications";
            });

        $("#backToTimeline").on("click", function () {
            $("#chooseNotifications").modal("hide");
            $("#chooseTimeline").modal("show");
            saveTimelineItems();
            currentModal = "chooseTimeline";
        });

        $("#goToOptions")
            .off("click")
            .on("click", function () {
                $("#chooseNotifications").modal("hide");
                $("#optionsPopup").modal("show");
                let notificationTitle = $("#notificationTitle").val().trim();
                let notificationBody = $("#messageNotification").val().trim();
                postCreation.notification.title = notificationTitle;
                postCreation.notification.body = notificationBody;
                currentModal = "optionsPopup";
            });

        $("#backToNotifications").on("click", function () {
            $("#optionsPopup").modal("hide");
            $("#chooseNotifications").modal("show");
            currentModal = "chooseNotifications";
        });

        $("#saveOptions")
            .off("click")
            .on("click", function () {
                scheduleContent();
            });
    };

    const init = function () {
        bindEvents();
        getDuplicateData();
        selectWidget();
    };

    init();


    return {};
})();
