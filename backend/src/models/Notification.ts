import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  text: string;
  type: 'PRICE_DROP' | 'NEW_AD' | 'VERIFICATION_APPROVED' | 'VERIFICATION_REJECTED';
  relatedAd?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['PRICE_DROP', 'NEW_AD', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED'], required: true },
  relatedAd: { type: Schema.Types.ObjectId, ref: 'Ad' },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
