import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/useAuth';
import { useJobs } from '../context/JobContext';
import { useProfiles } from '../context/useProfiles';
import { Job, Employer, JobSeeker } from '../types';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const DashboardPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const { getEmployerByUserId, getJobSeekerByUserId } = useProfiles();
  
  // State for user profile data
  const [userProfile, setUserProfile] = useState<Employer | JobSeeker | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser || !currentUser.id) return;
      
      try {
        setLoadingProfile(true);
        if (currentUser.role === 'employer') {
          const employerProfile = await getEmployerByUserId(currentUser.id);
          setUserProfile(employerProfile || null);
        } else {
          const jobSeekerProfile = await getJobSeekerByUserId(currentUser.id);
          setUserProfile(jobSeekerProfile || null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchProfile();
  }, [currentUser, getEmployerByUserId, getJobSeekerByUserId]);
  
  useEffect(() => {
    // Get 5 most recent jobs
    const sortedJobs = [...jobs].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setRecentJobs(sortedJobs.slice(0, 5));
  }, [jobs]);
  
  // Redirect if user is not logged in
  if (!authLoading && !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  const isLoading = authLoading || jobsLoading || loadingProfile;
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLoading ? 'Loading...' : `Welcome, ${currentUser?.name}`}
            </h1>
            <p className="mt-2 text-gray-600">
              {currentUser?.role === 'employer' ? 'Manage your job listings and applications' : 'Find your next opportunity'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width on desktop */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {currentUser?.role === 'employer' ? (
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {jobs.filter(job => job.employerId === currentUser?.id).length}
                          </div>
                          <div className="text-sm text-gray-600">Active Job Listings</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            {jobs.filter(job => job.employerId === currentUser?.id)
                              .reduce((total, job) => total + job.applications.length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Total Applications</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-purple-600">
                            {jobs.filter(job => job.employerId === currentUser?.id)
                              .reduce((total, job) => total + job.applications.filter(app => app.status === 'pending').length, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Pending Reviews</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {jobs.length}
                          </div>
                          <div className="text-sm text-gray-600">Available Jobs</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            {jobs.reduce((total, job) => {
                              const applied = job.applications.some(app => app.jobSeekerId === currentUser?.id);
                              return applied ? total + 1 : total;
                            }, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Jobs Applied</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-yellow-600">
                            {jobs.reduce((total, job) => {
                              const interviews = job.applications.filter(
                                app => app.jobSeekerId === currentUser?.id && app.status === 'reviewing'
                              ).length;
                              return total + interviews;
                            }, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Interview Invites</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
              
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Jobs</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/jobs'}
                  >
                    View All
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.length > 0 ? (
                      recentJobs.map(job => (
                        <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <Badge variant={job.remote ? 'info' : 'primary'}>
                              {job.remote ? 'Remote' : 'On-site'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{job.category}</p>
                          <p className="text-gray-600 text-sm">{job.location}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => window.location.href = `/jobs/${job.id}`}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No jobs available at the moment.</p>
                    )}
                  </div>
                )}
              </Card>
            </div>
            
            {/* Sidebar - 1/3 width on desktop */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {currentUser?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">{currentUser?.name}</h3>
                    <p className="text-gray-600 text-sm capitalize">{currentUser?.role}</p>
                    
                    {userProfile && (
                      <div className="mt-3 text-sm text-gray-600">
                        {currentUser?.role === 'employer' ? (
                          <>
                            <p><span className="font-medium">Company:</span> {(userProfile as Employer).companyName}</p>
                            <p><span className="font-medium">Industry:</span> {(userProfile as Employer).industry}</p>
                          </>
                        ) : (
                          <>
                            <p><span className="font-medium">Title:</span> {(userProfile as JobSeeker).title}</p>
                            <p><span className="font-medium">Skills:</span> {(userProfile as JobSeeker).skills.join(', ')}</p>
                          </>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => window.location.href = '/profile'}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
              
              <Card>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {currentUser?.role === 'employer' ? (
                    <>
                      <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={() => window.location.href = '/jobs/create'}
                      >
                        Post a New Job
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={() => window.location.href = '/applications'}
                      >
                        Review Applications
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={() => window.location.href = '/jobs'}
                      >
                        Browse Jobs
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={() => window.location.href = '/applications'}
                      >
                        My Applications
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => window.location.href = '/messages'}
                  >
                    Messages
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default DashboardPage;
