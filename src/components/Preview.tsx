import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import type { ViewMode } from '../types';

interface PreviewProps {
  markdown: string;
  viewMode: ViewMode;
  theme: 'light' | 'dark';
}

export const Preview: React.FC<PreviewProps> = ({ markdown, viewMode, theme }) => {
  return (
    <div className={clsx(
      "h-full overflow-y-auto bg-white dark:bg-gray-900 preview-pane",
      viewMode === 'preview' ? "w-full" : viewMode === 'split' ? "w-1/2" : "w-0 hidden"
    )}>
      <div className="max-w-3xl mx-auto p-8 prose dark:prose-invert prose-slate prose-a:text-indigo-600 hover:prose-a:text-indigo-500 lg:prose-lg xl:prose-xl">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={theme === 'dark' ? dracula : ghcolors}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};