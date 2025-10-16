
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, QrCodeSuccessCallback } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const successCallback: QrCodeSuccessCallback = (decodedText, decodedResult) => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        onScanSuccess(decodedText);
      }
    };

    const errorCallback = (errorMessage: string) => {
      if (onScanFailure) {
        onScanFailure(errorMessage);
      }
    };
    
    if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          'qr-reader', 
          { fps: 10, qrbox: { width: 250, height: 250 } }, 
          false
        );
        scanner.render(successCallback, errorCallback);
        scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5-qrcode-scanner.", error);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="qr-reader" className="w-full max-w-md mx-auto"></div>;
};

export default QRScanner;
