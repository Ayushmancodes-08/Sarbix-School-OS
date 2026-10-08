import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      role: 'Admin' | 'Teacher' | 'Student' | 'Finance';
      studentId?: string;
    } & DefaultSession["user"]
  }

  interface User {
    userId: string;
    role: 'Admin' | 'Teacher' | 'Student' | 'Finance';
    studentId?: string;
  }
}
