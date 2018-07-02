import React, { Component } from 'react';
import { connect } from 'react-redux';
import { STORE_SLUG } from '../config/app';
import { Head } from '../components/Common/Head';
import { Title } from '../components/Content/Title';
import { Loading } from '../components/Content/Loading';
import { FourOhFour } from '../components/Content/FourOhFour';

import { ProductList } from '../components/Products/ProductList';
import { LayeredNavigation } from '../components/Products/LayeredNavigation';

class ProductCategory extends Component {
  render() {
    const { category, loading, settings, params } = this.props;
    if (loading) return <Loading />;
    if (!category) return <FourOhFour />;
    const { details, products, attributes } = category;
    return (
      <main className="content" role="main">
        <Head defaultTitle={`${details.name} - ${settings.name}`} />
        <Title title={details.name} />
        <LayeredNavigation
          attributes={attributes}
          />
        <ProductList
          products={products}
          urlBase={`${STORE_SLUG}/${params.category}`}
          currentPage={params.page}
          />
      </main>
    );
  }
}

function mapStateToProps({starward, loading}) {
  const { category, settings } = starward;
  return {
    loading,
    category,
    settings
  };
}

export default connect(mapStateToProps, { })(ProductCategory);
