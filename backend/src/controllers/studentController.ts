import { Response } from 'express';
import Ad from '../models/Ad.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

export const searchAds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { budget, distance, transport, query } = req.query;

    const filter: any = { status: 'ACTIVE' };

    // Smart search filter 1: Budget (Price range)
    if (budget) {
      filter.price = { $lte: Number(budget) };
    }

    // Smart search filter 2: Distance from Faculty (in km)
    if (distance) {
      filter.distanceToFac = { $lte: Number(distance) };
    }

    // Smart search filter 3: Transport access (highly critical for 80% without cars)
    if (transport === 'true' || transport === '1') {
      filter.transportAccess = true;
    }

    // Text search on title/description/location
    if (query) {
      filter.$or = [
        { title: { $regex: String(query), $options: 'i' } },
        { location: { $regex: String(query), $options: 'i' } },
        { description: { $regex: String(query), $options: 'i' } }
      ];
    }

    const ads = await Ad.find(filter)
      .populate('owner', 'firstName lastName phone email rankingScore')
      .sort({ createdAt: -1 });

    res.status(200).json({ ads });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la recherche intelligente.', error: error.message });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications.', error: error.message });
  }
};

export const markNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }

    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Notifications marquées comme lues.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

export const toggleSaveAd = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }
    const { adId } = req.body;
    if (!adId) {
      res.status(400).json({ message: 'Identifiant de l\'annonce requis.' });
      return;
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }
    const savedAds = user.savedAds || [];
    const index = savedAds.indexOf(adId);
    if (index > -1) {
      savedAds.splice(index, 1);
    } else {
      savedAds.push(adId);
    }
    user.savedAds = savedAds;
    await user.save();
    res.status(200).json({ message: 'Favoris mis à jour.', savedAds: user.savedAds });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des favoris.', error: error.message });
  }
};

export const getSavedAds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }
    const user = await User.findById(req.user._id).populate({
      path: 'savedAds',
      populate: { path: 'owner', select: 'firstName lastName phone email rankingScore rankingCount' }
    });
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }
    res.status(200).json({ savedAds: user.savedAds || [] });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des favoris.', error: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }
    const user = await User.findById(req.user._id);
    const activeAdsCount = await Ad.countDocuments({ status: 'ACTIVE' });
    const savedAdsCount = user?.savedAds?.length || 0;
    const unreadNotificationsCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.status(200).json({
      activeAdsCount,
      savedAdsCount,
      unreadNotificationsCount
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.', error: error.message });
  }
};
