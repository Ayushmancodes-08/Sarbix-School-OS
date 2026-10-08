import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import * as Models from '@/models';

const tableToModelMap: Record<string, any> = {
  students: Models.Student,
  teachers: Models.Teacher,
  fees: Models.Fee,
  hostel_fees: Models.HostelFee,
  student_attendance: Models.StudentAttendance,
  hostels: Models.Hostel,
  hostel_rooms: Models.HostelRoom,
  homeworks: Models.Homework,
  admissions: Models.Admission,
  admission_applications: Models.AdmissionApplication,
  job_applications: Models.JobApplication,
  users: Models.User,
  notices: Models.Notice,
};

// Helper to map snake_case payload fields to camelCase schema fields
const mapPayloadToSchema = (payload: any): any => {
  if (!payload) return payload;
  if (Array.isArray(payload)) return payload.map(mapPayloadToSchema);
  if (typeof payload !== 'object') return payload;

  const mapped: any = {};
  for (const key in payload) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    mapped[camelKey] = payload[key];
  }
  return mapped;
};

// Helper to convert Mongoose doc to plain obj and map _id to id
const mapDoc = (doc: any) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) {
    obj.id = obj._id.toString();
  }
  return obj;
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { table, operation, data, filters, isSingle } = await req.json();

    const Model = tableToModelMap[table];
    if (!Model) {
      return NextResponse.json({ error: `Table ${table} not supported` }, { status: 400 });
    }

    // Build the query filter from the Supabase filters payload
    const mongoQuery: any = {};
    if (filters && filters.length > 0) {
      filters.forEach((f: any) => {
        // Map filter field from snake_case to camelCase
        const camelField = f.field.replace(/_([a-z])/g, (_: any, letter: string) => letter.toUpperCase());
        if (f.operator === 'eq') {
          // If field is 'id' we check both id and _id
          if (camelField === 'id') {
             mongoQuery['$or'] = [{ _id: f.value }, { id: f.value }];
          } else {
             mongoQuery[camelField] = f.value;
          }
        }
      });
    }

    let resultData: any = null;

    const mappedData = mapPayloadToSchema(data);

    if (operation === 'select') {
      if (isSingle) {
        const doc = await Model.findOne(mongoQuery);
        resultData = doc ? mapDoc(doc) : null;
      } else {
        const docs = await Model.find(mongoQuery);
        resultData = docs.map(mapDoc);
      }
    } else if (operation === 'insert') {
      if (Array.isArray(mappedData)) {
        const docs = await Model.insertMany(mappedData);
        resultData = docs.map(mapDoc);
      } else {
        const doc = await Model.create(mappedData);
        resultData = mapDoc(doc);
      }
    } else if (operation === 'update') {
      const updatePayload = { $set: mappedData };
      if (isSingle) {
        const doc = await Model.findOneAndUpdate(mongoQuery, updatePayload, { new: true });
        resultData = doc ? mapDoc(doc) : null;
      } else {
        const res = await Model.updateMany(mongoQuery, updatePayload);
        // Return matching updated documents
        const docs = await Model.find(mongoQuery);
        resultData = docs.map(mapDoc);
      }
    } else if (operation === 'delete') {
      if (isSingle) {
        const doc = await Model.findOneAndDelete(mongoQuery);
        resultData = doc ? mapDoc(doc) : null;
      } else {
        const docs = await Model.find(mongoQuery);
        await Model.deleteMany(mongoQuery);
        resultData = docs.map(mapDoc);
      }
    }

    return NextResponse.json({ data: resultData, error: null });
  } catch (error: any) {
    console.error('API Supabase Mock Error:', error);
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}
