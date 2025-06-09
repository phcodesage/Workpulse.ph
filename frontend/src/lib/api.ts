import axios, { InternalAxiosRequestConfig, AxiosError, AxiosHeaders } from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://workpulse-ph.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define payload types for API requests
interface JobPayload {
  title: string;
  description: string;
  company?: string;
  location?: string;
  salary?: number | string;
  jobType?: string;
}

interface ProfilePayload {
  name?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  experience?: Array<{ title: string; company: string; years: number }>;
  education?: Array<{ degree: string; institution: string; year: number }>;
  website?: string;
}

interface ApplicationPayload {
  jobId: string;
  applicantId?: string;
  coverLetter?: string;
  resumeUrl?: string;
  status?: string;
}

interface MessagePayload {
  recipientId: string;
  content: string;
  senderId?: string;
}

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers = new AxiosHeaders();
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string, role: 'employer' | 'jobseeker') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  }
};

// Jobs API
export const jobsAPI = {
  getJobs: async (filters = {}) => {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },
  getJob: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  createJob: async (jobData: JobPayload) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },
  updateJob: async (id: string, jobData: Partial<JobPayload>) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },
  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};

// Profiles API
export const profilesAPI = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },
  updateProfile: async (profileData: Partial<ProfilePayload>) => {
    const response = await api.put('/profiles', profileData);
    return response.data;
  }
};

// Applications API
export const applicationsAPI = {
  getApplications: async (filters = {}) => {
    const response = await api.get('/applications', { params: filters });
    return response.data;
  },
  getApplication: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  createApplication: async (applicationData: ApplicationPayload) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },
  updateApplication: async (id: string, applicationData: Partial<ApplicationPayload>) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  }
};

// Messages API
export const messagesAPI = {
  // Get all messages for the current user
  getAllMessages: async () => {
    const response = await api.get('/messages');
    return response.data;
  },
  // Get conversation with a specific user
  getConversation: async (userId: string) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },
  // Send a message
  sendMessage: async (messageData: MessagePayload) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },
  // Get unread message count
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread');
    return response.data;
  }
};

export default api;
