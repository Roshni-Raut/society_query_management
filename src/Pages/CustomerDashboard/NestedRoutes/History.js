import { CircularProgress, Container, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'
import TimeAgo from 'timeago-react';
import { useProfile } from '../../../Context/currentprofile.context';
import { auth } from '../../../firebase';
import { BarChart } from '../../AdminDashboard/NestedRoutes/BarChart';

export const History = () => {
    const {loading,queries,count}=useProfile();

  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress />
</Container>:
<div>
  <Typography variant="h4" textAlign={"center"} margin={3}>
          Welcome {auth.currentUser.displayName}
          {console.log(count)}
  </Typography>
    <div style={{maxWidth:'70vh'}}>
      
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      Status of Queries
      </Typography>
      <BarChart count={count}/>
    </div>
      {/* Recent Queries */}
      <Grid item xs={12}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Recent Query
    </Typography>
      <Table size="small">
        <TableHead>
          <TableRow sx={{fontWeight:"bold"}}>
            <TableCell>Subject</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time</TableCell>
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
  </div>
  )
}
