stent.konsole = function () {

  const labelStyleInfo = "background: #7cb5e5; color: #000000;";
  const labelStyleSuccess = "background: #BADA55; color: #222222;";
  const labelStyleError = "background: #FF0000; color: #FFFFFF;";
  const labelTitle =
  "font-size: 0.8rem; font-weight: lighter; background: #3E3E3E; color: #FFFFFF; padding: 3px 6px;";

  return {
    log: ({url, method, data, response}) => {
      if (typeof url !== "undefined") {
        console.log("%c url      => ", labelStyleInfo, url);
      }

      if (typeof method !== "undefined") {
        console.log("%c method   => ", labelStyleInfo, method);
      }

      if (typeof data !== "undefined") {
        console.log("%c data     => ", labelStyleInfo, data);
      }

      if (typeof response !== "undefined") {
        console.log("%c response => ", labelStyleSuccess, response);
      }
    },

    error: ({url, method, response}) => {
      if (typeof url !== "undefined") {
        console.log("%c url      => ", labelStyleInfo, url);
      }

      if (typeof method !== "undefined") {
        console.log("%c method   => ", labelStyleInfo, method);
      }

      if (typeof response !== "undefined") {
        console.log("%c response => ", labelStyleError, response);
      }
    },

    group: functionName => {
      console.group("%c 👉 " + functionName, labelTitle);
    },

    endGroup: () => {
      console.groupEnd();
    }
  };

}();


