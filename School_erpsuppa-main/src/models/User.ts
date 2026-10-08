import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Teacher', 'Student', 'Finance'] },
  studentId: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
