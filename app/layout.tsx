import './globals.css';
import { Inter } from 'next/font/google';
import AppDataProvider from '@/components/AppDataProvider'; // Link to your provider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Maya AI',
  description: 'The Love Link',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppDataProvider>
          {children}
        </AppDataProvider>
      </body>
    </html>
  );
}
