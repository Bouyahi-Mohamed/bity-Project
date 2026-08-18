import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../src/models/User.js';
import Ad from '../src/models/Ad.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bity';

async function run() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const salt = await bcrypt.genSalt(10);

  // 1. Super-Admin
  const adminEmail = 'admin@admin.com';
  const adminHashedPass = await bcrypt.hash('admin', salt);
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      email: adminEmail,
      password: adminHashedPass,
      firstName: 'Super',
      lastName: 'Admin',
      username: 'superadmin',
      phone: '+216 22 123 456',
      language: 'fr',
      role: 'admin',
      is_verified: true,
      verifiedAt: new Date()
    },
    { upsert: true, new: true }
  );
  console.log('Admin user ready.');

  // 2. Student Bouyahi Mohamed
  const studentEmail = 'bouyahi.mohamed.1@gmail.com';
  const studentHashedPass = await bcrypt.hash('Mohamed007', salt);
  const student = await User.findOneAndUpdate(
    { email: studentEmail },
    {
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
    },
    { upsert: true, new: true }
  );
  console.log('Student account bouyahi.mohamed.1@gmail.com / Mohamed007 ready.');

  // 3. Owner Nourdine Mansour
  const ownerEmail = 'nourdine@gmail.com';
  const ownerHashedPass = await bcrypt.hash('Mohamed007', salt);
  const ownerNourdine = await User.findOneAndUpdate(
    { email: ownerEmail },
    {
      email: ownerEmail,
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
    },
    { upsert: true, new: true }
  );
  console.log('Owner account nourdine@gmail.com / Mohamed007 ready.');

  // 4. Owner Sarah Ben Salah
  const owner2Email = 'sarah.bensalah@gmail.com';
  const owner2HashedPass = await bcrypt.hash('123456', salt);
  const ownerSarah = await User.findOneAndUpdate(
    { email: owner2Email },
    {
      email: owner2Email,
      password: owner2HashedPass,
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
    },
    { upsert: true, new: true }
  );

  // Clear and seed ads
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
      title: 'S+3 Colocation Féminine El Menzah 5',
      description: 'Grand appartement S+3 de 90m² dans une résidence calme et sécurisée. 1 chambre occupée, 1 chambre libérée le 28-09-26 (préavis déposé), et 1 chambre disponible immédiatement. Ambiance studieuse, idéal pour étudiante (INSAT, Sesame, Dauphine). Balcon, machine à laver, Wifi fibre.',
      price: 350,
      location: 'Ariana, El Menzah 5',
      address: 'Avenue Ahmed Tlili, El Menzah 5',
      neighborhood: 'El Menzah 5',
      city: 'Ariana',
      latitude: 36.8385,
      longitude: 10.1650,
      surface: 90,
      propertyType: 'Chambre en colocation',
      distanceToFac: 15,
      transportAccess: true,
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
      features: ['90m²', 'Charges comprises', 'Balcon', 'Machine à laver', '1 chambre libre', '1 sortie le 28-09-26'],
      roommates: {
        count: 3,
        details: 'Faten, Farah • Étudiantes',
        avatars: [
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100',
          'LEAVING:https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
          'FREE'
        ]
      },
      owner: ownerSarah._id,
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
      owner: ownerSarah._id,
      status: 'ACTIVE'
    }
  ];

  await Ad.insertMany(adsToSeed);
  console.log('Seeded 5 geo-located ads successfully!');

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
