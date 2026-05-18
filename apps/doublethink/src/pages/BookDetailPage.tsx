import { Link } from "react-router";
import NavBar from "../components/NavBar";

const relatedBooks = [
  {
    id: "ancient-paths",
    title: "The Ancient Paths",
    author: "Julian Barnes",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYA0q4bwglhY3gM8ciQBUyXlMQSQEDkctolh7_k1SrA92N_UCeoLz78J7TVvhghj1W8sNtCwmutloz9O0gBv0N3a6ecC1kebBhG4R7iabPzECxm18prYVlmGxzBeJJw4PuB2OcKTnSodHWYcUmXC0Pt6lO2qi3UyM8FmQdQ_I6ksmibUPO4NwqqJOvOHRDXBn5PRlPOBigIkbnaqRJUfvsnAZ8QqS1TSeFPmXeZxGINF0YMZJUHs6L6YywJXNUDdTzIGCUr5JwTb0x",
  },
  {
    id: "structural-silences",
    title: "Structural Silences",
    author: "Mira K. Shah",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjCeK08HbhyIYOz9rqbr212UUgVUqZgNtuIoMF7Audk1QJ9d2simb-7ZCAOp7QWDo_oA0RARc43L_aNj2zmSYFSyBzfwlE9GzpkjqKBBYqOVjuU15nEcLVXgsJ2SKg7H4pdbd5WUfLg3ckIIGD0Ygrebw7lZSVdknQif-LhuK6BTl59UbmJt1NM5JGD9mzMt8vxVn9Xty7A5_EYe6wQ0z3OUmMp5r5wpqNPYwZiDefO8dZvoO0niAar-gRsAaBo8obJJWztdToSJ1l",
  },
  {
    id: "observing-light",
    title: "Observing Light",
    author: "Thomas Helder",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ3hWX7mPk3Fo5jbYWGBKvlDJYMq3z89Oar8K1IEMB-M4LTUEnzwSz3sS3ajQvEiePTpPZC2KEybqBRVEF2IzKhaE7m8tGvWKKHl999kWiulWcOgSZ-MWGbX9YOpWIsCSgKiGMGrYiSwlvsGLQsULZnF1_6Pv-7GpGXSzO4X3bnUlvNF_zzszuvThOCSCox64-zNM63GVBt2WMLz30UJdRplxIPGy6gjktIGyxtOdl8vXS6ICiOMexk1SxxMTi5cx3xh5yosTOF77D",
  },
  {
    id: "winter-echoes",
    title: "Winter Echoes",
    author: "Elena Voss",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_3_1ZjkywMqCdIVnzTk0AgMyIyF4UC835_akeTouhSs3nC8zoAVDk0m2N1CmtU_gvyTxGcPMx-_N6Wcw3o5uobJee-yrpT7DPoBN-ns6bYVKnVQ1MN3YUXi0WmHDzkI6Wn3G_3h-D7mQzh0uEc0cHxyi3jp1AsoY27-1vdN3Tpie0hco50yenUviNy05rkUCJwwOs-hsSZbLlIt5yTSUdaDn0VNqlHt4O7YnW81ZGfCqrdIQT863GLhtsNf04qVggAvAvFKJ59LiP",
  },
];

const tags = ["Literary Fiction", "Philosophy", "2024"];

