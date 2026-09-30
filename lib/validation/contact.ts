import { z } from 'zod';

export const CONTACT_SUBJECTS = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Booking Assistance', label: 'Booking Assistance' },
  { value: 'Package Information', label: 'Package Information' },
  { value: 'Complaint', label: 'Complaint' },
  { value: 'Feedback', label: 'Feedback' },
  { value: 'Other', label: 'Other' },
] as const;

export const CALLBACK_TIMES = [
  { value: 'Morning (9 AM - 12 PM)', label: 'Morning (9 AM – 12 PM)' },
  { value: 'Afternoon (12 PM - 5 PM)', label: 'Afternoon (12 PM – 5 PM)' },
  { value: 'Evening (5 PM - 8 PM)', label: 'Evening (5 PM – 8 PM)' },
] as const;

export const CALLBACK_REASONS = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Package Booking', label: 'Package Booking' },
  { value: 'Custom Itinerary', label: 'Custom Itinerary' },
  { value: 'Support', label: 'Support' },
] as const;

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{10,15}$/, 'Enter a valid phone number');

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name').max(60),
  lastName: z.string().trim().min(1, 'Enter your last name').max(60),
  email: z.email('Enter a valid email address'),
  phone,
  subject: z.string().min(1, 'Choose a subject'),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters)').max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const callbackSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(80),
  phone,
  time: z.string().min(1, 'Choose a time'),
  reason: z.string().min(1, 'Choose a reason'),
});
export type CallbackInput = z.infer<typeof callbackSchema>;
