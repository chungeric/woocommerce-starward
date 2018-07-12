import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { WP_URL } from '../../server/config/app';
import { STORE_PRODUCTS_SLUG } from '../../app/config/app';

import { Head } from '../components/Common/Head';
import { Title } from '../components/Content/Title';
import { Loading } from '../components/Content/Loading';
import { FourOhFour } from '../components/Content/FourOhFour';

class Product extends Component {
  render() {
    const { product, loading, settings, params, location } = this.props;
    if (loading) return <Loading />;
    if (!product) return <FourOhFour />;
    // Extract data from product details response
    const {
      sku,
      id,
      name,
      slug,
      description,
      short_description: shortDescription,
      images,
      price,
      regular_price: regularPrice,
      sale_price: salePrice,
      price_html: priceHtml,
      attributes,
      in_stock: inStock,
      stock_quantity: stockQuantity,
      type,
      catalog_visibility: catalogVisibility,
      relatedProducts
    } = product;
    const baseImage = images.length > 0 ? images[0] : null;
    return (
      <main className="content" role="main">
        <Head defaultTitle={`${name} - ${settings.name}`} />
        { baseImage &&
          <img
            src={`${WP_URL}${baseImage.src}`}
            alt={baseImage.src} />
        }
        { images.length > 1 &&
          images.map(image => {
            return (
              <img src={`${WP_URL}${image.src}`} alt={image.alt} />
            );
          })
        }
        <Title title={name} />
        <p dangerouslySetInnerHTML={{__html: sku}} />
        <div className="short-description">
          <p dangerouslySetInnerHTML={{__html: shortDescription}} />
        </div>
        <div className="price-container">
          { salePrice ? (
            <div className="price">
              <p className="regular-price">Was {regularPrice}</p>
              <p className="sale-price">Now {salePrice}</p>
            </div>
          ) : (
            <div className="price">
              <p className="regular-price">{regularPrice}</p>
            </div>
          )}
        </div>
        { attributes.map(attribute => {
          return (
            <div key={attribute.name}>
              { attribute.options.map((option, i) => {
                return <span key={i}>{option} </span>;
              })}
            </div>
          );
        })}
        <div className="description">
          <h2>Product Description</h2>
          <p dangerouslySetInnerHTML={{__html: description}} />
        </div>
        { relatedProducts && <h2>Related Products</h2> }
        { relatedProducts &&
          relatedProducts.map(relatedProduct => {
            const {
              images,
              id,
              name,
              regular_price: relatedProductRegularPrice,
              sale_price: relatedProductSalePrice,
              slug,
            } = relatedProduct;
            const relatedProductBaseImage = (images && images.length > 0) ? images[0] : null;
            return (
              <Link to={`/${STORE_PRODUCTS_SLUG}/${slug}`} className="related-product" key={id}>
                { relatedProductBaseImage && <img src={`${WP_URL}${relatedProductBaseImage.src}`} alt={relatedProductBaseImage.alt} />}
                <h3 key={id}>{name}</h3>
                { relatedProductSalePrice ? (
                  <div className="price">
                    <p className="regular-price">Was {relatedProductRegularPrice}</p>
                    <p className="sale-price">Now {relatedProductSalePrice}</p>
                  </div>
                ) : (
                  <div className="price">
                    <p className="regular-price">{relatedProductRegularPrice}</p>
                  </div>
                )}
              </Link>
            );
          })}
      </main>
    );
  }
}

function mapStateToProps({starward, loading}) {
  const { product, settings } = starward;
  return {
    loading,
    product,
    settings
  };
}

export default connect(mapStateToProps, { })(Product);
