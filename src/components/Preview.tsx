import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import clsx from 'clsx';
import type { ViewMode } from '../types';

interface PreviewProps {
  markdown: string;
  viewMode: ViewMode;
}

export const Preview: React.FC<PreviewProps> = ({ markdown, viewMode }) => {
  return (
    <div className={clsx(
      "h-full overflow-y-auto bg-white dark:bg-gray-900 preview-pane",
      viewMode === 'preview' ? "w-full" : viewMode === 'split' ? "w-1/2" : "w-0 hidden"
    )}>
      <div className="max-w-3xl mx-auto p-8 prose dark:prose-invert prose-slate prose-a:text-indigo-600 hover:prose-a:text-indigo-500 lg:prose-lg xl:prose-xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
