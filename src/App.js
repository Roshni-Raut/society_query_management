import React from 'react';
import 'rsuite/dist/styles/rsuite.min.css';
//import 'rsuite/dist/rsuite.min.css';
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
import Profiles from './Pages/AdminDashboard/NestedRoutes/Profiles';
import { AdminProfile } from './Pages/AdminDashboard/NestedRoutes/AdminProfile';

function App() {
  return (
    <ProfileProvider>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<SignIn/>}></Route>
      <Route element={<ProtectedRoute/>}>
        <Route path="customer-dashboard" element={<Dashboard />}>
          <Route index element={<History/>}/>
          <Route path="history" element={<History/>} />
          <Route path="query" element={<Query/>} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<UserProfile/>} />
        </Route>
      </Route>
      <Route element={<AdminRoute/>}>
        <Route path="admin-dashboard" element={<ADashboard />}>
          <Route index element={<AHistory/>}/>
          <Route path="history" element={<Profiles/>} />
          <Route path="query" element={<AQuery/>} />
          <Route path="notifications" element={<ANotifications />} />
          <Route path="createUser" element={<CreateProfile />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>
     </Routes>
     </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
