'use client';

import Input from '@/components/ui/Input';
import HorarioRango from './HorarioRango';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * WizardStep1 - Paso 1: información del restaurante + horarios + comodidades
 *
 * Props:
 *   data (object)
 *   onChange (fn: (key, value) => void)
 *   horarios (array de rangos)
 *   onHorariosChange (fn: (nuevosRangos) => void)
 *   errors (object)
 */
export default function WizardStep1({
  data,
  onChange,
  horarios,
  onHorariosChange,
  errors = {}
}) {
  const addRango = () => {
    const newRango = {
      diaDesde: 'Lunes',
      diaHasta: 'Domingo',
      horaInicio: '09:00',
      horaFin: '22:00',
      cerrado: false
    };
    onHorariosChange([...horarios, newRango]);
  };

  const updateRango = (index, newRango) => {
    const next = [...horarios];
    next[index] = newRango;
    onHorariosChange(next);
  };

  const removeRango = (index) => {
    if (horarios.length <= 1) return;
    onHorariosChange(horarios.filter((_, i) => i !== index));
  };

  return (
    <div className="wizard-step-1">
      <h3 className="wizard-step-title">
        <i className="fa-solid fa-store wizard-step-icon" />
        Información del Restaurante
      </h3>

      <div className="wizard-grid-2">
        <Input
          id="wiz-nombre"
          type="text"
          label="Nombre del Establecimiento"
          placeholder="Ej. Paladar Doña Blanquita"
          value={data.nombre}
          onChange={(e) => onChange('nombre', e.target.value)}
          error={errors.nombre}
          required
          maxLength={120}
        />

        <div className="wiz-select-group">
          <label htmlFor="wiz-tipo" className="wiz-label">Tipo de Cocina *</label>
          <select
            id="wiz-tipo"
            className="wiz-select"
            value={data.tipo}
            onChange={(e) => onChange('tipo', e.target.value)}
            required
          >
            <option value="">Selecciona tipo...</option>
            <option value="criolla">Comida Criolla</option>
            <option value="rápida">Comida Rápida</option>
            <option value="italiana">Comida Italiana</option>
            <option value="mariscos">Mariscos</option>
            <option value="cafetería">Cafetería</option>
            <option value="heladería">Heladería</option>
            <option value="dulcería">Dulcería</option>
          </select>
          {errors.tipo && <p className="wiz-error">{errors.tipo}</p>}
        </div>
      </div>

      <div className="wizard-grid-2">
        <div className="wiz-select-group">
          <label htmlFor="wiz-precio" className="wiz-label">Rango de Precios *</label>
          <select
            id="wiz-precio"
            className="wiz-select"
            value={data.precio}
            onChange={(e) => onChange('precio', e.target.value)}
            required
          >
            <option value="">Selecciona nivel...</option>
            <option value="1">Económico ($)</option>
            <option value="2">Moderado ($$)</option>
            <option value="3">Premium ($$$)</option>
          </select>
          {errors.precio && <p className="wiz-error">{errors.precio}</p>}
        </div>

        <Input
          id="wiz-telefono"
          type="tel"
          label="Teléfono"
          placeholder="5XXXXXXX"
          value={data.telefono}
          onChange={(e) => onChange('telefono', e.target.value.replace(/\D/g, '').slice(0, 8))}
          error={errors.telefono}
          required
          maxLength={8}
        />
      </div>

      {/* Horarios */}
      <div className="wiz-horarios-section">
        <label className="wiz-label">Horario de Atención *</label>
        <p className="wiz-hint">Define los rangos de días con sus respectivos horarios</p>

        <div className="wiz-horarios-container">
          {horarios.map((rango, i) => (
            <HorarioRango
              key={i}
              index={i}
              value={rango}
              onChange={(nuevo) => updateRango(i, nuevo)}
              onRemove={() => removeRango(i)}
              canRemove={horarios.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          className="wiz-btn-add-rango"
          onClick={addRango}
        >
          <i className="fa-solid fa-plus" /> Agregar rango de días
        </button>

        {errors.horarios && <p className="wiz-error">{errors.horarios}</p>}
      </div>

      {/* Descripción */}
      <div className="wiz-textarea-group">
        <label htmlFor="wiz-descripcion" className="wiz-label">Descripción *</label>
        <textarea
          id="wiz-descripcion"
          className="wiz-textarea"
          rows={4}
          placeholder="Cuéntales tu propuesta..."
          value={data.descripcion}
          onChange={(e) => onChange('descripcion', e.target.value)}
          required
        />
        {errors.descripcion && <p className="wiz-error">{errors.descripcion}</p>}
      </div>

      <Input
        id="wiz-img"
        type="url"
        label="Foto de Portada (URL)"
        placeholder="https://..."
        value={data.img}
        onChange={(e) => onChange('img', e.target.value)}
        error={errors.img}
      />

      {/* Comodidades */}
      <div className="wiz-amenities">
        <p className="wiz-amenities-title">Comodidades</p>
        <div className="wiz-amenities-grid">
          <label className="wiz-amenity-check">
            <input
              type="checkbox"
              id="wiz-chk-aire"
              checked={data.aire}
              onChange={(e) => onChange('aire', e.target.checked)}
            />
            <span>Terraza</span>
          </label>
          <label className="wiz-amenity-check">
            <input
              type="checkbox"
              id="wiz-chk-clima"
              checked={data.clima}
              onChange={(e) => onChange('clima', e.target.checked)}
            />
            <span>Climatizado</span>
          </label>
          <label className="wiz-amenity-check">
            <input
              type="checkbox"
              id="wiz-chk-parqueo"
              checked={data.parqueo}
              onChange={(e) => onChange('parqueo', e.target.checked)}
            />
            <span>Parqueo Privado</span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .wizard-step-1 {
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

        .wizard-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .wizard-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .wiz-select-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .wiz-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--brand-text);
        }

        .wiz-select {
          background: var(--brand-bg);
          color: var(--brand-text);
          padding: 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--brand-border);
          outline: none;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .wiz-select:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
        }

        .wiz-horarios-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .wiz-hint {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }

        .wiz-horarios-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .wiz-btn-add-rango {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 2px dashed var(--brand-border);
          border-radius: var(--radius-md);
          color: var(--brand-text);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          margin-top: 0.75rem;
        }
        .wiz-btn-add-rango:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .wiz-textarea-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .wiz-textarea {
          background: var(--brand-bg);
          color: var(--brand-text);
          padding: 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--brand-border);
          outline: none;
          font-size: 0.95rem;
          font-family: inherit;
          resize: vertical;
        }
        .wiz-textarea:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
        }

        .wiz-amenities {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 0.75rem;
        }

        .wiz-amenities-title {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--brand-text);
          opacity: 0.7;
        }

        .wiz-amenities-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .wiz-amenities-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .wiz-amenity-check {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--brand-bg);
          border-radius: var(--radius-md);
          border: 1px solid rgba(200, 214, 192, 0.4);
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--brand-text);
        }

        .wiz-amenity-check input[type="checkbox"] {
          accent-color: var(--brand-primary);
          width: 1rem;
          height: 1rem;
          cursor: pointer;
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