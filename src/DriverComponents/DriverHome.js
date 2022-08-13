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
const defaultCenter = { lat: 43.62753436086227, lng: -79.67454080972676 };
const Libraries = ['places'];
let ridesArray = [];
let rideElement = <></>;

export const DriverHome = (props) => {
    const [ride, setRide] = useState({});
    const [center, setCenter] = useState(defaultCenter);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [repeat, setRepeat] = useState(true);
    const [acceptingRides, setAcceptingRides] = useState(true);
    const [gotRides, setGotRides] = useState(false);
    const [gotRide, setGotRide] = useState(false);
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: Libraries,
    })

    const [map, setMap] = useState(null);

    useEffect(() => {
        if (repeat)
            sendLocation();
        if (acceptingRides)
            getRides()
        const timer = setTimeout(() => setRepeat(true), 30000);
        return () => clearTimeout(timer);
    }, [repeat]);




    async function sendLocation() {
        setRepeat(false);
        //getLocation();
        console.log("Sending Driver Loc", { driver_id: props.driver.driver_id, location: center });
        const resp = await axios.post(`http://localhost:3050/DriverLocationUpdate`, { driver_id: props.driver.driver_id, location: center }).then((response) => {
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

    async function getRides() {
        console.log('Getting Rides');
        const resp = await axios.get(`http://localhost:3050/GetRides`, { driver_id: props.driver.driver_id }).then((response) => {
            if (response.data.status) {
                const rides = response.data.data;
                if (rides) {
                    setGotRides(true)
                    console.log("Got Rides", rides);
                    displayRideRequests(rides);
                }
            }
            else {
                console.log("Couldn't get Rides");
                console.log(response.data.message);
            }
        })
            .catch(function (error) {
                console.log("Something Wrong with GetRides");
                console.log(error);
            })

    }


    function displayRideRequests(rides) {
        console.log("Displaying Rides");
        ridesArray = [];
        rides.forEach((ride, index) => {
            ridesArray.push(<div className="bd-callout bd-callout-info p-2 text-start mb-4" id={"Ride" + (index + 1)}>
                <h5>Ride {index + 1}</h5>
                <div>
                    From: 67 Showboat Crescent, Brampton, ON, Canada
                    <br />
                    Drop at: {ride.to_location}
                </div>
                <div className='m-1'><button type="button" className="btn btn-outline-primary mx-3" onClick={() => { acceptRide(ride._id) }}>Accept</button>
                    <button type="button" className="btn btn-outline-danger mx-3">Ignore</button></div>
            </div>);
        });
        console.log("RA", ridesArray);

        //mapRef.current.fitBounds(bounds);
        //map.fitBounds(bounds);
        //recenter();

    }

    async function acceptRide(request_id) {
        console.log("Accepting Ride", request_id);
        setGotRide(true);

        const resp = await axios.post(`http://localhost:3050/RideAccept`, { request_id: request_id, driver_id: props.driver.driver_id, driver_location: center }).then((res) => {
            setRide(res.data.data);
            console.log("User", res.data.userData);
            if (res.data.status) {
                console.log("Ride Accepted", res.data.data);

                if (ride !== null) {
                    console.log("ride", ride);
                    setDestination(ride.from_location);
                    console.log(destination, ride.from_location);
                    calcRoute(center, res.data.data.from_location);
                    rideElement = (<div className="bd-callout bd-callout-info p-2 text-start mb-4">
                        <h5>Ride</h5>
                        <div>
                            Pickup : {res.data.userData.first_name} {res.data.userData.last_name}
                            <br />
                            From : 67 Showboat Crescent, Brampton, ON, Canada
                            <br />
                            Drop at : {res.data.data.to_location}
                        </div>
                    </div>);
                }

            }
            else {
                console.log("Ride Acceptance Failed");
                console.log(res.data.message);
            }
        })
            .catch(function (error) {
                console.log("Something Wrong with Ride Accepting");
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
    async function calcRoute(origin, destination) {
        clearRoute();
        console.log(origin);
        console.log(destination);
        if (origin === '' || destination === '' || destination === null) {
            console.log("No Values", originRef.current.value, destinationRef.current.value);
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: origin,
            destination: destination,
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
        <div><NavBar driver={props.driver} />
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
                <div className='p-4 mx-auto border border-primary border-opacity-50 border-2 controlsContainer'>
                    <div className="bd-callout bd-callout-info p-2 border border-info border-opacity-25">
                        <h5>Driving</h5>
                        <div className="form-control-lg form-check form-switch form-check-reverse px-auto text-start">
                            <input className="form-check-input m-0 text-start" type="checkbox" id="flexSwitchCheckReverse" checked/>
                            <label className="form-check-label" htmlFor="flexSwitchCheckReverse">Accepting Rides</label>
                        </div>
                    </div>

                    {acceptingRides && !gotRides && !gotRide && <div className="bd-callout bd-callout-info p-2 text-start mb-4">
                        <h5>Waiting for Riders</h5>
                        <div>
                            <p className="placeholder-glow">
                                <span className="placeholder col-7"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-6"></span>
                                <span className="placeholder col-8"></span>
                            </p>
                        </div>
                    </div>}
                    {acceptingRides && gotRides && !gotRide && ridesArray}
                    {gotRide && rideElement}
                </div>
            </div>
            <Footer /></div>
    )
}
