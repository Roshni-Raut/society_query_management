import { Copyright } from '@mui/icons-material'
import { CircularProgress, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import TimeAgo from 'timeago-react'
import { useAllProfile } from '../../../Context/admin.context'
import { auth} from '../../../firebase'
import { BarChart } from './BarChart'

export const AHistory = () => {
  const {loading,queries,count,profiles}=useAllProfile();
  const [flatCount,setCount]=useState([0,0,0]);

  useEffect(()=>{
    let flatCount=[0,0,0];
    if(profiles){
      profiles.forEach((doc)=>{
        if(doc.owner==null)
        flatCount[1]+=1
        flatCount[0]+=1
      })
      flatCount[2]=flatCount[0]-flatCount[1]
    }
    setCount(flatCount);
  },[profiles])

  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress />
</Container>:
<div>
  <Typography variant="h4" textAlign={"center"} margin={3}>
          Welcome {auth.currentUser.displayName}
  </Typography>

  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
            <div style={{maxWidth:'70vh'}}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>Status of Queries</Typography>
    <BarChart count={count}/>
    </div>
    </Grid>
    {/* Total Rooms Available */}
    <Grid item xs={12} md={4} lg={3} sx={{display:'flex',flexDirection:'column', justifyContent:'center'}}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Rooms 
    </Typography>
    <div>
      Total Flats : 20<br/>
      Total Flats Available : {20-flatCount[0]} <br/>
      Flat Bought :{flatCount[1]}<br/>
      Flat on rent : {flatCount[2]}<br/>
</div>
    </Grid>
      {/* Recent Queries */}
      <Grid item xs={12}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Recent Orders
    </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight:"bold"}}>Subject</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Status</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queries.length>0 && queries.filter((row,i)=> i<5).map((row,id) => (
            <TableRow key={id}>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell><TimeAgo datetime={row.createdAt.toDate()}/></TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
      </Grid>
    </Grid>
    <Copyright sx={{ pt: 4 }} />
  </Container>

  </div>
  )
}
