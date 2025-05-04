// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormHelperText,
//   FormLabel,
//   Grid,
//   Input,
//   MenuItem,
//   Select,
//   TextField,
//   Typography
// } from '@mui/material';
// import { useFormik } from 'formik';
// import PropTypes from 'prop-types';
// import { useState } from 'react';
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';
// import { toast } from 'react-toastify';
// import { staffSchema } from 'schema/staffSchema';
// import { patchApi } from 'views/services/api';
// import './style/staff.css';

// const EditEmployee = ({ open, handleClose, employeeData }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentIdFile, setCurrentIdFile] = useState(null);
//   const [currentIdFile2, setCurrentIdFile2] = useState(null);

//   // Helper function to determine if employee has a custom type
//   const isCustomType = (value) => {
//     const standardTypes = [
//       'facial specialist',
//       'spa manager',
//       'receptionist',
//       'housekeeping staff',
//       'hair stylist',
//       'nail technician',
//       'body treatment specialist',
//       'makeup artist',
//       'aromatherapist',
//       'physiotherapist',
//       'skin care consultant',
//       'yoga instructor',
//       'wellness coach',
//       'towel attendant',
//       'hydrotherapy specialist',
//       'ayurvedic therapist',
//       'acupuncturist',
//       'general maintenance staff',
//       'inventory manager'
//     ];
//     return !standardTypes.includes(value?.toLowerCase() || '');
//   };

//   // Helper function to check if shift is custom
//   const isCustomShift = (shift) => {
//     const standardShifts = ['09:00 AM - 06:00 PM', '06:00 PM - 12:00 AM', '12:00 AM - 09:00 PM'];
//     return !standardShifts.includes(shift || '');
//   };

//   // Helper function to extract time values from shift string
//   const extractTimeValues = (shiftString) => {
//     if (!shiftString || typeof shiftString !== 'string') return { start: '', end: '' };

//     // Try to match patterns like "09:00 AM - 06:00 PM"
//     const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i;
//     const match = shiftString.match(timePattern);

//     if (match) {
//       return {
//         start: convertTo24HourFormat(match[1].trim()),
//         end: convertTo24HourFormat(match[2].trim())
//       };
//     }

//     return { start: '', end: '' };
//   };

//   // Helper function to convert 12-hour time to 24-hour format
//   const convertTo24HourFormat = (time12) => {
//     if (!time12) return '';

//     const [timePart, period] = time12.split(/\s+/);
//     let [hours, minutes] = timePart.split(':');

//     hours = parseInt(hours, 10);

//     if (period.toUpperCase() === 'PM' && hours < 12) {
//       hours += 12;
//     } else if (period.toUpperCase() === 'AM' && hours === 12) {
//       hours = 0;
//     }

//     return `${hours.toString().padStart(2, '0')}:${minutes}`;
//   };

//   // Helper function to convert 24-hour time to 12-hour format with AM/PM
//   const convertTo12HourFormat = (time24) => {
//     if (!time24) return '';

//     const [hours, minutes] = time24.split(':');
//     let period = 'AM';
//     let hours12 = parseInt(hours, 10);

//     if (hours12 >= 12) {
//       period = 'PM';
//       if (hours12 > 12) {
//         hours12 -= 12;
//       }
//     }

//     // Convert hour '0' to '12' for 12 AM
//     if (hours12 === 0) {
//       hours12 = 12;
//     }

//     return `${hours12.toString().padStart(2, '0')}:${minutes} ${period}`;
//   };

//   // Extract shift times for initialization
//   const shiftTimes = extractTimeValues(employeeData?.shift);

//   // Initialize form values from employee data
//   const initialValues = {
//     employeeType: isCustomType(employeeData?.employeeType) ? 'custom' : employeeData?.employeeType || 'default',
//     customEmployeeType: isCustomType(employeeData?.employeeType) ? employeeData?.employeeType : '',
//     shift: isCustomShift(employeeData?.shift) ? 'custom' : employeeData?.shift || 'default',
//     splitShift: 'default',
//     customShiftStart: shiftTimes.start,
//     customShiftEnd: shiftTimes.end,
//     phoneNumber: employeeData?.phoneNumber || '',
//     firstName: employeeData?.firstName || '',
//     lastName: employeeData?.lastName || '',
//     email: employeeData?.email || '',
//     idCardType: employeeData?.idCardType || 'default',
//     idcardNumber: employeeData?.idcardNumber || '',
//     address: employeeData?.address || '',
//     salary: employeeData?.salary || '',
//     idFile: null,
//     idFile2: null,
//     role: employeeData?.role || 'Staff'
//   };

//   const handleUpdateEmployee = async (values, { resetForm }) => {
//     try {
//       setIsSubmitting(true);

//       // Handle custom fields
//       if (values.employeeType === 'custom' && values.customEmployeeType) {
//         values.employeeType = values.customEmployeeType;
//       }

//       // Format shift data consistently
//       if (values.shift === 'custom' && values.customShiftStart && values.customShiftEnd) {
//         const startTime12 = convertTo12HourFormat(values.customShiftStart);
//         const endTime12 = convertTo12HourFormat(values.customShiftEnd);
//         values.shift = `${startTime12} - ${endTime12}`;
//       }

