// Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Container,
  Grid,
  ButtonBase,
  Paper,
  Box,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEmployeeButtonClick = () => {
    navigate('/employee');
  };

  const handlePCodeButtonClick = () => {
    navigate('/pcode');
  };

  const handleAllocationButtonClick = () => {
    navigate('/allocation');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Deams
          </Typography>
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
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <ButtonBase focusRipple onClick={handleEmployeeButtonClick} style={{ width: '100%' }}>
              <Paper
                elevation={3}
                style={{
                  padding: '50px',
                  backgroundImage: `url(${process.env.PUBLIC_URL}/employees.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '300px',
                  width: '300px',
                  borderRadius: '15px',
                }}
              />
            </ButtonBase>
            <Typography variant="subtitle1" align="center"><h2>Employees</h2></Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ButtonBase focusRipple onClick={handlePCodeButtonClick} style={{ width: '100%' }}>
              <Paper
                elevation={3}
                style={{
                  padding: '50px',
                  backgroundImage: `url(${process.env.PUBLIC_URL}/logo.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '300px',
                  width: '300px',
                  borderRadius: '15px',
                }}
              />
            </ButtonBase>
            <Typography variant="subtitle1" align="center"><h2>P Codes</h2></Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ButtonBase focusRipple onClick={handleAllocationButtonClick} style={{ width: '100%' }}>
              <Paper
                elevation={3}
                style={{
                  padding: '50px',
                  backgroundImage: `url(${process.env.PUBLIC_URL}/logo.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '300px',
                  width: '300px',
                  borderRadius: '15px',
                }}
              />
            </ButtonBase>
            <Typography variant="subtitle1" align="center"><h2>Allocation</h2></Typography>
          </Grid>
        </Grid>
      </Container>
      <Box bgcolor="black" color="white" p={2} textAlign="center" position="fixed" bottom={0} left={0} width="100%" height={"10%"}>
        Contact Support: support@example.com
      </Box>
    </div>
  );
};

export default Dashboard;
