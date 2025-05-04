import * as yup from 'yup';

export const hotelSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
  name: yup.string().required('Hotel name is required'),
  contact: yup.string().required('Contact number is required'),
  address: yup.string().required('Address is required')
});
