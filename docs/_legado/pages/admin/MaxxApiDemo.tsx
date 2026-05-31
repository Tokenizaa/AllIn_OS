// Página de demonstração dos endpoints da Maxx API
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, ShoppingCart, Package, CreditCard, CheckCircle, XCircle } from 'lucide-react';

import { useMaxxCadastros } from '@/hooks/useMaxxCadastros';
import { useMaxxFaturas } from '@/hooks/useMaxxFaturas';
import { useMaxxProdutos } from '@/hooks/useMaxxProdutos';
import { useMaxxCreditos } from '@/hooks/useMaxxCreditos';

export default function MaxxApiDemoPage() {
  const [activeTab, setActiveTab] = useState('cadastros');
  
  // Hooks para cada serviço
  const cadastrosHook = useMaxxCadastros();
  const faturasHook = useMaxxFaturas();
  const produtosHook = useMaxxProdutos();
  const creditosHook = useMaxxCreditos();

  // Estados para formulários
  const [formData, setFormData] = useState({
    // Cadastros
    dataIni: '01/01/2024',
    codCadastro: '',
    loginCadastro: '',
    senhaCadastro: '',
    statusCadastro: '',
    
    // Faturas
    idFatura: '',
    dataFim: '',
    
    // Produtos
    categoriaId: '',
    codProduto: '',
    
    // Créditos
    codCredito: '',
    codOrigem: '',
    codDestino: '',
    valorTransferencia: '',
    dataIniExtrato: '',
    dataFimExtrato: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCadastrosTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Listar Cadastros
            </CardTitle>
            <CardDescription>
              Lista todos os cadastros a partir de uma data inicial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataIni">Data Inicial</Label>
              <Input
                id="dataIni"
                value={formData.dataIni}
                onChange={(e) => handleInputChange('dataIni', e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
            <Button 
              onClick={() => cadastrosHook.listarCadastros({ data_ini: formData.dataIni })}
              disabled={cadastrosHook.loading}
              className="w-full"
            >
              {cadastrosHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Listar Cadastros
            </Button>
            {cadastrosHook.error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{cadastrosHook.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Cadastro</CardTitle>
            <CardDescription>Busca um cadastro específico pelo código</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="codCadastro">Código</Label>
              <Input
                id="codCadastro"
                value={formData.codCadastro}
                onChange={(e) => handleInputChange('codCadastro', e.target.value)}
                placeholder="Código do cadastro"
              />
            </div>
            <Button 
              onClick={() => cadastrosHook.buscarCadastro({ cod: parseInt(formData.codCadastro) })}
              disabled={cadastrosHook.loading || !formData.codCadastro}
              className="w-full"
            >
              {cadastrosHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buscar Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>

      {cadastrosHook.cadastros.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados ({cadastrosHook.cadastros.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cadastrosHook.cadastros.map((cadastro) => (
                <div key={cadastro.cod} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{cadastro.nome}</p>
                      <p className="text-sm text-muted-foreground">{cadastro.email}</p>
                      <p className="text-sm">CPF: {cadastro.cpf_cnpj}</p>
                    </div>
                    <Badge variant={cadastro.status === 'Ativo' ? 'default' : 'secondary'}>
                      {cadastro.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderFaturasTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Listar Faturas
            </CardTitle>
            <CardDescription>Lista faturas em um período</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataIniFatura">Data Inicial</Label>
              <Input
                id="dataIniFatura"
                value={formData.dataIni}
                onChange={(e) => handleInputChange('dataIni', e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div>
              <Label htmlFor="dataFim">Data Final (opcional)</Label>
              <Input
                id="dataFim"
                value={formData.dataFim}
                onChange={(e) => handleInputChange('dataFim', e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
            <Button 
              onClick={() => faturasHook.listarFaturas({ 
                data_ini: formData.dataIni,
                data_fim: formData.dataFim 
              })}
              disabled={faturasHook.loading}
              className="w-full"
            >
              {faturasHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Listar Faturas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Fatura</CardTitle>
            <CardDescription>Busca uma fatura específica pelo ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="idFatura">ID da Fatura</Label>
              <Input
                id="idFatura"
                value={formData.idFatura}
                onChange={(e) => handleInputChange('idFatura', e.target.value)}
                placeholder="ID da fatura"
              />
            </div>
            <Button 
              onClick={() => faturasHook.buscarFatura({ id_fatura: parseInt(formData.idFatura) })}
              disabled={faturasHook.loading || !formData.idFatura}
              className="w-full"
            >
              {faturasHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buscar Fatura
            </Button>
          </CardContent>
        </Card>
      </div>

      {faturasHook.faturas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Faturas encontradas ({faturasHook.faturas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {faturasHook.faturas.map((fatura) => (
                <div key={fatura.id_fatura} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Fatura #{fatura.id_fatura}</p>
                      <p className="text-sm text-muted-foreground">{fatura.cliente_nome}</p>
                      <p className="text-sm">{fatura.data_pedido}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{fatura.valor_total}</p>
                      <Badge variant={fatura.situacao === 'Pago' ? 'default' : 'secondary'}>
                        {fatura.situacao}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProdutosTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Listar Produtos
            </CardTitle>
            <CardDescription>Lista todos os produtos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="categoriaId">ID da Categoria (opcional)</Label>
              <Input
                id="categoriaId"
                value={formData.categoriaId}
                onChange={(e) => handleInputChange('categoriaId', e.target.value)}
                placeholder="ID da categoria"
              />
            </div>
            <Button 
              onClick={() => produtosHook.listarProdutos({ 
                categoria_id: formData.categoriaId ? parseInt(formData.categoriaId) : undefined 
              })}
              disabled={produtosHook.loading}
              className="w-full"
            >
              {produtosHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Listar Produtos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Produto</CardTitle>
            <CardDescription>Busca um produto específico pelo código</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="codProduto">Código</Label>
              <Input
                id="codProduto"
                value={formData.codProduto}
                onChange={(e) => handleInputChange('codProduto', e.target.value)}
                placeholder="Código do produto"
              />
            </div>
            <Button 
              onClick={() => produtosHook.buscarProduto({ cod: parseInt(formData.codProduto) })}
              disabled={produtosHook.loading || !formData.codProduto}
              className="w-full"
            >
              {produtosHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buscar Produto
            </Button>
          </CardContent>
        </Card>
      </div>

      {produtosHook.produtos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos encontrados ({produtosHook.produtos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {produtosHook.produtos.map((produto) => (
                <div key={produto.cod} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-sm text-muted-foreground">{produto.categoria}</p>
                      <p className="text-sm">Estoque: {produto.estoque}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{produto.valor}</p>
                      <Badge variant={produto.status === 'Ativo' ? 'default' : 'secondary'}>
                        {produto.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCreditosTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Consultar Saldo
            </CardTitle>
            <CardDescription>Verifica saldo de créditos de um cadastro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="codCredito">Código do Cadastro</Label>
              <Input
                id="codCredito"
                value={formData.codCredito}
                onChange={(e) => handleInputChange('codCredito', e.target.value)}
                placeholder="Código do cadastro"
              />
            </div>
            <Button 
              onClick={() => creditosHook.obterSaldo({ cod: parseInt(formData.codCredito) })}
              disabled={creditosHook.loading || !formData.codCredito}
              className="w-full"
            >
              {creditosHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Consultar Saldo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transferir Créditos</CardTitle>
            <CardDescription>Transfere créditos entre cadastros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="codOrigem">Código de Origem</Label>
              <Input
                id="codOrigem"
                value={formData.codOrigem}
                onChange={(e) => handleInputChange('codOrigem', e.target.value)}
                placeholder="Código de origem"
              />
            </div>
            <div>
              <Label htmlFor="codDestino">Código de Destino</Label>
              <Input
                id="codDestino"
                value={formData.codDestino}
                onChange={(e) => handleInputChange('codDestino', e.target.value)}
                placeholder="Código de destino"
              />
            </div>
            <div>
              <Label htmlFor="valorTransferencia">Valor</Label>
              <Input
                id="valorTransferencia"
                value={formData.valorTransferencia}
                onChange={(e) => handleInputChange('valorTransferencia', e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
            <Button 
              onClick={() => creditosHook.transferirCreditos({
                cod_origem: parseInt(formData.codOrigem),
                cod_destino: parseInt(formData.codDestino),
                valor: formData.valorTransferencia
              })}
              disabled={creditosHook.loading || !formData.codOrigem || !formData.codDestino || !formData.valorTransferencia}
              className="w-full"
            >
              {creditosHook.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transferir
            </Button>
          </CardContent>
        </Card>
      </div>

      {creditosHook.saldo && (
        <Card>
          <CardHeader>
            <CardTitle>Saldo Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Sacável</p>
                <p className="text-2xl font-bold text-green-600">{creditosHook.saldo.sacavel}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Não Sacável</p>
                <p className="text-2xl font-bold text-orange-600">{creditosHook.saldo.nao_sacavel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {creditosHook.transferResult && (
        <Alert variant={creditosHook.transferResult.sucesso ? 'default' : 'destructive'}>
          {creditosHook.transferResult.sucesso ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {creditosHook.transferResult.mensagem || 
             (creditosHook.transferResult.sucesso ? 'Transferência realizada com sucesso!' : 'Falha na transferência')
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Maxx API - Demonstração</h1>
        <p className="text-muted-foreground">
          Teste os endpoints da Maxx API de forma interativa
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cadastros">Cadastros</TabsTrigger>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="creditos">Créditos</TabsTrigger>
        </TabsList>

        <TabsContent value="cadastros" className="mt-6">
          {renderCadastrosTab()}
        </TabsContent>

        <TabsContent value="faturas" className="mt-6">
          {renderFaturasTab()}
        </TabsContent>

        <TabsContent value="produtos" className="mt-6">
          {renderProdutosTab()}
        </TabsContent>

        <TabsContent value="creditos" className="mt-6">
          {renderCreditosTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
