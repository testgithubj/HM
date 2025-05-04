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
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import AddProperty from '../AddEmployee';
import DeleteProperty from '../DeleteEmployee';
import EditProperty from '../EditEmployee';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import moment from 'moment';
import { getApi } from 'views/services/api';
import ChangePasswordForStaff from './ChangePassword';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('1');
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openPasswordChange, setPasswordChange] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEditlead = () => setOpenEdit(true);
  const handleCloseEditlead = () => setOpenEdit(false);
  const handleOpenDeleteLead = () => setDeleteDialogOpen(true);
  const handleCloseDeleteLead = () => setDeleteDialogOpen(false);
  const handleOpenPasswordChange = () => setPasswordChange(true);
  const handleClosePasswordChange = () => setPasswordChange(false);

  const [employeeData, setEmployeeData] = useState([]);
  const [employeEmail, setEmployeeEmail] = useState('');
  const params = useParams();
  const employeeId = params.id;

  const fetchEmployeeData = async () => {
    try {
      const response = await getApi(`api/employee/view/${employeeId}`);
      console.log('datdaaaaaaaa=========>', response);
      setEmployeeData(response?.data?.employeeData[0]);
      setEmployeeEmail(response?.data?.employeeData[0].email);
    } catch (error) {
      console.log(error);
    }
  };

  console.log('set email =========>', employeEmail);

  useEffect(() => {
    fetchEmployeeData();
  }, [openAdd, openEdit, deleteDialogOpen]);

  return (
    <>
      <DeleteProperty open={deleteDialogOpen} handleClose={handleCloseDeleteLead} />
      <AddProperty open={openAdd} handleClose={handleCloseAdd} />
      <EditProperty open={openEdit} handleClose={handleCloseEditlead} employeeData={employeeData} />
      <ChangePasswordForStaff open={openPasswordChange} handleClose={handleClosePasswordChange} employeEmail={employeEmail} />

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
              <Tab label="Information" value="1" />
            </TabList>

            {/* //-----------buttons-------------------- */}
            <div>
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
              <Grid  container spacing={2}>
                <Grid item sx={{width:'100%'}} md={12}>
                  {/* //-------------------- */}
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold">
                      Employee Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">First Name</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.firstName ? employeeData.firstName : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Last Name :</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.lastName ? employeeData.lastName : 'N/A'}</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Employee Type:</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.employeeType ? employeeData.employeeType : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Email Id :</Typography>
                        <Typography style={{ color: 'black', display: 'flex', flexDirection: 'column', wordWrap: 'break-word' }}>{employeeData.email ? employeeData.email : 'N/A'}</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Salary :</Typography>
                        <Typography style={{ color: 'black' }}>${employeeData.salary ? employeeData.salary : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Working Shift :</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.shift ? employeeData.shift : 'N/A'}</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Address :</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.address ? employeeData.address : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Joining Date :</Typography>
                        {employeeData.createdDate ? (
                          <Typography variant="body1">{moment(employeeData.createdDate).format('YYYY-MM-DD ( hh : mm : ss )')}</Typography>
                        ) : (
                          <Typography variant="body1">N/A</Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px', }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Id Card Type :</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.idCardType ? employeeData.idCardType : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Id Card Number :</Typography>
                        <Typography style={{ color: 'black' }}>{employeeData.idcardNumber ? employeeData.idcardNumber : 'N/A'}</Typography>
                      </Grid>


                      <Grid sx={{ paddingX:{md:'15px',xs:'0px'}, display: 'flex',gap:{xs:'10px',lg:'0px'},marginTop:{xs:'10px',md:'0px'}, flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Grid sx={{justifyContent:'center' ,alignItems:'center',width:'100%',textAlign:{xs:'center',md:'left'}}} item  md={6}>
                          <Typography  variant="h5">Phone :</Typography>
                          <Typography style={{ color: 'black', }}>{employeeData.phoneNumber ? employeeData.phoneNumber : 'N/A'}</Typography>
                        </Grid>
                        <Grid sx={{ paddingX:{md:'15px',xs:'0px'},marginTop:"15px",textAlign: { xs: 'center', md: 'left' }, width: '100%' }} item md={6}>
                          <Typography sx={{ width: '100%' }} variant="h5">ID Proof Front :</Typography>
                          <Typography style={{ color: 'black', marginTop: '7px' }}>
                            <a href={employeeData?.idFile} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                              <Button startIcon={<VisibilityIcon />} variant="contained" color="primary">
                                View ID Proof Front
                              </Button>
                            </a>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid sx={{ display: 'flex',gap:{xs:'10px',lg:'0px'},marginTop:{xs:'10px',md:'0px'}, flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                      <Grid sx={{ paddingX:{md:'15px',xs:'0px'}, textAlign: { xs: 'center', md: 'left' }, width: '100%' }} item  md={6}>
                        <Typography sx={{ width: '100%',display:'flex',justifyContent:{xs:'center',md:'left' }}} variant="h5">ID Proof Back:</Typography>
                        <Typography style={{ color: 'black', marginTop: '7px' }}>
                          <a  href={employeeData?.idFile2} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button  startIcon={<VisibilityIcon />} variant="contained" color="primary">
                              View ID Proof Back
                            </Button>
                          </a>
                        </Typography>
                      </Grid>
                      </Grid>

                    </Grid>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
        <Grid item xs={12} md={12} sx={{ display: 'flex',flexDirection:{xs:'column',md:"row"} ,justifyContent: 'end', gap: 3 }}>
          <Button variant="outlined" startIcon={<ChangeCircleIcon icon="eva:plus-fill" />} onClick={handleOpenPasswordChange}>
            Change Password
          </Button>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            sx={{ color: '#673ab7', borderColor: '#673ab7' }}
            onClick={handleOpenEditlead}
          >
            Edit
          </Button>
          <Button startIcon={<DeleteIcon />} variant="outlined" color="error" onClick={handleOpenDeleteLead}>
            Delete
          </Button>
        </Grid>
      </Box>
    </>
  );
}
