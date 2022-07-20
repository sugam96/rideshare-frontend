import React from 'react'
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { MapComponent } from './MapComponent';
import { ActionItems } from './ActionItems';

export const UserHome = () => {
    return (
        <div><NavBar />
            <div className='container appContainer d-flex'>
                <MapComponent />
                <ActionItems />
            </div>
            <Footer /></div>
    )
}
