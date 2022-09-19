import React, { useState} from 'react';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid,  MenuItem, Snackbar, TextField} from '@mui/material';
import {  setDoc ,doc, getDocs, collection} from "firebase/firestore"; 
import { auth,db } from '../../../firebase';
import { useEffect } from 'react';

export const CreateProfile = () => {
  const [profile,setProfile]=useState({
    fname:"", mname:"",lname:"",
    phone:"",phone1:"",adhaar:"",
    fmember:"",gender:"",dob:"",
    flatno:"",profession:"",nationality:"",
    email:"",pass:"",cpass:""
  })
  const arr=[101,102,103,104,105,106,107,108,109,110,201,202,203,204,205,206,207,208,209,210];
  const [success,setSuccess]=useState("")
  const [error,setError]= useState("")
  const [loading,setLoading]= useState(false)
  const [flatno,setFlatno]=useState([])
  const color="#645CAA"
  
  async function fetch(){
    console.log("fetch")
    const querySnapshot = await getDocs(collection(db, "Profiles"));
    let arr1=[];
    querySnapshot.forEach((doc) => {
      arr1.push(doc.data().flatno);
    });
    setFlatno(arr1)
  }

  useEffect(()=>{
    setLoading(true)
    fetch();
    if("profile" in localStorage)  {
      setProfile(JSON.parse(localStorage.getItem("profile")));
      console.log()
    }
    console.log("createprofile:rendering")
    setLoading(false)
  },[])

  const Save=()=>{
    try{
      localStorage.setItem("profile",JSON.stringify(profile))
    }catch(error){
      setError(error);
    }
  }
  const cancel=()=>{
    setProfile({fname:"", mname:"",lname:"",
    phone:"",phone1:"",adhaar:"",
    fmember:"",gender:"",dob:"",
    flatno:"",profession:"",nationality:"",
    email:"",pass:"",cpass:""})
    localStorage.removeItem("profile")
  }
  const handleInput=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    
    setProfile({...profile,[name]:value});
  }
  const createProfile=(userCredential)=>{

    updateProfile(auth.currentUser, {
      displayName: profile.fname+" "+profile.lname
    }).then(async()=>{
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + '-' + dd + '-' + yyyy;
      const data= {
        fname: profile.fname,
        mname: profile.mname,
        lname:profile.lname,
        phone:profile.phone,
        phone1:profile.phone1,
        adhaar:profile.adhaar,
        fmember:profile.fmember,
        gender:profile.gender,
        dob:profile.dob,
        flatno:profile.flatno,
        profession:profile.profession,
        nationality:profile.nationality,
        email: userCredential.email,
        time: today
      };
      await setDoc(doc(db, "Profiles", userCredential.uid), data);
      setSuccess("login Created successfully");
      setTimeout(()=>{setSuccess("")},6000)
    })
    .catch((error) => {
      setError(error.code)
      setTimeout(()=>{setError("")},6000)
    });
  }

  const register=(e)=>{
    e.preventDefault();
    setLoading(true)
    setError("")
    if(profile.pass!==profile.cpass){
      setError("Password doesn't match");
    }
    else
    {
      createUserWithEmailAndPassword(auth, profile.email,profile.pass).then((userCredential) => {
        createProfile(userCredential.user);
        
        setSuccess("Profile created successfully")
        setTimeout(()=>{setSuccess("")},5000)
      })
      .catch((error) => {
        console.log(error)
        setError(error.code)
        setTimeout(()=>{setSuccess("")},5000)
      });
    }
    setLoading(false)
  }

  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container>:
    <div>
    <Container>

    <Snackbar open={ error!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert   variant="filled" severity="error" sx={{ minWidth: '220px' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={ success!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert   variant="filled" severity="success" sx={{ minWidth: '220px' }}>
          {success}
        </Alert>
      </Snackbar>

      <Grid item xs={12}>
        <Box component="form" onSubmit={register} sx={{mt:1}} >
        
            <Divider ><Chip label="Create New Profile" color="primary"/></Divider>


            <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:1}}>
              <Grid item >
                <TextField  value={profile.fname} label="Firstname" name="fname" size="small" type="text" onChange={handleInput} required/>
              </Grid>
              <Grid item >
                <TextField  value={profile.mname} label="Middlename" name="mname" size="small" type="text" onChange={handleInput} required/>
              </Grid>
              <Grid item>
                <TextField  value={profile.lname} label="Lastname" name="lname" size="small" type="text" onChange={handleInput} required/>
              </Grid>
            </Grid>




            <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
              <Grid item >
                <TextField error={false} value={profile.phone} label="Phone no" name="phone" size="small" type="text" onChange={handleInput} required/>
              </Grid>
              <Grid item >
                <TextField error={false} value={profile.phone1} label="Alternate Phone no."name="phone1" size="small" type="text" onChange={handleInput} required/>
              </Grid>
              <Grid item>
                <TextField error={false} value={profile.adhaar} label="Adhaar number" name="adhaar" size="small" type="text" onChange={handleInput} required/>
              </Grid>
            </Grid>


            <Divider variant="middle" ><Chip label="Personal Details"variant="outlined" color="primary"/></Divider>



            <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:0}}>
              <Grid item>
                <TextField error={false} label="Total Family Member" size="small" name="fmember" type="text" onChange={handleInput} value={profile.fmember}required/>
              </Grid>
              <Grid item>
              <TextField label="Gender" size="small" defaultValue="" sx={{minWidth:'225px'}} name="gender" onChange={handleInput} value={profile.gender||''} required select>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
              </TextField>
              </Grid>
              <Grid item>
                <TextField error={false} label="Date of Birth" size="small" type="date" name="dob" sx={{minWidth:'225px'}} onChange={handleInput} value={profile.dob||''} InputLabelProps={{shrink: true, }} required/>
              </Grid>
            </Grid>




            <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
              <Grid item>
              <TextField label="Flat No" size="small" defaultValue='' sx={{minWidth:'225px'}}name="flatno" select onChange={handleInput} value={ profile.flatno||"" } required>
              <MenuItem disabled value="choose">Choose Option</MenuItem>
                {arr.map((x)=>(
                  <MenuItem value={x} key={x} disabled={flatno.includes(x)}>{x}</MenuItem>
                )
                )}
              </TextField>
              </Grid>
              <Grid item>
              <TextField label="Profession" size="small" type="text" onChange={handleInput} name="profession" value={profile.profession} required/>
              </Grid>
              <Grid item>
              <TextField label="Nationality" size="small" defaultValue="" sx={{minWidth:'225px'}} name="nationality" onChange={handleInput} value={profile.nationality||''} select required>
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              </Grid>
            </Grid>
                

            <Divider variant="middle" ><Chip label="Login Details" variant="outlined" color="primary"/></Divider>



            <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:0}}>
              <Grid item >
                <TextField size="small" label="Email address" type="email" name="email" onChange={handleInput} value={profile.email} required/>
              </Grid>
              <Grid item>
                <TextField size="small" label="Password" type="password" name="pass" onChange={handleInput} value={profile.pass||''} autoComplete="off" required/>
              </Grid>
              <Grid item >
                <TextField size="small" error={profile.pass!==profile.cpass} name="cpass"label="Confirm Password" type="password" onChange={handleInput} value={profile.cpass||''} autoComplete="off" required/>
              </Grid>
            </Grid>




            <Grid container justifyContent="center" spacing={3} sx={{mt:1,mb:3}} >
              <Grid item >
                <Button size="small" disabled={loading} type="submit"  sx={{backgroundColor:color}} variant="contained" >Create Profile</Button>
              </Grid>
              <Grid item >
                <Button size="small" disabled={loading} type="button"  sx={{backgroundColor:color}} variant="contained" onClick={Save}>Save</Button>
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
