import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LoginGate from '@/components/Auth/LoginGate';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nexus Live Dashboard',
    description: 'Pro Performance Tracking for Nexus Agency',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
                <LoginGate>
                    {children}
                </LoginGate>
            </body>
        </html>
    );
}
