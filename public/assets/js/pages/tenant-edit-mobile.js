/* eslint-disable indent */
"use strict";

stent.planificationMobile = (function () {
    console.log("====================================");
    console.log("Tenant edit mobile.js");
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

    // *
    // DATE Set Strategy and start end time
    // *
    let startCalendarDate = "";
    let endCalendarDate = "";
    let strategy = "";
    let startDateTimeline = "";
    let endDateTimeline = "";
    let durationStrategy = "";

    // Publisher Everyone option
    let everyone = false;

    // *
    // Post Creation
    // *
    let postCreation = {
        channelId: "",
        mediaId: "",
        doNotResend: true,
        reactions: false,
        sharing: false,
        message: "",
        date: "",
        notification: {
            title: "",
            body: "",
        },
        audience: [],
    };

    // *
    //  Get duplicate data to replace PostCreation
    // *
    const getEditNewsfeedData = async function () {
        let getScheduleID = $("#chooseQueue").attr("data-id");

        let query = `query {
                        workspaceContext {
                            contentScheduleById(id: "${getScheduleID}") {
                            type: __typename
                            ... on NewsfeedRecommendationContentSchedule {
                                media {
                                    ... on Node {
                                        id
                                        __typename
                                    }
                                }
                                body
                                notification {
                                    title
                                    body
                                }
                                from
                                audience {
                                type: __typename
                                ... on WorkspaceMember {
                                    id
                                    firstName
                                    lastName
                                    pictureUrl
                                }
                                ... on WorkspaceGroup {
                                    id
                                    name
                                }
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
                channelId: knowChannel == "NewsfeedRecommendationContentSchedule" ? "stent-newsfeed" : "",
                mediaId: result.message.data.workspaceContext.contentScheduleById.media.id,
                doNotResend: false,
                reactions: false,
                sharing: false,
                message: result.message.data.workspaceContext.contentScheduleById.body,
                notification: {
                    title: result.message.data.workspaceContext.contentScheduleById.notification.title,
                    body: result.message.data.workspaceContext.contentScheduleById.notification.body,
                },
                audience: result.message.data.workspaceContext.contentScheduleById.audience,
            };
            // Select Media type and pass it to get the default value.
            let selectedMediaType = result.message.data.workspaceContext.contentScheduleById.media.__typename;
            members = result.message.data.workspaceContext.contentScheduleById.audience;

            // Set Notification title
            let notificationTitle = result.message.data.workspaceContext.contentScheduleById.notification.title;
            if (notificationTitle) {
                $("#notificationTitle").val(notificationTitle);
            }
            // Set Notification body
            let notificationBody = result.message.data.workspaceContext.contentScheduleById.notification.body;
            if (notificationBody) {
                $("#messageNotification").val(notificationBody);
            }

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

            // Pass actual date into html
            let acutalDate = result.message.data.workspaceContext.contentScheduleById.audience;
            let $dateSchedule = $("#currentDateSchedule");

            acutalDate.map(item => {
                $dateSchedule.append(function (i) {
                    return `<span> ${moment(item.publishedAt).format("MMMM, DD YYYY H:mm")}</span>`;
                });
            });
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
                        members(where: { channel: LINKEDIN status: ACTIVE}, first: ${initialPublishers}) {
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
                };
            } else if (publisher.type === "WorkspaceMember") {
                return {
                    id: `${publisher.id}`,
                    text: publisher.firstName + " " + publisher.lastName,
                    pictureUrl: publisher.pictureUrl ? publisher.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif",
                    type: `${publisher.type}`,
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
        const ids = members.map(({ id }) => id);
        members = [];
        // Filter and add value to selected mebmers
        options.filter(({ id }) => ids.includes(id)).forEach(({ id, type }) => {
            $("#publisherShow option[value='" + id + "']").prop("selected", true);
            members.push({ id: id, type: type });
        });

        postCreation.audience = members;

        $("#publisherShow").trigger("change");
        $("#goToTimeRange").removeAttr("disabled");

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
                $("#goToNotifications").removeAttr("disabled");
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
        let getScheduleID = $("#chooseQueue").attr("data-id");

        var timelineToSave = postCreation.audience.reduce((prev, { type, id }) => {
            return `${prev}
            {
                type: ${type === "WorkspaceMember" ? "MEMBER" : "GROUP"}
                id: "${id}"
            }`;
        }, "");

        let membersToPass = function () {
            if (!everyone) {
                return `audience: [${timelineToSave}]`;
            } else {
                return "";
            }
        };

        let reactions = postCreation.reactions;
        let sharing = postCreation.sharing;

        postCreation.mediaId = mediaId;
        postCreation.message = segmentComment;
        postCreation.notification.title = notificationTitle;
        postCreation.notification.body = notificationBody;

        let segmentToPass = JSON.stringify(segmentComment);

        let query = `
            mutation {  
            workspaceContext{
                    updateNewsfeedRecommendationContentSchedule(
                        id: "${getScheduleID}"
                        input: {
                            mediaId: "${mediaId}"
                            allowReactions: ${reactions}
                            allowSharing: ${sharing} 
                            message: ${segmentToPass}
                            ${membersToPass()}                            
                            date:"${postCreation.date}"
                            notification: {
                                title: "${notificationTitle}"       
                                body: "${notificationBody}"
                            }
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
            $(".asapContent").show();
            $(this).prop("checked", true);
            // $("#simpleDate").prop("checked", false);
            $("#doubleDate").prop("checked", false);
            $("#goToNotifications").removeAttr("disabled");
            // Get value to strategy
            strategy = $("#asapDate").attr("data-value");
            $("body").removeClass("activate-duration");
            let todayDate = moment().format("YYYY-MM-DD HH:mm");
            postCreation.date = `${todayDate}`;
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
            $(".asapContent").hide();
            $(this).prop("checked", true);
            $("#asapDate").prop("checked", false);
            $(".selectpicker-date").val("0");
            $(".show-period-date").hide();
            $("#goToNotifications").attr("disabled", "disabled");
            $("body").removeClass("activate-duration");
            strategy = $("#doubleDate").attr("data-value");
            $("#startDate").empty().val("");
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
                // Get start date
                startDateTimeline = moment(dateStr).format("YYYY-MM-DD HH:mm");
                postCreation.date = startDateTimeline;
                $("#goToNotifications").removeAttr("disabled");
            },
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

        $("#reactions")
            .off("click")
            .on("click", function () {
                let selectorResend = $("#reactions");
                if (selectorResend.is(":checked")) {
                    postCreation.reactions = true;
                } else {
                    postCreation.reactions = false;
                }
            });

        $("#sharing")
            .off("click")
            .on("click", function () {
                let selectorResend = $("#sharing");
                if (selectorResend.is(":checked")) {
                    postCreation.sharing = true;
                } else {
                    postCreation.sharing = false;
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
                currentModal = "chooseTimeRange";
                postCreation.audience = members;
            });

        $("#backToPublisher").on("click", function () {
            $("#chooseTimeRange").modal("hide");
            $("#choosePublishers").modal("show");
            $("body").removeClass("activate-duration");
            currentModal = "choosePublishers";
        });

        $("#goToNotifications")
            .off("click")
            .on("click", function () {
                $("#chooseTimeRange").modal("hide");
                $("#chooseNotifications").modal("show");
                currentModal = "chooseNotifications";
            });

        $("#backToTimeline").on("click", function () {
            $("#chooseNotifications").modal("hide");
            $("#chooseTimeRange").modal("show");
            currentModal = "chooseTimeRange";
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
        getEditNewsfeedData();
        selectWidget();
    };

    init();


    return {};
})();
