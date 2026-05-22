const Footer = () => (
  <footer className="bg-white border-t border-gray-100 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <span>🧠</span>
          <span className="text-sm">OpenTokenHub — 探索 AI 的无限可能</span>
        </div>
        <div className="text-sm text-gray-400">© {new Date().getFullYear()} AI Tutorial Portal</div>
      </div>
    </div>
  </footer>
);

export default Footer;
