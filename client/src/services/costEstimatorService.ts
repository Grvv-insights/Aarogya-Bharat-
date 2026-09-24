import api from './api';
import { CalculatedCostEstimate, CostEstimate } from '../types';

export interface CostCalculationParams {
  treatmentId?: string;
  treatmentName?: string;
  city: string;
  hospitalId?: string;
  hospitalName?: string;
  complexity: 'standard' | 'moderate' | 'high_revision';
  accommodationDuration: number;
  travelDuration: number;
}

export const calculateCostEstimate = async (
  params: CostCalculationParams
): Promise<CalculatedCostEstimate> => {
  const res = await api.post('/estimator/calculate', params);
  return res.data.data;
};

export const saveCostEstimate = async (
  params: CostCalculationParams
): Promise<CostEstimate> => {
  const res = await api.post('/estimator/save', params);
  return res.data.data;
};

export const fetchMyCostEstimates = async (): Promise<CostEstimate[]> => {
  const res = await api.get('/estimator/my');
  return res.data.data;
};

export const deleteCostEstimate = async (id: string): Promise<boolean> => {
  const res = await api.delete(`/estimator/${id}`);
  return res.data.success;
};
