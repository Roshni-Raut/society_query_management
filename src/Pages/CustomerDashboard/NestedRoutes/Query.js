import { Alert,Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent,  DialogTitle, Divider, Grid, MenuItem, TextField, Typography} from '@mui/material';
import {  arrayRemove, arrayUnion,  doc, Timestamp,  updateDoc,   } from 'firebase/firestore';
import React,{useState} from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useProfile } from '../../../Context/currentprofile.context';
import {  auth, db } from '../../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';

export const Query = () => {
  const [success,setSuccess]=useState()
  const [error,setError]=useState()
  const [open,setOpen]=useState(false)
  const query=useRef({subject:"",priority:"",query:""})
  const color="#645CAA"
  const {loading,queries}=useProfile()

  const style=(status)=>{
    return status==='pending'?'warning':status==='underwatch'?'info':status==='done'?'success':'error';
  }
  const formatDate = (dateString) => {
    const options = {year: 'numeric', month: 'long',day: 'numeric', hour: 'numeric', minute: '2-digit'}
    var date=new Intl.DateTimeFormat('en-US', options ).format(dateString)
    return date.toString()
  }
  const send=async(e)=>{
    e.preventDefault()
    
    const data={...query.current.value,
      status:"pending",
      createdAt: Timestamp.now()
    }
    console.log(data)
    setOpen(false)
    try{
      await updateDoc(doc(db, "Query", auth.currentUser.uid), {
        queries: arrayUnion(data)
      });

      setSuccess("Query send successfully");
      setTimeout(()=>{setSuccess("")},6000)
    }catch(error){
      setError(error.code);
      console.log(error)
      setTimeout(()=>{setError("")},6000)
    }
  }

  const cancel=()=>{
    setError("removed ");
    setTimeout(()=>{setError("")},3000)
  }
  const handleInput=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    query.current.value=({...query.current.value,[name]:value})
  }
  const deleteQuery=async(data)=>{
    console.log(data)
    try{
      await updateDoc(doc(db, "Query", auth.currentUser.uid), {
        queries: arrayRemove(data)
      });

      setSuccess("Query removed");
      setTimeout(()=>{setSuccess("")},6000)
    }catch(error){
      setError(error.code);
      console.log(error)
      setTimeout(()=>{setError("")},6000)
    }
  }
  return (
    <div>
    <Grid container spacing={3} justifyContent="center" sx={{mt:1}}>
      {success && <Alert variant="filled" severity="success" sx={{position:'absolute', minWidth:'220px'}}>{success}</Alert>}
      {error && <Alert variant="filled" severity="error" sx={{position:'absolute', minWidth:'220px'}}>{error}</Alert>}
     </Grid>
    <Grid container justifyContent="flex-end" sx={{mb:2,mt:2,mr:4}}>
    <Button size="small" onClick={()=>setOpen(true)} type="button" sx={{backgroundColor:color}} variant="contained" >Send Query</Button>
    </Grid>
    
    <Dialog open={open} onClose={()=>setOpen(false)} fullWidth>
      <DialogTitle>Send your Query</DialogTitle>
        <Divider color="black" variant="middle"></Divider>
        <Box component="form" onSubmit={send} >
        <DialogContent>
          <Grid item xs={12} sx={{mx:5,m:2}}>
                <TextField label="Subject" 
                  fullWidth 
                  name="subject" 
                  size="small" 
                  type="text" 
                  onChange={handleInput} 
                  required/>
              </Grid>
              
              <Grid item xs={12} sx={{mx:5,m:2}}>
              <TextField label="Priority" size="small" defaultValue="" sx={{minWidth:'225px'}} name="priority" onChange={handleInput} select required>
                <MenuItem value={1}>Urgent</MenuItem>
                <MenuItem value={2}>Normal</MenuItem>
                <MenuItem value={3}>Take your time</MenuItem>
              </TextField>
              </Grid>
              <Grid item sx={{mx:5,m:2,mb:0}}>
                <TextField label="Query" minRows={5}  fullWidth name="query" size="small" type="text" onChange={handleInput} required multiline/>
            </Grid>

        </DialogContent>
        <DialogActions sx={{m:2}}>
        <Button size="small" type="submit"  sx={{backgroundColor:color}} variant="contained">Send</Button>
          <Button size="small" type="reset"  sx={{backgroundColor:color}} variant="contained"  onClick={cancel}>Reset</Button>
          <Button size="small" type="button"  sx={{backgroundColor:color}} variant="contained"  onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>
      </Box>
    </Dialog>
   
    {loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'50vh'}}>
  <CircularProgress />
</Container>:
  <table className="table text-center w-75 table-center m-auto mb-5" >
    <thead className='table-dark'>
      <tr>
          <th>Subject</th>
          <th>Query</th>
          <th>Priority</th>
          <th>Status </th>
          <th>#</th>
      </tr>
    </thead>
    <tbody>
      {queries.map((x,i)=>(
              <tr key={i} className={`table-${style(x.status)}`}>
              <td><Alert severity={style(x.status)} sx={{borderWidth:0,p:1,borderWidth:0}} variant="outlined" >{x.subject}</Alert></td>
              <td>{x.query}</td>
              <td>{x.priority}</td>
              <td><Chip label={x.status}  size="small" color={style(x.status)} /> </td>
              {/*<td><small>{String(formatDate(x.createdAt.toDate()))} </small></td>*/}
              <td><DeleteIcon onClick={()=>deleteQuery(x)}/></td>
              </tr>
      
          ))
        }
        </tbody>
  </table>
}
  </div>
  )
}
