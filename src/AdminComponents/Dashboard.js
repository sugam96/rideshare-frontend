import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { SideBar } from './SideBar';

const containerStyle = {
    width: '100%',
    height: '100%'
};
let driverMarkers = [];
let setBoundsInterval;
let ridesTableRows = [];

const defaultCenter = { lat: 43.62741427122924, lng: -79.67455770792768 };
const Libraries = ['places'];

export const Dashboard = () => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: Libraries,
    })
    var bounds = "";
    const [tableReady, setTableReady] = useState(false);
    const [center, setCenter] = useState(defaultCenter);
    const [map, setMap] = useState(null);
    const [gotDrivers, setGotDrivers] = useState(false);


    useEffect(() => {
        getRidesInfo();
        if (!gotDrivers && isLoaded)
            getDrivers();
        if (map !== null && bounds !== "") {
            console.log("Recentering");
            map.fitBounds(bounds);
            map.setCenter(bounds.getCenter())
        }
    }, [isLoaded, gotDrivers, map, bounds, tableReady])


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

    async function getRidesInfo() {
        console.log('Getting Ride Info');
        const resp = await axios.get(`http://localhost:3050/GetRidesData`).then((res) => {
            if (res.data.status) {
                const Rides = res.data.Rides;
                const Riders = res.data.Riders;
                const Drivers = res.data.Drivers;
                setRidesTableRows(Rides);
            }
            else
                console.log("Didnt Get Drivers");
        })
            .catch(function (error) {
                return 0;
            })
    }

    function setRidesTableRows(Rides) {
        ridesTableRows = [];
        Rides.forEach((ride, index) => {
            ridesTableRows.push(<tr key={'row' + (index + 1)}>
                <td >{ride.dateTime_of_ride}</td>
                <td>{ride.driver_id}</td>
                <td>{ride.user_id}</td>
                <td>{ride.from_location}</td>
                <td>{ride.to_location}</td>
                <td>{ride.status}</td>
            </tr>)

        });
        setTableReady(true);
    }
    function setDriverMarkers(drivers) {
        console.log("Setting Driver Markers");
        // eslint-disable-next-line no-undef
        bounds = new google.maps.LatLngBounds();
        //bounds.extend(center);
        driverMarkers = [];
        drivers.forEach((driver, index) => {
            bounds.extend(driver.location);
            driverMarkers.push(<MarkerF position={driver.location} label={"D" + (index + 1)} key={"Driver" + (index + 1)} />);
        });

        //mapRef.current.fitBounds(bounds);
        //map.fitBounds(bounds);
        map.fitBounds(bounds);
        map.setCenter(bounds.getCenter())
        //recenter();

    }

    return (
        <div>
            <div className="container-fluid text-center px-0">
                <div className="row m-1 mt-0 ms-0">
                    <div className="col col-lg p-0">
                        <SideBar active={1} />
                    </div>
                    <div className="col col-lg-10 px-0">
                        <div style={{ height: 500 }}>
                            {!isLoaded && <div>
                                <h5>Loading Maps</h5>
                                <div>
                                    <p className="placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                    <p className="placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                    <p className="placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                    <p className="placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                    <p className="placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                </div>
                            </div>}
                            {isLoaded && <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={16}
                                options={{
                                    zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false,
                                }}
                                onLoad={map => setMap(map)}
                            >
                                {driverMarkers}
                                <></>
                            </GoogleMap>}
                        </div>
                        <div><table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Date Time</th>
                                    <th scope="col">Driver ID</th>
                                    <th scope="col">User ID</th>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ridesTableRows}
                            </tbody>
                        </table></div>
                    </div>
                </div>
            </div></div>
    )
}
