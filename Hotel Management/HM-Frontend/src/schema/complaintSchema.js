import * as yup from 'yup';

export const complaintSchema = yup.object({
  description: yup.string().required('Description is required'),
  type: yup.string().required('Complaint Type is required')
});
