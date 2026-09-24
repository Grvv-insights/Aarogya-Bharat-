import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllConsultations,
  updateConsultationStatus
} from '../services/consultationService';
import {
  fetchAllAppointments,
  updateAppointmentStatus
} from '../services/appointmentService';
import { Consultation, Appointment } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Video,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Consultation Modal / Editor
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);
  const [editStatus, setEditStatus] = useState<'pending' | 'reviewed' | 'responded' | 'closed'>('responded');
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [consultsData, apptsData] = await Promise.all([
        fetchAllConsultations(),
        fetchAllAppointments()
      ]);
      setConsultations(consultsData);
      setAppointments(apptsData);
    } catch (err) {
      console.error('Failed to load provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenResponse = (c: Consultation) => {
    setSelectedConsult(c);
    setEditStatus(c.status);
    setResponseText(c.response || '');
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsult) return;

    setIsSubmitting(true);
    try {
      const updated = await updateConsultationStatus(selectedConsult._id, {
        status: editStatus,
        response: responseText
      });

      // Update state locally
      setConsultations((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );

      setAlertMsg({
        type: 'success',
        text: `Consultation from ${(selectedConsult.patient as any)?.name || 'patient'} updated successfully!`
      });
      setSelectedConsult(null);
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: (err as Error).message || 'Failed to update consultation response'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChangeAppointment = async (apptId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const updated = await updateAppointmentStatus(apptId, newStatus);
      setAppointments((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      setAlertMsg({
        type: 'success',
        text: `Appointment status updated to ${newStatus}`
      });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: 'Failed to update appointment'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading Provider & Hospital Desk Portal..." />;
  }

  const pendingCount = consultations.filter((c) => c.status === 'pending').length;
  const respondedCount = consultations.filter((c) => c.status === 'responded').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. PROVIDER HEADER */}
      <div className="bg-gradient-to-r from-navy-950 via-primary-950 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-primary-300">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">
                {user?.name || 'Apollo International Patient Desk'}
              </h1>
              <Badge variant="saffron" size="sm">
                Verified Healthcare Provider
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Affiliation: <span className="font-semibold text-primary-300">Apollo Hospitals & Medanta Network</span> • Role: International Coordinator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block font-medium">Desk Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> Active & Receiving Inquiries
            </span>
          </div>
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

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Incoming Inquiries
              </span>
              <div className="text-2xl font-extrabold text-navy-950 mt-1">
                {consultations.length}
              </div>
              <span className="text-[11px] text-primary-700 font-medium">
                Total Patient Consultations
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pending Triage
              </span>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">
                {pendingCount}
              </div>
              <span className="text-[11px] text-amber-700 font-medium">
                Requires Doctor Response
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Responded & Cleared
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {respondedCount}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                Official Estimate Provided
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-slate-200/90 shadow-xs">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Teleconsult Appointments
              </span>
              <div className="text-2xl font-extrabold text-navy-950 mt-1">
                {appointments.length}
              </div>
              <span className="text-[11px] text-primary-700 font-medium">
                Booked Video Sessions
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 3. HOSPITAL & DOCTORS INFO CARD */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Hospital Network & Faculty Profile
            </h3>
            <p className="text-xs text-slate-500">
              International patient coordinator credentials and hospital facilities overview.
            </p>
          </div>
          <Badge variant="success">JCI & NABH Accredited</Badge>
        </CardHeader>

        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-navy-950 flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-primary-600" /> Apollo Hospitals Chennai
              </h4>
              <p className="text-slate-600">
                Flagship quaternary care facility with 710 beds and dedicated International Patient Lounge.
              </p>
              <div className="pt-2 text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary-600" /> Greams Road, Chennai, Tamil Nadu</div>
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary-600" /> international@apollohospitals.com</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-navy-950 flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-primary-600" /> Medanta - The Medicity
              </h4>
              <p className="text-slate-600">
                1,250 beds, 6 institutes, Flying Doctors Air Ambulance, and robotic surgery suites in Delhi NCR.
              </p>
              <div className="pt-2 text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary-600" /> Sector 38, Gurugram, Delhi NCR</div>
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary-600" /> international.patients@medanta.org</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary-50/70 border border-primary-200 space-y-2">
              <h4 className="font-bold text-navy-950 flex items-center gap-1.5 text-sm">
                <Stethoscope className="w-4 h-4 text-primary-600" /> On-Call Senior Specialists
              </h4>
              <ul className="text-slate-700 space-y-1.5">
                <li className="flex items-center justify-between">
                  <span>Dr. Ashok Rajgopal</span>
                  <span className="text-[11px] font-semibold text-primary-800">Orthopedics</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Dr. Naresh Trehan</span>
                  <span className="text-[11px] font-semibold text-primary-800">Cardiovascular</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Dr. Rahul Bhargava</span>
                  <span className="text-[11px] font-semibold text-primary-800">Hematology / BMT</span>
                </li>
              </ul>
              <p className="text-[10px] text-slate-500 pt-1">
                Direct integration with telehealth video consultations and pre-op radiology review.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 4. INCOMING CONSULTATION REQUESTS (TRIAGE & RESPOND) */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-600" />
              Incoming Patient Consultation Requests
            </h3>
            <p className="text-xs text-slate-500">
              Review international patient inquiries, update clinical status, and formulate hospital response.
            </p>
          </div>
          <Badge variant="primary">{consultations.length} Requests</Badge>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">Requested Treatment / Hospital</th>
                  <th className="px-6 py-3.5">Inquiry Message</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consultations.map((c) => {
                  const pat = (c.patient as any) || {};
                  const hosp = (c.hospital as any) || {};
                  const doc = (c.doctor as any) || {};
                  const trt = (c.treatment as any) || {};

                  return (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-navy-950">{pat.name || 'Anonymous Patient'}</div>
                        <div className="text-[11px] text-slate-500">{pat.country || 'International'} • {pat.email}</div>
                        {pat.phone && <div className="text-[10px] text-slate-400">{pat.phone}</div>}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-navy-950">{trt.name || 'General Consultation'}</div>
                        <div className="text-[11px] text-primary-700">{hosp.name || 'Hospital Network'}</div>
                        {doc.name && <div className="text-[10px] text-slate-500">Dr. {doc.name}</div>}
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-slate-600 line-clamp-2 italic">"{c.message}"</p>
                        {c.response && (
                          <div className="mt-1 text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-100 line-clamp-2">
                            <strong>Response:</strong> {c.response}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            c.status === 'responded'
                              ? 'success'
                              : c.status === 'reviewed'
                              ? 'saffron'
                              : 'primary'
                          }
                        >
                          {c.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenResponse(c)}
                          className="font-semibold text-xs"
                        >
                          {c.response ? 'Edit Response' : 'Respond'}
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

      {/* 5. APPOINTMENTS SCHEDULE TABLE */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              Scheduled Specialist Appointments
            </h3>
            <p className="text-xs text-slate-500">
              Direct video consultation schedule with international patients and specialists.
            </p>
          </div>
          <Badge variant="primary">{appointments.length} Scheduled</Badge>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Patient</th>
                  <th className="px-6 py-3.5">Specialist Doctor</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Type & Link</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => {
                  const pat = (appt.patient as any) || {};
                  const doc = (appt.doctor as any) || {};
                  const hosp = (appt.hospital as any) || {};

                  return (
                    <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-navy-950">{pat.name || 'Patient'}</div>
                        <div className="text-[11px] text-slate-500">{pat.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-navy-950">{doc.name || 'Dr. Ashok Rajgopal'}</div>
                        <div className="text-[11px] text-slate-500">{hosp.name || 'Hospital'}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-navy-950">
                          {appt.appointmentDate
                            ? new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Oct 04, 2026'}
                        </div>
                        <div className="text-[11px] text-slate-500">04:30 PM IST</div>
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={appt.meetingLink || 'https://telehealth.medvoyage.in/room/sarah-dr-rajgopal'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:underline"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Video Room
                        </a>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            appt.status === 'confirmed'
                              ? 'success'
                              : appt.status === 'completed'
                              ? 'primary'
                              : 'saffron'
                          }
                        >
                          {appt.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {appt.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChangeAppointment(appt._id, 'confirmed')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold hover:bg-emerald-100 text-[11px]"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChangeAppointment(appt._id, 'completed')}
                            className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded font-semibold hover:bg-slate-100 text-[11px]"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* 6. MODAL: RESPOND TO CONSULTATION */}
      {selectedConsult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  Respond to Consultation Request
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: {((selectedConsult.patient as any)?.name) || 'Anonymous'} ({(selectedConsult.patient as any)?.country || 'International'})
                </p>
              </div>
              <button
                onClick={() => setSelectedConsult(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                <span className="font-semibold text-slate-600 block text-[11px] mb-1">
                  Original Patient Query:
                </span>
                <p className="text-slate-800 italic">"{selectedConsult.message}"</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1.5">
                  Update Request Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                >
                  <option value="pending">PENDING (Awaiting Review)</option>
                  <option value="reviewed">REVIEWED (Clinical Case Examined)</option>
                  <option value="responded">RESPONDED (Quote & Protocol Sent)</option>
                  <option value="closed">CLOSED (Completed / Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1.5">
                  Hospital Desk / Doctor Response Note
                </label>
                <textarea
                  required
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter medical evaluation, estimated procedure timeline, recovery period, and package pricing..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedConsult(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Save & Notify Patient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboardPage;
