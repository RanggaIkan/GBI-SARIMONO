import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const emptyForm = {
  nama_lengkap: '',
  alamat: '',
  no_telp: '',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [jemaatList, setJemaatList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  // Fetch congregation data on mount
  useEffect(() => {
    let ignore = false

    async function loadInitialJemaat() {
      const { data, error } = await supabase
        .from('jemaat')
        .select('*')
        .order('created_at', { ascending: false })

      if (ignore) return
      if (error) {
        setErrorMsg(error.message)
      } else {
        setJemaatList(data || [])
      }
      setLoading(false)
    }

    loadInitialJemaat()
    return () => {
      ignore = true
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Create or Update congregation record
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)

    const payload = {
      nama_lengkap: formData.nama_lengkap.trim(),
      alamat: formData.alamat.trim(),
      no_telp: formData.no_telp.trim(),
    }

    if (editingId) {
      // UPDATE existing record
      const { data, error } = await supabase
        .from('jemaat')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()

      if (error) {
        setErrorMsg(error.message)
      } else if (data) {
        // Immediately update local state without page reload
        setJemaatList((prev) =>
          prev.map((item) => (item.id === editingId ? data : item))
        )
        setEditingId(null)
        setFormData(emptyForm)
      }
    } else {
      // CREATE new record
      const { data, error } = await supabase
        .from('jemaat')
        .insert([payload])
        .select()
        .single()

      if (error) {
        setErrorMsg(error.message)
      } else if (data) {
        // Immediately prepend new record to local state without page reload
        setJemaatList((prev) => [data, ...prev])
        setFormData(emptyForm)
      }
    }

    setSubmitting(false)
  }

  // Populate form for editing
  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      nama_lengkap: item.nama_lengkap || '',
      alamat: item.alamat || '',
      no_telp: item.no_telp || '',
    })
    setErrorMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setErrorMsg('')
  }

  // Delete record
  const handleDelete = async (id, nama) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data jemaat "${nama}"?`
    )
    if (!confirmed) return

    setErrorMsg('')
    const { error } = await supabase.from('jemaat').delete().eq('id', id)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    // Immediately remove deleted item from local state without page reload
    setJemaatList((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setFormData(emptyForm)
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-gbi.jpeg"
              alt="Logo GBI Samirono"
              className="h-10 w-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Dashboard Admin — GBI Samirono
              </h1>
              <p className="text-xs text-slate-500">Manajemen Data Jemaat</p>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {errorMsg && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {/* Create / Edit Form */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              {editingId ? 'Edit Data Jemaat' : 'Tambah Data Jemaat Baru'}
            </h2>
            {editingId && (
              <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                Mode Edit
              </span>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                value={formData.nama_lengkap}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="alamat"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Alamat
              </label>
              <input
                id="alamat"
                name="alamat"
                type="text"
                required
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Contoh: Ds. Samirono RT09/RW02"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="no_telp"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                No. Telepon
              </label>
              <input
                id="no_telp"
                name="no_telp"
                type="text"
                required
                value={formData.no_telp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 text-sm cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-5 py-2 text-sm cursor-pointer"
              >
                {submitting
                  ? 'Menyimpan...'
                  : editingId
                    ? 'Simpan Perubahan'
                    : 'Tambah Jemaat'}
              </button>
            </div>
          </form>
        </section>

        {/* Data Jemaat Table */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Daftar Jemaat ({jemaatList.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Alamat</th>
                  <th className="py-3 px-4">No. Telepon</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-500"
                    >
                      Memuat data jemaat...
                    </td>
                  </tr>
                ) : jemaatList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-500"
                    >
                      Belum ada data jemaat. Silakan tambahkan melalui formulir di atas.
                    </td>
                  </tr>
                ) : (
                  jemaatList.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        editingId === item.id
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
                      <td className="py-3 px-4 text-slate-600">
                        {item.alamat}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.no_telp}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center rounded-md border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.id, item.nama_lengkap)
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
      </main>
    </div>
  )
}
