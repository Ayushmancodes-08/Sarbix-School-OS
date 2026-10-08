import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function seedPredefinedUsers() {
  try {
    // Check for Admin
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password', 10);
      await User.create({
        userId: 'admin',
        password: hashedPassword,
        role: 'Admin'
      });
      console.log('Seeded predefined Admin user');
    }

    // Check for Finance
    const financeExists = await User.findOne({ role: 'Finance' });
    if (!financeExists) {
      const hashedPassword = await bcrypt.hash('password', 10);
      await User.create({
        userId: 'finance',
        password: hashedPassword,
        role: 'Finance'
      });
      console.log('Seeded predefined Finance user');
    }
  } catch (error) {
    console.error('Error seeding predefined users:', error);
  }
}
