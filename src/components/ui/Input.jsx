'use client';

import { useState } from 'react';

/**
 * Input - Campo de texto reutilizable
 *
 * Props:
 *   id, name, type, value, onChange, onBlur
 *   label, placeholder, required, disabled
 *   error (string), help (string)
 *   maxLength, minLength, autoComplete
 *   icon (Font Awesome class)
 *   showPasswordToggle (bool, solo type="password")
 */
export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  help,
  maxLength,
  minLength,
  autoComplete,
  icon,
  showPasswordToggle = false,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && (
          <i className={`${icon} input-icon input-icon--left`} aria-hidden="true" />
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`input-field ${icon ? 'input-field--with-icon' : ''} ${showPasswordToggle ? 'input-field--with-toggle' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : help ? `${id}-help` : undefined}
          {...rest}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="input-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            <i className={showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'} />
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="input-error" role="alert">
          {error}
        </p>
      )}
      {!error && help && (
        <p id={`${id}-help`} className="input-help">
          {help}
        </p>
      )}

      <style jsx>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brand-text);
          opacity: 0.6;
        }

        .input-required { color: #dc3545; }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field {
          width: 100%;
          padding: 0.9rem 1rem;
          background: var(--brand-bg);
          color: var(--brand-text);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field::placeholder {
          color: var(--brand-text);
          opacity: 0.4;
        }
        .input-field:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
        }
        .input-field:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-field--with-icon { padding-left: 2.75rem; }
        .input-field--with-toggle { padding-right: 3rem; }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--brand-text);
          opacity: 0.5;
          font-size: 0.95rem;
          pointer-events: none;
        }

        .input-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--brand-text);
          opacity: 0.6;
          cursor: pointer;
          padding: 4px;
          font-size: 1rem;
        }
        .input-toggle:hover { opacity: 1; }

        .input-group--error .input-field {
          border-color: #dc3545;
        }
        .input-group--error .input-field:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
        }

        .input-error {
          font-size: 0.75rem;
          color: #dc3545;
          font-weight: 600;
        }

        .input-help {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}