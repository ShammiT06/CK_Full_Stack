import React, { useRef, useState } from 'react';
import axios from 'axios';

const OCR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrText, setOcrText] = useState('');
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    setError('');
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      setStreaming(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setError('Unable to access camera: ' + err.message);
    }
  };

  const captureAndSend = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      try {
        const response = await axios.post('https://spinzreward.site/ocr/ocr', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.text) {
          setOcrText(response.data.text);
        } else {
          setOcrText('');
          setError(response.data.error || 'No text detected');
        }
      } catch (err) {
        console.error('OCR API error:', err);
        setError('OCR failed or server error: ' + err.message);
        setOcrText('');
      }
    }, 'image/jpeg');
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h2>Mobile Camera OCR</h2>

      {!streaming ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
          />
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
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default OCR;
