import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminStats,
  updateHospitalVerification,
  AdminStatsResponse
} from '../services/adminService';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  ShieldCheck,
  Users,
  Building2,
  Stethoscope,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Globe,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updatingHospitalId, setUpdatingHospitalId] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      const res = await fetchAdminStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleToggleVerification = async (hospitalId: string, currentStatus: string) => {
    setUpdatingHospitalId(hospitalId);
    try {
      const nextStatus = currentStatus === 'verified' ? 'pending' : 'verified';
      await updateHospitalVerification(hospitalId, nextStatus);

      // Locally update
      setData((prev) => {
        if (!prev) return prev;
        const updatedHospitals = prev.hospitals.map((h) =>
          h._id === hospitalId ? { ...h, verificationStatus: nextStatus as any } : h
        );
        const pendingCount = updatedHospitals.filter(
          (h) => h.verificationStatus === 'pending' || h.verificationStatus === 'unverified'
        ).length;

        return {
          ...prev,
          stats: {
            ...prev.stats,
            pendingVerifications: pendingCount
          },
          hospitals: updatedHospitals
        };
      });

      setAlertMsg({
        type: 'success',
        text: `Hospital verification status updated to '${nextStatus}'.`
      });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: 'Failed to update hospital verification status.'
      });
    } finally {
      setUpdatingHospitalId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading MedJourney Platform Governance Console..." />;
  }

  const stats = data?.stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. ADMIN HEADER */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">
                Platform Administration Console
              </h1>
              <Badge variant="saffron" size="sm">
                SuperAdmin
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Logged in as: <span className="font-semibold text-white">{user?.name}</span> ({user?.email}) • Environment: Production Prototype
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadStats}
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Metrics
          </Button>
        </div>
      </div>

      {alertMsg && (
        <Alert
          type={alertMsg.type}
          onClose={() => setAlertMsg(null)}
        >
          {alertMsg.text}
        </Alert>
      )}

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Total Patients */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Patients
            </span>
            <div className="text-2xl font-extrabold text-navy-950 mt-1">
              {stats?.totalPatients ?? 0}
            </div>
          </CardBody>
        </Card>

        {/* Metric 2: Total Hospitals */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Hospitals
            </span>
            <div className="text-2xl font-extrabold text-navy-950 mt-1">
              {stats?.totalHospitals ?? 0}
            </div>
          </CardBody>
        </Card>

        {/* Metric 3: Total Doctors */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Doctors
            </span>
            <div className="text-2xl font-extrabold text-navy-950 mt-1">
              {stats?.totalDoctors ?? 0}
            </div>
          </CardBody>
        </Card>

        {/* Metric 4: Consultations */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Consultations
            </span>
            <div className="text-2xl font-extrabold text-navy-950 mt-1">
              {stats?.totalConsultations ?? 0}
            </div>
          </CardBody>
        </Card>

        {/* Metric 5: Appointments */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Appointments
            </span>
            <div className="text-2xl font-extrabold text-navy-950 mt-1">
              {stats?.totalAppointments ?? 0}
            </div>
          </CardBody>
        </Card>

        {/* Metric 6: Pending Verifications */}
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Pending Verification
            </span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {stats?.pendingVerifications ?? 0}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 3. MANAGEMENT TABLE 1: RECENT USER ACCOUNTS */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              Registered User Accounts
            </h3>
            <p className="text-xs text-slate-500">
              User identity registry across Patients, Healthcare Providers, and Administrators.
            </p>
          </div>
          <Badge variant="primary">{data?.recentUsers.length || 0} Accounts</Badge>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Country</th>
                  <th className="px-6 py-3.5 text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy-950">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          u.role === 'admin'
                            ? 'saffron'
                            : u.role === 'provider'
                            ? 'primary'
                            : 'neutral'
                        }
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {u.country || 'International'}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* 4. MANAGEMENT TABLE 2: HOSPITAL VERIFICATION & AUDIT */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-600" />
              Hospital Network Accreditation & Verification Management
            </h3>
            <p className="text-xs text-slate-500">
              Audit Indian hospital partner verifications and toggle active platform status.
            </p>
          </div>
          <Badge variant="primary">{data?.hospitals.length || 0} Centers</Badge>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Hospital Name</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Accreditation</th>
                  <th className="px-6 py-3.5">Capacity / Rating</th>
                  <th className="px-6 py-3.5">Verification Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.hospitals.map((h) => {
                  const isVerified = h.verificationStatus === 'verified';

                  return (
                    <tr key={h._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-bold text-navy-950">
                        {h.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {h.city}, {h.state}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {h.accreditation.map((acc) => (
                            <Badge key={acc} variant="primary" size="sm">
                              {acc}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {h.bedCount} Beds • ⭐ {h.rating} ({h.reviewCount})
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={isVerified ? 'success' : 'saffron'}>
                          {h.verificationStatus.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          variant={isVerified ? 'outline' : 'primary'}
                          size="sm"
                          isLoading={updatingHospitalId === h._id}
                          onClick={() => handleToggleVerification(h._id, h.verificationStatus)}
                          className="text-xs"
                        >
                          {isVerified ? 'Revoke Status' : 'Verify Hospital'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
