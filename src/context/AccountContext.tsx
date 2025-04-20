'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, encryptData, decryptData, generateId } from '@/lib/totp';

interface AccountContextType {
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  clearAccounts: () => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  importAccounts: (accounts: Account[]) => void;
  exportAccounts: () => string;
  passwordSet: boolean;
  setEncryptionPassword: (password: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccounts = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};

const STORAGE_KEY = 'totp-accounts';
const ENCRYPTION_KEY = 'totp-encryption-key';

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [encryptionPassword, setEncryptionPassword] = useState<string | null>(null);
  const [passwordSet, setPasswordSet] = useState(false);

  // Load accounts from local storage
  useEffect(() => {
    const loadAccounts = () => {
      try {
        setIsLoading(true);
        const encryptionCheck = localStorage.getItem(ENCRYPTION_KEY);
        setPasswordSet(!!encryptionCheck);

        if (encryptionPassword) {
          const storedAccounts = localStorage.getItem(STORAGE_KEY);
          if (storedAccounts) {
            try {
              const decrypted = decryptData(storedAccounts, encryptionPassword);
              const parsed = JSON.parse(decrypted);
              setAccounts(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
              console.error('Error decrypting accounts:', error);
              setAccounts([]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [encryptionPassword]);

  // Save accounts to local storage
  useEffect(() => {
    if (accounts.length > 0 && encryptionPassword && !isLoading) {
      try {
        const encryptedData = encryptData(JSON.stringify(accounts), encryptionPassword);
        localStorage.setItem(STORAGE_KEY, encryptedData);
        localStorage.setItem(ENCRYPTION_KEY, 'true');
      } catch (error) {
        console.error('Error saving accounts:', error);
      }
    }
  }, [accounts, encryptionPassword, isLoading]);

  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: generateId(),
      createdAt: Date.now(),
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const updateAccount = (updatedAccount: Account) => {
    setAccounts((prev) =>
      prev.map((account) => (account.id === updatedAccount.id ? updatedAccount : account))
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  };

  const clearAccounts = () => {
    setAccounts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const importAccounts = (newAccounts: Account[]) => {
    setAccounts((prev) => {
      // Filter out duplicates based on issuer and name
      const existing = new Set(prev.map((a) => `${a.issuer}:${a.name}`));
      const filtered = newAccounts.filter((a) => !existing.has(`${a.issuer}:${a.name}`));
      return [...prev, ...filtered];
    });
  };

  const exportAccounts = (): string => {
    return JSON.stringify(accounts);
  };

  const setPassword = (password: string) => {
    setEncryptionPassword(password);
    setPasswordSet(true);
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        clearAccounts,
        isLoading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        importAccounts,
        exportAccounts,
        passwordSet,
        setEncryptionPassword: setPassword,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
