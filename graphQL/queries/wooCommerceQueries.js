import axios from 'axios';
import { WP_API, WP_AUTH } from '../../server/config/app';

const auth = { Authorization: `Basic ${WP_AUTH}` };

/* ----------- WooCommerce REST API v1 endpoints ----------- */
const WC_API_ROOT = `${WP_API}/wc/v1`;
const wcProductsUrl = `${WC_API_ROOT}/products`;
const wcCategoriesUrl = `${WC_API_ROOT}/products/categories`;

const wooCommerceQueries = {
  Category: {
    details(response) {
      return response ? response[0] : null;
    },
    products(response) {
      if (!response || !response[0]) return [];
      return axios.get(`${wcProductsUrl}?category=${response[0].id}`, { headers: auth })
      .then(productsRes => {
        return ({
          items: productsRes.data,
          totalProducts: productsRes.headers['x-wp-total'],
          totalPages: productsRes.headers['x-wp-totalpages'],
        });
      })
      .catch(error => console.log('error', error));
    }
  },
  Query: {
    productcategory(query, args) {
      const wcCategoryURL = `${wcCategoriesUrl}?slug=${args.slug}`;
      return axios.get(wcCategoryURL, { headers: auth })
      .then(categoryRes => {
        return categoryRes.data;
      })
      .catch(error => console.log('error', error));
    }
  }
};

export default wooCommerceQueries;
