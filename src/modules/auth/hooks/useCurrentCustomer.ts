import { useSession } from './useSession';
import { storageUtils } from '../utils/auth.utils';

export const useCurrentCustomer = () => {
  const { user } = useSession();

  const getCustomerReferral = () => {
    if (!user) return null;
    const referrals = storageUtils.getReferrals();
    return referrals.find((r) => r.customer_id === user.id) || null;
  };

  const getSponsor = () => {
    if (!user || !user.sponsor_id) return null;
    const users = storageUtils.getUsers();
    return users.find((u) => u.id === user.sponsor_id || u.referral_code === user.sponsor_id) || null;
  };

  return {
    customer: user,
    referral: getCustomerReferral(),
    sponsor: getSponsor()
  };
};
