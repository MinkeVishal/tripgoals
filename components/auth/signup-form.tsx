'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { signupAction } from '@/lib/actions/auth';
import { notifyAuthChanged } from '@/components/site/wishlist-provider';
import { safeNext } from '@/lib/safe-next';
import { signupSchema, type SignupInput } from '@/lib/validation/auth';

export function SignupForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: SignupInput) {
    setFormError('');
    const result = await signupAction(values);
    if (!result.ok) {
      setFormError(result.error);
      Object.entries(result.fieldErrors ?? {}).forEach(([name, message]) =>
        setError(name as keyof SignupInput, { message }),
      );
      return;
    }
    toast.success('Account created. Welcome to TripGoals!');
    notifyAuthChanged();
    router.replace(next);
    router.refresh();
  }

  const a11y = (name: keyof SignupInput) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" placeholder="Your name" {...a11y('name')} {...register('name')} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...a11y('email')} {...register('email')} />
      </Field>
      <Field label="Phone (optional)" htmlFor="phone" error={errors.phone?.message} hint="Used to prefill your WhatsApp enquiries.">
        <Input id="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...a11y('phone')} {...register('phone')} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters.">
        <PasswordInput id="password" autoComplete="new-password" {...a11y('password')} {...register('password')} />
      </Field>
      <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <PasswordInput id="confirmPassword" autoComplete="new-password" {...a11y('confirmPassword')} {...register('confirmPassword')} />
      </Field>

      {formError ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Create account
      </Button>
    </form>
  );
}