//       // Create form data for submission
//       const formData = new FormData();
//       formData.append('firstName', values.firstName);
//       formData.append('lastName', values.lastName);
//       formData.append('email', values.email);
//       formData.append('phoneNumber', values.phoneNumber);
//       formData.append('shift', values.shift);
//       formData.append('employeeType', values.employeeType);
//       formData.append('idCardType', values.idCardType);
//       formData.append('idcardNumber', values.idcardNumber);
//       formData.append('address', values.address);
//       formData.append('salary', values.salary);
//       formData.append('role', values.employeeType);

//       // Only append files if they've been changed
//       if (currentIdFile) {
//         formData.append('idFile', currentIdFile);
//       }
//       if (currentIdFile2) {
//         formData.append('idFile2', currentIdFile2);
//       }

//       const response = await patchApi(`api/spaStaff/editspaStaff/${employeeData?._id}`, formData);

//       if (response.status === 200) {
//         toast.success('Employee updated successfully!');
//         resetForm();
//         handleClose();
//       } else {
//         toast.error('Failed to update employee. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       toast.error('Failed to update employee. Please check your connection and try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const formik = useFormik({
//     initialValues,
//     enableReinitialize: true,
//     validationSchema: staffSchema,
//     onSubmit: handleUpdateEmployee
//   });

//   const handleCancel = () => {
//     formik.resetForm();
//     handleClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       maxWidth="md"
//       fullWidth
//       aria-labelledby="edit-employee-dialog-title"
//       aria-describedby="edit-employee-dialog-description"
//     >
//       <DialogTitle id="edit-employee-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h3">Edit Spa Staff</Typography>
//         <Button onClick={handleCancel} color="error">
//           Cancel
//         </Button>
//       </DialogTitle>

//       <DialogContent dividers>
//         <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
//           <Grid container spacing={3}>
//             {/* Employee Type Selection */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={formik.touched.employeeType && Boolean(formik.errors.employeeType)}>
//                 <Select
//                   id="employeeType"
//                   name="employeeType"
//                   value={formik.values.employeeType}
//                   onChange={(e) => {
//                     formik.setFieldValue('employeeType', e.target.value);
//                     if (e.target.value !== 'custom') {
//                       formik.setFieldValue('customEmployeeType', '');
//                     }
//                   }}
//                 >
//                   <MenuItem value="default" disabled>
//                     Select Employee Type
//                   </MenuItem>
//                   <MenuItem value="facial specialist">Facial Specialist</MenuItem>
//                   <MenuItem value="spa manager">Spa Manager</MenuItem>
//                   <MenuItem value="receptionist">Receptionist</MenuItem>
//                   <MenuItem value="housekeeping staff">Housekeeping Staff</MenuItem>
//                   <MenuItem value="hair stylist">Hair Stylist</MenuItem>
//                   <MenuItem value="nail technician">Nail Technician</MenuItem>
//                   <MenuItem value="body treatment specialist">Body Treatment Specialist</MenuItem>
//                   <MenuItem value="makeup artist">Makeup Artist</MenuItem>
//                   <MenuItem value="aromatherapist">Aromatherapist</MenuItem>
//                   <MenuItem value="physiotherapist">Physiotherapist</MenuItem>
//                   <MenuItem value="skin care consultant">Skin Care Consultant</MenuItem>
//                   <MenuItem value="yoga instructor">Yoga Instructor</MenuItem>
//                   <MenuItem value="wellness coach">Wellness Coach</MenuItem>
//                   <MenuItem value="towel attendant">Towel Attendant</MenuItem>
//                   <MenuItem value="hydrotherapy specialist">Hydrotherapy Specialist</MenuItem>
//                   <MenuItem value="ayurvedic therapist">Ayurvedic Therapist</MenuItem>
//                   <MenuItem value="acupuncturist">Acupuncturist</MenuItem>
//                   <MenuItem value="general maintenance staff">General Maintenance Staff</MenuItem>
//                   <MenuItem value="inventory manager">Inventory Manager</MenuItem>
//                   <MenuItem value="custom">Other (Write Manually)</MenuItem>
//                 </Select>
//                 {formik.touched.employeeType && formik.errors.employeeType && <FormHelperText>{formik.errors.employeeType}</FormHelperText>}
//               </FormControl>
//             </Grid>

//             {/* Custom Employee Type */}
//             {formik.values.employeeType === 'custom' && (
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <FormLabel htmlFor="customEmployeeType">Custom Employee Type</FormLabel>
//                   <TextField
//                     id="customEmployeeType"
//                     name="customEmployeeType"
//                     placeholder="Enter custom employee type"
//                     value={formik.values.customEmployeeType}
//                     onChange={formik.handleChange}
//                     error={formik.touched.customEmployeeType && Boolean(formik.errors.customEmployeeType)}
//                     helperText={formik.touched.customEmployeeType && formik.errors.customEmployeeType}
//                   />
//                 </FormControl>
//               </Grid>
//             )}

