import * as yup from 'yup';

export const emailSchema = yup.object({
  sender: yup.string(),
  recipient: yup.string().required('Recipient Is required'),
  startDate: yup.string(),
  endDate: yup.string(),
  category: yup.string(),
  subject: yup.string(),
  message: yup.string(),
  createBy: yup.string(),
  createByLead: yup.string()
});
