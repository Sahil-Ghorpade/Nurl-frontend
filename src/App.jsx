import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastProvider } from './components/ui/ToastProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import DeletedLinks from './pages/DeletedLinks';
import LinkAnalytics from './pages/LinkAnalytics';
import NotFound from './pages/NotFound';
import LinkExpired from './pages/LinkExpired';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes accessible by anyone */}
              <Route path="/" element={<Home />} />
              <Route path="/link-expired" element={<LinkExpired />} />

              {/* Guest-only routes (redirects to /dashboard if logged in) */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected routes (requires authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/links" element={<Links />} />
                <Route path="/links/deleted" element={<DeletedLinks />} />
                <Route path="/links/:id/analytics" element={<LinkAnalytics />} />
              </Route>

              {/* Catch-all → 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;