import { wooCommerceService } from './services';

const {
  getCategory
} = wooCommerceService;

const fetchWooCommerceData = (params, routeName) => {
  // Switch statement on routeName from routes.jsx
  switch (routeName) {
    // Product Category Data
    case 'ProductCategory': {
      return getCategory(params.category)
      .then(res => {
        return res.data.data;
      });
    }
    default:
      return ({handleNotFound: '404'});
  }
};

export default fetchWooCommerceData;
