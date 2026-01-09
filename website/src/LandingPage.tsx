import React, { useState } from 'react';
import { Download, Github, Palette, Type, Shield } from 'lucide-react';
import { DEFAULT_THEMES } from '@/constants/themes';
import { Preview } from '@/components/Preview/Preview';
import clsx from 'clsx';

const demoMarkdown = "# Hello from Yam 🍠\n\n**Yam** is a modern, minimalist editor for macOS.\n\n```typescript\nconst greeting = \"Beautiful code blocks\";\nconsole.log(greeting);\n```\n\n- [x] Full GFM Support\n- [x] Custom Themes\n- [x] System Font Integration\n";

const LandingPage: React.FC = () => {
  const [activeThemeId, setActiveThemeId] = useState('github-light');
  const activeTheme = DEFAULT_THEMES.find(t => t.id === activeThemeId) || DEFAULT_THEMES[0];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100">
      <style>{activeTheme.css}</style>

      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10 text-gray-900">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="Yam" className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tight">Yam</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com/YujiaBao/yam" className="text-gray-500 hover:text-gray-900 transition-colors">
            <Github size={22} />
          </a>
          <a 
            href="https://github.com/YujiaBao/yam/releases/latest/download/Yam-0.0.0-arm64.dmg"
            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            Download
          </a>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent">
          Modern Markdown for macOS.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed text-gray-500">
          Minimalist editor with powerful customization. Visual themes, system font discovery, and bidirectional CSS mapping.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
          <a 
            href="https://github.com/YujiaBao/yam/releases/latest/download/Yam-0.0.0-arm64.dmg"
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95"
          >
            <Download size={20} />
            Download for macOS
          </a>
          <span className="text-sm text-gray-400 font-medium">Free & Open Source</span>
        </div>

        <div 
          data-testid="demo-window"
          className={clsx(
            "relative max-w-4xl mx-auto rounded-3xl shadow-2xl border border-gray-200 overflow-hidden bg-white transition-all duration-500",
            `theme-${activeThemeId}`
          )}
        >
          <div className="h-12 bg-gray-50/50 border-b border-gray-200 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center overflow-x-auto hide-scrollbar">
              <div className="flex bg-gray-200/50 p-1 rounded-lg gap-1 whitespace-nowrap">
                {['github-light', 'nord', 'dracula', 'solarized-dark'].map(id => (
                  <button
                    key={id}
                    onClick={() => setActiveThemeId(id)}
                    className={clsx(
                      "px-3 py-1 rounded text-[10px] font-bold transition-all whitespace-nowrap",
                      activeThemeId === id ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-hidden app-container">
            <Preview 
              markdown={demoMarkdown}
              viewMode="preview"
              isDark={!!activeTheme.isDark}
              themeId={activeThemeId}
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100 py-24 relative z-10 text-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-left text-gray-900">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Palette size={24} />
            </div>
            <h3 className="text-xl font-bold">Visual Themes</h3>
            <p className="text-gray-500 leading-relaxed text-gray-500">
              Adjust spacing, typography, and colors with intuitive sliders. Changes sync instantly with raw CSS.
            </p>
          </div>
          <div className="space-y-4 text-gray-900">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Type size={24} />
            </div>
            <h3 className="text-xl font-bold">System Fonts</h3>
            <p className="text-gray-500 leading-relaxed text-gray-500">
              Integrate directly with your macOS Font Book. Browse, search, and use any system font effortlessly.
            </p>
          </div>
          <div className="space-y-4 text-gray-900">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Local & Private</h3>
            <p className="text-gray-500 leading-relaxed text-gray-500">
              Yam works entirely on your local machine. No cloud sync, no tracking, just you and your files.
            </p>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-12 flex justify-between items-center text-sm text-gray-400 text-gray-400">
        <p>© 2026 Yujia Bao. Built with React & Electron.</p>
        <div className="flex gap-6">
          <a href="https://github.com/YujiaBao/yam" className="hover:text-gray-900 transition-colors text-gray-400">GitHub</a>
          <a href="LICENSE" className="hover:text-gray-900 transition-colors text-gray-400">License</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;