import { Response } from 'express';
import Ad from '../models/Ad.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export const createAd = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, price, location, distanceToFac, transportAccess, image, images } = req.body;

    // Transparency Rule: price and location are strictly mandatory
    if (!title || price === undefined || !location) {
      res.status(400).json({ message: 'Le titre, le prix et la localisation précise sont obligatoires.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }

    const newAd = new Ad({
      title,
      description: description || '',
      price: Number(price),
      location,
      distanceToFac: distanceToFac ? Number(distanceToFac) : undefined,
      transportAccess: transportAccess === 'true' || transportAccess === true,
      images: images && images.length > 0 ? images : (image ? [image] : []),
      owner: req.user._id,
      status: 'ACTIVE'
    });

    await newAd.save();

    // Notification Logic: Alert students of new ads near their faculty (by matching location terms or university names)
    const matchedStudents = await User.find({
      role: 'student',
      is_verified: true
    });

    // Create notifications for students who might be interested
    for (const student of matchedStudents) {
      const studentUniv = student.university ? student.university.toLowerCase() : '';
      const adLoc = location.toLowerCase();
      const adTitle = title.toLowerCase();

      // If the student's university is mentioned in the ad's location or title
      if (studentUniv && (adLoc.includes(studentUniv) || adTitle.includes(studentUniv) || adLoc.includes('tunis') || adLoc.includes('ariana'))) {
        await Notification.create({
          recipient: student._id,
          text: `Nouvelle annonce disponible proche de votre université : "${title}" à ${location} pour ${price} DT/mois.`,
          type: 'NEW_AD',
          relatedAd: newAd._id
        });
      }
    }

    res.status(201).json({ message: 'Annonce publiée avec succès.', ad: newAd });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'annonce.', error: error.message });
  }
};

export const getMyAds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }

    const ads = await Ad.find({ owner: req.user._id });
    res.status(200).json({ ads });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

export const getAllAds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ads = await Ad.find({ status: 'ACTIVE' }).populate('owner', 'firstName lastName phone email rankingScore');
    res.status(200).json({ ads });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

export const updateAd = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, location, distanceToFac, transportAccess, image, images, status } = req.body;

    const ad = await Ad.findById(id);
    if (!ad) {
      res.status(404).json({ message: 'Annonce non trouvée.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }

    // Check ownership (Admin can also update/moderate)
    if (ad.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette annonce.' });
      return;
    }

    const oldPrice = ad.price;
    const newPrice = price !== undefined ? Number(price) : oldPrice;

    if (title) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (price !== undefined) ad.price = newPrice;
    if (location) ad.location = location;
    if (distanceToFac !== undefined) ad.distanceToFac = Number(distanceToFac);
    if (transportAccess !== undefined) ad.transportAccess = transportAccess === 'true' || transportAccess === true;
    if (images && images.length > 0) ad.images = images;
      else if (image) ad.images = [image];
    if (status) ad.status = status;

    await ad.save();

    // Logic to alert students of price drops
    if (newPrice < oldPrice) {
      // Find all students who have logged interest or just alert student users
      const students = await User.find({ role: 'student', is_verified: true });
      for (const student of students) {
        await Notification.create({
          recipient: student._id,
          text: `Baisse de prix ! L'annonce "${ad.title}" est passée de ${oldPrice} DT à ${newPrice} DT.`,
          type: 'PRICE_DROP',
          relatedAd: ad._id
        });
      }
    }

    res.status(200).json({ message: 'Annonce mise à jour.', ad });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.', error: error.message });
  }
};

export const deleteAd = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      res.status(404).json({ message: 'Annonce non trouvée.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }

    // Only owner or admin can delete
    if (ad.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette annonce.' });
      return;
    }

    await Ad.findByIdAndDelete(id);
    res.status(200).json({ message: 'Annonce supprimée avec succès.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la suppression.', error: error.message });
  }
};

// Ranking feedback logic: Updates the Intelligent Ranking of the owner
export const rateOwner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ownerId, rating } = req.body; // rating is a number from 1 to 5

    if (!ownerId || !rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Identifiant du propriétaire et note valide (1-5) requis.' });
      return;
    }

    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== 'owner') {
      res.status(404).json({ message: 'Propriétaire non trouvé.' });
      return;
    }

    // Recompute Intelligent Ranking Score
    const oldCount = owner.rankingCount || 0;
    const oldScore = owner.rankingScore || 5.0;

    const newCount = oldCount + 1;
    const newScore = ((oldScore * oldCount) + Number(rating)) / newCount;

    owner.rankingScore = parseFloat(newScore.toFixed(2));
    owner.rankingCount = newCount;
    await owner.save();

    res.status(200).json({
      message: 'Merci pour votre avis. Le score intelligent a été recalculé.',
      rankingScore: owner.rankingScore,
      rankingCount: owner.rankingCount
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de l\'évaluation.', error: error.message });
  }
};

export const getAdById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id).populate('owner', 'firstName lastName phone email rankingScore rankingCount');
    if (!ad) {
      res.status(404).json({ message: 'Annonce non trouvée.' });
      return;
    }
    res.status(200).json({ ad });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'annonce.', error: error.message });
  }
};
