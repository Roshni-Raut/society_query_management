import { LinearProgress } from '@mui/material';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../Context/profile.context';

export const AdminRoute = () => {
  const {profile,loading}=useProfile();
  
  if(loading && !profile){
    return <LinearProgress color="secondary"/>
  }
  
  return (
    (profile && !loading && profile.email==='rohitsraut95@gmail.com')?<Outlet/>:<Navigate to="/"/>)
}