const API_BASE = 'https://webapi.pnb.ac.id/api';
export const HASH_KEY = 'P0l1t3kn1k&N3g3r1%B4l1';
export const TAHUN_AKADEMIK = '20252';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function fetchMahasiswa(tahunAkademik = TAHUN_AKADEMIK, jurisdictions = '', prodi = '') {
  const hash = await sha256(tahunAkademik + jurisdictions + prodi + HASH_KEY);
  const bodyData = {
    TahunAkademik: tahunAkademik,
    Jurusan: jurisdictions,
    Prodi: prodi,
    HashCode: hash.toUpperCase()
  };
  const response = await fetch(`${API_BASE}/mahasiswa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();
  if (data.responseCode !== '00') {
    console.error('API Error:', data);
  }
  return data.daftar || [];
}

export async function fetchJurusan() {
  const hash = await sha256(HASH_KEY);
  const response = await fetch(`${API_BASE}/daftarjurusan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ HashCode: hash.toUpperCase() })
  });
  const data = await response.json();
  return data.daftar || [];
}

export async function fetchProgramStudi(kodeJur = '') {
  const input = kodeJur + HASH_KEY;
  const hash = await sha256(input);
  const response = await fetch(`${API_BASE}/daftarprogramstudi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kodeJur, HashCode: hash.toUpperCase() })
  });
  const data = await response.json();
  return data.daftar || [];
}

export const KELAS_6C = [
  "2215354027","2315354003","2315354011","2315354012","2315354015",
  "2315354019","2315354024","2315354027","2315354031","2315354035",
  "2315354036","2315354039","2315354043","2315354047","2315354048",
  "2315354051","2315354055","2315354059","2315354060","2315354072",
  "2315354075","2315354079","2315354080","2315354083","2315354084"
];