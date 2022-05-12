stent.libs = {
  navbar: {
    prod: {
      files: ["/assets/js/requires/stent.navbar.min.js"]
    },
    dev: {
      files: ["/assets/js/requires/stent.navbar.js"]
    }
  },
  widgets: {
    prod: {
      files: ["/assets/js/requires/stent.widgets.min.js"]
    },
    dev: {
      files: ["/assets/js/requires/stent.widgets.js"]
    }
  },
  quill: {
    prod: {
      files: ["/node_modules/quill/dist/quill.min.js", "/assets/js/requires/stent.quill.min.js"]
    },
    dev: {
      files: ["/node_modules/quill/dist/quill.min.js", "/assets/js/requires/stent.quill.js"]
    }
  },
  flatpickr: {
    prod: {
      files: ["/node_modules/flatpickr/dist/flatpickr.min.js", "/assets/js/requires/stent.flatpickr.min.js"]
    },
    dev: {
      files: ["/node_modules/flatpickr/dist/flatpickr.js", "/assets/js/requires/stent.flatpickr.js"]
    }
  },
  dropzone: {
    prod: {
      files: ["/node_modules/dropzone/dist/min/dropzone.min.js", "/assets/js/requires/stent.dropzone.min.js"]
    },
    dev: {
      files: ["/node_modules/dropzone/dist/min/dropzone.min.js", "/assets/js/requires/stent.dropzone.js"]
    }
  },
  popover: {
    prod: {
      files: ["/assets/js/requires/stent.popover.min.js"]
    },
    dev: {
      files: ["/assets/js/requires/stent.popover.js"]
    }
  },
  highlight: {
    prod: {
      files: ["/node_modules/highlightjs/highlight.pack.min.js", "/assets/js/requires/stent.highlight.min.js"]
    },
    dev: {
      files: ["/node_modules/highlightjs/highlight.pack.min.js", "/assets/js/requires/stent.highlight.js"]
    }
  },
  list: {
    prod: {
      files: ["/node_modules/list.js/dist/list.min.js", "/assets/js/requires/stent.list.min.js"]
    },
    dev: {
      files: ["/node_modules/list.js/dist/list.min.js", "/assets/js/requires/stent.list.js"]
    }
  },
  ace: {
    prod: {
      files: [
        "/node_modules/ace-builds/src-min/ace.js",
        "/node_modules/ace-builds/src-min/mode-javascript.js",
        "/node_modules/ace-builds/src-min/mode-aql.js",
        "/node_modules/ace-builds/src-min/theme-twilight.js"
      ]
    },
    dev: {
      files: [
        "/node_modules/ace-builds/src/ace.js",
        "/node_modules/ace-builds/src/mode-javascript.js",
        "/node_modules/ace-builds/src/mode-aql.js",
        "/node_modules/ace-builds/src/theme-tomorrow.js"
      ]
    }
  },
  chart: {
    prod: {
      files: [
        "/node_modules/chart.js/dist/Chart.min.js",
        "/assets/libs/chart.js/Chart.extension.js",
        "/assets/js/requires/stent.chart.min.js"
      ]
    },
    dev: {
      files: [
        "/node_modules/chart.js/dist/Chart.min.js",
        "/assets/libs/chart.js/Chart.extension.js",
        "/assets/js/requires/stent.chart.js"
      ]
    }
  },
  fullcalendar: {
    prod: {
      files: [
        "/node_modules/@fullcalendar/core/main.min.js",
        "/node_modules/@fullcalendar/interaction/main.min.js",
        "/node_modules/@fullcalendar/bootstrap/main.min.js",
        "/node_modules/@fullcalendar/daygrid/main.min.js",
        "/node_modules/@fullcalendar/timegrid/main.min.js",
        "/node_modules/@fullcalendar/list/main.min.js",
        "/node_modules/@fullcalendar/timeline/main.min.js"
      ]
    },
    dev: {
      files: [
        "/node_modules/@fullcalendar/core/main.js",
        "/node_modules/@fullcalendar/interaction/main.js",
        "/node_modules/@fullcalendar/bootstrap/main.js",
        "/node_modules/@fullcalendar/daygrid/main.js",
        "/node_modules/@fullcalendar/timegrid/main.js",
        "/node_modules/@fullcalendar/list/main.js",
        "/node_modules/@fullcalendar/timeline/main.js"
      ]
    }
  },
  draggable: {
    prod: {
      files: [
        "/node_modules/draggabilly/dist/draggabilly.pkgd.min.js"
      ]
    },
    dev: {
      files: [
        "/node_modules/draggabilly/dist/draggabilly.pkgd.min.js"
      ]
    }
  },
  slider: {
    prod: {
      files: [
        "/node_modules/nouislider/distribute/nouislider.min.js"
      ]
    },
    dev: {
      files: [
        "/node_modules/nouislider/distribute/nouislider.min.js"
      ]
    }
  },
  qr: {
    prod: {
      files: ["/assets/js/requires/stent.qr.min.js"]
    },
    dev: {
      files: ["/assets/js/requires/stent.qr.js"]
    }
  }
};

stent.loadedLibraries = [];

stent.requireJS = function(libsName, callback) {
  // Check if libsName is an array or a string
  if (!(libsName != null && (typeof libsName == "string" || typeof libsName == "object"))) return false;

  // Check if libsName is a string. If yes, transform it to an array
  var libs = typeof libsName == "string" ? [libsName] : libsName;

  var loadScript = function(libName, scriptURL) {

    var script = document.createElement("script");
    script.type = "application/javascript";
    script.src = scriptURL;
    document.getElementsByTagName("head")[0].appendChild(script);

    // Important success and error for the promise
    script.onload = function() {
      onLoaded(libName, scriptURL);
    };
    script.onerror = function() {};

  };

  var initLibs = function() {
    for (var i = 0; i < libs.length; i++) {
      var lib = stent[libs[i]];
      if (lib && lib.init) {
        lib.init();
      }
    }
  };

  // Build an array of files URL to load
  var filesToLoad = [];

  for (var i = 0; i < libs.length; i++) {
    var libName = libs[i];
    if (stent.libs[libName] && stent.libs[libName][stent.env].files && stent.loadedLibraries.indexOf(libName) === -1) {
      for (var j = 0; j < stent.libs[libName][stent.env].files.length; j++) {
        var scriptURL = stent.libs[libName][stent.env].files[j];
        filesToLoad.push({ libName: libName, scriptURL: scriptURL });
      }
    }
  }

  var index = 0;
  if (filesToLoad.length > 0) {
    loadScript(filesToLoad[0].libName, filesToLoad[0].scriptURL + "?v=" + stent.version.release + "." + stent.version.build);
  } else {
    initLibs();
    if (typeof callback === "function") {
      callback();
    }
  }

  var onLoaded = function(libName) {

    index++;
    stent.loadedLibraries.push(libName);

    if (index < filesToLoad.length) {
      loadScript(filesToLoad[index].libName, filesToLoad[index].scriptURL + "?v=" + stent.version.release + "." + stent.version.build);
    } else {
      initLibs();
      if (typeof callback === "function") {
        callback();
      }
    }
  };
};
