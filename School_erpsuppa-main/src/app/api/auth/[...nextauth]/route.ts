import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'User ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password || !credentials?.role) {
          throw new Error('Please enter all fields');
        }

        await dbConnect();

        // Find user by userId and role
        const user = await User.findOne({ 
          userId: credentials.username,
          role: credentials.role 
        });

        if (!user) {
          throw new Error('No user found with those credentials or role');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          // Fallback check for plain text password (in case they haven't been migrated/hashed yet, e.g. from older seeds)
          if (credentials.password === user.password) {
             return {
                id: user._id.toString(),
                userId: user.userId,
                role: user.role,
                studentId: user.studentId
             };
          }
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          userId: user.userId,
          role: user.role,
          studentId: user.studentId
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.userId;
        token.role = user.role;
        token.studentId = user.studentId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.userId = token.userId;
        session.user.role = token.role;
        session.user.studentId = token.studentId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
