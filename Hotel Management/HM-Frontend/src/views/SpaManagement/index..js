/* eslint-disable prettier/prettier */
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Card, Tab, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useMemo, useState } from 'react';
import Iconify from 'ui-component/iconify';
import Customers from './components/customers';
import SpaPackage from './components/spaPackages';
import AddPackage from './components/spaPackages/AddPackage';
import SpaServices from './components/spaServices';
import AddServiceForm from './components/spaServices/AddService';
import SpaStaff from './components/spaStaff';
import AddEmployee from './components/spaStaff/AddEmployee';

const SpaManagement = () => {
  const [tabOption, setTabOption] = useState('1');
  const [openAddServiceModal, setOpenAddServiceModal] = useState(false);
  const [openAddPackageModal, setOpenAddPackageModal] = useState(false);
  const [openAddSpaStaffModal, setOpenAddSpaStaffModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const addButtonLabel = useMemo(() => {
    if (tabOption === '1') {
      return 'Add Service';
    } else if (tabOption === '2') {
      return 'Add Package';
    } else if (tabOption === '3') {
      return 'Add Staff';
    } else {
      return null;
    }
  }, [tabOption]);

  const handleTabChange = (event, newValue) => {
    setTabOption(newValue);
  };

  const handleOpenAdd = () => {
    if (tabOption === '1') {
      setOpenAddServiceModal(true);
    } else if (tabOption === '2') {
      setOpenAddPackageModal(true);
    } else if (tabOption === '3') {
      setOpenAddSpaStaffModal(true);
    }
  };

  const handleCloseAddService = () => {
    setOpenAddServiceModal(false);
    setRefreshData((prev) => !prev); // Toggle to trigger refresh
  };

  const handleCloseAddPackage = () => {
    setOpenAddPackageModal(false);
    setRefreshData((prev) => !prev); // Toggle to trigger refresh
  };

  const handleCloseAddSpaStaff = () => {
    setOpenAddSpaStaffModal(false);
    setRefreshData((prev) => !prev); // Toggle to trigger refresh
  };

  const handleAddServiceSubmit = (serviceData) => {
    console.log('Adding new service:', serviceData);
    handleCloseAddService();
  };

  const handleAddPackageSubmit = (packageData) => {
    console.log('Adding new package:', packageData);
    handleCloseAddPackage();
  };

  const handleAddSpaStaffSubmit = (spaStaffData) => {
    console.log('Adding new staff:', spaStaffData);
    handleCloseAddSpaStaff();
  };

  return (
    <div>
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
        <Typography variant="h4">Spa Management</Typography>
        {addButtonLabel && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAdd}
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              padding: { xs: '4px 6px', sm: '8px 16px' },
              minWidth: 'auto',
              maxWidth: '100%',
              whiteSpace: 'nowrap'
            }}
          >
            {addButtonLabel}
          </Button>
        )}
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Card
          style={{
            minHeight: '400px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            borderRadius: '5px'
          }}
        >
          <TabContext value={tabOption}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <TabList onChange={handleTabChange} aria-label="spa management tabs" textColor="secondary" indicatorColor="secondary">
                <Tab label="Services" value="1" />
                <Tab label="Packages" value="2" />
                <Tab label="Staff Management" value="3" />
                <Tab label="Customers" value="4" />
              </TabList>
            </Box>

            <TabPanel value="1">
              <SpaServices refreshTrigger={refreshData} />
            </TabPanel>

            <TabPanel value="2">
              <SpaPackage refreshTrigger={refreshData} />
            </TabPanel>

            <TabPanel value="3">
              <SpaStaff refreshTrigger={refreshData} />
            </TabPanel>

            <TabPanel value="4">
              <Customers />
            </TabPanel>
          </TabContext>
        </Card>
      </Box>

      {/* Add New Service Modal */}
      {openAddServiceModal && (
        <AddServiceForm open={openAddServiceModal} onClose={handleCloseAddService} onSubmit={handleAddServiceSubmit} />
      )}

      {/* Add New Package Modal */}
      {openAddPackageModal && <AddPackage open={openAddPackageModal} onClose={handleCloseAddPackage} onSubmit={handleAddPackageSubmit} />}

      {/* Add New Spa Staff Modal */}
      {openAddSpaStaffModal && (
        <AddEmployee
          open={openAddSpaStaffModal}
          onClose={handleCloseAddSpaStaff}
          handleClose={handleCloseAddSpaStaff}
          onSubmit={handleAddSpaStaffSubmit}
        />
      )}
    </div>
  );
};

export default SpaManagement;
