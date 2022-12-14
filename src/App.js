import React from 'react';
import 'rsuite/dist/styles/rsuite.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import { SignIn } from './Pages/SignIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/CustomerDashboard/Dashboard';
import { History } from './Pages/CustomerDashboard/NestedRoutes/History';
import { AHistory } from './Pages/AdminDashboard/NestedRoutes/AHistory';
import { Query } from './Pages/CustomerDashboard/NestedRoutes/Query';
import { AQuery } from './Pages/AdminDashboard/NestedRoutes/AQuery';
import { Notifications } from './Pages/CustomerDashboard/NestedRoutes/Notifications';
import { ANotifications } from './Pages/AdminDashboard/NestedRoutes/ANotifications';
import { ProfileProvider } from './Context/profile.context';
import { ProtectedRoute } from './Routes/ProtectedRoute';
import ADashboard from './Pages/AdminDashboard/ADashboard';
import { AdminRoute } from './Routes/AdminRoute';
import { UserProfile } from './Pages/CustomerDashboard/NestedRoutes/UserProfile';
import { CreateProfile } from './Pages/AdminDashboard/NestedRoutes/CreateProfile';
import { AdminProfile } from './Pages/AdminDashboard/NestedRoutes/AdminProfile';
import { PublicRoute } from './Routes/PublicRoute';
import Maintenance from './Pages/CustomerDashboard/NestedRoutes/Maintenance';
import MaintenanceA from './Pages/AdminDashboard/NestedRoutes/MaintenanceA';
import AEvent from './Pages/AdminDashboard/NestedRoutes/AEvent';
import Event from './Pages/CustomerDashboard/NestedRoutes/Event';

function App() {
  return (
    <ProfileProvider>
     <BrowserRouter>
     <Routes>
      <Route element={<PublicRoute/>}>
        <Route path="/" element={<SignIn/>}></Route>
      </Route>
      <Route element={<ProtectedRoute/>}>
        <Route path="customer-dashboard" element={<Dashboard />}>
          <Route index element={<History/>}/>
          <Route path="history" element={<History/>} />
          <Route path="query" element={<Query/>} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<UserProfile/>} />
          <Route path="maintenance" element={<Maintenance/>} />
          <Route path="event" element={<Event/>} />
        </Route>
      </Route>
      <Route element={<AdminRoute/>}>
        <Route path="admin-dashboard" element={<ADashboard />}>
          <Route index element={<AHistory/>}/>
          <Route path="history" element={<AHistory/>} />
          <Route path="query" element={<AQuery/>} />
          <Route path="notifications" element={<ANotifications />} />
          <Route path="createUser" element={<CreateProfile />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="maintenance" element={<MaintenanceA/>} />
          <Route path="event" element={<AEvent/>} />
        </Route>
      </Route>
     </Routes>
     </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
