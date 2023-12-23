'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Canvas from './components/canvas';
import ImageUploader from './components/image-uploader';
import Toolbar from './components/toolbar';

export default function Trazado() {
  const canvasRef = useRef(null);
  const [lineWidth, setLineWidth] = useState(5);
  const [strokeStyle, setStrokeStyle] = useState('#000000');
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [puntosCefalometricos, setPuntosCefalometricos] = useState([]);

  const addCephalometricPoint = e => {
    if (!imageLoaded) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setPuntosCefalometricos([...puntosCefalometricos, { x, y }]);
  };

  const drawImage = useCallback(() => {
    console.log('drawImage', !!image, !imageLoaded);
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
        lineWidth={lineWidth}
        strokeStyle={strokeStyle}
        puntosCefalometricos={puntosCefalometricos}
        setPuntosCefalometricos={setPuntosCefalometricos}
        addCephalometricPoint={addCephalometricPoint}
      />
      <Toolbar
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        strokeStyle={strokeStyle}
        setStrokeStyle={setStrokeStyle}
      />
    </div>
  );
}
