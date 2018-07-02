import axios from 'axios';
import { ROOT_API } from '../../config/app';

const categoryApi = (slug, page) => axios.get(`${ROOT_API}/products/category?slug=${slug}&page=${page}`);

// wooCommerceService object containing above API requests which gets imported in fetchWooCommerceData

const wooCommerceService = {
  getCategory: (slug, page) => categoryApi(slug, page),
};

export default wooCommerceService;
