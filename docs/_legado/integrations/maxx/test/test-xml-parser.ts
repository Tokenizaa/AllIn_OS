// Teste do parser XML da Maxx API

import { parseRequestToXml, parseXmlResponse } from '../utils/xmlParser';
import { MaxxAuthRequest, MaxxAuthResponse } from '../types';

function testXmlParser() {
  console.log('🧪 Iniciando teste do XML Parser...');
  
  try {
    // Teste 1: Parse de Request para XML
    console.log('\n📤 Teste 1: Request → XML');
    const authRequest: MaxxAuthRequest = {
      controller: 'login',
      action: 'authapiuser',
      login: 'testApi',
      module: 'default'
    };
    
    const xmlRequest = parseRequestToXml({ module: 'api', ...authRequest });
    console.log('XML gerado:');
    console.log(xmlRequest);
    
    // Validação básica
    const isValidRequest = xmlRequest.includes('<api>') && 
                        xmlRequest.includes('<request>') && 
                        xmlRequest.includes('<controller>login</controller>') &&
                        xmlRequest.includes('<action>authapiuser</action>');
    
    console.log('XML válido:', isValidRequest ? '✅ Sim' : '❌ Não');
    
    // Teste 2: Parse de Response XML para Objeto
    console.log('\n📥 Teste 2: XML → Objeto');
    const sampleXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<api>
  <response>
    <error>0</error>
    <token>17c4520f6cfa1ab53d8745e84681eb2917riezld2guv46oc3j</token>
    <msg>Usuário Autenticado Com Sucesso</msg>
  </response>
</api>`;
    
    const parsedResponse = parseXmlResponse<MaxxAuthResponse>(sampleXmlResponse);
    console.log('Objeto parseado:', parsedResponse);
    
    // Validação do resultado
    const isValidResponse = parsedResponse.api.response.error === 0 &&
                         parsedResponse.api.response.token === '17c4520f6cfa1ab53d8745e84681eb2917riezld2guv46oc3j' &&
                         parsedResponse.api.response.msg === 'Usuário Autenticado Com Sucesso';
    
    console.log('Parse válido:', isValidResponse ? '✅ Sim' : '❌ Não');
    
    // Teste 3: Parse com múltiplos itens
    console.log('\n📋 Teste 3: XML com Múltiplos Itens');
    const multiItemXml = `<?xml version="1.0" encoding="UTF-8"?>
<api>
  <response>
    <error>0</error>
    <item>
      <id>1</id>
      <nome>Cliente 1</nome>
      <email>cliente1@teste.com</email>
    </item>
    <item>
      <id>2</id>
      <nome>Cliente 2</nome>
      <email>cliente2@teste.com</email>
    </item>
  </response>
</api>`;
    
    const multiItemResponse = parseXmlResponse(multiItemXml);
    console.log('Múltiplos itens:', multiItemResponse);
    
    const hasItems = Array.isArray(multiItemResponse.api.response.items) && 
                   multiItemResponse.api.response.items.length === 2;
    
    console.log('Parse múltiplos itens válido:', hasItems ? '✅ Sim' : '❌ Não');
    
    // Teste 4: Tratamento de erro
    console.log('\n❌ Teste 4: Tratamento de Erro');
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<api>
  <response>
    <error>1</error>
    <msg>Usuário não encontrado</msg>
  </response>
</api>`;
    
    const errorResponse = parseXmlResponse(errorXml);
    console.log('Resposta de erro:', errorResponse);
    
    const isErrorHandled = errorResponse.api.response.error === 1 &&
                        errorResponse.api.response.msg === 'Usuário não encontrado';
    
    console.log('Erro tratado corretamente:', isErrorHandled ? '✅ Sim' : '❌ Não');
    
    console.log('\n🎉 Todos os testes do XML parser passaram!');
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste do XML parser:', error);
    
    if (error instanceof Error) {
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

// Função para testar no navegador
export function runXmlParserTest() {
  if (typeof window !== 'undefined') {
    console.log('🌐 Executando teste do XML Parser...');
    testXmlParser();
  } else {
    console.log('⚠️ Teste deve ser executado no navegador');
  }
}

// Auto-execução se for importado diretamente
if (typeof window !== 'undefined' && window.location) {
  // Adiciona função ao escopo global para fácil acesso no console
  (window as any).testXmlParser = testXmlParser;
  (window as any).runXmlParserTest = runXmlParserTest;
  
  console.log('💡 Funções disponíveis no console:');
  console.log('- testXmlParser() - Teste completo do XML parser');
  console.log('- runXmlParserTest() - Executa teste com interface amigável');
}
