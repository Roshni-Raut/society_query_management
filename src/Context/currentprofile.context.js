
import {   doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const CurrentProfileContext= createContext();

export const CurrentProfileProvider=({children})=>{
    const [profile,setProfile]=useState([])
    const [queries,setQuery]=useState([])
    const [notice,setNotice]=useState([])
    const [eRequest,setERequest]=useState([])
    const [noticeall,setNoticeAll]=useState([])
    const [loading, setLoading]=useState(false)
    const [count,setCount]=useState()
    const [unseenNotice,setUnseenNotice]=useState(0)
    const [unseenEvent,setUnseenEvent]=useState(0)
    
    useEffect(()=>{
      setLoading(true)
      const unsubProfiles=onSnapshot(doc(db, "Profiles", auth.currentUser.uid), (doc) => {
        setLoading(true);
        setProfile(doc.data())
        setLoading(false);
      });

      //fetching all queries 
      const unsubQuery=onSnapshot(doc(db, "Query", auth.currentUser.uid), (doc) => {
        setLoading(true);
        const q=doc.data().queries;
        q.sort((a,b)=>{return b.createdAt - a.createdAt})
        setQuery(q)
        var arr=[];
          arr[0]=q.filter((x)=> x.status==="pending").length;
          arr[1]=q.filter((x)=> x.status==="underwatch").length;
          arr[2]=q.filter((x)=> x.status==="done").length;
          arr[3]=q.filter((x)=> x.status==="rejected").length;
          setCount(arr);
          setLoading(false);
      });
      // Fetching all Notification 
      const unsubNotifications=onSnapshot(doc(db, "Notifications",auth.currentUser.uid ),(doc) => {
            const n=doc.data().notifications;
            console.log(doc.data().notifications)
            n.sort((a,b)=>{return b.createdAt - a.createdAt})
            setNotice(n)
            var j=0;
            for(var i=0;i<n.length;i++){
              if(n[i].receiverHasRead===false)
                j++;
            }
            setUnseenNotice(j);
      });
      const unsubNotification=onSnapshot(doc(db, "Notifications", 'all'), (doc) => {
        const n=doc.data().notifications;
            n.sort((a,b)=>{return b.createdAt - a.createdAt})
            setNoticeAll(n)
            var j=0;
            for(var i=0;i<n.length;i++){
              if(n[i].receiverHasRead===false)
                j++;
            }
            setUnseenEvent(j);
      });

      //fetching all event requests
      const unsubEventRequest=onSnapshot(doc(db, "EventRequest",auth.currentUser.uid ),(doc) => {
        const n=doc.data().requests;
        n.sort((a,b)=>{return b.createdAt - a.createdAt})
        setERequest(n)
        console.log(eRequest)
        var j=0;
        for(var i=0;i<n.length;i++){
          if(n[i].receiverHasRead===false)
            j++;
        }
        //setUnseenNotice(j);
  });
      setLoading(false)
      return()=>{
        unsubQuery();
        unsubProfiles();
        unsubNotifications();
        unsubNotification();
        unsubEventRequest();
      }
    },[]);

    return <CurrentProfileContext.Provider value={{loading,profile,queries,count,notice,unseenEvent,unseenNotice,noticeall,eRequest}}>{children}</CurrentProfileContext.Provider>
}
export const useCurrentProfile=()=>useContext(CurrentProfileContext);
