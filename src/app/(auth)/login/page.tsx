import { Metadata } from 'next';
import LoginViewPage from '@/features/auth/components/login-view';

export const metadata: Metadata = {
  title: 'Authentication | Log In',
  description: 'Log In page for authentication.'
};

export default async function Page() {
  return <LoginViewPage />;
} 