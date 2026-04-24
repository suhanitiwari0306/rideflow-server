import { SignIn } from '@clerk/react';

const SignInPage = () => (
  <div className="auth-page">
    <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/onboarding" />
  </div>
);

export default SignInPage;
