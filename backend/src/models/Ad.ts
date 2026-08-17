import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  surface?: number;
  propertyType?: string;
  distanceToFac?: number; // In kilometers or minutes
  transportAccess: boolean;
  image?: string;
  images: string[];
  features?: string[];
  roommates?: {
    count: number;
    details: string;
    avatars: string[];
  };
  owner: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'SIGNALÉE' | 'PÉRIMÉE';
  createdAt: Date;
}

const AdSchema = new Schema<IAd>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true }, // Main display location
  address: { type: String, default: '' }, // Detailed street address
  neighborhood: { type: String, default: '' },
  city: { type: String, default: 'Tunis' },
  latitude: { type: Number }, // Exact Map Latitude
  longitude: { type: Number }, // Exact Map Longitude
  surface: { type: Number }, // In square meters
  propertyType: { type: String, default: 'Logement entier' },
  distanceToFac: { type: Number },
  transportAccess: { type: Boolean, default: false },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  features: { type: [String], default: [] },
  roommates: {
    count: { type: Number },
    details: { type: String },
    avatars: { type: [String], default: [] }
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ACTIVE', 'SIGNALÉE', 'PÉRIMÉE'], default: 'ACTIVE' }
}, {
  timestamps: true
});

export default mongoose.model<IAd>('Ad', AdSchema);
