
import {  doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const CurrentProfileContext= createContext();

export const CurrentProfileProvider=({children})=>{
    const [profile,setProfile]=useState([])
    const [loading, setLoading]=useState(false)
    async function fetch(){
      /*
        const docRef = doc(db, "Profiles", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setProfile(docSnap.data())
        } else {
          console.log("No such document!");
        }*/
        
    }
    useEffect(()=>{
        setLoading(true);
        onSnapshot(doc(db, "Profiles", auth.currentUser.uid), (doc) => {
          setProfile(doc.data())
        });
        setLoading(false);
    },[]);

    return <CurrentProfileContext.Provider value={{loading,profile}}>{children}</CurrentProfileContext.Provider>
}
const CurrentQueryContext= createContext();

export const CurrentQueryProvider=({children})=>{
    const [query,setQuery]=useState([])
    const [loading, setLoading]=useState(false)

    async function fetch(){
        const docRef = doc(db, "Query", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setQuery(docSnap.data())
        } else {
          setQuery(null)
          console.log("No such document!");
        }
    }
    useEffect(()=>{
        setLoading(true);
        fetch()
        setLoading(false);
    },[]);

    return <CurrentQueryContext.Provider value={{loading,query}}>{children}</CurrentQueryContext.Provider>
}

export const useProfile=()=>useContext(CurrentProfileContext);
export const useQuery=()=>useContext(CurrentQueryContext);