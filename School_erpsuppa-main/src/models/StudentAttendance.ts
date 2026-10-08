import mongoose, { Schema } from 'mongoose';

const AttendanceRecordSchema = new Schema({
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ['Present', 'Absent', 'Holiday'] },
}, { _id: false });

const StudentAttendanceSchema = new Schema({
  studentId: { type: String, required: true, unique: true },
  records: [AttendanceRecordSchema],
}, { timestamps: true });

export default mongoose.models.StudentAttendance || mongoose.model('StudentAttendance', StudentAttendanceSchema);
