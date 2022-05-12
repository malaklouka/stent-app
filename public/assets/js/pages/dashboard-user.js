stent.requireJS(["widgets"], function () {

  // Active corresponding menu
  stent.navbar.activeMenu("dashboard-user");

  // change Page title
  stent.ui.setPageTitle("User dashboard");

  // Build dashboard object
  stent.userDashboard = (function () {

    let identity = stent.utils.getURLParam("id");

    const loadIdentities = function () {
      stent.ajax.getRest("/tenants/" + stent.tenant.key + "/members", populateIdentitiesSelect);
    };

    const populateIdentitiesSelect = function (items) {
      $("#filter-identities").empty();

      let option = new Option("All ambassadors", "");
      $("#filter-identities").append($(option));

      items.sort(stent.utils.sortArrayOfObjectByPropertyName("firstName"));
      items.forEach(function (item) {
        let option = new Option(item.lastName + " " + item.firstName, item.id);
        $("#filter-identities").append($(option));
      });

      setIdentityFilter();
      loadAsyncCharts();

    };

    const setIdentityFilter = function () {

      let id = stent.utils.getURLParam("id");
      if (id) {
        $("#filter-identities [value=\"" + id + "\"]").prop("selected", true);
      }

    };

    const loadAsyncCharts = function () {
      stent.widgets.get().forEach(widget => stent.widgets.refresh(widget.guid));
    };

    const bindEvents = function () {

      $("#filter-identities")
        .off("change")
        .on("change", function () {

          let identity = $(this).val();
          stent.userDashboard.identity = identity;

          let location;

          if (identity !== "") {
            location = stent.utils.getURLWithUpdatedParam("id", identity);
          } else {
            location = stent.utils.getURLRemovedParam("id");
          }

          stent.ui.pushState("dashboard-user", false, location);

          //let widgetSSI = stent.widgets.getByName("home-header-chart");
          //stent.widgets.refresh(widgetSSI.guid);

          let widgetsList = stent.widgets.get();
          widgetsList.map(widget => stent.widgets.refresh(widget.guid));

        });

    };

    const init = function () {

      loadIdentities();
      bindEvents();

    };

    init();

    return {
      identity
    };

  })();

});