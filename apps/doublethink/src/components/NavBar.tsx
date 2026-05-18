import { Link } from "react-router";

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA] flex justify-center">
      <div className="flex justify-between items-center w-full px-24 py-6 mx-auto">
        <div className="flex items-center gap-12 flex-1">
          <Link
            to="/"
            className="font-serif text-2xl italic font-semibold text-[#2C4356]"
          >
            Orwell
          </Link>
          <div className="relative w-full flex items-center justify-center">
            <input
              className="w-full bg-transparent pl-8 p-2 text-sm placeholder:text-slate-400"
              placeholder="Search titles, authors, or ISBN..."
              type="text"
            />
            <span className="material-symbols-outlined text-slate-400">
              search
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-8 px-8">
          <Link
            to="/"
            className="text-[#2C4356] border-b-2 border-[#2C4356] pb-1 font-serif text-lg tracking-tight hover:text-[#2C4356] transition-colors duration-300"
          >
            Catalogue
          </Link>
          <Link
            to="/shelf"
            className="text-slate-400 font-serif text-lg tracking-tight hover:text-[#2C4356] transition-colors duration-300"
          >
            My Shelf
          </Link>
          <Link
            to="/reading-now"
            className="text-slate-400 font-serif text-lg tracking-tight hover:text-[#2C4356] transition-colors duration-300"
          >
            Reading Now
          </Link>
          <Link
            to="/reading-now"
            className="text-slate-400 font-serif text-lg tracking-tight hover:text-[#2C4356] transition-colors duration-300"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
