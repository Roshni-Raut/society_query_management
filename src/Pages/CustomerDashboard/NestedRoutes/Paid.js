import { CardContent, Typography } from '@mui/material'
import React from 'react'
import successimg from '../../../static/success.gif'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export const Paid = ({status}) => {
    const formatDate = (date) => {
        date=new Date(date)
            const options = {year: 'numeric', month: 'long',day: 'numeric'}
            var date1=new Intl.DateTimeFormat('en-US', options ).format(date)
            return date1.toString()
      }

  return (
    <CardContent sx={{display:"flex",justifyContent:"center",minWidth:"400px",p:2}}>
    <div style={{textAlign:"center"}}>
    <img src={successimg} alt=" not found" height={175}/>
    <Typography variant="h5" gutterBottom>Payment Successful</Typography>

    <Typography variant="h6" gutterBottom>
    <span style={{color:"grey",}}>Transaction ID <br/></span>
    {status.transaction_id}
    </Typography>

    <Typography variant="h6" gutterBottom>
    <span style={{color:"grey"}}>Amount Paid<br/></span>
    <CurrencyRupeeIcon/>{status.amount}
    </Typography>

    <Typography variant="caption" gutterBottom>
    <span style={{color:"grey"}}>Date<br/></span>
    {formatDate(status.date)    }
    </Typography>
    </div>
    </CardContent>
  )
}
