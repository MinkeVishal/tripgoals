'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { changePasswordAction, updateProfileAction } from '@/lib/actions/auth';
import { changePasswordSchema, profileSchema } from '@/lib/validation/auth';

type ProfileValues = { name: string; phone: string };
type PasswordValues = { current: string; password: string; confirmPassword: string };

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { name, phone } });

  async function onSubmit(values: ProfileValues) {
    setFormError('');
    const result = await updateProfileAction(values);
    if (!result.ok) {
      setFormError(result.error);
      Object.entries(result.fieldErrors ?? {}).forEach(([k, message]) => setError(k as keyof ProfileValues, { message }));
      return;
    }
    toast.success('Profile updated');
    reset(values);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <Field label="Full name" htmlFor="profile-name" error={errors.name?.message}>
        <Input id="profile-name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
      </Field>
      <Field label="Email" htmlFor="profile-email" hint="Your email is your sign-in and can't be changed here.">
        <Input id="profile-email" value={email} readOnly disabled />
      </Field>
      <Field label="Phone" htmlFor="profile-phone" error={errors.phone?.message} hint="Used to prefill your WhatsApp enquiries.">
        <Input id="profile-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register('phone')} />
      </Field>
      {formError ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting || !isDirty} size="lg" className="w-fit">
        {isSubmitting ? <Loader2 className="animate-spin" /> : null} Save changes
      </Button>
    </form>
  );
}

export function PasswordForm() {
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: PasswordValues) {
    setFormError('');
    const result = await changePasswordAction(values);
    if (!result.ok) return setFormError(result.error);
    toast.success('Password changed');
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <Field label="Current password" htmlFor="pw-current" error={errors.current?.message}>
        <PasswordInput id="pw-current" autoComplete="current-password" aria-invalid={!!errors.current} {...register('current')} />
      </Field>
      <Field label="New password" htmlFor="pw-new" error={errors.password?.message} hint="At least 8 characters.">
        <PasswordInput id="pw-new" autoComplete="new-password" aria-invalid={!!errors.password} {...register('password')} />
      </Field>
      <Field label="Confirm new password" htmlFor="pw-confirm" error={errors.confirmPassword?.message}>
        <PasswordInput id="pw-confirm" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
      </Field>
      {formError ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting} size="lg" className="w-fit">
        {isSubmitting ? <Loader2 className="animate-spin" /> : null} Change password
      </Button>
    </form>
  );
}
