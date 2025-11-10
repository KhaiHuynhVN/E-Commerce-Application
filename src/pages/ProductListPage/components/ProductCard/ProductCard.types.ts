// Import Product type từ services để đảm bảo consistency
import type { Product } from "@/services";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export type { Product, ProductCardProps };
