'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';
import { useAccounts } from '@/context/AccountContext';
import SetPasswordModal from '@/components/auth/SetPasswordModal';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  withoutAuth?: boolean;
}

export default function PageLayout({ children, className, withoutAuth = false }: PageLayoutProps) {
  const { passwordSet } = useAccounts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn('flex-1', className)}>
        {!passwordSet && !withoutAuth ? (
          <div className="container py-8">
            <SetPasswordModal />
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
}
