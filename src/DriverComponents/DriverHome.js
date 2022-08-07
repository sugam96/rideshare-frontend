import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

import { NavBar } from './NavBar';
import { Footer } from './Footer';
//import markerIcon from "../marker-nobg.png";

const containerStyle = {
    width: '100%',
    height: '100%'
};
const divStyle = {
    background: '#f8f9fa'
};
const defaultCenter = { lat: 43.72281802489056, lng: -79.80858478198073 };
const Libraries = ['places'];

export const DriverHome = (props) => {
    const [center, setCenter] = useState(defaultCenter);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [repeat, setRepeat] = useState(true)
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey12: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: Libraries,
    })

    const [map, setMap] = useState(null);

    useEffect(() => {
        if (repeat)
            sendLocation();
        const timer = setTimeout(() => setRepeat(true), 30000);
        return () => clearTimeout(timer);
    }, [repeat]);

    async function sendLocation() {
        setRepeat(false);
        //getLocation();
        console.log("Sending Driver Loc", { driver_id: props.driver_id, location: center });
        const resp = await axios.post(`http://localhost:3050/DriverLocationUpdate`, { driver_id: props.driver_id, location: center }).then((response) => {
            if (response.data.status) {
                console.log("Driver Loc Updated");
            }
            else {
                console.log("Driver Loc Not Updated");
                console.log(response.data.message);
            }
        })
            .catch(function (error) {
                console.log("Something Wrong with DriverLocUpdate");
                console.log(error);
            })
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else
            alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        originRef.current = center;
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
        <div><NavBar user_id={props.user_id} />
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
                        {!directionsResponse && <MarkerF position={center} label='D' />}
                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                        { /* Child components, such as markers, info windows, etc. */}
                        <></>
                    </GoogleMap>
                </div>
                <div className='p-5 mx-auto border border-primary border-opacity-50 border-2 controlsContainer'>
                    <div>
                        <div class="form-check form-switch form-check-reverse">
                            <input class="form-check-input" type="checkbox" role="switch"/>
                                <label class="form-check-label" for="flexSwitchCheckDefault">Start Driving</label>
                        </div>
                    </div>
                    {directionsResponse && <div className='RideInfoContainer'>
                        <div className="bd-callout bd-callout-info p-2">
                            <h5>Trip Info</h5>
                            <div>Distance: {distance.text}, Duration: {duration.text}
                                <br />
                                Cost: ${((distance.value / 1000) + (duration.value / 60)).toFixed(2)}</div>
                        </div>

                        <div>
                            Rides Info Here
                        </div>
                        <Link to="/PaymentMethods" className='text-reset text-decoration-none'>
                            <button type="button" className="btn btn-outline-info text-dark rounded-0 m-2"><h6>Payment Method</h6> <div>Credit Card Ending with **1234</div></button>
                        </Link>
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
