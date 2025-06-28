import { SignIn } from '@clerk/clerk-react';

const Login = () => (
  <div style={{ padding: '2rem' }}>
    <SignIn path="/login" routing="path" />
  </div>
);
