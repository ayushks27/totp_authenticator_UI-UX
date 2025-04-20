'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Settings, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import PageLayout from '@/components/layout/PageLayout';
import ImportExport from '@/components/settings/ImportExport';
import PasswordSettings from '@/components/settings/PasswordSettings';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [showSeconds, setShowSeconds] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showCopyButton, setShowCopyButton] = useState(true);

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <RadioGroup
                    defaultValue={theme}
                    onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Display Options</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-seconds" className="cursor-pointer">
                      Show seconds countdown
                    </Label>
                    <Switch
                      id="show-seconds"
                      checked={showSeconds}
                      onCheckedChange={setShowSeconds}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh" className="cursor-pointer">
                      Auto-refresh codes
                    </Label>
                    <Switch
                      id="auto-refresh"
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="copy-button" className="cursor-pointer">
                      Show copy button
                    </Label>
                    <Switch
                      id="copy-button"
                      checked={showCopyButton}
                      onCheckedChange={setShowCopyButton}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <PasswordSettings />
          </div>

          <div className="mt-4">
            <ImportExport />
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>
                  TOTP Authenticator information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Version</h3>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    A secure TOTP authenticator for generating time-based one-time
                    passwords (TOTP) for two-factor authentication (2FA).
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is stored locally on your device and encrypted.
                    We never send your TOTP secrets to any server.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
