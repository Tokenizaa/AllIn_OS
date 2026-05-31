import React, { useState, useMemo } from 'react';

import {
  Package, DollarSign, TrendingUp, Eye, Search,
  Edit2, Save, X, ExternalLink, Tag, Filter, ArrowUpDown,
  Home, Shield, LogOut, Menu, ShoppingBag, LayoutDashboard
} from 'lucide-react';

import { Navigate, Link, useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import { useProducts } from '@/contexts/ProductsContext';
import { formatPrice } from '@/utils/priceFormatter';
import { useAuth } from '@/hooks/useAuth';

interface EditableProduct {
  id: string;
  caption: string;
  categorias: string;
  price: string;
  produtoTag: string;
  imgFluidSrc: string;
  linkProdutoHref: string;
}

const LojistaDashboard: React.FC = () => {
  const { user, profile, signOut, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { products, categories, loading: productsLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EditableProduct>>({});
  const [localProducts, setLocalProducts] = useState<typeof products | null>(null);
  const [sortField, setSortField] = useState<'caption' | 'price' | 'categorias'>('caption');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const displayProducts = localProducts ?? products;

  // Stats
  const stats = useMemo(() => {
    const priceValues = displayProducts.map(p => {
      const num = parseFloat(p.price.replace(/[^\d,]/g, '').replace(',', '.'));
      return isNaN(num) ? 0 : num;
    });
    const totalValue = priceValues.reduce((a, b) => a + b, 0);
    const avgPrice = priceValues.length ? totalValue / priceValues.length : 0;
    const withTag = displayProducts.filter(p => p.produtoTag && p.produtoTag.trim() !== '').length;

    return {
      total: displayProducts.length,
      categories: categories.length,
      avgPrice: avgPrice.toFixed(2).replace('.', ','),
      totalValue: totalValue.toFixed(2).replace('.', ','),
      withTag
    };
  }, [displayProducts, categories]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = displayProducts.filter(p => {
      const matchSearch = !search || 
        p.caption.toLowerCase().includes(search.toLowerCase()) ||
        p.categorias.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.categorias === categoryFilter;
      return matchSearch && matchCat;
    });

    result.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';
      if (sortField === 'price') {
        valA = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        valB = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        return sortDir === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
      valA = a[sortField].toLowerCase();
      valB = b[sortField].toLowerCase();
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return result;
  }, [displayProducts, search, categoryFilter, sortField, sortDir]);

  const startEdit = (product: typeof products[0]) => {
    setEditingId(product.linkProdutoHref);
    setEditData({
      caption: product.caption,
      price: product.price,
      produtoTag: product.produtoTag,
      categorias: product.categorias,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = (product: typeof products[0]) => {
    const updated = (localProducts ?? products).map(p =>
      p.linkProdutoHref === product.linkProdutoHref
        ? { ...p, ...editData }
        : p
    );
    setLocalProducts(updated);
    setEditingId(null);
    setEditData({});
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const hasAdminAccess = !!user && (isAdmin || isSuperAdmin);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-allin-bg-dark-1 overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-allin-bg-dark-2 border-r border-gray-200 dark:border-allin-bg-dark-3 shadow-md flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo & Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-allin-bg-dark-3 bg-white dark:bg-allin-bg-dark-2">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-allin-orange" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">Painel Lojista</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <Link
              to="/lojista"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-allin-orange text-white"
            >
              <LayoutDashboard className="w-5 h-5 mr-3 flex-shrink-0" />
              Catálogo
            </Link>

            <Link
              to="/loja"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-allin-bg-dark-3 transition-colors"
            >
              <ExternalLink className="w-5 h-5 mr-3 flex-shrink-0" />
              Minha Loja
            </Link>

            <Link
              to="/"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-allin-bg-dark-3 transition-colors"
            >
              <Home className="w-5 h-5 mr-3 flex-shrink-0" />
              Página Principal (Site)
            </Link>

            {hasAdminAccess && (
              <Link
                to="/admin/dashboard"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-allin-bg-dark-3 transition-colors"
              >
                <Shield className="w-5 h-5 mr-3 flex-shrink-0 text-allin-orange" />
                Painel Admin
              </Link>
            )}
          </nav>

          {/* Profile & Logout Card */}
          <div className="p-4 border-t border-gray-200 dark:border-allin-bg-dark-3 bg-white dark:bg-allin-bg-dark-2">
            <div className="flex items-center mb-4">
              <div className="w-9 h-9 rounded-full bg-allin-orange flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'L'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {profile?.full_name || 'Lojista'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center border-gray-200 dark:border-allin-bg-dark-3 dark:hover:bg-allin-bg-dark-3 dark:text-white hover:text-destructive hover:border-destructive transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile Overlay (Backdrop) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Mobile Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-allin-bg-dark-2 border-r border-gray-200 dark:border-allin-bg-dark-3 shadow-2xl transition-transform duration-300 md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-allin-bg-dark-3 bg-white dark:bg-allin-bg-dark-2">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-allin-orange" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">Painel Lojista</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <Link
              to="/lojista"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-allin-orange text-white"
            >
              <LayoutDashboard className="w-5 h-5 mr-3 flex-shrink-0" />
              Catálogo
            </Link>

            <Link
              to="/loja"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-allin-bg-dark-3 transition-colors"
            >
              <ExternalLink className="w-5 h-5 mr-3 flex-shrink-0" />
              Minha Loja
            </Link>

            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-allin-bg-dark-3 transition-colors"
            >
              <Home className="w-5 h-5 mr-3 flex-shrink-0" />
              Página Principal (Site)
            </Link>

            {hasAdminAccess && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-allin-bg-dark-3 transition-colors"
              >
                <Shield className="w-5 h-5 mr-3 flex-shrink-0 text-allin-orange" />
                Painel Admin
              </Link>
            )}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-allin-bg-dark-3 bg-white dark:bg-allin-bg-dark-2">
            <div className="flex items-center mb-4">
              <div className="w-9 h-9 rounded-full bg-allin-orange flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'L'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {profile?.full_name || 'Lojista'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center border-gray-200 dark:border-allin-bg-dark-3 dark:hover:bg-allin-bg-dark-3 dark:text-white hover:text-destructive hover:border-destructive transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-allin-bg-dark-1">
        {/* Mobile Top Header */}
        <header className="flex md:hidden items-center justify-between h-16 px-4 bg-white dark:bg-allin-bg-dark-2 border-b border-gray-200 dark:border-allin-bg-dark-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="px-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-200" />
            </Button>
            <span className="text-lg font-bold text-gray-800 dark:text-white">Painel Lojista</span>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-allin-orange flex items-center justify-center text-white font-bold text-sm shadow-md">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'L'}
          </div>
        </header>

        {/* Dashboard Main Content Scroll Area */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel do Lojista</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus produtos e acompanhe métricas</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Produtos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.categories}</p>
                  <p className="text-xs text-muted-foreground">Categorias</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">R$ {stats.avgPrice}</p>
                  <p className="text-xs text-muted-foreground">Preço Médio</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.withTag}</p>
                  <p className="text-xs text-muted-foreground">Com Tag</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Produtos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Badge
                    key={cat.id}
                    variant={categoryFilter === cat.name ? 'default' : 'outline'}
                    className="cursor-pointer text-sm px-3 py-1"
                    onClick={() => setCategoryFilter(categoryFilter === cat.name ? 'all' : cat.name)}
                  >
                    {cat.name} ({cat.productCount})
                  </Badge>
                ))}
                {categoryFilter !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer text-sm px-3 py-1"
                    onClick={() => setCategoryFilter('all')}
                  >
                    ✕ Limpar filtro
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <CardTitle className="text-lg">
                  Catálogo de Produtos ({filtered.length})
                </CardTitle>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produto..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-9 w-64 bg-background text-foreground"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Foto</TableHead>
                      <TableHead>
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('caption')}>
                          Nome <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('categorias')}>
                          Categoria <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('price')}>
                          Preço <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead className="w-24 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map(product => {
                        const isEditing = editingId === product.linkProdutoHref;
                        return (
                          <TableRow key={product.linkProdutoHref} className="group">
                            <TableCell>
                              <img
                                src={product.imgFluidSrc}
                                alt={product.caption}
                                className="w-12 h-12 object-cover rounded-md"
                                onError={e => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=?';
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={editData.caption ?? ''}
                                  onChange={e => setEditData({ ...editData, caption: e.target.value })}
                                  className="h-8 bg-background text-foreground"
                                />
                              ) : (
                                <span className="font-medium text-foreground">{product.caption}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select
                                  value={editData.categorias ?? product.categorias}
                                  onValueChange={v => setEditData({ ...editData, categorias: v })}
                                >
                                  <SelectTrigger className="h-8 w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map(c => (
                                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge variant="outline">{product.categorias}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={editData.price ?? ''}
                                  onChange={e => setEditData({ ...editData, price: e.target.value })}
                                  className="h-8 w-28 bg-background text-foreground"
                                />
                              ) : (
                                <span className="font-semibold text-primary">
                                  {formatPrice(product.price) || product.price}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={editData.produtoTag ?? ''}
                                  onChange={e => setEditData({ ...editData, produtoTag: e.target.value })}
                                  className="h-8 w-24 bg-background text-foreground"
                                  placeholder="Tag..."
                                />
                              ) : (
                                product.produtoTag ? (
                                  <Badge className="bg-primary/90 text-primary-foreground">{product.produtoTag}</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )
                              )}
                            </TableCell>
                            <TableCell>
                              <a
                                href={product.linkProdutoHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              {isEditing ? (
                                <div className="flex gap-1 justify-end">
                                  <Button size="sm" variant="ghost" onClick={() => saveEdit(product)}>
                                    <Save className="h-4 w-4 text-primary" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => startEdit(product)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default LojistaDashboard;
