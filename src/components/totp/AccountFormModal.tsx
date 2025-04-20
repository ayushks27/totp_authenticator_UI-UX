'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Account, colorOptions, defaultCategories, generateQRCode } from '@/lib/totp';
import { useAccounts } from '@/context/AccountContext';
import { toast } from 'sonner';
import { Image } from 'lucide-react';

const accountFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  issuer: z.string().min(1, { message: "Issuer is required" }),
  secret: z.string().min(1, { message: "Secret key is required" }),
  algorithm: z.string(),
  digits: z.coerce.number().int().min(4).max(10),
  period: z.coerce.number().int().min(10).max(60),
  category: z.string(),
  color: z.string(),
  icon: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type AccountFormProps = {
  isOpen: boolean;
  onClose: () => void;
  editAccount?: Account;
};

export default function AccountFormModal({ isOpen, onClose, editAccount }: AccountFormProps) {
  const { addAccount, updateAccount } = useAccounts();
  const [qrCode, setQrCode] = useState<string | null>(null);

  const defaultValues: Partial<AccountFormValues> = {
    name: '',
    issuer: '',
    secret: '',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    category: 'Uncategorized',
    color: '#6366f1',
    icon: '',
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: editAccount
      ? { ...editAccount }
      : defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (editAccount) {
        Object.keys(editAccount).forEach((key) => {
          const typedKey = key as keyof AccountFormValues;
          if (typedKey !== 'id' && typedKey !== 'createdAt') {
            form.setValue(typedKey, editAccount[typedKey]);
          }
        });
      } else {
        form.reset(defaultValues);
      }
    }
  }, [isOpen, editAccount, form]);

  // Update QR code when form values change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (['name', 'issuer', 'secret', 'algorithm', 'digits', 'period'].includes(name || '')) {
        const formData = form.getValues();

        // Only generate QR if we have minimal required data
        if (formData.secret && formData.name) {
          try {
            const tmpAccount = {
              id: 'temp',
              name: formData.name,
              issuer: formData.issuer || formData.name,
              secret: formData.secret,
              algorithm: formData.algorithm || 'SHA1',
              digits: formData.digits || 6,
              period: formData.period || 30,
              category: formData.category || 'Uncategorized',
              color: formData.color || '#6366f1',
              createdAt: Date.now(),
            };

            const qrCodeData = generateQRCode(tmpAccount);
            setQrCode(qrCodeData);
          } catch (error) {
            setQrCode(null);
          }
        } else {
          setQrCode(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: AccountFormValues) {
    if (editAccount) {
      updateAccount({
        ...editAccount,
        ...data,
      });
      toast.success('Account updated successfully');
    } else {
      addAccount(data);
      toast.success('Account added successfully');
    }

    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editAccount ? 'Edit' : 'Add'} TOTP Account</DialogTitle>
          <DialogDescription>
            {editAccount
              ? 'Update your TOTP account information below.'
              : 'Add a new TOTP account to generate authentication codes.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Gmail, GitHub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer/Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google, Microsoft" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JBSWY3DPEHPK3PXP" {...field} />
                    </FormControl>
                    <FormDescription>
                      The secret key provided by the service when setting up 2FA.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="algorithm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Algorithm</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select algorithm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SHA1">SHA1</SelectItem>
                          <SelectItem value="SHA256">SHA256</SelectItem>
                          <SelectItem value="SHA512">SHA512</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="digits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Digits</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Digits" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6">6 digits</SelectItem>
                          <SelectItem value="8">8 digits</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period (seconds)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {defaultCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color">
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: field.value }}
                                />
                                {colorOptions.find(c => c.value === field.value)?.name || 'Select color'}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {qrCode && (
                <div className="border p-4 rounded-md flex flex-col items-center justify-center bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-2">Preview QR Code</p>
                  <img
                    src={qrCode}
                    alt="TOTP QR Code"
                    className="w-32 h-32"
                  />
                </div>
              )}

              {!qrCode && (
                <div className="border p-4 rounded-md flex flex-col items-center justify-center bg-muted/30 h-36">
                  <Image className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Fill in the fields to see a QR code preview
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editAccount ? 'Update' : 'Add'} Account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
