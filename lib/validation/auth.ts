import { z } from 'zod';

const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));
const password = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(128, 'Password is too long');
const phone = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\+?[0-9\s-]{10,15}$/.test(v), 'Enter a valid phone number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name').max(128),
    email,
    phone,
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(128),
  phone,
});

export const changePasswordSchema = z
  .object({ current: z.string().min(1, 'Enter your current password'), password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
