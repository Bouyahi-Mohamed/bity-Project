import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ExplorePage from './pages/Explore';
import PropertyDetailsPage from './pages/PropertyDetails';
import SavedPage from './pages/Saved';
import NotificationsPage from './pages/Notifications';
import ProfilePage from './pages/Profile';
import ReviewPage from './pages/Review';
import StudentProfilePage from './pages/StudentProfile';
import ChatPage from './pages/Chat';
import { syncAuthFromUrl } from './lib/api';

export default function App() {
  // Sync URL parameters for cross-origin authentication
  syncAuthFromUrl();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/student/:id" element={<StudentProfilePage />} />
          <Route path="/owner/:id" element={<StudentProfilePage />} />
          <Route path="/user/:id" element={<StudentProfilePage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/messages/:ownerId/:propertyId" element={<ChatPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
