import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerDashboard from './pages/OwnerDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Notifications from './pages/Notifications';
import PublishListing from './pages/PublishListing';
import Profile from './pages/Profile';
import SearchReview from './pages/SearchReview';
import StudentProfile from './pages/StudentProfile';

import EditListing from './pages/EditListing';
import { syncAuthFromUrl } from './lib/api';

export default function App() {
  // Sync URL parameters for cross-origin authentication
  syncAuthFromUrl();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<OwnerDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/publish" element={<PublishListing />} />
        <Route path="/edit/:id" element={<EditListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchReview />} />
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}

