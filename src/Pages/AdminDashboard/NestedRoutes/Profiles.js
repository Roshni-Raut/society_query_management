import * as React from 'react';
import { useAllProfile } from '../../../Context/admin.context';
import { CircularProgress } from '@mui/material';
import { Container } from '@mui/system';
import { admin } from '../../../firebase';


export default function Profiles() {
  const {profiles,loading}=useAllProfile();
  

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
  );
}
