import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ROLE_HOME = { rider: '/rider', driver: '/driver', admin: '/admin', manager: '/admin' };

const OnboardingPage = () => {
  const { user, isLoaded } = useUser();
  const { getToken }       = useAuth();
  const navigate           = useNavigate();
  const [error, setError]  = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;

    // Already has a role → send to their portal
    if (role) {
      navigate(ROLE_HOME[role] ?? '/', { replace: true });
      return;
    }

    // Read role chosen on the sign-up page
    const pending = sessionStorage.getItem('rideflow-pending-role');
    if (!pending || (pending !== 'rider' && pending !== 'driver')) {
      // No valid pending role — shouldn't normally happen, send home
      navigate('/', { replace: true });
      return;
    }

    sessionStorage.removeItem('rideflow-pending-role');

    const apply = async () => {
      try {
        const token = await getToken();
        await api.post('/auth/set-role', { role: pending }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await user.reload();
        navigate(ROLE_HOME[pending], { replace: true });
      } catch (e) {
        setError(e.response?.data?.message || 'Something went wrong. Please try again.');
      }
    };

    apply();
  }, [isLoaded, user]);

  if (error) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <div className="onboarding-logo">
            <span className="brand-ride">Ride</span>
            <span className="brand-flow">Flow</span>
          </div>
          <p className="onboarding-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-loading">
      <span className="spinner" />
      Setting up your account…
    </div>
  );
};

export default OnboardingPage;
