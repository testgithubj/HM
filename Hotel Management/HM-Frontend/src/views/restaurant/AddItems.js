// import { FormLabel, Input } from '@mui/material';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { useFormik } from 'formik';
// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { restaurantSchema } from 'schema';
// import { patchApi, postApi } from 'views/services/api';

// const AddItems = (props) => {
//   const { open, handleClose, currentItem } = props;
//   console.log('props  ===>', props);

//   const [currentImg, setCurrentImg] = useState(null);

//   const initialValues = {
//     itemName: '',
//     itemImage: '',
//     amount: '',
//     category: ''
//   };

//   const AddData = async (values, resetForm) => {
//     console.log('in AddData values ==>', values);

//     const formData = new FormData();
//     Object.keys(values).forEach((key) => {
//       if (key === 'itemImage') {
//         formData.append('itemImage', values.itemImage);
//       } else {
//         formData.append(key, values[key]);
//       }
//     });

//     for (let pair of formData.entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }

//     try {
//       let response;
//       if (currentItem) {
//         console.log('currentItem   =====>', currentItem);
//         console.log('url hit =>', `api/restaurant/edit/${currentItem._id}`);

//         response = await patchApi(`api/restaurant/edit/${currentItem._id}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         response = await postApi('api/restaurant/add', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }

//       console.log('response ===>', response);

//       if (response.status === 200) {
//         toast.success('Item Added successfully');
//         handleClose();
//         resetForm();
//       } else {
//         toast.error('Cannot add item');
//       }
//     } catch (error) {
//       console.error('Failed to add item:', error);
//       toast.error('Cannot add item');
//     }
//   };

//   const formik = useFormik({
//     initialValues,
//     validationSchema: restaurantSchema,
//     onSubmit: async (values, { resetForm }) => {
//       console.log('values =>', values);

//       values.hotelId = JSON.parse(localStorage.getItem('hotelData')).hotelId;
//       console.log('values.hotelId =>', values.hotelId);
//       AddData(values, resetForm);
//     }
//   });

//   useEffect(() => {
//     if (currentItem) {
//       formik.setValues({
//         itemName: currentItem.itemName || '',
//         amount: currentItem.amount || '',
//         category: currentItem.category || ''
//       });
//       setCurrentImg(currentItem.itemImage);
//     }
//   }, [currentItem]);

//   return (
//     <div>
//       <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
//         <DialogTitle
//           id="scroll-dialog-title"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between'
//           }}
//         >
//           <Typography variant="h6">{currentItem ? 'Edit Item' : 'Add New Item'}</Typography>
//           <Typography>
//             <Button onClick={handleClose} style={{ color: 'red' }}>
//               Cancel
//             </Button>
//           </Typography>
//         </DialogTitle>

//         <DialogContent dividers>
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Category</FormLabel>
//                 <TextField
//                   id="category"
//                   name="category"
//                   size="small"
//                   fullWidth
//                   placeholder="Enter Category"
//                   value={formik.values.category}
//                   onChange={formik.handleChange}
//                   error={formik.touched.category && Boolean(formik.errors.category)}
//                   helperText={formik.touched.category && formik.errors.category}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Item Name</FormLabel>
//                 <TextField
//                   id="itemName"
//                   name="itemName"
//                   size="small"
//                   fullWidth
//                   placeholder="Enter Item Name"
//                   value={formik.values.itemName}
//                   onChange={formik.handleChange}
//                   error={formik.touched.itemName && Boolean(formik.errors.itemName)}
//                   helperText={formik.touched.itemName && formik.errors.itemName}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Amount</FormLabel>
//                 <TextField
//                   id="amount"
//                   name="amount"
//                   size="small"
//                   type="number"
//                   fullWidth
//                   placeholder="in $"
//                   value={formik.values.amount}
//                   onChange={formik.handleChange}
//                   error={formik.touched.amount && Boolean(formik.errors.amount)}
//                   helperText={formik.touched.amount && formik.errors.amount}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormLabel>Upload Item Image</FormLabel>
//                 <Input
//                   id="itemImage"
//                   name="itemImage"
//                   type="file"
//                   onChange={(event) => {
//                     formik.setFieldValue('itemImage', event.currentTarget.files[0]);
//                     setCurrentImg(null);
//                   }}
//                 />

//                 {currentImg && !formik.values.itemImage && <Typography>Current file: {currentImg}</Typography>}
//                 {formik.values.itemImage && formik.values.itemImage.name && (
//                   <Typography>Selected file: {formik.values.itemImage.name}</Typography>
//                 )}
//               </Grid>
//             </Grid>

//             <DialogActions>
//               <Button type="submit" variant="contained" color="primary">
//                 {currentItem ? 'Update Item' : 'Add Item'}
//               </Button>
//             </DialogActions>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// AddItems.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   currentItem: PropTypes.object
// };

// export default AddItems;

