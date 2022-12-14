import { Details } from '@mui/icons-material'
import { Alert, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Time from 'react-time/lib/Time'
import { useAllProfile } from '../../../Context/admin.context'
import stripe from "../../../static/stripe.gif"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Container } from '@mui/system'
import { server_url } from '../../../firebase'

const MaintenanceA = () => {
  const [payments,setPayment]=useState([])
  const {profiles}=useAllProfile()
  const [unpaid,setunpaid]=useState(0);
  const [loading,setloading]=useState(true);
  const [message,setMessage]=useState()

  useEffect(() => {
    async function fetch(){
      try{
        await axios.post(server_url+"/Allpaymentlist").then((response)=>{
          setloading(true);
          console.log("reciveing : ",response.data.paymentIntents)
          const resPay=response.data.paymentIntents;
          var detail=[];
          var emails=[];
          resPay.map(ele=>{
            if(!emails.includes(ele.receipt_email))
              emails.push(ele.receipt_email)
          })
          console.log(emails)
          var j=0;
          profiles.forEach(p=>{
            var date=new Date()
            if(emails.includes(p.email)){
              resPay.filter((x,i)=>x.receipt_email===p.email).filter((x,i)=>i<1).map(ele=>{
                var date1=new Date(ele.created)
                const days=Math.floor((date-date1)/(1000*60*60*24))//1000*60 minutes
                if(days<31)
                  detail.push({flat:p.flatno,name:p.fname+" "+p.lname,amount:ele.amount,created:ele.created,status:'paid',description:ele.description})
                else{  
                  j++;  
                  detail.push({flat:p.flatno,name:p.fname+" "+p.lname,amount:ele.amount,created:ele.created,status:'unpaid',description:ele.description})
                }
              })
            }else{
              const days=Math.ceil((date-p.time.toDate())/(1000*60*60*24))//1000*60 minutes
              const amount=100000+100000*Math.floor(days/31);
              console.log(days,p.email)
              j++;
              var data={flat:p.flatno,name:p.fname+" "+p.lname,amount:amount,created:p.time.toDate(),status:'unpaid',description:'Monthly Maintenance'}
              detail.push(data);
            }
            setunpaid(j);
          })
          setPayment(detail)
          setloading(false);
        }) 
      }catch(error){
        console.log("error:"+error)
        setMessage(" Server is down!! try again later ")
      }
    }
    if(payments.length===0){
      fetch();
    }
    setloading(false)

  }, [])

  return (message?<Alert  variant="filled" severity="error" sx={{ minWidth: '220px' }}>{message}</Alert>:
    <div>
    
    <b>
    <span style={{color:"grey"}}>Unpaid count: </span><span>{unpaid}</span> &nbsp; &nbsp; 
    <span style={{color:"grey"}}>Paid count: </span><span>{profiles.length-unpaid}</span><br/></b>
      {/* Recent payments */}
      <Grid item xs={12}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Payment Details
    </Typography>
      <Table size="small">
        <TableHead>
          <TableRow >
            <TableCell sx={{fontWeight:"bold"}}>Flat</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Name</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Amount</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Status</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Description</TableCell>
            <TableCell sx={{fontWeight:"bold"}}>Last Payment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {payments.length>0 && payments.map((row,id) => (
            <TableRow key={id}>
              <TableCell>{row.flat}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.amount/100 } INR</TableCell>
              <TableCell>{row.status==='paid'?<span style={{color:'green'}}><CheckCircleOutlineIcon/>Paid</span>
              :<span style={{color:'red'}}><ErrorOutlineIcon/>unpaid</span>}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell><Time value={row.created} format='DD/MM/YYYY'/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
    <div style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
      <br/>
      <b>
      go to your stripe account for better view 
      </b>
      <Button type="button" href="https://dashboard.stripe.com/test/dashboard" target="_blank" >
        <img src={stripe} alt="stripe" height={40}/>
      </Button>
    </div>
    </div>
  )
}

export default MaintenanceA
