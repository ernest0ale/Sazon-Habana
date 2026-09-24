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

export const metadata = {
  title: {
    default: 'Sazón Habana',
    template: '%s'
  },
  description:
    'Descubre los mejores restaurantes, paladares y cafeterías de La Habana. Cartas completas, ubicaciones en mapa y reseñas de la comunidad.',
  keywords: 'restaurantes, paladares, La Habana, Cuba, gastronomía, cafeterías, dulcerías',
  authors: [{ name: 'Sazón Habana' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Sazón Habana',
    description: 'Descubre los mejores restaurantes de La Habana.',
    url: 'https://sazonhabana.vercel.app',
    siteName: 'Sazón Habana',
    locale: 'es_CU',
    type: 'website'
  },
  icons: {
    icon: '/images/sazonHabana_lightLogo.png'
  },
  // 👇 Verificación de Google Search Console
  verification: {
    google: 'APl7R9jLPAZuySiLVj3gSrFkP2tJEG_3b2Nn1dEfvFA',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#5B8A72'
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