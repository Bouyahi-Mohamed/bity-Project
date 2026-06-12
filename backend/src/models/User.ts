import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string; // Optional for security queries
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  language: string;
  role: 'student' | 'owner' | 'admin';
  is_verified: boolean;
  verifiedAt?: Date;
  // Student Specific
  university?: string;
  studentCardImage?: string;
  // Owner Specific
  cinImage?: string;
  utilityBillImage?: string;
  rankingScore: number; // Base score, starts at 5.0
  rankingCount: number;
  interests?: string[];
  savedAds?: mongoose.Types.ObjectId[];
  avatar?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  username: { type: String, default: '' },
  phone: { type: String, default: '' },
  language: { type: String, default: 'fr' },
  role: { type: String, enum: ['student', 'owner', 'admin'], required: true },
  is_verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  // Student Specific
  university: { type: String },
  studentCardImage: { type: String },
  // Owner Specific
  cinImage: { type: String },
  utilityBillImage: { type: String },
  rankingScore: { type: Number, default: 5.0 },
  rankingCount: { type: Number, default: 0 },
  interests: { type: [String], default: [] },
  savedAds: [{ type: Schema.Types.ObjectId, ref: 'Ad', default: [] }],
  avatar: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
