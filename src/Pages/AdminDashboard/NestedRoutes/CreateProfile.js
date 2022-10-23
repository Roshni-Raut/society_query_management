import React, { useState} from 'react';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { Alert, Box, Button, Checkbox, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,  IconButton,  Input,  InputAdornment,  InputLabel,  MenuItem, Snackbar, TextField, Typography} from '@mui/material';
import {  setDoc ,doc, getDocs, collection} from "firebase/firestore"; 
import { auth,db } from '../../../firebase';
import { useEffect } from 'react';
import Profiles from './Profiles';
import { useAllProfile } from '../../../Context/admin.context';
import SearchIcon from '@mui/icons-material/Search';

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
  const [inputError,setInputError]= useState({
    fname:"",lname:"",mname:"",
    oname:"",oemail:"",ocontact:"",
    phone:"",phone1:"",adhaar:"",
    fmember:"",email:""})
    const [owner,setOwner]=useState({oname:"",oemail:"",ocontact:""});
    const [load,setLoading]= useState(false)
    const [flatno,setFlatno]=useState([])
    const color="#645CAA"
    const validEmail=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const [isOwner,setisOwner]=useState(false) 
    const [open,setOpen]=useState(false)
    const {profiles,loading}=useAllProfile();
    const [search,setSearch]=useState()

  async function fetch(){
    let arr1=[];
    profiles.forEach((doc) => {
      arr1.push(doc.flatno);
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
    setLoading(false)
  },[])
  const Save=()=>{
    try{
      localStorage.setItem("profile",JSON.stringify({...profile,flatno:"",pass:"",cpass:""}))
      setSuccess("Saved")
      setTimeout(()=>setSuccess(""),6000)
    }catch(error){
      setError(error.code);
      setTimeout(()=>setError(""),6000)
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
    e.preventDefault();
    const name=e.target.name;
    const value=e.target.value;
    switch(name){
      case 'fname': if(/[^A-Z]/i.test(value)===true)
                      setInputError({...inputError,fname:"invalid value"})
                    else
                    setInputError({...inputError,fname:""})
                    break;
      case 'mname': if(/[^A-Z]/i.test(value)===true)
                      setInputError({...inputError,mname:"invalid input"})
                    else
                    setInputError({...inputError,mname:""})
                    break; 
      case 'lname': if(/[^A-Z]/i.test(value)===true)
                      setInputError({...inputError,lname:"invalid input"})
                    else
                      setInputError({...inputError,lname:""})
                    break;      
      case 'phone': if(/[^0-9]/.test(value)===true || value.length!==10)
                      setInputError({...inputError,phone:"invalid input"})
                    else
                      setInputError({...inputError,phone:""})
                    break;    
      case 'phone1': if(/[^0-9]/.test(value)===true || value.length!==10)
                      setInputError({...inputError,phone1:"invalid input"})
                    else
                      setInputError({...inputError,phone1:""})
                    break; 
      case 'adhaar': if(/[^0-9]/.test(value)===true || value.length!==12)
                      setInputError({...inputError,adhaar:"invalid input"})
                    else
                      setInputError({...inputError,adhaar:""})
                    break; 
      case 'fmember': if(/[^0-9]/.test(value)===true)
                      setInputError({...inputError,fmember:"invalid input"})
                    else
                      setInputError({...inputError,fmember:""})
                    break;       
      case 'email': if(validEmail.test(value)===false)
                      setInputError({...inputError,email:"invalid input"})
                    else
                      setInputError({...inputError,email:""})
                    break;          
      default: console.log(name)
        break;
    }
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
        owner:isOwner?null:{name: owner.oname,
          email:owner.oemail,
          contact:owner.ocontact},
        time: today
      };
      await setDoc(doc(db, "Profiles", userCredential.uid), data);
      await setDoc(doc(db, "Query", userCredential.uid), {queries:[]});
      await setDoc(doc(db, "Notifications", userCredential.uid), {notifications:[]});
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
    for(let i in inputError){
      if(inputError[i]!==""){
        setError("Correct the red Text field")
        setTimeout(()=>setError(""),6000)
        setLoading(false)
        return;
      }
    }
    if(profile.pass!==profile.cpass){
      setError("Password doesn't match");
      setTimeout(()=>setError(""),6000)
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
  const handleOwner=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    switch(name){
      case 'oname':if(/[^a-z \s \.]/i.test(value))
                      setInputError({...inputError,[name]:"invalid input"})
                    else
                      setInputError({...inputError,[name]:""})
                    break; 
      case 'oemail':if(validEmail.test(value)===false)
                      setInputError({...inputError,[name]:"invalid input"})
                    else
                      setInputError({...inputError,[name]:""})
                    break; 
      case 'ocontact':if(/[^0-9]/i.test(value) || value.length!==10 )
                      setInputError({...inputError,[name]:"invalid input"})
                    else
                      setInputError({...inputError,[name]:""})
                    break;               
      default: 
    }
    setOwner({...owner,[name]:value})
  }
  const searching=(e)=>{
    const word=e.target.value.toLowerCase()
      console.log(word)
      setSearch(profiles.filter(x=>(x.fname+x.lname+x.mname).toLowerCase().match(word) ))
    console.log(search)
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

      <Button size="small" onClick={()=>setOpen(true)}sx={{backgroundColor:color}}variant="contained">Create new User</Button>
      <div style={{float:'right'}}>

      <Input
            id="standard-adornment-password"
            type="text"
            placeholder='Search'
            onChange={searching}
            endAdornment={
              <InputAdornment position="end">
                  <SearchIcon/>
              </InputAdornment>
            }
            />
      </div>
      
      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Create User</DialogTitle>
        <Divider color="black" variant="middle" sx={{marginBottom:1}}></Divider>

        <Grid item xs={12}>
        <Box component="form" onSubmit={register} >
            <Grid container spacing={3} justifyContent="center" >
              <Grid item >
                <TextField  
                    value={profile.fname} 
                    label="Firstname" 
                    name="fname" 
                    size="small" 
                    type="text" 
                    onChange={handleInput} 
                    required
                    error={inputError.fname!==""}
                    helperText={inputError.fname}
                    />
              </Grid>
              <Grid item >
                <TextField  
                    value={profile.mname} 
                    label="Middlename" 
                    name="mname" 
                    size="small" 
                    type="text" 
                    onChange={handleInput} 
                    required
                    error={inputError.mname!==""}
                    helperText={inputError.mname}
                    />
              </Grid>
              <Grid item>
                <TextField  
                  value={profile.lname} 
                  label="Lastname" 
                  name="lname" 
                  size="small" 
                  type="text" 
                  onChange={handleInput} 
                  required
                  error={inputError.lname!==""}
                  helperText={inputError.lname}
                  />
              </Grid>
            </Grid>

            <Grid display="flex" justifyContent="center" alignItems="center">
            <Checkbox color="secondary" size="small" 
              onChange={(e)=>e.target.checked?setisOwner(true):setisOwner(false)}/>
            <Typography variant="caption" >Owner name same as above </Typography>
            </Grid>

            {!isOwner && 
            <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
              <Grid item >
                <TextField  
                    value={owner.oname} 
                    label="Enter Full Name" 
                    name="oname" 
                    size="small" 
                    type="text" 
                    onChange={handleOwner} 
                    required
                    error={inputError.oname!==""}
                    helperText={inputError.oname}
                    />
              </Grid>
              <Grid item >
                <TextField  
                    value={owner.oemail} 
                    label="Email Id" 
                    name="oemail" 
                    size="small" 
                    type="text" 
                    onChange={handleOwner} 
                    required
                    error={inputError.oemail!==""}
                    helperText={inputError.oemail}
                    />
              </Grid>
              <Grid item>
                <TextField  
                  value={owner.ocontact} 
                  label="Contact" 
                  name="ocontact" 
                  size="small" 
                  type="text" 
                  onChange={handleOwner} 
                  required
                  error={inputError.ocontact!==""}
                  helperText={inputError.ocontact}
                  />
              </Grid>
            </Grid>}

            <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
              <Grid item >
                <TextField  
                value={profile.phone} 
                label="Phone no" 
                name="phone" 
                size="small" 
                type="text" 
                onChange={handleInput} 
                required
                error={inputError.phone!==""}
                helperText={inputError.phone}
                />
              </Grid>
              <Grid item >
                <TextField  
                  value={profile.phone1} 
                  label="Alternate Phone no."
                  name="phone1" 
                  size="small" 
                  type="text" 
                  onChange={handleInput} 
                  required
                  error={inputError.phone1!==""}
                  helperText={inputError.phone1}
                  />
              </Grid>
              <Grid item>
                <TextField 
                value={profile.adhaar} 
                label="Adhaar number" 
                name="adhaar" 
                size="small" 
                type="text" 
                onChange={handleInput} 
                required
                error={inputError.adhaar!==""}
                helperText={inputError.adhaar}
                />
              </Grid>
            </Grid>




            <Divider variant="middle" ><Chip label="Personal Details"variant="outlined" color="primary" style={{color:color,borderColor:color}}/></Divider>

            <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:0}}>
              <Grid item>
                <TextField 
                    label="Total Family Member" 
                    size="small" 
                    name="fmember" 
                    type="text" 
                    onChange={handleInput} 
                    value={profile.fmember}
                    required
                    error={inputError.fmember!==""}
                    helperText={inputError.fmember}
                    />
              </Grid>
              <Grid item>
              <TextField 
                  label="Gender" size="small" defaultValue="" sx={{minWidth:'225px'}} name="gender" onChange={handleInput} value={profile.gender||''} required select>
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
                



            <Divider variant="middle" ><Chip label="Login Details" variant="outlined" color="primary" style={{color:color,borderColor:color}}/></Divider>

            <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:0}}>
              <Grid item >
                <TextField 
                    size="small" 
                    label="Email address" 
                    type="email" 
                    name="email" 
                    onChange={handleInput} 
                    value={profile.email} 
                    required
                    error={inputError.email!==""}
                    helperText={inputError.email}
                    />
              </Grid>
              <Grid item>
                <TextField size="small" label="Password" type="password" name="pass" onChange={handleInput} value={profile.pass||''} autoComplete="off" required/>
              </Grid>
              <Grid item >
                <TextField size="small" error={profile.pass!==profile.cpass} name="cpass"label="Confirm Password" type="password" onChange={handleInput} value={profile.cpass||''} autoComplete="off" required/>
              </Grid>
            </Grid>

            <DialogActions sx={{m:2}}>
            <Grid container justifyContent="center" spacing={3} >
              <Grid item >
                <Button size="small" disabled={loading} type="submit"  sx={{backgroundColor:color}} variant="contained" >Create Profile</Button>
              </Grid>
              <Grid item >
                <Button size="small" disabled={loading} type="button"  sx={{backgroundColor:color}} variant="contained" onClick={Save}>Save</Button>
              </Grid>
              <Grid item >
                <Button size="small" disabled={loading} type="reset"  sx={{backgroundColor:color}} variant="contained"  onClick={()=>{setOpen(false);cancel()}}>Cancel</Button>
              </Grid>
            </Grid>
            </DialogActions>
          </Box>
      </Grid>
  
    </Dialog>
        {/*if search is empty then send profiles else search */}
      <Profiles profiles={search?search:profiles} loading={load}/>  
    </Container>
  </div>
  )
}
