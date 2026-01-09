# Architecture

This document describes the architectural layout of **Yam** and the relationship between the desktop application and the landing page.

## Project Layout

-   **`src/`**: The core source code for the Electron application.
    -   **`components/`**: React components (Editor, Preview, Sidebar, etc.).
    -   **`hooks/`**: Business logic encapsulated in custom React hooks.
    -   **`utils/`**: Shared utility functions (CSS mapping, scoping).
    -   **`constants/`**: Single source of truth for themes and default fonts.
    -   **`types/`**: Global TypeScript definitions.
-   **`electron/`**: Electron-specific main and preload process logic.
-   **`website/`**: The React-based landing page hosted on GitHub Pages.
-   **`dist/`**: Web build output for the Electron app.
-   **`dist-electron/`**: Compiled Electron main/preload code.
-   **`dist-website/`**: Production build of the landing page.

## Core Shared Logic

To ensure consistency and minimize duplication, the following directories in `src/` are treated as the "Shared Core" and are aliased as `@` in the website build:

1.  **Themes (`src/constants/themes.ts`)**: Every theme definition, including its CSS and dark-mode metadata, lives here.
2.  **CSS Mapper (`src/utils/cssMapper.ts`)**: This utility handles bidirectional parsing between raw CSS and the Visual Editor. It also provides `scopeCss` to isolate theme previews.
3.  **Preview Component (`src/components/Preview/Preview.tsx`)**: The exact same markdown renderer used in the app is used for the interactive demo on the website.

## Build Targets

-   **App**: `npm run build` targets the Electron environment.
-   **Website**: `npm run website:build` targets a standard static web environment.

## Testing Strategy

Tests are co-located with their respective subjects (e.g., `src/hooks/useThemes.test.ts`).
-   **App Logic**: Tested with Vitest + JSDOM.
-   **Website**: Tested separately in `website/tests/` to verify layout and web-specific isolation.
