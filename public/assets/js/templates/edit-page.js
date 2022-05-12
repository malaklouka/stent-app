"use strict";
(function() {
  let _itemId;

  // Load item
  const loadFormData = function() {
    let params = new URLSearchParams(location.search);
    let itemId = params.get("id");
    if (itemId == null) {
      stent.loader.hide();
      $("#item-form-loader").hide();
      $("#item-form").toggleClass("d-none");
      return;
    }

    // If existing item, unselect menu
    stent.navbar.activeMenu();

    // get item
    stent.ajax.getRest("/tenants/" + stent.tenant.key + "/{controller}/" + itemId, buildFormData);
  };

  // Initialize form data
  const buildFormData = function(item) {
    if (item) {
      _itemId = item._key;
      $(".main-content h1").text("Edit an item");
      $("#item-form").toggleClass("d-none");
      $("#item-name").val(item.name);
      $("#item-description").val(item.description);
      $("#item-option option[value='" + item.option + "']").prop("selected", true);
    } else {
      $("#no-item").toggleClass("d-none");
    }
    $("#item-form-loader").hide();
  };

  const bindEvents = function() {
    $("#item-save")
      .off("click")
      .on("click", function() {
        save();
      });
  };

  const saveItemCallback = function() {
    stent.loader.hide();
    stent.ui.pushState("tenant-items-list", false, "tenant-items-list");
    stent.ui.load({ fileToLoad: "tenant-items-list" });
  };

  const save = function() {
    let item = {
      name: $("#item-name").val(),
      description: $("#item-description").val(),
      option: $("#item-option").val()
    };

    stent.loader.show(".main-content");
    let itemUrl = "/tenants/" + stent.tenant.key + "/items";
    if (_itemId) {
      stent.ajax.putRest(itemUrl + "/" + _itemId, item, saveItemCallback);
    } else {
      stent.ajax.postRest(itemUrl, item, saveItemCallback);
    }
    stent.utils.log(item);
  };

  const init = function() {
    // master loader
    stent.loader.show("#item-form-loader");

    // Active corresponding menu
    stent.navbar.activeMenu("tenant-items-edit");

    // change Page title
    stent.ui.setPageTitle("Workspace items edit");

    //bind events
    bindEvents();

    // Get data
    loadFormData();
  };

  init();
})();
