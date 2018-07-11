import React, { Component } from 'react';
import { connect } from 'react-redux';

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
      short_description,
      images,
      price,
      regular_price,
      sale_price,
      price_html,
      attributes,
      in_stock,
      stock_quantity,
      type,
      featured,
      catalog_visibility
    } = product;
    return (
      <main className="content" role="main">
        <Head defaultTitle={`${name} - ${settings.name}`} />
        <Title title={name} />
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
