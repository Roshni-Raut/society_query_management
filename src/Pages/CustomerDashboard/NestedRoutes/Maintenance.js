import React, { useEffect, useState } from 'react'
import { CheckoutForm } from './CheckoutForm'
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Alert, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import TimeAgo from 'timeago-react';
import axios from 'axios';
import { auth, server_url } from '../../../firebase';
import { Paid } from './Paid';

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_API_KEY}`);

const Maintenance = () => {
  const [payments,setPayment]=useState([])
  const [loading,setIsLoading]=useState(false)
  const [status,setStatus]=useState()
  const [message,setMessage]=useState()
  const [days,setDays]= useState(0)

  useEffect(() => {
    async function fetch(){
      try{
        await axios.post(server_url+"/paymentlist",{
          email: auth.currentUser.email,
        }).then((response)=>{
          if(response.data.paymentIntents.length>0){
            setPayment(response.data.paymentIntents)
            console.log(payments[0])
          }
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
    message?<Alert  variant="filled" severity="error" sx={{ minWidth: '220px' }}>{message}</Alert>:
    <div>
    <div style={{display:"flex", justifyContent:"center"}}>
      <Card sx={{minWidth:"400px",p:2}}>
      <CardContent>
        <Typography gutterBottom variant="h5" textAlign="center" component="div">
          Maintenance Bill
        </Typography>
        {status==="paid"?<Paid status={
          {
            transaction_id: payments[0].transaction_id,
            date: payments[0].created,
            amount:payments[0].amount/100,
          }
        }/>:
        <Elements  stripe={stripePromise}>
          <CheckoutForm days={days}/>
        </Elements>}
        </CardContent>
    </Card>
  </div>
      {/* Recent payments */}
      <Paper sx={{p:2, mt:1}}>
      <Grid item xs={12}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Payment Details
    </Typography>
    {payments.length>0?
      <Table size="small">
        <TableHead>
          <TableRow >
            <TableCell sx={{fontWeight:"bold"}}>Transaction_id</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Amount</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Status</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Description</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length>0 && payments.map((row,id) => (
            <TableRow key={id}>
              <TableCell>{row.transaction_id}</TableCell>
              <TableCell>{row.amount/100 } INR</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell><TimeAgo datetime={row.created}/></TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>:"no payments made"}
    </Grid>
    </Paper>
    </div>
  )
}

export default Maintenance
