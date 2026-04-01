import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import Reminders from './pages/Reminders';
import DoseLog from './pages/DoseLog';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/dose-log" element={<DoseLog />} />
          <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;