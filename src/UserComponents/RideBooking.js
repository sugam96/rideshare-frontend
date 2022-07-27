import React from 'react'
import { NavBar } from './NavBar'

export const RideBooking = () => {
    return (
        <div>
            <NavBar />
            <div className='container my-4'>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Pick Up</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Drop Off</span>
                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                </div>
            </div>
        </div>
    )
}
