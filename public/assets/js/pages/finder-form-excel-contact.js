"use strict";

stent.finders.excel.people = (function () {

  let _fields = [
    {
      key: "firstName",
      value: "First name"
    },
    {
      key: "lastName",
      value: "Last name"
    },
    {
      key: "fullName",
      value: "Full name"
    },
    {
      key: "companyName",
      value: "Company name"
    },
    {
      key: "country",
      value: "Country"
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