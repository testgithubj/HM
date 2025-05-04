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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment/moment';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { getApi } from 'views/services/api';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function PaymentDashboard() {
  const navigate = useNavigate();

  //function for fetching property data based on the property id

  // ----------------------------------------------------------------------
  const [complaintData, setComplaintData] = useState([]);
  const params = useParams();
  const complaintId = params.id;

  const fetchcomplaintData = async () => {
    try {
      const response = await getApi(`api/complaint/view/${complaintId}`);
      setComplaintData(response?.data?.complaintData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchcomplaintData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value="1">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <TabList aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
              <Tab label="Information" value="1" />
            </TabList>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ margin: '12px', color: '#673ab7', borderColor: '#673ab7' }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            {/* //-----------buttons-------------------- */}
          </Box>
          <TabPanel value="1">
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  {/* //-------------------- */}
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold">
                      Complaint Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Complaint Type</Typography>
                        <Typography style={{ color: 'black' }}>{complaintData.type ? complaintData.type : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Complaint Status :</Typography>
                        <Typography style={{ color: 'black' }}>
                          {complaintData.status === true ? <Box sx={{ color: '#42a142' }}>Resolved</Box> : <Box>Pending</Box>}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">Complaint Created On:</Typography>
                        <Typography style={{ color: 'black' }}>
                          {complaintData.createdDate ? moment(complaintData.createdDate).format('YYYY-MM-DD') : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={12}>
                        <Typography variant="h5">Complaint Description :</Typography>
                        <Typography style={{ color: 'black' }}>{complaintData.description ? complaintData.description : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
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
