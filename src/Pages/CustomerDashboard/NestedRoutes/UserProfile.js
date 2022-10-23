import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Snackbar, TextField} from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import {  doc,   updateDoc } from 'firebase/firestore';
import React,{ useState} from 'react'
import { useProfile } from '../../../Context/currentprofile.context';
import { auth, db } from '../../../firebase';
import AvatarBtn from '../../AdminDashboard/NestedRoutes/AvatarBtn';

export const UserProfile = () => {
  const {profile,loading}=useProfile()
  const [phone1,setPhone1]=useState(profile.phone1)
  const [profession,setProfession]=useState(profile.profession)
  const [fmember,setFmember]=useState(profile.fmember)
  const [phone,setPhone]=useState(profile.phone)
  const [dob,setDob]=useState(profile.dob)
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
    try{
      const profileRef = doc(db, "Profiles", auth.currentUser.uid);
      await updateDoc(profileRef, {
        phone: phone,
        phone1: phone1,
        fmember:fmember,
        profession:profession,
        dob:dob
      });
      setSuccess("Your Profile is Successfully Saved")
      setTimeout(()=>{setSuccess("")},6000)
    }catch(error){
      setError(error.code)
      setTimeout(()=>{setError("")},6000)
    }
  }
//testing
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

  return (loading && dob?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
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
          

          <Divider ><Chip label={`${profile.fname}'s Profile`} color="primary"/></Divider>
          <AvatarBtn profile={auth.currentUser}/>
          <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:1}}>
            <Grid item >
              <TextField  label="Firstname" size="small" type="text" value={profile.fname||''} variant="filled"/>
            </Grid>
            <Grid item >
              <TextField  label="Middlename" size="small" type="text"  value={profile.mname||''} variant="filled"/>
            </Grid>
            <Grid item>
              <TextField label="Lastname" size="small" type="text"  value={profile.lname||''} variant="filled"/>
            </Grid>
          </Grid>




          <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
            <Grid item >
              <TextField error={false} label="Phone no" size="small" type="text" value={phone||''} onChange={(e)=>setPhone(e.target.value)} required/>
            </Grid>
            <Grid item >
              <TextField error={false} label="Alternate Phone no." size="small" type="text" value={phone1||''} onChange={(e)=>setPhone1(e.target.value)} required/>
            </Grid>
            <Grid item>
              <TextField error={false} label="Adhaar number" size="small" type="text" value={profile.adhaar||''} variant="filled"/>
            </Grid>
          </Grid>


          <Divider variant="middle" ><Chip label="Personal Details"variant="outlined" color="primary"/></Divider>



          <Grid container spacing={3} justifyContent="center" sx={{mb:1,mt:0}}>
            <Grid item>
              <TextField error={false} label="Total Family Member" value={fmember||''} onChange={(e)=>setFmember(e.target.value)} required size="small" type="text" />
            </Grid>
            <Grid item>
            <TextField label="Gender" size="small"  sx={{minWidth:'225px'}}  value={profile.gender||''}required variant="filled"/>
   
            </Grid>
            <Grid item>
              <TextField error={false} label="Date of Birth" size="small" type="date" sx={{minWidth:'225px'}} value={dob||''} InputLabelProps={{shrink: true, }} onChange={(e)=>setDob(e.target.value)} required/>
            </Grid>
          </Grid>




          <Grid container spacing={3} justifyContent="center" sx={{mb:1}}>
            <Grid item>
            <TextField label="Flat No" size="small" sx={{minWidth:'225px'}} value={profile.flatno||''} variant="filled" required/>
            </Grid>
            <Grid item>
            <TextField label="Profession" size="small" type="text" value={profession||''} onChange={(e)=>setProfession(e.target.value)} required/>
            </Grid>
            <Grid item>
              <TextField label="Nationality" size="small" sx={{minWidth:'225px'}} value={profile.nationality||''} variant="filled"/>
              
            </Grid>
          </Grid>
              





          <Divider variant="middle" ><Chip label="Login Details" variant="outlined" color="primary"/></Divider>
          <Grid container spacing={3} justifyContent="center" sx={{mb:1,mt:0}}>
            <Grid item >
              <TextField size="small" label="Email address" type="email"  value={profile.email||''} variant="filled"/>
            </Grid>
            
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
