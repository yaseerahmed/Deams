import * as React from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem as MuiMenuItem, Grid } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function EmployeeComponent() {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState([
    { column: '', value: '' },
    { column: '', value: '' },
    { column: '', value: '' },
    { column: '', value: '' }
  ]);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/employee_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_name: searchQuery }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(jsonData); // Set filtered data initially to full data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (index, event) => {
    const { value } = event.target;
    const newFilters = [...filters];
    newFilters[index].column = value;
    newFilters[index].value = '';
    setFilters(newFilters);
  };

  const handleFilterValueChange = (index, event) => {
    const { value } = event.target;
    const newFilters = [...filters];
    newFilters[index].value = value;
    setFilters(newFilters);
  };

  const applyFilter = () => {
    let filteredData = [...data];
    filters.forEach(filter => {
      if (filter.column && filter.value) {
        if (filter.column === 'Emp Id') {
          // Filter by Employee ID
          filteredData = filteredData.filter(row => row[filter.column] === parseInt(filter.value));
        } else {
          // Filter by other columns
          filteredData = filteredData.filter(row => row[filter.column] === filter.value);
        }
      }
    });
    setFilteredData(filteredData);
  };
  

  const clearFilter = () => {
    setFilters([
      { column: '', value: '' },
      { column: '', value: '' },
      { column: '', value: '' },
      { column: '', value: '' }
    ]);
    setFilteredData(data); // Reset filtered data to full data
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleManageEmployee = () => {
    navigate('/manage-employee');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Page
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* Pushes the following items to the right */}
          <Button color="inherit" onClick={handleDashboard}>DASHBOARD</Button>
          <Button color="inherit" onClick={handleManageEmployee}>Manage Employees</Button>
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
      <Box p={2}>
        <TextField
          label="Search by project name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 2 }}>Search</Button>
        
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box p={2}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Portfolio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row['Emp Id']}</TableCell>
                        <TableCell>{row['Location']}</TableCell>
                        <TableCell>{row['Project name']}</TableCell>
                        <TableCell>{row['level']}</TableCell>
                        <TableCell>{row['portfolio']}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box p={2} bgcolor="lightgray">
            {filters.map((filter, index) => (
              <FormControl key={index} sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Select Column {index + 1}</InputLabel>
                <Select
                  value={filter.column}
                  onChange={(event) => handleFilterChange(index, event)}
                  label={`Select Column ${index + 1}`}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Emp Id">Employee ID</MenuItem>
                  <MenuItem value="Location">Location</MenuItem>
                  <MenuItem value="Project name">Project Name</MenuItem>
                  <MenuItem value="level">Level</MenuItem>
                  <MenuItem value="portfolio">Portfolio</MenuItem>
                </Select>
                {filter.column && (
                  <TextField
                    label={`Filter by ${filter.column}`}
                    variant="outlined"
                    value={filter.value}
                    onChange={(event) => handleFilterValueChange(index, event)}
                    sx={{ mb: 2 }}
                  />
                )}
              </FormControl>
            ))}
            <Button variant="contained" onClick={applyFilter} sx={{ mr: 2 }}>Apply Filter</Button>
            <Button variant="contained" onClick={clearFilter}>Clear Filter</Button>
          </Box>
        </Grid>
      </Grid>
      <Box bgcolor="black" color="white" p={2} textAlign="center" position="fixed" bottom={0} left={0} width="100%" height={"10%"}>
        Contact Support: support@example.com
      </Box>
    </div>
  );
}
