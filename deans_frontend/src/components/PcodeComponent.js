import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, FormControl, Select, InputLabel, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ProjectCodesComponent() {
  const [projectName, setProjectName] = useState('');
  const [projectCodes, setProjectCodes] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); 

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/get_project_codes?project_name=${projectName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project codes');
      }
      const data = await response.json();
      setProjectCodes(data);
    } catch (error) {
      console.error('Error fetching project codes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLocationFilterChange = (event) => {
    setLocationFilter(event.target.value);
  };
  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleManagePcodes = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        // If token is not available, handle accordingly (e.g., redirect to login)
        console.error('Token not found');
        return;
      }
  
      // Call the API endpoint for token validation
      const response = await fetch('http://127.0.0.1:5003/validate_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
  
      if (response.ok) {
        // Parse the response JSON
        const data = await response.json();
        
        // Check if role is equal to '2'
        if (data.role === '2') {
          // Role is '2', navigate to '/manage-employee' route
          navigate('/manage-employee');
        } else {
          // Role is not '2', handle accordingly (e.g., display an error message)
          console.error('User does not have access to manage employees');
        }
      } else {
        // Token validation failed, handle accordingly (e.g., redirect to login)
        console.error('Token validation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project Codes
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* Pushes the following items to the right */}
          <Button color="inherit" onClick={handleDashboard}>DASHBOARD</Button>
          <Button color="inherit" onClick={handleManagePcodes}>Manage Pcodes</Button>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mx: 2 }}>
        <Box>
          <TextField
            label="Enter Project Name"
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ ml: 2 }}>Search</Button>
        </Box>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="location-filter-label">Filter by Location</InputLabel>
          <Select
            labelId="location-filter-label"
            id="location-filter"
            value={locationFilter}
            onChange={handleLocationFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Bangalore">Bangalore</MenuItem>
            <MenuItem value="Mumbai">Mumbai</MenuItem>
            <MenuItem value="Delhi">Delhi</MenuItem>
            <MenuItem value="Hyderabad">Hyderabad</MenuItem>
            <MenuItem value="Pune">Pune</MenuItem>
            <MenuItem value="Noida">Noida</MenuItem>
            <MenuItem value="Chennai">Chennai</MenuItem>
            <MenuItem value="Kolkata">Kolkata</MenuItem>
            <MenuItem value="Coimbatore">Coimbatore</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="project codes table">
          <TableHead>
            <TableRow>
              <TableCell>Code Number</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>P Code</TableCell>
              <TableCell>Pending Allocation</TableCell>
              <TableCell>Start Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectCodes.map((code, index) => (
              (!locationFilter || code.location === locationFilter) && (
                <TableRow key={index}>
                  <TableCell>{code.code_number}</TableCell>
                  <TableCell>{code.end_date}</TableCell>
                  <TableCell>{code.location}</TableCell>
                  <TableCell>{code.p_code}</TableCell>
                  <TableCell>{code.pend_alloc}</TableCell>
                  <TableCell>{code.start_date}</TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box bgcolor="black" color="white" p={2} textAlign="center" position="fixed" bottom={0} left={0} width="100%" height={"5%"}>
        Contact Support: support@example.com
      </Box>
    </div>
  );
}

export default ProjectCodesComponent;
