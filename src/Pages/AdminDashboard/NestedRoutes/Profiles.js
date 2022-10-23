import * as React from 'react';
import { useAllProfile } from '../../../Context/admin.context';
import { CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Profiles({profiles,loading}) {
  const [anchorEl,setAnchorEl]=useState(null)
  const open=Boolean(anchorEl)

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
        <th scope="col">Family member</th>
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
        <td>{x.fmember}</td>
        <td> 
          <IconButton onClick={(e)=>setAnchorEl(e.currentTarget)} >
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
        <MenuItem onClick={()=>setAnchorEl(null)}>
         <RemoveRedEyeIcon color="action" sx={{marginRight:1}}/>  View
        </MenuItem>    
        <MenuItem onClick={()=>setAnchorEl(null)}>
          <EditIcon color="action"sx={{marginRight:1}}/>Edit
        </MenuItem>
        <MenuItem onClick={()=>setAnchorEl(null)}>
          <DeleteIcon color="action"sx={{marginRight:1}}/>Delete
        </MenuItem>
  </Menu>
  </div>
  );
}
