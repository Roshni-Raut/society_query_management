
import React from 'react'
import { useAllProfile } from '../../../Context/admin.context';
import { Card, Chip, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, Paper,  Radio,  RadioGroup,  Typography } from '@mui/material'
import Time from 'react-time/lib/Time';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { color } from '../../../firebase';
import { useProfile } from '../../../Context/profile.context';

export const ANotifications = () => {
  const {loading,AllRequest}=useAllProfile();
  const {isOpen,Open,Close}=useProfile().OpenVar;

  const onOpen=(event)=>{
    Open()
  }
  const style=(status)=>{
    return status==='pending'?'warning':status==='accepted'?'success':'error';
  }
  const update=(e)=>{
    console.log(e)
  }
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
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
            <Radio value="rejected"   color="error"/> Rejected
          </RadioGroup>          
        </DialogContent>
    </Dialog>
        
    </Grid>
    </div>
  )
}
