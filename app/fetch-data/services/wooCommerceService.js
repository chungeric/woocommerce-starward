import axios from 'axios';
import { ROOT_API } from '../../config/app';

const categoryApi = (slug) => axios.get(`${ROOT_API}/products/category?slug=${slug}`);

// wooCommerceService object containing above API requests which gets imported in fetchWooCommerceData

const wooCommerceService = {
  getCategory: (slug) => categoryApi(slug),
};

export default wooCommerceService;
