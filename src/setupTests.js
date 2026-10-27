import { TextDecoder, TextEncoder } from 'util';
import '@testing-library/jest-dom';

// React Router's browser-compatible URL helpers may reference these globals under JSDOM.
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;
