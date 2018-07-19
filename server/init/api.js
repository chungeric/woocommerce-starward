import axios from 'axios';
import moment from 'moment';
import { appSettings, gravityForms, wp, woocommerce } from '../../graphQL';
import { serversideStateCharacterBlacklistRegex, WP_URL, REDIS_PREFIX, WP_AUTH, WP_API } from '../config/app';
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
                options {
                  id,
                  name,
                  slug,
                  taxonomy,
                  description,
                  count
                },
                swatches
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
    const auth = { Authorization: `Basic ${WP_AUTH}` };
    try {
      const { categoryId } = req.query;
      // Make request to custom endpoint in Starward WooCommerce Plugin
      const filtersObject = await axios.get(`${WP_API}/starward/products/filters/category/${categoryId}`, { headers: auth });
      // Respond with category filters object
      return res.json(sanitizeJSON(filtersObject.data));
    } catch (error) {
      // Handle error
      return res.json(error);
    }
  });

  /* Get a specific product */
  app.get('/api/product', (req, res) => {
    woocommerce(`
      query get_product($slug: String) {
        product(slug: $slug) {
          sku,
          id,
          name,
          slug,
          description,
          short_description,
          images {
            src,
            alt,
            position
          },
          price,
          regular_price,
          sale_price,
          price_html,
          attributes {
            id,
            name,
            slug,
            taxonomy,
            position,
            visible,
            options {
              id,
              name,
              slug,
              taxonomy,
              description,
              count
            }
            swatches
          },
          in_stock,
          stock_quantity,
          type,
          featured,
          catalog_visibility,
          relatedProducts {
            images {
              src,
              alt,
              position
            },
            id,
            name,
            regular_price,
            sale_price,
            price,
            slug
          },
          variations
        }
      }`, { slug: req.query.slug })
      .then(handleSuccess(res))
      .catch(handleError(res));
  });

  /* Get related products */
  app.get('/api/relatedproducts', async (req, res) => {
    const WC_API_ROOT = `${WP_API}/wc/v2`;
    const wcProductsUrl = `${WC_API_ROOT}/products`;
    const auth = { Authorization: `Basic ${WP_AUTH}` };
    const relatedIds = req.query.relatedIds ? req.query.relatedIds.split(',') : null;
    try {
      const relatedProductsArray = await Promise.all(relatedIds.map(async (id) => {
        return await axios.get(`${wcProductsUrl}/${id}`, { headers: auth });
      }))
      .then(relatedProductsResponse => {
        return relatedProductsResponse.map(relatedProduct => {
          const {
            images,
            id,
            name,
            regular_price,
            sale_price,
            slug
          } = relatedProduct.data;
          return {
            images,
            id,
            name,
            regular_price,
            sale_price,
            slug
          };
        });
      });
      return res.json(sanitizeJSON(relatedProductsArray));
    } catch (error) {
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
};
