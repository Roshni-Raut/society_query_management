
import React, { useState } from 'react'
import { useAllProfile } from '../../../Context/admin.context';
import { Card, Chip, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, Radio,  RadioGroup,  Typography } from '@mui/material'
import Time from 'react-time/lib/Time';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { color, db } from '../../../firebase';
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';

export const ANotifications = () => {
  const {AllRequest,eventRequestCount}=useAllProfile();
  const [isOpen,setOpen]=useState(false);
  const [event,setEvent]=useState();

  const onOpen=(event)=>{
    setEvent(event)
    setOpen(true)
  }
  const Close=()=>{
    setEvent(null)
    setOpen(false);
  }
  const style=(status)=>{
    return status==='pending'?'warning':status==='accepted'?'success':'error';
  }
  const update=async(e)=>{
    if(e.target.value==='accept'){
      await addDoc(collection(db,"Events"),{
        start:event.start,
        end:event.end,
        title:event.title,
        description:event.description,
        venue: event.venue
    })
    // to the individual 
    const data={
        subject:`Your Event request has been accepted for ${event.title}`,
        msg:`Event: ${event.title} at ${event.venue}`,
        createdAt:Timestamp.now(),
        receiverHasRead: false
      }
      await updateDoc(doc(db, "Notifications",event.id), {
        notifications: arrayUnion(data)
      });
      
    //send notice to the all the members  
      const data1={
        subject:`New Event added by  ${event.name}`,
        msg:`Event: ${event.title} at ${event.venue}`,
        createdAt:Timestamp.now(),
        receiverHasRead: false
      }
      await updateDoc(doc(db, "Notifications","all"), {
        notifications: arrayUnion(data1)
      });
      // removing Event Request
      await updateDoc(doc(db,"EventRequest",event.id),{
        requests: arrayRemove({
          name: event.name,
          start:event.start.toDate(),
          end:event.end.toDate(),
          title:event.title ,
          description:event.description,
          venue: event.venue,
          status: event.status,
          receiverHasRead:event.receiverHasRead,
          createdAt: event.createdAt.toDate()
        })
    })
    }
    else if(e.target.value==='reject'){
      //rejecting offer
      const data={
        subject:`Sorry!! Your Event request has been rejected for ${event.title}`,
        msg:`Event: ${event.title} at ${event.venue}`,
        createdAt:Timestamp.now(),
        receiverHasRead: false
      }
      await updateDoc(doc(db, "Notifications",event.id), {
        notifications: arrayUnion(data)
      });
      await updateDoc(doc(db,"EventRequest",event.id),{
        requests: arrayRemove({
          name: event.name,
          start:event.start.toDate(),
          end:event.end.toDate(),
          title:event.title ,
          description:event.description,
          venue: event.venue,
          status: event.status,
          receiverHasRead:event.receiverHasRead,
          createdAt: event.createdAt.toDate()
        })
      })
    }
  }
  const seen=async()=>{
    const eventReq = await getDocs(collection(db, "EventRequest"));
      try{
        eventReq.forEach(async(document) => {
          if(document.data().requests.length>0){
            console.log(document.id,document.data().requests)
            const req =document.data().requests;
            for(var i=0;i<req.length;i++){
              await updateDoc(doc(db,"EventRequest",document.id),{
                "requests":arrayRemove(req[i])
              });
              if(!req[i].receiverHasRead){
              req[i].receiverHasRead=true;
              }
              await updateDoc(doc(db,"EventRequest",document.id),{
                "requests":arrayUnion(req[i])
              });
      }
      }
          
      });
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(eventRequestCount>0)
      seen();
  },[])

  return (!AllRequest?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress />
</Container>:
<div>
        {/* Recent event requests*/}
      <Grid item xs={12}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Event Requested
    </Typography>
          {AllRequest.length>0 && AllRequest.map((row,id) => (
            <Card variant="outlined" sx={{p:2,m:2}} key={id}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    {row.title}
                </Typography>
                <span style={{color:"grey"}}> Requested by: </span>
                <span style={{color:color}}>{row.name}</span><br/>
            <LocationOnIcon color="action"/> <span style={{color:color}}>{row.venue}</span><br/>
            <AccessTimeIcon color="action"/> <span style={{color:color}}><Time value={row.start.toDate()} format="DD/MM/YYYY HH:mm"/></span>
            
            <span style={{color:"grey"}}> - </span>
            <span style={{color:color}}><Time value={row.end.toDate()} format="DD/MM/YYYY HH:mm"/></span><br/>

            <span style={{color:"grey"}}>Description: </span>
            <span style={{color:color}}>{row.description}</span><br/>
            <span ><Chip label={row.status}  size="small" color={style(row.status)} onClick={()=>onOpen(row)}/></span><br/>
            </Card>
          ))}
  
          <Dialog open={isOpen} onClose={Close} >
      <DialogTitle>
        Confirm the Event
      </DialogTitle>
        <DialogContent>
          <RadioGroup row onChange={(e)=>update(e)}sx={{display:"flex", justifyContent:"center", alignItems:"center" }}>
            <Radio value="accept"   color="success"/> Accept
            <Radio value="reject"   color="error"/> Reject
          </RadioGroup>          
        </DialogContent>
    </Dialog>
        
    </Grid>
    </div>
  )
}
