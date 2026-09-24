'use client';

import PageTitle from '@/components/layout/PageTitle';

export default function TerminosPage() {
  return (
    <>
      <PageTitle title="Términos de Servicio" />

      <article className="policy-content">
        <h1>Términos de Servicio</h1>
        <p className="policy-meta">Última actualización: 23 de junio de 2026</p>

        <p>
          Bienvenido a <strong>Sazón Habana</strong>. Al utilizar nuestra plataforma,
          aceptas cumplir con los siguientes términos y condiciones.
        </p>

        <h2>1. Aceptación de los términos</h2>
        <p>
          Al registrarte o utilizar Sazón Habana, aceptas estos Términos de Servicio en
          su totalidad. Si no estás de acuerdo, por favor no utilices nuestra plataforma.
        </p>

        <h2>2. Registro y cuenta</h2>
        <p>
          Para acceder a ciertas funcionalidades, debes crear una cuenta. Eres
          responsable de mantener la confidencialidad de tu contraseña y de todas las
          actividades que ocurran bajo tu cuenta.
        </p>

        <h2>3. Contenido generado por el usuario</h2>
        <p>
          Los usuarios pueden publicar reseñas, calificaciones y comentarios. Eres el
          único responsable del contenido que publicas. Nos reservamos el derecho de
          eliminar contenido inapropiado o que viole estos términos.
        </p>

        <h2>4. Propiedad intelectual</h2>
        <p>
          Todo el contenido de Sazón Habana, incluyendo textos, gráficos, logotipos e
          imágenes, es propiedad de Sazón Habana o de sus licenciantes y está protegido
          por leyes de derechos de autor.
        </p>

        <h2>5. Limitación de responsabilidad</h2>
        <p>
          Sazón Habana actúa como un directorio de establecimientos gastronómicos. No
          somos responsables de la calidad, seguridad o disponibilidad de los
          restaurantes listados en nuestra plataforma.
        </p>

        <h2>6. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento.
          Los cambios serán publicados en esta página y entrarán en vigor inmediatamente.
        </p>

        <h2>7. Contacto</h2>
        <p>
          Para preguntas sobre estos términos, contáctanos en:{' '}
          <strong>legal@sazonhabana.com</strong>
        </p>
      </article>
    </>
  );
}