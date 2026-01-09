import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  ghcolors, 
  dracula, 
  solarizedlight, 
  nord, 
  atomDark, 
  solarizedDarkAtom,
  vscDarkPlus
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import type { ViewMode } from '../../types';

interface PreviewProps {
  markdown: string;
  viewMode: ViewMode;
  isDark: boolean;
  themeId: string;
  filePath?: string;
}

/**
 * Markdown Preview component.
 * Renders markdown to HTML with GitHub styling, code syntax highlighting, and local image support.
 */
export const Preview = forwardRef<HTMLElement, PreviewProps>(({ markdown, viewMode, isDark, themeId, filePath }, ref) => {
  const getSyntaxTheme = () => {
    switch (themeId) {
      case 'github-light':
        return ghcolors;
      case 'solarized-light':
        return solarizedlight;
      case 'solarized-dark':
        return solarizedDarkAtom;
      case 'nord':
        return nord;
      case 'dracula':
        return dracula;
      case 'github-dark':
        return vscDarkPlus;
      case 'cobalt':
        return atomDark; // Cobalt isn't always available in default prism styles, atomDark is a good proxy
      default:
        return isDark ? dracula : ghcolors;
    }
  };

  const syntaxTheme = getSyntaxTheme();
  const transformImageUri = (uri: string) => {
    // If it's an absolute URL or data URI, return as is
    if (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('//') || uri.startsWith('data:')) {
      return uri;
    }

    // If we have a file path, try to resolve relative paths
    if (filePath && !uri.startsWith('/')) {
      // Get directory of current file
      const dir = filePath.substring(0, filePath.lastIndexOf('/'));
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
    <div 
      ref={ref as any}
      className={clsx(
        "h-full overflow-y-auto preview-pane",
        viewMode === 'preview' ? "w-full" : viewMode === 'split' ? "w-1/2" : "w-0 hidden"
      )}
    >
      {/* GitHub Markdown styling container */}
      <div 
        className={clsx(
            "mx-auto p-8 markdown-body",
            isDark ? 'markdown-body-dark' : 'markdown-body-light'
        )}
        style={{ 
            backgroundColor: 'transparent',
            minHeight: '100%'
        }}
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          urlTransform={transformImageUri}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="my-6 rounded-xl overflow-hidden border border-black/[0.03] dark:border-white/[0.03]">
                  <SyntaxHighlighter
                    style={syntaxTheme}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ 
                      margin: 0, 
                      padding: '1.5em',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      background: 'var(--color-canvas-code)',
                      border: 'none'
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
                </div>
              ) : (
                <code className={clsx(className, "font-medium bg-[var(--color-canvas-code)] px-1.5 py-0.5 rounded text-sm")} {...props}>
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
});
