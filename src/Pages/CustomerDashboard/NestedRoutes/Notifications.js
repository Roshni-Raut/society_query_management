import { CircularProgress, Container, Divider, MenuItem, Paper, Typography } from '@mui/material';
import React from 'react'
import { useCurrentProfile } from '../../../Context/currentprofile.context';
import TimeAgo from 'timeago-react';
import { Pages } from '@mui/icons-material';
import { useEffect } from 'react';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

export const Notifications = () => {
  const {loading,notice,unseenEvent,unseenNotice,noticeall}=useCurrentProfile();
  async function update(){
    const notice1= (await getDoc(doc(db,"Notifications",auth.currentUser.uid))).data().notifications
    const notice2=(await getDoc(doc(db,"Notifications","all"))).data().notifications
    console.log(notice1)
    try{

      notice2.forEach(async(ele) => {
        await updateDoc(doc(db,"Notifications","all"),{
          "notifications":arrayRemove(ele)
        });
        if(!ele.receiverHasRead){
          ele.receiverHasRead=true;
        console.log(ele)
      }
      await updateDoc(doc(db,"Notifications","all"),{
        "notifications":arrayUnion(ele)
      });
    });
  }catch(error){
    console.log(error)
  }
    notice1.forEach(async(ele) => {
      await updateDoc(doc(db,"Notifications",auth.currentUser.uid),{
        "notifications":arrayRemove(ele)
      });
      if(!ele.receiverHasRead)
        ele.receiverHasRead=true;
      await updateDoc(doc(db,"Notifications",auth.currentUser.uid),{
        "notifications":arrayUnion(ele)
      })
    });
  }

  useEffect(()=>{
    if(unseenNotice+unseenEvent>0)
      update();
  },[])
  
  return (loading?<Container sx={{display:'flex',justifyContent:'center', alignItems:'center',height:'100vh'}}>
  <CircularProgress />
</Container>:<Paper sx={{p:2}}>

    <div style={{display:'flex'}}>
      <div>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Notifications
    </Typography>
    {notice.length===0?<MenuItem>There are no notifications</MenuItem>:
      notice.map((x,i)=>{
        return<div key={i}>    
                   <Container>
                   <strong>{x.subject}</strong> <br/>{x.msg}
                   <Typography variant="caption" display="block" textAlign="right" >
                   <TimeAgo
                   datetime={x.createdAt.toDate()}></TimeAgo>
                   </Typography>
                   </Container>
                {i!==notice.length-1 && <Divider color="black"/>}
            </div>
      })}
        </div>
        <div style={{mr:2}}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Event Notifications
        </Typography>
      {noticeall.length===0?<MenuItem>There are no Events</MenuItem>:
      noticeall.map((x,i)=>{
        return<div key={i}>    
                   <Container>
                   <strong>{x.subject}</strong> <br/>{x.msg}
                   <Typography variant="caption" display="block" textAlign="right" >
                   <TimeAgo
                   datetime={x.createdAt.toDate()}></TimeAgo>
                   </Typography>
                   </Container>
                {i!==noticeall.length-1 && <Divider color="black"/>}
            </div>
      })}
      </div>
                   </div>
      </Paper>
  )
}
