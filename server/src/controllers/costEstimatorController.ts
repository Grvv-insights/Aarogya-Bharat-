import { Response } from 'express';
import { AuthRequest } from '../types';
import { costEstimatorService } from '../services/costEstimatorService';

export const calculateCostEstimate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      treatmentId,
      treatmentName,
      city,
      hospitalId,
      hospitalName,
      complexity,
      accommodationDuration,
      travelDuration
    } = req.body;

    const result = await costEstimatorService.calculateEstimate({
      treatmentId,
      treatmentName,
      city: city || 'Delhi NCR',
      hospitalId,
      hospitalName,
      complexity: complexity || 'moderate',
      accommodationDuration: Number(accommodationDuration) || 10,
      travelDuration: Number(travelDuration) || 14
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error calculating cost estimate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate cost estimate',
      error: error.message
    });
  }
};

export const saveCostEstimate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to save estimates' });
      return;
    }

    const {
      treatmentId,
      treatmentName,
      city,
      hospitalId,
      hospitalName,
      complexity,
      accommodationDuration,
      travelDuration
    } = req.body;

    const saved = await costEstimatorService.saveEstimate(req.user._id.toString(), {
      treatmentId,
      treatmentName,
      city: city || 'Delhi NCR',
      hospitalId,
      hospitalName,
      complexity: complexity || 'moderate',
      accommodationDuration: Number(accommodationDuration) || 10,
      travelDuration: Number(travelDuration) || 14
    });

    res.status(201).json({
      success: true,
      message: 'Cost estimate saved to your dashboard successfully',
      data: saved
    });
  } catch (error: any) {
    console.error('Error saving cost estimate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save cost estimate',
      error: error.message
    });
  }
};

export const getMyCostEstimates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const estimates = await costEstimatorService.getPatientEstimates(req.user._id.toString());

    res.status(200).json({
      success: true,
      data: estimates
    });
  } catch (error: any) {
    console.error('Error fetching patient cost estimates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved cost estimates',
      error: error.message
    });
  }
};

export const deleteCostEstimate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const success = await costEstimatorService.deleteEstimate(req.params.id, req.user._id.toString());
    if (!success) {
      res.status(404).json({ success: false, message: 'Estimate not found or already deleted' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Cost estimate removed successfully'
    });
  } catch (error: any) {
    console.error('Error deleting cost estimate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete cost estimate',
      error: error.message
    });
  }
};
