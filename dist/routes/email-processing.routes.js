import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleService } from '../services/google.service.js';
import { AIService } from '../services/ai.service.js';
import { FinancialDataService } from '../services/financial-data.service.js';
import { GmailAttachmentService } from '../services/gmail-attachment.service.js';
import { EncryptionService } from '../services/encryption.service.js';
import { convertBigIntToString } from '../config/utils.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
const prisma = new PrismaClient();
const encryptionService = new EncryptionService();
const aiService = new AIService();
const attachmentService = new GmailAttachmentService();
const financialDataService = new FinancialDataService(prisma, aiService);
const googleService = new GoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUrl: process.env.GOOGLE_REDIRECT_URL ||
        'http://localhost:5000/api/google/callback',
}, prisma, encryptionService);
/**
 * POST /api/email-processing/analyze/:userId
 * Analyze emails with attachments
 */
router.post('/analyze', authenticateJWT, async (req, res) => {
    try {
        // const { userId } = req.params;
        const userId = req.user?.userId;
        const { limit } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
            return;
        }
        console.log(`🚀 Starting financial email analysis for user: ${userId}`);
        googleService.setUserId(userId);
        // ✅ 1️⃣ Fetch user and expiry field
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { expire_email_processing: true, is_verified: true },
        });
        if (!user?.is_verified) {
            res.status(401).json({
                success: false,
                message: 'Please complete your KYC to continue.',
                error: 'KYC verification is pending.'
            });
        }
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        const now = new Date();
        const expiry = user.expire_email_processing
            ? new Date(user.expire_email_processing)
            : null;
        // ✅ 2️⃣ If expiry exists and is in the future → deny processing
        if (expiry && expiry > now) {
            const remainingDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            res.status(200).json({
                success: false,
                message: `Email analysis was already processed recently. Please try again after ${remainingDays} days.`,
            });
            return;
        }
        // ✅ 3️⃣ Set new expiry (90 days from now)
        const ninetyDays = 90 * 24 * 60 * 60 * 1000;
        const newExpiry = new Date(now.getTime() + ninetyDays);
        console.log(`🕒 Updated expire_email_processing to ${newExpiry.toISOString()}`);
        const loaded = await googleService.loadCredentialsFromDatabase(userId);
        if (!loaded) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated. Please connect Google account first.',
            });
            return;
        }
        const emailsResult = await googleService.listEmails(limit || 20);
        const emails = emailsResult.emails;
        console.log(`📧 Fetched ${emails.length} emails from Gmail`);
        const financialEmailIds = await aiService.classifyEmailSubjects(emails);
        console.log(`${financialEmailIds.length} Financial email found`);
        const filteredEmails = emails.filter(email => financialEmailIds.includes(email.id));
        // console.log("filteredEmails :: ",filteredEmails,)
        const results = [];
        for (const email of filteredEmails) {
            try {
                const lockedAttachmentsPassword = await aiService.guessPassword(email.subject, email.body, userId);
                console.log('Locked Attachment password :: ', lockedAttachmentsPassword);
                const emailWithAttachments = await googleService.getEmailWithAttachments(email.id, attachmentService, lockedAttachmentsPassword ? lockedAttachmentsPassword : undefined);
                // Process financial email (saves to Asset internally)
                const result = await financialDataService.processFinancialEmail(userId, {
                    emailId: email.id,
                    subject: email.subject,
                    from: email.from,
                    body: email.body,
                    date: email.date,
                    attachmentContents: emailWithAttachments.attachments,
                });
                // 🎯 Clean response with Asset data
                results.push({
                    emailId: email.id,
                    subject: email.subject,
                    attachmentCount: emailWithAttachments.attachments.length,
                    processed: result.processed,
                    transactionId: result.transactionId || null,
                    reason: result.reason || null,
                    // ✅ Email Analysis from AI
                    emailAnalysis: result.processed
                        ? {
                            extractedData: result.emailAnalysis?.extractedData,
                            summary: result.emailAnalysis?.summary,
                            keyPoints: result.emailAnalysis?.keyPoints,
                        }
                        : null,
                    // ✅ Attachment Analyses saved as Assets
                    attachmentAnalyses: result.attachmentAnalyses?.map((analysis) => ({
                        assetId: analysis.assetId, // 🆕 Asset ID
                        fileName: analysis.fileName,
                        fileSize: analysis.fileSize,
                        mimeType: analysis.mimeType,
                        // 🤖 AI Analysis Results
                        analysis: {
                            extractedData: analysis.analysis?.extractedData,
                            summary: analysis.analysis?.summary,
                            keyPoints: analysis.analysis?.keyPoints,
                            confidence: analysis.analysis?.extractedData?.confidence,
                            transactionType: analysis.analysis?.extractedData?.transactionType,
                            amount: analysis.analysis?.extractedData?.amount,
                            currency: analysis.analysis?.extractedData?.currency,
                            merchant: analysis.analysis?.extractedData?.merchant,
                            date: analysis.analysis?.extractedData?.date,
                        },
                    })) || [],
                    totalAttachments: result.totalAttachments || 0,
                    assetIds: result.assetIds || [], // 🆕 All Asset IDs
                });
            }
            catch (error) {
                console.error(`❌ Error processing email ${email.id}:`, error);
                results.push({
                    emailId: email.id,
                    subject: email.subject,
                    processed: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        const processed = results.filter((r) => r.processed).length;
        // update the expiry date in user schema
        await prisma.user.update({
            where: { id: userId },
            data: { expire_email_processing: newExpiry },
        });
        res.json({
            success: true,
            message: `Processed ${processed} out of ${results.length} emails`,
            results,
            summary: {
                totalEmails: results.length,
                processedEmails: processed,
                failedEmails: results.length - processed,
                totalAttachments: results.reduce((sum, r) => sum + (r.attachmentCount || 0), 0),
                totalAssetsCreated: results.reduce((sum, r) => sum + (r.assetIds?.length || 0), 0),
            },
        });
    }
    catch (error) {
        console.error('❌ Error analyzing emails:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze emails',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * GET /api/email-processing/financial-data/:userId
 * Get all financial data
 */
router.get('/financial-data/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, transactionType, limit, } = req.query;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
            return;
        }
        const data = await financialDataService.getFinancialData(userId, {
            startDate: startDate
                ? new Date(String(startDate))
                : undefined,
            endDate: endDate
                ? new Date(String(endDate))
                : undefined,
            transactionType: String(transactionType || ''),
            limit: parseInt(String(limit || 50)),
        });
        res.json({
            success: true,
            message: 'Financial data retrieved successfully',
            data: convertBigIntToString(data),
        });
    }
    catch (error) {
        console.error('Error fetching financial data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch financial data',
            error: error instanceof Error
                ? error.message
                : 'Unknown error',
        });
    }
});
// moved to vault.routes.ts
// router.get(
//     '/get-assets/',
//     authenticateJWT,
//     async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
//         try {
//             // console.log(req.user)
//             const assests = await financialDataService.getAssetsByUserId(req.user?.userId!)
//             return res.status(200).json({ success: true, data: assests });
//         } catch (error) {
//             console.error('Error fetching assets:', error);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch assets',
//                 error:
//                     error instanceof Error
//                         ? error.message
//                         : 'Unknown error',
//             });
//         }
//     }
// )
/**
 * GET /api/email-processing/search/:userId
 * Search financial data
 */
router.get('/search/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { q } = req.query;
        if (!userId || !q) {
            res.status(400).json({
                success: false,
                message: 'User ID and search query are required',
            });
            return;
        }
        const results = await financialDataService.searchFinancialData(userId, String(q));
        res.json({
            success: true,
            message: 'Search completed',
            data: results,
        });
    }
    catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search',
            error: error instanceof Error
                ? error.message
                : 'Unknown error',
        });
    }
});
/**
 * GET /api/email-processing/statistics/:userId
 * Get dashboard statistics
 */