//             {/* Working Shift - Improved */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={formik.touched.shift && Boolean(formik.errors.shift)}>
//                 <Select
//                   id="shift"
//                   name="shift"
//                   value={formik.values.shift}
//                   onChange={(e) => {
//                     formik.setFieldValue('shift', e.target.value);
//                     if (e.target.value !== 'custom') {
//                       formik.setFieldValue('customShiftStart', '');
//                       formik.setFieldValue('customShiftEnd', '');
//                     }
//                     if (e.target.value !== 'split') {
//                       formik.setFieldValue('splitShift', 'default');
//                     }
//                   }}
//                 >
//                   <MenuItem value="default" disabled>
//                     Select Working Shift
//                   </MenuItem>
//                   <MenuItem value="09:00 AM - 06:00 PM">09:00 AM - 06:00 PM</MenuItem>
//                   <MenuItem value="06:00 PM - 12:00 AM">06:00 PM - 12:00 AM</MenuItem>
//                   <MenuItem value="12:00 AM - 09:00 PM">12:00 AM - 09:00 PM</MenuItem>
//                   <MenuItem value="custom">Other (Write Manually)</MenuItem>
//                 </Select>
//                 {formik.touched.shift && formik.errors.shift && <FormHelperText>{formik.errors.shift}</FormHelperText>}
//               </FormControl>
//             </Grid>

//             {/* Custom Shift */}
//             {formik.values.shift === 'custom' && (
//               <Grid container item xs={12} sm={6} spacing={2}>
//                 <Grid item xs={6}>
//                   <FormControl fullWidth>
//                     <FormLabel htmlFor="customShiftStart">Start Time</FormLabel>
//                     <TextField
//                       id="customShiftStart"
//                       name="customShiftStart"
//                       type="time"
//                       value={formik.values.customShiftStart}
//                       onChange={formik.handleChange}
//                       InputLabelProps={{ shrink: true }}
//                       inputProps={{ step: 300 }}
//                       error={formik.touched.customShiftStart && Boolean(formik.errors.customShiftStart)}
//                       helperText={formik.touched.customShiftStart && formik.errors.customShiftStart}
//                     />
//                     {formik.values.customShiftStart && (
//                       <FormHelperText>{`Will be saved as: ${convertTo12HourFormat(formik.values.customShiftStart)}`}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <FormControl fullWidth>
//                     <FormLabel htmlFor="customShiftEnd">End Time</FormLabel>
//                     <TextField
//                       id="customShiftEnd"
//                       name="customShiftEnd"
//                       type="time"
//                       value={formik.values.customShiftEnd}
//                       onChange={formik.handleChange}
//                       InputLabelProps={{ shrink: true }}
//                       inputProps={{ step: 300 }}
//                       error={formik.touched.customShiftEnd && Boolean(formik.errors.customShiftEnd)}
//                       helperText={formik.touched.customShiftEnd && formik.errors.customShiftEnd}
//                     />
//                     {formik.values.customShiftEnd && (
//                       <FormHelperText>{`Will be saved as: ${convertTo12HourFormat(formik.values.customShiftEnd)}`}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             )}

//             {/* Personal Information */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <TextField
//                   id="firstName"
//                   name="firstName"
//                   placeholder="Enter First Name"
//                   value={formik.values.firstName}
//                   onChange={formik.handleChange}
//                   error={formik.touched.firstName && Boolean(formik.errors.firstName)}
//                   helperText={formik.touched.firstName && formik.errors.firstName}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <TextField
//                   id="lastName"
//                   name="lastName"
//                   placeholder="Enter Last Name"
//                   value={formik.values.lastName}
//                   onChange={formik.handleChange}
//                   error={formik.touched.lastName && Boolean(formik.errors.lastName)}
//                   helperText={formik.touched.lastName && formik.errors.lastName}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <TextField
//                   id="email"
//                   name="email"
//                   placeholder="Enter Email"
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   error={formik.touched.email && Boolean(formik.errors.email)}
//                   helperText={formik.touched.email && formik.errors.email}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <PhoneInput
//                   international
//                   placeholder="Enter phone number"
//                   defaultCountry="US"
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   className="custom-phone-input"
//                   value={formik.values.phoneNumber}
//                   onChange={(value) => formik.setFieldValue('phoneNumber', value)}
//                 />
//                 {formik.touched.phoneNumber && formik.errors.phoneNumber && (
//                   <FormHelperText error>{formik.errors.phoneNumber}</FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* ID Information */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={formik.touched.idCardType && Boolean(formik.errors.idCardType)}>
//                 <Select id="idCardType" name="idCardType" value={formik.values.idCardType} onChange={formik.handleChange}>
//                   <MenuItem value="default" disabled>
//                     Select ID Card Type
//                   </MenuItem>
//                   <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
//                   <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
//                   <MenuItem value="PanCard">Pan Card</MenuItem>
//                   <MenuItem value="DrivingLicense">Driving License</MenuItem>
//                 </Select>
//                 {formik.touched.idCardType && formik.errors.idCardType && <FormHelperText>{formik.errors.idCardType}</FormHelperText>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <TextField
//                   id="idcardNumber"
//                   name="idcardNumber"
//                   placeholder="Enter card number"
//                   value={formik.values.idcardNumber}
//                   onChange={formik.handleChange}
//                   error={formik.touched.idcardNumber && Boolean(formik.errors.idcardNumber)}
//                   helperText={formik.touched.idcardNumber && formik.errors.idcardNumber}
//                 />
//               </FormControl>
//             </Grid>

