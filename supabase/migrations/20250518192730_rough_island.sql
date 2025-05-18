/*
  # Initial Schema for WorkPulse.ph

  1. New Tables
    - `users` - Stores user account information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `employers` - Stores employer profiles
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company_name` (text)
      - `industry` (text)
      - `company_size` (text)
      - `location` (text)
      - `website` (text, optional)
      - `description` (text)
      - `logo` (text, optional)
    
    - `job_seekers` - Stores job seeker profiles
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `skills` (text[])
      - `experience` (integer)
      - `hourly_rate` (integer, optional)
      - `availability` (text)
      - `location` (text)
      - `photo` (text, optional)
      - `bio` (text)
    
    - `education` - Stores educational background
      - `id` (uuid, primary key)
      - `job_seeker_id` (uuid, references job_seekers)
      - `institution` (text)
      - `degree` (text)
      - `field_of_study` (text)
      - `from_date` (date)
      - `to_date` (date, optional)
      - `current` (boolean)
      - `description` (text, optional)
    
    - `work_history` - Stores work experience
      - `id` (uuid, primary key)
      - `job_seeker_id` (uuid, references job_seekers)
      - `company` (text)
      - `position` (text)
      - `from_date` (date)
      - `to_date` (date, optional)
      - `current` (boolean)
      - `description` (text)
    
    - `jobs` - Stores job listings
      - `id` (uuid, primary key)
      - `employer_id` (uuid, references employers)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `skills` (text[])
      - `experience_level` (text)
      - `payment_type` (text)
      - `budget` (integer)
      - `location` (text)
      - `remote` (boolean)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `job_applications` - Stores job applications
      - `id` (uuid, primary key)
      - `job_id` (uuid, references jobs)
      - `job_seeker_id` (uuid, references job_seekers)
      - `cover_letter` (text)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `messages` - Stores user messages
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references users)
      - `receiver_id` (uuid, references users)
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('employer', 'jobseeker')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  industry text NOT NULL,
  company_size text NOT NULL,
  location text NOT NULL,
  website text,
  description text NOT NULL,
  logo text,
  UNIQUE(user_id)
);

CREATE TABLE job_seekers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  skills text[] NOT NULL,
  experience integer NOT NULL,
  hourly_rate integer,
  availability text NOT NULL CHECK (availability IN ('full-time', 'part-time', 'contract')),
  location text NOT NULL,
  photo text,
  bio text NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id uuid REFERENCES job_seekers(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text NOT NULL,
  from_date date NOT NULL,
  to_date date,
  current boolean NOT NULL DEFAULT false,
  description text
);

CREATE TABLE work_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id uuid REFERENCES job_seekers(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  from_date date NOT NULL,
  to_date date,
  current boolean NOT NULL DEFAULT false,
  description text NOT NULL
);

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  skills text[] NOT NULL,
  experience_level text NOT NULL CHECK (experience_level IN ('entry', 'intermediate', 'expert')),
  payment_type text NOT NULL CHECK (payment_type IN ('hourly', 'fixed')),
  budget integer NOT NULL,
  location text NOT NULL,
  remote boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  job_seeker_id uuid REFERENCES job_seekers(id) ON DELETE CASCADE,
  cover_letter text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Employers can read own profile" ON employers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Job seekers can read own profile" ON job_seekers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Job seekers can read and manage own education" ON education
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = education.job_seeker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Job seekers can read and manage own work history" ON work_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = work_history.job_seeker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read active jobs" ON jobs
  FOR SELECT USING (status = 'open');

CREATE POLICY "Employers can manage own jobs" ON jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employers
      WHERE id = jobs.employer_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Job seekers can create applications" ON job_applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = job_applications.job_seeker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own applications" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_seekers
      WHERE id = job_applications.job_seeker_id
      AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM jobs
      WHERE id = job_applications.job_id
      AND employer_id IN (
        SELECT id FROM employers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);