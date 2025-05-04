// /* eslint-disable prettier/prettier */
// /* eslint-disable react/prop-types */
// import ClearIcon from '@mui/icons-material/Clear';
// import { Chip, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Typography from '@mui/material/Typography';
// import { useFormik } from 'formik';
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { getApi, postApi } from 'views/services/api';
// import * as Yup from 'yup';

// const AddPackage = ({ open, onClose, onSuccess }) => {
//   const [spaServices, setSpaServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const [serviceCategories, setServiceCategories] = useState([]);

//   const validationSchema = Yup.object().shape({
//     name: Yup.string().required('Package name is required'),
//     description: Yup.string(),
//     serviceCategory: Yup.string().required('Service category is required'),
//     services: Yup.array().of(Yup.string().required()).min(1, 'At least one service must be selected'),
//     discountType: Yup.string().oneOf(['none', 'flat', 'percentage']),
//     discountValue: Yup.number().when('discountType', {
//       is: (val) => val !== 'none',
//       then: (schema) => schema.required('Discount value is required').min(0, 'Discount must be 0 or more'),
//       otherwise: (schema) => schema.notRequired()
//     })
//   });

//   const initialValues = {
//     name: '',
//     description: '',
//     serviceCategory: '',
//     services: [],
//     discountType: 'none',
//     discountValue: ''
//   };

//   const calculatePrices = (services, discountType, discountValue) => {
//     const selectedServices = spaServices.filter((s) => services.includes(s._id));
//     const total = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
//     let discount = 0;

//     if (discountType === 'flat') {
//       discount = Number(discountValue);
//     } else if (discountType === 'percentage') {
//       discount = Math.round((Number(discountValue) / 100) * total);
//     }

//     const final = Math.max(0, Math.round(total - discount));
//     setTotalPrice(total);
//     setFinalPrice(final);
//   };

//   const formik = useFormik({
//     initialValues,
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const selectedServices = spaServices.filter((s) => values.services.includes(s._id));
//         const servicesTotal = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);

//         const payload = {
//           name: values.name,
//           description: values.description,
//           price: finalPrice, // final price after discount
//           serviceCategory: values.serviceCategory,
//           services: values.services,
//           servicesTotal: servicesTotal,
//           discountType: values.discountType,
//           discountValue: Number(values.discountValue) || 0
//         };

//         const response = await postApi('api/spa/packages', payload);

//         if (response.status === 200) {
//           toast.success('Package added successfully');
//           formik.resetForm();
//           onClose(); // Close the modal
//           if (onSuccess) onSuccess(); // Call the success callback if provided
//         } else {
//           toast.error(response.response.data.error || 'Something went wrong');
//         }
//       } catch (e) {
//         toast.error(e?.response?.data?.error || 'An error occurred');
//       }
//     }
//   });

//   const onCloseDialog = () => {
//     formik.resetForm();
//     onClose();
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const res = await getApi('api/spa/services');

//         // Set spa services
//         setSpaServices(res.data);

//         // Extract unique categories from services
//         const categories = [...new Set(res.data.map((service) => service.category))];
//         setServiceCategories(categories.filter((category) => category !== undefined && category !== null));
//       } catch (error) {
//         toast.error('Failed to fetch services');
//       }
//     };
//     fetchServices();
//   }, []);

//   // Filter services when category changes
//   useEffect(() => {
//     if (formik.values.serviceCategory && spaServices.length > 0) {
//       const filtered = spaServices.filter((service) => service.category === formik.values.serviceCategory);
//       setFilteredServices(filtered);

//       // Clear selected services when category changes
//       if (formik.values.services.length > 0) {
//         formik.setFieldValue('services', []);
//       }
//     } else {
//       setFilteredServices([]);
//     }
//   }, [formik.values.serviceCategory, spaServices]);

//   useEffect(() => {
//     calculatePrices(formik.values.services, formik.values.discountType, formik.values.discountValue);
//   }, [formik.values.services, formik.values.discountType, formik.values.discountValue]);

//   // Handle category change
//   const handleCategoryChange = (e) => {
//     formik.setFieldValue('serviceCategory', e.target.value);
//     formik.setFieldValue('services', []); // Clear services when category changes
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onCloseDialog}
//       aria-labelledby="scroll-dialog-title"
//       aria-describedby="scroll-dialog-description"
//       maxWidth="sm"
//       fullWidth
//     >
//       <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h3">Add Spa Package</Typography>
//         <ClearIcon onClick={onCloseDialog} style={{ cursor: 'pointer' }} />
//       </DialogTitle>

