import React from 'react'
import { Link } from 'react-router-dom'

export const UserSignUp = () => {
  return (
    <div className='container formsContainer'>
            <form className='h-100 p-4 text-light'>
                <h1 className="h3 mb-4 fw-normal">Register With Us!</h1>

                <div className="form-floating">
                    <input type="text" className="form-control text-light bg-dark" id="floatingInput" placeholder="Sugam" />
                    <label for="floatingInput">First Name</label>
                </div>
                <div className="form-floating">
                    <input type="text" className="form-control text-light bg-dark" id="floatingInput" placeholder="Sharma" />
                    <label for="floatingInput">Last Name</label>
                </div>
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
                        <input type="checkbox" value="remember-me" /> I Agree with the Terms and Conditions
                    </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary mb-4" type="submit">Sign Up</button>
                <p>Already have an account? Click to <Link to="/UserLogin" className='text-light'>Log In</Link></p>
            </form>
        </div>
  )
}
