export default function Navbar({ dark, toggleDark, logout }) {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-indigo-600 dark:bg-gray-900 text-white">
      <h1 className="text-xl font-bold">📰 News Digest</h1>

      <div className="flex gap-3">
        <button
          onClick={toggleDark}
          className="px-4 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-300"
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={logout}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
