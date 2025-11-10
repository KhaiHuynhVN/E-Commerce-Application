// Product từ DummyJSON API
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Response khi get products với pagination
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Params cho get products
interface GetProductsParams {
  limit?: number;
  skip?: number;
}

// Params cho search products
interface SearchProductsParams {
  q: string; // Query string
  limit?: number;
  skip?: number;
}

export type {
  Product,
  ProductsResponse,
  GetProductsParams,
  SearchProductsParams,
};

