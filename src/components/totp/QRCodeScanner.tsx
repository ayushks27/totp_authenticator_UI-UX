'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseOTPAuthURL } from '@/lib/totp';
import { useAccounts } from '@/context/AccountContext';
import { toast } from 'sonner';
import { Camera, RefreshCw, Scan } from 'lucide-react';

let jsQR: any;

export default function QRCodeScanner() {
  const { addAccount } = useAccounts();
  const [isScanning, setIsScanning] = useState(false);
  const [isJsQRLoaded, setIsJsQRLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Load jsQR library dynamically
  useEffect(() => {
    const loadJsQR = async () => {
      try {
        const JsQRModule = await import('jsqr');
        jsQR = JsQRModule.default;
        setIsJsQRLoaded(true);
      } catch (error) {
        console.error('Failed to load jsQR library:', error);
        toast.error('Failed to load QR scanner library');
      }
    };

    loadJsQR();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!isJsQRLoaded) {
      toast.error('QR scanner is still loading, please wait');
      return;
    }

    try {
      const constraints = {
        video: { facingMode: 'environment' }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsScanning(true);
      tick();
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    setIsScanning(false);
  };

  const tick = () => {
    if (!videoRef.current || !canvasRef.current) {
      requestRef.current = requestAnimationFrame(tick);
      return;
    }

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(videoRef.current, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        if (code.data.startsWith('otpauth://')) {
          const account = parseOTPAuthURL(code.data);
          if (account) {
            addAccount(account);
            toast.success(`Added ${account.name} successfully`);
            stopScanning();
            return;
          } else {
            toast.error('Invalid QR code format');
          }
        } else {
          toast.error('Not a valid TOTP QR code');
        }
      }
    }

    requestRef.current = requestAnimationFrame(tick);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Scan QR Code
        </CardTitle>
        <CardDescription>
          Scan a QR code from your screen or a service provider to add a new TOTP account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-lg overflow-hidden mb-4 border">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="hidden absolute top-0 left-0"
                />
                <div className="absolute inset-0 border-4 border-primary/30 rounded-lg pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {isScanning ? (
            <Button onClick={stopScanning} variant="destructive">
              Stop Scanning
            </Button>
          ) : (
            <Button onClick={startScanning} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Start Camera Scanner
            </Button>
          )}

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Point your camera at a TOTP QR code to scan it automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
