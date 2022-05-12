stent.navbar = (function () {
  let userIsCustomerAdmin = stent.auth.getRoles().includes("customer:admin");

  const getMenu = async function () {

    let query = `
      query {
        workspaceContext {
          navigation {
            items {
              id
              icon
              type
              href
              name
              items {
                id
                icon
                type
                href
                name
              }
            }
          }
        }
      }`;

    if (stent.log) {
      stent.konsole.group("getMenu");
      stent.konsole.log({data: query});
    }

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.navigation &&
      result.message.data.workspaceContext.navigation.items) {

      if (stent.log) {
        stent.konsole.log({response: result.message.data.workspaceContext.navigation});
        stent.konsole.endGroup();
      }

      if (result.message.data.workspaceContext.navigation.items.length > 0) {
        return result.message.data.workspaceContext.navigation.items;
      } else {
        return null;
      }

    } else {

      if (stent.log) {
        stent.konsole.error({response: result});
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to fetch the navigation. Please refresh the page to try again.");
      stent.loader.hide();

      return null;
    }

  };

  const buildMenu = async function () {
    let items = await getMenu();

    if (items) {

      let html = "";

      html += "<ul class=\"navbar-nav\">";

      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let hasChildrens = item.items && item.items.length > 0;
        let childrens = hasChildrens && item.items ? item.items : null;
        let href = item.href ? item.href : null;
        let name = item.name ? item.name : "";
        let icon = item.icon ? item.icon : "";
        let id = item.id ? item.id : null;

        /*eslint-disable*/
          if (item.type === "separator") {
            html += `<li style="margin-left: -18px;margin-right: -18px;"><hr class="navbar-divider my-3" /></li>`;
          } else {
            if (!hasChildrens) {
              html += `
                <li class="nav-item">
                  <a href="${href}" class="nav-link ui-link">
                    <i class="fe ${icon}"></i> ${name}
                  </a>
                </li>
              `;
            } else {
              html += `
                <li class="nav-item">
                  <a class="nav-link" href="#${id}" data-toggle="collapse" role="button" aria-controls="${id}"><i class="fe ${icon}"></i> ${name}</a>
                  <div class="collapse" id="${id}">
                    <ul class="nav nav-sm flex-column">
                      ${childrens
                        .map((child) => {
                          let href = child.href ? child.href : null;
                          let name = child.name ? child.name : "";
                          return `<li class="nav-item"><a href="${href}" class="nav-link ui-link">${name}</a></li>`;
                        })
                        .join("")}
                    </ul>
                  </div>
                </li>
              `;
            }
          }
          /*eslint-enable*/
      }

      html += "</ul>";

      $("#sidebarCollapse").html(html);

      return true;
    } else {
      return false;
    }
  };

  const initTenantsManagement = async function () {
    // Current workspace
    if (stent.tenant.logo && stent.tenant.logo !== "") {
      $("#navigation-header > a").html(
        `<div style="background-image:url('${stent.tenant.logo}');" id="workspace-logo"></div>`
      );
    } else {
      $("#navigation-header > a").html(stent.utils.generateInitialsLogo(stent.tenant.name));
    }

    // Signout link
    $("#sign-out-link").attr("href", $("#sign-out-link").attr("href") + "?tenantKey=" + stent.tenant.key);

    // Set stent workspace name
    $("#workspace-name").text(stent.tenant.name);

    // User account menu
    let displayName = stent.user.firstName + " " + stent.user.lastName;

    let avatarUrl = stent.user.pictureUrl ? stent.user.pictureUrl : "/assets/img/avatars/profiles/default-avatar.gif";

    // Set user Avatar
    $("#user-wrapper").prepend(`<div id="user-name">${displayName}</div>`);

    // Set user Name
    $("#user-wrapper").prepend(
      `<img 
          id="user-avatar"
          src="${avatarUrl}" 
          class="avatar dropdown-toggle"
          data-toggle="dropdown" 
          onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif';" 
          alt="${displayName}" />`
    );

    let userTenantsRequest = await stent.ajax.getRestAsync("/tenants");
    let userTenants = [];

    if (userTenantsRequest.ok && userTenantsRequest.ok === true && userTenantsRequest.message) {
      $("#tenants-list-wrapper").show();
      userTenants = [...userTenantsRequest.message];
    } else {
      $("#restart-filter-tenants").show();
      stent.toast.danger("Error during get workspaces list process.");
    }

    // stent.loader.hide();

    let tenantsHTML = "";

    if (userTenants.length > 0) {
      userTenants.forEach((tenant) => {
        /* eslint-disable */
        tenantsHTML += `
          <a 
            data-tenant-id="${tenant._id}" 
            data-tenant-host="${tenant.host}" 
            data-href="${window.location.origin + "/" + tenant._id.replace(/tenants\//gi, "")}/" 
            href="${window.location.origin + "/" + tenant._id.replace(/tenants\//gi, "")}/"
            class="name">
            ${
              tenant.company && tenant.company.logo
                ? `<img src="${tenant.company.logo}" title="${tenant.company.name}" alt="${tenant.company.name}" />`
                : stent.utils.generateInitialsLogo(
                    tenant.company && tenant.company.name ? tenant.company.name : tenant.host
                  )
            }
            <span class="name">${tenant.company.name}</span>
          </a>
        `;
        /* eslint-enable */
      });

      $("#workspaces .list").html(tenantsHTML);

      // Necessary to get the client side filter feature works
      stent.list.add($("#workspaces-wrapper"), {
        valueNames: ["name"],
      });
    }

    // Manage if the user has only one tenant
    if (userTenants.length === 1) {
      $("#workspaces").empty();
    }

    if (!userIsCustomerAdmin) {
      $("#go-to-admin-wrapper").remove();
      // $("#new-tenant-wrapper").remove();
    } else {
      $("#go-to-admin-wrapper").css("display", "flex");
      // $("#new-tenant-wrapper").css("display", "flex");
    }

    if (userTenants.length === 1 && !userIsCustomerAdmin) {
      $("#search-and-admin-wrapper").remove();
    }
  };

  const activeMenu = function (href) {
    // check href
    if (!href || href === "") {
      $("#sidebarCollapse .active").removeClass("active");
    } else {
      var $menuToActive = $("#sidebarCollapse [href^=\"" + href + "\"]");

      if ($menuToActive.hasClass("active")) return;

      $("#sidebarCollapse .active").removeClass("active");

      $menuToActive.addClass("active");
      if (!$menuToActive.closest(".collapse").hasClass("show")) {
        $menuToActive.closest(".collapse").addClass("show");
        $menuToActive.closest(".collapse").prev().attr("aria-expanded", true);
      }
    }
  };

  const cleanList = function () {
    $("#filter-tenant").val("");
    stent.list.get()["workspaces-wrapper"].search();
    $("#workspaces .selected").removeClass("selected");
  };

  const bindEvents = function () {
    $("#sidebarCollapse").on("click", ".nav-link", function () {
      if (!$(this).hasClass("active")) {
        $("#sidebarCollapse .active").removeClass("active");
        $(this).addClass("active");
      }
    });

    $("#search-tenant").on("click", function () {
      openWorkSpacesPanel();
    });

    $("#close-search").on("click", function () {
      closeWorkSpacesPanel();
    });
  };

  const openWorkSpacesPanel = function () {
    bindKeyboardNavigation();
    $("#workspaces-wrapper-column").addClass("complete");
    setTimeout(function () {
      focusOnFilterTenantInput();
    }, 150);
  };

  const closeWorkSpacesPanel = function () {
    cleanList();
    unbindKeyboardNavigation();
    $("#workspaces-wrapper-column").removeClass("complete");
  };

  const focusOnFilterTenantInput = function () {
    $("#filter-tenant").focus();
  };

  const scrollToTenantElement = function (elementIndex) {
    if (typeof elementIndex !== "undefined") {
      $("#workspaces").animate(
        {
          scrollTop: elementIndex * 40 - $("#workspaces").height() / 2,
        },
        0
      );
    }
  };

  const bindKeyboardNavigation = function () {
    // Keycodes =>
    // UP: 38
    // DOWN : 40
    // ENTER : 13
    // ECHAP : 27

    $("body")
      .off("keydown")
      .on("keydown", function (e) {
        // Count elements visible in list
        let $tenantsList = $("#workspaces .list a");
        let countTenants = $tenantsList.length;
        let $selectedTenant = $("#workspaces .list a.selected");
        let currentSelectedIndex = $tenantsList.index($selectedTenant);

        switch (e.keyCode) {
          // Echap key
          case 27:
            closeWorkSpacesPanel();
            break;

          // Enter key
          case 13:
            if ($selectedTenant.length > 0) {
              let url = $selectedTenant.attr("data-href");
              if (url !== "") {
                $("#tenantModal").modal("hide");
                stent.loader.show($("body"), 1032);
                location.replace(url);
              }
            }
            break;

          // Key down
          case 40:
            $selectedTenant.removeClass("selected");

            // If no tenant is selected, select the first in the list
            if (countTenants > 0) {
              $selectedTenant.removeClass("selected");

              if (currentSelectedIndex === -1) {
                $($tenantsList[0]).addClass("selected");
                scrollToTenantElement(0);
              } else {
                $($tenantsList[currentSelectedIndex + 1]).addClass("selected");
                scrollToTenantElement(currentSelectedIndex + 1);
              }
            }
            break;

          // Key up
          case 38:
            $selectedTenant.removeClass("selected");

            // If no tenant is selected, select the last in the list
            if (countTenants > 0) {
              if (currentSelectedIndex === -1) {
                $($tenantsList[countTenants - 1]).addClass("selected");
                scrollToTenantElement(countTenants - 1);
              } else {
                $($tenantsList[currentSelectedIndex - 1]).addClass("selected");
                scrollToTenantElement(currentSelectedIndex - 1);
              }
            }
            break;

          // Others keys
          default:
            $selectedTenant.removeClass("selected");
            scrollToTenantElement(0);

            break;
        }
      });
  };

  const unbindKeyboardNavigation = function () {
    $("body").off("keydown");
  };

  const init = async function () {
    bindEvents();
    initTenantsManagement();

    let menuHasBeenBuild = await buildMenu();

    if (menuHasBeenBuild) {
      stent.ui.loadFirstPage();
    } else {
      stent.ui.loadError({ fileToLoad: "/errors/500.html" });
    }

  };

  return {
    init: init,
    activeMenu: activeMenu,
  };
})();
