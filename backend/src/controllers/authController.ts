import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bity_super_secret_key_12345';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, username, phone, language, role, university } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ message: 'Email, mot de passe et rôle sont obligatoires.' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Cet e-mail est déjà utilisé.' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let studentCardImage = '';
    let cinImage = '';
    let utilityBillImage = '';

    if (role === 'student') {
      if (!files || !files['studentCardImage']) {
        res.status(400).json({ message: 'La carte étudiante est obligatoire pour les étudiants.' });
        return;
      }
      studentCardImage = `/uploads/${files['studentCardImage'][0].filename}`;
      if (!university) {
        res.status(400).json({ message: 'Veuillez renseigner votre université.' });
        return;
      }
    } else if (role === 'owner') {
      if (!files || !files['cinImage'] || !files['utilityBillImage']) {
        res.status(400).json({ message: 'La CIN et un justificatif de propriété (STEG/SONEDE) sont obligatoires pour les propriétaires.' });
        return;
      }
      cinImage = `/uploads/${files['cinImage'][0].filename}`;
      utilityBillImage = `/uploads/${files['utilityBillImage'][0].filename}`;
    } else if (role === 'admin') {
      res.status(403).json({ message: 'L\'inscription d\'un administrateur par cette voie est interdite.' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      username: username || email.split('@')[0],
      phone: phone || '',
      language: language || 'fr',
      role,
      is_verified: false, // Default is unverified
      studentCardImage,
      university,
      cinImage,
      utilityBillImage
    });

    await newUser.save();

    res.status(201).json({
      message: 'Inscription réussie. Votre profil est en attente de vérification par l\'administrateur.',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        is_verified: newUser.is_verified
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Veuillez saisir votre e-mail et votre mot de passe.' });
      return;
    }

    // Special logic for super-admin (always exists or is seeded on startup)
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Identifiants incorrects.' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(400).json({ message: 'Identifiants incorrects.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Decide redirection path based on role
    let redirectUrl = '';
    if (user.role === 'student') {
      redirectUrl = 'http://localhost:3001/explore'; // bity-espace-etudiant
    } else if (user.role === 'owner') {
      redirectUrl = 'http://localhost:3002/dashboard'; // bity-espace-propritaire
    } else if (user.role === 'admin') {
      redirectUrl = 'http://localhost:3003/dashboard'; // bity-espace-admin
    }

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      redirectUrl,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        language: user.language,
        university: user.university,
        rankingScore: user.rankingScore,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.', error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non authentifié.' });
      return;
    }
    
    res.status(200).json({ user: req.user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }
    const { firstName, lastName, phone, university, interests, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (university !== undefined) user.university = university;
    if (interests !== undefined) user.interests = interests;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.status(200).json({ message: 'Profil mis à jour avec succès.', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.', error: error.message });
  }
};

export const updateAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé.' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: 'Aucun fichier téléchargé.' });
      return;
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();
    res.status(200).json({ message: 'Photo de profil mise à jour.', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil.', error: error.message });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, role } = req.query;
    const filter: any = {};
    if (role) {
      filter.role = role;
    }
    if (query) {
      filter.$or = [
        { firstName: { $regex: String(query), $options: 'i' } },
        { lastName: { $regex: String(query), $options: 'i' } },
        { username: { $regex: String(query), $options: 'i' } },
        { email: { $regex: String(query), $options: 'i' } }
      ];
    }
    const users = await User.find(filter).select('-password').limit(10);
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la recherche des utilisateurs.', error: error.message });
  }
};

export const rateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, rating } = req.body;
    if (!userId || !rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Identifiant de l\'utilisateur et note valide (1-5) requis.' });
      return;
    }
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }
    const oldCount = targetUser.rankingCount || 0;
    const oldScore = targetUser.rankingScore || 5.0;
    const newCount = oldCount + 1;
    const newScore = ((oldScore * oldCount) + Number(rating)) / newCount;
    targetUser.rankingScore = parseFloat(newScore.toFixed(2));
    targetUser.rankingCount = newCount;
    await targetUser.save();
    res.status(200).json({
      message: 'Merci pour votre avis.',
      rankingScore: targetUser.rankingScore,
      rankingCount: targetUser.rankingCount
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de l\'évaluation.', error: error.message });
  }
};
