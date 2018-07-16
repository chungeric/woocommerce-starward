import axios from 'axios';
import moment from 'moment';
import { appSettings, gravityForms, wp, woocommerce } from '../../graphQL';
import { serversideStateCharacterBlacklistRegex, WP_URL, REDIS_PREFIX, WP_AUTH, WP_API, COOKIE_DOMAIN } from '../config/app';
import { createRedisClient } from '../redis';
import { submitForm } from './gravitySubmit';

/* ----------- App API Helpers ----------- */
const client = createRedisClient(REDIS_PREFIX);

/* Removes illegal characters from WP API */
/* Checks for WP_URL in response and replaces it with the base url */
/* Reinstates correct wp-content links within response */
const sanitizeJSON = (json) => {
  const stringified = JSON.stringify(json);
  const wpUrlRegex = new RegExp(WP_URL, 'g');
  const wpContentUrlRegex = new RegExp('/wp-content', 'g');
  const cleaned = stringified
  .replace(serversideStateCharacterBlacklistRegex, '')
  .replace(wpUrlRegex, '')
  .replace(wpContentUrlRegex, `${WP_URL}/wp-content`);
  return JSON.parse(cleaned);
};
/* Handle success and sanitize JSON response */
const handleSuccess = (res) => {
  return (data) => res.json(sanitizeJSON(data));
};
/* Handle error */
const handleError = (res) => {
  return (error) => res.json(error);
};

/* ----------- Express ----------- */

