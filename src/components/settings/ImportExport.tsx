'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAccounts } from '@/context/AccountContext';
import { toast } from 'sonner';
import { Download, Upload, Copy, Trash2, AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ImportExport() {
  const { accounts, exportAccounts, importAccounts, clearAccounts } = useAccounts();
  const [importText, setImportText] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExport = () => {
    try {
      const data = exportAccounts();
      setShowExportDialog(true);
      return data;
    } catch (error) {
      toast.error('Failed to export accounts');
      return '';
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        toast.error('Invalid import data format. Expected an array.');
        return;
      }

      importAccounts(parsed);
      toast.success(`Imported ${parsed.length} accounts successfully`);
      setImportText('');
      setShowImportDialog(false);
    } catch (error) {
      toast.error('Invalid JSON data. Please check the format.');
    }
  };

  const handleClear = () => {
    clearAccounts();
    toast.success('All accounts cleared');
    setShowClearDialog(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Import, export, or clear your TOTP accounts data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4" />
            Import Accounts
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExport}
            disabled={accounts.length === 0}
          >
            <Download className="h-4 w-4" />
            Export Accounts
          </Button>

          <Button
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => setShowClearDialog(true)}
            disabled={accounts.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Exported data is not encrypted. Keep it safe and do not share it with others.
          </AlertDescription>
        </Alert>
      </CardContent>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Accounts</DialogTitle>
            <DialogDescription>
              Paste your exported JSON data below to import accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='[{"name": "Example", "issuer": "Example", ...}]'
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Accounts</DialogTitle>
            <DialogDescription>
              Copy this data to import your accounts on another device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Textarea
                value={exportAccounts()}
                readOnly
                className="min-h-[200px] font-mono text-sm pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(exportAccounts())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowExportDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Accounts</DialogTitle>
            <DialogDescription>
              This will delete all your TOTP accounts. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You will lose access to all your 2FA codes after clearing data.
                Make sure you have backup methods for your accounts.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Clear All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
