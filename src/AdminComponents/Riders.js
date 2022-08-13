import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SideBar } from './SideBar'



var ridersTableRows = [];
export const Riders = () => {
    const [tableReady, setTableReady] = useState(false);

    useEffect(() => {
        getRidersInfo()
    }, [tableReady, ridersTableRows])

    async function getRidersInfo() {
        console.log('Getting Ride Info');
        const resp = await axios.get(`http://localhost:3050/GetRidesData`).then((res) => {
            if (res.data.status) {
                const Rides = res.data.Rides;
                const Riders = res.data.Riders;
                const Drivers = res.data.Drivers;
                setRidersTableRows(Riders);
            }
            else
                console.log("Didnt Get Riders");
        })
            .catch(function (error) {
                console.log("Error");
            })
    }
    function setRidersTableRows(Riders) {
        ridersTableRows = [];
        Riders.forEach((rider, index) => {
            ridersTableRows.push(<tr key={'row' + (index + 1)}>
                <td >{rider._id}</td>
                <td>{rider.first_name}</td>
                <td>{rider.last_name}</td>
                <td>{rider.email_id}</td>
                <td>{rider.contact_number}</td>
                <td>{rider.date_of_birth}</td>
                <td>{rider.gender}</td>
            </tr>)

        });
        setTableReady(true);
    }

    return (
        <div>
            <div className="container-fluid text-center px-0">
                <div className="row m-1 mt-0 ms-0">
                    <div className="col col-lg p-0">
                        <SideBar active={2} />
                    </div>
                    <div className="col col-lg-10 px-0">
                        <h2>Riders</h2>
                        <table className="table table-striped border">
                            <thead>
                                <tr>
                                    <th scope="col">Rider ID</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Email ID</th>
                                    <th scope="col">Contact Number</th>
                                    <th scope="col">Date of Birth</th>
                                    <th scope="col">Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ridersTableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
