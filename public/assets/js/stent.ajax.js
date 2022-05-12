stent.ajax = (function () {

  var getGraphQL = function (graphQuery, callback, callbackError, forceUrl) {
    var query = {
      query: graphQuery
    };
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var graphRequest = {
      method: "POST",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(query)
    };
    processCallbackRequest((forceUrl ? forceUrl : stent.api.graphQL), graphRequest, callback, callbackError);
  };

  var getRest = function (path, callback, callbackError, forceUrl) {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "GET",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default"
    };
    processCallbackRequest((forceUrl ? forceUrl : stent.api.rest) + path, restApiRequest, callback, callbackError);
  };

  var postRest = function (path, body, callback, callbackError, forceUrl) {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "POST",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body)
    };
    processCallbackRequest((forceUrl ? forceUrl : stent.api.rest) + path, restApiRequest, callback, callbackError);
  };

  var putRest = function (path, body, callback, callbackError, forceUrl) {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "PUT",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: body ? JSON.stringify(body) : ""
    };
    processCallbackRequest((forceUrl ? forceUrl : stent.api.rest) + path, restApiRequest, callback, callbackError);
  };

  var patchRest = function (path, body, callback, callbackError, forceUrl) {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "PATCH",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: body ? JSON.stringify(body) : ""
    };
    processCallbackRequest((forceUrl ? forceUrl : stent.api.rest) + path, restApiRequest, callback, callbackError);
  };

  var deleteRest = function (path, body, callback, callbackError, forceUrl) {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "DELETE",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body)
    };
    processCallbackRequest((forceUrl ? forceUrl : stent.api.rest) + path, restApiRequest, callback, callbackError);
  };

  var processCallbackError = function (statusCode, error, callbackError) {
    if (typeof callbackError === "function") {
      callbackError(error);
      return;
    }
    // Set error Message globally
    stent.error = error;
    switch (statusCode) {
      case 401:
        stent.ui.loadError({ fileToLoad: "/errors/401.html" });
        break;
      case 404:
        stent.ui.loadError({ fileToLoad: "/errors/404.html" });
        break;
      case 500:
        stent.ui.loadError({ fileToLoad: "/errors/500.html" });
        break;
      default:
        stent.ui.loadError({ fileToLoad: "/errors/500.html" });
    }
  };

  var processCallbackRequest = async function (path, restApiRequest, callback, callbackError) {
    // check bearer expires date validity
    if (stent.auth.isBearerExpired() === true) {
      let refreshTokenRequest = await stent.auth.refreshToken();
      if (!refreshTokenRequest.ok || !refreshTokenRequest.message || !refreshTokenRequest.message.refresh_token || !refreshTokenRequest.message.access_token) {
        stent.auth.cleanCookiesAndLocalStorage();
        stent.auth.redirectToAuthPage();
        return;
      }
    }
    fetch(path, restApiRequest)
      .then(function (res) {
        switch (res.status) {
          case 401:
            processCallbackError(401, res.text(), callbackError);
            return null;
          case 404:
            processCallbackError(404, res.text(), callbackError);
            return null;
          case 500:
            processCallbackError(500, res.text(), callbackError);
            return null;
          case 200:
            return res.json();
          case 204:
            return null;
          default:
            return res.json();
        }
      })
      .then(function (res) {
        if (res !== null) {
          try {
            if (typeof callback === "function") callback(res);
          } catch (error) {
            console.log(res);
            console.log(error);
          }
        }

      })
      .catch(function (err) {
        console.log(err);
        try {
          if (typeof callbackError === "function") callbackError(err);
          else {
            processCallbackError(null, err);
          }
        } catch (error) {
          console.log(error);
        }
      });
  };


  /* ########################### */
  /* ASYNC AWAIT METHODS
  /* ########################### */

  // API (GRAPH QL)
  var getApiAsync = async function (graphQuery, method, url, releasePath) {
    var query = {
      query: graphQuery
    };
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var graphRequest = {
      method: method ? method : "POST",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(query)
    };
    return await processApiRequestAsync(graphRequest, url, releasePath);
  };

  var processApiRequestAsync = async (graphRequest, url, releasePath) => {
    // check bearer expires date validity
    if (stent.auth.isBearerExpired() === true) {
      let refreshTokenRequest = await stent.auth.refreshToken();
      if (!refreshTokenRequest.ok || !refreshTokenRequest.message || !refreshTokenRequest.message.refresh_token || !refreshTokenRequest.message.access_token) {
        stent.auth.cleanCookiesAndLocalStorage();
        stent.auth.redirectToAuthPage();
        return;
      }
    }
    try {
      const response = await fetch(url ? url : stent.api.api + (releasePath ? "/" + releasePath : ""), graphRequest);
      let jsonResponse = await response.json();
      switch (response.status) {
        case 401:
        case 404:
        case 500:
          return {
            ok: false,
            message: jsonResponse
          };
        case 204:
          return null;
        case 200:
          return {
            ok: true,
            message: jsonResponse
          };
        default:
          return jsonResponse;
      }
    } catch (err) {
      return err;
    }
  };

  // GRAPH QL
  var getGraphQLAsync = async function (graphQuery, releasePath) {
    var query = {
      query: graphQuery
    };
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var graphRequest = {
      method: "POST",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(query)
    };
    return await processGraphQLRequestAsync(graphRequest, releasePath);
  };

  var processGraphQLRequestAsync = async (graphRequest, releasePath) => {
    // check bearer expires date validity
    if (stent.auth.isBearerExpired() === true) {
      let refreshTokenRequest = await stent.auth.refreshToken();
      if (!refreshTokenRequest.ok || !refreshTokenRequest.message || !refreshTokenRequest.message.refresh_token || !refreshTokenRequest.message.access_token) {
        stent.auth.cleanCookiesAndLocalStorage();
        stent.auth.redirectToAuthPage();
        return;
      }
    }
    try {
      const response = await fetch(stent.api.graphQL + (releasePath ? "/" + releasePath : ""), graphRequest);
      let jsonResponse = await response.json();
      switch (response.status) {
        case 401:
        case 404:
        case 500:
          return {
            ok: false,
            message: jsonResponse
          };
        case 204:
          return null;
        case 200:
          return {
            ok: true,
            message: jsonResponse
          };
        default:
          return jsonResponse;
      }
    } catch (err) {
      return err;
    }
  };

  // REST
  const getRestAsync = async (path, forceUrl, forceToken) => {

    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (typeof forceToken !== "undefined" ? forceToken : stent.auth.getBearer()),
      "X-Workspace-ID": stent.tenant.key
    };

    var restApiRequest = {
      method: "GET",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default"
    };
    return await processRestRequestAsync(path, restApiRequest, forceUrl);
  };

  const postRestAsync = async (path, body, forceUrl) => {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "POST",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body)
    };
    return await processRestRequestAsync(path, restApiRequest, forceUrl);
  };

  const putRestAsync = async (path, body, forceUrl) => {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "PUT",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: body ? JSON.stringify(body) : ""
    };
    return await processRestRequestAsync(path, restApiRequest, forceUrl);
  };

  const patchRestAsync = async (path, body, forceUrl) => {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "PATCH",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: body ? JSON.stringify(body) : ""
    };
    return await processRestRequestAsync(path, restApiRequest, forceUrl);
  };

  const deleteRestAsync = async (path, body, forceUrl) => {
    var httpHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + stent.auth.getBearer(),
      "X-Workspace-ID": stent.tenant.key
    };
    var restApiRequest = {
      method: "DELETE",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body)
    };
    return await processRestRequestAsync(path, restApiRequest, forceUrl);
  };

  var processRestRequestAsync = async (path, restApiRequest, forceUrl) => {
    // check bearer expires date validity
    if (stent.auth.isBearerExpired() === true) {
      let refreshTokenRequest = await stent.auth.refreshToken();
      if (!refreshTokenRequest.ok || !refreshTokenRequest.message || !refreshTokenRequest.message.refresh_token || !refreshTokenRequest.message.access_token) {
        stent.auth.cleanCookiesAndLocalStorage();
        stent.auth.redirectToAuthPage();
        return;
      }
    }
    try {
      const response = await fetch((forceUrl ? forceUrl : stent.api.rest) + path, restApiRequest);
      let jsonResponse = await response.json();
      switch (response.status) {
        case 401:
        case 404:
        case 500:
          return {
            ok: false,
            message: jsonResponse
          };
        case 204:
          return null;
        case 200:
          return {
            ok: true,
            message: jsonResponse
          };
        default:
          return jsonResponse;
      }
    } catch (err) {
      return err;
    }
  };

  // AUTH
  const postAuthAsync = async (path, body) => {
    var httpHeaders = {
      "Content-Type": "application/json",
      "X-Workspace-ID": stent.tenant.key
    };
    var authApiRequest = {
      method: "POST",
      headers: new Headers(httpHeaders),
      mode: "cors",
      cache: "default",
      credentials: "include",
      body: JSON.stringify(body)
    };
    return await processAuthRequestAsync(path, authApiRequest);
  };

  var processAuthRequestAsync = async (path, authApiRequest) => {
    // check bearer expires date validity
    if (stent.auth.isBearerExpired() === true) {
      let refreshTokenRequest = await stent.auth.refreshToken();
      if (!refreshTokenRequest.ok || !refreshTokenRequest.message || !refreshTokenRequest.message.refresh_token || !refreshTokenRequest.message.access_token) {
        stent.auth.cleanCookiesAndLocalStorage();
        stent.auth.redirectToAuthPage();
        return;
      }
    }
    try {
      const response = await fetch(stent.api.auth + path, authApiRequest);
      let jsonResponse = await response.json();
      switch (response.status) {
        case 401:
        case 404:
        case 500:
          return {
            ok: false,
            message: jsonResponse
          };
        case 204:
          return null;
        case 200:
          return {
            ok: true,
            message: jsonResponse
          };
        default:
          return jsonResponse;
      }
    } catch (err) {
      return err;
    }
  };

  return {
    getGraphQL,
    getGraphQLAsync,

    getApiAsync,

    getRest,
    getRestAsync,
    putRest,
    putRestAsync,
    postRest,
    postRestAsync,
    deleteRest,
    deleteRestAsync,
    patchRest,
    patchRestAsync,

    postAuthAsync
  };
})();