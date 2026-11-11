import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const emptyJemaatForm = {
  nama_lengkap: '',
  tanggal_lahir: '',
  alamat: '',
  no_telp: '',
  komsel: 'Komsel',
}

const emptyInventarisForm = {
  nama_barang: '',
  kategori: 'Sound System',
  jumlah: '1',
  kondisi: 'Baik',
}

const KOMSEL_OPTIONS = ['Komsel', 'Kategorial']

const KATEGORI_INVENTARIS_OPTIONS = [
  'Sound System',
  'Alat Musik',
  'Perlengkapan Ibadah',
  'Inventaris Gedung',
  'Lainnya',
]

const KONDISI_OPTIONS = ['Baik', 'Perlu Perbaikan', 'Rusak']

function formatTanggalLahir(value) {
  if (!value) return '-'
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  return value
}

function getKondisiBadgeClass(kondisi) {
  if (kondisi === 'Baik') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (kondisi === 'Perlu Perbaikan') {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-red-50 text-red-700 border-red-200'
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Jemaat states
  const [jemaatList, setJemaatList] = useState([])
  const [loadingJemaat, setLoadingJemaat] = useState(true)
  const [submittingJemaat, setSubmittingJemaat] = useState(false)
  const [jemaatErrorMsg, setJemaatErrorMsg] = useState('')
  const [jemaatForm, setJemaatForm] = useState(emptyJemaatForm)
  const [editingJemaatId, setEditingJemaatId] = useState(null)

  // Inventaris states
  const [inventarisList, setInventarisList] = useState([])
  const [loadingInventaris, setLoadingInventaris] = useState(true)
  const [submittingInventaris, setSubmittingInventaris] = useState(false)
  const [inventarisErrorMsg, setInventarisErrorMsg] = useState('')
  const [inventarisForm, setInventarisForm] = useState(emptyInventarisForm)
  const [editingInventarisId, setEditingInventarisId] = useState(null)

  // Fetch congregation & inventory data on mount
  useEffect(() => {
    let ignore = false

    async function loadInitialData() {
      const [jemaatRes, inventarisRes] = await Promise.all([
        supabase
          .from('jemaat')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('inventaris')
          .select('*')
          .order('created_at', { ascending: false }),
      ])

      if (ignore) return

      if (jemaatRes.error) {
        setJemaatErrorMsg(jemaatRes.error.message)
      } else {
        setJemaatList(jemaatRes.data || [])
      }
      setLoadingJemaat(false)

      if (inventarisRes.error) {
        setInventarisErrorMsg(inventarisRes.error.message)
      } else {
        setInventarisList(inventarisRes.data || [])
      }
      setLoadingInventaris(false)
    }

    loadInitialData()
    return () => {
      ignore = true
    }
  }, [])

  // ============================================================
  // JEMAAT CRUD HANDLERS
  // ============================================================
  const handleJemaatChange = (e) => {
    const { name, value } = e.target
    setJemaatForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleJemaatSubmit = async (e) => {
    e.preventDefault()
    setJemaatErrorMsg('')
    setSubmittingJemaat(true)

    const payload = {
      nama_lengkap: jemaatForm.nama_lengkap.trim(),
      tanggal_lahir: jemaatForm.tanggal_lahir.trim(),
      alamat: jemaatForm.alamat.trim(),
      no_telp: jemaatForm.no_telp.trim(),
      komsel: jemaatForm.komsel.trim(),
    }

    if (editingJemaatId) {
      const { data, error } = await supabase
        .from('jemaat')
        .update(payload)
        .eq('id', editingJemaatId)
        .select()
        .single()

      if (error) {
        setJemaatErrorMsg(error.message)
      } else if (data) {
        setJemaatList((prev) =>
          prev.map((item) => (item.id === editingJemaatId ? data : item))
        )
        setEditingJemaatId(null)
        setJemaatForm(emptyJemaatForm)
      }
    } else {
      const { data, error } = await supabase
        .from('jemaat')
        .insert([payload])
        .select()
        .single()

      if (error) {
        setJemaatErrorMsg(error.message)
      } else if (data) {
        setJemaatList((prev) => [data, ...prev])
        setJemaatForm(emptyJemaatForm)
      }
    }

    setSubmittingJemaat(false)
  }

  const handleEditJemaat = (item) => {
    setEditingJemaatId(item.id)
    setJemaatForm({
      nama_lengkap: item.nama_lengkap || '',
      tanggal_lahir: item.tanggal_lahir || '',
      alamat: item.alamat || '',
      no_telp: item.no_telp || '',
      komsel: item.komsel || 'Komsel',
    })
    setJemaatErrorMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEditJemaat = () => {
    setEditingJemaatId(null)
    setJemaatForm(emptyJemaatForm)
    setJemaatErrorMsg('')
  }

  const handleDeleteJemaat = async (id, nama) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data jemaat "${nama}"?`
    )
    if (!confirmed) return

    setJemaatErrorMsg('')
    const { error } = await supabase.from('jemaat').delete().eq('id', id)

    if (error) {
      setJemaatErrorMsg(error.message)
      return
    }

    setJemaatList((prev) => prev.filter((item) => item.id !== id))
    if (editingJemaatId === id) {
      setEditingJemaatId(null)
      setJemaatForm(emptyJemaatForm)
    }
  }

  // ============================================================
  // INVENTARIS CRUD HANDLERS
  // ============================================================
  const handleInventarisChange = (e) => {
    const { name, value } = e.target
    setInventarisForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleInventarisSubmit = async (e) => {
    e.preventDefault()
    setInventarisErrorMsg('')
    setSubmittingInventaris(true)

    const payload = {
      nama_barang: inventarisForm.nama_barang.trim(),
      kategori: inventarisForm.kategori.trim(),
      jumlah: Math.max(1, Number.parseInt(inventarisForm.jumlah, 10) || 1),
      kondisi: inventarisForm.kondisi.trim(),
    }

    if (editingInventarisId) {
      const { data, error } = await supabase
        .from('inventaris')
        .update(payload)
        .eq('id', editingInventarisId)
        .select()
        .single()

      if (error) {
        setInventarisErrorMsg(error.message)
      } else if (data) {
        setInventarisList((prev) =>
          prev.map((item) => (item.id === editingInventarisId ? data : item))
        )
        setEditingInventarisId(null)
        setInventarisForm(emptyInventarisForm)
      }
    } else {
      const { data, error } = await supabase
        .from('inventaris')
        .insert([payload])
        .select()
        .single()

      if (error) {
        setInventarisErrorMsg(error.message)
      } else if (data) {
        setInventarisList((prev) => [data, ...prev])
        setInventarisForm(emptyInventarisForm)
      }
    }

    setSubmittingInventaris(false)
  }

  const handleEditInventaris = (item) => {
    setEditingInventarisId(item.id)
    setInventarisForm({
      nama_barang: item.nama_barang || '',
      kategori: item.kategori || 'Sound System',
      jumlah: String(item.jumlah ?? 1),
      kondisi: item.kondisi || 'Baik',
    })
    setInventarisErrorMsg('')
    document
      .getElementById('section-inventaris')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCancelEditInventaris = () => {
    setEditingInventarisId(null)
    setInventarisForm(emptyInventarisForm)
    setInventarisErrorMsg('')
  }

  const handleDeleteInventaris = async (id, namaBarang) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus barang inventaris "${namaBarang}"?`
    )
    if (!confirmed) return

    setInventarisErrorMsg('')
    const { error } = await supabase.from('inventaris').delete().eq('id', id)

    if (error) {
      setInventarisErrorMsg(error.message)
      return
    }

    setInventarisList((prev) => prev.filter((item) => item.id !== id))
    if (editingInventarisId === id) {
      setEditingInventarisId(null)
      setInventarisForm(emptyInventarisForm)
    }
  }

  // Sign out and redirect to /login
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-gbi.png"
              alt="Logo GBI Samirono"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Dashboard Admin — GBI Samirono
              </h1>
              <p className="text-xs text-slate-500">
                Manajemen Data Jemaat &amp; Inventaris Gereja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100"
            >
              Lihat Website
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-md cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* ============================================================ */}
        {/* BAGIAN 1: MANAJEMEN DATA JEMAAT                              */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900">
              1. Data Jemaat
            </h2>
            <p className="text-xs text-slate-500">
              Kelola daftar anggota jemaat GBI Samirono
            </p>
          </div>

          {jemaatErrorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <strong>Error Data Jemaat:</strong> {jemaatErrorMsg}
            </div>
          )}

          {/* Create / Edit Jemaat Form */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">
                {editingJemaatId
                  ? 'Edit Data Jemaat'
                  : 'Tambah Data Jemaat Baru'}
              </h3>
              {editingJemaatId && (
                <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  Mode Edit
                </span>
              )}
            </div>

            <form
              onSubmit={handleJemaatSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <div>
                <label
                  htmlFor="nama_lengkap"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  id="nama_lengkap"
                  name="nama_lengkap"
                  type="text"
                  required
                  value={jemaatForm.nama_lengkap}
                  onChange={handleJemaatChange}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggal_lahir"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Tanggal Lahir
                </label>
                <input
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  type="date"
                  required
                  value={jemaatForm.tanggal_lahir}
                  onChange={handleJemaatChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="alamat"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Alamat Tinggal
                </label>
                <input
                  id="alamat"
                  name="alamat"
                  type="text"
                  required
                  value={jemaatForm.alamat}
                  onChange={handleJemaatChange}
                  placeholder="Contoh: Ds. Samirono RT09/RW02"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="no_telp"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  No. HP / WhatsApp
                </label>
                <input
                  id="no_telp"
                  name="no_telp"
                  type="text"
                  required
                  value={jemaatForm.no_telp}
                  onChange={handleJemaatChange}
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="komsel"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Komsel / Kategorial
                </label>
                <select
                  id="komsel"
                  name="komsel"
                  required
                  value={jemaatForm.komsel}
                  onChange={handleJemaatChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {KOMSEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-5 flex items-center justify-end gap-2 pt-2">
                {editingJemaatId && (
                  <button
                    type="button"
                    onClick={handleCancelEditJemaat}
                    className="rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 text-sm cursor-pointer"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingJemaat}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-5 py-2 text-sm cursor-pointer"
                >
                  {submittingJemaat
                    ? 'Menyimpan...'
                    : editingJemaatId
                      ? 'Simpan Perubahan'
                      : 'Tambah Jemaat'}
                </button>
              </div>
            </form>
          </section>

          {/* Data Jemaat Table */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Daftar Jemaat ({jemaatList.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">Tanggal Lahir</th>
                    <th className="py-3 px-4">Alamat Tinggal</th>
                    <th className="py-3 px-4">No. HP / WhatsApp</th>
                    <th className="py-3 px-4">Komsel / Kategorial</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {loadingJemaat ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-slate-500"
                      >
                        Memuat data jemaat...
                      </td>
                    </tr>
                  ) : jemaatList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-slate-500"
                      >
                        Belum ada data jemaat. Silakan tambahkan melalui formulir
                        di atas.
                      </td>
                    </tr>
                  ) : (
                    jemaatList.map((item, index) => (
                      <tr
                        key={item.id}
                        className={
                          editingJemaatId === item.id
                            ? 'bg-amber-50/60'
                            : 'hover:bg-slate-50'
                        }
                      >
                        <td className="py-3 px-4 text-slate-500">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {item.nama_lengkap}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {formatTanggalLahir(item.tanggal_lahir)}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.alamat}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {item.no_telp}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.komsel ? (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                              {item.komsel}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEditJemaat(item)}
                            className="inline-flex items-center rounded-md border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteJemaat(item.id, item.nama_lengkap)
                            }
                            className="inline-flex items-center rounded-md border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* BAGIAN 2: MANAJEMEN DATA INVENTARIS GEREJA                   */}
        {/* ============================================================ */}
        <div id="section-inventaris" className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900">
              2. Data Inventaris Gereja
            </h2>
            <p className="text-xs text-slate-500">
              Kelola daftar barang, peralatan ibadah, dan aset gereja
            </p>
          </div>

          {inventarisErrorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 space-y-1">
              <div>
                <strong>Error Data Inventaris:</strong> {inventarisErrorMsg}
              </div>
              {inventarisErrorMsg.includes('inventaris') && (
                <p className="text-xs text-red-600">
                  Tip: Pastikan Anda sudah menjalankan query pembuatan tabel{' '}
                  <code>public.inventaris</code> di Supabase SQL Editor.
                </p>
              )}
            </div>
          )}

          {/* Create / Edit Inventaris Form */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">
                {editingInventarisId
                  ? 'Edit Barang Inventaris'
                  : 'Tambah Barang Inventaris Baru'}
              </h3>
              {editingInventarisId && (
                <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  Mode Edit
                </span>
              )}
            </div>

            <form
              onSubmit={handleInventarisSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div>
                <label
                  htmlFor="nama_barang"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Nama Barang
                </label>
                <input
                  id="nama_barang"
                  name="nama_barang"
                  type="text"
                  required
                  value={inventarisForm.nama_barang}
                  onChange={handleInventarisChange}
                  placeholder="Contoh: Mic Wireless Shure"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="kategori"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Kategori
                </label>
                <select
                  id="kategori"
                  name="kategori"
                  required
                  value={inventarisForm.kategori}
                  onChange={handleInventarisChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {KATEGORI_INVENTARIS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="jumlah"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Jumlah (Unit/Buah)
                </label>
                <input
                  id="jumlah"
                  name="jumlah"
                  type="number"
                  min="1"
                  required
                  value={inventarisForm.jumlah}
                  onChange={handleInventarisChange}
                  placeholder="1"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="kondisi"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Kondisi
                </label>
                <select
                  id="kondisi"
                  name="kondisi"
                  required
                  value={inventarisForm.kondisi}
                  onChange={handleInventarisChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {KONDISI_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-2 pt-2">
                {editingInventarisId && (
                  <button
                    type="button"
                    onClick={handleCancelEditInventaris}
                    className="rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 text-sm cursor-pointer"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingInventaris}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-5 py-2 text-sm cursor-pointer"
                >
                  {submittingInventaris
                    ? 'Menyimpan...'
                    : editingInventarisId
                      ? 'Simpan Perubahan'
                      : 'Tambah Inventaris'}
                </button>
              </div>
            </form>
          </section>

          {/* Data Inventaris Table */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Daftar Inventaris ({inventarisList.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Nama Barang</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Kondisi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {loadingInventaris ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-500"
                      >
                        Memuat data inventaris...
                      </td>
                    </tr>
                  ) : inventarisList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-500"
                      >
                        Belum ada data inventaris. Silakan tambahkan melalui
                        formulir di atas.
                      </td>
                    </tr>
                  ) : (
                    inventarisList.map((item, index) => (
                      <tr
                        key={item.id}
                        className={
                          editingInventarisId === item.id
                            ? 'bg-amber-50/60'
                            : 'hover:bg-slate-50'
                        }
                      >
                        <td className="py-3 px-4 text-slate-500">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {item.nama_barang}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.kategori}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium">
                          {item.jumlah} Unit
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border ${getKondisiBadgeClass(
                              item.kondisi
                            )}`}
                          >
                            {item.kondisi}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEditInventaris(item)}
                            className="inline-flex items-center rounded-md border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteInventaris(item.id, item.nama_barang)
                            }
                            className="inline-flex items-center rounded-md border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
