export function BrandPanel() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-10 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-brand-300 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-brand-400 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
          <svg
            viewBox="0 0 64 64"
            className="h-14 w-14 text-brand-100"
            fill="currentColor"
            aria-hidden
          >
            <path d="M16 24c0-6.627 5.373-12 12-12h8c6.627 0 12 5.373 12 12v2H16v-2zm-2 6h32v4c0 8.837-7.163 16-16 16S16 42.837 16 34v-4zm8 20h16v4H22v-4z" />
          </svg>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Bloom Coffee</h1>
        <p className="mt-3 max-w-sm text-lg text-brand-100">
          Fresh pours, thoughtful add-ons, and a menu you can manage in minutes.
        </p>
      </div>
    </div>
  );
}
