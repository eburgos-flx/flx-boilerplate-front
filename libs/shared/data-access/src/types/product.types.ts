export interface Product {
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
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsQueryParams {
  limit?: number;
  skip?: number;
  select?: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  brand?: string;
  category?: string;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  brand?: string;
  category?: string;
}
