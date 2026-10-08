import mongoose, { Schema } from 'mongoose';

const JobApplicationSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  experience: { type: Number, required: true },
  resume: { type: String, required: true },
  status: { type: String, required: true, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