export default(app) => {
  /* ----------- App API Routes ----------- */
  /* Get Site Name and Description */
  /* Does not require a query param */
  app.get('/api/settings', (req, res) => {
    appSettings(`
      query{
        settings{
          name,
          emailAddress,
          phoneNumber,
          faxNumber,
          officeAddress,
          socialLinks,
          trackingType,
          trackingId,
          googleMapsApiKey,
          additionalScripts
        }
      }
    `)
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* Get Menu */
  /* Expects query param ?name= (?name=Header) */
  app.get('/api/menu', (req, res) => {
    appSettings(`
      query get_menu($name: String) {
        menu(name: $name) {
          title,
          url,
          order,
          classes,
          children{
            title,
            url,
            order,
            classes
          }
        }
      }`, {name: req.query.name})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* ----------- Wordpress API Routes ----------- */
  /* Get Page */
  /* Expects query param ?slug= */
  app.get('/api/page', (req, res) => {
    wp(`
      query get_page($slug: String, $preview: Int) {
        active_page: page(slug: $slug, preview: $preview) {
          title,
          content,
          slug,
          link,
          featuredImage{
            alt,
            url,
            sizes
          },
          acf,
          seo: yoast
        }
      }`, {slug: req.query.slug, preview: req.query.preview})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* Get Collection of Posts */
  /* Expects query param ?page= */
  app.get('/api/posts', (req, res) => {
    wp(`
      query get_posts($page: Int, $perPage: Int) {
        posts(page: $page, perPage: $perPage) {
          items{
            slug,
            title,
            content,
            featuredImage{
              alt,
              url,
              sizes
            },
            acf,
            categories{
              name,
              slug
            },
            author{
              name,
              avatar
            }
          }
          categories{
            slug,
            name,
            parent,
            count
          }
          totalItems,
          totalPages
        }
      }`, {page: req.query.page, perPage: req.query.perPage})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* Get Individual Post */
  /* Expects query param ?slug= */
  app.get('/api/post', (req, res) => {
    wp(`
      query get_post($slug: String, $preview: Int) {
        activePost: post(slug: $slug, preview: $preview){
          slug,
          title,
          content,
          date,
          acf,
          link,
          pagination{
            next{
              slug,
              title,
              date,
              featuredImage{
                alt,
                url,
                sizes
              }
            },
            previous{
              slug,
              title,
              date,
              featuredImage{
                alt,
                url,
                sizes
              }
            },
          },
          featuredImage{
            alt,
            url,
            sizes
          },
          categories{
            name,
            slug
          },
          author{
            name,
            slug,
            avatar
          }
        }
      }`, {slug: req.query.slug, preview: req.query.preview})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* Get Category and Collection of Posts */
  /* Expects query param ?slug= && ?page= */
  app.get('/api/category', (req, res) => {
    wp(`
      query get_category($slug: String, $page: Int) {
        category(slug: $slug) {
          details{
            slug,
            name,
            description,
            id
          }
          posts(page: $page){
            items{
              slug,
              title,
              content,
              featuredImage{
                alt,
                url,
                sizes
              },
              acf,
              categories{
                name,
                slug
              },
              author{
                name,
                avatar
              }
            },
            totalItems,
            totalPages
          }
        }
      }`, {slug: req.query.slug, page: req.query.page})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* Get Author and Collection of Posts */
  /* Expects query param ?name && ?page= */
  app.get('/api/author', (req, res) => {
    wp(`
      query get_author($name: String, $page: Int) {
        author(name: $name) {
          details{
            slug,
            name,
            id
          }
          posts(page: $page){
            items{
              slug,
              title,
              content,
              featuredImage{
                alt,
                url,
                sizes
              },
              acf,
              categories{
                name,
                slug
              },
              author{
                name,
                avatar
              }
            },
            totalItems,
            totalPages
          }
        }
      }`, {name: req.query.name, page: req.query.page})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* Perform search and return results */
  /* Expects query param ?term= (OPTIONAL = ?type= && ?page= && ?perPage=) */
  app.get('/api/search', (req, res) => {
    wp(`
      query search($term: String, $type: String, $page: Int, $perPage: Int) {
        search(term: $term, type: $type, page: $page, perPage: $perPage) {
          items{
            slug,
            title,
            content,
            featuredImage{
              alt,
              url,
              sizes
            },
            acf,
            categories{
              name,
              slug
            },
            author{
              name,
              avatar
            }
          },
          totalItems,
          totalPages
        }
      }`, {term: req.query.term, type: req.query.type, page: req.query.page, perPage: req.query.perPage})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });
  /* ----------- WooCommerce Endpoints ----------- */
  /* Get Product Category and Collection of Products */
  app.get('/api/products/category', (req, res) => {
    woocommerce(`
      query get_product_category($slug: String, $page: Int, $queryString: String) {
        category: productcategory(slug: $slug, page: $page, queryString: $queryString) {
          details {
            slug,
            name,
            description,
            id,
            parent
          },
          products {
            items {
              slug,
              name,
              description,
              id,
              regular_price,
              sale_price,
              price_html,
              images {
                src,
                alt,
                position
              },
              attributes {
                id,
                name,
                slug,
                options
              }
            },
            totalProducts,
            totalPages
          },
          filters
        }
      }`, {
        slug: req.query.slug,
        page: req.query.page,
        queryString: req.query.queryString
      })
      .then(handleSuccess(res))
      .catch(handleError(res));
  });

  /* Get WooCommerce Attributes Specific to a Product Category */
  app.get('/api/categoryfilters', async (req, res) => {
    const WC_API_ROOT = `${WP_API}/wc/v2`;
    const wcProductsUrl = `${WC_API_ROOT}/products`;
    const auth = { Authorization: `Basic ${WP_AUTH}` };
    const toArray = (obj) => Object.keys(obj).map(key => obj[key]);
    try {
      const { categoryId } = req.query;

      // Get all product data for current category
      const productsResponse = await axios.get(`${wcProductsUrl}?category=${categoryId}`, { headers: auth });
      // Get an array of attributes from each product
      const attributesArray = productsResponse.data.map((product) => {
        return product.attributes;
      });
      // Get an array of subcategories
      const subCategoriesArray = await axios.get(`${wcProductsUrl}/categories?parent=${categoryId}`, { headers: auth });
      // Get array of product prices
      const pricesArray = productsResponse.data.map((product) => {
        return product.price;
      });
      // Get max and min price for the category to use in price range slider
      const maxPrice = Math.max(...pricesArray);
      const minPrice = Math.min(...pricesArray);

      // Merge product attribute arrays into 1 array
      const attributesArrayMerged = [].concat.apply([], attributesArray);

      console.log('setting up category filters object');

      const priceObj = {
        min_price: minPrice,
        max_price: maxPrice
      };

      const subCategoriesObj = subCategoriesArray.data.map((subcategory) => {
        return ({
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug
        });
      });

      const attributesObj = {};
      // Add only unique attributes to attributesObject
      attributesArrayMerged.forEach((attribute) => {
        if (!(attribute in attributesObj)) {
          attributesObj[attribute.name] = {
            id: attribute.id,
            name: attribute.name,
            slug: null,
            options: []
          };
        }
      });

      // Push available options into attributesObj
      attributesArrayMerged.forEach(attribute => {
        // Push unique options into attributes object
        attribute.options.forEach((option) => {
          if (attributesObj[attribute.name].options.indexOf(option) === -1) {
            attributesObj[attribute.name].options.push(option);
          }
        });
      });

      // Get each unique attribute's slug and available option details
      await Promise.all(toArray(attributesObj).map(async (attribute) => {
        // Make requests to get attribute slugs
        const attributeData = await axios.get(`${wcProductsUrl}/attributes/${attribute.id}`, { headers: auth });
        attributesObj[attribute.name].slug = attributeData.data.slug;
        // Make request to get attibute options with ids
        const optionData = await axios.get(`${wcProductsUrl}/attributes/${attribute.id}/terms`, { headers: auth });
        const optionDetails = optionData.data;
        // Get existing array containing option names only
        const optionNames = attributesObj[attribute.name].options;
        // Map over option names and find obj withing optionData response
        const options = optionNames.map(optionName => {
          const option = optionDetails.find(item => item.name === optionName);
          const { id, name, slug } = option;
          return ({
            id,
            name,
            slug
          });
        });
        // Replace basic option info with detailed response from API
        attributesObj[attribute.name].options = options;
      }));

      /* Set up filtersObject response */
      const filtersObject = {};

      /* Populate filtersObject response */
      const isEmpty = (container) => {
        return Object.getOwnPropertyNames(container).length === 0 || container.length === 0;
      };

      if (!isEmpty(priceObj)) {
        filtersObject.price = priceObj;
      }
      if (!isEmpty(attributesObj)) {
        filtersObject.attributes = attributesObj;
      }
      if (!isEmpty(subCategoriesObj)) {
        filtersObject.subcategories = subCategoriesObj;
      }

      // Respond with category filters object
      return res.json(sanitizeJSON(filtersObject));
    } catch (error) {
      // Handle error
      return res.json(error);
    }
  });

  /* ----------- Gravity Forms Endpoints ----------- */
  /* Get Gravity Form */
  /* Expects query param ?id= */
  app.get('/api/gravityforms', (req, res) => {
    gravityForms(`
      query get_form($id: Int) {
        form(id: $id) {
          title,
          description,
          button,
          confirmation,
          fields{
            type,
            id,
            label,
            placeholder,
            classes: cssClass,
            required: isRequired,
            prePopulated,
            prePopulatedParam,
            choices
          }
        }
      }`, {id: req.query.id})
      .then(handleSuccess(res))
      .catch(handleError(res));
  });

  app.post('/api/gravityforms', (req, res) => {
    return submitForm(req, res);
  });

  /* ----------- Redis Endpoints ----------- */
  /* Flush Redis */
  app.get('/api/flushredis', (req, res) => {
    console.log(`${moment().format()} flushing Redis cache`);
    client.flushdb(err => {
      if (err) return res.json({error: err});
      return res.json({success: true});
    });
  });

  app.get('/api/getcart', async (req, res) => {
    try {
      const response = await axios.get(`${WP_API}/wc/v2/cart`, {
        headers: {
          Cookie: 'woocommerce_cart_hash=49c977c4c9c4fabc0330757a5062f7ff; woocommerce_items_in_cart=1; wp_woocommerce_session_be9883144b2596a8fb509aa96ae7c3d0=44ea087e384ef0c4cc8d92adca84b982%7C%7C1531881628%7C%7C1531878028%7C%7Cdb7e21edb8128b2990c7d367a2146101;'
        }
      });
      const reqCookies = req.headers['set-cookie'];
      const resCookies = response.headers['set-cookie'];
      console.log('Request Cookies @ /api/addtocart', reqCookies);
      console.log('Response Cookies @ /api/addtocart', resCookies);
      return res.json(response.data);
    } catch (error) {
      return res.json(error);
    }
  });
  app.get('/api/addtocart', async (req, res) => {
    try {
      const response = await axios.post(`${WP_API}/wc/v2/cart/add`, {
        // Test Data
        product_id: 52,
        quantity: 1
      }, { withCredentials: true });
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
        res.cookie(cookieKey, cookieValue, cookieOptions);
        console.log({cookieKey});
        console.log({cookieValue});
        console.log({cookieOptions});
      };
      cookies.map(cookie => setCookieFunc(cookie));
      return res.json(response.data);
    } catch (error) {
      // Handle error
      return res.json(error);
    }
  });
};
