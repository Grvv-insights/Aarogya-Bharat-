import { TravelPlan } from '../models/TravelPlan';
import { ITravelPlan } from '../types';

export const getTravelPlanByPatient = async (patientId: string): Promise<ITravelPlan | null> => {
  return TravelPlan.findOne({ patient: patientId })
    .populate('hospital', 'name city address contact')
    .populate('treatment', 'name estimatedCostRange');
};

export const createOrUpdateTravelPlan = async (
  patientId: string,
  data: Partial<ITravelPlan>
): Promise<ITravelPlan> => {
  let plan = await TravelPlan.findOne({ patient: patientId });

  if (plan) {
    Object.assign(plan, data);
    await plan.save();
  } else {
    plan = await TravelPlan.create({
      ...data,
      patient: patientId
    });
  }

  return (await TravelPlan.findById(plan._id)
    .populate('hospital', 'name city address contact')
    .populate('treatment', 'name estimatedCostRange')) as ITravelPlan;
};
