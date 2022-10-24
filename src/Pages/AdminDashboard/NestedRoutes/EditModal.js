import { Avatar, Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { color } from '../../../firebase'

export const EditModal = ({isOpen,Open,Close,Profile}) => {
  return (
      <Dialog open={isOpen} onClose={Close}>
  {Profile && 
      <DialogTitle>Profile: {`${Profile.fname} ${Profile.mname} ${Profile.lname}`}</DialogTitle>
      }
  {Profile &&
        <DialogContent >
          <div style={{display:"flex",fontWeight:"bold", marginBottom:"10px"}}>
            <div style={{marginRight:"10px"}}>
              <Avatar src={Profile.avatarUrl} sx={{height:150,width:150}}/>
            </div>
            
       
          <div>
          <span style={{color:"grey"}}>display name: </span>
            <span style={{color:color}}>{`${Profile.fname} ${Profile.mname} ${Profile.lname}`}</span><br/>
              <span style={{color:"grey"}}>Gender: </span>
            <span style={{color:color}}>{Profile.gender}</span>
            &nbsp; &nbsp; 
            <span style={{color:"grey"}}>Nationality: </span>
            <span style={{color:color}}>{Profile.nationality}</span><br/>
            <span style={{color:"grey"}}>Adhaar: </span>
            <span style={{color:color}}>{Profile.adhaar}</span>
              &nbsp; &nbsp; 
            <span style={{color:"grey"}}>DOB: </span>
            <span style={{color:color}}>{Profile.dob}</span><br/>

            <span style={{color:"grey"}}>Flat no: </span>
            <span style={{color:color}}>{Profile.flatno}</span>
            &nbsp; &nbsp; 
            <span style={{color:"grey"}}>Family members: </span>
            <span style={{color:color}}>{Profile.fmember}</span><br/>

            <span style={{color:"grey"}}>Profession: </span>
            <span style={{color:color}}>{Profile.profession}</span><br/>
            

            {Profile.owner&&<div> Owner Details <br/>
              <span style={{color:"grey"}}>Owner name: </span>
              <span style={{color:color}}>{Profile.owner.name}</span><br/>

              <span style={{color:"grey"}}>Owner Email: </span>
              <span style={{color:color}}>{Profile.owner.email}</span><br/>

              <span style={{color:"grey"}}>Owner phone: </span>
              <span style={{color:color}}>{Profile.owner.contact}</span><br/>
            </div>}
            
          </div>
          </div>
            <span style={{fontWeight:"bold" }}> {Profile.email}</span>
            &nbsp; &nbsp; 
            <span style={{fontWeight:"bold" }}>{Profile.phone}</span> , 
            <span style={{fontWeight:"bold" }}> {Profile.phone1}</span>
      </DialogContent>}
</Dialog>
  )
}
