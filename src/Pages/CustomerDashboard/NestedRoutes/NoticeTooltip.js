import { Badge, CircularProgress, Container, Divider, IconButton, ListItem,Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useCurrentProfile } from '../../../Context/currentprofile.context';
import TimeAgo from 'timeago-react';

const NoticeTooltip = () => {
    const {loading,notice,unseenEvent,unseenNotice}=useCurrentProfile();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container>:
    <div >
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {notice.length===0?<MenuItem onClick={handleClose}>There are no notifications</MenuItem>:
      notice.filter((x,i)=>i<5).map((x,i)=>{
          return<div key={i} style={{maxWidth:'320px'}}>
                <ListItem key={i}>
                  
                   <Container>
                   <strong>{x.subject}</strong> : {x.msg}
                   <Typography variant="caption" display="block" textAlign="right" >
                   <TimeAgo
                   datetime={x.createdAt.toDate()}></TimeAgo>
                   </Typography>
                   </Container>
                  
                </ListItem>
                {i!==notice.length-1 && i!==4 && <Divider color="black"/>}
            </div>
      })
      }
      </Menu>
    <IconButton color="inherit" onClick={handleClick} >   
    {unseenNotice+unseenEvent!==0?<Badge badgeContent={unseenNotice+unseenEvent} color="primary"><NotificationsIcon/></Badge>:
      <NotificationsIcon/>}  
      </IconButton>
    </div>
  )
}

export default NoticeTooltip