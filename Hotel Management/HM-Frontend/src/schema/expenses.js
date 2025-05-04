import * as yup from 'yup';

export const expenseSchema = yup.object({
  description: yup.string().required('Description is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  category: yup.string().required('Category is required')
});
