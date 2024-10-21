import React, { useState } from 'react';
import { Radio, Select } from 'antd';
const CategoryButton = ({setSelectedValue , defaultValue}) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultValue);
  const handleChange = (value) => {
    setSelectedValue(value); 
    // console.log('Selected value:', value);
  };
  return (
    <>
      <Select
        value= {defaultValue}
        style={{
          width: '100%',
        }}

        options={[
          {
            value: 'Beauty',
          },
          {
            value: 'Groceries',
          },
          {
            value: 'Furniture',
          },
          {
            value: `Men's Clothing`,
          },
          {
            value: `Women's  Clothing`,
          },
          {
            value: `Footwear`,
          },
          {
            value: `Accessories`,
          },
          {
            value: `Skin-Care`,
          },
          {
            value: `Vehicle`,
          },
        ]}
        onChange={handleChange}
      />
    </>
  );
};
export default CategoryButton;