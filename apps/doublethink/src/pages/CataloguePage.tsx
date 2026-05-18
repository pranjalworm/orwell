import { Link } from "react-router";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

const books = [
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSd4uDVYPeAXGUr7Pd4kf8_Zd8E3MvOjwn3TktFUEn9Y05s-3M5OjJsfG_Rs-BB91-8OCng9RfDB95Rcvj82bYYV9X6enU1OFlducnt7M7V34_UcLHOV9Rw1BBbTtNXFS3GUSBzGxKdWYkeFtHtEg68RSKcRbQDzltxCDqe-sCIpwqtkdCIw8Uj4CmkmznmkhgRioSUailjgr5xeuIV7bN94b1SL35Q6YueQinzcsBrQTXpVZpMl0D5j6y8fQ_S-SSfj8icRzw5m4f",
  },
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhsMbSIky_9vnrwHi1f3OyqidsdsOHJl3tc2KurWjVTJjV3NelDoii2U2ywKtBnmjmG73DQmkT5FdNrObKVUO8u7lVVVny1y7YWedhRoDmH7X42DfnnHVgnEo3kXFNN8NxsAcKOdegt0F05pwpvVrJIEHl_Tof5ZVs-bz7MesmxdhpImEGDaeOTIy2TJutJtFz30qVwbEipesWcWCWjPtPKg-rlkjJmFDGROGbyBT30G7hWAmZcP_UT43WbGGIBLW39io07haV4Tos",
  },
  {
    id: "to-the-lighthouse",
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNQQ2B7zc3HPjiMvayeTWI4j0jGs1YUPsQBYtECkWNOaHTWXBE6e9ZDyyWw3jIxshILeTopB3QP97wHmZ7dQVT7cinmNjaLbmy5bR754srpV3ClETb-P0g3YGGLiIkr0bmRntWoiugBYE1FDTCn7rlbbyAErM9ZSCNam54wQub8jLwrjiNU61Rzrb5FvXMh05xj7U4-pp7BF0ZU35mr6cuDg_g_yxxmRH3XdNTmxMXLdKY-BLenT6gqKGBNaP4KLLHCOz0e3mab4QR",
  },
  {
    id: "collected-poems",
    title: "Collected Poems",
    author: "W.B. Yeats",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD__1qCX0oP7iAeLE3CQIf_TA_yeUe5uR5RgtEvfwRloH2UWj_xeQs1SHYRshQNMI2GzsD9sBntdkHHGMs78DMismQTRk70E9FQ6_B5OFfCoy071f2ZZ-nbWHV5XZFdgsUk32QzO1My7-9eWXZZVtg5EP-vZNP0cz_lJajwazMgJtCoM8shVQ2Wj-8c0EdBahOWo3NUHhRJjnEdt7fHNVJBpGVIPKGuzz4radjvgGyO6l4Y5EWleOdFeeBU2Kye3YJmmQhNHBp32moF",
  },
  {
    id: "roman-empire",
    title: "The Roman Empire",
    author: "Edward Gibbon",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCodTkvReG81ZaznIdIaTT-g4vi35LCXT3n9J97UpFKy9HDytkgsszH8xCA8yuDFOFW0JrPQgEBHtBlMkN8nwpWxYCiaFRM5QdiXtAFNYj_m3KFy0h0M_lRypVSc9j00m1_JCsnOdvW_iHul9R6BmecW5410UkD6tx1KnUmif2HcMXf9f7LryVAXBDhuKOypm_eySD-ooS96HAhFt-s4H9CBELFZkp-OQcwtZWnPKAWj_j9s7UyGVyMg7r0MXkA8UDHdIwtJvDX67jh",
  },
  {
    id: "foundation",
    title: "Foundation",
    author: "Isaac Asimov",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATL1wkTD1ZVBBSEdRyzv660-NvBz522j9AtNLox8Va1HYX5oLnAOedroSVXbu-U_cOgXJlFhL68omfCio_alTqTbNrdximtAs-9B1kTU7tDVRsi3RhZV-OLBCm35eEfARm1n1KkiXKnylF8bCZpfqSLWxrgy67CRJoiLO9bg8QH5mLA3S1CBlyQ6KN-paluCVYRkTFy_HtsC0-zBnMlJMV9CAUT-KXLH07Ce6h7M7aOeM9IyEajnaklx_r0qigcyWjxTREPq9qWsuA",
  },
  {
    id: "lost-time",
    title: "In Search of Lost Time",
    author: "Marcel Proust",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5Gtyd023fXs5mDcLictSZGMlPj8_MZ_StFqbU-rxtht8uUjLILNiWYMt1h7pMC_0IcpokEWchww8GbJtHnch7m2GqHAklFYZVCTz0tGZMNs-L-V8k6oHpc3Dm1qSdZc5VJaGYZ8DVfJI4XwGi6_3C12CEKrhAgyQAe516XnrGrCiW7vOu5O9jCdIX5NnbZVVRv3wJmmiuyP30BaeT6v-XHKkbfONOgufv-nM6bJ5TXdTj9N4-PuUdAFEMFZ2q3jv8rP9FG3EtYocn",
  },
  {
    id: "essays",
    title: "Essays",
    author: "Michel de Montaigne",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrTA_a0gyPRKBTy6AhBxgcJvxvah0oMcneM_ujvGuWSzEfbZs4E7Ll1XeFOCVQxRO8Dz6-JChaFkMRO8-jjka4FkwogpsDkN0e9anhrhai9V8lNiMJJZhVRZ2RDqPTrBffZak72-6U2rnDmcmka0jRCnCdelb8PqVAM2J_k6gyLVjsPfCzE-TP0JXeH3pf9TukooXsYergijsAedUr1dAUFFWPzMFRt7-HqsVhsuNgZw1wIGwc7e7nDAzlcnhJR_u6cpmcMhsczNCi",
  },
  {
    id: "ulysses",
    title: "Ulysses",
    author: "James Joyce",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdafRS9nlVEkf3J3MS_8DAktUAC9nmNAni5FPJ1dmJfJaUb2kis96qt2k5a08i0zc-IYAbw4bZIZaGKKapnqGgfXW7oN6-F_uINlugtXX7-rtAyVZeRa3ADKl5YZgdyKm253jslvV8hmbCXoMNN6WFczDdnBuvVysaRn8mkJre-rC-_erpnEVQHchkOCMTwqXnCld311y7Wlvy22U0PTjZPa_tnIpscJadqSru6xJgt1GiUUG1IkSY3tKwAzsbuhJzcx_atjFaOCCE",
  },
  {
    id: "shakespeare",
    title: "Complete Works",
    author: "William Shakespeare",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfYpmnA2HKSla_CLc1uCgKg8RJMNoPOLZxGKDf-1kK61HRIxTSEbzM1X7seJrQxMFyw1Nl7ETYYKJ0RHBhwoCHHQ-zLkLj86bG1nNWiBU89HaBsB16JaPCGsvW_9TFlc2ScYB-oTgS4qqUTrLlXWdKYN0lavxNkadnYOn8_tm1p0LJw5oT3p-Pitnh0yp8e3moD4hWESE7l_qESdrQk5RPbeUZyL0ZiWOQDPp4_3drGjLbeZMUM1co1jpLHTkSANXzJOUc1Dhzfxc7",
  },
];

export default function CataloguePage() {
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
