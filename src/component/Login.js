//import React from 'react'
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
    const host = "http://localhost:5000"
    const [credentials, setCredentials] = useState({email:"", password:""});
    let navigate = useNavigate()
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },           
            body: JSON.stringify({email :credentials.email, password: credentials.password}) 
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
              localStorage.setItem('token', json.authtoken);  
              navigate('/')
              props.showAlert("Logged in successfully", "success")
          }else{
              props.showAlert(`${json.error}`, "danger")
          }
    }

    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }


  return (
    <form onSubmit={handleSubmit}>
        <h3 className="my-3">Login to myNoteBook</h3>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value = {credentials.email} onChange={onChange} name = "email" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value = {credentials.password} onChange={onChange} name="password" id="password"/>
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
    </form>
  )
}
