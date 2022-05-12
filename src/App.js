import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Ambassadors from './components/ambassadors/Ambassadors';
import DashboardUser from './components/userDashboard/DashboardUser';
import Persons from './components/persons/Persons';
import { Route, Routes } from 'react-router-dom';
import Finders from './components/finders/Finders';
import Contact from './components/contacts/Contact';
import Segments from './components/segments/Segments';
import Funnel from './components/funnel/Funnel';
import Invites from './components/invite/Invites';
import Nurture from './components/nurture/Nurture';
import Media from './components/Media/Media';
import SettingsApp from './components/settings/SettingsApp';
import Calendarr from './components/Calendar';
import { useQuery, gql } from "@apollo/client";
import { useAuth0 } from '@auth0/auth0-react';
import {AuthProvider} from './Context/auth';
import AuthRoute from './util/AuthRoute';
import { useState } from 'react';

// const USER_QUERY = gql`
// query {
//   workspaceContext {
//     workspace {
//       settings {
//           api {
//             clientId
//             clientSecret
//           }
//       }
//     }
//   }
// }
// `;
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

function App() {


  const { data, loading, error } = useQuery(WORKSPACE_QUERY);
  console.log(data)

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>
    return (
    <div>
     {/* add the x-workspace-key to path  */}

     <Sidebar/>
     <Routes>
       <Route exact path="" element={<Dashboard/>}></Route>
      <Route exact path="/members" element={<Ambassadors/>}></Route>
      <Route exact path="/dashboard-user" element={<DashboardUser/>}></Route>
      <Route exact path="/personas-list" element={<Persons/>}></Route>
      <Route exact path="/finder-list" element={<Finders/>}></Route>

      <Route exact path="/contacts" element={<Contact/>}></Route>
      <Route exact path="/segments" element={<Segments/>}></Route>
      <Route exact path="/funnel" element={<Funnel/>}></Route>
      <Route exact path="/campaign-list-nurture-linkedin-cohort" element={<Invites/>}></Route>
      <Route exact path="/campaign-list-nurture-linkedin-segment" element={<Nurture/>}></Route>
      <Route exact path="/media-list" element={<Media/>}></Route>
      <Route exact path="/tenant-planification" element={<Calendarr/>}></Route>
      <Route exact path="/apps" element={<SettingsApp/>}></Route>
 </Routes> 
    </div>
  );
}

export default App;
