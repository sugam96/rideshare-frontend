import logo from './logo.svg';
import React, { useEffect, useState } from 'react'
import './App.css';
import { SiteHome } from './Components/SiteHome';

import { UserLogin } from './Components/UserLogin';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { UserSignUp } from './Components/UserSignUp';
import { DriverLogin } from './Components/DriverLogin';
import { DriverSignUp } from './Components/DriverSignUp';

// Importing User Components
import { UserHome } from './UserComponents/UserHome';
import { RideBooking } from './UserComponents/RideBooking';
import { PaymentMethods } from './UserComponents/PaymentMethods'
import { UserProfile } from './UserComponents/UserProfile'
// Importing Driver Components
import { DriverHome } from './DriverComponents/DriverHome'
import { DriverProfile } from './DriverComponents/DriverProfile'



function App(props) {
  const [user, setUser] = useState({});
  const [forUser, setForUser] = useState(true);
  const [driver, setDriver] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [driverLoggedIn, setDriverLoggedIn] = useState(false);

  const loginUser = (email, userid, firstname) => {
    setUser({ user_id: userid, email_id: email, first_name: firstname });
    setUserLoggedIn(true);
  }
  const loginDriver = (email, driverid, firstname) => {
    setDriver({ driver_id: driverid, email_id: email, first_name: firstname });
    setDriverLoggedIn(true);
  }

  useEffect(() => {
  }, []);

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<><SiteHome forUser={forUser} setForUser={setForUser} /></>}>
            <Route path='' element={<UserLogin loginUser={loginUser} />} />
            <Route path='UserLogin' element={<UserLogin loginUser={loginUser} />} />
            <Route path='UserSignup' element={<><UserSignUp /></>} />
            <Route path='DriverLogin' element={<DriverLogin loginDriver={loginDriver} />} />
            <Route path='DriverSignup' element={<><DriverSignUp /></>} />
          </Route>

          {/* User Routes */}
          <Route path="UserHome" element={userLoggedIn ? <UserHome user={user} /> : <Navigate to="/UserLogin" />} />
          <Route path="UserProfile" element={userLoggedIn ? <UserProfile user={user} /> : <Navigate to="/UserLogin" />} />
          <Route path="PaymentMethods" element={<PaymentMethods />} />
          <Route path="RideBooking" element={< RideBooking />} />

          {/* Driver Routes */}
          <Route path="DriverHome" element={driverLoggedIn ? <DriverHome driver_id={driver.driver_id} /> : <Navigate to="/DriverLogin" />} />
          <Route path="DriverProfile" element={driverLoggedIn ? <DriverProfile driver_id={driver.driver_id} /> : <Navigate to="/DriverLogin" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
