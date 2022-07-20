import logo from './logo.svg';
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


function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<><SiteHome forUser={true} /></>}>
            <Route path='' element={<><UserLogin /></>} />
            <Route path='UserLogin' element={<><UserLogin /></>} />
            <Route path='UserSignup' element={<><UserSignUp /></>} />
            <Route path='DriverLogin' element={<><DriverLogin /></>} />
            <Route path='DriverSignup' element={<><DriverSignUp /></>} />
          </Route>
          <Route path="UserHome" element={<UserHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
