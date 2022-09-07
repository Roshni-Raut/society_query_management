import React, { useState} from 'react';
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {auth} from '../firebase'
import { Alert } from 'react-bootstrap';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")

  const [error,setError]= useState()
  const [loading,setLoading]= useState(false)
  
  const color="#645CAA"
  const nav=useNavigate();

  const register=(e)=>{
    e.preventDefault();
    setLoading(true)
    setError("")
      createUserWithEmailAndPassword(auth, email, pass).then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        nav("/login");
      })
      .catch((error) => {
        setError(error.code)
      });
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
              Login
              </Typography> 
            
            {error && <Alert variant="danger">{error}</Alert>}

              <Box component="form" onSubmit={register} sx={{mt:3}} >
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