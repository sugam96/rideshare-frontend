import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom'

export const UserLogin = (props) => {
    const [user, setUser] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [errorClass, setErrorClass] = useState("alert alert-danger p-2 collapse")


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email)
            alert("Email can't be Blank");
        else if (!password)
            alert("Password can't be Blank");
        else {
            getUser();
        }
    };

    async function getUser() {
        const resp = await axios.post(`http://localhost:3050/UserLogin`, { email_id: email, password: password }).then((response) => {
            if (response.data.valid) {
                setErrorMessage("");
                setErrorClass("alert alert-danger p-2 collapse");
                return response.data;
            }
            else {
                setErrorMessage(response.data.message);
                setErrorClass("alert alert-danger p-2");
                return false
            }
        })
            .catch(function (error) {
                console.log(error);
                setErrorMessage("Can't Reach Server");
                setErrorClass("alert alert-danger p-2");
                return false;
            })
        if (!resp)
            console.log('no');
        else
            {
                props.loginUser(email, resp.userid, resp.firstname);
                setUser({ userid: resp.userid });
            }
    }
    useEffect(() => {
        if (typeof (user.userid) != "undefined")
            {
                console.log(user.userid,'Checking')
                setRedirect(true)              
            }

    },[user.userid])

    return (
        <div className='container formsContainer h-50'>
            {redirect && (<Navigate to="/UserHome" replace={true} />)}
            <form className='h-100 p-4 text-light' onSubmit={handleSubmit}>
                <h1 className="h3 mb-4 fw-normal">Sign in to Ride</h1>
                <div className={errorClass} role="alert" id="errorAlertUserLogin">
                    {errorMessage}
                </div>
                <div className="form-floating">
                    <input type="email" className="form-control text-light bg-dark" id="email" placeholder="name@example.com" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <label htmlFor="floatingInput">Email Address</label>
                </div>
                <div className="form-floating ">
                    <input type="password" className="form-control text-light bg-dark" id="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary mb-4" type="submit">Sign In</button>
                <p>Don't have an account? Click to <Link to="/UserSignUp" className='text-light'>Register!</Link></p>
            </form>
        </div>
    )


}
