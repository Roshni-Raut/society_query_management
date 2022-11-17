import { Alert,Box, Button, Chip, CircularProgress, Container, Divider, Grid, Snackbar, TextField} from '@mui/material';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import React,{ useState} from 'react'
import { auth, color } from '../../../firebase';
import AvatarBtn from '../../Common/AvatarBtn';

export const AdminProfile = () => {
  const profile=auth.currentUser;
  const [name,setName]=useState()
  const [success,setSuccess]=useState("")
  
  const [error,setError]= useState("")
  
  
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
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      setSuccess("Profile updated")
      setTimeout(()=>setSuccess(""),6000)
    }).catch((error) => {
      setError(error.code)
      setTimeout(()=>setError(""),6000)
    });
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

  return (!profile?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container >:
    <div><Container style={{maxWidth:'50vw'}}>

      <Snackbar open={ success!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert   variant="filled" severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={ error!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert   variant="filled" severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

    <Grid item xs={12}>
      <Box component="form" sx={{mt:1,mx:5}}>
          
          <Divider ><Chip label="Admin's Profile" color="primary" style={{backgroundColor:color}}/></Divider>
            <AvatarBtn profile={profile} />

            <Grid item xs={12} sx={{mx:5,m:2,mt:2}}>
              {console.log(profile)}
              <TextField  label="Name" fullWidth size="small" type="text" value={name||profile.displayName||''} onChange={(e)=>setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
              <TextField  label="User Id"fullWidth size="small" type="text"  value={profile.uid||''} />
            </Grid>
            <Grid item xs={12} sx={{mx:5,m:2,mt:5}}>
              <TextField label="Email" fullWidth size="small" type="text"  value={profile.email||''} />
        
          </Grid>


          <Grid container justifyContent="center" spacing={3} sx={{mt:1,mb:1}} >
          <Grid item >
              <Button size="small"  type="button"  sx={{backgroundColor:color}} variant="contained" onClick={changePass}>change password</Button>
            </Grid>
            <Grid item >
              <Button size="small"  type="button"  sx={{backgroundColor:color}} variant="contained"onClick={save} >Save</Button>
            </Grid>
            <Grid item >
              <Button size="small"  type="button"  sx={{backgroundColor:color}} variant="contained"  >Cancel</Button>
            </Grid>
          </Grid>
        </Box>
    </Grid>
          
  </Container></div>
  )
}
