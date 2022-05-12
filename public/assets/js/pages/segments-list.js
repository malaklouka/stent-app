"use strict";

(function() {

  let _segmentId;
  let _segments = null;

  const getSegments = async function () {

    let fetchSegments = await stent.ajax.getRestAsync("/tenants/" + stent.tenant.key + "/segments");

    if (fetchSegments && fetchSegments.ok && fetchSegments.message) {
      return fetchSegments.message;
    } else {
      stent.toast.danger("Error when trying to fetch the segments. Please refresh the page to try again.");
      return null;
    }

  };


  const buildSegmentsList = function() {

    let displaySegments;
    let filtersCount = 0;

    if (filtersCount === 0) {
      displaySegments = [..._segments];
    } else {

      displaySegments = _segments.filter(() => {

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
        if (_filters.source && _filters.source !== "" && (campaign.source && campaign.source.toLowerCase().includes(_filters.source.toLowerCase()))) {
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

    }


    if (displaySegments.length == 0) {
      $("#segments-result").html(
        `
        <div class="col">
          <div class="alert alert-warning mt-3" role="alert">
            No segment found.
          </div>
        </div>
        `
      );
      return;
    }

    // Table headers
    let html = `
      <div class="col stent-table">
        <table class="table table-vcenter table-hover">
          <thead>
            <tr class="d-flex">
              <th class="col-3">NAME</th>
              <th class="col-1">SCOPE</th>
              <th class="col-3 pr-5 text-right">MATCHES</th>
              <th class="col-3 pl-5">STATUS</th>
              <th class="col-2 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;
    $("#segments-result").html(html);

    // Table content
    html = "";
    displaySegments.forEach(segment => {
      html += segmentDOM(segment);
    });
    $("#segments-result tbody").html(html);

  };

  const segmentDOM = function(segment) {

    /* eslint-disable */
    let rebuildHtml = `
        
      <a 
        href="segments-edit?id=${segment._key}" 
        class="dropdown-item ui-link">
        <i class="fe fe-edit"></i> Edit
      </a>

      <a 
        class="dropdown-item segment-archive"
        id="${segment._key}"
        data-toggle="modal" data-target=".confirm-archive-segment" href="#">
        <i class="fe fe-alert-octagon"></i> Archive
      </a>

      <a 
        class="dropdown-item segment-rebuild"
        id="${segment._key}"
        href="#">
        <i class="fe fe-refresh-cw"></i> Rebuild this segment
      </a>

      <a 
        class="dropdown-item export-as-excel"
        id="${segment._key}"
        href="#">
        <i class="fe fe-database"></i> Export
      </a>

    `;

    let html = "";

    html += `
      <tr data-item-id="${segment._key}" data-item-status="${segment.status}" class="d-flex">
        <td class="col-3">
        <a href="segments-edit?id=${segment._key}" class="ui-link">
          ${segment.name}
        </a>
        
        </td>
        <td class="col-1">
    `;

    if (segment.scope === "identity") {
      html += "<span class=\"badge badge-info\" style=\"font-size: 12px;\">" + segment.scope + "</span>";
    } else {
      html += "<span class=\"badge badge-info\" style=\"font-size: 12px;\">" + segment.scope + "</span>";
    }

    html += `
        </td>
        <td class="col-3 pr-5 align-right">${segment.matches ? segment.matches.toLocaleString("en-US") : "0"}</td>
        <td class="col-3 pl-5">
          <div class="custom-control custom-switch">
          <input 
            type="checkbox" 
            class="custom-control-input segment-status" 
            id="status_${segment._key}" 
            ${
              segment.status == "active" ? "checked='checked'" : ""
            } />
          <label class="custom-control-label" for="status_${segment._key}">
            ${
              segment.status == "active" ? "Started" : "Stopped"
            }
          </label>
        </div>
      </td>
      <td class="col-2 align-right">

        <div class="btn-group mb-2">
          
          <a href="#" class="flex-row align-items-center open-actions" role="button" data-toggle="dropdown">
            <img src="/assets/img/dots-dark.png" />
          </a>
          
          <div class="dropdown-menu dropdown-menu-right dropdown-toggle-no-caret">
            ${segment.job && segment.job.id ? `<span class="ml-3 mr-3">Rebuild in progress</span>` : rebuildHtml}
          </div>
        </div>

      </td>
    </tr>
    `;
    /* eslint-enable */

    return html;
  };

  const updateSegmentStatus = function(itemId) {
    let statusControl = $("#status_" + itemId);
    let status = statusControl.is(":checked");
    let label = $("[for=\"status_" + itemId + "\"]");
    label.text(status ? "Started" : "Stopped");
    stent.loader.hide(statusControl.closest("[data-item-id]"));
  };

  const updateSegmentBuildStatus = function() {
    $("[data-item-id=\"" + _segmentId + "\"]")
      .find(".segment-rebuild")
      .closest("td")
      .html("Rebuilt in progress");
    stent.loader.hide();
  };

  const archiveSegment = function(segmentId) {
    let statusControl = $("#status_" + segmentId);
    stent.loader.hide(statusControl.closest("tr"));
    statusControl.closest("tr").remove();
  };

  const bindEvents = function() {
    $("body")
      .off("click", ".segment-status")
      .on("click", ".segment-status", function() {
        let status = $(this)
          .closest("tr")
          .attr("data-item-status");
        let segmentId = $(this)
          .closest("[data-item-id]")
          .data("item-id");

        let statusValue = status === "active" ? "stop" : "active";
        let statusPayload = { status: statusValue };
        stent.loader.show($(this).closest("[data-item-id]"));
        stent.ajax.putRest(
          "/tenants/" + stent.tenant.key + "/segments/" + segmentId,
          statusPayload,
          updateSegmentStatus
        );
      });

    $(".confirm-archive-segment").on("show.bs.modal", function(e) {
      let $invoker = $(e.relatedTarget);
      let segmentId = $invoker.attr("id");
      $(".confirm-button-archive").attr("data-segment-id", segmentId);
    });

    $(".confirm-button-archive")
      .off("click")
      .on("click", function() {
        let segmentId = $(this).attr("data-segment-id");
        $(".confirm-archive-segment").modal("hide");
        let statusPayload = { status: "archive", visible: false };
        stent.loader.show($(this).closest("tr"));
        stent.ajax.putRest("/tenants/" + stent.tenant.key + "/segments/" + segmentId, statusPayload, archiveSegment);
      });

    $("body")
      .off("click", ".segment-rebuild")
      .on("click", ".segment-rebuild", function() {
        let segmentId = $(this)
          .closest("[data-item-id]")
          .data("item-id");

        _segmentId = segmentId;

        stent.loader.show($(this).closest("[data-item-id]"));
        stent.ajax.putRest(
          "/tenants/" + stent.tenant.key + "/segments/" + segmentId + "/rebuild",
          "",
          updateSegmentBuildStatus
        );
      });

    $("body")
      .off("click", ".export-as-excel")
      .on("click", ".export-as-excel", async function(e) {

        e.preventDefault();

        let segmentId = $(this)
          .closest("[data-item-id]")
          .data("item-id");

        let fetchExportExcel = await stent.ajax.postRestAsync(
          "/tenants/" + stent.tenant.key + "/segments/" + segmentId + "/export"
        );

        if (fetchExportExcel.ok) {
          let email = stent.user.email ? stent.user.email : "your email";
          stent.toast.success("A link to the excel file will be sent to " + email + " as soon as the file is ready to download.");
        } else {
          stent.toast.danger("Error when trying to export the segment as an excel file. Please try again.");
        }

      });

    $("body")
      .off("click", "#new-segment-button")
      .on("click", "#new-segment-button", function() {
        stent.ui.load({ fileToLoad: "segments-edit.html" });
        stent.ui.pushState("segments-edit", false, "segments-edit");
      });
  };

  const init = async function() {

    stent.loader.show(".main-content");

    // Active corresponding menu
    stent.navbar.activeMenu("segments-list");

    // change page title
    stent.ui.setPageTitle("Segments list");

    //bind events
    bindEvents();

    // Load the segments list
    _segments = await getSegments();

    // Build segments DOM
    buildSegmentsList();

    // Remove Loader
    stent.loader.hide();

  };

  init();
})();
