import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Button, TextField, Grid, Paper, Snackbar, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function EmployeeManagement() {
  const [empId, setEmpId] = useState('');
  const [location, setLocation] = useState('');
  const [projectName, setProjectName] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [level, setLevel] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  


  const handleInsert = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/insert_employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emp_id: empId,
          location: location,
          project_name: projectName,
          portfolio: portfolio,
          level: level
        })
      });
      const data = await response.json();
      console.log('Response:', response);
      console.log('Data:', data);
      if (response.ok) {
        setEmpId('');
        setLocation('');
        setProjectName('');
        setPortfolio('');
        setLevel('');
        setSnackbarMessage('Data inserted successfully');
        setSnackbarOpen(true);
        // Optional: Display success message
      } else {
        console.error('Error inserting employee:', data.error);
        // Optional: Display error message
        setSnackbarMessage(data.error || 'An error occurred while inserting employee.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error inserting employee:', error);
      // Optional: Display error message
      setSnackbarMessage('An error occurred while inserting employee.');
      setSnackbarOpen(true);
    }
  };

  

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/update_employee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emp_id: empId,
          location: location,
          project_name: projectName,
          portfolio: portfolio,
          level: level
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage(data.message || 'Data updated successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Error updating employee:', data.error);
        setSnackbarMessage(data.error || 'An error occurred while updating employee.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setSnackbarMessage('An error occurred while updating employee.');
      setSnackbarOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setSnackbarMessage('Please select a file.');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('files', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload_files', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Upload Response:', data);
      if (response.ok) {
        setSnackbarMessage('File uploaded successfully.');
        setSnackbarOpen(true);
      } else {
        console.error('Error uploading file:', data.error);
        setSnackbarMessage('An error occurred while uploading the file.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setSnackbarMessage('An error occurred while uploading the file.');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete_employee', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emp_id: empId,
          project_name: projectName
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage(data.message || 'Record deleted successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Error deleting employee:', data.error);
        setSnackbarMessage(data.error || 'An error occurred while deleting employee.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setSnackbarMessage('An error occurred while deleting employee.');
      setSnackbarOpen(true);
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

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleEmployeePage = () => {
    navigate('/employee');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Manage Employee Page
            </Typography>
            <Button color="inherit" size="small" onClick={handleDashboard}>DASHBOARD</Button>
            <Button color="inherit" size="small" onClick={handleEmployeePage}>Employee service</Button>
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
                Insert Employee
              </Typography>
              <TextField
                label="Emp ID"
                variant="outlined"
                fullWidth
                margin="normal"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <TextField
                label="Portfolio"
                variant="outlined"
                fullWidth
                margin="normal"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
              <TextField
                label="Level"
                variant="outlined"
                fullWidth
                margin="normal"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <Button variant="contained" onClick={handleInsert} fullWidth sx={{ bgcolor: 'primary.main', color: 'white', flex: 1 }}>
                  Insert
                </Button>
                <Button variant="contained" onClick={handleUpdate} fullWidth sx={{ bgcolor: 'primary.main', color: 'white', flex: 1 }}>
                  Update
                </Button>
              </div>
              <input type="file" onChange={handleFileChange} />
              <Button variant="contained" onClick={handleUpload} fullWidth sx={{ bgcolor: 'primary.main', color: 'white' }}>
                Upload File
              </Button>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
              />
              </Paper>
              <div style={{ height: '20px' }}></div>

              <Paper>
              <p></p>
              <Typography variant="h5" align="center" gutterBottom>Delete Employee</Typography>
              <TextField
                label="Emp ID"
                variant="outlined"
                fullWidth
                margin="normal"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Button variant="contained" onClick={handleDelete} fullWidth>
                Delete
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

export default EmployeeManagement;