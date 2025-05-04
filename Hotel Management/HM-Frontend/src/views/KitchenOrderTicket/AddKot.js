import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { kotSchema } from 'schema/kotSchema';
import { postApi, getApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

const AddKot = (props) => {
  const { open, handleClose } = props;
  const initialValues = {
    staffId: '',
    description: ''
  };

  const [employeNames, setEmployeNames] = useState([]);

  useEffect(() => {
    if (open) {
      const hotel = JSON.parse(localStorage.getItem('hotelData'));
      getApi(`api/employee/viewallemployee/${hotel?.hotelId}`)
        .then((response) => {
          const employeeData = response.data.employeeData.map((employee) => ({
            id: employee._id,
            fullName: employee.fullName
          }));
          console.log('employeeData   =====>', employeeData);
          setEmployeNames(employeeData);
        })
        .catch((error) => {
          console.error('Employee Names List is not Found!!', error);
        });
    }
  }, [open]);

  const AddData = async (values, resetForm) => {
    try {
      values.hotelId = await JSON.parse(localStorage.getItem('hotelData')).hotelId;
      let response = await postApi('api/kitchenorderticket/addKot', values);
      console.log('add response ==>', response);
      if (response.status === 200) {
        toast.success('Ticket Added successfully');
        handleClose();
        resetForm();
      } else {
        toast.error('cannot add Ticket');
      }
    } catch (e) {
      console.log(e);
      toast.error('cannot add Ticket');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: kotSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log('in onSubmit values ==>', values);
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
          <Typography variant="h6">Add New Ticket</Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item xs={12} sm={6} md={12}>
                <TextField
                  id="staffId"
                  name="staffId"
                  select
                  label="Staff Name"
                  fullWidth
                  value={formik.values.staffId}
                  onChange={formik.handleChange}
                  error={formik.touched.staffId && Boolean(formik.errors.staffId)}
                  helperText={formik.touched.staffId && formik.errors.staffId}
                >
                  <MenuItem value="default" disabled>
                    Select Staff From Here
                  </MenuItem>
                  {employeNames.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </MenuItem>
                  ))}
                </TextField>
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
                Add Ticket
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddKot.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default AddKot;
