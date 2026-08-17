import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import adRoutes from './routes/adRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Model Import for seeding
import User from './models/User.js';
import Ad from './models/Ad.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27501/bity'; // Default local URI or port 27017

// ES Module dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: '*', // In development, allow requests from any frontend port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Bity API Node/Express/MongoDB is running.');
});

// Database Seed Function
const seedDatabase = async () => {
  try {
    const salt = await bcrypt.genSalt(10);

    // 1. Seed Super-Admin
    const adminEmail = 'admin@admin.com';
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin', salt);
      const newAdmin = new User({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        username: 'superadmin',
        phone: '+216 22 123 456',
        language: 'fr',
        role: 'admin',
        is_verified: true,
        verifiedAt: new Date()
      });
      await newAdmin.save();
      console.log('Seeding: Super-Admin created successfully!');
    }

    // 2. Seed student account "Bouyahi Mohamed"
    const studentEmail = 'bouyahi.mohamed.1@gmail.com';
    let studentUser = await User.findOne({ email: studentEmail });
    const studentHashedPass = await bcrypt.hash('Mohamed007', salt);
    if (!studentUser) {
      studentUser = new User({
        email: studentEmail,
        password: studentHashedPass,
        firstName: 'Mohamed',
        lastName: 'Bouyahi',
        username: 'bouyahi.mohamed',
        phone: '+216 55 123 456',
        language: 'fr',
        role: 'student',
        is_verified: true,
        university: 'INSAT Tunis',
        verifiedAt: new Date()
      });
      await studentUser.save();
      console.log('Seeding: Student "Bouyahi Mohamed" created successfully!');
    } else {
      studentUser.password = studentHashedPass;
      studentUser.is_verified = true;
      studentUser.verifiedAt = new Date();
      await studentUser.save();
      console.log('Seeding: Student "Bouyahi Mohamed" updated with password Mohamed007.');
    }

    // 3. Seed owner account "Nourdine Mansour"
    const ownerNourdineEmail = 'nourdine@gmail.com';
    let ownerNourdine = await User.findOne({ email: ownerNourdineEmail });
    const ownerHashedPass = await bcrypt.hash('Mohamed007', salt);
    if (!ownerNourdine) {
      ownerNourdine = new User({
        email: ownerNourdineEmail,
        password: ownerHashedPass,
        firstName: 'Nourdine',
        lastName: 'Mansour',
        username: 'nourdine.mansour',
        phone: '+216 98 123 789',
        language: 'fr',
        role: 'owner',
        is_verified: true,
        rankingScore: 4.9,
        rankingCount: 18,
        verifiedAt: new Date()
      });
      await ownerNourdine.save();
      console.log('Seeding: Owner "Nourdine Mansour" created successfully!');
    } else {
      ownerNourdine.password = ownerHashedPass;
      ownerNourdine.is_verified = true;
      await ownerNourdine.save();
    }

    // 4. Seed owner "Sarah Ben Salah"
    const owner2Email = 'sarah.bensalah@gmail.com';
    let owner2User = await User.findOne({ email: owner2Email });
    if (!owner2User) {
      const hashedPassword = await bcrypt.hash('123456', salt);
      owner2User = new User({
        email: owner2Email,
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Ben Salah',
        username: 'sarah.bensalah',
        phone: '+216 98 765 432',
        language: 'fr',
        role: 'owner',
        is_verified: true,
        rankingScore: 4.8,
        rankingCount: 12,
        verifiedAt: new Date()
      });
      await owner2User.save();
      console.log('Seeding: Owner "Sarah Ben Salah" created successfully!');
    }

    // 5. Seed default rich ads with accurate Geo Coordinates & detailed info
    const adsCount = await Ad.countDocuments();
    if (adsCount < 5) {
      // Clear old seed if needed or upsert
      await Ad.deleteMany({});
      const adsToSeed = [
        {
          title: 'S+1 Moderne Centre Ville',
          description: 'Superbe appartement de 45m² refait à neuf, idéalement situé au cœur de Tunis. Calme et très lumineux. Proche de toutes commodités, stations de métro et universités centrales.',
          price: 650,
          location: 'Tunis, Lafayette',
          address: '14 Rue de Palestine, Lafayette',
          neighborhood: 'Lafayette',
          city: 'Tunis',
          latitude: 36.8118,
          longitude: 10.1804,
          surface: 45,
          propertyType: 'Logement entier',
          distanceToFac: 10,
          transportAccess: true,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
          features: ['45m²', 'Wifi Fibre', 'Meublé', 'Métro à 2 min'],
          owner: ownerNourdine._id,
          status: 'ACTIVE'
        },
        {
          title: 'Chambre en Colocation Féminine',
          description: 'Chambre lumineuse de 16m² dans un bel appartement de 110m². Ambiance calme et studieuse. Idéal pour étudiante (INSAT, Sesame, Dauphine).',
          price: 350,
          location: 'Ariana, El Menzah 5',
          address: 'Avenue Ahmed Tlili, El Menzah 5',
          neighborhood: 'El Menzah 5',
          city: 'Ariana',
          latitude: 36.8385,
          longitude: 10.1650,
          surface: 16,
          propertyType: 'Chambre en colocation',
          distanceToFac: 15,
          transportAccess: true,
          image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
          features: ['16m²', 'Charges comprises', 'Balcon', 'Machine à laver'],
          roommates: {
            count: 2,
            details: 'Faten, Farah • Étudiantes',
            avatars: ['F', 'F']
          },
          owner: owner2User._id,
          status: 'ACTIVE'
        },
        {
          title: 'Studio Haut Standing Les Berges du Lac 1',
          description: 'Studio moderne et sécurisé de 35m² au Lac 1. Entièrement équipé avec climatisation centrale, cuisine moderne et vue dégagée. Idéal pour étudiant ou jeune actif.',
          price: 850,
          location: 'Tunis, Lac 1',
          address: 'Rue du Lac Victoria, Les Berges du Lac 1',
          neighborhood: 'Lac 1',
          city: 'Tunis',
          latitude: 36.8325,
          longitude: 10.2335,
          surface: 35,
          propertyType: 'Studio',
          distanceToFac: 20,
          transportAccess: false,
          image: 'https://images.unsplash.com/photo-1536376074432-bc12f744586c?auto=format&fit=crop&q=80&w=800',
          features: ['35m²', 'Sécurisé 24/7', 'Climatisation', 'Cuisine équipée'],
          owner: ownerNourdine._id,
          status: 'ACTIVE'
        },
        {
          title: 'S+2 Spacieux Proche ESPRIT & Sesame',
          description: 'Grand appartement S+2 de 70m² situé au pôle technologique El Ghazela, à 5 minutes à pied de l\'école d\'ingénieurs ESPRIT et Sesame University.',
          price: 750,
          location: 'Ariana, El Ghazela',
          address: 'Pôle Technologique El Ghazela, Ariana',
          neighborhood: 'El Ghazela',
          city: 'Ariana',
          latitude: 36.8973,
          longitude: 10.1895,
          surface: 70,
          propertyType: 'Logement entier',
          distanceToFac: 5,
          transportAccess: true,
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
          features: ['70m²', '2 Chambres', 'Chauffage central', 'Parking'],
          owner: ownerNourdine._id,
          status: 'ACTIVE'
        },
        {
          title: 'Studio Cosy Campus Universitaire El Manar',
          description: 'Charmant studio indépendant de 28m² à proximité immédiate du campus El Manar. Quartier résidentiel calme, idéal pour étudiants studieux.',
          price: 520,
          location: 'Tunis, El Manar 2',
          address: 'Rue Abdelaziz Thaalbi, El Manar 2',
          neighborhood: 'El Manar 2',
          city: 'Tunis',
          latitude: 36.8339,
          longitude: 10.1478,
          surface: 28,
          propertyType: 'Studio',
          distanceToFac: 8,
          transportAccess: true,
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
          features: ['28m²', 'Wifi Fibre', 'Meublé', 'Entrée privée'],
          owner: owner2User._id,
          status: 'ACTIVE'
        }
      ];
      await Ad.insertMany(adsToSeed);
      console.log('Seeding: 5 enriched geo-located Ads seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Database Connection & Server Start
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Database.');
    // Seed Database
    await seedDatabase();
    // Start Listening
    app.listen(PORT, () => {
      console.log(`Bity backend server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
