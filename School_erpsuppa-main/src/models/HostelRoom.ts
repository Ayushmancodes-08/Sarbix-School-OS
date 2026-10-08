import mongoose, { Schema } from 'mongoose';

const HostelRoomSchema = new Schema({
  hostelId: { type: String, required: true },
  hostelName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  occupants: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.HostelRoom || mongoose.model('HostelRoom', HostelRoomSchema);
