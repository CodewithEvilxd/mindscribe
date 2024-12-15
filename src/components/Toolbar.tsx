import React from 'react';
import { 
  Type, 
  Pencil, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Eraser, 
  Download,
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Highlighter,
  SplitSquareVertical
} from 'lucide-react';

interface ToolbarProps {
  pageNumber: number;
  numPages: number | null;
  scale: number;
  onPageChange: (offset: number) => void;
  onZoom: (delta: number) => void;
  onRotate: () => void;
  onToolSelect: (tool: string) => void;
  selectedTool: string;
  onDownload: () => void;
  onToggleNotes: () => void;
  isMobileView: boolean;
}

export default function Toolbar({
  pageNumber,
  numPages,
  scale,
  onPageChange,
  onZoom,
  onRotate,
  onToolSelect,
  selectedTool,
  onDownload,
  onToggleNotes,
  isMobileView
}: ToolbarProps) {
  const tools = [
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'highlighter', icon: Highlighter, label: 'Highlighter' },
    { id: 'rectangle', icon: Square, label: 'Add Rectangle' },
    { id: 'circle', icon: Circle, label: 'Add Circle' },
    { id: 'image', icon: ImageIcon, label: 'Add Image' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(-1)}
          disabled={pageNumber <= 1}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm whitespace-nowrap">
          {pageNumber} / {numPages}
        </span>
        <button
          onClick={() => onPageChange(1)}
          disabled={pageNumber >= (numPages || 1)}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onToolSelect(id)}
            className={`p-2 rounded hover:bg-gray-100 tooltip ${
              selectedTool === id ? 'bg-blue-100' : ''
            }`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
        <div className="h-6 w-px bg-gray-300 mx-2" />
        <button
          onClick={() => onZoom(-0.1)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-sm whitespace-nowrap">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => onZoom(0.1)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={onRotate}
          className="p-2 rounded hover:bg-gray-100"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={onDownload}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Download className="w-5 h-5" />
        </button>
        {isMobileView && (
          <button
            onClick={onToggleNotes}
            className="p-2 rounded hover:bg-gray-100"
          >
            <SplitSquareVertical className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}