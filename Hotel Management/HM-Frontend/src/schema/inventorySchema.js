import * as yup from 'yup';

export const inventorySchema = yup.object({
  name: yup.string().required('Item name is required'),
  totalQuantity: yup
    .number()
    .typeError('Total quantity must be a number')
    .required('Total quantity is required')
    .min(1, 'Total quantity must be at least 1'),
  department: yup.string().required('Department is required'),
  unitOfMeasure: yup.string().required('Unit of Measure is required'),
  distributed: yup
    .number()
    .typeError('Distributed must be a number')
    .required('Distributed is required')
    .min(0, 'Distributed cannot be negative')
    .max(yup.ref('totalQuantity'), 'Distributed cannot exceed total quantity'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(0, 'Amount cannot be negative')
});
