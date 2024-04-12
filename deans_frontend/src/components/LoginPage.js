import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Box } from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(null); // State variable for error message
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    console.log('Form data:', formData); // Print form data for debugging

    try {
      const response = await fetch('http://127.0.0.1:5003/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response:', response); // Print response for debugging

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful. Token:', data.token); // Print token for debugging
        localStorage.setItem('token', data.token); // Store token in local storage

        // Redirect user to dashboard or other page
        // Example: navigate('/dashboard');
        navigate('/Dashboard'); // Redirect to the dashboard page
      } else {
        // Handle error: Display "Invalid Credentials" message
        setError('Invalid Credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        {/* Image */}
        <img src="/logo.jpg" alt="Login" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
      </Grid>
      <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center" style={{ backgroundColor: '#34568B' }}>
        {/* Login Form */}
        <Container maxWidth="xs">
          <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>Login</Typography>
            {/* Displaying "DEAMS" in a bigger font size */}
            <Typography variant="h1" align="center" gutterBottom style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: 'white' }}>DEAMS</Typography>
            <form onSubmit={handleSubmit}>
              {/* Display error message if error state is not null */}
              {error && <Typography variant="body1" align="center" style={{ color: 'red', marginBottom: '1rem' }}>{error}</Typography>}
              <div>
                <TextField
                  fullWidth
                  label="Username or Email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                />
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </form>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
