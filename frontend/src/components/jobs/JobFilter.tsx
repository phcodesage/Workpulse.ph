import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { jobCategories, experienceLevels } from '../../types';
import Button from '../common/Button';

interface JobFilterProps {
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category: string;
  experienceLevel: string;
  remote: boolean;
  search: string;
}

const JobFilter: React.FC<JobFilterProps> = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    experienceLevel: '',
    remote: false,
    search: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      experienceLevel: '',
      remote: false,
      search: '',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Find Jobs</h2>
        <button
          className="md:hidden flex items-center text-gray-600 hover:text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              <X className="h-5 w-5 mr-1" />
              <span>Close</span>
            </>
          ) : (
            <>
              <Filter className="h-5 w-5 mr-1" />
              <span>Filter</span>
            </>
          )}
        </button>
      </div>
      
      <div className={`bg-white rounded-lg shadow-md p-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by keyword, skill, title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {jobCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                {experienceLevels.map((level, index) => (
                  <option key={index} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={filters.remote}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                Remote Only
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button type="submit" variant="primary">
              Apply Filters
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Clear All
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFilter;