import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, JobApplication } from '../types';
import { jobs as mockJobs, applications as mockApplications } from '../data/mockData';

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  getJobById: (id: string) => Job | undefined;
  getJobsByEmployerId: (employerId: string) => Job[];
  getApplicationsByJobSeekerId: (jobSeekerId: string) => JobApplication[];
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
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  const getJobsByEmployerId = (employerId: string) => {
    return jobs.filter(job => job.employerId === employerId);
  };

  const getApplicationsByJobSeekerId = (jobSeekerId: string) => {
    const jobApplications: JobApplication[] = [];
    
    jobs.forEach(job => {
      job.applications.forEach(application => {
        if (application.jobSeekerId === jobSeekerId) {
          jobApplications.push(application);
        }
      });
    });
    
    return jobApplications;
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>): Promise<Job> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob: Job = {
        ...jobData,
        id: String(jobs.length + 1),
        createdAt: new Date(),
        applications: []
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      
      return newJob;
    } catch (err) {
      setError('Failed to create job. Please try again.');
      throw new Error('Job creation failed');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string, jobSeekerId: string, coverLetter: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      
      if (jobIndex === -1) {
        setError('Job not found');
        return false;
      }
      
      // Check if already applied
      const alreadyApplied = jobs[jobIndex].applications.some(
        app => app.jobSeekerId === jobSeekerId
      );
      
      if (alreadyApplied) {
        setError('You have already applied to this job');
        return false;
      }
      
      const newApplication: JobApplication = {
        id: String(Date.now()),
        jobId,
        jobSeekerId,
        coverLetter,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Add application to the job
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = {
        ...updatedJobs[jobIndex],
        applications: [...updatedJobs[jobIndex].applications, newApplication]
      };
      
      setJobs(updatedJobs);
      
      return true;
    } catch (err) {
      setError('Application failed. Please try again.');
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
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let found = false;
      
      const updatedJobs = jobs.map(job => {
        const updatedApplications = job.applications.map(app => {
          if (app.id === applicationId) {
            found = true;
            return { ...app, status };
          }
          return app;
        });
        
        return { ...job, applications: updatedApplications };
      });
      
      if (!found) {
        setError('Application not found');
        return false;
      }
      
      setJobs(updatedJobs);
      
      return true;
    } catch (err) {
      setError('Update failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

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