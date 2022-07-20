import React from 'react'

export const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light rounded py-0 mb-3">
      <div className="container-fluid">
        <a className="navbar-brand fs-2 fw-bold" href="#">Ridelyy!</a>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" aria-expanded="false">

          <div className='text-nowrap text-dark'>Project 69</div>
          {/* <img className='border border-dark rounded-circle w-25 h-25'></img> */}
        </button>

        <div className="collapse navbar-collapse text justify-content-end" >
          <ul className="navbar-nav mb-2 mb-lg-0 fs-5 fw-bold text-dark">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Ride</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="dropdown09" data-bs-toggle="dropdown" aria-expanded="false">Project 69</a>
              <ul className="dropdown-menu" aria-labelledby="dropdown09">
                <li><a className="dropdown-item" href="#">Account</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">History</a></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
