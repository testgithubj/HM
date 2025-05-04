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
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router';

import { useParams } from 'react-router';
import { useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

import moment from 'moment';

import { getApi } from 'views/services/api';
import DeleteVisitor from '../DeleteVisitor';
import EditVisitor from '../EditVisitors';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function VisitorDashboard() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('1');
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleOpenEditlead = () => setOpenEdit(true);
  const handleCloseEditlead = () => setOpenEdit(false);
  const handleOpenDeleteVisitor = () => setDeleteDialogOpen(true);
  const handleCloseDeleteVisitor = () => setDeleteDialogOpen(false);

  //function for fetching property data based on the property id

  // ----------------------------------------------------------------------
  const [visitorData, setVisitorData] = useState([]);
  const params = useParams();
  const phone = params.phone;

  const fetchVisitorData = async () => {
    try {
      // const response = await getApi(`api/visitors/view/${phone}?hotelId=${hotel._id}`);
      const response = await getApi(`api/visitors/view/${phone}?hotelId=${hotel?.hotelId}`);
      setVisitorData(response?.data?.visitorsData[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchVisitorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEdit, deleteDialogOpen]);

  return (
    <>
      <DeleteVisitor open={deleteDialogOpen} handleClose={handleCloseDeleteVisitor} />
      <EditVisitor open={openEdit} handleClose={handleCloseEditlead} data={visitorData} />

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
              <Tab label="Information" value="1" />
            </TabList>

            {/* //-----------buttons-------------------- */}
            <div>
              <Select value="" displayEmpty inputProps={{ 'aria-label': 'Select option' }} sx={{ marginBottom: '12px' }}>
                <MenuItem value="" disabled>
                  Action
                </MenuItem>

                <MenuItem onClick={handleOpenEditlead} sx={{ color: '#2196F3' }}>
                  <EditIcon sx={{ marginRight: 1 }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteVisitor} sx={{ color: '#FF0000' }}>
                  <DeleteIcon sx={{ marginRight: 1 }} />
                  Delete
                </MenuItem>
              </Select>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7' }}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </Box>
          <TabPanel value="1">
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  {/* //-------------------- */}
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold">
                      Customer Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">First Name</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.firstName ? visitorData?.firstName : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Last Name :</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.lastName ? visitorData?.lastName : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Email:</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.email ? visitorData?.email : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Address :</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.address ? visitorData?.address : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Id Card Type:</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.idCardType ? visitorData?.idCardType : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Id Card Number:</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.idcardNumber ? visitorData?.idcardNumber : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Phone Number:</Typography>
                        <Typography style={{ color: 'black' }}>{visitorData?.phoneNumber ? visitorData?.phoneNumber : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">ID Proof:</Typography>
                        <Typography style={{ color: 'black', marginTop: '7px' }}>
                          <a href={visitorData?.idFile} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button
                              startIcon={<VisibilityIcon style={{ marginRight: '1px', color: 'white' }} />}
                              variant="contained"
                              color="primary"
                            >
                              View ID Proof
                            </Button>
                          </a>
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{ marginTop: '10px' }}>
                        <Typography variant="h5">Visit Time :</Typography>
                        {visitorData?.visitTime ? (
                          <Typography variant="body1">{visitorData?.visitTime}</Typography>
                        ) : (
                          <Typography variant="body1">N/A</Typography>
                        )}
                      </Grid>
                      <Grid item xs={6} md={6} sx={{ marginTop: '10px' }}>
                        <Typography variant="h5">Created Date :</Typography>
                        {visitorData?.createdDate ? (
                          <Typography variant="body1">{moment(visitorData?.createdDate).format('YYYY-MM-DD ( hh : mm : ss )')}</Typography>
                        ) : (
                          <Typography variant="body1">N/A</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
        <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'end', gap: 3 }}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7' }}
            onClick={handleOpenEditlead}
          >
            Edit
          </Button>
          <Button startIcon={<DeleteIcon />} variant="outlined" color="error" onClick={handleOpenDeleteVisitor}>
            Delete
          </Button>
        </Grid>
      </Box>
    </>
  );
}
