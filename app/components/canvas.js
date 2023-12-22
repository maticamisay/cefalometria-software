import { useRef, useState, useCallback } from "react";

export default function Canvas({
  canvasRef,
  image,
  imageLoaded,
  lineWidth,
  strokeStyle,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = useCallback(
    (e) => {
      if (!imageLoaded) return;
      const context = canvasRef.current.getContext("2d");
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    },
    [canvasRef, imageLoaded, lineWidth, strokeStyle]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      const context = canvasRef.current.getContext("2d");
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    },
    [canvasRef, isDrawing]
  );

  const finishDrawing = useCallback(() => {
    if (!isDrawing) return;
    const context = canvasRef.current.getContext("2d");
    context.closePath();
    setIsDrawing(false);
  }, [canvasRef, isDrawing]);

  return (
    <canvas
      iamge={image}
      ref={canvasRef}
      style={{ border: "1px solid #000" }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
    />
  );
}
