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
let driverElement = <></>;

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
    const [rideScreen, setRideScreen] = useState(false);
    const [rideBookingScreen, setRideBookingScreen] = useState(false)
    const [rideWaitingScreen, setRideWaitingScreen] = useState(false);
    const [gotRide, setGotRide] = useState(false);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
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
        setOrigin(center);
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


    function preDefinedRoute() {
        console.log(destinationRef.current.value);
        destinationRef.current.value = "Port Credit, Mississauga, ON, Canada";
        calcRoute(center, destinationRef.current.value);
    }
    async function calcRoute(origin, destination) {
        clearRoute();
        console.log(origin);
        console.log(destination)
        if (origin === '' || origin === null || destination === '' || destination === null) {
            console.log("No Values", origin, destination);
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
    async function requestRide() {
        setDestination(destinationRef.current.value);
        console.log("Requesting Ride");
        console.log("From", origin);
        console.log("To " + destination);
        setRideScreen(true);
        setRideWaitingScreen(true);
        const resp = await axios.post(`http://localhost:3050/RideRequest`, { user_id: props.user.user_id, from_location: '67 Showboat Crescent, Brampton, ON, Canada', to_location: destinationRef.current.value }).then((res) => {
            if (res.data.status) {
                //console.log(res.data.ride_data);
                //console.log(res.data.driver_data);
                const ride_data = res.data.ride_data;
                const driver_data = res.data.driver_data;
                driverElement = (<div className="bd-callout bd-callout-info p-2 text-start mb-4">
                    <h5>Driver Information</h5>
                    <div>
                        <span className="fw-semibold">{driver_data.first_name} {driver_data.last_name} </span>
                        will arrive shortly.
                        <br />
                        Vehicle Name: <span className="fw-semibold">{driver_data.vehicle_name}</span>
                        <br />
                        Vehicle Number: <span className="fw-semibold">{driver_data.vehicle_number}</span>
                    </div>
                </div>)
                setRideWaitingScreen(false);
                driverRoute(driver_data);
                
            }
            else
                console.log(res.data.message);

        })
            .catch(function (error) {
                return 0;
            })
    }

    async function driverRoute(driver_data){
        const locResp = axios.get(`http://localhost:3050/DriverLocation`, { driver_id: driver_data._id }).then((res) => {
                    if (res.data.status) {
                        const driverLoc = res.data.data;
                        console.log(driverLoc);
                        if (driverLoc) {
                            calcRoute(driverLoc, center);
                        }
                    }
                    else
                        console.log("Didnt Get Driver Location");
                })
                    .catch(function (error) {
                        return 0;
                    })
    }

    if (!isLoaded) {
        console.log('Maps Loading');
        return <div>Maps Loading</div>
    }
    return (
        <div><NavBar user={props.user} />
            <div className='container-fluid appContainer d-flex p-auto'>
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
                {!rideScreen && !rideBookingScreen && <div className='p-4 mx-1 border border-primary border-opacity-50 border-2'>
                    <div className='flex-fill d-flex flex-column fs-4 actionItems'>
                        <div className='d-flex m-2 text-center'>
                            <Link to="/UserHome" className='text-decoration-none text-black' onClick={()=>{setRideBookingScreen(true)}}><div className='d-flex flex-column flex-grow-1 bg-info bg-opacity-10 m-2 mx-4 p-2 px-4 rounded-2' style={divStyle}>
                                <div>Ride</div>
                                <img src={sedanIcon} alt="H" />
                            </div>
                            </Link>
                            <Link to="/UserHome" className='text-decoration-none text-black'><div className='d-flex flex-column flex-grow-1 bg-info bg-opacity-10 m-2 mx-4 p-2 px-4 rounded-2'>
                                <div>Book</div><img src={bookingIcon} alt="H" />
                            </div></Link>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Where To?</span>
                            <Autocomplete restrictions={{ country: ["ca"] }} onPlaceChanged={() => { calcRoute(center, destinationRef.current.value) }}><input className="form-control" placeholder="Where To?" ref={destinationRef} /></Autocomplete>
                        </div>
                        <button type="button" className="btn btn-outline-info text-dark m-1">Lambton College, Brunel Road</button>
                        <button type="button" className="btn btn-outline-info text-dark m-1" onClick={preDefinedRoute}>Port Credit, Mississauga, ON, Canada</button>

                    </div>
                    {directionsResponse && <div className='RideInfoContainer'>
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
                </div>}
                {rideScreen && !rideBookingScreen && <div className='w-25 p-3 pb-4 mx-auto border border-primary border-opacity-50 border-2'>
                    <div className="bd-callout bd-callout-info p-2 border border-info border-opacity-25">
                        <h5>Ride Information</h5>
                        <div className='text-start'>
                            From: 67 Showboat Crescent, Brampton, ON, Canada
                            {/* From: {origin.lat},{origin.lng} */}
                            <br />
                            To: {destination}
                            <br />
                            Distance: {distance.text}, Duration: {duration.text}
                            <br />
                            Cost: ${((distance.value / 1000) + (duration.value / 60)).toFixed(2)}
                        </div>
                    </div>
                    {rideWaitingScreen && <div className="bd-callout bd-callout-info p-2 text-start mb-4">
                        <h5>Requesting Ride</h5>
                        <div>
                            Waiting for Drivers
                            <p className="placeholder-glow">
                                <span className="placeholder col-7"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-6"></span>
                                <span className="placeholder col-8"></span>
                            </p>
                        </div>
                        <div className='text-center'><button type="button" className="btn btn-outline-danger">Cancel</button></div>
                    </div>}
                    {!rideWaitingScreen && driverElement}
                </div>}
                {!rideScreen && rideBookingScreen && <div className='p-4 mx-1 border border-primary border-opacity-50 border-2'>
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
                            <Autocomplete restrictions={{ country: ["ca"] }} onPlaceChanged={() => { calcRoute(center, destinationRef.current.value) }}><input className="form-control" placeholder="Where To?" ref={originRef} /></Autocomplete>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Where To?</span>
                            <Autocomplete restrictions={{ country: ["ca"] }} onPlaceChanged={() => { calcRoute(center, destinationRef.current.value) }}><input className="form-control" placeholder="Where To?" ref={destinationRef} /></Autocomplete>
                        </div>
                        <button type="button" className="btn btn-outline-info text-dark m-1">Lambton College, Brunel Road</button>
                        <button type="button" className="btn btn-outline-info text-dark m-1" onClick={preDefinedRoute}>Port Credit, Mississauga, ON, Canada</button>

                    </div>
                    {directionsResponse && <div className='RideInfoContainer'>
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
                </div>}
            </div>
            </div>
    )
}
