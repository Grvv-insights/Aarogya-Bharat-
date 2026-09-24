import { Response, NextFunction } from 'express';
import * as medicalDocumentService from '../services/medicalDocumentService';
import { AuthRequest } from '../types';

export const getMyDocuments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const documents = await medicalDocumentService.getDocumentsByPatient(patientId);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMockDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const { fileName, documentType, fileSize, notes, visibility } = req.body;

    if (!fileName) {
      res.status(400).json({
        success: false,
        message: 'File name is required'
      });
      return;
    }

    const document = await medicalDocumentService.createDocument(patientId, {
      fileName,
      documentType: documentType || 'medical_report',
      fileSize: fileSize || '1.5 MB',
      notes,
      visibility
    });

    res.status(201).json({
      success: true,
      message: 'Medical document metadata created in secure portal',
      data: document
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const { id } = req.params;

    const deleted = await medicalDocumentService.deleteDocument(patientId, id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Medical document not found or access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Medical document deleted'
    });
  } catch (error) {
    next(error);
  }
};
