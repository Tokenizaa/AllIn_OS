import { useState } from 'react';
import { useMockAuth } from '@/hooks/useMockAuth';
import './MockLogin.css';

export default function MockLogin() {
  const [email, setEmail] = useState('admin@allin.com');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login, register, logout, user, isAuthenticated, loading, error } = useMockAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
      const response = await register(email, password, fullName);
      if (response.success) {
        console.log('Cadastro realizado com sucesso!');
      }
    } else {
      const response = await login(email, password);
      if (response.success) {
        console.log('Login realizado com sucesso!');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isAuthenticated && user) {
    return (
      <div className="mock-login-container">
        <div className="mock-login-card">
          <div className="mock-login-header">
            <h1>🎉 Login Realizado!</h1>
            <p className="subtitle">Autenticação Mockada (Desenvolvimento)</p>
          </div>
          
          <div className="user-info">
            <div className="info-row">
              <span className="label">Nome:</span>
              <span className="value">{user.fullName}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">ID:</span>
              <span className="value">{user.id}</span>
            </div>
            <div className="info-row">
              <span className="label">Role:</span>
              <span className="value role-badge">{user.role}</span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`value status-badge ${user.status}`}>{user.status}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>

          <div className="dev-notice">
            <p>⚠️ Este é um sistema de autenticação mockado para desenvolvimento.</p>
            <p>Não usar em produção!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mock-login-container">
      <div className="mock-login-card">
        <div className="mock-login-header">
          <h1>{isRegister ? '📝 Cadastro' : '🔐 Login'}</h1>
          <p className="subtitle">Autenticação Mockada (Desenvolvimento)</p>
        </div>

        <form onSubmit={handleSubmit} className="mock-login-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="fullName">Nome Completo</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@allin.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Processando...' : isRegister ? 'Cadastrar' : 'Entrar'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="toggle-mode">
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)}
            className="btn-toggle"
          >
            {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>

        {!isRegister && (
          <div className="test-credentials">
            <h3>🧪 Credenciais de Teste</h3>
            <div className="credentials-list">
              <div className="credential-item">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('admin@allin.com');
                    setPassword('admin123');
                  }}
                  className="btn-credential"
                >
                  <strong>admin@allin.com</strong> / admin123
                  <span className="role-tag">Super Admin</span>
                </button>
              </div>
              <div className="credential-item">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('gerente@allin.com');
                    setPassword('gerente123');
                  }}
                  className="btn-credential"
                >
                  <strong>gerente@allin.com</strong> / gerente123
                  <span className="role-tag">Admin</span>
                </button>
              </div>
              <div className="credential-item">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('distribuidor@allin.com');
                    setPassword('dist123');
                  }}
                  className="btn-credential"
                >
                  <strong>distribuidor@allin.com</strong> / dist123
                  <span className="role-tag">User</span>
                </button>
              </div>
              <div className="credential-item">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('cliente@allin.com');
                    setPassword('cliente123');
                  }}
                  className="btn-credential"
                >
                  <strong>cliente@allin.com</strong> / cliente123
                  <span className="role-tag">Customer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="dev-notice">
          <p>⚠️ Este é um sistema de autenticação mockado para desenvolvimento.</p>
          <p>Não usar em produção!</p>
        </div>
      </div>
    </div>
  );
}
