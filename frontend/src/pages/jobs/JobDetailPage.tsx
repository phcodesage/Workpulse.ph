import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, DollarSign, Briefcase, Award, Check } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card, { CardContent, CardFooter } from '../../components/common/Card';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/useAuth';
import { useProfiles } from '../../context/useProfiles';
import { Job, JobApplication, Employer, JobSeeker, experienceLevels } from '../../types';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getJobById, applyToJob, loading, error: jobError } = useJobs();
  const { currentUser } = useAuth();
  const { getEmployerByUserId, getJobSeekerByUserId } = useProfiles();
  const navigate = useNavigate();
  
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<Job | null | undefined>(undefined);
  const [employerDetails, setEmployerDetails] = useState<Employer | null | undefined>(undefined);
  const [jobSeekerDetails, setJobSeekerDetails] = useState<JobSeeker | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        const fetchedJob = await getJobById(id);
        setJobDetails(fetchedJob);
      };
      fetchJob();
    }
  }, [id, getJobById]);

  useEffect(() => {
    if (jobDetails?.employerId) {
      const fetchEmployer = async () => {
        const fetchedEmployer = await getEmployerByUserId(jobDetails.employerId);
        setEmployerDetails(fetchedEmployer);
      };
      fetchEmployer();
    }
  }, [jobDetails?.employerId, getEmployerByUserId]);

  useEffect(() => {
    if (currentUser?.role === 'jobseeker' && currentUser.id) {
      const fetchJobSeeker = async () => {
        const fetchedJobSeeker = await getJobSeekerByUserId(currentUser.id);
        setJobSeekerDetails(fetchedJobSeeker);
      };
      fetchJobSeeker();
    }
  }, [currentUser?.id, currentUser?.role, getJobSeekerByUserId]);

  if (loading && jobDetails === undefined) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20 pb-12 flex justify-center items-center">
          <p>Loading job details...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (jobError && jobDetails === undefined) { // Check if jobDetails is still undefined to ensure error is for initial load
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20 pb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-lg text-gray-600 mb-8">{jobError}</p>
          <Link to="/find-jobs">
            <Button variant="primary">Browse All Jobs</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!jobDetails) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The job you're looking for does not exist or has been removed.
            </p>
            <Link to="/find-jobs">
              <Button variant="primary">Browse All Jobs</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const experienceLevelLabel = jobDetails ? (experienceLevels.find(el => el.value === jobDetails.experienceLevel)?.label || jobDetails.experienceLevel) : '';
  
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!jobDetails) {
      setApplicationError('Job details not loaded.');
      return;
    }

    if (!coverLetter) {
      setApplicationError('Please provide a cover letter');
      return;
    }

    if (currentUser.role === 'jobseeker') {
      if (!jobSeekerDetails) {
        setApplicationError('Job seeker profile not loaded. Please complete your profile or wait for it to load.');
        return;
      }
      const success = await applyToJob(jobDetails.id, jobSeekerDetails.id, coverLetter);
      if (success) {
        setApplicationSuccess(true);
        setShowApplyForm(false);
        setCoverLetter('');
      } else {
        setApplicationError('Failed to submit application. Please try again.');
      }
    } else {
      // This case should ideally not be reached if UI prevents non-jobseekers from applying
      setApplicationError('Only job seekers can apply to jobs.');
      // No return here, error will be displayed, and form submission stops
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const alreadyApplied = jobDetails && jobDetails.applications.some(
    (app: JobApplication) => jobSeekerDetails && app.jobSeekerId === jobSeekerDetails.id
  );
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link 
              to="/find-jobs" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to Jobs
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardContent>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{jobDetails?.title}</h1>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Posted {jobDetails?.createdAt ? formatDate(jobDetails.createdAt) : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={jobDetails?.experienceLevel === 'entry' ? 'info' : 
                              jobDetails?.experienceLevel === 'intermediate' ? 'warning' : 'success'}
                      size="md"
                    >
                      {experienceLevelLabel}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="flex items-center mr-4"><MapPin className="h-5 w-5 mr-1" /> {jobDetails?.remote ? 'Remote' : jobDetails?.location}</p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="flex items-center"><DollarSign className="h-5 w-5 mr-1" /> {jobDetails?.paymentType === 'hourly' ? `$${jobDetails?.budget}/hr` : `$${jobDetails?.budget}`}</p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{jobDetails?.category}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Award className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="flex items-center mr-4"><Award className="h-5 w-5 mr-1" /> {experienceLevelLabel}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails?.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="default">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: jobDetails?.description || '' }} />
                  </div>
                </CardContent>
                
                <CardFooter>
                  {currentUser?.role === 'jobseeker' && (
                    <>
                      {alreadyApplied ? (
                        <div className="flex items-center text-green-600">
                          <Check className="h-5 w-5 mr-2" />
                          <span>You've already applied to this job</span>
                        </div>
                      ) : applicationSuccess ? (
                        <div className="flex items-center text-green-600">
                          <Check className="h-5 w-5 mr-2" />
                          <span>Application submitted successfully!</span>
                        </div>
                      ) : (
                        <Button 
                          variant="primary" 
                          onClick={() => setShowApplyForm(!showApplyForm)}
                        >
                          {showApplyForm ? 'Cancel' : 'Apply Now'}
                        </Button>
                      )}
                    </>
                  )}
                  
                  {!currentUser && (
                    <Link to="/login">
                      <Button variant="primary">
                        Login to Apply
                      </Button>
                    </Link>
                  )}
                  
                  {currentUser?.role === 'employer' && (
                    <div className="text-gray-600">
                      You are logged in as an employer. Switch to a job seeker account to apply.
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              {showApplyForm && (
                <Card>
                  <CardContent>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply to {jobDetails?.title}</h2>
                    
                    {applicationError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {applicationError}
                      </div>
                    )}
                    
                    <form onSubmit={handleApply}>
                      <div className="mb-4">
                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Letter
                        </label>
                        <textarea
                          id="coverLetter"
                          rows={6}
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Introduce yourself and explain why you're a good fit for this job..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          variant="primary"
                          isLoading={loading}
                        >
                          Submit Application
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h2>
                  
                  {employerDetails && (
                    <>
                      {employerDetails.logo && (
                        <div className="flex justify-center mb-4">
                          <img 
                            src={employerDetails.logo} 
                            alt={employerDetails.companyName} 
                            className="h-20 w-auto object-contain"
                          />
                        </div>
                      )}
                      
                      <h3 className="text-md font-medium text-gray-900 mb-2">{employerDetails.companyName}</h3>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        <p className="mb-2"><strong>Industry:</strong> {employerDetails.industry}</p>
                        <p className="mb-2"><strong>Company Size:</strong> {employerDetails.companySize}</p>
                        <p className="mb-2"><strong>Location:</strong> {employerDetails.location}</p>
                        {employerDetails.website && (
                          <p className="mb-2">
                            <strong>Website:</strong>{' '}
                            <a 
                              href={employerDetails.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {employerDetails.website.replace(/^https?:\/\//, '')}
                            </a>
                          </p>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600">{employerDetails.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Job ID:</strong> {jobDetails?.id}
                    </p>
                    <p className="mb-2">
                      <strong>Applications:</strong> {jobDetails?.applications?.length || 0}
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong>{' '}
                      <span className={`font-medium ${jobDetails?.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                        {jobDetails?.status ? (jobDetails.status.charAt(0).toUpperCase() + jobDetails.status.slice(1)) : 'N/A'}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default JobDetailPage;