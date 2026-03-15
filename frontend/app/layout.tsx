import './globals.css';
import type { ReactNode } from 'react';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'Forum',
  description: 'Firebase-authenticated forum',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <AuthProvider>
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
            <header className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-slate-50">Forum</h1>
                <p className="text-sm text-slate-400">
                  Simple discussion forum with Firebase Auth.
                </p>
              </div>
              <AuthHeader />
            </header>
            <main className="flex-1">{children}</main>
            <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500">
              Powered by Next.js, NestJS, Firebase, and MongoDB.
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

function AuthHeader() {
  return (
    <div className="flex items-center gap-3">
      <AuthUserInfo />
      <AuthButtons />
    </div>
  );
}

import { AuthButtons } from '../components/AuthButtons';
import { AuthUserInfo } from '../components/AuthUserInfo';

