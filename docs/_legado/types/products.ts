// Tipos centralizados para produtos e categorias
export type Product = {
  linkProdutoHref: string;
  imgFluidSrc: string;
  imgFluidSrc2: string;
  caption: string;
  categorias: string;
  caption2: string;
  price: string;
  parcelasValor: string;
  produtoTag: string;
};

export type Category = {
  id: number;
  name: string;
  productCount: number;
};

export type ProductsState = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
};
