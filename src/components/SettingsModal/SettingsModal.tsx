import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, HelpCircle, Lock, Palette, Code, Copy, Edit2, Search } from 'lucide-react';
import clsx from 'clsx';
import type { Theme, FontOption, FontWeight } from '../../types';
import { DEFAULT_THEMES } from '../../constants/themes';
import { parseCss, generateCss } from '../../utils/cssMapper';

interface SettingsModalProps {
  onClose: () => void;
  cssThemes: Theme[];
  activeThemeId: string;
  activeCss: string;
  setActiveThemeId: (id: string) => void;
  onCssChange: (newCss: string) => void;
  onCreateTheme: () => void;
  onDuplicateTheme: (id: string) => void;
  onRenameTheme: (id: string, newName: string) => void;
  onDeleteTheme: () => void;
  onImportCss: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDefaultTheme: boolean;
  fonts: FontOption[];
  activeFontId: string;
  setActiveFontId: (id: string) => void;
  getSystemFonts: () => Promise<{ family: string; name: string }[]>;
  onCreateFont: (name: string, family: string, weights: FontWeight[]) => void;
  onDeleteFont: (id: string) => void;
}

const CSS_HELP = [
  { selector: '.markdown-body', desc: 'Main content container' },
  { selector: '.markdown-body h1, h2, h3', desc: 'Headings' },
  { selector: '.markdown-body p', desc: 'Paragraphs' },
  { selector: '.markdown-body li', desc: 'List items (bullet points)' },
  { selector: '.markdown-body ul, .markdown-body ol', desc: 'List containers' },
  { selector: '.markdown-body a', desc: 'Links' },
  { selector: '.markdown-body pre', desc: 'Code blocks' },
  { selector: '.markdown-body code', desc: 'Inline code' },
  { selector: '.markdown-body blockquote', desc: 'Quotes' },
  { selector: 'body', desc: 'App background' },
];

