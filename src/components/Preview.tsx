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
  filePath?: string;
}

export const Preview: React.FC<PreviewProps> = ({ markdown, viewMode, theme, filePath }) => {
  const transformImageUri = (uri: string) => {
    // If it's an absolute URL or data URI, return as is
    if (/^https?:\]\/\//.test(uri) || /^data:/.test(uri)) {
      return uri;
    }

    // If we have a file path, try to resolve relative paths
    if (filePath && !uri.startsWith('/')) {
      // Get directory of current file
      const dir = filePath.substring(0, filePath.lastIndexOf('/')); // Simplified, assumes macOS/Linux paths
      // Construct yam-local URI
      // We need to encode the path components
      const absolutePath = `${dir}/${uri}`;
      return `yam-local://${absolutePath}`;
    }
    
    // If absolute path on file system
    if (uri.startsWith('/')) {
        return `yam-local://${uri}`;
    }

    return uri;
  };

  return (
    <div className={clsx(
      "h-full overflow-y-auto bg-white dark:bg-gray-900 preview-pane",
      viewMode === 'preview' ? "w-full" : viewMode === 'split' ? "w-1/2" : "w-0 hidden"
    )}>
      <div className="max-w-3xl mx-auto p-8 prose prose-sm sm:prose-base dark:prose-invert prose-slate prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-headings:font-[inherit] prose-pre:!bg-transparent prose-pre:!p-0 prose-pre:!m-0 prose-li:my-0 prose-ul:my-2 prose-ol:my-2">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          urlTransform={transformImageUri}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={theme === 'dark' ? dracula : ghcolors}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: '1.5em 0',
                    borderRadius: '0.8rem',
                    padding: '1.25em',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                  }}
                  codeTagProps={{
                    style: {
                      fontWeight: '500',
                      fontFamily: 'inherit'
                    }
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={clsx(className, "font-medium")} {...props}>
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
