import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useDistributor } from "@/lib/distributor-context";
import { useProducts } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/app/public-header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/shared/ProductCard";
import { Search, Filter } from "lucide-react";

export const Route = createFileRoute("/busca-produtos/$slug")({
  component: ProductSearchPage,
});

function ProductSearchPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  
  const routeSlug = params.slug?.toLowerCase().trim();
  
  useState(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  });

  const sponsorSlug = currentDistributor.slug;
  const { products, loading } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Calçados", "Palmilhas", "Acessórios"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.caption2?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categorias === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <PublicHeader />
      <div className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
                Buscar <span className="text-allin-orange">Produtos</span>
              </h1>
              <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto">
                Encontre o produto ideal para suas necessidades
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-allin-dark/50 dark:text-allin-white/50 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-allin-orange/30 bg-white dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white focus:outline-none focus:ring-2 focus:ring-allin-orange"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Filter className="text-allin-orange h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-allin-orange/30 bg-white dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white focus:outline-none focus:ring-2 focus:ring-allin-orange"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Todas as Categorias" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-allin-orange border-r-transparent"></div>
                <p className="mt-4 text-allin-dark/80 dark:text-allin-white/80">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-allin-dark/80 dark:text-allin-white/80">
                  Nenhum produto encontrado para "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.imgSrc}
                    title={product.caption}
                    description={product.caption2}
                    price={product.price}
                    tag={product.produtoTag}
                    onDetailsClick={() => console.log("Details clicked", product.id)}
                    onAddToCart={() => console.log("Add to cart", product.id)}
                  />
                ))}
              </div>
            )}

            <div className="mt-16 text-center">
              <Link to={`/loja/${sponsorSlug}`}>
                <Button variant="vibrantOutline" size="lg" className="text-lg px-8 py-6">
                  Voltar para a Loja
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
