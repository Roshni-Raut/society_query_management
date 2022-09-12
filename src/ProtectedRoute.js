import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
    const Profile=true;
    
  return (
    Profile?<Outlet/>:<Navigate to="/"/>)
}