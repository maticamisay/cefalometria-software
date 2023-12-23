import { useState, useCallback, useEffect } from 'react';

export default function Canvas({
  canvasRef,
  imageLoaded,
  lineWidth,
  strokeStyle,
  puntosCefalometricos,

  addCephalometricPoint,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const handleCanvasClick = e => {
    if (!imageLoaded) return;
    addCephalometricPoint(e);
  };
  const drawCephalometricPoints = useCallback(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Dibujar puntos
    puntosCefalometricos.forEach(punto => {
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(punto.x, punto.y, 5, 0, 2 * Math.PI);
      context.fill();
    });

    // Dibujar líneas entre los puntos
    context.strokeStyle = 'blue';
    context.lineWidth = 1;
    context.beginPath();
    puntosCefalometricos.forEach((punto, index) => {
      if (index === 0) {
        context.moveTo(punto.x, punto.y);
      } else {
        context.lineTo(punto.x, punto.y);
      }
    });
    context.stroke();
  }, [imageLoaded, canvasRef, puntosCefalometricos]);
  useEffect(() => {
    drawCephalometricPoints();
  }, [drawCephalometricPoints]);
  const startDrawing = useCallback(
    e => {
      if (!imageLoaded) return;
      const context = canvasRef.current.getContext('2d');
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    },
    [canvasRef, imageLoaded, lineWidth, strokeStyle],
  );

  const draw = useCallback(
    e => {
      if (!isDrawing) return;
      const context = canvasRef.current.getContext('2d');
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    },
    [canvasRef, isDrawing],
  );

  const finishDrawing = useCallback(() => {
    if (!isDrawing) return;
    const context = canvasRef.current.getContext('2d');
    context.closePath();
    setIsDrawing(false);
  }, [canvasRef, isDrawing]);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '1px solid #000' }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
      onClick={handleCanvasClick}
    />
  );
}
