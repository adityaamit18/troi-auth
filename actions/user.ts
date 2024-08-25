"use server"
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

interface SignupParams {
  firstName: string;
  lastName: string;
  username:string;
  email: string;
  password: string;
}

export async function signup({ firstName, lastName, username,email, password }: SignupParams) {
  try {
    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email is already in use.');
    }
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new Error('username not available.');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        username,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      userId: user.userId,
    };
  } catch (error:any) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during signup.',
    };
  }
}
