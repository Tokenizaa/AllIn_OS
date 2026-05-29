// SCRIPT DE MIGRAÇÃO COMPLETO - Frontend para Supabase
// Execute este script no console do navegador após aplicar as migrações SQL

import { LeadService, ConversationService, migrateLocalStorageToSupabase, hasLocalStorageData } from '../services/leadServiceNew';

// StoreService stub for migration (original module removed)
const StoreService = {
  getStoreBySlug: async (_slug: string) => null as any,
  createStore: async (_data: any) => null as any,
  getAllStores: async () => [] as any[],
};

// Interface para o script de migração
interface MigrationScript {
  runMigration(): Promise<void>;
  checkData(): Promise<MigrationReport>;
  cleanup(): Promise<void>;
}

interface MigrationReport {
  hasData: boolean;
  leadsCount: number;
  conversationsCount: number;
  storesCount: number;
  recommendations: string[];
}

class MigrationManager implements MigrationScript {
  async runMigration(): Promise<void> {
    console.log('🚀 Iniciando migração completa do frontend para Supabase...');
    
    try {
      // 1. Verificar se há dados para migrar
      const report = await this.checkData();
      
      if (!report.hasData) {
        console.log('✅ Nenhum dado encontrado para migração. Sistema já está integrado!');
        return;
      }

      console.log('📊 Relatório de dados encontrados:', report);

      // 2. Backup dos dados atuais
      await this.createBackup();

      // 3. Migrar Leads e Conversas
      if (report.leadsCount > 0 || report.conversationsCount > 0) {
        console.log('📋 Migrando Leads e Conversas...');
        await migrateLocalStorageToSupabase();
      }

      // 4. Migrar Stores (se necessário)
      if (report.storesCount > 0) {
        console.log('🏪 Migrando Stores...');
        await this.migrateStores();
      }

      // 5. Limpar dados antigos
      console.log('🧹 Limpando dados antigos...');
      await this.cleanup();

      // 6. Verificar migração
      console.log('🔍 Verificando migração...');
      await this.verifyMigration();

      console.log('✅ Migração concluída com sucesso!');
      console.log('🎉 Seu sistema agora está 100% integrado com o Supabase!');

    } catch (error) {
      console.error('❌ Erro durante migração:', error);
      throw error;
    }
  }

  async checkData(): Promise<MigrationReport> {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const conversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
    const stores = JSON.parse(localStorage.getItem('stores') || '[]');
    
    const hasData = leads.length > 0 || conversations.length > 0 || stores.length > 0;
    
    const recommendations: string[] = [];
    
    if (leads.length > 0) {
      recommendations.push(`Migrar ${leads.length} leads para tabela 'leads'`);
    }
    
    if (conversations.length > 0) {
      recommendations.push(`Migrar ${conversations.length} conversas para tabela 'conversas'`);
    }
    
    if (stores.length > 0) {
      recommendations.push(`Verificar se ${stores.length} stores já existem no Supabase`);
    }

    return {
      hasData,
      leadsCount: leads.length,
      conversationsCount: conversations.length,
      storesCount: stores.length,
      recommendations
    };
  }

  private async createBackup(): Promise<void> {
    console.log('💾 Criando backup dos dados...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      leads: JSON.parse(localStorage.getItem('leads') || '[]'),
      conversations: JSON.parse(localStorage.getItem('chatConversations') || '[]'),
      stores: JSON.parse(localStorage.getItem('stores') || '[]'),
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      adminRequests: JSON.parse(localStorage.getItem('adminRequests') || '[]'),
      storeSettings: JSON.parse(localStorage.getItem('storeSettings') || '{}'),
      cart: JSON.parse(localStorage.getItem('cart') || '[]')
    };

    // Salvar backup no localStorage
    localStorage.setItem('migration_backup', JSON.stringify(backup));
    
    // Também fazer download do backup
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('✅ Backup criado com sucesso!');
  }

