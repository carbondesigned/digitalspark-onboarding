import './globals.css';
import {Poppins} from 'next/font/google';

const inter = Poppins({weight: ['400', '600', '800'], subsets: ['latin-ext']});

export const metadata = {
  title: 'Onboarding | DigitalSpark',
  description: 'Onboarding for DigitalSpark',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
