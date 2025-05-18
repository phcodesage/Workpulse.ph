import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import JobCard from '../../components/jobs/JobCard';
import JobFilter, { FilterOptions } from '../../components/jobs/JobFilter';
import { useJobs } from '../../context/JobContext';
import { Job } from '../../types';

const JobsListPage: React.FC = () => {
  const { jobs } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const location = useLocation();
  
  // Get filter options from URL parameters when the page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || '';
    const search = params.get('search') || '';
    const experienceLevel = params.get('experienceLevel') || '';
    const remote = params.get('remote') === 'true';
    
    // Apply initial filters
    handleFilterChange({
      category,
      search,
      experienceLevel,
      remote
    });
  }, [location.search, jobs]);
  
  const handleFilterChange = (filters: FilterOptions) => {
    let results = [...jobs];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by category
    if (filters.category) {
      results = results.filter(job => job.category === filters.category);
    }
    
    // Filter by experience level
    if (filters.experienceLevel) {
      results = results.filter(job => job.experienceLevel === filters.experienceLevel);
    }
    
    // Filter by remote
    if (filters.remote) {
      results = results.filter(job => job.remote);
    }
    
    setFilteredJobs(results);
  };
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <JobFilter onFilter={handleFilterChange} />
            </div>
            
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
                <p className="text-gray-600 mt-1">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
              </div>
              
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search filters or check back later for new opportunities.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default JobsListPage;