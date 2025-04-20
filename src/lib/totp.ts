import * as OTPAuth from 'otpauth';
import CryptoJS from 'crypto-js';
import * as qrcode from 'qrcode-generator';

// Define the Account interface
export interface Account {
  id: string;
  name: string;
  issuer: string;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  category: string;
  color: string;
  icon?: string;
  createdAt: number;
}

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Encrypt data
export const encryptData = (data: string, password: string): string => {
  return CryptoJS.AES.encrypt(data, password).toString();
};

// Decrypt data
export const decryptData = (encryptedData: string, password: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Generate TOTP code
export const generateTOTP = (account: Account): string => {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: account.issuer,
      label: account.name,
      algorithm: account.algorithm as OTPAuth.Algorithm,
      digits: account.digits,
      period: account.period,
      secret: OTPAuth.Secret.fromBase32(account.secret),
    });

    return totp.generate();
  } catch (error) {
    console.error('Error generating TOTP:', error);
    return 'Error';
  }
};

// Calculate the remaining time for the current token
export const getRemainingTime = (period: number): number => {
  const seconds = Math.floor(Date.now() / 1000);
  return period - (seconds % period);
};

// Generate QR code for an account
export const generateQRCode = (account: Account): string => {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: account.issuer,
      label: account.name,
      algorithm: account.algorithm as OTPAuth.Algorithm,
      digits: account.digits,
      period: account.period,
      secret: OTPAuth.Secret.fromBase32(account.secret),
    });

    const otpauth = totp.toString();
    const qr = qrcode(0, 'L');
    qr.addData(otpauth);
    qr.make();

    return qr.createDataURL(4, 0);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

// Parse otpauth URL
export const parseOTPAuthURL = (url: string): Account | null => {
  try {
    const parsed = OTPAuth.URI.parse(url);
    if (parsed instanceof OTPAuth.TOTP) {
      return {
        id: generateId(),
        name: parsed.label || 'Unknown',
        issuer: parsed.issuer || 'Unknown',
        secret: parsed.secret.base32,
        algorithm: parsed.algorithm,
        digits: parsed.digits,
        period: parsed.period,
        category: 'Uncategorized',
        color: '#6366f1', // Default to indigo
        createdAt: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing OTPAuth URL:', error);
    return null;
  }
};

// Default categories
export const defaultCategories = [
  'Social Media',
  'Email',
  'Finance',
  'Work',
  'Shopping',
  'Gaming',
  'Entertainment',
  'Uncategorized',
];

// Color options for accounts
export const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
];

// Get popular services icons and info
export const popularServices = [
  { name: 'Google', icon: 'google', domain: 'google.com' },
  { name: 'Facebook', icon: 'facebook', domain: 'facebook.com' },
  { name: 'Twitter', icon: 'twitter', domain: 'twitter.com' },
  { name: 'Amazon', icon: 'amazon', domain: 'amazon.com' },
  { name: 'Apple', icon: 'apple', domain: 'apple.com' },
  { name: 'Microsoft', icon: 'microsoft', domain: 'microsoft.com' },
  { name: 'GitHub', icon: 'github', domain: 'github.com' },
  { name: 'Dropbox', icon: 'dropbox', domain: 'dropbox.com' },
  { name: 'Slack', icon: 'slack', domain: 'slack.com' },
  { name: 'Discord', icon: 'discord', domain: 'discord.com' },
  { name: 'LinkedIn', icon: 'linkedin', domain: 'linkedin.com' },
  { name: 'Instagram', icon: 'instagram', domain: 'instagram.com' },
  { name: 'Reddit', icon: 'reddit', domain: 'reddit.com' },
  { name: 'Steam', icon: 'steam', domain: 'steam.com' },
];
