# 🧪 Testes da Maxx API

## 🎯 **OBJETIVO**
Validar a infraestrutura da integração com a Maxx API antes de continuar com a implementação dos endpoints.

## 📋 **TESTES DISPONÍVEIS**

### 1️⃣ **XML Parser Test**
- **Arquivo**: `test-xml-parser.ts`
- **Função**: `testXmlParser()` ou `runXmlParserTest()`
- **Validação**: 
  - Parse de request → XML
  - Parse de XML → objeto
  - Múltiplos itens
  - Tratamento de erros

### 2️⃣ **Authentication Test**
- **Arquivo**: `test-auth.ts`
- **Função**: `testMaxxAuth()` ou `runAuthTest()`
- **Validação**:
  - Configuração
  - Autenticação
  - Cache de sessão
  - Conexão com API

## 🚀 **COMO EXECUTAR**

### No Console do Navegador
```javascript
// Importa os testes
import('/src/integrations/maxx/test/index.js').then(module => {
  // Executa todos os testes
  module.runAllTests();
  
  // Ou executa individualmente
  // module.runAuthTest();
  // module.runXmlParserTest();
});
```

### Direto no Console (se já carregado)
```javascript
// Executa todos os testes
runAllTests();

// Testes individuais
runAuthTest();
runXmlParserTest();
```

## 📊 **RESULTADOS ESPERADOS**

### ✅ **XML Parser**
- Conversão correta de objetos para XML
- Parse correto de XML para objetos
- Tratamento de múltiplos itens
- Validação de respostas de erro

### ✅ **Autenticação**
- Configuração lida corretamente
- Token obtido com sucesso
- Cache funcionando
- Conexão estabelecida

## 🔧 **DEBUG**

### Logs Detalhados
Todos os testes incluem logs detalhados com:
- ✅ Sucesso
- ❌ Falha
- 📊 Informações
- 🔧 Debug

### Informações de Sessão
```javascript
// Ver informações da sessão atual
maxxAuthService.getSessionInfo();
```

### Status da Conexão
```javascript
// Verificar conexão
maxxApiService.checkConnection();
```

## 🚨 **PROBLEMAS COMUNS**

### 1. **CORS**
- **Sintoma**: Erro de CORS no console
- **Solução**: Configurar CORS no servidor ou usar proxy

### 2. **Timeout**
- **Sintoma**: Requisição demora e falha
- **Solução**: Aumentar `VITE_MAXX_API_TIMEOUT`

### 3. **Credenciais**
- **Sintoma**: Erro de autenticação
- **Solução**: Verificar `VITE_MAXX_API_LOGIN`

### 4. **Network**
- **Sintoma**: Falha de conexão
- **Solução**: Verificar URL e conectividade

## 📝 **PRÓXIMOS PASSOS**

Após validar os testes:

1. ✅ Se todos passarem → Continuar com FASE 3 (Clientes)
2. ❌ Se houver falhas → Corrigir infraestrutura
3. 🔄 Se houver warnings → Otimizar código

## 🎯 **STATUS ATUAL**

- ✅ Infraestrutura criada
- ✅ Testes implementados
- ⏳ Aguardando validação

**Próximo**: Executar testes e validar integração
