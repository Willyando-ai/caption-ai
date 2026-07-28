// Sistem kode akses per-pembeli dengan expired 30 hari, TANPA DATABASE.
// Triknya: tanggal kedaluwarsa "ditanam" langsung di dalam kode itu sendiri,
// lalu diverifikasi pakai checksum rahasia supaya tidak bisa dipalsukan orang lain.

function toBase36(num) {
  return num.toString(36).toUpperCase();
}

// Checksum sederhana dari (secret + tanggal expired) -> 4 karakter
function checksum(secret, expiryStr) {
  let hash = 0;
  const str = `${secret}:${expiryStr}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return toBase36(hash % 1679616).padStart(4, '0'); // 36^3 = 4 karakter base36
}

// Format tanggal jadi YYYYMMDD
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Buat kode baru yang berlaku "hariBerlaku" hari dari sekarang (default 30 hari)
function generateCode(secret, hariBerlaku = 30) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + hariBerlaku);
  const expiryStr = formatDate(expiryDate);
  const chk = checksum(secret, expiryStr);
  const kode = `NOTA-${expiryStr}-${chk}`;
  return { kode, expiryDate };
}

// Cek apakah kode valid DAN belum kedaluwarsa
function isValidCode(secret, submittedCode) {
  if (!submittedCode) return { valid: false, reason: 'Kode kosong' };
  const trimmed = submittedCode.trim().toUpperCase();
  const parts = trimmed.split('-');
  if (parts.length !== 3 || parts[0] !== 'NOTA') {
    return { valid: false, reason: 'Format kode tidak dikenali' };
  }
  const expiryStr = parts[1];
  const chk = parts[2];

  const expectedChk = checksum(secret, expiryStr);
  if (chk !== expectedChk) {
    return { valid: false, reason: 'Kode tidak valid' };
  }

  const y = parseInt(expiryStr.substring(0, 4), 10);
  const m = parseInt(expiryStr.substring(4, 6), 10) - 1;
  const d = parseInt(expiryStr.substring(6, 8), 10);
  const expiryDate = new Date(y, m, d, 23, 59, 59);

  const now = new Date();
  if (now > expiryDate) {
    return { valid: false, reason: 'Kode sudah kedaluwarsa', expiryDate };
  }

  return { valid: true, expiryDate };
}

module.exports = { generateCode, isValidCode };
