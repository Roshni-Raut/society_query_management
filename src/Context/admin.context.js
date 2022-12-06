import { collection,onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";

const AllProfileContext= createContext();

export const AllProfileProvider=({children})=>{
    const [profiles,setProfile]=useState([])
    const [queries,setQuery]=useState([])
    const [loading, setLoading]=useState(true)
    const [count,setCount]=useState([])
    const [line,setLine]=useState([])
    const [notifications,setNotificaitons]=useState()
    const [AllRequest,setAllRequest]=useState()
    const [eventRequestCount,setEventRequestCount]=useState()
    const [queryCount,setQueryCount]=useState()

    const formatDate = (dateString) => {
        dateString=dateString.toDate()
        const options = {year: 'numeric', month: 'long',day: 'numeric'}
        var date=new Intl.DateTimeFormat('en-US', options ).format(dateString)
        return date.toString()
      }

    useEffect(()=>{
        setLoading(true)
        /* Getting all the profiles*/ 
        const unsubProfile=onSnapshot(collection(db, "Profiles"),collection=>{
            setLoading(true);
            const p=[]
            collection.forEach(doc=>{
                p.push({...doc.data(),uid:doc.id})
            })
            setProfile(p) 
            setLoading(false);
        })
        
        /* Getting all the queries */     
        const unsubQuery=onSnapshot(collection(db, "Query"),(collection) => {
            setLoading(true);
           let q=[]
            collection.forEach((doc)=>{
                const arr=doc.data().queries
                let j=0;
                for( var i in arr){
                    arr[i].uid=doc.id;
                    q.push(arr[i])
                }
                setQueryCount(j);
                q.sort((a,b)=>{return b.createdAt - a.createdAt})
            })
            setQuery(q)
            
            /* counting status for barchart */
            var arr=[];
            arr[0]=q.filter((x)=> x.status==="pending").length;
            arr[1]=q.filter((x)=> x.status==="underwatch").length;
            arr[2]=q.filter((x)=> x.status==="done").length;
            arr[3]=q.filter((x)=> x.status==="rejected").length;
            setCount(arr);
        
                /* lines for linechart */
                var l=[]
                for(let i=1;i<4;i++){
                let l1={}
                q.filter(x=>x.priority===i).map(x=>{
                    if(!Object.keys(l1).includes(formatDate(x.createdAt)))
                        l1[formatDate(x.createdAt)]=1
                    else
                        l1[formatDate(x.createdAt)]+=1
                    return l1
                })
                l.push(l1)
            }
            setLine(l)
            setLoading(false);
        });

        /* Getting all the Notifications*/ 
        const unsubNotice=onSnapshot(collection(db, "Notifications"),collection=>{
            setLoading(true);
            const n=[]
            collection.forEach(doc=>{
                n.push(doc.data())
            })
            setNotificaitons(n)
            setLoading(false);
        })

        /*getting all event Requests */
        const unsubEventRequest=onSnapshot(collection(db, "EventRequest"),collection=>{
            setLoading(true);
            const n=[]
            let j=0;
            collection.forEach(doc=>{
                const n1=doc.data().requests;
                if(n1){
                    n1.forEach(data=>{
                        if(data.receiverHasRead===false)
                            ++j;
                        n.push({...data,id:doc.id})
                    })
                }
                n.sort((a,b)=>{return b.createdAt - a.createdAt})
            })
            setEventRequestCount(j);
            setAllRequest(n)
            setLoading(false);
        })

        /* getting payment count */
        setLoading(false)

        return()=>{
            unsubNotice();
            unsubProfile();
            unsubQuery();
            unsubEventRequest();
        }
    },[]);

    return <AllProfileContext.Provider value={{loading,profiles,queries,count,line,notifications,AllRequest,eventRequestCount}}>{children}</AllProfileContext.Provider>
}

export const useAllProfile=()=>useContext(AllProfileContext);
