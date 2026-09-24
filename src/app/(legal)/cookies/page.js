'use client';

import PageTitle from '@/components/layout/PageTitle';

export default function CookiesPage() {
  return (
    <>
      <PageTitle title="Política de Cookies" />

      <article className="policy-content">
        <h1>Política de Cookies</h1>
        <p className="policy-meta">Última actualización: 23 de junio de 2026</p>

        <p>
          En <strong>Sazón Habana</strong>, utilizamos cookies para mejorar tu experiencia
          en nuestra plataforma. Esta política explica qué son las cookies, cómo las
          usamos y cómo puedes gestionarlas.
        </p>

        <h2>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
          cuando visitas un sitio web. Nos ayudan a recordar tus preferencias y a
          analizar cómo interactúas con nuestra plataforma.
        </p>

        <h2>2. Tipos de cookies que utilizamos</h2>
        <ul>
          <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento básico de la plataforma (ej. mantener tu sesión iniciada).</li>
          <li><strong>Cookies de preferencias:</strong> recuerdan tus configuraciones como el tema oscuro o tus preferencias culinarias.</li>
          <li><strong>Cookies analíticas:</strong> nos ayudan a entender cómo los usuarios interactúan con Sazón Habana para mejorar nuestros servicios.</li>
        </ul>

        <h2>3. Gestión de cookies</h2>
        <p>
          Puedes gestionar o desactivar las cookies desde la configuración de tu
          navegador. Ten en cuenta que algunas funcionalidades de la plataforma podrían
          verse afectadas si desactivas las cookies.
        </p>

        <h2>4. Cookies de terceros</h2>
        <p>
          No utilizamos cookies de terceros para publicidad. Solo empleamos cookies
          propias para mejorar tu experiencia y analizar el uso de la plataforma.
        </p>

        <h2>5. Contacto</h2>
        <p>
          Si tienes preguntas sobre nuestra política de cookies, contáctanos en:{' '}
          <strong>cookies@sazonhabana.com</strong>
        </p>
      </article>
    </>
  );
}