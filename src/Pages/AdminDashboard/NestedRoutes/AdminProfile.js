import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Snackbar, TextField} from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import React,{ useState} from 'react'
import { useProfile } from '../../../Context/profile.context';
import { auth } from '../../../firebase';

export const AdminProfile = () => {
  const {profile,loading}=useProfile()
  const [success,setSuccess]=useState("")
  
  const [error,setError]= useState("")
  const color="#645CAA"
  
  const changePass=()=>{
    sendPasswordResetEmail(auth, profile.email)
    .then(() => {
      setSuccess("Password Reset mail is send")
      setTimeout(()=>{setSuccess("")},6000)
    })
    .catch((error) => {
      setError(error.code)
      setTimeout(()=>{setError("")},6000)
    });
  }

  const save=async()=>{
    
      setSuccess("Your Profile is Successfully Saved")
      setTimeout(()=>{setSuccess("")},6000)
  
  }
/*
  async function fetch(){
    setLoading(true);
    console.log("fetch")
    const querySnapshot = await getDocs(collection(db, "Profiles"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
    setLoading(false);
  }
  useEffect(()=>{
    //insufficient permission
    fetch();
  },[]);*/

  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container>:
    <div><Container>

      <Snackbar open={ success!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert   variant="filled" severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

    <Grid item xs={12}>
      <Box component="form" sx={{mt:1}} >
          

          <Divider ><Chip label="Admin's Profile" color="primary"/></Divider>
            <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
              <TextField  label="Name" fullWidth size="small" type="text" value={profile.name||''} />
            </Grid>
            <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
              <TextField  label="User Id"fullWidth size="small" type="text"  value={profile.uid||''} />
            </Grid>
            <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
              <TextField label="Email" fullWidth size="small" type="text"  value={profile.email||''} />
        
          </Grid>


          <Grid container justifyContent="center" spacing={3} sx={{mt:1,mb:1}} >
          <Grid item >
              <Button size="small" disabled={loading} type="button"  sx={{backgroundColor:color}} variant="contained" onClick={changePass}>change password</Button>
            </Grid>
            <Grid item >
              <Button size="small" disabled={loading} type="button"  sx={{backgroundColor:color}} variant="contained"onClick={save} >Save</Button>
            </Grid>
            <Grid item >
              <Button size="small" disabled={loading} type="button"  sx={{backgroundColor:color}} variant="contained"  >Cancel</Button>
            </Grid>
          </Grid>
        </Box>
    </Grid>
          
  </Container></div>
  )
}
