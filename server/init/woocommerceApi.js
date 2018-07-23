import axios from 'axios';
import { WP_API } from '../config/app';

/* ----------- Express ----------- */

export default(app) => {
  app.get('/api/getcart', async (req, res) => {
    try {
      const sessionData = req.headers['session-data'];
      const headers = {};
      if (sessionData) headers.Cookie = sessionData;
      const response = await axios.get(`${WP_API}/wc/v2/cart`, { headers });
      return res.json(response.data);
    } catch (error) {
      return res.json(error);
    }
  });
  app.get('/api/addtocart', async (req, res) => {
    try {
      const productId = parseInt(req.query.productId);
      const quantity = parseInt(req.query.quantity);
      const sessionData = req.headers['session-data'];
      const headers = {};
      if (sessionData) headers.Cookie = sessionData;
      const response = await axios.post(`${WP_API}/wc/v2/cart/add`, {
        product_id: productId,
        quantity
      }, { headers });
      if (!sessionData) {
        const cookies = response.headers['set-cookie'];
        const setCookieFunc = (cookie) => {
          const [cookieKeyValue, ...cookieOptionsArr] = cookie.split('; ');
          const cookieKey = cookieKeyValue.split('=')[0];
          const cookieValue = decodeURIComponent(cookieKeyValue.split('=')[1]);
          const cookieOptions = { };
          cookieOptionsArr.forEach(option => (cookieOptions[option.split('=')[0]] = option.split('=')[1]));
          if (cookieOptions.expires) {
            const expires = new Date(cookieOptions.expires);
            cookieOptions.expires = expires;
          }
          if (cookieOptions.expires) {
            const expires = new Date(cookieOptions.expires);
            cookieOptions.expires = expires;
          }
          if (cookieOptions.path) {
            cookieOptions.path = '/';
          }
          res.cookie(cookieKey, cookieValue, cookieOptions);
        };
        cookies.map(cookie => setCookieFunc(cookie));
      }
      return res.json(response.data);
    } catch (error) {
      // Handle error
      return res.json(error);
    }
  });
};
