import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Grid, Paper, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

function PCodeManagement() {
  const [pCode, setPCode] = useState('');
  const [location, setLocation] = useState('');
  const [codeNumber, setCodeNumber] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleInsert = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/insert_project_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_code: pCode,
          location: location,
          code_number: codeNumber
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage(data.message || 'Project code inserted successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Error inserting project code:', data.error);
        setSnackbarMessage(data.error || 'An error occurred while inserting project code.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error inserting project code:', error);
      setSnackbarMessage('An error occurred while inserting project code.');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/delete_project_code', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project: pCode,
          code_number: codeNumber
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage(data.message || 'Project code deleted successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Error deleting project code:', data.error);
        setSnackbarMessage(data.error || 'An error occurred while deleting project code.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting project code:', error);
      setSnackbarMessage('An error occurred while deleting project code.');
      setSnackbarOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setSnackbarMessage('Please select a file.');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('files', selectedFile);
  
      const response = await fetch('http://127.0.0.1:5001/upload_files', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
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
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handlePcodePage = () => {
    navigate('/pcode');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              PCode Management Page
            </Typography>
            <Button color="inherit" size="small" onClick={handleDashboard}>DASHBOARD</Button>
            <Button color="inherit" size="small" onClick={handlePcodePage}>Pcodes service</Button>
          </Toolbar>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={10} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Insert/Delete Project Code
              </Typography>
              <TextField
                label="PCode"
                variant="outlined"
                fullWidth
                margin="normal"
                value={pCode}
                onChange={(e) => setPCode(e.target.value)}
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
                label="Code Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={codeNumber}
                onChange={(e) => setCodeNumber(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <Button variant="contained" onClick={handleInsert} fullWidth>
                  Insert
                </Button>
                <Button variant="contained" onClick={handleDelete} fullWidth>
                  Delete
                </Button>
              </div>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
              />
            </Paper>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Upload File
              </Typography>
              <input type="file" onChange={handleFileChange} />
              <Button variant="contained" onClick={handleUpload} fullWidth>
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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PCodeManagement;
