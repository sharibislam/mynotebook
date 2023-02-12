import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {

    const host = "http://localhost:5000"
    const [credentials, setCredentials] = useState({name: "", email:"", password:""});    
    let navigate = useNavigate()
    const handleSubmit = async (e) =>{        
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },           
            body: JSON.stringify({name, email, password}) 
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
              localStorage.setItem('token', json.authtoken);  
              navigate('/')
              props.showAlert("User created successfully", "success")
          }else{
            props.showAlert(`${json.error}`, "danger")
          }
    }

    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <form onSubmit={handleSubmit}>
        <h3 className="my-3">Create an account to access myNoteBook</h3>
        <div className="mb-1">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="name" className="form-control" id="name"  name = "name" onChange={onChange} />
        </div>
        <div className="mb-1">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email"  name = "email"   onChange={onChange} aria-describedby="emailHelp" minLength={5} required/>
        </div>        
        <div className="mb-1">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control"  name="password" onChange={onChange}  id="password" minLength={5} required/>
        </div>
        {/* <div className="mb-1">
            <label htmlFor="password" className="form-label">Confirm password</label>
            <input type="password" className="form-control"  name="confirmpassword"  onChange={onChange} id="confirmpassword"/>
        </div> */}
        <div className="mb-1">
            <button type="submit" className="btn btn-primary" >Submit</button>
        </div>        
    </form>
  )
}

export default Signup
