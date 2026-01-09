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

*   **Modern UI:** Clean, focus-oriented design with theme-integrated backgrounds across the entire window.
*   **Split View:** Real-time editing and preview side-by-side.
*   **Advanced Theming:**
    *   **Visual Editor:** Intuitive sliders and color pickers for Colors, Typography, Spacing, and Layout.
    *   **Bidirectional Mapping:** Seamlessly switch between the Visual Editor and raw CSS; changes in one reflect in the other.
    *   **Built-in Presets:** *Solarized Light/Dark*, *GitHub Light/Dark*, *Dracula*, *Nord*, *Cobalt*.
    *   **Duplicate to Edit:** Easily customize built-in themes by duplicating them with one click.
*   **Typography:**
    *   **System Font Discovery:** Browse and add any font installed on your macOS system.
    *   **Dynamic Weights:** Support for Light, Normal, and Bold weights, automatically adjusted based on font capabilities.
    *   **Custom Font List:** Add, remove, and reorganize your preferred font families.
*   **Rich Content:**
    *   **GFM Support:** Tables, checklists, strikethrough.
    *   **HTML Support:** Render inline HTML tags.
    *   **Adaptive Syntax Highlighting:** Code blocks automatically match the active markdown theme.
    *   **Local Images:** Seamlessly load and render images from your local filesystem.
*   **Productivity:**
    *   **PDF Export:** High-quality export with theme preservation.
    *   **File Associations:** Open `.md` files directly from Finder.
    *   **Editor Shortcuts:**
        *   `Cmd + /`: Toggle comment on selected text or current line.

## 🛠️ Architecture

The project follows a modular React architecture designed for scalability and maintainability.

*   **`src/`**: Core Electron application source code.
*   **`website/`**: React-based landing page (hosted at [yam.yujia.io](https://yam.yujia.io)).
*   **Shared Core**: Logic like themes, typography, and CSS mapping are shared between the app and the website.

For a detailed breakdown of the project structure and shared logic, see [ARCHITECTURE.md](ARCHITECTURE.md).

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

3.  **Run the App locally:**
    ```bash
    npm run dev
    ```

4.  **Run the Landing Page locally:**
    ```bash
    npm run website:dev
    ```

### Building & Distribution

#### **Electron Application**
Build the React app and package for macOS (`.dmg`):
```bash
npm run dist
```
Artifacts will be in the `release/` directory.

#### **Landing Page**
Build the static website for GitHub Pages:
```bash
npm run website:build
```
Build output is generated in `dist-website/`.

### Testing

The project uses [Vitest](https://vitest.dev/) for unit and integration testing.

*   **Run all tests:** `npm test`
*   **Run App tests:** `npx vitest`
*   **Run Website tests:** `npm run website:test`

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
