import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { color } from '@mui/system'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import TimeAgo from 'timeago-react'
import stripe from "../../../static/stripe.gif"

const MaintenanceA = () => {
  const [payments,setPayment]=useState([])
  const [loading,setIsLoading]=useState(false)
  const [status,setStatus]=useState()
  const [message,setMessage]=useState()
  const [days,setDays]= useState(1)
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  useEffect(() => {
    async function fetch(){
      try{
        await axios.post("http://localhost:4000/Allpaymentlist").then((response)=>{
          setPayment(response.data.paymentIntents)
          console.log(payments[0])
        }) 
      }catch(error){
        console.log("error:"+error)
        setMessage(" Server is down!! try again later ")
      }
    }
    if(payments.length===0)
      fetch();
      if(payments.length>0){
        var date=new Date()
        if(payments[0].created)
        {
          var date1=new Date(payments[0].created)
          //1000*60*60*24 days
          const days=Math.ceil((date-date1)/(1000*60*60*24))//1000*60 minutes
          setDays(days)
          if(days>31)
            setStatus("unpaid")
          else{
            setStatus("paid")
          }
        }
      }

  }, [payments])
  return (
    <div>
    <div style={{display:"flex", justifyContent:"center"}}>
      go to your stripe account for better view 
      <br/><br/>
      <Button type="button" href="https://dashboard.stripe.com/test/dashboard" target="_blank" >
        <img src={stripe} alt="stripe" height={50}/>
      </Button>
    </div>
      {/* Recent payments */}
      <Grid item xs={12}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Payment Details
    </Typography>
      <Table size="small">
        <TableHead>
          <TableRow >
            <TableCell sx={{fontWeight:"bold"}}>Receipt email</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Amount</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Status</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Description</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length>0 && payments.map((row,id) => (
            <TableRow key={id}>
              <TableCell>{row.receipt_email}</TableCell>
              <TableCell>{row.amount/100 } INR</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{month[new Date(row.created).getMonth()]},{new Date(row.created).getFullYear()}</TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </Grid>
    </div>
  )
}

export default MaintenanceA
