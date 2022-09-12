import React, { useState} from 'react';
import {GoogleAuthProvider,  signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'
import {auth} from '../firebase'
import { Box, Button, Container, Grid, TextField, Typography,Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [user,setUser]=useState("")

  const [error,setError]= useState()
  const [success,setSuccess]= useState()
  const [loading,setLoading]= useState(false)
  
  const color="#645CAA"
  const nav=useNavigate();

  const Login=(e)=>{
    e.preventDefault();
    setLoading(true)
    setError("")
    console.log("hii")
        signInWithEmailAndPassword(auth,email,pass).then((userCredential)=>{
          console.log(userCredential.user.email)
          setSuccess("logged in")
          setTimeout(()=>{
            setSuccess("");
          },3000);
        }).catch((error) => {
          setError(error.code)
        });
  setLoading(false)
  }
  const onGoogleSignIn=()=>{
    signInWithPopup(auth,new GoogleAuthProvider()).then((userCredential)=>{
      const user = userCredential.user;
      console.log(user);
      setSuccess("logged in")
      setTimeout(()=>{
        setSuccess("");
      },3000);
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
              Login
              </Typography> 
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Box component="form" onSubmit={Login} sx={{mt:3}} >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Email address" type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Password" type="password" onChange={(e)=>setPass(e.target.value)} autoComplete="off" required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button fullWidth disabled={loading} type="submit"  style={{backgroundColor:color}} variant="contained" >Login</Button>
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
