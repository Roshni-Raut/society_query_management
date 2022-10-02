import React, { useState} from 'react';
import { signInWithEmailAndPassword} from 'firebase/auth'
import {admin, auth} from '../firebase'
import { Box, Button, Container, Grid, TextField, Typography,Alert, CircularProgress, ThemeProvider, createTheme, CssBaseline, Paper, Avatar, FormControlLabel, Checkbox, Link, Snackbar } from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
const theme = createTheme();

export const SignIn = () => {
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")

  const [error,setError]= useState("")
  const [loading,setLoading]= useState(false)
  const regexEmail=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const color="#645CAA"
  const nav=useNavigate();

  const Login=async(e)=>{
    e.preventDefault();
    if(regexEmail.test(email)){
      setLoading(true)
      setError("")
      try{
        await signInWithEmailAndPassword(auth,email,pass).then((userCredential)=>{
          if(userCredential.user.email===admin){
            nav("/admin-dashboard")
          }else{
            nav("/customer-dashboard")
          }
        })
      }catch(error){
        setError(error.code+": "+error.message)
        setTimeout(()=>setError(""),6000)
      }
    }
    setLoading(false)
  }
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container>:
    <div>
  
      <Snackbar open={ error!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
<ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://www.nobroker.in/blog/wp-content/uploads/2015/03/NoBroker-Real-Estate-News.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{my: 8,mx: 4,display: 'flex',flexDirection: 'column',alignItems: 'center',}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form"  onSubmit={Login} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!regexEmail.test(email)&&email!==""} 
                helperText={email!==''&& !regexEmail.test(email)&&"Enter valid email"} 
                type="email" 
                onChange={(e)=>setEmail(e.target.value)} 
              />
              <TextField margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={(e)=>setPass(e.target.value)} 
                autoComplete="off"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 ,backgroundColor:color}}
                disabled={loading}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">Forgot password?</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>{/*
    <Container component="main" maxWidth="xs">
      <Box sx={{marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',}}>

            <Typography component="h1" variant="h5">
              Login
              </Typography> 
              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={Login} sx={{mt:3}} >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Email address" error={!regexEmail.test(email)&&email!==""} helperText={email!==''&& !regexEmail.test(email)&&"Enter valid email"} type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Password" type="password" onChange={(e)=>setPass(e.target.value)} autoComplete="off" required/>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button fullWidth disabled={loading} type="submit"  style={{backgroundColor:color}} variant="contained" >Login</Button>
                  </Grid>
                 
                </Grid>
              </Box>
            </Box>
      </Container>*/}


  </div>
  )
}
