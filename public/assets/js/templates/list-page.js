(function() {
  const loadItemsList = function() {
    stent.loader.show("#items-result");
    stent.ajax.getRest("/tenants/" + stent.tenant.key + "/items", buildItemsList);
  };

  const buildItemsList = function(result) {
    if (!result || result.length == 0) {
      $("#items-result-col").html("No item found");
      stent.loader.hide();
      return;
    }

    let html = "";
    html += `<table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Scope</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
    </table>`;

    html += "</ul>";
    $("#items-result-col").html(html);
    html = "";
    result.forEach(element => {
      html += itemsListDOM(element);
    });
    $("#items-result tbody").append(html);
    stent.loader.hide();
    return;
  };

  const itemsListDOM = function(item) {
    let html = "";

    html += `<tr data-item-id="${item._key}">
        <td scope="row"><a href="tenant-items-edit?id=${item._key}" class="ui-link">Edit</a></td>
        <td>${item.name}</td>
        <td>${item.scope}</td>
        </tr>`;

    return html;
  };

  const bindEvents = function() {
    $("body")
      .off("click", "#new-item-button")
      .on("click", "#new-item-button", function() {
        stent.ui.load({ fileToLoad: "tenant-items-edit.html" });
      });
  };

  const init = function() {
    // Active corresponding menu
    stent.navbar.activeMenu("tenant-items-list");

    // change Page title
    stent.ui.setPageTitle("Workspace items list");

    //bind events
    bindEvents();

    // Load the items list
    loadItemsList();
  };

  init();
})();
