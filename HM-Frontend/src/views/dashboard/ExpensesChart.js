import { Grid, Typography, Select, MenuItem, Button, Menu } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { gridSpacing } from 'store/constant';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { getApi } from 'views/services/api';
import { saveAs } from 'file-saver';

const ExpensesChart = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [filterType, setFilterType] = useState('today');
  const [totalExpenseAmount, setTotalExpenseAmount] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPrintButtonClick, setIsPrintButtonClicked] = useState(false);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const fetchExpenseData = async () => {
    try {
      // const response = await getApi(`api/expenses/viewexpensesforchart/${hotel?._id}?filterType=${filterType}`);
      const response = await getApi(`api/expenses/viewexpensesforchart/${hotel?.hotelId}?filterType=${filterType}`);
      if (response && response.data && response.data.expensesData) {
        setExpenseData(response.data.expensesData);
        setTotalExpenseAmount(response.data.totalExpense);
      } else {
        setExpenseData([]);
        setTotalExpenseAmount(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel?.hotelId, filterType]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const exportToCSV = () => {
    const csvData = expenseData.map((item) => `${item.category},${item.amount}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'expenses_data.csv');
    handleMenuClose();
  };

  const printComponent = () => {
    const printContents = document.getElementById('print-area');
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Expenses Chart Print</title></head><body>');
      printWindow.document.write(printContents.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
      setIsPrintButtonClicked(false);
    });
  };

  // Inside your ExpensesChart component
  const print = () => {
    setIsPrintButtonClicked(true);
    printComponent();
    handleMenuClose();
  };

  const finalExpenseData = expenseData.map((expense) => ({
    category: expense?.category,
    expense: expense?.amount
  }));

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {filterType[0].toUpperCase() + filterType.slice(1)}&apos;s Expenses ( ${totalExpenseAmount.toLocaleString()} )
        </Typography>
        <Grid>
          <Select value={filterType} onChange={handleFilterChange}>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>

          <Button variant="contained" onClick={handleMenuOpen} sx={{ marginLeft: '12px' }}>
            Export / Print
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={exportToCSV}>Export to CSV</MenuItem>
            <MenuItem onClick={print}>Print</MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <Grid item xs={12} id="print-area">
        {isPrintButtonClick ? (
          <Typography variant="h5" sx={{ mb: 2 }}>
            {filterType[0].toUpperCase() + filterType.slice(1)}&apos;s Expenses ( ${totalExpenseAmount.toLocaleString()} )
          </Typography>
        ) : (
          ''
        )}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={finalExpenseData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expense" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default ExpensesChart;
