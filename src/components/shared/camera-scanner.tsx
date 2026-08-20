"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, SwitchCamera, Zap, ZapOff, X, ScanLine, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onClose?: () => void;
}

export function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Play audio beep when barcode is detected
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsScanning(true);

      // Check for flashlight capability
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? (track.getCapabilities() as any) : {};
      if (capabilities.torch) {
        setHasTorch(true);
      }
    } catch (err: any) {
      console.warn("Camera access warning:", err);
      setErrorMsg("Camera access denied or unavailable on this device. Use manual entry or simulation.");
      setIsScanning(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // BarcodeDetector loop if supported by browser
  useEffect(() => {
    if (!isScanning) return;

    let intervalId: any = null;

    if ("BarcodeDetector" in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ["qr_code", "ean_13", "ean_8", "code_128", "code_39", "upc_a"],
      });

      intervalId = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              handleCodeDetected(code);
            }
          } catch (e) {
            // Ignore frame detection error
          }
        }
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScanning]);

  const handleCodeDetected = (code: string) => {
    setLastScanned(code);
    playBeep();
    toast.success(`Scanned Barcode: ${code}`);
    onScan(code);
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !isTorchOn } as any],
      });
      setIsTorchOn(!isTorchOn);
    } catch (err) {
      toast.error("Torch not supported on this camera.");
    }
  };

  // Switch Front/Back Camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Simulate Barcode Scan (For testing on devices without physical barcodes)
  const handleSimulateScan = () => {
    const mockCodes = ["8901234567890", "8909876543210", "8901122334455", "8905544332211"];
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
    handleCodeDetected(randomCode);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-border/50 shadow-2xl flex flex-col items-center justify-center">
      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-white/20 text-xs">
          <Camera className="h-3 w-3 mr-1 text-emerald-400 animate-pulse" />
          Live Camera Feed
        </Badge>
        <div className="flex items-center gap-2">
          {hasTorch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
              onClick={toggleTorch}
            >
              {isTorchOn ? <Zap className="h-4 w-4 text-amber-400" /> : <ZapOff className="h-4 w-4" />}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
            onClick={switchCamera}
          >
            <SwitchCamera className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Video View Finder */}
      <div className="relative w-full aspect-4/3 max-h-[320px] bg-black flex items-center justify-center overflow-hidden">
        {errorMsg ? (
          <div className="p-6 text-center text-white space-y-3 z-10">
            <ScanLine className="h-10 w-10 mx-auto text-amber-400" />
            <p className="text-xs text-muted-foreground">{errorMsg}</p>
            <Button size="sm" onClick={handleSimulateScan} className="h-8 text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Simulate Scan Code
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Reticle Viewfinder */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
              <div className="relative w-64 h-44 border-2 border-white/40 rounded-2xl shadow-2xl flex items-center justify-center">
                {/* Corner Brackets */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                {/* Animated Laser Scanning Line */}
                <motion.div
                  animate={{ y: [-70, 70, -70] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399]"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="w-full p-3 bg-card border-t border-border/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {lastScanned ? (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {lastScanned}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-[11px]">Align barcode inside green box</span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSimulateScan}
          className="h-7 text-[11px]"
        >
          <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
          Test Scan
        </Button>
      </div>
    </div>
  );
}
