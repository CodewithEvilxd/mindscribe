import PDFViewer from "./components/PDFViewer";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import DocumentationPage from "./pages/Documentation";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/workspace"
          element={
            <div className="max-w-[95%] border mx-auto">
              <PDFViewer />
            </div>
          }
        />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    </div>
  );
}

export default App;
