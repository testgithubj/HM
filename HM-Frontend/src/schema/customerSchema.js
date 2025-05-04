import * as yup from 'yup';

export const customerSchema = yup.object( {
  phoneNumber: yup.string().required( 'Phone Number is required' ),
  firstName: yup.string().required( 'First Name is required' ),
  lastName: yup.string().required( 'Last Name is required' ),
  email: yup.string().email( 'Invalid email format' ).required( 'Email is required' ),
  idCardType: yup.string().notOneOf( [ 'default' ], 'ID Card Type is required' ),
  idcardNumber: yup
    .string()
    .when( 'idCardType', {
      is: 'Aadharcard',
      then: yup.string().matches( /^\d{12}$/, 'Aadharcard Number must be 12 digits' )
    } )
    .when( 'idCardType', {
      is: 'VoterIdCard',
      then: yup.string().matches( /^[A-Z]{3}[0-9]{7}$/, 'VoterIdCard Number must be in the format AAA1111111' )
    } )
    .when( 'idCardType', {
      is: 'PanCard',
      then: yup.string().matches( /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, 'PanCard Number must be in the format ABCDE1234F' )
    } )
    .when( 'idCardType', {
      is: 'DrivingLicense',
      then: yup.string().required( 'Driving License Number is required' )
    } )
    .required( 'ID Card Number is required' ),
  address: yup.string().required( 'Address is required' ),
  idFile: yup.mixed()
} );
