import { useEffect, useState } from 'react';
import { getApi } from 'views/services/api';
import Logo from 'ui-component/Logo.png';
import { ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const getUserData = () => {
  const userData = localStorage.getItem('hotelData');
  return userData ? JSON.parse(userData) : null;
};

const LogoSection = () => {

  const userData = getUserData();

  const navigate = useNavigate();
  const hotel = JSON.parse( localStorage.getItem( 'hotelData' ) );
  const [ logoUrl, setLogoUrl ] = useState( Logo );
  const baseUrl = process.env.REACT_APP_URL || '';
  const fetchHotelData = async () => {
    try {
      const response = await getApi( `api/hotel/view/${ hotel?.hotelId }` );
      const imageUrl = response.data.hotelImage ? `${ baseUrl }${ response.data.hotelImage }` : Logo;
      setLogoUrl( imageUrl );
    } catch ( error ) {
      console.log( 'Error fetching hotel data:', error );
    }
  };

  useEffect( () => {
    fetchHotelData();
  }, [ hotel?.hotelId ] );

  const DefaultUrl=JSON.parse(localStorage.getItem('defaultUrl'))
  // console.log('DefaultUrl',JSON.parse(DefaultUrl))

  return (
    <ButtonBase disableRipple onClick={ () => navigate( `${ DefaultUrl}` ) }>
      <img
        src={ logoUrl }
        alt="logo"
        style={ {
          width: '178px',
          height: '40px',
          objectFit: 'cover',
          overflow: 'hidden',
        } }
        onError={ ( e ) => {
          e.target.onerror = null;
          e.target.src = Logo;
        } }
      />
    </ButtonBase>
  );
};

export default LogoSection;