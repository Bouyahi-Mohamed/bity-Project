const mongoose = require('mongoose');
const path = require('path');

// Adjust the connection string as needed (use environment variable or default)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bity';

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  distanceToFac: Number,
  transportAccess: Boolean,
  image: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
}, { timestamps: true });

const Ad = mongoose.model('Ad', adSchema);

async function migrate() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const cursor = Ad.find({ $or: [{ image: { $exists: true, $ne: '' } }, { images: { $exists: false } }] }).cursor();
    let count = 0;
    for await (const ad of cursor) {
      const updates = {};
      if (ad.image && (!ad.images || ad.images.length === 0)) {
        updates.images = [ad.image];
        updates.image = '';
      }
      if (Object.keys(updates).length) {
        await Ad.updateOne({ _id: ad._id }, { $set: updates });
        count++;
        console.log(`Migrated ad ${ad._id}`);
      }
    }
    console.log(`Migration completed. Updated ${count} ads.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
