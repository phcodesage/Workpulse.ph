# WorkPulse.ph Backend Server

This is the backend API for WorkPulse.ph, a job marketplace platform built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/workpulse
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

3. Run the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (requires authentication)
- `GET /api/auth/logout` - Logout user (requires authentication)

### User Routes
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication, only own profile)
- `DELETE /api/users/:id` - Delete user (requires authentication, only own profile)

### Profile Routes
- `GET /api/profiles/me` - Get current user's profile (requires authentication)
- `POST /api/profiles/employer` - Create/update employer profile (requires employer role)
- `POST /api/profiles/jobseeker` - Create/update job seeker profile (requires jobseeker role)
- `GET /api/profiles/employers` - Get all employers
- `GET /api/profiles/jobseekers` - Get all job seekers
- `GET /api/profiles/employers/:id` - Get employer by ID
- `GET /api/profiles/jobseekers/:id` - Get job seeker by ID

### Job Routes
- `GET /api/jobs` - Get all jobs (supports filtering and pagination)
- `POST /api/jobs` - Create a new job (requires employer role)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (requires employer role, only own jobs)
- `DELETE /api/jobs/:id` - Delete job (requires employer role, only own jobs)

### Job Application Routes
- `GET /api/applications` - Get all applications for user (job seeker: applied jobs, employer: received applications)
- `POST /api/jobs/:jobId/applications` - Apply for a job (requires jobseeker role)
- `GET /api/applications/:id` - Get application by ID (requires authentication, only own applications)
- `PUT /api/applications/:id` - Update application status (requires employer role, only for received applications)

### Message Routes
- `GET /api/messages` - Get all messages for current user (requires authentication)
- `POST /api/messages` - Send a message (requires authentication)
- `GET /api/messages/unread` - Get unread message count (requires authentication)
- `GET /api/messages/:userId` - Get conversation with specific user (requires authentication)
- `DELETE /api/messages/:id` - Delete a message (requires authentication, only own messages)

## Models

- **User**: Basic user information and authentication
- **Employer**: Company profile for employers
- **JobSeeker**: Professional profile for job seekers
- **Job**: Job listings posted by employers
- **JobApplication**: Applications submitted by job seekers
- **Message**: Messages between users

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```
