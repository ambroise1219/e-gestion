import { Outfit } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'E-gestion',
  description: 'Système de gestion d\'entreprise'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${outfit.variable} font-sans h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-pro-white dark:bg-pro-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}