'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lock, Smartphone, Shield, Plus } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function Home() {
  return (
    <PageLayout withoutAuth className="pt-10 pb-20">
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Secure Two-Factor Authentication
              </h1>
              <p className="text-xl text-muted-foreground">
                A modern TOTP authenticator for your two-factor authentication needs.
                Keep your accounts secure with time-based one-time passwords.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/add-account">
                    <Plus className="h-5 w-5" />
                    <span>Add Account</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/codes">
                    <span>View Codes</span>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-32 w-32 text-primary/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Our TOTP authenticator generates time-based codes that expire after a short period, ensuring maximum security for your accounts.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-background p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="rounded-full p-4 bg-primary/10 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Add Account</h3>
              <p className="text-muted-foreground">
                Enter your TOTP secret key or scan a QR code to add a new account.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="rounded-full p-4 bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Generate Codes</h3>
              <p className="text-muted-foreground">
                Time-based verification codes are automatically generated every 30 seconds.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="rounded-full p-4 bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Stay Secure</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and stays on your device, keeping your accounts secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="bg-primary/5 p-8 md:p-12 rounded-2xl">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Private & Secure</h2>
                <p className="text-muted-foreground mb-6">
                  Your TOTP secrets are encrypted and stored only on your device.
                  We never transmit your data to any server, ensuring complete privacy.
                </p>
                <ul className="space-y-2">
                  {[
                    'Client-side encryption',
                    'No data sharing with third parties',
                    'No account or login required',
                    'Works offline',
                    'Import/export data securely',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <ChevronRight className="h-4 w-4 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="bg-background border rounded-xl p-6 shadow-md transform -rotate-3">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="h-6 w-6" />
                      <span className="font-medium">TOTP Authenticator</span>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="h-16 bg-muted/60 rounded-md animate-pulse" />
                      ))}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-full h-full bg-primary/10 rounded-xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Get Started Today</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Secure your online accounts with our easy-to-use TOTP authenticator.
            </p>
            <Button asChild size="lg" className="mt-6 gap-2">
              <Link href="/add-account">
                <Plus className="h-5 w-5" />
                <span>Add Your First Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
