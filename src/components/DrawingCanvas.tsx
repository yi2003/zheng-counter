'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  completed: boolean;
}

interface DrawingCanvasProps {
  onStrokeComplete: (strokeIndex: number) => void;
  currentStroke: number;
  totalStrokes: number;
  onReset: () => void;
  onAutoReset?: () => void;
}

const ZHENG_STROKES = [
  // Stroke 1: Top horizontal line (一) - the 一 radical
  [
    { x: 90, y: 70 },
    { x: 210, y: 70 }
  ],
  // Stroke 2: First stroke of 止 - short horizontal line
  [
    { x: 120, y: 110 },
    { x: 180, y: 110 }
  ],
  // Stroke 3: Second stroke of 止 - left vertical line
  [
    { x: 120, y: 110 },
    { x: 120, y: 170 }
  ],
  // Stroke 4: Third stroke of 止 - right vertical line
  [
    { x: 180, y: 110 },
    { x: 180, y: 170 }
  ],
  // Stroke 5: Bottom horizontal line completing 止
  [
    { x: 120, y: 170 },
    { x: 180, y: 170 }
  ]
];

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onStrokeComplete,
  currentStroke,
  totalStrokes,
  onReset,
  onAutoReset
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [drawnStrokes, setDrawnStrokes] = useState<Stroke[]>([]);

  const drawCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, 300, 250);
    
    // Draw light gray background "正" character as guide
    ctx.save();
    ctx.font = '120px serif';
    ctx.fillStyle = '#d1d5db'; // Light gray
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('正', 150, 125); // Center the character
    ctx.restore();
    
    // Draw user's completed strokes
    drawnStrokes.forEach((stroke) => {
      if (stroke.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach((point, index) => {
          if (index > 0) {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // Draw current path being drawn
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach((point, index) => {
        if (index > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }, [drawnStrokes, currentPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCanvas(ctx);
  }, [drawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const isPointNearStroke = (point: Point, strokePoints: Point[], tolerance: number = 30): boolean => {
    const [start, end] = strokePoints;
    
    // Calculate distance from point to line segment
    const A = point.x - start.x;
    const B = point.y - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B) <= tolerance;

    let param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = start.x;
      yy = start.y;
    } else if (param > 1) {
      xx = end.x;
      yy = end.y;
    } else {
      xx = start.x + param * C;
      yy = start.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy) <= tolerance;
  };

  const validateStroke = (path: Point[]): boolean => {
    // Simple validation - just check if the user drew something
    return path.length >= 2 && currentStroke < totalStrokes;
  };

  const startDrawing = (point: Point) => {
    if (currentStroke >= totalStrokes) return;
    
    setIsDrawing(true);
    setCurrentPath([point]);
  };

  const draw = (point: Point) => {
    if (!isDrawing) return;
    setCurrentPath(prev => [...prev, point]);
  };

  const stopDrawing = () => {
    if (!isDrawing || currentPath.length < 2) {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    setIsDrawing(false);

    if (validateStroke(currentPath)) {
      const newStroke: Stroke = {
        points: [...currentPath],
        completed: true
      };
      
      setDrawnStrokes(prev => [...prev, newStroke]);
      setCurrentPath([]);
      onStrokeComplete(currentStroke);
    } else {
      // Invalid stroke - clear it
      setCurrentPath([]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(getMousePos(e));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(getMousePos(e));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(getTouchPos(e));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(getTouchPos(e));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const resetCanvas = () => {
    setDrawnStrokes([]);
    setCurrentPath([]);
    setIsDrawing(false);
    onReset();
  };

  // Auto-clear canvas when 正 is completed
  useEffect(() => {
    if (currentStroke >= totalStrokes) {
      // Small delay to show completion, then clear and reset
      const timer = setTimeout(() => {
        setDrawnStrokes([]);
        setCurrentPath([]);
        if (onAutoReset) {
          onAutoReset(); // Use the specific auto-reset function
        } else {
          onReset(); // Fallback to regular reset
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStroke, totalStrokes, onReset, onAutoReset]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative border-2 border-gray-300 rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          width={300}
          height={250}
          className="cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={resetCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
        
        <div className="text-sm text-gray-600 flex items-center">
          Stroke {currentStroke + 1} of {totalStrokes}
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
