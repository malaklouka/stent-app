
<List className='navbar-nav'
sx={{ width: '100%', maxWidth: 360}}
component="nav"
aria-labelledby="nested-list-subheader"

>
<ListItemButton className="nav-item">
  <ListItemIcon className="nav-link">
    <FiHome />
  </ListItemIcon>
  <NavLink to="/" className="nav-link ui-link active">      
  <ListItemText primary="Dashboard"  className="nav-item"/>

                 
</NavLink>
</ListItemButton>

<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
    <FiUsers />
  </ListItemIcon>
  <ListItemText primary="Team" />
  {!open ? <ExpandLess /> : <ExpandMore/>}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/members" className="nav-link ui-link">
      <ListItemText primary="Ambassadors" />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/dashboard-user"  className="nav-link ui-link"> 
      <ListItemText primary="Dashboard" />

      </NavLink>

    </ListItemButton>
  </List>
</Collapse>
</List>


const options= {

  chart: {
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Product Trends by Month',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: ['09 Apr', '10 Apr', '11Apr', '12Apr', '13 Apr', '14 Apr', '15 Apr', '16 Apr', '17 Apr','18 Apr', '19 Apr', '20Apr', '21 Apr', '22 Apr', '23 Apr', '24 Apr', '25 Apr', '26 Apr','27 Apr', '28 Apr', '29 Apr', ' 30 Apr', '1 May', '2 May', '3 May', '4 May ', '5 May', '6 May', '7 May', '8 May'],
  }
}
const series= [{
  name: "Desktops",
  data: [28, 28, 28, 28, 28,28, 28, 28,28, 28, 28,28, 28, 28, 28, 28, 28, 28, 28, 26, 26,32, 32, 33, 33, 33, 33, 33, 33,33, 0]
}]

  {/*
            <li className="nav-item">
              <a className="nav-link" href="#sidebarContacts" data-toggle="collapse" role="button" aria-controls="sidebarContacts">
                <FiTarget/> Audience</a>
              <div className="collapse" id="sidebarContacts">
                <ul className="nav nav-sm flex-column">                              
                <li className="nav-item">
                  <NavLink to="personas-list" className="nav-link ui-link">Personas</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/finder-list" className="nav-link ui-link">Finders</NavLink>
                    </li><li class="nav-item">
                      <NavLink to="contacts"> Contacts</NavLink>
                      </li><li class="nav-item">
                        <NavLink to="/segments-list" class="nav-link ui-link">Segments</NavLink></li><li class="nav-item">
                        <NavLink to="funnel" class="nav-link ui-link">Funnel</NavLink></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <NavLink to="/" className="nav-link ui-link active">           
                       <FiHome/> Dashboard
</NavLink>
              
            </li> */}
    
{/*           
            <li className="nav-item">
              <a className="nav-link" href="#sidebarUsers" data-toggle="collapse" role="button" aria-controls="sidebarUsers" aria-expanded="true">
               <FiUsers/> Team </a> 
              <div className="collapse show" id="sidebarUsers">
                <ul className="nav nav-sm flex-column">                              
                
                  <li className="nav-item">
                    <NavLink to="/members" className="nav-link ui-link">
                      Ambassadors
                      </NavLink>
                    </li>
                  <li class="nav-item">
                    <NavLink to="/dashboard-user"  className="nav-link ui-link"> Dashboard</NavLink>
                   </li>
                </ul>

                <List className='navbar-nav'
sx={{ width: '100%', maxWidth: 360}}
component="nav"
aria-labelledby="nested-list-subheader"

>
<ListItemButton className="nav-item">
  <ListItemIcon className="nav-link">
    <FiHome />
  </ListItemIcon>
  <NavLink to="/" className="nav-link ui-link active">      
  <ListItemText primary="Dashboard"  className="nav-item"/>

                 
</NavLink>
</ListItemButton>

<ListItemButton onClick={handleClick} className="nav-item">
  <ListItemIcon className="nav-link">
    <FiUsers />
  </ListItemIcon>
  <ListItemText primary="Team" />
  {!open ? <ExpandLess /> : <ExpandMore/>}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/members" className="nav-link ui-link">
      <ListItemText primary="Ambassadors" />

                </NavLink>
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>
      </ListItemIcon>
      <NavLink to="/dashboard-user"  className="nav-link ui-link"> 
      <ListItemText primary="Dashboard" />

      </NavLink>

    </ListItemButton>
  </List>
</Collapse>
</List>


              </div>
            </li>
           */}




{/*          
            <li className="nav-item">
              <a className="nav-link" href="#sidebarCampaigns" data-toggle="collapse" role="button" aria-controls="sidebarCampaigns">
                <FiSend/> Campaigns</a>
              <div className="collapse" id="sidebarCampaigns">
                <ul className="nav nav-sm flex-column">                              
                
                  <li className="nav-item">
                    <NavLink to="campaign-list-nurture-linkedin-cohort" className="nav-link ui-link">Invite</NavLink></li><li class="nav-item">
                      <NavLink to="campaign-list-nurture-linkedin-segment" class="nav-link ui-link">Nurture</NavLink></li>
                </ul>
              </div>
            </li>
           */}

           #finders-wrapper #finders-grid-wrapper {
            margin-bottom: 20px;
            height: calc(100% - 20px);
            display: flex;
            flex-direction: column;
            width: 100%;
          }


// const FILMS_QUERY = gql`
//   {
//     launchesPast(limit: 1) {
//       id
//       mission_name
//     }
//   }
// `;
