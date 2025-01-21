import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main 
        className="flex-grow"
        style={{
          backgroundImage: `linear-gradient(to bottom right, 
            rgba(0, 59, 145, 0.5), 
            rgba(23, 70, 158, 0.5), 
            rgba(0, 59, 145, 0.5)
          ), url('/bgjp.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#17469e',
            color: '#fff',
            border: '1px solid #ffc20e',
          },
          success: {
            duration: 3000,
            style: {
              background: '#003b91',
              border: '1px solid #ffc20e',
            },
          },
          error: {
            style: {
              background: '#ed1c24',
              border: '1px solid #ffc20e',
            },
          },
        }} 
      />
    </div>
  );
}