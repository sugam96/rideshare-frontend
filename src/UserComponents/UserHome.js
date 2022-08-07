import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import sedanIcon from '../sedan.png';
import bookingIcon from '../booking.png';
import { Link } from 'react-router-dom';
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
let driverMarkers = [];

export const UserHome = (props) => {
    const timeNow = new Date(Date.now());
    const mapRef = useRef(null);
    var bounds = "";
    const [center, setCenter] = useState(defaultCenter);
    const [gotCenter, setGotCenter] = useState(false);
    const [gotDrivers, setGotDrivers] = useState(false);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
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
    const onLoad = React.useCallback(function callback(map) {
        getLocation();
        getDrivers();
        setMap(map)
    }, [])

    useEffect(() => {
        if (!gotCenter)
            getLocation();
        if (!gotDrivers && isLoaded)
            getDrivers();

    }, [isLoaded, gotCenter, gotDrivers, driverMarkers]);


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
            setGotCenter(true);
        }
        else
            alert("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        originRef.current = center;
    }

    function setDriverMarkers(drivers) {
        console.log("Setting Driver Markers");
        // eslint-disable-next-line no-undef
        bounds = new google.maps.LatLngBounds();
        bounds.extend(center);
        driverMarkers = [];
        drivers.forEach((driver, index) => {
            bounds.extend(driver.location);
            driverMarkers.push(<MarkerF position={driver.location} label={"D" + (index + 1)} key={"Driver" + (index + 1)} />);
        });

        //mapRef.current.fitBounds(bounds);
        //map.fitBounds(bounds);
        //recenter();

    }
    async function getDrivers() {
        console.log('Getting Drivers');
        const resp = await axios.get(`http://localhost:3050/Drivers`).then((res) => {
            if (res.data.status) {
                const drivers = res.data.data;
                if (drivers) {
                    setGotDrivers(true);
                    setDriverMarkers(drivers);
                }
            }
            else
                console.log("Didnt Get Drivers");
        })
            .catch(function (error) {
                return 0;
            })
    }

    function printLoc() {
        console.log(destinationRef.current);
        originRef.current.value = center;
        console.log(originRef.current.value)
    }
    function preDefinedRoute() {
        console.log(destinationRef.current.value);
        destinationRef.current.value = "Port Credit, Mississauga, ON, Canada";
        calcRoute();
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
        console.log(results);
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
    function timeCalc(duration, delay) {
        let hours = (new Date(Date.now() + (duration.value * 1000))).getHours();
        let minutes = (new Date(Date.now() + (duration.value * 1000) + delay * 60 * 1000)).getUTCMinutes();
        if (hours > 12)
            hours = hours - 12;
        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes
        return (hours + ":" + minutes);
    }
    function requestRide() {
        console.log("Requesting Ride");
    }

    if (!isLoaded) {
        console.log('Maps Loading');
        return <div>Maps Loading</div>
    }
    return (
        <div><NavBar user={props.user} />
            <div className='container-fluid appContainer d-flex'>
                <div className='container-xl p-0 m-0 MapStyle'>
                    <GoogleMap
                        ref={mapRef}
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={16}
                        options={{
                            zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false,
                        }}
                        onLoad={onLoad}
                    //onLoad={map => setMap(map)}
                    >
                        {!directionsResponse && <MarkerF position={center} label='R' />}

                        {!directionsResponse && driverMarkers}
                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                        { /* Child components, such as markers, info windows, etc. */}
                        <></>
                    </GoogleMap>
                </div>
                <div className='p-5 pb-4 mx-auto border border-primary border-opacity-50 border-2'>
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
                        <button type="button" className="btn btn-outline-info text-dark m-1" onClick={preDefinedRoute}>Port Credit, Mississauga, ON, Canada</button>

                    </div>
                    {!directionsResponse && <div className='RideInfoContainer'>
                        <div className="bd-callout bd-callout-info p-2 border border-info border-opacity-25">
                            <h5>Trip Info</h5>
                            <div>Distance: {distance.text}, Duration: {duration.text}
                            </div>
                        </div>

                        <div className="bd-callout bd-callout-info p-2 text-start mb-4">
                            <h5>Rapid Ride</h5>
                            <div>8 Minutes Away | Arrive By: {timeCalc(duration, 8)}
                                <br />
                                Cost: ${((distance.value / 1000) + (duration.value / 60)).toFixed(2)}</div>
                        </div>
                        <Link to="/PaymentMethods" className='text-reset text-decoration-none'>
                            <button type="button" className="btn btn-outline-info text-dark rounded-0 m-2 mt-3"><h6>Payment Method</h6> <div>Credit Card Ending with **1234</div></button>
                        </Link>
                        <div className='d-flex justify-content-around mt-3'>
                            <button type="button" className="btn btn-lg btn-primary m-1" onClick={requestRide}>Confirm Ride</button>
                            <button type="button" className="btn btn-lg btn-primary m-1">Ride Later</button>
                        </div>

                    </div>}
                </div>
            </div>
            <Footer /></div>
    )
}
