import '@testing-library/jest-dom';
import { vi } from 'vitest';

const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key: string) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {

  value: localStorageMock

});



// Mock fetch globally for all tests

global.fetch = vi.fn((url: string) => {

  if (url === 'default.md') {

    return Promise.resolve({

      ok: true,

      text: () => Promise.resolve('# Welcome to Yam'),

    } as Response);

  }

  return Promise.reject(new Error(`Unhandled fetch to: ${url}`));

});
