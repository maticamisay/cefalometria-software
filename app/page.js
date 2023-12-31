'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Canvas from './components/canvas';
import ImageUploader from './components/image-uploader';
import Toolbar from './components/toolbar';

export default function MainComponent() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [puntosCefalometricos, setPuntosCefalometricos] = useState([]);
  const [isTracing, setIsTracing] = useState(false);

  const addCephalometricPoint = point => {
    setPuntosCefalometricos([...puntosCefalometricos, point]);
  };

  const drawImage = useCallback(() => {
    if (!!image && canvasRef.current && !imageLoaded) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        setImageLoaded(true);
      };
      img.src = image;
    }
  }, [image, imageLoaded]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);
  return (
    <div>
      <ImageUploader setImage={setImage} setImageLoaded={setImageLoaded} />
      <Canvas
        canvasRef={canvasRef}
        image={image}
        imageLoaded={imageLoaded}
        puntosCefalometricos={puntosCefalometricos}
        setPuntosCefalometricos={setPuntosCefalometricos}
        addCephalometricPoint={addCephalometricPoint}
        isTracing={isTracing}
        setIsTracing={setIsTracing}
      />
      <Toolbar isTracing={isTracing} setIsTracing={setIsTracing} />
    </div>
  );
}
