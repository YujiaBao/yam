# Yam (Yet Another Markdown App)

A modern, minimalist, and powerful Markdown editor for macOS. Built with **Electron**, **React**, **TypeScript**, and **Tailwind CSS**.

## Features

*   **Modern UI:** Clean, glassmorphism-inspired design that feels native on macOS.
*   **Split View:** Real-time editing and preview side-by-side.
*   **Theming:**
    *   **Light/Dark Mode:** Built-in toggle with instant switching.
    *   **Custom CSS Themes:** Create, import, and manage custom CSS themes to style the editor and preview exactly how you like. Includes presets like *Solarized*, *GitHub Dark*, *Dracula*, *Nord*, and *Cobalt*.
    *   **CSS Reference Guide:** Built-in helper to identify CSS selectors for customization.
*   **Typography Control:** Toggle fonts (Sans, Serif, Mono) and font weights (Light, Normal, Bold).
*   **HTML Support:** Full support for rendering inline HTML tags within Markdown.
*   **Code Highlighting:** Syntax highlighting for code blocks with dedicated themes for light and dark modes.
*   **PDF Export:** Export your rendered Markdown to high-quality PDF files.
*   **File Support:** 
    *   Open and edit local `.md` and `.txt` files.
    *   **File Associations:** Automatically opens Markdown files from Finder or via "Open With".
    *   **Drag & Drop:** Drag files onto the app icon to open them.

## Architecture

The project follows a modular React architecture within an Electron environment.

*   **`src/components/`**: Reusable UI components (Sidebar, Editor, Preview, SettingsModal).
*   **`src/hooks/`**: Custom React hooks for logic encapsulation (e.g., `useThemes` for theme management).
*   **`src/types/`**: TypeScript type definitions.
*   **`src/constants/`**: App-wide constants (e.g., default theme presets).
*   **`electron/`**: Main process code for Electron (window management, IPC handlers).

## Development

### Prerequisites

*   Node.js (v18+)
*   npm

### Installation

```bash
git clone https://github.com/YujiaBao/yam.git
cd yam
npm install
```

### Running in Development Mode

Starts the Vite dev server (frontend) and Electron (main process) with hot-reloading.

```bash
npm run dev
```

### Building for Production

Builds the React app, compiles the Electron main process, and packages the application for macOS (`.dmg`).

```bash
npm run dist
```

The output `.dmg` file will be located in the `release/` directory.

### Running Tests

Run the Vitest test suite to verify UI components and logic.

```bash
npm test
```

## Customization

### Adding a Custom App Icon

Place a 512x512 PNG file named `icon.png` in the `build/` directory before running the build command. The build script will use this icon for the macOS application.

## Technologies Used

*   **Runtime:** [Electron](https://www.electronjs.org/)
*   **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) + [rehype-raw](https://github.com/rehypejs/rehype-raw)
*   **Syntax Highlighting:** [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
*   **Icons:** [Lucide React](https://lucide.dev/)

## License

Apache-2.0
