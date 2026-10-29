import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import * as axeMatchers from 'jest-axe';

expect.extend(matchers);
expect.extend(axeMatchers.toHaveNoViolations);

declare module 'vitest' {
  interface Assertion<R extends void | Promise<void> = void, T = unknown> {
    toBeInTheDocument(): R;
    toBeDisabled(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveNoViolations(): R;
  }
  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): void;
    toBeDisabled(): void;
    toHaveAttribute(attr: string, value?: string): void;
    toHaveNoViolations(): void;
  }
}

// Mock scrollTo and matchMedia
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
