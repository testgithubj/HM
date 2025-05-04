// /* eslint-disable react/prop-types */
// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import { FormHelperText, FormLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Typography from '@mui/material/Typography';
// import ClearIcon from '@mui/icons-material/Clear';
// import { useFormik } from 'formik';
// import { patchApi } from 'views/services/api';
// import { toast } from 'react-toastify';
// import Palette from '../../ui-component/ThemePalette';
// import { roomSchema } from 'schema';
// import { kotSchema } from 'schema/kotSchema';


// const EditKot = (props) => {
//   const { open, handleClose, data } = props;
//   console.log("props edit  ==========>",props);

//   const initialValues = {
//     staffId: data?.staffName,
//     description: data?.description
//   };

 

//   const AddData = async (values) => {
//     try {
//       // setIsLoding(true);
//       let response = await patchApi(`api/room/edit/${data._id}`, values);
//       if (response.status === 200) {
//         formik.resetForm();
//         toast.success('Room Successfully Modified');
//       } else {
//         toast.error(response.response.data.error);
//       }
//     } catch (e) {
//       toast.error(response.data.error);
//     } finally {
//       // setIsLoding(false);
//     }
//   };
//   const formik = useFormik({
//     initialValues,
//     validationSchema: kotSchema,
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//         console.log("values : =>",values);
//       AddData(values);
//       handleClose();
//     }
//   });

//   return (
//     <div>
//       <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">

//         <DialogTitle
//           id="scroll-dialog-title"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between'
//           }}
//         >
//           <Typography variant="h6">Edit Ticket</Typography>
//           <Typography>
//             <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
//           </Typography>
//         </DialogTitle>


//         <DialogContent dividers>
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between'}} >
//               <Grid item xs={12} sm={6} md={12}>
//               <TextField
//                 id="staffId"
//                 name="staffId"
//                 select
//                 label="Staff Name"
//                 fullWidth
//                 value={formik.values.staffId}
//                 onChange={formik.handleChange}
//                 error={formik.touched.staffId && Boolean(formik.errors.staffId)}
//                 helperText={formik.touched.staffId && formik.errors.staffId}
//               >
//                 <MenuItem value="default" disabled>
//                   Select Staff From Here
//                 </MenuItem>
//                 {employeNames.map(employee => (
//                   <MenuItem key={employee.id} value={employee.id}>{employee.fullName}</MenuItem>
//                 ))}
//               </TextField>
//               </Grid>

//               <Grid item xs={12} sm={6} md={12}>
//                 <TextField
//                   id="description"
//                   name="description"
//                   label="Description"
//                   fullWidth
//                   value={formik.values.description}
//                   onChange={formik.handleChange}
//                   error={formik.touched.description && Boolean(formik.errors.description)}
//                   helperText={formik.touched.description && formik.errors.description}
//                 />
//               </Grid>
//             </Grid>

//             {/* <DialogActions>
//             <Button type="submit" variant="contained" color="primary">
//               Add Ticket
//             </Button>
//           </DialogActions> */}
//           </form>
//         </DialogContent>


//         <DialogActions>
//           <Button onClick={handleClose} color="error">
//             Cancel
//           </Button>
//           <Button
//             onClick={formik.handleSubmit}
//             variant="contained"
//             sx={{
//               backgroundColor: Palette.info,
//               '&:hover': { backgroundColor: Palette.infoDark }
//             }}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EditKot;

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { kotSchema } from 'schema/kotSchema';
import { postApi, getApi, patchApi } from 'views/services/api';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';

const EditKot = (props) => {
  const { open, handleClose, data } = props;
  console.log("props=====>",props);
  
  const initialValues = {
    staffId: data?.staffId || '',
    description: data?.description || '',
  };

  console.log("initialValues==>",initialValues);

  const [employeNames, setEmployeNames] = useState([]);

  useEffect(() => {
    if (open) {
      const hotel = JSON.parse(localStorage.getItem('hotelData'));
      getApi(`api/employee/viewallemployee/${hotel?.hotelId}`)
        .then(response => {
          const employeeData = response.data.employeeData.map(employee => ({
            id: employee._id,
            fullName: employee.fullName
          }));
          console.log("employeeData   =====>", employeeData);
          setEmployeNames(employeeData);
        })
        .catch(error => {
          console.error("Employee Names List is not Found!!", error);
        });
    }
  }, [open]);

  const editData = async (values, resetForm) => {
    console.log("in editData values=>",values);
    try {
      values.hotelId = await JSON.parse(localStorage.getItem('hotelData'))._id;
      console.log("Ap hit ==>",`api/kitchenorderticket/editKot/${data._id}`);
      let response = await patchApi(`api/kitchenorderticket/editKot/${data._id}`, values);
      console.log("edit response ====>", response);

      if (response.status === 200) {
        toast.success('Ticket Edited successfully');
        handleClose();
        resetForm();
      } else {
        toast.error('Cannot edit Ticket');
      }
    } catch (e) {
      console.log(e);
      toast.error('Cannot edit Ticket');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: kotSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log("in onSubmit values ==>", values);
      editData(values, resetForm);
    }
  });

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Edit Ticket</Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between'}} >
              <Grid item xs={12} sm={6} md={12}>
              <TextField
                id="staffId"
                name="staffId"
                select
                label="Staff Name"
                fullWidth
                value={formik.values.staffId}
                onChange={formik.handleChange}
                error={formik.touched.staffId && Boolean(formik.errors.staffId)}
                helperText={formik.touched.staffId && formik.errors.staffId}
              >
                <MenuItem value="default" disabled>
                  Select Staff From Here
                </MenuItem>
                {employeNames.map(employee => (
                  <MenuItem key={employee.id} value={employee.id}>{employee.fullName}</MenuItem>
                ))}
              </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  fullWidth
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
            </Grid>

            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Edit Ticket
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditKot.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default EditKot;

