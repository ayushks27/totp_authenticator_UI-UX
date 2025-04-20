'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun, Settings, Lock, Plus, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/context/ThemeContext';

const Header = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Codes', path: '/codes' },
    { name: 'Add Account', path: '/add-account' },
    { name: 'Settings', path: '/settings' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Lock className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">TOTP Authenticator</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {route.name}
            </Link>
          ))}

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-2">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile navigation */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus:ring-0" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-0">
              <div className="flex flex-col gap-4 px-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <Lock className="h-6 w-6" />
                    <span className="font-bold">TOTP Authenticator</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary ${
                        pathname === route.path ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.path === '/' && <List className="h-5 w-5" />}
                      {route.path === '/codes' && <Lock className="h-5 w-5" />}
                      {route.path === '/add-account' && <Plus className="h-5 w-5" />}
                      {route.path === '/settings' && <Settings className="h-5 w-5" />}
                      {route.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Toggle theme</span>
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
