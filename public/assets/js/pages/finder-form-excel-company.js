"use strict";

stent.finders.excel.company = (function () {

  let _fields = [
    {
      key: "companyName",
      value: "Company name"
    },
    {
      key: "linkedInId",
      value: "LinkedIn ID"
    },
    {
      key: "linkedInUrl",
      value: "LinkedIn URL"
    },
    {
      key: "linkedInUrn",
      value: "LinkedIn URN"
    }
  ];

  stent.finders.excel.setFields(_fields);
  stent.finders.excel.init();

})();
