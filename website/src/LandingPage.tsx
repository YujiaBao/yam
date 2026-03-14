import React, { useState } from 'react';
import { Download, Github, Shield, Terminal, Layout } from 'lucide-react';
import { DEFAULT_THEMES } from '@/constants/themes';
import { DEFAULT_FONTS } from '@/constants/fonts';
import { Preview } from '@/components/Preview/Preview';
import { Editor } from '@/components/Editor/Editor';
import { SettingsModal } from '@/components/SettingsModal/SettingsModal';
import { FeatureCarousel, FeatureSlide } from './components/FeatureCarousel';
import clsx from 'clsx';

const demoMarkdown = "# Hello from Yam 🍠\n\n**Yam** is a modern, minimalist editor for macOS.\n\n```typescript\nconst greeting = \"Beautiful code blocks\";\nconsole.log(greeting);\n```\n\n- [x] Full GFM Support\n- [x] Custom Themes\n- [x] System Font Integration\n";

// Slide 0: Split View Demo
const SplitViewDemo = () => {
  const [md, setMd] = useState(demoMarkdown);
  return (
    <div className="w-full h-full flex bg-white overflow-hidden demo-no-max-width">
      <Editor markdown={md} setMarkdown={setMd} viewMode="split" />
      <Preview markdown={md} viewMode="split" isDark={false} themeId="github-light" />
    </div>
  );
};

// Slide 2: Minimalist
const MinimalistDemo = () => (
  <div className="w-full h-full bg-white flex items-center justify-center p-8 sm:p-12 demo-no-max-width overflow-hidden">
    <div className="w-full max-w-2xl h-full overflow-y-auto custom-scrollbar text-left">
      <Preview 
        markdown={`# 🏔️ The Art of Focus\n\n> "Simplicity is the ultimate sophistication." — Leonardo da Vinci\n\nSometimes the best way to write is to hide everything else. Yam's minimalist mode removes all distractions so you can focus on your thoughts.\n\n### Why Focus Mode?\n- **Clarity**: No buttons, no bars, just your text.\n- **Flow**: Stay in the zone longer.\n- **Beauty**: Clean typography that feels like paper.\n\nYam provides a zen-like environment where the interface fades away, leaving only you and your words.`} 
        viewMode="preview" 
        isDark={false} 
        themeId="github-light" 
      />
    </div>
  </div>
);

// Slide 3: Settings Mock (Real Component)
const SettingsDemo = ({ activeTab = 'themes', initialTheme = 'github-light' }: { activeTab?: 'themes' | 'fonts' | 'general', initialTheme?: string }) => {
  const [activeThemeId, setActiveThemeId] = useState(initialTheme);
  const activeTheme = DEFAULT_THEMES.find(t => t.id === activeThemeId) || DEFAULT_THEMES[0];
  
  return (
    <div className={clsx("w-full h-full relative", activeTheme.isDark && "dark")}>
       <SettingsModal 
          onClose={() => {}}
          cssThemes={DEFAULT_THEMES}
          activeThemeId={activeThemeId}
          activeCss={activeTheme.css}
          setActiveThemeId={setActiveThemeId}
          onCssChange={() => {}}
          onCreateTheme={() => {}}
          onDuplicateTheme={() => {}}
          onRenameTheme={() => {}}
          onDeleteTheme={() => {}}
          onImportCss={() => {}}
          isDefaultTheme={true}
          fonts={DEFAULT_FONTS}
          activeFontId="sans"
          setActiveFontId={() => {}}
          getSystemFonts={async () => []}
          onCreateFont={() => {}}
          onDeleteFont={() => {}}
          launchViewMode="split"
          setLaunchViewMode={() => {}}
          fileOpenViewMode="preview"
          setFileOpenViewMode={() => {}}
          customDefaultContent="" 
          setCustomDefaultContent={() => {}}
          initialTab={activeTab}
          embedded={true}
          className="w-full h-full max-w-none rounded-none shadow-none border-none h-auto"
        />
    </div>
  );
};

// Slide 4: Open Source
const OpenSourceDemo = () => (
  <div className="w-full h-full bg-white flex flex-col items-center justify-center text-gray-900 p-8">
    <Github size={64} className="mb-6 text-gray-200" />
    <h3 className="text-3xl font-bold mb-2">100% Open Source</h3>
    <p className="text-gray-500 mb-8 max-w-md text-center">Transparent, secure, and built by the community. No tracking, no hidden costs.</p>
    <div className="flex gap-4">
      <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-sm font-mono text-gray-600">TypeScript</span>
      </div>
      <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-400" />
        <span className="text-sm font-mono text-gray-600">React</span>
      </div>
      <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-purple-400" />
        <span className="text-sm font-mono text-gray-600">Electron</span>
      </div>
    </div>
  </div>
);

const slides: FeatureSlide[] = [
  {
    id: 'split',
    title: 'Modern Workspace',
    description: 'Edit and preview in real-time with synchronized scrolling. A seamless bridge between raw code and polished output.',
    content: <SplitViewDemo />
  },
  {
    id: 'minimalist',
    title: 'Distraction Free',
    description: 'Hide the interface and focus entirely on your writing with our clean, minimalist preview mode.',
    content: <MinimalistDemo />
  },
  {
    id: 'themes',
    title: 'Visual Theming',
    description: 'Switch between built-in presets or customize every color, spacing, and layout detail to match your vibe.',
    content: <SettingsDemo activeTab="themes" initialTheme="github-light" />
  },
  {
    id: 'fonts',
    title: 'Typography',
    description: 'Bring your own system fonts. Control weights, families, and sizing for the perfect reading experience.',
    content: <SettingsDemo activeTab="fonts" initialTheme="github-light" />
  },
  {
    id: 'opensource',
    title: 'Open Source',
    description: 'Built with transparency and security in mind. Inspect the code, contribute, and own your tools.',
    content: <OpenSourceDemo />
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 flex flex-col">
      <style>{`
        .demo-no-max-width .markdown-body {
          max-width: none !important;
        }
      `}</style>
      {/* Navigation */}
      <nav role="navigation" className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Yam Logo" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Yam</span>
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
              href="https://github.com/YujiaBao/yam/releases/latest/download/Yam-0.3.0-arm64.dmg"
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
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-12 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 text-gray-900">
            Yam
          </h1>

          {/* Prominent App Icon */}
          <div className="relative mb-12 inline-block group">
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

          <div className="flex flex-col items-center justify-center gap-6 mb-24">
            <a 
              href="https://github.com/YujiaBao/yam/releases/latest/download/Yam-0.3.0-arm64.dmg"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 text-decoration-none"
            >
              <Download size={20} />
              Download for macOS
            </a>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400 font-bold tracking-wide uppercase">Version 0.3.0 (Universal)</span>
              <span className="text-[10px] text-gray-400 font-medium opacity-80">Free & Open Source</span>
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="bg-gray-50/50 border-t border-gray-100 py-12">
          <FeatureCarousel slides={slides} />
        </section>

        {/* Detailed Feature Grid */}
        <section className="bg-white py-32 border-t border-gray-100 text-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                  <Layout size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Modern Layout</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Split view, preview only, or editor only. Configure your workspace to match your flow.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                  <Terminal size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Developer Friendly</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Syntax highlighting for 100+ languages and direct raw CSS access for themes.
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
            <a href="https://github.com/YujiaBao/yam/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px]">Apache 2.0</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;