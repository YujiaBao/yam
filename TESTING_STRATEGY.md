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
- **Scope**: The fully packaged Electron application and the production landing page.
- **Tools**: Playwright (Electron & Browser projects).
- **Location**: `tests/e2e/`.
- **Goal**: Verify cross-platform app behavior, website responsiveness, and feature parity between app and web demos.
- **Commands**: 
  - `npm run test:e2e` (All projects)
  - `npm run test:e2e -- --project=app` (Electron only)
  - `npm run test:e2e -- --project=website` (Website only)

## 2. Directory Structure

We follow a **co-location** pattern for unit and integration tests, and a **unified hierarchy** for E2E.

```
src/                   <-- App Source
  components/
    Editor/
      Editor.tsx
      Editor.test.tsx  <-- App Unit Test
website/               <-- Website Source
  tests/
    LandingPage.test.tsx <-- Website Unit Test
tests/
  e2e/                 <-- Unified E2E tests (Playwright)
    app/               <-- Electron Application Tests
      pages/           <-- App Page Objects
      specs/           <-- App Test Specs
    website/           <-- Website Tests
      pages/           <-- Website Page Objects
      specs/           <-- Website Test Specs
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