/**
 * Modal for application settings and custom CSS theme management.
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  cssThemes,
  activeThemeId,
  activeCss,
  setActiveThemeId,
  onCssChange,
  onCreateTheme,
  onDuplicateTheme,
  onRenameTheme,
  onDeleteTheme,
  onImportCss,
  isDefaultTheme,
  fonts,
  activeFontId,
  setActiveFontId,
  getSystemFonts,
  onCreateFont,
  onDeleteFont
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'fonts'>('themes');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [showHelp, setShowHelp] = useState(false);
  
  // Font discovery state
  const [showSystemFonts, setShowSystemFonts] = useState(false);
  const [systemFonts, setSystemFonts] = useState<{ family: string; name: string }[]>([]);
  const [fontSearch, setFontSearch] = useState('');
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);

  // Inline renaming state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');

  const visualSettings = parseCss(activeCss);

  useEffect(() => {
    if (activeTab === 'fonts' && showSystemFonts && systemFonts.length === 0) {
      loadFonts();
    }
  }, [activeTab, showSystemFonts]);

  const loadFonts = async () => {
    setIsLoadingFonts(true);
    const available = await getSystemFonts();
    setSystemFonts(available);
    setIsLoadingFonts(false);
  };

  const handleVisualSettingChange = (key: keyof typeof visualSettings, value: string) => {
    const newSettings = { ...visualSettings, [key]: value };
    onCssChange(generateCss(newSettings));
  };

  const startRename = (theme: Theme) => {
    setRenamingId(theme.id);
    setRenamingValue(theme.name);
  };

  const submitRename = () => {
    if (renamingId && renamingValue.trim()) {
      onRenameTheme(renamingId, renamingValue.trim());
    }
    setRenamingId(null);
  };

  const handleAddFont = (f: { family: string; name: string }) => {
    onCreateFont(f.name, f.family, ['normal']);
    setShowSystemFonts(false);
  };

  const parsePx = (val: any): number => {
    const parsed = parseInt(String(val));
    return isNaN(parsed) ? 0 : parsed;
  };

  const parseFloatSafe = (val: any): number => {
    const parsed = parseFloat(String(val));
    return isNaN(parsed) ? 1.6 : parsed;
  };

  const filteredSystemFonts = systemFonts.filter(f => 
    f.name.toLowerCase().includes(fontSearch.toLowerCase()) || 
    f.family.toLowerCase().includes(fontSearch.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[750px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold">Settings</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('themes')}
                className={clsx(
                  "text-sm font-medium transition-colors",
                  activeTab === 'themes' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                Themes
              </button>
              <button 
                onClick={() => setActiveTab('fonts')}
                className={clsx(
                  "text-sm font-medium transition-colors",
                  activeTab === 'fonts' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                Fonts
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex min-h-0">
          {activeTab === 'themes' ? (
            <>
              {/* Theme List */}
              <div className="w-1/4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col min-h-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-semibold text-[10px] text-gray-500 uppercase tracking-wider">Themes</span>
                  <div className="flex gap-1">
                    <label className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400" title="Import CSS">
                      <input type="file" className="hidden" accept=".css" onChange={onImportCss} />
                      <Upload size={14} />
                    </label>
                    <button onClick={onCreateTheme} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400" title="New Theme from Current">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1 min-h-0">
                  {cssThemes.map(t => (
                    <div
                      key={t.id}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center justify-between group",
                        activeThemeId === t.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                      onClick={() => setActiveThemeId(t.id)}
                    >
                      {renamingId === t.id ? (
                        <input 
                          autoFocus
                          className="bg-white text-gray-900 px-1 py-0.5 rounded w-full outline-none"
                          value={renamingValue}
                          onChange={(e) => setRenamingValue(e.target.value)}
                          onBlur={submitRename}
                          onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="truncate pr-2">{t.name}</span>
                      )}
                      
                      <div className="flex gap-1 items-center">
                        {!DEFAULT_THEMES.some(dt => dt.id === t.id) && renamingId !== t.id && (
                          <button
                            onClick={(e) => { e.stopPropagation(); startRename(t); }}
                            className={clsx(
                              "opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity",
                              activeThemeId === t.id ? "hover:bg-indigo-700" : "hover:bg-gray-300 dark:hover:bg-gray-700"
                            )}
                          >
                            <Edit2 size={10} />
                          </button>
                        )}
                        {!DEFAULT_THEMES.some(dt => dt.id === t.id) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTheme(); }}
                            className={clsx(
                              "opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity",
                              activeThemeId === t.id ? "hover:bg-indigo-700" : "hover:bg-gray-300 dark:hover:bg-gray-700"
                            )}
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-medium">{cssThemes.find(t => t.id === activeThemeId)?.name}</h3>
                    <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg">
                      <button
                        onClick={() => setEditorMode('visual')}
                        className={clsx(
                          "px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all",
                          editorMode === 'visual' ? "bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-300" : "text-gray-500"
                        )}
                      >
                        <Palette size={12} /> VISUAL
                      </button>
                      <button
                        onClick={() => setEditorMode('code')}
                        className={clsx(
                          "px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all",
                          editorMode === 'code' ? "bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-300" : "text-gray-500"
                        )}
                      >
                        <Code size={12} /> CSS
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDefaultTheme && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold">
                        <Lock size={10} /> READ ONLY
                      </div>
                    )}
                    <button 
                      onClick={() => setShowHelp(!showHelp)}
                      className={clsx(
                        "p-1.5 rounded-lg transition-colors",
                        showHelp ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                      )}
                      title="CSS Reference"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden min-h-0">
                  <div className={clsx("flex-1 overflow-y-auto p-6 space-y-8 min-h-0", isDefaultTheme && "pb-24")}>
                    {editorMode === 'visual' ? (
                      <div className="grid grid-cols-2 gap-8">
                        {/* Colors Column */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Colors</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Background</label>
                              <input 
                                type="color" 
                                value={visualSettings.backgroundColor}
                                onChange={(e) => handleVisualSettingChange('backgroundColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Text</label>
                              <input 
                                type="color" 
                                value={visualSettings.textColor}
                                onChange={(e) => handleVisualSettingChange('textColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Headings</label>
                              <input 
                                type="color" 
                                value={visualSettings.headingColor}
                                onChange={(e) => handleVisualSettingChange('headingColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Links</label>
                              <input 
                                type="color" 
                                value={visualSettings.linkColor}
                                onChange={(e) => handleVisualSettingChange('linkColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Code Text</label>
                              <input 
                                type="color" 
                                value={visualSettings.codeColor}
                                onChange={(e) => handleVisualSettingChange('codeColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Code Background</label>
                              <input 
                                type="color" 
                                value={visualSettings.codeBackgroundColor}
                                onChange={(e) => handleVisualSettingChange('codeBackgroundColor', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                          </div>

                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4">Typography</h4>
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Font Size</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.fontSize}</span>
                              </div>
                              <input 
                                type="range" min="12" max="32" value={parsePx(visualSettings.fontSize)}
                                onChange={(e) => handleVisualSettingChange('fontSize', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Line Height</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.lineHeight}</span>
                              </div>
                              <input 
                                type="range" min="10" max="25" value={Math.round(parseFloatSafe(visualSettings.lineHeight) * 10)}
                                onChange={(e) => handleVisualSettingChange('lineHeight', (parseInt(e.target.value) / 10).toString())}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Spacing & Layout Column */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spacing</h4>
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Paragraph Margin</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.paragraphMargin}</span>
                              </div>
                              <input 
                                type="range" min="0" max="40" value={parsePx(visualSettings.paragraphMargin)}
                                onChange={(e) => handleVisualSettingChange('paragraphMargin', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Heading Top</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.headingMarginTop}</span>
                              </div>
                              <input 
                                type="range" min="0" max="60" value={parsePx(visualSettings.headingMarginTop)}
                                onChange={(e) => handleVisualSettingChange('headingMarginTop', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Heading Bottom</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.headingMarginBottom}</span>
                              </div>
                              <input 
                                type="range" min="0" max="40" value={parsePx(visualSettings.headingMarginBottom)}
                                onChange={(e) => handleVisualSettingChange('headingMarginBottom', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Block Padding</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.blockPadding}</span>
                              </div>
                              <input 
                                type="range" min="0" max="40" value={parsePx(visualSettings.blockPadding)}
                                onChange={(e) => handleVisualSettingChange('blockPadding', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          </div>

                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4">Layout</h4>
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Max Width</label>
                                <span className="text-[10px] font-mono text-gray-400">{visualSettings.maxWidth}</span>
                              </div>
                              <input 
                                type="range" min="400" max="1200" step="10" value={parsePx(visualSettings.maxWidth)}
                                onChange={(e) => handleVisualSettingChange('maxWidth', `${e.target.value}px`)}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <textarea
                        className="w-full h-full bg-transparent font-mono text-xs resize-none outline-none leading-relaxed min-h-0"
                        placeholder="/* Enter custom CSS */"
                        value={activeCss}
                        onChange={(e) => onCssChange(e.target.value)}
                        spellCheck={false}
                        readOnly={isDefaultTheme}
                      />
                    )}
                  </div>

                  {isDefaultTheme && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent flex justify-center pointer-events-none">
                      <button
                        onClick={() => onDuplicateTheme(activeThemeId)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 pointer-events-auto"
                      >
                        <Copy size={16} /> DUPLICATE TO EDIT
                      </button>
                    </div>
                  )}

                  {showHelp && (
                    <div className="w-1/3 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-4 border-l border-gray-200 dark:border-gray-700 min-h-0">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">CSS Reference</h4>
                      <div className="space-y-4">
                        {CSS_HELP.map(item => (
                          <div key={item.selector} className="group">
                            <code className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                              {item.selector}
                            </code>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Font List */}
              <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col min-h-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-semibold text-[10px] text-gray-500 uppercase tracking-wider">Fonts</span>
                  <button 
                    onClick={() => setShowSystemFonts(!showSystemFonts)}
                    className={clsx(
                      "p-1.5 rounded-lg transition-colors",
                      showSystemFonts ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )}
                    title="Add Font"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1 min-h-0">
                  {fonts.map(f => (
                    <div
                      key={f.id}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center justify-between group",
                        activeFontId === f.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                      onClick={() => setActiveFontId(f.id)}
                    >
                      <span className="truncate pr-2" style={{ fontFamily: f.family }}>{f.name}</span>
                      {fonts.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteFont(f.id); }}
                          className={clsx(
                            "opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity",
                            activeFontId === f.id ? "hover:bg-indigo-700" : "hover:bg-gray-300 dark:hover:bg-gray-700"
                          )}
                        >
                          <Trash2 size={12} className="lucide-trash2" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Browser / Details */}
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {showSystemFonts ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex gap-3">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          autoFocus
                          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-500 transition-colors"
                          placeholder="Search system fonts..."
                          value={fontSearch}
                          onChange={(e) => setFontSearch(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => setShowSystemFonts(false)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        BACK
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 min-h-0">
                      {isLoadingFonts ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-medium">Scanning system fonts...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {filteredSystemFonts.map(f => (
                            <div 
                              key={f.family}
                              className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 group transition-all"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="truncate pr-2">
                                  <p className="text-xs font-bold truncate">{f.name}</p>
                                  <p className="text-[10px] text-gray-400 truncate font-mono">{f.family}</p>
                                </div>
                                <button 
                                  onClick={() => handleAddFont(f)}
                                  className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <p className="text-lg truncate" style={{ fontFamily: f.family }}>
                                The quick brown fox
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  fonts.find(f => f.id === activeFontId) && (
                    <div className="p-8 overflow-y-auto min-h-0">
                      <div className="max-w-md space-y-8">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{fonts.find(f => f.id === activeFontId)?.name}</h3>
                          <p className="text-xs text-gray-500 font-mono">{fonts.find(f => f.id === activeFontId)?.family}</p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview</h4>
                          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4" style={{ fontFamily: fonts.find(f => f.id === activeFontId)?.family }}>
                            <p className="text-2xl font-bold">The quick brown fox jumps over the lazy dog</p>
                            <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              Grumpy wizards make toxic brew for the evil Queen and Jack. One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Weights</h4>
                          <div className="flex gap-2">
                            {['light', 'normal', 'bold'].map(w => (
                              <div 
                                key={w}
                                className={clsx(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-bold border",
                                  fonts.find(f => f.id === activeFontId)?.weights.includes(w as FontWeight)
                                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
                                )}
                              >
                                {w.toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-500 italic">
                            * Note: Weights are currently read from the font definition. In a future update, you'll be able to toggle supported weights for custom fonts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};