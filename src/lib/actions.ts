'use server';

import { createUserInDb } from './database';

export async function signupAction(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!fullName || !email || !password) {
    throw new Error('All fields are required');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  try {
    await createUserInDb({ fullName, email, password });
    return { success: true };
  } catch (error: any) {
    if (error.message.includes('duplicate key')) {
      throw new Error('Email already exists');
    }
    throw new Error('Failed to create account');
  }
}