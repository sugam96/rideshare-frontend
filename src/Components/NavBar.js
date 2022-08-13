import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = (props) => {
  const forUser = props.forUser;
  let altLink;
  if (forUser) {
    altLink = <Link to="/DriverLogin" className="nav-link active" onClick={() => { props.setForUser(false) }}>For Drivers</Link>
  }
  else {
    altLink = <Link to="/UserLogin" className="nav-link active" onClick={() => { props.setForUser(true) }}>For Riders</Link>
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5 py-1">
      <div className="container-fluid">
        <Link to="/UserHome" className="navbar-brand" >Ridelyy!</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Help</a>
            </li>
          </ul>
          <form className="d-flex m-auto" role="search">
            <input className="form-control form-control-sm me-2" type="search" placeholder="Where To?" aria-label="Search" />
            <button className="btn btn-sm btn-outline-light" type="submit">Go</button>
          </form>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              {altLink}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
