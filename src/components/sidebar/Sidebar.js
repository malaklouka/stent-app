import React from 'react'
import { NavLink } from 'react-router-dom'
import './sidebar.css'
import {  FiFileText, FiHome, FiSend, FiSettings, FiTarget, FiUsers} from  "react-icons/fi"
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useQuery, gql } from "@apollo/client";
import { useState } from 'react'

const WORKSPACE_QUERY = gql`
query {
  workspaceContext {
    navigation {
      items {
        id
        icon
        type
        href
        name
        items {
          id
          icon
          type
          href
          name
        }
      }
    }
  }
}
`;




const Sidebar = () => {

  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  const hide = () => setOpen(false);
  const show = () => setOpen(true);

  const { data, loading, error } = useQuery(WORKSPACE_QUERY);
  console.log(data)

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>
  const works= data.workspaceContext
  console.log(works)

  return (
    <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-dark" id="sidebar">
    <div className="container-fluid">
      <div id="navigation-header" aria-expanded="true">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span></button>
           <a href="./" id="current-workspace-avatar">
             
             <span title="Candorvision" style={{backgroundColor: "rgba(130, 130, 136, 1)"}} className="initials">
               
            
             {data.workspaceContext && data.workspaceContext.map((workspace) => (
          <span key={workspace.navigation.item.id}>{workspace.navigation.item.name.match(/\b(\w)/g)}</span>
        ))}





               </span></a>
             <div id="workspace-and-user-wrapper">
               <div id="workspace-name">Candorvision</div>
               <div id="user-wrapper" class="dropdown">
                 <img id="user-avatar" src="/assets/img/avatars/profiles/default-avatar.gif" class="avatar dropdown-toggle" data-toggle="dropdown" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif';" alt="nakaa malak"/>
  <div id="user-name">nakaa malak</div>
  <a href="#" className="dropdown-toggle flex-row align-items-center" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="arrow-sign-out"></a>
  <div className="dropdown-menu dropdown-menu-right dropdown-toggle-no-caret" aria-labelledby="sidebarIconCopy" id="dropDownProfile">
    <a href="edit-profile.html" className="dropdown-item ui-link">Edit profile</a> <a href="/sign-out.html?tenantKey=2312046672" class="dropdown-item" id="sign-out-link">Sign out</a></div>
   




    </div>
    </div>
    </div>
  <div class="collapse navbar-collapse show" id="sidebarCollapse">
  

<List className='navbar-nav' sx={{ width: '100%', maxWidth: 360}} component="nav" aria-labelledby="nested-list-subheader">
  {/* dashboard */}
<ListItemButton className="nav-item">
  <ListItemIcon className="nav-link">
    <FiHome />
  </ListItemIcon>
  <NavLink to="/" >      
  <ListItemText primary="Dashboard"  style={{color:'#c0b1d9'}}   className="nav-item"/>

                 
</NavLink>
</ListItemButton>

{/* team */}
<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
    <FiUsers />
  </ListItemIcon>
  <ListItemText primary="Team" style={{color:'#c0b1d9'}} />
  {open ? <ExpandLess style={{color:'#c0b1d9'}} /> : <ExpandMore style={{color:'#c0b1d9'}}/>}
</ListItemButton>
<Collapse in={open}  unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      
      <NavLink to="/members" className="nav-link ui-link" >
      <ListItemText primary="Ambassadors"   style={{color:'#c0b1d9'}} />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/dashboard-user"  className="nav-link ui-link"> 
      <ListItemText primary="Dashboard"  style={{color:'#c0b1d9'}}  />

      </NavLink>

    </ListItemButton>
  </List>
</Collapse>
{/* audience */}

<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
    <FiTarget />
  </ListItemIcon>
  <ListItemText primary="Audience"  style={{color:'#c0b1d9'}}  />
  {open ? <ExpandLess style={{color:'#c0b1d9'}} /> : <ExpandMore style={{color:'#c0b1d9'}}/>}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
  <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/personas-list" className="nav-link ui-link">
      <ListItemText primary="Personas"  style={{color:'#c0b1d9'}} />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/finder-list" className="nav-link ui-link">
      <ListItemText primary="finder" style={{color:'#c0b1d9'}}  />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/contacts"  className="nav-link ui-link"> 
      <ListItemText primary="contact"  style={{color:'#c0b1d9'}}  />

      </NavLink>

    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/segments"  className="nav-link ui-link"> 
      <ListItemText primary="Segments"  style={{color:'#c0b1d9'}}  />

      </NavLink>

    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/funnel"  className="nav-link ui-link"> 
      <ListItemText primary="Funnel"  style={{color:'#c0b1d9'}}  />

      </NavLink>

    </ListItemButton>
  </List>
</Collapse>

{/* compaigns */}

<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
  <FiSend/>  </ListItemIcon>
  <ListItemText primary="Campaigns "  style={{color:'#c0b1d9'}}  />
  {open ? <ExpandLess  style={{color:'#c0b1d9'}} /> : <ExpandMore style={{color:'#c0b1d9'}} />}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
  <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/campaign-list-nurture-linkedin-cohort" className="nav-link ui-link">
      <ListItemText primary="Invite"  style={{color:'#c0b1d9'}}  />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="campaign-list-nurture-linkedin-segment" className="nav-link ui-link">
      <ListItemText primary="Nurture"  style={{color:'#c0b1d9'}}  />

                </NavLink>
    </ListItemButton>
    
  </List>
</Collapse>

{/* content */}

<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
  <FiFileText/>   </ListItemIcon>
  <ListItemText primary="Content "  style={{color:'#c0b1d9'}}  />
  {open ? <ExpandLess style={{color:'#c0b1d9'}} /> : <ExpandMore style={{color:'#c0b1d9'}}/>}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
  <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/media-list" className="nav-link ui-link">
      <ListItemText primary="Media"  style={{color:'#c0b1d9'}}  />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/tenant-planification" className="nav-link ui-link">
      <ListItemText primary="Calendar"  style={{color:'#c0b1d9'}}  />

                </NavLink>
    </ListItemButton>
    
  </List>
</Collapse>
<li style={{marginLeft: "-18px", marginRight: "-18px"}}>
            <hr className="navbar-divider my-3"/>
          </li>
{/* settings */}
<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
  <FiSettings/>   </ListItemIcon>
  <ListItemText primary="Settings "  style={{color:'#c0b1d9'}}  />
  {open ? <ExpandLess style={{color:'#c0b1d9'}} /> : <ExpandMore style={{color:'#c0b1d9'}} />}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
  <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/apps" className="nav-link ui-link">
      <ListItemText primary="Apps"  style={{color:'#c0b1d9'}} />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="" className="nav-link ui-link">
      <ListItemText primary="API"  style={{color:'#c0b1d9'}}  />

                </NavLink>
    </ListItemButton>
    
  </List>
</Collapse>
</List>
         
         
       
          </div>
          
          <div id="workspaces-wrapper-column">
            <div id="workspaces-wrapper">
              <div id="workspaces"></div>
              <div id="search-and-admin-wrapper">
                <div id="search-workspace-wrapper"><span id="search-tenant">
                  <img src="../../assets/img/search.svg" alt="search"/></span>
                  <input type="text" className="form-control search" id="filter-tenant" placeholder="Type a workspace name" autocomplete="off"/>
                  <button type="button" className="close" id="close-search">
                    <span aria-hidden="true">×</span></button></div>
                    <a href="//admin.stent.io" id="go-to-admin-wrapper" style={{display: "flex"}}>
                      <div className="icon"><img src="/assets/img/admin.svg" alt="admin"/></div>
              <span className="goto-admin-title">Administration</span></a></div>
                 </div>
                 </div>


   

                 
                 </div>
                </nav>
  )}

