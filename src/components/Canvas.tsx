import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  selectedTool: string;
  pageNumber: number;
  scale: number;
  rotation: number;
  onCanvasReady: (canvas: fabric.Canvas) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function Canvas({ 
  selectedTool, 
  pageNumber, 
  scale, 
  rotation, 
  onCanvasReady,
  containerRef 
}: CanvasProps) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  // Initialize canvas with container dimensions
  useEffect(() => {
    if (!canvasEl.current || fabricCanvas || !containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    const canvas = new fabric.Canvas(canvasEl.current, {
      width: width - 32, // Accounting for padding
      height: height - 32,
      backgroundColor: 'transparent',
      selection: !isErasing,
    });

    canvas.setDimensions({
      width: '100%',
      height: '100%',
    }, { cssOnly: true });

    canvas.on('mouse:down', (event) => {
      if (isErasing && event.target) {
        canvas.remove(event.target);
        canvas.renderAll();
      }
    });

    canvas.on('mouse:move', (event) => {
      if (isErasing) {
        const pointer = canvas.getPointer(event.e);
        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          if (obj.containsPoint(pointer)) {
            canvas.remove(obj);
            canvas.renderAll();
          }
        });
      }
    });

    // Handle touch events for mobile
    canvas.on('touch:drag', (event) => {
      if (isErasing && event.target) {
        canvas.remove(event.target);
        canvas.renderAll();
      }
    });

    setFabricCanvas(canvas);
    onCanvasReady(canvas);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const { width: newWidth, height: newHeight } = container.getBoundingClientRect();
      canvas.setDimensions({
        width: newWidth - 32,
        height: newHeight - 32,
      });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.dispose();
      setFabricCanvas(null);
      window.removeEventListener('resize', handleResize);
    };
  }, [onCanvasReady, containerRef]);

  // Handle tool selection
  useEffect(() => {
    if (!fabricCanvas) return;

    setIsErasing(selectedTool === 'eraser');
    fabricCanvas.isDrawingMode = selectedTool === 'draw' || selectedTool === 'highlighter';
    fabricCanvas.selection = !isErasing;
    
    if (fabricCanvas.isDrawingMode) {
      fabricCanvas.freeDrawingBrush.width = selectedTool === 'highlighter' ? 20 : 2;
      fabricCanvas.freeDrawingBrush.color = selectedTool === 'highlighter' ? 'rgba(255, 255, 0, 0.4)' : '#000000';
    }

    if (isErasing) {
      fabricCanvas.defaultCursor = 'not-allowed';
      fabricCanvas.hoverCursor = 'not-allowed';
    } else {
      fabricCanvas.defaultCursor = 'default';
      fabricCanvas.hoverCursor = 'move';
    }

    const addShape = () => {
      const center = fabricCanvas.getCenter();
      
      switch (selectedTool) {
        case 'text':
          const text = new fabric.IText('Click to edit', {
            left: center.left,
            top: center.top,
            fontSize: 20,
            originX: 'center',
            originY: 'center',
          });
          fabricCanvas.add(text);
          fabricCanvas.setActiveObject(text);
          break;

        case 'rectangle':
          const rect = new fabric.Rect({
            left: center.left,
            top: center.top,
            width: 100,
            height: 100,
            fill: 'transparent',
            stroke: '#000000',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
          });
          fabricCanvas.add(rect);
          fabricCanvas.setActiveObject(rect);
          break;

        case 'circle':
          const circle = new fabric.Circle({
            left: center.left,
            top: center.top,
            radius: 50,
            fill: 'transparent',
            stroke: '#000000',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
          });
          fabricCanvas.add(circle);
          fabricCanvas.setActiveObject(circle);
          break;
      }
    };

    if (['text', 'rectangle', 'circle'].includes(selectedTool)) {
      addShape();
    }

    fabricCanvas.renderAll();
  }, [selectedTool, fabricCanvas, isErasing]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-auto">
      <canvas ref={canvasEl} />
    </div>
  );
}