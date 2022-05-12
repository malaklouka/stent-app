stent.chooseTenant = function () {

  let userTenants = [];

  const initList = function () {

    let tenantsHTML = "";

    if (userTenants.length > 0) {

      userTenants.forEach(tenant => {
        /* eslint-disable */
       tenantsHTML += `
         <a 
           class="name aTenant" 
           href="${window.location.origin + '/' + tenant._id.replace(/tenants\//gi, '') + '/' + window.location.search}"
           >
           ${tenant.company && tenant.company.logo ?
             `<span class="logo" style="background-image:url('${tenant.company.logo}');"></span>`:
             stent.utils.generateInitialsLogo(tenant.company && tenant.company.name ? tenant.company.name : tenant.host)
           }
           <span class="name dislayName">${tenant.company.name}</span>
         </a>
       `;
       /* eslint-enable */
      });

      $("#tenants-list").html(tenantsHTML);

      //Necessary to get the client side filter feature works
      stent.list.add($("#chooseTenantForm"), {
        valueNames: ["name"]
      });

    }
  };

  const scrollToTenantElement = function (elementIndex) {
    if (typeof elementIndex !== "undefined") {
      $("#tenants-list").animate({
        scrollTop: (elementIndex * 36) - ($("#tenants-list").height() / 2)
      },0);
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
        let $tenantsList = $("#tenants-list .aTenant");
        let countTenants = $tenantsList.length;
        let $selectedTenant = $("#tenants-list .aTenant.selected");
        let currentSelectedIndex = $tenantsList.index($selectedTenant);

        switch (e.keyCode) {

          // Enter key
          case 13:
            if ($selectedTenant.length > 0) {
              let url = $selectedTenant.attr("href");
              if (url !== "") {
                window.location.href = url;
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

  const init = async function () {

    // Check if the user is connected
    let bearer = stent.auth.getBearer();

    if (!bearer) {
      stent.auth.cleanCookiesAndLocalStorage();
      stent.auth.redirectToAuthPage();
      return;
    }

    let userTenantsRequest = await stent.ajax.getRestAsync("/tenants");

    if (userTenantsRequest.ok && userTenantsRequest.ok === true && userTenantsRequest.message) {

      userTenants = [...userTenantsRequest.message];

      if (userTenants.length === 1) {
        let redirectUrl = window.location.href + `${userTenants[0]._id.replace(/tenants\//gi, "")}`;
        stent.utils.log(redirectUrl);
        window.location = redirectUrl;
      } else {
        setTimeout(
          function () {
            $("#loader").removeClass("visible");
          }, 1000
        );

        initList();
        bindKeyboardNavigation();
      }

    } else {

      $("#chooseTenantForm").html(`
        <div class="alert alert-danger fade show" role="alert">
          There was an error during the get workspaces process. <a style="color: white; text-decoration: underline;" href="./">Retry</a>
        </div>
        `
      );

    }
  };

  return {
    init
  };

}() ;