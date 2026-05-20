import { BrowserRouter, Routes, Route } from "react-router";
import CataloguePage from "./pages/CataloguePage";
import BookDetailPage from "./pages/BookDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CataloguePage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/shelf" element={<CataloguePage />} />
          <Route path="/reading-now" element={<CataloguePage />} />
          <Route path="/fiction" element={<CataloguePage />} />
          <Route path="/non-fiction" element={<CataloguePage />} />
          <Route path="/poetry" element={<CataloguePage />} />
          <Route path="/essays" element={<CataloguePage />} />
          <Route path="/history" element={<CataloguePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
