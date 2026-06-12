import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignupProvider } from './context/SignupContext';
import Login from './screens/Login';
import ProfileSelection from './screens/ProfileSelection';
import StudentVerification from './screens/StudentVerification';
import LandlordVerification from './screens/LandlordVerification';
import PersonalDetails from './screens/PersonalDetails';
import Dashboard from './screens/Dashboard';

export default function App() {
  return (
    <SignupProvider>
      <Router>
        <div className="selection:bg-secondary/10 selection:text-secondary">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profiles" element={<ProfileSelection />} />
            <Route path="/verify-student" element={<StudentVerification />} />
            <Route path="/verify-landlord" element={<LandlordVerification />} />
            <Route path="/personal-details" element={<PersonalDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </SignupProvider>
  );
}
