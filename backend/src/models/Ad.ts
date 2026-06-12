import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  distanceToFac?: number; // In kilometers
  transportAccess: boolean;
  image?: string;
  images: string[]; // Multiple images support
  owner: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'SIGNALÉE' | 'PÉRIMÉE';
  createdAt: Date;
}

const AdSchema = new Schema<IAd>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 }, // Transparency rule: mandatory price
  location: { type: String, required: true, trim: true }, // Precise location field
  distanceToFac: { type: Number },
  transportAccess: { type: Boolean, default: false },
  image: { type: String, default: '' },
  images: { type: [String], default: [] }, // Multiple images support
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ACTIVE', 'SIGNALÉE', 'PÉRIMÉE'], default: 'ACTIVE' }
}, {
  timestamps: true
});


export default mongoose.model<IAd>('Ad', AdSchema);
