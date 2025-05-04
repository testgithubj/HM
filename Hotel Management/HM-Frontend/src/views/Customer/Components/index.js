import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import { getApi } from 'views/services/api';
import DeleteCustomer from '../DeleteCustomer';
import AddCustomer from '../AddCustomer';
import EditCustomer from '../EditCustomer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Item = styled( Paper )( ( { theme } ) => ( {
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing( 2 ),
  textAlign: 'left',
  color: theme.palette.text.secondary
} ) );

export default function CustomerDashboard () {
  const navigate = useNavigate();
  const [ value, setValue ] = useState( '1' );
  const [ openEdit, setOpenEdit ] = useState( false );
  const [ openAdd, setOpenAdd ] = useState( false );
  const [ deleteDialogOpen, setDeleteDialogOpen ] = useState( false );
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );

  const handleChange = ( event, newValue ) => {
    setValue( newValue );
  };

  const handleOpenAdd = () => setOpenAdd( true );
  const handleCloseAdd = () => setOpenAdd( false );
  const handleOpenEditlead = () => setOpenEdit( true );
  const handleCloseEditlead = () => setOpenEdit( false );
  const handleOpenDeleteCustomer = () => setDeleteDialogOpen( true );
  const handleCloseDeleteLead = () => setDeleteDialogOpen( false );

  const [ customerData, setCustomerData ] = useState( {} );
  const [ customerObjId, setCustomerObjId ] = useState( null );
  const [ reservationHistory, setReservationHistory ] = useState( [] );

  console.log( 'customer data check', customerData );

  const params = useParams();
  const phone = params.phone;
  const _id = params._id;
  console.log( 'params =>', params );
  console.log( 'id =>', _id );
  console.log( 'hotel idddd', hotel?._id );

  const fetchCustomerData = async () => {
    try {
      const response = await getApi( `api/customer/view/${ phone }?hotelId=${ hotel?._id }` );
      console.log( 'in information section response ==>', response );

      const customer = response?.data?.customerData[ 0 ];

      setCustomerData( customer );
      setCustomerObjId( customer?._id );
    } catch ( error ) {
      console.log( error );
    }
  };

  const fetchCustomerReservationHistory = async () => {
    if ( !customerObjId ) return;
    try {
      console.log( 'Fetching customer reservation history...' );
      console.log( 'url hit ===>', `api/customer/history/${ customerObjId }?hotelId=${ hotel?.hotelId }` );
      const response = await getApi( `api/customer/history/${ customerObjId }?hotelId=${ hotel?.hotelId }` );
      console.log( 'in history section response  ==>', response );
      setReservationHistory( response?.data || [] );
    } catch ( error ) {
      console.log( 'error ==>', error );
    }
  };
  console.log( 'reservationHistory =>>', reservationHistory );

  useEffect( () => {
    fetchCustomerData();
  }, [ openAdd, openEdit, deleteDialogOpen ] );

  useEffect( () => {
    fetchCustomerReservationHistory();
  }, [ customerObjId ] );

  const handleNavigate = ( id ) => {
    console.log( 'handleNavigate id ==>', id );
    navigate( `/dashboard/customer/view/specificbooking/${ id }` );
  };

  return (
    <>
      <DeleteCustomer open={ deleteDialogOpen } handleClose={ handleCloseDeleteLead } />
      <AddCustomer open={ openAdd } handleClose={ handleCloseAdd } />
      <EditCustomer open={ openEdit } handleClose={ handleCloseEditlead } data={ customerData } />

      <Box sx={ { width: '100%', typography: 'body1' } }>
        <TabContext value={ value }>
          <Box sx={ { borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' } }>
            <TabList onChange={ handleChange } aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
              <Tab label="Information" value="1" />
              <Tab label="History" value="2" />
            </TabList>

            <div>
              <Button
                variant="outlined"
                startIcon={ <ArrowBackIcon /> }
                sx={ { marginLeft: 2, color: '#673ab7', borderColor: '#673ab7' } }
                onClick={ () => navigate( -1 ) }
              >
                Back
              </Button>
            </div>
          </Box>

          <TabPanel value="1">
            <Box sx={ { flexGrow: 1, overflowX: 'auto' } }>
              <Grid container spacing={ 2 }>
                <Grid item xs={ 12 }>
                  <Item sx={ { height: '100%' } }>
                    <Typography variant="h4" fontWeight="bold">
                      Customer Information
                    </Typography>
                    <hr />
                    <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">First Name</Typography>
                        <Typography style={ { color: 'black' } }>{ customerData?.firstName || 'N/A' }</Typography>
                      </Grid>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">Last Name</Typography>
                        <Typography style={ { color: 'black' } }>{ customerData?.lastName || 'N/A' }</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">Email</Typography>
                        <Typography variant="h6" style={ { color: 'black' } }>
                          { customerData?.email || 'N/A' }
                        </Typography>
                      </Grid>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">Address</Typography>
                        <Typography style={ { color: 'black' } }>{ customerData?.address || 'N/A' }</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">Id Card Type</Typography>
                        <Typography style={ { color: 'black' } }>{ customerData?.idCardType || 'N/A' }</Typography>
                      </Grid>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">Id Card Number</Typography>
                        <Typography style={ { color: 'black' } }>{ customerData?.idcardNumber || 'N/A' }</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">Phone Number</Typography>
                        <Typography style={ { color: 'black' } }>{ customerData?.phoneNumber || 'N/A' }</Typography>
                      </Grid>
                      <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">ID Proof</Typography>
                        <Typography style={ { color: 'black', marginTop: '7px' } }>
                          <a href={ customerData?.idFile } target="_blank" rel="noreferrer" style={ { textDecoration: 'none' } }>
                            <Button
                              startIcon={ <VisibilityIcon style={ { marginRight: '1px', color: 'white' } } /> }
                              variant="contained"
                              color="primary"
                            >
                              View ID Proof
                            </Button>
                          </a>
                        </Typography>
                      </Grid>
                      {/* <Grid item xs={ 12 } sm={ 6 } md={ 6 }>
                        <Typography variant="h5">ID Proof Back</Typography>
                        <Typography style={ { color: 'black', marginTop: '7px' } }>
                          <a href={ customerData?.idFile2 } target="_blank" rel="noreferrer" style={ { textDecoration: 'none' } }>
                            <Button
                              startIcon={ <VisibilityIcon style={ { marginRight: '1px', color: 'white' } } /> }
                              variant="contained"
                              color="primary"
                            >
                              View ID Proof Back
                            </Button>
                          </a>
                        </Typography>
                      </Grid> */}
                    </Grid>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value="2">
            <Box sx={ { flexGrow: 1, overflowX: 'auto' } }>
              <Grid sx={ {
                minWidth: '100%',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  width: '0',
                  height: '0',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'transparent',
                },
                '*': {
                  scrollbarWidth: 'none',
                },
                msOverflowStyle: 'none',
              } } container spacing={ 2 }>
                <Grid sx={ {
                  minWidth: '900px',
                  fontSize: { xs: '12px', sm: '12px', lg: '14px' },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    fontSize: { xs: '12px', sm: '14px' }
                  },
                  '& .MuiDataGrid-cell': {
                    padding: { xs: '4px', sm: '8px' }
                  },
                  '& .MuiDataGrid-root': {
                    overflowX: 'auto'
                  }
                } } item xs={ 12 }>
                  <Item sx={ { height: '100%' } }>
                    <Typography variant="h4" fontWeight="bold" sx={ { p: 2 } }>
                      Reservation History
                    </Typography>
                    <TableContainer component={ Paper }>
                      <Table sx={ { minWidth: 650 } } aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Room No</TableCell>
                            <TableCell>Check-in Date</TableCell>
                            <TableCell>Check-out Date</TableCell>
                            <TableCell>Advance Amount</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Remaining Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          { reservationHistory.map( ( reservation ) => (
                            <TableRow key={ reservation._id }>
                              <TableCell
                                style={ { cellClassName: 'name-column--cell name-column--cell--capitalize' } }
                                onClick={ () => handleNavigate( reservation._id ) }
                              >
                                <span style={ { textDecoration: 'underline', color: 'blue', cursor: 'pointer' } }>{ reservation.roomNo }</span>
                              </TableCell>
                              <TableCell>{ new Date( reservation.checkInDate ).toLocaleDateString() }</TableCell>
                              <TableCell>{ new Date( reservation.checkOutDate ).toLocaleDateString() }</TableCell>
                              <TableCell>{ reservation.advanceAmount }</TableCell>
                              <TableCell>{ reservation.advanceAmount + reservation.totalAmount }</TableCell>
                              <TableCell>{ reservation.totalAmount }</TableCell>
                              <TableCell>{ reservation.status }</TableCell>
                            </TableRow>
                          ) ) }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
