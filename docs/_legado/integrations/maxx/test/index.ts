// Index de testes da Maxx API

export * from './test-auth';
export * from './test-xml-parser';

// Função principal para executar todos os testes
export async function runAllTests() {
  console.log('🚀 Iniciando suíte de testes da Maxx API...');
  console.log('=' .repeat(50));
  
  try {
    // Importa e executa testes
    const { runAuthTest } = await import('./test-auth');
    const { runXmlParserTest } = await import('./test-xml-parser');
    
    // Executa testes em sequência
    console.log('\n1️⃣ Testando XML Parser...');
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay
    runXmlParserTest();
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay entre testes
    
    console.log('\n2️⃣ Testando Autenticação...');
    await new Promise(resolve => setTimeout(resolve, 100));
    runAuthTest();
    
    console.log('\n🎉 Suíte de testes concluída!');
    console.log('💡 Verifique o console para resultados detalhados');
    
  } catch (error) {
    console.error('❌ Erro ao executar suíte de testes:', error);
  }
}

// Auto-execução se for importado diretamente
if (typeof window !== 'undefined' && window.location) {
  // Adiciona função ao escopo global
  (window as any).runAllTests = runAllTests;
  
  console.log('💡 Funções disponíveis no console:');
  console.log('- runAllTests() - Executa suíte completa de testes');
  console.log('- runAuthTest() - Testa apenas autenticação');
  console.log('- runXmlParserTest() - Testa apenas XML parser');
}
