import React from 'react';
import { Link } from 'react-router';
import { ProductImage } from './ProductImage.jsx';
// import { baseUrl, STORE_PRODUCTS_SLUG } from '../../config/app';

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
      <Link to={`/products/${slug}`}>
        <h3>{name}</h3>
      </Link>
      <div dangerouslySetInnerHTML={{ __html: price_html }} />
    </div>
  );
};
