import React from 'react'
import { NavBar } from '../Components/NavBar'
import { Outlet } from 'react-router-dom'

export const SiteHome = () => {
  return (
    <div className='siteHomeBody'>
      <NavBar forUser={true} />
      <Outlet />
    </div>
  )
}
