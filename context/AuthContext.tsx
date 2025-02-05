import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (name: string, password: string, isAdmin: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

// Contraseña genérica para edecanes
const EDECAN_PASSWORD = 'yummies123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (name: string, password: string, isAdmin: boolean): Promise<boolean> => {
    if (isAdmin) {
      if (name === 'admin' && password === 'Boost@123') {
        const adminUser: User = { name: 'Administrador', role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
    } else {
      // Verificar solo la contraseña genérica para edecanes
      if (password === EDECAN_PASSWORD) {
        const edecanUser: User = { name, role: 'edecan' };
        setUser(edecanUser);
        localStorage.setItem('user', JSON.stringify(edecanUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 