import React, { useEffect, useRef, useState } from 'react'
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import sedanIcon from '../sedan.png';
import bookingIcon from '../booking.png';
import { Link } from 'react-router-dom';
import Credentials from '../Credentials'
//import markerIcon from "../marker-nobg.png";

const containerStyle = {
    width: '100%',
    height: '100%'
};
const divStyle = {
    background: '#f8f9fa'
};
const defaultCenter = { lat: 43.62744043195785, lng: -79.67452569998788 };
const Libraries = ['places'];

export const UserHome = () => {
    const [center, setCenter] = useState(defaultCenter);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: Credentials.GOOGLE_MAPS_API_KEY,
        libraries: Libraries,
    })

    const [map, setMap] = useState(null);

    useEffect(() => {
        getLocation();
        console.log()
    }, []);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
            console.log("getLoc")
        }
        else
            alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        originRef.current = center;
    }
    function printLoc() {
        console.log(destinationRef.current);
        originRef.current.value = center;
        console.log(originRef.current.value)
    }
    function preDefinedRoute(){
        console.log(destinationRef.current);
        destinationRef.current.value="Port Credit, Mississauga, ON, Canada";
        //calcRoute();
    }
    async function calcRoute() {
        clearRoute();
        originRef.current.value = center;
        console.log(destinationRef.current.value);
        console.log(originRef.current.value)
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            console.log("No Values", originRef.current.value, destinationRef.current.value);
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING
        })
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance);
        setDuration(results.routes[0].legs[0].duration);
        console.log(results.routes[0].legs[0].distance);
        console.log(results.routes[0].legs[0].duration);
    }
    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
    }

    if (!isLoaded) {
        console.log('Maps Loading');
        return <div>Maps Loading</div>
    }
    return (
        <div><NavBar />
            <div className='container-fluid appContainer d-flex'>
                <div className='container-xl p-0 m-0 MapStyle'>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={16}
                        options={{
                            zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false,
                        }}
                        onLoad={map => setMap(map)}
                    >
                        {!directionsResponse && <MarkerF position={center} label='R' />}
                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                        { /* Child components, such as markers, info windows, etc. */}
                        <></>
                    </GoogleMap>
                </div>
                <div className='p-5 mx-auto border border-primary border-opacity-50 border-2'>
                    <div className='flex-fill d-flex flex-column fs-4 actionItems'>
                        <div className='d-flex m-2 text-center'>
                            <Link to="/RideBooking" className='text-decoration-none text-black'><div className='d-flex flex-column flex-grow-1 bg-info bg-opacity-10 m-2 mx-4 p-2 px-4 rounded-2' style={divStyle}>
                                <div>Ride</div>
                                <img src={sedanIcon} alt="H" />
                            </div>
                            </Link>
                            <Link to="/RideBooking" className='text-decoration-none text-black'><div className='d-flex flex-column flex-grow-1 bg-info bg-opacity-10 m-2 mx-4 p-2 px-4 rounded-2'>
                                <div>Book</div><img src={bookingIcon} alt="H" />
                            </div></Link>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Where To?</span>
                            <Autocomplete restrictions={{ country: ["ca"] }} onPlaceChanged={calcRoute}><input className="form-control" placeholder="Where To?" ref={destinationRef} /></Autocomplete>
                        </div>
                        <button type="button" className="btn btn-outline-info text-dark m-1">Lambton College, Brunel Road</button>
                        <button type="button" className="btn btn-outline-info text-dark m-1">Port Credit, Mississauga, ON, Canada</button>

                    </div>
                    {directionsResponse && <div className='RideInfoContainer'>
                        <div className="bd-callout bd-callout-info p-2">
                            <h5>Trip Info</h5>
                            <div>Distance: {distance.text}, Duration: {duration.text}
                            <br />
                            Cost: ${((distance.value / 1000) + (duration.value / 60)).toFixed(2)}</div>
                        </div>

                        <div>

                        </div>
                        <div className="bd-callout bd-callout-info p-1">
                            <h6>Payment Method</h6> <div>Credit Card Ending with **1234</div>
                        </div>
                        <div className='d-flex justify-content-around'>
                        <button type="button" className="btn btn-lg btn-primary m-1">Confirm Ride</button>
                        <button type="button" className="btn btn-lg btn-primary m-1">Ride Later</button>
                        </div>

                    </div>}
                </div>
            </div>
            <Footer /></div>
    )
}
