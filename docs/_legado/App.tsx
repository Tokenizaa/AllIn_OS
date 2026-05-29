import { Suspense, lazy } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from '@/components/ScrollToTop';
import { ThemeProvider } from '@/components/ThemeProvider';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { CartProvider } from '@/contexts/CartContext';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { StoreSettingsProvider } from '@/contexts/StoreSettingsContext';

// Lazy load layouts
const AppLayout = lazy(() => import('./layouts/AppLayout'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DiseaseSection = lazy(() => import('./pages/DiseaseSection'));
const Login = lazy(() => import('./pages/Login'));
const Auth = lazy(() => import('./pages/Auth'));
const DistribuidoresPage = lazy(() => import('./pages/DistribuidoresPage'));
const ProductSearchPage = lazy(() => import('./pages/ProductSearchPage'));
const CadastroLojaPage = lazy(() => import('./pages/public/CadastroLojaPage'));
const CadastroConcluidoPage = lazy(() => import('./pages/public/CadastroConcluidoPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LojaPage = lazy(() => import('./pages/LojaPage'));
const Profile = lazy(() => import('./pages/Profile'));

// Lazy load admin pages
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'));
const ConversationsPage = lazy(() => import('./pages/admin/ConversationsPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const AdminRequestsPage = lazy(() => import('./pages/admin/AdminRequestsPage'));
const StoreManagementPage = lazy(() => import('./pages/admin/StoreManagementPage'));
const ApiKeysPage = lazy(() => import('./pages/admin/ApiKeysPage'));
const EvolutionPage = lazy(() => import('./pages/admin/EvolutionPage'));
const LojistaDashboard = lazy(() => import('./pages/lojista/LojistaDashboard'));
const TestMaxxApi = lazy(() => import('./pages/TestMaxxApi'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner className="w-12 h-12" />
  </div>
);

function App() {
  return (
    <StoreSettingsProvider>
      <CartProvider>
        <ProductsProvider>
          <ThemeProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Rotas Públicas e da Loja com o Header condicional */}
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="distribuidores" element={<DistribuidoresPage />} />
                    <Route path="doencas" element={<DiseaseSection />} />
                    <Route path="busca-produtos" element={<ProductSearchPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="cadastro" element={<Auth />} />
                    <Route path="admin/cadastro-loja" element={<CadastroLojaPage />} />
                    <Route path="cadastro-concluido" element={<CadastroConcluidoPage />} />
                    <Route path="loja" element={<LojaPage />} />
                    {/* Nova rota para lojas personalizadas com slug */}
                    <Route path="loja/:storeSlug" element={<LojaPage />} />
                    <Route path="lojista" element={<LojistaDashboard />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>

                  {/* Rotas de Admin */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="messages" element={<ConversationsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="requests" element={<AdminRequestsPage />} />
                    <Route path="stores" element={<StoreManagementPage />} />
                    <Route path="api-keys" element={<ApiKeysPage />} />
                    <Route path="evolution" element={<EvolutionPage />} />
                    <Route path="test-maxx" element={<TestMaxxApi />} />
                  </Route>

                  {/* Rotas sem o Header principal */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </ProductsProvider>
      </CartProvider>
    </StoreSettingsProvider>
  );
}

export default App;
