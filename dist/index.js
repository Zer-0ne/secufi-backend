// import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth, prisma } from './config/database.js';
import googleRouter from './routes/google.routes.js';
import userRouter from './routes/user.routes.js';
import emailProcessingRouter from './routes/email-processing.routes.js';
import smsRouter from './routes/sms.route.js';
import vaultRoutes from './routes/vault.routes.js';
import familyRoutes from './routes/family.routes.js';
import assetSharingRouter from './routes/asset-sharing.routes.js';
import deviceInfoRouter from './routes/get-device-info.route.js';
// Load environment variables
config();
console.log(process.env.GOOGLE_CLIENT_ID);
const app = express();
// ============================================
// Middleware
// ============================================
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.use((req, res, next) => {
    const startTime = Date.now();
    // Capture original send function
    const originalSend = res.send;
    // Override send function to log response
    res.send = function (body) {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${statusCode} - ${duration}ms`);
        return originalSend.call(this, body);
    };
    next();
});
// ============================================
// Routes
// ============================================
// Health check with database status
app.get('/health', async (req, res) => {
    const dbHealth = await checkDatabaseHealth();
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: dbHealth
    });
});
// Database test route
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await prisma.$queryRaw `SELECT current_database(), current_user, version()`;
        res.json({
            success: true,
            message: 'Database connection successful',
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});
// API Routes
app.use('/', deviceInfoRouter);
app.use('/api/google', googleRouter);
app.use('/api/users', userRouter);
app.use('/api/sms', smsRouter);
app.use('/api/email-processing', emailProcessingRouter);
app.use('/api/family', familyRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/asset-sharing', assetSharingRouter);
// ============================================
// Error Handling
// ============================================
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// ============================================
// Server Startup
// ============================================
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();
        // Start server
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log('🚀 Server Started Successfully');
            console.log('='.repeat(50));
            console.log(`   Port: ${PORT}`);
            console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   Health Check: http://localhost:${PORT}/health`);
            console.log(`   DB Test: http://localhost:${PORT}/api/db-test`);
            console.log('='.repeat(50) + '\n');
        });
    }
    catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing server...');
    await disconnectDatabase();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('\nSIGINT received. Closing server...');
    await disconnectDatabase();
    process.exit(0);
});
// Start the server
startServer();
//# sourceMappingURL=index.js.map