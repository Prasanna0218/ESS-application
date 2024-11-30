import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import {Outlet,Navigate} from "react-router-dom"

const ProtectedRoute = () => {
    let [auth,setAuth]=useState(null);
    useEffect(()=>{
        let validateauthetication=()=>{
            axios.get("http://localhost:3000/validate",{withCredentials:true})
        .then(res=>{
            let {valid}=res.data;
            setAuth(valid);
        })
        .catch(err=>{setAuth(false)})
        }
        validateauthetication();
        const intervalId = setInterval(validateauthetication, 30000);
        return () => clearInterval(intervalId);
    },[])
    if(auth===null)
    {
        return <h2>Loading...</h2>
    }
    if(!auth){
        return <Navigate to="/" />
    }
  return <Outlet/>
}

export default ProtectedRoute