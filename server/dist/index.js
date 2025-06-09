"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
// Load env vars
dotenv_1.default.config();
// Route files
const auth_1 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const applications_1 = __importDefault(require("./routes/applications"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const messages_1 = __importDefault(require("./routes/messages"));
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
// Enable CORS
app.use((0, cors_1.default)());
// Mount routers
app.use('/api/auth', auth_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/profile', profiles_1.default);
app.use('/api/messages', messages_1.default);
// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to WorkPulse.ph API' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
});
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
