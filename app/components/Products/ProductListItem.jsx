import React from 'react';
import { Link } from 'react-router';
import { ProductImage } from './ProductImage.jsx';

export const ProductListItem = props => {
  const {
    slug,
    name,
    description,
    id,
    regular_price,
    sale_price,
    price_html,
    images
  } = props;
  return (
    <div className="product">
      { images.length > 0 &&
        <ProductImage baseImage={images[0]} />
      }
      <Link to="#">
        <h3>{name}</h3>
      </Link>
    </div>
  );
};
