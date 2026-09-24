import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyDocuments,
  uploadMockDocument,
  deleteMyDocument,
  UploadDocumentPayload
} from '../services/medicalDocumentService';
import { MedicalDocument } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Stethoscope,
  Info,
  ChevronLeft,
  X,
  FileSpreadsheet,
  FileImage,
  FolderArchive
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Documents' },
  { id: 'medical_report', label: 'Medical Report' },
  { id: 'prescription', label: 'Prescription' },
  { id: 'scan', label: 'Scan / Imaging' },
  { id: 'lab_report', label: 'Lab Report' },
  { id: 'discharge_summary', label: 'Discharge Summary' },
  { id: 'other', label: 'Other' }
];

export const MedicalDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [documentType, setDocumentType] = useState<UploadDocumentPayload['documentType']>('medical_report');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [notes, setNotes] = useState('');
  const [visibility, setVisibility] = useState<'patient_and_doctor' | 'private' | 'hospital_only'>('patient_and_doctor');
  const [uploading, setUploading] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await fetchMyDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMB} MB`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setUploading(true);
    try {
      const newDoc = await uploadMockDocument({
        fileName: fileName.trim(),
        documentType,
        fileSize,
        notes: notes.trim(),
        visibility
      });

      setDocuments((prev) => [newDoc, ...prev]);
      setAlertMsg({
        type: 'success',
        text: `"${newDoc.fileName}" registered with secure encrypted access reference.`
      });
      setIsUploadOpen(false);
      setFileName('');
      setNotes('');
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: (err as Error).message || 'Failed to upload document'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, docName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${docName}" from your medical record?`)) return;

    try {
      await deleteMyDocument(docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      setAlertMsg({
        type: 'info',
        text: `"${docName}" removed from your patient portal.`
      });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: 'Failed to delete medical document.'
      });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'medical_report') return doc.documentType === 'medical_report' || doc.documentType === 'report';
    if (selectedCategory === 'other') return doc.documentType === 'other' || doc.documentType === 'visa_letter';
    return doc.documentType === selectedCategory;
  });

  const getCategoryBadgeVariant = (type: string) => {
    switch (type) {
      case 'medical_report':
      case 'report':
        return 'primary';
      case 'scan':
        return 'saffron';
      case 'prescription':
        return 'success';
      case 'lab_report':
        return 'neutral';
      case 'discharge_summary':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <FileImage className="w-4 h-4 text-amber-600" />;
      case 'lab_report':
        return <FileSpreadsheet className="w-4 h-4 text-purple-600" />;
      case 'discharge_summary':
        return <FolderArchive className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-primary-600" />;
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading secure medical document center..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. BREADCRUMB & HEADER */}
      <div className="space-y-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Patient Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-navy-950 via-navy-900 to-primary-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-primary-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary-300">
                Encrypted Patient Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical Document Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Organize medical reports, diagnostic imaging, physician prescriptions, and discharge summaries for specialist evaluation across Indian hospital networks.
            </p>
          </div>

          <Button
            variant="saffron"
            size="md"
            onClick={() => setIsUploadOpen(true)}
            leftIcon={<UploadCloud className="w-4 h-4" />}
            className="font-semibold shadow-xs"
          >
            Upload Document
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

      {/* 2. PROTOTYPE ARCHITECTURE & SECURITY NOTICE */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4.5 text-xs text-amber-950 space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>PROTOTYPE SECURITY ARCHITECTURE NOTICE</span>
        </div>
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          In this evaluation prototype, uploaded document metadata and simulated access tokens are persisted in MongoDB with simulated client-side AES-256 vault pointers. In full clinical production, files are streamed directly into an encrypted, HIPAA and NABH-compliant cloud repository (e.g. AWS S3 SSE-KMS or Azure Blob Storage) with time-limited signed download URLs. <strong>No patient health records are ever exposed publicly.</strong>
        </p>
      </div>

      {/* 3. CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-primary-600 border-primary-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. DOCUMENTS LIST */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary-600" />
              Verified Patient Health Records
            </h3>
            <p className="text-xs text-slate-500">
              Only authenticated patients and authorized hospital case managers have permission to inspect these records.
            </p>
          </div>
          <Badge variant="primary">{filteredDocuments.length} Documents</Badge>
        </CardHeader>

        <CardBody className="p-0">
          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => {
                const formattedDate = new Date(doc.uploadDate || doc.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={doc._id}
                    className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(doc.documentType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-navy-950">
                            {doc.fileName}
                          </h4>
                          <Badge variant={getCategoryBadgeVariant(doc.documentType)} size="sm">
                            {doc.documentType.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="success" size="sm">
                            {(doc.status || 'VERIFIED').toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span>Uploaded: <strong>{formattedDate}</strong></span>
                          <span>•</span>
                          <span>Size: {doc.fileSize || '1.8 MB'}</span>
                          <span>•</span>
                          <span className="text-[11px] font-mono text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                            {doc.fileUrl}
                          </span>
                        </div>

                        <div className="mt-2 text-xs flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-slate-500">Access Information:</span>
                          <span>{doc.accessInfo || 'Restricted: Patient & Attending Clinical Team'}</span>
                        </div>

                        {doc.notes && (
                          <p className="text-xs text-slate-500 italic mt-1.5">
                            Notes: "{doc.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          alert(
                            `[Secure Download Protocol]\nDocument: ${doc.fileName}\nStorage URL: ${doc.fileUrl}\nAccess Authorization: VERIFIED via JWT.`
                          )
                        }
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Download
                      </Button>
                      <button
                        onClick={() => handleDelete(doc._id, doc.fileName)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No medical documents in this category.</p>
              <Button variant="primary" size="sm" onClick={() => setIsUploadOpen(true)}>
                Upload First Document
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 5. UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-primary-600" />
                  Upload Clinical Document (Prototype Mode)
                </h3>
                <p className="text-xs text-slate-500">
                  Register clinical scans, blood work, or doctor prescriptions.
                </p>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1.5">
                  Document Category
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                >
                  <option value="medical_report">Medical Report (Clinical Summary / Doctor Notes)</option>
                  <option value="prescription">Prescription (Current Medications & Regimen)</option>
                  <option value="scan">Scan / Imaging (MRI, CT, X-Ray, Ultrasound DICOM)</option>
                  <option value="lab_report">Lab Report (Blood Panel, Biopsy, Pathology)</option>
                  <option value="discharge_summary">Discharge Summary (Prior Hospitalizations)</option>
                  <option value="other">Other (Visa Invitation, Insurance Clearance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1.5">
                  Select File from Computer
                </label>
                <input
                  type="file"
                  onChange={handleFileSelection}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-xs bg-slate-50"
                />
              </div>

              <Input
                label="Document Display Name"
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. Bilateral Knee MRI Radiology Report 2026.pdf"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Simulated File Size"
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="e.g. 3.2 MB"
                />

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Access Permission Level
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    <option value="patient_and_doctor">Patient & Attending Doctors</option>
                    <option value="hospital_only">Hospital Administration Only</option>
                    <option value="private">Private (Only Me)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1.5">
                  Clinical Notes for Attending Surgeon (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pre-operative imaging conducted in NYC for robotic surgery clearance."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={uploading}
                  leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                >
                  Save to Secure Portal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalDocumentsPage;
