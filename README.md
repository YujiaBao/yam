# Yam (Yet Another Markdown App)

<p align="center">
  <img src="build/icon.png" alt="Yam Icon" width="128" height="128" />
</p>

<p align="center">
  <strong>A modern, minimalist, and powerful Markdown editor for macOS.</strong>
</p>

<p align="center">
  <a href="https://github.com/YujiaBao/yam/actions"><img src="https://github.com/YujiaBao/yam/actions/workflows/build.yml/badge.svg" alt="Build Status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</p>

---

**Yam** is built with [Electron](https://www.electronjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/), designed to provide a native-like experience on macOS with a focus on simplicity and customizability.

## ✨ Features

*   **Modern UI:** Clean, glassmorphism-inspired design.
*   **Split View:** Real-time editing and preview side-by-side.
*   **Theming:**
    *   **Light/Dark Mode:** Instant toggle.
    *   **Custom CSS Themes:** Built-in presets (*Solarized*, *GitHub*, *Dracula*, *Nord*, *Cobalt*) + full user customization.
    *   **CSS Reference:** Built-in helper to identify selectors.
*   **Typography:** Control font family (Sans, Serif, Mono) and weight (Light, Normal, Bold).
*   **Rich Content:**
    *   **GFM Support:** Tables, checklists, strikethrough.
    *   **HTML Support:** Render inline HTML tags.
    *   **Syntax Highlighting:** Beautiful code blocks for various languages.
*   **Productivity:**
    *   **PDF Export:** High-quality export with theme preservation.
    *   **File Associations:** Open `.md` files directly from Finder.
    *   **Drag & Drop:** Open files by dropping them on the app.

## 🛠️ Architecture

*   **`src/components/`**: Modular UI (Sidebar, Editor, Preview, Settings).
*   **`src/hooks/`**: Logic encapsulation (e.g., `useThemes`).
*   **`electron/`**: Main process (Window management, IPC, native dialogs).

## 🚀 Development

### Prerequisites

*   Node.js (v18+)
*   npm

### Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YujiaBao/yam.git
    cd yam
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run locally:**
    ```bash
    npm run dev
    ```

### Building for Production

Build the React app and package for macOS (`.dmg`):

```bash
npm run dist
```

Artifacts will be in the `release/` directory.

### Testing

```bash
npm test
```

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).