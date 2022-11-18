import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField } from '@mui/material'
import { addDoc, arrayUnion, collection, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useRef } from 'react'
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useProfile } from '../../Context/profile.context'
import Snackbars from './Snackbars'
import { admin, auth, color, db } from '../../firebase'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import Time from 'react-time/lib/Time'

export const CalendarEvent = ({events,loading}) => {
    const [isOpen1,setOpen1]=useState(false);
    const [isOpen,setOpen]=useState(false);
    const [event,setEvent]=useState(null);
    const {success,error,setSuccess,setError}=useProfile();
    const title=useRef();
    const des=useRef();
    const venue=useRef();
    const localizer = momentLocalizer(moment);

    function Open(event){setOpen(true);setEvent(event)}
    function Open1(event){
        if(admin===auth.currentUser.email){
          //past date should be disabled
          if(event.start<new Date(Date.now() - 24*60*60*1000))
            setError("Can not create event for past date")
          else{
            setOpen1(true);
            setEvent(event);
          }
        }
      }
    function Close(){setOpen(false);setEvent(null)}
    function Close1(){setOpen1(false);setEvent(null)}

    async function add(e){
      e.preventDefault();
      try{
        if(event.end<=event.start)
          throw new Error("End time should be greater than start time");
        
          await addDoc(collection(db,"Events"),{
              start:event.start,
              end:event.end,
              title:title.current.value ,
              description:des.current.value,
              venue: venue.current.value
          })
          /* adding notifications in 'all' document */
          const data={
            subject:"New Event",
            msg:`Event: ${title.current.value} at ${venue.current.value}`,
            createdAt:Timestamp.now(),
            receiverHasRead: false
          }
          await updateDoc(doc(db, "Notifications","all"), {
            notifications: arrayUnion(data)
          });
          setSuccess("Event added")
          Close1();
      }catch(error){
          setError(error.message)
      }
  }
    async function deleteEvent(data){
      try{
        await deleteDoc(doc(db,'Events',data.id))
        setSuccess("Event removed");
        setTimeout(()=>{setSuccess("")},6000)
        Close()
      }catch(error){
        setError(error.code);
        console.log(error)
        setTimeout(()=>{setError("")},6000)
      }
    }

  return (
    !loading && <div>
      <Snackbars error={error} success={success}/>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        step={30}
        defaultView="month"
        //views={["month", "week", "day"]}
        defaultDate={new Date()}
        //scrollToTime={new Date(1970, 1, 1, 6)}
        selectable={true}
        onSelectSlot={(e)=>Open1(e)} //on clicking on a slot
        onSelectEvent={e => Open(e)} // shows details of event
        style={{ height: 500 }}
/>
{/* adding a event*/}
<Dialog open={isOpen1} onClose={Close1}>
    <DialogTitle>Create Event</DialogTitle>
    <Divider/>
    <Box component="form" onSubmit={(e)=>add(e)} >
    <DialogContent>
        <Grid container spacing={3} justifyContent="center">
            <Grid item><TextField type="text" label="Title" inputRef={title} size="small" required/></Grid>
            <Grid item><TextField type="text" label="Venue" inputRef={venue} size="small" required/></Grid>
            <Grid item><TextField type="text" label="Description" inputRef={des} multiline rows={2} size="small" required/></Grid>
        </Grid>
    </DialogContent>
    <DialogActions>
            <Grid container justifyContent="center" spacing={3} >
              <Grid item><Button type="submit" size="small"  sx={{backgroundColor:color}} variant="contained">add</Button></Grid>
              <Grid item><Button size="small" disabled={loading} type="reset"  sx={{backgroundColor:color}} variant="contained"  onClick={Close1}>Cancel</Button></Grid>
            </Grid>
    </DialogActions>
    </Box>
  </Dialog>

{/*details of event and delete */}
  <Dialog open={isOpen} onClose={Close}>
    {event && <div>
    <DialogTitle><EventAvailableIcon color="action"/> {event.title}</DialogTitle>
    <Divider color="black"/>
    <DialogContent>
      <b>
            <LocationOnIcon color="action"/> <span style={{color:color}}>{event.venue}</span><br/>
            <AccessTimeIcon color="action"/> <span style={{color:color}}><Time value={event.start} format="DD/MM/YYYY HH:mm"/></span>
            <br/>
            <span style={{color:"grey"}}>-</span>
            <span style={{color:color}}><Time value={event.end} format="DD/MM/YYYY HH:mm"/></span><br/>

            <span style={{color:"grey"}}>Description: </span>
            <span style={{color:color}}>{event.description}</span><br/>
      </b>
    </DialogContent>
    {/*only admin can delete events */}
    {admin===auth.currentUser.email &&
      <DialogActions>
      <Button size="small" onClick={()=>deleteEvent(event)} sx={{backgroundColor:color}}variant="contained">
        Delete <DeleteIcon fontSize="small"/>
        </Button>
    </DialogActions>
    }
      
    </div>}
  </Dialog>
</div>
  )
}
