import { Link } from "react-router";

const collections = [
  { icon: "auto_stories", label: "Home", path: "/" },
  { icon: "menu_book", label: "Fiction", path: "/fiction" },
  { icon: "article", label: "Non-Fiction", path: "/non-fiction" },
  { icon: "pentagon", label: "Poetry", path: "/poetry" },
  { icon: "history_edu", label: "Essays", path: "/essays" },
];

const genres = ["Classics", "Sci-Fi", "Biography", "Philosophy"];

export default function SideBar() {
  return (
    <aside className="fixed left-0 top-[88px] h-[calc(100vh-88px)] w-64 bg-[#F9F9F9] border-r border-[#EAEAEA] overflow-y-auto">
      <div className="flex flex-col gap-4 p-8 h-full">
        <div className="mb-6">
          <h2 className="font-serif text-xl text-[#2C4356]">Collections</h2>
          <p className="text-xs tracking-wide uppercase font-medium text-slate-500 mt-1">
            Curated reading
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {collections.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                item.path === "/"
                  ? "bg-white text-[#2C4356] font-bold rounded-l-md translate-x-1"
                  : "text-slate-500 hover:bg-white hover:text-[#2C4356]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {item.icon}
              </span>
              <span className="text-sm tracking-wide uppercase">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-[#EAEAEA] pt-8">
          <p className="text-xs tracking-widest uppercase font-medium text-slate-400 mb-4">
            Genres
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                  genre === "Classics"
                    ? "bg-primary text-white"
                    : "bg-surface-container text-slate-500 hover:bg-primary-container hover:text-white"
                }`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
