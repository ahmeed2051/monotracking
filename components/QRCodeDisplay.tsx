
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value }) => {
  return (
    <div className="p-4 bg-white rounded-lg inline-block shadow-lg">
      <QRCodeSVG value={value} size={256} includeMargin={true} />
    </div>
  );
};

export default QRCodeDisplay;
