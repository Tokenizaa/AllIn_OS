export interface Product {
  id: string;
  linkProduto: string;
  imgSrc: string;
  imgSrc2: string;
  caption: string;
  categorias: string;
  caption2: string;
  price: string;
  promotion: string;
  parcelasValor: string;
  produtoTag: string;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
  image?: string;
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}
