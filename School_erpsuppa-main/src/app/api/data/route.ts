import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import {
  Student,
  Teacher,
  Fee,
  HostelFee,
  StudentAttendance,
  Hostel,
  HostelRoom,
  Homework,
  Admission,
  AdmissionApplication,
  JobApplication,
  User,
  Notice,
} from '@/models';

// Helper to convert Mongoose documents to plain objects and map _id to id
const mapDoc = (doc: any) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) {
    obj.id = obj._id.toString();
  }
  return obj;
};

export async function GET() {
  try {
    await dbConnect();

    const [
      students,
      teachers,
      fees,
      hostelFees,
      studentAttendance,
      hostels,
      hostelRooms,
      homeworks,
      admissions,
      admissionApplications,
      jobApplications,
      users,
      notices,
    ] = await Promise.all([
      Student.find({}),
      Teacher.find({}),
      Fee.find({}),
      HostelFee.find({}),
      StudentAttendance.find({}),
      Hostel.find({}),
      HostelRoom.find({}),
      Homework.find({}),
      Admission.find({}),
      AdmissionApplication.find({}),
      JobApplication.find({}),
      User.find({}),
      Notice.find({}),
    ]);

    return NextResponse.json({
      students: students.map(mapDoc),
      teachers: teachers.map(mapDoc),
      fees: fees.map(mapDoc),
      hostelFees: hostelFees.map(mapDoc),
      studentAttendance: studentAttendance.map(mapDoc),
      hostels: hostels.map(mapDoc),
      hostelRooms: hostelRooms.map(mapDoc),
      homeworks: homeworks.map(mapDoc),
      admissions: admissions.map(mapDoc),
      admissionApplications: admissionApplications.map(mapDoc),
      jobApplications: jobApplications.map(mapDoc),
      users: users.map(mapDoc),
      notices: notices.map(mapDoc),
    });
  } catch (error: any) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
