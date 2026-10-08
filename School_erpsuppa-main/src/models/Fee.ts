import mongoose, { Schema } from 'mongoose';

const FeeSchema = new Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  class: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['Paid', 'Due', 'Overdue'] },
  dueDate: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
