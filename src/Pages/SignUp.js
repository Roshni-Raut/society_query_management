import React, { useState} from 'react';
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile} from 'firebase/auth'
import {auth, db} from '../firebase'
import { Alert, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import {  setDoc ,doc} from "firebase/firestore"; 

export const SignUp = () => {
  const [user,setUser]=useState("")
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [cpass,setCpass]=useState("")
  const [success,setSuccess]=useState("")

  const [error,setError]= useState()
  const [loading,setLoading]= useState(false)
  
  const color="#645CAA"

  const createProfile=(userCredential)=>{
    updateProfile(auth.currentUser, {
      displayName: user
    }).then(async()=>{
      const data= {
        name: userCredential.displayName?userCredential.displayName:"Society Member",
        email: userCredential.email
      };
      await setDoc(doc(db, "Profiles", userCredential.uid), data);
    })
    .catch((error) => {
      console.log(error)
      setError(error.code)
    });
  }

  const register=(e)=>{
    e.preventDefault();
    setLoading(true)
    setError("")
    if(pass!== cpass){
      setError("Password doesn't match");
    }
    else
    {
      createUserWithEmailAndPassword(auth, email, pass).then((userCredential) => {
        
        createProfile(userCredential.user);
        setSuccess("Profile created successfully")
        setTimeout(()=>{setSuccess("")},3000)
      })
      .catch((error) => {
        console.log(error)
        setError(error.code)
      });
    }
    setLoading(false)
  }

  const onGoogleSignIn=()=>{
    signInWithPopup(auth,new GoogleAuthProvider()).then((userCredential)=>{
      createProfile(userCredential.user);
      setSuccess("Profile created successfully")
      setTimeout(()=>{setSuccess("")},3000)
    })
    .catch((error)=>{
      setError(error.code)
    })
  }

  return (
    <div>
    <Container component="main" maxWidth="xs">
      <Box sx={{marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',}}>

            <Typography component="h1" variant="h5">
              Create New User
              </Typography> 
            
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

              <Box component="form" onSubmit={register} sx={{mt:3}} >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField fullWidth label="Username" type="text" onChange={(e)=>setUser(e.target.value)} required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Email address" type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Password" type="password" onChange={(e)=>setPass(e.target.value)} autoComplete="off" required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Confirm Password" type="password" onChange={(e)=>setCpass(e.target.value)} autoComplete="off" required/>
                  </Grid>
                  {pass!==cpass && <Alert severity="error">Password doesn't match</Alert>}
                  <Grid item xs={12} sm={12}>
                    <Button fullWidth disabled={loading} type="submit"  style={{backgroundColor:color}} variant="contained" >Sign in</Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button fullWidth disabled={loading} style={{backgroundColor:color}} onClick={onGoogleSignIn} variant="contained"><GoogleIcon/> Google</Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
    </Container>
  </div>
  )
}
