# Dokumentasi Dashboard Mahasiswa PNB

## 📋 Overview

Project ini adalah dashboard untuk menampilkan data mahasiswa Politeknik Negeri Bali (PNB) menggunakan API resmi dari https://webapi.pnb.ac.id/api.

## 🎯 Fitur

1. **Total Mahasiswa PNB** - Menghitung total mahasiswa aktif di tahun akademik Genap 2025/2026
2. **Mahasiswa TI TRPL Kelas 6C** - Menampilkan mahasiswa TI TRPL Kelas 6C sesuai mapping NIM manual
3. **Mahasiswa TI Kelas 6C Semester 6** - Menampilkan semua mahasiswa TI semester 6 (angkatan 2023) berdasarkan API
4. **Mahasiswa per Jurusan** - Pengelompokan mahasiswa berdasarkan jurusan
5. **Mahasiswa per Prodi** - Pengelompokan mahasiswa berdasarkan program studi
6. **Total Program Studi** - Jumlah program studi di PNB

## 🔐 Sistem Hash (PENTING)

API PNB menggunakan SHA256 hash untuk autentikasi. Setiap request memerlukan HashCode yang dihitung dengan formula tertentu.

### 🔑 Konstanta

```javascript
HASH_KEY = 'P0l1t3kn1k&N3g3r1%B4l1'
TAHUN_AKADEMIK = '20252' // Genap 2025/2026
```

### 📝 Formula Hash

#### 1. /mahasiswa
```javascript
HashCode = SHA256(TahunAkademik + Jurusan + Prodi + HASH_KEY).toUpperCase()
// Contoh: SHA256("20252" + "40" + "58302" + "P0l1t3kn1k&N3g3r1%B4l1")
```

#### 2. /daftarjurusan
```javascript
HashCode = SHA256(HASH_KEY).toUpperCase()
// Contoh: SHA256("P0l1t3kn1k&N3g3r1%B4l1")
```

#### 3. /daftarprogramstudi
```javascript
// Jika kodeJur kosong:
HashCode = SHA256(HASH_KEY).toUpperCase()

// Jika kodejur tidak kosong:
HashCode = SHA256(kodeJur + HASH_KEY).toUpperCase()
```

### ⚠️ Rules

- **TIDAK ada spasi** dalam string yang di-hash
- **TIDAK ada separator** (titik koma, strip, dll)
- **urutan tepat** sesuai formula
- **HARUS UPPERCASE** hasil hex dari SHA256

## 📡 API Reference

### POST /mahasiswa

Mendapatkan daftar mahasiswa.

**Request:**
```json
{
  "TahunAkademik": "20252",
  "Jurusan": "40",
  "Prodi": "58302",
  "HashCode": "41035DC260963D4DF8226D8E8B0A36C8C7BD66C713CEAA1F3E70287D087F441C"
}
```