//             {/* File Uploads */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <FormLabel htmlFor="idFile">Upload ID Card Front</FormLabel>
//                 <Input
//                   id="idFile"
//                   name="idFile"
//                   type="file"
//                   inputProps={{ accept: 'image/*,.pdf' }}
//                   onChange={(event) => {
//                     const file = event.currentTarget.files[0];
//                     if (file) {
//                       setCurrentIdFile(file);
//                       formik.setFieldValue('idFile', file);
//                     }
//                   }}
//                 />
//                 {employeeData?.idFile && !currentIdFile && (
//                   <Typography variant="body2">Current file: {employeeData.idFile.split('/').pop()}</Typography>
//                 )}
//                 {currentIdFile && <Typography variant="body2">New file: {currentIdFile.name}</Typography>}
//                 {formik.touched.idFile && formik.errors.idFile && <FormHelperText error>{formik.errors.idFile}</FormHelperText>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <FormLabel htmlFor="idFile2">Upload ID Card Back</FormLabel>
//                 <Input
//                   id="idFile2"
//                   name="idFile2"
//                   type="file"
//                   inputProps={{ accept: 'image/*,.pdf' }}
//                   onChange={(event) => {
//                     const file = event.currentTarget.files[0];
//                     if (file) {
//                       setCurrentIdFile2(file);
//                       formik.setFieldValue('idFile2', file);
//                     }
//                   }}
//                 />
//                 {employeeData?.idFile2 && !currentIdFile2 && (
//                   <Typography variant="body2">Current file: {employeeData.idFile2.split('/').pop()}</Typography>
//                 )}
//                 {currentIdFile2 && <Typography variant="body2">New file: {currentIdFile2.name}</Typography>}
//                 {formik.touched.idFile2 && formik.errors.idFile2 && <FormHelperText error>{formik.errors.idFile2}</FormHelperText>}
//               </FormControl>
//             </Grid>

//             {/* Additional Information */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <TextField
//                   id="address"
//                   name="address"
//                   placeholder="Enter Physical Address"
//                   value={formik.values.address}
//                   onChange={formik.handleChange}
//                   error={formik.touched.address && Boolean(formik.errors.address)}
//                   helperText={formik.touched.address && formik.errors.address}
//                 />
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <TextField
//                   id="salary"
//                   name="salary"
//                   placeholder="Enter Salary"
//                   value={formik.values.salary}
//                   onChange={formik.handleChange}
//                   error={formik.touched.salary && Boolean(formik.errors.salary)}
//                   helperText={formik.touched.salary && formik.errors.salary}
//                   InputProps={{ startAdornment: '$' }}
//                 />
//               </FormControl>
//             </Grid>
//           </Grid>
//         </form>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2 }}>
//         <Button onClick={handleCancel} color="error" variant="outlined">
//           Cancel
//         </Button>
//         <Button onClick={formik.handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
//           {isSubmitting ? 'Updating...' : 'Update Employee'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// EditEmployee.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   employeeData: PropTypes.object
// };

// export default EditEmployee;
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { staffSchema } from 'schema/staffSchema';
import { patchApi } from 'views/services/api';
import './style/staff.css';

