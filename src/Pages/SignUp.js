import React, { useState} from 'react';
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile} from 'firebase/auth'
import {auth, db} from '../firebase'
import { Alert, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import {  setDoc ,doc} from "firebase/firestore"; 
import { async } from '@firebase/util';

export const SignUp = () => {
  const [user,setUser]=useState("")
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [cpass,setCpass]=useState("")

  const [error,setError]= useState()
  const [loading,setLoading]= useState(false)
  
  const color="#645CAA"
  const nav=useNavigate();

  const invalidPass=()=>{
    if(pass!== cpass){
      setError("Password doesn't match");
      return 1
    }
    return 0
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
        const userc = userCredential.user;
        
        updateProfile(auth.currentUser, {
          displayName: user
        }).then(async()=>{
          const data= {
            name: user,
            email:email
          };
          await setDoc(doc(db, "Profiles", userc.uid), data);
        })
        .catch((error) => {
          console.log(error)
          setError(error.code)
        });

        nav("/customer-dashboard");
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
      const user = userCredential.user;
      console.log(user)
      nav("/customer-dashboard");
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
