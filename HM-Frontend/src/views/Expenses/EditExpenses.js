import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { expenseSchema } from 'schema';
import { getApi, patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';

const EditExpenses = (props) => {
  const { open, handleClose, id } = props;
  const [expense, setExpense] = useState(null); // Initialize as null
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  // Fetch specific expense data
  const fetchExpenseSingleData = async () => {
    try {
      const response = await getApi(`api/expenses/viewSinlgeExpenses/${hotel?.hotelId}/${id}`);
      if (response.status === 200) {
        setExpense(response?.data?.expensesData); // Set fetched data
      } else {
        toast.error('Failed to fetch expense data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching expense data');
    }
  };

  useEffect(() => {
    if (open && id) {
      fetchExpenseSingleData();
    }
  }, [open, id]);

  const formik = useFormik({
    enableReinitialize: true, // Allow reinitialization when initialValues change
    initialValues: {
      description: expense?.description || '',
      amount: expense?.amount || '',
      category: expense?.category || 'default'
    },
    validationSchema: expenseSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        values.hotelId = hotel.hotelId;
        const response = await patchApi(`api/expenses/edit/${id}`, values);
        if (response.status === 200) {
          toast.success('Expense updated successfully');
          handleClose();
          resetForm();
        } else {
          toast.error('Failed to update expense');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to update expense');
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
          Update Expense
        </Typography>
        <Button onClick={handleClose} style={{ color: 'red' }}>
          Cancel
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        {expense ? ( // Ensure the form only renders when data is available
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="category"
                  name="category"
                  select
                  fullWidth
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                >
                  <MenuItem value="default" disabled>
                    Select Expense Category
                  </MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="accomodation">Accomodation</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="staffsalaries">Staff Salaries</MenuItem>
                  <MenuItem value="marketingandadvertising">Marketing and Advertising</MenuItem>
                  <MenuItem value="technologyexpenses">Technology Expenses</MenuItem>
                  <MenuItem value="laborcosts">Labor Costs</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="amount"
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  fullWidth
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Update Expense
              </Button>
            </DialogActions>
          </form>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

EditExpenses.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default EditExpenses;
