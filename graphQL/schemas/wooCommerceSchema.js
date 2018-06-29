const wooCommerceSchema = `
  type Category {
    # Products list
    details: Taxonomy,
    products: Products
  }
  type Taxonomy {
    # Individual Taxonomy
    id: Int
    name: String,
    slug: String,
    description: String,
    image: CategoryImage,
    parent: Int,
    count: Int
  }
  type Products {
    items: [Product],
    totalProducts: Int
    totalPages: Int
  }
  type Product {
    # Product
    id: Int
    name: String,
    slug: String,
    description: String,
    images: [ProductImage],
    price: Float,
    regular_price: Float,
    sale_price: Float,
    price_html: String,
    attributes: [Attribute],
    parent: Int,
    count: Int
  }
  type CategoryImage {
    # Category image
    src: String,
    alt: String
  }
  type ProductImage {
    # Product image
    src: String,
    alt: String,
    position: Int
  }
  type Attribute {
    # Product Attribute
    id: Int,
    name: String,
    position: Int,
    visible: Boolean,
    options: [String]
  }
  type Query {
    productcategory (slug: String): Category
  }
`;

export default wooCommerceSchema;
