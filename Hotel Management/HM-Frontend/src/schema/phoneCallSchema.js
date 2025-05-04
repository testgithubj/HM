import * as yup from 'yup';

export const phoneCallSchema = yup.object({
  sender: yup.string(),
  // recipient: yup.number().min(99999999, 'Phone number is invalid length').max(999999999999, 'Phone number is invalid').required("Recipient Is required"),
  recipient: yup.string().required('Recipient is required'),
  endDate: yup.string(),
  startDate: yup.string(),
  callDuration: yup.string(),
  callNotes: yup.string(),
  createBy: yup.string(),
  createByLead: yup.string(),
  category: yup.string().required('category is required')
});
