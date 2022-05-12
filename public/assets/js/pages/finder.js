"use strict";

stent.finders = (function () {

  // entity = type
  let outputs = [
    {
      key: "contact",
      name: "Contacts",
      icon: "/assets/img/finders/contacts.svg"
    },
    {
      key: "company",
      name: "Companies",
      icon: "/assets/img/finders/companies.svg",
    }
  ];

  let sources = [

    // excel
    {
      key: "excel",
      name: "Excel spreadsheet",
      icon: "/assets/img/finders/excel.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-excel-contact.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-excel-contact.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-excel-contact.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        },
        {
          path: {
            create: "/pages/finder-form-excel-company.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-excel-company.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-excel-company.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[1]
        }
      ]
    },

    // google-news
    {
      key: "google-news",
      name: "Google news",
      icon: "/assets/img/finders/google-news.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-google-news.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-google-news.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-google-news.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        },
        {
          path: {
            create: "/pages/finder-form-google-news.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-google-news.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-google-news.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[1]
        }
      ]
    },

    // github
    {
      key: "github",
      name: "Github",
      icon: "/assets/img/finders/github.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-github.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-github.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-github.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        }
      ]
    },

    // rhetoric
    {
      key: "rhetorik",
      name: "Rhetorik",
      icon: "/assets/img/finders/rhetorik.png",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-rhetorik.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-rhetorik.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-rhetorik.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        }
      ]
    },

    // linkedin-network-connections
    {
      key: "linkedin-network-connections",
      name: "LinkedIn network connections",
      icon: "/assets/img/finders/linkedin-network-connections.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-linkedin-network-connections.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-linkedin-network-connections.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-linkedin-network-connections.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        },
      ]
    },

    // linkedin-suggested-contacts
    {
      key: "linkedin-suggested-contacts",
      name: "LinkedIn suggested contacts",
      icon: "/assets/img/finders/linkedin-suggested-contacts.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-linkedin-suggested-contacts.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-linkedin-suggested-contacts.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-linkedin-suggested-contacts.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        },
      ]
    },

    // LinkedIn Recruiter
    {
      key: "linkedin-recruiter-saved-search",
      name: "LinkedIn Recruiter search",
      icon: "/assets/img/finders/recruiter-saved-search.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-linkedin-recruiter-saved-search-create.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-linkedin-recruiter-saved-search-edit.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-linkedin-recruiter-saved-search-edit.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        }
      ]
    },

    // LinkedIn Recruiter Inbox
    {
      key: "linkedin-recruiter-inbox",
      name: "LinkedIn Recruiter inbox",
      icon: "/assets/img/finders/recruiter-inbox.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-linkedin-recruiter-inbox.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-linkedin-recruiter-inbox.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-linkedin-recruiter-inbox.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        }
      ]
    },

    // LinkedIn Sales Navigator
    {
      key: "linkedin-sales-navigator-saved-search",
      name: "LinkedIn Sales Navigator",
      icon: "/assets/img/finders/sales-navigator-saved-search.svg",
      outputs: [
        {
          path: {
            create: "/pages/finder-form-linkedin-sales-navigator-saved-search-create.html?v=" + stent.version.release + "." + stent.version.build,
            edit: "/pages/finder-form-linkedin-sales-navigator-saved-search-edit.html?v=" + stent.version.release + "." + stent.version.build,
            duplicate: "/pages/finder-form-linkedin-sales-navigator-saved-search-duplicate.html?v=" + stent.version.release + "." + stent.version.build
          },
          ...outputs[0]
        }
      ]
    }


  ];

  const fetchFinder = async function (finderId, pageInfo, filters, sort, getMatches = true) {

    if (!finderId) {
      return null;
    }

    /* eslint-disable */
    let query = `
      {
        workspaceContext {
          finderById(id: "${finderId}") {
            id
            version
            emailLookup
            entity
            state
            status
            name
            target
            progress
            provisioner {
              ... on FinderProvisioner {
                size
                type
                sync {
                  timestamp
                  state
                  status
                  message
                  jobId
                }
              }
              ... on LinkedSalesSearchFinderProvisioner {
                filterOnCompany
              }
            }
            owner {
              id
              firstName
              lastName
              pictureUrl
            }
            additionalMembers {
              id
            }
            fetched
            processed
            progress
            ${getMatches ?
        `
              matches (
                first: 50
                ${sort ? `
                  sort: {
                    field: ${sort.split("_")[0]}
                    order: ${sort.split("_")[1]}
                  }` : ``
        }
                where: {
                  ${filters && typeof filters.lookupKeywords !== "undefined" && filters.lookupKeywords !== "" ? `lookupKeywords: "${filters.lookupKeywords}"` : ""} 
                  ${filters && typeof filters.matchKeywords !== "undefined" && filters.matchKeywords !== "" ? `matchKeywords: "${filters.matchKeywords}"` : ""}
                  ${filters && typeof filters.status !== "undefined" && filters.status !== "" ? `status: ${filters.status}` : ""} 
                  ${filters && typeof filters.similarity !== "undefined" ? `probabilityMin: ${filters.similarity[0]}` : ""} 
                  ${filters && typeof filters.similarity !== "undefined" ? `probabilityMax: ${filters.similarity[1]}` : ""} 
                }, 
                ${pageInfo && pageInfo.hasNextPage && pageInfo.endCursor ? `after: "${pageInfo.endCursor}"` : ""}
              ) {
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                edges {
                  node {
                    sync {
                      status 
                      timestamp
                      #message
                    }
                    lookup {
                      __typename
                      id
                      firstName
                      lastName
                      fullName
                      headline
                      pictureUrl
                      provider
                      identifier
                      company
                      country
                      city
                    }
                    relevancy {
                      probability
                      confidence
                    }
                    match {
                      __typename
                      id
                      firstName
                      lastName
                      fullName
                      pictureUrl
                      headline
                      email
                      url
                      country
                      city
                      gender
                      company
                      industry
                      provider
                      identifier
                    }
                  }
                }
              }
              ` :
        ``
      }
          
          }
        }
      }
      `;

    stent.konsole.group("fetchFinder");
    stent.konsole.log({ data: query });

    // Renew data from server
    var result = await stent.ajax.getApiAsync(query, "POST");

    if (result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.finderById) {

      if (stent.log) {
        stent.konsole.log({ response: result.message.data.workspaceContext.finderById });
        stent.konsole.endGroup();
      }

      return {
        ok: true,
        message: result.message.data.workspaceContext.finderById
      };

    } else {

      if (stent.log) {
        stent.konsole.error({ response: result });
        stent.konsole.endGroup();
      }

      return {
        ok: false,
        message: result.message
      };
    }
  };

  const getSourceByKey = function (key) {
    return sources.filter(source => source.key === key)[0];
  };

  const getOutputByKey = function (key) {
    return outputs.filter(output => output.key === key)[0];
  };

  return {
    sources,
    outputs,
    getSourceByKey,
    getOutputByKey,
    fetchFinder
  };

})();
