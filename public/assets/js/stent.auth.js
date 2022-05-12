stent.auth = (function () {
  let _roles = [];
  let _wildcard = false;

  var _hostname = window.location.hostname.split(".");
  var _cookiePrefix = _hostname.length > 3 ? _hostname[1] + "." :  "";

  _hostname.shift();
  _hostname = "." + _hostname.join(".");

  const getHostname = function () {
    return _hostname;
  };

  const isWilcard = function () {
    return _wildcard;
  };

  const getBearer = function () {
    return stent.utils.getCookie(`${_cookiePrefix}stnt.idtoken`);
  };

  const getRefreshToken = function () {
    return stent.utils.getCookie(`${_cookiePrefix}stnt.refreshtoken`);
  };

  const getUserIdentityKey = function () {
    if (
      stent.user &&
      stent.user.identities &&
      stent.user.identities["http://schemas.stent.io/identity/key"] &&
      Array.isArray(stent.user.identities["http://schemas.stent.io/identity/key"]) &&
      stent.user.identities["http://schemas.stent.io/identity/key"].length > 0
    ) {
      return stent.user.identities["http://schemas.stent.io/identity/key"][0];
    }
    return null;
  };

  const doRefreshToken = async function () {
    return await stent.ajax.postAuthAsync("/passwordless/refresh", {
      refresh_token: getRefreshToken(),
      client_id: stent.authentication.client,
    });
  };

  const getUserProfile = async () => {
    const url = stent.api.api;
    const method = "POST";
    let bearer = "Bearer " + getBearer();
    const contentType = "application/json";

    const query = {
      query: `query {
        userContext {
          user {
            id
            email
            firstName
            lastName
            pictureUrl
          }
        }
      }`,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": contentType,
          Authorization: bearer,
        },
        body: JSON.stringify(query),
      });

      if (response.status === 200) {
        let jsonResponse = await response.json();
        let out = {
          ok: true,
          message: jsonResponse,
        };
        return out;
      } else {
        let errorMessage = await response.text();
        let out = {
          ok: false,
          error: {
            status: response.status,
            method: "getUserProfile",
            message: errorMessage,
          },
        };
        return out;
      }
    } catch (errorMessage) {
      let out = {
        ok: false,
        error: {
          status: "N/A",
          method: "getUserProfile",
          message: errorMessage,
        },
      };
      return out;
    }
  };

  const cleanCookiesAndLocalStorage = function () {

    localStorage.removeItem(`${_cookiePrefix}stnt.idtoken`);
    localStorage.removeItem(`${_cookiePrefix}stnt.refreshtoken`);

    var domainName = ".stent.io";
    var cookieNameOld = "aat." + window.location.hostname;
    document.cookie = cookieNameOld + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=" + _hostname;

    var cookieName = `${_cookiePrefix}stnt.idtoken`;
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=" + domainName;

    cookieName = `${_cookiePrefix}stnt.refreshtoken`;
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=" + domainName;
  };

  const isBearerExpired = function () {
    let bearer = getBearer();

    if (!bearer) {
      return false;
    }

    let decodedBearer = stent.utils.parseJwt(bearer);
    let expireTimestamp = decodedBearer.exp ? decodedBearer.exp * 1000 : 0;
    if (new Date().getTime() > expireTimestamp) {
      return true;
    }

    return false;
  };

  const getRoles = function () {
    return _roles;
  };

  var redirectToAuthPage = function () {
    document.location.href =
      stent.authentication.loginUrl +
      "?client=" +
      encodeURIComponent(stent.authentication.client) +
      "&redirectUrl=" +
      window.location.href;
  };

  var getTenantData = async function () {

    /*eslint-disable */
    var query = `
      query {
        workspaceContext {
          workspace {
            organization {
              state
            }
            id
            company {
                name
                logoUrl
            }
            locale{
                timezone
            }
          }
        }
      }`
    /*eslint-enable */
    let result = await stent.ajax.getApiAsync(query, "POST");

    if (result.toString().includes("Failed to fetch")) {
      stent.ui.loadError({ fileToLoad: "/errors/500.html" });
      $(".navbar").addClass("d-none");
      $(".main-content").css("margin-left", 0);
      return false;
    }

    if (
      result &&
      result.ok === true &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.workspace
    ) {

      let workspaceObject = result.message.data.workspaceContext.workspace;
      let tenantObject = {
        key: workspaceObject.id,
        name: workspaceObject.company && workspaceObject.company.name ? workspaceObject.company.name : null,
        logo: workspaceObject.company && workspaceObject.company.logoUrl ? workspaceObject.company.logoUrl : null,
        timezone: workspaceObject.locale && workspaceObject.locale.timezone ? workspaceObject.locale.timezone : null,
        organization: workspaceObject.organization ? workspaceObject.organization : null
      };

      stent.tenant = {
        ...stent.tenant,
        ...tenantObject,
      };

      stent.utils.log(stent.tenant);
    } else {
      // user is not in a tenant => Redirect to no-tenant error page
      stent.ui.loadError({ fileToLoad: "/errors/no-tenant.html" });
      $(".navbar").addClass("d-none");
      $(".main-content").css("margin-left", 0);
      return false;
    }

    return true;
  };

  var init = async function () {

    let bearer = getBearer();
    let refreshToken = getRefreshToken();

    if (
      (bearer === "null" || bearer === null || bearer === "" || typeof bearer === "undefined") &&
      (refreshToken === "null" || refreshToken === null || refreshToken === "" || typeof refreshToken === "undefined")
    ) {
      cleanCookiesAndLocalStorage();
      redirectToAuthPage();
      return;
    } else {
      // If the bearer is bad AND we have a refresh token
      if (
        (bearer === "null" || bearer === null || bearer === "" || typeof bearer === "undefined" || isBearerExpired()) &&
        refreshToken
      ) {
        // Regenerate the token
        let refreshTokenRequest = await doRefreshToken();

        // Error when try to refresh the token
        if (
          !refreshTokenRequest.ok ||
          !refreshTokenRequest.message ||
          !refreshTokenRequest.message.refresh_token ||
          !refreshTokenRequest.message.access_token
        ) {
          cleanCookiesAndLocalStorage();
          redirectToAuthPage();
          return;
        }

        // IMPORTANT !
        // Cookies are setted the the response Header of the doRefreshToken request

        // Set the variables with the updated values
        bearer = getBearer();
        refreshToken = getRefreshToken();
      }
    }

    // Set tenant key
    stent.tenant.key = document.location.pathname.split("/")[1];

    let jwt = stent.utils.parseJwt(getBearer());

    if (jwt["http://schemas.stent.io/identity/claims/tenants"] === "*") {
      _wildcard = true;
    }

    stent.user = {};

    let fetchUserIdentity = await getUserProfile();

    if (
      fetchUserIdentity.ok === true &&
      fetchUserIdentity.message &&
      fetchUserIdentity.message.data &&
      fetchUserIdentity.message.data.userContext &&
      fetchUserIdentity.message.data.userContext.user
    ) {
      stent.user.id = fetchUserIdentity.message.data.userContext.user.id
        ? fetchUserIdentity.message.data.userContext.user.id
        : null;

      stent.user.email = fetchUserIdentity.message.data.userContext.user.email
        ? fetchUserIdentity.message.data.userContext.user.email
        : null;

      stent.user.firstName = fetchUserIdentity.message.data.userContext.user.firstName
        ? fetchUserIdentity.message.data.userContext.user.firstName
        : null;

      stent.user.lastName = fetchUserIdentity.message.data.userContext.user.lastName
        ? fetchUserIdentity.message.data.userContext.user.lastName
        : null;

      stent.user.pictureUrl = fetchUserIdentity.message.data.userContext.user.pictureUrl
        ? fetchUserIdentity.message.data.userContext.user.pictureUrl
        : null;

      // Manage identities
      stent.user.identities = {};

      // Loop on JWT properties to find identities
      for (let prop in jwt) {
        if (prop.includes("http://schemas.stent.io/identity/")) {
          // Push always an array of identity Keys, not a string if only one identity available
          if (prop === "http://schemas.stent.io/identity/key" && typeof jwt[prop] === "string") {
            stent.user.identities[prop] = [jwt[prop]];
          } else {
            stent.user.identities[prop] = jwt[prop];
          }
        }
      }
    }

    stent.utils.log(stent.user);

    if (window["logInSentry"]) {
      // Sentry user object sent with error
      let sentryUserObject = { ...stent.user };
      delete sentryUserObject.pictureUrl;
      Sentry.setUser(sentryUserObject);
    }

    if (jwt.role && jwt.role === "customer:admin") {
      _roles.push(jwt.role);
    }

    if (stent.tenant.key) {
      return await getTenantData();
    }

    return true;
  };

  return {
    getBearer,
    getRefreshToken,
    getRoles,
    getHostname,
    getUserIdentityKey,
    isBearerExpired,
    redirectToAuthPage,
    cleanCookiesAndLocalStorage,
    isWilcard,
    init,
    refreshToken: doRefreshToken,
  };
})();
