
import { Box, Button, Chip, Container, Divider, Grid,  MenuItem, TextField} from '@mui/material';
import React,{useState} from 'react'

export const Query = () => {
  const arr=[101,102,201,202]
  const [loading]= useState(false)
  const color="#645CAA"
  return (
    <div><Container>
      
    <Grid item xs={12}>
      <Box component="form" sx={{mt:1}} >
          
          <Divider ><Chip label="Create New Profile" color="primary"/></Divider>


          <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:1}}>
            <Grid item >
              <TextField error={false} label="Firstname" size="small" type="text"  required/>
            </Grid>
            <Grid item >
              <TextField error={false} label="Middlename" size="small" type="text"  required/>
            </Grid>
            <Grid item>
              <TextField error={false} label="Lastname" size="small" type="text"  required/>
            </Grid>
          </Grid>




          <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
            <Grid item >
              <TextField error={false} label="Phone no" size="small" type="text"  required/>
            </Grid>
            <Grid item >
              <TextField error={false} label="Alternate Phone no." size="small" type="text"  required/>
            </Grid>
            <Grid item>
              <TextField error={false} label="Adhaar number" size="small" type="text"  required/>
            </Grid>
          </Grid>


          <Divider variant="middle" ><Chip label="Personal Details"variant="outlined" color="primary"/></Divider>



          <Grid container spacing={3} justifyContent="center" sx={{mb:2,mt:0}}>
            <Grid item>
              <TextField error={false} label="Total Family Member" size="small" type="text"  required/>
            </Grid>
            <Grid item>
            <TextField label="Gender" size="small" defaultValue="" sx={{minWidth:'225px'}}  required select>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
            </TextField>
            </Grid>
            <Grid item>
              <TextField error={false} label="Date of Birth" size="small" type="date" sx={{minWidth:'225px'}}  InputLabelProps={{shrink: true, }} required/>
            </Grid>
          </Grid>




          <Grid container spacing={3} justifyContent="center" sx={{mb:2}}>
            <Grid item>
            <TextField label="Flat No" size="small"defaultValue="" sx={{minWidth:'225px'}} select required>
              {arr.map((x,i)=>(
                <MenuItem value={x} key={x}>{x}</MenuItem>
              )
              )}
            </TextField>
            </Grid>
            <Grid item>
            <TextField label="Profession" size="small" type="text"  required/>
            </Grid>
            <Grid item>
            <TextField label="Nationality" size="small"defaultValue="" sx={{minWidth:'225px'}} select required>
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            </Grid>
          </Grid>
              


              <Divider variant="middle" ><Chip label="Login Details" variant="outlined" color="primary"/></Divider>



          <Grid container justifyContent="center" spacing={3} sx={{mt:1,mb:3}} >
            <Grid item >
              <Button size="small" disabled={loading} type="submit"  sx={{backgroundColor:color}} variant="contained" >Send Query</Button>
            </Grid>
            <Grid item >
              <Button size="small" disabled={loading} type="submit"  sx={{backgroundColor:color}} variant="contained" >Cancel</Button>
            </Grid>
          </Grid>
          
        </Box>
    </Grid>
          
  </Container></div>
  )
}
