import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { patchApi } from 'views/services/api';
import * as yup from 'yup';

const ChangeShift = (props) => {
  const { open, handleClose, data, employeeID } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to determine if shift is custom
  const isCustomShift = (value) => {
    const standardShifts = ['09:00 AM - 06:00 PM', '06:00 PM - 12:00 AM', '12:00 AM - 09:00 PM'];
    return value && !standardShifts.includes(value);
  };

  // Helper function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12HourFormat = (time24) => {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);

    if (hours12 >= 12) {
      period = 'PM';
      if (hours12 > 12) {
        hours12 -= 12;
      }
    }

    // Convert hour '0' to '12' for 12 AM
    if (hours12 === 0) {
      hours12 = 12;
    }

    return `${hours12.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  const initialValues = {
    shift: isCustomShift(data) ? 'custom' : data || 'default',
    customShiftStart: '',
    customShiftEnd: ''
  };

  const UpdateShiftTime = async (values) => {
    try {
      setIsSubmitting(true);

      // Determine the final shift value
      let finalShiftValue = values.shift;

      // Format custom shift with 12-hour time format
      if (values.shift === 'custom' && values.customShiftStart && values.customShiftEnd) {
        const startTime12 = convertTo12HourFormat(values.customShiftStart);
        const endTime12 = convertTo12HourFormat(values.customShiftEnd);
        finalShiftValue = `${startTime12} - ${endTime12}`;
      }

      // Create payload with the correct shift value
      const payload = {
        shift: finalShiftValue
      };

      let response = await patchApi(`api/spaStaff/editspaStaff/${employeeID}`, payload);
      if (response.status === 200) {
        toast.success('Shift changed successfully');
        handleClose();
      } else {
        toast.error('Cannot change shift');
      }
    } catch (e) {
      console.error('Error updating shift:', e);
      toast.error('Cannot change shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema = yup.object({
    shift: yup.string().notOneOf(['default'], 'Shift is required'),
    customShiftStart: yup.string().when('shift', {
      is: 'custom',
      then: () => yup.string().required('Start time is required')
    }),
    customShiftEnd: yup.string().when('shift', {
      is: 'custom',
      then: () => yup.string().required('End time is required')
    })
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      UpdateShiftTime(values, resetForm);
    }
  });

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
  };

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
          <Button onClick={handleCancel} style={{ color: 'red' }}>
            Cancel
          </Button>
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Working Shift Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.shift && Boolean(formik.errors.shift)}>
                <FormLabel>Working Shift</FormLabel>
                <Select
                  id="shift"
                  name="shift"
                  size="small"
                  value={formik.values.shift}
                  onChange={(e) => {
                    formik.setFieldValue('shift', e.target.value);
                    if (e.target.value !== 'custom') {
                      formik.setFieldValue('customShiftStart', '');
                      formik.setFieldValue('customShiftEnd', '');
                    }
                  }}
                >
                  <MenuItem value="default" disabled>
                    Select Working Shift
                  </MenuItem>
                  <MenuItem value="09:00 AM - 06:00 PM">09:00 AM - 06:00 PM</MenuItem>
                  <MenuItem value="06:00 PM - 12:00 AM">06:00 PM - 12:00 AM</MenuItem>
                  <MenuItem value="12:00 AM - 09:00 PM">12:00 AM - 09:00 PM</MenuItem>
                  <MenuItem value="custom">Other (Write Manually)</MenuItem>
                </Select>
                {formik.touched.shift && formik.errors.shift && <FormHelperText>{formik.errors.shift}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Custom Shift Time Range */}
            {formik.values.shift === 'custom' && (
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="customShiftStart">Start Time</FormLabel>
                    <TextField
                      id="customShiftStart"
                      name="customShiftStart"
                      type="time"
                      size="small"
                      value={formik.values.customShiftStart}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      error={formik.touched.customShiftStart && Boolean(formik.errors.customShiftStart)}
                      helperText={formik.touched.customShiftStart && formik.errors.customShiftStart}
                    />
                    {formik.values.customShiftStart && (
                      <FormHelperText>{`Will be saved as: ${convertTo12HourFormat(formik.values.customShiftStart)}`}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="customShiftEnd">End Time</FormLabel>
                    <TextField
                      id="customShiftEnd"
                      name="customShiftEnd"
                      type="time"
                      size="small"
                      value={formik.values.customShiftEnd}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      error={formik.touched.customShiftEnd && Boolean(formik.errors.customShiftEnd)}
                      helperText={formik.touched.customShiftEnd && formik.errors.customShiftEnd}
                    />
                    {formik.values.customShiftEnd && (
                      <FormHelperText>{`Will be saved as: ${convertTo12HourFormat(formik.values.customShiftEnd)}`}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Grid>

          <DialogActions style={{ marginTop: '20px' }}>
            <Button onClick={handleCancel} color="error" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting ? 'Updating...' : 'Update Shift'}
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
