import { useState, useEffect } from 'react';
import { 
  fetchMahasiswa, 
  fetchJurusan, 
  fetchProgramStudi,
  KELAS_6C,
  TAHUN_AKADEMIK
} from '../lib/api';

function StatCard({ title, value, loading }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-sm">
      <p className="text-sm text-zinc-400 mb-1">{title}</p>
      {loading ? (
        <div className="h-8 bg-zinc-700 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-semibold text-white">{value}</p>
      )}
    </div>
  );
}

function Table({ title, columns, data, loading, pageSize = 10 }) {
  const [page, setPage] = useState(0);
  
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);
  
  useEffect(() => { setPage(0); }, [data.length]);
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-zinc-700">
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-zinc-700 rounded animate-pulse" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="p-6 text-zinc-400">Tidak ada data</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900">
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {paginatedData.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-750">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-6 py-4 text-sm text-zinc-200">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-zinc-700 flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Halaman {page + 1} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-sm rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-sm rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    totalProdi: 0,
    mahasiswa6C: [],
    mahasiswaPerJurusan: [],
    mahasiswaPerProdi: []
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [tiMhs, allJurusan, allProdi] = await Promise.all([
          fetchMahasiswa(TAHUN_AKADEMIK, '40', '58302'),
          fetchJurusan(),
          fetchProgramStudi('')
        ]);

        const mhs6C = tiMhs
          .filter(m => KELAS_6C.includes(m.nim || m.NIM))
          .sort((a, b) => (a.nim || a.NIM).localeCompare(b.nim || b.NIM));

        const allMhs = await fetchMahasiswa();

        const groupedByJurusan = {};
        allMhs.forEach(m => {
          const kode = m.kodeJurusan || m.Jurusan;
          groupedByJurusan[kode] = (groupedByJurusan[kode] || 0) + 1;
        });

        const mhsPerJurusan = Object.entries(groupedByJurusan).map(([kode, total]) => {
          const j = allJurusan.find(j => j.kodeJurusan === kode);
          return { namaJurusan: j?.namaJurusan || kode, total };
        }).sort((a, b) => b.total - a.total);

        const groupedByProdi = {};
        allMhs.forEach(m => {
          const kode = m.kodeProdi || m.Prodi;
          groupedByProdi[kode] = (groupedByProdi[kode] || 0) + 1;
        });

        const mhsPerProdi = Object.entries(groupedByProdi).map(([kode, total]) => {
          const p = allProdi.find(prodi => prodi.kodeProdi === kode);
          return { namaProdi: p?.namaProdi || kode, total };
        }).sort((a, b) => b.total - a.total);

        setStats({
          totalMahasiswa: allMhs.length,
          totalProdi: allProdi.length,
          mahasiswa6C: mhs6C,
          mahasiswaPerJurusan: mhsPerJurusan,
          mahasiswaPerProdi: mhsPerProdi
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/50 border border-red-800 rounded-xl p-6 text-red-400">
          <p className="font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Dashboard Mahasiswa PNB</h1>
        <p className="text-zinc-400">Genap 2025/2026</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Total Mahasiswa" 
          value={stats.totalMahasiswa} 
          loading={loading} 
        />
        <StatCard 
          title="Total Program Studi" 
          value={stats.totalProdi} 
          loading={loading} 
        />
      </div>

      <Table 
        title="Mahasiswa TI TRPL Kelas 6C"
        columns={['No', 'NIM', 'Nama', 'Jurusan', 'Prodi']}
        data={stats.mahasiswa6C.map((m, i) => ({ 
          no: i + 1, 
          nim: m.nim || m.NIM, 
          nama: m.nama || m.Nama,
          jurisdicción: 'Teknologi Informasi',
          prodi: 'Teknologi Rekayasa Perangkat Lunak'
        }))}
        loading={loading}
      />

      <Table 
        title="Mahasiswa per Jurusan"
        columns={['Jurusan', 'Total']}
        data={stats.mahasiswaPerJurusan}
        loading={loading}
      />

      <Table 
        title="Mahasiswa per Program Studi"
        columns={['Program Studi', 'Total']}
        data={stats.mahasiswaPerProdi}
        loading={loading}
      />
    </div>
  );
}