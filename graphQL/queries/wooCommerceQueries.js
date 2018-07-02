import axios from 'axios';
import { WP_API, WP_AUTH } from '../../server/config/app';
import { PRODUCTS_PER_PAGE } from '../../app/config/app';

const auth = { Authorization: `Basic ${WP_AUTH}` };

/* ----------- WooCommerce REST API v1 endpoints ----------- */
const WC_API_ROOT = `${WP_API}/wc/v1`;
const wcProductsUrl = `${WC_API_ROOT}/products`;
const wcCategoriesUrl = `${WC_API_ROOT}/products/categories`;

const wooCommerceQueries = {
  Category: {
    details(response) {
      return response && response.data ? response.data[0] : null;
    },
    products(response) {
      if (!response || !response.data || !response.data[0]) return [];
      const categoryId = response.data[0].id;
      console.log(categoryId);
      return axios.get(`${wcProductsUrl}?category=${categoryId}&page=${response.page}&per_page=${PRODUCTS_PER_PAGE}`, { headers: auth })
      .then(productsResponse => {
        return ({
          items: productsResponse.data,
          totalProducts: productsResponse.headers['x-wp-total'],
          totalPages: productsResponse.headers['x-wp-totalpages'],
        });
      })
      .catch(error => console.log('error', error));
    },
    attributes(response) {
      if (!response || !response.data || !response.data[0]) return [];

      // Get current category id
      const categoryId = response.data[0].id;

      // Get products for current category
      return axios.get(`${wcProductsUrl}?category=${categoryId}`, { headers: auth })
      .then(productsResponse => {
        // Get an array of attribute ids from each product
        const attributesArr = productsResponse.data.map((product) => {
          return product.attributes.map((attr) => attr.id);
        });
        // Merge product attribute arrays into 1 array
        const attributeIds = [].concat.apply([], attributesArr);
        // Filter to get unique attribute ids only
        const uniqueAttributeIds = attributeIds.filter((value, index, self) => self.indexOf(value) === index);
        return uniqueAttributeIds;

        // // Request all product attributes (all categories)
        // return axios.get(`${wcProductsUrl}/attributes`, { headers: auth })
        // .then(attributesResponse => {
        //   // Return attribute ids that are
        //   return attributesResponse.data.filter((attribute) => {
        //     return uniqueAttributeIds.includes(attribute.id);
        //   })
        //   .map((attribute) => attribute.id);
        // })
        // .catch(error => console.log('error', error));
      })
      .catch(error => console.log('error', error));
    }
  },
  Query: {
    productcategory(query, args) {
      const wcCategoryURL = `${wcCategoriesUrl}?slug=${args.slug}`;
      return axios.get(wcCategoryURL, { headers: auth })
      .then(categoryRes => {
        return ({
          data: categoryRes.data,
          page: args.page || 1
        });
      })
      .catch(error => console.log('error', error));
    }
  }
};

export default wooCommerceQueries;
