import { normalizeUserText, safeImageSource, validateCheckoutInput } from '../safeInput.js';

describe('safe input helpers', () => {
  test('trims text, removes control characters, and enforces a maximum length', () => {
    expect(normalizeUserText('  hello\u0000 world  ', 8)).toBe('hello wo');
  });

  test('rejects unsupported object input', () => {
    expect(normalizeUserText({ text: 'not text' })).toBe('');
  });

  test('accepts a local absolute image path', () => {
    expect(safeImageSource('/images/food.svg')).toBe('/images/food.svg');
  });

  test('accepts HTTPS images but rejects executable and protocol-relative URLs', () => {
    expect(safeImageSource('https://example.com/food.png')).toBe('https://example.com/food.png');
    expect(safeImageSource('javascript:alert(1)')).toBe('');
    expect(safeImageSource('//example.com/food.png')).toBe('');
  });

  test('accepts a valid checkout address and name', () => {
    expect(validateCheckoutInput('Naveen', '12 Lake View Road')).toEqual({
      valid: true,
      name: 'Naveen',
      address: '12 Lake View Road',
    });
  });

  test('rejects missing or too-short checkout fields', () => {
    expect(validateCheckoutInput('N', 'abc').valid).toBe(false);
    expect(validateCheckoutInput('Naveen', '123 Main Road').valid).toBe(true);
  });
});
