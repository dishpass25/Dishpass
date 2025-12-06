
import React, { useEffect, useRef, useState } from 'react';
import { X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '../context';
import jsQR from 'jsqr';
import { ReviewForm } from '../components/ReviewComponents';

export const ScannerModal: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { deductCredits, closeScanner, scanner } = useApp();
  const { type, isOpen, restaurantId, dishId } = scanner;
  
  const [loadingCamera, setLoadingCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  
  // New State: Review Mode
  const [showReview, setShowReview] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScanResult(null);
      setError(null);
      setLoadingCamera(true);
      setShowReview(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || showReview) return; // Stop camera if in review mode

    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        setLoadingCamera(true);
        const constraints = { video: { facingMode: 'environment' } };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); 
          
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
  }, [isScanning, isOpen, showReview]);

  const handleScan = (data: string) => {
    setIsScanning(false);
    
    // Simulação de processamento
    setTimeout(() => {
        if (type === 'redeem') {
             // Em um app real, o ID do restaurante viria do QR Code (data)
             // Aqui usaremos o que veio do contexto (aberto via botão da Home/Card) ou fallback
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
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in zoom-in-95 duration-300 min-h-[450px]">
        
        {/* Header (Hide in Review Mode for cleaner look) */}
        {!showReview && (
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Escanear QR
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col bg-gray-50 dark:bg-gray-950">
          
          <canvas ref={canvasRef} className="hidden" />

          {showReview && restaurantId ? (
              // REVIEW FORM
              <ReviewForm 
                restaurantId={restaurantId} 
                dishId={dishId}
                onClose={handleClose} 
                onSuccess={() => {
                    alert("Obrigado pela avaliação!");
                    handleClose();
                }} 
              />
          ) : isScanning ? (
            // CAMERA VIEW
            <div className="relative w-full flex-1 bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center min-h-[300px]">
              
              {!error ? (
                 <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    playsInline 
                    muted
                 />
              ) : (
                <div className="text-center p-4">
                   <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                   <p className="text-base text-white font-medium">{error}</p>
                </div>
              )}

              {/* Scanning Animation */}
              {!error && !loadingCamera && (
                <div className="absolute inset-0 z-10">
                   <div className="w-full h-1 bg-brand-500/80 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-[scan_2s_ease-in-out_infinite] absolute top-0" />
                   {/* Corner markers */}
                   <div className="absolute top-5 left-5 w-10 h-10 border-t-4 border-l-4 border-white/50 rounded-tl-lg"></div>
                   <div className="absolute top-5 right-5 w-10 h-10 border-t-4 border-r-4 border-white/50 rounded-tr-lg"></div>
                   <div className="absolute bottom-5 left-5 w-10 h-10 border-b-4 border-l-4 border-white/50 rounded-bl-lg"></div>
                   <div className="absolute bottom-5 right-5 w-10 h-10 border-b-4 border-r-4 border-white/50 rounded-br-lg"></div>
                </div>
              )}

              {loadingCamera && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                   <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                </div>
              )}
            </div>
          ) : (
            // RESULT SUCCESS/ERROR VIEW
            <div className="flex flex-col items-center justify-center w-full h-full animate-in zoom-in py-8">
               {scanResult?.status === 'success' ? (
                 <>
                   <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5">
                     <Check className="w-12 h-12 text-green-600" />
                   </div>
                   <p className="text-center font-bold text-gray-900 dark:text-white text-2xl mb-2">Sucesso!</p>
                   <p className="text-center text-lg text-gray-500 mb-8 font-medium">{scanResult.message}</p>
                   
                   {/* Se for Redeem e tivermos o ID do restaurante (passado via contexto), mostra botão de avaliar */}
                   {type === 'redeem' && restaurantId && (
                       <button 
                         onClick={() => setShowReview(true)}
                         className="w-full bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors mb-3 shadow-lg shadow-brand-500/30"
                       >
                         Avaliar Experiência
                       </button>
                   )}
                 </>
               ) : (
                 <>
                   <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-5">
                     <AlertTriangle className="w-12 h-12 text-red-500" />
                   </div>
                   <p className="text-center font-bold text-gray-900 dark:text-white text-2xl mb-2">Ops!</p>
                   <p className="text-center text-lg text-gray-500 mb-8 font-medium">{scanResult?.message}</p>
                 </>
               )}
               
               <button 
                 onClick={handleClose} // Fechar direto
                 className="w-full text-center text-gray-500 font-bold py-3"
               >
                 Fechar
               </button>
            </div>
          )}

          {/* Footer Text for Scanning */}
          {isScanning && !showReview && (
            <p className="mt-6 text-lg text-gray-500 text-center font-bold">
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
