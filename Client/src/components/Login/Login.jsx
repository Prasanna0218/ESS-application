import React, { useState } from "react";
import "./Login.css";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  let [email,setEmail]=useState("");
  let [password,setPassword]=useState("");
  let navigate=useNavigate();
  //handlesubmit to send datas to backend
  let handlesubmit=(event)=>{
    event.preventDefault();
    axios.post("http://localhost:3000/ess/login",{
      email,password
    },{withCredentials:true})
    .then(res=>{
      if(res.data.valid)
      {
        navigate('/leaverequest')
      }
      else{
        alert("Enter the Valid credentials!");
        navigate('/');
      }
    })
    .catch(err=>{
      alert("Enter the Valid Credentials!")
    })
    setEmail("");
    setPassword("");
  }  
  let [isPasswordShown,setIsPasswordShown]=useState(false);
  
  let toggleshown=()=>{
    setIsPasswordShown(!isPasswordShown);
  }

  return (
    <div className="login-container">
      <h2 className="form-title">Login</h2>

      <form className="login-form" onSubmit={handlesubmit}>
        <div className="input-wrapper">
        <input type="email" placeholder="Email" className="input-field" onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
        <i className="material-symbols-outlined">mail</i>
        </div>
        <div className="input-wrapper">
        <input type={isPasswordShown?"text":"password"} placeholder="Password" value={password} className="input-field" onChange={(e)=>{setPassword(e.target.value)}}/>
        <i className="material-symbols-outlined">lock</i>
        <i className="material-symbols-outlined eye-icon cursor" style={{display :password?"flex":"none"}} onClick={toggleshown}>{isPasswordShown?"visibility":"visibility_off"}
        </i>
        </div>
        <div>
          <p className="forgot-password">Forgot Password ?</p>
        </div>
        <button type="submit" className="login-button">
            Login
        </button>
      </form>
    </div>
  );
};

export default Login;
