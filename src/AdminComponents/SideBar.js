import React from 'react'
import { Link } from 'react-router-dom';

const h95vh = {
    'minHeight': '92vh'
}
const navLink = "nav-link text-light";
const navLinkActive = "nav-link active";

export const SideBar = (props) => {
    return (
        <div><div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark w-100 h-100 text-start mt-0" style={h95vh}>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/Admin/Dashboard" className={(props.active === 1) ? navLinkActive : navLink}>Dashboard</Link>
                </li>
                <li>
                    <Link to="/Admin/Riders" className={(props.active === 2) ? navLinkActive : navLink}>Riders</Link>
                </li>
                <li>
                    <Link to="/Admin/Drivers" className={(props.active === 3) ? navLinkActive : navLink}>Drivers</Link>
                </li>
            </ul>
        </div></div>
    )
}
