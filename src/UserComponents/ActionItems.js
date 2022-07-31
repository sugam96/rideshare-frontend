import React from 'react'
import { Link } from 'react-router-dom';
import { Autocomplete } from '@react-google-maps/api';
import sedanIcon from '../sedan.png'
import bookingIcon from '../booking.png'

const divStyle = {
  background: '#f8f9fa'
};
export const ActionItems = (props) => {

  const setDest=(e) =>{
    console.log(e.getPlace());
  }

  return (
    <div className='flex-fill d-flex flex-column fs-4 actionItems'>
      <div className='d-flex m-2 text-center'>
        <Link to="/RideBooking" className='text-decoration-none text-black'><div className='d-flex flex-column flex-grow-1 bg-light m-2 mx-4 p-2 px-4 rounded-2' style={divStyle}>
          <div>Ride</div>
          <img src={sedanIcon} alt="H" />
        </div>
        </Link>
        <Link to="/RideBooking" className='text-decoration-none text-black'><div className='d-flex flex-column flex-grow-1 bg-light m-2 mx-4 p-2 px-4 rounded-2'>
          <div>Book</div><img src={bookingIcon} alt="H" />
        </div></Link>
      </div>

      <Autocomplete restrictions={{ country: ["ca"] }} ><input type="email" className="form-control bg-dark text-light" id="email" placeholder="Where To?" ref={props.destiantionRef} onBlur={setDest()}/></Autocomplete>
      <label htmlFor="floatingInput" className='text-light'>Where To?</label>

      <div className='bg-light p-1 m-1 mx-4 rounded-2'>Lambton College</div>
      <div className='bg-light p-1 m-1 mx-4 rounded-2'>Square One</div>
    </div>
  )
}
