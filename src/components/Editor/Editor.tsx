import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import clsx from 'clsx';
import type { ViewMode } from '../../types';

interface EditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  viewMode: ViewMode;
}

/**
 * Markdown Editor component.
 */
export const Editor = forwardRef<HTMLElement, EditorProps>(({ markdown, setMarkdown, viewMode }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose the textarea to the parent ref for scroll synchronization
  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd + / (macOS)
    if (e.metaKey && e.key === '/') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end);

      let newMarkdown: string;
      let newSelectionStart: number;
      let newSelectionEnd: number;

      const COMMENT_START = '<!-- ';
      const COMMENT_END = ' -->';

      if (start !== end) {
        // Text is selected
        if (selectedText.startsWith(COMMENT_START) && selectedText.endsWith(COMMENT_END)) {
          // Unwrap
          const unwrapped = selectedText.slice(COMMENT_START.length, -COMMENT_END.length);
          newMarkdown = markdown.substring(0, start) + unwrapped + markdown.substring(end);
          newSelectionStart = start;
          newSelectionEnd = start + unwrapped.length;
        } else {
          // Wrap
          const wrapped = `${COMMENT_START}${selectedText}${COMMENT_END}`;
          newMarkdown = markdown.substring(0, start) + wrapped + markdown.substring(end);
          newSelectionStart = start;
          newSelectionEnd = start + wrapped.length;
        }
      } else {
        // No selection - toggle current line
        const lines = markdown.split('\n');
        let currentPos = 0;
        let lineIndex = 0;
        
        // Find current line index
        for (let i = 0; i < lines.length; i++) {
          const lineEnd = currentPos + lines[i].length;
          if (start >= currentPos && start <= lineEnd + 1) { // +1 for newline
            lineIndex = i;
            break;
          }
          currentPos = lineEnd + 1;
        }

        const line = lines[lineIndex];
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith(COMMENT_START) && trimmedLine.endsWith(COMMENT_END)) {
          // Uncomment line
          const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
          const content = trimmedLine.slice(COMMENT_START.length, -COMMENT_END.length);
          lines[lineIndex] = leadingWhitespace + content;
        } else {
          // Comment line
          const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
          lines[lineIndex] = leadingWhitespace + COMMENT_START + trimmedLine + COMMENT_END;
        }

        newMarkdown = lines.join('\n');
        // Keep cursor at roughly the same place (simplification)
        newSelectionStart = newSelectionEnd = start; 
      }

      setMarkdown(newMarkdown);
      
      // We need to restore focus and selection after React re-renders
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
        }
      }, 0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={clsx(
        "h-full flex flex-col border-r border-gray-200 dark:border-gray-800 editor-pane bg-gray-50 dark:bg-gray-900",
        viewMode === 'edit' ? "w-full" : viewMode === 'split' ? "w-1/2" : "w-0 hidden"
      )}
    >
      <div className="w-full max-w-3xl mx-auto h-full flex flex-col">
        <textarea
          ref={textareaRef}
          className="w-full h-full resize-none p-8 outline-none bg-transparent font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Start writing..."
        />
      </div>
        </div>
      );
    });
    