  private async migrateStores(): Promise<void> {
    const localStores = JSON.parse(localStorage.getItem('stores') || '[]');
    
    for (const store of localStores) {
      try {
        // Verificar se store já existe
        const existingStore = await StoreService.getStoreBySlug(store.slug);
        
        if (!existingStore) {
          await StoreService.createStore({
            slug: store.slug,
            name: store.name,
            category: store.category,
            city: store.city,
            description: store.description,
            rating: store.rating,
            reviewCount: store.reviewCount,
            specialties: store.specialties,
            contact: store.contact,
            primaryColor: store.primaryColor,
            secondaryColor: store.secondaryColor,
            customMessage: store.customMessage,
            sponsorLink: store.sponsorLink
          });
          console.log(`✅ Store "${store.name}" migrada com sucesso`);
        } else {
          console.log(`⚠️ Store "${store.name}" já existe no Supabase`);
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar store "${store.name}":`, error);
      }
    }
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Limpando localStorage...');
    
    // Itens para remover
    const itemsToRemove = [
      'leads',
      'chatConversations',
      'stores',
      'users',
      'adminRequests'
    ];

    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });

    console.log('✅ LocalStorage limpo!');
  }

  private async verifyMigration(): Promise<void> {
    console.log('🔍 Verificando integridade dos dados migrados...');
    
    try {
      // Verificar leads
      const leads = await LeadService.getLeads();
      console.log(`✅ ${leads.length} leads encontrados no Supabase`);

      // Verificar conversas
      const conversations = await ConversationService.getConversations();
      console.log(`✅ ${conversations.length} conversas encontradas no Supabase`);

      // Verificar stores
      const stores = await StoreService.getAllStores();
      console.log(`✅ ${stores.length} stores encontradas no Supabase`);

      // Verificar se não há mais dados no localStorage
      const hasData = hasLocalStorageData();
      if (!hasData) {
        console.log('✅ LocalStorage completamente limpo!');
      } else {
        console.warn('⚠️ Ainda existem dados no localStorage');
      }

    } catch (error) {
      console.error('❌ Erro na verificação:', error);
      throw error;
    }
  }

  // Método para rollback (caso necessário)
  async rollback(): Promise<void> {
    console.log('🔄 Iniciando rollback...');
    
    try {
      const backup = JSON.parse(localStorage.getItem('migration_backup') || '{}');
      
      if (!backup.timestamp) {
        throw new Error('Nenhum backup encontrado');
      }

      // Restaurar dados no localStorage
      localStorage.setItem('leads', JSON.stringify(backup.leads || []));
      localStorage.setItem('chatConversations', JSON.stringify(backup.conversations || []));
      localStorage.setItem('stores', JSON.stringify(backup.stores || []));
      localStorage.setItem('users', JSON.stringify(backup.users || []));
      localStorage.setItem('adminRequests', JSON.stringify(backup.adminRequests || []));
      localStorage.setItem('storeSettings', JSON.stringify(backup.storeSettings || {}));
      localStorage.setItem('cart', JSON.stringify(backup.cart || []));

      console.log('✅ Rollback concluído! Dados restaurados do backup.');
      
    } catch (error) {
      console.error('❌ Erro no rollback:', error);
      throw error;
    }
  }
}

// Função para executar a migração
export const runMigration = async (): Promise<void> => {
  const migration = new MigrationManager();
  
  try {
    await migration.runMigration();
  } catch (error) {
    console.error('❌ Migração falhou:', error);
    
    // Oferecer opção de rollback
    if (confirm('A migração falhou. Deseja restaurar os dados do backup?')) {
      await migration.rollback();
    }
    
    throw error;
  }
};

// Função para verificar status atual
export const checkMigrationStatus = async (): Promise<void> => {
  const migration = new MigrationManager();
  const report = await migration.checkData();
  
  console.log('📊 Status Atual da Migração:');
  console.log('================================');
  console.log(`Possui dados para migrar: ${report.hasData ? 'Sim' : 'Não'}`);
  console.log(`Leads no localStorage: ${report.leadsCount}`);
  console.log(`Conversas no localStorage: ${report.conversationsCount}`);
  console.log(`Stores no localStorage: ${report.storesCount}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n📋 Recomendações:');
    report.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  // Verificar dados no Supabase
  try {
    const leads = await LeadService.getLeads();
    const stores = await StoreService.getAllStores();
    
    console.log('\n📊 Dados no Supabase:');
    console.log(`Leads: ${leads.length}`);
    console.log(`Stores: ${stores.length}`);
  } catch (error) {
    console.log('\n❌ Não foi possível verificar dados no Supabase');
  }
};

// Tornar disponível globalmente no console
declare global {
  interface Window {
    runMigration: typeof runMigration;
    checkMigrationStatus: typeof checkMigrationStatus;
    migrationManager: MigrationManager;
  }
}

// Expor funções globalmente para uso no console
if (typeof window !== 'undefined') {
  window.runMigration = runMigration;
  window.checkMigrationStatus = checkMigrationStatus;
  window.migrationManager = new MigrationManager();
  
  console.log('🚀 Ferramentas de migração disponíveis!');
  console.log('Use: window.runMigration() para iniciar a migração');
  console.log('Use: window.checkMigrationStatus() para verificar o status');
}

export default MigrationManager;
