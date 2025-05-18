import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, DollarSign, Briefcase, Award, Check } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card, { CardContent, CardFooter } from '../../components/common/Card';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useProfiles } from '../../context/ProfileContext';
import { experienceLevels } from '../../types';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getJobById, applyToJob, loading, error } = useJobs();
  const { currentUser } = useAuth();
  const { getEmployerByUserId, getJobSeekerByUserId } = useProfiles();
  const navigate = useNavigate();
  
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  
  const job = id ? getJobById(id) : undefined;
  const employer = job ? getEmployerByUserId(job.employerId) : undefined;
  const jobSeeker = currentUser?.role === 'jobseeker' ? getJobSeekerByUserId(currentUser.id) : undefined;
  
  if (!job) {
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
  
  const experienceLevelLabel = experienceLevels.find(el => el.value === job.experienceLevel)?.label || job.experienceLevel;
  
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!jobSeeker) {
      setApplicationError('You need to complete your profile before applying');
      return;
    }
    
    if (!coverLetter) {
      setApplicationError('Please provide a cover letter');
      return;
    }
    
    const success = await applyToJob(job.id, jobSeeker.id, coverLetter);
    
    if (success) {
      setApplicationSuccess(true);
      setShowApplyForm(false);
      setCoverLetter('');
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const alreadyApplied = job.applications.some(
    app => jobSeeker && app.jobSeekerId === jobSeeker.id
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
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Posted on {formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={job.experienceLevel === 'entry' ? 'info' : 
                              job.experienceLevel === 'intermediate' ? 'warning' : 'success'}
                      size="md"
                    >
                      {experienceLevelLabel}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{job.remote ? 'Remote' : job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                      <span>
                        {job.paymentType === 'hourly' ? `$${job.budget}/hr` : `$${job.budget} fixed price`}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Award className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{experienceLevelLabel}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="primary" size="md">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                    <div className="prose prose-blue max-w-none text-gray-600">
                      <p>{job.description}</p>
                    </div>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply to {job.title}</h2>
                    
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
                  
                  {employer && (
                    <>
                      {employer.logo && (
                        <div className="flex justify-center mb-4">
                          <img 
                            src={employer.logo} 
                            alt={employer.companyName} 
                            className="h-20 w-auto object-contain"
                          />
                        </div>
                      )}
                      
                      <h3 className="text-md font-medium text-gray-900 mb-2">{employer.companyName}</h3>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        <p className="mb-2"><strong>Industry:</strong> {employer.industry}</p>
                        <p className="mb-2"><strong>Company Size:</strong> {employer.companySize}</p>
                        <p className="mb-2"><strong>Location:</strong> {employer.location}</p>
                        {employer.website && (
                          <p className="mb-2">
                            <strong>Website:</strong>{' '}
                            <a 
                              href={employer.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {employer.website.replace(/^https?:\/\//, '')}
                            </a>
                          </p>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600">{employer.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Job ID:</strong> {job.id}
                    </p>
                    <p className="mb-2">
                      <strong>Applications:</strong> {job.applications.length}
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong>{' '}
                      <span className={`font-medium ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
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