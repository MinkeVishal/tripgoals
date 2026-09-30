'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { forgotPasswordAction, resetPasswordAction } from '@/lib/actions/auth';
import { forgotPasswordSchema, newPasswordSchema, type NewPasswordInput } from '@/lib/validation/auth';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: { email: string }) {
    setFormError('');
    const result = await forgotPasswordAction(values);
    if (!result.ok) return setFormError(result.error);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="grid gap-3 text-center" role="status">
        <CheckCircle2 className="text-primary mx-auto size-10" />
        <p className="font-medium">Check your inbox</p>
        <p className="text-muted-foreground text-sm">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register('email')} />
      </Field>
      {formError ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {formError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Send reset link
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('userId') ?? '';
  const secret = params.get('secret') ?? '';
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordInput>({ resolver: zodResolver(newPasswordSchema) });

  if (!userId || !secret) {
    return (
      <div className="grid gap-4 text-center">
        <p className="text-muted-foreground text-sm">This reset link is incomplete. Please request a new one.</p>
        <Button asChild>
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(values: NewPasswordInput) {
    setFormError('');
    const result = await resetPasswordAction({ userId, secret, ...values });
    if (!result.ok) return setFormError(result.error);
    toast.success('Password updated. You can sign in now.');
    router.replace('/login');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <Field label="New password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters.">
        <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register('password')} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <PasswordInput id="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
      </Field>
      {formError ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {formError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Update password
      </Button>
    </form>
  );
}
