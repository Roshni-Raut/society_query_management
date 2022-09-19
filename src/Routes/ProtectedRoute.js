import {   CircularProgress, Container } from '@mui/material';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../Context/profile.context';
import { admin } from '../firebase';

export const ProtectedRoute = () => {
  const {profile,loading}=useProfile();

  if(loading && !profile){
    return <Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
    <CircularProgress />
  </Container>
  } 
  //todo: access denied message should be shown
  return (
    (profile && !loading && profile.email!==admin)?<Outlet/>:<Navigate to="/"/>)
}