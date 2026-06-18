import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './Landing';
import Auth from './Auth';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import CounsellorDashboard from './CounsellorDashboard';
import ParentDashboard from './ParentDashboard';
import PlacementDashboard from './PlacementDashboard';
import NotFound from './NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { useAuthStore } from './store/useAuthStore';

function AppRoutes() {
  const navigate = useNavigate();
  const { initialize, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLandingEnter = () => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.role}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Landing onEnter={handleLandingEnter} />} />
      <Route path="/login" element={<Auth onLogin={() => {}} />} />
      <Route path="/onboarding" element={<Auth onLogin={() => {}} />} />
      
      {/* Protected Dashboard Views wrapped in responsive Layout */}
      <Route element={<Layout />}>
        <Route 
          path="/dashboard/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/faculty" 
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/counsellor" 
          element={
            <ProtectedRoute allowedRoles={['counsellor']}>
              <CounsellorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/parent" 
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/placement" 
          element={
            <ProtectedRoute allowedRoles={['placement']}>
              <PlacementDashboard />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}