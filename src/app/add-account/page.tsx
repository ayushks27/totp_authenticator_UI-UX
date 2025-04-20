'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, KeyRound, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import AccountFormModal from '@/components/totp/AccountFormModal';
import QRCodeScanner from '@/components/totp/QRCodeScanner';
import { toast } from 'sonner';
import { useAccounts } from '@/context/AccountContext';

export default function AddAccountPage() {
  const router = useRouter();
  const { accounts } = useAccounts();
  const [activeTab, setActiveTab] = useState('manual');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const goToCodesPage = () => {
    if (accounts.length > 0) {
      router.push('/codes');
    } else {
      toast.error('You need to add at least one account first');
    }
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">Add New Account</h1>
              <p className="text-muted-foreground mt-1">
                Add a new TOTP account to generate authentication codes
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={goToCodesPage}>
              View All Codes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="gap-2">
                <KeyRound className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="scan" className="gap-2">
                <QrCode className="h-4 w-4" />
                Scan QR Code
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5" />
                    Manual Entry
                  </CardTitle>
                  <CardDescription>
                    Enter the account details manually using the secret key provided by the service.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground">
                      When setting up 2FA, services typically provide a secret key that looks like
                      "JBSWY3DPEHPK3PXP". Enter this key along with other account details to add a new
                      TOTP account.
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button onClick={handleOpenAddModal} className="gap-2">
                        <KeyRound className="h-4 w-4" />
                        Enter Account Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scan" className="mt-6">
              <QRCodeScanner />
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Here's how to find your TOTP secret key
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">From a QR code</h3>
                    <p className="text-sm text-muted-foreground">
                      When setting up 2FA, most services show a QR code. Select the "Scan QR Code" tab
                      above and allow camera access to scan it directly.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">From a secret key</h3>
                    <p className="text-sm text-muted-foreground">
                      Many services also show a text code labeled as "secret key" or similar.
                      Use this key with the "Manual Entry" option above.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">From backup codes</h3>
                    <p className="text-sm text-muted-foreground">
                      Backup codes are different from TOTP secrets. Keep your backup codes in a safe place,
                      but they cannot be used with this authenticator app.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AccountFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      />
    </PageLayout>
  );
}
