import * as React from 'react';
import { useAllProfile } from '../../../Context/admin.context';
import { Chip, CircularProgress, Grid } from '@mui/material';
import { Container } from '@mui/system';
import { admin } from '../../../firebase';
import { useState } from 'react';


export default function Profiles() {
  const {profiles,loading}=useAllProfile();
  const [filteredProfiles,setFilter]=useState()

  const addFilter=(e)=>{
    const name=e.target.name;
    setFilter(profiles)
    console.log(name)
    if(name==="name"){
      setFilter(filteredProfiles.sort((x,y)=> x.name-y.name))
    }
    else
    setFilter(filteredProfiles.sort((x,y)=> x.flatno-y.flatno))
  }

  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress /> </Container>:
  <div>
    <Grid container spacing={3} justifyContent="right" sx={{mb:2,mt:0}}>
      <Chip label="Name" name="name" onClick={addFilter} />
      <Chip label="Flat number" name="flatno" variant="outlined" onClick={addFilter} />
    </Grid>

    <table className="table table-hover text-center">
    <thead className='table-secondary'>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Flat no</th>
        <th scope="col">Email</th>
        <th scope="col">Gender</th>
        <th scope="col">Nationality</th>
        <th scope="col">Family member</th>
        <th scope="col">Residence since</th>
      </tr>
    </thead>
    <tbody>
      
      {profiles.map((x,i)=>(
        <tr key={i}>
        <th scope="row">{i+1}</th>
        <td>{x.fname+" "+x.mname+" "+x.lname}</td>
        <td>{x.flatno}</td>
        <td>{x.email}</td>
        <td>{x.gender}</td>
        <td>{x.nationality}</td>
        <td>{x.fmember}</td>
        <td>{parseInt(new Date().getFullYear())-parseInt(x.time.split("-")[2])}</td>
      </tr>
      ))

      }
      
      
    </tbody>
  </table>
  </div>
  );
}
