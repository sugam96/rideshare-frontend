import React from 'react'
import { NavBar } from './NavBar'
import { Outlet } from 'react-router-dom'

export const Admin = () => {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    )
}
