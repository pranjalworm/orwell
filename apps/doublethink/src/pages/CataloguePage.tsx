import { Link } from "react-router";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { useQuery } from "@tanstack/react-query";

export default function CataloguePage() {
  const {
    isPending,
    error,
    data: books,
    isFetching,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/books");
      return (await response.json()).books;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="bg-surface min-h-screen">
      <NavBar />
      <div className="flex pt-[88px] min-h-screen">
        <SideBar />
        <main className="ml-64 flex-1">
          <div className="max-w-[1440px] mx-auto px-20 py-16">
            <header className="mb-16">
              <h1 className="font-serif text-5xl text-primary mb-4 leading-tight tracking-[-0.02em]">
                Orwell's Catalogue
              </h1>
              <p className="text-lg text-secondary max-w-2xl leading-relaxed">
                A curated selection of the world&apos;s most enduring literary
                works, presented for a focused and serene reading experience.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-16 gap-x-gutter">
              {books.map((book) => (
                <Link key={book.id} to={`/book/${book.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden bg-surface-container-high mb-6 cursor-pointer border border-[#EAEAEA] hover:scale-[1.02] transition-transform duration-300">
                    <img
                      alt={book.title}
                      className="w-full h-full object-cover"
                      src={book.cover}
                    />
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                  <h3 className="font-serif text-2xl text-primary mb-1 leading-snug font-medium">
                    {book.title}
                  </h3>
                  <p className="text-base text-secondary">{book.author}</p>
                </Link>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <button className="text-xs uppercase tracking-widest text-[#2C4356] border border-[#2C4356] px-12 py-4 hover:bg-[#2C4356] hover:text-white transition-all duration-300 font-semibold">
                Explore more titles
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
