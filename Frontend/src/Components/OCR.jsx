import React, { useRef, useState } from 'react';
import axios from 'axios';

const CameraOCR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
    sendToGoogleVision(base64Image);
  };

  const sendToGoogleVision = async (base64Image) => {
    const API_KEY = 'AIzaSyB1WJpcGuUZgg9N2PyCeuvstIRUofa17tQ';
    const endpoint =`https://vision.googleapis.com/v1/images:annotate?key=${AIzaSyB1WJpcGuUZgg9N2PyCeuvstIRUofa17tQ}`;

    const body = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    };

    try {
      const res = await axios.post(endpoint, body);
      const detectedText = res.data.responses[0]?.textAnnotations?.[0]?.description || 'No text found';
      setText(detectedText);
    } catch (error) {
      console.error('OCR Error:', error);
      setText('Error during OCR');
    }
  };

  return (
    <div>
      <h2>Camera OCR</h2>
      <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: 500 }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ marginTop: 10 }}>
        {!streaming && <button onClick={startCamera}>Start Camera</button>}
        {streaming && <button onClick={captureImage}>Capture & OCR</button>}
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>{text}</pre>
    </div>
  );
};

export default CameraOCR;