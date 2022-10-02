import { async } from '@firebase/util';
import { Alert, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material'
import { doc, getDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useAllProfile } from '../../../Context/admin.context';
import { admin, db } from '../../../firebase';

export const AQuery = () => {
const {queries,loading}=useAllProfile()
const [open,setOpen]=useState(false)
const [profile,setProfile]=useState()
const [load,setLoad]=useState(false)
const color="#645CAA"

const formatDate = (dateString) => {
  const options = {year: 'numeric', month: 'long',day: 'numeric', hour: 'numeric', minute: '2-digit'}
  var date=new Intl.DateTimeFormat('en-US', options ).format(dateString)
  return date.toString()
}

const style=(priority)=>{
  return priority===3?'warning':priority===2?'info':'error';
}

const fetchUser=async(uid,query)=>{
  console.log(uid)
  const docRef = await getDoc(doc(db, "Profiles", uid));
  setProfile({...docRef.data(),...query})
  setOpen(true)
}
const onClose=()=>{
  setOpen(false)
  setProfile(null)
}
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress /></Container>:
  <div>
    <table className="table table-hover w-50 m-auto">
    <thead>
      <tr>
        <th scope="col">Subject</th>
        <th scope="col">Priority</th>
      </tr>
    </thead>
    <tbody>
      {queries.map((x,i)=>(
        <tr key={i} className={'table-'+style(x.priority)}>
        <td><Alert severity={style(x.priority)} sx={{borderWidth:0,p:1,borderWidth:0}} variant="outlined" >{x.subject}</Alert></td>
        <td>{x.priority}</td>
        <td>{x.status}</td>
        <td><small>{String(formatDate(x.createdAt.toDate()))} </small></td>
        <td><Button size="small" onClick={()=>fetchUser(x.uid,x)}>Details</Button></td>
        <td><Button size="small">change Status</Button></td>
      </tr>
      ))
      }
    </tbody>
  </table>
  <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sender Details</DialogTitle>
        <Divider color="black" variant="middle"></Divider>

        {profile?<DialogContent>
          
            <p>Name: {profile.fname+" "+profile.lname}</p> 
            <p>Flat no: {profile.flatno}</p> 
            <p>Email id: {profile.email}</p> 
            <p>Phone no: {profile.phone}</p> 
            <p>Query: {profile.query}</p>
        </DialogContent>
        :<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
          <CircularProgress /></Container>
        }
        
        <DialogActions sx={{m:2}}>
          <Button size="small" type="button"  sx={{backgroundColor:color}} variant="contained"  onClick={onClose}>Close</Button>
        </DialogActions>
  
    </Dialog>
  </div>
  )
}
