import { CircularProgress, Container } from '@mui/material'
import React from 'react'
import { useQuery } from '../../../Context/currentprofile.context'
import { admin } from '../../../firebase';

export const AQuery = () => {
 // const {profiles,loading}=useQuery()
const loading=true;
const profiles=[]
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress /> </Container>:
    <table className="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Flat no</th>
        <th scope="col">Email</th>
      </tr>
    </thead>
    <tbody>
      {profiles.filter(x=>x.email!==admin).map((x,i)=>(
        <tr key={i+1}>
        <th scope="row">{i}</th>
        <td>{x.fname+x.mname+x.lname}</td>
        <td>{x.flatno}</td>
        <td>{x.email}</td>
      </tr>
      ))
      }
    </tbody>
  </table>
  )
}