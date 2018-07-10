import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import ReactSlider from 'react-slider';

class PriceSlider extends Component {
  handleChange = (value) => {
    const { location } = this.props;
    const newMinPrice = value[0];
    const newMaxPrice = value[1];
    browserHistory.push({
      ...location,
      query: {
        ...location.query,
        min_price: newMinPrice,
        max_price: newMaxPrice
      }
    });
  }

  render() {
    const { filter, index, location } = this.props;
    const { min_price: minPrice, max_price: maxPrice } = filter;
    const hasNewPrices = ('min_price' in location.query) || ('max_price' in location.query);
    const newMinPrice = hasNewPrices ? parseInt(location.query.min_price) : null;
    const newMaxPrice = hasNewPrices ? parseInt(location.query.max_price) : null;
    if (filter && minPrice !== maxPrice) {
      return (
        <section className="filter-block" key={index}>
          <h3>Price</h3>
          <ReactSlider
            defaultValue={hasNewPrices ? [newMinPrice, newMaxPrice] : [minPrice, maxPrice]}
            min={minPrice}
            max={maxPrice}
            className="price-slider"
            onAfterChange={this.handleChange}
            withBars
            />
        </section>
      );
    }
    return null;
  }
}
export default PriceSlider;
