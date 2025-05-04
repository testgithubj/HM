import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getApi } from 'views/services/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

export default function ViewExpense() {
  const { hotelId, id } = useParams(); // Extract hotelId and id from the route
  const [value, setValue] = useState('1');
  const [expenseData, setExpenseData] = useState(null); // Initialize as null for a single object
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await getApi(`api/expenses/viewSinlgeExpenses/${hotelId}/${id}`);
        console.log('Expense data is:', response.data.expensesData); // Log the actual data
        setExpenseData(response.data.expensesData); // Set the single expense object
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error('Error fetching expense data:', error);
        setError('Failed to fetch expense data.');
        setLoading(false); // Set loading to false
      }
    };

    if (hotelId && id) {
      fetchExpenseData();
    }
  }, [hotelId, id]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>; // Show loading message while fetching
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>; // Show error message if fetch fails
  }

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label="Expense Information" value="1" />
            </TabList>

            <div>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7' }}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </Box>

          <TabPanel value="1">
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ p: 2 }}>
                      Expense Details
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {expenseData ? (
                            <TableRow key={expenseData._id}>
                              <TableCell>{expenseData.category}</TableCell>
                              <TableCell>{expenseData.description}</TableCell>
                              <TableCell>{expenseData.amount}</TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
 