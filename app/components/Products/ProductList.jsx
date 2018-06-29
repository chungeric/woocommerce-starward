import React from 'react';
import { ProductListItem } from './ProductListItem.jsx';
// import { Pagination } from './Pagination';

export const ProductList = props => {
  const {
    products,
    currentPage,
    fetchMorePosts,
    starwardUpdating
  } = props;
  if (!products || products.length < 1) {
    return <h3>No Posts Found</h3>;
  }
  // const samePagePagination = true;
  return (
    <section className="products">
      <section className="products-list">
        {products.length < 1 ? <h2>No Products Found</h2> : null}
        {products.map((product, index) => <ProductListItem key={index} {...product} />)}
      </section>
      {/* <Pagination
        samePage={samePagePagination}
        posts={posts}
        currentPage={currentPage}
        fetchMorePosts={fetchMorePosts}
        starwardUpdating={starwardUpdating}
      /> */}
    </section>
  );
};
