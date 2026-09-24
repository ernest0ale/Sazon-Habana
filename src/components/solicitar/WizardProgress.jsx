'use client';

/**
 * WizardProgress - Indicador de pasos del wizard de solicitud
 *
 * Props:
 *   currentStep (number 1-3)
 */
const STEPS = [
  { num: 1, label: 'Detalles del Negocio' },
  { num: 2, label: 'Ubicación y Mapa' },
  { num: 3, label: 'Documentos Legales' }
];

export default function WizardProgress({ currentStep }) {
  return (
    <div className="wizard-progress">
      {STEPS.map((step, idx) => {
        const status =
          step.num < currentStep ? 'completed'
          : step.num === currentStep ? 'active'
          : 'pending';

        return (
          <div key={step.num} className="wizard-progress-item-wrapper">
            <div className={`wizard-progress-item wizard-progress-item--${status}`}>
              <span className={`wizard-progress-num wizard-progress-num--${status}`}>
                {status === 'completed' ? (
                  <i className="fa-solid fa-check" />
                ) : (
                  step.num
                )}
              </span>
              <span className="wizard-progress-label">{step.label}</span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="wizard-progress-connector" />
            )}
          </div>
        );
      })}

      <style jsx>{`
        .wizard-progress {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(200, 214, 192, 0.4);
        }

        .wizard-progress-item-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .wizard-progress-item-wrapper:last-child {
          flex: 0;
        }

        .wizard-progress-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
          gap: 0.5rem;
        }

        .wizard-progress-item--completed { color: var(--brand-primary); }
        .wizard-progress-item--active { color: var(--brand-primary); }
        .wizard-progress-item--pending { color: var(--brand-text); opacity: 0.45; }

        .wizard-progress-num {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .wizard-progress-num--completed {
          background: var(--brand-primary);
          color: #ffffff;
          box-shadow: var(--shadow-md);
        }
        .wizard-progress-num--active {
          background: var(--brand-primary);
          color: #ffffff;
          box-shadow: var(--shadow-md);
        }
        .wizard-progress-num--pending {
          background: rgba(200, 214, 192, 0.6);
          color: var(--brand-text);
          opacity: 0.5;
        }

        .wizard-progress-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
        }

        .wizard-progress-connector {
          width: 3rem;
          height: 4px;
          background: rgba(200, 214, 192, 0.5);
          margin: 0 0.5rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 640px) {
          .wizard-progress-label {
            font-size: 0.65rem;
          }
          .wizard-progress-connector {
            width: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}