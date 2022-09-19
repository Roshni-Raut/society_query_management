import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";

const AllProfileContext= createContext();

export const AllProfileProvider=({children})=>{
    const [profiles,setProfile]=useState([])
    const [loading, setLoading]=useState(true)
    async function fetch(){
        const querySnapshot = await getDocs(collection(db, "Profiles"));
        const p=[]
        querySnapshot.forEach((doc) => {
            p.push(doc.data())
        });
        setProfile(p)
        setLoading(false);
    }
    useEffect(()=>{
        setLoading(true);
        fetch()
    },[]);

    return <AllProfileContext.Provider value={{loading,profiles}}>{children}</AllProfileContext.Provider>
}

export const useAllProfile=()=>useContext(AllProfileContext);
const CurrentQueryContext= createContext();

const CurrentQueryProvider=({children})=>{
    const [profiles,setQuery]=useState([])
    const [loading, setLoading]=useState(true)

    async function fetch(){
        const querySnapshot = await getDocs(collection(db, "Query"));
        const q=[]
        querySnapshot.forEach((doc) => {
            q.push(doc.data())
        });
        setQuery(q)
    }
    useEffect(()=>{
        setLoading(true);
        fetch()
        setLoading(false);
    },[]);

    return <CurrentQueryContext.Provider value={{loading,profiles}}>{children}</CurrentQueryContext.Provider>
}
