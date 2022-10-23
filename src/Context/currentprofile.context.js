
import {  doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const CurrentProfileContext= createContext();

export const CurrentProfileProvider=({children})=>{
    const [profile,setProfile]=useState([])
    const [queries,setQuery]=useState([])
    const [notice,setNotice]=useState([])
    const [loading, setLoading]=useState(false)
    const [count,setCount]=useState()

    
    useEffect(()=>{
      setLoading(true)
      const unsubProfiles=onSnapshot(doc(db, "Profiles", auth.currentUser.uid), (doc) => {
        setLoading(true);
        setProfile(doc.data())
        setLoading(false);
      });
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
      const unsubNotifications=onSnapshot(doc(db, "Notifications", auth.currentUser.uid), (doc) => {
        setLoading(true);
        const n=doc.data().notifications;
        n.sort((a,b)=>{return b.createdAt - a.createdAt})
        setNotice(n)
        setLoading(false);
      });
      setLoading(false)
      return()=>{
        unsubQuery();
        unsubProfiles();
        unsubNotifications();
      }
    },[]);

    return <CurrentProfileContext.Provider value={{loading,profile,queries,count,notice}}>{children}</CurrentProfileContext.Provider>
}
export const useProfile=()=>useContext(CurrentProfileContext);
