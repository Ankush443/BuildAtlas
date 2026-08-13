import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoverPage from './pages/DiscoverPage';
import ProjectPage from './pages/ProjectPage';
import ProjectEditorPage from './pages/ProjectEditorPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './features/auth/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute admin><AdminPage /></ProtectedRoute>} />
        <Route path="/projects/new" element={<ProtectedRoute><ProjectEditorPage /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute><ProjectEditorPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
