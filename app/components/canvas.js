import { useCallback, useEffect, useState } from 'react';

export default function Canvas({
  canvasRef,
  imageLoaded,
  puntosCefalometricos,
  setPuntosCefalometricos,
  addCephalometricPoint,
  isTracing,
  setIsTracing,
}) {
  const [dragging, setDragging] = useState(false);
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);

  const handleMouseDown = e => {
    if (!imageLoaded || isTracing) return; // Asegurarse de que no esté trazando

    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    // Detectar si se hizo clic en algún punto cefalométrico
    const radius = 5; // El radio del punto dibujado
    const clickedIndex = puntosCefalometricos.findIndex(punto => {
      return Math.sqrt(Math.pow(punto.x - mouseX, 2) + Math.pow(punto.y - mouseY, 2)) < radius;
    });

    if (clickedIndex !== -1) {
      setDragging(true);
      setDraggingPointIndex(clickedIndex);
    }
  };

  const handleMouseMove = e => {
    if (!imageLoaded || !dragging || isTracing) return; // Asegurarse de que no esté trazando

    const newX = e.nativeEvent.offsetX;
    const newY = e.nativeEvent.offsetY;

    // Actualizar la posición del punto que se está arrastrando
    const updatedPoints = puntosCefalometricos.map((punto, index) => {
      if (index === draggingPointIndex) {
        return { ...punto, x: newX, y: newY };
      }
      return punto;
    });

    setPuntosCefalometricos(updatedPoints);
  };

  const handleMouseUp = () => {
    if (!imageLoaded || isTracing) return; // Asegurarse de que no esté trazando

    setDragging(false);
    setDraggingPointIndex(null);
  };

  const handleCanvasClick = e => {
    if (!imageLoaded || !isTracing) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    // Verificar la proximidad al punto de inicio para cerrar el trazado
    if (puntosCefalometricos.length > 0) {
      const inicio = puntosCefalometricos[0];
      const distancia = Math.sqrt(Math.pow(inicio.x - x, 2) + Math.pow(inicio.y - y, 2));
      if (distancia < 10) {
        // Si es el primer punto o está cerca del punto de inicio, cierra el trazado
        setIsTracing(false); // Detiene el trazado
        drawCephalometricPoints(true); // Cierra el trazado pasando true como argumento
        return;
      }
    }

    // Si no es cercano, añade el punto normalmente
    addCephalometricPoint({ x, y });
  };

  const drawCephalometricPoints = useCallback(
    (closePath = false) => {
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

      // Si se cierra el trazado, vuelve al punto de inicio
      if (closePath && puntosCefalometricos.length > 0) {
        const inicio = puntosCefalometricos[0];
        context.lineTo(inicio.x, inicio.y);
      }

      context.stroke();
    },
    [imageLoaded, canvasRef, puntosCefalometricos],
  );

  useEffect(() => {
    drawCephalometricPoints();
  }, [drawCephalometricPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);

      // Limpieza de eventos
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [
    imageLoaded,
    canvasRef,
    dragging,
    draggingPointIndex,
    puntosCefalometricos,
    setPuntosCefalometricos,
    isTracing,
  ]);

  return (
    <canvas ref={canvasRef} style={{ border: '1px solid #000' }} onClick={handleCanvasClick} />
  );
}
