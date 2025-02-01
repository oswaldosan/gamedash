import { ReactNode } from 'react';

interface FullscreenLayoutProps {
  children: ReactNode;
}

export default function FullscreenLayout({ children }: FullscreenLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 