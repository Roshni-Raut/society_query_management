
import { CircularProgress, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { useAllProfile } from '../../../Context/admin.context'
import { auth } from '../../../firebase'
import { BarChart } from './BarChart'

export const AHistory = () => {
  const {loading,count}=useAllProfile();


  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress />
</Container>:
<div>
  <Typography variant="h4" textAlign={"center"} margin={3}>
          Welcome {auth.currentUser.displayName}
  </Typography>
    <div style={{maxWidth:'70vh'}}>
      <Typography variant="h6"textAlign={"center"}>Status of Queries</Typography>
      <BarChart count={count}/>
    </div>
  </div>
  )
}
