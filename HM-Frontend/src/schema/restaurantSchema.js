// import * as yup from 'yup';

// export const restaurantSchema = yup.object({
//   itemName: yup.string().required('Description is required'),
//   itemImage: yup.string(),
//   amount: yup.number().required('Amount is required').positive('Amount must be positive')
// });

// schema.js (or wherever you want to keep your schema)
import * as yup from 'yup';

export const restaurantSchema = yup.object( {
  itemName: yup.string().required( 'Item Name is required' ),
  itemImage: yup.mixed().required( 'Image is required' ),
  amount: yup.number().required( 'Amount is required' ).positive( 'Amount must be positive' ),
  category: yup.string().required( 'Category is required' )
} );