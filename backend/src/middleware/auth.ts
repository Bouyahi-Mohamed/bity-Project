import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'bity_super_secret_key_12345';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Accès non autorisé, jeton manquant.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expirée ou jeton invalide.' });
  }
};

export const checkRole = (roles: Array<'student' | 'owner' | 'admin'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Non authentifié.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Accès interdit pour ce rôle.' });
      return;
    }

    next();
  };
};

export const checkVerified = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Non authentifié.' });
    return;
  }

  // Admins are always bypass-verified. Otherwise, user must have is_verified = true
  if (req.user.role !== 'admin' && !req.user.is_verified) {
    res.status(403).json({ 
      message: 'Votre compte n\'a pas encore été vérifié et approuvé par un administrateur. Accès bloqué.',
      is_verified: false 
    });
    return;
  }

  next();
};
