import React, { useEffect, useRef, useState } from 'react';
import { X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '../context';
import jsQR from 'jsqr';

// Agora exportamos como um componente Modal, não uma página
export const ScannerModal: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { deductCredits, closeScanner, scanner } = useApp();
  const { type, isOpen } = scanner;
  
  const [loadingCamera, setLoadingCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScanResult(null);
      setError(null);
      setLoadingCamera(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        setLoadingCamera(true);
        const constraints = { video: { facingMode: 'environment' } };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); // required for iOS
          
          videoRef.current.onloadedmetadata = () => {
             setLoadingCamera(false);
             videoRef.current?.play().catch(e => console.error("Play error", e));
             requestAnimationFrame(tick);
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
        setLoadingCamera(false);
        setError("Não foi possível acessar a câmera. Verifique permissões.");
      }
    };

    const tick = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          handleScan(code.data);
        } else {
          animationFrameId = requestAnimationFrame(tick);
        }
      } else {
         animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isScanning) {
       startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, isOpen]);

  const handleScan = (data: string) => {
    setIsScanning(false);
    
    // Simulação de processamento
    setTimeout(() => {
        if (type === 'redeem') {
             const success = deductCredits(1);
             if (success) {
                 setScanResult({
                     status: 'success',
                     message: 'Pagamento de 1 crédito realizado!'
                 });
             } else {
                 setScanResult({
                     status: 'error',
                     message: 'Saldo insuficiente.'
                 });
             }
        } else {
            setScanResult({
                status: 'success',
                message: 'Cliente validado!'
            });
        }
    }, 300);
  };

  const handleClose = () => {
    closeScanner();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal Container - Styled to match image */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Escanear QR Code
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 min-h-[350px]">
          
          <canvas ref={canvasRef} className="hidden" />

          {isScanning ? (
            <div className="relative w-64 h-64 bg-black rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
              
              {!error ? (
                 <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    playsInline 
                    muted
                 />
              ) : (
                <div className="text-center p-4">
                   <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                   <p className="text-xs text-white">{error}</p>
                </div>
              )}

              {/* Scanning Line Animation */}
              {!error && !loadingCamera && (
                <div className="absolute inset-0 z-10">
                   <div className="w-full h-1 bg-brand-500/80 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-[scan_2s_ease-in-out_infinite] absolute top-0" />
                   {/* Corner markers */}
                   <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-lg"></div>
                   <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-lg"></div>
                   <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-lg"></div>
                   <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-lg"></div>
                </div>
              )}

              {loadingCamera && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                   <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                </div>
              )}
            </div>
          ) : (
            // Result View
            <div className="flex flex-col items-center justify-center w-full h-64 animate-in zoom-in">
               {scanResult?.status === 'success' ? (
                 <>
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                     <Check className="w-10 h-10 text-green-600" />
                   </div>
                   <p className="text-center font-bold text-gray-900 dark:text-white text-lg mb-1">Sucesso!</p>
                   <p className="text-center text-sm text-gray-500 mb-6">{scanResult.message}</p>
                 </>
               ) : (
                 <>
                   <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                     <AlertTriangle className="w-10 h-10 text-red-500" />
                   </div>
                   <p className="text-center font-bold text-gray-900 dark:text-white text-lg mb-1">Ops!</p>
                   <p className="text-center text-sm text-gray-500 mb-6">{scanResult?.message}</p>
                 </>
               )}
               <button 
                 onClick={() => { setIsScanning(true); setScanResult(null); }}
                 className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-2 rounded-xl font-bold text-sm"
               >
                 Escanear Novamente
               </button>
            </div>
          )}

          {/* Footer Text */}
          {isScanning && (
            <p className="mt-6 text-sm text-gray-500 text-center font-medium">
              Aponte a câmera para o QR Code
            </p>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};