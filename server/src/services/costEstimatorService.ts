import { Types } from 'mongoose';
import { Treatment } from '../models/Treatment';
import { Hospital } from '../models/Hospital';
import { CostEstimate } from '../models/CostEstimate';
import { CostRange, ICostEstimateBreakdown, ICostEstimateTotals, ICostEstimate } from '../types';

export const MANDATORY_DISCLAIMER =
  'These figures are illustrative estimates for planning purposes only. Actual costs vary by hospital, doctor, treatment plan, patient condition, travel dates and other factors. A final quotation must come directly from the healthcare provider.';

export interface CostEstimateInput {
  treatmentId?: string;
  treatmentName?: string;
  city: string;
  hospitalId?: string;
  hospitalName?: string;
  complexity: 'standard' | 'moderate' | 'high_revision';
  accommodationDuration: number;
  travelDuration: number;
}

export interface CalculatedCostEstimate {
  treatmentId?: string;
  treatmentName: string;
  city: string;
  hospitalId?: string;
  hospitalName: string;
  complexity: 'standard' | 'moderate' | 'high_revision';
  accommodationDuration: number;
  travelDuration: number;
  breakdown: ICostEstimateBreakdown;
  totals: ICostEstimateTotals;
  disclaimer: string;
  isEstimateOnly: true;
}

const roundToHundred = (num: number): number => Math.round(num / 100) * 100;
const roundToTen = (num: number): number => Math.round(num / 10) * 10;

export class CostEstimatorService {
  /**
   * Pure calculation engine decoupled from React UI and HTTP transport.
   * Can later be replaced by a more sophisticated pricing engine or external hospital rate matrix.
   */
  public async calculateEstimate(input: CostEstimateInput): Promise<CalculatedCostEstimate> {
    const {
      treatmentId,
      city = 'Delhi NCR',
      hospitalId,
      complexity = 'moderate',
      accommodationDuration = 10,
      travelDuration = 14
    } = input;

    // 1. Resolve Treatment baseline
    let baseTreatmentName = input.treatmentName || 'General Procedure';
    let baseMinINR = 250000;
    let baseMaxINR = 420000;
    let baseMinUSD = 3000;
    let baseMaxUSD = 5100;

    if (treatmentId && Types.ObjectId.isValid(treatmentId)) {
      const treatment = await Treatment.findById(treatmentId);
      if (treatment) {
        baseTreatmentName = treatment.name;
        if (treatment.estimatedCostRange) {
          baseMinINR = treatment.estimatedCostRange.minINR || baseMinINR;
          baseMaxINR = treatment.estimatedCostRange.maxINR || baseMaxINR;
          baseMinUSD = treatment.estimatedCostRange.minUSD || baseMinUSD;
          baseMaxUSD = treatment.estimatedCostRange.maxUSD || baseMaxUSD;
        }
      }
    } else if (input.treatmentName) {
      const treatment = await Treatment.findOne({
        name: { $regex: new RegExp(input.treatmentName, 'i') }
      });
      if (treatment) {
        baseTreatmentName = treatment.name;
        if (treatment.estimatedCostRange) {
          baseMinINR = treatment.estimatedCostRange.minINR || baseMinINR;
          baseMaxINR = treatment.estimatedCostRange.maxINR || baseMaxINR;
          baseMinUSD = treatment.estimatedCostRange.minUSD || baseMinUSD;
          baseMaxUSD = treatment.estimatedCostRange.maxUSD || baseMaxUSD;
        }
      }
    }

    // 2. Resolve Hospital
    let baseHospitalName = input.hospitalName || 'Accredited Partner Hospital';
    if (hospitalId && Types.ObjectId.isValid(hospitalId)) {
      const hospital = await Hospital.findById(hospitalId);
      if (hospital) {
        baseHospitalName = hospital.name;
      }
    }

    // 3. Complexity factor
    // Standard: 0.90x, Moderate: 1.00x, High / Revision: 1.35x
    const complexityMultipliers: Record<string, { inr: number; usd: number }> = {
      standard: { inr: 0.9, usd: 0.9 },
      moderate: { inr: 1.0, usd: 1.0 },
      high_revision: { inr: 1.35, usd: 1.35 }
    };

    const mult = complexityMultipliers[complexity] || complexityMultipliers.moderate;

    // Component 1: Medical Treatment
    const medicalTreatment: CostRange = {
      minINR: roundToHundred(baseMinINR * mult.inr),
      maxINR: roundToHundred(baseMaxINR * mult.inr),
      minUSD: roundToTen(baseMinUSD * mult.usd),
      maxUSD: roundToTen(baseMaxUSD * mult.usd)
    };

    // Component 2: Hospital / Clinical Costs (OT, Pre-op diagnostics, post-op nursing, ICU standby, pharmacy)
    const hospitalClinical: CostRange = {
      minINR: roundToHundred(medicalTreatment.minINR * 0.22),
      maxINR: roundToHundred(medicalTreatment.maxINR * 0.32),
      minUSD: roundToTen(medicalTreatment.minUSD * 0.22),
      maxUSD: roundToTen(medicalTreatment.maxUSD * 0.32)
    };

    // Component 3: Accommodation (Quality recovery hotels / serviced suites: ~₹3,200 - ₹6,200 / $40 - $75 per night)
    const safeStayDays = Math.max(1, Math.min(60, Number(accommodationDuration) || 10));
    const accommodation: CostRange = {
      minINR: safeStayDays * 3200,
      maxINR: safeStayDays * 6200,
      minUSD: safeStayDays * 40,
      maxUSD: safeStayDays * 75
    };

    // Component 4: Local Transportation (Chauffeur airport transfer + clinic commutes)
    const safeTravelDays = Math.max(1, Math.min(90, Number(travelDuration) || 14));
    const extraDays = Math.max(0, safeTravelDays - 7);
    const localTransportation: CostRange = {
      minINR: 3500 + extraDays * 350,
      maxINR: 7000 + extraDays * 550,
      minUSD: 45 + extraDays * 4,
      maxUSD: 85 + extraDays * 7
    };

    // Component 5: Travel (Round-trip flight planning estimate)
    const travel: CostRange = {
      minINR: 58000,
      maxINR: 105000,
      minUSD: 700,
      maxUSD: 1280
    };

    // Component 6: Other Estimated Expenses (e-Medical visa, SIM, daily incidental food/living)
    const otherExpenses: CostRange = {
      minINR: 12000,
      maxINR: 24000,
      minUSD: 145,
      maxUSD: 290
    };

    const breakdown: ICostEstimateBreakdown = {
      medicalTreatment,
      hospitalClinical,
      accommodation,
      localTransportation,
      travel,
      otherExpenses
    };

    // Derived Totals requested by prompt:
    // Estimated Medical Cost, Estimated Travel Cost, Estimated Accommodation Cost, Estimated Total Range
    const estimatedMedicalCost: CostRange = {
      minINR: medicalTreatment.minINR + hospitalClinical.minINR,
      maxINR: medicalTreatment.maxINR + hospitalClinical.maxINR,
      minUSD: medicalTreatment.minUSD + hospitalClinical.minUSD,
      maxUSD: medicalTreatment.maxUSD + hospitalClinical.maxUSD
    };

    const estimatedTravelCost: CostRange = {
      minINR: travel.minINR + localTransportation.minINR,
      maxINR: travel.maxINR + localTransportation.maxINR,
      minUSD: travel.minUSD + localTransportation.minUSD,
      maxUSD: travel.maxUSD + localTransportation.maxUSD
    };

    const estimatedAccommodationCost: CostRange = {
      minINR: accommodation.minINR,
      maxINR: accommodation.maxINR,
      minUSD: accommodation.minUSD,
      maxUSD: accommodation.maxUSD
    };

    const estimatedTotalRange: CostRange = {
      minINR:
        estimatedMedicalCost.minINR +
        estimatedTravelCost.minINR +
        estimatedAccommodationCost.minINR +
        otherExpenses.minINR,
      maxINR:
        estimatedMedicalCost.maxINR +
        estimatedTravelCost.maxINR +
        estimatedAccommodationCost.maxINR +
        otherExpenses.maxINR,
      minUSD:
        estimatedMedicalCost.minUSD +
        estimatedTravelCost.minUSD +
        estimatedAccommodationCost.minUSD +
        otherExpenses.minUSD,
      maxUSD:
        estimatedMedicalCost.maxUSD +
        estimatedTravelCost.maxUSD +
        estimatedAccommodationCost.maxUSD +
        otherExpenses.maxUSD
    };

    const totals: ICostEstimateTotals = {
      estimatedMedicalCost,
      estimatedTravelCost,
      estimatedAccommodationCost,
      estimatedTotalRange
    };

    return {
      treatmentId,
      treatmentName: baseTreatmentName,
      city,
      hospitalId,
      hospitalName: baseHospitalName,
      complexity,
      accommodationDuration: safeStayDays,
      travelDuration: safeTravelDays,
      breakdown,
      totals,
      disclaimer: MANDATORY_DISCLAIMER,
      isEstimateOnly: true
    };
  }

