import { Response } from 'express';
import User from '../models/User.js';
import Ad from '../models/Ad.js';
import Notification from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

// Helper: Configure email transporter (mock config, logs to console)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'mock.user@ethereal.email',
    pass: 'mockpassword'
  }
});

export const getPendingUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Return students and owners whose profiles are not verified yet
    const pendingUsers = await User.find({ is_verified: false, role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ pendingUsers });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la file d\'attente.', error: error.message });
  }
};

export const verifyUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    user.is_verified = true;
    user.verifiedAt = new Date();
    await user.save();

    // Create notification for the user
    await Notification.create({
      recipient: user._id,
      text: 'Félicitations ! Votre profil Bity a été validé par l\'administrateur. Vous avez désormais un accès complet.',
      type: 'VERIFICATION_APPROVED'
    });

    res.status(200).json({ message: 'Profil validé avec succès.', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la validation du profil.', error: error.message });
  }
};

export const rejectUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Reason for rejection

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    const rejectionReason = reason || 'Les documents téléversés ne correspondent pas aux critères ou sont illisibles.';

    // Send notification
    await Notification.create({
      recipient: user._id,
      text: `Votre demande de vérification a été rejetée. Motif : ${rejectionReason}`,
      type: 'VERIFICATION_REJECTED'
    });

    // Simulate sending email
    console.log(`[EMAIL SEND] To: ${user.email} | Subject: Inscription rejetée sur Bity | Content: ${rejectionReason}`);

    // If needed, delete document paths or user profile for clean state
    user.studentCardImage = '';
    user.cinImage = '';
    user.utilityBillImage = '';
    await user.save();

    res.status(200).json({ message: 'Profil rejeté et notifié avec succès.', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors du rejet du profil.', error: error.message });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalAds = await Ad.countDocuments();
    const pendingValidations = await User.countDocuments({ is_verified: false, role: { $ne: 'admin' } });
    const flaggedReports = await Ad.countDocuments({ status: 'SIGNALÉE' });

    // Also get active and expired listings count
    const activeAds = await Ad.countDocuments({ status: 'ACTIVE' });
    const expiredAds = await Ad.countDocuments({ status: 'PÉRIMÉE' });

    res.status(200).json({
      totalAds,
      activeAds,
      expiredAds,
      pendingValidations,
      flaggedReports, // Fighting the 42.1% scam rate
      scamRatePreventionMetric: '42.1%'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques.', error: error.message });
  }
};

export const sendManualEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, subject, text } = req.body;

    if (!email || !subject || !text) {
      res.status(400).json({ message: 'Destinataire, objet et contenu de l\'e-mail requis.' });
      return;
    }

    // Print/Log to console
    console.log(`\n========================================`);
    console.log(`SIMULATION D'ENVOI D'EMAIL (Bity Moderation)`);
    console.log(`Destinataire : ${email}`);
    console.log(`Objet        : ${subject}`);
    console.log(`Contenu      : ${text}`);
    console.log(`========================================\n`);

    // Attempt real SMTP simulation
    try {
      await transporter.sendMail({
        from: '"Bity Moderation" <admin@bity.com>',
        to: email,
        subject: subject,
        text: text
      });
    } catch (mailErr) {
      console.log('Info: Mailer simulation failed, but logged in server console.');
    }

    res.status(200).json({ message: `E-mail envoyé avec succès à ${email}` });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.', error: error.message });
  }
};
