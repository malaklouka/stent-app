import React from 'react'

const side = () => {
  return (
<nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-dark" id="sidebar"><div class="container-fluid"><div id="navigation-header" aria-expanded="true"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button> <a href="./" id="current-workspace-avatar"><span title="Candorvision" style="background-color: rgba(130, 130, 136, 1);" class="initials">CA</span></a><div id="workspace-and-user-wrapper"><div id="workspace-name">Candorvision</div><div id="user-wrapper" class="dropdown"><img id="user-avatar" src="/assets/img/avatars/profiles/default-avatar.gif" class="avatar dropdown-toggle" data-toggle="dropdown" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif';" alt="nakaa malak"/><div id="user-name">nakaa malak</div><a href="#" class="dropdown-toggle flex-row align-items-center" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="arrow-sign-out"></a><div class="dropdown-menu dropdown-menu-right dropdown-toggle-no-caret" aria-labelledby="sidebarIconCopy" id="dropDownProfile"><a href="edit-profile.html" class="dropdown-item ui-link">Edit profile</a> <a href="/sign-out.html?tenantKey=2312046672" class="dropdown-item" id="sign-out-link">Sign out</a></div></div></div></div><div class="collapse navbar-collapse show" id="sidebarCollapse"><ul class="navbar-nav">
                <li class="nav-item">
                  <a href="home" class="nav-link ui-link active">
                    <i class="fe fe-home"></i> Dashboard
                  </a>
                </li>
              
                <li class="nav-item">
                  <a class="nav-link" href="#sidebarUsers" data-toggle="collapse" role="button" aria-controls="sidebarUsers" aria-expanded="true"><i class="fe fe-users"></i> Team</a>
                  <div class="collapse show" id="sidebarUsers" style="">
                    <ul class="nav nav-sm flex-column">                              
                    
                      <li class="nav-item"><a href="members" class="nav-link ui-link">Ambassadors</a></li><li class="nav-item"><a href="dashboard-user" class="nav-link ui-link">Dashboard</a></li>
                    </ul>
                  </div>
                </li>
              
                <li class="nav-item">
                  <a class="nav-link collapsed" href="#sidebarContacts" data-toggle="collapse" role="button" aria-controls="sidebarContacts" aria-expanded="false"><i class="fe fe-target"></i> Audience</a>
                  <div class="collapse" id="sidebarContacts" style="">
                    <ul class="nav nav-sm flex-column">                              
                    <li class="nav-item"><a href="personas-list" class="nav-link ui-link">Personas</a></li>
                      <li class="nav-item"><a href="finder-list" class="nav-link ui-link">Finders</a></li><li class="nav-item"><a href="contacts" class="nav-link ui-link">Contacts</a></li><li class="nav-item"><a href="segments-list" class="nav-link ui-link">Segments</a></li><li class="nav-item"><a href="funnel" class="nav-link ui-link">Funnel</a></li>
                    </ul>
                  </div>
                </li>
              
                <li class="nav-item">
                  <a class="nav-link collapsed" href="#sidebarCampaigns" data-toggle="collapse" role="button" aria-controls="sidebarCampaigns" aria-expanded="false"><i class="fe fe-send"></i> Campaigns</a>
                  <div class="collapse" id="sidebarCampaigns" style="">
                    <ul class="nav nav-sm flex-column">                              
                    
                      <li class="nav-item"><a href="campaign-list-nurture-linkedin-cohort" class="nav-link ui-link">Invite</a></li><li class="nav-item"><a href="campaign-list-nurture-linkedin-segment" class="nav-link ui-link">Nurture</a></li>
                    </ul>
                  </div>
                </li>
              
                <li class="nav-item">
                  <a class="nav-link collapsed" href="#sidebarNewsfeed" data-toggle="collapse" role="button" aria-controls="sidebarNewsfeed" aria-expanded="false"><i class="fe fe-file-text"></i> Content</a>
                  <div class="collapse" id="sidebarNewsfeed" style="">
                    <ul class="nav nav-sm flex-column">                              
                    
                      <li class="nav-item"><a href="media-list" class="nav-link ui-link">Media</a></li><li class="nav-item"><a href="tenant-planification" class="nav-link ui-link">Calendar</a></li>
                    </ul>
                  </div>
                </li>
              <li style="margin-left: -18px;margin-right: -18px;"><hr class="navbar-divider my-3"/></li>
                <li class="nav-item">
                  <a class="nav-link collapsed" href="#settingsMenu" data-toggle="collapse" role="button" aria-controls="settingsMenu" aria-expanded="false"><i class="fe fe-settings"></i> Settings</a>
                  <div class="collapse" id="settingsMenu" style="">
                    <ul class="nav nav-sm flex-column">                              
                    
                      <li class="nav-item"><a href="apps" class="nav-link ui-link">Apps</a></li><li class="nav-item"><a href="api" class="nav-link ui-link">API</a></li>
                    </ul>
                  </div>
                </li>
              </ul></div><div id="workspaces-wrapper-column" class=""><div id="workspaces-wrapper">
                  <div id="workspaces"></div><div id="search-and-admin-wrapper">
                      <div id="search-workspace-wrapper"><span id="search-tenant">
                          <img src="/assets/img/search.svg"/> </span>
                          <input type="text" class="form-control search" id="filter-tenant" placeholder="Type a workspace name" autocomplete="off"/> <button type="button" class="close" id="close-search"><span aria-hidden="true">×</span></button></div><a href="//admin.stent.io" id="go-to-admin-wrapper" style="display: flex;"><div class="icon"><img src="/assets/img/admin.svg"/></div><span class="goto-admin-title">Administration</span></a></div></div></div></div></nav>  )
}

export default side