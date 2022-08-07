import React from 'react'
import { NavBar } from '../Components/NavBar'
import { Outlet } from 'react-router-dom'

export const SiteHome = (props) => {
  return (
    <div className='siteHomeBody'>
      <NavBar forUser={props.forUser} setForUser={props.setForUser}/>
      <Outlet />
    </div>
  )
}
