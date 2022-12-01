import React from 'react';
import {CardElement,useStripe,useElements} from '@stripe/react-stripe-js';
import { Button, CardActions, CircularProgress, Container, Typography} from '@mui/material';
import { auth, color, server_url} from '../../../firebase';
import Snackbars from '../../Common/Snackbars'
import {useProfile} from '../../../Context/profile.context'
import {useCurrentProfile} from '../../../Context/currentprofile.context'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import axios from 'axios'
import { Paid } from './Paid';

const CARD_OPTIONS={
  iconStyle:"solid",
  style:{
    base:{
      fontSize:"18px",
      fontWeight:550,
    },
    invalid:{
      iconColor:"red",
      color:"red"
    }
  }
}

export const CheckoutForm = ({days}) => {
  const {error,success,setError,setSuccess}= useProfile();
  const {loading,profile}=useCurrentProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [status,setStatus]=useState([]);
  const stripe=useStripe();
  const elements=useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {error,paymentMethod}=await stripe.createPaymentMethod({
      type:"card",
      card: elements.getElement(CardElement)
    })
    
    if(!error){
      try{
        setIsLoading(true)
        const {id}=paymentMethod
        const response =await axios.post(server_url+"/payment",{
            amount:100000+1000*100*(Math.floor(days/31)),
            id,
            email: auth.currentUser.email,
        })

        if(response.data.success){
          setSuccess("Payment Received")

          setStatus([{
            transaction_id: response.data.transaction_id,
            date: response.data.date,
            amount:response.data.amount,
          }])
        }
      }catch(error){
        setError(`${error.message}: Try again later`)
        console.log("error")
      }
    }else{
      console.log("error")
      setError(error.message)
    }
    setIsLoading(false)
  };

  return (isLoading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'40vh'}}>
  <CircularProgress />
</Container>:status.length===0?
    <form onSubmit={handleSubmit}>
      <Snackbars error={error} success={success}/>
      <Typography variant="subtitle1" gutterBottom>
      <span style={{color:"grey",}}>Name: </span>
       {auth.currentUser.displayName}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
      <span style={{color:"grey",}}>Email: </span>
       {auth.currentUser.email}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
      <span style={{color:"grey",}}>Phone: </span>
       {profile.phone}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
      <span style={{color:"grey",}}>Amount: </span>
        <CurrencyRupeeIcon sx={{height:"18px" ,mr:-1}}/>{1000+1000*(Math.floor(days/31))}<br/>
      </Typography>
      
      <span style={{margin:2,mb:3}}> <CardElement options={CARD_OPTIONS}/> </span>

      <CardActions>

      <Button type="submit" size="small" disabled={!stripe || !elements} sx={{backgroundColor:color}} variant="contained">
        Pay Now <SendIcon style={{height:"17px"}}/>
      </Button>
      <br/>
  
      </CardActions>
    </form>:
    <Paid status={status[0]}/>
  );
};