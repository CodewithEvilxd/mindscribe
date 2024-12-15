import React, { useState, useRef } from 'react';
import { Download, FileDown, Upload, Hash, ChevronRight, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NotesPanelProps {
  onSave: (format: 'md' | 'txt') => void;
  onPageJump: (pageNumber: number) => void;
  currentPage: number;
  totalPages: number;
}

export default function NotesPanel({ onSave, onPageJump, currentPage, totalPages }: NotesPanelProps) {
  const [notes, setNotes] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<number[]>([]);
  const [isTagPanelCollapsed, setIsTagPanelCollapsed] = useState(false);

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setNotes(content);
      // Extract page tags from content
      const pageMatches = content.match(/\[\[page:(\d+)\]\]/g);
      if (pageMatches) {
        const extractedTags = pageMatches.map(tag => 
          parseInt(tag.match(/\d+/)?.[0] || '0')
        ).filter(num => num > 0 && num <= totalPages);
        setTags([...new Set(extractedTags)]);
      }
    };
    reader.readAsText(file);
  };

  const insertPageTag = () => {
    const tag = `[[page:${currentPage}]]`;
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = notes.substring(0, start) + tag + notes.substring(end);
    setNotes(newText);
    
    // Update tags list
    if (!tags.includes(currentPage)) {
      setTags([...tags, currentPage].sort((a, b) => a - b));
    }
  };

  const renderMarkdown = (text: string) => {
    // Replace page tags with clickable links
    const processedText = text.replace(
      /\[\[page:(\d+)\]\]/g,
      (_, pageNum) => `[Go to page ${pageNum}](#page${pageNum})`
    );
    return processedText;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !isPreview ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isPreview ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Preview
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={insertPageTag}
            className="p-2 rounded-md hover:bg-gray-100 tooltip text-gray-600 transition-colors"
            title="Insert page tag"
          >
            <Hash className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-md hover:bg-gray-100 tooltip text-gray-600 transition-colors"
            title="Load notes"
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSave('md')}
            className="p-2 rounded-md hover:bg-gray-100 tooltip text-gray-600 transition-colors"
            title="Save as Markdown"
          >
            <FileDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSave('txt')}
            className="p-2 rounded-md hover:bg-gray-100 tooltip text-gray-600 transition-colors"
            title="Save as Text"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileLoad}
          accept=".md,.txt"
          className="hidden"
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 overflow-auto transition-all duration-300 ${
          tags.length > 0 && !isTagPanelCollapsed ? 'mr-48' : ''
        }`}>
          {isPreview ? (
            <div className="prose prose-sm max-w-none p-6">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => {
                    const pageMatch = href?.match(/#page(\d+)/);
                    if (pageMatch) {
                      return (
                        <button
                          onClick={() => onPageJump(parseInt(pageMatch[1]))}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {children}
                        </button>
                      );
                    }
                    return <a href={href}>{children}</a>;
                  },
                }}
              >
                {renderMarkdown(notes)}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes here... 
              
• Use Markdown for formatting
• Insert page tags with the # button
• Click page numbers in preview to jump to pages"
              className="w-full h-full resize-none p-6 focus:outline-none focus:ring-0 text-gray-700"
            />
          )}
        </div>
        
        {tags.length > 0 && (
          <div className={`fixed right-0 h-full transition-transform duration-300 ease-in-out ${
            isTagPanelCollapsed ? 'translate-x-full' : ''
          }`}>
            <button
              onClick={() => setIsTagPanelCollapsed(!isTagPanelCollapsed)}
              className="absolute left-0 top-1/2 -translate-x-full transform bg-white p-2 rounded-l-md border border-r-0 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {isTagPanelCollapsed ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="w-48 h-full border-l border-gray-200 overflow-y-auto bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tagged Pages</h3>
              <div className="space-y-1">
                {tags.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => onPageJump(pageNum)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Page {pageNum}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}