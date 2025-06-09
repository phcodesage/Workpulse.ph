import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { Job } from '../../types';
import Badge from '../common/Badge';
import Card, { CardContent, CardFooter } from '../common/Card';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <Link to={`/jobs/${job.id}`} className="hover:text-blue-600 transition-colors">
              {job.title}
            </Link>
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {job.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="primary" size="sm">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="default" size="sm">+{job.skills.length - 4} more</Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.remote ? 'Remote' : job.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>
              {job.paymentType === 'hourly' ? `$${job.budget}/hr` : `$${job.budget} fixed price`}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center bg-gray-50">
        <div className="flex items-center">
          <Badge 
            variant={job.experienceLevel === 'entry' ? 'info' : 
                   job.experienceLevel === 'intermediate' ? 'warning' : 'success'}
          >
            {job.experienceLevel === 'entry' ? 'Entry Level' : 
             job.experienceLevel === 'intermediate' ? 'Intermediate' : 'Expert'}
          </Badge>
        </div>
        <Link 
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;