router.get('/statistics/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { monthsBack } = req.query;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
            return;
        }
        const stats = await financialDataService.getStatistics(userId, parseInt(String(monthsBack || 6)));
        res.json({
            success: true,
            message: 'Statistics retrieved successfully',
            data: stats,
        });
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error instanceof Error
                ? error.message
                : 'Unknown error',
        });
    }
});
/**
 * GET /api/email-processing/transaction/:transactionId/:userId
 * Get transaction details with all documents
 */
router.get('/transaction/:transactionId/:userId', async (req, res) => {
    try {
        const { transactionId, userId } = req.params;
        if (!transactionId || !userId) {
            res.status(400).json({
                success: false,
                message: 'Transaction ID and User ID are required',
            });
            return;
        }
        const transaction = await financialDataService.getTransactionDetails(transactionId, userId);
        res.json({
            success: true,
            message: 'Transaction details retrieved successfully',
            data: transaction,
        });
    }
    catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction',
            error: error instanceof Error
                ? error.message
                : 'Unknown error',
        });
    }
});
/**
 * DELETE /api/email-processing/transaction/:transactionId/:userId
 * Delete transaction and related documents
 */
router.delete('/transaction/:transactionId/:userId', async (req, res) => {
    try {
        const { transactionId, userId } = req.params;
        if (!transactionId || !userId) {
            res.status(400).json({
                success: false,
                message: 'Transaction ID and User ID are required',
            });
            return;
        }
        const deleted = await financialDataService.deleteTransaction(transactionId, userId);
        if (deleted) {
            res.json({
                success: true,
                message: 'Transaction deleted successfully',
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete transaction',
            error: error instanceof Error
                ? error.message
                : 'Unknown error',
        });
    }
});
export default router;
//# sourceMappingURL=email-processing.routes.js.map