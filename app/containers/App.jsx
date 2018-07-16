import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
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
  logCookies = async (event) => {
    event.preventDefault();
    const allCookies = Cookies.get();
    const cookieCartHash = Cookies.get('woocommerce_cart_hash');
    const cookieItemsInCart = Cookies.get('woocommerce_items_in_cart');
    const cookies = Cookies.get();
    let sessionKey = false;
    if (cookies) {
      const cookieKeys = Object.keys(cookies);
      for (const key of cookieKeys) {
        if (key.includes('wp_woocommerce_session_')) {
          sessionKey = key;
        }
      }
    }
    const cookieWooCommerceSession = sessionKey ? Cookies.get(sessionKey) : false;
    console.log({cookieCartHash});
    console.log({cookieItemsInCart});
    console.log({cookieWooCommerceSession});
    console.log({allCookies});
  }
  fetchCartHandler = (event) => {
    event.preventDefault();
    const { fetchCart } = this.props;
    fetchCart();
  }
  addToCartHandler = (event, productId, quantity) => {
    event.preventDefault();
    const { addToCart } = this.props;
    addToCart(productId, quantity);
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
          <Link className="test-button" to="#" onClick={(event) => this.addToCartHandler(event, 44, 1)}>Buy me a beanie</Link>
          <Link className="test-button" to="#" onClick={(event) => this.addToCartHandler(event, 50, 1)}>Buy me some sunglasses</Link>
          <Link className="test-button" to="#" onClick={(event) => this.addToCartHandler(event, 52, 1)}>Buy me a hoodie</Link>
          <Link className="test-button" to="#" onClick={(event) => this.fetchCartHandler(event)}>View my cart</Link>
          <Link className="test-button" to="#" onClick={(event) => this.logCookies(event)}>Log Cookies</Link>
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
