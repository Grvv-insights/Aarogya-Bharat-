import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser, UserRole } from '../types';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  country?: string;
}

export const signToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'supersecret_medical_tourism_jwt_key_2026_dev';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};

export const registerUser = async (data: RegisterInput): Promise<{ user: IUser; token: string }> => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new Error('User already exists with this email address');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: data.password, // hashed by pre-save hook
    role: data.role || 'patient',
    phone: data.phone,
    country: data.country || 'United States'
  });

  const token = signToken(user);
  return { user, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = signToken(user);
  return { user, token };
};
