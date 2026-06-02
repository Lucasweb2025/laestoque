export default function PageContent({ children, narrow = false }) {
  return (
    <main className="flex-1 overflow-auto">
      <div
        className={`mx-auto px-6 py-8 sm:px-10 sm:py-10 ${
          narrow ? 'max-w-2xl' : 'max-w-[1400px]'
        }`}
      >
        {children}
      </div>
    </main>
  )
}
