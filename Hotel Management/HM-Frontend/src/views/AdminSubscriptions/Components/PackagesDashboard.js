import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getApi } from 'views/services/api';

export default function PackagesDashboard() {
  const navigate = useNavigate();
  const [packagesData, setpackagesData] = useState([]);
  const params = useParams();
  const packageId = params.id;

  const fetchpackagesData = async () => {
    try {
      const response = await getApi(`api/packages/getspecificpackage/${packageId}`);
      setpackagesData(response?.data?.packagesData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchpackagesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container maxWidth="100%" sx={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}></Container>
      <Stack
        direction="row"
        alignItems="center"
        mb={5}
        justifyContent={'space-between'}
        sx={{
          backgroundColor: '#fff',
          fontSize: '18px',
          fontWeight: '500',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px',
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Typography variant="h4">Package Details</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: '#673ab7',
            borderColor: '#673ab7',
            '&:hover': {
              borderColor: '#563099'
            }
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Stack>

      <Box width="100%">
        <Card
          style={{
            minHeight: '600px',
            paddingTop: '15px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            borderRadius: '5px'
          }}
        >
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Package Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                          Package Title
                        </Typography>
                        <Typography sx={{ color: '#000', fontSize: '1rem' }}>{packagesData.title || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                          Amount
                        </Typography>
                        <Typography sx={{ color: '#000', fontSize: '1rem' }}>${packagesData.amount || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                          Created On
                        </Typography>
                        <Typography sx={{ color: '#000', fontSize: '1rem' }}>
                          {packagesData.createdOn ? moment(packagesData.createdOn).format('YYYY-MM-DD') : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                          Days
                        </Typography>
                        <Typography sx={{ color: '#000', fontSize: '1rem' }}>{packagesData.days || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ mb: 1, color: '#666' }}>
                          Description
                        </Typography>
                        <Typography sx={{ color: '#000', fontSize: '1rem' }}>{packagesData.description || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}></Box>
          </Box>
        </Card>
      </Box>
    </>
  );
}
