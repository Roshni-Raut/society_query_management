import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const ProfileContext= createContext();

export const ProfileProvider=({children})=>{
    const [profile,setProfile]=useState(null)
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            if(user){
                const data={
                    name: user.name,
                    uid: user.uid,
                    email: user.email        
                }
                onSnapshot (doc(db, "Profiles", user.uid), (doc) => {
                    const userc=doc.data()
                    console.log("Profile.context: ",userc)
                });
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