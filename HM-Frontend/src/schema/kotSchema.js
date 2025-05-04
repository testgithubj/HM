import * as yup from 'yup';

export const kotSchema = yup.object({
  staffId :  yup.string().required('Staff Name is required'),
  description: yup.string().required('Description is required'),
});