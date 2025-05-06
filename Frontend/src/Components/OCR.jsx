import React, { useRef, useState } from 'react';
import axios from 'axios';

const OCR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrText, setOcrText] = useState('');
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera on mobile
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreaming(true);
      setError('');
    } catch (err) {
      console.error('Camera Access Error:', err);
      setError('Unable to access camera: ' + err.message);
    }
  };

  const captureAndSend = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      try {
        const response = await axios.post('https://spinzreward.site/ocr/ocr', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.text) {
          setOcrText(response.data.text);
          setError('');
        } else if (response.data.error) {
          setError(response.data.error);
          setOcrText('');
        }
      } catch (err) {
        console.error('OCR Server Error:', err);
        setError('OCR failed or server error: ' + err.message);
        setOcrText('');
      }
    }, 'image/jpeg');
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h2>Camera OCR Scanner</h2>
      {!streaming ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline width="100%" style={{ maxWidth: '400px' }} />
          <br />
          <button onClick={captureAndSend}>Capture & OCR</button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {ocrText && (
        <div>
          <h3>OCR Result:</h3>
          <pre>{ocrText}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default OCR;