//       <DialogContent dividers>
//         <form>
//           <DialogContentText>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <TextField
//                   id="name"
//                   name="name"
//                   label="Package Name"
//                   fullWidth
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                   error={formik.touched.name && Boolean(formik.errors.name)}
//                   helperText={formik.touched.name && formik.errors.name}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <FormControl fullWidth error={formik.touched.serviceCategory && Boolean(formik.errors.serviceCategory)}>
//                   <InputLabel id="serviceCategory-label">Service Category</InputLabel>
//                   <Select
//                     labelId="serviceCategory-label"
//                     id="serviceCategory"
//                     name="serviceCategory"
//                     value={formik.values.serviceCategory}
//                     onChange={handleCategoryChange}
//                     input={<OutlinedInput label="Service Category" />}
//                   >
//                     {serviceCategories.map((category) => (
//                       <MenuItem key={category} value={category}>
//                         {category}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {formik.touched.serviceCategory && formik.errors.serviceCategory && (
//                     <FormHelperText>{formik.errors.serviceCategory}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12}>
//                 <FormControl fullWidth error={formik.touched.services && Boolean(formik.errors.services)}>
//                   <InputLabel id="services-label">Select Services</InputLabel>
//                   <Select
//                     labelId="services-label"
//                     id="services"
//                     name="services"
//                     multiple
//                     value={formik.values.services}
//                     onChange={(e) => formik.setFieldValue('services', e.target.value)}
//                     input={<OutlinedInput label="Select Services" />}
//                     disabled={!formik.values.serviceCategory}
//                     renderValue={(selected) => (
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {selected?.map((value) => {
//                           const service = spaServices.find((s) => s._id === value);
//                           return <Chip key={value} label={`${service?.name} (${service?.price || 0})`} />;
//                         })}
//                       </div>
//                     )}
//                   >
//                     {filteredServices?.map((service) => (
//                       <MenuItem key={service._id} value={service._id}>
//                         {service.name} - ${service.price}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {formik.touched.services && formik.errors.services && <FormHelperText>{formik.errors.services}</FormHelperText>}
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   id="description"
//                   name="description"
//                   label="Description"
//                   multiline
//                   rows={3}
//                   fullWidth
//                   value={formik.values.description}
//                   onChange={formik.handleChange}
//                   error={formik.touched.description && Boolean(formik.errors.description)}
//                   helperText={formik.touched.description && formik.errors.description}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField label="Total Price" value={totalPrice} fullWidth InputProps={{ readOnly: true }} />
//               </Grid>

//               <Grid item xs={12}>
//                 <FormControl fullWidth>
//                   <InputLabel id="discount-type-label">Discount Type</InputLabel>
//                   <Select
//                     labelId="discount-type-label"
//                     id="discountType"
//                     name="discountType"
//                     value={formik.values.discountType}
//                     onChange={(e) => formik.setFieldValue('discountType', e.target.value)}
//                     input={<OutlinedInput label="Discount Type" />}
//                   >
//                     <MenuItem value="none">None</MenuItem>
//                     <MenuItem value="flat">Flat</MenuItem>
//                     <MenuItem value="percentage">Percentage</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               {formik.values.discountType !== 'none' && (
//               <Grid item xs={12}>
//               <TextField
//                 id="discountValue"
//                 name="discountValue"
//                 type="number"
//                 label="Discount Value"
//                 fullWidth
//                 value={formik.values.discountValue}
//                 onChange={formik.handleChange}
//                 error={formik.touched.discountValue && Boolean(formik.errors.discountValue)}
//                 helperText={formik.touched.discountValue && formik.errors.discountValue}
//                 InputProps={{
//                   inputProps: { 
//                     min: 0, // Prevent negative values
//                     onWheel: (e) => {
//                       // Prevent the default behavior of mouse wheel changing the value
//                       e.preventDefault();
//                       // Remove focus from the input to ensure the value doesn't change
//                       e.target.blur();
//                     }
//                   }
//                 }}
//               />
//             </Grid>
//               )}

//               <Grid item xs={12}>
//                 <TextField label="Final Price After Discount" value={finalPrice} fullWidth InputProps={{ readOnly: true }} />
//               </Grid>
//             </Grid>
//           </DialogContentText>
//         </form>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onCloseDialog} color="error" variant="outlined">
//           Cancel
//         </Button>
//         <Button onClick={formik.handleSubmit} variant="contained" color="primary">
//           Add Package
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddPackage;
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
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
import { getApi, postApi } from 'views/services/api';
import * as Yup from 'yup';

const AddPackage = ( { open, onClose, onSuccess } ) => {
  const [ spaServices, setSpaServices ] = useState( [] );
  const [ totalPrice, setTotalPrice ] = useState( 0 );
  const [ finalPrice, setFinalPrice ] = useState( 0 );
  const [ serviceCategories, setServiceCategories ] = useState( [] );

  const validationSchema = Yup.object().shape( {
    name: Yup.string().required( 'Package name is required' ),
    description: Yup.string(),
    serviceCategories: Yup.array().of( Yup.string().required() ).min( 1, 'At least one category must be selected' ),
    services: Yup.array().of( Yup.string().required() ).min( 1, 'At least one service must be selected' ),
    discountType: Yup.string().oneOf( [ 'none', 'flat', 'percentage' ] ),
    discountValue: Yup.number().when( 'discountType', {
      is: ( val ) => val !== 'none',
      then: ( schema ) => schema.required( 'Discount value is required' ).min( 0, 'Discount must be 0 or more' ),
      otherwise: ( schema ) => schema.notRequired()
    } )
  } );

  const initialValues = {
    name: '',
    description: '',
    serviceCategories: [],
    services: [],
    discountType: 'none',
    discountValue: ''
  };

  const calculatePrices = ( services ) => {
    const selectedServices = spaServices.filter( ( s ) => services.includes( s._id ) );
    const total = selectedServices.reduce( ( sum, s ) => sum + Number( s.price || 0 ), 0 );
    return total;
  }


  const formik = useFormik( {
    initialValues,
    validationSchema,
    onSubmit: async ( values ) => {
      try {
        const servicesTotal = calculatePrices( values.services );

        let discount = 0;

        if ( values.discountType === 'flat' ) {
          discount = Number( values.discountValue );
        } else if ( values.discountType === 'percentage' ) {
          discount = Math.round( ( Number( values.discountValue ) / 100 ) * servicesTotal );
        }

        const final = Math.max( 0, Math.round( servicesTotal - discount ) );

        const payload = {
          name: values.name,
          description: values.description,
          price: final, // final price after discount
          serviceCategories: values.serviceCategories,
          services: values.services,
          servicesTotal: servicesTotal,
          discountType: values.discountType,
          discountValue: Number( values.discountValue ) || 0
        };

        const response = await postApi( 'api/spa/packages', payload );

        if ( response.status === 200 ) {
          toast.success( 'Package added successfully' );
          formik.resetForm();
          onClose(); // Close the modal
          if ( onSuccess ) onSuccess(); // Call the success callback if provided
        } else {
          toast.error( response.response.data.error || 'Something went wrong' );
        }
      } catch ( e ) {
        toast.error( e?.response?.data?.error || 'An error occurred' );
      }
    }
  } );

  const onCloseDialog = () => {
    formik.resetForm();
    onClose();
  };

  useEffect( () => {
    const fetchServices = async () => {
      try {
        const res = await getApi( 'api/spa/services' );

        // Set spa services
        setSpaServices( res.data );

        // Extract unique categories from services
        const categories = [ ...new Set( res.data.map( ( service ) => service.category ) ) ];
        setServiceCategories( categories.filter( ( category ) => category !== undefined && category !== null ) );
      } catch ( error ) {
        toast.error( 'Failed to fetch services' );
      }
    };
    fetchServices();
  }, [] );



  useEffect( () => {
    const selectedServices = spaServices.filter( ( s ) => formik.values.services.includes( s._id ) );
    const total = selectedServices.reduce( ( sum, s ) => sum + Number( s.price || 0 ), 0 );
    let discount = 0;

    if ( formik.values.discountType === 'flat' ) {
      discount = Number( formik.values.discountValue );
    } else if ( formik.values.discountType === 'percentage' ) {
      discount = Math.round( ( Number( formik.values.discountValue ) / 100 ) * total );
    }

    const final = Math.max( 0, Math.round( total - discount ) );
    setTotalPrice( total );
    setFinalPrice( final );

  }, [ formik.values.services, formik.values.discountType, formik.values.discountValue, spaServices ] );

  return (
    <Dialog
      open={ open }
      onClose={ onCloseDialog }
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title" style={ { display: 'flex', justifyContent: 'space-between' } }>
        <Typography variant="h3">Add Spa Package</Typography>
        <ClearIcon onClick={ onCloseDialog } style={ { cursor: 'pointer' } } />
      </DialogTitle>

      <DialogContent dividers>
        <form>
          <DialogContentText>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <TextField
                  id="name"
                  name="name"
                  label="Package Name"
                  fullWidth
                  value={ formik.values.name }
                  onChange={ formik.handleChange }
                  error={ formik.touched.name && Boolean( formik.errors.name ) }
                  helperText={ formik.touched.name && formik.errors.name }
                />
              </Grid>

              <Grid item xs={ 12 }>
                <FormControl fullWidth error={ formik.touched.serviceCategories && Boolean( formik.errors.serviceCategories ) }>
                  <InputLabel id="serviceCategories-label">Service Categories</InputLabel>
                  <Select
                    labelId="serviceCategories-label"
                    id="serviceCategories"
                    name="serviceCategories"
                    multiple
                    value={ formik.values.serviceCategories }
                    onChange={ ( e ) => formik.setFieldValue( 'serviceCategories', e.target.value ) }
                    input={ <OutlinedInput label="Service Categories" /> }
                  >
                    { serviceCategories.map( ( category ) => (
                      <MenuItem key={ category } value={ category }>
                        { category }
                      </MenuItem>
                    ) ) }
                  </Select>
                  { formik.touched.serviceCategories && formik.errors.serviceCategories && (
                    <FormHelperText>{ formik.errors.serviceCategories }</FormHelperText>
                  ) }
                </FormControl>
              </Grid>

              <Grid item xs={ 12 }>
                <FormControl fullWidth error={ formik.touched.services && Boolean( formik.errors.services ) }>
                  <InputLabel id="services-label">Select Services</InputLabel>
                  <Select
                    labelId="services-label"
                    id="services"
                    name="services"
                    multiple
                    value={ formik.values.services }
                    onChange={ ( e ) => formik.setFieldValue( 'services', e.target.value ) }
                    input={ <OutlinedInput label="Select Services" /> }
                    renderValue={ ( selected ) => (
                      <div style={ { display: 'flex', flexWrap: 'wrap', gap: 4 } }>
                        { selected?.map( ( value ) => {
                          const service = spaServices.find( ( s ) => s._id === value );
                          return <Chip key={ value } label={ `${ service?.name } (${ service?.price || 0 })` } />;
                        } ) }
                      </div>
                    ) }
                  >
                    { spaServices
                      .filter( service => formik.values.serviceCategories.includes( service.category ) )
                      .map( ( service ) => (
                        <MenuItem key={ service._id } value={ service._id }>
                          { service.name } - ${ service.price }
                        </MenuItem>
                      ) ) }
                  </Select>
                  { formik.touched.services && formik.errors.services && <FormHelperText>{ formik.errors.services }</FormHelperText> }
                </FormControl>
              </Grid>

              <Grid item xs={ 12 }>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={ 3 }
                  fullWidth
                  value={ formik.values.description }
                  onChange={ formik.handleChange }
                  error={ formik.touched.description && Boolean( formik.errors.description ) }
                  helperText={ formik.touched.description && formik.errors.description }
                />
              </Grid>

              <Grid item xs={ 12 }>
                <TextField label="Total Price" value={ totalPrice } fullWidth InputProps={ { readOnly: true } } />
              </Grid>

              <Grid item xs={ 12 }>
                <FormControl fullWidth>
                  <InputLabel id="discount-type-label">Discount Type</InputLabel>
                  <Select
                    labelId="discount-type-label"
                    id="discountType"
                    name="discountType"
                    value={ formik.values.discountType }
                    onChange={ ( e ) => formik.setFieldValue( 'discountType', e.target.value ) }
                    input={ <OutlinedInput label="Discount Type" /> }
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="flat">Flat</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              { formik.values.discountType !== 'none' && (
                <Grid item xs={ 12 }>
                  <TextField
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    label="Discount Value"
                    fullWidth
                    value={ formik.values.discountValue }
                    onChange={ formik.handleChange }
                    error={ formik.touched.discountValue && Boolean( formik.errors.discountValue ) }
                    helperText={ formik.touched.discountValue && formik.errors.discountValue }
                    InputProps={ {
                      inputProps: {
                        min: 0, // Prevent negative values
                        onWheel: ( e ) => {
                          // Prevent the default behavior of mouse wheel changing the value
                          e.preventDefault();
                          // Remove focus from the input to ensure the value doesn't change
                          e.target.blur();
                        }
                      }
                    } }
                  />
                </Grid>
              ) }

              <Grid item xs={ 12 }>
                <TextField label="Final Price After Discount" value={ finalPrice } fullWidth InputProps={ { readOnly: true } } />
              </Grid>
            </Grid>
          </DialogContentText>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={ onCloseDialog } color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={ formik.handleSubmit } variant="contained" color="primary">
          Add Package
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPackage;