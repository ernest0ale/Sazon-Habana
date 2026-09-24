'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import WizardProgress from '@/components/solicitar/WizardProgress';
import WizardStep1 from '@/components/solicitar/WizardStep1';
import WizardStep2 from '@/components/solicitar/WizardStep2';
import WizardStep3 from '@/components/solicitar/WizardStep3';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { validateSolicitudStep } from '@/lib/validators/solicitud.validator';

const RANGOS_INICIALES = [
  { diaDesde: 'Lunes', diaHasta: 'Viernes', horaInicio: '09:00', horaFin: '22:00', cerrado: false },
  { diaDesde: 'Sábado', diaHasta: 'Sábado', horaInicio: '10:00', horaFin: '23:00', cerrado: false },
  { diaDesde: 'Domingo', diaHasta: 'Domingo', horaInicio: '10:00', horaFin: '18:00', cerrado: false }
];

const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function generarTextoHorario(rangos) {
  const horarios = {};
  DIAS_ORDEN.forEach((d) => { horarios[d] = null; });

  rangos.forEach((r) => {
    const i1 = DIAS_ORDEN.indexOf(r.diaDesde);
    const i2 = DIAS_ORDEN.indexOf(r.diaHasta);
    for (let i = i1; i <= i2; i++) {
      horarios[DIAS_ORDEN[i]] = r.cerrado ? 'Cerrado' : `${r.horaInicio} - ${r.horaFin}`;
    }
  });

  return DIAS_ORDEN.map((d) => `${d}: ${horarios[d] || 'Cerrado'}`).join(' | ');
}

export default function SolicitarEspacioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    nombre: '',
    tipo: '',
    precio: '',
    telefono: '',
    descripcion: '',
    img: '',
    aire: false,
    clima: false,
    parqueo: false,
    municipio: '',
    direccion: '',
    lat: 23.1136,
    lng: -82.3666
  });
  const [horarios, setHorarios] = useState(RANGOS_INICIALES);
  const [fileLegal, setFileLegal] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const next = () => {
    const v = validateSolicitudStep(step, data, horarios);
    if (!v.ok) {
      toast.error('Faltan datos', v.errors[0]);
      return;
    }

    if (step === 3) {
      if (!fileLegal) {
        toast.error('Documento requerido', 'Debes adjuntar tu documento legal.');
        return;
      }
      if (!acceptedTerms) {
        toast.error('Acepta los términos', 'Debes aceptar la declaración.');
        return;
      }
      submitSolicitud();
      return;
    }

    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submitSolicitud = async () => {
    setSending(true);
    try {
      const payload = {
        ...data,
        horario: generarTextoHorario(horarios),
        fileLegal,
        acceptedTerms,
        nombreGestor: user?.nombre || 'Solicitante',
        emailGestor: user?.email || '',
        passwordGestor: user?.password || '',
        horariosPorDia: horarios
      };

      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo enviar la solicitud.');
      }

      toast.success('Solicitud Enviada', 'Tu solicitud será revisada.');
      router.push('/');
    } catch (err) {
      toast.error('Error', err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Solicitar Espacio"
        eyebrow="Crece con Sazón"
        heading="Solicitar mi espacio"
        subtitle="Promociona tu espacio gastronómico en La Habana."
      />

      <div className="solicitar-page">
        <div className="solicitar-container">
          <div className="solicitar-card">
            <WizardProgress currentStep={step} />

            <form onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <WizardStep1
                  data={data}
                  onChange={update}
                  horarios={horarios}
                  onHorariosChange={setHorarios}
                />
              )}
              {step === 2 && <WizardStep2 data={data} onChange={update} />}
              {step === 3 && (
                <WizardStep3
                  data={data}
                  onChange={update}
                  onFileSelected={(info) => setFileLegal(info.name)}
                  acceptedTerms={acceptedTerms}
                  onAcceptedTermsChange={setAcceptedTerms}
                  fileName={fileLegal}
                />
              )}
            </form>

            <div className="solicitar-nav">
              <Button
                type="button"
                variant="ghost"
                onClick={prev}
                disabled={step === 1}
                icon="fa-solid fa-chevron-left"
                iconPosition="left"
              >
                Atrás
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={next}
                  icon="fa-solid fa-chevron-right"
                  iconPosition="right"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={next}
                  disabled={sending}
                  icon="fa-solid fa-circle-check"
                  iconPosition="left"
                >
                  {sending ? 'Enviando...' : 'Enviar Solicitud'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .solicitar-page { flex: 1; padding: 0 0 3rem; }
          .solicitar-container {
            max-width: 56rem;
            margin: 0 auto;
            padding: 0 1rem;
          }
          @media (min-width: 640px) { .solicitar-container { padding: 0 1.5rem; } }
          .solicitar-card {
            background: var(--brand-card);
            padding: 2rem;
            border-radius: var(--radius-xl);
            border: 1px solid var(--brand-border);
            box-shadow: var(--shadow-lg);
          }
          @media (min-width: 768px) {
            .solicitar-card { padding: 2.5rem; }
          }
          .solicitar-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(200, 214, 192, 0.4);
            margin-top: 2rem;
            gap: 1rem;
          }
        `}</style>
      </div>
    </>
  );
}