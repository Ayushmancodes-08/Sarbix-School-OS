import mongoose, { Schema } from 'mongoose';

const HostelSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Boys', 'Girls'] },
}, { timestamps: true });

export default mongoose.models.Hostel || mongoose.model('Hostel', HostelSchema);
