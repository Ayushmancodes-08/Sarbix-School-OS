import mongoose, { Schema } from 'mongoose';

const AdmissionSchema = new Schema({
  month: { type: String, required: true },
  admitted: { type: Number, required: true },
  capacity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Admission || mongoose.model('Admission', AdmissionSchema);
