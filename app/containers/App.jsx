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
  constructor(props) {
    super(props);
    const cookies = Cookies.get();
    if (cookies) {
      const cookieKeys = Object.keys(cookies);
      let sessionKey = false;
      for (const key of cookieKeys) {
        if (key.includes('wp_woocommerce_session_')) sessionKey = key;
      }
      this.state = {
        sessionKey
      };
    } else {
      this.state = {
        sessionKey: false
      };
    }
  }

  componentDidMount() {
    const { fetchCart } = this.props;
    const { sessionKey } = this.state;
    const sessionCookie = sessionKey ? Cookies.get(sessionKey) : false;
    if (sessionCookie) {
      console.log('Woocommerce cart session found!', sessionCookie);
    } else {
      console.log('Existing cart not found');
    }
    fetchCart(sessionCookie);
  }
  buyMeABeanie = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${WP_API}/wc/v2/cart/add`, {
      product_id: 44,
      quantity: 1
    }, { withCredentials: true });
    const resCookies = response.headers['set-cookie'];
    console.log('Added item to cart on the client', response);
    console.log(`response cookies @ ${WP_API}/wc/v2/cart/add`, resCookies);
  }
  viewMyCart = async (event) => {
    event.preventDefault();
    const response = await axios.get(`${WP_API}/wc/v2/cart`, { withCredentials: true });
    const resCookies = response.headers['set-cookie'];
    console.log('Fetched cart on the client', response);
    console.log(`response cookies @ ${WP_API}/wc/v2/cart`, resCookies);
  }
  logCookies = async (event) => {
    event.preventDefault();
    const { sessionKey } = this.state;
    const allCookies = Cookies.get();
    const cookieCartHash = Cookies.get('woocommerce_cart_hash');
    const cookieItemsInCart = Cookies.get('woocommerce_items_in_cart');
    const cookieWooCommerceSession = Cookies.get(sessionKey);
    console.log({cookieCartHash});
    console.log({cookieItemsInCart});
    console.log({cookieWooCommerceSession});
    console.log({allCookies});
  }
  fetchCartHandler = (event) => {
    event.preventDefault();
    const { fetchCart } = this.props;
    const { sessionKey } = this.state;
    const sessionCookie = sessionKey ? Cookies.get(sessionKey) : false;
    fetchCart(sessionCookie);
  }
  addToCartHandler = (event) => {
    event.preventDefault();
    const { addToCart } = this.props;
    const { sessionKey } = this.state;
    const sessionCookie = sessionKey ? Cookies.get(sessionKey) : false;
    addToCart(sessionCookie);
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
          <Link className="test-button" to="#" onClick={(event) => this.logCookies(event)}>Log Cookies (Client)</Link>
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
