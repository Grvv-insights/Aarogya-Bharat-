import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { TreatmentDetailPage } from './pages/TreatmentDetailPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { MedicalCitiesPage } from './pages/MedicalCitiesPage';
import { TravelAssistancePage } from './pages/TravelAssistancePage';
import { CostEstimatorPage } from './pages/CostEstimatorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MedicalDocumentsPage } from './pages/MedicalDocumentsPage';
import { TravelPlannerPage } from './pages/TravelPlannerPage';
import { CityDetailPage } from './pages/CityDetailPage';
import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { InfoPages } from './pages/InfoPages';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />

            {/* Treatment Flow */}
            <Route path="treatments" element={<TreatmentsPage />} />
            <Route path="treatments/:slug" element={<TreatmentDetailPage />} />

            {/* Hospital Flow */}
            <Route path="hospitals" element={<HospitalsPage />} />
            <Route path="hospitals/:id" element={<HospitalDetailPage />} />

            {/* Doctor Flow */}
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetailPage />} />

            {/* Consultation & Journey Request */}
            <Route path="consultation" element={<ConsultationPage />} />
            <Route path="plan-journey" element={<ConsultationPage />} />

            {/* Destinations & Travel Concierge */}
            <Route path="cities" element={<MedicalCitiesPage />} />
            <Route path="cities/:cityName" element={<CityDetailPage />} />
            <Route path="travel-assistance" element={<TravelAssistancePage />} />
            <Route path="cost-estimator" element={<CostEstimatorPage />} />

            {/* Authentication */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Role Protected Dashboards */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/documents"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MedicalDocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/travel"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <TravelPlannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['provider', 'admin']}>
                  <ProviderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Informational and Legal Routes */}
            <Route path="about" element={<InfoPages />} />
            <Route path="contact" element={<InfoPages />} />
            <Route path="privacy" element={<InfoPages />} />
            <Route path="terms" element={<InfoPages />} />
            <Route path="medical-disclaimer" element={<InfoPages />} />
            <Route path="for-hospitals" element={<InfoPages />} />
            <Route path="for-patients" element={<InfoPages />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
