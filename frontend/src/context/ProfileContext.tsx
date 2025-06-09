import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Employer, JobSeeker } from '../types';
import { profilesAPI } from '../lib/api';

export interface ProfileContextType {
  employers: Employer[];
  jobSeekers: JobSeeker[];
  loading: boolean;
  error: string | null;
  getEmployerByUserId: (userId: string) => Promise<Employer | undefined>;
  getJobSeekerByUserId: (userId: string) => Promise<JobSeeker | undefined>;
  createEmployerProfile: (profile: Omit<Employer, 'id'>) => Promise<Employer>;
  createJobSeekerProfile: (profile: Omit<JobSeeker, 'id'>) => Promise<JobSeeker>;
  updateEmployerProfile: (id: string, profile: Partial<Employer>) => Promise<boolean>;
  updateJobSeekerProfile: (id: string, profile: Partial<JobSeeker>) => Promise<boolean>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmployerByUserId = async (userId: string) => {
    try {
      setLoading(true);
      const response = await profilesAPI.getProfile(userId);
      if (response.data.role === 'employer') {
        return response.data;
      }
      return undefined;
    } catch (err: unknown) {
      let message = 'Failed to fetch employer profile';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const getJobSeekerByUserId = async (userId: string) => {
    try {
      setLoading(true);
      const response = await profilesAPI.getProfile(userId);
      if (response.data.role === 'jobseeker') {
        return response.data;
      }
      return undefined;
    } catch (err: unknown) {
      let message = 'Failed to fetch job seeker profile';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const createEmployerProfile = async (profile: Omit<Employer, 'id'>): Promise<Employer> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profilesAPI.updateProfile({
        ...profile,
        role: 'employer'
      });
      
      // Refresh profiles
      fetchProfiles();
      
      return response.data;
    } catch (err: unknown) {
      let message = 'Failed to create employer profile. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      throw new Error('Profile creation failed');
    } finally {
      setLoading(false);
    }
  };

  const createJobSeekerProfile = async (profile: Omit<JobSeeker, 'id'>): Promise<JobSeeker> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profilesAPI.updateProfile({
        ...profile,
        role: 'jobseeker'
      });
      
      // Refresh profiles
      fetchProfiles();
      
      return response.data;
    } catch (err: unknown) {
      let message = 'Failed to create job seeker profile. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      throw new Error('Profile creation failed');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployerProfile = async (id: string, profile: Partial<Employer>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await profilesAPI.updateProfile({
        id,
        ...profile,
        role: 'employer'
      });
      
      // Refresh profiles
      fetchProfiles();
      
      return true;
    } catch (err: unknown) {
      let message = 'Failed to update employer profile. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateJobSeekerProfile = async (id: string, profile: Partial<JobSeeker>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await profilesAPI.updateProfile({
        id,
        ...profile,
        role: 'jobseeker'
      });
      
      // Refresh profiles
      fetchProfiles();
      
      return true;
    } catch (err: unknown) {
      let message = 'Failed to update job seeker profile. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          message = axiosError.response.data.error;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would have separate endpoints for this
      // For now, we'll assume we get all profiles and filter them
      
      // This is a placeholder - in a real app, we'd have proper endpoints
      const employersResponse = await fetch('/api/employers');
      const jobSeekersResponse = await fetch('/api/jobseekers');
      
      if (employersResponse.ok) {
        const employersData = await employersResponse.json();
        setEmployers(employersData);
      }
      
      if (jobSeekersResponse.ok) {
        const jobSeekersData = await jobSeekersResponse.json();
        setJobSeekers(jobSeekersData);
      }
    } catch (err: unknown) {
      let message = 'Failed to fetch profiles';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Load profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const value = {
    employers,
    jobSeekers,
    loading,
    error,
    getEmployerByUserId,
    getJobSeekerByUserId,
    createEmployerProfile,
    createJobSeekerProfile,
    updateEmployerProfile,
    updateJobSeekerProfile
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};