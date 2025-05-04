/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormHelperText, Grid, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { getApi, postApi } from 'views/services/api';
import { toast } from 'react-toastify';
import Palette from '../../ui-component/ThemePalette';
import { roomSchema } from 'schema';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, FormControl } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';

const AddRoom = (props) => {
	const { open, handleClose } = props;
	const [hotelName, setHotelName] = useState([]);

	const role = JSON.parse(localStorage.getItem('hotelData')).role;

	useEffect(() => {
		const data = async () => {
			const response = await getApi('api/hotel/viewallhotels')
			setHotelName(response?.data)
		}
		data();
	}, [])

	const initialValues = {
		roomNo: '',
		roomType: 'default',
		amount: '',
		ac: null,
		smoking: null,
		description: ''
	};

	const handleCheckboxChange = (event, field) => {
		if (event.target.checked) {
			formik.setFieldValue(field, event.target.name);
		} else {
			formik.setFieldValue(field, null);
		}
	};

	const AddData = async (values) => {
		try {
			const hotelData = JSON.parse(localStorage.getItem('hotelData'));
			role !== 'admin'&& (values.hotelId = hotelData.hotelId)
			// values.hotelId =  e.values.hotelId
			console.log("values.hotelId ===>", values.hotelId);

			let response = await postApi('api/room/add', values);

			if (response.status === 200) {
				formik.resetForm();
				toast.success('Room added successfully');
			} else {
				toast.error(response.response.data.error);
			}
		} catch (e) {
			// Handle unexpected errors
			toast.error(e?.response?.data?.error || 'An error occurred');
		} finally {
			// setIsLoding(false);  // Uncomment when using loading state
		}
	};

	const formik = useFormik({
		initialValues,
		validationSchema: roomSchema,
		onSubmit: async (values) => {
			AddData(values);
			handleClose();
		}
	});

	return (
		<div>
			<Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
				<DialogTitle
					id="scroll-dialog-title"
					style={{
						display: 'flex',
						justifyContent: 'space-between'
					}}
				>
					<Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>Add New Room</Typography>
					<Typography>
						<ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
					</Typography>
				</DialogTitle>
				<DialogContent dividers>
					<form>
						<DialogContentText id="scroll-dialog-description" tabIndex={-1}>
							<Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
								<Grid item xs={12} sm={12} md={12}>
									<TextField
										id="roomNo"
										name="roomNo"
										label="Room No"
										// size="small"
										fullWidth
										placeholder="Enter Room Number"
										value={formik.values.roomNo}
										onChange={formik.handleChange}
										error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}
										helperText={formik.touched.roomNo && formik.errors.roomNo}
										sx={{ borderRadius: 0 }}
									/>
								</Grid>

								{/* //room type  */}
								<Grid item xs={12} sm={12} md={12}>
									<Select
										id="roomType"
										name="roomType"
										// size="small"
										fullWidth
										value={formik.values.roomType}
										onChange={formik.handleChange}
										error={formik.touched.roomType && Boolean(formik.errors.roomType)}
									>
										<MenuItem value="default" disabled>
											Select Room Type
										</MenuItem>
										<MenuItem value="single">Single</MenuItem>
										<MenuItem value="double">Double</MenuItem>
										<MenuItem value="triple">Triple</MenuItem>
										<MenuItem value="family">Family</MenuItem>
									</Select>
									<FormHelperText error={formik.touched.roomType && formik.errors.roomType}>
										{formik.touched.roomType && formik.errors.roomType}
									</FormHelperText>
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
									<TextField
										id="amount"
										name="amount"
										type="number"
										label="Amount"
										// size="small"
										fullWidth
										placeholder="Enter Room Amount"
										value={formik.values.amount}
										onChange={formik.handleChange}
										error={formik.touched.amount && Boolean(formik.errors.amount)}
										helperText={formik.touched.amount && formik.errors.amount}
									/>
								</Grid>


								{role === 'admin' && <Grid item xs={12} sm={12} md={12}>
									<Select
										id="hotelId"
										name="hotelId"
										// size="small"
										fullWidth
										value={formik.values.hotelId || "default"}
										onChange={formik.handleChange}
									// error={ formik.touched.roomType && Boolean( formik.errors.roomType ) }
									>
										<MenuItem value="default" disabled>
											Select Hotel Name
										</MenuItem>
										{hotelName?.map((item, index) => (<MenuItem key={index} value={`${item.hotelId}`}>{item.name}</MenuItem>
										))}

									</Select>
									<FormHelperText error={formik.touched.roomType && formik.errors.roomType}>
										{formik.touched.roomType && formik.errors.roomType}
									</FormHelperText>
								</Grid>}

								{/* AC/Non-AC Selection */}
								<Grid item xs={12} sm={12} md={12}>
									<FormControl component="fieldset">
										<FormLabel component="legend">AC Type</FormLabel>
										<FormGroup row>
											<FormControlLabel
												sx={{ paddingX: '10px' }}
												control={
													<Checkbox
														checked={formik.values.ac === 'AC'}
														onChange={(e) => handleCheckboxChange(e, 'ac')}
														name="AC"
													/>
												}
												label="AC"
											/>
											<FormControlLabel
												sx={{ paddingX: '10px' }}

												control={
													<Checkbox
														checked={formik.values.ac === 'Non-AC'}
														onChange={(e) => handleCheckboxChange(e, 'ac')}
														name="Non-AC"
													/>
												}
												label="Non-AC"
											/>
										</FormGroup>
									</FormControl>
								</Grid>

								{/* Smoking/Non-Smoking Selection */}
								<Grid item xs={12} sm={12} md={12}>
									<FormControl component="fieldset">
										<FormLabel component="legend">Smoking Availability</FormLabel>
										<FormGroup row>
											<FormControlLabel
												sx={{ paddingX: '10px' }}

												control={
													<Checkbox
														checked={formik.values.smoking === 'Smoking'}
														onChange={(e) => handleCheckboxChange(e, 'smoking')}
														name="Smoking"
													/>
												}
												label="Smoking"
											/>
											<FormControlLabel
												sx={{ paddingX: '10px' }}

												control={
													<Checkbox
														checked={formik.values.smoking === 'Non-Smoking'}
														onChange={(e) => handleCheckboxChange(e, 'smoking')}
														name="Non-Smoking"
													/>
												}
												label="Non-Smoking"
											/>
										</FormGroup>
									</FormControl>
								</Grid>

								{/* <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
									<TextField
										id="description"
										name="description"
										label="Description"
										multiline
										rows={ 4 }
										fullWidth
										value={ formik.values.description }
										onChange={ formik.handleChange }
										error={ formik.touched.description && Boolean( formik.errors.description ) }
										helperText={ formik.touched.description && formik.errors.description }
									/>
								</Grid> */}
							</Grid>
						</DialogContentText>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="error">
						Cancel
					</Button>
					<Button
						onClick={formik.handleSubmit}
						variant="contained"
						sx={{
							backgroundColor: Palette.info,
							'&:hover': { backgroundColor: Palette.infoDark }
						}}
					>
						Add Room
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AddRoom;
