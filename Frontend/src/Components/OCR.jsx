import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const OCRApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);
  };

  const captureFromCamera = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    sendToBackend(base64);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      sendToBackend(base64);
    };
    reader.readAsDataURL(file);
  };

  const sendToBackend = async (base64Image) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ocr', { image: base64Image });
      setText(response.data.text || 'No text found');
    } catch (error) {
      console.error(error);
      setText('OCR failed');
    }
  };

  return (
    <div>
      <h2>OCR App (Camera or Upload)</h2>
      {isMobile ? (
        <>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: 500 }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {!streaming && <button onClick={startCamera}>Start Camera</button>}
          {streaming && <button onClick={captureFromCamera}>Capture & OCR</button>}
        </>
      ) : (
        <>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </>
      )}
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>{text}</pre>
    </div>
  );
};

export default OCRApp;
