import React, { useState, useEffect } from 'react';
import {Menu, MenuItem,IconButton, AppBar, Toolbar, Typography, Button, TextField, Grid, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

function AllocationManagement() {
  const [projectName, setProjectName] = useState('');
  const [codeNumber, setCodeNumber] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [allocationDetails, setAllocationDetails] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fetchingAllocation, setFetchingAllocation] = useState(false);
  const [empId, setEmpId] = useState('');
  
  const navigate = useNavigate();
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const handleGenerateAllocation = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5002/generate_allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_name: projectName
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage(data.message || 'Allocation generated successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Error generating allocation:', data.error);
        setSnackbarMessage(data.error || 'An error occurred while generating allocation.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error generating allocation:', error);
      setSnackbarMessage('An error occurred while generating allocation.');
      setSnackbarOpen(true);
    }
  };

  const handleGetAllocationDetails = async () => {
    try {
      setFetchingAllocation(true);
      const response = await fetch(`http://127.0.0.1:5002/get_allocation_details?code_number=${codeNumber}`);
      const data = await response.json();
      if (response.ok) {
        setAllocationDetails(data.allocation_details);
      } else {
        console.error('Error fetching allocation details:', data.error);
        setSnackbarMessage(data.error || 'An error occurred while fetching allocation details.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching allocation details:', error);
      setSnackbarMessage('An error occurred while fetching allocation details.');
      setSnackbarOpen(true);
    } finally {
      setFetchingAllocation(false);
    }
  };
  const handleGenerateOneAllocation = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5002/generate_one_allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emp_id: empId, project_name: projectName })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage(data.message || 'Allocation generated successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(data.error || 'An error occurred');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error generating allocation:', error);
      setSnackbarMessage('An error occurred');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (codeNumber) {
      handleGetAllocationDetails();
    }
  }, [codeNumber]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Allocation Management Page
            </Typography>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
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
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={10} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Generate Allocation
              </Typography>
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Button variant="contained" onClick={handleGenerateAllocation} fullWidth>
                Generate Allocation
              </Button>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
              />
            </Paper>
            <Paper elevation={3} sx={{ p: 3, marginTop: '20px' }}>
              <Typography variant="h5" align="center" gutterBottom>
                Allocation Details
              </Typography>
              <TextField
                label="Code Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={codeNumber}
                onChange={(e) => setCodeNumber(e.target.value)}
                disabled={fetchingAllocation} // Disable text field while fetching allocation details
              />
              <Button variant="contained" onClick={handleGetAllocationDetails} disabled={fetchingAllocation} fullWidth>
                Get Allocation Details
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code Number</TableCell>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>P Code</TableCell>
                      <TableCell>Project Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocationDetails && allocationDetails.map((allocation, index) => (
                      <TableRow key={index}>
                        <TableCell>{allocation.code_number}</TableCell>
                        <TableCell>{allocation.emp_id}</TableCell>
                        <TableCell>{allocation.level}</TableCell>
                        <TableCell>{allocation.location}</TableCell>
                        <TableCell>{allocation.p_code}</TableCell>
                        <TableCell>{allocation.project_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </TableContainer>
            </Paper>
            <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Generate one Allocation
      </Typography>
      <TextField
        label="Project Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <TextField
        label="Employee ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      />
      <Button variant="contained" onClick={handleGenerateOneAllocation} fullWidth>
        Generate Allocation
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AllocationManagement;
