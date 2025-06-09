import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, JobApplication } from '../types';
import { jobsAPI, applicationsAPI } from '../lib/api';

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  getJobById: (id: string) => Promise<Job | undefined>;
  getJobsByEmployerId: (employerId: string) => Promise<Job[]>;
  getApplicationsByJobSeekerId: (jobSeekerId: string) => Promise<JobApplication[]>;
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>) => Promise<Job>;
  applyToJob: (jobId: string, jobSeekerId: string, coverLetter: string) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => Promise<boolean>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getJobById = async (id: string) => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJob(id);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch job');
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const getJobsByEmployerId = async (employerId: string) => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs({ employerId });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByJobSeekerId = async (jobSeekerId: string) => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getApplications({ jobSeekerId });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch applications');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>): Promise<Job> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await jobsAPI.createJob(jobData);
      
      // Update jobs list
      fetchJobs();
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create job. Please try again.');
      throw new Error('Job creation failed');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string, jobSeekerId: string, coverLetter: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const applicationData = {
        jobId,
        jobSeekerId,
        coverLetter
      };
      
      await applicationsAPI.createApplication(applicationData);
      
      // Refresh jobs data
      fetchJobs();
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Application failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string, 
    status: JobApplication['status']
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await applicationsAPI.updateApplication(applicationId, { status });
      
      // Refresh jobs data
      fetchJobs();
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs();
      setJobs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const value = {
    jobs,
    loading,
    error,
    getJobById,
    getJobsByEmployerId,
    getApplicationsByJobSeekerId,
    createJob,
    applyToJob,
    updateApplicationStatus
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};