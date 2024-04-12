/*import React from 'react';
import axios from 'axios';
import EmployeeComponent from './components/EmployeeComponent'; 
import Login from './components/LoginPage';
function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}*/
// App.js

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/LoginPage';
import EmployeeComponent from './components/EmployeeComponent'
import ProjectCodesComponent from './components/PcodeComponent'
import EmployeeManagement from './components/ManageEmployeeComponent'
import PCodeManagement from './components/ManagePcodeComponenet'
const App = () => {
  return (
    <Router>
      

      {/* Routes configuration */}
      <Routes>
        {/* Route for the Home page */}
        <Route path='/' element={<Login/>} />

        {/* Route for the About page */}
        <Route path='/Dashboard' element={<Dashboard/>} />
        {/* Route for the About page */}
        <Route path='/Employee' element={<EmployeeComponent/>} />
        {/* Route for the About page */}
        <Route path='/pcode' element={<ProjectCodesComponent/>} />
        {/* Route for the About page */}
        <Route path='/manage-employee' element={<EmployeeManagement/>} />
        {/* Route for the About page */}
        <Route path='/manage-pcodes' element={<PCodeManagement/>} />
      </Routes>
    </Router>
  );
};

export default App;
