import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = (props) => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark bg-light py-0 mb-3">
      <div className="container-fluid">
        <Link to="/UserLogin" className="navbar-brand" href="#">Ridelyy!</Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" aria-expanded="false">

          <div className='text-nowrap text-light'>{props.user.first_name}</div>
          {/* <img className='border border-dark rounded-circle w-25 h-25'></img> */}
        </button>

        <div className="collapse navbar-collapse text justify-content-end" >
          <ul className="navbar-nav mb-2 mb-lg-0 fs-5 fw-bold text-dark">
            <li className="nav-item">
              <Link to="/UserHome" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Ride</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="dropdown09" data-bs-toggle="dropdown" aria-expanded="false">{props.user.first_name}</a>
              <ul className="dropdown-menu" aria-labelledby="dropdown09">
                <li>
                  <Link to="/UserProfile" className="dropdown-item">Profile</Link></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">History</a></li>
                <li><Link to="/UserLogin" className="dropdown-item" onClick={()=>{window.location.reload()}}>Logout</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
