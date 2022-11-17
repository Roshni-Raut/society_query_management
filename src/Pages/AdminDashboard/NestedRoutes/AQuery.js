import { Alert, Avatar, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Radio, RadioGroup,  Typography } from '@mui/material'
import { arrayRemove, arrayUnion, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useAllProfile } from '../../../Context/admin.context';
import {  db } from '../../../firebase';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export const AQuery = () => {
const {queries,loading}=useAllProfile()
const [open,setOpen]=useState(false)
const [open1,setOpen1]=useState(false)
const [profile,setProfile]=useState()
const [query,setQuery]=useState()
const color="#645CAA"

const formatDate = (dateString) => {
  const options = {year: 'numeric', month: 'long',day: 'numeric', hour: 'numeric', minute: '2-digit'}
  var date=new Intl.DateTimeFormat('en-US', options ).format(dateString)
  return date.toString()
}

const style=(priority,s=0)=>{
  if(s===0)
    return priority===3?'warning':priority===2?'primary':'danger';
  else if(s===1)
    return priority===3?'warning':priority===2?'info':'error';

}
const style1=(status)=>{
  return status==='pending'?'warning':status==='underwatch'?'info':status==='done'?'success':'error';
}
const fetchUser=async(query)=>{
  console.log(query.uid)
  const docRef = await getDoc(doc(db, "Profiles", query.uid));
  setProfile({...docRef.data(),...query})
  setOpen(true)
}
const onClose=()=>{
  setOpen(false)
  setProfile(null)
}
const onOpen1=(x)=>{
  setQuery(x);
  setOpen1(true);
}
const onClose1=()=>{
  setQuery(null)
  setOpen1(false)
}
const update=async(e)=>{
  let {uid,...q}=query;
  await updateDoc(doc(db, "Query", uid), {
    queries: arrayRemove(q)
  });
  const data={
    subject:q.subject,
    msg:`Status changed from ${q.status} to ${e.target.value}`,
    createdAt:Timestamp.now(),
    receiverHasRead: false
  }
  await updateDoc(doc(db, "Notifications", uid), {
    notifications: arrayUnion(data)
  });
  q.status=e.target.value
  await updateDoc(doc(db, "Query", uid), {
    queries: arrayUnion(q)
  });
}
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress /></Container>:
  <div>
    <Typography textAlign={"right"}>
    Priority: 
    <span style={{color:"red"}}><ErrorOutlineOutlinedIcon/>Urgent </span>
    <span style={{color:"orange"}}><WarningAmberOutlinedIcon />Normal </span>
    <span style={{color:"blue"}}><InfoOutlinedIcon />Take your Time </span>
    </Typography>
    <table className="table table-hover w-50 m-auto text-center">
    <thead>
      <tr>
        <th scope="col">Subject</th>
        <th scope="col">Priority</th>
        <th scope="col">Status</th>
        <th scope="col">Time</th>
      </tr>
    </thead>
    <tbody>
      {queries.map((x,i)=>(
        <tr key={i} className={'table-'+style(x.priority)}>
        <td><Alert severity={style(x.priority,1)} sx={{borderWidth:0,p:1}} variant="outlined" >{x.subject}</Alert></td>
        <td>{x.priority}</td>
        <td>
          <Chip label={x.status} color={style1(x.status)} onClick={()=>onOpen1(x)}/>
          </td>
        <td><small>{String(formatDate(x.createdAt.toDate()))} </small></td>
        <td><Button size="small" onClick={()=>fetchUser(x)}>Details</Button></td>
      </tr>
      ))
      }
    </tbody>
  </table>

      {/*sender details */}
  <Dialog open={open} onClose={onClose} fullWidth>

      {profile && 
      <DialogTitle>Sender Details: {`${profile.fname} ${profile.mname} ${profile.lname}`}</DialogTitle>
      }
      <Divider color="black" sx={{borderWidth:1}}/>

        {profile?<DialogContent>
          {console.log(profile.avatarUrl)}
            <div style={{display:"flex",fontWeight:"bold", marginBottom:"10px"}}>
            <div style={{marginRight:"10px"}}>
              <Avatar src={profile.avatarUrl} sx={{height:150,width:150}}/>
            </div>
                   
          <div>
          <span style={{color:"grey"}}>Email: </span>
            <span style={{color:color}}>{profile.email}</span>
            <br/>
            <span style={{color:"grey"}}>Phone: </span>
            <span style={{color:color}}>{profile.phone}</span>
            &nbsp; &nbsp; 

            <span style={{color:"grey"}}>Flat no: </span>
            <span style={{color:color}}>{profile.flatno}</span>
            <br/>
            <span style={{color:"grey"}}>Profession: </span>
            <span style={{color:color}}>{profile.profession}</span><br/>

            <span style={{color:"grey"}}>Owner: </span>
            <span style={{color:color}}> {profile.owner==null?"same person":profile.owner.name}</span><br/>
          
            <span style={{color:"grey"}}>Query: </span>
            <span style={{color:color}}>{profile.query}</span><br/>

          </div>
          </div>
        </DialogContent>
        :<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
          <CircularProgress /></Container>
        }
        
        <DialogActions sx={{m:2}}>
          <Button size="small" type="button"  sx={{backgroundColor:color}} variant="contained"  onClick={onClose}>Close</Button>
        </DialogActions>
  
    </Dialog>

        {/* for changing status of query */}
    <Dialog open={open1} onClose={onClose1} >
      <DialogTitle>
        Change status
      </DialogTitle>
        <DialogContent>
          <RadioGroup row onChange={(e)=>update(e)}sx={{display:"flex", justifyContent:"center", alignItems:"center" }}
      >
        <Radio value="pending"   color="warning"/>Pending
        <Radio value="underwatch" color="info"/>Under Watch
        <Radio value="done"   color="success"/> Done
        <Radio value="rejected"   color="error"/> Rejected
    
      </RadioGroup>          
        </DialogContent>
  
    </Dialog>
  </div>
  )
}
