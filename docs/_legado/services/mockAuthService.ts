// Serviço de autenticação mockado para desenvolvimento
// Não requer banco de dados - usa credenciais hardcoded

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'user' | 'customer';
  status: 'active' | 'inactive';
}

export interface LoginResponse {
  success: boolean;
  user?: MockUser;
  token?: string;
  error?: string;
}

// Usuários mockados para desenvolvimento
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@allin.com',
    fullName: 'Administrador',
    role: 'super_admin',
    status: 'active'
  },
  {
    id: '2',
    email: 'gerente@allin.com',
    fullName: 'Gerente de Loja',
    role: 'admin',
    status: 'active'
  },
  {
    id: '3',
    email: 'distribuidor@allin.com',
    fullName: 'Distribuidor Teste',
    role: 'user',
    status: 'active'
  },
  {
    id: '4',
    email: 'cliente@allin.com',
    fullName: 'Cliente Final',
    role: 'customer',
    status: 'active'
  }
];

// Senhas mockadas (em produção, usar hash real)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@allin.com': 'admin123',
  'gerente@allin.com': 'gerente123',
  'distribuidor@allin.com': 'dist123',
  'cliente@allin.com': 'cliente123'
};

class MockAuthService {
  /**
   * Simula login com credenciais hardcoded
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = MOCK_USERS.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado'
      };
    }

    if (user.status !== 'active') {
      return {
        success: false,
        error: 'Usuário inativo'
      };
    }

    const storedPassword = MOCK_PASSWORDS[email];
    if (password !== storedPassword) {
      return {
        success: false,
        error: 'Senha incorreta'
      };
    }

    // Gerar token mockado
    const token = this.generateMockToken(user);

    return {
      success: true,
      user,
      token
    };
  }

  /**
   * Simula registro de novo usuário
   */
  static async register(email: string, password: string, fullName: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificar se email já existe
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email já cadastrado'
      };
    }

    // Criar novo usuário
    const newUser: MockUser = {
      id: (MOCK_USERS.length + 1).toString(),
      email,
      fullName,
      role: 'customer',
      status: 'active'
    };

    MOCK_USERS.push(newUser);
    MOCK_PASSWORDS[email] = password;

    const token = this.generateMockToken(newUser);

    return {
      success: true,
      user: newUser,
      token
    };
  }

  /**
   * Simula logout
   */
  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Limpar localStorage se necessário
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_token');
      localStorage.removeItem('mock_user');
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('mock_token');
    return !!token;
  }

  /**
   * Obtém usuário atual do localStorage
   */
  static getCurrentUser(): MockUser | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('mock_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Salva sessão no localStorage
   */
  static saveSession(user: MockUser, token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('mock_token', token);
    localStorage.setItem('mock_user', JSON.stringify(user));
  }

  /**
   * Gera token mockado (JWT-like)
   */
  private static generateMockToken(user: MockUser): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    }));
    const signature = btoa('mock_signature');
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Lista todos os usuários mockados (para debug)
   */
  static getAllUsers(): MockUser[] {
    return [...MOCK_USERS];
  }

  /**
   * Reseta usuários para estado inicial (para testes)
   */
  static resetUsers(): void {
    MOCK_USERS.length = 0;
    MOCK_USERS.push(
      {
        id: '1',
        email: 'admin@allin.com',
        fullName: 'Administrador',
        role: 'super_admin',
        status: 'active'
      },
      {
        id: '2',
        email: 'gerente@allin.com',
        fullName: 'Gerente de Loja',
        role: 'admin',
        status: 'active'
      },
      {
        id: '3',
        email: 'distribuidor@allin.com',
        fullName: 'Distribuidor Teste',
        role: 'user',
        status: 'active'
      },
      {
        id: '4',
        email: 'cliente@allin.com',
        fullName: 'Cliente Final',
        role: 'customer',
        status: 'active'
      }
    );
  }
}

export default MockAuthService;
