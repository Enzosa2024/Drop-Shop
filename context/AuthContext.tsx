import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: Partial<User>, password: string) => Promise<{success: boolean, message?: string}>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = storageService.getCurrentUser();
        if (storedUser) {
          const allUsers = storageService.getUsers();
          const freshUser = allUsers.find(u => u.id === storedUser.id);
          if (freshUser && !freshUser.blocked) {
            setUser({...freshUser, isOnline: true});
          } else {
             storageService.saveCurrentUser(null);
          }
        }
      } catch (e) {
        console.error("Session restore failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); 
    const users = storageService.getUsers();
    // Simple password check mock (in real app, verify hash)
    const found = users.find(u => (u.email === email || u.username === email) && !u.blocked);
    
    if (found) {
      const userWithStatus = { ...found, isOnline: true };
      setUser(userWithStatus);
      storageService.saveCurrentUser(userWithStatus);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (data: Partial<User>, password: string): Promise<{success: boolean, message?: string}> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = storageService.getUsers();
    if (users.find(u => u.email === data.email || u.username === data.username)) {
      setIsLoading(false);
      return { success: false, message: 'Usuário ou e-mail já cadastrado.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name || 'User',
      username: data.username || `user${Date.now()}`,
      email: data.email || '',
      role: data.role || UserRole.BUYER,
      blocked: false,
      isOnline: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'U')}&background=random`,
      createdAt: Date.now(),
      bio: '',
      address: '',
      phone: '',
      ...data
    } as User;

    users.push(newUser);
    storageService.saveUsers(users);
    setUser(newUser);
    storageService.saveCurrentUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    if (user) {
        // Mark offline logic if needed
    }
    setUser(null);
    storageService.saveCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    storageService.saveCurrentUser(updatedUser);
    
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storageService.saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);