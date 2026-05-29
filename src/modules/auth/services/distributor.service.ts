import { DistributorProfile, User } from '../types/auth.types';
import { storageUtils, generateId } from '../utils/auth.utils';

export class DistributorService {
  getDistributorProfile(userId: string): DistributorProfile | null {
    const distributors = storageUtils.getDistributors();
    return distributors.find((d) => d.customer_id === userId) || null;
  }

  getAllDistributors(): DistributorProfile[] {
    return storageUtils.getDistributors();
  }

  async updateDistributorProfile(userId: string, updates: Partial<DistributorProfile>): Promise<DistributorProfile> {
    const distributors = storageUtils.getDistributors();
    const idx = distributors.findIndex((d) => d.customer_id === userId);

    if (idx === -1) {
      throw new Error('Perfil de distribuidor não encontrado.');
    }

    const updatedList = [...distributors];
    updatedList[idx] = { ...updatedList[idx], ...updates };
    storageUtils.saveDistributors(updatedList);

    return updatedList[idx];
  }

  async activateDistributorOffice(userId: string, planId: string): Promise<DistributorProfile> {
    const distributors = storageUtils.getDistributors();
    const idx = distributors.findIndex((d) => d.customer_id === userId);

    if (idx === -1) {
      throw new Error('Perfil de distribuidor não encontrado.');
    }

    const planNames: Record<string, string> = {
      'plan-starter': 'Gold Starter',
      'plan-pro': 'Diamond Pro',
      'plan-platinum': 'Platinum Supreme'
    };

    const activeProf = distributors[idx];
    const updatedProf: DistributorProfile = {
      ...activeProf,
      plan_id: planId,
      status: 'active',
      qualification: planNames[planId] || 'Platinum Elite',
      wallet_balance: 50.00,
      bonus_balance: 20.00
    };

    const newDists = [...distributors];
    newDists[idx] = updatedProf;
    storageUtils.saveDistributors(newDists);

    return updatedProf;
  }

  async triggerBinomialBonusPay(referralCode: string, points: number, commission: number): Promise<void> {
    const distributors = storageUtils.getDistributors();
    const updatedDists = distributors.map((d) => {
      if (d.referral_code === referralCode || d.id === referralCode || d.customer_id === referralCode) {
        return {
          ...d,
          wallet_balance: d.wallet_balance + commission,
          bonus_balance: d.bonus_balance + points
        };
      }
      return d;
    });

    storageUtils.saveDistributors(updatedDists);
  }

  getDistributorByReferralCode(code: string): DistributorProfile | null {
    const distributors = storageUtils.getDistributors();
    return distributors.find((d) => d.referral_code === code) || null;
  }
}

export const distributorService = new DistributorService();
