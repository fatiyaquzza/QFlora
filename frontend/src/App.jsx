import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import GeneralCategoriesPage from "./pages/GeneralCategoriesPage";
import SpecificPlantsPage from "./pages/SpecificPlantsPage";
import UserListPage from "./pages/UserListPage";
import DashboardPage from "./pages/DashboardPage";
import SuggestionsPage from "./pages/SuggestionPage";
import TaxonomyFormPage from "./pages/TaxonomyFormPage";
import AddSpecificPlantPage from "./pages/AddSpecificPlantPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/specific-plants"
            element={
              <PrivateRoute>
                <SpecificPlantsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-specific-plant"
            element={
              <PrivateRoute>
                <AddSpecificPlantPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/taxonomy"
            element={
              <PrivateRoute>
                <TaxonomyFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/general-categories"
            element={
              <PrivateRoute>
                <GeneralCategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <PrivateRoute>
                <SuggestionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserListPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
