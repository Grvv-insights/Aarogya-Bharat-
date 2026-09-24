import api from './api';
import { TravelPlan } from '../types';

export const fetchMyTravelPlan = async (): Promise<TravelPlan | null> => {
  const res = await api.get('/travel-plans/my');
  return res.data.data;
};

export const updateMyTravelPlan = async (data: Partial<TravelPlan>): Promise<TravelPlan> => {
  const res = await api.post('/travel-plans/my', data);
  return res.data.data;
};

export const saveTravelPlan = updateMyTravelPlan;

