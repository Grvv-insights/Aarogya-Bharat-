import api from './api';

export interface AdminStatsResponse {
  stats: {
    totalPatients: number;
    totalProviders: number;
    totalHospitals: number;
    totalDoctors: number;
    totalConsultations: number;
    totalAppointments: number;
    pendingVerifications: number;
  };
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    country: string;
    createdAt: string;
  }>;
  hospitals: Array<{
    _id: string;
    name: string;
    city: string;
    state: string;
    accreditation: string[];
    verificationStatus: 'verified' | 'pending' | 'unverified';
    rating: number;
    reviewCount: number;
    bedCount: number;
  }>;
}

export const fetchAdminStats = async (): Promise<AdminStatsResponse> => {
  const res = await api.get('/admin/stats');
  return res.data.data;
};

export const updateHospitalVerification = async (
  hospitalId: string,
  verificationStatus?: 'verified' | 'pending' | 'unverified'
): Promise<any> => {
  const res = await api.patch(`/admin/hospitals/${hospitalId}/verify`, {
    verificationStatus
  });
  return res.data.data;
};
