import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useFormik } from 'formik';
import { FormLabel, FormControl } from '@mui/material';
import { patchApi } from 'views/services/api';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ChangeShift = (props) => {
  const { open, handleClose, data, employeeID } = props;

  const initialValues = {
    shift: data || 'default'
  };

  const UpdateShiftTime = async (values) => {
    console.log('values ==>', values);
    try {
      let response = await patchApi(`api/employee/edit/${employeeID}`, values);
      if (response.status === 200) {
        toast.success('Shift changed successfully');
        handleClose();
      } else {
        toast.error('cannot change shift');
      }
    } catch (e) {
      console.log(e);
      toast.error('cannot change shift');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: yup.object({
      shift: yup.string().notOneOf(['default'], 'Shift is required')
    }),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      UpdateShiftTime(values, resetForm);
    }
  });

  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" fullWidth>
      <DialogTitle
        id="scroll-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6">Change Shift</Typography>
        <Typography>
          <Button onClick={handleClose} style={{ color: 'red' }}>
            Cancel
          </Button>
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={12} md={10}>
              <FormControl fullWidth>
                <FormLabel>Working Shift</FormLabel>
                <Select
                  id="shift"
                  name="shift"
                  label=""
                  size="small"
                  fullWidth
                  value={formik.values.shift}
                  onChange={formik.handleChange}
                  error={formik.touched.shift && Boolean(formik.errors.shift)}
                >
                  <MenuItem value="default" disabled>
                    Select Working Shift
                  </MenuItem>

                  <MenuItem value="Day-Shift 08:00 AM - 08:00 PM">( Day-Shift ) 08:00 AM - 08:00 PM </MenuItem>
                  <MenuItem value="Night-Shift 08:00 PM - 08:00 AM">( Night-Shift ) 08:00 PM - 08:00 AM </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

ChangeShift.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.string,
  employeeID: PropTypes.string
};
export default ChangeShift;
