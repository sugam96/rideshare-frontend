import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SideBar } from './SideBar'

var driversTableRows = [];


export const Drivers = () => {
    const [tableReady, setTableReady] = useState(false);
    useEffect(() => {
        getRidersInfo()
    }, [driversTableRows, tableReady])

    async function getRidersInfo() {
        console.log('Getting Ride Info');
        const resp = await axios.get(`http://localhost:3050/GetRidesData`).then((res) => {
            if (res.data.status) {
                const Rides = res.data.Rides;
                const Riders = res.data.Riders;
                const Drivers = res.data.Drivers;
                setDriversTableRows(Drivers);
            }
            else
                console.log("Didnt Get Riders");
        })
            .catch(function (error) {
                console.log("Error");
            })
    }
    function setDriversTableRows(Drivers) {
        driversTableRows = [];
        Drivers.forEach((driver, index) => {
            driversTableRows.push(<tr key={'row' + (index + 1)}>
                <td >{driver._id}</td>
                <td>{driver.first_name}</td>
                <td>{driver.last_name}</td>
                <td>{driver.email_id}</td>
                <td>{driver.contact_number}</td>
                <td>{driver.date_of_birth}</td>
                <td>{driver.gender}</td>
                <td>{driver.licence}</td>
                <td>{driver.vehicle_name}</td>
                <td>{driver.vehicle_number}</td>
            </tr>)

        });
        setTableReady(true);
    }
    return (
        <div>
            <div className="container-fluid text-center px-0">
                <div className="row m-1 mt-0 ms-0">
                    <div className="col col-lg p-0">
                        <SideBar active={3} />
                    </div>
                    <div className="col col-lg-10 px-0">
                        <h2>Drivers</h2>
                        <table className="table table-striped border">
                            <thead>
                                <tr>
                                    <th scope="col">Driver ID</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Email ID</th>
                                    <th scope="col">Contact Number</th>
                                    <th scope="col">Date of Birth</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Licence</th>
                                    <th scope="col">Vehicle Name</th>
                                    <th scope="col">Vehicle Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driversTableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
