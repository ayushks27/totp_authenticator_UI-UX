'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Plus, Search, Lock, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import TOTPCard from '@/components/totp/TOTPCard';
import AccountFormModal from '@/components/totp/AccountFormModal';
import { useAccounts } from '@/context/AccountContext';
import { Account, defaultCategories } from '@/lib/totp';

export default function CodesPage() {
  const { accounts, isLoading, searchTerm, setSearchTerm, categoryFilter, setCategoryFilter } = useAccounts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | undefined>(undefined);

  const filteredAccounts = useMemo(() => {
    if (!accounts) return [];

    let filtered = [...accounts];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (account) =>
          account.name.toLowerCase().includes(lowerSearch) ||
          account.issuer.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter(
        (account) => account.category === categoryFilter
      );
    }

    // Sort accounts by issuer then name
    return filtered.sort((a, b) => {
      const issuerA = a.issuer.toLowerCase();
      const issuerB = b.issuer.toLowerCase();
      if (issuerA !== issuerB) {
        return issuerA.localeCompare(issuerB);
      }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }, [accounts, searchTerm, categoryFilter]);

  const handleOpenEditModal = (account: Account) => {
    setEditAccount(account);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditAccount(undefined);
  };

  // Build category options
  const categories = useMemo(() => {
    const categoriesSet = new Set(['All']);
    accounts.forEach((account) => categoriesSet.add(account.category));
    return Array.from(categoriesSet);
  }, [accounts]);

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-3xl font-bold">Authentication Codes</h1>
            <Button asChild className="gap-2">
              <Link href="/add-account">
                <Plus className="h-4 w-4" />
                Add New Account
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-[200px]">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Loading accounts...</p>
              </div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No accounts added yet</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Add your first TOTP account to generate authentication codes
              </p>
              <Button asChild className="gap-2">
                <Link href="/add-account">
                  <Plus className="h-4 w-4" />
                  Add Your First Account
                </Link>
              </Button>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h2 className="text-2xl font-bold mb-2">No matching accounts</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Try adjusting your search or category filter
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((account) => (
                <TOTPCard
                  key={account.id}
                  account={account}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AccountFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editAccount={editAccount}
      />
    </PageLayout>
  );
}
