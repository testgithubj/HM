/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import ClearIcon from '@mui/icons-material/Clear';
import { FormHelperText, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { postApi } from 'views/services/api';
import * as Yup from 'yup';
import DurationPicker from './components/DurationPicker';

const AddService = (props) => {
  const { open, onClose } = props;

  // Updated schema to include category
  const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Service name is required'),
    description: Yup.string(),
    category: Yup.string(), // Added category field
    duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
    price: Yup.number().required('Price is required').positive('Price must be positive')
  });

  const initialValues = {
    name: '',
    description: '',
    category: '', // Added category field
    price: '',
    duration: 0,
    durationObject: { minutes: 0, hours: 0 } // For the duration picker UI
  };

  const AddData = async (values) => {
    try {
      // Updated payload to include category
      const payload = {
        name: values.name,
        description: values.description,
        category: values.category, // Added category to payload
        price: Number(values.price),
        duration: values.duration
      };

      console.log('Payload:', payload);

      const response = await postApi('api/spa/services', payload);

      console.log('Response:', response);
      if (response.status === 200) {
        formik.resetForm();
        toast.success('Service added successfully');
        onClose(); // Close the modal after successful submission
      } else {
        toast.error(response.response.data.error);
      }
    } catch (e) {
      toast.error(e?.response?.data?.error || 'An error occurred');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: serviceSchema,
    onSubmit: async (values) => {
      await AddData(values);
    }
  });

  const handleDurationChange = (durationObj) => {
    // Calculate total minutes
    const totalMinutes = durationObj.hours * 60 + durationObj.minutes;
    formik.setFieldValue('duration', totalMinutes);
    formik.setFieldValue('durationObject', durationObj);
  };

  // Ensure onClose is properly called
  const onCloseDialog = () => {
    formik.resetForm(); // Reset form when closing
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onCloseDialog}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            Add Spa Service
          </Typography>
          <Typography>
            <ClearIcon onClick={onCloseDialog} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="name"
                    name="name"
                    label="Service Name"
                    fullWidth
                    placeholder="Enter Service Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter Service Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>

                {/* Added Category Field */}
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="category"
                    name="category"
                    label="Category"
                    fullWidth
                    placeholder="Enter Service Category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    helperText={formik.touched.category && formik.errors.category}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="price"
                    name="price"
                    type="number"
                    label="Price"
                    fullWidth
                    placeholder="Enter Service Price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    InputProps={{
                      inputProps: { min: 0 }, 
                      onWheel: (e) => {
                        e.target.blur();
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <DurationPicker label="Duration" onChange={handleDurationChange} value={formik.values.durationObject} />
                  {formik.touched.duration && formik.errors.duration && <FormHelperText error>{formik.errors.duration}</FormHelperText>}
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary">
            Add Service
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddService;