const EditEmployee = ( { open, handleClose, employeeData } ) => {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ currentIdFile, setCurrentIdFile ] = useState( null );
  const [ currentIdFile2, setCurrentIdFile2 ] = useState( null );

  // Added debugging log to check employeeData
  useEffect( () => {
    console.log( "Employee data received:", employeeData );
  }, [ employeeData ] );

  // Helper function to determine if employee has a custom type
  const isCustomType = ( value ) => {
    const standardTypes = [
      'massage therapist',
      'esthetician',
      'nail technician (manicurist/pedicurist)',
      'hair stylist',
      'spa receptionist/front desk associate',
      'spa manager',
      'assistant spa manager',
      'spa director',
      'marketing manager',
      'sales associate/consultant',
      'body treatment therapist (wraps, scrubs)',
      'waxing specialist',
      'lash technician',
      'makeup artist',
      'acupuncturist',
      'nutritionist/wellness coach',
      'yoga instructor/fitness instructor',
      'meditation guide',
      'spa attendant (cleaning, stocking)',
      'laundry staff',
      'maintenance staff',
      'accountant/bookkeeper',
      'human resources (hr) personnel',
      'customer service representative (phone/email)',
      'bartender (if serving alcohol)',
      'spa concierge',
      'hydrotherapist',
      'medical esthetician',
      'laser technician',
      'facial specialist',
      'spa manager',
      'receptionist',
      'housekeeping staff',
      'hair stylist',
      'nail technician',
      'body treatment specialist',
      'makeup artist',
      'aromatherapist',
      'physiotherapist',
      'skin care consultant',
      'yoga instructor',
      'wellness coach',
      'towel attendant',
      'hydrotherapy specialist',
      'ayurvedic therapist',
      'acupuncturist',
      'general maintenance staff',
      'inventory manager'
    ];

    // Treat empty or null employeeType as not custom initially
    if ( !value ) return false;
    return !standardTypes.includes( value.toLowerCase() );
  };

  // Helper function to check if shift is custom
  const isCustomShift = ( shift ) => {
    const standardShifts = [ '09:00 AM - 06:00 PM', '06:00 PM - 12:00 AM', '12:00 AM - 09:00 PM' ];
    // Treat empty or null shift as not custom initially
    if ( !shift ) return false;
    return !standardShifts.includes( shift );
  };

  // Helper function to extract time values from shift string
  const extractTimeValues = ( shiftString ) => {
    if ( !shiftString || typeof shiftString !== 'string' ) return { start: '', end: '' };

    // Try to match patterns like "09:00 AM - 06:00 PM" or "09:00 - 18:00"
    const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i;
    const match = shiftString.match( timePattern );

    if ( match ) {
      const startTimeString = match[ 1 ].trim();
      const endTimeString = match[ 2 ].trim();

      // Determine if the format is 12-hour (contains AM/PM) or 24-hour
      const is12Hour = /(AM|PM)/i.test( startTimeString );

      return {
        start: is12Hour ? convertTo24HourFormat( startTimeString ) : startTimeString,
        end: is12Hour ? convertTo24HourFormat( endTimeString ) : endTimeString
      };
    }

    // If no match, return empty
    return { start: '', end: '' };
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24HourFormat = ( time12 ) => {
    if ( !time12 ) return '';

    const parts = time12.match( /(\d{1,2}):(\d{2})\s*(AM|PM)/i );
    if ( !parts ) return ''; // Invalid 12-hour format

    let hours = parseInt( parts[ 1 ], 10 );
    const minutes = parts[ 2 ];
    const period = parts[ 3 ].toUpperCase();

    if ( period === 'PM' && hours < 12 ) {
      hours += 12;
    } else if ( period === 'AM' && hours === 12 ) { // 12 AM is 00 in 24-hour
      hours = 0;
    }

    return `${ hours.toString().padStart( 2, '0' ) }:${ minutes }`;
  };

  // Helper function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12HourFormat = ( time24 ) => {
    if ( !time24 ) return '';

    const [ hours, minutes ] = time24.split( ':' );
    let period = 'AM';
    let hours12 = parseInt( hours, 10 );

    if ( hours12 >= 12 ) {
      period = 'PM';
      if ( hours12 > 12 ) {
        hours12 -= 12;
      }
    }

    // Convert hour '0' to '12' for 12 AM
    if ( hours12 === 0 ) {
      hours12 = 12;
    }

    return `${ hours12.toString().padStart( 2, '0' ) }:${ minutes } ${ period }`;
  };

  // Extract shift times for initialization - ensure we have valid employeeData first
  const shiftTimes = employeeData?.shift ? extractTimeValues( employeeData.shift ) : { start: '', end: '' };

  // Initialize form values with useEffect to properly handle employeeData loading
  const [ initialValues, setInitialValues ] = useState( {
    employeeType: 'default',
    customEmployeeType: '',
    shift: 'default',
    splitShift: 'default',
    customShiftStart: '',
    customShiftEnd: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    idCardType: 'default',
    idcardNumber: '',
    address: '',
    salary: '',
    idFile: null,
    idFile2: null,
    role: 'Staff'
  } );

  useEffect( () => {
    if ( employeeData && Object.keys( employeeData ).length > 0 ) {
      console.log( "Setting initial values from employeeData:", employeeData );

      // Extract shift times
      const shiftTimes = employeeData.shift ? extractTimeValues( employeeData.shift ) : { start: '', end: '' };

      // Check employee type
      const employeeTypeIsCustom = isCustomType( employeeData.employeeType );

      // Check shift type
      const shiftIsCustom = isCustomShift( employeeData.shift );

      setInitialValues( {
        // Handle employee type
        employeeType: employeeTypeIsCustom ? 'custom' : ( employeeData.employeeType || 'default' ),
        customEmployeeType: employeeTypeIsCustom ? employeeData.employeeType : '',

        // Handle shift
        shift: shiftIsCustom ? 'custom' : ( employeeData.shift || 'default' ),
        splitShift: 'default',
        customShiftStart: shiftTimes.start,
        customShiftEnd: shiftTimes.end,

        // Other fields
        phoneNumber: employeeData.phoneNumber || '',
        firstName: employeeData.firstName || '',
        lastName: employeeData.lastName || '',
        email: employeeData.email || '',
        idCardType: employeeData.idCardType || 'default',
        idcardNumber: employeeData.idcardNumber || '',
        address: employeeData.address || '',
        salary: employeeData.salary || '',
        idFile: null,
        idFile2: null,
        role: employeeData.employeeType || 'Staff'
      } );
    }
  }, [ employeeData ] );

  const handleUpdateEmployee = async ( values, { resetForm } ) => {
    try {
      setIsSubmitting( true );

      // Determine final employee type value for submission
      const finalEmployeeType = values.employeeType === 'custom' && values.customEmployeeType
        ? values.customEmployeeType
        : values.employeeType === 'default'
          ? ''
          : values.employeeType;

      // Determine final shift value for submission
      let finalShift = values.shift;
      if ( values.shift === 'custom' && values.customShiftStart && values.customShiftEnd ) {
        const startTime12 = convertTo12HourFormat( values.customShiftStart );
        const endTime12 = convertTo12HourFormat( values.customShiftEnd );
        finalShift = `${ startTime12 } - ${ endTime12 }`;
      } else if ( values.shift === 'default' ) {
        finalShift = '';
      }

      // Create form data for submission
      const formData = new FormData();
      formData.append( 'firstName', values.firstName );
      formData.append( 'lastName', values.lastName );
      formData.append( 'email', values.email );
      formData.append( 'phoneNumber', values.phoneNumber );
      formData.append( 'shift', finalShift );
      formData.append( 'employeeType', finalEmployeeType );
      formData.append( 'idCardType', values.idCardType === 'default' ? '' : values.idCardType );
      formData.append( 'idcardNumber', values.idcardNumber );
      formData.append( 'address', values.address );
      formData.append( 'salary', values.salary );
      formData.append( 'role', values.role );

      // Only append files if they've been changed
      if ( currentIdFile instanceof File ) {
        formData.append( 'idFile', currentIdFile );
      }
      if ( currentIdFile2 instanceof File ) {
        formData.append( 'idFile2', currentIdFile2 );
      }

      const response = await patchApi( `api/spaStaff/editspaStaff/${ employeeData?._id }`, formData );

      if ( response.status === 200 ) {
        toast.success( 'Employee updated successfully!' );
        resetForm();
        // Reset file states
        setCurrentIdFile( null );
        setCurrentIdFile2( null );
        handleClose();
      } else {
        if ( response?.response?.data?.message ) {
          toast.error( response.response.data.message );
        } else {
          toast.error( 'Failed to update employee. Please try again.' );
        }
      }
    } catch ( error ) {
      console.error( 'Error updating employee:', error );
      toast.error( 'Failed to update employee. Please check your connection and try again.' );
    } finally {
      setIsSubmitting( false );
    }
  };

  const formik = useFormik( {
    initialValues,
    enableReinitialize: true, // This ensures form updates when initialValues change
    validationSchema: staffSchema,
    onSubmit: handleUpdateEmployee
  } );

  const handleCancel = () => {
    formik.resetForm();
    // Reset file states
    setCurrentIdFile( null );
    setCurrentIdFile2( null );
    handleClose();
  };

  return (
    <Dialog
      open={ open }
      maxWidth="md"
      fullWidth
      aria-labelledby="edit-employee-dialog-title"
      aria-describedby="edit-employee-dialog-description"
      onClose={ handleCancel }
    >
      <DialogTitle id="edit-employee-dialog-title" sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
        <Typography variant="h3">Edit Spa Staff</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={ formik.handleSubmit } encType="multipart/form-data">
          <Grid container spacing={ 3 }>
            {/* Employee Type Selection */ }
            <Grid item xs={ 12 } sm={ formik.values.employeeType === 'custom' ? 6 : 12 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.employeeType && Boolean( formik.errors.employeeType ) }>
                <FormLabel htmlFor="employeeType">Employee Type</FormLabel>
                <Select
                  id="employeeType"
                  name="employeeType"
                  value={ formik.values.employeeType }
                  onChange={ ( e ) => {
                    formik.setFieldValue( 'employeeType', e.target.value );
                    // Clear custom type value if switching away from custom
                    if ( e.target.value !== 'custom' ) {
                      formik.setFieldValue( 'customEmployeeType', '' );
                    }
                    // Also update role based on the selected employee type
                    formik.setFieldValue( 'role', e.target.value === 'default' ? 'Staff' : e.target.value );
                  } }
                  onBlur={ formik.handleBlur }
                >
                  <MenuItem value="default" disabled>
                    Select Employee Type
                  </MenuItem>
                  <MenuItem value="facial specialist">Facial Specialist</MenuItem>
                  <MenuItem value="spa manager">Spa Manager</MenuItem>
                  <MenuItem value="receptionist">Receptionist</MenuItem>
                  <MenuItem value="housekeeping staff">Housekeeping Staff</MenuItem>
                  <MenuItem value="hair stylist">Hair Stylist</MenuItem>
                  <MenuItem value="nail technician">Nail Technician</MenuItem>
                  <MenuItem value="body treatment specialist">Body Treatment Specialist</MenuItem>
                  <MenuItem value="makeup artist">Makeup Artist</MenuItem>
                  <MenuItem value="aromatherapist">Aromatherapist</MenuItem>
                  <MenuItem value="physiotherapist">Physiotherapist</MenuItem>
                  <MenuItem value="skin care consultant">Skin Care Consultant</MenuItem>
                  <MenuItem value="yoga instructor">Yoga Instructor</MenuItem>
                  <MenuItem value="wellness coach">Wellness Coach</MenuItem>
                  <MenuItem value="towel attendant">Towel Attendant</MenuItem>
                  <MenuItem value="hydrotherapy specialist">Hydrotherapy Specialist</MenuItem>
                  <MenuItem value="ayurvedic therapist">Ayurvedic Therapist</MenuItem>
                  <MenuItem value="acupuncturist">Acupuncturist</MenuItem>
                  <MenuItem value="general maintenance staff">General Maintenance Staff</MenuItem>
                  <MenuItem value="inventory manager">Inventory Manager</MenuItem>
                  <MenuItem value="custom">Other (Write Manually)</MenuItem>
                </Select>
                { formik.touched.employeeType && formik.errors.employeeType && <FormHelperText>{ formik.errors.employeeType }</FormHelperText> }
              </FormControl>
            </Grid>

            {/* Custom Employee Type */ }
            { formik.values.employeeType === 'custom' && (
              <Grid item xs={ 12 } sm={ 6 }>
                <FormControl fullWidth margin="normal" error={ formik.touched.customEmployeeType && Boolean( formik.errors.customEmployeeType ) }>
                  <FormLabel htmlFor="customEmployeeType">Custom Employee Type</FormLabel>
                  <TextField
                    id="customEmployeeType"
                    name="customEmployeeType"
                    placeholder="Enter custom employee type"
                    value={ formik.values.customEmployeeType }
                    onChange={ ( e ) => {
                      formik.handleChange( e );
                      // Update role when custom type is typed
                      formik.setFieldValue( 'role', e.target.value );
                    } }
                    onBlur={ formik.handleBlur }
                    error={ formik.touched.customEmployeeType && Boolean( formik.errors.customEmployeeType ) }
                    helperText={ formik.touched.customEmployeeType && formik.errors.customEmployeeType }
                  />
                </FormControl>
              </Grid>
            ) }

            {/* Working Shift */ }
            <Grid item xs={ 12 } sm={ formik.values.shift === 'custom' ? 6 : 12 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.shift && Boolean( formik.errors.shift ) }>
                <FormLabel htmlFor="shift">Working Shift</FormLabel>
                <Select
                  id="shift"
                  name="shift"
                  value={ formik.values.shift }
                  onChange={ ( e ) => {
                    formik.setFieldValue( 'shift', e.target.value );
                    // Clear custom shift times if switching away from custom
                    if ( e.target.value !== 'custom' ) {
                      formik.setFieldValue( 'customShiftStart', '' );
                      formik.setFieldValue( 'customShiftEnd', '' );
                    }
                    // Split shift logic is in unused state, but keeping for consistency if intended later
                    if ( e.target.value !== 'split' ) {
                      formik.setFieldValue( 'splitShift', 'default' );
                    }
                  } }
                  onBlur={ formik.handleBlur }
                >
                  <MenuItem value="default" disabled>
                    Select Working Shift
                  </MenuItem>
                  <MenuItem value="09:00 AM - 06:00 PM">09:00 AM - 06:00 PM</MenuItem>
                  <MenuItem value="06:00 PM - 12:00 AM">06:00 PM - 12:00 AM</MenuItem>
                  <MenuItem value="12:00 AM - 09:00 PM">12:00 AM - 09:00 PM</MenuItem>
                  <MenuItem value="custom">Other (Write Manually)</MenuItem>
                </Select>
                { formik.touched.shift && formik.errors.shift && <FormHelperText>{ formik.errors.shift }</FormHelperText> }
              </FormControl>
            </Grid>

            {/* Custom Shift */ }
            { formik.values.shift === 'custom' && (
              <Grid item container xs={ 12 } sm={ 6 } spacing={ 2 }>
                <Grid item xs={ 6 }>
                  <FormControl fullWidth margin="normal" error={ formik.touched.customShiftStart && Boolean( formik.errors.customShiftStart ) }>
                    <FormLabel htmlFor="customShiftStart">Start Time</FormLabel>
                    <TextField
                      id="customShiftStart"
                      name="customShiftStart"
                      type="time"
                      value={ formik.values.customShiftStart }
                      onChange={ formik.handleChange }
                      onBlur={ formik.handleBlur }
                      InputLabelProps={ { shrink: true } }
                      inputProps={ { step: 300 } }
                      error={ formik.touched.customShiftStart && Boolean( formik.errors.customShiftStart ) }
                      helperText={ formik.touched.customShiftStart && formik.errors.customShiftStart }
                    />
                    { formik.values.customShiftStart && (
                      <FormHelperText>{ `Will be saved as: ${ convertTo12HourFormat( formik.values.customShiftStart ) }` }</FormHelperText>
                    ) }
                  </FormControl>
                </Grid>
                <Grid item xs={ 6 }>
                  <FormControl fullWidth margin="normal" error={ formik.touched.customShiftEnd && Boolean( formik.errors.customShiftEnd ) }>
                    <FormLabel htmlFor="customShiftEnd">End Time</FormLabel>
                    <TextField
                      id="customShiftEnd"
                      name="customShiftEnd"
                      type="time"
                      value={ formik.values.customShiftEnd }
                      onChange={ formik.handleChange }
                      onBlur={ formik.handleBlur }
                      InputLabelProps={ { shrink: true } }
                      inputProps={ { step: 300 } }
                      error={ formik.touched.customShiftEnd && Boolean( formik.errors.customShiftEnd ) }
                      helperText={ formik.touched.customShiftEnd && formik.errors.customShiftEnd }
                    />
                    { formik.values.customShiftEnd && (
                      <FormHelperText>{ `Will be saved as: ${ convertTo12HourFormat( formik.values.customShiftEnd ) }` }</FormHelperText>
                    ) }
                  </FormControl>
                </Grid>
              </Grid>
            ) }

            {/* Personal Information */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.firstName && Boolean( formik.errors.firstName ) }>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <TextField
                  id="firstName"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={ formik.values.firstName || '' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                  error={ formik.touched.firstName && Boolean( formik.errors.firstName ) }
                  helperText={ formik.touched.firstName && formik.errors.firstName }
                />
              </FormControl>
            </Grid>

            {/* ... Rest of the form fields remain mostly the same, just ensure all values have fallbacks */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.lastName && Boolean( formik.errors.lastName ) }>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <TextField
                  id="lastName"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={ formik.values.lastName || '' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                  error={ formik.touched.lastName && Boolean( formik.errors.lastName ) }
                  helperText={ formik.touched.lastName && formik.errors.lastName }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.email && Boolean( formik.errors.email ) }>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  value={ formik.values.email || '' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                  error={ formik.touched.email && Boolean( formik.errors.email ) }
                  helperText={ formik.touched.email && formik.errors.email }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.phoneNumber && Boolean( formik.errors.phoneNumber ) }>
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                <PhoneInput
                  international
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  id="phoneNumber"
                  name="phoneNumber"
                  className={ `custom-phone-input ${ formik.touched.phoneNumber && formik.errors.phoneNumber ? 'Mui-error' : '' }` }
                  value={ formik.values.phoneNumber || '' }
                  onChange={ ( value ) => formik.setFieldValue( 'phoneNumber', value ) }
                  onBlur={ () => formik.setFieldTouched( 'phoneNumber', true ) }
                />
                { formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <FormHelperText error>{ formik.errors.phoneNumber }</FormHelperText>
                ) }
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.idCardType && Boolean( formik.errors.idCardType ) }>
                <FormLabel htmlFor="idCardType">ID Card Type</FormLabel>
                <Select
                  id="idCardType"
                  name="idCardType"
                  value={ formik.values.idCardType || 'default' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                >
                  <MenuItem value="default" disabled>
                    Select ID Card Type
                  </MenuItem>
                  <MenuItem value="Aadharcard">Aadhar Card</MenuItem>
                  <MenuItem value="VoterIdCard">VoterId Card</MenuItem>
                  <MenuItem value="PanCard">Pan Card</MenuItem>
                  <MenuItem value="DrivingLicense">Driving License</MenuItem>
                </Select>
                { formik.touched.idCardType && formik.errors.idCardType && <FormHelperText>{ formik.errors.idCardType }</FormHelperText> }
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.idcardNumber && Boolean( formik.errors.idcardNumber ) }>
                <FormLabel htmlFor="idcardNumber">ID Card Number</FormLabel>
                <TextField
                  id="idcardNumber"
                  name="idcardNumber"
                  placeholder="Enter card number"
                  value={ formik.values.idcardNumber || '' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                  error={ formik.touched.idcardNumber && Boolean( formik.errors.idcardNumber ) }
                  helperText={ formik.touched.idcardNumber && formik.errors.idcardNumber }
                />
              </FormControl>
            </Grid>

            {/* File Uploads */ }
            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.idFile && Boolean( formik.errors.idFile ) }>
                <FormLabel htmlFor="idFile">Upload ID Card Front</FormLabel>
                <Input
                  id="idFile"
                  name="idFile"
                  type="file"
                  inputProps={ { accept: 'image/*,.pdf' } }
                  onChange={ ( event ) => {
                    const file = event.currentTarget.files[ 0 ];
                    if ( file ) {
                      setCurrentIdFile( file );
                      formik.setFieldValue( 'idFile', file );
                    } else {
                      setCurrentIdFile( null );
                      formik.setFieldValue( 'idFile', null );
                    }
                  } }
                  onBlur={ () => formik.setFieldTouched( 'idFile', true ) }
                />
                { employeeData?.idFile && !currentIdFile && (
                  <Typography variant="body2" color="textSecondary">
                    Current file: { employeeData.idFile.split( '/' ).pop() }
                  </Typography>
                ) }
                { currentIdFile && <Typography variant="body2">New file: { currentIdFile.name }</Typography> }
                { formik.touched.idFile && formik.errors.idFile && <FormHelperText error>{ formik.errors.idFile }</FormHelperText> }
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.idFile2 && Boolean( formik.errors.idFile2 ) }>
                <FormLabel htmlFor="idFile2">Upload ID Card Back</FormLabel>
                <Input
                  id="idFile2"
                  name="idFile2"
                  type="file"
                  inputProps={ { accept: 'image/*,.pdf' } }
                  onChange={ ( event ) => {
                    const file = event.currentTarget.files[ 0 ];
                    if ( file ) {
                      setCurrentIdFile2( file );
                      formik.setFieldValue( 'idFile2', file );
                    } else {
                      setCurrentIdFile2( null );
                      formik.setFieldValue( 'idFile2', null );
                    }
                  } }
                  onBlur={ () => formik.setFieldTouched( 'idFile2', true ) }
                />
                { employeeData?.idFile2 && !currentIdFile2 && (
                  <Typography variant="body2" color="textSecondary">
                    Current file: { employeeData.idFile2.split( '/' ).pop() }
                  </Typography>
                ) }
                { currentIdFile2 && <Typography variant="body2">New file: { currentIdFile2.name }</Typography> }
                { formik.touched.idFile2 && formik.errors.idFile2 && <FormHelperText error>{ formik.errors.idFile2 }</FormHelperText> }
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.address && Boolean( formik.errors.address ) }>
                <FormLabel htmlFor="address">Physical Address</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  placeholder="Enter Physical Address"
                  value={ formik.values.address || '' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                  error={ formik.touched.address && Boolean( formik.errors.address ) }
                  helperText={ formik.touched.address && formik.errors.address }
                />
              </FormControl>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 }>
              <FormControl fullWidth margin="normal" error={ formik.touched.salary && Boolean( formik.errors.salary ) }>
                <FormLabel htmlFor="salary">Salary</FormLabel>
                <TextField
                  id="salary"
                  name="salary"
                  placeholder="Enter Salary"
                  value={ formik.values.salary || '' }
                  onChange={ formik.handleChange }
                  onBlur={ formik.handleBlur }
                  error={ formik.touched.salary && Boolean( formik.errors.salary ) }
                  helperText={ formik.touched.salary && formik.errors.salary }
                  InputProps={ { startAdornment: '$' } }
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={ { px: 3, py: 2 } }>
        {/* Cancel button */ }
        <Button onClick={ handleCancel } color="error" variant="outlined" disabled={ isSubmitting }>
          Cancel
        </Button>
        {/* Update button - trigger form submission */ }
        <Button type="submit" variant="contained" color="primary" onClick={ formik.handleSubmit } disabled={ isSubmitting }>
          { isSubmitting ? 'Updating...' : 'Update Employee' }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditEmployee.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  employeeData: PropTypes.object
};

export default EditEmployee;