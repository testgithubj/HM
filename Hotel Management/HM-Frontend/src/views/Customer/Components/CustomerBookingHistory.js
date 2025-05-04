import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Card, Container, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import TableStyle from 'ui-component/TableStyle';
import { getApi } from 'views/services/api';

const Item = styled( Paper )( ( { theme } ) => ( {
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing( 2 ),
  textAlign: 'left',
  color: theme.palette.text.secondary
} ) );

export default function CustomerBookingHistory () {
  const navigate = useNavigate();
  const [ tabOption, setTabOption ] = useState( '1' );
  const [ billData, setbillData ] = useState( [] );
  const [ totalFoodAmount, setTotalFoodAmount ] = useState( 0 );
  const [ reservationData, setReservationData ] = useState( [] );
  const params = useParams();
  const reservationId = params.id;

  const fetechReservationData = async () => {
    try {
      console.log( 'api hit =>', `api/reservation/view/${ reservationId }` );
      const response = await getApi( `api/reservation/view/${ reservationId }` );
      console.log( 'here is the response =>', response );
      setReservationData( response.data.reservationData[ 0 ] );
    } catch ( error ) {
      console.log( error );
    }
  };

  const fetchSingleBillData = async () => {
    try {
      const response = await getApi( `api/singleinvoice/view/${ reservationId }` );
      response.data.InvoiceData && setbillData( ( prevBillData ) => [ ...( prevBillData || [] ), ...response.data.InvoiceData ] );
    } catch ( error ) {
      console.log( error );
    }
  };

  // function for fetching all the contacts data from the db

  const fetchbillData = async () => {
    try {
      const response = await getApi( `api/invoice/view/${ reservationId }` );
      setbillData( response?.data?.InvoiceData );
      console.log( 'data ==>', response );
    } catch ( error ) {
      console.log( error );
    }
  };

  useEffect( () => {
    fetechReservationData();
    fetchbillData();
    fetchSingleBillData();
  }, [] );

  const handleGenerateBill = ( billItem ) => {
    // console.log(billItem, 'billItem')
    if ( billItem.type === 'room' || billItem.type === 'food' ) {
      navigate( `/roombill/view/${ billItem._id }` );
    } else {
      navigate( `/singlebill/view/${ billItem.reservationId }` );
    }
  };

  const calculateTotalFoodAmount = () => {
    if ( !reservationData || !reservationData.foodItems ) {
      return 0;
    }

    const totalFoodAmount = reservationData.foodItems.reduce( ( total, foodData ) => {
      return total + foodData.quantity * foodData.price;
    }, 0 );
    console.log( 'totalFoodAmount =>', totalFoodAmount );

    return totalFoodAmount;
  };

  useEffect( () => {
    setTotalFoodAmount( calculateTotalFoodAmount() );
  }, [ reservationData ] );

  const columns = [
    {
      field: `invoiceNumber`,
      headerName: 'Invoice Number',
      flex: 1.5,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: ( params ) => {
        return (
          <Box>
            <Box onClick={ () => handleGenerateBill( params?.row ) }>{ params.value }</Box>
          </Box>
        );
      }
    },
    {
      field: `name`,
      headerName: 'Name',
      flex: 1,
      cellClassName: ' name-column--cell--capitalize',

      renderCell: ( params ) => {
        return (
          <Box>
            <Box>{ params.value }</Box>
            <div style={ { marginTop: '4px', fontSize: '12px', color: '#777' } }>{ params.row.customerPhoneNumber }</div>
          </Box>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    },

    {
      field: 'type',
      headerName: 'Invoice Type',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.row.type ? params.value : 'Food+Room' }</Box>;
      }
    },
    {
      field: 'foodAmount',
      headerName: 'Food Amount',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Box>
            { params.row.totalFoodAmount ? `$${ params.row.totalFoodAmount }` : params.row.foodAmount ? `$${ params.row.foodAmount }` : 'N/A' }
          </Box>
        );
      }
    },
    {
      field: 'roomRent',
      headerName: 'Room Amount',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Box>
            { params.row.totalRoomAmount ? `$${ params.row.totalRoomAmount }` : params.row.roomRent ? `$${ params.row.roomRent }` : 'N/A' }
          </Box>
        );
      }
    },
    {
      field: 'advanceAmount',
      headerName: 'Advance Amount',
      flex: 1,
      renderCell: ( params ) => {
        return (
          <Box>
            { params.row.totalRoomAmount
              ? 'N/A'
              : params.row.advanceAmount
                ? `$${ params.row.advanceAmount }`
                : params.row.totalRoomAmount
                  ? 'N/A'
                  : 'N/A' }
          </Box>
        );
      }
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.value ? `$${ params.value }` : ' N/A' }</Box>;
      }
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      renderCell: ( params ) => {
        return <Box>{ params.row.totalAmount ? `$${ params.row.totalAmount }` : `$${ params.row.totalFoodAndRoomAmount }` }</Box>;
      }
    }
  ];

  return (
    <>
      <Container maxWidth="100%" sx={ { paddingLeft: '0px !important', paddingRight: '0px !important' } }>
        <Stack
          direction="row"
          alignItems="center"
          mb={ 5 }
          justifyContent={ 'space-between' }
          sx={ {
            backgroundColor: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
          } }
        >
          <Typography variant="h4">Booking History</Typography>
          <Button
            variant="outlined"
            startIcon={ <ArrowBackIcon /> }
            sx={ { color: '#673ab7', borderColor: '#673ab7' } }
            onClick={ () => navigate( -1 ) }
          >
            Back
          </Button>
        </Stack>

        <Grid container spacing={ 2 } sx={ { marginBottom: 3 } }>
          {/* Room Information Card */ }
          <Grid item xs={ 12 } md={ 6 }>
            <Card
              style={ {
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                padding: '20px'
              } }
            >
              <Typography variant="h4" fontWeight="bold">
                Room Information
              </Typography>
              <hr />
              <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Room Number :</Typography>
                  <Typography style={ { color: 'black' } }>{ reservationData?.roomNo ? reservationData?.roomNo : 'N/A' }</Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Room Rent :</Typography>
                  <Typography style={ { color: 'black' } }>
                    ${ reservationData?.totalPayment ? reservationData?.totalPayment : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Advance Amount :</Typography>
                  <Typography style={ { color: 'black' } }>
                    ${ reservationData?.advanceAmount ? reservationData?.advanceAmount : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Remaining Amount:</Typography>
                  <Typography style={ { color: 'black' } }>${ reservationData?.totalAmount ? reservationData?.totalAmount : 'N/A' }</Typography>
                </Grid>
              </Grid>
              <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Check-In :</Typography>
                  <Typography style={ { color: 'black' } }>
                    { reservationData?.checkInDate ? moment( reservationData?.checkInDate ).format( 'YYYY-MM-DD' ) : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Check-Out:</Typography>
                  <Typography style={ { color: 'black' } }>
                    { reservationData?.checkOutDate ? moment( reservationData?.checkOutDate ).format( 'YYYY-MM-DD' ) : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Total Days :</Typography>
                  <Typography style={ { color: 'black' } }>{ reservationData?.totalDays ? reservationData?.totalDays : 'N/A' } days</Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Total Restaurant Expense :</Typography>
                  <Typography style={ { color: 'black' } }>${ totalFoodAmount ? totalFoodAmount : 'N/A' }</Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">Total Amount ( Room + Restaurant ) :</Typography>
                  <Typography style={ { color: 'black' } }>
                    ${ ' ' }
                    { reservationData?.totalPayment && totalFoodAmount
                      ? reservationData?.totalPayment + totalFoodAmount
                      : reservationData?.totalPayment }
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Customer Information Card */ }
          <Grid item xs={ 12 } md={ 6 }>
            <Card
              style={ {
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px',
                padding: '20px'
              } }
            >
              <Typography variant="h4" fontWeight="bold">
                Customer Information
              </Typography>
              <hr />
              <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                <Grid item xs={ 6 } md={ 5 }>
                  <Typography variant="h5">Name :</Typography>
                  <Typography style={ { color: 'black' } }>{ reservationData?.fullName ? reservationData?.fullName : 'N/A' }</Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 5 }>
                  <Typography variant="h5"> Email:</Typography>
                  <Typography style={ { color: 'black' } }>
                    { reservationData?.customerDetails?.email ? reservationData?.customerDetails?.email : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 5 }>
                  <Typography variant="h5"> Phone Number:</Typography>
                  <Typography style={ { color: 'black' } }>
                    { reservationData?.customerDetails?.phoneNumber ? reservationData?.customerDetails?.phoneNumber : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 5 }>
                  <Typography variant="h5">Addresss:</Typography>
                  <Typography style={ { color: 'black' } }>
                    { reservationData?.customerDetails?.address ? reservationData?.customerDetails?.address : 'N/A' }
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={ 2 } sx={ { justifyContent: 'between', alignItems: 'center', marginTop: '1px' } }>
                <Grid item xs={ 6 } md={ 5 }>
                  <Typography variant="h5">{ reservationData?.customerDetails?.idCardType } Number:</Typography>
                  <Typography style={ { color: 'black' } }>
                    { reservationData?.customerDetails?.idcardNumber ? reservationData?.customerDetails?.idcardNumber : 'N/A' }
                  </Typography>
                </Grid>
                <Grid item xs={ 6 } md={ 6 }>
                  <Typography variant="h5">ID Proof:</Typography>
                  <Typography style={ { color: 'black', marginTop: '7px' } }>
                    <a href={ reservationData?.idFile } target="_blank" rel="noreferrer" style={ { textDecoration: 'none' } }>
                      <Button startIcon={ <VisibilityIcon /> } variant="contained" color="primary">
                        View ID Proof
                      </Button>
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {/* Invoices Table */ }
        <TableStyle>
          <Box width="100%">
            <Card
              style={ {
                height: '600px',
                paddingTop: '15px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                borderRadius: '5px'
              } }
            >
              { billData && (
                <DataGrid
                  rows={ billData }
                  columns={ columns }
                  getRowId={ ( row ) => row?._id }
                  sx={ {
                    '& .MuiDataGrid-toolbarContainer': {
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginBottom: '15px',
                      padding: '8px 16px',
                      gap: '8px'
                    },
                    '& .MuiButton-root': {
                      border: '1px solid #e0e0e0',
                      color: '#121926',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      textTransform: 'none',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        borderColor: '#d0d0d0'
                      }
                    },
                    '& .name-column--cell--capitalize': {
                      textTransform: 'capitalize'
                    }
                  } }
                />
              ) }
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
}
