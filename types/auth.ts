export type UserRole = 'admin' | 'edecan';

export interface User {
  name: string;
  role: UserRole;
} 