import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router';
import { Header } from '../components/Common/Header';
import { Footer } from '../components/Common/Footer';
import { TrackingScript } from '../components/Common/TrackingScript';
import { fetchCart, addToCart } from '../actions/cart';

import { WP_API } from '../../server/config/app';

class App extends Component {

  componentDidMount() {
    const { fetchCart } = this.props;
    fetchCart();
  }
  buyMeABeanie = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${WP_API}/wc/v2/cart/add`, {
      product_id: 44,
      quantity: 1
    });
    console.log('Added item to cart on the client', response);
  }
  viewMyCart = async (event) => {
    event.preventDefault();
    const response = await axios.get(`${WP_API}/wc/v2/cart`);
    console.log('Fetched cart on the client', response);
  }
  fetchCartHandler = (event) => {
    const { fetchCart } = this.props;
    event.preventDefault();
    fetchCart();
  }
  addToCartHandler = (event) => {
    const { addToCart } = this.props;
    event.preventDefault();
    addToCart();
  }
  render() {
    const { children, starward, location} = this.props;
    const { settings, headerMenu } = starward;
    return (
      <div className={location.pathname === '/' ? 'home' : location.pathname.replace(/\//g, '')}>
        <Header
          siteName={settings.name}
          navigation={headerMenu && headerMenu.length > 0 ? headerMenu : []}
          currentPath={location.pathname}
        />
        <div className="test-buttons">
          <Link className="test-button" to="#" onClick={(event) => this.addToCartHandler(event)}>Buy me a beanie (Server)</Link>
          <Link className="test-button" to="#" onClick={(event) => this.fetchCartHandler(event)}>View my cart (Server)</Link>
          <Link className="test-button" to="#" onClick={(event) => this.buyMeABeanie(event)}>Buy a beanie (Client)</Link>
          <Link className="test-button" to="#" onClick={(event) => this.viewMyCart(event)}>View my cart (Client)</Link>
        </div>
        {children}
        <Footer siteName={settings.name} />
        <TrackingScript
          type={!settings.trackingType ? 'none' : settings.trackingType}
          id={!settings.trackingId ? '' : settings.trackingId}
        />
      </div>
    );
  }
}

function mapStateToProps({starward, loading, cart}) {
  return {
    loading,
    starward,
    cart
  };
}

export default connect(mapStateToProps, {
  fetchCart,
  addToCart
})(App);
