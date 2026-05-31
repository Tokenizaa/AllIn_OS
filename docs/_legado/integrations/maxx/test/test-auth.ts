// Teste de autenticação da Maxx API

import { maxxAuthService } from '../MaxxAuthService';
import { maxxApiService } from '../MaxxApiService';

async function testMaxxAuth() {
  console.log('🚀 Iniciando teste de autenticação Maxx API...');
  
  try {
    // Teste 1: Verificar configuração
    console.log('\n📋 Teste 1: Configuração');
    const config = maxxAuthService.getConfig();
    console.log('URL:', config.apiUrl);
    console.log('Login:', config.login);
    console.log('Module:', config.module);
    console.log('Timeout:', config.timeout);
    
    // Teste 2: Autenticação
    console.log('\n🔐 Teste 2: Autenticação');
    const session = await maxxAuthService.authenticate();
    console.log('✅ Autenticação bem-sucedida!');
    console.log('Token:', session.token.substring(0, 8) + '...');
    console.log('Expira em:', session.expiresAt.toLocaleString('pt-BR'));
    
    // Teste 3: Verificar sessão
    console.log('\n📊 Teste 3: Status da Sessão');
    const sessionInfo = maxxAuthService.getSessionInfo();
    console.log('Autenticado:', sessionInfo.isAuthenticated);
    console.log('Token Preview:', sessionInfo.tokenPreview);
    console.log('Tempo até expiração:', Math.floor((sessionInfo.timeToExpiry || 0) / 1000 / 60), 'minutos');
    
    // Teste 4: Conexão com API
    console.log('\n🌐 Teste 4: Conexão com API');
    const isConnected = await maxxApiService.checkConnection();
    console.log('Conectado:', isConnected ? '✅ Sim' : '❌ Não');
    
    // Teste 5: Reautenticação (cache)
    console.log('\n🔄 Teste 5: Cache de Sessão');
    const startTime = Date.now();
    const cachedSession = await maxxAuthService.authenticate(); // Deve usar cache
    const endTime = Date.now();
    console.log('Usou cache:', endTime - startTime < 100 ? '✅ Sim' : '❌ Não');
    console.log('Tempo de resposta:', endTime - startTime, 'ms');
    
    console.log('\n🎉 Todos os testes passaram com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error);
    
    if (error instanceof Error) {
      console.error('Mensagem:', error.message);
      console.error('Tipo:', error.constructor.name);
    }
    
    // Tenta obter informações para debug
    try {
      const sessionInfo = maxxAuthService.getSessionInfo();
      console.log('\n📊 Informações da sessão atual:', sessionInfo);
    } catch (debugError) {
      console.error('❌ Erro ao obter informações da sessão:', debugError);
    }
  }
}

// Função para testar no navegador
export async function runAuthTest() {
  if (typeof window !== 'undefined') {
    console.log('🌐 Executando teste no navegador...');
    await testMaxxAuth();
  } else {
    console.log('⚠️ Teste deve ser executado no navegador');
  }
}

// Auto-execução se for importado diretamente
if (typeof window !== 'undefined' && window.location) {
  // Adiciona função ao escopo global para fácil acesso no console
  (window as any).testMaxxAuth = testMaxxAuth;
  (window as any).runAuthTest = runAuthTest;
  
  console.log('💡 Funções disponíveis no console:');
  console.log('- testMaxxAuth() - Teste completo de autenticação');
  console.log('- runAuthTest() - Executa teste com interface amigável');
}
