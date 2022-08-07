import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom'

export const DriverLogin = (props) => {
    const [driver, setDriver] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [errorClass, setErrorClass] = useState("alert alert-danger p-2 collapse")


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage("Email Can't be Blank");
            setErrorClass("alert alert-danger p-2");
        }
        else if (!password) {
            setErrorMessage("Password Can't be Blank");
            setErrorClass("alert alert-danger p-2");
        }
        else {
            getDriver();
        }
    };

    async function getDriver() {
        console.log("Getting Driver");
        const resp = await axios.post(`http://localhost:3050/DriverLogin`, { email_id: email, password: password }).then((response) => {
            if (response.data.status) {
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
            console.log('No Response From Server');
        else {
            props.loginDriver(email, resp.driverid, resp.firstname);
            setDriver({ driverid: resp.driverid });
        }
    }
    useEffect(() => {
        if (typeof (driver.driverid) != "undefined") {
            console.log(driver.driverid, 'Checking')
            setRedirect(true)
        }

    }, [driver.driverid])


    return (
        <div className='container formsContainer h-50'>
            {redirect && (<Navigate to="/DriverHome" replace={true} />)}
            <form className='h-100 p-4 text-light' onSubmit={handleSubmit}>
                <h1 className="h3 mb-4 fw-normal">Sign in to Drive</h1>
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
                <p>Don't have an account? Click to <Link to="/DriverSignUp" className='text-light'>Register!</Link></p>
            </form>
        </div>
    )
}
