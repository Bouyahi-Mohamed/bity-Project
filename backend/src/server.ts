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
    // 1. Seed Super-Admin
    const adminEmail = 'admin@admin.com';
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
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
    } else {
      console.log('Seeding: Super-Admin user already exists.');
    }

    // 2. Seed student account "Bouyahi Mohamed"
    const studentEmail = 'bouyahi.mohamed.1@gmail.com';
    let studentUser = await User.findOne({ email: studentEmail });
    if (!studentUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt); // password is '123456'
      studentUser = new User({
        email: studentEmail,
        password: hashedPassword,
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
      // Ensure student is verified
      if (!studentUser.is_verified) {
        studentUser.is_verified = true;
        studentUser.verifiedAt = new Date();
        await studentUser.save();
      }
      console.log('Seeding: Student "Bouyahi Mohamed" already exists and is verified.');
    }

    // 3. Seed owner "Ahmed Hamza"
    const ownerEmail = 'ahmed.hamza@gmail.com';
    let ownerUser = await User.findOne({ email: ownerEmail });
    if (!ownerUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      ownerUser = new User({
        email: ownerEmail,
        password: hashedPassword,
        firstName: 'Ahmed',
        lastName: 'Hamza',
        username: 'ahmed.hamza',
        phone: '+216 99 987 654',
        language: 'fr',
        role: 'owner',
        is_verified: true,
        rankingScore: 4.8,
        rankingCount: 25,
        verifiedAt: new Date()
      });
      await ownerUser.save();
      console.log('Seeding: Owner "Ahmed Hamza" created successfully!');
    }

    // 4. Seed owner "Sarah Ben Salah"
    const owner2Email = 'sarah.bensalah@gmail.com';
    let owner2User = await User.findOne({ email: owner2Email });
    if (!owner2User) {
      const salt = await bcrypt.genSalt(10);
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
        rankingScore: 4.5,
        rankingCount: 8,
        verifiedAt: new Date()
      });
      await owner2User.save();
      console.log('Seeding: Owner "Sarah Ben Salah" created successfully!');
    }

    // 5. Seed default ads
    const adsCount = await Ad.countDocuments();
    if (adsCount === 0) {
      const adsToSeed = [
        {
          title: 'S+1 Moderne Centre Ville',
          description: 'Superbe appartement de 45m² refait à neuf, idéalement situé au cœur de Tunis. Calme et très lumineux. Proche de toutes commodités et transports.',
          price: 650,
          location: 'Tunis, Lafayette',
          distanceToFac: 10,
          transportAccess: true,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
          owner: ownerUser._id,
          status: 'ACTIVE'
        },
        {
          title: 'Chambre en Colocation',
          description: 'Chambre lumineuse de 14m² dans un appartement de 100m². Ambiance calme et studieuse. Idéal pour étudiante (fille uniquement).',
          price: 350,
          location: 'Ariana, El Menzah 5',
          distanceToFac: 15,
          transportAccess: true,
          image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
          owner: owner2User._id,
          status: 'ACTIVE'
        },
        {
          title: 'Studio Haut Standing',
          description: 'Studio moderne et sécurisé de 35m² au Lac 1. Entièrement équipé avec climatisation et cuisine moderne. Idéal pour jeune ingénieur ou étudiant.',
          price: 850,
          location: 'Tunis, Lac 1',
          distanceToFac: 20,
          transportAccess: false,
          image: 'https://images.unsplash.com/photo-1536376074432-bc12f744586c?auto=format&fit=crop&q=80&w=800',
          owner: ownerUser._id,
          status: 'ACTIVE'
        }
      ];
      await Ad.insertMany(adsToSeed);
      console.log('Seeding: 3 default Ads seeded successfully!');
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
