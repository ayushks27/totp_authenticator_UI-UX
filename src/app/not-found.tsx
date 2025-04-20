'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function NotFound() {
  return (
    <PageLayout withoutAuth>
      <div className="container py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-destructive/10 p-6 mb-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
