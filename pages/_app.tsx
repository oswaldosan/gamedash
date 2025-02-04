import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/layout/Layout';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Lista de rutas públicas
    const publicRoutes = ['/fullscreen-leaderboard', '/check', '/login'];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }

    // Verificar acceso de admin
    const requiresAdmin = router.pathname === '/games';
    if (isAuthenticated && requiresAdmin && user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, router, user]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => (
    <Layout>
      {page}
    </Layout>
  ));

  return (
    <AuthProvider>
      <AppProvider>
        <AuthGuard>
          {getLayout(<Component {...pageProps} />)}
        </AuthGuard>
      </AppProvider>
    </AuthProvider>
  );
}