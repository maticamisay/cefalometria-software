import { useCallback, useEffect } from 'react';

export default function Canvas({
  canvasRef,
  imageLoaded,
  puntosCefalometricos,
  addCephalometricPoint,
}) {
  const handleCanvasClick = e => {
    if (!imageLoaded) return;
    addCephalometricPoint(e);
  };

  const drawCephalometricPoints = useCallback(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    puntosCefalometricos.forEach(punto => {
      // Dibujar puntos
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

  return (
    <canvas ref={canvasRef} style={{ border: '1px solid #000' }} onClick={handleCanvasClick} />
  );
}
