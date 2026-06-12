import express from 'express';
import { createAd, getMyAds, getAllAds, updateAd, deleteAd, rateOwner, getAdById } from '../controllers/adController.js';
import { authMiddleware, checkVerified, checkRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Explore active ads (all authenticated and verified users)
router.get('/', authMiddleware, checkVerified, getAllAds);

// Owner's listings
router.get('/my-ads', authMiddleware, checkRole(['owner', 'admin']), getMyAds);

// Fetch a single ad by ID
router.get('/:id', authMiddleware, checkVerified, getAdById);

// Create a new ad (only verified owners or admins)
router.post('/', authMiddleware, checkVerified, checkRole(['owner', 'admin']), createAd);

// Update/Modify listing
router.put('/:id', authMiddleware, checkVerified, updateAd);

// Delete listing
router.delete('/:id', authMiddleware, deleteAd);

// Rate landlord (Ranking Intelligent)
router.post('/feedback', authMiddleware, checkVerified, rateOwner);

// Image upload endpoint for ads (verified owners or admins)
router.post('/upload', authMiddleware, checkVerified, checkRole(['owner', 'admin']), upload.array('images'), (req, res) => {
  try {
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      res.status(400).json({ message: 'Aucun fichier téléchargé.' });
      return;
    }
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ imageUrls });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors du téléchargement.', error: error.message });
  }
});

export default router;
