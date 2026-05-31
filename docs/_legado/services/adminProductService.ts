/**
 * Serviço para gerenciar produtos na área administrativa
 */
export class AdminProductService {
  /**
   * Salva um produto no localStorage
   * @param productData Dados do produto
   */
  static saveProduct(productData: any): void {
    try {
      const products = this.getProducts();
      products.push(productData);
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  }

  /**
   * Obtém todos os produtos do localStorage
   * @returns Lista de produtos
   */
  static getProducts(): any[] {
    try {
      return JSON.parse(localStorage.getItem('products') || '[]');
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      return [];
    }
  }

  /**
   * Busca um produto pelo ID
   * @param productId ID do produto
   * @returns Produto encontrado ou null
   */
  static getProductById(productId: string): any | null {
    try {
      const products = this.getProducts();
      return products.find((product: any) => product.id === productId) || null;
    } catch (error) {
      console.error('Erro ao obter produto por ID:', error);
      return null;
    }
  }

  /**
   * Atualiza os dados de um produto
   * @param productId ID do produto
   * @param updatedData Dados atualizados
   */
  static updateProduct(productId: string, updatedData: any): void {
    try {
      const products = this.getProducts();
      const index = products.findIndex((product: any) => product.id === productId);
      
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        localStorage.setItem('products', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  }

  /**
   * Remove um produto pelo ID
   * @param productId ID do produto
   */
  static deleteProduct(productId: string): void {
    try {
      const products = this.getProducts();
      const filteredProducts = products.filter((product: any) => product.id !== productId);
      localStorage.setItem('products', JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
  }

  /**
   * Busca produtos por termo de pesquisa
   * @param searchTerm Termo de pesquisa
   * @returns Lista de produtos que correspondem ao termo
   */
  static searchProducts(searchTerm: string): any[] {
    try {
      const products = this.getProducts();
      const searchLower = searchTerm.toLowerCase();
      
      return products.filter((product: any) => 
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  /**
   * Altera o status de um produto (ativo/inativo)
   * @param productId ID do produto
   * @param isActive Novo status
   */
  static changeProductStatus(productId: string, isActive: boolean): void {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex((product: any) => product.id === productId);
      
      if (productIndex !== -1) {
        products[productIndex].is_active = isActive;
        localStorage.setItem('products', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
    }
  }
}