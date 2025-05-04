import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { expenseSchema } from 'schema';
import { postApi } from 'views/services/api';

const AddExpenses = (props) => {
  const { open, handleClose } = props;
  const initialValues = {
    description: '',
    amount: '',
    category: 'default'
  };

  const AddData = async (values, resetForm) => {
    try {
      values.hotelId = await JSON.parse(localStorage.getItem('hotelData')).hotelId;
      let response = await postApi('api/expenses/add', values);
      if (response.status === 200) {
        toast.success('Expense Added successfully');
        handleClose();
        resetForm();
      } else {
        toast.error('cannot add Expense');
      }
    } catch (e) {
      console.log(e);
      toast.error('cannot add Expense');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: expenseSchema,
    onSubmit: async (values, { resetForm }) => {
      AddData(values, resetForm);
    }
  });

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            Add New Expense
          </Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  id="category"
                  name="category"
                  select
                  // label="Category"
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

              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  id="amount"
                  name="amount"
                  label="Amount"
                  type="number"
                  placeholder="in $"
                  fullWidth
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
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
                Add Expense
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddExpenses.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default AddExpenses;
