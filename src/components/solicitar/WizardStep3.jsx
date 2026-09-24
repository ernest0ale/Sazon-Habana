'use client';

import { useRef, useState } from 'react';
import { useToast } from '@/hooks/useToast';

/**
 * WizardStep3 - Paso 3: verificación legal
 *
 * Props:
 *   data (object)
 *   onChange (fn: (key, value) => void)
 *   onFileSelected (fn: (fileInfo) => void)
 *   acceptedTerms (bool)
 *   onAcceptedTermsChange (fn: (val) => void)
 *   fileName (string)
 *   errors (object)
 */
export default function WizardStep3({
  data,
  onChange,
  onFileSelected,
  acceptedTerms,
  onAcceptedTermsChange,
  fileName = '',
  errors = {}
}) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [localFileName, setLocalFileName] = useState(fileName);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones básicas
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

    if (file.size > MAX_SIZE) {
      toast.error('Archivo muy grande', 'El archivo no debe superar los 5 MB.');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Formato no permitido', 'Solo se aceptan PDF, JPG o PNG.');
      return;
    }

    // Sanitizar nombre de archivo
    const cleanName = file.name.replace(/[<>:"|?*\u0000-\u001F]/g, '').slice(0, 200);

    setLocalFileName(cleanName);
    onFileSelected?.({ name: cleanName, size: file.size, type: file.type });
    toast.success('Archivo Cargado', `Se seleccionó ${cleanName}`);
  };

  return (
    <div className="wizard-step-3">
      <h3 className="wizard-step-title">
        <i className="fa-solid fa-gavel wizard-step-icon" />
        Verificación Legal
      </h3>

      <p className="wiz-intro">
        Para operar en la plataforma, requerimos constancia de tu licencia comercial o TCP.
      </p>

      <div className="wiz-file-upload">
        <div className="wiz-file-icon-wrapper">
          <i className="fa-solid fa-file-pdf" />
        </div>
        <h4 className="wiz-file-title">Subir Licencia Comercial o Identidad</h4>
        <p className="wiz-file-sub">Máximo 5 MB · PDF, JPG o PNG</p>

        <input
          ref={fileInputRef}
          type="file"
          id="wiz-file-legal"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="wiz-file-input"
        />

        <button
          type="button"
          className="wiz-file-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Seleccionar archivo
        </button>

        {localFileName && (
          <div className="wiz-file-name">
            <i className="fa-solid fa-circle-check" /> Archivo: {localFileName}
          </div>
        )}

        {errors.fileLegal && <p className="wiz-error">{errors.fileLegal}</p>}
      </div>

      <div className="wiz-terms-box">
        <label className="wiz-terms-check">
          <input
            type="checkbox"
            id="wiz-chk-responsable"
            checked={acceptedTerms}
            onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          />
          <span>
            Declaro que la información es verídica y corresponde a mi negocio
            legalmente constituido.
          </span>
        </label>
        {errors.terms && <p className="wiz-error">{errors.terms}</p>}
      </div>

      <style jsx>{`
        .wizard-step-3 {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .wizard-step-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(200, 214, 192, 0.3);
          padding-bottom: 0.5rem;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wizard-step-icon { color: var(--brand-primary); }

        .wiz-intro {
          font-size: 0.875rem;
          color: var(--brand-text);
          opacity: 0.7;
          line-height: 1.5;
        }

        .wiz-file-upload {
          border: 2px dashed var(--brand-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
          text-align: center;
          background: var(--brand-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .wiz-file-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(91, 138, 114, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          color: var(--brand-primary);
          margin-bottom: 0.5rem;
        }

        .wiz-file-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--brand-text);
        }

        .wiz-file-sub {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.5;
          margin-bottom: 0.75rem;
        }

        .wiz-file-input {
          display: none;
        }

        .wiz-file-btn {
          background: var(--brand-primary);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wiz-file-btn:hover {
          background: var(--brand-hover);
        }

        .wiz-file-name {
          font-size: 0.75rem;
          color: var(--brand-secondary);
          font-weight: 700;
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .wiz-terms-box {
          padding: 1rem;
          background: #fef9e7;
          border: 1px solid #f4e2b1;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        :global(html.dark) .wiz-terms-box {
          background: #332A20;
          border-color: #4a3a24;
        }

        .wiz-terms-check {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: var(--brand-text);
          line-height: 1.5;
        }

        .wiz-terms-check input[type="checkbox"] {
          accent-color: var(--brand-primary);
          width: 1rem;
          height: 1rem;
          margin-top: 0.15rem;
          cursor: pointer;
          flex-shrink: 0;
        }

        .wiz-error {
          font-size: 0.75rem;
          color: #dc3545;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}