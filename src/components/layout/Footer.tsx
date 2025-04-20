export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          TOTP Authenticator &copy; {new Date().getFullYear()} - Secure Two-Factor Authentication
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="hidden sm:inline-block">Your data stays on your device</span> 🔒
        </p>
      </div>
    </footer>
  );
}
