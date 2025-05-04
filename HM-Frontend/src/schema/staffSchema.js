import * as yup from 'yup';

export const staffSchema = yup.object( {
  employeeType: yup.string().notOneOf( [ 'default' ], 'Employee Type is required' ),
  shift: yup.string().notOneOf( [ 'default' ], 'Shift is required' ),
  phoneNumber: yup.string().required( 'Phone Number is required' ),
  firstName: yup.string().required( 'First Name is required' ),
  lastName: yup.string().required( 'Last Name is required' ),
  email: yup.string().email( 'Invalid email format' ).required( 'Email is required' ),
  idCardType: yup.string().required().notOneOf( [ 'default' ], 'ID Card Type is required' ),
  idcardNumber: yup
    .string()
    .required()
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
    } ),
  address: yup.string().required( 'Address is required' ),
  idFile: yup.mixed(),
  salary: yup.number().positive( 'salary must be positive' ).required( 'Salary is required' )
} );

export const staffSchemaEdit = yup.object( {
  employeeType: yup.string().notOneOf( [ 'default' ], 'Employee Type is required' ),
  shift: yup.string().notOneOf( [ 'default' ], 'Shift is required' ),
  phoneNumber: yup.string().required( 'Phone Number is required' ),
  firstName: yup.string().required( 'First Name is required' ),
  lastName: yup.string().required( 'Last Name is required' ),
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
    } ),
  address: yup.string().required( 'Address is required' ),
  idFile: yup.mixed().required(),
  idFile2: yup
    .mixed()
    .required( 'ID Card Back is required' )
    .test( 'fileType', 'Unsupported file type', ( value ) => {
      return value && [ 'image/jpeg', 'image/png', 'application/pdf' ].includes( value.type );
    } )
    .test( 'fileSize', 'File size exceeds 2MB', ( value ) => {
      return value && value.size <= 2 * 1024 * 1024; // 2MB limit
    } ),
  salary: yup.number().required( 'Salary is required' ).positive( 'salary must be positive' )
} );
