import { Link } from 'react-router-dom'

const CURRENT_YEAR = new Date().getFullYear()

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-gbi.jpeg"
              alt="Logo GBI Samirono"
              className="h-11 w-11 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                GBI Samirono
              </h1>
              <p className="text-xs text-slate-500">House of Worship</p>
            </div>
          </div>

          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero / Identity Card */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <img
              src="/logo-gbi.jpeg"
              alt="Logo Gereja Bethel Indonesia"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-contain border border-slate-200 bg-white p-1"
            />
            <img
              src="/logo-how.jpeg"
              alt="Logo House of Worship"
              className="h-20 sm:h-24 w-auto rounded-lg object-contain border border-slate-200 bg-white p-1"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            GBI Samirono
          </h2>
          <p className="mt-1 text-sm sm:text-base font-medium text-slate-600">
            Gereja Bethel Indonesia — House of Worship
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Ds. Samirono RT09/RW02 / Kec. Getasan, Kab. Semarang / 50774
          </p>
        </section>

        {/* Short Profile Placeholder */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Profil Gereja
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Selamat datang di situs resmi <strong>GBI Samirono (House of Worship)</strong>.
            Kami adalah komunitas orang percaya yang rindu bertumbuh bersama di dalam
            pengenalan akan Tuhan Yesus Kristus, saling mengasihi dalam persekutuan yang
            hangat, serta menjadi berkat bagi keluarga dan masyarakat di sekitar Desa
            Samirono, Kecamatan Getasan, Kabupaten Semarang.
          </p>
        </section>

        {/* Worship Schedule (Jadwal Ibadah) */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Jadwal Ibadah
          </h3>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img
              src="/jadwal-ibadah.jpeg"
              alt="Jadwal Ibadah GBI Samirono"
              className="w-full max-h-[520px] object-contain mx-auto"
            />
          </div>
        </section>

        {/* Address & Social Media */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Alamat Gereja
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ds. Samirono RT09/RW02 <br />
              Kec. Getasan, Kab. Semarang <br />
              Kode Pos 50774
            </p>
          </div>

          {/* Social Media Links Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              Media Sosial
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">Instagram (IG)</span>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Gbi Samirono
                </a>
              </li>
              <li className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="font-medium text-slate-500">YouTube (YT)</span>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  GBI Samirono - House of Worship
                </a>
              </li>
              <li className="flex items-center justify-between py-1.5">
                <span className="font-medium text-slate-500">Facebook (FB)</span>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Gbi Samirono
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500">
          &copy; {CURRENT_YEAR} GBI Samirono — House of Worship. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