**Parameter:**
- `TahunAkademik`: Tahun akademik (default: "20252")
- `Jurusan`: Kode Jurisdiction (kosong untuk semua)
- `Prodi**: Kode Program Studi (kosong untuk semua)
- `HashCode`: SHA256 hash dari formula

**Response:**
```json
{
  "responseCode": "00",
  "responseDescription": "Sukses",
  "daftar": [
    {
      "tahunAkademik": "20252",
      "nim": "2515354022",
      "nama": "I WAYAN MANIK SUARDI YANTO",
      "telepon": "0822828280"
    }
  ]
}
```

### POST /daftarjurusan

Mendapatkan daftar semua jurusan di PNB.

**Request:**
```json
{
  "HashCode": "65020385BE01144F4187C2EB100D851C09CFD40F774BD629896E739C1D5EE156"
}
```

**Response:**
```json
{
  "responseCode": "00",
  "responseDescription": "Sukses",
  "daftar": [
    {
      "kodeJurusan": "40",
      "namaJurusan": "Teknologi Informasi"
    }
  ]
}
```

### POST /daftarprogramstudi

Mendapatkan daftar program studi.

**Request:**
```json
{
  "kodeJur": "",
  "HashCode": "65020385BE01144F4187C2EB100D851C09CFD40F774BD629896E739C1D5EE156"
}
```

**Parameter:**
- `kodeJur`: Kode jurisdiction (kosong untuk semua prodi)
- `HashCode`: SHA256 hash

**Response:**
```json
{
  "responseCode": "00",
  "responseDescription": "Sukses",
  "daftar": [
    {
      "kodeProdi": "58302",
      "namaProdi": "Teknologi Rekayasa Perangkat Lunak"
    }
  ]
}
```

## 📊 Kode Jurusan & Prodi

| Kode | Nama Jurusan/Prodi |
|------|-------------------|
| 40 | Teknologi Informasi |
| 58302 | Teknologi Rekayasa Perangkat Lunak (TRPL) |
| 58101 | Teknik Sipil |
| 58102 | Arsitektur |
| 58401 | Teknik Mesin |
| 58402 | Teknik Alat Berat |
| 58501 | Teknik Elektro |
| 58502 | Teknik Informatika |
| 58601 | Teknik Kimia |
| 58602 | Teknik Analisis Kimia |
| 58701 | Akuntansi |
| 58702 | Keuangan Perbankan |
| 58801 | Administrasi Bisnis |
| 58802 | Sekretaris |

## 🧩 Logika Kelas 6C

API PNB **TIDAK menyediakan** informasi kelas. Oleh karena itu, kelas 6C ditentukan melalui **mapping NIM** manual:

```javascript
const KELAS_6C = [
  "2215354027", // Kelas 6C (angkatan 22)
  "2315354003", "2315354011", "2315354012", "2315354015", // Kelas 6C (angkatan 23)
  "2315354019", "2315354024", "2315354027", "2315354031", "2315354035",
  "2315354036", "2315354039", "2315354043", "2315354047", "2315354048",
  "2315354051", "2315354055", "2315354059", "2315354060", "2315354072",
  "2315354075", "2315354079", "2315354080", "2315354083", "2315354084"
];
// Total: 25 mahasiswa
```

## 🧩 Logika Mahasiswa TI Semester 6

Berbeda dengan mapping manual Kelas 6C, fitur ini mengambil **semua mahasiswa TI semester 6** langsung dari API tanpa mapping manual.

**Filter**: `nim.startsWith("23")` (angkatan 2023 = semester 6 di Genap 2025/2026)

```javascript
const semester6 = daftar.filter(m => {
  const nim = m.nim || m.NIM;
  return nim && nim.startsWith('23');
});
```

**Catatan**:
- API tidak menyediakan informasi kelas
- Menggunakan NIM angkatan untuk menentukan semester
- Mahasiswa angkatan 2023 sekarang di semester 6

## 💻 Struktur Kode

```
src/
├── lib/api.js          # Semua fungsi API dan hash
├── components/
│   └── Dashboard.jsx  # Komponen dashboard utama
├── index.css         # Global styles (Tailwind + dark theme)
├── App.jsx          # Entry component
└── main.jsx         # Entry point
```

### File: src/lib/api.js

```javascript
// Konstanta
const API_BASE = 'https://webapi.pnb.ac.id/api'
export const HASH_KEY = 'P0l1t3kn1k&N3g3r1%B4l1'
export const TAHUN_AKADEMIK = '20252'

// Fungsi hash SHA256
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Fetch mahasiswa dengan filter
export async function fetchMahasiswa(
  tahunAkademik = TAHUN_AKADEMIK,
  jurisdictions = '',
  prodi = ''
) {
  const hash = await sha256(tahunAkademik + jurisdictions + prodi + HASH_KEY)
  const response = await fetch(`${API_BASE}/mahasiswa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      TahunAkademik: tahunAkademik,
      Jurusan: jurisdictions,
      Prodi: prodi,
      HashCode: hash.toUpperCase()
    })
  })
  const data = await response.json()
  return data.daftar || []
}

// Fetch mahasiswa TI semester 6 (filter by nim starts with 23)
export async function fetchMahasiswaTIKelas6C() {
  const tahunAkademik = '20252'
  const jurisdictions = '40'
  const prodi = ''
  const hash = await sha256(tahunAkademik + jurisdictions + prodi + HASH_KEY)
  const response = await fetch(`${API_BASE}/mahasiswa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      TahunAkademik: tahunAkademik,
      Jurusan: jurisdictions,
      Prodi: prodi,
      HashCode: hash.toUpperCase()
    })
  })
  const data = await response.json()
  if (data.responseCode !== '00') {
    return []
  }
  const daftar = data.daftar || []
  const semester6 = daftar.filter(m => {
    const nim = m.nim || m.NIM
    return nim && nim.startsWith('23')
  })
  return semester6.sort((a, b) => (a.nim || a.NIM).localeCompare(b.nim || b.NIM))
}

// Fetch semua jurisdiction
export async function fetchJurusan() {
  const hash = await sha256(HASH_KEY)
  const response = await fetch(`${API_BASE}/daftarjurusan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ HashCode: hash.toUpperCase() })
  })
  const data = await response.json()
  return data.daftar || []
}

// Fetch semua program studi
export async function fetchProgramStudi(kodeJur = '') {
  const input = kodeJur + HASH_KEY
  const hash = await sha256(input)
  const response = await fetch(`${API_BASE}/daftarprogramstudi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kodeJur, HashCode: hash.toUpperCase() })
  })
  const data = await response.json()
  return data.daftar || []
}
```

### File: src/components/Dashboard.jsx

```javascript
// State untuk data
const [stats, setStats] = useState({
  totalMahasiswa: 0,
  totalProdi: 0,
  mahasiswa6C: [],
  mahasiswaTIKelas6CSemester6: [],
  mahasiswaPerJurusan: [],
  mahasiswaPerProdi: [],
  prodiList: []
})

