'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarClock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import {
  CALLBACK_REASONS,
  CALLBACK_TIMES,
  CONTACT_SUBJECTS,
  callbackSchema,
  contactSchema,
  type CallbackInput,
  type ContactInput,
} from '@/lib/validation/contact';
import { callbackMessage, contactMessage, whatsappLink } from '@/lib/whatsapp';

function openWhatsApp(message: string) {
  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' },
  });

  function onSubmit(values: ContactInput) {
    openWhatsApp(contactMessage(values));
    toast.success('Opening WhatsApp — just press send to reach us.');
    reset();
  }

  const a11y = (field: keyof ContactInput) => ({
    'aria-invalid': !!errors[field],
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input id="firstName" autoComplete="given-name" {...a11y('firstName')} {...register('firstName')} />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input id="lastName" autoComplete="family-name" {...a11y('lastName')} {...register('lastName')} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...a11y('email')} {...register('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...a11y('phone')} {...register('phone')} />
        </Field>
      </div>
      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <NativeSelect id="subject" {...a11y('subject')} {...register('subject')}>
          <option value="">Select a subject</option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell us about your travel plans or how we can help…"
          {...a11y('message')}
          {...register('message')}
        />
      </Field>
      <Button type="submit" size="xl" disabled={isSubmitting} className="w-full sm:w-fit">
        <Send /> Send message
      </Button>
      <p className="text-muted-foreground text-xs">
        Sending opens WhatsApp with your message prefilled, so our team can reply to you directly.
      </p>
    </form>
  );
}

/** A button (styled by the caller via className/children) that opens the callback-request dialog. */
export function CallbackButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackInput>({
    resolver: zodResolver(callbackSchema),
    defaultValues: { name: '', phone: '', time: '', reason: '' },
  });

  function onSubmit(values: CallbackInput) {
    openWhatsApp(callbackMessage(values));
    toast.success('Callback request ready — press send in WhatsApp and we will call you.');
    setOpen(false);
    reset();
  }

  const a11y = (field: keyof CallbackInput) => ({
    'aria-invalid': !!errors[field],
    'aria-describedby': errors[field] ? `cb-${field}-error` : undefined,
  });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[1.75rem] p-7 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-medium tracking-tight">
              <CalendarClock className="text-primary size-6" /> Request a callback
            </DialogTitle>
            <DialogDescription>Tell us when to call and we&apos;ll take it from there.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
            <Field label="Name" htmlFor="cb-name" error={errors.name?.message}>
              <Input id="cb-name" autoComplete="name" {...a11y('name')} {...register('name')} />
            </Field>
            <Field label="Phone number" htmlFor="cb-phone" error={errors.phone?.message}>
              <Input id="cb-phone" type="tel" autoComplete="tel" {...a11y('phone')} {...register('phone')} />
            </Field>
            <Field label="Preferred time" htmlFor="cb-time" error={errors.time?.message}>
              <NativeSelect id="cb-time" {...a11y('time')} {...register('time')}>
                <option value="">Select preferred time</option>
                {CALLBACK_TIMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Reason for call" htmlFor="cb-reason" error={errors.reason?.message}>
              <NativeSelect id="cb-reason" {...a11y('reason')} {...register('reason')}>
                <option value="">Select reason</option>
                {CALLBACK_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Button type="submit" size="xl">
              Request callback
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
