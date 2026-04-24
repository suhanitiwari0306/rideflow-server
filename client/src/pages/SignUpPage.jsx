import { useState } from 'react';
import { SignUp } from '@clerk/react';

const ROLES = [
  { id: 'rider',  icon: '🚗', title: "I'm a Rider",  desc: 'Request rides and track your trips.'    },
  { id: 'driver', icon: '🛞', title: "I'm a Driver", desc: 'Accept rides and track your earnings.' },
];

const SignUpPage = () => {
  // If a role was already picked (e.g. Clerk redirects to /sign-up/verify-*), skip step 1
  const [step, setStep] = useState(
    () => sessionStorage.getItem('rideflow-pending-role') ? 'signup' : 'role'
  );

  const pick = (roleId) => {
    sessionStorage.setItem('rideflow-pending-role', roleId);
    setStep('signup');
  };

  if (step === 'signup') {
    return (
      <div className="auth-page">
        <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/onboarding" />
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-logo">
          <span className="brand-ride">Ride</span>
          <span className="brand-flow">Flow</span>
        </div>
        <h1 className="onboarding-heading">How will you use RideFlow?</h1>
        <p className="onboarding-sub">Choose your role to get started.</p>
        <div className="onboarding-roles">
          {ROLES.map((r) => (
            <button key={r.id} className="role-card" onClick={() => pick(r.id)}>
              <span className="role-icon">{r.icon}</span>
              <h3 className="role-title">{r.title}</h3>
              <p className="role-desc">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
