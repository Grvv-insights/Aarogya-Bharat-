import { Request, Response, NextFunction } from 'express';
import * as treatmentService from '../services/treatmentService';

export const getAllTreatments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, city } = req.query;
    const treatments = await treatmentService.getTreatments({
      category: category as string,
      city: city as string,
      search: search as string
    });

    res.status(200).json({
      success: true,
      count: treatments.length,
      data: treatments
    });
  } catch (error) {
    next(error);
  }
};

export const getTreatment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let treatment = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      treatment = await treatmentService.getTreatmentById(id);
    }
    if (!treatment) {
      treatment = await treatmentService.getTreatmentBySlug(id);
    }

    if (!treatment) {
      res.status(404).json({ success: false, message: 'Treatment not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: treatment
    });
  } catch (error) {
    next(error);
  }
};