export default function BookDetailPage() {
  return (
    <div className="bg-surface min-h-screen">
      <NavBar />
      <main className="pt-32 pb-24 px-20 max-w-[1440px] mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 mb-12 text-slate-500 hover:text-primary transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="text-xs font-semibold uppercase tracking-widest">
            Back to Collection
          </span>
        </Link>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div
              className="aspect-[2/3] w-full bg-surface-container-high rounded-sm overflow-hidden hover:scale-[1.01] transition-transform duration-500"
              style={{ boxShadow: "15px 15px 30px rgba(0,0,0,0.1)" }}
            >
              <img
                alt="Book Cover"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQAWkhs9kDa2XFdZ1Ju5BLaObT7_xU7XUmxbs1Ptefu9juAHzC3ZY5tM1_pp0vOdbAmcXWxFdDaCXxCaUZVdoC0M2U8IrpFHR_cjpxudCcVl-0TCwkSqzLjlF31iCk464xDGSGn0ugLqel9gMsZg8S1le3jxk0RrlLqghMeEHmdM5NjenAAnNZc2x35h9mUiEgLunrQDctRcrASBPvJ_QdEW6wvO2lqZhPiDj6KWahNuKZWS8cta1PDJZPQOchvhg0Tb7R2KyrRPz0"
              />
            </div>
            <div className="flex gap-4 items-center justify-center py-4 border-y border-outline-variant/30">
              <div className="text-center px-6">
                <p className="text-[10px] uppercase text-slate-400 mb-1 font-semibold tracking-wider">
                  Format
                </p>
                <p className="text-primary font-medium text-sm">EPUB, PDF</p>
              </div>
              <div className="w-px h-8 bg-outline-variant/30" />
              <div className="text-center px-6">
                <p className="text-[10px] uppercase text-slate-400 mb-1 font-semibold tracking-wider">
                  Size
                </p>
                <p className="text-primary font-medium text-sm">2.4 MB</p>
              </div>
              <div className="w-px h-8 bg-outline-variant/30" />
              <div className="text-center px-6">
                <p className="text-[10px] uppercase text-slate-400 mb-1 font-semibold tracking-wider">
                  Language
                </p>
                <p className="text-primary font-medium text-sm">English</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 flex flex-col gap-lg">
            <section>
              <h1 className="font-serif text-5xl text-primary mb-2 leading-tight tracking-[-0.02em]">
                The Quiet Room
              </h1>
              <div className="flex items-center gap-2 mb-8">
                <p className="font-serif text-2xl text-on-surface-variant italic font-normal">
                  by Evelyn Thorne
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mb-10">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-surface-container text-on-surface-variant text-xs font-semibold uppercase tracking-wider rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="max-w-none">
                <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                  A profound exploration of silence and the architecture of the
                  human mind. Evelyn Thorne&apos;s latest novel takes us through
                  the corridors of a forgotten estate, where memories are the
                  only currency and time operates with its own fluid logic.
                </p>
                <p className="text-base text-slate-500 leading-relaxed">
                  Through meticulous prose and a delicate narrative structure,
                  &quot;The Quiet Room&quot; challenges the reader to find
                  meaning in the spaces between words. It is a testament to the
                  power of focus in an age of perpetual noise, designed for
                  those who seek sanctuary in the written word.
                </p>
              </div>
            </section>

            <section className="bg-white border border-[#EAEAEA] p-8 rounded-lg mt-4">
              <h2 className="font-serif text-2xl text-primary mb-6 flex items-center gap-3 font-medium">
                <span className="material-symbols-outlined text-primary-container">
                  auto_stories
                </span>
                Deliver to Device
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Send to Kindle
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input
                        className="w-full bg-surface border-outline-variant p-3 rounded focus:ring-primary-container focus:border-primary-container"
                        placeholder="username@kindle.com"
                        type="email"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                        tablet_mac
                      </span>
                    </div>
                    <button className="w-full bg-primary-container text-white text-xs py-4 uppercase tracking-widest hover:bg-primary transition-all active:scale-[0.98] font-semibold">
                      Deliver Now
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Send to Email
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <select className="w-full bg-surface border-outline-variant p-3 rounded appearance-none focus:ring-primary-container focus:border-primary-container">
                        <option value="primary">
                          personal.reading@email.com
                        </option>
                        <option value="work">professional@archive.org</option>
                        <option value="other">add new address...</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                    <button className="w-full border border-primary-container text-primary-container text-xs py-4 uppercase tracking-widest hover:bg-surface-container transition-all active:scale-[0.98] font-semibold">
                      Forward Copy
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-[11px] text-slate-400 italic text-center">
                Your ebook will be delivered in the preferred format
                automatically based on your device settings.
              </p>
            </section>
          </div>
        </div>

        <section className="mt-xl">
          <div className="flex justify-between items-end mb-12">
            <h3 className="font-serif text-3xl text-primary leading-snug">
              Related from the Archives
            </h3>
            <Link
              to="/"
              className="text-xs font-semibold text-primary underline underline-offset-4 uppercase tracking-wider"
            >
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {relatedBooks.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[2/3] bg-surface-container-high mb-4 overflow-hidden rounded-sm group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    alt={book.title}
                    className="w-full h-full object-cover"
                    src={book.cover}
                  />
                </div>
                <h4 className="font-serif text-[18px] text-primary group-hover:text-primary-container transition-colors font-medium">
                  {book.title}
                </h4>
                <p className="text-slate-400 text-sm">{book.author}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
