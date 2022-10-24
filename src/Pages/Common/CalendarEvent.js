import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField } from '@mui/material'
import { addDoc, collection } from 'firebase/firestore'
import { useRef } from 'react'
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useProfile } from '../../Context/profile.context'
import Snackbars from './Snackbars'
import { color, db } from '../../firebase'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';

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
    function Open1(event){setOpen1(true);setEvent(event)}
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
          setSuccess("Event added")
          Close1();
      }catch(error){
          setError(error.message)
      }
  }
  const formatDate = (dateString) => {
    const options = {year: 'numeric', month: 'long',day: 'numeric', hour: 'numeric', minute: '2-digit'}
    var date=new Intl.DateTimeFormat('en-US', options ).format(dateString)
    return date.toString()
  }
  return (
    !loading && <div>
      <Snackbars error={error} success={success}/>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        //views={["month", "week", "day"]}
        step={30}
        defaultView="month"
        //views={["month", "week", "day"]}
        defaultDate={new Date()}
        scrollToTime={new Date(1970, 1, 1, 6)}
        selectable={true}
        onSelectSlot={(e)=>Open1(e)}
        onSelectEvent={e => Open(e)}
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

{/*details of event */}
  <Dialog open={isOpen} onClose={Close}>
    {event && <div>
    <DialogTitle><EventAvailableIcon color="action"/> {event.title}</DialogTitle>
    <Divider color="black"/>
    <DialogContent>
      <b>

            <LocationOnIcon color="action"/> <span style={{color:color}}>{event.venue}</span><br/>

            <AccessTimeIcon color="action"/> <span style={{color:color}}>{formatDate(event.start)}</span>
            <br/>
            <span style={{color:"grey"}}>-</span>
            <span style={{color:color}}>{formatDate(event.end)}</span><br/>

            <span style={{color:"grey"}}>Description: </span>
            <span style={{color:color}}>{event.description}</span><br/>
        
      </b>
    </DialogContent></div>}
  </Dialog>
</div>
  )
}
