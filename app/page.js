// pages/trazado.js
"use client";
import { useRef, useState, useEffect, useCallback } from "react";

export default function Trazado() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [strokeStyle, setStrokeStyle] = useState("#000000");
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setImageLoaded(false);
    };
    reader.readAsDataURL(file);
  };

  const drawImage = useCallback(() => {
    if (image && canvasRef.current && !imageLoaded) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        // Ajusta el tamaño del canvas al de la imagen
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        setImageLoaded(true); // Set the image as loaded
      };
      img.src = image;
    }
  }, [image, imageLoaded]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // Llama a drawImage cuando la imagen cambie
  useEffect(() => {
    drawImage();
  }, [drawImage]);
  const startDrawing = useCallback(
    (e) => {
      if (!imageLoaded) return; // Verifica que la imagen esté cargada
      const context = canvasRef.current.getContext("2d");
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    },
    [imageLoaded, lineWidth, strokeStyle]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      const context = canvasRef.current.getContext("2d");
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    },
    [isDrawing]
  );

  const finishDrawing = useCallback(() => {
    if (!isDrawing) return;
    const context = canvasRef.current.getContext("2d");
    context.closePath();
    setIsDrawing(false);
  }, [isDrawing]);
  // Handlers para los controles de la barra de herramientas
  const handleLineWidthChange = (e) => setLineWidth(e.target.value);
  const handleStrokeStyleChange = (e) => setStrokeStyle(e.target.value);

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #000" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
      />
      <div>
        <label htmlFor="lineWidth">Grosor del pincel: </label>
        <input
          id="lineWidth"
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="strokeStyle">Color del pincel: </label>
        <input
          id="strokeStyle"
          type="color"
          value={strokeStyle}
          onChange={(e) => setStrokeStyle(e.target.value)}
        />
      </div>
    </div>
  );
}
