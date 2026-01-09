import React, { useState } from 'react';
import { Download, Github, Palette, Type, Shield } from 'lucide-react';
import { DEFAULT_THEMES } from '@/constants/themes';
import { Preview } from '@/components/Preview/Preview';
import { scopeCss } from '@/utils/cssMapper';
import clsx from 'clsx';

const demoMarkdown = "# Hello from Yam 🍠\n\n**Yam** is a modern, minimalist editor for macOS.\n\n```typescript\nconst greeting = \"Beautiful code blocks\";\nconsole.log(greeting);\n```\n\n- [x] Full GFM Support\n- [x] Custom Themes\n- [x] System Font Integration\n";

const LandingPage: React.FC = () => {
  const [activeThemeId, setActiveThemeId] = useState('github-light');
  const activeTheme = DEFAULT_THEMES.find(t => t.id === activeThemeId) || DEFAULT_THEMES[0];

  const scopedCss = scopeCss(activeTheme.css, '#demo-window-root');

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 flex flex-col text-gray-900">
      {/* Scope the theme CSS only to the demo window container */}
      <style>{scopedCss}</style>

      {/* Navigation */}
      <nav role="navigation" className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Yam Logo" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Yam</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/YujiaBao/yam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              <Github size={18} />
              <span className="text-sm font-medium">YujiaBao / yam</span>
            </a>
            <a 
              href="https://github.com/YujiaBao/yam/releases/latest/download/Yam-0.0.0-arm64.dmg"
              className="hidden sm:block bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-md shadow-gray-200"
            >
              Download DMG
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 text-gray-900">
            Yam
          </h1>

          {/* Prominent App Icon */}
          <div className="relative mb-12 inline-block group">
            {/* Soft Glow Effect */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 transition-colors duration-500" />
            
            <div className="relative w-32 h-32 md:w-40 md:h-40 transition-all duration-500 active:scale-95">
              <div className="w-full h-full rounded-[22.5%] overflow-hidden shadow-2xl">
                <img src="/icon.png" alt="Yam App Icon" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto mb-12 leading-tight">
            Yet Another Markdown app.
          </p>

          {/* Primary CTA Section */}
          <div className="flex flex-col items-center justify-center gap-6 mb-24">
            <a 
              href="https://github.com/YujiaBao/yam/releases/latest/download/Yam-0.0.0-arm64.dmg"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 text-decoration-none"
            >
              <Download size={20} />
              Download for macOS
            </a>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400 font-bold tracking-wide uppercase">Version 0.0.0 (Universal)</span>
              <span className="text-[10px] text-gray-400 font-medium opacity-80">Free & Open Source</span>
            </div>
          </div>

          {/* Interactive Demo Window */}
          <div 
            data-testid="demo-window"
            className="relative max-w-4xl mx-auto rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden bg-white group"
          >
            {/* macOS Window Title Bar */}
            <div className="h-12 bg-gray-50/80 border-b border-gray-200 flex items-center px-4 gap-4 backdrop-blur-sm">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="flex bg-gray-200/50 p-1 rounded-xl gap-1 overflow-x-auto no-scrollbar max-w-[300px] sm:max-w-none">
                  {['github-light', 'nord', 'dracula'].map(id => (
                    <button
                      key={id}
                      onClick={() => setActiveThemeId(id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap uppercase tracking-wider",
                        activeThemeId === id ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {id.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-16 hidden sm:block" />
            </div>

            {/* Scoped Render Area */}
            <div id="demo-window-root" className="h-[500px] overflow-hidden relative text-left">
              <Preview 
                markdown={demoMarkdown}
                viewMode="preview"
                isDark={!!activeTheme.isDark}
                themeId={activeThemeId}
              />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white py-32 border-t border-gray-100 text-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                  <Palette size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Visual Themes</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Adjust spacing, typography, and colors with intuitive sliders. Changes sync instantly with raw CSS.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                  <Type size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">System Fonts</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Integrate directly with your macOS Font Book. Browse, search, and use any system font effortlessly.
                  </p>
                </div>
              </div>
              <div className="space-y-6 text-gray-900">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Local & Private</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Yam works entirely on your local machine. No cloud sync, no tracking, just you and your files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 text-gray-400">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm">© 2026 Yujia Bao. Built with React & Tailwind CSS.</p>
          <div className="flex gap-8 text-sm font-bold">
            <a href="https://github.com/YujiaBao/yam" className="hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px]">GitHub</a>
            <a href="https://github.com/YujiaBao/yam/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px]">Apache 2.0</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
