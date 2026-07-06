'use client';

import { IMaskInput } from 'react-imask';

function preparePhoneInput(value) {
  const raw = String(value || '');
  const digits = raw.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('375')) {
    return digits.slice(3);
  }

  if (digits.length === 11 && digits.startsWith('80')) {
    return digits.slice(2);
  }

  if (digits.length === 10 && digits.startsWith('0')) {
    return digits.slice(1);
  }

  return raw;
}

export default function PhoneInput({
  value = '',
  onChange,
  disabled = false,
  readOnly = false,
  error = false,
  id = 'phoneInput',
  name = 'phone',
  className = 'phone-input',
  placeholder = '(__) ___-__-__',
  autoFocus = false,
  required = false,
  'aria-describedby': ariaDescribedBy,
}) {
  const localValue = String(value || '').replace(/\D/g, '').slice(0, 9);

  return (
    <IMaskInput
      mask="(00) 000-00-00"
      unmask={true}
      lazy={false}
      placeholderChar="_"
      type="text"
      inputMode="numeric"
      autoComplete="tel"
      id={id}
      name={name}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      required={required}
      value={localValue}
      aria-invalid={Boolean(error)}
      aria-describedby={ariaDescribedBy}
      prepare={preparePhoneInput}
      onAccept={(unmaskedValue) => {
        onChange?.(String(unmaskedValue || '').replace(/\D/g, '').slice(0, 9));
      }}
    />
  );
}
