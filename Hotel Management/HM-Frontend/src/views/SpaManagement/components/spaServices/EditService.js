import ClearIcon from '@mui/icons-material/Clear';
import { FormLabel, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { patchApi } from 'views/services/api';
import * as Yup from 'yup';

const EditService = (props) => {
  const { open, handleClose, data, onSuccess } = props;

  // Common spa service categories

  const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Service name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
    duration: Yup.number()
      .typeError('Duration must be a number')
      .positive('Duration must be positive')
      .integer('Duration must be an integer')
      .required('Duration is required')
  });

  const initialValues = {
    name: data?.name || '',
    description: data?.description || '',
    category: data?.category || '',
    price: data?.price || '',
    duration: data?.duration || ''
  };

  const updateService = async (values) => {
    if (!data?._id) {
      toast.error('Service ID is missing. Cannot update the service.');
      throw new Error('Service ID is missing');
    }

    try {
      const response = await patchApi(`api/spa/updateServices/${data._id}`, values);
      if (response.status === 200) {
        formik.resetForm();
        toast.success('Service Successfully Modified');
        return response; // Return successful response
      } else {
        const errorMessage = response.response?.data?.error || 'Something went wrong';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        toast.error(e.response.data.error);
      } else if (e.message) {
        toast.error(`Unexpected error: ${e.message}`);
      } else {
        toast.error('An unexpected error occurred');
      }
      throw e; // Re-throw the error
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: serviceSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateService(values);
        // Call onSuccess callback to trigger parent component refresh
        if (onSuccess) {
          onSuccess();
        }
        handleClose(true);
      } catch (error) {
        console.error('Error updating service:', error);
        // Error is already handled in updateService
      }
    }
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="edit-service-dialog-title"
        aria-describedby="edit-service-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="edit-service-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Edit Spa Service</Typography>
          <Typography>
            <ClearIcon onClick={() => handleClose(false)} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="edit-service-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Service Name</FormLabel>
                  <TextField
                    id="name"
                    name="name"
                    size="small"
                    fullWidth
                    placeholder="Enter Service Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Category</FormLabel>
                  <TextField
                    id="category"
                    name="category"
                    size="small"
                    fullWidth
                    placeholder="Enter Category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    helperText={formik.touched.category && formik.errors.category}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Description</FormLabel>
                  <TextField
                    id="description"
                    name="description"
                    size="small"
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

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Duration (mins)</FormLabel>
                  <TextField
                    id="duration"
                    name="duration"
                    type="number"
                    size="small"
                    fullWidth
                    placeholder="Enter Service Duration"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                    helperText={formik.touched.duration && formik.errors.duration}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="error">
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditService;
