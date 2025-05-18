import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employer, JobSeeker } from '../types';
import { employers as mockEmployers, jobSeekers as mockJobSeekers } from '../data/mockData';

interface ProfileContextType {
  employers: Employer[];
  jobSeekers: JobSeeker[];
  loading: boolean;
  error: string | null;
  getEmployerByUserId: (userId: string) => Employer | undefined;
  getJobSeekerByUserId: (userId: string) => JobSeeker | undefined;
  createEmployerProfile: (profile: Omit<Employer, 'id'>) => Promise<Employer>;
  createJobSeekerProfile: (profile: Omit<JobSeeker, 'id'>) => Promise<JobSeeker>;
  updateEmployerProfile: (id: string, profile: Partial<Employer>) => Promise<boolean>;
  updateJobSeekerProfile: (id: string, profile: Partial<JobSeeker>) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [employers, setEmployers] = useState<Employer[]>(mockEmployers);
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>(mockJobSeekers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmployerByUserId = (userId: string) => {
    return employers.find(employer => employer.userId === userId);
  };

  const getJobSeekerByUserId = (userId: string) => {
    return jobSeekers.find(jobSeeker => jobSeeker.userId === userId);
  };

  const createEmployerProfile = async (profile: Omit<Employer, 'id'>): Promise<Employer> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmployer: Employer = {
        ...profile,
        id: String(employers.length + 1)
      };
      
      setEmployers(prevEmployers => [...prevEmployers, newEmployer]);
      
      return newEmployer;
    } catch (err) {
      setError('Failed to create employer profile. Please try again.');
      throw new Error('Profile creation failed');
    } finally {
      setLoading(false);
    }
  };

  const createJobSeekerProfile = async (profile: Omit<JobSeeker, 'id'>): Promise<JobSeeker> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJobSeeker: JobSeeker = {
        ...profile,
        id: String(jobSeekers.length + 1)
      };
      
      setJobSeekers(prevJobSeekers => [...prevJobSeekers, newJobSeeker]);
      
      return newJobSeeker;
    } catch (err) {
      setError('Failed to create job seeker profile. Please try again.');
      throw new Error('Profile creation failed');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployerProfile = async (id: string, profile: Partial<Employer>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const employerIndex = employers.findIndex(emp => emp.id === id);
      
      if (employerIndex === -1) {
        setError('Employer profile not found');
        return false;
      }
      
      const updatedEmployers = [...employers];
      updatedEmployers[employerIndex] = {
        ...updatedEmployers[employerIndex],
        ...profile
      };
      
      setEmployers(updatedEmployers);
      
      return true;
    } catch (err) {
      setError('Failed to update employer profile. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateJobSeekerProfile = async (id: string, profile: Partial<JobSeeker>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const jobSeekerIndex = jobSeekers.findIndex(js => js.id === id);
      
      if (jobSeekerIndex === -1) {
        setError('Job seeker profile not found');
        return false;
      }
      
      const updatedJobSeekers = [...jobSeekers];
      updatedJobSeekers[jobSeekerIndex] = {
        ...updatedJobSeekers[jobSeekerIndex],
        ...profile
      };
      
      setJobSeekers(updatedJobSeekers);
      
      return true;
    } catch (err) {
      setError('Failed to update job seeker profile. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

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