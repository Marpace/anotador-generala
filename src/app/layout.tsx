import type { Metadata, Viewport } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Generala - Anotador',
  description: 'Anotador de puntos para el juego de Generala. Hasta 12 jugadores.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
