'use client';

import PageTitle from '@/components/layout/PageTitle';

export default function PrivacidadPage() {
  return (
    <>
      <PageTitle title="Política de Privacidad" />

      <article className="policy-content">
        <h1>Política de Privacidad</h1>
        <p className="policy-meta">Última actualización: 23 de junio de 2026</p>

        <p>
          En <strong>Sazón Habana</strong>, nos comprometemos a proteger tu privacidad.
          Esta política explica cómo recopilamos, usamos y protegemos tu información
          personal cuando utilizas nuestra plataforma.
        </p>

        <h2>1. Información que recopilamos</h2>
        <p>Recopilamos la siguiente información cuando creas una cuenta o interactúas con nuestra plataforma:</p>
        <ul>
          <li><strong>Datos personales:</strong> nombre completo, correo electrónico, número de teléfono.</li>
          <li><strong>Preferencias culinarias:</strong> tipos de cocina que te interesan.</li>
          <li><strong>Interacciones:</strong> reseñas, calificaciones y comentarios que publicas.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, dispositivo y cookies.</li>
        </ul>

        <h2>2. Cómo usamos tu información</h2>
        <p>Utilizamos tus datos para:</p>
        <ul>
          <li>Crear y gestionar tu cuenta en Sazón Habana.</li>
          <li>Personalizar tu experiencia mostrándote restaurantes y ofertas relevantes.</li>
          <li>Procesar tus reseñas y calificaciones.</li>
          <li>Enviarte comunicaciones relacionadas con la plataforma (nunca spam).</li>
          <li>Mejorar nuestros servicios y analizar tendencias de uso.</li>
        </ul>

        <h2>3. Protección de tus datos</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu
          información contra accesos no autorizados, pérdida o alteración. Tus datos se
          almacenan de forma segura y solo son accesibles por personal autorizado.
        </p>

        <h2>4. Compartir información</h2>
        <p>
          No vendemos ni alquilamos tus datos personales a terceros. Podemos compartir
          información agregada y anónima con socios comerciales para fines analíticos.
        </p>

        <h2>5. Tus derechos</h2>
        <p>
          Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier
          momento. Puedes hacerlo desde la sección de configuración de tu perfil o
          contactándonos directamente.
        </p>

        <h2>6. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política, contáctanos en:{' '}
          <strong>privacidad@sazonhabana.com</strong>
        </p>
      </article>
    </>
  );
}