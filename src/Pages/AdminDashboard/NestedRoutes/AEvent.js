import React from 'react'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField } from '@mui/material';
import { useProfile } from '../../../Context/profile.context';
import { useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
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
    const [value, setValue] = React.useState();

  const handleChange = (newValue) => {
    setValue(newValue);
  };
    async function add(e){
        e.preventDefault();
        
        try{
            if(endTD<=startTD)
                throw new Error("End time should be greater than start time");

            await addDoc(collection(db,"Events"),{
                start:moment(startTD.current.value).toDate(),
                end:moment(endTD.current.value).toDate(),
                title:title.current.value ,
                description:des.current.value,
                venue: venue.current.value
            })
            setSuccess("Event added")
            Close();
        }catch(error){
            setError(error.message)
        }
    }
    return(
    <div>
        <Snackbars error={error} success={success}/>

        <Button size="small"  onClick={Open}sx={{backgroundColor:color,m:2}} variant="contained">Create New Event</Button>
        <Button size="small"  sx={{backgroundColor:color,m:2}} variant="contained">Show</Button>
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
                        value={value}
                        onChange={handleChange}
                        />
                </LocalizationProvider>
            </Grid>
            <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="End Date&Time "
                        inputRef={endTD}
                        renderInput={(params) => <TextField {...params} />}
                        value={value}
                        onChange={handleChange}
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