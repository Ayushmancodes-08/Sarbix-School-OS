import mongoose, { Schema } from 'mongoose';

const NoticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Teacher'] },
  date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
