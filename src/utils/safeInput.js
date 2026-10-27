/** Normalize untrusted text before using it in search fields, forms, or local state. */
export function normalizeUserText(value, maxLength = 120) {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  return String(value)
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, Math.max(0, maxLength));
}

/** Only allow local absolute paths or HTTPS URLs as image sources. */
export function safeImageSource(value) {
  if (typeof value !== 'string') return '';
  const candidate = value.trim();
  if (candidate.startsWith('/') && !candidate.startsWith('//') && !candidate.includes('\\')) return candidate;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'https:' ? parsed.href : '';
  } catch {
    return '';
  }
}

export function validateCheckoutInput(name, address) {
  const safeName = normalizeUserText(name, 80);
  const safeAddress = normalizeUserText(address, 240);
  if (safeName.length < 2) return { valid: false, message: 'Enter a name with at least 2 characters.' };
  if (safeAddress.length < 8) return { valid: false, message: 'Enter a delivery address with at least 8 characters.' };
  if (/[<>]/.test(safeName)) return { valid: false, message: 'The name contains unsupported characters.' };
  return { valid: true, name: safeName, address: safeAddress };
}
