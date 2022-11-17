import React from 'react'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField } from '@mui/material';
import { useProfile } from '../../../Context/profile.context';
import { useRef } from 'react';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { color, db } from '../../../firebase';
import { CalendarEvent } from '../../Common/CalendarEvent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Snackbars from '../../Common/Snackbars';

const AEvent = () => {
    
    const {loading,events}=useProfile();
    const {isOpen,Open,Close}=useProfile().OpenVar;
    const {success,error,setSuccess,setError}=useProfile();
    const startTD=useRef();
    const endTD=useRef();
    const title=useRef();
    const des=useRef();
    const venue=useRef();
    const [endValue, setEndValue] = React.useState();
    const [startValue, setStartValue] = React.useState();

  const ChangeEnd = (newValue) => {
    setEndValue(newValue);
  };
  const ChangeStart = (newValue) => {
    setStartValue(newValue);
  };
    async function add(e){
        e.preventDefault();
        console.log(endTD.current.value, startTD.current.value)
        try{
            if(endTD.current.value<=startTD.current.value)
                throw new Error("End time should be greater than start time");

            await addDoc(collection(db,"Events"),{
                start:moment(startTD.current.value).toDate(),
                end:moment(endTD.current.value).toDate(),
                title:title.current.value ,
                description:des.current.value,
                venue: venue.current.value
            })
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
            Close();
        }catch(error){
            setError(error.message)
        }
    }
    return(
    <div>
        <Snackbars error={error} success={success}/>

        <Button size="small"  onClick={Open}sx={{backgroundColor:color,mb:1,mr:2}} variant="contained">Create New Event</Button>
        
        <CalendarEvent events={events} loading={loading}/>

  <Dialog open={isOpen} onClose={Close}>
    <DialogTitle>Create Event</DialogTitle>
    <Divider color="black"/>
    <Box component="form" onSubmit={(e)=>add(e)} >
    <DialogContent>
        <Grid container spacing={3} justifyContent="center">
            <Grid item><TextField type="text" label="Title" inputRef={title} size="small" required/></Grid>
            <Grid item><TextField type="text" label="Venue" inputRef={venue} size="small" required/></Grid>
            <Grid item><TextField type="text" label="Description" inputRef={des} multiline rows={2} size="small" required/></Grid>
            <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Start Date&Time "
                        inputRef={startTD}
                        renderInput={(params) => <TextField {...params} />}
                        value={startValue}
                        onChange={ChangeStart}
                        />
                </LocalizationProvider>
            </Grid>
            <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="End Date&Time "
                        inputRef={endTD}
                        renderInput={(params) => <TextField {...params} />}
                        value={endValue}
                        onChange={ChangeEnd}
                    />
                </LocalizationProvider>
          </Grid>
        </Grid>
    </DialogContent>
    <DialogActions>
            <Grid container justifyContent="center" spacing={3} >
              <Grid item><Button type="submit" size="small"  sx={{backgroundColor:color}} variant="contained">add</Button></Grid>
              <Grid item><Button size="small" disabled={loading} type="reset"  sx={{backgroundColor:color}} variant="contained"  onClick={Close}>Cancel</Button></Grid>
            </Grid>
    </DialogActions>
    </Box>
  </Dialog>
    </div>
    )
}

export default AEvent