import { FormLabel, Input } from '@mui/material';
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
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { restaurantSchema } from 'schema';
import { patchApi, postApi } from 'views/services/api';

const AddItems = ( props ) => {
  const { open, handleClose, currentItem } = props;
  console.log( 'props  ===>', props );

  const [ currentImg, setCurrentImg ] = useState( null );

  const initialValues = {
    itemName: '',
    itemImage: null, // Initialize as null for file input
    amount: '',
    category: ''
  };

  const AddData = async ( values, resetForm ) => {
    console.log( 'in AddData values ==>', values );

    const formData = new FormData();
    Object.keys( values ).forEach( ( key ) => {
      if ( key === 'itemImage' ) {
        formData.append( 'itemImage', values.itemImage );
      } else {
        formData.append( key, values[ key ] );
      }
    } );

    for ( let pair of formData.entries() ) {
      console.log( `${ pair[ 0 ] }: ${ pair[ 1 ] }` );
    }

    try {
      let response;
      if ( currentItem ) {
        console.log( 'currentItem   =====>', currentItem );
        console.log( 'url hit =>', `api/restaurant/edit/${ currentItem._id }` );

        response = await patchApi( `api/restaurant/edit/${ currentItem._id }`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } );
      } else {
        response = await postApi( 'api/restaurant/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } );
      }

      console.log( 'response ===>', response );

      if ( response.status === 200 ) {
        toast.success( 'Item Added successfully' );
        handleClose();
        resetForm();
      } else {
        toast.error( 'Cannot add item' );
      }
    } catch ( error ) {
      console.error( 'Failed to add item:', error );
      toast.error( 'Cannot add item' );
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema: restaurantSchema,
    onSubmit: async ( values, { resetForm } ) => {
      console.log( 'values =>', values );

      values.hotelId = JSON.parse( localStorage.getItem( 'hotelData' ) ).hotelId;
      console.log( 'values.hotelId =>', values.hotelId );
      AddData( values, resetForm );
    }
  } );

  useEffect( () => {
    if ( currentItem ) {
      formik.setValues( {
        itemName: currentItem.itemName || '',
        amount: currentItem.amount || '',
        category: currentItem.category || '',
        itemImage: null // Resetting image when currentItem Changes.
      } );
      setCurrentImg( currentItem.itemImage );
    }
  }, [ currentItem ] );

  return (
    <div>
      <Dialog open={ open } aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={ {
            display: 'flex',
            justifyContent: 'space-between'
          } }
        >
          <Typography variant="h6">{ currentItem ? 'Edit Item' : 'Add New Item' }</Typography>
          <Typography>
            <Button onClick={ handleClose } style={ { color: 'red' } }>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={ formik.handleSubmit }>
            <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 5, md: 4 } }>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Category</FormLabel>
                <TextField
                  id="category"
                  name="category"
                  size="small"
                  fullWidth
                  placeholder="Enter Category"
                  value={ formik.values.category }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur } // Important for triggering validation
                  error={ formik.touched.category && Boolean( formik.errors.category ) }
                  helperText={ formik.touched.category && formik.errors.category }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Item Name</FormLabel>
                <TextField
                  id="itemName"
                  name="itemName"
                  size="small"
                  fullWidth
                  placeholder="Enter Item Name"
                  value={ formik.values.itemName }
                  onChange={ formik.handleChange }
                  error={ formik.touched.itemName && Boolean( formik.errors.itemName ) }
                  helperText={ formik.touched.itemName && formik.errors.itemName }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Amount</FormLabel>
                <TextField
                  id="amount"
                  name="amount"
                  size="small"
                  type="number"
                  fullWidth
                  placeholder="in $"
                  value={ formik.values.amount }
                  onChange={ formik.handleChange }
                  error={ formik.touched.amount && Boolean( formik.errors.amount ) }
                  helperText={ formik.touched.amount && formik.errors.amount }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 }>
                <FormLabel>Upload Item Image</FormLabel>
                <Input
                  id="itemImage"
                  name="itemImage"
                  type="file"
                  onChange={ ( event ) => {
                    formik.setFieldValue( 'itemImage', event.currentTarget.files[ 0 ] );
                    formik.setFieldTouched( 'itemImage', true ); // Mark as touched
                    setCurrentImg( null );
                  } }
                  onBlur={ formik.handleBlur } // Add onBlur for itemImage
                />

                { formik.touched.itemImage && formik.errors.itemImage && (
                  <Typography color="error">{ formik.errors.itemImage }</Typography>
                ) }

                { currentImg && !formik.values.itemImage && <Typography>Current file: { currentImg }</Typography> }
                { formik.values.itemImage && formik.values.itemImage.name && (
                  <Typography>Selected file: { formik.values.itemImage.name }</Typography>
                ) }
              </Grid>
            </Grid>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                { currentItem ? 'Update Item' : 'Add Item' }
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AddItems.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentItem: PropTypes.object
};

export default AddItems;