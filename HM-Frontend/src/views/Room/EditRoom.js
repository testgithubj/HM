/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormHelperText, FormLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import Palette from '../../ui-component/ThemePalette';
import { roomSchema } from 'schema';
import { Checkbox, FormControlLabel, FormGroup, FormControl } from '@mui/material';

const EditRoom = ( props ) => {
  const { open, handleClose, data } = props;

  const initialValues = {
    roomNo: data?.roomNo || '',
    roomType: data?.roomType || 'default',
    amount: data?.amount || '',
    ac: data?.ac || 'Non-AC',
    smoking: data?.smoking || 'Non-Smoking'
  };

  const handleCheckboxChange = ( e, field ) => {
    const { checked } = e.target;
    formik.setFieldValue( field, checked ? e.target.name : ( field === 'ac' ? 'Non-AC' : 'Non-Smoking' ) );
  };

  const AddData = async ( values ) => {
    if ( !data?._id ) {
      toast.error( 'Room ID is missing. Cannot update the room.' );
      return;
    }

    try {
      let response = await patchApi( `api/room/edit/${ data._id }`, values );
      if ( response.status === 200 ) {
        formik.resetForm();
        toast.success( 'Room Successfully Modified' );
      } else {
        toast.error( response.response?.data?.error || 'Something went wrong' );
      }
    } catch ( e ) {
      if ( e.response && e.response.data && e.response.data.error ) {
        toast.error( e.response.data.error );
      } else if ( e.message ) {
        toast.error( `Unexpected error: ${ e.message }` );
      } else {
        toast.error( 'An unexpected error occurred' );
      }
    }
  };

  const formik = useFormik( {
    initialValues,
    validationSchema: roomSchema,
    enableReinitialize: true,
    onSubmit: async ( values ) => {
      AddData( values );
      handleClose();
    }
  } );

  return (
    <div>
      <Dialog open={ open } onClose={ handleClose } aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={ {
            display: 'flex',
            justifyContent: 'space-between'
          } }
        >
          <Typography variant="h6">Edit Room</Typography>
          <Typography>
            <ClearIcon onClick={ handleClose } style={ { cursor: 'pointer' } } />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={ -1 }>
              <Grid container rowSpacing={ 3 } columnSpacing={ { xs: 0, sm: 5, md: 4 } }>
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormLabel>Room No</FormLabel>
                  <TextField
                    id="roomNo"
                    name="roomNo"
                    label=""
                    size="small"
                    fullWidth
                    placeholder="Enter Room Number"
                    value={ formik.values.roomNo }
                    onChange={ formik.handleChange }
                    error={ formik.touched.roomNo && Boolean( formik.errors.roomNo ) }
                    helperText={ formik.touched.roomNo && formik.errors.roomNo }
                  />
                </Grid>

                {/* Room type */ }
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    id="roomType"
                    name="roomType"
                    size="small"
                    fullWidth
                    value={ formik.values.roomType }
                    onChange={ formik.handleChange }
                    error={ formik.touched.roomType && Boolean( formik.errors.roomType ) }
                  >
                    <MenuItem value="default" disabled>
                      Select Room Type
                    </MenuItem>
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="triple">Triple</MenuItem>
                    <MenuItem value="family">Family</MenuItem>
                  </Select>
                  <FormHelperText error={ formik.touched.roomType && formik.errors.roomType }>
                    { formik.touched.roomType && formik.errors.roomType }
                  </FormHelperText>
                </Grid>

                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormLabel>Amount</FormLabel>
                  <TextField
                    id="amount"
                    name="amount"
                    type="number"
                    label=""
                    size="small"
                    fullWidth
                    placeholder="Enter Room Amount"
                    value={ formik.values.amount }
                    onChange={ formik.handleChange }
                    error={ formik.touched.amount && Boolean( formik.errors.amount ) }
                    helperText={ formik.touched.amount && formik.errors.amount }
                  />
                </Grid>

                {/* AC/Non-AC Selection */ }
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">AC Type</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ formik.values.ac === 'AC' }
                            onChange={ ( e ) => handleCheckboxChange( e, 'ac' ) }
                            name="AC"
                          />
                        }
                        label="AC"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ formik.values.ac === 'Non-AC' }
                            onChange={ ( e ) => handleCheckboxChange( e, 'ac' ) }
                            name="Non-AC"
                          />
                        }
                        label="Non-AC"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>

                {/* Smoking/Non-Smoking Selection */ }
                <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Smoking Availability</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ formik.values.smoking === 'Smoking' }
                            onChange={ ( e ) => handleCheckboxChange( e, 'smoking' ) }
                            name="Smoking"
                          />
                        }
                        label="Smoking"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ formik.values.smoking === 'Non-Smoking' }
                            onChange={ ( e ) => handleCheckboxChange( e, 'smoking' ) }
                            name="Non-Smoking"
                          />
                        }
                        label="Non-Smoking"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleClose } color="error">
            Cancel
          </Button>
          <Button
            onClick={ formik.handleSubmit }
            variant="contained"
            sx={ {
              backgroundColor: Palette.info,
              '&:hover': { backgroundColor: Palette.infoDark }
            } }
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditRoom;