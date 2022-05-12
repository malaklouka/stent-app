stent.ui = (function() {
  var sidebarSelector = "#sidebar";
  var contentSelector = ".main-content";
  var _isBannerVisible = false;

  var loadError = function(item) {
    loadInFrame(item);
  };

  var load = function(item) {

    stent.loader.show();

    // remove iframe class if needed
    if ($(contentSelector).hasClass("iframe")) {
      $(contentSelector).removeClass("iframe");
    }

    let url = new URL(window.location.origin + (item.fileToLoad.substring(0,1) == "/" ? "" : "/") + item.fileToLoad);
    let qsVersion  = "v=" + stent.version.release + "." + stent.version.build;

    if (!url.pathname.includes(".html")) item.fileToLoad = url.pathname + ".html";

    // Add Query String version params + existing params
    if (url.search) {
      url.search += "&" + qsVersion;
    } else {
      url.search += qsVersion;
    }

    item.fileToLoad += url.search;

    $.when(
      $.get({
        url: "/pages" + (item.fileToLoad.substring(0,1) == "/" ? "" : "/") + item.fileToLoad
      }).then(
        function(data) {
          $(item.selector ? item.selector : contentSelector).html(data);
        },

        function(err) {
          // 404
          if (err.status === 404) {
            stent.loader.hide();
            loadInFrame({
              fileToLoad: "errors/404.html",
              selector: contentSelector,
              isError: true
            });
          }
        }
      )
    ).then(function() {
      if ($.isFunction(item.callback)) item.callback();
    });
  };

  var loadInFrame = function(item) {
    if (!item.selector) {
      item.selector = contentSelector;
    }
    $(item.selector).html("<iframe class=\"ui-frame\" src=\" " + item.fileToLoad + "\">");
    $(contentSelector).addClass("iframe");
  };

  var pushState = function(fileToLoad, shouldBeLoadedInIframe, location) {
    window.history.pushState(
      {
        fileToLoad: fileToLoad,
        shouldBeLoadedInIframe: shouldBeLoadedInIframe
      },
      null,
      location
    );
  };

  var prepareLoad = function($this, shouldPushState) {

    var fileToLoad, shouldBeLoadedInIframe, urlLocation, item;
    var pathname = window.location.pathname.split("/")[2];

    // $this can be null, because we loads the homepage
    // Or because the link of the page can't be found in the sidebar
    if ($this || pathname === "") {
      if (!$this) {
        $this = $($(".nav-item .ui-link")[0]);
        shouldPushState = true;
      }

      // Get file to load
      fileToLoad = $this.attr("href");
      if (!fileToLoad) {
        fileToLoad = $this.attr("data-href");
      }
      shouldBeLoadedInIframe = $this.hasClass("ui-link-iframe");
      urlLocation = $this.attr("data-location") ? $this.attr("data-location") : fileToLoad;

      // Save the page to Load in history
      if (shouldPushState === true) {
        pushState(fileToLoad, shouldBeLoadedInIframe, urlLocation.replace(".html", ""));
      }


    } else {
      // Get file to load
      fileToLoad = pathname;
      shouldBeLoadedInIframe = false;
      urlLocation = pathname;
    }

    item = {
      fileToLoad: fileToLoad,
      selector: contentSelector,
      location: urlLocation
    };

    // LoadFile in DOM
    if (!shouldBeLoadedInIframe) {
      load(item);
    } else {
      loadInFrame(item);
    }
  };

  var bindEvents = function() {
    $("body").on("click", ".ui-link", function(evt) {
      evt.preventDefault();
      prepareLoad($(this), true);
    });
  };

  var manageHistory = function() {
    window.onpopstate = function(event) {
      var fileToLoad = event.state.fileToLoad;
      var $menu =
        $("[href=\"" + fileToLoad + "\"]").length > 0
          ? $("[href=\"" + fileToLoad + "\"]")
          : $("[data-location=\"" + fileToLoad + "\"]").length > 0
            ? $("[data-location=\"" + fileToLoad + "\"]")
            : null;

      prepareLoad($menu, false);
    };
  };

  var loadNavigation = function() {
    load({
      fileToLoad: "sidebar.html",
      selector: sidebarSelector
    });
  };

  var initBanner = async function () {

    let fetchMessages = await stent.ajax.getRestAsync(
      "/tenants/" + stent.tenant.key + "/messages"
    );

    if (!fetchMessages.ok) {
      console.warn("STENT => Error when trying to get the workspace status messages.");
      return;
    }

    let _currentIndex = 0;
    let _countMessages = fetchMessages.message && fetchMessages.message.length ? fetchMessages.message.length : 0;

    let bindBannerEvents = function () {
      $("body")
        .off("click", ".previous-message")
        .on("click", ".previous-message", function() {
          if (_currentIndex === 0) {
            _currentIndex = _countMessages - 1;
          } else {
            _currentIndex--;
          }

          $(".a-stent-banner:first-child").animate({
            "margin-top": -(_currentIndex * 50),
          }, 100);

        });

      $("body")
        .off("click", ".next-message")
        .on("click", ".next-message", function() {
          if (_currentIndex + 1 === _countMessages) {
            _currentIndex = 0;
          } else {
            _currentIndex++;
          }

          $(".a-stent-banner:first-child").animate({
            "margin-top": -(_currentIndex * 50),
          }, 100);

        });
    };

    if (_countMessages > 0) {
      _isBannerVisible = true;


      if (_isBannerVisible) {

        let DOM = "<div id=\"stent-banner\">";

        /* eslint-disable */
        fetchMessages.message.forEach((message, index) => {
          DOM += `
            <div class="a-stent-banner severity-${message.severity ? message.severity : 'low'}">
              ${_countMessages > 1 ? `<span class="fe fe-arrow-left-circle mr-3 previous-message"></span>`: ``}
              <div class="banner-message">
                <h1>
                  ${
                    message.url ? `<a target="_blank" href="${message.url}">`: ``
                  }  
                  ${_countMessages > 1 ? `${(index + 1)}/${_countMessages} -`: ``}
                  ${message.message}
                  ${
                    message.url ? `</a>`: ``
                  } 
                </h1>
              </div>
              ${_countMessages > 1 ? `<span class="fe fe-arrow-right-circle ml-3 next-message"></span>`: ``}
              
            </div>`;
        });
        /* eslint-enable */

        DOM += "</div>";

        $("body").prepend(DOM);
        $("html").addClass("bannerVisible");

        if (fetchMessages.message.length > 1) {
          bindBannerEvents();
        }

      }


    }

  };

  // this methods is executed by the stent.navbar.js,
  // because the nav bar should be always executed before the content
  var loadFirstPage = function() {

    var pathname = window.location.pathname.split("/")[2];

    if (!pathname) {
      pathname = "home";
    }

    var $menu =
      $("[href=\"" + pathname + "\"]").length > 0
        ? $("[href=\"" + pathname + "\"]")
        : $("[data-location=\"" + pathname + "\"]").length > 0
          ? $("[data-location=\"" + pathname + "\"]")
          : null;

    pushState(window.location.href, false, window.location.href.replace(".html", ""));

    prepareLoad($menu, false);

  };

  var setPageTitle = function(title) {
    var _title = "Stent";

    if (title) {
      _title = title;
    }
    document.title = (stent.tenant && stent.tenant.name ? stent.tenant.name + " - " : "") + _title;
  };

  var init = async function() {
    $("body").removeClass("d-none");

    let tryAuth = await stent.auth.init();
    if (!tryAuth) {
      return;
    }

    stent.loader.show();
    loadNavigation();
    initBanner();
    bindEvents();
    manageHistory();

  };

  return {
    load,
    loadError,
    loadFirstPage,
    loadInFrame,
    setPageTitle,
    init,
    pushState,
    isBannerVisible: function () {
      return _isBannerVisible;
    }
  };
})();
