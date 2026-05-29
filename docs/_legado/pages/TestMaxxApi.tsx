import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const TestMaxxApi: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Carrega os testes quando o componente monta
    loadTestModules();
  }, []);

  const loadTestModules = async () => {
    try {
      // Importa os módulos de teste
      const testModules = await import('@/integrations/maxx/test');
      
      // Adiciona as funções ao escopo global para debug
      (window as any).runAllTests = testModules.runAllTests;
      (window as any).runAuthTest = testModules.runAuthTest;
      (window as any).runXmlParserTest = testModules.runXmlParserTest;
      
      console.log('💡 Funções de teste disponíveis no console:');
      console.log('- runAllTests() - Executa todos os testes');
      console.log('- runAuthTest() - Testa apenas autenticação');
      console.log('- runXmlParserTest() - Testa apenas XML parser');
    } catch (err) {
      console.error('Erro ao carregar módulos de teste:', err);
      setError('Falha ao carregar módulos de teste');
    }
  };

  const addTestResult = (testName: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    const result = {
      id: Date.now() + Math.random(),
      testName,
      status,
      message,
      details,
      timestamp: new Date().toLocaleString('pt-BR')
    };
    
    setTestResults(prev => [...prev, result]);
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setError('');
    setTestResults([]);
    setCurrentTest('Carregando módulos...');

    try {
      // Interceptar console.log para capturar resultados
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args: any[]) => {
        logs.push(args.join(' '));
        originalLog.apply(console, args);
      };

      // Importa e executa os testes
      const testModules = await import('@/integrations/maxx/test');
      
      setCurrentTest('Executando testes do XML Parser...');
      await new Promise(resolve => setTimeout(resolve, 500));
      testModules.runXmlParserTest();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentTest('Executando testes de autenticação...');
      await new Promise(resolve => setTimeout(resolve, 500));
      testModules.runAuthTest();
      
      // Restaura console.log
      console.log = originalLog;
      
      // Analisa os logs para extrair resultados
      analyzeTestResults(logs);
      
      setCurrentTest('Testes concluídos!');
      
    } catch (err) {
      console.error('Erro ao executar testes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      addTestResult('Execução dos Testes', 'error', 'Falha geral na execução', err);
    } finally {
      setIsLoading(false);
      setCurrentTest('');
    }
  };

  const analyzeTestResults = (logs: string[]) => {
    // Analisa os logs para extrair resultados dos testes
    const xmlParserSuccess = logs.some(log => log.includes('Todos os testes do XML parser passaram'));
    const authSuccess = logs.some(log => log.includes('Todos os testes passaram com sucesso'));
    
    // Testes do XML Parser
    addTestResult('XML Parser - Request → XML', 
      logs.some(log => log.includes('XML válido: ✅ Sim')) ? 'success' : 'error',
      logs.some(log => log.includes('XML válido: ✅ Sim')) ? 'Conversão bem-sucedida' : 'Falha na conversão');
    
    addTestResult('XML Parser - XML → Objeto', 
      logs.some(log => log.includes('Parse válido: ✅ Sim')) ? 'success' : 'error',
      logs.some(log => log.includes('Parse válido: ✅ Sim')) ? 'Parse bem-sucedido' : 'Falha no parse');
    
    addTestResult('XML Parser - Múltiplos Itens', 
      logs.some(log => log.includes('Parse múltiplos itens válido: ✅ Sim')) ? 'success' : 'error',
      logs.some(log => log.includes('Parse múltiplos itens válido: ✅ Sim')) ? 'Tratamento correto' : 'Falha no tratamento');
    
    // Testes de Autenticação
    addTestResult('Autenticação - Configuração', 
      logs.some(log => log.includes('URL:')) ? 'success' : 'error',
      logs.some(log => log.includes('URL:')) ? 'Configuração carregada' : 'Falha na configuração');
    
    addTestResult('Autenticação - Login', 
      logs.some(log => log.includes('Autenticação bem-sucedida')) ? 'success' : 'error',
      logs.some(log => log.includes('Autenticação bem-sucedida')) ? 'Login realizado' : 'Falha no login');
    
    addTestResult('Autenticação - Cache', 
      logs.some(log => log.includes('Usou cache: ✅ Sim')) ? 'success' : 'warning',
      logs.some(log => log.includes('Usou cache: ✅ Sim')) ? 'Cache funcionando' : 'Cache pode não estar funcionando');
    
    addTestResult('Conexão com API', 
      logs.some(log => log.includes('Conectado: ✅ Sim')) ? 'success' : 'error',
      logs.some(log => log.includes('Conectado: ✅ Sim')) ? 'Conexão estabelecida' : 'Falha na conexão');
    
    // Resultado geral
    const overallSuccess = xmlParserSuccess && authSuccess;
    addTestResult('Resultado Geral', 
      overallSuccess ? 'success' : 'error',
      overallSuccess ? 'Todos os testes passaram' : 'Alguns testes falharam');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary'
    } as const;
    
    const labels = {
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Aviso'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🧪 Testes da Maxx API</h1>
        <p className="text-muted-foreground">
          Valide a infraestrutura da integração com a Maxx API antes de continuar com a implementação.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Execução de Testes
            </CardTitle>
            <CardDescription>
              Execute a suíte completa de testes para validar a infraestrutura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runAllTests} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentTest || 'Executando...'}
                  </>
                ) : (
                  '🚀 Executar Todos os Testes'
                )}
              </Button>
            </div>

            {isLoading && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Status:</strong> {currentTest}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
            <CardDescription>
              {testResults.length === 0 
                ? 'Execute os testes para ver os resultados aqui'
                : `${testResults.length} testes executados`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum teste executado ainda</p>
                <p className="text-sm mt-2">Clique no botão acima para iniciar os testes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result) => (
                  <div 
                    key={result.id} 
                    className={`p-4 rounded-lg border ${
                      result.status === 'success' ? 'bg-green-50 border-green-200' :
                      result.status === 'error' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.testName}</span>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className={`text-sm ${
                      result.status === 'success' ? 'text-green-800' :
                      result.status === 'error' ? 'text-red-800' :
                      'text-yellow-800'
                    }`}>
                      {result.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📖 Instruções</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="console" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="console">Console</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="console" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">No Console do Navegador:</h4>
                  <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm">
                    {`// Executa todos os testes
runAllTests();

// Testes individuais
runAuthTest();
runXmlParserTest();

// Ver informações da sessão
maxxAuthService.getSessionInfo();

// Verificar conexão
maxxApiService.checkConnection();`}
                  </code>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">1. Configuração</h4>
                    <p className="text-sm text-muted-foreground">
                      Verifique as variáveis de ambiente no arquivo .env
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">2. Execução</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Executar Todos os Testes" para rodar a suíte completa
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">3. Análise</h4>
                    <p className="text-sm text-muted-foreground">
                      Verifique os resultados e os logs no console para detalhes
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestMaxxApi;
