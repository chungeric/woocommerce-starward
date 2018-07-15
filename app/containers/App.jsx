import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router';
import { Header } from '../components/Common/Header';
import { Footer } from '../components/Common/Footer';
import { TrackingScript } from '../components/Common/TrackingScript';

import { WP_API } from '../../server/config/app';

class App extends Component {
  buyMeABeanie = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${WP_API}/wc/v2/cart/add`, {
      product_id: 44,
      quantity: 1
    });
  }
  viewMyCart = async (event) => {
    event.preventDefault();
    const response = await axios.get(`${WP_API}/wc/v2/cart`, {withCredentials: true});
    console.log('cart response!', response);
  }
  render() {
    const { children, starward, location } = this.props;
    const { settings, headerMenu } = starward;
    return (
      <div className={location.pathname === '/' ? 'home' : location.pathname.replace(/\//g, '')}>
        <Header
          siteName={settings.name}
          navigation={headerMenu && headerMenu.length > 0 ? headerMenu : []}
          currentPath={location.pathname}
        />
        <Link to="#" onClick={this.buyMeABeanie}>Buy me a beanie!</Link>
        <Link to="#" onClick={this.viewMyCart}>View my cart!</Link>
        <Link to="#" onClick={this.buyMeABeanie}>Buy a beanie (Endpoint)</Link>
        <Link to="#" onClick={this.viewMyCart}>View my cart (Endpoint)</Link>
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

function mapStateToProps({starward, loading}) {
  return {
    loading,
    starward
  };
}

export default connect(mapStateToProps, { })(App);
