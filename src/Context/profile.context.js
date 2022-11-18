import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import {  auth, db } from "../firebase";

const ProfileContext= createContext();

export const ProfileProvider=({children})=>{
    const [profile,setProfile]=useState(null)
    const [loading, setLoading]=useState(true)
    const [isOpen,setOpen]=useState(false)
    const [success,setSuc]=useState("")
    const [error,setErr]= useState("")
    const [events,setEvents]=useState("")

    const setSuccess=(msg)=>{
        setSuc(msg)
        setTimeout(()=>{setSuc("")},6000)
    }
    const setError=(msg)=>{
        setErr(msg)
        setTimeout(()=>{setErr("")},6000)
    }
    const Close=()=>{
        setOpen(false)
    }
    const Open=()=>{
        setOpen(true)
    }
    
    useEffect(()=>{
        setLoading(true);
    
        /* Getting all the Events*/ 
      const unsubevent=onSnapshot(collection(db, "Events"),collection=>{
        setLoading(true);
        const e=[]
        collection.forEach(doc=>{
            e.push({...doc.data(),start:doc.data().start.toDate(),end:doc.data().end.toDate(),id:doc.id})
        })
        e.sort((a,b)=>a.start-b.start)
        setEvents(e) 
        setLoading(false);
    })
        onAuthStateChanged(auth, async(user) => {
            if(user){
                console.log(user.email)
                const data={
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email        
                }
                setProfile(data);
                setLoading(false);
            }
            else{
                setProfile(null);
                setLoading(false);
            }
        });
        return()=>{
            unsubevent();
        }
    },[])
    return <ProfileContext.Provider value={{loading,profile,"OpenVar":{isOpen,Open,Close},success,error,setSuccess,setError,events}}>{children}</ProfileContext.Provider>
}

export const useProfile=()=>useContext(ProfileContext)


