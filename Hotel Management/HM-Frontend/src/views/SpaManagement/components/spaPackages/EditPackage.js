import ClearIcon from '@mui/icons-material/Clear';
import { Chip, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi, patchApi } from 'views/services/api';
import * as Yup from 'yup';

const EditPackage = ({ open, handleClose, data }) => {
  const [spaServices, setSpaServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [serviceCategories, setServiceCategories] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getApi('api/spa/services');

        // Set spa services
        setSpaServices(res.data);

        // Extract unique categories from services
        const categories = [...new Set(res.data.map((service) => service.category))];
        setServiceCategories(categories.filter((category) => category !== undefined && category !== null));
      } catch (error) {
        toast.error('Failed to fetch services');
      }
    };
    fetchServices();
  }, []);

  const calculatePrices = (services, discountType, discountValue) => {
    const selectedServices = spaServices.filter((s) => services.includes(s._id));
    const total = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
    let discount = 0;

    if (discountType === 'flat') {
      discount = Number(discountValue);
    } else if (discountType === 'percentage') {
      discount = Math.round((Number(discountValue) / 100) * total);
    }

    const final = Math.max(0, Math.round(total - discount));
    setTotalPrice(total);
    setFinalPrice(final);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Package name is required'),
    description: Yup.string(),
    serviceCategory: Yup.string().required('Service category is required'),
    services: Yup.array().of(Yup.string().required()).min(1, 'At least one service must be selected'),
    discountType: Yup.string().oneOf(['none', 'flat', 'percentage']),
    discountValue: Yup.number().when('discountType', {
      is: (val) => val !== 'none',
      then: (schema) => schema.required('Discount value is required').min(0, 'Discount must be 0 or more'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  // Convert data.services to array of IDs if they are objects
  const prepareInitialServices = () => {
    if (!data || !data.services) return [];
    return data.services.map((s) => (typeof s === 'object' ? s._id : s));
  };

  const initialValues = {
    name: data?.name || '',
    description: data?.description || '',
    serviceCategory: data?.serviceCategory || '',
    services: prepareInitialServices(),
    discountType: data?.discountType || 'none',
    discountValue: data?.discountValue || ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!data?._id) {
        toast.error('Package ID is missing. Cannot update the package.');
        return;
      }

      try {
        const selectedServices = spaServices.filter((s) => values.services.includes(s._id));
        const servicesTotal = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);

        const payload = {
          name: values.name,
          description: values.description,
          price: finalPrice, // final price after discount
          serviceCategory: values.serviceCategory,
          services: values.services,
          servicesTotal: servicesTotal,
          discountType: values.discountType,
          discountValue: Number(values.discountValue) || 0
        };

        const response = await patchApi(`api/spa/packages/update/${data._id}`, payload);
        if (response.status === 200) {
          toast.success('Package updated successfully');
          formik.resetForm();
          handleClose();
        } else {
          toast.error(response.response?.data?.error || 'Something went wrong');
        }
      } catch (e) {
        toast.error(e?.response?.data?.error || 'An error occurred');
      }
    }
  });

  useEffect(() => {
    calculatePrices(formik.values.services, formik.values.discountType, formik.values.discountValue);
  }, [formik.values.services, formik.values.discountType, formik.values.discountValue, spaServices]);

  // Set initial prices when component mounts or data changes
  useEffect(() => {
    if (data && spaServices.length > 0) {
      calculatePrices(prepareInitialServices(), data.discountType || 'none', data.discountValue || 0);
    }
  }, [data, spaServices]);

  // Filter services when category changes
  useEffect(() => {
    if (formik.values.serviceCategory && spaServices.length > 0) {
      const filtered = spaServices.filter((service) => service.category === formik.values.serviceCategory);
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [formik.values.serviceCategory, spaServices]);

  // Handle category change
  const handleCategoryChange = (e) => {
    formik.setFieldValue('serviceCategory', e.target.value);

    // Don't clear services if this is initial load with existing data
    if (formik.dirty) {
      formik.setFieldValue('services', []); // Clear services when category changes
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-package-dialog-title"
      aria-describedby="edit-package-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="edit-package-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Edit Spa Package</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form>
          <DialogContentText>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Package Name"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.serviceCategory && Boolean(formik.errors.serviceCategory)}>
                  <InputLabel id="serviceCategory-label">Service Category</InputLabel>
                  <Select
                    labelId="serviceCategory-label"
                    id="serviceCategory"
                    name="serviceCategory"
                    value={formik.values.serviceCategory}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput label="Service Category" />}
                  >
                    {serviceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.serviceCategory && formik.errors.serviceCategory && (
                    <FormHelperText>{formik.errors.serviceCategory}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.services && Boolean(formik.errors.services)}>
                  <InputLabel id="services-label">Select Services</InputLabel>
                  <Select
                    labelId="services-label"
                    id="services"
                    name="services"
                    multiple
                    value={formik.values.services}
                    onChange={(e) => formik.setFieldValue('services', e.target.value)}
                    input={<OutlinedInput label="Select Services" />}
                    disabled={!formik.values.serviceCategory}
                    renderValue={(selected) => (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {selected.map((value) => {
                          const service = spaServices.find((s) => s._id === value);
                          return <Chip key={value} label={`${service?.name} (${service?.price || 0})`} />;
                        })}
                      </div>
                    )}
                  >
                    {filteredServices.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name} - ${service.price}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.services && formik.errors.services && <FormHelperText>{formik.errors.services}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Total Price" value={totalPrice} fullWidth InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="discount-type-label">Discount Type</InputLabel>
                  <Select
                    labelId="discount-type-label"
                    id="discountType"
                    name="discountType"
                    value={formik.values.discountType}
                    onChange={(e) => formik.setFieldValue('discountType', e.target.value)}
                    input={<OutlinedInput label="Discount Type" />}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="flat">Flat</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formik.values.discountType !== 'none' && (
             <Grid item xs={12}>
             <TextField
               id="discountValue"
               name="discountValue"
               type="number"
               label="Discount Value"
               fullWidth
               value={formik.values.discountValue}
               onChange={formik.handleChange}
               error={formik.touched.discountValue && Boolean(formik.errors.discountValue)}
               helperText={formik.touched.discountValue && formik.errors.discountValue}
               InputProps={{
                 inputProps: { 
                   min: 0, // Prevent negative values
                   onWheel: (e) => {
                     // Prevent the default behavior of mouse wheel changing the value
                     e.preventDefault();
                     // Remove focus from the input to ensure the value doesn't change
                     e.target.blur();
                   }
                 }
               }}
             />
           </Grid>
              )}

              <Grid item xs={12}>
                <TextField label="Final Price After Discount" value={finalPrice} fullWidth InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </DialogContentText>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary">
          Update Package
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPackage;
