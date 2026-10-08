import mongoose, { Schema } from 'mongoose';

const AdmissionApplicationSchema = new Schema({
  studentName: { type: String, required: true },
  applyingForGrade: { type: String, required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String },
  address: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String, required: true },
  previousSchool: { type: String },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.AdmissionApplication || mongoose.model('AdmissionApplication', AdmissionApplicationSchema);