{/* <div class="page-wrapper chiller-theme toggled">

  <a id="show-sidebar" class="btn btn-sm btn-dark" href="#">
    <i class="fas fa-bars"></i>
  </a>
  <nav id="sidebar" class="sidebar-wrapper">
    <div class="sidebar-content">
      <div class="sidebar-brand">
        <a href="#">Candorvision</a>
        <div id="close-sidebar">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="sidebar-header">
        <div class="user-pic">
          <img class="img-responsive img-rounded" src=""
            alt="User"/>
        </div>
        <div class="user-info">
          <span class="user-name">Jhon
            <strong>Smith</strong>
          </span>
       
        
        </div>
      </div>
      {/* <div class="sidebar-search">
        <div>
          <div class="input-group">
            <input type="text" class="form-control search-menu" placeholder="Search..."/>
            <div class="input-group-append">
              <span class="input-group-text">
                <i class="fa fa-search" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </div>
      </div> */}
//       <div class="sidebar-menu">
//         <ul>
          
//           <li class="sidebar-dropdown">
//             <a href="#">
//               <i class="fa fa-tachometer-alt"></i>
//               <span>Dashboard</span>
//             </a>
          
//           </li>
//           <li class="sidebar-dropdown">
//             <a href="#">
//               <i class="fa fa-shopping-cart"></i>
//               <span>Team</span>
//             </a>
//             <div class="sidebar-submenu">
//               <ul>
//                 <li>
//                   <a href="#">Products

//                   </a>
//                 </li>
//                 <li>
//                   <a href="#">Orders</a>
//                 </li>
//                 <li>
//                   <a href="#">Credit cart</a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li class="sidebar-dropdown">
//             <a href="#">
//               <i class="far fa-gem"></i>
//               <span>Audience</span>
//             </a>
//             <div class="sidebar-submenu">
//               <ul>
//                 <li>
//                   <a href="#">General</a>
//                 </li>
//                 <li>
//                   <a href="#">Panels</a>
//                 </li>
//                 <li>
//                   <a href="#">Tables</a>
//                 </li>
//                 <li>
//                   <a href="#">Icons</a>
//                 </li>
//                 <li>
//                   <a href="#">Forms</a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li class="sidebar-dropdown">
//             <a href="#">
//               <i class="fa fa-chart-line"></i>
//               <span>Campaigns</span>
//             </a>
//             <div class="sidebar-submenu">
//               <ul>
//                 <li>
//                   <a href="#">Pie chart</a>
//                 </li>
//                 <li>
//                   <a href="#">Line chart</a>
//                 </li>
//                 <li>
//                   <a href="#">Bar chart</a>
//                 </li>
//                 <li>
//                   <a href="#">Histogram</a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li class="sidebar-dropdown">
//             <a href="#">
//               <i class="fa fa-globe"></i>
//               <span>Content</span>
//             </a>
//             <div class="sidebar-submenu">
//               <ul>
//                 <li>
//                   <a href="#">Google maps</a>
//                 </li>
//                 <li>
//                   <a href="#">Open street map</a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li class="header-menu">
//             <span>Settings</span>
//           </li>
      
       
//         </ul>
//       </div>
//     </div>
 
//   </nav>
 

// </div> */}

export default Sidebar