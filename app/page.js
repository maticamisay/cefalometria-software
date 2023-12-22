// pages/trazado.js
"use client";
import { useRef, useState, useEffect, useCallback } from "react";

export default function Trazado() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [strokeStyle, setStrokeStyle] = useState("#000000");

  const startDrawing = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    },
    [lineWidth, strokeStyle]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    },
    [isDrawing]
  );

  const finishDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.closePath();
    setIsDrawing(false);
  }, []);
  // Handlers para los controles de la barra de herramientas
  const handleLineWidthChange = (e) => setLineWidth(e.target.value);
  const handleStrokeStyleChange = (e) => setStrokeStyle(e.target.value);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #000" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
      />

      <div>
        <label htmlFor="lineWidth">Grosor del pincel: </label>
        <input
          id="lineWidth"
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={handleLineWidthChange}
        />
      </div>

      <div>
        <label htmlFor="strokeStyle">Color del pincel: </label>
        <input
          id="strokeStyle"
          type="color"
          value={strokeStyle}
          onChange={handleStrokeStyleChange}
        />
      </div>
    </div>
  );
}
