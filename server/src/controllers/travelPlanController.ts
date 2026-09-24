import { Response, NextFunction } from 'express';
import * as travelPlanService from '../services/travelPlanService';
import { AuthRequest } from '../types';

export const getMyTravelPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const travelPlan = await travelPlanService.getTravelPlanByPatient(patientId);

    res.status(200).json({
      success: true,
      data: travelPlan
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyTravelPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const plan = await travelPlanService.createOrUpdateTravelPlan(patientId, req.body);

    res.status(200).json({
      success: true,
      message: 'Travel plan updated successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};
