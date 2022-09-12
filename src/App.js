import React from 'react';
import 'rsuite/dist/rsuite.min.css';
import 'bootstrap/dist/css/bootstrap.css'
import { SignUp } from './Pages/SignUp';
import { SignIn } from './Pages/SignIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/CustomerDashboard/Dashboard';
import { History } from './Pages/CustomerDashboard/NestedRoutes/History';
import { Query } from './Pages/CustomerDashboard/NestedRoutes/Query';
import { Notifications } from './Pages/CustomerDashboard/NestedRoutes/Notifications';
import { ProtectedRoute } from './ProtectedRoute';

function App() {
  return (
    <div>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<SignIn/>}></Route>
      <Route element={<ProtectedRoute/>}>
        <Route path="/SignUp" element={<SignUp/>}></Route>
        <Route path="customer-dashboard" element={<Dashboard />}>
          <Route index element={<History/>}/>
          <Route path="history" element={<History/>} />
          <Route path="query" element={<Query/>} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
