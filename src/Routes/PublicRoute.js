import {   CircularProgress, Container } from '@mui/material';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../Context/profile.context';
import { admin } from '../firebase';

export const PublicRoute = () => {
  const {profile,loading}=useProfile();

  if(loading && !profile){
    return <Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
    <CircularProgress />
  </Container>
  } 
  if(!profile && !loading)
    return <Outlet></Outlet>
  return (
    (profile && profile.email!==admin &&!loading)?<Navigate to="/customer-dashboard"/>:<Navigate to="/admin-dashboard"/>
    )
}