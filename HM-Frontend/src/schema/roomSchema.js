import * as yup from 'yup';
const role=JSON.parse(localStorage.getItem('hotelData'))?.role

export const roomSchema = yup.object( {
  roomNo: yup.string().required( 'Room Number Is required' ),
  roomType: yup.string().required( 'Room Type Is required' ),
  amount: yup.number().min( 1, 'Amount must be greater than 0' ).required( 'Amount Is required' ),
  hotelId: yup.string().when([],{
    is:()=> role === 'admin',
    then: yup.string().required('Hotel Name is Required'),
    otherwise: yup.string()

}),
} );
