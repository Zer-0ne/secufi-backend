import { Router } from 'express';
import { WillController } from '../controllers/will.controller';
import { authenticateJWT as authMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = Router();
const willController = new WillController();

// Configure multer for video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
    fileFilter: (req, file, cb) => {
      // Allow video files only
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(null, false); // Reject file without error
      }
    }
});

//  Will Builder Routes
router.get('/', authMiddleware, willController.getWill);
router.post('/', authMiddleware, willController.createWill);
router.put('/', authMiddleware, willController.updateWill);
router.delete('/', authMiddleware, willController.deleteWill);

//  Will Sections Routes
router.get('/sections', authMiddleware, willController.getWillSections);
router.get('/sections/:sectionType', authMiddleware, willController.getWillSection);
router.put('/sections/:sectionType', authMiddleware, willController.updateWillSection);

//  Will Beneficiaries Routes
router.get('/beneficiaries', authMiddleware, willController.getBeneficiaries);
router.post('/beneficiaries', authMiddleware, willController.addBeneficiary);
router.put('/beneficiaries/:beneficiaryId', authMiddleware, willController.updateBeneficiary);
router.delete('/beneficiaries/:beneficiaryId', authMiddleware, willController.deleteBeneficiary);

//  Video Witness Routes
router.get('/video-witness', authMiddleware, willController.getVideoWitnessStatus);
router.post('/video-witness/testator', authMiddleware, upload.single('video'), willController.uploadTestatorVideo);
router.post('/video-witness/witness1', authMiddleware, upload.single('video'), willController.uploadWitness1Video);
router.post('/video-witness/witness2', authMiddleware, upload.single('video'), willController.uploadWitness2Video);

//  Will Preview and Download
router.get('/preview', authMiddleware, willController.previewWill);
router.get('/download', authMiddleware, willController.downloadWill);

//  Will Status and Progress
router.get('/progress', authMiddleware, willController.getWillProgress);
router.post('/sign', authMiddleware, willController.signWill);

//  Legal Information Routes
router.get('/legal-info', authMiddleware, willController.getLegalInfo);
router.post('/legal-info', authMiddleware, willController.updateLegalInfo);

export default router;