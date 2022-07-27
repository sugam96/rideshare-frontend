import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useState } from 'react'
import { NavBar } from './NavBar'


const containerStyle = {
    width: '100%',
    height: '100%'
};
const center = { lat: 43.62744043195785, lng: -79.67452569998788 }

export const NewHome = () => {
    const [map, setMap] = useState(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey12: 'AIzaSyDN9x9CrKsjdt8MIe8op4LMukjT-zPA9mw'
    })
    if (!isLoaded) {
        console.log('Maps Loading');
        return <div>Maps Loading</div>
    }

    return (
        <div>
            <NavBar />
            <div className='container'>
                <div className='container'>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={16}
                        options={{
                            zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false,
                        }}
                        onLoad={map => setMap(map)}
                    >
                        <Marker position={center} />
                        { /* Child components, such as markers, info windows, etc. */}
                        <></>
                    </GoogleMap>
                </div>
                
            </div>

        </div>
    )
}
