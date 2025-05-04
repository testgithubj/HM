import * as yup from 'yup';

export const laundarySchema = yup.object({
  roomNo: yup.string().required('Room number is required'),
  name: yup.string().required('Item name is required'),
  quantity: yup.string().required('Quantity is required'),
  status: yup.string().default('pending').optional(),
  amount: yup.string().required('Amount is required')
});
