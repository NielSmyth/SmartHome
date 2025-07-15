import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { AppStateProvider } from '@/context/app-state-context';

export const metadata: Metadata = {
  title: 'SmartHome',
  description: 'A smart home assistant application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppStateProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AppStateProvider>
        <footer className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white py-4">
          <div className="container mx-auto text-center">
            © 2025 Smart Home Automation
            By Daniel Iyonagbe
          </div>
        </footer>
      </body>
    </html>
  );
}
