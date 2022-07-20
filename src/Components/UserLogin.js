import React from 'react'
import { Link } from 'react-router-dom'

export const UserLogin = () => {
    return (
        <div className='container formsContainer h-50'>
            <form className='h-100 p-4 text-light'>
                <h1 className="h3 mb-4 fw-normal">Sign in to Ride</h1>
                <div className="form-floating">
                    <input type="email" className="form-control text-light bg-dark" id="floatingInput" placeholder="name@example.com" />
                    <label for="floatingInput">Email Address</label>
                </div>
                <div className="form-floating ">
                    <input type="password" className="form-control text-light bg-dark" id="floatingPassword" placeholder="Password" />
                    <label for="floatingPassword">Password</label>
                </div>

                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary mb-4" type="submit">Sign in</button>
                <p>Don't have an account? Click to <Link to="/UserSignUp" className='text-light'>Register!</Link></p>
            </form>
        </div>
    )
}
