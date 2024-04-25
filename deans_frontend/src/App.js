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
import AllocationManagement from './components/AllocationComponent'
const App = () => {
  return (
    <Router>
      

      {/* Routes configuration */}
      <Routes>
        {/* Route for the Home page */}
        <Route path='/' element={<Login/>} />
        {/* Route for the Dashboard page */}
        <Route path='/Dashboard' element={<Dashboard/>} />
        {/* Route for the Employee page */}
        <Route path='/Employee' element={<EmployeeComponent/>} />
        {/* Route for the Projectcode page */}
        <Route path='/pcode' element={<ProjectCodesComponent/>} />
        {/* Route for the Employye management page */}
        <Route path='/manage-employee' element={<EmployeeManagement/>} />
        {/* Route for the Pcode page */}
        <Route path='/manage-pcodes' element={<PCodeManagement/>} />
        {/* Route for the Allocation management page */}
        <Route path='/allocation' element={<AllocationManagement/>} />
        {/* Route test  page */}
        <Route path='/allocation2' element={<AllocationManagement/>} />
      </Routes>
    </Router>
  );
};

export default App;
