import mongoose, { Schema } from 'mongoose';

const HomeworkSchema = new Schema({
  class: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String, required: true },
  assignedBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Homework || mongoose.model('Homework', HomeworkSchema);
