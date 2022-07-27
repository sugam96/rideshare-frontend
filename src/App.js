import logo from './logo.svg';
import React, { useEffect, useState } from 'react'
import './App.css';
import { SiteHome } from './Components/SiteHome';
import { UserHome } from './UserComponents/UserHome';
import { UserLogin } from './Components/UserLogin';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { UserSignUp } from './Components/UserSignUp';
import { DriverLogin } from './Components/DriverLogin';
import { DriverSignUp } from './Components/DriverSignUp';
import { RideBooking } from './UserComponents/RideBooking';
import { NewHome } from './UserComponents/NewHome';



function App() {
  const [user, setUser] = useState({});
  const loginUser = (email, userid) => {
    console.log(email, userid);
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<><SiteHome forUser={true} /></>}>
            <Route path='' element={<><UserLogin /></>} />
            <Route path='UserLogin' element={<><UserLogin loginUser={loginUser} /></>} />
            <Route path='UserSignup' element={<><UserSignUp /></>} />
            <Route path='DriverLogin' element={<><DriverLogin /></>} />
            <Route path='DriverSignup' element={<><DriverSignUp /></>} />
          </Route>
          <Route path='NewHome' element={<NewHome/>}/>
          <Route path="UserHome" element={<UserHome />} />
          <Route path="RideBooking" element={< RideBooking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
