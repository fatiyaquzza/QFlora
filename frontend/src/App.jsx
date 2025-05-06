import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GeneralCategoriesPage from "./pages/GeneralCategoriesPage";
import SpecificPlantsPage from "./pages/SpecificPlantsPage";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GeneralCategoriesPage />} />
        <Route path="/specific-plants" element={<SpecificPlantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
