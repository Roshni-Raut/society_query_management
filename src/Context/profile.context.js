import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { admin, auth, db } from "../firebase";

const ProfileContext= createContext();

export const ProfileProvider=({children})=>{
    const [profile,setProfile]=useState(null)
    const [loading, setLoading]=useState(true)
    
    useEffect(()=>{
        setLoading(true);
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
    },[])
    return <ProfileContext.Provider value={{loading,profile}}>{children}</ProfileContext.Provider>
}

export const useProfile=()=>useContext(ProfileContext)