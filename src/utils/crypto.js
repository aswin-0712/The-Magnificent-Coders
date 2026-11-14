/**
 * Client-side SHA-256 cryptographic digest computation using Web Crypto API.
 * Computes an actual SHA-256 hash for files selected in the browser.
 */
export async function computeFileSha256(file) {
  if (!file || typeof window === 'undefined' || !window.crypto?.subtle) {
    return null;
  }
  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  if (!bytes || Number.isNaN(bytes)) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value >= 10 || i === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[i]}`;
}

export function formatDateDisplay(isoString, dateFormat = 'YYYY-MM-DD') {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  if (dateFormat === 'DD/MM/YYYY') return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  if (dateFormat === 'MM/DD/YYYY') return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
