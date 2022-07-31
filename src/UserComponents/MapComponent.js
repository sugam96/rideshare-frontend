import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};
const center = { lat: 43.62744043195785, lng: -79.67452569998788 }

export const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey12: 'AIzaSyDN9x9CrKsjdt8MIe8op4LMukjT-zPA9mw'
  })

  const [map, setMap] = useState(null);

  if (!isLoaded) {
    console.log('Maps Loading');
    return <div>Maps Loading</div>
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
  }

  useEffect(() => {
    getLocation();

  })

  return (
    <div className='container-xl MapStyle'>
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
  )
}
