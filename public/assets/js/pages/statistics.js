stent.statistics = (function () {
  let _groups = null;
  let _members = null;
  let _filters = {};
  let _groupBy = "";
  let allReach = 0;
  let allClicks = 0;
  let allClicksRate = 0;
  let allLikes = 0;
  let allComments = 0;
  let allShares = 0;
  let allPosts = 0;
  let allEngagementsRate = 0;
  let dateArray = [];
  let _ColDef = [
    "AMBASSADOR/MEDIA",
    "DATE",
    "ORGANIC_REACH",
    "CLICKS",
    "LIKES",
    "COMMENTS",
    "SHARES",
    "POSTS",
    "ENGAGEMENT_RATE"
  ]
 let ColoumnsToShow = [];
  const initGrouppedStat = async function () {
    allReach = 0;
    allClicks = 0;
    allClicksRate = 0;
    allLikes = 0;
    allComments = 0;
    allShares = 0;
    allPosts = 0;
    allEngagementsRate = 0;
  };

const getCpm = function (network,numberOfViews,currency){
let CpmBase;
switch (network) {
  case "linkedIn":
    CpmBase = 33.80
    break;
    case "facebook":
    CpmBase = 5.31
    break;

  default:
    console.log("No such network CPM Base exist!");
    break;
}

return (numberOfViews/1000 * CpmBase) > 0 ? (numberOfViews/1000 * CpmBase).toFixed(2).toString().concat(currency) : "0"+currency
}

const hide_show_col = function(colList){

    let allCOl_th = document.querySelectorAll('#StatisticsList thead th');
    let allCOl_td = document.querySelectorAll('#StatisticsList tbody td');
      if(allCOl_td.length > 0){
        for (const th of allCOl_th) {
          th.style.display="none";
        }
        for (const td of allCOl_td) {
          td.style.display="none";
        }

        for(const col of colList)
        {
          let all_col=document.getElementsByClassName(col);
          for(const col_Elm of all_col){
            col_Elm.style.display="table-cell";
          }
          document.getElementById(col).style.display="table-cell";
        }
      }

    

  
}

  const grouppedStatDOM = function (fileType) {
    allClicksRate = (allClicks / allReach) * 100 > 0 ? (allClicks / allReach) * 100 : "0";
    allEngagementsRate =
      ((allClicks + allLikes + allComments + allShares) / allReach) * 100 > 0
        ? (((allClicks + allLikes + allComments + allShares) / allReach) * 100).toFixed(3)
        : "0";
let html;
        if( fileType != "excel"){
          html = `
          <tr class="groupped-header h2">
          <td class="AMBASSADOR/MEDIA position-relative">
          <span> All ${_groupBy}</span>
          </td>
          <td class="DATE border border-bottom">
          </td>
          <td class="ORGANIC_REACH font-weight-bold h2 text-right">
          ${allReach}
          </td>
          <td class="CLICKS font-weight-bold h2 text-right">
          ${allClicks} <span class="h4 text-muted"> (${allClicksRate}%) </span>
          </td>
          <td  class="LIKES font-weight-bold h2 text-right">
          ${allLikes}
          </td>
          <td class="COMMENTS font-weight-bold h2 text-right">
          ${allComments}
          </td>
          <td class="SHARES font-weight-bold h2 text-right">
          ${allShares}
          </td>
          <td class="POSTS font-weight-bold h2 text-right">
          ${allPosts}
          </td>
          <td class="ENGAGEMENT_RATE font-weight-bold h2 text-primary text-right">
          ${allEngagementsRate}%
          </td>
          
          </tr>
          `;
        }
        else{
          html = `
          <tr class="groupped-header h2">
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="position-relative">
          <span> All ${_groupBy}</span>
          </td>
          <td
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="border border-bottom">
          </td>
          <td
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="border border-bottom">
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="border border-bottom">
          </td>
          <td
          
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
                  class="font-weight-bold h2 text-right">
          ${allReach}
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="font-weight-bold h2 text-right">
          ${allClicks}
          </td>
          <td data-f-sz="18"
          data-fill-color="EAE7F2"
          data-f-color="201246">
          ${allClicksRate}
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="font-weight-bold h2 text-right">
          ${allLikes}
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="font-weight-bold h2 text-right">
          ${allComments}
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="font-weight-bold h2 text-right">
          ${allShares}
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="font-weight-bold h2 text-right">
          ${allPosts}
          </td>
          <td 
          data-f-sz="18"
                  data-fill-color="EAE7F2"
                  data-f-color="201246"
          class="font-weight-bold h2 text-primary text-right">
          ${allEngagementsRate}%
          </td>
          
          </tr>
          `;
        }
   

    return html;
  };

  const initGroupBy = async function () {
    _groupBy = "Ambassadors";
    $("#grouBy").selectpicker();
  };

  const initFilters = async function () {
    _filters.members = null;
  };

  const setDateFilter = async function (start, end, label) {
    stent.loader.show(".main-content");
    $("#dateFilter-input").text(label);

    if (start._isValid === true) {
      _filters.from = moment(start).valueOf();
    } else {
      _filters.from = null;
    }

    if (end._isValid === true) {
      _filters.to = moment(end).valueOf();
    } else {
      _filters.to = null;
    }

    await buildStatisticsTable();
    console.log(dateArray);
    console.log('min');
    console.log(dateArray[0])
    console.log('max');
    console.log(dateArray[dateArray.length - 1]);

    $('#dateFilter').data('daterangepicker').minDate=dateArray[0];
    $('#dateFilter').data('daterangepicker').maxDate=dateArray[dateArray.length - 1];
    $('#dateFilter').data('daterangepicker').ranges.All[0]= dateArray[0];
    $('#dateFilter').data('daterangepicker').ranges.All[1]= dateArray[dateArray.length - 1];
    stent.loader.hide();
  };

  const initDateFilter = function () {
    _filters.from = "";
    _filters.to = "";
   
    setDateFilter(_filters.from, _filters.to, "All");
    

    $("#dateFilter").daterangepicker(
      {
        showDropdowns: true,
        minDate: false,
        maxDate: false,
        startDate: _filters.from != null ? _filters.from : moment(),
        endDate: _filters.to != null ? _filters.to : moment(),
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
          All: [moment("1970-01-01"), moment()],
        },
      },
      setDateFilter
    );

  };

  const getMembers = async function () {
    let query = `
        query{
            workspaceContext {
              members(where: {
                status:ACTIVE
                type: MEMBER
              }) {
                edges {
                  node {
                    ...on WorkspaceMember {
                      id
                      firstName
                      lastName
                      pictureUrl
                    }
                  }
                }
              }
            }
          }
        `;
    let result;
    stent.konsole.group("getMembers");
    stent.konsole.log({ data: query });
    // Renew data from server
    result = await stent.ajax.getApiAsync(query, "POST");

    if (
      result.ok &&
      result.message &&
      result.message.data &&
      result.message.data.workspaceContext &&
      result.message.data.workspaceContext.members.edges
    ) {
      if (stent.log) {
        stent.konsole.log({ response: result.message.data.workspaceContext.members });
        stent.konsole.endGroup();
      }

      if (result.message.data.workspaceContext.members.edges.length > 0) {
        return {
          edges: result.message.data.workspaceContext.members.edges,
        };
      } else {
        return {
          edges: [],
        };
      }
    } else {
      if (stent.log) {
        stent.konsole.error({ response: result });
        stent.konsole.endGroup();
      }

      stent.toast.danger("Error when trying to fetch the media. Please refresh the page to try again.");
      stent.loader.hide();

      return {
        edges: [],
      };
    }
  };

  const getHeadersByGroup = async function () {
    let query;
    let result;
    if (_groupBy && _groupBy === "Ambassadors") {
      query = `
      query {
       
            workspaceContext 
            
            {
              publishingPostsAmbassadors(
                where: {

                  ${_filters && _filters.from ? `from: ${_filters.from}` : ""} # Start date timestamp
                  ${_filters && _filters.to ? `to: ${_filters.to}` : ""} # End date timestamp

                  ${
                    _filters && _filters.members
                      ? `membersId:[${_filters.members.map((member) => `"${member}"`).join("\n      ")}]`
                      : ""
                  } # Start date timestamp
                 
                }
            )  {
                id				# Member ID
                firstName			# Member first name
                lastName			# Member last name
                pictureUrl		# Member profile picture URL
              }
            }
      
      }
    `;

      stent.konsole.group("getHeadersByGroup");
      stent.konsole.log({ data: query });

      // Renew data from server
      result = await stent.ajax.getApiAsync(query, "POST");
      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.publishingPostsAmbassadors
      ) {
        if (stent.log) {
          stent.konsole.log({ response: result.message.data.workspaceContext.publishingPostsAmbassadors });
          stent.konsole.endGroup();
        }

        if (result.message.data.workspaceContext.publishingPostsAmbassadors.length > 0) {
          return {
            edges: result.message.data.workspaceContext.publishingPostsAmbassadors,
          };
        } else {
          return {
            edges: [],
          };
        }
      } else {
        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        stent.toast.danger("Error when trying to fetch the media. Please refresh the page to try again.");
        stent.loader.hide();

        return {
          edges: [],
        };
      }
    } else {
      query = `
          query {
           
                workspaceContext 
                
                {
                  publishingPostsMedia (
                    where: {
    
                      ${_filters && _filters.from ? `from: ${_filters.from}` : ""} # Start date timestamp
                      ${_filters && _filters.to ? `to: ${_filters.to}` : ""} # End date timestamp
    
                      ${
                        _filters && _filters.members
                          ? `membersId:[${_filters.members.map((member) => `"${member}"`).join("\n      ")}]`
                          : ""
                      } # Start date timestamp
                     
                    }
                )  {
                      type: __typename		# Media type (see MediaUnion type in GraphQL documentation for possible values)
                      ...on Node {
                        id					# Media ID
                      }
                      ...on Media {
                        title				# Media title
                        summary				# Media summary
                        thumbnailUrl		# Media thumbnail URL
                        contentUrl			# URL to media content
                      }
                  }
                }
          
          }
        `;

      stent.konsole.group("getHeadersByGroup");
      stent.konsole.log({ data: query });

      // Renew data from server
      result = await stent.ajax.getApiAsync(query, "POST");
      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.publishingPostsMedia
      ) {
        if (stent.log) {
          stent.konsole.log({ response: result.message.data.workspaceContext.publishingPostsMedia });
          stent.konsole.endGroup();
        }

        if (result.message.data.workspaceContext.publishingPostsMedia.length > 0) {
          return {
            edges: result.message.data.workspaceContext.publishingPostsMedia,
          };
        } else {
          return {
            edges: [],
          };
        }
      } else {
        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        stent.toast.danger("Error when trying to fetch the media. Please refresh the page to try again.");
        stent.loader.hide();

        return {
          edges: [],
        };
      }
    }
  };

  const getPostsByGroup = async function (id) {
    let query;
    let result;
    if (_groupBy && _groupBy === "Ambassadors") {
      query = `
      query {
        workspaceContext {
           publishingPosts(where: {
            ${_filters && _filters.from ? `from: ${_filters.from}` : ""} # Start date timestamp
            ${_filters && _filters.to ? `to: ${_filters.to}` : ""} # End date timestamp
               membersId: [
                    "${id}"	# Member ID 
                    
              ]
          }) {
            edges {
              node {
                type: __typename							# Post type (personal or corporate)
                ...on LinkedInPersonalStreamPost {
                  id										# Post unique identifier
                  postedAt								# Timestamp post has been posted at
                  postedBy{                             # Timezone offset of the ambassador
                    timezone{
                      offset                            # Timezone offset of the ambassador
                    }
                  }
                  media {
                    type: __typename						# Associated media type
                    ...on Node {
                      id									# Media ID
                    }
                    ...on Media {
                      thumbnailUrl						# Media thumbnail URL
                      contentUrl							# URL to media content
                      title								# Media title
                      summary								# Media summary
                    }
                  }
                  views									# Number of views
                  clicks									# Number of clicks
                  shares									# Number of shares
                  likes {
                    count									# Number of likes
                  }
                  comments {
                    count									# Number of comments
                  }
                }
                ...on LinkedInCorporateStreamPost {
                  id
                  postedAt
                  postedBy{                             # Timezone offset of the ambassador
                    timezone{
                      offset                            # Timezone offset of the ambassador
                    }
                  }
                  media {
                    type: __typename
                    ...on Node {
                      id
                    }
                    ...on Media {
                      thumbnailUrl
                      contentUrl
                      title
                      summary
                    }
                  }
                  views
                  clicks
                  shares
                  likes {
                    count
                  }
                  comments {
                    count
                  }
                }
              }
            }
          }
        }
      }
    `;

      stent.konsole.group("getPostsByGroup");
      stent.konsole.log({ data: query });

      // Renew data from server
      result = await stent.ajax.getApiAsync(query, "POST");
      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.publishingPosts &&
        result.message.data.workspaceContext.publishingPosts.edges
      ) {
        if (stent.log) {
          stent.konsole.log({ response: result.message.data.workspaceContext.publishingPosts });
          stent.konsole.endGroup();
        }

        if (result.message.data.workspaceContext.publishingPosts.edges.length > 0) {
          return {
            edges: result.message.data.workspaceContext.publishingPosts.edges,
          };
        } else {
          return {
            edges: [],
          };
        }
      } else {
        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        stent.toast.danger("Error when trying to fetch the media. Please refresh the page to try again.");

        return {
          edges: [],
        };
      }
    } else {
      query = `
          query {
            workspaceContext {
               publishingPosts(where: {
                ${_filters && _filters.from ? `from: ${_filters.from}` : ""} # Start date timestamp
                ${_filters && _filters.to ? `to: ${_filters.to}` : ""} # End date timestamp
                mediaId:"${id}"	# Media ID 
                ${
                  _filters && _filters.members
                    ? `membersId:[${_filters.members.map((member) => `"${member}"`).join("\n      ")}]`
                    : ""
                } # Start date timestamp

                     
              }) {
                edges {
                  node {
                    type: __typename							# Post type (personal or corporate)
                    ...on LinkedInPersonalStreamPost {
                      id										# Post unique identifier
                      postedAt								# Timestamp post has been posted at
                      postedBy {								# Ambassador who shared the post
                        firstName								
                        lastName
                        pictureUrl
                        timezone {
                          offset								# Timezone offset of the ambassador
                        }
                      }
                      views									# Number of view
                      clicks									# Number of clicks
                      shares									# Number of reshares
                      likes {
                        count									# Number of likes
                      }
                      comments {
                        count									# Number of comments
                      }
                    }
                    ...on LinkedInCorporateStreamPost {
                      id
                      postedAt
                      postedBy {
                        firstName
                        lastName
                        pictureUrl
                        timezone {
                          offset
                        }
                      }
                      views
                      clicks
                      shares
                      likes {
                        count
                      }
                      comments {
                        count
                      }
                    }
                  }
                }
              }
            }
          }
          
        `;

      stent.konsole.group("getPostsByGroup");
      stent.konsole.log({ data: query });

      // Renew data from server
      result = await stent.ajax.getApiAsync(query, "POST");
      if (
        result.ok &&
        result.message &&
        result.message.data &&
        result.message.data.workspaceContext &&
        result.message.data.workspaceContext.publishingPosts &&
        result.message.data.workspaceContext.publishingPosts.edges
      ) {
        if (stent.log) {
          stent.konsole.log({ response: result.message.data.workspaceContext.publishingPosts });
          stent.konsole.endGroup();
        }

        if (result.message.data.workspaceContext.publishingPosts.edges.length > 0) {
          return {
            edges: result.message.data.workspaceContext.publishingPosts.edges,
          };
        } else {
          return {
            edges: [],
          };
        }
      } else {
        if (stent.log) {
          stent.konsole.error({ response: result });
          stent.konsole.endGroup();
        }

        stent.toast.danger("Error when trying to fetch the media. Please refresh the page to try again.");

        return {
          edges: [],
        };
      }
    }
  };

  const buildColumnListSelect = async function(){
    let html = "";
   
    for (const col of _ColDef) {
      let value = col.replaceAll("_"," ").toLowerCase()
      html +=`
      <option value="${col}" id="${col}_id">
        ${value}
      </option>
      `;
    }
    $("#colDefSelect").html(html).selectpicker('selectAll');
  }

  const buildMembersFiltersSelect = async function () {
    let html = "";

    // Set Members list
    let members = await getMembers();
    _members = members.edges;

    for (const member of _members) {
      let pictureUrl = member.node.pictureUrl
        ? member.node.pictureUrl
        : "/assets/img/avatars/profiles/default-avatar-round.png";
      html += `<option data-content="<div class='ambassador-field'>
            <div class='avatar avatar-sm'>
              <img src='${pictureUrl}' alt='${member.node.firstName} ${member.node.lastName}' class='avatar-img rounded-circle'>
            </div>
            <span class='font-weight-bold ml-2'>${member.node.firstName} ${member.node.lastName}</span>
            </div>" value="${member.node.id}" id="${member.node.id}">${member.node.firstName} ${member.node.lastName}</option>`;
    }

    $("#membersFilter").html(html).selectpicker();
  };

