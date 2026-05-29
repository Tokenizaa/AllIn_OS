import { CustomerReferral, ReferralMetadata, User } from '../types/auth.types';
import { storageUtils, generateId } from '../utils/auth.utils';

export class CustomerService {
  createReferral(
    distributorId: string,
    customerId: string,
    metadata: ReferralMetadata | null
  ): CustomerReferral {
    const referrals = storageUtils.getReferrals();
    const newRefConnection: CustomerReferral = {
      id: generateId('ref'),
      distributor_id: distributorId,
      customer_id: customerId,
      source: metadata?.landing_url ? 'link_ref' : 'checkout_cadastro',
      tracking_metadata: metadata || {
        clicked_at: new Date().toISOString(),
        device: 'web-direct'
      },
      created_at: new Date().toISOString()
    };

    const updatedReferrals = [newRefConnection, ...referrals];
    storageUtils.saveReferrals(updatedReferrals);

    return newRefConnection;
  }

  getReferralsByDistributor(distributorId: string): CustomerReferral[] {
    const referrals = storageUtils.getReferrals();
    return referrals.filter((r) => r.distributor_id === distributorId);
  }

  getReferralByCustomer(customerId: string): CustomerReferral | null {
    const referrals = storageUtils.getReferrals();
    return referrals.find((r) => r.customer_id === customerId) || null;
  }

  getAllReferrals(): CustomerReferral[] {
    return storageUtils.getReferrals();
  }
}

export const customerService = new CustomerService();
