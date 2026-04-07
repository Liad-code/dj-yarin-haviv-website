'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { submitContactForm } from '../../lib/actions';
import { tenantConfig } from '../../tenant.config';

// Event type display names for Hebrew message
const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'חתונה',
  birthday: 'יום הולדת',
  corporate: 'אירוע חברה',
  'bnei-mitzvah': 'בר/בת מצווה',
  private: 'מסיבה פרטית',
  other: 'אחר',
};

// Valid event types (whitelist for security)
const VALID_EVENT_TYPES = ['wedding', 'birthday', 'corporate', 'bnei-mitzvah', 'private', 'other'];

/**
 * Sanitize user input to prevent XSS and injection attacks
 * Removes HTML tags, trims whitespace, and limits length
 */
function sanitizeInput(input: string, maxLength: number = 100): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'`]/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate Israeli phone number format
 * Accepts: 05X-XXXXXXX, 05XXXXXXXX, +972-5X-XXXXXXX, etc.
 */
function isValidIsraeliPhone(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, '');
  // Israeli mobile: 10 digits starting with 05, or 12 digits starting with 9725
  return (
    (digits.length === 10 && digits.startsWith('05')) ||
    (digits.length === 12 && digits.startsWith('9725'))
  );
}

/**
 * Validate name - must be 2+ characters, Hebrew or English letters only
 */
function isValidName(name: string): boolean {
  // Allow Hebrew, English letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[\u0590-\u05FFa-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
}


export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    const sanitizedName = sanitizeInput(formData.name, 50);
    if (!isValidName(sanitizedName)) {
      errors.name = 'נא להזין שם תקין (2-50 תווים)';
    }

    // Validate phone
    if (!isValidIsraeliPhone(formData.phone)) {
      errors.phone = 'נא להזין מספר טלפון ישראלי תקין';
    }

    // Validate event type (whitelist check)
    if (!VALID_EVENT_TYPES.includes(formData.eventType)) {
      errors.eventType = 'נא לבחור סוג אירוע';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');

    // Validate before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs before use
      const sanitizedName = sanitizeInput(formData.name, 50);
      const sanitizedPhone = formData.phone.replace(/[^\d+\-\s]/g, '').slice(0, 20);
      const sanitizedEventType = (VALID_EVENT_TYPES.includes(formData.eventType) 
        ? formData.eventType 
        : 'other') as 'wedding' | 'birthday' | 'corporate' | 'bnei-mitzvah' | 'private' | 'other';

      // 1. Fire client-side Facebook Pixel tracking only (if fbq exists)
      if (typeof window !== 'undefined' && 'fbq' in window && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: sanitizedEventType,
          content_category: 'dj_event_inquiry',
          value: 0,
          currency: 'ILS',
        });
      }

      // 2. Submit form to server (save to DB and send emails)
      const result = await submitContactForm(tenantConfig.id, {
        name: sanitizedName,
        phone: sanitizedPhone,
        eventType: sanitizedEventType,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // 3. Show success message
      setSubmitStatus('success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', phone: '', eventType: '' });
        setSubmitStatus('idle');
        setIsSubmitting(false);
      }, 3000);

    } catch (error) {
      console.error('[ContactForm] Submit failed:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative z-10 mt-12 px-4 bg-transparent">
      <div className="relative mx-auto max-w-2xl pt-1 animate-fade-in-up">
        <div className="card-glow rounded-2xl p-8 backdrop-blur-md md:p-12 border border-white/10 hover:border-purple-500/30 transition-colors duration-300">
          <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
            האירוע שלכם מתחיל כאן
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-start text-lg font-medium text-white">
                שם
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
                }}
                required
                dir="rtl"
                maxLength={50}
                autoComplete="name"
                className={cn(
                  'w-full rounded-lg border bg-white/10 px-4 py-3',
                  'text-white placeholder:text-white/50',
                  'backdrop-blur-sm transition-all',
                  'focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50',
                  validationErrors.name ? 'border-red-500' : 'border-white/20'
                )}
                placeholder="השם המלא שלך"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-start text-lg font-medium text-white">
                טלפון
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
                }}
                required
                dir="ltr"
                maxLength={20}
                autoComplete="tel"
                inputMode="tel"
                pattern="[0-9+\-\s]*"
                className={cn(
                  'w-full rounded-lg border bg-white/10 px-4 py-3',
                  'text-white placeholder:text-white/50',
                  'backdrop-blur-sm transition-all',
                  'focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50',
                  validationErrors.phone ? 'border-red-500' : 'border-white/20'
                )}
                placeholder="050-000-0000"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="eventType" className="mb-2 block text-start text-lg font-medium text-white">
                מה חוגגים ?
              </label>
              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) => {
                  setFormData({ ...formData, eventType: e.target.value });
                  if (validationErrors.eventType) setValidationErrors({ ...validationErrors, eventType: '' });
                }}
                required
                className={cn(
                  'w-full rounded-lg border bg-white/10 px-4 py-3',
                  'text-white',
                  'backdrop-blur-sm transition-all',
                  'focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50',
                  validationErrors.eventType ? 'border-red-500' : 'border-white/20'
                )}
              >
                <option value="" className="bg-gray-900">בחר סוג אירוע</option>
                <option value="wedding" className="bg-gray-900">חתונה</option>
                <option value="birthday" className="bg-gray-900">יום הולדת</option>
                <option value="corporate" className="bg-gray-900">אירוע חברה</option>
                <option value="bnei-mitzvah" className="bg-gray-900">בר/בת מצווה</option>
                <option value="private" className="bg-gray-900">מסיבה פרטית</option>
                <option value="other" className="bg-gray-900">אחר</option>
              </select>
              {validationErrors.eventType && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.eventType}</p>
              )}
            </div>

            {submitStatus === 'success' && (
              <div className="rounded-lg bg-green-500/20 border border-green-500/30 p-4 text-center text-white">
                <div className="text-2xl mb-2">✓</div>
                <div className="font-bold">הפרטים נשלחו בהצלחה!</div>
                <div className="text-sm mt-1">ניצור איתך קשר בהקדם האפשרי</div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-center text-white">
                <div className="text-2xl mb-2">✗</div>
                <div className="font-bold">אופס, משהו השתבש</div>
                <div className="text-sm mt-1">אנא נסה שוב או צור קשר בטלפון</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4',
                'text-lg font-bold text-white',
                'transition-all hover:scale-105 hover:shadow-xl',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
              )}
            >
              {isSubmitting ? 'שולח...' : 'שלח פרטים'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

