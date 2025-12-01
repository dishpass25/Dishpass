import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Check, AlertTriangle } from 'lucide-react';
import { useApp } from '../context';
import { MOCK_RESTAURANTS } from '../constants';

export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error', message: string, dish?: any } | null>(null);
  const { deductCredits } = useApp();

  useEffect(() => {
    // Attempt to access camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Camera access error:", err));

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = () => {
    // Mocking a successful scan logic
    // In real app, we would parse the QR frame
    const mockDish = MOCK_RESTAURANTS[0].menu[0];
    
    // Attempt deduction (mocking user balance check here, though technically we'd query the user ID from QR)
    // For demo purposes, we just assume the QR is valid.
    
    setIsScanning(false);
    setScanResult({
      status: 'success',
      message: `Redeemed: ${mockDish.name}`,
      dish: mockDish
    });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => navigate('/')} className="text-white p-2 bg-black/50 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
        {isScanning ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-70" />
            
            {/* Scanner Overlay */}
            <div className="relative z-10 w-64 h-64 border-2 border-brand-500 rounded-2xl flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-500 -mb-1 -mr-1"></div>
              <div className="w-full h-0.5 bg-red-500/80 animate-[ping_2s_ease-in-out_infinite]" />
            </div>
            
            <p className="absolute bottom-32 text-white text-center w-full font-medium shadow-sm">Align QR code within frame</p>
            
            {/* Dev Only: Simulate Trigger */}
            <button 
              onClick={handleSimulateScan}
              className="absolute bottom-10 bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2"
            >
              <Camera className="w-5 h-5" /> Simulate Scan
            </button>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 w-4/5 p-6 rounded-2xl text-center animate-in zoom-in">
            {scanResult?.status === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold dark:text-white mb-2">Success!</h2>
                <p className="text-gray-500 mb-4">{scanResult.message}</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-6">
                  <p className="text-sm font-bold dark:text-white">- {scanResult.dish.credits} Credits</p>
                </div>
                <button onClick={() => setIsScanning(true)} className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold">
                  Scan Next
                </button>
              </>
            ) : (
              <div className="text-center">
                 <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2"/>
                 <p className="mb-4">Error processing code.</p>
                 <button onClick={() => setIsScanning(true)} className="bg-gray-200 px-4 py-2 rounded">Retry</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};