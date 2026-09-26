import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { SearchProvider } from '@/contexts/SearchContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchOverlay from '@/components/ui/SearchOverlay';
import OfflineBanner from '@/components/ui/OfflineBanner';
import CookieBanner from '@/components/ui/CookieBanner';
import BugReportButton from '@/components/ui/BugReportButton';
import Analytics from '@/components/ui/Analytics';
import ErrorReporter from '@/components/ui/ErrorReporter';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic']
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://sazonhabana.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Sazón Habana',
    template: '%s'
  },

  description:
    'Descubre los mejores restaurantes, paladares y cafeterías de La Habana. Cartas completas, ubicaciones en mapa y reseñas de la comunidad.',

  keywords: [
    'restaurantes',
    'paladares',
    'La Habana',
    'Cuba',
    'gastronomía',
    'cafeterías',
    'dulcerías',
    'Sazón Habana',
    'Ernesto Alejandro García Seuret',
    'ernest0ale',
  ],

  // 👇 Autoría / creador / publicador
  authors: [
    {
      name: 'Ernesto Alejandro García Seuret',
      url: 'https://github.com/ernest0ale',
    },
    {
      name: 'TU_COMPAÑERA_DISEÑADORA',
      // url: 'https://instagram.com/usuario',
    },
    {
      name: 'TU_COMPAÑERA_BACKEND',
      // url: 'https://github.com/usuario',
    },
    {
      name: 'TU_COMPAÑERO_ANALISTA',
      // url: 'https://github.com/usuario',
    },
  ],
  creator: 'Sazón Habana',
  publisher: 'Ernesto Alejandro García Seuret (ernest0ale)',
  category: 'gastronomía',

  // Metas adicionales de autoría
  other: {
    'author': 'Sazón Habana',
    'designer': 'TU_COMPAÑERA_DISEÑADORA',
    'developer': 'Ernesto Alejandro García Seuret',
    'developer:backend': 'TU_COMPAÑERA_BACKEND',
    'analyst': 'TU_COMPAÑERO_ANALISTA',
    'backend:supervisor': 'TU_COMPAÑERO_ANALISTA',
    'publisher': 'Ernesto Alejandro García Seuret (ernest0ale)',
    'contact': 'ernest0ale',
    'instagram:developer': '@ernest0ale',
  },

  openGraph: {
    title: 'Sazón Habana',
    description: 'Descubre los mejores restaurantes de La Habana.',
    url: SITE_URL,
    siteName: 'Sazón Habana',
    locale: 'es_CU',
    type: 'website',
    authors: [
      'https://github.com/ernest0ale',
      // agrega aquí los perfiles de tus compañeros si los tienes
    ],
  },

  icons: {
    icon: '/images/sazonHabana_lightLogo.png'
  },

  // 👇 Verificación de Google Search Console
  verification: {
    google: 'APl7R9jLPAZuySiLVj3gSrFkP2tJEG_3b2Nn1dEfvFA',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#5B8A72'
};

// JSON-LD: sitio, organización y equipo (personas con sus roles)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Sazón Habana',
      description:
        'Descubre los mejores restaurantes, paladares y cafeterías de La Habana. Cartas completas, ubicaciones en mapa y reseñas de la comunidad.',
      inLanguage: 'es-CU',
      creator: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#publisher` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Sazón Habana',
      url: SITE_URL,
      // sameAs: ['https://instagram.com/sazonhabana'], // ← si tienen redes
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#publisher`,
      name: 'Ernesto Alejandro García Seuret',
      alternateName: 'ernest0ale',
      url: 'https://github.com/ernest0ale',
      jobTitle: 'Desarrollador Web (Frontend)',
      sameAs: [
        'https://github.com/ernest0ale',
        'https://instagram.com/ernest0ale',
        'https://t.me/ernest0ale',
      ],
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#designer`,
      name: 'TU_COMPAÑERA_DISEÑADORA',
      jobTitle: 'Diseñadora Visual',
      // url: 'https://instagram.com/usuario',
      // sameAs: ['https://instagram.com/usuario'],
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#backend`,
      name: 'TU_COMPAÑERA_BACKEND',
      jobTitle: 'Desarrolladora Backend',
      // url: 'https://github.com/usuario',
      // sameAs: ['https://github.com/usuario'],
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#analyst`,
      name: 'TU_COMPAÑERO_ANALISTA',
      jobTitle: 'Analista de Negocio y Casos de Uso',
      description:
        'Define escenarios de uso (p. ej. cliente que busca opciones vs. cliente que ya sabe a dónde ir) y supervisa que el backend los cubra.',
      // url: 'https://github.com/usuario',
      // sameAs: ['https://github.com/usuario'],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* JSON-LD con autoría, organización y equipo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <SearchProvider>
                <a href="#main-content" className="skip-to-content">
                  Saltar al contenido principal
                </a>

                <Header />

                <main id="main-content" className="app-main">
                  {children}
                </main>

                <Footer />

                <SearchOverlay />
                <OfflineBanner />
                <CookieBanner />
                <BugReportButton />
                <Analytics />
                <ErrorReporter />
              </SearchProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>

        <style jsx global>{`
          .app-main {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </body>
    </html>
  );
}