  /**
   * Save an illustrative estimate to patient dashboard
   */
  public async saveEstimate(patientId: string, input: CostEstimateInput): Promise<ICostEstimate> {
    const calc = await this.calculateEstimate(input);

    const doc = new CostEstimate({
      patient: new Types.ObjectId(patientId),
      treatment: calc.treatmentId && Types.ObjectId.isValid(calc.treatmentId) ? new Types.ObjectId(calc.treatmentId) : undefined,
      treatmentName: calc.treatmentName,
      city: calc.city,
      hospital: calc.hospitalId && Types.ObjectId.isValid(calc.hospitalId) ? new Types.ObjectId(calc.hospitalId) : undefined,
      hospitalName: calc.hospitalName,
      complexity: calc.complexity,
      accommodationDuration: calc.accommodationDuration,
      travelDuration: calc.travelDuration,
      breakdown: calc.breakdown,
      totals: calc.totals,
      disclaimer: MANDATORY_DISCLAIMER
    });

    return await doc.save();
  }

  /**
   * Retrieve all saved estimates for a patient
   */
  public async getPatientEstimates(patientId: string): Promise<ICostEstimate[]> {
    return await CostEstimate.find({ patient: new Types.ObjectId(patientId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Delete a saved estimate for a patient
   */
  public async deleteEstimate(estimateId: string, patientId: string): Promise<boolean> {
    const result = await CostEstimate.deleteOne({
      _id: new Types.ObjectId(estimateId),
      patient: new Types.ObjectId(patientId)
    });
    return result.deletedCount > 0;
  }
}

export const costEstimatorService = new CostEstimatorService();
