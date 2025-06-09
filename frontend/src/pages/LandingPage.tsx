import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Check, Briefcase, Users, Globe } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { jobCategories } from '../types';

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                  Connect with the Best Online Talent Worldwide
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Find remote jobs or hire skilled professionals for your business needs. OnlineJobs connects employers with talented job seekers from around the globe.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button variant="secondary" size="lg">
                      Find Talent
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="bg-white hover:bg-gray-100">
                      Find Work
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Remote team working together" 
                  className="rounded-lg shadow-xl max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Job Search Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Job</h2>
                <p className="text-lg text-gray-600">
                  Browse thousands of remote and local job opportunities
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search jobs, skills, or companies"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <Link to="/find-jobs">
                    <Button variant="primary" size="lg">
                      Search Jobs
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-10">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Popular Categories</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {jobCategories.slice(0, 8).map((category, index) => (
                    <Link 
                      key={index} 
                      to={`/find-jobs?category=${encodeURIComponent(category)}`}
                      className="bg-gray-50 hover:bg-gray-100 transition-colors text-center px-4 py-3 rounded-md text-sm font-medium text-gray-700"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose OnlineJobs</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We connect talented professionals with great employers worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Quality Jobs</h3>
                <p className="text-gray-600">
                  Access thousands of job opportunities from vetted employers across various industries.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-600 mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Skilled Professionals</h3>
                <p className="text-gray-600">
                  Hire from a pool of talented professionals with verified skills and experience.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Network</h3>
                <p className="text-gray-600">
                  Connect with employers and job seekers from around the world for diverse opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* For Employers Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">For Employers</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Find the perfect candidates for your business needs, whether you need full-time employees or project-based freelancers.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">Post job listings and reach thousands of skilled professionals</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">Browse profiles and invite candidates to apply</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">Communicate directly with applicants through our platform</span>
                  </li>
                </ul>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Start Hiring Today
                  </Button>
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Employer reviewing applications" 
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* For Job Seekers Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.pexels.com/photos/3194518/pexels-photo-3194518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Job seeker working remotely" 
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">For Job Seekers</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Find remote or local opportunities that match your skills and career goals. Take control of your professional journey.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">Create a professional profile to showcase your skills</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">Browse and apply to thousands of remote and local jobs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">Get hired and work on your own terms</span>
                  </li>
                </ul>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Find Work Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of employers and job seekers who have already found success on OnlineJobs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Create an Account
                </Button>
              </Link>
              <Link to="/find-jobs">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default LandingPage;