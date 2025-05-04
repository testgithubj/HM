import { Typography } from '@mui/material';

import menuItem from 'menu-items';
import NavGroup from './NavGroup';

const filterMenuItems = (menuItems, permissions) => {
  return menuItems
    ?.filter(
      (item) =>
        permissions?.includes(item?.title) || (item?.children && item?.children?.some((child) => permissions?.includes(child?.title)))
    )
    .map((item) => {
      if (item?.children) {
        return {
          ...item,
          children: item?.children?.filter((child) => permissions?.includes(child?.title))
        };
      }
      return item;
    });
};

const getUserData = () => {
  const userData = localStorage.getItem('hotelData');
  return userData ? JSON.parse(userData) : null;
};

const MenuList = () => {
  const userData = getUserData();

  let navItems = [];

  if (userData) {
    const { role, permissions } = userData;

    if (role === 'admin') {
      navItems = menuItem?.navAdminItems?.map((item, index) => {
        switch (item.type) {
          case 'group':
            return <NavGroup key={index} item={item} />;
          default:
            return (
              <Typography key={item.id} variant="h6" color="error" align="center">
                Menu Items Error
              </Typography>
            );
        }
      });
    } else if (role === 'HotelAdmin') {
      navItems = menuItem?.navHotelAdminItems?.map((item) => {
        switch (item.type) {
          case 'group':
            return <NavGroup key={item.id} item={item} />;
          default:
            return (
              <Typography key={item.id} variant="h6" color="error" align="center">
                Menu Items Error
              </Typography>
            );
        }
      });
    } else {
      const filteredItems = filterMenuItems(menuItem.items, permissions);
      console.log('here is the selected filteredItems -------------------------->', filteredItems);

      navItems = filteredItems.map((item) => {
        switch (item.type) {
          case 'group':
            return <NavGroup key={item.id} item={item} />;
          case 'collapse':
            return <NavGroup key={item.id} item={item} />;
          default:
            return (
              <Typography key={item.id} variant="h6" color="error" align="center">
                Menu Items Error
              </Typography>
            );
        }
      });
    }
  }
  return <>{navItems}</>;
};
export default MenuList;
