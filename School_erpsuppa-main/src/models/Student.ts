import mongoose, { Schema } from 'mongoose';

const StudentSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  rollNumber: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
