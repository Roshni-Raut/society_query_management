import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";

const AllProfileContext= createContext();

export const AllProfileProvider=({children})=>{
    const [profiles,setProfile]=useState([])
    const [queries,setQuery]=useState([])
    const [loading, setLoading]=useState(true)
    async function fetch(){
        const profileSnapshot = await getDocs(collection(db, "Profiles"));
        const p=[]
        profileSnapshot.forEach((doc) => {
            p.push(doc.data())
        });
        setProfile(p)

        const querySnapshot = await getDocs(collection(db, "Query"));
        const q=[]
        querySnapshot.forEach((doc) => {
            const arr=doc.data().queries
            for( var i in arr){
                arr[i].uid=doc.id;
                q.push(arr[i])
            }
            q.sort((a,b)=>{return b.createdAt - a.createdAt})
        });
        console.log(q)
        setQuery(q)
    }
    useEffect(()=>{
        setLoading(true);
        fetch()
        setLoading(false);
    },[]);

    return <AllProfileContext.Provider value={{loading,profiles,queries}}>{children}</AllProfileContext.Provider>
}

export const useAllProfile=()=>useContext(AllProfileContext);
