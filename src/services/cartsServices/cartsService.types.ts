// Cart Product Item trong DummyJSON
interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
  thumbnail: string;
}

// Cart từ DummyJSON API
interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

// Response khi get user carts
interface UserCartsResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

// Request body khi add/update cart
interface AddToCartRequest {
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

interface UpdateCartRequest {
  merge?: boolean; // true = merge với cart hiện tại, false = replace
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export type {
  CartProduct,
  Cart,
  UserCartsResponse,
  AddToCartRequest,
  UpdateCartRequest,
};