const exportTable = function(){
  let table = document.getElementsByTagName("table");
        TableToExcel.convert(table[1], {
          // html code may contain multiple tables so here we are refering to 1st table tag
          name: `export.xlsx`, // fileName you could use any name
          sheet: {
            name: "Sheet 1", // sheetName
          },
        });
}

  const buildStatisticsTable = async function (fileType,isLoadingMore = false) {
    
    $(".spinner-grow").removeClass("d-none");

    // Set group list
    let headersGroup = await getHeadersByGroup();
    _groups = headersGroup.edges;

    initGrouppedStat();

    if (!isLoadingMore) {
      if (_groups.length == 0) {
        $("#StatisticsList").html(
          `
                <div class="alert alert-warning mt-3" role="alert">
                  No Statistics found.
                </div>
                `
        );
        return;
      }
    }

    // Start building HTML
    let html = "";
    if (!isLoadingMore) {
      /* eslint-disable */
      // Table headers

      if(fileType !== "excel"){
        html = `
        <div class="table-responsive">
        <table class="table table-bordered table-light table-sm">
          <thead id="StatisticsDataTableHeader">
            <tr>
              <th id="AMBASSADOR/MEDIA"  width="800">AMBASSADOR / MEDIA</th>

              <th id="DATE" data-t="s">DATE<span class="data-exclude" data-exclude="true" data-toggle="tooltip" data-placement="bottom" data-html=true title="<div class='text-left text-primary'>Date format </div><div>DD/MM/YYYY</div>" data-original-title="DATE">  <i class="d-inline-block fe fe-info h6 mb-0"></i></span></th>

              <th id="ORGANIC_REACH"  class="text-right">ORGANIC REACH</th>

              <th id="CLICKS"  class="text-right"><span  data-toggle="tooltip" data-placement="bottom" data-html=true title="<div class='text-left text-primary'>Click Rate % = </div><div>clicks / organic reach</div>" data-original-title="CLICKS (Click Rate %)">CLICKS <span class="font-weight-bold h6 text-capitalize">(Click Rate %)</span> <i class="d-inline-block fe fe-info h6 mb-0"></i></span></th>

              <th id="LIKES"  class="text-right">LIKES</th>

              <th id="COMMENTS"  class="text-right">COMMENTS</th>

              <th id="SHARES" class="text-right">SHARES</th>

              <th id="POSTS" class="text-right">POSTS</th>

              <th id="ENGAGEMENT_RATE"  class="text-right"><span  data-toggle="tooltip" data-placement="bottom" data-html=true title="<div>(clicks + likes + comments +
                shares) / organic reach</div>" data-original-title="Engagement Rate %">Engagement Rate % <i class="d-inline-block fe fe-info h6 mb-0"></i></span></th>
            </tr>
          </thead>
          <tbody id="StatisticsDataTable" class="list fs-base"></tbody>
        </table>
      </div>
        `;
      }
      else{
        html = `
            <div class="table-responsive">
            <table class="table table-bordered table-light table-sm" id="exportTable">
              <thead id="StatisticsDataTableHeader">
                <tr>
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  width="800">AMBASSADOR / MEDIA</th>
  
                  <th
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  data-t="s">Jour</th>
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  data-t="s">Date</th>
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  data-t="s">Heure</th>

                  <th
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">ORGANIC REACH</th>
  
                  <th
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">CLICKS</th>
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">
                  CLICK RATE
                  </th>
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">LIKES</th>
  
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">COMMENTS</th>
  
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">SHARES</th>
  
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">POSTS</th>
  
                  <th 
                  data-f-sz="9"
                  data-fill-color="FAF8FD"
                  data-f-color="9C8CC3"
                  class="text-right">ENGAGEMENT RATE</th>
                </tr>
              </thead>
              <tbody id="StatisticsDataTable" class="list fs-base"></tbody>
            </table>
          </div>
            `;
      }
      

      /* eslint-enable */
      if(fileType !== "excel"){
        $("#StatisticsList").html(html);
      }
      else{
        $("#ExportList").html(html);
        
      }
      
    }

    // Table content
    html = "";

    for (const group of _groups) {
      let postsList = await getPostsByGroup(group.id);
      if(fileType !== "excel"){
        html += groupDOM(group, postsList);
      }
      else{
        html += groupDOM(group, postsList,fileType);
      }
     
    }
    if (!isLoadingMore) {
      stent.loader.hide();
    }

    if(fileType !== "excel"){
      
    $("#StatisticsList tbody").html(html);
    $("#StatisticsList tbody").prepend(grouppedStatDOM(fileType));
    }
    else{
      $("#exportTable tbody").html(html);
    $("#exportTable tbody").prepend(grouppedStatDOM(fileType));
     exportTable();
    }
    hide_show_col(ColoumnsToShow);
  };

  const groupDOM = function (group, postsList,fileType) {
    let html = "";
    let id = group.id;
    let _posts = postsList.edges;

    let _totalClicks = 0;
    let _totalLikes = 0;
    let _totalComments = 0;
    let _totalShares = 0;
    let _totalPosts = _posts.length;
    let _totalReach = 0;
    let _totalClicksRate = 0;
    let _totalEngagementRate = 0;

    _posts.forEach((post) => {
      _totalClicks += post.node.clicks;
      _totalLikes += post.node.likes.count;
      _totalComments += post.node.comments.count;
      _totalShares += post.node.shares;
      _totalReach += post.node.views;
    });

    _totalClicksRate = (_totalClicks / _totalReach) * 100 > 0 ? (_totalClicks / _totalReach) * 100 : "0";
    _totalEngagementRate =
      ((_totalClicks + _totalLikes + _totalComments + _totalShares) / _totalReach) * 100 > 0
        ? (((_totalClicks + _totalLikes + _totalComments + _totalShares) / _totalReach) * 100).toFixed(3)
        : "0";

    allReach += _totalReach;
    allClicks += _totalClicks;
    allClicksRate += _totalClicksRate;
    allLikes += _totalLikes;
    allComments += _totalComments;
    allShares += _totalShares;
    allPosts += _totalPosts;
    allEngagementsRate += _totalEngagementRate;

    if (_groupBy && _groupBy === "Ambassadors") {
      let pictureUrl = group.pictureUrl ? group.pictureUrl : "/assets/img/avatars/profiles/default-avatar-round.png";
      
      if(fileType !== "excel"){
      /* eslint-disable */
      html += `
        <tr class="lv-0 visible bg-white h4" data-program-name="${id}">
        <td  class="AMBASSADOR/MEDIA position-relative">
        <div class="ambassador-field">
        <span class="d-inline-block fe fe-chevron-down mr-1 toggle-children-visibility"></span>
        <div class="avatar avatar-sm">
          <img src="${pictureUrl}" alt="${group.firstName} ${group.lastName}" class="avatar-img rounded-circle">
        </div>
        <span class="font-weight-bold ml-2">${group.firstName} ${
        group.lastName
      }</span><span class="badge badge-info ml-2 d-none"><i class="fe fe-linkedin mr-2"></i>11.2K</span>
        </div>
        </td>
        <td class="DATE border border-bottom">
          </td>
          <td class="ORGANIC_REACH font-weight-bold  text-right">
          ${_totalReach > 0 ? _totalReach : "0"}
          </td>
          <td class="CLICKS font-weight-bold  text-right">
          ${_totalClicks > 0 ? _totalClicks : "0"} <span class="h4 text-muted"> (${_totalClicksRate}%) </span>
          </td>
          <td class="LIKES font-weight-bold  text-right">
          ${_totalLikes > 0 ? _totalLikes : "0"}
          </td>
          <td class="COMMENTS font-weight-bold  text-right">
          ${_totalComments > 0 ? _totalComments : "0"}
          </td>
          <td class="SHARES font-weight-bold  text-right">
          ${_totalShares > 0 ? _totalShares : "0"}
          </td>
          <td class="POSTS font-weight-bold  text-right">
          ${_totalPosts}
          </td>
          <td class="ENGAGEMENT_RATE font-weight-bold  text-primary text-right">
          ${_totalEngagementRate}%
          </td>
        </tr>
        `;

      _posts.forEach((post) => {
        html += postDOM(post.node);
      });
      /* eslint-enable */
    }

else{
  /* eslint-disable */
  html += `
  <tr class="lv-0 visible bg-white h4">
  <td 
  data-f-bold="true" data-f-color="702EEA"	
  class="position-relative">
  <div class="ambassador-field">
  ${group.firstName} ${group.lastName}
  </div>
  </td>

  <td class="border border-bottom">
    </td>
    <td class="border border-bottom">
    </td>
    <td class="border border-bottom">
    </td>


    <td 
    data-f-bold="true"	data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalReach > 0 ? _totalReach : "0"}
    </td>
    <td
    data-f-bold="true" data-f-color="702EEA"	
    class="font-weight-bold  text-right">
    ${_totalClicks > 0 ? _totalClicks : "0"} 
    </td>

    <td
    data-f-bold="true"	 data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalClicksRate}
                  </td>
    <td
    data-f-bold="true"	data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalLikes > 0 ? _totalLikes : "0"}
    </td>
    <td 
    data-f-bold="true"	data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalComments > 0 ? _totalComments : "0"}
    </td>
    <td 
    data-f-bold="true"	 data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalShares > 0 ? _totalShares : "0"}
    </td>
    <td 
    data-f-bold="true"	data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalPosts}
    </td>
    <td
    data-f-bold="true"	data-f-color="702EEA"
    class="font-weight-bold  text-primary text-right">
    ${_totalEngagementRate}%
    </td>
  </tr>
  `;

_posts.forEach((post) => {
  html += postDOM(post.node,fileType);
});
/* eslint-enable */
}

    } else {
      let type = group.type ? group.type : null;
      if (!type) {
        type = "ArticleMedia";
      }
      let mediaConfig = stent.media.getMediaByKey(type);
      let previewUrl = "/assets/img/media/no-article.gif";
      if (type === "ArticleMedia") {
        previewUrl = group.thumbnailUrl;
      } else if (type === "ImageMedia") {
        previewUrl = group.thumbnailUrl;
      } else if (type === "VideoMedia") {
        previewUrl = "/assets/img/media/no-video.gif";
      } else if (type === "DocumentMedia") {
        previewUrl = "/assets/img/media/no-document.gif";
      }

      let title = group.title ? group.title : "";
      let trancateTitle = title.length > 30 ? title.substring(0, 30).concat("...") : title;
      let summary = group.summary ? group.summary : "";
      let trancateSummary = summary.substring(0, 30).concat("...");
      let url = group.contentUrl ? group.contentUrl : null;
      let cpm = getCpm("linkedIn",_totalReach,"$ USD");
      if(fileType !== "excel"){
      /*eslint-disable*/
      html += `
          <tr class="lv-0 visible bg-white h4" data-program-name="${id}">
          <td class="AMBASSADOR/MEDIA position-relative">
          <div class="aMedia align-items-center d-flex media-field">
          <span class="d-inline-block fe fe-chevron-down mr-1 toggle-children-visibility"></span>
        <div class="mediaImageWrapper">
          <img src="${previewUrl}" class="img-fluid">
        </div>
        <div class="media-body">
          <div class="media-title">
            <a href="${url}" title="${title}"><span class="mr-2">${trancateTitle}</span></a>
            
          </div>
          <p class="media-summary" title="${summary}">
          ${trancateSummary}
          </p>

          <div class="media-tags">
            <span class="badge border border-primary mr-2 text-primary"><i class="fe ${
              mediaConfig.fontawsome
            } mr-2"></i>${
        mediaConfig.name
      }</span><span class="badge badge-primary mr-2"><strong>CPM: </strong>${cpm}</span>
          </div>
        </div>
      </div>
          </td>
          <td class="DATE border border-bottom">
          </td>
          <td class="ORGANIC_REACH font-weight-bold  text-right">
          ${_totalReach > 0 ? _totalReach : "0"}
          </td>
          <td class="CLICKS font-weight-bold  text-right">
          ${_totalClicks > 0 ? _totalClicks : "0"} <span class="h4 text-muted"> (${_totalClicksRate}%) </span>
          </td>
          <td class="LIKES font-weight-bold  text-right">
          ${_totalLikes > 0 ? _totalLikes : "0"}
          </td>
          <td class="COMMENTS font-weight-bold  text-right">
          ${_totalComments > 0 ? _totalComments : "0"}
          </td>
          <td class="SHARES font-weight-bold  text-right">
          ${_totalShares > 0 ? _totalShares : "0"}
          </td>
          <td class="POSTS font-weight-bold  text-right">
          ${_totalPosts}
          </td>
          <td class="ENGAGEMENT_RATE font-weight-bold  text-primary text-right">
          ${_totalEngagementRate}%
          </td>
          
          </tr>
          `;

      _posts.forEach((post) => {
        html += postDOM(post.node);
      });

      /* eslint-enable */
    }
    else{
      /*eslint-disable*/
      html += `
          <tr class="lv-0 visible bg-white h4" >
          <td 
          data-f-bold="true" data-f-color="702EEA"	
          class="position-relative" data-hyperlink="${url}">
            <a href="${url}">${title} [${mediaConfig.name}]</a>
          </td>

          <td class="border border-bottom">
          </td>
          <td class="border border-bottom">
          </td>
          <td class="border border-bottom">
          </td>

          <td
          data-f-bold="true"	data-f-color="702EEA"
          class="font-weight-bold  text-right">
          ${_totalReach > 0 ? _totalReach : "0"}
          </td>
          <td 
          data-f-bold="true"	 data-f-color="702EEA"
          class="font-weight-bold  text-right">
          ${_totalClicks > 0 ? _totalClicks : "0"} 
          </td>

          <td
    data-f-bold="true"	data-f-color="702EEA"
    class="font-weight-bold  text-right">
    ${_totalClicksRate}
                  </td>

          <td 
          data-f-bold="true"	data-f-color="702EEA"
          class="font-weight-bold  text-right">
          ${_totalLikes > 0 ? _totalLikes : "0"}
          </td>
          <td 
          data-f-bold="true"	data-f-color="702EEA"
          class="font-weight-bold  text-right">
          ${_totalComments > 0 ? _totalComments : "0"}
          </td>
          <td 
          data-f-bold="true"	data-f-color="702EEA"
          class="font-weight-bold  text-right">
          ${_totalShares > 0 ? _totalShares : "0"}
          </td>
          <td 
          data-f-bold="true"	data-f-color="702EEA"
          class="font-weight-bold  text-right">
          ${_totalPosts}
          </td>
          <td 
          data-f-bold="true"	data-f-color="702EEA"
          class="font-weight-bold  text-primary text-right">
          ${_totalEngagementRate}%
          </td>
          
          </tr>
          `;

      _posts.forEach((post) => {
        html += postDOM(post.node,fileType);
      });

      /* eslint-enable */
    }
    }

    return html;
  };

  const getTimeZone = function (timeZone) {
    let timeZoneString = "";
    if (timeZone >= 0) {
      timeZoneString = "+" + timeZone;
    } else {
      timeZoneString = timeZone;
    }
    return timeZoneString;
  };

  const postDOM = function (node,fileType) {
   
    let html = "";

    if (_groupBy && _groupBy === "Ambassadors") {
      let id = node.media.id ? node.media.id : null;
      let type = node.media.type ? node.media.type : null;
      if (!type) {
        type = "ArticleMedia";
      }
      let mediaConfig = stent.media.getMediaByKey(type);
      let previewUrl = "/assets/img/media/no-article.gif";
      if (type === "ArticleMedia") {
        previewUrl = node.media.thumbnailUrl;
      } else if (type === "ImageMedia") {
        previewUrl = node.media.thumbnailUrl;
      } else if (type === "VideoMedia") {
        previewUrl = "/assets/img/media/no-video.gif";
      } else if (type === "DocumentMedia") {
        previewUrl = "/assets/img/media/no-document.gif";
      }

      let title = node.media.title ? node.media.title : "";
      let trancateTitle = title.length > 30 ? title.substring(0, 30).concat("...") : title;
      let summary = node.media.summary ? node.media.summary : "";
      let trancateSummary = summary.substring(0, 30).concat("...");
      let url = node.media.contentUrl ? node.media.contentUrl : null;

      let createdAt = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("DD/MM/YYYY - HH:mm") : null;
      let createdAtDate = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("DD/MM/YYYY") : null;
      let createdAtDay = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("dddd") : null;
      let createdAtHour = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("HH:mm") : null;
   
      let timeZone = node.postedBy.timezone.offset ? getTimeZone(node.postedBy.timezone.offset) : "-";

      let clicks = node.clicks ? node.clicks : "0";
      let likes = node.likes.count ? node.likes.count : "0";
      let comments = node.comments.count ? node.comments.count : "0";
      let shares = node.shares ? node.shares : "0";
      let reach = node.views ? node.views : "0";
      let clicksRate = (clicks / reach) * 100 > 0 ? (clicks / reach) * 100 : "0";

      dateArray.push(moment(node.postedAt));
      dateArray = dateArray.sort((a, b) => a.diff(b))

      let engagementRate =
        ((node.clicks + node.likes.count + node.comments.count + node.shares) / node.views) * 100 > 0
          ? (((node.clicks + node.likes.count + node.comments.count + node.shares) / node.views) * 100).toFixed(3)
          : "0";

          let cpm = getCpm("linkedIn",reach,"$ USD");

       if(fileType != "excel"){
/*eslint-disable*/
html += `
<tr class="lv-1" data-item-id="${id}">
<td class="AMBASSADOR/MEDIA pl-6">
<div class="aMedia align-items-center d-flex media-field">
<div class="mediaImageWrapper">
<img src="${previewUrl}" class="img-fluid">
</div>
<div class="media-body">
<div class="media-title">
  <a href="${url}" title="${title}"><span class="mr-2">${trancateTitle}</span></a>
  
</div>
<p class="media-summary" title="${summary}">
${trancateSummary}
</p>

<div class="media-tags">
  <span class="badge border border-primary mr-2 text-primary"><i class="fe ${mediaConfig.fontawsome} mr-2"></i>${mediaConfig.name}</span><span class="badge badge-primary mr-2"><strong>CPM: </strong>${cpm}</span>
</div>
</div>
</div>
</td>
<td class="DATE border border-bottom font-size-12">
<div class="createdAt">
    <span class="createdAt-day">${createdAtDay} </span>
    <span class="createdAt-date">${createdAt} </span>
    <span class="createdAt-timeZone"> (UTC${timeZone}) </span>
</div>


</td>
<td class="ORGANIC_REACH font-size-12 text-right">
${reach}
</td>

<td class="CLICKS font-size-12 text-right">
${clicks} <span class="h4 text-muted" style="font-size: 11px;"> (${clicksRate}%) </span>
</td>

<td class="LIKES font-size-12 text-right">
${likes}
</td>

<td class="COMMENTS font-size-12 text-right">
${comments}
</td>

<td class="SHARES font-size-12 text-right">
${shares}
</td>

<td class="POSTS font-size-12 text-right">

</td>
<td class="ENGAGEMENT_RATE font-size-12 text-primary text-right">
${engagementRate}%
</td>
</tr>
`;
/* eslint-enable */
       }
       
       else{
         /*eslint-disable*/
html += `
<tr class="lv-1" >
<td 
data-a-indent="2"
class="pl-6" data-hyperlink="${url}">
  <a href="${url}" >${title} [${mediaConfig.name}]</a>
</td>
<td class="border border-bottom font-size-12">

    ${createdAtDay}

</td>
<td class="border border-bottom font-size-12"  >
${createdAtDate} 
</td>
<td class="border border-bottom font-size-12">
${createdAtHour}
</td>

<td class="font-size-12 text-right">
${reach}
</td>

<td class="font-size-12 text-right">
${clicks} 
</td>
<td class="font-size-12 text-right">
${clicksRate}%
</td>
<td class="font-size-12 text-right">
${likes}
</td>

<td class="font-size-12 text-right">
${comments}
</td>

<td class="font-size-12 text-right">
${shares}
</td>

<td class="font-size-12 text-right">

</td>
<td class="font-size-12 text-primary text-right">
${engagementRate}%
</td>
</tr>
`;
/* eslint-enable */
       }
      
    } else {
      let id = node.id ? node.id : null;
      let pictureUrl = node.postedBy.pictureUrl
        ? node.postedBy.pictureUrl
        : "/assets/img/avatars/profiles/default-avatar-round.png";

      let createdAt = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("DD/MM/YYYY - HH:mm") : null;
      let createdAtDate = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("DD/MM/YYYY") : null;

      let createdAtDay = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("dddd") : null;
      let createdAtHour = node.postedAt && node.postedAt !== 0 ? moment(node.postedAt).format("HH:mm") : null;
      let timeZone = node.postedBy.timezone.offset ? getTimeZone(node.postedBy.timezone.offset) : "-";

      let clicks = node.clicks ? node.clicks : "0";
      let likes = node.likes.count ? node.likes.count : "0";
      let comments = node.comments.count ? node.comments.count : "0";
      let shares = node.shares ? node.shares : "0";
      let reach = node.views ? node.views : "0";
      let clicksRate = (clicks / reach) * 100 > 0 ? (clicks / reach) * 100 : "0";

      let engagementRate =
        ((node.clicks + node.likes.count + node.comments.count + node.shares) / node.views) * 100 > 0
          ? (((node.clicks + node.likes.count + node.comments.count + node.shares) / node.views) * 100).toFixed(3)
          : "0";

          if(fileType != "excel"){
            html += `

            <tr class="lv-1" data-item-id="${id}">
            <td class="AMBASSADOR/MEDIA pl-6">
                <div class="ambassador-field">
              <div class="avatar avatar-sm">
                <img src="${pictureUrl}" alt="${node.postedBy.firstName} ${node.postedBy.lastName}" class="avatar-img rounded-circle">
              </div>
              <span class="font-weight-bold ml-2">${node.postedBy.firstName} ${node.postedBy.lastName}</span><span class="badge badge-info ml-2 d-none"><i class="fe fe-linkedin mr-2"></i>11.2K</span>
              </div>
            </td>
            <td class="DATE border border-bottom font-size-12">
  
            <div class="createdAt">
            <span class="createdAt-day">${createdAtDay}  </span>
            <span class="createdAt-date">${createdAt} </span>
            <span class="createdAt-timeZone"> (UTC${timeZone}) </span>
        </div>
  
            </td>
            <td class="ORGANIC_REACH font-size-12 text-right">
            ${reach}
            </td>
  
            <td class="CLICKS font-size-12 text-right">
            ${clicks} <span class="h4 text-muted" style="font-size: 11px;">  (${clicksRate}%) </span>
            </td>
  
            <td class="LIKES font-size-12 text-right">
            ${likes}
            </td>
  
            <td class="COMMENTS font-size-12 text-right">
            ${comments}
            </td>
  
            <td class="SHARES font-size-12 text-right">
            ${shares}
            </td>
  
            <td class="POSTS font-size-12 text-right">
            
            </td>
            <td class="ENGAGEMENT_RATE font-size-12 text-primary text-right">
            ${engagementRate}%
            </td>
            </tr>
          `;
          }
          else{
            html += `

          <tr class="lv-1" >
          <td 
          data-a-indent="2"
          class="pl-6">
             
            
            ${node.postedBy.firstName} ${node.postedBy.lastName}
         
          </td>
          <td class="border border-bottom font-size-12">
          ${createdAtDay}
        
     

          </td>
          <td class="border border-bottom font-size-12">
${createdAtDate} 

          </td>
          <td class="border border-bottom font-size-12">
${createdAtHour}
          </td>
          <td class="font-size-12 text-right">
          ${reach}
          </td>

          <td class="font-size-12 text-right">
          ${clicks}
          </td>
          <td class="font-size-12 text-right">
         ${clicksRate}%
          </td>
          <td class="font-size-12 text-right">
          ${likes}
          </td>

          <td class="font-size-12 text-right">
          ${comments}
          </td>

          <td class="font-size-12 text-right">
          ${shares}
          </td>

          <td class="font-size-12 text-right">
          
          </td>
          <td class="font-size-12 text-primary text-right">
          ${engagementRate}%
          </td>
          </tr>
        `;
          }
      
    }

    return html;
  };

  const bindEvents = function () {
    $("body").on("click", "#btnExport", function () {
     
      console.log("begin!!!!!");
      buildStatisticsTable("excel");
    });

    $("#grouBy").on("changed.bs.select", async function (e, clickedIndex, isSelected, previousValue) {
      _groupBy = $("#grouBy").selectpicker("val");

      stent.loader.show(".main-content");
      await buildStatisticsTable();
      stent.loader.hide();
    });


    $("#colDefSelect").on("changed.bs.select", async function (e, clickedIndex, isSelected, previousValue) {
      ColoumnsToShow = $("#colDefSelect").selectpicker("val");
    console.log(ColoumnsToShow);
    hide_show_col(ColoumnsToShow);
     
    });


    $("#membersFilter").on("changed.bs.select", async function (e, clickedIndex, isSelected, previousValue) {
      _filters.members = $("#membersFilter").selectpicker("val");
      console.log(_filters.members);
      stent.loader.show(".main-content");
      await buildStatisticsTable();
      stent.loader.hide();
    });

    $("body")
      .off("click", ".toggle-children-visibility")
      .on("click", ".toggle-children-visibility", function () {
        let tr = $(this).closest("tr");
        let trNext = tr.nextAll();

        if ($(this).hasClass("fe-chevron-down")) {
          // Close Childrens
          $(this).removeClass("fe-chevron-down").addClass("fe-chevron-right");
          $(this).closest("tr").removeClass("visible");

          for (let i = 0; i < trNext.length; i++) {
            if ($(trNext[i]).hasClass("lv-0")) {
              break;
            } else {
              $(trNext[i]).addClass("d-none");
            }
          }
        } else {
          // Open children
          $(this).removeClass("fe-chevron-right").addClass("fe-chevron-down");
          $(this).closest("tr").addClass("visible");

          for (let i = 0; i < trNext.length; i++) {
            if ($(trNext[i]).hasClass("lv-0")) {
              break;
            } else {
              $(trNext[i]).removeClass("d-none");
            }
          }
        }
      });
  };

  const init = async function () {
    // Active corresponding menu
    stent.navbar.activeMenu("statistics");

    // change Page title
    stent.ui.setPageTitle("Statistics");

    //init Filters
    initFilters();
    initGroupBy();

    //bind events
    bindEvents();

    stent.loader.show(".main-content");
    await buildMembersFiltersSelect();
    await buildColumnListSelect();
    initDateFilter();
  };

  init();
})();
