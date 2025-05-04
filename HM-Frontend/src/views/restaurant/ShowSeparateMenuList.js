import React from 'react';

const ShowSeparateMenuList = (props) => {
  console.log('props =>', props);
  const menuItems = [
    { name: 'Pizza', category: 'Main Course', price: 12.99 },
    { name: 'Salad', category: 'Appetizer', price: 7.99 },
    { name: 'Ice Cream', category: 'Dessert', price: 5.49 }
  ];

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> - {item.category} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowSeparateMenuList;
