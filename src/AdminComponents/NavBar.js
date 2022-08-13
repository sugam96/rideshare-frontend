import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-light py-0">
      <div className="container-fluid">
        <Link to="/UserLogin" className="navbar-brand ps-3" href="#">Ridelyy!</Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" aria-expanded="false">

          <div className='text-nowrap text-light'>Admin</div>
          {/* <img className='border border-dark rounded-circle w-25 h-25'></img> */}
        </button>

        <div className="collapse navbar-collapse text justify-content-end" >
          <ul className="navbar-nav mb-2 mb-lg-0 fs-5 fw-bold text-dark">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="dropdown09" data-bs-toggle="dropdown" aria-expanded="false">Admin</a>
              <ul className="dropdown-menu" aria-labelledby="dropdown09">
                <li><Link to="/" className="dropdown-item" onClick={() => { window.location.reload() }}>Logout</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
