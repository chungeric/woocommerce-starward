import React, { Component } from 'react';

class PriceSlider extends Component {
  render() {
    const { filter, index } = this.props;
    const { min_price: minPrice, max_price: maxPrice } = filter;
    if (filter && minPrice !== maxPrice) {
      return (
        <section className="filter-block" key={index}>
          <h3>Price</h3>
          <label htmlFor="price">Price</label>
          <input
            type="range"
            id="price-slider"
            name="price"
            min={minPrice}
            max={maxPrice}
            />
        </section>
      );
    }
    return null;
  }
}
export default PriceSlider;
