stent.utils = {
  guid: function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /* eslint-disable */
  isValidURL: function (url) {
    var expression = /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi;
    var regex = new RegExp(expression);
    return !(url.match(regex) === null);
  },
  /* eslint-enable */

  /* eslint-disable */
  isEmailValid: function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  /* eslint-enable */

  /* eslint-disable */
  escapeJsonString: function (str) {
    if (!str) {
      return str;
    }
    return str
      .replace(/[\\]/g, "\\\\")
      .replace(/[\"]/g, "\\\"")
      .replace(/[\/]/g, "\\/")
      .replace(/[\b]/g, "\\b")
      .replace(/[\f]/g, "\\f")
      .replace(/[\n]/g, "\\n")
      .replace(/[\r]/g, "\\r")
      .replace(/[\t]/g, "\\t");
  },
  /* eslint-enable */

  randomIntFromInterval: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  log: function(message) {
    if (stent.log) console.log(message);
  },

  arrayToObject: (array, keyField) =>
    array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {}),

  getURLParam: function(paramName) {
    if (paramName) {
      return new URL(window.location.href).searchParams.get(paramName);
    }
    return null;
  },

  getURLRemovedParam(paramName) {
    var rtn = window.location.href.split("?")[0],
      param,
      params_arr = [],
      queryString = window.location.href.indexOf("?") !== -1 ? window.location.href.split("?")[1] : "";
    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === paramName) {
          params_arr.splice(i, 1);
        }
      }
      rtn = rtn + (params_arr.length > 0 ? "?" : "") + params_arr.join("&");
    }
    return rtn;
  },

  getURLWithUpdatedParam: function(paramName, val) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = window.location.href.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) {
      let tmpAnchor = additionalURL.split("#");
      let TheParams = tmpAnchor[0];
      TheAnchor = tmpAnchor[1];
      if (TheAnchor) additionalURL = TheParams;

      tempArray = additionalURL.split("&");

      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split("=")[0] != paramName) {
          newAdditionalURL += temp + tempArray[i];
          temp = "&";
        }
      }
    } else {
      let tmpAnchor = baseURL.split("#");
      let TheParams = tmpAnchor[0];
      TheAnchor = tmpAnchor[1];

      if (TheParams) baseURL = TheParams;
    }

    if (TheAnchor) val += "#" + TheAnchor;

    let rows_txt = temp + "" + paramName + "=" + val;
    return baseURL + "?" + newAdditionalURL + rows_txt;
  },

  parseJwt: function(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  },

  getCookie: function(name) {
    var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return v ? v[2] : null;
  },

  humanFileSize: function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }
    var units = si
      ? ["kB","MB","GB","TB","PB","EB","ZB","YB"]
      : ["KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+" "+units[u];
  },

  generateInitialsLogo: function (name) {
    let initials = "..";
    let splitName = name.split(" ");
    if (splitName.length > 1) {
      initials = splitName[0].substring(0, 1).toUpperCase() + splitName[1].substring(0, 1).toUpperCase();
    } else if (name.length >= 2) {
      initials = name.substring(0, 2).toUpperCase();
    }
    return `<span title="${name}" style="background-color: ${stent.utils.stringToColour(initials)};" class="initials">${initials}</span>`;
  },

  stringToColour: function(input_str) {

    var baseRed = 128;
    var baseGreen = 128;
    var baseBlue = 128;

    //lazy seeded random hack to get values from 0 - 256
    //for seed just take bitwise XOR of first two chars
    var seed = input_str.charCodeAt(0) ^ input_str.charCodeAt(1);
    var rand_1 = Math.abs((Math.sin(seed++) * 10000)) % 256;
    var rand_2 = Math.abs((Math.sin(seed++) * 10000)) % 256;
    var rand_3 = Math.abs((Math.sin(seed++) * 10000)) % 256;

    //build colour
    var red = Math.round((rand_1 + baseRed) / 2);
    var green = Math.round((rand_2 + baseGreen) / 2);
    var blue = Math.round((rand_3 + baseBlue) / 2);

    //return { red: red, green: green, blue: blue };
    return `rgba(${red}, ${green}, ${blue}, 1)`;
  },

  popupCenter: function ({url, title, w, h, onClose}) {

    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(url, title,
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    );

    if (typeof onClose === "function") {
      var timer = setInterval(function() {
        if (newWindow.closed) {
          clearInterval(timer);
          onClose();
        }
      }, 1000);
    }

    if (window.focus) newWindow.focus();

  },

  arrayToHMLList: function (arr) {

    if (!arr) {
      return "";
    }

    let html = "";
    html += "<ul style='text-align: left; margin: 5px 0 0 0; padding: 0 15px;'>";
    arr.forEach((entry) => {
      html += "<li>" + entry + "</li>";
    });
    html += "</ul>";

    return html;
  },

  sortArrayOfObjectByPropertyName: function (property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  },

  capitalize: (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

};