// Load data saat component mount
useEffect(() => {
  async function loadData() {
    // 1. Fetch data TI TRPL (jurusan=40, prodi=58302)
    const tiMhs = await fetchMahasiswa(TAHUN_AKADEMIK, '40', '58302')
    
    // 2. Filter mahasiswa kelas 6C berdasarkan NIM mapping
    const mhs6C = tiMhs
      .filter(m => KELAS_6C.includes(m.nim || m.NIM))
      .sort((a, b) => a.nim.localeCompare(b.nim))
    
    // 3. Fetch mahasiswa TI semester 6 dari API (tanpa mapping)
    const tiMhsKelas6CSemester6 = await fetchMahasiswaTIKelas6C()
    
    // 4. Fetch semua mahasiswa untuk statistik
    const allMhs = await fetchMahasiswa()
    
    // 5. Fetch daftar prodi untuk mapping nama
    const allProdi = await fetchProgramStudi('')
    
    // 6. Group by jurisdiction dan mapping nama
    const groupedByJurusan = {}
    allMhs.forEach(m => {
      const kode = m.kodeJurusan || m.Jurusan
      groupedByJurusan[kode] = (groupedByJurusan[kode] || 0) + 1
    })
    
    // 7. Group by prodi dan mapping nama
    const groupedByProdi = {}
    allMhs.forEach(m => {
      const kode = m.kodeProdi || m.Prodi
      groupedByProdi[kode] = (groupedByProdi[kode] || 0) + 1
    })
    
    setStats({
      totalMahasiswa: allMhs.length,
      totalProdi: allProdi.length,
      mahasiswa6C: mhs6C,
      mahasiswaTIKelas6CSemester6: tiMhsKelas6CSemester6,
      mahasiswaPerJurusan: mhsPerJurusan,
      mahasiswaPerProdi: mhsPerProdi,
      prodiList: allProdi
    })
  }
  loadData()
}, [])

// Tampilkan tabel TRPL Kelas 6C (mapping manual)
<Table
  title="Mahasiswa TI TRPL Kelas 6C"
  columns={['No', 'NIM', 'Nama', 'Jurusan', 'Prodi']}
  data={stats.mahasiswa6C.map((m, i) => ({
    no: i + 1,
    nim: m.nim,
    nama: m.nama,
    jurisdicción: 'Teknologi Informasi',
    prodi: 'Teknologi Rekayasa Perangkat Lunak'
  }))}
  loading={loading}
/>

// Tampilkan tabel TI Semester 6 (dari API)
<Table
  title="Mahasiswa TI Kelas 6C Semester 6"
  subtitle="Data berdasarkan API (tanpa informasi kelas)"
  columns={['No', 'NIM', 'Nama', 'Jurusan', 'Prodi']}
  data={stats.mahasiswaTIKelas6CSemester6.map((m, i) => { 
    const kodeProdi = m.kodeprodi || m.kodeProdi || m.Prodi || m.prodi
    const p = stats.prodiList.find(p => p.kodeProdi === kodeProdi)
    return { 
      no: i + 1, 
      nim: m.nim || m.NIM, 
      nama: m.nama || m.Nama,
      jurisdicción: 'Teknologi Informasi',
      prodi: p?.namaProdi || kodeProdi || '-'
    }
  })}
  loading={loading}
/>
```

## 🎨 UI Design

- **Theme**: Dark mode (hitam/singarat)
- **Color Palette**: Zinc (zinc-800, zinc-700, zinc-900)
- **Framework**: TailwindCSS
- **Style**: Modern minimalclean shadcn
- **Responsive**: Mobile-friendly dengan grid 1-2 kolom
- **Loading**: Skeleton animation
- **Pagination**: 10 item per halaman

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
```

## 📝 Catatan Penting

1. **Hash generation** moet tepat sesuai formula, Jika tidak tepat, API bakal balikin error "invalid hashCode"
2. **Kelas 6C** ga bisa dapat dari API, harus mapping manual berdasarkan NIM
3. **Field names**: API sering-balik inconsistent (nim vs NIM, nama vs Nama), jadi harus handle semua kasus
4. **CORS**: Jika ada CORS error, pastikan API可达 atau pakai proxy
5. **Tahun Akademik**: "20252" berarti Genap 2025/2026
6. **Perbedaan TRPL Kelas 6C vs TI Semester 6**:
   - TRPL Kelas 6C: Mapping manual NIM (25 mahasiswa tetap)
   - TI Semester 6: Semua TI angkatan 2023 dari API (dynamic, tanpa mapping)

---

Dibuat untuk UTS Integrasi Sistem
Politeknik Negeri Bali