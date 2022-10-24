import * as React from 'react';
import { Avatar, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProfile } from '../../../Context/profile.context';
import { EditModal } from './EditModal';
import { doc, getDoc } from 'firebase/firestore';
import { color, db } from '../../../firebase';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Profiles({profiles,loading}) {
  const [anchorEl,setAnchorEl]=useState(null)
  const open=Boolean(anchorEl)
  const [uid,setUid]=useState(null)
  const [isOpenV,setOpenV]=useState(false)
  const [isOpenE,setOpenE]=useState(false)
  const [Profile,setProfile]=useState(null)

  function OpenV(){getProfile(); setOpenV(true)}
  function OpenE(){getProfile(); setOpenE(true)}

  function CloseV(){setOpenV(false); setUid(null); setProfile(null)}
  function CloseE(){setOpenE(false); setUid(null); setProfile(null)}

  async function getProfile(){ 
    const docRef= await getDoc(doc(db, "Profiles",uid));
    setProfile(docRef.data())
  }

  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'80vh'}}>
  <CircularProgress /> </Container>:
  <div>

    <table className="table table-hover text-center mt-2">
    <thead className='table-secondary'>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Flat no</th>
        <th scope="col">Email</th>
        <th scope="col">Gender</th>
        <th scope="col">Nationality</th>
        <th scope="col">#</th>
      </tr>
    </thead>
    <tbody>
      
      {profiles && profiles.map((x,i)=>(
        <tr key={i}>
        <th scope="row">{i+1}</th>
        <td>{x.fname+" "+x.mname+" "+x.lname}</td>
        <td>{x.flatno}</td>
        <td>{x.email}</td>
        <td>{x.gender}</td>
        <td>{x.nationality}</td>
        <td> 
          <IconButton onClick={(e)=>{setAnchorEl(e.currentTarget);setUid(x.uid)}} >
            <MoreVertIcon />
          </IconButton>
      </td>
      </tr>
      ))
      }
    </tbody>
  </table>
  <Menu
    id="long-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={()=>setAnchorEl(null)}
    >
        <MenuItem onClick={()=>{setAnchorEl(null); OpenV()} }>
         <RemoveRedEyeIcon color="action" sx={{marginRight:1}}/>  View
        </MenuItem>    
        <MenuItem onClick={()=>{setAnchorEl(null);OpenE()}}>
          <EditIcon color="action"sx={{marginRight:1}}/>Edit
        </MenuItem>
  </Menu>
  
  {/* view Modal */}
  <Dialog open={isOpenV} onClose={CloseV}>
      {Profile && 
      <DialogTitle>Profile: {`${Profile.fname} ${Profile.mname} ${Profile.lname}`}</DialogTitle>
      }
      <Divider color="black" sx={{borderWidth:1}}/>
      {Profile &&
        <DialogContent >
          <div style={{display:"flex",fontWeight:"bold", marginBottom:"10px"}}>
            <div style={{marginRight:"10px"}}>
              <Avatar src={Profile.avatarUrl} sx={{height:150,width:150}}/>
            </div>
                   
          <div>
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
          <EmailIcon color="action"/> 
            <span style={{fontWeight:"bold" }}> {Profile.email}</span>
            &nbsp; &nbsp; 
            <PhoneIcon color="action"/> 
            <span style={{fontWeight:"bold" }}>{Profile.phone}</span> , 
            <span style={{fontWeight:"bold" }}> {Profile.phone1}</span>
      </DialogContent>}
  </Dialog>
  
  {/*Edit Modal */}
  <EditModal isOpen={isOpenE} Close={CloseE} Profile={Profile}/>

  {/*Delete Modal */}

  </div>
  );
}
