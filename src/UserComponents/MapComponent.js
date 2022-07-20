import React from 'react'
import { GoogleMap, useJsApiLoader} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};
const center={lat:43.62744043195785, lng:-79.67452569998788}

export const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey12: 'AIzaSyDN9x9CrKsjdt8MIe8op4LMukjT-zPA9mw'
  })

  if (!isLoaded) {
    console.log('Maps Loading');
    return <div>Maps Loading</div>
  }

  return (
    <div className='container MapStyle flex-fill '>
      <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          <></>
        </GoogleMap>
    </div>
  )
}
