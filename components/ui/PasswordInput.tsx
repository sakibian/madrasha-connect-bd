/**
 * PasswordInput — password field with a show/hide toggle.
 *
 * Wraps a native `<input>` (not our `<Input>` component) because both
 * `Login` and the register pages use bespoke visual styling for the auth
 * screens; passing bare `className` in gives them the same layout freedom.
 *
 * Accessibility:
 *   - The toggle button is a real `<button type="button">` with an
 *     `aria-label` and `aria-pressed` state.
 *   - Toggle target is ≥ 44 × 44 px (iOS HIG).
 *   - The <input> retains autocomplete + name + all forwarded props.
 */

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Optional leading icon (e.g. Lock) rendered inside the field like the auth screens. */
  leadingIcon?: React.ReactNode;
  /** Aria label for the toggle button. Bengali by default. */
  showLabel?: string;
  hideLabel?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  { leadingIcon, showLabel = 'পাসওয়ার্ড দেখান', hideLabel = 'পাসওয়ার্ড লুকান', className = '', ...inputProps },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {leadingIcon && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={`w-full ${leadingIcon ? 'pl-14' : 'pl-6'} pr-14 py-5 bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium text-lg ${className}`}
        {...inputProps}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-black transition-colors"
        tabIndex={0}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

export default PasswordInput;
