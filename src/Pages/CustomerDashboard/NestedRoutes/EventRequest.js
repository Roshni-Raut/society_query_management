import { Card, Chip, CircularProgress, Container, Grid, Paper,  Typography } from '@mui/material'
import React from 'react'
import Time from 'react-time/lib/Time';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { color } from '../../../firebase';
import { useCurrentProfile } from '../../../Context/currentprofile.context';

export const EventRequest = () => {
    const {loading,eRequest}=useCurrentProfile();
    const style=(status)=>{
        return status==='pending'?'warning':status==='accepted'?'success':'error';
      }
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress />
</Container>:
      <Paper sx={{p:2, mt:1}}>
        {/* Recent event requests*/}
      <Grid item xs={12}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Event Requested
    </Typography>
          {eRequest.length>0 && eRequest.map((row,id) => (
            <Card variant="outlined" sx={{p:2,m:2}} key={id}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    {row.title}
                </Typography>
            <LocationOnIcon color="action"/> <span style={{color:color}}>{row.venue}</span><br/>
            <AccessTimeIcon color="action"/> <span style={{color:color}}><Time value={row.start.toDate()} format="DD/MM/YYYY HH:mm"/></span>
            
            <span style={{color:"grey"}}> - </span>
            <span style={{color:color}}><Time value={row.end.toDate()} format="DD/MM/YYYY HH:mm"/></span><br/>

            <span style={{color:"grey"}}>Description: </span>
            <span style={{color:color}}>{row.description}</span><br/>
            <span ><Chip label={row.status}  size="small" color={style(row.status)} /></span><br/>
            </Card>
          ))}
        
    </Grid>
    </Paper>
  )
}
