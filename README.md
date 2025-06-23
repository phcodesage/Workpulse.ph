# Workpulse

A modern job listing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (JWT)
- Job postings and applications
- User profiles and dashboards
- Search and filter job listings
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
   ```bash
   git clone [your-repository-url]
   cd Workpulse.ph
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Copy `.env.example` to `.env` in both `server` and `frontend` directories
   - Update the values according to your setup

## Running the Application

### Development Mode

1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
# In the frontend directory
npm run build

# In the server directory
npm start
```

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Project Structure

```
Workpulse.ph/
├── frontend/          # React frontend
├── server/            # Express backend
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
