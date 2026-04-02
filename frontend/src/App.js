import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import AddEditMedication from './pages/AddEditMedication';
import Reminders from './pages/Reminders';
import DoseLog from './pages/DoseLog';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import MedicationCatalogue from './pages/MedicationCatalogue';
import NotificationTemplates from './pages/NotificationTemplates';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="medications" element={<Medications />} />
          <Route path="medications/add" element={<AddEditMedication />} />
          <Route path="medications/edit/:id" element={<AddEditMedication />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="dose-log" element={<DoseLog />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="catalogue" element={<MedicationCatalogue />} />
          <Route path="templates" element={<NotificationTemplates />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/medications" element={<Navigate to="/user/medications" replace />} />
        <Route path="/reminders" element={<Navigate to="/user/reminders" replace />} />
        <Route path="/dose-log" element={<Navigate to="/user/dose-log" replace />} />
        <Route path="/profile" element={<Navigate to="/user/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;