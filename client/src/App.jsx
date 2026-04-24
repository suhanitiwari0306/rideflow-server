import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import Navbar           from './components/Navbar';
import Toast            from './components/Toast';
import ProtectedRoute   from './components/ProtectedRoute';
import HomePage         from './pages/HomePage';
import OnboardingPage   from './pages/OnboardingPage';
import RidersPage       from './pages/RidersPage';
import RiderPortalPage  from './pages/RiderPortalPage';
import DriverPortalPage from './pages/DriverPortalPage';
import AdminPage        from './pages/AdminPage';
import SignInPage       from './pages/SignInPage';
import SignUpPage       from './pages/SignUpPage';
import { setAuthToken } from './services/api';

// Keeps the axios Authorization header in sync with the Clerk session token
const AuthSync = () => {
  const { getToken, isSignedIn } = useAuth();
  useEffect(() => {
    if (!isSignedIn) { setAuthToken(null); return; }
    const sync = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    sync();
    const interval = setInterval(sync, 55 * 1000);
    return () => clearInterval(interval);
  }, [isSignedIn, getToken]);
  return null;
};

let toastId = 0;

const PORTAL_ROUTES = ['/rider', '/driver', '/admin'];

const App = () => {
  const location  = useLocation();
  const isHome    = location.pathname === '/';
  const isPortal  = PORTAL_ROUTES.includes(location.pathname);
  const isAuth    = ['/sign-in', '/sign-up', '/onboarding'].some((p) => location.pathname.startsWith(p));

  const [toasts, setToasts] = useState([]);
  const [theme,  setTheme]  = useState(
    () => localStorage.getItem('rideflow-theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('rideflow-theme', next);
      return next;
    });
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className={`app-shell${isPortal ? ' portal-mode' : ''}`}>
      <AuthSync />
      {!isPortal && !isAuth && (
        <Navbar
          theme={theme}
          onThemeToggle={toggleTheme}
          showThemeToggle={!isHome}
          showCta={isHome}
        />
      )}

      <main className={!isHome && !isPortal && !isAuth ? 'main-content' : ''}>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Onboarding — signed in, no role yet */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />

          {/* Role-protected portals */}
          <Route path="/rider" element={
            <ProtectedRoute requiredRole="rider">
              <RiderPortalPage theme={theme} onThemeToggle={toggleTheme} />
            </ProtectedRoute>
          } />
          <Route path="/driver" element={
            <ProtectedRoute requiredRole="driver">
              <DriverPortalPage theme={theme} onThemeToggle={toggleTheme} />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage theme={theme} onThemeToggle={toggleTheme} />
            </ProtectedRoute>
          } />
          <Route path="/riders" element={
            <ProtectedRoute requiredRole="admin">
              <RidersPage addToast={addToast} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;
