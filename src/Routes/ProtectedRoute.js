import {  LinearProgress } from '@mui/material';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../Context/profile.context';

export const ProtectedRoute = () => {
  const {profile,loading}=useProfile();
  if(profile){
    console.log(profile.email,loading)
  }else{
    console.log(profile,loading)
  }

  if(loading && !profile){
    return <LinearProgress color="secondary"/>
  }
  //todo: access denied message should be shown
  return (
    (profile && !loading && profile.email!=='rohitsraut95@gmail.com')?<Outlet/>:<Navigate to="/"/>)
}