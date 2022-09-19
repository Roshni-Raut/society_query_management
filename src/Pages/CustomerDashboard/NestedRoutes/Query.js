
import { Alert,Box, Button, Chip, CircularProgress, Container, Divider, Grid, MenuItem, TextField} from '@mui/material';
import { collection, doc,   } from 'firebase/firestore';
import React,{useState} from 'react'
import {  db } from '../../../firebase';

export const Query = () => {
  const [success,setSuccess]=useState()
  const [error,setError]=useState()
  const [query]=useState({id:"",subject:"",priority:"",query:""})
  const [loading]= useState(false)
  const color="#645CAA"

  const send=async()=>{
    //const queryRef = doc(collection(db, "Query"));
    console.log(new Date().toString())
    //await setDoc(queryRef, [...query,timeStamp:new Date().toString]);

    setSuccess("send ");
    setTimeout(()=>{setSuccess("")},3000)
  }
  const cancel=()=>{
    setError("send ");
    setTimeout(()=>{setError("")},3000)
  }
  const handleInput=(e)=>{

  }
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container>:
    <div>
    <Container direction="column" style={{ maxWidth:'50vw'}}>
    <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:1}}>
      {success && <Alert variant="filled" severity="success" sx={{position:'absolute', minWidth:'220px'}}>{success}</Alert>}
      {error && <Alert variant="filled" severity="error" sx={{position:'absolute', minWidth:'220px'}}>{error}</Alert>}
     </Grid>
     
      <Grid item xs={12} >
        <Box component="form" onSubmit={send} sx={{mt:1}} >
        
            <Divider ><Chip label="Send your Query" color="primary"/></Divider>
            <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
                <TextField  value={query.subject} label="Subject" fullWidth name="fname" size="small" type="text" onChange={handleInput} required/>
              </Grid>
              <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
              <TextField label="Priority" size="small" defaultValue="" sx={{minWidth:'225px'}} name="priority" onChange={handleInput} value={query.priority||''} select required>
                <MenuItem value="1">Urgent</MenuItem>
                <MenuItem value="2">Normal</MenuItem>
                <MenuItem value="3">Take your time</MenuItem>
              </TextField>
              </Grid>
              <Grid item sx={{mx:5,m:2}}>
                <TextField  value={query.query} label="Query" minRows={5} fullWidth name="mname" size="small" type="text" onChange={handleInput} required multiline/>
            </Grid>


            <Grid container justifyContent="center" spacing={3} sx={{mt:1,mb:3}} >
              <Grid item >
                <Button size="small" disabled={loading} type="submit"  sx={{backgroundColor:color}} variant="contained" onClick={send}>Send</Button>
              </Grid>
              <Grid item >
                <Button size="small" disabled={loading} type="reset"  sx={{backgroundColor:color}} variant="contained"  onClick={cancel}>Cancel</Button>
              </Grid>
            </Grid>

          </Box>
        </Grid>
    </Container>
  </div>
  )
}
