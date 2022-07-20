import React from 'react'
import sedanIcon from '../sedan.png'
import bookingIcon from '../booking.png'

const divStyle = {
  background: '#f8f9fa'
};
export const ActionItems = () => {
  return (
    <div className='flex-fill d-flex flex-column fs-4 actionItems'>
      <div className='d-flex justify-content-between m-2 text-center'>
        <div className='d-flex flex-column flex-grow-1 bg-light m-2 mx-4 p-2 px-4 rounded-2' style={divStyle}>
          <div>Ride</div>
          <img src={sedanIcon} alt="H" />
        </div>
        <div className='d-flex flex-column flex-grow-1 bg-light m-2 mx-4 p-2 px-4 rounded-2'>
          <div>Book</div><img src={bookingIcon} alt="H" />
        </div>
      </div>
      <div className='bg-light m-4 mb-1 p-2 rounded-2'>Where To</div>
      <div className='bg-light p-1 m-1 mx-4 rounded-2'>Lambton College</div>
      <div className='bg-light p-1 m-1 mx-4 rounded-2'>Square One</div>

    </div>
  )
}
