import { useFetch } from './useFetch';
import { fetchInfluencers } from '../services/influencer.service';

export function useMarketplace() {
  const { data, loading, error } = useFetch(fetchInfluencers, []);
  return { data: data || [], loading, error };
}
