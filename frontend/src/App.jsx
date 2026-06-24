import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BrowseSkills from './pages/BrowseSkills';
import SkillDetails from './pages/SkillDetails';
import UserProfile from './pages/UserProfile';
import SearchUsers from './pages/SearchUsers';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import SwapRequests from './pages/dashboard/SwapRequests';
import Settings from './pages/dashboard/Settings';
import Notifications from './pages/dashboard/Notifications';

import AdminLayout, { AdminAnalytics, AdminUsers, AdminReviews, AdminActivity } from './pages/admin/AdminLayout';
import AdminSkills from './pages/admin/AdminSkills';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <SocketProvider>
              <NotificationProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: { borderRadius: '12px', padding: '12px 16px' },
                  }}
                />
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="skills" element={<BrowseSkills />} />
                    <Route path="skills/:id" element={<SkillDetails />} />
                    <Route path="users/:id" element={<UserProfile />} />
                    <Route path="search" element={<SearchUsers />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password/:token" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  <Route element={<ProtectedRoute><Layout showFooter={false} /></ProtectedRoute>}>
                    <Route path="chat" element={<Chat />} />
                    <Route path="chat/:userId" element={<Chat />} />
                  </Route>

                  <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<DashboardLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="requests" element={<SwapRequests />} />
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                  </Route>

                  <Route element={<ProtectedRoute adminOnly><Layout /></ProtectedRoute>}>
                    <Route path="admin" element={<AdminLayout />}>
                      <Route index element={<AdminAnalytics />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="skills" element={<AdminSkills />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="activity" element={<AdminActivity />} />
                    </Route>
                  </Route>
                </Routes>
              </NotificationProvider>
            </SocketProvider>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
