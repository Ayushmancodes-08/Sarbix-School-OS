"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Student, Fee, StudentAttendance, HostelRoom, Homework, Admission, User, Teacher, AdmissionApplication, HostelFee, JobApplication, Notice, Hostel } from './types';

// Define the shape of our context
interface DataContextProps {
  students: Student[] | null;
  teachers: Teacher[] | null;
  fees: Fee[] | null;
  hostelFees: HostelFee[] | null;
  studentAttendance: StudentAttendance[] | null;
  hostels: Hostel[] | null;
  hostelRooms: HostelRoom[] | null;
  homeworks: Homework[] | null;
  admissions: Admission[] | null;
  admissionApplications: AdmissionApplication[] | null;
  jobApplications: JobApplication[] | null;
  users: User[] | null;
  notices: Notice[] | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<{
    students: Student[] | null;
    teachers: Teacher[] | null;
    fees: Fee[] | null;
    hostelFees: HostelFee[] | null;
    studentAttendance: StudentAttendance[] | null;
    hostels: Hostel[] | null;
    hostelRooms: HostelRoom[] | null;
    homeworks: Homework[] | null;
    admissions: Admission[] | null;
    admissionApplications: AdmissionApplication[] | null;
    jobApplications: JobApplication[] | null;
    users: User[] | null;
    notices: Notice[] | null;
  }>({
    students: null,
    teachers: null,
    fees: null,
    hostelFees: null,
    studentAttendance: null,
    hostels: null,
    hostelRooms: null,
    homeworks: null,
    admissions: null,
    admissionApplications: null,
    jobApplications: null,
    users: null,
    notices: null,
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch (error) {
      console.error('Error in DataProvider fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      fetchData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('db-updated', handleUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('db-updated', handleUpdate);
      }
    };
  }, []);

  const value = {
    ...data,
    refreshData: fetchData,
  };

  return (
    <DataContext.Provider value={value as DataContextProps}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
