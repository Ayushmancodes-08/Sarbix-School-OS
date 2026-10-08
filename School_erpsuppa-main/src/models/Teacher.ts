import mongoose, { Schema } from 'mongoose';

const TeacherSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
