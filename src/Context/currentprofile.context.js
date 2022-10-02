
import {  doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const CurrentProfileContext= createContext();

export const CurrentProfileProvider=({children})=>{
    const [profile,setProfile]=useState([])
    const [queries,setQuery]=useState([])
    const [loading, setLoading]=useState(false)
    useEffect(()=>{
        setLoading(true);
        onSnapshot(doc(db, "Profiles", auth.currentUser.uid), (doc) => {
          setProfile(doc.data())
        });
        onSnapshot(doc(db, "Query", auth.currentUser.uid), (doc) => {
          const q=doc.data().queries;
          q.sort((a,b)=>{return b.createdAt - a.createdAt})
          setQuery(q)
        });
        setLoading(false);
    },[]);

    return <CurrentProfileContext.Provider value={{loading,profile,queries}}>{children}</CurrentProfileContext.Provider>
}
export const useProfile=()=>useContext(CurrentProfileContext);
