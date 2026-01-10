# Testing Strategy for Yam

This document outlines the testing architecture and guidelines for the Yam application.

## 1. Testing Layers

We adhere to the "Testing Trophy" philosophy, emphasizing integration tests while maintaining a solid base of unit tests and a layer of End-to-End (E2E) tests.

### A. Unit Tests (Vitest)
- **Scope**: Individual functions, hooks, and isolated components.
- **Tools**: Vitest, React Testing Library.
- **Location**: Co-located with source files (e.g., `src/components/Editor/Editor.test.tsx`).
- **Goal**: Verify logic, edge cases, and component rendering states.
- **Command**: `npm test`

### B. Integration Tests (Vitest)
- **Scope**: Component interactions, pages, and workflows.
- **Tools**: Vitest, React Testing Library.
- **Location**: Co-located or in `tests/` for cross-module scenarios.
- **Goal**: Verify that components work together (e.g., Editor updates Preview).

### C. End-to-End (E2E) Tests (Playwright)
- **Scope**: The fully packaged Electron application.
- **Tools**: Playwright for Electron.
- **Location**: `tests/e2e/`.
- **Goal**: Verify app launch, window management, IPC communication, and native features (file system access) which cannot be tested in JSDOM.

## 2. Directory Structure

We follow a **co-location** pattern for unit and integration tests.

```
src/
  components/
    Editor/
      Editor.tsx
      Editor.test.tsx  <-- Unit/Integration test
  hooks/
    useFonts.ts
    useFonts.test.ts   <-- Hook test
tests/
  e2e/                 <-- E2E tests (Playwright)
    app.spec.ts
```

## 3. Continuous Integration (GitHub Actions)

Our CI pipeline (`.github/workflows/build.yml`) enforces quality gates on every Pull Request and Push to main.

**Pipeline Steps:**
1.  **Linting**: `npm run lint` (ESLint) - Ensures code style and best practices.
2.  **Type Checking**: `npm run typecheck` (TSC) - Verifies TypeScript validity.
3.  **Unit/Integration Tests**: `npm test` (Vitest) - Verifies logic.
4.  **Build**: `npm run build` - Ensures the app compiles and packages correctly.

## 4. Future Improvements

- **Visual Regression Testing**: Use Playwright to capture screenshots of the app in different themes (Light/Dark) to prevent visual regressions.
- **Cross-Platform Testing**: Run E2E tests on Windows and Linux runners in CI.
