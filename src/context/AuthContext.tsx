import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Department, AcademicYear } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  resultsVersion: number;
  triggerRefresh: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveOnboarding: (
    department: Department,
    currentYear: AcademicYear,
    technologies: string[],
    interests: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Student>) => Promise<{ success: boolean; error?: string }>;
  unreadNotificationsCount: number;
  refreshNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [resultsVersion, setResultsVersion] = useState<number>(0);

  const triggerRefresh = () => {
    setResultsVersion((v) => v + 1);
    calculateUnreadNotifications(user);
  };

  const calculateUnreadNotifications = (currentUser?: Student | null) => {
    const student = currentUser !== undefined ? currentUser : user;
    const notifications = StorageService.getNotifications(student?.id);
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadNotificationsCount(unread);
  };

  useEffect(() => {
    try {
      const current = StorageService.getCurrentStudent();
      setUser(current);
      calculateUnreadNotifications(current);
    } catch (err) {
      console.error('Error loading session from storage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate brief network latency for realistic feel and loading state verification
    await new Promise((resolve) => setTimeout(resolve, 350));
    try {
      const res = StorageService.login(email, password);
      if (res.success && res.student) {
        setUser(res.student);
        calculateUnreadNotifications(res.student);
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    try {
      const res = StorageService.register(name, email, password);
      if (res.success && res.student) {
        setUser(res.student);
        calculateUnreadNotifications(res.student);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    StorageService.logout();
    setUser(null);
    setUnreadNotificationsCount(0);
  };

  const saveOnboarding = async (
    department: Department,
    currentYear: AcademicYear,
    technologies: string[],
    interests: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to save onboarding information.' };
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    try {
      const updated = StorageService.saveOnboarding(user.id, department, currentYear, technologies, interests);
      setUser(updated);
      calculateUnreadNotifications(updated);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save onboarding.';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Student>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User is not authenticated' };
    }

    try {
      const updated = StorageService.updateProfile(user.id, updates);
      setUser(updated);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      return { success: false, error: message };
    }
  };

  const refreshNotifications = () => {
    calculateUnreadNotifications(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        saveOnboarding,
        updateProfile,
        unreadNotificationsCount,
        refreshNotifications,
        resultsVersion,
        triggerRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
