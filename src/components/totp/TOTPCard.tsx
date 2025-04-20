'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Account, generateTOTP, getRemainingTime } from '@/lib/totp';
import { Copy, Check, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAccounts } from '@/context/AccountContext';
import { FaGoogle, FaFacebook, FaTwitter, FaAmazon, FaApple } from 'react-icons/fa';
import {
  FaMicrosoft, FaGithub, FaDropbox, FaSlack, FaDiscord, FaLinkedin,
  FaInstagram, FaReddit, FaSteam
} from 'react-icons/fa';

interface TOTPCardProps {
  account: Account;
  onEdit: (account: Account) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'google': <FaGoogle className="h-4 w-4" />,
  'facebook': <FaFacebook className="h-4 w-4" />,
  'twitter': <FaTwitter className="h-4 w-4" />,
  'amazon': <FaAmazon className="h-4 w-4" />,
  'apple': <FaApple className="h-4 w-4" />,
  'microsoft': <FaMicrosoft className="h-4 w-4" />,
  'github': <FaGithub className="h-4 w-4" />,
  'dropbox': <FaDropbox className="h-4 w-4" />,
  'slack': <FaSlack className="h-4 w-4" />,
  'discord': <FaDiscord className="h-4 w-4" />,
  'linkedin': <FaLinkedin className="h-4 w-4" />,
  'instagram': <FaInstagram className="h-4 w-4" />,
  'reddit': <FaReddit className="h-4 w-4" />,
  'steam': <FaSteam className="h-4 w-4" />,
};

export default function TOTPCard({ account, onEdit }: TOTPCardProps) {
  const { deleteAccount } = useAccounts();
  const [code, setCode] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateCode = () => {
      setCode(generateTOTP(account));
      setRemainingTime(getRemainingTime(account.period));
    };

    // Initial code generation
    updateCode();

    // Set up timers for countdown and code regeneration
    const countdownTimer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          updateCode();
          return account.period;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = countdownTimer;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [account]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${account.name}?`);
    if (confirmed) {
      deleteAccount(account.id);
      toast.success(`${account.name} deleted successfully`);
    }
  };

  const progressPercentage = (remainingTime / account.period) * 100;
  const backgroundColor = account.color;

  // Format code with a space in the middle for better readability
  const formattedCode = code && code.length > 3
    ? `${code.slice(0, Math.floor(code.length / 2))} ${code.slice(Math.floor(code.length / 2))}`
    : code;

  const icon = account.icon && ICON_MAP[account.icon]
    ? ICON_MAP[account.icon]
    : null;

  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundColor }}
      />
      <div
        className="absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-linear"
        style={{
          width: `${progressPercentage}%`,
          backgroundColor,
        }}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {icon && (
            <span className="flex-shrink-0" style={{ color: backgroundColor }}>
              {icon}
            </span>
          )}
          <span className="truncate">
            {account.issuer || account.name}
          </span>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(account)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {account.name !== account.issuer && (
            <p className="text-sm text-muted-foreground mb-1 truncate">
              {account.name}
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="font-mono text-2xl tracking-wider">
              {formattedCode}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Refreshes in <span className="font-medium">{remainingTime}s</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
